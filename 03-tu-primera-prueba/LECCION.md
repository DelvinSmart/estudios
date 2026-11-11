# Tema 03: Tu primera prueba

En el Tema 02 leíste pruebas. Ahora vas a **escribir una tú**, dentro de tu app de verdad. Vas a probar la regla del nombre de "Mi empresa", la misma función que leíste en el Tema 01.

**Antes de empezar:** necesitas haber hecho los Temas 01 y 02.

**Tiempo:** de 30 a 60 minutos.

## Lo que vas a usar

| Cosa | Qué es |
|---|---|
| **Jest** | La herramienta de pruebas de la app. Ya viene instalada. |
| **Terminal** | Donde escribes los comandos. En VS Code: menú **Terminal → New Terminal**. |
| **La carpeta de la app** | `/Volumes/SSD_Desarrollo/Developer/copiloto-driver` |

## Paso 1. Escribe la regla en palabras

Antes de tocar el código, escribe en un papel la regla de `normalizeMyCompanyName`:

> - Quita los espacios de los lados y deja un solo espacio entre palabras.
> - Si queda vacío, devuelve vacío (la app vuelve a "Mi empresa").
> - Si tiene más de 24 letras, es inválido (`null`).
> - Si tiene más de 2 palabras, es inválido (`null`).
> - Si no, devuelve el nombre limpio.

## Paso 2. Piensa los casos y calcula lo esperado

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

1. Abre la carpeta de la app en VS Code.
2. Ve a la carpeta `src/utils/__tests__/`. Ahí viven las pruebas de las reglas.
3. Crea un archivo nuevo llamado `miPrimeraPrueba.test.ts`.
   - El nombre **tiene que terminar en `.test.ts`**. Así Jest sabe que es una prueba.

## Paso 4. Escribe el esqueleto

Copia esto en el archivo. Son las partes fijas; tú vas a completar el resto.

```ts
import { normalizeMyCompanyName } from '../../data/workAppsCatalog';

describe('nombre de Mi empresa', () => {
  it('deja el nombre limpio cuando tiene espacios a los lados', () => {
    expect(normalizeMyCompanyName('  Thermomac  ')).toBe('Thermomac');
  });
});
```

**Qué es cada parte:**

| Parte | Qué hace |
|---|---|
| `import { ... } from '...'` | Trae la función que vas a probar. `../../` significa "sube dos carpetas": de `__tests__` a `utils` y de `utils` a `src`. Después entra a `data/workAppsCatalog`. |
| `describe('...', () => { ... })` | Agrupa varias pruebas bajo un título. |
| `it('...', () => { ... })` | Una prueba. El texto dice la regla en palabras. |
| `expect(x).toBe(y)` | "Espero que x sea igual a y". Si no lo es, la prueba falla. |
| `() => { ... }` | Una función sin nombre (se llama **función flecha**). Jest la ejecuta cuando corre la prueba. |

Para los casos que dan `null` se usa:
```ts
expect(normalizeMyCompanyName('Taxi Bom Ltda')).toBeNull();
```

## Paso 5. Corre tu prueba

En la terminal, dentro de la carpeta de la app:

```bash
npx jest src/utils/__tests__/miPrimeraPrueba.test.ts
```

- `npx jest` ejecuta Jest.
- Lo que va después es **solo tu archivo**, para que no corran las otras 180 pruebas.

Debes ver algo así:
```text
PASS  src/utils/__tests__/miPrimeraPrueba.test.ts
  nombre de Mi empresa
    ✓ deja el nombre limpio cuando tiene espacios a los lados

Tests:       1 passed, 1 total
```

## Paso 6. Completa los casos

Agrega un `it(...)` por cada fila de tu tabla del Paso 2. Corre la prueba después de cada uno. Si alguno falla, revisa en este orden:
1. ¿Calculé bien lo esperado?
2. ¿Escribí bien la prueba (comillas, paréntesis)?
3. ¿El código de la app está mal? (casi nunca será esto)

## Paso 7. Sabotea

Vas a comprobar que tu prueba **sí protege** la regla.

1. Abre `src/data/workAppsCatalog.ts`.
2. Busca `export const MY_COMPANY_NAME_MAX_WORDS = 2;`
3. Cámbialo por `3`.
4. Corre tu prueba otra vez.

**Debe fallar** la prueba de `"Taxi Bom Ltda"`, porque ahora 3 palabras serían válidas. Lee el error:

```text
✕ es inválido con 3 palabras

  expect(received).toBeNull()
  Received: "Taxi Bom Ltda"
```
Se lee: "esperaba `null`, pero recibió el nombre". Tu prueba atrapó el cambio.

5. **Devuelve el 2.** Muy importante: no dejes la app cambiada.
6. Corre la prueba y confirma que todo pasa otra vez.

## Paso 8. Cierra

Esta regla ya tiene pruebas en `earningSourceRules.test.ts`, así que tu archivo es de práctica:
- **Bórralo** cuando termines, o
- muéstraselo a Claude, y si está bien escrito puede quedarse en la app.

Antes de terminar, en la terminal:
```bash
git status
```
Si sale `src/data/workAppsCatalog.ts` como modificado, todavía no devolviste el 2. Arréglalo antes de seguir.

## Ejercicio extra (si quieres más)

Escribe pruebas para `vehicleHasFuelTank` (en `src/utils/fuelLevel.ts`):
- Un carro tiene tanque.
- Una moto tiene tanque.
- Una bicicleta no tiene tanque.

## Respuestas de la tabla del Paso 2

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

**Cuéntame una prueba que escribiste.**
> En mi app, la persona puede ponerle nombre a su empresa, con un máximo de dos palabras y 24 letras. Escribí pruebas para los casos normales y los de borde: justo dos palabras, tres palabras, solo espacios y un nombre muy largo. Después cambié el límite a propósito para comprobar que la prueba fallaba, y lo devolví.
