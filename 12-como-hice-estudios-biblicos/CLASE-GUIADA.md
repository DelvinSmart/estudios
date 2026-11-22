# Cómo hice Estudios Bíblicos

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. La [lección](LECCION.md) es el resumen para repasar, y [Para la entrevista](EXPLICACIONES-PARA-ENTREVISTA.md) te da las frases cortas.

**Cómo estudiarla:** una parte por día. Abre al lado la carpeta `SSD_Desarrollo/Developer/que-dice-la-biblia` y mira el archivo del que habla cada parte. Esta clase **no** es sobre el contenido de los estudios: es sobre **cómo está construida la página**.

**Lo que necesitas saber antes:** Temas 15, 16 y 17 (HTML, CSS y JavaScript), 06 (Git) y 10 (arquitectura).

> 📌 **Nota:** desde el 15/11/2026 la página se llama **¿Qué dice la Biblia?** (`que-dice-la-biblia`). Esta clase cuenta cómo se construyó el 12 y 13 de noviembre; lo que vino después está en el Tema 14.

## 1. La idea en una frase

> 🎙️ **El profesor:** {{alumno}}, esta clase es especial: es **tu** proyecto, y es el ejemplo perfecto de todo lo que aprendiste en la etapa de la web. Si mañana te piden "muéstrame algo que hayas hecho con HTML, CSS y JavaScript", este es. Empecemos por la idea que lo sostiene todo.

> 🌎 **En la vida real:** Es como una plantilla de invitación de cumpleaños: el diseño es uno solo, y para cada niño solo cambias el nombre, la fecha y el lugar.

> 🌎 **Otro ejemplo:** Es como un televisor: el aparato (el código) es el mismo, y lo que cambia es el canal que pones (el estudio).

### Qué es

Una página que muestra estudios bíblicos **como un mapa**. Cada estudio tiene esta forma:

```text
Tema (el estudio)  →  Puntos (1, 2, 3…)  →  Subpuntos (1.1, 1.2…)  →  Bloques
                                                                        (texto, pasaje,
                                                                         subtítulo, imagen, video)
```

> 🌎 **En la vida real:** como un **libro**: el libro, sus capítulos, las secciones de cada capítulo, y dentro los párrafos, las fotos y las citas.

> 🌎 **Otro ejemplo:** Como un álbum de fotos de un viaje: el viaje, cada ciudad, cada día en esa ciudad, y en cada día las fotos, los textos y los tickets.

### La decisión más importante de toda la arquitectura

> **El contenido está separado del código.** Los estudios son archivos de **datos** (JSON). El código es **una plantilla** que sabe dibujar **cualquier** estudio.

**¿Por qué importa?** Si mejoras el diseño o arreglas un error, se arregla en **todos** los estudios al mismo tiempo. No hay que tocar estudio por estudio.

> 🌎 **En la vida real:** una **iglesia con un proyector**. El proyector (el código) es siempre el mismo; lo que cambia es la presentación que pones (el estudio). No compras un proyector nuevo para cada prédica. O un **álbum de figuritas**: el álbum es el mismo, las figuritas cambian.

> 🌎 **Otro ejemplo:** Como un molde de torta: haces una torta distinta cada vez (el relleno), pero el molde es el mismo y les da a todas la misma forma.

> 💡 **Idea:** este mapa de estudios hace exactamente lo mismo con tus `LECCION.md` (Tema 18): "una sola fuente de verdad".

> 🧩 **Piezas para este ejercicio**
> - `estudio.puntos` es una lista. `.length` cuenta cuántos elementos hay. Cada punto tiene su propia lista `subpuntos`.
> - `flatMap` toma una lista de cada elemento y las reúne en una sola. Por ejemplo, `[[1, 2], [3]].flatMap((grupo) => grupo)` da `[1, 2, 3]`.
> - `reduce` puede llevar un total. Empieza en 0 y en cada vuelta suma el tamaño de la lista de bloques del subpunto actual.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Contar temas, puntos y subpuntos
lenguaje: js
pide: Un estudio (el **tema**) tiene **puntos**, y cada punto tiene **subpuntos**. Completa `contar(estudio)`: devuelve `{ puntos, subpuntos, bloques }` sumando todo (cada subpunto tiene una lista `bloques`).
--- código
function contar(estudio) {
  // tu código aquí
}
--- pruebas
const estudio = { titulo: '¿Lenguas extrañas?', puntos: [
  { titulo: 'Qué dice', subpuntos: [{ bloques: [1, 2] }, { bloques: [3] }] },
  { titulo: 'Para hoy', subpuntos: [{ bloques: [4, 5, 6] }] },
] };
prueba('cuenta todo', () => igual(contar(estudio), { puntos: 2, subpuntos: 3, bloques: 6 }));
prueba('un estudio vacío', () => igual(contar({ puntos: [] }), { puntos: 0, subpuntos: 0, bloques: 0 }));
--- solución
function contar(estudio) {
  const subpuntos = estudio.puntos.flatMap((p) => p.subpuntos);
  return {
    puntos: estudio.puntos.length,
    subpuntos: subpuntos.length,
    bloques: subpuntos.reduce((s, sp) => s + sp.bloques.length, 0),
  };
}
```

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

> 🌎 **Otro ejemplo:** Como armar un puesto en la feria con una mesa y un toldo, en vez de construir un local: para lo que vendes, alcanza y sobra.

> 💡 **Idea:** la web de Copiloto (Tema 13) sí usa React. ¿Contradicción? No: esa web es grande y comparte código con la app. **Se elige la herramienta según el tamaño del trabajo** (Tema 10, parte 9).

> 🧩 **Piezas para este ejercicio**
> - `'cambiar el color'.includes('color')` da `true`. Busca un fragmento dentro del texto.
> - Con `.some(...)` puedes probar una lista de palabras y saber si al menos una aparece en la descripción.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: HTML, CSS o JavaScript
lenguaje: js
pide: Completa `queArchivo(cambio)`: si el cambio es de **cómo se ve** (color, tamaño, letra, espacio) → `'css'`; si es de **qué hace** (botón que hace algo, al tocar, guardar) → `'js'`; si es de **qué hay** (agregar un título, un párrafo) → `'html'`.
--- código
function queArchivo(cambio) {
  // tu código aquí
}
--- pruebas
prueba('el color de los botones', () => igual(queArchivo('cambiar el color de los botones'), 'css'));
prueba('el tamaño de la letra', () => igual(queArchivo('agrandar el tamaño de la letra'), 'css'));
prueba('que un botón haga algo', () => igual(queArchivo('que al tocar el botón se abra el PDF'), 'js'));
prueba('un título nuevo', () => igual(queArchivo('agregar un título arriba'), 'html'));
--- solución
const COMO_SE_VE = ['color', 'tamaño', 'letra', 'espacio'];
const QUE_HACE = ['al tocar', 'haga', 'guardar'];

function queArchivo(cambio) {
  if (COMO_SE_VE.some((p) => cambio.includes(p))) return 'css';
  if (QUE_HACE.some((p) => cambio.includes(p))) return 'js';
  return 'html';
}
```

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

> 🌎 **Otro ejemplo:** Como una caja de herramientas con compartimentos: los destornilladores en uno, las llaves en otro; sabes dónde está cada cosa sin revolver.

> 📌 **Nota:** después del 13/11 se agregaron más archivos (por ejemplo `biblia.js`, `tema.js`, `panel-ia.js`, `panel-medidor.js`); los ves en el Tema 14. La idea es la misma: uno por tarea.

> 🧩 **Piezas para este ejercicio**
> - Un texto entre acentos graves permite meter un valor con `${...}`. Si `nombre` vale `'enero'`, `` `informes/${nombre}.json` `` da `'informes/enero.json'`.
> - En `archivos[tarea]`, la variable `tarea` trae el nombre de la propiedad que quieres consultar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El mapa de archivos
lenguaje: js
pide: Completa `rutaDelEstudio(id)` (los estudios viven en `estudios/<id>.json`) y `archivoQue(trabajo)` con: dibujar el mapa → `'mapa.js'`, guardar en GitHub → `'github.js'`, armar el PDF → `'pdf.js'`, los efectos → `'efectos.js'`.
--- código
function rutaDelEstudio(id) {
  // tu código aquí
}

function archivoQue(trabajo) {
  // tu código aquí
}
--- pruebas
prueba('la ruta del estudio', () => igual(rutaDelEstudio('lenguas-extranas'), 'estudios/lenguas-extranas.json'));
prueba('dibujar el mapa', () => igual(archivoQue('dibujar el mapa'), 'mapa.js'));
prueba('guardar en GitHub', () => igual(archivoQue('guardar en GitHub'), 'github.js'));
prueba('el PDF', () => igual(archivoQue('armar el PDF'), 'pdf.js'));
--- solución
function rutaDelEstudio(id) {
  return `estudios/${id}.json`;
}

const QUE = { 'dibujar el mapa': 'mapa.js', 'guardar en GitHub': 'github.js', 'armar el PDF': 'pdf.js', 'los efectos': 'efectos.js' };

function archivoQue(trabajo) {
  return QUE[trabajo];
}
```

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

> 🌎 **Otro ejemplo:** Como un formulario impreso con casilleros: "Nombre:", "Idioma:", y una lista de "Puntos" con sus renglones.

> 🧩 **Piezas para este ejercicio**
> - `lista.forEach((elemento, i) => { ... })` entrega el elemento y su posición. JavaScript empieza en 0, así que para mostrar «punto 1» sumas 1.
> - Hay tres niveles de listas. Conserva la posición del punto, del subpunto y del bloque mientras entras en cada nivel.
> - `bloque[campo]` lee el campo cuyo nombre tienes en una variable. Si falta esa propiedad, obtienes `undefined`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar el JSON de un estudio
lenguaje: js
pide: Completa `problemas(estudio)`: revisa los bloques de todos los subpuntos y devuelve una lista de textos con lo que falta. Un bloque `'pasaje'` necesita `referencia` y `versiculos`; un `'texto'` necesita `texto`. El mensaje es `'punto P, subpunto S, bloque B: falta X'` (contando desde 1).
--- código
function problemas(estudio) {
  // tu código aquí
}
--- pruebas
const bien = { puntos: [{ subpuntos: [{ bloques: [{ tipo: 'texto', texto: 'Hola' }, { tipo: 'pasaje', referencia: '1 Co 14', versiculos: ['2'] }] }] }] };
prueba('todo bien', () => igual(problemas(bien), []));
prueba('un pasaje sin versículos', () => igual(problemas({ puntos: [{ subpuntos: [{ bloques: [{ tipo: 'pasaje', referencia: '1 Co 14' }] }] }] }), ['punto 1, subpunto 1, bloque 1: falta versiculos']));
prueba('un texto vacío en el segundo punto', () => igual(problemas({ puntos: [{ subpuntos: [] }, { subpuntos: [{ bloques: [{ tipo: 'texto' }] }] }] }), ['punto 2, subpunto 1, bloque 1: falta texto']));
--- solución
const PIDE = { pasaje: ['referencia', 'versiculos'], texto: ['texto'] };

function problemas(estudio) {
  const lista = [];
  estudio.puntos.forEach((p, i) => p.subpuntos.forEach((sp, j) => sp.bloques.forEach((b, k) => {
    for (const campo of PIDE[b.tipo] ?? []) {
      if (b[campo] === undefined) lista.push(`punto ${i + 1}, subpunto ${j + 1}, bloque ${k + 1}: falta ${campo}`);
    }
  })));
  return lista;
}
```

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

> 🌎 **Otro ejemplo:** Como armar un sándwich: pan, manteca, jamón, queso, pan. Si pones el queso antes del pan, se te cae todo. El orden importa.

> 💡 **Idea:** este mapa de estudios usa **módulos** (`import`/`export`, Tema 17 parte 9), que resuelven el orden solos. La página de estudios usa el orden de los `<script>`: es la forma más simple, y funciona bien en una página chica.

**Ejercicio:** abre `estudio.html`, busca las etiquetas `<script>` al final, anota el orden y explica por qué es ese.

> 🧩 **Piezas para este ejercicio**
> - `new Set()` crea un conjunto vacío. `.add(nombre)` registra un nombre y `.has(nombre)` comprueba si ya está registrado.
> - Al recorrer un archivo, distingue las funciones que necesita de las que aporta. Un `return` dentro del bucle termina toda la función.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El orden de los scripts
lenguaje: js
pide: Cada archivo usa funciones que crea otro: si se carga antes, sale `cargarEstudio is not defined`. Completa `primerError(orden, usa, crea)`: recorre los scripts en orden; devuelve el primer error `'X is not defined'` (X es la función que se usa antes de ser creada), o `null` si el orden está bien.
--- código
const CREA = { 'estudios.js': ['cargarEstudio'], 'ui.js': ['bloqueHTML'], 'mapa.js': [] };
const USA = { 'estudios.js': [], 'ui.js': [], 'mapa.js': ['cargarEstudio', 'bloqueHTML'] };

function primerError(orden, usa, crea) {
  // tu código aquí
}
--- pruebas
prueba('buen orden', () => igual(primerError(['estudios.js', 'ui.js', 'mapa.js'], USA, CREA), null));
prueba('mapa.js primero', () => igual(primerError(['mapa.js', 'estudios.js', 'ui.js'], USA, CREA), 'cargarEstudio is not defined'));
prueba('falta ui.js antes', () => igual(primerError(['estudios.js', 'mapa.js', 'ui.js'], USA, CREA), 'bloqueHTML is not defined'));
--- solución
const CREA = { 'estudios.js': ['cargarEstudio'], 'ui.js': ['bloqueHTML'], 'mapa.js': [] };
const USA = { 'estudios.js': [], 'ui.js': [], 'mapa.js': ['cargarEstudio', 'bloqueHTML'] };

function primerError(orden, usa, crea) {
  const existe = new Set();
  for (const archivo of orden) {
    for (const f of usa[archivo]) if (!existe.has(f)) return `${f} is not defined`;
    for (const f of crea[archivo]) existe.add(f);
  }
  return null;
}
```

```practica
elige :: ¿Por qué importa el orden de los `<script>`? :: Por estética :: Porque cada archivo usa funciones que crean los anteriores :: No importa
elige :: ¿Qué hace `?e=lenguas-extranas` en la dirección? :: Cambia el idioma :: Le dice a la página qué estudio abrir :: Abre el panel
elige :: ¿Qué función trae el archivo JSON del estudio? :: `revelar()` :: `cargarEstudio()` :: `show()`
escribe :: ¿Qué error saldría si `mapa.js` se cargara antes que `estudios.js`, y por qué? :: cargarEstudio is not defined, porque mapa.js la usaría antes de que estudios.js la creara.
```

> 🔁 **Repaso:** `ui.js` → `estudios.js` → `efectos.js` → `mapa.js`. Cada uno usa lo de los anteriores; por eso el orden importa.

## 6. Una función que sirve para todo: `bloqueHTML` y `puntoHTML`

> 🎙️ **El profesor:** esta es **la** pieza más elegante del proyecto. Míralo con cuidado, porque es lo que más te va a lucir en una entrevista.

> 🌎 **En la vida real:** Es como la máquina de un fotógrafo que imprime las mismas fotos para el álbum, para el cuadro y para el celular: si mejora la máquina, mejoran las tres copias.

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

> 🌎 **Otro ejemplo:** Como poner entre comillas lo que alguien dijo en un acta: queda claro que es una cita, no una orden del que escribe el acta.

> 🧩 **Piezas para este ejercicio**
> - `.replaceAll(viejo, nuevo)` sustituye todas las apariciones de un fragmento. Por ejemplo, `'a-a'.replaceAll('-', '/')` da `'a/a'`.
> - Cambia primero los `&` que ya trae el texto. Las entidades que agregues después, como `&lt;`, también empiezan con `&`.
> - Llama a la función de escape al insertar el contenido de texto dentro del párrafo. Las etiquetas del párrafo salen de la plantilla.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: esc(): que el texto no rompa el HTML
lenguaje: js
pide: Lo que escribe una persona puede traer `<`, `>`, `&` o comillas, y romper la página (o algo peor). Completa `esc(texto)`: cambia `&` por `&amp;`, `<` por `&lt;`, `>` por `&gt;` y `"` por `&quot;`. Después úsala en `bloqueHTML`.
--- código
function esc(texto) {
  // tu código aquí
}

function bloqueHTML(bloque) {
  return `<p class="bloque">${bloque.texto}</p>`;
}
--- pruebas
prueba('un texto normal queda igual', () => igual(esc('Hola, hermanos'), 'Hola, hermanos'));
prueba('las etiquetas no pasan', () => igual(esc('<script>'), '&lt;script&gt;'));
prueba('el & primero', () => igual(esc('a & <b>'), 'a &amp; &lt;b&gt;'));
prueba('bloqueHTML usa esc', () => igual(bloqueHTML({ texto: '<img onerror=x>' }), '<p class="bloque">&lt;img onerror=x&gt;</p>'));
--- solución
function esc(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function bloqueHTML(bloque) {
  return `<p class="bloque">${esc(bloque.texto)}</p>`;
}
```

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

> 🌎 **En la vida real:** Es como los colores de un equipo de fútbol: "azul del club" se define una vez, y la camiseta, la bandera y el escudo lo usan por su nombre.

> 🌎 **Otro ejemplo:** Es como las pinturas de una casa con nombre de catálogo: si cambias la fórmula del "verde salvia", cambian todas las paredes que lo usan.

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

> 🌎 **Otro ejemplo:** Como pedir "el color del equipo" en una tienda de camisetas: el vendedor lo busca en el catálogo y lo usa en el número, el nombre y el escudo.

> 🧩 **Piezas para este ejercicio**
> - `TOKENS.includes(color)` comprueba si ese nombre está permitido. `condición ? valorSiSí : valorSiNo` elige uno de dos valores.
> - `var(--morado)` lee una variable de CSS. `--c` es la otra variable que recibe ese color para este punto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Del nombre del color al token
lenguaje: js
pide: El JSON dice `"morado"`; la página usa el token `var(--morado)` y lo pasa a `--c`, el color del punto. Completa `estiloDelPunto(color)`: devuelve `'--c: var(--morado)'`. Si el color no está en `TOKENS`, usa `'azul'`.
--- código
const TOKENS = ['morado', 'azul', 'verde', 'naranja'];

function estiloDelPunto(color) {
  // tu código aquí
}
--- pruebas
prueba('morado', () => igual(estiloDelPunto('morado'), '--c: var(--morado)'));
prueba('verde', () => igual(estiloDelPunto('verde'), '--c: var(--verde)'));
prueba('uno que no existe: azul', () => igual(estiloDelPunto('fucsia'), '--c: var(--azul)'));
--- solución
const TOKENS = ['morado', 'azul', 'verde', 'naranja'];

function estiloDelPunto(color) {
  const token = TOKENS.includes(color) ? color : 'azul';
  return `--c: var(--${token})`;
}
```

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

> 🌎 **Otro ejemplo:** Como las luces de un escenario: el técnico decide cuándo se prenden; el reflector decide cómo se ve la luz.

> 🧩 **Piezas para este ejercicio**
> - `if (elemento.reducir)` entra cuando esa propiedad vale `true`. Si haces `return` allí, la función termina antes de mirar `enPantalla`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Decidir cuándo aparece
lenguaje: js
pide: JavaScript decide **cuándo** (pone la clase), CSS dibuja **cómo**. Completa `claseDeEntrada(elemento)`: si la persona pidió reducir movimiento (`reducir: true`) → `'visible'` desde el principio; si no, `'visible'` cuando el elemento está en pantalla (`enPantalla: true`) y `'escondido'` si todavía no.
--- código
function claseDeEntrada(elemento) {
  // tu código aquí
}
--- pruebas
prueba('fuera de pantalla: escondido', () => igual(claseDeEntrada({ enPantalla: false, reducir: false }), 'escondido'));
prueba('entra en pantalla: visible', () => igual(claseDeEntrada({ enPantalla: true, reducir: false }), 'visible'));
prueba('reducir movimiento: visible siempre', () => igual(claseDeEntrada({ enPantalla: false, reducir: true }), 'visible'));
--- solución
function claseDeEntrada(elemento) {
  if (elemento.reducir) return 'visible';
  return elemento.enPantalla ? 'visible' : 'escondido';
}
```

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

> 🌎 **Otro ejemplo:** Como una revista que se imprime y se reparte sola cada vez que el editor entrega el material: el editor no tiene que llevarla a los kioscos.

> 🧩 **Piezas para este ejercicio**
> - `.startsWith(...)` comprueba el principio del nombre y `.endsWith(...)`, el final. `.slice(inicio, fin)` extrae un tramo. Un límite final negativo cuenta desde el final.
> - `a.localeCompare(b, 'es')` compara títulos según el orden del español. Da un número negativo si `a` debe ir antes de `b`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Armar el indice.json
lenguaje: js
pide: Una página estática no puede "mirar" qué archivos hay en una carpeta; por eso GitHub Actions arma un `indice.json`. Completa `armarIndice(archivos)`: recibe `{ nombre, contenido }` (el contenido es el JSON del estudio, ya como objeto) y devuelve una lista `{ id, titulo }` ordenada por título. Solo cuentan los `.json` de `estudios/`.
--- código
function armarIndice(archivos) {
  // tu código aquí
}
--- pruebas
const archivos = [
  { nombre: 'estudios/lenguas-extranas.json', contenido: { titulo: '¿Lenguas extrañas?' } },
  { nombre: 'estudios/bautismo.json', contenido: { titulo: 'El bautismo' } },
  { nombre: 'README.md', contenido: null },
];
prueba('el índice', () => igual(armarIndice(archivos), [{ id: 'lenguas-extranas', titulo: '¿Lenguas extrañas?' }, { id: 'bautismo', titulo: 'El bautismo' }]));
prueba('sin estudios', () => igual(armarIndice([]), []));
--- solución
function armarIndice(archivos) {
  return archivos
    .filter((a) => a.nombre.startsWith('estudios/') && a.nombre.endsWith('.json'))
    .map((a) => ({ id: a.nombre.slice('estudios/'.length, -'.json'.length), titulo: a.contenido.titulo }))
    .sort((x, y) => x.titulo.localeCompare(y.titulo, 'es'));
}
```

```practica
elige :: ¿Dónde vive la página? :: En un servidor propio :: En GitHub Pages :: En Firebase
elige :: ¿Por qué la página de inicio necesita `indice.json`? :: Por estética :: Porque una página estática no puede ver qué archivos hay en una carpeta :: Porque lo exige Google
elige :: ¿Quién genera los PDF, y cuándo? :: Tú, a mano :: `scripts/pdfs.sh` con Chrome, cada vez que GitHub Actions publica :: El navegador del lector
vf :: Este proceso de publicar solo es un ejemplo de CD (entrega continua)
```

> 🔁 **Repaso:** guardar → GitHub Actions (construir + PDFs) → GitHub Pages. `indice.json` porque una página estática no ve carpetas.

## 10. El panel y la llave

> 🎙️ **El profesor:** el panel (`panel.html`) es la parte más interesante del proyecto: **una página pública que edita archivos de GitHub**. ¿Cómo es seguro?

> 🌎 **En la vida real:** Es como un buzón en la calle con candado: cualquiera ve el buzón, pero solo quien tiene la llave lo abre y deja cartas.

> 🌎 **Otro ejemplo:** Es como el panel de control de un edificio inteligente: está en la pared, pero sin la tarjeta del administrador no cambia nada.

### La llave

- El panel **es una página pública**, pero **sin la llave no puede guardar nada**.
- La **llave** es un ***token*** **de GitHub**: una contraseña especial que **solo** permite editar archivos de `que-dice-la-biblia`. Nada más de la cuenta.
- La llave se guarda **solo en el aparato** (`localStorage`, Tema 17). No se sube a ningún lado.
- `github.js` manda cada cambio a la **API de GitHub** con la llave. **GitHub decide:** si la llave es válida, guarda; si no, rechaza.

Es la misma idea de las reglas de Firestore (Tema 08): **la seguridad la pone el servidor** (GitHub), no la página.

> 🌎 **En la vida real:** una puerta que da a la calle: cualquiera llega hasta ella, pero sin llave no entra. La llave solo abre **un cuarto**, se guarda **en tu bolsillo**, y quien decide si sirve es la **cerradura** (GitHub), no la puerta.

> 🌎 **Otro ejemplo:** Como la llave de un depósito alquilado que solo abre ese depósito, no toda la empresa de depósitos.

### Un archivo por tarea

> 🌎 **En la vida real:** Es como un equipo de mudanza donde uno embala, otro carga, otro maneja y otro descarga: cada uno su tarea, y nadie se pisa.

> 🌎 **Otro ejemplo:** Es como los cajones de un escritorio ordenado: uno para papeles, otro para lapiceras, otro para cables.

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

> 🌎 **Otro ejemplo:** Como la dirección de un asiento en un estadio: tribuna 2, fila 0, asiento 1. Con un solo acomodador que sabe leer direcciones, encuentra cualquier asiento.

### La vista previa

Es la página real del estudio (`estudio.html?vista=1`) dentro de un cuadro (un `iframe`). El panel le **manda** el estudio con **`postMessage`** (una forma de mandarle mensajes a otra página) cada vez que cambias algo, y ella se vuelve a dibujar.

> 🌎 **En la vida real:** un probador con espejo: cada vez que cambias algo, alguien te pasa la prenda nueva por debajo de la cortina y el espejo te la muestra.

> 🌎 **Otro ejemplo:** Como una vidriera con un empleado detrás: cada vez que cambias el precio en la libreta, él actualiza el cartel de la vidriera.

> 🧩 **Piezas para este ejercicio**
> - `.split('.')` convierte una ruta en una lista de pasos. Al hacer `objeto[paso]`, el mismo acceso sirve para una propiedad o una posición de una lista.
> - Distingue el último paso de los anteriores. Los anteriores llevan al objeto que contiene el dato. El último indica dónde escribir.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cambiar un dato por su ruta
lenguaje: js
pide: El panel guarda cada cambio con una ruta como `temas.2.puntos.0.bloques.1.texto`. Completa `leer(objeto, ruta)` y `cambiar(objeto, ruta, valor)` (cambia el dato en su lugar). Los pedazos que son números son posiciones de una lista.
--- código
function leer(objeto, ruta) {
  // tu código aquí
}

function cambiar(objeto, ruta, valor) {
  // tu código aquí
}
--- pruebas
const nuevo = () => ({ temas: [{}, {}, { puntos: [{ bloques: [{ texto: 'a' }, { texto: 'b' }] }] }] });
prueba('leer', () => igual(leer(nuevo(), 'temas.2.puntos.0.bloques.1.texto'), 'b'));
prueba('cambiar', () => { const o = nuevo(); cambiar(o, 'temas.2.puntos.0.bloques.1.texto', 'nuevo'); igual(o.temas[2].puntos[0].bloques[1].texto, 'nuevo'); });
prueba('leer algo que no existe da undefined', () => igual(leer(nuevo(), 'temas.9.puntos'), undefined));
--- solución
function leer(objeto, ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), objeto);
}

function cambiar(objeto, ruta, valor) {
  const partes = ruta.split('.');
  const ultima = partes.pop();
  leer(objeto, partes.join('.'))[ultima] = valor;
}
```

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

> 🌎 **En la vida real:** Son como los accesorios de una cocina que te ahorran trabajo: el rallador, la licuadora y el procesador hacen en segundos lo que a mano tardaría mucho.

> 🌎 **Otro ejemplo:** Son como el escáner, el lector de códigos y la balanza de una caja de supermercado: cada uno acelera un paso distinto.

### Pegar desde la app Biblia (`panel-pegar.js`)

Lee el texto copiado y encuentra la referencia con una **expresión regular** (Tema 01: un patrón de texto):

```js
// "Hechos 1:5 LBLA" = libro + capítulo:versículo + sigla
/^(?:[1-3]\s?)?[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)*\s\d+:\d+…\s+[A-Z]{2,6}\d*$/
```

No hace falta entender cada símbolo: reconoce "**(un número opcional como en 1 Corintios) + nombre del libro + capítulo:versículo + sigla en mayúsculas**". Además quita comillas, el link y unos **caracteres invisibles** que pone la app al copiar, y escribe "SEÑOR" en versalitas.

> 🌎 **En la vida real:** el empleado del correo que reconoce un código postal de un vistazo.

> 🌎 **Otro ejemplo:** Como el lector de códigos de barras del supermercado: reconoce el patrón y sabe qué producto es.

### Leer de una foto (`panel-foto.js`)

> 🌎 **En la vida real:** Es como el escáner de documentos del celular: sacas la foto y convierte las letras en texto, sin mandar la foto a ningún lado.

> 🌎 **Otro ejemplo:** Es como copiar a mano lo que dice un cartel, pero hecho por una máquina, y después lo revisas por si leyó algo mal.

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

> 🌎 **Otro ejemplo:** Como comprimir un archivo antes de mandarlo por correo: llega rápido y no llena la casilla.

> 🧩 **Piezas para este ejercicio**
> - `.map(Number)` convierte los textos a números. `Set` elimina los repetidos y `.sort((a, b) => a - b)` los ordena por su valor.
> - Para saber si dos versículos son seguidos, compara el siguiente con el actual más uno. `.join(', ')` une los tramos con comas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: rangos(): versículos seguidos, juntos
lenguaje: js
pide: Completa `rangos(versiculos)`: recibe números como texto, en cualquier orden, y junta los seguidos: `["2","3","4","10"]` → `'2-4, 10'`. Sin repetidos.
--- código
function rangos(versiculos) {
  // tu código aquí
}
--- pruebas
prueba('el ejemplo de la clase', () => igual(rangos(['2', '3', '4', '10']), '2-4, 10'));
prueba('uno solo', () => igual(rangos(['7']), '7'));
prueba('desordenados y repetidos', () => igual(rangos(['5', '1', '2', '2', '6']), '1-2, 5-6'));
prueba('ninguno', () => igual(rangos([]), ''));
--- solución
function rangos(versiculos) {
  const n = [...new Set(versiculos.map(Number))].sort((a, b) => a - b);
  const partes = [];
  for (let i = 0; i < n.length; i++) {
    const inicio = n[i];
    while (n[i + 1] === n[i] + 1) i++;
    partes.push(inicio === n[i] ? `${inicio}` : `${inicio}-${n[i]}`);
  }
  return partes.join(', ');
}
```

```practica
elige :: ¿Qué devuelve `rangos(["2","3","4","10"])`? :: "2, 3, 4, 10" :: "2-4, 10" :: "2-10"
elige :: ¿Por qué se achican las fotos antes de subirlas? :: Para que se vean más feas :: Para que la página cargue rápido y el repositorio no se llene :: Porque GitHub lo exige
vf :: Con Tesseract.js, la foto se manda a un servidor para leerla
elige :: ¿Qué es OCR? :: Un formato de imagen :: Reconocer texto en una imagen :: Un tipo de JSON
```

> 🔁 **Repaso:** expresión regular para reconocer referencias; Tesseract.js (OCR en el navegador) + `rangos()`; y `<canvas>` para achicar fotos.

## 12. Decisiones que se tomaron (y lo que salió mal)

> 🎙️ **El profesor:** en una entrevista, contar **qué salió mal y qué decidiste** vale tanto como contar lo que salió bien. Estas son las decisiones reales del proyecto.

> 🌎 **Otro ejemplo:** Como el cuaderno de errores de un cocinero: "esta receta se quemaba a 200°, ahora va a 180°". Contar lo que salió mal enseña tanto como lo que salió bien.

| Qué pasó | Qué se decidió | 🌎 Como… |
|---|---|---|
| El primer panel fue **Pages CMS** (uno ya hecho): feo, en inglés, y una línea de su configuración (`media: false`) impedía abrirlo | Se hizo un **panel propio**, con el mismo diseño de la página | Un mueble armado que no entra por la puerta: lo haces a medida |
| Se agregó un **lector de voz**, pero en el iPhone no sonaba (en modo silencio la voz de las páginas no suena) | Se **quitó por completo**: botones, código, estilos y textos | Un timbre que no suena en la mitad de las casas: mejor quitarlo |
| El panel **borraba el estilo de las palabras griegas** al editar | Se cambió la limpieza para que respete las clases `g` (griego) y `sc` (versalitas) | Una lavadora que despinta los bordados |
| `panel.js` llegó a **casi 500 líneas** | Se **dividió en archivos** por tarea | El cajón de cubiertos que creció demasiado |
| Los numeritos de versículo en las fotos **salen mal leídos** | El panel muestra la lista **para revisar y corregir** | Un dictado con ruido: se relee |
| La LBLA tiene **derechos de autor** | No se copia de internet: se pega desde la app o se lee de una foto | No fotocopiar un libro entero |

> 🧩 **Piezas para este ejercicio**
> - `.find(...)` devuelve la primera regla que cumple la condición, o `undefined`. Una regla puede tener varios prefijos y `.some(...)` comprueba si alguno coincide.
> - Al agrupar por archivo, crea su lista la primera vez que aparezca y agrega las siguientes funciones a esa misma lista.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dividir un archivo por responsabilidad
lenguaje: js
pide: Una decisión para no hacer espagueti: dividir `panel.js` en archivos por tarea. Completa `dividir(funciones)`: cada función va al archivo según su prefijo: `guardar…`/`subir…` → `'panel-github.js'`; `dibujar…`/`mostrar…` → `'panel-vista.js'`; `foto…`/`ocr…` → `'panel-fotos.js'`; el resto → `'panel.js'`. Devuelve un objeto archivo → lista de funciones.
--- código
function dividir(funciones) {
  // tu código aquí
}
--- pruebas
const fns = ['guardarEstudio', 'dibujarPunto', 'fotoAchicar', 'iniciar', 'subirImagen', 'ocrLeer', 'mostrarAviso'];
prueba('cada una a su archivo', () => igual(dividir(fns), {
  'panel-github.js': ['guardarEstudio', 'subirImagen'],
  'panel-vista.js': ['dibujarPunto', 'mostrarAviso'],
  'panel-fotos.js': ['fotoAchicar', 'ocrLeer'],
  'panel.js': ['iniciar'],
}));
--- solución
const REGLAS = [
  [['guardar', 'subir'], 'panel-github.js'],
  [['dibujar', 'mostrar'], 'panel-vista.js'],
  [['foto', 'ocr'], 'panel-fotos.js'],
];

function dividir(funciones) {
  const resultado = {};
  for (const f of funciones) {
    const regla = REGLAS.find(([prefijos]) => prefijos.some((p) => f.startsWith(p)));
    const archivo = regla ? regla[1] : 'panel.js';
    (resultado[archivo] ??= []).push(f);
  }
  return resultado;
}
```

```practica
escribe :: Nombra una decisión que se tomó para que el código no fuera espagueti. :: Dividir panel.js en archivos por tarea; o separar el contenido (JSON) del código; o usar una sola función para la página, el PDF y la vista previa; o los colores como tokens.
elige :: ¿Por qué se quitó el lector de voz? :: Porque era lento :: Porque en el iPhone, en modo silencio, no sonaba :: Porque nadie lo pidió
elige :: ¿Qué se hizo con Pages CMS? :: Se dejó :: Se reemplazó por un panel propio :: Se tradujo
vf :: Contar lo que salió mal en un proyecto ayuda en una entrevista
```

> 🔁 **Repaso:** panel propio en vez de Pages CMS; quitar lo que no funciona (la voz); respetar el griego; dividir archivos grandes; revisar el OCR; y respetar derechos de autor.

## Para la entrevista

> 🎙️ **El profesor:** la explicación completa está en [Para la entrevista](EXPLICACIONES-PARA-ENTREVISTA.md). Aquí, la versión para decir en voz alta en un minuto.

> 🌎 **En la vida real:** Contar este proyecto es como mostrar una casa terminada: el plano, los materiales, por qué se hizo cada cosa y qué se cambiaría.

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
