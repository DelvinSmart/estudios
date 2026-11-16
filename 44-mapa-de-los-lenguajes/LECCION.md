# El mapa de los lenguajes

> 🌎 **En la vida real:** en una obra hay albañiles, electricistas, plomeros y pintores. Cada uno con sus herramientas, pero todos construyen la misma casa. En programación pasa igual: JavaScript, TypeScript, React, React Native, Node.js, Kotlin… no compiten, cada uno hace su parte.

> 🎙️ **El profesor dice:** antes de empezar el camino, necesitas el mapa de los nombres que vas a escuchar todo el tiempo. Al terminar esta clase vas a poder explicar, con tus apps como ejemplo, qué es **JavaScript**, qué agrega **TypeScript**, para qué sirve **Node.js**, qué es **React**, qué es **React Native** y **Expo**, y dónde entran **Kotlin** y **Swift**.

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

```practica
vf :: React es un lenguaje de programación
vf :: Node.js es un lugar donde corre JavaScript fuera del navegador
elige :: ¿Cuál de estos es un lenguaje? :: React :: Kotlin :: Expo
elige :: ¿Qué diferencia una librería de un framework? :: Ninguna :: A la librería la llamas tú; el framework te da la estructura y llama a tu código :: El framework es más chico
escribe :: Explica con un ejemplo la diferencia entre lenguaje y plataforma. :: El lenguaje es cómo escribo (por ejemplo JavaScript); la plataforma es dónde corre ese código (el navegador, Node.js en una computadora o un teléfono).
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

```practica
vf :: React Native usa div y p igual que la web
vf :: Con React Native, un solo código sirve para iPhone y Android
elige :: ¿Qué es Expo? :: Un lenguaje :: Un framework y herramientas para correr, compilar y publicar apps de React Native :: Una base de datos
elige :: ¿Qué es un componente en React? :: Un archivo de imagen :: Un pedazo reutilizable de pantalla, como un botón o una tarjeta :: Un servidor
escribe :: Explica con tus apps la diferencia entre React y React Native. :: React arma pantallas web con componentes (como la web de Copiloto); React Native usa la misma forma de trabajar para hacer apps de teléfono con piezas nativas (como la app Copiloto Driver), con un solo código para iPhone y Android.
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

### Tus proyectos en el mapa

| Proyecto | Hecho con |
|---|---|
| **Copiloto Driver** (la app) | React Native + TypeScript + Expo + Firebase |
| **La web de Copiloto** | React + TypeScript + Vite + Tailwind + Firebase |
| **Este mapa de estudios** | HTML + CSS + JavaScript + Firebase |
| **Estudios Bíblicos** | HTML + CSS + JavaScript |
| **El CRUD de la clase 09** | JavaScript con Node.js |
| **El resumen de la semana (Python 8)** | Python |

Por eso el orden de los cursos de este mapa es: **JavaScript + TypeScript** → **React Native** → **Kotlin** (si quieres Android nativo). Python va aparte, para datos, automatización e IA.

> 🌎 **En la vida real:** es como el plano de una ciudad con las líneas de metro de distintos colores: ves por dónde pasa cada una y dónde se cruzan.

> 🌎 **Otro ejemplo:** Es como el árbol genealógico de una familia: ves quién viene de quién.

```practica
vf :: Kotlin es el lenguaje oficial para apps Android
vf :: Para tener una app en iPhone y Android con Kotlin y Swift basta con un solo código
elige :: ¿Con qué está hecho este mapa de estudios? :: React Native :: HTML, CSS y JavaScript (con Firebase) :: Kotlin
elige :: ¿Qué orden de cursos propone el mapa para hacer apps? :: Kotlin, después JavaScript :: JavaScript + TypeScript, después React Native, después Kotlin :: Solo Python
escribe :: Un amigo te pregunta qué usas para tus apps y por qué no Kotlin. ¿Qué le dices? :: Uso React Native con TypeScript y Expo, que con un solo código me da la app para iPhone y Android; Kotlin es el lenguaje nativo de Android y lo usaría para algo solo de Android o para una pieza nativa especial.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cuál es la diferencia entre JavaScript, TypeScript, React y React Native?":** "JavaScript es el lenguaje que corre en el navegador y, con Node.js, fuera de él. TypeScript es JavaScript con tipos que se revisan antes de correr y se convierte en JavaScript. React es una librería para armar pantallas web con componentes. React Native usa React y TypeScript para hacer apps nativas de iPhone y Android con un solo código, y Expo es el framework que uso para correrla y publicarla. Kotlin y Swift son los lenguajes nativos de Android y iPhone."

> 🌎 **En la vida real:** es como explicar los roles de un equipo de obra: quién hace qué y cómo se juntan.

> 🌎 **Otro ejemplo:** Es como un mapa de metro bien explicado: cada línea, su color y sus conexiones.
