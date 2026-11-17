// Motor de voz: Piper (gratis, corre en la computadora, sin internet una vez descargada la voz).
// https://github.com/OHF-Voice/piper1-gpl — se instala con: pip install piper-tts==1.8.0
//
// Un motor es un archivo con estas cinco cosas (ver plantilla.mjs para hacer otro):
//   nombre          texto para mostrar
//   voces           las voces que se pueden usar
//   preparar(voz)   deja la voz lista (la descarga si falta) y avisa si falta algo
//   hablar(texto, wav, voz)   escribe el audio en un archivo .wav
//   firma(voz)      lo que identifica a la voz en la "huella" de cada audio (si cambia, se rehacen)

import { existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../../../', import.meta.url));
// En la Mac: la carpeta herramientas-audio, al lado del repositorio. En GitHub Actions: las variables de entorno.
const HERRAMIENTAS = process.env.HERRAMIENTAS_AUDIO || path.join(RAIZ, '..', 'herramientas-audio');
const PIPER = process.env.PIPER || path.join(HERRAMIENTAS, 'venv', 'bin', 'piper');
const PYTHON = process.env.PIPER_PYTHON || path.join(HERRAMIENTAS, 'venv', 'bin', 'python');
const VOCES = process.env.PIPER_VOCES || path.join(HERRAMIENTAS, 'voces');

export const nombre = 'Piper';

// Las voces en español que trae Piper (python -m piper.download_voices las lista todas).
export const voces = [
  'es_MX-claude-high', 'es_MX-ald-medium', 'es_MX-ald-x_low',
  'es_AR-daniela-high',
  'es_ES-davefx-medium', 'es_ES-sharvard-medium', 'es_ES-carlfm-x_low', 'es_ES-mls_10246-low', 'es_ES-mls_9972-low',
];

const modelo = (voz) => path.join(VOCES, `${voz}.onnx`);
const esRuta = (p) => p.includes('/');

export function preparar(voz) {
  if (esRuta(PIPER) && !existsSync(PIPER)) throw new Error(`No encuentro Piper en ${PIPER}. Instálalo: pip install piper-tts==1.8.0`);
  if (!existsSync(modelo(voz))) {
    console.log(`Descargando la voz ${voz}…`);
    mkdirSync(VOCES, { recursive: true });
    execFileSync(PYTHON, ['-m', 'piper.download_voices', '--data-dir', VOCES, voz], { stdio: 'inherit' });
  }
  if (!existsSync(modelo(voz))) throw new Error(`No pude descargar la voz ${voz}.`);
}

export function hablar(texto, wav, voz) {
  execFileSync(PIPER, ['-m', modelo(voz), '-f', wav, '--sentence-silence', '0.35'], { input: texto, stdio: ['pipe', 'ignore', 'pipe'] });
}

// Igual que antes del motor ("es_MX-claude-high.onnx"): así los audios ya hechos no se rehacen.
export const firma = (voz) => `${voz}.onnx`;
