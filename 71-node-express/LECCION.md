# Node.js 4: Express — rutas y middleware

> 🌎 **En la vida real:** después de armar un mueble sin instrucciones (clase 70), Express es el mismo mueble con instrucciones y las piezas ya cortadas.

> 🎙️ **El profesor dice:** **Express** es el framework de servidores más usado en Node. Hoy: crear rutas con una línea, leer parámetros y el cuerpo, los **middleware** (la idea más importante de Express) y cómo manejar los errores en un solo lugar.

## Parte 1. Rutas con Express

> 🌎 **En la vida real:** es como el directorio del edificio: "Gastos, piso 3"; cada ruta lleva a su oficina.

> 🌎 **Otro ejemplo:** Es como el menú de un restaurante bien ordenado por secciones.

### Instalar y la primera ruta

```bash
npm init -y && npm install express
```

```js
// app.mjs
import express from 'express';

const app = express();
app.use(express.json({ limit: '10kb' }));   // lee el cuerpo JSON por ti (con límite)

const gastos = [{ id: 1, tipo: 'lavado', valor: 30 }];

app.get('/gastos', (pedido, respuesta) => {
  respuesta.json(gastos);                    // ya pone el Content-Type y convierte a JSON
});

app.get('/gastos/:id', (pedido, respuesta) => {
  const g = gastos.find((x) => x.id === Number(pedido.params.id));
  if (!g) return respuesta.status(404).json({ error: 'No existe ese gasto' });
  respuesta.json(g);
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

Compáralo con la clase 70: `:id` reemplaza la expresión regular, `express.json()` lee el cuerpo y `respuesta.json()` responde.

> 🌎 **En la vida real:** es como pasar de calcular a mano a usar calculadora: la cuenta es la misma.

> 🌎 **Otro ejemplo:** Es como el control remoto en vez de levantarse a cambiar el canal.

### Lo que trae el pedido en Express

- `pedido.params.id` → la parte variable de la ruta (`/gastos/3`).
- `pedido.query.mes` → lo de después del `?` (`/gastos?mes=11`).
- `pedido.body` → el cuerpo ya convertido (gracias a `express.json()`).

> 🌎 **En la vida real:** son los casilleros de un formulario ya separados: nombre, dirección, mensaje.

> 🌎 **Otro ejemplo:** Es como una carta ya abierta y ordenada en tu escritorio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un mini Express: rutas con :id
lenguaje: js
pide: Haz un mini Express. `crearApp()` devuelve `{ get(patron, fn), manejar(url) }`. `get` guarda la ruta; `manejar` busca la primera que encaja (un pedazo `:nombre` encaja con cualquier texto y va a `params.nombre`), arma `pedido = { params, query }` y devuelve lo que devuelva `fn(pedido)`. Si ninguna encaja, `{ estado: 404 }`.
--- código
function crearApp() {
  const rutas = [];
  return {
    get(patron, fn) {
      // tu código aquí
    },
    manejar(url) {
      // tu código aquí
    },
  };
}
--- pruebas
const app = crearApp();
app.get('/gastos', (q) => ({ estado: 200, tipo: q.query.tipo ?? null }));
app.get('/gastos/:id', (q) => ({ estado: 200, id: q.params.id }));
prueba('una ruta fija', () => igual(app.manejar('/gastos'), { estado: 200, tipo: null }));
prueba('con query', () => igual(app.manejar('/gastos?tipo=lavado'), { estado: 200, tipo: 'lavado' }));
prueba('con :id', () => igual(app.manejar('/gastos/3'), { estado: 200, id: '3' }));
prueba('no existe', () => igual(app.manejar('/viajes'), { estado: 404 }));
--- solución
function crearApp() {
  const rutas = [];
  return {
    get(patron, fn) {
      rutas.push({ partes: patron.split('/'), fn });
    },
    manejar(url) {
      const u = new URL(url, 'http://localhost');
      const partes = u.pathname.split('/');
      for (const r of rutas) {
        if (r.partes.length !== partes.length) continue;
        const params = {};
        const encaja = r.partes.every((p, i) => {
          if (p.startsWith(':')) { params[p.slice(1)] = partes[i]; return true; }
          return p === partes[i];
        });
        if (encaja) return r.fn({ params, query: Object.fromEntries(u.searchParams) });
      }
      return { estado: 404 };
    },
  };
}
```

```practica
vf :: express.json() lee el cuerpo JSON del pedido por ti
vf :: En Express, /gastos/:id guarda el número en pedido.query.id
elige :: ¿Qué hace respuesta.status(404).json({...})? :: Borra la ruta :: Responde con código 404 y un JSON :: Crea un gasto
elige :: ¿Dónde está el 11 en /gastos?mes=11? :: pedido.params.mes :: pedido.query.mes :: pedido.body.mes
escribe :: Escribe una ruta GET /salud que responda { ok: true }. :: app.get('/salud', (pedido, respuesta) => respuesta.json({ ok: true }));
```

## Parte 2. Middleware: la línea de producción

> 🌎 **En la vida real:** un middleware es una estación de una línea de montaje: cada una hace su parte y pasa el producto a la siguiente.

> 🌎 **Otro ejemplo:** Es como los controles de un aeropuerto: documentos, equipaje, embarque. Si uno falla, no sigues.

### Funciones que pasan el pedido

Un **middleware** recibe `(pedido, respuesta, siguiente)`. Puede responder él mismo (y cortar ahí) o llamar `siguiente()` para pasar a la próxima estación.

```js
// Anotar cada pedido (un registro, Tema 24)
app.use((pedido, respuesta, siguiente) => {
  const inicio = Date.now();
  respuesta.on('finish', () => console.log(pedido.method, pedido.url, respuesta.statusCode, `${Date.now() - inicio} ms`));
  siguiente();
});

// Exigir una clave en ciertas rutas
function soloConClave(pedido, respuesta, siguiente) {
  if (pedido.get('x-clave') !== process.env.CLAVE_ADMIN) return respuesta.status(401).json({ error: 'Falta la clave' });
  siguiente();
}
app.delete('/gastos/:id', soloConClave, (pedido, respuesta) => { /* … */ });
```

`express.json()` también es un middleware.

> 🌎 **En la vida real:** `siguiente()` es como el sello que te dejan pasar al próximo control.

> 🌎 **Otro ejemplo:** Es como los filtros de una cafetera: el agua pasa por cada uno antes de llegar a la taza.

### El orden importa

Los middleware corren **en el orden en que los escribes**. Si pones la ruta antes de `express.json()`, el cuerpo no estará leído.

> 🌎 **En la vida real:** si embarcas antes de pasar por el control, algo salió mal.

> 🌎 **Otro ejemplo:** Es como vestirse: primero las medias, después los zapatos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Middleware: la línea de producción
lenguaje: js
pide: Completa `correr(middlewares, pedido)`: cada middleware es `(pedido, respuesta, siguiente)`. Llama al primero; si llama a `siguiente()`, pasa al próximo. `respuesta` es un objeto con `estado` y `cuerpo` que empieza vacío `{}` y que devuelves al final. Después, escribe `soloConClave`: si `pedido.headers['x-clave']` no es `'secreta'`, pone `estado: 401` y `cuerpo: { error: 'Falta la clave' }` y **no** sigue.
--- código
function correr(middlewares, pedido) {
  const respuesta = {};
  // tu código aquí
  return respuesta;
}

function soloConClave(pedido, respuesta, siguiente) {
  // tu código aquí
}
--- pruebas
const anotar = (pedido, respuesta, siguiente) => { pedido.anotado = true; siguiente(); };
const borrar = (pedido, respuesta) => { respuesta.estado = 204; };
prueba('pasa por todos', () => { const p = { headers: { 'x-clave': 'secreta' } }; igual(correr([anotar, soloConClave, borrar], p), { estado: 204 }); igual(p.anotado, true); });
prueba('sin clave, se corta', () => igual(correr([anotar, soloConClave, borrar], { headers: {} }), { estado: 401, cuerpo: { error: 'Falta la clave' } }));
prueba('el orden importa', () => { const p = { headers: {} }; correr([soloConClave, anotar], p); igual(p.anotado, undefined); });
--- solución
function correr(middlewares, pedido) {
  const respuesta = {};
  const paso = (i) => {
    if (i < middlewares.length) middlewares[i](pedido, respuesta, () => paso(i + 1));
  };
  paso(0);
  return respuesta;
}

function soloConClave(pedido, respuesta, siguiente) {
  if (pedido.headers['x-clave'] !== 'secreta') {
    respuesta.estado = 401;
    respuesta.cuerpo = { error: 'Falta la clave' };
    return;
  }
  siguiente();
}
```

```practica
vf :: Un middleware puede responder y cortar, o llamar siguiente() para pasar al próximo
vf :: El orden en que se escriben los middleware no importa
elige :: ¿Qué parámetros recibe un middleware? :: (a, b) :: (pedido, respuesta, siguiente) :: (error)
elige :: ¿Qué responde soloConClave si falta la clave? :: 200 :: 401 :: 201
escribe :: Escribe un middleware que agregue la cabecera X-Curso: mapa a todas las respuestas. :: app.use((pedido, respuesta, siguiente) => { respuesta.set('X-Curso', 'mapa'); siguiente(); });
```

## Parte 3. Errores en un solo lugar

> 🌎 **En la vida real:** en una empresa, los reclamos van todos a una misma oficina, no a cualquier escritorio.

> 🌎 **Otro ejemplo:** Es como un botiquín central en vez de curitas sueltas por toda la casa.

### El manejador de errores

Un middleware con **cuatro** parámetros es el manejador de errores. Va **al final**:

```js
app.get('/gastos/:id', async (pedido, respuesta) => {
  const g = await leerGasto(Number(pedido.params.id));   // si esto falla, Express 5 lo manda al manejador
  if (!g) return respuesta.status(404).json({ error: 'No existe ese gasto' });
  respuesta.json(g);
});

// Rutas que no existen
app.use((pedido, respuesta) => respuesta.status(404).json({ error: 'Ruta no encontrada' }));

// Errores: al final de todo
app.use((error, pedido, respuesta, siguiente) => {
  console.error(error);                                    // el detalle va al registro
  respuesta.status(500).json({ error: 'Algo salió mal' }); // al usuario, nada interno
});
```

Nunca le muestres al usuario el error completo (el *stack*, rutas de archivos, consultas): da pistas a un atacante (Tema 23).

> 🌎 **En la vida real:** al cliente le dices "estamos resolviendo un problema"; el informe técnico va al mecánico.

> 🌎 **Otro ejemplo:** Es como un hospital: al paciente le explican claro, el detalle va a la historia clínica.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Errores en un solo lugar
lenguaje: js
pide: Completa `manejarConErrores(ruta, registro)`: devuelve una función `async (pedido) => respuesta` que corre `await ruta(pedido)`; si la ruta lanza un error, lo anota en `registro` (con su mensaje completo, para ti) y responde `{ estado: 500, cuerpo: { error: 'Algo salió mal' } }` (al usuario, **nada** interno).
--- código
function manejarConErrores(ruta, registro) {
  // tu código aquí
}
--- pruebas
const bien = async () => ({ estado: 200, cuerpo: { ok: true } });
const rota = async () => { throw new Error('SELECT * FROM gastos falló en /srv/app/db.mjs:12'); };
prueba('sin error, pasa', async () => igual(await manejarConErrores(bien, [])({}), { estado: 200, cuerpo: { ok: true } }));
prueba('con error: 500 sin detalles', async () => igual(await manejarConErrores(rota, [])({}), { estado: 500, cuerpo: { error: 'Algo salió mal' } }));
prueba('el detalle va al registro', async () => { const r = []; await manejarConErrores(rota, r)({}); ok(r[0]?.includes('db.mjs'), 'anota el mensaje en el registro'); });
--- solución
function manejarConErrores(ruta, registro) {
  return async (pedido) => {
    try {
      return await ruta(pedido);
    } catch (error) {
      registro.push(error.message);
      return { estado: 500, cuerpo: { error: 'Algo salió mal' } };
    }
  };
}
```

```practica
vf :: El manejador de errores de Express tiene cuatro parámetros y va al final
vf :: Conviene mandarle al usuario el error completo con el stack para que lo entienda
elige :: ¿Dónde va el middleware de "ruta no encontrada"? :: Al principio :: Después de todas las rutas :: Dentro de cada ruta
elige :: ¿Qué responde el manejador ante un error inesperado? :: 200 con el stack :: 500 con un mensaje general :: 404
escribe :: ¿Por qué conviene manejar los errores en un solo lugar? :: Para que todos los errores respondan igual y sin mostrar detalles internos, y para registrar el detalle en un solo sitio en vez de repetir try/catch en cada ruta.
```


**Comprobación antes de seguir**

Dibuja el orden en que Express pasa por las funciones intermedias.

<details>
<summary>Necesito una pista</summary>

Marca qué función envía la respuesta y cuáles delegan con `next()`.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo armas un servidor con Express?":** "Con rutas por verbo y ruta, leyendo params, query y body con express.json y un límite de tamaño. Uso middleware para lo que se repite: registro de pedidos, autenticación, validación; sé que el orden importa. Al final pongo un 404 para rutas que no existen y un manejador de errores que registra el detalle y responde un 500 general, sin mostrar nada interno."

> 🌎 **En la vida real:** es como explicar cómo organizas una línea de producción con control de calidad al final.

> 🌎 **Otro ejemplo:** Es como el gerente de un aeropuerto explicando los controles en orden.
