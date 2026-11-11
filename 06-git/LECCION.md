# Tema 06: Git

Hasta hoy, los commits y los push los hacía el script o Claude. En este tema vas a entender qué pasa por dentro y a hacerlo tú mismo.

**Antes de empezar:** Tema 05.

**Tiempo:** de 1 a 2 horas.

## 1. ¿Qué es Git?

**Git** es un programa que guarda **la historia** de tu código. Cada vez que guardas un punto de la historia, puedes volver a él, ver qué cambió y quién lo cambió.

**Comparación:** es como el historial de un documento de Google Docs, pero tú decides cuándo se guarda cada versión y le pones un título.

**GitHub** es otra cosa: es una **página en internet** donde se guarda una copia de tu historia. Git está en tu Mac; GitHub está en la nube.

| | Git | GitHub |
|---|---|---|
| Qué es | Un programa | Una página web |
| Dónde está | En tu computadora | En internet |
| Para qué | Guardar la historia | Guardar una copia, compartirla y correr el CI |

## 2. Las palabras

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

```
 Tu archivo  ──git add──▶  Staging  ──git commit──▶  Historia en tu Mac  ──git push──▶  GitHub
 (editado)                (preparado)                (guardado)                          (copia + CI)
```

1. **Editas** un archivo.
2. `git add` lo pone en la lista del próximo commit.
3. `git commit` guarda ese punto en la historia, con un mensaje.
4. `git push` lo sube a GitHub. Ahí corre el CI (Tema 04).

## 4. Tu app en números

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

### Ver el estado
```bash
git status
```
Te dice en qué rama estás y qué archivos cambiaste. **Es el comando que más vas a usar.** Úsalo antes y después de todo.

### Ver qué cambió
```bash
git diff
```
Muestra línea por línea lo que cambiaste. Las líneas con `-` (rojo) se quitaron; las líneas con `+` (verde) se agregaron. Para salir, presiona **q**.

### Ver la historia
```bash
git log --oneline -10
```
Los últimos 10 commits, uno por línea.

```bash
git show f333022
```
Lo que cambió en un commit específico.

### Preparar y guardar
```bash
git add archivo.ts          # un archivo
git add -A                   # todos los cambios
git commit -m "fix(app): corrige el texto del tanque"
```

### Subir
```bash
git push
```

### Deshacer cambios que todavía no guardaste
```bash
git restore archivo.ts
```
**Cuidado:** borra tus cambios de ese archivo para siempre.

### Ramas
```bash
git branch                  # ver las ramas (la tuya tiene *)
git switch -c mi-rama       # crear una rama nueva y pasarte a ella
git switch main             # cambiarte a otra rama
```

## 7. Práctica guiada (sin tocar la app)

Vas a practicar en una carpeta aparte, para no arriesgar la app. Escribe cada comando tú mismo.

### Parte A: crear un repositorio
```bash
cd /Volumes/SSD_Desarrollo/Developer/Aprender/06-git
mkdir practica
cd practica
git init
```
`git init` convierte la carpeta en un repositorio. Corre `git status`: dice que no hay commits todavía.

### Parte B: tu primer commit
1. Crea un archivo `notas.txt` con una línea: `Mi primera nota`.
2. `git status` → aparece en rojo: Git lo ve, pero no está preparado.
3. `git add notas.txt`
4. `git status` → ahora está en verde: preparado.
5. `git commit -m "docs: primera nota"`
6. `git log --oneline` → ves tu commit.

### Parte C: ver un cambio
1. Agrega otra línea a `notas.txt`: `Segunda nota`.
2. `git diff` → ves la línea nueva con `+`.
3. `git add -A` y `git commit -m "docs: segunda nota"`.
4. `git log --oneline` → dos commits.

### Parte D: deshacer
1. Borra todo el contenido de `notas.txt` y guarda.
2. `git status` → aparece modificado.
3. `git restore notas.txt` → el archivo vuelve. Ábrelo y compruébalo.

### Parte E: una rama
1. `git switch -c experimento`
2. Agrega una línea `Esto es un experimento` y haz commit.
3. `git switch master`. Abre `notas.txt`: la línea del experimento **no está**.
   (En tu Mac, un repositorio nuevo empieza con la rama `master`. En GitHub y en tu app la principal se llama `main`; es lo mismo con otro nombre.)
4. `git switch experimento`: la línea vuelve.

Así trabajan los equipos: cada cosa nueva en su rama, sin dañar la principal.

### Parte F: unir
1. Ve a la rama principal: `git switch master`.
2. `git merge experimento`
3. Abre `notas.txt`: ahora la principal tiene la línea del experimento.

## 8. Lo que el script de tu app hace por ti

Cuando corrías `./scripts/tareas.sh` para el commit, el script hacía:
1. `git status` para revisar que no subas un archivo prohibido (el AAB, la llave del keystore o la cuenta de servicio).
2. `git add -A`
3. `git commit` con el mensaje.
4. `git push`

Ahora sabes qué es cada paso.

## 9. Lo que nunca se sube

En tu app hay un archivo llamado **`.gitignore`**: la lista de lo que Git **no** debe guardar. Por ejemplo:
- `node_modules/` (las librerías: se instalan con `npm ci`).
- `android/` (se genera con `expo prebuild`).
- `store-assets/` (ahí se guardan los AAB).

Y nunca, por ninguna razón, se suben **claves secretas**, la llave del keystore ni la cuenta de servicio. Una vez que algo está en GitHub, aunque lo borres después, queda en la historia.

## 10. Chuleta completa (para tener a mano)

Todos los comandos más usados, en un solo lugar. Los que tienen ⚠️ **borran cosas**: úsalos solo si sabes lo que hacen. Los que tienen ⭐ son los de todos los días.

### Empezar
| Comando | Qué hace |
|---|---|
| `git init` | Convierte la carpeta en un repositorio nuevo |
| `git clone <url>` | Descarga un repositorio de GitHub a tu Mac |
| `git config --global user.name "Tu Nombre"` | Pone tu nombre en los commits (una sola vez) |
| `git config --global user.email "tu@correo"` | Pone tu correo en los commits (una sola vez) |

### El día a día
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
Para cuando estás a mitad de algo y necesitas cambiar de rama sin hacer commit.

| Comando | Qué hace |
|---|---|
| `git stash` | Guarda tus cambios a un lado y deja la carpeta limpia |
| `git stash list` | Lista lo que guardaste a un lado |
| `git stash pop` | Devuelve lo último que guardaste (y lo quita de la lista) |
| `git stash apply` | Devuelve lo último que guardaste (y lo deja en la lista) |
| `git stash drop` | Borra lo último que guardaste a un lado |

### GitHub (el remoto)
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

**¿Cómo trabajas con Git?**
> Trabajo en una rama, hago commits pequeños con mensajes que explican el porqué (uso Conventional Commits), y al subir, el CI revisa todo. Antes de cada commit miro `git status` y `git diff`.

**¿Qué haces si subiste algo por error?**
> Si es código, hago un commit nuevo que lo corrige (`git revert`). Si es una clave secreta, la cambio inmediatamente, porque aunque la borre, queda en la historia.
