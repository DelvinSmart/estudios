// Las reglas de los límites de correos, sin Firebase: reciben datos y devuelven una decisión.
// Así se pueden probar solas (limites.test.js) y index.js solo se ocupa de leer y guardar.

export const ESPERA_MS = 60 * 1000; // uno por minuto para la misma cuenta o correo
export const MAXIMO_DIA = 5;        // hasta 5 por día para la misma cuenta o correo

// Tope de TODO el sitio por día, separado por tipo (entre los dos, menos que los ~500 que permite Gmail).
export const TOPE_SITIO = { verificar: 250, contrasena: 150 };

// datos: lo guardado de esa persona ({ dia, cuenta, ultimo }) o null.
// Devuelve { ok: false } o { ok: true, guardar: {…} } con lo nuevo que hay que guardar.
export function decidirPersona(datos, ahora, dia) {
  const d = datos || {};
  const deHoy = d.dia === dia ? d.cuenta || 0 : 0;
  if (d.ultimo && ahora - d.ultimo < ESPERA_MS) return { ok: false };
  if (deHoy >= MAXIMO_DIA) return { ok: false };
  return { ok: true, guardar: { dia, cuenta: deHoy + 1, ultimo: ahora } };
}

// cuenta: cuántos correos de ese tipo salieron hoy en todo el sitio.
export function decidirSitio(tipo, cuenta) {
  const tope = TOPE_SITIO[tipo];
  if (tope === undefined) return false;
  return (cuenta || 0) < tope;
}

// Gmail entrega en la misma bandeja "ana.perez+1@gmail.com", "anaperez@gmail.com" y "ANA.PEREZ@googlemail.com".
// Para los límites hay que contarlas como UNA: si no, alguien inventa variantes del correo de otra persona,
// le manda decenas de correos y además gasta el tope diario del sitio.
export function gmailCanonico(correo) {
  const [local = '', dominio = ''] = String(correo).trim().toLowerCase().split('@');
  if (dominio !== 'gmail.com' && dominio !== 'googlemail.com') return `${local}@${dominio}`;
  return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
}

// Tope por conexión (dirección IP) para pedir correos de verificación: varias cuentas desde el mismo
// lugar es normal (un aula), cientos no. Sin espera entre uno y otro, solo un máximo por día.
export const MAXIMO_CONEXION_DIA = 20;
