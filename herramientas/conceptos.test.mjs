// Ningún ejercicio usa una pieza (un método, una sintaxis) que todavía no se mostró. Ver revisar-conceptos.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revisarConceptos } from './revisar-conceptos.mjs';

test('cada ejercicio usa solo piezas que ya se explicaron antes (en palabras, no solo en un ejemplo de código)', () => {
  const { revisados, problemas } = revisarConceptos({ explicado: true });
  assert.ok(revisados > 600, `revisó muy pocos ejercicios (${revisados}): ¿cambió el formato?`);
  assert.deepEqual(problemas.map((p) => `${p.curso} · clase ${p.id} · ${p.f} · "${p.titulo}" usa sin explicar: ${p.faltan.join(', ')}`), []);
});
