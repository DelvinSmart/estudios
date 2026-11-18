// Panel · editar las clases desde el navegador (también desde el iPad).
//
//   #/            la llave, o la lista de cursos y clases
//   #/clase/45/0  editar una clase (el número es el de su carpeta; el último, cuál documento)
//
// Se edita parte por parte. Al guardar, el panel revisa con web/panel-reglas.js que no cambió
// el número de partes ni ninguna práctica (eso protege los certificados y las respuestas privadas),
// y recién entonces hace el commit en GitHub.

import { CLASES, CURSOS, clasesDelCurso } from './cursos.js';
import { conAlumno } from './lector.js';
import { separar, unir, aTexto, aLineas, revisar, practicasDe } from './panel-reglas.js';
import * as github from './panel-github.js';

const app = document.getElementById('app');
const rutaTerminal = document.getElementById('ruta-terminal');
const botonSalir = document.getElementById('boton-salir');

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = (n) => String(clasesDelCurso(cursoDe(n)).indexOf(n) + 1).padStart(2, '0');
const cursoDe = (n) => Object.keys(CURSOS).find((c) => clasesDelCurso(c).includes(n));

// Lo que está abierto ahora. "cambiadas" guarda qué pedazos se tocaron (-1 = la introducción).
let abierto = null; // { n, doc, ruta, sha, original, modelo, elegida, cambiadas: Set }

const hayCambios = () => abierto && unir(abierto.modelo) !== abierto.original;
window.addEventListener('beforeunload', (ev) => { if (hayCambios()) { ev.preventDefault(); ev.returnValue = ''; } });

// ---------- 1. La llave ----------
function pantallaLlave(aviso = '') {
  botonSalir.hidden = true;
  rutaTerminal.textContent = '~';
  app.innerHTML = `
    <section class="panel-llave">
      <h1 class="mono">Panel de clases</h1>
      <p>Para editar, pega tu llave de GitHub. Se guarda <strong>solo en este aparato</strong>: sin ella, este panel no puede cambiar nada.</p>
      <form id="form-llave" class="panel-form">
        <label for="campo-llave" class="mono">llave</label>
        <input id="campo-llave" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="github_pat_…" required>
        <button class="boton-principal" type="submit">Entrar</button>
      </form>
      <p class="panel-error" role="alert">${esc(aviso)}</p>
      <details class="panel-ayuda">
        <summary>¿Cómo saco la llave?</summary>
        <ol>
          <li>Abre <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">GitHub → nueva llave (fine-grained)</a>.</li>
          <li><strong>Repository access:</strong> “Only select repositories” → <code>${esc(github.REPO)}</code>. Solo ese.</li>
          <li><strong>Permissions → Contents:</strong> “Read and write”. Nada más.</li>
          <li>Ponle fecha de vencimiento (por ejemplo, 90 días), créala y pégala aquí.</li>
        </ol>
        <p>Así, aunque alguien te robara la llave, solo podría tocar el texto de este repositorio: no Firebase, no los certificados, no tus otras apps.</p>
      </details>
    </section>`;
  document.getElementById('form-llave').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const valor = document.getElementById('campo-llave').value.trim();
    github.guardarLlave(valor);
    try {
      await github.probarLlave();
      ir();
    } catch (e) {
      github.borrarLlave();
      pantallaLlave(e.status === 401 ? 'GitHub no aceptó esa llave (está mal copiada o ya venció).' : `No pude entrar: ${e.message}. ¿Hay internet?`);
    }
  });
}

// ---------- 2. La lista de clases ----------
function pantallaLista() {
  rutaTerminal.textContent = '~';
  const cursos = Object.values(CURSOS).map((c) => `
    <section class="panel-curso">
      <h2 class="mono">${c.icono} ${esc(c.titulo)}</h2>
      <ul class="panel-clases">
        ${clasesDelCurso(c.id).filter((n) => CLASES[n]).map((n) => `
          <li><a href="#/clase/${n}/0" data-buscar="${esc(`${CLASES[n].titulo} ${CLASES[n].meta} ${n}`.toLowerCase())}">
            <span class="mono tenue">${num(n)}</span> ${esc(CLASES[n].titulo)}
          </a></li>`).join('')}
      </ul>
    </section>`).join('');
  app.innerHTML = `
    <div class="panel-cabeza">
      <h1 class="mono">¿Qué clase quieres editar?</h1>
      <input id="filtro" class="panel-filtro" type="search" placeholder="buscar: git, funciones, kotlin…" autocomplete="off">
    </div>
    ${cursos}`;
  document.getElementById('filtro').addEventListener('input', (ev) => {
    const q = ev.target.value.trim().toLowerCase();
    app.querySelectorAll('.panel-clases a').forEach((a) => { a.parentElement.hidden = q && !a.dataset.buscar.includes(q); });
    app.querySelectorAll('.panel-curso').forEach((s) => { s.hidden = !s.querySelector('li:not([hidden])'); });
  });
}

// ---------- 3. Editar una clase ----------
async function pantallaClase(n, doc) {
  const c = CLASES[n];
  if (!c || !c.docs[doc]) { location.hash = '#/'; return; }
  const ruta = `${c.carpeta}/${c.docs[doc].archivo}`;
  rutaTerminal.textContent = `~/${c.carpeta}`;

  if (!abierto || abierto.ruta !== ruta) {
    app.innerHTML = `<p class="cargando">abriendo ${esc(ruta)}…</p>`;
    try {
      const { sha, texto } = await github.leer(ruta);
      abierto = { n, doc, ruta, sha, original: texto, modelo: separar(texto), elegida: 0, cambiadas: new Set() };
      if (!abierto.modelo.partes.length) abierto.elegida = -1;
    } catch (e) {
      if (e.status === 401) { github.borrarLlave(); pantallaLlave('La llave ya no sirve (venció o la borraste en GitHub).'); return; }
      app.innerHTML = `<p class="panel-error">No pude abrir ${esc(ruta)}: ${esc(e.message)}.</p><a class="boton" href="#/">← volver</a>`;
      return;
    }
  }
  dibujarClase();
}

function dibujarClase() {
  const { n, doc, modelo, elegida, cambiadas } = abierto;
  const c = CLASES[n];
  const pestanas = c.docs.length > 1
    ? `<nav class="pestanas">${c.docs.map((d, i) => `<a class="pestana${i === doc ? ' activa' : ''}" href="#/clase/${n}/${i}">${esc(d.titulo)}</a>`).join('')}</nav>`
    : '';
  const marca = (i) => (cambiadas.has(i) ? ' <span class="panel-punto" title="cambiada, sin guardar">●</span>' : '');
  const lista = [
    `<li><button type="button" data-i="-1" class="${elegida === -1 ? 'activa' : ''}"><span class="mono tenue">··</span> Introducción${marca(-1)}</button></li>`,
    ...modelo.partes.map((p, i) => `<li><button type="button" data-i="${i}" class="${elegida === i ? 'activa' : ''}">
      <span class="mono tenue">${String(i + 1).padStart(2, '0')}</span> ${esc(p.titulo)}${practicasDe(aTexto(p.cuerpo)).length ? ' <span title="tiene práctica">🔒</span>' : ''}${marca(i)}</button></li>`),
  ].join('');

  const pedazo = elegida === -1 ? null : modelo.partes[elegida];
  const cuerpo = aTexto(pedazo ? pedazo.cuerpo : modelo.cabeza);
  const conPractica = practicasDe(cuerpo).length > 0;

  app.innerHTML = `
    <div class="panel-cabeza">
      <a class="mono tenue" href="#/">← todas las clases</a>
      <h1 class="mono"><span class="tenue">${num(n)}</span> ${esc(c.titulo)}</h1>
      ${pestanas}
    </div>
    <div class="panel-editor">
      <aside class="panel-partes">
        <p class="mono tenue">partes</p>
        <ol>${lista}</ol>
      </aside>
      <section class="panel-hoja">
        ${pedazo ? `
          <label class="mono tenue" for="campo-titulo">título de la parte</label>
          <input id="campo-titulo" class="panel-titulo" type="text" value="${esc(pedazo.titulo)}">` : `
          <p class="mono tenue">introducción (el título <code>#</code> de la clase y lo que va antes de la primera parte)</p>`}
        ${conPractica ? '<p class="panel-nota">🔒 Esta parte tiene una práctica. Puedes cambiar el resto del texto, pero el bloque <code>```practica</code> tiene que quedar exactamente igual.</p>' : ''}
        <div class="panel-modos" role="tablist">
          <button type="button" class="pestana activa" data-modo="editar">editar</button>
          <button type="button" class="pestana" data-modo="ver">ver cómo queda</button>
        </div>
        <textarea id="campo-cuerpo" class="panel-cuerpo" spellcheck="true" autocapitalize="sentences">${esc(cuerpo)}</textarea>
        <div id="vista" class="texto panel-vista" hidden></div>
        <div class="acciones panel-guardar">
          <button id="boton-guardar" class="boton-principal" type="button"${hayCambios() ? '' : ' disabled'}>Guardar y publicar</button>
          <button id="boton-deshacer" class="boton" type="button"${hayCambios() ? '' : ' disabled'}>Deshacer todo</button>
          <a class="boton" href="./#/clase/${n}/${doc}" target="_blank" rel="noopener">Ver en la página ↗</a>
        </div>
        <div id="resultado" class="panel-resultado" role="status"></div>
      </section>
    </div>`;

  app.querySelectorAll('.panel-partes button').forEach((b) => b.addEventListener('click', () => {
    abierto.elegida = Number(b.dataset.i);
    dibujarClase();
    app.querySelector('.panel-hoja').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }));

  const campo = document.getElementById('campo-cuerpo');
  const titulo = document.getElementById('campo-titulo');
  const alCambiar = () => {
    if (pedazo) {
      pedazo.cuerpo = aLineas(campo.value);
      const nuevo = titulo.value.replace(/\s+/g, ' ').trim();
      if (nuevo !== pedazo.titulo) { pedazo.titulo = nuevo; pedazo.linea = `## ${nuevo}`; }
    } else {
      modelo.cabeza = aLineas(campo.value);
    }
    cambiadas.add(elegida);
    const hay = hayCambios();
    document.getElementById('boton-guardar').disabled = !hay;
    document.getElementById('boton-deshacer').disabled = !hay;
  };
  campo.addEventListener('input', alCambiar);
  titulo?.addEventListener('input', alCambiar);

  app.querySelectorAll('[data-modo]').forEach((b) => b.addEventListener('click', () => {
    const ver = b.dataset.modo === 'ver';
    app.querySelectorAll('[data-modo]').forEach((x) => x.classList.toggle('activa', x === b));
    campo.hidden = ver;
    const vista = document.getElementById('vista');
    vista.hidden = !ver;
    if (ver) pintarVista(vista, pedazo ? `## ${pedazo.titulo}\n${campo.value}` : campo.value, c.carpeta);
  }));

  document.getElementById('boton-deshacer').addEventListener('click', () => {
    if (!confirm('¿Borrar todos los cambios sin guardar de esta clase?')) return;
    abierto.modelo = separar(abierto.original);
    abierto.cambiadas.clear();
    if (abierto.elegida >= abierto.modelo.partes.length) abierto.elegida = -1;
    dibujarClase();
  });

  document.getElementById('boton-guardar').addEventListener('click', guardar);
}

async function guardar() {
  const resultado = document.getElementById('resultado');
  const boton = document.getElementById('boton-guardar');
  const editado = unir(abierto.modelo);
  const problemas = revisar(abierto.original, editado);
  if (problemas.length) {
    resultado.innerHTML = `<div class="panel-error"><strong>No se guardó.</strong><ul>${problemas.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`;
    return;
  }
  boton.disabled = true;
  boton.textContent = 'guardando…';
  const c = CLASES[abierto.n];
  const partes = [...abierto.cambiadas].sort((a, b) => a - b).map((i) => (i === -1 ? 'introducción' : `parte ${i + 1}`));
  const mensaje = `Panel: ${c.titulo} (clase ${abierto.n}) · ${partes.join(', ') || 'texto'}`;
  try {
    abierto.sha = await github.guardar(abierto.ruta, editado, abierto.sha, mensaje);
    abierto.original = editado;
    abierto.modelo = separar(editado);
    abierto.cambiadas.clear();
    dibujarClase();
    document.getElementById('resultado').innerHTML = '<div class="panel-ok"><strong>✓ Publicado.</strong> La página se actualiza en 1 o 2 minutos. Los audios de las partes que cambiaste se rehacen solos.</div>';
  } catch (e) {
    boton.disabled = false;
    boton.textContent = 'Guardar y publicar';
    const porque = e.status === 409 || e.status === 422
      ? 'La clase cambió en GitHub mientras la editabas (quizás desde la computadora). Copia tu texto, recarga la página y vuelve a pegarlo.'
      : e.status === 401 || e.status === 403 || e.status === 404
        ? 'GitHub no dejó guardar: la llave no tiene permiso de escribir (Contents: Read and write) o ya venció.'
        : `${e.message}. ¿Hay internet?`;
    resultado.innerHTML = `<div class="panel-error"><strong>No se guardó.</strong> ${esc(porque)}</div>`;
  }
}

// La vista previa: el mismo Markdown que la página, con los avisos de colores.
// Las prácticas se muestran como una caja cerrada (en la página son interactivas).
const AVISOS = { '🌎': 'vida-real', '💡': 'idea', '⚠️': 'cuidado', '🎤': 'entrevista', '📌': 'nota', '🎙️': 'profesor', '✋': 'pausa', '🔁': 'repaso' };
function pintarVista(caja, md, carpeta) {
  caja.innerHTML = window.marked.parse(conAlumno(md, ''));
  caja.querySelectorAll('blockquote').forEach((bq) => {
    const emoji = Object.keys(AVISOS).find((e) => bq.textContent.trim().startsWith(e));
    if (emoji) bq.classList.add('aviso', AVISOS[emoji]);
  });
  caja.querySelectorAll('pre > code').forEach((code) => {
    if (code.className.includes('language-practica')) {
      const n = code.textContent.trim().split('\n').filter(Boolean).length;
      code.parentElement.outerHTML = `<p class="panel-nota">🔒 Práctica (${n} ${n === 1 ? 'pregunta' : 'preguntas'}) · en la página es interactiva</p>`;
    } else if (code.className.includes('language-ejercicio')) {
      // Un ejercicio de código: aquí se muestra su título; en la página se escribe y se prueba.
      const titulo = (code.textContent.match(/^t[ií]tulo:\s*(.*)$/mi) || [])[1] || 'ejercicio';
      const pruebas = (code.textContent.match(/^\s*prueba\(/gm) || []).length;
      code.parentElement.outerHTML = `<p class="panel-nota">🧩 Ejercicio de código: ${esc(titulo)} (${pruebas} ${pruebas === 1 ? 'prueba' : 'pruebas'}) · en la página se escribe y se prueba</p>`;
    } else if (window.hljs) {
      try { window.hljs.highlightElement(code); } catch (e) {}
    }
  });
  caja.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:|data:|\/)/.test(src)) img.src = `${carpeta}/${src}`;
  });
  caja.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
}

// ---------- el camino ----------
async function ir() {
  if (!github.llave()) { pantallaLlave(); return; }
  botonSalir.hidden = false;
  const m = location.hash.match(/^#\/clase\/(\d+)\/(\d+)$/);
  if (m) { await pantallaClase(m[1], Number(m[2])); return; }
  if (hayCambios() && !confirm('Tienes cambios sin guardar en esta clase. ¿Salir igual y perderlos?')) {
    history.replaceState(null, '', `#/clase/${abierto.n}/${abierto.doc}`);
    return;
  }
  abierto = null;
  pantallaLista();
}

let ultimo = location.hash;
window.addEventListener('hashchange', () => {
  // Cambiar a otra clase (o a otra pestaña de la misma) con cambios sin guardar: preguntar antes.
  const m = location.hash.match(/^#\/clase\/(\d+)\/(\d+)$/);
  const otra = m && abierto && `${CLASES[m[1]]?.carpeta}/${CLASES[m[1]]?.docs[Number(m[2])]?.archivo}` !== abierto.ruta;
  if (otra && hayCambios() && !confirm('Tienes cambios sin guardar en esta clase. ¿Salir igual y perderlos?')) {
    history.replaceState(null, '', ultimo);
    return;
  }
  if (otra) abierto = null;
  ultimo = location.hash;
  ir();
});

botonSalir.addEventListener('click', () => {
  if (hayCambios() && !confirm('Tienes cambios sin guardar. ¿Salir igual?')) return;
  github.borrarLlave();
  abierto = null;
  location.hash = '#/';
  pantallaLlave();
});

ir();
