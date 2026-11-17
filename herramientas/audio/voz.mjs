// El control del motor de voz, en una línea. Todo queda guardado en motor.json.
//
//   node herramientas/audio/voz.mjs                        qué motor y qué voz se usan, y las voces que hay
//   node herramientas/audio/voz.mjs es_AR-daniela-high     cambia la voz (al subir, GitHub rehace todos los audios con ella)
//   node herramientas/audio/voz.mjs --probar es_AR-daniela-high   graba una muestra corta para escucharla antes
//   node herramientas/audio/voz.mjs --probar-todas         una muestra de cada voz, para compararlas
//   node herramientas/audio/voz.mjs --apagar               apaga los audios (no se generan y la página no los ofrece)
//   node herramientas/audio/voz.mjs --encender             los vuelve a encender
//
// Cambiar de MOTOR (otro programa de voz): "motor" en motor.json; ver motores/plantilla.mjs.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CLASES } from '../../web/cursos.js';
import { partir } from '../../web/lector.js';
import { textoParaVoz } from './generar-audios.mjs';

const ARCHIVO = fileURLToPath(new URL('./motor.json', import.meta.url));
const RAIZ = fileURLToPath(new URL('../../', import.meta.url));
const MUESTRAS = process.env.MUESTRAS || path.join(RAIZ, '..', 'herramientas-audio', 'muestras');

const leer = () => JSON.parse(readFileSync(ARCHIVO, 'utf8'));
const guardar = (cambios) => writeFileSync(ARCHIVO, JSON.stringify({ ...leer(), ...cambios }, null, 2) + '\n');
const config = leer();
const motor = await import(`./motores/${config.motor}.mjs`);
const [orden, valor] = process.argv.slice(2);

// Una muestra: el comienzo de la primera parte de "El mapa de los lenguajes" (unos 30 segundos).
function muestra(voz) {
  motor.preparar(voz);
  const md = readFileSync(path.join(RAIZ, CLASES['44'].carpeta, 'LECCION.md'), 'utf8');
  const parte = partir(md).partes[0];
  const texto = `Hola. Esta es la voz ${voz.replace(/[_-]/g, ' ')}.\n\n${textoParaVoz(parte.md, 'programacion').slice(0, 600)}`;
  mkdirSync(MUESTRAS, { recursive: true });
  const wav = path.join(MUESTRAS, `${voz}.wav`);
  const m4a = path.join(MUESTRAS, `${voz}.m4a`);
  motor.hablar(texto, wav, voz);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-c:a', 'aac', '-b:a', '48k', m4a]);
  rmSync(wav);
  console.log(`🎧 ${m4a}`);
}

if (!orden) {
  console.log(`Audios: ${config.activo === false ? 'APAGADOS' : 'encendidos'} · motor: ${motor.nombre} · voz: ${config.voz}\n`);
  console.log('Voces de este motor:');
  for (const v of motor.voces) console.log(`  ${v === config.voz ? '▶' : ' '} ${v}`);
  console.log('\nCambiar: node herramientas/audio/voz.mjs <voz>   ·   Escuchar antes: --probar <voz>');
} else if (orden === '--apagar' || orden === '--encender') {
  guardar({ activo: orden === '--encender' });
  console.log(`Audios ${orden === '--encender' ? 'encendidos' : 'apagados'}. Sube el cambio (git push) para que valga en la página y en GitHub.`);
} else if (orden === '--probar') {
  if (!motor.voces.includes(valor)) { console.error(`No conozco la voz "${valor}".`); process.exit(1); }
  muestra(valor);
} else if (orden === '--probar-todas') {
  for (const v of motor.voces) { try { muestra(v); } catch (e) { console.error(`✗ ${v}: ${e.message}`); } }
} else if (motor.voces.includes(orden)) {
  guardar({ voz: orden });
  console.log(`Voz cambiada a ${orden}. Al subir el cambio (git push), GitHub rehace todos los audios con esta voz.`);
} else {
  console.error(`No conozco "${orden}". Voces: ${motor.voces.join(', ')}`);
  process.exit(1);
}
