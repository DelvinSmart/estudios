// Lee los archivos .md y los parte en pedazos para el mapa.
// No sabe nada de la pantalla: solo recibe texto y devuelve datos.

const memoria = new Map();

// Descarga un archivo una sola vez; las veces siguientes lo da de memoria.
export function leerArchivo(ruta) {
  if (!memoria.has(ruta)) {
    const promesa = fetch(ruta).then((r) => {
      if (!r.ok) throw new Error(`No encontré ${ruta} (error ${r.status})`);
      return r.text();
    });
    promesa.catch(() => memoria.delete(ruta)); // si falló, se puede volver a intentar
    memoria.set(ruta, promesa);
  }
  return memoria.get(ruta);
}

// Quita el formato Markdown para mostrar texto simple (resúmenes y búsqueda).
export function textoPlano(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Primer párrafo normal de una parte (sin títulos, citas, tablas ni código).
function primerParrafo(lineas) {
  let enCodigo = false;
  const parrafo = [];
  for (const l of lineas) {
    if (/^\s*```/.test(l)) { enCodigo = !enCodigo; continue; }
    if (enCodigo) continue;
    const t = l.trim();
    const esNormal = t && !/^(#|>|\||<|-{3,}|\* |- |\d+\. )/.test(t);
    if (esNormal) parrafo.push(t);
    else if (parrafo.length) break;
  }
  const texto = textoPlano(parrafo.join(' '));
  return texto.length > 170 ? texto.slice(0, 167).trimEnd() + '…' : texto;
}

// Parte un .md por sus títulos "## ". Lo que está antes del primero es la introducción.
// Los "## " que están dentro de un bloque de código no cuentan.
export function partir(md) {
  const lineas = md.replace(/\r/g, '').split('\n');
  let titulo = '';
  const intro = [];
  const partes = [];
  let actual = null;
  let enCodigo = false;

  for (const l of lineas) {
    if (/^\s*```/.test(l)) enCodigo = !enCodigo;
    if (!enCodigo && !titulo && !actual && /^# /.test(l)) { titulo = l.slice(2).trim(); continue; }
    if (!enCodigo && /^## /.test(l)) {
      actual = { titulo: l.slice(3).trim(), lineas: [], sub: [] };
      partes.push(actual);
      continue;
    }
    if (!enCodigo && actual && /^### /.test(l)) actual.sub.push(l.slice(4).trim());
    (actual ? actual.lineas : intro).push(l);
  }

  return {
    titulo,
    intro: intro.join('\n').trim(),
    partes: partes.map((p) => {
      const md = p.lineas.join('\n');
      return {
        titulo: p.titulo,
        sub: p.sub,
        md,
        resumen: primerParrafo(p.lineas),
        tieneCodigo: /```/.test(md),
        tieneEjemplo: md.includes('🌎'),
        tienePreguntas: /\*\*Preguntas?\*\*|<details>|\?\s*$/m.test(md),
      };
    }),
  };
}

// Lee PROGRESO.md: qué clases están hechas y en cuál voy.
export function leerProgreso(md) {
  const estado = {};
  for (const l of md.split('\n')) {
    const m = l.match(/^- \[( |x)\] (\d\d)/i);
    if (!m) continue;
    if (m[1].toLowerCase() === 'x') estado[m[2]] = 'hecha';
    else if (/voy aquí/i.test(l)) estado[m[2]] = 'actual';
  }
  return estado;
}
