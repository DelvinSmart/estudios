// La parte que habla con Firebase (proyecto mapa-estudios-ds).
//
// Para qué sirve: que el certificado se pueda VERIFICAR. El progreso del navegador
// (guardado.js) lo puede cambiar cualquiera desde la consola; el de Firebase no,
// porque las reglas (firebase/firestore.rules) solo aceptan cuentas de Gmail verificadas,
// un bombillo a la vez, de la lista oficial, con la hora del servidor y con espera entre uno y otro.
//
// Esta configuración NO es secreta: toda app web de Firebase la lleva a la vista.
// Lo que protege los datos son las reglas, no esconder estos valores.
import { CURSOS } from './cursos.js';

const CONFIG = {
  apiKey: 'AIzaSyCjQqwQEaV2B_LBEf5TMWzPGnIiDaTb_FI',
  authDomain: 'mapa-estudios-ds.firebaseapp.com',
  projectId: 'mapa-estudios-ds',
  storageBucket: 'mapa-estudios-ds.firebasestorage.app',
  messagingSenderId: '822754407981',
  appId: '1:822754407981:web:6fb527bdc9312d6979aaa4',
};
const SDK = 'https://www.gstatic.com/firebasejs/11.10.0/';
// App Check con Fraud Defense (reCAPTCHA Enterprise): le prueba a Firebase que la visita viene
// del sitio de verdad, no de un programa que copió esta configuración pública. La clave del SITIO
// es pública (va aquí a la vista). Por ahora el sitio MANDA el token, pero los servidores todavía
// NO lo EXIGEN (modo "mirar"): se observa una semana en la consola y después se activa "Aplicar"
// (poner enforceAppCheck en las funciones y "Enforce" en Firestore). Ver PENDIENTES.md.
const APP_CHECK_SITE_KEY = '6LcFJCkuAAAAAADv4IRGw0PI5DuE6SsQcStzIQ3W';
export const ESPERA_SEGUNDOS = 60; // igual que en firebase/generar-reglas.mjs
// Los prefijos salen de cursos.js (una sola fuente de verdad): un curso nuevo no se puede olvidar aquí.
const FORMATO_CODIGO = new RegExp(`^(${Object.values(CURSOS).map((c) => c.prefijo).join('|')})-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$`);
const ES_GMAIL = /^[^@\s]+@gmail\.com$/i;

let cargando = null;
const progresoCache = {}; // { curso: datos } — el último progreso leído de la nube
const oyentes = new Set();

// Carga Firebase solo cuando hace falta (la primera vez que alguien lo usa).
function cargar() {
  if (!cargando) {
    cargando = (async () => {
      const [{ initializeApp }, A, F, Fn, AC] = await Promise.all([
        import(`${SDK}firebase-app.js`),
        import(`${SDK}firebase-auth.js`),
        import(`${SDK}firebase-firestore.js`),
        import(`${SDK}firebase-functions.js`),
        import(`${SDK}firebase-app-check.js`),
      ]);
      const app = initializeApp(CONFIG);
      // App Check (Fraud Defense / reCAPTCHA Enterprise): empieza a mandar el token con cada llamada.
      // Si algo falla al armarlo (dominio no registrado, etc.), no se cae la app: sigue sin App Check.
      try {
        AC.initializeAppCheck(app, {
          provider: new AC.ReCaptchaEnterpriseProvider(APP_CHECK_SITE_KEY),
          isTokenAutoRefreshEnabled: true,
        });
      } catch (e) { /* sin App Check: la app sigue funcionando */ }
      const auth = A.getAuth(app);
      auth.languageCode = 'es'; // los correos (verificar, recuperar contraseña) llegan en español
      const db = F.getFirestore(app);
      // La función que manda los correos con el diseño del sitio (firebase/funciones/index.js).
      const funciones = Fn.getFunctions(app, 'us-central1');
      const enviarCorreo = Fn.httpsCallable(funciones, 'enviarCorreoCuenta');
      // La que corrige las prácticas con las respuestas privadas (firebase/funciones/index.js).
      const corregir = Fn.httpsCallable(funciones, 'corregirPractica');
      // Esperar a saber si ya había una sesión abierta; después, avisar de cada cambio.
      await new Promise((listo) => { const parar = A.onAuthStateChanged(auth, () => { parar(); listo(); }); });
      A.onAuthStateChanged(auth, (u) => { for (const k in progresoCache) delete progresoCache[k]; oyentes.forEach((f) => f(u)); });
      return { A, F, auth, db, enviarCorreo, corregir };
    })();
    cargando.catch(() => { cargando = null; });
  }
  return cargando;
}

// ---------- la sesión ----------

export function esGmail(correo) {
  return ES_GMAIL.test(String(correo || '').trim());
}

export async function usuario() {
  const { auth } = await cargar();
  return auth.currentUser;
}

// Lista para usar la nube: sesión abierta, correo de Gmail y verificado.
export function cuentaLista(u) {
  return Boolean(u && u.emailVerified && esGmail(u.email));
}

export function alCambiarSesion(funcion) {
  oyentes.add(funcion);
  cargar().then(({ auth }) => funcion(auth.currentUser)).catch(() => funcion(null));
}

// A dónde vuelve la persona cuando toca el enlace del correo.
function volverA(ruta) {
  return { url: `${location.origin}${location.pathname}#${ruta}` };
}

export async function entrarConCorreo(correo, contrasena) {
  const { A, auth } = await cargar();
  const r = await A.signInWithEmailAndPassword(auth, correo.trim(), contrasena);
  return r.user;
}

export async function crearCuenta(nombre, correo, contrasena) {
  const { A, auth } = await cargar();
  if (!esGmail(correo)) throw Object.assign(new Error('solo gmail'), { code: 'propio/no-gmail' });
  const r = await A.createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
  await A.updateProfile(r.user, { displayName: nombre });
  await mandarVerificacion();
  return r.user;
}

export async function entrarConGoogle() {
  const { A, auth } = await cargar();
  const proveedor = new A.GoogleAuthProvider();
  proveedor.setCustomParameters({ prompt: 'select_account' });
  const r = await A.signInWithPopup(auth, proveedor);
  if (!esGmail(r.user.email)) {
    await A.signOut(auth);
    throw Object.assign(new Error('solo gmail'), { code: 'propio/no-gmail' });
  }
  return r.user;
}

// El correo de verificación sale de nuestra función (con el diseño del sitio).
// Si la función no responde, se usa el correo simple de Firebase para no dejar a nadie trabado.
async function mandarVerificacion() {
  const { A, auth, enviarCorreo } = await cargar();
  try {
    await enviarCorreo({ tipo: 'verificar' });
  } catch (e) {
    // Si el que se acabó es el tope de ESTA persona o conexión, hay que esperar.
    // Si se acabó el tope de todo el sitio (motivo "sitio"), se usa el correo simple de Firebase.
    if (e?.code === 'functions/resource-exhausted' && e?.details?.motivo !== 'sitio') throw Object.assign(new Error('espera'), { code: 'auth/too-many-requests' });
    await A.sendEmailVerification(auth.currentUser, volverA('/entrar/listo'));
  }
}

export async function reenviarVerificacion() {
  await mandarVerificacion();
}

// Después de tocar el enlace del correo: recarga la cuenta y pide un "pase" nuevo,
// porque las reglas leen email_verified del pase (token), no de la pantalla.
export async function refrescarCuenta() {
  const { auth } = await cargar();
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  await auth.currentUser.getIdToken(true);
  return auth.currentUser;
}

// Siempre responde igual, exista o no la cuenta: así nadie puede usar esta pantalla
// para averiguar qué correos están registrados.
export async function recuperarContrasena(correo) {
  const { A, auth, enviarCorreo } = await cargar();
  try {
    await enviarCorreo({ tipo: 'contrasena', correo: correo.trim() });
    return;
  } catch (e) {
    if (e?.code === 'functions/invalid-argument') throw Object.assign(new Error('correo'), { code: 'auth/invalid-email' });
    // Si la función no responde, se usa el correo simple de Firebase.
  }
  try { await A.sendPasswordResetEmail(auth, correo.trim(), volverA('/entrar')); } catch (e) {
    if (e.code === 'auth/invalid-email' || e.code === 'auth/too-many-requests' || e.code === 'auth/network-request-failed') throw e;
  }
}

// Los enlaces que llegan por correo (cuando la URL de acción apunta a este sitio).
export async function revisarEnlace(codigo) {
  const { A, auth } = await cargar();
  return A.checkActionCode(auth, codigo);
}
export async function cambiarContrasenaConEnlace(codigo, nueva) {
  const { A, auth } = await cargar();
  await A.confirmPasswordReset(auth, codigo, nueva);
}
export async function confirmarCorreoConEnlace(codigo) {
  const { A, auth } = await cargar();
  await A.applyActionCode(auth, codigo);
  if (auth.currentUser) await refrescarCuenta();
}

export async function cambiarNombre(nombre) {
  const { A, auth } = await cargar();
  await A.updateProfile(auth.currentUser, { displayName: nombre });
}

export async function salir() {
  const { A, auth } = await cargar();
  await A.signOut(auth);
}

// ---------- el progreso, por curso: cursos/{curso}/progreso/{uid} ----------

export async function leerProgresoNube(curso) {
  const { F, auth, db } = await cargar();
  if (!cuentaLista(auth.currentUser)) return null;
  const foto = await F.getDoc(F.doc(db, 'cursos', curso, 'progreso', auth.currentUser.uid));
  progresoCache[curso] = foto.exists() ? foto.data() : null;
  return progresoCache[curso];
}

export function estaEnNube(curso, id) {
  return Boolean(progresoCache[curso]?.partes?.[id]);
}

// Prende un bombillo en la nube.
// Devuelve { ok: true } o { ok: false, motivo: 'sin-sesion' | 'sin-verificar' | 'ya' | 'espera' | 'error', segundos }.
export async function prenderEnNube(curso, id) {
  const { F, auth, db } = await cargar();
  if (!auth.currentUser) return { ok: false, motivo: 'sin-sesion' };
  if (!cuentaLista(auth.currentUser)) return { ok: false, motivo: 'sin-verificar' };
  const ref = F.doc(db, 'cursos', curso, 'progreso', auth.currentUser.uid);
  const actual = progresoCache[curso] ?? (await leerProgresoNube(curso));
  const ahora = F.serverTimestamp();
  const faltan = (p) => Math.ceil(ESPERA_SEGUNDOS - (Date.now() - p.ultimo.toMillis()) / 1000);
  try {
    if (!actual) {
      // El primer bombillo crea el documento.
      await F.setDoc(ref, { n: 1, inicio: ahora, ultimo: ahora, ultimaParte: id, partes: { [id]: ahora } });
    } else {
      if (actual.partes?.[id]) return { ok: false, motivo: 'ya' };
      if (faltan(actual) > 0) return { ok: false, motivo: 'espera', segundos: faltan(actual) };
      // Ojo: el id lleva un punto ("CLASE-GUIADA.md"); con updateDoc('partes.id') se partiría en dos.
      // Por eso se usa setDoc con merge, que trata el id como una sola llave.
      await F.setDoc(ref, { n: actual.n + 1, ultimo: ahora, ultimaParte: id, partes: { [id]: ahora } }, { merge: true });
    }
    await leerProgresoNube(curso);
    return { ok: true };
  } catch (e) {
    await leerProgresoNube(curso).catch(() => {});
    if (estaEnNube(curso, id)) return { ok: true };
    const p = progresoCache[curso];
    return p && faltan(p) > 0 ? { ok: false, motivo: 'espera', segundos: faltan(p) } : { ok: false, motivo: 'error' };
  }
}

// ---------- el certificado ----------

function codigoNuevo(prefijo) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `${prefijo}-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

// El certificado ya emitido de ese curso, de quien tiene la sesión abierta, o null.
export async function miCertificado(curso) {
  const { F, auth, db } = await cargar();
  if (!cuentaLista(auth.currentUser)) return null;
  const emitido = await F.getDoc(F.doc(db, 'cursos', curso, 'emitidos', auth.currentUser.uid));
  if (!emitido.exists()) return null;
  return verificar(emitido.data().codigo);
}

// Emite el certificado. Las reglas lo rechazan si en la nube no están TODAS las partes del curso.
export async function emitirCertificado(curso, prefijo, nombre, total) {
  const { F, auth, db } = await cargar();
  const uid = auth.currentUser.uid;
  const progreso = await leerProgresoNube(curso);
  const codigo = codigoNuevo(prefijo);
  const lote = F.writeBatch(db);
  lote.set(F.doc(db, 'certificados', codigo), {
    uid, curso, nombre, emitido: F.serverTimestamp(), partes: total, inicio: progreso.inicio, fin: progreso.ultimo,
  });
  lote.set(F.doc(db, 'cursos', curso, 'emitidos', uid), { codigo });
  await lote.commit();
  return codigo;
}

// Borra el propio certificado (para corregir el nombre y emitirlo de nuevo).
export async function borrarMiCertificado(curso, codigo) {
  const { F, auth, db } = await cargar();
  const lote = F.writeBatch(db);
  lote.delete(F.doc(db, 'certificados', codigo));
  lote.delete(F.doc(db, 'cursos', curso, 'emitidos', auth.currentUser.uid));
  await lote.commit();
}

// Cualquiera (sin sesión) puede comprobar un código.
export async function verificar(codigo) {
  if (!FORMATO_CODIGO.test(codigo)) return null;
  const { F, db } = await cargar();
  const foto = await F.getDoc(F.doc(db, 'certificados', codigo));
  if (!foto.exists()) return null;
  const d = foto.data();
  return { codigo, curso: d.curso, nombre: d.nombre, partes: d.partes, emitido: d.emitido.toDate(), inicio: d.inicio.toDate(), fin: d.fin.toDate() };
}

// ---------- las prácticas: las corrige el servidor ----------

// Manda las respuestas de una práctica y devuelve { aprobada, resultados, explicaciones, guardada }.
// respuestas: { índice de la pregunta: 'V' | 'F' | número de opción }.
// Si hay sesión con correo verificado, el servidor también guarda la aprobación (para la nube).
export async function corregirPractica(id, respuestas) {
  const { corregir } = await cargar();
  const r = await corregir({ id, respuestas });
  return r.data;
}

// ¿El servidor ya aprobó la práctica de esta parte? (para explicar por qué un bombillo no sube a la nube)
export async function parteAprobadaEnNube(curso, parte) {
  const { F, auth, db } = await cargar();
  if (!cuentaLista(auth.currentUser)) return false;
  const foto = await F.getDoc(F.doc(db, 'cursos', curso, 'aprobadas', auth.currentUser.uid));
  return Boolean(foto.exists() && foto.data().partes?.[parte]);
}
