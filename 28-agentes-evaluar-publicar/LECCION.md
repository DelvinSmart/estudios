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

## 5.5 Armar el set de evaluación

> 🌎 **En la vida real:** un profesor arma su banco de preguntas de examen con los errores que más vio en sus alumnos. Cada año agrega las nuevas trampas en las que cayeron.

> 🌎 **Otro ejemplo:** Como el banco de preguntas de un profesor que crece con cada error que ve en sus alumnos.

- Empieza con **20 a 50 tareas reales o realistas** que cubran las categorías principales y **los casos límite que más miedo te dan**.
- Incluye los resultados esperados y, si se puede, trayectorias de referencia.
- **Hazlo crecer desde producción: cada falla que llega a un usuario se convierte en un caso de evaluación.**
- Guarda un **set aparte que quien escribe el prompt nunca ve** (para no "estudiar para el examen").
- **Córrelo en el CI y bloquea la publicación** si bajan la tasa de éxito o sube la de violaciones de seguridad.
- **Ponle versión al set junto con el código.**

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
