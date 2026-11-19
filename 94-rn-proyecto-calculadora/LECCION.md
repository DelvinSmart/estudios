# La calculadora 1: el plano, el motor y la lógica

> 🌎 **En la vida real:** antes de construir una casa, el arquitecto dibuja el plano, elige los materiales y calcula las vigas. Recién después entran los albañiles. Si empiezas por las paredes, la casa sale torcida y no hay forma de enderezarla.

> 🎙️ **El profesor dice:** {{alumno}}, este es el **proyecto estrella** del curso: una calculadora de verdad, que se instala en tu Samsung y en tu iPhone **con un solo código**. Son dos clases. En esta, todo lo que va **antes** de dibujar un botón: el plano, el motor de diseño y las cuentas, con sus pruebas. En la siguiente, la pantalla, el teléfono y la app instalada.

**Por qué una calculadora.** Todo el mundo sabe cómo tiene que funcionar, así que **cada error se nota**. Y parece fácil, pero tiene trampas de verdad: `0,1 + 0,2`, dividir entre cero, qué hacer con `5 + ×`, números que no entran en la pantalla. Es el proyecto perfecto para aprender a hacer las cosas **bien**, sin código espagueti.

**Lo que hay** (en la carpeta `94-rn-proyecto-calculadora/proyecto` de este mismo repositorio):

| Archivo | Qué es |
|---|---|
| `PLAN.md` y `AGENTS.md` | El plano y las reglas, **antes** del código |
| `src/logica/calculadora.ts` | Las cuentas: el estado y qué pasa con cada tecla |
| `src/logica/teclado.ts` | El teclado como datos (clase 95) |
| `src/tema/motor.ts` | El motor de diseño: colores, separaciones, formas y letras |
| `src/componentes/` y `src/pantallas/` | La pantalla (clase 95) |
| `__tests__/` | 56 pruebas con Jest y Testing Library |

```bash
cd estudios/94-rn-proyecto-calculadora/proyecto
npm install
npm test          # 56 en verde
npm run tipos     # TypeScript, sin errores
npm run web       # la calculadora en el navegador
```

## Parte 1. El plano: qué hace, qué no, y las decisiones de las cuentas

Antes de una línea de código, `PLAN.md`. Tiene lo que ya conoces de la clase 88 (qué hace, qué **no** hace, las piezas, cómo sé que funciona), y una sección que en una calculadora es **la más importante**: **las decisiones de las cuentas**.

Toca en tu cabeza `2 + 3 × 4`. ¿Cuánto da? Depende de la calculadora:

- Una **científica** respeta la precedencia (primero la multiplicación): `2 + 12 = 14`.
- Una **de bolsillo** va de **izquierda a derecha**: `5 × 4 = 20`. Al tocar `×`, ya muestra `5`.

Ninguna está "mal": son **decisiones**. El error es no tomarlas, y que la app haga una cosa a veces y otra a veces. El plan las escribe todas en una tabla:

| Caso | Qué decidimos |
|---|---|
| `2 + 3 × 4` | De izquierda a derecha: `20` |
| `0,1 + 0,2` | `0,3` (parte 3) |
| Dividir entre 0 | "No se puede dividir entre 0" |
| Dos operadores seguidos (`5 + ×`) | Vale el último |
| `5 + =` | Usa el mismo número: `10` |
| `=` otra vez | No hace nada |
| `⌫` después de un resultado | No hace nada: el resultado no se "escribió" |
| `200 + 10 %` | El 10% de 200 (`20`), y `=` da `220`: sirve para propinas y descuentos |

**Cada fila de esa tabla se volvió una prueba**, antes del código (parte 5). Y "Lo que NO hace" también se escribió: paréntesis, historial, funciones científicas. Sin esa lista, la calculadora crece para todos lados y nunca se termina.

> 💡 **Idea:** la regla más importante de `AGENTS.md` en este proyecto es **"Nunca `eval`"**. `eval("2+3")` da 5, y parece la forma fácil de hacer una calculadora. Pero `eval` corre **cualquier código**: es una puerta abierta (el curso de seguridad lo explica), y además no te deja decidir nada de la tabla de arriba.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: De izquierda a derecha
lenguaje: js
pide: El plan decidió que la calculadora resuelve **de izquierda a derecha**, como una de bolsillo. Completa `deIzquierdaADerecha(partes)`: recibe una lista como `[2, '+', 3, '×', 4]` (número, operador, número…) y devuelve el resultado yendo de a un operador por vez: `(2 + 3) × 4 = 20`. Los operadores son `'+'`, `'−'`, `'×'` y `'÷'`.
--- código
function deIzquierdaADerecha(partes) {
  // tu código aquí
}
--- pruebas
prueba('2 + 3 × 4 = 20 (no 14)', () => igual(deIzquierdaADerecha([2, '+', 3, '×', 4]), 20));
prueba('un número solo', () => igual(deIzquierdaADerecha([7]), 7));
prueba('restar y dividir', () => igual(deIzquierdaADerecha([10, '−', 4, '÷', 2]), 3));
prueba('cuatro operaciones seguidas', () => igual(deIzquierdaADerecha([1, '+', 1, '×', 5, '−', 2, '÷', 4]), 2));
--- solución
function deIzquierdaADerecha(partes) {
  let total = partes[0];
  for (let i = 1; i < partes.length; i += 2) {
    const operador = partes[i];
    const numero = partes[i + 1];
    if (operador === '+') total = total + numero;
    else if (operador === '−') total = total - numero;
    else if (operador === '×') total = total * numero;
    else total = total / numero;
  }
  return total;
}
```

```practica
vf :: En una calculadora, 2 + 3 × 4 puede dar 14 o 20 según una decisión que se escribe en el plan
vf :: Usar eval para hacer las cuentas es la forma recomendada, porque es más corta
elige :: ¿Para qué sirve la lista de lo que la calculadora NO hace? :: Para que el código sea más corto :: Para que el proyecto no crezca para todos lados y se pueda terminar :: Para las pruebas → Sin esa lista, cada sesión agrega algo (historial, paréntesis…) y la app nunca se termina.
escribe :: ¿Qué hiciste con cada fila de la tabla de decisiones del plan? :: La convertí en una prueba antes de escribir el código: así la decisión queda escrita y la máquina revisa que se cumpla siempre.
```

## Parte 2. El motor de diseño, antes de los botones

> 🌎 **En la vida real:** es como elegir los azulejos, la pintura y la grifería de toda la casa antes de empezar: después cada cuarto **usa** lo elegido, y la casa se ve pareja.

Lo viste en la clase 56 (parte 4): en React Native, el motor es un archivo, `src/tema/motor.ts`. El de la calculadora tiene lo de siempre y dos cosas nuevas:

```ts
export interface Colores { fondo: string; visor: string; numero: string; operador: string; /* … */ }
export const oscuro: Colores = { fondo: '#0f141b', numero: '#18212c', operador: '#7ee787', /* … */ };
export const claro: Colores = { fondo: '#f5f7fa', numero: '#ffffff', operador: '#1a7f37', /* … */ };

export const espacio = { chico: 8, medio: 14, grande: 20 } as const;
export const letra = { tecla: 30, aviso: 22, visorGrande: 72, visorChico: 40 } as const;
```

**Nuevo 1: dos temas con la misma forma.** `oscuro` y `claro` cumplen la interfaz `Colores` (clase 51, parte 5): si a uno le falta un color, TypeScript no compila. Y hay una prueba que lo revisa también: `Object.keys(claro)` es igual a `Object.keys(oscuro)`.

**Nuevo 2: medidas que se calculan.** Las teclas tienen que ser **cuadradas** (y redondas), y caber cuatro por fila en **cualquier** teléfono. Un número fijo (`80`) no sirve: en un iPhone SE (320 de ancho) no entran. Entonces el motor tiene una **función**:

```ts
export function ladoDeTecla(anchoPantalla: number): number {
  const ancho = Math.min(anchoPantalla, forma.anchoMaximo) - espacio.grande * 2;
  return Math.floor((ancho - espacio.medio * 3) / 4);   // 4 teclas y 3 huecos
}
```

Fíjate que **usa el motor** (`espacio.grande`, `espacio.medio`): si mañana quieres más aire entre las teclas, cambias `espacio.medio` y el lado se recalcula solo. Y `forma.anchoMaximo` evita que en una tableta las teclas salgan gigantes. **La prueba** lo dice con números: en 320 de ancho, cuatro teclas más sus huecos no se pasan, y cada tecla mide al menos 56 (que se pueda tocar con el dedo).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las medidas salen del motor
lenguaje: js
pide: Completa las dos funciones del motor. `ladoDeTecla(anchoPantalla)`: toma el ancho (sin pasarse de `forma.anchoMaximo`), le resta `espacio.grande` de cada costado, le resta los **3** huecos de `espacio.medio` entre las 4 teclas, lo divide entre 4 y redondea hacia abajo (`Math.floor`). Y `radioDe(lado)`: la mitad del lado, para que la tecla sea redonda.
--- código
const espacio = { chico: 8, medio: 14, grande: 20 };
const forma = { anchoMaximo: 420 };

function ladoDeTecla(anchoPantalla) {
  // tu código aquí
}

function radioDe(lado) {
  // tu código aquí
}
--- pruebas
prueba('un iPhone de 390 de ancho', () => igual(ladoDeTecla(390), 77));
prueba('un iPhone SE de 320', () => igual(ladoDeTecla(320), 59));
prueba('en una tableta no se estira', () => igual(ladoDeTecla(1024), ladoDeTecla(420)));
prueba('las cuatro teclas entran', () => ok(ladoDeTecla(320) * 4 + 14 * 3 + 20 * 2 <= 320, 'se pasa del ancho'));
prueba('redonda', () => igual(radioDe(80), 40));
--- solución
const espacio = { chico: 8, medio: 14, grande: 20 };
const forma = { anchoMaximo: 420 };

function ladoDeTecla(anchoPantalla) {
  const ancho = Math.min(anchoPantalla, forma.anchoMaximo) - espacio.grande * 2;
  return Math.floor((ancho - espacio.medio * 3) / 4);
}

function radioDe(lado) {
  return lado / 2;
}
```

```practica
vf :: El lado de las teclas se calcula con el ancho de la pantalla, usando los espacios del motor
vf :: Como el tema claro y el oscuro se escriben aparte, pueden tener colores distintos sin problema, aunque a uno le falte uno
elige :: ¿Para qué sirve forma.anchoMaximo? :: Para que el texto sea más grande :: Para que en una tableta la calculadora no se estire y las teclas no salgan gigantes :: Para el modo oscuro → Math.min(anchoPantalla, forma.anchoMaximo) pone un tope.
escribe :: ¿Por qué el lado de la tecla no es un número fijo como 80? :: Porque en un teléfono chico (320 de ancho) cuatro teclas de 80 más sus huecos no entran. Se calcula con el ancho de la pantalla para que entre en cualquiera.
```

## Parte 3. Las cuentas, sin eval: 0,1 + 0,2

Prueba esto en la consola del navegador:

```js
0.1 + 0.2   // 0.30000000000000004
```

No es un error de JavaScript: **todas** las computadoras guardan los decimales en binario, y `0,1` en binario es como `1/3` en decimal: no tiene un final exacto. Una calculadora que muestra `0,30000000000000004` está rota para cualquier persona.

**La solución: redondear a 12 cifras significativas.** Las calculadoras de verdad muestran como mucho 12 cifras, así que se redondea a eso:

```ts
export function redondear(x: number): number {
  const r = Number(x.toPrecision(12));   // 0.30000000000000004 → "0.300000000000" → 0.3
  return Object.is(r, -0) ? 0 : r;       // y que nunca se vea "-0"
}
```

Y las cuentas, **sin `eval`**, con cuatro casos claros:

```ts
export function calcular(a: number, operador: Operador, b: number): number | string {
  let r: number;
  if (operador === '+') r = a + b;
  else if (operador === '−') r = a - b;
  else if (operador === '×') r = a * b;
  else {
    if (b === 0) return DIVIDIR_ENTRE_CERO;   // "No se puede dividir entre 0"
    r = a / b;
  }
  r = redondear(r);
  return Math.abs(r) >= LIMITE ? MUY_GRANDE : r;   // 13 cifras o más no entran en el visor
}
```

`number | string` dice "devuelve un número **o** un aviso". Quien la llama **tiene** que mirar cuál vino (`typeof r === 'number'`): TypeScript no lo deja olvidarse.

> 📌 **Nota:** los operadores son `'−'`, `'×'` y `'÷'`: los símbolos de verdad, no `-`, `*` y `/`. Son los que se ven en las teclas, y el tipo `Operador` no deja que se cuele otro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las cuentas, sin eval
lenguaje: js
pide: Completa `redondear(x)`: `Number(x.toPrecision(12))`, y si da `-0`, devuelve `0` (`Object.is(r, -0)`). Después `calcular(a, operador, b)` con los cuatro casos: devuelve el resultado **redondeado**, o el texto `'No se puede dividir entre 0'` si se divide entre 0, o `'El número es muy grande'` si el resultado (en valor absoluto) es `1e12` o más.
--- código
function redondear(x) {
  // tu código aquí
}

function calcular(a, operador, b) {
  // tu código aquí
}
--- pruebas
prueba('0,1 + 0,2 = 0,3 (y no 0,30000000000000004)', () => igual(calcular(0.1, '+', 0.2), 0.3));
prueba('restar', () => igual(calcular(3, '−', 8), -5));
prueba('multiplicar', () => igual(calcular(6, '×', 7), 42));
prueba('1 ÷ 3 con 12 cifras', () => igual(calcular(1, '÷', 3), 0.333333333333));
prueba('dividir entre 0', () => igual(calcular(1, '÷', 0), 'No se puede dividir entre 0'));
prueba('muy grande', () => igual(calcular(999999, '×', 9999999), 'El número es muy grande'));
prueba('sin -0', () => ok(Object.is(redondear(-0), 0), 'redondear(-0) tiene que dar 0'));
--- solución
function redondear(x) {
  const r = Number(x.toPrecision(12));
  return Object.is(r, -0) ? 0 : r;
}

function calcular(a, operador, b) {
  let r;
  if (operador === '+') r = a + b;
  else if (operador === '−') r = a - b;
  else if (operador === '×') r = a * b;
  else {
    if (b === 0) return 'No se puede dividir entre 0';
    r = a / b;
  }
  r = redondear(r);
  return Math.abs(r) >= 1e12 ? 'El número es muy grande' : r;
}
```

```practica
vf :: 0.1 + 0.2 da 0.30000000000000004 porque las computadoras guardan los decimales en binario
vf :: Si calcular devuelve number | string, se puede usar el resultado como número sin revisar nada
elige :: ¿Por qué redondear usa toPrecision(12)? :: Porque es más rápido :: Porque la calculadora muestra como mucho 12 cifras, y así desaparece el error de los decimales :: Para quitar los negativos → 0.30000000000000004 con 12 cifras es 0.3.
escribe :: ¿Qué devuelve calcular(1, '÷', 0) y por qué no devuelve Infinity? :: Devuelve el aviso "No se puede dividir entre 0". JavaScript daría Infinity, que en el visor no le dice nada a la persona; el plan decidió mostrar un aviso claro.
```

## Parte 4. Una tecla, un estado nuevo

> 🌎 **En la vida real:** es como el marcador de un partido. Cada gol no "modifica" el marcador viejo: el tablero muestra **uno nuevo** (2 a 1 pasa a 3 a 1). Si alguien quiere ver cómo iba antes, el anterior sigue existiendo en la foto.

¿Qué tiene que **recordar** una calculadora? Mira la tuya mientras haces `2 + 3`: recuerda el número del visor, el `2` que guardó, el `+` que elegiste, si el próximo dígito empieza un número nuevo, y si hay un aviso. Eso es **el estado**:

```ts
export interface Estado {
  pantalla: string;          // "1234.5": con punto, como texto (para no perder el "12," mientras escribes)
  guardado: number | null;   // el primer número de la cuenta
  operador: Operador | null;
  nuevoNumero: boolean;      // true después de un operador o de un resultado
  error: string | null;      // "No se puede dividir entre 0"
}
```

Y **toda** la calculadora es una sola función: `apretar(estado, tecla)` devuelve **un estado nuevo**. Es un *reducer* (la idea de `reduce` de la clase 48): un estado entra, una tecla entra, un estado sale.

```ts
if (esOperador(t)) {
  if (e.operador && e.nuevoNumero) return { ...e, operador: t };      // 5 + × → vale el último
  if (e.operador && e.guardado !== null) {                             // 2 + 3 × → resuelve 2 + 3
    const r = calcular(e.guardado, e.operador, actual);
    return conResultado(r, { guardado: typeof r === 'number' ? r : null, operador: t, nuevoNumero: true });
  }
  return { ...e, guardado: actual, operador: t, nuevoNumero: true };
}
```

Cada caso de la tabla del plan es **un `if`** con su comentario. Si lees `apretar` de arriba abajo, lees el plan.

**¿Por qué un estado nuevo y no cambiar el que llega?** Porque así:
- **Se puede probar** sin pantalla: `[...teclas].reduce(apretar, INICIAL)` y miras el resultado.
- **React se entera** de que cambió (clase 55): si cambias el objeto por dentro, React no vuelve a dibujar.
- Hay una prueba que lo exige: después de `apretar(INICIAL, '5')`, `INICIAL` sigue igual.

> 💡 **Idea:** `pantalla` es **texto** y no número a propósito. Mientras escribes `12,` el número todavía es `12`, pero el visor tiene que mostrar la coma. Y `0,50` tiene que mostrar el cero. Como texto, se ve exactamente lo que tocaste.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una tecla, un estado nuevo
lenguaje: js
pide: Completa una versión chica de `apretar(e, t)` que solo sabe de **números, coma y C**. El estado es `{ pantalla, nuevoNumero }`. Un dígito: si `nuevoNumero`, la pantalla pasa a ser ese dígito (y `nuevoNumero` a `false`); si la pantalla es `'0'`, se reemplaza; si no, se agrega al final. La coma (`','`): si `nuevoNumero`, la pantalla pasa a `'0.'`; si ya hay un punto, no hace nada; si no, agrega `'.'`. `'C'` vuelve a `INICIAL`. **Nunca cambies el estado que recibes**: devuelve uno nuevo con `{ ...e, … }`.
--- código
const INICIAL = { pantalla: '0', nuevoNumero: true };

function apretar(e, t) {
  // tu código aquí
}
--- pruebas
const tocar = (...teclas) => teclas.reduce(apretar, INICIAL).pantalla;
prueba('un número', () => igual(tocar('4', '2'), '42'));
prueba('el 0 de adelante se reemplaza', () => igual(tocar('0', '7'), '7'));
prueba('empezar con coma', () => igual(tocar(',', '5'), '0.5'));
prueba('una coma de más se ignora', () => igual(tocar('1', ',', '2', ','), '1.2'));
prueba('C empieza de nuevo', () => igual(tocar('9', 'C'), '0'));
prueba('no cambia el estado que recibe', () => { const e = { pantalla: '1', nuevoNumero: false }; apretar(e, '2'); igual(e.pantalla, '1'); });
--- solución
const INICIAL = { pantalla: '0', nuevoNumero: true };

function apretar(e, t) {
  if (t === 'C') return INICIAL;
  if (t === ',') {
    if (e.nuevoNumero) return { ...e, pantalla: '0.', nuevoNumero: false };
    return e.pantalla.includes('.') ? e : { ...e, pantalla: e.pantalla + '.' };
  }
  if (e.nuevoNumero) return { ...e, pantalla: t, nuevoNumero: false };
  return { ...e, pantalla: e.pantalla === '0' ? t : e.pantalla + t };
}
```

```practica
vf :: Toda la calculadora es una función que recibe un estado y una tecla y devuelve un estado nuevo
vf :: Conviene que apretar cambie el estado que recibe, porque es más rápido
elige :: ¿Por qué la pantalla se guarda como texto y no como número? :: Porque los textos ocupan menos :: Para mostrar exactamente lo que se tocó, como "12," o "0,50" :: Para formatear más rápido → Como número, "12," sería 12 y "0,50" sería 0,5.
escribe :: ¿Qué recuerda el estado de la calculadora mientras haces 2 + 3? :: El número del visor (3), el número guardado (2), el operador (+), si el próximo dígito empieza un número nuevo, y si hay un aviso.
```

## Parte 5. Las pruebas primero: 39 en rojo, 39 en verde

El orden fue el de siempre (clases 03 y 92): **primero las pruebas**, sacadas de la tabla del plan, y recién después el código.

```ts
// Toca varias teclas seguidas y devuelve lo que se ve en el visor.
function tocar(...teclas: Tecla[]): string {
  const final = teclas.reduce<Estado>((e, t) => apretar(e, t), INICIAL);
  return final.error ?? formatear(final.pantalla);
}

test('de izquierda a derecha: 2 + 3 × 4 = 20', () => expect(tocar('2', '+', '3', '×', '4', '=')).toBe('20'));
test('0,1 + 0,2 = 0,3', () => expect(tocar('0', ',', '1', '+', '0', ',', '2', '=')).toBe('0,3'));
test('dividir entre 0 avisa', () => expect(tocar('1', '÷', '0', '=')).toBe('No se puede dividir entre 0'));
```

El ayudante `tocar` hace que cada prueba se lea **como lo que haría una persona**: "toco 2, más, 3, por, 4, igual: veo 20". Y prueba **lo que se ve** (`formatear`), no los detalles de adentro: si mañana cambia cómo se guarda el estado, las pruebas siguen sirviendo.

**Lo que pasó:** las 39 pruebas de la lógica salieron en **rojo** (todavía no había código), y en **verde** a la primera cuando se escribió `calculadora.ts`. Pero que pasen a la primera **no** quiere decir que esté todo bien: quiere decir que el código hace **lo que las pruebas preguntan**. Lo que nadie preguntó apareció recién mirando la app en un teléfono chico (clase 95, parte 4).

> 📌 **Nota:** `formatear` es la otra mitad del visor: la lógica guarda `-1234.5` y el visor muestra `-1.234,5`, como en Brasil. Separar "cómo se guarda" de "cómo se ve" es lo que permite cambiar el formato (por ejemplo, para Estados Unidos) sin tocar ninguna cuenta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Formatear como en Brasil
lenguaje: js
pide: La lógica guarda el número con punto decimal (`'-1234.5'`), y el visor lo muestra como en Brasil (`'-1.234,5'`). Completa `formatear(pantalla)`: separa el signo, parte en entero y decimal con `split('.')`, pone un punto cada tres cifras en el entero con `replace(/\B(?=(\d{3})+(?!\d))/g, '.')` y une con una **coma** si había decimal (aunque esté vacío, como en `'12.'` mientras escribes).
--- código
function formatear(pantalla) {
  // tu código aquí
}
--- pruebas
prueba('miles', () => igual(formatear('1234567'), '1.234.567'));
prueba('con decimales', () => igual(formatear('1234.5'), '1.234,5'));
prueba('negativo', () => igual(formatear('-1234.5'), '-1.234,5'));
prueba('mientras escribes la coma', () => igual(formatear('12.'), '12,'));
prueba('chico', () => igual(formatear('0.3'), '0,3'));
--- solución
function formatear(pantalla) {
  const negativo = pantalla.startsWith('-');
  const [entero, decimal] = pantalla.replace('-', '').split('.');
  const conMiles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (negativo ? '-' : '') + conMiles + (decimal !== undefined ? ',' + decimal : '');
}
```

```practica
vf :: Las pruebas de la calculadora se escribieron antes que el código, sacadas de la tabla de decisiones del plan
vf :: Si todas las pruebas pasan a la primera, la app no tiene ningún error
elige :: ¿Para qué sirve el ayudante tocar(...teclas) en las pruebas? :: Para que corran más rápido :: Para que cada prueba se lea como lo que hace una persona y pruebe lo que se ve :: Para no usar Jest → "Toco 2, más, 3, igual: veo 5".
escribe :: ¿Por qué conviene separar cómo se guarda el número (-1234.5) de cómo se ve (-1.234,5)? :: Porque así las cuentas no dependen del formato: se puede cambiar cómo se muestra (otro país, otro separador) sin tocar la lógica, y las pruebas de las cuentas siguen igual.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo harías una calculadora?":** "Empezaría por el plan, con una tabla de decisiones: de izquierda a derecha o con precedencia, qué pasa al dividir entre cero, con dos operadores seguidos, con el porcentaje. Cada fila se vuelve una prueba. La lógica es un reducer puro, `apretar(estado, tecla)`, que devuelve un estado nuevo y se prueba sin pantalla. Nunca `eval`: es inseguro y no te deja decidir los casos. Y redondeo a 12 cifras significativas, porque `0,1 + 0,2` en cualquier computadora da `0,30000000000000004`."

> 🌎 **En la vida real:** es como explicar una receta de cocina: primero qué plato es y qué decisiones tomaste (sin sal, para cuatro), después los ingredientes, y por último cómo comprobaste que salió bien.

> 🌎 **Otro ejemplo:** es como el árbitro que explica el reglamento antes del partido: con las reglas claras, cada jugada tiene una sola respuesta.
