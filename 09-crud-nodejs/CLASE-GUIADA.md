# CRUD en Node.js (la tarea grande)

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después. El código está en esta misma carpeta: `src/` y `test/`.

**Cómo estudiarla:** varios días. Las partes 1 a 9 un par de días; después, **un ejercicio por día** (parte 10). Cada ejercicio trae su solución escondida, para que te corrijas tú mismo **después** de intentarlo.

**Lo que necesitas saber antes:** Temas 01 a 08 (y el 17: `fetch`, `async`, JSON).

## 1. ¿Qué es un CRUD?

> 🎙️ **El profesor:** {{alumno}}, hasta hoy estudiaste una tienda que ya existía. Hoy abres **tu propio puesto**, desde cero: un **servidor** pequeño, de verdad, con sus pruebas. Es la base de casi todos los sistemas del mundo, y es de lo que más preguntan en las entrevistas de backend.

**CRUD** son las **4 operaciones básicas** sobre datos:

| Letra | Significa | Verbo HTTP | En este proyecto | En Copiloto |
|---|---|---|---|---|
| **C** | *Create* (crear) | `POST` | Registrar un gasto | Registrar un ingreso |
| **R** | *Read* (leer) | `GET` | Ver los gastos | Ver tus ingresos del mes |
| **U** | *Update* (actualizar) | `PUT` | Corregir un gasto | Editar un ingreso |
| **D** | *Delete* (borrar) | `DELETE` | Eliminar un gasto | Borrar un ingreso |

Casi todo sistema es esto: el banco con tus cuentas, la farmacia con sus remedios, la app Copiloto con los ingresos.

> 🌎 **En la vida real:** la libreta de contactos del celular: **agregar** un contacto (C), **buscarlo** (R), **cambiarle** el número (U) y **borrarlo** (D).

> 🌎 **Otro ejemplo:** Como el inventario de una tienda: agregar productos nuevos, ver qué hay, corregir un precio y sacar lo que ya no se vende.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cada acción, su letra y su verbo
lenguaje: js
pide: Completa `crud(accion)`: devuelve `{ letra, verbo }` para cada acción: `'crear'` → C y POST, `'leer'` → R y GET, `'actualizar'` → U y PUT, `'borrar'` → D y DELETE.
--- código
function crud(accion) {
  // tu código aquí
}
--- pruebas
prueba('crear', () => igual(crud('crear'), { letra: 'C', verbo: 'POST' }));
prueba('leer', () => igual(crud('leer'), { letra: 'R', verbo: 'GET' }));
prueba('actualizar', () => igual(crud('actualizar'), { letra: 'U', verbo: 'PUT' }));
prueba('borrar', () => igual(crud('borrar'), { letra: 'D', verbo: 'DELETE' }));
--- solución
const TABLA = {
  crear: { letra: 'C', verbo: 'POST' },
  leer: { letra: 'R', verbo: 'GET' },
  actualizar: { letra: 'U', verbo: 'PUT' },
  borrar: { letra: 'D', verbo: 'DELETE' },
};

function crud(accion) {
  return TABLA[accion];
}
```

```practica
escribe :: ¿Qué es un CRUD? :: Las cuatro operaciones básicas sobre datos: crear, leer, actualizar y borrar (POST, GET, PUT y DELETE).
elige :: ¿Qué verbo HTTP se usa para crear? :: `GET` :: `POST` :: `DELETE`
elige :: ¿Qué verbo HTTP se usa para leer? :: `GET` :: `PUT` :: `POST`
elige :: Corregir el monto de un gasto es… :: C :: R :: U :: D
vf :: Editar un ingreso en Copiloto es una operación de actualizar (U)
```

> 🔁 **Repaso:** Create (POST), Read (GET), Update (PUT), Delete (DELETE).

> 🧪 **Practícalo aquí mismo:** en el [laboratorio de CRUD](#/laboratorio) escribes las cuatro funciones (crear, leer, actualizar y borrar) en JavaScript y ves al lado los datos y las pruebas, sin instalar nada. Después vuelve aquí para hacerlo con un servidor de verdad.

## 2. Las palabras

> 🎙️ **El profesor:** antes de ver el código, el vocabulario. Todo pasa en **un restaurante**.

> 🌎 **Otro ejemplo:** En un banco: el servidor es el cajero; la petición, tu trámite; la respuesta, tu comprobante; la ruta, la ventanilla; y la API, la lista de trámites que se pueden hacer.

| Palabra | Qué es | 🌎 En el restaurante |
|---|---|---|
| **Servidor** | Un programa que espera pedidos y los responde | El **mesero** que espera en la puerta de la cocina |
| **Node.js** | Ejecuta JavaScript fuera del navegador | La **cocina** |
| **Express** | Una librería para hacer servidores web con Node | Un **set de cocina** ya armado |
| **HTTP** | El idioma entre el cliente y el servidor | El **idioma** de cliente y mesero |
| **Ruta** | Una dirección del servidor: `/gastos`, `/gastos/1` | La **sección** del menú |
| **Petición** (*request*) | Lo que llega: verbo + ruta + datos | El **pedido** |
| **Respuesta** (*response*) | Lo que se devuelve: un código + datos | El **plato** |
| **JSON** | El formato de los datos | La **comanda** escrita que todos entienden |
| **Puerto** | La "puerta" donde escucha el servidor: `3000` | La **ventanilla** número 3000 |
| **localhost** | "Esta misma computadora" | "**Este mismo local**" |
| **API** | El conjunto de rutas que ofrece un servidor | El **menú completo** |

El servidor es un mesero: la **petición** es tu pedido ("tráeme la lista de gastos"); la **respuesta** es el plato; y el **código** de respuesta es lo que dice el mesero: "aquí está" (200), "no tenemos eso" (404), "su pedido no se entiende" (400).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Desarmar una petición HTTP
lenguaje: js
pide: Una petición tiene un **verbo**, una **ruta** y, a veces, **datos**. Completa `leerPeticion(texto)` para textos como `'POST /gastos {"descripcion":"Agua","monto":5}'`: devuelve `{ verbo, ruta, datos }`, con `datos` ya convertido a objeto (o `null` si no vienen).
--- código
function leerPeticion(texto) {
  // tu código aquí
}
--- pruebas
prueba('con datos', () => igual(leerPeticion('POST /gastos {"descripcion":"Agua","monto":5}'), { verbo: 'POST', ruta: '/gastos', datos: { descripcion: 'Agua', monto: 5 } }));
prueba('sin datos', () => igual(leerPeticion('GET /gastos/7'), { verbo: 'GET', ruta: '/gastos/7', datos: null }));
prueba('datos con espacios adentro', () => igual(leerPeticion('PUT /gastos/1 {"descripcion": "Agua mineral", "monto": 6}').datos.descripcion, 'Agua mineral'));
--- solución
function leerPeticion(texto) {
  const [verbo, ruta, ...resto] = texto.split(' ');
  const json = resto.join(' ');
  return { verbo, ruta, datos: json ? JSON.parse(json) : null };
}
```

```practica
elige :: ¿Qué es Node.js? :: Un navegador :: El programa que ejecuta JavaScript fuera del navegador :: Una base de datos
elige :: ¿Qué es una API? :: Un archivo :: El conjunto de rutas que ofrece un servidor :: Un error
elige :: ¿Qué es localhost? :: Un servidor en internet :: Esta misma computadora :: Una contraseña
vf :: Express es una librería para hacer servidores web con Node
escribe :: ¿Qué tiene una petición HTTP? :: Un verbo (GET, POST…), una ruta (como /gastos) y, a veces, datos.
```

> 🔁 **Repaso:** servidor, Node, Express, HTTP, ruta, petición, respuesta, JSON, puerto, localhost, API.

## 3. Qué hay en esta carpeta

> 🎙️ **El profesor:** el proyecto tiene cinco archivos, cada uno con un trabajo. Así se organiza un backend bien hecho.

> 🌎 **Otro ejemplo:** Como un local de comida rápida: el reglamento (validar), el menú con recetas (app), abrir la persiana (server), y dos inspectores: uno revisa las reglas, otro hace un pedido completo.

| Archivo | Qué es | 🌎 En el restaurante |
|---|---|---|
| `src/validar.js` | Las **reglas**: ¿la descripción y el monto son válidos? | El **reglamento** de la cocina |
| `src/app.js` | Las **5 rutas** del CRUD. **Empieza por aquí.** | El **menú con sus recetas** |
| `src/server.js` | Enciende el servidor en el puerto 3000 | **Abrir la puerta** del local |
| `test/validar.test.js` | Pruebas **unitarias** de las reglas | El inspector del reglamento |
| `test/gastos.test.js` | Prueba de **integración**: el ciclo completo | El **cliente misterioso** que pide, come, paga y se va |

**¿Por qué `app.js` y `server.js` están separados?** Para poder **probar la app sin abrir la puerta al público**: la prueba arranca el servidor en un puerto libre, prueba, y lo apaga. Separar responsabilidades: lo ves a fondo en el Tema 10.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un archivo, un trabajo
lenguaje: js
pide: Completa `archivoPara(tarea)` con la tabla de esta parte: reglas de validación → `'src/validar.js'`; las rutas del CRUD → `'src/app.js'`; encender el servidor en un puerto → `'src/server.js'`; probar una regla sola → `'test/validar.test.js'`; probar el ciclo completo → `'test/gastos.test.js'`. Cada tarea trae una palabra clave: `regla`, `ruta`, `puerto`, `unitaria`, `ciclo`.
--- código
function archivoPara(tarea) {
  // tu código aquí
}
--- pruebas
prueba('una regla nueva', () => igual(archivoPara('una regla nueva del monto'), 'src/validar.js'));
prueba('una ruta nueva', () => igual(archivoPara('una ruta nueva: GET /gastos/total'), 'src/app.js'));
prueba('cambiar el puerto', () => igual(archivoPara('cambiar el puerto a 4000'), 'src/server.js'));
prueba('una prueba unitaria', () => igual(archivoPara('una prueba unitaria del monto 0'), 'test/validar.test.js'));
prueba('el ciclo completo', () => igual(archivoPara('probar el ciclo completo crear, leer y borrar'), 'test/gastos.test.js'));
--- solución
function archivoPara(tarea) {
  if (tarea.includes('unitaria')) return 'test/validar.test.js';
  if (tarea.includes('ciclo')) return 'test/gastos.test.js';
  if (tarea.includes('regla')) return 'src/validar.js';
  if (tarea.includes('ruta')) return 'src/app.js';
  if (tarea.includes('puerto')) return 'src/server.js';
  return null;
}
```

```practica
elige :: ¿Qué archivo tiene las reglas de validación? :: `app.js` :: `validar.js` :: `server.js`
elige :: ¿Qué archivo enciende el servidor en el puerto 3000? :: `app.js` :: `validar.js` :: `server.js`
elige :: `gastos.test.js` es una prueba… :: unitaria :: de integración :: E2E
vf :: `app.js` y `server.js` están separados para poder probar la app sin abrir un puerto fijo
```

> 🔁 **Repaso:** reglas (`validar.js`), rutas (`app.js`), arranque (`server.js`), y dos pruebas: unitaria e integración.

## 4. Cómo ejecutarlo

> 🎙️ **El profesor:** a la terminal.

El proyecto está en la carpeta `09-crud-nodejs` del repositorio público de este sitio. Bájalo una sola vez:

```bash
git clone https://github.com/DelvinSmart/estudios.git
cd estudios/09-crud-nodejs
npm install
npm start
```

1. `git clone` → bajar la copia; `cd` → entrar a la carpeta.
2. `npm install` → instalar las librerías (Express). **Solo la primera vez.**
3. `npm start` → encender el servidor.

Debe decir: **`Servidor listo en http://localhost:3000`**. El servidor **queda encendido**, esperando pedidos. Para apagarlo: **Ctrl + C**.

> 🌎 **En la vida real:** entrar al local, comprar los utensilios la primera vez, y abrir la puerta con el cartel de "abierto". Ctrl + C es cerrar la persiana.

> 🌎 **Otro ejemplo:** Como encender una computadora nueva: la primera vez instalas los programas; después solo la prendes.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer los scripts de package.json
lenguaje: js
pide: `npm start` y `npm test` funcionan porque `package.json` tiene una sección `scripts`. Completa `queCorre(paquete, comando)`: para `'npm start'` y `'npm test'` busca `scripts.start` y `scripts.test`; para `'npm run algo'`, busca `scripts.algo`. Si no existe, devuelve `'Missing script: "algo"'` (el error real de npm).
--- código
function queCorre(paquete, comando) {
  // tu código aquí
}
--- pruebas
const paquete = { scripts: { start: 'node src/server.js', test: 'node --test', 'test:watch': 'node --test --watch' } };
prueba('npm start', () => igual(queCorre(paquete, 'npm start'), 'node src/server.js'));
prueba('npm test', () => igual(queCorre(paquete, 'npm test'), 'node --test'));
prueba('npm run test:watch', () => igual(queCorre(paquete, 'npm run test:watch'), 'node --test --watch'));
prueba('un script que no existe', () => igual(queCorre(paquete, 'npm run mostrar'), 'Missing script: "mostrar"'));
--- solución
function queCorre(paquete, comando) {
  const nombre = comando.startsWith('npm run ') ? comando.slice('npm run '.length) : comando.slice('npm '.length);
  return paquete.scripts?.[nombre] ?? `Missing script: "${nombre}"`;
}
```

```practica
elige :: ¿Qué hace `npm install`? :: Enciende el servidor :: Instala las librerías (solo la primera vez) :: Corre las pruebas
elige :: ¿Cómo se apaga el servidor? :: Cerrando el navegador :: Con Ctrl + C en la terminal :: Con `npm stop` siempre
vf :: Después de `npm start`, la terminal queda ocupada con el servidor
```

> 🔁 **Repaso:** `npm install` (una vez), `npm start` (encender), Ctrl + C (apagar).

## 5. Cómo probarlo a mano

> 🎙️ **El profesor:** la primera terminal es el mesero, parado en la puerta. Abre **otra terminal**: esa eres tú, el cliente. Y para hacer pedidos desde la terminal se usa **`curl`**.

**Crear:**

```bash
curl -X POST localhost:3000/gastos -H "Content-Type: application/json" -d '{"descripcion":"Gasolina","monto":120}'
```

Respuesta: `{"id":1,"descripcion":"Gasolina","monto":120}`

Las partes de `curl`:
- `-X POST` → el **verbo**.
- `localhost:3000/gastos` → la **ruta**.
- `-H "Content-Type: application/json"` → un encabezado que dice "te mando JSON".
- `-d '...'` → los **datos**.

**Listar:** `curl localhost:3000/gastos` (sin `-X`, `curl` usa `GET`).

**Ver uno:** `curl localhost:3000/gastos/1`

**Actualizar:**

```bash
curl -X PUT localhost:3000/gastos/1 -H "Content-Type: application/json" -d '{"descripcion":"Gasolina","monto":150}'
```

**Borrar:** `curl -X DELETE localhost:3000/gastos/1`

**Provocar un error a propósito** (monto negativo):

```bash
curl -X POST localhost:3000/gastos -H "Content-Type: application/json" -d '{"descripcion":"Agua","monto":-5}'
```

Respuesta: `{"errores":["El monto debe ser un número mayor que 0."]}`

> 🌎 **En la vida real:** "anote: gasolina, 120" (crear); "muéstreme todo" (listar); "el número 1 no era 120, era 150" (actualizar); "tache el número 1" (borrar); y pedir "agua por menos 5 reales" para que el mesero diga "eso no se puede".

> 🌎 **Otro ejemplo:** `curl` es como pedir por teléfono en vez de ir en persona: haces el mismo pedido, sin entrar a la tienda.

> ✋ **Para y piensa:** creas un gasto, lo borras, y después pides `curl localhost:3000/gastos/1`. ¿Qué crees que responde?

<details>
<summary>Ver la respuesta</summary>

`{"error":"Gasto no encontrado."}`, con el código **404**: ese gasto ya no existe.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Arma el comando curl
lenguaje: js
pide: Completa `armarCurl(verbo, ruta, datos)`: devuelve el comando para la terminal. Con `GET` **no** se pone `-X` (es el verbo por defecto). Con otros verbos, `-X VERBO`. Si hay datos, se agregan `-H 'Content-Type: application/json' -d '…'` con los datos en JSON. El servidor está en `http://localhost:3000`.
--- código
function armarCurl(verbo, ruta, datos) {
  // tu código aquí
}
--- pruebas
prueba('GET sin -X', () => igual(armarCurl('GET', '/gastos'), 'curl http://localhost:3000/gastos'));
prueba('DELETE', () => igual(armarCurl('DELETE', '/gastos/1'), 'curl -X DELETE http://localhost:3000/gastos/1'));
prueba('POST con datos', () => igual(armarCurl('POST', '/gastos', { descripcion: 'Agua', monto: 5 }), `curl -X POST http://localhost:3000/gastos -H 'Content-Type: application/json' -d '{"descripcion":"Agua","monto":5}'`));
--- solución
function armarCurl(verbo, ruta, datos) {
  let comando = 'curl';
  if (verbo !== 'GET') comando += ` -X ${verbo}`;
  comando += ` http://localhost:3000${ruta}`;
  if (datos) comando += ` -H 'Content-Type: application/json' -d '${JSON.stringify(datos)}'`;
  return comando;
}
```

```practica
elige :: En `curl -X PUT ...`, ¿qué es `-X PUT`? :: Los datos :: El verbo :: La ruta
elige :: En `curl`, ¿qué es `-d '{...}'`? :: El verbo :: Los datos que mando :: El puerto
elige :: Sin `-X`, ¿qué verbo usa `curl`? :: POST :: GET :: DELETE
vf :: Para probar con `curl` hace falta otra terminal, porque la primera tiene el servidor
```

> 🔁 **Repaso:** `curl -X VERBO ruta -H "Content-Type: application/json" -d 'datos'`.

## 6. Los códigos de respuesta

> 🎙️ **El profesor:** cada respuesta trae un número de tres cifras. Te los vas a cruzar toda tu vida, así que vale la pena aprender la regla fácil.

| Código | Significa | Cuándo lo devuelve este servidor |
|---|---|---|
| **200** | Todo bien | Al listar, ver o actualizar |
| **201** | **Creado** | Al crear un gasto |
| **204** | Hecho, **sin contenido** | Al borrar |
| **400** | Enviaste datos **inválidos** | Monto negativo, sin descripción |
| **404** | **No existe** | Un id que no está |
| **500** | **Falló el servidor** | Un error del código |

**La regla fácil:** **2xx** = bien; **4xx** = se equivocó **quien pide**; **5xx** = se equivocó **el servidor**.

> 🌎 **En la vida real:** 200 "aquí tiene"; 201 "listo, ya lo anoté"; 204 "hecho" (y no te trae nada); 400 "no entendí su pedido"; 404 "ese plato no existe"; 500 "se nos quemó la cocina".

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los códigos de respuesta
lenguaje: js
pide: Completa `quienSeEquivoco(codigo)`: 2xx → `'nadie'`, 4xx → `'quien pide'`, 5xx → `'el servidor'`. Y `codigoPara(caso)`: `'creado'` → 201, `'borrado'` → 204, `'datos inválidos'` → 400, `'no existe'` → 404, `'bien'` → 200.
--- código
function quienSeEquivoco(codigo) {
  // tu código aquí
}

function codigoPara(caso) {
  // tu código aquí
}
--- pruebas
prueba('201: nadie', () => igual(quienSeEquivoco(201), 'nadie'));
prueba('404: quien pide', () => igual(quienSeEquivoco(404), 'quien pide'));
prueba('500: el servidor', () => igual(quienSeEquivoco(500), 'el servidor'));
prueba('crear bien: 201', () => igual(codigoPara('creado'), 201));
prueba('borrar: 204', () => igual(codigoPara('borrado'), 204));
prueba('monto negativo: 400', () => igual(codigoPara('datos inválidos'), 400));
prueba('id que no existe: 404', () => igual(codigoPara('no existe'), 404));
--- solución
function quienSeEquivoco(codigo) {
  if (codigo >= 500) return 'el servidor';
  if (codigo >= 400) return 'quien pide';
  return 'nadie';
}

const CODIGOS = { bien: 200, creado: 201, borrado: 204, 'datos inválidos': 400, 'no existe': 404 };

function codigoPara(caso) {
  return CODIGOS[caso];
}
```

```practica
elige :: Pides un gasto con un id que no existe. ¿Qué código recibes? :: 400 :: 404 :: 500
elige :: Mandas un monto negativo. ¿Qué código recibes? :: 200 :: 400 :: 404
elige :: Creas un gasto bien. ¿Qué código recibes? :: 200 :: 201 :: 204
elige :: Un error 500 quiere decir… :: Que el usuario se equivocó :: Que falló el servidor :: Que todo salió bien
vf :: Un código 204 trae datos en la respuesta
escribe :: Explica la regla fácil de los códigos de respuesta. :: 2xx es que salió bien, 4xx es que se equivocó quien pide, 5xx es que se equivocó el servidor.
```

> 🔁 **Repaso:** 200 bien, 201 creado, 204 sin contenido, 400 datos inválidos, 404 no existe, 500 falló el servidor.

## 7. Cómo se lee una ruta

> 🎙️ **El profesor:** ahora el código de verdad. La ruta de **crear**, de `src/app.js`. Cinco líneas que hacen todo lo de un CRUD.

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
| — | `app.post('/gastos', ...)`: "cuando llegue un **POST** a **/gastos**, haz esto". Es un `addEventListener`, pero para pedidos (Tema 17). |
| 1 | Revisa los datos con las reglas de `validar.js`. |
| 2 | Si hay errores, responde **400** con la lista, y **termina** (`return`). |
| 3 | Arma el gasto nuevo. `siguienteId++` **usa** el número y **lo sube en uno** para el próximo. |
| 4 | Lo guarda en la lista (`push` = agregar al final). |
| 5 | Responde **201** con el gasto creado. |

- **`req`** (*request*) es lo que **llega**. `req.body` son los datos; `req.params.id` es el número de la ruta (`/gastos/1` → `"1"`, ¡como **texto**!; por eso el código hace `Number(req.params.id)`).
- **`res`** (*response*) es lo que **respondes**. `res.status(201).json(gasto)` = "código 201, y estos datos en JSON".

> 🌎 **En la vida real:** `siguienteId++` es el turnero de la carnicería: te da el 7 y ya deja listo el 8 para el próximo.

> 🌎 **Otro ejemplo:** Como la máquina expendedora: validas el billete, si es falso lo devuelve; si no, te da el producto y un número de operación nuevo.

> ⚠️ **Cuidado:** los datos viven en una **lista en memoria**. Al apagar el servidor, **se borran**. Es una pizarra, no un cuaderno. El ejercicio 4 lo resuelve.

> ✋ **Para y piensa:** si `siguienteId` vale 3 y llega un gasto válido, ¿qué id recibe? ¿Y cuánto vale `siguienteId` después?

<details>
<summary>Ver la respuesta</summary>

El gasto recibe el id **3**, y `siguienteId` queda en **4**. `x++` usa el valor actual y **después** lo sube.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las rutas del CRUD, sin servidor
lenguaje: js
pide: Haz el CRUD de esta parte como funciones, sin Express. Cada una devuelve `{ status, body }` como haría la ruta. Completa `crear` (valida: descripción no vacía y monto > 0; si falla → 400 con `{ errores }`), `verUno` (404 si no existe) y `borrar` (204 si existía, 404 si no). Ojo: `id` llega como **texto**, igual que `req.params.id`.
--- código
function crearAPI() {
  let gastos = [];
  let siguienteId = 1;
  return {
    crear(datos) {
      // tu código aquí
    },
    verUno(id) {
      // tu código aquí
    },
    borrar(id) {
      // tu código aquí
    },
  };
}
--- pruebas
prueba('crear bien: 201 con id', () => { const api = crearAPI(); igual(api.crear({ descripcion: 'Agua', monto: 5 }), { status: 201, body: { id: 1, descripcion: 'Agua', monto: 5 } }); });
prueba('crear mal: 400', () => { const api = crearAPI(); igual(api.crear({ descripcion: '', monto: 5 }).status, 400); });
prueba('ver uno con el id como texto', () => { const api = crearAPI(); api.crear({ descripcion: 'Agua', monto: 5 }); igual(api.verUno('1'), { status: 200, body: { id: 1, descripcion: 'Agua', monto: 5 } }); });
prueba('ver uno que no existe: 404', () => { const api = crearAPI(); igual(api.verUno('9').status, 404); });
prueba('borrar: 204 y después 404', () => { const api = crearAPI(); api.crear({ descripcion: 'Agua', monto: 5 }); igual(api.borrar('1').status, 204); igual(api.verUno('1').status, 404); });
--- solución
function crearAPI() {
  let gastos = [];
  let siguienteId = 1;
  return {
    crear(datos) {
      const errores = [];
      if (typeof datos.descripcion !== 'string' || !datos.descripcion.trim()) errores.push('La descripción es obligatoria.');
      if (typeof datos.monto !== 'number' || datos.monto <= 0) errores.push('El monto debe ser un número mayor que 0.');
      if (errores.length) return { status: 400, body: { errores } };
      const gasto = { id: siguienteId++, descripcion: datos.descripcion.trim(), monto: datos.monto };
      gastos.push(gasto);
      return { status: 201, body: gasto };
    },
    verUno(id) {
      const gasto = gastos.find((g) => g.id === Number(id));
      return gasto ? { status: 200, body: gasto } : { status: 404, body: { error: 'Gasto no encontrado.' } };
    },
    borrar(id) {
      if (!gastos.some((g) => g.id === Number(id))) return { status: 404, body: { error: 'Gasto no encontrado.' } };
      gastos = gastos.filter((g) => g.id !== Number(id));
      return { status: 204, body: null };
    },
  };
}
```

```practica
elige :: ¿Qué es `req.body`? :: Lo que responde el servidor :: Los datos que llegan en la petición :: El número de la ruta
elige :: En `/gastos/7`, ¿qué es `req.params.id`? :: El número 7 :: El texto "7" :: Un error
elige :: Si hay errores de validación, ¿qué responde la ruta de crear? :: 201 :: 400 con la lista de errores :: 404
vf :: Los gastos de este servidor se guardan para siempre
escribe :: Explica las 5 líneas de la ruta de crear. :: Valida los datos; si hay errores responde 400 y termina; arma el gasto con un id nuevo; lo agrega a la lista; y responde 201 con el gasto creado.
```

> 🔁 **Repaso:** validar → si hay errores 400 → armar con id nuevo → `push` → 201. `req` llega, `res` responde.

## 8. Cómo se lee una regla

> 🎙️ **El profesor:** ahora el reglamento, `src/validar.js`.

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

- Empieza con una **lista de errores vacía**.
- `typeof x !== 'string'` → "si **no** es texto". (`typeof` dice de qué tipo es algo: `'string'`, `'number'`…)
- `||` → "o": con que una condición sea cierta, ya es un error.
- `Number.isFinite` → que sea un número **de verdad** (no "infinito" ni "no es un número").
- `datos.monto <= 0` → "menor **o igual** que cero".
- Devuelve la lista: **vacía** si todo está bien.

Es una **función pura**: con los mismos datos, da siempre el mismo resultado, y no toca nada de afuera (ni el servidor ni una base de datos). Por eso se prueba con una **prueba unitaria**, facilísima.

> 🌎 **En la vida real:** el portero de la discoteca con su libreta de problemas: empieza vacía; "¿trajo nombre?"; "¿el monto es un número de verdad y mayor que 0?"; al final entrega la libreta. Vacía = puede pasar.

> 🌎 **Otro ejemplo:** Como la balanza del aeropuerto: revisa el peso y el tamaño de la maleta y te da una lista de problemas, vacía si todo está bien.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una regla nueva en validarGasto
lenguaje: js
pide: Esta es la `validarGasto` del proyecto. Agrega una regla: la descripción no puede pasar de **40 letras** (después de quitar los espacios de las puntas). El error es `'La descripción tiene más de 40 letras.'`. Las reglas viejas tienen que seguir igual.
--- código
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
--- pruebas
prueba('todo bien: lista vacía', () => igual(validarGasto({ descripcion: 'Agua', monto: 5 }), []));
prueba('41 letras: error', () => igual(validarGasto({ descripcion: 'a'.repeat(41), monto: 5 }), ['La descripción tiene más de 40 letras.']));
prueba('40 letras justas: bien (caso de borde)', () => igual(validarGasto({ descripcion: 'a'.repeat(40), monto: 5 }), []));
prueba('los espacios de las puntas no cuentan', () => igual(validarGasto({ descripcion: '  ' + 'a'.repeat(40) + '  ', monto: 5 }), []));
prueba('las reglas viejas siguen', () => igual(validarGasto({ descripcion: '', monto: 0 }).length, 2));
--- solución
function validarGasto(datos) {
  const errores = [];
  if (typeof datos.descripcion !== 'string' || datos.descripcion.trim() === '') {
    errores.push('La descripción es obligatoria.');
  } else if (datos.descripcion.trim().length > 40) {
    errores.push('La descripción tiene más de 40 letras.');
  }
  if (typeof datos.monto !== 'number' || !Number.isFinite(datos.monto) || datos.monto <= 0) {
    errores.push('El monto debe ser un número mayor que 0.');
  }
  return errores;
}
```

```practica
elige :: ¿Qué devuelve `validarGasto` si todo está bien? :: `true` :: Una lista vacía `[]` :: `null`
elige :: `validarGasto({ descripcion: 'Agua', monto: 0 })` devuelve… :: `[]` :: Una lista con un error del monto :: Una lista con dos errores
elige :: `validarGasto({ descripcion: '', monto: -1 })` devuelve… :: Un error :: Dos errores :: Ninguno
vf :: Una función pura da siempre el mismo resultado con los mismos datos
escribe :: ¿Qué es una función pura y por qué es fácil de probar? :: Una función que con los mismos datos da siempre el mismo resultado y no toca nada externo; se prueba llamándola y comparando, sin servidor ni base de datos.
```

> 🔁 **Repaso:** `validarGasto` arma una lista de errores con `typeof`, `Number.isFinite` y `<= 0`. Es pura: se prueba sola.

## 9. Correr las pruebas y sabotear

> 🎙️ **El profesor:** aquí viene una sorpresa, y es la lección más valiosa de esta clase.

```bash
npm test
```

```text
# tests 5
# pass 5
# fail 0
```

Ahora el **sabotaje** (como en el Tema 02): en `src/validar.js`, cambia `datos.monto <= 0` por `datos.monto < 0`. Ahora un gasto de monto **0** sería válido, y eso está mal. Corre `npm test`.

**¿Qué pasa? No falla ninguna prueba.** 😮

No es un error de la clase: es justo lo que el sabotaje vino a descubrir. **Nadie prueba el monto 0.** Las pruebas revisan un monto normal (100) y uno negativo (−5), pero **no el borde**: justo 0.

¿Y la prueba de integración "no crea un gasto inválido", que manda `monto: 0`? Esa manda **también** una descripción vacía. El gasto sigue siendo inválido por la descripción, así que la prueba pasa igual y **no nota** que el monto 0 ya se acepta. Una prueba que mezcla dos errores no te dice cuál detectó.

Es exactamente el Tema 02: **los errores viven en los bordes**, y **un sabotaje que no falla te muestra una prueba que falta**. Tu primera tarea (el ejercicio 0) es escribirla.

**Devuelve el `<=`** cuando termines.

> 🌎 **En la vida real:** un guardia que revisa que no entren menores de 18: comprobó a uno de 15 y a uno de 30, pero nunca a uno de **justo 18**.

> 🌎 **Otro ejemplo:** Como un control de alcoholemia que revisó a quien tomó mucho y a quien no tomó nada, pero nunca a quien está justo en el límite permitido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pruebas que atrapan el sabotaje del borde
lenguaje: js
pide: El sabotaje de esta parte cambia `monto <= 0` por `monto < 0`, y **nada falla** porque falta la prueba del borde. Escribe pruebas para `validarGasto` con el mini Vitest (`it` y `expect(...).toBe(...)`): que un monto de 5 da 0 errores, que un monto **0** da 1 error, y que un monto -1 da 1 error. Las revisiones sabotean la función y tus pruebas tienen que notarlo.
--- código
let SABOTAJE = false;
function validarGasto(datos) {
  const errores = [];
  if (!datos.descripcion) errores.push('La descripción es obligatoria.');
  if (SABOTAJE ? datos.monto < 0 : datos.monto <= 0) errores.push('El monto debe ser un número mayor que 0.');
  return errores;
}

const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const expect = (real) => ({ toBe: (esperado) => { if (real !== esperado) throw new Error(`esperaba ${esperado} y recibió ${real}`); } });

// ✍️ Tus pruebas aquí (usa .length para contar errores):
--- pruebas
const correrTodas = () => misPruebas.filter((p) => { try { p.fn(); return false; } catch { return true; } }).map((p) => p.nombre);
prueba('todas pasan con la función correcta', () => { const f = correrTodas(); ok(misPruebas.length >= 3 && f.length === 0, f.length ? 'fallan: ' + f.join(' | ') : 'escribe al menos 3 pruebas'); });
prueba('notan el sabotaje "< 0"', () => { SABOTAJE = true; const f = correrTodas(); SABOTAJE = false; ok(f.length > 0, 'falta la prueba del monto 0 (el borde)'); });
--- solución
let SABOTAJE = false;
function validarGasto(datos) {
  const errores = [];
  if (!datos.descripcion) errores.push('La descripción es obligatoria.');
  if (SABOTAJE ? datos.monto < 0 : datos.monto <= 0) errores.push('El monto debe ser un número mayor que 0.');
  return errores;
}

const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const expect = (real) => ({ toBe: (esperado) => { if (real !== esperado) throw new Error(`esperaba ${esperado} y recibió ${real}`); } });

it('un monto de 5 es válido', () => { expect(validarGasto({ descripcion: 'Agua', monto: 5 }).length).toBe(0); });
it('el monto 0 no es válido (el borde)', () => { expect(validarGasto({ descripcion: 'Agua', monto: 0 }).length).toBe(1); });
it('un monto negativo no es válido', () => { expect(validarGasto({ descripcion: 'Agua', monto: -1 }).length).toBe(1); });
```

```practica
vf :: Con el sabotaje `< 0`, alguna prueba falla
elige :: ¿Qué enseña el sabotaje que no falla? :: Que las pruebas sobran :: Que falta una prueba del borde (monto 0) :: Que el código está perfecto
elige :: ¿Por qué la prueba de integración con `monto: 0` no lo detecta? :: Porque no corre :: Porque también manda una descripción vacía, y falla por eso :: Porque usa otro puerto
escribe :: ¿Qué es un caso de borde y por qué hay que probarlo? :: Es el valor justo en el límite de una regla (como el monto 0); hay que probarlo porque ahí es donde más se equivoca el código, por ejemplo poner < en vez de <=.
```

> 🔁 **Repaso:** `npm test` da 5 de 5; el sabotaje `< 0` no falla porque nadie prueba el 0. Ese hueco se llena con el ejercicio 0.

## 10. Los ejercicios (uno por día)

> 🎙️ **El profesor:** ahora la tarea grande, **un ejercicio por día**, en orden. Después de cada uno: `npm test`. Intenta **sin mirar** la solución; ábrela solo para corregirte.

> 🌎 **En la vida real:** Es como un plan de entrenamiento de un mes: un ejercicio nuevo por día, y no pasas al siguiente sin dominar el anterior.

### Ejercicio 0: la prueba que falta

> 🌎 **En la vida real:** Es como agregarle al examen la pregunta difícil que faltaba: la del caso justo en el límite.

En `test/validar.test.js`, agrega una prueba que diga que un monto de **0** es inválido.
- Corre `npm test`: debe pasar.
- Haz el sabotaje (`< 0`): **ahora sí** debe fallar tu prueba.
- Devuelve el `<=`.

<details>
<summary>Ver la solución del ejercicio 0</summary>

```js
test('rechaza un monto de 0 (el borde)', () => {
  assert.equal(validarGasto({ descripcion: 'Gasolina', monto: 0 }).length, 1);
});
```

Con `<=`: devuelve 1 error → pasa. Con `< 0`: devuelve 0 errores → **falla** (esperaba 1, recibió 0). Tu prueba ahora protege el borde.

</details>

### Ejercicio 1: un campo obligatorio nuevo

Agrega `categoria` (texto, obligatorio).
- Cambia `validarGasto` para exigirla.
- Cambia las rutas de crear y actualizar para guardarla.
- Agrega pruebas: sin categoría → 400; con categoría → 201.

> 🌎 **En la vida real:** la farmacia empieza a pedir el CPF: la casilla en el formulario (validar), guardarla en la ficha (las rutas), y comprobar que sin CPF no se vende.

<details>
<summary>Ver la solución del ejercicio 1</summary>

En `src/validar.js`, antes del `return`:

```js
  if (typeof datos.categoria !== 'string' || datos.categoria.trim() === '') {
    errores.push('La categoría es obligatoria.');
  }
```

En `src/app.js`, al crear:

```js
    const gasto = {
      id: siguienteId++,
      descripcion: req.body.descripcion.trim(),
      monto: req.body.monto,
      categoria: req.body.categoria.trim(),
    };
```

Y al actualizar, una línea más: `gasto.categoria = req.body.categoria.trim();`

**Ojo:** ahora **todas** las pruebas que crean gastos tienen que mandar `categoria`, o van a fallar con 400. Actualiza `{ descripcion: 'Gasolina', monto: 100 }` → `{ descripcion: 'Gasolina', monto: 100, categoria: 'Auto' }` en las pruebas que esperan un gasto válido. Y agrega:

```js
test('rechaza un gasto sin categoría', () => {
  assert.equal(validarGasto({ descripcion: 'Agua', monto: 3 }).length, 1);
});
```

</details>

### Ejercicio 2: el total

> 🌎 **En la vida real:** Es como la suma al pie de una factura: recorre todos los renglones y te da el total.

Agrega `GET /gastos/total`, que devuelva `{ "total": 123 }` con la suma de todos los montos.
- **Pista:** ponlo **antes** de `GET /gastos/:id`. Después ponlo **después** y mira qué pasa. ¿Por qué?
- Agrega una prueba.

<details>
<summary>Ver la solución del ejercicio 2</summary>

```js
  // READ: el total (va ANTES de /gastos/:id)
  app.get('/gastos/total', (req, res) => {
    const total = gastos.reduce((suma, g) => suma + g.monto, 0);
    res.json({ total });
  });
```

`reduce` es el del Tema 17: empieza en 0 y va sumando cada monto. `{ total }` es un atajo de `{ total: total }`.

**¿Por qué antes?** Express revisa las rutas **en orden**. Si `/gastos/:id` está antes, cuando pides `/gastos/total` Express cree que `total` es un id, busca un gasto con id "total", no lo encuentra, y responde **404**. La ruta fija va antes que la ruta con variable.

Una prueba posible (en `gastos.test.js`):

```js
test('el total suma los montos', async (t) => {
  const { servidor, url } = await arrancar();
  t.after(() => servidor.close());
  await enviar(`${url}/gastos`, 'POST', { descripcion: 'Agua', monto: 3, categoria: 'Casa' });
  await enviar(`${url}/gastos`, 'POST', { descripcion: 'Pan', monto: 7, categoria: 'Casa' });
  const r = await fetch(`${url}/gastos/total`);
  assert.deepEqual(await r.json(), { total: 10 });
});
```

</details>

### Ejercicio 3: pruebas para lo nuevo

> 🌎 **En la vida real:** Es como revisar que cada mueble nuevo de la casa tenga su garantía y su manual.

Revisa que todo lo que agregaste en los ejercicios 1 y 2 tenga pruebas, incluidos los casos de error.

<details>
<summary>Ver qué debería estar probado</summary>

- Gasto sin categoría → error (unitaria) y 400 (integración).
- Gasto con categoría → 201.
- El total con varios gastos (10 en el ejemplo) y **el borde: sin gastos, el total es 0**.
- Que actualizar también exija la categoría (PUT sin categoría → 400).

</details>

### Ejercicio 4: que no se borre al reiniciar

Guarda los gastos en un archivo `gastos.json`.
- **Pista:** `fs.readFileSync` y `fs.writeFileSync` (de la librería `fs` de Node) leen y escriben archivos.
- Apaga y prende el servidor: los gastos deben seguir ahí.

> 🌎 **En la vida real:** pasar de la **pizarra** al **cuaderno**.

<details>
<summary>Ver la solución del ejercicio 4</summary>

Arriba de `src/app.js`:

```js
const fs = require('node:fs');
const ARCHIVO = 'gastos.json';

function cargar() {
  try { return JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')); }
  catch (e) { return []; }   // si el archivo no existe todavía, empezamos vacíos
}

function guardar(gastos) {
  fs.writeFileSync(ARCHIVO, JSON.stringify(gastos, null, 2));
}
```

Dentro de `crearApp`: `let gastos = cargar();` y `let siguienteId = gastos.reduce((max, g) => Math.max(max, g.id), 0) + 1;` (el id siguiente al más alto). Y después de cada cambio (crear, actualizar, borrar), una línea: `guardar(gastos);`.

`JSON.stringify(gastos, null, 2)` guarda el JSON "lindo", con 2 espacios de sangría, para que lo puedas leer.

**Ojo con las pruebas:** ahora las pruebas escribirían en el mismo `gastos.json`. Lo profesional es que `crearApp` reciba el nombre del archivo (`crearApp('gastos-prueba.json')`) y que la prueba use uno aparte y lo borre al final. Ese es justo el camino al ejercicio 5.

</details>

### Ejercicio 5: una base de datos real

Cambia el archivo por una base de datos: SQLite (la más simple), PostgreSQL o Firestore.
- **Pista de arquitectura (Tema 10):** crea un "**repositorio**" con funciones `listar`, `crear`, `actualizar` y `borrar`, igual que el `SanRepository` de Copiloto. Así las rutas no saben qué base de datos hay detrás.

> 🌎 **En la vida real:** el repositorio es un **secretario**: las rutas le dicen "guarde esto" y no les importa si él lo guarda en un cuaderno, en un archivador o en el banco.

<details>
<summary>Ver la idea del ejercicio 5</summary>

```js
// src/repositorio-archivo.js
function crearRepositorioArchivo(archivo) {
  return {
    listar() { /* leer el archivo y devolver la lista */ },
    crear(gasto) { /* agregar y guardar; devolver el gasto con su id */ },
    actualizar(id, datos) { /* cambiar y guardar */ },
    borrar(id) { /* quitar y guardar */ },
  };
}
```

Y `crearApp(repositorio)` usa solo esas cuatro funciones. Mañana haces `crearRepositorioSqlite()` con las **mismas cuatro funciones**, y las rutas **no cambian ni una línea**. Eso es lo que el Tema 10 llama **inversión de dependencias**.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El orden de las rutas importa
lenguaje: js
pide: Express revisa las rutas **en orden** y usa la primera que encaja. `:id` encaja con cualquier cosa, también con `total`. Completa `buscarRuta(rutas, verbo, camino)`: devuelve el `nombre` de la primera ruta que encaja (un pedazo que empieza con `:` encaja con cualquier texto). Después **ordena** la lista `RUTAS` para que `GET /gastos/total` llegue a su ruta.
--- código
const RUTAS = [
  { verbo: 'GET', patron: '/gastos/:id', nombre: 'verUno' },
  { verbo: 'GET', patron: '/gastos/total', nombre: 'total' },
  { verbo: 'GET', patron: '/gastos', nombre: 'listar' },
];

function buscarRuta(rutas, verbo, camino) {
  // tu código aquí
}
--- pruebas
prueba('/gastos lista', () => igual(buscarRuta(RUTAS, 'GET', '/gastos'), 'listar'));
prueba('/gastos/7 ve uno', () => igual(buscarRuta(RUTAS, 'GET', '/gastos/7'), 'verUno'));
prueba('/gastos/total llega al total', () => igual(buscarRuta(RUTAS, 'GET', '/gastos/total'), 'total'));
prueba('el verbo también cuenta', () => igual(buscarRuta(RUTAS, 'DELETE', '/gastos/7'), null));
--- solución
const RUTAS = [
  { verbo: 'GET', patron: '/gastos/total', nombre: 'total' },
  { verbo: 'GET', patron: '/gastos/:id', nombre: 'verUno' },
  { verbo: 'GET', patron: '/gastos', nombre: 'listar' },
];

function buscarRuta(rutas, verbo, camino) {
  const partes = camino.split('/');
  const ruta = rutas.find((r) => {
    if (r.verbo !== verbo) return false;
    const patron = r.patron.split('/');
    return patron.length === partes.length && patron.every((p, i) => p.startsWith(':') || p === partes[i]);
  });
  return ruta ? ruta.nombre : null;
}
```

```practica
elige :: ¿Por qué `GET /gastos/total` va antes que `GET /gastos/:id`? :: Por orden alfabético :: Porque Express revisa las rutas en orden y `:id` tomaría "total" como un id :: Porque es más corta
elige :: ¿Qué hace `fs.writeFileSync`? :: Lee un archivo :: Escribe un archivo :: Borra un archivo
vf :: Al agregar `categoria` obligatoria, las pruebas viejas que no la mandan van a fallar
escribe :: ¿Qué es un repositorio y para qué sirve? :: Una pieza con funciones como listar, crear, actualizar y borrar que esconde dónde se guardan los datos; así las rutas no cambian si cambio la base de datos.
```

> 🔁 **Repaso:** 0) probar el borde; 1) un campo nuevo en validar, rutas y pruebas; 2) una ruta fija antes de la variable; 3) probar lo nuevo; 4) guardar en archivo; 5) un repositorio para cambiar de base de datos sin tocar las rutas.

## Para la entrevista

> 🎙️ **El profesor:** estas preguntas aparecen en casi todas las entrevistas de backend. En voz alta.

> 🌎 **En la vida real:** Explicar un CRUD es como explicar una agenda: anotar, mirar, corregir y borrar.

> 🎤 **Entrevista:** "¿Qué es un CRUD?" y "¿Diferencia entre PUT y PATCH?"

<details>
<summary>Ver buenas respuestas</summary>

"Las cuatro operaciones básicas sobre datos: crear, leer, actualizar y borrar. En una API REST se hacen con POST, GET, PUT y DELETE."

"PUT reemplaza el recurso completo; PATCH cambia solo una parte." (Como cambiar toda la ficha del contacto, o solo su teléfono.)

</details>

> 🎤 **Entrevista:** "¿Por qué validar en el servidor si la app ya valida?"

<details>
<summary>Ver una buena respuesta</summary>

"Porque cualquiera puede llamar a la API sin usar la app. La validación de la app es para la comodidad del usuario; la del servidor es la que protege los datos." (Es la misma idea de las reglas de Firestore del Tema 08.)

</details>

> 🎤 **Entrevista:** "¿Qué código devuelves si los datos están mal? ¿Y si el recurso no existe?" y "Cuéntame de una prueba que encontraste que faltaba."

<details>
<summary>Ver buenas respuestas</summary>

"400 para datos inválidos y 404 si no existe."

"En un CRUD de práctica saboteé la regla del monto cambiando 'menor o igual a cero' por 'menor que cero', y ninguna prueba falló. Así descubrí que nadie probaba el borde, el monto cero, y escribí esa prueba."

</details>

```practica
elige :: ¿Diferencia entre PUT y PATCH? :: Ninguna :: PUT reemplaza todo el recurso; PATCH cambia solo una parte :: PATCH borra el recurso
escribe :: ¿Por qué se valida en el servidor si la app ya valida? :: Porque cualquiera puede llamar a la API sin la app; la validación de la app es comodidad, la del servidor protege los datos.
```

> 🔁 **Repaso final de la clase:** sabes qué es un CRUD y sus verbos, el vocabulario de servidores, cómo está organizado un backend pequeño, cómo encenderlo y probarlo con `curl`, los códigos de respuesta, cómo se lee una ruta y una regla, el sabotaje que descubrió una prueba que faltaba, y tienes cinco ejercicios con solución. Próxima: **Tema 10, Arquitectura**.
