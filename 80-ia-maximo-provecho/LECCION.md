# IA 9: sacarle el máximo provecho a la IA

> 🌎 **En la vida real:** dos personas compran la misma caja de herramientas. Una la usa para colgar un cuadro y la guarda. La otra aprende a usar cada herramienta, se arma un banco de trabajo y termina haciendo sus propios muebles. La caja es la misma; lo que cambia es **cómo** se usa.

> 🎙️ **El profesor dice:** {{alumno}}, en las clases anteriores viste cómo planificar, cómo ordenar el código y cómo dirigir a uno o varios agentes. Esta clase es sobre **sacarle el jugo**: usar la IA para **aprender** mientras trabajas, para **no repetir** trabajo aburrido, y para dejar herramientas que sigan funcionando aunque la IA no esté. Casi todo lo que vas a ver salió de los proyectos reales de este curso: Copiloto, ¿Qué dice la Biblia? y este mapa.

## Parte 1. Aprender mientras construyes

La forma más común de usar la IA es: "hazme esto". Funciona, pero al final tienes el trabajo hecho y **no aprendiste nada**. El día que la IA no esté, o que tengas que explicarlo en una entrevista, te quedas en blanco (clase 35).

Hay otra forma, y es la que se usó para armar este curso: **cada vez que se hace algo, pides que te lo explique y que quede escrito como una clase.**

### El método, paso a paso

1. **Se construye algo de verdad**: arreglar Copiloto, hacer el sitio de la Biblia, el certificado, el panel.
2. **Se pide la explicación**: "explícame cómo funciona, como si no supiera nada".
3. **Se guarda como clase**, con ejemplos de la vida real y prácticas.
4. **Se estudia** después, con la IA como profesor y no como programador: tú escribes, ella corrige.
5. **Se simula la entrevista**: si no lo puedes explicar con tus palabras, el tema no está terminado.

Este mapa entero nació así. Mira de dónde salen sus clases:

| Lo que se construyó | La clase que salió de ahí |
|---|---|
| Arreglar la velocidad y el orden de Copiloto | Cómo arreglé Copiloto |
| El sitio de estudios bíblicos | Cómo hice Estudios Bíblicos y ¿Qué dice la Biblia? por dentro |
| La web de Copiloto | Cómo hice la web de Copiloto |
| Este mapa | Cómo hice mi mapa de estudios |
| El certificado que no se deja engañar | El certificado verificable |
| Los paneles | Cómo hice los paneles |
| Trabajar con dos agentes a la vez | Uno o varios agentes, y dirigirlos |

> 🌎 **En la vida real:** es como un aprendiz de mecánico que, cada vez que el maestro arregla un carro, le pregunta "¿por qué hiciste eso?" y lo anota en su cuaderno. En un año, el cuaderno es un manual, y el aprendiz ya es mecánico.

> 🌎 **Otro ejemplo:** Es como cocinar con tu abuela: no basta con comer el plato; si le preguntas cada paso y lo escribes, la receta queda en la familia.

> 🌎 **Otro ejemplo más:** Es como un diario de viaje: el viaje pasa, pero lo que anotaste te deja recordar y contar cada lugar.

### Por qué funciona tan bien

- **Los ejemplos son de verdad.** No aprendes con "Juan tiene 3 manzanas": aprendes con el tanque de un carro, una app publicada y sus usuarios reales. Y si haces tus propios proyectos, mejor todavía: lo tuyo se recuerda más.
- **Explicar es la mejor forma de aprender.** Si lo puedes explicar con palabras simples, lo entendiste. Si no, sabes exactamente qué te falta. (Esta idea tiene nombre: la **técnica Feynman**, por un físico que enseñaba así.)
- **Queda escrito.** Lo que solo está en una conversación se pierde; lo que está en una clase, lo repasas cuando quieras, desde el iPad.

### Pedidos para aprender (no solo para hacer)

```text
Explícame lo que acabas de hacer como si yo no supiera nada de programación,
paso a paso, con un ejemplo de la vida real.
```

```text
Hazme 5 preguntas, una a la vez, para ver si entendí. No me des la respuesta
hasta que yo conteste.
```

```text
Dame un ejercicio parecido para que lo resuelva yo. Después corrígeme:
primero dime qué acerté.
```

```text
Convierte lo que hicimos hoy en una clase para mi mapa de estudios:
con partes, ejemplos de la vida real y prácticas.
```

> 🧩 **Piezas para este ejercicio**
> - Divide por oraciones para limitar dónde buscas la explicación. Un mismo término puede aparecer en varias, así que revisa el contexto de cada aparición.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Lo puedes explicar con palabras simples?
lenguaje: js
pide: La técnica Feynman: si lo explicas simple, lo entendiste. Completa `palabrasSinExplicar(texto, tecnicas)`: de la lista de palabras técnicas, devuelve las que aparecen en el texto (sin importar mayúsculas) y **no** van seguidas, más adelante en la misma oración, de una explicación entre paréntesis. En el orden de la lista.
--- código
function palabrasSinExplicar(texto, tecnicas) {
  // tu código aquí
}
--- pruebas
const tecnicas = ['token', 'worktree', 'idempotente', 'caché'];
prueba('todas explicadas', () => igual(palabrasSinExplicar('Cada token (un pedacito de texto) cuesta. Un worktree (otra carpeta del mismo proyecto) evita pisarse.', tecnicas), []));
prueba('una sin explicar', () => igual(palabrasSinExplicar('La caché ahorra. Cada token (un pedacito de texto) cuesta.', tecnicas), ['caché']));
prueba('la explicación tiene que estar en la misma oración', () => igual(palabrasSinExplicar('Usa un Worktree. (Es otra carpeta.)', tecnicas), ['worktree']));
--- solución
function palabrasSinExplicar(texto, tecnicas) {
  const oraciones = texto.toLowerCase().split(/(?<=\.)\s+/);
  return tecnicas.filter((palabra) => {
    const donde = oraciones.filter((o) => o.includes(palabra));
    return donde.length > 0 && donde.some((o) => !/\(/.test(o.slice(o.indexOf(palabra))));
  });
}
```

```practica
vf :: Pedirle a la IA que te explique lo que hizo y que quede escrito como clase es una forma de aprender mientras trabajas
vf :: Si la IA hace todo el trabajo, igual vas a poder explicarlo en una entrevista
elige :: ¿Por qué se aprende mejor con ejemplos de proyectos reales? :: Porque son más cortos :: Porque son cosas que conoces y te importan, y por eso se recuerdan :: Porque la IA no sabe otros ejemplos
elige :: ¿Qué dice la técnica Feynman? :: Que hay que leer mucho :: Que si puedes explicarlo con palabras simples, lo entendiste; si no, sabes qué te falta :: Que la IA aprende sola
escribe :: Escribe con tus palabras los pasos del método para aprender mientras construyes. :: Construyo algo de verdad; le pido a la IA que me lo explique como si no supiera nada; lo guardo como clase, con ejemplos de la vida real y prácticas; lo estudio después escribiendo yo y dejando que la IA corrija; y simulo la entrevista: si no lo puedo explicar, no está terminado.
```

## Parte 2. Convertir lo repetitivo en una herramienta

Hay trabajos que se repiten: contar cosas, copiar datos de un lado a otro, publicar una versión nueva, instalar la app en el teléfono. Hacerlos a mano cada vez es aburrido y es donde más errores se cometen.

La regla es simple: **si vas a hacer algo más de dos o tres veces, no se lo pidas a la IA cada vez: pídele que te haga una herramienta que lo haga sola.** La IA escribe la herramienta **una vez**; la herramienta trabaja **para siempre**, rápido, igual cada vez y **sin gastar tokens**.

> 🌎 **En la vida real:** si todos los días haces jugo exprimiendo naranjas a mano, un día te compras un exprimidor. Lo pagas una vez y te ahorra tiempo todos los días.

> 🌎 **Otro ejemplo:** Es como la plantilla de una factura: no la diseñas cada vez; la haces una vez y solo cambias el nombre y el valor.

> 🌎 **Otro ejemplo más:** Es como programar el riego del jardín: en vez de acordarte de regar cada mañana, pones el temporizador una vez.

### Lo que ya se convirtió en herramienta en estos proyectos

| El trabajo repetitivo | La herramienta | Qué hace sola |
|---|---|---|
| Contar las partes de cada curso para las reglas del certificado | `generar-reglas.mjs` (este mapa) | Lee todas las clases y escribe las reglas |
| Sacar las respuestas de las prácticas de cada clase | `separar-respuestas.mjs` (este mapa) | Las saca de los `.md` y las guarda en el archivo privado |
| Grabar el audio de cada parte | La acción "Audios de las clases" en GitHub | Al subir una clase, rehace solo los audios que cambiaron |
| Copiar versículos a mano en un estudio | "Leer capturas" en el panel de la Biblia | Lee las fotos de una app de la Biblia y pone cada versículo en su lugar, dentro del navegador |
| Armar el sitio y los PDF de la Biblia | La acción `publicar.yml` | En cada cambio, arma el sitio, genera los PDF y publica |
| Sacar una versión nueva de Copiloto | `release.sh` | Revisa los tipos, arma Android y iPhone, escribe la nota de versión y sube |
| Instalar Copiloto en tu iPhone | `instalar-iphone.sh` | Compila e instala, con cable o por Wi-Fi |
| Editar una clase desde el iPad | El panel de clases | Abre, revisa y publica sin abrir la computadora |

Mira el ejemplo de los versículos: el panel de la Biblia lee las **capturas de pantalla** de una app de la Biblia con una herramienta gratuita que reconoce letras en fotos (se llama **OCR**: reconocimiento de texto), **dentro del navegador**, sin subir las fotos a ningún lado. Antes era copiar versículo por versículo; ahora es escoger las fotos y revisar.

### Cómo pedir una herramienta

```text
Cada semana hago esto a mano: [describe los pasos].
Hazme un script que lo haga solo. Que me diga qué hizo, que avise si algo
sale mal, y explícame cómo usarlo y cómo funciona.
```

Fíjate en el final: "explícame cómo funciona". Así la herramienta no es una caja negra: la entiendes y la puedes arreglar.

> 🧩 **Piezas para este ejercicio**
> - Primero calcula los minutos que se ahorran en una semana. Divide el costo de hacer la herramienta entre ese ahorro y redondea hacia arriba.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Vale la pena hacerla herramienta?
lenguaje: js
pide: Completa `semanasParaRecuperar({ vecesPorSemana, minutosCadaVez, minutosHacerla })`: cuántas semanas tarda la herramienta en devolverte el tiempo que costó hacerla (hacia arriba). Y `conviene(tarea)`: `true` si se recupera en 4 semanas o menos, **o** si la tarea se hace más de 3 veces por semana (donde más errores se cometen a mano).
--- código
function semanasParaRecuperar({ vecesPorSemana, minutosCadaVez, minutosHacerla }) {
  // tu código aquí
}

function conviene(tarea) {
  // tu código aquí
}
--- pruebas
const reglas = { vecesPorSemana: 5, minutosCadaVez: 10, minutosHacerla: 60 };
prueba('las reglas del certificado', () => igual(semanasParaRecuperar(reglas), 2));
prueba('algo de una vez al mes', () => igual(semanasParaRecuperar({ vecesPorSemana: 0.25, minutosCadaVez: 20, minutosHacerla: 120 }), 24));
prueba('conviene', () => igual([conviene(reglas), conviene({ vecesPorSemana: 0.25, minutosCadaVez: 20, minutosHacerla: 120 })], [true, false]));
prueba('muy seguido, aunque tarde en recuperarse', () => igual(conviene({ vecesPorSemana: 4, minutosCadaVez: 1, minutosHacerla: 300 }), true));
--- solución
function semanasParaRecuperar({ vecesPorSemana, minutosCadaVez, minutosHacerla }) {
  return Math.ceil(minutosHacerla / (vecesPorSemana * minutosCadaVez));
}

function conviene(tarea) {
  return semanasParaRecuperar(tarea) <= 4 || tarea.vecesPorSemana > 3;
}
```

```practica
vf :: Si un trabajo se repite muchas veces, conviene pedirle a la IA una herramienta que lo haga sola
vf :: Pedirle a la IA que haga el mismo trabajo a mano cada semana es lo más barato
elige :: ¿Qué hace generar-reglas.mjs en este mapa? :: Escribe las clases nuevas :: Lee todas las clases, cuenta sus partes y escribe las reglas del certificado :: Graba los audios
elige :: ¿Qué es el OCR que usa "Leer capturas"? :: Un tipo de base de datos :: Reconocimiento de texto: lee las letras que hay en una foto :: Un idioma de programación
escribe :: Piensa en algo que hagas a mano seguido (en la app, en el trabajo o en tus estudios) y escribe el pedido para que la IA te haga una herramienta. :: Por ejemplo: "Cada semana copio los gastos del carro de la app a una planilla para ver el total del mes. Hazme un script que lea los gastos y arme la planilla sola. Que me diga cuántos gastos leyó, que avise si alguno tiene un valor raro, y explícame cómo funciona y cómo usarlo."
```

## Parte 3. Herramientas que funcionan sin la IA

Hay un detalle muy importante en las herramientas de la Parte 2: **ninguna necesita la IA para funcionar.** La IA las escribió, pero son programas comunes. Si mañana se te acaban los tokens, o la herramienta de IA no funciona, **siguen andando**.

Copiloto tiene el mejor ejemplo: `scripts/tareas.sh`, un **menú de tareas** que dice en su primera línea que funciona *sin inteligencia artificial*, "aunque se acaben los tokens". Escribes un número y hace la tarea: abrir el emulador del iPhone, instalar en el Samsung, hacer el commit, armar la versión para Google Play, publicar el panel…

```text
1) emulador del iPhone      5) commit
2) Android final            6) versión para Google Play
3) iPhone                   7) panel
4) Samsung                  8) versión + commit + panel
```

> 🌎 **En la vida real:** es como tener una linterna además de la luz eléctrica: el día del apagón, sigues viendo.

> 🌎 **Otro ejemplo:** Es como saber el número de teléfono de tu mamá de memoria: si se te pierde el celular, igual la puedes llamar.

### Y cuando sí quieres IA, que sea gratis si se puede

Para tareas chicas y repetitivas, a veces conviene un **modelo local**: una IA que corre en tu propia computadora, sin internet y sin costo (clase 33). En Copiloto, `vigia.sh` es un vigilante que cada 30 segundos mira si cambió algo en la carpeta del plan y, si cambió, le pide a un modelo local (con **Ollama**) un resumen del avance en dos líneas. No gasta tokens de ningún plan.

> 🌎 **En la vida real:** es como tener una cafetera en casa en vez de comprar café en la calle cada vez: para el café de todos los días, sale gratis.

> 🧩 **Piezas para este ejercicio**
> - Una línea puede traer más de una opción. Usa el siguiente marcador de número como límite de la tarea anterior y quita el espacio de los extremos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un menú de tareas que funciona sin IA
lenguaje: js
pide: Completa `leerMenu(texto)`: el menú tiene líneas como `1) emulador del iPhone      5) commit` (dos opciones por línea). Devuelve un objeto número → tarea, con los números como texto y las tareas sin espacios de más. Y `elegir(texto, numero)`: la tarea de ese número, o `null` si no existe.
--- código
function leerMenu(texto) {
  // tu código aquí
}

function elegir(texto, numero) {
  // tu código aquí
}
--- pruebas
const menu = `1) emulador del iPhone      5) commit
2) Android final            6) versión para Google Play
3) iPhone                   7) panel
4) Samsung                  8) versión + commit + panel`;
prueba('lee el menú', () => igual(leerMenu(menu)['6'], 'versión para Google Play'));
prueba('las ocho', () => igual(Object.keys(leerMenu(menu)).sort(), ['1', '2', '3', '4', '5', '6', '7', '8']));
prueba('elegir', () => igual([elegir(menu, 8), elegir(menu, '3'), elegir(menu, 9)], ['versión + commit + panel', 'iPhone', null]));
--- solución
function leerMenu(texto) {
  const tareas = {};
  for (const m of texto.matchAll(/(\d+)\)\s+(.+?)(?=\s{2,}\d+\)|$)/gm)) tareas[m[1]] = m[2].trim();
  return tareas;
}

function elegir(texto, numero) {
  return leerMenu(texto)[String(numero)] ?? null;
}
```

```practica
vf :: Un script que escribió la IA sigue funcionando aunque se acaben los tokens
vf :: tareas.sh de Copiloto necesita a Claude para funcionar
elige :: ¿Qué hace vigia.sh en Copiloto? :: Publica la app en Google Play :: Mira la carpeta del plan cada 30 segundos y, si cambió algo, pide a un modelo local un resumen de dos líneas :: Borra los archivos viejos
escribe :: Explica con un ejemplo de la vida real por qué conviene que tus herramientas funcionen sin la IA. :: Como tener una linterna además de la luz eléctrica: si un día se acaban los tokens o la herramienta de IA falla, puedo seguir publicando, instalando y trabajando con mis scripts, igual que con la linterna en un apagón.
```

## Parte 4. Más formas de aprovecharla

Además de aprender y automatizar, hay usos que ahorran mucho trabajo:

| Uso | Cómo | Ejemplo en estos proyectos |
|---|---|---|
| **Segunda opinión** | "Revisa esto como si fueras un atacante" o "¿qué puede salir mal?" | La auditoría de seguridad de Copiloto (clase 24) |
| **Explicar un error** | Pegar el error completo y el archivo: "¿qué quiere decir y por dónde empiezo?" | Leer errores (clase 07) |
| **Comparar opciones** | "Dame dos o tres formas, con ventajas y desventajas, sin elegir tú" | Elegir la voz gratis para los audios |
| **Documentar** | "Escribe cómo funciona esto para alguien que llega nuevo" | Los `LEEME.md` y los informes de Copiloto |
| **Traducir** | Textos de la app o documentos a otro idioma, revisando el resultado | Copiloto en seis idiomas: español, portugués, inglés, francés, italiano y alemán |
| **Preparar el pedido con otra IA** | Pedirle a una IA que mejore el pedido antes de dárselo a la otra | Pedir bien (clase 31) |
| **Estudiar desde cualquier lado** | Una IA de chat con tus clases, desde el iPad | Cómo estudiar con otra IA y desde el iPad |

> 🌎 **En la vida real:** es como tener en el bolsillo a un compañero de trabajo que sabe un poco de todo: te ayuda a revisar, a traducir, a escribir el informe y a estudiar, pero la firma la pones tú.

> 🌎 **Otro ejemplo:** Es como un celular: puedes usarlo solo para llamar, o para el banco, el mapa, la cámara, el traductor y aprender idiomas. El aparato es el mismo; el provecho depende de ti.

> 🧩 **Piezas para este ejercicio**
> - El uso elige una plantilla. El detalle se inserta dentro de esa plantilla. El resultado de un uso desconocido es el valor de respaldo de la consigna.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El pedido para cada uso
lenguaje: js
pide: Completa `pedidoPara(uso, detalle)` con las plantillas de la tabla: `'segunda opinión'` → `'Revisa esto como si fueras un atacante: DETALLE. ¿Qué puede salir mal?'`; `'comparar'` → `'Dame dos o tres formas de DETALLE, con ventajas y desventajas, sin elegir tú.'`; `'documentar'` → `'Escribe cómo funciona DETALLE para alguien que llega nuevo.'`; `'aprender'` → `'Hazme 5 preguntas sobre DETALLE, una a la vez, sin darme la respuesta.'`. Un uso que no está: `null`.
--- código
function pedidoPara(uso, detalle) {
  // tu código aquí
}
--- pruebas
prueba('segunda opinión', () => igual(pedidoPara('segunda opinión', 'las reglas de Firestore'), 'Revisa esto como si fueras un atacante: las reglas de Firestore. ¿Qué puede salir mal?'));
prueba('comparar', () => igual(pedidoPara('comparar', 'generar los audios gratis'), 'Dame dos o tres formas de generar los audios gratis, con ventajas y desventajas, sin elegir tú.'));
prueba('documentar y aprender', () => igual([pedidoPara('documentar', 'el panel'), pedidoPara('aprender', 'los worktrees')], ['Escribe cómo funciona el panel para alguien que llega nuevo.', 'Hazme 5 preguntas sobre los worktrees, una a la vez, sin darme la respuesta.']));
prueba('un uso que no está', () => igual(pedidoPara('adivinar', 'x'), null));
--- solución
function pedidoPara(uso, detalle) {
  const plantillas = {
    'segunda opinión': `Revisa esto como si fueras un atacante: ${detalle}. ¿Qué puede salir mal?`,
    comparar: `Dame dos o tres formas de ${detalle}, con ventajas y desventajas, sin elegir tú.`,
    documentar: `Escribe cómo funciona ${detalle} para alguien que llega nuevo.`,
    aprender: `Hazme 5 preguntas sobre ${detalle}, una a la vez, sin darme la respuesta.`,
  };
  return plantillas[uso] ?? null;
}
```

```practica
vf :: Pedirle a la IA que revise tu trabajo como si fuera un atacante es una buena forma de encontrar problemas
elige :: Para elegir entre dos formas de guardar los datos, ¿qué pedido conviene? :: "Elige tú la mejor" :: "Dame las opciones con ventajas y desventajas, sin elegir tú" :: "Haz las dos"
elige :: ¿Qué conviene hacer con una traducción que hizo la IA? :: Publicarla sin mirar :: Revisarla antes de usarla :: Borrarla
escribe :: Nombra tres usos de la IA que no sean "escribir código" y da un ejemplo de cada uno en los proyectos del curso. :: Segunda opinión: la auditoría de seguridad de Copiloto. Documentar: los LEEME y los informes. Traducir: los textos de Copiloto en seis idiomas. También comparar opciones, como elegir la voz gratis de los audios.
```

## Parte 5. Lo que no conviene delegar

Sacarle el máximo provecho **no** es pasarle todo. Hay cosas que son tuyas:

1. **Las decisiones**: qué se construye, qué no, en qué orden (clase de los agentes).
2. **Entender lo que publicas**: no subas algo que no puedas explicar (clase 34).
3. **Tus claves y contraseñas**: nunca se las pegues en el chat; se ponen en tu aparato o en el lugar seguro de cada servicio.
4. **La revisión final**: abrir la app, tocar los botones, mirar en el celular.
5. **Tus prácticas**: cuando estudias, **tú** escribes el código; la IA corrige. Si ella hace tus ejercicios, la nota es de ella, no tuya.

> 🌎 **En la vida real:** puedes contratar a alguien que te lleve las cuentas de tu negocio, pero la firma en el banco y las decisiones de en qué gastar siguen siendo tuyas.

> 🌎 **Otro ejemplo:** Es como el gimnasio: el entrenador te enseña y te corrige, pero si él levanta las pesas por ti, el que se pone fuerte es él.

> 🎙️ **El profesor dice:** {{alumno}}, todo lo que viste en este curso (una app publicada, dos sitios, sus paneles y este mapa) se construyó así: la IA puso las manos rápidas; la idea, la dirección y las ganas de entender cada cosa las puso una persona. Ese es el máximo provecho: que cada cosa que construyes te deje sabiendo más que antes.

> 🔁 **Repaso:** aprender mientras construyes (explicar, guardar como clase, estudiar, simular la entrevista) → lo repetitivo se vuelve herramienta (la IA la escribe una vez, trabaja siempre sin tokens) → herramientas que funcionan sin la IA, y modelos locales gratis para lo chico → segunda opinión, explicar errores, comparar, documentar, traducir, estudiar → las decisiones, las claves, la revisión final y tus prácticas no se delegan.

> 🧩 **Piezas para este ejercicio**
> - Una tarea puede tener varias marcas. La alerta sobre publicar sin entender se registra además de la clasificación principal. Conserva el orden del recorrido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que no se delega
lenguaje: js
pide: Completa `separar(tareas)`: devuelve `{ tuyas, delegables }`. Son **tuyas** las que tienen alguna de estas marcas: `decision`, `claves`, `revisionFinal`, `practica` (tus ejercicios cuando estudias) o `publicarSinEntender` (y esa última, además, va en `alerta`). Las demás son delegables. Devuelve los nombres, en el orden de la lista, y `alerta` con los nombres de las que tienen `publicarSinEntender`.
--- código
function separar(tareas) {
  // tu código aquí
}
--- pruebas
const tareas = [
  { nombre: 'escribir el panel' },
  { nombre: 'qué entra en la versión 1', decision: true },
  { nombre: 'pegar la clave de Stripe en el chat', claves: true },
  { nombre: 'mirar la app en el celular', revisionFinal: true },
  { nombre: 'resolver el ejercicio de la clase 39', practica: true },
  { nombre: 'subir un cambio que no entiendo', publicarSinEntender: true },
  { nombre: 'buscar dónde se usa guardar()' },
];
prueba('las tuyas', () => igual(separar(tareas).tuyas, ['qué entra en la versión 1', 'pegar la clave de Stripe en el chat', 'mirar la app en el celular', 'resolver el ejercicio de la clase 39', 'subir un cambio que no entiendo']));
prueba('las que delegas', () => igual(separar(tareas).delegables, ['escribir el panel', 'buscar dónde se usa guardar()']));
prueba('la alerta', () => igual(separar(tareas).alerta, ['subir un cambio que no entiendo']));
--- solución
function separar(tareas) {
  const marcas = ['decision', 'claves', 'revisionFinal', 'practica', 'publicarSinEntender'];
  const r = { tuyas: [], delegables: [], alerta: [] };
  for (const t of tareas) {
    (marcas.some((m) => t[m]) ? r.tuyas : r.delegables).push(t.nombre);
    if (t.publicarSinEntender) r.alerta.push(t.nombre);
  }
  return r;
}
```

```practica
vf :: Cuando estudias, lo mejor es que la IA resuelva los ejercicios y tú leas la solución
vf :: Las claves y contraseñas nunca se pegan en el chat de la IA
elige :: ¿Cuál de estas cosas NO conviene delegar en la IA? :: Buscar en qué archivos se usa una función :: Escribir un script repetitivo :: Decidir qué se publica y revisar que funcione
escribe :: Con tus palabras: ¿qué quiere decir sacarle el máximo provecho a la IA? :: Usarla no solo para que haga cosas, sino para aprender de cada cosa que hace, para convertir lo repetitivo en herramientas que trabajan solas, y para revisar, documentar y estudiar; pero dejando las decisiones, las claves, la revisión final y mis prácticas en mis manos.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo aprovechas la IA en tu trabajo?":** "De tres formas. Para aprender: cada cosa que construyo le pido que me la explique y la convierto en una clase con ejemplos y prácticas; así armé todo un mapa de estudios con mis propios proyectos, y simulo la entrevista para comprobar que lo puedo explicar. Para automatizar: si algo se repite, le pido una herramienta en vez de hacerlo a mano, como el script que cuenta las partes para las reglas de Firebase, la acción que genera los audios o el menú de tareas de Copiloto, que funciona aunque se acaben los tokens. Y para revisar: segunda opinión de seguridad, explicar errores y comparar opciones. Las decisiones, las claves y la revisión final las hago yo."

> 🌎 **En la vida real:** es como contar cómo usas tu caja de herramientas: no solo qué herramientas tienes, sino qué construiste con ellas y qué aprendiste usándolas.

> 🌎 **Otro ejemplo:** Es como el aprendiz que muestra su cuaderno de taller: cada página es un carro que arregló y lo que aprendió de él.
