# Tema 01: Leer código

Antes de escribir código hay que saber leerlo. Casi todo el código del mundo se arma con las mismas piezas. Aquí las vas a aprender con dos funciones reales de tu app.

## 1. El lenguaje: TypeScript

Tu app está escrita en **TypeScript**. Es JavaScript con **tipos**: a cada dato le dices qué clase de cosa es (texto, número, lista...). Si te equivocas, el programa avisa antes de llegar al teléfono.

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

| Pieza | Para qué | Cómo se ve |
|---|---|---|
| **Constante** | Guardar un valor con nombre que no cambia | `const MAX = 2;` |
| **Función** | Una máquina: recibe algo y devuelve algo | `function sumar(a, b) { return a + b; }` |
| **if** | Tomar una decisión | `if (litros > 0) { ... }` |
| **Lista** (array) | Varios valores en orden | `['Uber', '99', 'inDrive']` |
| **Objeto** | Varios datos de una misma cosa, con nombre | `{ marca: 'Toyota', anio: 2017 }` |

## 3. Primer ejemplo real: el nombre de "Mi empresa"

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
  - ¿Por qué no escribir `2` directo más abajo? Porque si mañana quieres 3 palabras, cambias **un solo lugar**.
- `function normalizeMyCompanyName(text: string): string | null {`
  - `function` crea una **función**. Entra el nombre que escribiste y sale el nombre limpio.
  - `(text: string)` es lo que **recibe**: un texto.
  - `: string | null` es lo que **devuelve**: un texto **o** `null`. La barra `|` se lee "o". Aquí `null` significa "nombre inválido".
- `const clean = text.replace(/\s+/g, ' ').trim();`
  - `replace(/\s+/g, ' ')` cambia varios espacios seguidos por uno solo. Lo de entre barras es una **expresión regular**, un patrón para buscar texto; `\s+` quiere decir "uno o más espacios".
  - `.trim()` quita los espacios del principio y del final.
- `if (!clean) return '';`
  - `!` se lee "no". "Si no hay nada escrito, devuelve vacío" (la app vuelve a mostrar "Mi empresa").
  - `return` termina la función y entrega el valor.
- `if (clean.length > MY_COMPANY_NAME_MAX_LENGTH) return null;`
  - `.length` es la cantidad de letras. Más de 24 es inválido.
- `if (clean.split(' ').length > MY_COMPANY_NAME_MAX_WORDS) return null;`
  - `.split(' ')` corta el texto en cada espacio y forma una **lista**: `"Refrigeración Silva Ltda"` se vuelve `["Refrigeración", "Silva", "Ltda"]`, que son 3 palabras. Como pasa de 2, es inválido.
- `return clean;` Si pasó todos los filtros, devuelve el nombre limpio.

## 4. Segundo ejemplo real: ¿un ingreso es acumulativo?

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

Una sola línea decide cómo se cuenta el dinero en toda la app. Por eso tiene pruebas (Tema 02).

## 5. Cómo leer cualquier archivo

1. **Lee el comentario** de arriba (`/** ... */`). Dice para qué existe.
2. **Busca lo que recibe y lo que devuelve.** Eso te dice el trabajo de la función.
3. **Lee los `if`.** Ahí están las reglas.
4. **No necesitas entender cada símbolo.** Primero la idea, después los detalles.

## Ejercicios

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

**¿Qué es una función?**
> Un bloque de código con nombre que recibe datos, hace un trabajo y devuelve un resultado. Por ejemplo, en mi app una función recibe el nombre de la empresa y devuelve el nombre limpio o `null` si es inválido.

**¿Por qué TypeScript y no JavaScript?**
> Porque los tipos detectan errores antes de ejecutar: si una función espera un texto y le paso un número, no compila.
