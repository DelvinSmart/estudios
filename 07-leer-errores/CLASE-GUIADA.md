# Leer errores

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** de 1 a 2 horas. Las partes 1 a 6 se leen; la parte 7 es práctica en la app (al final se deshace todo).

**Lo que necesitas saber antes:** Temas 01 a 06.

## 1. La regla más importante

> 🎙️ **El profesor:** {{alumno}}, los errores asustan al principio: letras rojas, palabras en inglés… Hoy vas a cambiar esa idea para siempre. **Un error no es un fracaso: es un mensaje.** El programa te está diciendo **qué** salió mal y **dónde**. Quien sabe leerlo arregla en minutos lo que otro tarda horas en adivinar.

Y antes de todo, la regla de oro, que está escrita en el documento principal de Copiloto (`AGENTS.md`):

> **Verificar antes de adivinar.** Primero consigues el error real o el dato real. Después cambias algo.

¿Por qué está escrita? Porque **dos veces** se "arregló" algo en Copiloto **adivinando**, y el arreglo era falso: el problema seguía ahí, escondido.

> 🌎 **En la vida real:** el médico serio pide el análisis de sangre antes de recetar. El que receta "por si acaso" puede curarte algo que no tenías y dejarte enfermo de lo que sí tenías.

> 🌎 **Otro ejemplo:** Como el detective que no acusa a nadie antes de tener pruebas: primero las huellas, después la conclusión.

> ✋ **Para y piensa:** la app muestra mal un total. Tienes una idea: "seguro es el cálculo del San". ¿Qué haces primero?

<details>
<summary>Ver la respuesta</summary>

**Verificar**: conseguir el error real o el dato real (reproducir el problema, mirar el valor con un `console.log`, correr las pruebas). Recién con el dato en la mano, cambias algo. "Seguro es…" es adivinar.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Verificar antes de adivinar
lenguaje: js
pide: Antes de "arreglar", hay que **ver el dato real**. `nivelDelTanque` devuelve un número raro y nadie sabe por qué. No adivines: completa `investigar(fn, entrada)` para que devuelva `{ entrada, salida }`, es decir, **lo que entró y lo que salió de verdad**. Si la función **lanza un error**, devuelve `{ entrada, error: mensaje }` en vez de romperse.
--- código
function investigar(fn, entrada) {
  // tu código aquí
}
--- pruebas
const doble = (x) => x * 2;
const rompe = () => { throw new Error('capacidad vacía'); };
prueba('anota lo que entró y lo que salió', () => igual(investigar(doble, 21), { entrada: 21, salida: 42 }));
prueba('si lanza un error, anota el mensaje', () => igual(investigar(rompe, null), { entrada: null, error: 'capacidad vacía' }));
prueba('muestra salidas raras tal cual (NaN)', () => ok(Number.isNaN(investigar(doble, 'abc').salida), 'la salida real era NaN'));
--- solución
function investigar(fn, entrada) {
  try {
    return { entrada, salida: fn(entrada) };
  } catch (e) {
    return { entrada, error: e.message };
  }
}
```

```practica
escribe :: ¿Cuál es la regla más importante de esta clase? :: Verificar antes de adivinar: primero consigo el error real o el dato real, y después cambio algo.
vf :: Un mensaje de error es un fracaso del programador
vf :: En la app se "arreglaron" cosas adivinando y el arreglo era falso
elige :: ¿Qué se hace primero ante un problema? :: Cambiar algo a ver si se arregla :: Conseguir el error o el dato real :: Preguntarle a otro
```

> 🔁 **Repaso:** verificar antes de adivinar. El error es un mensaje, no un fracaso.

## 2. Las partes de un error

> 🎙️ **El profesor:** casi todos los errores del mundo tienen **las mismas partes**. Si las reconoces, cualquier error deja de ser un bloque de letras rojas y se vuelve una ficha que se lee en orden.

| Parte | Qué dice | Ejemplo |
|---|---|---|
| **Tipo** | Qué clase de error es | `TypeError`, `error TS2552` |
| **Mensaje** | Qué pasó, en palabras | `Cannot find name 'VehicleTextField'` |
| **Lugar** | Archivo, línea y columna | `VehicleSetupScreen.tsx(560,26)` |
| **Pista** (a veces) | Una sugerencia | `Did you mean 'VehicleSelectField'?` |
| **Pila** (*stack trace*) | El camino de llamadas hasta el error | Una lista de archivos, del más reciente al más viejo |

`(560,26)` quiere decir **línea 560, columna 26**. Para ir ahí en VS Code: **Cmd + P**, escribe el nombre del archivo, Enter, y después **Ctrl + G** y el número de línea.

> 🌎 **En la vida real:** un error es como una multa de tránsito. **Tipo** = la infracción ("exceso de velocidad"). **Mensaje** = lo que pasó ("80 en zona de 60"). **Lugar** = la dirección exacta. **Pista** = la nota del agente. **Pila** = el recorrido que hiciste hasta que te pararon, leído del último lugar al primero.

> 🌎 **Otro ejemplo:** Como la etiqueta de un error en la factura: tipo ("cobro doble"), descripción ("se cobró dos veces el mismo producto"), lugar ("línea 3") y sugerencia ("solicite reembolso").

### Las palabras en inglés que más vas a ver

> 🌎 **En la vida real:** Son como las señales de tránsito en otro país: al principio no las entiendes, pero son pocas y se repiten siempre; en una semana las lees sin pensar.

> 🌎 **Otro ejemplo:** Son como las palabras de un menú en inglés en un aeropuerto: "Departures", "Gate", "Delayed"; con diez palabras te mueves por todo el aeropuerto.

| En el error | Quiere decir |
|---|---|
| *Cannot find* | No encuentro |
| *is missing* | Falta |
| *is not defined* | No está definido (no existe) |
| *is not a function* | No es una función |
| *expected* / *received* (o *actual*) | Esperado / recibido |
| *Did you mean…?* | ¿Quisiste decir…? |
| *declared but never read* | Declarado pero nunca usado |

> ✋ **Para y piensa:** en `error TS2552: Cannot find name 'VehicleTextField'. Did you mean 'VehicleSelectField'?`, señala el tipo, el mensaje y la pista.

<details>
<summary>Ver la respuesta</summary>

- **Tipo:** `error TS2552` (de TypeScript).
- **Mensaje:** `Cannot find name 'VehicleTextField'` → "no encuentro el nombre VehicleTextField".
- **Pista:** `Did you mean 'VehicleSelectField'?` → "¿quisiste decir VehicleSelectField?".

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Desarmar un error de TypeScript
lenguaje: js
pide: Un error de TypeScript tiene esta forma: `archivo(línea,columna): error TSnúmero: mensaje`. Completa `partesDelError(texto)`: devuelve `{ archivo, linea, columna, codigo, mensaje }` (línea y columna como **números**). Si después del mensaje viene `Did you mean 'x'?`, agrega `pista: 'x'`.
--- código
function partesDelError(texto) {
  // tu código aquí
}
--- pruebas
const e1 = "scripts/mostrar.ts(24,42): error TS2552: Cannot find name 'formatoReall'. Did you mean 'formatoReal'?";
const e2 = "scripts/mostrar.ts(24,54): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.";
prueba('el archivo', () => igual(partesDelError(e1).archivo, 'scripts/mostrar.ts'));
prueba('línea y columna, como números', () => igual([partesDelError(e1).linea, partesDelError(e1).columna], [24, 42]));
prueba('el código', () => igual(partesDelError(e2).codigo, 'TS2345'));
prueba('la pista', () => igual(partesDelError(e1).pista, 'formatoReal'));
prueba('sin pista, no inventa una', () => igual(partesDelError(e2).pista, undefined));
prueba('el mensaje', () => igual(partesDelError(e2).mensaje, "Argument of type 'string' is not assignable to parameter of type 'number'."));
--- solución
function partesDelError(texto) {
  const m = texto.match(/^(.+)\((\d+),(\d+)\): error (TS\d+): (.*)$/);
  const [, archivo, linea, columna, codigo, mensaje] = m;
  const resultado = { archivo, linea: Number(linea), columna: Number(columna), codigo, mensaje };
  const pista = mensaje.match(/Did you mean '([^']+)'\?/);
  if (pista) resultado.pista = pista[1];
  return resultado;
}
```

```practica
elige :: En `VehicleSetupScreen.tsx(560,26)`, ¿qué es 560? :: La columna :: La línea :: El número de error
elige :: ¿Qué quiere decir *Cannot find*? :: No funciona :: No encuentro :: Está repetido
elige :: ¿Qué es la pila (*stack trace*)? :: La lista de pruebas :: El camino de llamadas que llevó al error :: El tipo de error
vf :: *Did you mean…?* es una pista con una sugerencia
escribe :: Nombra las cinco partes de un error. :: Tipo, mensaje, lugar (archivo, línea y columna), pista y pila (stack trace).
```

> 🔁 **Repaso:** tipo, mensaje, lugar (línea y columna), pista y pila. Y unas pocas palabras en inglés que se repiten siempre.

## 3. Los cuatro lugares donde aparecen errores

> 🎙️ **El profesor:** un mismo error puede aparecer en distintos momentos. Y aquí va una idea muy importante: **cuanto antes aparezca, más barato es**.

| Dónde | Cuándo | Quién lo muestra |
|---|---|---|
| **TypeScript** | Antes de ejecutar (al revisar) | `npx tsc --noEmit -p .` y VS Code (subrayado rojo) |
| **Pruebas** | Al correr las pruebas | `npm test` |
| **Metro / Expo** | Al armar o abrir la app | La terminal y la pantalla roja del simulador |
| **En ejecución** | Mientras alguien usa la app | La pantalla roja, la consola o **Sentry** (un servicio que junta los errores de los usuarios) |

Cuanto más arriba en la tabla, **más barato**. Un error de TypeScript **nunca** llega al usuario; uno en ejecución, **sí**.

> 🌎 **En la vida real:** un pastel. **TypeScript** = leer la receta y ver que dice "2 kilos de sal": lo arreglas gratis. **Pruebas** = probar la masa cruda. **Metro** = el pastel no sube en el horno. **En ejecución** = el cliente lo muerde en su cumpleaños: lo más caro.

> 🌎 **Otro ejemplo:** Como encontrar un error en un vestido: en el molde (gratis), en la tela cortada (barato), en la prueba (caro) o en la fiesta, puesto (carísimo).

> 💡 **Idea:** por eso la app Copiloto usa TypeScript y tiene tantas pruebas: para que los errores aparezcan **arriba** en la tabla, y no en el teléfono de un conductor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Dónde salió el error, y cuánto costó?
lenguaje: js
pide: Cuanto antes aparece un error, más barato es. Completa `dondeSalio(texto)` con los cuatro lugares: si el texto tiene `error TS` → `'typescript'`; si tiene `FAIL` o `AssertionError` → `'pruebas'`; si tiene `Metro` o `development server` → `'metro'`; cualquier otro → `'ejecución'`. Y `elMasBarato(textos)`: de una lista de errores, devuelve el lugar **más barato** según el orden de `ORDEN`.
--- código
const ORDEN = ['typescript', 'pruebas', 'metro', 'ejecución'];

function dondeSalio(texto) {
  // tu código aquí
}

function elMasBarato(textos) {
  // tu código aquí
}
--- pruebas
prueba('TypeScript', () => igual(dondeSalio("mostrar.ts(24,42): error TS2552: Cannot find name"), 'typescript'));
prueba('una prueba', () => igual(dondeSalio('FAIL src/datos/__tests__/aplicaciones.test.ts'), 'pruebas'));
prueba('Metro', () => igual(dondeSalio('Could not connect to development server'), 'metro'));
prueba('en ejecución', () => igual(dondeSalio("TypeError: null is not an object (evaluating 'source.r')"), 'ejecución'));
prueba('el más barato de varios', () => igual(elMasBarato(['TypeError: x', 'AssertionError: expected false', 'a.ts(1,1): error TS6133']), 'typescript'));
--- solución
const ORDEN = ['typescript', 'pruebas', 'metro', 'ejecución'];

function dondeSalio(texto) {
  if (texto.includes('error TS')) return 'typescript';
  if (texto.includes('FAIL') || texto.includes('AssertionError')) return 'pruebas';
  if (texto.includes('Metro') || texto.includes('development server')) return 'metro';
  return 'ejecución';
}

function elMasBarato(textos) {
  const lugares = textos.map(dondeSalio);
  return ORDEN.find((lugar) => lugares.includes(lugar));
}
```

```practica
elige :: ¿Dónde es más barato encontrar un error? :: En ejecución :: En Metro :: En TypeScript
elige :: ¿Qué es Sentry? :: Una prueba :: Un servicio que junta los errores que les pasan a los usuarios :: Un editor
vf :: Un error de TypeScript puede llegar al teléfono del usuario
elige :: La pantalla roja del simulador al abrir la app es un error de… :: TypeScript :: Metro / Expo (o en ejecución) :: Git
```

> 🔁 **Repaso:** TypeScript → pruebas → Metro → ejecución. Cuanto antes, más barato.

## 4. Errores reales, leídos

> 🎙️ **El profesor:** ahora seis errores **de verdad**, que salieron el 10 de noviembre de 2026 trabajando en Copiloto. Vamos uno por uno, como un médico que repasa casos reales. Para cada uno: qué dice, cuál era la causa real y qué se hizo.

> 🌎 **En la vida real:** Estos errores son como casos clínicos que estudia un médico: no son inventados; le pasaron a pacientes reales, y por eso enseñan tanto.

> 🌎 **Otro ejemplo:** Son como la caja negra de vuelos anteriores: se estudian para que el próximo piloto no repita el error.

### Error 1: un nombre que no existe

```text
src/screens/onboarding/VehicleSetupScreen.tsx(560,26): error TS2552:
Cannot find name 'VehicleTextField'. Did you mean 'VehicleSelectField'?
```

- **Qué dice:** en la línea 560 se usa algo llamado `VehicleTextField`, pero ese nombre **no existe en el archivo**.
- **Causa real:** se creó la pieza `VehicleTextField` y se usó en la pantalla, pero **faltaba el `import`** arriba del archivo.
- **Arreglo:** `import VehicleTextField from '../../components/vehicles/VehicleTextField';`
- **Ojo con la pista:** sugería `VehicleSelectField`, pero **no era eso**. La pista es una ayuda, no la verdad.

**Lección:** "Cannot find name" casi siempre es **un `import` que falta o un nombre mal escrito**.

> 🌎 **En la vida real:** "pásame a Juan" → "aquí no vive ningún Juan; ¿quisiste decir Juana?". Juan existe, pero vive en otra casa: te faltó **traerlo**.

> 🌎 **Otro ejemplo:** Como llamar a un contacto que no está guardado en tu teléfono: el número existe, pero tu agenda no lo conoce hasta que lo guardas (el `import`).

### Error 2: falta un dato obligatorio

```text
src/screens/onboarding/VehicleSetupScreen.tsx(608,28): error TS2741:
Property 'children' is missing in type '{ label: string; value: string; ... }'
but required in type 'VehicleSelectFieldProps'.
```

- **Qué dice:** la pieza `VehicleSelectField` **exige** un dato llamado `children` (lo que va adentro de la pieza), y no se le pasó.
- **Causa real:** se cambió la forma de usar la pieza (la lista ahora va abajo, aparte), pero la pieza todavía lo exigía.
- **Arreglo:** hacerlo **opcional**: `children?: React.ReactNode`. El **`?`** quiere decir "puede faltar".

**Lección:** "*is missing … but required*" = falta algo obligatorio. **O se lo pasas, o lo haces opcional.**

> 🌎 **En la vida real:** un formulario con el campo "CPF" marcado con asterisco (*) de obligatorio, y lo dejaste vacío.

> 🌎 **Otro ejemplo:** Como un formulario de inscripción que no se envía porque te faltó el teléfono, que era obligatorio.

### Error 3: algo declarado que no se usa

> 🌎 **En la vida real:** Es como tener en la mochila un paraguas que no usas: no hace daño, pero ocupa lugar y confunde al que la abre.

> 🌎 **Otro ejemplo:** Es como un contacto viejo en el teléfono de alguien que ya no existe: no molesta, pero ensucia la lista.

```text
src/screens/copilot/IACopilotoScreen.styles.ts(2,10): error TS6133:
'Platform' is declared but its value is never read.
```

- **Qué dice:** se importó `Platform`, pero **nadie lo usa**.
- **Causa real:** el estilo que lo usaba se movió a otra pieza (`ChatInputShell`).
- **Arreglo:** borrar `Platform` del `import`.

**Lección:** no rompe nada, pero es **código muerto**. La app Copiloto no lo permite, para mantenerse limpia.

### Error 4: una prueba que falla

```text
not ok 77 - plataformas da conta: fixas do app + workApps ativas
  expected: ['particular_trips', 'extras', 'uber', '99', 'custom-123']
  actual:   ['my_company', 'particular_trips', 'extras', 'uber', '99', 'custom-123']
```

- **Qué dice:** la prueba 77 esperaba una lista y recibió otra, con `my_company` al principio.
- **La pregunta clave:** ¿está mal **el código** o está vieja **la prueba**?
- **Causa real:** se agregó "Mi empresa" **a propósito**, primera en la lista. **La prueba estaba vieja.**
- **Arreglo:** actualizar lo esperado en la prueba.

**Lección:** cuando una prueba falla, en orden: ¿la regla **cambió a propósito**? ¿la prueba está bien? ¿el código está mal?

> 🌎 **En la vida real:** el inventario dice 5 productos y cuentas 6. Antes de pensar algo raro: ¿alguien agregó uno **a propósito**? Sí. La lista estaba vieja.

> 🌎 **Otro ejemplo:** Como el GPS que te marca un desvío: antes de pensar que se rompió, ves que abrieron una calle nueva. El mapa viejo (la prueba) era el que estaba mal.

### Error 5: el error de verdad detrás de "no pasa nada"

En el panel de Copiloto, al mover el color de la foto de un carro, **no pasaba nada**, y no salía ningún error. Para encontrarlo, se probó la misma función **con la foto real del Etios**, y apareció:

```text
TypeError: null is not an object (evaluating 'source.r')
```

- **Tipo:** `TypeError`, un error **en ejecución**.
- **Qué dice:** se intentó leer `.r` (el rojo de un color) de algo que era **`null`** (nada).
- **Causa real:** la función que detecta el color de la pintura devolvía `null` con fotos reales (la pintura tiene muchos tonos). Sin color de origen, no había nada que pintar.
- **Arreglo:** mejorar la detección y **avisar en pantalla** cuando no encuentra el color.

**Lección:** "**no pasa nada**" casi nunca es "no hay error". Hay que **buscarlo**: reproducir el problema con los **datos reales** hasta que aparezca.

> 🌎 **En la vida real:** pedir el color de la camisa de alguien que **no está** en la sala: no se puede, ahí no hay nadie (`null`).

> 🌎 **Otro ejemplo:** Como un carro que no arranca sin hacer ruido: "no hace nada" no significa que no tenga nada; hay que conectar el escáner con la llave puesta.

### Error 6: la pantalla roja de Expo

```text
Could not connect to development server.
URL: http://localhost:8081/...
```

- **Qué dice:** la app busca a **Metro** (el programa que le entrega el código) y no lo encuentra.
- **Causa real:** Metro **no estaba encendido**.
- **Arreglo:** `./scripts/emuladores.sh expo`.

**Lección:** **no todos los errores son del código**. A veces solo falta encender algo.

> 🌎 **En la vida real:** llamas a la pizzería y no contesta nadie. No quebró: no abrió hoy.

> 🌎 **Otro ejemplo:** Como llegar a la tienda y encontrarla cerrada: no tienes que arreglar nada, solo esperar que abran (encender Metro).

> ✋ **Para y piensa:** de los seis, ¿en cuál el código de la app **no tenía nada mal**?

<details>
<summary>Ver la respuesta</summary>

En el **4** (la prueba estaba vieja) y en el **6** (Metro estaba apagado). En los dos, cambiar el código de la app habría sido un error.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El error real del color, arreglado
lenguaje: js
pide: Este es el error de verdad de esta parte: `TypeError: null is not an object (evaluating 'source.r')`. `colorDominante` devuelve `null` con fotos reales, y `aTexto` se rompe al leer `.r`. Arregla `aTexto(color)` para que, si el color es `null`, devuelva `'sin color'` en vez de romperse (no cambies `colorDominante`).
--- código
function colorDominante(pixeles) {
  return pixeles.length === 1 ? pixeles[0] : null; // con muchos tonos, no decide
}

function aTexto(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
--- pruebas
prueba('una foto de un solo tono', () => igual(aTexto(colorDominante([{ r: 200, g: 10, b: 10 }])), 'rgb(200, 10, 10)'));
prueba('una foto real, con muchos tonos, no se rompe', () => igual(aTexto(colorDominante([{ r: 1, g: 2, b: 3 }, { r: 4, g: 5, b: 6 }])), 'sin color'));
--- solución
function colorDominante(pixeles) {
  return pixeles.length === 1 ? pixeles[0] : null; // con muchos tonos, no decide
}

function aTexto(color) {
  if (color === null) return 'sin color';
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}
```

```practica
elige :: "Cannot find name" casi siempre es… :: Un error de internet :: Un `import` que falta o un nombre mal escrito :: Una prueba vieja
elige :: "Property 'children' is missing … but required" se arregla… :: Borrando la pantalla :: Pasándole el dato, o haciéndolo opcional con `?` :: Reiniciando la Mac
elige :: ¿Qué quiere decir el `?` en `children?: React.ReactNode`? :: Que es un error :: Que puede faltar (es opcional) :: Que es una pregunta para el usuario
elige :: "'Platform' is declared but its value is never read" quiere decir… :: Que falta Platform :: Que se importó Platform pero nadie lo usa :: Que Platform está roto
elige :: En el error 4, ¿qué estaba mal? :: El código :: La prueba, que estaba vieja :: Internet
elige :: "Could not connect to development server" se arregla… :: Cambiando el código :: Encendiendo Metro :: Borrando la app
vf :: Si una función no muestra ningún error, es que no hay error
vf :: La pista *Did you mean…?* siempre tiene la respuesta correcta
escribe :: Explica el error `TypeError: null is not an object (evaluating 'source.r')`. :: Se intentó leer .r (el rojo de un color) de algo que era null; la función que detecta el color devolvía null con fotos reales.
```

> 🔁 **Repaso:** "Cannot find" = falta import o nombre mal escrito; "missing but required" = falta algo obligatorio; "never read" = código muerto; prueba que falla = ¿cambió la regla?; "no pasa nada" = reproducir con datos reales; Metro = encenderlo.

## 5. El método, paso a paso

> 🎙️ **El profesor:** ahora el método completo. Son **ocho pasos**. Apréndelos de memoria: te van a servir con cualquier error, en cualquier lenguaje, toda tu vida.

1. **Lee la primera línea completa.** Ahí está casi todo.
2. **Ve al lugar exacto** (archivo y línea).
3. **Pregúntate qué esperaba el programa** y qué encontró.
4. **Reprodúcelo:** haz que el error vuelva a aparecer a propósito. Si no lo puedes repetir, no puedes comprobar que lo arreglaste.
5. **Forma una idea** de la causa ("creo que falta el import").
6. **Haz un solo cambio** para probar esa idea.
7. **Comprueba:** corre de nuevo. ¿Desapareció?
8. **Busca la causa raíz:** ¿por qué pasó? ¿Puede pasar en otro lugar? Si se puede, deja una prueba.

**Lo que NO se hace:** cambiar cinco cosas a la vez "a ver si se arregla". Si funciona, no sabrás cuál de las cinco fue, y las otras cuatro quedaron cambiadas sin motivo.

> 🌎 **En la vida real:** el mecánico bueno lee el escáner, abre el capó justo donde está la pieza, ve que esperaba 12 voltios y hay 8, reproduce el ruido subiendo una cuesta, piensa "es la batería", cambia **solo** la batería, comprueba que arranca, y se pregunta por qué se descargó. El malo cambia batería, alternador, bujías y cables a la vez.

> 🌎 **Otro ejemplo:** Como resolver por qué no carga el teléfono: miras qué dice, pruebas otro cable (un solo cambio), y si carga, era el cable; no cambias cable, cargador y enchufe a la vez.

> ✋ **Para y piensa:** ¿por qué el paso 4 (reproducir) va antes de cambiar nada?

<details>
<summary>Ver la respuesta</summary>

Porque si no puedes hacer que el error aparezca, **después no sabes si lo arreglaste**: puede que simplemente no se haya dado esa vez.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un cambio a la vez
lenguaje: js
pide: El método dice: **cambia una sola cosa** y comprueba. `sumarGastos` tiene **un** error. Encuéntralo leyendo qué esperaba cada prueba y qué recibió, y arréglalo cambiando lo mínimo.
--- código
function sumarGastos(gastos) {
  let total = 0;
  for (let i = 1; i < gastos.length; i++) {
    total += gastos[i].valor;
  }
  return total;
}
--- pruebas
prueba('un gasto de 50', () => igual(sumarGastos([{ valor: 50 }]), 50));
prueba('50 + 30', () => igual(sumarGastos([{ valor: 50 }, { valor: 30 }]), 80));
prueba('sin gastos: 0', () => igual(sumarGastos([]), 0));
--- solución
function sumarGastos(gastos) {
  let total = 0;
  for (let i = 0; i < gastos.length; i++) {
    total += gastos[i].valor;
  }
  return total;
}
```

```practica
escribe :: Di los 8 pasos del método, en orden. :: Leer la primera línea; ir al lugar; qué esperaba y qué encontró; reproducirlo; formar una idea; hacer un solo cambio; comprobar; buscar la causa raíz.
vf :: Conviene cambiar varias cosas a la vez para arreglarlo más rápido
vf :: Reproducir el error sirve para después comprobar que lo arreglaste
elige :: Después de arreglarlo, ¿qué falta? :: Nada :: Buscar la causa raíz y, si se puede, dejar una prueba :: Borrar la prueba
```

> 🔁 **Repaso:** leer → ir al lugar → qué esperaba → reproducir → idea → un solo cambio → comprobar → causa raíz.

## 6. Cuando el mensaje no se entiende

> 🎙️ **El profesor:** a veces el mensaje es un trabalenguas. No pasa nada: hay cuatro herramientas.

1. **Copia el mensaje exacto** (sin tus datos personales) y **búscalo en Google**. Casi siempre alguien ya lo tuvo.
2. **Pregúntale a una IA pegando el error completo**, no un resumen. "Me sale un error" no sirve; las letras exactas, sí.
3. **Agrega un `console.log`** para ver el valor real de algo, en ese punto, mientras corre:

```ts
console.log('[MiPantalla] valor del color:', source);
```

   En modo Expo, lo que imprime aparece en la terminal (y en `~/copiloto-logs/metro.log`). La etiqueta entre corchetes (`[MiPantalla]`) te ayuda a encontrar tu línea entre muchas.

4. **Borra los `console.log`** cuando termines.

> 🌎 **En la vida real:** buscar en Google = preguntar en el grupo de conductores; pegar el error completo = llevarle al mecánico el papel del escáner, no decir "hace un ruidito"; `console.log` = poner un manómetro en la manguera para ver la presión real; borrarlos = sacar los manómetros antes de devolver el carro.

> 🌎 **Otro ejemplo:** Como cuando no entiendes una palabra en un contrato: la buscas, le preguntas a alguien que sepa mostrándole el texto exacto, y anotas lo que aprendiste.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pedir ayuda sin regalar tus datos
lenguaje: js
pide: Antes de pegar un error en Google o en una IA, quita tus datos. Completa `limpiarParaPegar(texto)`: cambia los correos por `<correo>`, la carpeta de tu usuario (`/Users/nombre/`) por `/Users/<yo>/`, y las claves que empiezan con `sk_` por `<clave>`. El resto del mensaje queda igual.
--- código
function limpiarParaPegar(texto) {
  // tu código aquí
}
--- pruebas
prueba('quita el correo', () => igual(limpiarParaPegar('Error para ana.silva@gmail.com'), 'Error para <correo>'));
prueba('quita la carpeta del usuario', () => igual(limpiarParaPegar('at /Users/ana/proyecto/a.ts:3'), 'at /Users/<yo>/proyecto/a.ts:3'));
prueba('quita la clave', () => igual(limpiarParaPegar('key sk_live_123abc rechazada'), 'key <clave> rechazada'));
prueba('el error queda entero', () => igual(limpiarParaPegar("Cannot find name 'formatoReall'"), "Cannot find name 'formatoReall'"));
--- solución
function limpiarParaPegar(texto) {
  return texto
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '<correo>')
    .replace(/\/Users\/[^/]+\//g, '/Users/<yo>/')
    .replace(/sk_\w+/g, '<clave>');
}
```

```practica
elige :: ¿Qué le pegas a una IA para que te ayude? :: Un resumen: "me sale un error" :: El mensaje de error completo :: Una foto borrosa
elige :: ¿Para qué sirve un `console.log`? :: Para arreglar el error solo :: Para ver el valor real de algo mientras el programa corre :: Para borrar archivos
vf :: Al buscar un error en Google, conviene quitar tus datos personales
vf :: Los `console.log` se dejan en la app para siempre
```

> 🔁 **Repaso:** Google con el mensaje exacto, IA con el error completo, `console.log` para ver valores reales, y borrarlos al final.

## 7. Práctica guiada (en Gastos del carro; al final se deshace todo)

> 🎙️ **El profesor:** ahora vas a **provocar** errores a propósito, leerlos y arreglarlos. Es un simulacro: el fuego es de mentira, y al final todo vuelve a su lugar. Lo hacemos en **Gastos del carro**, el proyecto de práctica: si todavía no lo bajaste, mira el recuadro del Tema 03 (`git clone`, `cd gastos-del-carro`, `npm install`).

> 🌎 **En la vida real:** Es como un simulacro de incendio en la escuela: el fuego es de mentira, pero aprendes por dónde salir.

> 🌎 **Otro ejemplo:** Es como el entrenamiento de un bombero con fuego controlado: apaga incendios a propósito para saber hacerlo cuando sea de verdad.

### Práctica 1: provocar un "Cannot find name"

> 🌎 **En la vida real:** Es como escribir mal el nombre de una calle en el GPS: te responde "no encontré esa dirección; ¿quisiste decir…?".

> 🌎 **Otro ejemplo:** Es como pedir en un restaurante un plato que no está en el menú: "no tenemos eso; ¿quiso decir…?".

1. Abre `scripts/mostrar.ts` y busca `formatoReal(180)` (cerca de la línea 24). Cámbialo por **`formatoReall(180)`** (doble l).
2. Corre `npm run tipos`
3. Lee los errores: **tipo, archivo, línea y la pista**. Salen dos:

```text
scripts/mostrar.ts(7,1): error TS6133: 'formatoReal' is declared but its value is never read.
scripts/mostrar.ts(24,42): error TS2552: Cannot find name 'formatoReall'. Did you mean 'formatoReal'?
```

El segundo es la causa: `formatoReall` no existe, y TypeScript te sugiere el nombre bueno. El primero es una **consecuencia**: como ya nadie usa `formatoReal`, el `import` de la línea 7 quedó sobrando. Un error suele traer otros detrás: **arregla el que es causa** y los demás se van solos.

4. Arréglalo (quita la l) y corre `npm run tipos` otra vez: no sale nada.

### Práctica 2: provocar una prueba que falla

> 🌎 **En la vida real:** Es como sacar una pieza del motor a propósito para ver si se enciende la luz del tablero.

> 🌎 **Otro ejemplo:** Es como cambiar la respuesta correcta en la hoja de un examen para ver si el corrector lo detecta.

1. En `src/datos/aplicaciones.ts`, en `esPlataformaFija`, quita `|| id === 'mi_empresa'`.
2. Corre `npm test`
3. Lee **cuál prueba falló** y **qué esperaba**:

```text
 FAIL  src/datos/__tests__/aplicaciones.test.ts > plataformas fijas > extras, viajes particulares y Mi empresa no se borran
AssertionError: expected false to be true
      Tests  1 failed | 37 passed (38)
```

La prueba esperaba `true` ("las tres son fijas") y recibió `false`, porque ahora `mi_empresa` ya no cuenta como fija.

4. Devuelve lo que quitaste y corre `npm test`: todo en verde.

### Práctica 3: provocar un error de tipo

> 🌎 **En la vida real:** Es como escribir "seis" con letras en un campo que dice "solo números": el formulario lo rechaza.

> 🌎 **Otro ejemplo:** Es como poner gasolina común en un carro que pide diésel: el surtidor (TypeScript) no deja meter la boquilla equivocada.

1. En `scripts/mostrar.ts`, cambia `formatoReal(180)` por **`formatoReal("180")`** (un texto, entre comillas).
2. Corre `npm run tipos` y lee el error:

```text
scripts/mostrar.ts(24,54): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Un `string` (texto) no sirve donde se espera un `number` (número). Es exactamente lo del Tema 01: `"180"` con comillas es texto.

3. Arréglalo.

### Al terminar

> 🌎 **En la vida real:** Es como devolver las herramientas a su lugar después de un trabajo.

> 🌎 **Otro ejemplo:** Es como contar a los alumnos al volver de una excursión: si falta uno, no te vas.

```bash
git status
git restore scripts/mostrar.ts src/datos/aplicaciones.ts
git status
```

**No debe quedar ningún archivo cambiado.**

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer el resumen de Vitest
lenguaje: js
pide: Al final de `npm test`, Vitest escribe una línea como `Tests  1 failed | 37 passed (38)`. Completa `leerResumen(linea)`: devuelve `{ fallaron, pasaron, total }` (los que no aparecen valen 0).
--- código
function leerResumen(linea) {
  // tu código aquí
}
--- pruebas
prueba('con fallas', () => igual(leerResumen('      Tests  1 failed | 37 passed (38)'), { fallaron: 1, pasaron: 37, total: 38 }));
prueba('todo en verde', () => igual(leerResumen('      Tests  38 passed (38)'), { fallaron: 0, pasaron: 38, total: 38 }));
prueba('las reglas, con dos trampas abiertas', () => igual(leerResumen('Tests  2 failed | 7 passed (9)'), { fallaron: 2, pasaron: 7, total: 9 }));
--- solución
function leerResumen(linea) {
  const numero = (re) => Number(linea.match(re)?.[1] ?? 0);
  return { fallaron: numero(/(\d+) failed/), pasaron: numero(/(\d+) passed/), total: numero(/\((\d+)\)/) };
}
```

```practica
elige :: En la Práctica 3, ¿por qué falla `formatoReal("180")`? :: Porque 180 es mucho dinero :: Porque `"180"` entre comillas es texto y se espera un número :: Porque falta un import
elige :: En la Práctica 2, ¿qué recibe la prueba en vez de `true`? :: `true` :: `false` :: `null`
vf :: Al terminar la práctica, `git status` no debe mostrar archivos cambiados
```

> 🔁 **Repaso:** provocaste un nombre inexistente, una prueba que falla y un error de tipo; los leíste, los arreglaste y dejaste todo como estaba.

## Ejercicios

> 🎙️ **El profesor:** examen de "luces del tablero": te muestro el error y tú dices qué significa y qué harías. Escribe tus respuestas antes de abrir.

> 🌎 **En la vida real:** Es como un examen de luces del tablero: te muestran la luz y dices qué significa y qué harías.

1. `error TS2307: Cannot find module '../utils/fuelLevell'`
2. `TypeError: undefined is not a function`
3. `expected: 80, actual: 130` en una prueba de "Mi empresa suma aparte"
4. `FirebaseError: Missing or insufficient permissions.`

<details>
<summary>Ver las correcciones explicadas</summary>

1. **No encuentra el archivo**: el nombre está mal escrito (`fuelLevell` con doble l). Corregir la ruta del `import`.
2. Se intentó **llamar como función** algo que no existe (está `undefined`). Revisar el nombre de la función y si está importada.
3. Esperaba 80 (50 + 30) y dio 130: los registros se están **sumando mal o contando dos veces**. Primero: ¿la prueba calcula bien lo esperado? Después: revisar la regla de sumar.
4. Las **reglas de seguridad de Firestore** no permiten esa lectura o escritura. Revisar `firestore.rules` y si la persona tiene sesión (Tema 08).

</details>

```practica
elige :: `Cannot find module '../utils/fuelLevell'` quiere decir… :: Falta una prueba :: No encuentra ese archivo: la ruta está mal escrita :: Falta internet
elige :: `undefined is not a function` quiere decir… :: Se llamó como función algo que no existe :: Falta un dato obligatorio :: Metro está apagado
elige :: `Missing or insufficient permissions` de Firebase quiere decir… :: Que el teléfono no tiene batería :: Que las reglas de seguridad no permiten esa operación :: Que falta un import
```

## Para la entrevista

> 🎙️ **El profesor:** estas dos son de las preguntas más comunes en entrevistas. Respóndelas en voz alta.

> 🌎 **En la vida real:** Contar cómo depuras es como contarle a un cliente cómo encontraste el ruido raro de su carro: con método, no con suerte.

> 🎤 **Entrevista:** "¿Cómo depuras un error?"

<details>
<summary>Ver una buena respuesta</summary>

"Primero lo reproduzco y leo el mensaje completo: tipo, mensaje y lugar. Después formo una idea de la causa y la compruebo con un solo cambio. No cambio varias cosas a la vez. Cuando lo arreglo, busco la causa raíz y, si se puede, dejo una prueba para que no vuelva."

</details>

> 🎤 **Entrevista:** "Cuéntame un error difícil."

<details>
<summary>Ver una buena respuesta</summary>

"En el panel de mi app, al cambiar el color de la foto de un carro, no pasaba nada y no aparecía ningún error. Reproduje el problema con la foto real y apareció un TypeError: la función que detecta el color de la pintura devolvía null con fotos reales, porque la pintura tiene muchos tonos. La corregí, agregué un aviso en pantalla para cuando no encuentra el color y dejé pruebas."

**Por qué es buena:** tiene **la situación**, **cómo lo encontraste** (reproducir con datos reales), **la causa**, **el arreglo** y **la prevención** (pruebas).

</details>

```practica
escribe :: Cuenta el "error difícil" del color en 3 frases. :: Al cambiar el color no pasaba nada y no había error; lo reproduje con la foto real y apareció un TypeError porque la detección del color devolvía null; lo corregí, agregué un aviso en pantalla y pruebas.
```

> 🔁 **Repaso final de la clase:** verificar antes de adivinar; las partes de un error; los cuatro lugares (cuanto antes, más barato); seis errores reales leídos; el método de 8 pasos; qué hacer cuando no se entiende; y practicaste provocando errores. Con esto terminas los **Fundamentos**. Próxima etapa: **La web (Tema 15, HTML)**.
