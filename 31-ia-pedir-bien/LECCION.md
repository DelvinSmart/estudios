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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las cuatro piezas de un buen pedido
lenguaje: js
pide: Completa `queFalta(pedido)`: revisa las piezas `contexto`, `tarea`, `limites` y `terminado`, y devuelve las que faltan o están en blanco. Además, si la `tarea` existe pero **no empieza** con uno de los verbos de `VERBOS` (sin importar mayúsculas), agrega `'tarea sin verbo claro'`. Y `armar(pedido)`: las cuatro piezas en ese orden, una por línea.
--- código
const VERBOS = ['agrega', 'corrige', 'explica', 'revisa', 'encuentra', 'cambia'];

function queFalta(pedido) {
  // tu código aquí
}

function armar(pedido) {
  // tu código aquí
}
--- pruebas
const bueno = { contexto: 'En mi sitio, en web/vistas/cuenta.js', tarea: 'Corrige el error al crear cuenta', limites: 'No cambies el diseño', terminado: 'Crear cuenta con un Gmail funciona' };
prueba('completo', () => igual(queFalta(bueno), []));
prueba('"arregla el login"', () => igual(queFalta({ tarea: 'arregla el login' }), ['contexto', 'limites', 'terminado', 'tarea sin verbo claro']));
prueba('en blanco cuenta como falta', () => igual(queFalta({ ...bueno, limites: '   ' }), ['limites']));
prueba('armado', () => igual(armar(bueno).split('\n'), [bueno.contexto, bueno.tarea, bueno.limites, bueno.terminado]));
--- solución
const VERBOS = ['agrega', 'corrige', 'explica', 'revisa', 'encuentra', 'cambia'];

function queFalta(pedido) {
  const faltan = ['contexto', 'tarea', 'limites', 'terminado'].filter((p) => !String(pedido[p] ?? '').trim());
  const tarea = String(pedido.tarea ?? '').trim().toLowerCase();
  if (tarea && !VERBOS.some((v) => tarea.startsWith(v))) faltan.push('tarea sin verbo claro');
  return faltan;
}

function armar(pedido) {
  return [pedido.contexto, pedido.tarea, pedido.limites, pedido.terminado].join('\n');
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El error completo y las tres frases
lenguaje: js
pide: Completa `errorCompleto(texto)`: `true` si el texto trae el **nombre** del error (una palabra que termina en `Error`, seguida de `:`) **y** dónde pasó (algo como `archivo.js:12`). Y `pedidoDeError({ error, paso, esperaba, probe })`: el pedido en cuatro líneas: `Error: …`, `Qué pasó: …`, `Qué esperaba: …`, `Ya probé: …`; si `probe` está vacío, `Ya probé: nada todavía`.
--- código
function errorCompleto(texto) {
  // tu código aquí
}

function pedidoDeError({ error, paso, esperaba, probe }) {
  // tu código aquí
}
--- pruebas
prueba('un error con todo', () => igual(errorCompleto('TypeError: Cannot read properties of undefined\n    at guardar (web/vistas/cuenta.js:42:7)'), true));
prueba('"no funciona" no es un error', () => igual(errorCompleto('no funciona el botón'), false));
prueba('sin dónde, tampoco', () => igual(errorCompleto('TypeError: x is undefined'), false));
prueba('el pedido', () => igual(pedidoDeError({ error: 'TypeError en cuenta.js:42', paso: 'toqué Crear cuenta', esperaba: 'entrar al mapa', probe: '' }), 'Error: TypeError en cuenta.js:42\nQué pasó: toqué Crear cuenta\nQué esperaba: entrar al mapa\nYa probé: nada todavía'));
--- solución
function errorCompleto(texto) {
  return /\b\w*Error:/.test(texto) && /\w+\.\w+:\d+/.test(texto);
}

function pedidoDeError({ error, paso, esperaba, probe }) {
  return [`Error: ${error}`, `Qué pasó: ${paso}`, `Qué esperaba: ${esperaba}`, `Ya probé: ${probe || 'nada todavía'}`].join('\n');
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pedazos chicos que se puedan revisar
lenguaje: js
pide: Completa `esChico(cambio)`: `true` si toca como mucho 3 archivos y cambia como mucho 200 líneas. Y `enPedazos(pasos, maximo)`: agrupa los pasos (en su orden) en commits de hasta `maximo` pasos cada uno.
--- código
function esChico(cambio) {
  // tu código aquí
}

function enPedazos(pasos, maximo) {
  // tu código aquí
}
--- pruebas
prueba('chico', () => igual(esChico({ archivos: 2, lineas: 80 }), true));
prueba('los bordes', () => igual([esChico({ archivos: 3, lineas: 200 }), esChico({ archivos: 4, lineas: 10 }), esChico({ archivos: 1, lineas: 201 })], [true, false, false]));
prueba('en pedazos de 2', () => igual(enPedazos(['reglas', 'progreso', 'certificado', 'verificar', 'login'], 2), [['reglas', 'progreso'], ['certificado', 'verificar'], ['login']]));
prueba('sin pasos', () => igual(enPedazos([], 3), []));
--- solución
function esChico(cambio) {
  return cambio.archivos <= 3 && cambio.lineas <= 200;
}

function enPedazos(pasos, maximo) {
  const grupos = [];
  for (let i = 0; i < pasos.length; i += maximo) grupos.push(pasos.slice(i, i + maximo));
  return grupos;
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Rellenar tu plantilla de pedidos
lenguaje: js
pide: Tu plantilla tiene líneas como `Quiero: …`. Completa `rellenar(plantilla, datos)`: en cada línea con `…`, cambia el `…` por `datos[etiqueta]` (la etiqueta es lo que va antes de `:`, en minúsculas y sin tildes: `Dónde` → `donde`). Si no hay dato, deja el `…`. Devuelve `{ texto, faltan }`, con `faltan` = las etiquetas sin dato, como están escritas.
--- código
function rellenar(plantilla, datos) {
  // tu código aquí
}
--- pruebas
const plantilla = 'Proyecto: …\nDónde: …\nQuiero: …\nNo hagas: …\nTerminado cuando: …';
const datos = { proyecto: 'Mapa de estudios (HTML, CSS y JS)', donde: 'web/vistas/parte.js', quiero: 'Agrega un botón de imprimir', 'no hagas': 'No agregues librerías' };
prueba('rellena lo que hay', () => igual(rellenar(plantilla, datos).texto.split('\n').slice(0, 4), ['Proyecto: Mapa de estudios (HTML, CSS y JS)', 'Dónde: web/vistas/parte.js', 'Quiero: Agrega un botón de imprimir', 'No hagas: No agregues librerías']));
prueba('y avisa lo que falta', () => igual(rellenar(plantilla, datos).faltan, ['Terminado cuando']));
prueba('lo que falta queda con …', () => igual(rellenar(plantilla, datos).texto.split('\n')[4], 'Terminado cuando: …'));
--- solución
function rellenar(plantilla, datos) {
  const faltan = [];
  const texto = plantilla
    .split('\n')
    .map((linea) => {
      if (!linea.includes('…')) return linea;
      const etiqueta = linea.split(':')[0].trim();
      const llave = etiqueta.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      if (!datos[llave]) {
        faltan.push(etiqueta);
        return linea;
      }
      return linea.replace('…', datos[llave]);
    })
    .join('\n');
  return { texto, faltan };
}
```

```practica
vf :: Usar una IA para escribir el pedido de otra se llama meta-prompting
vf :: El pedido que te devuelve Gemini se manda siempre tal cual, sin leerlo
elige :: ¿Por qué funciona mejorar el pedido con otra IA? :: Porque la otra IA es más inteligente siempre :: Porque ordena tu idea y te recuerda piezas que olvidaste :: Porque gasta más tokens
elige :: Gemini te devuelve un pedido que dice "usa React". Tu sitio es HTML y JavaScript puro. ¿Qué haces? :: Lo mandas así :: Lo quitas antes de mandarlo :: Cambias todo el sitio a React
escribe :: Escribe lo que le dirías a Gemini para que te prepare un pedido. :: Quiero pedirle a una IA de código que agregue un botón para volver al mapa arriba de cada parte de mi sitio; escríbeme un pedido claro con contexto, tarea, límites y cómo se ve terminado, y pregúntame lo que falte.
```

## Parte 5. El pedido completo, la duda y las fuentes

La IA responde **exactamente lo que preguntaste**, no lo que querías saber. Si el pedido está incompleto, la respuesta también lo va a estar, aunque la IA sepa mucho más.

### Una historia real: la pregunta que cambió todo

Construyendo este mapa de estudios, se le pidió muchas veces a la IA: "agrega una clase de esto", "agrega ejercicios de aquello". La IA lo hacía, y bien. Pero un día la pregunta fue otra:

> "¿De verdad alguien que no sabe nada aprendería con esto? ¿Podría construir una app como las mías? Sé sincero."

La respuesta fue honesta: **todavía no**. Faltaban ejercicios donde el alumno escriba código, proyectos de principio a fin, y había ejercicios que nadie más podía hacer. De esa sola pregunta salió el plan para mejorar **todos** los cursos.

¿Qué cambió? Los pedidos anteriores eran **incompletos**: decían qué agregar, pero no **para qué** ni **cómo saber si estaba bien**. La pregunta nueva sí: tenía el objetivo (que alguien aprenda de verdad), el criterio (poder construir una app) y pedía sinceridad.

> 🌎 **En la vida real:** si al arquitecto le dices "agrégale un cuarto a la casa", te agrega un cuarto. Si le dices "somos cinco y la casa se nos queda chica, ¿qué nos conviene?", te puede decir que el problema es la cocina, no los cuartos.

> 🌎 **Otro ejemplo:** Es como preguntarle al médico "¿me da algo para la tos?" en vez de "tengo tos hace tres semanas, ¿qué puede ser?". La primera pregunta te da un jarabe; la segunda, un diagnóstico.

### El prompt completo

Lo que tú llamas "un comando completo", en el mundo de la IA se llama un **prompt completo**. Tiene cinco piezas (las primeras cuatro ya las viste en la Parte 1; la quinta es la que más se olvida):

| Pieza | La pregunta | Ejemplo |
|---|---|---|
| **El objetivo** | ¿Para qué lo quiero? | "Quiero que una persona que no sabe nada pueda construir una app con este curso" |
| **El contexto** | ¿Qué hay hoy? | "El curso tiene 9 clases con explicaciones y prácticas de elegir" |
| **Qué es "terminado"** | ¿Cómo sé que está bien? | "Que al final pueda hacer una app de gastos desde cero, sola" |
| **Los límites** | ¿Qué no se vale? | "Solo herramientas gratis" |
| **El formato** | ¿Cómo quiero la respuesta? | "Primero un sí o no, después qué falta, en una lista" |

### Sembrar la duda: pedir una crítica honesta

Las IA tienen una tendencia conocida: **darte la razón**. Si preguntas "¿está bien esto?", suelen decir que sí. A eso se le llama **complacencia** (en inglés, *sycophancy*). Para sacarle la verdad, hay que **pedirle que busque los problemas**:

```text
Revisa esto como si fueras alguien que quiere encontrarle fallas.
¿Qué le falta? ¿Qué está mal? ¿Qué no funcionaría con una persona real?
Sé sincero aunque la respuesta no me guste.
```

Cuando la IA tiene que buscar el problema, **lo busca**, y casi siempre lo encuentra. Es lo que tú llamas "sembrar la duda".

> 🌎 **En la vida real:** si le preguntas a un amigo "¿me queda bien la camisa?", te dice que sí. Si le dices "voy a una entrevista importante, dime con toda sinceridad qué cambiarías", te dice la verdad.

> 🌎 **Otro ejemplo:** Es como el inspector de una obra: si va a "aprobar", aprueba; si va a "buscar fallas", las encuentra.

### Pedir las fuentes: la IA a veces inventa

Una IA puede **inventar** con toda seguridad: una función que no existe, un dato equivocado, un precio viejo. A eso se le llama **alucinar** (clase 30). Por eso, cuando algo importa, **pide la fuente**:

```text
¿De dónde sacaste esa información? Dame el enlace a la documentación oficial.
Si no estás seguro, dímelo.
```

Y **comprueba** la fuente, porque la IA también puede inventar enlaces. Abre el enlace y busca la frase. Si la herramienta puede buscar en internet, pídele que busque en vez de responder de memoria.

> 🌎 **En la vida real:** si alguien te dice "lo dijo el noticiero", le preguntas "¿cuál?, ¿cuándo?". Un dato con fuente se puede revisar; un "me dijeron" no.

> 🌎 **Otro ejemplo:** Es como el mecánico que te muestra la pieza rota en vez de solo decirte "estaba mala".

### Cada pregunta a la IA que conviene

No todas las preguntas tienen que ir a la misma IA:

| Tipo de pregunta | A quién | Por qué |
|---|---|---|
| "¿Cómo funciona X?", "explícame Y", preparar un pedido | Una IA de chat (por ejemplo, **Gemini**) | Es para aprender: no necesita tu proyecto, y no gasta los tokens del agente de código |
| "Cambia esto en mi proyecto", "busca este error" | El agente de código (por ejemplo, **Claude Code**) | Necesita leer y cambiar tus archivos |

Así **ahorras tokens**: cada pregunta de "cómo funciona" que haces en la conversación del agente de código se suma a su contexto y encarece cada mensaje siguiente (clase 30 y la de los agentes). Y de paso, si las dos IA dicen lo mismo, tienes más confianza; si dicen distinto, **ahí** hay que revisar la fuente.

> 🌎 **En la vida real:** al mecánico de confianza no le preguntas qué es un carburador: eso lo buscas en un libro o le preguntas a un amigo. Al mecánico le llevas el carro.

> 🌎 **Otro ejemplo:** Es como pedir una segunda opinión médica: si los dos médicos coinciden, tranquilo; si no, se piden más exámenes.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: A quién preguntar, y sembrar la duda
lenguaje: js
pide: Completa `aQuien(pregunta)`: si pide **cambiar algo del proyecto** (tiene `cambia`, `agrega`, `corrige`, `en mi proyecto` o `este error`) → `'agente de código'`; si es para **aprender** (`cómo funciona`, `explícame`, `qué es`) → `'chat'`; si no, `'chat'`. Revisa primero lo del agente, en minúsculas. Y `conDuda(pregunta)`: agrega al final, en otra línea, `'Busca fallas como si quisieras rechazarlo, y dime de dónde sacas cada dato.'`.
--- código
function aQuien(pregunta) {
  // tu código aquí
}

function conDuda(pregunta) {
  // tu código aquí
}
--- pruebas
prueba('para aprender, al chat', () => igual([aQuien('¿Cómo funciona onSnapshot?'), aQuien('Explícame qué es un token')], ['chat', 'chat']));
prueba('para cambiar el proyecto, al agente', () => igual([aQuien('Corrige este error en cuenta.js'), aQuien('Agrega un botón en mi proyecto')], ['agente de código', 'agente de código']));
prueba('sin pistas, al chat', () => igual(aQuien('¿Qué opinas de mi idea?'), 'chat'));
prueba('sembrar la duda', () => igual(conDuda('¿Está bien este curso?'), '¿Está bien este curso?\nBusca fallas como si quisieras rechazarlo, y dime de dónde sacas cada dato.'));
--- solución
function aQuien(pregunta) {
  const p = pregunta.toLowerCase();
  if (['cambia', 'agrega', 'corrige', 'en mi proyecto', 'este error'].some((x) => p.includes(x))) return 'agente de código';
  return 'chat';
}

function conDuda(pregunta) {
  return `${pregunta}\nBusca fallas como si quisieras rechazarlo, y dime de dónde sacas cada dato.`;
}
```

```practica
vf :: Si el pedido es incompleto, la respuesta de la IA también tiende a serlo, aunque la IA sepa más
vf :: Si le preguntas a la IA "¿está bien esto?", lo normal es que te diga con detalle todo lo que está mal
vf :: Una IA también puede inventar un enlace de "fuente", por eso hay que abrirlo y comprobarlo
elige :: ¿Qué pieza del prompt completo es la que más se olvida y más cambia la respuesta? :: El saludo :: El objetivo y qué es "terminado" :: El idioma
elige :: Quieres entender qué es un closure mientras trabajas en tu proyecto con Claude Code. ¿Qué conviene? :: Preguntarlo en la misma conversación del proyecto :: Preguntarlo en una IA de chat aparte, como Gemini :: No preguntarlo
escribe :: Escribe un prompt completo (objetivo, contexto, terminado, límites y formato) y una pregunta para pedir una crítica honesta sobre algo tuyo. :: Por ejemplo: "Objetivo: que mi app de gastos sirva a conductores que no saben de tecnología. Contexto: hoy tiene un formulario y una lista. Terminado: que alguien la use sin ayuda la primera vez. Límites: sin pagar nada. Formato: una lista de lo que falta, de lo más grave a lo menos." Y: "Revísala como alguien que quiere encontrarle fallas; sé sincero aunque no me guste."
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo le pides cosas a la IA?":** "Con contexto, tarea, límites y cómo se ve terminado. Si es un error, pego el mensaje completo, qué esperaba y qué ya probé. Para algo grande pido primero un plan y trabajo en cambios chicos que reviso uno por uno. Y a veces preparo el pedido con otra IA para ordenarlo, pero siempre lo leo antes de mandarlo. Cuando algo importa, pido una crítica honesta en vez de "¿está bien?", y pido la fuente y la compruebo, porque la IA a veces inventa. Las preguntas de aprender las hago en una IA de chat, para no gastar los tokens del agente de código."

> 🌎 **En la vida real:** es como explicar cómo das instrucciones a un equipo: claras, con límites y con una forma de comprobar el resultado.

> 🌎 **Otro ejemplo:** Es como un director de obra que muestra sus planos y su lista de revisión.
