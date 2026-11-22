# JavaScript 7: el DOM, cuando JavaScript cambia la página

> 🌎 **En la vida real:** una página web es como un tablero de corcho con papeles pegados. El HTML pone los papeles; JavaScript es la mano que los mueve, les escribe encima, agrega papeles nuevos o quita los viejos, mientras la persona mira.

> 🎙️ **El profesor dice:** {{alumno}}, hasta ahora tu JavaScript vivía en la consola: calculaba y mostraba números. Hoy lo conectas con la **pantalla**. Vas a encontrar elementos de la página, cambiar su texto, crear elementos nuevos, responder a un toque y leer un formulario. Es lo que hace cualquier botón de cualquier sitio. En los ejercicios de hoy escribes HTML **y** JavaScript juntos, y las pruebas tocan los botones por ti.

## Parte 1. Qué es el DOM y cómo encontrar un elemento

Cuando el navegador lee el HTML, arma en su memoria un **árbol** de objetos: uno por cada etiqueta. Ese árbol se llama **DOM** (*Document Object Model*, "modelo de objetos del documento"). JavaScript no cambia el archivo `.html`: cambia **ese árbol**, y el navegador redibuja lo que cambió.

> 🌎 **En la vida real:** el HTML es el plano de una casa; el DOM es la casa ya construida. Si cambias un mueble de lugar, cambias la casa, no el plano.

> 🌎 **Otro ejemplo:** Es como el árbol genealógico de una familia: `html` es el abuelo, `body` el papá, y cada `p` o `button` es un hijo o un nieto.

### Encontrar elementos

```js
const titulo = document.querySelector('h1');            // el PRIMERO que coincide
const total = document.querySelector('#total');         // por id
const botones = document.querySelectorAll('.boton');    // TODOS los que tienen esa clase
console.log(titulo.textContent);                        // el texto que tiene adentro
```

- `document` es la página entera.
- `querySelector` usa los **mismos selectores que CSS** (clase 16): `#id`, `.clase`, `etiqueta`.
- Si no encuentra nada, devuelve `null`. Por eso un error muy común es `Cannot read properties of null`: el selector estaba mal escrito.

> 🌎 **En la vida real:** `querySelector` es como pedir en una biblioteca "el primer libro de la estantería azul"; `querySelectorAll`, "todos los libros de la estantería azul".

> 🧩 **Piezas para este ejercicio**
> - El DOM es la representación de la página que JavaScript puede consultar. En un selector, `h1` busca una etiqueta, `#lectura` busca un id y `.viaje` busca una clase.
> - `querySelector` devuelve el primer elemento que coincide. `querySelectorAll` devuelve una colección y `.length` cuenta sus elementos. `textContent` sirve tanto para leer texto como para escribirlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Encontrar y leer elementos
lenguaje: html
pide: La página ya tiene un título y tres viajes. En el `<script>`, encuentra el `h1` y escribe su texto en el `p` con `id="lectura"`. Después cuenta los viajes (los elementos con clase `viaje`) y escribe el número en el `span` con `id="cuantos"`.
--- código
<h1>Viajes de hoy</h1>
<p id="lectura"></p>
<ul>
  <li class="viaje">Uber · R$ 18.50</li>
  <li class="viaje">99 · R$ 22.00</li>
  <li class="viaje">Uber · R$ 35.00</li>
</ul>
<p>Viajes: <span id="cuantos"></span></p>

<script>
  // tu código aquí
</script>
--- pruebas
prueba('el título se copió al párrafo', () => igual($('#lectura').textContent, 'Viajes de hoy'));
prueba('cuenta 3 viajes', () => igual($('#cuantos').textContent, '3'));
--- solución
<h1>Viajes de hoy</h1>
<p id="lectura"></p>
<ul>
  <li class="viaje">Uber · R$ 18.50</li>
  <li class="viaje">99 · R$ 22.00</li>
  <li class="viaje">Uber · R$ 35.00</li>
</ul>
<p>Viajes: <span id="cuantos"></span></p>

<script>
  const titulo = document.querySelector('h1');
  document.querySelector('#lectura').textContent = titulo.textContent;
  const viajes = document.querySelectorAll('.viaje');
  document.querySelector('#cuantos').textContent = viajes.length;
</script>
```

```practica
vf :: El DOM es el árbol de objetos que arma el navegador a partir del HTML
vf :: querySelector devuelve todos los elementos que coinciden
elige :: ¿Qué devuelve querySelector si no encuentra nada? :: Un error :: null :: Una lista vacía
elige :: ¿Con qué selector encuentras el elemento que tiene id="total"? :: .total :: #total :: total
escribe :: Explica con un ejemplo de la vida real la diferencia entre el HTML y el DOM. :: El HTML es el plano de la casa y el DOM es la casa construida. JavaScript mueve los muebles de la casa (el DOM); el plano (el archivo .html) queda igual.
```

## Parte 2. Cambiar la página: texto, clases y elementos nuevos

### Cambiar el texto y el estilo

```js
const total = document.querySelector('#total');
total.textContent = 'R$ 75.50';          // cambia el texto
total.classList.add('alto');             // le pone una clase (el estilo lo decide el CSS)
total.classList.remove('alto');          // se la quita
total.classList.toggle('oculto');        // la pone si no está; la quita si está
```

La regla de oro: **JavaScript pone y quita clases; el CSS decide cómo se ven**. Así el diseño queda en un solo lugar (el motor de diseño, clase 16) y JavaScript no se llena de colores escritos a mano.

> 🌎 **En la vida real:** es como el uniforme de un equipo: el entrenador (JavaScript) dice "hoy juegas de titular" y te da la camiseta; cómo es la camiseta lo decidió el club (el CSS).

### Crear elementos nuevos

```js
const lista = document.querySelector('#viajes');
const item = document.createElement('li');   // crea un <li> (todavía no está en la página)
item.textContent = 'InDrive · R$ 12.00';
lista.append(item);                          // ahora sí: lo agrega al final de la lista
item.remove();                               // y así se quita
```

> ⚠️ **Cuidado con `innerHTML`:** `elemento.innerHTML = texto` también cambia el contenido, pero **interpreta** el texto como HTML. Si ese texto lo escribió un usuario, puede meter código malicioso en tu página (es el ataque XSS del curso de seguridad). Para mostrar texto, usa siempre `textContent`.

> 🌎 **En la vida real:** `textContent` es como pegar una nota escrita a mano; `innerHTML` es como pegar lo que alguien te mandó sin leerlo: puede traer una sorpresa adentro.

> 🧩 **Piezas para este ejercicio**
> - `document.createElement('li')` crea un elemento que todavía está fuera de la página. Ponle texto y agrégalo a la lista con `.append(...)` o `.appendChild(...)`.
> - `toFixed(2)` prepara el número para mostrarlo con dos decimales. Para comprobar el total, conserva la suma como número hasta terminar la cuenta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dibujar la lista desde un array
lenguaje: html
pide: Con el array `gastos`, crea un `<li>` por cada gasto dentro de la lista `#gastos`, con el texto `combustible · R$ 150.00` (el valor con dos decimales). Al final, si el total pasa de 100, ponle la clase `alto` al elemento `#total` y escribe el total en él (`R$ 180.00`).
--- código
<style>
  .alto { color: crimson; font-weight: bold; }
</style>

<ul id="gastos"></ul>
<p id="total"></p>

<script>
  const gastos = [
    { tipo: 'combustible', valor: 150 },
    { tipo: 'lavado', valor: 30 },
  ];
  // tu código aquí
</script>
--- pruebas
prueba('hay un li por gasto', () => igual(document.querySelectorAll('#gastos li').length, 2));
prueba('el texto del primero', () => igual($('#gastos li').textContent, 'combustible · R$ 150.00'));
prueba('el total con dos decimales', () => igual($('#total').textContent, 'R$ 180.00'));
prueba('el total alto tiene la clase alto', () => ok($('#total').classList.contains('alto'), 'falta la clase alto'));
--- solución
<style>
  .alto { color: crimson; font-weight: bold; }
</style>

<ul id="gastos"></ul>
<p id="total"></p>

<script>
  const gastos = [
    { tipo: 'combustible', valor: 150 },
    { tipo: 'lavado', valor: 30 },
  ];
  const lista = document.querySelector('#gastos');
  for (const g of gastos) {
    const item = document.createElement('li');
    item.textContent = `${g.tipo} · R$ ${g.valor.toFixed(2)}`;
    lista.append(item);
  }
  const total = gastos.reduce((s, g) => s + g.valor, 0);
  const elTotal = document.querySelector('#total');
  elTotal.textContent = `R$ ${total.toFixed(2)}`;
  if (total > 100) elTotal.classList.add('alto');
</script>
```

```practica
vf :: Para mostrar un texto que escribió un usuario conviene usar textContent
vf :: createElement agrega el elemento a la página de una vez
elige :: ¿Qué hace classList.toggle('oculto')? :: Siempre agrega la clase :: Siempre la quita :: La agrega si no está y la quita si está
elige :: ¿Quién debería decidir el color de un total alto? :: JavaScript, escribiendo el color :: El CSS, con una clase que JavaScript pone o quita :: El HTML
escribe :: ¿Por qué es peligroso usar innerHTML con un texto que escribió el usuario? :: Porque innerHTML interpreta el texto como HTML: si el usuario escribe una etiqueta con código, ese código corre en la página de otros (ataque XSS). Con textContent se muestra tal cual, como texto.
```

## Parte 3. Eventos: responder cuando la persona hace algo

Un **evento** es algo que pasa en la página: un toque, una tecla, que el texto de un campo cambió. Con `addEventListener` le dices al navegador: "cuando pase esto, llama a esta función" (una función que recibe otra, como en la clase 47).

```js
const boton = document.querySelector('#sumar');
let viajes = 0;
boton.addEventListener('click', () => {
  viajes += 1;
  document.querySelector('#contador').textContent = viajes;
});
```

| Evento | Cuándo pasa |
|---|---|
| `click` | Un toque o clic |
| `input` | Cada vez que cambia el texto de un campo |
| `change` | Cuando se termina de cambiar (por ejemplo, al elegir una opción) |
| `submit` | Cuando se envía un formulario |
| `keydown` | Cuando se aprieta una tecla |

La función recibe un **objeto del evento** con detalles: `evento.target` es el elemento que lo causó.

> 🌎 **En la vida real:** es como un timbre: lo instalas una vez (`addEventListener`) y cada vez que alguien toca, suena (se llama tu función). No te quedas mirando la puerta.

> 🌎 **Otro ejemplo:** Es como pedirle al portero: "cuando llegue un paquete, avísame". Tú sigues con lo tuyo hasta que llega.

> 🧩 **Piezas para este ejercicio**
> - Registra una función distinta para cada botón con `addEventListener('click', ...)`. El navegador llama a esa función cuando ocurre el clic.
> - Declara el contador en un lugar que ambas funciones puedan leer. Después de cada cambio, escribe el valor nuevo en el elemento que lo muestra.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un contador de viajes con botones
lenguaje: html
pide: El botón **+1** suma un viaje y el botón **reiniciar** vuelve a 0. El número se ve en `#contador`. Las pruebas tocan los botones por ti.
--- código
<p>Viajes: <strong id="contador">0</strong></p>
<button id="sumar">+1</button>
<button id="reiniciar">reiniciar</button>

<script>
  let viajes = 0;
  // tu código aquí
</script>
--- pruebas
prueba('empieza en 0', () => igual($('#contador').textContent, '0'));
prueba('tres toques en +1 dan 3', () => { $('#sumar').click(); $('#sumar').click(); $('#sumar').click(); igual($('#contador').textContent, '3'); });
prueba('reiniciar vuelve a 0', () => { $('#reiniciar').click(); igual($('#contador').textContent, '0'); });
prueba('después de reiniciar, +1 da 1', () => { $('#sumar').click(); igual($('#contador').textContent, '1'); });
--- solución
<p>Viajes: <strong id="contador">0</strong></p>
<button id="sumar">+1</button>
<button id="reiniciar">reiniciar</button>

<script>
  let viajes = 0;
  const contador = document.querySelector('#contador');
  const mostrar = () => { contador.textContent = viajes; };
  document.querySelector('#sumar').addEventListener('click', () => { viajes += 1; mostrar(); });
  document.querySelector('#reiniciar').addEventListener('click', () => { viajes = 0; mostrar(); });
</script>
```

```practica
vf :: addEventListener llama a la función cada vez que pasa el evento, no solo la primera
vf :: El evento input pasa solo cuando se envía el formulario
elige :: ¿Qué es evento.target? :: El evento siguiente :: El elemento que causó el evento :: La página entera
elige :: Quieres reaccionar a cada letra que se escribe en un campo. ¿Qué evento usas? :: click :: submit :: input
escribe :: Explica con un ejemplo de la vida real qué hace addEventListener. :: Es como instalar un timbre: lo pones una vez y, cada vez que alguien toca, suena. addEventListener deja instalada una función que el navegador llama cada vez que pasa el evento.
```

## Parte 4. Formularios: leer, validar y responder

Un formulario junta lo que vimos: leer lo que escribió la persona, revisarlo y mostrar el resultado.

```js
const formulario = document.querySelector('#nuevo-gasto');
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();                               // 1) que la página NO se recargue
  const valor = Number(document.querySelector('#valor').value);  // 2) .value es TEXTO: se convierte
  if (!(valor > 0)) {                                    // 3) validar antes de usar
    document.querySelector('#error').textContent = 'El valor tiene que ser mayor que 0';
    return;
  }
  document.querySelector('#error').textContent = '';
  // 4) usar el dato (agregarlo a la lista, guardarlo…)
  formulario.reset();                                    // 5) limpiar el formulario
});
```

Tres trampas que casi todos pisan la primera vez:

1. **`preventDefault()`**: sin él, enviar un formulario recarga la página y se pierde todo.
2. **`.value` siempre es texto**, aunque el `input` sea `type="number"`. `'30' + '20'` da `'3020'`. Hay que convertir con `Number` (clase 45).
3. **Validar en la pantalla no alcanza** para cosas importantes: ayuda a la persona, pero un dato que importa lo revisa también el servidor (curso de seguridad).

> 🌎 **En la vida real:** es como la recepción de un hotel: recibes el formulario, revisas que esté completo antes de aceptarlo, y si falta algo se lo dices a la persona amablemente, sin tirar todo a la basura.

> 🌎 **Otro ejemplo:** `preventDefault` es como decirle al mesero "no retires el plato todavía": el comportamiento normal se frena para que tú decidas qué pasa.

> 🧩 **Piezas para este ejercicio**
> - Escucha `submit` en el formulario. `evento.preventDefault()` evita la navegación que normalmente sigue al envío.
> - Un campo numérico puede dar `NaN` cuando está vacío. Comprueba primero si el número es mayor que cero. Deja la escritura en la lista y `form.reset()` para después de esa comprobación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El formulario de nuevo gasto
lenguaje: html
pide: Al enviar el formulario (sin recargar la página): si el valor no es mayor que 0, escribe `El valor tiene que ser mayor que 0` en `#error` y no agregues nada. Si está bien, agrega un `<li>` a `#lista` con el texto `R$ 45.50` (dos decimales), borra el error y limpia el formulario.
--- código
<form id="nuevo-gasto">
  <input id="valor" type="number" step="0.01">
  <button>Agregar</button>
</form>
<p id="error"></p>
<ul id="lista"></ul>

<script>
  // tu código aquí
</script>
--- pruebas
const enviar = (v) => { $('#valor').value = v; $('#nuevo-gasto').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); };
prueba('un valor válido agrega una fila', () => { enviar('45.5'); igual(document.querySelectorAll('#lista li').length, 1); });
prueba('con dos decimales', () => igual($('#lista li').textContent, 'R$ 45.50'));
prueba('limpia el formulario', () => igual($('#valor').value, ''));
prueba('un valor 0 muestra el error y no agrega', () => { enviar('0'); igual([$('#error').textContent, document.querySelectorAll('#lista li').length], ['El valor tiene que ser mayor que 0', 1]); });
prueba('un valor válido borra el error', () => { enviar('10'); igual($('#error').textContent, ''); });
--- solución
<form id="nuevo-gasto">
  <input id="valor" type="number" step="0.01">
  <button>Agregar</button>
</form>
<p id="error"></p>
<ul id="lista"></ul>

<script>
  const formulario = document.querySelector('#nuevo-gasto');
  const error = document.querySelector('#error');
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const valor = Number(document.querySelector('#valor').value);
    if (!(valor > 0)) {
      error.textContent = 'El valor tiene que ser mayor que 0';
      return;
    }
    error.textContent = '';
    const item = document.createElement('li');
    item.textContent = `R$ ${valor.toFixed(2)}`;
    document.querySelector('#lista').append(item);
    formulario.reset();
  });
</script>
```

```practica
vf :: Sin preventDefault, enviar un formulario recarga la página
vf :: El value de un input type="number" ya es un número
elige :: La persona escribe 30 y 20 en dos campos y sumas los value. ¿Qué sale? :: 50 :: '3020' :: Un error
elige :: ¿Alcanza con validar un dato importante en la pantalla? :: Sí, siempre :: No: ayuda a la persona, pero lo importante lo revisa también el servidor :: Sí, si usas TypeScript
escribe :: Cuenta en orden qué hace un buen formulario cuando la persona lo envía. :: Frena la recarga con preventDefault, lee los valores y los convierte (value es texto), los valida y muestra un error claro si algo está mal, usa el dato (por ejemplo, lo agrega a la lista) y limpia el formulario.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es el DOM?":** "Es el árbol de objetos que el navegador arma a partir del HTML. JavaScript encuentra elementos con querySelector, cambia su texto con textContent, les pone o quita clases para que el CSS decida cómo se ven, crea elementos con createElement y responde a lo que hace la persona con addEventListener. En un formulario uso preventDefault, convierto el value porque siempre es texto, valido y muestro errores claros. Y nunca uso innerHTML con texto del usuario, por el XSS."

> 🌎 **En la vida real:** es como explicar cómo funciona un control remoto: qué botón cambia qué cosa en la pantalla, y qué pasa cuando alguien lo aprieta.

> 🌎 **Otro ejemplo:** Es como contar cómo atiendes una ventanilla: recibes, revisas, respondes y dejas todo listo para el siguiente.
