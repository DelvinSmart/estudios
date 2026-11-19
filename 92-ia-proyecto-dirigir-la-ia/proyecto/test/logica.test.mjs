// Las pruebas de la lógica, escritas DESDE EL PLAN (la sección 8 y las puertas y ventanas), antes que el código.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoDe, hechoHoy, ordenar, problemasDe, sumarMeses, textoDeFalta } from '../src/logica.mjs';

// El ejemplo del plan: un aceite de cada 5.000 km o 6 meses, hecho a los 80.000 km el 1 de agosto.
const aceite = { id: 'a', nombre: 'Cambio de aceite', cadaKm: 5000, cadaMeses: 6, ultimoKm: 80000, ultimaFecha: '2026-08-01' };

test('el plan: a los 84.700 km, pronto (faltan 300 km)', () => {
  const e = estadoDe(aceite, 84700, '2026-11-18');
  assert.equal(e.estado, 'pronto');
  assert.equal(e.faltanKm, 300);
});

test('el plan: a los 85.100 km, vencido', () => {
  assert.equal(estadoDe(aceite, 85100, '2026-11-18').estado, 'vencido');
});

test('el plan: el 2 de febrero, vencido aunque no llegó a los km', () => {
  const e = estadoDe(aceite, 82000, '2027-02-02');
  assert.equal(e.estado, 'vencido');
  assert.equal(e.porQue, 'fecha');
});

test('al día', () => {
  assert.equal(estadoDe(aceite, 81000, '2026-09-01').estado, 'al día');
});

test('pronto también por la fecha (menos de 15 días)', () => {
  const e = estadoDe(aceite, 81000, '2027-01-20');
  assert.equal(e.estado, 'pronto');
  assert.equal(e.faltanDias, 12);
});

test('solo por km (las llantas): sin meses', () => {
  const llantas = { ...aceite, nombre: 'Rotar llantas', cadaKm: 10000, cadaMeses: null };
  assert.equal(estadoDe(llantas, 85000, '2030-01-01').estado, 'al día');
});

test('solo por fecha (el seguro): sin km', () => {
  const seguro = { ...aceite, nombre: 'Seguro', cadaKm: null, cadaMeses: 12 };
  assert.equal(estadoDe(seguro, 999999, '2027-07-20').estado, 'pronto');
});

test('fechas difíciles: el 31 de enero más un mes es el fin de febrero', () => {
  assert.equal(sumarMeses('2026-01-31', 1), '2026-02-28');
  assert.equal(sumarMeses('2028-01-31', 1), '2028-02-29'); // bisiesto
  assert.equal(sumarMeses('2026-08-31', 6), '2027-02-28');
  assert.equal(sumarMeses('2026-11-15', 3), '2027-02-15'); // cambia de año
});

test('el texto de lo que falta', () => {
  assert.equal(textoDeFalta(estadoDe(aceite, 84700, '2026-11-18')), 'faltan 300 km');
  assert.equal(textoDeFalta(estadoDe(aceite, 85100, '2026-11-18')), 'se pasó por 100 km');
  assert.equal(textoDeFalta(estadoDe(aceite, 81000, '2027-01-20')), 'faltan 12 días');
  assert.equal(textoDeFalta(estadoDe(aceite, 82000, '2027-02-04')), 'venció hace 3 días');
});

// Encontrado MIRANDO LA APP: "faltan 14300 km" se lee mal. En Brasil se escribe 14.300.
test('los km con punto de miles', () => {
  const filtro = { ...aceite, cadaKm: 15000, cadaMeses: null, ultimoKm: 84000 };
  assert.equal(textoDeFalta(estadoDe(filtro, 84700, '2026-11-18')), 'faltan 14.300 km');
  assert.equal(textoDeFalta(estadoDe(aceite, 86234, '2026-11-18')), 'se pasó por 1.234 km');
});

// Encontrado en la REVISIÓN (no estaba en el plan): justo en el borde decía "se pasó por 0 km" y "venció hace 0 días".
test('justo en el borde: toca hoy', () => {
  assert.equal(textoDeFalta(estadoDe(aceite, 85000, '2026-11-18')), 'toca hoy');
  assert.equal(textoDeFalta(estadoDe(aceite, 81000, '2027-02-01')), 'toca hoy');
});

test('hecho hoy: queda con los km y la fecha de hoy, y dos veces es lo mismo', () => {
  const una = hechoHoy(aceite, 85100, '2026-11-18');
  assert.deepEqual([una.ultimoKm, una.ultimaFecha], [85100, '2026-11-18']);
  assert.deepEqual(hechoHoy(una, 85100, '2026-11-18'), una);
  assert.equal(aceite.ultimoKm, 80000, 'no cambia el original');
});

test('lo vencido primero, después lo pronto, después lo que está al día', () => {
  const lista = [
    { ...aceite, id: 'al-dia', ultimoKm: 84000 },
    { ...aceite, id: 'vencido', ultimoKm: 79000 },
    { ...aceite, id: 'pronto', ultimoKm: 79800 },
  ];
  assert.deepEqual(ordenar(lista, 84700, '2026-11-18').map((m) => m.id), ['vencido', 'pronto', 'al-dia']);
});

test('las puertas y ventanas al anotar uno', () => {
  const bien = { nombre: 'Filtro de aire', cadaKm: '10000', cadaMeses: '12', ultimoKm: '80000', ultimaFecha: '2026-08-01' };
  assert.deepEqual(problemasDe(bien, 84700, '2026-11-18'), []);
  assert.deepEqual(problemasDe({ ...bien, nombre: '  ' }, 84700, '2026-11-18'), ['Escribe qué mantenimiento es']);
  assert.deepEqual(problemasDe({ ...bien, cadaKm: '', cadaMeses: '' }, 84700, '2026-11-18'), ['Pon cada cuántos km o cada cuántos meses (o los dos)']);
  assert.deepEqual(problemasDe({ ...bien, cadaKm: '-5' }, 84700, '2026-11-18'), ['Los km tienen que ser un número mayor que 0']);
  assert.deepEqual(problemasDe({ ...bien, ultimoKm: '90000' }, 84700, '2026-11-18'), ['El último cambio no puede tener más km que el carro hoy']);
  assert.deepEqual(problemasDe({ ...bien, ultimaFecha: '2026-12-01' }, 84700, '2026-11-18'), ['La fecha no puede ser en el futuro']);
  assert.deepEqual(problemasDe({ ...bien, ultimaFecha: '2026-02-30' }, 84700, '2026-11-18'), ['La fecha tiene que ser un día que exista']);
});

// Encontrado en la REVISIÓN: en JavaScript, null >= 0 es true. El "último km" vacío pasaba como si fuera 0.
test('el último km vacío no pasa como 0', () => {
  const bien = { nombre: 'Filtro de aire', cadaKm: '10000', cadaMeses: '12', ultimoKm: '80000', ultimaFecha: '2026-08-01' };
  assert.deepEqual(problemasDe({ ...bien, ultimoKm: '' }, 84700, '2026-11-18'), ['Escribe los km del último cambio']);
  // Si va solo por meses (el seguro), los km no hacen falta.
  assert.deepEqual(problemasDe({ ...bien, cadaKm: '', ultimoKm: '' }, 84700, '2026-11-18'), []);
});
