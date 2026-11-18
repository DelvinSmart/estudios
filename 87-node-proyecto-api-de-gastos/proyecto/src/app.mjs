// LAS RUTAS. Cortas: leen el pedido, llaman a la lógica y responden con el código justo.
// crearApp no abre ningún puerto: así las pruebas la usan con supertest, sin red.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearServicio, validar } from './gastos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));

/** Un límite simple: cuántos pedidos por minuto deja pasar cada IP. */
function limitePorMinuto(maximo) {
  const cuentas = new Map();
  return (pedido, respuesta, siguiente) => {
    const ahora = Date.now();
    const c = cuentas.get(pedido.ip);
    if (!c || ahora - c.inicio > 60_000) cuentas.set(pedido.ip, { inicio: ahora, n: 1 });
    else if (++c.n > maximo) return respuesta.status(429).json({ error: 'Demasiados pedidos: espera un minuto' });
    siguiente();
  };
}

/** CORS: solo los orígenes de la lista pueden leer las respuestas desde el navegador. */
function cors(origenes) {
  return (pedido, respuesta, siguiente) => {
    const origen = pedido.get('origin');
    if (origen && origenes.includes(origen)) {
      respuesta.set('Access-Control-Allow-Origin', origen);
      respuesta.set('Vary', 'Origin');
      respuesta.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
      respuesta.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (pedido.method === 'OPTIONS') return respuesta.status(204).end();
    siguiente();
  };
}

/** Lee el :id de la ruta. Si no es un número entero positivo, responde 400 y corta. */
function leerId(pedido, respuesta) {
  const id = Number(pedido.params.id);
  if (!Number.isInteger(id) || id < 1) {
    respuesta.status(400).json({ error: 'El id tiene que ser un número entero' });
    return null;
  }
  return id;
}

export function crearApp({ almacen, origenes = [], maximoPorMinuto = 120, registro = console }) {
  const gastos = crearServicio(almacen);
  const app = express();

  app.disable('x-powered-by');                     // no contarle a nadie qué tecnología usamos
  app.use(express.json({ limit: '10kb' }));        // lee el cuerpo JSON, con límite de tamaño
  app.use(cors(origenes));
  app.use('/gastos', limitePorMinuto(maximoPorMinuto));
  app.use(express.static(path.join(aqui, '..', 'publico')));   // la página que usa la API

  app.get('/salud', (pedido, respuesta) => respuesta.json({ ok: true }));

  app.get('/gastos', async (pedido, respuesta) => {
    const { tipo, desde, hasta } = pedido.query;
    respuesta.json(await gastos.listar({ tipo, desde, hasta }));
  });

  // Va ANTES de /gastos/:id: si no, Express creería que "resumen" es un id.
  app.get('/gastos/resumen', async (pedido, respuesta) => {
    const { tipo, desde, hasta } = pedido.query;
    respuesta.json(await gastos.resumen({ tipo, desde, hasta }));
  });

  app.get('/gastos/:id', async (pedido, respuesta) => {
    const id = leerId(pedido, respuesta);
    if (id === null) return;
    const g = await gastos.buscar(id);
    if (!g) return respuesta.status(404).json({ error: 'No existe ese gasto' });
    respuesta.json(g);
  });

  app.post('/gastos', async (pedido, respuesta) => {
    const errores = validar(pedido.body ?? {});
    if (errores.length) return respuesta.status(400).json({ error: 'Datos inválidos', detalles: errores });
    respuesta.status(201).json(await gastos.crear(pedido.body));
  });

  app.patch('/gastos/:id', async (pedido, respuesta) => {
    const id = leerId(pedido, respuesta);
    if (id === null) return;
    const errores = validar(pedido.body ?? {}, true);
    if (errores.length) return respuesta.status(400).json({ error: 'Datos inválidos', detalles: errores });
    const g = await gastos.actualizar(id, pedido.body);
    if (!g) return respuesta.status(404).json({ error: 'No existe ese gasto' });
    respuesta.json(g);
  });

  app.delete('/gastos/:id', async (pedido, respuesta) => {
    const id = leerId(pedido, respuesta);
    if (id === null) return;
    if (!(await gastos.borrar(id))) return respuesta.status(404).json({ error: 'No existe ese gasto' });
    respuesta.status(204).end();
  });

  // Rutas que no existen.
  app.use((pedido, respuesta) => respuesta.status(404).json({ error: 'Ruta no encontrada' }));

  // Los errores, en un solo lugar y al final. Al usuario, nada interno.
  app.use((error, pedido, respuesta, siguiente) => {
    if (error.type === 'entity.parse.failed') return respuesta.status(400).json({ error: 'JSON inválido' });
    if (error.type === 'entity.too.large') return respuesta.status(413).json({ error: 'El pedido es demasiado grande' });
    registro.error(error);
    respuesta.status(500).json({ error: 'Algo salió mal' });
  });

  return app;
}
