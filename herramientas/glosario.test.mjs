// El glosario tiene que estar bien formado y apuntar a clases que existen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GLOSARIO, buscarEnGlosario } from '../web/glosario.js';
import { CLASES } from '../web/cursos.js';

test('cada término tiene nombre y una definición corta', () => {
  for (const e of GLOSARIO) {
    assert.ok(e.termino && e.termino.trim().length > 0, 'un término está vacío');
    assert.ok(e.definicion && e.definicion.trim().length >= 15, `definición muy corta: ${e.termino}`);
    assert.ok(e.definicion.length <= 320, `definición muy larga (${e.definicion.length}): ${e.termino}`);
  }
});

test('la clase de cada término existe en cursos.js', () => {
  for (const e of GLOSARIO) {
    if (e.clase === undefined) continue;
    assert.ok(CLASES[e.clase], `${e.termino} apunta a la clase ${e.clase}, que no existe`);
  }
});

test('no hay términos repetidos', () => {
  const nombres = GLOSARIO.map((e) => e.termino.toLowerCase());
  assert.equal(new Set(nombres).size, nombres.length, 'hay un término repetido');
});

test('buscar encuentra por nombre, por alias y sin tildes', () => {
  assert.ok(buscarEnGlosario('commit').some((e) => e.termino === 'commit'));
  assert.ok(buscarEnGlosario('pr').some((e) => e.termino === 'pull request'), 'el alias "pr" no encontró pull request');
  assert.ok(buscarEnGlosario('asincronia').some((e) => e.termino === 'asíncrono'), 'no ignoró la tilde');
  assert.equal(buscarEnGlosario('z').length, 0, 'con una sola letra no debería devolver nada');
});
