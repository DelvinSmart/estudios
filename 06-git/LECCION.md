# Tema 06: Git

> 🌎 **En la vida real:** hasta hoy alguien te llevaba la libreta de cuentas (el script). Hoy aprendes a llevarla tú: anotar, guardar y mandar la copia al contador.

Hasta hoy, los commits y los push los hacía el script o Claude. En este tema vas a entender qué pasa por dentro y a hacerlo tú mismo.

**Antes de empezar:** Tema 05.

**Tiempo:** de 1 a 2 horas.

## 1. ¿Qué es Git?

> 🌎 **En la vida real:** Git es como los **puntos de guardado** de un videojuego. Antes de pelear con el jefe final, guardas la partida. Si pierdes, vuelves a ese punto; no empiezas el juego de cero. Y tú decides cuándo guardar y le pones nombre: "antes del castillo".
>
> **Git vs. GitHub**: Git es el **álbum de fotos** que tienes en casa, con la historia de tu familia. GitHub es una **copia del álbum guardada en un banco**: si se te inunda la casa, la historia sigue a salvo, y además puedes mostrársela a otros.

**Git** es un programa que guarda **la historia** de tu código. Cada vez que guardas un punto de la historia, puedes volver a él, ver qué cambió y quién lo cambió.

**Comparación:** es como el historial de un documento de Google Docs, pero tú decides cuándo se guarda cada versión y le pones un título.

**GitHub** es otra cosa: es una **página en internet** donde se guarda una copia de tu historia. Git está en tu Mac; GitHub está en la nube.

| | Git | GitHub |
|---|---|---|
| Qué es | Un programa | Una página web |
| Dónde está | En tu computadora | En internet |
| Para qué | Guardar la historia | Guardar una copia, compartirla y correr el CI |

## 2. Las palabras

> 🌎 **En la vida real:** todo es como llevar un diario de obra en una construcción:
> - **Repositorio** = la carpeta de la obra, con todas las fotos y anotaciones desde el primer día.
> - **Commit** = una foto con fecha y nota: "15/11: terminamos el piso de la cocina".
> - **Rama** = probar una idea en una maqueta aparte ("¿y si la cocina fuera abierta?") sin tocar la casa de verdad.
> - **main** = la casa de verdad, la que se entrega al cliente.
> - **Remoto** = la copia del diario que tiene la oficina central.
> - **Push** = mandar tus fotos nuevas a la oficina.
> - **Pull** = traer de la oficina las fotos que subió otro compañero.
> - **Staging** = el montón de fotos que **elegiste** para pegar en la próxima página del diario. Tomaste 20, pero pegas solo 5.
> - **Diff** = poner dos fotos de la misma pared lado a lado y señalar qué cambió.
> - **Pull request** = llevarle la maqueta al jefe de obra: "mire, ¿la pasamos a la casa de verdad?".
> - **Merge** = construir en la casa lo que salió bien en la maqueta.

| Palabra | Significado | En tu app |
|---|---|---|
| **Repositorio** (repo) | La carpeta del proyecto con toda su historia | `copiloto-driver` |
| **Commit** | Un punto guardado de la historia, con un mensaje | `f333022 feat(ganhos,painel): Minha empresa...` |
| **Rama** (branch) | Una línea de trabajo separada | `feature/smart-camera` |
| **main** | La rama principal | `main` |
| **Remoto** (remote) | La copia en GitHub | `origin` |
| **Push** | Subir tus commits a GitHub | |
| **Pull** | Bajar de GitHub los commits que no tienes | |
| **Staging** (área de preparación) | La lista de cambios que van a entrar en el próximo commit | |
| **Diff** | Las diferencias entre dos versiones | |
| **Pull request** (PR) | Una propuesta para unir una rama con otra, para revisarla antes | |
| **Merge** | Unir una rama con otra | |

## 3. Cómo viaja un cambio

> 🌎 **En la vida real:** es como mandar un paquete por correo:
> 1. **Editas** = preparas lo que vas a enviar.
> 2. **`git add`** = lo metes en la caja. Todavía puedes sacar o agregar cosas.
> 3. **`git commit`** = cierras la caja con cinta y le pegas la etiqueta ("Regalo de cumpleaños para mamá"). Ya está lista, pero sigue en tu casa.
> 4. **`git push`** = la llevas al correo. Ahora existe una copia lejos de tu casa, y allí la revisa el CI, como la aduana.

```
 Tu archivo  ──git add──▶  Staging  ──git commit──▶  Historia en tu Mac  ──git push──▶  GitHub
 (editado)                (preparado)                (guardado)                          (copia + CI)
```

1. **Editas** un archivo.
2. `git add` lo pone en la lista del próximo commit.
3. `git commit` guarda ese punto en la historia, con un mensaje.
4. `git push` lo sube a GitHub. Ahí corre el CI (Tema 04).

## 4. Tu app en números

> 🌎 **En la vida real:** **295 commits** son como 295 páginas del diario de la obra. El código `2ce8c04` es como el **número de seguimiento** de un paquete de Correios: único, nadie más tiene el mismo, y con él encuentras exactamente ese envío.

- Tu app tiene **295 commits** (al 10/11/2026).
- Trabajas en la rama **`feature/smart-camera`**.
- También existen `main` (la principal) y una rama vieja, `cursor/quita-foto-fondo-san-4084`.

Los últimos commits:
```text
2ce8c04 chore(release): versionCode 93 (AAB 1.1.0)
f333022 feat(ganhos,painel): Minha empresa, textos de como registrar e foto por ano e cor
7fdd748 chore(release): versionCode 92 (AAB 1.1.0)
9630e4a feat(cores): cores do veículo adicionadas pelo painel
```
- El código del principio (`2ce8c04`) es el **identificador** del commit. Es único.
- El resto es el **mensaje**.

## 5. Cómo se escribe un buen mensaje

> 🌎 **En la vida real:** es como la nota que le dejas al compañero del turno siguiente en el taller:
> - Mala: "cambié cosas".
> - Buena: "fix(frenos): cambié las pastillas delanteras porque chirriaban al frenar".
>
> El **tipo** es como el color de la etiqueta de una carpeta:
> - `feat` = algo nuevo: "instalé aire acondicionado".
> - `fix` = un arreglo: "arreglé la fuga de aceite".
> - `refactor` = ordenar sin cambiar lo que hace: "ordené las herramientas del cajón"; el carro funciona igual.
> - `test` = revisiones: "agregué una prueba de frenos".
> - `chore` = mantenimiento: "cambio de aceite de rutina".
> - `docs` = papeles: "actualicé el manual".
>
> El **porqué** es lo más valioso: lo que hiciste se ve mirando el carro, pero **por qué** lo hiciste solo lo sabes tú.

Tu repositorio usa una convención llamada **Conventional Commits**, con los mensajes en portugués:

```
tipo(área): resumen corto

Por qué se hizo el cambio, en 1 a 3 líneas.
```

| Tipo | Cuándo |
|---|---|
| `feat` | Algo nuevo (una función, una pantalla) |
| `fix` | Arreglar un error |
| `refactor` | Ordenar el código sin cambiar lo que hace |
| `test` | Agregar o arreglar pruebas |
| `chore` | Tareas de mantenimiento (versiones, librerías) |
| `docs` | Documentación |

**Lo importante:** el mensaje explica **por qué**, no solo qué. El "qué" ya se ve en el código.

## 6. Los comandos, uno por uno

> 🌎 **En la vida real:** son los botones del control remoto del diario de obra. Cada uno hace una sola cosa.

### Ver el estado

> 🌎 **En la vida real:** `git status` es mirar el tablero del carro antes de arrancar: en qué marcha estás (la rama) y qué luces están encendidas (qué archivos cambiaste). Se hace **siempre**, antes y después.
```bash
git status
```
Te dice en qué rama estás y qué archivos cambiaste. **Es el comando que más vas a usar.** Úsalo antes y después de todo.

### Ver qué cambió

> 🌎 **En la vida real:** `git diff` es como el **control de cambios** de Word: lo tachado en rojo (`-`) es lo que quitaste, lo subrayado en verde (`+`) es lo que agregaste.
```bash
git diff
```
Muestra línea por línea lo que cambiaste. Las líneas con `-` (rojo) se quitaron; las líneas con `+` (verde) se agregaron. Para salir, presiona **q**.

### Ver la historia

> 🌎 **En la vida real:** `git log` es hojear el álbum de fotos de atrás para adelante. `git show` es abrir una foto en grande para ver todos los detalles de ese día.
```bash
git log --oneline -10
```
Los últimos 10 commits, uno por línea.

```bash
git show f333022
```
Lo que cambió en un commit específico.

### Preparar y guardar

> 🌎 **En la vida real:** es elegir qué fotos van a la página (`git add`) y pegarlas con su nota (`git commit -m`). `git add -A` es "todas las fotos que tomé hoy".
```bash
git add archivo.ts          # un archivo
git add -A                   # todos los cambios
git commit -m "fix(app): corrige el texto del tanque"
```

### Subir

> 🌎 **En la vida real:** `git push` es mandar las páginas nuevas del diario a la oficina central.
```bash
git push
```

### Deshacer cambios que todavía no guardaste

> 🌎 **En la vida real:** es arrugar el borrador y tirarlo: el archivo vuelve a como estaba en la última foto. Lo que escribiste en el borrador **no vuelve**.
```bash
git restore archivo.ts
```
**Cuidado:** borra tus cambios de ese archivo para siempre.

### Ramas

> 🌎 **En la vida real:** las ramas son como los carriles de una autopista: cada uno avanza por su lado sin chocar. `merge` es cuando dos carriles se juntan en uno. Borrar una rama ya unida es quitar los conos de un carril que ya no se usa.
>
> `switch` y `checkout` son como "carro" y "auto": el mismo vehículo, pero `switch` es el nombre más claro.
```bash
git branch                  # ver las ramas (la tuya tiene *)
git switch -c mi-rama       # crear una rama nueva y pasarte a ella
git switch main             # cambiarte a otra rama
```

## 7. Práctica guiada (sin tocar la app)

> 🌎 **En la vida real:** es el simulador de vuelo de los pilotos: aprendes a aterrizar en una pantalla antes de subirte a un avión con pasajeros. Aquí practicas con una carpeta de mentira.

Vas a practicar en una carpeta aparte, para no arriesgar la app. Escribe cada comando tú mismo.

### Parte A: crear un repositorio

> 🌎 **En la vida real:** `git init` es como comprar un cuaderno nuevo y escribir en la tapa "Diario de obra". Desde ese momento, esa carpeta puede guardar historia. Por ahora, las hojas están en blanco.
```bash
cd /Volumes/SSD_Desarrollo/Developer/Aprender/06-git
mkdir practica
cd practica
git init
```
`git init` convierte la carpeta en un repositorio. Corre `git status`: dice que no hay commits todavía.

### Parte B: tu primer commit

> 🌎 **En la vida real:** es la primera foto del álbum:
> - En **rojo** = la foto está tomada, pero tirada en la mesa.
> - `git add` = la pones en la pila de "para pegar" (verde).
> - `git commit` = la pegas en el álbum con su nota.
> - `git log` = abres el álbum y ahí está.
1. Crea un archivo `notas.txt` con una línea: `Mi primera nota`.
2. `git status` → aparece en rojo: Git lo ve, pero no está preparado.
3. `git add notas.txt`
4. `git status` → ahora está en verde: preparado.
5. `git commit -m "docs: primera nota"`
6. `git log --oneline` → ves tu commit.

### Parte C: ver un cambio

> 🌎 **En la vida real:** es comparar dos fotos de la misma pared: ayer tenía un cuadro, hoy tiene dos. `git diff` te señala el cuadro nuevo con un `+`.
1. Agrega otra línea a `notas.txt`: `Segunda nota`.
2. `git diff` → ves la línea nueva con `+`.
3. `git add -A` y `git commit -m "docs: segunda nota"`.
4. `git log --oneline` → dos commits.

### Parte D: deshacer

> 🌎 **En la vida real:** es como borrar sin querer todo un mensaje de WhatsApp antes de mandarlo, y que exista un botón mágico que lo devuelve tal como estaba en la última versión guardada.
1. Borra todo el contenido de `notas.txt` y guarda.
2. `git status` → aparece modificado.
3. `git restore notas.txt` → el archivo vuelve. Ábrelo y compruébalo.

### Parte E: una rama

> 🌎 **En la vida real:** es como probarte ropa en el probador: te pones la camisa nueva (la rama `experimento`), te miras, y al salir del probador (`git switch master`) vuelves con tu ropa de siempre. La camisa nueva no desapareció: está colgada en el probador esperando. `master` y `main` son el mismo cuarto con distinto cartel.
1. `git switch -c experimento`
2. Agrega una línea `Esto es un experimento` y haz commit.
3. `git switch master`. Abre `notas.txt`: la línea del experimento **no está**.
   (En tu Mac, un repositorio nuevo empieza con la rama `master`. En GitHub y en tu app la principal se llama `main`; es lo mismo con otro nombre.)
4. `git switch experimento`: la línea vuelve.

Así trabajan los equipos: cada cosa nueva en su rama, sin dañar la principal.

### Parte F: unir

> 🌎 **En la vida real:** `git merge` es decidir comprar la camisa: ahora la ropa de siempre incluye la camisa nueva.
1. Ve a la rama principal: `git switch master`.
2. `git merge experimento`
3. Abre `notas.txt`: ahora la principal tiene la línea del experimento.

## 8. Lo que el script de tu app hace por ti

> 🌎 **En la vida real:** el script era como un **lavadero automático**: tú metías el carro y salía limpio, sin saber qué pasaba adentro. Ahora sabes que adentro hay: revisar que no quedó nada prohibido en el carro (`git status`), enjabonar todo (`git add -A`), secar y poner el ticket (`git commit`) y sacarlo a la calle (`git push`).

Cuando corrías `./scripts/tareas.sh` para el commit, el script hacía:
1. `git status` para revisar que no subas un archivo prohibido (el AAB, la llave del keystore o la cuenta de servicio).
2. `git add -A`
3. `git commit` con el mensaje.
4. `git push`

Ahora sabes qué es cada paso.

## 9. Lo que nunca se sube

> 🌎 **En la vida real:** `.gitignore` es la lista de **cosas que no van en la mudanza**: la basura, los muebles que se arman de nuevo allá (`node_modules`, `android/`) y las cajas pesadas que tienes guardadas en otro lado (`store-assets`).
>
> Las **claves secretas** son como la llave de tu casa: nunca la mandas por foto en un grupo de WhatsApp. Aunque borres el mensaje después, alguien ya pudo haberla visto o guardado. Si pasa, **cambias la cerradura** (la clave), no basta con borrar el mensaje.

En tu app hay un archivo llamado **`.gitignore`**: la lista de lo que Git **no** debe guardar. Por ejemplo:
- `node_modules/` (las librerías: se instalan con `npm ci`).
- `android/` (se genera con `expo prebuild`).
- `store-assets/` (ahí se guardan los AAB).

Y nunca, por ninguna razón, se suben **claves secretas**, la llave del keystore ni la cuenta de servicio. Una vez que algo está en GitHub, aunque lo borres después, queda en la historia.

## 10. Chuleta completa (para tener a mano)

> 🌎 **En la vida real:** es como la tarjetita de primeros auxilios pegada en la puerta de la nevera: no la memorizas, la tienes a mano. Los ⭐ son "lo que usas todos los días" (como el cepillo de dientes) y los ⚠️ son "cuidado, corta" (como el cuchillo).

Todos los comandos más usados, en un solo lugar. Los que tienen ⚠️ **borran cosas**: úsalos solo si sabes lo que hacen. Los que tienen ⭐ son los de todos los días.

### Empezar

> 🌎 **En la vida real:** - `git init` = comprar un cuaderno nuevo.
> - `git clone` = fotocopiar el cuaderno de otra persona entero, con toda su historia.
> - `git config` = escribir tu nombre en la primera página, para que se sepa quién escribió cada cosa.
| Comando | Qué hace |
|---|---|
| `git init` | Convierte la carpeta en un repositorio nuevo |
| `git clone <url>` | Descarga un repositorio de GitHub a tu Mac |
| `git config --global user.name "Tu Nombre"` | Pone tu nombre en los commits (una sola vez) |
| `git config --global user.email "tu@correo"` | Pone tu correo en los commits (una sola vez) |

### El día a día

> 🌎 **En la vida real:** es la rutina diaria del cuaderno: mirar qué cambió (`status`), elegir qué anotar (`add`), anotarlo (`commit`), mandar la copia (`push`) y traer lo que anotaron los demás (`pull`).
>
> `git commit -am` es un atajo, como el "lavar y secar" de la lavadora, pero solo funciona con ropa que ya conocía: la ropa **nueva** hay que meterla a mano primero.
| Comando | Qué hace |
|---|---|
| ⭐ `git status` | Qué cambió y en qué rama estás |
| ⭐ `git add .` | Prepara todos los cambios (como `git add -A`) |
| `git add <archivo>` | Prepara un archivo |
| ⭐ `git commit -m "mensaje"` | Guarda lo preparado en la historia |
| `git commit -am "mensaje"` | Prepara y guarda de una vez (solo archivos que Git ya conocía; los nuevos no entran) |
| ⭐ `git push` | Sube tus commits a GitHub |
| ⭐ `git pull` | Baja de GitHub lo que no tienes |

### Ramas

> 🌎 **En la vida real:** las ramas son como los carriles de una autopista: cada uno avanza por su lado sin chocar. `merge` es cuando dos carriles se juntan en uno. Borrar una rama ya unida es quitar los conos de un carril que ya no se usa.
>
> `switch` y `checkout` son como "carro" y "auto": el mismo vehículo, pero `switch` es el nombre más claro.
| Comando | Qué hace |
|---|---|
| `git branch` | Lista las ramas (la tuya tiene `*`) |
| `git branch <nombre>` | Crea una rama (pero no te cambia a ella) |
| `git switch <nombre>` o `git checkout <nombre>` | Te cambia a otra rama |
| `git switch -c <nombre>` o `git checkout -b <nombre>` | Crea una rama y te cambia a ella |
| `git merge <rama>` | Une esa rama con la tuya |
| `git branch -d <nombre>` | Borra una rama (solo si ya se unió) |

`switch` y `checkout` hacen lo mismo al cambiar de rama. `switch` es la forma nueva y más clara; `checkout` es la antigua y hace varias cosas más.

### Deshacer

> 🌎 **En la vida real:** - `git restore` ⚠️ = tirar el borrador a la basura.
> - `git restore --staged` = sacar una foto de la pila "para pegar" y devolverla a la mesa: no se pierde.
> - `git revert` = como un banco que **no borra** un cobro equivocado del extracto, sino que agrega una línea de devolución. La historia queda completa y honesta.
> - `git reset --hard` ⚠️ = arrancar las páginas del cuaderno.
> - `git clean -fd` ⚠️ = tirar a la basura todos los papeles sueltos que no estaban en el cuaderno.
>
> ¿Por qué `revert` y no `reset` cuando ya lo subiste? Porque otros ya fotocopiaron tu cuaderno. Si arrancas páginas, sus copias ya no coinciden con la tuya.
| Comando | Qué hace |
|---|---|
| ⚠️ `git restore <archivo>` | Descarta los cambios de un archivo (no se recuperan) |
| ⚠️ `git restore .` | Descarta **todos** los cambios no guardados |
| `git restore --staged <archivo>` o `git reset <archivo>` | Saca un archivo de la preparación (sin perder el cambio) |
| `git revert <commit>` | Crea un commit nuevo que deshace otro. **Seguro**: no borra historia |
| ⚠️ `git reset --hard` | Vuelve todo al último commit y **borra** todo lo que no guardaste |
| ⚠️ `git clean -fd` | Borra los archivos y carpetas nuevos que Git no conoce |

**Si te equivocaste en algo que ya subiste a GitHub, usa `git revert`**, no `reset`. `revert` agrega un arreglo; `reset` reescribe la historia y le complica la vida a cualquiera que ya la tenga.

### Guardar a un lado (stash)

> 🌎 **En la vida real:** estás cocinando y tocan el timbre. No tiras la comida ni la terminas: la pones en la nevera (`stash`), atiendes, y después la sacas (`stash pop`). `stash list` es mirar qué hay en la nevera. `apply` es sacar una porción y dejar el resto guardado; `drop` es tirar lo que estaba en la nevera.
Para cuando estás a mitad de algo y necesitas cambiar de rama sin hacer commit.

| Comando | Qué hace |
|---|---|
| `git stash` | Guarda tus cambios a un lado y deja la carpeta limpia |
| `git stash list` | Lista lo que guardaste a un lado |
| `git stash pop` | Devuelve lo último que guardaste (y lo quita de la lista) |
| `git stash apply` | Devuelve lo último que guardaste (y lo deja en la lista) |
| `git stash drop` | Borra lo último que guardaste a un lado |

### GitHub (el remoto)

> 🌎 **En la vida real:** - `git remote -v` = mirar a qué oficina de correos mandas tus paquetes.
> - `git remote add origin` = darte de alta en esa oficina.
> - `git push -u` = mandar el primer paquete y dejar anotado que esa es tu oficina de siempre.
> - `git fetch` = **mirar** el buzón sin abrir las cartas.
> - `git pull` = abrir las cartas y mezclarlas con tus papeles. Por eso `pull` = `fetch` + `merge`.
> - `git push origin --delete` = cerrar una casilla en la oficina.
| Comando | Qué hace |
|---|---|
| `git remote -v` | Muestra a qué dirección de GitHub está conectado |
| `git remote add origin <url>` | Conecta tu repositorio con uno de GitHub |
| `git push -u origin <rama>` | Sube una rama nueva y la deja conectada (después basta `git push`) |
| `git fetch` | Mira qué hay de nuevo en GitHub **sin** mezclarlo con lo tuyo |
| `git pull origin <rama>` | Baja y mezcla una rama específica |
| `git push origin --delete <rama>` | Borra una rama en GitHub |

`git pull` = `git fetch` (mirar) + `git merge` (mezclar).

### Investigar

> 🌎 **En la vida real:** son las herramientas del detective:
> - `git log --graph` = el árbol genealógico de la familia, dibujado.
> - `git show` = la ficha completa de un día.
> - `git blame` = como las firmas en un contrato: dice quién escribió cada renglón y cuándo.
> - `git bisect` = buscar una palabra en el diccionario abriéndolo por la mitad, después por la mitad de la mitad… Así, entre 300 commits, encuentras el que trajo el error en unos 8 intentos.
| Comando | Qué hace |
|---|---|
| ⭐ `git log --oneline` | La historia, un commit por línea |
| `git log --graph` | La historia dibujada con las ramas |
| ⭐ `git diff` | Qué cambiaste, línea por línea |
| `git show <commit>` | Qué cambió en un commit |
| `git blame <archivo>` | Quién cambió cada línea y en qué commit |
| `git bisect` | Busca, probando por mitades, en qué commit apareció un error |

**Prueba en tu app (sin riesgo, solo mira):**
```bash
git blame src/data/workAppsCatalog.ts | grep my_company
```
Vas a ver en qué commit se agregó "Mi empresa".

## Ejercicios

> 🌎 **En la vida real:** es como manejar con el instructor al lado: haces tú cada paso, en el carro de práctica, y respondes con tus palabras.

1. Haz la práctica completa (Partes A a F).
2. En la carpeta de la app, corre `git log --oneline -5` y explica con tus palabras qué hizo cada commit.
3. Corre `git show 9630e4a --stat`. ¿Cuántos archivos cambió el commit de los colores del panel? (Respuesta: 20.)
4. Pregunta: ¿qué diferencia hay entre `git commit` y `git push`?
5. Pregunta: si cambiaste un archivo pero no hiciste `git add`, ¿entra en el commit?
6. Pregunta: ¿para qué sirve una rama?

<details>
<summary>Respuestas</summary>

4. `git commit` guarda en tu Mac; `git push` sube a GitHub.
5. No. Solo entra lo que está preparado con `git add`.
6. Para trabajar en algo nuevo sin dañar la línea principal. Si sale bien, se une; si sale mal, se descarta.

</details>

## Para la entrevista

> 🌎 **En la vida real:** explícalo como un taller ordenado: "trabajo en una maqueta aparte, guardo fotos pequeñas con notas que explican el porqué, y cada envío pasa por la aduana automática". Y si mandaste una llave por error, **cambias la cerradura**.

**¿Cómo trabajas con Git?**
> Trabajo en una rama, hago commits pequeños con mensajes que explican el porqué (uso Conventional Commits), y al subir, el CI revisa todo. Antes de cada commit miro `git status` y `git diff`.

**¿Qué haces si subiste algo por error?**
> Si es código, hago un commit nuevo que lo corrige (`git revert`). Si es una clave secreta, la cambio inmediatamente, porque aunque la borre, queda en la historia.
