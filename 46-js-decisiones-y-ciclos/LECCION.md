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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Llegaste a la meta?
lenguaje: js
pide: Completa `estadoMeta(ganancia)`: con **250 o más** devuelve `'Meta cumplida'`; con **150 o más**, `'Cerca de la meta'`; si no, `'Día flojo'`. Ojo con el orden de los `if`.
--- código
function estadoMeta(ganancia) {
  // tu código aquí
}
--- pruebas
prueba('300 es meta cumplida', () => igual(estadoMeta(300), 'Meta cumplida'));
prueba('250 justo también', () => igual(estadoMeta(250), 'Meta cumplida'));
prueba('180 es cerca', () => igual(estadoMeta(180), 'Cerca de la meta'));
prueba('150 justo es cerca', () => igual(estadoMeta(150), 'Cerca de la meta'));
prueba('90 es día flojo', () => igual(estadoMeta(90), 'Día flojo'));
--- solución
function estadoMeta(ganancia) {
  if (ganancia >= 250) return 'Meta cumplida';
  if (ganancia >= 150) return 'Cerca de la meta';
  return 'Día flojo';
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: || o ?? (la trampa del cero)
lenguaje: js
pide: Completa las dos funciones. `nombreVisible(usuario)` devuelve el nombre, o `'Invitado'` si no hay usuario o el nombre está vacío (usa `?.` y `||`). `propinaDe(viaje)` devuelve la propina, o `0` si no existe; pero si la propina **es 0**, tiene que devolver 0 (usa `??`).
--- código
function nombreVisible(usuario) {
  // tu código aquí
}

function propinaDe(viaje) {
  // tu código aquí
}
--- pruebas
prueba('con nombre lo muestra', () => igual(nombreVisible({ nombre: 'Ana' }), 'Ana'));
prueba('nombre vacío da Invitado', () => igual(nombreVisible({ nombre: '' }), 'Invitado'));
prueba('sin usuario da Invitado (sin error)', () => igual(nombreVisible(undefined), 'Invitado'));
prueba('propina de 5 es 5', () => igual(propinaDe({ propina: 5 }), 5));
prueba('propina de 0 se respeta', () => igual(propinaDe({ propina: 0 }), 0));
prueba('sin propina da 0', () => igual(propinaDe({}), 0));
--- solución
function nombreVisible(usuario) {
  return usuario?.nombre || 'Invitado';
}

function propinaDe(viaje) {
  return viaje.propina ?? 0;
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Ciclos: el total y el ahorro
lenguaje: js
pide: `total(ganancias)` suma todas las ganancias con un `for...of`. `mesesParaAhorrar(meta, porMes)` cuenta cuántos meses hacen falta para llegar a la meta ahorrando lo mismo cada mes (usa `while`).
--- código
function total(ganancias) {
  // tu código aquí
}

function mesesParaAhorrar(meta, porMes) {
  // tu código aquí
}
--- pruebas
prueba('total de [120, 95, 180, 210] es 605', () => igual(total([120, 95, 180, 210]), 605));
prueba('total de [] es 0', () => igual(total([]), 0));
prueba('1000 ahorrando 150 son 7 meses', () => igual(mesesParaAhorrar(1000, 150), 7));
prueba('300 ahorrando 100 son 3 meses', () => igual(mesesParaAhorrar(300, 100), 3));
prueba('meta 0 son 0 meses', () => igual(mesesParaAhorrar(0, 100), 0));
--- solución
function total(ganancias) {
  let suma = 0;
  for (const g of ganancias) {
    suma += g;
  }
  return suma;
}

function mesesParaAhorrar(meta, porMes) {
  let ahorro = 0;
  let meses = 0;
  while (ahorro < meta) {
    ahorro += porMes;
    meses++;
  }
  return meses;
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La tarifa de cada app
lenguaje: js
pide: Completa `tarifaPorApp(app)` con un `switch`: Uber cobra **1.9** por km, 99 cobra **1.8**, InDrive cobra **1.7**, y cualquier otra, **2.0**.
--- código
function tarifaPorApp(app) {
  // tu código aquí
}
--- pruebas
prueba('Uber es 1.9', () => igual(tarifaPorApp('Uber'), 1.9));
prueba('99 es 1.8', () => igual(tarifaPorApp('99'), 1.8));
prueba('InDrive es 1.7', () => igual(tarifaPorApp('InDrive'), 1.7));
prueba('otra app es 2.0', () => igual(tarifaPorApp('Lyft'), 2));
--- solución
function tarifaPorApp(app) {
  switch (app) {
    case 'Uber':
      return 1.9;
    case '99':
      return 1.8;
    case 'InDrive':
      return 1.7;
    default:
      return 2.0;
  }
}
```

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
