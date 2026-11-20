// Revisa que cada ejercicio use solo piezas que ya se MOSTRARON antes: en una clase anterior del
// mismo curso, en los cursos que pide antes (ANTES en web/cursos.js) o más arriba en la misma clase.
// Es la regla del motor: no se arma un motor sin antes conocer las piezas.
//
//   node herramientas/revisar-conceptos.mjs            → resumen
//   node herramientas/revisar-conceptos.mjs --detalle  → cada ejercicio con lo que le falta
//
// Si marca un ejercicio: explica la pieza antes (una caja "🧩 Piezas nuevas" justo antes del
// ejercicio, o en la clase donde se enseña ese tema). Es una revisión por patrones: detecta las
// piezas de la lista de abajo; "mostrada" quiere decir que aparece en el texto de la clase.
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLASES, CURSOS, ANTES, ANTES_CLASE, clasesDelCurso } from '../web/cursos.js';

const raiz = fileURLToPath(new URL('..', import.meta.url));

// [nombre, ¿lo usa la solución?, ¿se mostró en el texto?]
const JS = [
  ['plantilla `${}`', /`[^`]*\$\{/, /\$\{/],
  ['función flecha =>', /=>/, /=>/],
  ['for...of', /for\s*\(\s*(const|let)\s+[\w{}\[\], ]+\s+of\b/, /for\s*\([^)]*\bof\b|for\.\.\.of/],
  ['for clásico', /for\s*\(\s*let\s+\w+\s*=/, /for\s*\(\s*let\s+\w+\s*=/],
  ['while', /\bwhile\s*\(/, /\bwhile\b/],
  ['.map', /\.map\(/, /\.map\b|`map`/],
  ['.filter', /\.filter\(/, /\.filter\b|`filter`/],
  ['.reduce', /\.reduce\(/, /\.reduce\b|`reduce`/],
  ['.find', /\.find(Index)?\(/, /\.find|`find`/],
  ['.some/.every', /\.(some|every)\(/, /\.(some|every)\b|`(some|every)`/],
  ['.sort', /\.sort\(/, /\.sort\b|`sort`/],
  ['.includes', /\.includes\(/, /\.includes\b|`includes`/],
  ['Set', /new Set\b/, /\bSet\b/],
  ['Map', /new Map\b/, /new Map\b|\bun Map\b|`Map`/],
  ['Object.keys/values/entries', /Object\.(keys|values|entries|fromEntries)\(/, /Object\.(keys|values|entries|fromEntries)/],
  ['desestructurar { }', /(const|let)\s*\{[^}=]+\}\s*=|function\s*\w*\s*\(\s*\{|\(\s*\{[^}]*\}\s*\)\s*=>/, /desestructur|(const|let)\s*\{[^}=]+\}\s*=|\(\s*\{[^}]*\}\s*\)/i],
  ['spread ...', /\.\.\.[\w\[{(]/, /\.\.\.[\w\[{(]|spread/],
  ['?. (encadenamiento opcional)', /\?\.[\w\[(]/, /\?\.[\w\[(]/],
  ['?? (valor por defecto)', /\?\?/, /\?\?/],
  ['async/await', /\bawait\b/, /\bawait\b/],
  ['Promise', /new Promise\b|Promise\.(all|race|resolve|reject|allSettled)/, /Promise|promesa/i],
  ['try/catch', /\btry\s*\{/, /\btry\s*\{|try\/catch/],
  ['throw', /\bthrow\b/, /\bthrow\b/],
  ['class', /^\s*class\s+\w+/m, /\bclass\s+\w+/],
  ['expresión regular', /(^|[=(,:\s])\/(?![\/*])[^\/\n]+\/[gimsuy]*(\.(test|exec)|[,)])/m, /expresi[oó]n regular|regex|\/\^/i],
  ['Date', /new Date\b|Date\.\w+/, /new Date|Date\./],
  ['JSON', /JSON\.(parse|stringify)/, /JSON\.(parse|stringify)/],
  ['.toFixed', /\.toFixed\(/, /toFixed/],
  ['Math', /Math\.\w+/, /Math\./],
  ['typeof', /\btypeof\b/, /\btypeof\b/],
  ['switch', /\bswitch\s*\(/, /\bswitch\b/],
  ['Array.from', /Array\.from\(/, /Array\.from/],
  ['ternario ? :', /[=(,]\s*[\w.!()[\]'"<>= &|]+\s\?\s[^:\n]+\s:\s/, /\s\?\s[^:\n]+\s:\s|ternari/],
  ['.padStart/.padEnd', /\.pad(Start|End)\(/, /pad(Start|End)/],
  ['.split/.join', /\.(split|join)\(/, /\.(split|join)\b/],
  ['.slice', /\.slice\(/, /\.slice\b/],
  ['.push', /\.push\(/, /\.push\b/],
  ['.trim', /\.trim\(/, /\.trim\b/],
  ['toLowerCase/UpperCase', /\.to(Lower|Upper)Case\(/, /to(Lower|Upper)Case/],
  ['Number()/String()/Boolean()', /\b(Number|String|Boolean)\(/, /\b(Number|String|Boolean)\(/],
  ['isNaN/Number.isFinite', /isNaN\(|Number\.is\w+\(/, /isNaN|Number\.is/],
];
const PY = [
  ['f-string', /\bf["']/, /\bf["']|f-string/],
  ['comprensión de listas', /\[[^\]\n]+\bfor\b[^\]\n]+\bin\b[^\]\n]*\]/, /\[[^\]\n]+\bfor\b[^\]\n]+\bin\b|comprensi[oó]n/i],
  ['diccionario { : }', /\{\s*["'\w]+\s*:/, /\{\s*["'\w]+\s*:|diccionario/],
  ['.get de diccionario', /\.get\(/, /\.get\(/],
  ['.items()', /\.items\(\)/, /\.items\(\)/],
  ['with open', /\bwith\s+open\b/, /with\s+open/],
  ['try/except', /\btry\s*:/, /\btry\s*:|try\/except/],
  ['raise', /\braise\b/, /\braise\b/],
  ['class', /^\s*class\s+\w+/m, /\bclass\s+\w+/],
  ['lambda', /\blambda\b/, /\blambda\b/],
  ['enumerate', /\benumerate\(/, /enumerate/],
  ['zip', /\bzip\(/, /\bzip\b/],
  ['sorted/sort con key', /\bkey\s*=/, /key\s*=/],
  ['*args/**kwargs', /\(\s*[^)]*\*\*?\w+/, /\*args|\*\*kwargs|\*\w+/],
  ['import', /^\s*(import|from)\s+\w+/m, /^\s*(import|from)\s+\w+/m],
  ['while', /\bwhile\b/, /\bwhile\b/],
  ['sum/min/max/len', /\b(sum|min|max)\(/, /\b(sum|min|max)\(/],
  ['set()', /\bset\(|\{[^:}\n]+,[^:}\n]+\}/, /\bset\(|conjunto/],
  ['json', /\bjson\.(loads|dumps|load|dump)\b/, /json\./],
  ['round', /\bround\(/, /\bround\(/],
  ['split/join', /\.(split|join)\(/, /\.(split|join)\(/],
  ['async/await', /\bawait\b/, /\bawait\b/],
  ['dataclass', /@dataclass/, /dataclass/],
];

const LENG = { js: JS, ts: JS, python: PY };

function textoDe(id) {
  const c = CLASES[id].carpeta;
  return readdirSync(`${raiz}/${c}`).filter((f) => f.endsWith('.md')).sort().map((f) => ({ f, t: readFileSync(`${raiz}/${c}/${f}`, 'utf8') }));
}
// El texto que ENSEÑA: todo menos los ejercicios y las prácticas.
const sinBloques = (t) => t.replace(/```(ejercicio|practica)[\s\S]*?```/g, '');

// Lo que cada curso permite saber: sus cursos de ANTES (y los de ANTES de esos).
function previos(curso, vistos = new Set()) {
  for (const a of ANTES[curso] || []) if (!vistos.has(a.curso)) { vistos.add(a.curso); previos(a.curso, vistos); }
  return vistos;
}

export function revisarConceptos() {
const problemas = [];
let revisados = 0;
for (const curso of Object.keys(CURSOS)) {
  const ids = clasesDelCurso(curso);
  // Base: todo lo de los cursos previos.
  let base = [...previos(curso)].flatMap((k) => clasesDelCurso(k)).flatMap((id) => textoDe(id).map((x) => sinBloques(x.t))).join('\n');
  for (const id of ids) {
    const extra = (ANTES_CLASE[id] || []).flatMap((a) => clasesDelCurso(a.curso)).flatMap((x) => textoDe(x).map((y) => sinBloques(y.t))).join('\n');
    for (const { f, t } of textoDe(id)) {
      for (const m of t.matchAll(/```ejercicio\n([\s\S]*?)```/g)) {
        const bloque = m[1];
        const lenguaje = (bloque.match(/^lenguaje:\s*(\w+)/m) || [])[1];
        const conceptos = LENG[lenguaje];
        if (!conceptos) continue;
        revisados++;
        const titulo = (bloque.match(/^titulo:\s*(.+)$/m) || [])[1];
        const pide = (bloque.match(/^pide:\s*(.+)$/m) || [])[1] || '';
        const solucion = (bloque.split(/^--- solución\s*$/m)[1] || '');
        const inicio = ((bloque.split(/^--- código\s*$/m)[1] || '').split(/^--- (pruebas|solución)\s*$/m)[0]) || '';
        const antesEnClase = sinBloques(t.slice(0, m.index)) + '\n' + pide;
        const sabido = base + '\n' + extra + '\n' + antesEnClase;
        const faltan = conceptos.filter(([, usa, ensena]) => usa.test(solucion) && !usa.test(inicio) && !ensena.test(sabido)).map(([n]) => n);
        if (faltan.length) problemas.push({ curso, id, f, titulo, lenguaje, faltan });
      }
    }
    // Lo de esta clase pasa a ser sabido para las siguientes.
    base += '\n' + textoDe(id).map((x) => sinBloques(x.t)).join('\n');
  }
}

return { revisados, problemas };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
const detalle = process.argv.includes('--detalle');
const { revisados, problemas } = revisarConceptos();
console.log(`${revisados} ejercicios revisados (JavaScript, TypeScript y Python) · ${problemas.length} usan algo que no se mostró antes`);
const porConcepto = {};
for (const p of problemas) for (const n of p.faltan) porConcepto[n] = (porConcepto[n] || 0) + 1;
console.log('Por concepto:', Object.entries(porConcepto).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n}: ${c}`).join(' · '));
const porCurso = {};
for (const p of problemas) porCurso[p.curso] = (porCurso[p.curso] || 0) + 1;
console.log('Por curso:', JSON.stringify(porCurso));
if (detalle) for (const p of problemas) console.log(`${p.curso} · ${p.id} · ${p.f} · "${p.titulo}" → ${p.faltan.join(', ')}`);
}
