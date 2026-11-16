# Tema 15: HTML

> 🌎 **En la vida real:** antes de pintar y amueblar una casa, alguien levanta las paredes y decide dónde va cada cuarto: aquí la cocina, aquí el baño, aquí la sala. HTML es eso para una página: **la estructura**. Todavía no tiene colores ni movimiento, pero ya sabes qué es cada cosa.

Toda página web del mundo, desde Google hasta tu página **¿Qué dice la Biblia?**, empieza con un archivo HTML. En esta clase aprendes a leerlo y a escribirlo. Después vienen CSS (Tema 16) y JavaScript (Tema 17).

**Para practicar:** crea una carpeta `practica` dentro de esta clase y un archivo `practica/index.html`. Ábrelo con doble clic y el navegador lo muestra. Cada vez que cambies algo, guarda y recarga (`Cmd + R`).

## 1. Qué es HTML

> 🌎 **En la vida real:** es como las etiquetas de una mudanza. Pegas en cada caja "COCINA", "LIBROS", "FRÁGIL". La caja no cambia, pero ahora todos saben qué hay dentro y qué hacer con ella. HTML pone etiquetas al contenido: "esto es un título", "esto es un botón", "esto es una lista".

> 🌎 **Otro ejemplo:** Es como el índice de un libro con los capítulos marcados: dice qué es título, qué es párrafo y qué es lista, sin decir de qué color van.

**HTML** quiere decir *HyperText Markup Language*: "lenguaje para marcar texto". No es un lenguaje de programación (no hace cuentas ni toma decisiones). Es un lenguaje **para describir** qué es cada parte de la página.

```html
<h1>¿Qué dice la Biblia?</h1>
<p>Estudios bíblicos en forma de mapa.</p>
<button>Abrir estudio</button>
```

El navegador lee esas etiquetas y dibuja: un título grande, un párrafo y un botón.

| Pieza | Qué hace | En tus proyectos |
|---|---|---|
| **HTML** | Qué cosas hay | Las tarjetas de estudios en `index.html` |
| **CSS** | Cómo se ven | Los colores del tema en `css/styles.css` |
| **JavaScript** | Qué hacen | Cargar el estudio y dibujar el mapa en `js/` |

**Preguntas**
1. ¿HTML puede sumar dos números? ¿Por qué?
2. Si una página no tiene CSS, ¿se ve? ¿Cómo?

## 2. Etiquetas, elementos y atributos

> 🌎 **En la vida real:** piensa en un sobre de carta.
> - La **etiqueta de apertura** `<p>` es abrir el sobre; la **de cierre** `</p>` es cerrarlo. Lo que va en medio es la carta.
> - El **atributo** es lo que escribes por fuera del sobre: la dirección, "urgente", "frágil". No es la carta, pero dice algo sobre ella.

> 🌎 **Otro ejemplo:** Como una etiqueta de precio en una tienda: rodea el producto, y en el costado tiene datos extra como código, talle y color.

```html
<a href="estudio.html" class="tarjeta" id="primer-estudio">Abrir el estudio</a>
```

| Parte | Qué es | En el ejemplo |
|---|---|---|
| Etiqueta de apertura | Dónde empieza | `<a ...>` |
| Contenido | Lo que se ve | `Abrir el estudio` |
| Etiqueta de cierre | Dónde termina (lleva `/`) | `</a>` |
| Atributo | Un dato extra, `nombre="valor"` | `href="estudio.html"` |
| **Elemento** | Todo junto: apertura + contenido + cierre | toda la línea |

Algunas etiquetas **no tienen cierre** porque no tienen nada adentro. Se llaman *vacías*:

```html
<img src="logo.png" alt="Logo de Copiloto Driver">
<br>
<input type="text">
```

Tres atributos que vas a ver en todos lados:
- `id`: un nombre **único** en toda la página. Como tu número de documento: solo tú lo tienes.
- `class`: un grupo. Muchos elementos pueden tener la misma clase. Como "conductor de Uber": lo son miles.
- `href` y `src`: a dónde lleva un enlace (`href`) y de dónde sale una imagen (`src`).

**Preguntas**
3. En `<img src="foto.jpg" alt="Mi carro">`, ¿cuál es la etiqueta y cuáles son los atributos?
4. ¿Pueden dos botones tener el mismo `id`? ¿Y la misma `class`?

## 3. El esqueleto de toda página

> 🌎 **En la vida real:** es como el formulario de un documento oficial: siempre tiene la misma estructura (encabezado arriba con datos que nadie ve a simple vista, y el cuerpo con el contenido). Cambia lo que escribes, no el formato.

> 🌎 **Otro ejemplo:** Como el esqueleto de una carta formal: membrete, fecha, saludo, cuerpo, despedida y firma. Siempre en el mismo orden.

Toda página HTML tiene este esqueleto. Puedes copiarlo y empezar desde aquí:

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

| Línea | Para qué sirve |
|---|---|
| `<!doctype html>` | Le dice al navegador "esto es HTML moderno". |
| `<html lang="es">` | La caja de todo. `lang="es"` avisa que está en español (ayuda a lectores de pantalla y a Google). |
| `<head>` | **Lo que no se ve**: el título de la pestaña, el idioma de las letras, los estilos. |
| `<meta charset="utf-8">` | Para que las tildes y la ñ se vean bien. Sin esto, "Biblia en español" puede salir con símbolos raros. |
| `<meta name="viewport" ...>` | Para que en el celular la página no se vea chiquitita. |
| `<title>` | El nombre en la pestaña del navegador. |
| `<link rel="stylesheet">` | Conecta el archivo de CSS. |
| `<body>` | **Lo que sí se ve**. |
| `<script src="...">` | Conecta el JavaScript. Va al final del `body` para que primero exista lo que va a usar. |

> 💡 **Idea:** abre `index.html` de tu página `que-dice-la-biblia` y busca cada una de estas líneas. Están todas.

**Preguntas**
5. Si las tildes de tu página salen como `Ã©`, ¿qué línea falta?
6. ¿En qué parte va lo que el usuario ve: `head` o `body`?

## 4. Las etiquetas de texto

> 🌎 **En la vida real:** un periódico tiene el titular gigante, los subtítulos, los párrafos, las palabras en negrita. Nadie lee un periódico donde todo tiene el mismo tamaño. Las etiquetas de texto le dan ese orden a la página.

> 🌎 **Otro ejemplo:** Es como un menú de restaurante: "Platos principales" (título), cada plato (lista) y "¡Recomendado!" en negrita.

```html
<h1>Copiloto Driver</h1>
<h2>Mis ingresos</h2>
<h3>Esta semana</h3>
<p>Hoy hice <strong>12 viajes</strong> y gané <em>bastante bien</em>.</p>
<p>Aplicaciones:</p>
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
| `h1` a `h6` | Títulos, del más importante (`h1`) al menos importante (`h6`). Uno solo `h1` por página. |
| `p` | Un párrafo. |
| `strong` | Importante (se ve en negrita). |
| `em` | Énfasis (se ve en cursiva). |
| `ul` + `li` | Lista **sin** orden (con puntitos). |
| `ol` + `li` | Lista **con** orden (1, 2, 3). |
| `a` | Enlace a otra página. |
| `img` | Imagen. Siempre con `alt`: el texto que se lee si la imagen no carga o si la persona es ciega. |

> ⚠️ **Cuidado:** no elijas `h3` porque "se ve más chico". El número dice **qué tan importante** es el título, no su tamaño. El tamaño lo decide el CSS.

**Preguntas**
7. Para los pasos de una receta, ¿`ul` u `ol`?
8. ¿Para qué sirve el `alt` de una imagen?

## 5. Las cajas que ordenan la página (HTML semántico)

> 🌎 **En la vida real:** en un supermercado los carteles dicen "Lácteos", "Panadería", "Cajas". Podrías poner todo en estantes sin cartel, pero te perderías. Las etiquetas **semánticas** son esos carteles: dicen qué es cada zona de la página.

> 🌎 **Otro ejemplo:** Como las señales de un hospital: "Urgencias", "Radiología", "Salida". Sin ellas, todos los pasillos parecen iguales.

"Semántico" quiere decir "que tiene significado". En vez de usar cajas genéricas para todo, usas la caja que dice qué es:

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
| `header` | La cabecera (logo, título, menú). |
| `nav` | Navegación: enlaces para ir a otras partes. |
| `main` | El contenido principal. Uno por página. |
| `section` | Una sección con su propio título. |
| `article` | Algo que tiene sentido solo: una tarjeta, una noticia, un estudio. |
| `aside` | Algo al costado: un índice, una ayuda. |
| `footer` | El pie. |
| `div` | Caja **sin** significado, para agrupar cuando ninguna otra sirve. |
| `span` | Lo mismo que `div`, pero dentro de una línea de texto. |

¿Por qué importa si se ve igual?
1. **Accesibilidad:** un lector de pantalla (para personas ciegas) dice "navegación" o "contenido principal" y la persona salta directo.
2. **Google** entiende mejor tu página.
3. **Tú** (o quien lea tu código) entiendes más rápido qué es cada cosa.

> 💡 **Idea:** esta misma página de estudios usa `header` (la barra de arriba), `nav` (las migas), `main` (el mapa) y `footer` (el pie). Abre `index.html` de la carpeta `Aprender` y búscalas.

**Preguntas**
9. Una tarjeta de un estudio bíblico, ¿es mejor `div` o `article`? ¿Por qué?
10. ¿Cuántos `main` puede tener una página?

## 6. Formularios: cuando el usuario escribe

> 🌎 **En la vida real:** es la hoja de inscripción del gimnasio: casillas para nombre, edad, una opción para marcar el plan y, al final, el botón "Enviar". Cada casilla tiene su rótulo para saber qué escribir.

> 🌎 **Otro ejemplo:** Como el formulario de un pedido de pizza por la web: dirección, tamaño, "sin cebolla" y el botón "Pedir".

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
| `form` | El formulario entero. |
| `label` | El rótulo. Su `for` apunta al `id` de la casilla: al tocar el rótulo, se activa la casilla. |
| `input type="text"` | Texto corto. |
| `input type="number"` | Números (en el celular abre el teclado de números). |
| `input type="checkbox"` | Marcar sí o no. |
| `select` + `option` | Elegir de una lista. |
| `textarea` | Texto largo. |
| `button` | El botón. |

Atributos útiles: `required` (obligatorio), `placeholder` (texto de ejemplo gris), `min` y `max` (límites), `disabled` (apagado).

> 📌 **Nota:** el `type` del `input` importa mucho en el celular. `type="number"` abre el teclado numérico; `type="email"` abre uno con `@`. Es lo mismo que hace tu app cuando registras litros.

**Preguntas**
11. ¿Qué pasa si tocas un `label` que tiene `for="litros"`?
12. ¿Qué `type` usarías para que el usuario escriba su correo?

## 7. Cómo el navegador convierte el HTML en una página (el DOM)

> 🌎 **En la vida real:** es un árbol genealógico. Arriba está el abuelo (`html`); sus hijos son `head` y `body`; los hijos de `body` son `header`, `main`, `footer`… Cada uno sabe quién es su padre y quiénes son sus hijos.

> 🌎 **Otro ejemplo:** Como el organigrama de una empresa: el gerente arriba, los jefes de cada área y debajo sus empleados.

Cuando el navegador lee el HTML, arma en la memoria un **árbol** de cajas, una dentro de otra. Ese árbol se llama **DOM** (*Document Object Model*: "el documento como objetos").

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

Esto importa por dos razones:
1. **CSS** usa el árbol para decidir a quién pintar ("todos los `h1` dentro de `header`").
2. **JavaScript** cambia el árbol para cambiar la página. Cuando tu página de estudios abre un estudio, JavaScript **agrega cajas nuevas al árbol** y el navegador las dibuja. Lo ves en el Tema 17.

> 💡 **Idea:** en el navegador, clic derecho sobre cualquier cosa → **Inspeccionar**. Ves el árbol real de la página. Prueba con esta página.

**Preguntas**
13. En el árbol de arriba, ¿quién es el padre de `h1`?
14. ¿Qué usa JavaScript para cambiar lo que se ve en la página?

## 8. Errores comunes y cómo encontrarlos

> 🌎 **En la vida real:** abrir paréntesis y olvidar cerrarlo en una carta confunde, pero se entiende. El navegador hace lo mismo: **casi nunca da error**, adivina. Por eso un error en HTML no avisa: la página simplemente se ve rara.

> 🌎 **Otro ejemplo:** Como escribir una dirección con el número mal: el cartero no te avisa; la carta simplemente no llega.

| Error | Qué pasa | Cómo se arregla |
|---|---|---|
| Olvidar cerrar `</div>` | Todo lo que sigue queda dentro de esa caja; el diseño se rompe más abajo. | Indenta bien (cada caja dos espacios más adentro) para ver dónde abre y dónde cierra. |
| Cerrar en otro orden: `<strong><em>hola</strong></em>` | El navegador adivina y a veces adivina mal. | La última que abres es la primera que cierras. |
| Ruta mal escrita en `src` o `href` | Imagen rota o enlace que da "404". | Revisa mayúsculas: en GitHub Pages `Logo.png` y `logo.png` son archivos distintos. |
| Sin `meta charset` | Tildes y ñ salen raras. | Agrega `<meta charset="utf-8">`. |
| Sin `alt` | Nadie lo nota… salvo quien no puede ver. | Siempre `alt` con una descripción corta. |

> 💡 **Idea:** el validador oficial (`validator.w3.org`) revisa tu HTML y te dice cada error con su línea. Es como el CI del Tema 04, pero para HTML.

**Preguntas**
15. Tu imagen se ve en tu Mac pero no en GitHub Pages. El archivo se llama `Foto.PNG` y en el HTML escribiste `foto.png`. ¿Qué pasa?

## Ejercicios

> 🌎 **En la vida real:** leer cómo se maneja no te enseña a manejar. Estos ejercicios son la vuelta a la manzana: tú escribes, te equivocas y lo arreglas.

Hazlos en `practica/index.html`. Escribe tú cada línea, sin copiar y pegar.

**A. Tu tarjeta de presentación**
1. Arma el esqueleto completo de la Parte 3.
2. Pon un `h1` con tu nombre y un `p` que diga qué haces.
3. Agrega una lista con 3 cosas que construiste (Copiloto Driver, la web, ¿Qué dice la Biblia?).
4. Cada cosa de la lista debe ser un enlace a su página.

**B. Semántica**
5. Envuelve todo en `header`, `main` y `footer`. Pon en el `footer` el año.
6. Convierte cada proyecto en un `article` con un `h2` y un `p`.

**C. Formulario**
7. Haz un formulario de "registro de carga de combustible": litros (número, obligatorio), precio por litro (número con decimales), aplicación (lista con Uber, 99 e inDrive) y un botón "Guardar". Cada casilla con su `label`.

**D. Leer código real**
8. Abre `index.html` de `que-dice-la-biblia`. Dime 3 etiquetas semánticas que encuentres y para qué sirve cada una ahí.

## Respuestas (míralas solo después de intentarlo)

> 🌎 **En la vida real:** es como el solucionario del libro de matemáticas: sirve para corregir, no para copiar.

<details>
<summary>Ver respuestas de las preguntas</summary>

1. No. HTML solo describe qué es cada cosa; las cuentas las hace JavaScript.
2. Sí: el navegador usa estilos por defecto (letra negra, fondo blanco, títulos grandes). Se ve, pero simple.
3. La etiqueta es `img`; los atributos son `src` y `alt`.
4. El mismo `id`, no (es único). La misma `class`, sí.
5. Falta `<meta charset="utf-8">`.
6. En el `body`.
7. `ol`, porque el orden importa.
8. Describe la imagen para quien no la ve y aparece si la imagen no carga.
9. `article`: es una pieza que tiene sentido sola. `div` no dice nada.
10. Uno.
11. Se activa la casilla con `id="litros"` (aparece el cursor ahí).
12. `type="email"`.
13. `header`.
14. El DOM, el árbol de cajas.
15. En la Mac funciona porque su disco no distingue mayúsculas; GitHub Pages sí, así que la imagen no aparece. Hay que escribir exactamente `Foto.PNG` (o renombrar el archivo).

</details>

<details>
<summary>Ver una solución del ejercicio C</summary>

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

</details>

## Para la entrevista

> 🌎 **En la vida real:** Explicar HTML es como explicar el plano de una casa: qué es cada parte, antes de hablar de la decoración.

> 🎤 **Entrevista:** practica estas respuestas en voz alta, con tus palabras. Si no te salen sin leer, vuelve a la parte.

**¿Qué es HTML?**
> El lenguaje que describe la estructura de una página: qué es cada parte (un título, un párrafo, un botón). No es un lenguaje de programación; el diseño lo da CSS y el comportamiento, JavaScript.

**¿Qué es el HTML semántico y por qué importa?**
> Usar la etiqueta que dice qué es cada cosa: `header`, `nav`, `main`, `article`, `footer`, en vez de `div` para todo. Mejora la accesibilidad (los lectores de pantalla navegan por zonas), ayuda a Google y hace el código más fácil de leer.

**¿Qué es el DOM?**
> El árbol de objetos que el navegador arma al leer el HTML. CSS lo usa para aplicar estilos y JavaScript lo cambia para actualizar la página sin recargarla.

**¿Diferencia entre `id` y `class`?**
> El `id` es único en la página; la `class` la pueden compartir muchos elementos. En CSS normalmente se usan clases, para reutilizar estilos.
