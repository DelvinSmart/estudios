// El motor de referencias entre clases.
//
// En el texto de las lecciones se escribe "Tema 07" o "la clase 53" con el número de la CARPETA
// (el id, que nunca cambia). Al mostrarlo, este motor lo convierte en un enlace con el número que
// se ve en el mapa (el lugar de la clase dentro de su curso) y, si es de otro curso, dice de cuál.
// Así, si una clase cambia de lugar o se agrega una nueva, TODAS las referencias se actualizan
// solas: ningún número escrito a mano, ninguna migración.
//
// Ejemplos:  "Tema 04"  → "Tema 05" (enlace)   ·   "clases 61 a 65" → "clases 05 a 09 de Kotlin"
//
// Importa SOLO datos (cursos.js) y texto.js: nada del navegador. Así se puede probar en Node
// (herramientas/referencias.test.mjs) y se usa también al leer los .md.

import { CLASES, CURSOS, ETAPAS, cursoDeEtapa, clasesDelCurso } from './cursos.js';
import { escapar } from './texto.js';

// El número que se ve en el mapa, sin depender del navegador (igual que numeroEnCurso de avance.js).
const etapaDe = (num) => ETAPAS.find((e) => e.clases.includes(num));
export const cursoDeClase = (num) => cursoDeEtapa(etapaDe(num) || {});
export const numeroEnCurso = (num) => String(clasesDelCurso(cursoDeClase(num)).indexOf(num) + 1).padStart(2, '0');

// "Tema 07", "Temas 02 y 03", "clase 53", "clases 61 a 65", "Tema 11, 12 y 13".
// Dos o tres dígitos: las clases van de 00 a 115. (Antes solo tomaba dos, y las 100-115 quedaban sin enlazar.)
const NUM = '\\d{2,3}';
const PATRON = new RegExp(`\\b(Temas?|[Cc]lases?)(\\s+)(${NUM}(?:\\s*(?:,|y|a|e|o)\\s*${NUM})*)\\b`, 'g');
const HAY = new RegExp(PATRON.source); // sin la g: para preguntar sin mover lastIndex

function enlace(num) {
  const c = CLASES[num];
  return `<a class="ref-clase" href="#/clase/${num}" title="${escapar(`${CURSOS[cursoDeClase(num)].titulo} · ${numeroEnCurso(num)} ${c.titulo}`)}">${numeroEnCurso(num)}</a>`;
}

// Arma el HTML de una referencia: "Tema 07" → "Tema <a>08</a>", y "de Python" si es de otro curso.
function reemplazar(palabra, espacio, numeros, cursoActual) {
  const nums = numeros.match(/\d{2,3}/g);
  if (!nums.every((n) => CLASES[n])) return null; // si no son clases conocidas, se deja igual
  const html = numeros.replace(/\d{2,3}/g, (n) => enlace(n));
  const cursos = [...new Set(nums.map(cursoDeClase))];
  const otro = cursos.length === 1 && cursos[0] !== cursoActual ? ` de ${escapar(CURSOS[cursos[0]].titulo)}` : '';
  return `${escapar(palabra)}${espacio}${html}${otro}`;
}

// Transforma un texto plano en HTML con las referencias enlazadas (y el resto escapado).
// Función pura: la usa tanto el navegador como la prueba. Devuelve null si no hubo ningún cambio.
export function transformarTexto(texto, cursoActual) {
  let cambio = false;
  const html = escapar(texto).replace(PATRON, (todo, palabra, espacio, numeros) => {
    const r = reemplazar(palabra, espacio, numeros, cursoActual);
    if (r) cambio = true;
    return r ?? todo;
  });
  return cambio ? html : null;
}

// Recorre el texto de "raiz" (sin tocar código ni enlaces) y convierte las referencias. Solo navegador.
export function enlazarReferencias(raiz, cursoActual) {
  const caminante = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('pre, code, a, .codigo, textarea') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const textos = [];
  while (caminante.nextNode()) if (HAY.test(caminante.currentNode.nodeValue)) textos.push(caminante.currentNode);
  for (const nodo of textos) {
    const html = transformarTexto(nodo.nodeValue, cursoActual);
    if (!html) continue;
    const plantilla = document.createElement('template');
    plantilla.innerHTML = html;
    nodo.replaceWith(plantilla.content);
  }
}

// Para la prueba: los ids de clase que el texto nombra ("Tema 04") pero que NO existen.
export function referenciasRotas(texto) {
  const rotas = [];
  for (const m of texto.matchAll(PATRON)) {
    for (const n of m[3].match(/\d{2,3}/g)) if (!CLASES[n]) rotas.push(n);
  }
  return rotas;
}
