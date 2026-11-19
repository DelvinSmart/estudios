// Pruebas del bloque ```snack (la app de React Native en Expo Snack). Sin internet: se prueba cómo se lee el bloque,
// la dirección del iframe y que solo se le hable a NUESTRO Snack.
//   node --test herramientas/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerSnack, urlSnack, snackListo, datosParaSnack, ORIGEN_SNACK } from '../web/snack.js';

const BLOQUE = `titulo: Un contador
pide: Haz que el botón sume uno
  cada vez que se toca.
--- código
export default function App() { return null; }
--- comprobar
- Se ve el número 0
- [ ] Al tocar "+1", sube a 1
--- solución
export default function App() { return 1; }`;

test('lee el bloque: título, pide de varias líneas, código, lista y solución', () => {
  const s = leerSnack(BLOQUE);
  assert.equal(s.titulo, 'Un contador');
  assert.equal(s.pide, 'Haz que el botón sume uno cada vez que se toca.');
  assert.equal(s.codigo, 'export default function App() { return null; }');
  assert.deepEqual(s.comprobar, ['Se ve el número 0', 'Al tocar "+1", sube a 1']);
  assert.equal(s.solucion, 'export default function App() { return 1; }');
  assert.equal(s.dependencias, '');
});

test('la dirección de Snack: espera los datos, vista web, y el tema de la página', () => {
  const u = new URL(urlSnack({ iframeId: 'abc123', tema: 'light', nombre: 'Un contador' }));
  assert.equal(u.origin, ORIGEN_SNACK);
  assert.equal(u.pathname, '/embedded');
  assert.equal(u.searchParams.get('waitForData'), 'true');
  assert.equal(u.searchParams.get('iframeId'), 'abc123');
  assert.equal(u.searchParams.get('platform'), 'web');
  assert.equal(u.searchParams.get('theme'), 'light');
  assert.equal(u.searchParams.get('name'), 'Un contador');
});

test('solo se le habla a NUESTRO Snack: de snack.expo.dev y con nuestro iframeId', () => {
  const listo = { origin: ORIGEN_SNACK, data: ['expoFrameLoaded', { iframeId: 'abc' }] };
  assert.equal(snackListo(listo, 'abc'), true);
  assert.equal(snackListo({ ...listo, origin: 'https://otro.sitio' }, 'abc'), false, 'otro sitio no recibe el código');
  assert.equal(snackListo(listo, 'xyz'), false, 'otro Snack de la misma página no recibe este código');
  assert.equal(snackListo({ origin: ORIGEN_SNACK, data: 'hola' }, 'abc'), false);
});

test('lo que se le manda: el código y, solo si hay, las dependencias', () => {
  assert.deepEqual(datosParaSnack('abc', 'codigo'), ['expoDataEvent', { iframeId: 'abc', code: 'codigo' }]);
  assert.deepEqual(datosParaSnack('abc', 'codigo', 'react-native-paper@5')[1].dependencies, 'react-native-paper@5');
});
