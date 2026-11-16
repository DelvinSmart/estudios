// Pantalla 4: leer una parte (o la clase entera de corrido), con sus prácticas,
// el botón "¿lo entendiste?" y el bombillo en la nube.

import { CLASES, ETAPAS } from '../cursos.js';
import { leerArchivo, partir } from '../lector.js';
import { idParte, estaEntendida, marcarEntendida } from '../guardado.js';
import * as nube from '../nube.js';
import { app, ponerMigas, avisar, enLinea, escapar, dos } from '../pantalla.js';
import { rutaDoc, etapaDe, cursoDeClase } from '../avance.js';
import { pintarMarkdown } from '../markdown.js';
import { ponerBarraDeVoz } from '../voz.js';
import { hayDatosDeSesion } from '../sesion.js';
import { vistaInicio } from './mapas.js';

// ---------- pantalla 4: leer una parte ----------

export async function vistaParte(num, doc, cual) {
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
      <nav class="pasos pasos-arriba">
        <a class="paso" href="#/clase/${num}/${doc}">← volver al mapa de la clase</a>
        <span class="mono tenue">
          ${i > 1 ? `<a href="#/clase/${num}/${doc}/${i - 1}">‹ anterior</a>` : ''}
          ${i > 1 && i < partes.length ? ' · ' : ''}
          ${i < partes.length ? `<a href="#/clase/${num}/${doc}/${i + 1}">siguiente ›</a>` : ''}
        </span>
      </nav>
      <p class="mono comentario">// parte ${dos(i)} de ${dos(partes.length)}</p>
      <h1 class="titulo-parte grande">${enLinea(parte.titulo)}</h1>`);
    if (parte.sub.length > 1) {
      hoja.insertAdjacentHTML('beforeend', `<div class="mini-mapa">${parte.sub.map((s, k) =>
        `<a href="#" data-sub="${k}">${/^\d/.test(s) ? '' : `<span class="mono acento">${dos(i)}.${k + 1}</span> `}${enLinea(s)}</a>`).join('')}</div>`);
    }
    hoja.appendChild(pintarMarkdown(parte.md, c.carpeta, idParte(num, doc, i)));
    // 🔊 Escuchar la parte con la voz del aparato, justo debajo del título.
    ponerBarraDeVoz(hoja, hoja.querySelector('.mini-mapa') || hoja.querySelector('.texto'));

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
    // Para el certificado solo cuentan las partes del documento principal (la primera pestaña);
    // las de "Resumen", "Informe" o "Para la entrevista" quedan solo en este navegador.
    const cuentaEnNube = doc === 0;
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
      // ¿Lo rechazó porque el servidor todavía no aprobó la práctica de esta parte?
      if (hoja.querySelector('.practica') && !(await nube.parteAprobadaEnNube(curso, id).catch(() => true))) {
        cajaNube.innerHTML = '☁ para que cuente en la nube, aprueba la práctica de esta parte con tu cuenta abierta (el servidor la corrige)';
        return;
      }
      cajaNube.innerHTML = '<button class="boton" type="button">☁ reintentar en la nube</button>';
      cajaNube.querySelector('button').addEventListener('click', () => subirANube(true));
    };
    // Cuando el servidor aprueba la práctica de una parte que ya estaba prendida aquí, se sube sola a la nube.
    hoja.addEventListener('practica-aprobada', (ev) => {
      if (cuentaEnNube && ev.detail?.parteAprobada && estaEntendida(id)) subirANube(false);
    });
    // Al abrir la parte: si está prendida aquí pero no en la nube, ofrecer contarla.
    (cuentaEnNube && hayDatosDeSesion() ? nube.usuario() : Promise.resolve(null)).then(async (quien) => {
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
      const quien = cuentaEnNube && hayDatosDeSesion() ? await nube.usuario().catch(() => null) : null;
      if (quien) subirANube(true);
      else avisar('💡 se prendió un bombillo <span class="tenue">· ver mi progreso →</span>');
    });
  }
}
