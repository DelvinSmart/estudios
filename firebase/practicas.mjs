// Las prácticas de todas las clases, leídas del disco: qué bloques hay, en qué parte está cada uno,
// y cómo separar las respuestas de las preguntas.
//
// Formato con respuestas (como se escriben):        Formato público (como quedan en GitHub):
//   vf :: enunciado :: V :: explicación               vf :: enunciado
//   elige :: pregunta :: a :: *b :: c :: → porqué      elige :: pregunta :: a :: b :: c
//   escribe :: pregunta :: respuesta modelo           escribe :: pregunta :: respuesta modelo   (igual: se autoevalúa)
//
// La usan: separar-respuestas.mjs, generar-reglas.mjs y las pruebas.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLASES, CURSOS, clasesDelCurso } from '../web/cursos.js';
import { partir } from '../web/lector.js';

export const raiz = fileURLToPath(new URL('..', import.meta.url));
const BLOQUE = /```practica\n([\s\S]*?)```/g;

// El curso de cada clase: { '01': 'programacion', '22': 'seguridad', … }
export function cursoDeCadaClase() {
  const mapa = {};
  for (const curso of Object.keys(CURSOS)) for (const n of clasesDelCurso(curso)) mapa[n] = curso;
  return mapa;
}

// Una línea de práctica, ya partida. Sirve para las dos formas (con o sin respuestas).
export function leerLinea(linea) {
  const c = linea.split(' :: ').map((x) => x.trim());
  const tipo = c[0].toLowerCase();
  if (tipo === 'vf') {
    const conRespuesta = c.length >= 3 && /^[VF]/i.test(c[2]);
    return { tipo, enunciado: c[1], correcta: conRespuesta ? c[2].toUpperCase()[0] : null, explicacion: conRespuesta ? c[3] || '' : null };
  }
  if (tipo === 'elige') {
    let ops = c.slice(2);
    let explicacion = null;
    if (ops.length && ops[ops.length - 1].startsWith('→')) explicacion = ops.pop().replace(/^→\s*/, '');
    const correcta = ops.findIndex((o) => o.startsWith('*'));
    ops = ops.map((o) => o.replace(/^\*/, ''));
    return { tipo, enunciado: c[1], opciones: ops, correcta: correcta >= 0 ? correcta : null, explicacion: correcta >= 0 ? explicacion || '' : null };
  }
  return { tipo: 'escribe', enunciado: c[1], linea };
}

// La misma línea, sin la respuesta.
export function lineaPublica(p) {
  if (p.tipo === 'vf') return `vf :: ${p.enunciado}`;
  if (p.tipo === 'elige') return `elige :: ${p.enunciado} :: ${p.opciones.join(' :: ')}`;
  return p.linea;
}

// Una "firma" de la práctica: sus enunciados. Sirve para reconocerla aunque cambie de lugar.
export const firma = (preguntas) => preguntas.map((p) => `${p.tipo}|${p.enunciado}`).join('\n');

// Todos los bloques de práctica de todas las clases, en el orden en que la página los numera:
// id = "<clase>:<archivo>:<parte>:practica<k>" (igual que web/markdown.js).
export function listarPracticas() {
  const curso = cursoDeCadaClase();
  const lista = [];
  for (const [n, c] of Object.entries(CLASES)) {
    c.docs.forEach((d, doc) => {
      const ruta = `${c.carpeta}/${d.archivo}`;
      const md = readFileSync(`${raiz}${ruta}`, 'utf8');
      partir(md).partes.forEach((p, i) => {
        const parte = `${n}:${d.archivo}:${i + 1}`;
        let k = 0;
        // Un ```practica dentro de un bloque de 4 comillas (````text) es un EJEMPLO de cómo se escribe,
        // no una práctica de verdad: la página no lo convierte, así que aquí tampoco se cuenta.
        const sinEjemplos = p.md.replace(/^(`{4,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '');
        for (const m of sinEjemplos.matchAll(BLOQUE)) {
          k += 1;
          const lineas = m[1].split('\n').map((l) => l.trim()).filter(Boolean);
          lista.push({ id: `${parte}:practica${k}`, ruta, parte, doc, curso: curso[n], texto: m[0], preguntas: lineas.map(leerLinea) });
        }
      });
    });
  }
  return lista;
}

// ¿Se corrige en el servidor? Solo si tiene alguna pregunta de verdadero/falso o de elegir.
export const seCorrige = (practica) => practica.preguntas.some((p) => p.tipo !== 'escribe');

// Las partes (de la pestaña principal) que tienen práctica que se corrige en el servidor, por curso.
// Para esas, las reglas exigen que el servidor la haya aprobado antes de prender el bombillo.
export function partesConPractica() {
  const porCurso = Object.fromEntries(Object.keys(CURSOS).map((c) => [c, new Set()]));
  for (const p of listarPracticas()) if (p.doc === 0 && p.curso && seCorrige(p)) porCurso[p.curso].add(p.parte);
  return Object.fromEntries(Object.entries(porCurso).map(([c, s]) => [c, [...s]]));
}
