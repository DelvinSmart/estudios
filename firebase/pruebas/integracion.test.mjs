import { listarPartes } from '../partes.mjs';
// Prueba de punta a punta, con los emuladores (nada toca el proyecto real):
// una persona crea su cuenta, falla una práctica, espera, la aprueba en el servidor
// y recién ahí puede prender el bombillo de esa parte.
// Correr:  cd firebase/pruebas && npm run integracion   (necesita Java y firebase/funciones/respuestas.json)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, serverTimestamp, terminate } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';

const PROYECTO = 'demo-mapa';
const ARCHIVO = new URL('../funciones/respuestas.json', import.meta.url);
const hay = existsSync(ARCHIVO);
const RESPUESTAS = hay ? JSON.parse(readFileSync(ARCHIVO, 'utf8')).practicas : {};

// El primer bombillo de un curso tiene que ser su PRIMERA parte (las partes se prenden en orden).
// Para probar el camino completo hace falta un curso cuya primera parte TENGA prácticas que se corrigen:
// se busca el primero que cumpla, en vez de fijar uno (Programación empieza con "Programar desde cero",
// cuya Parte 1 no tiene práctica, y antes la prueba se rompía por eso). Se toman TODAS las prácticas
// de esa parte (una parte puede tener varias).
const PARTES = listarPartes();
const corregibles = (parte) => Object.entries(RESPUESTAS)
  .filter(([, e]) => e.parte === parte && e.preguntas.some((p) => p.tipo !== 'escribe'))
  .sort(([a], [b]) => a.localeCompare(b, 'es', { numeric: true }));
const CURSO = Object.keys(PARTES).find((c) => corregibles(PARTES[c][0]).length > 0);
const PRACTICAS = CURSO ? corregibles(PARTES[CURSO][0]) : [];
const [ID, ENTRADA] = PRACTICAS[0] || [];
// Y un curso cuya primera parte NO tiene práctica: ese bombillo se prende sin aprobar nada.
const CURSO_SIN = Object.keys(PARTES).find((c) => PARTES[c].length && corregibles(PARTES[c][0]).length === 0);
const falta = !hay ? 'falta respuestas.json' : !ENTRADA && 'ningún curso empieza con una parte que tenga práctica';
const bien = (entrada = ENTRADA) => Object.fromEntries(entrada.preguntas.map((p, i) => [i, p.correcta]).filter(([, v]) => v !== undefined && v !== null));
const mal = () => { const r = bien(); const i = Object.keys(r)[0]; r[i] = typeof r[i] === 'number' ? (r[i] + 1) % 2 : (r[i] === 'V' ? 'F' : 'V'); return r; };

let app; let auth; let db; let corregir;
before(async () => {
  app = initializeApp({ projectId: PROYECTO, apiKey: 'falsa' });
  auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);
  const fn = getFunctions(app, 'us-central1'); connectFunctionsEmulator(fn, '127.0.0.1', 5001);
  corregir = httpsCallable(fn, 'corregirPractica');
});

// Cerrar la conexión con Firestore: si queda abierta, el programa nunca termina y la prueba se cuelga.
after(async () => { await terminate(db); await deleteApp(app); });

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

test('de punta a punta: fallar, esperar, aprobar en el servidor y recién ahí prender el bombillo', { skip: falta }, async () => {
  const u = await cuentaVerificada('carla.prueba@gmail.com');
  const progreso = doc(db, 'cursos', CURSO, 'progreso', u.uid);
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

  // 4. Todo bien: aprobada y guardada. Si la parte tiene más prácticas, todavía NO queda aprobada.
  const ok = (await corregir({ id: ID, respuestas: bien() })).data;
  assert.equal(ok.aprobada, true);
  assert.equal(ok.guardada, true);
  assert.ok(Array.isArray(ok.explicaciones));
  assert.equal(ok.parteAprobada, PRACTICAS.length === 1);
  if (PRACTICAS.length > 1) await assert.rejects(setDoc(progreso, bombillo));

  // 5. Las demás prácticas de la parte: la parte queda aprobada recién con la última.
  for (const [k, [id, entrada]] of PRACTICAS.slice(1).entries()) {
    const r = (await corregir({ id, respuestas: bien(entrada) })).data;
    assert.equal(r.aprobada, true);
    assert.equal(r.parteAprobada, k === PRACTICAS.length - 2);
  }

  // 6. Ahora sí se prende el bombillo.
  await setDoc(progreso, bombillo);
});

// Sin cuenta NO se corrige: el curso se lee entero sin cuenta, pero revisar respuestas pide una cuenta de Gmail
// verificada, así ningún robot sin cuenta llama a la función miles de veces (clase 124).
test('sin cuenta, la práctica no se corrige', { skip: falta }, async () => {
  await auth.signOut();
  await assert.rejects(corregir({ id: ID, respuestas: bien() }), (e) => e.code === 'functions/unauthenticated');
});

test('una práctica inventada da error', { skip: !hay && 'falta respuestas.json' }, async () => {
  await assert.rejects(corregir({ id: '99:FALSO.md:1:practica1', respuestas: {} }), (e) => e.code === 'functions/not-found');
});

test('una primera parte SIN práctica se prende sin aprobar nada', { skip: !CURSO_SIN && 'todos los cursos empiezan con práctica' }, async () => {
  const u = await cuentaVerificada('beto.prueba@gmail.com');
  const parte = PARTES[CURSO_SIN][0];
  const progreso = doc(db, 'cursos', CURSO_SIN, 'progreso', u.uid);
  await setDoc(progreso, { n: 1, inicio: serverTimestamp(), ultimo: serverTimestamp(), ultimaParte: parte, partes: { [parte]: serverTimestamp() } });
});
