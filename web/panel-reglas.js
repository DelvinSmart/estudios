// Panel · las reglas de lo que se puede cambiar desde el panel, sin tocar la pantalla.
// Se usan en el navegador (web/panel.js) y en las pruebas (herramientas/panel-reglas.test.mjs).
//
// Desde el panel SÍ se puede: cambiar el texto de cualquier parte y su título.
// Desde el panel NO se puede (el guardado se frena con un aviso):
//   - Agregar, quitar o juntar partes (títulos "## "). Las reglas de Firebase cuentan las partes de
//     cada curso para dejar emitir el certificado: con otro número, nadie podría terminar el curso
//     hasta regenerar y subir las reglas desde la computadora.
//   - Cambiar, agregar o quitar una práctica (```practica). Sus respuestas viven en un archivo privado
//     que solo existe en la computadora (firebase/funciones/respuestas.json).

import { partir } from './lector.js';

// Igual que partir() en lector.js: una línea que empieza con ``` abre o cierra un bloque de código,
// y los "## " de adentro no cuentan. Aquí se guardan las líneas TAL CUAL, para rearmar el archivo exacto.
export function separar(md) {
  const lineas = md.split('\n');
  const cabeza = [];
  const partes = [];
  let actual = null;
  let enCodigo = false;
  for (const l of lineas) {
    const limpia = l.replace(/\r$/, '');
    if (/^\s*```/.test(limpia)) enCodigo = !enCodigo;
    if (!enCodigo && /^## /.test(limpia)) {
      actual = { linea: l, titulo: limpia.slice(3).trim(), cuerpo: [] };
      partes.push(actual);
      continue;
    }
    (actual ? actual.cuerpo : cabeza).push(l);
  }
  return { cabeza, partes };
}

export function unir({ cabeza, partes }) {
  return [...cabeza, ...partes.flatMap((p) => [p.linea, ...p.cuerpo])].join('\n');
}

// El texto de un pedazo para el cuadro de edición, y de vuelta a líneas.
export const aTexto = (lineas) => lineas.join('\n');
export const aLineas = (texto) => (texto === '' ? [] : texto.replace(/\r\n?/g, '\n').split('\n'));

const PRACTICA = /```practica\n[\s\S]*?```/g;
export const practicasDe = (md) => md.replace(/\r/g, '').match(PRACTICA) || [];

// web/indice.json guarda los títulos del primer documento de cada clase.
export const titulosDe = (md) => partir(md).partes.map((p) => p.titulo);
export const cambiaronTitulos = (original, editado) =>
  JSON.stringify(titulosDe(original)) !== JSON.stringify(titulosDe(editado));

// Devuelve el índice con los títulos nuevos de una clase, en el mismo formato que firebase/generar-reglas.mjs.
export function indiceConTitulos(textoIndice, n, md) {
  const indice = JSON.parse(textoIndice);
  if (!indice.clases?.[n]) throw new Error(`La clase ${n} no está en el índice`);
  const titulos = titulosDe(md);
  indice.clases[n] = { partes: titulos.length, titulos };
  return `${JSON.stringify(indice)}\n`;
}

// Compara el archivo de GitHub con el editado. Devuelve la lista de problemas (vacía = se puede guardar).
export function revisar(original, editado) {
  const problemas = [];
  if (!editado.trim()) return ['La clase quedó vacía.'];

  const a = partir(original);
  const b = partir(editado);
  if (a.partes.length !== b.partes.length) {
    problemas.push(
      `La clase tenía ${a.partes.length} partes y ahora tiene ${b.partes.length}. ` +
      'Desde el panel no se agregan ni se quitan partes: revisa que no escribiste "## " al comienzo de una línea ' +
      '(usa "### " para un subtítulo). Para cambiar las partes, hazlo en la computadora y regenera las reglas.'
    );
    return problemas; // sin el mismo número de partes, comparar parte por parte no tiene sentido
  }

  const pedazos = (r) => [{ titulo: 'la introducción', md: r.intro }, ...r.partes.map((p, i) => ({ titulo: `la parte ${i + 1} (${p.titulo})`, md: p.md }))];
  const pa = pedazos(a);
  const pb = pedazos(b);
  pa.forEach((p, i) => {
    const antes = practicasDe(p.md);
    const ahora = practicasDe(pb[i].md);
    if (antes.length !== ahora.length || antes.some((x, k) => x !== ahora[k])) {
      problemas.push(
        `Cambió una práctica en ${pb[i].titulo}. Las prácticas no se editan desde el panel porque sus respuestas son privadas: ` +
        'déjala exactamente como estaba, o cámbiala en la computadora con separar-respuestas.'
      );
    }
  });
  return problemas;
}
