// Pruebas del motor de Swift. Casi todas SIN internet: se le dan respuestas con la forma de Compiler Explorer
// y se mira cómo las lee. La última compila y corre de verdad con el swift de la Mac (si no hay, se salta).
//   node --test herramientas/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { armarPrograma, leerRespuesta, desdeCompilerExplorer, correrSwift, LINEAS_ANTES } from '../web/ejercicio-swift.js';

const M = '@@prueba@@';
const corrio = (salida, errSalida = [], extra = {}) => ({ compilo: true, errores: [], salida, errSalida, seCorto: false, ...extra });

test('arma el programa: la salida sin búfer, el código del alumno, las ayudas, las pruebas y el que las corre', () => {
  const { texto, lineasCodigo } = armarPrograma('func suma(_ a: Int, _ b: Int) -> Int { a + b }', 'prueba("x") { igual(suma(1, 2), 3) }');
  assert.ok(texto.startsWith('import Foundation\nsetvbuf(stdout, nil, _IONBF, 0)'));
  assert.equal(texto.split('\n')[LINEAS_ANTES], 'func suma(_ a: Int, _ b: Int) -> Int { a + b }');
  assert.ok(texto.indexOf('func igual') < texto.indexOf('prueba("x")'));
  assert.equal(lineasCodigo, 1);
});

test('lee las pruebas que pasan, las que fallan y lo que imprimió el alumno', () => {
  const r = leerRespuesta(corrio([`${M}LISTA${M}suma`, `${M}LISTA${M}resta`, 'depurando', `${M}OK${M}suma`, `${M}MAL${M}resta${M}se esperaba 1 y salió 2`]), 3);
  assert.deepEqual(r, {
    error: null,
    logs: ['depurando'],
    resultados: [{ nombre: 'suma', paso: true }, { nombre: 'resta', paso: false, mensaje: 'se esperaba 1 y salió 2' }],
  });
});

test('si se cae en una prueba, esa dice por qué y las siguientes "no llegaron a correr"', () => {
  const r = leerRespuesta(corrio(
    [`${M}LISTA${M}a`, `${M}LISTA${M}b`, `${M}LISTA${M}c`, `${M}OK${M}a`],
    ['Swift/ContiguousArrayBuffer.swift:695: Fatal error: Index out of range'],
  ), 3);
  assert.deepEqual(r.resultados[0], { nombre: 'a', paso: true });
  assert.match(r.resultados[1].mensaje, /^el programa se cayó aquí: pediste una posición que la lista no tiene/);
  assert.equal(r.resultados[2].mensaje, 'no llegó a correr: el programa se cayó antes');
  assert.equal(r.error, null);
});

test('usar ! en algo que era nil se explica en español', () => {
  const r = leerRespuesta(corrio([`${M}LISTA${M}a`], ['Fatal error: Unexpectedly found nil while unwrapping an Optional value']), 1);
  assert.match(r.resultados[0].mensaje, /usaste ! en algo que era nil/);
});

test('un ciclo sin fin: Compiler Explorer lo corta a los 20 segundos y se dice', () => {
  const r = leerRespuesta(corrio([`${M}LISTA${M}a`], ['Killed - processing time exceeded'], { seCorto: true }), 1);
  assert.match(r.resultados[0].mensaje, /20 segundos: ¿hay un ciclo que nunca termina\?/);
});

test('si se cae antes de las pruebas (en el código del alumno), se dice aparte', () => {
  const r = leerRespuesta(corrio(['antes'], ['Fatal error: Division by zero']), 2);
  assert.match(r.error, /^Tu programa se cortó fuera de las pruebas: una división entre cero/);
  assert.deepEqual(r.logs, ['antes']);
});

test('los errores de compilación: con su línea del alumno, en español y con el original', () => {
  const r = leerRespuesta({
    compilo: false,
    errores: [
      `<source>:${LINEAS_ANTES + 2}:14: error: cannot convert value of type 'String' to specified type 'Int'`,
      `<source>:${LINEAS_ANTES + 40}:5: error: cannot find 'restar' in scope`,
    ],
    salida: [], errSalida: [], seCorto: false,
  }, 3);
  assert.match(r.error, /^Swift encontró 2 errores:/);
  assert.match(r.error, /· línea 2: pusiste un valor de un tipo donde va otro\.\n {4}\(cannot convert/);
  assert.match(r.error, /· en las pruebas: ese nombre no existe/);
});

test('de la respuesta de Compiler Explorer a la forma sencilla', () => {
  const s = desdeCompilerExplorer({ didExecute: true, code: 143, timedOut: true, stdout: [{ text: 'antes' }], stderr: [{ text: 'Killed' }], buildResult: { code: 0, stderr: [] } });
  assert.deepEqual(s, { compilo: true, errores: [], salida: ['antes'], errSalida: ['Killed'], seCorto: true });
  const f = desdeCompilerExplorer({ code: -1, stdout: [], stderr: [{ text: 'Build failed' }], buildResult: { code: 1, stderr: [{ text: '<source>:3:1: error: x' }] } });
  assert.equal(f.compilo, false);
  assert.deepEqual(f.errores, ['<source>:3:1: error: x']);
});

test('sin internet: un aviso claro, no un error raro', async () => {
  const r = await correrSwift('', '', { fetch: async () => { throw new TypeError('Failed to fetch'); } });
  assert.equal(r.error, 'No se pudo llegar a Compiler Explorer: ¿hay internet?');
});

const haySwift = spawnSync('swiftc', ['--version']).status === 0;
test('el programa armado compila y corre de verdad (con el swift de esta computadora)', { skip: !haySwift && 'no hay swift' }, () => {
  const codigo = 'func sumar(_ a: Int, _ b: Int) -> Int { a + b }\nfunc nombre() -> String? { nil }';
  const pruebas = [
    'prueba("bien") { igual(sumar(2, 3), 5) }',
    'prueba("mal") { igual(sumar(2, 2), 5) }',
    'prueba("opcional") { igual(nombre(), "Ana") }',
    'prueba("ok") { ok(sumar(1, 1) == 3, "uno más uno no es tres") }',
    'prueba("se cae") { let x: [Int] = []; igual(x[0], 1) }',
    'prueba("nunca") { igual(1, 1) }',
  ].join('\n');
  const dir = mkdtempSync(path.join(tmpdir(), 'swift-'));
  try {
    writeFileSync(path.join(dir, 'main.swift'), armarPrograma(codigo, pruebas).texto);
    const c = spawnSync('swiftc', ['-o', path.join(dir, 'prog'), path.join(dir, 'main.swift')], { encoding: 'utf8' });
    assert.equal(c.status, 0, c.stderr);
    const e = spawnSync(path.join(dir, 'prog'), [], { encoding: 'utf8', timeout: 10000 });
    const r = leerRespuesta({ compilo: true, errores: [], salida: e.stdout.split('\n'), errSalida: e.stderr.split('\n'), seCorto: false }, 2);
    assert.deepEqual(r.resultados.map((x) => [x.nombre, x.paso]), [['bien', true], ['mal', false], ['opcional', false], ['ok', false], ['se cae', false], ['nunca', false]]);
    assert.equal(r.resultados[1].mensaje, 'se esperaba 5 y salió 4');
    assert.equal(r.resultados[2].mensaje, 'se esperaba "Ana" y salió nil');
    assert.equal(r.resultados[3].mensaje, 'uno más uno no es tres');
    assert.match(r.resultados[4].mensaje, /^el programa se cayó aquí: pediste una posición que la lista no tiene/);
    assert.equal(r.resultados[5].mensaje, 'no llegó a correr: el programa se cayó antes');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
