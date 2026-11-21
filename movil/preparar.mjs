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

const index = await readFile(new URL('index.html', raiz), 'utf8');
await copyFile(new URL('node_modules/marked/marked.min.js', import.meta.url), new URL('web/marked.min.js', destino));
await writeFile(new URL('index.html', destino), index.replace(
  'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js',
  'web/marked.min.js',
));
