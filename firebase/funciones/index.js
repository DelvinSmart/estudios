// Cloud Functions del Mapa de estudios (proyecto mapa-estudios-ds).
//
// corregirPractica: corrige una práctica con las respuestas PRIVADAS (respuestas.json, que no está en GitHub)
// y, si la persona tiene cuenta verificada, guarda la aprobación en cursos/{curso}/aprobadas/{uid}.
// Las reglas de Firestore solo dejan prender el bombillo de una parte con práctica si está ahí.
//
// enviarCorreoCuenta: manda los correos de la cuenta (verificar el correo y crear contraseña nueva)
// con el diseño del sitio, desde el Gmail del curso. El enlace del correo lleva directo
// a las pantallas del sitio (no a la página genérica de Firebase).
//
// Secretos (nunca en el código): GMAIL_USUARIO y GMAIL_CLAVE (contraseña de aplicación de Google).
//   firebase functions:secrets:set GMAIL_USUARIO
//   firebase functions:secrets:set GMAIL_CLAVE
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';
import { correoVerificar, correoContrasena, enlaceDelSitio } from './correos.js';
import { decidirPersona, decidirSitio } from './limites.js';
import { corregir, parteCompleta, puedeIntentar, cabeHoy, MAXIMO_ANONIMO_DIA, MAXIMO_CUENTA_DIA } from './corregir.js';

initializeApp();
const GMAIL_USUARIO = defineSecret('GMAIL_USUARIO');
const GMAIL_CLAVE = defineSecret('GMAIL_CLAVE');

const SITIO = 'https://delvinsmart.github.io/estudios/';
const ES_GMAIL = /^[^@\s]+@gmail\.com$/i;

// Límites contra el abuso (cada correo cuesta y molesta si se manda de más).
// Las reglas están en limites.js (sin Firebase, para poder probarlas solas).
const hoy = () => new Date().toISOString().slice(0, 10);
const huella = (t) => createHash('sha256').update(String(t).toLowerCase()).digest('hex').slice(0, 32);

// Lleva la cuenta de una persona (o correo) en Firestore. La colección es privada:
// las reglas no dejan que el navegador la lea ni la escriba. Devuelve true si se puede mandar.
async function permitirPersona(clave) {
  const db = getFirestore();
  const dia = hoy();
  const ref = db.doc(`limites_correo/${clave}`);
  return db.runTransaction(async (t) => {
    const foto = await t.get(ref);
    const decision = decidirPersona(foto.exists ? foto.data() : null, Date.now(), dia);
    if (decision.ok) t.set(ref, decision.guardar);
    return decision.ok;
  });
}

// El tope de todo el sitio por día, SEPARADO por tipo de correo: si alguien abusa de
// "olvidé mi contraseña", los correos de verificación siguen saliendo.
async function permitirSitio(tipo) {
  const db = getFirestore();
  const ref = db.doc(`limites_correo/sitio-${tipo}-${hoy()}`);
  return db.runTransaction(async (t) => {
    const foto = await t.get(ref);
    const ok = decidirSitio(tipo, foto.exists ? foto.data().cuenta : 0);
    if (ok) t.set(ref, { cuenta: FieldValue.increment(1) }, { merge: true });
    return ok;
  });
}

async function mandar(para, { asunto, html, texto }) {
  const usuario = GMAIL_USUARIO.value().trim();
  const transporte = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: usuario, pass: GMAIL_CLAVE.value().replace(/\s+/g, '') },
  });
  await transporte.sendMail({ from: `"Mapa de estudios" <${usuario}>`, to: para, subject: asunto, html, text: texto });
}

export const enviarCorreoCuenta = onCall(
  { secrets: [GMAIL_USUARIO, GMAIL_CLAVE], region: 'us-central1', maxInstances: 5 },
  async (request) => {
    const tipo = request.data?.tipo;

    if (tipo === 'verificar') {
      // Solo para la propia cuenta, con la sesión abierta.
      if (!request.auth) throw new HttpsError('unauthenticated', 'Entra con tu cuenta primero.');
      const usuario = await getAuth().getUser(request.auth.uid);
      if (usuario.emailVerified) return { ok: true, yaVerificado: true };
      if (!ES_GMAIL.test(usuario.email || '')) throw new HttpsError('failed-precondition', 'Solo correos de Gmail.');
      if (!(await permitirPersona(`uid-${usuario.uid}`))) throw new HttpsError('resource-exhausted', 'Espera un poco antes de pedir otro correo.');
      if (!(await permitirSitio('verificar'))) throw new HttpsError('resource-exhausted', 'Hoy se mandaron demasiados correos. Intenta mañana.');
      const enlace = await getAuth().generateEmailVerificationLink(usuario.email, { url: `${SITIO}#/entrar/listo` });
      await mandar(usuario.email, correoVerificar({ nombre: usuario.displayName, enlace: enlaceDelSitio(enlace, SITIO) }));
      return { ok: true };
    }

    if (tipo === 'contrasena') {
      const correo = String(request.data?.correo || '').trim().toLowerCase();
      if (!ES_GMAIL.test(correo)) throw new HttpsError('invalid-argument', 'Solo correos de Gmail.');
      // Siempre se responde lo mismo, exista o no la cuenta: así nadie averigua qué correos están registrados.
      if (!(await permitirPersona(`correo-${huella(correo)}`))) return { ok: true };
      try {
        // Si la cuenta no existe, esto falla y no se gasta nada del tope del sitio:
        // inventar miles de correos no sirve para bloquear a los demás.
        const enlace = await getAuth().generatePasswordResetLink(correo, { url: `${SITIO}#/entrar` });
        if (!(await permitirSitio('contrasena'))) return { ok: true };
        await mandar(correo, correoContrasena({ enlace: enlaceDelSitio(enlace, SITIO) }));
      } catch (e) {
        if (e?.code !== 'auth/user-not-found' && e?.code !== 'auth/email-not-found') console.error('contrasena', e?.code || e?.message);
      }
      return { ok: true };
    }

    throw new HttpsError('invalid-argument', 'Tipo de correo desconocido.');
  },
);

// ---------- corregir las prácticas en el servidor ----------

// Las respuestas privadas: se leen una vez, cuando arranca la función.
let RESPUESTAS = null;
function respuestas() {
  if (!RESPUESTAS) RESPUESTAS = JSON.parse(readFileSync(new URL('./respuestas.json', import.meta.url), 'utf8')).practicas;
  return RESPUESTAS;
}
const ID_PRACTICA = /^\d{2}:[\w.-]+\.md:\d{1,3}:practica\d{1,2}$/;

// La conexión de quien pregunta (para el tope de quien no tiene cuenta). El servidor de Google
// agrega la dirección real AL FINAL de x-forwarded-for, así que se usa la última.
function conexion(request) {
  const lista = String(request.rawRequest?.headers?.['x-forwarded-for'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return lista.at(-1) || request.rawRequest?.ip || 'desconocida';
}

export const corregirPractica = onCall({ region: 'us-central1', maxInstances: 10 }, async (request) => {
  const id = String(request.data?.id || '');
  const entrada = ID_PRACTICA.test(id) ? respuestas()[id] : undefined;
  if (!entrada) throw new HttpsError('not-found', 'No conozco esa práctica.');
  const db = getFirestore();
  const dia = hoy();
  const ahora = Date.now();
  const token = request.auth?.token;
  const conCuenta = Boolean(request.auth && token?.email_verified === true && ES_GMAIL.test(token?.email || ''));

  // Sin cuenta: se corrige igual (para estudiar), pero no se guarda nada y hay un tope por día.
  if (!conCuenta) {
    const ref = db.doc(`limites_practica/ip-${huella(conexion(request))}`);
    const cabe = await db.runTransaction(async (t) => {
      const foto = await t.get(ref);
      const d = cabeHoy(foto.exists ? foto.data() : null, dia, MAXIMO_ANONIMO_DIA);
      if (d.ok) t.set(ref, d.guardar);
      return d.ok;
    });
    if (!cabe) throw new HttpsError('resource-exhausted', 'Demasiados intentos por hoy desde esta conexión. Vuelve mañana.');
    return { ...corregir(entrada, request.data?.respuestas), guardada: false };
  }

  // Con cuenta: espera después de fallar, tope por día, y si aprueba, se guarda (con la hora del servidor).
  const uid = request.auth.uid;
  const refAprobadas = db.doc(`cursos/${entrada.curso}/aprobadas/${uid}`);
  const refTope = db.doc(`limites_practica/uid-${uid}`);
  return db.runTransaction(async (t) => {
    const [foto, tope] = await Promise.all([t.get(refAprobadas), t.get(refTope)]);
    const datos = foto.exists ? foto.data() : {};
    const espera = puedeIntentar(datos.fallos, id, ahora);
    if (!espera.ok) throw new HttpsError('resource-exhausted', `Espera ${espera.segundos} s antes de volver a intentar.`, { segundos: espera.segundos });
    const hoyCabe = cabeHoy(tope.exists ? tope.data() : null, dia, MAXIMO_CUENTA_DIA);
    if (!hoyCabe.ok) throw new HttpsError('resource-exhausted', 'Demasiados intentos por hoy. Vuelve mañana.');
    t.set(refTope, hoyCabe.guardar);

    const r = corregir(entrada, request.data?.respuestas);
    if (!r.aprobada) {
      t.set(refAprobadas, { fallos: { [id]: ahora } }, { merge: true });
      return { ...r, guardada: false };
    }
    const aprobadas = { ...(datos.practicas || {}), [id]: ahora };
    const cambios = { practicas: { [id]: FieldValue.serverTimestamp() } };
    const parteLista = parteCompleta(respuestas(), entrada.parte, aprobadas);
    if (parteLista) cambios.partes = { [entrada.parte]: FieldValue.serverTimestamp() };
    t.set(refAprobadas, cambios, { merge: true });
    return { ...r, guardada: true, parteAprobada: parteLista };
  });
});
