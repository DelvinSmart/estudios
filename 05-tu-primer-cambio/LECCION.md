# Tema 05: Tu primer cambio

Hasta ahora leíste código y escribiste una prueba. Ahora vas a **cambiar la app tú mismo** y ver el cambio en la pantalla. Son dos cambios pequeños y seguros: un texto y un tamaño. Al final los deshaces, para que la app quede como estaba.

**Antes de empezar:** Temas 01 a 03.

**Tiempo:** de 45 a 90 minutos.

## 1. Dónde vive cada cosa en la app

Antes de cambiar algo hay que saber dónde buscarlo. Las carpetas principales de `src/`:

| Carpeta | Qué hay | Ejemplo |
|---|---|---|
| `screens/` | Las **pantallas** completas | `onboarding/VehicleSetupScreen.tsx` (editar vehículo) |
| `components/` | **Piezas** que se usan en varias pantallas | `vehicles/VehicleFuelGauge.tsx` (la barra de combustible) |
| `i18n/locales/` | **Todos los textos**, uno por idioma | `es.ts`, `pt-BR.ts`, `en.ts`... |
| `theme/` | **Colores, letras y medidas** (los motores de diseño) | `dashboardTheme.ts` |
| `utils/` | **Reglas y cálculos** (sin pantalla) | `fuelLevel.ts` |
| `context/` | Los **datos** compartidos (ingresos, gastos, ajustes) | `EarningsContext.tsx` |
| `services/` | La conexión con **Firebase** y el teléfono | `cloud/...` |
| `ai-engine/` | El **Copiloto** | `memory/AIMemory.ts` |

**Regla de oro:** los textos **nunca** están escritos en la pantalla. La pantalla pide el texto por un nombre (una **clave**), y el texto real está en los archivos de idioma.

## 2. Prepara el simulador en modo Expo

El modo Expo hace que cada cambio que guardas aparezca **solo**, en segundos, sin instalar de nuevo.

En la terminal, dentro de la carpeta de la app:
```bash
./scripts/emuladores.sh expo
```
Espera a que se abra la app en el simulador del iPhone. La primera vez tarda como un minuto.

## 3. Primer cambio: un texto

Vas a cambiar el texto gris que aparece debajo de "Capacidad del tanque" en **Editar vehículo**:

> Opcional. Muestra cuánto combustible queda, en el Inicio.

### Paso 1. Encuentra el texto
1. En VS Code presiona **Cmd + Shift + F** (buscar en todo el proyecto).
2. Escribe: `Muestra cuánto combustible queda`
3. Aparece en `src/i18n/locales/es.ts`:
   ```ts
   tankCapacityHint: 'Opcional. Muestra cuánto combustible queda, en el Inicio.',
   ```

### Paso 2. Entiende cómo llega a la pantalla
- `tankCapacityHint` es la **clave**.
- Busca ahora `tankCapacityHint` (Cmd + Shift + F). Aparece en tres lugares:
  1. `src/i18n/types.ts` → el **contrato**: dice que esa clave existe y que es texto.
  2. Los **seis archivos de idioma** → el texto en cada idioma.
  3. `src/screens/onboarding/VehicleSetupScreen.tsx`:
     ```tsx
     <Text style={styles.fieldLegend}>{t('vehicles.setup.tankCapacityHint')}</Text>
     ```
     `t(...)` es la función que **traduce**: busca la clave en el idioma que elegiste y devuelve el texto.

### Paso 3. Cambia el texto
En `es.ts`, cambia la línea por:
```ts
tankCapacityHint: 'Opcional. ¡Este texto lo cambié yo!',
```
Guarda con **Cmd + S**.

### Paso 4. Míralo
En el simulador abre **Mi vehículo → el lápiz → baja hasta Capacidad del tanque**. Debe aparecer tu texto nuevo. Si la app está en español y no cambia, espera unos segundos o presiona **Cmd + R** en el simulador.

**Lo que aprendiste:** cambiar un texto es cambiar **el archivo de idioma**, no la pantalla.

## 4. Segundo cambio: un tamaño

Vas a hacer más corta la barra de combustible de la tarjeta del vehículo.

### Paso 1. Encuentra la pieza
Abre `src/components/vehicles/VehicleFuelGauge.tsx` y busca:
```ts
  bar: {
    flex: 1,
    maxWidth: '75%',
  },
```
- `bar` es el **estilo** de la barra.
- `maxWidth: '75%'` quiere decir que la barra ocupa como máximo el 75 % del espacio.

### Paso 2. Cámbialo
Pon `'40%'`. Guarda.

### Paso 3. Míralo
En el simulador ve al **Inicio**. La barra de combustible del Etios debe verse mucho más corta.

### Paso 4. Prueba otros valores
Prueba `'100%'`, y después `'60%'`. Así se diseña: se cambia, se mira y se ajusta.

**Lo que aprendiste:** el aspecto de las piezas está en sus **estilos** (`StyleSheet.create`).

## 5. Rompe algo a propósito (y mira quién te avisa)

1. En `src/i18n/locales/en.ts` (inglés), busca la línea de `tankCapacityHint` y **bórrala**. Guarda.
2. En la terminal corre:
   ```bash
   npx tsc --noEmit -p .
   ```
3. Va a salir un **error de TypeScript**: falta la clave en inglés. El contrato de `types.ts` exige que la clave esté en los seis idiomas.

**Esto es lo que vimos en el Tema 04:** el CI corre exactamente este comando. Si subieras así, el CI se pondría rojo y la app no saldría con un texto faltante.

## 6. Deshaz todo

Este tema es de práctica: **la app tiene que quedar como estaba**.

En la terminal:
```bash
git status
```
Vas a ver los archivos que cambiaste (`es.ts`, `en.ts`, `VehicleFuelGauge.tsx`). Para devolverlos a como estaban:
```bash
git restore src/i18n/locales/es.ts src/i18n/locales/en.ts src/components/vehicles/VehicleFuelGauge.tsx
```
Corre `git status` otra vez. Esos archivos ya no deben aparecer.

**Cuidado:** `git restore` borra los cambios de esos archivos **para siempre**. Úsalo solo en lo que quieres deshacer. En el Tema 06 lo vas a entender bien.

## 7. Cómo se hace un cambio de verdad (el proceso completo)

Cuando el cambio es para quedarse, en tu app siempre se sigue este orden (está en `AGENTS.md`):

1. Se cambia el código.
2. Se mira en el simulador.
3. Se corren las revisiones: `npx tsc --noEmit -p .` y `npm test`.
4. Se instala en el teléfono y **tú lo pruebas**.
5. Solo entonces: commit y push (Tema 06).

## Ejercicios

1. Cambia otro texto: el título "Registrar ingreso". Encuéntralo, cámbialo en español, míralo y deshazlo.
2. Pregunta: si cambias un texto solo en `es.ts`, ¿la persona que usa la app en portugués lo ve cambiado? ¿Por qué?
3. Pregunta: ¿por qué los textos no se escriben directamente en la pantalla?
4. Pregunta: ¿qué comando te avisa que falta una traducción?

<details>
<summary>Respuestas</summary>

2. No. Cada idioma tiene su archivo. En portugués, la app lee `pt-BR.ts`.
3. Porque la app está en seis idiomas. Si el texto estuviera en la pantalla, solo existiría en uno.
4. `npx tsc --noEmit -p .` (TypeScript), porque `types.ts` exige que cada clave esté en los seis idiomas.

</details>

## Para la entrevista

**¿Cómo maneja tu app varios idiomas?**
> Los textos no están en las pantallas. Cada pantalla pide el texto por una clave, y hay un archivo por idioma. Un archivo de tipos define todas las claves, así que si falta una traducción en cualquiera de los seis idiomas, TypeScript no compila y el CI lo detiene.
