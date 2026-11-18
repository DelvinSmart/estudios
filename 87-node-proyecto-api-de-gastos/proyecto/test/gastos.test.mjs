// Pruebas de la LÓGICA: sin servidor, sin archivos, en milisegundos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validar, soloConocidos, crearServicio } from '../src/gastos.mjs';
import { crearAlmacenMemoria } from '../src/almacen.mjs';

const bueno = { tipo: 'lavado', valor: 30, fecha: '2026-11-18' };

test('un gasto bien armado no tiene errores', () => {
  assert.deepEqual(validar(bueno), []);
});

test('rechaza tipo inventado, valor 0 y fecha mal escrita', () => {
  assert.equal(validar({ tipo: 'casino', valor: 0, fecha: '18/11/2026' }).length, 3);
});

test('el valor 0 es el borde: no vale', () => {
  assert.equal(validar({ ...bueno, valor: 0 }).length, 1);
  assert.deepEqual(validar({ ...bueno, valor: 0.01 }), []);
});

test('una fecha que no existe no vale', () => {
  assert.equal(validar({ ...bueno, fecha: '2026-13-45' }).length, 1);
  assert.equal(validar({ ...bueno, fecha: '2026-02-31' }).length, 1, 'el 31 de febrero no existe');
  assert.equal(validar({ ...bueno, fecha: '2025-02-29' }).length, 1, '2025 no es bisiesto');
  assert.deepEqual(validar({ ...bueno, fecha: '2028-02-29' }), [], '2028 sí es bisiesto');
});

test('dos gastos que llegan a la vez: no se pisan', async () => {
  const s = crearServicio(crearAlmacenMemoria());
  const [a, b] = await Promise.all([s.crear(bueno), s.crear({ ...bueno, tipo: 'peaje' })]);
  assert.notEqual(a.id, b.id, 'cada uno con su id');
  assert.equal((await s.listar()).length, 2, 'los dos quedan guardados');
});

test('PATCH: solo revisa lo que viene', () => {
  assert.deepEqual(validar({ valor: 50 }, true), []);
  assert.equal(validar({ valor: -1 }, true).length, 1);
});

test('ignora los campos que no conoce', () => {
  assert.deepEqual(soloConocidos({ ...bueno, admin: true, id: 999 }), bueno);
});

test('crear, buscar, actualizar y borrar', async () => {
  const s = crearServicio(crearAlmacenMemoria());
  const g = await s.crear(bueno);
  assert.equal(g.id, 1);
  assert.deepEqual(await s.buscar(1), g);
  assert.equal((await s.actualizar(1, { valor: 45, id: 7 })).valor, 45);
  assert.equal((await s.buscar(1)).id, 1, 'no deja cambiar el id');
  assert.equal(await s.borrar(1), true);
  assert.equal(await s.borrar(1), false);
});

test('los ids no se repiten aunque se borre uno', async () => {
  const s = crearServicio(crearAlmacenMemoria());
  await s.crear(bueno);
  await s.crear(bueno);
  await s.borrar(1);
  assert.equal((await s.crear(bueno)).id, 3);
});

test('el resumen junta por tipo y redondea los centavos', async () => {
  const s = crearServicio(crearAlmacenMemoria());
  await s.crear({ ...bueno, tipo: 'peaje', valor: 0.1 });
  await s.crear({ ...bueno, tipo: 'peaje', valor: 0.2 });
  await s.crear(bueno);
  assert.deepEqual(await s.resumen(), { total: 30.3, cantidad: 3, porTipo: { peaje: 0.3, lavado: 30 } });
});

test('filtra por tipo y por fechas', async () => {
  const s = crearServicio(crearAlmacenMemoria());
  await s.crear({ ...bueno, fecha: '2026-11-01' });
  await s.crear({ ...bueno, tipo: 'peaje', fecha: '2026-11-10' });
  await s.crear({ ...bueno, fecha: '2026-11-20' });
  assert.equal((await s.listar({ tipo: 'lavado' })).length, 2);
  assert.equal((await s.listar({ desde: '2026-11-05', hasta: '2026-11-15' })).length, 1);
});
