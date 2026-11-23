# Git y GitHub a fondo

> 🌎 **En la vida real:** ya sabes manejar. Esta clase es la del mecánico: qué hay dentro, cómo salir de un problema en la carretera y cómo trabajar en una flota con más conductores.

> 🎙️ **El profesor dice:** {{alumno}}, en el Tema 06 aprendiste a guardar, subir y crear ramas. Aquí vas a ver lo que falta para trabajar con tranquilidad: qué guarda Git por dentro, cómo deshacer casi cualquier error, cómo marcar versiones y cómo se organiza un equipo en GitHub.

## Parte 1. Qué hay dentro de la carpeta .git

> 🌎 **En la vida real:** tu proyecto es la casa. La carpeta `.git` es la caja fuerte del sótano, donde están todas las fotos de cómo era la casa en cada momento. Si borras esa caja, la casa sigue ahí, pero pierdes su historia.

Cuando escribes `git init`, Git crea una carpeta **oculta** llamada `.git`. **Ahí está todo tu repositorio local.**

| Dentro de `.git` | Qué guarda |
|---|---|
| `objects/` | El contenido de tus archivos y todos tus commits |
| `refs/` | Las ramas y etiquetas: a qué commit apunta cada una |
| `HEAD` | Dónde estás parado ahora |
| `config` | La configuración de este repositorio |

> ⚠️ **No edites esa carpeta a mano** y no la borres. Si la borras, pierdes la historia local.

### El hash: la huella de cada commit

Un **hash** es un código calculado a partir del contenido, como `2ce8c04`. Si cambia una sola letra, cambia el hash. Por eso Git nota si algo fue alterado.

### HEAD: «usted está aquí»

> 📖 **Palabra nueva: HEAD.** Es el marcador de «estás aquí», como el punto azul en el mapa del teléfono. Normalmente apunta a una rama, y la rama apunta a su último commit.

```dibujo
titulo HEAD apunta a la rama, y la rama apunta a su último commit
lienzo 420 170
circulo 50 118 20 tenue | A
circulo 150 118 20 tenue | B
circulo 250 118 20 verde | C
linea 70 118 130 118 tenue
linea 170 118 230 118 tenue
caja 210 52 80 30 azul | main
caja 210 6 80 30 amarillo | HEAD
flecha 250 36 250 52 amarillo
flecha 250 82 250 98 azul
texto 355 118 tenue | último commit
```

Cuando haces un commit, nace uno nuevo, la rama avanza hasta él y HEAD la acompaña.

### Tu identidad y la ayuda

```bash
git config --global user.name "Tu Nombre"       # tu nombre, para todos tus proyectos
git config --global user.email "tu@correo.com"  # tu correo
git config --list                               # ver toda la configuración
git help commit                                 # abrir el manual de un comando
```

`--global` significa «para todos los repositorios de mi usuario». Sin esa opción, el ajuste vale solo para el repositorio actual.

> ⚠️ **Tu correo queda en cada commit.** En un repositorio público, cualquiera puede verlo. GitHub ofrece una dirección privada del tipo `noreply` para usar en su lugar.

```practica
elige :: ¿Dónde guarda Git la historia de tu proyecto? :: En el README :: En la carpeta oculta .git :: En node_modules
vf :: HEAD indica en qué punto del proyecto estás parado
elige :: ¿Qué hace --global en git config? :: Sube la configuración a GitHub :: Aplica el ajuste a todos los repositorios de tu usuario :: Borra la configuración anterior
```

## Parte 2. Mover, borrar y dejar de seguir archivos

> 🌎 **En la vida real:** si cambias un mueble de cuarto, le avisas a quien lleva el inventario. Con Git, estos comandos hacen el cambio **y** lo anotan.

| Comando | Qué hace |
|---|---|
| `git mv viejo.js nuevo.js` | Renombra o mueve el archivo y deja el cambio preparado |
| `git rm archivo.js` | Lo borra de la carpeta y deja el borrado preparado |
| `git rm --cached .env` | Deja de **seguirlo**, pero **no lo borra** de tu computadora |

### La trampa del .gitignore

`.gitignore` solo sirve para archivos que Git **todavía no sigue**. Si ya hiciste commit de un archivo y después lo agregas a la lista, Git lo sigue vigilando. Hay que sacarlo:

```bash
echo ".env" >> .gitignore   # lo agrega a la lista
git rm --cached .env        # Git deja de seguirlo; tu archivo sigue en la carpeta
git commit -m "Deja de seguir el archivo .env"
```

> ⚠️ **Si era una clave secreta, esto no basta.** Sigue en los commits viejos. Considera esa clave **comprometida**: cámbiala por una nueva.

```practica
vf :: Agregar un archivo a .gitignore hace que Git deje de seguirlo aunque ya tenga commits
elige :: ¿Qué hace git rm --cached archivo? :: Lo borra de tu computadora :: Git deja de seguirlo, pero el archivo se queda en tu carpeta :: Lo sube a GitHub
vf :: Si subiste una clave secreta, basta con borrarla en un commit nuevo
```

## Parte 3. Deshacer sin miedo

> 🌎 **En la vida real:** si anotaste mal un gasto en un cuaderno compartido, lo correcto es escribir abajo una **corrección**. Arrancar la hoja confunde a quienes ya la leyeron. Esa es la diferencia entre `revert` y `reset`.

### revert: corregir sin borrar la historia

`git revert <hash>` crea un **commit nuevo** que hace lo contrario del que elegiste. La historia queda completa, por eso es lo más seguro en una rama compartida.

### reset: mover la rama hacia atrás

`git reset` mueve la rama a otro commit. Lo que cambia es **qué pasa con tu trabajo**:

```dibujo
titulo Qué conserva cada tipo de reset después de mover la rama
lienzo 420 212
texto 158 14 azul | Commit
texto 262 14 amarillo | Preparado
texto 366 14 verde | Archivos
texto 48 56 tenue | --soft
texto 48 112 tenue | --mixed
texto 48 168 rojo | --hard
llena 112 32 92 46 tenue | se quita
llena 216 32 92 46 verde | se queda
llena 320 32 92 46 verde | se queda
llena 112 88 92 46 tenue | se quita
llena 216 88 92 46 tenue | se quita
llena 320 88 92 46 verde | se queda
llena 112 144 92 46 rojo | se quita
llena 216 144 92 46 rojo | se quita
llena 320 144 92 46 rojo | se pierde
```

| Comando | Cuándo usarlo |
|---|---|
| `git reset --soft HEAD~1` | «Quiero rehacer el último commit con todo ya preparado» |
| `git reset HEAD~1` (es `--mixed`) | «Quiero deshacer el commit y elegir de nuevo qué agregar» |
| `git reset --hard HEAD~1` | «Quiero tirar ese commit y mis cambios» |

`HEAD~1` significa «un commit antes de donde estoy».

> ⚠️ **`--hard` borra los cambios que no guardaste en un commit, y esos no se recuperan.** Antes de usarlo, corre `git status`.

### reflog: la caja negra

> 📖 **Palabra nueva: reflog.** Es el registro local de todos los lugares por donde pasó HEAD. Como la caja negra de un avión, sirve para reconstruir qué pasó.

Si hiciste `reset --hard` y perdiste un **commit**, normalmente se puede rescatar:

```bash
git reflog                       # busca el hash de antes del error
git switch -c rescate 2ce8c04    # crea una rama nueva en ese punto
```

El reflog vive solo en tu computadora y sus entradas viejas caducan con el tiempo.

### force push: la opción peligrosa

Si reescribes commits que ya subiste, GitHub rechaza el `git push`. Forzarlo reemplaza la historia remota y **puede borrar el trabajo de un compañero**.

- **No fuerces** `main` ni ramas compartidas. Ahí usa `git revert`.
- Si la rama es solo tuya y de verdad hace falta, usa `git push --force-with-lease`. Se detiene si alguien subió algo que no has visto.

✍️ **Ahora escribes tú:**

```ejercicio
titulo: ¿Qué pasa con tu trabajo?
lenguaje: js
pide: Completa `trasReset(modo)`. Si `modo` es `'soft'`, devuelve `'preparado'`. Si es `'mixed'`, devuelve `'en tus archivos'`. Si es `'hard'`, devuelve `'perdido'`. Con cualquier otro modo, devuelve `null`.
--- código
function trasReset(modo) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('soft', () => igual(trasReset('soft'), 'preparado'));
prueba('mixed', () => igual(trasReset('mixed'), 'en tus archivos'));
prueba('hard', () => igual(trasReset('hard'), 'perdido'));
prueba('otro modo', () => igual(trasReset('rapido'), null));
--- solución
function trasReset(modo) {
  if (modo === 'soft') return 'preparado';
  if (modo === 'mixed') return 'en tus archivos';
  if (modo === 'hard') return 'perdido';
  return null;
}
```

```practica
elige :: En una rama compartida, ¿qué es más seguro para deshacer un commit? :: git reset --hard :: git revert :: git push --force
elige :: ¿Qué conserva git reset --soft HEAD~1? :: Nada :: Los cambios del commit, ya preparados :: Solo el mensaje
vf :: git reflog puede ayudarte a encontrar un commit después de un reset --hard
vf :: git reflog recupera cambios que nunca estuvieron en un commit
```

## Parte 4. Versiones: etiquetas, releases y README

> 🌎 **En la vida real:** un libro va por «segunda edición». Es una forma fácil de nombrar un momento exacto. En Git, ese nombre es una **etiqueta**.

### Etiquetas (tags)

```bash
git tag -a v1.1.0 -m "Registro de combustible"   # marca el commit actual
git tag                                          # lista las etiquetas
git push origin v1.1.0                           # súbela: git push no las sube sola
```

Una rama **avanza** con cada commit. Una etiqueta **se queda fija** en su commit.

```dibujo
titulo La rama avanza, pero cada etiqueta se queda marcando su versión
lienzo 420 140
circulo 50 92 18 verde
circulo 150 92 18 tenue
circulo 250 92 18 verde
circulo 350 92 18 tenue
linea 68 92 132 92 tenue
linea 168 92 232 92 tenue
linea 268 92 332 92 tenue
caja 14 18 72 30 amarillo | v1.0.0
caja 214 18 72 30 amarillo | v1.1.0
caja 314 18 72 30 azul | main
flecha 50 48 50 72 amarillo
flecha 250 48 250 72 amarillo
flecha 350 48 350 72 azul
```

Los números suelen seguir esta idea, llamada **versionado semántico**: `MAYOR.MENOR.ARREGLO`.

| Cambia | Cuándo | Ejemplo |
|---|---|---|
| **Mayor** | Rompe algo que funcionaba | `1.4.2` → `2.0.0` |
| **Menor** | Agrega algo nuevo | `1.4.2` → `1.5.0` |
| **Arreglo** | Corrige un error | `1.4.2` → `1.4.3` |

### Release de GitHub

Un **release** es una página de GitHub construida sobre una etiqueta. Explica qué cambió en esa versión y puede incluir archivos para descargar, como un APK.

### README y Markdown

El **README** es la portada de tu proyecto. **Markdown** es la forma sencilla de darle formato con símbolos:

```markdown
# Gastos del carro
Registra combustible y calcula lo que te queda.

## Cómo correrlo
1. Instala con `npm ci`
2. Arranca con `npm start`

**Importante:** no subas tu archivo `.env`.
```

Un buen README responde: qué es, por qué existe, cómo correrlo y cómo probarlo.

> 💡 **Para tu portafolio:** si creas un repositorio con **exactamente tu nombre de usuario** de GitHub y le pones un `README.md`, ese texto aparece en tu perfil. Es tu presentación para quien te quiera contratar.

```practica
vf :: Una etiqueta avanza con cada commit, igual que una rama
elige :: Una versión 2.3.1 corrige un error sin agregar nada. ¿Cuál sigue? :: 3.0.0 :: 2.4.0 :: 2.3.2
vf :: git push sube las etiquetas automáticamente
```

## Parte 5. GitHub en equipo: fork, issues y proyectos

> 🌎 **En la vida real:** clonar es sacar una fotocopia para trabajar en tu mesa. Hacer **fork** es abrir tu propia sucursal con una copia del negocio. Desde allí puedes proponerle mejoras al negocio original.

```dibujo
titulo Con fork trabajas en tu copia y propones el cambio al proyecto original
lienzo 420 214
caja 8 10 164 62 azul | Proyecto original | en GitHub
caja 248 10 164 62 verde | Tu fork | tu copia en GitHub
caja 248 146 164 58 amarillo | Tu computadora | copia local
flecha 172 30 248 30 tenue | fork
flecha 276 72 276 146 tenue | clone
flecha 360 146 360 72 tenue | push
flecha 248 58 172 58 morado | PR
```

| | Fork | Clone |
|---|---|---|
| **Dónde queda la copia** | En tu cuenta de GitHub | En tu computadora |
| **Para qué** | Proponer cambios a un proyecto ajeno | Trabajar localmente |

### Cómo organiza su trabajo un equipo

| Herramienta | Qué es | Ejemplo en Copiloto |
|---|---|---|
| **Issue** | Una ficha con un error, tarea o idea | «El total sale mal con coma» |
| **Asignar** | Decir quién se encarga | La ficha queda a tu nombre |
| **Milestone** | Agrupa fichas hacia una meta | «Versión 1.2» |
| **Project** | Un tablero: por hacer, en curso, listo | Las tareas del mes |
| **Discussion** | Un espacio para preguntas e ideas | «¿Agregamos otra moneda?» |
| **Pull request** | La propuesta de unir un cambio | Tu rama lista para revisar |

Si la descripción de tu pull request dice `Closes #12`, GitHub cierra el issue 12 al unirlo a la rama principal.

### El flujo completo

```dibujo
titulo El camino de un cambio en un equipo
lienzo 420 196
caja 6 10 92 40 tenue | Issue
caja 112 10 92 40 azul | Rama
caja 218 10 92 40 azul | Commits
caja 324 10 90 40 azul | Push
flecha 98 30 112 30 tenue
flecha 204 30 218 30 tenue
flecha 310 30 324 30 tenue
flecha 369 50 369 86 tenue
caja 324 88 90 40 morado | PR
caja 218 88 92 40 amarillo | CI
caja 112 88 92 40 amarillo | Revisión
caja 6 88 92 40 verde | Merge
flecha 324 108 310 108 tenue
flecha 218 108 204 108 tenue
flecha 112 108 98 108 tenue
flecha 52 128 52 150 tenue
llena 6 152 408 36 verde | Publicado y el issue queda cerrado
```

```practica
elige :: ¿Cuál es la diferencia entre fork y clone? :: Son lo mismo :: El fork crea tu copia en GitHub y el clone la baja a tu computadora :: El clone solo sirve para imágenes
elige :: ¿Para qué sirve un issue? :: Para compilar la app :: Para registrar un error, una tarea o una idea :: Para guardar contraseñas
vf :: Un milestone agrupa issues y pull requests hacia una meta
```

## Parte 6. GitHub Actions por dentro

> 🌎 **En la vida real:** es un empleado con una lista de instrucciones. Cuando suena el timbre, entra a una oficina vacía, sigue la lista y deja un informe. Ya lo viste en el Tema 04; aquí le ponemos nombre a cada pieza.

```yaml
name: Pruebas              # el nombre del workflow
on: [push, pull_request]   # el disparador
jobs:
  probar:                  # un trabajo
    runs-on: ubuntu-latest # la máquina (runner)
    steps:                 # los pasos, en orden
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

| Palabra | Qué es | En la oficina |
|---|---|---|
| **Workflow** | El proceso automático, en un archivo YAML | La lista de instrucciones |
| **Trigger** (disparador) | Lo que lo arranca: un push, un PR o un horario | El timbre |
| **Job** | Un grupo de pasos | Una tarea completa |
| **Step** | Un paso | Una línea de la lista |
| **Runner** | La máquina que lo ejecuta | El empleado en su oficina |

### CI y CD

```dibujo
titulo CI revisa cada cambio, y CD lo deja listo o lo publica
lienzo 420 148
caja 6 28 86 54 tenue | Push
caja 112 28 92 54 azul | Compilar
caja 222 28 92 54 azul | Probar
caja 332 28 82 54 verde | Publicar
flecha 92 55 112 55 tenue
flecha 204 55 222 55 tenue
flecha 314 55 332 55 tenue
linea 112 100 314 100 azul
texto 213 118 azul | CI
linea 332 100 414 100 verde
texto 373 118 verde | CD
```

- **CI (integración continua):** cada cambio se compila y se prueba solo.
- **Entrega continua (CD):** el resultado queda **listo** para publicar, y una persona aprieta el botón.
- **Despliegue continuo (también CD):** si todo pasa, se publica **sin** intervención humana.

> ⚠️ **Las claves del workflow** nunca van escritas en el archivo. Se guardan en los **Secrets** de GitHub y se leen desde allí.

```practica
elige :: ¿Qué es un runner? :: Un archivo YAML :: La máquina que ejecuta los trabajos del workflow :: Una rama especial
vf :: Un trigger es el evento que hace arrancar un workflow
elige :: ¿Qué diferencia hay entre entrega continua y despliegue continuo? :: Ninguna :: En la entrega una persona decide publicar y en el despliegue se publica solo :: La entrega no usa pruebas
escribe :: Cuenta el camino de un cambio en un equipo, desde la tarea hasta publicarlo. :: Parte de un issue. Creo una rama, hago commits pequeños y los subo con push. Abro un pull request, el CI corre las pruebas y otra persona revisa. Si todo está bien se hace merge a main, se publica y el issue queda cerrado.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cuál es la diferencia entre Git y GitHub?":** "Git es la herramienta que guarda la historia del código en mi computadora. GitHub es la plataforma en internet donde se alojan esos repositorios y donde el equipo colabora con pull requests, issues y automatizaciones."

> 🎤 **Si te preguntan "¿revert o reset?":** "En una rama compartida uso revert, porque crea un commit nuevo y no reescribe la historia. Reset mueve la rama, y lo dejo para commits míos que todavía no compartí."

> 🎤 **Si te preguntan "¿cómo recuperas algo después de un reset --hard?":** "Si estaba en un commit, busco su hash con git reflog y creo una rama en ese punto. Si nunca hice commit, ese cambio se perdió. Por eso reviso git status antes."

> 🎤 **Si te preguntan "¿qué es CI/CD?":** "CI es que cada cambio se compile y se pruebe solo. CD es llevarlo hasta quedar listo para publicar, o publicarlo automáticamente si todo pasa."
