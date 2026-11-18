# Node.js 7: pruebas y publicar el servidor

> 🌎 **En la vida real:** antes de abrir una tienda nueva, haces un ensayo con amigos; después, eliges un local y abres la puerta al público.

> 🎙️ **El profesor dice:** la última clase del curso **Node.js**: probar la API con `node:test` y **supertest** (sin abrir el navegador), correr las pruebas en el CI, y **publicar** el servidor gratis: con Cloud Functions de Firebase (lo que usa este mapa) y otras opciones gratuitas. Al final, el mapa de todo lo que aprendiste.

## Parte 1. Probar la API

> 🌎 **En la vida real:** es como un cliente misterioso que prueba cada ventanilla del banco y anota si lo atendieron bien.

> 🌎 **Otro ejemplo:** Es como el ensayo general de una obra antes del estreno.

### node:test + supertest

```bash
npm install -D supertest
```

```js
// app.test.mjs — node --test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from './app.mjs';
import { reiniciar } from './gastos.mjs';

beforeEach(() => reiniciar());   // cada prueba empieza con la lista vacía

test('crea un gasto y lo devuelve con 201', async () => {
  const r = await request(app).post('/gastos').send({ tipo: 'lavado', valor: 30 });
  assert.equal(r.status, 201);
  assert.deepEqual(r.body, { id: 1, tipo: 'lavado', valor: 30 });
});

test('rechaza un valor negativo con 400', async () => {
  const r = await request(app).post('/gastos').send({ tipo: 'lavado', valor: -5 });
  assert.equal(r.status, 400);
});

test('borrar un gasto que no existe da 404', async () => {
  const r = await request(app).delete('/gastos/99');
  assert.equal(r.status, 404);
});
```

`supertest` llama a tu `app` **sin abrir un puerto**: rápido y sin conflictos. Por eso en la clase 72 `app.mjs` exporta `app` y el `listen` va en otro archivo (`servidor.mjs`).

> 🌎 **En la vida real:** es como probar el motor en el banco de pruebas del taller, sin sacarlo a la calle.

> 🌎 **Otro ejemplo:** Es como un simulador de vuelo para la tripulación.

### Qué probar

Cada ruta con el caso bueno, los **errores** (400, 404) y los **bordes** (lista vacía, campos de más como `admin: true` que se deben ignorar). Y que las reglas de seguridad se cumplan: que un usuario no pueda tocar lo de otro.

> 🌎 **En la vida real:** al probar una cerradura, pruebas la llave correcta, una equivocada y forzarla.

> 🌎 **Otro ejemplo:** Es como revisar un paracaídas: abre, no se enreda, y aguanta el peso.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pruebas para la API, con su sabotaje
lenguaje: js
pide: Con un `pedir` de mentira (como supertest, pero sin red), escribe al menos 3 pruebas con `it` y `assertEqual(real, esperado)`: crear un gasto bueno da 201, un valor negativo da 400, y borrar uno que no existe da 404. Las revisiones sabotean la API y tus pruebas tienen que notarlo.
--- código
let SABOTAJE = '';
function crearAPI() {
  let gastos = [];
  return function pedir(verbo, ruta, cuerpo) {
    if (verbo === 'POST' && ruta === '/gastos') {
      if (!(cuerpo.valor > 0) && SABOTAJE !== 'sinValidar') return { status: 400 };
      const g = { id: gastos.length + 1, ...cuerpo };
      gastos.push(g);
      return { status: 201, body: g };
    }
    if (verbo === 'DELETE') {
      const id = Number(ruta.split('/')[2]);
      if (!gastos.some((g) => g.id === id)) return { status: SABOTAJE === 'borrar200' ? 200 : 404 };
      gastos = gastos.filter((g) => g.id !== id);
      return { status: 204 };
    }
    return { status: 404 };
  };
}

const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const assertEqual = (real, esperado) => { if (real !== esperado) throw new Error(`esperaba ${esperado} y recibió ${real}`); };

// ✍️ Tus pruebas aquí (cada prueba crea su propia API: const pedir = crearAPI();):
--- pruebas
const correrTodas = () => misPruebas.filter((p) => { try { p.fn(); return false; } catch { return true; } }).map((p) => p.nombre);
prueba('pasan con la API correcta', () => { const f = correrTodas(); ok(misPruebas.length >= 3 && f.length === 0, f.length ? 'fallan: ' + f.join(' | ') : 'escribe al menos 3 pruebas'); });
prueba('notan si deja de validar', () => { SABOTAJE = 'sinValidar'; const f = correrTodas(); SABOTAJE = ''; ok(f.length > 0, 'falta la prueba del valor negativo'); });
prueba('notan si borrar lo que no existe da 200', () => { SABOTAJE = 'borrar200'; const f = correrTodas(); SABOTAJE = ''; ok(f.length > 0, 'falta la prueba del 404 al borrar'); });
--- solución
let SABOTAJE = '';
function crearAPI() {
  let gastos = [];
  return function pedir(verbo, ruta, cuerpo) {
    if (verbo === 'POST' && ruta === '/gastos') {
      if (!(cuerpo.valor > 0) && SABOTAJE !== 'sinValidar') return { status: 400 };
      const g = { id: gastos.length + 1, ...cuerpo };
      gastos.push(g);
      return { status: 201, body: g };
    }
    if (verbo === 'DELETE') {
      const id = Number(ruta.split('/')[2]);
      if (!gastos.some((g) => g.id === id)) return { status: SABOTAJE === 'borrar200' ? 200 : 404 };
      gastos = gastos.filter((g) => g.id !== id);
      return { status: 204 };
    }
    return { status: 404 };
  };
}

const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const assertEqual = (real, esperado) => { if (real !== esperado) throw new Error(`esperaba ${esperado} y recibió ${real}`); };

it('crea un gasto con 201', () => { const pedir = crearAPI(); assertEqual(pedir('POST', '/gastos', { tipo: 'lavado', valor: 30 }).status, 201); });
it('rechaza un valor negativo con 400', () => { const pedir = crearAPI(); assertEqual(pedir('POST', '/gastos', { tipo: 'lavado', valor: -5 }).status, 400); });
it('borrar uno que no existe da 404', () => { const pedir = crearAPI(); assertEqual(pedir('DELETE', '/gastos/99').status, 404); });
```

```practica
vf :: supertest prueba la app de Express sin abrir un puerto
vf :: Las pruebas de una API solo necesitan el caso en que todo sale bien
elige :: ¿Por qué app.mjs exporta app y el listen va en otro archivo? :: Por estilo :: Para poder probar la app sin abrir un puerto :: Porque Express lo obliga
elige :: ¿Qué hace beforeEach(() => reiniciar())? :: Borra las pruebas :: Deja la lista vacía antes de cada prueba :: Publica el servidor
escribe :: Escribe una prueba que confirme que GET /gastos/99 responde 404. :: test('un gasto que no existe da 404', async () => { const r = await request(app).get('/gastos/99'); assert.equal(r.status, 404); });
```

## Parte 2. Publicar gratis

> 🌎 **En la vida real:** abrir la tienda: necesitas un local con dirección, luz y una puerta que esté siempre abierta.

> 🌎 **Otro ejemplo:** Es como pasar de cocinar en casa a tener un puesto en la feria.

### Cloud Functions de Firebase (como este mapa)

El proyecto `mapa-estudios-ds` de este mapa ya corre dos funciones de Node (`corregirPractica` y `enviarCorreoCuenta`). Una API de Express también se puede publicar como función:

```js
import { onRequest } from 'firebase-functions/v2/https';
import { app } from './app.mjs';
export const api = onRequest({ region: 'us-central1', maxInstances: 2 }, app);
```

```bash
firebase deploy --only functions:api
```

Las funciones tienen una **cuota gratis** mensual, y el de este mapa tiene una **alerta de presupuesto** de 10 reales. Pon `maxInstances` bajo y límites de uso (clase 73) para no salirte de lo gratis.

> 🌎 **En la vida real:** es como tener tu puesto dentro de un mercado que ya pagó la luz y la seguridad, mientras no pases cierto consumo.

> 🌎 **Otro ejemplo:** Es como un plan de celular con datos gratis cada mes.

### Antes de publicar

- Las pruebas pasan, también en el **CI** (Tema 04: `npm test` en cada subida).
- Los secretos están en el gestor de secretos, no en el código.
- CORS, límites y helmet puestos (clases 72 y 73).
- Un endpoint de salud (`GET /salud`) para comprobar que está vivo.

> 🌎 **En la vida real:** es la inspección de bomberos antes de abrir el local.

> 🌎 **Otro ejemplo:** Es como revisar el carro antes de un viaje largo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La lista antes de publicar
lenguaje: js
pide: Completa `listoParaPublicar(proyecto)`: devuelve lo que falta, en este orden: `'las pruebas no pasan'` (si `pruebasOk` no es true), `'hay un secreto en el código'` (si algún archivo de `archivos` es `.env` o el `codigo` tiene `sk_`), `'falta GET /salud'` (si `rutas` no lo incluye), `'CORS abierto a todos'` (si `cors` es `'*'`), `'sin límite de instancias'` (si `maxInstances` no es un número).
--- código
function listoParaPublicar(proyecto) {
  // tu código aquí
}
--- pruebas
const bien = { pruebasOk: true, archivos: ['app.mjs'], codigo: 'app.get()', rutas: ['GET /salud', 'GET /gastos'], cors: ['https://delvinsmart.github.io'], maxInstances: 2 };
prueba('todo bien', () => igual(listoParaPublicar(bien), []));
prueba('sin /salud y con CORS abierto', () => igual(listoParaPublicar({ ...bien, rutas: ['GET /gastos'], cors: '*' }), ['falta GET /salud', 'CORS abierto a todos']));
prueba('un .env', () => igual(listoParaPublicar({ ...bien, archivos: ['.env', 'app.mjs'] }), ['hay un secreto en el código']));
prueba('pruebas rojas y sin límite', () => igual(listoParaPublicar({ ...bien, pruebasOk: false, maxInstances: undefined }), ['las pruebas no pasan', 'sin límite de instancias']));
--- solución
function listoParaPublicar(proyecto) {
  const falta = [];
  if (proyecto.pruebasOk !== true) falta.push('las pruebas no pasan');
  if (proyecto.archivos.includes('.env') || proyecto.codigo.includes('sk_')) falta.push('hay un secreto en el código');
  if (!proyecto.rutas.includes('GET /salud')) falta.push('falta GET /salud');
  if (proyecto.cors === '*') falta.push('CORS abierto a todos');
  if (typeof proyecto.maxInstances !== 'number') falta.push('sin límite de instancias');
  return falta;
}
```

```practica
vf :: Una app de Express se puede publicar como una Cloud Function con onRequest
vf :: Con la cuota gratis, conviene dejar maxInstances sin límite
elige :: ¿Qué protege tu bolsillo si algo se dispara en Firebase? :: El CSS :: La alerta de presupuesto y los límites de uso :: Nada
elige :: ¿Para qué sirve un endpoint GET /salud? :: Para borrar datos :: Para comprobar rápido que el servidor está vivo :: Para el login
escribe :: Escribe la lista de lo que revisas antes de publicar tu API. :: Que las pruebas pasen también en el CI, que los secretos estén en el gestor de secretos, que estén CORS, los límites y helmet, y que haya un endpoint de salud.
```

## Parte 3. El mapa de lo que aprendiste

> 🌎 **En la vida real:** al terminar un viaje, miras el mapa y ves todo el camino recorrido.

> 🌎 **Otro ejemplo:** Es como el álbum de fotos de un viaje.

### Todo junto

| Clase | Lo que sabes hacer |
|---|---|
| 1 | Explicar qué es Node y el event loop |
| 2 | Leer y escribir archivos, rutas seguras |
| 3 | Un servidor con node:http y los códigos de estado |
| 4 | Express: rutas, middleware y errores |
| 5 | Una API REST con validación y CORS |
| 6 | Base de datos, autenticación, permisos y límites |
| 7 | Pruebas con supertest y publicar gratis |

Con esto puedes construir el **backend** de una app: una API para Copiloto, para una web o para un proyecto nuevo, y entender las funciones que ya corren en este mapa.

> 🌎 **En la vida real:** es como un mecánico que ya sabe desarmar, arreglar, probar y entregar.

> 🌎 **Otro ejemplo:** Es como terminar la escuela de cocina: ya puedes abrir tu cocina.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El mapa de lo que sabes hacer
lenguaje: js
pide: Completa `queClase(tarea)` con el número de clase del curso (1 a 7) donde se aprende: event loop → 1; leer archivos o path → 2; node:http → 3; middleware → 4; validar o CORS → 5; SQL, token o límites → 6; supertest o publicar → 7. Cada tarea trae una de esas palabras.
--- código
function queClase(tarea) {
  // tu código aquí
}
--- pruebas
prueba('event loop', () => igual(queClase('explicar el event loop'), 1));
prueba('path', () => igual(queClase('armar rutas con path'), 2));
prueba('node:http', () => igual(queClase('un servidor con node:http'), 3));
prueba('middleware', () => igual(queClase('escribir un middleware'), 4));
prueba('CORS', () => igual(queClase('configurar CORS'), 5));
prueba('SQL', () => igual(queClase('consultas SQL con parámetros'), 6));
prueba('supertest', () => igual(queClase('probar con supertest'), 7));
--- solución
const CLAVES = [
  [1, ['event loop']],
  [2, ['archivos', 'path']],
  [3, ['node:http']],
  [4, ['middleware']],
  [5, ['validar', 'CORS']],
  [6, ['SQL', 'token', 'límites']],
  [7, ['supertest', 'publicar']],
];

function queClase(tarea) {
  return CLAVES.find(([, palabras]) => palabras.some((p) => tarea.includes(p)))?.[0] ?? null;
}
```

```practica
vf :: Con este curso puedes construir y publicar el backend de una app
vf :: Las funciones de este mapa de estudios no tienen relación con Node
elige :: ¿En qué clase aprendiste los middleware? :: 1 :: 4 :: 7
elige :: ¿Qué clase cubre la autenticación y los permisos? :: 2 :: 6 :: 3
escribe :: Propón un backend en Node para una app (por ejemplo, Copiloto) y di qué partes del curso usarías. :: Por ejemplo, una API de gastos para Copiloto con Express, validación y CORS, guardando en Firestore con firebase-admin, verificando el token del usuario, con límites de uso, pruebas con supertest y publicada como Cloud Function.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo pruebas y publicas un servidor de Node?":** "Separo la app del arranque para probarla con node:test y supertest, sin abrir puertos: caso bueno, errores, bordes y que nadie toque lo ajeno. Corro las pruebas en el CI. Publico como Cloud Function de Firebase con onRequest, con maxInstances bajo, secretos en el gestor, límites de uso y una alerta de presupuesto, igual que las funciones que ya corren en mi mapa de estudios."

> 🌎 **En la vida real:** es como explicar cómo ensayas y abres un local nuevo sin sorpresas.

> 🌎 **Otro ejemplo:** Es como un piloto que explica la revisión antes del vuelo y el plan de vuelo.
