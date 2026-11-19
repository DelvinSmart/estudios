// El motor de referencias: que enlace bien, que acepte ids de 2 y 3 dígitos, y —lo más
// importante— que NINGUNA lección nombre una clase que no existe ("Tema 99").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { transformarTexto, numeroEnCurso, referenciasRotas } from '../web/referencias.js';
import { CLASES } from '../web/cursos.js';

const raiz = new URL('..', import.meta.url);

test('enlaza una referencia con el número que se ve en el mapa, no el de la carpeta', () => {
  const html = transformarTexto('lo viste en la clase 06', 'programacion');
  assert.ok(html.includes(`>${numeroEnCurso('06')}</a>`), `no puso el número vivo de la 06: ${html}`);
  assert.ok(html.includes('href="#/clase/06"'), 'el enlace no apunta al id 06');
});

test('acepta ids de tres dígitos (clases 100 a 115), que antes quedaban sin enlazar', () => {
  assert.ok(CLASES['102'], 'la clase 102 debería existir para esta prueba');
  const html = transformarTexto('como en el Tema 102', 'seguridad');
  assert.ok(html && html.includes('href="#/clase/102"'), `no enlazó la 102: ${html}`);
});

test('enlaza listas y rangos: "clases 61 a 65"', () => {
  const html = transformarTexto('las clases 61 a 65', 'programacion');
  assert.ok(html.includes('href="#/clase/61"') && html.includes('href="#/clase/65"'), `no enlazó el rango: ${html}`);
});

test('si el número no es una clase conocida, lo deja igual (no rompe)', () => {
  assert.ok(!CLASES['150'], 'esta prueba necesita que la clase 150 no exista');
  assert.equal(transformarTexto('la clase 150 no existe', 'programacion'), null);
});

test('escapa el texto alrededor de la referencia', () => {
  const html = transformarTexto('<script> y la clase 06', 'programacion');
  assert.ok(html.includes('&lt;script&gt;'), 'no escapó el <script>');
});

test('ninguna lección nombra una clase que no existe', () => {
  const carpetas = readdirSync(raiz).filter((n) => /^\d+-/.test(n));
  const problemas = [];
  for (const carpeta of carpetas) {
    for (const archivo of readdirSync(new URL(`${carpeta}/`, raiz)).filter((f) => f.endsWith('.md'))) {
      const md = readFileSync(new URL(`${carpeta}/${archivo}`, raiz), 'utf8')
        .replace(/```[\s\S]*?```/g, ' ')   // sin bloques de código
        .replace(/`[^`]*`/g, ' ');          // sin código en línea
      for (const id of referenciasRotas(md)) problemas.push(`${carpeta}/${archivo}: "clase/Tema ${id}" no existe`);
    }
  }
  assert.deepEqual(problemas, [], `referencias a clases inexistentes:\n${problemas.join('\n')}`);
});
