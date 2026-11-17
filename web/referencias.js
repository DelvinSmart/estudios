// El motor de referencias entre clases.
//
// En el texto de las lecciones se escribe "Tema 07" o "la clase 53" con el número de la CARPETA
// (que nunca cambia). Al mostrarlo, este motor lo convierte en un enlace con el número que se ve
// en el mapa (el lugar de la clase dentro de su curso) y, si es de otro curso, dice de cuál.
// Así, si una clase cambia de lugar, todas las referencias se actualizan solas: nada escrito a mano.

import { CLASES, CURSOS } from './cursos.js';
import { numeroEnCurso, cursoDeClase } from './avance.js';
import { escapar } from './pantalla.js';

// "Tema 07", "Temas 02 y 03", "clase 53", "clases 61 a 65", "Tema 11, 12 y 13"
const PATRON = /\b(Temas?|[Cc]lases?)(\s+)(\d{2}(?:\s*(?:,|y|a|e|o)\s*\d{2})*)\b/g;
const HAY = new RegExp(PATRON.source);   // sin la g: para preguntar sin mover lastIndex

function enlace(num) {
  const c = CLASES[num];
  return `<a class="ref-clase" href="#/clase/${num}" title="${escapar(`${CURSOS[cursoDeClase(num)].titulo} · ${numeroEnCurso(num)} ${c.titulo}`)}">${numeroEnCurso(num)}</a>`;
}

// Arma el HTML de una referencia: "Tema 07" → "Tema <a>08</a>", y "de Python" si es de otro curso.
function reemplazar(palabra, espacio, numeros, cursoActual) {
  const nums = numeros.match(/\d{2}/g);
  if (!nums.every((n) => CLASES[n])) return null;   // si no son clases conocidas, se deja igual
  const html = numeros.replace(/\d{2}/g, (n) => enlace(n));
  const cursos = [...new Set(nums.map(cursoDeClase))];
  const otro = cursos.length === 1 && cursos[0] !== cursoActual ? ` de ${escapar(CURSOS[cursos[0]].titulo)}` : '';
  return `${escapar(palabra)}${espacio}${html}${otro}`;
}

// Recorre el texto de "raiz" (sin tocar código ni enlaces) y convierte las referencias.
export function enlazarReferencias(raiz, cursoActual) {
  const caminante = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('pre, code, a, .codigo, textarea') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const textos = [];
  while (caminante.nextNode()) if (HAY.test(caminante.currentNode.nodeValue)) textos.push(caminante.currentNode);
  for (const nodo of textos) {
    PATRON.lastIndex = 0;
    let cambio = false;
    const html = escapar(nodo.nodeValue).replace(PATRON, (todo, palabra, espacio, numeros) => {
      const r = reemplazar(palabra, espacio, numeros, cursoActual);
      if (r) cambio = true;
      return r ?? todo;
    });
    if (!cambio) continue;
    const plantilla = document.createElement('template');
    plantilla.innerHTML = html;
    nodo.replaceWith(plantilla.content);
  }
}
