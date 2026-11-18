// Pruebas del motor de Kotlin SIN internet: se le dan respuestas como las del Kotlin Playground
// y se mira cómo las lee. Para probar los ejercicios con el Playground de verdad: herramientas/revisar-ejercicios.mjs
//   node --test herramientas/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { armarPrograma, leerRespuesta, correrKotlin } from '../web/ejercicio-kotlin.js';

const MARCA = '@@prueba@@';
const salida = (texto) => ({ errors: { 'File.kt': [] }, exception: null, text: `<outStream>${texto}</outStream>` });

test('arma el programa: el código arriba (con sus imports) y las pruebas dentro de main', () => {
  const { texto, lineasCodigo } = armarPrograma('import kotlinx.coroutines.*\nfun suma(a: Int, b: Int) = a + b', 'prueba("x") { igual(suma(1, 2), 3) }');
  assert.ok(texto.startsWith('import kotlinx.coroutines.*'));
  assert.match(texto, /fun main\(\) \{\nprueba\("x"\)/);
  assert.equal(lineasCodigo, 2);
});

test('lee las pruebas que pasan, las que fallan y lo que imprimió el alumno', () => {
  const r = leerRespuesta(salida(`depurando\n${MARCA}OK${MARCA}suma\n${MARCA}MAL${MARCA}resta${MARCA}se esperaba 1 y salió 2\n`), 3);
  assert.deepEqual(r, {
    error: null,
    logs: ['depurando'],
    resultados: [{ nombre: 'suma', paso: true }, { nombre: 'resta', paso: false, mensaje: 'se esperaba 1 y salió 2' }],
  });
});

test('el TODO() se explica en español', () => {
  const r = leerRespuesta(salida(`${MARCA}MAL${MARCA}suma${MARCA}NotImplementedError: An operation is not implemented.\n`), 1);
  assert.match(r.resultados[0].mensaje, /^todavía falta tu código/);
});

test('un error de compilación: en qué línea, en español y con el mensaje original', () => {
  const r = leerRespuesta({
    errors: { 'File.kt': [
      { interval: { start: { line: 0, ch: 1 } }, message: "'val' cannot be reassigned.", severity: 'ERROR' },
      { interval: { start: { line: 40, ch: 1 } }, message: 'Unresolved reference: sumar', severity: 'ERROR' },
      { interval: { start: { line: 0, ch: 1 } }, message: 'Variable is unused.', severity: 'WARNING' },
    ] },
    exception: null,
    text: '',
  }, 5);
  assert.match(r.error, /^Kotlin encontró 2 errores/);
  assert.match(r.error, /línea 1: es val: no se puede cambiar/);
  assert.match(r.error, /en las pruebas: ese nombre no existe/);
  assert.doesNotMatch(r.error, /unused/, 'los avisos no son errores');
});

test('si el programa se corta fuera de las pruebas, lo dice', () => {
  const r = leerRespuesta({ errors: {}, exception: { fullName: 'java.lang.NullPointerException', message: null }, text: '<outStream></outStream>' }, 1);
  assert.match(r.error, /se cortó fuera de las pruebas: algo era null/);
});

test('sin internet: un mensaje claro, no un error raro', async () => {
  const r = await correrKotlin('fun a() = 1', 'prueba("a") { igual(a(), 1) }', { fetch: async () => { throw new TypeError('Failed to fetch'); } });
  assert.equal(r.error, 'No se pudo llegar al Kotlin Playground: ¿hay internet?');
});

test('si el Playground responde con error, lo dice', async () => {
  const r = await correrKotlin('fun a() = 1', '', { fetch: async () => ({ ok: false, status: 503 }) });
  assert.match(r.error, /respondió con un error \(503\)/);
});
