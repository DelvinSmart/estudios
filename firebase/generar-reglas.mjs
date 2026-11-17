// Genera firebase/firestore.rules a partir de reglas.plantilla y la lista real de partes de cada curso.
// Córrelo cada vez que agregues o quites partes (## títulos) de una clase, o un curso:
//   node firebase/generar-reglas.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CURSOS } from '../web/cursos.js';
import { listarPartes } from './partes.mjs';
import { partesConPractica } from './practicas.mjs';

export const ESPERA_SEGUNDOS = 60;
const aqui = new URL('.', import.meta.url);

// Arma una cadena de "curso == 'a' ? x : (curso == 'b' ? y : otro)".
function segunCurso(valores, otro) {
  return Object.entries(valores).reduceRight((resto, [curso, v]) => `(curso == '${curso}' ? ${v} : ${resto})`, otro);
}

export function construirReglas(espera = ESPERA_SEGUNDOS) {
  const porCurso = listarPartes();
  const mapa = (pares) => '{\n        ' + pares.map(([a, b]) => `'${a}': '${b}'`).join(',\n        ') + '\n      }';
  // [primera parte de una clase, última parte de la clase anterior], sin la primera del curso.
  const inicios = (ids) => ids.map((id, i) => [id, ids[i - 1]]).filter(([id], i) => i > 0 && id.endsWith(':1'));
  const lista = (ids) => '[\n        ' + ids.map((i) => `'${i}'`).join(',\n        ') + '\n      ]';
  const funciones = [
    `function cursos() { return [${Object.keys(CURSOS).map((c) => `'${c}'`).join(', ')}]; }`,
    `    function partes(curso) {\n      return ${segunCurso(Object.fromEntries(Object.entries(porCurso).map(([c, ids]) => [c, lista(ids)])), '[]')};\n    }`,
    `    function total(curso) { return ${segunCurso(Object.fromEntries(Object.entries(porCurso).map(([c, ids]) => [c, ids.length])), '-1')}; }`,
    `    function conPractica(curso) {\n      return ${segunCurso(Object.fromEntries(Object.entries(partesConPractica()).map(([c, ids]) => [c, lista(ids)])), '[]')};\n    }`,
    // El orden. Dentro de una clase, la parte anterior se calcula (la 5 va después de la 4).
    // Solo hace falta una tabla chica: dónde empieza cada clase y cuál es la última parte de la clase anterior.
    // (Una tabla con TODAS las partes pasaba el límite de 1.000 expresiones por regla de Firestore.)
    `    function primera(curso) { return ${segunCurso(Object.fromEntries(Object.entries(porCurso).map(([c, ids]) => [c, `'${ids[0]}'`])), "''")}; }`,
    `    function inicioDeClase(curso) {\n      return ${segunCurso(Object.fromEntries(Object.entries(porCurso).map(([c, ids]) => [c, mapa(inicios(ids))])), '{}')};\n    }`,
    `    function prefijo(curso) { return ${segunCurso(Object.fromEntries(Object.entries(CURSOS).map(([c, d]) => [c, `'${d.prefijo}'`])), "'??'")}; }`,
  ].join('\n');
  const texto = readFileSync(new URL('reglas.plantilla', aqui), 'utf8')
    .replace('__FUNCIONES_CURSOS__', funciones)
    .replaceAll('__ESPERA__', String(espera));
  return { texto, porCurso };
}

// Solo escribe el archivo cuando lo corres directo (no cuando lo importan las pruebas).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { texto, porCurso } = construirReglas();
  writeFileSync(new URL('firestore.rules', aqui), texto);
  for (const [c, ids] of Object.entries(porCurso)) console.log(`${c}: ${ids.length} partes`);
  console.log(`firestore.rules listo · ${ESPERA_SEGUNDOS} s entre bombillos`);
}
