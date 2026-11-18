# Clase guiada 17: JavaScript en la página

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** usa la carpeta `practica` de los Temas 15 y 16. Crea `practica/app.js` y conéctalo al final del `body` con `<script src="app.js"></script>`. Abre la **consola** del navegador (clic derecho → Inspeccionar → Consola) y déjala abierta: ahí vas a ver lo que imprimes y los errores.

**Lo que necesitas saber antes:** Tema 01 (variables, funciones, `if`, listas, objetos), Temas 15 y 16.

## 1. Repaso rápido: variables, datos y funciones

> 🎙️ **El profesor:** {{alumno}}, la casa ya tiene paredes (HTML) y pintura (CSS). Hoy instalamos **la electricidad**: que al tocar un botón pase algo. Eso es **JavaScript**. Ya leíste TypeScript en el Tema 01; JavaScript es lo mismo, **sin los tipos**. Así que empezamos con un repaso corto.

> 🌎 **En la vida real:** Una variable es como una caja con etiqueta en un depósito: `const` es una caja sellada con cinta (no se cambia lo de adentro) y `let` es una caja con tapa (la puedes vaciar y volver a llenar). Una función es la máquina del depósito que empaqueta lo que le das.

> 🌎 **Otro ejemplo:** Es como el marcador de un partido: el nombre del equipo no cambia (`const`), los goles sí van cambiando (`let`), y el tablero que suma un gol cada vez es la función.

```js
const app = 'Uber';          // texto: no cambia
let viajes = 0;              // número: va a cambiar
viajes = viajes + 1;         // ahora vale 1

const activo = true;                       // verdadero / falso
const apps = ['Uber', '99', 'inDrive'];    // lista (array)
const carro = { marca: 'Toyota', modelo: 'Etios', anio: 2017 };   // objeto

console.log(carro.modelo);   // muestra "Etios" en la consola
```

- **`const`** = frasco **sellado**: lo que guardas no se puede reemplazar.
- **`let`** = frasco con **tapa de rosca**: lo puedes vaciar y volver a llenar.
- **`console.log(...)`** escribe en la consola. Es tu mejor amigo para ver qué vale cada cosa.

Las funciones, de dos formas que vas a ver siempre:

```js
function sumar(a, b) {
  return a + b;
}

const restar = (a, b) => a - b;   // "función flecha": lo mismo, más corto
```

La **función flecha** `(a, b) => a - b` se lee: "recibe `a` y `b`, y devuelve `a - b`". Si es de una sola línea, no necesita `return` ni llaves.

**Prueba ahora:** escribe esas líneas en `app.js`, recarga y mira la consola: debe decir `Etios`.

> ✋ **Para y piensa:** ¿qué pasa si haces `const app = 'Uber'` y después `app = '99'`?

<details>
<summary>Ver la respuesta</summary>

**Error**: `Assignment to constant variable` ("asignación a una constante"). Con `const` no se puede reemplazar. Si va a cambiar, usa `let`.

</details>

```practica
elige :: ¿Qué usas para un valor que va a cambiar? :: `const` :: `let` :: `function`
elige :: ¿Cómo lees el año del objeto `carro`? :: `carro[anio]` :: `carro.anio` :: `anio.carro`
elige :: ¿Dónde aparece lo que escribes con `console.log`? :: En la página :: En la consola del navegador :: En GitHub
vf :: `const restar = (a, b) => a - b;` es una función
escribe :: ¿Qué diferencia hay entre `const` y `let`? :: Con const el valor no se puede reemplazar; con let sí se puede cambiar después.
```

> 🔁 **Repaso:** `const` (no cambia), `let` (cambia), listas, objetos, funciones normales y flecha, y `console.log` para mirar.

## 2. Listas: recorrer, transformar y filtrar

> 🎙️ **El profesor:** casi todo lo que hace una página con datos es: tomar una **lista** y hacer algo con cada elemento. Hay cinco herramientas, y con ellas haces el 90% del trabajo.

```js
const viajes = [
  { app: 'Uber', valor: 18 },
  { app: '99', valor: 12 },
  { app: 'Uber', valor: 25 },
];

viajes.forEach((v) => console.log(v.valor));            // 18, 12, 25

const valores = viajes.map((v) => v.valor);             // [18, 12, 25]
const deUber = viajes.filter((v) => v.app === 'Uber');  // los dos de Uber
const grande = viajes.find((v) => v.valor > 20);        // { app: 'Uber', valor: 25 }
const total = valores.reduce((suma, x) => suma + x, 0); // 55
```

| Método | Devuelve | Para qué |
|---|---|---|
| `forEach` | Nada | Hacer algo con cada uno |
| `map` | Una lista **nueva, del mismo largo** | **Transformar** cada uno |
| `filter` | Una lista nueva, **más corta** | **Quedarse** con los que cumplen |
| `find` | **Un** elemento (o `undefined`) | Buscar **el primero** que cumple |
| `reduce` | **Un** valor | **Juntar** todo en uno (una suma, por ejemplo) |

Cada uno recibe una **función flecha** que se aplica a cada elemento. En `(v) => v.valor`, `v` es "cada viaje".

El `reduce` es el más difícil. Léelo así: empieza con `suma = 0`; para cada `x`, la nueva suma es `suma + x`. Con 18, 12 y 25: 0 → 18 → 30 → 55.

> 🌎 **En la vida real:** una pila de recibos. `forEach` = mirar uno por uno. `map` = fotocopiar cada uno, pero cambiado (solo el total). `filter` = separar solo los de Uber. `find` = buscar el primero que cumpla algo. `reduce` = sumar todo en la calculadora.

> 🌎 **Otro ejemplo:** Como una lista de pasajeros de un vuelo: revisarlos uno por uno (forEach), hacer las tarjetas de embarque (map), separar los de primera clase (filter), buscar a uno por nombre (find) y contar el total de equipaje (reduce).

> 💡 **Idea:** este mapa usa `map` para convertir la lista de clases en tarjetas HTML. Abre `web/app.js` y busca `.map(`.

> ✋ **Para y piensa:** ¿qué devuelve `[1, 2, 3].map((x) => x * 2)`?

<details>
<summary>Ver la respuesta</summary>

`[2, 4, 6]`: una lista nueva, del mismo largo, con cada número multiplicado por 2.

</details>

```practica
elige :: Para quedarte solo con los viajes de más de 15, ¿qué usas? :: `map` :: `filter` :: `reduce`
elige :: Para convertir cada viaje en su valor, ¿qué usas? :: `filter` :: `map` :: `find`
elige :: Para sumar todos los valores en un número, ¿qué usas? :: `forEach` :: `map` :: `reduce`
elige :: ¿Qué devuelve `find` si ninguno cumple? :: `0` :: `undefined` :: Una lista vacía
vf :: `map` devuelve una lista del mismo largo que la original
vf :: `filter` cambia la lista original
```

> 🔁 **Repaso:** `forEach` (cada uno), `map` (transformar), `filter` (quedarse), `find` (el primero), `reduce` (juntar en uno).

## 3. Textos con plantillas

> 🎙️ **El profesor:** una herramienta pequeña que vas a usar en todas partes.

```js
const nombre = 'Delvin';
const viajes = 12;

const viejo = 'Hola ' + nombre + ', hoy hiciste ' + viajes + ' viajes.';
const nuevo = `Hola ${nombre}, hoy hiciste ${viajes} viajes.`;   // con comillas invertidas
```

- Las **comillas invertidas** `` ` `` (en el teclado español, junto a la tecla Enter o con Alt) permiten meter valores con **`${...}`**.
- También permiten texto de **varias líneas**. Por eso se usan para armar pedazos de HTML:

```js
const tarjeta = `
  <article class="tarjeta">
    <h2>${estudio.titulo}</h2>
    <p>${estudio.resumen}</p>
  </article>`;
```

> 🌎 **En la vida real:** una carta modelo con huecos: "Querido ____, tu pedido número ____ llegó". Llenas los huecos y listo.

> 🌎 **Otro ejemplo:** Como un mensaje automático de WhatsApp Business: "Hola {nombre}, tu turno es el {día}". La plantilla es la misma, y los datos cambian para cada cliente.

```practica
elige :: Reescribe `'Total: ' + total + ' reales'` con plantilla :: `'Total: ${total} reales'` :: `` `Total: ${total} reales` `` :: `"Total: total reales"`
vf :: Con comillas simples `'...'` también funciona `${...}`
vf :: Las plantillas permiten texto de varias líneas
```

> 🔁 **Repaso:** `` `texto ${valor}` ``, con comillas invertidas; sirven para varias líneas y para armar HTML.

## 4. Encontrar cajas del HTML

> 🎙️ **El profesor:** ahora empieza lo nuevo de verdad: JavaScript **tocando la página**. Y lo primero es **encontrar** la caja que quieres cambiar.

```js
const titulo = document.querySelector('h1');               // el PRIMER h1
const boton = document.querySelector('#boton-tema');       // por id
const tarjetas = document.querySelectorAll('.tarjeta');    // TODAS las .tarjeta
```

- **`document`** es la página entera: el **DOM** del Tema 15.
- **`querySelector`** usa **los mismos selectores que CSS** (Tema 16): `h1`, `#id`, `.clase`. ¡Lo que ya sabes te sirve aquí!
- `querySelector` devuelve **el primero**; `querySelectorAll`, **todos**.
- Si no encuentra nada, devuelve **`null`**. Si después intentas usar ese `null`, da error (parte 10).

> 🌎 **En la vida real:** pedir en una ferretería "deme **el** martillo rojo" (uno) o "deme **todos** los tornillos de 3 cm" (varios). Primero hay que encontrar la cosa para usarla.

> 🌎 **Otro ejemplo:** Como buscar en el teléfono "el primer contacto que se llama Ana" o "todos los contactos del trabajo".

```practica
elige :: ¿Cómo encuentras el elemento con `id="buscador"`? :: `document.querySelector('buscador')` :: `document.querySelector('#buscador')` :: `document.querySelector('.buscador')`
elige :: ¿Qué devuelve `querySelector` si no encuentra nada? :: `0` :: `null` :: Una lista vacía
vf :: `querySelectorAll('.tarjeta')` devuelve todas las tarjetas
vf :: `querySelector` usa selectores distintos a los de CSS
```

> 🔁 **Repaso:** `document.querySelector` (el primero) y `querySelectorAll` (todos), con selectores de CSS. Si no encuentra, `null`.

## 5. Cambiar la página

> 🎙️ **El profesor:** ya la encontraste. Ahora la cambias.

> 🌎 **En la vida real:** Es como cambiar los carteles de una tienda sin cerrarla: cambias el precio, le pones "oferta" o agregas un cartel nuevo, mientras los clientes siguen adentro.

> 🌎 **Otro ejemplo:** Es como editar un documento compartido en vivo: cambias una palabra y todos la ven al instante, sin volver a imprimir.

```js
const titulo = document.querySelector('h1');

titulo.textContent = 'Mapa de estudios';     // cambia el texto
titulo.classList.add('acento');              // le agrega una clase (CSS la pinta)
titulo.classList.remove('acento');           // se la quita
titulo.classList.toggle('activo');           // si la tiene la quita, si no la pone
titulo.style.color = 'red';                  // cambia un estilo directo (mejor usar clases)
document.documentElement.dataset.theme = 'light';   // pone data-theme="light" en <html>
```

- `textContent` = el texto de adentro.
- `classList` = la lista de clases: `add`, `remove`, `toggle`. **Lo normal** es cambiar clases y dejar que el CSS pinte.
- `document.documentElement` es la etiqueta `<html>`; `dataset.theme` es su atributo `data-theme`.

> 💡 **Idea:** el botón ◐ de esta página hace exactamente `dataset.theme = 'light'`. El CSS ve el atributo y cambia todas las variables (Tema 16, parte 6). Tres temas conectados en una línea.

### Crear cajas nuevas

```js
// 1. Con innerHTML: escribes HTML como texto
const lista = document.querySelector('#lista');
lista.innerHTML = apps.map((a) => `<li>${a}</li>`).join('');

// 2. Con createElement: armas la caja pieza por pieza
const li = document.createElement('li');
li.textContent = 'inDrive';
lista.appendChild(li);
```

`.join('')` une la lista de textos en uno solo (sin nada entre medio).

> ⚠️ **Cuidado:** `innerHTML` con texto que **escribió un usuario** es peligroso: si alguien escribe `<script>...`, lo ejecutarías. Para texto del usuario usa **`textContent`**, que lo muestra tal cual. Este mapa tiene una función `escapar(...)` justo para eso.

> 🌎 **En la vida real:** el cartel de precios de la gasolinera con números que se cambian a mano: no construyes un cartel nuevo, cambias los números.

> 🌎 **Otro ejemplo:** Como agregar una línea nueva a la lista del supermercado que está pegada en la heladera: la lista sigue ahí, con un renglón más.

```practica
elige :: ¿Qué línea agrega la clase `activo` si no la tiene, y la quita si la tiene? :: `classList.add('activo')` :: `classList.toggle('activo')` :: `classList.remove('activo')`
elige :: Para mostrar un comentario que escribió un usuario, ¿qué es más seguro? :: `innerHTML` :: `textContent` :: Da igual
elige :: ¿Qué hace `document.documentElement.dataset.theme = 'light'`? :: Borra el tema :: Pone `data-theme="light"` en la etiqueta `<html>` :: Cambia el título
vf :: Lo normal es cambiar clases y dejar que el CSS pinte
escribe :: ¿Por qué `innerHTML` es peligroso con texto del usuario? :: Porque si el usuario escribe HTML o un script, se ejecutaría en la página; textContent lo muestra como texto.
```

> 🔁 **Repaso:** `textContent`, `classList` (add, remove, toggle), `dataset`, `innerHTML` (con cuidado) y `createElement` + `appendChild`.

## 6. Eventos: reaccionar a lo que hace el usuario

> 🎙️ **El profesor:** hasta ahora el código corre una vez, al cargar. Pero una página "viva" **reacciona**: a un clic, a una tecla, a lo que escribes. Eso son los **eventos**.

```js
const boton = document.querySelector('#boton-tema');

boton.addEventListener('click', () => {
  console.log('¡tocaron el botón!');
});
```

`addEventListener('evento', función)` = "**cuando** pase este evento, **ejecuta** esta función". La función se llama *listener* ("el que escucha"). No corre ahora: **espera** a que pase el evento.

| Evento | Cuándo pasa |
|---|---|
| `click` | Un clic (o un toque en el celular) |
| `input` | Cada vez que cambia lo escrito en una casilla |
| `submit` | Se envía un formulario |
| `keydown` | Se aprieta una tecla |
| `hashchange` | Cambia lo que va después de `#` en la dirección |
| `DOMContentLoaded` | Terminó de leerse el HTML |

La función recibe un objeto con **los detalles** del evento:

```js
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') cerrarBuscador();
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();      // evita que la página se recargue
  guardar();
});
```

> 🌎 **En la vida real:** un timbre. Lo instalas y dices "**cuando** alguien lo toque, abre la puerta". No estás mirando la puerta todo el tiempo: el timbre te avisa.

> 🌎 **Otro ejemplo:** Como el sensor de una puerta automática: no está abriendo todo el tiempo; espera a que alguien se acerque, y entonces se abre.

> 💡 **Idea:** en esta página, si aprietas la tecla `/` se abre el buscador. Busca `'keydown'` en `web/buscar.js`.

> ✋ **Para y piensa:** ¿qué evento usas para buscar mientras la persona escribe, letra por letra?

<details>
<summary>Ver la respuesta</summary>

**`input`**: se dispara cada vez que cambia lo escrito.

</details>

```practica
elige :: ¿Qué hace `addEventListener('click', fn)`? :: Ejecuta `fn` ahora :: Ejecuta `fn` cada vez que hagan clic :: Borra el botón
elige :: ¿Para qué sirve `evento.preventDefault()` en un formulario? :: Para enviarlo más rápido :: Para evitar que la página se recargue :: Para borrar lo escrito
elige :: ¿Qué evento salta al apretar una tecla? :: `click` :: `keydown` :: `submit`
vf :: La función de un listener corre apenas se carga la página
escribe :: Con tus palabras: ¿qué es un evento? :: Algo que pasa en la página, como un clic o una tecla; con addEventListener registro una función que se ejecuta cuando pasa.
```

> 🔁 **Repaso:** `addEventListener('evento', función)`. Eventos: `click`, `input`, `submit`, `keydown`, `hashchange`. `preventDefault()` evita lo que haría el navegador.

## 7. Traer archivos: `fetch`, `async` y `await`

> 🎙️ **El profesor:** esta es la parte más importante de la clase, porque es lo que hacen tus dos páginas: **traer datos de un archivo**. Y trae una idea nueva: algunas cosas **tardan**.

```js
async function cargarEstudio() {
  const respuesta = await fetch('estudios/pastoras.json');   // pide el archivo
  if (!respuesta.ok) throw new Error('No encontré el estudio');
  const estudio = await respuesta.json();              // lo convierte en objeto
  console.log(estudio.titulo);
}
```

| Palabra | Qué quiere decir |
|---|---|
| `fetch(ruta)` | "Tráeme este archivo." Devuelve una **promesa**. |
| **Promesa** | Un **recibo** de "esto va a llegar". Como el número de tu pedido. |
| `await` | "**Espera** aquí hasta que llegue" (sin congelar la página). |
| `async` | Marca una función que usa `await` por dentro. |
| `respuesta.ok` | `true` si el archivo llegó bien (no fue un 404). |
| `throw new Error(...)` | "Lanza" un error, para cortar ahí. |
| `.json()` | Convierte el texto JSON en un objeto de JavaScript. |
| `.text()` | Lo deja como texto (este mapa lo usa para leer los `.md`). |

> 🌎 **En la vida real:** pides una pizza por teléfono. No te quedas parado mirando la puerta: sigues con tus cosas, y **cuando llega**, la recibes. `fetch` es pedir; la promesa es el número de pedido; `await` es "cuando llegue, sigo".

> 🌎 **Otro ejemplo:** Como mandar un mensaje y seguir con tu día: cuando llega la respuesta, la lees. No te quedas mirando la pantalla.

### JSON: datos como texto

> 🌎 **En la vida real:** Es como una ficha de inscripción escrita en un formato que entienden todos los sistemas: cada dato con su nombre entre comillas.

> 🌎 **Otro ejemplo:** Es como el formato de una factura electrónica: cualquier programa la puede leer porque sigue siempre las mismas reglas.

**JSON** es la forma de guardar datos en un archivo de texto. Se parece a un objeto de JavaScript:

```json
{
  "titulo": "La fe",
  "puntos": [
    { "texto": "Qué es la fe", "versiculo": "Hebreos 11:1" }
  ]
}
```

Las claves van **siempre entre comillas dobles**.

> 📌 **Nota:** `fetch` **no funciona** si abres la página con doble clic (la dirección empieza con `file://`): el navegador lo bloquea por seguridad. Necesita un **servidor**. Lo ves en el Tema 18, parte 6.

> 💡 **Idea:** tu página de estudios bíblicos guarda cada estudio como JSON y lo trae con `fetch` (Tema 12). Este mapa hace lo mismo con los `LECCION.md`.

> ✋ **Para y piensa:** ¿qué pasa si escribes `fetch(...)` **sin** `await` y usas el resultado en la línea siguiente?

<details>
<summary>Ver la respuesta</summary>

Tienes **la promesa** (el recibo), no el archivo: los datos todavía no llegaron. Intentar leer `.titulo` de un recibo no funciona.

</details>

```practica
escribe :: ¿Qué es una promesa? :: Un valor que todavía no llegó, como el recibo de un pedido: representa algo que va a llegar después, como la respuesta de fetch.
elige :: ¿Para qué sirve `await`? :: Para cancelar el pedido :: Para esperar a que llegue el resultado sin congelar la página :: Para enviar datos
elige :: ¿Dónde se puede usar `await`? :: En cualquier lado :: Dentro de una función `async` :: Solo en HTML
elige :: ¿Qué hace `.json()`? :: Escribe un archivo :: Convierte el texto JSON en un objeto de JavaScript :: Borra el archivo
vf :: `fetch` funciona si abres la página con doble clic
vf :: En JSON, las claves van entre comillas dobles
elige :: ¿Por qué un estudio se guarda como JSON y no como HTML? :: Porque es más lindo :: Porque son solo datos, que se pueden mostrar como mapa, como PDF o editar, sin repetirlos :: Porque HTML no guarda texto
```

> 🔁 **Repaso:** `fetch` pide un archivo y devuelve una promesa; `await` (dentro de `async`) espera; `.json()` o `.text()` lo convierten. Necesita servidor.

## 8. Guardar en el navegador: `localStorage`

> 🎙️ **El profesor:** ¿cómo recuerda esta página tu tema oscuro y tus bombillos 💡? Con un cuaderno que el navegador le presta: **`localStorage`**.

```js
localStorage.setItem('mapa-tema', 'light');           // guardar
const tema = localStorage.getItem('mapa-tema');       // leer ('light', o null si no hay)
localStorage.removeItem('mapa-tema');                 // borrar

// Solo guarda texto. Para listas u objetos, conviértelos:
localStorage.setItem('entendido', JSON.stringify({ '15:0:1': true }));
const entendido = JSON.parse(localStorage.getItem('entendido') || '{}');
```

- Guarda **solo texto**. Para guardar un objeto: **`JSON.stringify`** lo convierte en texto; para leerlo, **`JSON.parse`** lo vuelve objeto.
- `|| '{}'` = "si no había nada (`null`), usa un objeto vacío".

> 🌎 **En la vida real:** un cuaderno que el navegador guarda en un cajón **solo para esta página**. Si vuelves mañana, sigue ahí. Pero es de **este** navegador: en otro celular, el cuaderno está vacío.

> 🌎 **Otro ejemplo:** Como la memoria de tu control remoto: recuerda el último canal que viste, pero solo en ese televisor.

> ⚠️ **Cuidado:** en modo privado o con algunas configuraciones, `localStorage` da error. Por eso este mapa lo envuelve en `try { ... } catch { ... }`: si no se puede guardar, la página sigue funcionando. Míralo en `web/guardado.js`.

```practica
elige :: Marcas una parte como entendida en tu Mac. ¿Aparece en tu iPad? :: Sí, siempre :: No: `localStorage` es de cada navegador :: Solo si es de día
elige :: ¿Para qué hace falta `JSON.stringify` al guardar un objeto? :: Para cifrarlo :: Porque `localStorage` solo guarda texto :: Para borrarlo
vf :: `localStorage.getItem` devuelve `null` si no hay nada guardado
vf :: `localStorage` sirve para guardar datos importantes de usuarios en todos sus aparatos
```

> 🔁 **Repaso:** `setItem`, `getItem`, `removeItem`; solo texto (`JSON.stringify` / `JSON.parse`); es de cada navegador; envolver en `try/catch`.

## 9. Módulos: un archivo para cada trabajo

> 🎙️ **El profesor:** cuando el código crece, no se pone todo en un archivo. Se reparte en **módulos**, cada uno con un trabajo.

```js
// web/guardado.js
export function estaEntendida(id) { /* ... */ }

// web/app.js
import { estaEntendida } from './guardado.js';
```

```html
<script type="module" src="web/app.js"></script>
```

- **`export`** = "esto lo pueden usar otros archivos".
- **`import { ... } from '...'`** = "traigo esto de otro archivo".
- En el HTML hay que poner **`type="module"`**.

Este mapa está repartido así (es la arquitectura del Tema 10 en pequeño):

| Archivo | Su único trabajo |
|---|---|
| `web/cursos.js` | La lista de etapas y clases (los datos) |
| `web/lector.js` | Leer los `.md` y partirlos en partes |
| `web/guardado.js` | Guardar y leer en `localStorage` |
| `web/practica.js` | Las prácticas interactivas |
| `web/buscar.js` | El buscador |
| `web/app.js` | Decidir qué pantalla mostrar (mira la dirección y llama a la que toca) |
| `web/vistas/` | Cada pantalla en su propio archivo: `mapas.js`, `parte.js`, `progreso.js`, `cuenta.js`, `certificado.js` |

> 🌎 **En la vida real:** en un restaurante no cocina todo una sola persona. Cada cocinero hace lo suyo y se **pasan** las cosas. Los módulos son los cocineros.

> 🌎 **Otro ejemplo:** Como un equipo de fútbol: arquero, defensores, mediocampistas y delanteros; cada uno con su puesto, y se pasan la pelota.

```practica
elige :: Para agregar una clase nueva al mapa, ¿qué archivo abres? :: `web/app.js` :: `web/cursos.js` :: `web/guardado.js`
elige :: ¿Qué hay que poner en el `<script>` para usar `import`? :: `type="text"` :: `type="module"` :: Nada
vf :: `export` permite que otro archivo use una función
```

> 🔁 **Repaso:** `export` / `import` y `<script type="module">`. Un archivo, un trabajo.

## 10. Cuando algo falla: la consola

> 🎙️ **El profesor:** para terminar, lo del Tema 07 aplicado a la web. La consola es tu tablero de luces.

> 🌎 **En la vida real:** Es como el tablero del carro: cuando algo falla, se prende una luz con un símbolo. Hay que saber leerla antes de abrir el capó.

> 🌎 **Otro ejemplo:** Es como el mensaje de error de un cajero automático: "tarjeta vencida" o "saldo insuficiente" te dice exactamente qué pasó.

Abre la consola: clic derecho → **Inspeccionar** → **Consola** (o `Cmd + Option + J`).

| Mensaje | Qué quiere decir | Causa típica |
|---|---|---|
| `Cannot read properties of null` | Usaste algo que no existe | `querySelector` no encontró la caja (selector mal escrito, o el script corrió antes que el HTML) |
| `x is not defined` | Esa variable no existe | Error de tipeo o falta un `import` |
| `x is not a function` | Llamaste algo que no es una función | Nombre equivocado |
| `Failed to fetch` / `404` | No encontró el archivo | Ruta mal escrita, o abriste con `file://` |
| `Unexpected token` | Error al escribir | Falta una `}`, una `)` o una coma |

**Lee el mensaje y la línea** antes de cambiar nada (Tema 07).

> ✋ **Para y piensa:** tu script dice `Cannot read properties of null (reading 'addEventListener')`. ¿Qué revisas primero?

<details>
<summary>Ver la respuesta</summary>

Que el **selector** esté bien escrito y que esa caja **exista** en el HTML. Y que el `<script>` esté **al final del `body`** (o sea `type="module"`), para que corra después de que exista la caja.

</details>

```practica
elige :: `Cannot read properties of null` casi siempre quiere decir… :: Que falta internet :: Que `querySelector` no encontró la caja :: Que el CSS está mal
elige :: `Unexpected token` quiere decir… :: Que falta un archivo :: Que hay un error al escribir: falta una llave, un paréntesis o una coma :: Que el usuario hizo clic
vf :: `Failed to fetch` puede pasar si abres la página con doble clic
```

> 🔁 **Repaso:** la consola muestra los errores; los más comunes son `null` (no encontró la caja), `not defined`, `not a function`, `Failed to fetch` y `Unexpected token`.

## Ejercicios

> 🎙️ **El profesor:** en `practica/app.js`. Escribe tú cada línea.

> 🌎 **En la vida real:** Es como instalar tu primer timbre: conectas los cables tú, aprietas el botón, y suena.

**A. Botón de tema**
1. Agrega un `<button id="tema">◐</button>` al HTML.
2. Al hacer clic, que cambie `data-theme` del `<html>` entre `light` y `dark` (usa las variables del Tema 16).
3. Guarda la elección en `localStorage` y, al abrir la página, léela y aplícala.

**B. Lista que se dibuja sola**
4. Crea una lista de tus 3 proyectos como objetos (`{ nombre, descripcion, enlace }`).
5. Con `map` y una plantilla, conviértela en tarjetas HTML dentro de un `<main id="proyectos">`.

**C. Buscador mínimo**
6. Agrega un `<input id="buscar">`. Con el evento `input`, muestra solo las tarjetas cuyo nombre incluye lo escrito (`filter` + `includes`).

**D. Traer un archivo**
7. Guarda tus proyectos en `practica/proyectos.json` y cárgalos con `fetch`. Ábrelo con un servidor (Tema 18, parte 6).

<details>
<summary>Ver una solución de A</summary>

```js
const raiz = document.documentElement;
const boton = document.querySelector('#tema');

try {
  const guardado = localStorage.getItem('tema');
  if (guardado) raiz.dataset.theme = guardado;
} catch (e) {}

boton.addEventListener('click', () => {
  const nuevo = raiz.dataset.theme === 'light' ? 'dark' : 'light';
  raiz.dataset.theme = nuevo;
  try { localStorage.setItem('tema', nuevo); } catch (e) {}
});
```

`condición ? a : b` se lee "si la condición es verdad, a; si no, b".

</details>

<details>
<summary>Ver una solución de B y C</summary>

```js
const proyectos = [
  { nombre: 'Copiloto Driver', descripcion: 'App para conductores', enlace: '#' },
  { nombre: '¿Qué dice la Biblia?', descripcion: 'Estudios en mapa', enlace: '#' },
  { nombre: 'Mapa de estudios', descripcion: 'Mis clases como mapa', enlace: '#' },
];

const main = document.querySelector('#proyectos');
const buscar = document.querySelector('#buscar');

function dibujar(lista) {
  main.innerHTML = lista.map((p) => `
    <article>
      <h2><a href="${p.enlace}">${p.nombre}</a></h2>
      <p>${p.descripcion}</p>
    </article>`).join('');
}

dibujar(proyectos);

buscar.addEventListener('input', () => {
  const palabra = buscar.value.toLowerCase();
  dibujar(proyectos.filter((p) => p.nombre.toLowerCase().includes(palabra)));
});
```

`toLowerCase()` pasa todo a minúsculas, para que "copiloto" encuentre "Copiloto".

</details>

<details>
<summary>Ver una solución de D</summary>

```js
async function cargar() {
  const r = await fetch('proyectos.json');
  const proyectos = await r.json();
  dibujar(proyectos);
}
cargar();
```

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta.

> 🌎 **En la vida real:** Explicar JavaScript en una entrevista es como explicar la electricidad de una casa: qué se enciende cuando tocas qué, y de dónde viene la corriente.

> 🎤 **Entrevista:** "¿Qué es el DOM y cómo lo cambia JavaScript?" y "¿Qué es un evento?"

<details>
<summary>Ver buenas respuestas</summary>

"El DOM es el árbol de objetos que arma el navegador con el HTML. JavaScript busca nodos con `querySelector`, cambia su texto o sus clases, crea nodos nuevos, y el navegador vuelve a dibujar."

"Un evento es algo que pasa en la página, como un clic o una tecla. Con `addEventListener` registro una función que se ejecuta cuando pasa."

</details>

> 🎤 **Entrevista:** "¿Qué es una promesa y para qué sirve `await`?"

<details>
<summary>Ver una buena respuesta</summary>

"Una promesa representa un resultado que todavía no llegó, como la respuesta de `fetch`. `await` espera ese resultado sin congelar la página, y solo se usa dentro de funciones `async`."

</details>

> 🎤 **Entrevista:** "¿Cómo cargas datos en tu página de estudios?" y "¿`localStorage` sirve para datos de usuarios?"

<details>
<summary>Ver buenas respuestas</summary>

"Cada estudio es un archivo JSON. La página lo trae con `fetch`, lo convierte en objeto y arma el HTML del mapa con plantillas. Así los datos están separados del diseño."

"Solo para cosas pequeñas de ese navegador, como el tema o el progreso local. No se comparte entre aparatos ni es seguro para datos importantes; para eso hay una base de datos, como Firebase."

</details>

```practica
escribe :: Explica cómo tu página de estudios carga un estudio. :: Cada estudio es un archivo JSON; la página lo trae con fetch y await, lo convierte en objeto con .json() y arma el HTML del mapa con plantillas.
```

> 🔁 **Repaso final de la clase:** variables y funciones, listas (`map`, `filter`…), plantillas, encontrar y cambiar cajas, eventos, `fetch`/`async`/`await` con JSON, `localStorage`, módulos y la consola. Con esto terminas la etapa de **la web**. Próxima: **Tema 08, Firebase por dentro**.
