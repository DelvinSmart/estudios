# JavaScript + TypeScript 13: proyecto final, la web de gastos

> 🌎 **En la vida real:** después de aprender a usar cada herramienta por separado, el aprendiz de carpintero hace su primer mueble completo: mide, corta, arma, lija, pinta y lo entrega. Esta clase es tu primer mueble completo.

> 🎙️ **El profesor dice:** {{alumno}}, hoy construyes una web de verdad, **desde una carpeta vacía hasta publicada en internet**: anotar gastos del carro, ver el total de la semana, borrar, y que no se pierda nada al cerrar. Vas paso a paso: primero el plano, después el diseño, la lógica con pruebas, la pantalla, guardar, y publicar. Cada archivo tiene una sola tarea, como en la clase "El plano y la estructura", para que el código no se enrede. En cada parte hay un ejercicio que construye una pieza del proyecto.

**Lo que vas a construir:**

| Pieza | Archivo | Su única tarea |
|---|---|---|
| La página | `index.html` | La estructura: qué hay en la pantalla |
| El motor de diseño | `css/motor.css` | Los colores, formas y separaciones, en un solo lugar |
| Los estilos | `css/estilos.css` | Cómo se ve cada cosa, usando el motor |
| La lógica | `js/logica.js` | Las cuentas y las reglas, sin pantalla |
| Los datos | `js/datos.js` | Guardar y leer (el repositorio de la clase 83) |
| La pantalla | `js/pantalla.js` | Dibujar la lista y el total (el DOM de la clase 81) |
| El director | `js/app.js` | Junta las piezas y responde a lo que hace la persona |
| Las pruebas | `tests/logica.test.js` | Comprueban la lógica (como en la clase 53) |

## Parte 1. El plano: qué hace, qué no, y las puertas y ventanas

Antes de escribir código, el plano (la clase "El plano y la estructura" del curso de IA):

1. **El problema:** un conductor quiere anotar sus gastos del carro y saber cuánto gastó esta semana.
2. **Lo que hace:** anotar un gasto (tipo, valor, fecha); ver la lista; ver el total de la semana; borrar un gasto.
3. **Lo que NO hace (por ahora):** cuentas de usuario, varios carros, gráficos.
4. **Los datos:** cada gasto tiene `id`, `tipo` (combustible, lavado, peaje, mantenimiento u otro), `valor` y `fecha` (`AAAA-MM-DD`). Se guardan en el navegador.
5. **Las pantallas:** una sola: el formulario arriba, el total de la semana, y la lista.
6. **Las piezas:** la tabla de arriba.
7. **El orden:** diseño → lógica con pruebas → pantalla → guardar → publicar.
8. **Cómo sé que funciona:** anoto 3 gastos de esta semana y 1 de la pasada; el total muestra solo los 3; cierro y abro, y siguen ahí.

**Las puertas y ventanas** (lo que la IA, o uno, olvida si nadie lo dice):

| Caso | Qué hace la web |
|---|---|
| Todavía no hay gastos | Muestra "Todavía no anotaste gastos" en vez de una lista vacía |
| Valor vacío, 0 o negativo | No lo guarda y dice por qué |
| Fecha en el futuro | No la acepta |
| Tipo inventado | No lo acepta |
| El almacenamiento no está disponible | La web sigue funcionando (sin guardar) |
| Celular | Todo cabe en la pantalla, sin moverse de lado |

> 🌎 **En la vida real:** es como dibujar el mueble en un papel con las medidas antes de cortar la madera: si cortas primero, ya no hay vuelta.

> 🌎 **Otro ejemplo:** las puertas y ventanas son como revisar que la casa tenga entrada, luz y desagüe antes de mudarse: lo obvio que nadie dice, pero sin eso no se puede vivir.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las puertas y ventanas, en código
lenguaje: js
pide: `problemasDe(gasto, hoy)` revisa un gasto antes de guardarlo y devuelve la **lista de problemas** en español (vacía si está todo bien): `'El tipo no es válido'` si el tipo no está en `TIPOS`; `'El valor tiene que ser mayor que 0'`; `'La fecha no puede ser en el futuro'` si la fecha (texto ISO) es posterior a `hoy` (también texto ISO). Los textos ISO se pueden comparar con `>` directamente.
--- código
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

function problemasDe(gasto, hoy) {
  const problemas = [];
  // tu código aquí
  return problemas;
}
--- pruebas
const hoy = '2026-11-18';
prueba('un gasto correcto no tiene problemas', () => igual(problemasDe({ tipo: 'lavado', valor: 30, fecha: '2026-11-18' }, hoy), []));
prueba('tipo inventado', () => igual(problemasDe({ tipo: 'pizza', valor: 30, fecha: '2026-11-01' }, hoy), ['El tipo no es válido']));
prueba('valor 0', () => igual(problemasDe({ tipo: 'peaje', valor: 0, fecha: '2026-11-01' }, hoy), ['El valor tiene que ser mayor que 0']));
prueba('valor vacío (NaN)', () => igual(problemasDe({ tipo: 'peaje', valor: NaN, fecha: '2026-11-01' }, hoy), ['El valor tiene que ser mayor que 0']));
prueba('fecha en el futuro', () => igual(problemasDe({ tipo: 'otro', valor: 5, fecha: '2026-12-01' }, hoy), ['La fecha no puede ser en el futuro']));
prueba('varios problemas a la vez', () => igual(problemasDe({ tipo: 'x', valor: -1, fecha: '2027-01-01' }, hoy).length, 3));
--- solución
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

function problemasDe(gasto, hoy) {
  const problemas = [];
  if (!TIPOS.includes(gasto.tipo)) problemas.push('El tipo no es válido');
  if (!(gasto.valor > 0)) problemas.push('El valor tiene que ser mayor que 0');
  if (gasto.fecha > hoy) problemas.push('La fecha no puede ser en el futuro');
  return problemas;
}
```

```practica
vf :: Antes de escribir código, el plano dice qué hace la web y también qué NO hace por ahora
vf :: Qué se ve cuando todavía no hay gastos es un detalle que se puede dejar para después de publicar
elige :: ¿Por qué se pueden comparar fechas ISO como texto con >? :: Porque JavaScript las convierte solo :: Porque en AAAA-MM-DD el orden del texto es el mismo que el de las fechas :: No se pueden
elige :: ¿Qué archivo tiene la única tarea de guardar y leer? :: app.js :: pantalla.js :: datos.js
escribe :: Escribe tres "puertas y ventanas" de la web de gastos y qué hace la web en cada una. :: Sin gastos: muestra un mensaje en vez de una lista vacía. Valor 0 o negativo: no guarda y dice por qué. Almacenamiento no disponible: sigue funcionando sin guardar. (También: fecha en el futuro, tipo inventado, celular.)
```

## Parte 2. El diseño: el motor y la página

### La carpeta, desde cero

```bash
mkdir gastos-web && cd gastos-web
mkdir css js tests
touch index.html css/motor.css css/estilos.css js/logica.js js/datos.js js/pantalla.js js/app.js
```

`mkdir` crea carpetas y `touch` crea archivos vacíos (en la Mac y en Linux). Abre la carpeta en VS Code.

### css/motor.css: el motor de diseño

Todos los valores de diseño, **en un solo lugar**. El resto de los estilos los **llama** por su nombre con `var(--nombre)`; nunca escriben un color o un tamaño a mano.

```css
:root {
  /* Colores */
  --fondo: #0f141b;
  --tarjeta: #18212c;
  --texto: #e6edf3;
  --tenue: #8796aa;
  --acento: #7ee787;
  --peligro: #ff7b72;
  /* Forma */
  --borde: 1px solid #2b3644;
  --radio: 14px;
  /* Separaciones */
  --hueco: 14px;      /* entre bloques */
  --relleno: 16px;    /* dentro de las tarjetas */
  /* Letras */
  --letra: system-ui, sans-serif;
}
```

### index.html: la estructura

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gastos del carro</title>
  <link rel="stylesheet" href="css/motor.css">
  <link rel="stylesheet" href="css/estilos.css">
</head>
<body>
  <main class="app">
    <h1>Gastos del carro</h1>
    <form id="formulario" class="tarjeta">
      <select id="tipo">
        <option value="combustible">Combustible</option>
        <option value="lavado">Lavado</option>
        <option value="peaje">Peaje</option>
        <option value="mantenimiento">Mantenimiento</option>
        <option value="otro">Otro</option>
      </select>
      <input id="valor" type="number" step="0.01" placeholder="Valor" required>
      <input id="fecha" type="date" required>
      <button>Agregar</button>
      <p id="error" class="error"></p>
    </form>
    <p class="tarjeta">Esta semana: <strong id="total">R$ 0.00</strong></p>
    <ul id="lista" class="lista"></ul>
  </main>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- `meta viewport` hace que en el celular se vea a su tamaño (sin esto, se ve chiquito).
- `type="module"` deja usar `import` y `export` entre los archivos de `js/` (clase 50).

### css/estilos.css: cómo se ve, llamando al motor

```css
body { margin: 0; background: var(--fondo); color: var(--texto); font-family: var(--letra); }
.app { max-width: 560px; margin: 0 auto; padding: var(--hueco); display: flex; flex-direction: column; gap: var(--hueco); }
.tarjeta { background: var(--tarjeta); border: var(--borde); border-radius: var(--radio); padding: var(--relleno); }
.lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--hueco); }
.error { color: var(--peligro); margin: 0; }
```

Fíjate: **ni un color ni un tamaño escrito a mano**. Si mañana quieres el tema claro, cambias solo `motor.css`.

> 🌎 **En la vida real:** `motor.css` es la paleta de pinturas de un pintor: prepara los colores una vez y después moja el pincel ahí. No mezcla un azul nuevo para cada cuadro.

> 🌎 **Otro ejemplo:** `var(--relleno)` es como pedir "el tornillo número 8" en una ferretería: todos saben exactamente cuál es, sin medirlo cada vez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una tarjeta que llama al motor
lenguaje: html
pide: El motor ya está en `:root`. Escribe el estilo de `.tarjeta` **usando solo el motor** (`var(--…)`): fondo `--tarjeta`, borde `--borde`, esquinas `--radio` y relleno `--relleno`. Y `.app` con `gap` igual a `--hueco` entre sus hijos (ya es `flex`).
--- código
<style>
  :root {
    --tarjeta: #18212c;
    --borde: 1px solid #2b3644;
    --radio: 14px;
    --hueco: 14px;
    --relleno: 16px;
  }
  .app { display: flex; flex-direction: column; }
  .tarjeta {
    /* tu código aquí */
  }
</style>

<main class="app">
  <p class="tarjeta">Esta semana: <strong>R$ 180.00</strong></p>
  <p class="tarjeta">Combustible · R$ 150.00</p>
</main>
--- pruebas
prueba('el fondo viene del motor', () => igual(estilo('.tarjeta', 'background-color'), 'rgb(24, 33, 44)'));
prueba('el relleno viene del motor', () => igual(estilo('.tarjeta', 'padding-left'), '16px'));
prueba('las esquinas vienen del motor', () => igual(estilo('.tarjeta', 'border-top-left-radius'), '14px'));
prueba('el borde viene del motor', () => igual(estilo('.tarjeta', 'border-top-width'), '1px'));
prueba('el hueco entre tarjetas viene del motor', () => igual(estilo('.app', 'row-gap'), '14px'));
prueba('usa var(--…), no valores a mano', () => { const css = [...document.styleSheets].flatMap((h) => [...h.cssRules]).find((r) => r.selectorText === '.tarjeta')?.cssText || ''; ok(css.includes('var(--') && !/#[0-9a-f]{3,6}/i.test(css) && !/\d+px/.test(css), 'en .tarjeta hay valores escritos a mano'); });
--- solución
<style>
  :root {
    --tarjeta: #18212c;
    --borde: 1px solid #2b3644;
    --radio: 14px;
    --hueco: 14px;
    --relleno: 16px;
  }
  .app { display: flex; flex-direction: column; gap: var(--hueco); }
  .tarjeta {
    background: var(--tarjeta);
    border: var(--borde);
    border-radius: var(--radio);
    padding: var(--relleno);
  }
</style>

<main class="app">
  <p class="tarjeta">Esta semana: <strong>R$ 180.00</strong></p>
  <p class="tarjeta">Combustible · R$ 150.00</p>
</main>
```

```practica
vf :: En un buen proyecto, los estilos llaman a los valores del motor con var(--nombre) en vez de escribirlos a mano
vf :: La etiqueta meta viewport no hace falta para que la página se vea bien en el celular
elige :: ¿Qué deja hacer type="module" en la etiqueta script? :: Que la página cargue más rápido :: Usar import y export entre los archivos de js/ :: Que funcione sin internet
elige :: Quieres un tema claro para la web. ¿Qué cambias? :: Todos los archivos CSS :: Solo motor.css :: index.html
escribe :: Explica con un ejemplo de la vida real qué es un motor de diseño y cómo lo "llama" un elemento. :: Es como la paleta de un pintor: los colores se preparan una vez y después se moja el pincel ahí. En CSS, el motor define --tarjeta, --relleno y los demás en :root, y cada estilo los llama con var(--nombre) en vez de escribir el valor.
```

## Parte 3. La lógica, con sus pruebas

### js/logica.js

Todas las cuentas y reglas, **sin tocar la pantalla ni los datos**. Por eso se pueden probar solas.

```js
export const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];

export function problemasDe(gasto, hoy) {
  const problemas = [];
  if (!TIPOS.includes(gasto.tipo)) problemas.push('El tipo no es válido');
  if (!(gasto.valor > 0)) problemas.push('El valor tiene que ser mayor que 0');
  if (gasto.fecha > hoy) problemas.push('La fecha no puede ser en el futuro');
  return problemas;
}

export function lunesDe(textoFecha) {
  const [a, m, d] = textoFecha.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  fecha.setDate(fecha.getDate() - ((fecha.getDay() + 6) % 7));
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

export function totalDeLaSemana(gastos, hoy) {
  const desde = lunesDe(hoy);
  const suma = gastos
    .filter((g) => g.fecha >= desde && g.fecha <= hoy)
    .reduce((s, g) => s + g.valor, 0);
  return Math.round(suma * 100) / 100;
}

export const ordenarPorFecha = (gastos) => gastos.toSorted((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
```

### tests/logica.test.js

```bash
npm init -y
npm install -D vitest
```

```js
import { it, expect } from 'vitest';
import { problemasDe, totalDeLaSemana } from '../js/logica.js';

it('un gasto correcto no tiene problemas', () => {
  expect(problemasDe({ tipo: 'lavado', valor: 30, fecha: '2026-11-18' }, '2026-11-18')).toEqual([]);
});

it('el total de la semana deja afuera la semana pasada', () => {
  const gastos = [{ fecha: '2026-11-15', valor: 99 }, { fecha: '2026-11-16', valor: 20 }, { fecha: '2026-11-18', valor: 30 }];
  expect(totalDeLaSemana(gastos, '2026-11-18')).toBe(50);
});
```

En `package.json` agrega `"type": "module"` y el script `"test": "vitest run"`; después `npm test` (clase 53).

> 🌎 **En la vida real:** la lógica es la receta escrita: se puede probar cocinando una vez en la cocina de prueba antes de servirla a los clientes (la pantalla).

> 🌎 **Otro ejemplo:** es como la calculadora del taller: no le importa si el resultado se escribe en una pizarra o en un papel; solo hace bien la cuenta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El total de la semana y el orden de la lista
lenguaje: js
pide: Ya tienes `lunesDe` (devuelve el lunes en texto ISO). Completa `totalDeLaSemana(gastos, hoy)`: suma los gastos desde el lunes hasta hoy (comparando textos ISO) y redondea a 2 decimales. Y `ordenarPorFecha(gastos)`: una lista **nueva**, del más reciente al más viejo; si dos tienen la misma fecha, primero el de `id` mayor.
--- código
function lunesDe(textoFecha) {
  const [a, m, d] = textoFecha.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  fecha.setDate(fecha.getDate() - ((fecha.getDay() + 6) % 7));
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

function totalDeLaSemana(gastos, hoy) {
  // tu código aquí
}

function ordenarPorFecha(gastos) {
  // tu código aquí
}
--- pruebas
const gastos = [{ id: 1, fecha: '2026-11-15', valor: 99 }, { id: 2, fecha: '2026-11-16', valor: 20.1 }, { id: 3, fecha: '2026-11-18', valor: 30.2 }, { id: 4, fecha: '2026-11-18', valor: 5 }];
prueba('el lunes del 18 de noviembre es el 16', () => igual(lunesDe('2026-11-18'), '2026-11-16'));
prueba('el total deja afuera la semana pasada', () => igual(totalDeLaSemana(gastos, '2026-11-18'), 55.3));
prueba('sin gastos, el total es 0', () => igual(totalDeLaSemana([], '2026-11-18'), 0));
prueba('ordena del más reciente al más viejo', () => igual(ordenarPorFecha(gastos).map((g) => g.id), [4, 3, 2, 1]));
prueba('no cambia la lista original', () => { const copia = [...gastos]; ordenarPorFecha(gastos); igual(gastos, copia); });
--- solución
function lunesDe(textoFecha) {
  const [a, m, d] = textoFecha.split('-').map(Number);
  const fecha = new Date(a, m - 1, d);
  fecha.setDate(fecha.getDate() - ((fecha.getDay() + 6) % 7));
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

function totalDeLaSemana(gastos, hoy) {
  const desde = lunesDe(hoy);
  const suma = gastos
    .filter((g) => g.fecha >= desde && g.fecha <= hoy)
    .reduce((s, g) => s + g.valor, 0);
  return Math.round(suma * 100) / 100;
}

function ordenarPorFecha(gastos) {
  return gastos.toSorted((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
}
```

```practica
vf :: La lógica no toca la pantalla ni los datos, por eso se puede probar sola
vf :: Si el total sale con muchos decimales, conviene arreglarlo en la pantalla y no en la lógica
elige :: ¿Por qué ordenarPorFecha usa toSorted y no sort? :: Porque es más rápido :: Porque toSorted crea una lista nueva sin cambiar la original :: Porque sort no existe
elige :: ¿Qué hace el || en b.fecha.localeCompare(a.fecha) || b.id - a.id? :: Suma las dos cosas :: Si las fechas son iguales (da 0), desempata por id :: Elige al azar
escribe :: ¿Por qué conviene tener la lógica en su propio archivo con pruebas? :: Porque las cuentas y reglas se comprueban solas, sin abrir la página; si mañana cambia la pantalla o la forma de guardar, la lógica sigue igual y sus pruebas siguen diciendo si está bien.
```

## Parte 4. La pantalla: dibujar lo que dice la lógica

### js/pantalla.js

Solo **dibuja**: recibe los gastos y el total, y los pone en la página. No calcula ni guarda.

```js
const formatoDinero = (n) => `R$ ${n.toFixed(2)}`;

export function dibujarTotal(total) {
  document.querySelector('#total').textContent = formatoDinero(total);
}

export function dibujarLista(gastos, alBorrar) {
  const lista = document.querySelector('#lista');
  lista.replaceChildren();                                   // borra lo que había
  if (gastos.length === 0) {                                 // la "puerta" de la lista vacía
    const vacio = document.createElement('li');
    vacio.className = 'tarjeta vacio';
    vacio.textContent = 'Todavía no anotaste gastos.';
    lista.append(vacio);
    return;
  }
  for (const g of gastos) {
    const item = document.createElement('li');
    item.className = 'tarjeta fila';
    item.textContent = `${g.fecha} · ${g.tipo} · ${formatoDinero(g.valor)} `;
    const borrar = document.createElement('button');
    borrar.textContent = 'Borrar';
    borrar.addEventListener('click', () => alBorrar(g.id));  // la pantalla AVISA; quien borra es app.js
    item.append(borrar);
    lista.append(item);
  }
}

export function mostrarError(texto) {
  document.querySelector('#error').textContent = texto;
}
```

Fíjate en `alBorrar`: la pantalla **no sabe** borrar. Solo avisa "tocaron borrar en el gasto 3", y quien decide qué hacer es `app.js`. Así cada pieza tiene una sola tarea.

> 🌎 **En la vida real:** la pantalla es como el mesero: muestra el menú y te trae el plato, pero no cocina. Si pides algo, le avisa a la cocina.

> 🌎 **Otro ejemplo:** `replaceChildren()` es como borrar la pizarra antes de escribir el menú del día: si no la borras, se mezcla con el de ayer.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dibujar la lista, con su estado vacío
lenguaje: html
pide: Completa `dibujarLista(gastos, alBorrar)`. Sin gastos: un solo `li` con la clase `vacio` y el texto `Todavía no anotaste gastos.`. Con gastos: un `li` por gasto con el texto `2026-11-18 · lavado · R$ 30.00` y un botón **Borrar** que llama a `alBorrar(id)`. Cada vez que se dibuja, se borra lo anterior. Las pruebas llaman a tu función.
--- código
<ul id="lista"></ul>

<script>
  const formatoDinero = (n) => `R$ ${n.toFixed(2)}`;

  function dibujarLista(gastos, alBorrar) {
    const lista = document.querySelector('#lista');
    // tu código aquí
  }
</script>
--- pruebas
const textos = () => [...document.querySelectorAll('#lista li')].map((li) => li.firstChild.textContent.trim());
prueba('sin gastos muestra el mensaje', () => { dibujarLista([], () => {}); igual([document.querySelectorAll('#lista li').length, $('#lista li').classList.contains('vacio'), $('#lista li').textContent.trim()], [1, true, 'Todavía no anotaste gastos.']); });
prueba('un li por gasto con su texto', () => { dibujarLista([{ id: 1, fecha: '2026-11-18', tipo: 'lavado', valor: 30 }, { id: 2, fecha: '2026-11-17', tipo: 'peaje', valor: 8.5 }], () => {}); igual(textos(), ['2026-11-18 · lavado · R$ 30.00', '2026-11-17 · peaje · R$ 8.50']); });
prueba('dibujar otra vez no duplica', () => { dibujarLista([{ id: 1, fecha: '2026-11-18', tipo: 'lavado', valor: 30 }], () => {}); igual(document.querySelectorAll('#lista li').length, 1); });
prueba('el botón Borrar avisa el id', () => { let borrado = null; dibujarLista([{ id: 7, fecha: '2026-11-18', tipo: 'otro', valor: 1 }], (id) => { borrado = id; }); $('#lista li button').click(); igual(borrado, 7); });
--- solución
<ul id="lista"></ul>

<script>
  const formatoDinero = (n) => `R$ ${n.toFixed(2)}`;

  function dibujarLista(gastos, alBorrar) {
    const lista = document.querySelector('#lista');
    lista.replaceChildren();
    if (gastos.length === 0) {
      const vacio = document.createElement('li');
      vacio.className = 'vacio';
      vacio.textContent = 'Todavía no anotaste gastos.';
      lista.append(vacio);
      return;
    }
    for (const g of gastos) {
      const item = document.createElement('li');
      item.textContent = `${g.fecha} · ${g.tipo} · ${formatoDinero(g.valor)} `;
      const borrar = document.createElement('button');
      borrar.textContent = 'Borrar';
      borrar.addEventListener('click', () => alBorrar(g.id));
      item.append(borrar);
      lista.append(item);
    }
  }
</script>
```

```practica
vf :: En este proyecto, la pantalla dibuja pero no decide qué hacer al borrar: avisa con alBorrar
vf :: Si no se borra lo anterior antes de dibujar, la lista se ve bien igual
elige :: ¿Qué muestra la lista cuando todavía no hay gastos? :: Nada :: Un mensaje: "Todavía no anotaste gastos." :: Un error
elige :: ¿Por qué el texto de cada gasto se pone con textContent? :: Porque es más corto :: Porque así un texto raro no se interpreta como HTML (XSS) :: Porque innerHTML no existe
escribe :: Explica con un ejemplo de la vida real por qué la pantalla no debería borrar ni guardar datos. :: Porque es como el mesero: muestra y trae, pero no cocina. Si el mesero también cocinara, cada cambio en la cocina obligaría a cambiar al mesero. Separando, cada pieza cambia sin romper a las otras.
```

## Parte 5. Guardar y juntar todo

### js/datos.js

El repositorio de la clase 83, ahora con el `localStorage` de verdad:

```js
const LLAVE = 'gastos-del-carro';

function leer() {
  try {
    const lista = JSON.parse(localStorage.getItem(LLAVE) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];                       // sin almacenamiento o con datos rotos: lista vacía
  }
}

function guardar(lista) {
  try { localStorage.setItem(LLAVE, JSON.stringify(lista)); } catch (error) { /* sin almacenamiento: no se guarda */ }
}

export const listar = () => leer();

export function agregar(datos) {
  const lista = leer();
  const id = lista.reduce((mayor, g) => Math.max(mayor, g.id), 0) + 1;
  const nuevo = { ...datos, id };
  guardar([...lista, nuevo]);
  return nuevo;
}

export function borrar(id) {
  guardar(leer().filter((g) => g.id !== id));
}
```

### js/app.js: el director

Junta las piezas y responde a lo que hace la persona. Es el único que conoce a todos.

```js
import { problemasDe, totalDeLaSemana, ordenarPorFecha } from './logica.js';
import { listar, agregar, borrar } from './datos.js';
import { dibujarTotal, dibujarLista, mostrarError } from './pantalla.js';

const hoyISO = () => new Date().toLocaleDateString('sv');   // 'sv' da AAAA-MM-DD en la hora local

function refrescar() {
  const gastos = listar();
  dibujarTotal(totalDeLaSemana(gastos, hoyISO()));
  dibujarLista(ordenarPorFecha(gastos), (id) => { borrar(id); refrescar(); });
}

const formulario = document.querySelector('#formulario');
document.querySelector('#fecha').value = hoyISO();

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const gasto = {
    tipo: document.querySelector('#tipo').value,
    valor: Number(document.querySelector('#valor').value),
    fecha: document.querySelector('#fecha').value,
  };
  const problemas = problemasDe(gasto, hoyISO());
  if (problemas.length) { mostrarError(problemas.join('. ')); return; }
  mostrarError('');
  agregar(gasto);
  formulario.reset();
  document.querySelector('#fecha').value = hoyISO();
  refrescar();
});

refrescar();
```

El ciclo es siempre el mismo: **la persona hace algo → app.js pide a la lógica y a los datos → la pantalla se vuelve a dibujar**. Es la misma idea que usa React (y Copiloto) por dentro.

> 🌎 **En la vida real:** app.js es el jefe de cocina: recibe el pedido del mesero, le pide al depósito los ingredientes, sigue la receta y manda el plato. No pica la cebolla él mismo, pero sabe a quién pedírselo.

> 🌎 **Otro ejemplo:** el ciclo "acción → datos → redibujar" es como un marcador de fútbol: cada gol (acción) se anota (datos) y el tablero se actualiza (pantalla).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La app completa, con todas las piezas
lenguaje: html
pide: Todas las piezas ya están (aquí el almacén es de memoria, porque esta caja no tiene localStorage). Completa `refrescar()` (dibuja el total de la semana y la lista ordenada, y al borrar: borra y refresca) y el `submit` del formulario (sin recargar: arma el gasto, si hay problemas los muestra unidos con `'. '`, si no, borra el error, agrega, limpia el formulario y refresca). `HOY` es el 18 de noviembre de 2026.
--- código
<form id="formulario">
  <select id="tipo"><option value="combustible">Combustible</option><option value="lavado">Lavado</option><option value="peaje">Peaje</option></select>
  <input id="valor" type="number" step="0.01">
  <input id="fecha" value="2026-11-18">
  <button>Agregar</button>
  <p id="error"></p>
</form>
<p>Esta semana: <strong id="total">R$ 0.00</strong></p>
<ul id="lista"></ul>

<script>
  const HOY = '2026-11-18';
  // --- logica.js ---
  const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];
  const problemasDe = (g, hoy) => [!TIPOS.includes(g.tipo) && 'El tipo no es válido', !(g.valor > 0) && 'El valor tiene que ser mayor que 0', g.fecha > hoy && 'La fecha no puede ser en el futuro'].filter(Boolean);
  const totalDeLaSemana = (gastos) => Math.round(gastos.filter((g) => g.fecha >= '2026-11-16' && g.fecha <= HOY).reduce((s, g) => s + g.valor, 0) * 100) / 100;
  const ordenarPorFecha = (gastos) => gastos.toSorted((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  // --- datos.js (en memoria) ---
  let guardados = [];
  const listar = () => guardados;
  const agregar = (d) => { const nuevo = { ...d, id: guardados.reduce((m, g) => Math.max(m, g.id), 0) + 1 }; guardados = [...guardados, nuevo]; return nuevo; };
  const borrar = (id) => { guardados = guardados.filter((g) => g.id !== id); };
  // --- pantalla.js ---
  const dibujarTotal = (t) => { document.querySelector('#total').textContent = `R$ ${t.toFixed(2)}`; };
  const mostrarError = (t) => { document.querySelector('#error').textContent = t; };
  function dibujarLista(gastos, alBorrar) {
    const lista = document.querySelector('#lista');
    lista.replaceChildren();
    for (const g of gastos) {
      const li = document.createElement('li');
      li.textContent = `${g.fecha} · ${g.tipo} · R$ ${g.valor.toFixed(2)} `;
      const b = document.createElement('button');
      b.textContent = 'Borrar';
      b.addEventListener('click', () => alBorrar(g.id));
      li.append(b);
      lista.append(li);
    }
  }
  // --- app.js ---
  function refrescar() {
    // tu código aquí
  }

  const formulario = document.querySelector('#formulario');
  formulario.addEventListener('submit', (evento) => {
    // tu código aquí
  });

  refrescar();
</script>
--- pruebas
const anotar = (tipo, valor, fecha) => { $('#tipo').value = tipo; $('#valor').value = valor; $('#fecha').value = fecha; $('#formulario').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); };
prueba('anotar un gasto lo muestra y suma', () => { anotar('lavado', '30', '2026-11-18'); igual([document.querySelectorAll('#lista li').length, $('#total').textContent], [1, 'R$ 30.00']); });
prueba('un gasto de la semana pasada se lista pero no suma', () => { anotar('peaje', '8', '2026-11-10'); igual([document.querySelectorAll('#lista li').length, $('#total').textContent], [2, 'R$ 30.00']); });
prueba('el más reciente va primero', () => ok($('#lista li').textContent.startsWith('2026-11-18'), 'el primero no es el más reciente'));
prueba('un valor 0 muestra el error y no agrega', () => { anotar('lavado', '0', '2026-11-18'); igual([$('#error').textContent, document.querySelectorAll('#lista li').length], ['El valor tiene que ser mayor que 0', 2]); });
prueba('después de un gasto bueno, el error se borra', () => { anotar('combustible', '150', '2026-11-17'); igual([$('#error').textContent, $('#total').textContent], ['', 'R$ 180.00']); });
prueba('borrar quita el gasto y actualiza el total', () => { [...document.querySelectorAll('#lista li')].find((li) => li.textContent.includes('lavado')).querySelector('button').click(); igual([document.querySelectorAll('#lista li').length, $('#total').textContent], [2, 'R$ 150.00']); });
--- solución
<form id="formulario">
  <select id="tipo"><option value="combustible">Combustible</option><option value="lavado">Lavado</option><option value="peaje">Peaje</option></select>
  <input id="valor" type="number" step="0.01">
  <input id="fecha" value="2026-11-18">
  <button>Agregar</button>
  <p id="error"></p>
</form>
<p>Esta semana: <strong id="total">R$ 0.00</strong></p>
<ul id="lista"></ul>

<script>
  const HOY = '2026-11-18';
  const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];
  const problemasDe = (g, hoy) => [!TIPOS.includes(g.tipo) && 'El tipo no es válido', !(g.valor > 0) && 'El valor tiene que ser mayor que 0', g.fecha > hoy && 'La fecha no puede ser en el futuro'].filter(Boolean);
  const totalDeLaSemana = (gastos) => Math.round(gastos.filter((g) => g.fecha >= '2026-11-16' && g.fecha <= HOY).reduce((s, g) => s + g.valor, 0) * 100) / 100;
  const ordenarPorFecha = (gastos) => gastos.toSorted((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  let guardados = [];
  const listar = () => guardados;
  const agregar = (d) => { const nuevo = { ...d, id: guardados.reduce((m, g) => Math.max(m, g.id), 0) + 1 }; guardados = [...guardados, nuevo]; return nuevo; };
  const borrar = (id) => { guardados = guardados.filter((g) => g.id !== id); };
  const dibujarTotal = (t) => { document.querySelector('#total').textContent = `R$ ${t.toFixed(2)}`; };
  const mostrarError = (t) => { document.querySelector('#error').textContent = t; };
  function dibujarLista(gastos, alBorrar) {
    const lista = document.querySelector('#lista');
    lista.replaceChildren();
    for (const g of gastos) {
      const li = document.createElement('li');
      li.textContent = `${g.fecha} · ${g.tipo} · R$ ${g.valor.toFixed(2)} `;
      const b = document.createElement('button');
      b.textContent = 'Borrar';
      b.addEventListener('click', () => alBorrar(g.id));
      li.append(b);
      lista.append(li);
    }
  }

  function refrescar() {
    const gastos = listar();
    dibujarTotal(totalDeLaSemana(gastos));
    dibujarLista(ordenarPorFecha(gastos), (id) => { borrar(id); refrescar(); });
  }

  const formulario = document.querySelector('#formulario');
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const gasto = {
      tipo: document.querySelector('#tipo').value,
      valor: Number(document.querySelector('#valor').value),
      fecha: document.querySelector('#fecha').value,
    };
    const problemas = problemasDe(gasto, HOY);
    if (problemas.length) { mostrarError(problemas.join('. ')); return; }
    mostrarError('');
    agregar(gasto);
    formulario.reset();
    document.querySelector('#fecha').value = HOY;
    refrescar();
  });

  refrescar();
</script>
```

```practica
vf :: app.js es la única pieza que conoce a todas las demás
vf :: Después de agregar un gasto, hay que cambiar a mano cada parte de la pantalla
elige :: ¿Cuál es el ciclo de esta web? :: Pantalla → pantalla → pantalla :: La persona hace algo → app.js usa la lógica y los datos → se vuelve a dibujar :: Guardar → borrar → guardar
elige :: ¿Qué pasa si localStorage no está disponible? :: La web se rompe :: Sigue funcionando: leer da una lista vacía y guardar no hace nada :: Muestra un error en inglés
escribe :: Explica con un ejemplo de la vida real qué hace app.js. :: Es el jefe de cocina: recibe el pedido del mesero (la pantalla), pide los ingredientes al depósito (los datos), sigue la receta (la lógica) y manda el plato (vuelve a dibujar). No hace todo él, pero sabe a quién pedírselo.
```

## Parte 6. Probar en el celular y publicar en internet

### Verla en tu computadora

Los módulos (`type="module"`) **no funcionan abriendo el archivo con doble clic**: hace falta un servidor. Hay uno gratis que ya tienes:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. Para verla en tu celular (en el mismo Wi-Fi), busca la dirección de tu computadora (en la Mac: Ajustes → Wi-Fi → Detalles, algo como `192.168.0.12`) y abre `http://192.168.0.12:8000` en el teléfono.

### La lista de comprobación (antes de publicar)

1. `npm test`: todas las pruebas en verde.
2. Anota 3 gastos de esta semana y 1 de la semana pasada: el total suma solo los 3.
3. Intenta un valor 0, uno negativo y una fecha futura: no se guardan y dice por qué.
4. Cierra y vuelve a abrir: los gastos siguen ahí.
5. Borra uno: desaparece y el total cambia.
6. En el celular: todo cabe, sin moverse de lado.

### Publicar en GitHub Pages (gratis)

```bash
git init
git add .
git commit -m "Gastos del carro: primera versión"
```

1. En github.com, crea un repositorio nuevo llamado `gastos-web` (público, vacío).
2. Conecta y sube (GitHub te muestra estos comandos con tu usuario):

```bash
git remote add origin https://github.com/TU-USUARIO/gastos-web.git
git branch -M main
git push -u origin main
```

3. En el repositorio: **Settings → Pages → Branch: main / root → Save**.
4. En uno o dos minutos, tu web está en `https://TU-USUARIO.github.io/gastos-web/`. Ábrela en el celular y, en el menú del navegador, toca **"Agregar a pantalla de inicio"**: queda como un ícono más.

Agrega también un `.gitignore` con `node_modules/` para no subir las librerías (clase 06).

> 🌎 **En la vida real:** publicar es como abrir la tienda: antes revisas que todo funcione (la lista de comprobación), y después le das la dirección a todo el mundo.

> 🌎 **Otro ejemplo:** "agregar a pantalla de inicio" es como dejar un atajo en tu escritorio: no es una app de la tienda, pero se abre con un toque.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La dirección de tu web publicada
lenguaje: js
pide: `direccionDePages(usuario, repositorio)` devuelve la dirección donde GitHub Pages publica un repositorio: `https://usuario.github.io/repositorio/` (el usuario siempre en **minúsculas**, y con la barra al final). Si el repositorio se llama igual que `usuario.github.io`, la web queda en la raíz: `https://usuario.github.io/`.
--- código
function direccionDePages(usuario, repositorio) {
  // tu código aquí
}
--- pruebas
prueba('un repositorio normal', () => igual(direccionDePages('ana', 'gastos-web'), 'https://ana.github.io/gastos-web/'));
prueba('el usuario va en minúsculas', () => igual(direccionDePages('DelvinSmart', 'estudios'), 'https://delvinsmart.github.io/estudios/'));
prueba('el repositorio especial queda en la raíz', () => igual(direccionDePages('ana', 'ana.github.io'), 'https://ana.github.io/'));
--- solución
function direccionDePages(usuario, repositorio) {
  const u = usuario.toLowerCase();
  if (repositorio.toLowerCase() === `${u}.github.io`) return `https://${u}.github.io/`;
  return `https://${u}.github.io/${repositorio}/`;
}
```

```practica
vf :: Una web con type="module" se puede ver abriendo el archivo index.html con doble clic
vf :: GitHub Pages publica gratis una web estática desde un repositorio
elige :: ¿Qué va en el .gitignore de este proyecto? :: index.html :: node_modules/ :: css/
elige :: ¿Qué se hace ANTES de publicar? :: Nada :: La lista de comprobación: pruebas, los casos raros, cerrar y abrir, y el celular :: Borrar las pruebas
escribe :: Cuenta en orden cómo llevas la web de tu computadora a internet. :: La pruebo con python3 -m http.server y en el celular, paso la lista de comprobación, hago git init, add y commit, creo el repositorio en GitHub, lo conecto con git remote add y hago push, y activo GitHub Pages en Settings → Pages. En un par de minutos está en usuario.github.io/gastos-web.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué proyecto hiciste con JavaScript?":** "Una web de gastos del carro, desde cero hasta publicada en GitHub Pages. Primero hice el plano, con lo que hace, lo que no y los casos raros. La separé en piezas con una sola tarea: un motor de diseño en CSS con variables, la lógica pura con pruebas en Vitest, un repositorio que guarda en localStorage con try/catch, la pantalla que solo dibuja con el DOM, y un app.js que junta todo con el ciclo acción, datos, redibujar. Valido antes de guardar, muestro un estado vacío y uso textContent para no abrir la puerta al XSS. Si mañana quiero guardar en Firebase, solo cambio el repositorio."

> 🌎 **En la vida real:** es como mostrar tu primer mueble: el plano, por qué cortaste así cada pieza, cómo las uniste y cómo comprobaste que aguanta.

> 🌎 **Otro ejemplo:** Es como contar cómo abriste tu primer negocio: qué planeaste, cómo lo organizaste y qué revisaste antes de abrir la puerta.
