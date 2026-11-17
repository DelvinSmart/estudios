# Clase guiada 16: CSS

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** usa la carpeta `practica` del Tema 15. Crea `practica/estilos.css` y conéctalo en el `head` de tu `index.html` con `<link rel="stylesheet" href="estilos.css">`. Todo lo que aprendas, pruébalo ahí: guarda y recarga.

**Lo que necesitas saber antes:** el Tema 15 (HTML).

## 1. Cómo se escribe una regla

> 🎙️ **El profesor:** {{alumno}}, ya tienes la casa construida con HTML. Hoy toca **decorarla**: colores, letras, espacios, dónde va cada mueble y cómo se ve en el celular. Eso es **CSS**. Y todo CSS, por grande que sea, está hecho de una sola cosa repetida mil veces: **la regla**.

**CSS** quiere decir *Cascading Style Sheets*: "hojas de estilo en **cascada**" (lo de "cascada" lo entiendes en la parte 3).

```css
h1 {
  color: #7ee787;
  font-size: 32px;
}
```

| Parte | Qué es | En el ejemplo |
|---|---|---|
| **Selector** | **A quién** se aplica | `h1` |
| **Propiedad** | **Qué** se cambia | `color`, `font-size` |
| **Valor** | **A qué** se cambia | `#7ee787`, `32px` |
| **Declaración** | Propiedad + valor, termina en `;` | `color: #7ee787;` |
| **Regla** | Selector + todas sus declaraciones entre `{ }` | todo el bloque |

Leída: **"a todos los `h1`: color verde, tamaño de letra 32 píxeles"**.

> 🌎 **En la vida real:** una orden al pintor: "**a todas las puertas** → **color** blanco, **manija** dorada". Primero a quién, después qué cambiar y a qué valor.

> 🌎 **Otro ejemplo:** Como una orden en una fábrica de ropa: "a todas las camisas de talle M: botones blancos, cuello azul". A quién, qué cambiar y a qué valor.

**Prueba ahora:** escribe esa regla en tu `estilos.css`, guarda y recarga. Tu título se pone verde.

```practica
elige :: En `p { margin: 0; }`, ¿cuál es el selector? :: `margin` :: `p` :: `0`
elige :: En `p { margin: 0; }`, ¿cuál es la propiedad? :: `p` :: `margin` :: `0`
vf :: Cada declaración termina en punto y coma `;`
vf :: La línea `<link>` que conecta el CSS va en el `body`
escribe :: Explica con tus palabras las partes de una regla de CSS. :: El selector dice a quién se aplica; entre llaves van las declaraciones, cada una con una propiedad (qué se cambia) y un valor (a qué), terminando en punto y coma.
```

> 🔁 **Repaso:** regla = selector + `{ propiedad: valor; }`. Se conecta con `<link>` en el `head`.

## 2. Los selectores: a quién pintar

> 🎙️ **El profesor:** el selector es la puntería. Si apuntas mal, pintas lo que no querías. Hay pocas formas, y una es la que vas a usar casi siempre.

```css
p { }                 /* todos los párrafos (por etiqueta) */
.tarjeta { }          /* todos los que tienen class="tarjeta" (por clase, con punto) */
#portada { }          /* el único que tiene id="portada" (por id, con numeral) */
.tarjeta h2 { }       /* los h2 que están DENTRO de una .tarjeta */
.boton:hover { }      /* un .boton cuando el mouse está encima */
.menu > a { }         /* los a que son hijos DIRECTOS de .menu */
```

| Selector | Se escribe | Se aplica a |
|---|---|---|
| Etiqueta | `p` | Todos los `<p>` |
| **Clase** | **`.tarjeta`** (con punto) | Todos los `class="tarjeta"` |
| Id | `#portada` (con numeral) | El `id="portada"` |
| Descendiente | `.tarjeta h2` (con espacio) | `h2` dentro de `.tarjeta`, a cualquier profundidad |
| Hijo directo | `.menu > a` | `a` justo debajo de `.menu` |
| Estado | `:hover`, `:focus` | Cuando pasa algo (mouse encima, seleccionado) |

`/* … */` es un **comentario** en CSS (la computadora lo ignora).

> 🌎 **En la vida real:** en una empresa puedes dar una orden a **todos los empleados** (etiqueta), a **un equipo**, como ventas (clase), o a **una persona** con nombre y apellido (id).

> 🌎 **Otro ejemplo:** Como los avisos en un colegio: "todos los alumnos" (etiqueta), "los de 5.º grado" (clase) o "el alumno Pedro Gómez" (id).

> 💡 **Idea:** en la práctica se usan **clases casi siempre**. Las etiquetas son demasiado generales y los `id` demasiado fuertes (parte 3).

> ✋ **Para y piensa:** ¿qué pinta `nav a { color: gray; }`?

<details>
<summary>Ver la respuesta</summary>

Todos los **enlaces (`a`) que están dentro de un `nav`**. Los enlaces de otras partes de la página no cambian.

</details>

```practica
elige :: ¿Cómo se seleccionan todos los elementos con `class="aviso"`? :: `aviso` :: `.aviso` :: `#aviso`
elige :: ¿Cómo se selecciona el elemento con `id="portada"`? :: `.portada` :: `#portada` :: `portada`
elige :: ¿Qué hace `.boton:hover`? :: Esconde el botón :: Aplica el estilo cuando el mouse está encima del botón :: Pinta todos los botones siempre
vf :: `.tarjeta h2` pinta los `h2` que están dentro de `.tarjeta`
vf :: En la práctica se usan más los `id` que las clases
```

> 🔁 **Repaso:** etiqueta (`p`), clase (`.x`), id (`#x`), dentro de (`.a b`), hijo directo (`.a > b`), estado (`:hover`). Casi siempre, clases.

## 3. La cascada: quién gana cuando dos reglas pelean

> 🎙️ **El profesor:** aquí está el "cascada" del nombre. Pasa todo el tiempo: dos reglas le dicen cosas distintas al mismo elemento. ¿Cuál gana? Hay reglas claras.

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

1. **Especificidad:** gana la más **específica**. `#id` le gana a `.clase`, y `.clase` le gana a `etiqueta`.
2. **Orden:** si empatan, gana la que está **más abajo** en el archivo.
3. **Herencia:** algunas propiedades (como `color` y `font-family`) **pasan de padres a hijos**. Si pones la letra en el `body`, toda la página la hereda.

> 🌎 **En la vida real:** tu mamá dice "en esta casa se cena a las 8". Tu papá dice "hoy, **tú**, cenas a las 7". Gana la orden más **específica** (la que habla de ti). Si dos órdenes son igual de específicas, gana **la última que se dijo**.

> 🌎 **Otro ejemplo:** Como las reglas de un trabajo: la regla general de la empresa, la de tu área y la que te dio tu jefe directo para hoy. Gana la más específica; si empatan, la más reciente.

> ⚠️ **Cuidado:** existe `!important`, que gana a todo. Es como gritar en una reunión: funciona una vez, pero si todos gritan, nadie entiende. Úsalo casi nunca.

> ✋ **Para y piensa:** el primer párrafo del ejemplo, ¿por qué es negro y no gris?

<details>
<summary>Ver la respuesta</summary>

Las dos reglas de `p` tienen la **misma especificidad** (son etiquetas), así que gana **la de más abajo**: `color: black`.

</details>

```practica
elige :: Un párrafo con `class="nota"`. Hay `p { color: red }` y `.nota { color: blue }`. ¿De qué color se ve? :: Rojo :: Azul :: Negro
elige :: Dos reglas `.boton` con colores distintos. ¿Cuál gana? :: La de más arriba :: La de más abajo :: Ninguna
vf :: Si pones `font-family` en el `body`, los párrafos también la heredan
vf :: `!important` conviene usarlo siempre
escribe :: Explica la cascada en tres puntos. :: Gana la regla más específica (id > clase > etiqueta); si empatan, gana la que está más abajo; y algunas propiedades se heredan de padres a hijos.
```

> 🔁 **Repaso:** especificidad (id > clase > etiqueta), después orden (la última gana), y herencia.

## 4. El modelo de caja

> 🎙️ **El profesor:** esta es **la** idea de CSS. Cuando la entiendes, la mitad de los problemas de diseño desaparecen: **todo en una página es una caja**, aunque no lo parezca. Y cada caja tiene cuatro capas.

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

> 🌎 **En la vida real:** un cuadro colgado en la pared: la **foto** (contenido), el **paspartú** blanco alrededor (padding), el **marco** (border) y el **espacio en la pared** hasta el próximo cuadro (margin).

> 🌎 **Otro ejemplo:** Como una caja de regalo: el regalo (contenido), el papel de seda que lo rodea (padding), la caja (border) y el espacio que dejas entre esta caja y la siguiente en la mesa (margin).

### `box-sizing: border-box`, la línea que te salva

> 🌎 **En la vida real:** Es como medir una puerta con el marco incluido: si compras "una puerta de 80 cm" y el marco va aparte, no entra en el hueco. Con border-box, los 80 cm ya incluyen el marco.

> 🌎 **Otro ejemplo:** Es como decir "una maleta de 23 kg" contando la maleta: con border-box, el peso dicho es el total, sin sorpresas en el aeropuerto.

Sin ella, si dices `width: 300px` y `padding: 20px`, la caja mide en verdad **340px** (300 + 20 de cada lado). El diseño se rompe y no entiendes por qué. Con `box-sizing: border-box`, **300px son 300px**, con el relleno y el borde incluidos. Por eso está en casi todas las páginas del mundo (también en esta).

`*` es el selector "**todos los elementos**".

> ✋ **Para y piensa:** quieres más espacio entre el texto de un botón y su borde. ¿`padding` o `margin`?

<details>
<summary>Ver la respuesta</summary>

**`padding`**: es el aire de **adentro**, entre el contenido y el borde. `margin` separaría el botón de lo que está **afuera**.

</details>

**Prueba ahora:** dale a tus `article` del Tema 15 un `padding`, un `border` y un `border-radius`. Ya parecen tarjetas.

```practica
elige :: Para separar dos tarjetas entre sí, ¿qué usas? :: `padding` :: `margin` :: `border`
elige :: ¿Qué hace `border-radius`? :: Cambia el grosor del borde :: Redondea las esquinas :: Agrega sombra
vf :: En CSS, todo elemento es una caja
vf :: Sin `box-sizing: border-box`, una caja de 300px con 20px de padding mide 340px
escribe :: Nombra las cuatro capas de una caja, de adentro hacia afuera. :: Contenido, padding (relleno), border (borde) y margin (margen).
```

> 🔁 **Repaso:** contenido → padding (adentro) → border → margin (afuera). Y siempre `box-sizing: border-box`.

## 5. Colores, letras y unidades

> 🎙️ **El profesor:** tres cosas que vas a escribir todos los días.

> 🌎 **En la vida real:** Es como elegir la ropa para un evento: el color de la camisa, el tipo de letra de la invitación y la medida exacta del traje.

> 🌎 **Otro ejemplo:** Es como decorar un cuarto: elegir la pintura (color), el estilo de los carteles (letra) y medir con cinta métrica (unidades).

### Colores

```css
color: #7ee787;                 /* hexadecimal: rojo, verde, azul en 00..ff */
color: rgb(126 231 135);        /* lo mismo, en números de 0 a 255 */
color: rgb(0 0 0 / 0.5);        /* negro con 50% de transparencia */
background: white;              /* por nombre (pocos colores) */
```

`#7ee787` se lee de a pares: `7e` de rojo, `e7` de verde, `87` de azul. Cada par va de `00` (nada) a `ff` (el máximo). No tienes que calcularlo: lo copias de un selector de colores. `color` es la letra; `background`, el fondo.

> 🌎 **En la vida real:** en la tienda de pintura cada color tiene su código ("blanco hueso 0412"), para comprar otra lata exactamente igual.

> 🌎 **Otro ejemplo:** Como el código de un tinte de pelo: "7.1 rubio ceniza". Con el código, la peluquera hace siempre el mismo color.

### Letras

> 🌎 **En la vida real:** Es como elegir la tipografía de un cartel: una letra clara para leer de lejos, y una de respaldo por si la imprenta no tiene la primera.

> 🌎 **Otro ejemplo:** Es como la letra de una máquina de escribir: todas las letras ocupan el mismo espacio, por eso las columnas quedan alineadas.

```css
body {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;  /* si no está la primera, usa la siguiente */
  font-size: 17px;
  font-weight: 400;     /* 400 normal, 700 negrita */
  line-height: 1.7;     /* espacio entre líneas: 1.7 veces el tamaño de la letra */
}
code { font-family: 'JetBrains Mono', monospace; }   /* letra de programador */
```

`font-family` es una **lista de respaldo**: si la primera letra no está, usa la siguiente.

> 📌 **Nota:** la letra "de código" de esta página es **JetBrains Mono**. Es **monoespaciada**: todas las letras ocupan el mismo ancho, como en una máquina de escribir. Por eso el código queda alineado en columnas, y se distinguen `l`, `1` e `I`.

### Unidades

> 🌎 **En la vida real:** Es como medir en distintas unidades: centímetros fijos (px), "dos dedos" (relativo a tu mano, em/rem) o "la mitad de la mesa" (%).

> 🌎 **Otro ejemplo:** Es como las porciones de una receta: "2 tazas" es fijo; "la mitad de lo que tengas" depende de cuánto tengas.

| Unidad | Qué es | Cuándo |
|---|---|---|
| `px` | Píxeles fijos | Bordes, sombras, detalles chicos |
| `rem` | Relativo a la letra de la página (`1rem` ≈ 16px) | Tamaños de letra y espacios |
| `em` | Relativo a la letra **de ese elemento** | Espacios que crecen con su texto |
| `%` | Porcentaje del padre | Anchos |
| `vw` / `vh` | Porcentaje del ancho / alto de la pantalla | Portadas a pantalla completa |

```practica
elige :: ¿Qué pasa con `font-family: 'Letra Que No Existe', sans-serif`? :: Da error :: Usa la siguiente de la lista, `sans-serif` :: No muestra texto
elige :: ¿Qué propiedad cambia el color de fondo? :: `color` :: `background` :: `border`
elige :: `font-weight: 700` quiere decir… :: Letra chica :: Negrita :: Cursiva
elige :: ¿Qué unidad es "porcentaje del ancho de la pantalla"? :: `px` :: `rem` :: `vw`
vf :: Una letra monoespaciada tiene todas sus letras del mismo ancho
vf :: `rgb(0 0 0 / 0.5)` es negro con 50% de transparencia
```

> 🔁 **Repaso:** colores en hexadecimal o `rgb`; `font-family` con respaldo, `font-size`, `font-weight`, `line-height`; unidades `px`, `rem`, `em`, `%`, `vw`/`vh`.

## 6. Variables: los tokens de color

> 🎙️ **El profesor:** esta parte te va a gustar, porque es **exactamente** lo que hace el motor de diseño de tu página de estudios bíblicos.

```css
:root {
  --fondo: #0b0f14;
  --texto: #d8e0ea;
  --acento: #7ee787;
}

body   { background: var(--fondo); color: var(--texto); }
.boton { background: var(--acento); }
```

- `--nombre: valor` **crea** una variable. El nombre **siempre** empieza con dos guiones.
- `var(--nombre)` **la usa**.
- `:root` es la **raíz** de la página: lo que pones ahí lo ve todo el mundo.

¿La ventaja? Si mañana quieres otro verde, lo cambias **en un solo lugar**, y toda la página cambia. Es la misma idea de la constante `MY_COMPANY_NAME_MAX_WORDS` del Tema 01.

> 🌎 **En la vida real:** en vez de decirle al pintor "verde #7ee787" en cada cuarto, le dices "pinta todo con **el verde de la casa**". Si cambias de idea, cambias **qué es** "el verde de la casa" una vez.

> 🌎 **Otro ejemplo:** Como el nombre de un contacto en el teléfono: si la persona cambia de número, actualizas el contacto una vez y todos tus mensajes le llegan.

### Así se hace el modo oscuro y claro

> 🌎 **En la vida real:** Es como las luces de una casa con dos modos, día y noche: los mismos interruptores, pero en modo noche todo se pone más tenue.

> 🌎 **Otro ejemplo:** Es como el modo nocturno del teléfono: no cambias cada app, cambias un ajuste y todo se adapta.

Las reglas usan **solo variables**. Para el modo claro, **se cambian los valores**:

```css
:root[data-theme="light"] {
  --fondo: #f5f7fa;
  --texto: #1d232b;
  --acento: #1a7f37;
}
```

Se lee: "cuando el `<html>` tenga `data-theme="light"`, las variables valen esto otro". JavaScript solo cambia ese atributo (Tema 17); el CSS hace el resto.

> 💡 **Idea:** el botón ◐ de esta página hace exactamente eso. Y tu página **¿Qué dice la Biblia?** usa la misma idea en su motor de diseño (Temas 12 y 14).

```practica
escribe :: ¿Qué ventaja tiene usar `var(--acento)` en vez de escribir `#7ee787` en 20 lugares? :: Que el color se cambia en un solo lugar y toda la página se actualiza.
elige :: ¿Cómo se crea una variable en CSS? :: `$acento: verde;` :: `--acento: verde;` :: `var acento = verde;`
elige :: ¿Cómo se usa la variable `--fondo`? :: `--fondo` :: `var(--fondo)` :: `fondo()`
elige :: Para tener modo claro, ¿qué cambias? :: Todas las reglas :: Solo los valores de las variables, en `:root[data-theme="light"]` :: El HTML entero
vf :: Lo que se define en `:root` lo puede usar toda la página
```

> 🔁 **Repaso:** `--nombre: valor` en `:root` crea la variable; `var(--nombre)` la usa. El modo claro solo cambia valores.

## 7. Flexbox: ordenar en fila o en columna

> 🎙️ **El profesor:** ahora, **dónde va cada cosa**. La herramienta más usada se llama **flexbox**. Se activa en el **padre**, y ordena a sus **hijos**.

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

> 🌎 **En la vida real:** una repisa. Pones los libros uno al lado del otro (fila) o uno encima del otro (columna), decides si van pegados a la izquierda, centrados o repartidos, y cuánto espacio dejar.

> 🌎 **Otro ejemplo:** Como fila de personas para una foto grupal: las pones una al lado de la otra, centradas, con un pasito entre cada una.

> 📌 **Nota:** la barra de arriba de esta página (el `delvin@estudios:~$` a la izquierda y los botones a la derecha) es exactamente `.barra`.

> ✋ **Para y piensa:** ¿cómo centras un botón, a lo ancho y a lo alto, dentro de una caja?

<details>
<summary>Ver la respuesta</summary>

En la caja (el padre): `display: flex; justify-content: center; align-items: center;`

</details>

```practica
elige :: ¿Dónde se escribe `display: flex`? :: En cada hijo :: En el padre :: En el `body` siempre
elige :: Tienes 10 etiquetas en fila y no caben en el celular. ¿Qué agregas? :: `gap` :: `flex-wrap: wrap` :: `flex-direction: row`
elige :: `justify-content: space-between` hace que… :: Todos queden en el centro :: Queden repartidos, uno en cada punta :: Queden uno debajo del otro
vf :: `flex-direction: column` pone a los hijos uno debajo del otro
vf :: `gap` agrega espacio entre los hijos
```

> 🔁 **Repaso:** `display: flex` en el padre; `flex-direction`, `justify-content`, `align-items`, `gap`, `flex-wrap`; y `flex: 1` en el hijo que ocupa lo que sobra.

## 8. Grid: ordenar en cuadrícula

> 🎙️ **El profesor:** flexbox ordena **en una dirección**. Cuando necesitas **filas y columnas a la vez**, usas **grid**.

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

- **`fr`** quiere decir "**fracción del espacio que sobra**". `1fr 1fr` son dos columnas iguales; `2fr 1fr`, una del doble de la otra.
- `repeat(3, 1fr)` es lo mismo que escribir `1fr 1fr 1fr`.

| Si quieres… | Usa |
|---|---|
| Cosas en **una fila** (un menú, botones, etiquetas) | Flexbox |
| Cosas en **filas y columnas** alineadas (galería, página con índice al costado) | Grid |

> 🌎 **En la vida real:** flexbox es una repisa (una dirección); grid es un **estacionamiento pintado**, con filas y columnas marcadas en el piso.

> 🌎 **Otro ejemplo:** Como una grilla de un estacionamiento o un tablero de ajedrez: filas y columnas fijas, y cada cosa en su casillero.

> 💡 **Idea:** cuando lees una parte de una clase en esta página, el índice a la izquierda y el texto a la derecha son `.lectura`.

```practica
elige :: ¿Qué hace `grid-template-columns: 1fr 1fr 1fr 1fr`? :: Una columna :: Cuatro columnas del mismo ancho :: Cuatro filas
elige :: Para una galería de fotos en filas y columnas, ¿qué usas? :: Flexbox :: Grid :: Ninguno
elige :: `repeat(3, 1fr)` es igual a… :: `3fr` :: `1fr 1fr 1fr` :: `1fr 3`
vf :: `fr` es una fracción del espacio que sobra
```

> 🔁 **Repaso:** grid para filas y columnas; `grid-template-columns` con `px`, `fr` y `repeat()`. Una dirección: flexbox; dos: grid.

## 9. Diseño para el celular (responsive)

> 🎙️ **El profesor:** la mayoría de la gente entra desde el celular. Una página **responsive** se adapta a la pantalla.

```css
/* primero, cómo se ve en el celular */
.lectura { display: grid; grid-template-columns: 1fr; }

/* desde 900px de ancho para arriba (compu), dos columnas */
@media (min-width: 900px) {
  .lectura { grid-template-columns: 270px 1fr; }
}
```

- `@media (min-width: 900px)` = "**solo si** la pantalla mide 900px o más, aplica estas reglas".
- `@media (max-width: 600px)` = "solo si mide 600px **o menos**".
- Se recomienda pensar **primero en el celular** (*mobile first*) y después agrandar: es más fácil agregar columnas que quitarlas.

Dos cosas que siempre ayudan:

```css
img { max-width: 100%; }                         /* la imagen nunca se sale de la pantalla */
@media (prefers-color-scheme: dark) { ... }      /* el sistema del usuario está en modo oscuro */
```

> 🌎 **En la vida real:** el agua toma la forma del vaso. Una página responsive toma la forma de la pantalla.

> 🌎 **Otro ejemplo:** Como un sofá cama: en la sala grande es sofá; en el cuarto chico, se transforma para entrar.

> 💡 **Idea:** en la compu, el mapa de esta página va en zigzag; en el celular, recto. Ábrela en tu celular y compara.

```practica
elige :: ¿Qué quiere decir `@media (max-width: 600px)`? :: Que la página mide 600px :: Que esas reglas se aplican solo si la pantalla mide 600px o menos :: Que la letra mide 600px
elige :: ¿Qué es *mobile first*? :: Hacer solo la versión de celular :: Diseñar primero para el celular y después agrandar :: Publicar primero en la tienda
vf :: `img { max-width: 100%; }` evita que una imagen se salga de la pantalla
escribe :: ¿Qué es una página responsive? :: Una página que se adapta al tamaño de la pantalla, por ejemplo con una columna en el celular y dos en la compu.
```

> 🔁 **Repaso:** `@media` aplica reglas según el ancho; primero el celular; `max-width: 100%` en imágenes.

## 10. Movimiento: transiciones y animaciones

> 🎙️ **El profesor:** el último toque: que las cosas se muevan **suave**. Es lo que hace que una página se sienta "fina".

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

- **Transición:** pasa suave **de un estado a otro** (normal → mouse encima).
- **Animación:** una **secuencia propia** (`@keyframes`, de `from` a `to`) que corre sola, por ejemplo al aparecer.

> 🌎 **En la vida real:** una puerta que se abre de golpe asusta; una que se abre suave se siente cuidada. Las transiciones son las bisagras suaves.

> 🌎 **Otro ejemplo:** Como las puertas automáticas del supermercado: se abren suaves, no de golpe, y eso se siente cuidado.

> ⚠️ **Cuidado:** a algunas personas el movimiento les marea. Por eso se respeta su preferencia: `@media (prefers-reduced-motion: reduce) { * { animation: none; } }`.

```practica
elige :: ¿Qué diferencia hay entre `transition` y `animation`? :: Ninguna :: `transition` suaviza el cambio entre dos estados; `animation` corre una secuencia propia con `@keyframes` :: `animation` es solo para imágenes
vf :: `@keyframes` define los pasos de una animación
vf :: Hay que respetar a quien pide menos movimiento
```

> 🔁 **Repaso:** `transition` para cambios suaves entre estados; `animation` + `@keyframes` para secuencias; y respetar `prefers-reduced-motion`.

## Ejercicios

> 🎙️ **El profesor:** en tu carpeta `practica`, con tu `estilos.css`. Escribe todo tú.

> 🌎 **En la vida real:** Es como pintar tu propio cuarto después de la clase de decoración: eliges los colores, ordenas los muebles y lo pruebas.

**A. Colores con variables**
1. Crea en `:root` las variables `--fondo`, `--texto` y `--acento`. Úsalas en el `body` y en los enlaces.
2. Agrega un modo claro con `:root[data-theme="light"]`. Pruébalo escribiendo `data-theme="light"` en la etiqueta `<html>`.

**B. Tarjetas**
3. Haz que cada `article` sea una tarjeta: `padding`, borde, esquinas redondeadas y `margin` entre ellas.
4. Al pasar el mouse, que suba 2px suave y el borde cambie al color de acento.

**C. Ordenar**
5. Con flexbox, haz que el `header` tenga tu nombre a la izquierda y un enlace a la derecha.
6. Con grid, pon las tarjetas en 3 columnas en la compu y en 1 columna en el celular (usa `@media`).

**D. Leer código real**
7. Abre `web/estilos.css` de esta página. Busca la regla `.nodo:hover` y explica con tus palabras qué hace cada línea.

<details>
<summary>Ver una solución completa</summary>

```css
* { box-sizing: border-box; }

:root { --fondo: #0b0f14; --texto: #d8e0ea; --acento: #7ee787; }
:root[data-theme="light"] { --fondo: #f5f7fa; --texto: #1d232b; --acento: #1a7f37; }

body { background: var(--fondo); color: var(--texto); font-family: system-ui, sans-serif; }
a { color: var(--acento); }

header { display: flex; justify-content: space-between; align-items: center; }

main { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 900px) { main { grid-template-columns: repeat(3, 1fr); } }

article {
  padding: 16px;
  border: 1px solid #333;
  border-radius: 14px;
  transition: transform 0.2s, border-color 0.2s;
}
article:hover { transform: translateY(-2px); border-color: var(--acento); }
```

En el D: `.nodo:hover` sube la tarjeta 2px, cambia el borde al color de acento y aclara un poco el fondo; la `transition` de `.nodo` hace que esos cambios sean suaves.

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta.

> 🌎 **En la vida real:** Explicar CSS en una entrevista es como explicar la decoración de un local: las reglas de colores, el espacio de cada mueble y cómo se ve en distintos tamaños.

> 🎤 **Entrevista:** "¿Qué es la cascada en CSS?"

<details>
<summary>Ver una buena respuesta</summary>

"Las reglas para decidir qué estilo gana cuando dos chocan: primero la especificidad (id le gana a clase, clase a etiqueta), después el orden (la última gana), y además algunas propiedades se heredan de padres a hijos."

</details>

> 🎤 **Entrevista:** "Explica el modelo de caja."

<details>
<summary>Ver una buena respuesta</summary>

"Cada elemento es una caja con contenido, `padding` (relleno de adentro), `border` y `margin` (espacio de afuera). Con `box-sizing: border-box` el ancho incluye el relleno y el borde, y los tamaños son predecibles."

</details>

> 🎤 **Entrevista:** "¿Flexbox o grid?" y "¿Cómo hiciste el modo oscuro?"

<details>
<summary>Ver buenas respuestas</summary>

"Flexbox para ordenar en una dirección, como una barra o una fila de botones. Grid para filas y columnas a la vez, como una galería o una página con índice al costado."

"Con variables CSS. Todos los colores son variables en `:root`, y un atributo `data-theme="light"` en el `html` cambia sus valores. JavaScript solo cambia ese atributo."

</details>

```practica
escribe :: Explica en voz alta (y escribe) cómo funciona el modo oscuro con variables. :: Los colores son variables en :root; las reglas solo usan var(); un atributo data-theme="light" en el html cambia los valores de las variables, y JavaScript solo cambia ese atributo.
```

> 🔁 **Repaso final de la clase:** reglas y selectores, la cascada, el modelo de caja, colores-letras-unidades, variables, flexbox, grid, responsive y movimiento. Próxima: **Tema 17, JavaScript en la página**.
