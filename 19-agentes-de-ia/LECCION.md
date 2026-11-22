# Agentes 1: qué es un agente (y Python para leerlo)

> 🌎 **En la vida real:** un chat con IA es como preguntarle algo a un experto por teléfono: te responde y cuelga. Un **agente** es como contratar a ese experto para que **haga el trabajo**: busca, llama, revisa, se equivoca, corrige y te avisa cuando terminó. Esta clase es sobre cómo se diseña ese "empleado".

Esta clase está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), que está en tu SSD: `SSD_Desarrollo/Documentos/baswe-agentic-design-patterns-guide.pdf`. No es una copia ni una traducción palabra por palabra: es **cada concepto** de la guía, explicado en español con mis palabras, con ejemplos de la vida real y con código **en JavaScript (que ya conoces) y en Python** (el lenguaje que más se usa en IA y el que usa la guía). Si una palabra te genera dudas, abre el PDF en esa misma sección: los números (1.1, 2.3, 4.6…) son los mismos.

**La idea central de la guía:** la mayoría aprende agentes al revés (elige una herramienta, copia un ejemplo y termina con algo que no puede explicar). Aquí va al derecho: **primero los patrones**, después las decisiones de ingeniería de cada uno, y al final lo que mantiene vivo a un agente cuando lo usan personas reales.

**Antes de empezar:** si todavía estás aprendiendo qué es una variable, empieza por el Tema 116. Si Python es nuevo para ti, haz primero los Temas 36 a 39: nombres y tipos, decisiones y ciclos, listas y diccionarios, y funciones. Si ya sabes programar en JavaScript, usa la comparación de abajo para repasar la forma de escribir esas mismas ideas en Python.

**Tres formas de estudiarla** (las mismas que propone la guía):

| Si tienes… | Lee | Te llevas |
|---|---|---|
| Una noche antes de una entrevista | 1.1, 1.2, los cinco patrones de la Parte 2, la tabla 3.6, y 7.3 y 7.4 | Definiciones claras, un mapa mental de los patrones y respuestas para las 12 preguntas que más hacen |
| Una semana para construir algo | La Parte 2 completa, 4.1 a 4.4, 5.2, 5.3 y 7.2 | Un patrón bien construido, herramientas bien diseñadas, un primer set de pruebas y una lista para publicar |
| Un mes para ir a fondo | Todo, en orden, haciendo cada ejercicio | Cinco proyectos para tu portafolio, una arquitectura que puedes defender y el vocabulario para liderar una revisión de diseño |

> 📌 **Nota:** la frase más importante de la guía: **leer sobre agentes no es una habilidad; construir uno, sí.** Cada patrón termina con un ejercicio para construir. Hazlos.

> 📌 **Nota:** esta clase es parte del curso **Agentes de IA**, que tiene su propio certificado. Está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), explicada en español con mis palabras; los números (2.1, 4.3…) son los mismos de la guía.

## Python: Lo mismo, en los dos lenguajes

> 🌎 **En la vida real:** imagina un cuaderno con dos casillas: «combustible» y «lavado». Anotas 50 en la primera y 20 en la segunda. Quien lee esas casillas puede sumar 70 siguiendo el mismo procedimiento cada vez.

En Python puedes darle un nombre a cada cantidad y devolver el resultado desde una función:

```python
def total_del_dia(combustible, lavado):
    return combustible + lavado

total = total_del_dia(50, 20)
```

`def` presenta la función. `combustible` y `lavado` son los nombres que reciben los dos datos. La línea que empieza con cuatro espacios pertenece a la función. Al llamarla con `50` y `20`, `return` entrega `70`, que queda guardado en `total`. Esa secuencia de entrada, trabajo y salida se repite en las herramientas de un agente. La tabla que sigue te permite reconocer cómo se escribe en cada lenguaje.

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

> 🧩 **Piezas para este ejercicio**
> - `def` crea una función y `return` entrega su resultado. `lista.append(app)` cambia la lista agregando al final. Luego `len(lista)` cuenta los elementos, incluido el nuevo. En `f"Hola {nombre}"`, las llaves insertan el valor de `nombre`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: De JavaScript a Python
lenguaje: python
pide: Escribe en Python lo que en JavaScript sería `function agregarApp(lista, app) { lista.push(app); return lista.length; }` y `const saludo = (nombre) => \`Hola ${nombre}\``. `agregar_app(lista, app)` agrega la app al final y devuelve cuántas hay. `saludo(nombre)` devuelve `"Hola Delvin"` con una f-string. Usa la tabla de arriba: `append`, `len` y `f"…{…}"`.
--- código
def agregar_app(lista, app):
    pass  # tu código aquí


def saludo(nombre):
    pass  # tu código aquí
--- pruebas
prueba("agrega y cuenta", lambda: igual(agregar_app(["Uber"], "99"), 2))
def _queda_en_la_lista():
    apps = ["Uber"]
    agregar_app(apps, "inDrive")
    igual(apps, ["Uber", "inDrive"])
prueba("queda al final de la lista", _queda_en_la_lista)
prueba("el saludo", lambda: igual(saludo("Delvin"), "Hola Delvin"))
--- solución
def agregar_app(lista, app):
    lista.append(app)
    return len(lista)


def saludo(nombre):
    return f"Hola {nombre}"
```

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

> 🧩 **Piezas para este ejercicio**
> - `x in lista` devuelve un booleano, `True` o `False`. Las líneas dentro de cada rama llevan cuatro espacios. Python prueba las ramas de arriba hacia abajo, así que prueba el umbral mayor primero.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La sangría manda
lenguaje: python
pide: Completa `es_inmutable(app_id)`, que devuelve `True` si el id está en `["extras", "particular_trips", "my_company"]`, con `in`. Y `nivel(ganancia)`: `"buena"` si es 25 o más, `"normal"` si es 15 o más, y si no `"baja"`. Usa `if`, `elif` y `else`, con los dos puntos y 4 espacios.
--- código
def es_inmutable(app_id):
    pass  # tu código aquí


def nivel(ganancia):
    pass  # tu código aquí
--- pruebas
prueba("uber no es inmutable", lambda: igual(es_inmutable("uber"), False))
prueba("extras sí", lambda: igual(es_inmutable("extras"), True))
prueba("my_company sí", lambda: igual(es_inmutable("my_company"), True))
prueba("buena", lambda: igual(nivel(30), "buena"))
prueba("justo 25 es buena", lambda: igual(nivel(25), "buena"))
prueba("normal", lambda: igual(nivel(15), "normal"))
prueba("baja", lambda: igual(nivel(9.5), "baja"))
--- solución
def es_inmutable(app_id):
    return app_id in ["extras", "particular_trips", "my_company"]


def nivel(ganancia):
    if ganancia >= 25:
        return "buena"
    elif ganancia >= 15:
        return "normal"
    else:
        return "baja"
```

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

> 🧩 **Piezas para este ejercicio**
> - Lee `[v * 2 for v in valores]` como «por cada valor, guarda su doble». La parte `if` al final es opcional y decide qué valores entran. Para sacar un nombre de un diccionario, usa `herramienta["nombre"]`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Listas por comprensión
lenguaje: python
pide: Sin `for` largos: cada función se escribe en una línea con una lista por comprensión. `dobles(valores)` devuelve cada valor por 2. `grandes(valores, minimo)` devuelve solo los que son mayores que el mínimo. `nombres(herramientas)` recibe una lista de diccionarios como `{"nombre": "buscar_docs"}` y devuelve solo los nombres.
--- código
def dobles(valores):
    pass  # tu código aquí


def grandes(valores, minimo):
    pass  # tu código aquí


def nombres(herramientas):
    pass  # tu código aquí
--- pruebas
prueba("dobles", lambda: igual(dobles([18, 12, 25]), [36, 24, 50]))
prueba("grandes", lambda: igual(grandes([18, 12, 25], 15), [18, 25]))
prueba("grandes sin ninguno", lambda: igual(grandes([1, 2], 15), []))
prueba("nombres", lambda: igual(nombres([{"nombre": "buscar_docs"}, {"nombre": "calculadora"}]), ["buscar_docs", "calculadora"]))
--- solución
def dobles(valores):
    return [v * 2 for v in valores]


def grandes(valores, minimo):
    return [v for v in valores if v > minimo]


def nombres(herramientas):
    return [h["nombre"] for h in herramientas]
```

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

> 🧩 **Piezas para este ejercicio**
> - Aquí la función devuelve texto. `.endswith(".py")` comprueba el final del nombre y `None` representa que no hay comando disponible. El comando se ejecutaría aparte en la terminal.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los comandos de la terminal
lenguaje: python
pide: Completa `comando_correr(archivo)`, que devuelve `"python3 prueba.py"` para `"prueba.py"`, pero `None` si el archivo no termina en `.py` (usa `.endswith(".py")`). Y `comando_instalar(libreria)`, que devuelve `"python3 -m pip install pydantic"` para `"pydantic"`.
--- código
def comando_correr(archivo):
    pass  # tu código aquí


def comando_instalar(libreria):
    pass  # tu código aquí
--- pruebas
prueba("correr un archivo", lambda: igual(comando_correr("prueba.py"), "python3 prueba.py"))
prueba("otro archivo", lambda: igual(comando_correr("agente.py"), "python3 agente.py"))
prueba("no es de Python", lambda: igual(comando_correr("notas.txt"), None))
prueba("instalar", lambda: igual(comando_instalar("pydantic"), "python3 -m pip install pydantic"))
--- solución
def comando_correr(archivo):
    if not archivo.endswith(".py"):
        return None
    return f"python3 {archivo}"


def comando_instalar(libreria):
    return f"python3 -m pip install {libreria}"
```

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

> 🧩 **Piezas para este ejercicio**
> - Usa las dos preguntas en orden. Primero mira si hay repetición. Si la hay, distingue quién elige lo que pasa en la próxima vuelta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Llamada, flujo o agente?
lenguaje: js
pide: Completa `queEs(sistema)`. El sistema dice `{ repite, decideElModelo }`. Si no repite nada, es `'llamada'`. Si repite pero el camino lo decide tu código (`decideElModelo: false`), es `'flujo de trabajo'`. Si repite y el modelo decide qué hacer después, es `'agente'`.
--- código
function queEs(sistema) {
  // tu código aquí
}
--- pruebas
prueba('el Copiloto que solo responde', () => igual(queEs({ repite: false, decideElModelo: false }), 'llamada'));
prueba('pasos fijos en el código', () => igual(queEs({ repite: true, decideElModelo: false }), 'flujo de trabajo'));
prueba('el modelo dirige el ciclo', () => igual(queEs({ repite: true, decideElModelo: true }), 'agente'));
prueba('sin ciclo no es agente aunque decida', () => igual(queEs({ repite: false, decideElModelo: true }), 'llamada'));
--- solución
function queEs(sistema) {
  if (!sistema.repite) return 'llamada';
  return sistema.decideElModelo ? 'agente' : 'flujo de trabajo';
}
```

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

> 🧩 **Piezas para este ejercicio**
> - Cada nombre de la lista representa una pieza del objeto. Busca el valor con ese nombre. Una propiedad ausente da `undefined` y la consigna también considera ausente a `null`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las piezas que faltan
lenguaje: js
pide: Completa `piezasQueFaltan(agente)`. El agente es un objeto con algunas de las siete piezas: `modelo`, `instrucciones`, `herramientas`, `memoria`, `ciclo`, `controles` y `entorno`. Devuelve una lista con las que **faltan**, en ese orden. Una pieza falta si no está o si vale `null`.
--- código
const PIEZAS = ['modelo', 'instrucciones', 'herramientas', 'memoria', 'ciclo', 'controles', 'entorno'];

function piezasQueFaltan(agente) {
  // tu código aquí
}
--- pruebas
prueba('completo', () => igual(piezasQueFaltan({ modelo: 'm', instrucciones: 'i', herramientas: [], memoria: {}, ciclo: 'c', controles: [], entorno: 'e' }), []));
prueba('sin controles ni entorno', () => igual(piezasQueFaltan({ modelo: 'm', instrucciones: 'i', herramientas: [], memoria: {}, ciclo: 'c' }), ['controles', 'entorno']));
prueba('null cuenta como que falta', () => igual(piezasQueFaltan({ modelo: null }), PIEZAS));
prueba('una lista vacía de herramientas sí está', () => ok(!piezasQueFaltan({ herramientas: [] }).includes('herramientas')));
--- solución
const PIEZAS = ['modelo', 'instrucciones', 'herramientas', 'memoria', 'ciclo', 'controles', 'entorno'];

function piezasQueFaltan(agente) {
  return PIEZAS.filter((p) => agente[p] === undefined || agente[p] === null);
}
```

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

> 🧩 **Piezas para este ejercicio**
> - El modelo simulado lee el historial. Cada resultado de herramienta se agrega a ese historial para que la siguiente llamada lo tenga disponible. El límite controla cuántas veces se vuelve a preguntar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primer ciclo de agente
lenguaje: js
pide: Completa `correrAgente(tarea, herramientas, llm, maxPasos)`. Aquí `llm(mensajes)` es un modelo **de mentira** que devuelve `{ texto, llamadas }`. Repite hasta `maxPasos` veces: llama al modelo con los mensajes; si no hay llamadas, devuelve `{ fin: 'listo', texto }`. Si hay, corre cada herramienta (`herramientas[llamada.nombre](llamada.args)`) y agrega `{ rol: 'herramienta', contenido: resultado }` a los mensajes. Si se acaban los pasos, devuelve `{ fin: 'maximo' }`.
--- código
function correrAgente(tarea, herramientas, llm, maxPasos = 10) {
  const mensajes = [{ rol: 'usuario', contenido: tarea }];
  // tu código aquí
}
--- pruebas
const sumar = ({ a, b }) => a + b;
// Este modelo de mentira pide sumar una vez y, cuando ve el resultado, responde.
const llmQueSuma = (mensajes) => {
  const visto = mensajes.find((m) => m.rol === 'herramienta');
  if (visto) return { texto: `Son ${visto.contenido}`, llamadas: [] };
  return { texto: '', llamadas: [{ nombre: 'sumar', args: { a: 18, b: 12 } }] };
};
prueba('responde sin herramientas', () => igual(correrAgente('hola', {}, () => ({ texto: 'Hola', llamadas: [] })), { fin: 'listo', texto: 'Hola' }));
prueba('usa la herramienta y responde', () => igual(correrAgente('¿18 + 12?', { sumar }, llmQueSuma), { fin: 'listo', texto: 'Son 30' }));
prueba('para en el máximo', () => igual(correrAgente('x', { sumar }, () => ({ texto: '', llamadas: [{ nombre: 'sumar', args: { a: 1, b: 1 } }] }), 3), { fin: 'maximo' }));
prueba('llama al modelo como mucho maxPasos veces', () => {
  let veces = 0;
  correrAgente('x', { sumar }, () => { veces++; return { texto: '', llamadas: [{ nombre: 'sumar', args: { a: 1, b: 1 } }] }; }, 4);
  igual(veces, 4);
});
--- solución
function correrAgente(tarea, herramientas, llm, maxPasos = 10) {
  const mensajes = [{ rol: 'usuario', contenido: tarea }];
  for (let paso = 0; paso < maxPasos; paso++) {
    const respuesta = llm(mensajes);
    if (respuesta.llamadas.length === 0) return { fin: 'listo', texto: respuesta.texto };
    for (const llamada of respuesta.llamadas) {
      const resultado = herramientas[llamada.nombre](llamada.args);
      mensajes.push({ rol: 'herramienta', contenido: resultado });
    }
  }
  return { fin: 'maximo' };
}
```

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

> 🧩 **Piezas para este ejercicio**
> - Las primeras preguntas determinan si conviene darle libertad al modelo. Si pasan, usa la estructura de los pasos para elegir la modalidad. La aprobación puede añadirse a cualquiera de las modalidades.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La escalera: qué construir
lenguaje: js
pide: Completa `queConstruir(caso)`. Primero las tres preguntas: si `caso.sabesCuandoTermina`, `caso.puedeVerificarse` o `caso.puedesPagarLoPeor` es `false`, devuelve `'flujo de trabajo'`. Si pasan las tres: con `caso.pasosFijos` → `'flujo de trabajo'`; con `caso.pocasCategorias` → `'enrutamiento'`; si no → `'agente'`. Y si `caso.errorCaro` es `true`, agrega `' + aprobación'` al final, sea cual sea.
--- código
function queConstruir(caso) {
  // tu código aquí
}
--- pruebas
const bien = { sabesCuandoTermina: true, puedeVerificarse: true, puedesPagarLoPeor: true };
prueba('pasos fijos', () => igual(queConstruir({ ...bien, pasosFijos: true }), 'flujo de trabajo'));
prueba('pocas categorías', () => igual(queConstruir({ ...bien, pocasCategorias: true }), 'enrutamiento'));
prueba('pasos que no se saben', () => igual(queConstruir({ ...bien }), 'agente'));
prueba('no sabe cuándo termina', () => igual(queConstruir({ ...bien, puedeVerificarse: false }), 'flujo de trabajo'));
prueba('error caro', () => igual(queConstruir({ ...bien, errorCaro: true }), 'agente + aprobación'));
--- solución
function queConstruir(caso) {
  let tipo;
  if (!caso.sabesCuandoTermina || !caso.puedeVerificarse || !caso.puedesPagarLoPeor) tipo = 'flujo de trabajo';
  else if (caso.pasosFijos) tipo = 'flujo de trabajo';
  else if (caso.pocasCategorias) tipo = 'enrutamiento';
  else tipo = 'agente';
  return caso.errorCaro ? `${tipo} + aprobación` : tipo;
}
```

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

> 🧩 **Piezas para este ejercicio**
> - Esta es una estimación. Limpia y separa el texto para contar palabras reales. En la lista de mensajes, estima cada contenido y compara la suma con el espacio disponible.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Cabe en la ventana de contexto?
lenguaje: js
pide: Un *token* es más o menos tres cuartos de palabra. Completa `tokensDe(texto)`: cuenta las palabras (separadas por espacios, sin contar los vacíos) y divide entre 0,75, redondeando hacia arriba con `Math.ceil`. Y `cabe(mensajes, ventana)`: suma los tokens del `contenido` de todos los mensajes y dice si es menor o igual que la ventana.
--- código
function tokensDe(texto) {
  // tu código aquí
}

function cabe(mensajes, ventana) {
  // tu código aquí
}
--- pruebas
prueba('tres palabras son 4 tokens', () => igual(tokensDe('hola qué tal'), 4));
prueba('espacios de más no cuentan', () => igual(tokensDe('  hola   mundo '), 3));
prueba('vacío', () => igual(tokensDe(''), 0));
prueba('cabe', () => igual(cabe([{ contenido: 'hola qué tal' }, { contenido: 'bien' }], 6), true));
prueba('no cabe', () => igual(cabe([{ contenido: 'hola qué tal' }, { contenido: 'bien' }], 5), false));
--- solución
function tokensDe(texto) {
  const palabras = texto.split(' ').filter((p) => p !== '');
  return Math.ceil(palabras.length / 0.75);
}

function cabe(mensajes, ventana) {
  const total = mensajes.reduce((suma, m) => suma + tokensDe(m.contenido), 0);
  return total <= ventana;
}
```

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

## ¿Por qué Python para agentes? ¿Y si lo hago en otro lenguaje?

> 🌎 **En la vida real:** para ser chef puedes cocinar con cualquier cuchillo, pero en las cocinas profesionales casi todos usan el mismo tipo, porque las recetas, los cursos y los compañeros lo usan. No es que corte "mejor" por arte de magia: es que **todo a su alrededor está pensado para ese cuchillo**.

> 🌎 **Otro ejemplo:** puedes hablar de fútbol en cualquier idioma, pero si quieres trabajar en la liga inglesa, te conviene el inglés: ahí están los entrenadores, los videos y las entrevistas.

**Primero lo importante: sí se puede en otros lenguajes.** Un agente, por dentro, es un **ciclo** (lo viste en 1.3): manda texto al modelo por internet, recibe una respuesta, corre una herramienta si la pide, y repite. Para eso un lenguaje solo necesita tres cosas que **todos** los lenguajes modernos tienen:

1. Hacer un **pedido por internet** (*HTTP*: la forma en que un programa le habla a un servidor).
2. Leer y escribir **JSON** (el formato de texto con llaves `{ }` que usan las APIs).
3. Repetir pasos en un **ciclo** (`while`).

**La prueba está en tus proyectos:** el asistente de Copiloto está hecho en **TypeScript**, en Firebase Cloud Functions, con Gemini. Y en esta clase cada ejemplo está en JavaScript **y** en Python, y hacen lo mismo.

### Entonces, ¿por qué todos dicen "Python"?

No es porque Python sea más rápido ni más seguro. Es por **lo que hay alrededor**:

| Razón | Qué quiere decir |
|---|---|
| **Las librerías salen primero en Python** | Una **librería** es código que otro escribió para que tú lo uses. Cuando una empresa de IA saca algo nuevo, el ejemplo y la librería oficial suelen salir primero en Python, y después (o a veces nunca) en otros lenguajes. |
| **Los frameworks de agentes** | Un **framework** es un "esqueleto" ya armado donde tú pones tus piezas. Casi todos los de agentes nacieron en Python; varios ya tienen versión en TypeScript, pero la de Python suele estar más completa. |
| **Los datos y el aprendizaje automático** | Si el agente tiene que analizar planillas, hacer cuentas con muchos datos o entrenar un modelo, Python tiene las herramientas de referencia (pandas para tablas, NumPy para números, PyTorch para modelos). |
| **Los ejemplos y las respuestas** | La mayoría de los tutoriales, guías y respuestas en internet sobre IA están en Python. Si te trabas, encuentras ayuda más rápido. |
| **El trabajo** | La mayoría de las ofertas de "AI engineer" piden Python. |
| **Es corto de escribir** | Python se lee casi como inglés y pide menos símbolos. Para probar ideas rápido (en un **cuaderno**, *notebook*: un documento donde el código y sus resultados están juntos) es muy cómodo. |

### Lo que NO es verdad (aunque se escucha mucho)

- ❌ **"Python es más rápido."** Al revés: Python es **más lento** que JavaScript, Kotlin o Swift para hacer cuentas. Pero en un agente **casi todo el tiempo se va esperando al modelo** (uno o varios segundos por respuesta, por internet). Si tu código tarda 2 milisegundos o 20, no se nota al lado de esos segundos. Y cuando Python hace cuentas pesadas de IA, por dentro las hace código escrito en C o en la tarjeta de video, no Python.
- ❌ **"En otro lenguaje el agente es menos seguro."** La seguridad de un agente depende de **cómo lo diseñas**: qué herramientas le das, qué frenos pones, si tratas lo que entra como datos y no como órdenes (lo verás en las clases de frenos y controles). Un agente mal diseñado es peligroso en Python y en TypeScript igual.
- ❌ **"Las respuestas son mejores en Python."** La respuesta la da **el modelo**, no tu lenguaje. El mismo modelo, con las mismas instrucciones, responde lo mismo desde Python o desde TypeScript.

> 💡 **Idea:** el lenguaje cambia **lo cómodo que es construirlo**, no **lo inteligente que es el agente**.

### ¿Cuándo conviene otro lenguaje?

| Si el agente… | Conviene | Por qué |
|---|---|---|
| Vive dentro de tu **app web o tu servidor de Node** (como el asistente de Copiloto) | **TypeScript** | Un solo lenguaje en todo el proyecto, los mismos tipos, sin un segundo servidor que mantener. Las empresas de IA también tienen librería oficial en TypeScript. |
| Analiza **datos**, planillas o documentos en cantidad | **Python** | Por pandas, NumPy y todo lo de datos. |
| Tiene que correr **dentro del teléfono**, con el modelo chico que trae el propio teléfono | **Kotlin** (Android) o **Swift** (iPhone) | Esos modelos se usan con las herramientas de cada sistema, que están en su idioma nativo. |
| Es un **servicio enorme** que atiende a muchísimas personas a la vez | A veces **Go** o **Java** | Las empresas grandes ya tienen su sistema en esos lenguajes. |
| Es para **aprender y conseguir trabajo** en IA | **Python** | Por los ejemplos, la ayuda y las ofertas. |

> 🎙️ **El profesor dice:** si ya sabes JavaScript, **no estás atrasado**: el ciclo, las herramientas, los frenos y las evaluaciones son iguales. Aprende a **leer** Python (esta clase te enseña lo justo) y construye en el lenguaje donde vive tu proyecto.

> 🧩 **Piezas para este ejercicio**
> - Recorre los requisitos en el orden de la consigna. El primer caso que encaje da el resultado del ejercicio. Un requisito de dispositivo tiene prioridad sobre el lenguaje del resto del proyecto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿En qué lenguaje hago este agente?
lenguaje: js
pide: Completa `lenguajeDelAgente(p)`. `p` dice dónde vive y qué hace el agente. Reglas, en este orden: si `p.dentroDelTelefono` es `true` → `'Kotlin o Swift'`; si `p.analizaDatos` es `true` → `'Python'`; si `p.proyecto` es `'node'` o `'web'` → `'TypeScript'`; en cualquier otro caso → `'Python'`.
--- código
function lenguajeDelAgente(p) {
  // tu código aquí
}
--- pruebas
prueba('el asistente de Copiloto vive en el servidor de Node', () => igual(lenguajeDelAgente({ proyecto: 'node' }), 'TypeScript'));
prueba('un agente que lee planillas', () => igual(lenguajeDelAgente({ proyecto: 'node', analizaDatos: true }), 'Python'));
prueba('con el modelo del teléfono', () => igual(lenguajeDelAgente({ proyecto: 'web', dentroDelTelefono: true }), 'Kotlin o Swift'));
prueba('un proyecto nuevo para aprender', () => igual(lenguajeDelAgente({ proyecto: 'nuevo' }), 'Python'));
--- solución
function lenguajeDelAgente(p) {
  if (p.dentroDelTelefono) return 'Kotlin o Swift';
  if (p.analizaDatos) return 'Python';
  if (p.proyecto === 'node' || p.proyecto === 'web') return 'TypeScript';
  return 'Python';
}
```

```practica
vf :: Un agente de IA solo se puede hacer en Python
elige :: ¿Cuál es la razón principal por la que se recomienda Python para IA? :: Es el lenguaje más rápido :: Las librerías, los frameworks, los ejemplos y los trabajos de IA están casi todos en Python :: Hace que el modelo responda mejor
vf :: Como Python es más lento, un agente en Python se nota mucho más lento que uno en TypeScript
vf :: El mismo modelo con las mismas instrucciones responde lo mismo desde Python o desde TypeScript
elige :: Tu app web y tu servidor ya están en TypeScript y quieres agregar un asistente. ¿Qué conviene? :: Escribir un servidor nuevo en Python solo para el asistente :: Hacerlo en TypeScript, dentro del mismo proyecto :: Hacerlo en Swift
escribe :: Un entrevistador te pregunta: "¿Por qué hiciste el asistente en TypeScript y no en Python?". ¿Qué respondes? :: Porque el asistente vive en el mismo servidor de la app, que ya está en TypeScript: un solo lenguaje, los mismos tipos y nada extra que mantener. Python es lo más usado en IA por sus librerías y ejemplos, y lo sé leer, pero el ciclo del agente, las herramientas y los frenos son iguales en los dos.
```
