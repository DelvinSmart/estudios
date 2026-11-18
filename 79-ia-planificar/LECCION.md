# IA 7: el plano y la estructura: planificar y que el código no se enrede

> 🌎 **En la vida real:** nadie empieza una casa poniendo ladrillos. Primero hay un **plano**: cuánto mide el terreno, dónde va la sala, dónde los cuartos, dónde la cocina y el baño, por dónde pasan el agua y la luz. Con el plano, los albañiles trabajan rápido y sin romper paredes. Sin plano, a la semana descubres que el baño quedó sin ventana y la cocina sin desagüe.

> 🎙️ **El profesor dice:** {{alumno}}, con la IA es muy tentador ir directo al "hazme una app de…". Y la IA lo hace: rapidísimo. El problema es que construye rapidísimo **lo que le dijiste**, no lo que **querías**. En esta clase vas a ver por qué planificar antes de pedir código ahorra tiempo, tokens y errores; qué piezas tiene un buen plan; cómo armarlo con ayuda de la IA, sin que ella decida por ti; la historia real de este mapa de estudios, que fue fácil de construir porque ya tenía su plano; las "puertas y ventanas" que la IA olvida si nadie se las pide; y cómo evitar el código espagueti con lo que ya usan los proyectos de este curso: motores, candados y pruebas.

## Parte 1. Por qué planificar (y con la IA, más todavía)

**Planificar** es decidir **qué** quieres y **cómo** lo vas a hacer, **antes** de hacerlo. No es perder tiempo: es ganarlo después.

Cambiar algo en el papel cuesta un borrador. Cambiarlo cuando ya está construido cuesta romper y volver a hacer. Mientras más avanzado está el trabajo, más caro sale el cambio.

> 🌎 **En la vida real:** mover una pared en el plano es borrar una línea. Moverla cuando la casa ya está hecha es picar, cargar escombros, volver a levantar, pintar… y pagar todo eso.

> 🌎 **Otro ejemplo:** Es como un viaje: si decides la ruta antes de salir, llegas. Si sales "a ver qué pasa", gastas el doble de gasolina y terminas en otra ciudad.

> 🌎 **Otro ejemplo más:** Es como cocinar para una fiesta: si haces la lista de compras antes, vas una vez al supermercado. Si no, vas cuatro veces y a la mitad te falta el arroz.

### Con la IA, el plan importa más

Con la IA, construir es rápido y barato. Eso tiene una trampa: como hacer cosas cuesta tan poco, es fácil construir **mucho de lo que no hacía falta**.

| Sin plan | Con plan |
|---|---|
| "Hazme una app de gastos" → la IA inventa qué pantallas, qué datos, qué colores | Le dices qué pantallas, qué datos y qué **no** quieres todavía |
| Cada pedido cambia lo anterior; el código se vuelve un remiendo | Cada pedido es un paso del plan; las piezas encajan |
| Gastas tokens explicando y corrigiendo una y otra vez | El plan está escrito; la IA lo lee y va directo |
| No sabes cuándo terminaste | El plan dice qué es "terminado" |

> 🌎 **En la vida real:** la IA es como un albañil rapidísimo: si le dices "hazme una pared", te hace una pared perfecta en una hora. Pero si no le dijiste dónde, la puede hacer en medio de la sala.

```practica
vf :: Planificar es decidir qué quieres y cómo lo vas a hacer antes de hacerlo
vf :: Como la IA escribe código rápido, cambiar de idea a mitad de camino no cuesta nada
elige :: ¿Cuál es la trampa de construir con IA sin plan? :: Que la IA trabaja muy lento :: Que construye rapidísimo lo que le dijiste, no lo que querías :: Que no sabe programar
escribe :: Explica con un ejemplo de la vida real por qué cambiar algo en el plan es más barato que cambiarlo después. :: Mover una pared en el plano es borrar una línea; moverla con la casa hecha es picar, sacar escombros, volver a levantarla y pintar. En el código pasa igual: decidir antes es fácil; cambiar lo ya construido obliga a rehacer partes.
```

## Parte 2. La historia de este mapa: primero el plano, después la casa

Este mapa de estudios es el ejemplo perfecto, porque se puede ver en su historia (en Git, clase 06):

| Día | Lo que pasó |
|---|---|
| **11 de noviembre** | El curso empieza como **una carpeta**, sin página web: once lecciones en archivos `.md`, una guía para empezar (`00-EMPIEZA-AQUI.md`), las instrucciones para la IA que enseña (`AGENTS.md`) y un archivo de progreso. |
| **12 al 15** | Se estudia así, con la carpeta. Se agrega un índice (`README.md`), las clases de los proyectos y la forma de estudiar desde el iPad. |
| **16 de noviembre** | Recién ahí se hace la **página web** del mapa. Ese mismo día salen **53 cambios**: el mapa, la página de progreso, las prácticas y las clases guiadas. |

¿Por qué la página salió tan rápido? Porque **el plano ya existía**:

- **El contenido** ya estaba escrito, clase por clase.
- **La forma** de cada clase ya estaba decidida: un título `#`, partes con `##`, subtítulos con `###`. La página solo tuvo que **leer** esa forma: la función `partir` corta cada clase en sus `##` (la viste en la clase 18).
- **El orden** del curso ya estaba en el índice. Pasarlo a `cursos.js` fue copiar una lista.
- **Las reglas** de cómo se enseña ya estaban en `AGENTS.md`.

La página web fue como **poner el techo y las ventanas a una casa que ya tenía cimientos y paredes**.

> 🌎 **En la vida real:** es como mudarse a una casa cuando ya tienes todo empacado y etiquetado: "cocina", "cuarto", "baño". El día de la mudanza, cada caja va directo a su lugar. Si empacas el mismo día, todo es un caos.

> 🌎 **Otro ejemplo:** Es como un libro: si primero escribes el índice y los capítulos, diseñar la portada y el formato es rápido. Si diseñas la portada primero, no sabes ni qué título va.

> 🌎 **Otro ejemplo más:** Es como una receta escrita: cuando ya sabes los ingredientes y los pasos, cocinar es seguir la hoja. Inventar mientras cocinas es más lento y sale distinto cada vez.

### Lo mismo pasó con el panel

Antes de escribir una sola línea del panel de clases, la IA:

1. **Miró** cómo estaba hecho el panel de ¿Qué dice la Biblia? (para no inventar otra forma).
2. **Leyó** cómo se arman las clases y cómo funcionan las reglas de los certificados.
3. **Decidió** qué se iba a poder hacer y qué no: cambiar texto sí; agregar partes o tocar prácticas, no.
4. Recién ahí **escribió** el código, y las pruebas de esas decisiones.

Ese plan es lo que evitó que el panel rompiera los certificados.

```practica
vf :: El mapa de estudios empezó como una carpeta de lecciones en .md, antes de tener página web
vf :: La página web del mapa tuvo que inventar cómo dividir cada clase en partes
elige :: ¿Por qué la página del mapa se pudo hacer en un día? :: Porque la IA es muy rápida, nada más :: Porque el contenido, la forma de cada clase, el orden y las reglas ya existían :: Porque se copió de otra página
elige :: ¿Qué hizo la IA antes de escribir el código del panel? :: Nada, empezó a programar directo :: Miró el panel de la Biblia, leyó cómo funcionan las clases y las reglas, y decidió qué se podía hacer y qué no :: Le preguntó a otro agente
escribe :: Cuenta con tus palabras la historia del mapa de estudios y qué te enseña sobre planificar. :: Primero fue una carpeta con las lecciones, el índice, el progreso y las reglas para la IA; se estudió así varios días. Cuando se hizo la página web, salió muy rápido porque todo eso ya estaba: la página solo tuvo que leerlo. Enseña que si el plano está claro, construir es mucho más fácil.
```

## Parte 3. Las piezas de un plan

Un plan para un programa no necesita ser un libro. Una hoja bien pensada alcanza. Tiene **ocho piezas**, y cada una tiene su parecido con la casa:

| # | Pieza | La pregunta | En la casa |
|---|---|---|---|
| 1 | **El problema** | ¿Qué problema resuelve y para quién? | ¿Para quién es la casa? ¿Una familia con niños? ¿Una pareja mayor? |
| 2 | **Lo que tiene que hacer** | ¿Qué funciones necesita sí o sí? | Tres cuartos, dos baños, cocina, sala |
| 3 | **Lo que NO va (por ahora)** | ¿Qué queda fuera de esta primera versión? | La piscina, para el año que viene |
| 4 | **Los datos** | ¿Qué información se guarda y dónde? | ¿Dónde se guardan las cosas? Clósets, despensa, garaje |
| 5 | **Las pantallas** | ¿Qué ve la persona y en qué orden? | El plano de cada piso: qué hay al entrar, qué al fondo |
| 6 | **Las piezas y cómo se conectan** | ¿Qué partes tiene el programa y cómo se hablan? | Por dónde pasan el agua, la luz y el gas |
| 7 | **El orden** | ¿Qué se construye primero? | Cimientos, paredes, techo, después la pintura |
| 8 | **Cómo sé que funciona** | ¿Qué tiene que pasar para decir "terminado"? | La inspección: abrir las llaves, prender las luces |

### Un ejemplo pequeño: el plan de una app de gastos del carro

1. **El problema:** un conductor de aplicación no sabe cuánto gasta en el carro por semana.
2. **Lo que tiene que hacer:** anotar un gasto (qué, cuánto, cuándo); ver el total de la semana.
3. **Lo que NO va por ahora:** gráficos, varios carros, compartir con otra persona.
4. **Los datos:** cada gasto tiene tipo (gasolina, aceite, lavado), valor y fecha; se guardan en el teléfono.
5. **Las pantallas:** una lista de gastos con el total arriba; un botón "+" que abre el formulario.
6. **Las piezas:** la pantalla de lista, el formulario y una función que suma la semana.
7. **El orden:** primero la función que suma (con sus pruebas), después el formulario, al final la lista.
8. **Cómo sé que funciona:** anoto 3 gastos de esta semana y 1 de la pasada, y el total muestra solo los 3.

Con esa hoja, el pedido a la IA deja de ser "hazme una app de gastos" y pasa a ser "construye el paso 7.1 de este plan".

> 🌎 **En la vida real:** la pieza 3 (lo que **no** va) es la que más se olvida y la que más ayuda. Es como decirle al arquitecto: "la piscina, no por ahora". Así no te diseña la casa entera alrededor de una piscina que todavía no puedes pagar.

> 🌎 **Otro ejemplo:** La pieza 8 es como la lista de chequeo de un piloto antes de despegar: no es "me parece que está bien", es una lista de cosas que se comprueban una por una.

```practica
vf :: Un buen plan dice también lo que NO se va a hacer por ahora
vf :: El plan de un programa tiene que ser un documento larguísimo para servir
elige :: En el plan de la app de gastos, ¿qué es "cómo sé que funciona"? :: Que la app se vea bonita :: Anoto 3 gastos de esta semana y 1 de la pasada, y el total muestra solo los 3 :: Que la IA diga que está listo
elige :: ¿Qué pieza del plan se parece a "por dónde pasan el agua, la luz y el gas" en una casa? :: El problema :: Las pantallas :: Las piezas y cómo se conectan
escribe :: Escribe las ocho piezas de un plan para algo pequeño que quieras hacer (por ejemplo, una lista de compras en el teléfono). :: Problema: se me olvidan cosas del supermercado. Hace: agregar productos y tacharlos. No va por ahora: precios ni compartir. Datos: nombre del producto y si ya está comprado, guardado en el teléfono. Pantallas: una sola lista con un campo para agregar. Piezas: la lista, el campo y la función de guardar. Orden: guardar y leer, después agregar, después tachar. Funciona si: agrego 3, tacho 1, cierro la app y al abrirla siguen ahí, con 1 tachado.
```

## Parte 4. Las palabras: bosquejo, arquitectura y hoja de ruta

En el trabajo vas a escuchar varias palabras para "el plan". No son lo mismo; cada una es una parte:

| Palabra | Qué es | En la casa |
|---|---|---|
| **Requisitos** | La lista de lo que tiene que hacer (y no hacer) | "Tres cuartos, dos baños, sin piscina" |
| **Bosquejo** o **maqueta** (en inglés, *wireframe* o *mockup*) | Un dibujo simple de las pantallas, sin colores ni detalles | El dibujo a mano del plano, con rectángulos para cada cuarto |
| **Arquitectura** | Las piezas grandes del programa y cómo se conectan | La estructura: cimientos, columnas, tuberías, cables |
| **Hoja de ruta** (en inglés, *roadmap*) | El orden de construcción, por etapas | Primero cimientos, después paredes, después techo |

No necesitas programas especiales. Un **bosquejo** se hace en una hoja de papel o en una nota del iPad: rectángulos, flechas y nombres. La **arquitectura** viste cómo se piensa en la clase 10.

> 🌎 **En la vida real:** antes de una boda hay una lista de invitados (requisitos), un dibujo de cómo van las mesas (bosquejo), la decisión de quién se encarga de la comida, la música y las flores (arquitectura) y un cronograma del día (hoja de ruta).

> 🌎 **Otro ejemplo:** Es como armar un viaje en grupo: qué queremos conocer (requisitos), el mapa con los puntos marcados (bosquejo), quién maneja, quién reserva y quién lleva la plata (arquitectura), y el itinerario día por día (hoja de ruta).

```practica
vf :: Un bosquejo de pantallas se puede hacer a mano, con rectángulos y flechas
elige :: ¿Qué es la hoja de ruta (roadmap)? :: El dibujo de las pantallas :: El orden de construcción, por etapas :: La lista de errores
elige :: ¿Qué es la arquitectura de un programa? :: Los colores y las letras :: Las piezas grandes del programa y cómo se conectan :: El nombre de la app
escribe :: Explica con un ejemplo de la vida real la diferencia entre requisitos, bosquejo, arquitectura y hoja de ruta. :: En una boda: la lista de lo que se quiere (requisitos), el dibujo de las mesas (bosquejo), quién se encarga de cada cosa y cómo se coordinan (arquitectura), y el cronograma del día (hoja de ruta).
```

## Parte 5. Planificar con la IA, sin que ella decida por ti

La IA es muy buena **ayudando** a planificar. Lo importante es que te ayude a pensar, no que piense por ti.

### Cuatro formas de usarla para planificar

**1. Que te haga preguntas.** En vez de pedirle el plan, pídele que te entreviste:

```text
Quiero hacer una app para anotar los gastos del carro.
Antes de proponer nada, hazme las preguntas que necesitas para entender
qué quiero. Una a la vez.
```

> 🌎 **En la vida real:** un buen arquitecto no te dibuja una casa apenas lo saludas: primero te pregunta cuántos son, qué hacen, cuánto pueden gastar.

**2. Que te dé opciones, con lo bueno y lo malo de cada una.** "¿Guardo los gastos en el teléfono o en Firebase? Dame las dos opciones, con ventajas y desventajas, y no elijas tú." La decisión es tuya (clase 31).

**3. El modo de planificar.** Claude Code tiene un **modo plan**: la IA lee, investiga y te propone un plan, pero **no cambia ningún archivo** hasta que tú lo apruebas. Se activa con **Shift + Tab** hasta que diga "plan mode". Es perfecto para tareas grandes.

> 🌎 **En la vida real:** es como pedirle al maestro de obra el presupuesto y el plano **antes** de que empiece a romper paredes. Tú lo lees, cambias lo que no te gusta y recién ahí le dices "dale".

**4. Que revise tu plan.** "Este es mi plan. ¿Qué me falta? ¿Qué puede salir mal?" La IA es buena encontrando huecos: casos raros, datos que no pensaste, pasos en mal orden.

### Guarda el plan en un archivo

Un plan que solo está en la conversación **se pierde** cuando la conversación termina, o cuando se llena y se resume (clase 30). Guárdalo en un archivo del proyecto: `PLAN.md`, o en el `README.md`, o en las reglas (`AGENTS.md`).

Eso trae tres ventajas:

1. **Cada sesión nueva lo lee** y arranca sabiendo qué se quiere. No tienes que explicarlo de nuevo.
2. **Gastas menos tokens**: en vez de diez mensajes explicando, la IA lee una hoja.
3. **Otra IA, u otra persona, puede continuar**, como pasó con este mapa: las instrucciones de `AGENTS.md` sirven para Claude, Gemini o cualquier otra.

> 🌎 **En la vida real:** el plano de la casa no se lo dices de memoria a cada obrero nuevo: está impreso y pegado en la obra, y el que llega lo mira.

### Lo que decides tú

La IA propone; **tú** decides el problema, lo que no va, el orden y qué es "terminado". Es lo mismo que viste en la clase de los agentes: la IA agiliza, la persona dirige.

```practica
vf :: Pedirle a la IA que te haga preguntas antes de proponer nada ayuda a armar un mejor plan
vf :: En el modo plan de Claude Code, la IA cambia los archivos mientras te muestra el plan
elige :: ¿Por qué conviene guardar el plan en un archivo del proyecto? :: Porque la IA no sabe leer conversaciones :: Porque cada sesión nueva lo lee, se gastan menos tokens y otra IA o persona puede continuar :: Porque GitHub lo exige
elige :: Le pides a la IA opciones para guardar los datos. ¿Qué es lo correcto? :: Que elija ella sin explicarte :: Que te dé las opciones con ventajas y desventajas, y decidas tú :: Usar todas las opciones a la vez
escribe :: Escribe un pedido para que la IA te ayude a planificar algo, sin que decida por ti. :: Por ejemplo: "Quiero agregar un recordatorio de cambio de aceite a mi app. Antes de proponer nada, hazme las preguntas que necesitas, una a la vez. Después dame dos o tres formas de hacerlo, con ventajas y desventajas, sin elegir tú. No cambies ningún archivo hasta que yo apruebe el plan."
```

## Parte 6. Cuando el plan cambia

Un plan **no** es una ley. Mientras construyes, aprendes cosas que no sabías, y el plan se ajusta. Lo importante es que el cambio sea **una decisión**, no un accidente.

Ejemplo real: el plan del panel era "editar las clases". Al revisar, apareció algo que no estaba en el plan: las reglas de los certificados cuentan las partes. El plan cambió: "editar el texto sí; agregar partes y tocar prácticas, no". Se decidió, se escribió y se probó.

### Cómo cambiar un plan bien

1. **Para** cuando descubres algo que cambia el plan. No sigas construyendo "por las dudas".
2. **Decide** qué cambia y qué se mantiene.
3. **Actualiza el archivo** del plan, para que la próxima sesión lo sepa.
4. **Sigue** con pasos chicos, probando cada uno.

> 🌎 **En la vida real:** si al cavar los cimientos encuentras roca, el arquitecto no sigue como si nada: cambia el plano de los cimientos, lo anota y recién ahí se sigue construyendo.

> 🌎 **Otro ejemplo:** Es como el GPS cuando una calle está cerrada: recalcula la ruta. No te deja manejando contra la pared, pero tampoco cambia el destino.

> 🔁 **Repaso:** primero el plano, después los ladrillos → con la IA, más todavía, porque construye rápido lo que le dices → el mapa salió fácil porque la carpeta ya era su plano → las ocho piezas, incluida "lo que no va" y "cómo sé que funciona" → la IA te pregunta, te da opciones, planifica sin tocar nada y revisa tu plan, pero tú decides → el plan va en un archivo → si cambia, que sea una decisión.

```practica
vf :: Un plan se puede cambiar mientras construyes, siempre que sea una decisión y quede anotada
vf :: Si descubres algo que cambia el plan, lo mejor es seguir construyendo y ver después
elige :: En el panel de clases, ¿qué cambió en el plan al revisar? :: Que el panel sería en otro idioma :: Que se podía editar el texto, pero no agregar partes ni tocar prácticas, por los certificados :: Que no se iba a hacer el panel
escribe :: Explica con un ejemplo de la vida real cómo se cambia bien un plan. :: Como el GPS cuando hay una calle cerrada: recalcula la ruta sin cambiar el destino. En un programa: paro, decido qué cambia, lo anoto en el archivo del plan y sigo con pasos chicos, probando cada uno.
```

## Parte 7. Las puertas y las ventanas: lo que la IA olvida

Imagina que le pides a alguien muy rápido: "constrúyeme una casa con tres cuartos, sala y cocina". Vuelves al día siguiente y ahí está: tres cuartos, sala, cocina… pero **sin puertas**. ¿Por dónde se entra? Y sin ventanas: no entra luz. No es que lo haya hecho mal a propósito: hizo **exactamente lo que dijiste**, y nadie dijo "puertas".

Con la IA pasa lo mismo. Construye muy bien **el camino feliz**: cuando todo sale bien, la persona escribe lo correcto, hay internet y los datos llegan. Lo que se olvida son **los otros caminos**: los que nadie dice porque "son obvios".

> 🌎 **En la vida real:** es como pedirle a alguien que te prepare la maleta para un viaje: lleva la ropa, pero se olvida del cargador del teléfono. Nadie dice "el cargador" porque "es obvio".

> 🌎 **Otro ejemplo:** Es como un formulario de inscripción que funciona perfecto… hasta que alguien tiene un apellido con tilde, o dos apellidos, o ninguno.

> 🌎 **Otro ejemplo más:** Es como un restaurante que sabe atender cuando hay mesas libres, pero nadie pensó qué hacer cuando está lleno: la gente se queda parada en la puerta sin que nadie le diga nada.

### La lista de puertas y ventanas

Estas son las preguntas que casi nunca se dicen y que conviene poner **en el plan**, para que la IA las construya desde el principio:

| Puerta o ventana | La pregunta | Ejemplo |
|---|---|---|
| **Vacío** | ¿Qué se ve cuando todavía no hay nada? | La lista de gastos el primer día: ¿una pantalla en blanco, o "Todavía no anotaste gastos, toca + para empezar"? |
| **Cargando** | ¿Qué se ve mientras espera? | "Abriendo la clase…" en vez de una pantalla quieta que parece rota |
| **Error** | ¿Qué pasa si algo falla? ¿Qué le dices a la persona? | "No se guardó: la llave venció", no un mensaje en inglés con números |
| **Sin internet** | ¿Qué pasa en el túnel o en el ascensor? | ¿Se pierde lo escrito, o queda guardado en el aparato? |
| **Sin permiso** | ¿Qué pasa si entra alguien que no debería? | El panel de Copiloto saca a cualquier cuenta que no sea la del dueño |
| **Datos raros** | Tildes, ñ, textos larguísimos, números negativos, campos vacíos | El panel convierte el texto a bytes para que "Programación" no llegue roto |
| **Dos veces** | ¿Qué pasa si tocan el botón dos veces, o abren dos pestañas? | El panel manda la huella (sha) para no pisar un cambio |
| **Deshacer** | ¿Se puede volver atrás si alguien se equivoca? | "Deshacer todo" en el panel; confirmar antes de borrar |
| **Pantallas chicas** | ¿Se ve bien en el celular? | Los dibujos de la clase de los paneles se cortaban; se arreglaron antes de publicar |
| **Seguridad** | ¿Qué pasa si alguien intenta hacer trampa? | El certificado: el navegador miente, decide el servidor (clase 21) |

Fíjate que casi todos los ejemplos son del panel de este mapa: esas puertas se pensaron **en el plan**, antes de escribir el código. Por eso el panel aguanta.

### Cómo pedírselo a la IA

Pon la lista en el pedido o en las reglas del proyecto:

```text
Además del camino normal, cubre: qué se ve vacío, cargando y con error;
qué pasa sin internet; tildes y textos largos; tocar el botón dos veces;
cómo se ve en el celular. Para cada uno, dime qué decidiste.
```

Y al revisar, pregunta: "¿Qué pasa si…?". La IA es muy buena encontrando puertas que faltan **cuando se lo pides**.

```practica
vf :: La IA suele construir bien el camino feliz y olvidar los casos que nadie dice porque parecen obvios
vf :: Qué se ve cuando la lista está vacía es un detalle sin importancia que no hace falta planificar
elige :: ¿Qué "puerta" cubre el panel al mandar la huella (sha) del archivo? :: Pantallas chicas :: Dos veces: dos pestañas o dos personas guardando lo mismo :: Datos raros
elige :: ¿Dónde conviene poner la lista de puertas y ventanas? :: En ningún lado, la IA las adivina :: En el plan o en las reglas del proyecto, para que se construyan desde el principio :: Al final, cuando la app ya está publicada
escribe :: Elige una pantalla de tu app y escribe cuatro "puertas y ventanas" que habría que pensar. :: Por ejemplo, la pantalla de agregar un gasto: qué pasa si el valor queda vacío o es negativo; qué pasa sin internet (que quede guardado y se suba después); qué se ve mientras guarda; y qué pasa si toco "guardar" dos veces (que no se anote el gasto dos veces).
```

## Parte 8. El código espagueti

**Código espagueti** es código enredado: todo mezclado con todo, como un plato de espaguetis donde tiras de un fideo y se mueve el plato entero. Funciona, pero nadie entiende bien cómo, y cada cambio rompe algo en otro lado.

> 🌎 **En la vida real:** es como la instalación eléctrica de una casa vieja donde cada dueño agregó cables a su manera: hay extensiones sobre extensiones, nadie sabe qué interruptor prende qué, y cambiar un enchufe deja sin luz la cocina.

> 🌎 **Otro ejemplo:** Es como un cajón donde guardas todo: llaves, pilas, recibos, tornillos, medicinas. Al principio es rápido tirar las cosas ahí; después, encontrar algo es imposible.

> 🌎 **Otro ejemplo más:** Es como una casa a la que le fueron agregando cuartos sin plano: un cuarto que solo se alcanza pasando por el baño, una escalera que no llega a ningún lado.

### Por qué la IA lo produce fácilmente

La IA no es descuidada: trabaja **pedido por pedido**. Y cada pedido, si no hay estructura, se resuelve con un **parche**:

| Lo que hace la IA si nadie la guía | Lo que pasa después |
|---|---|
| **Copia** el mismo código en tres pantallas, en vez de hacer una pieza que usen las tres | Arreglas un error en una pantalla y las otras dos siguen rotas |
| Escribe **valores a mano** en cada lugar (un color, un tamaño, un precio) | Para cambiar el color de la app tienes que buscarlo en 700 lugares |
| Agrega todo al **mismo archivo**, que crece y crece | Un archivo de 3.000 líneas que nadie se anima a tocar |
| Hace que un archivo dependa de otro **y al revés** (un ciclo) | Cambias uno y el otro se rompe al cargar |
| **Esconde** el error para que "funcione" (clase 34) | El problema sigue ahí, pero ya no avisa |

Este desorden acumulado tiene nombre: **deuda técnica**. Como una deuda de verdad: cada atajo de hoy se paga después, con intereses. El día que quieras agregar algo, te cuesta el triple.

> 🌎 **En la vida real:** la deuda técnica es como no lavar los platos después de cada comida: un día no pasa nada; a la semana, para cocinar algo tienes que lavar primero una montaña.

```practica
vf :: El código espagueti puede funcionar, pero cada cambio rompe algo en otro lado
vf :: Si la IA copia el mismo código en tres pantallas, es más ordenado que hacer una pieza común
elige :: ¿Qué es la deuda técnica? :: Lo que cuesta el plan de la IA :: El desorden acumulado por los atajos, que se paga después con más trabajo :: Una multa de GitHub
elige :: ¿Por qué la IA produce código espagueti con facilidad si nadie la guía? :: Porque está mal programada :: Porque resuelve pedido por pedido, y sin estructura cada pedido termina en un parche :: Porque no sabe usar archivos
escribe :: Explica con un ejemplo de la vida real qué es el código espagueti y por qué es un problema. :: Es como la instalación eléctrica de una casa vieja donde cada uno agregó cables a su manera: funciona, pero nadie sabe qué interruptor prende qué, y cambiar un enchufe deja sin luz otra parte. En el código, cambiar una cosa rompe otra que no tenía nada que ver.
```

## Parte 9. Cómo se ordenó el código en los proyectos del curso

La buena noticia: el espagueti se evita con **ideas simples**, y los proyectos de este curso ya las usan. Aquí van las cinco más importantes, con sus nombres técnicos (para la entrevista) y dónde se aplicaron.

### 1. Una sola fuente de verdad

Cada dato vive en **un solo lugar**. Todo lo demás lo lee de ahí.

- **En este mapa:** el orden de cursos, etapas y clases vive **solo** en `web/cursos.js`. El número que se ve, la ruta de la barra, las migas, el menú y el mapa salen de ahí. Por eso agregar una clase es cambiar una línea.

> 🌎 **En la vida real:** es como el precio en la caja del supermercado: está en el sistema central, no escrito con marcador en cada producto. Cambias el precio una vez y todas las cajas cobran lo nuevo.

### 2. Cada pieza, una sola tarea (separar responsabilidades)

Cada archivo hace **una** cosa y no se mete en la de otros.

- **En este mapa:** `web/lector.js` lee y corta las clases, y **no sabe nada de la pantalla**; `web/markdown.js` dibuja; `web/nube.js` habla con Firebase. Si cambia el diseño, `lector.js` no se toca.
- **En el panel:** `panel-github.js` solo habla con GitHub; `panel-reglas.js` solo revisa; `panel.js` solo dibuja las pantallas.

> 🌎 **En la vida real:** en un restaurante, el cocinero cocina, el mesero atiende y el cajero cobra. Si el cocinero también cobra, se mezclan las manos con la plata y la comida.

### 3. Los motores: una pieza que todos usan

Un **motor** es una pieza única que controla algo **para toda la app**. En vez de que cada pantalla decida, todas le piden al motor.

- **En Copiloto:** los motores de diseño (`dash.*`) dan los colores, los bordes y los tamaños de todas las pantallas, y se pueden cambiar desde el panel. `Touchable` es el motor del toque: todos los botones lo usan.
- **En ¿Qué dice la Biblia?:** `css/motor.css` tiene **todos** los valores de diseño de la página, el panel y el PDF. Antes había unos **770 valores escritos a mano** repartidos por todas partes.
- **En este mapa:** el motor de referencias (escribes "clase 06" y la página pone el número del mapa y el enlace) y el motor de voz intercambiable de los audios.

> 🌎 **En la vida real:** es como la central de una cadena de comida rápida que manda el uniforme a todos los locales: si cambia el uniforme, cambia en un solo lugar y llega a todos.

### 4. Los candados: revisiones automáticas que no se pueden saltar

Un motor solo sirve si **todos** lo usan. Siempre aparece alguien (o una IA) que escribe un color a mano "porque era más rápido". Por eso existen los **candados**: programas que revisan el código **cada vez que se sube un cambio**, y si algo no cumple la regla, **no se publica** y dicen dónde está el problema.

En Copiloto, la revisión automática (el CI, clase 04) corre estos candados:

| Candado | Qué revisa |
|---|---|
| `check:design` | Ninguna pantalla escribe colores, bordes ni grosores a mano: todo sale de los motores |
| `check:cycles` | Ningún archivo depende de otro en círculo |
| `check:size` | Ningún archivo pasa de **1.000 líneas** |
| `check:secrets` | No se cuela ninguna clave secreta en el código |

En ¿Qué dice la Biblia?, el candado de diseño (`revisar-diseno.mjs`) busca valores escritos a mano antes de armar el sitio. Para comprobar que cambiar al motor no movió nada, se comparó la página nueva con la vieja **elemento por elemento**: más de 3.900 elementos, **0 diferencias**.

Y en este mapa: el panel tiene su propio candado (`panel-reglas.js`) que no deja guardar si cambian las partes o las prácticas.

> 🌎 **En la vida real:** el motor es el uniforme oficial; el candado es el **inspector** que visita los locales y no deja abrir al que se hizo su propio uniforme. Sin inspector, alguien siempre se lo salta.

> 🌎 **Otro ejemplo:** Es como la revisión técnica del carro: no importa lo seguro que digas que está; si no pasa la revisión, no sale a la calle.

### 5. Pruebas: la foto de cómo debe funcionar

Las **pruebas automáticas** (clase 02) son la red de seguridad: dicen cómo **debe** comportarse el programa. Si un cambio rompe algo, una prueba falla antes de que lo vea un usuario. Copiloto tiene más de 400; el panel de este mapa prueba que **todas** las clases se pueden abrir y guardar sin cambiar una letra.

Con pruebas, se puede **refactorizar**: ordenar el código por dentro sin cambiar lo que hace (clase 11), comparando antes y después.

> 🌎 **En la vida real:** es como sacarle una foto al cuarto antes de reorganizar los muebles: al terminar comparas y sabes si se perdió algo.

```practica
vf :: Una sola fuente de verdad quiere decir que cada dato vive en un solo lugar y todo lo demás lo lee de ahí
vf :: Si existe un motor de diseño, no hace falta un candado, porque todos lo van a usar
elige :: ¿Qué revisa el candado check:size de Copiloto? :: Que las imágenes no pesen mucho :: Que ningún archivo pase de 1.000 líneas :: Que la app abra rápido
elige :: ¿Qué quiere decir que web/lector.js "no sabe nada de la pantalla"? :: Que está roto :: Que solo lee y corta las clases; dibujar es tarea de otra pieza :: Que no se usa
elige :: ¿Cómo se comprobó que pasar al motor de diseño no cambió nada en ¿Qué dice la Biblia? :: Mirándolo rápido :: Comparando la página nueva con la vieja, elemento por elemento: más de 3.900 y 0 diferencias :: Preguntándole a la IA
escribe :: Nombra las cinco ideas para evitar el código espagueti y da un ejemplo de los proyectos del curso para dos de ellas. :: Una sola fuente de verdad, cada pieza una sola tarea, motores, candados y pruebas. Por ejemplo: la fuente de verdad es cursos.js en el mapa; los candados son check:design, check:cycles, check:size y check:secrets en Copiloto, que no dejan publicar si algo no cumple.
```

## Parte 10. Pedirle a la IA código ordenado

La IA puede escribir código muy ordenado: **si se lo pides y le pones reglas**. Así se hace:

1. **Escribe las reglas en el archivo del proyecto** (`AGENTS.md` o `CLAUDE.md`, clase 32). Por ejemplo, en Copiloto: "ninguna pantalla escribe colores a mano; todo sale de `dash.*`"; "los botones usan `Touchable`". Cada sesión las lee.
2. **Pide que reutilice antes de crear.** "Antes de escribir algo nuevo, busca si ya existe una pieza que lo haga."
3. **Pide piezas chicas, con una sola tarea.** "Pon la lógica de guardar en su propio archivo, separada de la pantalla."
4. **Pide pruebas junto con el código**, no después.
5. **Deja que los candados trabajen.** Si el CI falla, no le pidas a la IA que "lo haga pasar" a cualquier costo: pídele que arregle **la causa**. Que nunca desactive un candado ni borre una prueba para que pase.
6. **Pide una revisión de orden** de vez en cuando: "¿Hay código repetido? ¿Algún archivo hace demasiadas cosas? ¿Algún valor escrito a mano que debería venir de un motor?".

> 🌎 **En la vida real:** es como contratar albañiles con un **reglamento de obra**: "todos los enchufes de este modelo", "ninguna pared sin columna". Con el reglamento escrito y un inspector que pasa, la obra sale pareja aunque cambien los albañiles.

> 🌎 **Otro ejemplo:** Es como una cocina profesional con su manual: cada ingrediente en su lugar con etiqueta, cada cocinero en su puesto, y el chef que prueba cada plato antes de que salga.

> 🎙️ **El profesor dice:** {{alumno}}, la IA es como un equipo de obreros muy rápidos. Si les das un plano (Partes 1 a 6), una lista de puertas y ventanas (Parte 7) y un reglamento con inspector (Partes 9 y 10), te construyen una casa firme. Sin eso, te construyen rapidísimo una casa sin puertas, con los cables enredados. La diferencia no la pone la IA: la pones tú.

> 🔁 **Repaso:** el plano antes de los ladrillos → las puertas y ventanas en el plan (vacío, cargando, error, sin internet, sin permiso, datos raros, dos veces, deshacer, celular, seguridad) → el espagueti nace de los parches → se evita con una fuente de verdad, piezas de una sola tarea, motores, candados y pruebas → a la IA se le piden reglas escritas, reutilizar, piezas chicas, pruebas y arreglar la causa, nunca saltarse el candado.

```practica
vf :: Si el candado del CI falla, lo correcto es pedirle a la IA que lo desactive para poder publicar
vf :: Escribir las reglas de orden en AGENTS.md hace que cada sesión de la IA las lea y las siga
elige :: ¿Qué conviene pedirle a la IA antes de que escriba algo nuevo? :: Que lo escriba lo más largo posible :: Que busque si ya existe una pieza que lo haga, para reutilizarla :: Que copie el código de otra pantalla
elige :: ¿Cuál de estos pedidos de revisión ayuda a encontrar espagueti? :: "¿Está bonito?" :: "¿Hay código repetido, archivos que hacen demasiado o valores escritos a mano?" :: "¿Funciona?"
escribe :: Escribe tres reglas de orden que pondrías en el AGENTS.md de tu app para que la IA no haga código espagueti. :: Por ejemplo: "Ningún color, tamaño ni borde escrito a mano: todo sale de los motores de diseño." "Antes de crear una pieza nueva, busca si ya existe una que lo haga." "Cada archivo con una sola tarea y menos de 1.000 líneas; cada cambio con sus pruebas, y nunca desactives un candado para que pase el CI."
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo empiezas un proyecto con IA?":** "Antes de pedir código, planifico: qué problema resuelve y para quién, qué tiene que hacer y qué no va por ahora, qué datos guarda, un bosquejo de las pantallas, las piezas y cómo se conectan, el orden de construcción y cómo voy a saber que funciona. Uso la IA para que me haga preguntas, me dé opciones y revise el plan, pero las decisiones son mías. El plan lo guardo en un archivo del proyecto para que cada sesión nueva lo lea. Mi mapa de estudios lo muestra: empezó como una carpeta de lecciones con su índice y sus reglas, y cuando hice la página web salió en un día, porque solo tuvo que leer lo que ya estaba planificado."

> 🎤 **Si te preguntan "¿cómo evitas que la IA te haga código espagueti?":** "Con estructura y candados. Cada dato tiene una sola fuente de verdad, cada archivo una sola tarea, y lo que se repite en toda la app sale de motores, como los de diseño de Copiloto, que el dueño puede cambiar desde el panel. Las reglas están escritas en AGENTS.md, así cada sesión de la IA las lee. Y el CI corre candados que no dejan publicar si se rompen: colores escritos a mano, archivos de más de 1.000 líneas, dependencias en círculo o secretos en el código. Además le pido a la IA que cubra los casos que nadie dice, como la pantalla vacía, los errores, sin internet o tocar dos veces, y que cada cambio venga con sus pruebas."

> 🌎 **En la vida real:** es como contar cómo construiste tu casa: primero el plano y el presupuesto, después los cimientos, y cada etapa revisada antes de pasar a la siguiente.

> 🌎 **Otro ejemplo:** Es como explicar cómo organizas un viaje largo: el destino, lo que sí y lo que no, la ruta, el presupuesto y qué haces si una carretera está cerrada.
