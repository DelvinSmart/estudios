# Tema 09: CRUD en Node.js (la tarea grande)

En este tema vas a hacer un **servidor** pequeño, de verdad, con sus pruebas. Es la base de casi todos los sistemas, y es una de las cosas que más preguntan en las entrevistas.

**Antes de empezar:** Temas 01 a 08.

**Tiempo:** varios días. Es una tarea, no una lectura: haz un ejercicio por día.

## 1. ¿Qué es un CRUD?

Son las **4 operaciones básicas** sobre datos:

| Letra | Significa | Verbo HTTP | En este proyecto | En Copiloto |
|---|---|---|---|---|
| **C** | Create (crear) | `POST` | Registrar un gasto | Registrar un ingreso |
| **R** | Read (leer) | `GET` | Ver los gastos | Ver tus ingresos del mes |
| **U** | Update (actualizar) | `PUT` | Corregir un gasto | Editar un ingreso |
| **D** | Delete (borrar) | `DELETE` | Eliminar un gasto | Borrar un ingreso |

Casi todo sistema es esto: Copiloto Driver registra, muestra, edita y borra ingresos y gastos.

## 2. Las palabras

| Palabra | Qué es |
|---|---|
| **Servidor** | Un programa que espera pedidos y los responde |
| **Node.js** | El programa que ejecuta JavaScript fuera del navegador (en tu Mac, en un servidor) |
| **Express** | Una librería para hacer servidores web con Node, muy usada |
| **HTTP** | El idioma con el que se hablan el navegador (o la app) y el servidor |
| **Ruta** | Una dirección del servidor: `/gastos`, `/gastos/1` |
| **Petición** (request) | Lo que llega al servidor: verbo + ruta + datos |
| **Respuesta** (response) | Lo que el servidor devuelve: un código + datos |
| **JSON** | El formato de los datos: `{ "descripcion": "Agua", "monto": 3 }` |
| **Puerto** | La "puerta" por donde escucha el servidor: `3000` |
| **localhost** | "Esta misma computadora" |
| **API** | El conjunto de rutas que ofrece un servidor |

**Comparación:** el servidor es un mesero. La petición es tu pedido ("tráeme la lista de gastos"); la respuesta es el plato. El código de respuesta es lo que dice el mesero: "aquí está" (200), "no tenemos eso" (404), "su pedido no se entiende" (400).

## 3. Qué hay en esta carpeta

| Archivo | Qué es | Tipo de código |
|---|---|---|
| `src/validar.js` | Las **reglas**: ¿la descripción y el monto son válidos? | Reglas puras (como `utils/` en tu app) |
| `src/app.js` | Las **5 rutas** del CRUD. **Empieza por aquí.** | Rutas |
| `src/server.js` | Enciende el servidor en el puerto 3000 | Arranque |
| `test/validar.test.js` | Pruebas **unitarias** de las reglas | Prueba unitaria |
| `test/gastos.test.js` | Prueba de **integración**: el ciclo completo con peticiones reales | Prueba de integración |

¿Por qué `app.js` y `server.js` están separados? Para poder **probar la app sin abrir un puerto fijo**: la prueba arranca el servidor en un puerto libre, prueba y lo apaga. Es la misma idea de separar responsabilidades del Tema 10.

## 4. Cómo ejecutarlo

1. Abre esta carpeta en la terminal:
   ```bash
   cd /Volumes/SSD_Desarrollo/Developer/Aprender/09-crud-nodejs
   ```
2. Instala las librerías (solo la primera vez):
   ```bash
   npm install
   ```
3. Enciende el servidor:
   ```bash
   npm start
   ```
4. Debe decir: `Servidor listo en http://localhost:3000`

El servidor queda encendido. Para apagarlo: **Ctrl + C**.

## 5. Cómo probarlo a mano

Abre **otra** terminal (la primera está ocupada con el servidor) y pega los comandos uno por uno. `curl` es un programa que hace peticiones desde la terminal.

**Crear:**
```bash
curl -X POST localhost:3000/gastos -H "Content-Type: application/json" -d '{"descripcion":"Gasolina","monto":120}'
```
Respuesta: `{"id":1,"descripcion":"Gasolina","monto":120}`

**Listar:**
```bash
curl localhost:3000/gastos
```

**Ver uno:**
```bash
curl localhost:3000/gastos/1
```

**Actualizar:**
```bash
curl -X PUT localhost:3000/gastos/1 -H "Content-Type: application/json" -d '{"descripcion":"Gasolina","monto":150}'
```

**Borrar:**
```bash
curl -X DELETE localhost:3000/gastos/1
```

**Provocar un error a propósito** (monto negativo):
```bash
curl -X POST localhost:3000/gastos -H "Content-Type: application/json" -d '{"descripcion":"Agua","monto":-5}'
```
Respuesta: `{"errores":["El monto debe ser un número mayor que 0."]}`

Las partes de `curl`:
- `-X POST` → el verbo.
- `-H "Content-Type: application/json"` → "te mando JSON".
- `-d '...'` → los datos.

## 6. Los códigos de respuesta

| Código | Significa | Cuándo lo devuelve este servidor |
|---|---|---|
| **200** | Todo bien | Al listar, ver o actualizar |
| **201** | Creado | Al crear un gasto |
| **204** | Hecho, sin contenido | Al borrar |
| **400** | Enviaste datos inválidos | Monto negativo, sin descripción |
| **404** | No existe | Un id que no está |
| **500** | Falló el servidor | Un error del código |

Regla fácil: **2xx** = bien, **4xx** = se equivocó quien pide, **5xx** = se equivocó el servidor.

## 7. Cómo se lee una ruta

La ruta de **crear**, de `src/app.js`:

```js
app.post('/gastos', (req, res) => {
  const errores = validarGasto(req.body);                            // 1
  if (errores.length > 0) return res.status(400).json({ errores });  // 2
  const gasto = { id: siguienteId++, descripcion: req.body.descripcion.trim(), monto: req.body.monto }; // 3
  gastos.push(gasto);                                                // 4
  res.status(201).json(gasto);                                       // 5
});
```

| # | Qué hace |
|---|---|
| — | `app.post('/gastos', ...)`: "cuando llegue un `POST` a `/gastos`, haz esto" |
| 1 | Revisa los datos con las reglas de `validar.js` |
| 2 | Si hay errores, responde **400** con la lista de errores y termina |
| 3 | Arma el gasto nuevo. `siguienteId++` usa el número y lo sube en uno para el próximo |
| 4 | Lo guarda en la lista (`push` = agregar al final) |
| 5 | Responde **201** con el gasto creado |

- `req` (request) es lo que llega. `req.body` son los datos; `req.params.id` es el número de la ruta (`/gastos/1` → `"1"`).
- `res` (response) es lo que respondes.

**Ojo:** los datos viven en una lista en memoria. Al apagar el servidor, **se borran**. El ejercicio 4 lo resuelve.

## 8. Cómo se lee una regla

`src/validar.js`:
```js
function validarGasto(datos) {
  const errores = [];
  if (typeof datos.descripcion !== 'string' || datos.descripcion.trim() === '') {
    errores.push('La descripción es obligatoria.');
  }
  if (typeof datos.monto !== 'number' || !Number.isFinite(datos.monto) || datos.monto <= 0) {
    errores.push('El monto debe ser un número mayor que 0.');
  }
  return errores;
}
```
- Empieza con una lista de errores vacía.
- `typeof x !== 'string'` → "si no es texto".
- `Number.isFinite` → que sea un número de verdad (no "infinito" ni "no es un número").
- Devuelve la lista: vacía si todo está bien.

Es una **función pura**: no toca el servidor ni la base de datos. Por eso se prueba con una prueba unitaria.

## 9. Corre las pruebas y sabotea

```bash
npm test
```
Debe dar:
```text
# tests 5
# pass 5
# fail 0
```

**Sabotaje** (como en el Tema 02): en `src/validar.js`, cambia `datos.monto <= 0` por `datos.monto < 0`. Ahora un gasto de monto **0** sería válido, y eso está mal. Corre `npm test`.

**¿Qué pasa? No falla ninguna prueba.** No es un error de la lección: es lo que este sabotaje vino a descubrir. **Nadie prueba el monto 0.** Las pruebas actuales revisan un monto normal (100) y uno negativo (−5), pero no el **borde**: justo 0.

Esto es exactamente lo que vimos en el Tema 02: los errores viven en los bordes, y un sabotaje que no falla te muestra una prueba que falta. Tu primera tarea (el Ejercicio 0) es escribir esa prueba.

Devuelve el `<=` cuando termines.

## 10. Los ejercicios (uno por día)

Haz **un** ejercicio por día, en este orden. Después de cada uno, corre `npm test` y muéstrale tu código a Claude.

### Ejercicio 0: la prueba que falta
En `test/validar.test.js`, agrega una prueba que diga que un monto de **0** es inválido.
- Corre `npm test`: debe pasar.
- Haz el sabotaje (`< 0`): **ahora sí** debe fallar tu prueba.
- Devuelve el `<=`.

### Ejercicio 1: un campo obligatorio nuevo
Agrega `categoria` (texto, obligatorio).
- Cambia `validarGasto` para exigirla.
- Cambia las rutas de crear y actualizar para guardarla.
- Agrega pruebas: sin categoría → 400; con categoría → 201.

### Ejercicio 2: el total
Agrega `GET /gastos/total`, que devuelva `{ "total": 123 }` con la suma de todos los montos.
- **Pista:** ponlo **antes** de `GET /gastos/:id`. Después ponlo **después** y mira qué pasa. ¿Por qué?
- Agrega una prueba.

### Ejercicio 3: pruebas para lo nuevo
Revisa que todo lo que agregaste en los ejercicios 1 y 2 tenga pruebas, incluidos los casos de error.

### Ejercicio 4: que no se borre al reiniciar
Guarda los gastos en un archivo `gastos.json`.
- **Pista:** `fs.readFileSync` y `fs.writeFileSync` (de la librería `fs` de Node) leen y escriben archivos.
- Apaga y prende el servidor: los gastos deben seguir ahí.

### Ejercicio 5: una base de datos real
Cambia el archivo por una base de datos: SQLite (la más simple), PostgreSQL o Firestore.
- **Pista de arquitectura (Tema 10):** crea un "repositorio" con funciones `listar`, `crear`, `actualizar` y `borrar`, igual que el `SanRepository` de tu app. Así las rutas no saben qué base de datos hay detrás.

## Respuesta de la pista del ejercicio 2

<details>
<summary>Ver respuesta</summary>

Express revisa las rutas **en orden**. Si `/gastos/:id` está antes, cuando pides `/gastos/total` Express cree que `total` es un id, busca un gasto con id "total", no lo encuentra y responde 404. Por eso la ruta fija (`/gastos/total`) va antes que la ruta con variable (`/gastos/:id`).

</details>

## Para la entrevista

**¿Qué es un CRUD?**
> Las cuatro operaciones básicas sobre datos: crear, leer, actualizar y borrar. En una API REST se hacen con los verbos POST, GET, PUT y DELETE.

**¿Diferencia entre PUT y PATCH?**
> PUT reemplaza el recurso completo; PATCH cambia solo una parte.

**¿Por qué validar en el servidor si la app ya valida?**
> Porque cualquiera puede llamar a la API sin usar la app. La validación de la app es para la comodidad del usuario; la del servidor es la que protege los datos.

**¿Qué código devuelves si los datos están mal? ¿Y si el recurso no existe?**
> 400 para datos inválidos y 404 si no existe.

**Cuéntame de una prueba que encontraste que faltaba.**
> En un CRUD de práctica saboteé la regla del monto cambiando "menor o igual a cero" por "menor que cero", y ninguna prueba falló. Así descubrí que nadie probaba el borde, el monto cero, y escribí esa prueba.
