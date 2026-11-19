import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decidirPersona, decidirSitio, gmailCanonico, TOPE_SITIO, ESPERA_MS, MAXIMO_DIA } from './limites.js';

const DIA = '2026-11-16';

test('la primera vez se puede mandar y se guarda la cuenta', () => {
  const r = decidirPersona(null, 1000, DIA);
  assert.deepEqual(r, { ok: true, guardar: { dia: DIA, cuenta: 1, ultimo: 1000 } });
});
test('no se puede mandar dos veces en el mismo minuto', () => {
  assert.equal(decidirPersona({ dia: DIA, cuenta: 1, ultimo: 1000 }, 1000 + ESPERA_MS - 1, DIA).ok, false);
  assert.equal(decidirPersona({ dia: DIA, cuenta: 1, ultimo: 1000 }, 1000 + ESPERA_MS, DIA).ok, true);
});
test(`máximo ${MAXIMO_DIA} por día para la misma persona, y al otro día se reinicia`, () => {
  const lleno = { dia: DIA, cuenta: MAXIMO_DIA, ultimo: 0 };
  assert.equal(decidirPersona(lleno, ESPERA_MS * 10, DIA).ok, false);
  assert.equal(decidirPersona(lleno, ESPERA_MS * 10, '2026-11-17').ok, true);
});
test('los topes del sitio están separados: llenar "contraseña" no bloquea "verificar"', () => {
  assert.equal(decidirSitio('contrasena', TOPE_SITIO.contrasena), false);
  assert.equal(decidirSitio('verificar', 0), true);
  assert.equal(decidirSitio('verificar', TOPE_SITIO.verificar - 1), true);
  assert.equal(decidirSitio('verificar', TOPE_SITIO.verificar), false);
});
test('entre los dos topes no se pasa del límite diario de Gmail (~500)', () => {
  assert.ok(TOPE_SITIO.verificar + TOPE_SITIO.contrasena <= 450);
});
test('un tipo de correo inventado nunca se manda', () => {
  assert.equal(decidirSitio('spam', 0), false);
});

test('las variantes de un mismo Gmail cuentan como una sola bandeja', () => {
  const base = 'anaperez@gmail.com';
  for (const v of ['anaperez@gmail.com', 'Ana.Perez@gmail.com', 'anaperez+1@gmail.com', 'a.n.a.perez+spam@GMAIL.com', 'anaperez@googlemail.com']) {
    assert.equal(gmailCanonico(v), base, v);
  }
  assert.notEqual(gmailCanonico('otra@gmail.com'), base);
  assert.equal(gmailCanonico('ana.perez@empresa.com'), 'ana.perez@empresa.com'); // fuera de Gmail los puntos sí importan
});
