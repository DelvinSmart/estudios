# Tema 04: CI (Integración Continua)

> 🌎 **En la vida real:** en el Tema 02 y 03 tú corrías las pruebas a mano. El CI es contratar a un empleado que las corre **solo**, cada vez que entregas algo, aunque te olvides o tengas prisa.

## 1. ¿Qué es el CI?

> 🌎 **En la vida real:** piensa en el control de equipaje del aeropuerto. Cada maleta (cada `git push`) pasa por la máquina de rayos X, siempre, sin excepción. Al guardia no le importa si tienes prisa o si "es solo una maleta chiquita": todas pasan. Si encuentra algo prohibido, la maleta no sube al avión.
>
> "Computadora limpia" quiere decir que, para cada maleta, la máquina arranca de cero: no recuerda la maleta anterior.

**CI** viene del inglés *Continuous Integration*: **Integración Continua**.

Es una **máquina en internet que revisa tu código sola cada vez que lo subes**. Tú haces `git push`, y en ese momento GitHub enciende una computadora limpia, descarga tu código, lo instala desde cero y corre todas las revisiones. Si algo falla, te avisa.

**Comparación:** es el inspector de calidad de una fábrica de carros. Cada carro que sale de la línea pasa por el inspector. Si los frenos no funcionan, no sale de la fábrica. El inspector no se cansa, no se olvida de revisar nada y revisa **todos** los carros, no solo algunos.

## 2. ¿Para qué sirve?

> 🌎 **En la vida real:** - **Nadie se olvida**: es como el lavaplatos automático. Aunque estés cansado, igual lava todo.
> - **Máquina limpia**: es como cocinar tu receta en la cocina de un amigo. En tu casa tal vez sale bien porque tenías un condimento guardado que ni recordabas; en la cocina del amigo descubres que la receta no lo menciona.
> - **Aviso rápido**: como el detector de metales: en segundos sabes si pasas o no, no días después.
> - **Historial**: como las cámaras de una tienda: puedes rebobinar y ver a qué hora y quién dejó la puerta abierta.
> - **Confianza**: como el sello "revisado" de la revisión técnica del carro.
>
> El caso real es exactamente el del condimento escondido: tu Mac tenía algo instalado de antes que tapaba el problema.

| Para qué | Qué significa en tu app |
|---|---|
| **Nadie se olvida de revisar** | Aunque tengas prisa, la máquina corre las 400 pruebas igual |
| **Máquina limpia** | Tu Mac tiene archivos y programas que otros no tienen. La máquina del CI empieza de cero, como la de cualquier otra persona |
| **Aviso rápido** | En unos 4 minutos sabes si rompiste algo |
| **Historial** | Puedes ver qué subida rompió algo y cuándo |
| **Confianza** | Si el CI está en verde, el código cumple todas las reglas que escribiste |

**Caso real de tu app:** la copia limpia del CI encontró un fallo que en tu Mac no se veía. La Mac tenía cosas instaladas de antes que escondían el problema; la máquina limpia, no.

## 3. Lo que el CI NO hace

> 🌎 **En la vida real:** - **No prueba en un teléfono**: el rayos X del aeropuerto ve lo que hay dentro de la maleta, pero no sabe si la ropa está bonita.
> - **No sabe si la regla es correcta**: si la lista del aeropuerto olvidó prohibir algo, el guardia lo deja pasar. Solo cumple la lista.
> - **No publica en Google Play**: el inspector de la fábrica aprueba el carro, pero no lo lleva a la concesionaria. Eso lo haces tú.

- **No prueba la app en un teléfono.** No sabe si un botón se ve feo o si la app abre en el iPhone.
- **No sabe si la regla es la correcta.** Solo revisa lo que las pruebas dicen.
- **No publica en Google Play.** Solo revisa; publicar lo haces tú.

## 4. ¿Dónde vive?

> 🌎 **En la vida real:** es como la hoja de instrucciones pegada en la pared de la cocina de un restaurante: "al llegar cada pedido: lavar, cortar, cocinar, servir". GitHub busca esa hoja en un lugar fijo (`.github/workflows/`), igual que el cocinero nuevo siempre mira la misma pared.
>
> La **sangría** del YAML es como el índice de un libro: "Capítulo 1" y, más metido hacia adentro, "1.1", "1.2". Lo que está más adentro pertenece a lo de arriba.

En tu app, en el archivo **`.github/workflows/ci.yml`**.

- `.github/workflows/` es la carpeta donde GitHub busca las instrucciones.
- `ci.yml` es un archivo **YAML**: un formato de texto para configuraciones. Se escribe con sangría (espacios a la izquierda); la sangría dice qué está dentro de qué.

La herramienta que lo ejecuta se llama **GitHub Actions**. Es gratis para proyectos como el tuyo.

## 5. Las palabras del archivo

> 🌎 **En la vida real:** todo es una receta de restaurante:
> - `on` = **cuándo** se cocina: "cada vez que llega un pedido".
> - `jobs` = los **cocineros**. Cada uno tiene su propia estación y trabajan al mismo tiempo: uno hace la carne, otro la ensalada.
> - `runs-on` = **qué cocina** usa (una de gas, una eléctrica…). Aquí, Linux.
> - `steps` = los **pasos** de la receta, en orden. Si se quemó el arroz en el paso 2, no sigues al paso 3.
> - `uses` = usar algo **ya preparado** que compraste hecho, como una salsa de frasco.
> - `run` = una orden directa: "pica la cebolla".
> - `name` = el nombre del plato en el menú.
> - `working-directory` = en **qué mesa** de la cocina se trabaja.

| Palabra | Significado |
|---|---|
| `on` | **Cuándo** se ejecuta |
| `jobs` | **Trabajos**: grupos de revisiones. Cada trabajo corre en su propia máquina, al mismo tiempo que los otros |
| `runs-on` | En qué sistema corre la máquina (`ubuntu-latest` es Linux) |
| `steps` | Los **pasos** de un trabajo, en orden. Si un paso falla, los siguientes no se ejecutan |
| `uses` | Usa una pieza ya hecha por otra persona (una "acción") |
| `run` | Ejecuta un comando, igual que si lo escribieras en la terminal |
| `name` | El nombre que ves en GitHub |
| `working-directory` | En qué carpeta corren los comandos |

## 6. El archivo de tu app, explicado

> 🌎 **En la vida real:** ahora leemos la hoja de instrucciones real de tu "restaurante", renglón por renglón.

### El comienzo

> 🌎 **En la vida real:** es como el cartel en la puerta de la cocina: "Nombre: CI. Se activa: cada vez que llega un pedido (`push`) y cada vez que alguien propone un plato nuevo para el menú (`pull_request`)".

```yaml
name: CI

on:
  push:
  pull_request:
```

- `name: CI` es el nombre que ves en GitHub.
- `on: push` significa que corre **en cada subida**.
- `pull_request` significa que corre también cuando alguien propone un cambio (eso se ve en el Tema 06).

### Las 5 revisiones son 5 trabajos

> 🌎 **En la vida real:** en un taller grande, cuando llega tu carro, 5 mecánicos lo revisan **a la vez**: uno el motor, otro los frenos, otro las luces, otro la electricidad y otro la carrocería. Así tarda 4 minutos y no 20. Cada uno tiene su propio banco de herramientas (su máquina).

Cuando el mapa dice "5 revisiones en cada subida", habla de estos 5 trabajos. Corren **al mismo tiempo**, cada uno en su máquina:

| # | Trabajo | Qué revisa |
|---|---|---|
| 1 | `app` | La app: tipos, diseño, ciclos, tamaño, secretos, pruebas y que se pueda armar para Android e iOS |
| 2 | `carton-android` | El cartón automático (Kotlin): sus 61 pruebas |
| 3 | `functions` | El servidor (Cloud Functions): sus pruebas |
| 4 | `reglas` | Las reglas de seguridad de Firestore: que nadie lea datos ajenos |
| 5 | `panel` | Que el panel web se pueda armar |

### Trabajo 1: `app` (el más grande)

> 🌎 **En la vida real:** es el mecánico principal. Primero prepara su banco:
> - `checkout` = recibir las llaves y meter el carro al taller (descargar tu código).
> - `setup-node` = sacar la caja de herramientas correcta (Node 22).
> - `cache: npm` = dejar las piezas que más se usan a mano en el estante, para no ir a la bodega cada vez.
> - `npm ci` = armar las piezas **exactamente** como dice la factura (`package-lock.json`). Si la factura dice tornillo de 10 mm y llegó uno de 11, se detiene. `npm install` sería un mecánico que dice "bah, el de 11 también sirve".
>
> Después, sus revisiones, una por una:
> - **TypeScript**: revisar que cada pieza vaya en su lugar: no meter aceite en el tanque de agua.
> - **Candado de diseño**: que nadie haya pintado una puerta de un color que no es el oficial de la marca.
> - **Sin ciclos**: que no haya dos piezas que se necesiten mutuamente para arrancar, como "para abrir la caja necesito la llave, y la llave está dentro de la caja".
> - **Tamaño**: que ningún manual tenga más de 1.000 páginas; si no, nadie lo lee.
> - **Secretos**: que nadie haya dejado la llave de la casa pegada con cinta en la puerta.
> - **Pruebas**: las 190 revisiones de las reglas del dinero, las fechas, el San…
> - **Bundle**: comprobar que el carro se puede **armar completo**, no solo que cada pieza esté bien por separado.
>
> `--noEmit` = "revisa, pero no fabriques nada": el inspector mira, no construye.

```yaml
  app:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
```

- `actions/checkout@v4` **descarga tu código** a la máquina limpia.
- `actions/setup-node@v4` instala **Node.js** versión 22, el programa que ejecuta JavaScript fuera del navegador.
- `cache: npm` guarda las librerías descargadas para la próxima vez. Así tarda menos.
- `npm ci` **instala las librerías** exactamente como están anotadas en `package-lock.json`. Es como `npm install`, pero estricto: si algo no coincide, falla. Por eso se usa en el CI.

Después vienen los pasos de revisión, en orden:

| Paso | Comando | Qué revisa | Qué atrapa |
|---|---|---|---|
| **TypeScript** | `npx tsc --noEmit -p .` | Que todos los tipos estén bien en toda la app | Pasar un número donde va un texto, una función que no existe, un dato que falta |
| **Candado de diseño** | `npm run check:design` | Que ninguna pantalla tenga colores o medidas escritos a mano | Un `#FF0000` suelto en vez del color del panel (tu regla "unir, nunca copiar") |
| **Sin ciclos** | `npm run check:cycles` | Que ningún archivo dependa de otro que dependa del primero | El archivo A usa B, y B usa A: la app puede arrancar rota |
| **Tamaño de archivos** | `npm run check:size` | Que ningún archivo pase de 1.000 líneas | Archivos gigantes que nadie puede leer |
| **Secretos** | `npm run check:secrets` | Que no haya claves secretas dentro de la app | Una clave de pago o de IA que cualquiera podría robar |
| **Pruebas de la app** | `npm test` | Las ~190 pruebas de la app | Errores en las reglas de dinero, fechas, San, combustible... |
| **Bundle** | `npx expo export ...` | Que la app se pueda armar para Android y para iOS | Un archivo que falta o un import roto que solo aparece al armar |

`--noEmit` quiere decir "revisa, pero no generes archivos". Solo queremos saber si hay errores.

### Trabajo 2: `carton-android`

> 🌎 **En la vida real:** es el mecánico especialista en una marca extranjera. El cartón habla **Kotlin**, que necesita **Java** como herramienta, igual que un carro alemán necesita llaves métricas especiales. `expo prebuild` es como armar el banco de trabajo de esa marca, que no viene de fábrica. `gradlew` es la máquina de diagnóstico propia de Android.

```yaml
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - run: npm ci
      - name: Generar android/
        run: npx expo prebuild --platform android --no-install
      - name: Pruebas Kotlin del cartón
        working-directory: android
        run: ./gradlew :ride-overlay:testDebugUnitTest --console=plain
```

- El cartón está escrito en **Kotlin**, que necesita **Java**. Por eso instala Java 17.
- `expo prebuild` genera la carpeta `android/` (en el repositorio no está; se crea).
- `./gradlew` es la herramienta que arma proyectos Android. `testDebugUnitTest` corre las pruebas del cartón: leer las ofertas de Uber, 99 e inDrive y calcular R$/km.

### Trabajo 3: `functions`

> 🌎 **En la vida real:** es el mecánico que revisa la **oficina central** (el servidor), no el carro. `working-directory: functions` es decirle "tú trabajas en el cuarto de atrás".

```yaml
    defaults:
      run:
        working-directory: functions
    ...
      - run: npm ci
      - name: Pruebas del backend
        run: npm test
```

- `working-directory: functions` hace que todo corra dentro de la carpeta del servidor.
- Corre las pruebas del servidor: el Copiloto, los costos de IA, el catálogo de vehículos, los colores...

### Trabajo 4: `reglas`

> 🌎 **En la vida real:** es el cerrajero. El **emulador de Firebase** es una **maqueta** del edificio: el cerrajero intenta abrir la puerta del vecino en la maqueta, no en el edificio real. Si la cerradura lo **impide**, la prueba pasa. Así nadie toca a los inquilinos de verdad.

```yaml
      - uses: actions/setup-java@v4
      ...
      - name: Pruebas de las reglas de Firestore
        run: npm test
```

- Las reglas de seguridad se prueban con el **emulador de Firebase**: una copia falsa de la base de datos que corre en la máquina. Necesita Java.
- Las pruebas intentan, por ejemplo, leer los ingresos de otra persona, y comprueban que la regla lo **impida**.

### Trabajo 5: `panel`

> 🌎 **En la vida real:** es comprobar que los muebles del panel web se pueden **armar** con las piezas de la caja. Si falta un tornillo, mejor enterarse ahora que el día de la mudanza (la publicación).

```yaml
      - run: npm ci
      - name: Build del panel
        run: npm run build
```

- Arma el panel web. Si no se puede armar, no se podría publicar.

## 7. ¿Cómo se ve en GitHub?

> 🌎 **En la vida real:** la pestaña **Actions** es como el semáforo del lavadero de carros:
> - ✅ **verde**: terminó y salió limpio.
> - ❌ **rojo**: algo salió mal; entras y ves en qué paso.
> - 🟡 **amarillo**: todavía lo están lavando.
>
> `gh run list` es como llamar por teléfono al lavadero para preguntar "¿cómo van los últimos 5 carros?" en vez de ir en persona.

1. Entra a **github.com/DelvinSmart/copiloto-driver**.
2. Toca la pestaña **Actions**.
3. Ves una lista de subidas. Cada una tiene:
   - ✅ **verde**: todo pasó.
   - ❌ **rojo**: algo falló.
   - 🟡 **amarillo**: todavía está corriendo.
4. Toca una para ver los 5 trabajos, y toca un trabajo para ver cada paso. El paso que falló está marcado en rojo y abajo está el error.

**Tus últimas subidas (10/11/2026):** las 6 últimas pasaron, cada una en unos 4 minutos.

También se puede ver desde la terminal:
```bash
gh run list --limit 5
```

## 8. ¿Cómo se construye un CI desde cero?

> 🌎 **En la vida real:** es como armar el reglamento de un gimnasio nuevo:
> 1. Decides lo más importante: "todos firman al entrar".
> 2. Te aseguras de que se pueda hacer: hay una hoja y una lapicera en la recepción (el comando funciona en tu terminal).
> 3. Escribes el reglamento y lo pegas en la pared (`ci.yml`).
> 4. Empiezas con una sola regla.
> 5. Abres el gimnasio y miras si la gente lo cumple (`git push` y la pestaña Actions).
> 6. Cada vez que pasa un problema que se repite ("dejan las pesas tiradas"), agregas una regla nueva. Así nacieron tus candados de diseño y de ciclos.

Así se hizo el de tu app, y así lo harías en cualquier proyecto:

1. **Decide qué revisar.** Empieza por lo más importante: que compile y que pasen las pruebas.
2. **Asegúrate de que cada revisión sea un comando.** Si en tu computadora se revisa con `npm test`, en el CI también. Primero tiene que funcionar en tu terminal.
3. **Crea el archivo** `.github/workflows/ci.yml`.
4. **Escribe el trabajo mínimo:**
   ```yaml
   name: CI
   on:
     push:
   jobs:
     pruebas:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 22
         - run: npm ci
         - run: npm test
   ```
5. **Súbelo** con `git push` y mira la pestaña Actions.
6. **Agrega revisiones de a una.** Cada vez que encuentres un error que se repite, crea una revisión para que no vuelva. Así nacieron el candado de diseño y el de ciclos en tu app.

## 9. Cómo "piensa" el CI

> 🌎 **En la vida real:** el CI es como el guardia que solo mira la luz del detector de metales: **verde o roja**. No sabe qué llevas en el bolsillo, solo si sonó o no.
> - **Código de salida 0** = luz verde: "todo bien".
> - **Cualquier otro número** = luz roja: "algo falló".
>
> Por eso tus scripts como `check:design` están hechos para "hacer sonar el detector" cuando ven un color suelto. El guardia no sabe nada de colores; solo escucha el pitido.

El CI no entiende tu app. **Solo entiende una cosa: si cada comando terminó bien o mal.**

- Cada comando, al terminar, devuelve un número llamado **código de salida**.
- `0` significa "todo bien".
- Cualquier otro número significa "falló".
- Si un paso devuelve algo distinto de 0, el CI marca ese paso en rojo y detiene ese trabajo.

Por eso los scripts como `check:design` están hechos para **terminar con error** cuando encuentran un problema. El CI no sabe qué es un color; solo ve que el script falló.

## Ejercicios

> 🌎 **En la vida real:** es como recorrer el taller con el jefe y señalar a cada uno de los 5 mecánicos diciendo con tus palabras qué hace cada uno.

1. Abre `.github/workflows/ci.yml` en tu app y busca los 5 trabajos. Escribe con tus palabras qué hace cada uno.
2. Entra a la pestaña **Actions** de tu repositorio y abre la última subida. ¿Cuánto tardó? ¿Cuál fue el trabajo más lento?
3. En la terminal de la app corre `npm run check:size`. ¿Qué dice?
4. Pregunta: si cambias un color a mano en una pantalla (`color: '#FF0000'`), ¿qué paso del CI falla?
5. Pregunta: ¿por qué se usa `npm ci` y no `npm install`?
6. Pregunta: ¿por qué el CI no puede detectar que un botón se ve feo?

<details>
<summary>Respuestas</summary>

4. El **Candado de diseño** (`check:design`).
5. Porque `npm ci` instala exactamente lo que está anotado en `package-lock.json`, y falla si algo no coincide. Así la máquina del CI tiene las mismas versiones que tú.
6. Porque el CI solo revisa comandos y pruebas. Ninguno mira la pantalla. Para eso se prueba en el teléfono (o con pruebas E2E, que tu app todavía no tiene).

</details>

## Para la entrevista

> 🌎 **En la vida real:** explicarlo es como explicar el control del aeropuerto: "cada maleta pasa por rayos X sola, en una máquina limpia, y si algo está mal no sube al avión".
> - **CI vs. CD**: CI es el control de seguridad. CD sería que, además, la maleta se suba **sola** al avión. En tu app la subes tú.

**¿Qué es CI?**
> Integración continua: en cada subida, una máquina limpia descarga el código, lo instala desde cero y corre las revisiones automáticas. Si algo falla, el equipo lo sabe en minutos.

**¿Qué revisa el CI de tu app?**
> Cinco trabajos en paralelo: la app (tipos, diseño, ciclos, tamaño, secretos, pruebas y que se pueda armar para Android e iOS), las pruebas en Kotlin del módulo de Android, las del servidor, las de las reglas de seguridad de Firestore y que el panel web se pueda armar.

**¿Qué diferencia hay entre CI y CD?**
> CI revisa el código en cada subida. CD (entrega continua) además lo publica solo. Mi app tiene CI; la publicación la hago yo.
