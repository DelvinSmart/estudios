# IA 4: otras herramientas — OpenCode, Codex, Gemini y modelos locales

> 🌎 **En la vida real:** un buen carpintero no tiene un solo martillo: tiene varios, y sabe cuál usar para cada clavo.

> 🎙️ **El profesor dice:** Claude es tu principal, pero no la única. Tú usas **OpenCode** con el plan gratis para código, **Gemini** para preparar pedidos, probaste **Codex** y a veces **Llama**. Hoy vemos qué es cada una, en qué se parecen, en qué se diferencian y cuándo conviene cada una. Los planes y precios cambian seguido: lo que no cambia es la forma de trabajar.

## Parte 1. Los agentes de código en la terminal

> 🌎 **En la vida real:** son como distintas marcas de taladro: todas perforan, cambia el agarre, la batería y el precio.

> 🌎 **Otro ejemplo:** Es como Uber, 99 y InDrive: el viaje es el mismo; cambian la app, el precio y las reglas.

### OpenCode

**OpenCode** es un agente de código **de código abierto** que corre en la terminal. Su gracia: se conecta con **muchos proveedores de modelos** (incluidos algunos gratis y modelos locales), así que puedes cambiar de modelo sin cambiar de herramienta. Lee las reglas de **AGENTS.md**. Funciona igual que Claude Code: lee el proyecto, propone cambios, corre comandos con tu permiso.

> 🌎 **En la vida real:** es como un control remoto universal: el mismo control para la tele de cualquier marca.

> 🌎 **Otro ejemplo:** Es como un celular con dos chips: cambias de compañía sin cambiar de teléfono.

### Codex

**Codex** es el agente de código de OpenAI: tiene una versión de terminal (de código abierto) y otra en la nube que trabaja en paralelo sobre tu repositorio. También lee **AGENTS.md**. Usa los modelos de OpenAI.

> 🌎 **En la vida real:** es como otra marca de taladro con su propia batería: muy bueno, pero con sus repuestos.

> 🌎 **Otro ejemplo:** Es como un taller con servicio a domicilio: puede trabajar en tu casa (terminal) o llevarse el carro (nube).

### Gemini y Gemini CLI

En la web, **Gemini** te sirve para conversar, investigar y **preparar pedidos** (IA 2). También existe **Gemini CLI**, su agente de terminal, que lee las reglas de **GEMINI.md**. Por eso este repositorio tiene un `GEMINI.md`.

> 🌎 **En la vida real:** es como tener un amigo que escribe muy bien: le pides que te ordene la carta antes de mandarla.

> 🌎 **Otro ejemplo:** Es como un asistente que prepara la agenda de la reunión para que la reunión sea corta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cada herramienta lee su archivo de reglas
lenguaje: js
pide: Completa `archivoDe(herramienta)`: `'claude code'` → `'CLAUDE.md'`; `'gemini cli'` → `'GEMINI.md'`; `'opencode'` y `'codex'` → `'AGENTS.md'` (sin importar mayúsculas); otra → `'AGENTS.md'` (el formato abierto). Y `faltan(existentes, herramientas)`: los archivos de reglas que necesitan esas herramientas y **no** están en el proyecto, sin repetir, en el orden en que aparecen.
--- código
function archivoDe(herramienta) {
  // tu código aquí
}

function faltan(existentes, herramientas) {
  // tu código aquí
}
--- pruebas
prueba('cada una con el suyo', () => igual(['Claude Code', 'Gemini CLI', 'OpenCode', 'Codex', 'otra'].map(archivoDe), ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', 'AGENTS.md', 'AGENTS.md']));
prueba('lo que falta, sin repetir', () => igual(faltan(['CLAUDE.md'], ['Claude Code', 'OpenCode', 'Codex', 'Gemini CLI']), ['AGENTS.md', 'GEMINI.md']));
prueba('nada falta', () => igual(faltan(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'], ['OpenCode', 'Gemini CLI']), []));
--- solución
function archivoDe(herramienta) {
  const h = herramienta.toLowerCase();
  if (h === 'claude code') return 'CLAUDE.md';
  if (h === 'gemini cli') return 'GEMINI.md';
  return 'AGENTS.md';
}

function faltan(existentes, herramientas) {
  const necesarios = [];
  for (const h of herramientas) {
    const a = archivoDe(h);
    if (!existentes.includes(a) && !necesarios.includes(a)) necesarios.push(a);
  }
  return necesarios;
}
```

```practica
vf :: OpenCode se puede conectar con distintos proveedores de modelos
vf :: Solo Claude Code puede leer un archivo de reglas del proyecto
elige :: ¿Qué archivo de reglas lee Gemini CLI? :: README.md :: GEMINI.md :: package.json
elige :: ¿Cuál es la gracia principal de OpenCode? :: Que solo usa un modelo :: Que es abierto y se conecta con muchos modelos, incluidos algunos gratis :: Que no necesita terminal
escribe :: ¿En qué se parecen Claude Code, OpenCode y Codex? :: Los tres son agentes de código: leen el proyecto, proponen y aplican cambios, corren comandos con permiso y leen un archivo de reglas del proyecto.
```

## Parte 2. Modelos locales con Llama

> 🌎 **En la vida real:** es como tener una huerta en casa: no depende del supermercado, pero produce menos variedad.

> 🌎 **Otro ejemplo:** Es como un generador eléctrico: cuando se corta la luz de la calle, sigues teniendo algo.

### Ollama y Llama

**Ollama** descarga y corre modelos abiertos (como **Llama** de Meta) en tu computadora. Ventajas: **privacidad** (nada sale de tu Mac), funciona **sin internet** y **sin límites de uso**. Desventajas: los que caben en una laptop son **menos capaces** que los grandes de la nube y usan mucha memoria.

```bash
ollama pull llama3.2        # descargar el modelo
ollama run llama3.2         # conversar en la terminal
ollama list                 # ver qué modelos tienes
```

> 🌎 **En la vida real:** es como la calculadora del celular vs pedirle a un contador: la calculadora es tuya y privada, el contador sabe más.

> 🌎 **Otro ejemplo:** Es como un diccionario offline: no tiene todas las palabras nuevas, pero funciona en el avión.

### Cuándo conviene uno local

Para textos con datos que no pueden salir de tu computadora, para practicar sin gastar el límite gratis, o para tareas simples (resumir, renombrar, explicar algo corto). Para cambios grandes en un proyecto, los modelos grandes rinden mucho más. Algunas herramientas (como OpenCode) pueden usar un modelo local como motor.

> 🌎 **En la vida real:** para hervir agua usas la cocina de casa; para un banquete de 100 personas, contratas un catering.

> 🌎 **Otro ejemplo:** Es como arreglar un botón tú mismo y llevar el traje completo a la sastrería.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Qué modelos tienes y cuáles caben
lenguaje: js
pide: Completa `leerLista(salida)`: lee la salida de `ollama list` (la primera línea son los títulos) y devuelve `{ nombre, gb }` por modelo, con el tamaño como número (la columna `SIZE` viene como `2.0 GB`). Y `caben(modelos, memoriaGb)`: los nombres de los que pesan **menos de la mitad** de la memoria de tu computadora (para que la Mac siga andando mientras el modelo trabaja).
--- código
function leerLista(salida) {
  // tu código aquí
}

function caben(modelos, memoriaGb) {
  // tu código aquí
}
--- pruebas
const salida = `NAME              ID              SIZE      MODIFIED
llama3.2:latest   a80c4f17acd5    2.0 GB    3 days ago
llama3.1:8b       46e0c10c039e    4.9 GB    2 weeks ago
llama3.3:70b      a6eb4748fd29    42 GB     1 month ago`;
prueba('lee la lista', () => igual(leerLista(salida), [{ nombre: 'llama3.2:latest', gb: 2 }, { nombre: 'llama3.1:8b', gb: 4.9 }, { nombre: 'llama3.3:70b', gb: 42 }]));
prueba('en una Mac de 16 GB', () => igual(caben(leerLista(salida), 16), ['llama3.2:latest', 'llama3.1:8b']));
prueba('en una de 8 GB', () => igual(caben(leerLista(salida), 8), ['llama3.2:latest']));
--- solución
function leerLista(salida) {
  return salida
    .split('\n')
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => {
      const c = l.trim().split(/\s+/);
      return { nombre: c[0], gb: Number(c[2]) };
    });
}

function caben(modelos, memoriaGb) {
  return modelos.filter((m) => m.gb < memoriaGb / 2).map((m) => m.nombre);
}
```

```practica
vf :: Con Ollama, el modelo corre en tu computadora y funciona sin internet
vf :: Un modelo local en una laptop siempre es mejor que los grandes de la nube
elige :: ¿Qué comando abre una conversación con Llama en la terminal? :: ollama borrar :: ollama run llama3.2 :: git run llama
elige :: ¿Cuándo conviene un modelo local? :: Para reescribir todo un proyecto grande :: Para textos con datos que no deben salir de tu computadora o tareas simples :: Nunca
escribe :: Nombra dos ventajas y una desventaja de un modelo local. :: Ventajas: privacidad (nada sale de mi computadora) y sin internet ni límites de uso. Desventaja: es menos capaz que los modelos grandes de la nube y usa mucha memoria.
```

## Parte 3. Elegir la herramienta para cada tarea

> 🌎 **En la vida real:** no vas al cardiólogo por un resfrío ni al médico general para una operación del corazón.

> 🌎 **Otro ejemplo:** Es como elegir entre moto, carro o camión según lo que tengas que llevar.

### Una tabla para decidir

| Tarea | Buena opción | Por qué |
|---|---|---|
| Cambios en un proyecto, revisar, depurar | **Claude Code** | Tu principal: razona bien y trabaja en el proyecto |
| Seguir programando cuando se acaba el límite | **OpenCode** con un modelo gratis | Mismo modo de trabajo, otro motor |
| Ordenar una idea, preparar un pedido, investigar | **Gemini** (web) o Claude (chat) | Conversar antes de tocar código |
| Varias tareas en paralelo en la nube | **Codex** (nube) u otra sesión | Trabajan solos y te devuelven un cambio |
| Datos privados o practicar sin límites | **Llama** con Ollama | Nada sale de tu computadora |

> 🌎 **En la vida real:** es como la caja de herramientas organizada: cada cosa en su lugar, y sabes cuál sacar.

> 🌎 **Otro ejemplo:** Es como un menú de transporte: metro para el centro, Uber de noche, bicicleta el domingo.

### Lo que no cambia entre herramientas

Cambie la herramienta o el modelo, el método es el mismo: **reglas del proyecto** en AGENTS.md, **pedido claro**, **plan antes de lo grande**, **leer el diff**, **probar**, **commit chico**. Si dominas el método, cambiar de herramienta te toma una tarde.

> 🌎 **En la vida real:** si sabes manejar, cambiar de carro te toma unos minutos para encontrar las luces.

> 🌎 **Otro ejemplo:** Es como cocinar en una cocina ajena: los utensilios cambian, la receta no.

### Cuidado con mezclar herramientas en el mismo cambio

Dos agentes trabajando al mismo tiempo **en los mismos archivos** se pisan. Si usas dos herramientas, que cada una trabaje en su parte (o en su propia rama de Git, Tema 06), y revisa antes de juntar. Pasó con la guía `COMO-SUBIR-CAMBIOS.md` de ¿Qué dice la Biblia?: otro agente trabajó en su rama y después se compararon y se juntó lo mejor.

> 🌎 **En la vida real:** dos pintores en la misma pared, cada uno con un color, terminan en un desastre.

> 🌎 **Otro ejemplo:** Es como dos personas editando el mismo documento sin avisarse: uno borra lo que el otro escribió.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La herramienta para cada tarea, y no pisarse
lenguaje: js
pide: Completa `elegir(tarea)` con la tabla de la lección: `datosPrivados` → `'Llama con Ollama'`; `sinLimite` (se te acabó el plan) → `'OpenCode con un modelo gratis'`; `paralelo` → `'Codex en la nube u otra sesión'`; `soloPensar` → `'Gemini o Claude en el chat'`; si no, `'Claude Code'` (revisa en ese orden). Y `sePisan(a, b)`: los archivos que tocan **los dos** agentes a la vez (si hay alguno, uno tiene que esperar o ir en otra rama).
--- código
function elegir(tarea) {
  // tu código aquí
}

function sePisan(a, b) {
  // tu código aquí
}
--- pruebas
prueba('lo de siempre', () => igual(elegir({}), 'Claude Code'));
prueba('datos privados primero', () => igual(elegir({ datosPrivados: true, paralelo: true }), 'Llama con Ollama'));
prueba('las demás', () => igual([elegir({ sinLimite: true }), elegir({ paralelo: true }), elegir({ soloPensar: true })], ['OpenCode con un modelo gratis', 'Codex en la nube u otra sesión', 'Gemini o Claude en el chat']));
prueba('se pisan en un archivo', () => igual(sePisan(['web/app.js', 'web/estilos.css'], ['web/estilos.css', 'README.md']), ['web/estilos.css']));
prueba('cada uno en lo suyo', () => igual(sePisan(['a.js'], ['b.js']), []));
--- solución
function elegir(tarea) {
  if (tarea.datosPrivados) return 'Llama con Ollama';
  if (tarea.sinLimite) return 'OpenCode con un modelo gratis';
  if (tarea.paralelo) return 'Codex en la nube u otra sesión';
  if (tarea.soloPensar) return 'Gemini o Claude en el chat';
  return 'Claude Code';
}

function sePisan(a, b) {
  return a.filter((archivo) => b.includes(archivo));
}
```

```practica
vf :: Si dominas el método (reglas, pedido claro, diff, pruebas, commits), cambiar de herramienta es fácil
vf :: Dos agentes pueden editar los mismos archivos al mismo tiempo sin problema
elige :: Se te acabó el límite gratis de una herramienta en medio del trabajo. ¿Qué haces? :: Esperas una semana :: Sigues con otra (por ejemplo OpenCode con otro modelo), con las mismas reglas del proyecto :: Borras el proyecto
elige :: Para ordenar una idea antes de programar, ¿qué conviene? :: Codex en la nube :: Conversar con Gemini o Claude en el chat :: Ollama sin pedido
escribe :: Arma tu combinación de herramientas y di para qué usas cada una. :: Por ejemplo: Claude Code como principal para el proyecto; OpenCode con un modelo gratis cuando se acaba el límite; Gemini para preparar y mejorar los pedidos; Llama con Ollama para cosas privadas o para practicar.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué herramientas de IA usas?":** "Claude Code como principal. OpenCode cuando quiero otro modelo o se me acaba el límite, porque es abierto y se conecta con varios proveedores. Gemini para ordenar ideas y preparar pedidos. Probé Codex, y uso Llama con Ollama cuando necesito privacidad. Las reglas del proyecto las tengo en AGENTS.md para que todas trabajen igual."

> 🌎 **En la vida real:** es como un músico que dice qué instrumentos toca y para qué usa cada uno.

> 🌎 **Otro ejemplo:** Es como un fotógrafo que explica qué lente usa para retratos y cuál para paisajes.
