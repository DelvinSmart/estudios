# ¿Qué es un script y qué es una SPA?

> 🌎 **En la vida real:** ahora mismo, mientras lees esto, estás usando una **SPA** y varios **scripts**. Cada vez que tocaste una isla del mapa, un bombillo o el menú ☰, la página **no se recargó**: un script cambió lo que ves en un instante. Esta clase te explica qué pasa por dentro de la misma plataforma donde estudias.

> 🎙️ **El profesor dice:** ya viste HTML (la estructura), CSS (el diseño) y JavaScript (lo que se mueve). Hoy juntamos todo con dos palabras que vas a escuchar en cualquier trabajo: **script** y **SPA**. Y lo mejor: no son teoría lejana, son exactamente cómo está hecho este mapa de estudios. Al terminar, vas a poder explicar tu propia plataforma en una entrevista.

## Parte 1. La casa: estructura, pintura y electricidad

> 🌎 **En la vida real:** una página web es como una casa. El **HTML** son las paredes, las puertas y las ventanas (la estructura). El **CSS** es la pintura, los muebles y la decoración (cómo se ve). Y el **JavaScript** es la **electricidad y los mecanismos automáticos**: la luz que se prende al entrar, el portón que se abre con el control, la alarma.

> 🌎 **Otro ejemplo:** Es como un carro: la carrocería es el HTML, la pintura y los asientos son el CSS, y el motor con sus sensores es el JavaScript.

### Las tres capas de esta plataforma

| Capa | En una casa | En este mapa de estudios |
|---|---|---|
| HTML | Paredes y puertas | `index.html`: la barra de arriba, el lugar donde va cada pantalla |
| CSS | Pintura y muebles | `web/estilos.css`: los colores, las islas, la letra de código |
| JavaScript | Electricidad y mecanismos | `web/app.js` y los demás archivos de `web/`: dibujan cada pantalla y responden a tus toques |

Sin HTML no hay casa; sin CSS es una casa en obra gris; sin JavaScript es una casa sin luz: se puede mirar, pero no responde.

> 🌎 **En la vida real:** una casa sin electricidad tiene todo en su lugar, pero no se prende nada.

> 🌎 **Otro ejemplo:** Es como un televisor desenchufado: la pantalla está, pero no muestra nada.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La casa: estructura, pintura y electricidad
lenguaje: html
pide: Las tres capas en una página: la **estructura** (HTML: un `button` con `id="luz"` que dice **Prender**), la **pintura** (CSS: fondo amarillo `yellow` cuando el `body` tiene la clase `prendida`) y la **electricidad** (JavaScript: al hacer clic en el botón, se pone o se quita la clase `prendida` del `body`).
--- código
<style>
  /* la pintura */
</style>

<!-- la estructura -->

<script>
  // la electricidad
</script>
--- pruebas
prueba('el botón', () => igual($('#luz')?.textContent.trim(), 'Prender'));
prueba('al hacer clic, se prende', () => { $('#luz').click(); ok(document.body.classList.contains('prendida'), 'falta poner la clase prendida'); });
prueba('y se pinta de amarillo', () => igual(estilo('body', 'background-color'), 'rgb(255, 255, 0)'));
prueba('otro clic la apaga', () => { $('#luz').click(); ok(!document.body.classList.contains('prendida'), 'usa classList.toggle'); });
--- solución
<style>
  body.prendida { background: yellow; }
</style>

<button id="luz">Prender</button>

<script>
  document.querySelector('#luz').addEventListener('click', () => {
    document.body.classList.toggle('prendida');
  });
</script>
```

```practica
vf :: En la analogía de la casa, el CSS son las paredes y las puertas
vf :: El JavaScript es lo que hace que la página responda a lo que haces
elige :: ¿En qué archivo de esta plataforma están los colores y las islas? :: index.html :: web/estilos.css :: web/app.js
elige :: Una página con HTML y CSS pero sin JavaScript es como… :: Una casa sin paredes :: Una casa sin electricidad: se ve, pero no responde :: Una casa sin pintura
escribe :: Explica las tres capas de una página web con la analogía de la casa. :: El HTML es la estructura, como las paredes y las puertas; el CSS es cómo se ve, como la pintura y los muebles; y el JavaScript es la electricidad y los mecanismos que hacen que la casa responda.
```

## Parte 2. ¿Qué es un script?

> 🌎 **En la vida real:** un script es como el **guion de una obra de teatro**: una lista de instrucciones que alguien sigue en orden. Script significa "guion" en inglés.

> 🌎 **Otro ejemplo:** Es como la programación de un horno: "precalentar a 180°, esperar 10 minutos, avisar con un pitido".

### Instrucciones que se ejecutan solas

Un **script** es un archivo con instrucciones que un programa ejecuta **sin compilarlo antes**. En la web, el navegador lee el script y lo va ejecutando. En este mapa, el script principal se carga así, al final de `index.html`:

```html
<script type="module" src="web/app.js"></script>
```

`type="module"` dice que es un **módulo**: puede importar otros scripts (`web/vistas/mapas.js`, `web/menu.js`…), cada uno con su trabajo (lo viste en el Tema 50).

> 🌎 **En la vida real:** es como el instructivo pegado en la caja de un mueble: alguien lo sigue paso a paso.

> 🌎 **Otro ejemplo:** Es como la receta que sigue un cocinero sin cambiarla.

### Ejemplos de scripts que ya usas

- **En el navegador:** `web/voz.js` lee la clase en voz alta; `web/menu.js` abre el menú ☰; `web/practica.js` revisa tus prácticas.
- **En tu computadora (Node.js):** `firebase/generar-reglas.mjs` arma las reglas de seguridad; `firebase/separar-respuestas.mjs` guarda las respuestas aparte.
- **En la terminal:** los comandos de Git o un `.sh` como el que usa Copiloto para publicar (Tema 20) también son scripts.

Un script puede ser corto (tres líneas) o grande (miles): lo que lo hace "script" es que es una lista de instrucciones que se ejecuta.

> 🌎 **En la vida real:** son como los automatismos de una casa inteligente: "a las 7, abre las cortinas; si llueve, cierra las ventanas".

> 🌎 **Otro ejemplo:** Es como las alarmas programadas del celular: cada una hace algo a su hora.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un script es un guion
lenguaje: js
pide: Un script es una lista de instrucciones que se ejecuta **en orden**. Completa `correrGuion(guion)`: cada instrucción es `['sumar', n]`, `['restar', n]` o `['duplicar']`, y empiezan en 0. Devuelve el resultado final.
--- código
function correrGuion(guion) {
  // tu código aquí
}
--- pruebas
prueba('en orden', () => igual(correrGuion([['sumar', 5], ['duplicar'], ['restar', 3]]), 7));
prueba('el orden importa', () => igual(correrGuion([['duplicar'], ['sumar', 5], ['restar', 3]]), 2));
prueba('vacío', () => igual(correrGuion([]), 0));
--- solución
function correrGuion(guion) {
  let valor = 0;
  for (const [orden, n] of guion) {
    if (orden === 'sumar') valor += n;
    if (orden === 'restar') valor -= n;
    if (orden === 'duplicar') valor *= 2;
  }
  return valor;
}
```

```practica
vf :: Script significa "guion": una lista de instrucciones que se ejecuta en orden
vf :: Un script solo puede correr dentro del navegador
elige :: ¿Qué hace type="module" en la etiqueta script? :: Cambia el color :: Permite que el script importe otros scripts :: Lo esconde
elige :: ¿Cuál de estos es un script de este mapa que corre en tu computadora y no en el navegador? :: web/menu.js :: firebase/generar-reglas.mjs :: web/estilos.css
escribe :: Explica qué es un script con un ejemplo de la vida real y otro de esta plataforma. :: Es una lista de instrucciones que se ejecuta sola, como la programación de un horno; en esta plataforma, web/voz.js es un script que lee la clase en voz alta cuando tocas el botón.
```

## Parte 3. ¿Qué es una SPA?

> 🌎 **En la vida real:** imagina un teatro donde, para cada escena, todo el público tuviera que salir, volver a comprar la entrada y entrar de nuevo. Eso es una página **tradicional**. Una **SPA** es un teatro donde el público se queda sentado y solo **cambia el decorado** del escenario.

> 🌎 **Otro ejemplo:** Es como una pizarra: en vez de cambiar de salón para cada tema, el profesor borra y escribe en la misma pizarra.

### Una sola página que cambia por dentro

**SPA** significa *Single Page Application*: **aplicación de una sola página**. El navegador carga **una vez** el HTML, el CSS y los scripts; después, cuando vas a otra pantalla, **no pide una página nueva**: un script cambia solo la parte del medio.

Así funciona este mapa:

1. La dirección tiene un `#`: `#/clase/15/0/3`. Lo que va después del `#` dice **qué pantalla** mostrar.
2. Cuando cambia, el navegador avisa con el evento `hashchange`. **No recarga**.
3. El **enrutador** (la función `dibujar` de `web/app.js`) lee la dirección y llama a la pantalla que toca: el mapa, una clase, Mi progreso, el certificado.
4. Esa pantalla **descarga solo lo que necesita** (el `.md` de esa clase) y lo dibuja dentro de `<main id="app">`.

```js
window.addEventListener('hashchange', dibujar);   // "cuando cambie la dirección, redibuja"
```

La barra de arriba, el menú y los estilos **nunca se vuelven a cargar**: por eso no ves parpadeos.

> 🌎 **En la vida real:** es como una tienda donde el vendedor te trae cada producto al mostrador, en vez de mandarte a otra tienda para cada cosa.

> 🌎 **Otro ejemplo:** Es como cambiar de canal en la tele: el aparato es el mismo, cambia lo que se ve.

### Tradicional frente a SPA

| | Página tradicional | SPA (este mapa) |
|---|---|---|
| Al cambiar de pantalla | El navegador pide una página entera nueva | Un script cambia solo la parte del medio |
| Qué se descarga | Todo otra vez (HTML, CSS, scripts) | Solo los datos nuevos (el `.md` de la clase) |
| Se siente | Parpadea, espera | Instantáneo |
| El botón "atrás" | Funciona solo | Funciona porque cada pantalla tiene su dirección `#/…` |

> 🌎 **En la vida real:** la tradicional es mudarte de casa para cambiar de cuarto; la SPA es caminar de un cuarto a otro.

> 🌎 **Otro ejemplo:** Es como pedir un libro nuevo para cada capítulo frente a pasar la página.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una SPA de tres pantallas
lenguaje: html
pide: Haz una SPA: la página carga **una vez** y el script cambia solo `#pantalla` según lo que va después del `#`. Escribe `pintar()`: `#/` o vacío → `Inicio`; `#/clase/06` → `Clase 06`; otro → `No encontré esa página`. Llámala al cargar y en el evento `hashchange`.
--- código
<nav><a href="#/">Inicio</a> <a href="#/clase/06">Git</a></nav>
<main id="pantalla"></main>

<script>
  // tu código aquí
</script>
--- pruebas
const ir = (h) => { location.hash = h; window.dispatchEvent(new HashChangeEvent('hashchange')); };
prueba('empieza en Inicio', () => igual($('#pantalla').textContent.trim(), 'Inicio'));
prueba('una clase', () => { ir('#/clase/06'); igual($('#pantalla').textContent.trim(), 'Clase 06'); });
prueba('una que no existe', () => { ir('#/nada'); igual($('#pantalla').textContent.trim(), 'No encontré esa página'); });
prueba('volver al inicio', () => { ir('#/'); igual($('#pantalla').textContent.trim(), 'Inicio'); });
--- solución
<nav><a href="#/">Inicio</a> <a href="#/clase/06">Git</a></nav>
<main id="pantalla"></main>

<script>
  function pintar() {
    const partes = location.hash.replace(/^#\/?/, '').split('/');
    let texto = 'No encontré esa página';
    if (partes[0] === '') texto = 'Inicio';
    else if (partes[0] === 'clase' && partes[1]) texto = `Clase ${partes[1]}`;
    document.querySelector('#pantalla').textContent = texto;
  }
  pintar();
  window.addEventListener('hashchange', pintar);
</script>
```

```practica
vf :: En una SPA, el navegador carga la página una vez y después un script cambia solo la parte del medio
vf :: Cada vez que tocas una isla del mapa, el navegador descarga una página HTML entera nueva
elige :: ¿Qué evento avisa que cambió lo de después del #? :: click :: hashchange :: load
elige :: ¿Cómo se llama la función de este mapa que decide qué pantalla dibujar? :: pintar :: dibujar (el enrutador de web/app.js) :: mostrar
escribe :: Explica qué pasa, paso a paso, cuando tocas una clase en el mapa. :: Cambia la dirección después del # (por ejemplo #/clase/15), el navegador avisa con hashchange sin recargar, el enrutador lee la dirección y llama a la pantalla de la clase, que descarga solo su .md y lo dibuja en la parte del medio.
```

## Parte 4. ¿Por qué esta plataforma es una SPA?

> 🌎 **En la vida real:** un buen restaurante de comida rápida tiene todo preparado y solo arma el pedido: por eso es rápido. Esta plataforma tiene todo listo y solo "arma" la pantalla que pides.

> 🌎 **Otro ejemplo:** Es como una caja de herramientas abierta sobre la mesa: no vas al depósito por cada herramienta.

### Las ventajas

- **Velocidad:** después de la primera carga, cambiar de pantalla es casi instantáneo, porque no se recarga nada.
- **Menos datos:** solo se descarga el texto de la clase que abres, y queda guardado en memoria; si vuelves, ni siquiera se descarga otra vez. Ideal para estudiar desde el celular con pocos datos.
- **Funciona como una app:** la voz sigue leyendo, el menú ☰ y el botón "volver" están siempre ahí, y la barra de arriba muestra en qué parte del camino estás.
- **Gratis y simple de publicar:** como todo son archivos (HTML, CSS, JavaScript y `.md`), se publica gratis en **GitHub Pages**, sin un servidor propio (Tema 20).
- **Fácil de crecer:** para agregar una clase, se escribe su `.md` y se anota en el catálogo `web/cursos.js`; el mapa, el menú y las direcciones salen solos de ahí.

> 🌎 **En la vida real:** es como una casa con cableado bien planeado: agregar un enchufe nuevo no obliga a romper todas las paredes.

> 🌎 **Otro ejemplo:** Es como un celular: le agregas apps sin cambiar el teléfono.

### Lo que hay que cuidar

Una SPA tiene sus desafíos, y este mapa los resuelve así:
- **La primera carga** trae los scripts: por eso están divididos en módulos chicos.
- **Los buscadores (Google)** ven menos el contenido que dibuja JavaScript; para una plataforma de estudio no es un problema.
- **Todo lo que pasa en el navegador lo controla el usuario:** por eso lo importante (el progreso para el certificado, las respuestas de las prácticas) lo decide el **servidor** (Firebase), no el script (Tema 21).

> 🌎 **En la vida real:** hasta la mejor casa necesita una cerradura en la puerta: la SPA es la casa, Firebase es la cerradura.

> 🌎 **Otro ejemplo:** Es como un auto rápido: necesita buenos frenos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Cuánto se descarga?
lenguaje: js
pide: En una SPA se descargan los archivos de la página **una vez**, y después solo la lección que abres. En un sitio de muchas páginas, cada página trae todo otra vez. Completa `kbSPA(base, lecciones)` y `kbMuchasPaginas(base, lecciones)`: `base` es lo que pesan HTML+CSS+JS (en KB) y `lecciones` la lista de lo que pesa cada lección abierta.
--- código
function kbSPA(base, lecciones) {
  // tu código aquí
}

function kbMuchasPaginas(base, lecciones) {
  // tu código aquí
}
--- pruebas
prueba('SPA: la base una vez', () => igual(kbSPA(200, [10, 12, 8]), 230));
prueba('muchas páginas: la base cada vez', () => igual(kbMuchasPaginas(200, [10, 12, 8]), 630));
prueba('sin abrir nada', () => igual(kbSPA(200, []), 200));
--- solución
function kbSPA(base, lecciones) {
  return base + lecciones.reduce((s, k) => s + k, 0);
}

function kbMuchasPaginas(base, lecciones) {
  return lecciones.reduce((s, k) => s + base + k, 0) || base;
}
```

```practica
vf :: Esta plataforma se puede publicar gratis en GitHub Pages porque son solo archivos
vf :: En una SPA, lo que decide el script del navegador es imposible de cambiar por el usuario
elige :: ¿Por qué la plataforma gasta pocos datos en el celular? :: Porque no tiene imágenes :: Porque solo descarga el texto de la clase que abres y lo guarda en memoria :: Porque usa Python
elige :: ¿Dónde se anota una clase nueva para que aparezca en el mapa y en el menú? :: En cada pantalla a mano :: En el catálogo web/cursos.js :: En el CSS
escribe :: Un amigo te pregunta por qué tu plataforma es una SPA. ¿Qué le respondes? :: Porque carga una sola vez y después cambia de pantalla al instante sin recargar, descarga solo la clase que abro, funciona como una app, se publica gratis en GitHub Pages y crece agregando clases al catálogo; y lo importante, como el certificado, lo controla el servidor de Firebase.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es una SPA y cómo hiciste la tuya?":** "Una SPA es una aplicación de una sola página: el navegador carga una vez el HTML, el CSS y los scripts, y después JavaScript cambia solo la parte del medio sin recargar. En mi mapa de estudios, la dirección tiene un #, el evento hashchange avisa y un enrutador elige qué pantalla dibujar; cada pantalla descarga solo el Markdown de esa clase. Es rápida, gasta pocos datos, se publica gratis en GitHub Pages, y lo que tiene que ser confiable, como el certificado, lo controla Firebase."

> 🌎 **En la vida real:** es como explicar tu casa con orgullo: cómo está construida, por qué así y cómo la cuidas.

> 🌎 **Otro ejemplo:** Es como un arquitecto mostrando el plano de la casa que diseñó.
