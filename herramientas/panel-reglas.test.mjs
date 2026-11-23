// Pruebas de las reglas del panel:   node --test herramientas/panel-reglas.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLASES } from '../web/cursos.js';
import { partir } from '../web/lector.js';
import { separar, unir, aTexto, aLineas, revisar } from '../web/panel-reglas.js';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const todos = Object.values(CLASES).flatMap((c) => c.docs.map((d) => `${c.carpeta}/${d.archivo}`));
const leer = (ruta) => readFileSync(`${raiz}${ruta}`, 'utf8');

test('separar y unir devuelven cada clase exactamente igual, con las mismas partes que ve la página', () => {
  for (const ruta of todos) {
    const md = leer(ruta);
    const s = separar(md);
    assert.equal(unir(s), md, ruta);
    assert.equal(s.partes.length, partir(md).partes.length, ruta);
    // pasar por el cuadro de edición tampoco cambia nada
    const vuelta = { cabeza: aLineas(aTexto(s.cabeza)), partes: s.partes.map((p) => ({ ...p, cuerpo: aLineas(aTexto(p.cuerpo)) })) };
    assert.equal(unir(vuelta), md, ruta);
    assert.deepEqual(revisar(md, md), [], ruta);
  }
});

const conPractica = todos.find((r) => leer(r).includes('```practica\n'));

test('cambiar el texto de una parte sí se puede', () => {
  const md = leer(conPractica);
  const s = separar(md);
  s.partes[0].cuerpo = ['Un texto nuevo.', ...s.partes[0].cuerpo];
  assert.deepEqual(revisar(md, unir(s)), []);
});

test('agregar una parte se frena', () => {
  const md = leer(conPractica);
  const s = separar(md);
  s.partes[0].cuerpo.push('## Una parte nueva', 'texto');
  const p = revisar(md, unir(s));
  assert.equal(p.length, 1);
  assert.match(p[0], /partes/);
});

test('un "## " dentro de un bloque de código no cuenta como parte', () => {
  const md = leer(conPractica);
  const s = separar(md);
  s.partes[0].cuerpo.push('```md', '## esto es un ejemplo', '```');
  assert.deepEqual(revisar(md, unir(s)), []);
});

test('cambiar una práctica se frena', () => {
  const md = leer(conPractica);
  const editado = md.replace('```practica\n', '```practica\nvf :: algo nuevo :: V :: porque sí\n');
  assert.match(revisar(md, editado)[0], /práctica/);
});

test('borrar una práctica se frena', () => {
  const md = leer(conPractica);
  const editado = md.replace(/```practica\n[\s\S]*?```/, '');
  assert.match(revisar(md, editado)[0], /práctica/);
});

test('dejar la clase vacía se frena', () => {
  assert.equal(revisar('# x\n## a\n', '  ').length, 1);
});

test('cambiar un título actualiza solo esa clase en el índice', async () => {
  const { cambiaronTitulos, indiceConTitulos } = await import('../web/panel-reglas.js');
  const antes = '# C\n\n## Uno\ntexto\n\n## Dos\nmás';
  const despues = antes.replace('## Dos', '## Dos, mejor');
  assert.equal(cambiaronTitulos(antes, antes.replace('texto', 'otro')), false);
  assert.equal(cambiaronTitulos(antes, despues), true);
  const indice = JSON.stringify({ aviso: 'x', clases: { 1: { partes: 2, titulos: ['Uno', 'Dos'] }, 2: { partes: 1, titulos: ['Otra'] } } });
  assert.deepEqual(JSON.parse(indiceConTitulos(indice, '1', despues)), {
    aviso: 'x', clases: { 1: { partes: 2, titulos: ['Uno', 'Dos, mejor'] }, 2: { partes: 1, titulos: ['Otra'] } },
  });
});
