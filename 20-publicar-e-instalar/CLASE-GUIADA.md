# Clase guiada 20: Publicar e instalar

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) tiene la chuleta de comandos para tener a mano.

**Cómo estudiarla:** una o dos partes por día. Está basada en las guías de tu app (`copiloto-driver/docs/`: `GUIA_COMPLETA_PASO_A_PASO.md`, `COMO_INSTALAR_EN_TELEFONOS.md`, `COMO_SUBIR_ACTUALIZACION.md`, `SUBIR_ESTA_VERSION.md`) y en sus scripts (`scripts/`). Esas guías son el manual del día a día; esta clase te explica **por qué** cada paso es así.

**Lo que necesitas saber antes:** Temas 04 (CI), 06 (Git), 08 (Firebase) y 12 (cómo se publica la página de estudios).

> 📌 **Nota:** esta página es pública. Por eso aquí **no** van contraseñas, ni la huella de tu llave de firma, ni números de serie de tus teléfonos, ni cuentas de prueba. Esos datos viven solo en tu Mac y en tus guías privadas.

## 1. Las cuatro palabras que se confunden

> 🎙️ **El profesor:** Delvin, hay cuatro palabras que suenan todas a "mandar la app a algún lado": **compilar**, **commit**, **push** y **deploy**. Se confunden muchísimo. Si las separas bien, todo lo demás de esta clase se ordena solo.

> 🌎 **Otro ejemplo:** En una panadería: hornear el pan (compilar), anotar en la libreta qué horneaste (commit), mandar la libreta a la oficina (push) y llevar el pan a la tienda (deploy).

| Palabra | Qué hace | Dónde queda | 🌎 En la vida real |
|---|---|---|---|
| **Compilar** | **Traduce** el código a algo que el teléfono entiende | Un archivo en tu Mac (`.apk`, `.aab`, `.app`) | Traducir una receta escrita a mano a un libro impreso |
| **Commit** | Guarda **una foto** del proyecto, con un nombre | El historial **en tu Mac** | Sacar una foto de la obra y escribir la fecha al dorso |
| **Push** | **Sube** esas fotos a GitHub | GitHub (internet) | Mandar las fotos a la oficina central |
| **Deploy** | **Entrega** el resultado donde la gente lo usa | Un teléfono, Google Play, Firebase o GitHub Pages | Llevar el pastel terminado a la fiesta |

Dos frases para no olvidar:
- **Commit sin push = guardado solo en tu Mac.** Si la Mac se cae al agua, eso se pierde. Por eso van juntos: primero commit, enseguida push.
- **Compilar no es entregar.** Compilar te deja un archivo; el deploy es llevarlo a su lugar.

### "Subir" a dónde: el mapa completo

> 🌎 **En la vida real:** Es como los distintos destinos de un repartidor: la oficina (GitHub), la vidriera (Pages), la central (Firebase), tu casa para probar (tus teléfonos) y todas las tiendas del país (Google Play).

> 🌎 **Otro ejemplo:** Es como mandar cosas por correo: una carta, un paquete, un giro de dinero y una encomienda grande van por ventanillas distintas, aunque todo sea "mandar".

En tu vida de programador, "subir" puede querer decir cinco cosas distintas:

| Qué subes | A dónde | Con qué | Parte |
|---|---|---|---|
| El **código** de cualquier proyecto | GitHub | `git add` → `git commit` → `git push` | 2 |
| Tus **páginas** (estudios bíblicos, este mapa) | GitHub Pages | `git push` (y GitHub las publica) | 3 |
| El **servidor** de la app (funciones, reglas, panel, landing) | Firebase | `firebase deploy` | 4 |
| La **app para probar** | Tu Samsung o tu iPhone | `instalar-android.sh` / `instalar-iphone.sh` | 7 y 8 |
| La **app para todos** | Google Play | Un **AAB** subido en Play Console | 10 |

> ✋ **Para y piensa:** hiciste commit de un arreglo, pero no push. Esa noche te roban la Mac. ¿El arreglo está a salvo?

<details>
<summary>Ver la respuesta</summary>

**No.** El commit vive solo en la Mac. Solo lo que tiene **push** está en GitHub.

</details>

```practica
escribe :: Explica con tus palabras la diferencia entre compilar, commit, push y deploy. :: Compilar traduce el código a un archivo instalable; commit guarda una foto del proyecto en el historial de mi Mac; push sube esas fotos a GitHub; deploy entrega el resultado donde la gente lo usa (teléfono, Google Play, Firebase o Pages).
elige :: ¿Dónde queda un commit? :: En GitHub :: En el historial de tu Mac :: En Google Play
elige :: ¿Qué palabra es "entregar la app donde la gente la usa"? :: Compilar :: Commit :: Deploy
elige :: Para subir un cambio de las reglas de Firestore, ¿qué usas? :: Google Play :: `firebase deploy` :: Solo `git push`
vf :: Compilar ya deja la app en Google Play
vf :: Commit sin push queda guardado solo en tu Mac
```

> 🔁 **Repaso:** compilar (traducir), commit (foto en tu Mac), push (a GitHub), deploy (entregar). Y "subir" tiene cinco destinos: GitHub, Pages, Firebase, tus teléfonos y Google Play.

## 2. Subir el código a GitHub

> 🎙️ **El profesor:** esto ya lo estudiaste a fondo en el Tema 06. Aquí va la versión de todos los días, y los tres errores que más te van a salir.

> 🌎 **En la vida real:** Es como guardar tus fotos del teléfono en la nube: primero ves cuáles son nuevas, eliges, les pones nombre al álbum y las subes.

> 🌎 **Otro ejemplo:** Es como entregar un informe al jefe: primero lees si hay correcciones nuevas, haces lo tuyo, revisas, firmas y lo entregas.

### El ciclo de siempre

```bash
cd /Volumes/SSD_Desarrollo/Developer/copiloto-driver   # 0. ponerte en la carpeta del proyecto
git pull                                               # 1. traer lo último ANTES de cambiar nada
#                                                         2. hacer tu cambio y probarlo
git status                                             # 3. ver qué archivos cambiaron
git diff                                               #    …y qué líneas (se sale con q)
git add -A                                             # 4. marcar lo que entra en la foto
git commit -m "fix(ganhos): arreglé el cálculo de inDrive"   # 5. sacar la foto con su nombre
git push                                               # 6. subirla a GitHub
```

**¿Por qué `git pull` primero?** Porque puede haber en GitHub cosas que tu Mac no tiene: algo que publicaste desde el **panel** en el teléfono o en el iPad, o lo que subió otra sesión. Si las traes **antes** de cambiar, después el push entra sin pelear.

**¿`git add -A` o con nombres?** `-A` marca **todo** lo que cambió. Es cómodo, pero solo úsalo **después de mirar `git status`**: si aparece algo que no querías subir (un archivo de prueba, algo que tocaste sin querer), mejor marca **solo** lo tuyo, con su nombre:

```bash
git add js/panel-editor.js css/panel.css
```

Funciona **igual** en cualquier proyecto: `copiloto-driver`, `que-dice-la-biblia` o `Aprender`. Lo único que cambia es la carpeta del paso 0.

El nombre del commit dice **qué cambió y por qué** (Tema 06, parte 5), no "cambios" ni "actualización". Por ejemplo: `"Panel: el botón Publicar ahora avisa cuando falta la llave"`.

> 🌎 **En la vida real:** mirar qué hay en la mesa, elegir las fotos, pegarlas en el álbum con una nota, y mandar el álbum a la oficina.

> 🌎 **Otro ejemplo:** Como entrar a una oficina compartida: primero miras qué dejaron los demás en tu escritorio (pull), después trabajas, revisas, firmas y lo dejas en la bandeja de salida.

### Los tres errores de push más comunes

> 🌎 **En la vida real:** Es como un buzón lleno: si alguien ya dejó una carta antes, primero sacas la suya y después pones la tuya encima.

> 🌎 **Otro ejemplo:** Es como volver a una reunión que siguió sin ti: primero te pones al día y después hablas.

| Lo que dice | Qué pasó | Qué hacer |
|---|---|---|
| `rejected`, `fetch first` o `non-fast-forward` | Alguien guardó algo en GitHub después de tu último `git pull` (casi siempre tú, desde el panel) | `git pull --rebase` y después `git push` |
| Quieres **deshacer** un cambio que ya subiste | — | `git log --oneline -5` para ver el código del commit, y `git revert <código>` + `git push`. Crea un commit nuevo que lo deshace, sin borrar la historia (Tema 06, parte 10) |
| Pide usuario y contraseña | GitHub ya no acepta la contraseña normal | Hace falta un **token** (una llave especial), que se configura una vez |
| `fatal: not a git repository` | No estás en la carpeta del proyecto | Haz el `cd` a la carpeta y repite |

`git pull --rebase` = "baja lo que subieron los demás y pon mis commits **encima**, como si los hubiera hecho después". Así la historia queda recta y el push ya entra.

### ¿Está todo subido?

> 🌎 **En la vida real:** Es como revisar la bandeja de salida del correo: si está vacía, todo se mandó.

> 🌎 **Otro ejemplo:** Es como mirar la app del banco y ver "sin movimientos pendientes": todo está acreditado.

`git status` siempre lo dice. Si muestra **`nothing to commit, working tree clean`** y **`Your branch is up to date with 'origin/main'`**, no hay nada sin guardar ni sin subir.

> 💡 **Idea:** con tu página de estudios bíblicos esto pasa mucho: si guardaste algo desde el **panel**, el panel lo subió directo a GitHub. Si después quieres hacer push desde la Mac, primero tienes que **bajar** lo del panel. Es lo que hicimos con el `git pull`.

```practica
elige :: ¿Cuál es el orden de los comandos para subir código? :: push, commit, add :: status, add, commit, push :: commit, push, add
elige :: `git push` dice `rejected`. ¿Qué haces? :: Borras todo :: `git pull --rebase` y después `git push` :: Haces otro commit igual
elige :: Dice `fatal: not a git repository`. ¿Qué pasó? :: Se borró GitHub :: No estás en la carpeta del proyecto :: Falta internet
vf :: GitHub acepta la contraseña normal de tu cuenta para hacer push
escribe :: ¿Qué hace `git pull --rebase`? :: Baja lo que subieron los demás y pone mis commits encima, para que el push entre.
elige :: ¿Qué comando va antes de empezar a cambiar nada? :: `git push` :: `git pull` :: `git commit`
elige :: Subiste un cambio que rompió algo. ¿Cómo lo deshaces sin borrar la historia? :: `git reset --hard` :: `git revert <código>` y `git push` :: Borrando el repositorio
elige :: `git status` dice "working tree clean" y "up to date with 'origin/main'". ¿Qué significa? :: Que hay cambios sin subir :: Que todo está guardado y subido :: Que falta un pull
vf :: Antes de `git add -A` conviene mirar `git status`
```

> 🔁 **Repaso:** `cd` → **`pull`** → cambiar y probar → `status` / `diff` → `add` → `commit -m` → `push`. Si rechaza: `pull --rebase`. Para deshacer algo subido: `revert`. Si `status` dice "clean" y "up to date", todo está subido.

## 3. Subir tus páginas (GitHub Pages)

> 🎙️ **El profesor:** tus dos páginas viven en **GitHub Pages**, gratis y sin servidor propio. Pero se publican un poco distinto. Veamos las dos.

> 🌎 **En la vida real:** Es como tener tus páginas en una vidriera que da a la calle, gratis, y que se renueva sola cada vez que cambias la mercadería.

> 🌎 **Otro ejemplo:** Es como un tablero de anuncios público: lo que pegas en tu carpeta aparece en el tablero para que lo vea cualquiera.

### Tu página de estudios bíblicos (`que-dice-la-biblia`)

> 🌎 **En la vida real:** Es como un diario con dos formas de mandar notas a la imprenta: por la app del celular (el panel) o entregando el papel en persona (git push). Las dos terminan impresas igual.

> 🌎 **Otro ejemplo:** Es como hacer un pedido en un restaurante: desde la app o hablando con el mozo; los dos llegan a la misma cocina.

Hay **dos caminos** para que un cambio llegue a internet, y los dos terminan igual:

1. **Desde el panel** (`panel.html`): editas y tocas **Publicar**. El panel le manda el cambio a GitHub **con tu llave** (Tema 12, parte 10). No usas la terminal.
2. **Desde la Mac:** cambias archivos y haces `git add` → `git commit` → `git push`, como en la parte 2.

¿Cuál usar? Un **estudio** (textos, pasajes, fuentes) se cambia desde el **panel**, en cualquier aparato. El **código** (`js/`, `css/`, `panel.html`, `estudio.html`, `pdf.html`, `scripts/`) se cambia desde la **Mac**, con la SSD conectada.

Las dos cosas hacen lo mismo: dejan el cambio **en GitHub**, en la rama `main`. Y todo lo que llega a `main` se publica solo: **GitHub Actions** corre `publicar.yml` (Tema 12, parte 9):

```text
cambio en GitHub ──► GitHub Actions: arma el sitio, crea la lista de estudios y los PDF ──► GitHub Pages
                                                                   (en 1 o 2 minutos)
```

### Antes de subir código: pruébalo en tu Mac

> 🌎 **En la vida real:** Es como probarte la ropa en el probador antes de pagar: si no te queda, la cambias antes de salir de la tienda.

> 🌎 **Otro ejemplo:** Es como probar el pastel antes de llevarlo a la fiesta: si le falta azúcar, lo arreglas en casa.

En la página de estudios, antes del push, arma el sitio tú mismo:

```bash
cd /Volumes/SSD_Desarrollo/Developer/que-dice-la-biblia
node scripts/construir.mjs
```

Tiene que decir **`Candado de diseño: … ✓`** y **`Sitio listo en _site/`**. Si el candado dice que un color o un tamaño no sale de `css/motor.css` (Tema 14, parte 11), **corrígelo antes**: con ese error, GitHub tampoco publica. Para verlo en el navegador:

```bash
cd _site && python3 -m http.server 8000
```

Abre `http://localhost:8000`, prueba el cambio, y apágalo con **Control + C** (y `cd ..` para volver a la carpeta). Es el mismo servidor del Tema 18, parte 6.

### Después de subir: mira si se publicó

> 🌎 **En la vida real:** Es como el seguimiento de un paquete: "en camino", "entregado" o "devuelto". No basta con mandarlo; miras si llegó.

> 🌎 **Otro ejemplo:** Es como mirar el semáforo de un lavadero automático: amarillo lavando, verde listo, rojo algo falló.

Abre la pestaña **Actions** del repositorio (`github.com/DelvinSmart/que-dice-la-biblia/actions`), como en el Tema 04:

- 🟡 **Círculo amarillo:** todavía está publicando.
- ✅ **Visto verde:** listo. Recarga la página.
- ❌ **X roja:** no se publicó. Entra en la X para ver el error. **La página sigue como estaba antes**: nadie ve nada roto.

> 📌 **Nota:** el proyecto de la página tiene su propia guía, `COMO-SUBIR-CAMBIOS.md`, con estos mismos pasos para esa carpeta.

### Este mapa de estudios (`estudios`)

> 🌎 **En la vida real:** Es como un cartel de anuncios donde pegas tus hojas tal cual: no hay nadie que las acomode, se ven como las pegaste.

> 🌎 **Otro ejemplo:** Es como compartir una carpeta pública de Drive: lo que subes, se ve igual.

Más simple todavía: **no tiene Actions**. GitHub Pages sirve los archivos **tal cual** desde la rama `main`:

```bash
cd /Volumes/SSD_Desarrollo/Developer/Aprender
git add -A
git commit -m "Clase 20: publicar e instalar"
git push
```

En uno o dos minutos está en `delvinsmart.github.io/estudios/`. El archivo `.nojekyll` evita que GitHub convierta los `.md` en HTML (Tema 18, parte 9).

### Activar GitHub Pages en un repositorio nuevo (una sola vez)

> 🌎 **En la vida real:** Es como habilitar una vidriera la primera vez: hay que pedir el permiso una sola vez; después solo cambias lo que exhibes.

> 🌎 **Otro ejemplo:** Es como abrir una cuenta en un servicio: se configura una vez y después se usa todos los días.

1. El repositorio tiene que ser **público** (con la cuenta gratis).
2. En GitHub: **Settings → Pages**.
3. En **Source**, elige la rama (`main`) y la carpeta (`/` la raíz), o **GitHub Actions** si el proyecto tiene su propio `publicar.yml`.
4. Guarda. En un minuto te da la dirección.

### La caché

Si publicaste y ves la versión vieja, no es que falló: GitHub Pages deja que el navegador guarde la página **10 minutos**. Recarga sin caché con **Cmd + Shift + R** (Tema 14, parte 2).

> 🌎 **En la vida real:** GitHub Pages es una vidriera a la calle. La página de estudios tiene un **empleado** (Actions) que arma la vidriera cada vez que llega mercadería; el mapa pone la mercadería en la vidriera tal como llega.

> 🌎 **Otro ejemplo:** Como una foto vieja en la pantalla del teléfono que no se actualiza hasta que deslizas para refrescar.

```practica
elige :: Al tocar Publicar en el panel de estudios, ¿a dónde va el cambio primero? :: Directo a la página :: A GitHub, con tu llave; después Actions lo publica en Pages :: A Firebase
elige :: ¿Qué diferencia hay entre cómo se publican la página de estudios y este mapa? :: Ninguna :: La de estudios pasa por GitHub Actions (arma el sitio y los PDF); el mapa se sirve tal cual desde `main` :: El mapa usa Firebase
elige :: Publicaste y ves la versión vieja. ¿Qué haces primero? :: Volver a publicar :: Recargar sin caché con Cmd + Shift + R :: Borrar el repositorio
vf :: Con la cuenta gratis de GitHub, Pages solo publica repositorios públicos
vf :: Si guardaste desde el panel, después desde la Mac conviene hacer `git pull` antes de push
elige :: Antes de subir código de la página de estudios, ¿qué comando la arma y revisa el candado de diseño? :: `git push` :: `node scripts/construir.mjs` :: `npm test`
elige :: En la pestaña Actions sale una X roja. ¿Qué pasa con la página? :: Se rompió para todos :: No se publicó: sigue como estaba antes; entras en la X para ver el error :: Se borró
elige :: Cambiaste los textos de un estudio. ¿Desde dónde lo subes? :: Solo desde la Mac :: Desde el panel, con Publicar, en cualquier aparato :: Desde Firebase
```

> 🔁 **Repaso:** estudios bíblicos: estudios desde el panel, código desde la Mac (probado con `construir.mjs`) → Actions (mira el visto verde) → Pages. Mapa: `git push` → Pages directo. Pages se activa en Settings → Pages. Si ves lo viejo: Cmd + Shift + R.

## 4. Subir el servidor (Firebase)

> 🎙️ **El profesor:** hay cambios de la app que **no** necesitan pasar por Google Play. Son los que viven en el **servidor** (Tema 08). Se publican con `firebase deploy` y llegan a **todos al instante**.

| Qué cambiaste | Comando |
|---|---|
| Las **Cloud Functions** (el Copiloto, el panel, los cobros…) | `firebase deploy --only functions` |
| El **panel** web de administración | `firebase deploy --only hosting:admin` |
| La **landing** (la página de presentación) | `firebase deploy --only hosting:landing` |
| Las **reglas** de seguridad de Firestore | `firebase deploy --only firestore:rules` |

`--only` quiere decir "solo esto": así no publicas sin querer algo que no tocaste. `hosting:admin` y `hosting:landing` son los dos **sitios** que tiene tu proyecto en Firebase Hosting (están en `firebase.json`).

> ⚠️ **Cuidado:** esto **es producción**. Un deploy de reglas mal hecho puede abrir o cerrar los datos de todas las personas. Antes de un deploy: las pruebas (incluidas las de reglas) tienen que pasar, y lo decides tú.

> 🌎 **En la vida real:** cambiar el reglamento de la oficina central: llega a todas las sucursales al instante, sin que cada cliente tenga que actualizar nada en su teléfono.

> 🌎 **Otro ejemplo:** Como cambiar el precio en el sistema central de una cadena de tiendas: todas las cajas lo ven al momento, sin que cada cliente haga nada.

> 💡 **Idea:** si `firebase` no está instalado en la terminal, se usa `npx firebase-tools deploy ...` (como en el Tema 08): `npx` lo corre sin instalarlo.

```practica
elige :: Cambiaste una Cloud Function. ¿Hace falta subir una versión nueva a Google Play? :: Sí, siempre :: No: se publica con `firebase deploy --only functions` y llega a todos al instante :: Solo si es lunes
elige :: ¿Qué comando publica solo las reglas de Firestore? :: `firebase deploy` :: `firebase deploy --only firestore:rules` :: `git push`
elige :: ¿Para qué sirve `--only`? :: Para ir más rápido :: Para publicar solo lo que tocaste, sin llevarte otra cosa sin querer :: Para borrar
vf :: Un deploy de Firebase es producción: afecta a todas las personas
```

> 🔁 **Repaso:** servidor = `firebase deploy --only …` (functions, hosting:admin, hosting:landing, firestore:rules). Llega a todos al instante, sin Google Play. Es producción: con pruebas y con tu permiso.

## 5. APK y AAB: dos formatos de la misma app

> 🎙️ **El profesor:** ahora la app de Android. Hay dos archivos que salen de compilar, y la diferencia **importa mucho**.

| | **APK** | **AAB** |
|---|---|---|
| Para qué | **Probar** en tu teléfono | **Subir a Google Play** |
| ¿Se instala directo? | **Sí** | **No** |
| Lo usas | Todos los días | Solo al publicar |
| Comando de Gradle | `assembleRelease` | `bundleRelease` |
| Dónde queda | `android/app/build/outputs/apk/release/app-release.apk` | `android/app/build/outputs/bundle/release/app-release.aab` |

**El AAB no se puede instalar en un teléfono.** Es un **paquete** que Google abre para fabricar el APK justo para cada modelo de teléfono (su pantalla, su procesador, su idioma). Si intentas instalarlo, no pasa nada. No está roto: no es para eso.

**Gradle** es la herramienta que arma los proyectos Android (Tema 04, el trabajo del cartón). `./gradlew` es Gradle dentro del proyecto.

> 🌎 **En la vida real:** el APK es un traje **ya hecho** que te pones hoy. El AAB es **la tela con los moldes** que le mandas a la sastrería (Google), y ella corta un traje a la medida de cada cliente.

> 🌎 **Otro ejemplo:** Como la diferencia entre un mueble ya armado (lo pones en tu casa) y uno en caja plana para que lo arme la tienda de cada cliente.

### Mira la hora del archivo

> 🌎 **En la vida real:** Es como mirar la fecha de vencimiento de la leche antes de tomarla: si es vieja, no es la que acabas de comprar.

> 🌎 **Otro ejemplo:** Es como revisar la hora de un mensaje antes de responder: a veces estás leyendo uno viejo.

Antes de instalar un APK, comprueba **de qué hora es**:

```bash
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

`ls -lh` muestra el archivo con su tamaño y su fecha. Si la hora es **anterior** a tu último cambio, vas a instalar un APK **viejo** y probar algo que no es lo que arreglaste. (Es el Tema 07: verificar antes de suponer.)

```practica
elige :: ¿Qué archivo instalas en tu Samsung para probar? :: El AAB :: El APK :: Cualquiera
elige :: ¿Qué archivo subes a Google Play? :: El APK :: El AAB :: El código
elige :: ¿Qué comando de Gradle genera el AAB? :: `assembleRelease` :: `bundleRelease` :: `installRelease`
vf :: Si intentas instalar un AAB en el teléfono, se instala igual que un APK
escribe :: ¿Por qué hay que mirar la hora del APK antes de instalarlo? :: Porque si es anterior a mi último cambio, estaría probando una versión vieja y no lo que arreglé.
```

> 🔁 **Repaso:** APK = probar (se instala, `assembleRelease`). AAB = Google Play (no se instala, `bundleRelease`). Y siempre mira la hora del archivo.

## 6. La firma: la llave de tu app

> 🎙️ **El profesor:** esta parte es **la más importante de la clase**, porque un error aquí no tiene arreglo. Léela despacio.

> 🌎 **En la vida real:** Es como la firma registrada de una empresa en el banco: todo cheque tiene que llevarla, y si cambia, el banco no paga.

> 🌎 **Otro ejemplo:** Es como el sello oficial de un escribano: un documento sin ese sello no vale, por más perfecto que esté.

### Qué es la firma

Cada APK y cada AAB se **firma** con una **llave** (un archivo llamado *keystore*, protegido con contraseñas). La firma es **la identidad de tu app** ante Google y ante los teléfonos: dice "esta app la hizo el dueño de Copiloto Driver".

- **Una sola llave firma los dos**, el APK y el AAB. No hay que cambiar nada entre uno y otro: se elige sola.
- Si un día subieras un AAB firmado con **otra** llave, Google lo **rechazaría**: "assinado com a chave errada".

> 🌎 **En la vida real:** la firma es tu **firma de puño y letra en un cheque**. El banco (Google) solo paga los cheques con **tu** firma. Uno con otra firma, por más que el cheque esté perfecto, se rechaza.

> 🌎 **Otro ejemplo:** Como la huella digital de una persona: única, y el sistema solo abre la puerta con la tuya.

### Cómo elige el proyecto qué llave usar

> 🌎 **En la vida real:** Es como un portero que pregunta: "¿tiene tarjeta de socio?" Si la tiene, lo deja pasar por la entrada principal; si no, lo manda a la de visitas.

> 🌎 **Otro ejemplo:** Es como una cafetera que usa la cápsula original si está; si no, usa una genérica sin avisar.

En `android/app/build.gradle` hay una línea que decide:

```gradle
signingConfig project.hasProperty('COPILOTO_RELEASE_STORE_FILE')
                 ? signingConfigs.release
                 : signingConfigs.debug
```

Leída en castellano: **"¿existe la variable `COPILOTO_RELEASE_STORE_FILE`? Sí → firma con la llave de release (la tuya, la buena). No → firma con la llave de debug (una de juguete, que Google no acepta)."** Es el `condición ? a : b` que ya conoces.

Esa variable, y las contraseñas, viven en un archivo **de tu Mac**, `~/.gradle/gradle.properties`, **fuera del proyecto** (por eso nunca se suben a GitHub).

### El peligro silencioso

> 🌎 **En la vida real:** Es como una impresora que se queda sin tinta de color y sigue imprimiendo en blanco y negro sin avisarte: te enteras cuando ves el papel.

> 🌎 **Otro ejemplo:** Es como un GPS que pierde la señal y sigue mostrando la última posición: parece que todo anda bien, hasta que te pierdes.

Si ese archivo se pierde o se borran sus líneas, **el proyecto no te avisa**: cambia a la llave de debug **en silencio**, compila normal, y te enteras cuando Google rechaza la subida.

Ya pasó algo parecido: un `expo prebuild` (Tema 04: regenera la carpeta `android/`) **borró el bloque de firma** de release, y por un rato los APK salieron con la llave de debug. Por eso existe el plugin `plugins/withReleaseSigning.js`, que **vuelve a poner** ese bloque después de cada `prebuild`. Es un "candado" como los del Tema 11.

### Comprobarlo en 2 segundos

> 🌎 **En la vida real:** Es como revisar la firma de un contrato antes de entregarlo al banco.

> 🌎 **Otro ejemplo:** Es como mirar el sello del pasaporte antes de ir al aeropuerto: dos segundos que te ahorran un viaje perdido.

```bash
./scripts/verificar-firma.sh
```

Te dice si el APK y el AAB llevan **tu** llave (✅) o no (❌). **Pásalo siempre antes de subir un AAB a Google Play.** Si sale una ❌, no subas nada.

### Cuida la llave

**Si la pierdes, no puedes volver a actualizar Copiloto Driver nunca más.** Tendrías que publicar una app nueva desde cero, y la gente perdería todo.

- La llave **nunca** está dentro del proyecto (no se sube a GitHub; Tema 06, parte 9).
- Haz una **copia** de la llave **y** de `gradle.properties` en un disco externo o en tu Drive personal. **La llave sin las contraseñas no sirve de nada.**
- Si cambias de computadora, copia esas dos cosas a la nueva Mac, en las mismas carpetas.

> 🌎 **En la vida real:** perder la llave es como perder **el único sello notarial** de tu escribanía: ningún documento nuevo sería válido, y tendrías que abrir otra escribanía con otro nombre.

> 🌎 **Otro ejemplo:** Como la llave original de una caja fuerte: haces una copia y la guardas en otro lugar, por si pierdes la primera.

> ✋ **Para y piensa:** compilas un AAB, todo dice `BUILD SUCCESSFUL`, y lo subes. Google lo rechaza por "chave errada". ¿Qué pasó, y qué debiste hacer antes?

<details>
<summary>Ver la respuesta</summary>

Probablemente faltaba `gradle.properties` (o sus líneas), y el proyecto firmó **en silencio** con la llave de debug. Antes de subir debiste correr `./scripts/verificar-firma.sh`: te habría mostrado la ❌.

</details>

```practica
escribe :: ¿Qué es la firma de una app y por qué es tan importante? :: Es la identidad de la app, hecha con una llave (keystore) y sus contraseñas; Google solo acepta actualizaciones firmadas con la misma llave, y si se pierde no se puede actualizar nunca más.
elige :: ¿Hay que cambiar de llave entre el APK y el AAB? :: Sí, siempre :: No: una sola llave firma los dos, y se elige sola :: Solo para el AAB
elige :: Si falta la variable `COPILOTO_RELEASE_STORE_FILE`, ¿qué hace el proyecto? :: Da un error claro :: Firma en silencio con la llave de debug, que Google rechaza :: No compila
elige :: ¿Qué corres antes de subir un AAB a Google Play? :: `git status` :: `./scripts/verificar-firma.sh` :: `npm test` solamente
elige :: ¿Dónde viven la variable de la llave y las contraseñas? :: En el proyecto, en GitHub :: En `~/.gradle/gradle.properties`, en tu Mac, fuera del proyecto :: En Firebase
vf :: Para la copia de seguridad alcanza con guardar solo el archivo de la llave
vf :: `withReleaseSigning.js` vuelve a poner el bloque de firma después de cada `prebuild`
```

> 🔁 **Repaso:** una llave firma APK y AAB; si falta su configuración, el proyecto firma en silencio con la de debug; `verificar-firma.sh` antes de subir; y la llave + contraseñas, con copia fuera de la Mac.

## 7. Instalar en el Samsung

> 🎙️ **El profesor:** probar en tu teléfono es el paso que **nunca** se salta (Temas 02, 05 y 11: compilar no es funcionar). En Android hay varias formas.

> 🌎 **En la vida real:** Es como llevar el carro a probar a la calle de tu casa antes de un viaje largo: si algo suena raro, lo ves ahí.

> 🌎 **Otro ejemplo:** Es como un chef que prueba la comida antes de servirla al cliente.

### Lo rápido: el script

> 🌎 **En la vida real:** Es como el botón "lavado completo" del lavarropas: aprietas uno y hace todos los pasos.

> 🌎 **Otro ejemplo:** Es como pedir un combo en vez de cada cosa por separado.

Con el cable puesto y la **depuración USB aceptada** en el teléfono:

```bash
cd /Volumes/SSD_Desarrollo/Developer/copiloto-driver && ./scripts/instalar-android.sh
```

Compila e instala de un tirón.

### A mano, paso a paso

> 🌎 **En la vida real:** Es como armar un mueble siguiendo el instructivo paso por paso, para ver qué hace cada pieza.

> 🌎 **Otro ejemplo:** Es como cocinar sin la máquina de pan: haces tú cada paso, y entiendes por qué sale como sale.

```bash
cd android && ./gradlew assembleRelease && cd ..
ls -lh android/app/build/outputs/apk/release/app-release.apk
./scripts/verificar-firma.sh
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

- **`adb`** (*Android Debug Bridge*, "puente de depuración de Android") es la herramienta que habla con un teléfono Android desde la Mac.
- `install` instala; **`-r`** quiere decir **reinstalar encima**: conserva tus datos y tu sesión. Sin él daría error, porque la app ya está instalada.
- Tiene que decir **`Success`**.
- `&&` entre comandos = "si el anterior salió bien, sigue con el próximo" (si falla uno, se corta).

### Si hay dos aparatos conectados

> 🌎 **En la vida real:** Es como tener dos televisores con el mismo control: tienes que decirle a cuál apuntar.

> 🌎 **Otro ejemplo:** Es como llamar a una casa con dos teléfonos: pides por nombre a quién quieres.

Si están el Samsung **y** el emulador, `adb` no sabe a cuál instalar. Míralos y elige con `-s` (*serial*):

```bash
adb devices                       # lista los aparatos con su número de serie
adb -s <número-de-serie> install -r android/app/build/outputs/apk/release/app-release.apk
```

### Sin cable y sin terminal

> 🌎 **En la vida real:** Es como mandarle a alguien un instalador por WhatsApp: lo abre en su teléfono y lo instala él.

> 🌎 **Otro ejemplo:** Es como pasar una canción por Bluetooth: llega el archivo y se abre en el otro teléfono.

Copia el `app-release.apk` al teléfono (WhatsApp, Drive, Telegram) y ábrelo desde **Mis archivos → Descargas**. Android pedirá permiso para instalar de **origen desconocido**: **Ajustes → Permitir desde esta fuente → Instalar**. Ese aviso es normal: sale porque no viene de Play.

### Por Wi-Fi

Samsung y Mac en el **mismo Wi-Fi**.

**Emparejar (una sola vez):** en el Samsung, **Ajustes → Opciones de desarrollador → Depuración inalámbrica** → actívala → **"Vincular dispositivo con código de vinculación"**. Aparece un código de 6 números y una dirección como `192.168.0.15:37145`. En la terminal: `adb pair 192.168.0.15:37145` y escribes el código.

**Cada vez:** en "Depuración inalámbrica" mira la dirección de **"Dirección IP y puerto"** (es otra, por ejemplo `192.168.0.15:41235`), y:

```bash
adb connect 192.168.0.15:41235
./scripts/instalar-android.sh
```

Cada vez que apagas el Wi-Fi o reinicias el Samsung, **el puerto cambia**: mira el nuevo y repite `adb connect`.

> 🌎 **En la vida real:** `adb` es el cable de un mecánico que se conecta a la computadora del carro. `-r` es cambiar la radio sin borrar tus estaciones guardadas. Y emparejar por Wi-Fi es darle una llave a un vecino una sola vez: después solo tocas el timbre (`adb connect`).

> 🌎 **Otro ejemplo:** Como emparejar unos auriculares Bluetooth: la primera vez con código, y después se conectan solos.

```practica
elige :: ¿Qué hace `-r` en `adb install -r`? :: Borra la app :: Reinstala encima, conservando datos y sesión :: Reinicia el teléfono
elige :: ¿Qué es `adb`? :: Un emulador :: La herramienta que habla con un teléfono Android desde la Mac :: Un tipo de archivo
elige :: Hay dos aparatos conectados. ¿Qué haces? :: Desenchufar la Mac :: `adb devices` para verlos y `adb -s <serie> install …` para elegir :: Instalar en los dos
elige :: ¿Qué quiere decir `&&` entre dos comandos? :: Hazlos al mismo tiempo :: Si el primero salió bien, sigue con el segundo :: Hazlos al revés
vf :: El aviso de "origen desconocido" al instalar el APK a mano significa que la app tiene un virus
vf :: Por Wi-Fi, el puerto de `adb connect` cambia al reiniciar el Samsung
```

> 🔁 **Repaso:** `instalar-android.sh` (rápido) o `assembleRelease` + `adb install -r` (a mano); `adb devices` / `-s` con dos aparatos; sin cable, el archivo y "origen desconocido"; por Wi-Fi, `adb pair` una vez y `adb connect` cada vez.

## 8. Instalar en el iPhone

> 🎙️ **El profesor:** en el iPhone, un solo comando sirve para todo, con cable o sin él.

> 🌎 **En la vida real:** Es como instalar una app en el iPhone de un amigo para que la pruebe: necesita confiar en ti la primera vez, y el permiso dura poco.

> 🌎 **Otro ejemplo:** Es como prestar un pase de prueba de un gimnasio: sirve unos días y hay que renovarlo.

```bash
cd /Volumes/SSD_Desarrollo/Developer/copiloto-driver && ./scripts/instalar-iphone.sh
```

### Por cable

> 🌎 **En la vida real:** Es como cargar el teléfono con cable: lo conectas, aceptas "confiar en esta computadora", y empieza.

> 🌎 **Otro ejemplo:** Es como conectar un pendrive: la primera vez la computadora pregunta si confías.

1. Conecta el iPhone y **desbloquéalo**. Si pregunta "¿Confiar en esta computadora?" → **Confiar**.
2. Corre el comando. Termina con **✅ Listo** y la app se abre sola.

La primera vez tarda unos 10 minutos (arma todo desde cero); después, de 2 a 4.

### Por Wi-Fi

> 🌎 **En la vida real:** Es como emparejar el iPhone con el carro por Bluetooth: se configura una vez con el cable o el código, y después se conecta solo cuando están cerca.

> 🌎 **Otro ejemplo:** Es como una impresora Wi-Fi: la configuras una vez y después imprimes desde cualquier lugar de la casa.

**Preparación, una sola vez, con el cable puesto:** abre **Xcode** → **Window** → **Devices and Simulators** → elige tu iPhone → marca **"Connect via network"** → espera el icono de globo 🌐. Ya puedes quitar el cable.

**Cada vez:** iPhone y Mac en el **mismo Wi-Fi**, el iPhone **desbloqueado y con la pantalla encendida** (si se apaga a mitad, falla), y el mismo comando.

### Los 7 días

> 🌎 **En la vida real:** Es como un estacionamiento gratis por 7 días: después hay que renovar el ticket, o pagar el abono anual.

> 🌎 **Otro ejemplo:** Es como una prueba gratis de un servicio de streaming: vence, y la vuelves a activar.

La app en el iPhone **caduca a los 7 días**. **No es un fallo**: es el límite de la cuenta **gratis** de Apple. Cuando caduca, el iPhone dice que la app ya no está disponible. Solución: correr **el mismo comando**; el script saca un permiso nuevo solo, y tus datos no se pierden. Para quitar el límite hay que pagar la cuenta de desarrollador de Apple (99 USD al año).

### "Desarrollador no confiable"

La primera vez, el iPhone puede bloquear la app. Se arregla en **Ajustes → General → VPN y gestión de dispositivos** → toca tu cuenta → **Confiar**.

> 🌎 **En la vida real:** la cuenta gratis de Apple es un **pase de visitante de 7 días**: vence, y vuelves a la recepción por otro. La cuenta paga es el pase de empleado, de un año.

> 🌎 **Otro ejemplo:** Como cuando instalas un programa nuevo en la computadora y te pregunta "¿confías en este fabricante?": dices sí una vez.

> 💡 **Idea:** un error real de la guía de tu app: el comando de Wi-Fi estaba **mal escrito** (decía una letra suelta en vez de `./scripts/instalar-iphone.sh`), y por eso "a la IA le funcionaba y a ti no": pegabas otra cosa. Cuando algo funciona para uno y no para otro, compara **exactamente** qué corre cada uno (Tema 07).

```practica
elige :: ¿Qué comando instala en el iPhone por cable y por Wi-Fi? :: Dos distintos :: El mismo: `./scripts/instalar-iphone.sh` :: `adb install`
elige :: La app del iPhone dice que ya no está disponible después de una semana. ¿Qué pasó? :: Se rompió :: Venció el permiso de 7 días de la cuenta gratis de Apple; se vuelve a correr el comando :: Apple la borró para siempre
elige :: Sale "Desarrollador no confiable". ¿Qué haces? :: Desinstalas :: Ajustes → General → VPN y gestión de dispositivos → Confiar :: Reinicias la Mac
vf :: Por Wi-Fi, el iPhone tiene que estar desbloqueado y con la pantalla encendida durante la instalación
vf :: `adb` sirve para instalar en el iPhone
```

> 🔁 **Repaso:** `instalar-iphone.sh` con cable o Wi-Fi (preparar "Connect via network" una vez); permiso de 7 días con la cuenta gratis; "Confiar" la primera vez.

## 9. Los emuladores

> 🎙️ **El profesor:** un **emulador** (o **simulador**) es un teléfono **de mentira** dentro de la Mac. Sirve para ver cambios rápido sin tocar tu teléfono real. Tu app tiene un script aparte para ellos:

| Dónde | Comando |
|---|---|
| Emulador de Android, versión final | `./scripts/emuladores.sh final-android` |
| Emulador de iPhone, versión final | `./scripts/emuladores.sh final-iphone` |
| Emulador de iPhone, cambios al instante (modo Expo) | `./scripts/emuladores.sh expo` |

El **modo Expo** es el del Tema 05: cada cambio que guardas aparece solo, en segundos. Los scripts de los **teléfonos reales** (`instalar-android.sh`, `instalar-iphone.sh`) **ignoran** los emuladores aunque estén encendidos, y al revés.

> 🌎 **En la vida real:** el simulador de manejo de la autoescuela: practicas rápido y sin riesgo, pero el examen de verdad es en la calle (tu teléfono real).

> 🌎 **Otro ejemplo:** Como practicar penales en un videojuego de fútbol: rápido y sin riesgo, pero el partido de verdad es en la cancha.

```practica
elige :: ¿Qué es un emulador? :: Un teléfono viejo :: Un teléfono de mentira dentro de la Mac :: Un tipo de APK
elige :: ¿Qué modo muestra cada cambio al instante? :: `final-android` :: `expo` :: `final-iphone`
vf :: Probar en el emulador reemplaza probar en el teléfono real
```

> 🔁 **Repaso:** `emuladores.sh final-android`, `final-iphone` o `expo`. Ayudan, pero no reemplazan el teléfono real.

## 10. Publicar en Google Play

> 🎙️ **El profesor:** ahora sí, la app **para todos**. Son dos pasos: generar el AAB y subirlo a Play Console.

> 🌎 **En la vida real:** Es como lanzar un libro: preparas la edición final con su número, la mandas a la distribuidora, y la distribuidora la revisa antes de ponerla en las librerías.

> 🌎 **Otro ejemplo:** Es como inscribir un auto nuevo: llevas los papeles con el número correcto, el registro los revisa, y recién ahí sale a la calle.

### Paso 1: subir el número de versión

Google **rechaza** un archivo con un número de versión que ya subiste. Hay dos números, en `app.json` (al 16/11/2026: versión `1.1.0`, versionCode `100`):

| Número | Qué es | Ejemplo |
|---|---|---|
| `versionCode` | El número **interno**: cada subida tiene que ser **mayor** que la anterior | `100` → `101` |
| `version` | El número **que ve la gente** en la tienda | `"1.1.0"` → `"1.1.1"` |

El atajo hace todo solo: sube el `versionCode`, cambia la versión si le das una, genera el AAB, **revisa la firma** y lo copia a la carpeta `store-assets/` con un nombre claro:

```bash
./scripts/publicar-android.sh            # sube el versionCode +1
./scripts/publicar-android.sh 1.1.1      # además cambia la versión visible a 1.1.1
```

Al terminar dice **✅ Listo** y abre `store-assets`, con un archivo como `copiloto-driver-1.1.1-vc101.aab`. Si aparece **❌**, casi siempre es que falta la llave (parte 6).

> 💡 **Idea:** si lo haces a mano (sin el script), después de cambiar la versión en `app.json` hay que correr `npx expo prebuild --platform android --no-install` para que el proyecto Android **tome el número nuevo**, y recién ahí `./gradlew bundleRelease`. El script ya lo resuelve.

> 🌎 **En la vida real:** el `versionCode` es el **número de edición** de un diario: el kiosco no acepta dos veces la edición 22. La `version` es la fecha que se ve en la tapa.

> 🌎 **Otro ejemplo:** Como el número de serie de un billete: cada billete tiene uno distinto, y el banco rechaza un número repetido.

### Paso 2: subirlo en Play Console

> 🌎 **En la vida real:** Es como entregar un trabajo en la plataforma de la universidad: subes el archivo, escribes una nota y lo envías a revisión.

> 🌎 **Otro ejemplo:** Es como dejar un paquete en el correo: lo entregas en la ventanilla correcta, pones qué contiene, y esperas la confirmación.

1. Entra a **play.google.com/console** → **Copiloto Driver**.
2. Menú izquierdo: **Testar e lançar**.
   - En prueba cerrada: **Testes → Teste fechado** → tu pista (por ejemplo "Alpha").
   - Cuando esté publicada para todos: **Produção**.
3. **Criar nova versão**.
4. Arrastra el `.aab` nuevo al recuadro **App bundles**.
5. En **Notas da versão** escribe qué cambió, en portugués:

```text
<pt-BR>
Correções e melhorias.
</pt-BR>
```

6. **Avançar** → revisa que no haya errores rojos → **Salvar e publicar** (o **Enviar para revisão**).

Google **revisa** la actualización (de unas horas a 2 o 3 días). Cuando la aprueba, le llega a la gente como cualquier actualización.

| Mensaje en Play Console | Qué hacer |
|---|---|
| "O código de versão X já foi usado" | Subiste un archivo viejo: genera uno nuevo con el paso 1 |
| "Assinado com a chave errada" | No se firmó con tu llave: parte 6 |
| Avisos **amarillos** | Se leen y se puede seguir; los **rojos** sí bloquean |

### Un caso especial: los permisos delicados

> 🌎 **En la vida real:** Es como pedir permiso especial para tener un perro grande en un edificio: tienes que explicar por qué, mostrar que es tranquilo y dejar que el administrador lo conozca.

> 🌎 **Otro ejemplo:** Es como pedir un permiso de construcción para algo fuera de lo común: la municipalidad pide planos, fotos y una visita antes de aprobar.

El cartón automático necesita leer la pantalla de las apps de viajes, y en Android eso solo se puede con la **API de Accesibilidad** (pensada para personas ciegas o con poca visión). Google la vigila de cerca, porque es la misma puerta que usan los programas espía. Cuando la detecta, **detiene la publicación** y pide tres cosas: una **declaración** de qué lees y para qué, un **video** mostrando la función, y una **cuenta de prueba** para el revisor. Hasta responder, la versión queda parada. Tu app tiene todo eso preparado en sus guías privadas (`PERMISOS_EN_GOOGLE_PLAY.md`, `SUBIR_ESTA_VERSION.md`).

> ✋ **Para y piensa:** instalaste la versión nueva en tu Samsung por cable. ¿Los testers de Play ya la tienen?

<details>
<summary>Ver la respuesta</summary>

**No.** Instalar por cable solo llega a **tu** teléfono. A los demás les llega cuando subes el AAB a Play Console y Google lo aprueba.

</details>

```practica
elige :: ¿Por qué hay que subir el `versionCode` antes de cada AAB? :: Por estética :: Porque Google rechaza un número de versión que ya se subió :: Porque lo pide GitHub
elige :: ¿Qué número ve la gente en la tienda? :: `versionCode` :: `version` :: Ninguno
elige :: ¿Qué hace `./scripts/publicar-android.sh`? :: Instala en el iPhone :: Sube la versión, genera el AAB, revisa la firma y lo deja en `store-assets` :: Hace push
elige :: ¿En qué idioma se escriben las notas de versión de tu app? :: Español :: Portugués :: Inglés
vf :: Instalar la app por cable en tu teléfono también se la manda a los testers de Play
vf :: Los avisos amarillos de Play Console bloquean la publicación
escribe :: ¿Por qué Google pide una declaración, un video y una cuenta de prueba para tu app? :: Porque el cartón automático usa la API de Accesibilidad para leer la pantalla de las apps de viajes, y Google la vigila porque es la misma puerta que usan los programas espía.
```

> 🔁 **Repaso:** subir `versionCode` (y `version`) → `publicar-android.sh` → Play Console: Testar e lançar → Criar nova versão → AAB → notas en portugués → publicar → revisión de Google.

## 11. El orden real de un día de trabajo

> 🎙️ **El profesor:** juntemos todo. Este es el orden en que se trabaja en tu app, y es exactamente lo que te van a preguntar en una entrevista ("¿cómo llevas un cambio a producción?").

> 🌎 **En la vida real:** Es como la rutina de un panadero: amasa, hornea, prueba, empaca, y solo cuando todo está bien abre la tienda.

> 🌎 **Otro ejemplo:** Es como el orden de un vuelo: revisión, pasajeros a bordo, despegue, y nunca al revés.

1. **Se cambia el código** en la Mac.
2. **Se compila** → sale el APK.
3. **Se instala en tu Samsung** (y en el iPhone) → **tú lo pruebas**.
4. **Tú confirmas** que está bien. **Este paso no se salta.**
5. **Commit + push** → queda guardado y en GitHub, y corre el CI (Tema 04).
6. Cuando hay varias cosas acumuladas y dices "lanzamos": subir versión → **generar el AAB** → **verificar la firma** → subirlo a Google Play.
7. Si cambió el servidor: `firebase deploy --only …`.

### Si trabajas con una IA

> 🌎 **En la vida real:** Es como tener un asistente que prepara todo el paquete, pero no lo despacha hasta que tú lo apruebes.

> 🌎 **Otro ejemplo:** Es como un contador que prepara la declaración de impuestos, pero la firma y la presentas tú.

Si le pides el cambio a una IA en la carpeta del proyecto, ella puede hacer los pasos de traer, cambiar, probar, revisar y guardar, pero **solo hace el `git push` (y cualquier publicación) cuando tú se lo dices**. Así lo dicen los `AGENTS.md` de tus proyectos. Publicar es decisión tuya.

### El script de todo junto: `release.sh`

Tu app tiene un script que hace el ciclo completo, en orden, y **se detiene** si algo falla:

1. Revisa que **compile** (TypeScript de la app, del servidor y del panel).
2. Genera el **AAB** e instala en el **iPhone**, **en paralelo** (como `Promise.all`).
3. Te pide la **nota de versión** en portugués.
4. **Commit + push** (te pide el mensaje).
5. Te pregunta si quieres **deploy** de las Cloud Functions y del panel.

> 🌎 **En la vida real:** la lista de un piloto antes de despegar: siempre en el mismo orden, y si una revisión falla, no despega.

> 🌎 **Otro ejemplo:** Como el botón de "un toque" de algunas cafeteras: muele, calienta, sirve y limpia, en orden, y se detiene si falta agua.

```practica
escribe :: Di en orden los pasos de un día de trabajo, desde el cambio hasta Google Play. :: Cambiar el código, compilar el APK, instalarlo en el teléfono y probarlo, confirmar que está bien, commit y push, y cuando se lanza: subir versión, generar el AAB, verificar la firma y subirlo a Google Play; y firebase deploy si cambió el servidor.
elige :: ¿Qué paso nunca se salta? :: El commit :: Probar en el teléfono y confirmar que está bien :: El deploy de Firebase
elige :: Si en `release.sh` falla TypeScript, ¿qué pasa? :: Sigue igual :: Se detiene ahí, para corregir antes de seguir :: Sube el AAB igual
vf :: `release.sh` genera el AAB e instala en el iPhone al mismo tiempo
```

> 🔁 **Repaso:** cambiar → compilar → probar en el teléfono → confirmar → commit + push → (al lanzar) versión + AAB + firma + Play → (si toca) `firebase deploy`. `release.sh` lo hace en orden y se detiene si algo falla.

## 12. Cuando algo sale mal

> 🎙️ **El profesor:** la tabla de "luces del tablero" de esta clase. Tenla a mano.

| Qué dice | Qué hacer |
|---|---|
| "No encontré ningún iPhone" | Desbloquéalo. Por Wi-Fi: mismo Wi-Fi y "Connect via network" marcado. Si no, conéctalo con cable |
| "No encontré ningún Android real" | Acepta "Permitir depuración" en el teléfono. Por Wi-Fi: repite `adb connect` con el puerto nuevo |
| "firmas diferentes" / "signatures do not match" (Samsung) | La app instalada tiene otra firma: desinstálala (mantén el ícono → Desinstalar) y vuelve a correr el script. Se borra lo guardado solo en el teléfono; lo de la nube vuelve al iniciar sesión |
| "Hay otra compilación corriendo" / "database is locked" | Dos compilaciones a la vez: cierra Xcode o el simulador y repite |
| "No such file or directory" | El SSD se desconectó: conéctalo hasta verlo en Finder y repite |
| La compilación falló | Copia las últimas líneas **rojas**: ahí está el error (Tema 07) |
| Ves la página vieja después de publicar | Caché: Cmd + Shift + R |

> 🌎 **En la vida real:** antes de llamar al mecánico, revisa lo simple: ¿tiene nafta?, ¿está la llave puesta?, ¿el teléfono está desbloqueado? La mitad de los "errores" son eso.

> 🌎 **Otro ejemplo:** Como cuando el teléfono no carga: antes de cambiarlo, pruebas otro enchufe, otro cable y si estaba bien conectado.

```practica
elige :: El Samsung dice "signatures do not match". ¿Qué haces? :: Cambias la llave :: Desinstalas la app del Samsung y vuelves a correr el script :: Subes a Google Play
elige :: Sale "No such file or directory" al correr un script. ¿Qué revisas primero? :: El código :: Que el SSD esté conectado :: GitHub
elige :: La compilación falló. ¿Dónde está el error? :: En la primera línea verde :: En las últimas líneas rojas :: En ningún lado
vf :: "database is locked" suele ser porque hay dos compilaciones a la vez
```

> 🔁 **Repaso:** desbloquear, mismo Wi-Fi, aceptar depuración, desinstalar si las firmas no coinciden, una compilación a la vez, el SSD conectado, y leer las líneas rojas.

## Ejercicios

> 🎙️ **El profesor:** estos son para hacerlos de verdad. Ve despacio y lee lo que dice la terminal después de cada comando.

> 🌎 **En la vida real:** Es como la clase práctica de manejo en la calle: haces tú cada paso, con alguien al lado que te corrige.

1. **Subir este mapa:** cambia una palabra en cualquier lección de `Aprender`, haz `git add -A`, `git commit -m "…"` y `git push`, y mírala publicada en dos minutos (con Cmd + Shift + R).
2. **APK a mano:** genera el APK con `assembleRelease`, mira su hora con `ls -lh`, corre `verificar-firma.sh` e instálalo con `adb install -r`.
3. **iPhone:** instala con `./scripts/instalar-iphone.sh`. Si ya pasaron 7 días desde la última vez, fíjate cómo renueva el permiso solo.
4. **Sin computadora:** responde: ¿qué tienes que copiar a una Mac nueva para poder seguir publicando la app?

<details>
<summary>Ver las correcciones explicadas</summary>

1. Si no ves el cambio, es la caché (10 minutos). Si `push` dice `rejected`, haz `git pull --rebase` y repite.
2. Si `verificar-firma.sh` muestra ❌, **no sigas**: falta la configuración de la llave en `~/.gradle/gradle.properties`.
3. La primera instalación tarda unos 10 minutos; después, 2 a 4.
4. **El archivo de la llave (keystore) y `~/.gradle/gradle.properties`** (con la variable y las contraseñas), en las mismas carpetas. Y el proyecto, que se baja de GitHub con `git clone`.

</details>

```practica
escribe :: ¿Qué tienes que copiar a una Mac nueva para poder seguir publicando la app en Google Play? :: El archivo de la llave (keystore) y ~/.gradle/gradle.properties con la variable y las contraseñas, en las mismas carpetas; el proyecto se baja de GitHub.
```

## Para la entrevista

> 🎙️ **El profesor:** en voz alta.

> 🌎 **En la vida real:** Contar cómo publicas es como contarle a un cliente cómo entregas un trabajo: lo pruebas, lo guardas, lo revisan y recién después lo entregas.

> 🎤 **Entrevista:** "¿Cómo llevas un cambio a producción en tu app?"

<details>
<summary>Ver una buena respuesta</summary>

"Cambio el código, compilo un APK y lo pruebo en mi teléfono Android y en el iPhone; si funciona, hago commit y push, y el CI revisa todo en una máquina limpia. Cuando lanzo una versión, subo el número de versión, genero el AAB, compruebo que esté firmado con la llave de release y lo subo a Google Play, donde pasa por revisión. Los cambios del servidor van aparte, con un deploy de Firebase, y llegan a todos al instante."

</details>

> 🎤 **Entrevista:** "¿Qué diferencia hay entre un APK y un AAB?"

<details>
<summary>Ver una buena respuesta</summary>

"El APK se instala directo y lo uso para probar. El AAB es el formato que se sube a Google Play: Google lo usa para generar un APK optimizado para cada dispositivo, y no se puede instalar directo."

</details>

> 🎤 **Entrevista:** "¿Cómo manejas la llave de firma?"

<details>
<summary>Ver una buena respuesta</summary>

"Nunca está en el repositorio: la llave y sus contraseñas viven fuera del proyecto, con copia de seguridad. El proyecto elige la llave de release si encuentra su configuración; como si falta firma en silencio con la de debug, tengo un script que verifica la firma antes de cada subida, y un plugin que restaura la configuración de firma después de regenerar el proyecto Android."

</details>

```practica
escribe :: Explica en 3 frases cómo llevas un cambio a producción. :: Pruebo el APK en mis teléfonos y, si funciona, hago commit y push y el CI revisa. Para lanzar, subo la versión, genero el AAB, verifico la firma y lo subo a Google Play. Los cambios del servidor van con firebase deploy.
```

> 🔁 **Repaso final de la clase:** las cuatro palabras y los cinco destinos de "subir"; push y sus errores; tus páginas en GitHub Pages; el servidor con Firebase; APK y AAB; la firma y cómo cuidarla; instalar en el Samsung y en el iPhone; los emuladores; publicar en Google Play; el orden de un día de trabajo; y qué hacer cuando algo sale mal. Próxima, la última etapa: **Tema 19, Agentes de IA**.
