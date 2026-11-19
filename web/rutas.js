// Las direcciones (URLs) de las clases, en un solo lugar.
//
// Hay DOS formas de nombrar una clase, y a propósito:
//   - El ID interno (la carpeta): 06, 44, 116…  NUNCA cambia. Con él se guarda el progreso,
//     las reglas y los audios. Si nunca cambia, agregar o mover clases no obliga a migrar nada.
//   - El NÚMERO que ve el alumno: el lugar de la clase dentro de su curso (empieza en 1 por curso).
//     Cambia si reordenas, pero como no se usa para guardar, no pasa nada.
//
// La URL bonita junta el curso y ese número, para que la barra de direcciones diga lo mismo que
// la pantalla:   #/programacion/5   (no el id de la carpeta). Atrás, el id fijo; delante, el número.
// Este es el patrón normal en sitios serios (un id estable + una dirección legible); no es un atajo.

import { CURSOS, CLASES, ETAPAS, cursoDeEtapa, clasesDelCurso } from './cursos.js';

const etapaDe = (id) => ETAPAS.find((e) => e.clases.includes(id));

// A qué curso pertenece una clase (por su id).
export const cursoDeClase = (id) => cursoDeEtapa(etapaDe(id) || {});

// El número que ve el alumno (entero, empieza en 1). 0 si la clase no está en ningún curso.
export const numeroDeClase = (id) => clasesDelCurso(cursoDeClase(id)).indexOf(id) + 1;

// El id de la clase que ocupa el lugar "numero" dentro de un curso. null si no existe.
export function idDesdeCursoNumero(curso, numero) {
  if (!CURSOS[curso]) return null;
  const i = parseInt(numero, 10) - 1;
  const orden = clasesDelCurso(curso);
  return i >= 0 && i < orden.length ? orden[i] : null;
}

// La dirección bonita de una clase: #/curso/numero  (+ /doc/parte si se leen).
// Si por lo que sea no se puede calcular, cae a la forma vieja #/clase/id, para no romper nunca.
export function hashDeClase(id, doc, parte) {
  const n = numeroDeClase(id);
  if (!CLASES[id] || n < 1) return `#/clase/${id}`;
  let h = `#/${cursoDeClase(id)}/${n}`;
  if (doc !== undefined && doc !== '' && parte !== undefined && parte !== '') h += `/${doc}/${parte}`;
  return h;
}

// Convierte una ruta bonita (#/curso/numero/…) en la ruta interna (['clase', id, …]).
// Si no es una ruta de clase bonita, la devuelve igual. Así el router entiende las dos formas.
export function normalizarRuta(partes) {
  if (CURSOS[partes[0]] && /^\d+$/.test(partes[1] || '')) {
    const id = idDesdeCursoNumero(partes[0], partes[1]);
    if (id) return ['clase', id, ...partes.slice(2)];
  }
  return partes;
}
