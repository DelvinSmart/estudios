# Agentes 4: diseñar un agente

> 🎙️ **El profesor dice:** un agente bueno no sale del modelo: sale de cómo le das el contexto, cómo diseñas sus herramientas, cómo guardas su estado y qué modelo eliges. Esta es la parte de ingeniería.

> 📌 **Nota:** esta clase es parte del curso **Agentes de IA**, que tiene su propio certificado. Está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), explicada en español con mis palabras; los números (2.1, 4.3…) son los mismos de la guía.

## 4.1 Ingeniería de contexto

> 🎙️ **El profesor:** aquí está lo que separa un agente de demo de uno que funciona con gente real: el contexto, las herramientas, el estado, las salidas ordenadas, el modelo y los protocolos.

> 🌎 **En la vida real:** Es como diseñar una cocina profesional: no alcanza con saber recetas; hay que decidir dónde va cada cosa, qué herramientas tener y cómo trabaja el cocinero.

> 🌎 **Otro ejemplo:** Es como preparar a un empleado nuevo: qué le explicas, qué herramientas le das, qué tiene que recordar y en qué formato te entrega el trabajo.

Los patrones son **la forma**. Esta parte es **el contenido**: las decisiones que determinan si tu agente funciona con entradas reales, y no solo en la demo.

> 🌎 **En la vida real:** antes de una reunión importante, a un gerente no le das 300 páginas: le das **una hoja** con lo esencial, los números clave y la decisión que tiene que tomar. Si le das todo, se pierde lo importante. Eso es curar el contexto.

> 🌎 **Otro ejemplo:** Como el informe de un mecánico antes de una carrera: solo lo que el piloto necesita saber, no el manual entero del auto.

**Ingeniería de prompts** es escribir buenas instrucciones. **Ingeniería de contexto** es decidir **todo** lo que entra en la ventana del modelo en cada paso: instrucciones, herramientas, documentos traídos, memoria, historial de la conversación, resultados de herramientas. Es **la habilidad de más impacto** en el diseño de agentes, porque el modelo solo puede razonar sobre lo que ve, y **su atención empeora a medida que la ventana se llena**.

- **Busca el conjunto más chico de *tokens* con más señal** que haga más probable la siguiente acción correcta. Más contexto **no** es mejor contexto.
- **Arma el *system prompt* por secciones:** rol, tarea, reglas, guía de herramientas, formato de salida, ejemplos. Con títulos claros. A la **altura justa**: lo bastante específico para guiar, lo bastante general para dejar razonar al modelo.
- **Carga herramientas y documentos justo a tiempo.** Dale al modelo **referencias** (rutas de archivos, herramientas de consulta) y deja que traiga lo que necesita, en vez de meterle todo al principio.
- **Resultados de herramientas flacos.** Recorta, resume u ordena lo grande antes de que entre al contexto.
- **Lo más importante, cerca del principio**, y **repite las reglas críticas cerca del final**. Los modelos prestan más atención **a los bordes** de la ventana.
- **Diseña para el caché de prompts.** Deja la parte fija (el *system prompt*, las definiciones de herramientas) **idéntica** en cada llamada para que se pueda guardar en caché, y pon lo que cambia **después**.

> 📌 **Nota de producción:** la guía de Anthropic sobre ingeniería de contexto vale la pena leerla entera. La idea central: **trata el contexto como un recurso limitado que rinde cada vez menos**, y cúralo como curarías el resumen para un ingeniero experto.

> 💡 **Idea:** tu `AGENTS.md` de este curso es exactamente un *system prompt* por secciones: quién es el alumno, el papel de la IA, el idioma, qué leer antes, cómo dar la clase, qué está prohibido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un system prompt por secciones
lenguaje: js
pide: Completa `armarPrompt(partes)`. Arma el texto con las secciones en este orden fijo: `rol`, `tarea`, `reglas`, `herramientas`, `formato`. Cada una empieza con su título (`## Rol`, `## Tarea`, `## Reglas`, `## Herramientas`, `## Formato`) y debajo su texto; se separan con una línea vacía (`'\n\n'`). Salta las que no vienen. Y si hay `reglas`, al final repítelas: `'Recuerda: '` + las reglas (lo importante, cerca del final).
--- código
const ORDEN = [['rol', 'Rol'], ['tarea', 'Tarea'], ['reglas', 'Reglas'], ['herramientas', 'Herramientas'], ['formato', 'Formato']];

function armarPrompt(partes) {
  // tu código aquí
}
--- pruebas
prueba('solo el rol', () => igual(armarPrompt({ rol: 'Eres el Copiloto.' }), '## Rol\nEres el Copiloto.'));
prueba('el orden es fijo', () => igual(armarPrompt({ tarea: 'Responde.', rol: 'Eres el Copiloto.' }), '## Rol\nEres el Copiloto.\n\n## Tarea\nResponde.'));
prueba('las reglas se repiten al final', () => igual(
  armarPrompt({ rol: 'Eres el Copiloto.', reglas: 'Nunca inventes números.' }),
  '## Rol\nEres el Copiloto.\n\n## Reglas\nNunca inventes números.\n\nRecuerda: Nunca inventes números.'
));
prueba('siempre igual (bueno para el caché)', () => igual(armarPrompt({ rol: 'a', formato: 'b' }), armarPrompt({ formato: 'b', rol: 'a' })));
--- solución
const ORDEN = [['rol', 'Rol'], ['tarea', 'Tarea'], ['reglas', 'Reglas'], ['herramientas', 'Herramientas'], ['formato', 'Formato']];

function armarPrompt(partes) {
  const secciones = ORDEN.filter(([clave]) => partes[clave]).map(([clave, titulo]) => `## ${titulo}\n${partes[clave]}`);
  if (partes.reglas) secciones.push(`Recuerda: ${partes.reglas}`);
  return secciones.join('\n\n');
}
```

## 4.2 Diseño de herramientas

> 🌎 **En la vida real:** un control remoto bien hecho tiene un botón para cada cosa, con un dibujo claro. Uno mal hecho tiene un botón que "según cuántas veces lo aprietes" hace cinco cosas distintas. Las herramientas de un agente son su control remoto.

> 🌎 **Otro ejemplo:** Como los botones de un ascensor: cada uno hace una sola cosa, con un número claro, y si aprietas un piso que no existe, no pasa nada raro.

Las herramientas son **la interfaz entre el modelo y el mundo**. **Muchas fallas que parecen de razonamiento son, en verdad, fallas de diseño de herramientas.** Diseña la interfaz agente-computadora con el mismo cuidado que una interfaz para personas.

- **Una herramienta, un trabajo.** Las herramientas con cinco modos confunden al modelo. Divídelas.
- **El nombre y la descripción SON el prompt.** Di qué hace, cuándo usarla, **cuándo no** usarla y qué devuelve. Incluye un ejemplo de llamada si el formato no es obvio.
- **Entradas con tipos y validadas.** Usa JSON Schema (o Zod, en JavaScript). Rechaza las llamadas malas con un mensaje que le diga al modelo **cómo arreglarla**.
- **Salida ordenada y con límite.** Un objeto con un estado, los datos y una pista del siguiente paso. Limita el tamaño. **Nunca** devuelvas HTML crudo ni una tabla de 50.000 filas.
- **Errores que enseñan.** "Error 500" no enseña nada. "No encontré la cuenta. Revisa el formato de `account_id`: debe tener 8 dígitos" le enseña al modelo a recuperarse.
- **A prueba de errores (*poka-yoke*).** Si el modelo insiste en pasar rutas relativas, exige rutas absolutas en el esquema. **Haz que la llamada equivocada sea difícil de escribir.**
- **Marca la seguridad.** Marca cada herramienta como **solo lectura** o **destructiva**. Para las destructivas, exige confirmación o un modo de prueba (*dry run*).
- **Prueba las herramientas con el modelo.** Mira cómo las llama en 20 tareas reales y corrige las descripciones según lo que lo confunde.

> 💡 **Idea:** *poka-yoke* es una palabra japonesa de las fábricas de Toyota: "a prueba de errores". Como el enchufe que solo entra de una forma.

**Una herramienta bien definida:**

```json
{
  "name": "buscar_pedido",
  "description": "Busca UN pedido por su número. Úsala cuando el usuario menciona un número de pedido o pregunta por una compra concreta. NO la uses para buscar pedidos por fecha o por cliente: para eso está buscar_pedidos. Devuelve: estado, productos, totales y movimientos del envío. Solo lectura.",
  "input_schema": {
    "type": "object",
    "properties": {
      "id_pedido": {
        "type": "string",
        "pattern": "^PED-[0-9]{8}$",
        "description": "Número de pedido con el formato PED-12345678"
      }
    },
    "required": ["id_pedido"]
  }
}
```

**En Python** la misma definición es un **diccionario** con la misma forma, y se le pasa al modelo en la lista de herramientas:

```python
buscar_pedido = {
    "name": "buscar_pedido",
    "description": (
        "Busca UN pedido por su número. Úsala cuando el usuario menciona un número de pedido "
        "o pregunta por una compra concreta. NO la uses para buscar pedidos por fecha o por "
        "cliente: para eso está buscar_pedidos. Devuelve: estado, productos, totales y "
        "movimientos del envío. Solo lectura."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "id_pedido": {
                "type": "string",
                "pattern": "^PED-[0-9]{8}$",
                "description": "Número de pedido con el formato PED-12345678",
            },
        },
        "required": ["id_pedido"],
    },
}
```

- Los textos largos entre paréntesis `( "…" "…" )` se **pegan solos**: Python junta los pedazos en un solo texto. Sirve para que la descripción no quede en una línea larguísima.

Fíjate: dice **cuándo usarla**, **cuándo no** y **qué devuelve**; el `pattern` hace imposible pasar un número mal formado, y avisa que es **solo lectura**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Errores que enseñan y salidas con límite
lenguaje: js
pide: Completa la herramienta `buscarPedido(args)`. Si `args.idPedido` no son exactamente 8 dígitos (`/^\d{8}$/`), devuelve `{ estado: 'error', mensaje: 'El idPedido debe tener 8 dígitos, por ejemplo 12345678' }`: un error que le dice al modelo **cómo** corregir. Si no está en `PEDIDOS`, `{ estado: 'no_encontrado', mensaje: 'No hay un pedido 12345678. Pregúntale al cliente el número' }` (con su número). Si está, `{ estado: 'ok', datos }` con solo los **3 últimos** movimientos.
--- código
const PEDIDOS = {
  '12345678': { cliente: 'Ana', movimientos: ['creado', 'pagado', 'enviado', 'en camino', 'entregado'] },
};

function buscarPedido(args) {
  // tu código aquí
}
--- pruebas
prueba('número mal formado', () => igual(buscarPedido({ idPedido: '123' }), { estado: 'error', mensaje: 'El idPedido debe tener 8 dígitos, por ejemplo 12345678' }));
prueba('sin número', () => igual(buscarPedido({}).estado, 'error'));
prueba('no existe', () => igual(buscarPedido({ idPedido: '87654321' }), { estado: 'no_encontrado', mensaje: 'No hay un pedido 87654321. Pregúntale al cliente el número' }));
prueba('encontrado, con salida flaca', () => igual(buscarPedido({ idPedido: '12345678' }), { estado: 'ok', datos: { cliente: 'Ana', movimientos: ['enviado', 'en camino', 'entregado'] } }));
--- solución
const PEDIDOS = {
  '12345678': { cliente: 'Ana', movimientos: ['creado', 'pagado', 'enviado', 'en camino', 'entregado'] },
};

function buscarPedido(args) {
  const id = args.idPedido;
  if (!/^\d{8}$/.test(id ?? '')) return { estado: 'error', mensaje: 'El idPedido debe tener 8 dígitos, por ejemplo 12345678' };
  const pedido = PEDIDOS[id];
  if (!pedido) return { estado: 'no_encontrado', mensaje: `No hay un pedido ${id}. Pregúntale al cliente el número` };
  return { estado: 'ok', datos: { cliente: pedido.cliente, movimientos: pedido.movimientos.slice(-3) } };
}
```

## 4.3 Manejo del estado

> 🌎 **En la vida real:** el marcador del videojuego que guarda la partida: en qué nivel vas, cuántas vidas, qué objetos tienes. Si se apaga la consola, vuelves exactamente ahí. Sin eso, empiezas de cero cada vez.

El **estado** es todo lo que el agente necesita para **retomar desde cualquier punto**: la conversación, el plan, los resultados de herramientas, las referencias de memoria, cuánto presupuesto gastó y en qué paso va. **Diseña el esquema del estado antes de escribir el ciclo.**

- **El estado es un objeto con tipos, no un diccionario suelto.** Cada nodo lee y escribe campos con nombre.
- **Punto de guardado después de cada paso.** Un *checkpoint* es una foto serializada del estado con un id de ejecución y un número de paso. Permite retomar, repetir, depurar "viajando en el tiempo" y pausar para una persona.
- **Separa el estado de la conversación** (mensajes) **del estado de la tarea** (plan, resultados, marcas). Cambian a ritmos distintos y se consultan distinto.
- **Guárdalo en un almacén de verdad.** Postgres o Redis para el estado; almacenamiento de objetos para archivos grandes. **El estado en memoria no sobrevive a una nueva versión** (*deploy*).
- **Ponle versión al esquema.** Los puntos de guardado viejos tienen que seguir cargando después de que agregues un campo.

```ts
type EstadoAgente = {
  idEjecucion: string;
  mensajes: Mensaje[];             // estado de la conversación
  plan: Plan | null;               // estado de la tarea
  resultados: Record<number, unknown>;
  paso: number;
  tokensUsados: number;
  costoUsd: number;
  esperandoPersona: boolean;
  final: string | null;
  versionEsquema: number;
};

function guardarPunto(estado: EstadoAgente): void {
  almacen.poner(`ejecuciones:${estado.idEjecucion}:paso:${estado.paso}`, serializar(estado));
}
```

**El mismo estado en Python:**

```python
from typing import Any, TypedDict

class EstadoAgente(TypedDict):
    id_ejecucion: str
    mensajes: list[dict]             # estado de la conversación
    plan: Plan | None                # estado de la tarea
    resultados: dict[int, Any]
    paso: int
    tokens_usados: int
    costo_usd: float
    esperando_persona: bool
    final: str | None
    version_esquema: int

def guardar_punto(estado: EstadoAgente) -> None:
    almacen.poner(f"ejecuciones:{estado['id_ejecucion']}:paso:{estado['paso']}", serializar(estado))
```

**Cómo se lee:**
- `TypedDict` describe un **diccionario con campos fijos y tipos**: es el `type EstadoAgente = { ... }` de TypeScript.
- `dict[int, Any]` → un diccionario cuyas claves son números y sus valores pueden ser cualquier cosa (`Any`).
- `-> None` después de los paréntesis dice **qué devuelve** la función: aquí, nada. Es el `: void` de TypeScript.
- `estado['paso']` → así se lee un dato de un diccionario en Python (con corchetes y comillas, no con punto).

> 🌎 **En la vida real:** el `TypedDict` es la ficha de la partida guardada del videojuego, con casillas fijas: nivel, vidas, objetos. Si mañana agregas una casilla nueva ("mascota"), subes la `version_esquema` para que las partidas viejas sigan cargando.

> 💡 **Idea:** es TypeScript, como Copiloto (Tema 01). Los tipos aquí hacen el mismo trabajo: si alguien escribe mal un campo, se entera antes de correrlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Puntos de guardado con versión
lenguaje: python
pide: Completa `guardar_punto(puntos, estado)`: agrega a la lista `puntos` una **copia** del estado (`dict(estado)`) con `"version": 2`, y devuelve cuántos puntos hay. Y `cargar(punto)`: los puntos viejos (`"version"` 1 o sin versión) no tienen el campo `"marcas"`; devuelve una copia con `"marcas": []` y `"version": 2`. Los de versión 2 se devuelven como copia, sin cambios.
--- código
def guardar_punto(puntos, estado):
    pass  # tu código aquí


def cargar(punto):
    pass  # tu código aquí
--- pruebas
def _guarda_copia():
    puntos = []
    estado = {"paso": 1, "marcas": []}
    igual(guardar_punto(puntos, estado), 1)
    estado["paso"] = 2
    igual(puntos[0]["paso"], 1)
    igual(puntos[0]["version"], 2)
prueba("guarda una copia con versión", _guarda_copia)
prueba("carga uno viejo", lambda: igual(cargar({"version": 1, "paso": 3}), {"version": 2, "paso": 3, "marcas": []}))
prueba("carga uno sin versión", lambda: igual(cargar({"paso": 3}), {"paso": 3, "marcas": [], "version": 2}))
prueba("uno nuevo queda igual", lambda: igual(cargar({"version": 2, "paso": 4, "marcas": ["revisar"]}), {"version": 2, "paso": 4, "marcas": ["revisar"]}))
--- solución
def guardar_punto(puntos, estado):
    copia = dict(estado)
    copia["version"] = 2
    puntos.append(copia)
    return len(puntos)


def cargar(punto):
    copia = dict(punto)
    if copia.get("version", 1) < 2:
        copia["marcas"] = []
        copia["version"] = 2
    return copia
```

## 4.4 Salidas ordenadas

> 🌎 **En la vida real:** un formulario del gobierno tiene casillas: "Nombre", "Fecha (DD/MM/AAAA)", "Sexo: M / F". No te dejan escribir una carta libre, porque **una máquina** lo va a procesar. Cuando la salida del modelo la va a leer **código**, necesita casillas.

> 🌎 **Otro ejemplo:** Como una planilla con columnas fijas que otra máquina va a leer: si escribes fuera de las columnas, la máquina no lo entiende.

**Los agentes son programas. Los programas necesitan datos, no prosa.** Siempre que la salida del modelo alimente código (una ruta, un plan, un veredicto, una llamada a herramienta), **fuerza un esquema**:
- Usa la salida estructurada nativa o las llamadas a herramientas para recibir JSON que cumpla el esquema.
- **Valídalo**, y si falla, **reintenta pasándole el error** de validación.
- Esquemas **planos y chicos**. Los esquemas muy anidados y con muchos campos opcionales producen más errores.
- Para las categorías usa **tipos literales** (una lista cerrada de opciones), no texto libre.
- Pon una descripción corta en **cada campo**: **la descripción es el prompt de ese campo**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Validar la salida y reintentar con el error
lenguaje: js
pide: Completa `validarRuta(texto)`: el modelo devolvió texto que debería ser JSON con `categoria` (una de `CATEGORIAS`) y `confianza` (un número de 0 a 1). Devuelve `{ ok: true, ruta }` o `{ ok: false, error }` con uno de estos errores: `'no es JSON'`, `'categoria debe ser una de: codigo, soporte, no_claro'`, `'confianza debe ser un número de 0 a 1'`. Después `pedirRuta(llm, maxIntentos)`: llama a `llm(error)` (la primera vez con `null`) y, si no valida, vuelve a llamarlo **pasándole el error**. Devuelve la ruta, o `null` si se acaban los intentos.
--- código
const CATEGORIAS = ['codigo', 'soporte', 'no_claro'];

function validarRuta(texto) {
  // tu código aquí
}

function pedirRuta(llm, maxIntentos = 3) {
  // tu código aquí
}
--- pruebas
prueba('bien', () => igual(validarRuta('{"categoria":"soporte","confianza":0.9}'), { ok: true, ruta: { categoria: 'soporte', confianza: 0.9 } }));
prueba('no es JSON', () => igual(validarRuta('Claro, la categoría es soporte'), { ok: false, error: 'no es JSON' }));
prueba('categoría inventada', () => igual(validarRuta('{"categoria":"ventas","confianza":0.9}').error, 'categoria debe ser una de: codigo, soporte, no_claro'));
prueba('confianza fuera de rango', () => igual(validarRuta('{"categoria":"codigo","confianza":9}').error, 'confianza debe ser un número de 0 a 1'));
prueba('reintenta pasando el error', () => {
  const recibidos = [];
  const llm = (error) => { recibidos.push(error); return error ? '{"categoria":"codigo","confianza":0.8}' : 'es código'; };
  igual(pedirRuta(llm), { categoria: 'codigo', confianza: 0.8 });
  igual(recibidos, [null, 'no es JSON']);
});
prueba('se rinde', () => igual(pedirRuta(() => 'nada', 2), null));
--- solución
const CATEGORIAS = ['codigo', 'soporte', 'no_claro'];

function validarRuta(texto) {
  let ruta;
  try {
    ruta = JSON.parse(texto);
  } catch {
    return { ok: false, error: 'no es JSON' };
  }
  if (!CATEGORIAS.includes(ruta.categoria)) return { ok: false, error: `categoria debe ser una de: ${CATEGORIAS.join(', ')}` };
  if (typeof ruta.confianza !== 'number' || ruta.confianza < 0 || ruta.confianza > 1) return { ok: false, error: 'confianza debe ser un número de 0 a 1' };
  return { ok: true, ruta };
}

function pedirRuta(llm, maxIntentos = 3) {
  let error = null;
  for (let i = 0; i < maxIntentos; i++) {
    const r = validarRuta(llm(error));
    if (r.ok) return r.ruta;
    error = r.error;
  }
  return null;
}
```

## 4.5 Elegir el modelo

> 🌎 **En la vida real:** para mover un sofá llamas a dos personas fuertes; para llevar una carta, a un mensajero en moto. No mandas al camión de mudanza a llevar una carta.

> 🌎 **Otro ejemplo:** Como elegir quién atiende en un restaurante: el chef para los platos difíciles, un ayudante para pelar papas.

Usa **el modelo más fuerte** para los pasos que necesitan criterio (planificar, sintetizar, razonamiento difícil) y **modelos más chicos y rápidos** para lo que no (enrutar, extraer datos, críticas simples, dar formato). **Mide con tus propias pruebas**: los rankings públicos no se trasladan bien a tu tarea. Prepárate para el cambio: envuelve las llamadas al modelo **detrás de una sola interfaz** para poder cambiar de proveedor, y vuelve a correr tus pruebas en cada actualización de modelo.

| Qué revisar | Por qué importa en agentes |
|---|---|
| Confiabilidad al llamar herramientas | Una llamada mal formada rompe el ciclo. Pruébalo con **tus** herramientas, no con una demo. |
| Ventana de contexto y atención | Las ejecuciones largas necesitan espacio, pero la calidad baja a medida que se llena. Prueba con largos reales. |
| Demora por llamada | Los agentes hacen muchas llamadas por tarea. Segundos por llamada se vuelven minutos por ejecución. |
| Costo por millón de *tokens* | Multiplícalo por *tokens* por ejecución, y después por ejecuciones por día. **En los ciclos, mandan los *tokens* de entrada.** |
| Caché de prompts | Los prefijos en caché pueden bajar mucho el costo de entrada de un ciclo. Confirma que el proveedor lo tenga. |
| Salida estructurada | Que el modelo respete el esquema de fábrica reduce reintentos y código de lectura. |
| Pensamiento extendido | Útil para planificar y para críticas difíciles. Caro en lo demás. |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cuánto cuesta un agente por día
lenguaje: js
pide: Los precios se dan por **millón** de *tokens*. Completa `costoPorEjecucion(uso, precio)`: `uso` trae `{ entrada, salida }` en tokens y `precio` trae `{ entrada, salida }` en dólares por millón; redondea a 4 decimales (`Math.round(x * 10000) / 10000`). Y `costoPorDia(uso, precio, ejecuciones)`, redondeado a 2 decimales. Fíjate en las pruebas: en los ciclos manda la **entrada**, porque cada vuelta vuelve a mandar toda la conversación.
--- código
function costoPorEjecucion(uso, precio) {
  // tu código aquí
}

function costoPorDia(uso, precio, ejecuciones) {
  // tu código aquí
}
--- pruebas
const PRECIO = { entrada: 3, salida: 15 };
prueba('una ejecución', () => igual(costoPorEjecucion({ entrada: 40000, salida: 2000 }, PRECIO), 0.15));
prueba('la entrada pesa más', () => ok(40000 * 3 > 2000 * 15, 'en esta ejecución la entrada cuesta más que la salida'));
prueba('por día', () => igual(costoPorDia({ entrada: 40000, salida: 2000 }, PRECIO, 1000), 150));
prueba('un modelo chico', () => igual(costoPorDia({ entrada: 40000, salida: 2000 }, { entrada: 0.25, salida: 1.25 }, 1000), 12.5));
--- solución
function costoPorEjecucion(uso, precio) {
  const dolares = (uso.entrada * precio.entrada + uso.salida * precio.salida) / 1000000;
  return Math.round(dolares * 10000) / 10000;
}

function costoPorDia(uso, precio, ejecuciones) {
  const dolares = ((uso.entrada * precio.entrada + uso.salida * precio.salida) / 1000000) * ejecuciones;
  return Math.round(dolares * 100) / 100;
}
```

## 4.6 Protocolos: MCP y A2A

> 🌎 **En la vida real:** el enchufe USB-C. Antes, cada aparato tenía su cable. Ahora, un solo tipo de enchufe sirve para el celular, la compu y los auriculares. **MCP es el USB-C de las herramientas para agentes.**

> 🌎 **Otro ejemplo:** Como los enchufes universales de un hotel: cualquier cargador entra, sin adaptador especial para cada uno.

**MCP** (*Model Context Protocol*) es un **estándar abierto** para conectar agentes con herramientas y datos.
- Un **servidor MCP** ofrece **herramientas**, **recursos** y **prompts**.
- Cualquier cliente compatible con MCP los puede **descubrir y llamar** sin escribir código de integración a medida.
- Se volvió la forma normal de darle a un agente acceso a archivos, bases de datos, GitHub, plataformas de chat y APIs internas, y la mayoría de los *frameworks* lo soportan de fábrica.
- Las versiones recientes agregaron soporte para **tareas largas** y para **servidores sin estado** que pueden ir detrás de balanceadores de carga comunes.
- **Construye tus herramientas como servidores MCP cuando más de un agente o producto las necesita.**

```text
Agente (anfitrión MCP: tu app, el editor o el chat) ─► Cliente MCP (descubre, llama, devuelve) ─┬─► Servidor de archivos (leer, escribir, buscar)
                                                                                                 ├─► Servidor de base de datos (consultar, esquema)
                                                                                                 └─► Servidor de API interna (herramientas, recursos, prompts)
El anfitrión corre el agente. Los clientes hablan MCP. Los servidores ofrecen lo suyo una sola vez, para todos los clientes.
```

> 💡 **Idea:** yo mismo, Claude Code, uso MCP: el navegador con el que probé esta página, el panel de tareas que ves al trabajar conmigo, todos son servidores MCP.

**A2A** (*Agent-to-Agent*), liderado bajo la **Linux Foundation**, estandariza cómo **agentes hechos con distintos *frameworks*** se descubren y se pasan tareas. Importa en empresas donde agentes de distintos equipos o proveedores tienen que cooperar. **Para un solo producto, un supervisor con llamadas directas a funciones es más simple y más fácil de depurar.**

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Hablar MCP: los mensajes JSON-RPC
lenguaje: js
pide: MCP usa mensajes **JSON-RPC 2.0**. Completa `pedido(id, metodo, params)`, que arma `{ jsonrpc: '2.0', id, method: metodo, params }`. Después `listarHerramientas(id)` (el método `'tools/list'`, con `params` vacío `{}`) y `llamarHerramienta(id, nombre, args)` (el método `'tools/call'`, con `params: { name: nombre, arguments: args }`). Y `nombresDe(respuesta)`: de una respuesta como `{ result: { tools: [{ name }] } }`, la lista de nombres.
--- código
function pedido(id, metodo, params) {
  // tu código aquí
}

function listarHerramientas(id) {
  // tu código aquí
}

function llamarHerramienta(id, nombre, args) {
  // tu código aquí
}

function nombresDe(respuesta) {
  // tu código aquí
}
--- pruebas
prueba('un pedido', () => igual(pedido(1, 'ping', {}), { jsonrpc: '2.0', id: 1, method: 'ping', params: {} }));
prueba('listar', () => igual(listarHerramientas(2), { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }));
prueba('llamar', () => igual(llamarHerramienta(3, 'leer_archivo', { ruta: '/notas.md' }), { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'leer_archivo', arguments: { ruta: '/notas.md' } } }));
prueba('los nombres', () => igual(nombresDe({ jsonrpc: '2.0', id: 2, result: { tools: [{ name: 'leer_archivo' }, { name: 'buscar' }] } }), ['leer_archivo', 'buscar']));
--- solución
function pedido(id, metodo, params) {
  return { jsonrpc: '2.0', id, method: metodo, params };
}

function listarHerramientas(id) {
  return pedido(id, 'tools/list', {});
}

function llamarHerramienta(id, nombre, args) {
  return pedido(id, 'tools/call', { name: nombre, arguments: args });
}

function nombresDe(respuesta) {
  return respuesta.result.tools.map((t) => t.name);
}
```

## 4.7 El panorama de los frameworks

> 🌎 **En la vida real:** un carro automático te ahorra trabajo desde el primer día, pero si un día se traba la caja, no sabes qué pasa adentro. Un *framework* es eso: te ayuda la primera semana y te puede frenar todas las semanas siguientes.

> 🌎 **Otro ejemplo:** Como comprar una casa amueblada: te mudas rápido, pero si un día quieres cambiar algo, tienes que entender cómo la armaron.

Usa un *framework* cuando te da **gratis** ejecución durable, rastreo y pausas para una persona. **Sáltalo** cuando su abstracción esconde justo el ciclo que necesitas depurar. Y de cualquier forma, **construye el ciclo a mano una vez**, para saber qué está haciendo el *framework* por ti.

El panorama cuando se escribió la guía:

| Framework | Mejor para | Ojo con |
|---|---|---|
| **LangGraph** | Flujos basados en grafos con estado con tipos, puntos de guardado, ciclos e interrupciones para una persona. Lo normal en producción para agentes complejos con estado. | Es largo de escribir para agentes simples. Aprende su modelo de estado antes que las abstracciones de arriba. |
| **Claude Agent SDK** | Agentes que trabajan con archivos, comandos, código y herramientas MCP, con **el mismo ciclo que mueve a Claude Code**. Trae subagentes y *hooks*. | Viene con decisiones tomadas. Rinde más cuando tu agente se parece a uno de código o de operaciones. |
| **OpenAI Agents SDK** | Agentes, traspasos, controles, sesiones y rastreo con poco código. En 2026 sumó ejecución aislada y subagentes. | Está pensado para un proveedor, aunque acepta otros modelos. |
| **Google ADK** | Jerarquías multiagente, A2A de fábrica, Python, Java y Go, publicación en Google Cloud. | Pesa más dentro del ecosistema de Google. |
| **Microsoft Agent Framework** | El sucesor de AutoGen y Semantic Kernel, para equipos .NET y Python en Azure. | Pensado para empresas. Migrar desde AutoGen es trabajo de verdad. |
| **CrewAI** | Equipos multiagente por roles y el camino más rápido para prototipos. Soporta MCP y A2A. | Menos control del ciclo. Muchos equipos prototipan aquí y lo rehacen en LangGraph para producción. |
| **Pydantic AI** | Agentes individuales con tipos seguros y salidas ordenadas en Python, con muy poca abstracción. | Ecosistema más chico para multiagente. |
| **Mastra, Vercel AI SDK** | Proyectos en TypeScript y productos web que agregan funciones de agente. | Abstracciones de agente más nuevas que las líderes en Python. |
| **smolagents** | Agentes de "código como acción" con muy poca superficie. | Necesita una caja aislada de verdad. Pequeño a propósito. |
| **Sin framework** | Agentes de un solo ciclo, para aprender, y para el máximo control. | El rastreo, los reintentos y el guardado son tuyos. |

> 💡 **Idea:** como tú trabajas en TypeScript, **Vercel AI SDK** o **Mastra** serían tu puerta de entrada natural; y el **Claude Agent SDK** si quieres un agente que trabaje con archivos y código.

> 🎤 **Entrevista:** **nadie te contrata por conocer un *framework*.** Te contratan por saber **por qué** el *framework* toma las decisiones que toma. Tienes que poder explicar puntos de guardado, flechas condicionales e interrupciones **sin nombrar ninguna librería**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Framework o sin framework?
lenguaje: js
pide: Completa `sugerir(proyecto)` con la tabla de arriba, en este orden: si `proyecto.paraAprender` → `'sin framework'`; si necesita `'grafo'` (está en `proyecto.necesita`) → `'LangGraph'`; si necesita `'archivos y código'` → `'Claude Agent SDK'`; si `proyecto.lenguaje` es `'typescript'` → `'Vercel AI SDK'`; si es `'python'` → `'Pydantic AI'`; y si no, `'sin framework'`.
--- código
function sugerir(proyecto) {
  // tu código aquí
}
--- pruebas
prueba('para aprender', () => igual(sugerir({ paraAprender: true, necesita: ['grafo'] }), 'sin framework'));
prueba('grafo con puntos de guardado', () => igual(sugerir({ lenguaje: 'python', necesita: ['grafo'] }), 'LangGraph'));
prueba('trabaja con archivos y código', () => igual(sugerir({ lenguaje: 'typescript', necesita: ['archivos y código'] }), 'Claude Agent SDK'));
prueba('una web en TypeScript', () => igual(sugerir({ lenguaje: 'typescript', necesita: [] }), 'Vercel AI SDK'));
prueba('Python con tipos', () => igual(sugerir({ lenguaje: 'python', necesita: [] }), 'Pydantic AI'));
prueba('otro lenguaje', () => igual(sugerir({ lenguaje: 'go', necesita: [] }), 'sin framework'));
--- solución
function sugerir(proyecto) {
  const necesita = proyecto.necesita ?? [];
  if (proyecto.paraAprender) return 'sin framework';
  if (necesita.includes('grafo')) return 'LangGraph';
  if (necesita.includes('archivos y código')) return 'Claude Agent SDK';
  if (proyecto.lenguaje === 'typescript') return 'Vercel AI SDK';
  if (proyecto.lenguaje === 'python') return 'Pydantic AI';
  return 'sin framework';
}
```

## ✍️ Práctica: diseñar agentes

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

```practica
escribe :: ¿Qué diferencia hay entre ingeniería de prompts e ingeniería de contexto? :: La de prompts es escribir buenas instrucciones; la de contexto es decidir todo lo que entra en la ventana del modelo en cada paso (instrucciones, herramientas, documentos, memoria, historial, resultados).
vf :: Más contexto siempre es mejor contexto
elige :: ¿Dónde conviene poner las instrucciones más importantes? :: Solo en el medio :: Cerca del principio, y repetir las críticas cerca del final :: Solo al final
elige :: ¿Qué hay que dejar idéntico en cada llamada para aprovechar el caché de prompts? :: El mensaje del usuario :: La parte fija: system prompt y definiciones de herramientas :: Los resultados de herramientas
elige :: Según la guía, muchas fallas que parecen de razonamiento son en verdad fallas de… :: Internet :: Diseño de herramientas :: Memoria RAM
elige :: ¿Cuál es un error que enseña? :: "Error 500" :: "No encontré la cuenta. Revisa el formato: debe tener 8 dígitos" :: "Algo salió mal"
elige :: ¿Qué es poka-yoke en el diseño de herramientas? :: Un framework :: Hacer que la llamada equivocada sea difícil de escribir :: Una base de datos
vf :: El estado en memoria sobrevive a una nueva versión (deploy)
elige :: Cuando la salida del modelo la va a leer código, ¿qué hay que hacer? :: Pedir prosa :: Forzar un esquema (salida estructurada) y validarlo :: Nada
elige :: ¿Qué modelo usas para enrutar o dar formato? :: El más caro :: Uno chico y rápido :: Ninguno
elige :: ¿Qué es MCP? :: Un modelo de IA :: Un estándar abierto para conectar agentes con herramientas, recursos y prompts :: Un lenguaje
elige :: ¿Cuándo conviene construir tus herramientas como servidores MCP? :: Siempre :: Cuando más de un agente o producto las necesita :: Nunca
elige :: Si tu proyecto es en TypeScript, ¿qué frameworks de agentes son la puerta natural? :: CrewAI y LangGraph :: Vercel AI SDK o Mastra :: Google ADK
vf :: Nadie te contrata por conocer un framework, sino por saber por qué toma sus decisiones
```
