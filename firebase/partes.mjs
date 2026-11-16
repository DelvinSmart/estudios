// Lista todas las partes de cada curso (los ids de los bombillos), leyendo los .md del disco.
// La usan: generar-reglas.mjs (para las reglas de Firestore) y las pruebas.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLASES, CURSOS, clasesDelCurso } from '../web/cursos.js';
import { partir } from '../web/lector.js';

const raiz = fileURLToPath(new URL('..', import.meta.url));

// { programacion: ['01:CLASE-GUIADA.md:1', …], seguridad: [ … ] }
export function listarPartes() {
  const porCurso = {};
  for (const curso of Object.keys(CURSOS)) {
    const ids = [];
    for (const n of clasesDelCurso(curso)) {
      const c = CLASES[n];
      const archivo = c.docs[0].archivo;
      const md = readFileSync(`${raiz}${c.carpeta}/${archivo}`, 'utf8');
      const k = partir(md).partes.length;
      for (let i = 1; i <= k; i++) ids.push(`${n}:${archivo}:${i}`);
    }
    porCurso[curso] = ids;
  }
  return porCurso;
}
