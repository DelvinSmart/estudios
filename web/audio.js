// El reproductor de audio: escuchar las clases con la pantalla bloqueada.
//
// La voz del navegador (voz.js) se corta al bloquear el iPhone. Estos son audios de verdad (m4a),
// generados gratis en la Mac con Piper (herramientas/audio/generar-audios.mjs) y publicados en
// otro repositorio (estudios-audio) para no llenar este. Un elemento <audio> sí sigue sonando
// con la pantalla bloqueada, y la Media Session pone los controles en la pantalla de bloqueo.
//
// El reproductor vive FUERA de la pantalla (en el body): cambiar de pantalla no lo corta.
// Al terminar una parte, sigue con la siguiente del mismo curso.

import { CLASES } from './cursos.js';
import { conteo, ordenDe, cursoDeClase, numeroEnCurso } from './avance.js';

// Para probar en la Mac se puede apuntar a otra carpeta: localStorage 'mapa-audio-base'.
const BASE = (() => { try { return localStorage.getItem('mapa-audio-base') || ''; } catch (e) { return ''; } })()
  || 'https://delvinsmart.github.io/estudios-audio/audio/';
const CLAVE = 'mapa-audio';
let indice = null;          // { "01:CLASE-GUIADA.md:3": { archivo: "01/03.m4a" } }
let actual = null;          // { num, i }
let audio = null;
let barra = null;

function leerPref() { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } }
function guardarPref(p) { try { localStorage.setItem(CLAVE, JSON.stringify({ ...leerPref(), ...p })); } catch (e) { /* nada */ } }

// El interruptor del motor de voz: herramientas/audio/motor.json ("activo": false apaga los audios grabados).
// Es el mismo archivo que usa el generador y la automatización de GitHub: un solo interruptor para todo.
let motorActivo = null;
async function motorEncendido() {
  if (motorActivo !== null) return motorActivo;
  try {
    const r = await fetch('herramientas/audio/motor.json', { cache: 'no-cache' });
    motorActivo = r.ok ? (await r.json()).activo !== false : true;
  } catch (e) { motorActivo = true; }
  return motorActivo;
}

async function cargarIndice() {
  if (indice) return indice;
  if (!(await motorEncendido())) { indice = {}; return indice; }
  try {
    const r = await fetch(`${BASE}indice.json`, { cache: 'no-cache' });
    indice = r.ok ? await r.json() : {};
  } catch (e) { indice = {}; }
  return indice;
}

const idDe = ({ num, i }) => `${num}:${CLASES[num].docs[0].archivo}:${i}`;
export async function hayAudio(num, i) {
  const ind = await cargarIndice();
  return Boolean(ind[idDe({ num, i })]);
}

// La parte siguiente del curso (para seguir solo al terminar).
function siguiente({ num, i }) {
  if (i < (conteo[num] || 0)) return { num, i: i + 1 };
  const orden = ordenDe(cursoDeClase(num));
  for (let k = orden.indexOf(num) + 1; k < orden.length; k++) if (conteo[orden[k]]) return { num: orden[k], i: 1 };
  return null;
}
function anterior({ num, i }) {
  if (i > 1) return { num, i: i - 1 };
  const orden = ordenDe(cursoDeClase(num));
  for (let k = orden.indexOf(num) - 1; k >= 0; k--) if (conteo[orden[k]]) return { num: orden[k], i: conteo[orden[k]] };
  return null;
}

const tituloDe = ({ num, i }) => `Clase ${numeroEnCurso(num)} · ${CLASES[num].titulo} · parte ${String(i).padStart(2, '0')}`;

function armarBarra() {
  if (barra) return;
  audio = document.createElement('audio');
  audio.preload = 'auto';
  barra = document.createElement('div');
  barra.className = 'reproductor mono';
  // Una sola fila en el celular: ▶, el título y "⋯" (que abre el resto de los controles).
  barra.innerHTML = `
    <div class="rep-fila">
      <button type="button" data-a="play" class="rep-play" aria-label="Reproducir o pausar">▶</button>
      <a class="rep-titulo" href="#/" title="Ir a esta parte"></a>
      <span class="rep-tiempo">0:00</span>
      <button type="button" data-a="mas-controles" class="rep-mas" aria-label="Más controles" aria-expanded="false">⋯</button>
      <button type="button" data-a="cerrar" aria-label="Cerrar el reproductor">✕</button>
    </div>
    <div class="rep-extra">
      <button type="button" data-a="ant" aria-label="Parte anterior">⏮</button>
      <button type="button" data-a="menos" aria-label="Atrás 15 segundos">↺15</button>
      <button type="button" data-a="mas" aria-label="Adelante 15 segundos">15↻</button>
      <button type="button" data-a="sig" aria-label="Parte siguiente">⏭</button>
      <select data-a="vel" aria-label="Velocidad">${[0.8, 1, 1.2, 1.4, 1.6].map((v) => `<option value="${v}">${v}x</option>`).join('')}</select>
    </div>`;
  barra.append(audio);
  document.body.append(barra);
  const vel = barra.querySelector('[data-a="vel"]');
  vel.value = String(leerPref().velocidad || 1);
  const minutos = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  barra.addEventListener('click', (ev) => {
    const a = ev.target.closest('button')?.dataset.a;
    if (a === 'play') audio.paused ? audio.play() : audio.pause();
    if (a === 'menos') audio.currentTime = Math.max(0, audio.currentTime - 15);
    if (a === 'mas') audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
    if (a === 'sig') { const s = siguiente(actual); if (s) reproducir(s); }
    if (a === 'ant') { const s = anterior(actual); if (s) reproducir(s); }
    if (a === 'cerrar') { audio.pause(); barra.hidden = true; document.body.classList.remove('con-reproductor'); }
    if (a === 'mas-controles') {
      const abierto = barra.classList.toggle('rep-abierto');
      ev.target.closest('button').setAttribute('aria-expanded', String(abierto));
    }
  });
  vel.addEventListener('change', () => { audio.playbackRate = Number(vel.value); guardarPref({ velocidad: Number(vel.value) }); });
  audio.addEventListener('play', () => { barra.querySelector('.rep-play').textContent = '⏸'; });
  audio.addEventListener('pause', () => { barra.querySelector('.rep-play').textContent = '▶'; });
  audio.addEventListener('timeupdate', () => {
    barra.querySelector('.rep-tiempo').textContent = `${minutos(audio.currentTime)} / ${minutos(audio.duration || 0)}`;
    if (actual) guardarPref({ ultimo: { ...actual, t: Math.floor(audio.currentTime) } });
  });
  // Cada audio suena SOLO la parte que la persona apretó: al terminar, se DETIENE.
  // No salta solo a la siguiente parte ni, menos, a la clase que sigue (confundía: estabas en la
  // clase 1 y empezaba a sonar la 2). Para seguir, se usa ⏭ o el botón Escuchar de la otra parte.
  audio.addEventListener('ended', () => { barra.querySelector('.rep-play').textContent = '▶'; });

  // Los controles de la pantalla de bloqueo y de los audífonos.
  if ('mediaSession' in navigator) {
    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => audio.play());
    ms.setActionHandler('pause', () => audio.pause());
    ms.setActionHandler('previoustrack', () => { const s = anterior(actual); if (s) reproducir(s); });
    ms.setActionHandler('nexttrack', () => { const s = siguiente(actual); if (s) reproducir(s); });
    ms.setActionHandler('seekbackward', () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
    ms.setActionHandler('seekforward', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); });
  }
}

export async function reproducir(parte, desde = 0) {
  const ind = await cargarIndice();
  const entrada = ind[idDe(parte)];
  if (!entrada) return false;
  armarBarra();
  actual = parte;
  barra.hidden = false;
  document.body.classList.add('con-reproductor');
  audio.src = `${BASE}${entrada.archivo}`;
  audio.playbackRate = Number(leerPref().velocidad || 1);
  if (desde) audio.addEventListener('loadedmetadata', () => { audio.currentTime = desde; }, { once: true });
  const titulo = barra.querySelector('.rep-titulo');
  titulo.textContent = tituloDe(parte);
  titulo.href = `#/clase/${parte.num}/0/${parte.i}`;
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${CLASES[parte.num].titulo} · parte ${parte.i}`,
      artist: 'Mapa de estudios',
      album: `Clase ${numeroEnCurso(parte.num)}`,
    });
  }
  try { await audio.play(); } catch (e) { /* el navegador pide un toque: queda listo para ▶ */ }
  return true;
}

// El botón "🎧 Escuchar" de cada parte (el audio grabado sigue sonando con la pantalla bloqueada).
// Devuelve false si esta parte no tiene audio grabado (o el motor está apagado): entonces se usa la voz del aparato.
export async function ponerBotonAudio(contenedor, num, i) {
  if (!(await hayAudio(num, i))) return false;
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'boton boton-audio';
  boton.title = 'Sigue sonando con la pantalla bloqueada';
  boton.textContent = '🎧 Escuchar';
  boton.addEventListener('click', () => reproducir({ num, i }));
  contenedor.prepend(boton);
  return true;
}
