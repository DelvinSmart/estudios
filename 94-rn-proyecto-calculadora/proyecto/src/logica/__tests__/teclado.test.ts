import { apretar, INICIAL, type Tecla } from '../calculadora';
import { etiquetaDe, FILAS, operadorEncendido, tipoDe } from '../teclado';

test('cinco filas de cuatro teclas', () => {
  expect(FILAS).toHaveLength(5);
  FILAS.forEach((fila) => expect(fila).toHaveLength(4));
});

test('cada tecla aparece una sola vez, y están las 19 de la calculadora', () => {
  const todas = FILAS.flat();
  expect(new Set(todas).size).toBe(todas.length);
  expect(todas).toEqual(expect.arrayContaining(['0', '9', ',', '+', '−', '×', '÷', '=', 'C', '⌫', '%', '±']));
});

test('los tipos', () => {
  expect((['7', ',', '⌫', '+', 'C', '='] as Tecla[]).map(tipoDe)).toEqual(['numero', 'numero', 'numero', 'operador', 'funcion', 'igual']);
});

test('cada tecla que no es un número tiene una etiqueta en español', () => {
  expect(etiquetaDe('÷')).toBe('dividir');
  expect(etiquetaDe('⌫')).toBe('borrar el último');
  expect(etiquetaDe('7')).toBe('7');
  FILAS.flat().filter((t) => !/\d/.test(t)).forEach((t) => expect(etiquetaDe(t)).not.toBe(t));
});

test('el operador se enciende mientras se espera el segundo número', () => {
  const conMas = apretar(apretar(INICIAL, '2'), '+');
  expect(operadorEncendido(conMas)).toBe('+');
  expect(operadorEncendido(apretar(conMas, '3'))).toBeNull();
  expect(operadorEncendido(INICIAL)).toBeNull();
});
