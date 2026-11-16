# Clase guiada 12: Cómo hice Estudios Bíblicos

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. La [lección](LECCION.md) es el resumen para repasar, y [Para la entrevista](EXPLICACIONES-PARA-ENTREVISTA.md) te da las frases cortas.

**Cómo estudiarla:** una parte por día. Abre al lado la carpeta `SSD_Desarrollo/Developer/que-dice-la-biblia` y mira el archivo del que habla cada parte. Esta clase **no** es sobre el contenido de los estudios: es sobre **cómo está construida la página**.

**Lo que necesitas saber antes:** Temas 15, 16 y 17 (HTML, CSS y JavaScript), 06 (Git) y 10 (arquitectura).

> 📌 **Nota:** desde el 15/11/2026 la página se llama **¿Qué dice la Biblia?** (`que-dice-la-biblia`). Esta clase cuenta cómo se construyó el 12 y 13 de noviembre; lo que vino después está en el Tema 14.

## 1. La idea en una frase

> 🎙️ **El profesor:** Delvin, esta clase es especial: es **tu** proyecto, y es el ejemplo perfecto de todo lo que aprendiste en la etapa de la web. Si mañana te piden "muéstrame algo que hayas hecho con HTML, CSS y JavaScript", este es. Empecemos por la idea que lo sostiene todo.

### Qué es

Una página que muestra estudios bíblicos **como un mapa**. Cada estudio tiene esta forma:

```text
Tema (el estudio)  →  Puntos (1, 2, 3…)  →  Subpuntos (1.1, 1.2…)  →  Bloques
                                                                        (texto, pasaje,
                                                                         subtítulo, imagen, video)
```

> 🌎 **En la vida real:** como un **libro**: el libro, sus capítulos, las secciones de cada capítulo, y dentro los párrafos, las fotos y las citas.

### La decisión más importante de toda la arquitectura

> **El contenido está separado del código.** Los estudios son archivos de **datos** (JSON). El código es **una plantilla** que sabe dibujar **cualquier** estudio.

**¿Por qué importa?** Si mejoras el diseño o arreglas un error, se arregla en **todos** los estudios al mismo tiempo. No hay que tocar estudio por estudio.

> 🌎 **En la vida real:** una **iglesia con un proyector**. El proyector (el código) es siempre el mismo; lo que cambia es la presentación que pones (el estudio). No compras un proyector nuevo para cada prédica. O un **álbum de figuritas**: el álbum es el mismo, las figuritas cambian.

> 💡 **Idea:** este mapa de estudios hace exactamente lo mismo con tus `LECCION.md` (Tema 18): "una sola fuente de verdad".

```practica
escribe :: Explica con tus palabras qué es un tema, un punto y un subpunto en este proyecto. :: El tema es el estudio completo; los puntos son los números grandes (1, 2, 3); los subpuntos son 1.1, 1.2… y tienen el contenido en bloques.
escribe :: ¿Por qué se separa el contenido del código? :: Para que una sola plantilla sirva para todos los estudios: si mejoro el código, mejoran todos a la vez.
elige :: ¿En qué formato se guardan los estudios? :: HTML :: JSON :: PDF
vf :: Para mejorar el diseño hay que cambiar estudio por estudio
elige :: Un bloque puede ser… :: Solo texto :: Texto, pasaje, subtítulo, imagen o video :: Solo imágenes
```

> 🔁 **Repaso:** tema → puntos → subpuntos → bloques. Contenido (JSON) separado del código (la plantilla).

## 2. Las tres tecnologías, sin frameworks

> 🎙️ **El profesor:** esta página usa solo **HTML, CSS y JavaScript**, nada más. Ni React, ni Vue. Ya sabes qué hace cada una (Temas 15 a 17); aquí la pregunta es **por qué sin frameworks**.

| Pieza | Qué hace aquí |
|---|---|
| **HTML** | Las cajas: la lista de estudios, la portada, el mapa, el panel de lectura |
| **CSS** | Colores, letras, espacios, el efecto de entrada |
| **JavaScript** | Cargar el estudio, dibujar el mapa, responder a los botones |

**Por qué sin frameworks:** la página es **pequeña**. Un framework agrega cosas que no necesita. Así **carga rápido**, y cualquier persona que sepa lo básico de la web puede entender el código.

> 🌎 **En la vida real:** para ir al mercado vas en bicicleta, no alquilas un camión. Para un muñeco: HTML es el esqueleto, CSS la ropa, JavaScript los músculos.

> 💡 **Idea:** tu web de Copiloto (Tema 13) sí usa React. ¿Contradicción? No: esa web es grande y comparte código con la app. **Se elige la herramienta según el tamaño del trabajo** (Tema 10, parte 9).

```practica
elige :: Para cambiar el color de los botones, ¿qué tipo de archivo abres? :: HTML :: CSS :: JSON
elige :: Para que un botón haga algo nuevo, ¿qué tipo de archivo abres? :: CSS :: JavaScript :: JSON
escribe :: ¿Por qué esta página no usa frameworks? :: Porque es pequeña: un framework agregaría cosas que no necesita; así carga rápido y es fácil de entender.
```

> 🔁 **Repaso:** HTML, CSS y JavaScript puros. Sin framework porque la página es chica: bicicleta, no camión.

## 3. El mapa de archivos

> 🎙️ **El profesor:** abre la carpeta del proyecto. Cada archivo tiene **una sola tarea**. Eso es lo contrario del "código espagueti", donde todo está mezclado.

```text
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
│   ├── styles.css         ← diseño de la página
│   ├── panel.css          ← diseño del panel
│   └── pdf.css            ← diseño del PDF (fondo negro, letras blancas)
│
├── js/
│   ├── ui.js              ← textos de los botones en español y portugués
│   ├── estudios.js        ← carga un estudio y convierte sus bloques en HTML
│   ├── efectos.js         ← el efecto de entrada
│   ├── inicio.js          ← dibuja la lista de estudios
│   ├── mapa.js            ← dibuja el mapa y el panel de lectura
│   ├── pdf.js             ← arma la versión para imprimir
│   ├── github.js          ← habla con GitHub (leer, guardar, borrar)
│   └── panel-*.js         ← el panel, dividido por tareas (parte 10)
│
├── scripts/
│   ├── construir.mjs      ← arma el sitio y la lista de estudios
│   └── pdfs.sh            ← genera un PDF por estudio
└── .github/workflows/publicar.yml  ← publica todo solo en cada cambio
```

**La regla para recordar:** *los HTML dicen **qué hay**, los CSS **cómo se ve**, los JS **qué hace**, y `estudios/` **qué se enseña**.*

> 🌎 **En la vida real:** una cocina bien organizada: la despensa (`estudios/`), los platos (`.html`), la decoración (`css/`), los cocineros con una tarea cada uno (`js/`) y el delivery (`scripts/` y `publicar.yml`).

> 📌 **Nota:** después del 13/11 se agregaron más archivos (por ejemplo `biblia.js`, `tema.js`, `panel-ia.js`, `panel-medidor.js`); los ves en el Tema 14. La idea es la misma: uno por tarea.

```practica
elige :: ¿Dónde está el texto del estudio "¿Lenguas extrañas?"? :: En `estudio.html` :: En `estudios/lenguas-extranas.json` :: En `css/styles.css`
elige :: ¿Qué archivo dibuja el mapa de puntos y subpuntos? :: `inicio.js` :: `mapa.js` :: `ui.js`
elige :: ¿Qué archivo habla con GitHub para guardar? :: `pdf.js` :: `github.js` :: `efectos.js`
escribe :: Di la regla para recordar el mapa de archivos. :: Los HTML dicen qué hay, los CSS cómo se ve, los JS qué hace, y estudios/ qué se enseña.
```

> 🔁 **Repaso:** un archivo por tarea. HTML (qué hay), CSS (cómo se ve), JS (qué hace), `estudios/` (qué se enseña).

## 4. Cómo es un estudio por dentro (el JSON)

> 🎙️ **El profesor:** ahora abramos un estudio. Es JSON, como viste en el Tema 17.

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

Leámoslo:
- `titulo`, `idioma` → el nombre y el idioma del estudio.
- `otro_idioma` → el nombre del **mismo estudio en el otro idioma**. Si existe, aparece el botón **ES | PT**.
- `preguntas` y `cierre` → las preguntas de la portada y la frase final.
- `temas` → la lista de **puntos** (cada uno con su `color`).
- dentro de cada punto, `puntos` → la lista de **subpuntos**, con sus `bloques`.
- cada bloque tiene un `tipo`; un `pasaje` trae además `referencia` y `versiculos`.

> ⚠️ **Cuidado con los nombres:** en el JSON, los **puntos** se guardan en `temas` y los **subpuntos** en `puntos`. Son nombres de la primera versión. La página dice "puntos" y "subpuntos", pero por dentro quedó así **para no romper los estudios ya guardados**. Está anotado en el README. Es una decisión real de ingeniería: a veces no se cambia un nombre porque romperías los datos viejos.

> 🌎 **En la vida real:** una calle que cambió de nombre, pero las cartas viejas siguen llegando con el nombre anterior. El cartero sigue aceptando el nombre viejo, y alguien lo dejó anotado.

```practica
elige :: ¿Qué campo hace que aparezca el botón ES | PT? :: `idioma` :: `otro_idioma` :: `titulo`
elige :: Un bloque con `"tipo": "pasaje"`, ¿qué dos campos más trae? :: `texto` y `color` :: `referencia` y `versiculos` :: `titulo` y `nuevo`
elige :: En el JSON, ¿dónde se guardan los puntos? :: En `puntos` :: En `temas` :: En `bloques`
vf :: Se dejaron los nombres viejos para no romper los estudios ya guardados
```

> 🔁 **Repaso:** el JSON tiene título, idioma, `otro_idioma`, preguntas, cierre y `temas` (los puntos) con `puntos` (los subpuntos) y `bloques`.

## 5. Las interconexiones: qué pasa cuando abres un estudio

> 🎙️ **El profesor:** ahora veamos el código **funcionando junto**. Abres `estudio.html?e=lenguas-extranas`. ¿Qué pasa por dentro?

```text
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

`?e=lenguas-extranas` en la dirección es un **parámetro**: le dice a la página **qué estudio** abrir.

**La idea clave:** cada archivo **ofrece** funciones y los que vienen después las **usan**. Por eso **el orden de los `<script>` importa**: si `mapa.js` se cargara antes que `estudios.js`, `cargarEstudio` todavía no existiría y daría error (`cargarEstudio is not defined`, Tema 17, parte 10).

> 🌎 **En la vida real:** preparar un café: hierves el agua (`ui.js`), pones el café en el filtro (`estudios.js`), tienes la taza lista (`efectos.js`) y recién ahí sirves (`mapa.js`). O una cadena de montaje: el que pinta va después del que arma la carrocería.

> 💡 **Idea:** este mapa de estudios usa **módulos** (`import`/`export`, Tema 17 parte 9), que resuelven el orden solos. La página de estudios usa el orden de los `<script>`: es la forma más simple, y funciona bien en una página chica.

**Ejercicio:** abre `estudio.html`, busca las etiquetas `<script>` al final, anota el orden y explica por qué es ese.

```practica
elige :: ¿Por qué importa el orden de los `<script>`? :: Por estética :: Porque cada archivo usa funciones que crean los anteriores :: No importa
elige :: ¿Qué hace `?e=lenguas-extranas` en la dirección? :: Cambia el idioma :: Le dice a la página qué estudio abrir :: Abre el panel
elige :: ¿Qué función trae el archivo JSON del estudio? :: `revelar()` :: `cargarEstudio()` :: `show()`
escribe :: ¿Qué error saldría si `mapa.js` se cargara antes que `estudios.js`, y por qué? :: cargarEstudio is not defined, porque mapa.js la usaría antes de que estudios.js la creara.
```

> 🔁 **Repaso:** `ui.js` → `estudios.js` → `efectos.js` → `mapa.js`. Cada uno usa lo de los anteriores; por eso el orden importa.

## 6. Una función que sirve para todo: `bloqueHTML` y `puntoHTML`

> 🎙️ **El profesor:** esta es **la** pieza más elegante del proyecto. Míralo con cuidado, porque es lo que más te va a lucir en una entrevista.

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

`switch` (Tema 10) = "según el tipo, haz esto o esto o esto". Y `puntoHTML` usa `bloqueHTML` para armar **un subpunto entero**.

**Por qué es buena arquitectura:** la **misma** función la usan **tres** lugares distintos:

| Dónde | Para qué |
|---|---|
| `mapa.js` | La página del estudio |
| `pdf.js` | El PDF |
| `panel-editor.js` y la vista previa | El panel, mientras escribes |

Por eso, lo que ves en la vista previa del panel es **exactamente** lo que sale en la página y en el PDF. Y si mañana se agrega un tipo de bloque nuevo (por ejemplo "cita"), se agrega **en un solo lugar** y aparece en los tres.

### `esc()`, la protección

`esc()` convierte `<` en `&lt;`, `>` en `&gt;`, `&` y `"` en sus versiones seguras. Así, si un título tiene símbolos, **se muestra como texto** y no rompe la página (ni ejecuta nada). Es la misma idea de `textContent` del Tema 17 y de la función `escapar` de este mapa.

> 🌎 **En la vida real:** `bloqueHTML` es una fotocopiadora que reconoce qué le diste (hoja, foto, video) y la **misma** máquina se usa en la oficina, en la imprenta y en el borrador. `esc()` es poner un texto **entre comillas** en una carta, para que nadie confunda lo que alguien escribió con una orden.

```practica
elige :: ¿Cuántos lugares usan la misma función para dibujar los bloques? :: 1 :: 2 :: 3
elige :: Para agregar un tipo de bloque nuevo y que se vea en la página, el PDF y la vista previa, ¿cuántos archivos tocas como mínimo? :: Tres :: Uno: `js/estudios.js` (y el CSS si quieres un estilo especial) :: Ninguno
elige :: ¿Para qué sirve `esc()`? :: Para traducir :: Para que lo que escribe una persona no rompa el HTML :: Para comprimir imágenes
vf :: La vista previa del panel se ve igual que la página porque usan la misma función
escribe :: ¿Por qué usar una sola función para la página, el PDF y la vista previa es buena arquitectura? :: Porque lo que ves en la vista previa es exactamente lo que sale en la página y el PDF, y un cambio se hace en un solo lugar y aparece en los tres.
```

> 🔁 **Repaso:** `bloqueHTML` (un `switch` por tipo) y `puntoHTML`, usados por la página, el PDF y el panel. `esc()` protege lo que escribe la persona.

## 7. Los colores: tokens

> 🎙️ **El profesor:** ahora el diseño. Aquí ves el Tema 16 (variables CSS) aplicado a un proyecto real, de punta a punta.

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

- Cada color tiene **un nombre** (un **token**): `--b2` es el morado.
- `@media (prefers-color-scheme: dark)` → si el teléfono está en **modo oscuro**, los mismos nombres valen otros colores (más brillantes).

### El camino del color, de punta a punta

1. En el JSON, un punto dice `"color": "morado"`.
2. En `estudios.js`, `COLORES` traduce `morado` → `--b2`.
3. `mapa.js` le pone a ese punto `style="--c: var(--b2)"`.
4. En el CSS, **todo** usa `var(--c)`: el número del punto, la raya de los versículos, los subpuntos marcados y el borde de las imágenes.

Así, **un solo dato** ("morado") pinta todo ese punto, y funciona en modo claro y oscuro, porque cada modo define su propia versión de `--b2`. El PDF usa siempre la versión brillante, porque su fondo es negro.

`--c` es "**el color del punto actual**": se pone una vez por punto, y todo lo de adentro lo usa.

> 🌎 **En la vida real:** un pedido de pintura: el cliente dice "morado" (JSON) → la tienda lo traduce al código del catálogo `--b2` (`estudios.js`) → el pintor marca esa habitación con ese código (`mapa.js`) → todo lo de la habitación usa "el color de esta habitación" (`--c`).

```practica
elige :: Si quiero que todos los morados sean un poco más oscuros, ¿cuántas líneas cambio? :: Una por cada estudio :: Dos: la del modo claro y la del modo oscuro (y la del PDF si también) :: Ninguna
elige :: ¿Qué es `--c`? :: Un color fijo :: El color del punto actual, que usa todo lo de adentro :: Una clase
elige :: ¿Qué hace `@media (prefers-color-scheme: dark)`? :: Pone todo negro :: Cambia el valor de los tokens cuando el teléfono está en modo oscuro :: Desactiva los colores
escribe :: Cuenta el camino del color "morado" desde el JSON hasta la pantalla. :: El JSON dice "morado"; estudios.js lo traduce a --b2; mapa.js pone --c: var(--b2) en el punto; y el CSS usa var(--c) en todo lo de adentro.
```

> 🔁 **Repaso:** tokens `--b1`…`--b11`; un `"color"` en el JSON → `--b2` → `--c` → todo el punto. Modo oscuro = mismos nombres, otros valores.

## 8. El efecto de entrada

> 🎙️ **El profesor:** cuando abres un estudio, las piezas aparecen suaves, una detrás de otra. Mira cómo se reparte el trabajo entre JavaScript y CSS.

En `js/efectos.js` y al final de `css/styles.css` (es el mismo efecto de la landing de Copiloto):

```css
.js .reveal            { opacity: 0; transform: translateY(22px) scale(.97); filter: blur(8px); }
.js .reveal.is-visible { opacity: 1; transform: none; filter: none; }
```

- `revelar(elementos)` les pone la clase `reveal` a varias piezas, con un **retraso distinto** a cada una: eso es la **cascada**.
- Un **`IntersectionObserver`** (una herramienta del navegador) avisa cuando cada pieza **aparece en la pantalla**, y entonces le pone `is-visible`. El CSS hace la transición.
- Si la persona tiene activado **"reducir movimiento"** en su teléfono, no hay animación (Tema 16, parte 10).

**La separación:** el JavaScript solo decide **cuándo** (pone y quita clases); el CSS decide **cómo** se ve el movimiento.

> 🌎 **En la vida real:** un telón de teatro: el JavaScript es el tramoyista que decide **cuándo** subirlo (avisado por el que mira por la cortina, el `IntersectionObserver`); el CSS es el **mecanismo** del telón.

```practica
elige :: En el efecto de entrada, ¿qué hace JavaScript? :: Dibuja la animación :: Decide cuándo (pone y quita clases) :: Nada
elige :: ¿Qué hace el `IntersectionObserver`? :: Borra elementos :: Avisa cuando un elemento aparece en la pantalla :: Cambia colores
vf :: Si la persona pidió "reducir movimiento", no hay animación
```

> 🔁 **Repaso:** JS decide cuándo (clases + IntersectionObserver), CSS decide cómo (transición). Y se respeta "reducir movimiento".

## 9. Cómo se publica (sin servidor)

> 🎙️ **El profesor:** esta página no tiene servidor propio. Vive en **GitHub Pages**, que es gratis. ¿Cómo llega un estudio nuevo a internet?

```text
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

Es un **CI** como el del Tema 04, pero en vez de solo revisar, **publica**: eso es **CD** (entrega continua).

**¿Por qué hace falta `indice.json`?** Una página **estática** (archivos fijos, sin servidor) **no puede "mirar"** qué archivos hay en una carpeta. Por eso, al publicar, un script hace la lista de estudios y la página de inicio la lee con `fetch`.

> 🌎 **En la vida real:** una imprenta automática: entregas el manuscrito, la imprenta arma el índice, imprime un PDF de cada capítulo y lo pone en la vidriera. Y una página estática es un cartel pegado en la pared: no puede ir a la bodega a ver qué cajas hay; alguien tiene que escribir la lista.

```practica
elige :: ¿Dónde vive la página? :: En un servidor propio :: En GitHub Pages :: En Firebase
elige :: ¿Por qué la página de inicio necesita `indice.json`? :: Por estética :: Porque una página estática no puede ver qué archivos hay en una carpeta :: Porque lo exige Google
elige :: ¿Quién genera los PDF, y cuándo? :: Tú, a mano :: `scripts/pdfs.sh` con Chrome, cada vez que GitHub Actions publica :: El navegador del lector
vf :: Este proceso de publicar solo es un ejemplo de CD (entrega continua)
```

> 🔁 **Repaso:** guardar → GitHub Actions (construir + PDFs) → GitHub Pages. `indice.json` porque una página estática no ve carpetas.

## 10. El panel y la llave

> 🎙️ **El profesor:** el panel (`panel.html`) es la parte más interesante del proyecto: **una página pública que edita archivos de GitHub**. ¿Cómo es seguro?

### La llave

- El panel **es una página pública**, pero **sin la llave no puede guardar nada**.
- La **llave** es un ***token*** **de GitHub**: una contraseña especial que **solo** permite editar archivos de `que-dice-la-biblia`. Nada más de la cuenta.
- La llave se guarda **solo en el aparato** (`localStorage`, Tema 17). No se sube a ningún lado.
- `github.js` manda cada cambio a la **API de GitHub** con la llave. **GitHub decide:** si la llave es válida, guarda; si no, rechaza.

Es la misma idea de las reglas de Firestore (Tema 08): **la seguridad la pone el servidor** (GitHub), no la página.

> 🌎 **En la vida real:** una puerta que da a la calle: cualquiera llega hasta ella, pero sin llave no entra. La llave solo abre **un cuarto**, se guarda **en tu bolsillo**, y quien decide si sirve es la **cerradura** (GitHub), no la puerta.

### Un archivo por tarea

| Archivo | Tarea |
|---|---|
| `panel-estado.js` | Lo compartido: el estudio abierto, cambiar de pantalla, el borrador automático, la limpieza de textos pegados |
| `panel-lista.js` | Pantalla de la llave y lista de estudios |
| `panel-editor.js` | Dibujar el editor y responder a los botones (+ Punto, ↑ ↓ ✕…) |
| `panel-publicar.js` | Publicar y eliminar |
| `panel-vista.js` | La vista previa en vivo |
| `panel-pegar.js` | Leer lo copiado de la app Biblia |
| `panel-foto.js` | Leer versículos de una foto |
| `panel-imagen.js` | Achicar fotos y subir imágenes y videos |

### Las rutas

El editor encuentra cada campo con una **ruta** como `temas.0.puntos.1.titulo` (punto 1, subpunto 2, título; se cuenta **desde 0**). Así, **un solo** manejador de eventos sirve para **todos** los campos, en vez de uno por cada cuadro de texto.

> 🌎 **En la vida real:** una dirección: "edificio 0, piso 1, departamento título". Con un solo cartero que sabe leer direcciones, no hace falta un cartero por departamento.

### La vista previa

Es la página real del estudio (`estudio.html?vista=1`) dentro de un cuadro (un `iframe`). El panel le **manda** el estudio con **`postMessage`** (una forma de mandarle mensajes a otra página) cada vez que cambias algo, y ella se vuelve a dibujar.

> 🌎 **En la vida real:** un probador con espejo: cada vez que cambias algo, alguien te pasa la prenda nueva por debajo de la cortina y el espejo te la muestra.

```practica
elige :: ¿Puede otra persona guardar cambios si abre el panel? :: Sí, es público :: No: sin una llave válida, GitHub rechaza cualquier cambio :: Solo de noche
elige :: ¿Dónde se guarda la llave? :: En GitHub :: Solo en el aparato (`localStorage`) :: En el JSON del estudio
elige :: ¿Qué es la ruta `temas.2.puntos.0.bloques.1.texto`? :: El punto 2, subpunto 0 :: El punto 3, subpunto 1, segundo bloque, su texto (se cuenta desde 0) :: Un error
elige :: ¿Cómo le manda el panel el estudio a la vista previa? :: Con `fetch` :: Con `postMessage` :: Con `localStorage`
escribe :: ¿Por qué el panel es seguro aunque sea una página pública? :: Porque guardar necesita una llave de GitHub que solo tiene el dueño y que solo permite editar ese repositorio; y quien decide si la llave sirve es GitHub, no la página.
```

> 🔁 **Repaso:** panel público + llave (token de GitHub) en `localStorage` + GitHub decide. Un archivo por tarea, rutas para un solo manejador, y vista previa por `postMessage`.

## 11. Las ayudas para los versículos

> 🎙️ **El profesor:** tres ayudas que hacen cómodo cargar versículos, y cada una enseña una técnica distinta.

### Pegar desde la app Biblia (`panel-pegar.js`)

Lee el texto copiado y encuentra la referencia con una **expresión regular** (Tema 01: un patrón de texto):

```js
// "Hechos 1:5 LBLA" = libro + capítulo:versículo + sigla
/^(?:[1-3]\s?)?[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*\s\d+:\d+…\s+[A-Z]{2,6}\d*$/
```

No hace falta entender cada símbolo: reconoce "**(un número opcional como en 1 Corintios) + nombre del libro + capítulo:versículo + sigla en mayúsculas**". Además quita comillas, el link y unos **caracteres invisibles** que pone la app al copiar, y escribe "SEÑOR" en versalitas.

> 🌎 **En la vida real:** el empleado del correo que reconoce un código postal de un vistazo.

### Leer de una foto (`panel-foto.js`)

Usa **Tesseract.js**, un lector de texto (**OCR**: reconocimiento de caracteres) que funciona **dentro del navegador**: **la foto no sale del aparato**. Después, `rangos()` arma la referencia:

```js
rangos(["1","2","3"])     // "1-3"
rangos(["1","5","30"])    // "1, 5, 30"
rangos(["1","2","3","5"]) // "1-3, 5"
```

Los números de versículo en las fotos a veces salen mal leídos: por eso el panel muestra la lista **para revisar y corregir** antes de usarla (Tema 07: verificar).

### Achicar fotos (`panel-imagen.js`)

Antes de subir, la foto se achica con un **`<canvas>`** (un lienzo para dibujar en el navegador) a máximo **1600 píxeles**. Una foto de **4 MB** queda en unos **100 KB**: la página carga rápido y el repositorio no se llena de archivos pesados.

> 🌎 **En la vida real:** mandar una foto por WhatsApp en vez de por correo en tamaño original.

```practica
elige :: ¿Qué devuelve `rangos(["2","3","4","10"])`? :: "2, 3, 4, 10" :: "2-4, 10" :: "2-10"
elige :: ¿Por qué se achican las fotos antes de subirlas? :: Para que se vean más feas :: Para que la página cargue rápido y el repositorio no se llene :: Porque GitHub lo exige
vf :: Con Tesseract.js, la foto se manda a un servidor para leerla
elige :: ¿Qué es OCR? :: Un formato de imagen :: Reconocer texto en una imagen :: Un tipo de JSON
```

> 🔁 **Repaso:** expresión regular para reconocer referencias; Tesseract.js (OCR en el navegador) + `rangos()`; y `<canvas>` para achicar fotos.

## 12. Decisiones que se tomaron (y lo que salió mal)

> 🎙️ **El profesor:** en una entrevista, contar **qué salió mal y qué decidiste** vale tanto como contar lo que salió bien. Estas son las decisiones reales del proyecto.

| Qué pasó | Qué se decidió | 🌎 Como… |
|---|---|---|
| El primer panel fue **Pages CMS** (uno ya hecho): feo, en inglés, y una línea de su configuración (`media: false`) impedía abrirlo | Se hizo un **panel propio**, con el mismo diseño de la página | Un mueble armado que no entra por la puerta: lo haces a medida |
| Se agregó un **lector de voz**, pero en el iPhone no sonaba (en modo silencio la voz de las páginas no suena) | Se **quitó por completo**: botones, código, estilos y textos | Un timbre que no suena en la mitad de las casas: mejor quitarlo |
| El panel **borraba el estilo de las palabras griegas** al editar | Se cambió la limpieza para que respete las clases `g` (griego) y `sc` (versalitas) | Una lavadora que despinta los bordados |
| `panel.js` llegó a **casi 500 líneas** | Se **dividió en archivos** por tarea | El cajón de cubiertos que creció demasiado |
| Los numeritos de versículo en las fotos **salen mal leídos** | El panel muestra la lista **para revisar y corregir** | Un dictado con ruido: se relee |
| La LBLA tiene **derechos de autor** | No se copia de internet: se pega desde la app o se lee de una foto | No fotocopiar un libro entero |

```practica
escribe :: Nombra una decisión que se tomó para que el código no fuera espagueti. :: Dividir panel.js en archivos por tarea; o separar el contenido (JSON) del código; o usar una sola función para la página, el PDF y la vista previa; o los colores como tokens.
elige :: ¿Por qué se quitó el lector de voz? :: Porque era lento :: Porque en el iPhone, en modo silencio, no sonaba :: Porque nadie lo pidió
elige :: ¿Qué se hizo con Pages CMS? :: Se dejó :: Se reemplazó por un panel propio :: Se tradujo
vf :: Contar lo que salió mal en un proyecto ayuda en una entrevista
```

> 🔁 **Repaso:** panel propio en vez de Pages CMS; quitar lo que no funciona (la voz); respetar el griego; dividir archivos grandes; revisar el OCR; y respetar derechos de autor.

## Para la entrevista

> 🎙️ **El profesor:** la explicación completa está en [Para la entrevista](EXPLICACIONES-PARA-ENTREVISTA.md). Aquí, la versión para decir en voz alta en un minuto.

> 🎤 **Entrevista:** "Cuéntame de un proyecto web que hayas hecho."

<details>
<summary>Ver una buena respuesta</summary>

"Hice una página de estudios bíblicos que muestra cada estudio como un mapa de puntos y subpuntos. Es HTML, CSS y JavaScript sin frameworks, porque es pequeña. Lo principal de la arquitectura es que el contenido está separado del código: cada estudio es un JSON y una sola plantilla dibuja cualquiera. La misma función arma los bloques para la página, el PDF y la vista previa del panel. Los colores son tokens con modo claro y oscuro. Se publica sola con GitHub Actions en GitHub Pages, y tiene un panel propio que guarda en GitHub con una llave que solo permite editar ese repositorio."

</details>

> 🎤 **Entrevista:** "¿Cómo es seguro el panel si es una página pública?"

<details>
<summary>Ver una buena respuesta</summary>

"Porque guardar necesita un token de GitHub con permiso solo sobre ese repositorio, que se guarda en el aparato del dueño. La página manda los cambios a la API de GitHub, y es GitHub quien decide si el token es válido. La seguridad la pone el servidor, no la página."

</details>

```practica
escribe :: Explica el proyecto en 3 frases, como en una entrevista. :: Es una página de estudios bíblicos en HTML, CSS y JavaScript que muestra cada estudio como un mapa. El contenido está en JSON separado del código, y una sola función dibuja los bloques para la página, el PDF y el panel. Se publica sola con GitHub Actions en GitHub Pages, y el panel guarda en GitHub con una llave.
```

> 🔁 **Repaso final de la clase:** contenido separado del código, sin frameworks, un archivo por tarea, el JSON, el orden de los scripts, una función para tres lugares, tokens de color, el efecto de entrada, la publicación con GitHub Actions, el panel con su llave, las ayudas para versículos y las decisiones tomadas. Próxima: **Tema 13, Cómo hice la web de Copiloto**.
