# Agentes 2: los cinco patrones principales

> 🎙️ **El profesor dice:** ya sabes qué es un agente. Ahora, las cinco formas de armarlo que más se usan: herramientas (ReAct), planificación, reflexión, enrutamiento y varios agentes juntos. Cada una con su código en JavaScript y en Python.

> 📌 **Nota:** esta clase es parte del curso **Agentes de IA**, que tiene su propio certificado. Está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), explicada en español con mis palabras; los números (2.1, 4.3…) son los mismos de la guía.

## 2.1 Uso de herramientas / ReAct

> 🎙️ **El profesor:** estos cinco patrones son el corazón de la clase. Si en una entrevista solo puedes explicar una parte, que sea esta. Léelos de a uno por día: ReAct, planificación, reflexión, enrutamiento y multiagente.

> 🌎 **En la vida real:** Son como las cinco jugadas básicas del fútbol (pase, tiro, regate, marca y contraataque): con ellas se arma casi cualquier partido.

> 🌎 **Otro ejemplo:** Son como los cinco cortes básicos de un carnicero: con ellos se prepara casi todo lo que pide un cliente.

Estos cinco patrones cubren **la mayoría** de los sistemas de agentes en producción. Apréndelos a fondo. Para cada uno: cómo funciona, un esqueleto de código, dónde se rompe, cómo hablar de él en una entrevista y un ejercicio.

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

> ✋ **Para y piensa:** un agente ReAct llama 15 veces seguidas a `buscar_web` con la misma consulta. ¿Qué falla es y cómo se arregla?

<details>
<summary>Ver la respuesta</summary>

Es un **ciclo infinito**. Se arregla con un **máximo de pasos**, **detectando llamadas repetidas** con los mismos datos y diciéndole al modelo que cambie de estrategia.

</details>

## 2.2 Planificación

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

## 2.3 Reflexión / crítico

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

## 2.4 Enrutamiento

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

## 2.5 Multiagente / supervisor y trabajadores

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

## ✍️ Práctica: los cinco patrones

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

```practica
escribe :: Explica el ciclo ReAct en tus palabras. :: El modelo razona qué hacer, actúa llamando una herramienta, observa el resultado, actualiza el contexto y repite, hasta responder sin pedir herramientas.
elige :: ¿Por qué ReAct le gana a solo "pensar en voz alta" (chain-of-thought)? :: Porque es más corto :: Porque apoya cada paso en un resultado real de una herramienta, en vez de acumular alucinaciones :: Porque no usa modelo
elige :: Una herramienta revienta con un error. ¿Qué es mejor? :: Que se corte todo el ciclo :: Que devuelva un error ordenado al modelo para que se recupere :: Ocultar el error
elige :: En planificación, ¿qué es el plan? :: Un párrafo :: Una estructura de datos con pasos y su estado :: Un dibujo
elige :: ¿Qué es lo que se usa en producción entre planificar y ReAct? :: Solo ReAct :: Solo planificar :: Un híbrido: planificar, ejecutar cada paso con un ReAct corto y replanificar en puntos de control
elige :: En reflexión, ¿cuál es el crítico más confiable? :: El mismo modelo con el mismo prompt :: Uno determinístico, como pruebas automáticas o un validador :: Ninguno
elige :: ¿Cómo se llama el ciclo de reflexión en las discusiones de arquitectura? :: Supervisor-trabajador :: Evaluador-optimizador :: ReWOO
elige :: En enrutamiento, con poca confianza, ¿qué se hace? :: Se manda a cualquier especialista :: Se hace una pregunta para aclarar :: Se cancela
elige :: ¿Por qué el enrutamiento ayuda con el costo? :: Porque no usa modelos :: Porque manda lo simple a un modelo chico y deja el caro para lo difícil :: Porque es gratis
elige :: En multiagente, ¿con quién hablan los trabajadores? :: Entre ellos :: Solo con el supervisor :: Con el usuario
elige :: Según Anthropic, ¿cuántos tokens usa más o menos un sistema multiagente comparado con un chat? :: El doble :: 4 veces :: Unas 15 veces
vf :: En multiagente, los trabajadores deben devolver pruebas (fuentes, resultados), no solo conclusiones
vf :: Un crítico que aprueba todo es un buen crítico
elige :: En Python, ¿qué es el equivalente de `Promise.all`? :: `asyncio.run` :: `asyncio.gather` :: `await all`
```
