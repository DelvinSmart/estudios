# La entrevista en dos niveles: Recursos Humanos y el líder técnico

> 🌎 **En la vida real:** si vas a vender tu carro, al vecino le dices "anda muy bien, gasta poco y nunca me dejó a pie". Al mecánico que lo revisa le dices "motor 1.5 con 85 000 km, cambio de aceite cada 5000, frenos nuevos hace un mes". Es el mismo carro, contado en dos idiomas. Una entrevista de trabajo es igual.

> 🎙️ **El profesor dice:** {{alumno}}, casi todas las entrevistas para programador tienen dos conversaciones. Primero con **Recursos Humanos** (RH), que quiere saber quién eres, cómo trabajas y si entiendes lo que hiciste. Después con el **líder técnico**, que quiere saber si de verdad sabes: te pregunta definiciones, te pide explicar código y a veces te pone un ejercicio. Hoy te preparas para las dos: cómo contar tu historia con tus palabras y algunos términos bien usados, y un **glosario** donde cada término está en dos versiones, la de RH y la del líder técnico, con el lugar donde lo usaste.

## Parte 1. Cómo es una entrevista, etapa por etapa

| Etapa | Con quién | Qué busca | Cómo se responde |
|---|---|---|---|
| 1. Primera conversación | **Recursos Humanos** | Quién eres, por qué quieres el trabajo, cómo te comunicas, si encajas en el equipo | Con tus palabras, claro, con ejemplos reales y **algunos términos** bien usados |
| 2. Entrevista técnica | El **líder técnico** (o un programador del equipo) | Si sabes lo que dices: definiciones, cómo funciona tu proyecto, cómo resuelves un problema | Con la **definición técnica**, un ejemplo y dónde lo usaste |
| 3. A veces, una prueba | El equipo técnico | Ver cómo programas: un ejercicio corto o un proyecto pequeño | Pensando en voz alta: qué entiendes, qué vas a hacer, y probando |
| 4. Al final | RH o el jefe | Hablar de condiciones | Con calma, sabiendo lo que buscas |

Lo que **todos** buscan, en cualquier etapa: que **entiendas** lo que hiciste (no que lo recites), que digas la verdad cuando no sabes algo, y que sepas aprender.

> 🌎 **En la vida real:** es como el examen para la licencia de conducir: primero una conversación y los papeles (RH), después el examen práctico con el examinador (el líder técnico). Son dos cosas distintas, y te preparas para las dos.

> 🌎 **Otro ejemplo:** Es como entrar a un restaurante a trabajar de cocinero: primero hablas con el dueño (quién eres, qué horarios puedes), después el jefe de cocina te pone a cocinar un plato.

### Decir "no sé" (bien dicho)

Nadie sabe todo. Lo que el líder técnico quiere ver es **qué haces cuando no sabes**:

> "No lo usé todavía. Por lo que sé, es… (lo que sepas). Lo que haría es buscar la documentación oficial y probarlo en un ejemplo chico antes de usarlo en el proyecto."

Inventar una respuesta es lo peor: el líder técnico se da cuenta enseguida.

> 🌎 **En la vida real:** es como un médico que dice "eso no es mi especialidad, te mando con el especialista": da más confianza que uno que inventa.

```practica
vf :: Con Recursos Humanos conviene explicar con tus palabras y usar algunos términos bien usados
vf :: Con el líder técnico, si no sabes algo, lo mejor es inventar una respuesta segura
elige :: ¿Qué busca sobre todo la entrevista técnica? :: Que sepas el nombre de muchas herramientas :: Que entiendas lo que dices: definiciones, cómo funciona tu proyecto y cómo resuelves problemas :: Que hables rápido
elige :: En una prueba práctica, ¿qué conviene hacer? :: Escribir rápido sin hablar :: Pensar en voz alta: qué entiendes, qué vas a hacer, y probar :: Pedir que te den la solución
escribe :: Escribe cómo responderías a una pregunta técnica que no sabes. :: Por ejemplo: "No lo usé todavía. Sé que sirve para… Lo que haría es leer la documentación oficial y probarlo en un ejemplo chico antes de usarlo en el proyecto."
```

## Parte 2. Con Recursos Humanos: tu historia, con tus palabras

### Las preguntas de siempre

| Pregunta | Qué quieren saber | Cómo responder |
|---|---|---|
| "Cuéntame de ti" | Quién eres y por qué estás aquí | En un minuto: de dónde vienes, qué construiste, qué buscas |
| "¿Qué proyecto te enorgullece?" | Si entiendes lo que hiciste | El recorrido en 30 segundos (clase anterior) y un problema que resolviste |
| "Cuéntame de un problema difícil" | Cómo piensas cuando algo sale mal | Con el método **STAR** (abajo) |
| "¿Cómo aprendes algo nuevo?" | Si vas a poder seguir creciendo | Tu método real: construir, preguntar, explicarlo, practicar |
| "¿Cómo trabajas con inteligencia artificial?" | Si la usas con criterio | La IA agiliza; tú decides, revisas y apruebas (curso de IA) |

### El método STAR para contar un problema

**STAR** son cuatro letras en inglés: *Situation, Task, Action, Result*. En español: **la situación, lo que había que hacer, lo que hiciste y el resultado**.

> **Situación:** "Mi app, publicada en Google Play, tardaba casi 18 segundos en abrir."
> **Tarea:** "Tenía que hacer que abriera rápido sin romper nada, porque la usan personas reales."
> **Acción:** "Primero **medí** dónde se iba el tiempo, en vez de adivinar. Encontré cálculos que se repetían y **renders** de más, los arreglé uno por uno y cada cambio lo comprobé con las **pruebas automáticas**."
> **Resultado:** "Pasó a abrir en unos 6 segundos, y aprendí a medir antes de arreglar."

Fíjate en los términos: **medir**, **render**, **pruebas automáticas**. Están bien usados, dentro de una historia que cualquiera entiende. Eso es lo que busca RH.

> 🌎 **En la vida real:** STAR es como contar un partido: cómo estaba el marcador, qué había que hacer, la jugada que hiciste y cómo terminó.

> 🌎 **Otro ejemplo:** Es como el informe de un mecánico: qué síntoma tenía el carro, qué había que lograr, qué revisó y cambió, y cómo quedó.

### Cuéntame de ti (un ejemplo)

> "Soy conductor de aplicación y aprendí a programar construyendo la herramienta que yo mismo necesitaba: **Copiloto Driver**, una app para que los conductores controlen sus ganancias y gastos. Está publicada en Google Play y la usan personas reales. La hice en **React Native con TypeScript**, con **Firebase** para los datos y **pruebas automáticas** que corren en cada cambio. Trabajé con inteligencia artificial, pero me propuse entender cada pieza: armé un mapa de estudios con todo lo que aprendí. Busco un equipo donde seguir creciendo como programador."

```practica
vf :: STAR quiere decir: la situación, lo que había que hacer, lo que hiciste y el resultado
vf :: Con RH, cuantos más términos técnicos uses, mejor, aunque no se entienda la historia
elige :: Te preguntan "cuéntame de un problema difícil". ¿Qué conviene? :: Decir que nunca tuviste problemas :: Contarlo con STAR: situación, tarea, acción y resultado :: Hablar de la tecnología más difícil que conoces
elige :: ¿Cuánto debería durar tu respuesta a "cuéntame de ti"? :: Diez minutos :: Alrededor de un minuto :: Una palabra
escribe :: Cuenta un problema que hayas resuelto con el método STAR. :: Por ejemplo: Situación: la app tardaba casi 18 segundos en abrir. Tarea: hacerla rápida sin romper nada. Acción: medí dónde se iba el tiempo, quité cálculos repetidos y renders de más, y comprobé cada cambio con las pruebas. Resultado: abre en unos 6 segundos y aprendí a medir antes de arreglar.
```

## Parte 3. Con el líder técnico: definir, mostrar y conectar

Cuando el líder técnico pregunta "¿qué es X?", una buena respuesta tiene **tres partes**:

1. **La definición técnica**, corta y precisa.
2. **Un ejemplo** pequeño (dicho o escrito).
3. **Dónde lo usaste** en tus proyectos.

> **"¿Qué es un array?"**
> 1. "Un array es una **estructura de datos** que guarda varios valores **en orden**, y a cada uno se llega por su **posición**, que empieza en 0."
> 2. "Por ejemplo, `const viajes = [18.5, 22, 35]`; `viajes[0]` es 18.5."
> 3. "En Copiloto, las ganancias del día son un array, y saco el total con `reduce`."

Con eso, el líder técnico sabe que lo **entiendes** (la definición), lo **sabes usar** (el ejemplo) y lo **usaste de verdad** (tu proyecto).

> 🌎 **En la vida real:** es como un mecánico al que le preguntan qué es el embrague: lo define ("la pieza que conecta y separa el motor de las ruedas"), te muestra el pedal y te cuenta cuándo cambió uno.

> 🌎 **Otro ejemplo:** Es como un profesor que explica una palabra: la definición del diccionario, una frase de ejemplo y un caso de tu vida.

### Preguntas que vienen después

El líder técnico casi siempre sigue con un "¿y por qué?" o un "¿y si…?":

- "¿Por qué usaste un array y no un objeto?" → "Porque me importaba el orden y recorrerlos; un objeto sirve para buscar por nombre."
- "¿Y si el array está vacío?" → "`reduce` con valor inicial 0 devuelve 0; sin valor inicial, daría error."

Por eso no alcanza con memorizar: hay que **haberlo usado**.

```practica
vf :: Una buena respuesta técnica tiene la definición, un ejemplo y dónde lo usaste
vf :: Si te sabes la definición de memoria, el líder técnico no va a hacer más preguntas
elige :: ¿Cuál es la mejor respuesta a "¿qué es un array?"? :: "Es una lista" :: "Una estructura de datos que guarda valores en orden, a los que se llega por su posición; por ejemplo [18.5, 22]; en Copiloto lo uso para las ganancias del día" :: "Es algo de JavaScript"
elige :: "¿Por qué un array y no un objeto?" ¿Qué conviene responder? :: "Porque sí" :: "Porque me importaba el orden y recorrerlos; un objeto sirve para buscar por nombre" :: "Porque los objetos son viejos"
escribe :: Responde en tres partes (definición, ejemplo y dónde lo usaste): "¿qué es una función?". :: Una función es un bloque de código con nombre que recibe datos (parámetros), hace algo y puede devolver un resultado. Por ejemplo, function gananciaNeta(bruto, gastos) { return bruto - gastos; }. En Copiloto hay funciones así para limpiar el nombre de Mi empresa o calcular el combustible.
```

## Parte 4. El glosario (1): fundamentos y la web

Cada término en dos versiones. **Con tus palabras** es para RH (y para entenderlo tú). **La definición técnica** es para el líder técnico. **Dónde** es tu ejemplo real.

| Término | Con tus palabras (RH) | La definición técnica (líder técnico) | Dónde |
|---|---|---|---|
| **Variable** | Una cajita con nombre donde guardo un dato | Un nombre que hace referencia a un valor en memoria; con `const` no se reasigna, con `let` sí | `let viajes = 0` |
| **Tipo de dato** | Qué clase de dato es: número, texto, sí o no | La categoría de un valor, que define qué operaciones admite (`number`, `string`, `boolean`, `object`…) | `typeof 12` es `'number'` |
| **Función** | Una máquina: recibe algo, hace algo y devuelve algo | Un bloque de código reutilizable con parámetros y un valor de retorno | `gananciaNeta(bruto, gastos)` |
| **Condicional** | Una decisión: si pasa esto, hago aquello | Una estructura de control que ejecuta un bloque según una condición booleana (`if`, `switch`, ternario) | La meta del día |
| **Ciclo (bucle)** | Repetir algo varias veces | Una estructura de control que repite un bloque mientras se cumple una condición (`for`, `while`, `for...of`) | Sumar las ganancias |
| **Array** | Una lista en orden | Una estructura de datos indexada que guarda valores en orden; el índice empieza en 0 | Los viajes del día |
| **Objeto** | Una ficha con datos que tienen nombre | Una colección de pares llave–valor que describe una entidad | `{ marca, modelo, km }` |
| **Estructura de datos** | La forma de ordenar los datos para usarlos fácil | Una forma de organizar datos en memoria pensada para ciertas operaciones (arrays, objetos, mapas, conjuntos, colas) | Array para recorrer; objeto para buscar por nombre |
| **Algoritmo** | Una receta paso a paso para resolver algo | Una secuencia finita de pasos bien definidos que resuelve un problema | Calcular el nivel del tanque |
| **HTML** | Lo que dice qué hay en la página | El lenguaje de marcado que define la estructura y el contenido de una página web | Las clases de este mapa |
| **CSS** | Lo que dice cómo se ve | El lenguaje de hojas de estilo que define la presentación de los elementos | El motor de diseño |
| **DOM** | La página ya armada, que JavaScript puede cambiar | El árbol de objetos que el navegador construye a partir del HTML y que se manipula con JavaScript | El panel del mapa |
| **API** | Una ventanilla donde un programa le pide cosas a otro | Una interfaz que define cómo un programa se comunica con otro (operaciones, datos de entrada y salida) | La API de GitHub del panel |
| **HTTP** | El idioma en que hablan el navegador y el servidor | El protocolo de petición–respuesta de la web, con métodos (`GET`, `POST`, `PUT`, `DELETE`) y códigos de estado (200, 404, 500) | 409 cuando hay conflicto en el panel |
| **JSON** | Datos escritos como texto ordenado | Un formato de texto para intercambiar datos estructurados, basado en la sintaxis de objetos de JavaScript | Los estudios de la Biblia |
| **Frontend / backend** | Lo que se ve / lo que trabaja atrás | El cliente (interfaz, en el navegador o el teléfono) y el servidor (lógica, datos y seguridad) | La app y las Cloud Functions |

> 🌎 **En la vida real:** el glosario es como un diccionario de dos columnas para un viaje: cómo lo dices con tus palabras y cómo se dice "oficialmente". Con los dos, te entienden en la calle y en la oficina.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Array u objeto: elegir la estructura de datos
lenguaje: js
pide: Una buena forma de mostrar en la entrevista que entiendes las estructuras de datos es elegir bien. Completa `porApp(viajes)`: recibe un **array** de viajes (en orden) y devuelve un **objeto** donde la llave es la app y el valor es el total de esa app (para buscar por nombre, sin recorrer de nuevo). Después `ganadora(totales)` devuelve la app con más plata.
--- código
function porApp(viajes) {
  // tu código aquí
}

function ganadora(totales) {
  // tu código aquí
}
--- pruebas
const viajes = [{ app: 'Uber', valor: 18.5 }, { app: '99', valor: 42 }, { app: 'Uber', valor: 35 }];
prueba('suma por app', () => igual(porApp(viajes), { Uber: 53.5, '99': 42 }));
prueba('sin viajes, un objeto vacío', () => igual(porApp([]), {}));
prueba('la app ganadora', () => igual(ganadora({ Uber: 53.5, '99': 42 }), 'Uber'));
prueba('sin apps, null', () => igual(ganadora({}), null));
--- solución
function porApp(viajes) {
  const totales = {};
  for (const v of viajes) totales[v.app] = (totales[v.app] ?? 0) + v.valor;
  return totales;
}

function ganadora(totales) {
  let mejor = null;
  for (const [app, total] of Object.entries(totales)) {
    if (mejor === null || total > totales[mejor]) mejor = app;
  }
  return mejor;
}
```

```practica
vf :: Un array guarda valores en orden y se llega a cada uno por su posición, que empieza en 0
vf :: Frontend y backend son dos nombres para lo mismo
elige :: ¿Cuál es la definición técnica de API? :: Un tipo de base de datos :: Una interfaz que define cómo un programa se comunica con otro :: Un lenguaje de programación
elige :: ¿Qué código de HTTP quiere decir "no encontrado"? :: 200 :: 404 :: 500
escribe :: Define "estructura de datos" en las dos versiones: con tus palabras y técnica. :: Con mis palabras: la forma de ordenar los datos para usarlos fácil. Técnica: una forma de organizar datos en memoria pensada para ciertas operaciones, como arrays (orden e índice), objetos y mapas (buscar por llave) o conjuntos (sin repetidos).
```

## Parte 5. El glosario (2): datos, calidad y arquitectura

| Término | Con tus palabras (RH) | La definición técnica (líder técnico) | Dónde |
|---|---|---|---|
| **Base de datos** | Un archivo ordenado donde la app guarda todo | Un sistema que almacena datos de forma persistente y permite consultarlos | Firestore en Copiloto |
| **Firestore (NoSQL)** | Carpetas con fichas, en la nube | Una base de datos NoSQL de documentos organizados en colecciones, con sincronización en tiempo real | `users/{uid}/earnings` |
| **Autenticación / autorización** | Saber quién eres / saber qué puedes hacer | Verificar la identidad (login) / decidir los permisos de esa identidad | Firebase Auth / las reglas |
| **Reglas de seguridad** | El guardia que revisa cada pedido | Políticas que el servidor evalúa en cada lectura o escritura para permitirla o rechazarla | Las reglas del certificado |
| **Cloud Function** | Un pedacito de servidor que corre cuando lo llaman | Código que corre en el servidor bajo demanda, sin administrar servidores (*serverless*) | `aiCopilot`, `corregirPractica` |
| **Caché** | Guardar algo a mano para no buscarlo otra vez | Un almacenamiento temporal de resultados para evitar recalcularlos o volver a pedirlos | Los audios y el compilador de TypeScript |
| **Prueba unitaria** | Una revisión automática de una pieza chica | Una prueba que verifica el comportamiento de una unidad de código aislada | Las 38 pruebas de Gastos del carro |
| **CI (integración continua)** | Una máquina que revisa todo en cada cambio | Un proceso automático que compila y prueba el código en cada subida, en un ambiente limpio | El CI con candados |
| **Git, commit, rama** | Guardar versiones del proyecto / una foto / un camino aparte | Un sistema de control de versiones / un punto guardado con mensaje / una línea de desarrollo paralela | `feature/smart-camera` |
| **Refactorizar** | Ordenar el código sin cambiar lo que hace | Cambiar la estructura interna del código manteniendo su comportamiento, protegido por pruebas | Arreglar Copiloto |
| **Deuda técnica** | Atajos de hoy que se pagan mañana | El costo futuro de soluciones rápidas o desordenadas que habrá que corregir | El código espagueti |
| **POO** | Organizar el código en objetos que saben hacer cosas | Un paradigma que agrupa datos y comportamiento en objetos; se apoya en encapsulamiento, abstracción, herencia y polimorfismo | `ServicioCaja` |
| **Interfaz** | Un contrato: qué se puede pedir, sin decir cómo | Un tipo que declara qué propiedades u operaciones debe tener algo, sin implementarlas | `RepositorioCaja` |
| **Patrón repositorio** | El encargado de guardar y leer los datos | Una capa que abstrae el acceso a datos detrás de una interfaz, para que la lógica no dependa de dónde se guardan | El San de Copiloto |
| **Inyección de dependencias** | Darle a una pieza lo que necesita, en vez de que lo busque | Pasar las dependencias desde afuera (por el constructor o parámetros), lo que facilita probar y cambiar implementaciones | `new ServicioCaja(repositorio)` |
| **Separación de responsabilidades** | Cada pieza, una sola tarea | Un principio de diseño: cada módulo tiene una sola razón para cambiar | Datos, lógica y pantalla |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Interfaz, repositorio e inyección de dependencias, en 20 líneas
lenguaje: ts
pide: Muéstralo con código, como en una entrevista. Escribe la `interface Repositorio` (con `guardar(nombre: string): void` y `listar(): string[]`), una clase `RepositorioEnMemoria` que la **implemente**, y completa `Servicio`, que recibe el repositorio por el **constructor** (inyección de dependencias) y en `registrar` rechaza nombres vacíos con un error.
--- código
interface Repositorio {
  // tu código aquí
}

class RepositorioEnMemoria {
  // tu código aquí
}

class Servicio {
  constructor(private repo: Repositorio) {}
  registrar(nombre: string): void {
    // tu código aquí
  }
}
--- pruebas
const repo = new RepositorioEnMemoria();
const servicio = new Servicio(repo);
servicio.registrar('Ana');
prueba('el servicio guarda por medio del repositorio', () => igual(repo.listar(), ['Ana']));
prueba('rechaza un nombre vacío', () => { let fallo = false; try { servicio.registrar('  '); } catch (e) { fallo = true; } ok(fallo, 'tenía que lanzar un error'); });
const otro: Repositorio = new RepositorioEnMemoria();
prueba('el repositorio en memoria cumple la interfaz', () => igual(otro.listar(), []));
--- solución
interface Repositorio {
  guardar(nombre: string): void;
  listar(): string[];
}

class RepositorioEnMemoria implements Repositorio {
  #datos: string[] = [];
  guardar(nombre: string): void {
    this.#datos.push(nombre);
  }
  listar(): string[] {
    return [...this.#datos];
  }
}

class Servicio {
  constructor(private repo: Repositorio) {}
  registrar(nombre: string): void {
    if (!nombre.trim()) throw new Error('El nombre no puede estar vacío');
    this.repo.guardar(nombre.trim());
  }
}
```

```practica
vf :: Autenticación es saber quién eres; autorización es saber qué puedes hacer
vf :: Refactorizar es agregar funciones nuevas a la app
elige :: ¿Qué es la inyección de dependencias? :: Instalar paquetes con npm :: Pasarle a una pieza desde afuera lo que necesita, para poder probarla y cambiar implementaciones :: Un ataque de seguridad
elige :: ¿Cuál es la definición técnica de CI? :: Un editor de código :: Un proceso automático que compila y prueba el código en cada subida, en un ambiente limpio :: Una base de datos
escribe :: Explica el patrón repositorio en las dos versiones, y dónde lo usaste. :: Con mis palabras: el encargado de guardar y leer los datos, para que el resto de la app no sepa dónde están. Técnica: una capa que abstrae el acceso a datos detrás de una interfaz, así la lógica no depende de si se guarda en memoria, en el teléfono o en Firebase. Lo usé en el San de Copiloto y en la caja de Gastos del carro.
```

## Parte 6. El glosario (3): apps e inteligencia artificial

| Término | Con tus palabras (RH) | La definición técnica (líder técnico) | Dónde |
|---|---|---|---|
| **React** | Una herramienta para armar pantallas con piezas | Una biblioteca de JavaScript para construir interfaces con componentes y un modelo declarativo | La web de Copiloto |
| **React Native** | Lo mismo, pero para apps de teléfono | Un framework que usa React para crear apps móviles con componentes nativos de iOS y Android | Copiloto Driver |
| **Expo** | Lo que facilita crear, probar y publicar la app | Un conjunto de herramientas y servicios sobre React Native para desarrollar, compilar y distribuir | Copiloto |
| **Componente** | Una pieza de pantalla que se puede reutilizar | Una función (o clase) que recibe *props* y devuelve la interfaz a dibujar | Una tarjeta de ganancia |
| **Props** | Los datos que una pieza recibe de afuera | Los parámetros de entrada de un componente, de solo lectura | `valor` y `app` de una tarjeta |
| **Estado (state)** | Lo que la pantalla recuerda y puede cambiar | Datos internos de un componente; al cambiar, React vuelve a dibujarlo | `useState` |
| **Hook** | Una función especial de React para usar estado y efectos | Funciones `use…` que conectan un componente con el estado, los efectos y el contexto de React | `useFuelActions` |
| **TypeScript** | JavaScript con tipos que avisan errores antes | Un superconjunto de JavaScript con tipado estático que se compila a JavaScript | Todo Copiloto |
| **LLM (modelo de lenguaje)** | Una inteligencia artificial que escribe texto | Un modelo entrenado con mucho texto que predice el siguiente *token* según el contexto | Gemini en el Copiloto |
| **Token** | Un pedacito de texto con el que se cuenta el uso de la IA | La unidad en que el modelo lee y genera texto; los límites y costos se miden en tokens | La cuota del Copiloto |
| **Prompt** | El pedido que le haces a la IA | La entrada de texto (instrucciones, contexto y pregunta) que recibe el modelo | Las instrucciones del sistema |
| **Alucinación** | Cuando la IA inventa algo con seguridad | Una respuesta incorrecta o inventada que el modelo presenta como verdadera | Por eso se piden fuentes |
| **Prompt injection** | Un intento de engañar a la IA con instrucciones escondidas | Un ataque que mete instrucciones en la entrada para cambiar el comportamiento del modelo | El filtro de `aiCopilot` |
| **Agente** | Una IA que puede hacer cosas, no solo responder | Un sistema donde un modelo decide acciones y usa herramientas en un ciclo hasta cumplir un objetivo | Las herramientas del Copiloto |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Estado sin cambiar el original (como en React)
lenguaje: js
pide: En React, el estado **no se cambia directamente**: se crea uno nuevo, y así React se da cuenta y vuelve a dibujar. Completa `agregarGanancia(estado, ganancia)` y `quitarGanancia(estado, id)`: los dos devuelven un estado **nuevo** (`{ ganancias, total }`), con el total recalculado, sin tocar el estado que reciben.
--- código
function agregarGanancia(estado, ganancia) {
  // tu código aquí
}

function quitarGanancia(estado, id) {
  // tu código aquí
}
--- pruebas
const inicial = { ganancias: [], total: 0 };
const uno = agregarGanancia(inicial, { id: 1, valor: 50 });
const dos = agregarGanancia(uno, { id: 2, valor: 30 });
prueba('agrega y recalcula el total', () => igual(dos, { ganancias: [{ id: 1, valor: 50 }, { id: 2, valor: 30 }], total: 80 }));
prueba('no cambia el estado anterior', () => igual(uno, { ganancias: [{ id: 1, valor: 50 }], total: 50 }));
prueba('devuelve un objeto nuevo', () => ok(uno !== inicial && uno.ganancias !== inicial.ganancias, 'tiene que ser un estado nuevo'));
prueba('quitar recalcula el total', () => igual(quitarGanancia(dos, 1), { ganancias: [{ id: 2, valor: 30 }], total: 30 }));
--- solución
function agregarGanancia(estado, ganancia) {
  const ganancias = [...estado.ganancias, ganancia];
  return { ganancias, total: ganancias.reduce((s, g) => s + g.valor, 0) };
}

function quitarGanancia(estado, id) {
  const ganancias = estado.ganancias.filter((g) => g.id !== id);
  return { ganancias, total: ganancias.reduce((s, g) => s + g.valor, 0) };
}
```

```practica
vf :: React y React Native comparten la forma de trabajar con componentes, pero React Native es para apps de teléfono
vf :: En React, para cambiar el estado se modifica el objeto directamente
elige :: ¿Cuál es la definición técnica de un LLM? :: Un buscador de internet :: Un modelo entrenado con mucho texto que predice el siguiente token según el contexto :: Una base de datos de respuestas
elige :: ¿Qué es prompt injection? :: Una forma de ahorrar tokens :: Un ataque que mete instrucciones en la entrada para cambiar el comportamiento del modelo :: Un tipo de prueba
escribe :: Explica la diferencia entre props y estado, en las dos versiones. :: Con mis palabras: las props son los datos que una pieza recibe de afuera, y el estado es lo que la pantalla recuerda y puede cambiar. Técnica: las props son los parámetros de entrada del componente, de solo lectura; el estado son datos internos que, al cambiar con su función set, hacen que React vuelva a dibujar el componente.
```

## Parte 7. El simulacro: practicar con una IA y en voz alta

Lo que no se practica en voz alta, en la entrevista se traba. Tres formas de practicar:

### 1. Con una IA que te entrevista

```text
Vas a ser el líder técnico de una entrevista para programador junior.
Hazme una pregunta a la vez sobre JavaScript, React Native y Firebase.
Después de cada respuesta mía, dime qué estuvo bien, qué faltó
(definición, ejemplo o dónde lo usé) y hazme una pregunta de seguimiento.
No me des la respuesta antes de que yo conteste.
```

Y otra vez como RH: "Ahora eres de Recursos Humanos: pregúntame sobre mí, mi proyecto y cómo trabajo en equipo".

### 2. Con el glosario, tapando una columna

Tapa la columna técnica y di la definición desde lo que dice "con tus palabras". Después al revés. Cuando te salgan las dos sin mirar, el término está listo.

### 3. Grabándote

Graba tu "cuéntame de ti" y tu recorrido de 30 segundos (clase anterior). Escúchate: ¿se entiende?, ¿dura un minuto?, ¿usaste algunos términos bien?

### Las preguntas técnicas más comunes (y por dónde empezar)

| Pregunta | Empieza por… |
|---|---|
| "¿Qué diferencia hay entre `let`, `const` y `var`?" | `const` no se reasigna, `let` sí; `var` tiene un alcance distinto y hoy se evita |
| "¿Qué es una promesa?" | Un objeto que representa un resultado que va a llegar después (o un error) |
| "¿Qué hace `===`?" | Compara valor **y** tipo, sin convertir |
| "¿Cómo protegiste los datos de los usuarios?" | Reglas de Firestore por `uid`, probadas con el emulador |
| "¿Cómo pruebas tu código?" | Pruebas unitarias con Jest o Vitest, y el CI en cada subida |
| "¿Qué harías distinto hoy?" | Algo real que mejorarías: muestra criterio, no debilidad |

> 🌎 **En la vida real:** es como ensayar un discurso frente al espejo: la primera vez te trabas, la décima te sale natural.

> 🌎 **Otro ejemplo:** Es como un piloto en el simulador: practica las emergencias antes de que pasen de verdad.

```practica
vf :: Practicar en voz alta y grabarse ayuda a que en la entrevista no te trabes
elige :: ¿Cómo conviene pedirle a una IA que te entreviste? :: Que te dé las respuestas para memorizar :: Que te haga una pregunta a la vez, te diga qué faltó y siga con otra pregunta, sin darte la respuesta antes :: Que conteste por ti
elige :: "¿Qué harías distinto hoy?" ¿Cómo conviene responder? :: "Nada, todo está perfecto" :: Con algo real que mejorarías: muestra criterio :: Cambiar de tema
escribe :: Escribe el pedido que le harías a una IA para practicar la entrevista con Recursos Humanos. :: Por ejemplo: "Eres de Recursos Humanos en una entrevista para programador junior. Pregúntame de a una sobre mí, mi proyecto, un problema difícil y cómo trabajo en equipo. Después de cada respuesta, dime si se entendió, si duró demasiado y qué término técnico podría agregar."
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo te preparaste para esta entrevista?":** "Preparé mis proyectos en dos niveles: con mis palabras, para contar qué hice y por qué, y con las definiciones técnicas, para explicar cómo funciona cada pieza. Para cada término tengo la definición, un ejemplo y dónde lo usé. Practiqué en voz alta y con una IA que me hacía de entrevistador, pidiéndole que me dijera qué me faltaba."

> 🌎 **En la vida real:** es como llegar a una prueba de manejo habiendo practicado en la calle y estudiado el manual: sabes hacerlo y sabes explicarlo.

> 🌎 **Otro ejemplo:** Es como un músico que ensaya la canción y también sabe leer la partitura: toca bien y puede explicar lo que toca.
