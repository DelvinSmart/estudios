# JavaScript 4: arrays y objetos

> 🌎 **En la vida real:** un array es la fila del banco (en orden); un objeto es la ficha de un cliente (cada dato con su nombre). Casi todos los datos de una app son arrays de objetos.

> 🎙️ **El profesor dice:** hoy: crear y recorrer arrays, los métodos que más se usan en React (`map`, `filter`, `reduce`, `find`), los objetos, la **desestructuración**, el **spread** (`...`) y JSON. Si dominas esta clase, entiendes la mitad del código de Copiloto.

## Parte 1. Arrays

> 🌎 **En la vida real:** una playlist: canciones en orden, puedes agregar, quitar y reordenar.

> 🌎 **Otro ejemplo:** Es como los asientos numerados de un cine.

### Lo básico

```js
const viajes = [18.5, 22, 9.75];
viajes[0];              // 18.5
viajes.at(-1);          // 9.75 (el último)
viajes.length;          // 3
viajes.push(30);        // agrega al final
viajes.includes(22);    // true
viajes.indexOf(9.75);   // 2
```

> 🌎 **En la vida real:** es como una lista de mandados: agregas, tachas y revisas si ya está "pan".

> 🌎 **Otro ejemplo:** Es como los cajones numerados de una cómoda.

### No cambiar el original

En React **no se cambia** un array: se crea uno nuevo. Por eso conviene `[...viajes, 30]` en vez de `push`, y `toSorted()` en vez de `sort()` (que cambia el original).

```js
const conNuevo = [...viajes, 30];          // copia + agrega
const ordenados = viajes.toSorted((a, b) => a - b);
```

> 🌎 **En la vida real:** es como sacar fotocopia antes de rayar un documento.

> 🌎 **Otro ejemplo:** Es como guardar la receta original y anotar los cambios en otra hoja.

```practica
vf :: viajes.at(-1) devuelve el último elemento
vf :: sort() devuelve una copia ordenada y deja el original igual
elige :: ¿Cómo agregas 30 sin cambiar el array original? :: viajes.push(30) :: [...viajes, 30] :: viajes[30]
elige :: ¿Qué da [1, 2, 3].includes(2)? :: 1 :: true :: 2
escribe :: ¿Por qué en React se prefiere crear un array nuevo en vez de cambiar el original? :: Porque React detecta los cambios comparando si el dato es otro; si cambias el mismo array, puede no enterarse y no actualizar la pantalla.
```

## Parte 2. map, filter, reduce y find

> 🌎 **En la vida real:** de una canasta de frutas: map = pelar todas; filter = quedarte con las rojas; reduce = pesarlas todas juntas; find = encontrar la primera manzana.

> 🌎 **Otro ejemplo:** Es como una línea de producción: transformar, separar, sumar, buscar.

### Los cuatro grandes

```js
const viajes = [
  { app: 'Uber', valor: 32.5 },
  { app: '99', valor: 18 },
  { app: 'Uber', valor: 45 },
];
const valores = viajes.map((v) => v.valor);                 // [32.5, 18, 45]
const deUber = viajes.filter((v) => v.app === 'Uber');      // los 2 de Uber
const total = viajes.reduce((suma, v) => suma + v.valor, 0); // 95.5
const caro = viajes.find((v) => v.valor > 40);              // { app: 'Uber', valor: 45 }
const hayCaros = viajes.some((v) => v.valor > 40);          // true
```

Se encadenan: `viajes.filter(...).map(...)`.

> 🌎 **En la vida real:** es como hacer el cierre de caja: filtrar las ventas del día y sumarlas.

> 🌎 **Otro ejemplo:** Es como buscar en la agenda el primer contacto que empiece con "A".

### map en React

En React, `map` convierte una lista de datos en una lista de componentes:

```jsx
{viajes.map((v, i) => <TarjetaViaje key={i} app={v.app} valor={v.valor} />)}
```

> 🌎 **En la vida real:** es como imprimir una etiqueta por cada paquete de una lista.

> 🌎 **Otro ejemplo:** Es como un molde que hace una galleta por cada porción de masa.

```practica
vf :: map devuelve un array nuevo del mismo largo
vf :: find devuelve todos los elementos que cumplen la condición
elige :: ¿Qué método usas para sumar todos los valores? :: map :: filter :: reduce
elige :: ¿Qué da [1, 2, 3, 4].filter((n) => n % 2 === 0)? :: [1, 3] :: [2, 4] :: 6
escribe :: Escribe cómo obtener el total ganado solo con viajes de 99. :: viajes.filter((v) => v.app === '99').reduce((s, v) => s + v.valor, 0)
```

## Parte 3. Objetos, desestructuración y spread

> 🌎 **En la vida real:** un objeto es la ficha de un carro: marca, modelo, km.

> 🌎 **Otro ejemplo:** Es como los contactos: buscas por nombre, no por posición.

### Objetos

```js
const carro = { marca: 'Toyota', modelo: 'Corolla', km: 85000 };
carro.marca;                 // 'Toyota'
carro['modelo'];             // 'Corolla' (útil si la llave está en una variable)
const actualizado = { ...carro, km: 85320 };   // copia con un cambio
Object.keys(carro);          // ['marca', 'modelo', 'km']
Object.entries(carro);       // [['marca', 'Toyota'], …]
```

> 🌎 **En la vida real:** el spread es como copiar una ficha y cambiar solo el kilometraje.

> 🌎 **Otro ejemplo:** Es como una plantilla de contrato donde cambias solo el nombre.

### Desestructuración

Sacar valores de un objeto o array en variables, en una línea. React la usa todo el tiempo:

```js
const { marca, km } = carro;
const [primero, segundo] = viajes;
function Tarjeta({ app, valor }) { /* … */ }     // desestructurar las props de un componente
const [cuenta, setCuenta] = useState(0);          // lo que verás en React
```

> 🌎 **En la vida real:** es como sacar de la mochila solo el celular y las llaves.

> 🌎 **Otro ejemplo:** Es como leer de una factura solo el total y la fecha.

```practica
vf :: { ...carro, km: 85320 } cambia el objeto carro original
vf :: const { marca } = carro saca la propiedad marca en una variable
elige :: ¿Qué da Object.keys({ a: 1, b: 2 })? :: [1, 2] :: ['a', 'b'] :: 2
elige :: En const [cuenta, setCuenta] = useState(0), ¿qué se está desestructurando? :: Un objeto :: Un array de dos elementos :: Un texto
escribe :: Escribe cómo crear una copia de viaje con el valor 50, sin cambiar el original. :: const nuevo = { ...viaje, valor: 50 };
```

## Parte 4. JSON

> 🌎 **En la vida real:** JSON es el idioma internacional de los datos: las APIs, Firebase y tus archivos lo hablan.

> 🌎 **Otro ejemplo:** Es como un formulario estándar que entiende cualquier oficina.

### Convertir de ida y vuelta

```js
const texto = JSON.stringify({ app: 'Uber', valor: 32.5 });   // '{"app":"Uber","valor":32.5}'
const dato = JSON.parse(texto);                                 // vuelve a ser objeto
JSON.parse('esto no es json');                                  // SyntaxError → usa try/catch
```

`localStorage` solo guarda texto: por eso este mapa usa `JSON.stringify` para guardar tus bombillos y `JSON.parse` para leerlos.

> 🌎 **En la vida real:** es como meter una carta en un sobre para mandarla (stringify) y abrirla al recibirla (parse).

> 🌎 **Otro ejemplo:** Es como empacar una mudanza en cajas y desempacar al llegar.

```practica
vf :: JSON.stringify convierte un objeto en texto
vf :: localStorage puede guardar objetos directamente, sin convertirlos
elige :: ¿Qué pasa con JSON.parse('hola')? :: Devuelve 'hola' :: Lanza un SyntaxError :: Devuelve null
elige :: ¿Para qué usa este mapa JSON.stringify? :: Para dibujar :: Para guardar tus bombillos en localStorage :: Para el sonido
escribe :: Escribe cómo guardar y leer un objeto en localStorage. :: localStorage.setItem('datos', JSON.stringify(obj)); const leido = JSON.parse(localStorage.getItem('datos'));
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué métodos de arrays usas más?":** "map para transformar, por ejemplo datos en componentes de React; filter para quedarme con algunos; reduce para totales; find y some para buscar. No cambio los arrays ni los objetos originales: creo copias con spread o toSorted, porque React detecta cambios así. Desestructuro props y el resultado de useState, y uso JSON.stringify y JSON.parse para guardar o mandar datos."

> 🌎 **En la vida real:** es como un mecánico nombrando las cuatro llaves que más usa.

> 🌎 **Otro ejemplo:** Es como un cocinero que explica sus cuchillos favoritos.
