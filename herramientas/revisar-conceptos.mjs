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
  ['try/except', /\btry\s*:/, /\btry\s*:|try\/except|`try`|\btry y except\b/],
  ['raise', /\braise\b/, /\braise\b/],
  ['class', /^\s*class\s+\w+/m, /\bclass\s+\w+/],
  ['lambda', /\blambda\b/, /\blambda\b/],
  ['enumerate', /\benumerate\(/, /enumerate/],
  ['zip', /\bzip\(/, /\bzip\b/],
  ['sorted/sort con key', /\bkey\s*=/, /key\s*=/],
  ['*args/**kwargs', /\(\s*[^)]*\*\*?\w+/, /\*args|\*\*kwargs|\*\w+/],
  ['import', /^\s*(import|from)\s+\w+/m, /^\s*(import|from)\s+\w+|`import`|`from/m],
  ['while', /\bwhile\b/, /\bwhile\b/],
  ['sum/min/max/len', /\b(sum|min|max)\(/, /\b(sum|min|max)\(/],
  ['set()', /\bset\(|\{[^:}\n]+,[^:}\n]+\}/, /\bset\(|conjunto/],
  ['json', /\bjson\.(loads|dumps|load|dump)\b/, /json\./],
  ['round', /\bround\(/, /\bround\(/],
  ['split/join', /\.(split|join)\(/, /\.(split|join)\(/],
  ['async/await', /\bawait\b/, /\bawait\b/],
  ['dataclass', /@dataclass/, /dataclass/],
];

const KT = [
  ['plantilla "$x" / "${}"', /"[^"\n]*\$[{\w]/, /\$\{|"\$\w|plantilla/],
  ['val/var', /\b(val|var)\s+\w+/, /\bval\b|\bvar\b/],
  ['when', /\bwhen\s*[({]/, /\bwhen\b/],
  ['rangos .. / until / downTo / step', /\.\.(?!\.)|\buntil\b|\bdownTo\b|\bstep\b/, /\.\.|\buntil\b|\bdownTo\b|rango/],
  ['for (x in …)', /\bfor\s*\(\s*\w+\s+in\b|\bfor\s*\(\s*\(/, /\bfor\s*\(/],
  ['while', /\bwhile\s*\(/, /\bwhile\b/],
  ['listOf/mutableListOf', /\b(mutableListOf|listOf)\b/, /listOf|mutableListOf/],
  ['mapOf/mutableMapOf/to', /\b(mutableMapOf|mapOf)\b/, /mapOf|mutableMapOf/],
  ['setOf', /\b(mutableSetOf|setOf)\b/, /setOf/],
  ['lambda { it }', /\bit\b/, /\bit\b/],
  ['.map / .filter', /\.(map|filter)\s*[{(]/, /\.(map|filter)\b|`(map|filter)`/],
  ['.sumOf / .count / .maxOf…', /\.(sumOf|count|maxOf|minOf|maxByOrNull|minByOrNull|average)\s*[{(]/, /sumOf|\.count|maxOf|minOf|maxByOrNull|minByOrNull|average/],
  ['.sortedBy / sorted', /\.(sorted|sortedBy|sortedByDescending|sortedDescending)\b/, /sorted/],
  ['.forEach', /\.forEach\s*[{(]/, /forEach/],
  ['.joinToString', /\.joinToString\(/, /joinToString/],
  ['.any / .all / .none', /\.(any|all|none)\s*[{(]/, /\.(any|all|none)\b/],
  ['.first / .find / .firstOrNull', /\.(first|firstOrNull|find|last|lastOrNull)\s*[{(]/, /\.(first|firstOrNull|find|last)/],
  ['.groupBy', /\.groupBy\s*[{(]/, /groupBy/],
  ['?. (llamada segura)', /\?\.\w/, /\?\./],
  ['?: (Elvis)', /\?:/, /\?:|Elvis/i],
  ['!! (forzar)', /!!/, /!!/],
  ['let / apply / also / run', /\.(let|apply|also|run)\s*\{/, /\.(let|apply|also|run)\b/],
  ['data class', /\bdata\s+class\b/, /data class/],
  ['class', /^\s*(open\s+|abstract\s+)?class\s+\w+/m, /\bclass\b/],
  ['enum class', /\benum\s+class\b/, /enum class/],
  ['sealed', /\bsealed\b/, /\bsealed\b/],
  ['object', /^\s*object\s+\w+/m, /\bobject\b/],
  ['interface', /\binterface\s+\w+/, /\binterface\b/],
  ['función de extensión', /\bfun\s+\w+\.\w+\(/, /extensi[oó]n/i],
  ['is / as', /\b(is|as\??)\s+[A-Z]\w*/, /\bis\b|\bas\b/],
  ['try/catch', /\btry\s*\{/, /\btry\b/],
  ['throw / require', /\bthrow\b|\brequire\s*\(/, /\bthrow\b|\brequire\b/],
  ['suspend / corrutinas', /\bsuspend\b|\blaunch\b|\basync\s*\{|\bdelay\(/, /suspend|corrutin|launch/],
  ['Pair / desestructurar', /\bPair\b|\bval\s*\(\s*\w+\s*,/, /Pair|desestructur|val\s*\(/],
  ['String.format / %.2f', /\.format\(|%\.\d+f/, /format|%\.\d/],
  ['.toInt / toDouble / toString', /\.to(Int|Double|String|Long)(OrNull)?\(/, /\.to(Int|Double|String)/],
  ['if como expresión', /=\s*if\s*\(/, /=\s*if\s*\(|if como expresi|if devuelve/i],
];
const SW = [
  ['interpolación \\( )', /\\\(/, /\\\(/],
  ['let/var', /\b(let|var)\s+\w+/, /\blet\b|\bvar\b/],
  ['func', /\bfunc\s+\w+/, /\bfunc\b/],
  ['etiquetas de argumento', /func\s+\w+\(\s*_\s|\w+\s+\w+\s*:\s*\w+[,)]/, /etiqueta|\b_\s/],
  ['switch', /\bswitch\b/, /\bswitch\b/],
  ['rangos ..< / ...', /\.\.<|\d\s*\.\.\.\s*\d/, /\.\.<|\.\.\.|rango/],
  ['for-in', /\bfor\s+\w+\s+in\b|\bfor\s*\(\s*\w+\s*,/, /\bfor\b.*\bin\b/],
  ['while', /\bwhile\b/, /\bwhile\b/],
  ['if let / guard let', /\b(if|guard)\s+let\b/, /if let|guard let/],
  ['guard', /\bguard\b/, /\bguard\b/],
  ['opcional ? / ??', /\?\?|\w\?\.\w/, /\?\?|opcional/i],
  ['forzar !', /\w!(\.|\s|$|\))/m, /forzar|!\s*\(|desenvolver|unwrap/i],
  ['closure $0', /\$0|\$1/, /\$0/],
  ['closure { x in }', /\{\s*\(?\w+(,\s*\w+)*\)?\s+in\b/, /\bin\b.*closure|closure/],
  ['.map / .filter / .reduce', /\.(map|filter|reduce|compactMap)\s*[{(]/, /\.(map|filter|reduce|compactMap)\b/],
  ['.sorted / .sort', /\.(sorted|sort)\s*[({]/, /sorted|\.sort\b/],
  ['.contains / .first / .allSatisfy', /\.(contains|first|last|allSatisfy|min|max)\s*[({]/, /contains|\.first|allSatisfy|\.min|\.max/],
  ['.count / .isEmpty', /\.(count|isEmpty)\b/, /\.count|isEmpty/],
  ['diccionario [k: v]', /\[\s*"\w+"\s*:|\[String\s*:/, /\[String\s*:|diccionario/i],
  ['struct', /\bstruct\s+\w+/, /\bstruct\b/],
  ['class', /\bclass\s+\w+/, /\bclass\b/],
  ['enum / case', /\benum\s+\w+|\bcase\s+\.\w+/, /\benum\b/],
  ['protocol', /\bprotocol\s+\w+/, /\bprotocol\b/],
  ['extension', /\bextension\s+\w+/, /\bextension\b/],
  ['mutating', /\bmutating\b/, /\bmutating\b/],
  ['propiedad calculada', /var\s+\w+\s*:\s*\w+\s*\{/, /calculad|computed/i],
  ['init', /\binit\s*\(/, /\binit\b/],
  ['throws / try / do-catch', /\bthrows\b|\btry\b|\bdo\s*\{/, /throws|\btry\b|do-catch|do \{/],
  ['async / await', /\bawait\b|\basync\b/, /\bawait\b|\basync\b/],
  ['String(format:)', /String\(format:/, /String\(format/],
  ['Int(…) / Double(…)', /\b(Int|Double)\(\s*\w/, /\b(Int|Double)\(/],
  ['tupla', /\(\s*\w+\s*:\s*\w+\s*,\s*\w+\s*:/, /tupla/i],
  ['inout', /\binout\b/, /\binout\b/],
  ['defer', /\bdefer\b/, /\bdefer\b/],
];
const LENG = { js: JS, ts: JS, python: PY, kotlin: KT, swift: SW };

function textoDe(id) {
  const c = CLASES[id].carpeta;
  return readdirSync(`${raiz}/${c}`).filter((f) => f.endsWith('.md')).sort().map((f) => ({ f, t: readFileSync(`${raiz}/${c}/${f}`, 'utf8') }));
}
// El texto que ENSEÑA: todo menos los ejercicios y las prácticas.
// El texto que EXPLICA: sin ejercicios ni prácticas y, en modo estricto, también sin los bloques de
// código. Una pieza que solo aparece dentro de un ejemplo de código no está explicada: tiene que
// nombrarse en una frase, una tabla o una caja (por ejemplo "`.some()` da true si alguno cumple").
let estricto = false;
const sinBloques = (t) => {
  const sinEjercicios = t.replace(/```(ejercicio|practica)[\s\S]*?```/g, '');
  return estricto ? sinEjercicios.replace(/```[\s\S]*?```/g, '') : sinEjercicios;
};

// Lo que cada curso permite saber: sus cursos de ANTES (y los de ANTES de esos).
function previos(curso, vistos = new Set()) {
  for (const a of ANTES[curso] || []) if (!vistos.has(a.curso)) { vistos.add(a.curso); previos(a.curso, vistos); }
  return vistos;
}

export function revisarConceptos({ explicado = false } = {}) {
estricto = explicado;
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
const { revisados, problemas } = revisarConceptos({ explicado: process.argv.includes('--explicado') });
console.log(`${revisados} ejercicios revisados (JavaScript, TypeScript, Python, Kotlin y Swift) · ${problemas.length} usan algo que no se mostró antes`);
const porConcepto = {};
for (const p of problemas) for (const n of p.faltan) porConcepto[n] = (porConcepto[n] || 0) + 1;
console.log('Por concepto:', Object.entries(porConcepto).sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n}: ${c}`).join(' · '));
const porCurso = {};
for (const p of problemas) porCurso[p.curso] = (porCurso[p.curso] || 0) + 1;
console.log('Por curso:', JSON.stringify(porCurso));
if (detalle) for (const p of problemas) console.log(`${p.curso} · ${p.id} · ${p.f} · "${p.titulo}" → ${p.faltan.join(', ')}`);
}
