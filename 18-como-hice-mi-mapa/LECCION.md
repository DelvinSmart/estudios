# Tema 18: Cómo hice mi mapa de estudios

> 🌎 **En la vida real:** es como aprender mecánica desarmando **tu propio carro**: ya lo manejas todos los días, así que cada pieza que ves tiene sentido. Esta página es tu carro: la usas para estudiar, y ahora la desarmas.

Esta clase explica **la misma página donde la estás leyendo**: el mapa de estudios. Se hizo el 16 de noviembre de 2026, solo con HTML, CSS y JavaScript (Temas 15, 16 y 17), sin *frameworks*, igual que **¿Qué dice la Biblia?**.

**Antes de empezar:** haz los Temas 15, 16 y 17. Abre cada archivo del que habla cada parte y míralo mientras lees.

## 1. La idea: una sola fuente de verdad

> 🌎 **En la vida real:** si tienes la lista de compras en un papel **y** en el celular, tarde o temprano no coinciden: agregaste leche en una y no en la otra. Lo correcto es tener **una sola lista** y mirarla desde donde quieras.

> 🌎 **Otro ejemplo:** Como el horario oficial de un colectivo: está en un solo lugar, y todas las paradas muestran ese mismo horario.

Las clases ya existían como archivos `LECCION.md`. La página **no copia** ese texto: **lo lee** directamente de esos archivos cada vez que se abre. Así:

- Si corriges una clase, la página se actualiza sola. No hay nada que cambiar dos veces.
- Las clases se pueden seguir leyendo en GitHub, en VS Code o con cualquier IA, como antes.
- La página es solo **una forma de mirar** los mismos archivos: como mapa.

A esto se le llama **una sola fuente de verdad** (*single source of truth*).

**Preguntas**
1. Si cambias un ejemplo en `06-git/LECCION.md`, ¿qué tienes que hacer para que se vea en la página?
2. ¿Qué problema evita tener una sola fuente de verdad?

## 2. El mapa de archivos

> 🌎 **En la vida real:** una caja de herramientas con compartimentos: los destornilladores en uno, las llaves en otro. Cada archivo de la página hace **un solo trabajo**.

> 🌎 **Otro ejemplo:** Como los compartimentos de un botiquín: curitas en uno, remedios en otro, termómetro en otro.

```text
Aprender/
├── index.html          la única página: la barra, el buscador y la caja donde se dibuja todo
├── .nojekyll           un archivo vacío para GitHub Pages (ver parte 9)
├── PROGRESO.md         el diario para la IA que enseña (la página no lo lee)
├── 01-leer-codigo/LECCION.md
├── …                   las clases, como siempre
└── web/
    ├── cursos.js       los datos: los cursos, las etapas y qué clases tiene cada una
    ├── lector.js       lee un .md y lo parte en partes
    ├── guardado.js     lo que se guarda en el navegador: tema, bombillos y prácticas
    ├── avance.js       cuántas partes tiene cada clase y cuántas están prendidas
    ├── practica.js     las prácticas interactivas
    ├── markdown.js     convierte el .md en página: avisos, código, prácticas y enlaces
    ├── buscar.js       el buscador
    ├── nube.js         todo lo que habla con Firebase: cuenta, progreso y certificado
    ├── sesion.js       el "usuario@estudios" de arriba y si hay sesión abierta
    ├── mapa-islas.js   el mapa de islas con su camino
    ├── pantalla.js     lo que comparten las pantallas: migas, avisos y errores
    ├── app.js          mira la dirección y decide qué pantalla mostrar
    ├── vistas/         una pantalla por archivo: mapas, parte, progreso, cuenta y certificado
    └── estilos.css     todos los colores, letras y formas
```

Es la arquitectura del Tema 10 en pequeño: **los datos** (`cursos.js`) están separados de **la lógica** (`lector.js`, `guardado.js`, `avance.js`, `nube.js`) y de **la pantalla** (`app.js`, `vistas/`, `estilos.css`). Dentro de la pantalla hay **una pantalla por archivo** en `web/vistas/`: así ninguno crece hasta volverse imposible de leer.

**Preguntas**
3. Quieres cambiar el verde de la página. ¿Qué archivo abres?
4. Quieres mover la clase 15 a otra etapa. ¿Qué archivo abres?

## 3. Tres niveles de mapa, una sola página

> 🌎 **En la vida real:** Google Maps. Ves el país; tocas una ciudad y ves sus barrios; tocas un barrio y ves sus calles. Es la misma app; lo que cambia es **cuánto te acercas**.

> 🌎 **Otro ejemplo:** Como un libro con capítulos y secciones: abres el libro, eliges un capítulo y lees una sección, sin cambiar de libro.

La página tiene cuatro pantallas, pero es **un solo archivo HTML**. Lo que cambia es lo que va después del `#` en la dirección:

| Dirección | Qué muestra |
|---|---|
| `#/` | El mapa grande: las 6 etapas |
| `#/etapa/web` | El mapa de una etapa: sus clases |
| `#/clase/15` | El mapa de una clase: sus partes (cada `##` del `.md`) |
| `#/clase/15/0/3` | Leer la parte 3 del documento 0 de la clase 15 |
| `#/clase/15/0/todo` | Leer la clase entera de corrido |
| `#/progreso` | Mi progreso: los bombillos |

Cuando cambia lo de después del `#`, el navegador **no recarga la página**: solo avisa con el evento `hashchange`. `app.js` escucha ese evento, mira la dirección y dibuja la pantalla que toca:

```js
async function dibujar() {
  const partesRuta = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (partesRuta[0] === 'etapa') await vistaEtapa(partesRuta[1]);
  else if (partesRuta[0] === 'clase' && partesRuta[3]) await vistaParte(partesRuta[1], +partesRuta[2] || 0, partesRuta[3]);
  else if (partesRuta[0] === 'clase') await vistaClase(partesRuta[1], +partesRuta[2] || 0);
  else vistaInicio();
}

window.addEventListener('hashchange', dibujar);
```

A esto se le llama **enrutador** (*router*), y a una página que funciona así, **SPA** (*Single Page Application*: aplicación de una sola página). React hace lo mismo con más piezas (Tema 13).

> 💡 **Idea:** como cada pantalla tiene su dirección, puedes **guardar en favoritos** una parte exacta o mandársela a alguien, y el botón "atrás" del navegador funciona.

**Preguntas**
5. ¿Qué dirección abre la parte 2 de la clase 06?
6. ¿Por qué la página no parpadea al pasar de una pantalla a otra?

## 4. Leer y partir el Markdown

> 🌎 **En la vida real:** un libro tiene capítulos. Si quieres hacer un índice, buscas cada "Capítulo X" y anotas dónde empieza. `lector.js` hace eso con cada `##` de la lección.

`lector.js` tiene dos trabajos:

**1. Traer el archivo** con `fetch` (Tema 17, parte 7), y guardarlo en memoria para no pedirlo dos veces:

```js
const memoria = new Map();

export function leerArchivo(ruta) {
  if (!memoria.has(ruta)) memoria.set(ruta, fetch(ruta).then((r) => r.text()));
  return memoria.get(ruta);
}
```

**2. Partirlo** por sus títulos. Recorre línea por línea:
- La línea `# ` es el título de la clase.
- Cada `## ` empieza **una parte nueva** (una parada del mapa).
- Cada `### ` es un **subpunto** de esa parte (los chips del mapa y el mini mapa al leer).
- Lo que está antes del primer `##` es la introducción.

Hay una trampa: dentro de un bloque de código puede haber un `#` que **no** es un título (un comentario de Python, por ejemplo). Por eso cuenta los ` ``` `: mientras está dentro de un bloque de código, ignora los `#`.

```js
for (const l of lineas) {
  if (/^\s*```/.test(l)) enCodigo = !enCodigo;     // entra o sale de un bloque de código
  if (!enCodigo && /^## /.test(l)) { /* empieza una parte nueva */ }
}
```

> 📌 **Nota:** es la misma idea del script que agregó los 270 ejemplos "🌎 En la vida real" a las clases: también saltaba los bloques de código para no confundirse.

**Preguntas**
7. Si una clase no tiene ningún `##`, ¿cuántas paradas tiene su mapa?
8. ¿Por qué hay que saber si estamos dentro de un bloque de código?

## 5. Dibujar con plantillas

> 🌎 **En la vida real:** un sello de goma con huecos: "Clase __ · ____". Lo estampas una vez por cada clase y llenas los huecos. `map` es estampar; la plantilla es el sello.

Cada pantalla se arma con `map` y plantillas de texto (Tema 17, partes 2 y 3):

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

- `--i:${i}` le pasa al CSS el número de la parada, y el CSS lo usa para que **cada una aparezca un poquito después** que la anterior (`animation-delay: calc(var(--i) * 60ms)`).
- `escapar(...)` convierte `<` en `&lt;` y similares, para que un texto nunca se interprete como HTML (Tema 17, parte 5).

**El Markdown se convierte en HTML** con una librería pequeña, **marked**. Después, `pintarMarkdown` lo "decora":

| Qué encuentra | Qué hace |
|---|---|
| Una cita que empieza con 🌎, 💡, ⚠️, 🎤 o 📌 | Le pone una clase (`vida-real`, `idea`, `cuidado`…) y el CSS la pinta como tarjeta de color |
| Un bloque de código | Lo colorea con **highlight.js**, le pone la barra de "editor" con los tres puntitos, el lenguaje y el botón **copiar** |
| Una tabla | La envuelve para que en el celular se deslice de lado |
| Un enlace a otra lección (`../06-git/LECCION.md`) | Lo cambia para que abra **dentro del mapa** |
| Un bloque de código con el lenguaje `practica` | **No** lo muestra como código: lo convierte en una **práctica interactiva** (`web/practica.js`) |

**Las prácticas.** Dentro de un bloque ` ```practica `, cada línea es una pregunta, con los campos separados por ` :: `:

```text
vf :: `'Uber'` es un `string` :: V :: Tiene comillas: es texto.
elige :: ¿De qué tipo es `45`? :: string :: *number :: boolean :: → Sin comillas es un número.
escribe :: ¿Qué es un `boolean`? :: Un dato que solo puede ser true o false.
```

Así **se escriben**. Pero en GitHub **no quedan así**: el script `firebase/separar-respuestas.mjs` saca la respuesta (`V`, el `*` y la explicación) y la guarda en un archivo privado que no se publica. En el `.md` queda solo `elige :: ¿De qué tipo es `45`? :: string :: number :: boolean`. Las corrige **el servidor** (lo ves completo en el Tema 21, Parte 8).

- `vf` es verdadero o falso; `elige` tiene varias opciones y la correcta lleva `*`; `escribe` te deja responder con tus palabras y después comparar con la respuesta modelo.
- **Eliges todas tus respuestas y tocas "revisar".** Para aprobar hay que acertar todas en el mismo intento. Si fallas, ves **cuáles** fallaste (no cuál era la correcta) y repites el bloque entero, en otro orden (para que no lo hagas de memoria).
- Mientras la práctica de una parte no esté aprobada, el botón del bombillo de esa parte queda **bloqueado** 🔒.

> 💡 **Idea:** gracias a esto, en tus `.md` puedes escribir `> 💡 **Idea:** ...` o `> ⚠️ **Cuidado:** ...` y en la página aparecen como tarjetas amarillas o rojas, sin tocar código.

**Preguntas**
9. ¿Qué tienes que escribir en un `.md` para que aparezca una tarjeta verde de "vida real"?
10. ¿Para qué sirve `escapar`?

## 6. Por qué hace falta un servidor

> 🌎 **En la vida real:** por seguridad, un empleado no puede entrar a cualquier cajón de la oficina: necesita que alguien de recepción le alcance lo que pide. Cuando abres un archivo con doble clic, no hay recepción, y el navegador **no deja** que la página pida otros archivos.

> 🌎 **Otro ejemplo:** Como una farmacia que no te deja entrar al depósito: pides en el mostrador y te traen el remedio.

Si abres `index.html` con doble clic (la dirección empieza con `file://`), el navegador **bloquea** `fetch` por seguridad. La página no puede leer las lecciones y muestra un error que lo explica.

La solución es abrirla con un **servidor**: un programa que entrega archivos cuando la página los pide. Para probar en tu Mac, Python ya trae uno:

```bash
git clone https://github.com/DelvinSmart/estudios.git   # solo la primera vez
cd estudios
python3 -m http.server 8123
```

Después abre **http://localhost:8123** en el navegador. Para apagarlo: `Ctrl + C` en la terminal.

| Parte del comando | Qué quiere decir |
|---|---|
| `python3 -m http.server` | "Python, corre tu servidor de archivos" |
| `8123` | El **puerto**: la puerta por donde atiende (puede ser cualquier número libre) |
| `localhost` | "Esta misma computadora" |

En internet, el servidor es **GitHub Pages** (parte 9).

**Preguntas**
11. Abres la página con doble clic y dice "No encontré…". ¿Qué pasó?
12. ¿Qué es `localhost`?

## 7. La letra de código y los colores

> 🌎 **En la vida real:** el uniforme de un equipo: todos usan los mismos colores para que se sepa que son del mismo equipo. La página usa siempre las mismas variables para verse como un todo.

> 🌎 **Otro ejemplo:** Es como la pantalla de una terminal: letras de máquina de escribir, fondo oscuro y un cursor que parpadea.

**Los colores** son variables en `:root` (Tema 16, parte 6). El tema oscuro es el de siempre, como un editor de código; el claro solo cambia los valores:

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

**Las letras** vienen de Google Fonts:
- **JetBrains Mono** para títulos, código y detalles: es *monoespaciada*, la letra "de programador".
- **IBM Plex Sans** para los párrafos largos: se lee más cómodo.

**Los detalles de "terminal":**
- Arriba, `delvin@estudios:~/fundamentos/01-leer-codigo$` muestra **dónde estás**, como la terminal muestra la carpeta actual. Lo actualiza `ponerMigas` en `pantalla.js`.
- El cursor que parpadea es una caja con `animation: parpadeo 1.1s steps(1) infinite`.
- Los comentarios grises `// clase 15` imitan comentarios de código.

**El camino en zigzag:** una línea punteada (`border-left: 2px dashed`) y cada parada con un círculo encima. En la compu, las paradas pares van a la derecha (`.parada:nth-child(even) { margin-left: 50%; }`). En el celular, todo va en una sola columna (`@media`).

**Preguntas**
13. ¿Qué tienes que cambiar para que el acento sea morado en el tema oscuro?
14. ¿Por qué el código usa una letra distinta a los párrafos?

## 8. El progreso: los bombillos de cada persona

> 🌎 **En la vida real:** en una biblioteca, el libro es de todos, pero **tu marcapáginas es tuyo**. Si otra persona lee el mismo libro, usa su propio marcapáginas: no mueve el tuyo. Cada parte que entiendes prende **un bombillo** en tu marcapáginas.

> 🌎 **Otro ejemplo:** Es como una tarjeta de puntos de una cafetería: cada café sella un casillero, y es tuya; nadie más la llena por ti.

Cada parte de cada clase es **un bombillo**. Se prende cuando, al terminar de leer la parte, tocas **"¿lo entendiste? márcalo"**. La pantalla **💡 Mi progreso** (`#/progreso`) muestra todos los bombillos, etapa por etapa. Los que se prendieron desde tu última visita **se encienden con una animación** al entrar.

**¿Dónde se guardan?** En el `localStorage` **de tu navegador** (`web/guardado.js`, Tema 17 parte 8). Eso tiene tres consecuencias:

| Pregunta | Respuesta |
|---|---|
| Si otra persona estudia en la página publicada, ¿cambia mi progreso? | **No.** Sus bombillos quedan en **su** navegador. Ella ve los suyos y tú los tuyos. |
| ¿La página sabe quién soy? | No. No hay usuarios ni contraseñas: cada navegador es "una persona". |
| Si estudio en la Mac, ¿lo veo en el iPad? | No automáticamente. En **Mi progreso** hay un **código** para copiar en la Mac y pegar en el iPad. |

**"Voy aquí"** se calcula solo: es la primera clase, en el orden del mapa, que todavía tiene bombillos apagados. Y una clase sale **✓ hecha** cuando tiene todos sus bombillos prendidos.

```js
function claseActual() {
  return ORDEN.find((n) => !conteo[n] || prendidos(n) < conteo[n]);
}
```

El id de cada bombillo usa **el nombre del archivo**, no su posición: `"15:LECCION.md:3"` es la parte 3 de la lección 15. Así, si a una clase se le agrega una pestaña nueva, los bombillos no se mueven.

> 📌 **Nota:** `PROGRESO.md` sigue existiendo, pero ya **no** lo lee la página: es el diario para la IA que te enseña (qué hiciste, qué te costó, el próximo ejercicio). Si la página lo leyera, cualquiera que la abriera vería **tu** "voy aquí" como si fuera suyo.

> ⚠️ **Cuidado:** si borras los datos del navegador, se apagan los bombillos de ese navegador. Guarda tu código de progreso de vez en cuando.

**Preguntas**
15. Una persona en otro país estudia hasta la parte 5 en tu página publicada. Tú vas por la parte 2. ¿Qué ves tú?
16. ¿Por qué tus bombillos de la Mac no aparecen solos en el iPad? ¿Cómo los pasas?

## 9. Publicar en GitHub Pages

> 🌎 **En la vida real:** es pegar tu cartel en la pared de la calle en vez de tenerlo en tu cuarto. GitHub Pages es la pared: toma los archivos de tu repositorio y los muestra en internet.

> 🌎 **Otro ejemplo:** Como subir una foto a un álbum público: cualquiera con el enlace la puede ver.

Es igual que con **¿Qué dice la Biblia?** (Tema 12, parte 9): GitHub Pages sirve los archivos tal cual, sin servidor propio. Dos detalles propios de esta página:

1. **El archivo `.nojekyll`.** Por defecto, GitHub Pages pasa los archivos por un programa llamado **Jekyll**, que convierte los `.md` en páginas HTML. Eso rompería el mapa, que necesita los `.md` **crudos**. Un archivo vacío llamado `.nojekyll` le dice "no toques nada".
2. **Repositorio público o privado.** Con la cuenta gratis de GitHub, GitHub Pages **solo publica repositorios públicos**. Tu repositorio `estudios` es privado. Hay tres caminos:
   - Hacer público el repositorio (todo lo de esta carpeta se vería en internet, incluido `PROGRESO.md` y `AGENTS.md`).
   - Crear un repositorio público aparte solo con la página y las clases.
   - Pagar GitHub Pro, que permite Pages en repositorios privados (pero la página igual queda visible para quien tenga el enlace).

> 📌 **Nota:** antes de publicar algo, revisa que no haya nada privado. El `.gitignore` de esta carpeta ya deja afuera claves, contraseñas y archivos de respaldo.

**Preguntas**
17. ¿Qué pasaría sin el archivo `.nojekyll`?
18. ¿Por qué no se puede publicar el repositorio `estudios` tal como está, con la cuenta gratis?

## 10. Cómo agregar una clase nueva

> 🌎 **En la vida real:** agregar una parada a la ruta del autobús: pintas el cartel en la parada (la carpeta y su lección) y la agregas al mapa de la ruta (el catálogo).

> 🌎 **Otro ejemplo:** Como agregar un plato nuevo al menú: escribes la receta (la clase) y lo agregas a la carta (el catálogo).

1. Crea la carpeta con su lección: `20-mi-tema/LECCION.md`. Usa `#` para el título, `##` para cada parte y `###` para los subpuntos.
2. Agrégala en `web/cursos.js`, en `CLASES`:

```js
'20': { carpeta: '20-mi-tema', titulo: 'Mi tema', meta: 'Qué voy a saber hacer', docs: LECCION },
```

3. Ponla en la etapa que le toca, en `ETAPAS` (por ejemplo, en `clases: ['19', '20']`).
4. Agrégala a `README.md` y a la lista **Mi avance** de `PROGRESO.md` (`- [ ] 20 Mi tema`).
5. Sube los cambios. Listo: aparece en el mapa.

**Preguntas**
19. Agregaste la carpeta y la lección, pero la clase no aparece en el mapa. ¿Qué te faltó?

## Ejercicios

> 🌎 **En la vida real:** después de desarmar el motor, el mecánico aprendiz lo vuelve a armar. Recién ahí sabe para qué sirve cada pieza.

**A. Abrirla tú**
1. Abre la terminal, entra a la carpeta `Aprender` y levanta el servidor de la parte 6. Abre la página en el navegador.
2. Ábrela también con doble clic sobre `index.html`. ¿Qué mensaje sale? ¿Por qué?

**B. Cambiar el diseño**
3. En `web/estilos.css`, cambia `--acento` del tema oscuro por otro color. Recarga y mira qué cambia.
4. Cambia el tiempo de `animation-delay` de las paradas a `200ms`. ¿Qué pasa?

**C. Cambiar el contenido**
5. En cualquier lección, agrega una tarjeta `> 💡 **Idea:** ...`. Recarga y búscala en la página.
6. Agrega una etapa nueva de prueba en `web/cursos.js` (con una clase que ya existe). Mira cómo aparece en el mapa. Después déjalo como estaba.

**D. Leer código real**
7. Abre `web/vistas/mapas.js` y busca la función `vistaInicio`. Explica con tus palabras cómo calcula cuántas clases están terminadas.

## Respuestas (míralas solo después de intentarlo)

> 🌎 **En la vida real:** como el manual de taller que consultas **después** de intentar el arreglo, para confirmar.

<details>
<summary>Ver respuestas de las preguntas</summary>

1. Nada más: guardar (y subirlo, para que se vea en internet). La página lee el `.md` cada vez.
2. Que dos copias digan cosas distintas.
3. `web/estilos.css` (las variables de `:root`).
4. `web/cursos.js` (el arreglo `ETAPAS`).
5. `#/clase/06/0/2`.
6. Porque no se recarga: solo cambia lo de después del `#`, y JavaScript redibuja la caja `#app`.
7. Ninguna parada: solo se ve la introducción.
8. Porque un `#` dentro del código (un comentario) no es un título; si no, se partiría la lección en el lugar equivocado.
9. Una cita que empiece con 🌎: `> 🌎 **En la vida real:** ...`.
10. Para que un texto con `<` o `>` se muestre como texto y nunca se ejecute como HTML.
11. Se abrió con `file://` y el navegador bloqueó `fetch`. Hay que usar un servidor.
12. "Esta misma computadora".
13. El valor de `--acento` en `:root`.
14. La monoespaciada alinea el código y distingue letras parecidas; la otra se lee más cómodo en párrafos largos.
15. Tus bombillos: la parte 1 prendida y el "voy aquí" en tu clase. Lo de esa persona queda en su navegador.
16. Porque `localStorage` es de cada navegador, en cada aparato. Se pasan con el código de **Mi progreso**: copiar en uno, pegar en el otro.
17. Jekyll convertiría los `.md` en HTML y el mapa no podría leer las lecciones crudas.
18. Porque con la cuenta gratis GitHub Pages solo publica repositorios públicos, y `estudios` es privado.
19. Agregarla en `web/cursos.js`: en `CLASES` y en su etapa.

</details>

## Para la entrevista

> 🌎 **En la vida real:** Contar cómo se hizo este mapa es como mostrar una herramienta hecha a la medida: qué problema resuelve y cómo funciona por dentro.

> 🎤 **Entrevista:** cuéntalo como un proyecto tuyo, en voz alta.

**¿Cómo funciona este mapa de estudios?**
> Es una página de una sola pantalla hecha con HTML, CSS y JavaScript, sin frameworks. Las clases son archivos Markdown en el repositorio; la página los trae con `fetch`, los parte por sus títulos y los dibuja como un mapa de tres niveles: etapas, clases y partes. Un enrutador mira lo que va después del `#` y dibuja la pantalla que toca.

**¿Por qué leer los Markdown y no escribir el HTML de cada clase?**
> Para tener una sola fuente de verdad. Las clases se siguen editando como texto, se leen en GitHub o con una IA, y la página siempre muestra la versión actual sin duplicar nada.

**¿Cómo está organizado el código?**
> Separé datos, lógica y pantalla: un archivo con el catálogo de clases, otro que lee y parte el Markdown, otro para lo que se guarda en el navegador, otro para el buscador y uno que dibuja las pantallas. Los estilos usan variables, y así el modo claro y oscuro es solo cambiar valores.

**¿Qué problema tuviste?**
> Que `fetch` no funciona si abres el archivo con doble clic, porque el navegador lo bloquea por seguridad; hace falta un servidor. Y que GitHub Pages, por defecto, convierte los `.md` en HTML con Jekyll, así que agregué un archivo `.nojekyll` para que los sirva crudos.
