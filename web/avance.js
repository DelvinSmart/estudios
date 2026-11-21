// El avance en este navegador: cuántas partes tiene cada clase, cuántas están prendidas
// y en qué estado está cada clase. Solo datos: no dibuja nada.

import { CLASES, ETAPAS, RUTA_INICIAL, cursoDeEtapa, clasesDelCurso } from './cursos.js';
import { leerArchivo, partir } from './lector.js';
import { idParte, estaEntendida, versionProgreso } from './guardado.js';

// Cuántas partes (bombillos) tiene cada clase: se cuenta al arrancar.
export const conteo = {};
export const ORDEN = ETAPAS.flatMap((e) => e.clases);
const rutaInicial = RUTA_INICIAL.flatMap((paso) => paso.clases);
const ordenEstudio = [...new Set([...rutaInicial, ...ORDEN])];

export function siguienteDeRutaInicial(num) {
  const i = rutaInicial.indexOf(num);
  return i < 0 ? undefined : rutaInicial[i + 1];
}

export function primeraPartePendiente(num, doc, total) {
  for (let i = 1; i <= total; i++) {
    if (!estaEntendida(idParte(num, doc, i))) return i;
  }
  return 1;
}

export function rutaDoc(num, doc = 0) {
  const c = CLASES[num];
  return `${c.carpeta}/${c.docs[doc].archivo}`;
}

export function etapaDe(num) {
  return ETAPAS.find((e) => e.clases.includes(num));
}

// A qué curso pertenece una clase, y las clases y partes de cada curso.
export const cursoDeClase = (num) => cursoDeEtapa(etapaDe(num) || {});
export const ordenDe = (curso) => clasesDelCurso(curso);
// El número que se muestra: el lugar de la clase dentro de su curso (01, 02…),
// no el nombre de su carpeta (que puede ser 44 aunque la clase vaya primera).
export const numeroEnCurso = (num) => String(ordenDe(cursoDeClase(num)).indexOf(num) + 1).padStart(2, '0');
export const totalPartes = (curso) => ordenDe(curso).reduce((s, n) => s + (conteo[n] || 0), 0);

// Los bombillos prendidos de una clase (en su documento principal).
export function prendidos(num) {
  let n = 0;
  for (let i = 1; i <= (conteo[num] || 0); i++) if (estaEntendida(idParte(num, 0, i))) n++;
  return n;
}

// El progreso sale SOLO de los bombillos de este navegador: cada persona ve el suyo.
// "Voy aquí" es la primera clase del recorrido de estudio que todavía no tiene todos sus bombillos prendidos.
// Se recuerda mientras el progreso no cambie: la portada la pregunta una vez por cada clase,
// y recalcularla cada vez recorría todas las clases de nuevo (un bucle dentro de otro bucle).
let actual = { version: -1, num: undefined };
export function claseActual() {
  if (actual.version !== versionProgreso()) {
    actual = { version: versionProgreso(), num: ordenEstudio.find((n) => !conteo[n] || prendidos(n) < conteo[n]) };
  }
  return actual.num;
}

export function estadoClase(num) {
  if (conteo[num] && prendidos(num) === conteo[num]) return 'hecha';
  if (num === claseActual()) return 'actual';
  return prendidos(num) > 0 ? 'empezada' : 'pendiente';
}

export const ETIQUETA_ESTADO = { hecha: '✓ hecha', actual: '▶ voy aquí', empezada: '◐ empezada', pendiente: '○ pendiente' };

// Al arrancar: cuántas partes tiene cada clase. Sale de web/indice.json (un archivo chico, generado
// junto con las reglas). Antes se bajaban TODAS las lecciones (casi 3 MB) solo para contar sus "## ".
// Si el índice no está o le falta una clase, esa clase se cuenta leyendo su archivo, como antes.
export async function contarPartes() {
  let indice = {};
  try { const r = await fetch('web/indice.json'); if (r.ok) indice = (await r.json()).clases || {}; } catch (e) { /* sin índice */ }
  await Promise.all(ORDEN.map(async (num) => {
    if (indice[num]) { conteo[num] = indice[num].partes; return; }
    try { conteo[num] = partir(await leerArchivo(rutaDoc(num))).partes.length; } catch (e) { conteo[num] = 0; }
  }));
}

// ---------- nombres para las migas y la ruta de la barra ----------

// El número de la etapa dentro de su curso (01, 02…), no su lugar en la lista de todas.
export const numeroEtapa = (etapa) => String(ETAPAS.filter((e) => cursoDeEtapa(e) === cursoDeEtapa(etapa)).indexOf(etapa) + 1).padStart(2, '0');
const etapaUnica = (etapa) => ETAPAS.filter((e) => cursoDeEtapa(e) === cursoDeEtapa(etapa)).length === 1;

// La miga de la etapa. En un curso de una sola etapa (JavaScript, Kotlin…) la etapa ES el curso.
export function migaEtapa(etapa, conEnlace = true) {
  if (etapaUnica(etapa)) {
    const curso = cursoDeEtapa(etapa);
    return { texto: `curso · ${etapa.titulo.toLowerCase()}`, href: conEnlace ? `#/curso/${curso}` : undefined, corto: curso };
  }
  return { texto: `${numeroEtapa(etapa)} ${etapa.titulo}`, href: conEnlace ? `#/etapa/${etapa.id}` : undefined, corto: etapa.id };
}

// La clase en la ruta de la barra: "01-mapa-de-los-lenguajes", con su número en el curso
// y sin el número de la carpeta (44-…), que no es el orden en que se ve.
export const cortoClase = (num) => `${numeroEnCurso(num)}-${CLASES[num].carpeta.replace(/^\d+-/, '')}`;

// ---------- el orden para marcar ----------

// La parte que va justo antes en el curso (para marcar en orden), o null si es la primera del curso.
// Solo cuenta el documento principal de cada clase (el que tiene los bombillos).
export function parteAnterior(num, i) {
  if (i > 1) return { num, i: i - 1 };
  const orden = ordenDe(cursoDeClase(num));
  for (let k = orden.indexOf(num) - 1; k >= 0; k--) {
    if (conteo[orden[k]]) return { num: orden[k], i: conteo[orden[k]] };
  }
  return null;
}
