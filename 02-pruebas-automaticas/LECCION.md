# Tema 02: Pruebas automáticas

> 🌎 **En la vida real:** piensa en la revisión técnica de un carro. Antes de dejarlo salir a la calle, alguien comprueba con una lista: frenos ✔, luces ✔, cinturones ✔. Las pruebas automáticas son esa lista, pero la revisa una máquina sola, cada vez que tocas algo.

## 1. ¿Qué es una prueba?

> 🌎 **En la vida real:** es como el panadero que, antes de abrir, prueba un pan de cada horneada. Sabe cómo **debe** saber (lo esperado), lo muerde (lo recibido) y compara. Si sabe a sal en vez de azúcar, para todo antes de venderlo. Una prueba automática hace ese mordisco sola, en milisegundos, cada vez que cambias la receta.

> 🌎 **Otro ejemplo:** Es como la prueba de alcoholemia: soplas (le das un dato), la máquina compara con el límite (lo esperado) y dice aprobado o reprobado, en segundos y siempre igual.

Una prueba es un pequeño programa que revisa si otro programa hace lo correcto.

Piensa en una calculadora. Sabes que 2 + 2 debe dar 4. Si la pruebas a mano, escribes la suma y miras el resultado. Una prueba automática hace lo mismo, pero la máquina lo revisa sola, en milisegundos, cada vez que cambias algo.

Toda prueba hace la misma pregunta:

> Con estos datos, ¿el resultado es el que yo esperaba?

## 2. ¿Para qué sirve?

> 🌎 **En la vida real:** piensa en las luces del tablero del carro:
> - **Encontrar errores**: la luz de aceite se enciende antes de que se funda el motor, no después.
> - **Proteger lo que ya funciona**: el mecánico te cambia los frenos y, al prender el carro, el tablero te avisa si desconectó el sensor del ABS sin querer.
> - **Cambiar sin miedo**: puedes cambiar la radio tranquilo porque, si tocas un cable que no debías, una luz se enciende.
> - **Dejar claras las reglas**: el manual dice "la presión de las llantas debe ser 32". Una prueba es esa frase escrita para que la revise una máquina.
> - **Ahorrar tiempo**: no tienes que abrir el capó y revisar todo a mano cada mañana.
>
> El caso de `Uber` y `uber` es como un cajero que cuenta dos veces el mismo billete porque uno estaba al derecho y otro al revés.

> 🌎 **Otro ejemplo:** Es como el seguro del carro: pagas un poco siempre (escribir pruebas) para no pagar muchísimo el día del choque (un error que llega a los usuarios).

| Para qué | Qué significa |
|---|---|
| Encontrar errores | Detecta un fallo antes que los usuarios |
| Proteger lo que ya funciona | Si arreglas algo y dañas otra cosa, te avisa |
| Cambiar sin miedo | Mejoras el código y la prueba te dice si rompiste algo |
| Dejar claras las reglas | La prueba explica qué debe pasar |
| Ahorrar tiempo | No revisas todo a mano en cada cambio |

**Ejemplo real de Copiloto:** las pruebas encontraron que una cuenta con `Uber` y `uber` el mismo día sumaba el doble. A simple vista la app parecía bien. Un error de dinero así puede pasar meses sin que nadie lo note.

**Comparación:** una prueba es como la alarma de humo. No apaga el fuego, pero avisa antes de que se queme la casa.

## 3. Lo que una prueba NO hace

> 🌎 **En la vida real:** - **No prueba que no haya errores**: el detector de humo de la cocina no te avisa si hay una fuga de agua en el baño. Solo vigila lo que le pusiste a vigilar.
> - **No sabe cuál es la regla correcta**: si la receta dice "2 kilos de sal" y el panadero la sigue al pie de la letra, el pan sale "correcto" según la receta, pero incomible.
> - **No ve la pantalla**: una balanza dice que el pastel pesa 1 kg, pero no te dice si está feo.
> - **No reemplaza el teléfono real**: un carro puede pasar la revisión en el taller y aun así hacer un ruido raro en la carretera. Hay que manejarlo de verdad.

> 🌎 **Otro ejemplo:** Es como un examen de matemáticas: si aprobaste las 10 preguntas, sabes esas 10, no toda la matemática.

- **No prueba que no existan errores.** Solo revisa los casos que escribiste.
- **No sabe cuál es la regla correcta.** Si la regla está mal, la prueba también.
- **Normalmente no ve la pantalla.** No sabe si algo se ve feo.
- **No reemplaza probar en un teléfono real.** Copiloto tuvo una versión que pasaba todas las revisiones y no abría en el iPhone.

## 4. Palabras que vas a escuchar

> 🌎 **En la vida real:** todo esto pasa en una cocina:
> - **Prueba**: probar la sopa con la cuchara.
> - **Assert / expect**: el momento en que dices "debería estar salada".
> - **Esperado**: cómo dice la receta que debe saber.
> - **Recibido**: cómo sabe de verdad.
> - **Pasar / fallar**: "está perfecta" / "le falta sal".
> - **Caso borde**: el límite. La tienda abre a las 8:00: ¿qué pasa si llegas justo a las 8:00 en punto?
> - **Regresión**: arreglaste la gotera del techo y ahora la puerta no cierra, cuando antes cerraba bien.
> - **Mock**: el muñeco de pruebas de choque. No es una persona de verdad, pero ocupa su lugar para probar el cinturón sin lastimar a nadie.
> - **CI**: un inspector que revisa cada pan que sale del horno, sin que se lo pidas.

> 🌎 **Otro ejemplo:** En el fútbol: la prueba es el VAR; esperado, la regla; recibido, la jugada; caso borde, el jugador justo en la línea; y regresión, el error que ya se había corregido y vuelve a pasar.

| Palabra | Significado |
|---|---|
| Test o prueba | El programa que revisa |
| Assert o expect | La línea que compara lo esperado con lo recibido |
| Esperado | El resultado correcto |
| Recibido (actual) | El resultado que dio el código |
| Pasar | Coincidieron |
| Fallar | No coincidieron |
| Caso borde | El límite de una regla, como llegar justo a la meta |
| Regresión | Algo que funcionaba y se volvió a dañar |
| Mock | Una pieza falsa que reemplaza a una real (por ejemplo, para no llamar a internet) |
| CI | La máquina que corre las pruebas sola en cada subida (Tema 04) |

## 5. Los tres tipos

> 🌎 **En la vida real:** construir un carro:
> - **Unitaria**: el fabricante prueba **una** bujía en la mesa: ¿da chispa? Rápido y barato.
> - **Integración**: monta el motor completo y lo enciende: ¿las piezas funcionan **juntas**?
> - **E2E (punta a punta)**: un piloto saca el carro a la calle, frena, dobla y estaciona, como un cliente real. Es lo más completo, pero lento y caro.
>
> **La pirámide**: haces miles de pruebas de bujías, cientos de motores encendidos y pocas vueltas por la calle. Si solo hicieras vueltas por la calle, tardarías días en descubrir que la bujía era el problema.
>
> El ejemplo de **Maestro** es como un robot que agarra tu celular y hace exactamente lo que haría un conductor: abre la app, toca "Registrar ingreso", escribe 100, guarda y mira si aparece "Guardado con éxito".

> 🌎 **Otro ejemplo:** Es como revisar una casa: cada enchufe (unitaria), la luz y el agua funcionando juntas (integración), y vivir un día entero en ella (E2E).

| Tipo | Qué revisa | Con un carro | Velocidad |
|---|---|---|---|
| **Unitaria** | Una función sola | Probar una bujía | Milisegundos |
| **Integración** | Varias piezas juntas | Encender el motor completo | Segundos |
| **E2E** (de punta a punta) | La app entera, como un usuario | Manejar por la calle | Minutos |

**La pirámide:** muchas unitarias abajo (rápidas y baratas), algunas de integración y pocas E2E arriba (lentas y frágiles).

```
      /\        E2E: pocas
     /  \
    /----\      Integración: algunas
   /      \
  /--------\    Unitarias: muchas
```

Un ejemplo de E2E con **Maestro**, una herramienta para apps móviles (Playwright y Cypress son las de web):

```yaml
- launchApp
- tapOn: "Registrar ingreso"
- inputText: "100"
- tapOn: "Guardar registro"
- assertVisible: "Guardado con éxito"
```

## 6. Cómo se hace una prueba, paso a paso

> 🌎 **En la vida real:** es la misma forma de probar una receta nueva antes de venderla en tu restaurante: escribes la receta, piensas qué puede salir mal, cocinas, la pruebas, la arruinas a propósito para ver si te das cuenta, y corriges.

> 🌎 **Otro ejemplo:** Es como armar un mueble con el instructivo: no te saltas pasos, y si algo no encaja vuelves al paso anterior.

El ejemplo completo está en la carpeta `ejemplo-meta/`. Queremos una función que diga cuánto falta para una meta.

### Paso 1. Escribe la regla en palabras

> 🌎 **En la vida real:** antes de armar un mueble, lees en una frase qué vas a construir: "una mesa de 4 patas, de 1 metro de alto". Si no sabes qué debe salir, no puedes saber si salió bien.
>
> Con la meta: "si quiero juntar 500 en el día y llevo 300, me faltan 200; si ya junté 500 o más, no me falta nada".
> Si gané menos que la meta, muestra lo que falta. Si ya llegué o la pasé, falta 0.

> 🌎 **Otro ejemplo:** Como el contrato de alquiler: "vence el día 10; si pasa, hay multa". Sin la regla escrita, no sabes si pagaste tarde.

Sin regla clara no hay prueba posible.

### Paso 2. Piensa los casos

> 🌎 **En la vida real:** un profesor que corrige un examen ya tiene las respuestas correctas **antes** de empezar. Si primero leyera las respuestas del alumno y después decidiera cuál es la correcta, aprobaría a todos.
> - **Normal**: llevas 300, la meta es 500 → faltan 200.
> - **Borde**: llegaste justo a 500 → falta 0. Es como el ascensor que dice "máximo 8 personas": ¿entra la octava? Los límites son donde más se equivoca la gente.
> - **Pasaste**: llevas 700 → falta 0, no "−200". Nadie dice "me faltan menos doscientos reales".

> 🌎 **Otro ejemplo:** Como el árbitro que conoce el reglamento antes del partido: no decide qué es falta mirando lo que hizo el jugador.

| Caso | Ganado | Meta | Esperado |
|---|---|---|---|
| Normal | 300 | 500 | 200 |
| Borde: llegó justo | 500 | 500 | 0 |
| Pasó la meta | 700 | 500 | 0 |

Calcula el resultado **antes** de correr el código. Si copias lo que el código devuelve, solo confirmas lo que ya hace, aunque esté mal.

### Paso 3. El código (`meta.js`)

> 🌎 **En la vida real:** `Math.max(0, ...)` es como el piso de un ascensor: aunque aprietes "bajar" muchas veces, no baja más allá de la planta baja. El resultado nunca queda debajo de 0.
>
> `module.exports` es como poner un producto en la vitrina de la tienda: si no lo pones ahí, nadie de afuera lo puede comprar (ningún otro archivo lo puede usar).

> 🌎 **Otro ejemplo:** `Math.max(0, …)` es como el saldo de la tarjeta del metro que nunca baja de cero.
```js
function faltaParaMeta(ganado, meta) {
  return Math.max(0, meta - ganado);
}

module.exports = { faltaParaMeta };
```
- `meta - ganado` calcula lo que falta.
- `Math.max(0, ...)` evita que el resultado sea negativo.
- `module.exports` permite usar la función en otro archivo.

### Paso 4. Las pruebas (`meta.test.js`)

> 🌎 **En la vida real:** es la hoja del inspector de calidad:
> - `require('node:test')` = traer el portapapeles con la hoja de revisión.
> - `require('node:assert/strict')` = traer la regla para medir.
> - `test('...')` = cada renglón de la hoja: "la puerta debe cerrar sola".
> - `assert.equal(recibido, esperado)` = medir y comparar: "mide 80 cm, debía medir 80 cm ✔".

> 🌎 **Otro ejemplo:** Es como la lista de chequeo de un piloto: cada renglón es una pregunta con la respuesta esperada, y se marca ✓ o ✗.
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
- `require('node:test')` trae la herramienta de pruebas de Node.
- `require('node:assert/strict')` trae el comparador.
- `test('...')` crea una prueba. El texto dice la regla.
- `assert.equal(recibido, esperado)` compara los dos.

### Paso 5. Córrelas

> 🌎 **En la vida real:** es apretar el botón de "autodiagnóstico" de la lavadora: en segundos te dice "6 revisiones, 6 bien, 0 mal". Siempre quieres ver **0 mal** (`fail 0`).

> 🌎 **Otro ejemplo:** Es como el autodiagnóstico del carro al encenderlo: en segundos te muestra en el tablero si hay algo mal.
```bash
cd ejemplo-meta
node --test
```
```text
# tests 6
# pass 6
# fail 0
```
Salen 6 porque esa carpeta también trae las 3 pruebas del ejercicio del descuento. Quieres siempre `fail 0`.

### Paso 6. Sabotea

> 🌎 **En la vida real:** es como probar la alarma de la casa: abres la ventana **a propósito** para ver si suena. Si nunca la probaste, no sabes si funciona o si está desconectada. Una prueba que nunca falló es una alarma que nunca sonó.

> 🌎 **Otro ejemplo:** Como un simulacro de incendio: haces sonar la alarma a propósito para ver si todos saben salir.
Una prueba que nunca ha fallado no ha demostrado nada. En `meta.js` quita el `Math.max`:
```js
return meta - ganado;
```
Corre `node --test` otra vez.

### Paso 7. Lee el error

> 🌎 **En la vida real:** el mensaje del error es como la nota que deja el mecánico: "esperaba 32 libras de presión en la llanta, encontré 20". Te dice qué esperaba, qué encontró y dónde. Con eso sabes exactamente qué arreglar.

> 🌎 **Otro ejemplo:** Como el resultado de un análisis: "esperado: azúcar menor a 100; resultado: 140". Dice qué salió mal y cuánto.
```text
not ok 3 - si pasé la meta, falta 0 y no un número negativo
  expected: 0
  actual: -200
```
Se lee: "si pasé la meta, debía dar 0, pero dio -200". 500 − 700 = −200, porque quitaste la protección.

**Un error no es malo.** La prueba que falla te avisa antes de que le pase a un usuario.

### Paso 8. Corrige y repite

> 🌎 **En la vida real:** como afinar una guitarra: giras la clavija, tocas la cuerda, escuchas, y repites hasta que suene bien. Corriges y corres las pruebas hasta ver `fail 0`.

> 🌎 **Otro ejemplo:** Como un sastre: ajusta, te pruebas el pantalón, y repite hasta que queda justo.
Devuelve el `Math.max` y corre de nuevo hasta ver `fail 0`.

### Cuando una prueba falla, revisa en este orden

> 🌎 **En la vida real:** si el GPS te manda a un lugar raro, revisas en orden:
> 1. **¿La regla es correcta?** ¿Escribiste bien la dirección a donde querías ir?
> 2. **¿La prueba está bien escrita?** ¿El GPS entendió bien lo que escribiste, o escribiste "Rua das Flores" en otra ciudad?
> 3. **¿El código está mal?** Recién ahí piensas que el GPS tiene un error.
>
> El caso del San es como reclamar que el bus no pasó a las 7:00 cuando el horario decía 7:40: el bus estaba bien, el error era tuyo al mirar el horario.

> 🌎 **Otro ejemplo:** Si la balanza dice que pesas 10 kilos de más, antes de ponerte a dieta revisas: ¿está en cero?, ¿tenías la mochila puesta?
1. **¿La regla es correcta?**
2. **¿Mi prueba está bien escrita?**
3. **¿El código está mal?**

**Caso real:** una prueba del San falló porque revisaba el 1 de enero, y la última rodada era el 4. La app estaba bien; el error era de la prueba.

## 7. Las pruebas de Copiloto

> 🌎 **En la vida real:** un edificio tiene distintos inspectores: el electricista revisa los cables, el plomero las tuberías, el bombero las salidas de emergencia y el de ascensores, los ascensores. La app Copiloto tiene cuatro grupos de inspectores:
> - **App (187)**: revisan las cuentas y la pantalla del teléfono.
> - **Servidor (153)**: revisan lo que pasa en la "oficina central" en la nube.
> - **Reglas de seguridad (23)**: revisan que las cerraduras de cada apartamento funcionen.
> - **Cartón automático (61)**: revisan la parte que lee las ofertas de viaje en Android.

> 🌎 **Otro ejemplo:** Es como un hospital con médicos de distintas especialidades: cada grupo de pruebas cuida una parte de la app.

Al 10/11/2026 Copiloto Driver tiene **más de 400 pruebas automáticas**, en cuatro grupos:

| Grupo | Cuántas | Dónde están | Herramienta | Cómo se corren |
|---|---|---|---|---|
| App | 187 | `src/**/__tests__/` | Jest | `npm test` |
| Servidor (Cloud Functions) | 153 | `functions/test/` | node:test | `cd functions && npm test` |
| Reglas de seguridad de Firestore | 23 | `rules-test/` | node:test + emulador de Firebase | `cd rules-test && npm test` |
| Cartón automático (Android) | 61 | `modules/ride-overlay/android/src/test/` | JUnit (Kotlin) | lo corre el CI (Tema 04) |

Los números cambian: cada vez que se agrega algo importante, se agregan sus pruebas.

### Qué protegen (ejemplos reales)

> 🌎 **En la vida real:** cada archivo de pruebas es como una cámara de seguridad apuntando a un lugar específico:
> - `earningSourceRules`: la caja registradora. Que no se sume dos veces la misma plata.
> - `appFiscalDay`: el reloj. Para Uber el día "cambia" a las 4 de la madrugada, como una panadería que cierra caja a las 4 y no a medianoche.
> - `fuelLevel`: el medidor de gasolina del tablero.
> - `sanPaymentReminders`: el que te recuerda pagar la cuota del San, y que no te moleste si ya pagaste.
> - `earningsLogic`: que el asistente entienda igual "mi empresa" que "minha empresa", como un recepcionista bilingüe.
> - `firestore.rules`: la cerradura de cada casillero del gimnasio, para que nadie abra el del vecino.

> 🌎 **Otro ejemplo:** Es como la lista de cosas que cubre tu seguro: motor, vidrios, robo. Cada prueba cubre un riesgo con nombre.

| Archivo | Qué regla protege |
|---|---|
| `src/utils/__tests__/earningSourceRules.test.ts` | Mi empresa, Particulares y Extras son independientes; Uber y las plataformas nuevas acumulan; Extras no entra en el tanque; un extra de la cartera cuenta una sola vez |
| `src/utils/__tests__/appFiscalDay.test.ts` | Uber cambia de día a las 04:00 |
| `src/utils/__tests__/fuelLevel.test.ts` | La barra de combustible |
| `src/san/__tests__/sanPaymentReminders.test.ts` | Los avisos del San (y que no llegue el aviso de la mano si ya pagaste) |
| `functions/test/earningsLogic.test.js` | Que el Copiloto entienda "mi empresa" y "minha empresa" |
| `rules-test/firestore.rules.test.js` | Que nadie lea los datos de otra persona |

### Una prueba de Copiloto, leída

> 🌎 **En la vida real:** el `for` es como el inspector que revisa **los tres** extintores del piso, uno por uno, con la misma pregunta: "¿está cargado?". En vez de escribir tres pruebas iguales, escribe una y la repite con cada uno.
>
> `it` y `test` son la misma cosa con distinto nombre, como "carro" y "auto".

> 🌎 **Otro ejemplo:** Como el profesor que pasa lista con la misma pregunta para tres alumnos, en vez de escribir tres preguntas iguales.
Del archivo `earningSourceRules.test.ts` (un poco simplificado para leerlo mejor):

```ts
it('Minha empresa, Corridas particulares e Extras nunca acumulam', () => {
  for (const appId of ['my_company', 'particular_trips', 'extras']) {
    expect(isImmutableEarningPlatform(appId)).toBe(true);
  }
});
```
- `it('...')` es lo mismo que `test('...')`, con otra herramienta: **Jest**.
- `for (const appId of [...])` repite la prueba con los tres ids.
- `expect(...).toBe(true)` es lo mismo que `assert.equal(..., true)`.

Es la función que leíste en el Tema 01. Si alguien la cambia sin querer y Mi empresa empieza a acumular, esta prueba falla y el error no llega a Google Play.

## 8. Cómo es en un proyecto real

> 🌎 **En la vida real:** es como un cocinero en un restaurante:
> 1. Cambia la receta.
> 2. La prueba él mismo en su cocina.
> 3. La manda a la cocina central.
> 4. El jefe de cocina la vuelve a probar en una cocina limpia, por si en la casa del cocinero había algo que la hacía salir bien "de casualidad".
> 5. Si sale mal, se entera en minutos y no cuando el cliente ya se quejó.

> 🌎 **Otro ejemplo:** Como una receta de la abuela que alguien prueba en otra cocina antes de venderla, por si solo salía bien en su horno.
1. Cambias el código.
2. Corres las pruebas en tu computadora.
3. Subes a GitHub.
4. El CI las corre otra vez en una máquina limpia (Tema 04).
5. Si algo falla, lo sabes en minutos.

## Ejercicios

> 🌎 **En la vida real:** son las prácticas de manejo en el estacionamiento antes de salir a la avenida. En `ejemplo-meta` no puedes romper nada de verdad: es un carro de autoescuela con doble pedal.

1. En `ejemplo-meta`, corre `node --test` y anota cuántas pasan.
2. Haz el sabotaje del Paso 6 y lee el error en voz alta.
3. **Ejercicio del descuento:** haz la función `aplicarDescuento(precio, porcentaje)` y pruébala con 20 %, 0 % y 100 %. Después sabotéala cambiando el `-` por `+`. Deben fallar 2 pruebas y la de 0 % sigue pasando, porque sumar o restar 0 da lo mismo. Eso muestra por qué hacen falta varios casos. La solución está en `ejemplo-meta/descuento.js` y `descuento.test.js`; mírala solo al final.
4. En la carpeta de la app, corre `npm test` y busca la línea `Tests:`. ¿Cuántas pasaron?

## Para la entrevista

> 🌎 **En la vida real:** en una entrevista te van a preguntar como pregunta un cliente a un mecánico: "¿y cómo sabe que quedó bien?". La respuesta buena no es "confíe en mí"; es "tengo una lista de revisiones que se corre sola y la probé en el carro de verdad".
> - **TDD**: como el sastre que primero toma las medidas (la prueba) y después corta la tela (el código).
> - **Cobertura**: qué porcentaje de las habitaciones de la casa revisó el inspector. Que haya entrado al 90 % no quiere decir que haya mirado bien cada una.

**¿Para qué sirven las pruebas?**
> Para comprobar automáticamente que el código cumple las reglas, detectar errores temprano y poder cambiarlo con seguridad.

**¿Cómo haces una prueba?**
> Defino la regla, elijo casos normales y de borde, calculo el resultado esperado, lo comparo con lo que devuelve el código y compruebo que la prueba falle si rompo la regla.

**¿Las pruebas garantizan que no hay errores?**
> No. Solo cubren los casos escritos. Por eso también pruebo en teléfonos reales.

**¿Qué es TDD?**
> Escribir primero la prueba y después el código.

**¿Qué es cobertura?**
> El porcentaje del código que las pruebas ejecutan. Un número alto no garantiza que las pruebas sean buenas.

## Para memorizar

> 🌎 **En la vida real:** es la receta de siempre, como la de lavarse las manos: mojar → jabón → frotar → enjuagar → secar. Aquí: regla → casos → código → prueba → correr → sabotear → leer el error → corregir.
Regla → casos → código → prueba → correr → sabotear → leer el error → corregir.
