# IA 8: trabajar con uno o varios agentes, y dirigirlos

> 🌎 **En la vida real:** en una cocina de restaurante trabajan varios cocineros al mismo tiempo. Si cada uno tiene su puesto (uno las carnes, otro las ensaladas, otro los postres), salen cien platos por hora. Si dos usan la misma tabla y el mismo cuchillo sin hablarse, se cortan los dedos y los platos salen mal.

> 🎙️ **El profesor dice:** {{alumno}}, ya sabes trabajar con **un** agente de IA. Esta clase es sobre trabajar con **varios a la vez**: uno arreglando una cosa, otro escribiendo otra, otro esperando que termine un proceso largo. Bien hecho, avanzas el doble. Mal hecho, un agente borra el trabajo del otro, o sube a internet algo que no estaba listo. Todo lo que vas a ver pasó de verdad, construyendo este mismo mapa de estudios, en una sola tarde. Y al final vas a ver lo de todos los días: cuándo usar una sola sesión o varias, cómo gastar menos tokens, los agentes que mandan a otros, por qué la persona tiene que dirigir, qué combinación te conviene y cómo hacer tu propio vigilante.

**La historia de esta clase (pasó de verdad):**

| Quién | Qué estaba haciendo |
|---|---|
| **Agente 1** | Mejoraba los audios del mapa y escribía una parte nueva en la clase "Cómo hice mi mapa de estudios". Los audios se estaban generando en GitHub, y eso tarda horas. |
| **Agente 2** | Tenía que escribir la clase "Cómo hice los paneles" y agregarla al mapa. |
| **El problema** | Los dos tenían que tocar **la misma carpeta** y **el mismo archivo**: las reglas de Firebase, que cuentan todas las partes de cada curso. |

En esta clase vas a ver cómo se dio cuenta el agente 2, qué hizo para no estorbar, cómo esperó y cómo se juntó todo al final.

## Parte 1. Por qué usar varios agentes (y por qué no siempre)

Un agente de IA trabaja rápido, pero hace **una cosa a la vez**. Mientras corre las pruebas, o espera que GitHub publique algo, o escribe una clase larga, tú esperas. Con dos o tres agentes, uno trabaja mientras el otro espera.

> 🌎 **En la vida real:** es como lavar la ropa y cocinar al mismo tiempo. La lavadora trabaja sola cuarenta minutos; no te quedas mirándola: mientras tanto cocinas.

> 🌎 **Otro ejemplo:** Es como un taller mecánico con tres elevadores: mientras un carro espera un repuesto, en el otro elevador se cambia el aceite de otro carro.

### Pero coordinar también cuesta

Cada agente nuevo es una persona más en la cocina. Si las tareas **dependen** una de otra, o tocan **las mismas cosas**, tener más agentes no ayuda: estorba.

| Situación | ¿Varios agentes? |
|---|---|
| Escribir una clase nueva mientras otro agente genera audios | ✅ Sí: cosas distintas, archivos distintos |
| Dos agentes arreglando el mismo error en el mismo archivo | ❌ No: se pisan |
| Uno escribe el código y otro lo prueba **cuando el primero termine** | ⚠️ Sí, pero en orden: el segundo espera |
| Buscar en muchos archivos mientras tú sigues con otra cosa | ✅ Sí: buscar no cambia nada |

> 🌎 **En la vida real:** dos pintores pueden pintar la casa más rápido si uno pinta la sala y el otro la cocina. Si los dos pintan la misma pared, uno de rojo y otro de azul, sale un desastre.

> 🌎 **Otro ejemplo:** Es como armar un rompecabezas entre varios: funciona si cada uno arma una esquina; no funciona si todos quieren poner la misma pieza.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Conviene en paralelo?
lenguaje: js
pide: Completa `convieneParalelo(a, b)`: dos tareas `{ nombre, archivos, necesita }`. **No** conviene (`false`) si una necesita el resultado de la otra (su `necesita` incluye el nombre de la otra) o si tocan algún archivo en común. Si no, `true`.
--- código
function convieneParalelo(a, b) {
  // tu código aquí
}
--- pruebas
const audios = { nombre: 'audios', archivos: ['herramientas/audio/voz.mjs', '.github/workflows/audios.yml'], necesita: [] };
const clase = { nombre: 'clase de paneles', archivos: ['77-como-hice-los-paneles/LECCION.md'], necesita: [] };
const reglas = { nombre: 'reglas finales', archivos: ['firebase/firestore.rules'], necesita: ['audios', 'clase de paneles'] };
prueba('independientes', () => igual(convieneParalelo(audios, clase), true));
prueba('una necesita a la otra', () => igual([convieneParalelo(audios, reglas), convieneParalelo(reglas, clase)], [false, false]));
prueba('tocan el mismo archivo', () => igual(convieneParalelo(clase, { nombre: 'arreglo', archivos: ['77-como-hice-los-paneles/LECCION.md'], necesita: [] }), false));
--- solución
function convieneParalelo(a, b) {
  if (a.necesita.includes(b.nombre) || b.necesita.includes(a.nombre)) return false;
  return !a.archivos.some((x) => b.archivos.includes(x));
}
```

```practica
vf :: Un agente de IA, solo, hace una cosa a la vez
vf :: Más agentes siempre significa terminar más rápido
elige :: ¿Cuál de estas tareas se puede hacer en paralelo sin problema? :: Dos agentes arreglando el mismo archivo :: Escribir una clase nueva mientras otro agente genera los audios en GitHub :: Probar un código que todavía no está escrito
escribe :: Con tus palabras y un ejemplo de la vida real: ¿cuándo conviene tener varios agentes y cuándo no? :: Conviene cuando las tareas son independientes y tocan cosas distintas, como lavar la ropa mientras cocinas. No conviene cuando dependen una de otra o tocan lo mismo, como dos pintores en la misma pared.
```

## Parte 2. Qué pasa cuando dos agentes trabajan en la misma carpeta

Un proyecto vive en una **carpeta** de tu computadora. Si dos agentes trabajan en la misma carpeta, es como si dos personas escribieran en **el mismo cuaderno al mismo tiempo**. Pueden pasar tres cosas malas.

### 1. Uno pisa el archivo del otro

Si los dos cambian el mismo archivo, gana el último que guarda. El cambio del primero desaparece, y muchas veces nadie se da cuenta.

> 🌎 **En la vida real:** es como dos personas que llenan la misma planilla de turnos en la pared: la segunda borra y escribe la suya, y el turno de la primera desaparece.

### 2. Uno sube el trabajo del otro

Recuerda la clase de Git: los cambios que todavía no subiste están en tu carpeta "sueltos". Mucha gente (y muchos agentes) sube los cambios con:

```bash
git add -A && git commit -m "Mi cambio" && git push
```

`git add -A` quiere decir "**todo** lo que cambió en la carpeta". Si otro agente dejó su trabajo a medias en la misma carpeta, ese comando lo sube también, con tu mensaje, aunque no esté terminado.

En nuestra historia, eso era peligroso de verdad. Si el agente 2 dejaba la clase de los paneles en la carpeta, el agente 1 la iba a subir junto con sus audios. La clase nueva aparecería en el mapa **antes** de actualizar las reglas de Firebase, y nadie podría terminar el curso de programación.

> 🌎 **En la vida real:** es como meter en la misma caja de mudanza tus cosas y las de tu compañero de cuarto: cuando la abren en la casa nueva, nadie sabe qué era de quién.

> 🌎 **Otro ejemplo:** Es como mandar a imprimir "todo lo que está en la mesa": se imprime también el borrador de otra persona, que todavía no estaba listo.

### 3. Los archivos que "cuentan todo"

Hay archivos especiales que **resumen** a muchos otros. En este mapa, las reglas de Firebase (`firestore.rules`) se arman leyendo **todas** las clases y cuentan sus partes. Si un agente agrega una parte a una clase y otro agrega una clase entera, **los dos** necesitan cambiar las reglas. Ese archivo es un **punto de choque**.

Otros archivos así: el `package-lock.json` (la lista de todas las librerías), un índice con la lista de todos los estudios, un catálogo como `cursos.js`.

> 🌎 **En la vida real:** es como el inventario de una tienda: si dos empleados reciben mercadería al mismo tiempo y cada uno corrige el total en la misma hoja, el número final sale mal.

> 🌎 **Otro ejemplo:** Es como la lista de invitados de una fiesta que llevan dos personas: si cada una agrega gente y cuenta los platos por su lado, el día de la fiesta faltan sillas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que git add -A subiría de otro
lenguaje: js
pide: `git add -A` sube **todo** lo que cambió en la carpeta. Completa `deOtros(cambiados, mios)`: los archivos cambiados que **no** son tuyos (los que subirías sin querer). Y `addSeguro(mios)`: el comando que sube **solo** los tuyos: `git add -- ` seguido de los archivos separados por espacio (o `''` si no hay ninguno).
--- código
function deOtros(cambiados, mios) {
  // tu código aquí
}

function addSeguro(mios) {
  // tu código aquí
}
--- pruebas
const cambiados = ['77-como-hice-los-paneles/LECCION.md', 'web/cursos.js', 'herramientas/audio/voz.mjs', '18-como-hice-mi-mapa/CLASE-GUIADA.md'];
const mios = ['77-como-hice-los-paneles/LECCION.md', 'web/cursos.js'];
prueba('lo del otro agente', () => igual(deOtros(cambiados, mios), ['herramientas/audio/voz.mjs', '18-como-hice-mi-mapa/CLASE-GUIADA.md']));
prueba('subir solo lo tuyo', () => igual(addSeguro(mios), 'git add -- 77-como-hice-los-paneles/LECCION.md web/cursos.js'));
prueba('nada que subir', () => igual(addSeguro([]), ''));
--- solución
function deOtros(cambiados, mios) {
  return cambiados.filter((a) => !mios.includes(a));
}

function addSeguro(mios) {
  return mios.length ? `git add -- ${mios.join(' ')}` : '';
}
```

```practica
vf :: git add -A sube solo los archivos que tú cambiaste
vf :: Si dos agentes guardan el mismo archivo, el cambio del primero puede desaparecer sin aviso
elige :: ¿Por qué firestore.rules era un punto de choque? :: Porque es muy largo :: Porque se arma leyendo todas las clases, y los dos agentes necesitaban cambiarlo :: Porque está en otro idioma
elige :: ¿Qué pasaría si el agente 1 subía la clase de los paneles junto con sus audios? :: Nada, todo funcionaría igual :: La clase aparecería antes de actualizar las reglas, y nadie podría terminar el curso :: Los audios saldrían con otra voz
escribe :: Explica con un ejemplo de la vida real por qué es peligroso que dos agentes trabajen en la misma carpeta. :: Es como dos personas escribiendo en el mismo cuaderno: una puede borrar lo de la otra, o arrancar la hoja y entregarla con lo que la otra todavía no terminó.
```

## Parte 3. Antes de tocar: mirar si hay alguien trabajando

La primera regla es sencilla: **antes de cambiar nada, mira si alguien está trabajando ahí.** Así lo hizo el agente 2.

### Pregunta 1: ¿hay cambios sin subir?

```bash
git status --short
```

Muestra los archivos que cambiaron y todavía no se subieron. Ese día mostró:

```text
 M .github/workflows/audios.yml
 M 18-como-hice-mi-mapa/CLASE-GUIADA.md
 M firebase/firestore.rules
 M herramientas/audio/generar-audios.mjs
 M herramientas/audio/voz.mjs
```

La `M` quiere decir "modificado". Ninguno era del agente 2: alguien más estaba trabajando.

### Pregunta 2: ¿cuándo cambiaron?

```bash
ls -l 18-como-hice-mi-mapa/CLASE-GUIADA.md
```

Muestra la hora del último cambio: **hacía 4 minutos**. Un cambio de hace 4 minutos casi seguro es de alguien que sigue trabajando. Uno de hace tres días, probablemente quedó olvidado.

### Pregunta 3: ¿qué está haciendo?

```bash
git diff 18-como-hice-mi-mapa/CLASE-GUIADA.md
```

Muestra **qué** cambió, línea por línea. Ahí se vio que el agente 1 estaba escribiendo una parte nueva sobre los audios. O sea: estaba trabajando justo en la misma etapa del mapa, y había regenerado las reglas.

### Pregunta 4: ¿hay otra sesión abierta?

Las herramientas como Claude Code muestran las otras sesiones abiertas en tu computadora. Y siempre puedes preguntarle a la persona: "¿hay otro agente trabajando en esto?".

> 🌎 **En la vida real:** es como entrar a una oficina compartida: antes de sentarte, miras si en el escritorio hay una taza de café caliente y papeles abiertos. Si el café está caliente, alguien va a volver.

> 🌎 **Otro ejemplo:** Es como el baño de una casa: antes de entrar, golpeas la puerta. No esperas a estar adentro para descubrir que estaba ocupado.

> 🌎 **Otro ejemplo más:** Es como un mecánico que encuentra un carro con el capó abierto y herramientas encima: no empieza a desarmarlo, pregunta de quién es el trabajo.

> ⚠️ Esto también vale para ti, sin IA: si trabajas en la computadora y en el iPad, o en dos ventanas, revisa `git status` antes de empezar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Hay alguien trabajando aquí?
lenguaje: js
pide: Completa `leerStatus(salida)`: de la salida de `git status --short`, devuelve los archivos (sin las dos letras del principio ni los espacios). Y `alguienTrabajando(salida, minutosDesdeElCambio)`: los archivos de esa salida que cambiaron hace **menos de 30 minutos** (`minutosDesdeElCambio` dice cuántos minutos tiene cada uno). Esos casi seguro son de alguien que sigue trabajando.
--- código
function leerStatus(salida) {
  // tu código aquí
}

function alguienTrabajando(salida, minutosDesdeElCambio) {
  // tu código aquí
}
--- pruebas
const salida = ` M .github/workflows/audios.yml
 M 18-como-hice-mi-mapa/CLASE-GUIADA.md
?? notas-viejas.txt`;
const minutos = { '.github/workflows/audios.yml': 12, '18-como-hice-mi-mapa/CLASE-GUIADA.md': 4, 'notas-viejas.txt': 4320 };
prueba('los archivos', () => igual(leerStatus(salida), ['.github/workflows/audios.yml', '18-como-hice-mi-mapa/CLASE-GUIADA.md', 'notas-viejas.txt']));
prueba('los recientes son de alguien que sigue trabajando', () => igual(alguienTrabajando(salida, minutos), ['.github/workflows/audios.yml', '18-como-hice-mi-mapa/CLASE-GUIADA.md']));
prueba('una carpeta limpia', () => igual(leerStatus(''), []));
--- solución
function leerStatus(salida) {
  return salida
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.slice(3).trim());
}

function alguienTrabajando(salida, minutosDesdeElCambio) {
  return leerStatus(salida).filter((a) => minutosDesdeElCambio[a] < 30);
}
```

```practica
vf :: git status --short muestra los archivos que cambiaron y todavía no se subieron
vf :: Si un archivo cambió hace 4 minutos, lo más probable es que nadie esté trabajando en él
elige :: ¿Qué comando muestra qué cambió dentro de un archivo, línea por línea? :: git status :: ls -l :: git diff
elige :: Encuentras cambios sin subir que no son tuyos. ¿Qué haces primero? :: Los subes con los tuyos :: Los borras para empezar limpio :: Averiguas de quién son y si alguien sigue trabajando, antes de tocar nada
escribe :: Escribe las cuatro preguntas que te haces antes de tocar una carpeta donde podría haber otro agente. :: ¿Hay cambios sin subir? (git status). ¿Cuándo cambiaron? (la hora del archivo). ¿Qué está haciendo? (git diff). ¿Hay otra sesión abierta o alguien que me pueda decir? (las sesiones, o preguntarle a la persona).
```

## Parte 4. La copia aparte: ramas y worktrees

El agente 2 no podía trabajar en la carpeta del agente 1. Pero tampoco quería quedarse horas de brazos cruzados. La solución fue **trabajar en una copia aparte**.

### Lo que ya sabes: las ramas

En la clase de Git viste las **ramas**: una línea de trabajo aparte dentro del mismo proyecto. El problema es que una carpeta solo puede estar en **una rama a la vez**. Si el agente 2 cambiaba de rama en esa carpeta, le cambiaba los archivos al agente 1 en plena tarea.

### Lo nuevo: el worktree

Git permite tener **varias carpetas del mismo proyecto**, cada una en su propia rama. Se llaman **worktrees** ("árboles de trabajo"). Comparten la historia, pero cada una tiene sus propios archivos.

```bash
git worktree add -b clase-paneles ../_aprender-clase-paneles HEAD
```

Palabra por palabra:

| Parte | Qué quiere decir |
|---|---|
| `git worktree add` | "Crea otra carpeta de trabajo de este proyecto" |
| `-b clase-paneles` | "…con una rama nueva que se llama clase-paneles" |
| `../_aprender-clase-paneles` | "…en esta carpeta, al lado de la original" |
| `HEAD` | "…empezando desde el último commit subido" |

Ojo con `HEAD`: la copia empieza desde lo **subido**, no desde los cambios sueltos del agente 1. Por eso la copia está "limpia": no tiene el trabajo a medias del otro, y el otro no ve nada de la copia.

> 🌎 **En la vida real:** es como sacar una fotocopia del plano de una casa para dibujar tu idea encima. Puedes rayarla todo lo que quieras; el plano original, que está usando el arquitecto, sigue intacto.

> 🌎 **Otro ejemplo:** Es como tener dos escritorios con el mismo libro de recetas: en uno alguien está cocinando la receta 18; en el otro tú pruebas la receta 77, sin mezclar los ingredientes.

> 🌎 **Otro ejemplo más:** Es como un ensayo de teatro en una sala aparte: los actores practican la escena nueva mientras en el escenario principal sigue la función.

### Lo que la copia NO trae

Git solo copia lo que está **guardado en Git**. Hay cosas que, a propósito, no lo están:

- **Los archivos privados**, como `respuestas.json` (las respuestas de las prácticas). Están en `.gitignore` para que nunca se suban.
- **Las librerías instaladas** (`node_modules`): son pesadas y se pueden reinstalar.

Para probar en la copia, el agente 2 copió el archivo privado **dentro de la misma computadora** y "enlazó" las librerías de la carpeta original, en vez de instalarlas otra vez:

```bash
cp ../Aprender/firebase/funciones/respuestas.json firebase/funciones/
ln -s ../Aprender/firebase/funciones/node_modules firebase/funciones/node_modules
```

- `cp` copia un archivo.
- `ln -s` crea un **enlace**: un "acceso directo" que apunta a la carpeta original, sin copiarla.

> ⚠️ El archivo privado se copia **solo dentro de tu computadora**. Nunca se sube: sigue en `.gitignore` también en la copia.

> 🌎 **En la vida real:** el enlace es como el acceso directo del escritorio de tu computadora: abre el programa que está en otro lado, sin tenerlo dos veces.

### Lo que el agente 2 hizo en la copia

1. Puso la clase de los paneles en el mapa.
2. Separó las respuestas de las prácticas al archivo privado.
3. Regeneró las reglas.
4. Corrió todas las pruebas (todas pasaron).
5. La miró en el navegador, en tamaño de celular, y arregló dos cosas: un título y dos dibujos que se cortaban en pantallas chicas.

Todo eso **sin tocar** la carpeta del agente 1.

### Cuando ya no sirve: borrar la copia

```bash
git worktree remove ../_aprender-clase-paneles
```

Borra la carpeta de la copia. La rama, si tenía commits, queda guardada en Git.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La copia aparte
lenguaje: js
pide: Completa `comandoWorktree(rama, carpeta)`: devuelve `git worktree add -b RAMA ../CARPETA HEAD`. El nombre de la rama no puede tener espacios ni empezar con `-` (si no, lanza `Error('Nombre de rama inválido')`). Y `loQueNoTrae(archivos, ignorados)`: de los archivos que necesitas para probar, los que **no** vienen en la copia porque están ignorados (un ignorado como `node_modules/` cubre todo lo que empieza así).
--- código
function comandoWorktree(rama, carpeta) {
  // tu código aquí
}

function loQueNoTrae(archivos, ignorados) {
  // tu código aquí
}
--- pruebas
prueba('el comando', () => igual(comandoWorktree('clase-paneles', '_aprender-clase-paneles'), 'git worktree add -b clase-paneles ../_aprender-clase-paneles HEAD'));
prueba('ramas que no valen', () => igual(['clase paneles', '-x'].map((r) => { try { comandoWorktree(r, 'c'); return 'no lanzó'; } catch (e) { return e.message; } }), ['Nombre de rama inválido', 'Nombre de rama inválido']));
const ignorados = ['firebase/funciones/respuestas.json', 'node_modules/', 'firebase/funciones/node_modules/'];
prueba('lo privado y las librerías no vienen', () => igual(loQueNoTrae(['firebase/funciones/respuestas.json', 'web/cursos.js', 'firebase/funciones/node_modules/firebase-admin/package.json'], ignorados), ['firebase/funciones/respuestas.json', 'firebase/funciones/node_modules/firebase-admin/package.json']));
--- solución
function comandoWorktree(rama, carpeta) {
  if (/\s/.test(rama) || rama.startsWith('-')) throw new Error('Nombre de rama inválido');
  return `git worktree add -b ${rama} ../${carpeta} HEAD`;
}

function loQueNoTrae(archivos, ignorados) {
  return archivos.filter((a) => ignorados.some((i) => (i.endsWith('/') ? a.startsWith(i) : a === i)));
}
```

```practica
vf :: Un worktree es otra carpeta del mismo proyecto, con su propia rama
vf :: Una copia hecha con git worktree desde HEAD trae también los cambios sin subir del otro agente
vf :: Los archivos que están en .gitignore no aparecen en la copia
elige :: ¿Por qué no bastaba con cambiar de rama en la misma carpeta? :: Porque las ramas no existen en este proyecto :: Porque una carpeta está en una sola rama a la vez, y le cambiaría los archivos al otro agente :: Porque es más lento
elige :: ¿Qué hace ln -s? :: Borra una carpeta :: Crea un enlace (acceso directo) a una carpeta que está en otro lado :: Sube un archivo a GitHub
escribe :: Explica con un ejemplo de la vida real qué es un worktree y para qué lo usó el agente 2. :: Es como una fotocopia del plano de una casa: dibujas tu idea encima sin tocar el original que usa otro. El agente 2 lo usó para preparar la clase de los paneles, regenerar las reglas y correr las pruebas, sin tocar la carpeta donde trabajaba el agente 1.
```

## Parte 5. Repartir el trabajo: qué se puede hacer en paralelo

No todo se puede adelantar. La pregunta es: **¿esta tarea necesita algo que todavía no está, o toca algo que otro está usando?**

Así se repartió ese día:

| Tarea | ¿Se pudo adelantar? | Por qué |
|---|---|---|
| Escribir el borrador de la clase | ✅ Sí, fuera del proyecto | No toca nada del otro agente |
| Ponerla en el mapa, en la copia | ✅ Sí, en la copia | Es otra carpeta |
| Correr las pruebas, en la copia | ✅ Sí | Solo leen y comprueban |
| Regenerar las reglas **finales** | ❌ No | Tienen que contar las partes de los dos agentes |
| Subir las reglas a Firebase | ❌ No | Primero tiene que estar todo junto, y la persona tiene que aprobarlo |
| Publicar la página | ❌ No | Va después de las reglas |

Fíjate en una idea importante: el agente 2 regeneró las reglas en la copia **para probar**, pero sabía que esas no eran las finales. Las finales se arman **una sola vez, al final**, con el trabajo de los dos.

> 🌎 **En la vida real:** en una construcción, el electricista puede preparar los cables mientras el albañil levanta las paredes, pero no puede **instalarlos** hasta que las paredes estén hechas.

> 🌎 **Otro ejemplo:** Es como preparar una fiesta entre dos: uno compra la comida y el otro decora; pero la lista final de invitados la cierran juntos, una sola vez, para que no falten sillas.

> 🌎 **Otro ejemplo más:** Es como estudiar para un examen mientras esperas el bus: puedes repasar, pero no puedes **entregar** el examen hasta llegar al colegio.

### Una regla para repartir

Antes de darle una tarea a un agente, contesta:

1. ¿Qué **archivos** va a tocar? Si otro agente toca los mismos, no van al mismo tiempo.
2. ¿**Necesita** el resultado de otro agente? Si sí, espera.
3. ¿Toca algo **fuera** de tu computadora (internet, Firebase, GitHub)? Si sí, va al final y con tu permiso.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Repartir: ahora, después o al final con permiso
lenguaje: js
pide: Completa `repartir(tareas)`: cada tarea `{ nombre, necesita, afuera }`. Las que tocan algo **afuera** (`afuera: true`: Firebase, GitHub) van a `alFinal`. De las demás, las que no necesitan nada van a `ahora`; las que necesitan algo, a `despues`. Devuelve `{ ahora, despues, alFinal }` con los nombres, en el orden de la lista.
--- código
function repartir(tareas) {
  // tu código aquí
}
--- pruebas
const tareas = [
  { nombre: 'clase de paneles', necesita: [], afuera: false },
  { nombre: 'audios', necesita: [], afuera: false },
  { nombre: 'reglas finales', necesita: ['clase de paneles', 'audios'], afuera: false },
  { nombre: 'subir a Firebase', necesita: ['reglas finales'], afuera: true },
  { nombre: 'publicar la página', necesita: ['subir a Firebase'], afuera: true },
];
prueba('el reparto', () => igual(repartir(tareas), { ahora: ['clase de paneles', 'audios'], despues: ['reglas finales'], alFinal: ['subir a Firebase', 'publicar la página'] }));
prueba('sin tareas', () => igual(repartir([]), { ahora: [], despues: [], alFinal: [] }));
--- solución
function repartir(tareas) {
  const r = { ahora: [], despues: [], alFinal: [] };
  for (const t of tareas) {
    if (t.afuera) r.alFinal.push(t.nombre);
    else if (t.necesita.length === 0) r.ahora.push(t.nombre);
    else r.despues.push(t.nombre);
  }
  return r;
}
```

```practica
vf :: Escribir el borrador de una clase fuera del proyecto se puede hacer mientras otro agente trabaja
vf :: Las reglas finales se pueden regenerar antes de que el otro agente termine su parte
elige :: ¿Cuál de estas preguntas NO forma parte de la regla para repartir? :: ¿Qué archivos va a tocar? :: ¿Necesita el resultado de otro agente? :: ¿Qué modelo de IA es más inteligente?
elige :: ¿Por qué subir las reglas a Firebase va al final? :: Porque Firebase cierra de noche :: Porque primero tiene que estar todo junto y la persona tiene que aprobarlo :: Porque es el paso más fácil
escribe :: Piensa en dos tareas de tu app y di si se pueden hacer en paralelo, usando las tres preguntas. :: Por ejemplo: cambiar los textos de la pantalla de gastos y escribir pruebas para el cálculo del tanque tocan archivos distintos y no dependen una de otra: sí. En cambio, cambiar el formato de un dato y actualizar la pantalla que lo usa dependen una de otra: van en orden.
```

## Parte 6. Esperar bien

El agente 1 estaba esperando que GitHub terminara de generar los audios, y eso podía tardar horas. El agente 2 tenía que esperar al agente 1. ¿Cómo se espera bien?

### Esperar mal: preguntar a cada rato

Abrir GitHub cada dos minutos para ver si terminó, o preguntarle a la persona "¿ya terminó?" una y otra vez, gasta tiempo, atención y, con la IA, también dinero (cada pregunta usa tokens, Tema 30).

> 🌎 **En la vida real:** es como el niño en el asiento de atrás que pregunta "¿ya llegamos?" cada minuto. El viaje no se hace más corto.

### Esperar bien: un vigilante que avisa

Mejor dejar un pequeño programa que **mira solo** y **avisa una vez** cuando pasa lo que esperas. El agente 2 dejó uno así (simplificado):

```bash
until [ -z "$(git status --short -- 18-como-hice-mi-mapa firebase/firestore.rules)" ]; do
  sleep 60
done
echo "El otro agente ya subió su trabajo"
```

- `until … do … done` quiere decir "**repite** esto **hasta que** se cumpla la condición".
- La condición: que `git status` ya no muestre cambios sueltos en esos archivos (o sea, que el agente 1 los subió).
- `sleep 60` espera un minuto entre una mirada y otra, para no gastar.
- Cuando se cumple, avisa y termina.

**¿Y esto gasta tokens?** No, mientras espera. El vigilante es un programa común de la computadora, no la IA: mirar `git status` y dormir un minuto no le pregunta nada a ningún modelo. La IA gasta tokens solo **una vez**, cuando el vigilante termina y la despierta para leer el aviso y seguir. Si en vez de eso la IA mirara ella misma cada minuto, cada mirada sería una pregunta nueva, con tokens.

> 🌎 **En la vida real:** es como dejar al perro cuidando la puerta: no le pagas por hora; solo te levantas del sillón cuando ladra.

> 🌎 **En la vida real:** es como poner la alarma del horno en vez de abrir la puerta cada dos minutos para ver si la torta está lista.

> 🌎 **Otro ejemplo:** Es como pedirle al mecánico que te mande un mensaje cuando el carro esté listo, en vez de ir al taller cada hora.

### El vigilante tiene que avisar también cuando algo sale mal

Un vigilante que solo avisa cuando todo sale bien es peligroso: si algo se rompe, se queda callado, y **el silencio parece "todavía no"**. Por eso el primer vigilante del agente 2 tenía **dos** salidas: "terminó" o "nada cambia hace 20 minutos".

### El error que pasó de verdad

El primer vigilante terminó enseguida diciendo "**nada cambia hace 20 minutos**". Parecía que el agente 1 se había quedado quieto. Pero no: el vigilante estaba **roto**. Usaba una forma de escribir la hora (`-newermt '-20 minutes'`) que la computadora no entendía. Como la búsqueda fallaba, no encontraba nada, y "no encontré nada" se leyó como "nada cambió".

¿Cómo se descubrió? **Leyendo por qué terminó** antes de hacer nada. En el resultado decía `Invalid timestamp` ("hora inválida"). Se arregló (`-mmin -20`, "cambiado en los últimos 20 minutos") y se volvió a poner a vigilar.

> 🌎 **En la vida real:** es como un detector de humo sin pilas: no suena, y uno cree que no hay humo. Por eso los detectores tienen un botón de prueba.

> 🌎 **Otro ejemplo:** Es como el termómetro roto que siempre marca 36 °C: "no tienes fiebre" no quiere decir nada si el termómetro no funciona.

> 🎙️ **El profesor dice:** la lección es esta: **cuando algo termina, lee por qué terminó, antes de actuar.** Un aviso no es una prueba; es una pista que hay que comprobar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un vigilante que también avisa lo malo
lenguaje: js
pide: Completa `vigilar(mirar, maximo)`: llama a `mirar()` hasta `maximo` veces. `mirar` devuelve `'listo'`, `'error'` o `'todavía'`. Termina en cuanto sale `'listo'` o `'error'`, y devuelve `{ estado, vueltas }` con lo que salió y cuántas veces miró. Si llega al máximo sin respuesta, `{ estado: 'se cansó', vueltas: maximo }`: el silencio **no** es "todavía bien".
--- código
function vigilar(mirar, maximo) {
  // tu código aquí
}
--- pruebas
const secuencia = (lista) => { let i = 0; return () => lista[i++] ?? 'todavía'; };
prueba('termina bien', () => igual(vigilar(secuencia(['todavía', 'todavía', 'listo']), 10), { estado: 'listo', vueltas: 3 }));
prueba('avisa el error', () => igual(vigilar(secuencia(['todavía', 'error', 'listo']), 10), { estado: 'error', vueltas: 2 }));
prueba('si nunca contesta, lo dice', () => igual(vigilar(secuencia([]), 5), { estado: 'se cansó', vueltas: 5 }));
--- solución
function vigilar(mirar, maximo) {
  for (let vueltas = 1; vueltas <= maximo; vueltas++) {
    const estado = mirar();
    if (estado === 'listo' || estado === 'error') return { estado, vueltas };
  }
  return { estado: 'se cansó', vueltas: maximo };
}
```

```practica
vf :: Un vigilante que avisa solo cuando todo sale bien puede quedarse callado si algo se rompe
vf :: Si el vigilante dice "nada cambió", seguro que el otro agente se quedó quieto
elige :: ¿Qué hace until … do … done? :: Repite una sola vez :: Repite hasta que se cumpla la condición :: Borra los archivos
elige :: ¿Por qué el vigilante espera 60 segundos entre una mirada y otra? :: Porque Git solo funciona una vez por minuto :: Para no gastar mirando sin parar algo que tarda horas :: Para que el otro agente trabaje más rápido
elige :: ¿Cómo se descubrió que el primer vigilante estaba roto? :: Por suerte :: Leyendo por qué terminó: decía "Invalid timestamp" :: Porque el otro agente avisó
escribe :: Explica con un ejemplo de la vida real por qué hay que leer por qué terminó algo antes de actuar. :: Como un termómetro roto que siempre marca 36 °C: si confías sin revisar, crees que no hay fiebre. El vigilante dijo "nada cambió", pero en realidad estaba roto; leyendo el resultado se vio el error y se arregló antes de hacer algo equivocado.
```

## Parte 7. Juntar todo, en el orden correcto

Cuando el agente 1 sube su trabajo, empieza la parte más delicada: **juntar**.

### Los pasos, en orden

1. **Traer lo último.** La carpeta real ahora tiene el trabajo del agente 1 ya subido.
2. **Pasar lo de la copia.** La clase de los paneles y su lugar en el mapa pasan a la carpeta real.
3. **Regenerar los archivos que "cuentan todo", una sola vez.** Las reglas se arman de nuevo y ahora cuentan las partes de **los dos**: la parte nueva de la clase 18 y las 12 de la clase de los paneles.
4. **Correr todas las pruebas otra vez**, con todo junto. Que pasaran en la copia no alcanza: ahora hay más cosas.
5. **Pedir permiso** a la persona para lo que se hace afuera: subir las reglas y la función a Firebase.
6. **Subir a Firebase primero** y **publicar la página después**. Al revés, por unos minutos nadie podría terminar el curso.
7. **Un commit por cambio**, con un mensaje claro de qué es cada cosa. Nunca el trabajo de otro escondido en tu commit.

> 🌎 **En la vida real:** es como dos equipos que construyen un puente desde las dos orillas: cuando se encuentran en el medio, se mide todo otra vez antes de soldar, y recién después se abre al tráfico.

> 🌎 **Otro ejemplo:** Es como juntar dos partes de un trabajo del colegio hecho en grupo: se pegan, se lee todo de corrido para ver que encaje, se arregla el índice una sola vez al final, y recién ahí se entrega.

> 🌎 **Otro ejemplo más:** Es como cambiar la cerradura antes de anunciar la dirección nueva: si anuncias primero, por un rato la puerta queda abierta.

### ¿Por qué un commit por cambio?

Si algo sale mal, se puede deshacer **solo** lo que falló. Si los audios y la clase de los paneles van en el mismo commit, deshacer uno deshace el otro.

> 🌎 **En la vida real:** es como guardar los tornillos de cada mueble en bolsitas separadas con su nombre: si un mueble viene mal, devuelves esa bolsa y no todas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Juntar en el orden correcto
lenguaje: js
pide: Completa `problemasDeOrden(pasos)`: revisa una lista de pasos (textos) y devuelve los problemas, en este orden: `'publicar antes de Firebase'` si `'publicar'` aparece antes que `'firebase'`; `'regenerar más de una vez'` si `'regenerar reglas'` aparece más de una vez; `'falta probar después de juntar'` si no hay un `'pruebas'` **después** de `'juntar'`; `'falta pedir permiso'` si `'firebase'` está y no hay un `'permiso'` antes.
--- código
function problemasDeOrden(pasos) {
  // tu código aquí
}
--- pruebas
const bien = ['traer lo último', 'juntar', 'regenerar reglas', 'pruebas', 'permiso', 'firebase', 'publicar'];
prueba('el orden bueno', () => igual(problemasDeOrden(bien), []));
prueba('publicar primero', () => igual(problemasDeOrden(['juntar', 'pruebas', 'permiso', 'publicar', 'firebase']), ['publicar antes de Firebase']));
prueba('todo mal', () => igual(problemasDeOrden(['pruebas', 'regenerar reglas', 'juntar', 'regenerar reglas', 'firebase', 'publicar']), ['regenerar más de una vez', 'falta probar después de juntar', 'falta pedir permiso']));
--- solución
function problemasDeOrden(pasos) {
  const problemas = [];
  const i = (p) => pasos.indexOf(p);
  if (i('publicar') !== -1 && i('firebase') !== -1 && i('publicar') < i('firebase')) problemas.push('publicar antes de Firebase');
  if (pasos.filter((p) => p === 'regenerar reglas').length > 1) problemas.push('regenerar más de una vez');
  if (!pasos.slice(i('juntar') + 1).includes('pruebas')) problemas.push('falta probar después de juntar');
  if (i('firebase') !== -1 && !pasos.slice(0, i('firebase')).includes('permiso')) problemas.push('falta pedir permiso');
  return problemas;
}
```

```practica
vf :: Si las pruebas pasaron en la copia, no hace falta correrlas otra vez después de juntar
vf :: Las reglas se suben a Firebase antes de publicar la página nueva
elige :: ¿Por qué conviene un commit por cada cambio? :: Porque GitHub cobra por commit :: Para poder deshacer solo lo que falló, sin deshacer lo demás :: Porque los commits grandes no se pueden subir
elige :: ¿Cuántas veces se regeneran las reglas finales al juntar? :: Una por cada agente :: Una sola vez, al final, con el trabajo de los dos :: Ninguna, se escriben a mano
escribe :: Cuenta en orden los pasos para juntar el trabajo de dos agentes. :: Traer lo último que subió el otro; pasar lo mío desde la copia; regenerar una sola vez los archivos que cuentan todo; correr todas las pruebas otra vez; pedir permiso para lo que va afuera; subir primero a Firebase y después publicar; un commit por cada cambio.
```

## Parte 8. Tú eres el jefe de obra

Los agentes no se hablan entre ellos: **se comunican a través de ti**. Ese día, el agente 2 no sabía qué estaba haciendo el agente 1 hasta que la persona pegó el mensaje del otro: "La corrida de Daniela sigue en el paso 'Generar solo los audios que cambiaron'…". Con eso supo que tenía que esperar a que se terminaran de generar los audios y a que se subieran los cambios.

> 🌎 **En la vida real:** en una obra, el albañil y el plomero no siempre se cruzan; el **jefe de obra** sabe qué hace cada uno y en qué orden.

> 🌎 **Otro ejemplo:** Es como un director de orquesta: cada músico toca bien su parte, pero el que decide cuándo entra cada uno es el director.

### Lo que le dices a cada agente

Cuando abres un segundo agente, dale el contexto que el primero no le puede dar:

| Dile | Ejemplo |
|---|---|
| Que hay otro trabajando, y en qué | "Hay otro agente cambiando los audios y la clase 18" |
| Qué no tiene que tocar | "No toques `firestore.rules` ni la carpeta `herramientas/audio`" |
| Dónde trabajar | "Trabaja en una copia aparte o en una carpeta de borradores" |
| Qué esperar antes de seguir | "Cuando el otro suba su trabajo, recién ahí juntas" |
| Qué necesita tu permiso | "Antes de subir a Firebase, pregúntame" |

### Lo que decides tú, y no el agente

- **El orden** en que se hacen las cosas.
- **Qué se sube** y cuándo.
- **Lo que pasa afuera**: Firebase, GitHub, mandar mensajes, borrar cosas.

Un agente bien configurado te pregunta antes de esos pasos. Pero la responsabilidad es tuya: tú eres el que conoce el proyecto entero.

> 🌎 **En la vida real:** es como el dueño de un restaurante con varios cocineros: los cocineros cocinan, pero el que decide qué se sirve y a qué hora abre la puerta es el dueño.

> 🔁 **Repaso:** ¿conviene paralelo? → mira antes de tocar (`git status`, la hora, `git diff`) → copia aparte (worktree) y trae a mano lo privado → reparte por archivos, dependencias y lo que va afuera → espera con un vigilante que avisa los finales buenos y los malos, y lee por qué terminó → junta en orden, regenera una vez, prueba todo, Firebase antes de la página, un commit por cambio → tú decides el orden y lo que va afuera.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El contexto que le das al segundo agente
lenguaje: js
pide: Los agentes no se hablan: se comunican a través de ti. Completa `contextoPara(info)`: si faltan `queHace`, `noTocar` o `cuandoSeguir`, lanza `Error('Falta: ' + las que faltan unidas con ', ')`. Si está todo, devuelve el mensaje en tres líneas: `Otro agente está haciendo: …`, `No toques: …` (los archivos unidos con `, `) y `Sigue cuando: …`.
--- código
function contextoPara(info) {
  // tu código aquí
}
--- pruebas
const info = { queHace: 'los audios con la voz de Daniela', noTocar: ['herramientas/audio/', '18-como-hice-mi-mapa/'], cuandoSeguir: 'el otro agente haya subido su trabajo' };
prueba('el mensaje', () => igual(contextoPara(info), 'Otro agente está haciendo: los audios con la voz de Daniela\nNo toques: herramientas/audio/, 18-como-hice-mi-mapa/\nSigue cuando: el otro agente haya subido su trabajo'));
prueba('sin lo que no se toca, no', () => { let m = null; try { contextoPara({ queHace: 'x', cuandoSeguir: 'y' }); } catch (e) { m = e.message; } igual(m, 'Falta: noTocar'); });
prueba('sin nada', () => { let m = null; try { contextoPara({}); } catch (e) { m = e.message; } igual(m, 'Falta: queHace, noTocar, cuandoSeguir'); });
--- solución
function contextoPara(info) {
  const faltan = ['queHace', 'noTocar', 'cuandoSeguir'].filter((k) => !info[k] || (Array.isArray(info[k]) && info[k].length === 0));
  if (faltan.length) throw new Error('Falta: ' + faltan.join(', '));
  return [`Otro agente está haciendo: ${info.queHace}`, `No toques: ${info.noTocar.join(', ')}`, `Sigue cuando: ${info.cuandoSeguir}`].join('\n');
}
```

```practica
vf :: Dos agentes de IA en sesiones distintas saben solos lo que está haciendo el otro
vf :: Las decisiones sobre lo que se sube o se cambia fuera de la computadora son de la persona, no del agente
elige :: ¿Qué le conviene decirle a un segundo agente cuando ya hay otro trabajando? :: Nada, que lo descubra solo :: En qué trabaja el otro, qué no tiene que tocar, dónde trabajar y qué necesita tu permiso :: Que trabaje lo más rápido posible
escribe :: Escribe el mensaje que le darías a un segundo agente mientras otro está cambiando la base de datos de tu app. :: Por ejemplo: "Hay otro agente cambiando las reglas de Firestore y la carpeta functions. No toques esos archivos. Trabaja en una copia aparte en la pantalla de gastos. Cuando el otro termine y suba, me avisas para juntar. Antes de subir algo a Firebase o a GitHub, pregúntame."
```

## Parte 9. ¿Una sesión o varias?

Hasta aquí viste el caso de **dos agentes al mismo tiempo**. Pero la pregunta de todos los días es más simple: ¿hago todo en **una sola** conversación con la IA, o abro **varias**?

### Qué es una sesión

Una **sesión** es una conversación con la IA, desde que la abres hasta que la cierras. Todo lo que pasa adentro (lo que pediste, los archivos que leyó, lo que respondió) queda en su **contexto**: la "mesa de trabajo" que viste en la clase 30.

### El problema de la sesión eterna

Cada vez que mandas un mensaje, la herramienta le manda al modelo **toda la conversación otra vez**, desde el principio, más tu mensaje nuevo. El modelo no "recuerda" como una persona: vuelve a leer todo cada vez.

Eso trae tres problemas en una sesión muy larga:

1. **Cada mensaje sale más caro.** El mensaje 100 carga con los 99 anteriores.
2. **Se confunde.** Tiene encima de la mesa cosas viejas que ya no importan, y a veces las mezcla con lo de ahora.
3. **Se olvida.** Cuando la mesa se llena, la herramienta **resume** lo viejo para hacer lugar, y en el resumen se pierden detalles.

> 🌎 **En la vida real:** es como contarle una historia a alguien que, cada vez que le dices una frase nueva, te pide que repitas toda la historia desde el principio. Al principio es rápido; a la hora, cada frase tarda una eternidad.

> 🌎 **Otro ejemplo:** Es como una mochila a la que le vas metiendo cosas todo el día sin sacar nada: al final pesa mucho y no encuentras lo que buscas.

> 🌎 **Otro ejemplo más:** Es como una reunión de seis horas: al final nadie se acuerda bien de lo que se decidió en la primera.

### Cuándo seguir en la misma sesión

- Cuando la tarea es **la misma** o la continuación directa: "ahora arregla este otro error del mismo panel".
- Cuando lo que la IA ya leyó **sirve** para lo que viene. Empezar de cero obligaría a leerlo todo otra vez.

### Cuándo abrir una sesión nueva

- Cuando la tarea es **otra cosa**: terminaste el panel y ahora quieres una clase de Python.
- Cuando la sesión ya está **larga** y empieza a equivocarse, a repetir errores o a "olvidar" reglas que le diste.
- Cuando quieres trabajar **en paralelo** en algo independiente (con su propia copia, Parte 4).

### Pasar la posta: cerrar bien una sesión

Antes de cerrar una sesión larga, pídele un **resumen para la próxima**: qué se hizo, qué falta y qué decisiones se tomaron. Guárdalo en un archivo del proyecto (como `PROGRESO.md` en este mapa). La sesión nueva lee ese archivo y arranca sabiendo lo importante, sin cargar con toda la conversación vieja.

> 🌎 **En la vida real:** es como el cambio de turno en un hospital: la enfermera que se va no le cuenta a la que llega todo lo que pasó en doce horas; le deja una hoja con lo importante de cada paciente.

> 🌎 **Otro ejemplo:** Es como dejarle una nota a quien te reemplaza en el trabajo: "falta llamar a este cliente; el pedido 45 ya salió".

### Dos comandos que ayudan (en Claude Code)

| Comando | Qué hace | Cuándo usarlo |
|---|---|---|
| `/clear` | Borra la mesa y empieza de cero, en la misma ventana | Terminaste una tarea y empiezas otra |
| `/compact` | Resume la conversación para hacer lugar, sin empezar de cero | La tarea sigue, pero la sesión ya está muy larga |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Seguir en esta sesión o abrir otra?
lenguaje: js
pide: Completa `seguirOAbrir(s)`: `'abrir otra'` si la tarea **no** es la misma (`mismaTarea: false`), si la sesión ya es larga (`mensajes` más de 80) o si ya empezó a equivocarse (`repiteErrores: true`); si no, `'seguir'`. Y `pasarLaPosta({ hecho, falta, decisiones })`: el resumen para la próxima sesión con tres secciones `## Hecho`, `## Falta` y `## Decisiones`, cada elemento como `- …`, separadas por una línea en blanco.
--- código
function seguirOAbrir(s) {
  // tu código aquí
}

function pasarLaPosta({ hecho, falta, decisiones }) {
  // tu código aquí
}
--- pruebas
prueba('la misma tarea, corta: seguir', () => igual(seguirOAbrir({ mismaTarea: true, mensajes: 20, repiteErrores: false }), 'seguir'));
prueba('otra cosa, larga o confundida: abrir', () => igual([seguirOAbrir({ mismaTarea: false, mensajes: 5 }), seguirOAbrir({ mismaTarea: true, mensajes: 81 }), seguirOAbrir({ mismaTarea: true, mensajes: 10, repiteErrores: true })], ['abrir otra', 'abrir otra', 'abrir otra']));
prueba('la posta', () => igual(pasarLaPosta({ hecho: ['clase 87'], falta: ['audios', 'publicar'], decisiones: ['Firebase antes que GitHub'] }), '## Hecho\n- clase 87\n\n## Falta\n- audios\n- publicar\n\n## Decisiones\n- Firebase antes que GitHub'));
--- solución
function seguirOAbrir(s) {
  if (!s.mismaTarea || s.mensajes > 80 || s.repiteErrores) return 'abrir otra';
  return 'seguir';
}

function pasarLaPosta({ hecho, falta, decisiones }) {
  const seccion = (titulo, lista) => `## ${titulo}\n${lista.map((x) => `- ${x}`).join('\n')}`;
  return [seccion('Hecho', hecho), seccion('Falta', falta), seccion('Decisiones', decisiones)].join('\n\n');
}
```

```practica
vf :: Cada vez que mandas un mensaje, la herramienta le manda al modelo toda la conversación otra vez
vf :: Una sesión que dura todo el día es la forma más barata y ordenada de trabajar
elige :: Terminaste el panel y ahora quieres escribir una clase de Python. ¿Qué conviene? :: Seguir en la misma sesión, así ya sabe todo :: Abrir una sesión nueva (o usar /clear) :: Pegarle todo el proyecto otra vez
elige :: ¿Para qué sirve pedir un resumen antes de cerrar una sesión larga? :: Para gastar más tokens :: Para que la sesión nueva arranque sabiendo lo importante sin cargar con toda la conversación :: Para que la IA no se canse
escribe :: Con tus palabras y un ejemplo de la vida real, explica cuándo seguir en la misma sesión y cuándo abrir una nueva. :: Sigo en la misma si es la misma tarea o su continuación, y lo que la IA ya leyó me sirve. Abro una nueva si es otra cosa, si la sesión ya está larga y se confunde, o si quiero trabajar en paralelo. Como en un hospital: dentro del turno sigues con tus pacientes; al cambiar de turno, dejas una hoja con lo importante y entra otra persona.
```

## Parte 10. Gastar menos tokens

En la clase 30 viste que todo se mide en **tokens** (pedacitos de texto) y en la clase 34 que gastarlos cuesta. Aquí van las formas concretas de gastar menos **y**, de paso, obtener mejores resultados: casi siempre lo que ahorra tokens también hace que la IA trabaje mejor.

### Lo que más gasta

| Lo que gasta mucho | Por qué | Lo que gasta poco |
|---|---|---|
| Una sesión eterna | Cada mensaje carga con todo lo anterior | Una sesión por tarea, y `/clear` al cambiar |
| "Lee todo el proyecto" | Llena la mesa con miles de líneas que no importan | "Mira `web/panel.js`, la función `guardar`" |
| Pegar un registro (log) de 5.000 líneas | Casi todo es ruido | Pegar el error completo y las 20 líneas de alrededor |
| Que la IA mire algo cada minuto | Cada mirada es una pregunta nueva | Un vigilante que avisa una vez (Parte 6) |
| Pedidos vagos ("arréglalo") | La IA prueba, se equivoca, vuelve a probar | Un pedido claro, con qué, dónde y cómo saber que funciona (clase 31) |
| Usar el modelo más grande para todo | Cuesta más por token | Un modelo más chico para tareas simples |

> 🌎 **En la vida real:** es como el taxi de la clase 30: si le das la dirección exacta, pagas menos que si le dices "lléveme por ahí, que yo le aviso".

> 🌎 **Otro ejemplo:** Es como ir al supermercado con una lista: compras lo que necesitas y sales rápido. Sin lista, das vueltas por todos los pasillos y llenas el carro de cosas que no ibas a usar.

> 🌎 **Otro ejemplo más:** Es como la cuenta de la luz: no se baja apagando la casa entera, sino apagando lo que no estás usando.

### El modelo adecuado para cada trabajo

Las herramientas de IA tienen modelos de distintos tamaños. Los grandes razonan mejor y cuestan más; los chicos son más rápidos y baratos. En Claude Code, `/model` cambia de modelo.

- **Modelo grande:** diseñar algo nuevo, encontrar un error difícil, revisar seguridad.
- **Modelo chico:** buscar en archivos, cambiar un texto, resumir, tareas repetitivas.

> 🌎 **En la vida real:** no contratas a un ingeniero para cambiar una bombilla, ni a un ayudante para diseñar el puente.

### Las reglas del proyecto, cortas

El archivo de reglas (`CLAUDE.md` o `AGENTS.md`, clase 32) se lee en **cada** sesión. Si tiene diez páginas, cada sesión empieza gastando diez páginas. Que tenga lo importante; lo demás, en otros archivos que la IA lee **solo cuando los necesita**.

> 🌎 **En la vida real:** es como el reglamento que se lee en voz alta al empezar cada turno en una fábrica: si dura una hora, se pierde una hora por turno.

### La caché

Muchas herramientas guardan en una **caché** (una memoria rápida) la parte de la conversación que no cambia, y esa parte la cobran más barata en el mensaje siguiente. Ayuda, pero no hace gratis una sesión eterna: igual ocupa la mesa y cuenta para los límites.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que cuesta una sesión eterna
lenguaje: js
pide: En cada mensaje, la herramienta le manda al modelo **toda** la conversación otra vez. Completa `tokensMandados(mensajes)`: recibe los tokens de cada mensaje, en orden, y devuelve el total que se mandó (el mensaje 1 manda el 1; el 2 manda el 1 y el 2; el 3 manda el 1, el 2 y el 3…). Y `enSesiones(mensajes, cadaCuanto)`: lo mismo, pero empezando una sesión nueva (desde cero) cada `cadaCuanto` mensajes.
--- código
function tokensMandados(mensajes) {
  // tu código aquí
}

function enSesiones(mensajes, cadaCuanto) {
  // tu código aquí
}
--- pruebas
prueba('tres mensajes', () => igual(tokensMandados([100, 100, 100]), 600));
prueba('crece mucho más rápido que los mensajes', () => igual(tokensMandados(Array(100).fill(100)), 505000));
prueba('cortando en sesiones de 10', () => igual(enSesiones(Array(100).fill(100), 10), 55000));
prueba('sin mensajes', () => igual(tokensMandados([]), 0));
--- solución
function tokensMandados(mensajes) {
  let conversacion = 0;
  let total = 0;
  for (const m of mensajes) {
    conversacion += m;
    total += conversacion;
  }
  return total;
}

function enSesiones(mensajes, cadaCuanto) {
  let total = 0;
  for (let i = 0; i < mensajes.length; i += cadaCuanto) total += tokensMandados(mensajes.slice(i, i + cadaCuanto));
  return total;
}
```

```practica
vf :: Casi siempre, lo que ahorra tokens también hace que la IA trabaje mejor
vf :: Para que la IA entienda bien, conviene pegarle el registro completo de 5.000 líneas
vf :: El archivo de reglas del proyecto se lee al empezar cada sesión, por eso conviene que sea corto
elige :: ¿Para qué tarea conviene un modelo más chico y barato? :: Encontrar un error de seguridad difícil :: Buscar en qué archivos se usa una función :: Diseñar la arquitectura de una app nueva
elige :: ¿Qué pedido gasta menos y sale mejor? :: "Lee todo el proyecto y dime qué está mal" :: "En web/panel.js, la función guardar falla con un 409; este es el error completo" :: "Arréglalo"
escribe :: Nombra cuatro formas de gastar menos tokens y explica una con un ejemplo de la vida real. :: Una sesión por tarea; decirle el archivo exacto en vez de "lee todo"; pegar solo el error y sus líneas de alrededor; un vigilante en vez de mirar a cada rato; pedidos claros; un modelo chico para lo simple; reglas cortas. Por ejemplo, decir el archivo exacto es como darle al taxista la dirección exacta: llegas antes y pagas menos.
```

## Parte 11. Agentes que mandan a otros agentes

¿Se puede tener un agente que reparta el trabajo entre otros agentes? **Sí, y ya lo usas.** En la clase 32 viste los **subagentes**: el agente principal le da una tarea a otro agente, ese otro trabaja con **su propia mesa** (su propio contexto) y le devuelve **solo el resultado**.

### Cómo funciona

```text
Agente principal (habla contigo)
   │  "Busca en todo el proyecto dónde se usa guardar()"
   ▼
Subagente (su propia mesa, limpia)
   │  lee 40 archivos…
   ▼
Le devuelve al principal: "Se usa en 3 lugares: …"
```

El agente principal nunca carga con los 40 archivos: solo con la respuesta de tres líneas. Su mesa queda limpia para seguir trabajando contigo.

> 🌎 **En la vida real:** es el jefe que manda a un ayudante al archivo a buscar un expediente: el ayudante revisa cien carpetas y vuelve con la que hacía falta. El jefe no tuvo que mirar las cien.

> 🌎 **Otro ejemplo:** Es como un director de obra que le pide al topógrafo "mídeme el terreno": no le importa cómo lo midió, le importa el plano final.

> 🌎 **Otro ejemplo más:** Es como pedirle a un amigo que lea un libro largo y te cuente de qué trata: tú te quedas con el resumen, no con las 500 páginas.

### ¿Sale más barato?

**No siempre, y es importante entenderlo.** El subagente también gasta tokens: los 40 archivos los leyó **él**. En total, a veces se gasta **más**. Lo que se gana es que la **conversación principal** no se llena, se mantiene ordenada y sigue trabajando bien por más tiempo.

| Usa un subagente cuando… | No lo uses cuando… |
|---|---|
| Hay que buscar o leer mucho y solo importa el resultado | La tarea es chica (leer un archivo) |
| Hay varias búsquedas independientes que pueden ir a la vez | El resultado depende de que tú decidas algo a mitad de camino |
| Quieres una segunda opinión (que otro revise el trabajo) | Necesitas ver todo el detalle, no un resumen |

### Lanzar varios a la vez

El agente principal puede mandar **varios** subagentes al mismo tiempo, cada uno con una búsqueda distinta: uno revisa el panel de la Biblia, otro el de Copiloto, otro el de este mapa. Cuando vuelven los tres, el principal junta las respuestas. Es la misma regla de la Parte 5: funciona si las tareas son **independientes**.

> 🌎 **En la vida real:** es como mandar a tres personas a tres tiendas distintas a preguntar precios, en vez de ir tú a las tres una después de otra.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El subagente: mesa limpia, no siempre más barato
lenguaje: js
pide: Completa `comparar({ leer, resumen, mensajesDespues })`: el agente tiene que leer `leer` tokens de archivos. **Solo:** los lee él, y esos tokens se vuelven a mandar en cada uno de los `mensajesDespues` mensajes que siguen. **Con subagente:** el subagente lee los `leer` tokens una vez, y al principal solo le llega el `resumen`, que se manda en cada mensaje siguiente. Devuelve `{ solo, conSubagente, mesaDelPrincipal }`: los tokens totales de cada forma, y cuánto ocupa en la mesa del principal con subagente (`resumen`).
--- código
function comparar({ leer, resumen, mensajesDespues }) {
  // tu código aquí
}
--- pruebas
prueba('si sigues conversando mucho, conviene', () => igual(comparar({ leer: 40000, resumen: 200, mensajesDespues: 20 }), { solo: 840000, conSubagente: 44200, mesaDelPrincipal: 200 }));
prueba('si no sigues, cuesta lo mismo o más', () => { const r = comparar({ leer: 40000, resumen: 200, mensajesDespues: 0 }); igual([r.solo, r.conSubagente], [40000, 40200]); });
--- solución
function comparar({ leer, resumen, mensajesDespues }) {
  const solo = leer + leer * mensajesDespues;
  const conSubagente = leer + resumen + resumen * mensajesDespues;
  return { solo, conSubagente, mesaDelPrincipal: resumen };
}
```

```practica
vf :: Un subagente trabaja con su propia mesa (contexto) y le devuelve al principal solo el resultado
vf :: Usar subagentes siempre gasta menos tokens en total
elige :: ¿Cuándo conviene un subagente? :: Para leer un solo archivo chico :: Para buscar en muchos archivos cuando solo importa el resultado :: Cuando necesitas decidir algo a mitad de la búsqueda
elige :: ¿Cuándo se pueden lanzar varios subagentes al mismo tiempo? :: Siempre :: Cuando sus tareas son independientes :: Nunca, solo de a uno
escribe :: Explica con un ejemplo de la vida real qué es un subagente y qué se gana usándolo. :: Es como mandar a un ayudante al archivo a buscar un expediente: revisa cien carpetas y vuelve con la que hacía falta. Se gana que el jefe (la conversación principal) no se llena de papeles y sigue trabajando ordenado, aunque el ayudante también haya gastado su tiempo.
```

## Parte 12. La IA agiliza; la persona dirige

### ¿Y si los agentes se hablaran solos?

Existe: algunas herramientas ya dejan que un agente le mande mensajes a otro, o que un agente "líder" reparta el trabajo entre varios. **No lo recomendamos y en este curso no nos vamos a enfocar en eso:** gasta muchos más tokens (cada mensaje entre ellos es una pregunta nueva), se pueden enredar en vueltas sin fin y pierdes el control de lo que se decide. Lo que funciona, y lo que se hizo en esta historia, es otra cosa: **la persona en el medio, dirigiendo.**

### La IA es una herramienta; tú eres el director de obra

La IA convierte ideas en código muy rápido. Escribió el panel de este mapa en minutos y dos clases enteras en una tarde. Pero una herramienta, por buena que sea, no sabe **para qué** se usa ni **cuándo** parar. Eso lo pone la persona.

> 🌎 **En la vida real:** una retroexcavadora hace en una hora lo que diez obreros hacen en una semana. Pero si nadie le dice dónde cavar, cava donde no debe… y lo hace rapidísimo.

> 🌎 **Otro ejemplo:** Es como el piloto automático de un avión: vuela mejor que nadie en línea recta, pero en la cabina siempre hay un piloto mirando, que decide cuándo despegar, cuándo aterrizar y qué hacer si algo raro pasa.

> 🌎 **Otro ejemplo más:** Es como una orquesta: cada músico toca perfecto su parte, pero sin el director, cada uno entra cuando le parece.

### Lo que hizo la persona en esta historia

Mira todo lo que **no** decidió la IA ese día:

| Momento | Lo que decidió la persona |
|---|---|
| El otro agente estaba trabajando | "Si está trabajando, no vamos a cambiar nada" |
| La IA explicó que podía preparar todo en una copia aparte | "Bueno, está bien": aprobó el plan |
| El otro agente mandó su mensaje | Lo pegó en la conversación: fue el puente entre los dos |
| Antes de subir las reglas a Firebase | La IA tiene que pedir permiso; la persona aprueba |
| Las clases nuevas | Qué temas, con qué ejemplos, y qué **no** enseñar (como esta misma parte) |

### Lo que la IA hizo mal, y se encontró porque alguien revisó

La IA también se equivoca. Ese mismo día:

- El primer vigilante estaba **roto** (la fecha mal escrita) y dijo "nada cambió" cuando no era cierto.
- Una clase salió con un número escrito a mano ("Tema 77") que no coincidía con el mapa.
- Dos dibujos se **cortaban** en la pantalla del celular.

Ninguno de esos errores llegó a publicarse, porque se **revisó** antes: leer por qué terminó el vigilante, abrir la clase en el navegador, mirarla en tamaño de celular. Revisar es parte del trabajo del director (clase 34).

> 🌎 **En la vida real:** es como el maestro de obra que pasa por la construcción todos los días: no pone ladrillos, pero ve que una pared está torcida antes de que le pongan el techo encima.

### El trabajo del director, en cinco verbos

1. **Decidir** qué se hace y qué no.
2. **Ordenar**: qué va primero, qué espera.
3. **Explicar**: darle a cada agente el contexto que no tiene (Parte 8).
4. **Revisar** lo que vuelve, antes de darlo por bueno.
5. **Aprobar** lo que sale afuera: publicar, subir a Firebase, borrar, mandar mensajes.

> 🎙️ **El profesor dice:** {{alumno}}, la IA no te reemplaza: te da diez manos más. Pero manos sin cabeza no construyen una casa. La cabeza, el plano y la última palabra son tuyos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que decides tú y lo que hace el agente
lenguaje: js
pide: Completa `quienDecide(accion)`: las acciones del director (`decidir`, `ordenar`, `aprobar`) y todo lo que va **afuera** (`publicar`, `subir a Firebase`, `borrar`, `mandar un mensaje`) → `'tú'`; las que hacen sus manos (`escribir código`, `buscar`, `correr pruebas`, `explicar`) → `'el agente'`; lo que no conoces → `'tú'` (ante la duda, decides tú).
--- código
function quienDecide(accion) {
  // tu código aquí
}
--- pruebas
prueba('lo del director', () => igual(['decidir', 'ordenar', 'aprobar'].map(quienDecide), ['tú', 'tú', 'tú']));
prueba('lo que va afuera', () => igual(['publicar', 'subir a Firebase', 'borrar', 'mandar un mensaje'].map(quienDecide), ['tú', 'tú', 'tú', 'tú']));
prueba('lo que hacen sus manos', () => igual(['escribir código', 'buscar', 'correr pruebas', 'explicar'].map(quienDecide), ['el agente', 'el agente', 'el agente', 'el agente']));
prueba('ante la duda', () => igual(quienDecide('cambiar la contraseña de la cuenta'), 'tú'));
--- solución
const DEL_AGENTE = ['escribir código', 'buscar', 'correr pruebas', 'explicar'];

function quienDecide(accion) {
  return DEL_AGENTE.includes(accion) ? 'el agente' : 'tú';
}
```

```practica
vf :: Existen herramientas donde un agente le manda mensajes a otro, pero no es lo recomendado para trabajar en tus proyectos
vf :: Como la IA escribe código muy rápido, ya no hace falta que una persona revise lo que hace
elige :: ¿Cuál de estas decisiones le corresponde a la persona y no a la IA? :: Escribir el código de una función :: Aprobar que se suban las reglas a Firebase :: Buscar en qué archivos se usa algo
elige :: ¿Qué hizo la persona cuando el otro agente mandó su mensaje? :: Nada, los agentes se entendieron solos :: Lo pegó en la conversación: fue el puente entre los dos :: Apagó los dos agentes
escribe :: Con tus palabras y un ejemplo de la vida real: ¿por qué la IA necesita un director de obra? :: Porque es una herramienta muy rápida, pero no sabe para qué se usa ni cuándo parar, y también se equivoca. Como una retroexcavadora: hace el trabajo de diez obreros, pero si nadie le dice dónde cavar, cava donde no debe. La persona decide, ordena, explica, revisa y aprueba.
```

## Parte 13. ¿Qué combinación usar?

Junta todo. Hay cuatro formas de trabajar, de la más simple a la más complicada (la quinta, agentes que se hablan solos, existe, pero ya viste en la Parte 12 por qué no la usamos):

| Forma | Cómo es | Cuándo | Gasto |
|---|---|---|---|
| **1. Una sesión, una tarea** | Tú y un agente, una cosa a la vez | Casi siempre: es la base | Bajo |
| **2. Una sesión + subagentes** | El principal manda a buscar o revisar | Hay mucho que leer y solo importa el resultado | Medio |
| **3. Dos o tres sesiones en paralelo** | Cada una en su copia (worktree), tú coordinas | Tareas independientes, o una espera algo largo | Medio-alto |
| **4. Mezclar herramientas** | Por ejemplo, Claude para el proyecto y otra IA para preparar pedidos (clase 33) | Se acabó un límite, o cada una es mejor para algo | Depende |

> 🌎 **En la vida real:** es como un negocio que crece. Al principio lo atiendes solo (forma 1). Después contratas un ayudante para los mandados (forma 2). Después abres un segundo local con su encargado y tú pasas por los dos (forma 3).

> 🌎 **Otro ejemplo:** Es como la cocina de tu casa: para un almuerzo cocinas solo; para un cumpleaños alguien te ayuda a picar; para una boda contratas un equipo con un jefe de cocina. No montas el equipo de la boda para hacer un huevo frito.

### Tu receta

1. **Empieza siempre con la forma 1.** Una sesión por tarea, con un pedido claro.
2. **Si hay mucho para buscar,** deja que el agente use subagentes (forma 2).
3. **Si tienes dos tareas independientes, o una que espera algo largo,** abre una segunda sesión en su propia copia (forma 3), mirando antes de tocar (Parte 3).
4. **Si se acaba un límite,** sigue con otra herramienta con las mismas reglas del proyecto (forma 4).
5. **En todas, tú diriges:** decides, ordenas, explicas, revisas y apruebas lo que va afuera (Parte 12).

> 🎙️ **El profesor dice:** {{alumno}}, más agentes no te hacen mejor programador. Lo que te hace mejor es saber **qué** pedir, **a quién**, **en qué orden**, y revisar lo que vuelve. Eso vale igual con un agente que con diez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu receta de combinación
lenguaje: js
pide: Completa `forma(situacion)` con la receta, revisando en este orden: si se acabó el límite (`seAcaboElLimite`) → `4`; si hay dos tareas independientes o una que espera algo largo (`dosIndependientes` o `esperaAlgoLargo`) → `3`; si hay mucho para buscar (`muchoParaBuscar`) → `2`; si no → `1`. Y `queSignifica(n)`: `1` → `'una sesión por tarea'`, `2` → `'subagentes para buscar'`, `3` → `'otra sesión en su propia copia'`, `4` → `'otra herramienta con las mismas reglas'`.
--- código
function forma(situacion) {
  // tu código aquí
}

function queSignifica(n) {
  // tu código aquí
}
--- pruebas
prueba('lo de siempre', () => igual(forma({}), 1));
prueba('cada caso', () => igual([forma({ muchoParaBuscar: true }), forma({ esperaAlgoLargo: true }), forma({ dosIndependientes: true, muchoParaBuscar: true }), forma({ seAcaboElLimite: true, dosIndependientes: true })], [2, 3, 3, 4]));
prueba('qué es cada una', () => igual([1, 2, 3, 4].map(queSignifica), ['una sesión por tarea', 'subagentes para buscar', 'otra sesión en su propia copia', 'otra herramienta con las mismas reglas']));
--- solución
function forma(situacion) {
  if (situacion.seAcaboElLimite) return 4;
  if (situacion.dosIndependientes || situacion.esperaAlgoLargo) return 3;
  if (situacion.muchoParaBuscar) return 2;
  return 1;
}

function queSignifica(n) {
  return ['', 'una sesión por tarea', 'subagentes para buscar', 'otra sesión en su propia copia', 'otra herramienta con las mismas reglas'][n];
}
```

```practica
vf :: La forma más recomendada para empezar es una sesión por tarea, con un pedido claro
vf :: Para cualquier tarea conviene armar un equipo de agentes que se hablen solos
elige :: Tienes que esperar dos horas a que GitHub genere audios y quieres adelantar una clase nueva. ¿Qué forma usas? :: Una sola sesión, esperando :: Dos sesiones en paralelo, cada una en su copia, tú coordinando :: Que la IA mire GitHub cada minuto
elige :: Se te acabó el límite de una herramienta en medio del trabajo. ¿Qué forma usas? :: Esperar sin hacer nada hasta el mes que viene :: Seguir con otra herramienta, con las mismas reglas del proyecto :: Borrar el proyecto y empezar de nuevo
escribe :: Describe cómo trabajarías tú con la IA en una semana normal de tu app, usando las formas de esta parte. :: Por ejemplo: cada tarea en su propia sesión con un pedido claro; si tengo que buscar algo en todo el proyecto, dejo que use subagentes; si una tarea espera algo largo, abro otra sesión en su copia para adelantar otra cosa; si se acaba el límite, sigo con otra herramienta con las mismas reglas. Y lo que va a internet o a Firebase lo apruebo yo.
```

## Parte 14. Hacer tu propio vigilante, paso a paso

En la Parte 6 viste que el vigilante **no es una IA**: es un programa chiquito de la computadora que mira, duerme, vuelve a mirar y avisa una vez. Por eso no gasta tokens mientras espera. Aquí vas a aprender a hacer uno, de dos formas: pidiéndoselo a la IA o escribiéndolo tú.

> 🌎 **En la vida real:** un vigilante es como el despertador: no piensa, no entiende, solo mira la hora y suena cuando llega. Y justamente por eso es barato y confiable.

> 🌎 **Otro ejemplo:** Es como el sensor de la puerta de una tienda que hace "din-don" cuando entra alguien: no necesita a un empleado mirando la puerta todo el día.

### Forma 1: pedírselo a la IA

En Claude Code basta con pedirlo en palabras claras. La IA escribe el vigilante, lo deja corriendo **en segundo plano** (sin trabarte) y sigue con lo suyo; cuando el vigilante termina, la herramienta la despierta.

Un buen pedido dice **qué esperar**, **cada cuánto mirar** y **qué hacer en los finales malos**:

```text
Avísame cuando termine la acción "Audios de las clases" en GitHub.
Mira cada 2 minutos. Si termina con error, avísame también y muéstrame el error.
No hagas nada más hasta que yo te diga.
```

### Forma 2: escribirlo tú, en la terminal

Todo vigilante tiene **tres piezas**:

1. **La condición:** ¿qué tiene que pasar? ("el archivo existe", "la página responde", "GitHub terminó").
2. **La espera:** cuánto duerme entre una mirada y otra (`sleep`).
3. **El aviso:** qué hace cuando se cumple (escribir un mensaje, mostrar una notificación, hablar).

#### Ejemplo 1: avisar cuando una página ya está publicada

```bash
until curl -s -o /dev/null -w "%{http_code}" https://delvinsmart.github.io/estudios/panel.html | grep -q 200; do
  sleep 30
done
osascript -e 'display notification "El panel ya está publicado" with title "Vigilante"'
```

- `curl` pide la página, como un navegador, pero sin mostrarla. `-w "%{http_code}"` escribe solo el **código** de la respuesta: `200` quiere decir "aquí está".
- `grep -q 200` comprueba si ese código es 200.
- `until … do sleep 30; done`: si todavía no es 200, duerme 30 segundos y vuelve a mirar.
- `osascript -e 'display notification …'` muestra una **notificación de la Mac**, como las de WhatsApp, en la esquina de la pantalla. Es gratis y viene con la Mac.

#### Ejemplo 2: avisar cuando termina una acción de GitHub

La herramienta `gh` (GitHub en la terminal) ya trae su propio vigilante:

```bash
gh run watch && say "Terminó la acción de GitHub" || say "La acción de GitHub falló"
```

- `gh run watch` te deja elegir una acción que esté corriendo y se queda mirándola hasta que termina.
- `&&` quiere decir "si salió bien, haz esto"; `||` quiere decir "si salió mal, haz esto otro". Así avisa **los dos finales**.
- `say` hace que la Mac **hable** en voz alta. También es gratis y viene con la Mac.

#### Ejemplo 3: avisar cuando otro agente sube su trabajo (el de hoy)

```bash
until [ -z "$(git status --short -- firebase/firestore.rules)" ]; do
  sleep 60
done
say "El otro agente ya subió su trabajo"
```

`[ -z "…" ]` pregunta "¿esto está vacío?". Cuando `git status` ya no muestra cambios sueltos en ese archivo, está vacío: el otro agente lo subió.

> 🌎 **En la vida real:** las tres piezas son como un perro guardián: **la condición** es "alguien en la puerta", **la espera** es que se echa a dormir con una oreja parada, y **el aviso** es el ladrido.

### Las reglas de un buen vigilante

| Regla | Por qué |
|---|---|
| Que avise los finales **buenos y malos** | Si solo avisa lo bueno, un error se ve igual que "todavía no" (Parte 6) |
| Que no mire demasiado seguido | Cada 30 o 60 segundos alcanza; mirar cada segundo no hace que termine antes |
| Que tenga un **límite** de tiempo o de vueltas | Si lo que esperas nunca pasa, que no quede corriendo para siempre |
| **Probarlo** con algo que ya pasó | Si dice "ya está" con algo que ya está, sabes que la condición funciona |
| Leer **por qué** terminó antes de actuar | Un vigilante roto puede avisar algo falso, como el de la fecha mal escrita |

Ejemplo de límite: que mire como máximo 120 veces (dos horas, mirando cada minuto) y después avise "me cansé de esperar":

```bash
for vuelta in $(seq 1 120); do
  [ -z "$(git status --short)" ] && { say "Listo"; exit 0; }
  sleep 60
done
say "Pasaron dos horas y no terminó"
```

- `for vuelta in $(seq 1 120)` repite 120 veces.
- `exit 0` termina el vigilante apenas se cumple la condición.
- Si llega al final de las 120 vueltas, avisa que se cansó.

> 🌎 **En la vida real:** es como esperar a alguien en un café: si no llega en una hora, no te quedas para siempre; te vas y lo llamas para saber qué pasó.

### Cómo pararlo

- Si lo dejaste corriendo en la terminal: **Control + C** lo detiene.
- Si lo dejó la IA en segundo plano: pídele que lo pare ("para el vigilante").

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Armar tu vigilante de la terminal
lenguaje: js
pide: Completa `vigilantePara({ url, cada, mensaje })`: devuelve el vigilante del Ejemplo 1, en tres líneas: `until curl -s -o /dev/null -w "%{http_code}" URL | grep -q 200; do`, después `  sleep CADA`, y `done; osascript -e 'display notification "MENSAJE" with title "Vigilante"'`. Si `cada` es menor que 10, lanza `Error('Mirar tan seguido gasta sin sentido')`. Si el mensaje tiene comillas, lanza `Error('El mensaje no puede tener comillas')` (romperían el comando).
--- código
function vigilantePara({ url, cada, mensaje }) {
  // tu código aquí
}
--- pruebas
prueba('el vigilante', () => igual(vigilantePara({ url: 'https://delvinsmart.github.io/estudios/panel.html', cada: 30, mensaje: 'El panel ya está publicado' }), 'until curl -s -o /dev/null -w "%{http_code}" https://delvinsmart.github.io/estudios/panel.html | grep -q 200; do\n  sleep 30\ndone; osascript -e \'display notification "El panel ya está publicado" with title "Vigilante"\''));
const mensajeDe = (fn) => { try { fn(); return 'no lanzó'; } catch (e) { return e.message; } };
prueba('no mirar cada segundo', () => igual(mensajeDe(() => vigilantePara({ url: 'https://x.com', cada: 1, mensaje: 'ok' })), 'Mirar tan seguido gasta sin sentido'));
prueba('sin comillas en el mensaje', () => igual(mensajeDe(() => vigilantePara({ url: 'https://x.com', cada: 30, mensaje: 'dijo "listo"' })), 'El mensaje no puede tener comillas'));
--- solución
function vigilantePara({ url, cada, mensaje }) {
  if (cada < 10) throw new Error('Mirar tan seguido gasta sin sentido');
  if (/["']/.test(mensaje)) throw new Error('El mensaje no puede tener comillas');
  return [
    `until curl -s -o /dev/null -w "%{http_code}" ${url} | grep -q 200; do`,
    `  sleep ${cada}`,
    `done; osascript -e 'display notification "${mensaje}" with title "Vigilante"'`,
  ].join('\n');
}
```

```practica
vf :: El vigilante es un programa chiquito de la computadora, no una IA, y por eso no gasta tokens mientras espera
vf :: Un buen vigilante mira cada segundo, para enterarse lo antes posible
elige :: ¿Cuáles son las tres piezas de todo vigilante? :: El modelo, el contexto y los tokens :: La condición, la espera y el aviso :: El archivo, la carpeta y la rama
elige :: En gh run watch && say "Terminó" || say "Falló", ¿para qué sirve el ||? :: Para repetir el comando :: Para avisar también cuando la acción sale mal :: Para que mire más rápido
elige :: ¿Para qué se le pone un límite de vueltas al vigilante? :: Para que gaste menos internet nada más :: Para que no quede corriendo para siempre si lo que espera nunca pasa :: Porque la Mac no deja repetir más de 120 veces
escribe :: Escribe con tus palabras un pedido a la IA para que deje un vigilante, diciendo qué esperar, cada cuánto mirar y qué hacer en los finales malos. :: Por ejemplo: "Avísame cuando se publique la página nueva del mapa. Mira cada minuto, como máximo durante una hora. Si GitHub da error o pasa la hora sin publicarse, avísame igual y muéstrame qué pasó. No cambies nada mientras tanto."
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con varias IA o varios agentes a la vez?":** "Los uso en paralelo solo para tareas independientes, que tocan archivos distintos y no dependen una de otra. Antes de tocar nada miro si hay alguien trabajando: git status, la hora de los cambios y git diff. Si hay otro agente en la misma carpeta, trabajo en un git worktree, una copia con su propia rama, y traigo a mano lo que está en .gitignore, como un archivo privado, sin subirlo nunca. Para esperar uso un vigilante que avisa cuando termina o cuando algo sale mal, y leo por qué terminó antes de actuar: una vez el vigilante estaba roto y parecía que no había cambios. Al juntar, regenero una sola vez los archivos que cuentan todo, corro todas las pruebas de nuevo, subo las reglas antes que la página y hago un commit por cambio. El orden y lo que se publica lo decido yo."

> 🎤 **Si te preguntan "¿una sesión o varias? ¿cómo cuidas los tokens?":** "Una sesión por tarea, con un pedido claro y el archivo exacto; cuando la sesión se alarga, pido un resumen y abro otra. Para buscar mucho uso subagentes, que trabajan con su propio contexto y me devuelven solo el resultado; no siempre ahorran tokens en total, pero mantienen limpia la conversación principal. Para esperar procesos largos no le pido a la IA que mire a cada rato: dejo un vigilante, un script con una condición, una espera y un aviso, que no gasta tokens. Los agentes que se hablan solos existen, pero gastan más y se pueden enredar; prefiero dirigir yo: la IA agiliza, pero las decisiones, la revisión y lo que se publica son míos."

> 🎤 **Si te preguntan "¿qué fue lo más difícil?":** "Los archivos que resumen a muchos otros, como las reglas de Firebase que cuentan las partes de cada curso. Los dos agentes los necesitaban cambiar. La solución fue no tocarlos en la carpeta compartida, probarlos en la copia y armarlos una sola vez al final, con todo junto."

> 🌎 **En la vida real:** es como contar cómo organizaste una mudanza con dos camiones: qué iba en cada uno, quién llegaba primero, cómo evitaste que se mezclaran las cajas y quién revisó todo al final.

> 🌎 **Otro ejemplo:** Es como explicar cómo se coordina una cocina en hora pico: cada cocinero en su puesto, el que pide los platos en orden, y nada sale a la mesa sin que alguien lo revise.
