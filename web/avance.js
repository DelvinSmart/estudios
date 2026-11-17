// El avance en este navegador: cuántas partes tiene cada clase, cuántas están prendidas
// y en qué estado está cada clase. Solo datos: no dibuja nada.

import { CLASES, ETAPAS, cursoDeEtapa, clasesDelCurso } from './cursos.js';
import { leerArchivo, partir } from './lector.js';
import { idParte, estaEntendida } from './guardado.js';

// Cuántas partes (bombillos) tiene cada clase: se cuenta al arrancar.
export const conteo = {};
export const ORDEN = ETAPAS.flatMap((e) => e.clases);

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
// "Voy aquí" es la primera clase del mapa que todavía no tiene todos sus bombillos prendidos.
export function claseActual() {
  return ORDEN.find((n) => !conteo[n] || prendidos(n) < conteo[n]);
}

export function estadoClase(num) {
  if (conteo[num] && prendidos(num) === conteo[num]) return 'hecha';
  if (num === claseActual()) return 'actual';
  return prendidos(num) > 0 ? 'empezada' : 'pendiente';
}

export const ETIQUETA_ESTADO = { hecha: '✓ hecha', actual: '▶ voy aquí', empezada: '◐ empezada', pendiente: '○ pendiente' };

// Al arrancar: cuenta las partes de cada clase (leyendo su documento principal).
export async function contarPartes() {
  await Promise.all(ORDEN.map(async (num) => {
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
