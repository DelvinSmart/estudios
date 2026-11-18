# Tema 03: Tu primera prueba

> 🌎 **En la vida real:** en el Tema 02 miraste cómo un inspector revisa una casa. Ahora tú eres el inspector: tomas la lista, vas a la puerta y compruebas si cierra. Es pasar de ver un partido a jugarlo.

En el Tema 02 leíste pruebas. Ahora vas a **escribir una tú**, dentro de un proyecto de verdad: **Gastos del carro**, el proyecto de práctica del curso. Vas a probar la regla del nombre de "Mi empresa", la misma función que leíste en el Tema 01.

**Antes de empezar:** necesitas haber hecho los Temas 01 y 02.

**Tiempo:** de 30 a 60 minutos.

## Lo que vas a usar

> 🌎 **En la vida real:** como para cocinar necesitas la olla, la estufa y la cocina:
> - **Vitest** = la olla: la herramienta que hace el trabajo. Viene con la cocina (`npm install` la trae).
> - **Terminal** = la estufa: donde "enciendes" las cosas escribiendo órdenes.
> - **La carpeta del proyecto** = la cocina: el lugar donde está todo.

| Cosa | Qué es |
|---|---|
| **Vitest** | La herramienta de pruebas del proyecto. Se instala sola con `npm install`. (Copiloto usa **Jest**, que se escribe casi igual.) |
| **Terminal** | Donde escribes los comandos. En VS Code: menú **Terminal → New Terminal**. |
| **La carpeta del proyecto** | `gastos-del-carro`, el proyecto de práctica. Se baja una vez: `git clone https://github.com/DelvinSmart/gastos-del-carro.git`, `cd gastos-del-carro` y `npm install` (todo explicado en su README) |

## Paso 1. Escribe la regla en palabras

> 🌎 **En la vida real:** antes de inspeccionar un ascensor, el inspector lee el cartel: "máximo 8 personas, máximo 600 kg". Tú haces lo mismo con el nombre de la empresa: escribes las reglas del letrero (sin espacios de más, máximo 24 letras, máximo 2 palabras) para saber qué revisar.

> 🌎 **Otro ejemplo:** Como antes de un partido: todos saben el reglamento (cuánto dura, qué es falta). Sin reglas, no se puede arbitrar.

Antes de tocar el código, escribe en un papel la regla de `normalizarNombreEmpresa`:

> - Quita los espacios de los lados y deja un solo espacio entre palabras.
> - Si queda vacío, devuelve vacío (la app vuelve a "Mi empresa").
> - Si tiene más de 24 letras, es inválido (`null`).
> - Si tiene más de 2 palabras, es inválido (`null`).
> - Si no, devuelve el nombre limpio.

## Paso 2. Piensa los casos y calcula lo esperado

> 🌎 **En la vida real:** es como el profesor que prepara las respuestas del examen antes de corregir. Calculas **tú**, a mano, qué debe salir en cada caso.
>
> Los **casos de borde** son como el ascensor de "máximo 8 personas": lo interesante no es probar con 3 personas, es probar con **exactamente 8** (debe subir) y con **9** (no debe subir). Ahí es donde se esconden los errores: "Taxi Bom" (justo 2 palabras) y "Taxi Bom Ltda" (una de más).

> 🌎 **Otro ejemplo:** Como revisar el vuelto antes de que te lo den: ya sabes cuánto tiene que ser, y por eso te das cuenta si está mal.

Llena esta tabla **a mano**, sin correr nada. Es lo más importante del tema.

| Caso | Entra | Debe salir |
|---|---|---|
| Normal, una palabra | `"Thermomac"` | ? |
| Con espacios a los lados | `"  Thermomac  "` | ? |
| Dos palabras con muchos espacios | `"Refrigeración    Silva"` | ? |
| Vacío | `""` | ? |
| Solo espacios | `"     "` | ? |
| Borde: exactamente 2 palabras | `"Taxi Bom"` | ? |
| Pasa el límite de palabras | `"Taxi Bom Ltda"` | ? |
| Pasa el límite de letras | `"Refrigeracionesdelnortebrasil"` (29 letras) | ? |

**Pista:** los errores casi siempre están en los bordes (justo 2 palabras, justo 24 letras). Por eso hay casos de borde.

## Paso 3. Crea el archivo de la prueba

> 🌎 **En la vida real:** la carpeta `__tests__` es como el cajón del taller donde se guardan todas las hojas de inspección. El nombre terminado en `.test.ts` es como la etiqueta roja "INSPECCIÓN" en la carpeta: así Vitest, cuando entra al cajón, sabe cuáles hojas le toca revisar y cuáles ignorar.

> 🌎 **Otro ejemplo:** Como guardar las facturas en una carpeta con etiqueta "Facturas 2026": si las dejas en otro cajón, el contador no las encuentra.

1. Abre la carpeta `gastos-del-carro` en VS Code.
2. Ve a la carpeta `src/utils/__tests__/`. Ahí viven las pruebas de las reglas.
3. Crea un archivo nuevo llamado `miPrimeraPrueba.test.ts`.
   - El nombre **tiene que terminar en `.test.ts`**. Así Vitest sabe que es una prueba.

## Paso 4. Escribe el esqueleto

> 🌎 **En la vida real:** es como una hoja de inspección con el formato ya impreso, y tú solo llenas los renglones:
> - `import` = traer la máquina que vas a inspeccionar al taller. `../../` es como decir "sal de esta habitación, sal del pasillo, y entra a la bodega".
> - `describe` = el título de la hoja: "Inspección del letrero de Mi empresa".
> - `it` = cada renglón: "Deja el nombre limpio si tiene espacios a los lados".
> - `expect(x).toBe(y)` = "medí x, esperaba y". Si no coinciden, se marca con ✕.
> - `() => { ... }` = una instrucción sin nombre, como un papelito que dice "haz esto" y que el inspector lee cuando llega a ese renglón.
> - `toBeNull()` = "espero que me digan **no se puede**", como esperar que el ascensor **no** suba con 9 personas.

> 🌎 **Otro ejemplo:** `import` es como pedir prestada una herramienta al vecino: no la fabricas, la traes de su casa para usarla.

Copia esto en el archivo. Son las partes fijas; tú vas a completar el resto.

```ts
import { describe, expect, it } from 'vitest';
import { normalizarNombreEmpresa } from '../../datos/aplicaciones';

describe('nombre de Mi empresa', () => {
  it('deja el nombre limpio cuando tiene espacios a los lados', () => {
    expect(normalizarNombreEmpresa('  Thermomac  ')).toBe('Thermomac');
  });
});
```

**Qué es cada parte:**

| Parte | Qué hace |
|---|---|
| `import { ... } from '...'` | Trae la función que vas a probar. `../../` significa "sube dos carpetas": de `__tests__` a `utils` y de `utils` a `src`. Después entra a `datos/aplicaciones`. |
| `describe('...', () => { ... })` | Agrupa varias pruebas bajo un título. |
| `it('...', () => { ... })` | Una prueba. El texto dice la regla en palabras. |
| `expect(x).toBe(y)` | "Espero que x sea igual a y". Si no lo es, la prueba falla. |
| `() => { ... }` | Una función sin nombre (se llama **función flecha**). Vitest la ejecuta cuando corre la prueba. |

Para los casos que dan `null` se usa:
```ts
expect(normalizarNombreEmpresa('Taxi Bom Ltda')).toBeNull();
```

## Paso 5. Corre tu prueba

> 🌎 **En la vida real:** es como probar solo **una** hornalla de la estufa en vez de encender toda la cocina. Escribes el nombre de tu archivo para que Vitest no revise las otras 38 pruebas; es más rápido y ves solo lo tuyo. La ✓ verde es el "aprobado" del inspector.

> 🌎 **Otro ejemplo:** Es como probar una sola lámpara con su interruptor, en vez de prender toda la casa.

En la terminal, dentro de la carpeta del proyecto:

```bash
npx vitest run src/utils/__tests__/miPrimeraPrueba.test.ts
```

- `npx vitest run` ejecuta Vitest una vez.
- Lo que va después es **solo tu archivo**, para que no corran las otras 180 pruebas.

Debes ver algo así:
```text
 ✓ src/utils/__tests__/miPrimeraPrueba.test.ts (1 test)

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

## Paso 6. Completa los casos

> 🌎 **En la vida real:** es seguir llenando la hoja de inspección renglón por renglón, y revisar después de cada uno. Si un renglón sale mal, piensas como cuando la cuenta del supermercado no te cuadra:
> 1. ¿Sumé bien yo?
> 2. ¿Leí bien el ticket?
> 3. ¿La caja registradora está mal? (casi nunca es esto)

> 🌎 **Otro ejemplo:** Como llenar un crucigrama palabra por palabra y verificar cada una con las que se cruzan.

Agrega un `it(...)` por cada fila de tu tabla del Paso 2. Corre la prueba después de cada uno. Si alguno falla, revisa en este orden:
1. ¿Calculé bien lo esperado?
2. ¿Escribí bien la prueba (comillas, paréntesis)?
3. ¿El código del proyecto está mal? (casi nunca será esto)

## Paso 7. Sabotea

> 🌎 **En la vida real:** es como cuando el bombero prueba la alarma de incendio con humo de verdad. Cambias el cartel del ascensor de "máximo 2" a "máximo 3" a propósito, y miras si tu inspección se da cuenta. Si tu prueba grita "✕ esperaba que no se pudiera, pero se pudo", tu prueba funciona.
>
> Y después **devuelves el cartel a su lugar**. Es como el bombero que, después del simulacro, vuelve a dejar la alarma lista: si la deja apagada, la casa queda sin protección.

> 🌎 **Otro ejemplo:** Como un piloto de prueba que apaga un motor a propósito para ver si el avión avisa, y después lo vuelve a encender.

Vas a comprobar que tu prueba **sí protege** la regla.

1. Abre `src/datos/aplicaciones.ts`.
2. Busca `export const NOMBRE_EMPRESA_MAX_PALABRAS = 2;`
3. Cámbialo por `3`.
4. Corre tu prueba otra vez.

**Debe fallar** la prueba de `"Taxi Bom Ltda"`, porque ahora 3 palabras serían válidas. Lee el error:

```text
 × nombre de Mi empresa > es inválido con 3 palabras
   → expected 'Taxi Bom Ltda' to be null

- Expected: null
+ Received: "Taxi Bom Ltda"
```
Se lee: "esperaba `null`, pero recibió el nombre". Tu prueba atrapó el cambio.

5. **Devuelve el 2.** Muy importante: no dejes el proyecto cambiado.
6. Corre la prueba y confirma que todo pasa otra vez.

## Paso 8. Cierra

> 🌎 **En la vida real:** como al terminar de cocinar: lavas las ollas y apagas la estufa. `git status` es como dar una última mirada a la cocina antes de salir para ver si quedó alguna hornalla encendida (algún archivo cambiado sin querer).

> 🌎 **Otro ejemplo:** Como devolver las herramientas a su lugar después de trabajar: si las dejas tiradas, mañana no sabes qué tocaste.

Esta regla ya tiene pruebas en `src/datos/__tests__/aplicaciones.test.ts` (no las mires hasta terminar las tuyas), así que tu archivo es de práctica:
- **Bórralo** cuando termines, o
- déjalo, si está bien escrito: es tu primera prueba en un proyecto de verdad.

Antes de terminar, en la terminal:
```bash
git status
```
Si sale `src/datos/aplicaciones.ts` como modificado, todavía no devolviste el 2. Arréglalo antes de seguir.

## Ejercicio extra (si quieres más)

> 🌎 **En la vida real:** es como el formulario de la gasolinera: un carro tiene tanque ✔, una moto tiene tanque ✔, una bicicleta no ✘. Nadie le vendería gasolina a una bicicleta, y tu prueba comprueba que el proyecto tampoco.

Escribe pruebas para `vehiculoTieneTanque` (en `src/utils/combustible.ts`):
- Un carro tiene tanque.
- Una moto tiene tanque.
- Una bicicleta no tiene tanque.

## Respuestas de la tabla del Paso 2

> 🌎 **En la vida real:** son las respuestas del profesor. Compáralas con las tuyas **después** de intentarlo, igual que miras el resultado del partido solo después de haber hecho tu apuesta con los amigos.

<details>
<summary>Ver respuestas</summary>

| Entra | Sale |
|---|---|
| `"Thermomac"` | `"Thermomac"` |
| `"  Thermomac  "` | `"Thermomac"` |
| `"Refrigeración    Silva"` | `"Refrigeración Silva"` |
| `""` | `""` |
| `"     "` | `""` (al quitar los espacios queda vacío) |
| `"Taxi Bom"` | `"Taxi Bom"` (2 palabras está permitido) |
| `"Taxi Bom Ltda"` | `null` |
| `"Refrigeracionesdelnortebrasil"` | `null` (29 letras, más de 24) |

</details>

## Para la entrevista

> 🌎 **En la vida real:** contar una prueba que hiciste es como contarle a un cliente cómo revisaste su carro: "Revisé lo normal, revisé los límites y después desconecté un cable a propósito para ver si el tablero avisaba. Avisó, y lo volví a conectar". Eso da confianza.

**Cuéntame una prueba que escribiste.**
> En mi app, la persona puede ponerle nombre a su empresa, con un máximo de dos palabras y 24 letras. Escribí pruebas para los casos normales y los de borde: justo dos palabras, tres palabras, solo espacios y un nombre muy largo. Después cambié el límite a propósito para comprobar que la prueba fallaba, y lo devolví.
