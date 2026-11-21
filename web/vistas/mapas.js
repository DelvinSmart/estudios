// Pantallas 1, 2 y 3: el mapa grande (cursos y etapas), el de una etapa (sus clases)
// y el de una clase (sus partes). Las tres usan el mapa de islas.

import { htmlLogo, htmlLogos } from '../logos.js';
import { CLASES, ETAPAS, CURSOS, RUTA_INICIAL, cursoDeEtapa, ANTES, ANTES_CLASE, numeroCurso } from '../cursos.js';
import { leerArchivo, partir } from '../lector.js';
import { idParte, estaEntendida } from '../guardado.js';
import { htmlMapa, htmlProgreso, activarMapas } from '../mapa-islas.js';
import { app, ponerMigas, escapar, enLinea, dos } from '../pantalla.js';
import { conteo, ORDEN, primeraPartePendiente, siguienteDeRutaInicial, rutaDoc, etapaDe, cursoDeClase, ordenDe, prendidos, claseActual, estadoClase, ETIQUETA_ESTADO, numeroEnCurso, numeroEtapa, migaEtapa, cortoClase } from '../avance.js';
import { pintarMarkdown } from '../markdown.js';
import { hashDeClase } from '../rutas.js';
import { palabrasDeClase } from '../glosario.js';

// La caja "palabras nuevas en esta clase": se arma sola con las del glosario marcadas con esta clase.
function cajaPalabras(num) {
  const ps = palabrasDeClase(num);
  if (!ps.length) return '';
  return `<details class="palabras-nuevas">
    <summary class="mono">📖 palabras nuevas en esta clase (${ps.length})</summary>
    <dl>${ps.map((e) => `<dt>${escapar(e.termino)}</dt><dd>${escapar(e.definicion)}</dd>`).join('')}</dl>
  </details>`;
}

// La caja "antes de este curso": qué curso ver primero y por qué. Con un motor no se empieza
// desmontándolo: primero las piezas. Si el curso no pide nada, lo dice ("empieza aquí").
function enlaceCurso(id) {
  const c = CURSOS[id];
  return `<a href="#/curso/${id}">${numeroCurso(id)}. ${c.icono} ${escapar(c.titulo)}</a>`;
}
const enLista = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}`);
function htmlAntes(cursoId, claseId) {
  const delCurso = ANTES[cursoId] || [];
  const deClase = (claseId && ANTES_CLASE[claseId]) || [];
  if (!delCurso.length && !deClase.length) {
    return claseId ? '' : '<div class="antes-curso listo"><b>✅ Empieza aquí.</b> No necesitas saber nada antes: este curso parte de cero.</div>';
  }
  const necesarios = delCurso.filter((a) => !a.recomendado);
  const recomendados = delCurso.filter((a) => a.recomendado);
  const fila = (a) => `<li>${enlaceCurso(a.curso)}: ${escapar(a.por)}.</li>`;
  // Dentro de una clase que no es la primera: solo un recordatorio corto de lo necesario.
  const primera = claseId && ordenDe(cursoId)[0] === claseId;
  if (claseId && !primera) {
    const lista = [...necesarios, ...deClase];
    if (!lista.length) return '';
    return `<p class="antes-curso corto">📋 ${deClase.length ? 'Esta clase' : 'Este curso'} usa lo que se enseña en ${enLista(lista.map((a) => enlaceCurso(a.curso)))}. Si todavía no lo sabes, empieza por ahí.</p>`;
  }
  return `<div class="antes-curso">
    ${necesarios.length || deClase.length ? `<b>📋 Antes de ${deClase.length && !necesarios.length ? 'esta clase' : 'este curso'}, necesitas:</b><ul>${[...necesarios, ...deClase].map(fila).join('')}</ul>` : ''}
    ${recomendados.length ? `<b>${necesarios.length ? 'Y te ayuda' : '💡 Este curso enseña desde cero, pero te ayuda'} haber visto:</b><ul>${recomendados.map(fila).join('')}</ul>` : ''}
    ${necesarios.length ? '<p class="tenue">Si ya lo sabes, puedes empezar aquí. Si no, ve primero ahí: aquí se usa sin volver a explicarlo.</p>' : ''}
  </div>`;
}

function htmlRutaDesdeCero() {
  return `<section class="ruta-cero">
    <h2>De tu primera línea a una web de gastos</h2>
    <ol>
      ${RUTA_INICIAL.map(({ clases, titulo }) => `<li><a href="${hashDeClase(clases[0])}">${escapar(titulo)}</a></li>`).join('')}
    </ol>
  </section>`;
}

// ---------- pantalla 1: el mapa grande ----------

// El mapa grande. Sin curso: todos los cursos, uno debajo de otro. Con curso (#/curso/python): solo ese.
export function vistaInicio(soloCurso) {
  if (soloCurso && !CURSOS[soloCurso]) soloCurso = null;
  ponerMigas(soloCurso
    ? [{ texto: 'mapa', href: '#/' }, { texto: `curso · ${CURSOS[soloCurso].titulo.toLowerCase()}`, corto: soloCurso }]
    : [{ texto: 'mapa', href: '#/' }]);
  const total = Object.keys(CLASES).length;
  const hechas = Object.keys(CLASES).filter((n) => estadoClase(n) === 'hecha').length;
  const actual = claseActual();
  const totalBombillos = ORDEN.reduce((s, n) => s + (conteo[n] || 0), 0);
  const prendidosTodos = ORDEN.reduce((s, n) => s + prendidos(n), 0);

  // Un mapa por curso, cada uno con su título "Curso: …".
  const mapas = Object.values(CURSOS).filter((c) => !soloCurso || c.id === soloCurso).map((curso) => {
    let numEtapa = 0;
    const etapas = ETAPAS.filter((e) => cursoDeEtapa(e) === curso.id);
    const clases = ordenDe(curso.id);
    const listas = clases.filter((n) => estadoClase(n) === 'hecha').length;
    const ruta = curso.id === 'programacion' ? '#/certificado' : `#/certificado/${curso.id}`;
    const final = {
      titulo: listas === clases.length ? '¡Completaste el curso!' : 'La meta',
      texto: listas === clases.length ? '🎓 ver mi certificado' : `Al final: tu certificado verificable de ${escapar(curso.corto.toLowerCase())}.`,
      hecho: listas === clases.length, href: ruta,
    };
    // Si el curso tiene una sola etapa, el mapa muestra directo sus clases.
    const paradas = etapas.length === 1 ? paradasDeClases(etapas[0]) : etapas.map((e) => {
      numEtapa += 1;
      const hechasE = e.clases.filter((n) => estadoClase(n) === 'hecha').length;
      const estado = hechasE === e.clases.length ? 'hecha' : e.clases.includes(actual) ? 'actual' : hechasE || e.clases.some((n) => prendidos(n)) ? 'empezada' : 'pendiente';
      return {
        num: dos(numEtapa), titulo: escapar(e.titulo) + htmlLogos(e.logos), desc: escapar(e.desc), href: `#/etapa/${e.id}`, estado, icono: e.icono,
        pie: `<span class="avance">${hechasE}/${e.clases.length} clases</span>${estado === 'actual' ? '<span class="insignia actual">▶ voy aquí</span>' : ''}`,
      };
    });
    const logos = [...new Set(etapas.flatMap((e) => e.logos || []))].slice(0, 4);
    const cabeza = `<h2 class="titulo-mapa-curso"><a href="#/curso/${curso.id}"><span class="emoji">${curso.icono}</span> Curso ${numeroCurso(curso.id)}: ${escapar(curso.titulo)}</a>${htmlLogos(logos, 'medio')}
      <span class="mono tenue">${listas}/${clases.length} clases</span></h2>`;
    return `<section class="curso-mapa" id="curso-${curso.id}">${cabeza}${htmlAntes(curso.id)}${htmlMapa({ paradas, final, clase: `mapa-${curso.id}` })}</section>`;
  }).join('');
  // Las pestañas para saltar de un curso a otro.
  const pestanasCursos = `<nav class="pestanas pestanas-cursos" aria-label="Cursos">
    <a class="pestana ${soloCurso ? '' : 'activa'}" href="#/">Todos</a>
    ${Object.values(CURSOS).map((c) => `<a class="pestana ${soloCurso === c.id ? 'activa' : ''}" href="#/curso/${c.id}">${numeroCurso(c.id)}. ${c.icono} ${escapar(c.titulo)}</a>`).join('')}
  </nav>`;

  // Un solo curso: sin la portada grande, directo a su mapa.
  if (soloCurso) {
    app.innerHTML = `<section class="cabeza"><p class="mono comentario">// curso</p></section>${pestanasCursos}${mapas}`;
    activarMapas(app);
    return;
  }
  const parteActual = actual && conteo[actual] ? primeraPartePendiente(actual, 0, conteo[actual]) : null;
  const destino = parteActual ? hashDeClase(actual, 0, parteActual) : hashDeClase(actual);
  app.innerHTML = `
    <section class="portada cabeza-mapa"><div>
      <p class="mono comentario">// mi carrera de programación</p>
      <h1 class="titulo-grande">Mapa de <span class="acento">estudios</span></h1>
      <p class="bajada">Empieza con un cálculo de combustible. Cambia el precio, ejecuta el código y comprueba el total en tu navegador.</p>
      <div class="acciones">
        ${actual ? `<a class="boton-principal boton-seguir" href="${destino}">${prendidosTodos ? 'Continuar' : 'Escribe tu primera línea de código'}</a>` : ''}
        <button class="boton" type="button" data-ver-cursos>Explorar cursos</button>
      </div>
      ${actual && prendidosTodos ? `<p class="tenue">${escapar(CLASES[actual].titulo)}${parteActual ? ` · parte ${parteActual} de ${conteo[actual]}` : ''}</p>` : ''}
      <div class="contadores mono">
        <span><b>${Object.keys(CURSOS).length}</b> cursos</span>
        <span><b>${total}</b> clases</span>
        <a class="contador-bombillos" href="#/progreso" title="Cada bombillo es una parte de una clase que ya entendiste"><span class="bombillo-chico ${prendidosTodos ? 'prendido' : ''}">💡</span><b>${prendidosTodos}</b>/${totalBombillos} bombillos en todos los cursos</a>
      </div>
      </div>
      ${htmlProgreso(`${hechas} de ${total} clases terminadas`, hechas / total, '#/progreso')}
      ${htmlRutaDesdeCero()}
    </section>
    <div id="cursos-mapa" tabindex="-1">${pestanasCursos}${mapas}</div>
    <p class="aviso-verificar"><a href="#/verificar">Verificar un certificado</a></p>`;
  app.querySelector('[data-ver-cursos]').addEventListener('click', () => {
    const cursos = app.querySelector('#cursos-mapa');
    cursos.focus({ preventScroll: true });
    cursos.scrollIntoView();
  });
  activarMapas(app);
}

// Anterior y siguiente, solo dentro del mismo curso.
function navegarEtapas(etapa) {
  const lista = ETAPAS.filter((e) => cursoDeEtapa(e) === cursoDeEtapa(etapa));
  const antes = lista[lista.indexOf(etapa) - 1];
  const despues = lista[lista.indexOf(etapa) + 1];
  return `<nav class="pasos">
    ${antes ? `<a class="paso" href="#/etapa/${antes.id}">← ${escapar(antes.titulo)}</a>` : '<span></span>'}
    ${despues ? `<a class="paso derecha" href="#/etapa/${despues.id}">${escapar(despues.titulo)} →</a>` : '<span></span>'}
  </nav>`;
}

// Las clases de una etapa, como paradas del mapa de islas.
function paradasDeClases(etapa) {
  return etapa.clases.map((num) => {
    const est = estadoClase(num);
    const total = conteo[num] || 0;
    return {
      num: numeroEnCurso(num), titulo: escapar(CLASES[num].titulo) + htmlLogos(CLASES[num].logos), desc: escapar(CLASES[num].meta), href: `#/clase/${num}`,
      estado: est, icono: CLASES[num].logos ? htmlLogo(CLASES[num].logos[0], 'isla') : (CLASES[num].icono || '📘'),
      pie: `<span class="avance">${prendidos(num)}/${total} partes</span>${est === 'actual' ? '<span class="insignia actual">▶ voy aquí</span>' : ''}`,
    };
  });
}

// ---------- pantalla 2: el mapa de una etapa ----------

export async function vistaEtapa(id) {
  const etapa = ETAPAS.find((e) => e.id === id);
  if (!etapa) return vistaInicio();
  const n = ETAPAS.indexOf(etapa) + 1;
  const miga = migaEtapa(etapa, false);
  ponerMigas([{ texto: 'mapa', href: '#/' }, { ...miga, texto: escapar(miga.texto) }]);
  const etapasCurso = ETAPAS.filter((e) => cursoDeEtapa(e) === cursoDeEtapa(etapa));

  const hechas = etapa.clases.filter((num) => estadoClase(num) === 'hecha').length;
  const siguiente = ETAPAS[n];
  const final = siguiente && cursoDeEtapa(siguiente) === cursoDeEtapa(etapa)
    ? { titulo: hechas === etapa.clases.length ? '¡Etapa completa!' : 'Fin de la etapa', texto: `Sigue: ${escapar(siguiente.titulo)} →`, hecho: hechas === etapa.clases.length, href: `#/etapa/${siguiente.id}` }
    : { titulo: hechas === etapa.clases.length ? '¡Completaste el curso!' : 'La meta', texto: '🎓 el certificado', hecho: hechas === etapa.clases.length, href: cursoDeEtapa(etapa) === 'programacion' ? '#/certificado' : `#/certificado/${cursoDeEtapa(etapa)}` };

  app.innerHTML = `
    <section class="cabeza cabeza-mapa"><div>
      <p class="mono comentario">// etapa ${numeroEtapa(etapa)} de ${etapasCurso.length} · curso: ${escapar(CURSOS[cursoDeEtapa(etapa)].titulo.toLowerCase())}</p>
      <h1 class="titulo-medio"><span class="emoji">${etapa.icono}</span> ${escapar(etapa.titulo)} ${htmlLogos(etapa.logos, 'medio')}</h1>
      <p class="bajada">${escapar(etapa.desc)}</p></div>
      ${htmlProgreso(`${hechas} de ${etapa.clases.length} clases`, hechas / etapa.clases.length)}
    </section>
    ${htmlMapa({ paradas: paradasDeClases(etapa), final, clase: `mapa-${cursoDeEtapa(etapa)}` })}
    ${navegarEtapas(etapa)}`;
  activarMapas(app);
}

// ---------- pantalla 3: el mapa de una clase ----------

export async function vistaClase(num, doc) {
  const c = CLASES[num];
  if (!c) return vistaInicio();
  if (!c.docs[doc]) doc = 0;
  const etapa = etapaDe(num);
  const miga = migaEtapa(etapa);
  ponerMigas([
    { texto: 'mapa', href: '#/' },
    { ...miga, texto: escapar(miga.texto) },
    { texto: `${numeroEnCurso(num)} ${escapar(c.titulo)}`, corto: cortoClase(num) },
  ]);

  const md = await leerArchivo(rutaDoc(num, doc));
  const { titulo, intro, partes } = partir(md);
  // Si la clase tiene prácticas, se recorre parte por parte: sin "leer todo de corrido".
  const conPracticas = tienePracticas(md);
  const listas = partes.filter((_, i) => estaEntendida(idParte(num, doc, i + 1))).length;

  const pestanas = c.docs.length > 1
    ? `<div class="pestanas" role="tablist">${c.docs.map((d, i) =>
      `<a role="tab" class="pestana ${i === doc ? 'activa' : ''}" href="#/clase/${num}/${i}">${escapar(d.titulo)}</a>`).join('')}</div>`
    : '';

  const enCurso = primeraPartePendiente(num, doc, partes.length);
  const paradas = partes.map((p, i) => {
    const hecha = estaEntendida(idParte(num, doc, i + 1));
    return {
      num: dos(i + 1), titulo: enLinea(p.titulo), desc: p.resumen ? escapar(p.resumen) : '',
      href: `#/clase/${num}/${doc}/${i + 1}`,
      estado: hecha ? 'hecha' : i + 1 === enCurso ? 'actual' : 'pendiente',
    };
  });
  const est = estadoClase(num);
  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// clase ${numeroEnCurso(num)} · <span class="insignia ${est}">${ETIQUETA_ESTADO[est]}</span></p>
      <h1 class="titulo-medio">${enLinea(titulo || c.titulo)} ${htmlLogos(c.logos, 'medio')}</h1>
      <p class="bajada">${escapar(c.meta)}</p>
      ${pestanas}
      <div class="fila-progreso mono">
        <div class="barra-progreso"><span style="width:${partes.length ? (listas / partes.length) * 100 : 0}%"></span></div>
        <span>${listas}/${partes.length} partes entendidas</span>
      </div>
      <div class="acciones">
        ${partes.length ? `<a class="boton-principal" href="#/clase/${num}/${doc}/${enCurso}">▶ ${listas ? 'seguir' : 'empezar'}</a>` : ''}
        ${conPracticas ? '' : `<a class="boton" href="#/clase/${num}/${doc}/todo">leer todo de corrido</a>`}
        ${num === '09' ? '<a class="boton" href="#/laboratorio">🧪 laboratorio de CRUD</a>' : ''}
      </div>
    </section>
    ${htmlAntes(cursoDeClase(num), num)}
    ${cajaPalabras(num)}
    <div id="intro"></div>
    <ol class="indice-partes" aria-label="Partes de la clase">
      ${paradas.map((p) => `<li><a href="${p.href}" class="${p.estado}">
        <span class="mono acento">${p.estado === 'hecha' ? '✓' : p.num}</span>
        <span>${p.titulo}<small>${p.estado === 'actual' ? 'Continúa aquí' : p.desc}</small></span>
      </a></li>`).join('')}
    </ol>
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

// ¿El documento tiene algún bloque ```practica?
export const tienePracticas = (md) => /^\s*```practica\b/m.test(md);

// La salida sigue el itinerario inicial cuando la clase forma parte de él.
function navegarClases(num) {
  const orden = ordenDe(cursoDeClase(num));
  const i = orden.indexOf(num);
  const antes = orden[i - 1];
  const despues = siguienteDeRutaInicial(num) || orden[i + 1];
  return `<nav class="pasos">
    ${antes ? `<a class="paso" href="#/clase/${antes}">← ${numeroEnCurso(antes)} ${escapar(CLASES[antes].titulo)}</a>` : '<span></span>'}
    ${despues
      ? `<a class="paso derecha" href="${hashDeClase(despues)}">${escapar(CLASES[despues].titulo)} →</a>`
      : `<a class="paso derecha" href="#/certificado/${cursoDeClase(num)}">Certificado del curso →</a>`}
  </nav>`;
}
