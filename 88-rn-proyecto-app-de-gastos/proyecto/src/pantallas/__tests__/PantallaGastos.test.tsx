// Pruebas de la PANTALLA entera, con el repositorio en memoria: anotar, ver el total, borrar y que se guarde.
import { render, screen, userEvent } from '@testing-library/react-native';
import { crearRepositorioMemoria } from '../../datos/repositorio';
import { PantallaGastos } from '../PantallaGastos';

// En las pruebas no hay teléfono: los bordes seguros se simulan (la librería trae este reemplazo).
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

const HOY = '2026-11-18';

async function anotar(persona: ReturnType<typeof userEvent.setup>, tipo: string, valor: string) {
  await persona.press(screen.getByRole('button', { name: tipo }));
  await persona.type(screen.getByLabelText('Valor'), valor);
  await persona.press(screen.getByRole('button', { name: 'Guardar' }));
}

test('sin gastos, lo dice en vez de mostrar una lista vacía', async () => {
  await render(<PantallaGastos repositorio={crearRepositorioMemoria()} hoy={HOY} />);
  expect(await screen.findByText('Todavía no anotaste gastos')).toBeOnTheScreen();
  expect(screen.getByText('R$ 0,00')).toBeOnTheScreen();
});

test('anotar dos gastos: aparecen, el total suma y quedan guardados', async () => {
  const repositorio = crearRepositorioMemoria();
  const persona = userEvent.setup();
  await render(<PantallaGastos repositorio={repositorio} hoy={HOY} />);
  await screen.findByText('Todavía no anotaste gastos');

  await anotar(persona, 'lavado', '30');
  await anotar(persona, 'peaje', '5,40');

  expect(screen.getByText('R$ 35,40')).toBeOnTheScreen();
  expect(screen.getByText('2 gastos')).toBeOnTheScreen();
  expect(repositorio.guardado().map((g) => g.tipo).sort()).toEqual(['lavado', 'peaje']);
});

test('lo guardado vuelve al abrir, y un gasto de la semana pasada no suma', async () => {
  const repositorio = crearRepositorioMemoria([
    { id: 'a', tipo: 'combustible', valor: 150, fecha: '2026-11-17' },
    { id: 'b', tipo: 'lavado', valor: 30, fecha: '2026-11-10' },
  ]);
  await render(<PantallaGastos repositorio={repositorio} hoy={HOY} />);

  // Las dos tarjetas vuelven (se buscan por su botón: "combustible" también es un botón del formulario).
  expect(await screen.findByRole('button', { name: 'Borrar combustible de R$ 150,00' })).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Borrar lavado de R$ 30,00' })).toBeOnTheScreen();
  // El resumen solo cuenta esta semana: 150, no 180.
  expect(screen.getByText('1 gasto')).toBeOnTheScreen();
  expect(screen.queryByText('R$ 180,00')).toBeNull();
});

test('borrar: desaparece de la pantalla y del teléfono', async () => {
  const repositorio = crearRepositorioMemoria([{ id: 'a', tipo: 'peaje', valor: 5, fecha: HOY }]);
  const persona = userEvent.setup();
  await render(<PantallaGastos repositorio={repositorio} hoy={HOY} />);

  await persona.press(await screen.findByRole('button', { name: 'Borrar peaje de R$ 5,00' }));

  expect(screen.getByText('Todavía no anotaste gastos')).toBeOnTheScreen();
  expect(repositorio.guardado()).toEqual([]);
});
