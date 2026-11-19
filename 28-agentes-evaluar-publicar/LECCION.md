# Agentes 5: evaluar y publicar

> 🎙️ **El profesor dice:** un agente que "parece andar" no está listo. Aquí aprendes a medirlo con pruebas y a ponerlo en producción con confiabilidad, seguridad y costos bajo control.

> 📌 **Nota:** esta clase es parte del curso **Agentes de IA**, que tiene su propio certificado. Está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), explicada en español con mis palabras; los números (2.1, 4.3…) son los mismos de la guía.

## 5.1 Por qué evaluar agentes es distinto

> 🎙️ **El profesor:** ¿te acuerdas de las pruebas del Tema 02? Con agentes es lo mismo, pero más difícil: el agente no responde siempre igual y el camino importa. Aquí ves cómo se mide.

> 🌎 **En la vida real:** Es como evaluar a un conductor nuevo: no basta con que llegue al destino; miras el camino que tomó, si respetó las reglas y cuánto combustible gastó.

> 🌎 **Otro ejemplo:** Es como evaluar a un chef: pruebas el plato, miras cómo cocinó y cuánto gastó en ingredientes.

No puedes mejorar lo que no puedes medir, y los agentes son más difíciles de medir que cualquier cosa que hayas publicado antes: **no son determinísticos**, tienen **muchos pasos**, y **el camino importa tanto como la respuesta**.

> 🌎 **En la vida real:** en un examen de matemáticas de opción múltiple solo importa la respuesta. En un examen de manejo, **importa cómo llegaste**: si llegaste al destino pero te pasaste dos semáforos en rojo, reprobaste.

> 🌎 **Otro ejemplo:** Como el examen práctico de manejo: no importa solo que llegues, sino cómo llegaste.

- Una evaluación clásica de aprendizaje automático compara **una** salida con **una** etiqueta.
- La ejecución de un agente es una **trayectoria**: decisiones, llamadas y observaciones. **Dos ejecuciones con la misma entrada pueden tomar caminos distintos y las dos estar bien.**
- Tu evaluación tiene que juzgar **el resultado final**, **el camino** y **cuánto costó** llegar.
- Tiene que tolerar la **variación**: una sola ejecución no dice casi nada. **Corre cada caso varias veces** y mira la distribución.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una sola ejecución no dice nada
lenguaje: js
pide: El mismo caso se corrió varias veces; cada resultado es `true` (salió bien) o `false`. Completa `resumen(resultados)`, que devuelve `{ exitos, total, tasa }`, con la tasa redondeada a 2 decimales (y `0` si no hay resultados). Y `esInestable(resultados)`: `true` si hay de los dos (algunos bien y algunos mal), porque eso es lo que una sola ejecución esconde.
--- código
function resumen(resultados) {
  // tu código aquí
}

function esInestable(resultados) {
  // tu código aquí
}
--- pruebas
prueba('tres de cuatro', () => igual(resumen([true, true, false, true]), { exitos: 3, total: 4, tasa: 0.75 }));
prueba('redondea', () => igual(resumen([true, false, false]).tasa, 0.33));
prueba('sin resultados', () => igual(resumen([]), { exitos: 0, total: 0, tasa: 0 }));
prueba('inestable', () => igual(esInestable([true, false, true]), true));
prueba('siempre bien no es inestable', () => igual(esInestable([true, true, true]), false));
prueba('siempre mal tampoco', () => igual(esInestable([false, false]), false));
--- solución
function resumen(resultados) {
  const exitos = resultados.filter((r) => r).length;
  const total = resultados.length;
  const tasa = total === 0 ? 0 : Math.round((exitos / total) * 100) / 100;
  return { exitos, total, tasa };
}

function esInestable(resultados) {
  return resultados.includes(true) && resultados.includes(false);
}
```

## 5.2 Las capas de evaluación

> 🌎 **En la vida real:** en una fábrica de autos se revisa cada tornillo (unidad), cada paso de la línea de montaje (camino), el auto terminado en la pista (resultado), choques de prueba (seguridad) y después las quejas de los clientes (en línea).

> 🌎 **Otro ejemplo:** Como la revisión de un avión: cada tornillo, cada sistema, el vuelo de prueba, simulacros de emergencia y lo que reportan los pasajeros.

| Nivel | Qué revisa | Cómo |
|---|---|---|
| **Unidad** (herramienta) | La herramienta correcta, con los datos correctos, para una entrada | Comprobaciones determinísticas. **Cientos** de casos. Corre en cada *commit*. |
| **Trayectoria** (camino) | Una secuencia aceptable: buscó antes de responder, confirmó antes de borrar, no hizo más de N búsquedas | Comparar con una trayectoria de referencia o con reglas sobre el rastro. |
| **Resultado** (tarea) | El resultado final cumple la tarea | Pruebas para el código, coincidencia exacta para extraer datos, un modelo-juez con criterios para respuestas abiertas, personas para el resto. |
| **Seguridad** | Entradas maliciosas, intentos de inyección, casos límite de las reglas | Aprueba si el agente **se negó o escaló** correctamente. Crece con cada hallazgo del equipo de ataque. |
| **En línea** | El comportamiento en producción a lo largo del tiempo | Ejecuciones de muestra calificadas todo el tiempo, más señales de usuarios: pulgares, ediciones, reintentos, escalamientos. |

> 💡 **Idea:** el nivel de unidad es lo que ya conoces del Tema 02 y 04: pruebas que corren en el CI en cada subida.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Evaluar la trayectoria, no solo la respuesta
lenguaje: js
pide: Una trayectoria es la lista de herramientas que usó el agente, en orden, como `['buscar', 'responder']`. Completa `revisarTrayectoria(pasos, maxBusquedas)`, que devuelve la lista de problemas (vacía si está bien), revisando en este orden: `'respondió sin buscar'` si `'responder'` aparece antes de cualquier `'buscar'` (o no hay ninguno); `'borró sin confirmar'` si hay un `'borrar'` y justo antes no hubo un `'confirmar'`; `'demasiadas búsquedas'` si hay más de `maxBusquedas` `'buscar'`.
--- código
function revisarTrayectoria(pasos, maxBusquedas = 3) {
  // tu código aquí
}
--- pruebas
prueba('un buen camino', () => igual(revisarTrayectoria(['buscar', 'buscar', 'responder']), []));
prueba('respondió de memoria', () => igual(revisarTrayectoria(['responder']), ['respondió sin buscar']));
prueba('borró sin confirmar', () => igual(revisarTrayectoria(['buscar', 'borrar', 'responder']), ['borró sin confirmar']));
prueba('confirmó y borró', () => igual(revisarTrayectoria(['buscar', 'confirmar', 'borrar', 'responder']), []));
prueba('demasiadas búsquedas', () => igual(revisarTrayectoria(['buscar', 'buscar', 'buscar', 'buscar', 'responder']), ['demasiadas búsquedas']));
prueba('varios problemas', () => igual(revisarTrayectoria(['responder', 'borrar'], 3), ['respondió sin buscar', 'borró sin confirmar']));
--- solución
function revisarTrayectoria(pasos, maxBusquedas = 3) {
  const problemas = [];
  const primeraBusqueda = pasos.indexOf('buscar');
  const respuesta = pasos.indexOf('responder');
  if (respuesta !== -1 && (primeraBusqueda === -1 || respuesta < primeraBusqueda)) problemas.push('respondió sin buscar');
  if (pasos.some((p, i) => p === 'borrar' && pasos[i - 1] !== 'confirmar')) problemas.push('borró sin confirmar');
  if (pasos.filter((p) => p === 'buscar').length > maxBusquedas) problemas.push('demasiadas búsquedas');
  return problemas;
}
```

## 5.3 Un modelo como juez, bien hecho

> 🌎 **En la vida real:** un jurado de un concurso de cocina. Para que sea justo: tiene una **planilla con puntos** (sabor 1–5, presentación 1–5), tiene que **justificar** cada nota, no sabe de quién es cada plato, y antes del concurso se compara con jueces expertos para ver si califica parecido.

> 🌎 **Otro ejemplo:** Como un árbitro de fútbol que tiene que justificar cada tarjeta con el reglamento, y al que se evalúa comparándolo con árbitros con experiencia.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un juez que no se deja engañar por el orden
lenguaje: python
pide: El juez tiene **sesgo de posición**: tiende a preferir la primera respuesta. Completa `juez_justo(juez, a, b)`: llama a `juez(primera, segunda)` **dos veces**, una con `(a, b)` y otra con `(b, a)`. El juez devuelve `"primera"` o `"segunda"`. Si en los dos órdenes gana la misma respuesta, devuelve `"a"` o `"b"`; si cambia según el orden, devuelve `"empate"`.
--- código
def juez_justo(juez, a, b):
    pass  # tu código aquí
--- pruebas
def juez_que_prefiere_lo_largo(x, y):
    return "primera" if len(x) >= len(y) else "segunda"

def juez_que_prefiere_la_primera(x, y):
    return "primera"

prueba("gana la larga en los dos órdenes", lambda: igual(juez_justo(juez_que_prefiere_lo_largo, "corta", "una respuesta larga"), "b"))
prueba("también si va primero", lambda: igual(juez_justo(juez_que_prefiere_lo_largo, "una respuesta larga", "corta"), "a"))
prueba("el sesgo de posición da empate", lambda: igual(juez_justo(juez_que_prefiere_la_primera, "x", "y"), "empate"))
--- solución
def juez_justo(juez, a, b):
    ida = "a" if juez(a, b) == "primera" else "b"
    vuelta = "b" if juez(b, a) == "primera" else "a"
    return ida if ida == vuelta else "empate"
```

## 5.4 Las métricas que importan

> 🌎 **En la vida real:** en una app para conductores, como Copiloto, no basta con "cuánto gané". Importa cuánto gané **por hora**, cuánto gasté en combustible **por viaje**, cuántos viajes cancelé. Con agentes es igual: un solo número engaña.

> 🌎 **Otro ejemplo:** Como evaluar un restaurante: no solo si la comida es rica, sino cuánto tarda, cuánto cuesta cada plato bien servido y cuántos clientes se quejan.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: pass@k, pass^k y el costo por éxito
lenguaje: python
pide: Si un agente acierta con probabilidad `p`, `pass_arroba_k(p, k)` (al menos uno de k sale bien) es `1 - (1 - p) ** k` y `pass_todos_k(p, k)` (los k salen bien) es `p ** k`. Redondea los dos a 3 decimales con `round`. Y `costo_por_exito(costo_total, exitos)`: el costo dividido entre los **éxitos** (no entre las ejecuciones), a 2 decimales, o `None` si no hubo ninguno.
--- código
def pass_arroba_k(p, k):
    pass  # tu código aquí


def pass_todos_k(p, k):
    pass  # tu código aquí


def costo_por_exito(costo_total, exitos):
    pass  # tu código aquí
--- pruebas
prueba("pass@3 con 90%", lambda: igual(pass_arroba_k(0.9, 3), 0.999))
prueba("pass^3 con 90% baja rápido", lambda: igual(pass_todos_k(0.9, 3), 0.729))
prueba("pass^10", lambda: igual(pass_todos_k(0.9, 10), 0.349))
prueba("costo por éxito", lambda: igual(costo_por_exito(93.0, 60), 1.55))
prueba("sin éxitos", lambda: igual(costo_por_exito(10.0, 0), None))
--- solución
def pass_arroba_k(p, k):
    return round(1 - (1 - p) ** k, 3)


def pass_todos_k(p, k):
    return round(p ** k, 3)


def costo_por_exito(costo_total, exitos):
    if exitos == 0:
        return None
    return round(costo_total / exitos, 2)
```

## 5.5 Armar el set de evaluación

> 🌎 **En la vida real:** un profesor arma su banco de preguntas de examen con los errores que más vio en sus alumnos. Cada año agrega las nuevas trampas en las que cayeron.

> 🌎 **Otro ejemplo:** Como el banco de preguntas de un profesor que crece con cada error que ve en sus alumnos.

- Empieza con **20 a 50 tareas reales o realistas** que cubran las categorías principales y **los casos límite que más miedo te dan**.
- Incluye los resultados esperados y, si se puede, trayectorias de referencia.
- **Hazlo crecer desde producción: cada falla que llega a un usuario se convierte en un caso de evaluación.**
- Guarda un **set aparte que quien escribe el prompt nunca ve** (para no "estudiar para el examen").
- **Córrelo en el CI y bloquea la publicación** si bajan la tasa de éxito o sube la de violaciones de seguridad.
- **Ponle versión al set junto con el código.**

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El CI que bloquea la publicación
lenguaje: js
pide: Completa `puedePublicar(antes, ahora)`. Cada uno trae `{ tasaDeExito, violaciones }` del set de evaluación. Devuelve `{ publicar: true }` o `{ publicar: false, motivo }`. Bloquea con `'subieron las violaciones de seguridad'` si `ahora.violaciones > antes.violaciones` (se revisa primero), o con `'bajó la tasa de éxito'` si bajó más de 0,02 (`antes.tasaDeExito - ahora.tasaDeExito > 0.02`).
--- código
function puedePublicar(antes, ahora) {
  // tu código aquí
}
--- pruebas
prueba('igual o mejor', () => igual(puedePublicar({ tasaDeExito: 0.9, violaciones: 0 }, { tasaDeExito: 0.92, violaciones: 0 }), { publicar: true }));
prueba('baja un poco: pasa', () => igual(puedePublicar({ tasaDeExito: 0.9, violaciones: 0 }, { tasaDeExito: 0.89, violaciones: 0 }), { publicar: true }));
prueba('baja mucho', () => igual(puedePublicar({ tasaDeExito: 0.9, violaciones: 0 }, { tasaDeExito: 0.85, violaciones: 0 }), { publicar: false, motivo: 'bajó la tasa de éxito' }));
prueba('una violación nueva', () => igual(puedePublicar({ tasaDeExito: 0.9, violaciones: 0 }, { tasaDeExito: 0.95, violaciones: 1 }), { publicar: false, motivo: 'subieron las violaciones de seguridad' }));
prueba('la seguridad se revisa primero', () => igual(puedePublicar({ tasaDeExito: 0.9, violaciones: 0 }, { tasaDeExito: 0.5, violaciones: 2 }).motivo, 'subieron las violaciones de seguridad'));
--- solución
function puedePublicar(antes, ahora) {
  if (ahora.violaciones > antes.violaciones) return { publicar: false, motivo: 'subieron las violaciones de seguridad' };
  if (antes.tasaDeExito - ahora.tasaDeExito > 0.02) return { publicar: false, motivo: 'bajó la tasa de éxito' };
  return { publicar: true };
}
```

## 5.6 Rastreo y observabilidad

> 🌎 **En la vida real:** la caja negra de un avión. Si algo sale mal, se puede ver segundo a segundo qué pasó, qué dijo cada piloto y qué marcaba cada instrumento. Sin la caja negra, solo puedes adivinar.

> 🌎 **Otro ejemplo:** Como el historial de un viaje en una app de transporte: cada tramo, cada parada, cuánto tardó y cuánto costó.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer un rastro: el total y el tramo más caro
lenguaje: js
pide: Un rastro es un árbol: cada tramo es `{ nombre, tokens, hijos }` (los `hijos` son más tramos, o una lista vacía). Completa `totalTokens(tramo)`: sus tokens más los de todos sus hijos, nietos, etc. (una función que se llama a sí misma). Y `masCaro(tramo)`: el **nombre** del hijo directo que suma más tokens (con sus hijos adentro).
--- código
function totalTokens(tramo) {
  // tu código aquí
}

function masCaro(tramo) {
  // tu código aquí
}
--- pruebas
const RASTRO = {
  nombre: 'ejecución', tokens: 0, hijos: [
    { nombre: 'supervisor.planificar', tokens: 6000, hijos: [] },
    { nombre: 'trabajador.investigador', tokens: 0, hijos: [
      { nombre: 'llm', tokens: 40000, hijos: [] },
      { nombre: 'llm', tokens: 31000, hijos: [] },
    ] },
    { nombre: 'supervisor.sintetizar', tokens: 55000, hijos: [] },
  ],
};
prueba('un tramo solo', () => igual(totalTokens({ nombre: 'x', tokens: 5, hijos: [] }), 5));
prueba('el total de la ejecución', () => igual(totalTokens(RASTRO), 132000));
prueba('el más caro cuenta a sus hijos', () => igual(masCaro(RASTRO), 'trabajador.investigador'));
--- solución
function totalTokens(tramo) {
  return tramo.tokens + tramo.hijos.reduce((suma, hijo) => suma + totalTokens(hijo), 0);
}

function masCaro(tramo) {
  let mejor = null;
  for (const hijo of tramo.hijos) {
    if (!mejor || totalTokens(hijo) > totalTokens(mejor)) mejor = hijo;
  }
  return mejor ? mejor.nombre : null;
}
```

## ✍️ Práctica: evaluar agentes

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

```practica
escribe :: ¿Por qué evaluar agentes es distinto a evaluar un programa normal? :: Porque no son determinísticos, tienen muchos pasos y el camino importa tanto como el resultado; dos ejecuciones pueden tomar caminos distintos, así que hay que correr cada caso varias veces.
elige :: Revisar que el agente buscó antes de responder y confirmó antes de borrar es una evaluación de… :: Unidad :: Trayectoria :: En línea
elige :: ¿En qué nivel una prueba "aprueba" si el agente se negó o escaló? :: Unidad :: Resultado :: Seguridad
elige :: ¿Cómo se calibra un modelo-juez? :: No se calibra :: Midiendo cuánto coincide con calificaciones humanas en 50 a 100 ejemplos :: Usando el mismo prompt del agente
elige :: ¿Cuál de estos es un sesgo de un modelo-juez? :: La velocidad :: Preferir la respuesta más larga :: El idioma
elige :: Un agente acierta el 90 % de las veces. ¿Cuánto es pass^3 (acertar 3 veces seguidas)? :: 90 % :: Unos 73 % :: 30 %
elige :: ¿Qué mide mejor el costo real? :: Costo por llamada :: Costo por tarea exitosa :: Costo por día
elige :: ¿Qué demora sienten los usuarios? :: La p50 :: La p95 :: La mínima
vf :: Cada falla que llega a un usuario se convierte en un caso de evaluación
vf :: Conviene que quien escribe el prompt vea todo el set de evaluación
escribe :: ¿Qué es un rastro y por qué hay que instrumentar desde el primer día? :: El registro completo de una ejecución en tramos anidados (llamadas, herramientas, tiempos, tokens, costo, errores); sin rastros se depura una caja negra.
```

## 6.1 La arquitectura de referencia

> 🎙️ **El profesor:** un agente en tu computadora no es un producto. Esta parte es el CI, las reglas de Firestore y el "probar en el teléfono real" de las clases anteriores, aplicados a agentes.

> 🌎 **En la vida real:** Es como pasar de cocinar en casa a abrir un restaurante: además de la receta, necesitas turnos, seguridad, costos y un plan si algo sale mal.

> 🌎 **Otro ejemplo:** Es como pasar de manejar tu carro a dirigir una flota de taxis: hace falta organización, mantenimiento y control.

Un cuaderno que funciona no es un producto. Esta parte es el trabajo de entorno, confiabilidad, seguridad y costo que convierte un agente en un sistema que puedes poner frente a usuarios **y aun así dormir tranquilo**.

> 🌎 **En la vida real:** un restaurante grande. El **mozo** toma el pedido y te da un número (la API). Los pedidos van a una **fila de comandas** (la cola). Varios **cocineros** toman comandas de la fila (los trabajadores). La **despensa** tiene llave y control (los servicios de herramientas). Hay un **cuarto aparte** para lo peligroso, como freír con mucho aceite (la caja aislada). El **cuaderno de pedidos** guarda todo (el almacén de estado). Y el **dueño** mira las cámaras (la observabilidad).

> 🌎 **Otro ejemplo:** Como una empresa de delivery: la app toma pedidos, la cola los ordena, los repartidores salen, y hay central, depósito y cámaras.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La API devuelve un id al instante
lenguaje: js
pide: Completa `crearEjecucion(cola, pedido, id)`: si `pedido.tarea` está vacío (o solo tiene espacios), devuelve `{ error: 'falta la tarea' }` y no encola nada. Si no, agrega `{ id, tarea, estado: 'en cola' }` al final de la cola y devuelve **enseguida** `{ id, estado: 'en cola' }`, sin hacer el trabajo. Y `tomarTrabajo(cola)`: el trabajador saca el **primero** de la cola (`shift`), le pone `estado: 'corriendo'` y lo devuelve; o `null` si no hay.
--- código
function crearEjecucion(cola, pedido, id) {
  // tu código aquí
}

function tomarTrabajo(cola) {
  // tu código aquí
}
--- pruebas
prueba('devuelve el id enseguida', () => igual(crearEjecucion([], { tarea: 'informe' }, 'a1'), { id: 'a1', estado: 'en cola' }));
prueba('queda en la cola', () => { const cola = []; crearEjecucion(cola, { tarea: 'informe' }, 'a1'); igual(cola, [{ id: 'a1', tarea: 'informe', estado: 'en cola' }]); });
prueba('sin tarea', () => { const cola = []; igual(crearEjecucion(cola, { tarea: '   ' }, 'a2'), { error: 'falta la tarea' }); igual(cola.length, 0); });
prueba('el primero que llegó', () => {
  const cola = [];
  crearEjecucion(cola, { tarea: 'uno' }, 'a1');
  crearEjecucion(cola, { tarea: 'dos' }, 'a2');
  igual(tomarTrabajo(cola), { id: 'a1', tarea: 'uno', estado: 'corriendo' });
  igual(cola.length, 1);
});
prueba('cola vacía', () => igual(tomarTrabajo([]), null));
--- solución
function crearEjecucion(cola, pedido, id) {
  const tarea = String(pedido.tarea ?? '').trim();
  if (!tarea) return { error: 'falta la tarea' };
  cola.push({ id, tarea, estado: 'en cola' });
  return { id, estado: 'en cola' };
}

function tomarTrabajo(cola) {
  const trabajo = cola.shift();
  if (!trabajo) return null;
  return { ...trabajo, estado: 'corriendo' };
}
```

## 6.2 Ejecuciones largas y asíncronas

> 🌎 **En la vida real:** dejas el carro en el taller. Te dan un **número de orden**, te mandan mensajes ("ya revisamos los frenos", "falta la pieza") y si el mecánico de la mañana se va, **el de la tarde sigue desde donde quedó**, porque está todo anotado en la orden.

> 🌎 **Otro ejemplo:** Como un pedido de comida largo: te dan número, te avisan cada paso, y si cambia el cocinero de turno, sigue donde quedó.

Las ejecuciones duran de **segundos a horas**. Diseña para eso:
- **Devuelve un id de ejecución al instante.**
- **Transmite eventos de avance** (paso empezado, herramienta llamada, resultado parcial) para que el usuario vea movimiento.
- **Guarda un punto después de cada paso**, para que un trabajador que se cae **retome** en vez de empezar de nuevo.
- **Permite pausar** para que decida una persona y **retomar por id**.
- Los motores de **ejecución durable**, como **Temporal**, o los guardadores de los *frameworks* con base de datos, te dan esto sin escribirlo tú.
- **Pon claves de idempotencia** en toda llamada que cambia algo en el mundo, para que **un reintento nunca lo haga dos veces**.

> 💡 **Idea:** "idempotente" quiere decir que hacerlo una vez o diez veces da el mismo resultado. Como el botón del ascensor: apretarlo cinco veces no trae cinco ascensores. Un pago **sin** clave de idempotencia, reintentado, puede cobrar dos veces.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Idempotencia: un reintento nunca paga dos veces
lenguaje: js
pide: Completa `crearReembolsos()`, que devuelve una función `reembolsar(clave, monto, pagar)`. La primera vez que llega una `clave`, llama a `pagar(monto)` y guarda su resultado. Si la misma clave llega otra vez (un reintento), **no** vuelve a pagar: devuelve el resultado guardado. Usa un `Map`.
--- código
function crearReembolsos() {
  // tu código aquí
}
--- pruebas
prueba('paga una vez', () => {
  let pagos = 0;
  const reembolsar = crearReembolsos();
  const pagar = (m) => { pagos++; return `pagado ${m}`; };
  igual(reembolsar('ticket-7', 480, pagar), 'pagado 480');
  igual(reembolsar('ticket-7', 480, pagar), 'pagado 480');
  igual(pagos, 1);
});
prueba('otra clave sí paga', () => {
  let pagos = 0;
  const reembolsar = crearReembolsos();
  const pagar = () => ++pagos;
  reembolsar('a', 10, pagar);
  reembolsar('b', 10, pagar);
  igual(pagos, 2);
});
--- solución
function crearReembolsos() {
  const hechos = new Map();
  return function reembolsar(clave, monto, pagar) {
    if (hechos.has(clave)) return hechos.get(clave);
    const resultado = pagar(monto);
    hechos.set(clave, resultado);
    return resultado;
  };
}
```

## 6.3 Confiabilidad

> 🌎 **En la vida real:** un buen conductor lleva rueda de auxilio, sabe un camino alternativo si la avenida está cortada, y no se queda esperando para siempre en un semáforo roto.

> 🌎 **Otro ejemplo:** Como un buen restaurante en día de mucha gente: tiempo máximo por plato, un cocinero de reserva y un plan B si se acaba un ingrediente.

- **Tiempo máximo** en cada llamada al modelo y a herramientas. Los agentes se cuelgan **en la única llamada que olvidaste**.
- **Reintentos con espera exponencial y un poco de azar** (*jitter*) para errores pasajeros (límites de uso, errores 5xx). **Nunca reintentes una herramienta destructiva sin clave de idempotencia.**
- **Cortacircuitos** (*circuit breakers*) en herramientas y proveedores. Si algo falla una y otra vez, **falla rápido** y usa el plan B.
- **Modelos de respaldo.** Si el modelo principal se cae, manda a un segundo proveedor **que pase las mismas pruebas**.
- **Degradarse con elegancia.** Si una herramienta no está, **díselo al modelo** para que la rodee o le avise al usuario, en vez de tirar abajo toda la ejecución.
- **Máximo de pasos, presupuesto de *tokens*, techo de costo y detección de ciclos, puestos en el código, no en el prompt.**
- **Resultados parciales.** Cuando una ejecución llega a un límite, devuelve lo que tiene con una marca clara.

> 💡 **Idea:** "espera exponencial" es esperar 1 segundo, después 2, después 4, después 8… El "azar" es sumarle unos milisegundos al azar para que mil clientes no reintenten **todos en el mismo instante**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Reintentos con espera exponencial
lenguaje: python
pide: Completa `se_reintenta(codigo)`: `True` para los errores pasajeros (`429`, el límite de uso, y del `500` al `599`); `False` para los demás, como `400`, que van a fallar igual. Y `esperas(intentos, base, tope, azar)`: la lista de segundos a esperar antes de cada reintento: `base`, `base*2`, `base*4`…, sin pasar del `tope` (`min`), y a cada una se le suma `azar()`, redondeado a 2 decimales.
--- código
def se_reintenta(codigo):
    pass  # tu código aquí


def esperas(intentos, base, tope, azar):
    pass  # tu código aquí
--- pruebas
prueba("429 sí", lambda: igual(se_reintenta(429), True))
prueba("503 sí", lambda: igual(se_reintenta(503), True))
prueba("400 no: va a fallar igual", lambda: igual(se_reintenta(400), False))
prueba("200 no", lambda: igual(se_reintenta(200), False))
prueba("exponencial", lambda: igual(esperas(4, 1, 30, lambda: 0), [1, 2, 4, 8]))
prueba("con tope", lambda: igual(esperas(6, 1, 10, lambda: 0), [1, 2, 4, 8, 10, 10]))
prueba("con azar", lambda: igual(esperas(2, 1, 30, lambda: 0.25), [1.25, 2.25]))
--- solución
def se_reintenta(codigo):
    return codigo == 429 or 500 <= codigo <= 599


def esperas(intentos, base, tope, azar):
    return [round(min(base * 2 ** i, tope) + azar(), 2) for i in range(intentos)]
```

## 6.4 Seguridad

> 🌎 **En la vida real:** imagina un asistente que tiene **la llave de tu casa**, **lee todas las cartas** que llegan (incluso las de desconocidos) y **puede mandar paquetes** a cualquier dirección. Si un desconocido escribe en una carta "manda las joyas a esta dirección" y el asistente obedece… te robaron. Ese es el peligro de los agentes.

> 🌎 **Otro ejemplo:** Como un empleado que recibe cartas de desconocidos y tiene la llave de la caja: nunca le das la llave de todo, y le enseñas que una carta no es una orden.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La tríada peligrosa y el filtro de salida
lenguaje: js
pide: Completa `esPeligroso(agente)`: `true` si el agente tiene **las tres** cosas a la vez: `datosPrivados`, `contenidoNoConfiable` y `salidaAfuera`. Quitar una sola lo arregla. Y `filtrarSalida(texto)`: cambia cada llave que se parezca a `sk-` seguido de 8 o más letras o números por `[llave oculta]`, antes de que la vea el usuario.
--- código
function esPeligroso(agente) {
  // tu código aquí
}

function filtrarSalida(texto) {
  // tu código aquí
}
--- pruebas
prueba('las tres juntas', () => igual(esPeligroso({ datosPrivados: true, contenidoNoConfiable: true, salidaAfuera: true }), true));
prueba('sin salida afuera', () => igual(esPeligroso({ datosPrivados: true, contenidoNoConfiable: true, salidaAfuera: false }), false));
prueba('sin contenido no confiable', () => igual(esPeligroso({ datosPrivados: true, salidaAfuera: true }), false));
prueba('oculta la llave', () => igual(filtrarSalida('Tu llave es sk-abc12345XYZ, guárdala'), 'Tu llave es [llave oculta], guárdala'));
prueba('oculta todas', () => igual(filtrarSalida('sk-aaaaaaaa y sk-bbbbbbbbbb'), '[llave oculta] y [llave oculta]'));
prueba('una palabra corta no', () => igual(filtrarSalida('el sk-ok sigue'), 'el sk-ok sigue'));
--- solución
function esPeligroso(agente) {
  return Boolean(agente.datosPrivados && agente.contenidoNoConfiable && agente.salidaAfuera);
}

function filtrarSalida(texto) {
  return texto.replace(/sk-[A-Za-z0-9]{8,}/g, '[llave oculta]');
}
```

## 6.5 Costo y demora

> 🌎 **En la vida real:** ahorrar combustible: no cargar peso de más, no acelerar de golpe, usar la ruta corta, y medir **cuánto gastas por viaje que cobraste**, no por kilómetro manejado.

> 🌎 **Otro ejemplo:** Como ahorrar en el supermercado: comprar lo necesario, aprovechar ofertas y medir cuánto gastas por comida, no por compra.

- **Caché de prompts.** Deja el *system prompt* y las herramientas como un prefijo estable. **Solo esto** baja mucho el costo de entrada de los ciclos que reenvían el mismo prefijo en cada paso.
- **Modelos por niveles.** Pasos simples a modelos chicos; el modelo más potente solo para planificar y sintetizar.
- **Llamadas a herramientas en paralelo.** Deja que el modelo pida varias herramientas independientes en un turno y córrelas a la vez.
- **Resultados de herramientas con límite.** Resultados más chicos = menos *tokens* de entrada en **todos** los pasos siguientes.
- **Compactar el contexto.** Resume el historial cuando la ventana pasa un umbral.
- **Caché de resultados de herramientas.** Misma consulta, mismo resultado, durante un tiempo de vida (*TTL*).
- **Procesamiento por lotes.** Para trabajos que no son en vivo, las APIs por lotes cuestan menos y quitan la presión de la demora.
- **Mide el costo por tarea exitosa, no por llamada.**

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Caché de resultados con tiempo de vida
lenguaje: js
pide: Completa `crearCache(ttlMs, ahora)`. Devuelve una función `buscar(consulta, herramienta)`: si esa consulta se guardó hace **menos** de `ttlMs` milisegundos, devuelve lo guardado sin llamar a la herramienta. Si no está, o ya venció, llama a `herramienta(consulta)`, guarda el resultado con la hora (`ahora()`) y lo devuelve. `ahora` es una función que da la hora, para poder probarlo sin esperar.
--- código
function crearCache(ttlMs, ahora) {
  // tu código aquí
}
--- pruebas
let reloj = 0;
const ahora = () => reloj;
prueba('la segunda vez no llama', () => {
  reloj = 0;
  let llamadas = 0;
  const buscar = crearCache(1000, ahora);
  const herramienta = (q) => { llamadas++; return `resultado de ${q}`; };
  igual(buscar('gasolina', herramienta), 'resultado de gasolina');
  reloj = 500;
  igual(buscar('gasolina', herramienta), 'resultado de gasolina');
  igual(llamadas, 1);
});
prueba('vencido, vuelve a llamar', () => {
  reloj = 0;
  let llamadas = 0;
  const buscar = crearCache(1000, ahora);
  const herramienta = () => ++llamadas;
  buscar('x', herramienta);
  reloj = 1000;
  igual(buscar('x', herramienta), 2);
});
prueba('otra consulta, otra llamada', () => {
  reloj = 0;
  let llamadas = 0;
  const buscar = crearCache(1000, ahora);
  const herramienta = () => ++llamadas;
  buscar('a', herramienta);
  buscar('b', herramienta);
  igual(llamadas, 2);
});
--- solución
function crearCache(ttlMs, ahora) {
  const guardado = new Map();
  return function buscar(consulta, herramienta) {
    const g = guardado.get(consulta);
    if (g && ahora() - g.hora < ttlMs) return g.valor;
    const valor = herramienta(consulta);
    guardado.set(consulta, { valor, hora: ahora() });
    return valor;
  };
}
```

## 6.6 Lanzamiento y operación

> 🌎 **En la vida real:** un conductor nuevo en una empresa de transporte. Primero viaja **de acompañante** mirando (modo sombra). Después maneja **con el instructor al lado** que puede frenar (modo asistido). Después maneja solo, **pero en rutas cortas y con rastreador** (autónomo con límites). Recién con buenos resultados le dan rutas largas.

> 🌎 **Otro ejemplo:** Como estrenar un servicio de delivery: primero repartos de prueba, después con supervisor, y recién después solos, con un botón para detener todo.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Por etapas, con canario e interruptor
lenguaje: js
pide: Completa `aDondeVa(config)`, en este orden: si `config.interruptor` está apagado (`false`), `'detenido'`; si `config.etapa` es `'sombra'`, `'al registro'`; si es `'asistido'`, `'a una persona'`; si es `'autonomo'`, `'al usuario'`. Y `vaAlCanario(idUsuario, porcentaje)`: suma los códigos de las letras del id (`charCodeAt`) y, si esa suma `% 100` es menor que el porcentaje, `true`. Así el mismo usuario siempre cae en el mismo lado.
--- código
function aDondeVa(config) {
  // tu código aquí
}

function vaAlCanario(idUsuario, porcentaje) {
  // tu código aquí
}
--- pruebas
prueba('modo sombra', () => igual(aDondeVa({ interruptor: true, etapa: 'sombra' }), 'al registro'));
prueba('modo asistido', () => igual(aDondeVa({ interruptor: true, etapa: 'asistido' }), 'a una persona'));
prueba('autónomo', () => igual(aDondeVa({ interruptor: true, etapa: 'autonomo' }), 'al usuario'));
prueba('el interruptor manda', () => igual(aDondeVa({ interruptor: false, etapa: 'autonomo' }), 'detenido'));
prueba('canario: "ab" suma 195, cae en 95', () => igual([vaAlCanario('ab', 95), vaAlCanario('ab', 96)], [false, true]));
prueba('con 0% nadie', () => igual(vaAlCanario('cualquiera', 0), false));
prueba('siempre igual', () => igual(vaAlCanario('u-123', 30), vaAlCanario('u-123', 30)));
--- solución
function aDondeVa(config) {
  if (!config.interruptor) return 'detenido';
  if (config.etapa === 'sombra') return 'al registro';
  if (config.etapa === 'asistido') return 'a una persona';
  if (config.etapa === 'autonomo') return 'al usuario';
  return 'detenido';
}

function vaAlCanario(idUsuario, porcentaje) {
  let suma = 0;
  for (let i = 0; i < idUsuario.length; i++) suma += idUsuario.charCodeAt(i);
  return suma % 100 < porcentaje;
}
```

## ✍️ Práctica: publicar agentes

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

```practica
elige :: ¿Qué devuelve al instante la capa de API cuando llega un pedido largo? :: La respuesta final :: Un id de ejecución :: Nada
elige :: ¿Dónde corren las ejecuciones de un agente en producción? :: Dentro del pedido web :: Como trabajos en una cola, con trabajadores :: En el teléfono
elige :: ¿Para qué sirve una clave de idempotencia? :: Para cifrar :: Para que un reintento nunca haga dos veces algo que cambia el mundo, como un pago :: Para comprimir
elige :: ¿Qué es la espera exponencial con jitter? :: Esperar siempre 1 segundo :: Esperar 1, 2, 4, 8… segundos, con un poco de azar para no reintentar todos a la vez :: No reintentar nunca
elige :: ¿Dónde se ponen el máximo de pasos y el techo de costo? :: En el prompt :: En el código :: En el README
escribe :: ¿Qué es la trifecta letal? :: Un agente que tiene acceso a datos privados, procesa contenido no confiable y puede comunicarse hacia afuera; cualquiera que le ponga un texto delante puede usarlo para robar datos. Hay que quitar una pata.
elige :: ¿Cómo se defiende un agente de la inyección indirecta? :: Confiando en los resultados de herramientas :: Tratando todos los resultados de herramientas como datos, nunca como instrucciones :: Apagando el modelo
vf :: El modelo debería poder ver la llave de la API para usar las herramientas
vf :: Cada ataque que funciona en el red teaming se convierte en una prueba de seguridad
elige :: ¿Cuál es el orden de lanzamiento? :: Autónomo, asistido, sombra :: Sombra, asistido, autónomo con límites :: Todo junto
elige :: ¿Qué es un canario? :: Un error :: Probar una versión nueva en una porción del tráfico :: Un tipo de modelo
```
