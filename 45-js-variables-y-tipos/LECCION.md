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

```practica
vf :: JavaScript se puede probar en la consola del navegador
vf :: Para correr un archivo .js en la terminal se usa python3 archivo.js
elige :: ¿Qué hace console.log('Hola')? :: Guarda un archivo :: Muestra Hola en la consola :: Abre una ventana
elige :: ¿Qué necesitas para correr JavaScript fuera del navegador? :: Python :: Node.js :: Firebase
escribe :: Nombra tres lugares donde puedes correr JavaScript. :: La consola del navegador, un archivo con Node.js en la terminal, y el laboratorio de CRUD del sitio.
```

## Parte 2. const y let

> 🌎 **En la vida real:** `const` es tu fecha de nacimiento (no cambia); `let` es tu kilometraje (cambia todos los días).

> 🌎 **Otro ejemplo:** Es como una etiqueta permanente frente a una etiqueta de pizarra que se borra.

### Cuál usar

```js
const nombre = 'Delvin';   // no se puede volver a asignar
let viajes = 0;            // sí cambia
viajes = viajes + 1;
viajes += 1;               // lo mismo, más corto
```

Regla: **usa `const` siempre**, y `let` solo si el valor va a cambiar. `var` es la forma vieja: no la uses (tiene reglas raras de alcance).

> 🌎 **En la vida real:** es como guardar en una caja fuerte lo que no debe cambiar y en el bolsillo lo que usas todo el día.

> 🌎 **Otro ejemplo:** Es como un contrato firmado (const) frente a una lista de compras (let).

### Nombres en camelCase

En JavaScript los nombres van en **camelCase**: `gananciaTotal`, `numeroDeViajes`. Las constantes "de configuración" a veces en MAYÚSCULAS: `const IMPUESTO = 0.15`.

> 🌎 **En la vida real:** es como la ortografía de cada idioma: en Python `ganancia_total`, en JavaScript `gananciaTotal`.

> 🌎 **Otro ejemplo:** Es como las costumbres de cada país para escribir la fecha.

```practica
vf :: Una variable con const se puede volver a asignar
vf :: Conviene usar const siempre que el valor no vaya a cambiar
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

> 🌎 **En la vida real:** es como cambiar dólares por reales en la casa de cambio, a propósito y sabiendo cuánto da.

> 🌎 **Otro ejemplo:** Es como pasar una receta de tazas a gramos antes de pesar.

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
