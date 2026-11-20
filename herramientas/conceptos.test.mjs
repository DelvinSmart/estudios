// Ningún ejercicio usa una pieza (un método, una sintaxis) que todavía no se mostró. Ver revisar-conceptos.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revisarConceptos } from './revisar-conceptos.mjs';

test('cada ejercicio usa solo piezas que ya se mostraron antes', () => {
  const { revisados, problemas } = revisarConceptos();
  assert.ok(revisados > 500, `revisó muy pocos ejercicios (${revisados}): ¿cambió el formato?`);
  assert.deepEqual(problemas.map((p) => `${p.curso} · clase ${p.id} · ${p.f} · "${p.titulo}" usa sin explicar: ${p.faltan.join(', ')}`), []);
});
