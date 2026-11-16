# Clase guiada 05: Mi primer cambio

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** es una clase **práctica**: necesitas la computadora, la carpeta de la app y el simulador. Calcula de 45 a 90 minutos. Al final **deshaces todo**: la app tiene que quedar como estaba.

**Lo que necesitas saber antes:** Temas 01 a 03. (El 04 ayuda para entender la parte 5.)

## 1. Dónde vive cada cosa en la app

> 🎙️ **El profesor:** Delvin, hasta hoy leíste código, escribiste una prueba y entendiste el CI. Hoy vas a **cambiar tu app con tus manos** y ver el cambio en la pantalla. Pero antes de cambiar algo, hay que saber **dónde buscarlo**. Una app grande es como una casa grande: si no sabes en qué habitación está la llave, no la encuentras.

### Las carpetas de `src/`

Todo el código de la app vive dentro de `src/`. Estas son sus habitaciones:

| Carpeta | Qué hay | Ejemplo | 🌎 En la casa |
|---|---|---|---|
| `screens/` | Las **pantallas** completas | `onboarding/VehicleSetupScreen.tsx` (editar vehículo) | Las habitaciones: sala, cocina, cuarto |
| `components/` | **Piezas** que se repiten en varias pantallas | `vehicles/VehicleFuelGauge.tsx` (la barra de combustible) | Los muebles: la misma silla en la cocina y en el comedor |
| `i18n/locales/` | **Todos los textos**, un archivo por idioma | `es.ts`, `pt-BR.ts`, `en.ts`… | El cajón de los cartelitos en cada idioma |
| `theme/` | **Colores, letras y medidas** (los motores de diseño) | `dashboardTheme.ts` | El catálogo de pinturas |
| `utils/` | **Reglas y cálculos** (sin pantalla) | `fuelLevel.ts` | La calculadora de la cocina |
| `context/` | Los **datos** compartidos (ingresos, gastos, ajustes) | `EarningsContext.tsx` | La despensa que usan todas las habitaciones |
| `services/` | La conexión con **Firebase** y el teléfono | `cloud/...` | Las conexiones con la calle: luz, agua, internet |
| `ai-engine/` | El **Copiloto** | `memory/AIMemory.ts` | El mayordomo |

> 💡 **Idea:** **i18n** es una abreviatura en inglés de *internationalization* ("internacionalización"): la "i", 18 letras en el medio, y la "n". Quiere decir "preparar la app para varios idiomas".

### La regla de oro de los textos

En tu app, **los textos nunca se escriben directamente en la pantalla**. La pantalla pide el texto por un **nombre** (una **clave**), y el texto real está en el archivo de cada idioma.

¿Por qué? Porque tu app está en **seis idiomas** (español, portugués, inglés, francés, italiano y alemán). Si el texto estuviera escrito en la pantalla, existiría en uno solo.

> 🌎 **En la vida real:** un restaurante con menú en varios idiomas: el mesero no se aprende el plato en cada idioma; señala el **número** del plato (la clave), y el menú de cada idioma dice el nombre.

> ✋ **Para y piensa:** quieres cambiar el color de un botón. ¿En qué carpeta buscarías primero?

<details>
<summary>Ver la respuesta</summary>

En **`theme/`**, donde están los colores y medidas oficiales. (Recuerda el candado de diseño del Tema 04: los colores no se escriben a mano en las pantallas.)

</details>

```practica
elige :: ¿Dónde están las pantallas completas? :: `components/` :: `screens/` :: `utils/`
elige :: ¿Dónde están los textos de la app? :: En cada pantalla :: En `i18n/locales/`, un archivo por idioma :: En `theme/`
elige :: ¿Dónde están las reglas y cálculos sin pantalla, como `fuelLevel.ts`? :: `screens/` :: `context/` :: `utils/`
elige :: ¿En cuántos idiomas está tu app? :: 2 :: 3 :: 6
vf :: Una pieza que se usa en varias pantallas va en `components/`
escribe :: ¿Por qué los textos no se escriben directamente en la pantalla? :: Porque la app está en seis idiomas: la pantalla pide el texto por una clave y cada idioma tiene su archivo con el texto.
```

> 🔁 **Repaso:** `screens` (pantallas), `components` (piezas), `i18n/locales` (textos por idioma), `theme` (colores y medidas), `utils` (cálculos), `context` (datos), `services` (Firebase y teléfono), `ai-engine` (Copiloto). Los textos van por clave, nunca escritos en la pantalla.

## 2. Preparar el simulador en modo Expo

> 🎙️ **El profesor:** para ver tus cambios necesitas la app corriendo. Vamos a usar el **modo Expo**, que tiene un truco genial: cada vez que guardas un archivo, el cambio aparece **solo**, en segundos, sin instalar de nuevo.

En la terminal, dentro de la carpeta de la app:

```bash
./scripts/emuladores.sh expo
```

- `./scripts/emuladores.sh` es un script de tu app (un archivo con varios comandos guardados).
- `expo` le dice qué modo usar: el simulador del iPhone, con los cambios al instante.

Espera a que se abra la app en el simulador. **La primera vez tarda como un minuto.**

> 🌎 **En la vida real:** pintar una pared mirando por una ventana mágica: cada pincelada aparece al instante en la casa de verdad, sin construir la casa de nuevo.

```practica
elige :: ¿Qué tiene de bueno el modo Expo? :: Publica la app en la tienda :: Cada cambio que guardas aparece solo, en segundos :: Borra los cambios
vf :: La primera vez que se abre el simulador puede tardar como un minuto
```

> 🔁 **Repaso:** `./scripts/emuladores.sh expo` abre la app en el simulador del iPhone, y cada cambio guardado aparece solo.

## 3. Primer cambio: un texto

> 🎙️ **El profesor:** empezamos por lo más simple: cambiar un texto. Y en el camino vas a entender **cómo llega un texto desde un archivo hasta la pantalla**, que es lo importante.

Vamos a cambiar el texto gris que aparece debajo de "Capacidad del tanque" en **Editar vehículo**:

> Opcional. Muestra cuánto combustible queda, en el Inicio.

### Paso 1: encontrarlo

1. En VS Code presiona **Cmd + Shift + F** (buscar en **todo** el proyecto).
2. Escribe: `Muestra cuánto combustible queda`
3. Aparece en `src/i18n/locales/es.ts`:

```ts
tankCapacityHint: 'Opcional. Muestra cuánto combustible queda, en el Inicio.',
```

> 🌎 **En la vida real:** Cmd + Shift + F es el buscador de una biblioteca: escribes una frase y te dice en qué libro y en qué página está.

### Paso 2: entender cómo llega a la pantalla

`tankCapacityHint` es **la clave**. Ahora busca `tankCapacityHint` (otra vez con Cmd + Shift + F). Aparece en **tres tipos** de lugares:

1. **`src/i18n/types.ts`** → el **contrato**: dice que esa clave existe y que es un texto.

```ts
tankCapacityHint: string;
```

2. **Los seis archivos de idioma** → el texto en cada idioma:

| Archivo | Texto |
|---|---|
| `es.ts` | Opcional. Muestra cuánto combustible queda, en el Inicio. |
| `pt-BR.ts` | Opcional. Mostra quanto combustível resta, no Início. |
| `en.ts` | Optional. Shows how much fuel is left on Home. |
| `fr.ts`, `it.ts`, `de.ts` | Lo mismo en francés, italiano y alemán |

3. **La pantalla** `src/screens/onboarding/VehicleSetupScreen.tsx`:

```tsx
<Text style={styles.fieldLegend}>{t('vehicles.setup.tankCapacityHint')}</Text>
```

Leámosla:
- `<Text …> … </Text>` es una **caja de texto** en la pantalla (en las apps se escribe parecido al HTML).
- `style={styles.fieldLegend}` le da el estilo de "leyenda" gris.
- `{ … }` entre llaves quiere decir "aquí va algo calculado con código".
- `t('vehicles.setup.tankCapacityHint')` → **`t` es la función que traduce**: recibe la clave y devuelve el texto en el idioma que eligió el usuario.
- `vehicles.setup.tankCapacityHint` es la **dirección** de la clave: dentro de `vehicles`, dentro de `setup`, la clave `tankCapacityHint`. (En el archivo `es.ts` los textos están ordenados en cajas dentro de cajas.)

```text
vehicles: {
  setup: {
    tankCapacityHint: 'Opcional. Muestra cuánto…'
  }
}
```

> 🌎 **En la vida real:** `tankCapacityHint` es **el número del plato**; `types.ts` es **la lista oficial de platos**; los seis archivos son **el menú en seis idiomas**; y `t(...)` es **el mesero**: le dices "plato 14" y te trae el nombre en el idioma del cliente.

### Paso 3: cambiarlo

En `es.ts`, cambia la línea por:

```ts
tankCapacityHint: 'Opcional. ¡Este texto lo cambié yo!',
```

Guarda con **Cmd + S**.

### Paso 4: mirarlo

En el simulador abre **Mi vehículo → el lápiz → baja hasta Capacidad del tanque**. Debe aparecer tu texto nuevo. Si la app está en español y no cambia, espera unos segundos o presiona **Cmd + R** en el simulador (recargar).

**Lo que aprendiste:** cambiar un texto es cambiar **el archivo de idioma**, **no la pantalla**. La pantalla ni se enteró.

> ✋ **Para y piensa:** con la app en portugués, ¿ves tu texto nuevo?

<details>
<summary>Ver la respuesta</summary>

**No.** En portugués la app lee `pt-BR.ts`, que sigue igual. Cambiaste solo el menú en español.

</details>

```practica
elige :: ¿Qué es `tankCapacityHint`? :: El texto en español :: La clave (el nombre) del texto :: Una pantalla
elige :: ¿Qué hace la función `t(...)`? :: Borra el texto :: Recibe una clave y devuelve el texto en el idioma del usuario :: Cambia el color
elige :: ¿Qué archivo dice que la clave existe y que es un texto? :: `es.ts` :: `src/i18n/types.ts` :: `VehicleSetupScreen.tsx`
vf :: Para cambiar un texto hay que editar la pantalla
vf :: Si cambio solo `es.ts`, la persona que usa la app en portugués no ve el cambio
elige :: `vehicles.setup.tankCapacityHint` quiere decir… :: Tres textos distintos :: La clave `tankCapacityHint`, dentro de `setup`, dentro de `vehicles` :: Un error
escribe :: Explica el camino de un texto desde el archivo hasta la pantalla. :: La pantalla llama a `t` con la clave; `t` busca esa clave en el archivo del idioma del usuario (es.ts, pt-BR.ts…) y devuelve el texto; `types.ts` asegura que la clave exista en todos los idiomas.
```

> 🔁 **Repaso:** la pantalla pide `t('clave')`; `types.ts` es el contrato; cada idioma tiene su archivo con el texto. Cambiar un texto = cambiar el archivo de idioma.

## 4. Segundo cambio: un tamaño

> 🎙️ **El profesor:** ahora algo visual: vas a hacer **más corta la barra de combustible** de la tarjeta del vehículo. Así aprendes dónde vive el **aspecto** de una pieza.

### Paso 1: encontrar la pieza

Abre `src/components/vehicles/VehicleFuelGauge.tsx` y busca:

```ts
  bar: {
    flex: 1,
    maxWidth: '75%',
  },
```

- Esto está dentro de un `StyleSheet.create({ ... })`: la **lista de estilos** de la pieza. Es el CSS del Tema 16, pero escrito como objeto de JavaScript.
- `bar` es el **estilo** de la barra.
- `flex: 1` → "ocupa el espacio que sobre" (como en flexbox, Tema 16).
- `maxWidth: '75%'` → "pero **como máximo** el 75 % del ancho".

> 🌎 **En la vida real:** la ficha técnica de un mueble: "ancho máximo 75 % de la pared". Como una alfombra que cubre tres cuartos del piso.

### Paso 2: cambiarlo

Pon `'40%'` y guarda.

### Paso 3: mirarlo

En el simulador ve al **Inicio**. La barra de combustible del Etios debe verse **mucho más corta**.

### Paso 4: probar otros valores

Prueba `'100%'`, y después `'60%'`. **Así se diseña:** se cambia, se mira, se ajusta.

> 🌎 **En la vida real:** el peluquero corta un poco, mira en el espejo, corta otro poco y vuelve a mirar.

**Lo que aprendiste:** el aspecto de las piezas está en sus **estilos** (`StyleSheet.create`).

> ✋ **Para y piensa:** con `maxWidth: '100%'`, ¿cómo se ve la barra comparada con `'75%'`?

<details>
<summary>Ver la respuesta</summary>

**Más larga**: puede ocupar todo el ancho disponible, no solo tres cuartos.

</details>

```practica
elige :: ¿Dónde está el aspecto (tamaños, colores) de una pieza? :: En el archivo de idioma :: En sus estilos (`StyleSheet.create`) :: En `types.ts`
elige :: ¿Qué quiere decir `maxWidth: '75%'`? :: Que mide exactamente 75 píxeles :: Que ocupa como máximo el 75 % del ancho :: Que es 75 % transparente
vf :: Si cambio `maxWidth` a `'40%'`, la barra se ve más corta
escribe :: ¿Cómo se diseña, según esta parte? :: Se cambia un valor, se mira en el simulador y se ajusta, varias veces.
```

> 🔁 **Repaso:** los estilos (`StyleSheet.create`) deciden el aspecto. Cambiar, mirar, ajustar.

## 5. Romper algo a propósito (y ver quién te avisa)

> 🎙️ **El profesor:** ¿te acuerdas de que en el Tema 02 saboteamos el código para ver si la prueba avisaba? Hoy hacemos lo mismo con los idiomas. Vamos a **borrar una traducción** y ver quién se da cuenta.

1. En `src/i18n/locales/en.ts` (inglés), busca la línea de `tankCapacityHint` y **bórrala**. Guarda.
2. En la terminal corre:

```bash
npx tsc --noEmit -p .
```

3. Va a salir un **error de TypeScript**: falta la clave en inglés.

¿Por qué? Porque el contrato de `types.ts` exige que **cada clave esté en los seis idiomas**. El archivo `en.ts` ya no cumple el contrato, y TypeScript se niega.

**Esto conecta con el Tema 04:** el CI corre **exactamente este comando**. Si subieras así, el CI se pondría **rojo** y la app no saldría con un texto faltante. Nadie vería un hueco en inglés.

> 🌎 **En la vida real:** arrancas una página del menú en inglés. El gerente (`npx tsc`) tiene la **lista oficial** de platos (`types.ts`) y revisa que cada menú los tenga todos. Al ver que en inglés falta el plato, dice: "este menú no se puede imprimir".

```practica
elige :: ¿Qué comando avisa que falta una traducción? :: `npm test` :: `npx tsc --noEmit -p .` :: `git status`
vf :: Si falta una traducción y subo el código, el CI se pone rojo
escribe :: ¿Por qué TypeScript se queja si borro una clave de `en.ts`? :: Porque `types.ts` es un contrato que exige que cada clave esté en los seis idiomas, y en.ts ya no lo cumple.
```

> 🔁 **Repaso:** si falta una clave en un idioma, TypeScript (`npx tsc --noEmit -p .`) da error, y el CI también. Ningún hueco de traducción llega a la tienda.

## 6. Deshacer todo

> 🎙️ **El profesor:** este tema es de **práctica**: la app tiene que quedar **exactamente** como estaba. Vamos a deshacer los tres cambios con Git.

En la terminal:

```bash
git status
```

Vas a ver los archivos que cambiaste: `es.ts`, `en.ts`, `VehicleFuelGauge.tsx`. Para devolverlos a como estaban:

```bash
git restore src/i18n/locales/es.ts src/i18n/locales/en.ts src/components/vehicles/VehicleFuelGauge.tsx
```

Corre `git status` otra vez: **esos archivos ya no deben aparecer**.

> ⚠️ **Cuidado:** `git restore` **borra los cambios de esos archivos para siempre**. Es como tirar a la basura un borrador: no se recupera. Úsalo solo en lo que de verdad quieres deshacer. En el Tema 06 lo vas a entender bien.

> 🌎 **En la vida real:** `git restore` es el botón "descartar cambios": el archivo vuelve a como estaba la última vez que lo guardaste "oficialmente".

```practica
elige :: ¿Qué hace `git restore archivo`? :: Sube el archivo a GitHub :: Devuelve el archivo a como estaba, borrando los cambios :: Muestra qué cambió
vf :: Los cambios que se borran con `git restore` se pueden recuperar fácilmente
vf :: Después de deshacer, `git status` no debería mostrar los tres archivos
```

> 🔁 **Repaso:** `git status` muestra qué cambió; `git restore archivos…` lo devuelve a como estaba (para siempre); y otro `git status` confirma.

## 7. Cómo se hace un cambio de verdad

> 🎙️ **El profesor:** lo de hoy fue práctica. Pero cuando un cambio es **para quedarse**, en tu app siempre se sigue este orden (está escrito en el `AGENTS.md` de la app). Apréndelo: es exactamente lo que te van a preguntar en una entrevista.

1. Se cambia el código.
2. Se mira en el **simulador**.
3. Se corren las revisiones: `npx tsc --noEmit -p .` y `npm test`.
4. Se instala en el **teléfono** y **tú lo pruebas**.
5. Solo entonces: **commit y push** (Tema 06).

> 🌎 **En la vida real:** reformar el baño de un cliente: haces el trabajo, lo miras tú, pasa el inspector, el dueño abre la ducha y la prueba él mismo, y recién ahí firmas la entrega.

> ✋ **Para y piensa:** ¿por qué el paso 4 (probar en el teléfono) va **antes** de subir?

<details>
<summary>Ver la respuesta</summary>

Porque las revisiones automáticas no ven todo (Temas 02 y 04): no saben si algo se ve feo o si la app abre en el teléfono real. Mejor descubrirlo tú antes que un conductor.

</details>

```practica
escribe :: Di en orden los 5 pasos de un cambio de verdad. :: Cambiar el código, mirarlo en el simulador, correr las revisiones (tsc y npm test), probarlo en el teléfono, y recién entonces commit y push.
elige :: ¿Qué va justo antes del commit y push? :: Cambiar el código :: Probarlo en el teléfono :: Mirarlo en el simulador
vf :: Si pasan `tsc` y `npm test`, se puede subir sin probar en el teléfono
```

> 🔁 **Repaso:** cambiar → simulador → `tsc` y `npm test` → teléfono → commit y push.

## Ejercicios

> 🎙️ **El profesor:** ahora tú solo. Este es para hacerlo en la computadora.

1. Cambia otro texto: el título **"Registrar ingreso"**. Encuéntralo, cámbialo en español, míralo en el simulador y **deshazlo**.
2. Si cambias un texto solo en `es.ts`, ¿la persona que usa la app en portugués lo ve cambiado? ¿Por qué?
3. ¿Por qué los textos no se escriben directamente en la pantalla?
4. ¿Qué comando te avisa que falta una traducción?

<details>
<summary>Ver las correcciones explicadas</summary>

1. Con Cmd + Shift + F buscando `Registrar ingreso` aparece en `es.ts` más de una vez (por ejemplo `registerEarning` y `registerTitle`): son claves distintas para lugares distintos. Mira el nombre de la clave para elegir la del título. Cámbialo, guárdalo, míralo, y deshazlo con `git restore src/i18n/locales/es.ts`.
2. **No.** Cada idioma tiene su archivo; en portugués la app lee `pt-BR.ts`.
3. Porque la app está en **seis idiomas**: si el texto estuviera en la pantalla, solo existiría en uno.
4. `npx tsc --noEmit -p .`, porque `types.ts` exige cada clave en los seis idiomas.

</details>

## Para la entrevista

> 🎙️ **El profesor:** responde en voz alta.

> 🎤 **Entrevista:** "¿Cómo maneja tu app varios idiomas?"

<details>
<summary>Ver una buena respuesta</summary>

"Los textos no están en las pantallas. Cada pantalla pide el texto por una clave, con una función `t`, y hay un archivo por idioma. Un archivo de tipos define todas las claves, así que si falta una traducción en cualquiera de los seis idiomas, TypeScript no compila y el CI lo detiene."

</details>

> 🎤 **Entrevista:** "¿Cómo haces un cambio en tu app?"

<details>
<summary>Ver una buena respuesta</summary>

"Cambio el código, lo miro en el simulador con Expo, corro TypeScript y las pruebas, lo instalo en mi teléfono y lo pruebo yo, y recién entonces hago commit y push. El CI vuelve a revisar todo en una máquina limpia."

</details>

```practica
escribe :: ¿Qué es i18n? :: La abreviatura de internacionalización: preparar la app para varios idiomas, con los textos separados por clave en un archivo por idioma.
```

> 🔁 **Repaso final de la clase:** sabes dónde vive cada cosa en `src/`, cómo llega un texto a la pantalla (clave → `t` → archivo del idioma → contrato en `types.ts`), dónde está el aspecto (estilos), quién te avisa si falta una traducción, cómo deshacer con `git restore` y el proceso completo de un cambio. Próxima: **Tema 06, Git**.
