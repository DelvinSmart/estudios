# Clase guiada 04: CI (Integración Continua)

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** una o dos partes por día. En cada **✋ Para y piensa**, responde antes de abrir. Aprueba la práctica de cada parte para prender su bombillo 💡.

**Lo que necesitas saber antes:** el Tema 02 (pruebas) y el 03 (correr pruebas en la terminal).

## 1. ¿Qué es el CI?

> 🎙️ **El profesor:** {{alumno}}, en los Temas 02 y 03 **tú** corrías las pruebas a mano. Pero ¿qué pasa el día que tienes prisa, o que te olvidas? Hoy vamos a ver al "empleado" que las corre **solo**, cada vez que subes algo, sin que se lo pidas: el **CI**.

> 🌎 **En la vida real:** Es como un vigilante nocturno de un edificio: hace su ronda solo, todas las noches, aunque el dueño esté durmiendo o de viaje.

> 🌎 **Otro ejemplo:** Es como el corrector automático de un examen con tarjeta de respuestas: cada examen que entra se corrige igual, sin cansarse y sin favoritos.

### La definición

**CI** viene del inglés *Continuous Integration*: **Integración Continua**. Es **una máquina en internet que revisa tu código sola cada vez que lo subes**.

Así funciona, paso a paso:
1. Tú haces `git push` (subes tu código a GitHub).
2. En ese momento, GitHub **enciende una computadora limpia**.
3. La computadora **descarga tu código**.
4. Lo **instala desde cero**.
5. **Corre todas las revisiones**: pruebas, tipos, candados…
6. Si algo falla, **te avisa**.

"**Computadora limpia**" quiere decir que arranca de cero cada vez: no tiene nada de lo que tú tengas instalado en tu Mac, ni recuerda la subida anterior.

> 🌎 **En la vida real:** el control de equipaje del aeropuerto. Cada maleta (cada `git push`) pasa por los rayos X, **siempre**, sin excepción. Al guardia no le importa si tienes prisa o si "es solo una maleta chiquita". Si encuentra algo prohibido, la maleta no sube al avión.

> 🌎 **Otro ejemplo:** Como el lavadero automático de carros: entras, y el carro pasa siempre por las mismas etapas (jabón, cepillo, enjuague, secado), sin que tengas que pedir cada una.

> ✋ **Para y piensa:** ¿qué tienes que hacer tú para que el CI corra?

<details>
<summary>Ver la respuesta</summary>

**Nada más que subir tu código** (`git push`). El CI arranca solo. Esa es justamente la gracia: no depende de que te acuerdes.

</details>

```practica
escribe :: Con tus palabras: ¿qué es el CI? :: Una máquina en internet que, cada vez que subo código, enciende una computadora limpia, descarga el código, lo instala desde cero, corre todas las revisiones y me avisa si algo falla.
elige :: ¿Qué quiere decir CI? :: Código Inteligente :: Integración Continua :: Control Interno
elige :: ¿Cuándo corre el CI? :: Cuando yo se lo pido :: Solo, cada vez que subo código :: Una vez por mes
vf :: La computadora del CI tiene instaladas las mismas cosas que mi Mac
vf :: Si una revisión falla, el CI me avisa
```

> 🔁 **Repaso:** el CI es una máquina que, en cada subida, enciende una computadora limpia, instala tu código desde cero, corre todas las revisiones y te avisa si algo falla.

## 2. ¿Para qué sirve?

> 🎙️ **El profesor:** "si yo ya corro las pruebas en mi Mac, ¿para qué otra máquina?" Buena pregunta. Te doy cinco razones y una historia real de tu app.

> 🌎 **Otro ejemplo:** Como un auditor externo que revisa las cuentas de tu negocio: no se olvida, no conoce tus atajos, avisa rápido, deja un informe guardado y te da tranquilidad.

| Para qué | Qué significa en tu app | 🌎 En la vida real |
|---|---|---|
| **Nadie se olvida** | Aunque tengas prisa, la máquina corre las 400 pruebas igual | El lavaplatos: aunque estés cansado, lava todo |
| **Máquina limpia** | Tu Mac tiene cosas que otros no tienen; la del CI empieza de cero | Cocinar tu receta en la cocina de un amigo |
| **Aviso rápido** | En unos 4 minutos sabes si rompiste algo | El detector de metales: en segundos |
| **Historial** | Ves qué subida rompió algo, y cuándo | Las cámaras de la tienda: puedes rebobinar |
| **Confianza** | Verde = el código cumple todas las reglas que escribiste | El sello de "revisado" de la revisión técnica |

### La historia real: el condimento escondido

En tu app, la copia limpia del CI **encontró un fallo que en tu Mac no se veía**. ¿Cómo puede ser? Tu Mac tenía cosas instaladas de antes que, sin que nadie lo supiera, **tapaban** el problema. En la máquina limpia, sin esas cosas, el fallo apareció.

> 🌎 **En la vida real:** en tu casa la receta sale bien porque tenías un condimento guardado que ni recordabas. En la cocina de tu amigo descubres que **la receta no lo menciona**: sin él, sale mal.

> 🌎 **Otro ejemplo:** Como un remedio que te sirve solo porque en tu casa tomas también otro sin darte cuenta: en otra casa, sin ese otro, no funciona. La máquina limpia descubre esas dependencias escondidas.

> ✋ **Para y piensa:** si otra persona descarga tu código en su computadora, ¿a quién se parece más su computadora: a tu Mac o a la del CI?

<details>
<summary>Ver la respuesta</summary>

**A la del CI.** Por eso, si pasa en el CI, es muy probable que funcione en la computadora de cualquiera.

</details>

```practica
escribe :: Explica la historia del "condimento escondido" con tus palabras. :: En mi Mac había cosas instaladas de antes que tapaban un fallo; la máquina limpia del CI no las tenía, así que el fallo apareció y se pudo arreglar.
elige :: ¿Qué razón es "puedo ver qué subida rompió algo y cuándo"? :: Confianza :: Historial :: Aviso rápido
elige :: ¿Cuánto tarda más o menos el CI de tu app? :: 4 segundos :: Unos 4 minutos :: 4 horas
vf :: Si todo pasa en mi Mac, seguro que pasa en cualquier computadora
```

> 🔁 **Repaso:** el CI no se olvida, usa una máquina limpia, avisa rápido, deja historial y da confianza. En tu app atrapó un fallo que la Mac escondía.

## 3. Lo que el CI NO hace

> 🎙️ **El profesor:** igual que con las pruebas, hay que saber los límites. Son tres, y uno de ellos confunde mucho.

1. **No prueba la app en un teléfono.** No sabe si un botón se ve feo o si la app abre en el iPhone.
   > 🌎 **En la vida real:** los rayos X ven lo que hay en la maleta, pero no saben si la ropa es bonita.
2. **No sabe si la regla es la correcta.** Solo revisa lo que las pruebas dicen.
   > 🌎 **En la vida real:** si la lista del aeropuerto olvidó prohibir algo, el guardia lo deja pasar.
3. **No publica en Google Play.** Solo **revisa**. Publicar lo haces tú. (Esto es lo que confunde.)
   > 🌎 **En la vida real:** el inspector de la fábrica aprueba el carro, pero no lo lleva a la concesionaria.

```practica
vf :: El CI publica la app en Google Play cuando todo está en verde
vf :: El CI puede detectar que un botón se ve feo
vf :: Si una regla está mal escrita en la prueba, el CI la deja pasar igual
escribe :: Nombra los tres límites del CI. :: No prueba en un teléfono real, no sabe si la regla es la correcta y no publica la app.
```

> 🔁 **Repaso:** el CI revisa, pero no ve la pantalla, no sabe si la regla es correcta y no publica.

## 4. ¿Dónde vive?

> 🎙️ **El profesor:** el CI no es magia: es **un archivo de texto** dentro de tu proyecto. Vamos a ver dónde está y en qué formato se escribe.

> 🌎 **En la vida real:** Es como la caja de instrucciones de un electrodoméstico: siempre está en el mismo lugar (adentro de la tapa), para que cualquiera la encuentre.

> 🌎 **Otro ejemplo:** Es como el horario de turnos pegado en la sala de empleados: no está en la cabeza de nadie, está escrito en un lugar fijo que todos consultan.

En tu app vive en el archivo **`.github/workflows/ci.yml`**.

- **`.github/workflows/`** es la carpeta donde GitHub **siempre** busca las instrucciones. El punto al principio de `.github` hace que sea una carpeta "oculta" en la Mac (en VS Code sí se ve).
- **`ci.yml`** es un archivo **YAML**: un formato de texto para configuraciones.
- La herramienta que lo ejecuta se llama **GitHub Actions**. Es gratis para proyectos como el tuyo.

### Cómo se lee YAML

YAML es muy simple: `nombre: valor`, y **la sangría** (los espacios a la izquierda) dice qué está dentro de qué.

```yaml
carro:
  marca: Toyota
  modelo: Etios
  colores:
    - plata
    - negro
```

Se lee: hay un `carro`; **dentro** del carro (porque está corrido hacia adentro) hay `marca`, `modelo` y `colores`; y dentro de `colores` hay una lista (cada `-` es un elemento).

> 🌎 **En la vida real:** la sangría del YAML es como el índice de un libro: "Capítulo 1" y, más metido hacia adentro, "1.1", "1.2". Lo que está más adentro pertenece a lo de arriba.

> 🌎 **Otro ejemplo:** Como la lista de una mudanza con sangría: "Cocina" y, corridos hacia adentro, "platos, ollas, vasos". Lo de adentro pertenece a la cocina.

> ⚠️ **Cuidado:** en YAML un espacio de más o de menos **cambia el significado** (o rompe el archivo). Por eso se usan siempre 2 espacios por nivel.

```practica
elige :: ¿Dónde busca GitHub las instrucciones del CI? :: En `src/` :: En `.github/workflows/` :: En `package.json`
elige :: ¿Qué formato tiene `ci.yml`? :: JSON :: YAML :: JavaScript
elige :: ¿Cómo se llama la herramienta de GitHub que ejecuta el CI? :: GitHub Pages :: GitHub Actions :: GitHub Desktop
vf :: En YAML, la sangría dice qué está dentro de qué
vf :: En YAML da igual poner un espacio de más
```

> 🔁 **Repaso:** el CI vive en `.github/workflows/ci.yml`, es YAML (nombre: valor, con sangría) y lo ejecuta GitHub Actions.

## 5. Las palabras del archivo

> 🎙️ **El profesor:** un archivo de CI usa siempre las mismas ocho palabras. Apréndelas con una sola imagen: **la cocina de un restaurante**.

> 🌎 **Otro ejemplo:** En un taller de carros: `on` es "cuando llega un carro"; los `jobs` son los mecánicos trabajando a la vez; los `steps` son los pasos de cada uno; `uses` es una herramienta comprada hecha; y `run` es una orden directa: "cambia el filtro".

| Palabra | Significado | 🌎 En el restaurante |
|---|---|---|
| `name` | El nombre que ves en GitHub | El nombre del plato en el menú |
| `on` | **Cuándo** se ejecuta | "Cada vez que llega un pedido" |
| `jobs` | **Trabajos**: grupos de revisiones. Cada uno en su máquina, al mismo tiempo | Los cocineros, cada uno en su estación |
| `runs-on` | En qué sistema corre (`ubuntu-latest` = Linux) | Qué cocina usa: de gas, eléctrica |
| `steps` | Los **pasos** de un trabajo, en orden. Si uno falla, los siguientes no corren | Los pasos de la receta: si se quemó el arroz, no sigues |
| `uses` | Usa una pieza ya hecha por otra persona (una "acción") | Una salsa de frasco, comprada hecha |
| `run` | Ejecuta un comando, como en la terminal | Una orden directa: "pica la cebolla" |
| `working-directory` | En qué carpeta corren los comandos | En qué mesa se trabaja |

Dos ideas clave, más despacio:
- **Los `jobs` corren al mismo tiempo** (en paralelo), cada uno en su propia máquina.
- **Los `steps` corren en orden**, uno detrás del otro, y **si uno falla, se corta** ese trabajo.

> ✋ **Para y piensa:** en un trabajo con los pasos "instalar → TypeScript → pruebas", falla TypeScript. ¿Corren las pruebas?

<details>
<summary>Ver la respuesta</summary>

**No.** Los pasos van en orden y, si uno falla, los siguientes no se ejecutan. (Los **otros trabajos** sí siguen, porque corren aparte.)

</details>

```practica
elige :: ¿Qué palabra dice CUÁNDO corre el CI? :: `jobs` :: `on` :: `run`
elige :: ¿Qué diferencia hay entre `uses` y `run`? :: Ninguna :: `uses` usa una pieza ya hecha; `run` ejecuta un comando :: `run` usa una pieza ya hecha; `uses` ejecuta un comando
vf :: Los `jobs` corren uno detrás del otro
vf :: Si un `step` falla, los siguientes pasos de ese trabajo no se ejecutan
elige :: `runs-on: ubuntu-latest` quiere decir… :: Que corre en un iPhone :: Que corre en una máquina con Linux :: Que corre en mi Mac
```

> 🔁 **Repaso:** `name`, `on` (cuándo), `jobs` (trabajos en paralelo), `runs-on` (sistema), `steps` (pasos en orden), `uses` (pieza hecha), `run` (comando), `working-directory` (carpeta).

## 6. El archivo de tu app, explicado

> 🎙️ **El profesor:** ahora leemos el archivo **real** de tu app, como hicimos con las funciones en el Tema 01. Es el más largo de la clase: tómate tu tiempo.

> 🌎 **En la vida real:** Leer el archivo real es como leer el reglamento interno de tu propia empresa: ya conoces las palabras, ahora ves las reglas de verdad.

> 🌎 **Otro ejemplo:** Es como leer la factura detallada de un taller: cada renglón es un trabajo que se hizo, con su nombre.

### El comienzo

> 🌎 **En la vida real:** Como el cartel de horario de una tienda: "abre cada vez que llega un cliente (push) y cuando alguien pide una cotización (pull request)".

> 🌎 **Otro ejemplo:** Como el timbre de una casa con dos botones: uno para visitas (push) y otro para el cartero (pull request). Los dos hacen sonar el mismo timbre.

```yaml
name: CI

on:
  push:
  pull_request:
```

- `name: CI` → el nombre que ves en GitHub.
- `on: push` → corre **en cada subida**.
- `pull_request` → corre también cuando alguien **propone** un cambio (lo ves en el Tema 06).

### Los 6 trabajos

Hoy (noviembre de 2026) el CI de tu app tiene **6 trabajos** que corren **al mismo tiempo**, cada uno en su máquina:

| # | Trabajo | Qué revisa |
|---|---|---|
| 1 | `app` | La app: tipos, diseño, ciclos, tamaño, secretos, pruebas y que se pueda armar para Android e iOS |
| 2 | `carton-android` | El cartón automático (Kotlin): sus pruebas |
| 3 | `functions` | El servidor (Cloud Functions): sus pruebas |
| 4 | `reglas` | Las reglas de seguridad de Firestore: que nadie lea datos ajenos |
| 5 | `panel` | Que el panel web se pueda armar |
| 6 | `webapp` | La web del usuario: que se pueda armar y que pasen sus pruebas |

> 🌎 **En la vida real:** en un taller grande, 6 mecánicos revisan tu carro **a la vez**: motor, frenos, luces, electricidad, carrocería y el GPS. Así tarda 4 minutos y no 20.

> 🌎 **Otro ejemplo:** Como una carrera de postas donde todos corren a la vez en carriles distintos: la carrera termina cuando llega el último, no la suma de todos.

> 📌 **Nota:** antes eran 5; el trabajo `webapp` se agregó cuando se hizo la web (Tema 13). Así crece un CI: cada parte nueva trae su revisión.

### Trabajo 1: `app` (el más grande)

Primero prepara la máquina:

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

- `actions/checkout@v4` → **descarga tu código** a la máquina limpia. (`@v4` es la versión de esa pieza.)
- `actions/setup-node@v4` → instala **Node.js 22**, el programa que ejecuta JavaScript fuera del navegador.
- `cache: npm` → guarda las librerías descargadas para la próxima vez, así tarda menos.
- `npm ci` → **instala las librerías exactamente** como están anotadas en `package-lock.json`. Si algo no coincide, **falla**.

> 🌎 **En la vida real:** `npm ci` es armar las piezas **exactamente** como dice la factura: si la factura dice tornillo de 10 mm y llegó uno de 11, se detiene. `npm install` sería un mecánico que dice "bah, el de 11 también sirve".

Después, las revisiones, en orden:

| Paso | Comando | Qué revisa | Qué atrapa |
|---|---|---|---|
| **TypeScript** | `npx tsc --noEmit -p .` | Que los tipos estén bien en toda la app | Pasar un número donde va un texto, una función que no existe |
| **Candado de diseño** | `npm run check:design` | Que ninguna pantalla tenga colores o medidas escritos a mano | Un `#FF0000` suelto en vez del color oficial |
| **Sin ciclos** | `npm run check:cycles` | Que ningún archivo dependa de otro que dependa del primero | A usa B, y B usa A: la app puede arrancar rota |
| **Tamaño** | `npm run check:size` | Que ningún archivo pase de 1.000 líneas | Archivos gigantes que nadie puede leer |
| **Secretos** | `npm run check:secrets` | Que no haya claves secretas dentro de la app | Una clave de pago o de IA que cualquiera podría robar |
| **Pruebas** | `npm test` | Las pruebas de la app (Jest) | Errores en dinero, fechas, San, combustible… |
| **Bundle** | `npx expo export ...` | Que la app se pueda **armar** para Android e iOS | Un archivo que falta, un import roto |

`--noEmit` quiere decir "**revisa, pero no generes archivos**": solo queremos saber si hay errores.

> 🌎 **En la vida real:** "sin ciclos" es evitar el absurdo de "para abrir la caja necesito la llave, y la llave está dentro de la caja".

### Trabajo 2: `carton-android`

> 🌎 **En la vida real:** Es como el técnico especialista en una marca extranjera: necesita sus propias herramientas (Java) y armar su banco de trabajo (`prebuild`) antes de revisar.

> 🌎 **Otro ejemplo:** Es como revisar el GPS de un auto importado: hace falta el programa de esa marca para conectarse y leerlo.

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

- El cartón automático (que lee las ofertas de Uber, 99 e inDrive y calcula R$/km) está escrito en **Kotlin**, que necesita **Java**. Por eso instala Java 17.
- `expo prebuild` **genera** la carpeta `android/` (en el repositorio no está; se crea en el momento).
- `./gradlew` es la herramienta que arma proyectos Android; `testDebugUnitTest` corre las pruebas del cartón.

### Trabajo 3: `functions`

> 🌎 **En la vida real:** Es como revisar la oficina central de un banco, no las sucursales: es otro edificio (la carpeta `functions`), con sus propias revisiones.

> 🌎 **Otro ejemplo:** Es como el inspector que se queda en la cocina del restaurante: no revisa el salón, solo la cocina.

```yaml
    defaults:
      run:
        working-directory: functions
    ...
      - run: npm ci
      - name: Pruebas del backend
        run: npm test
```

- `working-directory: functions` → todo corre dentro de la carpeta del **servidor**.
- Corre las pruebas del servidor: el Copiloto, los costos de IA, el catálogo de vehículos…

### Trabajo 4: `reglas`

- Prueba las reglas de seguridad con el **emulador de Firebase**: una **copia falsa** de la base de datos que corre en la máquina (necesita Java).
- Las pruebas intentan, por ejemplo, **leer los ingresos de otra persona**, y comprueban que la regla **lo impida**.

> 🌎 **En la vida real:** el cerrajero prueba en una **maqueta** del edificio si se puede abrir la puerta del vecino. Si la cerradura lo impide, la prueba pasa. Nadie toca a los inquilinos de verdad.

> 🌎 **Otro ejemplo:** Como un ladrón contratado (con permiso) que intenta abrir las cajas fuertes de un banco de prueba: si no puede, las cerraduras sirven.

### Trabajo 5: `panel`

> 🌎 **En la vida real:** Es como armar la vidriera de una tienda antes de abrir: si falta una pieza, mejor enterarse hoy que el día de la inauguración.

> 🌎 **Otro ejemplo:** Es como probar que un mueble se puede armar con las piezas de la caja, antes de llevarlo a casa del cliente.

```yaml
      - run: npm ci
      - name: Build del panel
        run: npm run build
```

Arma el panel web. Si no se puede armar, no se podría publicar.

### Trabajo 6: `webapp`

> 🌎 **En la vida real:** Es como revisar la segunda sucursal de un restaurante: usa la misma cocina central, así que se revisan las dos cosas, la sucursal y lo que comparte.

> 🌎 **Otro ejemplo:** Es como probar un control remoto universal: tiene que funcionar con tu televisor (la app) y con el de la sala (la web).

```yaml
      - run: npm ci
      - run: npm ci
        working-directory: webapp
      - name: Build de la web
        run: npm run build
        working-directory: webapp
      - name: Pruebas de la web
        run: npm test
        working-directory: webapp
```

- La web usa código de la app (`src/`), por eso instala **dos veces**: las librerías de la app y las de la web.
- Después **arma** la web y **corre sus pruebas**.

> ✋ **Para y piensa:** cambias un color a mano en una pantalla (`color: '#FF0000'`). ¿Qué trabajo y qué paso falla?

<details>
<summary>Ver la respuesta</summary>

El trabajo **`app`**, en el paso **Candado de diseño** (`check:design`).

</details>

```practica
elige :: ¿Cuántos trabajos tiene hoy el CI de tu app? :: 3 :: 5 :: 6 :: 10
elige :: ¿Qué hace `actions/checkout`? :: Instala Node :: Descarga tu código a la máquina limpia :: Corre las pruebas
elige :: ¿Por qué se usa `npm ci` y no `npm install`? :: Porque es más lindo :: Porque instala exactamente lo anotado en `package-lock.json` y falla si algo no coincide :: Porque no instala nada
elige :: Un archivo de 1.200 líneas, ¿qué paso lo atrapa? :: Secretos :: Tamaño (`check:size`) :: Bundle
elige :: ¿Por qué el trabajo del cartón instala Java? :: Porque la app está en Java :: Porque el cartón está en Kotlin, que necesita Java :: Porque GitHub lo exige
vf :: `--noEmit` quiere decir "revisa, pero no generes archivos"
vf :: Las pruebas de las reglas usan la base de datos real de producción
escribe :: ¿Qué es un "ciclo" entre archivos y por qué es malo? :: Cuando el archivo A usa a B y B usa a A; la app puede arrancar rota, como la llave que está dentro de la caja que abre.
```

> 🔁 **Repaso:** 6 trabajos en paralelo. `app` prepara la máquina (checkout, Node 22, `npm ci`) y revisa tipos, diseño, ciclos, tamaño, secretos, pruebas y bundle. Los demás: cartón (Kotlin), servidor, reglas (emulador), panel y web.

## 7. ¿Cómo se ve en GitHub?

> 🎙️ **El profesor:** todo esto lo puedes **ver**. Vamos a GitHub.

1. Entra a **github.com/DelvinSmart/copiloto-driver**.
2. Toca la pestaña **Actions**.
3. Ves una lista de subidas, cada una con un color:
   - ✅ **verde**: todo pasó.
   - ❌ **rojo**: algo falló.
   - 🟡 **amarillo**: todavía está corriendo.
4. Toca una subida para ver **los trabajos**, y toca un trabajo para ver **cada paso**. El paso que falló está en rojo y abajo está **el error**.

También se puede ver desde la terminal:

```bash
gh run list --limit 5
```

`gh` es la herramienta de GitHub para la terminal; `run list --limit 5` muestra las últimas 5 corridas del CI.

> 🌎 **En la vida real:** la pestaña Actions es el semáforo del lavadero de carros. `gh run list` es llamar por teléfono al lavadero para preguntar "¿cómo van los últimos 5?".

> 🌎 **Otro ejemplo:** Como el historial de pedidos de una app de delivery: cada pedido con su estado (en camino, entregado, cancelado), y entras a uno para ver el detalle.

```practica
elige :: ¿En qué pestaña de GitHub ves el CI? :: Code :: Actions :: Settings
elige :: Una corrida en amarillo 🟡 quiere decir… :: Que falló :: Que todavía está corriendo :: Que pasó
vf :: Para ver qué falló, entras a la corrida, después al trabajo, y buscas el paso en rojo
```

> 🔁 **Repaso:** pestaña Actions: verde pasó, rojo falló, amarillo corriendo. Entras a la corrida → trabajo → paso en rojo → error. Desde la terminal: `gh run list`.

## 8. ¿Cómo se construye un CI desde cero?

> 🎙️ **El profesor:** en una entrevista te pueden pedir: "¿cómo armarías un CI para un proyecto nuevo?". Esta es la receta, y es la misma que se usó en tu app.

1. **Decide qué revisar.** Empieza por lo más importante: que compile y que pasen las pruebas.
2. **Asegúrate de que cada revisión sea un comando** que funcione en tu terminal. Si en tu Mac se revisa con `npm test`, en el CI también.
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
6. **Agrega revisiones de a una.** Cada vez que encuentres un error que se repite, crea una revisión para que no vuelva. **Así nacieron el candado de diseño y el de ciclos** en tu app.

> 🌎 **En la vida real:** el reglamento de un gimnasio nuevo: empiezas con una regla ("todos firman al entrar") y, cada vez que se repite un problema ("dejan las pesas tiradas"), agregas otra.

> 🌎 **Otro ejemplo:** Como armar las reglas de una casa con hijos adolescentes: empiezas con una ("avisar si llegas tarde") y agregas otra cada vez que pasa algo que no quieres que se repita.

> ✋ **Para y piensa:** lee el CI mínimo de arriba y di en voz alta qué hace, línea por línea.

<details>
<summary>Ver la respuesta</summary>

Se llama CI; corre en cada push; tiene un trabajo llamado `pruebas` que corre en Linux; descarga el código, instala Node 22, instala las librerías exactas con `npm ci` y corre las pruebas con `npm test`.

</details>

```practica
escribe :: ¿Cuáles son los pasos para armar un CI desde cero? :: Decidir qué revisar; que cada revisión sea un comando que funcione en la terminal; crear .github/workflows/ci.yml; escribir el trabajo mínimo (checkout, Node, npm ci, npm test); subirlo y mirar Actions; agregar revisiones de a una.
vf :: Antes de ponerlo en el CI, el comando tiene que funcionar en mi terminal
elige :: ¿Cómo nacieron los candados de diseño y de ciclos? :: Venían con GitHub :: Por errores que se repetían en la app :: Los pidió Google Play
```

> 🔁 **Repaso:** decidir qué revisar → que sea un comando → crear `ci.yml` → trabajo mínimo → subir → agregar revisiones de a una, por cada error que se repite.

## 9. Cómo "piensa" el CI

> 🎙️ **El profesor:** este es el secreto más simple del CI, y te va a ayudar a entender todo: **el CI no entiende tu app**. Solo entiende **una cosa**.

Cada comando, al terminar, devuelve un número llamado **código de salida** (*exit code*):
- **`0`** significa "todo bien".
- **Cualquier otro número** significa "falló".

Si un paso devuelve algo distinto de 0, el CI lo marca en rojo y detiene ese trabajo. **Eso es todo lo que mira.**

Por eso scripts como `check:design` están hechos para **terminar con error** cuando encuentran un problema. El CI no sabe qué es un color: solo ve que el script terminó con un número distinto de 0.

Mira cómo lo hace el script de tamaño de tu app (está en portugués):

```js
for (const [file, lines] of big) console.error(`✖ ${file}: ${lines} linhas (máximo ${MAX_LINES})`);
// … y si hay archivos grandes, termina con error.
console.log(`✔ Tamanho: nenhum arquivo passa de ${MAX_LINES} linhas.`);
```

Si todo está bien, escribe "✔ Tamaño: ningún archivo pasa de 1000 líneas" y termina con 0.

> 🌎 **En la vida real:** el guardia que solo mira la luz del detector de metales: **verde o roja**. No sabe qué llevas en el bolsillo, solo si sonó.

> 🌎 **Otro ejemplo:** Como un semáforo: no sabe nada del tránsito ni de los conductores; solo muestra verde o rojo según la señal que recibe.

```practica
elige :: ¿Qué código de salida significa "todo bien"? :: 1 :: 0 :: 200
vf :: El CI entiende qué es un color mal puesto
vf :: Un script de revisión tiene que terminar con error cuando encuentra un problema
escribe :: Explica con tus palabras cómo "piensa" el CI. :: Solo mira el código de salida de cada comando: 0 es todo bien, cualquier otro número es que falló, y entonces marca el paso en rojo.
```

> 🔁 **Repaso:** el CI solo mira el código de salida: 0 = bien, otro número = falló. Por eso las revisiones terminan con error cuando encuentran un problema.

## Ejercicios

> 🎙️ **El profesor:** a la práctica. Si tienes la app, hazlos en la computadora. Si no, igual puedes responder 4, 5 y 6.

> 🌎 **En la vida real:** Es como recorrer la fábrica con el jefe y explicar con tus palabras qué hace cada máquina.

1. Abre `.github/workflows/ci.yml` en tu app y busca los 6 trabajos. Escribe con tus palabras qué hace cada uno.
2. Entra a la pestaña **Actions** y abre la última subida. ¿Cuánto tardó? ¿Cuál fue el trabajo más lento?
3. En la terminal de la app, corre `npm run check:size`. ¿Qué dice?
4. Si cambias un color a mano en una pantalla (`color: '#FF0000'`), ¿qué paso del CI falla?
5. ¿Por qué se usa `npm ci` y no `npm install`?
6. ¿Por qué el CI no puede detectar que un botón se ve feo?

<details>
<summary>Ver las correcciones explicadas</summary>

1. app (la app entera), carton-android (Kotlin del cartón), functions (servidor), reglas (seguridad de Firestore), panel (armar el panel web), webapp (armar y probar la web).
2. Suele tardar unos 4 minutos. El más lento normalmente es el del cartón o el de la app, porque instalan y arman más cosas.
3. Si todo está bien: `✔ Tamanho: nenhum arquivo passa de 1000 linhas.` ("ningún archivo pasa de 1000 líneas").
4. El **Candado de diseño** (`check:design`), en el trabajo `app`.
5. Porque `npm ci` instala exactamente lo anotado en `package-lock.json` y falla si algo no coincide; así la máquina del CI tiene las mismas versiones que tú.
6. Porque el CI solo corre comandos y pruebas, y ninguno mira la pantalla. Para eso se prueba en el teléfono (o con pruebas E2E, que tu app todavía no tiene).

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta, como frente al entrevistador.

> 🎤 **Entrevista:** "¿Qué es CI?"

<details>
<summary>Ver una buena respuesta</summary>

"Integración continua: en cada subida, una máquina limpia descarga el código, lo instala desde cero y corre las revisiones automáticas. Si algo falla, el equipo lo sabe en minutos. En mi app, una vez el CI encontró un fallo que mi Mac escondía porque tenía cosas instaladas de antes."

</details>

> 🎤 **Entrevista:** "¿Qué revisa el CI de tu app?"

<details>
<summary>Ver una buena respuesta</summary>

"Seis trabajos en paralelo: la app (tipos, candado de diseño, ciclos, tamaño, secretos, pruebas y que se pueda armar para Android e iOS), las pruebas en Kotlin del módulo de Android, las del servidor, las de las reglas de seguridad de Firestore con el emulador, que el panel web se pueda armar, y la web del usuario con sus pruebas."

</details>

> 🎤 **Entrevista:** "¿Qué diferencia hay entre CI y CD?"

<details>
<summary>Ver una buena respuesta</summary>

"CI revisa el código en cada subida. CD (entrega continua) además lo publica solo. Mi app tiene CI; la publicación la hago yo, después de probar en un teléfono real."

> 🌎 **En la vida real:** CI es el control de seguridad del aeropuerto; CD sería que, además, la maleta se suba **sola** al avión.

</details>

```practica
escribe :: ¿Qué diferencia hay entre CI y CD? :: CI revisa el código en cada subida; CD además lo publica automáticamente.
vf :: Tu app tiene CD: se publica sola en Google Play
```

> 🔁 **Repaso final de la clase:** sabes qué es el CI, para qué sirve, sus límites, dónde vive, cómo se lee el YAML, los 6 trabajos de tu app, cómo verlo en GitHub, cómo armar uno desde cero y que solo mira el código de salida. Próxima: **Tema 05, Mi primer cambio**.
