// El glosario tiene que estar bien formado y apuntar a clases que existen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GLOSARIO, buscarEnGlosario } from '../web/glosario.js';
import { CLASES } from '../web/cursos.js';
import { readdirSync, readFileSync } from 'node:fs';

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

// Si el glosario manda a una clase, esa clase tiene que usar la palabra (o uno de sus alias).
// Si no, el alumno llega y no encuentra lo que buscaba.
test('cada término aparece en la clase a la que lleva', () => {
  const raiz = new URL('..', import.meta.url);
  for (const e of GLOSARIO) {
    if (e.clase === undefined) continue;
    const carpeta = new URL(CLASES[e.clase].carpeta + '/', raiz);
    const texto = readdirSync(carpeta).filter((f) => f.endsWith('.md'))
      .map((f) => readFileSync(new URL(f, carpeta), 'utf8')).join('\n').toLowerCase();
    const formas = [e.termino, ...(e.alias || [])].map((x) => x.toLowerCase());
    assert.ok(formas.some((x) => texto.includes(x)), `"${e.termino}" lleva a la clase ${e.clase}, pero esa clase no usa la palabra`);
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
