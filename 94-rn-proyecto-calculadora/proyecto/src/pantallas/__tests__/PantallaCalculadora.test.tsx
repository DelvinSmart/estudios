// Pruebas de la PANTALLA entera: tocar teclas como una persona y mirar el visor.
import { render, screen, userEvent } from '@testing-library/react-native';
import { PantallaCalculadora } from '../PantallaCalculadora';

// En las pruebas no hay teléfono: los bordes seguros se simulan (la librería trae este reemplazo).
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

// Se toca por la etiqueta que lee el lector de pantalla: así la prueba también revisa la accesibilidad.
async function tocar(...etiquetas: string[]) {
  const persona = userEvent.setup();
  for (const e of etiquetas) await persona.press(screen.getByRole('button', { name: e }));
}

const visor = () => screen.getByTestId('visor');

test('empieza en 0', async () => {
  await render(<PantallaCalculadora />);
  expect(visor()).toHaveTextContent('0');
});

test('0,1 + 0,2 = 0,3 tocando las teclas', async () => {
  await render(<PantallaCalculadora />);
  await tocar('0', 'coma', '1', 'sumar', '0', 'coma', '2', 'igual');
  expect(visor()).toHaveTextContent('0,3');
});

test('el operador elegido se marca, y se apaga al escribir el segundo número', async () => {
  await render(<PantallaCalculadora />);
  await tocar('2', 'multiplicar');
  expect(screen.getByRole('button', { name: 'multiplicar' })).toBeSelected();
  await tocar('3');
  expect(screen.getByRole('button', { name: 'multiplicar' })).not.toBeSelected();
});

test('dividir entre 0 avisa, y C vuelve a empezar', async () => {
  await render(<PantallaCalculadora />);
  await tocar('1', 'dividir', '0', 'igual');
  expect(visor()).toHaveTextContent('No se puede dividir entre 0');
  await tocar('borrar todo');
  expect(visor()).toHaveTextContent('0');
});

test('el porcentaje para un descuento: 200 − 10 % = 180', async () => {
  await render(<PantallaCalculadora />);
  await tocar('2', '0', '0', 'restar', '1', '0', 'por ciento', 'igual');
  expect(visor()).toHaveTextContent('180');
});

test('los miles con punto en el visor', async () => {
  await render(<PantallaCalculadora />);
  await tocar('1', '2', '3', '4', '5');
  expect(visor()).toHaveTextContent('12.345');
});
