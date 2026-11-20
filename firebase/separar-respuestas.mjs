// Saca las respuestas de las prácticas de los .md y las guarda en un archivo PRIVADO
// (firebase/funciones/respuestas.json, que NO se sube a GitHub: está en .gitignore).
// Ese archivo viaja solo dentro de la función de Firebase que corrige (corregirPractica).
//
//   node firebase/separar-respuestas.mjs            separa (córrelo cada vez que escribas prácticas nuevas)
//   node firebase/separar-respuestas.mjs --revisar  solo revisa: falla si algún .md todavía tiene respuestas
//                                                   o si a alguna práctica le falta su respuesta guardada
//
// Las prácticas se escriben como siempre (con V/F, el * y la explicación). Este script las deja
// públicas sin respuesta y guarda la respuesta aparte. Si una práctica cambia de lugar, la reconoce
// por sus enunciados y le mantiene la respuesta.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { listarPracticas, lineaPublica, firma, raiz } from './practicas.mjs';

export const ARCHIVO = `${raiz}firebase/funciones/respuestas.json`;

export function separar({ revisar = false } = {}) {
  const viejo = existsSync(ARCHIVO) ? JSON.parse(readFileSync(ARCHIVO, 'utf8')).practicas : {};
  const porFirma = new Map(Object.values(viejo).map((e) => [e.firma, e]));
  const nuevo = {};
  const cambiosMd = new Map(); // ruta → texto nuevo
  const problemas = [];

  for (const p of listarPracticas()) {
    const f = firma(p.preguntas);
    const anterior = viejo[p.id]?.firma === f ? viejo[p.id] : porFirma.get(f);
    const preguntas = p.preguntas.map((q, i) => {
      if (q.tipo === 'escribe') return { tipo: 'escribe' };
      if (q.correcta !== null) return { tipo: q.tipo, correcta: q.correcta, explicacion: q.explicacion, ...(q.tipo === 'elige' ? { opciones: q.opciones.length } : {}) };
      const guardada = anterior?.preguntas[i];
      if (!guardada || guardada.tipo !== q.tipo || guardada.correcta === null || guardada.correcta === undefined) problemas.push(`${p.id}, pregunta ${i + 1}: no tiene respuesta (ni en el .md ni guardada)`);
      return guardada || { tipo: q.tipo, correcta: null };
    });
    nuevo[p.id] = { curso: p.curso, parte: p.parte, firma: f, preguntas };

    // La explicación de un "elige" va en su propio campo:  … :: opción c :: → porqué
    // Si se escribe pegada ("opción c → porqué"), queda DENTRO de la opción: el alumno la ve antes
    // de responder (y a veces dice la respuesta). Pasó en 96 prácticas; esto lo frena.
    p.preguntas.forEach((q, i) => {
      if (q.tipo !== 'elige') return;
      const ultima = q.opciones[q.opciones.length - 1];
      if (ultima.includes(' → ') && !preguntas[i].explicacion) problemas.push(`${p.id}, pregunta ${i + 1}: la explicación quedó pegada a la última opción; sepárala con " :: → "`);
    });

    const tieneRespuestas = p.preguntas.some((q) => q.tipo !== 'escribe' && q.correcta !== null);
    if (tieneRespuestas) {
      if (revisar) problemas.push(`${p.ruta} (${p.id}): todavía tiene respuestas a la vista`);
      const publico = '```practica\n' + p.preguntas.map(lineaPublica).join('\n') + '\n```';
      const texto = cambiosMd.get(p.ruta) ?? readFileSync(`${raiz}${p.ruta}`, 'utf8');
      cambiosMd.set(p.ruta, texto.replace(p.texto, publico));
    }
  }

  if (!revisar) {
    for (const [ruta, texto] of cambiosMd) writeFileSync(`${raiz}${ruta}`, texto);
    writeFileSync(ARCHIVO, JSON.stringify({ aviso: 'PRIVADO: no subir a GitHub. Lo genera firebase/separar-respuestas.mjs.', practicas: nuevo }, null, 1));
  }
  return { practicas: Object.keys(nuevo).length, archivosCambiados: cambiosMd.size, problemas };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const revisar = process.argv.includes('--revisar');
  const r = separar({ revisar });
  console.log(`${r.practicas} prácticas · ${revisar ? 'revisión' : `${r.archivosCambiados} archivos .md sin respuestas ahora`}`);
  for (const x of r.problemas.slice(0, 30)) console.log('  ✗', x);
  if (r.problemas.length) { console.log(`✗ ${r.problemas.length} problemas`); process.exit(1); }
  console.log('✓ todo en orden: ninguna respuesta a la vista y todas guardadas');
}
