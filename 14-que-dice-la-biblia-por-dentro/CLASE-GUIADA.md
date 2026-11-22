# ¿Qué dice la Biblia? por dentro

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. La [lección](LECCION.md) es el resumen, y [Para la entrevista](EXPLICACIONES-PARA-ENTREVISTA.md) tiene las frases cortas.

**Cómo estudiarla:** una parte por día. Abre al lado `SSD_Desarrollo/Developer/que-dice-la-biblia`. Esta clase cuenta **un solo día de mucho trabajo**, el 15 de noviembre de 2026: el nombre nuevo, los derechos, las fuentes, el griego, la Reina-Valera, la LBLA, el motor de diseño… y **todo lo que se intentó y no funcionó**.

**Lo que necesitas saber antes:** el Tema 12 (cómo está hecha la página) y los Temas 15 a 17.

## 1. El mapa del día

> 🎙️ **El profesor:** {{alumno}}, esta clase es como el diario de obra de una jornada larga. Pasaron muchas cosas en un día, así que primero te doy el mapa completo, y después vamos una por una.

| Qué | Dónde está |
|---|---|
| El nombre nuevo: **¿Qué dice la Biblia?** (O que diz a Bíblia?) | Todas las páginas y el repositorio `que-dice-la-biblia` |
| El aviso de derechos de la LBLA | `js/estudios.js` (`avisoLBLA`, `CREDITO_LBLA`) |
| Buscador, versículos ya copiados, medidor y "Leer capturas" en el panel | `js/biblia.js`, `js/panel-reusar.js`, `js/panel-medidor.js`, `js/panel-capturas.js` |
| Las fuentes de cada subpunto | `js/estudios.js` (`fuentesDePunto`) y `js/mapa.js` |
| El texto griego (SBLGNT) | `griego/sblgnt/` y `js/panel-editor.js` |
| Los pasajes cerrados como botoncitos | `js/estudios.js` (`puntoHTML`) y `js/mapa.js` (`abrirRecuadro`) |
| La Reina-Valera 1960 de Logos | `js/rvr.js` |
| La LBLA de Lockman | `js/mapa.js` (`abrirLBLA`, `medidasLBLA`) |
| El motor de diseño y el candado | `css/motor.css` y `scripts/revisar-diseno.mjs` |
| PDF claro y oscuro, botón de tema | `js/pdf.js`, `scripts/pdfs.sh`, `js/tema.js` |

**La idea que une todo** (la del Tema 12): el **contenido** vive en JSON y la **plantilla** lo dibuja. Casi todo lo de este día se hizo **en la plantilla, una sola vez**, y sirve para **todos** los estudios: Lenguas extrañas, Pastoras y los que vengan.

> 🌎 **En la vida real:** se mejoró **el molde** del pan una sola vez, y todos los panes salen mejor, sin tocar uno por uno.

> 🌎 **Otro ejemplo:** Como una lista de mejoras de un día en un taller: cambiamos el tablero, las luces y la radio, y cada cosa con el lugar del carro donde está.

> 📌 **Nota:** después del 15/11 siguieron los cambios (por ejemplo, una tarjeta "Reglas para la IA" en el panel y la portada a todo el ancho). La idea de fondo es la misma.

> 🧩 **Piezas para este ejercicio**
> - `.map(...)` transforma cada estudio en un resultado. La plantilla recibe un pasaje y el recorrido le pasa el pasaje del estudio actual.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cambiar en la plantilla, no en cada estudio
lenguaje: js
pide: Los estudios son datos; la plantilla los dibuja. Aquí cada estudio trae su propio HTML de pasaje, y cambiar el diseño obliga a tocar todos. Completa `pasajeHTML(pasaje)` (la plantilla: `<blockquote class="pasaje"><cite>REF</cite>TEXTO</blockquote>`) y `dibujarTodos(estudios)`, que usa la plantilla para el pasaje de cada estudio.
--- código
function pasajeHTML(pasaje) {
  // tu código aquí
}

function dibujarTodos(estudios) {
  // tu código aquí
}
--- pruebas
const estudios = [{ pasaje: { ref: '1 Co 14:2', texto: 'Porque el que habla en lenguas…' } }, { pasaje: { ref: 'Ef 5:22', texto: 'Las casadas…' } }];
prueba('la plantilla', () => igual(pasajeHTML(estudios[0].pasaje), '<blockquote class="pasaje"><cite>1 Co 14:2</cite>Porque el que habla en lenguas…</blockquote>'));
prueba('todos con la misma plantilla', () => igual(dibujarTodos(estudios).length, 2));
prueba('el segundo también', () => igual(dibujarTodos(estudios)[1], '<blockquote class="pasaje"><cite>Ef 5:22</cite>Las casadas…</blockquote>'));
--- solución
function pasajeHTML(pasaje) {
  return `<blockquote class="pasaje"><cite>${pasaje.ref}</cite>${pasaje.texto}</blockquote>`;
}

function dibujarTodos(estudios) {
  return estudios.map((e) => pasajeHTML(e.pasaje));
}
```

```practica
elige :: Si se cambia cómo se ven los pasajes, ¿hay que editar cada estudio? :: Sí, uno por uno :: No: se cambia la plantilla y todos se ven igual :: Solo los nuevos
elige :: ¿En qué archivo está la Reina-Valera? :: `mapa.js` :: `rvr.js` :: `tema.js`
elige :: ¿En qué archivo se abre la LBLA de Lockman? :: `rvr.js` :: `mapa.js` (`abrirLBLA`) :: `pdf.js`
vf :: Casi todo lo de este día se hizo en la plantilla, una sola vez
```

> 🔁 **Repaso:** un día, diez cambios, casi todos en la plantilla. Contenido en JSON, plantilla que lo dibuja.

## 2. El nombre y una sola dirección

> 🎙️ **El profesor:** empezó con algo simple, el nombre. Pero trajo tres lecciones: renombrar, no complicar, y la caché.

> 🌎 **En la vida real:** Es como cambiar el nombre de tu negocio: actualizas el cartel, pero el local, los clientes y la historia siguen siendo los mismos.

> 🌎 **Otro ejemplo:** Es como cambiar tu número de teléfono: se lo avisas a todos una vez y usas uno solo, en vez de tener dos líneas con desvíos.

### Renombrar, no copiar

1. El título visible pasó de "Estudios Bíblicos" a **"¿Qué dice la Biblia?"**.
2. **El repositorio se renombró** (no se copió) de `estudios-biblicos` a `que-dice-la-biblia`. **El historial quedó entero**: 30 cambios.
3. La dirección pasó a ser `delvinsmart.github.io/que-dice-la-biblia/`.

**Renombrar** mantiene el mismo repositorio con toda su historia (Tema 06). **Copiar** crearía otro nuevo, sin historia.

> 🌎 **En la vida real:** cambiar el cartel de tu negocio, no abrir otro local con otro nombre.

> 🌎 **Otro ejemplo:** Como cambiarte el apellido en el registro civil: sigues siendo tú, con todos tus documentos anteriores.

### Lo que se intentó y se quitó

> 🌎 **En la vida real:** Es como poner un cartel de "nos mudamos" en el local viejo, y después decidir que es más simple tener una sola dirección y quitarlo.

> 🌎 **Otro ejemplo:** Es como tener dos números de teléfono con desvío: funciona, pero confunde. Decidiste uno solo.

Para no romper los links viejos, se crearon **redirecciones** (un repositorio vacío que mandaba a la dirección nueva). Tú decidiste que no: **"un solo link, una sola cosa, nada de redireccionar"**. Se borraron.

Para borrar un repositorio, la herramienta `gh` necesita un permiso especial (`delete_repo`). Lo diste con **un código de 8 letras** en `github.com/login/device`. **Ese código no llega al teléfono: lo muestra la terminal.** Eso confundió al principio.

### La caché de GitHub

GitHub Pages le dice al navegador que guarde cada página **10 minutos** (`cache-control: max-age=600`). Por eso a veces veías la versión **vieja** aunque ya estaba publicada. Dos soluciones:
- Para ti: recargar **sin caché**, con **Cmd + Shift + R**.
- Para todos: cada vez que cambia un CSS o un JS, se cambia su "versión" en el HTML: `styles.css?v=lbla12`. Para el navegador, `?v=lbla12` es **otro archivo**, así que no usa el viejo.

> 🌎 **En la vida real:** la caché es seguir leyendo el diario de la mañana aunque salió una edición nueva. `?v=lbla12` es ponerle "edición 12" en la tapa.

> 🌎 **Otro ejemplo:** Como el periódico que ya compraste: aunque salió una edición nueva, sigues con el viejo hasta que vas al kiosco por otro.

> 💡 **Idea:** este mismo mapa tuvo el problema de la caché cuando lo probamos (el CSS viejo seguía cargado). Es un problema de todos los días en la web.

> 🧩 **Piezas para este ejercicio**
> - Una expresión regular puede capturar partes con paréntesis. En `.replace(patrón, (coincidencia, grupo) => ...)`, el primer argumento es el texto completo encontrado y los siguientes son los grupos.
> - En un patrón, `\?` busca un signo `?` literal y `?` después de un grupo lo hace opcional. La bandera `g` permite cambiar todos los archivos encontrados.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Romper el caché con ?v=
lenguaje: js
pide: El navegador guarda `styles.css` y a veces muestra la versión vieja. El truco: cambiar el `?v=` cada vez que se publica. Completa `conVersion(html, version)`: a cada `href="algo.css"` o `src="algo.js"` le pone (o le reemplaza) `?v=version`.
--- código
function conVersion(html, version) {
  // tu código aquí
}
--- pruebas
prueba('pone la versión', () => igual(conVersion('<link href="styles.css">', 'lbla12'), '<link href="styles.css?v=lbla12">'));
prueba('reemplaza la vieja', () => igual(conVersion('<script src="mapa.js?v=lbla11"></script>', 'lbla12'), '<script src="mapa.js?v=lbla12"></script>'));
prueba('las imágenes no', () => igual(conVersion('<img src="foto.png">', 'x'), '<img src="foto.png">'));
--- solución
function conVersion(html, version) {
  return html.replace(/(href|src)="([^"?]+\.(css|js))(\?v=[^"]*)?"/g, (_, attr, archivo) => `${attr}="${archivo}?v=${version}"`);
}
```

```practica
elige :: ¿Qué diferencia hay entre renombrar un repositorio y copiarlo? :: Ninguna :: Renombrar mantiene el mismo repositorio con su historial; copiar crea otro :: Copiar mantiene el historial
elige :: ¿Por qué a veces la página se veía vieja aunque estaba publicada? :: Porque GitHub falló :: Porque el navegador guarda las páginas 10 minutos (caché) :: Porque el JSON estaba mal
elige :: ¿Para qué sirve el `?v=lbla12` en `styles.css?v=lbla12`? :: Para el idioma :: Para que el navegador lo trate como un archivo nuevo y no use el viejo :: Para el tema oscuro
vf :: El código de 8 letras de GitHub llega por SMS al teléfono
```

> 🔁 **Repaso:** renombrar (no copiar) conserva la historia; un solo link, sin redirecciones; la caché dura 10 minutos: Cmd + Shift + R o `?v=` nuevo.

## 3. Los derechos de la LBLA

> 🎙️ **El profesor:** ahora algo serio: **derechos de autor**. La LBLA (La Biblia de las Américas) tiene dueño: **Lockman**. Antes de usarla, se leyeron sus reglas en su página oficial.

> 🌎 **En la vida real:** Es como usar canciones en un video de YouTube: hay reglas de cuánto puedes usar y siempre con el crédito del autor.

> 🌎 **Otro ejemplo:** Es como citar un libro en una tesis: puedes citar partes, con la fuente, pero no copiar el libro entero.

Las reglas de Lockman:
- Se pueden citar **hasta 500 versículos** sin pedir permiso.
- **Sin** citar un libro completo.
- Los versículos **no pueden pasar del 25 %** del texto del estudio.
- En una página web hay que poner el **aviso completo** con un link a `www.LBLA.com`.

### Cómo lo cumple la página, sola

La plantilla mira la referencia de cada pasaje. Si termina en "LBLA", pone **sola** un crédito corto debajo del pasaje y el aviso completo al final del estudio y del PDF:

```js
const esLBLA = ref => /\bLBLA\b/.test(ref || "");
```

Leída: "`esLBLA` recibe una referencia y devuelve **sí** si contiene la palabra **LBLA** suelta". La expresión regular `/\bLBLA\b/` busca "LBLA" como palabra entera (`\b` = borde de palabra). `ref || ""` = "si no hay referencia, usa un texto vacío" (para no dar error).

**Lo importante:** **nadie tiene que acordarse** de poner el aviso. Lo pone la plantilla.

> 🌎 **En la vida real:** las reglas para usar fotos de un fotógrafo: "hasta 500, no todo el álbum, no más de un cuarto de tu revista, y siempre con mi nombre". Y una impresora que **siempre** imprime el pie de página.

> 🌎 **Otro ejemplo:** Como una imprenta que siempre pone el pie de página con el copyright: el autor no tiene que acordarse.

> 🧩 **Piezas para este ejercicio**
> - `.trim().endsWith('LBLA')` ignora los espacios de las puntas y comprueba el final. Si el campo falta, usa un texto vacío antes de llamar a esos métodos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Lleva el aviso de la LBLA?
lenguaje: js
pide: La página pone sola el aviso de derechos cuando un pasaje es de la LBLA: lo sabe porque la referencia **termina en `LBLA`**. Completa `necesitaAviso(estudio)`: `true` si algún pasaje de algún bloque tiene una referencia así. Ojo: algunos pasajes no tienen referencia (usa `ref || ''`).
--- código
function necesitaAviso(estudio) {
  // tu código aquí
}
--- pruebas
prueba('con un pasaje LBLA', () => igual(necesitaAviso({ bloques: [{ tipo: 'pasaje', ref: '1 Ti 2:11-14 LBLA' }] }), true));
prueba('solo Reina-Valera', () => igual(necesitaAviso({ bloques: [{ tipo: 'pasaje', ref: 'Ef 5:22 RVR1960' }] }), false));
prueba('un pasaje sin referencia no rompe', () => igual(necesitaAviso({ bloques: [{ tipo: 'pasaje' }, { tipo: 'texto' }] }), false));
--- solución
function necesitaAviso(estudio) {
  return estudio.bloques.some((b) => (b.ref || '').trim().endsWith('LBLA'));
}
```

```practica
escribe :: ¿Cuántos versículos de la LBLA se pueden citar y con qué condiciones? :: Hasta 500, sin citar un libro completo, sin pasar del 25% del texto del estudio, y con el aviso completo y el link a LBLA.com.
elige :: ¿Cómo sabe la página que un pasaje es de la LBLA? :: Lo marca el autor a mano :: Porque la referencia contiene la palabra LBLA (`esLBLA`) :: Por el color
vf :: El autor tiene que acordarse de poner el aviso de la LBLA en cada estudio
elige :: ¿Qué hace `ref || ""`? :: Borra la referencia :: Si no hay referencia, usa un texto vacío para no dar error :: Une dos textos
```

> 🔁 **Repaso:** LBLA: hasta 500 versículos, sin libro completo, máximo 25 %, con aviso. La plantilla lo cumple sola con `esLBLA`.

## 4. Conseguir los versículos: lo que no se pudo y lo que sí

> 🎙️ **El profesor:** el sueño era que la página trajera **sola** el texto de la LBLA. Se probaron muchas ideas. Esta parte es valiosa justamente porque **la mayoría no se pudo**, y entender por qué es aprender a respetar reglas técnicas y legales.

| Idea | Qué pasó |
|---|---|
| **YouVersion Platform** (los de la app de la Biblia) | Creaste la cuenta de desarrollador. **No tiene la LBLA.** |
| **Una IA o Ollama** que escriba los versículos | No sirve: un modelo escribe lo que "le suena". Cambia palabras o mezcla versiones. |
| **Un programa que saque el texto** de Bible.com o de Lockman | Lockman **prohíbe por escrito** el *scraping*. Y el navegador no deja que una página lea las respuestas de otro sitio (la **política del mismo origen**; **CORS** es la forma en que un sitio da permiso, y Bible.com no lo da). |
| **Un robot que tome foto** de la página y copie el texto | Es lo mismo que el scraping, disfrazado. No. |
| **Mostrar Bible.com dentro** de la página | Bible.com no lo permite. |

Dos palabras importantes:
- **Scraping:** sacar el texto de una página con un programa. Si el dueño lo prohíbe, no se hace.
- **CORS:** una regla de seguridad del navegador: **una página no puede leer lo que hay en otra de otro dueño**, salvo que esa otra lo permita.

> 🌎 **En la vida real:** pedirle a alguien que te recite un contrato de memoria: te dice algo **parecido**, pero en un contrato cada palabra importa. Y el scraping es fotocopiar un libro que dice "prohibido fotocopiar"; CORS es el guardia que no te deja sacar el libro de la tienda.

> 🌎 **Otro ejemplo:** Como querer una película para ver en casa: no se graba del cine (prohibido); se compra o se alquila donde está permitido.

### Lo que sí se hizo

> 🌎 **En la vida real:** Es como no poder fotocopiar un libro, pero sí anotar la página exacta para que cada uno lo lea en la biblioteca.

> 🌎 **Otro ejemplo:** Es como el que trae su propia comida a una reunión: la trae él, nadie la saca de la heladera de otro.

1. **Buscador:** escoges libro, capítulo y versículos, y "Abrir en la Biblia" abre el pasaje exacto en Bible.com. La dirección se arma sola: `bible.com/bible/89/1TI.2.11-14.LBLA` (el 89 es la LBLA).
2. **Versículos ya copiados:** si un versículo ya está en otro estudio, el panel lo **reutiliza** (`js/panel-reusar.js`).
3. **Leer capturas:** escoges muchas capturas de una app de la Biblia; el panel las lee **dentro del navegador** (Tesseract.js, Tema 12), reconoce el libro y el capítulo y pone cada versículo en su pasaje.
4. **La regla para las IAs** (en `AGENTS.md`): **ninguna IA escribe un versículo de memoria**; el texto lo trae el autor.

**¿Por qué una foto tuya sí y un robot no?** Con la foto, **tú** traes el texto, igual que al pegarlo. El robot entraría **él** a la página de otro.

> 💡 **Idea:** esta es la misma regla que sigo yo contigo: no copio texto con derechos de páginas web, y no "invento" lo que tiene que ser exacto (Tema 11, parte 14; Tema 19).

> 🧩 **Piezas para este ejercicio**
> - `CODIGOS[libro]` consulta el código con el nombre recibido. Separa la decisión sobre el versículo o rango de la construcción de la dirección.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La dirección exacta en Bible.com
lenguaje: js
pide: El buscador arma la dirección sola: `bible.com/bible/89/1TI.2.11-14.LBLA` (89 es la LBLA). Completa `enlaceBible(libro, capitulo, desde, hasta)` usando `CODIGOS` para el código del libro. Si `desde` y `hasta` son iguales, va un solo número.
--- código
const CODIGOS = { '1 Timoteo': '1TI', 'Efesios': 'EPH', '1 Corintios': '1CO' };

function enlaceBible(libro, capitulo, desde, hasta) {
  // tu código aquí
}
--- pruebas
prueba('un rango', () => igual(enlaceBible('1 Timoteo', 2, 11, 14), 'https://www.bible.com/bible/89/1TI.2.11-14.LBLA'));
prueba('un solo versículo', () => igual(enlaceBible('Efesios', 5, 22, 22), 'https://www.bible.com/bible/89/EPH.5.22.LBLA'));
--- solución
const CODIGOS = { '1 Timoteo': '1TI', 'Efesios': 'EPH', '1 Corintios': '1CO' };

function enlaceBible(libro, capitulo, desde, hasta) {
  const versos = desde === hasta ? `${desde}` : `${desde}-${hasta}`;
  return `https://www.bible.com/bible/89/${CODIGOS[libro]}.${capitulo}.${versos}.LBLA`;
}
```

```practica
elige :: ¿Por qué no sirve que una IA escriba los versículos? :: Porque es lenta :: Porque escribe lo que le suena: puede cambiar palabras o mezclar versiones :: Porque es cara
escribe :: ¿Qué es scraping y por qué no se hizo? :: Sacar el texto de una página con un programa; Lockman lo prohíbe por escrito y además el navegador no deja leer las respuestas de otro sitio (política del mismo origen; CORS es el permiso que ese sitio no da).
elige :: ¿Qué es CORS? :: Un formato de imagen :: Una regla del navegador que no deja que una página lea otra de otro dueño :: Un tipo de JSON
elige :: ¿Dónde se leen las capturas en "Leer capturas"? :: En un servidor :: Dentro del navegador, con Tesseract.js :: En Google
vf :: Con una foto tuya, eres tú quien trae el texto, igual que al pegarlo
```

> 🔁 **Repaso:** no se pudo traer la LBLA sola (no está en YouVersion, la IA inventa, el scraping está prohibido, CORS). Sí: buscador, reutilizar, leer tus capturas, y la regla de que ninguna IA escribe versículos.

## 5. El medidor de citas

> 🎙️ **El profesor:** para cumplir la regla del 25 %, no se confía en la memoria: se **mide**. Con un programa.

`js/panel-medidor.js` mide cada estudio:
- **Versículos:** cuenta los de cada pasaje **por su referencia** ("Efesios 5:22-25" son 4).
- **Porcentaje:** cuenta las **palabras** de los versículos y las de todo lo que escribiste (títulos, preguntas, textos, fuentes).
- **Si te pasas, Publicar no publica** y te dice cuántas palabras faltan.

**La cuenta:** para que la Biblia sea **como máximo el 25 %** (1 de cada 4), lo tuyo tiene que ser **las otras 3 partes**: al menos **3 veces** lo bíblico.

> 🌎 **En la vida real:** una pizza en 4 porciones: si la Biblia puede ser **una** porción como máximo, lo tuyo son las otras tres. Y el medidor es la balanza de la aerolínea: si te pasas de peso, no despacha.

> 🌎 **Otro ejemplo:** Como el límite de equipaje de mano: si te pasas, no te dejan subir hasta que saques algo.

**Lo que encontró:** Lenguas extrañas estaba en **25,3 %** (pasado). Con sus 34 fuentes bajó a **23,4 %**.

**Dónde quedó:** primero una fila grande arriba (quitaba espacio); después un recuadro fijo (estorbaba). Quedó como **un resumen pequeño** ("● 86/500 · 23,3 %") al lado de Publicar; al tocarlo se abre el detalle, y se esconde solo a los 8 segundos.

> ✋ **Para y piensa:** un estudio tiene 300 palabras bíblicas. ¿Cuántas palabras tuyas necesita, como mínimo?

<details>
<summary>Ver la respuesta</summary>

**900**: tres veces lo bíblico. Así el total es 1.200 y la Biblia es 300 de 1.200 = **25 %**.

</details>

> 🧩 **Piezas para este ejercicio**
> - `'Capítulo 5:22-25'.split(':')[1]` da `'22-25'`. Si separas por `'-'` y conviertes a números, puedes distinguir un versículo de un rango.
> - El rango incluye sus dos extremos. Para evaluar un límite porcentual, distingue la proporción real del entero que muestras en pantalla.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El medidor de citas
lenguaje: js
pide: La LBLA deja citar hasta **500 versículos**, y la Biblia no puede pasar del **25 %** del estudio. Completa `contarVersiculos(ref)` (`'Efesios 5:22-25'` son 4; `'Juan 3:16'` es 1) y `medir(refs, palabrasBiblia, palabrasTotal)`: devuelve `{ versiculos, porcentaje, puedePublicar }` (porcentaje entero).
--- código
function contarVersiculos(ref) {
  // tu código aquí
}

function medir(refs, palabrasBiblia, palabrasTotal) {
  // tu código aquí
}
--- pruebas
prueba('un rango', () => igual(contarVersiculos('Efesios 5:22-25'), 4));
prueba('uno solo', () => igual(contarVersiculos('Juan 3:16'), 1));
prueba('dentro del límite', () => igual(medir(['Efesios 5:22-25', 'Juan 3:16'], 200, 1000), { versiculos: 5, porcentaje: 20, puedePublicar: true }));
prueba('más del 25 %: no publica', () => igual(medir(['Juan 3:16'], 300, 1000).puedePublicar, false));
--- solución
function contarVersiculos(ref) {
  const versos = ref.split(':')[1];
  const [desde, hasta] = versos.split('-').map(Number);
  return hasta ? hasta - desde + 1 : 1;
}

function medir(refs, palabrasBiblia, palabrasTotal) {
  const versiculos = refs.reduce((s, r) => s + contarVersiculos(r), 0);
  const porcentaje = Math.round((palabrasBiblia / palabrasTotal) * 100);
  return { versiculos, porcentaje, puedePublicar: versiculos <= 500 && porcentaje <= 25 };
}
```

```practica
escribe :: ¿Qué dos cosas mide el medidor? :: Cuántos versículos hay (máximo 500) y qué porcentaje del estudio es texto bíblico (máximo 25%).
elige :: ¿Cuántos versículos son "Efesios 5:22-25"? :: 3 :: 4 :: 25
elige :: Para que la Biblia no pase del 25 %, lo tuyo tiene que ser… :: La mitad de lo bíblico :: Al menos 3 veces lo bíblico :: Igual a lo bíblico
vf :: Si el estudio pasa del 25 %, Publicar igual publica
```

> 🔁 **Repaso:** el medidor cuenta versículos (≤ 500) y porcentaje (≤ 25 %, o sea, lo tuyo ≥ 3 veces lo bíblico). Si te pasas, no publica.

## 6. Las fuentes

> 🎙️ **El profesor:** las fuentes son las **notas al pie**: de dónde salió cada dato (un léxico, un libro, un artículo), con un resumen y su link. Mira cómo se diseñó **dónde guardarlas**.

**Primera versión:** un bloque "Fuente" **dentro del texto** de cada subpunto. Se veía **demasiado lleno**.

**Cómo quedó:**
- **En el modelo (el JSON):** cada subpunto guarda sus fuentes **aparte del texto**, en `"fuentes": [...]`, al lado de `"bloques"`. Así, **si mueves el subpunto, sus fuentes se van con él**.
- **Al leer:** botoncitos al final del subpunto; al tocar uno se abre un recuadro con el resumen y el link.
- **En el mapa:** un último paso, **"Fuentes del estudio"**, con todas.
- **En el panel:** la sección "Fuentes del estudio".

> 🌎 **En la vida real:** pegar el ticket de compra **dentro de la caja** del producto: si mueves la caja, el ticket se va con ella.

> 🌎 **Otro ejemplo:** Como las notas al pie de un libro de historia: cada dato con su fuente, pegada a la página donde se usa.

### Verificar antes de poner

> 🌎 **En la vida real:** Es como el periodista que llama a la fuente antes de publicar: si no confirma, no sale.

> 🌎 **Otro ejemplo:** Es como revisar el ticket del supermercado antes de guardarlo: a veces descubres un producto cobrado que no llevaste.

Se pusieron **34 fuentes** en Lenguas extrañas, y **cada link se abrió** para ver que decía lo que el estudio afirma. Así se encontró **un error**: lo de "tardaban un año en subir la torre" **no está** en el Pirkei de-Rabbi Eliezer; está en otro libro, el **Sefer HaYashar**. Se corrigió.

Es el Tema 07 otra vez: **verificar antes de afirmar**.

> 🧩 **Piezas para este ejercicio**
> - Usa un `Set` para recordar las direcciones que ya viste. `.has(url)` comprueba si la conoces y `.add(url)` la registra.
> - `subpunto.fuentes ?? []` da una lista vacía cuando el campo falta. Conserva el orden agregando cada fuente al verla por primera vez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las fuentes viajan con su subpunto
lenguaje: js
pide: Las fuentes se guardan **dentro del subpunto** que las usa, para que nunca se separen. Completa `todasLasFuentes(estudio)`: junta las fuentes de todos los subpuntos, **sin repetir** el mismo `url`, en el orden en que aparecen.
--- código
function todasLasFuentes(estudio) {
  // tu código aquí
}
--- pruebas
const estudio = { puntos: [
  { subpuntos: [{ fuentes: [{ titulo: 'A', url: 'https://a' }] }, { fuentes: [] }] },
  { subpuntos: [{ fuentes: [{ titulo: 'B', url: 'https://b' }, { titulo: 'A otra vez', url: 'https://a' }] }] },
] };
prueba('sin repetir', () => igual(todasLasFuentes(estudio).map((f) => f.url), ['https://a', 'https://b']));
prueba('sin fuentes', () => igual(todasLasFuentes({ puntos: [] }), []));
--- solución
function todasLasFuentes(estudio) {
  const vistas = new Set();
  const lista = [];
  for (const p of estudio.puntos) for (const sp of p.subpuntos) for (const f of sp.fuentes ?? []) {
    if (!vistas.has(f.url)) { vistas.add(f.url); lista.push(f); }
  }
  return lista;
}
```

```practica
elige :: ¿Por qué las fuentes se guardan en el subpunto y no en una lista aparte? :: Porque es más corto :: Para que, si mueves el subpunto, sus fuentes se vayan con él :: Porque GitHub lo pide
elige :: ¿Qué error se encontró al revisar las fuentes? :: Un link roto :: Una frase atribuida al libro equivocado (era del Sefer HaYashar) :: Un versículo mal copiado
vf :: Se abrió cada link de las fuentes antes de publicarlas
```

> 🔁 **Repaso:** fuentes en el subpunto (`"fuentes"`, al lado de `"bloques"`), como botoncitos; y cada una verificada antes de publicar.

## 7. El texto griego (SBLGNT)

> 🎙️ **El profesor:** para el griego del Nuevo Testamento, otra vez la pregunta de los derechos: ¿qué texto **se puede publicar**?

| Texto | ¿Se puede publicar? |
|---|---|
| **Nestlé-Aland (NA28)** | **No**: tiene derechos, solo para uso personal o de estudio |
| **SBLGNT** | **Sí**: licencia **Creative Commons (CC BY 4.0)**, solo pide el crédito |

**CC BY 4.0** es una licencia libre: puedes usarlo y publicarlo, **solo** con el crédito.

**Cómo se guardó:** el Nuevo Testamento del SBLGNT (27 libros, 7.939 versículos) está **dentro de la página**, en `griego/sblgnt/`, **un archivo JSON por libro**: `{"capítulo": {"versículo": "texto"}}`. Se le quitaron los signos del aparato crítico (⸀ ⸂ ⸃) y nada más.

**Cómo se usa:** en las fuentes, "**+ Griego**" busca **solo** el pasaje del subpunto y trae el griego (por ejemplo, 7.5 → Marcos 16:17). Si un versículo no está en el texto crítico, lo dice (Hechos 8:37).

**¿Por qué el griego sí se trae solo y la LBLA no?** Porque el SBLGNT es **libre** y está **guardado dentro de la página**; la LBLA tiene derechos y no hay una fuente permitida para traerla.

> 🌎 **En la vida real:** una canción con derechos (NA28) contra una música libre de derechos (SBLGNT). Y tenerlo dentro de la página es tener la enciclopedia en tu estante.

> 🌎 **Otro ejemplo:** Como usar música libre de derechos en un video: la usas tranquilo, solo pones el crédito del músico.

> 🧩 **Piezas para este ejercicio**
> - `[desde, hasta = desde]` usa el inicio como final cuando solo se dio un versículo.
> - `datos[libro]?.[capitulo]` permite consultar el capítulo si existe el libro. Si falta algún nivel, devuelve `undefined` y puedes detener la búsqueda.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Buscar en el griego guardado en la página
lenguaje: js
pide: El SBLGNT vive dentro de la página: un JSON por libro, con capítulo → versículo → texto. Completa `griego(libro, ref)` para referencias como `'14:2'` o `'14:2-3'`: devuelve los textos de esos versículos unidos con un espacio, o `null` si falta alguno.
--- código
const SBLGNT = { '1CO': { '14': { '1': 'Διώκετε τὴν ἀγάπην,', '2': 'ὁ γὰρ λαλῶν γλώσσῃ', '3': 'ὁ δὲ προφητεύων' } } };

function griego(libro, ref) {
  // tu código aquí
}
--- pruebas
prueba('un versículo', () => igual(griego('1CO', '14:2'), 'ὁ γὰρ λαλῶν γλώσσῃ'));
prueba('un rango', () => igual(griego('1CO', '14:2-3'), 'ὁ γὰρ λαλῶν γλώσσῃ ὁ δὲ προφητεύων'));
prueba('uno que no está', () => igual(griego('1CO', '14:9'), null));
--- solución
const SBLGNT = { '1CO': { '14': { '1': 'Διώκετε τὴν ἀγάπην,', '2': 'ὁ γὰρ λαλῶν γλώσσῃ', '3': 'ὁ δὲ προφητεύων' } } };

function griego(libro, ref) {
  const [cap, versos] = ref.split(':');
  const [desde, hasta = desde] = versos.split('-').map(Number);
  const textos = [];
  for (let v = desde; v <= hasta; v++) {
    const t = SBLGNT[libro]?.[cap]?.[String(v)];
    if (t === undefined) return null;
    textos.push(t);
  }
  return textos.join(' ');
}
```

```practica
elige :: ¿Por qué se usó el SBLGNT y no el Nestlé-Aland? :: Porque es más nuevo :: Porque el SBLGNT tiene licencia libre (CC BY 4.0) y el NA28 tiene derechos :: Porque es más corto
elige :: ¿Cómo está guardado el griego? :: En un servidor de otro :: Dentro de la página, un JSON por libro :: En el PDF
escribe :: ¿Por qué el griego sí se puede traer solo y la LBLA no? :: Porque el SBLGNT es libre y está guardado dentro de la página; la LBLA tiene derechos y no hay una fuente permitida para traerla.
```

> 🔁 **Repaso:** SBLGNT (libre, CC BY) dentro de la página, un JSON por libro; NA28 no (derechos). "+ Griego" lo trae solo.

## 8. Los pasajes cerrados y los recuadros en orden

> 🎙️ **El profesor:** ahora el diseño de los pasajes, con un detalle de coordinación entre JavaScript y CSS muy fino.

**Antes:** cada pasaje se veía completo y ocupaba mucho.

**Ahora:** cada pasaje es un **botoncito** con su referencia, y adentro tiene dos botones pequeños: **LBLA** y **RVR 1960**. Los tres se abren **en el mismo lugar**, debajo.

> 🌎 **En la vida real:** un acordeón de un folleto: ves el título y lo abres si quieres leer.

> 🌎 **Otro ejemplo:** Como un menú de restaurante con fotos chiquitas: tocas la que te interesa y se agranda.

### El orden de los efectos

En `abrirRecuadro` (`js/mapa.js`): si había otro recuadro abierto, **primero se va con su efecto y recién después entra el nuevo**. Nunca hay dos a la vez:

```js
if (abiertos.length) setTimeout(mostrar, duracionCierre()); else mostrar();
```

Leída: "si hay recuadros abiertos, espera lo que dura el cierre y después muestra el nuevo; si no, muéstralo ya".

`duracionCierre()` **lee el tiempo del motor** (la variable CSS `--dur-200`). Así, el JavaScript **espera exactamente lo mismo** que dura el efecto en el CSS, y no hay un número escrito a mano en dos lugares (Tema 11: tokens).

> 🌎 **En la vida real:** la puerta giratoria del banco: no entra el siguiente hasta que salió el anterior. Y leer el tiempo del motor es que los dos bailarines escuchen **la misma música**.

> 🌎 **Otro ejemplo:** Como la fila de un baño de un solo lugar: entra el siguiente cuando sale el anterior.

**En el PDF** los pasajes salen **completos**, porque en papel no se puede tocar nada.

> 🧩 **Piezas para este ejercicio**
> - Los dos métodos pueden compartir una variable declarada afuera. `null` representa que no hay recuadro abierto. Si el id recibido coincide con el actual, vacía esa variable.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un solo recuadro abierto
lenguaje: js
pide: Si hay un recuadro abierto y tocas otro botón, el abierto se cierra y se abre el nuevo; si tocas el mismo, se cierra. Completa `crearRecuadros()` con `tocar(id)` y `abierto()` (el id abierto o `null`).
--- código
function crearRecuadros() {
  let actual = null;
  return {
    tocar(id) {
      // tu código aquí
    },
    abierto() {
      return actual;
    },
  };
}
--- pruebas
prueba('abre uno', () => { const r = crearRecuadros(); r.tocar('LBLA'); igual(r.abierto(), 'LBLA'); });
prueba('otro cierra el anterior', () => { const r = crearRecuadros(); r.tocar('LBLA'); r.tocar('griego'); igual(r.abierto(), 'griego'); });
prueba('el mismo lo cierra', () => { const r = crearRecuadros(); r.tocar('LBLA'); r.tocar('LBLA'); igual(r.abierto(), null); });
--- solución
function crearRecuadros() {
  let actual = null;
  return {
    tocar(id) {
      actual = actual === id ? null : id;
    },
    abierto() {
      return actual;
    },
  };
}
```

```practica
elige :: Hay un recuadro abierto y tocas otro botón. ¿Qué pasa? :: Se abren los dos :: El abierto se va con su efecto y después entra el nuevo :: No pasa nada
elige :: ¿Por qué el tiempo de espera se lee del motor y no se escribe en el JS? :: Por estética :: Para que el JS espere exactamente lo que dura el efecto en el CSS, sin valores a mano :: Porque es más rápido
vf :: En el PDF los pasajes salen cerrados, como botoncitos
```

> 🔁 **Repaso:** pasajes como botoncitos (con LBLA y RVR adentro). Un recuadro a la vez, con la espera leída del motor (`--dur-200`).

## 9. La Reina-Valera 1960 con Logos

> 🎙️ **El profesor:** esta parte es una clase de **optimización** en miniatura, como el Tema 11: medir, entender dónde se pierde el tiempo, y arreglar.

**Logos** tiene un servicio gratis, **Reftagger**, que muestra versículos en un globo. Tiene la **RVR 1960** con su licencia. **No** tiene la LBLA ni ninguna versión en portugués.

| Versión | Qué pasaba |
|---|---|
| 1. El globo de Logos al pasar el mouse | Salía **afuera**, gris, no con tu diseño |
| 2. El globo con nuestros colores | Seguía siendo un globo flotante |
| 3. Leer el globo escondido y poner el texto en el recuadro | Funcionaba, pero tardaba **0,5 s por versículo**, uno tras otro (el globo **espera a propósito** antes de aparecer) |
| 4. **Pedir cada versículo directo** al servicio, **todos a la vez** | **0,45 s** para 5 versículos |
| 5. Además, **adelantarlos** al abrir el subpunto | **0,02 s** al tocar el botón |

Tres ideas de velocidad, en orden: **quitar una espera innecesaria**, **hacer las cosas en paralelo** (como `Promise.all`, Tema 17) y **adelantarse** (cargar antes de que lo pidan).

> 🌎 **En la vida real:** el empleado que te hace esperar a propósito antes de cada producto (el globo); mandar la lista entera por WhatsApp (todos a la vez); y que la bolsa ya esté lista en la puerta antes de que llegues (adelantarlos).

> 🌎 **Otro ejemplo:** Como pedir el pedido entero de una vez y que ya esté embolsado cuando llegas, en vez de esperar producto por producto.

### JSONP

Logos responde con **JSONP**: en vez de `fetch`, se agrega un **`<script>`** cuya dirección es la del servicio, y ese script, al cargar, **llama a una función nuestra** con los datos. La dirección es como `reftagger.bibliacdn.com/bible/rvr60/1Timothy3.2`. Se comprobó con los 66 libros (Cantares se escribe "Song").

> 🌎 **En la vida real:** pedir una pizza diciendo "cuando llegue, toca el timbre que dice *tu nombre*": el repartidor (el `<script>`) llega y toca **tu** timbre (llama a tu función) con la pizza (los datos).

> 🌎 **Otro ejemplo:** Como dejar tu número de teléfono en un mostrador: cuando llega tu pedido, te llaman a ti con los datos.

**El riesgo:** ese servicio **no está documentado** para usarse así. Si Logos lo cambia, el botón dejaría de cargar. Es bueno decirlo en voz alta: es una **deuda técnica conocida**.

> 🧩 **Piezas para este ejercicio**
> - Un `Map` permite usar la referencia como clave. `.has(ref)` comprueba si ya la guardaste, aunque su valor sea vacío, y `.get(ref)` lee el valor.
> - El contador mide llamadas a `traer`. Devolver una respuesta ya guardada no suma un pedido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Guardar lo que ya se trajo
lenguaje: js
pide: La Reina-Valera tardaba porque se pedía cada vez. Completa `crearLector(traer)`: `leer(ref)` llama a `traer(ref)` solo la **primera** vez para cada referencia; las siguientes devuelve lo guardado. Cuenta los pedidos en `pedidos`.
--- código
function crearLector(traer) {
  const guardado = new Map();
  const lector = {
    pedidos: 0,
    leer(ref) {
      // tu código aquí
    },
  };
  return lector;
}
--- pruebas
prueba('trae la primera vez', () => { const l = crearLector((r) => 'texto de ' + r); igual(l.leer('Jn 3:16'), 'texto de Jn 3:16'); });
prueba('la segunda vez no pide', () => { const l = crearLector((r) => r); l.leer('a'); l.leer('a'); l.leer('b'); igual(l.pedidos, 2); });
--- solución
function crearLector(traer) {
  const guardado = new Map();
  const lector = {
    pedidos: 0,
    leer(ref) {
      if (!guardado.has(ref)) {
        guardado.set(ref, traer(ref));
        lector.pedidos++;
      }
      return guardado.get(ref);
    },
  };
  return lector;
}
```

```practica
escribe :: ¿Por qué tardaba antes y por qué ahora es casi instantáneo? :: Antes pasaba por el globo de Logos, que espera a propósito, y de a un versículo; ahora se piden directo, todos a la vez, y se adelantan al abrir el subpunto.
elige :: ¿Qué es JSONP, en pocas palabras? :: Un tipo de imagen :: Recibir datos de otro sitio con un `<script>` que llama a una función nuestra con los datos :: Un formato de PDF
elige :: ¿Cuánto tarda ahora al tocar el botón? :: 0,5 s :: 0,45 s :: 0,02 s
vf :: El servicio de Logos usado así está documentado y garantizado
```

> 🔁 **Repaso:** de 0,5 s por versículo a 0,02 s: quitar la espera, pedir todo en paralelo y adelantarse. JSONP = un script que llama a tu función. Riesgo: servicio no documentado.

## 10. La LBLA con Lockman (la más difícil)

> 🎙️ **El profesor:** la parte más ingeniosa del proyecto. Presta atención, porque es un gran ejemplo de **resolver un problema con una restricción fuerte**.

**La idea:** Lockman tiene su propia Biblia en línea, `bible.lockman.org`, y su página **sí se deja mostrar dentro de otra**, en un **iframe** (una ventana a otra página, dentro de la tuya). El texto **no se copia**: es la página de Lockman **dentro** de la tuya.

**Lo que NO se puede:** leer ni medir lo que hay dentro de esa ventana. El navegador lo bloquea (CORS, parte 4). **Todo lo demás se hizo calculando.**

> 🌎 **En la vida real:** colgar en tu pared una ventana que da a la casa del vecino: ves lo que hay, pero no puedes meter la mano ni medir sus muebles.

> 🌎 **Otro ejemplo:** Como un cuadro con vidrio en un museo: lo ves entero, pero no puedes tocarlo ni moverlo.

### El camino, paso a paso

> 🌎 **En la vida real:** Es como acomodar un cuadro en la pared: lo subes, lo bajas, lo achicas y lo centras, un ajuste a la vez, hasta que queda bien.

> 🌎 **Otro ejemplo:** Es como ajustar un espejo retrovisor: cada vuelta es un pequeño cambio, hasta ver justo lo que necesitas.

| Intento | Problema | Arreglo |
|---|---|---|
| Ventana grande sobre la página | "Grandísima" | Abrirla **en el lugar del pasaje** |
| Mostrar la página entera | Se veía todo | **Correrla hacia arriba** lo que mide su encabezado (327 px) |
| Letra de Lockman de 20 px | "Como con zoom" | **Achicarla al 80 %**: 16 px, como la nuestra |
| Pantalla ancha | Desde 645 px Lockman cambia de diseño y aparecía "in context" | Armarla **siempre angosta** (máximo 600 px) |
| Alto fijo | Versículos largos cortados, cortos con espacio de más | **Calcular el alto de cada versículo** |
| Un versículo por vez | Querías ver todo el pasaje | **Todos, uno debajo del otro** |
| Se movía por dentro | Se veía toda la página de Lockman | `pointer-events: none` y, como **Safari** igual lo movía, una **tapa transparente** encima |

### Cómo se calcula el alto (lo más ingenioso)

1. Se midió la página de Lockman: el recuadro de un versículo mide **62 px** (bordes y título) **+ 33 px por línea**.
2. No se puede leer el texto de Lockman, **pero sí tenemos el mismo versículo en la Reina-Valera** (Logos), que mide **casi lo mismo**.
3. Con su largo se calcula cuántas líneas ocupa: `líneas = (letras + 12) / letras por línea`.
4. **Calibración:** primero se usó **9,15 px por letra** y en el teléfono sobraba una línea. Se midieron **16 versículos reales en dos anchos (32 casos)** y salió **8,1 px por letra**. Con eso, de 32 casos solo 1 queda una línea corto ("Ver más" lo arregla). Se prefirió que **sobre** un poco antes que **cortar** el texto.

**Calibrar** es ajustar un número con **datos reales**, no con un solo ejemplo.

> 🌎 **En la vida real:** un sastre que no puede medir a una persona, pero sí a su **hermano gemelo**: mide al gemelo (la Reina-Valera) y con eso corta la tela. Y calibrar es ajustar la balanza de cocina pesando 32 cosas, no una manzana.

> 🌎 **Otro ejemplo:** Como un costurero que calcula cuánta tela hace falta mirando el talle de otra camisa del mismo modelo.

Todas las medidas están **en el motor**, con la fecha en que se midieron (`--lbla-encabezado`, `--lbla-tarjeta`, `--lbla-linea`, `--lbla-ancho-letra`…). Si Lockman cambia su página, se vuelven a medir y se cambian **solo ahí**.

> ✋ **Para y piensa:** ¿por qué se usa la Reina-Valera para calcular el alto de la LBLA?

<details>
<summary>Ver la respuesta</summary>

Porque **no se puede leer** el texto de Lockman (CORS), pero **sí** tenemos el mismo versículo en la Reina-Valera, que tiene casi el mismo largo. Es el "hermano gemelo".

</details>

> 🧩 **Piezas para este ejercicio**
> - `Math.floor(3.8)` baja a 3. Sirve para contar cuántas letras completas caben en una línea.
> - `Math.ceil(3.2)` sube a 4. Sirve porque una línea ocupada a medias también cuenta como línea.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Calibrar con datos reales
lenguaje: js
pide: Para saber cuánto mide el pasaje dentro del iframe de Lockman se **calibró** con medidas reales: cada línea mide 31 px, más 4 px de margen. Completa `alto(lineas)` y `lineasDe(texto, anchoPx)`: con letras de 8,1 px de ancho, cuántas líneas ocupa el texto (redondeando hacia arriba, mínimo 1).
--- código
const ALTO_LINEA = 31;
const MARGEN = 4;
const ANCHO_LETRA = 8.1;

function alto(lineas) {
  // tu código aquí
}

function lineasDe(texto, anchoPx) {
  // tu código aquí
}
--- pruebas
prueba('un versículo de 2 líneas mide 66 px', () => igual(alto(2), 66));
prueba('100 letras en 405 px son 2 líneas', () => igual(lineasDe('a'.repeat(100), 405), 2));
prueba('un texto corto, 1 línea', () => igual(lineasDe('Jesús lloró.', 405), 1));
prueba('vacío: 1 línea', () => igual(lineasDe('', 405), 1));
--- solución
const ALTO_LINEA = 31;
const MARGEN = 4;
const ANCHO_LETRA = 8.1;

function alto(lineas) {
  return lineas * ALTO_LINEA + MARGEN;
}

function lineasDe(texto, anchoPx) {
  const porLinea = Math.floor(anchoPx / ANCHO_LETRA);
  return Math.max(1, Math.ceil(texto.length / porLinea));
}
```

```practica
elige :: ¿Qué es un iframe? :: Una imagen :: Una ventana a otra página, dentro de la tuya :: Un tipo de letra
elige :: ¿Por qué no se puede leer lo que hay dentro del iframe de Lockman? :: Porque está vacío :: Porque el navegador lo bloquea: es de otro dueño (CORS) :: Porque es una foto
elige :: ¿Cuánto mide un versículo de 2 líneas, según las medidas de Lockman? :: 66 px :: 128 px :: 95 px
escribe :: ¿Qué es calibrar y qué se calibró? :: Ajustar un número con datos reales; se midió el ancho de letra con 32 casos y salió 8,1 px en vez de 9,15.
elige :: ¿Por qué hizo falta una tapa transparente si ya estaba `pointer-events: none`? :: Por diseño :: Porque Safari igual dejaba mover el contenido del iframe :: Porque Chrome lo pedía
```

> 🔁 **Repaso:** iframe de Lockman (sin copiar texto); no se puede medir adentro, así que se calcula con el "gemelo" de la Reina-Valera; calibrado con 32 casos (8,1 px); medidas en el motor; tapa transparente por Safari.

## 11. El motor de diseño y el candado

> 🎙️ **El profesor:** el mismo concepto que viste en la app (Tema 11) y en la web (Tema 13), ahora en tu página de estudios.

> 🌎 **En la vida real:** Es como tener todas las medidas de una casa en un solo plano: si el arquitecto cambia una, la cambia ahí y todos los albañiles la siguen.

> 🌎 **Otro ejemplo:** Es como el diapasón que afina todos los instrumentos de una orquesta: una sola nota de referencia para todos.

**Antes:** los colores estaban en un archivo, pero **unos 770 valores** (tamaños, espacios, tiempos, sombras) estaban **escritos a mano** en todos lados.

**Ahora:**
- **`css/motor.css`**: **todos** los valores, para la página, el panel y el PDF. Las demás hojas solo usan `var(--nombre)`.
- **`scripts/revisar-diseno.mjs`** (el candado): antes de armar el sitio busca colores (`#hex`, `rgb`), curvas (`cubic-bezier`) y números con unidad (`px`, `s`, `ms`…) escritos **fuera** del motor. Si encuentra uno, **no se publica** y dice la línea.
- **Excepción:** los `@media` llevan números, porque **CSS no deja usar variables ahí** (Tema 16).

### Cómo se comprobó que no cambió nada

Se comparó la página nueva con la publicada, **elemento por elemento**: más de **3.900 elementos, 0 diferencias**. Es un **refactor** (Tema 11): cambiar la estructura sin cambiar lo que se ve, y **comprobarlo**.

> 🌎 **En la vida real:** una casa con 770 enchufes de modelos distintos que pasa a tener **un solo catálogo**, con un inspector que revisa que no quede ninguno fuera. Y la comprobación es el juego de las 7 diferencias con 3.900 elementos: 0 diferencias.

> 🌎 **Otro ejemplo:** Como comparar dos fotos de una sala antes y después de reorganizar el mueble: si no se movió nada, la foto es idéntica.

> 🧩 **Piezas para este ejercicio**
> - `.split('\n')` separa el texto por líneas y `.trim()` quita espacios de las puntas. Después puedes descartar las líneas cuyo comienzo está permitido.
> - `\d+` reconoce uno o más dígitos. En una expresión regular, `|` permite probar un patrón u otro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El candado del CSS
lenguaje: js
pide: El candado busca valores escritos a mano fuera del motor. Completa `revisarCSS(css)`: devuelve las líneas (sin espacios en las puntas) que tienen un color `#…` o un número con `px`, **excepto** las que definen una variable (empiezan con `--`) y las de `@media`, que no pueden usar variables.
--- código
function revisarCSS(css) {
  // tu código aquí
}
--- pruebas
const css = `:root {
  --morado: #6f42c1;
  --hueco: 14px;
}
.punto { color: var(--morado); }
.titulo { margin: 12px; }
.nota { color: #333; }
@media (max-width: 600px) { }`;
prueba('encuentra los sueltos', () => igual(revisarCSS(css), ['.titulo { margin: 12px; }', '.nota { color: #333; }']));
prueba('todo con variables: nada', () => igual(revisarCSS('.a { gap: var(--hueco); }'), []));
--- solución
function revisarCSS(css) {
  return css
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => !l.startsWith('--') && !l.startsWith('@media'))
    .filter((l) => /#[0-9a-fA-F]{3,6}\b|\d+px/.test(l));
}
```

```practica
elige :: ¿Qué hace el candado y cuándo se ejecuta? :: Borra colores al publicar :: Busca valores escritos a mano fuera del motor antes de armar el sitio; si encuentra uno, no publica :: Cambia los colores de noche
elige :: ¿Cómo se comprobó que el cambio no movió nada del diseño? :: A ojo :: Comparando más de 3.900 elementos de la página nueva con la publicada: 0 diferencias :: Preguntando a un usuario
vf :: Los `@media` pueden usar variables CSS
```

> 🔁 **Repaso:** `motor.css` con todos los valores; el candado no deja publicar valores a mano; y 3.900 elementos comparados para probar que nada cambió.

## 12. PDF, tema, "nuevo" y otros detalles

> 🎙️ **El profesor:** cuatro detalles que hacen que una página se sienta cuidada.

| Qué | Cómo funciona |
|---|---|
| **PDF claro y oscuro** | `pdf.html?tema=claro` u `oscuro`; el script genera **dos archivos por estudio**. Claro = gris suave (no blanco), oscuro = azul muy oscuro (no negro) |
| **Botón de tema** en el pie del inicio | Por defecto, el del aparato. Si la persona escoge otro, se guarda en su aparato (`localStorage`) y vale en todas las páginas (`js/tema.js`, **en el `<head>`** para que no parpadee) |
| **"Nuevo" desaparece** cuando la persona abre el subpunto | Se recuerda por aparato. En el teléfono, el subpunto que se muestra solo al entrar **no cuenta**, porque queda fuera de la vista |
| **Links** sin `https://` | El panel se lo pone al salir del campo |

¿Por qué `tema.js` va **en el `<head>`**? Porque así se aplica **antes** de dibujar la página. Si fuera al final, la página aparecería un instante en el tema equivocado y después cambiaría: un **parpadeo**. (Este mapa hace lo mismo: mira el `<script>` del `<head>` de `index.html`.)

> 🌎 **En la vida real:** prender la luz antes de abrir la puerta. Y "nuevo" es la etiqueta de "no leído" de un correo: se quita cuando lo abres.

> 🌎 **Otro ejemplo:** Como un auto con detalles de cortesía: la luz interior que se prende sola, el asiento que recuerda tu posición y el aviso de puerta abierta.

> 🧩 **Piezas para este ejercicio**
> - `Date.parse('2026-11-05')` devuelve un tiempo en milisegundos. La diferencia de dos fechas dividida por `86_400_000` da días.
> - Puedes comprobar primero si la persona ya abrió el estudio con `.includes(estudio.id)`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El "nuevo" que se quita
lenguaje: js
pide: Un estudio se marca **nuevo** si se publicó hace 14 días o menos, y la persona no lo abrió. Completa `esNuevo(estudio, hoy, abiertos)`: las fechas son textos `'AAAA-MM-DD'` y `abiertos` es la lista de ids que la persona ya abrió (guardada en `localStorage`).
--- código
function esNuevo(estudio, hoy, abiertos) {
  // tu código aquí
}
--- pruebas
prueba('publicado hace 3 días', () => igual(esNuevo({ id: 'a', fecha: '2026-11-15' }, '2026-11-18', []), true));
prueba('ya lo abrió', () => igual(esNuevo({ id: 'a', fecha: '2026-11-15' }, '2026-11-18', ['a']), false));
prueba('hace 14 días justos: todavía', () => igual(esNuevo({ id: 'a', fecha: '2026-11-04' }, '2026-11-18', []), true));
prueba('hace 15 días: ya no', () => igual(esNuevo({ id: 'a', fecha: '2026-11-03' }, '2026-11-18', []), false));
--- solución
function esNuevo(estudio, hoy, abiertos) {
  if (abiertos.includes(estudio.id)) return false;
  const dias = (Date.parse(hoy) - Date.parse(estudio.fecha)) / 86400000;
  return dias <= 14;
}
```

```practica
elige :: ¿Dónde se guarda el tema que escoge la persona? :: En GitHub :: En su aparato (`localStorage`) :: En el JSON
elige :: ¿Por qué `tema.js` va en el `<head>`? :: Por orden alfabético :: Para aplicar el tema antes de dibujar y que no parpadee :: Porque es obligatorio
elige :: ¿Por qué el "nuevo" no se quita en el teléfono al entrar? :: Por un error :: Porque en el teléfono el subpunto queda fuera de la vista y la persona todavía no lo vio :: Porque el teléfono no guarda nada
vf :: Se generan dos PDF por estudio: claro y oscuro
```

> 🔁 **Repaso:** PDF claro y oscuro; tema guardado en `localStorage` y aplicado en el `<head>`; "nuevo" solo se quita si se vio; links completados solos.

## 13. Todo lo que salió mal (y cómo se arregló)

> 🎙️ **El profesor:** el cuaderno de errores de la jornada. Léelo con atención: cada fila es una lección que vale para toda tu carrera.

| Qué pasó | Qué se aprendió |
|---|---|
| Se creyó que se podía traer la LBLA automática y no se pudo | Los permisos de citar **no** dan una fuente para traer el texto |
| Se te mandó a copiar uno por uno en la app | Las herramientas eran del **panel**, y Pastoras no estaba publicado: decir primero **dónde funciona** cada cosa |
| El código de 8 letras "no llegaba" | Lo muestra la **terminal**, no el teléfono |
| Se crearon redirecciones que no querías | **Preguntar antes** de crear cosas nuevas |
| El medidor ocupaba espacio | Lo importante a la vista; el detalle, al tocar |
| El PDF salió en negro y después en un tema que no era el tuyo | Dar a escoger: claro y oscuro |
| El globo de Logos tardaba | **Medir** dónde se pierde el tiempo antes de cambiar nada |
| Lockman en pantalla ancha mostraba "in context" | **Medir en varios anchos**: las páginas cambian de diseño |
| 9,15 px por letra estaba mal | **Calibrar con datos reales**, no con un solo ejemplo |
| Safari dejaba mover el recuadro | Cada navegador tiene sus defectos: **probar en el de la persona** |
| GitHub falló una vez al publicar | Era un error suyo: se vuelve a lanzar |

> 🌎 **En la vida real:** poder usar una canción no quiere decir que alguien te mande el archivo; antes de mandar a alguien a una tienda, asegúrate de que está abierta; una camisa puede quedar bien de frente y mal de costado; no se ajusta la balanza con una sola manzana.

> 🌎 **Otro ejemplo:** Como el cuaderno de errores de una obra: cada problema con lo que se aprendió, para no repetirlo.

> 🧩 **Piezas para este ejercicio**
> - Suma los anchos y las letras por separado. Si mediste 2 letras en una muestra y 10 en otra, la segunda aporta más letras al promedio.
> - `Math.round(valor * 10) / 10` redondea a un decimal.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Medir en vez de suponer
lenguaje: js
pide: Se suponía que cada letra medía 7 px, pero al medir salió 8,1. Completa `calibrar(medidas)`: recibe pares `{ letras, ancho }` medidos de verdad y devuelve el ancho promedio de una letra, con un decimal.
--- código
function calibrar(medidas) {
  // tu código aquí
}
--- pruebas
prueba('con medidas reales', () => igual(calibrar([{ letras: 10, ancho: 81 }, { letras: 20, ancho: 162 }]), 8.1));
prueba('redondea a un decimal', () => igual(calibrar([{ letras: 3, ancho: 25 }]), 8.3));
--- solución
function calibrar(medidas) {
  const letras = medidas.reduce((s, m) => s + m.letras, 0);
  const ancho = medidas.reduce((s, m) => s + m.ancho, 0);
  return Math.round((ancho / letras) * 10) / 10;
}
```

```practica
escribe :: Nombra dos cosas que se aprendieron midiendo en vez de suponer. :: Que el ancho de letra era 8,1 y no 9,15; que el tiempo se perdía en la espera del globo de Logos y no en la red; o que Lockman cambia de diseño desde 645 px.
elige :: ¿Por qué hay que probar en el navegador de la persona y no solo en uno? :: Porque es más lindo :: Porque cada navegador tiene sus defectos, como Safari con los iframes :: Porque todos son iguales
vf :: Tener permiso para citar la LBLA significa tener de dónde traer el texto automáticamente
```

> 🔁 **Repaso:** permiso no es fuente; decir dónde funciona cada cosa; preguntar antes de crear; medir, medir en varios anchos, calibrar con datos; probar en el navegador de la persona.

## Para la entrevista

> 🎙️ **El profesor:** de este día salen dos historias muy buenas. En voz alta.

> 🌎 **En la vida real:** Contar este día es como contar una jornada de taller difícil: qué se intentó, qué no funcionó y cómo se resolvió.

> 🎤 **Entrevista:** "Cuéntame un problema técnico difícil que resolviste."

<details>
<summary>Ver una buena respuesta</summary>

"Necesitaba mostrar versículos de una Biblia con derechos de autor sin copiar el texto. La única forma permitida era mostrar la página oficial dentro de un iframe, pero el navegador no deja medir lo que hay adentro. Entonces calculé el alto de cada versículo usando el mismo versículo en otra versión que sí puedo leer, con las medidas de la página oficial. Calibré el ancho de letra con 32 casos reales y quedó exacto en 31. Todas las medidas viven en el motor de diseño, para cambiarlas en un solo lugar si la página cambia."

</details>

> 🎤 **Entrevista:** "¿Cómo tratas los derechos de autor y la exactitud?"

<details>
<summary>Ver una buena respuesta</summary>

"Leí las reglas del dueño: hasta 500 versículos y no más del 25 % del texto. Hice que la plantilla ponga sola el aviso de derechos y un medidor que no deja publicar si te pasas. No uso scraping porque está prohibido, y ninguna IA escribe versículos de memoria: el texto lo trae el autor. Para el griego usé un texto con licencia libre."

</details>

```practica
escribe :: Cuenta en 3 frases cómo se mostró la LBLA sin copiarla. :: Se muestra la página oficial de Lockman dentro de un iframe, sin copiar el texto. Como no se puede medir lo de adentro, el alto se calcula con el mismo versículo en Reina-Valera y las medidas de Lockman, calibradas con 32 casos. Las medidas viven en el motor de diseño.
```

> 🔁 **Repaso final de la clase:** el mapa del día, el nombre y la caché, los derechos de la LBLA, lo que no se pudo y lo que sí, el medidor, las fuentes, el griego, los pasajes en orden, la Reina-Valera rápida, la LBLA calculada, el motor y el candado, los detalles y los errores aprendidos. Próxima: **Tema 18, Cómo hice mi mapa de estudios**.
