const test = require('node:test');
const assert = require('node:assert/strict');
const { aplicarDescuento } = require('./descuento');

test('100 con 20 % de descuento queda en 80', () => {
  assert.equal(aplicarDescuento(100, 20), 80);
});

test('con 0 % de descuento el precio no cambia', () => {
  assert.equal(aplicarDescuento(100, 0), 100);
});

test('con 100 % de descuento queda en 0', () => {
  assert.equal(aplicarDescuento(100, 100), 0);
});
