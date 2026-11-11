# Tema 02: Pruebas automáticas

## 1. ¿Qué es una prueba?

Una prueba es un pequeño programa que revisa si otro programa hace lo correcto.

Piensa en una calculadora. Sabes que 2 + 2 debe dar 4. Si la pruebas a mano, escribes la suma y miras el resultado. Una prueba automática hace lo mismo, pero la máquina lo revisa sola, en milisegundos, cada vez que cambias algo.

Toda prueba hace la misma pregunta:

> Con estos datos, ¿el resultado es el que yo esperaba?

## 2. ¿Para qué sirve?

| Para qué | Qué significa |
|---|---|
| Encontrar errores | Detecta un fallo antes que tus usuarios |
| Proteger lo que ya funciona | Si arreglas algo y dañas otra cosa, te avisa |
| Cambiar sin miedo | Mejoras el código y la prueba te dice si rompiste algo |
| Dejar claras las reglas | La prueba explica qué debe pasar |
| Ahorrar tiempo | No revisas todo a mano en cada cambio |

**Ejemplo real de tu app:** las pruebas encontraron que una cuenta con `Uber` y `uber` el mismo día sumaba el doble. A simple vista la app parecía bien. Un error de dinero así puede pasar meses sin que nadie lo note.

**Comparación:** una prueba es como la alarma de humo. No apaga el fuego, pero avisa antes de que se queme la casa.

## 3. Lo que una prueba NO hace

- **No prueba que no existan errores.** Solo revisa los casos que escribiste.
- **No sabe cuál es la regla correcta.** Si la regla está mal, la prueba también.
- **Normalmente no ve la pantalla.** No sabe si algo se ve feo.
- **No reemplaza probar en un teléfono real.** Copiloto tuvo una versión que pasaba todas las revisiones y no abría en el iPhone.

## 4. Palabras que vas a escuchar

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

El ejemplo completo está en la carpeta `ejemplo-meta/`. Queremos una función que diga cuánto falta para una meta.

### Paso 1. Escribe la regla en palabras
> Si gané menos que la meta, muestra lo que falta. Si ya llegué o la pasé, falta 0.

Sin regla clara no hay prueba posible.

### Paso 2. Piensa los casos

| Caso | Ganado | Meta | Esperado |
|---|---|---|---|
| Normal | 300 | 500 | 200 |
| Borde: llegó justo | 500 | 500 | 0 |
| Pasó la meta | 700 | 500 | 0 |

Calcula el resultado **antes** de correr el código. Si copias lo que el código devuelve, solo confirmas lo que ya hace, aunque esté mal.

### Paso 3. El código (`meta.js`)
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
Una prueba que nunca ha fallado no ha demostrado nada. En `meta.js` quita el `Math.max`:
```js
return meta - ganado;
```
Corre `node --test` otra vez.

### Paso 7. Lee el error
```text
not ok 3 - si pasé la meta, falta 0 y no un número negativo
  expected: 0
  actual: -200
```
Se lee: "si pasé la meta, debía dar 0, pero dio -200". 500 − 700 = −200, porque quitaste la protección.

**Un error no es malo.** La prueba que falla te avisa antes de que le pase a un usuario.

### Paso 8. Corrige y repite
Devuelve el `Math.max` y corre de nuevo hasta ver `fail 0`.

### Cuando una prueba falla, revisa en este orden
1. **¿La regla es correcta?**
2. **¿Mi prueba está bien escrita?**
3. **¿El código está mal?**

**Caso real:** una prueba del San falló porque revisaba el 1 de enero, y la última rodada era el 4. La app estaba bien; el error era de la prueba.

## 7. Las pruebas de tu app

Al 10/11/2026 Copiloto Driver tiene **más de 400 pruebas automáticas**, en cuatro grupos:

| Grupo | Cuántas | Dónde están | Herramienta | Cómo se corren |
|---|---|---|---|---|
| App | 187 | `src/**/__tests__/` | Jest | `npm test` |
| Servidor (Cloud Functions) | 153 | `functions/test/` | node:test | `cd functions && npm test` |
| Reglas de seguridad de Firestore | 23 | `rules-test/` | node:test + emulador de Firebase | `cd rules-test && npm test` |
| Cartón automático (Android) | 61 | `modules/ride-overlay/android/src/test/` | JUnit (Kotlin) | lo corre el CI (Tema 04) |

Los números cambian: cada vez que se agrega algo importante, se agregan sus pruebas.

### Qué protegen (ejemplos reales)

| Archivo | Qué regla protege |
|---|---|
| `src/utils/__tests__/earningSourceRules.test.ts` | Mi empresa, Particulares y Extras son independientes; Uber y las plataformas nuevas acumulan; Extras no entra en el tanque; un extra de la cartera cuenta una sola vez |
| `src/utils/__tests__/appFiscalDay.test.ts` | Uber cambia de día a las 04:00 |
| `src/utils/__tests__/fuelLevel.test.ts` | La barra de combustible |
| `src/san/__tests__/sanPaymentReminders.test.ts` | Los avisos del San (y que no llegue el aviso de la mano si ya pagaste) |
| `functions/test/earningsLogic.test.js` | Que el Copiloto entienda "mi empresa" y "minha empresa" |
| `rules-test/firestore.rules.test.js` | Que nadie lea los datos de otra persona |

### Una prueba de tu app, leída
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
1. Cambias el código.
2. Corres las pruebas en tu computadora.
3. Subes a GitHub.
4. El CI las corre otra vez en una máquina limpia (Tema 04).
5. Si algo falla, lo sabes en minutos.

## Ejercicios

1. En `ejemplo-meta`, corre `node --test` y anota cuántas pasan.
2. Haz el sabotaje del Paso 6 y lee el error en voz alta.
3. **Ejercicio del descuento:** haz la función `aplicarDescuento(precio, porcentaje)` y pruébala con 20 %, 0 % y 100 %. Después sabotéala cambiando el `-` por `+`. Deben fallar 2 pruebas y la de 0 % sigue pasando, porque sumar o restar 0 da lo mismo. Eso muestra por qué hacen falta varios casos. La solución está en `ejemplo-meta/descuento.js` y `descuento.test.js`; mírala solo al final.
4. En la carpeta de la app, corre `npm test` y busca la línea `Tests:`. ¿Cuántas pasaron?

## Para la entrevista

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
Regla → casos → código → prueba → correr → sabotear → leer el error → corregir.
