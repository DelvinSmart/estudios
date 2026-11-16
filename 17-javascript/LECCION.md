# Tema 17: JavaScript en la página

> 🌎 **En la vida real:** la casa ya tiene paredes (HTML) y pintura (CSS). Ahora falta **la electricidad**: que al apretar el interruptor se prenda la luz, que el timbre suene, que el portón se abra. JavaScript es lo que hace que la página **responda**.

En el Tema 01 aprendiste a leer TypeScript, que es JavaScript con tipos. Aquí usas JavaScript **dentro de una página**: buscar cajas del HTML, cambiarlas, reaccionar a los clics, traer archivos y guardar cosas. Es exactamente lo que hacen tu página **¿Qué dice la Biblia?** y este mapa.

Para practicar, crea `practica/app.js` y conéctalo al final del `body` de `practica/index.html`:

```html
<script src="app.js"></script>
```

## 1. Repaso rápido: variables, datos y funciones

> 🌎 **En la vida real:** una variable es un frasco con etiqueta. `const` es un frasco **sellado** (el contenido no cambia); `let` es un frasco con tapa de rosca (lo puedes vaciar y volver a llenar).

```js
const app = 'Uber';          // texto: no cambia
let viajes = 0;              // número: va a cambiar
viajes = viajes + 1;         // ahora vale 1

const activo = true;                       // verdadero / falso
const apps = ['Uber', '99', 'inDrive'];    // lista (array)
const carro = { marca: 'Toyota', modelo: 'Etios', anio: 2017 };   // objeto

console.log(carro.modelo);   // muestra "Etios" en la consola
```

Funciones, de dos formas que vas a ver siempre:

```js
function sumar(a, b) {
  return a + b;
}

const restar = (a, b) => a - b;   // "función flecha": lo mismo, más corto
```

> 📌 **Nota:** `console.log(...)` es tu mejor amigo. Escribe en la **consola** del navegador (clic derecho → Inspeccionar → pestaña Consola). Lo usas para ver qué vale cada cosa mientras programas.

**Preguntas**
1. ¿Qué pasa si haces `const app = 'Uber'` y después `app = '99'`?
2. ¿Cómo lees el año del objeto `carro`?

## 2. Listas: recorrer, transformar y filtrar

> 🌎 **En la vida real:** tienes una pila de recibos del mes.
> - `forEach` = mirar uno por uno.
> - `map` = sacar una fotocopia de cada uno, pero **cambiada** (por ejemplo, solo el total).
> - `filter` = separar solo los de Uber.
> - `find` = buscar **el primero** que cumpla algo.

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
| `map` | Una lista **nueva**, del mismo largo | Transformar cada uno |
| `filter` | Una lista nueva, más corta | Quedarse con los que cumplen |
| `find` | **Un** elemento (o `undefined`) | Buscar el primero que cumple |
| `reduce` | **Un** valor | Juntar todo en uno (una suma, por ejemplo) |

> 💡 **Idea:** este mapa usa `map` para convertir la lista de clases en tarjetas HTML. Abre `web/app.js` y busca `.map(`.

**Preguntas**
3. ¿Qué devuelve `[1, 2, 3].map((x) => x * 2)`?
4. ¿Qué método usas para quedarte solo con los viajes de más de 15?

## 3. Textos con plantillas

> 🌎 **En la vida real:** es una carta modelo con huecos: "Querido ____, tu pedido número ____ llegó". Llenas los huecos y listo.

```js
const nombre = 'Delvin';
const viajes = 12;

const viejo = 'Hola ' + nombre + ', hoy hiciste ' + viajes + ' viajes.';
const nuevo = `Hola ${nombre}, hoy hiciste ${viajes} viajes.`;   // con comillas invertidas
```

- Las comillas invertidas `` ` `` permiten meter valores con `${...}`.
- También permiten texto de **varias líneas**. Por eso se usan tanto para armar pedazos de HTML:

```js
const tarjeta = `
  <article class="tarjeta">
    <h2>${estudio.titulo}</h2>
    <p>${estudio.resumen}</p>
  </article>`;
```

**Preguntas**
5. Reescribe con plantilla: `'Total: ' + total + ' reales'`.

## 4. Encontrar cajas del HTML

> 🌎 **En la vida real:** es pedir algo en una ferretería: "deme **el** martillo rojo" (uno solo) o "deme **todos** los tornillos de 3 cm" (varios). Primero hay que encontrar la cosa para poder usarla.

```js
const titulo = document.querySelector('h1');               // el PRIMER h1
const boton = document.querySelector('#boton-tema');       // por id
const tarjetas = document.querySelectorAll('.tarjeta');    // TODAS las .tarjeta
```

- `document` es la página entera (el DOM del Tema 15).
- `querySelector` usa **los mismos selectores que CSS** (Tema 16). Lo que ya sabes de CSS te sirve aquí.
- Si no encuentra nada, devuelve `null`. Si después intentas usar ese `null`, da error (ver la parte 10).

**Preguntas**
6. ¿Cómo encuentras el elemento con `id="buscador"`?
7. ¿Qué diferencia hay entre `querySelector` y `querySelectorAll`?

## 5. Cambiar la página

> 🌎 **En la vida real:** es el cartel de precios de una gasolinera con números que se cambian a mano: no construyes un cartel nuevo, cambias los números que ya están.

```js
const titulo = document.querySelector('h1');

titulo.textContent = 'Mapa de estudios';     // cambia el texto
titulo.classList.add('acento');              // le agrega una clase (CSS la pinta)
titulo.classList.remove('acento');           // se la quita
titulo.classList.toggle('activo');           // si la tiene la quita, si no la pone
titulo.style.color = 'red';                  // cambia un estilo directo (mejor usar clases)
document.documentElement.dataset.theme = 'light';   // pone data-theme="light" en <html>
```

**Crear cajas nuevas**, de dos formas:

```js
// 1. Con innerHTML: escribes HTML como texto
const lista = document.querySelector('#lista');
lista.innerHTML = apps.map((a) => `<li>${a}</li>`).join('');

// 2. Con createElement: armas la caja pieza por pieza
const li = document.createElement('li');
li.textContent = 'inDrive';
lista.appendChild(li);
```

> ⚠️ **Cuidado:** `innerHTML` con texto que **escribió un usuario** es peligroso: si alguien escribe `<script>...`, lo ejecutarías. Para texto del usuario usa `textContent`, que lo muestra tal cual. Este mapa tiene una función `escapar(...)` justo para eso.

> 💡 **Idea:** el botón ◐ de esta página hace exactamente la línea `dataset.theme = 'light'`. El CSS ve el atributo y cambia todas las variables (Tema 16, parte 6).

**Preguntas**
8. ¿Qué línea usas para que un botón tenga la clase `activo` si no la tiene, y la pierda si la tiene?
9. ¿Por qué `textContent` es más seguro que `innerHTML` para un comentario del usuario?

## 6. Eventos: reaccionar a lo que hace el usuario

> 🌎 **En la vida real:** es un timbre. Instalas el timbre y dices "**cuando** alguien lo toque, abre la puerta". No estás mirando la puerta todo el tiempo: el timbre te avisa.

```js
const boton = document.querySelector('#boton-tema');

boton.addEventListener('click', () => {
  console.log('¡tocaron el botón!');
});
```

`addEventListener('evento', función)` quiere decir: "cuando pase este **evento**, ejecuta esta **función**". La función se llama *listener* ("el que escucha").

| Evento | Cuándo pasa |
|---|---|
| `click` | Un clic (o un toque en el celular) |
| `input` | Cada vez que cambia lo escrito en una casilla |
| `submit` | Se envía un formulario |
| `keydown` | Se aprieta una tecla |
| `hashchange` | Cambia lo que va después de `#` en la dirección |
| `DOMContentLoaded` | Terminó de leerse el HTML |

La función recibe un objeto con los detalles del evento:

```js
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') cerrarBuscador();
});

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();      // evita que la página se recargue
  guardar();
});
```

> 💡 **Idea:** en esta página, si aprietas la tecla `/` se abre el buscador. Busca `'keydown'` en `web/buscar.js`.

**Preguntas**
10. ¿Qué evento usas para buscar mientras la persona escribe?
11. ¿Para qué sirve `evento.preventDefault()` en un formulario?

## 7. Traer archivos: `fetch`, `async` y `await`

> 🌎 **En la vida real:** pides una pizza por teléfono. No te quedas parado mirando la puerta: sigues con tus cosas, y **cuando llega**, la recibes. Pedir algo por internet funciona igual: tarda, y el programa no se congela esperando.

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
| **Promesa** | Un recibo de "esto va a llegar". Como el número de tu pedido. |
| `await` | "Espera aquí hasta que llegue" (sin congelar la página). |
| `async` | Marca una función que usa `await` por dentro. |
| `.json()` | Convierte el texto JSON en un objeto de JavaScript. |
| `.text()` | Lo deja como texto (este mapa lo usa para leer los `.md`). |

**JSON** es la forma de guardar datos como texto. Parece un objeto de JavaScript:

```json
{
  "titulo": "La fe",
  "puntos": [
    { "texto": "Qué es la fe", "versiculo": "Hebreos 11:1" }
  ]
}
```

> 📌 **Nota:** `fetch` **no funciona** si abres la página con doble clic (la dirección empieza con `file://`). Necesita un servidor. Por eso esta página se abre con un servidor o desde GitHub Pages (Tema 18).

> 💡 **Idea:** tu página de estudios bíblicos guarda cada estudio como JSON y lo trae con `fetch` (Tema 12, parte 4 y 5). Este mapa hace lo mismo con los `LECCION.md`.

**Preguntas**
12. ¿Qué pasa si escribes `fetch(...)` sin `await` y usas el resultado en la línea siguiente?
13. ¿Por qué un estudio se guarda como JSON y no como HTML?

## 8. Guardar en el navegador: `localStorage`

> 🌎 **En la vida real:** es un cuaderno que el navegador guarda en un cajón **solo para esta página**. Si cierras y vuelves mañana, el cuaderno sigue ahí. Pero es de **este** navegador: en otro celular, el cuaderno está vacío.

```js
localStorage.setItem('mapa-tema', 'light');           // guardar
const tema = localStorage.getItem('mapa-tema');       // leer ('light', o null si no hay)
localStorage.removeItem('mapa-tema');                 // borrar

// Solo guarda texto. Para listas u objetos, conviértelos:
localStorage.setItem('entendido', JSON.stringify({ '15:0:1': true }));
const entendido = JSON.parse(localStorage.getItem('entendido') || '{}');
```

> ⚠️ **Cuidado:** en modo privado o con algunas configuraciones, `localStorage` da error. Por eso este mapa lo envuelve en `try { ... } catch { ... }`: si no se puede guardar, la página sigue funcionando. Míralo en `web/guardado.js`.

**Preguntas**
14. Marcas una parte como "entendida" en tu Mac. ¿Aparece marcada en tu iPad? ¿Por qué?
15. ¿Por qué hace falta `JSON.stringify` para guardar un objeto?

## 9. Módulos: un archivo para cada trabajo

> 🌎 **En la vida real:** en un restaurante no cocina todo una sola persona. Hay quien corta, quien cocina, quien sirve. Cada uno hace lo suyo y se **pasan** las cosas. Los módulos son los cocineros: cada archivo hace un trabajo y **exporta** lo que los demás necesitan.

```js
// web/guardado.js
export function estaEntendida(id) { /* ... */ }

// web/app.js
import { estaEntendida } from './guardado.js';
```

```html
<script type="module" src="web/app.js"></script>
```

- `export` = "esto lo pueden usar otros archivos".
- `import { ... } from '...'` = "traigo esto de otro archivo".
- En el HTML hay que poner `type="module"`.

Este mapa está partido así (es la arquitectura del Tema 10 en pequeño):

| Archivo | Su único trabajo |
|---|---|
| `web/cursos.js` | La lista de etapas y clases (los datos) |
| `web/lector.js` | Leer los `.md` y partirlos en partes |
| `web/guardado.js` | Guardar y leer en `localStorage` |
| `web/buscar.js` | El buscador |
| `web/app.js` | Decidir qué pantalla mostrar y dibujarla |

**Preguntas**
16. Si quieres agregar una clase nueva al mapa, ¿qué archivo abres?

## 10. Cuando algo falla: la consola

> 🌎 **En la vida real:** el tablero del carro prende una luz cuando algo anda mal. La consola del navegador es ese tablero: si algo se rompe, ahí aparece la luz roja con el motivo.

Abre la consola: clic derecho → **Inspeccionar** → **Consola** (o `Cmd + Option + J`).

| Mensaje | Qué quiere decir | Causa típica |
|---|---|---|
| `Cannot read properties of null` | Usaste algo que no existe | `querySelector` no encontró la caja (selector mal escrito, o el script corrió antes que el HTML) |
| `x is not defined` | Esa variable no existe | Error de tipeo o falta un `import` |
| `x is not a function` | Llamaste algo que no es una función | Nombre equivocado |
| `Failed to fetch` / `404` | No encontró el archivo | Ruta mal escrita, o abriste con `file://` |
| `Unexpected token` | Error al escribir | Falta una `}`, una `)` o una coma |

Es lo mismo que aprendiste en el Tema 07: **lee el mensaje y la línea** antes de cambiar nada.

**Preguntas**
17. Tu script dice `Cannot read properties of null (reading 'addEventListener')`. ¿Qué revisas primero?

## Ejercicios

> 🌎 **En la vida real:** es instalar tu primer interruptor: hasta que no lo conectas tú y se prende la luz, no lo entiendes del todo.

Todo en `practica/app.js`. Escribe tú cada línea.

**A. Botón de tema**
1. Agrega un `<button id="tema">◐</button>` al HTML.
2. Al hacer clic, que cambie `data-theme` del `<html>` entre `light` y `dark` (usa las variables del Tema 16).
3. Guarda la elección en `localStorage` y al abrir la página, léela y aplícala.

**B. Lista que se dibuja sola**
4. Crea en JavaScript una lista de tus 3 proyectos como objetos (`{ nombre, descripcion, enlace }`).
5. Con `map` y una plantilla, conviértela en tarjetas HTML y ponlas dentro de un `<main id="proyectos">`.

**C. Buscador mínimo**
6. Agrega un `<input id="buscar">`. Con el evento `input`, muestra solo las tarjetas cuyo nombre incluye lo escrito (`filter` + `includes`).

**D. Traer un archivo**
7. Guarda tus proyectos en `practica/proyectos.json` y cárgalos con `fetch` en vez de escribirlos en el código. Ábrelo con un servidor (Tema 18, parte 6).

## Respuestas (míralas solo después de intentarlo)

> 🌎 **En la vida real:** como la hoja de respuestas del examen de manejo teórico: la miras al final para saber en qué fallaste.

<details>
<summary>Ver respuestas de las preguntas</summary>

1. Error: `const` no se puede volver a asignar.
2. `carro.anio`.
3. `[2, 4, 6]`.
4. `filter`: `viajes.filter((v) => v.valor > 15)`.
5. `` `Total: ${total} reales` ``.
6. `document.querySelector('#buscador')`.
7. `querySelector` devuelve el primero; `querySelectorAll`, todos.
8. `boton.classList.toggle('activo')`.
9. Porque `textContent` muestra el texto tal cual y nunca lo ejecuta como HTML.
10. `input`.
11. Evita que el formulario recargue la página.
12. Tienes la promesa (el recibo), no el archivo: los datos todavía no llegaron.
13. Porque JSON son solo datos: la misma información se puede mostrar como mapa, como PDF o editarse en el panel, sin repetirla.
14. No: `localStorage` es de cada navegador, en cada aparato.
15. Porque `localStorage` solo guarda texto; `JSON.stringify` convierte el objeto en texto.
16. `web/cursos.js` (y crear la carpeta con su `LECCION.md`).
17. Que el selector esté bien escrito y que la caja exista en el HTML, y que el `<script>` esté al final del `body` (o sea `type="module"`).

</details>

<details>
<summary>Ver una solución del ejercicio A</summary>

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

</details>

## Para la entrevista

> 🎤 **Entrevista:** en voz alta, con tus palabras.

**¿Qué es el DOM y cómo lo cambia JavaScript?**
> El árbol de objetos que arma el navegador con el HTML. JavaScript busca nodos con `querySelector`, cambia su texto o sus clases, crea nodos nuevos, y el navegador vuelve a dibujar.

**¿Qué es un evento?**
> Algo que pasa en la página, como un clic o una tecla. Con `addEventListener` registras una función que se ejecuta cuando pasa.

**¿Qué es una promesa y para qué sirve `await`?**
> Una promesa representa un resultado que todavía no llegó, como la respuesta de `fetch`. `await` espera ese resultado sin congelar la página, y solo se usa dentro de funciones `async`.

**¿Cómo cargas datos en tu página de estudios?**
> Cada estudio es un archivo JSON. La página lo trae con `fetch`, lo convierte en objeto y arma el HTML del mapa con plantillas. Así los datos están separados del diseño.

**¿`localStorage` sirve para guardar datos de usuarios?**
> Solo para cosas pequeñas de ese navegador, como el tema o el progreso local. No se comparte entre aparatos ni es seguro para datos importantes; para eso hay una base de datos, como Firebase (Tema 08).
