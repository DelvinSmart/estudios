// Lista todas las partes del curso (los ids de los bombillos), leyendo los .md del disco.
// La usan: generar-reglas.mjs (para las reglas de Firestore) y las pruebas.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLASES, ETAPAS } from '../web/cursos.js';
import { partir } from '../web/lector.js';

const raiz = fileURLToPath(new URL('..', import.meta.url));

export function listarPartes() {
  const ids = [];
  for (const n of ETAPAS.flatMap((e) => e.clases)) {
    const c = CLASES[n];
    const archivo = c.docs[0].archivo;
    const md = readFileSync(`${raiz}${c.carpeta}/${archivo}`, 'utf8');
    const k = partir(md).partes.length;
    for (let i = 1; i <= k; i++) ids.push(`${n}:${archivo}:${i}`);
  }
  return ids;
}
