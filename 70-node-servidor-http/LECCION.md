# Node.js 3: tu primer servidor HTTP

> 🌎 **En la vida real:** un servidor es como la ventanilla de un banco: llega alguien con un pedido, la ventanilla lo atiende y le devuelve una respuesta. Siempre abierta, atendiendo uno tras otro.

> 🎙️ **El profesor dice:** hoy armas un servidor **sin ninguna librería**, solo con `node:http`, para ver qué pasa "por dentro": el pedido (request), la respuesta (response), las rutas, los códigos de estado y cómo devolver JSON. En la próxima clase lo harás más fácil con Express, pero así entiendes qué hace Express por ti.

## Parte 1. Pedido y respuesta

> 🌎 **En la vida real:** el pedido dice "qué quiero" y "dónde"; la respuesta dice "aquí está" o "no se pudo".

> 🌎 **Otro ejemplo:** Es como pedir una pizza por teléfono: dices qué y adónde; te responden con el pedido o con "no hay".

### Un servidor de 6 líneas

```js
// servidor.mjs
import { createServer } from 'node:http';

const servidor = createServer((pedido, respuesta) => {
  respuesta.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  respuesta.end('¡Hola, conductor!');
});
servidor.listen(3000, () => console.log('Escuchando en http://localhost:3000'));
```

```bash
node servidor.mjs
curl http://localhost:3000
```

La función se ejecuta **una vez por cada pedido**. `pedido` trae qué te pidieron; con `respuesta` contestas.

> 🌎 **En la vida real:** es como un timbre que cada vez que suena te hace ir a la puerta.

> 🌎 **Otro ejemplo:** Es como el cajero que repite lo mismo con cada cliente de la fila.

### Lo que trae un pedido

- `pedido.method`: el **verbo**: `GET` (leer), `POST` (crear), `PUT`/`PATCH` (cambiar), `DELETE` (borrar).
- `pedido.url`: la **ruta**: `/gastos`, `/gastos/3?mes=11`.
- `pedido.headers`: datos extra (qué formato manda, quién es).
- El **cuerpo**: lo que manda en un `POST` (por ejemplo, el gasto nuevo en JSON).

Cada pareja de verbo y ruta que tu servidor atiende (`GET /gastos`, `POST /gastos`) es un **endpoint**: una "ventanilla" del servidor que hace una sola cosa.

> 🌎 **En la vida real:** el verbo es "quiero ver" o "quiero dejar"; la ruta es "en la ventanilla de gastos".

> 🌎 **Otro ejemplo:** Es como un sobre: el remitente, la dirección y la carta adentro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Desarmar el pedido
lenguaje: js
pide: Completa `leerPedido(metodo, url)`: devuelve `{ verbo, ruta, consulta }` donde `ruta` es la parte antes del `?` y `consulta` es un objeto con lo de después (`/gastos/3?mes=11&tipo=lavado` → `{ mes: '11', tipo: 'lavado' }`). Usa `new URL(url, 'http://localhost')`.
--- código
function leerPedido(metodo, url) {
  // tu código aquí
}
--- pruebas
prueba('con consulta', () => igual(leerPedido('GET', '/gastos/3?mes=11&tipo=lavado'), { verbo: 'GET', ruta: '/gastos/3', consulta: { mes: '11', tipo: 'lavado' } }));
prueba('sin consulta', () => igual(leerPedido('POST', '/gastos'), { verbo: 'POST', ruta: '/gastos', consulta: {} }));
--- solución
function leerPedido(metodo, url) {
  const u = new URL(url, 'http://localhost');
  return { verbo: metodo, ruta: u.pathname, consulta: Object.fromEntries(u.searchParams) };
}
```

```practica
vf :: La función de createServer se ejecuta una vez por cada pedido
vf :: El verbo GET se usa para crear datos nuevos
elige :: ¿Qué guarda pedido.url? :: El cuerpo :: La ruta pedida, como /gastos/3 :: El verbo
elige :: ¿Qué hace servidor.listen(3000)? :: Apaga el servidor :: Lo pone a escuchar pedidos en el puerto 3000 :: Borra el puerto
escribe :: Nombra los cuatro verbos principales y para qué sirve cada uno. :: GET para leer, POST para crear, PUT o PATCH para cambiar y DELETE para borrar.
```

## Parte 2. Rutas, JSON y códigos de estado

> 🌎 **En la vida real:** en un banco hay ventanillas distintas: depósitos, préstamos, reclamos. Cada ruta es una ventanilla.

> 🌎 **Otro ejemplo:** Es como el menú de un teléfono de atención: "marque 1 para…".

### Responder JSON según la ruta

```js
const gastos = [{ id: 1, tipo: 'lavado', valor: 30 }];

function enviarJson(respuesta, estado, datos) {
  respuesta.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  respuesta.end(JSON.stringify(datos));
}

const servidor = createServer((pedido, respuesta) => {
  const { pathname } = new URL(pedido.url, 'http://localhost');
  if (pedido.method === 'GET' && pathname === '/gastos') return enviarJson(respuesta, 200, gastos);
  const coincide = pathname.match(/^\/gastos\/(\d+)$/);
  if (pedido.method === 'GET' && coincide) {
    const g = gastos.find((x) => x.id === Number(coincide[1]));
    return g ? enviarJson(respuesta, 200, g) : enviarJson(respuesta, 404, { error: 'No existe ese gasto' });
  }
  enviarJson(respuesta, 404, { error: 'Ruta no encontrada' });
});
```

> 🌎 **En la vida real:** es como el recepcionista que mira tu pedido y te manda a la ventanilla correcta.

> 🌎 **Otro ejemplo:** Es como un distribuidor de cartas por dirección.

### Los códigos de estado

| Código | Significa |
|---|---|
| `200` | Todo bien |
| `201` | Se creó algo nuevo |
| `204` | Listo, sin nada que devolver (por ejemplo, al borrar) |
| `400` | El pedido está mal (datos inválidos) |
| `401` / `403` | No sabemos quién eres / no tienes permiso |
| `404` | No existe |
| `500` | Error del servidor |

Son los mismos de la clase 09.

> 🌎 **En la vida real:** son como las caras del empleado: sonrisa (200), "llenó mal el formulario" (400), "eso no existe" (404).

> 🌎 **Otro ejemplo:** Es como las luces de un semáforo, pero con más colores.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un servidor sin librerías
lenguaje: js
pide: Escribe el manejador de pedidos de la clase, sin `node:http` (aquí lo probamos con objetos de mentira). `manejar(pedido)` recibe `{ method, url }` y devuelve `{ estado, cuerpo }`: `GET /gastos` → 200 con la lista; `GET /gastos/1` → 200 con ese gasto o 404 `{ error: 'No existe ese gasto' }`; cualquier otra → 404 `{ error: 'Ruta no encontrada' }`.
--- código
const gastos = [{ id: 1, tipo: 'lavado', valor: 30 }];

function manejar(pedido) {
  // tu código aquí
}
--- pruebas
prueba('la lista', () => igual(manejar({ method: 'GET', url: '/gastos' }), { estado: 200, cuerpo: gastos }));
prueba('uno', () => igual(manejar({ method: 'GET', url: '/gastos/1' }), { estado: 200, cuerpo: gastos[0] }));
prueba('uno que no existe', () => igual(manejar({ method: 'GET', url: '/gastos/9' }), { estado: 404, cuerpo: { error: 'No existe ese gasto' } }));
prueba('otra ruta', () => igual(manejar({ method: 'GET', url: '/nada' }).cuerpo, { error: 'Ruta no encontrada' }));
prueba('otro verbo', () => igual(manejar({ method: 'DELETE', url: '/gastos' }).estado, 404));
--- solución
const gastos = [{ id: 1, tipo: 'lavado', valor: 30 }];

function manejar(pedido) {
  const { pathname } = new URL(pedido.url, 'http://localhost');
  if (pedido.method === 'GET' && pathname === '/gastos') return { estado: 200, cuerpo: gastos };
  const coincide = pathname.match(/^\/gastos\/(\d+)$/);
  if (pedido.method === 'GET' && coincide) {
    const g = gastos.find((x) => x.id === Number(coincide[1]));
    return g ? { estado: 200, cuerpo: g } : { estado: 404, cuerpo: { error: 'No existe ese gasto' } };
  }
  return { estado: 404, cuerpo: { error: 'Ruta no encontrada' } };
}
```

```practica
vf :: 404 significa que lo pedido no existe
vf :: Cuando se crea algo nuevo, lo correcto es responder 500
elige :: ¿Qué cabecera dice que la respuesta es JSON? :: Accept: html :: Content-Type: application/json :: Server: json
elige :: Un pedido trae un valor negativo para un gasto. ¿Qué código respondes? :: 200 :: 400 :: 404
escribe :: ¿Qué responderías al pedir GET /gastos/99 si ese gasto no existe? :: Un 404 con un JSON que explique el error, por ejemplo { "error": "No existe ese gasto" }.
```

## Parte 3. Leer el cuerpo de un POST

> 🌎 **En la vida real:** un POST es como mandar un paquete por correo: el contenido llega en partes y hay que esperar a que esté completo para abrirlo.

> 🌎 **Otro ejemplo:** Es como recibir un mensaje de voz largo: escuchas cuando terminó de llegar.

### El cuerpo llega en pedazos

```js
async function leerJson(pedido) {
  let texto = '';
  for await (const pedazo of pedido) {
    texto += pedazo;
    if (texto.length > 10_000) throw new Error('demasiado grande');   // no aceptes cualquier tamaño
  }
  return JSON.parse(texto || '{}');
}

// dentro del servidor:
if (pedido.method === 'POST' && pathname === '/gastos') {
  try {
    const nuevo = await leerJson(pedido);
    if (!(nuevo.valor > 0)) return enviarJson(respuesta, 400, { error: 'El valor tiene que ser mayor que 0' });
    const gasto = { id: gastos.length + 1, tipo: String(nuevo.tipo ?? 'otro'), valor: Number(nuevo.valor) };
    gastos.push(gasto);
    return enviarJson(respuesta, 201, gasto);
  } catch {
    return enviarJson(respuesta, 400, { error: 'JSON inválido' });
  }
}
```

Fíjate en todo lo que tuviste que hacer a mano: leer en pedazos, limitar el tamaño, convertir el JSON, validar. **Express** (próxima clase) hace casi todo eso por ti.

> 🌎 **En la vida real:** es como armar un mueble sin instrucciones: se puede, pero entiendes por qué las instrucciones existen.

> 🌎 **Otro ejemplo:** Es como cocinar el pan desde la harina antes de comprarlo hecho.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer el cuerpo en pedazos, con límite
lenguaje: js
pide: El cuerpo de un POST llega en pedazos. Completa la función `async` `leerJson(pedazos, limite)`: recorre con `for await` y junta el texto; si pasa del `limite` de letras, lanza `Error('demasiado grande')`; al final, devuelve `JSON.parse` del texto (o `{}` si llegó vacío).
--- código
async function* llegando(...partes) { for (const p of partes) yield p; }

async function leerJson(pedazos, limite) {
  // tu código aquí
}
--- pruebas
prueba('junta los pedazos', async () => igual(await leerJson(llegando('{"tipo":', '"lavado","valor":30}'), 100), { tipo: 'lavado', valor: 30 }));
prueba('vacío: {}', async () => igual(await leerJson(llegando(), 100), {}));
prueba('demasiado grande', async () => { let m = ''; try { await leerJson(llegando('x'.repeat(60), 'x'.repeat(60)), 100); } catch (e) { m = e.message; } igual(m, 'demasiado grande'); });
--- solución
async function* llegando(...partes) { for (const p of partes) yield p; }

async function leerJson(pedazos, limite) {
  let texto = '';
  for await (const pedazo of pedazos) {
    texto += pedazo;
    if (texto.length > limite) throw new Error('demasiado grande');
  }
  return JSON.parse(texto || '{}');
}
```

```practica
vf :: El cuerpo de un POST puede llegar en varios pedazos
vf :: Conviene aceptar cuerpos de cualquier tamaño
elige :: Si el cuerpo no es JSON válido, ¿qué respondes? :: 200 :: 400 con un mensaje de error :: 201
elige :: ¿Qué código respondes al crear el gasto bien? :: 200 :: 201 :: 204
escribe :: Nombra tres cosas que hiciste a mano en este servidor y que Express hace por ti. :: Leer el cuerpo en pedazos, convertir el JSON con límite de tamaño, y separar las rutas por verbo y dirección.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿sabes cómo funciona un servidor por dentro?":** "Sí: con node:http, cada pedido llega con un verbo, una ruta, cabeceras y a veces un cuerpo que llega en pedazos. Respondo con un código de estado y un cuerpo, normalmente JSON con su Content-Type. Separo las rutas por verbo y dirección, valido lo que llega, limito el tamaño del cuerpo y uso los códigos correctos: 200, 201, 400, 404. Express hace eso más cómodo, pero sé lo que hay debajo."

> 🌎 **En la vida real:** es como un mecánico que sabe cambiar una pieza a mano, aunque normalmente use la herramienta eléctrica.

> 🌎 **Otro ejemplo:** Es como un cocinero que sabe hacer la masa, aunque a veces la compre hecha.
