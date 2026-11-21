import { copyFile, cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
import { CLASES } from '../web/cursos.js';

const raiz = new URL('../', import.meta.url);
const destino = new URL('./www/', import.meta.url);
const lecciones = Object.values(CLASES).map(({ carpeta }) => carpeta);
const extensiones = /\.(md|png|jpe?g|webp|gif|svg|mp3|ogg|m4a)$/i;

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });
await cp(new URL('web/', raiz), new URL('web/', destino), { recursive: true });

for (const carpeta of lecciones) {
  const origen = new URL(carpeta + '/', raiz);
  for (const archivo of await readdir(origen, { recursive: true, withFileTypes: true })) {
    if (!archivo.isFile() || !extensiones.test(archivo.name)) continue;
    const ruta = join(archivo.parentPath, archivo.name);
    const subruta = relative(fileURLToPath(raiz), ruta);
    if (subruta.split(/[\\/]/).some((segmento) => segmento.startsWith('.') || segmento === 'node_modules')) continue;
    const salida = new URL(subruta.replaceAll('\\', '/'), destino);
    await mkdir(new URL('.', salida), { recursive: true });
    await copyFile(ruta, salida);
  }
}

const recursosLocales = [
  ['https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js', 'marked/marked.min.js', 'marked.min.js'],
  ['https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', '@highlightjs/cdn-assets/highlight.min.js', 'highlight.min.js'],
  ['https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css', '@highlightjs/cdn-assets/styles/github-dark.min.css', 'github-dark.min.css'],
];

let index = await readFile(new URL('index.html', raiz), 'utf8');
for (const [remoto, paquete, archivo] of recursosLocales) {
  await copyFile(new URL('node_modules/' + paquete, import.meta.url), new URL('web/' + archivo, destino));
  index = index.replace(remoto, 'web/' + archivo);
}
await writeFile(new URL('index.html', destino), index
  .replace('initial-scale=1', 'initial-scale=1, viewport-fit=cover')
  .replace(/^ *<link [^\n]*https:\/\/fonts\.(?:googleapis|gstatic)\.com[^\n]*>\n/gm, '')
  .replace('</head>', `  <style>
    .barra { border-top: env(safe-area-inset-top) solid var(--fondo); }
    body { padding-bottom: env(safe-area-inset-bottom); }
    #cursos-mapa, .mapa-islas { scroll-margin-top: calc(76px + env(safe-area-inset-top)); }
  </style>
</head>`));
