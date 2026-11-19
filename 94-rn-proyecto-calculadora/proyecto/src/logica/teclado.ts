// EL TECLADO COMO DATOS: qué teclas hay, en qué orden, de qué tipo y cómo se leen en voz alta.
// La pantalla solo recorre esta lista: para cambiar el orden de las teclas no se toca ningún componente.
import type { Estado, Operador, Tecla } from './calculadora';

export const FILAS: Tecla[][] = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['⌫', '0', ',', '='],
];

export type TipoDeTecla = 'numero' | 'funcion' | 'operador' | 'igual';

export function tipoDe(t: Tecla): TipoDeTecla {
  if (t === '=') return 'igual';
  if (t === '+' || t === '−' || t === '×' || t === '÷') return 'operador';
  if (t === 'C' || t === '±' || t === '%') return 'funcion';
  return 'numero'; // los dígitos, la coma y ⌫
}

// Lo que lee el lector de pantalla (VoiceOver en iPhone, TalkBack en Android). "÷" leído en voz alta no dice nada.
const ETIQUETAS: Partial<Record<Tecla, string>> = {
  '+': 'sumar', '−': 'restar', '×': 'multiplicar', '÷': 'dividir', '=': 'igual',
  C: 'borrar todo', '⌫': 'borrar el último', '±': 'cambiar el signo', '%': 'por ciento', ',': 'coma',
};

export const etiquetaDe = (t: Tecla): string => ETIQUETAS[t] ?? t;

/** El operador que se marca encendido: el que se acaba de tocar, mientras se espera el segundo número. */
export function operadorEncendido(e: Estado): Operador | null {
  return e.nuevoNumero && !e.error ? e.operador : null;
}
