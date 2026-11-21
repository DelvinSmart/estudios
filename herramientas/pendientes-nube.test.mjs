import assert from 'node:assert/strict';
import { test } from 'node:test';
import { crearColaNube } from '../web/pendientes-nube.js';

function preparar(enviar) {
  const datos = new Map();
  const confirmadas = [];
  const esperas = [];
  let enLinea = false;
  const dependencias = {
    almacenamiento: {
      getItem: (k) => datos.get(k) ?? null,
      setItem: (k, v) => datos.set(k, v),
      removeItem: (k) => datos.delete(k),
    },
    enviar,
    avisar: ({ id }) => confirmadas.push(id),
    conectado: () => enLinea,
    esperar: (_, ms) => esperas.push(ms),
    cancelar: () => {},
  };
  return {
    abrir: () => crearColaNube(dependencias),
    conectar: () => { enLinea = true; },
    confirmadas,
    esperas,
  };
}

test('retoma al abrir y solo envía avances de la misma cuenta', async () => {
  const llamadas = [];
  const estado = preparar(async (parte) => { llamadas.push(parte.uid); return { ok: true }; });
  const original = estado.abrir();
  original.asociar('primera-cuenta');
  original.agregar('programacion', 'parte-1');
  original.agregar('programacion', 'parte-1');
  await original.procesar();
  assert.deepEqual(llamadas, []);

  estado.conectar();
  const reabierta = estado.abrir();
  reabierta.asociar('otra-cuenta');
  await reabierta.procesar();
  assert.deepEqual(llamadas, []);
  reabierta.asociar('primera-cuenta');
  await reabierta.procesar();
  assert.deepEqual(llamadas, ['primera-cuenta']);
  assert.deepEqual(estado.confirmadas, ['parte-1']);
  assert.equal(reabierta.tiene('programacion', 'parte-1'), false);
});

test('conserva el orden por curso y reintenta tras el límite del servidor', async () => {
  const llamadas = [];
  let esperar = true;
  const estado = preparar(async ({ id }) => {
    llamadas.push(id);
    if (id === 'parte-1' && esperar) return { motivo: 'espera', segundos: 60 };
    return { motivo: 'ya' };
  });
  const cola = estado.abrir();
  cola.asociar('cuenta');
  cola.agregar('programacion', 'parte-1');
  cola.agregar('programacion', 'parte-2');
  cola.agregar('javascript', 'parte-3');
  cola.agregar('javascript', 'quitar');
  cola.quitar('javascript', 'quitar');
  estado.conectar();
  await cola.procesar();
  assert.deepEqual(llamadas, ['parte-1', 'parte-3']);
  assert.equal(estado.esperas.at(-1), 61000);
  esperar = false;
  await cola.procesar();
  assert.deepEqual(llamadas, ['parte-1', 'parte-3', 'parte-1', 'parte-2']);
  assert.deepEqual(estado.confirmadas, ['parte-3', 'parte-1', 'parte-2']);
});
