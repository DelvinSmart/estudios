// Pruebas de web/texto.js: el único lugar donde se escapa texto para HTML.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapar } from '../web/texto.js';

test('escapar convierte lo que el navegador leería como HTML', () => {
  assert.equal(escapar('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(escapar("O'Neil & Hijos"), 'O&#39;Neil &amp; Hijos');
});
test('escapar no rompe con null, undefined ni números', () => {
  assert.equal(escapar(null), '');
  assert.equal(escapar(undefined), '');
  assert.equal(escapar(42), '42');
});
