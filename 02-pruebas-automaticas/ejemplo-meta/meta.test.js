const test = require('node:test');
const assert = require('node:assert/strict');
const { faltaParaMeta } = require('./meta');

test('si gané 300 y la meta es 500, faltan 200', () => {
  assert.equal(faltaParaMeta(300, 500), 200);
});

test('si llegué justo a la meta, falta 0', () => {
  assert.equal(faltaParaMeta(500, 500), 0);
});

test('si pasé la meta, falta 0 y no un número negativo', () => {
  assert.equal(faltaParaMeta(700, 500), 0);
});
