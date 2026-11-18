// LAS TRAMPAS: cada una intenta explotar un error (V1 a V10) y ESPERA QUE FALLE el ataque.
//   npm run trampas             → contra con-errores: salen en rojo (los errores están)
//   npm run trampas:arreglada   → contra la arreglada: tienen que salir en verde
// Así, si alguien vuelve a meter un error el mes que viene, la trampa lo atrapa (clase 24, Parte 4).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { VERSION, claveDe, crearApp, entrar, filaHtml, nuevaApp, request } from './ayuda.mjs';

const conToken = (token) => ({ Authorization: `Bearer ${token}` });

test(`[${VERSION}] V1 IDOR: Ana no ve el gasto de Beto cambiando el id`, async () => {
  const { app } = nuevaApp();
  const r = await request(app).get('/gastos/2').set(conToken(await entrar(app, 'ana'))); // el 2 es de Beto
  assert.equal(r.status, 404, `respondió ${r.status} con ${JSON.stringify(r.body)}: se ve el gasto de otro`);
});

test(`[${VERSION}] V2 asignación masiva: Ana no crea un gasto a nombre de Beto`, async () => {
  const { app } = nuevaApp();
  await request(app).post('/gastos').set(conToken(await entrar(app, 'ana'))).send({ tipo: 'lavado', valor: 999, nota: 'cobrado a beto', dueno: 'beto' });
  const deBeto = await request(app).get('/gastos').set(conToken(await entrar(app, 'beto')));
  assert.ok(!deBeto.body.some((g) => g.nota === 'cobrado a beto'), 'apareció en la lista de Beto un gasto que creó Ana');
});

test(`[${VERSION}] V3 inyección SQL: buscar no trae lo de otro`, async () => {
  const { app } = nuevaApp();
  const r = await request(app).get('/gastos/buscar').query({ nota: "' OR 1=1 --" }).set(conToken(await entrar(app, 'ana')));
  assert.equal(r.status, 200);
  assert.ok(!JSON.stringify(r.body).includes('nota privada de beto'), 'la búsqueda devolvió la nota privada de Beto');
});

test(`[${VERSION}] V4 XSS: una nota con HTML se muestra como texto`, () => {
  const html = filaHtml({ tipo: 'lavado', valor: 30, nota: '<img src=x onerror="robar()">' });
  assert.ok(!html.includes('<img'), `la página arma: ${html}`);
  assert.ok(html.includes('&lt;img'), 'la nota tiene que verse, escapada');
});

test(`[${VERSION}] V5 claves: la base no guarda ninguna clave en texto plano`, () => {
  const { base } = nuevaApp();
  const filas = JSON.stringify(base.prepare('SELECT * FROM usuarios').all());
  assert.ok(!filas.includes(claveDe('ana')), 'la clave de Ana está escrita tal cual en la base');
});

test(`[${VERSION}] V6 enumeración: un usuario que no existe recibe lo mismo que una clave mala`, async () => {
  const { app } = nuevaApp();
  const noExiste = await request(app).post('/login').send({ usuario: 'carla', clave: 'lo-que-sea-123' });
  const claveMala = await request(app).post('/login').send({ usuario: 'ana', clave: 'lo-que-sea-123' });
  assert.deepEqual([noExiste.status, noExiste.body], [claveMala.status, claveMala.body], 'las respuestas dicen si el usuario existe');
});

test(`[${VERSION}] V7 fuerza bruta: después de 5 claves malas, el login se frena`, async () => {
  const { app } = nuevaApp();
  const respuestas = [];
  for (let i = 0; i < 6; i++) respuestas.push((await request(app).post('/login').send({ usuario: 'ana', clave: `intento-${i}` })).status);
  assert.deepEqual(respuestas, [401, 401, 401, 401, 401, 429], `respuestas: ${respuestas.join(', ')}`);
});

test(`[${VERSION}] V8 errores: un error de adentro no muestra detalles`, async () => {
  const baseRota = { prepare() { throw new Error('no such table: usuarios (en /srv/app/datos.mjs:12)'); } };
  const r = await request(crearApp({ base: baseRota })).post('/login').send({ usuario: 'ana', clave: 'x' });
  assert.equal(r.status, 500);
  assert.deepEqual(r.body, { error: 'Algo salió mal' }, `al usuario le llegó: ${JSON.stringify(r.body).slice(0, 120)}…`);
});

test(`[${VERSION}] V9 CORS: un sitio ajeno no puede leer las respuestas`, async () => {
  const { app } = nuevaApp();
  const ajeno = await request(app).get('/gastos').set('Origin', 'https://sitio-malo.example');
  assert.equal(ajeno.headers['access-control-allow-origin'], undefined, `le contestó: ${ajeno.headers['access-control-allow-origin']}`);
  const propio = await request(app).get('/gastos').set('Origin', 'http://127.0.0.1:3000');
  assert.equal(propio.headers['access-control-allow-origin'], 'http://127.0.0.1:3000');
});

test(`[${VERSION}] V10 secretos: la clave del SMS no está escrita en el código`, async () => {
  const codigo = await readFile(new URL(`../${VERSION}/config.mjs`, import.meta.url), 'utf8');
  assert.doesNotMatch(codigo, /CLAVE_SMS\s*=\s*['"`]/, 'CLAVE_SMS tiene un valor escrito en config.mjs: va en una variable de entorno');
});
