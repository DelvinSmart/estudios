// Pruebas del programa que corre los ejercicios de Python (el mismo que usa la página dentro de Pyodide),
// con el Python de la computadora. Para revisar los ejercicios: herramientas/revisar-ejercicios.mjs
//   node --test herramientas/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { AYUDAS_PY, CORREDOR_PY, cajaPython } from '../web/ejercicio-python.js';

const ENVOLTORIO = `
import ast, json, sys
datos = json.load(sys.stdin)
g = {"__codigo": datos["codigo"], "__pruebas": datos["pruebas"], "AYUDAS": datos["ayudas"]}
arbol = ast.parse(datos["corredor"])
ultimo = arbol.body.pop()
exec(compile(arbol, "<corredor>", "exec"), g)
print("\\x00RESULTADO\\x00" + eval(compile(ast.Expression(ultimo.value), "<corredor>", "eval"), g))
`;
function correr(codigo, pruebas) {
  const r = spawnSync('python3', ['-I', '-c', ENVOLTORIO], {
    input: JSON.stringify({ codigo, pruebas, ayudas: AYUDAS_PY, corredor: CORREDOR_PY }),
    encoding: 'utf8',
  });
  return JSON.parse(r.stdout.split('\x00RESULTADO\x00')[1]);
}

test('las dos formas de escribir una prueba: lambda y decorador', () => {
  const r = correr('def suma(a, b):\n    return a + b', 'prueba("lambda", lambda: igual(suma(2, 3), 5))\n@prueba("decorador")\ndef _():\n    igual(suma(1, 1), 2)\n    ok(suma(0, 0) == 0)');
  assert.deepEqual(r, { error: null, resultados: [{ nombre: 'lambda', paso: true }, { nombre: 'decorador', paso: true }] });
});

test('una prueba que falla dice qué esperaba y qué salió', () => {
  const r = correr('def suma(a, b):\n    pass', 'prueba("suma", lambda: igual(suma(2, 3), 5))');
  assert.equal(r.resultados[0].mensaje, 'se esperaba 5 y salió None');
});

test('un error dentro de tu función: en español, con su línea', () => {
  const r = correr('def promedio(l):\n    return sum(l) / len(l)', 'prueba("vacía", lambda: promedio([]))');
  assert.match(r.resultados[0].mensaje, /^línea 2: dividiste por cero \(ZeroDivisionError/);
});

test('un error de escritura: no corre nada y dice la línea', () => {
  const r = correr('x = 1\ndef f()\n    return 1', 'prueba("f", lambda: igual(f(), 1))');
  assert.match(r.error, /^Tu código tiene un error: línea 2: Python no entiende cómo está escrito/);
  assert.deepEqual(r.resultados, []);
});

test('la sangría mal se explica', () => {
  const r = correr('def f():\nreturn 1', '');
  assert.match(r.error, /la sangría/);
});

test('la caja usa un Worker de módulo desde data: (Pyodide no corre en Workers clásicos)', () => {
  const html = cajaPython();
  assert.match(html, /new Worker\('data:text\/javascript,'/);
  assert.match(html, /type: 'module'/);
  assert.doesNotMatch(html, /importScripts/);
});
