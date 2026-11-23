// El motor de dibujos de las clases: un bloque ```dibujo se convierte en un SVG con los colores del sitio.
// Se escribe con piezas simples, una por línea, y funciona igual en tema claro, oscuro y en el celular.
//
//   titulo Cómo viaja un cambio
//   lienzo 420 200
//   caja 20 20 160 56 azul | Primera línea | Segunda línea
//   llena 20 90 40 40 verde | 1              (caja con fondo de color)
//   flecha 180 48 240 48 tenue | git add
//   punteada 180 48 240 48 tenue | etiqueta  (flecha punteada)
//   linea 20 150 400 150 tenue
//   texto 210 180 amarillo | Un texto centrado
//   circulo 60 60 14 verde | A
//
// Los textos se ponen con textContent: nada de lo que se escribe aquí se interpreta como HTML.

const COLORES = ['verde', 'azul', 'amarillo', 'rojo', 'morado', 'tenue'];
const NUMEROS = { caja: 4, llena: 4, flecha: 4, punteada: 4, linea: 4, texto: 2, circulo: 3 };
const SVG = 'http://www.w3.org/2000/svg';

export function leerDibujo(fuente) {
  const dibujo = { titulo: '', ancho: 420, alto: 240, piezas: [] };
  for (const cruda of fuente.split('\n')) {
    const linea = cruda.trim();
    if (!linea) continue;
    const [cabeza, ...textos] = linea.split('|').map((t) => t.trim());
    const [tipo, ...datos] = cabeza.split(/\s+/);
    if (tipo === 'titulo') { dibujo.titulo = linea.slice(7).trim(); continue; }
    if (tipo === 'lienzo') { dibujo.ancho = Number(datos[0]); dibujo.alto = Number(datos[1]); continue; }
    const cuantos = NUMEROS[tipo];
    if (!cuantos) throw new Error(`Dibujo: pieza desconocida "${tipo}"`);
    const numeros = datos.slice(0, cuantos).map(Number);
    if (numeros.length !== cuantos || numeros.some(Number.isNaN)) throw new Error(`Dibujo: números inválidos en "${linea}"`);
    const color = datos[cuantos] || 'tenue';
    if (!COLORES.includes(color)) throw new Error(`Dibujo: color desconocido "${color}"`);
    dibujo.piezas.push({ tipo, numeros, color, textos });
  }
  if (!dibujo.titulo) throw new Error('Dibujo: falta el título');
  return dibujo;
}

function crear(nombre, atributos = {}, padre = null) {
  const el = document.createElementNS(SVG, nombre);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (padre) padre.appendChild(el);
  return el;
}

function escribir(padre, x, yCentro, lineas, clase) {
  const alto = 17;
  const inicio = yCentro - ((lineas.length - 1) * alto) / 2;
  lineas.forEach((t, i) => {
    const el = crear('text', { x, y: inicio + i * alto, class: i === 0 ? clase : `${clase} d-segunda` }, padre);
    el.textContent = t;
  });
}

function pintarPieza(svg, { tipo, numeros, color, textos }) {
  const g = crear('g', { class: `d-${tipo} d-${color}` }, svg);
  if (tipo === 'caja' || tipo === 'llena') {
    const [x, y, w, h] = numeros;
    crear('rect', { x, y, width: w, height: h, rx: 8 }, g);
    escribir(g, x + w / 2, y + h / 2, textos, 'd-letra');
  } else if (tipo === 'circulo') {
    const [x, y, r] = numeros;
    crear('circle', { cx: x, cy: y, r }, g);
    escribir(g, x, y, textos, 'd-letra');
  } else if (tipo === 'texto') {
    escribir(g, numeros[0], numeros[1], textos, 'd-letra');
  } else {
    const [x1, y1, x2, y2] = numeros;
    crear('line', { x1, y1, x2, y2 }, g);
    if (tipo !== 'linea') {
      const angulo = Math.atan2(y2 - y1, x2 - x1);
      const punta = (giro) => `${x2 - 9 * Math.cos(angulo + giro)},${y2 - 9 * Math.sin(angulo + giro)}`;
      crear('polygon', { points: `${x2},${y2} ${punta(0.45)} ${punta(-0.45)}` }, g);
    }
    if (textos.length) {
      const vertical = Math.abs(y2 - y1) > Math.abs(x2 - x1);
      const tx = (x1 + x2) / 2 + (vertical ? 8 : 0);
      const ty = (y1 + y2) / 2 + (vertical ? 0 : -9);
      const el = crear('text', { x: tx, y: ty, class: vertical ? 'd-letra d-etiqueta d-izquierda' : 'd-letra d-etiqueta' }, g);
      el.textContent = textos[0];
    }
  }
}

export function crearDibujo(fuente) {
  const figura = document.createElement('figure');
  figura.className = 'dibujo';
  try {
    const d = leerDibujo(fuente);
    const svg = crear('svg', { viewBox: `0 0 ${d.ancho} ${d.alto}`, role: 'img', 'aria-label': d.titulo });
    d.piezas.forEach((p) => pintarPieza(svg, p));
    const pie = document.createElement('figcaption');
    pie.textContent = d.titulo;
    figura.append(svg, pie);
  } catch (e) {
    figura.textContent = 'No se pudo mostrar este dibujo.';
  }
  return figura;
}
