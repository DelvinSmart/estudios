// EL MOTOR DE DISEÑO: todos los colores, separaciones, formas y letras, en un solo lugar.
// Ningún componente escribe un color o un número de diseño a mano: los "llama" desde aquí.
// Cambiar el verde de toda la app es cambiar una línea.

export const color = {
  fondo: '#0f141b',
  tarjeta: '#18212c',
  borde: '#2b3644',
  texto: '#e6edf3',
  tenue: '#8796aa',
  acento: '#7ee787',
  sobreAcento: '#0f141b', // el texto que va encima del verde
  peligro: '#ff7b72',
} as const;

export const espacio = {
  chico: 8,
  medio: 14,
  grande: 20,
} as const;

export const forma = {
  radio: 14,
  radioChico: 8,
} as const;

export const letra = {
  chica: 14,
  normal: 16,
  grande: 30,
} as const;
