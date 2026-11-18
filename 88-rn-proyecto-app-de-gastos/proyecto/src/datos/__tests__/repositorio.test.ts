// Pruebas del REPOSITORIO con un AsyncStorage de mentira: guarda en un objeto y solo acepta texto.
import { CLAVE, crearRepositorioTelefono, type AlmacenDeTexto } from '../repositorio';

function almacenDeMentira(): AlmacenDeTexto & { datos: Record<string, string> } {
  const datos: Record<string, string> = {};
  return {
    datos,
    async getItem(clave) { return clave in datos ? datos[clave] : null; },
    async setItem(clave, valor) {
      if (typeof valor !== 'string') throw new Error('AsyncStorage solo guarda texto');
      datos[clave] = valor;
    },
  };
}

const gasto = { id: 'a', tipo: 'lavado' as const, valor: 30, fecha: '2026-11-18' };

test('la primera vez, la lista está vacía', async () => {
  expect(await crearRepositorioTelefono(almacenDeMentira()).leer()).toEqual([]);
});

test('guarda como texto y lee lo mismo (como si se cerrara y abriera la app)', async () => {
  const almacen = almacenDeMentira();
  await crearRepositorioTelefono(almacen).guardar([gasto]);
  expect(typeof almacen.datos[CLAVE]).toBe('string');
  expect(await crearRepositorioTelefono(almacen).leer()).toEqual([gasto]);
});

test('un texto roto no traba la app: empieza vacía', async () => {
  const almacen = almacenDeMentira();
  almacen.datos[CLAVE] = '{roto';
  expect(await crearRepositorioTelefono(almacen).leer()).toEqual([]);
});

test('algo que no es una lista tampoco', async () => {
  const almacen = almacenDeMentira();
  almacen.datos[CLAVE] = '{"no":"soy una lista"}';
  expect(await crearRepositorioTelefono(almacen).leer()).toEqual([]);
});
