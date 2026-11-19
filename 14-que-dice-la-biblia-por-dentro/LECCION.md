# Lección 14: ¿Qué dice la Biblia? por dentro

> 🌎 **En la vida real:** como en la lección 12, esta clase trata de **cómo funciona la página por dentro** (derechos, fuentes, medidas, diseño), no del contenido de los estudios. Es el diario de obra de un día de mucho trabajo.

Este es el **Tema 14** del curso. Cuenta todo lo que se hizo el **15 de noviembre de 2026** en la página de estudios: el nombre nuevo, los derechos de la LBLA, las fuentes, el griego, el motor de diseño, la Reina-Valera de Logos, la LBLA de Lockman, y **todo lo que se intentó y no funcionó**. Estudia una parte por día. Abre el archivo del que habla cada parte (en `SSD_Desarrollo/Developer/que-dice-la-biblia`) y míralo mientras lees. Primero intenta responder las preguntas sin mirar. Las respuestas están al final.

Los ejemplos están simplificados para aprender. El código real puede verse un poco distinto.

---

## Parte 1. El mapa del día

> 🌎 **En la vida real:** es como la lista de tareas que deja un electricista al final de una jornada larga: "cambié el tablero, puse enchufes en la cocina, arreglé la luz del pasillo", con **en qué habitación** está cada cosa.
>
> La idea que une todo es la del **molde de pan**: se mejoró **el molde** una sola vez, y todos los panes (todos los estudios) salen mejor, sin tocar uno por uno.

> 🌎 **Otro ejemplo:** Como la lista de mejoras de un día en un taller: tablero, luces y radio, cada cosa con el lugar del carro donde está.

En un solo día la página cambió mucho. Este es el resumen:

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

**La idea que une todo:** el **contenido** (los estudios) vive en archivos JSON y la **plantilla** (HTML, CSS y JS) lo dibuja. Casi todo lo de hoy se hizo **en la plantilla, una sola vez**, y sirve para todos los estudios: Lenguas extrañas, Pastoras y los que vengan.

**Preguntas**
1. Si se cambia cómo se ven los pasajes, ¿hay que editar cada estudio? ¿Por qué?
2. ¿En qué archivo está la Reina-Valera y en cuál la LBLA?

---

## Parte 2. El nombre y una sola dirección

> 🌎 **En la vida real:** - **Renombrar vs. copiar**: es como cambiar el cartel de tu negocio en vez de abrir otro local con otro nombre. El local es el mismo, con toda su historia y sus clientes.
> - **Redirecciones**: era como dejar un cartel en la dirección vieja que dice "nos mudamos a la otra cuadra". Decidiste tener **una sola dirección** y nada más.
> - **El código de 8 letras**: es como el número de turno que te da la pantalla del banco: aparece **en la pantalla** (la terminal), no te llega por SMS.
> - **La caché**: es como cuando ya leíste el diario de la mañana y alguien te dice que salió una edición nueva: tú sigues con el viejo en la mano 10 minutos. **Cmd + Shift + R** es ir al kiosco a buscar el nuevo.
> - **`?v=lbla12`**: es como ponerle "edición 12" en la tapa: el kiosquero ve que es otra edición y no te da la vieja.

> 🌎 **Otro ejemplo:** Es como cambiar tu número de teléfono: se lo avisas a todos una vez y usas uno solo, en vez de dos líneas con desvíos. Y la caché es la foto vieja que no se actualiza hasta que deslizas para refrescar.

**Qué se hizo:**
1. El título visible pasó de "Estudios Bíblicos" a **"¿Qué dice la Biblia?"**.
2. **El repositorio se renombró** (no se copió) de `estudios-biblicos` a `que-dice-la-biblia`. El historial se quedó entero: 30 cambios.
3. La dirección pasó a ser `delvinsmart.github.io/que-dice-la-biblia/`.

**Lo que se intentó y se quitó:** para no romper los links viejos se creó un repositorio **vacío** llamado `estudios-biblicos` que solo redirigía a la dirección nueva, y se actualizó el de `lenguas-extranas` para lo mismo. Tú decidiste que no: **"un solo link, una sola cosa, nada de redireccionar"**. Se borraron los dos.

**Cómo se borraron:** con la herramienta `gh` de GitHub. Para borrar un repositorio, `gh` necesita un permiso especial (`delete_repo`). Tú lo diste con un código de 8 letras en `github.com/login/device`. **Ese código no llega al teléfono: lo muestra la terminal.** Eso confundió al principio.

**La caché de GitHub:** GitHub Pages le dice al navegador que guarde cada página **10 minutos** (`cache-control: max-age=600`). Por eso a veces veías la versión vieja. La solución es recargar sin caché: **Cmd + Shift + R**. Para que el navegador no use archivos viejos, cada vez que cambia un CSS o un JS se cambia su "versión" en el HTML (`styles.css?v=lbla12`).

**Preguntas**
3. ¿Qué diferencia hay entre renombrar un repositorio y copiarlo?
4. ¿Por qué a veces la página se veía vieja aunque ya estaba publicada?
5. ¿Para qué sirve el `?v=...` al final de `styles.css?v=lbla12`?

---

## Parte 3. Los derechos de la LBLA

> 🌎 **En la vida real:** es como las reglas para usar fotos de un fotógrafo profesional: "puedes usar hasta 500, no todo el álbum, que no sean más de una cuarta parte de tu revista, y siempre con mi nombre debajo".
>
> Lo importante es que el crédito lo pone **la plantilla sola**, como una impresora que siempre imprime el pie de página: nadie tiene que acordarse. `esLBLA` es como el empleado que mira la etiqueta de cada foto y, si dice "LBLA", le pega el crédito.

> 🌎 **Otro ejemplo:** Es como citar un libro en una tesis: puedes citar partes, con la fuente, pero no copiar el libro entero.

Lo comprobé en la página oficial de **Lockman**, los dueños de la LBLA:
- Se pueden citar **hasta 500 versículos** sin pedir permiso.
- **Sin** citar un libro completo.
- Los versículos **no pueden pasar del 25%** del texto del estudio.
- En una página web hay que poner el **aviso completo** con un link a `www.LBLA.com`.

**Cómo lo hace la página:** la plantilla mira la referencia de cada pasaje. Si termina en "LBLA", pone sola un crédito corto debajo del pasaje y el aviso completo al final del estudio y del PDF:

```js
const esLBLA = ref => /\bLBLA\b/.test(ref || "");
```

**Lo importante:** nadie tiene que acordarse de poner el aviso. Lo pone la plantilla.

**Preguntas**
6. ¿Cuántos versículos de la LBLA se pueden citar y con qué condiciones?
7. ¿Cómo sabe la página que un pasaje es de la LBLA?

---

## Parte 4. Conseguir los versículos: lo que no se pudo y lo que sí

> 🌎 **En la vida real:** - **YouVersion**: fuiste a la tienda y no tenían ese producto.
> - **Una IA de memoria**: es como pedirle a alguien que te recite de memoria un contrato: te dice algo **parecido**, pero en un contrato cada palabra importa.
> - **Scraping**: es como entrar a una librería y fotocopiar páginas de un libro que dice "prohibido fotocopiar". Y **CORS** es el guardia que no te deja sacar el libro de la tienda.
> - **El robot de fotos**: es lo mismo que fotocopiar, pero con otra máquina.
> - **Mostrar Bible.com adentro**: el dueño no deja que pongas su vidriera dentro de tu tienda.
>
> **Lo que sí**: el **buscador** es como darle al lector la **dirección exacta** de la biblioteca y el estante; **reutilizar** es usar la cita que ya habías copiado tú antes; **leer capturas** es como pasar tus propias fotos por el escáner de casa. La diferencia con el robot: con tus fotos, **tú** trajiste el libro; el robot entraría **a la casa de otro**.

> 🌎 **Otro ejemplo:** Como querer una película: no se graba en el cine (prohibido); se compra o se alquila donde está permitido.

**El sueño:** que la página traiga sola el texto de la LBLA. Esto es todo lo que se probó:

| Idea | Qué pasó |
|---|---|
| **YouVersion Platform** (el servicio de los de la app de la Biblia) | Creaste la cuenta de desarrollador. **No tiene la LBLA.** |
| **Una IA o Ollama** que escriba los versículos | No sirve: un modelo escribe lo que "le suena". Cambia palabras o mezcla versiones. |
| **Un programa que saque el texto** de Bible.com o de Lockman | Lockman **prohíbe por escrito** el *scraping* (sacar texto con programas). Además, el navegador no deja que una página lea las respuestas de otro sitio (la **política del mismo origen**; **CORS** es la forma en que un sitio da permiso, y Bible.com no lo da). |
| **Un robot que tome foto** de la página y copie el texto | Es lo mismo que el scraping, disfrazado. No. |
| **Mostrar Bible.com dentro** de la página | Bible.com no deja que otras páginas la muestren adentro. |
| Lockman dice que **las IAs pueden citar la LBLA** | Es cierto, pero mis reglas no me dejan copiar texto con derechos de páginas web. |

**Lo que sí se hizo:**
1. **Buscador:** escoges libro, capítulo y versículos y "Abrir en la Biblia" abre el pasaje exacto en Bible.com. La dirección se arma sola: `bible.com/bible/89/1TI.2.11-14.LBLA` (el 89 es la LBLA).
2. **Versículos ya copiados:** si un versículo ya está en otro estudio, el panel lo reutiliza (`js/panel-reusar.js`).
3. **Leer capturas:** escoges muchas capturas de una app de la Biblia; el panel las lee **dentro del navegador** (Tesseract.js), reconoce el libro y el capítulo del encabezado y pone cada versículo en su pasaje.
4. **La regla para las IAs** (`AGENTS.md`): ninguna IA escribe un versículo de memoria; el texto lo trae el autor.

**Por qué una foto tuya sí y un robot no:** con la foto, **tú** traes el texto, igual que al pegarlo. El robot entraría **él** a la página de otro.

**Preguntas**
8. ¿Por qué no sirve que una IA escriba los versículos?
9. ¿Qué es *scraping* y por qué no se hizo?
10. ¿Qué hace "Leer capturas" y dónde se leen las fotos?

---

## Parte 5. El medidor de citas

> 🌎 **En la vida real:** es como la **balanza de la aerolínea** antes de facturar: si la maleta pasa de 23 kg, no la despachan y te dicen cuánto sobra. Aquí, si las citas pasan del 25 %, **Publicar no publica** y te dice cuántas palabras faltan.
>
> La cuenta del 25 %: es como una pizza en 4 porciones. Si la Biblia puede ser **una** porción como máximo, lo tuyo tiene que ser las **otras tres**.
>
> Dónde quedó el medidor: como el indicador de batería del celular: un número chiquito siempre a la vista, y el detalle solo si lo tocas.

> 🌎 **Otro ejemplo:** Como el límite de equipaje de mano: si te pasas, no te dejan subir hasta que saques algo.

Para cumplir la regla de Lockman, el panel **mide** cada estudio (`js/panel-medidor.js`):
- **Versículos:** cuenta los de cada pasaje por su referencia ("Efesios 5:22-25" son 4).
- **Porcentaje:** cuenta las **palabras** de los versículos y las de todo lo que escribiste (títulos, preguntas, textos, fuentes). Para que la Biblia sea como máximo el 25%, lo tuyo tiene que ser al menos 3 veces lo bíblico.
- **Si te pasas, Publicar no publica** y te dice cuántas palabras faltan.

**Lo que encontró:** Lenguas extrañas estaba en **25,3%**. Con sus 34 fuentes bajó a **23,4%**.

**Dónde va:** primero era una fila grande arriba; te quitaba espacio. Después un recuadro fijo al lado de la vista previa; también estorbaba. Quedó así: un **resumen pequeño** ("● 86/500 · 23,3%") al lado de Publicar. Al tocarlo se abre el detalle con efecto, y se esconde solo a los 8 segundos, al tocar fuera o al escribir.

**Preguntas**
11. ¿Qué dos cosas mide el medidor?
12. ¿Por qué lo tuyo tiene que ser al menos 3 veces lo bíblico para no pasar del 25%?

---

## Parte 6. Las fuentes

> 🌎 **En la vida real:** las fuentes son como las **notas al pie** de un libro: de dónde salió cada dato.
> - Guardarlas **en el subpunto** es como pegar el ticket de compra **dentro de la caja** del producto: si mueves la caja, el ticket se va con ella.
> - Los **botoncitos** son como el "ver más" de una noticia: no te llenan la página.
> - **Verificar cada link** es como el periodista que llama a la fuente antes de publicar. Así se encontró que una frase estaba atribuida al libro equivocado, como citar a un autor por algo que en realidad dijo otro.

> 🌎 **Otro ejemplo:** Es como el periodista que llama a la fuente antes de publicar: si no confirma, no sale.

**Qué son:** de dónde salió cada dato (un léxico, un libro, un artículo), con un resumen y su link.

**Primera versión:** un bloque "Fuente" dentro del texto de cada subpunto. Se veía **demasiado lleno**.

**Cómo quedó:**
- En el **modelo**, cada subpunto guarda sus fuentes **aparte del texto**, en `"fuentes": [...]`, al lado de `"bloques"`. Así, si mueves el subpunto, sus fuentes se van con él.
- **Al leer:** botoncitos al final del subpunto; al tocar uno se abre un recuadro con el resumen y el link.
- **En el mapa:** un último paso, **"Fuentes del estudio"**, con todas. Ese paso es el cierre del mapa, por eso se le quitó el puntico final (si un estudio no tiene fuentes, el puntico vuelve).
- **En el panel:** la sección "Fuentes del estudio", debajo de "+ Punto".

**Verificar antes de poner:** se pusieron **34 fuentes** en Lenguas extrañas y **cada link se abrió** para ver que decía lo que el estudio afirma. Así se encontró un error: lo de "tardaban un año en subir la torre" **no está** en el Pirkei de-Rabbi Eliezer; está en otro libro, el **Sefer HaYashar**. Se corrigió la frase.

**Preguntas**
13. ¿Por qué las fuentes se guardan en el subpunto y no en una lista aparte del estudio?
14. ¿Qué error se encontró al revisar las fuentes?

---

## Parte 7. El texto griego (SBLGNT)

> 🌎 **En la vida real:** es como la diferencia entre una **canción con derechos** (no la puedes poner en tu video) y una **música libre de derechos** (la usas tranquilo, solo pones el crédito). El NA28 es la primera; el SBLGNT, la segunda.
>
> Guardarlo **dentro de la página**, un archivo por libro, es como tener la **enciclopedia en tu estante**: no dependes de nadie para consultarla. "+ Griego" es como un índice que va solo a la página correcta.

> 🌎 **Otro ejemplo:** Como usar música libre de derechos en un video: la usas tranquilo, solo pones el crédito del músico.

**Qué texto griego se puede publicar:**
| Texto | ¿Se puede? |
|---|---|
| **Nestlé-Aland (NA28)** | No: tiene derechos, solo para uso personal o de estudio |
| **SBLGNT** | **Sí:** licencia Creative Commons (CC BY 4.0), solo pide el crédito |

**Cómo se guardó:** el Nuevo Testamento del SBLGNT (27 libros, 7.939 versículos) está **dentro de la página**, en `griego/sblgnt/`, un archivo por libro: `{"capítulo": {"versículo": "texto"}}`. Se le quitaron los signos del aparato crítico (⸀ ⸂ ⸃) y nada más.

**Cómo se usa:** en las fuentes, "+ Griego" **busca solo** el pasaje del subpunto y trae el griego (por ejemplo, 7.5 → Marcos 16:17). Si un versículo no está en el texto crítico, lo dice (Hechos 8:37).

**Preguntas**
15. ¿Por qué se usó el SBLGNT y no el Nestlé-Aland?
16. ¿Por qué el griego sí se puede traer solo y la LBLA no?

---

## Parte 8. Los pasajes cerrados y los recuadros en orden

> 🌎 **En la vida real:** los pasajes cerrados son como un **acordeón** de un folleto: ves el título y lo abres si quieres leer.
>
> El orden de los efectos es como la **puerta giratoria** de un banco: no entra el siguiente hasta que salió el anterior. Nunca hay dos personas en el mismo compartimento.
>
> Leer el tiempo del motor (`--dur-200`) es como que los dos bailarines escuchen **la misma música**: si cada uno contara los tiempos por su cuenta, terminarían desfasados.
>
> En el PDF todo sale abierto, porque en un papel impreso no se puede "tocar para abrir".

> 🌎 **Otro ejemplo:** Como un menú de restaurante con fotos chiquitas: tocas la que te interesa y se agranda, y no se abren dos a la vez.

**Antes:** cada pasaje se veía completo y ocupaba mucho.

**Ahora:** cada pasaje es un **botoncito** con su referencia, y adentro tiene dos botones pequeños: **LBLA** y **RVR 1960**. Los tres (el pasaje, LBLA y RVR) se abren **en el mismo lugar**, debajo.

**El orden de los efectos** (`abrirRecuadro` en `js/mapa.js`): si había otro recuadro abierto, **primero se va con su efecto y recién después entra el nuevo**. Nunca hay dos a la vez:

```js
if (abiertos.length) setTimeout(mostrar, duracionCierre()); else mostrar();
```

`duracionCierre()` lee el tiempo del motor (`--dur-200`), así el JavaScript y el CSS esperan lo mismo.

**En el PDF** los pasajes salen completos, porque ahí no se puede tocar nada.

**Preguntas**
17. ¿Qué pasa si hay un recuadro abierto y tocas otro botón?
18. ¿Por qué el tiempo de espera se lee del motor y no se escribe en el JS?

---

## Parte 9. La Reina-Valera 1960 con Logos

> 🌎 **En la vida real:** la mejora de velocidad es como hacer las compras:
> 1. **El globo**: ir al mercado y que el empleado te haga esperar **a propósito** medio segundo antes de atender cada producto, uno por uno.
> 2. **Pedir directo, todos a la vez**: mandar la lista entera por WhatsApp y que te lo preparen todo junto.
> 3. **Adelantarlos**: que la bolsa ya esté lista en la puerta **antes** de que llegues.
>
> **JSONP**: es como pedir una pizza diciendo "cuando llegue, toque el timbre que dice *tu nombre*": el repartidor (el `<script>`) llega y toca **tu** timbre (llama a tu función) con la pizza (los datos).
>
> **El riesgo**: es usar la puerta de servicio de un local; funciona hoy, pero si la cambian de lugar, nadie te avisa.

> 🌎 **Otro ejemplo:** Como pedir el pedido entero de una vez y que ya esté embolsado cuando llegas, en vez de esperar producto por producto.

**Logos** tiene un servicio gratis, **Reftagger**, que muestra versículos en un globo. Tiene la RVR 1960 con su licencia. **No tiene la LBLA ni ninguna versión en portugués** (se probaron ARA, ARC, NVT, NAA, NTLH, ACF…).

**Cómo fue cambiando:**
| Versión | Qué pasaba |
|---|---|
| 1. El globo de Logos al pasar el mouse | Salía **afuera**, gris, y no con tu diseño |
| 2. El globo con nuestros colores | Seguía siendo un globo flotante |
| 3. Leer el globo escondido y poner el texto en el recuadro | Funcionaba, pero tardaba **0,5 segundos por versículo**, uno tras otro (el globo espera a propósito antes de aparecer) |
| 4. **Pedir cada versículo directo** al servicio de Logos, todos a la vez | **0,45 s** para 5 versículos |
| 5. Además, **adelantarlos** al abrir el subpunto | **0,02 s** al tocar el botón |

**Cómo se pide** (`js/rvr.js`): Logos responde con **JSONP**: un `<script>` que llama a una función nuestra con los datos. La dirección es `reftagger.bibliacdn.com/bible/rvr60/1Timothy3.2`. Se comprobó con los 66 libros (Cantares se escribe "Song").

**El riesgo:** ese servicio no está documentado para usarse así. Si Logos lo cambia, el botón dejaría de cargar.

**Preguntas**
19. ¿Por qué tardaba antes y por qué ahora es casi instantáneo?
20. ¿Qué es JSONP, en pocas palabras?

---

## Parte 10. La LBLA con Lockman (la más difícil)

> 🌎 **En la vida real:** el **iframe** es como colgar en tu pared una **ventana que da a la casa del vecino**: ves lo que hay, pero no puedes meter la mano ni medir sus muebles. Por eso todo se hizo **calculando**.
>
> Los intentos son como acomodar un cuadro en una pared: primero era enorme, después se veía el marco, después las letras grandes, después se cortaba… y en cada paso se ajustó **una** cosa.
>
> **Calcular el alto** es lo más ingenioso: es como un sastre que no puede medir a una persona, pero sí a su **hermano gemelo**. Mide al gemelo (el mismo versículo en Reina-Valera) y con eso corta la tela.
>
> **Calibrar** es como ajustar una balanza de cocina: primero creías que cada letra ocupaba 9,15; pesaste 32 cosas reales y descubriste que era 8,1. Se prefirió que sobre un poquito de tela antes que quedar corto.
>
> La **tapa transparente** es como poner un vidrio sobre una maqueta en un museo: aunque alguien intente tocarla (Safari), no puede moverla.

> 🌎 **Otro ejemplo:** Como un costurero que calcula cuánta tela hace falta mirando el talle de otra camisa del mismo modelo.

**La idea:** Lockman tiene su propia Biblia en línea, `bible.lockman.org`. Su página **sí se deja mostrar dentro de otra** (en un *iframe*: una ventana a otra página). El texto no se copia: es la página de Lockman dentro de la tuya.

**Lo que NO se puede:** leer ni medir lo que hay dentro de esa ventana. El navegador lo bloquea (CORS). Todo lo demás se hizo **calculando**.

**El camino, paso a paso:**
| Intento | Problema | Arreglo |
|---|---|---|
| Ventana grande sobre la página | "Grandísima", con el buscador y todo | Abrirla **en el lugar del pasaje** |
| Mostrar la página entera | Se veía todo | **Correrla hacia arriba** lo que mide su encabezado (327 px) |
| Letra de Lockman de 20 px | "Como con zoom" | **Achicarla al 80%** (`--lbla-escala: .8`): 16 px, como la nuestra |
| Pantalla ancha | Lockman cambia de diseño desde 645 px de ancho y aparecía **"in context"** | Armarla **siempre en su diseño angosto** (máximo 600 px) |
| Alto fijo | Versículos largos cortados, cortos con espacio de más | **Calcular el alto de cada versículo** |
| Un versículo por vez con flechas | Querías ver todo el pasaje | **Todos los versículos, uno debajo del otro** |
| Bordes del fondo crema alrededor | Con varios versículos sobraba mucho espacio | Recortar **justo el recuadro** del versículo |
| Se movía por dentro | Al bajar se veía toda la página de Lockman | `pointer-events: none`, y como **Safari** igual lo dejaba mover: una **tapa transparente** encima |

**Cómo se calcula el alto (lo más ingenioso):**
1. Se midió la página de Lockman: el recuadro del versículo mide **62 px** (bordes y título) **+ 33 px por línea**.
2. No se puede leer el texto de Lockman, pero **sí tenemos el mismo versículo en la Reina-Valera** (Logos), que mide casi lo mismo.
3. Con su largo se calcula cuántas líneas ocupa: `líneas = (letras + 12) / letras por línea`.
4. **Calibración:** primero se usó 9,15 px por letra y en el teléfono sobraba una línea. Se midieron **16 versículos reales en dos anchos (32 casos)** y salió **8,1 px por letra**. Con eso, de 32 casos **solo 1 queda una línea corto** ("Ver más" lo arregla). Se prefirió que sobre un poco antes que cortar el texto.

**Todas las medidas** están en el motor, con la fecha en que se midieron (`--lbla-encabezado`, `--lbla-tarjeta`, `--lbla-linea`, `--lbla-ancho-letra`…). Si Lockman cambia su página, se vuelven a medir y se cambian **solo ahí**.

**Preguntas**
21. ¿Qué es un *iframe* y por qué no se puede leer lo que hay adentro?
22. Si no se puede leer el texto de Lockman, ¿cómo sabe el recuadro cuánto mide cada versículo?
23. ¿Qué es "calibrar" y qué se calibró?
24. ¿Por qué hizo falta una tapa transparente si ya estaba `pointer-events: none`?

---

## Parte 11. El motor de diseño y el candado

> 🌎 **En la vida real:** antes era como una casa con **770 enchufes de modelos distintos**. Ahora:
> - `motor.css` = **un solo catálogo** de piezas oficiales para toda la casa.
> - El **candado** = el inspector que, antes de entregar la obra, revisa que no haya **ninguna** pieza fuera de catálogo. Si encuentra una, no se entrega y dice dónde está.
> - La excepción de `@media` = como una regla de la municipalidad que obliga a escribir ciertas medidas a mano en los planos.
>
> **Cómo se comprobó**: como el juego de las **7 diferencias**, pero con 3.900 elementos: se puso la página nueva al lado de la vieja y se compararon todos. 0 diferencias.

> 🌎 **Otro ejemplo:** Es como el diapasón que afina toda una orquesta: una sola nota de referencia para todos.

**Antes:** los colores estaban en un archivo, pero **unos 770 valores** (tamaños, espacios, tiempos, sombras) estaban escritos a mano en todos lados.

**Ahora:**
- **`css/motor.css`**: TODOS los valores, para la página, el panel y el PDF. Las demás hojas solo usan `var(--nombre)`.
- **`scripts/revisar-diseno.mjs`** (el candado): antes de armar el sitio busca colores (`#hex`, `rgb`), curvas (`cubic-bezier`) y números con unidad (`px`, `s`, `ms`…) escritos fuera del motor. Si encuentra uno, **no se publica** y dice la línea.
- **Excepción:** los `@media` llevan números, porque CSS no deja usar variables ahí.

**Cómo se comprobó que no cambió nada:** se comparó la página nueva con la publicada, **elemento por elemento**: más de **3.900 elementos, 0 diferencias**.

**Preguntas**
25. ¿Qué hace el candado y cuándo se ejecuta?
26. ¿Cómo se comprobó que el cambio no movió nada del diseño?

---

## Parte 12. PDF, tema, "nuevo" y otros detalles

> 🌎 **En la vida real:** - **PDF claro y oscuro**: como imprimir el mismo menú en dos versiones, para el día y para la noche.
> - **Botón de tema**: como una lámpara que viene encendida según la luz del cuarto, pero si tú la cambias, **recuerda** tu elección en todas las habitaciones. Se carga **en el `<head>`** para que no haga un parpadeo, como prender la luz antes de abrir la puerta.
> - **"Nuevo" que desaparece**: como la etiqueta de "no leído" de un correo: se quita cuando lo abres. En el teléfono, lo que quedó fuera de la vista todavía no cuenta como leído.
> - **Links sin `https://`**: como un corrector que te completa "gmail" con ".com".

> 🌎 **Otro ejemplo:** Como un auto con detalles de cortesía: la luz interior que se prende sola, el asiento que recuerda tu posición.

| Qué | Cómo funciona |
|---|---|
| **PDF claro y oscuro** | `pdf.html?tema=claro` u `oscuro`; el script genera dos archivos por estudio. Claro = gris suave (no blanco), oscuro = azul muy oscuro (no negro). |
| **Botón de tema** en el pie del inicio | Por defecto, el del aparato. Si la persona escoge otro, se guarda en su aparato (`localStorage`) y vale en todas las páginas (`js/tema.js`, en el `<head>` para que no parpadee). |
| **"Nuevo" desaparece** cuando la persona abre el subpunto | Se recuerda por aparato. En el teléfono, el subpunto que se muestra solo al entrar no cuenta, porque queda fuera de la vista. |
| **Links** sin `https://` | El panel se lo pone al salir del campo. |

**Preguntas**
27. ¿Dónde se guarda el tema que escoge la persona y por qué no se pierde al cambiar de página?
28. ¿Por qué el "nuevo" no se quita en el teléfono al entrar?

---

## Parte 13. Todo lo que salió mal (y cómo se arregló)

> 🌎 **En la vida real:** es el **cuaderno de errores** de la jornada. Algunas lecciones en lenguaje de todos los días:
> - **Tener permiso para citar no es tener de dónde traer**: poder usar una canción no quiere decir que alguien te mande el archivo.
> - **Decir primero dónde funciona cada cosa**: antes de mandar a alguien a una tienda, asegúrate de que está abierta.
> - **Preguntar antes de crear**: no le cuelgues un cartel nuevo a alguien en su casa sin preguntarle.
> - **Medir antes de cambiar**: el globo tardaba por la espera, no por internet.
> - **Medir en varios anchos**: una camisa puede quedar bien de frente y mal de costado.
> - **Calibrar con muchos datos**: no se ajusta la balanza con una sola manzana.
> - **Cada navegador tiene sus defectos**: como cada carro tiene su mañita; hay que probar en el que maneja la persona.
> - **GitHub falló una vez**: a veces el problema es del correo, no de tu carta: se vuelve a mandar.

> 🌎 **Otro ejemplo:** Como el cuaderno de errores de una obra: cada problema con lo que se aprendió, para no repetirlo.

| Qué pasó | Qué se aprendió |
|---|---|
| Creí que se podía traer la LBLA automática y no se pudo | Los permisos de citar **no** dan una fuente para traer el texto |
| Te mandé a copiar uno por uno en la app | Las herramientas eran del **panel** y Pastoras no estaba publicado. Lo correcto: decir primero dónde funciona cada cosa |
| El código de 8 letras "no llegaba" | Lo muestra la **terminal**, no el teléfono |
| Creé redirecciones que no querías | Preguntar antes de crear cosas nuevas en GitHub |
| El medidor ocupaba espacio | Lo importante a la vista; el detalle, al tocar |
| El PDF salió en negro y después en un tema que no era el tuyo | Dar a escoger: claro y oscuro |
| El globo de Logos tardaba | Medir dónde se pierde el tiempo antes de cambiar nada |
| Lockman en pantalla ancha mostraba "in context" | Medir en varios anchos: las páginas cambian de diseño |
| 9,15 px por letra estaba mal | **Calibrar con datos reales**, no con un solo ejemplo |
| Safari dejaba mover el recuadro | Cada navegador tiene sus defectos: probar en el tuyo |
| GitHub falló una vez al publicar | Era un error suyo; se vuelve a lanzar |

**Preguntas**
29. Nombra dos cosas que se aprendieron midiendo en vez de suponer.
30. ¿Por qué hay que probar en el navegador de la persona y no solo en uno?

---

## Respuestas

> 🌎 **En la vida real:** las soluciones del final: se miran **después** de intentarlo, como las respuestas de una sopa de letras.

1. No. Se cambia la plantilla una sola vez y todos los estudios se ven igual, porque los estudios son solo datos.
2. La Reina-Valera en `js/rvr.js`; la LBLA en `js/mapa.js` (`abrirLBLA` y `medidasLBLA`).
3. Renombrar mantiene el mismo repositorio con todo su historial; copiar crea otro nuevo.
4. Porque GitHub Pages deja que el navegador guarde las páginas 10 minutos; con Cmd + Shift + R se recarga sin caché.
5. Para que el navegador piense que es un archivo nuevo y no use el viejo guardado.
6. Hasta 500, sin un libro completo, sin pasar del 25% del estudio y con el aviso y el link a LBLA.com.
7. Porque la referencia termina en "LBLA" (`esLBLA`).
8. Porque escribe lo que le suena: puede cambiar palabras o mezclar versiones.
9. Es sacar texto de una página con un programa; Lockman lo prohíbe y el navegador no deja leer las respuestas de otro sitio sin su permiso (CORS).
10. Lee varias capturas a la vez en el navegador, reconoce libro y capítulo, y llena los pasajes que corresponden.
11. Cuántos versículos hay (máximo 500) y qué porcentaje del estudio es texto bíblico (máximo 25%).
12. Porque si la Biblia es 1 parte de 4, lo tuyo son las otras 3.
13. Para que si mueves o reordenas el subpunto, sus fuentes se vayan con él.
14. Que lo del "año en subir la torre" no estaba en el Pirkei de-Rabbi Eliezer, sino en el Sefer HaYashar.
15. Porque el SBLGNT tiene licencia libre (CC BY 4.0) y el NA28 tiene derechos.
16. Porque el SBLGNT es libre y está guardado dentro de la página; la LBLA tiene derechos y no hay una fuente permitida para traerla.
17. El abierto se va con su efecto y después entra el nuevo; nunca hay dos a la vez.
18. Para que el JS espere exactamente lo mismo que dura el efecto en el CSS, y no haya valores a mano.
19. Antes pasaba por el globo de Logos, que espera a propósito, y de a uno. Ahora se piden directo, todos a la vez, y se adelantan.
20. Una forma de recibir datos de otro sitio: un `<script>` que llama a una función nuestra con los datos.
21. Una ventana a otra página dentro de la tuya; el navegador no deja leerla porque es de otro dueño (CORS).
22. Calcula con medidas de Lockman (62 + 33 por línea) y con el largo del mismo versículo en la Reina-Valera.
23. Ajustar un número con datos reales: se midió el ancho de letra con 32 casos y salió 8,1 en vez de 9,15.
24. Porque Safari deja mover el contenido de un iframe aunque tenga `pointer-events: none`.
25. Busca valores escritos a mano fuera del motor; corre antes de armar el sitio y si encuentra uno, no publica.
26. Comparando los estilos de cada elemento de la página nueva con la publicada: 0 diferencias.
27. En el aparato (`localStorage`), y `js/tema.js` lo aplica en cada página antes de dibujarla.
28. Porque en el teléfono el subpunto queda debajo del mapa y la persona todavía no lo vio.
29. El ancho de letra (8,1 y no 9,15) y que el tiempo se perdía en las esperas del globo, no en la red. También: Lockman cambia de diseño desde 645 px.
30. Porque cada navegador tiene sus propios defectos, como Safari con los iframes.
