import { apretar, formatear, INICIAL, redondear, type Estado, type Tecla } from '../calculadora';

// Toca varias teclas seguidas y devuelve lo que se ve en el visor.
function tocar(...teclas: Tecla[]): string {
  const final = teclas.reduce<Estado>((e, t) => apretar(e, t), INICIAL);
  return final.error ?? formatear(final.pantalla);
}

describe('escribir números', () => {
  test('empieza en 0', () => expect(tocar()).toBe('0'));
  test('el 0 de adelante se reemplaza', () => expect(tocar('0', '7')).toBe('7'));
  test('con coma decimal', () => expect(tocar('1', ',', '5')).toBe('1,5'));
  test('empezar con coma es 0,', () => expect(tocar(',', '5')).toBe('0,5'));
  test('una coma de más se ignora', () => expect(tocar('1', ',', '2', ',', '3')).toBe('1,23'));
  test('punto de miles, como en Brasil', () => expect(tocar('1', '2', '3', '4', '5', '6', '7')).toBe('1.234.567'));
  test('no más de 12 cifras', () => expect(tocar(...('1234567890123'.split('') as Tecla[]))).toBe('123.456.789.012'));
});

describe('las cuatro operaciones', () => {
  test('sumar', () => expect(tocar('2', '+', '3', '=')).toBe('5'));
  test('restar y dar negativo', () => expect(tocar('3', '−', '8', '=')).toBe('-5'));
  test('multiplicar', () => expect(tocar('6', '×', '7', '=')).toBe('42'));
  test('dividir con decimales', () => expect(tocar('1', '0', '÷', '4', '=')).toBe('2,5'));
});

describe('las decisiones del plan (sección 4)', () => {
  test('de izquierda a derecha: 2 + 3 × 4 = 20', () => expect(tocar('2', '+', '3', '×', '4', '=')).toBe('20'));
  test('al tocar el segundo operador ya muestra el resultado parcial', () => expect(tocar('2', '+', '3', '×')).toBe('5'));
  test('0,1 + 0,2 = 0,3', () => expect(tocar('0', ',', '1', '+', '0', ',', '2', '=')).toBe('0,3'));
  test('dividir entre 0 avisa', () => expect(tocar('1', '÷', '0', '=')).toBe('No se puede dividir entre 0'));
  test('después del aviso, un número empieza de nuevo', () => expect(tocar('1', '÷', '0', '=', '7')).toBe('7'));
  test('un resultado demasiado grande avisa', () =>
    expect(tocar('9', '9', '9', '9', '9', '9', '×', '9', '9', '9', '9', '9', '9', '9', '=')).toBe('El número es muy grande'));
  test('dos operadores seguidos: vale el último', () => expect(tocar('5', '+', '×', '3', '=')).toBe('15'));
  test('5 + = usa el mismo número', () => expect(tocar('5', '+', '=')).toBe('10'));
  test('= otra vez no hace nada', () => expect(tocar('2', '+', '3', '=', '=')).toBe('5'));
  test('después de un resultado, un número nuevo empieza otra cuenta', () => expect(tocar('2', '+', '3', '=', '4')).toBe('4'));
  test('después de un resultado, un operador sigue la cuenta', () => expect(tocar('2', '+', '3', '=', '×', '2', '=')).toBe('10'));
});

describe('las teclas de función', () => {
  test('C borra todo', () => expect(tocar('2', '+', '3', 'C', '=')).toBe('0'));
  test('⌫ borra el último', () => expect(tocar('1', '2', '3', '⌫')).toBe('12'));
  test('⌫ hasta vaciar deja 0', () => expect(tocar('7', '⌫')).toBe('0'));
  test('⌫ después de un resultado no hace nada', () => expect(tocar('2', '+', '3', '=', '⌫')).toBe('5'));
  test('± cambia el signo', () => expect(tocar('8', '±')).toBe('-8'));
  test('± dos veces vuelve', () => expect(tocar('8', '±', '±')).toBe('8'));
  test('± en 0 no hace nada', () => expect(tocar('±')).toBe('0'));
  test('% solo divide entre 100', () => expect(tocar('5', '0', '%')).toBe('0,5'));
  test('200 + 10 % es el 10% de 200', () => expect(tocar('2', '0', '0', '+', '1', '0', '%')).toBe('20'));
  test('200 + 10 % = 220', () => expect(tocar('2', '0', '0', '+', '1', '0', '%', '=')).toBe('220'));
  test('en una multiplicación, % divide entre 100', () => expect(tocar('5', '0', '×', '1', '0', '%', '=')).toBe('5'));
});

describe('redondear y formatear', () => {
  test('12 cifras significativas', () => expect(redondear(0.1 + 0.2)).toBe(0.3));
  test('1 ÷ 3', () => expect(tocar('1', '÷', '3', '=')).toBe('0,333333333333'));
  test('sin -0', () => expect(Object.is(redondear(-0), 0)).toBe(true));
  test('formatear un número negativo con miles y decimales', () => expect(formatear('-1234.5')).toBe('-1.234,5'));
  test('formatear mientras escribes la coma', () => expect(formatear('12.')).toBe('12,'));
});

test('apretar no cambia el estado que recibe', () => {
  const antes = { ...INICIAL };
  apretar(INICIAL, '5');
  expect(INICIAL).toEqual(antes);
});
