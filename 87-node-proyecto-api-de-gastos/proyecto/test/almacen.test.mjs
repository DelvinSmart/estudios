// Pruebas del ALMACÉN en archivo: usan una carpeta temporal que se borra al final.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { crearAlmacenArchivo } from '../src/almacen.mjs';

test('sin archivo, empieza vacío; al guardar, lo crea y sobrevive', async (t) => {
  const carpeta = await mkdtemp(path.join(tmpdir(), 'gastos-'));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const ruta = path.join(carpeta, 'datos', 'gastos.json');

  const almacen = crearAlmacenArchivo(ruta);
  assert.deepEqual(await almacen.leer(), []);
  await almacen.guardar([{ id: 1, tipo: 'lavado', valor: 30, fecha: '2026-11-18' }]);

  const otraVez = crearAlmacenArchivo(ruta);   // como si el servidor se hubiera reiniciado
  assert.equal((await otraVez.leer()).length, 1);
  assert.match(await readFile(ruta, 'utf8'), /\n {2}\{/, 'se guarda con sangría, legible');
});

test('dos guardados seguidos quedan en orden', async (t) => {
  const carpeta = await mkdtemp(path.join(tmpdir(), 'gastos-'));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const almacen = crearAlmacenArchivo(path.join(carpeta, 'gastos.json'));
  await Promise.all([almacen.guardar([{ id: 1 }]), almacen.guardar([{ id: 1 }, { id: 2 }])]);
  assert.equal((await almacen.leer()).length, 2);
});

test('un archivo roto no se esconde: lanza el error', async (t) => {
  const carpeta = await mkdtemp(path.join(tmpdir(), 'gastos-'));
  t.after(() => rm(carpeta, { recursive: true, force: true }));
  const ruta = path.join(carpeta, 'gastos.json');
  const { writeFile } = await import('node:fs/promises');
  await writeFile(ruta, '{ esto no es JSON', 'utf8');
  await assert.rejects(crearAlmacenArchivo(ruta).leer(), SyntaxError);
});

// El almacén de Firestore, con un documento DE MENTIRA: tiene get() y set() como el de verdad,
// pero guarda en una variable. Así se prueba sin internet y sin cuenta.
import { crearAlmacenEnDocumento } from '../src/almacen-firestore.mjs';
import { crearServicio } from '../src/gastos.mjs';

function documentoDeMentira() {
  let datos = null;
  return {
    async get() { return { exists: datos !== null, data: () => structuredClone(datos) }; },
    async set(nuevos) { datos = structuredClone(nuevos); },
  };
}

test('Firestore: sin documento, lista vacía; guarda y lee lo mismo', async () => {
  const almacen = crearAlmacenEnDocumento(documentoDeMentira());
  assert.deepEqual(await almacen.leer(), []);
  await almacen.guardar([{ id: 1, tipo: 'peaje', valor: 5, fecha: '2026-11-18' }]);
  assert.deepEqual(await almacen.leer(), [{ id: 1, tipo: 'peaje', valor: 5, fecha: '2026-11-18' }]);
});

test('Firestore: el mismo servicio funciona sin cambiar nada', async () => {
  const s = crearServicio(crearAlmacenEnDocumento(documentoDeMentira()));
  await s.crear({ tipo: 'lavado', valor: 30, fecha: '2026-11-18' });
  await s.crear({ tipo: 'peaje', valor: 5, fecha: '2026-11-18' });
  assert.deepEqual(await s.resumen(), { total: 35, cantidad: 2, porTipo: { lavado: 30, peaje: 5 } });
});
