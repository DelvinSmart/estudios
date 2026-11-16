// La parte que habla con Firebase (proyecto mapa-estudios-ds).
//
// Para qué sirve: que el certificado se pueda VERIFICAR. El progreso del navegador
// (guardado.js) lo puede cambiar cualquiera desde la consola; el de Firebase no,
// porque las reglas (firebase/firestore.rules) solo aceptan un bombillo a la vez,
// de la lista oficial, con la hora del servidor y con una espera entre uno y otro.
//
// Esta configuración NO es secreta: toda app web de Firebase la lleva a la vista.
// Lo que protege los datos son las reglas, no esconder estos valores.
const CONFIG = {
  apiKey: 'AIzaSyCjQqwQEaV2B_LBEf5TMWzPGnIiDaTb_FI',
  authDomain: 'mapa-estudios-ds.firebaseapp.com',
  projectId: 'mapa-estudios-ds',
  storageBucket: 'mapa-estudios-ds.firebasestorage.app',
  messagingSenderId: '822754407981',
  appId: '1:822754407981:web:6fb527bdc9312d6979aaa4',
};
const SDK = 'https://www.gstatic.com/firebasejs/11.10.0/';
export const ESPERA_SEGUNDOS = 60; // igual que en firebase/generar-reglas.mjs
const FORMATO_CODIGO = /^ME-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/;

let cargando = null;
let progresoCache = null; // el último progreso leído de la nube

// Carga Firebase solo cuando hace falta (la primera vez que alguien lo usa).
function cargar() {
  if (!cargando) {
    cargando = (async () => {
      const [{ initializeApp }, A, F] = await Promise.all([
        import(`${SDK}firebase-app.js`),
        import(`${SDK}firebase-auth.js`),
        import(`${SDK}firebase-firestore.js`),
      ]);
      const app = initializeApp(CONFIG);
      const auth = A.getAuth(app);
      const db = F.getFirestore(app);
      // Esperar a saber si ya había una sesión abierta.
      await new Promise((listo) => { const parar = A.onAuthStateChanged(auth, () => { parar(); listo(); }); });
      return { A, F, auth, db };
    })();
    cargando.catch(() => { cargando = null; });
  }
  return cargando;
}

export async function usuario() {
  const { auth } = await cargar();
  return auth.currentUser;
}

export async function entrar() {
  const { A, auth } = await cargar();
  await A.signInWithPopup(auth, new A.GoogleAuthProvider());
  progresoCache = null;
  return auth.currentUser;
}

export async function salir() {
  const { A, auth } = await cargar();
  progresoCache = null;
  await A.signOut(auth);
}

// El progreso en la nube: { n, inicio, ultimo, partes: {id: fecha} } o null si aún no hay.
export async function leerProgresoNube() {
  const { F, auth, db } = await cargar();
  if (!auth.currentUser) return null;
  const foto = await F.getDoc(F.doc(db, 'progreso', auth.currentUser.uid));
  progresoCache = foto.exists() ? foto.data() : null;
  return progresoCache;
}

export function estaEnNube(id) {
  return Boolean(progresoCache?.partes?.[id]);
}

// Prende un bombillo en la nube.
// Devuelve { ok: true } o { ok: false, motivo: 'sin-sesion' | 'ya' | 'espera' | 'error', segundos }.
export async function prenderEnNube(id) {
  const { F, auth, db } = await cargar();
  if (!auth.currentUser) return { ok: false, motivo: 'sin-sesion' };
  const ref = F.doc(db, 'progreso', auth.currentUser.uid);
  const actual = progresoCache ?? (await leerProgresoNube());
  const ahora = F.serverTimestamp();
  try {
    if (!actual) {
      // El primer bombillo crea el documento.
      await F.setDoc(ref, { n: 1, inicio: ahora, ultimo: ahora, ultimaParte: id, partes: { [id]: ahora } });
    } else {
      if (actual.partes?.[id]) return { ok: false, motivo: 'ya' };
      const faltan = Math.ceil(ESPERA_SEGUNDOS - (Date.now() - actual.ultimo.toMillis()) / 1000);
      if (faltan > 0) return { ok: false, motivo: 'espera', segundos: faltan };
      // Ojo: el id lleva un punto ("CLASE-GUIADA.md"); con updateDoc('partes.id') se partiría en dos.
      // Por eso se usa setDoc con merge, que trata el id como una sola llave.
      await F.setDoc(ref, { n: actual.n + 1, ultimo: ahora, ultimaParte: id, partes: { [id]: ahora } }, { merge: true });
    }
    await leerProgresoNube();
    return { ok: true };
  } catch (e) {
    await leerProgresoNube().catch(() => {});
    if (estaEnNube(id)) return { ok: true };
    const espera = progresoCache ? Math.ceil(ESPERA_SEGUNDOS - (Date.now() - progresoCache.ultimo.toMillis()) / 1000) : 0;
    return espera > 0 ? { ok: false, motivo: 'espera', segundos: espera } : { ok: false, motivo: 'error' };
  }
}

// ---------- el certificado ----------

function codigoNuevo() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `ME-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

// El certificado ya emitido de quien tiene la sesión abierta: { codigo, ...datos } o null.
export async function miCertificado() {
  const { F, auth, db } = await cargar();
  if (!auth.currentUser) return null;
  const emitido = await F.getDoc(F.doc(db, 'emitidos', auth.currentUser.uid));
  if (!emitido.exists()) return null;
  return verificar(emitido.data().codigo);
}

// Emite el certificado. Las reglas lo rechazan si en la nube no están TODAS las partes.
export async function emitirCertificado(nombre, total) {
  const { F, auth, db } = await cargar();
  const uid = auth.currentUser.uid;
  const progreso = await leerProgresoNube();
  const codigo = codigoNuevo();
  const lote = F.writeBatch(db);
  lote.set(F.doc(db, 'certificados', codigo), {
    uid, nombre, emitido: F.serverTimestamp(), partes: total, inicio: progreso.inicio, fin: progreso.ultimo,
  });
  lote.set(F.doc(db, 'emitidos', uid), { codigo });
  await lote.commit();
  return codigo;
}

// Borra el propio certificado (para corregir el nombre y emitirlo de nuevo).
export async function borrarMiCertificado(codigo) {
  const { F, auth, db } = await cargar();
  const lote = F.writeBatch(db);
  lote.delete(F.doc(db, 'certificados', codigo));
  lote.delete(F.doc(db, 'emitidos', auth.currentUser.uid));
  await lote.commit();
}

// Cualquiera (sin sesión) puede comprobar un código.
export async function verificar(codigo) {
  if (!FORMATO_CODIGO.test(codigo)) return null;
  const { F, db } = await cargar();
  const foto = await F.getDoc(F.doc(db, 'certificados', codigo));
  if (!foto.exists()) return null;
  const d = foto.data();
  return { codigo, nombre: d.nombre, partes: d.partes, emitido: d.emitido.toDate(), inicio: d.inicio.toDate(), fin: d.fin.toDate() };
}
