# Mi primera prueba

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** esta clase es **práctica**: necesitas la computadora abierta. Haz cada paso de verdad, no solo lo leas. Calcula 30 a 60 minutos. En cada **✋ Para y piensa**, responde antes de abrir la respuesta.

**Lo que necesitas saber antes:** la clase 01 (la función `normalizarNombreEmpresa`) y la 02 (qué es una prueba, esperado y recibido, sabotear).

## 1. Lo que vas a usar

> 🎙️ **El profesor:** {{alumno}}, en el Tema 02 **miraste** pruebas. Hoy vas a **escribir una tú**, dentro de un proyecto de verdad: **Gastos del carro**, el proyecto de práctica del curso, que tiene la misma regla que Copiloto con nombres en español. Es pasar de ver un partido a jugarlo. Y vamos a probar algo que ya conoces: la regla del nombre de "Mi empresa".

Vas a usar tres cosas:

| Cosa | Qué es | 🌎 En la cocina |
|---|---|---|
| **Vitest** | La herramienta de pruebas del proyecto. Se instala sola con `npm install`. (Copiloto usa **Jest**, que se escribe casi igual.) | La olla: viene con la cocina |
| **La terminal** | Donde escribes órdenes. En VS Code: menú **Terminal → New Terminal**. | La estufa: donde "enciendes" las cosas |
| **La carpeta del proyecto** | `gastos-del-carro`, el proyecto de práctica. Se baja una vez: `git clone https://github.com/DelvinSmart/gastos-del-carro.git`, `cd gastos-del-carro` y `npm install` (todo explicado en su README) | La cocina: donde está todo |

> 📌 **Nota:** ¿no puedes instalar nada (por ejemplo, estás en el iPad)? En la parte 6 hay un ejercicio para escribir tus pruebas **aquí mismo, en el navegador**, y la parte 10 lo explica.

**Antes de empezar, una regla de buen profesional:** hoy vas a **leer** el código y **agregar** un archivo de práctica. Lo único que vas a cambiar del proyecto (en el paso 7) lo vas a **devolver** a como estaba. En una app en producción, como Copiloto, esta regla es obligatoria.

```practica
elige :: ¿Qué es Vitest? :: Un editor de código :: La herramienta de pruebas del proyecto :: Una base de datos
vf :: Vitest hay que instalarlo aparte, con un comando especial, antes de npm install
vf :: Si en esta clase cambias algo del proyecto, lo tienes que devolver a como estaba
```

> 🔁 **Repaso:** Vitest (la herramienta), la terminal (donde das órdenes) y la carpeta del proyecto. Lo que cambies, lo devuelves.

## 2. Paso 1: la regla en palabras

> 🎙️ **El profesor:** ¿te acuerdas del primer paso del Tema 02? **Sin regla escrita, no hay prueba.** Toma un papel y escribe la regla de `normalizarNombreEmpresa` con tus palabras, **antes** de mirar la mía.

> ✋ **Para y piensa:** escribe en el papel qué hace `normalizarNombreEmpresa`, regla por regla.

<details>
<summary>Ver la regla</summary>

- Quita los espacios de los lados y deja un solo espacio entre palabras.
- Si queda vacío, devuelve vacío (la app vuelve a "Mi empresa").
- Si tiene más de 24 letras, es inválido (`null`).
- Si tiene más de 2 palabras, es inválido (`null`).
- Si no, devuelve el nombre limpio.

Si te olvidaste de alguna, vuelve a mirar la función en el Tema 01, parte 6.

</details>

> 🌎 **En la vida real:** antes de inspeccionar un ascensor, el inspector lee el cartel: "máximo 8 personas, máximo 600 kg". Tú lees las reglas del letrero antes de revisar.

> 🌎 **Otro ejemplo:** Como antes de jugar un partido: primero todos saben el reglamento (cuánto dura, qué es falta). Sin reglas, no se puede arbitrar.

```practica
escribe :: Escribe las cinco reglas de `normalizarNombreEmpresa`. :: Limpia los espacios (un solo espacio entre palabras, sin espacios a los lados); si queda vacío devuelve vacío; más de 24 letras es null; más de 2 palabras es null; si no, devuelve el nombre limpio.
vf :: Si el nombre queda vacío, la función devuelve `null`
elige :: ¿Cuál es el máximo de letras? :: 2 :: 24 :: 29
```

> 🔁 **Repaso:** primero la regla en palabras, después el código. Cinco reglas: limpiar, vacío, 24 letras, 2 palabras, nombre limpio.

## 3. Paso 2: los casos y lo esperado (a mano)

> 🎙️ **El profesor:** esta es **la parte más importante de toda la clase**. Vas a calcular **con tu cabeza** qué debe salir en cada caso, **sin correr nada**. Si te saltas esto y copias lo que da el código, tu prueba no sirve.

Llena esta tabla en tu papel:

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

**Fíjate en los casos de borde.** No es casualidad que estén "Taxi Bom" (justo 2 palabras) y "Taxi Bom Ltda" (una de más). **Los errores viven en los bordes**: es donde un programador pone `>` cuando debía poner `>=`.

> 🌎 **En la vida real:** con el ascensor de "máximo 8 personas", lo interesante no es probar con 3 personas: es probar con **exactamente 8** (debe subir) y con **9** (no debe subir).

> 🌎 **Otro ejemplo:** Como el profesor que, antes de corregir, ya tiene escrita la hoja de respuestas, incluidas las preguntas difíciles.

> ✋ **Para y piensa:** llena las 8 filas antes de abrir.

<details>
<summary>Ver las respuestas de la tabla</summary>

| Entra | Sale | Por qué |
|---|---|---|
| `"Thermomac"` | `"Thermomac"` | Pasa todo |
| `"  Thermomac  "` | `"Thermomac"` | `trim` quita los espacios de los lados |
| `"Refrigeración    Silva"` | `"Refrigeración Silva"` | Los espacios seguidos quedan en uno |
| `""` | `""` | Vacío → vacío |
| `"     "` | `""` | Al limpiar, queda vacío |
| `"Taxi Bom"` | `"Taxi Bom"` | 2 palabras **está permitido** (no es "más de 2") |
| `"Taxi Bom Ltda"` | `null` | 3 palabras |
| `"Refrigeracionesdelnortebrasil"` | `null` | 29 letras, más de 24 |

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La tabla, calculada a mano
lenguaje: js
pide: Completa `esperados` con lo que **debe salir** en cada fila de la tabla, en el mismo orden, **calculándolo tú** (sin correr la función). Usa `null` para inválido y `''` para vacío.
--- código
const casos = ['Thermomac', '  Thermomac  ', 'Refrigeración    Silva', '', '     ', 'Taxi Bom', 'Taxi Bom Ltda', 'Refrigeracionesdelnortebrasil'];

const esperados = [
  // tu respuesta aquí: 8 valores, uno por caso
];
--- pruebas
const correctos = ['Thermomac', 'Thermomac', 'Refrigeración Silva', '', '', 'Taxi Bom', null, null];
prueba('hay un valor por caso', () => igual(esperados.length, 8));
correctos.forEach((c, i) => prueba(`fila ${i + 1}: ${JSON.stringify(casos[i])}`, () => igual(esperados[i], c)));
--- solución
const casos = ['Thermomac', '  Thermomac  ', 'Refrigeración    Silva', '', '     ', 'Taxi Bom', 'Taxi Bom Ltda', 'Refrigeracionesdelnortebrasil'];

const esperados = ['Thermomac', 'Thermomac', 'Refrigeración Silva', '', '', 'Taxi Bom', null, null];
```

```practica
elige :: ¿Qué sale con `"Taxi Bom"`? :: `null` :: `"Taxi Bom"` :: `""`
elige :: ¿Qué sale con `"     "` (solo espacios)? :: `null` :: `""` :: `" "`
elige :: ¿Qué sale con `"Taxi Bom Ltda"`? :: `"Taxi Bom"` :: `null` :: `"Taxi Bom Ltda"`
elige :: ¿Qué sale con `"Refrigeración    Silva"`? :: `null` :: `"Refrigeración Silva"` :: `"RefrigeraciónSilva"`
vf :: Lo esperado lo calculo corriendo el código primero
vf :: Un caso de borde es probar justo en el límite de la regla
```

> 🔁 **Repaso:** la tabla se llena a mano, antes de correr nada. Siempre incluye los bordes: justo en el límite y uno más.

## 4. Pasos 3 y 4: el archivo y el esqueleto

> 🎙️ **El profesor:** ahora sí, a la computadora. Vamos a crear el archivo y escribir la primera prueba. Te explico cada pieza nueva.

> 🌎 **En la vida real:** Es como abrir un cuaderno nuevo para un examen: le pones nombre a la tapa (el archivo `.test.ts`) y escribes el encabezado antes de las respuestas.

> 🌎 **Otro ejemplo:** Es como llenar una planilla de inspección que ya viene impresa: el título arriba (`describe`), un renglón por revisión (`it`), y el resultado en cada renglón (`expect`).

### Paso 3: crear el archivo

1. Abre la carpeta `gastos-del-carro` en VS Code.
2. Ve a `src/utils/__tests__/`. Ahí viven las pruebas de las reglas.
3. Crea un archivo nuevo llamado **`miPrimeraPrueba.test.ts`**.

El nombre **tiene que terminar en `.test.ts`**. Así Vitest sabe que es una prueba. Si lo llamas `miPrimeraPrueba.ts`, Vitest no lo ve.

> 🌎 **En la vida real:** la carpeta `__tests__` es el cajón donde se guardan las hojas de inspección, y `.test.ts` es la etiqueta roja "INSPECCIÓN": así Vitest sabe qué hojas le toca revisar.

> 🌎 **Otro ejemplo:** Como guardar las facturas en una carpeta con etiqueta "Facturas 2026": si las dejas sueltas en otro cajón, el contador no las encuentra.

### Paso 4: el esqueleto

Escribe esto en el archivo (escríbelo tú, no lo copies: así se aprende):

```ts
import { describe, expect, it } from 'vitest';
import { normalizarNombreEmpresa } from '../../datos/aplicaciones';

describe('nombre de Mi empresa', () => {
  it('deja el nombre limpio cuando tiene espacios a los lados', () => {
    expect(normalizarNombreEmpresa('  Thermomac  ')).toBe('Thermomac');
  });
});
```

Pieza por pieza:

**`import { describe, expect, it } from 'vitest';
import { normalizarNombreEmpresa } from '../../datos/aplicaciones';`**
- Trae la función que vas a probar desde su archivo.
- `../../` quiere decir **"sube dos carpetas"**. Estás en `src/utils/__tests__/`: el primer `../` te lleva a `src/utils/`, el segundo a `src/`. Desde ahí entras a `datos/aplicaciones`.
- No se escribe `.ts` al final: Vitest lo encuentra solo.

> 🌎 **En la vida real:** `../../` es decir "sal de esta habitación, sal del pasillo, y entra a la bodega".

> 🌎 **Otro ejemplo:** `import` es como pedir prestada una herramienta al vecino: no la fabricas, la traes de su casa (de su archivo) para usarla.

**`describe('nombre de Mi empresa', () => { ... });`**
- **Agrupa** varias pruebas bajo un título. Es el título de la hoja de inspección.

**`it('deja el nombre limpio…', () => { ... });`**
- **Una** prueba. El texto es la regla en palabras: cuando falle, vas a leer exactamente esta frase.

**`() => { ... }`**
- Es una **función sin nombre**, llamada **función flecha**. Vitest la guarda y la ejecuta cuando le toca correr esa prueba.

**`expect(normalizarNombreEmpresa('  Thermomac  ')).toBe('Thermomac');`**
- Se lee: **"espero que `normalizarNombreEmpresa('  Thermomac  ')` sea `'Thermomac'`"**.
- `expect(…)` envuelve **lo recibido** (lo que da la función).
- `.toBe(…)` lleva **lo esperado**.

Para los casos que tienen que dar `null` se usa otra forma:

```ts
expect(normalizarNombreEmpresa('Taxi Bom Ltda')).toBeNull();
```

`toBeNull()` = "espero que sea `null`", como esperar que el ascensor **no** suba con 9 personas.

> ✋ **Para y piensa:** escribe (en papel) la línea `expect` para el caso `"Refrigeración    Silva"`.

<details>
<summary>Ver la respuesta</summary>

```ts
expect(normalizarNombreEmpresa('Refrigeración    Silva')).toBe('Refrigeración Silva');
```

</details>

```practica
vf :: El archivo de prueba se puede llamar `miPrimeraPrueba.ts`
elige :: ¿Qué hace `describe`? :: Corre una prueba :: Agrupa varias pruebas bajo un título :: Trae una función
elige :: ¿Qué hace `it`? :: Crea una prueba :: Borra una prueba :: Importa un archivo
elige :: Desde `src/utils/__tests__/`, ¿a dónde lleva `../../`? :: A `src/utils/` :: A `src/` :: A la carpeta del proyecto
elige :: Para un caso que debe dar `null`, ¿qué usas? :: `.toBe('null')` :: `.toBeNull()` :: `.toBe('')`
escribe :: En `expect(A).toBe(B)`, ¿qué es A y qué es B? :: A es lo recibido (lo que da el código) y B es lo esperado.
escribe :: ¿Qué es `() => { ... }`? :: Una función sin nombre (función flecha) que Vitest ejecuta cuando corre la prueba.
```

> 🔁 **Repaso:** archivo terminado en `.test.ts`; `import` trae la función; `describe` agrupa; `it` es una prueba; `expect(recibido).toBe(esperado)` compara; `toBeNull()` para los `null`.

## 5. Paso 5: correr tu prueba

> 🎙️ **El profesor:** el momento de la verdad. Vas a correr **solo tu archivo**.

En la terminal, dentro de la carpeta del proyecto:

```bash
npx vitest run src/utils/__tests__/miPrimeraPrueba.test.ts
```

- `npx vitest run` ejecuta Vitest una vez. (`npx` corre una herramienta que está instalada en el proyecto; sin `run`, Vitest se queda mirando los cambios.)
- Lo que va después es **solo tu archivo**: así no corren las otras 38 pruebas y ves solo lo tuyo.

Debes ver:

```text
 ✓ src/utils/__tests__/miPrimeraPrueba.test.ts (1 test)

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

Léelo: la **✓ verde** al lado de tu archivo (pasó), cuántas pruebas tenía, y abajo el resumen: `1 passed`. **¡Escribiste tu primera prueba!** (Con Jest sale la palabra `PASS`; es lo mismo.)

> 🌎 **En la vida real:** es probar **una** hornalla en vez de encender toda la cocina.

> 🌎 **Otro ejemplo:** Es como probar una sola lámpara con el interruptor, en vez de prender toda la casa para ver si esa funciona.

> ✋ **Para y piensa:** si escribes mal el nombre del archivo en el comando, ¿qué crees que pasa?

<details>
<summary>Ver la respuesta</summary>

Vitest dice que **no encontró pruebas**: `No test files found`. No es un error de tu prueba: es que le diste una dirección equivocada.

</details>

```practica
vf :: Escribir el nombre del archivo después de `npx vitest run` hace que corra solo esa prueba
elige :: ¿Qué quiere decir la ✓ verde al lado de tu archivo? :: Que la prueba se saltó :: Que la prueba pasó :: Que falló
elige :: ¿Dónde se escribe `npx vitest run …`? :: En el archivo de prueba :: En la terminal, dentro de la carpeta del proyecto :: En el navegador
```

> 🔁 **Repaso:** `npx vitest run` + la ruta de tu archivo. La ✓ verde y `passed` quieren decir que pasó.

## 6. Paso 6: completar los casos

> 🎙️ **El profesor:** una prueba sola no alcanza (lo viste con el descuento en el Tema 02). Ahora agrega **un `it` por cada fila** de tu tabla.

Agrega los `it` de a uno, y **corre la prueba después de cada uno**. Así, si algo falla, sabes exactamente cuál fue.

Si alguno falla, revisa **en este orden**:
1. ¿Calculé bien lo esperado?
2. ¿Escribí bien la prueba (comillas, paréntesis, `toBe` o `toBeNull`)?
3. ¿El código del proyecto está mal? (**casi nunca** será esto)

> 🌎 **En la vida real:** cuando la cuenta del supermercado no cuadra: ¿sumé bien yo? ¿leí bien el ticket? Recién al final: ¿la caja registradora está mal?

> 🌎 **Otro ejemplo:** Como llenar el crucigrama palabra por palabra y verificar cada una con las que se cruzan, en vez de llenarlo todo y revisar al final.

> ✋ **Para y piensa:** escribe tú los 8 `it`. Después compara.

<details>
<summary>Ver una solución completa</summary>

```ts
import { describe, expect, it } from 'vitest';
import { normalizarNombreEmpresa } from '../../datos/aplicaciones';

describe('nombre de Mi empresa', () => {
  it('deja igual un nombre normal de una palabra', () => {
    expect(normalizarNombreEmpresa('Thermomac')).toBe('Thermomac');
  });

  it('deja el nombre limpio cuando tiene espacios a los lados', () => {
    expect(normalizarNombreEmpresa('  Thermomac  ')).toBe('Thermomac');
  });

  it('deja un solo espacio entre dos palabras', () => {
    expect(normalizarNombreEmpresa('Refrigeración    Silva')).toBe('Refrigeración Silva');
  });

  it('devuelve vacío si no se escribió nada', () => {
    expect(normalizarNombreEmpresa('')).toBe('');
  });

  it('devuelve vacío si solo hay espacios', () => {
    expect(normalizarNombreEmpresa('     ')).toBe('');
  });

  it('acepta exactamente 2 palabras', () => {
    expect(normalizarNombreEmpresa('Taxi Bom')).toBe('Taxi Bom');
  });

  it('es inválido con 3 palabras', () => {
    expect(normalizarNombreEmpresa('Taxi Bom Ltda')).toBeNull();
  });

  it('es inválido con más de 24 letras', () => {
    expect(normalizarNombreEmpresa('Refrigeracionesdelnortebrasil')).toBeNull();
  });
});
```

Al correrla debes ver `Tests  8 passed (8)`.

</details>

Si no tienes la computadora a mano, o quieres practicar otra vez, escribe tus 8 pruebas **aquí mismo**. Este ejercicio también hace el **paso 7** por ti: sabotea la regla y comprueba que tus pruebas lo noten.

```ejercicio
titulo: Tus 8 pruebas, aquí mismo (y el sabotaje)
lenguaje: js
pide: Escribe un `it` por cada fila de tu tabla (al menos 8), con `expect(…).toBe(…)` o `expect(…).toBeNull()`, igual que en el archivo de la computadora. Las revisiones comprueban que **todas tus pruebas pasan** con la regla correcta, y que **al menos una falla** cuando se sabotea la regla (máximo de 3 palabras, o de 30 letras). Si tus pruebas no notan un sabotaje, te falta un caso de borde.
--- código
// La función que vas a probar (la misma de Gastos del carro).
let MAX_PALABRAS = 2;
let MAX_LETRAS = 24;
function normalizarNombreEmpresa(texto) {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (!limpio) return '';
  if (limpio.length > MAX_LETRAS) return null;
  if (limpio.split(' ').length > MAX_PALABRAS) return null;
  return limpio;
}

// Un mini Vitest: it, expect, toBe y toBeNull (se escriben igual que los de verdad).
const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const expect = (recibido) => ({
  toBe: (esperado) => { if (recibido !== esperado) throw new Error(`esperaba ${JSON.stringify(esperado)} y recibió ${JSON.stringify(recibido)}`); },
  toBeNull: () => { if (recibido !== null) throw new Error(`esperaba null y recibió ${JSON.stringify(recibido)}`); },
});

// ✍️ Tus pruebas aquí, un it por fila de la tabla:
it('deja el nombre limpio cuando tiene espacios a los lados', () => {
  expect(normalizarNombreEmpresa('  Thermomac  ')).toBe('Thermomac');
});
--- pruebas
const correrTodas = () => misPruebas.map((p) => { try { p.fn(); return null; } catch (e) { return p.nombre + ': ' + e.message; } }).filter(Boolean);
prueba('escribiste al menos 8 pruebas', () => ok(misPruebas.length >= 8, `tienes ${misPruebas.length}: falta un it por fila de la tabla`));
prueba('todas pasan con la regla correcta', () => { const f = correrTodas(); ok(f.length === 0, 'fallan: ' + f.join(' | ')); });
prueba('el sabotaje "máximo 3 palabras" se nota', () => { MAX_PALABRAS = 3; const f = correrTodas(); MAX_PALABRAS = 2; ok(f.length > 0, 'con 3 palabras permitidas ninguna prueba falló: falta el caso de 3 palabras'); });
prueba('el sabotaje "máximo 30 letras" se nota', () => { MAX_LETRAS = 30; const f = correrTodas(); MAX_LETRAS = 24; ok(f.length > 0, 'con 30 letras permitidas ninguna prueba falló: falta un caso de más de 24 letras'); });
--- solución
// La función que vas a probar (la misma de Gastos del carro).
let MAX_PALABRAS = 2;
let MAX_LETRAS = 24;
function normalizarNombreEmpresa(texto) {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (!limpio) return '';
  if (limpio.length > MAX_LETRAS) return null;
  if (limpio.split(' ').length > MAX_PALABRAS) return null;
  return limpio;
}

// Un mini Vitest: it, expect, toBe y toBeNull (se escriben igual que los de verdad).
const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const expect = (recibido) => ({
  toBe: (esperado) => { if (recibido !== esperado) throw new Error(`esperaba ${JSON.stringify(esperado)} y recibió ${JSON.stringify(recibido)}`); },
  toBeNull: () => { if (recibido !== null) throw new Error(`esperaba null y recibió ${JSON.stringify(recibido)}`); },
});

it('deja igual un nombre normal de una palabra', () => { expect(normalizarNombreEmpresa('Thermomac')).toBe('Thermomac'); });
it('deja el nombre limpio cuando tiene espacios a los lados', () => { expect(normalizarNombreEmpresa('  Thermomac  ')).toBe('Thermomac'); });
it('deja un solo espacio entre dos palabras', () => { expect(normalizarNombreEmpresa('Refrigeración    Silva')).toBe('Refrigeración Silva'); });
it('devuelve vacío si no se escribió nada', () => { expect(normalizarNombreEmpresa('')).toBe(''); });
it('devuelve vacío si solo hay espacios', () => { expect(normalizarNombreEmpresa('     ')).toBe(''); });
it('acepta exactamente 2 palabras', () => { expect(normalizarNombreEmpresa('Taxi Bom')).toBe('Taxi Bom'); });
it('es inválido con 3 palabras', () => { expect(normalizarNombreEmpresa('Taxi Bom Ltda')).toBeNull(); });
it('es inválido con más de 24 letras', () => { expect(normalizarNombreEmpresa('Refrigeracionesdelnortebrasil')).toBeNull(); });
```

```practica
elige :: Una prueba nueva falla. ¿Qué revisas primero? :: Si el código del proyecto está mal :: Si calculé bien lo esperado :: Si la computadora está lenta
vf :: Conviene correr la prueba después de agregar cada `it`
escribe :: Escribe el `it` completo para el caso `"Taxi Bom Ltda"`. :: it('es inválido con 3 palabras', () => { expect(normalizarNombreEmpresa('Taxi Bom Ltda')).toBeNull(); });
```

> 🔁 **Repaso:** un `it` por fila de la tabla, corriendo después de cada uno. Si falla: lo esperado, la prueba, y recién al final el código.

## 7. Paso 7: sabotear

> 🎙️ **El profesor:** tus 8 pruebas pasan. Pero… ¿de verdad protegen la regla? Solo hay una forma de saberlo: **romper la regla a propósito** y ver si tu prueba grita.

1. Abre `src/datos/aplicaciones.ts`.
2. Busca `export const NOMBRE_EMPRESA_MAX_PALABRAS = 2;`
3. Cámbialo por **`3`**.
4. Corre tu prueba otra vez.

**Debe fallar** la prueba de `"Taxi Bom Ltda"`, porque ahora 3 palabras serían válidas:

```text
 × nombre de Mi empresa > es inválido con 3 palabras
   → expected 'Taxi Bom Ltda' to be null

- Expected: null
+ Received: "Taxi Bom Ltda"
```

Se lee: **"esperaba `null`, pero recibió el nombre"**. Tu prueba atrapó el cambio. 🎉

5. **Devuelve el 2.** Muy importante: no dejes el proyecto cambiado.
6. Corre la prueba y confirma que todo pasa otra vez.

> 🌎 **En la vida real:** el bombero prueba la alarma con humo de verdad, y después del simulacro **la deja lista otra vez**. Si la deja apagada, la casa queda sin protección.

> 🌎 **Otro ejemplo:** Como un piloto de prueba que apaga un motor a propósito para ver si el avión avisa, y después lo vuelve a encender.

> ✋ **Para y piensa:** con el máximo cambiado a 3, ¿la prueba de "Taxi Bom" (2 palabras) falla o pasa?

<details>
<summary>Ver la respuesta</summary>

**Pasa.** Con 2 o con 3 como máximo, 2 palabras siguen siendo válidas. Solo la prueba de 3 palabras nota la diferencia. Por eso hace falta **el caso de una más que el borde**.

</details>

```practica
vf :: Después de sabotear, hay que devolver el `2`
elige :: Con `NOMBRE_EMPRESA_MAX_PALABRAS` en 3, ¿qué prueba falla? :: La de "Taxi Bom" :: La de "Taxi Bom Ltda" :: Todas
elige :: El error dice `Received: "Taxi Bom Ltda"`. ¿Qué significa? :: Que la prueba pasó :: Que el código devolvió el nombre en vez de `null` :: Que el archivo no existe
escribe :: ¿Para qué sirve sabotear? :: Para comprobar que la prueba de verdad detecta cuando se rompe la regla; una prueba que nunca falló no demostró nada.
```

> 🔁 **Repaso:** cambias la regla a propósito, la prueba debe fallar, lees el error, y **devuelves todo** a como estaba.

## 8. Paso 8: cerrar

> 🎙️ **El profesor:** último paso, y es de buen profesional: dejar la cocina limpia.

Esta regla ya tiene pruebas en `src/datos/__tests__/aplicaciones.test.ts` (no las mires hasta terminar las tuyas), así que tu archivo es **de práctica**:
- **Bórralo** cuando termines, o
- déjalo si está bien escrito (y lo revisas con alguien).

Antes de terminar, en la terminal:

```bash
git status
```

`git status` te muestra **qué archivos cambiaron**. Si sale `src/datos/aplicaciones.ts` como modificado, **todavía no devolviste el 2**. Arréglalo antes de seguir. (En el Tema 06 vas a ver Git a fondo.)

> 🌎 **En la vida real:** dar una última mirada a la cocina antes de salir, para ver si quedó alguna hornalla encendida.

> 🌎 **Otro ejemplo:** Como devolver las herramientas a su lugar después de trabajar: si las dejas tiradas, mañana no sabes qué tocaste.

```practica
elige :: ¿Qué te muestra `git status`? :: Las pruebas que pasaron :: Qué archivos cambiaron :: La versión del proyecto
vf :: Si `git status` muestra `aplicaciones.ts` como modificado, todo está bien
```

> 🔁 **Repaso:** borra o guarda tu archivo de práctica, y revisa con `git status` que el proyecto quedó como estaba.

## 9. Ejercicio extra: el tanque

> 🎙️ **El profesor:** ¿te quedaste con ganas? Este es para hacerlo **solo**, sin mirar la solución.

Escribe pruebas para `vehiculoTieneTanque` (en `src/utils/combustible.ts`). Te recuerdo la función:

```ts
export function vehiculoTieneTanque(tipo: string | undefined): boolean {
  return tipo !== 'bicicleta';
}
```

Casos:
- Un carro tiene tanque.
- Una moto tiene tanque.
- Una bicicleta **no** tiene tanque.

> 🌎 **En la vida real:** nadie le vendería gasolina a una bicicleta, y tu prueba comprueba que el proyecto tampoco.

<details>
<summary>Ver una solución</summary>

```ts
import { describe, expect, it } from 'vitest';
import { vehiculoTieneTanque } from '../combustible';

describe('tanque de combustible', () => {
  it('un carro tiene tanque', () => {
    expect(vehiculoTieneTanque('carro')).toBe(true);
  });
  it('una moto tiene tanque', () => {
    expect(vehiculoTieneTanque('moto')).toBe(true);
  });
  it('una bicicleta no tiene tanque', () => {
    expect(vehiculoTieneTanque('bicicleta')).toBe(false);
  });
});
```

Fíjate en el `import`: aquí es `'../combustible'` (sube **una** carpeta), porque `combustible.ts` está en `src/utils/`, justo arriba de `__tests__`.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las pruebas del tanque, aquí mismo
lenguaje: js
pide: Escribe al menos 3 pruebas para `vehiculoTieneTanque`: un carro tiene tanque, una moto tiene tanque, una bicicleta **no**. Las revisiones sabotean la función de dos formas (que diga que todo tiene tanque, o que la que no tiene sea otra cosa) y tus pruebas tienen que notarlo.
--- código
let ROTA = false;
let SIN_TANQUE = 'bicicleta';
function vehiculoTieneTanque(tipo) {
  if (ROTA) return true;
  return tipo !== SIN_TANQUE;
}

// Un mini Vitest: it, expect, toBe y toBeNull (se escriben igual que los de verdad).
const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const expect = (recibido) => ({
  toBe: (esperado) => { if (recibido !== esperado) throw new Error(`esperaba ${JSON.stringify(esperado)} y recibió ${JSON.stringify(recibido)}`); },
  toBeNull: () => { if (recibido !== null) throw new Error(`esperaba null y recibió ${JSON.stringify(recibido)}`); },
});

// ✍️ Tus pruebas aquí:
--- pruebas
const correrTodas = () => misPruebas.map((p) => { try { p.fn(); return null; } catch (e) { return p.nombre + ': ' + e.message; } }).filter(Boolean);
prueba('escribiste al menos 3 pruebas', () => ok(misPruebas.length >= 3, `tienes ${misPruebas.length}`));
prueba('todas pasan con la función correcta', () => { const f = correrTodas(); ok(f.length === 0, 'fallan: ' + f.join(' | ')); });
prueba('notan si todo "tiene tanque"', () => { ROTA = true; const f = correrTodas(); ROTA = false; ok(f.length > 0, 'falta la prueba de que la bicicleta NO tiene tanque'); });
prueba('notan si la bicicleta deja de ser la excepción', () => { SIN_TANQUE = 'patineta'; const f = correrTodas(); SIN_TANQUE = 'bicicleta'; ok(f.length > 0, 'falta probar la bicicleta'); });
--- solución
let ROTA = false;
let SIN_TANQUE = 'bicicleta';
function vehiculoTieneTanque(tipo) {
  if (ROTA) return true;
  return tipo !== SIN_TANQUE;
}

// Un mini Vitest: it, expect, toBe y toBeNull (se escriben igual que los de verdad).
const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const expect = (recibido) => ({
  toBe: (esperado) => { if (recibido !== esperado) throw new Error(`esperaba ${JSON.stringify(esperado)} y recibió ${JSON.stringify(recibido)}`); },
  toBeNull: () => { if (recibido !== null) throw new Error(`esperaba null y recibió ${JSON.stringify(recibido)}`); },
});

it('un carro tiene tanque', () => { expect(vehiculoTieneTanque('carro')).toBe(true); });
it('una moto tiene tanque', () => { expect(vehiculoTieneTanque('moto')).toBe(true); });
it('una bicicleta no tiene tanque', () => { expect(vehiculoTieneTanque('bicicleta')).toBe(false); });
```

```practica
elige :: ¿Qué esperas de `vehiculoTieneTanque('bicicleta')`? :: `true` :: `false` :: `null`
elige :: Desde `src/utils/__tests__/`, ¿cómo importas `src/utils/combustible.ts`? :: `'../../combustible'` :: `'../combustible'` :: `'./combustible'`
```

## 10. Si no puedes instalar nada

> 🎙️ **El profesor:** lo ideal es hacer esta clase en tu computadora, con el proyecto de práctica: es como se trabaja de verdad. Pero si estás en el iPad, o no puedes instalar nada todavía, igual puedes practicar lo más importante **en el navegador**: los ejercicios de las partes 3, 6 y 9 usan las mismas `it` y `expect`, y el de la parte 6 hasta sabotea la regla por ti.

> 🌎 **En la vida real:** si no tienes la cocina del restaurante, practicas la receta en tu casa: el plato y los pasos son los mismos. Después, en la cocina de verdad, ya sabes qué hacer.

Cuando tengas una computadora, vuelve y haz los pasos 3 a 8 con `gastos-del-carro`: escribir el archivo, correrlo en la terminal y verlo fallar con tus propios ojos se aprende de otra manera.

## Para la entrevista

> 🎙️ **El profesor:** esta pregunta es casi segura en una entrevista. Respóndela en voz alta, contando **tu** prueba.

> 🌎 **En la vida real:** Contar tu primera prueba es como contar tu primer gol: dónde estabas, qué hiciste y cómo supiste que entró.

> 🎤 **Entrevista:** "Cuéntame una prueba que escribiste."

<details>
<summary>Ver una buena respuesta</summary>

"En el proyecto de práctica, igual que en Copiloto, el conductor puede ponerle nombre a su empresa, con un máximo de dos palabras y 24 letras. Escribí pruebas para los casos normales y los de borde: justo dos palabras, tres palabras, solo espacios y un nombre muy largo. Después cambié el límite a propósito para comprobar que la prueba fallaba, y lo devolví."

**Lo que el entrevistador quiere oír:** que pensaste en **los bordes** y que **comprobaste que la prueba falla** cuando debe.

</details>

```practica
escribe :: Cuenta en 3 frases la prueba que escribiste en esta clase. :: Probé la regla del nombre de Mi empresa (máximo 2 palabras y 24 letras) con casos normales y de borde; corrí las pruebas con Vitest; y cambié el límite a propósito para ver que la prueba fallaba, y lo devolví.
```

> 🔁 **Repaso final de la clase:** escribiste tu primera prueba de verdad: regla, tabla a mano con bordes, archivo `.test.ts`, `describe`/`it`/`expect`, correr con `npx vitest run`, sabotear y devolver, y revisar con `git status`. Próxima: **Tema 04, CI**.
