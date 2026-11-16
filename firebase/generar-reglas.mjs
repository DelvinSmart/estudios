// Genera firebase/firestore.rules a partir de reglas.plantilla y la lista real de partes.
// Córrelo cada vez que agregues o quites partes (## títulos) de una clase:
//   node firebase/generar-reglas.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { listarPartes } from './partes.mjs';

export const ESPERA_SEGUNDOS = 60;
const aqui = new URL('.', import.meta.url);

export function construirReglas(espera = ESPERA_SEGUNDOS) {
  const ids = listarPartes();
  const texto = readFileSync(new URL('reglas.plantilla', aqui), 'utf8')
    .replace('__PARTES__', '[\n        ' + ids.map((i) => `'${i}'`).join(',\n        ') + '\n      ]')
    .replaceAll('__TOTAL__', String(ids.length))
    .replaceAll('__ESPERA__', String(espera));
  return { texto, ids };
}

// Solo escribe el archivo cuando lo corres directo (no cuando lo importan las pruebas).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { texto, ids } = construirReglas();
  writeFileSync(new URL('firestore.rules', aqui), texto);
  console.log(`firestore.rules: ${ids.length} partes, ${ESPERA_SEGUNDOS} s entre bombillos`);
}
