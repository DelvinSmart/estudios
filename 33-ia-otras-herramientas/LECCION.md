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

Dos agentes trabajando al mismo tiempo **en los mismos archivos** se pisan. Si usas dos herramientas, que cada una trabaje en su parte (o en su propia rama de Git, Tema 06), y revisa antes de juntar. Te pasó con la guía `COMO-SUBIR-CAMBIOS.md`: otro agente trabajó en su rama y después comparamos y juntamos lo mejor.

> 🌎 **En la vida real:** dos pintores en la misma pared, cada uno con un color, terminan en un desastre.

> 🌎 **Otro ejemplo:** Es como dos personas editando el mismo documento sin avisarse: uno borra lo que el otro escribió.

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
