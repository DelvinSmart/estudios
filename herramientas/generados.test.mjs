// Los archivos GENERADOS tienen que estar al día con lo que los genera.
// Si una de estas pruebas falla, corre:  node firebase/generar-reglas.mjs
// (Pasó de verdad: se agregaba una clase y se olvidaba regenerar; las reglas o el índice quedaban viejos.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { construirReglas } from '../firebase/generar-reglas.mjs';
import { construirIndice, partesMovidas } from '../firebase/partes.mjs';
import { readmeAlDia } from '../firebase/readme.mjs';
import { CLASES, CURSOS } from '../web/cursos.js';

const raiz = new URL('..', import.meta.url);
const leer = (ruta) => readFileSync(new URL(ruta, raiz), 'utf8');

test('firestore.rules está al día con la plantilla y las clases', () => {
  assert.equal(leer('firebase/firestore.rules'), construirReglas().texto, 'corre: node firebase/generar-reglas.mjs');
});

test('web/indice.json está al día con las clases', () => {
  assert.deepEqual(JSON.parse(leer('web/indice.json')), construirIndice(), 'corre: node firebase/generar-reglas.mjs');
});

test('la lista de clases del README está al día con cursos.js', () => {
  const readme = leer('README.md');
  assert.equal(readme, readmeAlDia(readme), 'corre: node firebase/generar-reglas.mjs');
});

test('partesMovidas avisa si una parte vieja cambió de lugar, y no si se agregó al final', () => {
  const viejo = { clases: { 1: { titulos: ['A', 'B'] } } };
  assert.deepEqual(partesMovidas(viejo, { clases: { 1: { titulos: ['A', 'B', 'C'] } } }), []);
  assert.deepEqual(partesMovidas(viejo, { clases: { 1: { titulos: ['A', 'Nueva', 'B'] } } }), ['1']);
  assert.deepEqual(partesMovidas(null, { clases: {} }), []);
});

test('cada carpeta NN-… está en cursos.js y cada clase de cursos.js tiene su carpeta', () => {
  const carpetas = readdirSync(raiz).filter((n) => /^\d+-/.test(n)).sort();
  const enCatalogo = Object.values(CLASES).map((c) => c.carpeta).sort();
  assert.deepEqual(carpetas, enCatalogo);
});

test('los prefijos de certificado son únicos', () => {
  const prefijos = Object.values(CURSOS).map((c) => c.prefijo);
  assert.equal(new Set(prefijos).size, prefijos.length);
});
