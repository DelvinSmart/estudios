// Lo que comparten las pruebas: qué versión se prueba y cómo entrar.
//   VERSION=con-errores  → la que tiene los errores (las trampas salen en rojo)
//   VERSION=arreglada    → la arreglada (todo en verde)
import request from 'supertest';

export const VERSION = process.env.VERSION ?? 'arreglada';
export const { crearApp } = await import(`../${VERSION}/app.mjs`);
export const { crearBase, USUARIOS_DE_PRUEBA } = await import(`../${VERSION}/datos.mjs`);
export const { filaHtml } = await import(`../${VERSION}/publico/vista.mjs`);

export const claveDe = (usuario) => USUARIOS_DE_PRUEBA.find((u) => u.usuario === usuario).clave;

/** Una app nueva, con su base nueva, para cada prueba. */
export function nuevaApp() {
  const base = crearBase();
  return { app: crearApp({ base }), base };
}

/** Entra como ese usuario y devuelve el token. */
export async function entrar(app, usuario) {
  const r = await request(app).post('/login').send({ usuario, clave: claveDe(usuario) });
  if (!r.body.token) throw new Error(`no pude entrar como ${usuario}: ${JSON.stringify(r.body)}`);
  return r.body.token;
}

export { request };
