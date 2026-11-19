// Detecta referencias a "parte N" (del MISMO documento) que apunten a una parte que no existe.
// Pasó de verdad: al partir una parte larga, los números de las partes de abajo se corren, y una
// referencia escrita a mano ("sigue el colador de la parte 3") queda apuntando a la parte equivocada.
// No hay forma de que el número se actualice solo (las partes no tienen id fijo), pero esta prueba
// AVISA en rojo si una referencia quedó rota, para arreglarla a mano antes de publicar.
//
// Ignora las referencias calificadas con clase/Tema/documento/lección (esas apuntan a OTRA clase o doc).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CLASES } from '../web/cursos.js';
import { partir } from '../web/lector.js';

const raiz = new URL('..', import.meta.url);

test('ninguna referencia a "parte N" del mismo documento apunta a una parte que no existe', () => {
  const problemas = [];
  for (const c of Object.values(CLASES)) {
    for (const d of c.docs) {
      let md;
      try { md = readFileSync(new URL(`${c.carpeta}/${d.archivo}`, raiz), 'utf8'); } catch { continue; }
      const total = partir(md).partes.length;
      const sinCodigo = md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
      const re = /(.{0,18})\bparte\s+(\d+)\b/gi;
      let m;
      while ((m = re.exec(sinCodigo))) {
        if (/clase|tema|documento|\bdoc\b|lecci[oó]n|primera pestaña/i.test(m[1])) continue; // apunta a otra clase/doc
        const n = Number(m[2]);
        if (n > total) problemas.push(`${c.carpeta}/${d.archivo}: "parte ${n}", pero el documento tiene ${total} partes`);
      }
    }
  }
  assert.deepEqual(problemas, [], `referencias a "parte N" rotas (arréglalas a mano):\n${problemas.join('\n')}`);
});
