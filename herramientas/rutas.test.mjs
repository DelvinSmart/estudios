// Las direcciones de las clases: la URL bonita (#/curso/numero) tiene que llevar SIEMPRE a la
// misma clase de vuelta. Si esto falla, un enlace mandaría a la clase equivocada.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLASES } from '../web/cursos.js';
import { idDesdeCursoNumero, hashDeClase, hashBonitoPendiente, numeroDeClase, normalizarRuta } from '../web/rutas.js';

test('la clase de introducción (116) es la número 1 de Programación', () => {
  assert.equal(idDesdeCursoNumero('programacion', 1), '116');
  assert.equal(numeroDeClase('116'), 1);
  assert.equal(hashDeClase('116'), '#/programacion/1');
});

test('hashDeClase arma la forma bonita, con y sin parte', () => {
  const n = numeroDeClase('06');
  assert.equal(hashDeClase('06'), `#/programacion/${n}`);
  assert.equal(hashDeClase('06', '0', '3'), `#/programacion/${n}/0/3`);
});

test('normalizarRuta entiende la forma bonita y deja igual las demás', () => {
  assert.deepEqual(normalizarRuta(['programacion', '1']), ['clase', '116']);
  assert.deepEqual(normalizarRuta(['programacion', '2', '0', '3']), ['clase', '01', '0', '3']);
  assert.deepEqual(normalizarRuta(['clase', '06']), ['clase', '06']);     // la vieja no se toca
  assert.deepEqual(normalizarRuta(['progreso']), ['progreso']);
  assert.deepEqual(normalizarRuta(['curso', 'python']), ['curso', 'python']); // el home del curso no se toca
});

test('ida y vuelta: la URL bonita de CADA clase vuelve a su mismo id', () => {
  for (const id of Object.keys(CLASES)) {
    const hash = hashDeClase(id);                       // #/curso/numero
    const partes = hash.replace(/^#\/?/, '').split('/');
    assert.deepEqual(normalizarRuta(partes), ['clase', id], `la URL ${hash} no volvió a la clase ${id}`);
  }
});

test('la dirección bonita no pisa una redirección hecha mientras se dibujaba', () => {
  // Clase con prácticas: /todo redirige a la parte 1. Volver a /todo causaba un ciclo infinito.
  assert.equal(hashBonitoPendiente('#/swift/1/0/todo', '#/clase/97/0/1', '#/swift/1/0/todo'), null);
  assert.equal(hashBonitoPendiente('#/clase/97/0/1', '#/clase/97/0/1', '#/swift/1/0/1'), '#/swift/1/0/1');
  assert.equal(hashBonitoPendiente('#/swift/1/0/1', '#/swift/1/0/1', '#/swift/1/0/1'), null);
});

test('un número que no existe en el curso da null (no manda a cualquier clase)', () => {
  assert.equal(idDesdeCursoNumero('programacion', 999), null);
  assert.equal(idDesdeCursoNumero('no-existe', 1), null);
});
