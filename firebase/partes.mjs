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

// El índice que lee la página al arrancar (web/indice.json): cuántas partes tiene cada clase y sus títulos.
// Antes la página bajaba las 104 lecciones (casi 3 MB) solo para contar sus "## ". Ahora baja este archivo chico.
// Se genera junto con las reglas (node firebase/generar-reglas.mjs), así nunca quedan distintos.
export function construirIndice() {
  const clases = {};
  for (const [n, c] of Object.entries(CLASES)) {
    const md = readFileSync(`${raiz}${c.carpeta}/${c.docs[0].archivo}`, 'utf8');
    const partes = partir(md).partes;
    clases[n] = { partes: partes.length, titulos: partes.map((p) => p.titulo) };
  }
  return { aviso: 'Archivo generado por firebase/generar-reglas.mjs: no lo edites a mano.', clases };
}

// Los bombillos se guardan con la POSICIÓN de la parte (01:CLASE-GUIADA.md:3). Si en una clase ya publicada
// se inserta, quita o reordena un "## ", el progreso de los alumnos se corre. Agregar partes AL FINAL es seguro.
// Devuelve la lista de clases donde las partes viejas ya no están en el mismo lugar.
export function partesMovidas(viejo, nuevo) {
  const movidas = [];
  for (const [n, v] of Object.entries(viejo?.clases || {})) {
    const t = nuevo.clases[n]?.titulos || [];
    const igual = v.titulos.every((titulo, i) => t[i] === titulo);
    if (!igual) movidas.push(n);
  }
  return movidas;
}
