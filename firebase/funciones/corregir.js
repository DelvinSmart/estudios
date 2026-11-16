// Corregir una práctica con las respuestas privadas. Sin Firebase: recibe datos y devuelve el resultado,
// para poder probarlo solo (corregir.test.js). index.js se ocupa de leer, guardar y limitar.
//
// respuestas que manda el navegador: { "0": "V", "1": 2, "3": "F" }  (índice de la pregunta → respuesta)
//   - verdadero o falso: "V" o "F"
//   - elegir: el número de la opción, contando desde 0, en el orden en que está escrita en la clase
//   - escribir: no se manda (se autoevalúa en el navegador)

export const ESPERA_FALLO_MS = 15 * 1000; // después de fallar, 15 s antes de volver a intentar (con cuenta)
export const MAXIMO_ANONIMO_DIA = 400;    // intentos por día sin cuenta, por conexión
export const MAXIMO_CUENTA_DIA = 600;     // intentos por día con cuenta

export function corregir(entrada, respuestas) {
  if (!entrada) return { error: 'no-existe' };
  const r = respuestas && typeof respuestas === 'object' ? respuestas : {};
  const resultados = entrada.preguntas.map((p, i) => {
    if (p.tipo === 'escribe') return null; // no se corrige aquí
    const dada = r[i];
    if (p.tipo === 'vf') return dada === p.correcta;
    return Number.isInteger(dada) && dada === p.correcta;
  });
  const aprobada = resultados.every((x) => x !== false);
  return {
    aprobada,
    resultados,
    // Las explicaciones (que muchas veces dicen la respuesta) solo se entregan al aprobar.
    explicaciones: aprobada ? entrada.preguntas.map((p) => (p.tipo === 'escribe' ? null : p.explicacion || '')) : null,
  };
}

// ¿Quedó aprobada toda la parte? Sí, si todas sus prácticas que se corrigen ya están aprobadas.
export function parteCompleta(todas, parte, aprobadas) {
  const suyas = Object.entries(todas)
    .filter(([, e]) => e.parte === parte && e.preguntas.some((p) => p.tipo !== 'escribe'))
    .map(([id]) => id);
  return suyas.length > 0 && suyas.every((id) => aprobadas[id]);
}

// ¿Puede intentar ahora? fallos: { [id]: milisegundos del último fallo }.
export function puedeIntentar(fallos, id, ahora) {
  const ultimo = fallos?.[id];
  if (ultimo && ahora - ultimo < ESPERA_FALLO_MS) return { ok: false, segundos: Math.ceil((ESPERA_FALLO_MS - (ahora - ultimo)) / 1000) };
  return { ok: true };
}

// Un contador por día: { dia, cuenta } → ¿se puede uno más?
export function cabeHoy(datos, dia, maximo) {
  const cuenta = datos?.dia === dia ? datos.cuenta || 0 : 0;
  return { ok: cuenta < maximo, guardar: { dia, cuenta: cuenta + 1 } };
}
