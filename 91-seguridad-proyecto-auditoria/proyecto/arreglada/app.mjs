// LA API DE GASTOS, ARREGLADA. Cada cambio dice "ARREGLO Vn": compáralo con con-errores/app.mjs.
//
// Las rutas son las mismas:
//   POST /login              { usuario, clave } → { token }
//   GET  /gastos             tus gastos
//   GET  /gastos/buscar?nota=texto
//   GET  /gastos/:id
//   POST /gastos             { tipo, valor, nota }
//   GET  /                   la página
import express from 'express';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORIGENES } from './config.mjs';
import { claveCorrecta, huellaDe } from './datos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const MAXIMO_DE_INTENTOS = 5;
const VENTANA_MS = 15 * 60 * 1000;
// Una huella de mentira para comparar cuando el usuario no existe: así tarda lo mismo que con uno que sí (V6).
const HUELLA_DE_RELLENO = huellaDe('nadie-usa-esta-clave');

export function crearApp({ base }) {
  const app = express();
  const sesiones = new Map(); // token → usuario
  const intentos = new Map(); // usuario → { inicio, fallidos }

  app.use(express.json({ limit: '10kb' }));

  // ARREGLO V9: CORS solo para los sitios de la lista (clase 23, Parte 6).
  app.use((pedido, respuesta, siguiente) => {
    const origen = pedido.get('origin');
    if (origen && ORIGENES.includes(origen)) {
      respuesta.set('Access-Control-Allow-Origin', origen);
      respuesta.set('Vary', 'Origin');
      respuesta.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    if (pedido.method === 'OPTIONS') return respuesta.status(204).end();
    siguiente();
  });

  app.use(express.static(path.join(aqui, 'publico')));

  app.post('/login', (pedido, respuesta) => {
    const usuario = String(pedido.body?.usuario ?? '');
    const clave = String(pedido.body?.clave ?? '');

    // ARREGLO V7: después de 5 claves malas, 15 minutos de espera para ese usuario (clase 23, Parte 5).
    const ahora = Date.now();
    let cuenta = intentos.get(usuario);
    if (!cuenta || ahora - cuenta.inicio > VENTANA_MS) cuenta = { inicio: ahora, fallidos: 0 };
    if (cuenta.fallidos >= MAXIMO_DE_INTENTOS) {
      return respuesta.status(429).json({ error: 'Demasiados intentos. Espera unos minutos.' });
    }

    const fila = base.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario);
    // ARREGLO V5 y V6: se compara la huella, y si el usuario no existe se compara igual (con la de relleno)
    // para tardar lo mismo; y la respuesta es UNA SOLA para los dos casos.
    const correcta = claveCorrecta(clave, fila ?? HUELLA_DE_RELLENO) && Boolean(fila);
    if (!correcta) {
      cuenta.fallidos += 1;
      intentos.set(usuario, cuenta);
      return respuesta.status(401).json({ error: 'Usuario o clave incorrectos' });
    }
    intentos.delete(usuario);
    const token = randomUUID();
    sesiones.set(token, fila.usuario);
    respuesta.json({ token });
  });

  app.use('/gastos', (pedido, respuesta, siguiente) => {
    const token = (pedido.get('authorization') ?? '').replace(/^Bearer /, '');
    const usuario = sesiones.get(token);
    if (!usuario) return respuesta.status(401).json({ error: 'Necesitas entrar' });
    pedido.usuario = usuario;
    siguiente();
  });

  app.get('/gastos', (pedido, respuesta) => {
    respuesta.json(base.prepare('SELECT * FROM gastos WHERE dueno = ? ORDER BY id').all(pedido.usuario));
  });

  // ARREGLO V3: consulta con parámetros: la nota viaja como dato, nunca como código (clase 23, Parte 3).
  app.get('/gastos/buscar', (pedido, respuesta) => {
    const nota = String(pedido.query.nota ?? '');
    respuesta.json(base.prepare('SELECT * FROM gastos WHERE dueno = ? AND nota LIKE ? ORDER BY id').all(pedido.usuario, `%${nota}%`));
  });

  // ARREGLO V1: el gasto tiene que ser del que pregunta. Si no, 404 (no 403: no confirmamos que existe).
  app.get('/gastos/:id', (pedido, respuesta) => {
    const gasto = base.prepare('SELECT * FROM gastos WHERE id = ? AND dueno = ?').get(Number(pedido.params.id), pedido.usuario);
    if (!gasto) return respuesta.status(404).json({ error: 'No existe ese gasto' });
    respuesta.json(gasto);
  });

  // ARREGLO V2: solo los campos conocidos; el dueño SIEMPRE sale de la sesión, nunca del cuerpo.
  app.post('/gastos', (pedido, respuesta) => {
    const { tipo, valor, nota = '' } = pedido.body ?? {};
    if (typeof tipo !== 'string' || !(typeof valor === 'number' && valor > 0) || typeof nota !== 'string') {
      return respuesta.status(400).json({ error: 'Datos inválidos' });
    }
    const r = base.prepare('INSERT INTO gastos (dueno, tipo, valor, nota) VALUES (?, ?, ?, ?)').run(pedido.usuario, tipo, valor, nota);
    respuesta.status(201).json(base.prepare('SELECT * FROM gastos WHERE id = ?').get(r.lastInsertRowid));
  });

  // ARREGLO V8: el detalle va al registro del servidor; al usuario, solo "Algo salió mal" (clase 71).
  app.use((error, pedido, respuesta, siguiente) => {
    console.error(error);
    respuesta.status(500).json({ error: 'Algo salió mal' });
  });

  return app;
}
