// PLANTILLA para conectar otro motor de voz. No se usa: es el molde.
//
// Para conectar uno nuevo:
//   1. Copia este archivo con el nombre del motor, por ejemplo motores/mivoz.mjs
//   2. Llena las cinco cosas de abajo.
//   3. En herramientas/audio/motor.json cambia "motor": "piper" por "motor": "mivoz" y "voz" por una de sus voces.
// Nada más cambia: el generador, la página y la automatización de GitHub siguen igual.
// (Si el motor necesita instalar algo en GitHub Actions, agrégalo en .github/workflows/audios.yml.)

export const nombre = 'Mi motor';

// Los nombres de las voces que acepta (los muestra "node herramientas/audio/voz.mjs").
export const voces = ['voz-1', 'voz-2'];

// Deja la voz lista para usar (descargarla, revisar que el programa esté instalado…).
// Si falta algo, lanza un Error con un mensaje claro.
export function preparar(voz) {}

// Convierte el texto en un archivo .wav en la ruta "wav". Tiene que terminar cuando el archivo ya existe.
export function hablar(texto, wav, voz) {
  throw new Error('Este motor todavía no está hecho.');
}

// Lo que identifica a la voz. Si cambia, todos los audios se rehacen con la voz nueva.
export const firma = (voz) => `mivoz:${voz}`;
