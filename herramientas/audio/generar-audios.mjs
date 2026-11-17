// Genera un audio por cada parte de cada clase, con Piper (voz gratis que corre en tu Mac).
// Esos audios se pueden escuchar con la pantalla del teléfono bloqueada (la voz del navegador no).
//
//   node herramientas/audio/generar-audios.mjs                 todas las clases (solo lo que cambió)
//   node herramientas/audio/generar-audios.mjs 01 44           solo esas clases (número de carpeta)
//   node herramientas/audio/generar-audios.mjs --prueba 01 2   una sola parte, para escucharla
//
// Necesita (fuera del repositorio): Piper en un entorno virtual, una voz .onnx y ffmpeg.
// Rutas por defecto: ../herramientas-audio/venv/bin/piper y ../herramientas-audio/voces/es_MX-claude-high.onnx
// Los audios van a ../estudios-audio/audio/ (otro repositorio, para no llenar este de archivos pesados).
// Cada audio se rehace solo si cambió su texto (se guarda una huella en indice.json).

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CLASES, ETAPAS, CURSOS, cursoDeEtapa, clasesDelCurso } from '../../web/cursos.js';
import { partir } from '../../web/lector.js';

const RAIZ = fileURLToPath(new URL('../../', import.meta.url));
const HERRAMIENTAS = process.env.HERRAMIENTAS_AUDIO || path.join(RAIZ, '..', 'herramientas-audio');
const PIPER = process.env.PIPER || path.join(HERRAMIENTAS, 'venv', 'bin', 'piper');
const VOZ = process.env.VOZ || path.join(HERRAMIENTAS, 'voces', 'es_MX-claude-high.onnx');
const SALIDA = process.env.SALIDA_AUDIO || path.join(RAIZ, '..', 'estudios-audio', 'audio');
const KBPS = process.env.KBPS || '32';   // voz en mono: 32 kbps se escucha bien y pesa poco

// ---------- el número que se ve (el mismo motor del sitio) ----------
const etapaDe = (n) => ETAPAS.find((e) => e.clases.includes(n));
const cursoDe = (n) => cursoDeEtapa(etapaDe(n) || {});
const numeroEnCurso = (n) => String(clasesDelCurso(cursoDe(n)).indexOf(n) + 1).padStart(2, '0');

// ---------- del Markdown al texto que se lee en voz alta ----------
export function textoParaVoz(md, cursoActual) {
  let t = md;
  t = t.replace(/```practica[\s\S]*?```/g, '\n\nAquí hay una práctica para responder en la página.\n\n');
  t = t.replace(/```[\s\S]*?```/g, '\n\nAquí hay un ejemplo de código, en la página.\n\n');
  // "Tema 07" → el número del mapa, y el curso si es otro
  // (fuera del código en línea: `#/clase/15` es una ruta, no una referencia)
  t = t.replace(/(?<!`[^`]*)\b(Temas?|[Cc]lases?)\s+(\d{2})\b/g, (todo, palabra, n) => {
    if (!CLASES[n]) return todo;
    const otro = cursoDe(n) !== cursoActual ? ` de ${CURSOS[cursoDe(n)].titulo}` : '';
    return `${palabra} ${Number(numeroEnCurso(n))}${otro}`;
  });
  // Código en línea primero (antes de borrar etiquetas HTML): `<main id="app">` → main id app
  t = t.replace(/`([^`]+)`/g, (todo, c) => c.replace(/[<>"'=/{}()[\];]/g, ' ').replace(/#/g, ' numeral '));
  t = t.replace(/<details>[\s\S]*?<\/details>/g, '\n\nAquí hay una respuesta escondida, en la página.\n\n');
  t = t.replace(/<[^>]+>/g, ' ');
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');                 // imágenes
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');                // enlaces → su texto
  // Tablas: cada fila como una frase
  t = t.split('\n').map((l) => {
    if (/^\s*\|?\s*:?-{3,}/.test(l)) return '';
    if (/^\s*\|.*\|\s*$/.test(l)) return l.split('|').map((c) => c.trim()).filter(Boolean).join(', ') + '.';
    return l;
  }).join('\n');
  t = t.replace(/^#{1,6}\s*(.+)$/gm, '$1.');                     // títulos → frase
  t = t.replace(/^\s*[-*]\s+/gm, '');                            // viñetas
  t = t.replace(/^\s*>\s?/gm, '');                               // citas
  t = t.replace(/[*_~]+/g, '');                                  // negritas, cursivas
  t = t.replace(/\p{Extended_Pictographic}️?/gu, '');      // emojis
  t = t.replace(/→/g, ', ').replace(/#/g, ' numeral ').replace(/\|/g, ' ');
  t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').replace(/\.\.+/g, '.').trim();
  return t;
}

const huella = (t) => createHash('sha256').update(`${KBPS}|${path.basename(VOZ)}|${t}`).digest('hex').slice(0, 16);

function hablar(texto, destino) {
  const wav = destino.replace(/\.m4a$/, '.wav');
  execFileSync(PIPER, ['-m', VOZ, '-f', wav, '--sentence-silence', '0.35'], { input: texto, stdio: ['pipe', 'ignore', 'pipe'] });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-c:a', 'aac', '-b:a', `${KBPS}k`, '-movflags', '+faststart', destino]);
  rmSync(wav);
}

// ---------- programa ----------
const args = process.argv.slice(2);
const prueba = args[0] === '--prueba';
const elegidas = prueba ? [args[1]] : args.filter((a) => /^\d{2}$/.test(a));
const clases = elegidas.length ? elegidas : Object.keys(CLASES);
if (!existsSync(PIPER) || !existsSync(VOZ)) { console.error(`Falta Piper o la voz.\n  PIPER=${PIPER}\n  VOZ=${VOZ}`); process.exit(1); }

mkdirSync(SALIDA, { recursive: true });
const archivoIndice = path.join(SALIDA, 'indice.json');
const indice = existsSync(archivoIndice) ? JSON.parse(readFileSync(archivoIndice, 'utf8')) : {};
let hechos = 0, iguales = 0;
const inicio = Date.now();

for (const num of clases) {
  const c = CLASES[num];
  if (!c || !etapaDe(num)) continue;
  const archivo = c.docs[0].archivo;
  const { partes } = partir(readFileSync(path.join(RAIZ, c.carpeta, archivo), 'utf8'));
  mkdirSync(path.join(SALIDA, num), { recursive: true });
  for (const [k, p] of partes.entries()) {
    const i = k + 1;
    if (prueba && i !== Number(args[2] || 1)) continue;
    const titulo = p.titulo.replace(/[*_`]/g, '').trim();
    const texto = `${titulo}${/[.?!:]$/.test(titulo) ? '' : '.'}\n\n${textoParaVoz(p.md, cursoDe(num))}`;
    const id = `${num}:${archivo}:${i}`;
    const destino = path.join(SALIDA, num, `${String(i).padStart(2, '0')}.m4a`);
    const h = huella(texto);
    if (!prueba && indice[id]?.huella === h && existsSync(destino)) { iguales++; continue; }
    hablar(texto, destino);
    indice[id] = { huella: h, archivo: `${num}/${String(i).padStart(2, '0')}.m4a` };
    hechos++;
    console.log(`✓ ${id}  (${hechos} hechos)`);
    if (prueba) console.log(`\n--- texto leído ---\n${texto.slice(0, 1200)}…`);
  }
  writeFileSync(archivoIndice, JSON.stringify(indice, null, 1));
}
console.log(`Listo: ${hechos} audios nuevos, ${iguales} sin cambios, en ${Math.round((Date.now() - inicio) / 1000)} s → ${SALIDA}`);
