// El cerebro de la página: mira la dirección (#/...) y dibuja la pantalla que toca.
//   #/                      → el mapa grande (las etapas)
//   #/etapa/web             → el mapa de una etapa (sus clases)
//   #/clase/15              → el mapa de una clase (sus partes)
//   #/clase/15/0/3          → leer la parte 3 del documento 0
//   #/clase/15/0/todo       → leer la clase entera de corrido
//   #/progreso              → mi progreso: un bombillo por cada parte
//   #/certificado[/muestra] → el certificado (de verdad, desde Firebase) o su muestra
//   #/verificar/ME-…        → cualquiera comprueba si un código existe
//   #/entrar[/crear|ayuda…] → la cuenta (solo Gmail): entrar, crear, recuperar
//   #/cuenta                → mi cuenta

import { CLASES, ETAPAS, CURSOS, cursoDeEtapa, clasesDelCurso } from './cursos.js';
import { leerArchivo, partir, textoPlano } from './lector.js';
import { idParte, estaEntendida, marcarEntendida, recienPrendidos, olvidarRecien, exportarProgreso, importarProgreso, leerTema, guardarTema, leerNombre, guardarNombre } from './guardado.js';
import { prepararBuscador } from './buscar.js';
import { crearPractica } from './practica.js';
import * as nube from './nube.js';

const app = document.getElementById('app');
const migas = document.getElementById('migas');
const rutaTerminal = document.getElementById('ruta-terminal');

// Cuántas partes (bombillos) tiene cada clase: se cuenta al arrancar.
const conteo = {};
const ORDEN = ETAPAS.flatMap((e) => e.clases);

// ---------- utilidades ----------

const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const enLinea = (md) => window.marked.parseInline(md);
const dos = (n) => String(n).padStart(2, '0');

function rutaDoc(num, doc = 0) {
  const c = CLASES[num];
  return `${c.carpeta}/${c.docs[doc].archivo}`;
}

function etapaDe(num) {
  return ETAPAS.find((e) => e.clases.includes(num));
}

// A qué curso pertenece una clase, y las clases y partes de cada curso.
const cursoDeClase = (num) => cursoDeEtapa(etapaDe(num) || {});
const ordenDe = (curso) => clasesDelCurso(curso);
const totalPartes = (curso) => ordenDe(curso).reduce((s, n) => s + (conteo[n] || 0), 0);

// Los bombillos prendidos de una clase (en su documento principal).
function prendidos(num) {
  let n = 0;
  for (let i = 1; i <= (conteo[num] || 0); i++) if (estaEntendida(idParte(num, 0, i))) n++;
  return n;
}

// El progreso sale SOLO de los bombillos de este navegador: cada persona ve el suyo.
// "Voy aquí" es la primera clase del mapa que todavía no tiene todos sus bombillos prendidos.
function claseActual() {
  return ORDEN.find((n) => !conteo[n] || prendidos(n) < conteo[n]);
}

function estadoClase(num) {
  if (conteo[num] && prendidos(num) === conteo[num]) return 'hecha';
  if (num === claseActual()) return 'actual';
  return prendidos(num) > 0 ? 'empezada' : 'pendiente';
}

const ETIQUETA_ESTADO = { hecha: '✓ hecha', actual: '▶ voy aquí', empezada: '◐ empezada', pendiente: '○ pendiente' };

function avisar(texto) {
  const aviso = document.createElement('a');
  aviso.className = 'tostada mono';
  aviso.href = '#/progreso';
  aviso.innerHTML = texto;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.classList.add('saliendo'), 2600);
  setTimeout(() => aviso.remove(), 3200);
}

function ponerMigas(lista) {
  migas.innerHTML = lista
    .map((m, i) => (i < lista.length - 1 && m.href
      ? `<a href="${m.href}">${m.texto}</a>`
      : `<span aria-current="page">${m.texto}</span>`))
    .join('<span class="sep">/</span>');
  rutaTerminal.textContent = lista.length > 1 ? '~/' + lista.slice(1).map((m) => m.corto).join('/') : '~';
}

function mostrarError(err) {
  app.innerHTML = `<div class="error mono"><p>✗ ${escapar(err.message)}</p>
    <p class="tenue">Si abriste el archivo con doble clic, la página no puede leer las lecciones.
    Hay que abrirla con un servidor (ver la clase 18) o desde GitHub Pages.</p>
    <p><a href="#/">← volver al mapa</a></p></div>`;
}

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

function pintarMarkdown(md, carpeta, idBase = carpeta) {
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
  caja.querySelectorAll('pre > code').forEach((code) => {
    const pre = code.parentElement;
    const lenguaje = (code.className.match(/language-(\S+)/) || [])[1] || 'texto';
    // Un bloque ```practica no es código: es un ejercicio interactivo.
    if (lenguaje === 'practica') {
      pre.replaceWith(crearPractica(code.textContent, `${idBase}:practica${++practicas}`));
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

  return caja;
}

// ---------- pantalla 1: el mapa grande ----------

function vistaInicio() {
  ponerMigas([{ texto: 'mapa', href: '#/' }]);
  const total = Object.keys(CLASES).length;
  const hechas = Object.keys(CLASES).filter((n) => estadoClase(n) === 'hecha').length;
  const actual = claseActual();
  const totalBombillos = ORDEN.reduce((s, n) => s + (conteo[n] || 0), 0);
  const prendidosTodos = ORDEN.reduce((s, n) => s + prendidos(n), 0);

  const etapas = ETAPAS.map((e, i) => {
    const listas = e.clases.filter((n) => estadoClase(n) === 'hecha').length;
    const puntos = e.clases.map((n) => `<i class="punto ${estadoClase(n)}" title="${dos(n)} ${escapar(CLASES[n].titulo)}"></i>`).join('');
    const tieneActual = e.clases.includes(actual);
    return `
      <li class="parada ${tieneActual ? 'aqui' : ''}" style="--i:${i}">
        <a class="nodo nodo-grande" href="#/etapa/${e.id}">
          <span class="nodo-num">${dos(i + 1)}</span>
          <span class="nodo-cuerpo">
            <span class="nodo-titulo"><span class="emoji">${e.icono}</span> ${escapar(e.titulo)}</span>
            <span class="nodo-desc">${escapar(e.desc)}</span>
            <span class="nodo-pie"><span class="puntos-clases">${puntos}</span>
              <span class="mono tenue">${listas}/${e.clases.length} clases</span>
              ${tieneActual ? '<span class="insignia actual">▶ voy aquí</span>' : ''}</span>
          </span>
          <span class="flecha">→</span>
        </a>
      </li>`;
  }).join('');

  app.innerHTML = `
    <section class="portada">
      <p class="mono comentario">// mi carrera de programación</p>
      <h1 class="titulo-grande">Mapa de <span class="acento">estudios</span></h1>
      <p class="bajada">Primero los fundamentos, después la web, los datos y la arquitectura.
        Al final, la inteligencia artificial. Cada parada se abre en otro mapa por dentro.</p>
      <div class="contadores mono">
        <span><b>${ETAPAS.length}</b> etapas</span>
        <span><b>${total}</b> clases</span>
        <span><b>${hechas}</b> terminadas</span>
        <a class="contador-bombillos" href="#/progreso"><span class="bombillo-chico ${prendidosTodos ? 'prendido' : ''}">💡</span><b>${prendidosTodos}</b>/${totalBombillos} bombillos</a>
      </div>
      <div class="barra-progreso" role="progressbar" aria-valuenow="${hechas}" aria-valuemax="${total}"><span style="width:${(hechas / total) * 100}%"></span></div>
      <div class="acciones">
        ${actual ? `<a class="boton-principal" href="#/clase/${actual}">▶ ${prendidosTodos ? 'seguir donde quedé' : 'empezar'}: clase ${actual}, ${escapar(CLASES[actual].titulo)}</a>` : ''}
        <a class="boton" href="#/progreso">💡 mi progreso</a>
      </div>
    </section>
    <ol class="camino">${etapas}</ol>
    <p class="mono tenue centro final-camino">// fin del camino: ya puedes explicar todo en una entrevista</p>
    <p class="centro"><a class="boton" href="#/certificado">🎓 certificado de finalización</a></p>`;
}

// ---------- pantalla 2: el mapa de una etapa ----------

async function vistaEtapa(id) {
  const etapa = ETAPAS.find((e) => e.id === id);
  if (!etapa) return vistaInicio();
  const n = ETAPAS.indexOf(etapa) + 1;
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: `${dos(n)} ${escapar(etapa.titulo)}`, corto: etapa.id }]);

  const paradas = etapa.clases.map((num, i) => {
    const c = CLASES[num];
    const est = estadoClase(num);
    return `
      <li class="parada" style="--i:${i}">
        <a class="nodo" href="#/clase/${num}">
          <span class="nodo-num">${num}</span>
          <span class="nodo-cuerpo">
            <span class="nodo-titulo">${escapar(c.titulo)}</span>
            <span class="nodo-desc">${escapar(c.meta)}</span>
            <span class="nodo-pie"><span class="insignia ${est}">${ETIQUETA_ESTADO[est]}</span>
              <span class="mono tenue" data-partes="${num}">…</span></span>
          </span>
          <span class="flecha">→</span>
        </a>
      </li>`;
  }).join('');

  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// etapa ${dos(n)} de ${ETAPAS.length}</p>
      <h1 class="titulo-medio"><span class="emoji">${etapa.icono}</span> ${escapar(etapa.titulo)}</h1>
      <p class="bajada">${escapar(etapa.desc)}</p>
    </section>
    <ol class="camino">${paradas}</ol>
    ${navegarEtapas(n)}`;

  // Cuántas partes tiene cada clase (se lee de su LECCION.md).
  etapa.clases.forEach(async (num) => {
    const casilla = app.querySelector(`[data-partes="${num}"]`);
    try {
      const { partes } = partir(await leerArchivo(rutaDoc(num)));
      const listas = partes.filter((_, i) => estaEntendida(idParte(num, 0, i + 1))).length;
      if (casilla) casilla.textContent = `${partes.length} partes · ${listas} entendidas`;
    } catch (e) {
      if (casilla) casilla.textContent = 'todavía no existe';
    }
  });
}

function navegarEtapas(n) {
  const antes = ETAPAS[n - 2];
  const despues = ETAPAS[n];
  return `<nav class="pasos">
    ${antes ? `<a class="paso" href="#/etapa/${antes.id}">← ${escapar(antes.titulo)}</a>` : '<span></span>'}
    ${despues ? `<a class="paso derecha" href="#/etapa/${despues.id}">${escapar(despues.titulo)} →</a>` : '<span></span>'}
  </nav>`;
}

// ---------- pantalla 3: el mapa de una clase ----------

async function vistaClase(num, doc) {
  const c = CLASES[num];
  if (!c) return vistaInicio();
  if (!c.docs[doc]) doc = 0;
  const etapa = etapaDe(num);
  const n = ETAPAS.indexOf(etapa) + 1;
  ponerMigas([
    { texto: 'mapa', href: '#/' },
    { texto: `${dos(n)} ${escapar(etapa.titulo)}`, href: `#/etapa/${etapa.id}`, corto: etapa.id },
    { texto: `${num} ${escapar(c.titulo)}`, corto: c.carpeta },
  ]);

  const md = await leerArchivo(rutaDoc(num, doc));
  const { titulo, intro, partes } = partir(md);
  const listas = partes.filter((_, i) => estaEntendida(idParte(num, doc, i + 1))).length;

  const pestanas = c.docs.length > 1
    ? `<div class="pestanas" role="tablist">${c.docs.map((d, i) =>
      `<a role="tab" class="pestana ${i === doc ? 'activa' : ''}" href="#/clase/${num}/${i}">${escapar(d.titulo)}</a>`).join('')}</div>`
    : '';

  const paradas = partes.map((p, i) => {
    const id = idParte(num, doc, i + 1);
    const hecha = estaEntendida(id);
    const subs = p.sub.length
      ? `<span class="subs">${p.sub.slice(0, 8).map((s) => `<span class="sub">${enLinea(s)}</span>`).join('')}${p.sub.length > 8 ? `<span class="sub tenue">+${p.sub.length - 8}</span>` : ''}</span>`
      : '';
    const marcas = [
      p.tieneEjemplo ? '<span title="tiene ejemplo de la vida real">🌎</span>' : '',
      p.tieneCodigo ? '<span class="mono" title="tiene código">&lt;/&gt;</span>' : '',
    ].join('');
    return `
      <li class="parada ${hecha ? 'lista' : ''}" style="--i:${Math.min(i, 12)}">
        <a class="nodo" href="#/clase/${num}/${doc}/${i + 1}">
          <span class="nodo-num">${hecha ? '✓' : dos(i + 1)}</span>
          <span class="nodo-cuerpo">
            <span class="nodo-titulo">${enLinea(p.titulo)}</span>
            ${p.resumen ? `<span class="nodo-desc">${escapar(p.resumen)}</span>` : ''}
            ${subs}
            <span class="nodo-pie marcas">${marcas}</span>
          </span>
          <span class="flecha">→</span>
        </a>
      </li>`;
  }).join('');

  const est = estadoClase(num);
  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// clase ${num} · <span class="insignia ${est}">${ETIQUETA_ESTADO[est]}</span></p>
      <h1 class="titulo-medio">${enLinea(titulo || c.titulo)}</h1>
      <p class="bajada">${escapar(c.meta)}</p>
      ${pestanas}
      <div class="fila-progreso mono">
        <div class="barra-progreso"><span style="width:${partes.length ? (listas / partes.length) * 100 : 0}%"></span></div>
        <span>${listas}/${partes.length} partes entendidas</span>
      </div>
      <div class="acciones">
        ${partes.length ? `<a class="boton-principal" href="#/clase/${num}/${doc}/${primeraPendiente(num, doc, partes.length)}">▶ ${listas ? 'seguir' : 'empezar'}</a>` : ''}
        <a class="boton" href="#/clase/${num}/${doc}/todo">leer todo de corrido</a>
      </div>
    </section>
    <div id="intro"></div>
    <ol class="camino camino-partes">${paradas}</ol>
    ${navegarClases(num)}`;

  if (intro) {
    const det = document.createElement('details');
    det.className = 'intro';
    det.innerHTML = '<summary class="mono">// introducción de la clase</summary>';
    det.appendChild(pintarMarkdown(intro, c.carpeta));
    if (!partes.length) det.open = true;
    app.querySelector('#intro').appendChild(det);
  }
}

function primeraPendiente(num, doc, total) {
  for (let i = 1; i <= total; i++) if (!estaEntendida(idParte(num, doc, i))) return i;
  return 1;
}

function navegarClases(num) {
  const orden = ETAPAS.flatMap((e) => e.clases);
  const i = orden.indexOf(num);
  const antes = orden[i - 1];
  const despues = orden[i + 1];
  return `<nav class="pasos">
    ${antes ? `<a class="paso" href="#/clase/${antes}">← ${antes} ${escapar(CLASES[antes].titulo)}</a>` : '<span></span>'}
    ${despues ? `<a class="paso derecha" href="#/clase/${despues}">${despues} ${escapar(CLASES[despues].titulo)} →</a>` : '<span></span>'}
  </nav>`;
}

// ---------- pantalla 4: leer una parte ----------

async function vistaParte(num, doc, cual) {
  const c = CLASES[num];
  if (!c || !c.docs[doc]) return vistaInicio();
  const etapa = etapaDe(num);
  const n = ETAPAS.indexOf(etapa) + 1;
  const md = await leerArchivo(rutaDoc(num, doc));
  const { titulo, intro, partes } = partir(md);
  const todo = cual === 'todo';
  const i = todo ? 0 : Math.min(Math.max(parseInt(cual, 10) || 1, 1), partes.length);
  const parte = partes[i - 1];

  ponerMigas([
    { texto: 'mapa', href: '#/' },
    { texto: `${dos(n)}`, href: `#/etapa/${etapa.id}`, corto: etapa.id },
    { texto: `${num} ${escapar(c.titulo)}`, href: `#/clase/${num}/${doc}`, corto: c.carpeta },
    { texto: todo ? 'todo' : `parte ${dos(i)}`, corto: todo ? 'todo' : dos(i) },
  ]);

  const indice = partes.map((p, k) => {
    const hecha = estaEntendida(idParte(num, doc, k + 1));
    return `<a class="${k + 1 === i ? 'activa' : ''} ${hecha ? 'lista' : ''}" href="#/clase/${num}/${doc}/${k + 1}">
      <span class="mono">${hecha ? '✓' : dos(k + 1)}</span> ${enLinea(p.titulo)}</a>`;
  }).join('');

  app.innerHTML = `
    <div class="lectura">
      <aside class="indice">
        <p class="mono comentario">// ${escapar(c.docs[doc].titulo.toLowerCase())}</p>
        <a class="indice-clase" href="#/clase/${num}/${doc}">${num} · ${enLinea(titulo || c.titulo)}</a>
        <nav>${indice}</nav>
      </aside>
      <article class="hoja" id="hoja"></article>
    </div>`;
  const hoja = app.querySelector('#hoja');

  if (todo) {
    hoja.insertAdjacentHTML('beforeend', `<p class="mono comentario">// clase ${num} completa</p><h1 class="titulo-medio">${enLinea(titulo || c.titulo)}</h1>`);
    if (intro) hoja.appendChild(pintarMarkdown(intro, c.carpeta));
    partes.forEach((p, k) => {
      hoja.insertAdjacentHTML('beforeend', `<h2 class="titulo-parte"><span class="mono acento">${dos(k + 1)}</span> ${enLinea(p.titulo)}</h2>`);
      hoja.appendChild(pintarMarkdown(p.md, c.carpeta, idParte(num, doc, k + 1)));
    });
    hoja.insertAdjacentHTML('beforeend', `<nav class="pasos"><a class="paso" href="#/clase/${num}/${doc}">← volver al mapa de la clase</a><span></span></nav>`);
  } else if (parte) {
    const id = idParte(num, doc, i);
    hoja.insertAdjacentHTML('beforeend', `
      <p class="mono comentario">// parte ${dos(i)} de ${dos(partes.length)}</p>
      <h1 class="titulo-parte grande">${enLinea(parte.titulo)}</h1>`);
    if (parte.sub.length > 1) {
      hoja.insertAdjacentHTML('beforeend', `<div class="mini-mapa">${parte.sub.map((s, k) =>
        `<a href="#" data-sub="${k}">${/^\d/.test(s) ? '' : `<span class="mono acento">${dos(i)}.${k + 1}</span> `}${enLinea(s)}</a>`).join('')}</div>`);
    }
    hoja.appendChild(pintarMarkdown(parte.md, c.carpeta, idParte(num, doc, i)));

    // El mini mapa salta a cada subtítulo de la parte.
    const subtitulos = hoja.querySelectorAll('.texto h3');
    hoja.querySelectorAll('[data-sub]').forEach((a) => a.addEventListener('click', (ev) => {
      ev.preventDefault();
      subtitulos[+a.dataset.sub]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    const hecha = estaEntendida(id);
    hoja.insertAdjacentHTML('beforeend', `
      <div class="entendido">
        <button class="boton ${hecha ? 'activo' : ''}" id="boton-entendido" type="button">${hecha ? '✓ ya lo entendí' : '¿lo entendiste? márcalo'}</button>
        <span class="tenue">Márcalo solo si lo puedes explicar en voz alta.</span>
        <span class="nube-parte mono tenue" id="nube-parte"></span>
      </div>
      <nav class="pasos">
        ${i > 1 ? `<a class="paso" href="#/clase/${num}/${doc}/${i - 1}">← ${enLinea(partes[i - 2].titulo)}</a>` : `<a class="paso" href="#/clase/${num}/${doc}">← mapa de la clase</a>`}
        ${i < partes.length ? `<a class="paso derecha" href="#/clase/${num}/${doc}/${i + 1}">${enLinea(partes[i].titulo)} →</a>` : `<a class="paso derecha" href="#/clase/${num}/${doc}">terminé: volver al mapa ✓</a>`}
      </nav>`);
    // Si la parte tiene prácticas, el bombillo no se prende hasta aprobarlas todas.
    const botonEntendido = hoja.querySelector('#boton-entendido');
    const ayuda = botonEntendido.nextElementSibling;
    const revisarPracticas = () => {
      const faltan = [...hoja.querySelectorAll('.practica')].filter((x) => !x.classList.contains('aprobada')).length;
      const bloquear = faltan > 0 && !estaEntendida(id);
      botonEntendido.disabled = bloquear;
      ayuda.textContent = bloquear
        ? `🔒 Primero aprueba ${faltan === 1 ? 'la práctica' : `las ${faltan} prácticas`} de esta parte.`
        : 'Márcalo solo si lo puedes explicar en voz alta.';
    };
    revisarPracticas();
    hoja.addEventListener('practica-aprobada', revisarPracticas);

    // La nube: si hay sesión, el bombillo también se registra en Firebase (para el certificado).
    const cajaNube = hoja.querySelector('#nube-parte');
    const curso = cursoDeClase(num);
    const subirANube = async (ponerAviso) => {
      const r = await nube.prenderEnNube(curso, id).catch(() => ({ ok: false, motivo: 'error' }));
      if (r.motivo === 'sin-sesion') return;
      if (r.motivo === 'sin-verificar') { cajaNube.innerHTML = '☁ verifica tu correo para que cuente en la nube · <a href="#/entrar/verificar">verificar</a>'; return; }
      if (r.ok || r.motivo === 'ya') { cajaNube.innerHTML = '☁ contado en la nube'; if (ponerAviso) avisar('💡 se prendió un bombillo <span class="tenue">· ☁ guardado en la nube</span>'); return; }
      if (r.motivo === 'espera') {
        cajaNube.innerHTML = `☁ cuenta en la nube en ${r.segundos} s (un bombillo por minuto)…`;
        setTimeout(() => { if (document.body.contains(cajaNube)) subirANube(false); }, r.segundos * 1000 + 800);
        if (ponerAviso) avisar(`💡 se prendió un bombillo <span class="tenue">· ☁ en ${r.segundos} s cuenta en la nube</span>`);
        return;
      }
      cajaNube.innerHTML = '<button class="boton" type="button">☁ reintentar en la nube</button>';
      cajaNube.querySelector('button').addEventListener('click', () => subirANube(true));
    };
    // Al abrir la parte: si está prendida aquí pero no en la nube, ofrecer contarla.
    (hayDatosDeSesion() ? nube.usuario() : Promise.resolve(null)).then(async (quien) => {
      if (!nube.cuentaLista(quien) || !estaEntendida(id)) return;
      await nube.leerProgresoNube(curso);
      if (nube.estaEnNube(curso, id)) { cajaNube.innerHTML = '☁ contado en la nube'; return; }
      cajaNube.innerHTML = '<button class="boton" type="button">☁ contar en la nube</button>';
      cajaNube.querySelector('button').addEventListener('click', () => subirANube(true));
    }).catch(() => {});

    botonEntendido.addEventListener('click', async (ev) => {
      const ahora = !estaEntendida(id);
      marcarEntendida(id, ahora);
      ev.currentTarget.classList.toggle('activo', ahora);
      ev.currentTarget.textContent = ahora ? '✓ ya lo entendí' : '¿lo entendiste? márcalo';
      app.querySelector('.indice nav a.activa span').textContent = ahora ? '✓' : dos(i);
      if (!ahora) { cajaNube.textContent = ''; return; }
      const quien = hayDatosDeSesion() ? await nube.usuario().catch(() => null) : null;
      if (quien) subirANube(true);
      else avisar('💡 se prendió un bombillo <span class="tenue">· ver mi progreso →</span>');
    });
  }
}

// ---------- pantalla 5: mi progreso (los bombillos), separado por curso ----------

async function vistaProgreso() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'mi progreso', corto: 'progreso' }]);
  const recien = recienPrendidos();
  const titulos = {};
  await Promise.all(ORDEN.map(async (num) => {
    try { titulos[num] = partir(await leerArchivo(rutaDoc(num))).partes.map((p) => textoPlano(p.titulo)); } catch (e) { titulos[num] = []; }
  }));

  let orden = 0;
  let numEtapa = 0;
  const pintarEtapa = (e) => {
    numEtapa += 1;
    const filas = e.clases.map((num) => {
      const bombillos = (titulos[num] || []).map((t, i) => {
        const id = idParte(num, 0, i + 1);
        const prendido = estaEntendida(id);
        const nuevo = prendido && recien.has(id);
        const espera = nuevo ? `style="--espera:${(orden++) * 220}ms"` : '';
        return `<a class="bombillo ${prendido ? 'prendido' : ''} ${nuevo ? 'nuevo' : ''}" ${espera}
          href="#/clase/${num}/0/${i + 1}" title="${escapar(`${dos(i + 1)}. ${t}`)}" aria-label="${escapar(`Parte ${i + 1}: ${t}, ${prendido ? 'entendida' : 'pendiente'}`)}">💡</a>`;
      }).join('');
      return `<div class="fila-bombillos ${estadoClase(num)}">
        <a class="fila-clase" href="#/clase/${num}"><span class="mono acento">${num}</span> ${escapar(CLASES[num].titulo)}</a>
        <span class="bombillos">${bombillos}</span>
        <span class="mono tenue cuenta">${prendidos(num)}/${conteo[num] || 0}</span>
      </div>`;
    }).join('');
    const pe = e.clases.reduce((s, n) => s + prendidos(n), 0);
    const te = e.clases.reduce((s, n) => s + (conteo[n] || 0), 0);
    return `<section class="etapa-progreso">
      <h2 class="mono"><span class="emoji">${e.icono}</span> ${dos(numEtapa)} · ${escapar(e.titulo)} <span class="tenue">${pe}/${te}</span></h2>
      ${filas}
    </section>`;
  };

  const cursos = Object.values(CURSOS).map((c) => {
    const total = totalPartes(c.id);
    const listos = ordenDe(c.id).reduce((s, n) => s + prendidos(n), 0);
    const ruta = c.id === 'programacion' ? '#/certificado' : `#/certificado/${c.id}`;
    return `
      <section class="curso-progreso">
        <p class="mono comentario">// curso: ${escapar(c.corto.toLowerCase())}</p>
        <div class="gran-cuenta mono"><b>${listos}</b> de ${total} bombillos prendidos
          <span class="tenue nube-curso" data-curso="${c.id}"></span></div>
        <div class="barra-progreso ancha"><span style="width:${total ? (listos / total) * 100 : 0}%"></span></div>
        ${ETAPAS.filter((e) => cursoDeEtapa(e) === c.id).map(pintarEtapa).join('')}
        <p class="centro"><a class="boton" href="${ruta}">🎓 certificado de ${escapar(c.corto.toLowerCase())}${listos === total ? '' : ` · faltan ${total - listos}`}</a></p>
      </section>`;
  }).join('');

  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// mi progreso · en este navegador, y en la nube si entras con tu cuenta</p>
      <h1 class="titulo-medio">💡 Mi progreso</h1>
      <p class="bajada">Cada bombillo es una parte de una clase. Se prende cuando apruebas su práctica y tocas
        <b>"¿lo entendiste? márcalo"</b>. Cada curso tiene sus bombillos y su certificado.
        ${recien.size ? `<span class="insignia actual">+${recien.size} desde la última vez</span>` : ''}</p>
      <div class="caja-nube mono" id="caja-nube">☁ …</div>
    </section>
    ${cursos}
    <details class="intro llevar">
      <summary class="mono">// llevar mi progreso a otro aparato sin cuenta (de la Mac al iPad, por ejemplo)</summary>
      <div class="texto">
        <p>Si entras con tu cuenta, lo que cuenta para el certificado ya está en la nube y lo ves en cualquier aparato.
          Esto es para pasar los bombillos <b>de este navegador</b>: copia el código, ábrelo en el otro aparato y pégalo abajo.</p>
        <div class="fila-codigo"><input class="mono" id="codigo-progreso" readonly value="${exportarProgreso()}">
          <button class="boton" id="copiar-progreso" type="button">copiar</button></div>
        <div class="fila-codigo"><input class="mono" id="pegar-progreso" placeholder="pega aquí el código del otro aparato">
          <button class="boton" id="cargar-progreso" type="button">cargar</button></div>
        <p class="tenue" id="mensaje-progreso"></p>
      </div>
    </details>`;

  app.querySelector('#copiar-progreso').addEventListener('click', async (ev) => {
    try { await navigator.clipboard.writeText(app.querySelector('#codigo-progreso').value); ev.currentTarget.textContent = '✓ copiado'; }
    catch (e) { app.querySelector('#codigo-progreso').select(); }
  });
  app.querySelector('#cargar-progreso').addEventListener('click', () => {
    const msg = app.querySelector('#mensaje-progreso');
    try {
      const n = importarProgreso(app.querySelector('#pegar-progreso').value);
      msg.textContent = `✓ listo: se cargaron ${n} bombillos.`;
      setTimeout(dibujar, 900);
    } catch (e) {
      msg.textContent = '✗ ese código no sirve. Cópialo completo otra vez.';
    }
  });
  pintarCajaNube(app.querySelector('#caja-nube'));
  // Ya los viste prenderse: la próxima vez no se animan de nuevo.
  olvidarRecien();
}

// La cajita de "Mi progreso": quién entró y cuántos bombillos cuentan en la nube en cada curso.
async function pintarCajaNube(caja) {
  if (!hayDatosDeSesion()) {
    caja.innerHTML = `☁ Tus bombillos solo están en este navegador. Para el <b>certificado verificable</b>,
      <a class="boton" href="#/entrar">entra o crea tu cuenta</a>`;
    return;
  }
  try {
    const quien = await nube.usuario();
    if (!quien) { recordarSesion(false); pintarCajaNube(caja); return; }
    if (!nube.cuentaLista(quien)) {
      caja.innerHTML = `☁ Falta verificar tu correo (${escapar(quien.email)}) para que cuente en la nube.
        <a class="boton" href="#/entrar/verificar">verificar mi correo</a>`;
      return;
    }
    caja.innerHTML = `☁ Entraste como <b>${escapar(quien.displayName || quien.email)}</b>
      <a class="boton" href="#/cuenta">mi cuenta</a>`;
    for (const c of Object.values(CURSOS)) {
      const p = await nube.leerProgresoNube(c.id);
      const span = app.querySelector(`.nube-curso[data-curso="${c.id}"]`);
      if (span) span.textContent = `· ☁ ${p?.n || 0} en la nube`;
    }
  } catch (e) {
    caja.textContent = '☁ sin conexión con la nube (tu progreso de este navegador sigue aquí)';
  }
}

// ---------- la cuenta: entrar, crear, recuperar (solo correo de Gmail, sin teléfono) ----------

// Un aviso en localStorage para saber si vale la pena cargar Firebase al abrir el sitio.
function recordarSesion(si) {
  try { si ? localStorage.setItem('mapa-sesion', '1') : localStorage.removeItem('mapa-sesion'); } catch (e) { /* sin almacenamiento */ }
}
function hayDatosDeSesion() {
  try { return localStorage.getItem('mapa-sesion') === '1'; } catch (e) { return false; }
}

// El "usuario@estudios" de la barra de arriba: tu primer nombre, o "invitado".
function ponerPrompt(u) {
  const primer = (u?.displayName || '').trim().split(/\s+/)[0] || '';
  const limpio = primer.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  document.getElementById('prompt-usuario').textContent = `${limpio || 'invitado'}@estudios`;
  const boton = document.getElementById('boton-cuenta');
  boton.href = u ? '#/cuenta' : '#/entrar';
  boton.title = u ? 'Mi cuenta' : 'Entrar o crear cuenta';
}

const MENSAJES_ERROR = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Revisa el correo que escribiste.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Entra, o usa "¿Problemas para entrar?".',
  'auth/weak-password': 'La contraseña es muy corta: usa al menos 8 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a intentar.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/expired-action-code': 'Ese enlace expiró. Pide uno nuevo.',
  'auth/invalid-action-code': 'Ese enlace no es válido o ya se usó. Pide uno nuevo.',
  'propio/no-gmail': 'Solo se aceptan correos de Gmail (terminan en @gmail.com).',
  'auth/operation-not-allowed': 'Esta forma de entrar todavía no está activada en Firebase (Authentication → Sign-in method).',
  'auth/unauthorized-domain': 'Este sitio no está en los dominios autorizados de Firebase.',
  'auth/unauthorized-continue-uri': 'Este sitio no está en los dominios autorizados de Firebase.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes para este sitio.',
  'auth/cancelled-popup-request': 'Se abrió otra ventana de Google. Vuelve a intentar.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/missing-email': 'Escribe tu correo.',
  'auth/user-disabled': 'Esta cuenta está desactivada.',
  'auth/admin-restricted-operation': 'Esta forma de entrar está desactivada en Firebase.',
  'auth/configuration-not-found': 'Falta activar el inicio de sesión en Firebase (Authentication → Comenzar).',
};
// Los errores del formulario traen su propio mensaje; los de Firebase se traducen con la tabla.
// Si es un error desconocido, se muestra su código: así se puede saber qué pasó.
const mensajeDe = (e) => e?.mensaje || MENSAJES_ERROR[e?.code]
  || `No se pudo completar ahora. Inténtalo de nuevo.${e?.code ? ` (código: ${e.code})` : ''}`;

// El marco de todas las pantallas de la cuenta: una tarjeta con aspecto de terminal.
function tarjetaCuenta(comando, titulo, cuerpo) {
  app.innerHTML = `
    <section class="cuenta">
      <div class="cuenta-tarjeta">
        <div class="cuenta-barra mono"><i></i><i></i><i></i><span>${escapar(comando)}</span></div>
        <div class="cuenta-cuerpo">
          <h1 class="titulo-medio">${titulo}</h1>
          ${cuerpo}
          <p class="cuenta-error mono" id="cuenta-error" role="alert"></p>
        </div>
      </div>
    </section>`;
}
const campo = (id, etiqueta, tipo = 'text', extra = '') => `
  <label class="cuenta-campo"><span class="mono">${etiqueta}</span>
    <input id="${id}" type="${tipo}" ${extra}></label>`;
const campoClave = (id, etiqueta, extra = '') => `
  <label class="cuenta-campo"><span class="mono">${etiqueta}</span>
    <span class="clave"><input id="${id}" type="password" ${extra}>
      <button class="ver-clave mono" type="button" data-para="${id}" aria-label="Mostrar contraseña">ver</button></span></label>`;
const botonGoogle = '<button class="boton boton-google" id="cuenta-google" type="button"><span class="g">G</span> Continuar con Google</button>';

function conectarCuenta() {
  app.querySelectorAll('.ver-clave').forEach((b) => b.addEventListener('click', () => {
    const entrada = app.querySelector(`#${b.dataset.para}`);
    const ver = entrada.type === 'password';
    entrada.type = ver ? 'text' : 'password';
    b.textContent = ver ? 'ocultar' : 'ver';
  }));
  const g = app.querySelector('#cuenta-google');
  if (g) g.addEventListener('click', () => intentar(g, async () => { await nube.entrarConGoogle(); despuesDeEntrar(); }));
}
const errorCuenta = (texto) => { const p = app.querySelector('#cuenta-error'); if (p) p.textContent = texto ? `✗ ${texto}` : ''; };

// Ejecuta una acción con el botón deshabilitado y muestra el error si falla.
async function intentar(boton, accion) {
  errorCuenta('');
  boton.disabled = true;
  try { await accion(); } catch (e) { console.warn('cuenta:', e?.code, e?.message); errorCuenta(mensajeDe(e)); } finally { if (document.body.contains(boton)) boton.disabled = false; }
}

function despuesDeEntrar() {
  recordarSesion(true);
  nube.usuario().then((u) => {
    ponerPrompt(u);
    location.hash = nube.cuentaLista(u) ? (sessionStorage.getItem('mapa-volver') || '#/') : '#/entrar/verificar';
    try { sessionStorage.removeItem('mapa-volver'); } catch (e) { /* nada */ }
  });
}

async function vistaEntrar(paso) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'entrar', corto: 'entrar' }]);

  if (paso === 'crear') {
    tarjetaCuenta('./crear-cuenta', 'Crear cuenta', `
      <p class="bajada">Con tu cuenta, cada bombillo queda guardado en el servidor y al final puedes emitir un
        <b>certificado verificable</b>. Solo correo de <b>Gmail</b>.</p>
      ${campo('c-nombre', 'nombre completo', 'text', 'autocomplete="name" maxlength="80"')}
      <p class="cuenta-nota">⚠️ Escríbelo <b>tal como aparece en tu documento</b>, con tildes y apellidos.
        Es el nombre que saldrá impreso en tu certificado.</p>
      ${campo('c-correo', 'correo de Gmail', 'email', 'autocomplete="email" placeholder="tu.nombre@gmail.com"')}
      ${campoClave('c-clave', 'contraseña (mínimo 8)', 'autocomplete="new-password"')}
      ${campoClave('c-clave2', 'repite la contraseña', 'autocomplete="new-password"')}
      <button class="boton-principal ancho" id="c-crear" type="button">crear cuenta</button>
      <div class="separador mono">o</div>
      ${botonGoogle}
      <p class="cuenta-pie">¿Ya tienes cuenta? <a href="#/entrar">Entrar</a></p>`);
    conectarCuenta();
    const crear = app.querySelector('#c-crear');
    crear.addEventListener('click', () => intentar(crear, async () => {
      const nombre = app.querySelector('#c-nombre').value.trim().replace(/\s+/g, ' ');
      const correo = app.querySelector('#c-correo').value.trim();
      const clave = app.querySelector('#c-clave').value;
      if (nombre.split(' ').length < 2) throw { code: 'local', mensaje: 'Escribe tu nombre y tu apellido.' };
      if (!nube.esGmail(correo)) throw { code: 'propio/no-gmail' };
      if (clave.length < 8) throw { code: 'auth/weak-password' };
      if (clave !== app.querySelector('#c-clave2').value) throw { code: 'local', mensaje: 'Las contraseñas no son iguales.' };
      guardarNombre(nombre);
      await nube.crearCuenta(nombre, correo, clave);
      recordarSesion(true);
      location.hash = '#/entrar/verificar';
    }));
    return;
  }

  if (paso === 'ayuda') {
    tarjetaCuenta('./problemas-para-entrar', '¿Problemas para entrar?', `
      <p class="bajada">¿Qué olvidaste?</p>
      <a class="opcion" href="#/entrar/contrasena"><b>🔑 Olvidé mi contraseña</b>
        <span>Recibe un enlace en tu correo para crear una contraseña nueva.</span></a>
      <a class="opcion" href="#/entrar/correo"><b>✉️ Olvidé mi correo</b>
        <span>Cómo descubrir con qué Gmail creaste la cuenta.</span></a>
      <a class="opcion" href="#/entrar/verificar"><b>📭 No me llegó el correo de verificación</b>
        <span>Reenviarlo, y dónde buscarlo.</span></a>
      <p class="cuenta-pie"><a href="#/entrar">← volver a entrar</a></p>`);
    return;
  }

  if (paso === 'contrasena') {
    tarjetaCuenta('./recuperar-contrasena', 'Contraseña nueva', `
      <p class="bajada">Escribe el correo de la cuenta. Te mandamos ahí un enlace para crear una contraseña nueva.</p>
      ${campo('r-correo', 'correo de Gmail', 'email', 'autocomplete="email" placeholder="tu.nombre@gmail.com"')}
      <button class="boton-principal ancho" id="r-enviar" type="button">enviar enlace por correo</button>
      <div id="r-listo"></div>
      <p class="cuenta-pie"><a href="#/entrar/ayuda">← volver</a></p>`);
    const enviar = app.querySelector('#r-enviar');
    enviar.addEventListener('click', () => intentar(enviar, async () => {
      const correo = app.querySelector('#r-correo').value.trim();
      if (!nube.esGmail(correo)) throw { code: 'propio/no-gmail' };
      await nube.recuperarContrasena(correo);
      app.querySelector('#r-listo').innerHTML = `<p class="cuenta-ok"><b>Listo, revisa tu correo.</b>
        Si existe una cuenta con ese correo, el enlace llega en instantes. Revisa también <b>spam</b> y <b>promociones</b>.</p>`;
    }));
    return;
  }

  if (paso === 'correo') {
    tarjetaCuenta('./olvide-mi-correo', '¿Con qué correo entré?', `
      <p class="bajada">Aquí las cuentas son <b>solo de Gmail</b>, así que tu correo es una de las cuentas de Google que ya usas.
        No pedimos teléfono, así que no hay cómo buscarlo por número. Prueba así:</p>
      <ol class="cuenta-pasos">
        <li>Toca <b>Continuar con Google</b>: Google te muestra la lista de tus cuentas. Si creaste la cuenta con Google, es una de esas.</li>
        <li>Busca en tu Gmail el correo <b>"Verifica tu correo"</b> del Mapa de estudios: llegó a la cuenta con la que te registraste.</li>
        <li>En el celular, mira <b>Configuración → Google</b> (Android) o <b>Ajustes → Mail → Cuentas</b> (iPhone) para ver tus Gmail.</li>
      </ol>
      <p class="cuenta-nota">🔒 Por seguridad, esta página no dice si un correo está registrado o no: así nadie puede usarla para
        averiguar quién estudia aquí.</p>
      ${botonGoogle}
      <p class="cuenta-pie"><a href="#/entrar/ayuda">← volver</a></p>`);
    conectarCuenta();
    return;
  }

  if (paso === 'verificar' || paso === 'listo') {
    const quien = await nube.usuario().catch(() => null);
    if (!quien) { location.hash = '#/entrar'; return; }
    const u = paso === 'listo' ? await nube.refrescarCuenta() : quien;
    if (nube.cuentaLista(u)) {
      tarjetaCuenta('./verificar-correo', '✓ Correo verificado', `
        <p class="bajada">Listo, <b>${escapar(u.displayName || u.email)}</b>. Desde ahora, cada bombillo que prendas cuenta en la nube.</p>
        <a class="boton-principal ancho" href="#/">ir al mapa</a>`);
      ponerPrompt(u);
      return;
    }
    tarjetaCuenta('./verificar-correo', '📭 Revisa tu correo', `
      <p class="bajada">Te mandamos un enlace a <b>${escapar(u.email)}</b>. Ábrelo para confirmar que el correo es tuyo
        (así nadie crea cuentas con correos ajenos). Revisa también <b>spam</b> y <b>promociones</b>.</p>
      <button class="boton-principal ancho" id="v-ya" type="button">ya lo abrí, continuar</button>
      <button class="boton ancho" id="v-otra" type="button">reenviar el correo</button>
      <p class="cuenta-pie">¿Correo equivocado? <a href="#/cuenta">cerrar sesión y crear otra</a></p>`);
    const ya = app.querySelector('#v-ya');
    ya.addEventListener('click', () => intentar(ya, async () => {
      const r = await nube.refrescarCuenta();
      if (nube.cuentaLista(r)) dibujar(); else errorCuenta('Todavía no aparece verificado. Abre el enlace del correo y vuelve a tocar.');
    }));
    const otra = app.querySelector('#v-otra');
    otra.addEventListener('click', () => intentar(otra, async () => { await nube.reenviarVerificacion(); otra.textContent = '✓ reenviado'; }));
    return;
  }

  // Entrar (la pantalla principal)
  const yaDentro = hayDatosDeSesion() ? await nube.usuario().catch(() => null) : null;
  if (yaDentro) { location.hash = '#/cuenta'; return; }
  tarjetaCuenta('./entrar', 'Entrar', `
    <p class="bajada">Entra para que tus bombillos cuenten en la nube y puedas emitir tu certificado verificable.</p>
    ${campo('e-correo', 'correo de Gmail', 'email', 'autocomplete="email" placeholder="tu.nombre@gmail.com"')}
    ${campoClave('e-clave', 'contraseña', 'autocomplete="current-password"')}
    <button class="boton-principal ancho" id="e-entrar" type="button">entrar</button>
    <p class="cuenta-ayuda"><a href="#/entrar/ayuda">¿Problemas para entrar?</a></p>
    <div class="separador mono">o</div>
    ${botonGoogle}
    <p class="cuenta-pie">¿No tienes cuenta? <a href="#/entrar/crear">Crear cuenta</a></p>`);
  conectarCuenta();
  const entrar = app.querySelector('#e-entrar');
  const hacer = () => intentar(entrar, async () => {
    await nube.entrarConCorreo(app.querySelector('#e-correo').value, app.querySelector('#e-clave').value);
    despuesDeEntrar();
  });
  entrar.addEventListener('click', hacer);
  app.querySelector('#e-clave').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') hacer(); });
}


// Los enlaces que llegan por correo: ?mode=resetPassword&oobCode=… o ?mode=verifyEmail&oobCode=…
async function vistaAccion(modo, codigo) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'cuenta', corto: 'cuenta' }]);
  const limpiarUrl = () => history.replaceState(null, '', `${location.pathname}#/entrar`);
  if (modo === 'verifyEmail') {
    try {
      await nube.confirmarCorreoConEnlace(codigo);
      tarjetaCuenta('./verificar-correo', '✓ Correo verificado', `
        <p class="bajada">Listo. Ya puedes entrar y tus bombillos contarán en la nube.</p>
        <a class="boton-principal ancho" href="#/">ir al mapa</a>`);
    } catch (e) {
      tarjetaCuenta('./verificar-correo', 'Enlace no válido', `<p class="bajada">${escapar(mensajeDe(e))}</p>
        <a class="boton ancho" href="#/entrar/verificar">pedir otro</a>`);
    }
    limpiarUrl();
    return;
  }
  if (modo === 'resetPassword') {
    let correo = '';
    try { correo = (await nube.revisarEnlace(codigo)).data.email; } catch (e) {
      tarjetaCuenta('./recuperar-contrasena', 'Enlace no válido', `<p class="bajada">${escapar(mensajeDe(e))}</p>
        <a class="boton ancho" href="#/entrar/contrasena">pedir otro enlace</a>`);
      limpiarUrl();
      return;
    }
    tarjetaCuenta('./recuperar-contrasena', 'Crea tu contraseña nueva', `
      <p class="bajada">Llegaste por el enlace del correo de <b>${escapar(correo)}</b>: solo elige la contraseña nueva.</p>
      ${campoClave('n-clave', 'contraseña nueva (mínimo 8)', 'autocomplete="new-password"')}
      ${campoClave('n-clave2', 'repite la contraseña nueva', 'autocomplete="new-password"')}
      <button class="boton-principal ancho" id="n-cambiar" type="button">cambiar contraseña</button>`);
    conectarCuenta();
    const cambiar = app.querySelector('#n-cambiar');
    cambiar.addEventListener('click', () => intentar(cambiar, async () => {
      const clave = app.querySelector('#n-clave').value;
      if (clave.length < 8) throw { code: 'auth/weak-password' };
      if (clave !== app.querySelector('#n-clave2').value) throw { code: 'local', mensaje: 'Las contraseñas no son iguales.' };
      await nube.cambiarContrasenaConEnlace(codigo, clave);
      limpiarUrl();
      tarjetaCuenta('./recuperar-contrasena', '✓ Contraseña cambiada', `
        <p class="bajada">Entra de nuevo con tu contraseña nueva.</p>
        <a class="boton-principal ancho" href="#/entrar">entrar</a>`);
    }));
    return;
  }
  limpiarUrl();
  location.hash = '#/entrar';
}

async function vistaCuenta() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'mi cuenta', corto: 'cuenta' }]);
  const u = hayDatosDeSesion() ? await nube.usuario().catch(() => null) : null;
  if (!u) { location.hash = '#/entrar'; return; }
  const verificado = nube.cuentaLista(u);
  tarjetaCuenta('./mi-cuenta', 'Mi cuenta', `
    <dl class="datos-verificacion mono">
      <dt>nombre</dt><dd>${escapar(u.displayName || '—')}</dd>
      <dt>correo</dt><dd>${escapar(u.email)}</dd>
      <dt>estado</dt><dd>${verificado ? '<span class="acento">✓ verificado</span>' : '⚠️ falta verificar · <a href="#/entrar/verificar">verificar</a>'}</dd>
    </dl>
    <details class="cuenta-detalle"><summary class="mono">cambiar mi nombre</summary>
      ${campo('m-nombre', 'nombre completo', 'text', `maxlength="80" value="${escapar(u.displayName || '')}"`)}
      <p class="cuenta-nota">Cambia el nombre de tu cuenta. Un certificado ya emitido no cambia: para corregirlo, usa
        "corregir el nombre" en la pantalla del certificado.</p>
      <button class="boton" id="m-guardar" type="button">guardar nombre</button>
    </details>
    <div class="acciones">
      <a class="boton" href="#/progreso">💡 mi progreso</a>
      <a class="boton" href="#/certificado">🎓 mis certificados</a>
      <button class="boton" id="m-salir" type="button">cerrar sesión</button>
    </div>`);
  const guardar = app.querySelector('#m-guardar');
  guardar.addEventListener('click', () => intentar(guardar, async () => {
    const nombre = app.querySelector('#m-nombre').value.trim().replace(/\s+/g, ' ');
    if (nombre.split(' ').length < 2) throw { code: 'local', mensaje: 'Escribe tu nombre y tu apellido.' };
    await nube.cambiarNombre(nombre);
    guardarNombre(nombre);
    ponerPrompt(await nube.usuario());
    dibujar();
  }));
  app.querySelector('#m-salir').addEventListener('click', async () => {
    await nube.salir();
    recordarSesion(false);
    ponerPrompt(null);
    location.hash = '#/';
  });
}

// ---------- pantalla 6: el certificado (uno por curso) ----------
// Se emite en Firebase cuando la nube ve TODAS las partes del curso (lo comprueban las reglas, no el navegador).
// Es un certificado de finalización emitido por el propio curso: no es un título oficial.

const FECHA_LARGA = { day: 'numeric', month: 'long', year: 'numeric' };
const URL_SITIO = 'delvinsmart.github.io/estudios';

function rutaCertificado(curso) {
  return curso === 'programacion' ? '#/certificado' : `#/certificado/${curso}`;
}

// El dibujo del certificado. Lo usan la muestra, el certificado propio y la página de verificar.
function htmlCertificado({ nombre, fecha, codigo, curso, total, muestra }) {
  const c = CURSOS[curso];
  const clases = ordenDe(curso).length;
  const fechaTexto = fecha.toLocaleDateString('es', FECHA_LARGA);
  const anio = fecha.getFullYear();
  const etapas = ETAPAS.filter((e) => cursoDeEtapa(e) === curso);
  // En un curso de una sola etapa, se listan sus clases; si no, las etapas.
  const items = (etapas.length === 1 ? etapas[0].clases.map((n) => CLASES[n].titulo) : etapas.map((e) => e.titulo))
    .map((t) => `<li><span class="cert-num">[✓]</span>${escapar(t)}</li>`).join('');
  // El nombre y el código, escritos en binario (8 bits por letra), para las columnas de los lados.
  const binario = (t) => [...new TextEncoder().encode(t)].map((b) => b.toString(2).padStart(8, '0')).join('');
  const bitsIzq = binario(`${nombre} ${codigo} `).repeat(12).slice(0, 1400);
  const bitsDer = binario(`${curso} ${anio} ${clases}/${clases} ${total}/${total} exit 0 `).repeat(6).slice(0, 1400);
  const verificarEn = muestra ? `${URL_SITIO}/#/verificar` : `${URL_SITIO}/#/verificar/${codigo}`;
  return `
    <article class="certificado ${muestra ? 'es-muestra' : ''}">
      <div class="cert-hoja">
        <span class="cert-esquina e1"></span><span class="cert-esquina e2"></span>
        <span class="cert-esquina e3"></span><span class="cert-esquina e4"></span>
        <div class="cert-bits izq" aria-hidden="true">${bitsIzq}</div>
        <div class="cert-bits der" aria-hidden="true">${bitsDer}</div>
        <p class="cert-marca">estudios:~$ ./certificado --curso=${escapar(curso)}</p>
        <h1 class="cert-titulo">Certificado</h1>
        <p class="cert-tipo">de finalización</p>
        <p class="cert-estado">status: <b>completado</b> · ${clases}/${clases} clases · ${total}/${total} partes · exit 0</p>
        <p class="cert-otorga">Se otorga a</p>
        <p class="cert-nombre">${escapar(nombre || '—')}</p>
        <p class="cert-texto">por completar el curso <b>${escapar(c.nombre)}</b>,
          con sus ${clases} clases y ${total} partes, aprobando la práctica de cada una.</p>
        <ul class="cert-etapas">${items}</ul>
        <div class="cert-pie">
          <div class="cert-dato"><span class="cert-valor">${escapar(fechaTexto)}</span><span class="cert-rotulo">// fecha</span></div>
          <svg class="cert-sello" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="cert-arco" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs>
            <circle cx="60" cy="60" r="57" class="s-borde"/>
            <circle cx="60" cy="60" r="51" class="s-fino"/>
            <circle cx="60" cy="60" r="34" class="s-fino"/>
            <text class="s-texto"><textPath href="#cert-arco" startOffset="0" textLength="272" lengthAdjust="spacing">&lt;/&gt; ${escapar(c.corto.toUpperCase().replace(/ /g, '_'))} · ${anio} · COMPLETADO ·</textPath></text>
            <path class="s-bombillo" d="M60 38c-9 0-15 7-15 15 0 6 3 9 6 12 2 2 3 4 3 7h12c0-3 1-5 3-7 3-3 6-6 6-12 0-8-6-15-15-15z"/>
            <path class="s-base" d="M54 76h12M55 80h10M57 84h6"/>
          </svg>
          <div class="cert-dato"><span class="cert-valor mono">${escapar(codigo)}</span><span class="cert-rotulo">// código de verificación</span></div>
        </div>
        <p class="cert-verificar">$ verificar → <b>${escapar(verificarEn)}</b></p>
        <p class="cert-aviso">Emitido por el propio curso de forma automática y registrado en su servidor (Firebase), que solo lo emite
          cuando ve todas las partes completadas. No es un título oficial ni está acreditado por ninguna institución educativa.</p>
      </div>
    </article>`;
}

function pantallaAviso(titulo, texto, acciones = '') {
  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// certificado de finalización</p>
      <h1 class="titulo-medio">${titulo}</h1>
      <div class="bajada">${texto}</div>
      <div class="acciones">${acciones}</div>
    </section>`;
}

async function vistaCertificado(curso, muestra) {
  const c = CURSOS[curso];
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: `certificado · ${c.corto.toLowerCase()}`, corto: 'certificado' }]);
  const total = totalPartes(curso);
  const otros = Object.values(CURSOS).filter((o) => o.id !== curso)
    .map((o) => `<a class="boton" href="${rutaCertificado(o.id)}">certificado de ${escapar(o.corto.toLowerCase())}</a>`).join('');

  if (muestra) {
    app.innerHTML = `
      <div class="cert-herramientas no-imprimir">
        <p class="mono comentario">// muestra: así se verá cuando completes el curso "${escapar(c.corto.toLowerCase())}"</p>
        <div class="fila-codigo"><a class="boton" href="${rutaCertificado(curso)}">mi certificado de verdad →</a>${otros}</div>
      </div>
      ${htmlCertificado({ nombre: leerNombre() || 'Tu Nombre Completo', fecha: new Date(), codigo: 'MUESTRA', curso, total, muestra: true })}`;
    return;
  }

  const verMuestra = `<a class="boton" href="${rutaCertificado(curso)}/muestra">ver cómo será (muestra)</a>`;
  app.innerHTML = '<p class="mono tenue centro">// conectando con la nube…</p>';
  let quien = null;
  try { quien = hayDatosDeSesion() ? await nube.usuario() : null; } catch (e) {
    pantallaAviso('☁ Sin conexión', 'No pude conectar con el servidor del certificado. Revisa tu internet y vuelve a intentar.');
    return;
  }

  if (!quien) {
    try { sessionStorage.setItem('mapa-volver', rutaCertificado(curso)); } catch (e) { /* nada */ }
    pantallaAviso(`🎓 Certificado de ${escapar(c.corto.toLowerCase())}`,
      `Para que el certificado se pueda <b>verificar</b>, tu progreso tiene que estar en el servidor, no solo en este navegador.
       Entra con tu cuenta de Gmail: desde ahí, cada bombillo que prendas cuenta también en la nube.`,
      `<a class="boton-principal" href="#/entrar">entrar o crear cuenta</a>${verMuestra}`);
    return;
  }
  if (!nube.cuentaLista(quien)) {
    pantallaAviso('📭 Falta verificar tu correo', `Abre el enlace que te mandamos a <b>${escapar(quien.email)}</b>.`,
      '<a class="boton-principal" href="#/entrar/verificar">verificar mi correo</a>');
    return;
  }

  const propio = await nube.miCertificado(curso);
  if (propio) {
    app.innerHTML = `
      <div class="cert-herramientas no-imprimir">
        <p class="mono comentario">// tu certificado · registrado en el servidor</p>
        <div class="fila-codigo">
          <button class="boton-principal" id="cert-imprimir" type="button">imprimir / guardar PDF</button>
          <a class="boton" href="#/verificar/${propio.codigo}">página de verificación</a>
          <button class="boton" id="cert-copiar" type="button">copiar enlace para LinkedIn</button>
          <button class="boton" id="cert-borrar" type="button">corregir el nombre</button>
          ${otros}
        </div>
      </div>
      ${htmlCertificado({ nombre: propio.nombre, fecha: propio.emitido, codigo: propio.codigo, curso, total: propio.partes })}`;
    app.querySelector('#cert-imprimir').addEventListener('click', () => window.print());
    app.querySelector('#cert-copiar').addEventListener('click', async (ev) => {
      const enlace = `https://${URL_SITIO}/#/verificar/${propio.codigo}`;
      try { await navigator.clipboard.writeText(enlace); ev.currentTarget.textContent = '✓ copiado'; } catch (e) { prompt('Copia este enlace:', enlace); }
    });
    app.querySelector('#cert-borrar').addEventListener('click', async () => {
      if (!confirm('Esto borra tu certificado actual (su código dejará de funcionar) para que lo emitas de nuevo con el nombre corregido. ¿Seguir?')) return;
      await nube.borrarMiCertificado(curso, propio.codigo);
      dibujar();
    });
    return;
  }

  const progreso = await nube.leerProgresoNube(curso);
  const enNube = progreso?.n || 0;
  if (enNube < total) {
    pantallaAviso('🎓 Todavía no',
      `<p>El certificado de <b>${escapar(c.corto.toLowerCase())}</b> se emite cuando el servidor ve <b>todas</b> sus partes.
       En la nube llevas <b>${enNube}</b> de <b>${total}</b>.</p>
       <p>Los bombillos que prendiste <b>antes</b> de entrar con tu cuenta solo están en este navegador:
       entra a esas partes y toca <b>☁ contar en la nube</b>.</p>
       <div class="barra-progreso ancha"><span style="width:${(enNube / total) * 100}%"></span></div>`,
      `<a class="boton-principal" href="#/progreso">💡 ver mi progreso</a>${verMuestra}${otros}`);
    return;
  }

  pantallaAviso('🎓 ¡Completaste el curso!',
    `<p>El servidor ve las ${total} partes de <b>${escapar(c.corto.toLowerCase())}</b>. Revisa tu nombre y emite tu certificado:
      queda registrado con un código que cualquiera puede comprobar.</p>
     <label class="cuenta-campo"><span class="mono">nombre completo, como en tu documento</span>
       <input id="cert-nombre" maxlength="80" value="${escapar(quien.displayName || leerNombre() || '')}"></label>
     <p class="cuenta-nota">⚠️ <b>Este es el nombre que saldrá impreso en el certificado.</b> Escríbelo completo, con tildes y apellidos,
       igual que en tu documento de identidad. No pedimos CPF ni copia del documento: este sitio no tiene cómo confirmarlos
       con el gobierno, y guardar esos datos sería un riesgo para ti. Por eso, el nombre depende de que lo escribas bien.</p>
     <label class="cuenta-check"><input type="checkbox" id="cert-confirmo"> Confirmo que es mi nombre completo y correcto.</label>`,
    `<button class="boton-principal" id="cert-emitir" type="button" disabled>emitir mi certificado</button>`);
  const confirmo = app.querySelector('#cert-confirmo');
  const emitir = app.querySelector('#cert-emitir');
  confirmo.addEventListener('change', () => { emitir.disabled = !confirmo.checked; });
  emitir.addEventListener('click', async () => {
    const nombre = app.querySelector('#cert-nombre').value.trim().replace(/\s+/g, ' ');
    if (nombre.split(' ').length < 2) { avisar('✗ escribe tu nombre y tu apellido'); return; }
    emitir.disabled = true;
    try { guardarNombre(nombre); await nube.emitirCertificado(curso, c.prefijo, nombre, total); dibujar(); }
    catch (e) { emitir.disabled = false; avisar('✗ el servidor no lo aceptó; recarga e intenta de nuevo'); }
  });
}

// ---------- pantalla 7: verificar un certificado (para quien lo recibe, sin iniciar sesión) ----------

async function vistaVerificar(codigo) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'verificar', corto: 'verificar' }]);
  const formulario = (valor = '') => `
    <div class="fila-codigo"><input id="ver-codigo" class="mono" placeholder="ME-XXXX-XXXX-XXXX" value="${escapar(valor)}">
      <button class="boton-principal" id="ver-boton" type="button">verificar</button></div>`;
  const conectar = () => {
    const ir = () => { location.hash = `#/verificar/${app.querySelector('#ver-codigo').value.trim().toUpperCase()}`; };
    app.querySelector('#ver-boton').addEventListener('click', ir);
    app.querySelector('#ver-codigo').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ir(); });
  };

  if (!codigo) {
    pantallaAviso('🔎 Verificar un certificado', 'Escribe el código que aparece en el certificado (empieza con ME- o SE-).', formulario());
    conectar();
    return;
  }

  app.innerHTML = '<p class="mono tenue centro">// consultando el servidor…</p>';
  let datos = null;
  try { datos = await nube.verificar(codigo.toUpperCase()); } catch (e) {
    pantallaAviso('☁ Sin conexión', 'No pude consultar el servidor. Revisa tu internet y vuelve a intentar.');
    return;
  }
  if (!datos || !CURSOS[datos.curso]) {
    pantallaAviso('✗ Este certificado no existe',
      `No hay ningún certificado registrado con el código <b class="mono">${escapar(codigo)}</b>.
       Si alguien te mostró un certificado con este código, no fue emitido por este curso (o fue anulado).`, formulario(codigo));
    conectar();
    return;
  }
  const dias = Math.max(1, Math.round((datos.fin - datos.inicio) / 86400000));
  app.innerHTML = `
    <section class="cabeza verificado no-imprimir">
      <p class="mono comentario">// verificación · consultado en el servidor del curso</p>
      <h1 class="titulo-medio"><span class="acento">✓</span> Certificado válido</h1>
      <dl class="datos-verificacion mono">
        <dt>nombre</dt><dd>${escapar(datos.nombre)}</dd>
        <dt>curso</dt><dd>${escapar(CURSOS[datos.curso].nombre)}</dd>
        <dt>código</dt><dd>${escapar(datos.codigo)}</dd>
        <dt>emitido</dt><dd>${datos.emitido.toLocaleDateString('es', FECHA_LARGA)}</dd>
        <dt>estudió</dt><dd>del ${datos.inicio.toLocaleDateString('es', FECHA_LARGA)} al ${datos.fin.toLocaleDateString('es', FECHA_LARGA)} (${dias} ${dias === 1 ? 'día' : 'días'})</dd>
        <dt>partes</dt><dd>${datos.partes} de ${datos.partes}, una por una, con hora del servidor</dd>
      </dl>
      <p class="tenue">Lo que garantiza esta página: que el certificado fue emitido por este curso, a ese nombre, después de
        registrar cada parte en el servidor. El nombre lo escribió la persona; no es un título oficial.</p>
    </section>
    ${htmlCertificado({ nombre: datos.nombre, fecha: datos.emitido, codigo: datos.codigo, curso: datos.curso, total: datos.partes })}`;
}

// ---------- el que decide qué pantalla mostrar ----------

async function dibujar() {
  const partesRuta = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  try {
    if (partesRuta[0] === 'progreso') await vistaProgreso();
    else if (partesRuta[0] === 'certificado') {
      const curso = CURSOS[partesRuta[1]] ? partesRuta[1] : 'programacion';
      await vistaCertificado(curso, partesRuta.includes('muestra'));
    }
    else if (partesRuta[0] === 'entrar') await vistaEntrar(partesRuta[1]);
    else if (partesRuta[0] === 'cuenta') await vistaCuenta();
    else if (partesRuta[0] === 'verificar') await vistaVerificar(partesRuta[1]);
    else if (partesRuta[0] === 'etapa') await vistaEtapa(partesRuta[1]);
    else if (partesRuta[0] === 'clase' && partesRuta[3]) await vistaParte(partesRuta[1], +partesRuta[2] || 0, partesRuta[3]);
    else if (partesRuta[0] === 'clase') await vistaClase(partesRuta[1], +partesRuta[2] || 0);
    else vistaInicio();
  } catch (err) {
    mostrarError(err);
  }
  window.scrollTo({ top: 0 });
  document.title = `${textoPlano(migas.lastElementChild?.textContent || 'Mapa')} · Mapa de estudios`;
}

// ---------- el tema claro / oscuro ----------

document.getElementById('boton-tema').addEventListener('click', () => {
  const raiz = document.documentElement;
  const actual = raiz.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const nuevo = actual === 'dark' ? 'light' : 'dark';
  raiz.dataset.theme = nuevo;
  guardarTema(nuevo);
});
if (!leerTema()) document.documentElement.dataset.theme = 'dark';

// ---------- arranque ----------

async function empezar() {
  await Promise.all(ORDEN.map(async (num) => {
    try { conteo[num] = partir(await leerArchivo(rutaDoc(num))).partes.length; } catch (e) { conteo[num] = 0; }
  }));
  prepararBuscador();
  window.addEventListener('hashchange', dibujar);
  // ¿Llegó desde un enlace del correo? (…/estudios/?mode=resetPassword&oobCode=…)
  const enlace = new URLSearchParams(location.search);
  if (enlace.get('mode') && enlace.get('oobCode')) { vistaAccion(enlace.get('mode'), enlace.get('oobCode')); return; }
  // Solo carga Firebase al abrir si esta persona ya había entrado alguna vez.
  if (hayDatosDeSesion()) nube.alCambiarSesion((u) => { ponerPrompt(u); if (!u) recordarSesion(false); });
  dibujar();
}

empezar();
