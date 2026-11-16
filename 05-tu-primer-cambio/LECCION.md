# Tema 05: Tu primer cambio

> 🌎 **En la vida real:** hasta ahora miraste el motor y lo revisaste. Hoy cambias una pieza tú mismo, como cuando por primera vez cambias una lámpara del carro: algo pequeño, seguro, y que se puede volver atrás.

Hasta ahora leíste código y escribiste una prueba. Ahora vas a **cambiar la app tú mismo** y ver el cambio en la pantalla. Son dos cambios pequeños y seguros: un texto y un tamaño. Al final los deshaces, para que la app quede como estaba.

**Antes de empezar:** Temas 01 a 03.

**Tiempo:** de 45 a 90 minutos.

## 1. Dónde vive cada cosa en la app

> 🌎 **En la vida real:** la app es como una casa, y cada carpeta es una habitación con su función:
> - `screens/` = las **habitaciones completas**: la sala, la cocina, el cuarto.
> - `components/` = los **muebles** que se repiten en varias habitaciones: la misma silla está en la cocina y en el comedor.
> - `i18n/locales/` = el **cajón de los cartelitos** en cada idioma: "Salida / Saída / Exit".
> - `theme/` = el **catálogo de pinturas** de la casa: qué colores y tamaños se pueden usar.
> - `utils/` = la **calculadora de la cocina**: hace cuentas, no se ve.
> - `context/` = la **despensa compartida**: los datos que todas las habitaciones pueden usar.
> - `services/` = las **conexiones con la calle**: la luz, el agua, el internet (Firebase y el teléfono).
> - `ai-engine/` = el **mayordomo** (el Copiloto).
>
> **La regla de oro** es como un restaurante con menú en varios idiomas: el mesero no se aprende el plato en cada idioma; señala el **número** del plato (la clave) y el menú de cada idioma dice el nombre.

> 🌎 **Otro ejemplo:** Es como un supermercado: lácteos al fondo, limpieza en el pasillo 5, la caja a la salida. Sabes dónde buscar sin recorrer todo.

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

> 🌎 **En la vida real:** es como pintar una pared mirando por una ventana mágica: cada pincelada que das, la ves al instante en la casa de verdad, sin tener que construir la casa de nuevo cada vez.

> 🌎 **Otro ejemplo:** Como probarse ropa con un espejo al lado: cada cambio lo ves al instante, sin salir del probador.

El modo Expo hace que cada cambio que guardas aparezca **solo**, en segundos, sin instalar de nuevo.

En la terminal, dentro de la carpeta de la app:
```bash
./scripts/emuladores.sh expo
```
Espera a que se abra la app en el simulador del iPhone. La primera vez tarda como un minuto.

## 3. Primer cambio: un texto

> 🌎 **En la vida real:** es como cambiar el texto de un cartel de la tienda: no cambias la pared, solo el papel que está pegado.

> 🌎 **Otro ejemplo:** Es como corregir una palabra en el subtítulo de una película: la película no cambia, solo el texto de abajo.

Vas a cambiar el texto gris que aparece debajo de "Capacidad del tanque" en **Editar vehículo**:

> Opcional. Muestra cuánto combustible queda, en el Inicio.

### Paso 1. Encuentra el texto

> 🌎 **En la vida real:** **Cmd + Shift + F** es como el buscador de una biblioteca: escribes una frase y te dice en qué libro y en qué página está, sin que tengas que revisar estante por estante.

> 🌎 **Otro ejemplo:** Como el buscador de tu correo: escribes una frase y aparecen todos los mensajes que la tienen.
1. En VS Code presiona **Cmd + Shift + F** (buscar en todo el proyecto).
2. Escribe: `Muestra cuánto combustible queda`
3. Aparece en `src/i18n/locales/es.ts`:
   ```ts
   tankCapacityHint: 'Opcional. Muestra cuánto combustible queda, en el Inicio.',
   ```

### Paso 2. Entiende cómo llega a la pantalla

> 🌎 **En la vida real:** es como un restaurante:
> - `tankCapacityHint` = **el número del plato**, por ejemplo "plato 14".
> - `types.ts` = **la lista oficial de platos**: dice que el plato 14 existe. Si alguien pide el plato 99 y no está en la lista, se le avisa enseguida.
> - **Los seis archivos de idioma** = **el menú en seis idiomas**: el plato 14 se llama "Feijoada" en portugués y "Frijolada" en español.
> - `t(...)` = **el mesero**: le dices "plato 14" y él te trae el nombre en el idioma del cliente.

> 🌎 **Otro ejemplo:** Como el sistema de turnos de un banco: la pantalla muestra "Turno A15" (la clave), y el sistema sabe qué texto va con ese turno en cada idioma.
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

> 🌎 **En la vida real:** es tachar el nombre del plato 14 en el menú en español y escribir otro. La cocina (la pantalla) no se entera ni le importa: sigue sirviendo "el plato 14".

> 🌎 **Otro ejemplo:** Es como editar la descripción de tu perfil: cambias el texto, guardas, y el resto de la app sigue igual.
En `es.ts`, cambia la línea por:
```ts
tankCapacityHint: 'Opcional. ¡Este texto lo cambié yo!',
```
Guarda con **Cmd + S**.

### Paso 4. Míralo

> 🌎 **En la vida real:** es salir a la puerta del restaurante y mirar si el cartel nuevo quedó bien puesto. **Cmd + R** es como prender y apagar la luz para ver mejor.

> 🌎 **Otro ejemplo:** Es como probar el sabor después de agregar sal: no confías en que quedó bien, lo pruebas.
En el simulador abre **Mi vehículo → el lápiz → baja hasta Capacidad del tanque**. Debe aparecer tu texto nuevo. Si la app está en español y no cambia, espera unos segundos o presiona **Cmd + R** en el simulador.

**Lo que aprendiste:** cambiar un texto es cambiar **el archivo de idioma**, no la pantalla.

## 4. Segundo cambio: un tamaño

> 🌎 **En la vida real:** es como cambiar el largo de una cortina: la ventana es la misma, solo cambias cuánto la cubre.

> 🌎 **Otro ejemplo:** Es como ajustar el ancho de una columna en una planilla: el contenido es el mismo, cambia el espacio.

Vas a hacer más corta la barra de combustible de la tarjeta del vehículo.

### Paso 1. Encuentra la pieza

> 🌎 **En la vida real:** los **estilos** son como la ficha técnica de un mueble: "ancho máximo 75 % de la pared". `maxWidth: '75%'` dice que la barra puede ocupar hasta tres cuartos del espacio, como una alfombra que cubre tres cuartos del piso.

> 🌎 **Otro ejemplo:** Como la etiqueta de medidas de una cortina: "ancho máximo 1,5 m". La ventana no cambia, la cortina se adapta.
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

> 🌎 **En la vida real:** es cambiar en la ficha "75 %" por "40 %": la alfombra ahora cubre menos de la mitad del piso.

> 🌎 **Otro ejemplo:** Es como cambiar el tamaño de letra del teléfono: un número, y todo se ve distinto.
Pon `'40%'`. Guarda.

### Paso 3. Míralo

> 🌎 **En la vida real:** es entrar a la sala y ver la alfombra nueva. Si la barra del Etios se ve más corta, tu cambio funcionó.

> 🌎 **Otro ejemplo:** Es como manejar una cuadra después de ajustar el asiento, para ver si quedó cómodo.
En el simulador ve al **Inicio**. La barra de combustible del Etios debe verse mucho más corta.

### Paso 4. Prueba otros valores

> 🌎 **En la vida real:** como un peluquero que corta un poco, mira en el espejo, corta otro poco y vuelve a mirar. Así se diseña: cambiar, mirar, ajustar.

> 🌎 **Otro ejemplo:** Como un fotógrafo que prueba varias distancias con el zoom hasta que la foto queda bien encuadrada.
Prueba `'100%'`, y después `'60%'`. Así se diseña: se cambia, se mira y se ajusta.

**Lo que aprendiste:** el aspecto de las piezas está en sus **estilos** (`StyleSheet.create`).

## 5. Rompe algo a propósito (y mira quién te avisa)

> 🌎 **En la vida real:** es como arrancar una página del menú en inglés y ver si el gerente se da cuenta. El gerente (`npx tsc`) tiene la **lista oficial** de platos (`types.ts`) y revisa que cada menú los tenga todos. Al ver que en inglés falta el plato 14, dice: "este menú no se puede imprimir". Es el mismo gerente que trabaja en el CI del Tema 04.

> 🌎 **Otro ejemplo:** Como la máquina de tickets del estacionamiento: si falta una pieza, la barrera no se levanta y te avisa.

1. En `src/i18n/locales/en.ts` (inglés), busca la línea de `tankCapacityHint` y **bórrala**. Guarda.
2. En la terminal corre:
   ```bash
   npx tsc --noEmit -p .
   ```
3. Va a salir un **error de TypeScript**: falta la clave en inglés. El contrato de `types.ts` exige que la clave esté en los seis idiomas.

**Esto es lo que vimos en el Tema 04:** el CI corre exactamente este comando. Si subieras así, el CI se pondría rojo y la app no saldría con un texto faltante.

## 6. Deshaz todo

> 🌎 **En la vida real:** `git restore` es como el botón "descartar cambios" de un documento: vuelve el archivo a como estaba la última vez que lo guardaste "oficialmente". Pero ojo: es como tirar a la basura el borrador; lo que escribiste no se recupera. Úsalo solo en lo que de verdad quieres tirar.
>
> `git status` es la mirada final antes de salir de casa: "¿dejé algo encendido?".

> 🌎 **Otro ejemplo:** Como el botón "deshacer" del Word que vuelve a la última vez que guardaste: lo que escribiste después, se pierde.

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

> 🌎 **En la vida real:** es como reformar un baño de un cliente:
> 1. Haces el trabajo.
> 2. Lo miras tú.
> 3. Pasas el inspector (las revisiones automáticas).
> 4. El dueño de la casa abre la ducha y la prueba él mismo (tú, en tu teléfono).
> 5. Recién ahí firmas la entrega (commit y push).

> 🌎 **Otro ejemplo:** Como un vuelo comercial: se revisa en tierra, pasa el control técnico, un vuelo de prueba, y recién ahí lleva pasajeros.

Cuando el cambio es para quedarse, en tu app siempre se sigue este orden (está en `AGENTS.md`):

1. Se cambia el código.
2. Se mira en el simulador.
3. Se corren las revisiones: `npx tsc --noEmit -p .` y `npm test`.
4. Se instala en el teléfono y **tú lo pruebas**.
5. Solo entonces: commit y push (Tema 06).

## Ejercicios

> 🌎 **En la vida real:** es la segunda lámpara que cambias tú solo, sin que nadie te mire. Si la primera salió bien, esta sale más rápido.

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

> 🌎 **En la vida real:** explícalo como el restaurante: "la pantalla pide el plato por número, hay un menú por idioma y una lista oficial; si un menú no tiene un plato, el sistema no deja abrir el restaurante".

**¿Cómo maneja tu app varios idiomas?**
> Los textos no están en las pantallas. Cada pantalla pide el texto por una clave, y hay un archivo por idioma. Un archivo de tipos define todas las claves, así que si falta una traducción en cualquiera de los seis idiomas, TypeScript no compila y el CI lo detiene.
