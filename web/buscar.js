// El buscador: lee todas las clases una vez y busca una palabra en todas.
// "función" y "funcion" cuentan igual (se ignoran tildes y mayúsculas).

import { CLASES } from './cursos.js';
import { numeroEnCurso } from './avance.js';
import { leerArchivo, partir, textoPlano } from './lector.js';

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
import { escapar } from './texto.js';
import { buscarEnGlosario } from './glosario.js';

// La tarjeta del glosario: la definición de la palabra, antes de los resultados de las clases.
function tarjetasGlosario(palabra) {
  const hallados = buscarEnGlosario(palabra).slice(0, 4);
  if (!hallados.length) return '';
  return '<p class="mono tenue">📖 en el glosario</p>' + hallados.map((e) => {
    const enlace = e.clase ? `<a class="tenue glosario-ir" href="#/clase/${e.clase}/0/1">ver la clase →</a>` : '';
    return `<div class="resultado glosario-def">
      <span><b>${escapar(e.termino)}</b><br>
      <span class="tenue">${escapar(e.definicion)}</span> ${enlace}</span>
    </div>`;
  }).join('');
}

let indice = null;

async function armarIndice() {
  if (indice) return indice;
  const trabajos = [];
  for (const [num, c] of Object.entries(CLASES)) {
    c.docs.forEach((d, doc) => {
      trabajos.push(leerArchivo(`${c.carpeta}/${d.archivo}`).then((md) => {
        return partir(md).partes.map((p, i) => {
          // Las respuestas no se buscan: si no, el buscador las mostraba antes de intentar.
          if (/^respuestas/i.test(textoPlano(p.titulo).trim())) return null;
          const texto = textoPlano(p.md.replace(/<details[\s\S]*?<\/details>/gi, ' '));
          return { num, doc, parte: i + 1, clase: c.titulo, docTitulo: d.titulo, titulo: textoPlano(p.titulo), texto, buscable: sinTildes(p.titulo + ' ' + texto) };
        });
      }).catch(() => []));
    });
  }
  indice = (await Promise.all(trabajos)).flat().filter(Boolean);
  return indice;
}

function recorte(texto, palabra) {
  const i = sinTildes(texto).indexOf(palabra);
  const desde = Math.max(0, i - 60);
  const trozo = (desde ? '…' : '') + texto.slice(desde, i + palabra.length + 90) + '…';
  const j = sinTildes(trozo).indexOf(palabra);
  if (j < 0) return escapar(trozo);
  return escapar(trozo.slice(0, j)) + '<mark>' + escapar(trozo.slice(j, j + palabra.length)) + '</mark>' + escapar(trozo.slice(j + palabra.length));
}

export function prepararBuscador() {
  const caja = document.getElementById('buscador');
  const entrada = document.getElementById('entrada-buscar');
  const resultados = document.getElementById('resultados');

  const abrir = () => { caja.hidden = false; entrada.focus(); armarIndice(); };
  const cerrar = () => { caja.hidden = true; };

  document.getElementById('boton-buscar').addEventListener('click', abrir);
  document.getElementById('cerrar-buscar').addEventListener('click', cerrar);
  caja.addEventListener('click', (ev) => { if (ev.target === caja) cerrar(); });
  resultados.addEventListener('click', (ev) => { if (ev.target.closest('a')) cerrar(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') cerrar();
    if (ev.key === '/' && caja.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { ev.preventDefault(); abrir(); }
  });

  let turno = 0;
  entrada.addEventListener('input', async () => {
    const palabra = sinTildes(entrada.value.trim());
    const mio = ++turno;
    const glosarioHTML = tarjetasGlosario(palabra);
    if (palabra.length < 2) { resultados.innerHTML = '<p class="mono tenue">escribe al menos 2 letras</p>'; return; }
    if (palabra.length < 3) {
      // Con 2 letras ya se puede mostrar el glosario (CI, PR, API…), pero no buscar en las clases.
      resultados.innerHTML = glosarioHTML || '<p class="mono tenue">escribe al menos 3 letras para buscar en las clases</p>';
      return;
    }
    resultados.innerHTML = glosarioHTML + '<p class="mono tenue">buscando en todas las clases…</p>';
    const todo = await armarIndice();
    if (mio !== turno) return; // ya escribió otra cosa
    const hallados = todo.filter((r) => r.buscable.includes(palabra)).slice(0, 40);
    resultados.innerHTML = glosarioHTML + (hallados.length
      ? `<p class="mono tenue">${hallados.length === 40 ? '40+' : hallados.length} resultados</p>` + hallados.map((r) => `
        <a class="resultado" href="#/clase/${r.num}/${r.doc}/${r.parte}">
          <span class="mono acento">${numeroEnCurso(r.num)}.${String(r.parte).padStart(2, '0')}</span>
          <span><b>${escapar(r.titulo)}</b> <span class="tenue">· ${escapar(r.clase)}${r.doc ? ' · ' + escapar(r.docTitulo) : ''}</span><br>
          <span class="tenue">${recorte(r.texto, palabra)}</span></span>
        </a>`).join('')
      : (glosarioHTML ? '' : '<p class="mono tenue">// nada encontrado</p>'));
  });
}
