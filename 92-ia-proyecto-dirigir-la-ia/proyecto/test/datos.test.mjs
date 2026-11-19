// Las pruebas del repositorio, con un almacén de mentira (sin navegador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLAVE, crearRepositorio } from '../src/datos.mjs';
import { desdeFormulario } from '../src/logica.mjs';

function almacenDeMentira() {
  const datos = {};
  return {
    datos,
    getItem: (k) => (k in datos ? datos[k] : null),
    setItem: (k, v) => {
      datos[k] = String(v);
    },
  };
}

test('la primera vez: vacío', () => {
  assert.deepEqual(crearRepositorio(almacenDeMentira()).leer(), { kmActual: 0, lista: [] });
});

test('guarda y lee lo mismo (como si se cerrara y abriera la página)', () => {
  const almacen = almacenDeMentira();
  const estado = { kmActual: 84700, lista: [{ id: 'a', nombre: 'Aceite', cadaKm: 5000, cadaMeses: 6, ultimoKm: 80000, ultimaFecha: '2026-08-01' }] };
  assert.equal(crearRepositorio(almacen).guardar(estado), true);
  assert.deepEqual(crearRepositorio(almacen).leer(), estado);
});

test('algo roto o con otra forma: vacío, sin trabar la página', () => {
  const almacen = almacenDeMentira();
  for (const roto of ['{roto', '"un texto"', '{"lista":"no"}', 'null']) {
    almacen.datos[CLAVE] = roto;
    assert.deepEqual(crearRepositorio(almacen).leer(), { kmActual: 0, lista: [] }, `con ${roto}`);
  }
});

test('si el navegador no deja guardar, avisa con false y no se rompe', () => {
  const lleno = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
  assert.equal(crearRepositorio(lleno).guardar({ kmActual: 1, lista: [] }), false);
});

test('si el navegador no deja ni leer (modo privado estricto), arranca vacío', () => {
  const bloqueado = { getItem: () => { throw new Error('SecurityError'); }, setItem: () => {} };
  assert.deepEqual(crearRepositorio(bloqueado).leer(), { kmActual: 0, lista: [] });
});

test('del formulario a un mantenimiento: números de verdad, y sin km toma los de hoy', () => {
  assert.deepEqual(desdeFormulario({ nombre: ' Aceite ', cadaKm: '5000', cadaMeses: '6', ultimoKm: '80000', ultimaFecha: '2026-08-01' }, 84700, 'x'), { id: 'x', nombre: 'Aceite', cadaKm: 5000, cadaMeses: 6, ultimoKm: 80000, ultimaFecha: '2026-08-01' });
  assert.equal(desdeFormulario({ nombre: 'Seguro', cadaKm: '', cadaMeses: '12', ultimoKm: '', ultimaFecha: '2026-08-01' }, 84700, 'y').ultimoKm, 84700);
});
