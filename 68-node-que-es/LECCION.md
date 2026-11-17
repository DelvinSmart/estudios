# Node.js 1: qué es Node.js y cómo corre tu código

> 🌎 **En la vida real:** JavaScript nació para vivir dentro del navegador, como un pez en su pecera. Node.js es el mar: el mismo pez, pero ahora puede ir a cualquier lado, a tu computadora, a un servidor o a la nube.

> 🎙️ **El profesor dice:** este es el primer tema del curso **Node.js**, que tiene su propio certificado. Ya usaste Node en la clase de CRUD y en las herramientas de este mapa. Aquí lo aprendes a fondo: qué es, cómo trabaja (el *event loop*), cómo correr archivos, `process` y los módulos que trae. Necesitas el curso JavaScript + TypeScript, o al menos sus clases de funciones, arrays y asincronía.

## Parte 1. Qué es Node.js

> 🌎 **En la vida real:** es como un motor de carro sacado del carro y puesto en un generador: el mismo motor, ahora mueve otra cosa.

> 🌎 **Otro ejemplo:** Es como un cocinero de restaurante que también cocina para eventos afuera.

### El mismo motor, fuera del navegador

**Node.js** es un programa que **ejecuta JavaScript fuera del navegador**. Usa **V8**, el mismo motor de JavaScript de Chrome y Brave, y le agrega lo que el navegador no da: leer y escribir archivos, crear servidores, hablar con la red y con el sistema.

Lo que **no** tiene: `document`, `window` ni botones; no hay página. Lo que **sí** tiene: `process`, `fs` (archivos), `http` (servidores) y mucho más.

> 🌎 **En la vida real:** el navegador es una vitrina: muestra y responde a toques. Node es la trastienda: guarda, organiza y atiende pedidos.

> 🌎 **Otro ejemplo:** Es como la cocina de un restaurante: el cliente no la ve, pero ahí se hace todo.

### Para qué se usa

- **Servidores y APIs:** el backend de una app (clases 70 a 72).
- **Herramientas:** Vite, ESLint, TypeScript y los scripts de npm corren en Node.
- **Funciones en la nube:** las Cloud Functions de este mapa (las que mandan los correos y corrigen las prácticas) son Node.
- **Scripts:** como `firebase/generar-reglas.mjs` de este mismo repositorio.

> 🌎 **En la vida real:** es como una navaja suiza: un solo mango con muchas herramientas.

> 🌎 **Otro ejemplo:** Es como un electricista que hace instalaciones, arreglos y también te arma la lámpara.

```practica
vf :: Node.js ejecuta JavaScript fuera del navegador
vf :: En Node.js existe document para cambiar el HTML de una página
elige :: ¿Qué motor de JavaScript usa Node.js? :: SpiderMonkey :: V8, el mismo de Chrome :: Python
elige :: ¿Cuál de estas cosas está hecha con Node en este mapa? :: El CSS :: Las Cloud Functions que mandan los correos :: Los colores
escribe :: Explica con tus palabras qué es Node.js. :: Es un programa que ejecuta JavaScript fuera del navegador, en la computadora o en un servidor, y le agrega cosas como leer archivos y crear servidores.
```

## Parte 2. El event loop: un solo cocinero muy ordenado

> 🌎 **En la vida real:** un solo mesero que atiende muchas mesas: toma el pedido, lo deja en la cocina y sigue con otra mesa. No se queda parado esperando.

> 🌎 **Otro ejemplo:** Es como poner la lavadora y, mientras lava, cocinar.

### Un hilo, muchas esperas

Node ejecuta tu JavaScript en **un solo hilo** (como viste con React Native en la clase 11). Lo que tarda (leer un archivo, esperar a la base de datos, una petición a internet) se **pide** y Node sigue atendiendo otras cosas; cuando llega la respuesta, ejecuta lo que dejaste preparado. A ese ciclo de "atender lo que llegó" se le llama **event loop**.

```js
import { readFile } from 'node:fs/promises';

console.log('1. pido el archivo');
const texto = readFile('gastos.csv', 'utf8');   // no espera aquí
console.log('2. sigo atendiendo');
console.log('3. llegó:', (await texto).length, 'letras');
```

Por eso un servidor de Node atiende **miles de pedidos** con un solo hilo: casi todo el tiempo está esperando a la red o al disco, no calculando.

> 🌎 **En la vida real:** es como un recepcionista de hotel con varias llamadas en espera: atiende una, pone otra en espera y vuelve.

> 🌎 **Otro ejemplo:** Es como un controlador de tráfico: no maneja los carros, solo los organiza.

### Lo que lo traba

Un cálculo **largo y pesado** (por ejemplo, un ciclo de mil millones de vueltas) bloquea el hilo: nadie más es atendido hasta que termine. En un servidor, eso hace que todos los usuarios esperen.

> 🌎 **En la vida real:** si el único mesero se pone a pelar 100 kilos de papas, ninguna mesa es atendida.

> 🌎 **Otro ejemplo:** Es como un auto parado en medio de una calle de un solo carril.

```practica
vf :: Node ejecuta tu JavaScript en un solo hilo
vf :: Un cálculo muy largo en Node no afecta a los demás pedidos
elige :: ¿Qué hace Node mientras espera que llegue un archivo? :: Se congela :: Sigue atendiendo otras cosas :: Se apaga
elige :: ¿Por qué un servidor de Node atiende muchos pedidos con un hilo? :: Porque tiene muchos procesadores :: Porque casi siempre está esperando a la red o al disco, no calculando :: Porque no usa JavaScript
escribe :: ¿Qué es el event loop, con un ejemplo de la vida real? :: Es el ciclo con el que Node atiende lo que va llegando mientras otras cosas esperan, como un mesero que deja el pedido en la cocina y sigue atendiendo otras mesas hasta que el plato está listo.
```

## Parte 3. Correr archivos, process y los módulos de Node

> 🌎 **En la vida real:** `process` es el tablero del carro: dice cómo lo arrancaste, qué combustible tiene y te deja apagarlo.

> 🌎 **Otro ejemplo:** Es como la ficha de ingreso de un paciente: quién es, qué trae y por qué vino.

### Correr un archivo y pasarle datos

```bash
node resumen.mjs semana.csv
NODE_ENV=produccion node servidor.mjs
node --watch servidor.mjs      # se reinicia solo al guardar
```

```js
// resumen.mjs
const archivo = process.argv[2];                 // 'semana.csv' (lo que escribiste después del nombre)
const modo = process.env.NODE_ENV ?? 'desarrollo';   // variables de entorno
if (!archivo) {
  console.error('Uso: node resumen.mjs <archivo.csv>');
  process.exit(1);                               // termina con error
}
```

> 🌎 **En la vida real:** `argv` es lo que le dices al taxista al subir; `env` es la configuración del taxi.

> 🌎 **Otro ejemplo:** Es como los ingredientes que le das al cocinero al hacer el pedido.

### Los módulos que trae Node

Se importan con el prefijo `node:`:

| Módulo | Para qué |
|---|---|
| `node:fs/promises` | Leer y escribir archivos (clase 69) |
| `node:path` | Armar rutas de carpetas sin errores |
| `node:http` | Crear un servidor (clase 70) |
| `node:test` | Escribir pruebas sin instalar nada (clase 74) |
| `node:crypto` | Números al azar seguros, hashes |

Los archivos `.mjs` (o con `"type": "module"` en `package.json`) usan `import`; el estilo viejo `require()` (CommonJS) lo vas a ver en código antiguo.

> 🌎 **En la vida real:** son las herramientas que vienen de fábrica con el carro.

> 🌎 **Otro ejemplo:** Es como la vajilla que trae un departamento amueblado.

```practica
vf :: process.argv tiene lo que escribiste después del nombre del archivo al correrlo
vf :: Los módulos propios de Node se instalan con npm
elige :: ¿Cómo lees una variable de entorno llamada NODE_ENV? :: env.NODE_ENV :: process.env.NODE_ENV :: window.NODE_ENV
elige :: ¿Qué hace node --watch servidor.mjs? :: Lo borra :: Lo reinicia solo cada vez que guardas :: Lo publica
escribe :: Escribe cómo terminar un script con error si no te pasaron el nombre de un archivo. :: if (!process.argv[2]) { console.error('Falta el archivo'); process.exit(1); }
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es Node.js y cómo funciona?":** "Es un entorno que ejecuta JavaScript fuera del navegador con el motor V8. Trabaja con un solo hilo y un event loop: lo que tarda, como archivos, red o base de datos, se pide y sigue atendiendo otras cosas, por eso un servidor atiende muchos pedidos a la vez; lo que lo traba son los cálculos largos. Uso process.argv y process.env para entrada y configuración, y los módulos node: como fs, path, http y test."

> 🌎 **En la vida real:** es como explicar cómo un restaurante con un solo mesero muy organizado atiende el salón lleno.

> 🌎 **Otro ejemplo:** Es como un piloto explicando el motor y el tablero antes de despegar.
