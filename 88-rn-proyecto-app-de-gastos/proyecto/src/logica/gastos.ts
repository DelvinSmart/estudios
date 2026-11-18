// LA LÓGICA: las reglas y las cuentas de los gastos. Sin pantalla, sin React, sin el teléfono:
// solo datos que entran y datos que salen. Por eso se prueba en milisegundos.

export const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'] as const;
export type Tipo = (typeof TIPOS)[number];

export interface Gasto {
  id: string;
  tipo: Tipo;
  valor: number;
  fecha: string; // AAAA-MM-DD
}

/** Lo que escribe la persona en el formulario, antes de ser un gasto. */
export interface DatosGasto {
  tipo: string;
  valor: number;
  fecha: string;
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** La fecha de hoy como AAAA-MM-DD, con la hora del teléfono (no la de Londres). */
export function hoyISO(ahora: Date = new Date()): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`;
}

/** "12,50" → 12.5. En Brasil se escribe con coma; Number() necesita punto. Vacío o letras → NaN. */
export function leerValor(texto: string): number {
  const limpio = texto.trim().replace(',', '.');
  return limpio === '' ? NaN : Number(limpio);
}

/** ¿Existe ese día? "2026-02-31" tiene la forma bien, pero no existe. */
export function existeElDia(texto: string): boolean {
  if (!FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}

/** Las puertas y ventanas: la lista de problemas, en español (vacía si está todo bien). */
export function problemasDe(datos: DatosGasto, hoy: string): string[] {
  const problemas: string[] = [];
  if (!(TIPOS as readonly string[]).includes(datos.tipo)) problemas.push('Elige un tipo de gasto');
  if (!(datos.valor > 0)) problemas.push('Escribe un valor mayor que 0');
  else if (datos.valor > 100000) problemas.push('El valor es demasiado grande');
  if (!existeElDia(datos.fecha)) problemas.push('La fecha tiene que ser un día que exista (AAAA-MM-DD)');
  else if (datos.fecha > hoy) problemas.push('La fecha no puede ser en el futuro');
  return problemas;
}

/** Arma el gasto con su id. Solo se llama después de revisar los problemas. */
export function crearGasto(datos: DatosGasto, id: string): Gasto {
  return { id, tipo: datos.tipo as Tipo, valor: Math.round(datos.valor * 100) / 100, fecha: datos.fecha };
}

/** Un id que no se repite, sin servidor: la hora en milisegundos más un pedazo al azar. */
export function nuevoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Cambiar la lista SIN tocar la original (clase 55): React solo se entera de un array nuevo.
// Los más nuevos van arriba, ordenados por fecha. El nuevo entra PRIMERO y sort() es estable:
// así, entre dos gastos del mismo día, el que acabas de anotar queda arriba.
export function agregar(lista: Gasto[], gasto: Gasto): Gasto[] {
  return [gasto, ...lista].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
}

export function quitar(lista: Gasto[], id: string): Gasto[] {
  return lista.filter((g) => g.id !== id);
}

/** El lunes de la semana de "hoy", como AAAA-MM-DD. */
export function inicioDeSemana(hoy: string): string {
  const [a, m, d] = hoy.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  const desdeElLunes = (fecha.getUTCDay() + 6) % 7; // domingo = 6, lunes = 0
  fecha.setUTCDate(fecha.getUTCDate() - desdeElLunes);
  return fecha.toISOString().slice(0, 10);
}

const redondear = (n: number) => Math.round(n * 100) / 100;

/** El total de la semana de hoy (de lunes a hoy), sin los centavos descontrolados de 0.1 + 0.2. */
export function totalDeLaSemana(lista: Gasto[], hoy: string): { total: number; cantidad: number } {
  const lunes = inicioDeSemana(hoy);
  const deEstaSemana = lista.filter((g) => g.fecha >= lunes && g.fecha <= hoy);
  return { total: redondear(deEstaSemana.reduce((s, g) => s + g.valor, 0)), cantidad: deEstaSemana.length };
}

/** 1234.5 → "R$ 1.234,50", como se escribe en Brasil. */
export function dinero(valor: number): string {
  const [entero, centavos] = Math.abs(valor).toFixed(2).split('.');
  const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${valor < 0 ? '-' : ''}R$ ${conPuntos},${centavos}`;
}
