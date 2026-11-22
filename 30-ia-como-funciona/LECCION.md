# IA 1: cómo funciona un modelo de lenguaje

> 🌎 **En la vida real:** para manejar bien un carro no necesitas fabricar el motor, pero sí saber que tiene un tanque, que se calienta y que no frena solo. Con la IA pasa igual: no vas a construir un modelo, pero si sabes cómo funciona, la usas mucho mejor.

> 🎙️ **El profesor dice:** este es el primer tema del curso **IA para programadores**, que tiene su propio certificado. Es para quien ya entiende de programación y quiere trabajar con IA de verdad: Claude, Claude Code, Gemini, OpenCode, Codex o un modelo en tu propia computadora. Hoy: qué es un modelo, qué hace bien, qué inventa, qué son los tokens y el contexto, y qué pasa con lo que le pegas.

## Parte 1. Qué es un modelo de lenguaje

> 🌎 **En la vida real:** es como el autocompletar del teclado del celular, pero entrenado con muchísimo texto y código: tan bueno adivinando la siguiente palabra que parece que razona.

> 🌎 **Otro ejemplo:** Es como alguien que leyó millones de recetas: no tiene cocina, pero te dice paso a paso cómo hacer casi cualquier plato.

### Predecir el siguiente pedazo de texto

Un **modelo de lenguaje** (LLM, *Large Language Model*) recibe un texto y calcula cuál es el pedazo que más probablemente sigue. Repite eso muchas veces y arma una respuesta. Como aprendió de muchísimo código y explicaciones, puede escribir funciones, explicar errores y planear cambios.

> 🌎 **En la vida real:** es como completar el refrán "más vale pájaro en mano…": no lo piensas, lo completas porque lo oíste mil veces.

> 🌎 **Otro ejemplo:** Es como un músico que improvisa: no tiene la canción escrita, pero sabe qué nota suena bien después de la anterior.

### Las familias de modelos que vas a usar

| Empresa | Modelos | Dónde los usas |
|---|---|---|
| Anthropic | **Claude** (Opus, Sonnet, Haiku) | claude.ai, la app, **Claude Code** |
| Google | **Gemini** | gemini.google.com, Gemini CLI |
| OpenAI | GPT y los de código | ChatGPT, **Codex** |
| Meta | **Llama** (abiertos) | En tu computadora con **Ollama**, o en otros servicios |

Los modelos **más grandes** razonan mejor pero son más lentos y caros; los **chicos** son rápidos y baratos. Herramientas como **OpenCode** te dejan elegir entre muchos de ellos.

> 🌎 **En la vida real:** es como elegir transporte: avión para lejos y rápido, bus para barato, bicicleta para la esquina.

> 🌎 **Otro ejemplo:** Es como los médicos: el general para casi todo, el especialista para lo difícil (y cuesta más).

> 🧩 **Piezas para este ejercicio**
> - Este ejercicio usa palabras completas como piezas. Recorre el texto de dos en dos posiciones vecinas: toma la palabra actual y mira cuál viene justo después. Si hay empate, conserva el orden de aparición.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un modelo de lenguaje de juguete
lenguaje: js
pide: Un modelo predice el **siguiente pedazo** de texto. Hazlo en chiquito: `contarSiguientes(texto)` devuelve, para cada palabra (en minúsculas), cuántas veces la siguió cada otra palabra. `siguiente(conteos, palabra)` devuelve la que más veces la siguió (si empatan, la que apareció primero), o `null`. `completar(conteos, inicio, n)` agrega hasta `n` palabras, una por una.
--- código
function contarSiguientes(texto) {
  // tu código aquí
}

function siguiente(conteos, palabra) {
  // tu código aquí
}

function completar(conteos, inicio, n) {
  // tu código aquí
}
--- pruebas
const texto = 'el carro necesita aceite. el carro necesita lavado. el carro está limpio. el viaje fue largo';
const conteos = contarSiguientes(texto);
prueba('cuenta lo que sigue', () => igual(conteos.carro, { necesita: 2, 'está': 1 }));
prueba('la más probable', () => igual([siguiente(conteos, 'el'), siguiente(conteos, 'carro')], ['carro', 'necesita']));
prueba('una palabra sin nada después', () => igual(siguiente(conteos, 'largo'), null));
prueba('completar una frase', () => igual(completar(conteos, 'el', 3), 'el carro necesita aceite.'));
--- solución
function contarSiguientes(texto) {
  const palabras = texto.toLowerCase().split(/\s+/).filter(Boolean);
  const conteos = {};
  for (let i = 0; i < palabras.length - 1; i++) {
    const a = palabras[i];
    const b = palabras[i + 1];
    conteos[a] = conteos[a] || {};
    conteos[a][b] = (conteos[a][b] || 0) + 1;
  }
  return conteos;
}

function siguiente(conteos, palabra) {
  const opciones = conteos[palabra];
  if (!opciones) return null;
  let mejor = null;
  for (const [p, n] of Object.entries(opciones)) if (mejor === null || n > opciones[mejor]) mejor = p;
  return mejor;
}

function completar(conteos, inicio, n) {
  const frase = [inicio];
  for (let i = 0; i < n; i++) {
    const p = siguiente(conteos, frase[frase.length - 1]);
    if (p === null) break;
    frase.push(p);
  }
  return frase.join(' ');
}
```

```practica
vf :: Un modelo de lenguaje predice cuál pedazo de texto sigue, una y otra vez
vf :: Claude, Gemini y Llama son el mismo modelo con distinto nombre
elige :: ¿Qué familia de modelos puedes correr en tu propia computadora con Ollama? :: Claude :: Llama :: Gemini
elige :: En general, un modelo más grande… :: es más rápido y barato :: razona mejor pero es más lento y caro :: no sirve para código
escribe :: Explica con tus palabras qué hace un modelo de lenguaje. :: Recibe un texto y predice, pedazo por pedazo, qué es lo más probable que siga; como aprendió de muchísimo texto y código, eso le permite responder, explicar y escribir programas.
```

## Parte 2. Lo que hace bien y lo que inventa

> 🌎 **En la vida real:** un compañero muy rápido y muy seguro de sí mismo: casi siempre acierta, pero cuando no sabe, en vez de decir "no sé", inventa con la misma seguridad.

> 🌎 **Otro ejemplo:** Es como un GPS: te lleva bien casi siempre, pero un día te manda por una calle cerrada y lo dice con la misma voz tranquila.

### Lo que hace muy bien

Explicar código que no entiendes, escribir lo repetitivo (formularios, pruebas, estilos), encontrar la causa de un error si le das el mensaje completo, proponer un plan, traducir de un lenguaje a otro (JavaScript ↔ Python) y revisar tu código.

> 🌎 **En la vida real:** es como tener un tutor que nunca se cansa de que le preguntes "¿y esto qué significa?".

> 🌎 **Otro ejemplo:** Es como un ayudante de cocina que pica todo rápido: tú decides el plato, él adelanta el trabajo pesado.

### Las alucinaciones

Cuando el modelo **no sabe**, puede **inventar**: una función que no existe, una opción de una librería que nunca existió, una versión vieja de algo que cambió, un dato falso. A eso se le llama **alucinación**. Por eso **todo lo que te da se comprueba**: se corre, se prueba, se lee.

> 🌎 **En la vida real:** es como un turista que te da indicaciones para no quedar mal: te manda a una calle que no existe, pero muy seguro.

> 🌎 **Otro ejemplo:** Es como un estudiante que, en el examen, rellena con algo que "suena bien" en vez de dejar en blanco.

### La fecha de corte

Cada modelo aprendió con datos hasta cierta fecha. Lo que salió después (una versión nueva de React, un cambio de Firebase) puede no saberlo. Si es algo reciente, **dale la documentación** o pídele que la busque, si la herramienta tiene búsqueda.

> 🌎 **En la vida real:** es como alguien que volvió de un año de viaje sin internet: sabe todo hasta que se fue.

> 🌎 **Otro ejemplo:** Es como un mapa impreso del año pasado: sirve, pero no tiene la calle nueva.

> 🧩 **Piezas para este ejercicio**
> - Compara los nombres propuestos con la lista real de funciones. La fecha de corte da una razón para consultar la documentación, incluso si el nombre suena convincente.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Atrapar lo que la IA inventó
lenguaje: js
pide: La IA te propone usar unas funciones de una librería. Completa `inventadas(propuestas, api)`: devuelve las que **no existen** en la lista real `api` (las alucinaciones). Y `puedeNoSaberlo(corteDelModelo, salioEl)`: `true` si eso salió **después** de la fecha de corte del modelo (fechas ISO): ahí hay que darle la documentación.
--- código
function inventadas(propuestas, api) {
  // tu código aquí
}

function puedeNoSaberlo(corteDelModelo, salioEl) {
  // tu código aquí
}
--- pruebas
const api = ['getDoc', 'setDoc', 'updateDoc', 'onSnapshot', 'query', 'where'];
prueba('todo existe', () => igual(inventadas(['getDoc', 'onSnapshot'], api), []));
prueba('dos inventadas', () => igual(inventadas(['getDoc', 'getDocsWhere', 'setDoc', 'saveDocument'], api), ['getDocsWhere', 'saveDocument']));
prueba('algo nuevo, que puede no saber', () => igual(puedeNoSaberlo('2025-01-01', '2025-06-10'), true));
prueba('algo viejo, que sí conoce', () => igual(puedeNoSaberlo('2025-01-01', '2023-03-01'), false));
--- solución
function inventadas(propuestas, api) {
  return propuestas.filter((f) => !api.includes(f));
}

function puedeNoSaberlo(corteDelModelo, salioEl) {
  return salioEl > corteDelModelo;
}
```

```practica
vf :: Si el modelo responde muy seguro, la respuesta es correcta
vf :: Una alucinación es cuando el modelo inventa algo que no existe
elige :: El modelo te sugiere una función de una librería y al correrla dice "is not a function". ¿Qué pasó probablemente? :: Tu computadora está rota :: El modelo inventó la función o usó una versión vieja :: Falta reiniciar
elige :: Para algo que salió hace un mes, ¿qué conviene? :: Confiar en la memoria del modelo :: Darle la documentación o pedirle que busque :: No usar IA nunca
escribe :: Nombra tres cosas que la IA hace muy bien en programación. :: Por ejemplo: explicar código que no entiendo, escribir código repetitivo y pruebas, y encontrar la causa de un error si le doy el mensaje completo.
```

## Parte 3. Tokens y contexto

> 🌎 **En la vida real:** el contexto es la mesa de trabajo del modelo: solo puede usar lo que está encima de la mesa. Si la llenas de papeles, lo importante se pierde.

> 🌎 **Otro ejemplo:** Es como la memoria de corto plazo: recuerdas bien lo que te dijeron hace un minuto, no lo de la semana pasada.

### Qué es un token

El modelo no lee letras ni palabras: lee **tokens**, pedacitos de texto (en español, más o menos una palabra son 1 o 2 tokens). Los límites y los precios se cuentan en tokens: los que entran (tu pedido, los archivos) y los que salen (la respuesta).

> 🌎 **En la vida real:** es como el taxímetro: no cobra por viaje, cobra por cuadra recorrida.

> 🌎 **Otro ejemplo:** Es como los mensajes de texto antiguos, que cobraban por cada 160 letras.

### La ventana de contexto

La **ventana de contexto** es cuánto texto puede tener el modelo "a la vista" a la vez: la conversación, los archivos que leyó, las instrucciones. Es grande, pero no infinita. En conversaciones muy largas, la herramienta **resume** lo viejo y se pueden perder detalles. Por eso conviene empezar una conversación nueva para una tarea nueva.

> 🌎 **En la vida real:** es como una pizarra: cuando se llena, hay que borrar algo para seguir escribiendo.

> 🌎 **Otro ejemplo:** Es como una mochila: entra mucho, pero si metes todo, no encuentras lo que buscas.

### Darle el contexto correcto

Más contexto no siempre es mejor: es mejor el **correcto**. Dale el archivo que importa, el error completo, la regla del proyecto. No le pegues todo el repositorio "por si acaso".

> 🌎 **En la vida real:** al médico le llevas los exámenes de ese problema, no todos los papeles de tu vida.

> 🌎 **Otro ejemplo:** Es como pedir direcciones: "estoy en la esquina de la panadería" ayuda más que contarle tu día entero.

> 🧩 **Piezas para este ejercicio**
> - El cálculo de un token por cuatro caracteres es una aproximación de la práctica. Reserva primero espacio para el mensaje obligatorio. Selecciona los recientes y al final ordénalos como estaban en la conversación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Que la conversación quepa en la ventana
lenguaje: js
pide: Completa `tokensDe(texto)`: una estimación, un token cada 4 letras, hacia arriba (`Math.ceil`). Y `recortar(mensajes, ventana)`: el primer mensaje (las instrucciones) se queda **siempre**; después agrega los **más recientes** que todavía quepan, sin pasarse de la ventana, y devuélvelos en su orden original.
--- código
function tokensDe(texto) {
  // tu código aquí
}

function recortar(mensajes, ventana) {
  // tu código aquí
}
--- pruebas
prueba('los tokens', () => igual([tokensDe(''), tokensDe('hola'), tokensDe('hola mundo')], [0, 1, 3]));
const m = ['reglas!!', 'aaaa', 'bbbbbbbb', 'cccc', 'dddd'];
prueba('todo cabe', () => igual(recortar(m, 100), m));
prueba('las reglas y lo más reciente', () => igual(recortar(m, 5), ['reglas!!', 'cccc', 'dddd']));
prueba('si no cabe ni lo último, solo las reglas', () => igual(recortar(['reglas!!', 'x'.repeat(40)], 3), ['reglas!!']));
--- solución
function tokensDe(texto) {
  return Math.ceil(texto.length / 4);
}

function recortar(mensajes, ventana) {
  if (mensajes.length === 0) return [];
  const [reglas, ...resto] = mensajes;
  let usados = tokensDe(reglas);
  const elegidos = [];
  for (let i = resto.length - 1; i >= 0; i--) {
    const t = tokensDe(resto[i]);
    if (usados + t > ventana) break;
    usados += t;
    elegidos.unshift(resto[i]);
  }
  return [reglas, ...elegidos];
}
```

```practica
vf :: Los modelos leen el texto en tokens, no letra por letra
vf :: Una conversación puede crecer para siempre sin perder nada
elige :: Para una tarea nueva y distinta, ¿qué conviene? :: Seguir en la misma conversación larguísima :: Empezar una conversación nueva :: Pegar todo el repositorio
elige :: ¿Qué contexto es mejor para arreglar un error? :: Todo el proyecto :: El mensaje de error completo y el archivo donde pasa :: Solo la palabra "error"
escribe :: ¿Qué es la ventana de contexto y por qué importa? :: Es cuánto texto puede tener el modelo a la vista a la vez; importa porque si se llena, lo viejo se resume y se pierden detalles, y porque lo que no está ahí, el modelo no lo sabe.
```

## Parte 4. Planes, límites y privacidad

> 🌎 **En la vida real:** el plan gratis de un gimnasio te deja entrar unas horas; el de pago, todo el día. Y lo que dejas en el casillero, conviene que no sea tu pasaporte.

> 🌎 **Otro ejemplo:** Es como el plan de datos del celular: gratis tiene un tope; cuando se acaba, esperas o pagas.

### Gratis y de pago

Casi todas las herramientas tienen un **plan gratis** con límites (cuántos mensajes por hora o por día, qué modelos) y planes de **pago** con más uso y modelos mejores. Por eso conviene tener varias: si se te acaba una, sigues con otra. Tu combinación (Claude como principal, OpenCode con plan gratis para código, Gemini para preparar pedidos) es justamente eso. Los precios y límites cambian seguido: revísalos en la página de cada una.

> 🌎 **En la vida real:** es como tener tarjeta de dos bancos: si uno se cae, pagas con el otro.

> 🌎 **Otro ejemplo:** Es como tener bicicleta y pase de bus: no dependes de una sola cosa.

### Lo que pegas, ¿a dónde va?

Lo que escribes o subes viaja a los servidores de la empresa. Cada una tiene sus reglas sobre si lo guarda o lo usa para entrenar (y muchas se pueden configurar). Regla simple: **nunca** pegues contraseñas, claves, tokens, archivos `.env`, ni datos personales de otras personas (nombres, teléfonos, CPF de tus usuarios). Si necesitas mostrar un dato, cámbialo por uno inventado.

> 🌎 **En la vida real:** es como hablar en un taxi: el chofer probablemente no repite nada, pero no le dictarías la clave del banco.

> 🌎 **Otro ejemplo:** Es como mandar una foto de un documento por WhatsApp: una vez enviada, ya no controlas dónde queda.

### Modelos locales: nada sale de tu computadora

Con **Ollama** puedes descargar un modelo abierto como **Llama** y correrlo en tu Mac: no necesita internet y nada sale de tu computadora. A cambio, los modelos que caben en una laptop son más chicos y menos capaces que los grandes en la nube, y usan bastante memoria.

```bash
ollama run llama3.2      # descarga el modelo la primera vez y abre un chat en la terminal
```

> 🌎 **En la vida real:** es como cocinar en casa en vez de pedir delivery: más privado y sin depender de nadie, pero tu cocina es más chica que la del restaurante.

> 🌎 **Otro ejemplo:** Es como una enciclopedia en papel: no necesita internet, pero no tiene todo lo último.

> 🧩 **Piezas para este ejercicio**
> - Sustituye lo que reconoce cada patrón y verifica a mano el resultado antes de compartirlo. El filtro de ejemplo cubre esos formatos. Otros datos personales pueden aparecer dentro del mismo texto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Limpiar el texto antes de pegarlo
lenguaje: js
pide: Antes de pegarle un registro o una configuración a una IA, se quita lo privado. Completa `limpiar(texto)`: cambia los correos por `[correo]`, las claves que empiezan con `sk_` (y siguen letras, números o `_`) por `[clave]`, y lo que va después de `password=` o `password:` (hasta el espacio) por `[oculto]`.
--- código
function limpiar(texto) {
  // tu código aquí
}
--- pruebas
prueba('un correo', () => igual(limpiar('falló el login de ana.prueba@gmail.com'), 'falló el login de [correo]'));
prueba('una clave', () => igual(limpiar('STRIPE=sk_live_51Hx9abc end'), 'STRIPE=[clave] end'));
prueba('una contraseña', () => igual(limpiar('DB password=s3gura! host=local'), 'DB password=[oculto] host=local'));
prueba('lo demás queda igual', () => igual(limpiar('TypeError: x is undefined at app.js:12'), 'TypeError: x is undefined at app.js:12'));
--- solución
function limpiar(texto) {
  return texto
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[correo]')
    .replace(/sk_\w+/g, '[clave]')
    .replace(/(password\s*[=:]\s*)\S+/gi, '$1[oculto]');
}
```

```practica
vf :: Es buena idea pegar el archivo .env en el chat para que la IA entienda la configuración
vf :: Con Ollama, el modelo corre en tu computadora y lo que escribes no sale de ella
elige :: ¿Por qué conviene usar varias herramientas de IA? :: Porque es más difícil :: Porque si se acaba el límite gratis de una, sigues con otra :: Porque son iguales
elige :: Necesitas mostrarle a la IA un error con datos de un usuario real. ¿Qué haces? :: Lo pegas tal cual :: Cambias los datos personales por inventados antes de pegarlo :: No le muestras nada
escribe :: ¿Qué cosas nunca pegarías en un chat de IA? :: Contraseñas, claves de API o de servicio, tokens, el archivo .env y datos personales de otras personas como nombres, teléfonos o documentos.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo usas la IA en tu trabajo?":** "La uso como un compañero muy rápido, no como un oráculo. Sé que predice texto y que puede inventar, así que todo lo que me da lo pruebo y lo reviso. Le doy el contexto justo (el archivo, el error completo, las reglas del proyecto), empiezo conversaciones nuevas por tarea, y nunca le paso secretos ni datos de usuarios. Combino varias: Claude como principal, otras para código o para preparar pedidos, y un modelo local cuando necesito privacidad."

> 🌎 **En la vida real:** es como explicar cómo usas una herramienta eléctrica: para qué sirve, cuándo no y cómo te proteges.

> 🌎 **Otro ejemplo:** Es como un chef que explica que usa la licuadora, pero prueba la sopa antes de servirla.
