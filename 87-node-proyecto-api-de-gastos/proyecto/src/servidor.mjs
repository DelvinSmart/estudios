// EL ARRANQUE: lo único que abre un puerto. Las pruebas no lo usan.
//   npm start                 → http://localhost:3000
//   PUERTO=4000 npm start     → en otro puerto
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearApp } from './app.mjs';
import { crearAlmacenArchivo } from './almacen.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const puerto = Number(process.env.PUERTO ?? 3000);

const app = crearApp({
  almacen: crearAlmacenArchivo(path.join(aqui, '..', 'datos', 'gastos.json')),
  origenes: ['http://localhost:5173', 'https://delvinsmart.github.io'],
});

app.listen(puerto, () => console.log(`API de gastos lista en http://localhost:${puerto}`));
