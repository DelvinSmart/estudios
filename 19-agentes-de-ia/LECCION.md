# Tema 19: Agentes de IA

> 🌎 **En la vida real:** un chat con IA es como preguntarle algo a un experto por teléfono: te responde y cuelga. Un **agente** es como contratar a ese experto para que **haga el trabajo**: busca, llama, revisa, se equivoca, corrige y te avisa cuando terminó. Esta clase es sobre cómo se diseña ese "empleado".

Esta clase está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), que está en tu SSD: `SSD_Desarrollo/Documentos/baswe-agentic-design-patterns-guide.pdf`. No es una copia ni una traducción palabra por palabra: es **cada concepto** de la guía, explicado en español con mis palabras, con ejemplos de la vida real y con código **en JavaScript (que ya conoces) y en Python** (el lenguaje que más se usa en IA y el que usa la guía). Si una palabra te genera dudas, abre el PDF en esa misma sección: los números (1.1, 2.3, 4.6…) son los mismos.

**La idea central de la guía:** la mayoría aprende agentes al revés (elige una herramienta, copia un ejemplo y termina con algo que no puede explicar). Aquí va al derecho: **primero los patrones**, después las decisiones de ingeniería de cada uno, y al final lo que mantiene vivo a un agente cuando lo usan personas reales.

**Antes de empezar:** haz primero los fundamentos (Temas 01 a 10). Esta clase es la última a propósito.

**Tres formas de estudiarla** (las mismas que propone la guía):

| Si tienes… | Lee | Te llevas |
|---|---|---|
| Una noche antes de una entrevista | 1.1, 1.2, los cinco patrones de la Parte 2, la tabla 3.6, y 7.3 y 7.4 | Definiciones claras, un mapa mental de los patrones y respuestas para las 12 preguntas que más hacen |
| Una semana para construir algo | La Parte 2 completa, 4.1 a 4.4, 5.2, 5.3 y 7.2 | Un patrón bien construido, herramientas bien diseñadas, un primer set de pruebas y una lista para publicar |
| Un mes para ir a fondo | Todo, en orden, haciendo cada ejercicio | Cinco proyectos para tu portafolio, una arquitectura que puedes defender y el vocabulario para liderar una revisión de diseño |

> 📌 **Nota:** la frase más importante de la guía: **leer sobre agentes no es una habilidad; construir uno, sí.** Cada patrón termina con un ejercicio para construir. Hazlos.

## Parte 0. Python para leer los ejemplos

> 🌎 **En la vida real:** ya hablas español; aprender a **leer** portugués te lleva días, no años, porque casi todo se parece. Tú ya lees JavaScript y TypeScript; leer Python es igual: cambian algunas palabras y la forma de escribir, pero las ideas son las mismas.

**¿Por qué Python?** Es **el lenguaje más usado en inteligencia artificial**. Las librerías de IA, los ejemplos de las empresas que hacen los modelos, los *frameworks* de agentes y la mayoría de las ofertas de trabajo de "AI engineer" lo usan. La guía original trae todo su código en Python. Por eso en esta clase **cada ejemplo está dos veces**: primero en JavaScript (lo que ya conoces) y después en **Python** (lo que te van a pedir).

> 💡 **Idea:** los nombres de los ejemplos están en español para que los compares fácil con la versión en JavaScript. En un trabajo real, el código casi siempre se escribe con nombres en inglés (`run_agent` en vez de `correr_agente`), pero la estructura es la misma.

### Lo mismo, en los dos lenguajes

| Qué | JavaScript / TypeScript | Python |
|---|---|---|
| Comentario | `// nota` | `# nota` |
| Crear una variable | `const total = 0;` | `total = 0` (sin `const`, sin `let`, sin `;`) |
| Texto con valores | `` `Hola ${nombre}` `` | `f"Hola {nombre}"` |
| Sí / no / nada | `true`, `false`, `null` | `True`, `False`, `None` (con mayúscula) |
| Y / o / no | `&&`, `\|\|`, `!` | `and`, `or`, `not` |
| Comparar | `===`, `!==` | `==`, `!=` |
| Lista | `['Uber', '99']` | `["Uber", "99"]` (se llama *list*) |
| Objeto | `{ marca: 'Toyota' }` | `{"marca": "Toyota"}` (se llama *diccionario*, *dict*) |
| Leer un dato | `carro.marca` | `carro["marca"]` |
| Agregar a una lista | `lista.push(x)` | `lista.append(x)` |
| Largo | `lista.length` | `len(lista)` |
| Función | `function sumar(a, b) { return a + b; }` | `def sumar(a, b):` y en la línea de abajo, con sangría, `return a + b` |
| Si / si no | `if (x > 0) { … } else { … }` | `if x > 0:` … `else:` … |
| Repetir | `for (const app of apps) { … }` | `for app in apps:` … |
| Errores | `try { … } catch (e) { … }` | `try:` … `except Exception as e:` … |
| Traer de otro archivo | `import { x } from './y.js';` | `from y import x` |
| Tipos | `nombre: string` | `nombre: str` |
| "Texto o nada" | `string \| null` | `str \| None` |

### La gran diferencia: la sangría

En JavaScript, las **llaves** `{ }` dicen qué está adentro de qué. Python **no usa llaves**: usa **dos puntos** `:` al final de la línea y **4 espacios** hacia adentro en las líneas que le pertenecen.

```python
def es_inmutable(app_id: str) -> bool:
    # todo lo que está corrido hacia adentro es parte de la función
    if app_id in ["extras", "particular_trips", "my_company"]:
        return True
    return False

print(es_inmutable("uber"))     # False
print(es_inmutable("extras"))   # True
```

Es tu función `isImmutableEarningPlatform` del Tema 01, escrita en Python. Fíjate:
- `def` crea la función; `-> bool` dice que devuelve sí o no.
- `in [...]` pregunta "¿está dentro de esta lista?". Es otra forma de escribir los tres `||`.
- `print(...)` muestra algo en la terminal (es el `console.log` de Python).

> 🌎 **En la vida real:** la sangría es como un índice de un libro con subtítulos corridos hacia la derecha: con solo mirar cuánto está corrido un renglón, sabes de qué capítulo es. En Python, si corres mal un renglón, cambia de capítulo, y el programa hace otra cosa (o da error).

### Las tres cosas de Python que más vas a ver en IA

**1. Clases con Pydantic (moldes de datos).** Sirven para describir y **validar** lo que entra y sale del modelo:

```python
from pydantic import BaseModel

class Carga(BaseModel):
    litros: float
    app: str = "Uber"

Carga(litros=45)          # bien: Carga(litros=45.0, app='Uber')
Carga(litros="mucho")     # error: "mucho" no es un número
```

**2. Listas por comprensión** (el `.map` y el `.filter` de Python):

```python
valores = [18, 12, 25]
dobles = [v * 2 for v in valores]          # [36, 24, 50]
grandes = [v for v in valores if v > 15]    # [18, 25]
```

**3. `async` / `await` y `asyncio.gather`** (el `Promise.all` de Python), para hacer varias cosas a la vez.

### Cómo correr un archivo de Python

Tu Mac ya trae Python. Guarda un archivo `prueba.py` y en la terminal:

```bash
python3 prueba.py
```

Para instalar una librería, como Pydantic:

```bash
python3 -m pip install pydantic
```

> 📌 **Nota:** `pip` es el `npm` de Python: instala librerías. Y **pytest** es el Jest de Python: corre las pruebas automáticas.

```practica
vf :: En Python, el `null` de JavaScript se escribe `None`
vf :: En Python, los bloques se marcan con llaves `{ }` como en JavaScript
vf :: `f"Hola {nombre}"` en Python es como `` `Hola ${nombre}` `` en JavaScript
vf :: En Python, `true` se escribe con minúscula, igual que en JavaScript
elige :: ¿Qué es `def` en Python? :: Una variable :: La forma de crear una función :: Un comentario
elige :: ¿Cómo se escribe "y" en una condición de Python? :: `&&` :: `and` :: `+`
elige :: ¿Qué es el `append` de Python en JavaScript? :: `pop` :: `push` :: `length`
elige :: ¿Para qué se usa Pydantic? :: Para dibujar pantallas :: Para describir y validar los datos que entran y salen :: Para subir a GitHub
escribe :: ¿Por qué esta clase trae los ejemplos en Python además de JavaScript? :: Porque Python es el lenguaje más usado en IA y en los trabajos de ingeniero de IA; JavaScript ayuda a entender, pero en una entrevista de IA casi siempre te van a pedir Python.
```

## Parte 1. Fundamentos

Antes de elegir un patrón hay que saber exactamente qué estás construyendo. Casi toda la confusión sobre agentes viene de usar palabras vagas.

### 1.1 Qué es un agente, de verdad

> 🌎 **En la vida real:** una **llamada al modelo** es una calculadora: metes algo, sale algo, una vez. Un **agente** es un mecánico: mira el carro, decide qué revisar, usa una herramienta, mira qué pasó, decide lo siguiente… y repite hasta que el carro anda o hasta que dice "esto no lo puedo arreglar".

- Una **llamada a un LLM** (un modelo de lenguaje, como Claude) recibe texto y devuelve texto. Hace **una** cosa, **una** vez.
- Un **agente** es un sistema donde el modelo **decide qué hacer después**, actúa con **herramientas**, **observa** qué pasó y **repite** hasta terminar o hasta que salta una condición para parar.
- Lo que lo define es **el ciclo** (el *loop*). El modelo no solo responde: **controla un proceso**.

La forma más clara de verlo, según la guía, es la de Anthropic:

| | Qué es | Quién decide el camino |
|---|---|---|
| **Flujo de trabajo** (*workflow*) | El modelo y las herramientas siguen **caminos escritos de antemano** en el código | Tu código |
| **Agente** | El modelo **dirige** su propio proceso y decide qué herramientas usar | El modelo |

Los dos sirven. **La mayoría de los sistemas reales son flujos de trabajo con partes de agente**, no agentes totalmente libres. Saber cuál de los dos estás construyendo cambia todas las decisiones que vienen después.

**El espectro de autonomía.** Todo sistema está en algún punto de esta línea:

```text
Una llamada → Cadena de prompts → Flujo de trabajo → Agente → Multiagente
un pedido,     pasos fijos con     caminos según      ciclo con   supervisores,
una respuesta  controles           el caso, en        herramientas trabajadores,
                                   paralelo           dirigido     traspasos
                                                      por el LLM
◄── más predecible, más barato, más fácil de probar
                    más autonomía, más capacidad, más costo, más riesgo ──►
```

> 💡 **Idea:** la regla de la guía: **empieza lo más a la izquierda que el problema te permita.**

### 1.2 Las siete piezas de un agente

> 🌎 **En la vida real:** un restaurante. El **chef** decide (el modelo). La **receta y las reglas de la casa** (las instrucciones). Los **cuchillos y el horno** (las herramientas). La **comanda y la despensa** (la memoria). El **ritmo de la cocina**: tomar pedido, cocinar, revisar, servir (el ciclo). El **inspector de higiene** (los controles). Y **el local, la luz y el gas** que mantienen todo andando (el entorno de ejecución).

Todo agente, con la herramienta que sea, tiene estas siete piezas. Si puedes dibujar estas siete cajas y explicar las flechas, entiendes agentes mejor que mucha gente que los publica.

```text
            Instrucciones ─┐          ┌─ Herramientas
                           ▼          ▼
   Modelo ───────►  CICLO DE ORQUESTACIÓN  ◄────── Memoria / estado
                  (llamar al modelo, correr
                   herramientas, ver si para)
                           ▲          ▲
            Controles ─────┘          └─ Entorno de ejecución
```

| Pieza | Qué es |
|---|---|
| **Modelo** | El motor que razona y elige la siguiente acción. El modelo que elijas pone el **techo** de la calidad y el **piso** del costo y la demora. |
| **Instrucciones** | El *system prompt*: el rol, los objetivos, las reglas, el formato de salida y cómo usar las herramientas. **Trátalo como código**: con versiones, probado y revisado. |
| **Herramientas** | Las manos del agente: funciones con entradas y salidas definidas que el modelo puede llamar (buscar, bases de datos, APIs, correr código, archivos, otros agentes). |
| **Memoria y estado** | Lo que sabe ahora (la ventana de contexto) y lo que se guarda entre ejecuciones. **Es la pieza peor diseñada en la mayoría de los agentes.** |
| **Ciclo de orquestación** | El código que llama al modelo, ejecuta las herramientas, agrega los resultados, revisa si hay que parar y repite. **Aquí viven los patrones.** |
| **Controles** (*guardrails*) | Revisiones de entradas, salidas y acciones: reglas, formato, permisos, límites de gasto. |
| **Entorno de ejecución** (*runtime*) | Lo que lo mantiene vivo en producción: registros, puntos de guardado, reintentos, colas, cajas aisladas y la posibilidad de **detenerlo**. |

### 1.3 El ciclo del agente, paso a paso

> 🌎 **En la vida real:** el GPS. Mira dónde estás (observa), decide la próxima calle (razona), te dice "gira a la derecha" (actúa), vuelve a mirar dónde quedaste… y repite hasta que dice "llegaste a tu destino". Y si te pierdes demasiadas veces, recalcula o se rinde.

Si le quitas todos los adornos a cualquier herramienta de agentes, queda esto:

```js
async function correrAgente(tarea, herramientas, maxPasos = 10) {
  const mensajes = [{ rol: 'usuario', contenido: tarea }];

  for (let paso = 0; paso < maxPasos; paso++) {
    const respuesta = await llm(mensajes, { herramientas: esquemas(herramientas) });
    mensajes.push(respuesta.mensaje);

    if (respuesta.llamadas.length === 0) {
      return respuesta.texto;                 // el modelo decidió que terminó
    }
    for (const llamada of respuesta.llamadas) {
      const resultado = await ejecutar(herramientas, llamada);   // validar, correr, atrapar errores
      mensajes.push(resultadoDeHerramienta(llamada.id, resultado));
    }
  }
  return escalar('se llegó al máximo de pasos', mensajes);       // pedir ayuda a una persona
}
```

**El mismo ciclo en Python** (es el lenguaje que más vas a ver en trabajos de IA):

```python
def correr_agente(tarea, herramientas, max_pasos=10):
    mensajes = [{"role": "user", "content": tarea}]

    for paso in range(max_pasos):
        respuesta = llm(mensajes, tools=esquemas(herramientas))
        mensajes.append(respuesta.mensaje)

        if not respuesta.llamadas:
            return respuesta.texto              # el modelo decidió que terminó

        for llamada in respuesta.llamadas:
            resultado = ejecutar(herramientas, llamada)   # validar, correr, atrapar errores
            mensajes.append(resultado_de_herramienta(llamada.id, resultado))

    return escalar("se llegó al máximo de pasos", mensajes)   # pedir ayuda a una persona
```

**Cómo se lee, comparado con JavaScript:**

| Python | JavaScript | Qué es |
|---|---|---|
| `def correr_agente(...):` | `async function correrAgente(...) {` | Crear una función. Python no usa llaves: usa **dos puntos** y la **sangría** (los espacios a la izquierda). |
| `max_pasos=10` | `maxPasos = 10` | Valor por defecto si no lo mandas. |
| `for paso in range(max_pasos):` | `for (let paso = 0; paso < maxPasos; paso++)` | Repetir: `range(10)` da 0, 1, 2… 9. |
| `if not respuesta.llamadas:` | `if (respuesta.llamadas.length === 0)` | "Si no hay llamadas". En Python, una lista vacía cuenta como "no". |
| `mensajes.append(x)` | `mensajes.push(x)` | Agregar al final de la lista. |
| `# comentario` | `// comentario` | Nota para personas. |
| `snake_case` | `camelCase` | Python escribe los nombres con guion bajo: `max_pasos`, no `maxPasos`. |

> 🌎 **En la vida real:** en Python la **sangría** es como los renglones de una lista de tareas con subtareas: lo que está corrido hacia adentro **pertenece** a lo de arriba. Si corres mal un renglón, cambias a qué tarea pertenece. Por eso en Python los espacios no son decoración: son parte de la orden.

**Esa es toda la idea.** El resto de la guía son variaciones de este ciclo: qué pones en los mensajes, cómo eliges y construyes las herramientas, cómo decides que terminó, y cómo lo mantienes seguro, barato y observable.

### 1.4 Cuándo construir un agente (y cuándo no)

> 🌎 **En la vida real:** no contratas a un arquitecto para colgar un cuadro. Cada nivel de ayuda cuesta más. Los agentes cambian **previsibilidad por capacidad**: cada paso agrega demora, costo y un lugar nuevo donde fallar.

Usa **el sistema más simple que resuelva el problema**. La escalera:

| Situación | Construye esto |
|---|---|
| La tarea tiene pasos fijos que puedes escribir | Un flujo de trabajo: una cadena de prompts o un *pipeline*. **No hace falta agente.** |
| Las entradas caen en pocas categorías conocidas que se tratan distinto | **Enrutamiento** a prompts o especialistas. |
| La tarea necesita una cantidad de pasos que no puedes predecir | **Un agente**: un ciclo ReAct con herramientas y un límite de pasos. |
| La tarea es grande y se divide en partes independientes | Un **supervisor** u orquestador con trabajadores en paralelo. |
| La calidad importa más que la velocidad y puedes definir qué es "bien hecho" | Agrega **reflexión** o un evaluador. |
| Los errores son caros o no se pueden deshacer | **Aprobación de una persona**, sea cual sea el patrón. |

**Tres preguntas antes de construir un agente:**
1. ¿Puedes definir **cómo se ve "terminado"**?
2. ¿El agente puede **verificar su propio avance** (con pruebas, resultados de herramientas o revisiones)?
3. ¿Puedes pagar **la peor ejecución posible**, en dinero y en daño?

Si alguna respuesta es "no", **construye primero un flujo de trabajo**.

> 📌 **Nota de producción:** los mejores equipos empiezan con **una sola llamada** al modelo, la miden, y solo agregan complejidad cuando la medición dice que lo simple falla. La complejidad es un costo que pagas para siempre. La capacidad que agregas porque una demo se veía impresionante es la más cara de todas.

### 1.5 El vocabulario que vas a ver siempre

> 🌎 **En la vida real:** en un taller se habla de "alineación", "balanceo", "escáner". Si no conoces las palabras, no entiendes al mecánico. Estas son las palabras del taller de agentes.

| Palabra | Qué quiere decir |
|---|---|
| **Llamada a herramienta** (*tool call*) | Un pedido ordenado del modelo para correr una función con ciertos datos. Tu código la ejecuta y devuelve el resultado. |
| **Ventana de contexto** (*context window*) | Todo lo que el modelo puede ver en una llamada: instrucciones, historial, resultados de herramientas, datos traídos. Es **limitada y cara**. |
| **Trayectoria** (*trajectory*) | La secuencia completa de decisiones, llamadas y observaciones de una ejecución. Las pruebas de agentes juzgan **trayectorias**, no solo respuestas. |
| **Punto de guardado** (*checkpoint*) | Una foto del estado del agente después de un paso. Permite retomar, repetir y pausar para que decida una persona. |
| **Control** (*guardrail*) | Una revisión sobre una entrada, una salida o una acción, que la bloquea o la marca si rompe una regla. |
| **Rastro** (*trace*) | El árbol registrado de llamadas al modelo y a herramientas de una ejecución, con tiempos, *tokens* y costo. **Tu principal herramienta para encontrar errores.** |
| **Evaluación** (*eval*) | Una prueba repetible que califica el comportamiento del agente sobre un conjunto de tareas. **La unidad de progreso** en ingeniería de agentes. |
| **Traspaso** (*handoff*) | Pasar el control y la conversación de un agente a otro. |
| **Orquestador** | La pieza (código o modelo) que decide qué paso, herramienta o agente corre después. |

> 📌 **Nota:** un *token* es un pedacito de texto (más o menos tres cuartos de una palabra). Los modelos cobran y se limitan por *tokens*.

## Parte 2. Los cinco patrones principales

Estos cinco patrones cubren **la mayoría** de los sistemas de agentes en producción. Apréndelos a fondo. Para cada uno: cómo funciona, un esqueleto de código, dónde se rompe, cómo hablar de él en una entrevista y un ejercicio.

### 2.1 Uso de herramientas / ReAct

> 🌎 **En la vida real:** un detective. Piensa ("el sospechoso dice que estaba en casa"), actúa ("reviso las cámaras"), observa ("a las 9 salió en el video"), y vuelve a pensar con esa prueba nueva. No inventa: cada conclusión se apoya en algo que vio.

**ReAct** viene de *Reasoning and Acting*: razonar y actuar. El modelo **alterna** entre pensar qué hacer y hacerlo con una herramienta; después mira el resultado y vuelve a pensar. Las APIs modernas lo traen de fábrica: el modelo emite una llamada ordenada, tu código la ejecuta y el resultado vuelve al contexto. **Es el ciclo base sobre el que se construyen todos los demás patrones.**

```text
Pedido ─► Razonar ─(1 llamada)─► Actuar ─► [Herramientas: buscar_web, consultar_bd, correr_codigo, leer_archivo]
             ▲                                         │ (2 resultado)
             │ (4 repetir)                              ▼
       Actualizar contexto ◄─(3 agregar)──────── Observar
             │
     no hace falta herramienta ─► Responder (fin)
```

**Cómo funciona:**
1. **Razonar.** El modelo lee la tarea y el contexto y decide: ¿respondo ya o llamo a una herramienta? Puede escribir una frase corta explicando por qué.
2. **Actuar.** Emite una llamada con datos ordenados. Tu código **valida** esos datos contra el esquema y ejecuta la función.
3. **Observar.** La herramienta devuelve algo: resultados de búsqueda, una fila de la base de datos, un error, un archivo. Se agrega a la conversación.
4. **Actualizar el contexto.** Ahora la conversación tiene la llamada y su resultado. El modelo ve su propio historial más la prueba nueva.
5. **Repetir o responder.** Vuelve a razonar. Cuando tiene suficiente, responde **sin** llamar herramientas y el ciclo termina.

**Esqueleto de código (JavaScript):**

```js
const HERRAMIENTAS = {
  buscar_docs: {
    descripcion: 'Busca en la documentación del producto. Úsala para preguntas sobre ' +
                 'cómo funciona el producto. Devuelve título, enlace y un fragmento.',
    esquema: { consulta: 'texto', maxResultados: 'número (por defecto 5)' },
    validar: (args) => typeof args.consulta === 'string' && args.consulta.length > 0,
    fn: buscarDocs,
  },
};

async function ejecutar(llamada) {
  const h = HERRAMIENTAS[llamada.nombre];
  if (!h) return { ok: false, error: `no existe la herramienta ${llamada.nombre}` };
  if (!h.validar(llamada.args)) return { ok: false, error: 'datos inválidos: falta "consulta"' };
  try {
    return { ok: true, datos: await h.fn(llamada.args) };      // primero validar, después correr
  } catch (e) {
    return { ok: false, error: `${e.name}: ${e.message}` };    // el error vuelve al modelo
  }
}
```

**El mismo esqueleto en Python.** En Python, para describir y validar los datos de una herramienta se usa casi siempre **Pydantic**, una librería muy popular en trabajos de IA:

```python
from pydantic import BaseModel

class EntradaBusqueda(BaseModel):
    consulta: str
    max_resultados: int = 5

HERRAMIENTAS = {
    "buscar_docs": {
        "descripcion": (
            "Busca en la documentación del producto. Úsala para preguntas sobre "
            "cómo funciona el producto. Devuelve título, enlace y un fragmento."
        ),
        "esquema": EntradaBusqueda,
        "fn": buscar_docs,
    },
}

def ejecutar(llamada):
    h = HERRAMIENTAS.get(llamada.nombre)
    if h is None:
        return {"ok": False, "error": f"no existe la herramienta {llamada.nombre}"}
    try:
        args = h["esquema"](**llamada.argumentos)       # primero validar
        return {"ok": True, "datos": h["fn"](**args.model_dump())}
    except Exception as e:
        return {"ok": False, "error": f"{type(e).__name__}: {e}"}   # el error vuelve al modelo
```

**Cómo se lee:**
- `class EntradaBusqueda(BaseModel):` crea un **molde** de datos. `consulta: str` dice "tiene que haber un texto llamado consulta"; `max_resultados: int = 5` dice "un número entero, y si no viene, vale 5". Si el modelo manda algo que no encaja, Pydantic **lanza un error** solo.
- `HERRAMIENTAS = { ... }` es un **diccionario**: lo mismo que un objeto de JavaScript, con las claves entre comillas.
- `.get(llamada.nombre)` busca en el diccionario y, si no existe, da `None` (el `null` de Python).
- `is None` se lee "es nada".
- `f"no existe {llamada.nombre}"` es una **f-string**: lo mismo que `` `no existe ${llamada.nombre}` `` en JavaScript.
- `**llamada.argumentos` "desarma" el diccionario y pasa cada clave como un dato con nombre: `{"consulta": "precios"}` se vuelve `consulta="precios"`.
- `try: … except Exception as e:` es el `try { … } catch (e) { … }` de JavaScript.
- `.model_dump()` convierte el molde ya validado de vuelta en un diccionario.

> 🌎 **En la vida real:** el molde de Pydantic es como el formulario de la aduana: si llenas "edad" con letras, el agente de aduana te lo devuelve **en la ventanilla**, antes de que entres al país. Así el error no llega adentro.

**Fíjate en el camino del error.** Una herramienta que **revienta** mata el ciclo. Una herramienta que **devuelve un error ordenado** le da al modelo la oportunidad de recuperarse: probar con otros datos, elegir otra herramienta o explicarle al usuario qué pasó.

**Cuándo usarlo:**
- La tarea necesita información o acciones que el modelo no tiene: datos en vivo, datos privados, cálculos, efectos en el mundo.
- Los pasos son pocos y no se saben de antemano, normalmente **menos de diez**.
- El resultado de cada paso cambia cuál debe ser el siguiente.

**Dónde se rompe:**

| Problema | Qué pasa | Arreglo |
|---|---|---|
| **Ciclos infinitos** | Llama una y otra vez a la misma herramienta con los mismos datos | Máximo de pasos, detectar llamadas repetidas y un mensaje que le pida cambiar de estrategia |
| **Herramientas inventadas** | Llama a una herramienta que no existe o inventa datos | Validación estricta del esquema, y devolverle el error de validación |
| **Contexto hinchado** | Resultados enormes (páginas web enteras, JSON gigante) llenan la ventana | Recortar y resumir antes de agregar. Devolver solo lo que necesita |
| **Herramienta equivocada** | Descripciones parecidas lo confunden | Menos herramientas, más claras, con descripciones distintas y ejemplos de cuándo usar cada una |

> 🎤 **Entrevista:** prepárate para explicar **por qué ReAct le gana a solo "pensar en voz alta"** (*chain-of-thought*): razonar sin observar acumula alucinaciones, porque el modelo nunca recibe un dato real de vuelta. ReAct **apoya cada paso de razonamiento en el resultado real** de una herramienta.

**Ejercicio para construir:** un agente ReAct con tres herramientas: búsqueda web, calculadora y "fecha de hoy". Pregúntale cuántos días faltan para el próximo feriado nacional y cuál es. Registra cada paso. Después **quita** la herramienta de la fecha y mira qué hace el modelo. **Esa falla es la lección.**

### 2.2 Planificación

> 🌎 **En la vida real:** un maestro de obras. Antes de poner un ladrillo, escribe el plan: 1) cimientos, 2) paredes, 3) techo, 4) instalaciones. Después cada cuadrilla hace su paso en orden. Si en el paso 2 descubre que el terreno está húmedo, **cambia el plan** antes de seguir.

Un agente que planifica **separa pensar el trabajo completo de hacer cada parte**. Un **planificador** divide un objetivo grande en una lista ordenada de pasos concretos. Un **ejecutor** cumple los pasos en orden y pasa los resultados hacia adelante. Si un paso falla o revela algo nuevo, **se rehace el plan**.

```text
Objetivo ─► Planificador ─(plan como datos)─► Plan: 1 fuentes · 2 números · 3 borrador · 4 verificar
                 ▲                                          │ ejecutar
                 └──── rehacer el plan si falla ──── Ejecutor (en orden, con estado)
                                                            │ todo listo
                                                         Resultado
Paso 1 ✓ hecho · Paso 2 ✓ hecho · Paso 3 … corriendo · Paso 4 ○ pendiente
```

**Cómo funciona:**
1. **Dividir.** El planificador produce una lista numerada de pasos, cada uno con una **condición clara de éxito** y, si se puede, la herramienta o el agente que lo hará.
2. **Ejecutar en orden.** El ejecutor corre el paso 1, guarda el resultado y pasa al 2. Cada paso puede leer los resultados de los pasos de los que depende.
3. **Llevar el estado.** Cada paso tiene un estado: pendiente, corriendo, hecho, fallado. **El plan es una estructura de datos, no un párrafo.**
4. **Replanificar.** Si un paso falla o su resultado contradice algo que se suponía, el planificador recibe los resultados parciales y hace un plan nuevo para lo que falta.
5. **Terminar.** Cuando todos están hechos, se arma el resultado final (o se le pasa todo a un paso de síntesis).

**Planificar y ejecutar contra ReAct:** ReAct decide **un paso a la vez**: es flexible, pero puede dar vueltas. Planificar **se compromete con una estructura** desde el principio: es eficiente y fácil de auditar, pero se puede comprometer con un plan malo. Lo que se usa en producción es **un híbrido**: planificar primero, ejecutar cada paso con un ciclo ReAct corto y replanificar en puntos de control.

**Esqueleto de código (JavaScript):**

```js
// El plan es un objeto, no un texto suelto.
// Paso: { id, descripcion, herramienta, dependeDe: [ids], estado: 'pendiente' }
let plan = await planificador(objetivo, { formato: 'Plan' });

for (const paso of plan.pasos) {
  const contexto = resultadosDe(paso.dependeDe);
  const resultado = await ejecutor(paso, contexto);        // un ciclo ReAct chico
  if (resultado.fallo) {
    plan = await replanificador(objetivo, plan, resultado); // rehace lo que falta
    continue;
  }
  paso.estado = 'hecho';
  guardar(paso.id, resultado.datos);
}
```

**El mismo esqueleto en Python:**

```python
from pydantic import BaseModel

class Paso(BaseModel):
    id: int
    descripcion: str
    herramienta: str | None = None
    depende_de: list[int] = []
    estado: str = "pendiente"

class Plan(BaseModel):
    objetivo: str
    pasos: list[Paso]

plan = planificador(objetivo, formato_salida=Plan)   # el modelo devuelve un Plan válido

for paso in plan.pasos:
    contexto = resultados_de(paso.depende_de)
    resultado = ejecutor(paso, contexto)             # un ciclo ReAct chico
    if resultado.fallo:
        plan = replanificador(objetivo, plan, resultado)   # rehace lo que falta
        continue
    paso.estado = "hecho"
    guardar(paso.id, resultado.datos)
```

**Cómo se lee:**
- `str | None = None` → "un texto **o** nada, y por defecto nada". Igual que `string | null` en TypeScript.
- `list[int]` → "una lista de números enteros".
- `list[Paso]` → "una lista de Pasos": un molde puede tener adentro otros moldes.
- `formato_salida=Plan` → le pides al modelo que su respuesta **encaje en el molde** `Plan`. Así el plan es **datos**, no un párrafo.
- `continue` → "salta al siguiente paso del `for`", igual que en JavaScript.

> 🌎 **En la vida real:** el molde `Plan` es como la planilla de obra con columnas fijas (número, tarea, herramienta, depende de, estado). Nadie la llena como una carta: se llena casilla por casilla, y así cualquiera la puede leer y controlar.

**Cuándo usarlo:**
- Tareas de varios pasos cuya **forma se conoce** de antemano: informes de investigación, migraciones de datos, cambios en varios archivos de código.
- Necesitas **mostrarle el plan al usuario** antes de ejecutar, para que lo apruebe o para generar confianza.
- Los pasos dependen unos de otros y algunos pueden ir en paralelo. El plan se vuelve un **DAG** (un grafo con flechas que nunca vuelven hacia atrás).

**Dónde se rompe:**

| Problema | Arreglo |
|---|---|
| **Planificar de más:** quince pasos para un trabajo de tres | Limitar el largo del plan y pedir **el plan mínimo** que logra el objetivo |
| **Planes viejos:** el mundo cambia mientras se ejecuta | Replanificar en puntos fijos, no solo cuando algo falla |
| **Pasos vagos:** "investigar el tema" no se puede ejecutar | Exigir que cada paso diga **qué herramienta** usa y **qué resultado verificable** entrega |
| **Contexto perdido entre pasos** | Pasar resultados ordenados (datos), no resúmenes |

**Ejercicio para construir:** un agente investigador que recibe una pregunta, arma un plan de 3 a 6 búsquedas, las ejecuta y escribe un resumen con fuentes. Guarda el plan como JSON e imprime el estado de cada paso mientras corre. Después **mete una búsqueda que falle a propósito** y confirma que el replanificador se recupera.

### 2.3 Reflexión / crítico

> 🌎 **En la vida real:** un escritor y su editor. El escritor entrega un borrador; el editor lo revisa con una lista ("¿tiene faltas? ¿responde lo que pidieron? ¿está en el formato?") y lo devuelve **con las correcciones marcadas**. Se repite hasta que el editor dice "se publica", o hasta que se acaba el tiempo.

La reflexión agrega **una revisión entre crear y entregar**. Un **generador** hace un borrador. Un **crítico** lo evalúa contra criterios explícitos. Si no pasa, la crítica vuelve al generador, que corrige. El ciclo sigue hasta que pasa o hasta un límite de intentos.

```text
Tarea (pedido + criterios) ─► Generador (borrador v1, v2…) ─► Crítico (criterios, pruebas, otro modelo)
                                   ▲                                 │ ¿pasa?
                                   └── no: problemas + borrador ─────┤
                                                                     └── sí ─► Resultado final

Registro: intento 1 ✗ falta revisar null, sin pruebas · intento 2 ✗ falla con entrada vacía · intento 3 ✓ todo verde
Tope de intentos: después se escala, o se devuelve el mejor borrador marcado.
```

**Cómo funciona:**
1. **Generar.** El generador hace el primer borrador: código, un documento, una consulta, una respuesta.
2. **Criticar.** El crítico lo evalúa contra una lista (correcto, completo, formato, reglas, pruebas) y devuelve un **veredicto ordenado**: pasa o no pasa, y los problemas concretos.
3. **Corregir.** Si no pasa, el generador recibe el borrador **y los problemas**. Ve **qué** estaba mal, no solo **que** algo estaba mal.
4. **Volver a evaluar.** La mayoría pasa al segundo o tercer intento.
5. **Terminar.** Si pasa, se entrega. Si se llega al límite, se escala a una persona o se devuelve el mejor intento con una marca.

**Haz que el crítico sea fuerte.** Un crítico que es el mismo modelo con el mismo prompt **casi siempre se da la razón a sí mismo**. Para fortalecerlo: un prompt aparte y "en contra", otro modelo, una lista numerada de revisiones o, mejor todavía, **una revisión determinística**: pruebas automáticas para el código, un validador para el JSON, un *linter*, un verificador de datos con búsqueda. **Los críticos determinísticos son los más confiables.**

> 💡 **Idea:** "determinístico" quiere decir que con lo mismo, da siempre lo mismo. Tus 400 pruebas de Copiloto (Tema 02) son un crítico determinístico: no opinan, verifican.

**Esqueleto de código (JavaScript):**

```js
let borrador = await generador(tarea);
let mejor = { puntaje: 0, borrador };

for (let intento = 0; intento < MAX_INTENTOS; intento++) {
  const veredicto = await critico(tarea, borrador, { criterios: CRITERIOS });   // { paso, problemas, puntaje }
  const pruebas = esCodigo(borrador) ? await correrPruebas(borrador) : null;
  if (veredicto.paso && (!pruebas || pruebas.ok)) return borrador;

  const correcciones = [...veredicto.problemas, ...(pruebas ? pruebas.fallas : [])];
  if (veredicto.puntaje > mejor.puntaje) mejor = { puntaje: veredicto.puntaje, borrador };
  borrador = await generador(tarea, { anterior: borrador, correcciones });
}
return marcarParaRevision(mejor.borrador);
```

**El mismo esqueleto en Python:**

```python
from pydantic import BaseModel

class Veredicto(BaseModel):
    paso: bool
    problemas: list[str]
    puntaje: int   # de 1 a 10

borrador = generador(tarea)
mejor = (0, borrador)

for intento in range(MAX_INTENTOS):
    veredicto = critico(tarea, borrador, criterios=CRITERIOS, formato_salida=Veredicto)
    pruebas = correr_pruebas(borrador) if es_codigo(borrador) else None
    if veredicto.paso and (pruebas is None or pruebas.ok):
        return borrador

    correcciones = veredicto.problemas + (pruebas.fallas if pruebas else [])
    mejor = max(mejor, (veredicto.puntaje, borrador))
    borrador = generador(tarea, anterior=borrador, correcciones=correcciones)

return marcar_para_revision(mejor[1], correcciones)
```

**Cómo se lee:**
- `bool` es el `boolean` de Python. Sus valores se escriben con mayúscula: `True` y `False`.
- `x if condición else y` es el "si no" en una línea: `correr_pruebas(borrador) if es_codigo(borrador) else None` = "si es código, corre las pruebas; si no, nada". En JavaScript sería `esCodigo(b) ? correrPruebas(b) : null`.
- `and` y `or` son el `&&` y el `||` de JavaScript. Python los escribe con palabras.
- `(0, borrador)` es una **tupla**: una pareja de valores que no cambia. `max(mejor, (puntaje, borrador))` se queda con la pareja de **puntaje más alto**, porque Python compara las tuplas por su primer valor.
- `mejor[1]` es el segundo valor de la pareja (las posiciones empiezan en 0, como en JavaScript).
- En Python, las pruebas automáticas se hacen normalmente con **pytest**, que cumple el mismo papel que Jest o `node:test`.

> 🌎 **En la vida real:** la tupla `(puntaje, borrador)` es como la nota pegada con un clip a cada examen. Al final, el profesor no relee todo: mira los clips y se queda con el examen de nota más alta.

**Cuándo usarlo:**
- La calidad importa más que la velocidad: código, documentos largos, contenido para clientes, cualquier cosa con criterios.
- Puedes expresar el éxito como **criterios que se pueden revisar**.
- Es más barato atrapar el error **antes** de entregar que después.

**Dónde se rompe:**

| Problema | Arreglo |
|---|---|
| **Crítico adulador:** aprueba todo | Prompt aparte, exigir al menos un problema por revisión, o usar revisiones determinísticas |
| **Corrección sin fin:** cada corrección mete un error nuevo | Tope de 2 o 3 intentos y devolver el de mejor puntaje |
| **Criterios que se desvían:** califica cosas que nadie pidió | Criterios escritos en el prompt del crítico, y nada más |
| **Costo:** cada vuelta son al menos dos llamadas más | Reflexionar solo en resultados valiosos; un modelo más barato como crítico si los criterios son simples |

> 🎤 **Entrevista:** la reflexión es un ciclo **evaluador-optimizador** (*evaluator-optimizer*). Conoce ese nombre. Y sabe que el evaluador puede ser un modelo, un conjunto de pruebas o una persona, y que los sistemas más fuertes **combinan los tres**.

**Ejercicio para construir:** envuelve una generación de código en un ciclo de reflexión donde el crítico son **las pruebas**: **pytest** en Python (lo que usa la guía), o Jest / `node:test` en JavaScript. Genera una función a partir de una descripción, corre las pruebas, devuelve las fallas, tope de tres intentos. Mide cuántas pasan con y sin el ciclo, en 20 descripciones.

### 2.4 Enrutamiento

> 🌎 **En la vida real:** la recepción de un hospital. La recepcionista no opera a nadie: escucha qué te pasa y te manda al especialista correcto (traumatología, cardiología, pediatría). Si no entiende bien qué tienes, **te hace una pregunta** en vez de mandarte a cualquier lado.

El enrutamiento **clasifica** cada pedido y lo manda al encargado hecho para ese tipo de pedido. El encargado puede ser un prompt especializado, un agente con sus propias herramientas, otro modelo o una función común. Así **cada especialista se mantiene simple** mientras el sistema atiende de todo.

```text
                         ┌─ "arregla este error" ─► Especialista en código (correr_codigo, leer_repo) ─┐
Pedido ─► Enrutador ─────┼─ "compara X e Y"     ─► Especialista en investigación (buscar_web)       ─┼─► Respuesta
  (clasifica +           ├─ "estado del reembolso" ─► Especialista en soporte (ver_cuenta, ticket)  ─┘
   confianza)            └─ poca confianza ─► Pedir aclaración (una pregunta)
Cada especialista tiene su prompt, sus herramientas y su modelo. El enrutador es barato y rápido.
```

**Cómo funciona:**
1. **Clasificar.** El enrutador lee el pedido y le pone una categoría. Puede ser una llamada al modelo con salida ordenada, un clasificador pequeño entrenado, una comparación por parecido (*embeddings*) o reglas simples.
2. **Despachar.** El pedido (y los datos que se sacaron de él) va al especialista que corresponde. Cada uno tiene su prompt, sus herramientas y su modelo.
3. **Atender.** El especialista hace el trabajo.
4. **Responder.** Su resultado vuelve al usuario, a veces pasando por un paso común de formato.
5. **Plan B.** Poca confianza o categoría desconocida → un encargado general o **una pregunta para aclarar**. **Nunca** a un especialista al azar.

**Esqueleto de código (JavaScript):**

```js
const ESPECIALISTAS = {
  codigo: agenteCodigo,             // herramientas: correr_codigo, leer_repo
  investigacion: agenteInvestigacion, // herramientas: buscar_web, traer_url
  soporte: agenteSoporte,           // herramientas: ver_cuenta, crear_ticket
};

// { categoria: 'codigo' | 'investigacion' | 'soporte' | 'no_claro', confianza: 0..1, datos: {} }
const ruta = await enrutador(pedido, { modelo: 'pequeño-y-rapido' });

if (ruta.categoria === 'no_claro' || ruta.confianza < 0.7) {
  return pedirAclaracion(pedido);
}
return ESPECIALISTAS[ruta.categoria](pedido, ruta.datos, estado);
```

**El mismo esqueleto en Python:**

```python
from typing import Literal
from pydantic import BaseModel

class Ruta(BaseModel):
    categoria: Literal["codigo", "investigacion", "soporte", "no_claro"]
    confianza: float
    datos: dict = {}

ESPECIALISTAS = {
    "codigo": agente_codigo,                 # herramientas: correr_codigo, leer_repo
    "investigacion": agente_investigacion,   # herramientas: buscar_web, traer_url
    "soporte": agente_soporte,               # herramientas: ver_cuenta, crear_ticket
}

ruta = enrutador(pedido, formato_salida=Ruta)   # un modelo chico y rápido

if ruta.categoria == "no_claro" or ruta.confianza < 0.7:
    return pedir_aclaracion(pedido)
return ESPECIALISTAS[ruta.categoria](pedido, ruta.datos, estado)
```

**Cómo se lee:**
- `Literal["codigo", "investigacion", ...]` → la categoría **solo** puede ser una de esas palabras. Es la "lista cerrada de opciones" de la parte 4.4: el modelo no puede inventar una categoría nueva.
- `float` → un número con decimales (la confianza va de 0 a 1).
- `==` → en Python se compara con **dos** iguales (no tres como en JavaScript).
- `ESPECIALISTAS[ruta.categoria](...)` → busca en el diccionario la función del especialista y **la llama** en el mismo momento.

> 🌎 **En la vida real:** el `Literal` es como el menú de la recepción del hospital con botones fijos: "traumatología", "cardiología", "pediatría", "no sé". La recepcionista no puede escribir a mano "la sala del fondo": solo puede apretar uno de esos botones.

**Cuándo usarlo:**
- Las entradas caen en categorías distintas que necesitan prompts, herramientas o modelos distintos.
- Quieres un **modelo barato para lo fácil** y uno caro para lo difícil. Eso es **enrutamiento por modelo**, y es una de las palancas de costo más grandes que tienes.
- Un solo prompt que intenta atender todo se está volviendo largo y su calidad está bajando.

**Dónde se rompe:**

| Problema | Arreglo |
|---|---|
| **Pedidos ambiguos:** uno que toca dos categorías va a una sola | Permitir varias etiquetas, o mandarlo a un coordinador que llama a varios especialistas |
| **El clasificador se queda viejo:** aparecen pedidos que nunca vio | Registrar cada ruta con su confianza, revisar los de poca confianza cada semana y agregar categorías |
| **Contexto perdido al pasar:** el especialista ve solo el último mensaje | Pasar el estado de la conversación, no solo el último mensaje |

> 📌 **Nota de producción:** el enrutamiento controla **el costo** tanto como la calidad. Es común que los equipos recorten una buena parte del gasto mandando lo simple a un modelo pequeño y dejando el modelo más potente solo para lo que lo necesita.

**Ejercicio para construir:** un enrutador de tres caminos (código, investigación, soporte) con salida ordenada y un umbral de confianza. Escribe 30 pedidos de prueba, incluyendo 5 ambiguos. Mide qué tan seguido acierta. Después reemplaza el enrutador con modelo por un clasificador por parecido (*embeddings*) y compara costo, demora y aciertos.

### 2.5 Multiagente / supervisor y trabajadores

> 🌎 **En la vida real:** un jefe de redacción de un periódico. Recibe "un informe sobre el precio de la gasolina". No escribe él: le pide a un **investigador** que busque datos, a un **analista** que haga las cuentas y a un **redactor** que escriba. Los tres trabajan **al mismo tiempo**, le entregan a él (no entre ellos), y él junta todo.

Un **supervisor** es dueño de la tarea completa. La divide, le da cada parte a un **trabajador especializado**, corre en paralelo lo que es independiente y combina los resultados. Los trabajadores son agentes completos, con sus herramientas y su propio ciclo. **El supervisor nunca hace el trabajo él mismo**: decide, delega y junta.

```text
                     ┌─► Investigador (buscar_web, traer) ─┐
Tarea ─► Supervisor ─┼─► Analista (correr_codigo, bd)      ─┼─► Síntesis (reconcilia y combina) ─► Resultado
   (divide, delega,  └─► Redactor (borrador, formato)      ─┘
    combina)          abanico hacia afuera, en paralelo       abanico hacia adentro
Los trabajadores le reportan al supervisor, nunca entre ellos. Cada uno devuelve PRUEBAS, no solo conclusiones.
```

**Cómo funciona:**
1. **Recibir y dividir.** El supervisor lee la tarea y decide qué trabajadores hacen falta y qué tiene que entregar cada uno.
2. **Delegar en paralelo.** Lo independiente se manda al mismo tiempo. Cada trabajador recibe un encargo enfocado: su parte, el contexto que necesita y el formato de lo que debe entregar.
3. **Trabajar.** Cada uno corre su propio ciclo (normalmente ReAct) con sus herramientas. **No hablan entre ellos.**
4. **Recoger.** El supervisor recibe resultados ordenados. Si alguno falló o vino incompleto, vuelve a delegar o pregunta.
5. **Sintetizar.** Combina todo en el resultado final. Muchas veces es una llamada aparte al modelo con todos los resultados en el contexto.

**Supervisor-trabajadores contra orquestador-trabajadores:** el primero tiene un **equipo fijo** de especialistas con nombre. El segundo **crea trabajadores en el momento**, y el orquestador decide cuántas partes hay. La mecánica es la misma; la diferencia es si el equipo se diseña antes (más predecible) o se arma para cada tarea (más flexible).

**Esqueleto de código (JavaScript):**

```js
// decision = { delegaciones: [{ trabajador: 'investigador'|'analista'|'redactor', encargo, entregar }] }
const decision = await supervisor(tarea, { formato: 'DecisionSupervisor' });

const resultados = await Promise.all(                      // todos al mismo tiempo
  decision.delegaciones.map((d) =>
    TRABAJADORES[d.trabajador].correr(d.encargo, { contexto: compartido, rastro: rastro.hijo(d.trabajador) })
  )
);

const final = await sintetizador(tarea, resultados);       // reconciliar los choques de forma explícita
```

**El mismo esqueleto en Python.** Para correr varios trabajadores **al mismo tiempo**, Python usa `asyncio`:

```python
import asyncio
from typing import Literal
from pydantic import BaseModel

class Delegacion(BaseModel):
    trabajador: Literal["investigador", "analista", "redactor"]
    encargo: str
    entregar: str

class DecisionSupervisor(BaseModel):
    delegaciones: list[Delegacion]

async def correr_supervisor(tarea):
    decision = await supervisor(tarea, formato_salida=DecisionSupervisor)

    resultados = await asyncio.gather(*[            # todos al mismo tiempo
        TRABAJADORES[d.trabajador].correr(d.encargo, contexto=compartido, rastro=rastro.hijo(d.trabajador))
        for d in decision.delegaciones
    ])

    return await sintetizador(tarea, resultados)   # reconciliar los choques de forma explícita
```

**Cómo se lee:**
- `async def` y `await` funcionan igual que `async function` y `await` en JavaScript (Tema 17, parte 7).
- `asyncio.gather(...)` es el `Promise.all(...)` de Python: espera a que terminen **todos**.
- `[ … for d in decision.delegaciones ]` es una **lista por comprensión**: arma una lista recorriendo otra, en una línea. Es el `.map(...)` de JavaScript.
- El `*` delante de la lista la "desarma" y le pasa cada elemento por separado a `gather`.

> 🌎 **En la vida real:** `asyncio.gather` es como poner tres ollas en tres hornallas al mismo tiempo, en vez de cocinar una, esperar, y recién poner la otra. La cena sale en el tiempo de la olla más lenta, no en la suma de las tres.

> 💡 **Idea:** `Promise.all` es el `await` del Tema 17, pero para **varias** promesas a la vez: espera a que lleguen todas.

**Cuándo usarlo:**
- La tarea es demasiado grande para una sola ventana de contexto, o tiene partes claramente separables.
- Las partes necesitan herramientas o modelos distintos.
- El paralelo importa: tres trabajadores a la vez le ganan a un agente que tarda el triple.

**Dónde se rompe:**

| Problema | Arreglo |
|---|---|
| **Costo de coordinar:** el supervisor gasta más *tokens* delegando que los trabajadores trabajando | Usar multiagente solo cuando las partes son lo bastante grandes para justificarlo |
| **Resultados que chocan:** dos trabajadores suponen cosas incompatibles | Contexto compartido al empezar, y una síntesis que reconcilia los choques explícitamente |
| **Errores que crecen:** la alucinación de un trabajador se vuelve un "hecho" para el supervisor | Los trabajadores devuelven **pruebas** (fuentes, resultados de herramientas), no solo conclusiones |
| **Difícil de depurar:** ¿qué agente causó la respuesta mala? | Rastrear cada trabajador como un tramo hijo del tramo del supervisor, con entradas y salidas |

> 📌 **Nota de producción:** los sistemas multiagente **queman *tokens***. Según el equipo de ingeniería de Anthropic, un agente usa más o menos **cuatro veces** los *tokens* de una conversación normal, y un sistema multiagente, unas **quince veces**. Asegúrate de que la tarea lo vale antes de usar este patrón.

**Ejercicio para construir:** un supervisor con tres trabajadores: investigador (búsqueda web), analista (corre código para los números) y redactor. Pide un informe de una página sobre un tema con tres conjuntos de números. Corre los trabajadores en paralelo (`Promise.all`). Rastrea toda la ejecución y encuentra **el tramo más caro**.

## Parte 3. Veinte patrones más

Los cinco principales son los ladrillos. Estos veinte son **con qué los combinas**. Están agrupados por el problema que resuelven, para que encuentres el correcto cuando te topes con el problema.

### 3.1 Patrones de flujo de trabajo

> 🌎 **En la vida real:** una línea de montaje de carros. Cada estación hace una sola cosa, y **el recorrido está fijo**: el carro no decide a qué estación ir. Los trabajadores (el modelo) hacen el trabajo dentro de cada estación, pero la cinta (tu código) decide qué sigue.

Estos patrones usan **caminos escritos de antemano**. Son los sistemas más predecibles que puedes construir, y **deberían ser tu opción por defecto** hasta que tengas pruebas de que necesitas más.

**1. Cadena de prompts (*prompt chaining*).** Se divide la tarea en una secuencia fija de llamadas, donde la salida de una es la entrada de la siguiente. Entre paso y paso va una **compuerta**: código que revisa el resultado intermedio antes de seguir. Ejemplo: hacer un índice → compuerta (¿cinco secciones, sin huecos?) → escribir cada sección → compuerta (¿largo correcto, con fuentes?) → pulir. **Cambia demora por precisión**, porque cada llamada tiene un solo trabajo fácil.

```text
Llamada 1 (índice) ─► compuerta ─✓─► Llamada 2 (borrador) ─► compuerta ─✓─► Llamada 3 (pulir) ─► compuerta ─✓─► Resultado validado
                         ✗ arreglar o parar         ✗ arreglar o parar          ✗ arreglar o parar
```

> 🌎 **En la vida real:** es la revisión técnica del carro por etapas: luces, frenos, emisiones. Si no pasa frenos, no sigue a emisiones.

**2. Paralelización: por secciones y por votación.** Se divide en partes independientes, se corren al mismo tiempo y se juntan.
- **Por secciones:** revisar un documento buscando cinco tipos de problema con cinco llamadas en paralelo, cada una enfocada en uno; o escribir todas las secciones de un informe a la vez, a partir de un índice común.
- **Por votación:** se corre **la misma tarea varias veces** y se combinan las respuestas: la mayoría gana (para clasificar), la mejor de varias con un juez (para generar), o "si alguno ve peligro, se marca" (para seguridad). La votación **compra confiabilidad con cómputo**: es la forma más barata de reducir la variación en una decisión importante.

> 🌎 **En la vida real:** por secciones es repartir la limpieza de la casa entre cuatro personas; por votación es pedir tres presupuestos y quedarte con lo que dicen la mayoría.

**3. Orquestador-trabajadores.** Un modelo central decide **en el momento** cómo dividir la tarea y crea tantos trabajadores como hagan falta. A diferencia del supervisor con equipo fijo, **las partes no se conocen de antemano**. El ejemplo clásico: un agente de código lee un problema, decide qué archivos hay que cambiar y manda un trabajador por archivo. Úsalo cuando la forma del trabajo depende de la entrada. Dale a cada trabajador **un encargo que se entienda solo**, porque no va a ver lo que pensó el orquestador.

> 🌎 **En la vida real:** el contratista que, después de ver tu casa, decide "aquí necesito dos plomeros y un electricista". En otra casa serían otros.

**4. Evaluador-optimizador.** Un modelo genera, otro evalúa con criterios, y se repite hasta que pasa. Es la reflexión (2.3) con un evaluador dedicado, y **es el nombre que vas a oír** en las discusiones de arquitectura. Funciona mejor cuando hay criterios claros y cada vuelta mejora de forma medible: traducciones, mejorar consultas de búsqueda, código que tiene que pasar pruebas, documentos con requisitos duros.

### 3.2 Patrones de razonamiento

> 🌎 **En la vida real:** no es lo mismo **qué** hace un ajedrecista que **cómo piensa** antes de mover. Estos patrones cambian cómo piensa el agente antes y entre acciones.

Vienen de la investigación académica, y los buenos sobrevivieron al contacto con producción.

**5. Planificar y ejecutar, y ReWOO.** **ReWOO** (*Reasoning WithOut Observation*, razonar sin observar) lleva la planificación al extremo: el planificador escribe **todo el plan, con cada llamada a herramienta**, y deja huecos para los resultados. Un trabajador ejecuta todas las llamadas **sin volver a preguntarle al modelo**. Al final, un "resolvedor" junta las pruebas. El uso de *tokens* baja mucho, porque el modelo no relee un contexto que crece en cada paso. El precio es la adaptación: si un resultado sorprende al plan, nada se ajusta. Úsalo para **secuencias de herramientas predecibles y a gran escala**.

> 🌎 **En la vida real:** la lista del supermercado escrita en casa. Vas, compras todo sin llamar a nadie, y vuelves. Rápido y barato… salvo que no haya tomate: la lista no sabe improvisar.

**6. Reflexion.** Le agrega **memoria de episodios** a la reflexión. Después de un intento fallido, el agente escribe **una reflexión corta** sobre qué salió mal y la guarda. En el intento siguiente, esas reflexiones están en el contexto. El agente **mejora entre intentos sin reentrenar el modelo**. Funciona muy bien en tareas con una señal clara de éxito (pasar pruebas, resolver un acertijo), y es **la forma más simple de auto-mejora** dentro de una sola sesión.

> 🌎 **En la vida real:** el estudiante que después de cada examen fallado anota en un cuaderno "me equivoqué por no leer bien la pregunta", y lo relee antes del siguiente examen.

**7. Árbol de pensamientos y búsqueda.** En vez de una sola cadena de razonamiento, se generan **varios posibles siguientes pasos**, se evalúa cada uno y se expande el más prometedor. Si una rama muere, se vuelve atrás. **Tree of Thoughts** aplica esto a pasos de razonamiento. **LATS** (*Language Agent Tree Search*) lo aplica a trayectorias completas con herramientas, usando búsqueda de árbol Monte Carlo sobre las acciones. Cuestan **muchas** llamadas: valen la pena solo cuando un paso equivocado es caro y las opciones son pocas como para enumerarlas.

> 🌎 **En la vida real:** el ajedrecista que piensa "si muevo el caballo, él hace esto, y yo esto otro…" en varias jugadas posibles, y descarta las que terminan mal.

**8. Auto-pregunta y descomposición (*self-ask*).** El modelo se hace a sí mismo preguntas de seguimiento antes de responder la principal: ¿qué necesito saber primero? Cada sub-pregunta puede disparar una herramienta. Es una planificación liviana que funciona **dentro de un solo prompt** y mejora las preguntas "de varios saltos", donde la respuesta depende de encadenar datos.

> 🌎 **En la vida real:** "¿Cuántos años tenía el presidente cuando se inauguró el estadio?" → primero: ¿quién era presidente? ¿cuándo se inauguró? ¿cuándo nació? Recién ahí se responde.

**9. Código como acción (*CodeAct*).** En vez de llamar herramientas de a una con JSON, el agente **escribe un programa** que llama muchas herramientas, repite, decide y calcula, y lo corre en una **caja aislada** (*sandbox*). El código es una forma de actuar más poderosa: un solo programa puede reemplazar diez vueltas del ciclo. **Es el patrón detrás de la mayoría de los agentes de código y de análisis de datos.** Necesita una caja aislada de verdad, límites de recursos, y devolverle los errores de ejecución al modelo para que los arregle.

```text
Tarea (analizar 40 mil filas) ─► Agente (escribe un programa que usa herramientas) ─► Caja aislada (código, salida;
                                     ▲                                                  aislada, con límites, sin secretos)
                                     └──────── errores y salida vuelven para arreglar ────────┘ ─► Respuesta con archivos
```

> 🌎 **En la vida real:** en vez de dictarle a tu asistente "suma la fila 1… ahora la 2… ahora la 3", le das una planilla con la fórmula ya escrita. Una orden reemplaza cien.

### 3.3 Patrones de coordinación

> 🌎 **En la vida real:** cómo se organiza un equipo de personas: con jefe, pasándose el trabajo de mano en mano, con una pizarra común o discutiendo. Cada agente que agregas es **otro lugar donde se puede perder el contexto**, así que elige lo más simple que sirva.

**10. Traspasos y enjambres (*handoffs* y *swarms*).** Sin supervisor: los agentes **se pasan la conversación entre ellos**. Un agente de recepción la pasa a uno de cobros, que la pasa a uno de reembolsos. Cada traspaso transfiere **todo** el estado de la conversación y deja al que recibe como el activo. El *OpenAI Agents SDK* lo formaliza: el traspaso es una herramienta que el modelo puede llamar. Son más simples de construir que un supervisor y van bien para conversaciones, pero **son más difíciles de observar**, porque el control se mueve de lado.

> 🌎 **En la vida real:** llamas al banco: "te paso con el área de tarjetas"… "te paso con fraudes". Cada uno recibe tu caso completo.

**11. Agentes jerárquicos.** Supervisores de supervisores: un gerente delega en jefes de equipo, que delegan en trabajadores. Úsalo **solo** cuando un único supervisor se ahogaría con la cantidad de trabajadores o el tamaño de sus resultados. Cada nivel agrega demora, costo y un lugar donde se pierde contexto. **Casi ningún sistema necesita más de dos niveles.**

> 🌎 **En la vida real:** el organigrama de una empresa grande. Funciona, pero cada nivel es un "teléfono descompuesto" posible.

**12. Pizarra y estado compartido (*blackboard*).** Los agentes **no se mandan mensajes**: leen y escriben en un objeto común (un documento, un tablero de tareas, un registro en una base de datos). Cada uno vigila las condiciones que le importan y actúa cuando aparecen. Así los agentes quedan totalmente **desacoplados** y el sistema es fácil de ampliar. Los *frameworks* basados en grafos usan esta idea: un objeto de estado con tipos pasa por los nodos, y cada nodo lee lo que necesita y escribe lo que produjo.

> 🌎 **En la vida real:** el tablero de pedidos de una cocina. Nadie le grita a nadie: el parrillero ve "2 bifes" y los hace; el que arma platos ve "bifes listos" y arma.

**13. Debate y consenso.** Dos o más agentes **defienden posiciones contrarias**, o resuelven el problema por separado y después concilian. Un juez elige al ganador o sintetiza. El debate mejora la exactitud en preguntas discutidas y atrapa errores que un solo agente no vería, **a dos a cuatro veces el costo**. Úsalo para análisis importantes, no para tareas de todos los días.

> 🌎 **En la vida real:** pedir una segunda opinión médica, o un juicio con fiscal y defensor frente a un juez.

### 3.4 Patrones de control

> 🌎 **En la vida real:** las barandas de un puente, el freno de mano, el límite de velocidad. No son opcionales. La guía es clara: **todo ciclo autónomo necesita al menos tres de estos.**

**14. Una persona en el ciclo (*human-in-the-loop*).** El agente **se pausa** en puntos definidos y espera a una persona: aprobar el plan, confirmar una acción, responder una pregunta, revisar un resultado. Se implementa como una **interrupción**: el estado se guarda en un punto de guardado, se manda un aviso, y la ejecución **se retoma cuando la persona responde, aunque sea días después**. Pon esta compuerta en **toda acción que no se puede deshacer** (pagos, borrados, envíos) hasta tener pruebas en producción de que el agente las hace bien. Después, afloja de a poco.

```text
Agente corriendo ─► Acción propuesta (reembolsar $480) ─► Punto de guardado (guarda estado, avisa) ─► Persona (aprobar / editar / rechazar) ─► Retomar desde el punto
                                                       pueden pasar horas o días: el estado vive en la base de datos, no en la memoria
```

> 🌎 **En la vida real:** el cajero automático que te pide confirmar "¿Transferir R$ 480 a Juan?" antes de hacerlo. Y yo, cuando trabajo contigo, te pido confirmar antes de subir algo o borrar algo.

**15. Controles (*guardrails*).** Capas de validación que corren **junto** al agente:
- **De entrada:** revisan el pedido antes de que lo vea el agente (intentos de inyección, temas fuera de lugar, datos personales).
- **De salida:** revisan la respuesta antes de que la vea el usuario (reglas, formato, que esté apoyada en datos).
- **De acción:** revisan cada llamada a herramienta antes de ejecutarla (permisos, presupuestos, límites, listas de permitidos).

Deben ser **baratos y rápidos**: reglas, expresiones regulares, clasificadores pequeños, validadores de esquema. Si se puede, córrelos **en paralelo** con el agente para que no agreguen demora.

```text
Entrada ─► Control de entrada (inyección, datos personales, fuera de tema) ─► Ciclo del agente ─► Control de salida (reglas, formato, apoyo en datos) ─► Salida
                                                         │
                                       Control de acción (permisos, presupuesto): revisa cada herramienta antes de correr
```

> 🌎 **En la vida real:** el aeropuerto: control de documentos al entrar, rayos X para lo que llevas, y control otra vez al embarcar.

**16. Máquinas de estado y grafos.** Se modela el agente como **un grafo explícito**: los nodos son pasos (una llamada al modelo, una herramienta, una revisión), las flechas son transiciones, y algunas flechas dependen del estado. Así el control se ve, se puede probar y se puede retomar. Los ciclos del grafo dan las repeticiones; las flechas condicionales dan enrutamiento y reflexión. La frase de la guía: **si puedes dibujar tu agente como un grafo, lo puedes depurar. Si no, él te va a depurar a ti.**

> 🌎 **En la vida real:** el diagrama del lavarropas: llenar → lavar → enjuagar → ¿hay agua sucia? sí: enjuagar otra vez / no: centrifugar. Si se corta la luz, sabe en qué paso estaba.

**17. Terminación y presupuestos.** **Todo ciclo necesita más de una forma de parar.** Pon: un máximo de pasos, un presupuesto de *tokens*, un tiempo máximo de reloj y un techo de costo por ejecución. Detecta llamadas repetidas con los mismos datos y córtalas. Define **qué devuelve** el agente cuando llega a un límite: un resultado parcial con una marca, **no un error que lo rompe todo**. Los presupuestos no son un detalle de seguridad: son lo que hace que el costo sea lo bastante predecible como para publicar.

> 🌎 **En la vida real:** el taxímetro con tope: "llévame, pero si pasa de R$ 50, avísame y paramos".

### 3.5 Patrones de conocimiento

> 🌎 **En la vida real:** la diferencia entre un empleado nuevo que cada día empieza de cero y uno que **se acuerda** de los clientes, de lo que pasó ayer y de cómo se hacen las cosas. Estos patrones deciden si tu agente sirve **una vez** o **todos los días**.

**18. Memoria.** Hay cuatro tipos que importan en la práctica:

| Tipo | Qué guarda | Ejemplo de la vida real |
|---|---|---|
| **De trabajo** | La ventana de contexto: todo lo que el modelo ve **ahora**. Limitada, cara, y siempre la estás administrando. | Lo que tienes sobre el escritorio en este momento |
| **De episodios** | Registros de ejecuciones y conversaciones pasadas ("la última vez que este usuario pidió X, hicimos Y"). Se guardan como registros o resúmenes y se buscan por parecido o por fecha. | Tu diario |
| **Semántica** | Hechos y conocimiento: preferencias del usuario, fichas, documentos del tema. Normalmente una base de vectores o una base de datos que el agente consulta. | Tu enciclopedia o tu agenda de contactos |
| **De procedimientos** | **Cómo** se hacen las cosas: instrucciones, uso aprendido de herramientas, ejemplos que mejoran con el tiempo. Muchas veces es el propio *system prompt*, con versiones. | Tus recetas |

Dos operaciones: **escribir** (decidir qué vale la pena guardar, sacarlo y guardarlo) y **leer** (decidir qué sirve ahora, traerlo y meterlo en el contexto). **La mayoría de los errores de memoria son errores al escribir**: guardar todo, o no guardar nada útil. Decide con cuidado qué se guarda, y **deja que el usuario lo vea y lo edite**.

```text
                       escribir
Memoria de trabajo ─────────────► Administrador de memoria ─► De episodios · Semántica · De procedimientos
(la ventana, limitada) ◄───────── (escribir: sacar, guardar;
                        leer       leer: buscar, meter)
```

> 💡 **Idea:** la carpeta `memory` que uso contigo, y tu `PROGRESO.md`, son memoria de episodios y de procedimientos: así la próxima IA sabe dónde quedaste.

**19. RAG agéntico.** **RAG** (*Retrieval-Augmented Generation*) es "buscar y después responder". El RAG clásico busca **una vez** y responde. El **RAG agéntico** convierte la búsqueda en una herramienta que el agente controla: **reescribe** la consulta, decide **si** buscar, busca en **varias fuentes**, **califica** si los resultados sirven, **busca otra vez** si son flojos, y recién ahí responde **con citas**. Al final agrega una **revisión de apoyo**: ¿cada afirmación viene de un pedazo que se encontró? Este patrón arregla la mayoría de las fallas tipo "el RAG me dio una respuesta segura y equivocada".

```text
Consulta ─► Reescribir (¿buscar? ¿dónde?) ─► Buscar (vectores, palabras, web, SQL) ─► Calificar (¿sirve? ¿alcanza?) ─fuerte─► Responder con citas
                  ▲                                                                      │                         (revisión de apoyo)
                  └──────────── flojo: reescribir y buscar otra vez, o cambiar de fuente ─┘
```

> 🌎 **En la vida real:** un buen estudiante en la biblioteca: si el primer libro no sirve, busca con otras palabras, prueba en otro estante, y en el trabajo final **pone la fuente de cada dato**. Tu página **¿Qué dice la Biblia?** hace algo parecido: cada afirmación va con su versículo.

**20. Compactar el contexto.** Los agentes que corren mucho tiempo llenan su ventana. **Compactar** es resumir las partes viejas de la conversación en un estado compacto y descartar el historial crudo, dejando intactos los mensajes recientes. Una buena compactación conserva: **el objetivo, las decisiones tomadas, las preguntas abiertas, los datos e identificadores clave, y la lista de archivos o recursos que se tocaron**. Una mala pierde justo el detalle que el agente necesita en el paso 40. Guarda el historial completo **afuera**, para poder traerlo si hace falta.

> 💡 **Idea:** esta misma conversación conmigo se compactó varias veces: arriba quedó un resumen con los archivos, las decisiones y lo pendiente. Es este patrón en acción.

### 3.6 Tabla para elegir un patrón

> 🌎 **En la vida real:** la tabla de "qué herramienta para qué tornillo" pegada en la pared del taller. Cuando estás frente al problema, la miras y eliges.

Los veinticinco patrones en una tabla:

| Patrón | Úsalo cuando… | Costo |
|---|---|---|
| Uso de herramientas / ReAct | No sabes cuántos pasos hay y cada uno depende del anterior | Bajo |
| Planificación | El trabajo se conoce de antemano, necesita aprobación o tiene dependencias | Medio |
| Reflexión / crítico | La calidad importa más que la velocidad y el éxito se puede revisar | Medio |
| Enrutamiento | Hay tipos de pedido distintos que necesitan trato o modelos distintos | Bajo |
| Supervisor-trabajadores | Partes separables, herramientas distintas, el paralelo conviene | Alto |
| Cadena de prompts | Secuencia fija con revisiones intermedias | Bajo |
| Paralelización | Partes independientes, o reducir variación votando | Medio |
| Orquestador-trabajadores | La cantidad de partes depende de la entrada | Alto |
| Evaluador-optimizador | Criterios claros, y cada vuelta mejora de forma medible | Medio |
| ReWOO | Secuencias de herramientas predecibles a escala, importa el presupuesto de *tokens* | Bajo |
| Reflexion | Señal clara de éxito, varios intentos en una sesión | Medio |
| Búsqueda en árbol / LATS | Un paso equivocado es caro y las opciones se pueden enumerar | Muy alto |
| Auto-pregunta | Preguntas de varios saltos dentro de un solo prompt | Bajo |
| Código como acción | Muchas llamadas, repeticiones o cálculos por tarea | Medio |
| Traspasos / enjambre | Conversaciones que pasan entre especialistas | Medio |
| Jerárquico | Demasiados trabajadores para un solo supervisor | Muy alto |
| Pizarra | Muchos agentes tienen que ampliar un estado común | Medio |
| Debate | Análisis importante y discutido | Alto |
| Persona en el ciclo | Acciones caras o que no se pueden deshacer | Demora |
| Controles | Siempre, en producción | Bajo |
| Máquina de estado / grafo | Necesitas un control visible y que se pueda retomar | Bajo |
| Terminación / presupuestos | Siempre, en producción | Ninguno |
| Memoria | El agente debe servir entre sesiones | Medio |
| RAG agéntico | Las respuestas deben apoyarse en tus datos | Medio |
| Compactar el contexto | Las ejecuciones son largas y la ventana se llena | Bajo |

## Parte 4. Diseñar agentes

Los patrones son **la forma**. Esta parte es **el contenido**: las decisiones que determinan si tu agente funciona con entradas reales, y no solo en la demo.

### 4.1 Ingeniería de contexto

> 🌎 **En la vida real:** antes de una reunión importante, a un gerente no le das 300 páginas: le das **una hoja** con lo esencial, los números clave y la decisión que tiene que tomar. Si le das todo, se pierde lo importante. Eso es curar el contexto.

**Ingeniería de prompts** es escribir buenas instrucciones. **Ingeniería de contexto** es decidir **todo** lo que entra en la ventana del modelo en cada paso: instrucciones, herramientas, documentos traídos, memoria, historial de la conversación, resultados de herramientas. Es **la habilidad de más impacto** en el diseño de agentes, porque el modelo solo puede razonar sobre lo que ve, y **su atención empeora a medida que la ventana se llena**.

- **Busca el conjunto más chico de *tokens* con más señal** que haga más probable la siguiente acción correcta. Más contexto **no** es mejor contexto.
- **Arma el *system prompt* por secciones:** rol, tarea, reglas, guía de herramientas, formato de salida, ejemplos. Con títulos claros. A la **altura justa**: lo bastante específico para guiar, lo bastante general para dejar razonar al modelo.
- **Carga herramientas y documentos justo a tiempo.** Dale al modelo **referencias** (rutas de archivos, herramientas de consulta) y deja que traiga lo que necesita, en vez de meterle todo al principio.
- **Resultados de herramientas flacos.** Recorta, resume u ordena lo grande antes de que entre al contexto.
- **Lo más importante, cerca del principio**, y **repite las reglas críticas cerca del final**. Los modelos prestan más atención **a los bordes** de la ventana.
- **Diseña para el caché de prompts.** Deja la parte fija (el *system prompt*, las definiciones de herramientas) **idéntica** en cada llamada para que se pueda guardar en caché, y pon lo que cambia **después**.

> 📌 **Nota de producción:** la guía de Anthropic sobre ingeniería de contexto vale la pena leerla entera. La idea central: **trata el contexto como un recurso limitado que rinde cada vez menos**, y cúralo como curarías el resumen para un ingeniero experto.

> 💡 **Idea:** tu `AGENTS.md` de este curso es exactamente un *system prompt* por secciones: quién es el alumno, el papel de la IA, el idioma, qué leer antes, cómo dar la clase, qué está prohibido.

### 4.2 Diseño de herramientas

> 🌎 **En la vida real:** un control remoto bien hecho tiene un botón para cada cosa, con un dibujo claro. Uno mal hecho tiene un botón que "según cuántas veces lo aprietes" hace cinco cosas distintas. Las herramientas de un agente son su control remoto.

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

### 4.3 Manejo del estado

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

> 💡 **Idea:** es TypeScript, como tu app (Tema 01). Los tipos aquí hacen el mismo trabajo: si alguien escribe mal un campo, se entera antes de correrlo.

### 4.4 Salidas ordenadas

> 🌎 **En la vida real:** un formulario del gobierno tiene casillas: "Nombre", "Fecha (DD/MM/AAAA)", "Sexo: M / F". No te dejan escribir una carta libre, porque **una máquina** lo va a procesar. Cuando la salida del modelo la va a leer **código**, necesita casillas.

**Los agentes son programas. Los programas necesitan datos, no prosa.** Siempre que la salida del modelo alimente código (una ruta, un plan, un veredicto, una llamada a herramienta), **fuerza un esquema**:
- Usa la salida estructurada nativa o las llamadas a herramientas para recibir JSON que cumpla el esquema.
- **Valídalo**, y si falla, **reintenta pasándole el error** de validación.
- Esquemas **planos y chicos**. Los esquemas muy anidados y con muchos campos opcionales producen más errores.
- Para las categorías usa **tipos literales** (una lista cerrada de opciones), no texto libre.
- Pon una descripción corta en **cada campo**: **la descripción es el prompt de ese campo**.

### 4.5 Elegir el modelo

> 🌎 **En la vida real:** para mover un sofá llamas a dos personas fuertes; para llevar una carta, a un mensajero en moto. No mandas al camión de mudanza a llevar una carta.

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

### 4.6 Protocolos: MCP y A2A

> 🌎 **En la vida real:** el enchufe USB-C. Antes, cada aparato tenía su cable. Ahora, un solo tipo de enchufe sirve para el celular, la compu y los auriculares. **MCP es el USB-C de las herramientas para agentes.**

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

### 4.7 El panorama de los frameworks

> 🌎 **En la vida real:** un carro automático te ahorra trabajo desde el primer día, pero si un día se traba la caja, no sabes qué pasa adentro. Un *framework* es eso: te ayuda la primera semana y te puede frenar todas las semanas siguientes.

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

## Parte 5. Evaluar agentes

No puedes mejorar lo que no puedes medir, y los agentes son más difíciles de medir que cualquier cosa que hayas publicado antes: **no son determinísticos**, tienen **muchos pasos**, y **el camino importa tanto como la respuesta**.

### 5.1 Por qué evaluar agentes es distinto

> 🌎 **En la vida real:** en un examen de matemáticas de opción múltiple solo importa la respuesta. En un examen de manejo, **importa cómo llegaste**: si llegaste al destino pero te pasaste dos semáforos en rojo, reprobaste.

- Una evaluación clásica de aprendizaje automático compara **una** salida con **una** etiqueta.
- La ejecución de un agente es una **trayectoria**: decisiones, llamadas y observaciones. **Dos ejecuciones con la misma entrada pueden tomar caminos distintos y las dos estar bien.**
- Tu evaluación tiene que juzgar **el resultado final**, **el camino** y **cuánto costó** llegar.
- Tiene que tolerar la **variación**: una sola ejecución no dice casi nada. **Corre cada caso varias veces** y mira la distribución.

### 5.2 Las capas de evaluación

> 🌎 **En la vida real:** en una fábrica de autos se revisa cada tornillo (unidad), cada paso de la línea de montaje (camino), el auto terminado en la pista (resultado), choques de prueba (seguridad) y después las quejas de los clientes (en línea).

| Nivel | Qué revisa | Cómo |
|---|---|---|
| **Unidad** (herramienta) | La herramienta correcta, con los datos correctos, para una entrada | Comprobaciones determinísticas. **Cientos** de casos. Corre en cada *commit*. |
| **Trayectoria** (camino) | Una secuencia aceptable: buscó antes de responder, confirmó antes de borrar, no hizo más de N búsquedas | Comparar con una trayectoria de referencia o con reglas sobre el rastro. |
| **Resultado** (tarea) | El resultado final cumple la tarea | Pruebas para el código, coincidencia exacta para extraer datos, un modelo-juez con criterios para respuestas abiertas, personas para el resto. |
| **Seguridad** | Entradas maliciosas, intentos de inyección, casos límite de las reglas | Aprueba si el agente **se negó o escaló** correctamente. Crece con cada hallazgo del equipo de ataque. |
| **En línea** | El comportamiento en producción a lo largo del tiempo | Ejecuciones de muestra calificadas todo el tiempo, más señales de usuarios: pulgares, ediciones, reintentos, escalamientos. |

> 💡 **Idea:** el nivel de unidad es lo que ya conoces del Tema 02 y 04: pruebas que corren en el CI en cada subida.

### 5.3 Un modelo como juez, bien hecho

> 🌎 **En la vida real:** un jurado de un concurso de cocina. Para que sea justo: tiene una **planilla con puntos** (sabor 1–5, presentación 1–5), tiene que **justificar** cada nota, no sabe de quién es cada plato, y antes del concurso se compara con jueces expertos para ver si califica parecido.

- Dale al juez **criterios numerados** y un **formato de salida obligatorio**: puntaje por criterio, **pruebas citadas** de la respuesta y un veredicto final.
- Usa un modelo **más fuerte** que el agente cuando puedas, y **siempre un prompt distinto**.
- **Calíbralo con personas.** Mide cuánto coincide con calificaciones humanas en **50 a 100 ejemplos** antes de confiar en él. Vuelve a medir cuando cambies el prompt o el modelo del juez.
- **Califica de a pares** cuando los puntajes absolutos son ruidosos: ¿cuál de estas dos respuestas es mejor, y por qué?
- Cuidado con los **sesgos**: de **posición** (preferir la primera), de **largo** (preferir la más larga) y de **auto-preferencia** (preferir lo que escribió él mismo). Mezcla el orden y compensa el largo.

```js
const CRITERIOS_JUEZ = `
Califica la respuesta en cada criterio de 1 a 5. Cita las pruebas.
1. Correcta: cada dato está apoyado por los resultados de las herramientas.
2. Completa: responde toda la pregunta del usuario.
3. Segura: no rompe reglas ni filtra datos internos.
4. Formato: cumple la estructura pedida.
Devuelve JSON: {"puntajes": {...}, "pruebas": {...}, "veredicto": "aprueba" | "reprueba"}
`;
```

**El mismo juez en Python:**

```python
CRITERIOS_JUEZ = """
Califica la respuesta en cada criterio de 1 a 5. Cita las pruebas.
1. Correcta: cada dato está apoyado por los resultados de las herramientas.
2. Completa: responde toda la pregunta del usuario.
3. Segura: no rompe reglas ni filtra datos internos.
4. Formato: cumple la estructura pedida.
Devuelve JSON: {"puntajes": {...}, "pruebas": {...}, "veredicto": "aprueba" | "reprueba"}
"""
```

- Las **tres comillas** `"""…"""` crean un texto de varias líneas, como las comillas invertidas de JavaScript.

### 5.4 Las métricas que importan

> 🌎 **En la vida real:** en tu app de conductor no basta con "cuánto gané". Importa cuánto gané **por hora**, cuánto gasté en combustible **por viaje**, cuántos viajes cancelé. Con agentes es igual: un solo número engaña.

| Métrica | Qué te dice |
|---|---|
| **Tasa de éxito** | Qué parte de las ejecuciones logra el objetivo. El número principal. Infórmalo **con el tamaño de la muestra**. |
| **pass@k y pass^k** | pass@k: **al menos uno** de k intentos sale bien. pass^k: **todos** los k intentos salen bien. **La confiabilidad en producción es pass^k**, y baja rápido cuando k crece. |
| **Precisión al llamar herramientas** | Herramienta correcta, datos correctos, momento correcto. **La primera señal** de que un cambio de prompt o de herramienta rompió algo. |
| **Pasos hasta terminar** | Eficiencia. Si sube la cantidad de pasos, hay confusión, herramientas flojas o falta contexto. |
| **Costo por tarea exitosa** | *Tokens* y dinero divididos por **éxitos**, no por ejecuciones. Un modelo más barato que falla más **puede salir más caro**. |
| **Demora p50 y p95** | Los agentes tienen "colas largas". p50 es la demora típica; p95, la del 5% más lento. **Los usuarios sienten el p95.** |
| **Tasa de escalamiento** | Qué tan seguido le pasa el caso a una persona, y por qué. Registra los motivos por categoría. |
| **Tasa de violaciones de seguridad** | Cualquier acción o salida que rompió una regla. **La meta es cero. Mídela igual.** |

> 💡 **Idea:** ¿por qué pass^k baja tan rápido? Si un agente acierta el 90% de las veces, que acierte **3 veces seguidas** es 0,9 × 0,9 × 0,9 = 73%. Y **10 veces seguidas**, apenas 35%.

### 5.5 Armar el set de evaluación

> 🌎 **En la vida real:** un profesor arma su banco de preguntas de examen con los errores que más vio en sus alumnos. Cada año agrega las nuevas trampas en las que cayeron.

- Empieza con **20 a 50 tareas reales o realistas** que cubran las categorías principales y **los casos límite que más miedo te dan**.
- Incluye los resultados esperados y, si se puede, trayectorias de referencia.
- **Hazlo crecer desde producción: cada falla que llega a un usuario se convierte en un caso de evaluación.**
- Guarda un **set aparte que quien escribe el prompt nunca ve** (para no "estudiar para el examen").
- **Córrelo en el CI y bloquea la publicación** si bajan la tasa de éxito o sube la de violaciones de seguridad.
- **Ponle versión al set junto con el código.**

### 5.6 Rastreo y observabilidad

> 🌎 **En la vida real:** la caja negra de un avión. Si algo sale mal, se puede ver segundo a segundo qué pasó, qué dijo cada piloto y qué marcaba cada instrumento. Sin la caja negra, solo puedes adivinar.

Un **rastro** (*trace*) es el registro completo de una ejecución: cada llamada al modelo con lo que entró y salió, cada llamada a herramienta con sus datos y resultados, tiempos, *tokens*, costo y errores, organizado como **tramos anidados** (*spans*). **Sin rastros estás depurando una caja negra con `console.log`.** Instrumenta desde el primer día, antes de elegir *framework*.

```text
ejecución 8f3a: "informe sobre el mercado X"   41,2 s   184 mil tokens   US$ 0,93
├── supervisor.planificar      llm   2,1 s    6 mil tok
├── trabajador.investigador          14,8 s  71 mil tok
│   ├── llm 1,9 s
│   ├── herramienta buscar_web 0,8 s
│   └── llm 2,4 s
├── trabajador.analista              12,3 s  52 mil tok
│   ├── herramienta correr_codigo  ✗ error
│   └── herramienta correr_codigo  reintento ✓
├── supervisor.sintetizar      llm   6,7 s   55 mil tok
└── control.salida   clasificador 0,2 s   ✓ aprueba
Cada tramo lleva entradas, salidas, tokens, costo, demora y la versión del prompt.
```

En ese rastro se ve de un vistazo **el tramo más caro** (el investigador) y **la herramienta que falló y se reintentó**.

- **Qué capturar:** el prompt exacto y las definiciones de herramientas enviadas (con versión), el modelo y sus parámetros, *tokens* y costo, entradas y salidas de herramientas, demora por tramo, la salida final, los puntajes del evaluador y cualquier opinión del usuario ligada al rastro.
- **Con qué:** **OpenTelemetry** con sus convenciones para IA generativa como base neutral, más una capa especializada como **Langfuse**, **LangSmith**, **Arize Phoenix**, **Braintrust** o **Weights and Biases Weave** para ver rastros, correr evaluaciones y administrar prompts.
- **El hábito:** revisa rastros **cada semana**. Toma cinco éxitos y cinco fallas. **Cada revisión debe producir al menos un caso de evaluación nuevo o una mejora de herramienta.**

## Parte 6. Publicar agentes

Un cuaderno que funciona no es un producto. Esta parte es el trabajo de entorno, confiabilidad, seguridad y costo que convierte un agente en un sistema que puedes poner frente a usuarios **y aun así dormir tranquilo**.

### 6.1 La arquitectura de referencia

> 🌎 **En la vida real:** un restaurante grande. El **mozo** toma el pedido y te da un número (la API). Los pedidos van a una **fila de comandas** (la cola). Varios **cocineros** toman comandas de la fila (los trabajadores). La **despensa** tiene llave y control (los servicios de herramientas). Hay un **cuarto aparte** para lo peligroso, como freír con mucho aceite (la caja aislada). El **cuaderno de pedidos** guarda todo (el almacén de estado). Y el **dueño** mira las cámaras (la observabilidad).

```text
Cliente (web, app, Slack, API) ─► Capa de API (autentica, valida, encola, transmite) ─► Cola (ejecuciones como trabajos) ─► Trabajadores del agente (el ciclo, escalan a lo ancho)
      ▲ id de ejecución + eventos que vuelven                                                                                    │
      └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
                       Pasarela de modelos (llaves, reintentos, plan B, caché, costos) · Servicios de herramientas (MCP, con su propia autenticación)
                       Caja aislada (código sin secretos, red limitada) · Almacén de estado (puntos de guardado, memoria, archivos)
                       Observabilidad: rastros, métricas, registros y evaluaciones en cada ejecución
```

**Las ejecuciones son trabajos. Los trabajadores son dueños del ciclo. Todo lo que el ciclo toca es un servicio aparte y observable.**

- **Capa de API.** Autentica, valida el pedido, encola una ejecución, **devuelve un id de ejecución al instante** y le va transmitiendo eventos al cliente.
- **Cola y trabajadores.** Las ejecuciones son trabajos largos que llegan de a ráfagas. Córrelos como trabajadores que toman de una cola, **no dentro de un pedido web**. Escala sumando trabajadores.
- **Pasarela de modelos.** **Un solo lugar** para las llaves de los proveedores, reintentos, límites de uso, planes B, caché y la cuenta de costos de **todos** tus agentes.
- **Servicios de herramientas.** Las herramientas corren como servicios propios o servidores MCP, con su propia autenticación y límites. Las destructivas tienen revisiones extra.
- **Caja aislada.** El código corre en un contenedor aislado, **sin secretos**, con salida a internet restringida, límites de CPU y memoria, y un tiempo máximo.
- **Almacén de estado.** Puntos de guardado en una base de datos, archivos en almacenamiento de objetos, y una base de vectores para la memoria semántica.
- **Observabilidad.** Cada ejecución emite rastros, métricas y registros **a un solo sistema**.

### 6.2 Ejecuciones largas y asíncronas

> 🌎 **En la vida real:** dejas el carro en el taller. Te dan un **número de orden**, te mandan mensajes ("ya revisamos los frenos", "falta la pieza") y si el mecánico de la mañana se va, **el de la tarde sigue desde donde quedó**, porque está todo anotado en la orden.

Las ejecuciones duran de **segundos a horas**. Diseña para eso:
- **Devuelve un id de ejecución al instante.**
- **Transmite eventos de avance** (paso empezado, herramienta llamada, resultado parcial) para que el usuario vea movimiento.
- **Guarda un punto después de cada paso**, para que un trabajador que se cae **retome** en vez de empezar de nuevo.
- **Permite pausar** para que decida una persona y **retomar por id**.
- Los motores de **ejecución durable**, como **Temporal**, o los guardadores de los *frameworks* con base de datos, te dan esto sin escribirlo tú.
- **Pon claves de idempotencia** en toda llamada que cambia algo en el mundo, para que **un reintento nunca lo haga dos veces**.

> 💡 **Idea:** "idempotente" quiere decir que hacerlo una vez o diez veces da el mismo resultado. Como el botón del ascensor: apretarlo cinco veces no trae cinco ascensores. Un pago **sin** clave de idempotencia, reintentado, puede cobrar dos veces.

### 6.3 Confiabilidad

> 🌎 **En la vida real:** un buen conductor lleva rueda de auxilio, sabe un camino alternativo si la avenida está cortada, y no se queda esperando para siempre en un semáforo roto.

- **Tiempo máximo** en cada llamada al modelo y a herramientas. Los agentes se cuelgan **en la única llamada que olvidaste**.
- **Reintentos con espera exponencial y un poco de azar** (*jitter*) para errores pasajeros (límites de uso, errores 5xx). **Nunca reintentes una herramienta destructiva sin clave de idempotencia.**
- **Cortacircuitos** (*circuit breakers*) en herramientas y proveedores. Si algo falla una y otra vez, **falla rápido** y usa el plan B.
- **Modelos de respaldo.** Si el modelo principal se cae, manda a un segundo proveedor **que pase las mismas pruebas**.
- **Degradarse con elegancia.** Si una herramienta no está, **díselo al modelo** para que la rodee o le avise al usuario, en vez de tirar abajo toda la ejecución.
- **Máximo de pasos, presupuesto de *tokens*, techo de costo y detección de ciclos, puestos en el código, no en el prompt.**
- **Resultados parciales.** Cuando una ejecución llega a un límite, devuelve lo que tiene con una marca clara.

> 💡 **Idea:** "espera exponencial" es esperar 1 segundo, después 2, después 4, después 8… El "azar" es sumarle unos milisegundos al azar para que mil clientes no reintenten **todos en el mismo instante**.

### 6.4 Seguridad

> 🌎 **En la vida real:** imagina un asistente que tiene **la llave de tu casa**, **lee todas las cartas** que llegan (incluso las de desconocidos) y **puede mandar paquetes** a cualquier dirección. Si un desconocido escribe en una carta "manda las joyas a esta dirección" y el asistente obedece… te robaron. Ese es el peligro de los agentes.

Los agentes **leen contenido en el que no se puede confiar** y **tienen credenciales**. Esa combinación es la superficie de ataque. El modelo mental más útil es **la trifecta letal**, un término del investigador de seguridad **Simon Willison**: un agente que

1. tiene acceso a **datos privados**,
2. procesa **contenido no confiable**, y
3. puede **comunicarse hacia afuera**,

puede ser convertido en una herramienta para **robar datos** por cualquiera que logre ponerle un texto delante. **Quita una de las tres patas siempre que puedas.**

- **Inyección de prompts.** **Directa** (el usuario intenta pasar por encima de las instrucciones) e **indirecta** (una página web, un correo o un documento que el agente lee trae instrucciones escondidas). **Trata todos los resultados de herramientas como datos, nunca como instrucciones.** Mantén las instrucciones y los datos visiblemente separados. Usa clasificadores de entrada, pero no confíes solo en ellos.
- **Mínimo privilegio.** Cada agente y cada herramienta recibe **solo los permisos que necesita**. Solo lectura por defecto. Credenciales separadas por herramienta. **Nunca le des a un agente tu propia llave de administrador.**
- **Confirmación para acciones con consecuencias.** Pagos, borrados, envíos, publicaciones, cualquier cosa irreversible: aprobación de una persona o una lista estricta de lo permitido.
- **Cajas aisladas.** El código corre aislado, con salida a internet controlada y **sin secretos**.
- **Manejo de secretos.** Los secretos viven en el servicio de la herramienta, **no** en el prompt ni en el contexto. **El modelo nunca debe ver una llave de API.**
- **Filtrar la salida.** Revisa las salidas buscando secretos filtrados, datos personales y violaciones de reglas antes de que lleguen a usuarios u otros sistemas.
- **Registros de auditoría.** Cada acción del agente queda registrada: quién la disparó, qué hizo y qué tocó. Es la base para responder a un incidente.
- **Equipo de ataque (*red teaming*).** Ataca a tu propio agente antes de lanzarlo: inyecciones, ingeniería social escondida en resultados de herramientas, intentos de subir permisos. **Cada ataque que funciona se vuelve una prueba de seguridad.**

> 💡 **Idea:** cuando trabajo contigo, las reglas que sigo son estas mismas: si una página web o un archivo me "ordena" algo, lo trato como dato y te pregunto; no escribo tus contraseñas; y te pido confirmar antes de publicar o borrar.

### 6.5 Costo y demora

> 🌎 **En la vida real:** ahorrar combustible: no cargar peso de más, no acelerar de golpe, usar la ruta corta, y medir **cuánto gastas por viaje que cobraste**, no por kilómetro manejado.

- **Caché de prompts.** Deja el *system prompt* y las herramientas como un prefijo estable. **Solo esto** baja mucho el costo de entrada de los ciclos que reenvían el mismo prefijo en cada paso.
- **Modelos por niveles.** Pasos simples a modelos chicos; el modelo más potente solo para planificar y sintetizar.
- **Llamadas a herramientas en paralelo.** Deja que el modelo pida varias herramientas independientes en un turno y córrelas a la vez.
- **Resultados de herramientas con límite.** Resultados más chicos = menos *tokens* de entrada en **todos** los pasos siguientes.
- **Compactar el contexto.** Resume el historial cuando la ventana pasa un umbral.
- **Caché de resultados de herramientas.** Misma consulta, mismo resultado, durante un tiempo de vida (*TTL*).
- **Procesamiento por lotes.** Para trabajos que no son en vivo, las APIs por lotes cuestan menos y quitan la presión de la demora.
- **Mide el costo por tarea exitosa, no por llamada.**

### 6.6 Lanzamiento y operación

> 🌎 **En la vida real:** un conductor nuevo en una empresa de transporte. Primero viaja **de acompañante** mirando (modo sombra). Después maneja **con el instructor al lado** que puede frenar (modo asistido). Después maneja solo, **pero en rutas cortas y con rastreador** (autónomo con límites). Recién con buenos resultados le dan rutas largas.

**Lanza por etapas:**
1. **Modo sombra.** El agente corre con tráfico real, pero sus salidas van a registros, no a usuarios. Comparas contra el sistema actual.
2. **Modo asistido.** El agente hace el borrador; una persona aprueba.
3. **Autónomo con límites.** El agente actúa dentro de presupuestos y alcances estrictos, con un **interruptor para apagarlo**.

**Amplía el alcance a medida que las evaluaciones y el registro de incidentes lo justifican.**

- **Versiona juntos los prompts, las herramientas y los modelos.** Una publicación es **un paquete**.
- **Canario:** prueba versiones nuevas en una porción del tráfico, con las evaluaciones corriendo sobre rastros en vivo.
- **Ten un interruptor que detenga todas las ejecuciones en segundos.**
- **Revisa rastros cada semana:** muestras de éxitos y fallas, actualiza evaluaciones, mejora herramientas y prompts.
- **Vigila la deriva** (*drift*). Las actualizaciones del modelo, los cambios de datos y los pedidos nuevos **cambian el comportamiento en silencio**.

> 💡 **Idea:** "canario" viene de los mineros, que bajaban un canario a la mina: si el pájaro se desmayaba, había gas, y salían antes de que les pasara a ellos.

## Parte 7. Todo junto

Cómo se combinan las piezas en un sistema real, qué revisar antes de publicar, y cómo convertir lo que aprendiste en respuestas de entrevista y en pruebas para tu portafolio.

### 7.1 Arquitectura de referencia: un agente de soporte

> 🌎 **En la vida real:** imagina el soporte de **Copiloto Driver** atendido por un agente: responde dudas de cómo usar la app leyendo la documentación, mira la cuenta de un conductor y puede devolver dinero de una suscripción hasta cierto monto. Así se armaría con todo lo de esta clase.

El ejemplo de la guía es un agente de soporte para un producto de software. **Cada patrón principal aparece al menos una vez.**

```text
Mensaje ─► Control de entrada ─► Enrutador ─┬─► General / aclarar (sin herramientas) ─────────────┐
           (inyección,           (intención ├─► Especialista técnico: buscar_docs (RAG agéntico) ──┼─► Control de salida ─► Respuesta
            datos personales)    + confianza)└─► Especialista de cobros: ver_cuenta, reembolsar ───┘   (reglas, apoyo)     (transmitida)
                                                       │  interrumpe y retoma                ▲
                                              Aprobación de persona: reembolso > US$ 200     │
                                                                              Paso de reflexión: un crítico revisa tono y reglas
Memoria: perfil del usuario y tickets pasados · Rastros + evaluaciones: 10% calificado por un juez, las fallas van al set de evaluación
```

1. El **control de entrada** quita intentos de inyección y oculta datos personales **antes** de que el enrutador vea el mensaje.
2. Un **modelo chico enruta** con un puntaje de confianza. **Debajo de 0,7**, el encargado general hace una pregunta para aclarar.
3. El **especialista técnico** usa **RAG agéntico** sobre la documentación con revisión de apoyo. El **especialista de cobros** corre un **ciclo ReAct** sobre las herramientas de cuentas.
4. Un **reembolso de más de US$ 200** dispara una **interrupción para una persona**. Se guarda el estado y la ejecución se retoma cuando un líder de soporte aprueba.
5. Un **crítico** revisa el tono y las reglas antes de responder. El **control de salida** bloquea todo lo que no esté apoyado en datos o no cumpla las reglas.
6. **Cada ejecución se rastrea.** Un 10% lo califica un modelo-juez. **Cada falla se vuelve un caso de evaluación.** El set de evaluación decide si se publica.

### 7.2 La lista de control para producción

> 🌎 **En la vida real:** la lista que repasa un piloto antes de despegar, punto por punto, aunque haya volado mil veces.

| Área | Antes de publicar |
|---|---|
| **Diseño** | El patrón más simple que resuelve el problema, escrito y con un diagrama. "Terminado" está definido. Cada herramienta tiene un trabajo, un esquema validado y errores que enseñan. El estado tiene tipos y puntos de guardado. |
| **Control** | Máximo de pasos, presupuesto de *tokens*, techo de costo y tiempo máximo por ejecución. Detección de ciclos. Aprobación de una persona en lo irreversible. Controles de entrada, salida y acción. |
| **Evaluación** | Un set de al menos 20 casos con resultados esperados. Evaluaciones de unidad, trayectoria y resultado. Un juez calibrado. Casos de seguridad salidos del equipo de ataque. El CI bloquea si algo empeora. |
| **Observabilidad** | Cada ejecución rastreada con tramos anidados, *tokens*, costo y versión del prompt. Paneles de tasa de éxito, demora p95, costo por éxito y tasa de escalamiento. |
| **Entorno** | Las ejecuciones son trabajos en cola con id. Avance transmitido. Retomar desde punto de guardado. Efectos idempotentes. Código en caja aislada. |
| **Seguridad** | Mínimo privilegio por herramienta. Secretos fuera del contexto. Resultados de herramientas tratados como datos. Filtro de salida. Registro de auditoría. **Una pata de la trifecta quitada.** |
| **Operación** | Resultados del modo sombra revisados. Interruptor de apagado probado. Prompts, herramientas y modelos versionados como paquete. Revisión semanal de rastros en el calendario. |

### 7.3 Fallas comunes y cómo se arreglan

> 🌎 **En la vida real:** la tabla del manual del carro: "si la luz X se prende → causa probable → qué hacer".

| Síntoma | Causa probable | Arreglo |
|---|---|---|
| El agente repite la misma llamada a herramienta | No hay detección de ciclos; el error de la herramienta no ayuda | Detectar repeticiones, devolver errores que enseñan, tope de pasos |
| Respuestas seguras pero equivocadas | No busca datos o no revisa el apoyo | RAG agéntico con citas, evaluación de apoyo |
| Funciona en la demo, falla con entradas reales | Set de evaluación muy chico o muy "limpio" | Armar evaluaciones con fallas reales, guardar un set aparte |
| Los costos se dispararon después del lanzamiento | Sin presupuestos, el contexto crece, sin caché | Presupuesto de *tokens*, compactar, caché de prompts, modelos por niveles |
| No se sabe qué agente causó el error | No hay rastreo anidado | Rastrear cada agente y herramienta como tramos dentro de la ejecución |
| El agente hizo una acción destructiva | Sin controles de acción ni compuerta de aprobación | Listas de permitidos, confirmación, mínimo privilegio |
| Demora demasiado | Herramientas en fila, demasiadas vueltas de reflexión | Llamadas en paralelo, tope de vueltas, modelos chicos para lo simple |
| Ignora instrucciones al final de ejecuciones largas | Contexto hinchado, instrucciones enterradas | Compactar, repetir las reglas clave, resultados flacos |
| Lo "inyectó" una página web que leyó | Trató los resultados de herramientas como instrucciones | Separar datos de instrucciones, filtrar la salida, quitar una pata de la trifecta |

### 7.4 Las 12 preguntas de entrevista que tienes que poder responder

> 🌎 **En la vida real:** las preguntas del examen teórico de manejo se repiten. Si las practicas en voz alta, el día del examen no te tiemblan las piernas.

Cada pregunta con **lo que debe tener una respuesta fuerte**:

1. **¿Cuál es la diferencia entre un flujo de trabajo y un agente?** Caminos escritos de antemano contra un modelo que dirige su propio proceso. La mayoría de los sistemas reales son flujos de trabajo con partes de agente.
2. **Explícame el ciclo ReAct y dónde falla.** Razonar, actuar, observar, repetir. Ciclos infinitos, herramientas inventadas, contexto hinchado, y el arreglo de cada uno.
3. **¿Cuándo elegirías planificar en vez de ReAct?** Estructura conocida, necesidad de aprobación, dependencias. El híbrido: planificar, ejecutar con ciclos cortos, replanificar en puntos de control.
4. **¿Cómo haces que un ciclo de reflexión mejore de verdad la salida?** Un crítico fuerte, separado y, si se puede, determinístico. Criterios escritos. Tope de intentos. Devolver el mejor intento.
5. **¿Cómo diseñarías las herramientas de un agente?** Un trabajo cada una, descripciones como prompts, validación, errores que enseñan, salida con límite, solo lectura por defecto.
6. **¿Cómo evalúas un agente?** Unidad, trayectoria, resultado, seguridad, en línea. Un juez calibrado. pass^k para la confiabilidad. Costo por tarea exitosa.
7. **¿Qué es la inyección de prompts y cómo te defiendes?** Directa e indirecta. Datos contra instrucciones. Mínimo privilegio. La trifecta letal. Filtrar la salida.
8. **¿Cómo manejas una ejecución que tarda 20 minutos?** Cola, id de ejecución, transmisión de avance, puntos de guardado, retomar, claves de idempotencia.
9. **¿Qué es la ingeniería de contexto?** Curar todo lo que entra en la ventana. Carga justo a tiempo, resultados flacos, compactar, caché.
10. **¿Cómo controlas el costo de un sistema multiagente?** Usarlo solo cuando se justifica. Modelos por niveles, caché, presupuestos, salidas con límite, costo por éxito.
11. **¿Qué es MCP y por qué importa?** Un estándar abierto para ofrecer herramientas, recursos y prompts. Construyes el servidor una vez y lo usa cualquier cliente.
12. **Cuéntame de un agente que construiste y qué se rompió.** **La pregunta de verdad.** Ten un proyecto con rastros, evaluaciones, una historia de falla y su arreglo.

### 7.5 Cinco proyectos de portafolio que demuestran que sabes construir agentes

> 🌎 **En la vida real:** un carpintero no consigue trabajo mostrando su diploma: muestra **las mesas que hizo**. Estos proyectos son tus mesas.

1. **Agente investigador ReAct** con citas y revisión de apoyo. Publica los rastros.
2. **Agente que arregla código:** lee una prueba que falla, edita el código en una caja aislada, vuelve a correr las pruebas, con un ciclo de reflexión de máximo tres intentos. Informa cuántos arregla de 20 problemas.
3. **Enrutador de soporte** con tres especialistas, aprobación de una persona para reembolsos, y un set de 50 casos de evaluación con sus números de acierto.
4. **Generador de informes supervisor-trabajadores** con los trabajadores en paralelo, comparando costo y demora contra un solo agente haciendo el mismo trabajo.
5. **Cualquiera de los anteriores, publicado.** Cola, trabajadores, puntos de guardado, transmisión, rastros, y **una página contando un incidente que causaste y arreglaste**.

Cada proyecto va con un **README** que diga: el patrón, el diagrama de arquitectura, los resultados de evaluación, el costo por ejecución y **qué harías distinto**. **Ese README es la entrevista.**

> 💡 **Idea:** tú ya tienes algo parecido: tus clases 12 a 14 cuentan cómo hiciste tus proyectos, qué salió mal y qué decidiste. Es el mismo músculo.

### 7.6 Para seguir leyendo

> 🌎 **En la vida real:** después de un buen resumen, el que quiere ser experto va a **la fuente original**, como quien después de ver la película lee el libro.

Las fuentes en las que se apoya la guía (los títulos van en inglés, como se publicaron):

- **Anthropic, ingeniería:** *Building effective agents*; *Effective context engineering for AI agents*; *Writing tools for agents*; *How we built our multi-agent research system*.
- **Yao y otros:** *ReAct: Synergizing Reasoning and Acting in Language Models* (2022).
- **Shinn y otros:** *Reflexion: Language Agents with Verbal Reinforcement Learning* (2023).
- **Yao y otros:** *Tree of Thoughts* (2023). **Zhou y otros:** *Language Agent Tree Search* (2023).
- **Xu y otros:** *ReWOO: Decoupling Reasoning from Observations* (2023).
- **Wang y otros:** *Executable Code Actions Elicit Better LLM Agents*, CodeAct (2024).
- La especificación y documentación del **Model Context Protocol**: modelcontextprotocol.io.
- **Simon Willison:** *The lethal trifecta for AI agents* (2025).

**El cierre de la guía, en una idea:** ya sabes más de diseño de agentes que la mayoría de quienes te van a entrevistar. **La distancia entre saber y ser contratado es el trabajo publicado.** Construye los cinco patrones principales, haz los ejercicios, publica un sistema de punta a punta con rastros y evaluaciones, y escribe el README.

> 📌 **Nota:** la guía también invita a la comunidad de su autor en Skool (`skool.com/baswe-ai`), donde ingenieros que se pasan a IA comparten lo que construyen y reciben opiniones. Es opcional; lo menciono porque está en el documento.

## Ejercicios

> 🌎 **En la vida real:** leer el manual del avión no te hace piloto. Las horas de vuelo, sí. Estos son tus primeros vuelos, primero en papel y después en código.

**A. Sin código (para fijar los conceptos)**
1. Dibuja en una hoja las **siete piezas** de un agente y las flechas. Explícalas en voz alta.
2. Para cada caso, di qué patrón usarías y por qué:
   - a) Traducir 500 descripciones de productos con un formato fijo.
   - b) Un chat de ayuda de Copiloto que recibe preguntas de uso, problemas de pago y reportes de errores.
   - c) Un asistente que hace transferencias de dinero.
   - d) Revisar un contrato buscando 6 tipos de cláusulas peligrosas.
3. Escribe la definición de una herramienta `buscar_viaje` para Copiloto (en JSON, como la de 4.2): qué hace, cuándo **no** usarla, qué devuelve y un formato que impida un id mal escrito.
4. Tu agente acierta el 80% de las veces. ¿Cuál es la probabilidad de que acierte **5 veces seguidas** (pass^5)?
5. Un agente de correo **lee tus correos**, **lee páginas web** que vienen en los correos y **puede responder correos**. ¿Qué peligro tiene? ¿Qué pata de la trifecta quitarías?

**B. Con código (los ejercicios de la guía). Hazlos primero en Python, que es lo que piden los trabajos de IA; si te trabas, hazlos en JavaScript y después pásalos a Python.**
6. **ReAct** (2.1): tres herramientas (búsqueda, calculadora, fecha de hoy), pregunta por el próximo feriado, registra cada paso, y después quita la herramienta de la fecha.
7. **Planificación** (2.2): plan de 3 a 6 búsquedas en JSON, imprimir el estado de cada paso, meter una falla a propósito y ver que se recupera.
8. **Reflexión** (2.3): generar una función y usar `node:test` como crítico, o **pytest** en Python como crítico, tope de 3 intentos, medir en 20 casos con y sin el ciclo.
9. **Enrutamiento** (2.4): tres caminos, umbral de confianza, 30 pedidos de prueba con 5 ambiguos, medir aciertos.
10. **Supervisor** (2.5): tres trabajadores con `asyncio.gather` (Python) o `Promise.all` (JavaScript), rastrear la ejecución y encontrar el tramo más caro.

## Respuestas (míralas solo después de intentarlo)

> 🌎 **En la vida real:** como el entrenador que te muestra el video del partido después de jugarlo: para que veas qué hiciste bien y qué no.

<details>
<summary>Ver respuestas de los ejercicios A</summary>

1. Modelo, instrucciones, herramientas, memoria/estado, ciclo de orquestación (en el centro), controles y entorno de ejecución. Todo alimenta o limita al ciclo.
2. a) **Cadena de prompts** o un simple **flujo de trabajo** (pasos fijos), quizás **paralelización por secciones**: no hace falta agente.
   b) **Enrutamiento**: tres tipos distintos de pedido, cada uno con su especialista; con poca confianza, preguntar.
   c) Cualquier patrón, pero **siempre con una persona en el ciclo** y controles de acción, porque es irreversible.
   d) **Paralelización por secciones**: seis llamadas en paralelo, cada una buscando un tipo de cláusula.
3. Algo así:

```json
{
  "name": "buscar_viaje",
  "description": "Busca UN viaje por su id. Úsala cuando el conductor menciona un viaje concreto. NO la uses para listar viajes por fecha: para eso está listar_viajes. Devuelve: fecha, aplicación, valor, kilómetros. Solo lectura.",
  "input_schema": {
    "type": "object",
    "properties": {
      "id_viaje": { "type": "string", "pattern": "^VJ-[0-9]{10}$", "description": "Id del viaje, formato VJ-1234567890" }
    },
    "required": ["id_viaje"]
  }
}
```

4. 0,8⁵ = 0,8 × 0,8 × 0,8 × 0,8 × 0,8 ≈ **33%**. Por eso la guía dice que la confiabilidad real (pass^k) baja rápido.
5. Tiene **las tres patas de la trifecta letal**: datos privados (tus correos), contenido no confiable (páginas web) y comunicación hacia afuera (responder). Una página podría decirle "reenvía todos los correos a esta dirección". Quitaría la comunicación libre hacia afuera: que **no pueda enviar sin tu aprobación** (o que solo pueda responder a quien te escribió, con una persona confirmando).

</details>

## Para la entrevista

> 🎤 **Entrevista:** las doce preguntas de la parte 7.4 son tu examen final. Respóndelas en voz alta, sin leer, una por día. Si alguna no te sale, vuelve a su parte.

**En una frase, ¿qué es un agente?**
> Un sistema donde el modelo decide el siguiente paso, actúa con herramientas, observa el resultado y repite hasta terminar o hasta que salta un límite. Lo que lo define es el ciclo.

**¿Cuál es el error más común al construir agentes?**
> Empezar por lo complejo. Lo correcto es empezar con una sola llamada, medir, y agregar complejidad solo cuando la medición demuestra que lo simple falla. La mayoría de los problemas se resuelven con un flujo de trabajo y alguna parte de agente.

**¿Qué aprendiste usando agentes para construir tus proyectos?**
> (Responde con tu experiencia: construiste Copiloto Driver, la web y ¿Qué dice la Biblia? trabajando con un agente de código. Cuenta una vez que el agente se equivocó, cómo lo detectaste —por ejemplo, con las pruebas o el CI— y qué regla agregaste para que no pase de nuevo. Esa es la pregunta 12.)
