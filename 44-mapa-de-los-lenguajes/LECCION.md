# El mapa de los lenguajes

> 🌎 **En la vida real:** en una obra hay albañiles, electricistas, plomeros y pintores. Cada uno con sus herramientas, pero todos construyen la misma casa. En programación pasa igual: JavaScript, TypeScript, React, React Native, Node.js, Kotlin… no compiten, cada uno hace su parte.

> 🎙️ **El profesor dice:** antes de empezar el camino, necesitas el mapa de los nombres que vas a escuchar todo el tiempo. Al terminar esta clase vas a poder explicar, con Copiloto y los otros proyectos del curso como ejemplo, qué es **JavaScript**, qué agrega **TypeScript**, para qué sirve **Node.js**, qué es **React**, qué es **React Native** y **Expo**, y dónde entran **Kotlin** y **Swift**.

## Parte 1. Lenguaje, librería, framework y plataforma

> 🌎 **En la vida real:** el idioma es el español; un diccionario te ayuda a escribir; un modelo de carta te da la estructura; y el correo es donde la mandas. Son cosas distintas que trabajan juntas.

> 🌎 **Otro ejemplo:** Es como la cocina: el idioma de la receta, los utensilios, una receta base y la cocina donde cocinas.

### Las cuatro palabras

- **Lenguaje:** la forma de escribir instrucciones. JavaScript, TypeScript, Python, Kotlin, Swift.
- **Librería:** código hecho por otros que llamas cuando lo necesitas. React es una librería.
- **Framework:** una estructura que te dice cómo armar la app y llama a tu código. Expo y Next.js son frameworks.
- **Plataforma (o entorno):** el lugar donde el código corre: el **navegador**, **Node.js** (el servidor o tu computadora), un **iPhone**, un **Android**.

> 🌎 **En la vida real:** tú llamas al electricista cuando lo necesitas (librería); en una franquicia, la franquicia te dice cómo trabajar (framework).

> 🌎 **Otro ejemplo:** Es como un auto: el motor (lenguaje), el GPS que usas cuando quieres (librería), el manual de la empresa de transporte (framework) y la carretera (plataforma).

### ¿Quién llama a quién? Librería y framework en código

> 🎙️ **El profesor dice:** la diferencia entre librería y framework se entiende de verdad cuando la ves en código. Y es una de las preguntas más comunes en una entrevista. La clave es una sola pregunta: **¿quién llama a quién?**

**Con una librería, mandas tú.** Traes la herramienta y **tú decides** cuándo usarla. Este mismo mapa de estudios usa la librería **marked**, que convierte el texto Markdown de las clases en una página:

```js
// Tú llamas a la librería, cuando tú quieres:
const html = marked.parse('# Clase 01');   // → '<h1>Clase 01</h1>'
```

Si mañana no quieres usarla, la sacas y nada más cambia: tu código sigue siendo tuyo.

**Con un framework, manda él.** Tú escribes las piezas y **el framework decide cuándo llamarlas**. Lo vas a ver en el curso de Node.js con **Express**, un framework para servidores:

```js
const app = express();

// Tú escribes la función, pero NO la llamas tú:
app.get('/gastos', (pedido, respuesta) => {
  respuesta.json(gastos);
});

app.listen(3000);
// Desde aquí, Express espera pedidos y LLAMA a tu función
// cada vez que alguien pide /gastos.
```

Fíjate: en ninguna parte escribiste "ejecuta la función de `/gastos`". Eso lo hace Express, cada vez que llega un pedido. Esa idea tiene nombre: **inversión de control**. El control del programa pasa de ti al framework. También se le dice el **principio de Hollywood**: *"no nos llames, nosotros te llamamos"*.

| | Librería | Framework |
|---|---|---|
| ¿Quién manda? | Tú | El framework |
| ¿Qué escribes tú? | El programa entero, y llamas a la librería cuando la necesitas | Las piezas que el framework te pide (rutas, pantallas, componentes) |
| ¿Cambiarla es fácil? | Sí, suele estar en pocos lugares | No: tu app está armada con su forma |
| Ejemplos | marked, highlight.js, date-fns, el SDK de Firebase | Express, Next.js, Expo, Angular |

**¿Y React?** Se presenta como librería, porque tú decides cómo armar tu app y la llamas para dibujar la pantalla. Pero en la práctica casi siempre se usa dentro de un framework, como Next.js en la web o Expo en el celular, que te dicen dónde va cada archivo y llaman a tus componentes.

**Este mapa no usa ningún framework**, solo dos librerías: marked, para el Markdown, y highlight.js, para colorear el código. Por eso todo el control está en `web/app.js`, que decide qué pantalla mostrar.

> 🌎 **En la vida real:** una librería es como un taladro: lo sacas de la caja cuando necesitas hacer un agujero, y tú decides dónde y cuándo. Un framework es como trabajar en una línea de montaje: tú pones tu pieza, pero la cinta decide cuándo te llega cada carro.

> 🌎 **Otro ejemplo:** cuando trabajas con tu propio carro, tú decides a qué hora sales y qué viaje tomas: eso es usar una librería. En una app de transporte, la app te manda el viaje y tú respondes cuando te llama: eso es un framework.

> 🎤 **Para la entrevista:** "Una librería la llamo yo cuando la necesito, por ejemplo date-fns para formatear una fecha. Un framework me da la estructura y llama a mi código: en Express escribo la función de una ruta y Express la ejecuta cuando llega el pedido. Eso se llama inversión de control."

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Lenguaje, librería, framework o plataforma?
lenguaje: js
pide: Completa el objeto `QUE_ES` con `'lenguaje'`, `'librería'`, `'framework'` o `'plataforma'` para cada cosa: JavaScript, TypeScript, Kotlin, Swift (lenguajes); marked, date-fns, highlight.js (librerías); React Native, Expo, Express (frameworks); Node.js, Android (plataformas).
--- código
const QUE_ES = {
  JavaScript: '',
  Kotlin: '',
  marked: '',
  'date-fns': '',
  Expo: '',
  Express: '',
  'Node.js': '',
  Android: '',
};
--- pruebas
const bien = { JavaScript: 'lenguaje', Kotlin: 'lenguaje', marked: 'librería', 'date-fns': 'librería', Expo: 'framework', Express: 'framework', 'Node.js': 'plataforma', Android: 'plataforma' };
for (const [k, v] of Object.entries(bien)) prueba(k, () => igual(QUE_ES[k], v));
--- solución
const QUE_ES = {
  JavaScript: 'lenguaje',
  Kotlin: 'lenguaje',
  marked: 'librería',
  'date-fns': 'librería',
  Expo: 'framework',
  Express: 'framework',
  'Node.js': 'plataforma',
  Android: 'plataforma',
};
```

```practica
vf :: React es un lenguaje de programación
vf :: Node.js es un lugar donde corre JavaScript fuera del navegador
elige :: ¿Cuál de estos es un lenguaje? :: React :: Kotlin :: Expo
elige :: ¿Qué diferencia una librería de un framework? :: Ninguna :: A la librería la llamas tú; el framework te da la estructura y llama a tu código :: El framework es más chico
escribe :: Explica con un ejemplo la diferencia entre lenguaje y plataforma. :: El lenguaje es cómo escribo (por ejemplo JavaScript); la plataforma es dónde corre ese código (el navegador, Node.js en una computadora o un teléfono).
```

```practica
vf :: Con una librería, eres tú quien decide cuándo llamar a su código
vf :: En Express, tú llamas a la función de la ruta /gastos cuando llega un pedido
elige :: En app.get('/gastos', (pedido, respuesta) => …), ¿quién ejecuta la función? :: Tú, en la línea siguiente :: Express, cada vez que llega un pedido a /gastos :: El navegador, al abrir la página
elige :: Este mapa usa marked para convertir el Markdown en página. ¿Qué es marked? :: Un framework :: Una librería :: Un lenguaje
elige :: ¿Cómo se llama la idea de que el framework llama a tu código? :: Programación orientada a objetos :: Inversión de control :: Recursividad
elige :: ¿Cuál de estos es un framework? :: date-fns :: highlight.js :: Expo
escribe :: Explica con un ejemplo tuyo la diferencia entre una librería y un framework. :: Una librería la llamo yo cuando la necesito, como marked para convertir Markdown; un framework me da la estructura y llama a mi código, como Express, que ejecuta la función de una ruta cuando llega un pedido. Es la inversión de control.
```

## Parte 2. JavaScript y TypeScript

> 🌎 **En la vida real:** TypeScript es JavaScript con "etiquetas" en cada caja: "aquí va un número", "aquí un texto". Las cajas son las mismas; las etiquetas evitan que pongas algo en el lugar equivocado.

> 🌎 **Otro ejemplo:** Es como un formulario con campos marcados: "fecha (dd/mm/aaaa)". Evita errores antes de enviarlo.

### JavaScript: el idioma de la web

**JavaScript** es el único lenguaje que el navegador entiende directamente. Con él la página responde a toques, cambia textos y pide datos. Gracias a **Node.js** también corre fuera del navegador, por ejemplo en servidores y herramientas. Este mapa de estudios está hecho en **HTML + CSS + JavaScript**.

> 🌎 **En la vida real:** es como el español en tu barrio: todos lo hablan, sin traductor.

> 🌎 **Otro ejemplo:** Es como la moneda local: en ese país todos la aceptan.

### TypeScript: JavaScript con tipos

**TypeScript** es JavaScript más **tipos**: le dices qué clase de dato va en cada lugar. Antes de correr, una herramienta lo **revisa** y lo **convierte en JavaScript** (el navegador y el teléfono solo ejecutan JavaScript). Si escribiste algo mal, te avisa **antes** de que lo vea un usuario.

```ts
function gananciaNeta(bruto: number, gastos: number): number {
  return bruto - gastos;
}
gananciaNeta('300', 80);   // ❌ TypeScript avisa: '300' es texto, no número
```

**Copiloto Driver** y su web están en **TypeScript**.

> 🌎 **En la vida real:** es como el corrector de un formulario online que te marca el campo en rojo antes de enviarlo.

> 🌎 **Otro ejemplo:** Es como la etiqueta "frágil" en una caja: no cambia la caja, pero evita que la traten mal.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que TypeScript te avisa
lenguaje: ts
pide: TypeScript revisa los tipos **antes** de correr. Este código tiene dos errores: un `string` donde va un `number`, y una propiedad que no existe. Arréglalos.
--- código
interface Viaje {
  app: string;
  valor: number;
}

function total(viajes: Viaje[]): number {
  return viajes.reduce((s, v) => s + v.valor, 0);
}

const hoy: Viaje[] = [{ app: 'Uber', valor: '12' }, { app: '99', valr: 18 }];
const suma = total(hoy);
--- pruebas
prueba('la suma', () => igual(total([{ app: 'Uber', valor: 12 }, { app: '99', valor: 18 }]), 30));
prueba('hoy suma 30', () => igual(suma, 30));
--- solución
interface Viaje {
  app: string;
  valor: number;
}

function total(viajes: Viaje[]): number {
  return viajes.reduce((s, v) => s + v.valor, 0);
}

const hoy: Viaje[] = [{ app: 'Uber', valor: 12 }, { app: '99', valor: 18 }];
const suma = total(hoy);
```

```practica
vf :: El navegador ejecuta TypeScript directamente, sin convertirlo
vf :: TypeScript avisa de muchos errores antes de que el programa corra
elige :: ¿En qué está hecho Copiloto Driver? :: Python :: TypeScript :: Kotlin
elige :: ¿Qué agrega TypeScript a JavaScript? :: Colores :: Tipos que se revisan antes de correr :: Velocidad en el teléfono
escribe :: Explica la diferencia entre JavaScript y TypeScript en una frase. :: TypeScript es JavaScript con tipos: se revisa antes de correr para encontrar errores y después se convierte en JavaScript, que es lo que realmente ejecutan el navegador o el teléfono.
```

## Parte 3. React, React Native y Expo

> 🌎 **En la vida real:** React es una forma de construir con bloques de Lego (componentes). React Native usa la misma forma de construir, pero los bloques son piezas del teléfono en vez de piezas de una página web.

> 🌎 **Otro ejemplo:** Es como un chef que cocina igual en un restaurante y en un food truck: mismas recetas, distinta cocina.

### React: pantallas hechas de componentes

**React** es una librería de JavaScript (casi siempre con TypeScript) para armar pantallas con **componentes**: pedazos reutilizables como `<BotonGuardar />` o `<TarjetaDeGasto />`. Cuando cambian los datos, React actualiza la pantalla solo. La **web de Copiloto** está hecha con React.

> 🌎 **En la vida real:** es como armar una casa con módulos prefabricados: una ventana se usa en muchos cuartos.

> 🌎 **Otro ejemplo:** Es como los imanes de una nevera: armas mensajes distintos con las mismas letras.

### React Native: React para el teléfono

**React Native** usa React (y TypeScript) para hacer **apps de teléfono**. En vez de `<div>` y `<p>` de la web, usa `<View>` y `<Text>`, que se convierten en piezas **nativas** de iPhone y Android. Con **un solo código** tienes las dos apps. **Copiloto Driver** es React Native.

> 🌎 **En la vida real:** es como un libro traducido al mismo tiempo al portugués y al inglés desde un solo original.

> 🌎 **Otro ejemplo:** Es como un enchufe universal que sirve en Brasil y en Estados Unidos.

### Expo: la caja de herramientas de React Native

**Expo** es un framework y un conjunto de herramientas para React Native: correr la app en tu teléfono con **Expo Go**, acceder a la cámara o el GPS, y **compilar y publicar** las apps (EAS). Copiloto usa Expo.

> 🌎 **En la vida real:** es como un kit de cocina con todo listo: ollas, cuchillos y el horno ya instalado.

> 🌎 **Otro ejemplo:** Es como un servicio de mudanza completo: no solo el camión, también las cajas y quien las sube.

### Los tres juntos: una sola frase

Cuando lees que Copiloto está hecho "en TypeScript, con React Native y Expo", parece que fueran tres lenguajes peleando entre sí. **No lo son.** Son tres cosas de distinto tipo que trabajan juntas, y cada una hace un trabajo diferente:

| Nombre | Qué es |
|---|---|
| **TypeScript** | El **lenguaje**: en lo que escribes las órdenes |
| **React Native** | Las **piezas listas** para armar pantallas en Android y iPhone |
| **Expo** | El **taller**: probar en el teléfono, compilar y publicar |

Tres ejemplos de lo mismo, en el mismo orden (TypeScript → React Native → Expo):

- **Una mesa de madera:** el idioma en que anotas las medidas → las patas, tablas y tornillos ya cortados de la ferretería → el taller con la sierra y el camión de entrega.
- **Un carro:** el idioma del manual → el chasis y el motor ya armados → el taller con sus herramientas.
- **Un restaurante:** el idioma de las recetas → las mesas y sillas compradas hechas → la cocina organizada donde preparas todo antes de abrir.

Por eso todo cabe en una sola frase: **"Escribí las órdenes en TypeScript, con las piezas de React Native, dentro del taller de Expo."** No es hablar tres idiomas a la vez: es un idioma, unas piezas y un taller.

> 🌎 **En la vida real:** decir "mi restaurante está hecho en español, con mesas prefabricadas y en una carpa" no son tres cosas que compiten: es el idioma, el mobiliario y el lugar.

> 🌎 **Otro ejemplo:** Es como decir que una carta está escrita en español, con un modelo de carta y enviada por correo: una sola carta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: De la web a React Native
lenguaje: js
pide: React Native no usa `div` ni `p`: usa sus propias piezas. Completa `aReactNative(etiqueta)`: `div` → `'View'`; `p`, `span`, `h1`, `h2` → `'Text'`; `img` → `'Image'`; `button` → `'Pressable'`; `input` → `'TextInput'`; otra → `null`.
--- código
function aReactNative(etiqueta) {
  // tu código aquí
}
--- pruebas
prueba('div', () => igual(aReactNative('div'), 'View'));
prueba('textos', () => igual(['p', 'span', 'h1'].map(aReactNative), ['Text', 'Text', 'Text']));
prueba('img', () => igual(aReactNative('img'), 'Image'));
prueba('button', () => igual(aReactNative('button'), 'Pressable'));
prueba('input', () => igual(aReactNative('input'), 'TextInput'));
--- solución
const EQUIVALE = { div: 'View', p: 'Text', span: 'Text', h1: 'Text', h2: 'Text', img: 'Image', button: 'Pressable', input: 'TextInput' };

function aReactNative(etiqueta) {
  return EQUIVALE[etiqueta] ?? null;
}
```

```practica
vf :: React Native usa div y p igual que la web
vf :: Con React Native, un solo código sirve para iPhone y Android
elige :: ¿Qué es Expo? :: Un lenguaje :: Un framework y herramientas para correr, compilar y publicar apps de React Native :: Una base de datos
elige :: ¿Qué es un componente en React? :: Un archivo de imagen :: Un pedazo reutilizable de pantalla, como un botón o una tarjeta :: Un servidor
escribe :: Explica con los proyectos del curso la diferencia entre React y React Native. :: React arma pantallas web con componentes (como la web de Copiloto); React Native usa la misma forma de trabajar para hacer apps de teléfono con piezas nativas (como la app Copiloto Driver), con un solo código para iPhone y Android.
```

## Parte 4. Kotlin, Swift y cómo encaja todo

> 🌎 **En la vida real:** Kotlin y Swift son los idiomas "de la casa" de Android y del iPhone. React Native es un traductor que te deja hablar con los dos desde un solo idioma.

> 🌎 **Otro ejemplo:** Es como vivir en Brasil hablando portugués (nativo) o trabajar con un intérprete muy bueno (React Native).

### Kotlin y Swift: lo nativo

- **Kotlin:** el lenguaje oficial para apps **Android** (con Jetpack Compose para las pantallas). Corre en la máquina virtual de Java.
- **Swift:** el lenguaje de Apple para apps de **iPhone** (con SwiftUI).

Una app nativa se escribe dos veces (una en Kotlin, otra en Swift), pero tiene acceso directo a todo el teléfono. React Native escribe una vez y, cuando hace falta algo muy especial, se puede agregar una pieza nativa en Kotlin o Swift.

> 🌎 **En la vida real:** es como hacer dos trajes a medida (uno por persona) frente a una talla que le queda bien a los dos.

> 🌎 **Otro ejemplo:** Es como cocinar dos menús distintos para dos restaurantes o un menú que sirve en los dos.

### Kotlin y Swift dentro de Copiloto

Copiloto hace algo muy especial: mientras manejas con Uber o 99, **lee la oferta del viaje en la pantalla** en tiempo real y **dibuja una burbuja con la evaluación encima de la otra app**. Para eso hace falta pedirle a Android permisos profundos: leer lo que muestran otras apps y dibujar sobre ellas. TypeScript, con React Native, **no puede hacer eso por sí solo**.

Por eso Copiloto tiene un **módulo nativo**, `modules/ride-overlay`:

- **En Android, en Kotlin** (unos 20 archivos): `RideReaderService.kt` y `ScreenOcr.kt` leen la pantalla, `OfferParser.kt` entiende la oferta y `RideBubbleWindow.kt` dibuja la burbuja.
- **En iPhone, en Swift**: lo mismo, con las reglas de Apple (`OfferParser.swift`, `ScreenCapture.swift`…).

Es la "pieza nativa especial" de la que habla la sección anterior: **todo lo demás de la app es TypeScript**.

> 🌎 **En la vida real:** la app en TypeScript es un piloto de Fórmula 1 dentro de su carro: maneja el volante, mira el mapa y decide. Pero no puede meter las manos al motor a través de la carrocería. Para eso está el mecánico (Kotlin o Swift), que vive pegado al motor del teléfono.

> 🌎 **Otro ejemplo:** Es como el cocinero de un restaurante con servicio a domicilio: maneja el menú y las cuentas, pero no sale a la calle a revisar el motor de la moto. Para eso se contrata a un mecánico que sabe de motores.

### ¿Cómo se hablan? El puente

Los lenguajes **no se mezclan dentro del mismo archivo**. Cada uno vive en su pieza, y se hablan por un **puente**: `RideOverlayModule.kt` le ofrece funciones a la parte en TypeScript, y la app las llama como si fueran funciones normales. El módulo hace su trabajo escondido en el teléfono y le pasa la información limpia al resto de la app.

> 🌎 **En la vida real:** un cocinero que solo habla español (TypeScript) y un proveedor que solo habla alemán (Kotlin) no se entienden en la misma mesa. Usan un traductor en la puerta: "dile que traiga tomates", y el traductor vuelve con los tomates.

> 🌎 **Otro ejemplo:** Es como dos oficinas que hablan idiomas distintos y se mandan papeles por una ventanilla con un traductor: cada una trabaja en su idioma.

### ¿Y el asistente de IA? También es TypeScript

El asistente de Copiloto, el que responde preguntas y registra gastos, **no está en Python ni en Kotlin: está en TypeScript**, en dos partes:

- **En la app** (`src/ai-engine/`): arma el contexto con tus datos.
- **En el servidor** (`functions/src/aiTools.ts`, `aiToolsEarnings.ts`, `aiToolsFuel.ts`…): llama a **Gemini**, la IA de Google, y valida los datos antes de guardarlos.

El Python que quizás tengas en la cabeza es de **otro proyecto**: el Agente de IA Consular & DETRAN.

> 🌎 **En la vida real:** es el administrador del restaurante: recibe lo que pide el cliente, lo empaqueta bonito y lo manda a un especialista de afuera (Gemini) para que responda.

> 🌎 **Otro ejemplo:** Es como la caja registradora: cobra, te dice cuánto gastaste y te da un consejo, y funciona con el mismo sistema que el resto del local.

### Los proyectos del curso en el mapa

**Copiloto, parte por parte:**

| Parte | Lenguaje |
|---|---|
| La app: pantallas y lógica (`src/`) | TypeScript, con React Native y Expo |
| El servidor y el asistente de IA (`functions/`) | TypeScript, en Firebase Cloud Functions |
| El panel web de administración (`webapp/`) | TypeScript, con React |
| El lector de ofertas y la burbuja, en Android | Kotlin |
| El mismo lector, en iPhone | Swift |

**Más del 95 % del código de Copiloto es TypeScript.**

**Todos los proyectos del curso:**

| Proyecto | Hecho con |
|---|---|
| **Copiloto Driver** (la app) | React Native + TypeScript + Expo + Firebase, más un módulo nativo en Kotlin y Swift |
| **La web de Copiloto** | React + TypeScript + Vite + Tailwind + Firebase |
| **Este mapa de estudios** | HTML + CSS + JavaScript + Firebase |
| **Estudios Bíblicos** | HTML + CSS + JavaScript |
| **El Agente de IA Consular & DETRAN** | Python + FastAPI |
| **El CRUD de la clase 09** | JavaScript con Node.js |
| **El resumen de la semana (Python 8)** | Python |

Por eso el orden de los cursos de este mapa es: **JavaScript + TypeScript** → **React Native** → **Kotlin** (si quieres Android nativo). Python va aparte, para datos, automatización e IA.

> 🌎 **En la vida real:** es como el plano de una ciudad con las líneas de metro de distintos colores: ves por dónde pasa cada una y dónde se cruzan.

> 🌎 **Otro ejemplo:** Es como el árbol genealógico de una familia: ves quién viene de quién.

### La prueba de fuego

Si mañana quisieras agregar a Copiloto una pantalla nueva de **"Historial de viajes"**, ¿en qué lenguaje la escribirías y por qué? Piénsalo antes de abrir la respuesta.

<details>
<summary>Respuesta</summary>

En **TypeScript**, con las piezas de React Native, dentro de Expo. Es una pantalla normal: una lista de viajes, textos y botones. No necesita meterse con los permisos profundos del teléfono, así que no hace falta tocar al "mecánico" (Kotlin o Swift). Solo usarías Kotlin o Swift para algo que el teléfono no deja hacer desde TypeScript, como leer la pantalla de otra app o dibujar encima de ella.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Con qué hago esta app?
lenguaje: js
pide: Completa `recomendar(pedido)`: si necesita **iPhone y Android con un solo código** → `'React Native con Expo'`; si es **solo Android** → `'Kotlin'`; si es **solo iPhone** → `'Swift'`; si es **una página** → `'HTML, CSS y JavaScript'`.
--- código
function recomendar(pedido) {
  // pedido = { iphone, android, pagina }
  // tu código aquí
}
--- pruebas
prueba('las dos tiendas', () => igual(recomendar({ iphone: true, android: true }), 'React Native con Expo'));
prueba('solo Android', () => igual(recomendar({ iphone: false, android: true }), 'Kotlin'));
prueba('solo iPhone', () => igual(recomendar({ iphone: true, android: false }), 'Swift'));
prueba('una página', () => igual(recomendar({ pagina: true }), 'HTML, CSS y JavaScript'));
--- solución
function recomendar(pedido) {
  if (pedido.pagina) return 'HTML, CSS y JavaScript';
  if (pedido.iphone && pedido.android) return 'React Native con Expo';
  if (pedido.android) return 'Kotlin';
  if (pedido.iphone) return 'Swift';
  return null;
}
```

```practica
vf :: Kotlin es el lenguaje oficial para apps Android
vf :: Para tener una app en iPhone y Android con Kotlin y Swift basta con un solo código
elige :: ¿Con qué está hecho este mapa de estudios? :: React Native :: HTML, CSS y JavaScript (con Firebase) :: Kotlin
elige :: ¿Qué orden de cursos propone el mapa para hacer apps? :: Kotlin, después JavaScript :: JavaScript + TypeScript, después React Native, después Kotlin :: Solo Python
escribe :: Un amigo te pregunta qué usa Copiloto y por qué no Kotlin. ¿Qué le dices? :: Usa React Native con TypeScript y Expo, que con un solo código da la app para iPhone y Android; Kotlin es el lenguaje nativo de Android y lo usaría para algo solo de Android o para una pieza nativa especial.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cuál es la diferencia entre JavaScript, TypeScript, React y React Native?":** "JavaScript es el lenguaje que corre en el navegador y, con Node.js, fuera de él. TypeScript es JavaScript con tipos que se revisan antes de correr y se convierte en JavaScript. React es una librería para armar pantallas web con componentes. React Native usa React y TypeScript para hacer apps nativas de iPhone y Android con un solo código, y Expo es el framework que uso para correrla y publicarla. Kotlin y Swift son los lenguajes nativos de Android y iPhone."

> 🎤 **Si te preguntan "¿en qué está hecho Copiloto?":** "Está hecho en TypeScript con React Native y Expo: un solo código para Android y iPhone. Donde necesité funciones nativas, como leer la oferta del viaje en la pantalla y dibujar una burbuja encima de otras apps, escribí un módulo nativo en Kotlin para Android y en Swift para iPhone, que se comunica con TypeScript por un puente. El servidor y el asistente de IA también son TypeScript, en Firebase Cloud Functions, y usan Gemini."

> 🌎 **En la vida real:** es como explicar los roles de un equipo de obra: quién hace qué y cómo se juntan.

> 🌎 **Otro ejemplo:** Es como un mapa de metro bien explicado: cada línea, su color y sus conexiones.
