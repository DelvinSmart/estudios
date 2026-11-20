# HTML

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** abre al lado un editor (VS Code) y un navegador. Crea una carpeta `practica` dentro de esta clase con un archivo `practica/index.html`: todo lo que aprendas, escríbelo ahí y míralo con doble clic. Cada vez que cambies algo: guarda y recarga (`Cmd + R`).

**Lo que necesitas saber antes:** los Fundamentos (Temas 116, 01 y 44). Si nunca programaste, también las clases 45 a 48 (variables, decisiones, funciones y listas).

## 1. Qué es HTML

> 🎙️ **El profesor:** {{alumno}}, empezamos una etapa nueva: **la web**. Tu página **¿Qué dice la Biblia?** y este mismo mapa están hechos con tres piezas: HTML, CSS y JavaScript. Hoy, la primera. Y te adelanto algo: es la más fácil de las tres.

> 🌎 **En la vida real:** Es como el esqueleto de un edificio en construcción: ya se ven los pisos, las paredes y las ventanas, aunque todavía no tenga pintura ni luz.

> 🌎 **Otro ejemplo:** Es como el índice de un libro con los capítulos marcados: dice qué es título, qué es párrafo y qué es lista, sin decir de qué color van.

### Una página es un texto con etiquetas

**HTML** quiere decir *HyperText Markup Language*: "lenguaje para **marcar** texto". No es un lenguaje de programación: **no hace cuentas ni toma decisiones** (no tiene `if`, ni funciones). Solo **describe qué es cada parte** de la página.

```html
<h1>¿Qué dice la Biblia?</h1>
<p>Estudios bíblicos en forma de mapa.</p>
<button>Abrir estudio</button>
```

El navegador lee esas **etiquetas** y dibuja: un **título** grande (`h1`), un **párrafo** (`p`) y un **botón** (`button`).

> 🌎 **En la vida real:** las etiquetas de una mudanza. Pegas en cada caja "COCINA", "LIBROS", "FRÁGIL". La caja no cambia, pero ahora todos saben qué hay dentro. HTML pone etiquetas al contenido: "esto es un título", "esto es un botón".

> 🌎 **Otro ejemplo:** Como los rótulos de un formulario impreso: "Nombre", "Dirección", "Firma". El papel no cambia, pero cada casilla ya dice qué va ahí.

### Las tres piezas de la web

> 🌎 **Otro ejemplo:** En un carro: el chasis y la carrocería (HTML), la pintura y el tapizado (CSS), y el motor con la electricidad (JavaScript).

| Pieza | Qué hace | 🌎 En una casa | En tu página de estudios |
|---|---|---|---|
| **HTML** | **Qué cosas hay** | Las paredes y los cuartos | Las tarjetas de estudios en `index.html` |
| **CSS** | **Cómo se ven** | La pintura y los muebles | Los colores en `css/styles.css` |
| **JavaScript** | **Qué hacen** | La electricidad | Cargar el estudio y dibujar el mapa en `js/` |

**Prueba ahora:** escribe esas tres líneas en tu `practica/index.html`, guarda y ábrelo con doble clic. Vas a ver el título, el párrafo y el botón, sin colores (todavía no hay CSS).

> ✋ **Para y piensa:** ¿se puede hacer una calculadora solo con HTML?

<details>
<summary>Ver la respuesta</summary>

**No.** Con HTML puedes poner los botones y la pantallita, pero **sumar** lo hace JavaScript. HTML solo describe; no calcula.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primera página
lenguaje: html
pide: Escribe un título principal `h1` que diga **Mis estudios** y un párrafo `p` que diga **Aprendo HTML**.
--- código
<!-- tu HTML aquí -->
--- pruebas
prueba('hay un h1 que dice Mis estudios', () => igual($('h1')?.textContent.trim(), 'Mis estudios'));
prueba('hay un párrafo que dice Aprendo HTML', () => igual($('p')?.textContent.trim(), 'Aprendo HTML'));
--- solución
<h1>Mis estudios</h1>
<p>Aprendo HTML</p>
```

```practica
escribe :: Con tus palabras: ¿qué es HTML? :: El lenguaje que describe la estructura de una página: qué es cada parte (un título, un párrafo, un botón). No calcula ni decide.
vf :: HTML es un lenguaje de programación que puede hacer cuentas
vf :: Una página sin CSS igual se ve, con los estilos por defecto del navegador
elige :: ¿Qué pieza decide los colores de la página? :: HTML :: CSS :: JavaScript
elige :: ¿Qué pieza hace que un botón responda al clic? :: HTML :: CSS :: JavaScript
```

> 🔁 **Repaso:** HTML describe qué hay (estructura), CSS cómo se ve, JavaScript qué hace.

## 2. Etiquetas, elementos y atributos

> 🎙️ **El profesor:** ahora las tres palabras que vas a usar para hablar de HTML: **etiqueta**, **elemento** y **atributo**. Mira esta línea con calma:

```html
<a href="estudio.html" class="tarjeta" id="primer-estudio">Abrir el estudio</a>
```

| Parte | Qué es | En el ejemplo |
|---|---|---|
| Etiqueta de apertura | Dónde empieza | `<a ...>` |
| Contenido | Lo que se ve | `Abrir el estudio` |
| Etiqueta de cierre | Dónde termina (lleva `/`) | `</a>` |
| **Atributo** | Un dato extra, con la forma `nombre="valor"` | `href="estudio.html"` |
| **Elemento** | Todo junto: apertura + contenido + cierre | toda la línea |

> 🌎 **En la vida real:** un sobre de carta. La etiqueta de apertura es abrir el sobre; la de cierre, cerrarlo; lo de adentro es la carta. Los **atributos** son lo que escribes **por fuera**: la dirección, "urgente". No son la carta, pero dicen algo sobre ella.

> 🌎 **Otro ejemplo:** Como una etiqueta de precio en una tienda: la etiqueta (apertura y cierre) rodea el producto (el contenido), y en el costado tiene datos extra: código, talle, color (los atributos).

### Etiquetas que no se cierran

> 🌎 **En la vida real:** Es como un sello de "PAGADO" en una factura: se estampa y listo; no envuelve nada adentro.

> 🌎 **Otro ejemplo:** Es como un clavo en la pared: está o no está; no tiene un "principio" y un "fin" con algo en el medio.

Algunas etiquetas **no tienen nada adentro**, así que no llevan cierre. Se llaman **vacías**:

```html
<img src="logo.png" alt="Logo de Copiloto Driver">
<br>
<input type="text">
```

### Los tres atributos más comunes

> 🌎 **En la vida real:** Es como tu documento de identidad (id, único), tu equipo de fútbol (class, lo comparten muchos) y la dirección de tu casa (href, a dónde lleva).

> 🌎 **Otro ejemplo:** Es como en una escuela: el número de matrícula es único (id), el grado lo comparten muchos alumnos (class).

- **`id`**: un nombre **único** en toda la página. Como tu número de documento: solo tú lo tienes.
- **`class`**: un **grupo**. Muchos elementos pueden tener la misma clase. Como "conductor de Uber": lo son miles.
- **`href`** y **`src`**: a dónde lleva un enlace (`href`) y de dónde sale una imagen (`src`).

> ✋ **Para y piensa:** en `<img src="foto.jpg" alt="Mi carro">`, ¿cuál es la etiqueta y cuáles los atributos? ¿Tiene cierre?

<details>
<summary>Ver la respuesta</summary>

La etiqueta es **`img`**; los atributos son **`src`** y **`alt`**. **No tiene cierre**: es una etiqueta vacía (una imagen no tiene "contenido" de texto).

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Etiquetas, atributos, id y class
lenguaje: html
pide: Haz un enlace `a` que diga **Abrir** y lleve a `estudio.html`, con `id="principal"`. Después, dos párrafos con la misma `class="nota"`. Y una imagen `img` con `src="logo.png"` y un `alt` que la describa (sin etiqueta de cierre).
--- código
<!-- tu HTML aquí -->
--- pruebas
prueba('el enlace lleva a estudio.html', () => igual($('a')?.getAttribute('href'), 'estudio.html'));
prueba('el enlace dice Abrir', () => igual($('a')?.textContent.trim(), 'Abrir'));
prueba('el enlace tiene id="principal"', () => ok($('a#principal'), 'falta id="principal" en el enlace'));
prueba('dos párrafos con class="nota"', () => igual(document.querySelectorAll('p.nota').length, 2));
prueba('la imagen tiene alt', () => ok($('img[src="logo.png"]')?.alt.trim(), 'falta el alt de la imagen'));
--- solución
<a id="principal" href="estudio.html">Abrir</a>
<p class="nota">Primera nota</p>
<p class="nota">Segunda nota</p>
<img src="logo.png" alt="Logo de Mis estudios">
```

```practica
elige :: En `<a href="estudio.html">Abrir</a>`, ¿qué es `href="estudio.html"`? :: El contenido :: Un atributo :: La etiqueta de cierre
elige :: ¿Cómo se reconoce una etiqueta de cierre? :: Tiene comillas :: Tiene una barra `/` :: Tiene un número
vf :: Dos elementos pueden tener el mismo `id`
vf :: Muchos elementos pueden compartir la misma `class`
vf :: `<img>` necesita una etiqueta de cierre `</img>`
escribe :: ¿Qué diferencia hay entre `id` y `class`? :: El id es un nombre único en la página; la class es un grupo que comparten muchos elementos.
```

> 🔁 **Repaso:** elemento = apertura + contenido + cierre. Atributo = `nombre="valor"` en la apertura. `id` único, `class` grupo, `href` y `src` direcciones. Algunas etiquetas son vacías.

## 3. El esqueleto de toda página

> 🎙️ **El profesor:** toda página HTML del mundo tiene el mismo esqueleto. Apréndelo una vez y empieza siempre desde aquí.

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mi página</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
  <h1>Hola</h1>
  <script src="app.js"></script>
</body>
</html>
```

Línea por línea:

| Línea | Para qué sirve |
|---|---|
| `<!doctype html>` | "Esto es HTML moderno." |
| `<html lang="es">` | La caja de todo. `lang="es"` avisa que está en español (ayuda a lectores de pantalla y a Google). |
| `<head>` | **Lo que NO se ve**: el título de la pestaña, el idioma de las letras, los estilos. |
| `<meta charset="utf-8">` | Para que las **tildes y la ñ** se vean bien. |
| `<meta name="viewport" ...>` | Para que **en el celular** la página no se vea chiquitita. |
| `<title>` | El nombre en **la pestaña** del navegador. |
| `<link rel="stylesheet" href="…">` | Conecta el archivo de **CSS**. |
| `<body>` | **Lo que SÍ se ve**. |
| `<script src="…">` | Conecta el **JavaScript**. Va al final del `body`, para que primero exista lo que va a usar. |

> 🌎 **En la vida real:** el formulario de un documento oficial: siempre la misma estructura (un encabezado con datos que nadie ve a simple vista, y el cuerpo con el contenido).

> 🌎 **Otro ejemplo:** Como el esqueleto de una carta formal: membrete arriba, fecha, saludo, cuerpo, despedida y firma. Siempre en el mismo orden.

> 💡 **Idea:** abre `index.html` de tu página `que-dice-la-biblia` y busca cada una de estas líneas. Están todas.

**Prueba ahora:** reemplaza tu `practica/index.html` por este esqueleto, cambia el `<title>` por tu nombre y mira la pestaña del navegador.

> ✋ **Para y piensa:** quitas la línea `<meta charset="utf-8">` y tu página dice "InformaciÃ³n". ¿Qué pasó?

<details>
<summary>Ver la respuesta</summary>

Sin `charset="utf-8"`, el navegador no sabe cómo leer las letras especiales, y la "ó" sale como símbolos raros. Hay que volver a poner esa línea.

</details>

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.toLowerCase()` y `.toUpperCase()`**: pasan un texto a minúsculas o a mayúsculas. `'DocType'.toLowerCase()` → `'doctype'`. Sirve para comparar sin que importen las mayúsculas.
> - **`.includes()`**: pregunta si algo está adentro. En un texto: `'hola mundo'.includes('mundo')` → `true`. En una lista: `['a', 'b'].includes('c')` → `false`.
> - **`.filter()`**: recorre una lista y se queda solo con los elementos que cumplen una condición, como un colador. `[3, 8, 1].filter((n) => n > 2)` → `[3, 8]`.
> - **`.map()`**: recorre una lista y transforma cada elemento, como una máquina que pinta cada pieza que pasa. `[1, 2].map((n) => n * 10)` → `[10, 20]`.
> - Fíjate en el `(n) => …`: es una **función corta** (función flecha). Recibe cada elemento y devuelve la respuesta. Lo verás a fondo en el curso de JavaScript.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El esqueleto de la página
lenguaje: js
pide: Completa `revisarEsqueleto(html)`: devuelve la lista de lo que **falta** en el texto de una página, revisando en este orden: `'doctype'` (`<!doctype html>`, sin importar mayúsculas), `'charset'` (`<meta charset="utf-8">`), `'viewport'` (`name="viewport"`), `'title'` (`<title>`).
--- código
function revisarEsqueleto(html) {
  // tu código aquí
}
--- pruebas
const completa = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Mapa</title></head><body></body></html>';
prueba('completa: no falta nada', () => igual(revisarEsqueleto(completa), []));
prueba('sin viewport', () => igual(revisarEsqueleto(completa.replace('name="viewport"', '')), ['viewport']));
prueba('sin nada', () => igual(revisarEsqueleto('<p>hola</p>'), ['doctype', 'charset', 'viewport', 'title']));
--- solución
function revisarEsqueleto(html) {
  const bajo = html.toLowerCase();
  const pide = [
    ['doctype', '<!doctype html>'],
    ['charset', '<meta charset="utf-8">'],
    ['viewport', 'name="viewport"'],
    ['title', '<title>'],
  ];
  return pide.filter(([, texto]) => !bajo.includes(texto)).map(([nombre]) => nombre);
}
```

```practica
elige :: ¿En qué parte va lo que el usuario ve? :: `head` :: `body` :: `title`
elige :: ¿Qué línea hace que las tildes y la ñ se vean bien? :: `<title>` :: `<meta charset="utf-8">` :: `<link>`
elige :: ¿Qué hace `<title>`? :: Pone un título grande en la página :: Pone el nombre en la pestaña del navegador :: Conecta el CSS
elige :: ¿Qué etiqueta conecta el archivo de CSS? :: `<script>` :: `<link rel="stylesheet">` :: `<meta>`
vf :: El `<script>` suele ir al final del `body`
escribe :: ¿Para qué sirve `<meta name="viewport">`? :: Para que en el celular la página se adapte al ancho de la pantalla y no se vea chiquitita.
```

> 🔁 **Repaso:** doctype → html (con lang) → head (charset, viewport, title, link al CSS) → body (lo que se ve, y el script al final).

## 4. Las etiquetas de texto

> 🎙️ **El profesor:** ahora el contenido. Un periódico tiene titular gigante, subtítulos, párrafos y palabras en negrita. Nadie lee un periódico donde todo es igual. Las etiquetas de texto le dan ese orden a la página.

> 🌎 **En la vida real:** Es como una revista: el título de tapa enorme, los títulos de cada nota, los párrafos, las listas y las palabras resaltadas.

> 🌎 **Otro ejemplo:** Es como un menú de restaurante: "Platos principales" (título), cada plato (lista) y "¡Recomendado!" en negrita.

```html
<h1>Copiloto Driver</h1>
<h2>Mis ingresos</h2>
<h3>Esta semana</h3>
<p>Hoy hice <strong>12 viajes</strong> y gané <em>bastante bien</em>.</p>
<ul>
  <li>Uber</li>
  <li>99</li>
  <li>inDrive</li>
</ul>
<ol>
  <li>Abrir la app</li>
  <li>Registrar el viaje</li>
</ol>
```

| Etiqueta | Qué es |
|---|---|
| `h1` a `h6` | Títulos, del más importante (`h1`) al menos importante (`h6`). **Un solo `h1` por página.** |
| `p` | Un párrafo. |
| `strong` | **Importante** (se ve en negrita). |
| `em` | *Énfasis* (se ve en cursiva). |
| `ul` + `li` | Lista **sin** orden (con puntitos). *ul* = *unordered list*. |
| `ol` + `li` | Lista **con** orden (1, 2, 3). *ol* = *ordered list*. |
| `a` | Enlace. |
| `img` | Imagen. **Siempre con `alt`**: el texto que se lee si la imagen no carga, o si la persona es ciega. |

> ⚠️ **Cuidado:** no elijas `h3` "porque se ve más chico". El número dice **qué tan importante** es el título, no su tamaño. El tamaño lo decide el CSS.

**Prueba ahora:** escribe en tu práctica una lista `ul` con tres apps y una `ol` con los pasos para registrar un viaje.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una receta con sus listas
lenguaje: html
pide: Arma una receta: un `h1` con el nombre, un `h2` **Ingredientes** con una lista **sin orden** (`ul`) de 3 cosas, y un `h2` **Pasos** con una lista **numerada** (`ol`) de 3 pasos. Marca con `strong` la palabra **importante** en algún paso.
--- código
<!-- tu receta aquí -->
--- pruebas
prueba('un solo h1', () => igual(document.querySelectorAll('h1').length, 1));
prueba('los ingredientes en ul con 3', () => igual(document.querySelectorAll('ul > li').length, 3));
prueba('los pasos en ol con 3', () => igual(document.querySelectorAll('ol > li').length, 3));
prueba('dos h2', () => igual([...document.querySelectorAll('h2')].map((h) => h.textContent.trim()), ['Ingredientes', 'Pasos']));
prueba('strong con importante', () => igual($('ol strong')?.textContent.trim(), 'importante'));
--- solución
<h1>Arroz con huevo</h1>
<h2>Ingredientes</h2>
<ul>
  <li>Arroz</li>
  <li>Huevo</li>
  <li>Sal</li>
</ul>
<h2>Pasos</h2>
<ol>
  <li>Cocinar el arroz.</li>
  <li>Freír el huevo. Lo <strong>importante</strong>: el aceite caliente.</li>
  <li>Servir.</li>
</ol>
```

```practica
elige :: Para los pasos de una receta, ¿qué lista usas? :: `ul` :: `ol` :: `li`
elige :: ¿Cuántos `h1` debería tener una página? :: Muchos :: Uno :: Ninguno
elige :: ¿Para qué sirve el `alt` de una imagen? :: Para cambiar el tamaño :: Para describirla a quien no la ve, o si no carga :: Para ponerle un borde
vf :: Se elige `h3` en vez de `h2` porque se ve más chico
vf :: `li` es cada elemento de una lista
elige :: `<strong>` sirve para… :: Hacer un enlace :: Marcar algo importante (negrita) :: Hacer una lista
```

> 🔁 **Repaso:** `h1`–`h6` (títulos por importancia), `p`, `strong`, `em`, `ul`/`ol` con `li`, `a`, `img` con `alt`.

## 5. Las cajas que ordenan la página (HTML semántico)

> 🎙️ **El profesor:** esta parte es la que más preguntan en entrevistas de front-end: **HTML semántico**. La palabra asusta; la idea es simple.

"**Semántico**" quiere decir "**que tiene significado**". En vez de usar cajas genéricas (`div`) para todo, usas **la caja que dice qué es**:

```html
<body>
  <header>logo y menú de arriba</header>
  <nav>los enlaces para moverse</nav>
  <main>
    <section>
      <h2>Estudios recientes</h2>
      <article>una tarjeta de estudio</article>
      <article>otra tarjeta de estudio</article>
    </section>
  </main>
  <aside>algo al costado, como un índice</aside>
  <footer>el pie de página</footer>
</body>
```

| Etiqueta | Qué zona es |
|---|---|
| `header` | La cabecera (logo, título, menú) |
| `nav` | Navegación: enlaces para ir a otras partes |
| `main` | El contenido principal. **Uno por página** |
| `section` | Una sección con su propio título |
| `article` | Algo que tiene sentido **solo**: una tarjeta, una noticia, un estudio |
| `aside` | Algo al costado: un índice, una ayuda |
| `footer` | El pie |
| `div` | Caja **sin** significado, para agrupar cuando ninguna otra sirve |
| `span` | Lo mismo que `div`, pero **dentro de una línea** de texto |

**¿Por qué importa si se ve igual?**
1. **Accesibilidad:** un lector de pantalla (para personas ciegas) dice "navegación" o "contenido principal", y la persona salta directo.
2. **Google** entiende mejor tu página.
3. **Tú** (o quien lea tu código) entiendes más rápido qué es cada cosa.

> 🌎 **En la vida real:** los carteles del supermercado: "Lácteos", "Panadería", "Cajas". Podrías poner todo en estantes sin cartel, pero te perderías.

> 🌎 **Otro ejemplo:** Como las señales de un hospital: "Urgencias", "Radiología", "Salida". Sin ellas, todos los pasillos parecen iguales.

> 💡 **Idea:** este mapa usa `header` (la barra de arriba), `nav` (las migas), `main` (el mapa) y `footer` (el pie). Abre `index.html` de la carpeta `Aprender` y búscalas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las cajas con significado
lenguaje: html
pide: Arma la página de estudios con HTML semántico: un `header` con un `nav` (dos enlaces), un `main` con dos `article` (cada uno con su `h2`), y un `footer`. Nada de `div`.
--- código
<!-- tu página aquí -->
--- pruebas
prueba('header con nav', () => ok($('header nav'), 'falta un nav dentro del header'));
prueba('el nav tiene dos enlaces', () => igual(document.querySelectorAll('nav a').length, 2));
prueba('un solo main', () => igual(document.querySelectorAll('main').length, 1));
prueba('dos article con h2 en main', () => igual(document.querySelectorAll('main article h2').length, 2));
prueba('hay footer', () => ok($('footer'), 'falta el footer'));
prueba('sin div', () => igual(document.querySelectorAll('div').length, 0));
--- solución
<header>
  <nav>
    <a href="index.html">Inicio</a>
    <a href="estudios.html">Estudios</a>
  </nav>
</header>
<main>
  <article><h2>¿Lenguas extrañas?</h2><p>…</p></article>
  <article><h2>El bautismo</h2><p>…</p></article>
</main>
<footer>Hecho con HTML</footer>
```

```practica
escribe :: Con tus palabras: ¿qué es el HTML semántico y por qué importa? :: Usar la etiqueta que dice qué es cada cosa (header, nav, main, article, footer) en vez de div para todo; ayuda a los lectores de pantalla, a Google y a entender el código.
elige :: Una tarjeta de un estudio bíblico, ¿qué etiqueta es mejor? :: `div` :: `article` :: `span`
elige :: ¿Dónde van los enlaces para moverse por el sitio? :: `footer` :: `nav` :: `aside`
elige :: ¿Cuántos `main` puede tener una página? :: Muchos :: Uno :: Ninguno
vf :: `div` es una caja sin significado, para cuando ninguna otra sirve
vf :: El HTML semántico cambia cómo se ve la página
```

> 🔁 **Repaso:** `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`; `div` y `span` cuando ninguna sirve. Semántico = con significado: accesibilidad, Google y claridad.

## 6. Formularios: cuando el usuario escribe

> 🎙️ **El profesor:** la app Copiloto está llena de formularios: registrar un ingreso, cargar combustible, editar el vehículo. En la web se arman así.

```html
<form>
  <label for="litros">Litros cargados</label>
  <input id="litros" type="number" min="0" step="0.1" required>

  <label for="app">Aplicación</label>
  <select id="app">
    <option>Uber</option>
    <option>99</option>
  </select>

  <label>
    <input type="checkbox"> Tanque lleno
  </label>

  <textarea placeholder="Notas del día"></textarea>
  <button type="submit">Guardar</button>
</form>
```

| Elemento | Para qué |
|---|---|
| `form` | El formulario entero |
| `label` | El **rótulo**. Su `for` apunta al `id` de la casilla: al tocar el rótulo, se activa la casilla |
| `input type="text"` | Texto corto |
| `input type="number"` | Números (en el celular abre el teclado numérico) |
| `input type="checkbox"` | Marcar sí o no |
| `select` + `option` | Elegir de una lista |
| `textarea` | Texto largo |
| `button` | El botón |

Atributos útiles: `required` (obligatorio), `placeholder` (texto de ejemplo gris), `min` y `max` (límites), `disabled` (apagado).

> 🌎 **En la vida real:** la hoja de inscripción del gimnasio: casillas para nombre y edad, una opción para marcar el plan, y el botón "Enviar". Cada casilla tiene su rótulo.

> 🌎 **Otro ejemplo:** Como el formulario de un pedido de pizza por la web: casillas para la dirección, un menú para elegir el tamaño, una casilla para "sin cebolla" y el botón "Pedir".

> 📌 **Nota:** el `type` del `input` importa mucho en el celular: `type="number"` abre el teclado de números; `type="email"`, uno con `@`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El formulario de un gasto
lenguaje: html
pide: Arma un `form` con: un `select` con `id="app"` y tres `option` (Uber, 99, InDrive) con su `label`; un `input` de tipo `number` con `id="valor"`, obligatorio, con `label`; un `input` de tipo `email` con `id="correo"`; y un `button` **Guardar**.
--- código
<form>
  <!-- tu formulario aquí -->
</form>
--- pruebas
prueba('select con 3 opciones', () => igual(document.querySelectorAll('select#app option').length, 3));
prueba('label del select', () => ok($('label[for="app"]'), 'falta <label for="app">'));
prueba('valor es number y obligatorio', () => ok($('#valor')?.type === 'number' && $('#valor').required, 'valor tiene que ser number y required'));
prueba('label del valor', () => ok($('label[for="valor"]'), 'falta <label for="valor">'));
prueba('correo es email', () => igual($('#correo')?.type, 'email'));
prueba('el botón', () => igual($('form button')?.textContent.trim(), 'Guardar'));
--- solución
<form>
  <label for="app">Aplicación</label>
  <select id="app">
    <option>Uber</option>
    <option>99</option>
    <option>InDrive</option>
  </select>
  <label for="valor">Valor</label>
  <input id="valor" type="number" required>
  <label for="correo">Correo</label>
  <input id="correo" type="email">
  <button>Guardar</button>
</form>
```

```practica
elige :: ¿Qué pasa si tocas un `label` con `for="litros"`? :: Se borra la casilla :: Se activa la casilla con `id="litros"` :: Se envía el formulario
elige :: ¿Qué `type` usarías para pedir un correo? :: `text` :: `email` :: `number`
elige :: Para elegir una aplicación de una lista, ¿qué usas? :: `textarea` :: `select` con `option` :: `checkbox`
vf :: `required` hace que la casilla sea obligatoria
vf :: `placeholder` es el valor que se guarda
```

> 🔁 **Repaso:** `form`, `label` (con `for` → `id`), `input` (text, number, email, checkbox), `select`/`option`, `textarea`, `button`; atributos `required`, `placeholder`, `min`, `max`.

## 7. Cómo el navegador convierte el HTML en una página (el DOM)

> 🎙️ **El profesor:** ahora una idea que conecta todo con JavaScript. Cuando el navegador lee tu HTML, no lo guarda como texto: arma un **árbol**.

```text
html
├── head
│   └── title
└── body
    ├── header
    │   └── h1
    └── main
        ├── article
        └── article
```

Ese árbol se llama **DOM** (*Document Object Model*: "el documento como objetos"). Cada caja sabe quién es su **padre** y quiénes son sus **hijos**.

¿Por qué importa?
1. **CSS** usa el árbol para decidir a quién pintar ("todos los `h1` dentro de `header`").
2. **JavaScript** **cambia el árbol** para cambiar la página. Cuando tu página de estudios abre un estudio, JavaScript **agrega cajas nuevas** al árbol, y el navegador las dibuja. Lo ves en el Tema 17.

> 🌎 **En la vida real:** un árbol genealógico. Arriba el abuelo (`html`); sus hijos, `head` y `body`; los hijos de `body`, `header`, `main`, `footer`…

> 🌎 **Otro ejemplo:** Como el organigrama de una empresa: el gerente arriba, los jefes de cada área y, debajo, sus empleados. Cada uno sabe a quién responde.

> 💡 **Idea:** en el navegador, clic derecho sobre cualquier cosa → **Inspeccionar**. Ves el árbol real de la página. Prueba con esta misma página.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer el árbol del DOM
lenguaje: html
pide: El HTML ya está. Escribe un `<script>` que recorra el DOM y escriba en el `p` con `id="resultado"` el nombre (en minúsculas) del **padre** del `h1`, y cuántos hijos tiene `main` (por ejemplo `header · 2`). Usa `parentElement` y `children`.
--- código
<header><h1>Mis estudios</h1></header>
<main>
  <article>Uno</article>
  <article>Dos</article>
</main>
<p id="resultado"></p>

<script>
  // tu código aquí
</script>
--- pruebas
prueba('padre del h1 y cantidad de hijos de main', () => igual($('#resultado').textContent.trim(), 'header · 2'));
--- solución
<header><h1>Mis estudios</h1></header>
<main>
  <article>Uno</article>
  <article>Dos</article>
</main>
<p id="resultado"></p>

<script>
  const padre = document.querySelector('h1').parentElement.tagName.toLowerCase();
  const hijos = document.querySelector('main').children.length;
  document.querySelector('#resultado').textContent = `${padre} · ${hijos}`;
</script>
```

```practica
escribe :: ¿Qué es el DOM? :: El árbol de cajas que arma el navegador al leer el HTML; CSS lo usa para pintar y JavaScript lo cambia para cambiar la página.
elige :: En el árbol de arriba, ¿quién es el padre de `h1`? :: `body` :: `header` :: `main`
elige :: ¿Qué hace JavaScript para cambiar lo que se ve? :: Reescribe el archivo HTML :: Cambia el DOM (agrega, quita o cambia cajas) :: Recarga la página
vf :: Con "Inspeccionar" del navegador puedes ver el DOM real de una página
```

> 🔁 **Repaso:** el navegador convierte el HTML en un árbol, el DOM. CSS lo pinta; JavaScript lo cambia.

## 8. Errores comunes y cómo encontrarlos

> 🎙️ **El profesor:** dato curioso y peligroso: **HTML casi nunca da error**. El navegador adivina lo que quisiste decir. Por eso, cuando algo está mal, no aparece un mensaje rojo como los que vas a aprender a leer en el Tema 07: la página **se ve rara** y ya.

| Error | Qué pasa | Cómo se arregla |
|---|---|---|
| Olvidar cerrar `</div>` | Todo lo que sigue queda dentro de esa caja; el diseño se rompe más abajo | Indenta bien (cada caja dos espacios más adentro) para ver dónde abre y dónde cierra |
| Cerrar en otro orden: `<strong><em>hola</strong></em>` | El navegador adivina, a veces mal | La última que abres es la primera que cierras |
| Ruta mal escrita en `src` o `href` | Imagen rota, o enlace que da "404" | Revisa mayúsculas: en GitHub Pages `Logo.png` y `logo.png` son archivos distintos |
| Sin `meta charset` | Tildes y ñ raras | `<meta charset="utf-8">` |
| Sin `alt` | Nadie lo nota… salvo quien no puede ver | Siempre `alt` |

> 🌎 **En la vida real:** abrir un paréntesis y olvidar cerrarlo en una carta: se entiende, pero confunde. El navegador hace lo mismo: entiende "más o menos".

> 🌎 **Otro ejemplo:** Como escribir una dirección con el número mal: el cartero no te avisa del error; simplemente la carta no llega.

> 💡 **Idea:** el validador oficial, **validator.w3.org**, revisa tu HTML y te dice cada error con su línea. Es un revisor automático para HTML (en el Tema 04 vas a conocer el CI, que revisa tu código solo en cada subida).

> ✋ **Para y piensa:** tu imagen se ve en tu Mac pero no en GitHub Pages. El archivo se llama `Foto.PNG` y en el HTML escribiste `foto.png`. ¿Qué pasa?

<details>
<summary>Ver la respuesta</summary>

El disco de la Mac **no distingue** mayúsculas, así que la encuentra. GitHub Pages **sí** distingue: busca `foto.png`, no existe, y la imagen no aparece. Hay que escribir exactamente `Foto.PNG` (o renombrar el archivo).

</details>

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`for...of`**: repite un bloque **una vez por cada elemento** de una lista, como revisar las cartas de un mazo una por una. `for (const carta of mazo) { … }`.
> - **`.push()`**: agrega un elemento al **final** de una lista. `pila.push('p')` pone `'p'` arriba de la pila.
> - **`.pop()`**: saca el **último** elemento de la lista y te lo da, como sacar el plato de arriba de una pila de platos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un revisor de etiquetas mal cerradas
lenguaje: js
pide: HTML no muestra error rojo: si cierras mal, el navegador "adivina". Haz tu propio revisor: `bienCerrado(html)` devuelve `true` si cada etiqueta que abre se cierra **en el orden correcto**. Ignora las que no se cierran (`img`, `br`, `input`, `meta`).
--- código
const SOLAS = ['img', 'br', 'input', 'meta'];

function bienCerrado(html) {
  // tu código aquí
}
--- pruebas
prueba('bien', () => igual(bienCerrado('<strong><em>hola</em></strong>'), true));
prueba('cruzado', () => igual(bienCerrado('<strong><em>hola</strong></em>'), false));
prueba('falta cerrar', () => igual(bienCerrado('<p>hola'), false));
prueba('una imagen no se cierra', () => igual(bienCerrado('<p><img src="a.png">texto</p>'), true));
prueba('con atributos', () => igual(bienCerrado('<a href="x.html" class="b">ir</a>'), true));
--- solución
const SOLAS = ['img', 'br', 'input', 'meta'];

function bienCerrado(html) {
  const pila = [];
  for (const [, cierre, nombre] of html.matchAll(/<(\/?)([a-zA-Z0-9]+)[^>]*>/g)) {
    const n = nombre.toLowerCase();
    if (SOLAS.includes(n)) continue;
    if (!cierre) pila.push(n);
    else if (pila.pop() !== n) return false;
  }
  return pila.length === 0;
}
```

```practica
vf :: HTML muestra un mensaje de error rojo cuando te equivocas
elige :: ¿Cuál está bien cerrado? :: `<strong><em>hola</strong></em>` :: `<strong><em>hola</em></strong>` :: Las dos
vf :: En GitHub Pages, `Logo.png` y `logo.png` son archivos distintos
elige :: ¿Qué herramienta revisa tu HTML y te dice los errores? :: Git :: validator.w3.org :: Jest
```

> 🔁 **Repaso:** HTML no avisa: se ve raro. Cierra en orden, cuida mayúsculas en las rutas, pon `charset` y `alt`, y usa el validador.

## Ejercicios

> 🎙️ **El profesor:** ahora tú solo, en `practica/index.html`. Escribe cada línea, sin copiar y pegar.

> 🌎 **En la vida real:** Es como armar tu primer mueble solo: siguiendo el instructivo, pieza por pieza, sin mirar cómo lo hizo otro.

**A. Tu tarjeta de presentación**
1. Arma el esqueleto completo de la parte 3.
2. Pon un `h1` con tu nombre y un `p` que diga qué haces.
3. Agrega una lista con 3 cosas que hiciste o te gustaría hacer (por ejemplo: una app, una web, un sitio de estudios).
4. Cada cosa de la lista debe ser un enlace a su página.

**B. Semántica**
5. Envuelve todo en `header`, `main` y `footer`. Pon en el `footer` el año.
6. Convierte cada proyecto en un `article` con un `h2` y un `p`.

**C. Formulario**
7. Haz un formulario de "registro de carga de combustible": litros (número, obligatorio), precio por litro (número con decimales), aplicación (lista con Uber, 99 e inDrive) y un botón "Guardar". Cada casilla con su `label`.

**D. Leer código real**
8. Abre `index.html` de `que-dice-la-biblia`. Dime 3 etiquetas semánticas que encuentres y para qué sirve cada una ahí.

<details>
<summary>Ver una solución de A y B</summary>

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Delvin Rodríguez</title>
</head>
<body>
  <header>
    <h1>Delvin Rodríguez</h1>
    <p>Construyo apps y páginas web.</p>
  </header>
  <main>
    <article>
      <h2><a href="https://play.google.com/">Copiloto Driver</a></h2>
      <p>App para conductores de aplicación.</p>
    </article>
    <article>
      <h2><a href="https://delvinsmart.github.io/que-dice-la-biblia/">¿Qué dice la Biblia?</a></h2>
      <p>Estudios bíblicos en forma de mapa.</p>
    </article>
  </main>
  <footer>2026</footer>
</body>
</html>
```

</details>

<details>
<summary>Ver una solución de C</summary>

```html
<form>
  <label for="litros">Litros</label>
  <input id="litros" type="number" min="0" step="0.01" required>

  <label for="precio">Precio por litro</label>
  <input id="precio" type="number" min="0" step="0.01">

  <label for="app">Aplicación</label>
  <select id="app">
    <option>Uber</option>
    <option>99</option>
    <option>inDrive</option>
  </select>

  <button type="submit">Guardar</button>
</form>
```

`step="0.01"` permite decimales con dos dígitos (como 5,89 reales).

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta.

> 🌎 **En la vida real:** Explicar HTML en una entrevista es como explicar el plano de una casa: qué es cada parte, antes de hablar de la decoración.

> 🎤 **Entrevista:** "¿Qué es HTML?"

<details>
<summary>Ver una buena respuesta</summary>

"El lenguaje que describe la estructura de una página: qué es cada parte, como un título, un párrafo o un botón. No es un lenguaje de programación; el diseño lo da CSS y el comportamiento, JavaScript."

</details>

> 🎤 **Entrevista:** "¿Qué es el HTML semántico y por qué importa?"

<details>
<summary>Ver una buena respuesta</summary>

"Usar la etiqueta que dice qué es cada cosa: `header`, `nav`, `main`, `article`, `footer`, en vez de `div` para todo. Mejora la accesibilidad, porque los lectores de pantalla navegan por zonas, ayuda a Google y hace el código más fácil de leer."

</details>

> 🎤 **Entrevista:** "¿Qué es el DOM?" y "¿Diferencia entre `id` y `class`?"

<details>
<summary>Ver buenas respuestas</summary>

"El DOM es el árbol de objetos que el navegador arma al leer el HTML; CSS lo usa para aplicar estilos y JavaScript lo cambia para actualizar la página sin recargarla."

"El `id` es único en la página; la `class` la pueden compartir muchos elementos. En CSS normalmente se usan clases, para reutilizar estilos."

</details>

```practica
escribe :: Explica en dos frases qué es HTML y qué hacen CSS y JavaScript. :: HTML describe la estructura de la página (qué es cada parte). CSS le da el diseño y JavaScript el comportamiento.
```

> 🔁 **Repaso final de la clase:** sabes qué es HTML, etiquetas, elementos y atributos, el esqueleto de toda página, las etiquetas de texto, el HTML semántico, los formularios, el DOM y los errores comunes. Próxima: **Tema 16, CSS**.
