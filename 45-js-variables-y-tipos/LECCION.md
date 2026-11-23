# JavaScript 1: variables, tipos y la consola

> 🌎 **En la vida real:** antes de escribir una carta aprendes las letras; antes de manejar, los pedales. Esta clase es el abecedario de JavaScript.

> 🎙️ **El profesor dice:** este es el primer tema del curso **JavaScript + TypeScript**, que tiene su propio certificado. Ya leíste JavaScript en otras clases; aquí lo aprendes **desde cero y completo**, para escribirlo tú. Hoy: dónde correrlo, `const` y `let`, los tipos de datos, los textos con plantilla y la comparación con `===`.

## Parte 1. Dónde correr JavaScript

> 🌎 **En la vida real:** puedes practicar guitarra en tu cuarto o en un escenario: el instrumento es el mismo.

> 🌎 **Otro ejemplo:** Es como una calculadora: la del celular o la de la computadora hacen las mismas cuentas.

### En el navegador: la consola

Abre cualquier página, **Cmd + Option + J** (Chrome/Brave) o **Cmd + Option + C** (Safari, con el menú Desarrollo activado), y escribe:

```js
2 + 3            // 5
'hola'.length    // 4
console.log('Hola, mundo')
```

> 🌎 **En la vida real:** es como el borrador de una libreta: pruebas una cuenta y la ves al instante.

> 🌎 **Otro ejemplo:** Es como probar el sabor de una salsa con una cuchara antes de servirla.

### En tu computadora: Node.js

Con **Node.js** corres archivos `.js` en la terminal (ya lo usaste en la clase 09):

```bash
node --version
node hola.js
```

Y también tienes el **laboratorio de CRUD** de este sitio (`#/laboratorio`), que corre JavaScript sin instalar nada.

> 🌎 **En la vida real:** la consola es probar en vivo; el archivo es dejar la receta escrita para repetirla.

> 🌎 **Otro ejemplo:** Es como hablar por teléfono (consola) o mandar una carta (archivo).

> 🧩 **Piezas para este ejercicio**
> - En `function largo(texto)`, `texto` es el nombre del dato que recibe la función. Al llamar `largo('hola')`, ese dato vale `'hola'`.
> - `return` entrega el resultado a quien llamó la función. `console.log` lo muestra en la consola.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primera función
lenguaje: js
pide: Completa `largo(texto)` para que devuelva **cuántas letras** tiene el texto (usa `.length`). Debajo, `console.log` muestra el resultado: lo vas a ver después de tocar **▶ probar**.
--- código
function largo(texto) {
  // tu código aquí
}

console.log(largo('Hola, mundo'));
--- pruebas
prueba("largo('hola') es 4", () => igual(largo('hola'), 4));
prueba("largo('Uber') es 4", () => igual(largo('Uber'), 4));
prueba('un texto vacío tiene 0 letras', () => igual(largo(''), 0));
--- solución
function largo(texto) {
  return texto.length;
}

console.log(largo('Hola, mundo'));
```

```practica
vf :: JavaScript se puede probar en la consola del navegador
vf :: Para correr un archivo .js en la terminal se usa python3 archivo.js
elige :: ¿Qué hace console.log('Hola')? :: Guarda un archivo :: Muestra Hola en la consola :: Abre una ventana
elige :: ¿Qué necesitas para correr JavaScript fuera del navegador? :: Python :: Node.js :: Firebase
escribe :: Nombra tres lugares donde puedes correr JavaScript. :: La consola del navegador, un archivo con Node.js en la terminal, y el laboratorio de CRUD del sitio.
```

## Parte 2. const y let

### Darle un nombre a un dato

Una **variable** es un nombre que utilizas para guardar y luego leer un dato. **Declarar** la variable significa crear ese nombre. En `const precioPorLitro = 5;`, `precioPorLitro` es el nombre y `5` es el valor inicial. **Asignar** es darle un valor a ese nombre con `=`.

### Cuándo usar const

> 🌎 **En la vida real:** imagina un presupuesto de combustible. Anotas el precio de hoy en una línea y lo usas para calcular cuánto cuestan 10, 20 o 30 litros. Mañana puedes hacer otro presupuesto con otro precio. Dentro de cada presupuesto, usas el precio que anotaste para ese día.

Con `const` le das un valor al nombre al declararlo. A partir de ahí puedes leerlo cuantas veces quieras. Si el programa intenta darle otro valor a ese mismo nombre, JavaScript da un error. Puedes editar el código y volver a ejecutarlo con otro valor inicial, como hiciste en el Tema 116.

En el código vas a ver constantes que representan cosas distintas:

| Ejemplo | Por qué queda fijo |
|---|---|
| `const MINUTOS_POR_HORA = 60;` | Es una equivalencia que siempre vale. |
| `const precioPorLitro = 5;` | Es el dato que elegiste para esta cuenta. En otra cuenta puedes empezar con otro precio. |
| `const total = 10 * precioPorLitro;` | Es un resultado calculado una vez y guardado para mostrarlo o usarlo después. |

Las tres usan el mismo `const`. La tabla muestra tres razones para elegirlo. Cuando una constante contiene una lista, `const` protege el nombre: el programa no puede asignarle otra lista. Los elementos de la lista todavía pueden cambiar. Verás esa diferencia en el Tema 48.

### Cuándo usar let

> 🌎 **En la vida real:** en una hoja de control de viajes, empiezas con cero. Cada vez que terminas un viaje, actualizas el contador.

Con `let` puedes **reasignar** el nombre: darle otro valor después de declararlo.

```js
let viajes = 0;           // declara el contador y empieza en cero
viajes = viajes + 1;      // lee el 0, suma 1 y guarda el 1 en viajes
viajes += 1;              // otra forma de decir lo mismo: ahora vale 2
```

Para decidir, pregúntate si el programa tendrá que asignarle otro valor a ese nombre. Usa `let` cuando tenga que hacerlo y `const` cuando pueda conservar el valor inicial. En código antiguo también verás `var`. Para los ejercicios de este curso usa `const` y `let`.

### Nombres en camelCase

En JavaScript los nombres van en **camelCase**: `gananciaTotal`, `numeroDeViajes`. Las constantes "de configuración" a veces en MAYÚSCULAS: `const IMPUESTO = 0.15`.

> 🌎 **En la vida real:** es como la ortografía de cada idioma: en Python `ganancia_total`, en JavaScript `gananciaTotal`.

> 🌎 **Otro ejemplo:** Es como las costumbres de cada país para escribir la fecha.

> 🧩 **Piezas para este ejercicio**
> - Lee `for (let i = 0; i < veces; i++)` en tres pasos. Empieza con `i` en 0, repite mientras `i` sea menor que `veces` y suma 1 a `i` después de cada vuelta.
> - Dentro del bucle, `viajes += 1` intenta asignar un nuevo valor a `viajes`. Busca qué declaración permite esa asignación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: const o let
lenguaje: js
pide: Este código se rompe con el error **"Assignment to constant variable"** (tócale **▶ probar** para verlo). Arréglalo cambiando **una sola palabra**: la variable que cambia no puede ser `const`.
--- código
function contarViajes(veces) {
  const viajes = 0;
  for (let i = 0; i < veces; i++) {
    viajes += 1;
  }
  return viajes;
}
--- pruebas
prueba('3 viajes son 3', () => igual(contarViajes(3), 3));
prueba('0 viajes son 0', () => igual(contarViajes(0), 0));
prueba('10 viajes son 10', () => igual(contarViajes(10), 10));
--- solución
function contarViajes(veces) {
  let viajes = 0;
  for (let i = 0; i < veces; i++) {
    viajes += 1;
  }
  return viajes;
}
```

```practica
vf :: Una variable con const se puede volver a asignar
vf :: Conviene usar const siempre que no necesites darle otro valor a ese nombre
elige :: ¿Qué palabra no conviene usar hoy para crear variables? :: const :: let :: var
elige :: ¿Cuál nombre sigue el estilo de JavaScript? :: ganancia_total :: gananciaTotal :: GANANCIA total
escribe :: Crea una variable para tu nombre y otra para los viajes del día que empiece en 0 y suba en 1. :: const nombre = 'Delvin'; let viajes = 0; viajes += 1;
```

## Parte 3. Los tipos de datos

> 🌎 **En la vida real:** en un formulario hay casillas de número, de texto y de sí o no. Cada dato tiene su tipo.

> 🌎 **Otro ejemplo:** Es como los recipientes de la cocina: frascos para líquidos, bolsas para granos.

### Los tipos básicos

| Tipo | Ejemplo | Nota |
|---|---|---|
| `number` | `12`, `9.75` | Enteros y decimales son el mismo tipo |
| `string` | `'Uber'`, `"99"` | Texto, entre comillas |
| `boolean` | `true`, `false` | Sí o no (en minúscula) |
| `null` | `null` | "No hay valor", a propósito |
| `undefined` | `undefined` | "Todavía no tiene valor" |

```js
typeof 12          // 'number'
typeof 'hola'      // 'string'
0.1 + 0.2          // 0.30000000000000004  (los decimales no son exactos)
(0.1 + 0.2).toFixed(2)   // '0.30'
```

> 💡 **Idea:** con plata, redondea al mostrar (`toFixed(2)`) o trabaja en centavos (enteros).

> 🌎 **En la vida real:** `null` es una casilla marcada como "no aplica"; `undefined` es una casilla que nadie llenó todavía.

> 🌎 **Otro ejemplo:** Es como una silla reservada pero vacía (null) frente a una silla que nadie pidió (undefined).

### Textos con plantilla

Con comillas invertidas (`` ` ``) metes valores dentro de un texto:

```js
const viajes = 12;
const ganancia = 250.5;
console.log(`Hoy hice ${viajes} viajes y gané R$ ${ganancia.toFixed(2)}`);
```

> 🌎 **En la vida real:** es como una carta modelo con huecos para el nombre y la fecha.

> 🌎 **Otro ejemplo:** Es como el cartel del bus donde cambia solo el destino.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El resumen del día, con una plantilla
lenguaje: js
pide: Completa `resumenDia(viajes, ganancia)` para que devuelva exactamente `Hoy hice 12 viajes y gané R$ 250.50`. Usa una plantilla con comillas invertidas (`` ` ``) y `toFixed(2)` para que el dinero tenga siempre dos decimales.
--- código
function resumenDia(viajes, ganancia) {
  // tu código aquí
}

console.log(resumenDia(12, 250.5));
--- pruebas
prueba('12 viajes y 250.5', () => igual(resumenDia(12, 250.5), 'Hoy hice 12 viajes y gané R$ 250.50'));
prueba('3 viajes y 90', () => igual(resumenDia(3, 90), 'Hoy hice 3 viajes y gané R$ 90.00'));
prueba('devuelve un texto (string)', () => igual(typeof resumenDia(1, 1), 'string'));
--- solución
function resumenDia(viajes, ganancia) {
  return `Hoy hice ${viajes} viajes y gané R$ ${ganancia.toFixed(2)}`;
}

console.log(resumenDia(12, 250.5));
```

```practica
vf :: En JavaScript, enteros y decimales son el mismo tipo number
vf :: 0.1 + 0.2 da exactamente 0.3 en JavaScript
elige :: ¿Qué devuelve typeof 'hola'? :: 'text' :: 'string' :: 'word'
elige :: ¿Cómo se escribe un texto con una variable adentro? :: 'Hola ${nombre}' :: `Hola ${nombre}` (comillas invertidas) :: "Hola" + {nombre}
escribe :: ¿Qué diferencia hay entre null y undefined? :: null es "no hay valor" puesto a propósito; undefined es "todavía no tiene valor", por ejemplo una variable creada sin asignar.
```

## Parte 4. Comparar bien: === y la conversión de tipos

> 🌎 **En la vida real:** "dos" escrito en un papel no es lo mismo que dos monedas en la mano, aunque digan lo mismo.

> 🌎 **Otro ejemplo:** Es como comparar una foto de un carro con el carro: se parecen, no son lo mismo.

### Siempre ===

`==` compara **convirtiendo** los tipos (y da sorpresas); `===` compara **sin convertir**. Usa siempre `===` y `!==`.

```js
'5' == 5     // true   😬 convirtió el texto en número
'5' === 5    // false  ✅ texto y número no son iguales
0 == ''      // true   😬
0 === ''     // false  ✅
```

> 🌎 **En la vida real:** `==` es un portero distraído que deja pasar a cualquiera "parecido"; `===` revisa el documento.

> 🌎 **Otro ejemplo:** Es como comparar dos llaves solo por el color (==) o por los dientes (===).

### Convertir a propósito

Lo que llega de un formulario o de un `input` es **texto**. Para hacer cuentas, conviértelo:

```js
Number('12.5')      // 12.5
Number('abc')       // NaN (Not a Number: no es un número)
String(12)          // '12'
Number.isNaN(Number('abc'))   // true → así revisas si salió mal
```

> ⚠️ **Cuidado con la coma:** en Brasil escribimos `32,5`, pero `Number` espera un punto. Copiloto recibe números con coma, por eso la cambia por un punto antes de convertir:

```js
Number('32,5')                     // NaN
Number('32,5'.replace(',', '.'))   // 32.5
```

Esto sirve para un número simple. Si trae miles, como `1.234,56`, primero hay que quitar el punto de los miles.

> 🌎 **En la vida real:** es como cambiar dólares por reales en la casa de cambio, a propósito y sabiendo cuánto da.

> 🌎 **Otro ejemplo:** Es como pasar una receta de tazas a gramos antes de pesar.

> 🧩 **Piezas para este ejercicio**
> - `.trim()` quita los espacios de las puntas. Un texto como `'   '` se convierte en `''`.
> - `Number('')` devuelve 0. Comprueba si el campo está vacío antes de convertir, porque el ejercicio distingue el campo vacío de un cero escrito por la persona.
> - Los textos de este ejercicio usan punto para los decimales, así que no necesitas cambiar comas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Convertir lo que escribe el usuario
lenguaje: js
pide: Lo que una persona escribe en un campo llega como **texto**. Completa `aNumero(texto)`: devuelve el número (usa `Number`), pero si el texto está vacío o no es un número, devuelve `null`. Para revisar, usa `Number.isNaN`.
--- código
function aNumero(texto) {
  // tu código aquí
}
--- pruebas
prueba("'30' da 30 (número, no texto)", () => igual(aNumero('30'), 30));
prueba("'12.5' da 12.5", () => igual(aNumero('12.5'), 12.5));
prueba("'abc' da null", () => igual(aNumero('abc'), null));
prueba('un texto vacío da null', () => igual(aNumero(''), null));
prueba('solo espacios da null', () => igual(aNumero('   '), null));
--- solución
function aNumero(texto) {
  if (texto.trim() === '') return null;
  const n = Number(texto);
  return Number.isNaN(n) ? null : n;
}
```

```practica
vf :: '5' === 5 da true
vf :: Conviene usar siempre === y !==
elige :: ¿Qué da Number('abc')? :: 0 :: NaN :: 'abc'
elige :: Un usuario escribe "30" en un campo. Para sumarlo, ¿qué haces? :: Lo sumas directo :: Lo conviertes con Number y revisas que no sea NaN :: Lo pones entre comillas
escribe :: Explica por qué '5' == 5 da true y qué usarías en su lugar. :: Porque == convierte el texto en número antes de comparar; uso === , que compara sin convertir y da false.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué tipos de datos tiene JavaScript y cómo comparas?":** "number (enteros y decimales), string, boolean, null, undefined, además de objetos y arrays. Uso const por defecto y let solo si el valor cambia, nunca var. Comparo siempre con === para no tener conversiones sorpresa, y convierto a propósito lo que llega de un formulario con Number, revisando NaN."

> 🌎 **En la vida real:** es como explicar las reglas básicas de un deporte antes de jugar.

> 🌎 **Otro ejemplo:** Es como el abecedario: corto, pero sin él no hay lectura.
