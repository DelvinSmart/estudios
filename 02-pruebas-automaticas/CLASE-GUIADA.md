# Clase guiada 02: Pruebas automáticas

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** una o dos partes por día. En cada **✋ Para y piensa**, responde antes de abrir la respuesta. Al final de cada parte hay una **práctica**: si la apruebas entera, se desbloquea tu bombillo 💡.

**Lo que necesitas saber antes:** la clase 01 (leer una función, `return`, `if`, `===`).

## 1. ¿Qué es una prueba?

> 🎙️ **El profesor:** Delvin, hoy vamos a ver algo que separa a un programador aficionado de uno profesional: **las pruebas automáticas**. Tu app tiene más de 400. Cuando termines esta clase, vas a poder explicar en una entrevista qué son, para qué sirven y cómo se escribe una.

> 🌎 **En la vida real:** Es como el control de calidad de una fábrica de galletas: una máquina toma una galleta de cada lote, la pesa y la compara con el peso correcto. Si no coincide, se para la línea.

> 🌎 **Otro ejemplo:** Es como el corrector ortográfico del teléfono: revisa solo cada palabra que escribes, sin que se lo pidas, y te marca en rojo la que está mal.

### La idea en una frase

Una prueba es **un pequeño programa que revisa si otro programa hace lo correcto**.

Piensa en cómo pruebas una calculadora a mano: escribes `2 + 2`, miras la pantalla y piensas "debería dar 4… sí, dio 4". Hiciste tres cosas:

1. Le diste **datos** (2 y 2).
2. Sabías **qué tenía que salir** (4). A eso se le llama **lo esperado**.
3. Miraste **qué salió de verdad** y lo **comparaste**. A lo que salió se le llama **lo recibido**.

Una prueba automática hace exactamente eso, pero **la hace la máquina sola**, en milisegundos, **cada vez que cambias algo**. Tú la escribes una vez y te cuida para siempre.

> 🌎 **En la vida real:** el panadero que, antes de abrir, prueba un pan de cada horneada. Sabe cómo **debe** saber (lo esperado), lo muerde (lo recibido) y compara. Si sabe a sal en vez de azúcar, para todo antes de venderlo.

> 🌎 **Otro ejemplo:** Como la prueba de alcoholemia: soplas (le das un dato), la máquina compara con el límite permitido (lo esperado) y da "aprobado" o "reprobado".

### La pregunta de toda prueba

> 🌎 **En la vida real:** Como pesar un paquete en el correo: "con esta caja, ¿la balanza marca lo que dice la etiqueta?". Si dice 2 kg y marca 2 kg, pasa.

> 🌎 **Otro ejemplo:** Como revisar el vuelto en una tienda: "pagué 50, la compra era 32, ¿me dieron 18?". Esa pregunta es una prueba.

Todas las pruebas del mundo, de todas las empresas, hacen **la misma pregunta**:

> **Con estos datos, ¿el resultado es el que yo esperaba?**

Si la respuesta es sí, la prueba **pasa** ✓. Si es no, la prueba **falla** ✗ y te dice qué esperaba y qué recibió.

> ✋ **Para y piensa:** tu función `normalizeMyCompanyName` del Tema 01. Inventa una prueba en palabras: ¿qué datos le das y qué esperas?

<details>
<summary>Ver una respuesta posible</summary>

"Si le doy `'  Thermomac  '`, espero `'Thermomac'`." O: "Si le doy `'Mi Empresa De Refrigeración'`, espero `null`." Cualquier frase con **datos** + **resultado esperado** es una prueba.

</details>

```practica
escribe :: Con tus palabras: ¿qué es una prueba automática? :: Un pequeño programa que revisa si otro programa hace lo correcto: le da datos, compara lo que sale con lo esperado, y lo hace sola cada vez que cambias algo.
escribe :: ¿Cuál es la pregunta que hace toda prueba? :: Con estos datos, ¿el resultado es el que yo esperaba?
vf :: "Lo esperado" es lo que devolvió el código
vf :: Una prueba automática la revisa una persona cada vez
vf :: Si lo recibido es igual a lo esperado, la prueba pasa
elige :: Pruebo `2 + 2` y sale `5`. ¿Qué pasa con la prueba? :: Pasa :: Falla :: No se sabe
```

> 🔁 **Repaso:** una prueba le da datos a tu código, compara lo **recibido** con lo **esperado**, y pasa si coinciden. La hace la máquina sola, cada vez.

## 2. ¿Para qué sirve?

> 🎙️ **El profesor:** "¿y para qué escribir más código si la app ya funciona?" Es la pregunta que se hace todo el mundo al principio. Te respondo con cinco razones, y con un caso real de tu app que te va a convencer.

> 🌎 **En la vida real:** Es como el cinturón de seguridad: el 99 % de los viajes no lo necesitas, pero el día que lo necesitas, te salva.

> 🌎 **Otro ejemplo:** Es como el seguro del carro: pagas un poco siempre (escribir pruebas) para no pagar muchísimo el día del choque (un error en producción).

### Las cinco razones

> 🌎 **Otro ejemplo:** Como las cámaras de un estacionamiento: no evitan todos los problemas, pero te avisan rápido, quedan como registro y te dejan tranquilo para hacer otras cosas.

| Para qué | Qué significa | 🌎 En el carro |
|---|---|---|
| **Encontrar errores** | Detecta un fallo antes que tus usuarios | La luz de aceite se prende **antes** de que se funda el motor |
| **Proteger lo que ya funciona** | Si arreglas algo y dañas otra cosa, te avisa | El mecánico cambia los frenos y el tablero avisa que desconectó el sensor del ABS |
| **Cambiar sin miedo** | Mejoras el código y la prueba dice si rompiste algo | Cambias la radio tranquilo: si tocas un cable que no debías, se prende una luz |
| **Dejar claras las reglas** | La prueba explica qué debe pasar | El manual dice "presión de llantas: 32"; la prueba es esa frase para una máquina |
| **Ahorrar tiempo** | No revisas todo a mano en cada cambio | No abres el capó todas las mañanas |

### El caso real: Uber y uber

En tu app, las pruebas encontraron esto: si una cuenta tenía registros con `Uber` (mayúscula) y `uber` (minúscula) el mismo día, **la app sumaba el doble**. A simple vista todo parecía bien: los números se veían normales. Pero eran dinero mal contado.

¿Por qué es tan grave? Porque **un error de dinero así puede pasar meses sin que nadie lo note**. El conductor ve un número, confía en él, y nunca sabe que está mal. Una prueba lo atrapó antes.

> 🌎 **En la vida real:** un cajero que cuenta dos veces el mismo billete porque uno estaba al derecho y otro al revés. El total "parece" razonable, pero está inflado.

> 🌎 **Otro ejemplo:** Como dos personas que anotan los gastos de la casa en la misma libreta, una con "Supermercado" y otra con "supermercado": al sumar "por lugar", aparecen dos supermercados y la cuenta sale mal.

> 💡 **Idea:** la mejor comparación: **una prueba es como la alarma de humo**. No apaga el fuego, pero avisa antes de que se queme la casa.

> ✋ **Para y piensa:** cambias el color de un botón y, sin querer, rompes el cálculo del tanque. ¿Cuál de las cinco razones te salva?

<details>
<summary>Ver la respuesta</summary>

**Proteger lo que ya funciona.** La prueba del tanque (`fuelLevel.test.ts`) fallaría y te avisaría, aunque tú estabas pensando en el color.

</details>

```practica
escribe :: Nombra al menos tres de las cinco razones para tener pruebas. :: Encontrar errores, proteger lo que ya funciona, cambiar sin miedo, dejar claras las reglas, ahorrar tiempo.
vf :: Una prueba es como una alarma de humo: avisa, pero no apaga el fuego
vf :: El error de Uber y uber era fácil de ver mirando la pantalla
elige :: ¿Qué razón es "mejoro el código y la prueba me dice si rompí algo"? :: Ahorrar tiempo :: Cambiar sin miedo :: Dejar claras las reglas
elige :: ¿Por qué los errores de dinero son peligrosos? :: Porque hacen que la app no abra :: Porque pueden pasar meses sin que nadie los note :: Porque son fáciles de ver
```

> 🔁 **Repaso:** las pruebas encuentran errores, protegen lo que ya funciona, te dejan cambiar sin miedo, dejan las reglas escritas y ahorran tiempo. En tu app atraparon una suma doble de dinero que nadie veía.

## 3. Lo que una prueba NO hace

> 🎙️ **El profesor:** ahora lo contrario. Un buen programador sabe para qué sirven las pruebas **y también sus límites**. En una entrevista, decir "las pruebas no garantizan que no haya errores" te hace ver con experiencia.

> 🌎 **En la vida real:** Una prueba es como el detector de metales del banco: encuentra armas, pero no sabe si la persona tiene malas intenciones. Detecta solo lo que fue hecho para detectar.

> 🌎 **Otro ejemplo:** Es como un examen de matemáticas: si aprobaste las 10 preguntas, sabes esas 10, no toda la matemática.

### Los cuatro límites

1. **No prueba que no existan errores.** Solo revisa **los casos que escribiste**. Si nunca escribiste una prueba para "nombre con emoji", no sabes qué pasa con un emoji.
   > 🌎 **En la vida real:** el detector de humo de la cocina no te avisa de una fuga de agua en el baño. Solo vigila lo que le pusiste a vigilar.
2. **No sabe cuál es la regla correcta.** Si la regla está mal, la prueba también. La prueba compara contra **lo que tú dijiste que era correcto**.
   > 🌎 **En la vida real:** si la receta dice "2 kilos de sal" y el panadero la sigue al pie de la letra, el pan sale "correcto" según la receta, pero incomible.
3. **Normalmente no ve la pantalla.** No sabe si un botón quedó feo, cortado o tapado.
   > 🌎 **En la vida real:** la balanza dice que el pastel pesa 1 kg, pero no te dice si está feo.
4. **No reemplaza probar en un teléfono real.** Copiloto tuvo una versión que **pasaba todas las revisiones y no abría en el iPhone**.
   > 🌎 **En la vida real:** un carro pasa la revisión en el taller y aun así hace un ruido raro en la carretera.

> ✋ **Para y piensa:** todas tus pruebas pasan. ¿Puedes publicar tranquilo sin abrir la app en un teléfono?

<details>
<summary>Ver la respuesta</summary>

**No.** Las pruebas solo cubren lo que escribiste y casi nunca ven la pantalla. El caso del iPhone lo demuestra: todo verde, y la app no abría. Siempre se prueba también en un teléfono real.

</details>

```practica
vf :: Si todas las pruebas pasan, la app no tiene ningún error
vf :: Si la regla que escribí está mal, la prueba también va a estar mal
vf :: Las pruebas automáticas normalmente ven si un botón quedó feo
elige :: Copiloto pasó todas las revisiones y no abrió en el iPhone. ¿Qué enseña? :: Que las pruebas no sirven :: Que hay que probar también en un teléfono real :: Que hay que borrar las pruebas
escribe :: Explica con un ejemplo de la vida real por qué una prueba no garantiza que no haya errores. :: Porque solo revisa lo que le pusiste a revisar, como el detector de humo de la cocina, que no avisa de una fuga de agua en el baño.
```

> 🔁 **Repaso:** las pruebas no garantizan cero errores, no saben si la regla es la correcta, casi no ven la pantalla y no reemplazan el teléfono real.

## 4. Palabras que vas a escuchar

> 🎙️ **El profesor:** en un equipo de trabajo vas a oír estas palabras todos los días: "falló el assert", "eso es una regresión", "pon un mock". Vamos a aprenderlas con una sola escena: **una cocina**.

> 🌎 **Otro ejemplo:** En el fútbol: la prueba es el VAR; esperado es la regla ("no puede estar adelantado"); recibido es la jugada real; caso borde es el jugador que está justo en la línea; y la regresión es el error que ya se había corregido y vuelve a pasar.

| Palabra | Significado | 🌎 En la cocina |
|---|---|---|
| **Test** o **prueba** | El programa que revisa | Probar la sopa con la cuchara |
| **Assert** o **expect** | La línea que compara lo esperado con lo recibido | El momento en que dices "debería estar salada" |
| **Esperado** (*expected*) | El resultado correcto | Cómo dice la receta que debe saber |
| **Recibido** (*actual*) | Lo que dio el código | Cómo sabe de verdad |
| **Pasar** (*pass*) | Coincidieron | "Está perfecta" |
| **Fallar** (*fail*) | No coincidieron | "Le falta sal" |
| **Caso borde** | El límite justo de una regla | La tienda abre a las 8:00: ¿qué pasa si llegas a las 8:00 en punto? |
| **Regresión** | Algo que funcionaba y se volvió a dañar | Arreglaste la gotera y ahora la puerta no cierra |
| **Mock** | Una pieza falsa que reemplaza a una real | El muñeco de las pruebas de choque |
| **CI** | La máquina que corre las pruebas sola en cada subida | Un inspector que revisa cada pan que sale del horno, sin que se lo pidas |

Dos que confunden, explicadas más despacio:

- **Caso borde.** Los errores viven en los **límites**. Si la regla es "máximo 2 palabras", el caso borde es **exactamente 2** palabras. Si la regla es "meta de 500", el caso borde es **exactamente 500**. Es donde más se equivoca la gente (¿`>` o `>=`?).
- **Mock.** Si una función llama a internet o a la base de datos, en la prueba no quieres llamar de verdad (es lento, cuesta, o cambia). Pones una **pieza falsa** que responde siempre lo mismo.

> ✋ **Para y piensa:** el ascensor dice "máximo 8 personas". ¿Cuál es el caso borde?

<details>
<summary>Ver la respuesta</summary>

**Exactamente 8 personas.** Con 7 está claro que sí, con 9 está claro que no; con 8 es donde se ve si la regla está bien escrita.

</details>

```practica
elige :: ¿Qué es una regresión? :: Un error nuevo en algo que nunca funcionó :: Algo que funcionaba y se volvió a dañar :: Una prueba que pasa
elige :: ¿Qué es un mock? :: Una prueba que falla :: Una pieza falsa que reemplaza a una real en la prueba :: El resultado esperado
elige :: La regla es "meta de 500". ¿Cuál es el caso borde? :: 300 :: 500 :: 700
vf :: "Actual" en inglés, en una prueba, quiere decir "lo recibido"
vf :: Assert y expect hacen cosas distintas
escribe :: Con tus palabras: ¿qué es el CI? :: Una máquina que corre todas las pruebas sola cada vez que subes cambios a GitHub.
```

> 🔁 **Repaso:** prueba, assert/expect, esperado, recibido, pasar, fallar, caso borde (el límite exacto), regresión (algo que se volvió a romper), mock (pieza falsa) y CI (la máquina que corre todo sola).

## 5. Los tres tipos

> 🎙️ **El profesor:** no todas las pruebas son iguales. Hay pruebas chiquitas que revisan una función, y pruebas grandes que usan la app entera como si fueran un conductor. Vamos a ver las tres y por qué se reparten en forma de **pirámide**.

> 🌎 **En la vida real:** Es como revisar una casa: primero cada enchufe (unitaria), después que la luz y el agua funcionen juntas (integración), y al final vivir un día entero en ella (E2E).

> 🌎 **Otro ejemplo:** Es como preparar una fiesta: pruebas cada plato (unitaria), que la comida y las bebidas lleguen juntas a la mesa (integración) y, al final, el ensayo completo con invitados (E2E).

### Unitaria, integración y de punta a punta

> 🌎 **Otro ejemplo:** En un restaurante: probar la salsa sola (unitaria), probar el plato completo (integración) y que un cliente misterioso pida, coma y pague (E2E).

| Tipo | Qué revisa | 🌎 Con un carro | Velocidad |
|---|---|---|---|
| **Unitaria** | **Una** función sola | Probar **una bujía** en la mesa: ¿da chispa? | Milisegundos |
| **Integración** | Varias piezas **juntas** | Encender el **motor completo** | Segundos |
| **E2E** (*end to end*, de punta a punta) | La app entera, como un usuario | Un piloto **maneja por la calle** | Minutos |

### La pirámide

```text
      /\        E2E: pocas (lentas y frágiles)
     /  \
    /----\      Integración: algunas
   /      \
  /--------\    Unitarias: muchas (rápidas y baratas)
```

¿Por qué así? Porque las unitarias son **rápidas, baratas y te dicen exactamente dónde está el error**. Las E2E son **lentas** y, cuando fallan, no sabes qué pieza fue.

> 🌎 **En la vida real:** haces miles de pruebas de bujías, cientos de motores encendidos y pocas vueltas por la calle. Si solo hicieras vueltas por la calle, tardarías días en descubrir que la bujía era el problema.

> 🌎 **Otro ejemplo:** Como estudiar para un examen: muchas preguntas cortas de repaso (rápidas), algunos ejercicios largos y un solo simulacro completo antes del examen.

### Una prueba E2E de verdad

> 🌎 **En la vida real:** Es como un cliente misterioso que entra a tu tienda, pide un producto, paga y revisa que le den el ticket. Prueba la tienda entera, como lo haría un cliente de verdad.

> 🌎 **Otro ejemplo:** Es como el robot de una fábrica de autos que se sienta al volante, prende el carro, maneja una vuelta y estaciona, siempre igual.

Para apps de celular existe **Maestro** (para web: Playwright y Cypress). Mira qué fácil se lee:

```yaml
- launchApp
- tapOn: "Registrar ingreso"
- inputText: "100"
- tapOn: "Guardar registro"
- assertVisible: "Guardado con éxito"
```

Línea por línea: abre la app, toca "Registrar ingreso", escribe 100, toca "Guardar registro", y **comprueba** que se vea "Guardado con éxito". Es un robot haciendo lo que haría un conductor.

> ✋ **Para y piensa:** ¿qué tipo es cada una? (a) revisar que `isImmutableEarningPlatform('extras')` dé `true`; (b) un robot que abre la app y registra un ingreso; (c) revisar que la pantalla de ingresos y la base de datos guarden juntas un registro.

<details>
<summary>Ver la respuesta</summary>

(a) **Unitaria**: una función sola. (b) **E2E**: la app entera como usuario. (c) **Integración**: varias piezas juntas.

</details>

```practica
elige :: Probar una sola función, como `faltaParaMeta`, es una prueba… :: unitaria :: de integración :: E2E
elige :: ¿Qué tipo debería haber en mayor cantidad? :: E2E :: Integración :: Unitarias
elige :: Un robot que abre la app, toca botones y mira la pantalla es una prueba… :: unitaria :: E2E :: de integración
vf :: Las pruebas E2E son las más rápidas
vf :: En Maestro, `assertVisible` comprueba que algo se vea en la pantalla
escribe :: ¿Por qué hay muchas pruebas unitarias y pocas E2E? :: Porque las unitarias son rápidas, baratas y dicen exactamente dónde está el error; las E2E son lentas, frágiles y cuando fallan no se sabe qué pieza fue.
```

> 🔁 **Repaso:** unitaria (una función), integración (varias piezas juntas), E2E (toda la app como usuario). Muchas unitarias, algunas de integración, pocas E2E: la pirámide.

## 6. Cómo se hace una prueba, paso a paso

> 🎙️ **El profesor:** esta es la parte más importante de la clase. Vamos a hacer una prueba **de principio a fin**, con un ejemplo de tu vida de conductor: **cuánto me falta para la meta del día**. Son ocho pasos. Te recomiendo hacerlos en tu computadora mientras lees; el ejemplo completo está en la carpeta `ejemplo-meta/`.

> 🌎 **En la vida real:** Es como seguir una receta nueva: leer qué plato es, preparar los ingredientes, cocinar, probar, arruinarlo a propósito para entender qué lo arruina, y corregir.

> 🌎 **Otro ejemplo:** Es como armar un mueble con el instructivo: no te saltas pasos, y si algo no encaja vuelves al paso anterior.

### Paso 1. Escribe la regla en palabras

Antes de escribir una sola línea de código, escribe **qué tiene que pasar**, en español:

> Si gané menos que la meta, muestra lo que falta. Si ya llegué o la pasé, falta 0.

Sin una regla clara **no hay prueba posible**, porque no sabrías qué esperar.

> 🌎 **En la vida real:** antes de armar un mueble, lees qué vas a construir: "una mesa de 4 patas, de 1 metro de alto". Si no sabes qué debe salir, no sabes si salió bien.

> 🌎 **Otro ejemplo:** Como el contrato de alquiler antes de mudarte: "el alquiler vence el día 10; si pasa, hay multa". Sin la regla escrita, no sabes si pagaste tarde o no.

### Paso 2. Piensa los casos (y calcula lo esperado tú)

Elige casos que cubran la regla, **incluido el borde**:

| Caso | Ganado | Meta | Esperado |
|---|---|---|---|
| Normal | 300 | 500 | 200 |
| Borde: llegó justo | 500 | 500 | 0 |
| Pasó la meta | 700 | 500 | 0 |

⚠️ La regla de oro: **calcula lo esperado con tu cabeza, ANTES de correr el código.** Si primero corres el código y copias lo que devuelve, solo confirmas lo que ya hace, aunque esté mal.

> 🌎 **En la vida real:** el profesor que corrige un examen tiene las respuestas correctas **antes** de empezar. Si primero leyera las del alumno y después decidiera cuál es la correcta, aprobaría a todos.

> 🌎 **Otro ejemplo:** Como el árbitro que conoce el reglamento antes del partido: no decide qué es falta mirando qué hizo el jugador; ya sabía la regla.

### Paso 3. El código (`meta.js`)

```js
function faltaParaMeta(ganado, meta) {
  return Math.max(0, meta - ganado);
}

module.exports = { faltaParaMeta };
```

- `meta - ganado` calcula lo que falta: 500 − 300 = 200.
- `Math.max(0, …)` devuelve **el mayor** de los dos números. Si `meta - ganado` da negativo (−200), el mayor entre 0 y −200 es **0**. Así nunca sale negativo.
- `module.exports = { faltaParaMeta }` "pone la función en la vitrina" para que otro archivo (el de las pruebas) la pueda usar. Es el `export` del Tema 01, en el estilo antiguo de Node.

> 🌎 **En la vida real:** `Math.max(0, …)` es el piso de un ascensor: aunque aprietes "bajar" muchas veces, no baja más allá de la planta baja.

> 🌎 **Otro ejemplo:** `Math.max(0, …)` es como el saldo del metro que nunca baja de cero: aunque el viaje cueste más, no te deja en negativo.

### Paso 4. Las pruebas (`meta.test.js`)

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { faltaParaMeta } = require('./meta');

test('si gané 300 y la meta es 500, faltan 200', () => {
  assert.equal(faltaParaMeta(300, 500), 200);
});

test('si llegué justo a la meta, falta 0', () => {
  assert.equal(faltaParaMeta(500, 500), 0);
});

test('si pasé la meta, falta 0 y no un número negativo', () => {
  assert.equal(faltaParaMeta(700, 500), 0);
});
```

Línea por línea:
- `require('node:test')` → trae la herramienta de pruebas que **ya viene con Node** (no hay que instalar nada).
- `require('node:assert/strict')` → trae **el comparador**.
- `require('./meta')` → trae tu función del archivo `meta.js` (el `./` quiere decir "en esta misma carpeta").
- `test('texto', () => { ... })` → crea una prueba. **El texto es la regla en español**: cuando falle, vas a leer exactamente qué regla se rompió.
- `assert.equal(recibido, esperado)` → **compara**. Primero va lo que dio el código, después lo que esperabas.

> 🌎 **En la vida real:** es la hoja del inspector de calidad: el portapapeles (`node:test`), la regla para medir (`assert`), un renglón por revisión (`test`), y la medición "mide 80 cm, debía medir 80 cm ✓" (`assert.equal`).

> 🌎 **Otro ejemplo:** Es como una lista de chequeo de un piloto: cada renglón es una pregunta ("¿combustible?") con la respuesta esperada ("lleno"), y se marca ✓ o ✗.

### Paso 5. Córrelas

> 🌎 **En la vida real:** Es como apretar el botón "probar" de la alarma de humo: en un segundo te dice si funciona.

> 🌎 **Otro ejemplo:** Es como el autodiagnóstico de un carro moderno al encenderlo: revisa todo y te muestra en el tablero si hay algo mal.

```bash
cd ejemplo-meta
node --test
```

```text
# tests 6
# pass 6
# fail 0
```

Salen 6 porque esa carpeta también trae las 3 pruebas del ejercicio del descuento. Lo que siempre quieres ver: **`fail 0`**.

### Paso 6. Sabotea (¡a propósito!)

Esto parece raro, pero es lo que hacen los profesionales: **rompe el código a propósito** para comprobar que la prueba lo detecta. En `meta.js`, quita el `Math.max`:

```js
return meta - ganado;
```

y corre `node --test` otra vez.

¿Por qué? Porque **una prueba que nunca falló no demostró nada**. Podría estar mal escrita y pasar siempre.

> 🌎 **En la vida real:** probar la alarma de la casa abriendo la ventana **a propósito**. Si nunca la probaste, no sabes si funciona o si está desconectada.

> 🌎 **Otro ejemplo:** Como un simulacro de incendio: haces sonar la alarma a propósito para ver si todos saben salir. Si nadie se mueve, el plan no sirve.

### Paso 7. Lee el error

> 🌎 **En la vida real:** Como el resultado de un análisis de sangre: "esperado: azúcar menor a 100; resultado: 140". Te dice qué valor salió mal y cuánto.

> 🌎 **Otro ejemplo:** Como la multa de velocidad: "máximo 60, iba a 80, en la calle tal". Dice qué se esperaba, qué pasó y dónde.

```text
not ok 3 - si pasé la meta, falta 0 y no un número negativo
  expected: 0
  actual: -200
```

Se lee así: "**la prueba 3** (la de pasar la meta) **falló**: esperaba **0**, recibió **−200**". Y tiene sentido: 500 − 700 = −200, porque quitaste la protección.

Fíjate que las pruebas 1 y 2 **siguen pasando**: con 300 da 200 y con 500 da 0, con o sin `Math.max`. Solo la 3 vigila el caso de pasar la meta. **Por eso hacen falta varios casos.**

**Un error no es malo**: es la prueba haciendo su trabajo, avisándote antes que a un conductor.

### Paso 8. Corrige y repite

> 🌎 **En la vida real:** Como apretar un tornillo flojo y volver a probar la mesa hasta que no se mueva.

> 🌎 **Otro ejemplo:** Como un sastre: ajusta la costura, te pruebas el pantalón, y repite hasta que queda justo.

Vuelve a poner el `Math.max` y corre de nuevo hasta ver `fail 0`.

### Cuando una prueba falla, revisa en este orden

1. **¿La regla es correcta?**
2. **¿Mi prueba está bien escrita?**
3. **¿El código está mal?**

El código es **el último** sospechoso, no el primero. Caso real de tu app: una prueba del San falló porque revisaba el 1 de enero, pero la última rodada era el día 4. **La app estaba bien; la prueba estaba mal.**

> 🌎 **En la vida real:** si reclamas que el bus no pasó a las 7:00 cuando el horario decía 7:40, el bus estaba bien: el error era tuyo al mirar el horario.

> 🌎 **Otro ejemplo:** Si la balanza dice que pesas 10 kilos de más, antes de ponerte a dieta revisas: ¿está en cero la balanza?, ¿tenías la mochila puesta? Recién después piensas que engordaste.

> ✋ **Para y piensa:** sin el `Math.max`, ¿qué devuelve `faltaParaMeta(800, 500)`? ¿Qué prueba lo atrapa?

<details>
<summary>Ver la respuesta</summary>

**−300** (500 − 800). Lo atrapa la prueba "si pasé la meta, falta 0", porque espera 0.

</details>

```practica
escribe :: Di los 8 pasos para hacer una prueba, en orden. :: Regla en palabras → pensar los casos (y calcular lo esperado) → código → pruebas → correrlas → sabotear → leer el error → corregir y repetir.
vf :: Lo esperado se calcula corriendo el código y copiando lo que devuelve
vf :: `Math.max(0, -200)` devuelve 0
vf :: Sabotear el código a propósito sirve para comprobar que la prueba de verdad detecta errores
elige :: En `assert.equal(faltaParaMeta(300, 500), 200)`, ¿qué es el 200? :: Lo recibido :: Lo esperado :: El error
elige :: El error dice `expected: 0` y `actual: -200`. ¿Qué pasó? :: La prueba pasó :: Esperaba 0 y el código dio -200 :: Esperaba -200 y dio 0
elige :: Una prueba falla. ¿Qué revisas primero? :: El código :: Si la regla es correcta :: Si la computadora anda bien
elige :: ¿Qué hace `module.exports = { faltaParaMeta }`? :: Borra la función :: Permite usar la función desde otro archivo :: Corre las pruebas
```

> 🔁 **Repaso:** regla → casos (lo esperado lo calculas tú) → código → prueba → correr → sabotear → leer el error → corregir. Si falla, sospecha primero de la regla, después de la prueba y por último del código.

## 7. Las pruebas de tu app

> 🎙️ **El profesor:** ahora mira lo que ya tienes. Tu app no tiene "algunas pruebas": tiene **más de 400**, en cuatro grupos. Esto es algo de lo que puedes hablar con orgullo en una entrevista.

> 🌎 **En la vida real:** Es como un edificio grande con inspección de luz, agua, gas y ascensores, cada una con su inspector. Tu app tiene sus cuatro inspectores.

> 🌎 **Otro ejemplo:** Es como un hospital con médicos de distintas especialidades: cada grupo de pruebas cuida una parte del cuerpo de la app.

### Los cuatro grupos (al 10/11/2026)

| Grupo | Cuántas | Dónde están | Herramienta | Cómo se corren |
|---|---|---|---|---|
| App | 187 | `src/**/__tests__/` | Jest | `npm test` |
| Servidor (Cloud Functions) | 153 | `functions/test/` | node:test | `cd functions && npm test` |
| Reglas de seguridad de Firestore | 23 | `rules-test/` | node:test + emulador de Firebase | `cd rules-test && npm test` |
| Cartón automático (Android) | 61 | `modules/ride-overlay/android/src/test/` | JUnit (Kotlin) | lo corre el CI (Tema 04) |

> 🌎 **En la vida real:** un edificio con distintos inspectores: el electricista (la app), el de la oficina central (el servidor), el cerrajero de cada apartamento (las reglas de seguridad) y el de los ascensores (el cartón automático de Android).

> 🌎 **Otro ejemplo:** Como un auto revisado por distintos talleres: el mecánico del motor, el electricista, el cerrajero de las puertas y el especialista en la radio.

Los números cambian: cada vez que se agrega algo importante, se agregan sus pruebas.

### Qué protegen

> 🌎 **En la vida real:** Cada archivo de prueba es como un guardia en una puerta distinta: uno cuida la caja (el dinero), otro el reloj (el día de Uber), otro el tanque.

> 🌎 **Otro ejemplo:** Es como la lista de cosas que revisa tu seguro: motor, vidrios, robo… Cada prueba cubre un riesgo con nombre.

| Archivo | Qué regla protege |
|---|---|
| `earningSourceRules.test.ts` | Mi empresa, Particulares y Extras son independientes; Uber acumula; Extras no entra en el tanque; un extra de la cartera cuenta una sola vez |
| `appFiscalDay.test.ts` | Para Uber, el día cambia a las **04:00**, no a medianoche |
| `fuelLevel.test.ts` | La barra de combustible |
| `sanPaymentReminders.test.ts` | Los avisos del San, y que no llegue el aviso si ya pagaste |
| `earningsLogic.test.js` | Que el Copiloto entienda igual "mi empresa" que "minha empresa" |
| `firestore.rules.test.js` | Que **nadie lea los datos de otra persona** |

### Una prueba de tu app, leída

Del archivo `earningSourceRules.test.ts` (un poco simplificado):

```ts
it('Minha empresa, Corridas particulares e Extras nunca acumulam', () => {
  for (const appId of ['my_company', 'particular_trips', 'extras']) {
    expect(isImmutableEarningPlatform(appId)).toBe(true);
  }
});
```

¡Es la función que leíste en el Tema 01! Línea por línea:
- `it('...')` es lo mismo que `test('...')`, pero con otra herramienta: **Jest**. El texto (en portugués) dice: "Mi empresa, Viajes particulares y Extras nunca acumulan".
- `for (const appId of [...])` repite lo de adentro **con cada uno** de los tres ids.
- `expect(...).toBe(true)` es lo mismo que `assert.equal(..., true)`: "espero que esto sea `true`".

Si alguien cambia esa función sin querer y Mi empresa empieza a acumular, **esta prueba falla** y el error no llega a Google Play.

> 🌎 **En la vida real:** el `for` es el inspector que revisa los **tres** extintores del piso con la misma pregunta, en vez de escribir tres hojas iguales.

> 🌎 **Otro ejemplo:** Como el profesor que pasa lista con la misma pregunta para tres alumnos: "¿trajo la tarea?", en vez de escribir tres preguntas iguales.

```practica
elige :: ¿Cuántas pruebas automáticas tiene tu app, más o menos? :: Unas 40 :: Más de 400 :: Ninguna
elige :: ¿Qué prueba protege que nadie lea los datos de otra persona? :: `fuelLevel.test.ts` :: `firestore.rules.test.js` :: `appFiscalDay.test.ts`
elige :: En Jest, `expect(x).toBe(true)` es lo mismo que… :: `test(x)` :: `assert.equal(x, true)` :: `return true`
vf :: `it` y `test` hacen lo mismo
vf :: Para Uber, el día cambia a medianoche
escribe :: Explica qué hace la prueba de `earningSourceRules` que leímos. :: Revisa con un `for` que Mi empresa, Viajes particulares y Extras den `true` en `isImmutableEarningPlatform`, o sea, que nunca acumulen. Si alguien rompe la función, la prueba falla.
```

> 🔁 **Repaso:** tu app tiene más de 400 pruebas en cuatro grupos (app con Jest, servidor y reglas con node:test, Android con JUnit). Protegen el dinero, el día de Uber, el tanque, el San, el Copiloto y la privacidad.

## 8. Cómo es en un proyecto real

> 🎙️ **El profesor:** para cerrar, el recorrido completo de un cambio en una empresa. Esto es exactamente lo que te van a preguntar: "¿cómo trabajas?".

1. Cambias el código.
2. Corres las pruebas **en tu computadora**.
3. Subes a GitHub.
4. El **CI** las corre otra vez **en una máquina limpia** (Tema 04).
5. Si algo falla, lo sabes **en minutos**.

¿Por qué correrlas dos veces (en tu compu y en el CI)? Porque en tu computadora puede haber algo instalado que hace que funcione "de casualidad". La máquina limpia no tiene nada extra: si ahí pasa, funciona de verdad.

> 🌎 **En la vida real:** el cocinero prueba la receta en su cocina, y el jefe la vuelve a probar en una cocina limpia, por si en la casa del cocinero había algo que la hacía salir bien de casualidad.

> 🌎 **Otro ejemplo:** Como una receta de la abuela que funciona en su cocina, pero que alguien prueba en otra cocina antes de venderla en la panadería: así sabes que no dependía de su horno.

```practica
escribe :: Describe los 5 pasos de un cambio en un proyecto real. :: Cambio el código, corro las pruebas en mi computadora, subo a GitHub, el CI las corre otra vez en una máquina limpia, y si algo falla me entero en minutos.
vf :: Si las pruebas pasan en mi computadora, no hace falta el CI
elige :: ¿Dónde corre el CI las pruebas? :: En el teléfono del usuario :: En una máquina limpia, cada vez que subes :: Solo cuando tú se lo pides
```

> 🔁 **Repaso:** cambias, pruebas en tu compu, subes, el CI repite en una máquina limpia, y te enteras en minutos si algo se rompió.

## Ejercicios

> 🎙️ **El profesor:** ahora en tu computadora. Abre la terminal y entra a la carpeta de esta clase.

> 🌎 **En la vida real:** Es como practicar estacionar en un estacionamiento vacío: si chocas un cono, no pasa nada, y aprendes.

1. En `ejemplo-meta`, corre `node --test` y anota cuántas pasan.
2. Haz el sabotaje del Paso 6 y **lee el error en voz alta**: qué prueba, qué esperaba, qué recibió.
3. **Ejercicio del descuento:** escribe tú la función `aplicarDescuento(precio, porcentaje)` y pruébala con 20 %, 0 % y 100 %. Después sabotéala cambiando el `-` por `+`.
4. En la carpeta de la app, corre `npm test` y busca la línea `Tests:`. ¿Cuántas pasaron?

<details>
<summary>Ver las correcciones explicadas</summary>

1. **6 pasan, 0 fallan** (3 de la meta y 3 del descuento).
2. Falla la prueba 3: "si pasé la meta, falta 0…", `expected: 0`, `actual: -200`. Las otras dos siguen pasando.
3. Una solución:

```js
function aplicarDescuento(precio, porcentaje) {
  return precio - (precio * porcentaje) / 100;
}
module.exports = { aplicarDescuento };
```

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { aplicarDescuento } = require('./descuento');

test('100 con 20 % de descuento queda en 80', () => {
  assert.equal(aplicarDescuento(100, 20), 80);
});
test('con 0 % de descuento el precio no cambia', () => {
  assert.equal(aplicarDescuento(100, 0), 100);
});
test('con 100 % de descuento queda en 0', () => {
  assert.equal(aplicarDescuento(100, 100), 0);
});
```

Al cambiar el `-` por `+`: con 20 % da **120** (esperaba 80) y con 100 % da **200** (esperaba 0): **fallan 2**. La de 0 % **sigue pasando**, porque sumar o restar 0 da lo mismo. La lección: **un solo caso no alcanza**; con solo la prueba del 0 %, el error pasaría inadvertido.

4. Busca una línea como `Tests: 187 passed, 187 total`. El número puede ser otro si se agregaron pruebas.

</details>

```practica
elige :: Con el `-` cambiado por `+`, ¿cuántas de las 3 pruebas del descuento fallan? :: 0 :: 1 :: 2 :: 3
vf :: Con solo la prueba de 0 % habríamos atrapado el sabotaje del descuento
elige :: `aplicarDescuento(100, 20)` debería dar… :: 120 :: 80 :: 20
```

## Para la entrevista

> 🎙️ **El profesor:** responde en voz alta, como si estuvieras frente al entrevistador. Después compara.

> 🌎 **En la vida real:** Es como explicarle a un amigo cómo revisas tu carro antes de un viaje largo: con tus palabras y con lo que de verdad haces.

> 🎤 **Entrevista:** "¿Para qué sirven las pruebas?"

<details>
<summary>Ver una buena respuesta</summary>

"Para comprobar automáticamente que el código cumple las reglas, detectar errores antes que los usuarios y poder cambiar el código con seguridad. En mi app, las pruebas detectaron que registros con 'Uber' y 'uber' el mismo día se sumaban el doble, un error de dinero que no se veía en la pantalla."

</details>

> 🎤 **Entrevista:** "¿Cómo haces una prueba?"

<details>
<summary>Ver una buena respuesta</summary>

"Escribo la regla en palabras, elijo casos normales y de borde, calculo el resultado esperado antes de correr el código, escribo la prueba, la corro, y la saboteo a propósito para confirmar que de verdad detecta el error."

**Lo que diferencia:** mencionar **el caso borde** y **el sabotaje**. Muestra que no escribes pruebas "de adorno".

</details>

> 🎤 **Entrevista:** "¿Las pruebas garantizan que no hay errores?"

<details>
<summary>Ver una buena respuesta</summary>

"No. Solo cubren los casos escritos, y casi nunca ven la pantalla. Por eso también pruebo en teléfonos reales: tuve una versión que pasaba todas las pruebas y no abría en el iPhone."

</details>

> 🎤 **Entrevista:** "¿Qué es TDD? ¿Y la cobertura?"

<details>
<summary>Ver una buena respuesta</summary>

"TDD es escribir primero la prueba y después el código, como el sastre que toma las medidas antes de cortar. La cobertura es el porcentaje del código que las pruebas ejecutan; un número alto no garantiza que las pruebas sean buenas, porque pueden pasar por el código sin comprobar lo importante."

</details>

```practica
escribe :: ¿Qué es TDD? :: Escribir primero la prueba y después el código.
escribe :: ¿Qué es la cobertura y por qué un número alto no alcanza? :: El porcentaje del código que ejecutan las pruebas. No alcanza porque las pruebas pueden pasar por el código sin comprobar bien las reglas.
vf :: 90 % de cobertura quiere decir que la app no tiene errores
```

## Para memorizar

> 🎙️ **El profesor:** si de toda esta clase te quedas con una sola línea, que sea esta:

**Regla → casos → código → prueba → correr → sabotear → leer el error → corregir.**

> 🌎 **En la vida real:** es como lavarse las manos: mojar → jabón → frotar → enjuagar → secar. Siempre en el mismo orden, sin pensarlo.

```practica
escribe :: Escribe de memoria la secuencia para hacer una prueba. :: Regla → casos → código → prueba → correr → sabotear → leer el error → corregir.
```

> 🔁 **Repaso final de la clase:** sabes qué es una prueba, para qué sirve y sus límites, el vocabulario, los tres tipos y la pirámide, cómo se hace una paso a paso (con sabotaje incluido), qué pruebas tiene tu app y cómo se trabaja en un equipo real. Próxima: **Tema 03, Mi primera prueba**.
