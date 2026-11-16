# Clase guiada 06: Git

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) tiene además la **chuleta completa** de comandos para tener a mano.

**Cómo estudiarla:** de 1 a 2 horas, en dos o tres días. La parte 7 es práctica en la terminal, con una carpeta de mentira: **no toca la app**.

**Lo que necesitas saber antes:** Tema 05 (ya usaste `git status` y `git restore`).

## 1. ¿Qué es Git?

> 🎙️ **El profesor:** Delvin, hasta hoy los commits y los push los hacía un script o una IA por ti. Hoy vas a entender **qué pasa por dentro** y a hacerlo tú mismo. Git es una de las herramientas que **todo** programador del mundo usa todos los días; en una entrevista lo dan por sabido.

### Git: la historia de tu código

**Git** es un programa que guarda **la historia** de tu código. Cada vez que guardas un punto de la historia (un **commit**), después puedes:
- **volver** a ese punto,
- ver **qué cambió**,
- y saber **quién** lo cambió y **por qué**.

> 🌎 **En la vida real:** los **puntos de guardado** de un videojuego. Antes de pelear con el jefe final, guardas la partida. Si pierdes, vuelves a ese punto; no empiezas de cero. Y tú decides cuándo guardar y le pones nombre: "antes del castillo".

### Git no es GitHub

Esto confunde a casi todos al principio:

| | Git | GitHub |
|---|---|---|
| Qué es | Un **programa** | Una **página web** |
| Dónde está | En tu computadora | En internet |
| Para qué | Guardar la historia | Guardar una **copia**, compartirla y correr el CI |

Git funciona **sin internet**: guarda la historia en tu Mac. GitHub es un lugar en la nube donde **subes una copia** de esa historia.

> 🌎 **En la vida real:** Git es el **álbum de fotos** que tienes en casa. GitHub es una **copia del álbum guardada en un banco**: si se te inunda la casa, la historia sigue a salvo, y además se la puedes mostrar a otros.

> ✋ **Para y piensa:** estás en un avión sin internet. ¿Puedes hacer commits?

<details>
<summary>Ver la respuesta</summary>

**Sí.** Git funciona en tu computadora. Lo que no puedes es **subirlos** a GitHub (`git push`) hasta tener internet.

</details>

```practica
escribe :: Con tus palabras: ¿qué es Git? :: Un programa que guarda la historia del código en puntos (commits): puedo volver a uno, ver qué cambió, quién y por qué.
escribe :: ¿Qué diferencia hay entre Git y GitHub? :: Git es un programa en mi computadora que guarda la historia; GitHub es una página en internet donde subo una copia, la comparto y corre el CI.
vf :: Git necesita internet para guardar un commit
vf :: GitHub guarda una copia de la historia y corre el CI
elige :: Un commit es como… :: un archivo borrado :: un punto de guardado del videojuego :: una contraseña
```

> 🔁 **Repaso:** Git guarda la historia en tu computadora (commits = puntos de guardado). GitHub es la copia en la nube, donde además corre el CI.

## 2. Las palabras

> 🎙️ **El profesor:** Git tiene su vocabulario, y en un equipo lo vas a oír todo el día: "haz un PR", "mergea la rama", "haz pull". Vamos con una sola imagen: **el diario de una obra de construcción**.

| Palabra | Significado | En tu app | 🌎 En la obra |
|---|---|---|---|
| **Repositorio** (repo) | La carpeta del proyecto con toda su historia | `copiloto-driver` | La carpeta de la obra, con todo desde el primer día |
| **Commit** | Un punto guardado, con un mensaje | `f333022 feat(ganhos,painel)…` | Una foto con fecha y nota |
| **Rama** (*branch*) | Una línea de trabajo separada | `feature/smart-camera` | Una maqueta aparte para probar una idea |
| **main** | La rama principal | `main` | La casa de verdad, la que se entrega |
| **Remoto** (*remote*) | La copia en GitHub | `origin` | La copia del diario en la oficina central |
| **Push** | Subir tus commits a GitHub | | Mandar tus fotos a la oficina |
| **Pull** | Bajar de GitHub lo que no tienes | | Traer las fotos que subió un compañero |
| **Staging** | La lista de cambios que entran en el próximo commit | | Las fotos que **elegiste** para la próxima página |
| **Diff** | Las diferencias entre dos versiones | | Dos fotos de la misma pared lado a lado |
| **Pull request** (PR) | Una propuesta para unir una rama con otra, para revisarla antes | | Llevarle la maqueta al jefe: "¿la pasamos a la casa?" |
| **Merge** | Unir una rama con otra | | Construir en la casa lo que salió bien en la maqueta |

Las dos que más cuestan:

- **Rama:** imagina que quieres probar una idea arriesgada. En vez de tocar la versión buena, abres una **rama**: una copia paralela donde trabajas tranquilo. Si sale bien, la unes (**merge**) a `main`; si sale mal, la tiras y `main` ni se enteró.
- **Staging:** Git no guarda automáticamente todo lo que cambiaste. **Tú eliges** qué cambios entran en el próximo commit. Ese "montón elegido" es el *staging*.

> ✋ **Para y piensa:** cambiaste 3 archivos, pero solo quieres guardar 1 en el próximo commit. ¿Qué palabra describe ese "montón elegido"?

<details>
<summary>Ver la respuesta</summary>

**Staging** (el área de preparación). Pones ahí solo el archivo que quieres, y el commit guarda solo eso.

</details>

```practica
elige :: ¿Qué es una rama? :: Una copia de seguridad en GitHub :: Una línea de trabajo separada, para probar sin tocar la principal :: Un error
elige :: ¿Qué es `origin`? :: La primera versión del código :: El nombre de la copia en GitHub (el remoto) :: Una rama
elige :: ¿Qué es un pull request? :: Bajar cambios de GitHub :: Una propuesta para unir una rama con otra, revisándola antes :: Borrar una rama
elige :: ¿Qué hace `merge`? :: Borra una rama :: Une una rama con otra :: Sube a GitHub
vf :: Push es subir a GitHub y pull es bajar de GitHub
vf :: Git guarda en el commit todo lo que cambiaste, aunque no lo hayas elegido
escribe :: ¿Qué es el diff? :: Las diferencias entre dos versiones: qué líneas se quitaron y cuáles se agregaron.
```

> 🔁 **Repaso:** repo, commit, rama, main, remoto (origin), push, pull, staging (lo elegido para el commit), diff, pull request y merge.

## 3. Cómo viaja un cambio

> 🎙️ **El profesor:** esta es la imagen más importante de la clase. Si la entiendes, entiendes Git. Un cambio pasa por **cuatro lugares**.

```text
 Tu archivo  ──git add──▶  Staging  ──git commit──▶  Historia en tu Mac  ──git push──▶  GitHub
 (editado)                (preparado)                (guardado)                          (copia + CI)
```

1. **Editas** un archivo. Git lo ve como "modificado".
2. **`git add`** lo pone en el staging: "este va en el próximo commit".
3. **`git commit`** guarda ese punto en la historia **de tu Mac**, con un mensaje.
4. **`git push`** lo sube a GitHub. Ahí corre el CI (Tema 04).

> 🌎 **En la vida real:** mandar un paquete por correo. **Editas** = preparas el regalo. **`git add`** = lo metes en la caja (todavía puedes sacar o agregar). **`git commit`** = cierras la caja con cinta y le pegas la etiqueta; está lista pero sigue en tu casa. **`git push`** = la llevas al correo, y allá la revisa la aduana (el CI).

> ✋ **Para y piensa:** hiciste `git commit` pero no `git push`. ¿Tu cambio está en GitHub?

<details>
<summary>Ver la respuesta</summary>

**No.** Está guardado en la historia **de tu Mac**. Hasta que hagas `git push`, GitHub no lo tiene (y el CI no corre).

</details>

```practica
escribe :: Di los cuatro pasos por los que viaja un cambio, con su comando. :: Edito el archivo; git add lo pone en el staging; git commit lo guarda en la historia de mi Mac; git push lo sube a GitHub, donde corre el CI.
elige :: ¿Qué comando guarda el punto en la historia de tu Mac? :: `git add` :: `git commit` :: `git push`
elige :: ¿Qué comando sube a GitHub? :: `git add` :: `git commit` :: `git push`
vf :: Después de `git commit`, el CI ya está corriendo
vf :: Si cambié un archivo pero no hice `git add`, no entra en el commit
```

> 🔁 **Repaso:** editar → `git add` (staging) → `git commit` (historia en tu Mac) → `git push` (GitHub + CI).

## 4. Tu app en números

> 🎙️ **El profesor:** mira tu propia historia. Esto es lo que había el 10 de noviembre de 2026.

- Tu app tenía **295 commits**: 295 puntos guardados.
- Trabajas en la rama **`feature/smart-camera`**.
- También existen `main` (la principal) y una rama vieja, `cursor/quita-foto-fondo-san-4084`.

Algunos commits:

```text
2ce8c04 chore(release): versionCode 93 (AAB 1.1.0)
f333022 feat(ganhos,painel): Minha empresa, textos de como registrar e foto por ano e cor
7fdd748 chore(release): versionCode 92 (AAB 1.1.0)
9630e4a feat(cores): cores do veículo adicionadas pelo painel
```

- `2ce8c04` es el **identificador** del commit (se llama *hash*). Es **único**: ningún otro commit del mundo tiene el mismo. Con él lo encuentras exactamente.
- El resto de la línea es el **mensaje**.

> 🌎 **En la vida real:** el identificador es el **número de seguimiento** de un paquete de Correios: único, y con él encuentras exactamente ese envío.

```practica
elige :: En `2ce8c04 chore(release): versionCode 93`, ¿qué es `2ce8c04`? :: El mensaje :: El identificador único del commit :: La fecha
vf :: Dos commits distintos pueden tener el mismo identificador
elige :: ¿En qué rama trabajas la app? :: `main` :: `feature/smart-camera` :: `master`
```

> 🔁 **Repaso:** cada commit tiene un identificador único (hash) y un mensaje. Tu app trabaja en la rama `feature/smart-camera`.

## 5. Cómo se escribe un buen mensaje

> 🎙️ **El profesor:** un mensaje de commit lo vas a leer **tú mismo dentro de seis meses**, buscando por qué hiciste algo. Escríbelo para ese Delvin del futuro.

Tu repositorio usa una convención llamada **Conventional Commits** (con los mensajes en portugués):

```text
tipo(área): resumen corto

Por qué se hizo el cambio, en 1 a 3 líneas.
```

| Tipo | Cuándo | 🌎 En el taller |
|---|---|---|
| `feat` | Algo nuevo (una función, una pantalla) | "Instalé aire acondicionado" |
| `fix` | Arreglar un error | "Arreglé la fuga de aceite" |
| `refactor` | Ordenar el código sin cambiar lo que hace | "Ordené el cajón de herramientas" |
| `test` | Agregar o arreglar pruebas | "Agregué una prueba de frenos" |
| `chore` | Mantenimiento (versiones, librerías) | "Cambio de aceite de rutina" |
| `docs` | Documentación | "Actualicé el manual" |

**Lo más importante:** el mensaje explica **por qué**, no solo qué. El "qué" ya se ve en el código; el "por qué" solo lo sabes tú.

- ❌ Malo: `cambié cosas`
- ✅ Bueno: `fix(tanque): la barra no bajaba al registrar gasto porque se sumaba el extra`

> ✋ **Para y piensa:** agregaste una pantalla nueva para registrar peajes. ¿Qué tipo usas?

<details>
<summary>Ver la respuesta</summary>

**`feat`** (algo nuevo). Por ejemplo: `feat(gastos): pantalla para registrar peajes`.

</details>

```practica
elige :: Arreglaste un error en el cálculo del San. ¿Qué tipo usas? :: `feat` :: `fix` :: `chore`
elige :: Cambiaste la versión de la app para publicarla. ¿Qué tipo? :: `feat` :: `fix` :: `chore`
elige :: Ordenaste un archivo en dos más chicos sin cambiar lo que hace. ¿Qué tipo? :: `fix` :: `refactor` :: `docs`
vf :: Lo más valioso de un mensaje es explicar el porqué
escribe :: Escribe un buen mensaje de commit para: arreglaste que el nombre de Mi empresa aceptaba 3 palabras. :: fix(ganhos): el nombre de Mi empresa aceptaba 3 palabras porque la constante estaba en 3; vuelve a 2 para que entre en los botones.
```

> 🔁 **Repaso:** `tipo(área): resumen` + el porqué. Tipos: feat, fix, refactor, test, chore, docs.

## 6. Los comandos, uno por uno

> 🎙️ **El profesor:** ahora los botones del control remoto. Cada comando hace **una** cosa. Te los explico y en la parte 7 los usas.

### `git status` — ver el estado

```bash
git status
```

Te dice **en qué rama estás** y **qué archivos cambiaste**. Es el comando que más vas a usar: **antes y después de todo**.

> 🌎 **En la vida real:** mirar el tablero del carro antes de arrancar: en qué marcha estás y qué luces están encendidas.

### `git diff` — ver qué cambió

```bash
git diff
```

Muestra línea por línea lo que cambiaste: las líneas con **`-`** (rojo) se quitaron; las con **`+`** (verde) se agregaron. Para salir, presiona **q**.

> 🌎 **En la vida real:** el control de cambios de Word: lo tachado en rojo, lo nuevo en verde.

### `git log` y `git show` — ver la historia

```bash
git log --oneline -10      # los últimos 10 commits, uno por línea
git show f333022           # qué cambió en ese commit
```

> 🌎 **En la vida real:** `git log` es hojear el álbum; `git show` es abrir una foto en grande.

### `git add` y `git commit` — preparar y guardar

```bash
git add archivo.ts          # prepara un archivo
git add -A                  # prepara todos los cambios
git commit -m "fix(app): corrige el texto del tanque"
```

`-m` quiere decir "el mensaje va aquí mismo, entre comillas".

### `git push` — subir

```bash
git push
```

### `git restore` — deshacer lo no guardado

```bash
git restore archivo.ts
```

⚠️ Borra tus cambios de ese archivo **para siempre** (lo viste en el Tema 05).

### Ramas

```bash
git branch                  # ver las ramas (la tuya tiene *)
git switch -c mi-rama       # crear una rama nueva y pasarte a ella
git switch main             # cambiarte a otra rama
```

`-c` quiere decir *create* (crear). `switch` y `checkout` hacen lo mismo al cambiar de rama; `switch` es el nombre nuevo y más claro.

> 🌎 **En la vida real:** las ramas son los carriles de una autopista: cada uno avanza por su lado sin chocar.

```practica
elige :: ¿Qué comando usas antes y después de todo? :: `git push` :: `git status` :: `git log`
elige :: En `git diff`, una línea con `+` es… :: una línea quitada :: una línea agregada :: un error
elige :: ¿Qué hace `git switch -c arreglo`? :: Borra la rama `arreglo` :: Crea la rama `arreglo` y te pasa a ella :: Sube la rama
elige :: ¿Cómo sales de la pantalla de `git diff`? :: Ctrl + C :: Presionando q :: Cerrando la terminal
vf :: `git log --oneline -10` muestra los últimos 10 commits
vf :: `git add -A` prepara todos los cambios
```

> 🔁 **Repaso:** `status` (estado), `diff` (qué cambió), `log`/`show` (historia), `add` + `commit -m` (preparar y guardar), `push` (subir), `restore` (deshacer, para siempre), `branch`/`switch` (ramas).

## 7. Práctica guiada (sin tocar la app)

> 🎙️ **El profesor:** ahora a la terminal. Vas a practicar en una **carpeta de mentira**, así no arriesgas nada. Escribe cada comando **tú mismo**, y después de cada uno mira qué pasó.

### Parte A: crear un repositorio

```bash
cd /Volumes/SSD_Desarrollo/Developer/Aprender/06-git
mkdir practica
cd practica
git init
```

- `cd` = entrar a una carpeta. `mkdir` = crear una carpeta.
- `git init` convierte la carpeta en un repositorio: desde ahora puede guardar historia.

Corre `git status`: dice que **no hay commits todavía** (*No commits yet*).

> 🌎 **En la vida real:** `git init` es comprar un cuaderno nuevo y escribir en la tapa "Diario de obra".

### Parte B: tu primer commit

1. Crea un archivo `notas.txt` con una línea: `Mi primera nota`.
2. `git status` → aparece **en rojo**: Git lo ve, pero no está preparado (*Untracked files*).
3. `git add notas.txt`
4. `git status` → ahora está **en verde**: preparado (*Changes to be committed*).
5. `git commit -m "docs: primera nota"`
6. `git log --oneline` → ves tu commit, con su identificador.

> 🌎 **En la vida real:** en rojo = la foto está tirada en la mesa; `git add` = la pones en la pila "para pegar"; `git commit` = la pegas en el álbum con su nota.

### Parte C: ver un cambio

1. Agrega otra línea a `notas.txt`: `Segunda nota`.
2. `git diff` → ves la línea nueva con **`+`**.
3. `git add -A` y `git commit -m "docs: segunda nota"`.
4. `git log --oneline` → **dos** commits.

### Parte D: deshacer

1. Borra **todo** el contenido de `notas.txt` y guarda.
2. `git status` → aparece **modificado**.
3. `git restore notas.txt` → el archivo **vuelve**. Ábrelo y compruébalo.

### Parte E: una rama

1. `git switch -c experimento`
2. Agrega una línea `Esto es un experimento` y haz commit.
3. `git switch master`. Abre `notas.txt`: la línea del experimento **no está**.
4. `git switch experimento`: la línea **vuelve**.

> 📌 **Nota:** en tu Mac, un repositorio nuevo empieza con la rama **`master`**. En GitHub y en tu app la principal se llama **`main`**. Es lo mismo con otro nombre.

> 🌎 **En la vida real:** probarte ropa en el probador: te pones la camisa nueva (la rama `experimento`); al salir (`git switch master`) vuelves con tu ropa de siempre. La camisa no desapareció: está colgada esperando.

### Parte F: unir

1. Ve a la principal: `git switch master`.
2. `git merge experimento`
3. Abre `notas.txt`: ahora la principal **tiene** la línea del experimento.

> 🌎 **En la vida real:** `git merge` es decidir comprar la camisa: ahora tu ropa de siempre la incluye.

**Así trabajan los equipos:** cada cosa nueva en su rama, sin dañar la principal, y se une cuando está lista.

> ✋ **Para y piensa:** en la Parte E, estando en `master`, ¿por qué no ves la línea del experimento si el commit existe?

<details>
<summary>Ver la respuesta</summary>

Porque ese commit está **en la rama `experimento`**, no en `master`. Cada rama tiene su propia línea de historia. Al hacer `merge` (Parte F), lo traes a `master`.

</details>

```practica
elige :: ¿Qué hace `git init`? :: Sube la carpeta a GitHub :: Convierte la carpeta en un repositorio :: Borra la carpeta
elige :: Un archivo nuevo aparece en rojo en `git status`. ¿Qué quiere decir? :: Que tiene un error :: Que Git lo ve pero no está preparado :: Que ya está en GitHub
elige :: Estás en `master` y quieres traer los commits de `experimento`. ¿Qué comando? :: `git switch experimento` :: `git merge experimento` :: `git push experimento`
vf :: `master` y `main` son el mismo concepto con distinto nombre
vf :: Al cambiar de rama, los commits de la otra rama se borran
escribe :: Cuenta lo que pasó en la Parte E con tus palabras. :: Creé la rama experimento, agregué una línea y la guardé; al volver a master la línea no estaba porque vive en la otra rama; al volver a experimento, apareció.
```

> 🔁 **Repaso:** `init` (crear repo), `add` + `commit` (guardar), `diff` (ver), `restore` (deshacer), `switch -c` (rama nueva), `switch` (cambiar), `merge` (unir).

## 8. Lo que el script de tu app hace por ti

> 🎙️ **El profesor:** ¿te acuerdas del script `./scripts/tareas.sh` que usabas para guardar? Ahora puedes ver qué hacía por dentro: **los mismos comandos que acabas de aprender**.

1. `git status` → para revisar que no subas un archivo prohibido (el AAB, la llave del keystore o la cuenta de servicio).
2. `git add -A`
3. `git commit` con el mensaje.
4. `git push`

> 🌎 **En la vida real:** el script era un **lavadero automático**: metías el carro y salía limpio. Ahora sabes qué pasa adentro: revisar (`status`), enjabonar (`add`), secar y poner el ticket (`commit`), sacarlo a la calle (`push`).

```practica
escribe :: ¿Qué hace el script de guardar de tu app, paso a paso? :: Revisa con git status que no haya archivos prohibidos, hace git add -A, hace git commit con el mensaje y hace git push.
vf :: El script hacía algo distinto a los comandos de Git
```

> 🔁 **Repaso:** el script de la app = `status` (revisar) + `add -A` + `commit` + `push`.

## 9. Lo que nunca se sube

> 🎙️ **El profesor:** esta parte es de **seguridad**, y es muy seria: hay cosas que **jamás** deben llegar a GitHub.

### El archivo `.gitignore`

Es la lista de lo que Git **no** debe guardar. En tu app, por ejemplo:
- `node_modules/` → las librerías (se reinstalan con `npm ci`).
- `android/` → se genera con `expo prebuild`.
- `store-assets/` → ahí se guardan los AAB (los archivos que se suben a Google Play).

> 🌎 **En la vida real:** la lista de cosas que **no van en la mudanza**: la basura, los muebles que se arman de nuevo allá, las cajas pesadas guardadas en otro lado.

### Las claves secretas

Nunca, por ninguna razón, se suben **claves secretas**, la **llave del keystore** (con la que se firma la app para Google Play) ni la **cuenta de servicio**.

¿Por qué es tan grave? Porque **una vez que algo está en GitHub, aunque lo borres después, queda en la historia**. Cualquiera que tenga el repositorio puede ir al commit viejo y verlo.

**Si alguna vez subes una clave por error: la cambias inmediatamente.** Borrarla no alcanza.

> 🌎 **En la vida real:** mandar la foto de la llave de tu casa a un grupo de WhatsApp. Aunque borres el mensaje, alguien ya pudo verla o guardarla. Lo único seguro es **cambiar la cerradura**.

> ✋ **Para y piensa:** subiste por error un archivo con una clave secreta, y en el commit siguiente lo borraste. ¿Estás a salvo?

<details>
<summary>Ver la respuesta</summary>

**No.** El commit anterior sigue en la historia, con la clave adentro. Hay que **cambiar la clave** (crear una nueva y anular la vieja).

</details>

```practica
elige :: ¿Para qué sirve `.gitignore`? :: Para borrar archivos :: Para decirle a Git qué archivos no guardar :: Para esconder la app
vf :: Si subo una clave y la borro en el commit siguiente, ya no hay peligro
vf :: `node_modules/` no se sube porque se puede reinstalar con `npm ci`
escribe :: ¿Qué haces si subiste una clave secreta por error? :: La cambio inmediatamente (creo una nueva y anulo la vieja), porque aunque la borre queda en la historia.
```

> 🔁 **Repaso:** `.gitignore` = lo que no se guarda. Las claves nunca se suben; si pasa, se cambian, porque la historia no olvida.

## 10. Los comandos de rescate

> 🎙️ **El profesor:** la chuleta completa está en el [resumen](LECCION.md). Aquí te explico los que te sacan de apuros, porque son los que más asustan y los que más preguntan en entrevistas.

### Deshacer, del más seguro al más peligroso

| Comando | Qué hace | ¿Se pierde algo? |
|---|---|---|
| `git restore --staged archivo` | Saca un archivo del staging | No: el cambio sigue en el archivo |
| `git revert <commit>` | Crea un commit **nuevo** que deshace otro | No: la historia queda completa |
| ⚠️ `git restore archivo` | Descarta los cambios de un archivo | Sí, esos cambios |
| ⚠️ `git reset --hard` | Vuelve todo al último commit | Sí, **todo** lo no guardado |
| ⚠️ `git clean -fd` | Borra archivos nuevos que Git no conoce | Sí, esos archivos |

**La regla:** si te equivocaste en algo **que ya subiste** a GitHub, usa **`git revert`**, no `reset`. `revert` **agrega** un arreglo; `reset` **reescribe** la historia y le complica la vida a cualquiera que ya la tenía.

> 🌎 **En la vida real:** `git revert` es como el banco que **no borra** un cobro equivocado del extracto, sino que agrega una línea de devolución. La historia queda completa y honesta.

### Guardar a un lado: `stash`

Estás a mitad de algo y necesitas cambiar de rama urgente, sin hacer commit:

```bash
git stash       # guarda tus cambios a un lado y deja la carpeta limpia
git stash pop   # los devuelve (y los quita de la lista)
```

> 🌎 **En la vida real:** estás cocinando y tocan el timbre. Pones la comida en la nevera (`stash`), atiendes, y después la sacas (`stash pop`).

### `fetch` y `pull`

- `git fetch` → **mira** qué hay de nuevo en GitHub, **sin** mezclarlo con lo tuyo.
- `git pull` → baja **y mezcla**. Es decir: `git pull` = `git fetch` + `git merge`.

> 🌎 **En la vida real:** `fetch` es mirar el buzón sin abrir las cartas; `pull` es abrirlas y mezclarlas con tus papeles.

### Investigar: `blame` y `bisect`

- `git blame archivo` → quién cambió cada línea y en qué commit.
- `git bisect` → busca **por mitades** en qué commit apareció un error. Entre 300 commits, lo encuentra en unos **8 intentos**.

> 🌎 **En la vida real:** `bisect` es buscar una palabra en el diccionario abriéndolo por la mitad, después por la mitad de la mitad…

Prueba en tu app (**sin riesgo, solo mira**):

```bash
git blame src/data/workAppsCatalog.ts | grep my_company
```

```practica
elige :: Subiste a GitHub un commit con un error. ¿Qué usas para deshacerlo? :: `git reset --hard` :: `git revert` :: `git clean -fd`
elige :: ¿Qué hace `git stash`? :: Borra los cambios :: Guarda los cambios a un lado y deja la carpeta limpia :: Sube los cambios
elige :: `git pull` es igual a… :: `git push` + `git commit` :: `git fetch` + `git merge` :: `git add` + `git commit`
vf :: `git restore --staged archivo` borra el cambio para siempre
vf :: `git bisect` busca por mitades el commit que trajo un error
escribe :: ¿Por qué se prefiere `revert` y no `reset` para algo que ya está en GitHub? :: Porque revert agrega un commit que deshace el otro sin borrar historia; reset reescribe la historia y rompe las copias de quienes ya la tenían.
```

> 🔁 **Repaso:** para algo ya subido, `revert`. `stash` guarda a un lado. `pull` = `fetch` + `merge`. `blame` dice quién cambió cada línea; `bisect` busca el commit culpable por mitades.

## Ejercicios

> 🎙️ **El profesor:** si tienes la app, hazlos en su carpeta. Las preguntas 4, 5 y 6 se responden sin computadora.

1. Haz la práctica completa (Partes A a F) de la parte 7.
2. En la carpeta de la app, corre `git log --oneline -5` y explica con tus palabras qué hizo cada commit.
3. Corre `git show 9630e4a --stat`. ¿Cuántos archivos cambió el commit de los colores del panel?
4. ¿Qué diferencia hay entre `git commit` y `git push`?
5. Si cambiaste un archivo pero no hiciste `git add`, ¿entra en el commit?
6. ¿Para qué sirve una rama?

<details>
<summary>Ver las correcciones explicadas</summary>

1. Si al final `git log --oneline` muestra 3 commits (primera nota, segunda nota, experimento) y `notas.txt` en `master` tiene las tres líneas, lo hiciste bien.
2. Lee el tipo y el área: `chore(release)` es preparar una versión; `feat(...)` es algo nuevo en esa área.
3. **20 archivos.** (`--stat` muestra la lista de archivos cambiados y cuántas líneas en cada uno.)
4. `git commit` guarda en tu Mac; `git push` sube a GitHub.
5. **No.** Solo entra lo que está preparado con `git add`.
6. Para trabajar en algo nuevo sin dañar la línea principal. Si sale bien, se une; si sale mal, se descarta.

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta.

> 🎤 **Entrevista:** "¿Cómo trabajas con Git?"

<details>
<summary>Ver una buena respuesta</summary>

"Trabajo en una rama, hago commits pequeños con mensajes que explican el porqué (uso Conventional Commits), y al subir, el CI revisa todo. Antes de cada commit miro `git status` y `git diff` para saber exactamente qué estoy guardando."

</details>

> 🎤 **Entrevista:** "¿Qué haces si subiste algo por error?"

<details>
<summary>Ver una buena respuesta</summary>

"Si es código, hago un commit nuevo que lo corrige con `git revert`, sin reescribir la historia. Si es una clave secreta, la cambio inmediatamente, porque aunque la borre, queda en la historia."

</details>

> 🎤 **Entrevista:** "¿Qué diferencia hay entre merge y rebase?" *(pregunta frecuente)*

<details>
<summary>Ver una buena respuesta</summary>

"Los dos unen el trabajo de dos ramas. Merge crea un commit de unión y deja la historia tal como pasó. Rebase reescribe tus commits como si hubieras empezado desde la punta de la otra rama, y deja una historia más recta. No hago rebase de commits que ya subí y otros usan, porque reescribe la historia."

> 📌 **Nota:** `rebase` no está en esta clase; con esta respuesta alcanza para una entrevista.

</details>

```practica
escribe :: ¿Qué miras antes de cada commit y por qué? :: git status y git diff, para saber exactamente qué archivos y qué líneas voy a guardar y no subir nada por error.
```

> 🔁 **Repaso final de la clase:** sabes qué es Git y en qué se diferencia de GitHub, su vocabulario, cómo viaja un cambio, cómo escribir un buen mensaje, los comandos del día a día, cómo crear ramas y unirlas, qué nunca se sube y cómo rescatarte con `revert`, `stash`, `fetch`, `blame` y `bisect`. Próxima: **Tema 07, Leer errores**.
