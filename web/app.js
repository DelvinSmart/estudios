// El cerebro de la página: mira la dirección (#/...) y dibuja la pantalla que toca.
//   #/                      → el mapa grande (las etapas)
//   #/etapa/web             → el mapa de una etapa (sus clases)
//   #/clase/15              → el mapa de una clase (sus partes)
//   #/clase/15/0/3          → leer la parte 3 del documento 0
//   #/clase/15/0/todo       → leer la clase entera de corrido
//   #/progreso              → mi progreso: un bombillo por cada parte
//   #/certificado[/muestra] → el certificado (de verdad, desde Firebase) o su muestra
//   #/verificar/ME-…        → cualquiera comprueba si un código existe

import { CLASES, ETAPAS } from './cursos.js';
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
    const subirANube = async (ponerAviso) => {
      const r = await nube.prenderEnNube(id).catch(() => ({ ok: false, motivo: 'error' }));
      if (r.motivo === 'sin-sesion') return;
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
    nube.usuario().then(async (quien) => {
      if (!quien || !estaEntendida(id)) return;
      await nube.leerProgresoNube();
      if (nube.estaEnNube(id)) { cajaNube.innerHTML = '☁ contado en la nube'; return; }
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
      const quien = await nube.usuario().catch(() => null);
      if (quien) subirANube(true);
      else avisar('💡 se prendió un bombillo <span class="tenue">· ver mi progreso →</span>');
    });
  }
}

// ---------- pantalla 5: mi progreso (los bombillos) ----------

async function vistaProgreso() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'mi progreso', corto: 'progreso' }]);
  const recien = recienPrendidos();
  const total = ORDEN.reduce((s, n) => s + (conteo[n] || 0), 0);
  const prendidosTodos = ORDEN.reduce((s, n) => s + prendidos(n), 0);
  const titulos = {};
  await Promise.all(ORDEN.map(async (num) => {
    try { titulos[num] = partir(await leerArchivo(rutaDoc(num))).partes.map((p) => textoPlano(p.titulo)); } catch (e) { titulos[num] = []; }
  }));

  let orden = 0;
  const etapas = ETAPAS.map((e, k) => {
    const filas = e.clases.map((num) => {
      const bombillos = (titulos[num] || []).map((t, i) => {
        const id = idParte(num, 0, i + 1);
        const prendido = estaEntendida(id);
        const nuevo = prendido && recien.has(id);
        const espera = nuevo ? `style="--espera:${(orden++) * 220}ms"` : '';
        return `<a class="bombillo ${prendido ? 'prendido' : ''} ${nuevo ? 'nuevo' : ''}" ${espera}
          href="#/clase/${num}/0/${i + 1}" title="${escapar(`${dos(i + 1)}. ${t}`)}" aria-label="${escapar(`Parte ${i + 1}: ${t}, ${prendido ? 'entendida' : 'pendiente'}`)}">💡</a>`;
      }).join('');
      const est = estadoClase(num);
      return `<div class="fila-bombillos ${est}">
        <a class="fila-clase" href="#/clase/${num}"><span class="mono acento">${num}</span> ${escapar(CLASES[num].titulo)}</a>
        <span class="bombillos">${bombillos}</span>
        <span class="mono tenue cuenta">${prendidos(num)}/${conteo[num] || 0}</span>
      </div>`;
    }).join('');
    const pe = e.clases.reduce((s, n) => s + prendidos(n), 0);
    const te = e.clases.reduce((s, n) => s + (conteo[n] || 0), 0);
    return `<section class="etapa-progreso">
      <h2 class="mono"><span class="emoji">${e.icono}</span> ${dos(k + 1)} · ${escapar(e.titulo)} <span class="tenue">${pe}/${te}</span></h2>
      ${filas}
    </section>`;
  }).join('');

  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// mi progreso · en este navegador, y en la nube si inicias sesión</p>
      <h1 class="titulo-medio">💡 Mi progreso</h1>
      <p class="bajada">Cada bombillo es una parte de una clase. Se prende cuando, al terminar de leerla,
        tocas <b>"¿lo entendiste? márcalo"</b>. Toca un bombillo para ir a esa parte.</p>
      <div class="gran-cuenta mono"><b>${prendidosTodos}</b> de ${total} bombillos prendidos
        ${recien.size ? `<span class="insignia actual">+${recien.size} desde la última vez</span>` : ''}</div>
      <div class="barra-progreso ancha"><span style="width:${total ? (prendidosTodos / total) * 100 : 0}%"></span></div>
      <div class="caja-nube mono" id="caja-nube">☁ …</div>
    </section>
    ${etapas}
    <p class="centro"><a class="boton" href="#/certificado">🎓 ${prendidosTodos === total ? 'ver mi certificado' : `certificado: faltan ${total - prendidosTodos} bombillos`}</a></p>
    <details class="intro llevar">
      <summary class="mono">// llevar mi progreso a otro aparato (de la Mac al iPad, por ejemplo)</summary>
      <div class="texto">
        <p>Tu progreso vive en este navegador. Nadie más lo ve ni lo puede cambiar, y si otra persona estudia aquí,
          ve el suyo. Para pasarlo a otro aparato: copia este código, abre el mapa en el otro aparato,
          y pégalo abajo.</p>
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
  pintarCajaNube(app.querySelector('#caja-nube'), total);
  // Ya los viste prenderse: la próxima vez no se animan de nuevo.
  olvidarRecien();
}

// La cajita de "Mi progreso" que dice cuántos bombillos cuentan en la nube.
async function pintarCajaNube(caja, total) {
  try {
    const quien = await nube.usuario();
    if (!quien) {
      caja.innerHTML = `☁ Tus bombillos solo están en este navegador. Para el <b>certificado verificable</b>, inicia sesión:
        <button class="boton" id="nube-entrar" type="button">Iniciar sesión con Google</button>`;
      caja.querySelector('#nube-entrar').addEventListener('click', async () => {
        try { await nube.entrar(); dibujar(); } catch (e) { avisar('✗ no se pudo iniciar sesión'); }
      });
      return;
    }
    const p = await nube.leerProgresoNube();
    caja.innerHTML = `☁ en la nube: <b>${p?.n || 0}</b> de ${total} <span class="tenue">· ${escapar(quien.displayName || quien.email || '')}</span>
      <button class="boton" id="nube-salir" type="button">cerrar sesión</button>`;
    caja.querySelector('#nube-salir').addEventListener('click', async () => { await nube.salir(); dibujar(); });
  } catch (e) {
    caja.textContent = '☁ sin conexión con la nube (tu progreso local sigue aquí)';
  }
}

// ---------- pantalla 6: el certificado ----------
// Se emite en Firebase cuando la nube ve TODAS las partes (las reglas lo comprueban, no el navegador).
// Es un certificado de finalización emitido por el propio curso: no es un título oficial.

const FECHA_LARGA = { day: 'numeric', month: 'long', year: 'numeric' };
const URL_SITIO = 'delvinsmart.github.io/estudios';

function totalPartes() {
  return ORDEN.reduce((s, n) => s + (conteo[n] || 0), 0);
}

// El dibujo del certificado. Lo usan la muestra, el certificado propio y la página de verificar.
function htmlCertificado({ nombre, fecha, codigo, total, muestra }) {
  const fechaTexto = fecha.toLocaleDateString('es', FECHA_LARGA);
  const anio = fecha.getFullYear();
  const etapas = ETAPAS.map((e) => `<li><span class="cert-num">[✓]</span>${escapar(e.titulo)}</li>`).join('');
  // El nombre y el código, escritos en binario (8 bits por letra), para las columnas de los lados.
  const binario = (t) => [...new TextEncoder().encode(t)].map((b) => b.toString(2).padStart(8, '0')).join('');
  const bitsIzq = binario(`${nombre} ${codigo} `).repeat(12).slice(0, 1400);
  const bitsDer = binario(`mapa-de-estudios ${anio} 20/20 ${total}/${total} exit 0 `).repeat(6).slice(0, 1400);
  const verificarEn = muestra ? `${URL_SITIO}/#/verificar` : `${URL_SITIO}/#/verificar/${codigo}`;
  return `
    <article class="certificado ${muestra ? 'es-muestra' : ''}">
      <div class="cert-hoja">
        <span class="cert-esquina e1"></span><span class="cert-esquina e2"></span>
        <span class="cert-esquina e3"></span><span class="cert-esquina e4"></span>
        <div class="cert-bits izq" aria-hidden="true">${bitsIzq}</div>
        <div class="cert-bits der" aria-hidden="true">${bitsDer}</div>
        <p class="cert-marca">delvin@estudios:~$ ./certificado</p>
        <h1 class="cert-titulo">Certificado</h1>
        <p class="cert-tipo">de finalización</p>
        <p class="cert-estado">status: <b>completado</b> · ${ORDEN.length}/${ORDEN.length} clases · ${total}/${total} partes · exit 0</p>
        <p class="cert-otorga">Se otorga a</p>
        <p class="cert-nombre">${escapar(nombre || '—')}</p>
        <p class="cert-texto">por completar el curso <b>Mapa de estudios: programación, de los fundamentos a los agentes de IA</b>,
          con sus ${ORDEN.length} clases y ${total} partes, aprobando la práctica de cada una.</p>
        <ul class="cert-etapas">${etapas}</ul>
        <div class="cert-pie">
          <div class="cert-dato"><span class="cert-valor">${escapar(fechaTexto)}</span><span class="cert-rotulo">// fecha</span></div>
          <svg class="cert-sello" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="cert-arco" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs>
            <circle cx="60" cy="60" r="57" class="s-borde"/>
            <circle cx="60" cy="60" r="51" class="s-fino"/>
            <circle cx="60" cy="60" r="34" class="s-fino"/>
            <text class="s-texto"><textPath href="#cert-arco" startOffset="0" textLength="272" lengthAdjust="spacing">&lt;/&gt; MAPA_DE_ESTUDIOS · ${anio} · COMPLETADO ·</textPath></text>
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
      <p class="bajada">${texto}</p>
      <div class="acciones">${acciones}</div>
    </section>`;
}

async function vistaCertificado(muestra) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'certificado', corto: 'certificado' }]);
  const total = totalPartes();

  if (muestra) {
    app.innerHTML = `
      <div class="cert-herramientas no-imprimir">
        <p class="mono comentario">// muestra: así se verá cuando completes el curso</p>
        <label class="mono" for="cert-nombre">nombre (solo para la muestra)</label>
        <div class="fila-codigo"><input id="cert-nombre" class="mono" value="${escapar(leerNombre())}" placeholder="Escribe tu nombre">
          <button class="boton" id="cert-guardar" type="button">poner</button>
          <a class="boton" href="#/certificado">mi certificado de verdad →</a></div>
      </div>
      ${htmlCertificado({ nombre: leerNombre() || 'Tu nombre', fecha: new Date(), codigo: 'MUESTRA', total, muestra: true })}`;
    const entrada = app.querySelector('#cert-nombre');
    const poner = () => { guardarNombre(entrada.value.trim()); dibujar(); };
    app.querySelector('#cert-guardar').addEventListener('click', poner);
    entrada.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') poner(); });
    return;
  }

  app.innerHTML = '<p class="mono tenue centro">// conectando con la nube…</p>';
  let quien;
  try { quien = await nube.usuario(); } catch (e) {
    pantallaAviso('☁ Sin conexión', 'No pude conectar con el servidor del certificado. Revisa tu internet y vuelve a intentar.');
    return;
  }

  if (!quien) {
    pantallaAviso('🎓 Tu certificado verificable',
      `Para que el certificado se pueda <b>verificar</b>, tu progreso tiene que estar en el servidor, no solo en este navegador.
       Inicia sesión con Google: desde ahí, cada bombillo que prendas cuenta también en la nube.`,
      `<button class="boton-principal" id="cert-entrar" type="button">Iniciar sesión con Google</button>
       <a class="boton" href="#/certificado/muestra">ver cómo será (muestra)</a>`);
    app.querySelector('#cert-entrar').addEventListener('click', async () => {
      try { await nube.entrar(); dibujar(); } catch (e) { avisar('✗ no se pudo iniciar sesión'); }
    });
    return;
  }

  const propio = await nube.miCertificado();
  if (propio) {
    app.innerHTML = `
      <div class="cert-herramientas no-imprimir">
        <p class="mono comentario">// tu certificado · registrado en el servidor</p>
        <div class="fila-codigo">
          <button class="boton-principal" id="cert-imprimir" type="button">imprimir / guardar PDF</button>
          <a class="boton" href="#/verificar/${propio.codigo}">ver la página de verificación</a>
          <button class="boton" id="cert-copiar" type="button">copiar enlace para LinkedIn</button>
          <button class="boton" id="cert-borrar" type="button">corregir el nombre</button>
        </div>
      </div>
      ${htmlCertificado({ nombre: propio.nombre, fecha: propio.emitido, codigo: propio.codigo, total: propio.partes })}`;
    app.querySelector('#cert-imprimir').addEventListener('click', () => window.print());
    app.querySelector('#cert-copiar').addEventListener('click', async (ev) => {
      const enlace = `https://${URL_SITIO}/#/verificar/${propio.codigo}`;
      try { await navigator.clipboard.writeText(enlace); ev.currentTarget.textContent = '✓ copiado'; } catch (e) { prompt('Copia este enlace:', enlace); }
    });
    app.querySelector('#cert-borrar').addEventListener('click', async () => {
      if (!confirm('Esto borra tu certificado actual (el código dejará de funcionar) para que lo emitas de nuevo con otro nombre. ¿Seguir?')) return;
      await nube.borrarMiCertificado(propio.codigo);
      dibujar();
    });
    return;
  }

  const progreso = await nube.leerProgresoNube();
  const enNube = progreso?.n || 0;
  if (enNube < total) {
    pantallaAviso('🎓 Todavía no',
      `El certificado se emite cuando el servidor ve <b>todas</b> las partes. En la nube llevas
       <b>${enNube}</b> de <b>${total}</b> <span class="tenue">(sesión: ${escapar(quien.displayName || quien.email || 'Google')})</span>.
       <br><br>Los bombillos que prendiste <b>antes</b> de iniciar sesión solo están en este navegador:
       entra a esas partes y toca <b>☁ contar en la nube</b>.
       <div class="barra-progreso ancha"><span style="width:${(enNube / total) * 100}%"></span></div>`,
      `<a class="boton-principal" href="#/progreso">💡 ver mi progreso</a>
       <a class="boton" href="#/certificado/muestra">ver cómo será (muestra)</a>`);
    return;
  }

  pantallaAviso('🎓 ¡Completaste el curso!',
    `El servidor ve las ${total} partes. Escribe tu nombre <b>tal como quieres que aparezca</b> y emite tu certificado.
     Queda registrado con un código que cualquiera puede comprobar.
     <div class="fila-codigo"><input id="cert-nombre" class="mono" maxlength="80" value="${escapar(leerNombre() || quien.displayName || '')}"></div>`,
    `<button class="boton-principal" id="cert-emitir" type="button">emitir mi certificado</button>`);
  app.querySelector('#cert-emitir').addEventListener('click', async (ev) => {
    const nombre = app.querySelector('#cert-nombre').value.trim().replace(/\s+/g, ' ');
    if (nombre.length < 3) { avisar('✗ escribe tu nombre completo'); return; }
    ev.currentTarget.disabled = true;
    try { guardarNombre(nombre); await nube.emitirCertificado(nombre, total); dibujar(); }
    catch (e) { ev.currentTarget.disabled = false; avisar('✗ el servidor no lo aceptó; recarga e intenta de nuevo'); }
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
    pantallaAviso('🔎 Verificar un certificado', 'Escribe el código que aparece en el certificado.', formulario());
    conectar();
    return;
  }

  app.innerHTML = '<p class="mono tenue centro">// consultando el servidor…</p>';
  let datos = null;
  try { datos = await nube.verificar(codigo.toUpperCase()); } catch (e) {
    pantallaAviso('☁ Sin conexión', 'No pude consultar el servidor. Revisa tu internet y vuelve a intentar.');
    return;
  }
  if (!datos) {
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
        <dt>código</dt><dd>${escapar(datos.codigo)}</dd>
        <dt>emitido</dt><dd>${datos.emitido.toLocaleDateString('es', FECHA_LARGA)}</dd>
        <dt>estudió</dt><dd>del ${datos.inicio.toLocaleDateString('es', FECHA_LARGA)} al ${datos.fin.toLocaleDateString('es', FECHA_LARGA)} (${dias} ${dias === 1 ? 'día' : 'días'})</dd>
        <dt>partes</dt><dd>${datos.partes} de ${datos.partes}, una por una, con hora del servidor</dd>
      </dl>
      <p class="tenue">Lo que garantiza esta página: que el certificado fue emitido por este curso, a ese nombre, después de
        registrar cada parte en el servidor. No es un título oficial.</p>
    </section>
    ${htmlCertificado({ nombre: datos.nombre, fecha: datos.emitido, codigo: datos.codigo, total: datos.partes })}`;
}

// ---------- el que decide qué pantalla mostrar ----------

async function dibujar() {
  const partesRuta = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  try {
    if (partesRuta[0] === 'progreso') await vistaProgreso();
    else if (partesRuta[0] === 'certificado') await vistaCertificado(partesRuta[1] === 'muestra');
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
  dibujar();
}

empezar();
