# Tema 01: Leer código

> 🌎 **En la vida real:** aprender a leer código es como aprender a leer una receta de cocina antes de cocinar. Primero entiendes qué dice ("pica la cebolla, fríela 5 minutos"); recién después te animas a escribir tu propia receta.

Antes de escribir código hay que saber leerlo. Casi todo el código del mundo se arma con las mismas piezas. Aquí las vas a aprender con dos funciones reales de Copiloto.

## 1. El lenguaje: TypeScript

> 🌎 **En la vida real:** imagina un formulario del banco con casillas marcadas: "Fecha (solo números)", "Nombre (solo letras)". Si escribes tu nombre en la casilla de la fecha, el empleado te lo devuelve **antes** de procesarlo. JavaScript es un formulario sin esas marcas: aceptaría el error y fallaría después. TypeScript es el formulario con las marcas.
> - `string` = la casilla "escribe aquí tu nombre".
> - `number` = la casilla "cuántos litros cargaste".
> - `boolean` = la casilla de marcar ☐ Sí / ☐ No.
> - `null` = dejar una casilla vacía **a propósito**, como poner "—" en "segundo apellido" cuando no tienes.

> 🌎 **Otro ejemplo:** Es como cargar combustible: JavaScript es la bomba que te deja meter diésel en un carro a gasolina; TypeScript es la boquilla que no entra en el tanque equivocado.

La app Copiloto está escrita en **TypeScript**. Es JavaScript con **tipos**: a cada dato le dices qué clase de cosa es (texto, número, lista...). Si te equivocas, la **revisión de tipos** lo marca sin tener que abrir la app. En Copiloto, esa revisión se hace con una herramienta llamada `tsc`.

```ts
let nombre: string = 'Thermomac';   // texto
let litros: number = 45;            // número
let activo: boolean = true;         // verdadero o falso
```

| Tipo | Qué guarda | Ejemplo |
|---|---|---|
| `string` | Texto, entre comillas | `'Etios'` |
| `number` | Números, con o sin decimales | `45`, `3.5` |
| `boolean` | Sí o no | `true`, `false` |
| `null` | "Nada", a propósito | `null` |

## 2. Las cinco piezas

> 🌎 **En la vida real:** piensa en una cocina:
> - **Constante** = la etiqueta del frasco que dice "Sal". El frasco siempre se llama igual; lo encuentras por su nombre.
> - **Función** = la licuadora: le pones frutas (lo que recibe), aprietas el botón y te da un jugo (lo que devuelve). Siempre hace el mismo trabajo.
> - **if** = la decisión "**si** el agua está hirviendo, **entonces** echo la pasta". Si no, espero.
> - **Lista** = la lista del supermercado: arroz, frijoles, café… varias cosas en orden.
> - **Objeto** = la ficha de tu carro en el taller: marca Toyota, modelo Etios, año 2017, color plata. Muchos datos, todos de la misma cosa, cada uno con su nombre.

> 🌎 **Otro ejemplo:** En tu trabajo de conductor: la tarifa mínima (constante), el cálculo del valor del viaje (función), "si es de noche, cobra más" (if), los viajes del día (lista) y cada viaje con su origen y destino (objeto).

| Pieza | Para qué | Cómo se ve |
|---|---|---|
| **Constante** | Guardar un valor con nombre, que no recibe otro mientras el programa corre | `const MAX = 2;` |
| **Función** | Una máquina: recibe algo y devuelve algo | `function sumar(a, b) { return a + b; }` |
| **if** | Tomar una decisión | `if (litros > 0) { ... }` |
| **Lista** (array) | Varios valores en orden | `['Uber', '99', 'inDrive']` |
| **Objeto** | Varios datos de una misma cosa, con nombre | `{ marca: 'Toyota', anio: 2017 }` |

## 3. Primer ejemplo real: el nombre de "Mi empresa"

> 🌎 **En la vida real:** es como el empleado de una imprenta que hace letreros para camionetas. Tú le dices el nombre y él:
> 1. Quita los espacios de más ("  Thermomac  " → "Thermomac"), como quien sacude el polvo antes de empezar.
> 2. Si no le dijiste nada, deja el letrero de siempre ("Mi empresa").
> 3. Si el nombre tiene más de 24 caracteres (letras, espacios y signos), te dice "no cabe en el letrero" (eso es `null`).
> 4. Si tiene más de 2 palabras, también te dice "no cabe".
> 5. Si pasó todo, imprime el nombre limpio (`return clean`).
>
> La constante `MAX_WORDS = 2` es como la regla pegada en la pared de la imprenta: "máximo 2 palabras". Si el dueño cambia de idea, cambia **el cartel de la pared**, no le explica la regla a cada empleado.

> 🌎 **Otro ejemplo:** Es como el nombre que pones en el WhatsApp del negocio: si es demasiado largo, aparece cortado con "…". Alguien tiene que limpiarlo y ponerle un límite.

Archivo: `src/data/workAppsCatalog.ts`. Decide si el nombre que escribes para "Mi empresa" es válido.

```ts
export const MY_COMPANY_NAME_MAX_WORDS = 2;
export const MY_COMPANY_NAME_MAX_LENGTH = 24;

export function normalizeMyCompanyName(text: string): string | null {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length > MY_COMPANY_NAME_MAX_LENGTH) return null;
  if (clean.split(' ').length > MY_COMPANY_NAME_MAX_WORDS) return null;
  return clean;
}
```

**Línea por línea:**

- `export const MY_COMPANY_NAME_MAX_WORDS = 2;`
  - `const` crea una **constante**: aquí guarda el 2, el máximo de palabras.
  - `export` permite que otros archivos la usen; el recuadro de cambiar el nombre la usa.
  - ¿Por qué no escribir `2` directo más abajo? Porque si mañana quieres 3 palabras, **editas esta línea** y publicas una versión nueva. Es un solo lugar. Mientras la app corre, vale 2 y ningún código le pone otro valor.
- `function normalizeMyCompanyName(text: string): string | null {`
  - `function` crea una **función**. Entra el nombre que escribiste y sale el nombre limpio.
  - `(text: string)` es lo que **recibe**: un texto.
  - `: string | null` es lo que **devuelve**: un texto **o** `null`. La barra `|` se lee "o". En esta función, `''` significa **no escribió nombre** y `null` significa **lo que escribió no cabe**. `null` no significa siempre "inválido": aquí lo decidió quien programó.
- `const clean = text.replace(/\s+/g, ' ').trim();`
  - `replace(/\s+/g, ' ')` cambia varios espacios seguidos por uno solo. Lo de entre barras es una **expresión regular**, un patrón para buscar texto; `\s+` quiere decir "uno o más espacios".
  - `.trim()` quita los espacios del principio y del final.
- `if (!clean) return '';`
  - `!` se lee "no". JavaScript trata `''`, `0`, `null` y `undefined` como "no" dentro de un `if`. Por eso `!clean` se lee: "si `clean` está vacío, devuelve vacío" (la app vuelve a mostrar "Mi empresa").
  - Ojo: `0` también cuenta como "no", y a veces 0 litros es un dato válido.
  - `return` termina la función y entrega el valor.
- `if (clean.length > MY_COMPANY_NAME_MAX_LENGTH) return null;`
  - `.length` es la cantidad de **caracteres**: letras, espacios, comas y signos. Más de 24 es inválido.
- `if (clean.split(' ').length > MY_COMPANY_NAME_MAX_WORDS) return null;`
  - `.split(' ')` corta el texto en cada espacio y forma una **lista**: `"Refrigeración Silva Ltda"` se vuelve `["Refrigeración", "Silva", "Ltda"]`, que son 3 palabras. Como pasa de 2, es inválido.
- `return clean;` Si pasó todos los filtros, devuelve el nombre limpio.

## 4. Segundo ejemplo real: ¿un ingreso es acumulativo?

> 🌎 **En la vida real:** piensa en el cuentakilómetros del carro y en una alcancía:
> - **Uber (acumulativo)** es como el cuentakilómetros: el número que ves **ya incluye** todo lo anterior. Si a las 10 dice 150 y a las 18 dice 320, ganaste 320 en el día, no 470. No se suman.
> - **Extras, Viajes particulares, Mi empresa (no acumulativos)** son como monedas que echas en la alcancía: cada una se **suma** a las anteriores. Una de 50 y otra de 30 son 80.
>
> `===` es como comparar dos llaves para ver si son **exactamente** iguales. `||` es el "o" de "aceptamos efectivo **o** tarjeta **o** Pix": con que se cumpla una, alcanza.

> 🌎 **Otro ejemplo:** Es como el marcador de un partido: si a los 30 minutos dice 2-0 y al final 3-0, el resultado es 3-0, no 5-0. Uber es el marcador; Extras son goles sueltos que se suman.

Archivo: `src/data/workAppsCatalog.ts`.

```ts
export function isImmutableEarningPlatform(appId: string): boolean {
  return appId === 'extras' || appId === 'particular_trips' || appId === 'my_company';
}
```

- Recibe el **id** de la plataforma (`'uber'`, `'extras'`...) y devuelve `boolean`: sí o no.
- `===` compara si dos cosas son exactamente iguales.
- `||` se lee "o". La función dice **sí** cuando es Extras, **o** Viajes particulares, **o** Mi empresa.
- Si dice sí, cada registro se suma aparte. Si dice no, el registro es acumulativo, como Uber.
- *Immutable* significa «inmutable». Aquí quiere decir que **cada registro es independiente y no representa el total del día**. No significa que no puedas corregirlo.

Una sola línea decide cómo se cuenta el dinero en toda la app. Por eso tiene pruebas (Tema 02).

## 5. Cómo leer cualquier archivo

> 🌎 **En la vida real:** es como leer un electrodoméstico nuevo sin leer todo el manual:
> 1. **El comentario de arriba** = la etiqueta de la caja: "Licuadora de 3 velocidades". Ya sabes para qué sirve.
> 2. **Qué recibe y qué devuelve** = "entra fruta, sale jugo". Con eso entiendes el trabajo.
> 3. **Los `if`** = las advertencias: "si la tapa no está puesta, no arranca". Ahí están las reglas.
> 4. **No hace falta entender cada tornillo** para usar la licuadora. Primero la idea general; los detalles después.

> 🌎 **Otro ejemplo:** Es como leer la etiqueta de un remedio que nunca usaste: para qué es, cómo se toma y las advertencias. No necesitas saber química para usarlo bien.

1. **Lee el comentario** de arriba (`/** ... */`). Dice para qué existe.
2. **Busca lo que recibe y lo que devuelve.** Eso te dice el trabajo de la función.
3. **Lee los `if`.** Ahí están las reglas.
4. **No necesitas entender cada símbolo.** Primero la idea, después los detalles.

## Ejercicios

> 🌎 **En la vida real:** es como el examen práctico de manejo: leer el manual no alcanza, hay que sentarse al volante. Equivocarte aquí es seguro; es un estacionamiento vacío, no la avenida.

**A. ¿Qué devuelve `normalizeMyCompanyName`?**
1. `"  Thermomac  "`
2. `"Refrigeración   Silva"` (con muchos espacios en el medio)
3. `""` (vacío)
4. `"Mi Empresa De Refrigeración"`

**B. Preguntas**
5. Si quisieras permitir 3 palabras, ¿qué línea cambiarías?
6. ¿Qué devuelve `isImmutableEarningPlatform('uber')`? ¿Y con `'extras'`?
7. ¿Por qué es mejor usar `MY_COMPANY_NAME_MAX_WORDS` que escribir `2` en el `if`?

**C. Para practicar leer**
8. Abre `src/utils/fuelLevel.ts` y busca la función `vehicleHasFuelTank`. Dime con tus palabras qué hace.

## Respuestas (míralas solo después de intentarlo)

> 🌎 **En la vida real:** es como el sudoku del periódico: las soluciones están al final de la página, pero si las miras antes, el juego no te enseña nada.

<details>
<summary>Ver respuestas</summary>

1. `"Thermomac"`: se quitan los espacios de los lados.
2. `"Refrigeración Silva"`: los espacios seguidos quedan en uno, y son 2 palabras.
3. `""`: no hay nombre, y la app vuelve a mostrar "Mi empresa".
4. `null`: son 4 palabras, más del máximo de 2.
5. `export const MY_COMPANY_NAME_MAX_WORDS = 2;` → cambiar el 2 por 3.
6. `false` para Uber (es acumulativa) y `true` para Extras (cada registro aparte).
7. Porque el número tiene nombre (se entiende qué es) y está en un solo lugar (si cambia, se cambia una vez).
8. Dice si el vehículo tiene tanque: devuelve `false` solo para la bicicleta.

</details>

## Para la entrevista

> 🌎 **En la vida real:** es como ensayar en voz alta lo que vas a decir antes de pedir un aumento. Si no lo puedes explicar con tus palabras a alguien que no sabe del tema, todavía no lo entendiste del todo.

**¿Qué es una función?**
> Un bloque de código con nombre que recibe datos, hace un trabajo y devuelve un resultado. Por ejemplo, en mi app una función recibe el nombre de la empresa y devuelve el nombre limpio o `null` si es inválido.

**¿Por qué TypeScript y no JavaScript?**
> Porque los tipos detectan errores antes de ejecutar: si una función espera un texto y le paso un número, la revisión con `tsc` lo marca. En Copiloto, esa revisión corre en el CI, la revisión automática del proyecto.
