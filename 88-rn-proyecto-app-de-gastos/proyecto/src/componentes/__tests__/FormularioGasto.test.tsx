// Pruebas del FORMULARIO como lo usa una persona: escribir, tocar y mirar (clase 60).
import { render, screen, userEvent } from '@testing-library/react-native';
import { FormularioGasto } from '../FormularioGasto';

const HOY = '2026-11-18';

test('con un valor bien escrito, avisa hacia arriba con los datos', async () => {
  const alGuardar = jest.fn();
  const persona = userEvent.setup();
  await render(<FormularioGasto hoy={HOY} alGuardar={alGuardar} />);

  await persona.press(screen.getByRole('button', { name: 'lavado' }));
  await persona.type(screen.getByLabelText('Valor'), '30,50');
  await persona.press(screen.getByRole('button', { name: 'Guardar' }));

  expect(alGuardar).toHaveBeenCalledWith({ tipo: 'lavado', valor: 30.5, fecha: HOY });
  expect(screen.getByLabelText('Valor')).toHaveDisplayValue(''); // queda listo para el próximo
});

test('sin valor, no guarda y dice por qué', async () => {
  const alGuardar = jest.fn();
  const persona = userEvent.setup();
  await render(<FormularioGasto hoy={HOY} alGuardar={alGuardar} />);

  await persona.press(screen.getByRole('button', { name: 'Guardar' }));

  expect(alGuardar).not.toHaveBeenCalled();
  expect(screen.getByText('Escribe un valor mayor que 0')).toBeOnTheScreen();
});

test('una fecha en el futuro no se acepta', async () => {
  const alGuardar = jest.fn();
  const persona = userEvent.setup();
  await render(<FormularioGasto hoy={HOY} alGuardar={alGuardar} />);

  await persona.type(screen.getByLabelText('Valor'), '10');
  await persona.clear(screen.getByLabelText('Fecha'));
  await persona.type(screen.getByLabelText('Fecha'), '2026-12-25');
  await persona.press(screen.getByRole('button', { name: 'Guardar' }));

  expect(alGuardar).not.toHaveBeenCalled();
  expect(screen.getByText('La fecha no puede ser en el futuro')).toBeOnTheScreen();
});
