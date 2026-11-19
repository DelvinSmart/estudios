# Agentes 3: veinte patrones más y cómo elegir

> 🎙️ **El profesor dice:** además de los cinco grandes, hay patrones más chicos que se combinan. No hace falta memorizarlos: hace falta saber que existen y elegir con la tabla del final.

> 📌 **Nota:** esta clase es parte del curso **Agentes de IA**, que tiene su propio certificado. Está basada en la guía **"Agentic design patterns"** de **Bashiri Smith** (BASWE, edición 2026), explicada en español con mis palabras; los números (2.1, 4.3…) son los mismos de la guía.

## 3.1 Patrones de flujo de trabajo

> 🎙️ **El profesor:** no te asustes por el número. No hace falta memorizar veinte: hace falta **reconocer el problema** y saber que existe un patrón para él. Al final está la tabla para elegir.

> 🌎 **En la vida real:** Es como la caja de herramientas completa de un mecánico: los cinco patrones son el martillo y el destornillador; estos veinte son las herramientas especiales para problemas puntuales.

> 🌎 **Otro ejemplo:** Es como el recetario completo después de aprender a hervir, freír y hornear: recetas para cada ocasión.

Los cinco principales son los ladrillos. Estos veinte son **con qué los combinas**. Están agrupados por el problema que resuelven, para que encuentres el correcto cuando te topes con el problema.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una cadena de prompts con compuertas, y una votación
lenguaje: js
pide: Completa `cadena(pasos, entrada)`. Cada paso es `{ nombre, hacer, compuerta }`: `hacer` recibe la salida del paso anterior y `compuerta` revisa el resultado (devuelve `true` o `false`). Si una compuerta falla, para y devuelve `{ ok: false, fallo: nombre }`; si todas pasan, `{ ok: true, salida }`. Y `votar(respuestas)`: devuelve la respuesta que más se repite (si empatan, la que apareció primero).
--- código
function cadena(pasos, entrada) {
  // tu código aquí
}

function votar(respuestas) {
  // tu código aquí
}
--- pruebas
const PASOS = [
  { nombre: 'índice', hacer: (t) => `índice de ${t}`, compuerta: (r) => r.startsWith('índice') },
  { nombre: 'borrador', hacer: (r) => r.toUpperCase(), compuerta: (r) => r.length < 40 },
];
prueba('pasa por todo', () => igual(cadena(PASOS, 'gasolina'), { ok: true, salida: 'ÍNDICE DE GASOLINA' }));
prueba('para en la compuerta que falla', () => igual(cadena(PASOS, 'un tema larguísimo que no entra en el borrador'), { ok: false, fallo: 'borrador' }));
prueba('la mayoría gana', () => igual(votar(['soporte', 'código', 'soporte']), 'soporte'));
prueba('empate: la primera', () => igual(votar(['código', 'soporte']), 'código'));
--- solución
function cadena(pasos, entrada) {
  let actual = entrada;
  for (const paso of pasos) {
    actual = paso.hacer(actual);
    if (!paso.compuerta(actual)) return { ok: false, fallo: paso.nombre };
  }
  return { ok: true, salida: actual };
}

function votar(respuestas) {
  const cuenta = {};
  let ganadora = null;
  for (const r of respuestas) {
    cuenta[r] = (cuenta[r] ?? 0) + 1;
    if (ganadora === null || cuenta[r] > cuenta[ganadora]) ganadora = r;
  }
  return ganadora;
}
```

## 3.2 Patrones de razonamiento

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Reflexion: aprender del intento anterior
lenguaje: python
pide: En el patrón Reflexion, después de cada intento fallido el agente guarda una lección corta. Completa `recordar(memoria, leccion, maximo=3)`: devuelve una lista **nueva** con la lección al final, sin repetir una que ya estaba, y con solo las últimas `maximo`. Y `prompt_con_memoria(tarea, memoria)`: devuelve la tarea sola si no hay lecciones; si hay, la tarea, una línea `"Lo que aprendiste antes:"` y cada lección en su línea con `"- "` adelante (separadas con `"\n"`).
--- código
def recordar(memoria, leccion, maximo=3):
    pass  # tu código aquí


def prompt_con_memoria(tarea, memoria):
    pass  # tu código aquí
--- pruebas
prueba("agrega al final", lambda: igual(recordar(["a"], "b"), ["a", "b"]))
prueba("no repite", lambda: igual(recordar(["a", "b"], "a"), ["a", "b"]))
prueba("guarda solo las últimas", lambda: igual(recordar(["a", "b", "c"], "d"), ["b", "c", "d"]))
def _no_cambia_la_original():
    original = ["a"]
    recordar(original, "b")
    igual(original, ["a"])
prueba("no cambia la lista original", _no_cambia_la_original)
prueba("sin memoria", lambda: igual(prompt_con_memoria("Arregla el error", []), "Arregla el error"))
prueba("con memoria", lambda: igual(prompt_con_memoria("Arregla el error", ["revisa null"]), "Arregla el error\nLo que aprendiste antes:\n- revisa null"))
--- solución
def recordar(memoria, leccion, maximo=3):
    if leccion in memoria:
        return list(memoria)
    return (memoria + [leccion])[-maximo:]


def prompt_con_memoria(tarea, memoria):
    if not memoria:
        return tarea
    lineas = [tarea, "Lo que aprendiste antes:"] + [f"- {l}" for l in memoria]
    return "\n".join(lineas)
```

## 3.3 Patrones de coordinación

> 🌎 **En la vida real:** cómo se organiza un equipo de personas: con jefe, pasándose el trabajo de mano en mano, con una pizarra común o discutiendo. Cada agente que agregas es **otro lugar donde se puede perder el contexto**, así que elige lo más simple que sirva.

**10. Traspasos y enjambres (*handoffs* y *swarms*).** Sin supervisor: los agentes **se pasan la conversación entre ellos**. Un agente de recepción la pasa a uno de cobros, que la pasa a uno de reembolsos. Cada traspaso transfiere **todo** el estado de la conversación y deja al que recibe como el activo. El *OpenAI Agents SDK* lo formaliza: el traspaso es una herramienta que el modelo puede llamar. Son más simples de construir que un supervisor y van bien para conversaciones, pero **son más difíciles de observar**, porque el control se mueve de lado.

> 🌎 **En la vida real:** llamas al banco: "te paso con el área de tarjetas"… "te paso con fraudes". Cada uno recibe tu caso completo.

**11. Agentes jerárquicos.** Supervisores de supervisores: un gerente delega en jefes de equipo, que delegan en trabajadores. Úsalo **solo** cuando un único supervisor se ahogaría con la cantidad de trabajadores o el tamaño de sus resultados. Cada nivel agrega demora, costo y un lugar donde se pierde contexto. **Casi ningún sistema necesita más de dos niveles.**

> 🌎 **En la vida real:** el organigrama de una empresa grande. Funciona, pero cada nivel es un "teléfono descompuesto" posible.

**12. Pizarra y estado compartido (*blackboard*).** Los agentes **no se mandan mensajes**: leen y escriben en un objeto común (un documento, un tablero de tareas, un registro en una base de datos). Cada uno vigila las condiciones que le importan y actúa cuando aparecen. Así los agentes quedan totalmente **desacoplados** y el sistema es fácil de ampliar. Los *frameworks* basados en grafos usan esta idea: un objeto de estado con tipos pasa por los nodos, y cada nodo lee lo que necesita y escribe lo que produjo.

> 🌎 **En la vida real:** el tablero de pedidos de una cocina. Nadie le grita a nadie: el parrillero ve "2 bifes" y los hace; el que arma platos ve "bifes listos" y arma.

**13. Debate y consenso.** Dos o más agentes **defienden posiciones contrarias**, o resuelven el problema por separado y después concilian. Un juez elige al ganador o sintetiza. El debate mejora la exactitud en preguntas discutidas y atrapa errores que un solo agente no vería, **a dos a cuatro veces el costo**. Úsalo para análisis importantes, no para tareas de todos los días.

> 🌎 **En la vida real:** pedir una segunda opinión médica, o un juicio con fiscal y defensor frente a un juez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una pizarra compartida
lenguaje: js
pide: En el patrón pizarra, los agentes no se hablan: escriben en un objeto común. Completa `escribir(pizarra, agente, clave, valor)`: devuelve una pizarra **nueva** donde `clave` vale `{ valor, autor: agente }`. Pero si la clave ya la escribió **otro** agente, no la pisa: devuelve la pizarra igual. Y `quienEscribio(pizarra)`: una lista sin repetidos de los autores, en el orden en que aparecen.
--- código
function escribir(pizarra, agente, clave, valor) {
  // tu código aquí
}

function quienEscribio(pizarra) {
  // tu código aquí
}
--- pruebas
const p1 = escribir({}, 'investigador', 'fuentes', ['ANP']);
prueba('escribe con su autor', () => igual(p1, { fuentes: { valor: ['ANP'], autor: 'investigador' } }));
prueba('no cambia la original', () => { const vacia = {}; escribir(vacia, 'a', 'x', 1); igual(vacia, {}); });
prueba('no pisa lo de otro', () => igual(escribir(p1, 'redactor', 'fuentes', []), p1));
prueba('sí actualiza lo suyo', () => igual(escribir(p1, 'investigador', 'fuentes', ['ANP', 'IBGE']).fuentes.valor, ['ANP', 'IBGE']));
prueba('quién escribió', () => igual(quienEscribio(escribir(escribir(p1, 'analista', 'precio', 6), 'investigador', 'fecha', 'hoy')), ['investigador', 'analista']));
--- solución
function escribir(pizarra, agente, clave, valor) {
  const actual = pizarra[clave];
  if (actual && actual.autor !== agente) return pizarra;
  return { ...pizarra, [clave]: { valor, autor: agente } };
}

function quienEscribio(pizarra) {
  return [...new Set(Object.values(pizarra).map((c) => c.autor))];
}
```

## 3.4 Patrones de control

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Más de una forma de parar
lenguaje: js
pide: Completa `debeParar(estado, limites)`. Devuelve el **motivo** para parar, o `null` si puede seguir, revisando en este orden: `'máximo de pasos'` si `estado.pasos >= limites.pasos`; `'presupuesto de tokens'` si `estado.tokens >= limites.tokens`; `'llamada repetida'` si las **últimas 3** llamadas de `estado.llamadas` son iguales (compáralas con `JSON.stringify`).
--- código
function debeParar(estado, limites) {
  // tu código aquí
}
--- pruebas
const LIMITES = { pasos: 10, tokens: 50000 };
const buscar = { nombre: 'buscar_web', args: { q: 'gasolina' } };
prueba('puede seguir', () => igual(debeParar({ pasos: 2, tokens: 900, llamadas: [buscar] }, LIMITES), null));
prueba('máximo de pasos', () => igual(debeParar({ pasos: 10, tokens: 900, llamadas: [] }, LIMITES), 'máximo de pasos'));
prueba('se acabaron los tokens', () => igual(debeParar({ pasos: 3, tokens: 50001, llamadas: [] }, LIMITES), 'presupuesto de tokens'));
prueba('la misma llamada tres veces', () => igual(debeParar({ pasos: 3, tokens: 900, llamadas: [buscar, buscar, buscar] }, LIMITES), 'llamada repetida'));
prueba('dos veces todavía no', () => igual(debeParar({ pasos: 3, tokens: 900, llamadas: [buscar, buscar] }, LIMITES), null));
prueba('tres llamadas distintas no', () => igual(debeParar({ pasos: 3, tokens: 900, llamadas: [buscar, buscar, { nombre: 'buscar_web', args: { q: 'diésel' } }] }, LIMITES), null));
--- solución
function debeParar(estado, limites) {
  if (estado.pasos >= limites.pasos) return 'máximo de pasos';
  if (estado.tokens >= limites.tokens) return 'presupuesto de tokens';
  const ultimas = estado.llamadas.slice(-3).map((l) => JSON.stringify(l));
  if (ultimas.length === 3 && ultimas.every((l) => l === ultimas[0])) return 'llamada repetida';
  return null;
}
```

## 3.5 Patrones de conocimiento

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Compactar el contexto
lenguaje: python
pide: Completa `compactar(mensajes, dejar, resumir)`. Si hay `dejar + 1` mensajes o menos, devuelve la lista igual. Si no, deja el **primero** (las instrucciones), después un mensaje `{"rol": "resumen", "contenido": resumir(viejos)}` con los del medio, y al final los últimos `dejar` mensajes, sin tocarlos. `resumir` recibe la lista de los mensajes viejos.
--- código
def compactar(mensajes, dejar, resumir):
    pass  # tu código aquí
--- pruebas
M = [{"rol": "sistema", "contenido": "reglas"}] + [{"rol": "usuario", "contenido": f"m{i}"} for i in range(1, 6)]
contar = lambda viejos: f"{len(viejos)} mensajes viejos"
prueba("corta no se toca", lambda: igual(compactar(M[:3], 2, contar), M[:3]))
prueba("el largo final", lambda: igual(len(compactar(M, 2, contar)), 4))
prueba("las instrucciones quedan primero", lambda: igual(compactar(M, 2, contar)[0], M[0]))
prueba("el resumen de los del medio", lambda: igual(compactar(M, 2, contar)[1], {"rol": "resumen", "contenido": "3 mensajes viejos"}))
prueba("los últimos, tal cual", lambda: igual(compactar(M, 2, contar)[2:], M[-2:]))
--- solución
def compactar(mensajes, dejar, resumir):
    if len(mensajes) <= dejar + 1:
        return mensajes
    primero = mensajes[0]
    viejos = mensajes[1:-dejar]
    ultimos = mensajes[-dejar:]
    return [primero, {"rol": "resumen", "contenido": resumir(viejos)}] + ultimos
```

## 3.6 Tabla para elegir un patrón

> 🌎 **En la vida real:** la tabla de "qué herramienta para qué tornillo" pegada en la pared del taller. Cuando estás frente al problema, la miras y eliges.

> 🌎 **Otro ejemplo:** Como la tabla de "qué remedio para qué síntoma" de un botiquín: la miras cuando tienes el síntoma delante.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Elegir el patrón con la tabla
lenguaje: js
pide: Completa `elegirPatron(caso)` usando la tabla de arriba, en este orden: si `caso.irreversible` → `'persona en el ciclo'`; si `caso.categorias` → `'enrutamiento'`; si `caso.partesIndependientes` → `'paralelización'`; si `caso.secuenciaFija` → `'cadena de prompts'`; si `caso.calidadPrimero` → `'evaluador-optimizador'`; y si nada de eso, `'ReAct'`.
--- código
function elegirPatron(caso) {
  // tu código aquí
}
--- pruebas
prueba('reembolsar plata', () => igual(elegirPatron({ irreversible: true, categorias: true }), 'persona en el ciclo'));
prueba('tipos de pedido', () => igual(elegirPatron({ categorias: true }), 'enrutamiento'));
prueba('cinco revisiones a la vez', () => igual(elegirPatron({ partesIndependientes: true }), 'paralelización'));
prueba('índice, borrador, pulir', () => igual(elegirPatron({ secuenciaFija: true }), 'cadena de prompts'));
prueba('calidad primero', () => igual(elegirPatron({ calidadPrimero: true }), 'evaluador-optimizador'));
prueba('no se sabe cuántos pasos', () => igual(elegirPatron({}), 'ReAct'));
--- solución
function elegirPatron(caso) {
  if (caso.irreversible) return 'persona en el ciclo';
  if (caso.categorias) return 'enrutamiento';
  if (caso.partesIndependientes) return 'paralelización';
  if (caso.secuenciaFija) return 'cadena de prompts';
  if (caso.calidadPrimero) return 'evaluador-optimizador';
  return 'ReAct';
}
```

## ✍️ Práctica: veinte patrones más

> 🎙️ **El profesor dice:** antes de seguir, comprueba que lo puedes explicar. Si fallas una, lee la explicación y vuelve a intentarlo.

```practica
elige :: ¿Qué patrón usarías para traducir 500 descripciones con un formato fijo? :: Multiagente :: Cadena de prompts o flujo de trabajo :: Árbol de pensamientos
elige :: Revisar un contrato buscando 6 tipos de cláusulas a la vez es… :: Debate :: Paralelización por secciones :: Reflexion
elige :: Correr la misma clasificación 3 veces y quedarse con la mayoría es… :: Por secciones :: Por votación :: ReWOO
elige :: ¿Qué patrón escribe todo el plan con las llamadas a herramientas de antemano y no vuelve al modelo? :: ReAct :: ReWOO :: Reflexion
elige :: ¿Qué patrón guarda una reflexión escrita de cada intento fallido para el próximo? :: ReWOO :: Reflexion :: Debate
elige :: Un agente que escribe un programa que llama muchas herramientas y lo corre en una caja aislada es… :: Self-ask :: Código como acción (CodeAct) :: Pizarra
elige :: Agentes que no se hablan y leen y escriben en un estado común es… :: Traspasos :: Pizarra (blackboard) :: Jerárquico
elige :: ¿Cuántos niveles de jerarquía necesitan casi todos los sistemas? :: Cinco :: No más de dos :: Diez
elige :: ¿Qué patrones de control dice la guía que van "siempre, en producción"? :: Debate y árbol :: Controles (guardrails) y terminación/presupuestos :: Pizarra y enjambre
elige :: ¿Qué tipo de memoria es la ventana de contexto? :: Semántica :: De trabajo :: De procedimientos
elige :: Los hechos y preferencias guardados en una base de vectores son memoria… :: De episodios :: Semántica :: De trabajo
vf :: La mayoría de los errores de memoria son errores al escribir (guardar todo o nada útil)
vf :: El RAG agéntico busca una sola vez y responde
escribe :: ¿Qué debe conservar una buena compactación del contexto? :: El objetivo, las decisiones tomadas, las preguntas abiertas, los datos e identificadores clave y la lista de archivos o recursos tocados.
escribe :: ¿Qué es una persona en el ciclo (human-in-the-loop) y cuándo se usa? :: El agente se pausa en puntos definidos y espera a una persona (guardando el estado); se usa en toda acción irreversible o cara, como pagos, borrados o envíos.
```
