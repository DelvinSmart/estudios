# Node.js 5: una API REST completa

> 🌎 **En la vida real:** una API es como el mostrador de una tienda con reglas claras: dónde pedir, qué decir y qué te entregan. Si todos siguen las mismas reglas, cualquier app puede comprar ahí.

> 🎙️ **El profesor dice:** hoy juntas todo en una **API REST** de gastos: el CRUD completo (como el laboratorio y la clase 09), validación de lo que llega, respuestas consistentes, CORS para que tu web la pueda usar, y la separación entre las rutas y la lógica.

## Parte 1. REST: recursos y verbos

> 🌎 **En la vida real:** en una biblioteca, el recurso es el libro; los verbos son prestar, devolver, renovar, consultar.

> 🌎 **Otro ejemplo:** Es como una oficina de correos: el paquete es el recurso; enviar, rastrear y retirar son los verbos.

### Las rutas del CRUD

| Verbo y ruta | Hace | Responde |
|---|---|---|
| `GET /gastos` | Lista (con filtros `?tipo=lavado`) | `200` y la lista |
| `GET /gastos/:id` | Uno | `200`, o `404` |
| `POST /gastos` | Crea | `201` y el creado, o `400` |
| `PATCH /gastos/:id` | Cambia algunos campos | `200`, `400` o `404` |
| `DELETE /gastos/:id` | Borra | `204`, o `404` |

**REST** es una forma de ordenar una API: las rutas nombran **cosas** (sustantivos, en plural) y el verbo HTTP dice **qué hacer**. Nada de `/borrarGasto?id=3`.

> 🌎 **En la vida real:** es como las señales de tránsito internacionales: cualquiera las entiende.

> 🌎 **Otro ejemplo:** Es como los íconos de un tablero de carro: el mismo dibujo en todas las marcas.

> 🧩 **Piezas para este ejercicio**
> - Divide la ruta por `/` para revisar cada tramo. Pasa los tramos a minúsculas antes de compararlos. `.startsWith(...)` comprueba únicamente el principio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Es una ruta REST?
lenguaje: js
pide: En REST las rutas nombran **cosas** (sustantivos en plural) y el verbo dice qué hacer. Completa `esRest(ruta)`: `false` si algún pedazo de la ruta empieza con un verbo de acción (`borrar`, `crear`, `editar`, `listar`, `get`, `delete`, `update`), sin importar mayúsculas; si no, `true`.
--- código
const VERBOS = ['borrar', 'crear', 'editar', 'listar', 'get', 'delete', 'update'];

function esRest(ruta) {
  // tu código aquí
}
--- pruebas
prueba('/gastos', () => igual(esRest('/gastos'), true));
prueba('/gastos/3', () => igual(esRest('/gastos/3'), true));
prueba('/borrarGasto/3', () => igual(esRest('/borrarGasto/3'), false));
prueba('/api/getGastos', () => igual(esRest('/api/getGastos'), false));
--- solución
const VERBOS = ['borrar', 'crear', 'editar', 'listar', 'get', 'delete', 'update'];

function esRest(ruta) {
  return !ruta.split('/').some((p) => VERBOS.some((v) => p.toLowerCase().startsWith(v)));
}
```

```practica
vf :: En REST, las rutas nombran cosas y el verbo dice qué hacer
vf :: /borrarGasto?id=3 es una ruta REST bien hecha
elige :: ¿Qué responde DELETE /gastos/3 si lo borró? :: 201 :: 204 :: 400
elige :: ¿Qué verbo usas para cambiar solo el valor de un gasto? :: GET :: PATCH :: POST
escribe :: Escribe la ruta y el verbo para listar solo los gastos de tipo combustible. :: GET /gastos?tipo=combustible
```

## Parte 2. Separar la lógica y validar

> 🌎 **En la vida real:** el mostrador recibe y entrega; la bodega guarda y cuenta. No mezclas los dos trabajos.

> 🌎 **Otro ejemplo:** Es como el mesero y la cocina: uno atiende, la otra prepara.

### La lógica aparte (como en la clase 53)

```js
// gastos.mjs — la lógica, sin saber nada de HTTP
let gastos = [];
let siguienteId = 1;
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

export function validar(datos, parcial = false) {
  const errores = [];
  if (!parcial || 'tipo' in datos) if (!TIPOS.includes(datos.tipo)) errores.push(`tipo debe ser uno de: ${TIPOS.join(', ')}`);
  if (!parcial || 'valor' in datos) if (!(typeof datos.valor === 'number' && datos.valor > 0)) errores.push('valor debe ser un número mayor que 0');
  return errores;
}
export const listar = (tipo) => (tipo ? gastos.filter((g) => g.tipo === tipo) : gastos);
export const buscar = (id) => gastos.find((g) => g.id === id) ?? null;
export function crear({ tipo, valor }) { const g = { id: siguienteId++, tipo, valor }; gastos = [...gastos, g]; return g; }
export function actualizar(id, cambios) {
  const g = buscar(id); if (!g) return null;
  const nuevo = { ...g, ...cambios, id }; gastos = gastos.map((x) => (x.id === id ? nuevo : x)); return nuevo;
}
export function borrar(id) { const antes = gastos.length; gastos = gastos.filter((g) => g.id !== id); return gastos.length < antes; }
export function reiniciar() { gastos = []; siguienteId = 1; }   // para las pruebas
```

Solo se aceptan los campos que conoces (`{ tipo, valor }`): si alguien manda `{ "admin": true }`, se ignora. Es la misma idea de `keys().hasOnly` de las reglas de Firebase (Tema 24).

> 🌎 **En la vida real:** el formulario solo tiene las casillas que necesitas; lo que escribas en el margen no se procesa.

> 🌎 **Otro ejemplo:** Es como un cajero que solo acepta billetes del país, no fichas de casino.

### Las rutas, cortas

```js
// app.mjs
import express from 'express';
import * as G from './gastos.mjs';

export const app = express();
app.use(express.json({ limit: '10kb' }));

app.get('/gastos', (q, r) => r.json(G.listar(q.query.tipo)));
app.get('/gastos/:id', (q, r) => { const g = G.buscar(Number(q.params.id)); g ? r.json(g) : r.status(404).json({ error: 'No existe ese gasto' }); });
app.post('/gastos', (q, r) => {
  const errores = G.validar(q.body ?? {});
  if (errores.length) return r.status(400).json({ error: 'Datos inválidos', detalles: errores });
  r.status(201).json(G.crear(q.body));
});
app.patch('/gastos/:id', (q, r) => {
  const errores = G.validar(q.body ?? {}, true);
  if (errores.length) return r.status(400).json({ error: 'Datos inválidos', detalles: errores });
  const { tipo, valor } = q.body;
  const g = G.actualizar(Number(q.params.id), Object.fromEntries(Object.entries({ tipo, valor }).filter(([, v]) => v !== undefined)));
  g ? r.json(g) : r.status(404).json({ error: 'No existe ese gasto' });
});
app.delete('/gastos/:id', (q, r) => (G.borrar(Number(q.params.id)) ? r.status(204).end() : r.status(404).json({ error: 'No existe ese gasto' })));
```

> 🌎 **En la vida real:** el mostrador solo recibe, revisa el formulario y pasa el pedido a la bodega.

> 🌎 **Otro ejemplo:** Es como un recepcionista que deriva cada llamada al departamento correcto.

> 🧩 **Piezas para este ejercicio**
> - En una actualización parcial, comprueba si viene cada propiedad antes de validarla. Para formar la salida, copia solo las propiedades reconocidas que estén presentes.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Validar y quedarse solo con lo conocido
lenguaje: js
pide: Completa `validar(datos, parcial)` como en la clase: el tipo tiene que estar en `TIPOS` y el valor ser un número mayor que 0; con `parcial = true` (para PATCH), solo se revisa lo que viene. Y `soloConocidos(datos)`: devuelve un objeto **solo** con `tipo` y `valor` (los que vengan), ignorando cualquier otro campo como `admin`.
--- código
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

function validar(datos, parcial = false) {
  // tu código aquí
}

function soloConocidos(datos) {
  // tu código aquí
}
--- pruebas
prueba('un gasto bien', () => igual(validar({ tipo: 'lavado', valor: 30 }), []));
prueba('tipo inventado', () => igual(validar({ tipo: 'casino', valor: 30 }).length, 1));
prueba('valor en texto', () => igual(validar({ tipo: 'lavado', valor: '30' }).length, 1));
prueba('falta todo', () => igual(validar({}).length, 2));
prueba('PATCH solo con valor', () => igual(validar({ valor: 50 }, true), []));
prueba('ignora admin', () => igual(soloConocidos({ tipo: 'peaje', valor: 12, admin: true }), { tipo: 'peaje', valor: 12 }));
prueba('solo lo que viene', () => igual(soloConocidos({ valor: 5 }), { valor: 5 }));
--- solución
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

function validar(datos, parcial = false) {
  const errores = [];
  if (!parcial || 'tipo' in datos) if (!TIPOS.includes(datos.tipo)) errores.push(`tipo debe ser uno de: ${TIPOS.join(', ')}`);
  if (!parcial || 'valor' in datos) if (!(typeof datos.valor === 'number' && datos.valor > 0)) errores.push('valor debe ser un número mayor que 0');
  return errores;
}

function soloConocidos(datos) {
  const r = {};
  if ('tipo' in datos) r.tipo = datos.tipo;
  if ('valor' in datos) r.valor = datos.valor;
  return r;
}
```

```practica
vf :: Separar la lógica de las rutas permite probarla sin HTTP
vf :: Si alguien manda un campo admin: true, la API lo guarda junto con el gasto
elige :: ¿Qué responde POST /gastos con valor -5? :: 201 :: 400 con los detalles del error :: 404
elige :: ¿Para qué sirve el parámetro parcial en validar? :: Para borrar :: Para el PATCH: solo valida los campos que vienen :: Para listar
escribe :: ¿Por qué la API responde siempre los errores con la misma forma, por ejemplo { error, detalles }? :: Para que quien use la API (una web o una app) pueda mostrar los errores siempre de la misma manera, sin adivinar cada caso.
```

## Parte 3. CORS: dejar que tu web la use

> 🌎 **En la vida real:** CORS es la lista de invitados de la API: qué páginas pueden **leer sus respuestas** desde el navegador. (El pedido igual llega al servidor; lo que el navegador bloquea es que una página no invitada lea la respuesta.)

> 🌎 **Otro ejemplo:** Es como la lista de vecinos autorizados para usar la piscina del edificio.

### Permitir solo tus dominios

Si la web está en `https://delvinsmart.github.io` y la API en otro lado, el navegador **bloquea** las respuestas salvo que la API diga que ese origen está permitido:

```js
import cors from 'cors';
app.use(cors({ origin: ['https://delvinsmart.github.io', 'http://localhost:5173'] }));
```

Nunca `origin: '*'` en una API con datos privados (Tema 23). CORS **no** reemplaza la autenticación: solo controla qué páginas del navegador pueden leer.

> 🌎 **En la vida real:** la lista de invitados de la fiesta no reemplaza al guardia que revisa el documento.

> 🌎 **Otro ejemplo:** Es como el control de acceso por tarjeta: dice qué puertas, no quién eres.

> 🧩 **Piezas para este ejercicio**
> - Un origen reúne protocolo, nombre del servidor y puerto. Compara el texto del origen completo con la lista permitida y construye la cabecera solo cuando encaje.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: CORS: ¿este origen puede leer la respuesta?
lenguaje: js
pide: Completa `cabecerasCors(origen, permitidos)`: si el origen está en la lista, devuelve `{ 'Access-Control-Allow-Origin': origen }`; si no, `{}` (el navegador bloqueará la respuesta). Nunca devuelvas `'*'`.
--- código
const PERMITIDOS = ['https://delvinsmart.github.io', 'http://localhost:5173'];

function cabecerasCors(origen, permitidos) {
  // tu código aquí
}
--- pruebas
prueba('tu web', () => igual(cabecerasCors('https://delvinsmart.github.io', PERMITIDOS), { 'Access-Control-Allow-Origin': 'https://delvinsmart.github.io' }));
prueba('tu Mac', () => igual(cabecerasCors('http://localhost:5173', PERMITIDOS)['Access-Control-Allow-Origin'], 'http://localhost:5173'));
prueba('otra página: nada', () => igual(cabecerasCors('https://pagina-rara.com', PERMITIDOS), {}));
prueba('sin origen: nada', () => igual(cabecerasCors(undefined, PERMITIDOS), {}));
--- solución
const PERMITIDOS = ['https://delvinsmart.github.io', 'http://localhost:5173'];

function cabecerasCors(origen, permitidos) {
  return permitidos.includes(origen) ? { 'Access-Control-Allow-Origin': origen } : {};
}
```

```practica
vf :: CORS controla qué páginas pueden leer las respuestas de tu API desde el navegador
vf :: Con CORS bien puesto ya no hace falta autenticación
elige :: ¿Qué origin conviene en una API con datos privados? :: '*' :: Solo la lista de tus dominios :: Ninguno nunca
elige :: Tu web en github.io no puede leer tu API. ¿Qué revisas primero? :: El CSS :: La configuración de CORS de la API :: El nombre del dominio de la web
escribe :: Escribe la configuración de CORS para permitir tu web de GitHub Pages y tu entorno local en el puerto 5173. :: app.use(cors({ origin: ['https://delvinsmart.github.io', 'http://localhost:5173'] }));
```


**Comprobación antes de seguir**

Describe qué ocurre con datos inválidos y con un origen web diferente.

<details>
<summary>Necesito una pista</summary>

La validación revisa los datos. CORS controla si el navegador permite que una página lea la respuesta.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo diseñas una API REST?":** "Rutas con sustantivos en plural y el verbo HTTP para la acción: GET, POST, PATCH y DELETE, con los códigos correctos (200, 201, 204, 400, 404). La lógica va separada de las rutas para probarla sola. Valido todo lo que llega, acepto solo los campos que conozco y respondo los errores siempre con la misma forma. Habilito CORS solo para mis dominios, y la autenticación va aparte."

> 🌎 **En la vida real:** es como explicar las reglas de un mostrador bien organizado.

> 🌎 **Otro ejemplo:** Es como el reglamento de una biblioteca: claro, igual para todos y con excepciones definidas.
