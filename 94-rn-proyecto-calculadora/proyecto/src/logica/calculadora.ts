// LA LÓGICA DE LA CALCULADORA: qué pasa con cada tecla. Sin React ni pantalla: datos que entran, datos que salen.
// Las decisiones de cada caso están en PLAN.md, sección 4, y cada una tiene su prueba.
// No se usa eval: las cuentas las hace calcular(), con cuatro casos claros.

export type Operador = '+' | '−' | '×' | '÷';
export type Digito = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Tecla = Digito | ',' | Operador | '=' | 'C' | '⌫' | '%' | '±';

export interface Estado {
  /** El número del visor, como texto con punto decimal ("1234.5"). El formato bonito lo hace formatear(). */
  pantalla: string;
  /** El primer número de la cuenta, mientras se escribe el segundo. */
  guardado: number | null;
  operador: Operador | null;
  /** true: el próximo dígito empieza un número nuevo (después de un operador o de un resultado). */
  nuevoNumero: boolean;
  /** Un aviso para la persona ("No se puede dividir entre 0"), o null. */
  error: string | null;
}

export const INICIAL: Estado = { pantalla: '0', guardado: null, operador: null, nuevoNumero: true, error: null };

export const MAX_CIFRAS = 12;
const LIMITE = 1e12; // un resultado de 13 cifras o más no entra en el visor

export const DIVIDIR_ENTRE_CERO = 'No se puede dividir entre 0';
export const MUY_GRANDE = 'El número es muy grande';

/** 0,1 + 0,2 da 0,30000000000000004 en cualquier computadora (por cómo guarda los decimales). Con 12 cifras, 0,3. */
export function redondear(x: number): number {
  const r = Number(x.toPrecision(MAX_CIFRAS));
  return Object.is(r, -0) ? 0 : r;
}

/** Un número a texto con punto decimal, sin notación científica ("1e-7"). */
function aTexto(x: number): string {
  const r = redondear(x);
  if (r !== 0 && Math.abs(r) < 1e-6) return r.toFixed(MAX_CIFRAS).replace(/0+$/, '').replace(/\.$/, '');
  return String(r);
}

/** "-1234.5" → "-1.234,5": punto de miles y coma decimal, como en Brasil. */
export function formatear(pantalla: string): string {
  const negativo = pantalla.startsWith('-');
  const [entero, decimal] = pantalla.replace('-', '').split('.');
  const conMiles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (negativo ? '-' : '') + conMiles + (decimal !== undefined ? ',' + decimal : '');
}

const cifras = (pantalla: string) => pantalla.replace(/[-.]/g, '').length;

/** Las cuatro cuentas. Devuelve el número, o el aviso si no se puede. */
export function calcular(a: number, operador: Operador, b: number): number | string {
  let r: number;
  if (operador === '+') r = a + b;
  else if (operador === '−') r = a - b;
  else if (operador === '×') r = a * b;
  else {
    if (b === 0) return DIVIDIR_ENTRE_CERO;
    r = a / b;
  }
  r = redondear(r);
  return Math.abs(r) >= LIMITE ? MUY_GRANDE : r;
}

/** El resultado de una cuenta, como estado nuevo (o el aviso, si no se pudo). */
function conResultado(resultado: number | string, sigue: Partial<Estado>): Estado {
  if (typeof resultado === 'string') return { ...INICIAL, error: resultado };
  return { ...INICIAL, pantalla: aTexto(resultado), ...sigue };
}

const esDigito = (t: Tecla): t is Digito => t.length === 1 && t >= '0' && t <= '9';
const esOperador = (t: Tecla): t is Operador => t === '+' || t === '−' || t === '×' || t === '÷';

/** Qué pasa cuando se toca una tecla. Devuelve un estado NUEVO: nunca cambia el que recibe. */
export function apretar(e: Estado, t: Tecla): Estado {
  // Después de un aviso, cualquier tecla empieza de cero (y la tecla cuenta, si es un número).
  if (e.error) return t === 'C' || t === '⌫' ? INICIAL : apretar(INICIAL, t);

  if (esDigito(t)) {
    if (e.nuevoNumero) return { ...e, pantalla: t, nuevoNumero: false };
    if (cifras(e.pantalla) >= MAX_CIFRAS) return e;
    return { ...e, pantalla: e.pantalla === '0' ? t : e.pantalla + t };
  }

  if (t === ',') {
    if (e.nuevoNumero) return { ...e, pantalla: '0.', nuevoNumero: false };
    return e.pantalla.includes('.') ? e : { ...e, pantalla: e.pantalla + '.' };
  }

  const actual = Number(e.pantalla);

  if (esOperador(t)) {
    // 5 + × → vale el último operador.
    if (e.operador && e.nuevoNumero) return { ...e, operador: t };
    // 2 + 3 × → primero resuelve 2 + 3 (de izquierda a derecha) y muestra 5.
    if (e.operador && e.guardado !== null) {
      const r = calcular(e.guardado, e.operador, actual);
      return conResultado(r, { guardado: typeof r === 'number' ? r : null, operador: t, nuevoNumero: true });
    }
    return { ...e, guardado: actual, operador: t, nuevoNumero: true };
  }

  if (t === '=') {
    if (!e.operador || e.guardado === null) return e; // = otra vez: no hace nada
    // 5 + = → la pantalla todavía muestra 5, y ese es el segundo número.
    return conResultado(calcular(e.guardado, e.operador, actual), { nuevoNumero: true });
  }

  if (t === 'C') return INICIAL;

  if (t === '⌫') {
    if (e.nuevoNumero) return e; // un resultado no se "escribió": no se borra de a uno
    const sin = e.pantalla.slice(0, -1);
    return { ...e, pantalla: sin === '' || sin === '-' ? '0' : sin };
  }

  if (t === '±') {
    if (actual === 0) return e;
    return { ...e, pantalla: e.pantalla.startsWith('-') ? e.pantalla.slice(1) : '-' + e.pantalla };
  }

  // '%': en una suma o resta, el porcentaje del primer número (200 + 10 % → 20); si no, divide entre 100.
  const porcentaje = (e.operador === '+' || e.operador === '−') && e.guardado !== null ? (e.guardado * actual) / 100 : actual / 100;
  return { ...e, pantalla: aTexto(porcentaje), nuevoNumero: false };
}
