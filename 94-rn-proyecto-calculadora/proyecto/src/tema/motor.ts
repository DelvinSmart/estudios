// EL MOTOR DE DISEÑO: todos los colores, separaciones, formas y letras, en un solo lugar.
// Ningún componente escribe un color o un número de diseño a mano: los "llama" desde aquí.
// Dos juegos de colores con la misma forma (el tipo Colores): el teléfono elige cuál.

export interface Colores {
  fondo: string;
  visor: string; // el número grande
  tenue: string; // el aviso y lo secundario
  numero: string; // el fondo de las teclas de números
  sobreNumero: string;
  funcion: string; // C, ± y %
  sobreFuncion: string;
  operador: string; // + − × ÷ y =
  sobreOperador: string;
}

export const oscuro: Colores = {
  fondo: '#0f141b',
  visor: '#e6edf3',
  tenue: '#8796aa',
  numero: '#18212c',
  sobreNumero: '#e6edf3',
  funcion: '#2b3644',
  sobreFuncion: '#e6edf3',
  operador: '#7ee787',
  sobreOperador: '#0f141b',
};

export const claro: Colores = {
  fondo: '#f5f7fa',
  visor: '#1d232b',
  tenue: '#57606a',
  numero: '#ffffff',
  sobreNumero: '#1d232b',
  funcion: '#d8dee4',
  sobreFuncion: '#1d232b',
  operador: '#1a7f37',
  sobreOperador: '#ffffff',
};

export const espacio = { chico: 8, medio: 14, grande: 20 } as const;

export const forma = {
  /** Las teclas son redondas: el radio es la mitad del lado. */
  redonda: (lado: number) => lado / 2,
  anchoMaximo: 420, // en una tableta, la calculadora no se estira de lado a lado
} as const;

export const letra = { tecla: 30, aviso: 22, visorGrande: 72, visorChico: 40 } as const;

/** Cuánto ocupa una cifra, comparada con el tamaño de la letra (en la letra del sistema, un poco más de la mitad). */
export const ANCHO_DE_CIFRA = 0.62;

/** El ancho donde entra el número: el de la calculadora, menos el aire de los costados. */
export function anchoDelVisor(anchoPantalla: number): number {
  return Math.min(anchoPantalla, forma.anchoMaximo) - espacio.grande * 2;
}

/** El visor achica la letra cuando el número es largo, y nunca la deja más grande de lo que entra en el ancho.
 *  (Encontrado mirando la app en 320 de ancho: adjustsFontSizeToFit solo funciona en el iPhone.) */
export function letraDelVisor(texto: string, ancho: number): number {
  const porLargo = texto.length <= 7 ? letra.visorGrande : texto.length <= 11 ? 56 : letra.visorChico;
  const queEntra = Math.floor(ancho / (texto.length * ANCHO_DE_CIFRA));
  return Math.min(porLargo, queEntra);
}

/** El lado de cada tecla: cuatro por fila con su separación, en el ancho que haya (sin pasarse del máximo). */
export function ladoDeTecla(anchoPantalla: number): number {
  const ancho = Math.min(anchoPantalla, forma.anchoMaximo) - espacio.grande * 2;
  return Math.floor((ancho - espacio.medio * 3) / 4);
}
