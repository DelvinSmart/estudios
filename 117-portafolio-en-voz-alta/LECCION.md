# Mi portafolio en voz alta

> 🌎 **En la vida real:** un vendedor de autos no te recita el manual. Te dice en una frase para quién es el auto, te cuenta tres cosas que lo hacen bueno, y si preguntas, abre el capó. Tu portafolio es igual: una **ficha** por proyecto, lista para contarla en voz alta, de corto a largo.

> 🎙️ **El profesor dice:** {{alumno}}, en la clase 85 aprendiste a contar el **recorrido de un dato**. Esta clase es el otro lado: cómo **vender el proyecto entero** en una entrevista. Para cada proyecto vas a tener una **ficha** con tres pitches (30 segundos, 1 minuto, 5 minutos), las **decisiones** importantes con la alternativa que descartaste, un **error que arreglaste** contado con orden, y **qué mejorarías**. Con eso, cualquier pregunta ya tiene respuesta.

## Parte 1. La ficha: tres pitches, de corto a largo

> 🌎 **En la vida real:** es como presentarte. A un vecino le dices tu nombre y a qué te dedicas (30 s). A alguien en una fiesta, un poco de tu historia (1 min). A un amigo nuevo, la versión con detalles (5 min). La misma persona, tres largos.

Un **pitch** es contar algo corto y claro, pensado para quien escucha. Para cada proyecto preparas tres:

| Pitch | Cuándo | Qué incluye |
|---|---|---|
| **30 segundos** | "Cuéntame de un proyecto tuyo" | Qué es, para quién, con qué está hecho y tu papel. Sin detalles técnicos. |
| **1 minuto** | Si muestran interés | Lo de 30 s + el problema que resolviste y **una** decisión técnica importante. |
| **5 minutos** | "Cuéntame en detalle" | La arquitectura, dos o tres decisiones con sus alternativas, un error que arreglaste y qué mejorarías. |

**Las cuatro piezas de una ficha**, además de los pitches:

1. **Decisiones con alternativa descartada.** No "usé React Native", sino "usé React Native **en vez de** hacer dos apps nativas, **porque** era una persona y tenía que llegar a iPhone y Android". La alternativa descartada demuestra que **pensaste**.
2. **Un error contado con orden (STAR):** **S**ituación (qué pasaba), **T**area (qué tenías que lograr), **A**cción (qué hiciste), **R**esultado (cómo quedó). Un bug bien contado vale más que diez "sé tal tecnología".
3. **Qué mejorarías.** Muestra honestidad y criterio. Nadie cree en el proyecto perfecto.
4. **Los números.** "295 commits", "400 pruebas", "un solo código para dos teléfonos". Concretos, no "muchos".

> 💡 **Idea:** no memorices palabra por palabra. Memoriza la **estructura** (las cuatro piezas) y los **números**. Lo demás sale con tus palabras, y suena honesto.

```practica
elige :: ¿Qué diferencia una decisión bien contada de una mal contada en una entrevista? :: Usar más palabras técnicas :: Decir la alternativa que descartaste y por qué, no solo lo que usaste :: Decir que fue fácil
vf :: Conviene memorizar el pitch palabra por palabra para no equivocarse
escribe :: ¿Qué son las cuatro letras de STAR y para qué sirven? :: Situación, Tarea, Acción y Resultado: el orden para contar un error que arreglaste, de qué pasaba a cómo quedó, sin perderte.
```

## Parte 2. Ficha: Copiloto Driver (el proyecto estrella)

**Qué es:** una app para conductores de aplicaciones (como Uber) que lee la oferta de un viaje en la pantalla y te dice, al instante, si conviene, según los mínimos que tú configuras.

### Pitch de 30 segundos

> "Copiloto Driver es una app para conductores. Mientras manejas con otra app abierta, lee la oferta del viaje y te avisa con un color si conviene o no, según lo que tú ganas por kilómetro. La hice yo solo, en React Native con Expo, un solo código para iPhone y Android, con un asistente de inteligencia artificial."

### Pitch de 1 minuto

> "…(lo de 30 s)… El problema es que un conductor no puede hacer cuentas mientras maneja y le llueven ofertas. Copiloto lee la oferta de la otra app y, con los mínimos que configura cada quien, le pone un color: verde si conviene. Lo difícil fue que leer la pantalla de **otra** app no se puede con React Native normal, así que escribí una pieza nativa para eso, distinta en cada teléfono, y el resto es un solo código."

### Pitch de 5 minutos (el guion)

- **Qué y para quién:** conductores de apps; ver de un vistazo si una oferta conviene.
- **Arquitectura:** React Native con TypeScript y Expo (un solo código, iPhone y Android). El servidor y el asistente de IA son Firebase Cloud Functions con Gemini. Los datos, en Firestore, con reglas que aíslan la carpeta de cada usuario.
- **Lo nativo:** leer la pantalla de otra app y dibujar una burbuja encima no se puede con React Native solo. Escribí un **módulo nativo** (clase 113): en Android, un servicio de accesibilidad en Kotlin que lee y dibuja la burbuja; en iPhone, captura de pantalla con ReplayKit y la oferta como notificación. TypeScript los llama por un puente.
- **La IA:** el asistente responde sobre tus ganancias. El servidor revisa la sesión, que el pedido tenga sentido y no sea un engaño, y pone un límite de uso **antes** de llamar al modelo.
- **Un error que arreglé (ver la Parte siguiente, con STAR).**
- **Qué mejoraría:** unificar los mínimos por defecto, que hoy no son iguales en los dos teléfonos; y agregar pruebas de punta a punta de la lectura de la pantalla.

### Dos decisiones, con la alternativa que descarté

| Decisión | En vez de… | Porque… |
|---|---|---|
| React Native con Expo | Dos apps nativas (Kotlin y Swift) | Era una persona y tenía que llegar a iPhone y Android; un solo código y unas solas pruebas. |
| Un módulo nativo solo para leer la pantalla | Intentar todo en React Native | Leer otra app y dibujar encima solo lo puede hacer el código nativo de cada teléfono. |

### Un error, contado con STAR

- **Situación:** un índice que relacionaba el teléfono con la cuenta dejaba que un usuario con sesión viera o tocara datos que no eran suyos.
- **Tarea:** cerrar ese acceso sin romper el uso normal.
- **Acción:** moví la decisión al servidor, con reglas que revisan que el dueño del dato sea quien está conectado, y agregué una prueba que intenta el acceso indebido y espera que lo rechace.
- **Resultado:** el acceso de otro queda rechazado, el uso normal sigue igual, y la prueba lo deja demostrado para siempre.

```practica
elige :: En el pitch de Copiloto, ¿por qué se eligió React Native en vez de dos apps nativas? :: Porque es más moderno :: Porque una sola persona tenía que llegar a iPhone y Android: un solo código y unas solas pruebas :: Porque Kotlin y Swift no sirven
vf :: Leer la pantalla de otra app y dibujar una burbuja encima se puede hacer solo con React Native, sin código nativo
escribe :: Cuenta con STAR el error del índice de Copiloto. :: Situación: un índice teléfono-cuenta dejaba a un usuario con sesión ver datos ajenos. Tarea: cerrarlo sin romper el uso normal. Acción: moví la decisión al servidor con reglas que revisan al dueño, y agregué una prueba del acceso indebido. Resultado: el acceso ajeno queda rechazado y la prueba lo demuestra.
```

## Parte 3. Ficha corta: la app de gastos (la que hiciste 4 veces)

Este es tu proyecto de **aprendizaje**, y tiene algo que impresiona: lo hiciste en **cuatro tecnologías** con las mismas decisiones, lo que demuestra que entiendes el **concepto**, no una sola herramienta.

### Pitch de 30 segundos

> "Hice una app para anotar los gastos del carro, pero la construí cuatro veces: la web, un servidor con Node, la app de teléfono con React Native y la nativa de Android con Kotlin. Las mismas decisiones y las mismas pruebas en todas; cambia la herramienta, no la forma de pensar."

### Una decisión y un error (STAR)

- **Decisión:** la lógica de los gastos (cómo se suman, qué es válido) va **separada** de la pantalla, en vez de mezclada, **porque** así la pude probar sola y reusar en las cuatro versiones.
- **Error (STAR):** **S**: el gasto más nuevo del mismo día aparecía abajo en la lista. **T**: que el más nuevo saliera primero. **A**: al probarla de verdad encontré que ordenaba solo por fecha, sin desempatar por hora; agregué el desempate y una prueba. **R**: el orden quedó correcto y la prueba lo cuida.

> 🎤 **Si te preguntan "¿cuál es tu mejor proyecto de aprendizaje?":** "La app de gastos del carro, porque la hice cuatro veces —web, servidor en Node, React Native y Kotlin nativo— con las mismas decisiones y pruebas. Me enseñó que lo que importa es el concepto: separar la lógica de la pantalla, probar primero y medir. La herramienta es lo de menos."

## Parte 4. Tu turno: la ficha en blanco

> 🎙️ **El profesor dice:** ahora la tuya. Toma **un** proyecto y llena esta ficha. Dila en voz alta y cronométrala: 30 segundos, luego 1 minuto. Si te pasas, sobra; si te falta, agrega una decisión.

**Plantilla (cópiala y llénala para cada proyecto):**

```text
PROYECTO: ___________
- Qué es y para quién: ___________
- Hecho con: ___________   · Mi papel: ___________
- Números: ___________ (commits, pruebas, usuarios…)

PITCH 30 s: ___________
PITCH 1 min: (30 s) + el problema + UNA decisión

DECISIONES (con alternativa descartada):
  1. Usé ___ en vez de ___ porque ___
  2. Usé ___ en vez de ___ porque ___

UN ERROR (STAR):
  S: ___   T: ___   A: ___   R: ___

QUÉ MEJORARÍA: ___________
```

```practica
vf :: Conviene decir el pitch en voz alta y cronometrarlo, no solo leerlo
escribe :: Escribe el pitch de 30 segundos de uno de tus proyectos, siguiendo la plantilla. :: (Respuesta libre: qué es y para quién, con qué está hecho, tu papel, y un número concreto. Sin detalles técnicos de más.)
```

## Para la entrevista

> 🎤 **Si te dicen "cuéntame de un proyecto tuyo":** empieza SIEMPRE por el pitch de 30 segundos (qué es, para quién, con qué, tu papel). Después cállate y deja que pregunten: si piden más, sueltas el de 1 minuto, y si piden detalles, el de 5. Así no abrumas y respondes a lo que de verdad quieren saber.

> 🌎 **En la vida real:** es como servir la comida por tiempos, no todo el plato de golpe. El que escucha decide cuánto más quiere.

> 🌎 **Otro ejemplo:** es como un tráiler: primero el corto que engancha; la película completa, solo si la piden.
