import { listarPartes } from '../partes.mjs';
// Prueba de punta a punta, con los emuladores (nada toca el proyecto real):
// una persona crea su cuenta, falla una práctica, espera, la aprueba en el servidor
// y recién ahí puede prender el bombillo de esa parte.
// Correr:  cd firebase/pruebas && npm run integracion   (necesita Java y firebase/funciones/respuestas.json)
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';

const PROYECTO = 'demo-mapa';
const ARCHIVO = new URL('../funciones/respuestas.json', import.meta.url);
const hay = existsSync(ARCHIVO);
const RESPUESTAS = hay ? JSON.parse(readFileSync(ARCHIVO, 'utf8')).practicas : {};

// Una práctica de programación que se corrige, única de su parte, y en la PRIMERA parte del curso
// (el primer bombillo de un curso tiene que ser su primera parte: las partes se prenden en orden).
const PRIMERA = listarPartes().programacion[0];
const [ID, ENTRADA] = Object.entries(RESPUESTAS).find(([, e]) => e.curso === 'programacion' && e.parte === PRIMERA
  && e.preguntas.some((p) => p.tipo !== 'escribe')
  && Object.values(RESPUESTAS).filter((o) => o.parte === e.parte).length === 1) || [];
const bien = () => Object.fromEntries(ENTRADA.preguntas.map((p, i) => [i, p.correcta]).filter(([, v]) => v !== undefined && v !== null));
const mal = () => { const r = bien(); const i = Object.keys(r)[0]; r[i] = typeof r[i] === 'number' ? (r[i] + 1) % 2 : (r[i] === 'V' ? 'F' : 'V'); return r; };

let app; let auth; let db; let corregir;
before(async () => {
  app = initializeApp({ projectId: PROYECTO, apiKey: 'falsa' });
  auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const fn = getFunctions(app, 'us-central1'); connectFunctionsEmulator(fn, '127.0.0.1', 5001);
  corregir = httpsCallable(fn, 'corregirPractica');
});

async function cuentaVerificada(correo) {
  const { user } = await createUserWithEmailAndPassword(auth, correo, 'clave-de-prueba-123');
  // El emulador deja marcar el correo como verificado con el usuario "owner".
  await fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/${PROYECTO}/accounts:update`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
    body: JSON.stringify({ localId: user.uid, emailVerified: true }),
  });
  await signInWithEmailAndPassword(auth, correo, 'clave-de-prueba-123');
  await auth.currentUser.getIdToken(true);
  return auth.currentUser;
}

test('de punta a punta: fallar, esperar, aprobar en el servidor y recién ahí prender el bombillo', { skip: !hay && 'falta respuestas.json' }, async () => {
  const u = await cuentaVerificada('carla.prueba@gmail.com');
  const progreso = doc(db, 'cursos', 'programacion', 'progreso', u.uid);
  const bombillo = { n: 1, inicio: serverTimestamp(), ultimo: serverTimestamp(), ultimaParte: ENTRADA.parte, partes: { [ENTRADA.parte]: serverTimestamp() } };

  // 1. Sin aprobar, el bombillo no se prende.
  await assert.rejects(setDoc(progreso, bombillo));

  // 2. Una respuesta mal: no aprueba y NO entrega ni la correcta ni la explicación.
  const fallo = (await corregir({ id: ID, respuestas: mal() })).data;
  assert.equal(fallo.aprobada, false);
  assert.equal(fallo.explicaciones, null);
  assert.equal(fallo.guardada, false);

  // 3. Volver a intentar enseguida: hay que esperar.
  await assert.rejects(corregir({ id: ID, respuestas: bien() }), (e) => e.code === 'functions/resource-exhausted');
  await new Promise((r) => setTimeout(r, 15500));

  // 4. Todo bien: aprobada, guardada en el servidor y la parte queda aprobada.
  const ok = (await corregir({ id: ID, respuestas: bien() })).data;
  assert.equal(ok.aprobada, true);
  assert.equal(ok.guardada, true);
  assert.equal(ok.parteAprobada, true);
  assert.ok(Array.isArray(ok.explicaciones));

  // 5. Ahora sí se prende el bombillo.
  await setDoc(progreso, bombillo);
});

test('sin cuenta, la práctica se corrige pero no se guarda nada', { skip: !hay && 'falta respuestas.json' }, async () => {
  await auth.signOut();
  const r = (await corregir({ id: ID, respuestas: bien() })).data;
  assert.equal(r.aprobada, true);
  assert.equal(r.guardada, false);
});

test('una práctica inventada da error', { skip: !hay && 'falta respuestas.json' }, async () => {
  await assert.rejects(corregir({ id: '99:FALSO.md:1:practica1', respuestas: {} }), (e) => e.code === 'functions/not-found');
});
