// USO NORMAL: lo que la app tiene que seguir haciendo. Pasa en las DOS versiones:
// arreglar la seguridad no puede romper lo que ya funcionaba.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VERSION, entrar, filaHtml, nuevaApp, request } from './ayuda.mjs';

test(`[${VERSION}] entrar con la clave correcta da un token`, async () => {
  const { app } = nuevaApp();
  assert.ok(await entrar(app, 'ana'));
});

test(`[${VERSION}] sin sesión, /gastos pide entrar`, async () => {
  const { app } = nuevaApp();
  assert.equal((await request(app).get('/gastos')).status, 401);
});

test(`[${VERSION}] cada uno ve su lista`, async () => {
  const { app } = nuevaApp();
  const r = await request(app).get('/gastos').set('Authorization', `Bearer ${await entrar(app, 'ana')}`);
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.map((g) => g.nota), ['lavado completo']);
});

test(`[${VERSION}] crear un gasto y verlo`, async () => {
  const { app } = nuevaApp();
  const token = await entrar(app, 'ana');
  const creado = await request(app).post('/gastos').set('Authorization', `Bearer ${token}`).send({ tipo: 'peaje', valor: 5.4, nota: 'ida al centro' });
  assert.equal(creado.status, 201);
  const visto = await request(app).get(`/gastos/${creado.body.id}`).set('Authorization', `Bearer ${token}`);
  assert.equal(visto.body.nota, 'ida al centro');
});

test(`[${VERSION}] datos inválidos: 400`, async () => {
  const { app } = nuevaApp();
  const r = await request(app).post('/gastos').set('Authorization', `Bearer ${await entrar(app, 'ana')}`).send({ tipo: 'peaje', valor: -1 });
  assert.equal(r.status, 400);
});

test(`[${VERSION}] buscar por nota en lo propio`, async () => {
  const { app } = nuevaApp();
  const r = await request(app).get('/gastos/buscar').query({ nota: 'lavado' }).set('Authorization', `Bearer ${await entrar(app, 'ana')}`);
  assert.deepEqual(r.body.map((g) => g.nota), ['lavado completo']);
});

test(`[${VERSION}] la página muestra la nota`, () => {
  assert.match(filaHtml({ tipo: 'lavado', valor: 30, nota: 'lavado completo' }), /lavado completo/);
});
