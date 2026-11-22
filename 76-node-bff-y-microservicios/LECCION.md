# Node.js 8: REST a fondo, BFF y microservicios

> 🌎 **En la vida real:** hasta ahora tenías una tienda con un solo mostrador. Hoy ves cómo crece: un mostrador distinto para cada tipo de cliente (BFF) y, cuando la tienda es enorme, varias tiendas pequeñas que trabajan juntas (microservicios).

> 🎙️ **El profesor dice:** {{alumno}}, estas tres palabras aparecen mucho en las vacantes de "Fullstack": **APIs RESTful, BFF y microservicios**. Hoy las entiendes con ejemplos de Copiloto, y sobre todo aprendes **cuándo no usarlas**. En una entrevista, saber cuándo no usar algo vale tanto como saber usarlo.

## Parte 1. REST a fondo: lo que hace "RESTful" a una API

> 🌎 **En la vida real:** en la clase 72 aprendiste las señales de tránsito. Hoy aprendes las reglas finas: quién pasa primero, qué pasa si te repites, cómo se avisa un error.

> 🌎 **Otro ejemplo:** Es como pasar de saber manejar a tener la licencia profesional: las mismas calles, más reglas.

### Sin memoria entre pedidos (stateless)

En REST, **cada pedido trae todo lo que el servidor necesita**: quién eres (el token), qué quieres y con qué datos. El servidor no recuerda "la conversación anterior". Por eso puedes tener 1 o 10 copias del servidor y cualquiera puede atenderte.

> 🌎 **En la vida real:** es como pagar el peaje: cada vez muestras tu tag. La cabina no se acuerda de que pasaste ayer.

> 🌎 **Otro ejemplo:** Es como pedir en un mostrador con número: cualquier empleado te atiende si traes tu ticket.

### Repetir sin miedo (idempotencia)

Un pedido es **idempotente** si hacerlo dos veces deja todo igual que hacerlo una vez. Importa porque en el celular, con mala señal, la app **reintenta**.

| Verbo | ¿Idempotente? | Por qué |
|---|---|---|
| `GET /gastos/3` | Sí | Solo lee. |
| `PUT /gastos/3` | Sí | Reemplaza con lo mismo: queda igual. |
| `DELETE /gastos/3` | Sí | La segunda vez ya no existe: el resultado final es el mismo. |
| `POST /gastos` | **No** | Cada vez crea uno nuevo: dos toques, dos gastos. |

Por eso Copiloto guarda primero en el aparato y reintenta con cuidado: un `POST` repetido duplicaría el gasto.

### Los códigos que faltaban

| Código | Significa | Ejemplo |
|---|---|---|
| `401` | No sé quién eres | Falta el token o venció. |
| `403` | Sé quién eres, pero no puedes | Quieres ver los gastos de otro conductor. |
| `409` | Choca con lo que ya hay | Ya existe una cuenta con ese correo. |
| `429` | Demasiados pedidos | Pasaste el límite por minuto (como las prácticas de este sitio). |

### Listas largas y versiones

- **Paginación:** nunca devuelvas 10.000 viajes de una vez. `GET /viajes?limite=20&despues=abc123` trae 20 y te dice desde dónde seguir.
- **Versión en la ruta:** `/v1/gastos`. Si un día cambias la forma de la respuesta, creas `/v2/gastos` y las apps viejas, que la gente no actualizó, siguen funcionando con `/v1`.

> 🧩 **Piezas para este ejercicio**
> - Guarda el resultado original asociado a la clave. Si esa clave aparece otra vez, reutiliza el resultado antes de incrementar el contador o crear un nuevo id.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Reintentar sin duplicar
lenguaje: js
pide: Un `POST` repetido (mala señal, la app reintenta) crea dos gastos. La solución: la app manda una **clave de idempotencia**. Completa `crearServidor()` con `post(gasto, clave)`: si ya vio esa clave, devuelve el **mismo** gasto que creó la primera vez (sin crear otro); si no, lo crea con un id nuevo. `cantidad()` dice cuántos hay.
--- código
function crearServidor() {
  const gastos = [];
  const vistas = new Map();
  return {
    post(gasto, clave) {
      // tu código aquí
    },
    cantidad: () => gastos.length,
  };
}
--- pruebas
prueba('reintentar no duplica', () => { const s = crearServidor(); const a = s.post({ valor: 30 }, 'k1'); const b = s.post({ valor: 30 }, 'k1'); igual([s.cantidad(), a.id === b.id], [1, true]); });
prueba('otra clave, otro gasto', () => { const s = crearServidor(); s.post({ valor: 30 }, 'k1'); s.post({ valor: 30 }, 'k2'); igual(s.cantidad(), 2); });
--- solución
function crearServidor() {
  const gastos = [];
  const vistas = new Map();
  return {
    post(gasto, clave) {
      if (vistas.has(clave)) return vistas.get(clave);
      const nuevo = { id: gastos.length + 1, ...gasto };
      gastos.push(nuevo);
      vistas.set(clave, nuevo);
      return nuevo;
    },
    cantidad: () => gastos.length,
  };
}
```

```practica
vf :: En una API REST, el servidor recuerda quién eres por la conversación anterior, sin que mandes el token en cada pedido
vf :: DELETE /gastos/3 es idempotente: hacerlo dos veces deja todo igual que hacerlo una vez
elige :: ¿Cuál de estos pedidos NO es idempotente? :: GET /gastos :: PUT /gastos/3 :: POST /gastos
elige :: Un conductor quiere ver los gastos de otro conductor. Tiene sesión iniciada. ¿Qué código respondes? :: 401 :: 403 :: 404
elige :: Cambias la forma de la respuesta de /gastos y hay apps viejas instaladas. ¿Qué haces? :: Cambias /gastos y listo :: Creas /v2/gastos y dejas /v1/gastos funcionando :: Borras /gastos
escribe :: Escribe la ruta para pedir los primeros 20 viajes de una lista larga, con paginación. :: GET /viajes?limite=20 (y para seguir: GET /viajes?limite=20&despues=, con el último que recibiste)
```

## Parte 2. El monolito: empezar por ahí no es un error

> 🌎 **En la vida real:** un monolito es un restaurante pequeño donde la misma cocina hace todo: entradas, platos y postres. Funciona muy bien hasta que tiene 500 mesas.

> 🌎 **Otro ejemplo:** Es como tu carro: un solo vehículo hace todo. No compras un carro distinto para cada tipo de viaje.

Un **monolito** es una sola aplicación de servidor que hace todo: usuarios, gastos, ganancias, notificaciones. La API de gastos de la clase 72 es un monolito. Y está bien.

| Ventajas | Problemas cuando crece mucho |
|---|---|
| Un solo código, un solo lugar donde publicar. | Un error en notificaciones puede tumbar todo. |
| Fácil de probar y de entender. | Para cambiar una línea hay que publicar todo. |
| Llamar a otra parte es llamar a una función, sin red. | Muchos equipos tocando el mismo código se estorban. |

La recomendación de la industria es: **empieza con un monolito ordenado** (lógica separada por áreas, como `gastos.mjs` aparte de las rutas). Solo cuando duele, lo partes.

> 🧩 **Piezas para este ejercicio**
> - `&&` combina dos requisitos. La recomendación del ejercicio depende de la cantidad de equipos y de si varias partes se estorban.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Monolito o microservicios?
lenguaje: js
pide: Completa `recomendar(equipo)`: `equipo = { personas, equipos, partesQueSeEstorban }`. Recomienda `'microservicios'` solo si hay **más de un equipo** y **partes que se estorban**; en cualquier otro caso, `'monolito ordenado'`.
--- código
function recomendar(equipo) {
  // tu código aquí
}
--- pruebas
prueba('una persona (Copiloto)', () => igual(recomendar({ personas: 1, equipos: 1, partesQueSeEstorban: false }), 'monolito ordenado'));
prueba('muchos, sin estorbarse', () => igual(recomendar({ personas: 30, equipos: 4, partesQueSeEstorban: false }), 'monolito ordenado'));
prueba('varios equipos que se estorban', () => igual(recomendar({ personas: 40, equipos: 5, partesQueSeEstorban: true }), 'microservicios'));
--- solución
function recomendar(equipo) {
  return equipo.equipos > 1 && equipo.partesQueSeEstorban ? 'microservicios' : 'monolito ordenado';
}
```

```practica
vf :: Empezar un proyecto nuevo con un monolito ordenado es una mala práctica
elige :: ¿Cuál es un problema real de un monolito muy grande? :: Que no se puede probar :: Que para cambiar una parte hay que publicar todo :: Que no puede usar base de datos
escribe :: Con tus palabras: ¿qué es un monolito? Da un ejemplo. :: Una sola aplicación de servidor que hace todo (usuarios, gastos, notificaciones…). Por ejemplo, la API de gastos de la clase 72.
```

## Parte 3. BFF: un mostrador para cada pantalla

> 🌎 **En la vida real:** en un banco, la ventanilla de empresas y la de personas usan el mismo sistema por dentro, pero cada una te entrega lo que tú necesitas, en tu idioma.

> 🌎 **Otro ejemplo:** Es como un mesero que conoce a cada mesa: a la del niño le trae el plato cortado; a la del adulto, entero. La cocina es la misma.

### El problema

La pantalla **Início** de Copiloto en el celular necesita tres cosas: lo ganado hoy, la meta y el próximo recordatorio. Con una API general, la app haría **tres pedidos** por 4G y recibiría campos que no usa. La versión web, en cambio, muestra tablas largas con todo el detalle.

**BFF** significa **Backend for Frontend**: un servidor pequeño **hecho a la medida de un frontend**. Uno para la app del celular, otro para la web. Por dentro, ambos piden los datos a los mismos servicios.

```
   App del celular ──▶ BFF de la app ──┐
                                        ├──▶ servicios: ganancias, metas, recordatorios
   Web (computadora) ──▶ BFF de la web ─┘
```

### Un BFF en Express

```js
// bff-app.mjs — el BFF de la app del celular: una llamada con lo justo para Início
import express from 'express';
const app = express();
const { URL_GANANCIAS, URL_METAS, URL_RECORDATORIOS } = process.env;

async function pedir(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(2000) }); // nunca esperar para siempre
  if (!r.ok) throw new Error(`${url} respondió ${r.status}`);
  return r.json();
}

app.get('/app/inicio', async (req, res) => {
  const uid = encodeURIComponent(req.usuario.uid); // lo puso el middleware de autenticación (clase 73)
  // Los tres a la vez. allSettled: si uno falla, los otros igual llegan.
  const [hoy, meta, avisos] = await Promise.allSettled([
    pedir(`${URL_GANANCIAS}/ganancias?uid=${uid}&dia=hoy`),
    pedir(`${URL_METAS}/metas/${uid}`),
    pedir(`${URL_RECORDATORIOS}/recordatorios?uid=${uid}&limite=1`),
  ]);
  res.json({
    gananciaHoy: hoy.status === 'fulfilled' ? hoy.value.total : null,
    meta: meta.status === 'fulfilled' ? meta.value.valor : null,
    proximoAviso: avisos.status === 'fulfilled' ? avisos.value[0]?.texto ?? null : null,
  });
});
```

Fíjate en tres cosas:

1. **Una sola llamada** desde el celular, con **solo los campos** que la pantalla usa.
2. **`Promise.allSettled`** (clase 49): si el servicio de metas está caído, la app igual muestra lo ganado hoy. Con `Promise.all`, un fallo tumbaría la pantalla entera.
3. **Un tiempo máximo** (`AbortSignal.timeout`): si un servicio no contesta, el BFF no se queda esperando para siempre.

Cuándo **no** vale la pena: si tienes un solo frontend, o la app y la web piden casi lo mismo. Un BFF es un servidor más que mantener.

> 🧩 **Piezas para este ejercicio**
> - `Promise.allSettled` entrega un resultado por promesa en el mismo orden de entrada. Revisa `status` antes de leer `value` y usa el valor de respaldo para una lectura fallida.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un BFF que aguanta si un servicio se cae
lenguaje: js
pide: Completa la función `async` `inicio(pedir)`: pide **a la vez** `'ganancias'`, `'metas'` y `'recordatorios'` con `pedir(nombre)` (que devuelve una promesa), usando `Promise.allSettled`. Devuelve `{ gananciaHoy, meta, proximoAviso }` con `total`, `valor` y `texto` de cada respuesta, o `null` si ese servicio falló.
--- código
async function inicio(pedir) {
  // tu código aquí
}
--- pruebas
const respuestas = { ganancias: { total: 180 }, metas: { valor: 300 }, recordatorios: { texto: 'Cambiar el aceite' } };
const todoBien = (n) => Promise.resolve(respuestas[n]);
const metasCaidas = (n) => (n === 'metas' ? Promise.reject(new Error('caído')) : Promise.resolve(respuestas[n]));
prueba('todo bien', async () => igual(await inicio(todoBien), { gananciaHoy: 180, meta: 300, proximoAviso: 'Cambiar el aceite' }));
prueba('metas caído: lo demás igual llega', async () => igual(await inicio(metasCaidas), { gananciaHoy: 180, meta: null, proximoAviso: 'Cambiar el aceite' }));
prueba('a la vez, no uno por uno', async () => { let enCurso = 0, maximo = 0; const lento = (n) => { enCurso++; maximo = Math.max(maximo, enCurso); return new Promise((r) => setTimeout(() => { enCurso--; r(respuestas[n]); }, 10)); }; await inicio(lento); igual(maximo, 3); });
--- solución
async function inicio(pedir) {
  const [hoy, meta, avisos] = await Promise.allSettled([pedir('ganancias'), pedir('metas'), pedir('recordatorios')]);
  return {
    gananciaHoy: hoy.status === 'fulfilled' ? hoy.value.total : null,
    meta: meta.status === 'fulfilled' ? meta.value.valor : null,
    proximoAviso: avisos.status === 'fulfilled' ? avisos.value.texto : null,
  };
}
```

```practica
vf :: Un BFF es un servidor hecho a la medida de un frontend, por ejemplo uno para la app y otro para la web
elige :: ¿Qué gana la app del celular con un BFF? :: Ya no necesita internet :: Hace un solo pedido y recibe solo los campos que usa :: Puede saltarse la autenticación
elige :: El servicio de metas está caído. ¿Qué usas en el BFF para que la app igual muestre lo ganado hoy? :: Promise.all :: Promise.allSettled :: Un for con await uno por uno
vf :: Si tienes un solo frontend, un BFF casi siempre vale la pena
escribe :: ¿Por qué el BFF usa AbortSignal.timeout(2000) en cada fetch? :: Para no esperar para siempre a un servicio que no contesta: a los 2 segundos se corta y la app recibe lo demás.
```

## Parte 4. Microservicios: varias tiendas pequeñas

> 🌎 **En la vida real:** un centro comercial: la farmacia, el supermercado y la tienda de ropa son negocios separados, con su caja y su depósito. Si la farmacia cierra por reforma, el supermercado sigue abierto.

> 🌎 **Otro ejemplo:** Es como una flota de taxis contra un solo bus: cada taxi va por su lado y si uno se daña los demás siguen.

### Qué son

**Microservicios** es partir el monolito en servicios pequeños, **uno por área del negocio**: ganancias, gastos, notificaciones. Cada uno:

- tiene **su propia base de datos** (nadie entra a la base de otro: le pide por su API),
- se **publica solo**, sin tocar a los demás,
- puede tener **su equipo** y hasta su lenguaje.

### Cómo se hablan

| Forma | Cómo | Ejemplo en Copiloto |
|---|---|---|
| **Pedido directo (HTTP)** | Uno llama a la API del otro y espera. | El BFF pide las ganancias del día. |
| **Eventos** | Uno avisa "pasó algo" y quien quiera escucha. No espera respuesta. | "Se registró un gasto" → notificaciones revisa si toca un aviso. |

Los eventos ya los conoces: el `AIEventBus` de Copiloto es exactamente esa idea, pero **dentro** de una sola app. Cada parte (ganancias, gastos, vehículos) avisa lo que cambió y el asistente escucha. En microservicios, el mismo patrón viaja por la red con una cola de mensajes.

### Lo que cuestan

| Problema nuevo | Por qué |
|---|---|
| La red falla | Llamar a otro servicio ya no es llamar a una función: puede tardar o no contestar. |
| Datos repartidos | Cada servicio tiene su base: un reporte que junta todo es más difícil. |
| Encontrar errores | Un pedido pasa por 4 servicios: ¿en cuál falló? Hacen falta registros que sigan el pedido. |
| Más cosas que publicar | 10 servicios son 10 cosas que vigilar. |

Por eso la regla es: **microservicios cuando el equipo y el tamaño lo piden**, no por moda. Copiloto, hecho por una persona, está mejor como está.

> 🧩 **Piezas para este ejercicio**
> - Cada nombre de evento puede tener su propia lista de funciones. Al avisar, recorre esa lista en el orden de registro y pasa los datos a cada función.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Eventos: avisar sin esperar
lenguaje: js
pide: Entre microservicios, uno avisa "pasó algo" y quien quiera escucha. Completa `crearBus()`: `escuchar(evento, fn)` y `avisar(evento, datos)` (llama a todos los que escuchan ese evento, en orden). Después, en `conectar(bus, notificaciones)`, haz que el evento `'gasto registrado'` con `valor` mayor que 500 agregue a `notificaciones` el texto `'Gasto alto: R$ VALOR'`.
--- código
function crearBus() {
  const oyentes = {};
  return {
    escuchar(evento, fn) {
      // tu código aquí
    },
    avisar(evento, datos) {
      // tu código aquí
    },
  };
}

function conectar(bus, notificaciones) {
  // tu código aquí
}
--- pruebas
prueba('un gasto alto avisa', () => { const bus = crearBus(); const n = []; conectar(bus, n); bus.avisar('gasto registrado', { valor: 800 }); igual(n, ['Gasto alto: R$ 800']); });
prueba('uno chico no', () => { const bus = crearBus(); const n = []; conectar(bus, n); bus.avisar('gasto registrado', { valor: 30 }); igual(n, []); });
prueba('varios escuchan', () => { const bus = crearBus(); let a = 0; bus.escuchar('x', () => a++); bus.escuchar('x', () => a++); bus.avisar('x'); igual(a, 2); });
prueba('un evento sin oyentes no rompe', () => { const bus = crearBus(); bus.avisar('nadie escucha', {}); ok(true); });
--- solución
function crearBus() {
  const oyentes = {};
  return {
    escuchar(evento, fn) {
      (oyentes[evento] ??= []).push(fn);
    },
    avisar(evento, datos) {
      for (const fn of oyentes[evento] ?? []) fn(datos);
    },
  };
}

function conectar(bus, notificaciones) {
  bus.escuchar('gasto registrado', (g) => {
    if (g.valor > 500) notificaciones.push(`Gasto alto: R$ ${g.valor}`);
  });
}
```

```practica
vf :: En microservicios, cada servicio debería tener su propia base de datos y pedirle a los otros por su API
vf :: Partir en microservicios hace que la red deje de ser un problema
elige :: Se registra un gasto y el servicio de notificaciones tiene que enterarse, sin que el de gastos espere su respuesta. ¿Qué usas? :: Un pedido HTTP y esperar :: Un evento ("se registró un gasto") :: Que notificaciones lea la base de gastos
elige :: Eres el único programador de Copiloto. ¿Qué arquitectura conviene? :: Un monolito ordenado por áreas :: 15 microservicios :: Un microservicio por pantalla
escribe :: Con tus palabras: ¿qué tiene en común el AIEventBus de Copiloto con los microservicios que se hablan por eventos? :: Las dos usan eventos: una parte avisa "pasó algo" y las que les interesa escuchan, sin conocerse entre ellas. En Copiloto pasa dentro de la app; en microservicios, por la red.
```


**Comprobación antes de seguir**

Decide si separarías el sistema de gastos en varios servicios y justifica la decisión.

<details>
<summary>Necesito una pista</summary>

Escribe un problema concreto que mejoraría con la separación y un costo nuevo que traería.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es un BFF?":** "Backend for Frontend: un servidor hecho a la medida de cada frontend. Por ejemplo, en Copiloto tendría uno para la app del celular y otro para la versión web. La app hace una sola llamada para la pantalla Início y recibe solo lo que muestra; por dentro, el BFF junta los datos de varios servicios con `Promise.allSettled` y un tiempo máximo, para que si uno falla la pantalla igual cargue. Con un solo frontend no lo usaría: sería un servidor más sin ganar nada."

> 🎤 **Si te preguntan "¿monolito o microservicios?":** "Empiezo con un monolito ordenado por áreas, porque es más simple de probar y publicar. Lo partiría en microservicios cuando hay varios equipos que se estorban o partes que necesitan escalar distinto. Sé lo que cuesta: la red puede fallar, los datos quedan repartidos y encontrar un error es más difícil. Ya usé la idea de eventos en Copiloto, con un bus de eventos dentro de la app."

> 🎤 **Si te preguntan "¿qué hace RESTful a una API?":** "Rutas con sustantivos y el verbo HTTP para la acción, sin estado entre pedidos, los códigos correctos (401 no es lo mismo que 403), respetar qué verbos son idempotentes porque las apps reintentan, paginar las listas largas y versionar para no romper apps viejas."

> 🌎 **En la vida real:** es como explicar por qué un centro comercial tiene varias tiendas, y por qué tu negocio de un solo dueño no necesita serlo todavía.
