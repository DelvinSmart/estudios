// Pruebas de la API completa con supertest: llama a la app sin abrir ningún puerto.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { crearApp } from '../src/app.mjs';
import { crearAlmacenMemoria } from '../src/almacen.mjs';

const bueno = { tipo: 'lavado', valor: 30, fecha: '2026-11-18' };
const silencio = { error() {} };   // para que el error de prueba no ensucie la terminal
let app;

beforeEach(() => {
  app = crearApp({ almacen: crearAlmacenMemoria(), origenes: ['http://localhost:5173'], registro: silencio });
});

test('GET /salud', async () => {
  const r = await request(app).get('/salud');
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ok: true });
});

test('crear: 201 con el gasto y su id', async () => {
  const r = await request(app).post('/gastos').send(bueno);
  assert.equal(r.status, 201);
  assert.deepEqual(r.body, { id: 1, ...bueno });
});

test('crear con datos inválidos: 400 con los detalles', async () => {
  const r = await request(app).post('/gastos').send({ tipo: 'lavado', valor: -5, fecha: bueno.fecha });
  assert.equal(r.status, 400);
  assert.equal(r.body.detalles.length, 1);
});

test('un campo de más como admin se ignora', async () => {
  const r = await request(app).post('/gastos').send({ ...bueno, admin: true });
  assert.equal(r.body.admin, undefined);
});

test('JSON roto: 400, no 500', async () => {
  const r = await request(app).post('/gastos').set('Content-Type', 'application/json').send('{ roto');
  assert.equal(r.status, 400);
});

test('un pedido gigante: 413', async () => {
  const r = await request(app).post('/gastos').send({ ...bueno, nota: 'x'.repeat(20_000) });
  assert.equal(r.status, 413);
});

test('listar, filtrar y el resumen', async () => {
  await request(app).post('/gastos').send(bueno);
  await request(app).post('/gastos').send({ ...bueno, tipo: 'peaje', valor: 12.5 });
  assert.equal((await request(app).get('/gastos')).body.length, 2);
  assert.equal((await request(app).get('/gastos?tipo=peaje')).body.length, 1);
  assert.deepEqual((await request(app).get('/gastos/resumen')).body, { total: 42.5, cantidad: 2, porTipo: { lavado: 30, peaje: 12.5 } });
});

test('ver uno: 200, 404 y 400 si el id no es un número', async () => {
  await request(app).post('/gastos').send(bueno);
  assert.equal((await request(app).get('/gastos/1')).status, 200);
  assert.equal((await request(app).get('/gastos/99')).status, 404);
  assert.equal((await request(app).get('/gastos/abc')).status, 400);
});

test('PATCH cambia solo lo que viene', async () => {
  await request(app).post('/gastos').send(bueno);
  const r = await request(app).patch('/gastos/1').send({ valor: 45 });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { ...bueno, id: 1, valor: 45 });
  assert.equal((await request(app).patch('/gastos/1').send({ valor: 0 })).status, 400);
  assert.equal((await request(app).patch('/gastos/9').send({ valor: 5 })).status, 404);
});

test('DELETE: 204 y después 404', async () => {
  await request(app).post('/gastos').send(bueno);
  assert.equal((await request(app).delete('/gastos/1')).status, 204);
  assert.equal((await request(app).delete('/gastos/1')).status, 404);
});

test('una ruta que no existe: 404 en JSON', async () => {
  const r = await request(app).get('/viajes');
  assert.equal(r.status, 404);
  assert.deepEqual(r.body, { error: 'Ruta no encontrada' });
});

test('CORS: tu origen sí, otro no', async () => {
  const tuyo = await request(app).get('/gastos').set('Origin', 'http://localhost:5173');
  assert.equal(tuyo.headers['access-control-allow-origin'], 'http://localhost:5173');
  const otro = await request(app).get('/gastos').set('Origin', 'https://pagina-rara.com');
  assert.equal(otro.headers['access-control-allow-origin'], undefined);
});

test('no cuenta qué tecnología usa', async () => {
  const r = await request(app).get('/salud');
  assert.equal(r.headers['x-powered-by'], undefined);
});

test('límite por minuto: el pedido de más da 429', async () => {
  const chica = crearApp({ almacen: crearAlmacenMemoria(), maximoPorMinuto: 2, registro: silencio });
  await request(chica).get('/gastos');
  await request(chica).get('/gastos');
  assert.equal((await request(chica).get('/gastos')).status, 429);
});

test('un error de adentro: 500 sin detalles', async () => {
  const roto = { async leer() { throw new Error('el disco /srv/datos falló'); }, async guardar() {} };
  const r = await request(crearApp({ almacen: roto, registro: silencio })).get('/gastos');
  assert.equal(r.status, 500);
  assert.deepEqual(r.body, { error: 'Algo salió mal' });
});

test('la página se sirve en /', async () => {
  const r = await request(app).get('/');
  assert.equal(r.status, 200);
  assert.match(r.text, /Gastos del carro/);
});
