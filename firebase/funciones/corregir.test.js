import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corregir, parteCompleta, puedeIntentar, cabeHoy, ESPERA_FALLO_MS } from './corregir.js';

const ENTRADA = {
  parte: '15:CLASE-GUIADA.md:2',
  preguntas: [
    { tipo: 'vf', correcta: 'F', explicacion: 'HTML no hace cuentas.' },
    { tipo: 'elige', correcta: 1, opciones: 3, explicacion: 'La pintura.' },
    { tipo: 'escribe' },
  ],
};

test('todo bien: aprobada, y recién ahí llegan las explicaciones', () => {
  const r = corregir(ENTRADA, { 0: 'F', 1: 1 });
  assert.equal(r.aprobada, true);
  assert.deepEqual(r.resultados, [true, true, null]);
  assert.deepEqual(r.explicaciones, ['HTML no hace cuentas.', 'La pintura.', null]);
});
test('una mal: no aprobada, dice cuál falló pero NO la respuesta ni la explicación', () => {
  const r = corregir(ENTRADA, { 0: 'V', 1: 1 });
  assert.equal(r.aprobada, false);
  assert.deepEqual(r.resultados, [false, true, null]);
  assert.equal(r.explicaciones, null);
  assert.ok(!JSON.stringify(r).includes('HTML no hace cuentas'));
});
test('respuestas que faltan o con tipo raro cuentan como mal', () => {
  assert.equal(corregir(ENTRADA, {}).aprobada, false);
  assert.equal(corregir(ENTRADA, { 0: 'F', 1: '1' }).aprobada, false);
  assert.equal(corregir(ENTRADA, null).aprobada, false);
  assert.equal(corregir(ENTRADA, { 0: true, 1: 1 }).aprobada, false);
});
test('una práctica que no existe da error', () => {
  assert.deepEqual(corregir(undefined, {}), { error: 'no-existe' });
});
test('la parte queda aprobada solo cuando están TODAS sus prácticas', () => {
  const todas = {
    'p:practica1': { parte: 'p', preguntas: [{ tipo: 'vf' }] },
    'p:practica2': { parte: 'p', preguntas: [{ tipo: 'elige' }] },
    'p:practica3': { parte: 'p', preguntas: [{ tipo: 'escribe' }] }, // no se corrige: no cuenta
    'q:practica1': { parte: 'q', preguntas: [{ tipo: 'vf' }] },
  };
  assert.equal(parteCompleta(todas, 'p', { 'p:practica1': 1 }), false);
  assert.equal(parteCompleta(todas, 'p', { 'p:practica1': 1, 'p:practica2': 1 }), true);
  assert.equal(parteCompleta(todas, 'q', { 'p:practica1': 1, 'p:practica2': 1 }), false);
});
test('después de fallar hay que esperar antes de volver a intentar', () => {
  assert.equal(puedeIntentar({}, 'x', 1000).ok, true);
  const r = puedeIntentar({ x: 1000 }, 'x', 1000 + ESPERA_FALLO_MS - 2000);
  assert.equal(r.ok, false);
  assert.equal(r.segundos, 2);
  assert.equal(puedeIntentar({ x: 1000 }, 'x', 1000 + ESPERA_FALLO_MS).ok, true);
});
test('el tope diario se reinicia al otro día', () => {
  assert.equal(cabeHoy({ dia: 'd1', cuenta: 3 }, 'd1', 3).ok, false);
  assert.equal(cabeHoy({ dia: 'd1', cuenta: 3 }, 'd2', 3).ok, true);
  assert.deepEqual(cabeHoy(null, 'd1', 3).guardar, { dia: 'd1', cuenta: 1 });
});
