# Node.js 9: proyecto final, la API de gastos

> 🌎 **En la vida real:** el aprendiz de cocinero ya sabe cortar, freír y armar un plato. Su examen final es abrir la cocina una noche entera: recibir pedidos, cocinarlos en orden, no perder ninguno y entregarlos bien. Esta clase es tu noche entera en la cocina.

> 🎙️ **El profesor dice:** {{alumno}}, hoy juntas todo el curso en **una API de verdad**: la de los gastos del carro, la misma idea de la web de la clase 84, pero ahora del lado del servidor. Tiene Express, validación, un almacén que no pierde datos, CORS, límites, errores en un solo lugar, **32 pruebas** y una página que la usa. No la escribes de cero a ciegas: la **lees pieza por pieza**, entiendes por qué está hecha así, y en cada parte escribes tú una pieza en el ejercicio. Al final la corres en tu computadora y ves cómo se publica.

**Lo que vas a recorrer** (está completo en la carpeta `87-node-proyecto-api-de-gastos/proyecto` de este mismo repositorio):

| Pieza | Archivo | Su única tarea |
|---|---|---|
| La lógica | `src/gastos.mjs` | Las reglas: validar, crear, cambiar, borrar y el resumen. No sabe nada de HTTP |
| Los almacenes | `src/almacen.mjs` | Guardar y leer: en memoria (pruebas) o en un archivo JSON |
| El almacén de la nube | `src/almacen-firestore.mjs` | Lo mismo, pero en un documento de Firestore |
| Las rutas | `src/app.mjs` | Leer el pedido, llamar a la lógica y responder con el código justo |
| El arranque | `src/servidor.mjs` | Lo único que abre un puerto |
| La página | `publico/index.html` | Una pantalla que usa la API con `fetch` |
| Las pruebas | `test/*.test.mjs` | 32 pruebas con `node:test` y supertest |

## Parte 1. El plano: las rutas y las puertas y ventanas

Antes del código, el plano (como en la clase 79 del curso de IA):

1. **El problema:** la web de gastos guardaba en el navegador. Si el conductor cambia de celular, pierde todo. Hace falta un **servidor** que guarde los gastos y los entregue a cualquier pantalla.
2. **Lo que hace:** crear, listar (con filtros), ver uno, cambiar, borrar y un resumen por tipo.
3. **Lo que NO hace (por ahora):** cuentas de usuario. Todos los gastos son de una sola persona.
4. **Los datos:** cada gasto tiene `id`, `tipo` (combustible, lavado, peaje, mantenimiento u otro), `valor` (mayor que 0, hasta 100000), `fecha` (`AAAA-MM-DD`, un día que exista) y una `nota` opcional de hasta 80 letras.

**Las rutas** (REST, clase 72):

| Verbo | Ruta | Qué hace | Responde |
|---|---|---|---|
| GET | `/salud` | ¿Está vivo el servidor? | 200 `{ ok: true }` |
| GET | `/gastos?tipo=&desde=&hasta=` | La lista, con filtros opcionales | 200 |
| GET | `/gastos/resumen` | Total, cantidad y cuánto por tipo | 200 |
| GET | `/gastos/:id` | Un gasto | 200, o 404 si no existe |
| POST | `/gastos` | Crea uno | 201, o 400 con los detalles |
| PATCH | `/gastos/:id` | Cambia solo lo que viene | 200, 400 o 404 |
| DELETE | `/gastos/:id` | Lo borra | 204, o 404 |

**Las puertas y ventanas** (lo que se olvida si nadie lo dice):

| Caso | Qué hace la API |
|---|---|
| El id no es un número (`/gastos/abc`) | 400: "El id tiene que ser un número entero" |
| Una fecha que no existe (`2026-02-31`) | 400: no la acepta |
| Mandan un campo de más (`admin: true`) | Lo ignora |
| JSON roto | 400 "JSON inválido", sin el error interno |
| Un pedido gigante | 413 |
| Muchos pedidos de la misma IP | 429 al pasar el límite por minuto |
| Dos gastos llegan **a la vez** | Los dos se guardan, cada uno con su id |
| Una ruta que no existe | 404 en JSON, no una página de error |
| Un error de adentro | 500 "Algo salió mal": el detalle va al registro, no al usuario |

> 🌎 **En la vida real:** es la carta de un restaurante: qué platos hay, qué trae cada uno y qué pasa si pides algo que no está. El cocinero la escribe antes de abrir, no mientras llegan los clientes.

> 🌎 **Otro ejemplo:** las puertas y ventanas son como el reglamento de un estacionamiento: qué pasa si el ticket se pierde, si el carro no cabe o si llegan dos a la misma vaga. Si no está escrito, cada empleado inventa algo distinto.

Fíjate en un detalle del orden: `/gastos/resumen` se escribe **antes** que `/gastos/:id`. Express prueba las rutas de arriba hacia abajo, y `:id` encaja con cualquier palabra. Si `:id` fuera primero, "resumen" se tomaría como un id (lo viste en la clase 09).

> 🧩 **Piezas para este ejercicio**
> - Obtén primero el camino sin la consulta. En la búsqueda, revisa las rutas fijas antes de las rutas que aceptan un tramo variable, porque un mismo texto podría coincidir con ambas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Qué ruta responde?
lenguaje: js
pide: `queRuta(verbo, camino)` devuelve el nombre de la ruta que responde, probando en este orden: `GET /gastos` → `'listar'`; `GET /gastos/resumen` → `'resumen'`; `GET /gastos/:id` → `'ver'`; `POST /gastos` → `'crear'`; `PATCH /gastos/:id` → `'cambiar'`; `DELETE /gastos/:id` → `'borrar'`. Si ninguna encaja, `null`. Un `:id` encaja con cualquier pedazo, como en Express. Ignora lo que viene después de `?`.
--- código
const RUTAS = [
  ['GET', '/gastos', 'listar'],
  ['GET', '/gastos/resumen', 'resumen'],
  ['GET', '/gastos/:id', 'ver'],
  ['POST', '/gastos', 'crear'],
  ['PATCH', '/gastos/:id', 'cambiar'],
  ['DELETE', '/gastos/:id', 'borrar'],
];

function queRuta(verbo, camino) {
  // tu código aquí
}
--- pruebas
prueba('la lista, aunque traiga filtros', () => igual(queRuta('GET', '/gastos?tipo=peaje'), 'listar'));
prueba('resumen NO es un id', () => igual(queRuta('GET', '/gastos/resumen'), 'resumen'));
prueba('un id', () => igual(queRuta('GET', '/gastos/7'), 'ver'));
prueba('borrar uno', () => igual(queRuta('DELETE', '/gastos/7'), 'borrar'));
prueba('POST a un id no existe', () => igual(queRuta('POST', '/gastos/7'), null));
prueba('otra ruta', () => igual(queRuta('GET', '/viajes'), null));
--- solución
const RUTAS = [
  ['GET', '/gastos', 'listar'],
  ['GET', '/gastos/resumen', 'resumen'],
  ['GET', '/gastos/:id', 'ver'],
  ['POST', '/gastos', 'crear'],
  ['PATCH', '/gastos/:id', 'cambiar'],
  ['DELETE', '/gastos/:id', 'borrar'],
];

function queRuta(verbo, camino) {
  const partes = camino.split('?')[0].split('/');
  for (const [v, patron, nombre] of RUTAS) {
    if (v !== verbo) continue;
    const p = patron.split('/');
    if (p.length !== partes.length) continue;
    if (p.every((pedazo, i) => pedazo.startsWith(':') || pedazo === partes[i])) return nombre;
  }
  return null;
}
```

```practica
vf :: En esta API, /gastos/resumen tiene que estar escrito antes que /gastos/:id
vf :: Si alguien manda un campo admin: true al crear un gasto, la API lo guarda junto con el gasto
elige :: ¿Qué responde DELETE /gastos/5 si ese gasto ya no existe? :: 204 :: 404 :: 500
elige :: ¿Qué responde POST /gastos con una fecha 2026-02-31? :: 201, porque tiene la forma AAAA-MM-DD :: 400 con los detalles, porque ese día no existe :: 404
escribe :: Escribe tres "puertas y ventanas" de esta API y qué hace en cada una. :: Un id que no es número: 400. Dos gastos a la vez: los dos se guardan con ids distintos. Un error de adentro: 500 "Algo salió mal" sin detalles internos. (También: JSON roto, pedido gigante, demasiados pedidos, ruta que no existe, campo de más.)
```

## Parte 2. La lógica: las reglas, sin HTTP

`src/gastos.mjs` tiene las reglas. **No importa Express ni lee archivos**: recibe un "almacén" y solo le pide `leer()` y `guardar(lista)`. Por eso sus pruebas corren en milisegundos, sin servidor.

```js
export const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

/** Revisa los datos. Con parcial = true (PATCH), solo revisa lo que viene. */
export function validar(datos, parcial = false) {
  const errores = [];
  const revisa = (campo) => !parcial || campo in datos;
  if (revisa('tipo') && !TIPOS.includes(datos.tipo)) errores.push(`tipo debe ser uno de: ${TIPOS.join(', ')}`);
  if (revisa('valor') && !(typeof datos.valor === 'number' && datos.valor > 0 && datos.valor <= 100000)) {
    errores.push('valor debe ser un número mayor que 0 y hasta 100000');
  }
  if (revisa('fecha') && !existeElDia(datos.fecha)) errores.push('fecha debe ser AAAA-MM-DD');
  if ('nota' in datos && !(typeof datos.nota === 'string' && datos.nota.length <= 80)) errores.push('nota debe ser un texto de hasta 80 letras');
  return errores;
}
```

Tres ideas de esta función:

- **Devuelve la lista de errores**, no solo "sí o no". Así la API puede decirle a la persona **todo** lo que está mal de una vez.
- **`parcial`** es para PATCH: si solo cambias el valor, no te exige tipo ni fecha.
- **`typeof datos.valor === 'number'`**: el texto `"30"` no vale. Un número que llega como texto es una puerta abierta a errores (`"30" + 5` da `"305"`).

### Una trampa del calendario

La primera versión revisaba la fecha con `Date.parse`. Parecía bien, pero JavaScript **no avisa** cuando un día no existe: `new Date('2026-02-31')` se convierte solo en el 3 de marzo. Así entró a la API un gasto del 31 de febrero. Lo atrapó una prueba con `curl`, y ahora la regla arma la fecha y mira si, al leerla de vuelta, sigue siendo el mismo día:

```js
function existeElDia(texto) {
  if (typeof texto !== 'string' || !FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}
```

`m - 1` porque en JavaScript los meses empiezan en 0 (enero es 0), como viste en la clase 83. Y se usa `UTC` para que la zona horaria de la computadora no corra el día.

> 🌎 **En la vida real:** es como el portero que, además de mirar que el documento tenga la forma correcta, revisa que la fecha de nacimiento exista. Un documento con "31 de febrero" tiene la forma bien, pero es falso.

> 🌎 **Otro ejemplo:** es como un formulario del banco que te marca **todos** los campos mal llenados a la vez, en vez de avisarte uno, hacerte enviar otra vez y avisarte el siguiente.

> 🧩 **Piezas para este ejercicio**
> - Una fecha puede tener la forma correcta y aun así no existir. `Date.UTC` puede mover al mes siguiente un día fuera de rango. Compara los componentes UTC obtenidos con los de entrada.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Existe ese día?
lenguaje: js
pide: Completa `existeElDia(texto)`: devuelve `true` solo si el texto tiene la forma `AAAA-MM-DD` **y** ese día existe en el calendario (cuidado con febrero y los años bisiestos). Pista: arma la fecha con `new Date(Date.UTC(año, mes - 1, día))` y mira si el año, el mes y el día siguen siendo los mismos.
--- código
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function existeElDia(texto) {
  // tu código aquí
}
--- pruebas
prueba('un día normal', () => igual(existeElDia('2026-11-18'), true));
prueba('el 31 de febrero no existe', () => igual(existeElDia('2026-02-31'), false));
prueba('2028 es bisiesto: el 29 de febrero sí', () => igual(existeElDia('2028-02-29'), true));
prueba('2025 no es bisiesto', () => igual(existeElDia('2025-02-29'), false));
prueba('el mes 13 no existe', () => igual(existeElDia('2026-13-01'), false));
prueba('otra forma de escribirla no vale', () => igual(existeElDia('18/11/2026'), false));
prueba('un número no es una fecha', () => igual(existeElDia(20261118), false));
--- solución
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

function existeElDia(texto) {
  if (typeof texto !== 'string' || !FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}
```

```practica
vf :: La lógica de gastos.mjs importa Express para poder validar los pedidos
vf :: new Date('2026-02-31') da error en JavaScript
elige :: ¿Por qué validar devuelve una lista de errores? :: Porque es más corto :: Para decirle a la persona todo lo que está mal de una vez :: Porque Express lo exige
elige :: En un PATCH llega solo { valor: 50 }. ¿Qué revisa validar? :: Todo, y falla porque faltan tipo y fecha :: Solo el valor, porque es parcial :: Nada
escribe :: Explica con tus palabras por qué el texto "30" no vale como valor de un gasto. :: Porque tiene que ser un número de verdad. Si se guarda como texto, después las cuentas se rompen: "30" + 5 da "305" en vez de 35.
```

## Parte 3. Los almacenes y la fila: no perder ningún gasto

El almacén es **un contrato**: cualquier cosa que tenga `leer()` y `guardar(lista)` sirve. El proyecto trae tres:

| Almacén | Dónde guarda | Para qué |
|---|---|---|
| `crearAlmacenMemoria()` | En una variable | Las pruebas: rápido y empieza vacío |
| `crearAlmacenArchivo(ruta)` | En `datos/gastos.json` | Tu computadora: sobrevive si apagas el servidor |
| `crearAlmacenEnDocumento(doc)` | En un documento de Firestore | La nube (Parte 6) |

El de archivo tiene dos cuidados:

```js
guardar(nueva) {
  fila = fila.then(async () => {
    await mkdir(path.dirname(ruta), { recursive: true });
    const temporal = `${ruta}.tmp`;
    await writeFile(temporal, JSON.stringify(nueva, null, 2), 'utf8');
    await rename(temporal, ruta);   // si se corta la luz a la mitad, el archivo bueno no queda roto
  });
  return fila;
}
```

1. **Escribe en un archivo aparte y después lo renombra.** Renombrar es instantáneo: o queda el archivo viejo entero o el nuevo entero, nunca uno a medias.
2. **Una fila para escribir:** dos guardados nunca escriben el archivo al mismo tiempo.

### El error que encontramos: dos gastos a la vez

Probando la API con `curl`, se mandaron **dos gastos al mismo tiempo**. Los dos salieron con el `id: 2`, y al final **solo quedó uno guardado**: el otro desapareció. ¿Por qué, si había una fila?

Porque crear un gasto son **tres pasos**: leer la lista, agregar el gasto y guardar. La fila del archivo solo ordenaba el último paso. Pasaba esto:

| Momento | Pedido A (peaje) | Pedido B (otro) |
|---|---|---|
| 1 | Lee la lista: `[1]` | Lee la lista: `[1]` |
| 2 | Calcula id 2 | Calcula id 2 |
| 3 | Guarda `[1, peaje]` | |
| 4 | | Guarda `[1, otro]` y **pisa** el peaje |

El arreglo fue poner la fila **en el servicio**, alrededor del cambio entero:

```js
let fila = Promise.resolve();
const enFila = (paso) => {
  const resultado = fila.then(paso);
  fila = resultado.catch(() => {});   // si un cambio falla, la fila sigue con el próximo
  return resultado;
};

// crear, actualizar y borrar pasan por la fila:
crear(datos) {
  return enFila(async () => {
    const lista = await almacen.leer();
    // ...
  });
},
```

`fila.then(paso)` quiere decir "cuando termine lo anterior, haz este paso". Y el `.catch(() => {})` es para que **un** pedido que falla no trabe la fila para siempre. Antes del arreglo se escribió una prueba que manda dos gastos con `Promise.all` (clase 49): primero salió en rojo, y con la fila, en verde.

> 🌎 **En la vida real:** es la fila del banco con **un solo cajero** para tocar la caja fuerte. Si dos cajeros cuentan la misma plata a la vez y cada uno anota su total, uno de los dos borra la cuenta del otro.

> 🌎 **Otro ejemplo:** dos personas editan la misma lista de compras en papel: cada una copia la lista, agrega lo suyo y pega su copia en la nevera. La última copia que se pega borra lo que agregó la otra.

> 🧩 **Piezas para este ejercicio**
> - Cada llamada devuelve la promesa de su paso. Guarda otra promesa para que la fila pueda continuar aunque ese paso falle. Así el error llega a quien lo pidió y el siguiente puede comenzar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La fila que no pierde gastos
lenguaje: js
pide: Completa `crearFila()`: devuelve una función `enFila(paso)` que corre `paso` (una función `async`) **solo cuando terminó el anterior**, y devuelve una promesa con lo que devuelva `paso`. Si un paso lanza un error, esa promesa falla con ese error, pero **la fila sigue** con el próximo.
--- código
function crearFila() {
  let fila = Promise.resolve();
  return function enFila(paso) {
    // tu código aquí
  };
}
--- pruebas
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
function almacenLento() {
  let lista = [];
  return { async leer() { await espera(20); return [...lista]; }, async guardar(nueva) { await espera(20); lista = [...nueva]; } };
}
const crearGasto = (almacen, enFila, tipo) => enFila(async () => {
  const lista = await almacen.leer();
  const id = lista.length + 1;
  await almacen.guardar([...lista, { id, tipo }]);
  return id;
});
prueba('dos a la vez: cada uno con su id', async () => {
  const a = almacenLento(); const enFila = crearFila();
  igual(await Promise.all([crearGasto(a, enFila, 'peaje'), crearGasto(a, enFila, 'otro')]), [1, 2]);
});
prueba('dos a la vez: los dos quedan guardados', async () => {
  const a = almacenLento(); const enFila = crearFila();
  await Promise.all([crearGasto(a, enFila, 'peaje'), crearGasto(a, enFila, 'otro')]);
  igual((await a.leer()).map((g) => g.tipo), ['peaje', 'otro']);
});
prueba('si un paso falla, la fila sigue', async () => {
  const enFila = crearFila();
  let error = null;
  try { await enFila(async () => { throw new Error('se cortó'); }); } catch (e) { error = e.message; }
  igual(error, 'se cortó');
  igual(await enFila(async () => 'sigo'), 'sigo');
});
--- solución
function crearFila() {
  let fila = Promise.resolve();
  return function enFila(paso) {
    const resultado = fila.then(paso);
    fila = resultado.catch(() => {});
    return resultado;
  };
}
```

```practica
vf :: Cualquier objeto con leer() y guardar(lista) sirve como almacén para el servicio
vf :: Una fila solo alrededor de guardar() alcanza para que dos gastos que llegan a la vez no se pisen
elige :: ¿Para qué el almacén de archivo escribe primero en gastos.json.tmp y después lo renombra? :: Para que sea más rápido :: Para que, si se corta a la mitad, el archivo bueno no quede roto :: Para tener una copia de respaldo
elige :: En la fila, ¿para qué sirve fila = resultado.catch(() => {})? :: Para esconder los errores al usuario :: Para que un paso que falla no trabe la fila para siempre :: Para que vaya más rápido
escribe :: Cuenta, paso a paso, cómo se perdía un gasto cuando llegaban dos a la vez. :: Los dos pedidos leían la misma lista, los dos calculaban el mismo id, el primero guardaba su gasto y el segundo guardaba su lista, que no tenía el gasto del primero, y lo borraba. Con la fila, el segundo espera a que el primero termine de leer, cambiar y guardar.
```

## Parte 4. Las rutas: cortas y con el código justo

`src/app.mjs` arma la app de Express. Cada ruta hace solo tres cosas: **leer el pedido, llamar a la lógica, responder**.

```js
app.post('/gastos', async (pedido, respuesta) => {
  const errores = validar(pedido.body ?? {});
  if (errores.length) return respuesta.status(400).json({ error: 'Datos inválidos', detalles: errores });
  respuesta.status(201).json(await gastos.crear(pedido.body));
});

app.delete('/gastos/:id', async (pedido, respuesta) => {
  const id = leerId(pedido, respuesta);
  if (id === null) return;
  if (!(await gastos.borrar(id))) return respuesta.status(404).json({ error: 'No existe ese gasto' });
  respuesta.status(204).end();
});
```

Lo que lleva antes de las rutas, en orden (los middleware de la clase 71):

| Middleware | Para qué | Clase |
|---|---|---|
| `app.disable('x-powered-by')` | No contarle a nadie que usamos Express | 73 |
| `express.json({ limit: '10kb' })` | Leer el cuerpo JSON, con un tope de tamaño | 71 |
| `cors(origenes)` | Solo tus páginas pueden leer las respuestas | 72 |
| `limitePorMinuto(120)` | Frenar a quien manda demasiados pedidos | 73 |
| `express.static('publico')` | Servir la página que usa la API | 70 |

Y al final, **dos** cosas: la respuesta para rutas que no existen (404 en JSON) y el **manejador de errores** (clase 71), que reconoce el JSON roto (400) y el pedido gigante (413), y para todo lo demás anota el error en el registro y responde solo "Algo salió mal".

Otra idea importante: `crearApp()` **no abre ningún puerto**. Lo abre `servidor.mjs`. Así las pruebas usan la app directo, sin red, y el arranque queda en un solo lugar.

> 🌎 **En la vida real:** el mesero toma el pedido, lo lleva a la cocina y trae el plato. No cocina. Si el mesero también cocinara, cuando cambies de mesero tendrías que enseñarle a cocinar.

> 🌎 **Otro ejemplo:** el portero del edificio (middleware) revisa quién entra antes de que llegues al apartamento (la ruta). Si no pasas el portero, ni subes.

> 🧩 **Piezas para este ejercicio**
> - Convierte el id a número antes de comprobar que sea entero y positivo. Para elegir el código, distingue primero el caso de recurso ausente y después el tipo de operación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El id y el código justo
lenguaje: js
pide: Completa dos funciones. `leerId(texto)` devuelve el número si es un **entero de 1 para arriba**; si no, `null`. `codigoPara(accion, resultado)` devuelve el código HTTP: si `resultado` es `null` o `false`, `404`; si no, `201` para `'crear'`, `204` para `'borrar'` y `200` para lo demás.
--- código
function leerId(texto) {
  // tu código aquí
}

function codigoPara(accion, resultado) {
  // tu código aquí
}
--- pruebas
prueba('un id bueno', () => igual(leerId('3'), 3));
prueba('ids que no valen', () => igual(['abc', '0', '-1', '2.5', ''].map(leerId), [null, null, null, null, null]));
prueba('crear bien: 201', () => igual(codigoPara('crear', { id: 1 }), 201));
prueba('borrar bien: 204', () => igual(codigoPara('borrar', true), 204));
prueba('borrar algo que no existe: 404', () => igual(codigoPara('borrar', false), 404));
prueba('ver uno que no existe: 404', () => igual(codigoPara('ver', null), 404));
prueba('ver bien: 200', () => igual(codigoPara('ver', { id: 1 }), 200));
--- solución
function leerId(texto) {
  const id = Number(texto);
  return Number.isInteger(id) && id >= 1 ? id : null;
}

function codigoPara(accion, resultado) {
  if (resultado === null || resultado === false) return 404;
  if (accion === 'crear') return 201;
  if (accion === 'borrar') return 204;
  return 200;
}
```

```practica
vf :: crearApp() abre el puerto 3000 apenas se llama
vf :: Si una ruta lanza un error, el usuario recibe 500 "Algo salió mal" y el detalle queda en el registro
elige :: ¿Por qué express.json lleva limit: '10kb'? :: Para que la API sea más rápida :: Para que nadie la trabe mandando un cuerpo gigante :: Porque JSON no acepta más
elige :: Una ruta de esta API, ¿qué hace? :: Valida, calcula el resumen y guarda el archivo :: Lee el pedido, llama a la lógica y responde con el código justo :: Solo responde 200
escribe :: ¿Por qué el código de crear es 201 y el de borrar es 204? :: 201 quiere decir "creado" y trae el gasto nuevo con su id. 204 quiere decir "listo, sin nada que mostrar": después de borrar no hay nada que devolver.
```

## Parte 5. Correrla en tu computadora y sus 32 pruebas

### Bajarla y correrla

```bash
git clone --depth 1 https://github.com/DelvinSmart/estudios.git
cd estudios/87-node-proyecto-api-de-gastos/proyecto
npm install
npm test
```

- `git clone --depth 1` baja el repositorio sin todo su historial (más rápido).
- `npm install` baja Express y supertest a `node_modules/` (está en `.gitignore`: no se sube).
- `npm test` corre `node --test`: tienen que salir **32 pruebas en verde**.

Después, préndela:

```bash
npm start
```

Debe decir `API de gastos lista en http://localhost:3000`. Abre esa dirección en el navegador: sale la página que usa la API. Y desde **otra** terminal, prueba con `curl` (clase 09):

```bash
curl -s -X POST localhost:3000/gastos -H 'Content-Type: application/json' -d '{"tipo":"lavado","valor":30,"fecha":"2026-11-18"}'
curl -s localhost:3000/gastos/resumen
```

La primera responde el gasto con su `id: 1`. La segunda, `{"total":30,"cantidad":1,"porTipo":{"lavado":30}}`. Los gastos quedan en `datos/gastos.json`: apaga el servidor con `Ctrl + C`, préndelo otra vez, y siguen ahí.

### Las pruebas, en tres capas

| Archivo | Qué prueba | Cómo |
|---|---|---|
| `test/gastos.test.mjs` | La lógica: validar, el CRUD, el resumen, la fila | Con el almacén en memoria, sin servidor |
| `test/almacen.test.mjs` | Los almacenes de archivo y de Firestore | Una carpeta temporal que se borra, y un documento de mentira |
| `test/api.test.mjs` | Las rutas de punta a punta | supertest, sin abrir ningún puerto (clase 74) |

Una prueba de la API se ve así:

```js
beforeEach(() => {
  app = crearApp({ almacen: crearAlmacenMemoria(), origenes: ['http://localhost:5173'], registro: silencio });
});

test('crear con datos inválidos: 400 con los detalles', async () => {
  const r = await request(app).post('/gastos').send({ tipo: 'lavado', valor: -5, fecha: bueno.fecha });
  assert.equal(r.status, 400);
  assert.equal(r.body.detalles.length, 1);
});
```

`beforeEach` arma una app nueva, con un almacén en memoria vacío, **antes de cada prueba**: así una prueba nunca depende de lo que dejó la anterior. Y `registro: silencio` es un registro que no escribe nada, para que el error de prueba no ensucie la terminal.

Y recuerda lo que pasó con los dos errores de esta clase: **las pruebas viejas pasaban todas**, y aun así había dos errores. Los encontró una prueba de verdad con `curl`. Por eso, cada vez que encuentras un error, **primero** escribes la prueba que lo atrapa (en rojo), y **después** lo arreglas (en verde). Así ese error no vuelve nunca.

> 🌎 **En la vida real:** es como el mecánico que, después de cambiar los frenos, no solo mira la pieza: sale a dar una vuelta y frena de verdad. Y si encuentra un ruido, lo anota en la lista de revisión para todos los carros siguientes.

> 🌎 **Otro ejemplo:** las tres capas de pruebas son como revisar una casa: la tubería sola, después cada cuarto, y al final abrir todas las canillas a la vez.

> 🧩 **Piezas para este ejercicio**
> - Acumula el total general y un total por tipo. Redondea al final de cada suma para que los valores intermedios sigan siendo numéricos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El resumen de la API
lenguaje: js
pide: Completa `resumen(lista)`: devuelve `{ total, cantidad, porTipo }`. `total` es la suma de los valores, `cantidad` cuántos gastos hay y `porTipo` cuánto se gastó en cada tipo. Redondea a **dos decimales** el total y cada tipo (con `redondear`), porque `0.1 + 0.2` en JavaScript no da `0.3` exacto.
--- código
const redondear = (n) => Math.round(n * 100) / 100;

function resumen(lista) {
  // tu código aquí
}
--- pruebas
prueba('sin gastos', () => igual(resumen([]), { total: 0, cantidad: 0, porTipo: {} }));
prueba('junta por tipo', () => igual(resumen([{ tipo: 'lavado', valor: 30 }, { tipo: 'peaje', valor: 5 }, { tipo: 'peaje', valor: 7 }]), { total: 42, cantidad: 3, porTipo: { lavado: 30, peaje: 12 } }));
prueba('los centavos no se descontrolan', () => igual(resumen([{ tipo: 'peaje', valor: 0.1 }, { tipo: 'peaje', valor: 0.2 }]), { total: 0.3, cantidad: 2, porTipo: { peaje: 0.3 } }));
--- solución
const redondear = (n) => Math.round(n * 100) / 100;

function resumen(lista) {
  const porTipo = {};
  for (const g of lista) porTipo[g.tipo] = redondear((porTipo[g.tipo] ?? 0) + g.valor);
  return { total: redondear(lista.reduce((s, g) => s + g.valor, 0)), cantidad: lista.length, porTipo };
}
```

```practica
vf :: Si todas las pruebas pasan, el programa no tiene ningún error
vf :: Cuando encuentras un error, conviene escribir primero la prueba que lo atrapa y después arreglarlo
elige :: ¿Por qué api.test.mjs no necesita abrir el puerto 3000? :: Porque no prueba nada de verdad :: Porque supertest usa la app de crearApp() directo, sin red :: Porque el puerto ya está abierto
elige :: ¿Qué hace npm install en este proyecto? :: Sube el proyecto a GitHub :: Baja Express y supertest a node_modules :: Corre las pruebas
escribe :: Escribe los comandos para bajar el proyecto, correr sus pruebas y prenderlo. :: git clone --depth 1 https://github.com/DelvinSmart/estudios.git, después cd estudios/87-node-proyecto-api-de-gastos/proyecto, npm install, npm test (32 en verde) y npm start. Queda en http://localhost:3000.
```

## Parte 6. Publicarla: cambiar solo el almacén

En tu computadora, los gastos van a `datos/gastos.json`. En la nube, ese archivo **no sirve**: en Cloud Functions (clase 74) cada copia del servidor tiene su propio disco temporal, que se borra cuando la copia se apaga. Los gastos se perderían.

La solución no es cambiar la API: es **cambiar solo el almacén**. Para eso se separó todo con el contrato `leer()` / `guardar(lista)`:

```js
// src/almacen-firestore.mjs
export function crearAlmacenEnDocumento(doc) {
  return {
    async leer() {
      const foto = await doc.get();
      return foto.exists ? foto.data().lista ?? [] : [];
    },
    async guardar(lista) {
      await doc.set({ lista, cambiado: new Date().toISOString() });
    },
  };
}
```

No importa `firebase-admin`: recibe el documento ya armado. Por eso sus pruebas usan un **documento de mentira** (con `get()` y `set()` que guardan en una variable), sin internet y sin cuenta. Y la prueba más importante es esta: **el mismo servicio funciona sin cambiar una línea**.

Publicada como función (como en la clase 74), quedaría así:

```js
// funcion.mjs
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { crearApp } from './src/app.mjs';
import { crearAlmacenEnDocumento } from './src/almacen-firestore.mjs';

initializeApp();
const app = crearApp({
  almacen: crearAlmacenEnDocumento(getFirestore().doc('gastos/lista')),
  origenes: ['https://TU-USUARIO.github.io'],
});
export const api = onRequest({ maxInstances: 1 }, app);
```

Dos cosas que hay que saber, para no engañarte:

- **`maxInstances: 1`** deja una sola copia del servidor. Así la fila de la Parte 3 alcanza, porque todos los pedidos pasan por la misma fila. Con varias copias, cada una tendría su propia fila, y haría falta una **transacción** de Firestore, que ordena los cambios en la base de datos misma.
- **Todo en un documento** sirve para una persona y unos cientos de gastos (un documento de Firestore aguanta hasta 1 MB). Para muchos usuarios, cada gasto iría en su propio documento, dentro de `usuarios/{uid}/gastos`, con las reglas de la clase 08.

### Entrega local y publicación opcional

Completa los pasos 1 a 3 para entregar el proyecto sin contratar alojamiento. Los pasos 4 a 6 son para el despliegue opcional. Cloud Functions requiere facturación en Blaze y pueden generarse cargos.

1. `npm test`: 32 en verde.
2. Con `npm start` y `curl`: crear, listar, cambiar, borrar y el resumen.
3. Los casos raros: id `abc`, fecha `2026-02-31`, JSON roto y dos gastos a la vez.
4. `origenes` tiene **solo** tus páginas.
5. Ningún secreto en el código (clase 73).
6. `maxInstances` bajo y el límite por minuto puesto, para ayudar a controlar el consumo.

> 🌎 **En la vida real:** te mudas de casa y te llevas los mismos muebles. Cambia el lugar donde guardas las cosas, pero el sofá, la mesa y la cama son los mismos. Si los hubieras pegado a las paredes de la casa vieja, no podrías mudarte.

> 🌎 **Otro ejemplo:** es como cambiar la billetera por una cuenta en el banco: sigues pagando igual (meter y sacar plata), solo cambia dónde está guardada.

> 🧩 **Piezas para este ejercicio**
> - La consulta al documento puede terminar con una foto vacía. Revisa `exists` antes de llamar a `data()`. Para guardar, el documento espera un objeto que contenga la lista.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Mudar el almacén a la nube
lenguaje: js
pide: Completa `crearAlmacenEnDocumento(doc)`: devuelve `{ leer, guardar }`. `doc` es como un documento de Firestore: `await doc.get()` da una foto con `exists` (verdadero o falso) y `data()`; `await doc.set(objeto)` lo guarda. `leer()` devuelve `data().lista`, o `[]` si el documento no existe. `guardar(lista)` guarda `{ lista }`.
--- código
function crearAlmacenEnDocumento(doc) {
  return {
    async leer() {
      // tu código aquí
    },
    async guardar(lista) {
      // tu código aquí
    },
  };
}
--- pruebas
function documentoDeMentira() {
  let datos = null;
  return {
    async get() { return { exists: datos !== null, data: () => structuredClone(datos) }; },
    async set(nuevos) { datos = structuredClone(nuevos); },
  };
}
prueba('sin documento: lista vacía', async () => igual(await crearAlmacenEnDocumento(documentoDeMentira()).leer(), []));
prueba('guarda y lee lo mismo', async () => {
  const a = crearAlmacenEnDocumento(documentoDeMentira());
  await a.guardar([{ id: 1, tipo: 'peaje', valor: 5 }]);
  igual(await a.leer(), [{ id: 1, tipo: 'peaje', valor: 5 }]);
});
prueba('lo guarda dentro de "lista"', async () => {
  const doc = documentoDeMentira();
  await crearAlmacenEnDocumento(doc).guardar([{ id: 1 }]);
  igual((await doc.get()).data().lista, [{ id: 1 }]);
});
--- solución
function crearAlmacenEnDocumento(doc) {
  return {
    async leer() {
      const foto = await doc.get();
      return foto.exists ? foto.data().lista ?? [] : [];
    },
    async guardar(lista) {
      await doc.set({ lista });
    },
  };
}
```

```practica
vf :: En Cloud Functions, guardar en datos/gastos.json sirve igual que en tu computadora
vf :: Para publicar en la nube hubo que cambiar la lógica y las rutas
elige :: ¿Por qué el almacén de Firestore recibe el documento en vez de importar firebase-admin? :: Porque firebase-admin no funciona en Node :: Para poder probarlo con un documento de mentira, sin internet ni cuenta :: Porque es más corto
elige :: Con maxInstances: 1, ¿por qué alcanza la fila de la Parte 3? :: Porque Firestore no acepta dos pedidos :: Porque hay una sola copia del servidor y todos los pedidos pasan por la misma fila :: No alcanza nunca
escribe :: Explica con tus palabras qué es "el contrato del almacén" y para qué sirvió en este proyecto. :: Es la promesa de que todo almacén tiene leer() y guardar(lista). Gracias a eso, el mismo servicio funciona con memoria en las pruebas, con un archivo en mi computadora y con Firestore en la nube, sin cambiar la lógica ni las rutas.
```


**Comprobación antes de seguir**

Entrega la API local con un resumen correcto, una fecha inválida rechazada y dos gastos simultáneos conservados.

<details>
<summary>Necesito una pista</summary>

Comprueba el estado final del almacén, además de las respuestas de cada solicitud.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué hiciste con Node.js?":** "Una API REST de gastos del carro con Express. La separé en capas: la lógica, que no sabe nada de HTTP; las rutas, que solo leen el pedido, llaman a la lógica y responden con el código justo (201, 204, 400, 404); y un almacén con un contrato de dos funciones, `leer` y `guardar`. Por eso tengo tres almacenes (memoria para las pruebas, un archivo JSON y Firestore para la nube) y la API no cambia. Tiene validación con todos los errores de una vez, campos permitidos, CORS solo para mis páginas, límite por minuto, tope de tamaño y errores en un solo lugar, sin mostrar nada interno. Tiene 32 pruebas con node:test y supertest. Probándola con curl encontré dos errores que las pruebas no veían: dos gastos que llegaban a la vez se pisaban, y aceptaba el 31 de febrero. Escribí primero la prueba que los atrapaba, en rojo, y los arreglé con una fila para los cambios y comprobando que el día exista."

> 🌎 **En la vida real:** es como contar una noche entera en la cocina: cómo estaba organizada, qué pedido salió mal, cómo te diste cuenta y qué cambiaste para que no vuelva a pasar. Eso dice más de ti que decir que todo salió perfecto.

> 🌎 **Otro ejemplo:** es como explicar cómo armaste tu taller: dónde va cada herramienta, por qué, y qué cambiarías si te mudas a un local más grande.
