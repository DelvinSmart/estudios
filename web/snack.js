// Los ejercicios de REACT NATIVE con la app de verdad: un bloque ```snack abre la app en Expo Snack (gratis), dentro
// de la página, con el código de inicio. El alumno lo cambia y ve la app al instante.
//
// Desde aquí NO se puede leer lo que el alumno escribe adentro de Snack (es otro sitio, y así debe ser). Por eso la
// revisión es una LISTA DE COMPROBACIÓN: lo que tiene que ver en la app, que el alumno va marcando (plan, punto A).
//
// En un bloque ```snack:
//   titulo: …      pide: …      dependencias: (opcional) "react-native-paper@5"
//   --- código       el App.js de inicio
//   --- comprobar    una línea por cosa que se tiene que ver en la app (empiezan con "- ")
//   --- solución     el App.js resuelto (se puede abrir en Snack para compararlo)
//
// Cómo se arma Snack, sin cargar su script: un iframe a snack.expo.dev/embedded con waitForData=true. Cuando Snack
// avisa "expoFrameLoaded" (con nuestro iframeId), se le manda el código. Es lo mismo que hace su embed.js oficial,
// pero así esta página no carga código de afuera, y el código solo se le manda a snack.expo.dev (no a "*").
// Snack se abre recién al tocar el botón: siete Snacks abiertos de golpe pesarían mucho.

import { escapar as esc } from './texto.js';

export const ORIGEN_SNACK = 'https://snack.expo.dev';
const CLAVE = 'mapa-snack:';
const CLAVE_OK = 'mapa-snack-ok:';
const enLinea = (md) => (globalThis.window?.marked ? window.marked.parseInline(md) : esc(md));
const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const escribir = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

/** Lee el bloque: { titulo, pide, dependencias, codigo, comprobar: [..], solucion }. */
export function leerSnack(texto) {
  const trozos = texto.replace(/\r/g, '').split(/^---\s*(código|codigo|comprobar|solución|solucion)\s*$/m);
  const secciones = {};
  for (let i = 1; i < trozos.length; i += 2) {
    const nombre = trozos[i].normalize('NFD').replace(/[̀-ͯ]/g, '');
    secciones[nombre] = trozos[i + 1].replace(/^\n/, '').replace(/\n+$/, '');
  }
  const campos = {};
  let actual = null;
  for (const linea of trozos[0].split('\n')) {
    const m = linea.match(/^(titulo|título|pide|dependencias):\s*(.*)$/i);
    if (m) { actual = m[1].toLowerCase().replace('í', 'i'); campos[actual] = m[2]; }
    else if (actual && linea.trim()) campos[actual] += ` ${linea.trim()}`;
  }
  return {
    titulo: campos.titulo || 'La app de verdad',
    pide: campos.pide || '',
    dependencias: campos.dependencias || '',
    codigo: secciones.codigo || '',
    comprobar: (secciones.comprobar || '').split('\n').map((l) => l.replace(/^\s*-\s*(\[ \]\s*)?/, '').trim()).filter(Boolean),
    solucion: secciones.solucion || '',
  };
}

/** La dirección del iframe de Snack: espera los datos (waitForData), con la vista de la app al lado. */
export function urlSnack({ iframeId, tema = 'dark', nombre = 'Ejercicio' }) {
  const p = new URLSearchParams({
    iframeId,
    preview: 'true',
    platform: 'web',                      // la vista web corre en el navegador, sin teléfono ni cuenta
    supportedPlatforms: 'web,ios,android', // y deja elegir iOS o Android (o abrirlo en Expo Go con el QR)
    theme: tema === 'light' ? 'light' : 'dark',
    name: nombre,
    waitForData: 'true',
  });
  return `${ORIGEN_SNACK}/embedded?${p}`;
}

/** ¿Este mensaje es de NUESTRO Snack avisando que está listo? (de snack.expo.dev y con nuestro iframeId) */
export function snackListo(evento, iframeId) {
  return evento.origin === ORIGEN_SNACK
    && Array.isArray(evento.data)
    && evento.data[0] === 'expoFrameLoaded'
    && evento.data[1]?.iframeId === iframeId;
}

/** Lo que se le manda a Snack cuando avisa que está listo: el App.js y, si hace falta, las dependencias. */
export function datosParaSnack(iframeId, codigo, dependencias = '') {
  return ['expoDataEvent', { iframeId, code: codigo, ...(dependencias ? { dependencies: dependencias } : {}) }];
}

// ---------- la caja en la página ----------
export function crearSnack(texto, id) {
  const s = leerSnack(texto);
  const caja = document.createElement('div');
  caja.className = 'ejercicio snack';
  const marcadas = new Set(JSON.parse(leer(CLAVE + id) || '[]'));
  const resuelto = () => s.comprobar.length > 0 && s.comprobar.every((_, i) => marcadas.has(i));

  caja.innerHTML = `
    <div class="ejercicio-cabeza mono"><span>📱 la app de verdad · React Native</span><span class="ejercicio-estado"></span></div>
    <p class="ejercicio-titulo">${enLinea(s.titulo)}</p>
    ${s.pide ? `<p class="ejercicio-pide">${enLinea(s.pide)}</p>` : ''}
    <div class="ejercicio-botones">
      <button class="boton-principal snack-abrir" type="button">▶ abrir la app en Snack</button>
      ${s.solucion ? '<button class="boton snack-solucion" type="button" disabled title="Primero ábrela y pruébala">ver la solución</button>' : ''}
    </div>
    <p class="tenue snack-nota">Se abre <strong>Expo Snack</strong> (gratis): tu código viaja a snack.expo.dev, que dibuja la app al lado. Cambia el código y la app cambia al instante. Para verla en tu teléfono, elige iOS o Android y escanea el QR con Expo Go.</p>
    <p class="tenue snack-nota snack-angosta">En una pantalla angosta (como la del celular), Snack muestra <strong>solo el código</strong>, sin la app. Para verla, ábrela en la computadora o en una tableta, o toca el ⧉ de arriba del editor para abrirla en grande.</p>
    <div class="snack-marco" hidden></div>
    ${s.comprobar.length ? `<div class="snack-lista"><p class="ejercicio-cuenta mono">Lo que tienes que ver en la app (márcalo cuando lo veas):</p>
      <ul class="ejercicio-pruebas">${s.comprobar.map((c, i) => `<li><label><input type="checkbox" data-i="${i}" ${marcadas.has(i) ? 'checked' : ''}> ${enLinea(c)}</label></li>`).join('')}</ul></div>` : ''}
    <pre class="ejercicio-solucion" hidden></pre>`;

  const marco = caja.querySelector('.snack-marco');
  const botonAbrir = caja.querySelector('.snack-abrir');
  const botonSol = caja.querySelector('.snack-solucion');
  const ponerEstado = () => {
    const ok = resuelto();
    caja.classList.toggle('resuelto', ok);
    caja.querySelector('.ejercicio-estado').textContent = ok ? '✓ resuelto' : '';
    escribir(CLAVE_OK + id, ok ? '1' : null);
  };
  ponerEstado();

  let oyente = null;
  const abrir = (codigo) => {
    const iframeId = Math.random().toString(36).slice(2, 12);
    const tema = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    if (oyente) window.removeEventListener('message', oyente);
    oyente = (ev) => {
      if (!snackListo(ev, iframeId)) return;           // solo nuestro Snack, desde snack.expo.dev
      ev.source.postMessage(datosParaSnack(iframeId, codigo, s.dependencias), ORIGEN_SNACK);
    };
    window.addEventListener('message', oyente);
    marco.hidden = false;
    marco.innerHTML = `<iframe title="La app en Expo Snack" loading="lazy" src="${esc(urlSnack({ iframeId, tema, nombre: s.titulo }))}"></iframe>`;
    if (botonSol) { botonSol.disabled = false; botonSol.title = ''; }
  };

  botonAbrir.addEventListener('click', () => { abrir(s.codigo); botonAbrir.textContent = '↻ volver al código de inicio'; });
  botonSol?.addEventListener('click', () => {
    const sol = caja.querySelector('.ejercicio-solucion');
    sol.hidden = !sol.hidden;
    sol.textContent = s.solucion;
    botonSol.textContent = sol.hidden ? 'ver la solución' : 'ocultar la solución';
  });
  caja.querySelectorAll('.snack-lista input').forEach((cb) => cb.addEventListener('change', () => {
    const i = Number(cb.dataset.i);
    cb.checked ? marcadas.add(i) : marcadas.delete(i);
    escribir(CLAVE + id, JSON.stringify([...marcadas]));
    ponerEstado();
  }));
  return caja;
}
