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

initializeApp();
const GMAIL_USUARIO = defineSecret('GMAIL_USUARIO');
const GMAIL_CLAVE = defineSecret('GMAIL_CLAVE');

const SITIO = 'https://delvinsmart.github.io/estudios/';
const ES_GMAIL = /^[^@\s]+@gmail\.com$/i;

// Límites contra el abuso (cada correo cuesta y molesta si se manda de más):
const ESPERA_MS = 60 * 1000;   // uno por minuto para la misma cuenta o correo
const MAXIMO_DIA = 5;          // hasta 5 por día para la misma cuenta o correo
const MAXIMO_GLOBAL_DIA = 300; // tope de todo el sitio por día (Gmail permite ~500)

const hoy = () => new Date().toISOString().slice(0, 10);
const huella = (t) => createHash('sha256').update(String(t).toLowerCase()).digest('hex').slice(0, 32);

// Cuenta un envío en Firestore (colección privada: las reglas no dejan que el navegador la lea ni escriba).
// Devuelve true si se puede mandar, false si se pasó de algún límite.
async function permitir(clave) {
  const db = getFirestore();
  const dia = hoy();
  const refClave = db.doc(`limites_correo/${clave}`);
  const refGlobal = db.doc(`limites_correo/global-${dia}`);
  return db.runTransaction(async (t) => {
    const [c, g] = await Promise.all([t.get(refClave), t.get(refGlobal)]);
    const datos = c.exists ? c.data() : {};
    const deHoy = datos.dia === dia ? datos.cuenta || 0 : 0;
    if (datos.ultimo && Date.now() - datos.ultimo < ESPERA_MS) return false;
    if (deHoy >= MAXIMO_DIA) return false;
    if ((g.exists ? g.data().cuenta : 0) >= MAXIMO_GLOBAL_DIA) return false;
    t.set(refClave, { dia, cuenta: deHoy + 1, ultimo: Date.now() });
    t.set(refGlobal, { cuenta: FieldValue.increment(1) }, { merge: true });
    return true;
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
      if (!(await permitir(`uid-${usuario.uid}`))) throw new HttpsError('resource-exhausted', 'Espera un poco antes de pedir otro correo.');
      const enlace = await getAuth().generateEmailVerificationLink(usuario.email, { url: `${SITIO}#/entrar/listo` });
      await mandar(usuario.email, correoVerificar({ nombre: usuario.displayName, enlace: enlaceDelSitio(enlace, SITIO) }));
      return { ok: true };
    }

    if (tipo === 'contrasena') {
      const correo = String(request.data?.correo || '').trim().toLowerCase();
      if (!ES_GMAIL.test(correo)) throw new HttpsError('invalid-argument', 'Solo correos de Gmail.');
      // Siempre se responde lo mismo, exista o no la cuenta: así nadie averigua qué correos están registrados.
      if (!(await permitir(`correo-${huella(correo)}`))) return { ok: true };
      try {
        const enlace = await getAuth().generatePasswordResetLink(correo, { url: `${SITIO}#/entrar` });
        await mandar(correo, correoContrasena({ enlace: enlaceDelSitio(enlace, SITIO) }));
      } catch (e) {
        if (e?.code !== 'auth/user-not-found' && e?.code !== 'auth/email-not-found') console.error('contrasena', e?.code || e?.message);
      }
      return { ok: true };
    }

    throw new HttpsError('invalid-argument', 'Tipo de correo desconocido.');
  },
);
