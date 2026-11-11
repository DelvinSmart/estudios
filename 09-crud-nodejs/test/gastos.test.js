// TEST DE INTEGRACIÓN: prueba las piezas juntas (rutas + validación + datos)
// con peticiones HTTP reales a un servidor de prueba.
const test = require('node:test');
const assert = require('node:assert/strict');
const { crearApp } = require('../src/app');

function arrancar() {
  return new Promise((resolve) => {
    const servidor = crearApp().listen(0, () => {
      resolve({ servidor, url: `http://localhost:${servidor.address().port}` });
    });
  });
}

const enviar = (url, metodo, cuerpo) =>
  fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });

test('ciclo CRUD completo', async (t) => {
  const { servidor, url } = await arrancar();
  t.after(() => servidor.close());

  // CREATE
  const creado = await enviar(`${url}/gastos`, 'POST', { descripcion: 'Agua', monto: 3 });
  assert.equal(creado.status, 201);
  const gasto = await creado.json();

  // READ
  const leido = await fetch(`${url}/gastos/${gasto.id}`);
  assert.equal((await leido.json()).descripcion, 'Agua');

  // UPDATE
  const cambiado = await enviar(`${url}/gastos/${gasto.id}`, 'PUT', { descripcion: 'Agua grande', monto: 5 });
  assert.equal((await cambiado.json()).monto, 5);

  // DELETE
  const borrado = await fetch(`${url}/gastos/${gasto.id}`, { method: 'DELETE' });
  assert.equal(borrado.status, 204);
  assert.equal((await fetch(`${url}/gastos/${gasto.id}`)).status, 404);
});

test('no crea un gasto inválido', async (t) => {
  const { servidor, url } = await arrancar();
  t.after(() => servidor.close());
  const respuesta = await enviar(`${url}/gastos`, 'POST', { descripcion: '', monto: 0 });
  assert.equal(respuesta.status, 400);
});
