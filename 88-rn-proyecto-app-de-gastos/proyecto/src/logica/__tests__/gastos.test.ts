// Pruebas de la LÓGICA: sin pantalla ni teléfono, en milisegundos.
import {
  agregar, crearGasto, dinero, existeElDia, hoyISO, inicioDeSemana, leerValor, problemasDe, quitar, totalDeLaSemana,
  type Gasto,
} from '../gastos';

const HOY = '2026-11-18'; // un miércoles
const bien = { tipo: 'lavado', valor: 30, fecha: HOY };
const g = (id: string, tipo: Gasto['tipo'], valor: number, fecha: string): Gasto => ({ id, tipo, valor, fecha });

describe('leer lo que escribe la persona', () => {
  test('con coma, como en Brasil', () => expect(leerValor('12,50')).toBe(12.5));
  test('vacío o letras no son un número', () => {
    expect(leerValor('')).toBeNaN();
    expect(leerValor('abc')).toBeNaN();
  });
  test('hoy, con la fecha del teléfono', () => expect(hoyISO(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05'));
});

describe('las puertas y ventanas', () => {
  test('un gasto bien armado no tiene problemas', () => expect(problemasDe(bien, HOY)).toEqual([]));
  test('valor 0, negativo o vacío', () => {
    for (const valor of [0, -5, NaN]) expect(problemasDe({ ...bien, valor }, HOY)).toEqual(['Escribe un valor mayor que 0']);
  });
  test('un tipo inventado', () => expect(problemasDe({ ...bien, tipo: 'casino' }, HOY)).toEqual(['Elige un tipo de gasto']));
  test('una fecha que no existe', () => {
    expect(existeElDia('2026-02-31')).toBe(false);
    expect(existeElDia('2028-02-29')).toBe(true);
    expect(problemasDe({ ...bien, fecha: '18/11/2026' }, HOY)).toHaveLength(1);
  });
  test('una fecha en el futuro', () => expect(problemasDe({ ...bien, fecha: '2026-11-19' }, HOY)).toEqual(['La fecha no puede ser en el futuro']));
  test('todo mal a la vez: todos los problemas juntos', () => expect(problemasDe({ tipo: '', valor: 0, fecha: 'ayer' }, HOY)).toHaveLength(3));
});

describe('la lista', () => {
  test('crear redondea los centavos', () => expect(crearGasto({ ...bien, valor: 10.005 }, 'x').valor).toBe(10.01));
  test('agregar no toca la original y deja lo más nuevo arriba', () => {
    const antes = [g('a', 'peaje', 5, '2026-11-10')];
    const despues = agregar(antes, g('b', 'lavado', 30, '2026-11-18'));
    expect(antes).toHaveLength(1);
    expect(despues.map((x) => x.id)).toEqual(['b', 'a']);
  });
  test('del mismo día, el que acabas de anotar queda arriba', () => {
    const lista = agregar(agregar([], g('primero', 'lavado', 30, HOY)), g('segundo', 'lavado', 12, HOY));
    expect(lista.map((x) => x.id)).toEqual(['segundo', 'primero']);
  });
  test('quitar', () => expect(quitar([g('a', 'peaje', 5, HOY), g('b', 'otro', 1, HOY)], 'a').map((x) => x.id)).toEqual(['b']));
});

describe('el total de la semana', () => {
  test('la semana empieza el lunes', () => {
    expect(inicioDeSemana('2026-11-18')).toBe('2026-11-16'); // miércoles → lunes
    expect(inicioDeSemana('2026-11-22')).toBe('2026-11-16'); // domingo → el lunes de antes
    expect(inicioDeSemana('2026-11-16')).toBe('2026-11-16'); // lunes → el mismo
  });
  test('suma solo los de esta semana', () => {
    const lista = [g('a', 'peaje', 0.1, '2026-11-16'), g('b', 'peaje', 0.2, HOY), g('c', 'lavado', 30, '2026-11-15')];
    expect(totalDeLaSemana(lista, HOY)).toEqual({ total: 0.3, cantidad: 2 });
  });
});

test('el dinero como en Brasil', () => {
  expect(dinero(30)).toBe('R$ 30,00');
  expect(dinero(1234.5)).toBe('R$ 1.234,50');
  expect(dinero(0)).toBe('R$ 0,00');
});
