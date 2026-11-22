# Seguridad 5: la auditoría de este mismo sitio

> 🌎 **En la vida real:** un médico que se hace el mismo chequeo que les pide a sus pacientes. Es la mejor prueba de que cree en lo que enseña, y de paso encuentra lo que nadie había visto.

> 🎙️ **El profesor dice:** {{alumno}}, este mapa de estudios (el sitio donde estás leyendo esto) pasó por una auditoría de seguridad. La hizo **otra sesión de IA**, aparte de la que construyó el sitio, con siete agentes y una revisión en el navegador, y cada hallazgo se **verificó antes de arreglarlo**. Hoy, los hallazgos de verdad: qué era cada uno, cómo se habría atacado y cómo se cerró. Están en el historial del repositorio (el commit *"Auditoría: bugs, seguridad, rendimiento, CI, navegación y contenido"*), así que puedes ir a leer el código antes y después.

## Parte 1. El oráculo de las prácticas

> 🌎 **En la vida real:** un profesor que, al devolver el examen, marca con una cruz **cada** respuesta mala. Si el alumno puede volver a dar el examen las veces que quiera, con cruces en cada pregunta, no necesita estudiar: prueba, mira las cruces, cambia esas, y aprueba.

> 🌎 **Otro ejemplo:** Es como el juego de "frío o caliente": si cada intento te dice exactamente qué tan cerca estás, encuentras la respuesta sin saber nada.

Las prácticas de este sitio las corrige **el servidor** (la función `corregirPractica` de Firebase), y las respuestas viven solo ahí, para que no se puedan leer en la página. Bien pensado. Pero la corrección devolvía **pregunta por pregunta**, cuál estaba bien y cuál mal. Eso la volvía un **oráculo**:

1. Mandar todas las verdadero/falso como "V".
2. La respuesta dice cuáles fallaron: **esas son F**, el resto V.
3. Mandar la versión corregida: **aprobada**, sin haber leído la clase. Un programa lo hace solo.

Las respuestas estaban escondidas, pero la corrección las **contaba** de a una. **El arreglo:** si no aprobaste, solo se dice **cuántas** fallaron, no cuáles.

```js
// Si no aprobó, solo se dice CUÁNTAS fallaron, no cuáles. Antes se devolvía pregunta por pregunta,
// y eso funcionaba como un oráculo: mandar todo "V" revelaba de una vez qué era verdadero y qué falso.
return {
  aprobada,
  resultados: aprobada ? resultados : null,
  malas: resultados.filter((x) => x === false).length,
};
```

**La lección general:** un secreto no se protege solo escondiéndolo; también hay que mirar **qué dejan saber las respuestas**. Es la misma idea que la **enumeración de cuentas** de la clase 23 ("ese correo no existe" contra "contraseña incorrecta").

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Corregir sin ser un oráculo
lenguaje: js
pide: Completa `respuestaDelCorrector(resultados)`. `resultados` es una lista de `true` (bien) y `false` (mal), una por pregunta. Si **todas** están bien, devuelve `{ aprobada: true, resultados }` (ahí sí se puede mostrar el detalle). Si alguna está mal, devuelve `{ aprobada: false, resultados: null, malas: N }`: cuántas fallaron, pero **no cuáles**.
--- código
function respuestaDelCorrector(resultados) {
  return { aprobada: resultados.every((r) => r), resultados }; // ✗ siempre muestra cuál falló
}
--- pruebas
prueba('aprobada: muestra el detalle', () => igual(respuestaDelCorrector([true, true, true]), { aprobada: true, resultados: [true, true, true] }));
prueba('no aprobada: dice cuántas', () => igual(respuestaDelCorrector([true, false, false]).malas, 2));
prueba('no aprobada: NO dice cuáles', () => igual(respuestaDelCorrector([true, false, true]).resultados, null));
prueba('la respuesta completa', () => igual(respuestaDelCorrector([false, true]), { aprobada: false, resultados: null, malas: 1 }));
--- solución
function respuestaDelCorrector(resultados) {
  const aprobada = resultados.every((r) => r);
  if (aprobada) return { aprobada, resultados };
  return { aprobada: false, resultados: null, malas: resultados.filter((r) => r === false).length };
}
```

```practica
vf :: Aunque las respuestas estén escondidas en el servidor, una corrección que dice cuál pregunta falló permite descubrirlas
vf :: Para que las prácticas sean seguras alcanza con no poner las respuestas en la página
elige :: ¿Qué otro ataque del curso se parece al oráculo de las prácticas? :: El XSS :: La enumeración de cuentas: "ese correo no existe" contra "contraseña incorrecta" :: El path traversal
escribe :: ¿Por qué con el arreglo un programa ya no puede aprobar sin leer? :: Porque si no aprueba, solo sabe cuántas fallaron, no cuáles. Con varias preguntas, adivinar cuáles cambiar sin saber es mucho más difícil que leer la clase.
```

## Parte 2. Una persona, muchos correos

> 🌎 **En la vida real:** un buzón con varios nombres en la puerta ("Ana Pérez", "A. Pérez", "Ana P."): las cartas llegan todas al mismo buzón. Si el cartero cree que son tres personas, le entrega el triple.

> 🌎 **Otro ejemplo:** Es como una promoción de "una por persona" que se puede pedir con tres apodos distintos.

Al crear una cuenta, el sitio manda un correo de verificación, y tiene **topes**: uno por persona (para no inundar a nadie) y uno por día para todo el sitio (porque cada correo cuesta). Pero **Gmail** entrega en la **misma bandeja**:

```text
ana.perez@gmail.com   anaperez@gmail.com   ANA.PEREZ@gmail.com
anaperez+1@gmail.com  anaperez+zzz@gmail.com   ana.perez@googlemail.com
```

Gmail ignora los puntos, las mayúsculas y lo que va después de un `+`. Para el sitio, eran **seis personas distintas**. El ataque: inventar variantes del correo de **otra** persona, mandarle decenas de correos de verificación (molestia, o hacer que marque el sitio como *spam*), y de paso **gastar el tope diario** para que nadie más pueda crear cuenta.

**El arreglo, en dos capas:**
1. Para contar, el correo se pasa a su **forma canónica**: la bandeja real (`anaperez@gmail.com`).
2. Un tope por **conexión** (dirección IP) por día: varias cuentas desde un mismo lugar es normal (un aula), cientos no.

```js
// Gmail entrega en la misma bandeja "ana.perez+1@gmail.com", "anaperez@gmail.com" y "ANA.PEREZ@googlemail.com".
// Para los límites hay que contarlas como UNA.
export function gmailCanonico(correo) {
  const [local = '', dominio = ''] = String(correo).trim().toLowerCase().split('@');
  if (dominio !== 'gmail.com' && dominio !== 'googlemail.com') return `${local}@${dominio}`;
  return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
}
```

> 📌 **Nota:** se hace **solo para Gmail** porque es el que se sabe que ignora los puntos. Otros servicios pueden tratar `ana.perez` y `anaperez` como dos personas distintas: unirlas ahí sería un error.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La bandeja real de un correo de Gmail
lenguaje: js
pide: Completa `gmailCanonico(correo)`: pásalo a minúsculas y sin espacios, sepáralo en lo de antes y lo de después de `@`. Si el dominio no es `gmail.com` ni `googlemail.com`, devuélvelo así (minúsculas, sin espacios). Si es de Gmail: corta lo que va desde el `+`, saca los puntos, y devuelve con `@gmail.com`.
--- código
function gmailCanonico(correo) {
  return correo; // tu código aquí
}
--- pruebas
prueba('con puntos y mayúsculas', () => igual(gmailCanonico('ANA.Perez@gmail.com'), 'anaperez@gmail.com'));
prueba('con +algo', () => igual(gmailCanonico('anaperez+zzz@gmail.com'), 'anaperez@gmail.com'));
prueba('googlemail es lo mismo', () => igual(gmailCanonico('ana.perez@googlemail.com'), 'anaperez@gmail.com'));
prueba('con espacios', () => igual(gmailCanonico('  anaperez@gmail.com '), 'anaperez@gmail.com'));
prueba('otro servicio: los puntos se quedan', () => igual(gmailCanonico('Ana.Perez@outlook.com'), 'ana.perez@outlook.com'));
prueba('las seis variantes son una', () => igual(new Set(['ana.perez@gmail.com', 'anaperez@gmail.com', 'ANA.PEREZ@gmail.com', 'anaperez+1@gmail.com', 'anaperez+zzz@gmail.com', 'ana.perez@googlemail.com'].map(gmailCanonico)).size, 1));
--- solución
function gmailCanonico(correo) {
  const [local = '', dominio = ''] = String(correo).trim().toLowerCase().split('@');
  if (dominio !== 'gmail.com' && dominio !== 'googlemail.com') return `${local}@${dominio}`;
  return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
}
```

```practica
vf :: Para Gmail, ana.perez@gmail.com y anaperez+1@gmail.com llegan a la misma bandeja
vf :: Conviene sacar los puntos de todos los correos, de cualquier servicio, para contar personas
elige :: ¿Para qué sirve el tope por conexión (IP) además del tope por correo? :: Para que el sitio sea más rápido :: Para frenar a alguien que crea cientos de cuentas desde el mismo lugar con correos distintos :: Para bloquear Gmail
escribe :: ¿Qué podía hacer un atacante antes de que se arreglara lo del correo canónico? :: Inventar variantes del correo de otra persona (con puntos o +algo) y mandarle muchos correos de verificación, y de paso gastar el tope diario del sitio para que nadie más pudiera crear cuenta.
```

## Parte 3. Dónde vive un secreto en el navegador

> 🌎 **En la vida real:** dejar la llave de tu casa en el casillero del edificio. El casillero es "tuyo", pero lo comparten todos los departamentos: si un vecino deja la puerta del casillero abierta, tu llave queda a la vista.

> 🌎 **Otro ejemplo:** Es como guardar tu contraseña en la libreta de la oficina en vez de en tu billetera.

El **panel del autor** (para editar este sitio desde el navegador) usa una llave de GitHub con permiso para **publicar código** en el repositorio. Se guardaba en `localStorage`. El problema no estaba en este sitio, sino en **con quién comparte el `localStorage`**.

El navegador separa el almacenamiento por **origen**: protocolo + dominio + puerto. El camino (`/estudios`) **no cuenta**. Este sitio vive en `https://delvinsmart.github.io/estudios/`. Cualquier **otro** proyecto publicado en `https://delvinsmart.github.io/otra-cosa/` tiene **el mismo origen**, y por lo tanto **el mismo `localStorage`**. Un fallo de seguridad (un XSS) en cualquier otro proyecto de esa cuenta podía leer la llave y publicar código aquí.

**El arreglo:**
- La llave pasó a **`sessionStorage`**: vive solo en **esa pestaña** y se borra al cerrarla.
- Si quedaba una llave vieja en `localStorage`, se **mueve una vez** y se **borra** de allá.

```js
// Antes estaba en localStorage, que es compartido por TODAS las páginas de delvinsmart.github.io
// (otros proyectos incluidos): un fallo de seguridad en cualquiera de ellos podía leerla.
function moverLlaveVieja() {
  const vieja = localStorage.getItem(CLAVE);
  if (vieja) { sessionStorage.setItem(CLAVE, vieja); localStorage.removeItem(CLAVE); }
}
```

> 💡 **Idea:** un secreto que puede publicar código es lo más valioso que hay en el navegador. La regla: guardarlo **lo menos posible** (sessionStorage, no localStorage), y con **los menos permisos posibles** (una llave que solo puede tocar **este** repositorio). Es el mínimo privilegio de la clase 24.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Comparten el localStorage?
lenguaje: js
pide: Dos páginas comparten `localStorage` si tienen el mismo **origen**: protocolo, dominio y puerto. Completa `compartenAlmacen(a, b)` con `new URL(…).origin` (el camino no importa). Las pruebas muestran por qué la llave del panel estaba en riesgo.
--- código
function compartenAlmacen(a, b) {
  return a === b; // tu código aquí
}
--- pruebas
prueba('este sitio y otro proyecto de la misma cuenta: SÍ comparten', () => igual(compartenAlmacen('https://delvinsmart.github.io/estudios/', 'https://delvinsmart.github.io/otra-cosa/'), true));
prueba('dos páginas del mismo sitio', () => igual(compartenAlmacen('https://delvinsmart.github.io/estudios/#/clase/22', 'https://delvinsmart.github.io/estudios/panel.html'), true));
prueba('otra cuenta de GitHub: no', () => igual(compartenAlmacen('https://delvinsmart.github.io/estudios/', 'https://otrapersona.github.io/estudios/'), false));
prueba('http contra https: no', () => igual(compartenAlmacen('https://delvinsmart.github.io/', 'http://delvinsmart.github.io/'), false));
prueba('otro puerto: no', () => igual(compartenAlmacen('http://localhost:8123/', 'http://localhost:8124/'), false));
--- solución
function compartenAlmacen(a, b) {
  return new URL(a).origin === new URL(b).origin;
}
```

```practica
vf :: Dos proyectos publicados en la misma cuenta de github.io, en caminos distintos, comparten el mismo localStorage
vf :: Una llave guardada en localStorage solo la puede leer la página que la guardó
elige :: ¿Por qué sessionStorage es mejor para la llave del panel? :: Porque guarda más datos :: Porque vive solo en esa pestaña y se borra al cerrarla :: Porque está cifrado
escribe :: Además de dónde se guarda, ¿qué otra cosa reduce el daño si alguien roba la llave del panel? :: Que la llave tenga los menos permisos posibles: que solo pueda tocar este repositorio, y nada más de la cuenta (mínimo privilegio).
```

## Parte 4. Lo que entra de afuera: tamaños, nombres y scripts

> 🌎 **En la vida real:** el buzón de una casa tiene una ranura del tamaño de una carta. Si fuera del tamaño de una puerta, te pueden meter cualquier cosa.

> 🌎 **Otro ejemplo:** Es como el cartel de una tienda que acepta "solo efectivo o tarjeta": si acepta cualquier cosa como pago, alguien paga con un papel pintado.

Cuatro hallazgos con la misma raíz: **algo que entra sin un límite**.

**1. El tamaño de las respuestas.** La función que corrige recibía un objeto con las respuestas y lo recorría. ¿Qué pasa si alguien manda un objeto con un millón de claves, o un texto de 10 MB? El servidor trabaja (y **cobra**) por nada. **Arreglo:** antes de corregir, revisar la **forma**: un objeto, con como mucho 50 claves.

```js
export const MAXIMO_RESPUESTAS = 50;
export function respuestasValidas(respuestas) {
  if (respuestas === undefined || respuestas === null) return true;
  if (typeof respuestas !== 'object' || Array.isArray(respuestas)) return false;
  return Object.keys(respuestas).length <= MAXIMO_RESPUESTAS;
}
```

**2. El nombre del certificado.** El certificado muestra tu nombre, y se puede verificar públicamente. Si el nombre acepta cualquier cosa, alguien escribe `"Visita www.estafa.com"` o un nombre con emojis y símbolos raros, y el sitio lo **muestra con su firma**. **Arreglo:** solo letras (de cualquier idioma, con tildes), espacios, punto, apóstrofo y guion, **en la página y en las reglas de Firestore** (las dos, porque la página se puede saltar: clase 22, parte 5).

```text
^[\p{L}\p{M}][\p{L}\p{M} .'-]*$      \p{L}: cualquier letra (ñ, á, ç…)   \p{M}: las tildes que van pegadas
```

**3. Los scripts de otros (SRI).** La página carga `marked` y `highlight.js` desde un CDN. Si alguien lograra cambiar esos archivos en el CDN, el código nuevo correría **en este sitio**, con las sesiones de todos. **Arreglo: SRI** (*Subresource Integrity*): cada `<script>` lleva la **huella** del archivo esperado, y si el archivo cambió, el navegador **no lo corre**.

```html
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"
        integrity="sha384-/TQbtLCAerC3jgaim+N78RZSDYV7ryeoBCVqTuzRrFec2akfBkHS7ACQ3PQhvMVi"
        crossorigin="anonymous"></script>
```

**4. Las acciones de GitHub, por su huella.** Lo mismo, en el CI: `uses: actions/checkout@v4` confía en que la etiqueta `v4` no cambie. Una etiqueta **se puede mover**. Ahora cada acción se pide por su **SHA** (la huella exacta del código): la cadena de suministro de la clase 23, parte 7.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Límites para lo que entra
lenguaje: js
pide: Completa las dos revisiones de la auditoría. `respuestasValidas(r)`: `true` si es `null` o `undefined`; si no, tiene que ser un objeto (no una lista) con como mucho 50 claves. `nombreValido(n)`: `true` solo si cumple `/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u` y tiene 80 letras o menos.
--- código
function respuestasValidas(r) {
  return true; // tu código aquí
}

function nombreValido(n) {
  return true; // tu código aquí
}
--- pruebas
prueba('respuestas normales', () => igual(respuestasValidas({ p1: 'V', p2: 'b' }), true));
prueba('sin respuestas', () => igual(respuestasValidas(undefined), true));
prueba('un texto en vez de un objeto', () => igual(respuestasValidas('x'.repeat(1000)), false));
prueba('una lista', () => igual(respuestasValidas(['V', 'F']), false));
prueba('demasiadas claves', () => igual(respuestasValidas(Object.fromEntries(Array.from({ length: 51 }, (_, i) => [`p${i}`, 'V']))), false));
prueba('un nombre con tildes y ñ', () => igual(nombreValido("María José Peña-O'Neil"), true));
prueba('un enlace en el nombre', () => igual(nombreValido('Visita www.estafa.com/premio'), false));
prueba('números y emojis', () => igual(nombreValido('Ana 2026 🎉'), false));
prueba('muy largo', () => igual(nombreValido('A'.repeat(81)), false));
--- solución
function respuestasValidas(r) {
  if (r === undefined || r === null) return true;
  if (typeof r !== 'object' || Array.isArray(r)) return false;
  return Object.keys(r).length <= 50;
}

function nombreValido(n) {
  return /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(n) && n.length <= 80;
}
```

```practica
vf :: Con SRI, si el archivo del CDN cambia, el navegador no corre el script
vf :: Revisar el nombre del certificado en la página alcanza, no hace falta en las reglas de Firestore
elige :: ¿Por qué se piden las acciones de GitHub por su SHA y no por la etiqueta v4? :: Porque el SHA es más corto :: Porque una etiqueta se puede mover a otro código; el SHA es la huella exacta :: Porque GitHub lo obliga
escribe :: ¿Qué podía pasar si la función que corrige aceptaba respuestas de cualquier tamaño? :: Alguien podía mandar un objeto enorme (un millón de claves o 10 MB de texto) y hacer trabajar al servidor por nada, gastando y cobrando, una y otra vez.
```

## Parte 5. Escapar en un solo lugar

> 🌎 **En la vida real:** una empresa con cinco copias del reglamento, una en cada oficina. Un día se corrige una regla… en cuatro copias. La quinta oficina sigue con la regla vieja, y nadie se da cuenta hasta que algo pasa ahí.

> 🌎 **Otro ejemplo:** Es como cinco relojes en la casa: si cambias la hora en cuatro, el quinto te hace llegar tarde.

**Escapar** es convertir un texto para meterlo en HTML sin que el navegador lo lea como etiquetas: `<b>` se vuelve `&lt;b&gt;` y se **ve** tal cual, en vez de volverse negrita (o un `<script>`). Es la defensa contra el XSS de la clase 23.

La auditoría encontró **cinco copias** de la función de escapar, en cinco archivos distintos. Y ninguna escapaba la **comilla simple** `'`. Además, **ni siquiera eran iguales**: solo una de las cinco aceptaba un valor vacío (`null`) sin escribir la palabra "null" en la página. Las copias ya se habían separado solas. ¿Importa? Sí, cuando el texto va adentro de un atributo con comillas simples:

```html
<button title='Hola, {nombre}'>      ← si nombre es:  x' onmouseover='alert(1)
<button title='Hola, x' onmouseover='alert(1)'>   ← el atributo se cerró, y apareció uno nuevo
```

**El arreglo:** una sola función, en un solo archivo (`web/texto.js`), que escapa los **cinco** caracteres, y todos los demás archivos la importan.

```js
const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapar = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ENTIDADES[c]);
```

**La lección:** el código repetido no es solo feo; es **peligroso**. Cuando hay que arreglar algo, se arregla en un lugar y se olvidan los otros. Una regla de seguridad tiene que vivir en **un solo lugar**, con su prueba.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La función de escapar, completa
lenguaje: js
pide: Esta es la versión que estaba repetida cinco veces, y le falta la comilla simple. Complétala: tiene que escapar `&`, `<`, `>`, `"` y `'` (la comilla simple como `&#39;`). Si recibe `null` o `undefined`, devuelve `''`.
--- código
function escapar(t) {
  return String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
--- pruebas
prueba('las etiquetas', () => igual(escapar('<b>hola</b>'), '&lt;b&gt;hola&lt;/b&gt;'));
prueba('el &', () => igual(escapar('Tom & Jerry'), 'Tom &amp; Jerry'));
prueba('comillas dobles', () => igual(escapar('"hola"'), '&quot;hola&quot;'));
prueba('la comilla simple (la que faltaba)', () => igual(escapar("x' onmouseover='alert(1)"), 'x&#39; onmouseover=&#39;alert(1)'));
prueba('null no se vuelve "null"', () => igual(escapar(null), ''));
--- solución
const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapar(t) {
  return String(t ?? '').replace(/[&<>"']/g, (c) => ENTIDADES[c]);
}
```

```practica
vf :: Tener la misma función de seguridad copiada en cinco archivos es peligroso, porque al corregirla es fácil olvidar una copia
vf :: No escapar la comilla simple no importa, porque en HTML casi siempre se usan comillas dobles
elige :: ¿Qué hace escapar con "<b>hola</b>"? :: Lo borra :: Lo convierte en &lt;b&gt;hola&lt;/b&gt;, que se ve tal cual :: Lo deja en negrita
escribe :: ¿Qué aprendiste de la auditoría sobre el código repetido? :: Que no es solo desprolijo: una regla de seguridad repetida en varios lugares se termina arreglando en unos y no en otros. Tiene que vivir en un solo lugar, con su prueba, y los demás la importan.
```


**Comprobación antes de seguir**

Ubica cada hallazgo en una versión del sitio y anota qué control debería existir hoy.

<details>
<summary>Necesito una pista</summary>

Una nota histórica debe incluir su fecha o commit y una comprobación defensiva actual.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿hiciste alguna auditoría de seguridad?":** "Sí, la de mi propio sitio de estudios, hecha por una sesión aparte que no lo había construido, y verificando cada hallazgo antes de arreglarlo. Encontramos, entre otras cosas: que la corrección de las prácticas funcionaba como un oráculo, porque decía qué pregunta fallaba, y ahora solo dice cuántas; que con variantes de Gmail se podía inundar a una persona de correos y gastar el tope del sitio, y ahora se cuenta la bandeja canónica y hay un tope por conexión; que la llave del panel estaba en un localStorage compartido con todos los proyectos de mi cuenta de github.io, y pasó a sessionStorage; que había cinco copias de la función de escapar y ninguna escapaba la comilla simple. También agregamos SRI a los scripts del CDN, fijamos las acciones de GitHub por SHA y pusimos límites a lo que entra."

> 🌎 **En la vida real:** es como un mecánico que muestra lo que encontró en su propio auto, con la pieza vieja y la nueva en la mano.

> 🌎 **Otro ejemplo:** Es como el informe de una inspección del edificio donde vives: qué se encontró, por qué era un riesgo y qué se cambió.
