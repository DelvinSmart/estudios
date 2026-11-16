# Lección 12: Cómo hice Estudios Bíblicos

> 🌎 **En la vida real:** esta clase no es sobre el contenido de los estudios: es sobre **cómo está construida la página**, igual que una clase de carpintería sobre cómo se hizo una biblioteca, no sobre los libros que tiene.

Este es el **Tema 12** del curso. Estudia una parte por día. Abre el archivo del que habla cada parte (en `SSD_Desarrollo/Developer/que-dice-la-biblia`) y míralo mientras lees. Primero intenta responder las preguntas sin mirar. Las respuestas están al final.

Los ejemplos están simplificados para aprender. El código real puede verse un poco distinto.

---

## Parte 1. La idea en una frase

> 🌎 **En la vida real:** además del proyector: es como un **álbum de figuritas**. El álbum (el código) es siempre el mismo, con sus casilleros numerados. Las figuritas (el contenido, el JSON) cambian. Si el álbum se imprime mejor, todas las figuritas se ven mejor sin tener que tocarlas.
>
> La estructura tema → puntos → subpuntos → bloques es como un **libro**: el libro, sus capítulos, las secciones de cada capítulo y, dentro, los párrafos, las fotos y las citas.

> 🌎 **Otro ejemplo:** Es como una plantilla de invitación de cumpleaños: el diseño es uno solo, y para cada niño solo cambias el nombre, la fecha y el lugar.

**Qué es:** una página que muestra estudios bíblicos como un **mapa**. El estudio es el **tema** (por ejemplo, "¿Lenguas extrañas?"). El tema tiene **puntos** (1, 2, 3…), cada punto tiene **subpuntos** (1.1, 1.2…) y cada subpunto tiene **bloques**: texto, pasaje bíblico, subtítulo, imagen o video.

**Lo más importante de toda la arquitectura:**

> **El contenido está separado del código.** Los estudios son archivos de datos (JSON). El código es una plantilla que sabe dibujar *cualquier* estudio.

**Comparación:** es como una **iglesia con un proyector**. El proyector (el código) es siempre el mismo. Lo que cambia es la presentación que pones (el estudio). No compras un proyector nuevo para cada prédica.

**Por qué importa:** si mejoras el diseño o arreglas un error, se arregla en **todos** los estudios al mismo tiempo.

**Preguntas**
1. ¿Qué es un "tema", un "punto" y un "subpunto" en este proyecto?
2. ¿Por qué se separa el contenido del código?

---

## Parte 2. Las tres tecnologías: HTML, CSS y JavaScript

> 🌎 **En la vida real:** además de la casa: piensa en un **muñeco**:
> - **HTML** = el **esqueleto**: cabeza, brazos, piernas.
> - **CSS** = la **ropa y el peinado**: cómo se ve.
> - **JavaScript** = los **músculos**: lo que lo hace moverse cuando aprietas un botón.
>
> **Sin frameworks**: para un viaje corto al mercado vas en bicicleta, no alquilas un camión. La página es pequeña; un framework sería el camión.

> 🌎 **Otro ejemplo:** En un carro: la carrocería (HTML), la pintura y el tapizado (CSS), y el motor con la electricidad (JavaScript).

Este proyecto **no usa frameworks** (ni React, ni Vue). Solo las tres piezas básicas de la web:

| Pieza | Qué hace | Comparación |
|---|---|---|
| **HTML** | La estructura: qué cajas hay en la página | Las paredes y los cuartos de una casa |
| **CSS** | El diseño: colores, letras, espacios, animaciones | La pintura y los muebles |
| **JavaScript** | El comportamiento: cargar el estudio, dibujar el mapa, responder a los botones | La electricidad: lo que hace que las cosas funcionen |

**Por qué sin frameworks:** la página es pequeña. Un framework agrega cosas que no necesita. Así carga rápido, y cualquier persona que sepa lo básico de la web puede entender el código.

**Preguntas**
3. Si quiero cambiar el color de los botones, ¿qué tipo de archivo abro?
4. Si quiero que un botón haga algo nuevo, ¿qué tipo de archivo abro?

---

## Parte 3. El mapa de archivos

> 🌎 **En la vida real:** es una **cocina bien organizada**, donde cada cajón tiene una sola cosa: cubiertos aquí, ollas allá. El "código espagueti" es el cajón donde están mezclados los cubiertos, las pilas, los recibos y las llaves: encontrar algo es una pesadilla.
> - `estudios/` = la **despensa** con los ingredientes (el contenido).
> - Los `.html` = los **platos** donde se sirve.
> - `css/` = la **decoración** de la mesa.
> - `js/` = los **cocineros**, cada uno con su tarea: uno corta, otro cocina, otro sirve.
> - `scripts/` y `publicar.yml` = el **delivery** que lleva todo a la calle.

> 🌎 **Otro ejemplo:** Como una caja de herramientas con compartimentos: los destornilladores en uno, las llaves en otro; sabes dónde está cada cosa sin revolver.

Cada archivo tiene **una sola tarea**. Eso es lo contrario del "código espagueti", donde todo está mezclado.

```
que-dice-la-biblia/
├── estudios/              ← EL CONTENIDO (un archivo JSON por estudio)
├── imagenes/  videos/     ← fotos y videos que se suben desde el panel
│
├── index.html             ← página de inicio (lista de estudios)
├── estudio.html           ← página de un estudio (mapa + lectura)
├── panel.html             ← panel para editar
├── pdf.html               ← versión para el PDF
│
├── css/
│   ├── styles.css         ← diseño de la página (colores, letras, efectos)
│   ├── panel.css          ← diseño del panel
│   └── pdf.css            ← diseño del PDF (fondo negro, letras blancas)
│
├── js/
│   ├── ui.js              ← textos de los botones en español y portugués
│   ├── estudios.js        ← carga un estudio y convierte sus bloques en HTML
│   ├── efectos.js         ← el efecto de entrada (igual que Copiloto)
│   ├── inicio.js          ← dibuja la lista de estudios
│   ├── mapa.js            ← dibuja el mapa y el panel de lectura
│   ├── pdf.js             ← arma la versión para imprimir
│   ├── github.js          ← habla con GitHub (leer, guardar, borrar)
│   ├── panel-estado.js    ← lo que el panel recuerda y la limpieza de textos
│   ├── panel-lista.js     ← pantalla de la llave y lista de estudios
│   ├── panel-editor.js    ← el editor de puntos, subpuntos y bloques
│   ├── panel-publicar.js  ← publicar y eliminar
│   ├── panel-vista.js     ← la vista previa en vivo
│   ├── panel-pegar.js     ← "Pegar desde la app Biblia"
│   ├── panel-foto.js      ← leer versículos de una foto
│   └── panel-imagen.js    ← subir imágenes y videos
│
├── scripts/
│   ├── construir.mjs      ← arma el sitio y la lista de estudios
│   └── pdfs.sh            ← genera un PDF por estudio
└── .github/workflows/publicar.yml  ← publica todo solo en cada cambio
```

**Regla para recordar:** *los HTML dicen qué hay, los CSS dicen cómo se ve, los JS dicen qué hace, y `estudios/` dice qué se enseña.*

**Preguntas**
5. ¿En qué carpeta está el texto de "¿Lenguas extrañas?"?
6. ¿Qué archivo dibuja el mapa de puntos y subpuntos?

---

## Parte 4. Cómo es un estudio por dentro (el JSON)

> 🌎 **En la vida real:** el JSON es como una **ficha de inscripción** con casilleros que tienen nombre: "Título: ___", "Idioma: ___". Las llaves `{ }` son **una ficha**; los corchetes `[ ]` son **una pila de fichas** en orden.
>
> **Lo de los nombres viejos** (`temas` guarda los puntos): es como una calle que cambió de nombre, pero las cartas viejas siguen llegando con el nombre anterior. Para no perder esas cartas, el cartero sigue aceptando el nombre viejo, y alguien lo dejó anotado.

> 🌎 **Otro ejemplo:** Como un formulario impreso con casilleros: "Nombre:", "Idioma:", y una lista de "Puntos" con sus renglones.

**Qué es JSON:** un formato de texto para guardar datos con nombres. Llaves `{ }` para un objeto, corchetes `[ ]` para una lista.

```json
{
  "titulo": "¿Lenguas extrañas?",
  "idioma": "es",
  "otro_idioma": "linguas-estranhas",
  "preguntas": ["¿De dónde proviene?", "¿Dónde nació?"],
  "cierre": "¡Y bien!",
  "temas": [
    {
      "titulo": "Etimología del término",
      "color": "morado",
      "puntos": [
        {
          "titulo": "Una palabra, varios sentidos",
          "nuevo": true,
          "bloques": [
            { "tipo": "texto", "texto": "<p>Y aquí está la clave…</p>" },
            { "tipo": "pasaje", "referencia": "Hechos 2:4 LBLA",
              "versiculos": [{ "numero": "4", "texto": "Todos fueron llenos…" }] }
          ]
        }
      ]
    }
  ]
}
```

**Ojo con los nombres:** en el JSON, los **puntos** se guardan en `temas` y los **subpuntos** en `puntos`. Son nombres de la primera versión. Lo que ves en la página dice "puntos" y "subpuntos"; por dentro se quedó así para no romper los estudios ya guardados. Está anotado en el README.

**Preguntas**
7. ¿Qué campo hace que aparezca el botón ES | PT?
8. Si un bloque tiene `"tipo": "pasaje"`, ¿qué dos campos más trae?

---

## Parte 5. Las interconexiones: qué pasa cuando abres un estudio

> 🌎 **En la vida real:** además de la cadena de montaje: es como **preparar un café**. Primero hierves el agua (`ui.js`), después pones el café en el filtro (`estudios.js`), después tienes la taza lista (`efectos.js`) y recién ahí sirves (`mapa.js`). Si intentas servir antes de hervir el agua, no hay café. Por eso el orden de los `<script>` importa.

> 🌎 **Otro ejemplo:** Como armar un sándwich: pan, manteca, jamón, queso, pan. Si pones el queso antes del pan, se te cae todo. El orden importa.

Abre `estudio.html?e=lenguas-extranas`. Pasa esto, en orden:

```
estudio.html
   │  carga en este orden:
   ├─ ui.js         → crea TEXTOS (botones en es/pt)
   ├─ estudios.js   → crea cargarEstudio() y puntoHTML()
   ├─ efectos.js    → crea revelar() (la animación)
   └─ mapa.js       → usa todo lo anterior:
          1. lee "e=lenguas-extranas" del link
          2. cargarEstudio() → trae estudios/lenguas-extranas.json
          3. dibuja la portada, el mapa y los botones
          4. show(0) → puntoHTML() convierte los bloques en HTML
          5. revelar() → hace la animación de entrada
```

**La idea clave:** cada archivo **ofrece** funciones y los que vienen después las **usan**. Por eso el orden de los `<script>` en el HTML importa: si `mapa.js` se cargara antes que `estudios.js`, `cargarEstudio` todavía no existiría y daría error.

**Comparación:** es una cadena de montaje. El que pinta tiene que estar después del que arma la carrocería.

**Ejercicio:** abre `estudio.html` y busca las etiquetas `<script>` al final. Anota el orden y explica por qué es ese.

**Preguntas**
9. ¿Por qué el orden de los `<script>` importa?
10. ¿Qué función convierte los bloques de un subpunto en HTML, y en qué archivo está?

---

## Parte 6. Una función que sirve para todo: `puntoHTML`

> 🌎 **En la vida real:** `bloqueHTML` es como la **máquina de un fotocopiador** que reconoce qué le diste: si es una hoja, la copia; si es una foto, la imprime en papel brillante; si es un video, pone un reproductor. Y la **misma** máquina se usa en la oficina (la página), en la imprenta (el PDF) y en el borrador (la vista previa). Por eso los tres salen idénticos.
>
> `esc()` es como poner un texto **entre comillas** en una carta, para que nadie confunda lo que alguien escribió con una orden. Si un título dice `<b>`, se muestra como texto, no como instrucción.

> 🌎 **Otro ejemplo:** Es como un traductor que traduce igual en la reunión, en el contrato y en el correo: un solo traductor, tres lugares, el mismo resultado.

En `js/estudios.js`, la función `bloqueHTML` mira el **tipo** de cada bloque y devuelve el HTML que le corresponde:

```js
function bloqueHTML(b) {
  switch (b.tipo) {
    case "texto":     return b.texto;
    case "subtitulo": return `<h3>${esc(b.texto)}</h3>`;
    case "pasaje":    return /* recuadro con la referencia y los versículos */;
    case "imagen":    return /* recuadro con la imagen y el pie */;
    case "video":     return videoHTML(b);
  }
}
```

**Por qué es buena arquitectura:** la **misma** función la usan tres lugares distintos:

| Dónde | Para qué |
|---|---|
| `mapa.js` | La página del estudio |
| `pdf.js` | El PDF |
| `panel-editor.js` y la vista previa | El panel, mientras escribes |

Por eso, lo que ves en la vista previa del panel es **exactamente** lo que sale en la página y en el PDF. Si mañana se agrega un tipo de bloque nuevo (por ejemplo "cita"), se agrega **en un solo lugar** y aparece en los tres.

**`esc()`:** convierte `<` en `&lt;` y cosas así, para que un título con símbolos no rompa la página. Se usa en todo lo que escribe una persona.

**Preguntas**
11. Si quiero agregar un tipo de bloque nuevo, ¿cuántos archivos tengo que tocar como mínimo para que se vea en la página, el PDF y la vista previa?
12. ¿Para qué sirve `esc()`?

---

## Parte 7. Los colores: tokens

> 🌎 **En la vida real:** es como en una **empresa de pintura** donde los colores tienen nombre de catálogo: "Morado Atardecer". En vez de anotar la fórmula química en 20 paredes, anotas el nombre. Si el fabricante mejora la fórmula, todas las paredes "Morado Atardecer" se actualizan.
>
> El camino del color es como un **pedido de pintura**: el cliente dice "morado" (JSON) → la tienda lo traduce al código del catálogo `--b2` (`estudios.js`) → el pintor marca esa habitación con ese código (`mapa.js`) → todo lo de la habitación usa "el color de esta habitación" (`--c`).
>
> El **modo oscuro** es como tener la misma pintura en versión **para interior** y **para exterior**: mismo nombre, distinto brillo según la luz.

> 🌎 **Otro ejemplo:** Es como los colores de un equipo de fútbol: "azul del club" se define una vez, y la camiseta, la bandera y el escudo lo usan por su nombre.

**Qué es un token de color:** un **nombre** para un color, definido una sola vez. En vez de escribir `#7A3FA0` en veinte lugares, se escribe `var(--b2)`.

En `css/styles.css`, arriba de todo:

```css
:root {
  --bg: #F3F4F7;   --ink: #1B1F2E;   --line: #D5D9E3;
  --b1: #2B3A8F;   /* azul    */
  --b2: #7A3FA0;   /* morado  */
  --b3: #0F7A6C;   /* verde   */
  /* … hasta --b11 (pizarra) */
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #12141C; --ink: #E9EBF2; --b2: #CDA2EC; /* … */ }
}
```

**Cómo se conectan los colores, de punta a punta:**

1. En el JSON, un punto dice `"color": "morado"`.
2. En `estudios.js`, `COLORES` traduce `morado` → `--b2`.
3. `mapa.js` le pone a ese punto `style="--c: var(--b2)"`.
4. En el CSS, todo usa `var(--c)`: el número del punto, la raya de los versículos, los subpuntos marcados y el borde de las imágenes.

Así, **un solo dato** ("morado") pinta todo ese punto, y el mismo nombre funciona en modo claro y oscuro, porque cada modo define su propia versión de `--b2`.

**Por qué el modo oscuro se ve bien:** cada color tiene una versión clara (para fondo claro) y una más brillante (para fondo oscuro). El PDF usa siempre la versión brillante, porque su fondo es negro.

**Preguntas**
13. Si quiero que todos los morados sean un poco más oscuros, ¿cuántas líneas cambio?
14. ¿Qué es `--c` y por qué es útil?

---

## Parte 8. El efecto de entrada

> 🌎 **En la vida real:** es como un **telón de teatro**: el JavaScript es el **tramoyista** que decide **cuándo** subir el telón (cuando el actor aparece en escena, avisado por el `IntersectionObserver`, que es como el que mira por la cortina). El CSS es el **mecanismo** del telón: si sube rápido o lento, suave o de golpe. Y si alguien del público pidió "sin efectos", el telón ya está arriba desde el principio.

> 🌎 **Otro ejemplo:** Como las luces de un escenario: el técnico decide cuándo se prenden; el reflector decide cómo se ve la luz.

En `js/efectos.js` y al final de `css/styles.css`. Es el mismo efecto de la landing de Copiloto:

```css
.js .reveal            { opacity: 0; transform: translateY(22px) scale(.97); filter: blur(8px); }
.js .reveal.is-visible { opacity: 1; transform: none; filter: none; }
```

- `revelar(elementos)` les pone la clase `reveal` a varias piezas, con un retraso distinto a cada una (la cascada).
- Un **IntersectionObserver** avisa cuando cada pieza aparece en la pantalla, y entonces le pone `is-visible`. El CSS hace la transición.
- Si la persona tiene activado "reducir movimiento" en su teléfono, no hay animación.

**Separación:** el JavaScript solo decide **cuándo** (pone y quita clases); el CSS decide **cómo** se ve el movimiento.

**Preguntas**
15. ¿Qué parte del efecto está en JavaScript y qué parte en CSS?

---

## Parte 9. Cómo se publica (sin servidor)

> 🌎 **En la vida real:** es como mandar un libro a una **imprenta automática**: tú entregas el manuscrito (guardas o haces `git push`), la imprenta arma el índice (`indice.json`), imprime una versión en PDF de cada capítulo y lo pone en la vidriera (GitHub Pages). En 1 o 2 minutos está a la venta.
>
> ¿Por qué hace falta el índice? Porque una página estática es como un **cartel pegado en la pared**: no puede ir a la bodega a mirar qué cajas hay. Alguien tiene que escribir la lista y pegarla en el cartel.

> 🌎 **Otro ejemplo:** Como una revista que se imprime y se reparte sola cada vez que el editor entrega el material.

La página vive en **GitHub Pages**, que es gratis. No hay servidor propio.

```
Guardas en el panel (o haces git push)
        │
        ▼
GitHub Actions corre .github/workflows/publicar.yml:
   1. node scripts/construir.mjs → copia las páginas a _site/ y crea la lista de estudios (indice.json)
   2. sh scripts/pdfs.sh         → abre cada estudio en Chrome y lo guarda como PDF
   3. sube _site/ a GitHub Pages
        │
        ▼
En 1 o 2 minutos, la página y los PDF están actualizados
```

**Por qué el `indice.json` se genera solo:** una página estática no puede "mirar" qué archivos hay en una carpeta. Por eso, al publicar, un script hace la lista de estudios y la página de inicio la lee.

**Preguntas**
16. ¿Por qué la página de inicio necesita `indice.json`?
17. ¿Quién genera los PDF, y cuándo?

---

## Parte 10. El panel y la llave

> 🌎 **En la vida real:** el panel es como la **puerta de un edificio que da a la calle**: cualquiera puede llegar hasta ella, pero sin llave no entra. La llave (el *token*) es como una **llave que solo abre un cuarto**, no todo el edificio. Se guarda **en tu bolsillo** (`localStorage`), no se deja colgada en la puerta. Y quien decide si la llave sirve es la **cerradura** (GitHub), no la puerta.
>
> La **ruta** `temas.0.puntos.1.titulo` es como una dirección: "edificio 0, piso 1, departamento título". Con un solo cartero que sabe leer direcciones, no hace falta un cartero por cada departamento.
>
> La **vista previa** con `postMessage` es como un **probador con espejo**: cada vez que cambias algo, alguien te pasa la prenda nueva por debajo de la cortina y el espejo te la muestra.

> 🌎 **Otro ejemplo:** Es como un buzón en la calle con candado: cualquiera ve el buzón, pero solo quien tiene la llave lo abre y deja cartas.

El panel (`panel.html`) **es una página pública**, pero sin la llave no puede guardar nada.

- La **llave** es un *token* de GitHub (una contraseña especial) que solo permite **editar archivos de `que-dice-la-biblia`**. Nada más de la cuenta.
- La llave se guarda **solo en el aparato** (`localStorage`). No se sube a ningún lado.
- `github.js` manda cada cambio a la **API de GitHub** con la llave. **GitHub decide:** si la llave es válida, guarda; si no, rechaza.

**Cómo está dividido el panel** (un archivo por tarea):

| Archivo | Tarea |
|---|---|
| `panel-estado.js` | Lo que todos comparten: el estudio abierto, cambiar de pantalla, el borrador automático, la limpieza de textos pegados |
| `panel-lista.js` | Pantalla de la llave y lista de estudios |
| `panel-editor.js` | Dibujar el editor y responder a los botones (+ Punto, ↑ ↓ ✕…) |
| `panel-publicar.js` | Publicar y eliminar |
| `panel-vista.js` | La vista previa en vivo |
| `panel-pegar.js` | Leer lo copiado de la app Biblia |
| `panel-foto.js` | Leer versículos de una foto |
| `panel-imagen.js` | Achicar fotos y subir imágenes y videos |

**Rutas:** el editor encuentra cada campo con una "ruta" como `temas.0.puntos.1.titulo` (punto 1, subpunto 2, título). Así, **un solo** manejador de eventos sirve para todos los campos, en vez de uno para cada cuadro de texto.

**La vista previa:** es la página real del estudio (`estudio.html?vista=1`) dentro de un cuadro. El panel le **manda** el estudio con `postMessage` cada vez que cambias algo, y ella se vuelve a dibujar.

**Preguntas**
18. ¿Puede otra persona guardar cambios si abre el panel? ¿Por qué?
19. ¿Qué es la "ruta" `temas.2.puntos.0.bloques.1.texto`?

---

## Parte 11. Las ayudas para los versículos

> 🌎 **En la vida real:** - **Expresión regular**: es como el empleado del correo que reconoce un código postal de un vistazo: "5 números, un guion, 3 números". Aquí reconoce el patrón "libro + capítulo:versículo + sigla". Y limpia los **caracteres invisibles**, como quien saca las pelusas de un sobre antes de archivarlo.
> - **Tesseract.js**: es como el **escáner del supermercado** que lee el código de barras, pero leyendo letras de una foto, y sin mandar la foto a ningún lado.
> - **`rangos()`**: es como decir "del 1 al 3" en vez de "1, 2 y 3" cuando dictas números de asientos.
> - **Achicar fotos**: es como mandar una foto por WhatsApp en vez de por correo en tamaño original: se ve bien en el celular y no tarda nada en llegar.

> 🌎 **Otro ejemplo:** Como el lector de códigos de barras del supermercado: reconoce el patrón y sabe qué producto es; y el escáner de documentos del celular, que convierte una foto en texto sin mandarla a ningún lado.

**"Pegar desde la app Biblia"** (`panel-pegar.js`): lee el texto copiado y encuentra la referencia con una **expresión regular** (un patrón de texto):

```js
// "Hechos 1:5 LBLA" = libro + capítulo:versículo + sigla
/^(?:[1-3]\s?)?[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*\s\d+:\d+…\s+[A-Z]{2,6}\d*$/
```

Además quita las comillas, el link y unos **caracteres invisibles** que pone la app al copiar, y escribe "SEÑOR" en versalitas.

**Foto** (`panel-foto.js`): usa **Tesseract.js**, un lector de texto que funciona **dentro del navegador** (la foto no sale del aparato). Después, la función `rangos()` arma la referencia:

```js
rangos(["1","2","3"])     // "1-3"
rangos(["1","5","30"])    // "1, 5, 30"
rangos(["1","2","3","5"]) // "1-3, 5"
```

**Imágenes** (`panel-imagen.js`): antes de subir, la foto se achica con un `<canvas>` a máximo 1600 píxeles. Así una foto de 4 MB queda en unos 100 KB y la página carga rápido.

**Preguntas**
20. ¿Por qué se achican las fotos antes de subirlas?
21. ¿Qué devuelve `rangos(["2","3","4","10"])`?

---

## Parte 12. Decisiones que se tomaron (y lo que salió mal)

> 🌎 **En la vida real:** - **Pages CMS**: como comprar un mueble armado que no entra por la puerta; terminas haciéndolo a medida.
> - **El lector de voz**: como instalar un timbre que no suena en la casa de la mitad de los vecinos: mejor quitarlo que dejar un botón que no hace nada.
> - **La limpieza que borraba el griego**: como una lavadora que, al lavar, despinta los bordados. Se cambió el programa para que respete los bordados.
> - **`panel.js` de 500 líneas**: el cajón de los cubiertos que creció tanto que se dividió en varios.
> - **Números mal leídos en fotos**: como un dictado con ruido: antes de usarlo, se relee y se corrige.
> - **Derechos de autor**: como no fotocopiar un libro entero; se usa solo lo que el dueño permite.

> 🌎 **Otro ejemplo:** Como el cuaderno de errores de un cocinero: "esta receta se quemaba a 200°, ahora va a 180°". Contar lo que salió mal enseña tanto como lo que salió bien.

Explicar los errores también es parte de una entrevista.

| Qué pasó | Qué se decidió |
|---|---|
| El primer panel fue **Pages CMS** (un panel ya hecho). Era feo, en inglés, y una línea de su configuración (`media: false`) impedía abrirlo. | Se hizo un **panel propio**, con el mismo diseño de la página. |
| Se agregó un **lector de voz**, pero en el iPhone no sonó (en modo silencio, la voz de las páginas no suena). | Se **quitó por completo**: botones, código, estilos y textos. |
| El panel borraba el estilo de las palabras griegas al editar. | Se cambió la función de limpieza para que respete las clases `g` (griego) y `sc` (versalitas). |
| `panel.js` llegó a tener casi 500 líneas. | Se **dividió en archivos** por tarea. |
| Los numeritos de versículo en las fotos salen mal leídos. | El panel muestra la lista de versículos para **revisar y corregir** antes de usarlos. |
| La LBLA tiene derechos de autor. | No se copia de internet: se pega desde la app o se lee de una foto. |

**Preguntas**
22. Nombra una decisión que se tomó para que el código no fuera espagueti.

---

## Respuestas

> 🌎 **En la vida real:** las soluciones del final: se miran **después** de intentarlo, como cuando corriges tu propio crucigrama.

1. El **tema** es el estudio completo. Los **puntos** son los números grandes (1, 2, 3). Los **subpuntos** son 1.1, 1.2… y tienen el contenido.
2. Para que una sola plantilla sirva para todos los estudios: si se mejora el código, mejoran todos a la vez.
3. Un archivo **CSS** (`css/styles.css` o `css/panel.css`).
4. Un archivo **JavaScript** (`js/…`).
5. En `estudios/` (`estudios/lenguas-extranas.json`).
6. `js/mapa.js`.
7. `otro_idioma`.
8. `referencia` y `versiculos`.
9. Porque cada archivo usa funciones que crean los anteriores. Si se carga antes, esas funciones todavía no existen.
10. `puntoHTML`, en `js/estudios.js`.
11. Uno: `js/estudios.js` (y el CSS si quieres un estilo especial). El panel solo necesita además el botón para crearlo.
12. Para que lo que escribe una persona no rompa el HTML (convierte `<`, `>`, `&` y `"`).
13. Dos: la línea del modo claro y la del modo oscuro (y la del PDF, si también lo quieres ahí).
14. `--c` es "el color del punto actual". Se pone una vez por punto y todo lo de adentro lo usa.
15. JavaScript decide **cuándo** (pone y quita clases); CSS decide **cómo** se mueve.
16. Porque una página estática no puede ver qué archivos hay en una carpeta; la lista se arma al publicar.
17. `scripts/pdfs.sh`, con Chrome, cada vez que GitHub Actions publica.
18. No. Sin una llave válida, GitHub rechaza cualquier cambio.
19. El punto 3, subpunto 1, segundo bloque, su texto (se cuenta desde 0).
20. Para que la página cargue rápido y el repositorio no se llene de archivos pesados.
21. `"2-4, 10"`.
22. Por ejemplo: dividir `panel.js` en archivos por tarea; separar el contenido (JSON) del código; una sola función `puntoHTML` para la página, el PDF y la vista previa; los colores como tokens.
