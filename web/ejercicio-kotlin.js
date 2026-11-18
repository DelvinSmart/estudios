// Los ejercicios de KOTLIN. Kotlin no corre en el navegador: el código viaja al Kotlin Playground de JetBrains
// (gratis, el mismo que usa kotlinlang.org), que lo compila y lo corre, y devuelve lo que imprimió.
// Las pruebas se revisan POR LA SALIDA: cada prueba imprime una línea con una marca, y aquí se leen esas líneas.
//
// En un ejercicio de Kotlin:
//   --- código     funciones, clases e imports (sin fun main: la pone el motor)
//   --- pruebas    llamadas a prueba("nombre") { igual(obtenido, esperado) } (van dentro de fun main)
// El código de inicio usa TODO() donde el alumno tiene que escribir: compila, pero la prueba falla.
//
// Este archivo no toca la página: arma el programa, lo manda y lee la respuesta. Así también lo usa
// la herramienta que revisa todos los ejercicios desde la terminal.

export const KOTLIN_VERSION = '2.4.21';
const SERVIDOR = `https://api.kotlinlang.org/api/${KOTLIN_VERSION}/compiler/run`;
export const ESPERA_KOTLIN_MS = 25000;
const MARCA = '@@prueba@@';

// Las ayudas, escritas en Kotlin. Van DESPUÉS del código del alumno (sus imports quedan arriba, donde Kotlin los pide).
const AYUDAS = `

// ---- ayudas del mapa (no las cambies) ----
private class FalloDePrueba(mensaje: String) : Exception(mensaje)
private fun textoParaLaPrueba(x: Any?): String = if (x is String) "\\"" + x + "\\"" else x.toString()
fun igual(obtenido: Any?, esperado: Any?) {
    if (obtenido != esperado) throw FalloDePrueba("se esperaba " + textoParaLaPrueba(esperado) + " y salió " + textoParaLaPrueba(obtenido))
}
fun ok(condicion: Boolean, mensaje: String = "no se cumple") { if (!condicion) throw FalloDePrueba(mensaje) }
fun prueba(nombre: String, fn: () -> Unit) {
    try {
        fn()
        println("${MARCA}OK${MARCA}" + nombre)
    } catch (e: Throwable) {
        val mensaje = if (e is FalloDePrueba) e.message else e::class.simpleName + ": " + e.message
        println("${MARCA}MAL${MARCA}" + nombre + "${MARCA}" + mensaje)
    }
}
`;

/** Arma el programa completo y cuenta cuántas líneas son del alumno (para decir "línea N" o "en las pruebas"). */
export function armarPrograma(codigo, pruebas) {
  const texto = `${codigo}\n${AYUDAS}\nfun main() {\n${pruebas}\n}\n`;
  return { texto, lineasCodigo: codigo.split('\n').length };
}

// Los errores más comunes del compilador, explicados en español (también se muestra el original, el que sale en internet).
const EN_ESPANOL = [
  ['Unresolved reference', 'ese nombre no existe (¿está mal escrito o falta crearlo?)'],
  ['type mismatch', 'pusiste un valor de un tipo donde va otro'],
  ['Argument type mismatch', 'le pasaste a la función algo de otro tipo'],
  ['Only safe (?.) or non-null asserted (!!.) calls are allowed', 'puede ser null: usa ?. o revísalo con un if antes de usarlo'],
  ['cannot be reassigned', 'es val: no se puede cambiar (si tiene que cambiar, usa var)'],
  ["'when' expression must be exhaustive", 'al when le falta un caso (o un else)'],
  ['Missing return', 'la función tiene que devolver algo en todos los caminos'],
  ["A 'return' expression required", 'la función tiene que devolver algo en todos los caminos'],
  ['Null cannot be a value of a non-null type', 'ese tipo no acepta null: si puede ser null, ponle ? (por ejemplo String?)'],
  ['Expecting', 'falta algo en la forma de escribirlo (una llave, un paréntesis o una coma)'],
  ['Conflicting overloads', 'hay dos funciones iguales: ¿escribiste fun main? No hace falta: la pone el mapa'],
  ['Suspend function', 'una función suspend solo se puede llamar desde otra suspend o dentro de una corrutina (runBlocking, launch)'],
];
const enEspanol = (mensaje) => EN_ESPANOL.find(([en]) => mensaje.includes(en))?.[1];

const EXCEPCIONES = {
  NotImplementedError: 'todavía falta tu código: cambia el TODO() por tu solución',
  NullPointerException: 'algo era null y se usó como si no lo fuera',
  NumberFormatException: 'ese texto no es un número',
  IndexOutOfBoundsException: 'pediste una posición que la lista no tiene',
  ArithmeticException: 'una cuenta imposible (¿dividir por cero?)',
};
function explicarFallo(mensaje) {
  for (const [nombre, explicacion] of Object.entries(EXCEPCIONES)) {
    if (mensaje.startsWith(nombre)) return `${explicacion} (${mensaje})`;
  }
  return mensaje;
}

/** Lee la respuesta del servidor y la deja con la misma forma que los otros lenguajes: { error, logs, resultados }. */
export function leerRespuesta(respuesta, lineasCodigo) {
  const errores = Object.values(respuesta.errors || {}).flat().filter((e) => e.severity === 'ERROR');
  if (errores.length) {
    const lista = errores.slice(0, 6).map((e) => {
      const linea = e.interval?.start?.line ?? 0;
      const donde = linea < lineasCodigo ? `línea ${linea + 1}` : 'en las pruebas';
      const espanol = enEspanol(e.message);
      return `· ${donde}: ${espanol ? `${espanol}.\n    (${e.message})` : e.message}`;
    });
    return { error: `Kotlin encontró ${errores.length === 1 ? '1 error' : `${errores.length} errores`}:\n${lista.join('\n')}`, logs: [], resultados: [] };
  }
  const texto = respuesta.text || '';
  const salida = (texto.match(/<outStream>([\s\S]*?)<\/outStream>/) || [])[1] || '';
  const errores2 = (texto.match(/<errStream>([\s\S]*?)<\/errStream>/) || [])[1] || '';
  const resultados = [];
  const logs = [];
  for (const linea of salida.split('\n')) {
    if (linea.startsWith(MARCA)) {
      const [, estado, nombre, mensaje] = linea.split(MARCA);
      resultados.push(estado === 'OK' ? { nombre, paso: true } : { nombre, paso: false, mensaje: explicarFallo(mensaje || '') });
    } else if (linea !== '') {
      logs.push(linea);
    }
  }
  for (const linea of errores2.split('\n')) if (linea) logs.push(`✗ ${linea}`);
  let error = null;
  if (respuesta.exception) {
    const ex = respuesta.exception;
    const nombre = (ex.fullName || '').split('.').pop();
    error = `Tu programa se cortó fuera de las pruebas: ${explicarFallo(`${nombre}: ${ex.message ?? ''}`)}`;
  }
  return { error, logs, resultados };
}

/** Manda el programa al Kotlin Playground y devuelve { error, logs, resultados }. */
export async function correrKotlin(codigo, pruebas, { fetch: pedir = globalThis.fetch } = {}) {
  const { texto, lineasCodigo } = armarPrograma(codigo, pruebas);
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ESPERA_KOTLIN_MS);
  try {
    const r = await pedir(SERVIDOR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ args: '', confType: 'java', files: [{ name: 'File.kt', text: texto, publicId: '' }] }),
      signal: control.signal,
    });
    if (!r.ok) return { error: `El Kotlin Playground respondió con un error (${r.status}). Prueba otra vez en un rato.`, logs: [], resultados: [] };
    return leerRespuesta(await r.json(), lineasCodigo);
  } catch (e) {
    const mensaje = e.name === 'AbortError'
      ? `El Kotlin Playground tardó más de ${ESPERA_KOTLIN_MS / 1000} segundos: ¿hay un ciclo que nunca termina?`
      : 'No se pudo llegar al Kotlin Playground: ¿hay internet?';
    return { error: mensaje, logs: [], resultados: [] };
  } finally {
    clearTimeout(reloj);
  }
}
