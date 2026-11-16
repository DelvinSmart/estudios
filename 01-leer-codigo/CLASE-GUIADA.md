# Clase guiada 01: Leer código

Esta es la clase **como si yo te la estuviera dando**, para que la puedas estudiar sin ninguna IA al lado. La [lección](LECCION.md) es el resumen para repasar; esta es la clase completa, explicada paso a paso.

**Cómo estudiarla:**
1. Lee una parte por día (o dos, si vas bien). No corras.
2. Cuando veas **✋ Para y piensa**, **detente**. Responde en voz alta o en un papel **antes** de abrir la respuesta. Ese momento es donde se aprende.
3. Al final de cada parte hay un **🔁 Repaso**. Si puedes decirlo con tus palabras sin mirar, toca **"¿lo entendiste? márcalo"** y se prende tu bombillo 💡.
4. Si algo no se entiende, vuelve a leer **solo esa parte**, despacio, en voz alta.

## 1. El lenguaje: TypeScript

> 🎙️ **El profesor:** Delvin, empecemos por lo más básico de todo: ¿qué es el código? El código es **una lista de órdenes escritas para una computadora**. La computadora es muy obediente pero nada inteligente: hace **exactamente** lo que dice el texto, ni más ni menos. Por eso el código se escribe con reglas muy estrictas, como un formulario oficial.

### Qué es un lenguaje de programación

Igual que las personas hablan español o portugués, las computadoras se programan en **lenguajes**: JavaScript, Python, Java, Kotlin… Cada uno tiene sus palabras y sus reglas. Tu app, **Copiloto Driver**, está escrita en **TypeScript**.

> 🌎 **En la vida real:** el español y el portugués se parecen mucho: si sabes uno, lees bastante del otro. Con los lenguajes de programación pasa lo mismo. Si aprendes a leer TypeScript, después vas a entender gran parte de JavaScript, Java o Kotlin.

### JavaScript y TypeScript: la diferencia

**JavaScript** es el lenguaje de la web: lo entienden todos los navegadores. **TypeScript** es **JavaScript con tipos**. Se escribe casi igual, pero a cada dato le dices **qué clase de cosa es**.

¿Para qué sirve eso? Piensa en esta situación de tu app: hay una casilla para escribir **cuántos litros cargaste**. Si por un error del código, en vez de un número llega la palabra `"Etios"`, la app intentaría hacer cuentas con una palabra… y fallaría **en el teléfono del conductor**, en plena calle.

Con TypeScript, ese error aparece **antes**, cuando el programador escribe el código. El programa se niega a armarse hasta que lo arregles.

> 🌎 **En la vida real:** un formulario del banco con casillas marcadas: "Fecha (solo números)", "Nombre (solo letras)". Si escribes tu nombre en la casilla de la fecha, el empleado te lo devuelve **antes** de procesarlo. JavaScript es un formulario sin esas marcas: acepta cualquier cosa y el problema aparece después. TypeScript es el formulario con las marcas.

### Cómo se lee una línea con tipo

Mira esta línea con calma. Vamos pieza por pieza:

```ts
let litros: number = 45;
```

| Pieza | Cómo se lee | Qué hace |
|---|---|---|
| `let` | "crea una caja que se llama…" | Crea una **variable**: una caja con nombre donde se guarda un dato |
| `litros` | "…litros…" | El **nombre** de la caja. Lo eliges tú. |
| `:` | "…que es de tipo…" | Anuncia el tipo |
| `number` | "…número…" | El **tipo**: en esta caja solo entran números |
| `=` | "…y adentro pon…" | **Guarda** un valor en la caja. ¡Ojo! No es "igual" como en matemáticas: es "guardar". |
| `45` | "…45" | El **valor** |
| `;` | (punto final) | Termina la orden, como el punto al final de una oración |

Leída entera: **"crea una caja llamada `litros`, de tipo número, y guarda adentro 45"**.

### Los cuatro tipos que vas a ver siempre

```ts
let nombre: string = 'Thermomac';   // texto
let litros: number = 45;            // número
let activo: boolean = true;         // verdadero o falso
let segundoApellido: string | null = null;   // texto, o nada
```

| Tipo | Qué guarda | Cómo se reconoce | Ejemplo en tu app |
|---|---|---|---|
| `string` | Texto | Va entre comillas `'...'` | El nombre de tu empresa: `'Thermomac'` |
| `number` | Números, con o sin decimales | Sin comillas | Litros: `45`, precio: `5.89` |
| `boolean` | Sí o no | Solo puede ser `true` o `false` | ¿El tanque está lleno? `true` |
| `null` | "Nada", **a propósito** | La palabra `null` | Un dato que todavía no existe |

Fíjate en tres detalles que confunden al principio:

1. **`'45'` y `45` no son lo mismo.** Con comillas es **texto** (como el número pintado en un cartel: no puedes sumarlo). Sin comillas es un **número** de verdad.
2. **Lo que está después de `//` es un comentario.** La computadora lo ignora. Es una nota para las personas que leen el código.
3. **`string | null`** se lee **"texto o nada"**. La barra `|` significa **"o"**.

> 🌎 **En la vida real:** `null` es dejar una casilla vacía **a propósito**, como poner "—" en "segundo apellido" cuando no tienes. No es un error: es la respuesta "no hay".

> ✋ **Para y piensa:** ¿de qué tipo es cada uno? `'Uber'`, `3.5`, `false`, `'false'`.

<details>
<summary>Ver la respuesta</summary>

- `'Uber'` → `string` (tiene comillas).
- `3.5` → `number` (sin comillas, con decimal).
- `false` → `boolean`.
- `'false'` → **`string`**. Es la trampa: con comillas es solo una palabra escrita, aunque diga "false".

</details>

> ✋ **Para y piensa:** si en TypeScript escribes `let litros: number = 'cuarenta';`, ¿qué pasa?

<details>
<summary>Ver la respuesta</summary>

TypeScript te marca un **error antes de correr el programa**: dijiste que en la caja `litros` solo entran números y le estás poniendo un texto. Es justo para lo que existen los tipos: atrapar el error en tu computadora, no en el teléfono del conductor.

</details>

```practica
escribe :: Con tus palabras: ¿qué es un `string`? Da un ejemplo. :: Un texto. Va entre comillas, por ejemplo `'Thermomac'` o `'Uber'`.
escribe :: Con tus palabras: ¿qué es un `number`? Da un ejemplo. :: Un número, con o sin decimales, sin comillas. Por ejemplo `45` litros o `5.89` de precio.
escribe :: Con tus palabras: ¿qué es un `boolean`? Da un ejemplo. :: Un dato que solo puede ser sí o no: `true` o `false`. Por ejemplo, si el tanque está lleno.
escribe :: Con tus palabras: ¿qué es `null`? :: "Nada", puesto a propósito: la respuesta "no hay", como poner "—" en segundo apellido.
vf :: `'Uber'` es un `string`
vf :: `45` es un `string`
vf :: `'45'` es un `number`
vf :: `true` es un `string`
vf :: `'false'` es un `boolean`
vf :: `3.5` es un `number`
vf :: `null` quiere decir que hubo un error
vf :: En `let litros: number = 45;` el signo `=` compara si litros es igual a 45
elige :: ¿De qué tipo es `false`? :: string :: number :: boolean :: null
elige :: ¿Qué tipo usarías para guardar el nombre de tu empresa? :: string :: number :: boolean
elige :: ¿Qué tipo usarías para guardar si un viaje fue cancelado o no? :: string :: number :: boolean :: null
elige :: ¿Qué es TypeScript? :: Un lenguaje distinto que no tiene nada que ver con JavaScript :: JavaScript con tipos, que avisa los errores antes de correr el programa :: Un programa para dibujar pantallas
```

> 🔁 **Repaso:** el código son órdenes escritas para la computadora. Tu app está en TypeScript, que es JavaScript con tipos. Los tipos (`string`, `number`, `boolean`, `null`) dicen qué clase de dato va en cada caja, y así los errores aparecen antes de llegar al teléfono.

## 2. Las cinco piezas

> 🎙️ **El profesor:** ahora te voy a contar un secreto que tranquiliza mucho: **casi todo el código del mundo se arma con las mismas cinco piezas**. Una app gigante como Uber y tu función más chica usan las mismas cinco. Si las reconoces, puedes empezar a leer cualquier archivo.

Las vamos a ver una por una, siempre con la misma pregunta: **¿para qué sirve?**

### Pieza 1: la constante

```ts
const MAX_PALABRAS = 2;
```

Una **constante** es una caja con nombre **cuyo contenido no cambia nunca**. Se crea con `const`. La diferencia con `let`: lo que guardas con `let` lo puedes cambiar después; con `const`, no.

Por costumbre, las constantes de "reglas" se escriben **EN_MAYÚSCULAS_CON_GUIONES**, para que se vean de lejos.

> 🌎 **En la vida real:** la etiqueta del frasco que dice "Sal". El frasco siempre se llama igual, y lo encuentras por su nombre. No lo vas a cambiar por "Azúcar" a mitad de la receta.

### Pieza 2: la función

```ts
function sumar(a: number, b: number): number {
  return a + b;
}

sumar(10, 5);   // da 15
```

Una **función** es **una máquina con nombre**: recibe algo, hace un trabajo y devuelve un resultado. Se escribe una vez y se usa muchas veces.

Leámosla pieza por pieza:

| Pieza | Qué es |
|---|---|
| `function` | "Aquí empieza una máquina…" |
| `sumar` | …que se llama `sumar` |
| `(a: number, b: number)` | Lo que **recibe**: dos números, que adentro se llaman `a` y `b` |
| `: number` (después del paréntesis) | Lo que **devuelve**: un número |
| `{ ... }` | Las llaves encierran **el trabajo** de la máquina |
| `return a + b;` | `return` **entrega** el resultado y termina la función |
| `sumar(10, 5)` | **Usar** la máquina: le das 10 y 5, te devuelve 15 |

> 🌎 **En la vida real:** la licuadora. Le pones frutas (lo que recibe), aprietas el botón y te da un jugo (lo que devuelve). Siempre hace el mismo trabajo, y la usas todos los días sin volver a armarla.

### Pieza 3: el `if` (la decisión)

```ts
if (litros > 0) {
  guardarCarga(litros);
}
```

`if` quiere decir **"si"**. Entre paréntesis va una **pregunta** que se responde con sí o no. Si la respuesta es sí (`true`), se hace lo que está entre llaves. Si es no, se salta.

Leída: **"si los litros son más que cero, guarda la carga"**.

> 🌎 **En la vida real:** "**si** el agua está hirviendo, **entonces** echo la pasta". Si no está hirviendo, espero. Cada `if` es una regla de decisión.

### Pieza 4: la lista (array)

```ts
const apps = ['Uber', '99', 'inDrive'];
```

Una **lista** guarda **varios valores en orden**, entre corchetes `[ ]`, separados por comas. A cada uno se llega por su **posición**, que empieza en **cero**: `apps[0]` es `'Uber'`, `apps[1]` es `'99'`.

> 🌎 **En la vida real:** la lista del supermercado: arroz, frijoles, café. Varias cosas, en orden.

### Pieza 5: el objeto

```ts
const carro = { marca: 'Toyota', modelo: 'Etios', anio: 2017 };

carro.modelo;   // 'Etios'
```

Un **objeto** guarda **varios datos de una misma cosa**, cada uno con su nombre. Va entre llaves `{ }`, con la forma `nombre: valor`. Para leer un dato se usa un punto: `carro.modelo`.

> 🌎 **En la vida real:** la ficha de tu carro en el taller: marca Toyota, modelo Etios, año 2017, color plata. Muchos datos, todos del mismo carro, cada uno con su nombre.

### Las cinco juntas

| Pieza | Para qué | Cómo se reconoce |
|---|---|---|
| **Constante** | Un valor con nombre que no cambia | `const` |
| **Función** | Una máquina: recibe, trabaja, devuelve | `function` … `return` |
| **if** | Tomar una decisión | `if ( pregunta ) { ... }` |
| **Lista** | Varios valores en orden | Corchetes `[ ]` |
| **Objeto** | Varios datos de una cosa, con nombre | Llaves con `nombre: valor` |

> ✋ **Para y piensa:** di qué pieza es cada línea:
> 1. `const MAX_LITROS = 60;`
> 2. `['rojo', 'plata', 'negro']`
> 3. `if (velocidad > 80) { avisar(); }`
> 4. `{ app: 'Uber', valor: 18 }`

<details>
<summary>Ver la respuesta</summary>

1. Constante (`const`, en mayúsculas, no cambia).
2. Lista (corchetes, valores en orden).
3. `if`: una decisión ("si la velocidad pasa de 80, avisa").
4. Objeto (llaves, datos con nombre de un mismo viaje).

</details>

> ✋ **Para y piensa:** en la lista `['Uber', '99', 'inDrive']`, ¿qué es `apps[2]`?

<details>
<summary>Ver la respuesta</summary>

`'inDrive'`. Las posiciones empiezan en **0**: Uber es la 0, 99 la 1, inDrive la 2. Esto confunde a todo el mundo al principio; con el tiempo se vuelve natural.

</details>

```practica
escribe :: Con tus palabras: ¿qué es una función? Usa una comparación de la vida real. :: Una máquina con nombre: recibe algo, hace un trabajo y devuelve un resultado. Como una licuadora: entra fruta, sale jugo.
escribe :: Con tus palabras: ¿para qué sirve un `if`? :: Para tomar una decisión: si la pregunta da sí (`true`), se hace lo de adentro; si da no, se salta.
escribe :: ¿Cuál es la diferencia entre una lista y un objeto? :: La lista guarda varios valores en orden, entre corchetes. El objeto guarda varios datos de una misma cosa, cada uno con su nombre, entre llaves.
elige :: `const MAX_LITROS = 60;` es… :: una lista :: un objeto :: una constante :: una función
elige :: `['rojo', 'plata', 'negro']` es… :: una lista :: un objeto :: un if
elige :: `{ app: 'Uber', valor: 18 }` es… :: una lista :: un objeto :: una constante
elige :: En `const apps = ['Uber', '99', 'inDrive']`, ¿qué es `apps[0]`? :: `'99'` :: `'Uber'` :: `'inDrive'`
vf :: `return` entrega el resultado y termina la función
vf :: Lo que se guarda con `const` se puede cambiar después
vf :: `carro.modelo` lee el dato `modelo` del objeto `carro`
```

> 🔁 **Repaso:** constante (un valor fijo con nombre), función (una máquina que recibe y devuelve), `if` (una decisión), lista (varios en orden) y objeto (varios datos de una cosa). Con estas cinco se arma casi todo.

## 3. Primer ejemplo real: el nombre de "Mi empresa"

> 🎙️ **El profesor:** basta de ejemplos inventados. Ahora vamos a leer **código real de tu app**, el que corre hoy en los teléfonos. No te asustes si al principio se ve raro: vamos a ir línea por línea, y al final lo vas a poder explicar tú.

### El problema que resuelve

En Copiloto Driver hay una plataforma llamada **"Mi empresa"**, para quien trabaja para su propia empresa. El conductor puede cambiarle el nombre (por ejemplo, a "Thermomac"). Pero ese nombre aparece en botones y tarjetas chicas, así que no puede ser cualquier cosa: tiene que ser **corto**. Alguien tiene que **revisar y limpiar** lo que el conductor escribe.

Ese "alguien" es esta función, del archivo `src/data/workAppsCatalog.ts`:

```ts
export const MY_COMPANY_NAME_MAX_WORDS = 2;
export const MY_COMPANY_NAME_MAX_LENGTH = 24;

/** Limpa o nome digitado; `null` = inválido (vazio volta ao nome padrão). */
export function normalizeMyCompanyName(text: string): string | null {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length > MY_COMPANY_NAME_MAX_LENGTH) return null;
  if (clean.split(' ').length > MY_COMPANY_NAME_MAX_WORDS) return null;
  return clean;
}
```

> 🌎 **En la vida real:** el empleado de una imprenta que hace letreros para camionetas. Tú le dices el nombre, y él: sacude el polvo (quita espacios de más), revisa que entre en el letrero (máximo 24 letras y 2 palabras) y, si todo está bien, lo imprime. Si no entra, te dice "no cabe".

### Las dos reglas de arriba

```ts
export const MY_COMPANY_NAME_MAX_WORDS = 2;
export const MY_COMPANY_NAME_MAX_LENGTH = 24;
```

- Son dos **constantes** (pieza 1): el máximo de **palabras** (2) y el máximo de **letras** (24).
- `export` quiere decir **"otros archivos pueden usar esto"**. La pantalla donde el conductor escribe el nombre también las usa, por ejemplo para avisarle cuántas letras le quedan.
- **¿Por qué no escribir `2` directamente más abajo?** Porque así la regla tiene **nombre** (se entiende qué es ese 2) y vive en **un solo lugar**. Si mañana decides permitir 3 palabras, cambias una línea y toda la app se entera.

> 🌎 **En la vida real:** la regla pegada en la pared de la imprenta: "máximo 2 palabras". Si el dueño cambia de idea, cambia **el cartel**, no le explica la regla a cada empleado por separado.

### El comentario

```ts
/** Limpa o nome digitado; `null` = inválido (vazio volta ao nome padrão). */
```

Todo lo que está entre `/**` y `*/` es un **comentario**: la computadora lo ignora. Está en portugués porque el código de tu app tiene sus comentarios en portugués. Dice: *"Limpia el nombre escrito; `null` = inválido (vacío vuelve al nombre por defecto)"*. **Siempre lee el comentario primero**: te cuenta en una línea para qué existe la función.

### La firma de la función

```ts
export function normalizeMyCompanyName(text: string): string | null {
```

A esta primera línea se le llama **la firma**. Te dice todo lo importante sin leer el resto:

- **Nombre:** `normalizeMyCompanyName` = "normalizar el nombre de Mi empresa". *Normalizar* es dejar algo en su forma limpia y correcta.
- **Recibe:** `(text: string)` → un texto, que adentro se llama `text`. Es lo que escribió el conductor.
- **Devuelve:** `: string | null` → **un texto o nada**. Si devuelve texto, es el nombre limpio. Si devuelve `null`, significa **"este nombre no sirve"**.

### Línea 1: limpiar los espacios

```ts
const clean = text.replace(/\s+/g, ' ').trim();
```

Esta es la línea más rara de la función. Vamos despacio, de izquierda a derecha:

1. `const clean =` → "crea una constante llamada `clean` (*limpio*) y guarda en ella lo que sigue".
2. `text.replace(…, ' ')` → "en el texto, **reemplaza** algo por un espacio". `replace` es una función que ya viene con todos los textos.
3. `/\s+/g` → **qué** reemplazar. Esto es una **expresión regular**: un patrón para buscar texto. Se lee así:
   - Las barras `/ … /` encierran el patrón.
   - `\s` significa **"un espacio"** (o un tab, o un salto de línea).
   - `+` significa **"uno o más seguidos"**.
   - La `g` del final significa **"en todo el texto"** (*global*), no solo la primera vez.
   - Junto: **"cada grupo de espacios seguidos"**.
4. Entonces `replace(/\s+/g, ' ')` = **"cada grupo de espacios seguidos, déjalo en un solo espacio"**.
5. `.trim()` → **quita los espacios del principio y del final**.

Veamos qué le pasa a un texto, paso a paso (uso `·` para mostrar cada espacio):

| Paso | Texto |
|---|---|
| Lo que escribió el conductor | `··Refrigeración·····Silva··` |
| Después de `replace` | `·Refrigeración·Silva·` |
| Después de `trim` | `Refrigeración·Silva` |

> 🌎 **En la vida real:** sacudir el polvo antes de empezar: el empleado de la imprenta no imprime los espacios que se te escaparon con el pulgar.

### Línea 2: ¿escribió algo?

```ts
if (!clean) return '';
```

- `!` se lee **"no"**. `!clean` = "**no** hay nada en `clean`" (el texto quedó vacío).
- Si quedó vacío, `return ''` → devuelve un **texto vacío** y **termina la función ahí mismo**. Las líneas de abajo ya no se leen.
- ¿Qué hace la app con un texto vacío? Vuelve a mostrar el nombre por defecto, **"Mi empresa"**.

> 💡 **Idea:** fíjate que `''` (vacío) y `null` **no son lo mismo** en esta función. Vacío quiere decir "no escribió nada: usa el nombre de siempre". `null` quiere decir "escribió algo que no sirve". Son dos respuestas distintas para dos situaciones distintas.

### Línea 3: ¿es demasiado largo?

```ts
if (clean.length > MY_COMPANY_NAME_MAX_LENGTH) return null;
```

- `clean.length` → **cuántos caracteres** tiene el texto (letras, espacios, todo). `'Thermomac'.length` es 9.
- `>` → "mayor que".
- Se lee: **"si tiene más de 24 caracteres, devuelve `null`"** (no sirve) y termina.

### Línea 4: ¿son demasiadas palabras?

```ts
if (clean.split(' ').length > MY_COMPANY_NAME_MAX_WORDS) return null;
```

- `clean.split(' ')` → **corta** el texto en cada espacio y arma una **lista** (pieza 4) con los pedazos:
  `'Refrigeración Silva Ltda'.split(' ')` → `['Refrigeración', 'Silva', 'Ltda']`.
- `.length` de una lista → **cuántos elementos tiene**. Aquí, 3.
- Se lee: **"si tiene más de 2 palabras, devuelve `null`"**.

> 💡 **Idea:** esta línea funciona bien **gracias a la línea 1**. Como ya se dejaron los espacios en uno solo, cortar por `' '` cuenta las palabras de verdad. Sin la limpieza, `'Refrigeración···Silva'` se cortaría en pedazos vacíos y contaría mal. Una línea prepara el terreno para la otra.

### Línea 5: todo bien

```ts
return clean;
```

Si llegó hasta aquí, pasó todos los controles. Devuelve **el nombre limpio**.

### La función entera, como un colador

Piensa en la función como **un colador de tres filtros**. Cada `if` es un filtro; si el nombre se traba en uno, sale por ahí y no sigue:

```text
lo que escribió ─► limpiar espacios ─► ¿vacío? ──sí──► ''   (volver a "Mi empresa")
                                          │ no
                                          ▼
                                     ¿> 24 letras? ──sí──► null (no sirve)
                                          │ no
                                          ▼
                                     ¿> 2 palabras? ──sí──► null (no sirve)
                                          │ no
                                          ▼
                                     el nombre limpio ✓
```

> ✋ **Para y piensa:** ¿qué devuelve la función con `'  Thermomac  '`? Sigue el colador paso a paso.

<details>
<summary>Ver la respuesta</summary>

1. Limpiar: `'Thermomac'` (se van los espacios de los lados).
2. ¿Vacío? No.
3. ¿Más de 24 letras? No, tiene 9.
4. ¿Más de 2 palabras? No, es 1.
5. Devuelve **`'Thermomac'`**.

</details>

> ✋ **Para y piensa:** ¿y con `'Transportes Rodríguez del Sur'`?

<details>
<summary>Ver la respuesta</summary>

1. Limpiar: queda igual.
2. ¿Vacío? No.
3. ¿Más de 24 letras? Cuenta: `Transportes Rodríguez del Sur` tiene 29 caracteres (con los espacios). **Sí** → devuelve **`null`**. Ni siquiera llega a contar las palabras (que también serían 4).

</details>

```practica
escribe :: Explica con tus palabras qué hace `normalizeMyCompanyName`, como si se lo contaras a otro conductor. :: Revisa y limpia el nombre que escribes para "Mi empresa": quita espacios de más; si quedó vacío usa "Mi empresa"; si pasa de 24 letras o de 2 palabras lo rechaza (`null`); si no, devuelve el nombre limpio.
elige :: ¿Qué devuelve con `'  Uber Eats  '`? :: `null` :: `'Uber Eats'` :: `''`
elige :: ¿Qué devuelve con `'Mi Empresa De Refrigeración'`? :: `'Mi Empresa'` :: `''` :: `null`
elige :: ¿Qué devuelve con `''` (vacío)? :: `null` :: `''` :: `'Mi empresa'`
elige :: ¿Qué hace `.trim()`? :: Corta el texto en palabras :: Quita los espacios del principio y del final :: Cuenta las letras
elige :: ¿Qué hace `'Refrigeración Silva'.split(' ')`? :: Cuenta las letras :: Arma la lista `['Refrigeración', 'Silva']` :: Quita los espacios
vf :: `!clean` se lee "no hay nada en clean"
vf :: En esta función, `''` y `null` significan lo mismo
vf :: `export` permite que otros archivos usen la constante
vf :: Si quiero permitir 3 palabras, tengo que cambiar el `2` en el `if`
```

> 🔁 **Repaso:** la función recibe lo que escribió el conductor, deja los espacios en uno solo y quita los de los lados; si quedó vacío devuelve `''` (usa "Mi empresa"); si pasa de 24 letras o de 2 palabras devuelve `null` (no sirve); si no, devuelve el nombre limpio. Las reglas son constantes con nombre, en un solo lugar.

## 4. Segundo ejemplo real: ¿un ingreso es acumulativo?

> 🎙️ **El profesor:** ahora una función cortita, de una sola línea… pero que decide **cómo se cuenta el dinero en toda tu app**. Es un buen ejemplo de que en programación lo corto puede ser lo más importante.

### El problema que resuelve

En Copiloto, cada plataforma registra lo ganado de una de dos formas:

- **Uber, 99, inDrive… (acumulativas):** el conductor anota **el total del día hasta ahora**. Si a las 10 anota 150 y a las 18 anota 320, ganó **320** en el día, no 470. El 320 **ya incluye** el 150.
- **Extras, Viajes particulares y Mi empresa (no acumulativas):** cada registro es **independiente**. Una carrera particular de 50 y otra de 30 suman **80**.

Si la app confundiera las dos, mostraría ganancias equivocadas. Esta función es la que decide:

```ts
/** Cada lançamento é independente (nunca "total do dia"): Minha empresa,
 * Corridas particulares e Extras. As demais plataformas acumulam. */
export function isImmutableEarningPlatform(appId: string): boolean {
  return appId === 'extras' || appId === 'particular_trips' || appId === 'my_company';
}
```

> 🌎 **En la vida real:** el cuentakilómetros y la alcancía. El **cuentakilómetros** (Uber) ya muestra todo lo acumulado: no se suman las lecturas. La **alcancía** (Extras) junta monedas sueltas: cada una se suma a las anteriores.

### El comentario

Dice, en portugués: *"Cada registro es independiente (nunca 'total del día'): Mi empresa, Viajes particulares y Extras. Las demás plataformas acumulan."* Otra vez: el comentario ya te contó toda la historia.

### La firma

- **Nombre:** `isImmutableEarningPlatform` = "¿es una plataforma de ingresos *inmutables*?". *Inmutable* = que no cambia: cada registro queda tal cual, no se "pisa" con el total siguiente.
- **Recibe:** `appId: string` → el **identificador** de la plataforma, un texto corto como `'uber'` o `'extras'`.
- **Devuelve:** `boolean` → **sí o no** (`true` o `false`).

> 💡 **Idea:** las funciones que devuelven `boolean` suelen empezar con `is…` ("es…"), `has…` ("tiene…") o `can…` ("puede…"). Con solo leer el nombre ya sabes que la respuesta es sí o no.

### La línea que decide

```ts
return appId === 'extras' || appId === 'particular_trips' || appId === 'my_company';
```

Dos símbolos nuevos:

| Símbolo | Se lee | Qué hace |
|---|---|---|
| `===` | "es exactamente igual a" | Compara dos cosas y da `true` o `false` |
| `\|\|` | "o" | Da `true` si **al menos una** de las preguntas es `true` |

Leída entera: **"devuelve sí si el id es `'extras'`, o si es `'particular_trips'`, o si es `'my_company'`"**. En cualquier otro caso, no.

> ⚠️ **Cuidado:** `=` y `===` son cosas muy distintas. **Un** `=` **guarda** un valor en una caja (`let litros = 45`). **Tres** `===` **comparan**. Confundirlos es uno de los errores más comunes del mundo.

> 🌎 **En la vida real:** `===` es comparar dos llaves para ver si son **exactamente** iguales. `||` es el cartel de la tienda que dice "aceptamos efectivo **o** tarjeta **o** Pix": con que se cumpla una, alcanza.

### Probándola a mano

| Le pasas | `=== 'extras'` | `=== 'particular_trips'` | `=== 'my_company'` | Devuelve |
|---|---|---|---|---|
| `'uber'` | no | no | no | `false` → acumulativa |
| `'extras'` | **sí** | — | — | `true` → cada registro aparte |
| `'my_company'` | no | no | **sí** | `true` |

> 💡 **Idea:** fíjate en la fila de `'extras'`: apenas la primera comparación da sí, `||` ya sabe que la respuesta es `true` y **no mira las demás**. Con "o", una sola alcanza.

### Por qué una línea tan chica es tan importante

Todos los totales de ganancias de la app dependen de esta respuesta. Si alguien la cambia por error, **todas** las ganancias de Extras se calcularían mal. Por eso esta función tiene **pruebas automáticas** que revisan que siga respondiendo bien (eso lo ves en el Tema 02).

> ✋ **Para y piensa:** ¿qué devuelve `isImmutableEarningPlatform('99')`? ¿Y `isImmutableEarningPlatform('particular_trips')`?

<details>
<summary>Ver la respuesta</summary>

- `'99'` → `false`: no es ninguna de las tres. Es acumulativa, como Uber.
- `'particular_trips'` → `true`: cada viaje particular se suma aparte.

</details>

> ✋ **Para y piensa:** mañana agregas una plataforma nueva, "Entregas", cuyo id es `'deliveries'`, y cada entrega se registra aparte. ¿Qué cambiarías?

<details>
<summary>Ver la respuesta</summary>

Agregarías una comparación más con `||`:

```ts
return appId === 'extras' || appId === 'particular_trips' || appId === 'my_company' || appId === 'deliveries';
```

Y, como es una regla de dinero, agregarías una prueba para `'deliveries'`.

</details>

```practica
escribe :: ¿Qué diferencia hay entre una plataforma acumulativa y una no acumulativa? Da un ejemplo de cada una. :: En la acumulativa (Uber) se anota el total del día, que ya incluye lo anterior: no se suman los registros. En la no acumulativa (Extras) cada registro es aparte y se suma.
elige :: ¿Qué devuelve `isImmutableEarningPlatform('uber')`? :: `true` :: `false` :: `null`
elige :: ¿Qué devuelve `isImmutableEarningPlatform('my_company')`? :: `true` :: `false`
elige :: ¿Cómo se lee `||`? :: "y" :: "o" :: "no" :: "igual"
elige :: ¿Qué hace `===`? :: Guarda un valor :: Compara si dos cosas son exactamente iguales :: Suma dos números
vf :: Uber anota 150 a las 10 y 320 a las 18: ganó 470 en el día
vf :: Extras anota 50 y después 30: ganó 80
vf :: Una función de una sola línea no puede ser importante
```

> 🔁 **Repaso:** la función recibe el id de una plataforma y responde sí o no: sí para Extras, Viajes particulares y Mi empresa (cada registro se suma aparte), no para el resto (acumulativas, como Uber). `===` compara exacto, `||` es "o", y por ser una regla de dinero tiene pruebas.

## 5. Cómo leer cualquier archivo

> 🎙️ **El profesor:** ya leíste dos funciones reales. Ahora te doy **el método**, para que puedas leer cualquier otra tú solo. Y una tranquilidad: ni los programadores con 20 años de experiencia entienden cada símbolo de un archivo nuevo a la primera. Lo que hacen es seguir un orden.

### Los cuatro pasos

1. **Lee el comentario de arriba** (`/** … */`). Te dice **para qué existe**. Muchas veces con eso ya sabes el 70%.
2. **Lee la firma: qué recibe y qué devuelve.** Eso es **el trabajo** de la función. "Recibe un texto, devuelve un texto o `null`" ya cuenta mucho.
3. **Lee los `if`.** Ahí están **las reglas**: qué casos rechaza, qué casos trata distinto.
4. **No te trabes en un símbolo.** Si una línea no se entiende (como la expresión regular), sigue y vuelve después. Primero la idea general; los detalles después.

> 🌎 **En la vida real:** un electrodoméstico nuevo. No lees el manual entero: miras la caja ("licuadora de 3 velocidades"), ves qué entra y qué sale (fruta → jugo), lees las advertencias ("si la tapa no está, no arranca"), y no necesitas entender cada tornillo para usarla.

### Probemos el método con una función nueva

Esta también es de tu app, del archivo `src/utils/fuelLevel.ts`. No la viste antes:

```ts
export function vehicleHasFuelTank(vehicleType: string | undefined): boolean {
  return vehicleType !== 'bicycle';
}
```

Apliquemos los cuatro pasos:

1. **Comentario:** no tiene. Pasamos al siguiente paso; el nombre ayuda.
2. **Firma:** se llama `vehicleHasFuelTank`, "¿el vehículo **tiene** tanque de combustible?". Empieza con `has`: devuelve **sí o no** (`boolean`). Recibe `vehicleType`, el tipo de vehículo, que es `string | undefined`: **un texto, o "no definido"** (`undefined` es parecido a `null`: "todavía no hay valor").
3. **Reglas:** no hay `if`, pero hay una comparación: `vehicleType !== 'bicycle'`. El `!==` es lo **contrario** de `===`: se lee **"es distinto de"**.
4. **Junto:** **"el vehículo tiene tanque si no es una bicicleta"**.

> ✋ **Para y piensa:** ¿qué devuelve con `'car'`? ¿Con `'motorcycle'`? ¿Con `'bicycle'`?

<details>
<summary>Ver la respuesta</summary>

- `'car'` → `true` (no es bicicleta: tiene tanque).
- `'motorcycle'` → `true`.
- `'bicycle'` → `false`: la bicicleta es lo único sin tanque. Por eso, en la app, a quien anda en bicicleta no le aparece lo del combustible.

</details>

```practica
escribe :: ¿Cuáles son los cuatro pasos para leer una función que no conoces? :: 1) Leer el comentario de arriba; 2) leer la firma: qué recibe y qué devuelve; 3) leer los `if` y las comparaciones (las reglas); 4) no trabarse en un símbolo: primero la idea general.
elige :: ¿Qué devuelve `vehicleHasFuelTank('car')`? :: `true` :: `false`
elige :: ¿Qué devuelve `vehicleHasFuelTank('bicycle')`? :: `true` :: `false`
elige :: ¿Cómo se lee `!==`? :: "es igual a" :: "es distinto de" :: "guarda"
vf :: Una función que empieza con `has` o `is` normalmente devuelve sí o no
vf :: Hay que entender cada símbolo antes de seguir leyendo
```

> 🔁 **Repaso:** para leer cualquier función: comentario (para qué existe), firma (qué recibe y qué devuelve), reglas (los `if` y las comparaciones), y no trabarse en un símbolo. `!==` es "distinto de", lo contrario de `===`.

## Ejercicios

> 🎙️ **El profesor:** ahora te toca a ti, sin ayuda. Usa una hoja de papel. Para cada respuesta, **escribe primero tu razonamiento** ("primero limpia, después…"), no solo el resultado. Recién cuando termines todas, abre las correcciones.

**A. ¿Qué devuelve `normalizeMyCompanyName`?** Sigue el colador de la parte 3.
1. `"  Thermomac  "`
2. `"Refrigeración   Silva"` (con muchos espacios en el medio)
3. `""` (vacío)
4. `"Mi Empresa De Refrigeración"`

**B. Preguntas**
5. Si quisieras permitir 3 palabras, ¿qué línea cambiarías?
6. ¿Qué devuelve `isImmutableEarningPlatform('uber')`? ¿Y con `'extras'`?
7. ¿Por qué es mejor usar `MY_COMPANY_NAME_MAX_WORDS` que escribir `2` en el `if`?

**C. Para practicar leer**
8. Explica con tus palabras, en una frase, qué hace `vehicleHasFuelTank` (parte 5).

**D. Un poco más difícil**
9. ¿Qué devuelve `normalizeMyCompanyName('     ')` (solo espacios)? ¿Por qué no devuelve `null`?
10. Escribe tú (en papel) la firma de una función que reciba los litros cargados (un número) y devuelva si es una carga válida (sí o no). Solo la primera línea.

<details>
<summary>Ver las correcciones explicadas</summary>

1. **`"Thermomac"`.** Al limpiar se van los espacios de los lados; no está vacío, tiene 9 letras y 1 palabra: pasa todo.
2. **`"Refrigeración Silva"`.** La limpieza deja un solo espacio en el medio. Tiene 19 caracteres (menos de 24) y 2 palabras (no más de 2): pasa.
3. **`""`.** Al limpiar sigue vacío; el primer `if` devuelve `''` y la app vuelve a mostrar "Mi empresa".
4. **`null`.** Tiene 27 caracteres (más de 24): ya se rechaza en el segundo filtro. (Además son 4 palabras.)
5. `export const MY_COMPANY_NAME_MAX_WORDS = 2;` → cambiar el `2` por `3`. Una sola línea, y toda la app lo respeta.
6. `'uber'` → **`false`** (acumulativa). `'extras'` → **`true`** (cada registro aparte).
7. Porque el número tiene **nombre** (se entiende qué significa) y está en **un solo lugar** (si cambia, se cambia una vez, y otros archivos lo pueden usar con `export`).
8. "Dice si un vehículo tiene tanque de combustible: todos sí, menos la bicicleta."
9. **`""`.** Los espacios se juntan en uno y `trim` los quita: el texto queda vacío, y el primer `if` devuelve `''`. No es `null` porque la función considera "solo espacios" como "no escribió nada", no como "escribió algo malo".
10. Por ejemplo: `function isValidFuelLoad(liters: number): boolean {` → recibe un número, devuelve sí o no, y el nombre empieza con `is`.

**Si te equivocaste en alguna:** vuelve a la parte que corresponde y recórrela con el colador, en voz alta. Equivocarse aquí es exactamente lo que tiene que pasar: es un estacionamiento vacío, no la avenida.

</details>

## Para la entrevista

> 🎙️ **El profesor:** última parte. Imagina que estás en una entrevista de trabajo y te hacen estas preguntas. **Respóndelas en voz alta**, como si hablaras con una persona, **antes** de leer la respuesta modelo. No tiene que ser igual: tiene que decir lo mismo con tus palabras.

> 🎤 **Entrevista:** "¿Qué es una función?"

<details>
<summary>Ver una buena respuesta</summary>

"Un bloque de código con nombre que recibe datos, hace un trabajo y devuelve un resultado, y se puede usar muchas veces. Por ejemplo, en mi app, `normalizeMyCompanyName` recibe el nombre que escribe el conductor para su empresa, lo limpia y devuelve el nombre limpio, o `null` si es demasiado largo o tiene demasiadas palabras."

**Lo que el entrevistador quiere oír:** recibe, trabaja, devuelve, se reutiliza… y **un ejemplo real tuyo**. El ejemplo propio es lo que te diferencia.

</details>

> 🎤 **Entrevista:** "¿Por qué usas TypeScript y no JavaScript?"

<details>
<summary>Ver una buena respuesta</summary>

"Porque los tipos detectan errores antes de ejecutar el programa. Si una función espera un texto y le paso un número, no compila. En una app que usan conductores en la calle, prefiero que el error aparezca en mi computadora y no en el teléfono de alguien."

</details>

> 🎤 **Entrevista:** "Cuéntame de una función de tu app que sea importante."

<details>
<summary>Ver una buena respuesta</summary>

"`isImmutableEarningPlatform`. Es una sola línea, pero decide cómo se cuentan las ganancias: para Uber el conductor anota el total del día, que ya incluye lo anterior; para Extras o Viajes particulares cada registro se suma aparte. Si esa función respondiera mal, todos los totales estarían mal. Por eso tiene pruebas automáticas."

**Lo que el entrevistador quiere oír:** que entiendes **por qué** importa, no solo **qué** hace.

</details>

> 🔁 **Repaso final de la clase:** sabes qué es TypeScript y sus tipos, reconoces las cinco piezas, leíste dos funciones reales de tu app línea por línea, tienes un método de cuatro pasos para leer cualquier archivo, y puedes explicarlo en una entrevista. Si lo puedes decir en voz alta sin mirar, esta clase está hecha. ¡Felicitaciones! Próxima: **Tema 02, Pruebas automáticas**.
