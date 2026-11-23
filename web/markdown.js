// El Markdown de las lecciones convertido en página: avisos de colores, código con botón de copiar,
// prácticas interactivas, tablas que se deslizan y enlaces que abren dentro del mapa.

import { CLASES } from './cursos.js';
import { crearPractica } from './practica.js';
import { crearEjercicio } from './ejercicio.js';
import { crearSnack } from './snack.js';
import { crearDibujo } from './dibujo.js';
import { escapar } from './pantalla.js';
import { enlazarReferencias } from './referencias.js';
import { cursoDeClase } from './avance.js';

// ---------- el Markdown convertido en página ----------

const AVISOS = { '🌎': 'vida-real', '💡': 'idea', '⚠️': 'cuidado', '🎤': 'entrevista', '📌': 'nota', '🎙️': 'profesor', '✋': 'pausa', '🔁': 'repaso' };

function resolver(href, carpeta) {
  const url = new URL(href, `http://x/${carpeta}/`);
  return { ruta: decodeURIComponent(url.pathname.slice(1)), ancla: url.hash };
}

function enlaceInterno(ruta) {
  for (const [num, c] of Object.entries(CLASES)) {
    if (ruta === `${c.carpeta}/README.md` || ruta === c.carpeta || ruta === `${c.carpeta}/`) return `#/clase/${num}`;
    const i = c.docs.findIndex((d) => ruta === `${c.carpeta}/${d.archivo}`);
    if (i >= 0) return `#/clase/${num}/${i}`;
  }
  return null;
}

export function pintarMarkdown(md, carpeta, idBase = carpeta) {
  const caja = document.createElement('div');
  caja.className = 'texto';
  caja.innerHTML = window.marked.parse(md);

  // Los avisos: una cita que empieza con 🌎, 💡, ⚠️… se vuelve tarjeta.
  caja.querySelectorAll('blockquote').forEach((bq) => {
    const inicio = bq.textContent.trim();
    const emoji = Object.keys(AVISOS).find((e) => inicio.startsWith(e));
    if (emoji) bq.classList.add('aviso', AVISOS[emoji]);
  });

  // Los bloques de código: colores, etiqueta del lenguaje y botón de copiar.
  let practicas = 0;
  let ejercicios = 0;
  let snacks = 0;
  caja.querySelectorAll('pre > code').forEach((code) => {
    const pre = code.parentElement;
    const lenguaje = (code.className.match(/language-(\S+)/) || [])[1] || 'texto';
    // Un bloque ```practica no es código: es un ejercicio interactivo.
    if (lenguaje === 'practica') {
      pre.replaceWith(crearPractica(code.textContent, `${idBase}:practica${++practicas}`));
      return;
    }
    // Un bloque ```ejercicio es código que escribe el alumno, con pruebas que se corren en una caja aislada.
    if (lenguaje === 'ejercicio') {
      pre.replaceWith(crearEjercicio(code.textContent, `${idBase}:ejercicio${++ejercicios}`));
      return;
    }
    // Un bloque ```snack abre la app de React Native en Expo Snack, con una lista de lo que se tiene que ver.
    if (lenguaje === 'snack') {
      pre.replaceWith(crearSnack(code.textContent, `${idBase}:snack${++snacks}`));
      return;
    }
    // Un bloque ```dibujo es un diagrama hecho con el motor de dibujos del curso.
    if (lenguaje === 'dibujo') {
      pre.replaceWith(crearDibujo(code.textContent));
      return;
    }
    if (window.hljs && lenguaje !== 'texto') {
      try { window.hljs.highlightElement(code); } catch (e) { /* lenguaje desconocido */ }
    }
    const marco = document.createElement('div');
    marco.className = 'codigo';
    marco.innerHTML = `<div class="codigo-barra"><span class="puntos"><i></i><i></i><i></i></span>
      <span class="lenguaje">${escapar(lenguaje)}</span>
      <button class="copiar" type="button">copiar</button></div>`;
    pre.replaceWith(marco);
    marco.appendChild(pre);
    marco.querySelector('.copiar').addEventListener('click', async (ev) => {
      const boton = ev.currentTarget;
      try { await navigator.clipboard.writeText(code.textContent); boton.textContent = '✓ copiado'; }
      catch (e) { boton.textContent = 'no se pudo'; }
      setTimeout(() => { boton.textContent = 'copiar'; }, 1600);
    });
  });

  // Las tablas anchas se deslizan de lado en el celular.
  caja.querySelectorAll('table').forEach((t) => {
    const envoltura = document.createElement('div');
    envoltura.className = 'tabla';
    t.replaceWith(envoltura);
    envoltura.appendChild(t);
  });

  // Enlaces a otras clases → abren dentro del mapa. Imágenes → ruta correcta.
  caja.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (/^(https?:|mailto:|#)/.test(href)) {
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
      return;
    }
    const { ruta, ancla } = resolver(href, carpeta);
    a.setAttribute('href', enlaceInterno(ruta) || ruta + ancla);
  });
  caja.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:|data:)/.test(src)) img.setAttribute('src', resolver(src, carpeta).ruta);
    img.loading = 'lazy';
  });

  // "Tema 07" → enlace con el número que se ve en el mapa (el motor de referencias).
  const numDeEsta = Object.keys(CLASES).find((n) => CLASES[n].carpeta === carpeta);
  enlazarReferencias(caja, numDeEsta ? cursoDeClase(numDeEsta) : null);

  return caja;
}