# Tema 16: CSS

> 🌎 **En la vida real:** ya tienes la casa construida (el HTML). Ahora toca pintar las paredes, elegir los muebles, decidir cuánto espacio dejar entre el sofá y la mesa. CSS es **la decoración**: no cambia qué cuartos hay, cambia cómo se ven.

CSS quiere decir *Cascading Style Sheets*: "hojas de estilo en cascada". Con CSS decides colores, letras, tamaños, espacios, dónde va cada caja y cómo se ve en el celular. Usa la misma carpeta `practica` del Tema 15 y crea `practica/estilos.css`.

## 1. Cómo se escribe una regla

> 🌎 **En la vida real:** es una orden para el pintor: "**a todas las puertas** de la casa → **color** blanco, **manija** dorada". Primero dices **a quién**, después **qué cambiar** y **a qué valor**.

```css
h1 {
  color: #7ee787;
  font-size: 32px;
}
```

| Parte | Qué es | En el ejemplo |
|---|---|---|
| **Selector** | A quién se aplica | `h1` |
| **Propiedad** | Qué se cambia | `color`, `font-size` |
| **Valor** | A qué se cambia | `#7ee787`, `32px` |
| **Declaración** | Propiedad + valor, termina en `;` | `color: #7ee787;` |
| **Regla** | Selector + todas sus declaraciones entre `{ }` | todo el bloque |

Se conecta al HTML con una línea en el `head`:

```html
<link rel="stylesheet" href="estilos.css">
```

**Preguntas**
1. En `p { margin: 0; }`, ¿cuál es el selector, la propiedad y el valor?
2. ¿Dónde va la línea `<link>`: en el `head` o en el `body`?

## 2. Los selectores: a quién pintar

> 🌎 **En la vida real:** en una empresa puedes dar una orden a **todos los empleados**, a **un equipo** (todos los de ventas) o a **una persona** con nombre y apellido. Los selectores son lo mismo.

```css
p { }                 /* todos los párrafos (por etiqueta) */
.tarjeta { }          /* todos los que tienen class="tarjeta" (por clase) */
#portada { }          /* el único que tiene id="portada" (por id) */
.tarjeta h2 { }       /* los h2 que están DENTRO de una .tarjeta */
.boton:hover { }      /* un .boton cuando el mouse está encima */
.menu > a { }         /* los a que son hijos directos de .menu */
```

| Selector | Escribe | Se aplica a |
|---|---|---|
| Etiqueta | `p` | Todos los `<p>` |
| Clase | `.tarjeta` | Todos los `class="tarjeta"` (con punto) |
| Id | `#portada` | El `id="portada"` (con numeral) |
| Descendiente | `.tarjeta h2` | `h2` dentro de `.tarjeta`, a cualquier profundidad |
| Hijo directo | `.menu > a` | `a` justo debajo de `.menu` |
| Estado | `:hover`, `:focus` | Cuando pasa algo (mouse encima, seleccionado) |

> 💡 **Idea:** en la práctica se usan **clases** casi siempre. Las etiquetas son demasiado generales y los `id` demasiado fuertes (ver la parte 3).

**Preguntas**
3. ¿Qué selector usas para pintar todos los elementos con `class="aviso"`?
4. ¿Qué significa `nav a`?

## 3. La cascada: quién gana cuando dos reglas pelean

> 🌎 **En la vida real:** tu mamá dice "en esta casa se cena a las 8". Tu papá dice "hoy, **tú**, cenas a las 7". Gana la orden más **específica** (la que habla de ti). Si dos órdenes son igual de específicas, gana **la última que se dijo**.

```css
p { color: gray; }
.aviso { color: orange; }
p { color: black; }
```

```html
<p>¿De qué color?</p>                 <!-- negro: la última regla de p -->
<p class="aviso">¿Y yo?</p>           <!-- naranja: una clase es más específica -->
```

Las reglas para saber quién gana, en orden:

1. **Especificidad:** `#id` le gana a `.clase`, y `.clase` le gana a `etiqueta`.
2. **Orden:** si empatan, gana la que está **más abajo** en el archivo.
3. **Herencia:** algunas propiedades (como `color` y `font-family`) pasan de padres a hijos. Si pones la letra en el `body`, toda la página la hereda.

> ⚠️ **Cuidado:** existe `!important`, que gana a todo. Es como gritar en una reunión: funciona una vez, pero si todos gritan, nadie entiende. Úsalo casi nunca.

**Preguntas**
5. Un párrafo tiene `class="nota"`. Hay una regla `p { color: red }` y otra `.nota { color: blue }`. ¿De qué color se ve?
6. Si pones `font-family` en el `body`, ¿por qué los párrafos también cambian de letra?

## 4. El modelo de caja

> 🌎 **En la vida real:** un cuadro colgado en la pared tiene: la **foto** (el contenido), el **paspartú** blanco alrededor (el `padding`), el **marco** (el `border`) y el **espacio en la pared** hasta el próximo cuadro (el `margin`).

**Todo** en una página es una caja, aunque no lo parezca. Cada caja tiene cuatro capas:

```text
┌──────────── margin (espacio afuera) ────────────┐
│  ┌──────────── border (el borde) ────────────┐  │
│  │  ┌──────── padding (relleno) ─────────┐   │  │
│  │  │          contenido                 │   │  │
│  │  └────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

```css
.tarjeta {
  padding: 16px;              /* aire DENTRO de la tarjeta */
  border: 1px solid #232d3a;  /* el borde: grosor, estilo, color */
  border-radius: 14px;        /* esquinas redondeadas */
  margin-bottom: 20px;        /* aire FUERA, hasta la siguiente */
}

* { box-sizing: border-box; } /* el ancho incluye padding y borde */
```

> 💡 **Idea:** la línea `box-sizing: border-box` está en casi todas las páginas del mundo (también en esta). Sin ella, una caja de `width: 300px` con `padding: 20px` mide en verdad 340px, y el diseño se rompe sin que entiendas por qué.

**Preguntas**
7. Quieres más espacio entre el texto de un botón y su borde. ¿`padding` o `margin`?
8. Quieres separar dos tarjetas entre sí. ¿`padding` o `margin`?

## 5. Colores, letras y unidades

> 🌎 **En la vida real:** en la tienda de pintura cada color tiene un código ("blanco hueso 0412"). Así, si se acaba la lata, compras otra exactamente igual. En CSS los colores también tienen código.

**Colores:**

```css
color: #7ee787;                 /* hexadecimal: rojo, verde, azul en 00..ff */
color: rgb(126 231 135);        /* lo mismo, en números de 0 a 255 */
color: rgb(0 0 0 / 0.5);        /* negro con 50% de transparencia */
background: white;              /* por nombre (pocos colores) */
```

**Letras:**

```css
body {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;  /* si no está la primera, usa la siguiente */
  font-size: 17px;
  font-weight: 400;     /* 400 normal, 700 negrita */
  line-height: 1.7;     /* espacio entre líneas: 1.7 veces el tamaño de la letra */
}
code { font-family: 'JetBrains Mono', monospace; }   /* letra de programador */
```

**Unidades:**

| Unidad | Qué es | Cuándo |
|---|---|---|
| `px` | Píxeles fijos | Bordes, sombras, detalles chicos |
| `rem` | Relativo a la letra de la página (`1rem` = normalmente 16px) | Tamaños de letra y espacios |
| `em` | Relativo a la letra **de ese elemento** | Espacios que crecen con su texto |
| `%` | Porcentaje del padre | Anchos |
| `vw` / `vh` | Porcentaje del ancho / alto de la pantalla | Portadas a pantalla completa |

> 📌 **Nota:** la letra con "forma de código" de esta página es **JetBrains Mono**. Es *monoespaciada*: todas las letras ocupan el mismo ancho, como en una máquina de escribir. Por eso el código queda alineado en columnas.

**Preguntas**
9. ¿Qué pasa si escribes `font-family: 'Letra Que No Existe', sans-serif`?
10. ¿Por qué se usa letra monoespaciada para el código?

## 6. Variables: los tokens de color

> 🌎 **En la vida real:** en vez de decirle al pintor "verde #7ee787" en cada cuarto, le dices "pinta todo con **el verde de la casa**". Si mañana cambias de idea, cambias **qué es** "el verde de la casa" una sola vez, y toda la casa cambia.

```css
:root {
  --fondo: #0b0f14;
  --texto: #d8e0ea;
  --acento: #7ee787;
}

body   { background: var(--fondo); color: var(--texto); }
.boton { background: var(--acento); }
```

- `--nombre: valor` **crea** una variable (el nombre siempre empieza con dos guiones).
- `var(--nombre)` **la usa**.
- `:root` es la raíz de la página: lo que pones ahí lo ve todo el mundo.

Así se hace el **modo oscuro y claro** de esta página: las reglas usan solo variables, y para el modo claro se cambian los valores.

```css
:root[data-theme="light"] {
  --fondo: #f5f7fa;
  --texto: #1d232b;
  --acento: #1a7f37;
}
```

> 💡 **Idea:** tu página **¿Qué dice la Biblia?** hace lo mismo con su motor de diseño (Tema 12, parte 7, y Tema 14). Ahora sabes cómo funciona por dentro.

**Preguntas**
11. ¿Qué ventaja tiene `var(--acento)` sobre escribir `#7ee787` en 20 lugares?
12. ¿Qué cambias para tener un modo claro?

## 7. Flexbox: ordenar en fila o en columna

> 🌎 **En la vida real:** es una repisa. Pones los libros uno al lado del otro (fila) o uno encima del otro (columna), decides si van pegados a la izquierda, centrados o repartidos, y cuánto espacio dejar entre ellos.

```css
.barra {
  display: flex;                    /* los hijos se ponen en fila */
  justify-content: space-between;   /* repartidos: uno a cada punta */
  align-items: center;              /* centrados de arriba a abajo */
  gap: 12px;                        /* espacio entre cada hijo */
}

.columna {
  display: flex;
  flex-direction: column;           /* ahora uno debajo del otro */
}
```

| Propiedad | Qué hace | Valores comunes |
|---|---|---|
| `display: flex` | Activa flexbox en el **padre** | — |
| `flex-direction` | Fila o columna | `row`, `column` |
| `justify-content` | Cómo se reparten en la dirección principal | `flex-start`, `center`, `space-between` |
| `align-items` | Cómo se alinean en la otra dirección | `stretch`, `center`, `flex-start` |
| `gap` | Espacio entre hijos | `8px`, `1rem` |
| `flex-wrap` | Si no caben, pasan a la línea de abajo | `wrap` |
| `flex: 1` | (en un **hijo**) ocupa todo el espacio que sobra | — |

> 📌 **Nota:** la barra de arriba de esta página (el `delvin@estudios:~$` a la izquierda y los botones a la derecha) es exactamente el ejemplo `.barra` de arriba.

**Preguntas**
13. ¿Cómo centras un botón dentro de una caja con flexbox?
14. Tienes 10 etiquetas en fila y no caben en el celular. ¿Qué propiedad agregas?

## 8. Grid: ordenar en cuadrícula

> 🌎 **En la vida real:** es un estacionamiento pintado: filas y columnas marcadas en el piso. Cada carro va en su lugar. Flexbox es una repisa (una dirección); grid es el estacionamiento (dos direcciones a la vez).

```css
.lectura {
  display: grid;
  grid-template-columns: 270px 1fr;   /* columna fija de 270px y el resto */
  gap: 40px;
}

.galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);   /* 3 columnas iguales */
  gap: 16px;
}
```

- `fr` quiere decir "fracción del espacio que sobra". `1fr 1fr` son dos columnas iguales; `2fr 1fr`, una del doble de la otra.
- `repeat(3, 1fr)` es lo mismo que escribir `1fr 1fr 1fr`.

**¿Flexbox o grid?**

| Si quieres… | Usa |
|---|---|
| Cosas en una fila (un menú, botones, etiquetas) | Flexbox |
| Cosas en filas **y** columnas alineadas (galería, página con índice al costado) | Grid |

> 💡 **Idea:** cuando lees una parte de una clase en esta página, el índice a la izquierda y el texto a la derecha son el ejemplo `.lectura` de arriba.

**Preguntas**
15. ¿Qué hace `grid-template-columns: 1fr 1fr 1fr 1fr`?

## 9. Diseño para el celular (responsive)

> 🌎 **En la vida real:** el agua toma la forma del vaso. Una página *responsive* toma la forma de la pantalla: en la compu, dos columnas; en el celular, una debajo de la otra.

```css
/* primero, cómo se ve en el celular */
.lectura { display: grid; grid-template-columns: 1fr; }

/* desde 900px de ancho para arriba (compu), dos columnas */
@media (min-width: 900px) {
  .lectura { grid-template-columns: 270px 1fr; }
}
```

- `@media (min-width: 900px)` quiere decir: "**solo si** la pantalla mide 900px o más, aplica estas reglas".
- Se recomienda pensar **primero en el celular** (*mobile first*) y después agrandar: es más fácil agregar columnas que quitarlas.

Otras dos cosas que siempre ayudan:

```css
img { max-width: 100%; }                         /* la imagen nunca se sale de la pantalla */
@media (prefers-color-scheme: dark) { ... }      /* el sistema del usuario está en modo oscuro */
```

> 💡 **Idea:** en la compu, el mapa de esta página va en zigzag; en el celular, recto. Abre la página en tu celular y compara. Las reglas están en `web/estilos.css`, al final.

**Preguntas**
16. ¿Qué quiere decir `@media (max-width: 600px)`?
17. ¿Por qué conviene diseñar primero para el celular?

## 10. Movimiento: transiciones y animaciones

> 🌎 **En la vida real:** una puerta que se abre de golpe asusta; una que se abre suave se siente cuidada. Las transiciones son las bisagras suaves de la página.

```css
.nodo {
  transition: transform 0.18s, border-color 0.18s;   /* qué cambia suave y en cuánto tiempo */
}
.nodo:hover {
  transform: translateY(-2px);    /* sube 2 píxeles */
  border-color: var(--acento);
}

@keyframes entrar {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
.parada { animation: entrar 0.45s ease both; }
```

- **Transición:** pasa suave de un estado a otro (normal → mouse encima).
- **Animación:** una secuencia propia (`@keyframes`) que corre sola, por ejemplo al aparecer.

> ⚠️ **Cuidado:** hay personas a las que el movimiento les marea. Por eso se respeta su preferencia:
> `@media (prefers-reduced-motion: reduce) { * { animation: none; } }`

**Preguntas**
18. ¿Cuál es la diferencia entre `transition` y `animation`?

## Ejercicios

> 🌎 **En la vida real:** es la clase práctica del curso de pintura: hasta que no tienes la brocha en la mano, no sabes cuánta pintura cargar.

Usa el `practica/index.html` del Tema 15 y conéctale `practica/estilos.css`. Escribe todo tú.

**A. Colores con variables**
1. Crea en `:root` las variables `--fondo`, `--texto` y `--acento`. Úsalas en el `body` y en los enlaces.
2. Agrega un modo claro con `:root[data-theme="light"]`. Pruébalo escribiendo `data-theme="light"` en la etiqueta `<html>`.

**B. Tarjetas**
3. Haz que cada `article` de tus proyectos sea una tarjeta: `padding`, borde, esquinas redondeadas y `margin` entre ellas.
4. Al pasar el mouse, que suba 2px suave y el borde cambie al color de acento.

**C. Ordenar**
5. Con flexbox, haz que el `header` tenga tu nombre a la izquierda y un enlace a la derecha.
6. Con grid, pon las tarjetas en 3 columnas en la compu y en 1 columna en el celular (usa `@media`).

**D. Leer código real**
7. Abre `web/estilos.css` de esta página. Busca la regla `.nodo:hover` y explica con tus palabras qué hace cada línea.

## Respuestas (míralas solo después de intentarlo)

> 🌎 **En la vida real:** es como comparar tu dibujo con el modelo cuando ya lo terminaste: así ves la diferencia, no copias el trazo.

<details>
<summary>Ver respuestas de las preguntas</summary>

1. Selector `p`, propiedad `margin`, valor `0`.
2. En el `head`.
3. `.aviso`.
4. Todos los enlaces (`a`) que están dentro de un `nav`.
5. Azul: la clase es más específica que la etiqueta.
6. Porque `font-family` se hereda de padres a hijos.
7. `padding`: es el aire de adentro.
8. `margin`: es el aire de afuera.
9. El navegador no la encuentra y usa la siguiente de la lista (`sans-serif`).
10. Porque todas las letras ocupan el mismo ancho y el código queda alineado; además se distingue `l`, `1` e `I`.
11. Si cambias el color, lo cambias en un solo lugar.
12. Solo los valores de las variables, dentro de `:root[data-theme="light"]`.
13. En el padre: `display: flex; justify-content: center; align-items: center;`.
14. `flex-wrap: wrap`.
15. Hace 4 columnas del mismo ancho.
16. "Solo si la pantalla mide 600px o menos, aplica estas reglas."
17. Porque es más fácil agregar columnas al agrandar que quitarlas al achicar, y la mayoría de la gente entra desde el celular.
18. `transition` suaviza el cambio entre dos estados; `animation` corre una secuencia propia hecha con `@keyframes`.

</details>

<details>
<summary>Ver una solución del ejercicio C.6</summary>

```css
.proyectos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 900px) {
  .proyectos { grid-template-columns: repeat(3, 1fr); }
}
```

</details>

## Para la entrevista

> 🎤 **Entrevista:** responde en voz alta, sin leer.

**¿Qué es la cascada en CSS?**
> Las reglas para decidir qué estilo gana cuando dos chocan: primero la especificidad (id le gana a clase, clase a etiqueta), después el orden (la última gana), y además algunas propiedades se heredan de padres a hijos.

**Explica el modelo de caja.**
> Cada elemento es una caja con contenido, `padding` (relleno de adentro), `border` y `margin` (espacio de afuera). Con `box-sizing: border-box` el ancho incluye el relleno y el borde, y los tamaños son predecibles.

**¿Flexbox o grid?**
> Flexbox para ordenar en una dirección, como una barra o una fila de botones. Grid para filas y columnas a la vez, como una galería o una página con índice al costado.

**¿Cómo hiciste el modo oscuro?**
> Con variables CSS. Todos los colores son variables en `:root`, y un atributo `data-theme="light"` en el `html` cambia sus valores. JavaScript solo cambia ese atributo.
