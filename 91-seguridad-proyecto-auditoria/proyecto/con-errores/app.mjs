// LA API DE GASTOS, CON 10 ERRORES A PROPÓSITO (V1 a V10), para auditarla en el curso Seguridad.
// ⚠️ Solo para practicar en tu computadora. No la publiques ni copies estas partes en un proyecto real.
//
// Las rutas:
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

const aqui = path.dirname(fileURLToPath(import.meta.url));

export function crearApp({ base }) {
  const app = express();
  const sesiones = new Map(); // token → usuario

  app.use(express.json({ limit: '10kb' }));

  // V9: CORS abierto: cualquier sitio puede leer las respuestas.
  app.use((pedido, respuesta, siguiente) => {
    respuesta.set('Access-Control-Allow-Origin', '*');
    respuesta.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (pedido.method === 'OPTIONS') return respuesta.status(204).end();
    siguiente();
  });

  app.use(express.static(path.join(aqui, 'publico')));

  // V6 y V7: el login dice si el usuario existe, y no limita los intentos.
  app.post('/login', (pedido, respuesta) => {
    const { usuario, clave } = pedido.body ?? {};
    const fila = base.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(String(usuario));
    if (!fila) return respuesta.status(401).json({ error: 'Ese usuario no existe' });
    if (fila.clave !== clave) return respuesta.status(401).json({ error: 'Clave incorrecta' }); // V5: compara la clave guardada en texto plano
    const token = randomUUID();
    sesiones.set(token, fila.usuario);
    respuesta.json({ token });
  });

  // Todo lo de /gastos necesita sesión.
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

  // V3: inyección SQL: la nota se pega dentro de la consulta.
  app.get('/gastos/buscar', (pedido, respuesta) => {
    const nota = String(pedido.query.nota ?? '');
    const sql = `SELECT * FROM gastos WHERE dueno = '${pedido.usuario}' AND nota LIKE '%${nota}%' ORDER BY id`;
    respuesta.json(base.prepare(sql).all());
  });

  // V1: IDOR: devuelve el gasto aunque sea de otro.
  app.get('/gastos/:id', (pedido, respuesta) => {
    const gasto = base.prepare('SELECT * FROM gastos WHERE id = ?').get(Number(pedido.params.id));
    if (!gasto) return respuesta.status(404).json({ error: 'No existe ese gasto' });
    respuesta.json(gasto);
  });

  // V2: asignación masiva: si el cuerpo trae "dueno", se usa. Se puede crear un gasto a nombre de otro.
  app.post('/gastos', (pedido, respuesta) => {
    const datos = { dueno: pedido.usuario, nota: '', ...pedido.body };
    if (typeof datos.tipo !== 'string' || !(typeof datos.valor === 'number' && datos.valor > 0)) {
      return respuesta.status(400).json({ error: 'Datos inválidos' });
    }
    const r = base
      .prepare('INSERT INTO gastos (dueno, tipo, valor, nota) VALUES (?, ?, ?, ?)')
      .run(datos.dueno, datos.tipo, datos.valor, String(datos.nota));
    respuesta.status(201).json(base.prepare('SELECT * FROM gastos WHERE id = ?').get(r.lastInsertRowid));
  });

  // V8: los errores de adentro se le muestran al usuario, con el stack (rutas de archivos, líneas, consultas).
  app.use((error, pedido, respuesta, siguiente) => {
    respuesta.status(500).json({ error: error.message, detalle: error.stack });
  });

  return app;
}
