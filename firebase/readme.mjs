// La lista de clases del README.md, generada desde web/cursos.js (la única fuente del orden).
// Antes se escribía a mano y quedó vieja: le faltaban más de 60 clases y el curso de Swift.
// Se regenera con:  node firebase/generar-reglas.mjs   (el mismo comando de las reglas y del índice).
import { CLASES, CURSOS, ETAPAS, cursoDeEtapa } from '../web/cursos.js';

export const INICIO = '<!-- clases:inicio (generado por firebase/generar-reglas.mjs: no editar a mano) -->';
export const FIN = '<!-- clases:fin -->';

const celda = (t) => String(t).replace(/\|/g, '\\|');

export function listaDeClases() {
  const partes = [INICIO, ''];
  for (const curso of Object.values(CURSOS)) {
    const etapas = ETAPAS.filter((e) => cursoDeEtapa(e) === curso.id);
    const total = etapas.reduce((s, e) => s + e.clases.length, 0);
    partes.push(`### ${curso.icono} ${curso.titulo} · ${total} clases · certificado \`${curso.prefijo}-…\``, '');
    let n = 0;
    for (const e of etapas) {
      if (etapas.length > 1) partes.push(`**${e.icono} ${e.titulo}**`, '');
      partes.push('| # | Clase | Qué voy a saber hacer al terminar | Carpeta |', '|---|---|---|---|');
      for (const num of e.clases) {
        const c = CLASES[num];
        n += 1;
        partes.push(`| ${String(n).padStart(2, '0')} | [${celda(c.titulo)}](${c.carpeta}/${c.docs[0].archivo}) | ${celda(c.meta || '')} | \`${num}\` |`);
      }
      partes.push('');
    }
  }
  partes.push(FIN);
  return partes.join('\n');
}

// Devuelve el README con la lista puesta entre las dos marcas.
export function readmeAlDia(texto) {
  const a = texto.indexOf(INICIO);
  const b = texto.indexOf(FIN);
  if (a < 0 || b < 0) throw new Error('README.md no tiene las marcas de la lista de clases');
  return texto.slice(0, a) + listaDeClases() + texto.slice(b + FIN.length);
}
