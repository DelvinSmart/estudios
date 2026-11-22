# Leer código

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. La [lección](LECCION.md) es el resumen para repasar.

> 📌 **Si nunca programaste:** antes de esta clase conviene hacer las clases 45 a 48, empezando por [Variables, tipos y la consola](../45-js-variables-y-tipos/LECCION.md). Aquí vas a leer código de una app real, y se entiende mucho mejor si ya sabes qué son una variable, un `if`, una función y una lista. La ruta completa está en [Programar desde cero](../116-programar-desde-cero/LECCION.md), Parte 6.

**Cómo estudiarla:**
1. Lee una parte por día (o dos, si vas bien). No corras.
2. Cuando veas **✋ Para y piensa**, **detente**. Responde en voz alta o en un papel **antes** de abrir la respuesta. Ese momento es donde se aprende.
3. Al final de cada parte hay un **🔁 Repaso**. Si puedes decirlo con tus palabras sin mirar, toca **"¿lo entendiste? márcalo"** y se prende tu bombillo 💡.
4. Si algo no se entiende, vuelve a leer **solo esa parte**, despacio, en voz alta.

## 1. El lenguaje: TypeScript

> 🎙️ **El profesor:** {{alumno}}, empecemos por lo más básico de todo: ¿qué es el código? El código es **una lista de órdenes escritas para una computadora**. La computadora es muy obediente pero nada inteligente: hace **exactamente** lo que dice el texto, ni más ni menos. Por eso el código se escribe con reglas muy estrictas, como un formulario oficial.

> 🌎 **En la vida real:** Escribir código es como dejarle una nota a alguien muy obediente pero que no piensa: si dice "compra 2 panes", compra 2, aunque la panadería esté cerrada. Por eso las órdenes tienen que ser exactas.

> 🌎 **Otro ejemplo:** Es como el GPS: hace exactamente lo que le programaron. Si la dirección está mal escrita, te lleva tranquilo al lugar equivocado, sin dudar.

### Qué es un lenguaje de programación

Igual que las personas hablan español o portugués, las computadoras se programan en **lenguajes**: JavaScript, Python, Java, Kotlin… Cada uno tiene sus palabras y sus reglas. **Copiloto Driver**, la app real que usamos de ejemplo en todo el curso (una app para conductores, publicada en Google Play), está escrita en **TypeScript**.

> 🌎 **En la vida real:** el español y el portugués se parecen mucho: si sabes uno, lees bastante del otro. Con los lenguajes de programación pasa lo mismo. Si aprendes a leer TypeScript, después vas a entender gran parte de JavaScript, Java o Kotlin.

> 🌎 **Otro ejemplo:** Los lenguajes son como las marcas de carro: Toyota, Fiat o Chevrolet tienen volante, pedales y cambios. Si manejas uno, en pocos minutos manejas otro; solo cambia dónde está cada botón.

### JavaScript y TypeScript: la diferencia

**JavaScript** es el lenguaje de la web: lo entienden todos los navegadores. **TypeScript** es **JavaScript con tipos**. Se escribe casi igual, pero a cada dato le dices **qué clase de cosa es**.

¿Para qué sirve eso? Piensa en esta situación de Copiloto: hay una casilla para escribir **cuántos litros cargaste**. Si por un error del código, en vez de un número llega la palabra `"Etios"`, la app intentaría hacer cuentas con una palabra… y fallaría **en el teléfono del conductor**, en plena calle.

Con TypeScript, ese error aparece **antes**, cuando el programador escribe el código. El programa se niega a armarse hasta que lo arregles.

> 🌎 **En la vida real:** un formulario del banco con casillas marcadas: "Fecha (solo números)", "Nombre (solo letras)". Si escribes tu nombre en la casilla de la fecha, el empleado te lo devuelve **antes** de procesarlo. JavaScript es un formulario sin esas marcas: acepta cualquier cosa y el problema aparece después. TypeScript es el formulario con las marcas.

> 🌎 **Otro ejemplo:** Es como cargar combustible: JavaScript es la bomba que te deja meter diésel en un carro a gasolina, y te enteras cuando el motor falla en la calle. TypeScript es la boquilla que no entra en el tanque equivocado.

### Cómo se lee una línea con tipo

> 🌎 **En la vida real:** Es como etiquetar frascos en la cocina: "crea un frasco llamado azúcar, solo para cosas dulces, y llénalo con 1 kilo". El nombre es el frasco, el tipo es lo que se permite meter, y el `=` es llenarlo.

> 🌎 **Otro ejemplo:** Es como anotar en la libreta del carro: "kilometraje (número) = 45.000". Tiene nombre, dice qué clase de dato es y guarda el valor.

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

| Tipo | Qué guarda | Cómo se reconoce | Ejemplo en Copiloto |
|---|---|---|---|
| `string` | Texto | Va entre comillas `'...'` | El nombre de tu empresa: `'Thermomac'` |
| `number` | Números, con o sin decimales | Sin comillas | Litros: `45`, precio: `5.89` |
| `boolean` | Sí o no | Solo puede ser `true` o `false` | ¿El tanque está lleno? `true` |
| `null` | "Nada", **a propósito** | La palabra `null` | Un dato que todavía no existe |

Fíjate en tres detalles que confunden al principio:

1. **`'45'` y `45` no son lo mismo.** Con comillas es **texto** (como el número pintado en un cartel: no puedes sumarlo). Sin comillas es un **número** de verdad.
2. **Lo que está después de `//` es un comentario.** La computadora lo ignora. Es una nota para las personas que leen el código.
3. **`string | null`** se lee **"texto o nada"**. La barra `|` significa **"o"**.

> 🌎 **En la vida real:** En la planilla de un viaje: el pasajero es `string` ("Juan"), el valor es `number` (18,50), "¿pagó con tarjeta?" es `boolean` (sí o no) y la propina, si no hubo, es `null` (nada, a propósito).

> 🌎 **Otro ejemplo:** Es como el tablero del carro: el nombre del modelo es texto (`string`), la velocidad es un número (`number`) y la luz del cinturón está prendida o apagada (`boolean`). Cada indicador muestra un solo tipo de dato.

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

> 🔁 **Repaso:** TypeScript es JavaScript con tipos. Cada caja dice qué clase de dato guarda: `string` (texto), `number` (número), `boolean` (sí o no) y `null` (nada, a propósito). Así los errores aparecen en tu computadora, no en el teléfono del conductor.

## 2. `null`: cuando no hay respuesta (y por qué no es cero)

> 🎙️ **El profesor dice:** ya viste los cuatro tipos. Ahora, el que más confunde y más errores causa: `null`. Vale la pena ir despacio con este, porque entenderlo bien te ahorra muchos dolores de cabeza.

### `null` a fondo: cero no es lo mismo que "no sé"

> 🎙️ **El profesor:** `null` es el tipo que más cuesta al principio, porque parece "cero" o "vacío". No lo es. Vamos con un caso de tu trabajo que lo deja claro para siempre.

**Primero, qué es:** `null` quiere decir **"nada", puesto a propósito**. No es un error ni un olvido: es la respuesta **"no hay"** o **"todavía no se sabe"**.

> 🌎 **En la vida real:** `null` es dejar una casilla vacía **a propósito**, como poner "—" en "segundo apellido" cuando no tienes. No es un error: es la respuesta "no hay".

**El caso: las propinas de tres viajes.**

Terminas el día con tres viajes:

| Viaje | ¿Qué pasó con la propina? | Cómo se guarda |
|---|---|---|
| 1 | El pasajero dejó R$ 10 | `10` |
| 2 | El viaje terminó y el pasajero **no dejó** propina | `0` |
| 3 | El viaje **todavía no terminó**: la app no sabe si habrá propina | `null` |

Mira la diferencia entre el viaje 2 y el 3:
- En el **viaje 2** sí **sabemos** la respuesta: fue **cero**. Es un número.
- En el **viaje 3** **no sabemos** todavía. No es cero: es **"no hay dato"**. Eso es `null`.

**Por qué importa: el promedio de propinas.**

```ts
const propinas: (number | null)[] = [10, 0, null];

// ❌ Si tratas null como si fuera 0:
// (10 + 0 + 0) / 3 = 3,33   → dice que ganas 3,33 por viaje. Está MAL: el viaje 3 ni terminó.

// ✅ Si separas lo que sabes de lo que no sabes:
const conocidas = propinas.filter((p) => p !== null);   // [10, 0]
const promedio = (10 + 0) / conocidas.length;           // 5   → el promedio real de los viajes terminados
```

Hay varias piezas nuevas. Léelas así:

- `(number | null)[]`: los corchetes `[]` significan **lista**. Es una lista donde cada dato es un número **o** `null`.
- `propinas.filter(...)`: **filtra** la lista y deja solo los datos que cumplen una condición, como separar las monedas buenas de las rotas.
- `(p) => p !== null`: es la condición. Se lee: «toma cada dato, llámalo `p`, y déjalo solo si **no es** `null`». La flecha `=>` crea una función corta, y `!==` significa **«es distinto de»**.
- `conocidas.length`: dice **cuántos datos** tiene la lista. Aquí, 2.

Si confundes `null` con `0`, **la cuenta sale mal** y tomas decisiones con un número falso. Por eso existe `null`: para decir "esto no se sabe todavía" sin inventar un número.

**TypeScript te obliga a pensarlo.** Si una caja es `number | null` ("número, o nada"), TypeScript **no te deja** usarla como número sin revisar antes:

```ts
let propina: number | null = null;

propina.toFixed(2);              // ❌ TypeScript avisa: "propina puede ser null"

if (propina !== null) {
  propina.toFixed(2);            // ✅ aquí adentro TypeScript ya sabe que es un número
}
const texto = propina ?? 'todavía no se sabe';   // ✅ si es null, muestra otra cosa
```

- `propina.toFixed(2)` muestra el número con **dos decimales**: `10` se ve como `'10.00'`. Si `propina` es `null`, no hay número que mostrar, y por eso TypeScript avisa.
- `if (propina !== null) { ... }` significa: «**si** la propina no es `null`, haz lo que está entre llaves».
- `??` significa **«y si no hay, usa esto»**. `propina ?? 'todavía no se sabe'` da la propina; si es `null`, da ese texto.

Ese aviso es lo que evita que la app de Copiloto se rompa al mostrar una propina que no existe.

**Los cuatro "vacíos" que no son lo mismo:**

| Valor | Qué significa | En el tanque del carro |
|---|---|---|
| `0` | Sé la respuesta y es **cero** | Medí el tanque: está **vacío** |
| `''` (texto vacío) | Hay una caja de texto, pero **sin letras** | Escribiste el nombre del combustible… sin escribir nada |
| `null` | **No hay dato, a propósito** | Todavía **no medí** el tanque |
| `undefined` | **Nadie llenó** esa caja (ni siquiera con "nada") | Hay un tanque en la lista que **nadie anotó** |

> 🌎 **En la vida real:** en una encuesta preguntan "¿cuántos hijos tienes?". Quien contesta **0** dio una respuesta: no tiene hijos. Quien **dejó la pregunta en blanco** no respondió: eso es `null`. Si cuentas los blancos como "cero hijos", el promedio de hijos de la encuesta sale mal.

> 🌎 **Otro ejemplo:** en el tablero del carro, el indicador de combustible en **cero** te dice "el tanque está vacío". Si el indicador está **apagado porque se quemó el foco**, no sabes cuánto hay: no es "vacío", es "no sé". Llenar el tanque por las dudas o quedarte tirado depende de no confundir las dos cosas.

> ✋ **Para y piensa:** en Copiloto, el kilometraje del **próximo cambio de aceite** de un carro recién registrado, que todavía no tiene ningún cambio anotado, ¿es `0` o `null`?

<details>
<summary>Ver la respuesta</summary>

**`null`**. No es que el próximo cambio sea en el kilómetro cero: es que **todavía no hay dato** para calcularlo. Si pusieras `0`, la app creería que el cambio ya está vencido y te mandaría una alerta falsa.

</details>

```practica
vf :: Una propina de 0 y una propina null significan lo mismo
vf :: Si cuentas los null como si fueran 0, un promedio puede salir mal
vf :: Con una caja number | null, TypeScript te obliga a revisar si es null antes de usarla como número
elige :: El viaje todavía no terminó. ¿Cómo guardas su propina? :: 0 :: null :: ''
elige :: ¿Qué promedio de propinas da [10, 0, null] si haces bien la cuenta? :: 3,33 :: 5 :: 10
elige :: ¿Qué hace propina ?? 'todavía no se sabe'? :: Suma la propina :: Si propina es null, muestra 'todavía no se sabe' :: Borra la propina
escribe :: Con tus palabras y un ejemplo tuyo: ¿por qué null no es lo mismo que 0? :: Porque 0 es una respuesta conocida (por ejemplo, el pasajero no dejó propina) y null es que todavía no hay dato (el viaje no terminó); si los confundo, las cuentas como el promedio salen mal.
```

> 🔁 **Repaso:** `null` quiere decir **"no hay dato"**, a propósito; `0` es una respuesta conocida. Antes de usar como número una caja que puede ser `null`, hay que revisarla (TypeScript te obliga), y `??` pone un valor por defecto cuando es `null`.

## 3. `null` en un formulario de verdad: la casilla "(opcional)"

> 🎙️ **El profesor:** piensa en una planilla que pide varios datos, y uno dice **"(opcional)"**. Si la persona lo deja en blanco, ¿qué guarda el programa? Esa es la forma más fácil de recordar `null`.

Cuando alguien **no escribe nada** en una casilla opcional, el programa puede guardarlo de tres formas, según cómo esté hecho:

| Cómo se guarda | Qué significa |
|---|---|
| `''` (texto vacío) | El formulario mandó la casilla, pero sin letras. Es lo que sale "solo" de un campo de texto. |
| `null` | El programa guardó **"no hay dato"**, a propósito. |
| La casilla ni aparece (`undefined`) | No se mandó: ese dato no existe en lo guardado. |

**Lo correcto casi siempre es convertir el vacío en `null`**, para que quede claro que la persona **no respondió**, y no que respondió "algo vacío":

```ts
const nota = textoEscrito.trim() === '' ? null : textoEscrito.trim();
```

Esa línea parece difícil, pero es una pregunta con dos respuestas:

- `textoEscrito.trim()` quita los espacios del principio y del final.
- `=== ''` pregunta: **«¿quedó exactamente vacío?»**. Tres signos `=` **comparan**; uno solo **guarda**.
- `pregunta ? siSí : siNo` elige entre dos valores. Si quedó vacío, guarda `null`; si no, guarda el texto limpio.

Y en TypeScript lo vas a ver de dos formas:

```ts
interface Gasto {
  valor: number;          // obligatorio
  nota: string | null;    // la casilla existe siempre, pero puede ser "nada"
  foto?: string;          // el "?" = opcional: puede ni venir (undefined)
}
```

- `interface Gasto { ... }` es como el **molde de un formulario**: dice qué datos tiene un gasto y de qué tipo es cada uno. No guarda ningún gasto todavía.
- `foto?: string`: el signo `?` después del nombre significa que ese dato es **opcional**, así que puede no venir.

**En Copiloto:** al registrar un gasto, la **nota** es opcional. Si no escribes nada, se guarda `null` ("no dejó nota"); si escribes "lavado completo", se guarda ese texto. Cuando la app muestra el gasto, revisa primero: si la nota es `null`, no dibuja la línea de la nota.

**La regla para recordarlo:** `null` = **"pregunté y no hay respuesta"**. Una casilla opcional en blanco es `null`. Pero un **0 que la persona escribió** (por ejemplo, "propina: 0") **sí es una respuesta**: es un número.

> 🌎 **En la vida real:** en la ficha del médico dice "alergias (opcional)". Si la dejas en blanco, el médico no anota "cero alergias": anota que **no se sabe**. Si escribes "ninguna", eso sí es una respuesta. Blanco es `null`; "ninguna" es un dato.

> 🌎 **Otro ejemplo:** al registrarte en una app de transporte, "segundo teléfono (opcional)". Si no lo pones, la app guarda `null` y nunca intenta llamarlo. Si guardara `''`, podría intentar marcar un número vacío y fallar.

**Ahora sí, a practicar.** Ya viste todo lo de esta parte (los tipos y `null` a fondo). Responde las tres prácticas:

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **Poner el tipo:** va después del nombre, con dos puntos: `const ciudad: string = 'Blumenau';`.
> - **Lista de textos:** se escribe `string[]`. Por ejemplo, `const colores: string[] = ['rojo', 'plata'];`.
> - **Una función es una máquina:** recibe datos, hace un trabajo y devuelve un resultado. En la parte 4 la verás pieza por pieza. Este modelo recibe dos números y devuelve su suma:
>
> ```ts
> function sumar(a: number, b: number): number {
>   return a + b;
> }
> ```
>
> Los tipos de `a` y `b` dicen qué recibe. El `: number` después del paréntesis dice qué devuelve. `return` entrega el resultado. Para dividir se usa `/`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Ponle los tipos (TypeScript te revisa)
lenguaje: ts
pide: Escribe los tipos que faltan: `marca` es un texto, `anio` un número, `tieneTanque` un sí o no, y `apps` una lista de textos. Después completa `precioPorLitro`, que recibe dos números y devuelve un número. Si un tipo está mal, TypeScript te dice la línea.
--- código
const marca = 'Toyota';
const anio = 2017;
const tieneTanque = true;
const apps = ['Uber', '99'];

function precioPorLitro(total, litros) {
  // tu código aquí
}
--- pruebas
const m: string = marca; const a: number = anio; const t: boolean = tieneTanque; const l: string[] = apps;
prueba('240 reales por 40 litros son 6 por litro', () => igual(precioPorLitro(240, 40), 6));
const r: number = precioPorLitro(1, 1);
--- solución
const marca: string = 'Toyota';
const anio: number = 2017;
const tieneTanque: boolean = true;
const apps: string[] = ['Uber', '99'];

function precioPorLitro(total: number, litros: number): number {
  return total / litros;
}
```

```practica
vf :: Una casilla opcional que la persona deja en blanco conviene guardarla como null
vf :: Si la persona escribe 0 en "propina", eso es null
elige :: En TypeScript, ¿qué significa foto?: string? :: Que es obligatoria :: Que es opcional: puede ni venir (undefined) :: Que es un número
elige :: ¿Qué hace textoEscrito.trim() === '' ? null : textoEscrito.trim()? :: Borra el formulario :: Si la casilla quedó vacía guarda null; si no, guarda el texto limpio :: Convierte el texto en número
escribe :: Explica con un formulario de tu vida por qué una casilla opcional en blanco es null. :: Por ejemplo, la nota de un gasto: si no escribo nada, no hay dato, entonces se guarda null; si escribo una nota, se guarda el texto. null es "pregunté y no hay respuesta".
```

> 🔁 **Repaso:** el código son órdenes escritas para la computadora. La app Copiloto está en TypeScript, que es JavaScript con tipos. Los tipos (`string`, `number`, `boolean`, `null`) dicen qué clase de dato va en cada caja, y así los errores aparecen antes de llegar al teléfono. Y `null` no es cero: es **"no hay dato"** (como una casilla opcional en blanco), y TypeScript te obliga a revisarlo antes de usarlo.

## 4. Las cinco piezas

> 🎙️ **El profesor:** ahora te voy a contar un secreto que tranquiliza mucho: **casi todo el código del mundo se arma con las mismas cinco piezas**. Una app gigante como Uber y tu función más chica usan las mismas cinco. Si las reconoces, puedes empezar a leer cualquier archivo.

> 🌎 **En la vida real:** Con un juego de Lego armas una casa, un avión o un barco, pero las piezas siempre son las mismas. El código es igual: millones de programas distintos, hechos con las mismas cinco piezas.

> 🌎 **Otro ejemplo:** Las cinco piezas son como las notas musicales: con solo siete notas se escribieron todas las canciones del mundo.

Las vamos a ver una por una, siempre con la misma pregunta: **¿para qué sirve?**

### Pieza 1: la constante

```ts
const MAX_PALABRAS = 2;
```

Una **constante** es una caja con nombre **cuyo contenido no cambia nunca**. Se crea con `const`. La diferencia con `let`: lo que guardas con `let` lo puedes cambiar después; con `const`, no.

Por costumbre, las constantes de "reglas" se escriben **EN_MAYÚSCULAS_CON_GUIONES**, para que se vean de lejos.

> 🌎 **En la vida real:** la etiqueta del frasco que dice "Sal". El frasco siempre se llama igual, y lo encuentras por su nombre. No lo vas a cambiar por "Azúcar" a mitad de la receta.

> 🌎 **Otro ejemplo:** El número de tu cédula: se da una vez y no cambia nunca. Todos los papeles lo usan por su nombre, "cédula", sin volver a preguntártelo.

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

> 🌎 **Otro ejemplo:** Una máquina de café: le das una cápsula y agua, aprietas el botón y te devuelve un café. Siempre el mismo trabajo, cada vez que la usas.

### Pieza 3: el `if` (la decisión)

```ts
if (litros > 0) {
  guardarCarga(litros);
}
```

`if` quiere decir **"si"**. Entre paréntesis va una **pregunta** que se responde con sí o no. Si la respuesta es sí (`true`), se hace lo que está entre llaves. Si es no, se salta.

Leída: **"si los litros son más que cero, guarda la carga"**.

> 🌎 **En la vida real:** "**si** el agua está hirviendo, **entonces** echo la pasta". Si no está hirviendo, espero. Cada `if` es una regla de decisión.

> 🌎 **Otro ejemplo:** El semáforo: **si** está en rojo, frenas; **si no**, sigues. Cada `if` es una decisión de ese tipo.

### Pieza 4: la lista (array)

```ts
const apps = ['Uber', '99', 'inDrive'];
```

Una **lista** guarda **varios valores en orden**, entre corchetes `[ ]`, separados por comas. A cada uno se llega por su **posición**, que empieza en **cero**: `apps[0]` es `'Uber'`, `apps[1]` es `'99'`.

> 🌎 **En la vida real:** la lista del supermercado: arroz, frijoles, café. Varias cosas, en orden.

> 🌎 **Otro ejemplo:** La fila de un banco: varias personas en orden, y cada una tiene su turno: la primera es la 0, la segunda la 1.

### Pieza 5: el objeto

```ts
const carro = { marca: 'Toyota', modelo: 'Etios', anio: 2017 };

carro.modelo;   // 'Etios'
```

Un **objeto** guarda **varios datos de una misma cosa**, cada uno con su nombre. Va entre llaves `{ }`, con la forma `nombre: valor`. Para leer un dato se usa un punto: `carro.modelo`.

> 🌎 **En la vida real:** la ficha de tu carro en el taller: marca Toyota, modelo Etios, año 2017, color plata. Muchos datos, todos del mismo carro, cada uno con su nombre.

> 🌎 **Otro ejemplo:** Tu perfil en una app: nombre, foto, ciudad, teléfono. Varios datos, todos de la misma persona, cada uno con su etiqueta.

### Las cinco juntas

> 🌎 **En la vida real:** Es como una cocina: la etiqueta del frasco (constante), la licuadora (función), "si hierve, echo la pasta" (if), la lista de compras (lista) y la ficha de la receta (objeto). Con eso se cocina casi todo.

> 🌎 **Otro ejemplo:** En tu trabajo de conductor: la tarifa mínima (constante), el cálculo del valor del viaje (función), "si es de noche, cobra más" (if), los viajes del día (lista) y cada viaje con su origen, destino y valor (objeto).

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

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.split()` y `.join()`**: `texto.split(' ')` corta un texto donde hay un espacio y te da una lista: `'hola mundo'.split(' ')` → `['hola', 'mundo']`. `.join(' ')` hace lo contrario: une la lista en un solo texto.
> - **`.length`**: dice cuántos elementos tiene una lista. `['Taxi', 'Bom'].length` da `2`.
> - **Devolver un objeto:** `return { cabe: true, palabras: 2 };` entrega dos datos juntos, cada uno con su nombre.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las cinco piezas en una sola función
lenguaje: js
pide: Usa las cinco piezas: una **constante** `MAX_PALABRAS` con 2, una **función** `cabeEnElLetrero(nombre)`, un **if**, una **lista** (la que da `split`) y un **objeto** como respuesta: `{ cabe: true/false, palabras: N }`. Cabe si tiene `MAX_PALABRAS` palabras o menos.
--- código
// tu código aquí
--- pruebas
prueba('la constante vale 2', () => igual(MAX_PALABRAS, 2));
prueba('"Taxi Bom" cabe', () => igual(cabeEnElLetrero('Taxi Bom'), { cabe: true, palabras: 2 }));
prueba('"Taxi Bom Ltda" no cabe', () => igual(cabeEnElLetrero('Taxi Bom Ltda'), { cabe: false, palabras: 3 }));
prueba('"Uber" cabe', () => igual(cabeEnElLetrero('Uber'), { cabe: true, palabras: 1 }));
--- solución
const MAX_PALABRAS = 2;

function cabeEnElLetrero(nombre) {
  const palabras = nombre.split(' ');
  if (palabras.length > MAX_PALABRAS) {
    return { cabe: false, palabras: palabras.length };
  }
  return { cabe: true, palabras: palabras.length };
}
```

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

## 5. Primer ejemplo real: el nombre de "Mi empresa"

> 📌 **Nota:** el código de Copiloto es privado, pero todo lo que lees en esta clase está también en el proyecto de práctica **[Gastos del carro](https://github.com/DelvinSmart/gastos-del-carro)**, con nombres en español: esta función es `normalizarNombreEmpresa` en `src/datos/aplicaciones.ts`, y la de la parte 7 es `vehiculoTieneTanque` en `src/utils/combustible.ts`. Puedes abrirlos y leerlos con la clase al lado.

> 🎙️ **El profesor:** basta de ejemplos inventados. Ahora vamos a leer **código real de Copiloto**, el que corre hoy en los teléfonos. No te asustes si al principio se ve raro: vamos a ir línea por línea, y al final lo vas a poder explicar tú.

> 🌎 **En la vida real:** Es como el formulario para inscribir a un niño en la escuela: alguien tiene que revisar que el nombre esté bien escrito y que entre en la casilla antes de imprimir la credencial.

> 🌎 **Otro ejemplo:** Es como el nombre que pones en el WhatsApp del negocio: si es demasiado largo, aparece cortado con "…". Por eso conviene un límite.

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

> 🌎 **Otro ejemplo:** Como el cartel de un taxi con el nombre de la empresa: si escribes "Transportes Rodríguez e Hijos del Sur Limitada", no entra en la puerta del carro.

### Las dos reglas de arriba

```ts
export const MY_COMPANY_NAME_MAX_WORDS = 2;
export const MY_COMPANY_NAME_MAX_LENGTH = 24;
```

- Son dos **constantes** (pieza 1): el máximo de **palabras** (2) y el máximo de **letras** (24).
- `export` quiere decir **"otros archivos pueden usar esto"**. La pantalla donde el conductor escribe el nombre también las usa, por ejemplo para avisarle cuántas letras le quedan.
- **¿Por qué no escribir `2` directamente más abajo?** Porque así la regla tiene **nombre** (se entiende qué es ese 2) y vive en **un solo lugar**. Si mañana decides permitir 3 palabras, cambias una línea y toda la app se entera.

> 🌎 **En la vida real:** la regla pegada en la pared de la imprenta: "máximo 2 palabras". Si el dueño cambia de idea, cambia **el cartel**, no le explica la regla a cada empleado por separado.

> 🌎 **Otro ejemplo:** Es como el límite de equipaje de la aerolínea: está escrito una vez en el reglamento (23 kg), y todos los empleados lo leen de ahí. Si cambia a 25, se cambia en el reglamento.

### El comentario

> 🌎 **En la vida real:** Es como la etiqueta pegada en una caja de mudanza: "platos, frágil". No es la mercadería, pero te dice qué hay adentro sin abrirla.

> 🌎 **Otro ejemplo:** Es como la nota que deja un mecánico en el capó: "cambié el aceite, revisar en 5.000 km". El carro no la lee; la lee la próxima persona.

```ts
/** Limpa o nome digitado; `null` = inválido (vazio volta ao nome padrão). */
```

Todo lo que está entre `/**` y `*/` es un **comentario**: la computadora lo ignora. Está en portugués porque el código de Copiloto tiene sus comentarios en portugués. Dice: *"Limpia el nombre escrito; `null` = inválido (vacío vuelve al nombre por defecto)"*. **Siempre lee el comentario primero**: te cuenta en una línea para qué existe la función.

### La firma de la función

> 🌎 **En la vida real:** Es como la portada de un formulario: "Solicitud de licencia. Entregue: su documento. Recibirá: la licencia o una carta de rechazo". Con solo leer la portada sabes qué hace la oficina.

> 🌎 **Otro ejemplo:** Es como el menú de un restaurante: "Hamburguesa: lleva pan y carne, sale con papas". Sabes qué entra y qué sale sin entrar a la cocina.

```ts
export function normalizeMyCompanyName(text: string): string | null {
```

A esta primera línea se le llama **la firma**. Te dice todo lo importante sin leer el resto:

- **Nombre:** `normalizeMyCompanyName` = "normalizar el nombre de Mi empresa". *Normalizar* es dejar algo en su forma limpia y correcta.
- **Recibe:** `(text: string)` → un texto, que adentro se llama `text`. Es lo que escribió el conductor.
- **Devuelve:** `: string | null` → **un texto o nada**. Si devuelve texto, es el nombre limpio. Si devuelve `null`, significa **"este nombre no sirve"**.

> 🔁 **Repaso:** la función limpia el nombre que el conductor escribe en "Mi empresa". Las dos constantes de arriba guardan las reglas (`MY_COMPANY_NAME_MAX_WORDS`, 2 palabras, y `MY_COMPANY_NAME_MAX_LENGTH`, 24 letras), el comentario explica para qué sirve, y la firma dice el nombre, qué recibe (un texto) y qué devuelve (el nombre limpio, o `null` si no sirve).

## 6. El nombre de "Mi empresa", línea por línea

> 🎙️ **El profesor:** ya conoces el problema, las reglas y la firma. Ahora leemos el cuerpo de la función, **una línea a la vez**, como un colador con varios filtros.

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

> 🌎 **Otro ejemplo:** Como limpiar un texto que copiaste de WhatsApp con espacios de más: dejas un espacio entre palabras y borras los de las puntas.

### Línea 2: ¿escribió algo?

> 🌎 **En la vida real:** Como el cajero que te dice "no escribió ningún monto, vuelva al inicio": si no hay nada, no sigue con el trámite.

> 🌎 **Otro ejemplo:** Como dejar en blanco el apodo de tu perfil: la app vuelve a mostrar tu nombre normal.

```ts
if (!clean) return '';
```

- `!` se lee **"no"**. `!clean` = "**no** hay nada en `clean`" (el texto quedó vacío).
- Si quedó vacío, `return ''` → devuelve un **texto vacío** y **termina la función ahí mismo**. Las líneas de abajo ya no se leen.
- ¿Qué hace la app con un texto vacío? Vuelve a mostrar el nombre por defecto, **"Mi empresa"**.

> 💡 **Idea:** fíjate que `''` (vacío) y `null` **no son lo mismo** en esta función. Vacío quiere decir "no escribió nada: usa el nombre de siempre". `null` quiere decir "escribió algo que no sirve". Son dos respuestas distintas para dos situaciones distintas.

### Línea 3: ¿es demasiado largo?

> 🌎 **En la vida real:** Como el límite de caracteres de una placa de carro: si no entra en la placa, no se puede fabricar.

> 🌎 **Otro ejemplo:** Como un SMS antiguo: más de 160 letras no entraban en un solo mensaje.

```ts
if (clean.length > MY_COMPANY_NAME_MAX_LENGTH) return null;
```

- `clean.length` → **cuántos caracteres** tiene el texto (letras, espacios, todo). `'Thermomac'.length` es 9.
- `>` → "mayor que".
- Se lee: **"si tiene más de 24 caracteres, devuelve `null`"** (no sirve) y termina.

### Línea 4: ¿son demasiadas palabras?

> 🌎 **En la vida real:** Como el cartel de un local que solo tiene lugar para dos palabras grandes: "Pizza Rápida" entra; "Pizzería La Rápida del Centro" no.

> 🌎 **Otro ejemplo:** Como cortar un pan en rebanadas para contar cuántas hay: `split` corta el nombre en palabras y `length` las cuenta.

```ts
if (clean.split(' ').length > MY_COMPANY_NAME_MAX_WORDS) return null;
```

- `clean.split(' ')` → **corta** el texto en cada espacio y arma una **lista** (pieza 4) con los pedazos:
  `'Refrigeración Silva Ltda'.split(' ')` → `['Refrigeración', 'Silva', 'Ltda']`.
- `.length` de una lista → **cuántos elementos tiene**. Aquí, 3.
- Se lee: **"si tiene más de 2 palabras, devuelve `null`"**.

> 💡 **Idea:** esta línea funciona bien **gracias a la línea 1**. Como ya se dejaron los espacios en uno solo, cortar por `' '` cuenta las palabras de verdad. Sin la limpieza, `'Refrigeración···Silva'` se cortaría en pedazos vacíos y contaría mal. Una línea prepara el terreno para la otra.

### Línea 5: todo bien

> 🌎 **En la vida real:** Como el guardia que, después de revisar el documento, la mochila y la entrada, te dice "puede pasar".

> 🌎 **Otro ejemplo:** Como un control de calidad: si el producto pasó todos los controles, sale a la venta tal como está.

```ts
return clean;
```

Si llegó hasta aquí, pasó todos los controles. Devuelve **el nombre limpio**.

### La función entera, como un colador

> 🌎 **En la vida real:** Un colador de café con varias mallas: el agua pasa por la primera, la segunda y la tercera, y lo que se traba en una malla ya no sigue.

> 🌎 **Otro ejemplo:** La revisión técnica del carro por estaciones: luces, frenos y emisiones. Si falla en frenos, no sigue a emisiones: sale con el rechazo.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Escribe tú la regla de "Mi empresa"
lenguaje: ts
pide: Ya la leíste línea por línea. Ahora escríbela tú, **sin mirar**: `normalizarNombreEmpresa(texto)` limpia los espacios (uno solo entre palabras y ninguno en las puntas), devuelve `''` si queda vacío, y `null` si tiene más de 24 letras o más de 2 palabras. Es la misma función que está en el proyecto de práctica, en `src/datos/aplicaciones.ts`.
--- código
const NOMBRE_EMPRESA_MAX_PALABRAS = 2;
const NOMBRE_EMPRESA_MAX_LETRAS = 24;

function normalizarNombreEmpresa(texto: string): string | null {
  // tu código aquí
  return texto;
}
--- pruebas
prueba('quita los espacios de las puntas', () => igual(normalizarNombreEmpresa('  Thermomac  '), 'Thermomac'));
prueba('un solo espacio entre palabras', () => igual(normalizarNombreEmpresa('Refrigeración    Silva'), 'Refrigeración Silva'));
prueba('vacío da vacío', () => igual(normalizarNombreEmpresa('    '), ''));
prueba('2 palabras está bien', () => igual(normalizarNombreEmpresa('Taxi Bom'), 'Taxi Bom'));
prueba('3 palabras es null', () => igual(normalizarNombreEmpresa('Taxi Bom Ltda'), null));
prueba('más de 24 letras es null', () => igual(normalizarNombreEmpresa('Refrigeracionesdelnortebrasil'), null));
--- solución
const NOMBRE_EMPRESA_MAX_PALABRAS = 2;
const NOMBRE_EMPRESA_MAX_LETRAS = 24;

function normalizarNombreEmpresa(texto: string): string | null {
  const limpio = texto.replace(/\s+/g, ' ').trim();
  if (!limpio) return '';
  if (limpio.length > NOMBRE_EMPRESA_MAX_LETRAS) return null;
  if (limpio.split(' ').length > NOMBRE_EMPRESA_MAX_PALABRAS) return null;
  return limpio;
}
```

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

## 7. Segundo ejemplo real: ¿un ingreso es acumulativo?

> 🎙️ **El profesor:** ahora una función cortita, de una sola línea… pero que decide **cómo se cuenta el dinero en toda la app Copiloto**. Es un buen ejemplo de que en programación lo corto puede ser lo más importante.

> 🌎 **En la vida real:** Como la diferencia entre el saldo de tu cuenta del banco (ya incluye todo lo anterior) y los depósitos sueltos que haces (cada uno se suma).

> 🌎 **Otro ejemplo:** Como el marcador de un partido: si a los 30 minutos dice 2-0 y al final 3-0, el resultado es 3-0, no 5-0. El marcador ya acumula.

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

> 🌎 **Otro ejemplo:** Como la pantalla de la bomba de gasolina: el número que ves ya es el total cargado hasta ahora; no sumas cada vistazo.

### El comentario

> 🌎 **En la vida real:** Como el instructivo pegado en la tapa de una caja de herramientas: te cuenta en una línea para qué sirve todo lo de adentro.

> 🌎 **Otro ejemplo:** Como el título de un video: "Cómo cambiar una llanta". Antes de verlo, ya sabes de qué trata.

Dice, en portugués: *"Cada registro es independiente (nunca 'total del día'): Mi empresa, Viajes particulares y Extras. Las demás plataformas acumulan."* Otra vez: el comentario ya te contó toda la historia.

### La firma

> 🌎 **En la vida real:** Como una pregunta de sí o no en un formulario: "¿Es extranjero? ☐ Sí ☐ No". Entra un dato, sale sí o no.

> 🌎 **Otro ejemplo:** Como el portero que solo responde "pasa" o "no pasa". No da explicaciones largas: devuelve un `boolean`.

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

> 🌎 **Otro ejemplo:** Como el control de un evento con lista VIP: "si te llamas Ana, **o** Pedro, **o** Lucía, pasas". Con estar en uno de los tres nombres, alcanza.

### Probándola a mano

> 🌎 **En la vida real:** Como probar las llaves de un llavero en una puerta: una por una, hasta que una abre (o ninguna).

> 🌎 **Otro ejemplo:** Como verificar un pedido con la lista en la mano: "¿esto es Extras? No. ¿Viajes particulares? No. ¿Mi empresa? No" → entonces es acumulativa.

| Le pasas | `=== 'extras'` | `=== 'particular_trips'` | `=== 'my_company'` | Devuelve |
|---|---|---|---|---|
| `'uber'` | no | no | no | `false` → acumulativa |
| `'extras'` | **sí** | — | — | `true` → cada registro aparte |
| `'my_company'` | no | no | **sí** | `true` |

> 💡 **Idea:** fíjate en la fila de `'extras'`: apenas la primera comparación da sí, `||` ya sabe que la respuesta es `true` y **no mira las demás**. Con "o", una sola alcanza.

### Por qué una línea tan chica es tan importante

> 🌎 **En la vida real:** Como el tornillo de la rueda del carro: es una pieza chiquita, pero si se suelta, se va la rueda entera.

> 🌎 **Otro ejemplo:** Como un decimal mal puesto en un cheque: un solo punto convierte 100 en 10.000.

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

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.reduce()`**: recorre una lista y va juntando un resultado. `[10, 20, 5].reduce((suma, x) => suma + x, 0)` empieza en `0` y en cada vuelta suma el siguiente: da `35`. El `0` del final es el valor con que empieza.
> - **El último de una lista:** como las posiciones empiezan en 0, el último está en `lista[lista.length - 1]`. En una lista de 3, es la posición 2.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Acumulativa o independiente: el total del día
lenguaje: js
pide: `esPlataformaFija(id)` devuelve `true` para `'extras'`, `'viajes_particulares'` y `'mi_empresa'` (cada registro es independiente). `totalDelDia(id, registros)`: si la plataforma es fija, **suma** los registros; si es acumulativa (Uber, 99…), el total del día es **el último** registro. Sin registros, 0.
--- código
function esPlataformaFija(id) {
  // tu código aquí
}

function totalDelDia(id, registros) {
  // tu código aquí
}
--- pruebas
prueba('extras es fija', () => igual(esPlataformaFija('extras'), true));
prueba('uber no es fija', () => igual(esPlataformaFija('uber'), false));
prueba('Uber anotó 150 y después 320: ganó 320', () => igual(totalDelDia('uber', [150, 320]), 320));
prueba('dos viajes particulares de 50 y 30: ganó 80', () => igual(totalDelDia('viajes_particulares', [50, 30]), 80));
prueba('sin registros, 0', () => igual(totalDelDia('uber', []), 0));
--- solución
function esPlataformaFija(id) {
  return id === 'extras' || id === 'viajes_particulares' || id === 'mi_empresa';
}

function totalDelDia(id, registros) {
  if (registros.length === 0) return 0;
  if (esPlataformaFija(id)) return registros.reduce((s, r) => s + r, 0);
  return registros[registros.length - 1];
}
```

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

## 8. Cómo leer cualquier archivo

> 🎙️ **El profesor:** ya leíste dos funciones reales. Ahora te doy **el método**, para que puedas leer cualquier otra tú solo. Y una tranquilidad: ni los programadores con 20 años de experiencia entienden cada símbolo de un archivo nuevo a la primera. Lo que hacen es seguir un orden.

> 🌎 **En la vida real:** Leer código nuevo es como llegar a una ciudad desconocida: primero miras el mapa general y los letreros grandes; las calles chicas las aprendes después.

> 🌎 **Otro ejemplo:** Es como leer un contrato largo: primero el título y de qué trata, después qué das y qué recibes, y después las condiciones ("si pasa esto, entonces…").

### Los cuatro pasos

1. **Lee el comentario de arriba** (`/** … */`). Te dice **para qué existe**. Muchas veces con eso ya sabes el 70%.
2. **Lee la firma: qué recibe y qué devuelve.** Eso es **el trabajo** de la función. "Recibe un texto, devuelve un texto o `null`" ya cuenta mucho.
3. **Lee los `if`.** Ahí están **las reglas**: qué casos rechaza, qué casos trata distinto.
4. **No te trabes en un símbolo.** Si una línea no se entiende (como la expresión regular), sigue y vuelve después. Primero la idea general; los detalles después.

> 🌎 **En la vida real:** un electrodoméstico nuevo. No lees el manual entero: miras la caja ("licuadora de 3 velocidades"), ves qué entra y qué sale (fruta → jugo), lees las advertencias ("si la tapa no está, no arranca"), y no necesitas entender cada tornillo para usarla.

> 🌎 **Otro ejemplo:** Como armar un mueble nuevo: miras la foto de la caja, qué piezas trae, las advertencias del manual, y no te trabas en cada tornillo antes de empezar.

### Probemos el método con una función nueva

> 🌎 **En la vida real:** Como leer la etiqueta de un remedio que nunca usaste: nombre (para qué es), qué tomas y qué hace, y las advertencias ("no tomar si…").

> 🌎 **Otro ejemplo:** Como entender una señal de tránsito nueva: ves el dibujo, lees la palabra y adivinas la regla: "no pasan bicicletas".

Esta también es de Copiloto, del archivo `src/utils/fuelLevel.ts`. No la viste antes:

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

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.split(/\s+/)`** corta el texto en cada grupo de espacios.
> - **`.filter(Boolean)`** quita de la lista los pedazos vacíos.
> - **`.slice(0, 2)`** toma los **dos primeros** caracteres de un texto: `'Uber'.slice(0, 2)` da `'Ub'`.
> - **`.toUpperCase()`** pasa el texto a **mayúsculas**.
> - **`palabras[0][0]`** es la primera letra de la primera palabra. El primer `[0]` elige la palabra y el segundo elige la letra.
> - **`` `${a}${b}` ``** arma un texto con los valores de `a` y `b`, uno pegado al otro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lee una función que no viste, y predice
lenguaje: js
pide: Esta función es del proyecto de práctica (`src/datos/aplicaciones.ts`). Aplica los cuatro pasos (comentario, firma, reglas, junto) **sin correrla**, y completa `predicciones` con lo que crees que devuelve cada llamada. Después toca **▶ probar**.
--- código
/** Iniciales para el circulito de cada app: "Mi empresa" → "ME", "Uber" → "UB". */
function inicialesDe(nombre) {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '+';
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return `${palabras[0][0]}${palabras[1][0]}`.toUpperCase();
}

const predicciones = {
  'Viajes particulares': '',
  '99': '',
  '   ': '',
  'mi empresa nueva': '',
};
--- pruebas
for (const [entrada, prediccion] of Object.entries(predicciones)) {
  prueba(`inicialesDe(${JSON.stringify(entrada)})`, () => igual(prediccion, inicialesDe(entrada)));
}
--- solución
/** Iniciales para el circulito de cada app: "Mi empresa" → "ME", "Uber" → "UB". */
function inicialesDe(nombre) {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '+';
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
  return `${palabras[0][0]}${palabras[1][0]}`.toUpperCase();
}

const predicciones = {
  'Viajes particulares': 'VP',   // dos palabras: la primera letra de cada una
  '99': '99',                    // una palabra: sus dos primeras letras
  '   ': '+',                    // sin palabras: el +
  'mi empresa nueva': 'ME',      // solo mira las dos primeras palabras
};
```

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

> 🌎 **En la vida real:** Practicar es como los penales en el entrenamiento: no hay público, puedes errar, y cada error te enseña dónde apuntar.

**A. ¿Qué devuelve `normalizeMyCompanyName`?** Sigue el colador de la parte 6.
1. `"  Thermomac  "`
2. `"Refrigeración   Silva"` (con muchos espacios en el medio)
3. `""` (vacío)
4. `"Mi Empresa De Refrigeración"`

**B. Preguntas**
5. Si quisieras permitir 3 palabras, ¿qué línea cambiarías?
6. ¿Qué devuelve `isImmutableEarningPlatform('uber')`? ¿Y con `'extras'`?
7. ¿Por qué es mejor usar `MY_COMPANY_NAME_MAX_WORDS` que escribir `2` en el `if`?

**C. Para practicar leer**
8. Explica con tus palabras, en una frase, qué hace `vehicleHasFuelTank` (parte 8).

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

> 🌎 **En la vida real:** La entrevista es como contarle a un cliente cómo reparaste su carro: con tus palabras, con un ejemplo real, y sin leer.

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

> 🎤 **Entrevista:** "Cuéntame de una función de Copiloto que sea importante."

<details>
<summary>Ver una buena respuesta</summary>

"`isImmutableEarningPlatform`. Es una sola línea, pero decide cómo se cuentan las ganancias: para Uber el conductor anota el total del día, que ya incluye lo anterior; para Extras o Viajes particulares cada registro se suma aparte. Si esa función respondiera mal, todos los totales estarían mal. Por eso tiene pruebas automáticas."

**Lo que el entrevistador quiere oír:** que entiendes **por qué** importa, no solo **qué** hace.

</details>

> 🔁 **Repaso final de la clase:** sabes qué es TypeScript y sus tipos, reconoces las cinco piezas, leíste dos funciones reales de Copiloto línea por línea, tienes un método de cuatro pasos para leer cualquier archivo, y puedes explicarlo en una entrevista. Si lo puedes decir en voz alta sin mirar, esta clase está hecha. ¡Felicitaciones! Próxima: **Tema 02, Pruebas automáticas**.
