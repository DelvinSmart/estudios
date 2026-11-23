// El motor de dibujos: lee bien las piezas y ningún dibujo de las clases está roto o se sale del lienzo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CLASES } from '../web/cursos.js';
import { leerDibujo } from '../web/dibujo.js';

test('lee título, lienzo, piezas, color y textos', () => {
  const d = leerDibujo('titulo Un viaje\nlienzo 300 100\ncaja 10 10 80 40 azul | Uno | Dos\nflecha 90 30 150 30 | add');
  assert.equal(d.titulo, 'Un viaje');
  assert.equal(d.ancho, 300);
  assert.deepEqual(d.piezas[0], { tipo: 'caja', numeros: [10, 10, 80, 40], color: 'azul', textos: ['Uno', 'Dos'] });
  assert.equal(d.piezas[1].color, 'tenue');
});

test('rechaza piezas, números y colores inválidos, y exige título', () => {
  assert.throws(() => leerDibujo('titulo x\nscript 1 2'), /pieza desconocida/);
  assert.throws(() => leerDibujo('titulo x\ncaja 1 2 tres 4 azul'), /números inválidos/);
  assert.throws(() => leerDibujo('titulo x\ncaja 1 2 3 4 rosado'), /color desconocido/);
  assert.throws(() => leerDibujo('caja 1 2 3 4 azul'), /falta el título/);
});

test('cada dibujo de las clases se puede leer y queda dentro de su lienzo', () => {
  for (const clase of Object.values(CLASES)) {
    for (const doc of clase.docs) {
      const texto = readFileSync(new URL(`../${clase.carpeta}/${doc.archivo}`, import.meta.url), 'utf8');
      for (const [, fuente] of texto.matchAll(/```dibujo\n([\s\S]*?)```/g)) {
        const d = leerDibujo(fuente);
        for (const { tipo, numeros: n } of d.piezas) {
          const xs = tipo === 'caja' || tipo === 'llena' ? [n[0], n[0] + n[2]] : tipo === 'circulo' ? [n[0] - n[2], n[0] + n[2]] : tipo === 'texto' ? [n[0]] : [n[0], n[2]];
          const ys = tipo === 'caja' || tipo === 'llena' ? [n[1], n[1] + n[3]] : tipo === 'circulo' ? [n[1] - n[2], n[1] + n[2]] : tipo === 'texto' ? [n[1]] : [n[1], n[3]];
          assert.ok(xs.every((x) => x >= 0 && x <= d.ancho) && ys.every((y) => y >= 0 && y <= d.alto), `«${d.titulo}» (${clase.carpeta}) se sale del lienzo`);
        }
      }
    }
  }
});
