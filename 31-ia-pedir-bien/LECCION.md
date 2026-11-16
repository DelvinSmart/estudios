# IA 2: pedir bien (prompts)

> 🌎 **En la vida real:** si al mecánico le dices "el carro anda raro", te va a cobrar por buscar. Si le dices "desde ayer, al frenar en bajada, suena un chillido en la rueda delantera derecha", lo arregla rápido. Con la IA es igual: la calidad de la respuesta depende de la calidad del pedido.

> 🎙️ **El profesor dice:** un **prompt** es el pedido que le haces a la IA. Hoy aprendes las piezas de un buen pedido, cómo darle tu código y tus errores, cómo trabajar en pasos, y un truco que tú ya usas: **mejorar el pedido con otra IA** (Gemini) antes de mandarlo a la que va a hacer el trabajo.

## Parte 1. Las piezas de un buen pedido

> 🌎 **En la vida real:** un buen pedido es como una buena orden en un restaurante: qué plato, cómo lo quieres, qué no le pongas y para cuándo.

> 🌎 **Otro ejemplo:** Es como dejarle una nota a quien cuida tu casa: qué regar, cuánto, qué no tocar y cómo avisarte.

### Contexto, tarea, límites y formato

Un buen pedido tiene cuatro piezas:
1. **Contexto:** dónde estás y qué hay (el proyecto, el archivo, la tecnología).
2. **Tarea:** qué quieres, con un verbo claro (agrega, corrige, explica, revisa).
3. **Límites:** qué **no** hacer o qué respetar (no cambies el diseño, no agregues librerías, en español).
4. **Formato y "terminado":** cómo quieres la respuesta y cómo sabes que quedó bien.

```text
❌ "arregla el login"

✅ En mi sitio (HTML, CSS y JavaScript, sin frameworks), en web/vistas/cuenta.js,
   la pantalla #/entrar muestra "No se pudo completar" al crear cuenta.
   Encuentra la causa y corrígela.
   No cambies el diseño ni agregues librerías.
   Terminado = crear cuenta con un Gmail funciona y el error muestra un mensaje claro.
```

> 🌎 **En la vida real:** es como un mandado: "trae pan" vs "trae 6 panes franceses de la panadería de la esquina, si no hay, trae integral".

> 🌎 **Otro ejemplo:** Es como pedir un corte de pelo con una foto: el peluquero sabe exactamente qué hacer.

### Dar ejemplos

Si quieres un estilo, muéstralo: "escríbelo como esta otra función" o "los textos tienen que sonar como este". Un ejemplo vale más que tres párrafos de explicación.

> 🌎 **En la vida real:** decirle a un pintor "un azul como el de esta taza" funciona mejor que "un azul medio clarito pero no tanto".

> 🌎 **Otro ejemplo:** Es como enseñarle a alguien a hacer arepas haciendo una delante de él.

```practica
vf :: "Arregla el login" es un buen pedido porque es corto
vf :: Mostrar un ejemplo del estilo que quieres ayuda a la IA
elige :: ¿Cuál es la pieza que dice qué NO hacer? :: Contexto :: Tarea :: Límites
elige :: ¿Para qué sirve decir cómo se ve "terminado"? :: Para que sea más largo :: Para que la IA (y tú) sepan cuándo la tarea quedó bien :: Para nada
escribe :: Reescribe este pedido para que sea bueno: "haz la página más bonita". :: Por ejemplo: en mi sitio de estudios (HTML y CSS), en la pantalla de inicio, separa más los botones de la barra de progreso y centra la tarjeta; respeta los colores actuales y no agregues librerías; terminado = se ve bien en computadora y en celular.
```

## Parte 2. Darle tu código y tus errores

> 🌎 **En la vida real:** es como llamar a soporte técnico: si les lees el mensaje exacto de la pantalla, te ayudan en un minuto; si dices "salió un error", tardan una hora.

> 🌎 **Otro ejemplo:** Es como llevar el carro al taller y dejarlo encendido para que escuchen el ruido, en vez de imitarlo con la boca.

### El error completo, no un resumen

Copia el **mensaje de error entero**, con el archivo y la línea, y di **qué estabas haciendo** cuando apareció. La IA lee los errores muy bien (Tema 07), pero solo si los tiene completos.

> 🌎 **En la vida real:** al médico le dices "me duele aquí desde el martes cuando subo escaleras", no "me siento mal".

> 🌎 **Otro ejemplo:** Es como un detective: necesita la escena tal como estaba, no tu versión resumida.

### Qué pasó, qué esperabas y qué ya probaste

Tres frases que ahorran mucho: **qué pasó**, **qué esperabas que pasara** y **qué ya intentaste**. Así la IA no te propone lo mismo que ya falló.

> 🌎 **En la vida real:** al plomero le cuentas que ya cambiaste el empaque: así no te cobra por hacerlo de nuevo.

> 🌎 **Otro ejemplo:** Es como pedir direcciones diciendo "ya fui por la avenida y estaba cerrada".

### Con una herramienta de código, señala el archivo

En Claude Code, OpenCode o Codex no hace falta pegar el código: la herramienta lo lee. Pero ayuda **nombrar el archivo** (`web/vistas/parte.js`) o la pantalla, para que no busque en todo el proyecto.

> 🌎 **En la vida real:** "la llave está en el segundo cajón de la cocina" vs "la llave está en algún lugar de la casa".

> 🌎 **Otro ejemplo:** Es como darle a alguien la página del libro y no solo el título.

```practica
vf :: Para un error, basta con decir "sale un error"
vf :: Decir qué ya intentaste evita que la IA te proponga lo mismo
elige :: ¿Qué tres cosas conviene contar sobre un problema? :: Tu nombre, tu edad, tu ciudad :: Qué pasó, qué esperabas y qué ya probaste :: Solo el título
elige :: En Claude Code, ¿hace falta pegar todo el archivo? :: Sí, siempre :: No: la herramienta lo lee; ayuda nombrar el archivo :: No se puede usar con archivos
escribe :: Escribe un buen pedido para este caso: al tocar "marcar entendido" no se prende el bombillo y en la consola sale un error. :: Ejemplo: en web/vistas/parte.js, al tocar "¿lo entendiste? márcalo" en una parte, no se prende el bombillo; en la consola sale este error completo: (lo pego). Esperaba que se prendiera y saliera el aviso. Ya recargué con Cmd+Shift+R. Encuentra la causa y corrígela sin cambiar el diseño.
```

## Parte 3. Trabajar en pasos

> 🌎 **En la vida real:** no construyes una casa diciendo "hazme una casa": primero el plano, después los cimientos, después las paredes, y revisas cada etapa.

> 🌎 **Otro ejemplo:** Es como armar un mueble: paso 1, paso 2… si te saltas uno, al final sobra un tornillo.

### Primero el plan

Para algo grande, pide **primero el plan**: "antes de cambiar nada, dime qué archivos tocarías y cómo". Lo lees, lo corriges y recién ahí dices "dale". Claude Code tiene un **modo plan** justamente para esto.

> 🌎 **En la vida real:** es como el presupuesto del maestro de obra: lo apruebas antes de que rompa la pared.

> 🌎 **Otro ejemplo:** Es como el itinerario de un viaje: lo revisas antes de comprar los pasajes.

### Pedazos chicos que se puedan revisar

Mejor tres pedidos chicos que uno gigante. Un cambio chico lo puedes leer, probar y guardar con un commit. Si algo sale mal, sabes dónde fue.

> 🌎 **En la vida real:** es como comer: de a bocados, no el plato entero de una vez.

> 🌎 **Otro ejemplo:** Es como pintar una pared: una mano, se seca, se revisa, otra mano.

### Corregir sin empezar de cero

Si la respuesta no es lo que querías, di **qué está mal y por qué**: "el botón quedó a la derecha; lo quiero centrado como la tarjeta". Corregir es parte normal del trabajo. Si la conversación se enredó demasiado, empieza una nueva con un resumen de lo que ya sabes.

> 🌎 **En la vida real:** en la peluquería dices "un poco más corto atrás", no te vas y buscas otro peluquero.

> 🌎 **Otro ejemplo:** Es como corregir a un GPS: "no, por la autopista no", y recalcula.

```practica
vf :: Para algo grande, conviene pedir primero el plan y aprobarlo
vf :: Un solo pedido gigante es más fácil de revisar que varios chicos
elige :: La respuesta no es lo que querías. ¿Qué haces? :: Borras todo y nunca más usas IA :: Dices qué está mal y por qué, para que corrija :: Repites el mismo pedido igual
elige :: ¿Cuándo conviene empezar una conversación nueva? :: Nunca :: Cuando la conversación se enredó o la tarea es distinta :: Después de cada mensaje
escribe :: Divide en tres pedidos chicos: "haz el login con correo, la recuperación de contraseña y la página de mi cuenta". :: 1) La pantalla de entrar y crear cuenta con correo y contraseña. 2) La recuperación de contraseña con el enlace por correo. 3) La página de mi cuenta con nombre, correo y cerrar sesión. Revisar y guardar cada uno antes del siguiente.
```

## Parte 4. Mejorar el pedido con otra IA

> 🌎 **En la vida real:** antes de mandar un correo importante, se lo muestras a un amigo que escribe bien para que te lo ordene.

> 🌎 **Otro ejemplo:** Es como pasar tus notas en limpio antes de un examen: lo que sabes es lo mismo, pero ordenado rinde más.

### Tu truco: preparar el pedido en Gemini

Tú ya lo haces: le cuentas a **Gemini** lo que quieres, con tus palabras, y le pides que lo convierta en un pedido claro para la herramienta de código. Eso se llama **meta-prompting** (usar una IA para escribir el pedido de otra). Funciona porque te obliga a ordenar la idea y te recuerda piezas que olvidaste (límites, terminado).

```text
Quiero pedirle a una IA de código este cambio: <lo cuento con mis palabras>.
Escríbeme un pedido claro con: contexto, tarea, límites y cómo se ve terminado.
Pregúntame lo que falte antes de escribirlo.
```

> 🌎 **En la vida real:** es como un traductor entre tú y el especialista: tú hablas normal, él lo pasa al idioma técnico.

> 🌎 **Otro ejemplo:** Es como el secretario que convierte tu "dile que sí pero más tarde" en un correo formal.

### Revisa lo que te devuelve

El pedido mejorado **es tuyo**: léelo antes de mandarlo. A veces la IA agrega cosas que no pediste ("y agrega pruebas para todo", "usa React") o cambia tu idea. Quita lo que sobra.

> 🌎 **En la vida real:** si un amigo te corrige la carta, la relees: no vaya a ser que haya cambiado lo que querías decir.

> 🌎 **Otro ejemplo:** Es como revisar el pedido del delivery antes de confirmar: a veces se agrega una bebida que no pediste.

### Una plantilla para tus pedidos

Guarda una plantilla en tus notas y rellénala:

```text
Proyecto: …            (qué es y con qué tecnología)
Dónde: …               (archivo o pantalla)
Quiero: …              (la tarea, con un verbo)
No hagas: …            (límites)
Ya probé: …            (si es un error)
Terminado cuando: …    (cómo lo compruebo)
```

> 🌎 **En la vida real:** es como el formulario del médico: siempre las mismas preguntas, así no se olvida ninguna.

> 🌎 **Otro ejemplo:** Es como la lista del supermercado con secciones: no se te olvida nada.

```practica
vf :: Usar una IA para escribir el pedido de otra se llama meta-prompting
vf :: El pedido que te devuelve Gemini se manda siempre tal cual, sin leerlo
elige :: ¿Por qué funciona mejorar el pedido con otra IA? :: Porque la otra IA es más inteligente siempre :: Porque ordena tu idea y te recuerda piezas que olvidaste :: Porque gasta más tokens
elige :: Gemini te devuelve un pedido que dice "usa React". Tu sitio es HTML y JavaScript puro. ¿Qué haces? :: Lo mandas así :: Lo quitas antes de mandarlo :: Cambias todo el sitio a React
escribe :: Escribe lo que le dirías a Gemini para que te prepare un pedido. :: Quiero pedirle a una IA de código que agregue un botón para volver al mapa arriba de cada parte de mi sitio; escríbeme un pedido claro con contexto, tarea, límites y cómo se ve terminado, y pregúntame lo que falte.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo le pides cosas a la IA?":** "Con contexto, tarea, límites y cómo se ve terminado. Si es un error, pego el mensaje completo, qué esperaba y qué ya probé. Para algo grande pido primero un plan y trabajo en cambios chicos que reviso uno por uno. Y a veces preparo el pedido con otra IA para ordenarlo, pero siempre lo leo antes de mandarlo."

> 🌎 **En la vida real:** es como explicar cómo das instrucciones a un equipo: claras, con límites y con una forma de comprobar el resultado.

> 🌎 **Otro ejemplo:** Es como un director de obra que muestra sus planos y su lista de revisión.
