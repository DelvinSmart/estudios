// Lo que comparten todas las pantallas: dónde se dibuja, las migas de arriba, los avisos
// y tres ayudantes de texto. No sabe de clases ni de cursos.

export const app = document.getElementById('app');
export const migas = document.getElementById('migas');
const rutaTerminal = document.getElementById('ruta-terminal');

export const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const enLinea = (md) => window.marked.parseInline(md);
export const dos = (n) => String(n).padStart(2, '0');

export function avisar(texto) {
  const aviso = document.createElement('a');
  aviso.className = 'tostada mono';
  aviso.href = '#/progreso';
  aviso.innerHTML = texto;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.classList.add('saliendo'), 2600);
  setTimeout(() => aviso.remove(), 3200);
}

export function ponerMigas(lista) {
  migas.innerHTML = lista
    .map((m, i) => (i < lista.length - 1 && m.href
      ? `<a href="${m.href}">${m.texto}</a>`
      : `<span aria-current="page">${m.texto}</span>`))
    .join('<span class="sep">/</span>');
  rutaTerminal.textContent = lista.length > 1 ? '~/' + lista.slice(1).map((m) => m.corto).join('/') : '~';
}

export function mostrarError(err) {
  app.innerHTML = `<div class="error mono"><p>✗ ${escapar(err.message)}</p>
    <p class="tenue">Si abriste el archivo con doble clic, la página no puede leer las lecciones.
    Hay que abrirla con un servidor (ver la clase 18) o desde GitHub Pages.</p>
    <p><a href="#/">← volver al mapa</a></p></div>`;
}

// Volver a dibujar la pantalla actual (por ejemplo, después de entrar o de emitir un certificado).
// app.js le dice cuál es la función que dibuja; así las pantallas no dependen de app.js.
let funcionDibujar = () => {};
export function alRedibujar(funcion) { funcionDibujar = funcion; }
export function redibujar() { return funcionDibujar(); }
