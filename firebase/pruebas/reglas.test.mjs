// Pruebas de las reglas de Firestore: intentamos hacer trampa de todas las formas
// que se nos ocurren, y comprobamos que Firestore dice que no.
// Correr:  cd firebase/pruebas && npm install && npm test   (necesita Java)
import { test, before, after, beforeEach } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, setDoc, updateDoc, getDoc, getDocs, deleteDoc, collection, writeBatch, serverTimestamp, Timestamp, deleteField } from 'firebase/firestore';
import { construirReglas } from '../generar-reglas.mjs';

const ESPERA = 2; // en las pruebas la espera es de 2 s para no tardar
const { texto, porCurso } = construirReglas(ESPERA);
const ids = porCurso.programacion;
const TOTAL = ids.length;
const RUTA = (uid = 'ana', curso = 'programacion') => `cursos/${curso}/progreso/${uid}`;
let env;
const dormir = (s) => new Promise((r) => setTimeout(r, s * 1000));

before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-mapa', firestore: { rules: texto, host: '127.0.0.1', port: 8080 } });
});
after(async () => { await env.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

// Por defecto: cuenta de Gmail con el correo verificado (lo que piden las reglas).
const db = (uid, token = { email: `${uid}@gmail.com`, email_verified: true }) =>
  (uid ? env.authenticatedContext(uid, token).firestore() : env.unauthenticatedContext().firestore());
const primero = (parte = ids[0]) => ({ n: 1, inicio: serverTimestamp(), ultimo: serverTimestamp(), ultimaParte: parte, partes: { [parte]: serverTimestamp() } });
// Ojo: el id tiene un punto ("CLASE-GUIADA.md"), así que NO se puede usar updateDoc con 'partes.id'
// (el punto lo partiría en dos). Se usa setDoc con merge, igual que en la web.
const siguiente = (n, parte) => ({ n, ultimo: serverTimestamp(), ultimaParte: parte, partes: { [parte]: serverTimestamp() } });
const sumar = (d, datos) => setDoc(doc(d, RUTA()), datos, { merge: true });

// Pone el progreso directamente (sin reglas), para simular a alguien que ya terminó.
async function sembrar(uid, n) {
  const inicio = Timestamp.fromDate(new Date('2026-09-01T10:00:00Z'));
  const ultimo = Timestamp.fromDate(new Date('2026-11-10T18:00:00Z'));
  const partes = Object.fromEntries(ids.slice(0, n).map((i) => [i, ultimo]));
  await env.withSecurityRulesDisabled((c) => setDoc(doc(c.firestore(), RUTA(uid)), { n, inicio, ultimo, ultimaParte: ids[n - 1], partes }));
  return { inicio, ultimo };
}
function emitir(uid, codigo, extra = {}, datos) {
  const d = db(uid);
  const b = writeBatch(d);
  b.set(doc(d, 'certificados', codigo), { uid, curso: 'programacion', nombre: 'Delvin José Rodríguez', emitido: serverTimestamp(), partes: TOTAL, ...datos, ...extra });
  b.set(doc(d, 'cursos/programacion/emitidos', uid), { codigo });
  return b.commit();
}

// ---------------- progreso ----------------
test('sin iniciar sesión no se puede prender nada', async () => {
  await assertFails(setDoc(doc(db(null), RUTA()), primero()));
});
test('el primer bombillo, bien hecho, se acepta', async () => {
  await assertSucceeds(setDoc(doc(db('ana'), RUTA()), primero()));
});
test('no se puede escribir en el progreso de otra persona', async () => {
  await assertFails(setDoc(doc(db('beto'), RUTA()), primero()));
});
test('no se puede leer el progreso de otra persona', async () => {
  await setDoc(doc(db('ana'), RUTA()), primero());
  await assertFails(getDoc(doc(db('beto'), RUTA())));
  await assertSucceeds(getDoc(doc(db('ana'), RUTA())));
});
test('una parte inventada no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA()), primero('99:FALSO.md:1')));
});
test('empezar con n = 229 no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA()), { ...primero(), n: TOTAL }));
});
test('una fecha inventada (no la del servidor) no vale', async () => {
  const viejo = Timestamp.fromDate(new Date('2025-01-01'));
  await assertFails(setDoc(doc(db('ana'), RUTA()), { ...primero(), inicio: viejo }));
  await assertFails(setDoc(doc(db('ana'), RUTA()), { ...primero(), partes: { [ids[0]]: viejo } }));
});
test('prender dos partes de una vez no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA()), { ...primero(), partes: { [ids[0]]: serverTimestamp(), [ids[1]]: serverTimestamp() } }));
});
test('campos de más (por ejemplo "aprobado: true") no valen', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA()), { ...primero(), aprobado: true }));
});
test('el segundo bombillo antes de la espera se rechaza; después, se acepta', async () => {
  const d = db('ana');
  await setDoc(doc(d, RUTA()), primero());
  await assertFails(sumar(d, siguiente(2, ids[1])));
  await dormir(ESPERA + 0.5);
  await assertSucceeds(sumar(d, siguiente(2, ids[1])));
});
test('saltar el contador (n de 1 a 5) no vale', async () => {
  const d = db('ana');
  await setDoc(doc(d, RUTA()), primero());
  await dormir(ESPERA + 0.5);
  await assertFails(sumar(d, siguiente(5, ids[1])));
});
test('repetir una parte ya prendida no suma', async () => {
  const d = db('ana');
  await setDoc(doc(d, RUTA()), primero());
  await dormir(ESPERA + 0.5);
  await assertFails(sumar(d, siguiente(2, ids[0])));
});
test('cambiar la fecha de inicio o borrar una parte no vale', async () => {
  const d = db('ana');
  await setDoc(doc(d, RUTA()), primero());
  await dormir(ESPERA + 0.5);
  await assertFails(sumar(d, { ...siguiente(2, ids[1]), inicio: Timestamp.fromDate(new Date('2025-01-01')) }));
  await assertFails(sumar(d, { ...siguiente(2, ids[1]), partes: { [ids[1]]: serverTimestamp(), [ids[0]]: deleteField() } }));
});
test('no se puede borrar el progreso', async () => {
  await setDoc(doc(db('ana'), RUTA()), primero());
  await assertFails(deleteDoc(doc(db('ana'), RUTA())));
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
  await assertFails(setDoc(doc(db('ana'), 'certificados', COD), { uid: 'ana', curso: 'programacion', nombre: 'Ana Pérez', emitido: serverTimestamp(), partes: TOTAL, inicio: fechas.inicio, fin: fechas.ultimo }));
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
  b.set(doc(d, 'cursos/programacion/emitidos', 'beto'), { codigo: COD });
  await assertFails(b.commit());
});
test('la dueña puede borrar el suyo (para corregir el nombre) y volver a emitirlo', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await emitir('ana', COD, {}, { inicio: fechas.inicio, fin: fechas.ultimo });
  const d = db('ana');
  const b = writeBatch(d);
  b.delete(doc(d, 'certificados', COD));
  b.delete(doc(d, 'cursos/programacion/emitidos', 'ana'));
  await assertSucceeds(b.commit());
  await assertSucceeds(emitir('ana', 'ME-AAAA-BBBB-CCCC', {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
});

// ---------------- cuentas y cursos ----------------
test('una cuenta con el correo SIN verificar no puede prender bombillos', async () => {
  await assertFails(setDoc(doc(db('ana', { email: 'ana@gmail.com', email_verified: false }), RUTA()), primero()));
});
test('una cuenta que no es de Gmail no puede prender bombillos', async () => {
  await assertFails(setDoc(doc(db('ana', { email: 'ana@hotmail.com', email_verified: true }), RUTA()), primero()));
});
test('un curso inventado no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA('ana', 'hackeo-gratis')), primero()));
});
test('una parte de programación no vale en el curso de seguridad', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA('ana', 'seguridad')), primero(ids[0])));
  await assertSucceeds(setDoc(doc(db('ana'), RUTA('ana', 'seguridad')), primero(porCurso.seguridad[0])));
});
test('terminar programación no da el certificado de seguridad', async () => {
  const fechas = await sembrar('ana', TOTAL);
  const d = db('ana');
  const b = writeBatch(d);
  const codigo = 'SE-1A2B-3C4D-5E6F';
  b.set(doc(d, 'certificados', codigo), { uid: 'ana', curso: 'seguridad', nombre: 'Ana Pérez Gómez', emitido: serverTimestamp(), partes: porCurso.seguridad.length, inicio: fechas.inicio, fin: fechas.ultimo });
  b.set(doc(d, 'cursos/seguridad/emitidos', 'ana'), { codigo });
  await assertFails(b.commit());
});
test('el prefijo del código tiene que ser el del curso (ME para programación)', async () => {
  const fechas = await sembrar('ana', TOTAL);
  await assertFails(emitir('ana', 'SE-1A2B-3C4D-5E6F', {}, { inicio: fechas.inicio, fin: fechas.ultimo }));
});

test('los cursos nuevos (ia y agentes) aceptan sus partes y no las de otro curso', async () => {
  await assertSucceeds(setDoc(doc(db('ana'), RUTA('ana', 'ia')), primero(porCurso.ia[0])));
  await assertSucceeds(setDoc(doc(db('ana'), RUTA('ana', 'agentes')), primero(porCurso.agentes[0])));
  await assertFails(setDoc(doc(db('beto'), RUTA('beto', 'agentes')), primero(porCurso.ia[0])));
});
