// Pantallas 1, 2 y 3: el mapa grande (cursos y etapas), el de una etapa (sus clases)
// y el de una clase (sus partes). Las tres usan el mapa de islas.

import { htmlLogo, htmlLogos } from '../logos.js';
import { CLASES, ETAPAS, CURSOS, cursoDeEtapa } from '../cursos.js';
import { leerArchivo, partir } from '../lector.js';
import { idParte, estaEntendida } from '../guardado.js';
import { htmlMapa, htmlProgreso, activarMapas } from '../mapa-islas.js';
import { app, ponerMigas, escapar, enLinea, dos } from '../pantalla.js';
import { conteo, ORDEN, rutaDoc, etapaDe, cursoDeClase, ordenDe, prendidos, claseActual, estadoClase, ETIQUETA_ESTADO } from '../avance.js';
import { pintarMarkdown } from '../markdown.js';

// ---------- pantalla 1: el mapa grande ----------

export function vistaInicio() {
  ponerMigas([{ texto: 'mapa', href: '#/' }]);
  const total = Object.keys(CLASES).length;
  const hechas = Object.keys(CLASES).filter((n) => estadoClase(n) === 'hecha').length;
  const actual = claseActual();
  const totalBombillos = ORDEN.reduce((s, n) => s + (conteo[n] || 0), 0);
  const prendidosTodos = ORDEN.reduce((s, n) => s + prendidos(n), 0);

  // Un mapa por curso: el de programación (sus etapas) y el de seguridad (sus clases).
  let numEtapa = 0;
  const mapas = Object.values(CURSOS).map((curso) => {
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
    if (etapas.length === 1) numEtapa += 1;
    const cabeza = curso.id === 'programacion' ? '' : `<h2 class="titulo-mapa-curso"><span class="emoji">${etapas[0].icono}</span> Curso aparte: ${escapar(curso.corto)} <span class="mono tenue">· con su propio certificado</span></h2>`;
    return `${cabeza}${htmlMapa({ paradas, final })}`;
  }).join('');

  app.innerHTML = `
    <section class="portada cabeza-mapa"><div>
      <p class="mono comentario">// mi carrera de programación</p>
      <h1 class="titulo-grande">Mapa de <span class="acento">estudios</span></h1>
      <p class="bajada">Primero los fundamentos, después la web, los datos, la arquitectura y mis proyectos.
        Aparte, cada uno con su certificado: Python, seguridad, IA para programadores y agentes de IA.</p>
      <div class="contadores mono">
        <span><b>${ETAPAS.length}</b> etapas</span>
        <span><b>${total}</b> clases</span>
        <span><b>${hechas}</b> terminadas</span>
        <a class="contador-bombillos" href="#/progreso"><span class="bombillo-chico ${prendidosTodos ? 'prendido' : ''}">💡</span><b>${prendidosTodos}</b>/${totalBombillos} bombillos</a>
      </div>
      <div class="acciones">
        ${actual ? `<a class="boton-principal" href="#/clase/${actual}">▶ ${prendidosTodos ? 'seguir donde quedé' : 'empezar'}: clase ${actual}, ${escapar(CLASES[actual].titulo)}</a>` : ''}
        <a class="boton" href="#/progreso">💡 mi progreso</a>
      </div></div>
      ${htmlProgreso(`${hechas} de ${total} clases`, hechas / total)}
    </section>
    ${mapas}`;
  activarMapas(app);
}

function navegarEtapas(n) {
  const antes = ETAPAS[n - 2];
  const despues = ETAPAS[n];
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
      num, titulo: escapar(CLASES[num].titulo) + htmlLogos(CLASES[num].logos), desc: escapar(CLASES[num].meta), href: `#/clase/${num}`,
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
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: `${dos(n)} ${escapar(etapa.titulo)}`, corto: etapa.id }]);

  const hechas = etapa.clases.filter((num) => estadoClase(num) === 'hecha').length;
  const siguiente = ETAPAS[n];
  const final = siguiente && cursoDeEtapa(siguiente) === cursoDeEtapa(etapa)
    ? { titulo: hechas === etapa.clases.length ? '¡Etapa completa!' : 'Fin de la etapa', texto: `Sigue: ${escapar(siguiente.titulo)} →`, hecho: hechas === etapa.clases.length, href: `#/etapa/${siguiente.id}` }
    : { titulo: hechas === etapa.clases.length ? '¡Completaste el curso!' : 'La meta', texto: '🎓 el certificado', hecho: hechas === etapa.clases.length, href: cursoDeEtapa(etapa) === 'programacion' ? '#/certificado' : `#/certificado/${cursoDeEtapa(etapa)}` };

  app.innerHTML = `
    <section class="cabeza cabeza-mapa"><div>
      <p class="mono comentario">// etapa ${dos(n)} de ${ETAPAS.length}</p>
      <h1 class="titulo-medio"><span class="emoji">${etapa.icono}</span> ${escapar(etapa.titulo)} ${htmlLogos(etapa.logos, 'medio')}</h1>
      <p class="bajada">${escapar(etapa.desc)}</p></div>
      ${htmlProgreso(`${hechas} de ${etapa.clases.length} clases`, hechas / etapa.clases.length)}
    </section>
    ${htmlMapa({ paradas: paradasDeClases(etapa), final })}
    ${navegarEtapas(n)}`;
  activarMapas(app);
}

// ---------- pantalla 3: el mapa de una clase ----------

export async function vistaClase(num, doc) {
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

  const enCurso = primeraPendiente(num, doc, partes.length);
  const paradas = partes.map((p, i) => {
    const hecha = estaEntendida(idParte(num, doc, i + 1));
    const marcas = [
      p.tieneEjemplo ? '<span title="tiene ejemplos de la vida real">🌎 ejemplos</span>' : '',
      p.tieneCodigo ? '<span title="tiene código">&lt;/&gt; código</span>' : '',
    ].join('');
    return {
      num: dos(i + 1), titulo: enLinea(p.titulo), desc: p.resumen ? escapar(p.resumen) : '',
      extra: p.sub.length ? `<ul class="isla-subs">${p.sub.map((t) => `<li>${enLinea(t)}</li>`).join('')}</ul>` : '',
      href: `#/clase/${num}/${doc}/${i + 1}`,
      estado: hecha ? 'hecha' : i + 1 === enCurso ? 'actual' : 'pendiente',
      icono: hecha ? '💡' : '<span class="bombillo-apagado">💡</span>',
      pie: `${marcas}${!hecha && i + 1 === enCurso ? '<span class="insignia actual">▶ sigue aquí</span>' : ''}`,
    };
  });
  const siguienteClase = ORDEN[ORDEN.indexOf(num) + 1];
  const final = {
    titulo: listas === partes.length && partes.length ? '¡Clase completa!' : 'Fin de la clase',
    texto: siguienteClase && cursoDeClase(siguienteClase) === cursoDeClase(num) ? `Sigue: clase ${siguienteClase}, ${escapar(CLASES[siguienteClase].titulo)} →` : '🎓 el certificado del curso',
    hecho: listas === partes.length && partes.length > 0,
    href: siguienteClase && cursoDeClase(siguienteClase) === cursoDeClase(num) ? `#/clase/${siguienteClase}` : (cursoDeClase(num) === 'programacion' ? '#/certificado' : `#/certificado/${cursoDeClase(num)}`),
  };

  const est = estadoClase(num);
  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// clase ${num} · <span class="insignia ${est}">${ETIQUETA_ESTADO[est]}</span></p>
      <h1 class="titulo-medio">${enLinea(titulo || c.titulo)} ${htmlLogos(c.logos, 'medio')}</h1>
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
    ${htmlMapa({ paradas, final, clase: 'mapa-partes' })}
    ${navegarClases(num)}`;
  activarMapas(app);

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
