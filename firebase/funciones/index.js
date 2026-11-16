// Cloud Functions del Mapa de estudios (proyecto mapa-estudios-ds).
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
import nodemailer from 'nodemailer';
import { correoVerificar, correoContrasena, enlaceDelSitio } from './correos.js';
import { decidirPersona, decidirSitio } from './limites.js';

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
