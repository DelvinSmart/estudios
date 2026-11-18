# Git

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) tiene además la **chuleta completa** de comandos para tener a mano.

**Cómo estudiarla:** de 1 a 2 horas, en dos o tres días. La parte 7 es práctica en la terminal, con una carpeta de mentira: **no toca la app**.

**Lo que necesitas saber antes:** Tema 05 (ya usaste `git status` y `git restore`).

## 1. ¿Qué es Git?

> 🎙️ **El profesor:** {{alumno}}, hasta hoy los commits y los push los hacía un script o una IA por ti. Hoy vas a entender **qué pasa por dentro** y a hacerlo tú mismo. Git es una de las herramientas que **todo** programador del mundo usa todos los días; en una entrevista lo dan por sabido.

> 🌎 **En la vida real:** Git es como el historial de versiones de un contrato en la escribanía: cada versión firmada queda guardada con su fecha, y siempre puedes ver qué cambió entre una y otra.

> 🌎 **Otro ejemplo:** Es como la libreta de mantenimiento del carro: cada servicio anotado con fecha y qué se hizo. Si algo falla, miras hacia atrás y sabes cuándo empezó.

### Git: la historia de tu código

**Git** es un programa que guarda **la historia** de tu código. Cada vez que guardas un punto de la historia (un **commit**), después puedes:
- **volver** a ese punto,
- ver **qué cambió**,
- y saber **quién** lo cambió y **por qué**.

> 🌎 **En la vida real:** los **puntos de guardado** de un videojuego. Antes de pelear con el jefe final, guardas la partida. Si pierdes, vuelves a ese punto; no empiezas de cero. Y tú decides cuándo guardar y le pones nombre: "antes del castillo".

> 🌎 **Otro ejemplo:** Como las fotos de antes y después en una obra: puedes comparar cualquier día con cualquier otro.

### Git no es GitHub

Esto confunde a casi todos al principio:

| | Git | GitHub |
|---|---|---|
| Qué es | Un **programa** | Una **página web** |
| Dónde está | En tu computadora | En internet |
| Para qué | Guardar la historia | Guardar una **copia**, compartirla y correr el CI |

Git funciona **sin internet**: guarda la historia en tu Mac. GitHub es un lugar en la nube donde **subes una copia** de esa historia.

> 🌎 **En la vida real:** Git es el **álbum de fotos** que tienes en casa. GitHub es una **copia del álbum guardada en un banco**: si se te inunda la casa, la historia sigue a salvo, y además se la puedes mostrar a otros.

> 🌎 **Otro ejemplo:** Git es tu cuaderno de recetas en la cocina; GitHub es la copia que guardaste en la nube, que además puedes compartir con tu familia.

> ✋ **Para y piensa:** estás en un avión sin internet. ¿Puedes hacer commits?

<details>
<summary>Ver la respuesta</summary>

**Sí.** Git funciona en tu computadora. Lo que no puedes es **subirlos** a GitHub (`git push`) hasta tener internet.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un Git de juguete: fotos del proyecto
lenguaje: js
pide: Un commit es una **foto** del proyecto con un mensaje. Completa `crearRepo()`: `commit(mensaje, archivos)` guarda una **copia** de los archivos (un objeto nombre → contenido) y devuelve un número de commit (1, 2, 3…); `log()` devuelve los mensajes del más nuevo al más viejo; `verFoto(n)` devuelve los archivos del commit n.
--- código
function crearRepo() {
  const fotos = [];
  return {
    commit(mensaje, archivos) {
      // tu código aquí
    },
    log() {
      // tu código aquí
    },
    verFoto(n) {
      // tu código aquí
    },
  };
}
--- pruebas
prueba('los commits se numeran', () => { const r = crearRepo(); igual([r.commit('a', {}), r.commit('b', {})], [1, 2]); });
prueba('log del más nuevo al más viejo', () => { const r = crearRepo(); r.commit('primera nota', {}); r.commit('segunda nota', {}); igual(r.log(), ['segunda nota', 'primera nota']); });
prueba('una foto no cambia aunque cambies el archivo después', () => { const r = crearRepo(); const archivos = { 'notas.txt': 'hola' }; r.commit('a', archivos); archivos['notas.txt'] = 'cambiado'; igual(r.verFoto(1), { 'notas.txt': 'hola' }); });
--- solución
function crearRepo() {
  const fotos = [];
  return {
    commit(mensaje, archivos) {
      fotos.push({ mensaje, archivos: { ...archivos } });
      return fotos.length;
    },
    log() {
      return fotos.map((f) => f.mensaje).reverse();
    },
    verFoto(n) {
      return fotos[n - 1]?.archivos;
    },
  };
}
```

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

> 🌎 **Otro ejemplo:** En un equipo de fútbol: el repositorio es la historia del club; un commit, cada partido jugado con su resultado; una rama, un entrenamiento táctico aparte; merge, usar esa táctica en el partido oficial; y un pull request, proponerle la táctica al entrenador antes.

| Palabra | Significado | En Copiloto | 🌎 En la obra |
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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Preparar (add) antes de guardar (commit)
lenguaje: js
pide: Con Git, solo entra al commit lo que preparaste con `git add`. Completa `crearArea()`: `cambiar(archivo)` lo marca como cambiado; `add(archivo)` lo pasa a preparado; `commit()` devuelve la lista de lo preparado y la vacía; `status()` devuelve `{ cambiados, preparados }`.
--- código
function crearArea() {
  let cambiados = [];
  let preparados = [];
  return {
    cambiar(archivo) {
      // tu código aquí
    },
    add(archivo) {
      // tu código aquí
    },
    commit() {
      // tu código aquí
    },
    status() {
      return { cambiados, preparados };
    },
  };
}
--- pruebas
prueba('cambiar sin add: no entra al commit', () => { const a = crearArea(); a.cambiar('notas.txt'); igual(a.commit(), []); });
prueba('add y commit', () => { const a = crearArea(); a.cambiar('notas.txt'); a.add('notas.txt'); igual(a.commit(), ['notas.txt']); });
prueba('después del commit, todo limpio', () => { const a = crearArea(); a.cambiar('x'); a.add('x'); a.commit(); igual(a.status(), { cambiados: [], preparados: [] }); });
prueba('status muestra lo cambiado y lo preparado', () => { const a = crearArea(); a.cambiar('a'); a.cambiar('b'); a.add('a'); igual(a.status(), { cambiados: ['b'], preparados: ['a'] }); });
--- solución
function crearArea() {
  let cambiados = [];
  let preparados = [];
  return {
    cambiar(archivo) {
      if (!cambiados.includes(archivo)) cambiados = [...cambiados, archivo];
    },
    add(archivo) {
      cambiados = cambiados.filter((a) => a !== archivo);
      if (!preparados.includes(archivo)) preparados = [...preparados, archivo];
    },
    commit() {
      const guardados = preparados;
      preparados = [];
      return guardados;
    },
    status() {
      return { cambiados, preparados };
    },
  };
}
```

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

> 🌎 **Otro ejemplo:** Como un pedido de comida: eliges los platos (add), confirmas el pedido con una nota (commit) y el repartidor lo lleva a destino (push).

> ✋ **Para y piensa:** hiciste `git commit` pero no `git push`. ¿Tu cambio está en GitHub?

<details>
<summary>Ver la respuesta</summary>

**No.** Está guardado en la historia **de tu Mac**. Hasta que hagas `git push`, GitHub no lo tiene (y el CI no corre).

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: push y pull: tu Mac y GitHub
lenguaje: js
pide: Tu Mac y GitHub tienen cada uno su lista de commits. Completa `push(local, remoto)` (GitHub queda con los commits de tu Mac que le faltaban) y `pull(local, remoto)` (tu Mac recibe los que faltaban de GitHub). Los dos devuelven la lista **nueva** del que recibe, sin repetir commits y en el mismo orden.
--- código
function push(local, remoto) {
  // tu código aquí
}

function pull(local, remoto) {
  // tu código aquí
}
--- pruebas
prueba('push sube lo nuevo', () => igual(push(['a', 'b', 'c'], ['a', 'b']), ['a', 'b', 'c']));
prueba('pull baja lo que hiciste desde el panel', () => igual(pull(['a'], ['a', 'panel']), ['a', 'panel']));
prueba('sin nada nuevo, queda igual', () => igual(push(['a'], ['a']), ['a']));
--- solución
function push(local, remoto) {
  return [...remoto, ...local.filter((c) => !remoto.includes(c))];
}

function pull(local, remoto) {
  return [...local, ...remoto.filter((c) => !local.includes(c))];
}
```

```practica
escribe :: Di los cuatro pasos por los que viaja un cambio, con su comando. :: Edito el archivo; git add lo pone en el staging; git commit lo guarda en la historia de mi Mac; git push lo sube a GitHub, donde corre el CI.
elige :: ¿Qué comando guarda el punto en la historia de tu Mac? :: `git add` :: `git commit` :: `git push`
elige :: ¿Qué comando sube a GitHub? :: `git add` :: `git commit` :: `git push`
vf :: Después de `git commit`, el CI ya está corriendo
vf :: Si cambié un archivo pero no hice `git add`, no entra en el commit
```

> 🔁 **Repaso:** editar → `git add` (staging) → `git commit` (historia en tu Mac) → `git push` (GitHub + CI).

## 4. La app Copiloto en números

> 🎙️ **El profesor:** mira tu propia historia. Esto es lo que había el 10 de noviembre de 2026.

- La app Copiloto tenía **295 commits**: 295 puntos guardados.
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

> 🌎 **Otro ejemplo:** Como el número de un boleto de avión: con ese código encuentras exactamente tu vuelo, aunque haya miles ese día.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer git log --oneline
lenguaje: js
pide: Cada línea de `git log --oneline` es el identificador corto (hash) y el mensaje. Completa `leerLog(texto)`: devuelve una lista de `{ hash, mensaje }`, sin líneas vacías.
--- código
function leerLog(texto) {
  // tu código aquí
}
--- pruebas
const salida = '9f6813a Programación 01 a 03: ejercicios\nd6ea14f La entrevista en dos niveles\n\n4def164 El recorrido de cada proyecto\n';
prueba('tres commits', () => igual(leerLog(salida).length, 3));
prueba('el primero', () => igual(leerLog(salida)[0], { hash: '9f6813a', mensaje: 'Programación 01 a 03: ejercicios' }));
prueba('el mensaje con espacios queda entero', () => igual(leerLog(salida)[1].mensaje, 'La entrevista en dos niveles'));
--- solución
function leerLog(texto) {
  return texto
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => {
      const espacio = l.indexOf(' ');
      return { hash: l.slice(0, espacio), mensaje: l.slice(espacio + 1) };
    });
}
```

```practica
elige :: En `2ce8c04 chore(release): versionCode 93`, ¿qué es `2ce8c04`? :: El mensaje :: El identificador único del commit :: La fecha
vf :: Dos commits distintos pueden tener el mismo identificador
elige :: ¿En qué rama trabajas la app? :: `main` :: `feature/smart-camera` :: `master`
```

> 🔁 **Repaso:** cada commit tiene un identificador único (hash) y un mensaje. La app Copiloto trabaja en la rama `feature/smart-camera`.

## 5. Cómo se escribe un buen mensaje

> 🎙️ **El profesor:** un mensaje de commit lo vas a leer **tú mismo dentro de seis meses**, buscando por qué hiciste algo. Escríbelo para tu yo del futuro.

> 🌎 **Otro ejemplo:** Como el asunto de un correo bien escrito: "Factura de octubre – pago atrasado por cambio de banco" dice qué y por qué; "Hola" no dice nada.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Es un buen mensaje de commit?
lenguaje: js
pide: Revisa un mensaje con la convención **Conventional Commits** de esta parte: `tipo(área): resumen`. El tipo tiene que ser uno de `TIPOS`, el área es opcional, el resumen no puede estar vacío ni pasar de 72 letras. Completa `revisarMensaje(mensaje)`: devuelve `[]` si está bien, o la lista de problemas: `'tipo inválido'`, `'falta el resumen'`, `'resumen muy largo'`.
--- código
const TIPOS = ['feat', 'fix', 'refactor', 'test', 'chore', 'docs'];

function revisarMensaje(mensaje) {
  // tu código aquí
}
--- pruebas
prueba('un buen mensaje', () => igual(revisarMensaje('fix(tanque): la barra no bajaba al registrar gasto'), []));
prueba('sin área también vale', () => igual(revisarMensaje('docs: actualizo el README'), []));
prueba('"cambié cosas" no sigue la forma', () => ok(revisarMensaje('cambié cosas').includes('tipo inválido')));
prueba('un tipo que no existe', () => igual(revisarMensaje('arreglo(tanque): algo'), ['tipo inválido']));
prueba('sin resumen', () => igual(revisarMensaje('feat(peajes): '), ['falta el resumen']));
prueba('resumen muy largo', () => igual(revisarMensaje('feat: ' + 'a'.repeat(73)), ['resumen muy largo']));
--- solución
const TIPOS = ['feat', 'fix', 'refactor', 'test', 'chore', 'docs'];

function revisarMensaje(mensaje) {
  const m = mensaje.match(/^(\w+)(\([^)]*\))?:\s*(.*)$/);
  if (!m) return ['tipo inválido'];
  const [, tipo, , resumen] = m;
  const problemas = [];
  if (!TIPOS.includes(tipo)) problemas.push('tipo inválido');
  if (!resumen.trim()) problemas.push('falta el resumen');
  else if (resumen.length > 72) problemas.push('resumen muy largo');
  return problemas;
}
```

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

> 🌎 **En la vida real:** Los comandos son como los botones de una cámara: uno para ver la pantalla, otro para sacar la foto, otro para borrar, otro para mandar.

> 🌎 **Otro ejemplo:** Son como las herramientas de una caja: cada una sirve para un trabajo, y aprendes cuál usar en cada momento.

### `git status` — ver el estado

```bash
git status
```

Te dice **en qué rama estás** y **qué archivos cambiaste**. Es el comando que más vas a usar: **antes y después de todo**.

> 🌎 **En la vida real:** mirar el tablero del carro antes de arrancar: en qué marcha estás y qué luces están encendidas.

> 🌎 **Otro ejemplo:** Como mirar el carrito antes de pasar por la caja del supermercado: ves qué llevas antes de pagar.

### `git diff` — ver qué cambió

```bash
git diff
```

Muestra línea por línea lo que cambiaste: las líneas con **`-`** (rojo) se quitaron; las con **`+`** (verde) se agregaron. Para salir, presiona **q**.

> 🌎 **En la vida real:** el control de cambios de Word: lo tachado en rojo, lo nuevo en verde.

> 🌎 **Otro ejemplo:** Como comparar dos versiones de un CV con el control de cambios: ves exactamente qué palabras cambiaste.

### `git log` y `git show` — ver la historia

```bash
git log --oneline -10      # los últimos 10 commits, uno por línea
git show f333022           # qué cambió en ese commit
```

> 🌎 **En la vida real:** `git log` es hojear el álbum; `git show` es abrir una foto en grande.

> 🌎 **Otro ejemplo:** Como el historial de pedidos de una app: la lista (log) y el detalle de un pedido (show).

### `git add` y `git commit` — preparar y guardar

> 🌎 **En la vida real:** Es como armar un paquete: eliges qué meter (add) y lo cierras con una etiqueta (commit). Hasta que no lo cierras, puedes sacar o agregar cosas.

> 🌎 **Otro ejemplo:** Es como elegir fotos para un álbum: marcas las que van (add) y las pegas con una nota debajo (commit).

```bash
git add archivo.ts          # prepara un archivo
git add -A                  # prepara todos los cambios
git commit -m "fix(app): corrige el texto del tanque"
```

`-m` quiere decir "el mensaje va aquí mismo, entre comillas".

### `git push` — subir

> 🌎 **En la vida real:** Es como mandar las fotos del álbum por correo a la familia: hasta que no las mandas, solo las tienes tú.

> 🌎 **Otro ejemplo:** Es como subir un archivo a Google Drive: después de subirlo, está a salvo aunque se pierda tu teléfono.

```bash
git push
```

### `git restore` — deshacer lo no guardado

> 🌎 **En la vida real:** Es como apretar "descartar borrador" en un correo: vuelve a como estaba y lo que escribiste no se recupera.

> 🌎 **Otro ejemplo:** Es como arrugar una hoja de borrador y tirarla: vuelves a la última versión limpia del cuaderno.

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

> 🌎 **Otro ejemplo:** Como hacer una copia de un documento para probar cambios grandes sin tocar el original; si te gusta, reemplazas el original.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cada intención, su comando
lenguaje: js
pide: Completa el objeto `COMANDO` con el comando de Git para cada intención: ver qué cambió (`'git status'`), ver las líneas cambiadas (`'git diff'`), preparar un archivo (`'git add'`), guardar la foto (`'git commit'`), subir a GitHub (`'git push'`), bajar lo nuevo (`'git pull'`), ver la historia (`'git log'`) y crear una rama y pasarse a ella (`'git checkout -b'`).
--- código
const COMANDO = {
  verQueCambio: '',
  verLineas: '',
  preparar: '',
  guardar: '',
  subir: '',
  bajar: '',
  historia: '',
  ramaNueva: '',
};
--- pruebas
const correcto = { verQueCambio: 'git status', verLineas: 'git diff', preparar: 'git add', guardar: 'git commit', subir: 'git push', bajar: 'git pull', historia: 'git log', ramaNueva: 'git checkout -b' };
for (const [k, v] of Object.entries(correcto)) prueba(k, () => igual(COMANDO[k], v));
--- solución
const COMANDO = {
  verQueCambio: 'git status',
  verLineas: 'git diff',
  preparar: 'git add',
  guardar: 'git commit',
  subir: 'git push',
  bajar: 'git pull',
  historia: 'git log',
  ramaNueva: 'git checkout -b',
};
```

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

> 🌎 **En la vida real:** Es como el simulador de vuelo: practicas despegar y aterrizar sin un avión de verdad.

> 🌎 **Otro ejemplo:** Es como practicar recetas con ingredientes baratos antes de cocinar para una fiesta.

### Parte A: crear un repositorio

```bash
cd ~/Desktop            # el Escritorio (o cualquier carpeta tuya)
mkdir practica
cd practica
git init
```

- `cd` = entrar a una carpeta. `mkdir` = crear una carpeta.
- `git init` convierte la carpeta en un repositorio: desde ahora puede guardar historia.

Corre `git status`: dice que **no hay commits todavía** (*No commits yet*).

> 🌎 **En la vida real:** `git init` es comprar un cuaderno nuevo y escribir en la tapa "Diario de obra".

> 🌎 **Otro ejemplo:** Como abrir una carpeta nueva en el archivador y escribirle el nombre: desde ese momento puede guardar papeles.

### Parte B: tu primer commit

1. Crea un archivo `notas.txt` con una línea: `Mi primera nota`.
2. `git status` → aparece **en rojo**: Git lo ve, pero no está preparado (*Untracked files*).
3. `git add notas.txt`
4. `git status` → ahora está **en verde**: preparado (*Changes to be committed*).
5. `git commit -m "docs: primera nota"`
6. `git log --oneline` → ves tu commit, con su identificador.

> 🌎 **En la vida real:** en rojo = la foto está tirada en la mesa; `git add` = la pones en la pila "para pegar"; `git commit` = la pegas en el álbum con su nota.

> 🌎 **Otro ejemplo:** Como el primer depósito en una cuenta nueva del banco: queda registrado con fecha y concepto.

### Parte C: ver un cambio

> 🌎 **En la vida real:** Es como comparar dos fotos de tu sala: ayer sin cuadro, hoy con cuadro. `git diff` te señala el cuadro nuevo.

> 🌎 **Otro ejemplo:** Es como el resaltador amarillo que marca lo que agregaste a tus apuntes desde la última vez.

1. Agrega otra línea a `notas.txt`: `Segunda nota`.
2. `git diff` → ves la línea nueva con **`+`**.
3. `git add -A` y `git commit -m "docs: segunda nota"`.
4. `git log --oneline` → **dos** commits.

### Parte D: deshacer

> 🌎 **En la vida real:** Es como el botón "restablecer" de un formulario: borra lo que escribiste y lo deja como estaba guardado.

> 🌎 **Otro ejemplo:** Es como volver a cargar una partida guardada del videojuego después de perder.

1. Borra **todo** el contenido de `notas.txt` y guarda.
2. `git status` → aparece **modificado**.
3. `git restore notas.txt` → el archivo **vuelve**. Ábrelo y compruébalo.

### Parte E: una rama

1. `git switch -c experimento`
2. Agrega una línea `Esto es un experimento` y haz commit.
3. `git switch master`. Abre `notas.txt`: la línea del experimento **no está**.
4. `git switch experimento`: la línea **vuelve**.

> 📌 **Nota:** en tu Mac, un repositorio nuevo empieza con la rama **`master`**. En GitHub y en Copiloto la principal se llama **`main`**. Es lo mismo con otro nombre.

> 🌎 **En la vida real:** probarte ropa en el probador: te pones la camisa nueva (la rama `experimento`); al salir (`git switch master`) vuelves con tu ropa de siempre. La camisa no desapareció: está colgada esperando.

> 🌎 **Otro ejemplo:** Como dos borradores de una carta: escribes una versión distinta en otra hoja; la carta original sigue intacta en la primera.

### Parte F: unir

1. Ve a la principal: `git switch master`.
2. `git merge experimento`
3. Abre `notas.txt`: ahora la principal **tiene** la línea del experimento.

> 🌎 **En la vida real:** `git merge` es decidir comprar la camisa: ahora tu ropa de siempre la incluye.

> 🌎 **Otro ejemplo:** Como pasar en limpio en el cuaderno lo que probaste en el borrador y te gustó.

**Así trabajan los equipos:** cada cosa nueva en su rama, sin dañar la principal, y se une cuando está lista.

> ✋ **Para y piensa:** en la Parte E, estando en `master`, ¿por qué no ves la línea del experimento si el commit existe?

<details>
<summary>Ver la respuesta</summary>

Porque ese commit está **en la rama `experimento`**, no en `master`. Cada rama tiene su propia línea de historia. Al hacer `merge` (Parte F), lo traes a `master`.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los colores de git status
lenguaje: js
pide: En `git status`, un archivo nuevo que Git no conoce sale **en rojo** como *Untracked*; uno preparado con `add` sale **en verde** (*Changes to be committed*); uno que Git ya conocía y cambiaste sin preparar, **en rojo** como *modified*. Completa `estado(archivo)` con `{ conocido, preparado, cambiado }` → `'sin seguimiento'`, `'preparado'`, `'modificado'` o `'limpio'`.
--- código
function estado(archivo) {
  // tu código aquí
}
--- pruebas
prueba('nuevo, sin add', () => igual(estado({ conocido: false, preparado: false, cambiado: true }), 'sin seguimiento'));
prueba('con add', () => igual(estado({ conocido: false, preparado: true, cambiado: true }), 'preparado'));
prueba('conocido y cambiado, sin add', () => igual(estado({ conocido: true, preparado: false, cambiado: true }), 'modificado'));
prueba('conocido y sin cambios', () => igual(estado({ conocido: true, preparado: false, cambiado: false }), 'limpio'));
--- solución
function estado(archivo) {
  if (archivo.preparado) return 'preparado';
  if (!archivo.conocido) return 'sin seguimiento';
  if (archivo.cambiado) return 'modificado';
  return 'limpio';
}
```

```practica
elige :: ¿Qué hace `git init`? :: Sube la carpeta a GitHub :: Convierte la carpeta en un repositorio :: Borra la carpeta
elige :: Un archivo nuevo aparece en rojo en `git status`. ¿Qué quiere decir? :: Que tiene un error :: Que Git lo ve pero no está preparado :: Que ya está en GitHub
elige :: Estás en `master` y quieres traer los commits de `experimento`. ¿Qué comando? :: `git switch experimento` :: `git merge experimento` :: `git push experimento`
vf :: `master` y `main` son el mismo concepto con distinto nombre
vf :: Al cambiar de rama, los commits de la otra rama se borran
escribe :: Cuenta lo que pasó en la Parte E con tus palabras. :: Creé la rama experimento, agregué una línea y la guardé; al volver a master la línea no estaba porque vive en la otra rama; al volver a experimento, apareció.
```

> 🔁 **Repaso:** `init` (crear repo), `add` + `commit` (guardar), `diff` (ver), `restore` (deshacer), `switch -c` (rama nueva), `switch` (cambiar), `merge` (unir).

## 8. Lo que el script de Copiloto hace por ti

> 🎙️ **El profesor:** ¿te acuerdas del script `./scripts/tareas.sh` que usabas para guardar? Ahora puedes ver qué hacía por dentro: **los mismos comandos que acabas de aprender**.

1. `git status` → para revisar que no subas un archivo prohibido (el AAB, la llave del keystore o la cuenta de servicio).
2. `git add -A`
3. `git commit` con el mensaje.
4. `git push`

> 🌎 **En la vida real:** el script era un **lavadero automático**: metías el carro y salía limpio. Ahora sabes qué pasa adentro: revisar (`status`), enjabonar (`add`), secar y poner el ticket (`commit`), sacarlo a la calle (`push`).

> 🌎 **Otro ejemplo:** Como el piloto automático de un avión: hace las mismas maniobras que haría el piloto, en el mismo orden.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un script que guarda por ti, sin saltarse nada
lenguaje: js
pide: El script de Copiloto revisa antes de subir. Completa `guardarYSubir(proyecto)`: si hay archivos de secretos (`.env` o que terminen en `.key`) en `proyecto.cambiados`, **no sube** y devuelve `'hay secretos'`; si las pruebas no pasan (`proyecto.pruebasOk`), devuelve `'las pruebas fallan'`; si no hay nada cambiado, `'nada que subir'`; si todo bien, `'subido'`.
--- código
function guardarYSubir(proyecto) {
  // tu código aquí
}
--- pruebas
prueba('todo bien: subido', () => igual(guardarYSubir({ cambiados: ['src/a.ts'], pruebasOk: true }), 'subido'));
prueba('un .env: no sube', () => igual(guardarYSubir({ cambiados: ['.env', 'src/a.ts'], pruebasOk: true }), 'hay secretos'));
prueba('una llave: no sube', () => igual(guardarYSubir({ cambiados: ['firma.key'], pruebasOk: true }), 'hay secretos'));
prueba('pruebas en rojo', () => igual(guardarYSubir({ cambiados: ['src/a.ts'], pruebasOk: false }), 'las pruebas fallan'));
prueba('nada cambiado', () => igual(guardarYSubir({ cambiados: [], pruebasOk: true }), 'nada que subir'));
--- solución
function guardarYSubir(proyecto) {
  const secretos = proyecto.cambiados.filter((a) => a === '.env' || a.endsWith('/.env') || a.endsWith('.key'));
  if (secretos.length) return 'hay secretos';
  if (!proyecto.pruebasOk) return 'las pruebas fallan';
  if (proyecto.cambiados.length === 0) return 'nada que subir';
  return 'subido';
}
```

```practica
escribe :: ¿Qué hace el script de guardar de Copiloto, paso a paso? :: Revisa con git status que no haya archivos prohibidos, hace git add -A, hace git commit con el mensaje y hace git push.
vf :: El script hacía algo distinto a los comandos de Git
```

> 🔁 **Repaso:** el script de la app = `status` (revisar) + `add -A` + `commit` + `push`.

## 9. Lo que nunca se sube

> 🎙️ **El profesor:** esta parte es de **seguridad**, y es muy seria: hay cosas que **jamás** deben llegar a GitHub.

> 🌎 **En la vida real:** Es como la caja fuerte de un hotel: hay cosas que nunca se dejan sobre la cama de la habitación.

> 🌎 **Otro ejemplo:** Es como no publicar la foto de tu tarjeta de crédito en redes: una vez que se compartió, no se puede borrar de los teléfonos de los demás.

### El archivo `.gitignore`

Es la lista de lo que Git **no** debe guardar. En Copiloto, por ejemplo:
- `node_modules/` → las librerías (se reinstalan con `npm ci`).
- `android/` → se genera con `expo prebuild`.
- `store-assets/` → ahí se guardan los AAB (los archivos que se suben a Google Play).

> 🌎 **En la vida real:** la lista de cosas que **no van en la mudanza**: la basura, los muebles que se arman de nuevo allá, las cajas pesadas guardadas en otro lado.

> 🌎 **Otro ejemplo:** Como la lista de "no llevar" de un viaje en avión: líquidos de más, cosas que se compran allá, cosas pesadas que no hacen falta.

### Las claves secretas

Nunca, por ninguna razón, se suben **claves secretas**, la **llave del keystore** (con la que se firma la app para Google Play) ni la **cuenta de servicio**.

¿Por qué es tan grave? Porque **una vez que algo está en GitHub, aunque lo borres después, queda en la historia**. Cualquiera que tenga el repositorio puede ir al commit viejo y verlo.

**Si alguna vez subes una clave por error: la cambias inmediatamente.** Borrarla no alcanza.

> 🌎 **En la vida real:** mandar la foto de la llave de tu casa a un grupo de WhatsApp. Aunque borres el mensaje, alguien ya pudo verla o guardarla. Lo único seguro es **cambiar la cerradura**.

> 🌎 **Otro ejemplo:** Como la clave del cajero: si alguien la vio, no basta con taparla; vas al banco y la cambias.

> ✋ **Para y piensa:** subiste por error un archivo con una clave secreta, y en el commit siguiente lo borraste. ¿Estás a salvo?

<details>
<summary>Ver la respuesta</summary>

**No.** El commit anterior sigue en la historia, con la clave adentro. Hay que **cambiar la clave** (crear una nueva y anular la vieja).

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un .gitignore de juguete
lenguaje: js
pide: Completa `seIgnora(archivo, reglas)`: una regla que termina en `/` ignora esa **carpeta** (y todo lo de adentro, en cualquier nivel); una regla que empieza con `*` ignora los archivos que **terminan** igual (`*.log`); cualquier otra regla ignora el archivo con ese **nombre** exacto (en cualquier carpeta).
--- código
const reglas = ['node_modules/', '.env', '*.log', '*.key'];

function seIgnora(archivo, reglas) {
  // tu código aquí
}
--- pruebas
prueba('node_modules entero', () => igual(seIgnora('node_modules/vitest/index.js', reglas), true));
prueba('un node_modules adentro de otra carpeta', () => igual(seIgnora('firebase/funciones/node_modules/a.js', reglas), true));
prueba('el .env', () => igual(seIgnora('.env', reglas), true));
prueba('un .log', () => igual(seIgnora('firebase-debug.log', reglas), true));
prueba('el código sí se sube', () => igual(seIgnora('src/utils/dinero.ts', reglas), false));
prueba('.env.ejemplo no es .env', () => igual(seIgnora('.env.ejemplo', reglas), false));
--- solución
const reglas = ['node_modules/', '.env', '*.log', '*.key'];

function seIgnora(archivo, reglas) {
  const partes = archivo.split('/');
  const nombre = partes.at(-1);
  return reglas.some((r) => {
    if (r.endsWith('/')) return partes.slice(0, -1).includes(r.slice(0, -1));
    if (r.startsWith('*')) return nombre.endsWith(r.slice(1));
    return nombre === r;
  });
}
```

```practica
elige :: ¿Para qué sirve `.gitignore`? :: Para borrar archivos :: Para decirle a Git qué archivos no guardar :: Para esconder la app
vf :: Si subo una clave y la borro en el commit siguiente, ya no hay peligro
vf :: `node_modules/` no se sube porque se puede reinstalar con `npm ci`
escribe :: ¿Qué haces si subiste una clave secreta por error? :: La cambio inmediatamente (creo una nueva y anulo la vieja), porque aunque la borre queda en la historia.
```

> 🔁 **Repaso:** `.gitignore` = lo que no se guarda. Las claves nunca se suben; si pasa, se cambian, porque la historia no olvida.

## 10. Los comandos de rescate

> 🎙️ **El profesor:** la chuleta completa está en el [resumen](LECCION.md). Aquí te explico los que te sacan de apuros, porque son los que más asustan y los que más preguntan en entrevistas.

> 🌎 **En la vida real:** Los comandos de rescate son como el kit de emergencia del carro: gato, triángulo y llanta de auxilio. No los usas todos los días, pero el día que hacen falta, salvan el viaje.

> 🌎 **Otro ejemplo:** Son como los botones de emergencia de un ascensor: cada uno para un problema distinto.

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

> 🌎 **Otro ejemplo:** Como corregir un error en un libro ya impreso: no arrancas la página (rompería todos los ejemplares); sacas una fe de erratas que lo corrige.

### Guardar a un lado: `stash`

Estás a mitad de algo y necesitas cambiar de rama urgente, sin hacer commit:

```bash
git stash       # guarda tus cambios a un lado y deja la carpeta limpia
git stash pop   # los devuelve (y los quita de la lista)
```

> 🌎 **En la vida real:** estás cocinando y tocan el timbre. Pones la comida en la nevera (`stash`), atiendes, y después la sacas (`stash pop`).

> 🌎 **Otro ejemplo:** Como guardar el trabajo a medias en un cajón cuando te llaman a una reunión urgente, y sacarlo al volver.

### `fetch` y `pull`

- `git fetch` → **mira** qué hay de nuevo en GitHub, **sin** mezclarlo con lo tuyo.
- `git pull` → baja **y mezcla**. Es decir: `git pull` = `git fetch` + `git merge`.

> 🌎 **En la vida real:** `fetch` es mirar el buzón sin abrir las cartas; `pull` es abrirlas y mezclarlas con tus papeles.

> 🌎 **Otro ejemplo:** `fetch` es ver en la app del banco qué movimientos nuevos hay; `pull` es además pasarlos a tu libreta de cuentas.

### Investigar: `blame` y `bisect`

- `git blame archivo` → quién cambió cada línea y en qué commit.
- `git bisect` → busca **por mitades** en qué commit apareció un error. Entre 300 commits, lo encuentra en unos **8 intentos**.

> 🌎 **En la vida real:** `bisect` es buscar una palabra en el diccionario abriéndolo por la mitad, después por la mitad de la mitad…

> 🌎 **Otro ejemplo:** `blame` es como la firma en cada página de un contrato: sabes quién escribió qué. `bisect` es como encontrar qué día empezó una gotera revisando las fotos de la casa por mitades.

Prueba en Copiloto (**sin riesgo, solo mira**):

```bash
git blame src/data/workAppsCatalog.ts | grep my_company
```

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El comando de rescate para cada susto
lenguaje: js
pide: Completa `rescate(susto)` con el comando para cada situación: `'cambié un archivo y quiero volver'` → `'git restore'`; `'hice add de algo que no quería'` → `'git restore --staged'`; `'el mensaje del último commit está mal'` → `'git commit --amend'`; `'quiero deshacer un commit que ya subí'` → `'git revert'`; `'quiero guardar mis cambios un momento sin commit'` → `'git stash'`.
--- código
function rescate(susto) {
  // tu código aquí
}
--- pruebas
prueba('volver un archivo', () => igual(rescate('cambié un archivo y quiero volver'), 'git restore'));
prueba('sacar del add', () => igual(rescate('hice add de algo que no quería'), 'git restore --staged'));
prueba('arreglar el mensaje', () => igual(rescate('el mensaje del último commit está mal'), 'git commit --amend'));
prueba('deshacer algo ya subido', () => igual(rescate('quiero deshacer un commit que ya subí'), 'git revert'));
prueba('guardar sin commit', () => igual(rescate('quiero guardar mis cambios un momento sin commit'), 'git stash'));
--- solución
const RESCATES = {
  'cambié un archivo y quiero volver': 'git restore',
  'hice add de algo que no quería': 'git restore --staged',
  'el mensaje del último commit está mal': 'git commit --amend',
  'quiero deshacer un commit que ya subí': 'git revert',
  'quiero guardar mis cambios un momento sin commit': 'git stash',
};

function rescate(susto) {
  return RESCATES[susto];
}
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

> 🎙️ **El profesor:** hazlos en la carpeta del proyecto de práctica [Gastos del carro](https://github.com/DelvinSmart/gastos-del-carro). Las preguntas 4, 5 y 6 se responden sin computadora.

> 🌎 **En la vida real:** Es como el examen práctico de una autoescuela: sales con el instructor y haces cada maniobra tú.

1. Haz la práctica completa (Partes A a F) de la parte 7.
2. En la carpeta `gastos-del-carro`, corre `git log --oneline -5` y explica con tus palabras qué hizo cada commit.
3. Corre `git show HEAD --stat`. ¿Cuántos archivos cambió el último commit, y cuántas líneas en cada uno?
4. ¿Qué diferencia hay entre `git commit` y `git push`?
5. Si cambiaste un archivo pero no hiciste `git add`, ¿entra en el commit?
6. ¿Para qué sirve una rama?

<details>
<summary>Ver las correcciones explicadas</summary>

1. Si al final `git log --oneline` muestra 3 commits (primera nota, segunda nota, experimento) y `notas.txt` en `master` tiene las tres líneas, lo hiciste bien.
2. Lee el mensaje de cada uno: el primero creó el proyecto; los siguientes agregaron piezas para las clases (por ejemplo, la pantalla en la terminal). En Copiloto los mensajes siguen Conventional Commits: `chore(release)` es preparar una versión; `feat(...)` es algo nuevo en esa área.
3. Depende del último commit: `--stat` muestra la lista de archivos cambiados y, al lado de cada uno, cuántas líneas se agregaron (`+`) y se quitaron (`-`). Al final dice el total.
4. `git commit` guarda en tu Mac; `git push` sube a GitHub.
5. **No.** Solo entra lo que está preparado con `git add`.
6. Para trabajar en algo nuevo sin dañar la línea principal. Si sale bien, se une; si sale mal, se descarta.

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta.

> 🌎 **En la vida real:** Explicar cómo trabajas con Git es como contarle a un jefe cómo organizas tus archivos: con orden, nombres claros y copia de seguridad.

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
