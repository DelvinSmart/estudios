// Pruebas de las reglas de Firestore: intentamos hacer trampa de todas las formas
// que se nos ocurren, y comprobamos que Firestore dice que no.
// Correr:  cd firebase/pruebas && npm install && npm test   (necesita Java)
import { test, before, after, beforeEach } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc, getDocs, deleteDoc, collection, writeBatch, serverTimestamp, Timestamp, deleteField } from 'firebase/firestore';
import { construirReglas } from '../generar-reglas.mjs';

const ESPERA = 2; // en las pruebas la espera es de 2 s para no tardar
const { texto, ids } = construirReglas(ESPERA);
const TOTAL = ids.length;
let env;
const dormir = (s) => new Promise((r) => setTimeout(r, s * 1000));

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-mapa', firestore: { rules: texto, host: '127.0.0.1', port: 8080 } });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

const db = (uid) => (uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore());
const primero = (parte = ids[0]) => ({ n: 1, inicio: serverTimestamp(), ultimo: serverTimestamp(), ultimaParte: parte, partes: { [parte]: serverTimestamp() } });
// Ojo: el id tiene un punto ("CLASE-GUIADA.md"), así que NO se puede usar updateDoc con 'partes.id'
// (el punto lo partiría en dos). Se usa setDoc con merge, igual que en la web.
const siguiente = (n, parte) => ({ n, ultimo: serverTimestamp(), ultimaParte: parte, partes: { [parte]: serverTimestamp() } });
const sumar = (d, datos) => setDoc(doc(d, 'progreso/ana'), datos, { merge: true });

// Pone el progreso directamente (sin reglas), para simular a alguien que ya terminó.
async function sembrar(uid, n) {
  const inicio = Timestamp.fromDate(new Date('2026-09-01T10:00:00Z'));
  const ultimo = Timestamp.fromDate(new Date('2026-11-10T18:00:00Z'));
  const partes = Object.fromEntries(ids.slice(0, n).map((i) => [i, ultimo]));
  await env.withSecurityRulesDisabled((c) => setDoc(doc(c.firestore(), 'progreso', uid), { n, inicio, ultimo, ultimaParte: ids[n - 1], partes }));
  return { inicio, ultimo };
}
function emitir(uid, codigo, extra = {}, datos) {
  const d = db(uid);
  const b = writeBatch(d);
  b.set(doc(d, 'certificados', codigo), { uid, nombre: 'Delvin José Rodríguez', emitido: serverTimestamp(), partes: TOTAL, ...datos, ...extra });
  b.set(doc(d, 'emitidos', uid), { codigo });
  return b.commit();
}

// ---------------- progreso ----------------
test('sin iniciar sesión no se puede prender nada', async () => {
  await assertFails(setDoc(doc(db(null), 'progreso/ana'), primero()));
});
test('el primer bombillo, bien hecho, se acepta', async () => {
  await assertSucceeds(setDoc(doc(db('ana'), 'progreso/ana'), primero()));
});
test('no se puede escribir en el progreso de otra persona', async () => {
  await assertFails(setDoc(doc(db('beto'), 'progreso/ana'), primero()));
});
test('no se puede leer el progreso de otra persona', async () => {
  await setDoc(doc(db('ana'), 'progreso/ana'), primero());
  await assertFails(getDoc(doc(db('beto'), 'progreso/ana')));
  await assertSucceeds(getDoc(doc(db('ana'), 'progreso/ana')));
});
test('una parte inventada no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), 'progreso/ana'), primero('99:FALSO.md:1')));
});
test('empezar con n = 229 no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), 'progreso/ana'), { ...primero(), n: TOTAL }));
});
test('una fecha inventada (no la del servidor) no vale', async () => {
  const viejo = Timestamp.fromDate(new Date('2025-01-01'));
  await assertFails(setDoc(doc(db('ana'), 'progreso/ana'), { ...primero(), inicio: viejo }));
  await assertFails(setDoc(doc(db('ana'), 'progreso/ana'), { ...primero(), partes: { [ids[0]]: viejo } }));
});
test('prender dos partes de una vez no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), 'progreso/ana'), { ...primero(), partes: { [ids[0]]: serverTimestamp(), [ids[1]]: serverTimestamp() } }));
});
test('campos de más (por ejemplo "aprobado: true") no valen', async () => {
  await assertFails(setDoc(doc(db('ana'), 'progreso/ana'), { ...primero(), aprobado: true }));
});
test('el segundo bombillo antes de la espera se rechaza; después, se acepta', async () => {
  const d = db('ana');
  await setDoc(doc(d, 'progreso/ana'), primero());
  await assertFails(sumar(d, siguiente(2, ids[1])));
  await dormir(ESPERA + 0.5);
  await assertSucceeds(sumar(d, siguiente(2, ids[1])));
});
test('saltar el contador (n de 1 a 5) no vale', async () => {
  const d = db('ana');
  await setDoc(doc(d, 'progreso/ana'), primero());
  await dormir(ESPERA + 0.5);
  await assertFails(sumar(d, siguiente(5, ids[1])));
});
test('repetir una parte ya prendida no suma', async () => {
  const d = db('ana');
  await setDoc(doc(d, 'progreso/ana'), primero());
  await dormir(ESPERA + 0.5);
  await assertFails(sumar(d, siguiente(2, ids[0])));
});
test('cambiar la fecha de inicio o borrar una parte no vale', async () => {
  const d = db('ana');
  await setDoc(doc(d, 'progreso/ana'), primero());
  await dormir(ESPERA + 0.5);
  await assertFails(sumar(d, { ...siguiente(2, ids[1]), inicio: Timestamp.fromDate(new Date('2025-01-01')) }));
  await assertFails(sumar(d, { ...siguiente(2, ids[1]), partes: { [ids[1]]: serverTimestamp(), [ids[0]]: deleteField() } }));
});
test('no se puede borrar el progreso', async () => {
  await setDoc(doc(db('ana'), 'progreso/ana'), primero());
  await assertFails(deleteDoc(doc(db('ana'), 'progreso/ana')));
});

// ---------------- certificado ----------------
const COD = 'ME-1A2B-3C4D-5E6F';
test('sin las 229 partes no se emite el certificado', async () => {
  const fechas = await sembrar('ana', TOTAL - 1);
  await assertFails(emitir('ana', COD, {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
});
test('con las 229 partes sí se emite, y cualquiera lo puede verificar', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await assertSucceeds(emitir('ana', COD, {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
  await assertSucceeds(getDoc(doc(db(null), 'certificados', COD)));
});
test('nadie puede listar todos los certificados', async () => {
  await assertFails(getDocs(collection(db(null), 'certificados')));
  await assertFails(getDocs(collection(db('ana'), 'certificados')));
});
test('fechas de estudio inventadas no valen', async () => {
  const fechas = await sembrar('ana', TOTAL);
  const falsa = Timestamp.fromDate(new Date('2025-01-01'));
  await assertFails(emitir('ana', COD, {}, { inicio: falsa, fin: fechas.ultimo }));
});
test('emitirlo a nombre de otra cuenta no vale', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await assertFails(emitir('ana', COD, { uid: 'beto' }, { inicio: fechas.inicio, fin: fechas.ultimo }));
});
test('un código con otro formato no vale', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await assertFails(emitir('ana', 'HOLA-MUNDO', {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
});
test('el certificado solo sin el registro de "emitidos" no vale', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await assertFails(setDoc(doc(db('ana'), 'certificados', COD), { uid: 'ana', nombre: 'Ana Pérez', emitido: serverTimestamp(), partes: TOTAL, inicio: fechas.inicio, fin: fechas.ultimo }));
});
test('no se puede tener dos certificados, ni cambiar el nombre después', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await emitir('ana', COD, {}, { inicio: fechas.inicio, fin: fechas.ultimo });
  await assertFails(emitir('ana', 'ME-AAAA-BBBB-CCCC', {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
  await assertFails(updateDoc(doc(db('ana'), 'certificados', COD), { nombre: 'Otro Nombre' }));
});
test('otra persona no puede robar ni borrar un certificado ajeno', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await emitir('ana', COD, {}, { inicio: fechas.inicio, fin: fechas.ultimo });
  await assertFails(deleteDoc(doc(db('beto'), 'certificados', COD)));
  const d = db('beto');
  const b = writeBatch(d);
  b.set(doc(d, 'emitidos', 'beto'), { codigo: COD });
  await assertFails(b.commit());
});
test('la dueña puede borrar el suyo (para corregir el nombre) y volver a emitirlo', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await emitir('ana', COD, {}, { inicio: fechas.inicio, fin: fechas.ultimo });
  const d = db('ana');
  const b = writeBatch(d);
  b.delete(doc(d, 'certificados', COD));
  b.delete(doc(d, 'emitidos', 'ana'));
  await assertSucceeds(b.commit());
  await assertSucceeds(emitir('ana', 'ME-AAAA-BBBB-CCCC', {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
});
