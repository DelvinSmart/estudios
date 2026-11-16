# Tema 07: Leer errores

> 🌎 **En la vida real:** un mensaje de error es como la luz de "check engine" del carro conectada al escáner del mecánico: no te está regañando, te está diciendo **qué** falla y **dónde**. El que sabe leer el escáner arregla en 10 minutos lo que otro tarda una semana adivinando.

Un error no es un fracaso: es un **mensaje** del programa diciéndote qué salió mal y dónde. Quien sabe leerlo arregla en minutos lo que otro tarda horas en adivinar.

**Antes de empezar:** Temas 01 a 06.

**Tiempo:** de 1 a 2 horas.

## 1. La regla más importante

> 🌎 **En la vida real:** es como el médico serio: antes de recetar, pide el análisis de sangre. El que receta "por si acaso" sin mirar puede curarte algo que no tenías y dejarte enfermo de lo que sí tenías. Primero el dato real; después el cambio.

> **Verificar antes de adivinar.** Primero consigues el error real o el dato real. Después cambias algo.

Está escrita en el documento principal de tu app (`AGENTS.md`), porque dos veces se "arregló" algo adivinando y el arreglo era falso.

## 2. Las partes de un error

> 🌎 **En la vida real:** un error es como una multa de tránsito:
> - **Tipo** = la clase de infracción: "exceso de velocidad" o "estacionamiento prohibido".
> - **Mensaje** = lo que pasó: "iba a 80 en zona de 60".
> - **Lugar** = la dirección exacta: "Rua XV de Novembro, altura del 560". `(560,26)` es como "calle 560, casa 26".
> - **Pista** = la nota del agente: "¿quiso decir que no vio el cartel?".
> - **Pila (stack trace)** = el recorrido que hiciste hasta la multa: saliste de casa → tomaste la avenida → doblaste en la XV → ahí te pararon. Se lee del último lugar al primero.

Casi todos los errores tienen las mismas partes:

| Parte | Qué dice | Ejemplo |
|---|---|---|
| **Tipo** | Qué clase de error es | `TypeError`, `error TS2552` |
| **Mensaje** | Qué pasó, en palabras | `Cannot find name 'VehicleTextField'` |
| **Lugar** | Archivo, línea y columna | `VehicleSetupScreen.tsx(560,26)` |
| **Pista** (a veces) | Una sugerencia | `Did you mean 'VehicleSelectField'?` |
| **Pila** (stack trace) | El camino de llamadas hasta el error | Una lista de archivos, del más reciente al más viejo |

`(560,26)` quiere decir **línea 560, columna 26**. En VS Code: **Cmd + P**, escribe el nombre del archivo, y después **Ctrl + G** y el número de línea.

## 3. Los cuatro lugares donde aparecen errores

> 🌎 **En la vida real:** es como descubrir un problema en un pastel:
> - **TypeScript** = leer la receta y ver que dice "2 kilos de sal". Lo arreglas antes de cocinar: **gratis**.
> - **Pruebas** = probar la masa cruda con el dedo: barato.
> - **Metro / Expo** = el pastel no sube en el horno: ya perdiste ingredientes y tiempo.
> - **En ejecución** = el cliente muerde el pastel en su cumpleaños y está salado: **lo más caro**, porque ya le pasó a alguien.

| Dónde | Cuándo | Quién lo muestra |
|---|---|---|
| **TypeScript** | Antes de ejecutar (al revisar) | `npx tsc --noEmit -p .` y VS Code (subrayado rojo) |
| **Pruebas** | Al correr las pruebas | `npm test` |
| **Metro / Expo** | Al armar o abrir la app | La terminal y la pantalla roja del simulador |
| **En ejecución** | Mientras alguien usa la app | La pantalla roja, la consola o Sentry |

Cuanto más arriba en la tabla aparece un error, **más barato** es arreglarlo. Un error de TypeScript no llega nunca al usuario; uno en ejecución, sí.

## 4. Errores reales de hoy, leídos

> 🌎 **En la vida real:** como un médico que repasa casos de pacientes reales: no son ejemplos de libro, pasaron de verdad en tu app.

Todos estos salieron el 10/11/2026 mientras trabajábamos en tu app.

### Error 1: un nombre que no existe

> 🌎 **En la vida real:** es como pedirle a alguien de la casa "pásame a Juan al teléfono" y que te respondan "aquí no vive ningún Juan; ¿quisiste decir Juana?". Juan existe, pero vive en otra casa: te faltó **traerlo** (el `import`). "Cannot find name" casi siempre es eso: no lo trajiste o escribiste mal el nombre.

```text
src/screens/onboarding/VehicleSetupScreen.tsx(560,26): error TS2552:
Cannot find name 'VehicleTextField'. Did you mean 'VehicleSelectField'?
```

- **Tipo:** error de TypeScript (`TS2552`).
- **Lugar:** `VehicleSetupScreen.tsx`, línea 560.
- **Mensaje:** se usa algo llamado `VehicleTextField`, pero ese nombre no existe en el archivo.
- **Causa real:** se creó la pieza `VehicleTextField` y se usó en la pantalla, pero faltaba el `import` arriba del archivo.
- **Arreglo:** agregar `import VehicleTextField from '../../components/vehicles/VehicleTextField';`

**Lección:** "Cannot find name" casi siempre es un `import` que falta o un nombre mal escrito.

### Error 2: falta un dato obligatorio

> 🌎 **En la vida real:** es como un formulario de la Receita Federal que tiene el campo "CPF" con un asterisco (*) de obligatorio, y tú lo dejaste vacío. Hay dos salidas: lo llenas, o el formulario se cambia para que ese campo sea **opcional** (el `?`, como cuando un campo dice "(opcional)").

```text
src/screens/onboarding/VehicleSetupScreen.tsx(608,28): error TS2741:
Property 'children' is missing in type '{ label: string; value: string; ... }'
but required in type 'VehicleSelectFieldProps'.
```

- **Mensaje:** la pieza `VehicleSelectField` exige un dato llamado `children` (lo que va adentro), y no se le pasó.
- **Causa real:** se cambió la forma de usar la pieza (la lista ahora va abajo, aparte), pero la pieza todavía exigía `children`.
- **Arreglo:** hacer `children` opcional en la pieza: `children?: React.ReactNode` (el `?` significa "puede faltar").

**Lección:** "is missing ... but required" significa que falta algo obligatorio. O se lo pasas, o lo haces opcional.

### Error 3: algo declarado que no se usa

> 🌎 **En la vida real:** es como tener una herramienta en la caja que ya no usas para nada: no estorba mucho, pero ocupa lugar y confunde al que abre la caja ("¿para qué será esto?"). Tu app tiene la regla de no dejar herramientas que no se usan.

```text
src/screens/copilot/IACopilotoScreen.styles.ts(2,10): error TS6133:
'Platform' is declared but its value is never read.
```

- **Mensaje:** se importó `Platform`, pero ya nadie lo usa.
- **Causa real:** se movió el estilo que usaba `Platform` a otra pieza (`ChatInputShell`).
- **Arreglo:** borrar `Platform` del `import`.

**Lección:** no rompe nada, pero es código muerto. Tu app no lo permite, para mantenerla limpia.

### Error 4: una prueba que falla

> 🌎 **En la vida real:** es como el inventario de la tienda: la lista dice que hay 5 productos en el estante, pero cuentas 6. Antes de acusar a alguien de robar al revés, preguntas: ¿alguien agregó un producto nuevo **a propósito**? Sí: se agregó "Mi empresa". El estante estaba bien; **la lista estaba vieja**.

```text
not ok 77 - plataformas da conta: fixas do app + workApps ativas
  expected: ['particular_trips', 'extras', 'uber', '99', 'custom-123']
  actual:   ['my_company', 'particular_trips', 'extras', 'uber', '99', 'custom-123']
```

- **Mensaje:** la prueba esperaba una lista y recibió otra con `my_company` al principio.
- **Pregunta clave:** ¿está mal el código o está vieja la prueba?
- **Causa real:** se agregó "Mi empresa" a propósito, primera en la lista. **La prueba estaba vieja**, no el código.
- **Arreglo:** actualizar lo esperado en la prueba.

**Lección:** cuando una prueba falla, revisa en orden: ¿la regla cambió a propósito?, ¿la prueba está bien?, ¿el código está mal?

### Error 5: el error de verdad detrás de "no pasa nada"

> 🌎 **En la vida real:** es como un carro que no arranca y no hace **ningún** ruido. "No hace nada" no quiere decir "no tiene nada". El mecánico conecta el escáner con la llave puesta (reproduce con los datos reales) y aparece el código: batería en cero.
>
> El `TypeError` es como pedirle a alguien que te diga el color de la camisa de una persona que **no está** en la sala: no puede, porque ahí no hay nadie (`null`). Con fotos reales, el detector de color "no veía a nadie".

Viste en el panel que al mover el color "no pasaba nada": no salía ningún error en la pantalla. Para encontrarlo, se probó la misma función con la foto real del Etios, y apareció:

```text
TypeError: null is not an object (evaluating 'source.r')
```

- **Tipo:** `TypeError`, un error en ejecución.
- **Mensaje:** se intentó leer `.r` (el rojo de un color) de algo que era `null` (nada).
- **Causa real:** la función que detecta el color de la pintura devolvía `null` con fotos reales. Sin color de origen, no había nada que pintar.
- **Arreglo:** mejorar la detección y avisar en pantalla cuando no encuentra el color.

**Lección:** "no pasa nada" casi nunca es "no hay error". Hay que **buscar** el error: reproducir el problema con los datos reales hasta que el error aparezca.

### Error 6: la pantalla roja de Expo

> 🌎 **En la vida real:** es como llamar a la pizzería y que no conteste nadie. La pizzería no está quebrada: simplemente **no abrió hoy**. Metro (el que entrega el código) estaba apagado. Lo enciendes y listo. No todos los problemas son "del código".

```text
Could not connect to development server.
URL: http://localhost:8081/...
```

- **Mensaje:** la app en el simulador busca a Metro (el programa que entrega el código) y no lo encuentra.
- **Causa real:** Metro no estaba encendido.
- **Arreglo:** `./scripts/emuladores.sh expo`.

**Lección:** no todos los errores son del código. A veces falta encender algo.

## 5. El método, paso a paso

> 🌎 **En la vida real:** es el método del mecánico bueno:
> 1. **Lee la primera línea**: lo que dice el escáner.
> 2. **Ve al lugar**: abre el capó justo donde está la pieza.
> 3. **¿Qué esperaba y qué encontró?**: "esperaba 12 voltios, hay 8".
> 4. **Reprodúcelo**: si el ruido sale solo en subida, sube una cuesta para escucharlo. Si no lo puedes repetir, no sabrás si lo arreglaste.
> 5. **Una idea**: "creo que es la batería".
> 6. **Un solo cambio**: cambia **solo** la batería.
> 7. **Comprueba**: ¿arranca?
> 8. **Causa raíz**: ¿por qué se descargó? ¿El alternador? ¿Pasará de nuevo?
>
> **Lo que no se hace**: cambiar batería, alternador, bujías y cables a la vez. Si arranca, no sabrás cuál era, y gastaste en cuatro piezas.

1. **Lee la primera línea completa.** Ahí está casi todo.
2. **Ve al lugar exacto** (archivo y línea).
3. **Pregúntate qué esperaba el programa** y qué encontró.
4. **Reprodúcelo:** haz que el error vuelva a aparecer a propósito. Si no lo puedes repetir, no puedes comprobar que lo arreglaste.
5. **Forma una idea** de la causa ("creo que falta el import").
6. **Haz un solo cambio** para probar esa idea.
7. **Comprueba:** corre de nuevo. ¿Desapareció?
8. **Busca la causa raíz:** ¿por qué pasó? ¿Puede pasar en otro lugar?

**Lo que no se hace:** cambiar cinco cosas a la vez "a ver si se arregla". Si funciona, no sabrás cuál de las cinco fue.

## 6. Cuando el mensaje no se entiende

> 🌎 **En la vida real:** 1. **Buscar en Google** = preguntar en el grupo de conductores: casi siempre a otro ya le pasó lo mismo con el mismo carro.
> 2. **Preguntarle a Claude con el error completo** = llevarle al mecánico el papel del escáner, no decirle "hace un ruidito".
> 3. **`console.log`** = poner un manómetro en la manguera para ver la presión real en ese punto, mientras el motor anda.
> 4. **Borrarlos al final** = sacar los manómetros antes de devolver el carro al cliente.

1. **Copia el mensaje exacto** (sin tus datos personales) y búscalo en Google. Casi siempre alguien ya lo tuvo.
2. **Pregúntale a Claude** pegando el error completo, no un resumen.
3. **Agrega un `console.log`** para ver el valor real de algo:
   ```ts
   console.log('[MiPantalla] valor del color:', source);
   ```
   En modo Expo, lo que imprime aparece en la terminal (y en `~/copiloto-logs/metro.log`).
4. **Borra los `console.log`** cuando termines.

## Práctica guiada (en la app; al final se deshace todo)

> 🌎 **En la vida real:** es como los simulacros de incendio de la escuela: el fuego es de mentira, pero aprendes por dónde salir. Al final, todo vuelve a su lugar.

### Práctica 1: provoca un "Cannot find name"

> 🌎 **En la vida real:** es escribir mal un contacto en el teléfono ("Juann") y ver que la agenda te dice "no existe; ¿quisiste decir Juan?".
1. Abre `src/screens/onboarding/VehicleSetupScreen.tsx` y busca la línea `const tankCapacityLiters = vehicleHasFuelTank(vehicleType)` (cerca de la línea 468). Cambia `vehicleHasFuelTank` por `vehicleHasFuelTankk` (con doble k).
2. Corre `npx tsc --noEmit -p .`
3. Lee el error: tipo, archivo, línea y la pista.
4. Arréglalo.

### Práctica 2: provoca una prueba que falla

> 🌎 **En la vida real:** es sacar a propósito "Mi empresa" de la lista de cosas que suman aparte, como si el cajero empezara a contar las monedas de la alcancía como si fueran el cuentakilómetros. La prueba lo atrapa.
1. En `src/data/workAppsCatalog.ts`, en `isImmutableEarningPlatform`, quita `|| appId === 'my_company'`.
2. Corre `npx jest src/utils/__tests__/earningSourceRules.test.ts`
3. Lee cuál prueba falló y qué esperaba.
4. Devuelve lo que quitaste.

### Práctica 3: provoca un error de tipo

> 🌎 **En la vida real:** es escribir "seis" con letras en la casilla de un formulario que dice "solo números". El formulario lo rechaza: `"6"` entre comillas es una **palabra**, no un número, igual que la palabra "seis" escrita en un papel no sirve para sumar en la calculadora.
1. Abre `src/components/vehicles/VehicleFuelGauge.tsx` y busca `thickness={FUEL_BAR_THICKNESS}` (el grosor de la barra, un número). Cámbialo por `thickness="6"` (un texto, entre comillas).
2. Corre `npx tsc --noEmit -p .` y lee el error: dice que un `string` (texto) no sirve donde se espera un `number` (número).
3. Arréglalo.

### Al terminar

> 🌎 **En la vida real:** es lo que haces después del simulacro: contar a todos los alumnos y volver cada silla a su lugar. `git status` vacío = nadie quedó afuera.
```bash
git status
git restore src/screens/onboarding/VehicleSetupScreen.tsx src/data/workAppsCatalog.ts src/components/vehicles/VehicleFuelGauge.tsx
git status
```
No debe quedar ningún archivo cambiado.

## Ejercicios

> 🌎 **En la vida real:** es como un examen de manejo teórico con fotos de luces del tablero: te muestran la luz y tú dices qué significa y qué harías.

Explica con tus palabras qué significa cada error y qué harías:
1. `error TS2307: Cannot find module '../utils/fuelLevell'`
2. `TypeError: undefined is not a function`
3. `expected: 80, actual: 130` en una prueba de "Mi empresa suma aparte"
4. `FirebaseError: Missing or insufficient permissions.`

<details>
<summary>Respuestas</summary>

1. No encuentra el archivo: el nombre está mal escrito (`fuelLevell` con doble l). Corregir la ruta del import.
2. Se intentó llamar como función algo que no existe (está `undefined`). Revisar el nombre de la función y si está importada.
3. Si esperaba 80 (50 + 30) y dio 130, puede ser que los registros se estén sumando mal o contando dos veces. Primero: ¿la prueba calcula bien lo esperado? Después: revisar la regla de sumar.
4. Las reglas de seguridad de Firestore no permiten esa lectura o escritura. Revisar `firestore.rules` y si la persona tiene sesión (Tema 08).

</details>

## Para la entrevista

> 🌎 **En la vida real:** contar un error difícil es como contar un caso de taller: "el carro no daba ninguna señal; lo reproduje en las mismas condiciones, apareció el código, encontré la causa, lo arreglé y dejé un aviso para que no vuelva a pasar". Eso demuestra método, no suerte.

**¿Cómo depuras un error?**
> Primero lo reproduzco y leo el mensaje completo: tipo, mensaje y lugar. Después formo una idea de la causa y la compruebo con un solo cambio. No cambio varias cosas a la vez. Cuando lo arreglo, busco la causa raíz y, si se puede, dejo una prueba para que no vuelva.

**Cuéntame un error difícil.**
> En el panel de mi app, al cambiar el color de la foto de un carro, no pasaba nada y no aparecía ningún error. Reproduje el problema con la foto real y apareció un TypeError: la función que detecta el color de la pintura devolvía null con fotos reales, porque la pintura tiene muchos tonos. La corregí, agregué un aviso en pantalla para cuando no encuentra el color y dejé pruebas.
