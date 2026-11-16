# Clase guiada 18: Cómo hice mi mapa de estudios

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** abre al lado la carpeta `Aprender/web/` en VS Code. Esta clase explica **la misma página donde la estás leyendo**: cada cosa que lees, la puedes ver funcionando.

**Lo que necesitas saber antes:** Temas 15, 16 y 17 (HTML, CSS, JavaScript) y el 10 (arquitectura).

## 1. La idea: una sola fuente de verdad

> 🎙️ **El profesor:** Delvin, este mapa se hizo el 16 de noviembre de 2026, con HTML, CSS y JavaScript, sin frameworks, igual que tu página de estudios. Y la primera decisión fue la más importante: **no copiar las clases**.

Las clases ya existían como archivos `LECCION.md` (y ahora `CLASE-GUIADA.md`). La página **no copia** ese texto: **lo lee** directamente de esos archivos cada vez que se abre. Así:

- Si corriges una clase, **la página se actualiza sola**. No hay nada que cambiar dos veces.
- Las clases se pueden seguir leyendo en GitHub, en VS Code o con cualquier IA, como antes.
- La página es solo **una forma de mirar** los mismos archivos: como mapa.

A esto se le llama **una sola fuente de verdad** (*single source of truth*).

> 🌎 **En la vida real:** si tienes la lista de compras en un papel **y** en el celular, tarde o temprano no coinciden. Lo correcto es **una sola lista**, que miras desde donde quieras.

> 🌎 **Otro ejemplo:** Como el horario de un colectivo: está publicado en un solo lugar oficial, y todas las paradas muestran ese mismo horario. Si cambia, cambia en todas.

> 💡 **Idea:** es la misma idea de tu página de estudios (contenido en JSON, Tema 12) y de la web de Copiloto (usa la app sin copiarla, Tema 13). Ya la viste tres veces: es una de las ideas más importantes de la ingeniería.

```practica
escribe :: ¿Qué es "una sola fuente de verdad" en este mapa? :: Que el texto de las clases está solo en los archivos .md; la página los lee cada vez, así que no hay copias que puedan quedar distintas.
elige :: Si cambias un ejemplo en `06-git/LECCION.md`, ¿qué tienes que hacer para verlo en la página? :: Copiarlo al HTML :: Nada más que guardar (y subirlo para que se vea en internet) :: Rehacer la página
vf :: El mapa tiene una copia del texto de cada clase dentro de su HTML
```

> 🔁 **Repaso:** la página lee los `.md`; no hay copias. Una sola fuente de verdad.

## 2. El mapa de archivos

> 🎙️ **El profesor:** un archivo por trabajo, como en la página de estudios.

```text
Aprender/
├── index.html          la única página: la barra, el buscador y la caja donde se dibuja todo
├── .nojekyll           un archivo vacío para GitHub Pages (parte 9)
├── PROGRESO.md         el diario para la IA que enseña (la página no lo lee)
├── 01-leer-codigo/LECCION.md  y  CLASE-GUIADA.md
├── …                   las clases
└── web/
    ├── cursos.js       los datos: las etapas y qué clases tiene cada una
    ├── lector.js       lee un .md y lo parte en partes
    ├── guardado.js     lo que se guarda en el navegador: tema, bombillos y prácticas
    ├── practica.js     las prácticas interactivas
    ├── buscar.js       el buscador
    ├── app.js          decide qué pantalla mostrar y la dibuja
    └── estilos.css     todos los colores, letras y formas
```

Es la arquitectura del Tema 10 en pequeño: **los datos** (`cursos.js`) separados de **la lógica** (`lector.js`, `guardado.js`, `practica.js`) y de **la pantalla** (`app.js`, `estilos.css`).

> 🌎 **En la vida real:** una caja de herramientas con compartimentos: cada uno, una cosa.

> 🌎 **Otro ejemplo:** Como los compartimentos de un botiquín: curitas en uno, remedios en otro, termómetro en otro. Encuentras lo que buscas en segundos.

```practica
elige :: Quieres cambiar el verde de la página. ¿Qué archivo abres? :: `app.js` :: `estilos.css` :: `cursos.js`
elige :: Quieres mover la clase 15 a otra etapa. ¿Qué archivo abres? :: `estilos.css` :: `cursos.js` :: `lector.js`
elige :: ¿Qué archivo arma las preguntas de verdadero o falso? :: `buscar.js` :: `practica.js` :: `guardado.js`
vf :: `PROGRESO.md` es leído por la página para mostrar el progreso
```

> 🔁 **Repaso:** `cursos.js` (datos), `lector.js` / `guardado.js` / `practica.js` / `buscar.js` (lógica), `app.js` + `estilos.css` (pantalla).

## 3. Tres niveles de mapa, una sola página

> 🎙️ **El profesor:** la página tiene varias pantallas, pero es **un solo archivo HTML**. ¿Cómo? Lo que cambia es lo que va **después del `#`** en la dirección.

| Dirección | Qué muestra |
|---|---|
| `#/` | El mapa grande: las 6 etapas |
| `#/etapa/web` | El mapa de una etapa: sus clases |
| `#/clase/15` | El mapa de una clase: sus partes |
| `#/clase/15/0/3` | Leer la parte 3 del documento 0 (la primera pestaña) de la clase 15 |
| `#/clase/15/0/todo` | Leer la clase entera de corrido |
| `#/progreso` | Mi progreso: los bombillos |

Cuando cambia lo de después del `#`, el navegador **no recarga la página**: solo avisa con el evento **`hashchange`** (Tema 17, eventos). `app.js` escucha ese evento, mira la dirección y dibuja la pantalla que toca:

```js
async function dibujar() {
  const partesRuta = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (partesRuta[0] === 'progreso') await vistaProgreso();
  else if (partesRuta[0] === 'etapa') await vistaEtapa(partesRuta[1]);
  else if (partesRuta[0] === 'clase' && partesRuta[3]) await vistaParte(partesRuta[1], +partesRuta[2] || 0, partesRuta[3]);
  else if (partesRuta[0] === 'clase') await vistaClase(partesRuta[1], +partesRuta[2] || 0);
  else vistaInicio();
}

window.addEventListener('hashchange', dibujar);
```

Línea por línea:
- `location.hash` es lo que va después del `#`, por ejemplo `#/clase/15/0/3`.
- `.replace(/^#\/?/, '')` le quita el `#/` del principio → `clase/15/0/3`.
- `.split('/')` lo corta en pedazos → `['clase', '15', '0', '3']`.
- `.filter(Boolean)` quita los pedazos vacíos.
- Después, una cadena de `if`: según el primer pedazo, dibuja una pantalla u otra.
- `+partesRuta[2] || 0` → convierte `'0'` en el número `0` (el `+` delante convierte texto en número), y si no hay, usa 0.

A esto se le llama **enrutador** (*router*), y a una página así, **SPA** (*Single Page Application*, aplicación de una sola página). React hace lo mismo con más piezas.

> 🌎 **En la vida real:** Google Maps: ves el país; tocas una ciudad y ves sus barrios; tocas un barrio y ves sus calles. Misma app, distinto acercamiento.

> 🌎 **Otro ejemplo:** Como un libro con capítulos, secciones y páginas: abres el libro (etapas), eliges un capítulo (clase) y lees una sección (parte), sin cambiar de libro.

> 💡 **Idea:** como cada pantalla tiene su dirección, puedes **guardar en favoritos** una parte exacta, mandársela a alguien, y el botón "atrás" del navegador funciona.

```practica
elige :: ¿Qué dirección abre la parte 2 de la primera pestaña de la clase 06? :: `#/06/2` :: `#/clase/06/0/2` :: `#/clase/2/06`
elige :: ¿Por qué la página no parpadea al pasar de una pantalla a otra? :: Porque es rápida :: Porque no se recarga: solo cambia lo de después del `#` y JavaScript redibuja :: Porque usa React
elige :: ¿Qué hace `'clase/15/0/3'.split('/')`? :: Une los pedazos :: Lo corta en `['clase', '15', '0', '3']` :: Borra las barras
vf :: Una SPA es una aplicación de una sola página
escribe :: ¿Qué es un enrutador en esta página? :: La función que mira lo que va después del # en la dirección y decide qué pantalla dibujar, cada vez que cambia (evento hashchange).
```

> 🔁 **Repaso:** una sola página; lo de después del `#` decide la pantalla; `hashchange` avisa; el enrutador (`dibujar`) elige. Eso es una SPA.

## 4. Leer y partir el Markdown

> 🎙️ **El profesor:** ¿cómo convierte la página un `.md` en un mapa de partes? `lector.js` hace dos trabajos.

> 🌎 **En la vida real:** Es como cortar un rollo de tela en pedazos marcados: cada marca (`##`) es un corte, y cada pedazo es una parte de la clase.

> 🌎 **Otro ejemplo:** Es como separar una carta larga en capítulos donde dice "Capítulo", pero sin confundirte cuando esa palabra aparece dentro de una cita.

### 1. Traer el archivo (una sola vez)

> 🌎 **En la vida real:** Es como sacar un libro de la biblioteca: la primera vez vas a buscarlo; las siguientes, ya lo tienes en tu mesa.

> 🌎 **Otro ejemplo:** Es como descargar una canción para escucharla sin internet: la bajas una vez y después la escuchas cuantas veces quieras.

```js
const memoria = new Map();

export function leerArchivo(ruta) {
  if (!memoria.has(ruta)) memoria.set(ruta, fetch(ruta).then((r) => r.text()));
  return memoria.get(ruta);
}
```

Es un **caché** (Tema 11): la primera vez hace `fetch` y guarda la **promesa**; las siguientes, devuelve la guardada. Así un archivo no se descarga dos veces.

### 2. Partirlo por sus títulos

Recorre el texto **línea por línea**:
- La línea `# ` es el título de la clase.
- Cada `## ` empieza **una parte nueva** (una parada del mapa).
- Cada `### ` es un **subpunto** de esa parte (los chips del mapa y el mini mapa al leer).
- Lo que está antes del primer `##` es la introducción.

**La trampa:** dentro de un bloque de código puede haber un `#` que **no** es un título (por ejemplo, un comentario de Python). Por eso cuenta los bloques de código: mientras está **dentro** de uno, ignora los `#`.

```js
for (const l of lineas) {
  if (/^\s*```/.test(l)) enCodigo = !enCodigo;     // entra o sale de un bloque de código
  if (!enCodigo && /^## /.test(l)) { /* empieza una parte nueva */ }
}
```

`enCodigo = !enCodigo` **da vuelta** el valor: si era `false` pasa a `true` (entró), y al revés (salió).

> 🌎 **En la vida real:** hacer el índice de un libro buscando cada "Capítulo X", sin confundirte con la palabra "capítulo" dentro de una cita.

> 📌 **Nota:** es la misma idea del script que agregó los 270 ejemplos "🌎 En la vida real" a tus clases: también saltaba los bloques de código.

```practica
elige :: ¿Qué hace la página con cada línea que empieza con `## `? :: La borra :: Empieza una parte nueva (una parada del mapa) :: La pone en negrita
elige :: Si una clase no tiene ningún `##`, ¿cuántas paradas tiene su mapa? :: Una :: Ninguna: solo se ve la introducción :: Diez
elige :: ¿Qué hace `enCodigo = !enCodigo`? :: Borra el código :: Da vuelta el valor: entra o sale de un bloque de código :: Cuenta las líneas
vf :: `leerArchivo` descarga el mismo archivo cada vez que se lo pides
escribe :: ¿Por qué hay que saber si estamos dentro de un bloque de código al partir el Markdown? :: Porque un # dentro del código (como un comentario de Python) no es un título; si no, se partiría la clase en el lugar equivocado.
```

> 🔁 **Repaso:** `leerArchivo` con caché; partir por `#`, `##`, `###`; ignorar los `#` dentro de bloques de código.

## 5. Dibujar con plantillas, y las tarjetas de colores

> 🎙️ **El profesor:** cada pantalla se arma con `map` y plantillas (Tema 17).

> 🌎 **En la vida real:** Es como un sello de goma con huecos: lo estampas una vez por cada clase y llenas los huecos con su número y su nombre.

> 🌎 **Otro ejemplo:** Es como imprimir etiquetas de un mismo modelo: el diseño es uno, cambia el texto de cada una.

```js
const paradas = etapa.clases.map((num, i) => `
  <li class="parada" style="--i:${i}">
    <a class="nodo" href="#/clase/${num}">
      <span class="nodo-num">${num}</span>
      <span class="nodo-titulo">${escapar(CLASES[num].titulo)}</span>
    </a>
  </li>`).join('');

app.innerHTML = `<ol class="camino">${paradas}</ol>`;
```

- `--i:${i}` le pasa al CSS el número de la parada, y el CSS lo usa para que **cada una aparezca un poquito después** (`animation-delay: calc(var(--i) * 60ms)`). Así se hace la cascada de entrada.
- `escapar(...)` convierte `<` en `&lt;` y similares, para que un texto nunca se interprete como HTML (Tema 17, parte 5).

### El Markdown convertido en página

El Markdown se convierte en HTML con una librería pequeña, **marked**. Después, `pintarMarkdown` lo "decora":

| Qué encuentra | Qué hace |
|---|---|
| Una cita que empieza con 🌎, 💡, ⚠️, 🎤, 📌, 🎙️, ✋ o 🔁 | Le pone una clase y el CSS la pinta como **tarjeta de color** |
| Un bloque de código | Lo colorea con **highlight.js**, le pone la barra de "editor" con los tres puntitos, el lenguaje y el botón **copiar** |
| Un bloque de código con el lenguaje `practica` | **No** lo muestra como código: lo convierte en una **práctica interactiva** (parte 8) |
| Una tabla | La envuelve para que en el celular se deslice de lado |
| Un enlace a otra lección | Lo cambia para que abra **dentro del mapa** |

Por eso, en un `.md` puedes escribir `> 💡 **Idea:** ...` y en la página aparece una tarjeta amarilla, **sin tocar código**.

```practica
elige :: ¿Qué escribes en un `.md` para que aparezca una tarjeta verde de "vida real"? :: `# 🌎` :: Una cita que empiece con 🌎: `> 🌎 **En la vida real:** ...` :: Un bloque de código
elige :: ¿Para qué sirve `escapar`? :: Para traducir :: Para que un texto con `<` o `>` se muestre como texto y nunca se ejecute como HTML :: Para colorear
elige :: ¿Qué hace `--i:${i}` en cada parada? :: Pone un número visible :: Le pasa al CSS la posición, para retrasar la animación de cada una :: Cambia el color
vf :: highlight.js colorea los bloques de código
```

> 🔁 **Repaso:** `map` + plantillas + `escapar`; `--i` para la cascada; marked convierte el Markdown; las citas con emoji son tarjetas; los bloques `practica` son ejercicios.

## 6. Por qué hace falta un servidor

> 🎙️ **El profesor:** si abres `index.html` con doble clic, la página dice que no encuentra las clases. ¿Por qué?

Con doble clic, la dirección empieza con **`file://`**, y el navegador **bloquea** `fetch` por seguridad (Tema 17, parte 7). La página no puede leer las lecciones.

La solución es abrirla con un **servidor**: un programa que entrega archivos cuando la página los pide. Para probar en tu Mac, Python ya trae uno:

```bash
cd /Volumes/SSD_Desarrollo/Developer/Aprender
python3 -m http.server 8123
```

Después abre **http://localhost:8123**. Para apagarlo: **Ctrl + C**.

| Parte del comando | Qué quiere decir |
|---|---|
| `python3 -m http.server` | "Python, corre tu servidor de archivos" |
| `8123` | El **puerto**: la puerta por donde atiende |
| `localhost` | "Esta misma computadora" (Tema 09) |

En internet, el servidor es **GitHub Pages** (parte 9).

> 🌎 **En la vida real:** un empleado no puede entrar a cualquier cajón de la oficina: necesita que recepción le alcance lo que pide. Con doble clic no hay recepción.

> 🌎 **Otro ejemplo:** Como una farmacia que no te deja entrar al depósito: pides en el mostrador y el farmacéutico te trae el remedio.

```practica
elige :: Abres la página con doble clic y dice "No encontré…". ¿Qué pasó? :: Se borraron las clases :: Se abrió con `file://` y el navegador bloqueó `fetch`; hace falta un servidor :: Falta internet
elige :: ¿Qué hace `python3 -m http.server 8123`? :: Instala Python :: Enciende un servidor de archivos en el puerto 8123 :: Publica en internet
vf :: En internet, el servidor del mapa es GitHub Pages
```

> 🔁 **Repaso:** `file://` bloquea `fetch`; hace falta un servidor: `python3 -m http.server 8123` en la Mac, GitHub Pages en internet.

## 7. La letra de código y los colores

> 🎙️ **El profesor:** el aspecto de "programador" sale del Tema 16, aplicado.

> 🌎 **En la vida real:** Es como el uniforme de un equipo: los mismos colores en la camiseta, el short y las medias, para que se vea como un todo.

> 🌎 **Otro ejemplo:** Es como la pantalla de una terminal: letras de máquina de escribir, fondo oscuro y un cursor que parpadea.

**Los colores** son variables en `:root`. El tema oscuro es el de siempre, como un editor; el claro solo cambia los valores:

```css
:root {
  --fondo: #0b0f14;
  --acento: #7ee787;      /* verde terminal */
  --acento-2: #79c0ff;    /* azul */
}
:root[data-theme="light"] {
  --fondo: #f5f7fa;
  --acento: #1a7f37;
}
```

**Las letras** vienen de Google Fonts: **JetBrains Mono** (monoespaciada, para títulos y código) e **IBM Plex Sans** (para los párrafos largos).

**Un detalle que se corrigió:** JetBrains Mono tiene **ligaduras**: dibuja `===` como un solo símbolo (≡) y `!=` como ≠. Es lindo, pero confunde al aprender, porque no ves lo que tienes que escribir. Se apagaron con `font-feature-settings: "liga" 0, "calt" 0`. Y hubo que ponerle `!important`, porque el atajo `font:` de CSS reinicia esa propiedad en cada elemento.

**Los detalles de "terminal":**
- Arriba, `delvin@estudios:~/fundamentos/01-leer-codigo$` muestra **dónde estás**, como la terminal muestra la carpeta actual.
- El cursor que parpadea: `animation: parpadeo 1.1s steps(1) infinite`.
- Los comentarios grises `// clase 15` imitan comentarios de código.

**El camino en zigzag:** una línea punteada y cada parada con un círculo. En la compu, las paradas pares van a la derecha (`.parada:nth-child(even) { margin-left: 50%; }`); en el celular, todo en una columna (`@media`).

```practica
elige :: ¿Qué cambias para que el acento sea morado en el tema oscuro? :: Cada botón :: El valor de `--acento` en `:root` :: El HTML
elige :: ¿Qué es una ligadura en una letra? :: Un error :: Dibujar varios caracteres como un solo símbolo, como `===` → ≡ :: Una letra en negrita
vf :: El código usa una letra monoespaciada para que quede alineado y se distingan letras parecidas
elige :: ¿Qué selector pone a la derecha las paradas pares? :: `.parada:first-child` :: `.parada:nth-child(even)` :: `.parada:hover`
```

> 🔁 **Repaso:** variables de color con modo claro; JetBrains Mono sin ligaduras e IBM Plex Sans; detalles de terminal; zigzag con `nth-child(even)` y `@media`.

## 8. El progreso y las prácticas

> 🎙️ **El profesor:** dos cosas que se agregaron después, y que son las que más usas: los **bombillos** y las **prácticas**.

> 🌎 **En la vida real:** Es como una tarjeta de puntos de una cafetería: cada café sella un casillero, y es tuya; nadie más la llena por ti.

> 🌎 **Otro ejemplo:** Es como los sellos de un pasaporte: cada país visitado deja su marca, y el pasaporte es solo tuyo.

### Los bombillos

Cada parte de cada clase es **un bombillo**. Se prende cuando, al terminar de leer la parte, tocas **"¿lo entendiste? márcalo"**. La pantalla **💡 Mi progreso** (`#/progreso`) los muestra todos, y los que se prendieron desde tu última visita **se encienden con una animación**.

**Dónde se guardan:** en el `localStorage` **de tu navegador** (`guardado.js`). Eso tiene tres consecuencias:

| Pregunta | Respuesta |
|---|---|
| Si otra persona estudia en la página publicada, ¿cambia mi progreso? | **No.** Sus bombillos quedan en **su** navegador. |
| ¿La página sabe quién soy? | No. No hay usuarios: cada navegador es "una persona". |
| Si estudio en la Mac, ¿lo veo en el iPad? | No automáticamente. En **Mi progreso** hay un **código** para copiar en uno y pegar en el otro. |

**"Voy aquí"** se calcula solo: la primera clase, en el orden del mapa, que todavía tiene bombillos apagados.

El id de cada bombillo usa **el nombre del archivo**, no su posición: `"15:LECCION.md:3"`. Así, si a una clase se le agrega una pestaña nueva (como la Clase guiada), los bombillos no se mueven.

> 🌎 **En la vida real:** en una biblioteca el libro es de todos, pero **tu marcapáginas es tuyo**.

> 🌎 **Otro ejemplo:** Como el registro de horas de estudio en tu propio cuaderno: está en tu mochila, no en la de tu compañero.

### Las prácticas

> 🌎 **En la vida real:** Es como el examen teórico de manejo: si fallas una pregunta, no apruebas, y lo vuelves a dar con las preguntas en otro orden.

> 🌎 **Otro ejemplo:** Es como un videojuego con jefe de nivel: no pasas a la siguiente pantalla hasta ganarle sin perder.

Dentro de un bloque de código con el lenguaje **`practica`**, cada línea es una pregunta, con los campos separados por ` :: `:

```text
vf :: `'Uber'` es un `string` :: V :: Tiene comillas: es texto.
elige :: ¿De qué tipo es `45`? :: string :: *number :: boolean :: → Sin comillas es un número.
escribe :: ¿Qué es un `boolean`? :: Un dato que solo puede ser true o false.
```

- **`vf`** = verdadero o falso.
- **`elige`** = varias opciones; la correcta lleva `*`; la explicación empieza con `→`.
- **`escribe`** = respondes con tus palabras y después comparas con la respuesta modelo (y dices honestamente si dijiste lo mismo).

**La regla:** para aprobar hay que **acertar todas en el mismo intento**. Si fallas una, ves la explicación y **repites el bloque entero en otro orden** (para que no lo hagas de memoria). Mientras la práctica de una parte no esté aprobada, **el botón del bombillo queda bloqueado 🔒**.

`practica.js` lo hace con lo del Tema 17: lee las líneas con `split(' :: ')`, arma botones con plantillas, escucha clics con `addEventListener`, y al aprobar guarda en `localStorage` y avisa con un evento propio (`practica-aprobada`), que `app.js` escucha para desbloquear el botón.

```practica
elige :: Una persona en otro país estudia hasta la parte 5 en tu página publicada. Tú vas por la 2. ¿Qué ves? :: La parte 5 :: Tus bombillos: la parte 2 :: Nada
elige :: ¿Cómo pasas tus bombillos de la Mac al iPad? :: Se pasan solos :: Con el código de Mi progreso: copiar en uno, pegar en el otro :: Por Bluetooth
elige :: En un bloque `practica`, ¿cómo se marca la opción correcta de un `elige`? :: Con `→` :: Con `*` adelante :: Con `V`
vf :: Si fallas una pregunta de una práctica, igual se aprueba
escribe :: ¿Por qué el id de un bombillo usa el nombre del archivo y no su posición? :: Para que, si se agrega una pestaña nueva a una clase, los bombillos no se muevan a otras partes.
```

> 🔁 **Repaso:** bombillos en `localStorage` (cada persona los suyos, código para pasarlos); "voy aquí" calculado; prácticas en bloques `practica` con `vf`, `elige` y `escribe`; todas bien para aprobar, y el bombillo bloqueado hasta entonces.

## 9. Publicar en GitHub Pages

> 🎙️ **El profesor:** igual que la página de estudios (Tema 12), pero con dos detalles propios.

1. **El archivo `.nojekyll`.** Por defecto, GitHub Pages pasa los archivos por **Jekyll**, un programa que **convierte los `.md` en páginas HTML**. Eso rompería el mapa, que necesita los `.md` **crudos**. Un archivo vacío llamado `.nojekyll` le dice "no toques nada".
2. **Repositorio público o privado.** Con la cuenta gratis de GitHub, GitHub Pages **solo publica repositorios públicos**. Tu repositorio `estudios` es privado. Hay que decidir: hacerlo público, crear uno público aparte, o pagar GitHub Pro.

> 📌 **Nota:** antes de publicar, revisa que no haya nada privado. El `.gitignore` de esta carpeta deja afuera claves, contraseñas y archivos de respaldo, y se revisó que las clases no tengan claves ni datos de usuarios.

> 🌎 **En la vida real:** pegar tu cartel en la pared de la calle en vez de tenerlo en tu cuarto. Y `.nojekyll` es un cartelito que dice "no reescriban mi cartel".

> 🌎 **Otro ejemplo:** Como subir una foto a un álbum público: cualquiera con el enlace la puede ver.

```practica
elige :: ¿Qué pasaría sin el archivo `.nojekyll`? :: Nada :: Jekyll convertiría los `.md` en HTML y el mapa no podría leerlos crudos :: La página sería más rápida
elige :: ¿Por qué no se puede publicar `estudios` tal como está, con la cuenta gratis? :: Porque es muy grande :: Porque GitHub Pages gratis solo publica repositorios públicos, y `estudios` es privado :: Porque falta un archivo
vf :: Antes de publicar algo, hay que revisar que no tenga nada privado
```

> 🔁 **Repaso:** `.nojekyll` para servir los `.md` crudos; y Pages gratis solo con repositorios públicos.

## 10. Cómo agregar una clase nueva (y su clase guiada)

> 🎙️ **El profesor:** el mapa está hecho para crecer. Así se agrega una clase.

1. Crea la carpeta con su lección: `20-mi-tema/LECCION.md`. Usa `#` para el título, `##` para cada parte y `###` para los subpuntos.
2. Agrégala en `web/cursos.js`, en `CLASES`:

```js
'20': { carpeta: '20-mi-tema', titulo: 'Mi tema', meta: 'Qué voy a saber hacer', docs: LECCION },
```

3. Ponla en su etapa, en `ETAPAS` (por ejemplo, `clases: ['19', '20']`).
4. Si escribes su **clase guiada**, guárdala como `20-mi-tema/CLASE-GUIADA.md` y agrega `'20'` a la lista **`GUIADAS`** de `cursos.js`: la clase guiada aparece primero y la lección queda como "Resumen".
5. Agrégala a `README.md` y a `PROGRESO.md`.
6. Sube los cambios. Listo.

> 🌎 **En la vida real:** agregar una parada a la ruta del autobús: pintas el cartel en la parada (la carpeta y su lección) y la agregas al mapa de la ruta (el catálogo).

> 🌎 **Otro ejemplo:** Como agregar un nuevo plato al menú de un restaurante: escribes la receta (la clase) y lo agregas a la carta (el catálogo).

```practica
elige :: Agregaste la carpeta y la lección, pero la clase no aparece en el mapa. ¿Qué te faltó? :: Reiniciar la Mac :: Agregarla en `web/cursos.js` (en `CLASES` y en su etapa) :: Borrar el caché
elige :: ¿Qué haces para que una clase muestre su clase guiada primero? :: Nada :: Guardar `CLASE-GUIADA.md` y agregar el número a `GUIADAS` en `cursos.js` :: Renombrar la lección
```

> 🔁 **Repaso:** carpeta + `.md` → `CLASES` y `ETAPAS` en `cursos.js` → (opcional) `CLASE-GUIADA.md` + `GUIADAS` → README y PROGRESO → subir.

## Ejercicios

> 🎙️ **El profesor:** después de desarmar el motor, el aprendiz lo vuelve a armar.

> 🌎 **En la vida real:** Es como volver a armar el motor que desarmaste: así sabes para qué servía cada pieza.

1. Abre la terminal, entra a `Aprender` y levanta el servidor de la parte 6. Abre la página.
2. Ábrela también con doble clic sobre `index.html`. ¿Qué mensaje sale? ¿Por qué?
3. En `web/estilos.css`, cambia `--acento` del tema oscuro por otro color. Recarga (con **Cmd + Shift + R**, por la caché).
4. En cualquier lección, agrega una tarjeta `> 💡 **Idea:** ...` y un bloque `practica` con una pregunta `vf`. Recarga y pruébalo.
5. Abre `web/app.js`, busca `vistaInicio` y explica cómo calcula cuántas clases están terminadas.

<details>
<summary>Ver las correcciones explicadas</summary>

2. Sale un mensaje en rojo que explica que con doble clic la página no puede leer las lecciones: es `file://`, y el navegador bloquea `fetch`.
3. Si no ves el cambio, es la caché (Tema 14, parte 2): Cmd + Shift + R.
4. Por ejemplo:

````text
```practica
vf :: El mapa lee los archivos .md cada vez :: V :: Una sola fuente de verdad.
```
````

5. Recorre todas las clases y cuenta las que tienen estado `'hecha'`; una clase está hecha cuando **todos sus bombillos están prendidos** (`prendidos(n) === conteo[n]`).

</details>

## Para la entrevista

> 🎙️ **El profesor:** cuéntalo como un proyecto tuyo, en voz alta.

> 🌎 **En la vida real:** Contar cómo hiciste este mapa es como mostrar una herramienta que construiste para ti mismo: qué problema resuelve y cómo funciona por dentro.

> 🎤 **Entrevista:** "¿Cómo funciona tu mapa de estudios?"

<details>
<summary>Ver una buena respuesta</summary>

"Es una página de una sola pantalla hecha con HTML, CSS y JavaScript, sin frameworks. Las clases son archivos Markdown en el repositorio; la página los trae con `fetch`, los parte por sus títulos y los dibuja como un mapa de tres niveles. Un enrutador mira lo que va después del `#` y dibuja la pantalla que toca. Tiene prácticas interactivas que hay que aprobar enteras, y el progreso se guarda en el navegador de cada persona."

</details>

> 🎤 **Entrevista:** "¿Qué problema tuviste?"

<details>
<summary>Ver una buena respuesta</summary>

"Que `fetch` no funciona si abres el archivo con doble clic, porque el navegador lo bloquea; hace falta un servidor. Que GitHub Pages, por defecto, convierte los `.md` en HTML con Jekyll, así que agregué `.nojekyll`. Y que la letra de código dibujaba `===` como un solo símbolo, lo que confunde al aprender: apagué las ligaduras."

</details>

```practica
escribe :: Explica el mapa en 3 frases, como en una entrevista. :: Es una SPA en HTML, CSS y JavaScript que lee los archivos Markdown de las clases con fetch y los muestra como mapa de etapas, clases y partes. Un enrutador mira lo que va después del # para dibujar cada pantalla. Tiene prácticas interactivas y el progreso se guarda en el navegador de cada persona.
```

> 🔁 **Repaso final de la clase:** una sola fuente de verdad, un archivo por trabajo, el enrutador con `#`, leer y partir el Markdown, plantillas y tarjetas, el servidor, colores y letra sin ligaduras, bombillos y prácticas, publicar con `.nojekyll`, y cómo agregar clases. Próxima: **Tema 20, Publicar e instalar**.
