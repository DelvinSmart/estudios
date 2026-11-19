// Los ejercicios de SWIFT. Swift no corre en el navegador: el código viaja a Compiler Explorer (godbolt.org, gratis),
// que lo compila con el mismo Swift que trae Xcode, lo corre y devuelve lo que imprimió.
// Las pruebas se revisan POR LA SALIDA, como en Kotlin: cada prueba imprime una línea con una marca.
//
// En un ejercicio de Swift:
//   --- código     funciones, tipos e imports (Swift corre el archivo de arriba abajo: no hace falta main)
//   --- pruebas    llamadas a prueba("nombre") { igual(obtenido, esperado) }   (sin try: igual() no lanza)
// El código de inicio NO usa fatalError() (tumbaría todas las pruebas): devuelve un valor de relleno
// (return 0, return "") para que cada prueba falle por separado.
//
// Tres cosas propias de Swift (encontradas probando Compiler Explorer, 2026-11-19):
// 1. La salida sin búfer (setvbuf): si el programa se cae, no se pierde lo que ya imprimió.
// 2. Primero se anotan los nombres de todas las pruebas y después se corren: si se cae en la tercera,
//    las que faltaban se muestran como "no llegó a correr", con el motivo.
// 3. Compiler Explorer corta el programa a los 20 segundos (y lo avisa con timedOut).
//
// Este archivo no toca la página: arma el programa, lo manda y lee la respuesta. La herramienta que revisa
// todos los ejercicios desde la terminal usa las mismas funciones, con el swift de la Mac.

export const SWIFT_VERSION = '6.4.2';
const SERVIDOR = 'https://godbolt.org/api/compiler/swift642/compile';
export const ESPERA_SWIFT_MS = 40000;
const MARCA = '@@prueba@@';

// Lo que va ANTES del código del alumno (2 líneas: hay que descontarlas para decir "línea N").
const ANTES = `import Foundation
setvbuf(stdout, nil, _IONBF, 0) // sin búfer: si el programa se cae, lo impreso no se pierde`;
export const LINEAS_ANTES = ANTES.split('\n').length;

// Las ayudas, escritas en Swift. Van después del código del alumno y antes de sus pruebas.
const AYUDAS = `

// ---- ayudas del mapa (no las cambies) ----
nonisolated(unsafe) var __pruebas: [(String, () -> Void)] = []
nonisolated(unsafe) var __fallo: String? = nil
func __texto(_ x: Any) -> String {
    let m = Mirror(reflecting: x)
    if m.displayStyle == .optional { return m.children.first.map { __texto($0.value) } ?? "nil" }
    if let s = x as? String { return "\\"" + s + "\\"" }
    return String(describing: x)
}
func igual<T: Equatable>(_ obtenido: T, _ esperado: T) {
    if __fallo == nil && obtenido != esperado { __fallo = "se esperaba " + __texto(esperado) + " y salió " + __texto(obtenido) }
}
func ok(_ condicion: Bool, _ mensaje: String = "no se cumple") {
    if __fallo == nil && !condicion { __fallo = mensaje }
}
func prueba(_ nombre: String, _ fn: @escaping () -> Void) { __pruebas.append((nombre, fn)) }
`;

const DESPUES = `
// ---- correr las pruebas: primero la lista (por si el programa se cae), después cada una ----
for (nombre, _) in __pruebas { print("${MARCA}LISTA${MARCA}" + nombre) }
for (nombre, fn) in __pruebas {
    __fallo = nil
    fn()
    if let f = __fallo { print("${MARCA}MAL${MARCA}" + nombre + "${MARCA}" + f) } else { print("${MARCA}OK${MARCA}" + nombre) }
}
`;

/** Arma el programa completo y dice dónde empiezan y terminan las líneas del alumno. */
export function armarPrograma(codigo, pruebas) {
  const texto = `${ANTES}\n${codigo}\n${AYUDAS}\n${pruebas}\n${DESPUES}`;
  const lineasCodigo = codigo.split('\n').length;
  return { texto, lineasCodigo };
}

// Los errores más comunes del compilador, explicados en español (también se muestra el original, el que sale en internet).
const EN_ESPANOL = [
  ['cannot find', 'ese nombre no existe (¿está mal escrito o falta crearlo?)'],
  ['cannot convert value of type', 'pusiste un valor de un tipo donde va otro'],
  ['must be unwrapped', 'puede ser nil: ábrelo con if let, guard let o ?? antes de usarlo'],
  ["is a 'let' constant", 'es let: no se puede cambiar (si tiene que cambiar, usa var)'],
  ['immutable value', 'es let (o un parámetro): no se puede cambiar; si tiene que cambiar, usa var'],
  ['must be exhaustive', 'al switch le falta un caso (o un default)'],
  ['missing return', 'la función tiene que devolver algo en todos los caminos'],
  ['missing argument label', 'falta la etiqueta del argumento: mira cómo se declaró la función'],
  ['extraneous argument label', 'esa etiqueta sobra: la función se declaró con _'],
  ['incorrect argument label', 'la etiqueta del argumento no es esa: mira cómo se declaró la función'],
  ['missing argument for parameter', 'le falta un dato a la función'],
  ["is not marked with 'try'", "esa función puede fallar (throws): llámala con try"],
  ['does not support concurrency', 'una función async solo se puede llamar con await, desde otra async o desde un Task'],
  ['invalid redeclaration', 'hay dos cosas con el mismo nombre'],
  ['expected', 'falta algo en la forma de escribirlo (una llave, un paréntesis o una coma)'],
  ['does not conform to protocol', 'al tipo le falta algo que el protocolo pide'],
];
const enEspanol = (mensaje) => EN_ESPANOL.find(([en]) => mensaje.includes(en))?.[1];

// Las caídas más comunes mientras corre (Fatal error: …), en español.
const CAIDAS = [
  ['Index out of range', 'pediste una posición que la lista no tiene'],
  ['Unexpectedly found nil', 'usaste ! en algo que era nil'],
  ['Division by zero', 'una división entre cero'],
  ['overflow', 'el número se pasó de lo que entra en un Int'],
];
function explicarCaida(stderr) {
  const linea = stderr.find((l) => /Fatal error/.test(l)) || stderr.find((l) => l.trim()) || '';
  const mensaje = linea.replace(/^.*Fatal error:\s*/, '').trim();
  const espanol = CAIDAS.find(([en]) => linea.includes(en))?.[1];
  return espanol ? `${espanol} (${mensaje})` : mensaje || 'el programa se cortó';
}

/**
 * Lee lo que pasó y lo deja con la misma forma que los otros lenguajes: { error, logs, resultados }.
 * Recibe una forma sencilla, que sale igual de Compiler Explorer o del swift de la Mac:
 *   { compilo, errores: ['<source>:5:3: error: …'], salida: ['línea', …], errSalida: [...], seCorto }
 */
export function leerRespuesta(r, lineasCodigo) {
  if (!r.compilo) {
    const errores = r.errores.map((l) => l.match(/^[^:]*:(\d+):\d+: error: (.*)$/)).filter(Boolean);
    if (!errores.length) return { error: `Swift no pudo compilar:\n${r.errores.slice(0, 4).join('\n')}`, logs: [], resultados: [] };
    const lista = errores.slice(0, 6).map(([, n, mensaje]) => {
      const linea = Number(n) - LINEAS_ANTES;
      const donde = linea >= 1 && linea <= lineasCodigo ? `línea ${linea}` : 'en las pruebas';
      const espanol = enEspanol(mensaje);
      return `· ${donde}: ${espanol ? `${espanol}.\n    (${mensaje})` : mensaje}`;
    });
    return { error: `Swift encontró ${errores.length === 1 ? '1 error' : `${errores.length} errores`}:\n${lista.join('\n')}`, logs: [], resultados: [] };
  }

  const anotadas = [];
  const resultados = [];
  const logs = [];
  for (const linea of r.salida) {
    if (linea.startsWith(MARCA)) {
      const [, estado, nombre, mensaje] = linea.split(MARCA);
      if (estado === 'LISTA') anotadas.push(nombre);
      else resultados.push(estado === 'OK' ? { nombre, paso: true } : { nombre, paso: false, mensaje: mensaje || '' });
    } else if (linea !== '') {
      logs.push(linea);
    }
  }

  // Las que no llegaron a correr: el programa se cayó (o se cortó) antes.
  const motivo = r.seCorto
    ? 'Compiler Explorer cortó el programa a los 20 segundos: ¿hay un ciclo que nunca termina?'
    : explicarCaida(r.errSalida);
  const faltan = anotadas.slice(resultados.length);
  if (faltan.length) {
    resultados.push({ nombre: faltan[0], paso: false, mensaje: `el programa se cayó aquí: ${motivo}` });
    for (const nombre of faltan.slice(1)) resultados.push({ nombre, paso: false, mensaje: 'no llegó a correr: el programa se cayó antes' });
  }
  // Si se cayó antes de anotar las pruebas (en el código del alumno, fuera de las pruebas), se dice aparte.
  const error = !anotadas.length && (r.seCorto || r.errSalida.some((l) => l.trim()))
    ? `Tu programa se cortó fuera de las pruebas: ${motivo}`
    : null;
  return { error, logs, resultados };
}

/** De la respuesta de Compiler Explorer a la forma sencilla. */
export function desdeCompilerExplorer(d) {
  const lineas = (xs) => (xs || []).map((l) => l.text);
  const b = d.buildResult || {};
  const compilo = d.didExecute === true || (b.code === 0 && d.code !== -1);
  return { compilo, errores: lineas(b.stderr), salida: lineas(d.stdout), errSalida: lineas(d.stderr), seCorto: Boolean(d.timedOut) };
}

/** Manda el programa a Compiler Explorer y devuelve { error, logs, resultados }. */
export async function correrSwift(codigo, pruebas, { fetch: pedir = globalThis.fetch } = {}) {
  const { texto, lineasCodigo } = armarPrograma(codigo, pruebas);
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_SWIFT_MS);
  try {
    const r = await pedir(SERVIDOR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: texto,
        lang: 'swift',
        options: { userArguments: '', executeParameters: { args: [], stdin: '' }, compilerOptions: { executorRequest: true }, filters: { execute: true } },
      }),
      signal: control.signal,
    });
    if (!r.ok) return { error: `Compiler Explorer respondió con un error (${r.status}). Prueba otra vez en un rato.`, logs: [], resultados: [] };
    return leerRespuesta(desdeCompilerExplorer(await r.json()), lineasCodigo);
  } catch (e) {
    const mensaje = e.name === 'AbortError'
      ? `Compiler Explorer tardó más de ${ESPERA_SWIFT_MS / 1000} segundos. Prueba otra vez en un rato.`
      : 'No se pudo llegar a Compiler Explorer: ¿hay internet?';
    return { error: mensaje, logs: [], resultados: [] };
  } finally {
    clearTimeout(reloj);
  }
}
