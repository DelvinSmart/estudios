// El mapa de islas: cada parada es una isla flotante con su tarjeta, unidas por un camino punteado.
// Se usa en el mapa grande (etapas), en cada etapa (clases) y en cada clase (partes).
//
// Cómo se acomoda: las islas van en filas que se recorren como una serpiente
// (la primera fila de izquierda a derecha, la segunda de derecha a izquierda…).
// Cuántas islas por fila depende del ancho de la pantalla: 3, 2 o 1 (celular).
// El camino se dibuja con SVG después, midiendo dónde quedó cada isla.

const escapar = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Una parada: { num, titulo (html), desc (html), extra (html), pie (html), href, estado, icono }
// estado: 'hecha' | 'actual' | 'empezada' | 'pendiente'
function htmlParada(p, i) {
  return `
    <li class="isla-parada ${p.estado}" data-i="${i}">
      <a class="isla-enlace" href="${p.href}">
        <span class="isla" aria-hidden="true">
          <span class="isla-roca"></span><span class="isla-pasto"></span>
          <span class="isla-arbol a1">🌲</span><span class="isla-arbol a2">🌲</span>
          <span class="isla-icono">${p.icono}</span>
          ${i === 0 ? '<span class="isla-inicio mono">📍 INICIO</span>' : ''}
        </span>
        <span class="isla-tarjeta">
          ${p.estado === 'hecha' ? '<span class="isla-estrella" title="completada">⭐</span>' : ''}
          <span class="isla-cabeza"><span class="isla-num mono">${escapar(p.num)}</span>
            <span class="isla-titulo">${p.titulo}</span></span>
          ${p.desc ? `<span class="isla-desc">${p.desc}</span>` : ''}
          ${p.extra || ''}
          <span class="isla-pie mono">${p.pie || ''}</span>
        </span>
      </a>
    </li>`;
}

// final: { titulo, texto, hecho, href }
function htmlFinal(f, i) {
  return `
    <li class="isla-parada isla-meta ${f.hecho ? 'hecha' : 'pendiente'}" data-i="${i}">
      <a class="isla-enlace" href="${f.href}">
        <span class="isla" aria-hidden="true">
          <span class="isla-roca"></span><span class="isla-pasto"></span>
          <span class="isla-icono"><span class="trofeo">🏆</span>🏰</span>
        </span>
        <span class="isla-tarjeta">
          ${f.hecho ? '<span class="isla-check">✓</span>' : ''}
          <span class="isla-titulo">${f.titulo}</span>
          <span class="isla-desc">${f.texto}</span>
        </span>
      </a>
    </li>`;
}

export function htmlMapa({ paradas, final, clase = '' }) {
  const items = paradas.map(htmlParada).join('') + (final ? htmlFinal(final, paradas.length) : '');
  // Hasta dónde llega el camino "recorrido": la última parada hecha seguida desde el inicio.
  let recorrido = 0;
  while (recorrido < paradas.length && paradas[recorrido].estado === 'hecha') recorrido++;
  return `
    <div class="mapa-islas ${clase}" data-recorrido="${recorrido}">
      <svg class="mapa-camino" aria-hidden="true"><path class="camino-pendiente"/><path class="camino-hecho"/></svg>
      <ol class="mapa-rejilla">${items}</ol>
    </div>`;
}

// La tarjeta "⭐ Tu progreso".
export function htmlProgreso(texto, fraccion) {
  return `
    <div class="tu-progreso">
      <p class="mono"><span>⭐</span> Tu progreso</p>
      <div class="tu-progreso-barra"><span style="width:${Math.round(Math.max(0, Math.min(1, fraccion)) * 100)}%"></span></div>
      <p class="mono tenue">${texto}</p>
    </div>`;
}

// ---------- acomodar las islas y dibujar el camino ----------

function columnasPara(ancho) {
  if (ancho >= 980) return 3;
  if (ancho >= 640) return 2;
  return 1;
}

function acomodar(mapa) {
  const rejilla = mapa.querySelector('.mapa-rejilla');
  const items = [...rejilla.children];
  const cols = columnasPara(mapa.clientWidth);
  rejilla.style.setProperty('--cols', cols);
  items.forEach((li, i) => {
    const fila = Math.floor(i / cols);
    const pos = i % cols;
    const col = fila % 2 === 0 ? pos : cols - 1 - pos; // serpiente
    li.style.gridRow = String(fila + 1);
    li.style.gridColumn = String(col + 1);
    // Un poco de altura distinta para que no parezca una tabla.
    li.style.setProperty('--subir', cols > 1 ? `${[0, 26, 8][(i + fila) % 3]}px` : '0px');
  });
  dibujarCamino(mapa);
}

function dibujarCamino(mapa) {
  const svg = mapa.querySelector('.mapa-camino');
  const caja = mapa.getBoundingClientRect();
  svg.setAttribute('width', caja.width);
  svg.setAttribute('height', caja.height);
  svg.setAttribute('viewBox', `0 0 ${caja.width} ${caja.height}`);
  const puntos = [...mapa.querySelectorAll('.isla')].map((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - caja.left + r.width / 2, y: r.top - caja.top + r.height * 0.62 };
  });
  if (puntos.length < 2) return;
  // Curvas suaves entre isla e isla.
  const tramo = (a, b) => {
    const dx = (b.x - a.x) / 2;
    const dy = (b.y - a.y) / 2;
    return Math.abs(b.y - a.y) > Math.abs(b.x - a.x)
      ? ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`
      : ` C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
  };
  let todo = `M ${puntos[0].x} ${puntos[0].y}`;
  for (let i = 1; i < puntos.length; i++) todo += tramo(puntos[i - 1], puntos[i]);
  const recorrido = Math.min(Number(mapa.dataset.recorrido || 0), puntos.length - 1);
  let hecho = `M ${puntos[0].x} ${puntos[0].y}`;
  for (let i = 1; i <= recorrido; i++) hecho += tramo(puntos[i - 1], puntos[i]);
  svg.querySelector('.camino-pendiente').setAttribute('d', todo);
  svg.querySelector('.camino-hecho').setAttribute('d', recorrido > 0 ? hecho : '');
}

// Se llama después de poner el HTML en la página.
export function activarMapas(raiz) {
  raiz.querySelectorAll('.mapa-islas').forEach((mapa) => {
    acomodar(mapa);
    // Si cambia el ancho (girar el celular, achicar la ventana), se vuelve a acomodar.
    const observar = new ResizeObserver(() => acomodar(mapa));
    observar.observe(mapa);
    // Las letras pueden cargar después y cambiar los tamaños: se redibuja el camino.
    document.fonts?.ready.then(() => dibujarCamino(mapa));
  });
}
