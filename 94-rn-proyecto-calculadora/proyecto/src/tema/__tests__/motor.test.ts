import { ANCHO_DE_CIFRA, anchoDelVisor, claro, ladoDeTecla, letra, letraDelVisor, oscuro } from '../motor';

test('los dos temas tienen las mismas piezas', () => expect(Object.keys(claro).sort()).toEqual(Object.keys(oscuro).sort()));

test('la letra del visor se achica con números largos', () => {
  expect(letraDelVisor('1.234', 380)).toBe(letra.visorGrande);
  const mediano = letraDelVisor('123.456.789', 380); // a lo sumo 56, y menos si no entra
  expect(mediano).toBeLessThan(letra.visorGrande);
  expect(mediano).toBeGreaterThan(letra.visorChico);
  expect(letraDelVisor('-0,333333333333', 380)).toBe(letra.visorChico);
});

test('en un iPhone SE (320 de ancho) entran cuatro teclas por fila', () => {
  const lado = ladoDeTecla(320);
  expect(lado * 4 + 14 * 3 + 20 * 2).toBeLessThanOrEqual(320);
  expect(lado).toBeGreaterThanOrEqual(56); // y siguen siendo fáciles de tocar con el dedo
});

test('en una tableta no se estira', () => expect(ladoDeTecla(1024)).toBe(ladoDeTecla(420)));

// Encontrado mirando la app en 320 de ancho: "-0,333333333333" salía cortado con "…".
// adjustsFontSizeToFit solo funciona en el iPhone; en Android y en la web, el tamaño hay que calcularlo.
test('en un iPhone SE, el número más largo entra sin cortarse', () => {
  const texto = '-0,333333333333';
  const ancho = anchoDelVisor(320);
  expect(texto.length * ANCHO_DE_CIFRA * letraDelVisor(texto, ancho)).toBeLessThanOrEqual(ancho);
});
