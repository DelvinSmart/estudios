# Agentes 1: qué es un agente (y Python para leerlo)

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

> 📌 **Nota:** esta clase es parte del curso **Agentes de IA**, que tiene su propio certificado. Está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), explicada en español con mis palabras; los números (2.1, 4.3…) son los mismos de la guía.

## Python: Lo mismo, en los dos lenguajes

> 🌎 **En la vida real:** ya hablas español; aprender a **leer** portugués te lleva días, no años, porque casi todo se parece. Tú ya lees JavaScript y TypeScript; leer Python es igual: cambian algunas palabras y la forma de escribir, pero las ideas son las mismas.

> 🌎 **Otro ejemplo:** Es como manejar en otro país con el volante del otro lado: al principio te cuesta, pero los pedales, el freno y las reglas son las mismas.

**¿Por qué Python?** Es **el lenguaje más usado en inteligencia artificial**. Las librerías de IA, los ejemplos de las empresas que hacen los modelos, los *frameworks* de agentes y la mayoría de las ofertas de trabajo de "AI engineer" lo usan. La guía original trae todo su código en Python. Por eso en esta clase **cada ejemplo está dos veces**: primero en JavaScript (lo que ya conoces) y después en **Python** (lo que te van a pedir).

> 💡 **Idea:** los nombres de los ejemplos están en español para que los compares fácil con la versión en JavaScript. En un trabajo real, el código casi siempre se escribe con nombres en inglés (`run_agent` en vez de `correr_agente`), pero la estructura es la misma.

> 🌎 **En la vida real:** Es como un diccionario de bolsillo español-portugués: "obrigado" = "gracias". Buscas la palabra que conoces y encuentras la otra.

> 🌎 **Otro ejemplo:** Es como las equivalencias de una receta: "1 taza = 240 ml". La medida cambia de nombre, lo que mides es lo mismo.

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

## Python: La gran diferencia: la sangría

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

> 🌎 **Otro ejemplo:** Como las sangrías de una lista de compras por sección: "Lácteos" y, corridos hacia adentro, "leche, queso". Lo corrido pertenece a la sección.

## Python: Las tres cosas de Python que más vas a ver en IA

> 🌎 **En la vida real:** Es como las tres herramientas que más usa un electricista: el multímetro (Pydantic, que revisa), las pinzas (las listas por comprensión, que transforman) y la escalera (asyncio, para hacer varias cosas a la vez).

> 🌎 **Otro ejemplo:** Es como los tres botones que más usas del teléfono: llamar, mensaje y cámara. Hay muchos más, pero esos tres son de todos los días.

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

## Python: Cómo correr un archivo de Python

> 🌎 **En la vida real:** Es como prender un electrodoméstico nuevo: lo enchufas (instalas con pip) y aprietas el botón (corres el archivo con python3).

> 🌎 **Otro ejemplo:** Es como abrir un archivo de música: le dices al reproductor cuál, y suena.

Tu Mac ya trae Python. Guarda un archivo `prueba.py` y en la terminal:

```bash
python3 prueba.py
```

Para instalar una librería, como Pydantic:

```bash
python3 -m pip install pydantic
```

> 📌 **Nota:** `pip` es el `npm` de Python: instala librerías. Y **pytest** es el Jest de Python: corre las pruebas automáticas.

## ✍️ Práctica: Python para leer los ejemplos

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

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

## 1.1 Qué es un agente, de verdad

> 🎙️ **El profesor:** {{alumno}}, llegaste a la última etapa. Todo lo que aprendiste (funciones, pruebas, CI, errores, Firebase, arquitectura) se usa aquí. Un agente es un programa como cualquier otro, con una pieza nueva en el centro: un modelo que decide. Empecemos por definir bien qué es, porque la mitad de la confusión del mundo viene de palabras vagas.

> 🌎 **En la vida real:** Es como aprender a manejar: antes de las maniobras difíciles, tienes que saber qué es el volante, el freno y el acelerador.

> 🌎 **Otro ejemplo:** Es como empezar una obra: primero los cimientos; si están mal, todo lo de arriba se cae.

Antes de elegir un patrón hay que saber exactamente qué estás construyendo. Casi toda la confusión sobre agentes viene de usar palabras vagas.

> 🌎 **En la vida real:** una **llamada al modelo** es una calculadora: metes algo, sale algo, una vez. Un **agente** es un mecánico: mira el carro, decide qué revisar, usa una herramienta, mira qué pasó, decide lo siguiente… y repite hasta que el carro anda o hasta que dice "esto no lo puedo arreglar".

> 🌎 **Otro ejemplo:** Como la diferencia entre preguntarle la hora a alguien (una llamada) y contratar a alguien para que organice tu mudanza (un agente): el segundo decide, actúa, revisa y sigue hasta terminar.

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

> ✋ **Para y piensa:** la app Copiloto Driver tiene un asistente, el Copiloto, que responde preguntas. Si solo recibe la pregunta y devuelve una respuesta, una vez, ¿es un agente o una llamada al modelo?

<details>
<summary>Ver la respuesta</summary>

Es una **llamada al modelo**. Sería un **agente** si el modelo pudiera decidir usar herramientas (por ejemplo, buscar tus ingresos del mes), mirar el resultado y seguir, en un ciclo, hasta terminar.

</details>

## 1.2 Las siete piezas de un agente

> 🌎 **En la vida real:** un restaurante. El **chef** decide (el modelo). La **receta y las reglas de la casa** (las instrucciones). Los **cuchillos y el horno** (las herramientas). La **comanda y la despensa** (la memoria). El **ritmo de la cocina**: tomar pedido, cocinar, revisar, servir (el ciclo). El **inspector de higiene** (los controles). Y **el local, la luz y el gas** que mantienen todo andando (el entorno de ejecución).

> 🌎 **Otro ejemplo:** Como un taxi: el conductor decide (modelo), las reglas de tránsito y de la empresa (instrucciones), el GPS y la radio (herramientas), el recuerdo de los viajes del día (memoria), el ritmo de buscar pasajero-llevar-cobrar (ciclo), los límites de velocidad (controles) y el carro con su mantenimiento (entorno).

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

## 1.3 El ciclo del agente, paso a paso

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

## 1.4 Cuándo construir un agente (y cuándo no)

> 🌎 **En la vida real:** no contratas a un arquitecto para colgar un cuadro. Cada nivel de ayuda cuesta más. Los agentes cambian **previsibilidad por capacidad**: cada paso agrega demora, costo y un lugar nuevo donde fallar.

> 🌎 **Otro ejemplo:** Como elegir transporte: para ir a la esquina caminas; para cruzar la ciudad, taxi; para mudarte, camión. No usas camión para ir a la esquina.

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

## 1.5 El vocabulario que vas a ver siempre

> 🌎 **En la vida real:** en un taller se habla de "alineación", "balanceo", "escáner". Si no conoces las palabras, no entiendes al mecánico. Estas son las palabras del taller de agentes.

> 🌎 **Otro ejemplo:** Como las palabras de un hospital: "triage", "historia clínica", "alta". Si no las conoces, no entiendes al médico.

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

## ✍️ Práctica: qué es un agente

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

```practica
escribe :: Con tus palabras: ¿qué diferencia hay entre una llamada al modelo y un agente? :: Una llamada recibe texto y devuelve texto una vez; un agente decide qué hacer, usa herramientas, observa el resultado y repite en un ciclo hasta terminar o hasta un límite.
elige :: Según Anthropic, un flujo de trabajo (workflow) es… :: Un modelo que decide su propio camino :: Modelo y herramientas siguiendo caminos escritos de antemano en el código :: Un tipo de base de datos
elige :: ¿Dónde conviene empezar en el espectro de autonomía? :: Lo más a la derecha (multiagente) :: Lo más a la izquierda que el problema permita :: En el medio siempre
elige :: ¿Cuál es la pieza que la guía dice que está peor diseñada en la mayoría de los agentes? :: El modelo :: La memoria y el estado :: Las instrucciones
elige :: En el ciclo del agente, ¿cuándo termina normalmente? :: Cuando se acaba la memoria :: Cuando el modelo responde sin pedir ninguna herramienta (o se llega al máximo de pasos) :: Nunca
vf :: La mayoría de los sistemas reales son agentes totalmente libres
vf :: Antes de construir un agente hay que poder definir cómo se ve "terminado"
vf :: Las instrucciones (system prompt) se tratan como código: con versiones y probadas
elige :: ¿Qué es una trayectoria? :: Un tipo de modelo :: La secuencia completa de decisiones, llamadas y observaciones de una ejecución :: Un gráfico
elige :: ¿Qué es un rastro (trace)? :: Un error :: El registro de las llamadas al modelo y a herramientas de una ejecución, con tiempos, tokens y costo :: Una contraseña
escribe :: Di las tres preguntas antes de construir un agente. :: ¿Puedo definir cómo se ve terminado? ¿El agente puede verificar su propio avance? ¿Puedo pagar la peor ejecución posible, en dinero y en daño?
```
