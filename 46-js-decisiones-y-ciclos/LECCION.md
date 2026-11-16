# JavaScript 2: decisiones y ciclos

> 🌎 **En la vida real:** "si llueve, llevo paraguas"; "por cada pasajero, confirmo el destino". Decidir y repetir es casi todo lo que hace un programa.

> 🎙️ **El profesor dice:** hoy: `if` y `else`, el operador ternario, los valores que cuentan como falsos, `&&`, `||`, `??` y `?.` (muy usados en React), y los ciclos `for`, `for...of` y `while`.

## Parte 1. if, else y el ternario

> 🌎 **En la vida real:** el semáforo: si está en verde, avanzo; si está en rojo, freno; si no, voy con cuidado.

> 🌎 **Otro ejemplo:** Es como el menú de una llamada: "si quiere saldo, marque 1".

### if, else if, else

```js
const ganancia = 180;
if (ganancia >= 250) {
  console.log('Superaste la meta');
} else if (ganancia >= 150) {
  console.log('Cerca de la meta');
} else {
  console.log('Día flojo');
}
```

Las llaves `{ }` marcan el bloque (en Python era la sangría).

> 🌎 **En la vida real:** es como clasificar la ropa sucia: cada prenda va a una sola pila.

> 🌎 **Otro ejemplo:** Es como la puerta de un evento: VIP, general o "no puede entrar".

### El ternario: un if de una línea

```js
const mensaje = ganancia >= 250 ? 'Meta cumplida' : 'Sigue';
```

Se lee: "¿condición? valor si sí : valor si no". Muy usado en React para mostrar una cosa u otra.

> 🌎 **En la vida real:** es como un interruptor de dos posiciones: una u otra.

> 🌎 **Otro ejemplo:** Es como responder un sí o no con una sola palabra.

```practica
vf :: En JavaScript los bloques del if se marcan con llaves
vf :: El ternario sirve para elegir entre tres o más valores en una sola parte
elige :: ¿Qué guarda x en const x = 5 > 3 ? 'sí' : 'no'? :: 'no' :: 'sí' :: true
elige :: ¿Cuántos bloques de un if, else if, else se ejecutan como máximo? :: Todos :: Uno solo :: Dos
escribe :: Escribe un ternario que guarde 'cargar' si litros es menor que 10 y 'ok' si no. :: const accion = litros < 10 ? 'cargar' : 'ok';
```

## Parte 2. Verdadero, falso y los atajos

> 🌎 **En la vida real:** una caja vacía cuenta como "no hay nada", aunque la caja exista.

> 🌎 **Otro ejemplo:** Es como un tanque en cero: el tanque está, pero para manejar cuenta como vacío.

### Lo que cuenta como falso (falsy)

Valen como falso: `false`, `0`, `''` (texto vacío), `null`, `undefined` y `NaN`. **Todo lo demás** es verdadero, incluso `[]` y `{}` vacíos (¡distinto de Python!).

> 🌎 **En la vida real:** es como la lista de cosas que el portero considera "sin entrada".

> 🌎 **Otro ejemplo:** Es como las señales de "cerrado": hay varias formas de decir lo mismo.

### &&, || y ??

```js
const nombre = usuario.nombre || 'Invitado';    // si nombre es falsy ('' o undefined), usa 'Invitado'
const propina = viaje.propina ?? 0;             // solo si es null o undefined usa 0 (un 0 real se respeta)
esPremium && mostrarInsignia();                  // ejecuta solo si esPremium es verdadero
```

`??` es mejor que `||` cuando `0` o `''` son valores válidos.

> 🌎 **En la vida real:** `??` es "si no me dijiste nada, pongo esto"; `||` es "si me dijiste algo vacío, también pongo esto".

> 🌎 **Otro ejemplo:** Es como un formulario que pone "sin propina" solo si no escribiste nada, pero respeta si escribiste 0.

### ?. : preguntar sin romper

```js
const ciudad = usuario?.direccion?.ciudad;   // si algo en el camino no existe, da undefined en vez de error
```

> 🌎 **En la vida real:** es como preguntar "¿hay alguien en casa? ¿y está en la cocina?" sin tumbar la puerta.

> 🌎 **Otro ejemplo:** Es como revisar si hay sobre antes de buscar la carta adentro.

```practica
vf :: En JavaScript, un array vacío [] cuenta como falso
vf :: ?? usa el valor por defecto solo si el valor es null o undefined
elige :: viaje.propina vale 0. ¿Qué da viaje.propina || 5? :: 0 :: 5 :: undefined
elige :: ¿Qué da usuario?.direccion?.ciudad si usuario no tiene direccion? :: Error :: undefined :: null
escribe :: Escribe cómo mostrar el nombre del usuario o 'Invitado' si no hay nombre. :: const nombre = usuario?.nombre || 'Invitado';
```

## Parte 3. Ciclos: for, for...of y while

> 🌎 **En la vida real:** "por cada billete del montón, súmalo".

> 🌎 **Otro ejemplo:** Es como pasar lista en el colegio, de uno en uno.

### for...of: recorrer una lista

```js
const ganancias = [120, 95, 180, 210];
let total = 0;
for (const g of ganancias) {
  total += g;
}
```

> 🌎 **En la vida real:** es como contar billetes uno por uno.

> 🌎 **Otro ejemplo:** Es como revisar los mensajes de la bandeja de entrada.

### for clásico y while

```js
for (let dia = 1; dia <= 7; dia++) {
  console.log(`Día ${dia}`);
}

let ahorro = 0, meses = 0;
while (ahorro < 1000) {
  ahorro += 150;
  meses++;
}
```

`break` sale del ciclo; `continue` pasa a la siguiente vuelta. Cuidado con los ciclos que nunca terminan (el laboratorio los corta a los 3 segundos).

> 🌎 **En la vida real:** el `for` clásico es "da 7 vueltas a la pista"; el `while` es "corre hasta que te canses".

> 🌎 **Otro ejemplo:** Es como llenar un balde con un vaso: repites mientras no esté lleno.

```practica
vf :: for...of recorre los elementos de un array uno por uno
vf :: break pasa a la siguiente vuelta del ciclo
elige :: ¿Cuántas veces corre for (let i = 0; i < 3; i++)? :: 2 :: 3 :: 4
elige :: ¿Qué ciclo usarías para "repetir mientras no llegue a 1000"? :: for...of :: while :: switch
escribe :: Escribe un for...of que muestre cada app de ['Uber', '99', 'InDrive']. :: for (const app of ['Uber', '99', 'InDrive']) { console.log(app); }
```

## Parte 4. switch: muchos casos de un mismo valor

> 🌎 **En la vida real:** es como un distribuidor de cartas por código postal: cada código va a su casillero.

> 🌎 **Otro ejemplo:** Es como el selector de programas de una lavadora.

### La forma

```js
function tarifaPorApp(app) {
  switch (app) {
    case 'Uber':
      return 1.9;
    case '99':
      return 1.8;
    default:
      return 2.0;
  }
}
```

Si no usas `return`, cada `case` necesita `break`, o sigue de largo al siguiente. Muchas veces un **objeto** es más claro: `const tarifas = { Uber: 1.9, '99': 1.8 }; tarifas[app] ?? 2.0`.

> 🌎 **En la vida real:** olvidar el `break` es como una tobogán sin freno: sigues bajando al siguiente caso.

> 🌎 **Otro ejemplo:** El objeto es como una tabla de precios pegada en la pared: buscas y listo.

```practica
vf :: En un switch sin return, olvidar break hace que siga al siguiente caso
vf :: default se ejecuta solo si coincide el primer case
elige :: ¿Qué alternativa al switch es muchas veces más clara? :: Un ciclo while :: Un objeto como tabla de valores :: Una variable var
elige :: ¿Qué devuelve tarifaPorApp('InDrive') con el ejemplo? :: 1.9 :: 2.0 :: undefined
escribe :: Reescribe tarifaPorApp con un objeto. :: const tarifas = { Uber: 1.9, '99': 1.8 }; const tarifaPorApp = (app) => tarifas[app] ?? 2.0;
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué valores son falsy y cuándo usas ?? en vez de ||?":** "false, 0, texto vacío, null, undefined y NaN; los arrays y objetos vacíos son verdaderos. Uso ?? cuando 0 o texto vacío son valores válidos, porque solo reemplaza null o undefined, y ?. para leer propiedades que pueden no existir sin que se rompa. Para recorrer listas uso for...of, y en vez de switch largos, muchas veces un objeto."

> 🌎 **En la vida real:** es como explicar las señales de tránsito que más confunden.

> 🌎 **Otro ejemplo:** Es como un chef que explica cuándo usa sal y cuándo azúcar: parecen iguales, no lo son.
