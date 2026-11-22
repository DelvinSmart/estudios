# CI (Integración Continua)

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un CI de juguete: corre los pasos en orden
lenguaje: js
pide: Un CI corre una lista de pasos, **en orden**, y se **detiene en el primero que falla**. Completa `correrCI(pasos)`: cada paso es `{ nombre, correr }`, donde `correr()` devuelve `true` (pasó) o `false` (falló). Devuelve `{ verde: true, corridos: N }` si pasaron todos, o `{ verde: false, fallo: 'nombre', corridos: N }` con cuántos llegó a correr.
--- código
function correrCI(pasos) {
  // tu código aquí
}
--- pruebas
const paso = (nombre, ok) => ({ nombre, correr: () => ok });
prueba('todo bien: verde', () => igual(correrCI([paso('tipos', true), paso('pruebas', true)]), { verde: true, corridos: 2 }));
prueba('falla el segundo: rojo y se detiene', () => igual(correrCI([paso('tipos', true), paso('diseño', false), paso('pruebas', true)]), { verde: false, fallo: 'diseño', corridos: 2 }));
prueba('sin pasos también es verde', () => igual(correrCI([]), { verde: true, corridos: 0 }));
prueba('no corre los pasos que siguen a un fallo', () => { let corrio = false; correrCI([paso('a', false), { nombre: 'b', correr: () => { corrio = true; return true; } }]); igual(corrio, false); });
--- solución
function correrCI(pasos) {
  let corridos = 0;
  for (const p of pasos) {
    corridos++;
    if (!p.correr()) return { verde: false, fallo: p.nombre, corridos };
  }
  return { verde: true, corridos };
}
```

```practica
escribe :: Con tus palabras: ¿qué es el CI? :: Una máquina en internet que, cada vez que subo código, enciende una computadora limpia, descarga el código, lo instala desde cero, corre todas las revisiones y me avisa si algo falla.
elige :: ¿Qué quiere decir CI? :: Código Inteligente :: Integración Continua :: Control Interno
elige :: ¿Cuándo corre el CI? :: Cuando yo se lo pido :: Solo, cada vez que subo código :: Una vez por mes
vf :: La computadora del CI tiene instaladas las mismas cosas que mi Mac
vf :: Si una revisión falla, el CI me avisa
```

> 🔁 **Repaso:** el CI es una máquina que, en cada subida, enciende una computadora limpia, instala tu código desde cero, corre todas las revisiones y te avisa si algo falla.

## 2. ¿Para qué sirve?

> 🎙️ **El profesor:** "si yo ya corro las pruebas en mi Mac, ¿para qué otra máquina?" Buena pregunta. Te doy cinco razones y una historia real de Copiloto.

> 🌎 **Otro ejemplo:** Como un auditor externo que revisa las cuentas de tu negocio: no se olvida, no conoce tus atajos, avisa rápido, deja un informe guardado y te da tranquilidad.

| Para qué | Qué significa en Copiloto | 🌎 En la vida real |
|---|---|---|
| **Nadie se olvida** | Aunque tengas prisa, la máquina corre las 400 pruebas igual | El lavaplatos: aunque estés cansado, lava todo |
| **Máquina limpia** | Tu Mac tiene cosas que otros no tienen; la del CI empieza de cero | Cocinar tu receta en la cocina de un amigo |
| **Aviso rápido** | En unos 4 minutos sabes si rompiste algo | El detector de metales: en segundos |
| **Historial** | Ves qué subida rompió algo, y cuándo | Las cámaras de la tienda: puedes rebobinar |
| **Confianza** | Verde = el código cumple todas las reglas que escribiste | El sello de "revisado" de la revisión técnica |

### La historia real: el condimento escondido

En Copiloto, la copia limpia del CI **encontró un fallo que en tu Mac no se veía**. ¿Cómo puede ser? Tu Mac tenía cosas instaladas de antes que, sin que nadie lo supiera, **tapaban** el problema. En la máquina limpia, sin esas cosas, el fallo apareció.

> 🌎 **En la vida real:** en tu casa la receta sale bien porque tenías un condimento guardado que ni recordabas. En la cocina de tu amigo descubres que **la receta no lo menciona**: sin él, sale mal.

> 🌎 **Otro ejemplo:** Como un remedio que te sirve solo porque en tu casa tomas también otro sin darte cuenta: en otra casa, sin ese otro, no funciona. La máquina limpia descubre esas dependencias escondidas.

> ✋ **Para y piensa:** si otra persona descarga tu código en su computadora, ¿a quién se parece más su computadora: a tu Mac o a la del CI?

<details>
<summary>Ver la respuesta</summary>

**A la del CI.** Por eso, si pasa en el CI, es muy probable que funcione en la computadora de cualquiera.

</details>

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **los tres puntos `...`**: copian lo que hay adentro. `[...lista]` es una lista **nueva** con los mismos elementos; `{ ...ficha }` es una ficha **nueva** con los mismos datos. Así cambias la copia sin tocar el original.

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.filter()`**: crea una lista **nueva** solo con los elementos que cumplen la condición: `[3, 8, 1].filter((n) => n > 2)` → `[3, 8]`. La original no cambia.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La máquina limpia encuentra lo que tu Mac esconde
lenguaje: js
pide: Tu Mac tiene herramientas instaladas de antes; la máquina del CI empieza **vacía** y solo tiene lo que dice `package.json`. Completa `faltanEnElCI(usadas, paquete)`: devuelve la lista de herramientas que el proyecto **usa** pero **no anotó** en `dependencies` ni en `devDependencies` (las que en tu Mac funcionan "de casualidad").
--- código
function faltanEnElCI(usadas, paquete) {
  // tu código aquí
}
--- pruebas
const paquete = { dependencies: { firebase: '^11' }, devDependencies: { vitest: '^2', typescript: '^5' } };
prueba('todo anotado: no falta nada', () => igual(faltanEnElCI(['firebase', 'vitest'], paquete), []));
prueba('madge no está anotado', () => igual(faltanEnElCI(['vitest', 'madge'], paquete), ['madge']));
prueba('sin devDependencies no se rompe', () => igual(faltanEnElCI(['vitest'], { dependencies: {} }), ['vitest']));
--- solución
function faltanEnElCI(usadas, paquete) {
  const anotadas = { ...(paquete.dependencies ?? {}), ...(paquete.devDependencies ?? {}) };
  return usadas.filter((h) => !(h in anotadas));
}
```

```practica
escribe :: Explica la historia del "condimento escondido" con tus palabras. :: En mi Mac había cosas instaladas de antes que tapaban un fallo; la máquina limpia del CI no las tenía, así que el fallo apareció y se pudo arreglar.
elige :: ¿Qué razón es "puedo ver qué subida rompió algo y cuándo"? :: Confianza :: Historial :: Aviso rápido
elige :: ¿Cuánto tarda más o menos el CI de Copiloto? :: 4 segundos :: Unos 4 minutos :: 4 horas
vf :: Si todo pasa en mi Mac, seguro que pasa en cualquier computadora
```

> 🔁 **Repaso:** el CI no se olvida, usa una máquina limpia, avisa rápido, deja historial y da confianza. En Copiloto atrapó un fallo que la Mac escondía.

## 3. Lo que el CI NO hace

> 🎙️ **El profesor:** igual que con las pruebas, hay que saber los límites. Son tres, y uno de ellos confunde mucho.

1. **No prueba la app en un teléfono.** No sabe si un botón se ve feo o si la app abre en el iPhone.
   > 🌎 **En la vida real:** los rayos X ven lo que hay en la maleta, pero no saben si la ropa es bonita.
2. **No sabe si la regla es la correcta.** Solo revisa lo que las pruebas dicen.
   > 🌎 **En la vida real:** si la lista del aeropuerto olvidó prohibir algo, el guardia lo deja pasar.
3. **No publica en Google Play.** Solo **revisa**. Publicar lo haces tú. (Esto es lo que confunde.)
   > 🌎 **En la vida real:** el inspector de la fábrica aprueba el carro, pero no lo lleva a la concesionaria.

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.some()` y `.every()`**: preguntan algo a toda la lista. `lista.some((x) => …)` da `true` si **alguno** cumple; `lista.every((x) => …)` si **todos** cumplen. `[3, 8, 1].some((n) => n > 5)` → `true`; `[3, 8, 1].every((n) => n > 5)` → `false`.
> - **`.includes()`**: dice si algo está adentro. En una lista: `['a', 'b'].includes('b')` → `true`. En un texto, si un pedazo está dentro: `'la prueba falla'.includes('falla')` → `true`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que el CI puede revisar y lo que no
lenguaje: js
pide: El CI solo corre **comandos**: no mira la pantalla ni sabe si algo es lindo o útil. Completa `loRevisaElCI(problema)`: devuelve `true` si un comando lo puede detectar (un tipo mal puesto, una prueba que falla, un color escrito a mano, una clave secreta en el código, un archivo gigante) y `false` si hace falta una persona (que un botón se ve feo, que un texto se entiende mal, que la app es lenta en un teléfono viejo). Usa la lista `CON_COMANDO`.
--- código
const CON_COMANDO = ['tipo', 'prueba', 'color a mano', 'secreto', 'archivo gigante'];

function loRevisaElCI(problema) {
  // tu código aquí
}
--- pruebas
prueba('un tipo mal puesto: sí', () => igual(loRevisaElCI('un tipo mal puesto'), true));
prueba('una prueba que falla: sí', () => igual(loRevisaElCI('una prueba que falla'), true));
prueba('un secreto en el código: sí', () => igual(loRevisaElCI('un secreto en el código'), true));
prueba('un botón que se ve feo: no', () => igual(loRevisaElCI('un botón que se ve feo'), false));
prueba('un texto que se entiende mal: no', () => igual(loRevisaElCI('un texto que se entiende mal'), false));
--- solución
const CON_COMANDO = ['tipo', 'prueba', 'color a mano', 'secreto', 'archivo gigante'];

function loRevisaElCI(problema) {
  return CON_COMANDO.some((palabra) => problema.includes(palabra));
}
```

```practica
vf :: El CI publica la app en Google Play cuando todo está en verde
vf :: El CI puede detectar que un botón se ve feo
vf :: Si una regla está mal escrita en la prueba, el CI la deja pasar igual
escribe :: Nombra los tres límites del CI. :: No prueba en un teléfono real, no sabe si la regla es la correcta y no publica la app.
```

> 🔁 **Repaso:** el CI revisa, pero no ve la pantalla, no sabe si la regla es correcta y no publica.

## 4. ¿Dónde vive?

> 🎙️ **El profesor:** el CI no es magia: es **un archivo de texto** dentro del proyecto. Vamos a ver dónde está y en qué formato se escribe.

> 🌎 **En la vida real:** Es como la caja de instrucciones de un electrodoméstico: siempre está en el mismo lugar (adentro de la tapa), para que cualquiera la encuentre.

> 🌎 **Otro ejemplo:** Es como el horario de turnos pegado en la sala de empleados: no está en la cabeza de nadie, está escrito en un lugar fijo que todos consultan.

En Copiloto vive en el archivo **`.github/workflows/ci.yml`**.

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

> 🧩 **Piezas nuevas para este ejercicio:**
> - **`ruta.startsWith('.github/')`** pregunta si el texto **empieza** así.
> - **`/\.ya?ml$/.test(ruta)`** pregunta si termina en `.yml` o `.yaml`. La `?` significa que la `a` es opcional y `$` significa «al final».
> - **`&&`** significa **«y»**: deben cumplirse las dos condiciones.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Lo encuentra GitHub?
lenguaje: js
pide: GitHub solo busca las instrucciones del CI en la carpeta `.github/workflows/`, y solo archivos `.yml` o `.yaml`. Completa `loEncuentraGitHub(ruta)`.
--- código
function loEncuentraGitHub(ruta) {
  // tu código aquí
}
--- pruebas
prueba('.github/workflows/ci.yml: sí', () => igual(loEncuentraGitHub('.github/workflows/ci.yml'), true));
prueba('.github/workflows/publicar.yaml: sí', () => igual(loEncuentraGitHub('.github/workflows/publicar.yaml'), true));
prueba('github/workflows/ci.yml (sin el punto): no', () => igual(loEncuentraGitHub('github/workflows/ci.yml'), false));
prueba('.github/ci.yml (fuera de workflows): no', () => igual(loEncuentraGitHub('.github/ci.yml'), false));
prueba('.github/workflows/ci.txt: no', () => igual(loEncuentraGitHub('.github/workflows/ci.txt'), false));
--- solución
function loEncuentraGitHub(ruta) {
  return ruta.startsWith('.github/workflows/') && /\.ya?ml$/.test(ruta);
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El archivo del CI, como un objeto
lenguaje: js
pide: El YAML del CI es "nombre: valor" con sangría, igual que un objeto de JavaScript. Escribe el objeto `ci` que corresponde a este YAML: se llama `CI`, corre en cada `push` a `main`, y tiene un trabajo `app` en `ubuntu-latest` con tres pasos: `npm ci`, `npm run tipos` y `npm test` (cada paso es `{ run: '…' }`).
--- código
const ci = {
  // tu código aquí
};
--- pruebas
prueba('se llama CI', () => igual(ci.name, 'CI'));
prueba('corre en cada push a main', () => igual(ci.on, { push: { branches: ['main'] } }));
prueba('el trabajo app corre en ubuntu', () => igual(ci.jobs?.app?.['runs-on'], 'ubuntu-latest'));
prueba('los tres pasos en orden', () => igual(ci.jobs?.app?.steps?.map((s) => s.run), ['npm ci', 'npm run tipos', 'npm test']));
--- solución
const ci = {
  name: 'CI',
  on: { push: { branches: ['main'] } },
  jobs: {
    app: {
      'runs-on': 'ubuntu-latest',
      steps: [{ run: 'npm ci' }, { run: 'npm run tipos' }, { run: 'npm test' }],
    },
  },
};
```

```practica
elige :: ¿Qué palabra dice CUÁNDO corre el CI? :: `jobs` :: `on` :: `run`
elige :: ¿Qué diferencia hay entre `uses` y `run`? :: Ninguna :: `uses` usa una pieza ya hecha; `run` ejecuta un comando :: `run` usa una pieza ya hecha; `uses` ejecuta un comando
vf :: Los `jobs` corren uno detrás del otro
vf :: Si un `step` falla, los siguientes pasos de ese trabajo no se ejecutan
elige :: `runs-on: ubuntu-latest` quiere decir… :: Que corre en un iPhone :: Que corre en una máquina con Linux :: Que corre en mi Mac
```

> 🔁 **Repaso:** `name`, `on` (cuándo), `jobs` (trabajos en paralelo), `runs-on` (sistema), `steps` (pasos en orden), `uses` (pieza hecha), `run` (comando), `working-directory` (carpeta).

## 6. El archivo de Copiloto, explicado

> 🎙️ **El profesor:** ahora leemos el archivo **real** de Copiloto, como hicimos con las funciones en el Tema 01. Es el más largo de la clase: tómate tu tiempo.

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

Hoy (noviembre de 2026) el CI de Copiloto tiene **6 trabajos** que corren **al mismo tiempo**, cada uno en su máquina:

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

> 🔁 **Repaso:** el CI de Copiloto tiene 6 trabajos que corren a la vez. El primero, `app`, prepara una máquina limpia (descarga el código, instala Node y las librerías con `npm ci`) y revisa tipos, diseño, ciclos, tamaño, secretos, pruebas y que la app se pueda armar.

## 7. Los otros cinco trabajos

> 🎙️ **El profesor:** ya viste el trabajo más grande. Los otros cinco son más cortos: cada uno revisa **una parte** del proyecto (el cartón de Android, las funciones, las reglas, el panel y la web).

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

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.map()`**: crea una lista **nueva** cambiando cada elemento: `[1, 2, 3].map((n) => n * 2)` → `[2, 4, 6]`. La lista original no cambia.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Cuánto tarda? Trabajos al mismo tiempo
lenguaje: js
pide: Los trabajos del CI corren **al mismo tiempo**, cada uno en su máquina; los pasos de un trabajo, uno **después** del otro. Completa `duracionCI(trabajos)`: cada trabajo es una lista de duraciones de sus pasos (en segundos). El CI tarda lo que tarde **el trabajo más lento**.
--- código
function duracionCI(trabajos) {
  // tu código aquí
}
--- pruebas
prueba('un trabajo de 10 + 20 + 30 tarda 60', () => igual(duracionCI([[10, 20, 30]]), 60));
prueba('dos trabajos: tarda lo del más lento', () => igual(duracionCI([[10, 20], [5, 50]]), 55));
prueba('sin trabajos: 0', () => igual(duracionCI([]), 0));
--- solución
function duracionCI(trabajos) {
  const duraciones = trabajos.map((pasos) => pasos.reduce((s, d) => s + d, 0));
  return Math.max(0, ...duraciones);
}
```

```practica
elige :: ¿Cuántos trabajos tiene hoy el CI de Copiloto? :: 3 :: 5 :: 6 :: 10
elige :: ¿Qué hace `actions/checkout`? :: Instala Node :: Descarga tu código a la máquina limpia :: Corre las pruebas
elige :: ¿Por qué se usa `npm ci` y no `npm install`? :: Porque es más lindo :: Porque instala exactamente lo anotado en `package-lock.json` y falla si algo no coincide :: Porque no instala nada
elige :: Un archivo de 1.200 líneas, ¿qué paso lo atrapa? :: Secretos :: Tamaño (`check:size`) :: Bundle
elige :: ¿Por qué el trabajo del cartón instala Java? :: Porque la app está en Java :: Porque el cartón está en Kotlin, que necesita Java :: Porque GitHub lo exige
vf :: `--noEmit` quiere decir "revisa, pero no generes archivos"
vf :: Las pruebas de las reglas usan la base de datos real de producción
escribe :: ¿Qué es un "ciclo" entre archivos y por qué es malo? :: Cuando el archivo A usa a B y B usa a A; la app puede arrancar rota, como la llave que está dentro de la caja que abre.
```

> 🔁 **Repaso:** 6 trabajos en paralelo. `app` prepara la máquina (checkout, Node 22, `npm ci`) y revisa tipos, diseño, ciclos, tamaño, secretos, pruebas y bundle. Los demás: cartón (Kotlin), servidor, reglas (emulador), panel y web.

## 8. ¿Cómo se ve en GitHub?

> 🎙️ **El profesor:** todo esto lo puedes **ver**. Vamos a GitHub.

1. Entra a **[github.com/DelvinSmart/gastos-del-carro](https://github.com/DelvinSmart/gastos-del-carro)**, el proyecto de práctica. (El de Copiloto es privado; este es público y tiene un CI con los mismos candados.)
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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los colores de la pestaña Actions
lenguaje: js
pide: En la pestaña Actions, cada subida tiene un color según el estado de sus trabajos. Completa `colorDeLaSubida(estados)`: si **alguno** falló (`'fallo'`) → `'rojo'`; si no, si **alguno** sigue corriendo (`'corriendo'`) → `'amarillo'`; si todos pasaron (`'ok'`) → `'verde'`.
--- código
function colorDeLaSubida(estados) {
  // tu código aquí
}
--- pruebas
prueba('todos ok: verde', () => igual(colorDeLaSubida(['ok', 'ok']), 'verde'));
prueba('uno corriendo: amarillo', () => igual(colorDeLaSubida(['ok', 'corriendo']), 'amarillo'));
prueba('uno falló: rojo', () => igual(colorDeLaSubida(['ok', 'fallo']), 'rojo'));
prueba('falló uno aunque otro siga corriendo: rojo', () => igual(colorDeLaSubida(['corriendo', 'fallo']), 'rojo'));
--- solución
function colorDeLaSubida(estados) {
  if (estados.includes('fallo')) return 'rojo';
  if (estados.includes('corriendo')) return 'amarillo';
  return 'verde';
}
```

```practica
elige :: ¿En qué pestaña de GitHub ves el CI? :: Code :: Actions :: Settings
elige :: Una corrida en amarillo 🟡 quiere decir… :: Que falló :: Que todavía está corriendo :: Que pasó
vf :: Para ver qué falló, entras a la corrida, después al trabajo, y buscas el paso en rojo
```

> 🔁 **Repaso:** pestaña Actions: verde pasó, rojo falló, amarillo corriendo. Entras a la corrida → trabajo → paso en rojo → error. Desde la terminal: `gh run list`.

## 9. ¿Cómo se construye un CI desde cero?

> 🎙️ **El profesor:** en una entrevista te pueden pedir: "¿cómo armarías un CI para un proyecto nuevo?". Esta es la receta, y es la misma que se usó en Copiloto.

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
6. **Agrega revisiones de a una.** Cada vez que encuentres un error que se repite, crea una revisión para que no vuelva. **Así nacieron el candado de diseño y el de ciclos** en Copiloto.

> 🌎 **En la vida real:** el reglamento de un gimnasio nuevo: empiezas con una regla ("todos firman al entrar") y, cada vez que se repite un problema ("dejan las pesas tiradas"), agregas otra.

> 🌎 **Otro ejemplo:** Como armar las reglas de una casa con hijos adolescentes: empiezas con una ("avisar si llegas tarde") y agregas otra cada vez que pasa algo que no quieres que se repita.

> ✋ **Para y piensa:** lee el CI mínimo de arriba y di en voz alta qué hace, línea por línea.

<details>
<summary>Ver la respuesta</summary>

Se llama CI; corre en cada push; tiene un trabajo llamado `pruebas` que corre en Linux; descarga el código, instala Node 22, instala las librerías exactas con `npm ci` y corre las pruebas con `npm test`.

</details>

> 🧩 **Para este ejercicio:** la función `ordenar` **ya viene hecha**. `.toSorted(...)` crea una lista ordenada e `.indexOf(x)` dice en qué posición de `ORDEN` está cada paso. Tú solo escribes los cinco nombres en `ORDEN`, en el orden correcto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La receta de un CI desde cero, en orden
lenguaje: js
pide: Ordena los pasos de un CI nuevo. Completa `ordenar(pasos)` para que devuelva los pasos en el orden correcto, usando la lista `ORDEN` (que escribes tú): primero bajar el código, después instalar Node, después instalar las dependencias, después revisar los tipos, y al final las pruebas.
--- código
const ORDEN = [
  // escribe aquí los 5 nombres en orden: 'checkout', 'setup-node', 'npm ci', 'tipos', 'pruebas'
];

function ordenar(pasos) {
  return pasos.toSorted((a, b) => ORDEN.indexOf(a) - ORDEN.indexOf(b));
}
--- pruebas
prueba('el orden correcto', () => igual(ordenar(['pruebas', 'npm ci', 'checkout', 'tipos', 'setup-node']), ['checkout', 'setup-node', 'npm ci', 'tipos', 'pruebas']));
prueba('el código se baja antes que todo', () => igual(ORDEN[0], 'checkout'));
prueba('las dependencias antes de revisar', () => ok(ORDEN.indexOf('npm ci') < ORDEN.indexOf('tipos') && ORDEN.indexOf('npm ci') >= 0, 'sin dependencias instaladas, TypeScript y las pruebas no corren'));
--- solución
const ORDEN = ['checkout', 'setup-node', 'npm ci', 'tipos', 'pruebas'];

function ordenar(pasos) {
  return pasos.toSorted((a, b) => ORDEN.indexOf(a) - ORDEN.indexOf(b));
}
```

```practica
escribe :: ¿Cuáles son los pasos para armar un CI desde cero? :: Decidir qué revisar; que cada revisión sea un comando que funcione en la terminal; crear .github/workflows/ci.yml; escribir el trabajo mínimo (checkout, Node, npm ci, npm test); subirlo y mirar Actions; agregar revisiones de a una.
vf :: Antes de ponerlo en el CI, el comando tiene que funcionar en mi terminal
elige :: ¿Cómo nacieron los candados de diseño y de ciclos? :: Venían con GitHub :: Por errores que se repetían en la app :: Los pidió Google Play
```

> 🔁 **Repaso:** decidir qué revisar → que sea un comando → crear `ci.yml` → trabajo mínimo → subir → agregar revisiones de a una, por cada error que se repite.

## 10. Cómo "piensa" el CI

> 🎙️ **El profesor:** este es el secreto más simple del CI, y te va a ayudar a entender todo: **el CI no entiende la app Copiloto**. Solo entiende **una cosa**.

Cada comando, al terminar, devuelve un número llamado **código de salida** (*exit code*):
- **`0`** significa "todo bien".
- **Cualquier otro número** significa "falló".

Si un paso devuelve algo distinto de 0, el CI lo marca en rojo y detiene ese trabajo. **Eso es todo lo que mira.**

Por eso scripts como `check:design` están hechos para **terminar con error** cuando encuentran un problema. El CI no sabe qué es un color: solo ve que el script terminó con un número distinto de 0.

Mira cómo lo hace el script de tamaño de Copiloto (está en portugués):

```js
for (const [file, lines] of big) console.error(`✖ ${file}: ${lines} linhas (máximo ${MAX_LINES})`);
// … y si hay archivos grandes, termina con error.
console.log(`✔ Tamanho: nenhum arquivo passa de ${MAX_LINES} linhas.`);
```

`console.error` muestra un mensaje de **error**, y `console.log` muestra un mensaje normal.

Si todo está bien, escribe "✔ Tamaño: ningún archivo pasa de 1000 líneas" y termina con 0.

> 🌎 **En la vida real:** el guardia que solo mira la luz del detector de metales: **verde o roja**. No sabe qué llevas en el bolsillo, solo si sonó.

> 🌎 **Otro ejemplo:** Como un semáforo: no sabe nada del tránsito ni de los conductores; solo muestra verde o rojo según la señal que recibe.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El CI solo entiende el código de salida
lenguaje: js
pide: Cada comando, al terminar, deja un **código de salida**: `0` es "todo bien" y cualquier otro número es "falló". El CI no lee los mensajes: solo mira ese número. Completa `pasoVerde(codigo)` y `ciVerde(codigos)` (verde solo si **todos** son 0).
--- código
function pasoVerde(codigo) {
  // tu código aquí
}

function ciVerde(codigos) {
  // tu código aquí
}
--- pruebas
prueba('0 es verde', () => igual(pasoVerde(0), true));
prueba('1 es rojo', () => igual(pasoVerde(1), false));
prueba('cualquier número distinto de 0 es rojo', () => igual(pasoVerde(127), false));
prueba('todos 0: verde', () => igual(ciVerde([0, 0, 0]), true));
prueba('uno distinto de 0: rojo', () => igual(ciVerde([0, 2, 0]), false));
--- solución
function pasoVerde(codigo) {
  return codigo === 0;
}

function ciVerde(codigos) {
  return codigos.every(pasoVerde);
}
```

```practica
elige :: ¿Qué código de salida significa "todo bien"? :: 1 :: 0 :: 200
vf :: El CI entiende qué es un color mal puesto
vf :: Un script de revisión tiene que terminar con error cuando encuentra un problema
escribe :: Explica con tus palabras cómo "piensa" el CI. :: Solo mira el código de salida de cada comando: 0 es todo bien, cualquier otro número es que falló, y entonces marca el paso en rojo.
```

> 🔁 **Repaso:** el CI solo mira el código de salida: 0 = bien, otro número = falló. Por eso las revisiones terminan con error cuando encuentran un problema.

## Ejercicios

> 🎙️ **El profesor:** a la práctica, con el proyecto de práctica [Gastos del carro](https://github.com/DelvinSmart/gastos-del-carro) (bájalo como dice su README). Las preguntas 4, 5 y 6 se responden sin computadora.

> 🌎 **En la vida real:** Es como recorrer la fábrica con el jefe y explicar con tus palabras qué hace cada máquina.

1. Abre `.github/workflows/ci.yml` en Gastos del carro: tiene **2 trabajos**. Escribe con tus palabras qué hace cada uno y qué revisa cada paso.
2. Entra a la pestaña **Actions** de Gastos del carro y abre la última subida. ¿Cuánto tardó? ¿Cuál fue el trabajo más lento?
3. En la terminal, dentro de `gastos-del-carro`, corre `npm run check:tamano`. ¿Qué dice?
4. Si cambias un color a mano en una pantalla (`color: '#FF0000'`), ¿qué paso del CI falla?
5. ¿Por qué se usa `npm ci` y no `npm install`?
6. ¿Por qué el CI no puede detectar que un botón se ve feo?

<details>
<summary>Ver las correcciones explicadas</summary>

1. **La app** (TypeScript, los cuatro candados y las pruebas) y **Las reglas de Firestore** (instala Java y prueba las reglas con el emulador). En Copiloto son 6: app, carton-android (Kotlin del cartón), functions (servidor), reglas, panel y webapp.
2. Suele tardar uno o dos minutos. El más lento es el de **las reglas**, porque instala Java y levanta el emulador de Firebase. (El de Copiloto tarda unos 4 minutos.)
3. Si todo está bien: `✓ ningún archivo pasa de 300 líneas`. (En Copiloto el límite es 1000 y el mensaje sale en portugués.)
4. El **Candado de diseño** (`check:design`), en el trabajo `app`.
5. Porque `npm ci` instala exactamente lo anotado en `package-lock.json` y falla si algo no coincide; así la máquina del CI tiene las mismas versiones que tú.
6. Porque el CI solo corre comandos y pruebas, y ninguno mira la pantalla. Para eso se prueba en el teléfono (o con pruebas E2E, que Copiloto todavía no tiene).

</details>

## Para la entrevista

> 🎙️ **El profesor:** en voz alta, como frente al entrevistador.

> 🎤 **Entrevista:** "¿Qué es CI?"

<details>
<summary>Ver una buena respuesta</summary>

"Integración continua: en cada subida, una máquina limpia descarga el código, lo instala desde cero y corre las revisiones automáticas. Si algo falla, el equipo lo sabe en minutos. En mi app, una vez el CI encontró un fallo que mi Mac escondía porque tenía cosas instaladas de antes."

</details>

> 🎤 **Entrevista:** "¿Qué revisa el CI de Copiloto?"

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
vf :: La app Copiloto tiene CD: se publica sola en Google Play
```

> 🔁 **Repaso final de la clase:** sabes qué es el CI, para qué sirve, sus límites, dónde vive, cómo se lee el YAML, los 6 trabajos de Copiloto, cómo verlo en GitHub, cómo armar uno desde cero y que solo mira el código de salida. Próxima: **Tema 05, Mi primer cambio**.
