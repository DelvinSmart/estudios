# JavaScript 3: funciones

> 🌎 **En la vida real:** una función es una receta con nombre: le das ingredientes, sigue los pasos y te entrega el plato. La escribes una vez y la usas siempre.

> 🎙️ **El profesor dice:** las funciones son el corazón de JavaScript y de React (cada componente de React **es** una función). Hoy: las dos formas de escribirlas, parámetros por defecto y "resto", `return`, el alcance y los *closures*, y las funciones que reciben otras funciones.

## Parte 1. Declarar funciones

> 🌎 **En la vida real:** es como un botón de "café expreso": programado una vez, usado mil veces.

> 🌎 **Otro ejemplo:** Es como un atajo del celular que hace varios pasos con un toque.

### Dos formas

```js
// Declaración
function gananciaNeta(bruto, gastos) {
  return bruto - gastos;
}

// Función flecha (arrow function), guardada en una constante
const gananciaNeta2 = (bruto, gastos) => bruto - gastos;   // si es una sola expresión, return implícito
```

Las dos se usan igual: `gananciaNeta(300, 80)`. En React vas a ver muchas flechas.

> 🌎 **En la vida real:** son como escribir una receta en un cuaderno o en una ficha corta: misma receta.

> 🌎 **Otro ejemplo:** Es como decir "por favor, pásame la sal" o "¿la sal?": se entiende igual.

### return

`return` entrega el resultado y **termina** la función. Sin `return`, la función devuelve `undefined`. Con flecha y llaves `{ }`, hay que escribir `return`:

```js
const doble = (n) => { return n * 2; };   // con llaves, return explícito
```

> 🌎 **En la vida real:** `return` es la ventanilla de entrega del pedido.

> 🌎 **Otro ejemplo:** Es como el cajero que te da el ticket: sin ticket, no te llevas nada.

```practica
vf :: Una función sin return devuelve undefined
vf :: Una función flecha con llaves devuelve el valor sin escribir return
elige :: ¿Qué devuelve (n) => n * 3 llamada con 4? :: 7 :: 12 :: undefined
elige :: ¿Qué forma de función vas a ver más en React? :: function* :: Las funciones flecha :: var function
escribe :: Escribe una función flecha que reciba km y litros y devuelva el rendimiento. :: const rendimiento = (km, litros) => km / litros;
```

## Parte 2. Parámetros flexibles

> 🌎 **En la vida real:** "un café, normal": si no dices nada, viene como siempre.

> 🌎 **Otro ejemplo:** Es como un formulario con campos ya llenos.

### Valores por defecto y objeto de opciones

```js
function precioViaje(km, tarifaKm = 1.8, minimo = 8) {
  return Math.max(km * tarifaKm, minimo);
}

// Con muchas opciones, mejor un objeto (se ve el nombre de cada una)
function precioViaje2({ km, tarifaKm = 1.8, minimo = 8 }) {
  return Math.max(km * tarifaKm, minimo);
}
precioViaje2({ km: 12, tarifaKm: 2.1 });
```

> 🌎 **En la vida real:** el objeto es como pedir "pizza: grande, sin cebolla": dices el nombre de lo que cambias.

> 🌎 **Otro ejemplo:** Es como el control del aire: arranca en 23 grados y cambias solo lo que quieres.

### El resto: ...

```js
function total(...montos) {          // recibe cuantos quieras como array
  return montos.reduce((s, m) => s + m, 0);
}
total(10, 20, 30);   // 60
```

> 🌎 **En la vida real:** es como una bolsa donde echas todas las monedas que tengas.

> 🌎 **Otro ejemplo:** Es como una lista de invitados abierta.

```practica
vf :: Un parámetro con valor por defecto se puede omitir
vf :: ...montos recibe los argumentos como un objeto
elige :: ¿Qué da precioViaje(3) con tarifa 1.8 y mínimo 8? :: 5.4 :: 8 :: 3
elige :: ¿Por qué usar un objeto de opciones? :: Es obligatorio :: Se ve el nombre de cada opción y el orden deja de importar :: Es más rápido
escribe :: Escribe una función promedio(...valores). :: const promedio = (...valores) => valores.reduce((s, v) => s + v, 0) / valores.length;
```

## Parte 3. Alcance y closures

> 🌎 **En la vida real:** lo que pasa en tu cocina se queda en tu cocina.

> 🌎 **Otro ejemplo:** Es como un casillero: lo de adentro no lo ve el de al lado.

### Alcance de bloque

Una variable con `const` o `let` existe solo dentro de las llaves donde se creó:

```js
if (true) {
  const secreto = 42;
}
// console.log(secreto);  → ReferenceError: secreto is not defined
```

> 🌎 **En la vida real:** es como una conversación dentro de un cuarto: afuera no se oye.

> 🌎 **Otro ejemplo:** Es como una nota escrita en la pizarra de una sala: en la sala de al lado no está.

### Closure: la función que recuerda

Una función creada dentro de otra **recuerda** las variables de afuera, aunque la de afuera ya terminó:

```js
function crearContador() {
  let cuenta = 0;
  return () => {
    cuenta += 1;
    return cuenta;
  };
}
const siguienteViaje = crearContador();
siguienteViaje();   // 1
siguienteViaje();   // 2
```

Los *hooks* de React (como `useState`) se apoyan en esta idea.

> 🌎 **En la vida real:** es como una mochila: la función se lleva sus cosas a donde vaya.

> 🌎 **Otro ejemplo:** Es como un cuaderno personal que viaja contigo.

```practica
vf :: Una variable const creada dentro de un if se puede usar afuera del if
vf :: Un closure recuerda las variables de la función donde fue creado
elige :: ¿Qué da la tercera llamada a siguienteViaje()? :: 1 :: 3 :: 0
elige :: ¿Qué error sale al usar una variable fuera de su alcance? :: TypeError :: ReferenceError :: SyntaxError
escribe :: Explica con tus palabras qué es un closure. :: Es una función que recuerda las variables del lugar donde fue creada, aunque ese lugar ya haya terminado, como el contador que sigue sumando.
```

## Parte 4. Funciones que reciben funciones

> 🌎 **En la vida real:** le das al mensajero la dirección y también las instrucciones: "si no hay nadie, déjalo con el portero".

> 🌎 **Otro ejemplo:** Es como un timbre que dice "cuando alguien toque, avísame".

### Callbacks

Una función que se pasa a otra para que la llame después se llama **callback**:

```js
const viajes = [18.5, 22, 9.75];
viajes.forEach((v) => console.log(v));     // forEach llama la flecha por cada viaje

boton.addEventListener('click', () => {    // el navegador la llama cuando hay un toque
  console.log('tocaste');
});

setTimeout(() => console.log('pasaron 2 segundos'), 2000);
```

> 🌎 **En la vida real:** es como dejarle tu número a la tienda: "llámame cuando llegue".

> 🌎 **Otro ejemplo:** Es como un despertador: programas qué hacer y a qué hora.

### Funciones puras

Una función **pura** solo usa sus parámetros y solo devuelve, sin cambiar nada de afuera. Son las más fáciles de probar (clase 53) y React las prefiere.

> 🌎 **En la vida real:** es como una calculadora: misma cuenta, mismo resultado.

> 🌎 **Otro ejemplo:** Es como una receta exacta: mismos ingredientes, misma torta.

```practica
vf :: Un callback es una función que se pasa a otra para que la llame después
vf :: setTimeout ejecuta la función inmediatamente
elige :: En boton.addEventListener('click', fn), ¿quién llama a fn? :: Tú, enseguida :: El navegador, cuando hay un clic :: Nadie
elige :: ¿Qué es una función pura? :: Una sin parámetros :: Una que solo usa sus parámetros y devuelve sin cambiar nada de afuera :: Una muy corta
escribe :: Escribe un setTimeout que muestre 'listo' después de 1 segundo. :: setTimeout(() => console.log('listo'), 1000);
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es un closure y un callback?":** "Un closure es una función que recuerda las variables del lugar donde fue creada, como un contador que sigue sumando; React se apoya en eso. Un callback es una función que le paso a otra para que la llame después, como en addEventListener, setTimeout o forEach. Escribo funciones flecha, uso parámetros por defecto u objetos de opciones, y prefiero funciones puras porque se prueban fácil."

> 🌎 **En la vida real:** es como explicar dos herramientas del taller que usas todos los días.

> 🌎 **Otro ejemplo:** Es como un músico explicando los dos acordes que más toca.
