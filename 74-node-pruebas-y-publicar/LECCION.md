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
