// Los cursos van en orden: lo que un curso pide saber antes tiene que venir ANTES en la ruta.
// Y si un curso usa un lenguaje en sus ejercicios que no enseña, tiene que decirlo en ANTES.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { CLASES, CURSOS, RUTA_INICIAL, ANTES, ANTES_CLASE, numeroCurso, clasesDelCurso } from '../web/cursos.js';

const raiz = new URL('..', import.meta.url);
const LENGUAJE_DEL_CURSO = { javascript: 'javascript', node: 'javascript', reactnative: 'javascript', kotlin: 'kotlin', swift: 'swift', python: 'python' };
const CURSO_QUE_ENSENA = { js: 'javascript', ts: 'javascript', html: 'programacion', python: 'python', kotlin: 'kotlin', swift: 'swift' };

function lenguajesDe(id) {
  const carpeta = new URL(CLASES[id].carpeta + '/', raiz);
  const texto = readdirSync(carpeta).filter((f) => f.endsWith('.md')).map((f) => readFileSync(new URL(f, carpeta), 'utf8')).join('\n');
  return new Set([...texto.matchAll(/```ejercicio[\s\S]*?lenguaje:\s*(\w+)/g)].map((m) => m[1]));
}

test('cada curso tiene su lista de "antes", y apunta a cursos anteriores', () => {
  for (const id of Object.keys(CURSOS)) {
    assert.ok(Array.isArray(ANTES[id]), `falta ANTES para el curso ${id}`);
    for (const a of ANTES[id]) {
      assert.ok(CURSOS[a.curso], `${id} pide un curso que no existe: ${a.curso}`);
      assert.ok(numeroCurso(a.curso) < numeroCurso(id), `${id} (curso ${numeroCurso(id)}) pide ${a.curso} (curso ${numeroCurso(a.curso)}), que viene después`);
      assert.ok(a.por && a.por.length > 10, `${id}: falta decir por qué hace falta ${a.curso}`);
    }
  }
});

test('ningún curso usa en sus ejercicios un lenguaje que no enseña ni pide antes', () => {
  for (const id of Object.keys(CURSOS)) {
    if (id === 'programacion' || id === 'javascript') continue; // estos enseñan JavaScript desde cero
    const pide = new Set(ANTES[id].map((a) => a.curso));
    for (const clase of clasesDelCurso(id)) {
      const pideClase = new Set((ANTES_CLASE[clase] || []).map((a) => a.curso));
      for (const l of lenguajesDe(clase)) {
        const ensena = CURSO_QUE_ENSENA[l];
        if (!ensena || ensena === id || LENGUAJE_DEL_CURSO[id] === ensena) continue;
        assert.ok(pide.has(ensena) || pideClase.has(ensena),
          `la clase ${clase} (curso ${id}) tiene ejercicios en ${l}, pero ni el curso ni la clase piden ver antes ${ensena}`);
      }
    }
  }
});

test('la ruta inicial intercala los cursos sin saltarse sus requisitos de avance', () => {
  const ruta = RUTA_INICIAL.flatMap((paso) => paso.clases);
  assert.deepEqual(ruta.slice(0, 6), ['116', '45', '46', '47', '48', '01']);
  assert.equal(ruta.at(-1), '84');
  for (const curso of ['programacion', 'javascript']) {
    const orden = clasesDelCurso(curso);
    assert.deepEqual(ruta.filter((id) => orden.includes(id)), orden);
  }
});
