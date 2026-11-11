// TEST UNITARIO: prueba una sola función, sola, sin servidor.
const test = require('node:test');
const assert = require('node:assert/strict');
const { validarGasto } = require('../src/validar');

test('un gasto correcto no tiene errores', () => {
  assert.deepEqual(validarGasto({ descripcion: 'Gasolina', monto: 100 }), []);
});

test('rechaza un monto negativo', () => {
  assert.equal(validarGasto({ descripcion: 'Gasolina', monto: -5 }).length, 1);
});

test('rechaza una descripción vacía', () => {
  assert.equal(validarGasto({ descripcion: '   ', monto: 10 }).length, 1);
});
