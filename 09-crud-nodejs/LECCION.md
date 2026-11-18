# Tema 09: CRUD en Node.js (la tarea grande)

> 🌎 **En la vida real:** hasta ahora estudiaste una tienda que ya existía. Hoy abres tu **propio puesto** pequeño, desde cero: con su mostrador, su cuaderno de ventas y su inspector. Pequeño, pero de verdad.

En este tema vas a hacer un **servidor** pequeño, de verdad, con sus pruebas. Es la base de casi todos los sistemas, y es una de las cosas que más preguntan en las entrevistas.

**Antes de empezar:** Temas 01 a 08.

**Tiempo:** varios días. Es una tarea, no una lectura: haz un ejercicio por día.

## 1. ¿Qué es un CRUD?

> 🌎 **En la vida real:** es todo lo que haces con la **libreta de contactos** del celular:
> - **C (Create / POST)** = agregar un contacto nuevo.
> - **R (Read / GET)** = buscar y mirar un contacto.
> - **U (Update / PUT)** = cambiarle el número porque se compró otro chip.
> - **D (Delete / DELETE)** = borrar a alguien que ya no usas.
>
> Casi cualquier sistema es eso: el banco con tus cuentas, la farmacia con sus remedios, la app Copiloto con los ingresos.

> 🌎 **Otro ejemplo:** Como el inventario de una tienda: agregar productos nuevos, ver qué hay, corregir un precio y sacar lo que ya no se vende.

Son las **4 operaciones básicas** sobre datos:

| Letra | Significa | Verbo HTTP | En este proyecto | En Copiloto |
|---|---|---|---|---|
| **C** | Create (crear) | `POST` | Registrar un gasto | Registrar un ingreso |
| **R** | Read (leer) | `GET` | Ver los gastos | Ver tus ingresos del mes |
| **U** | Update (actualizar) | `PUT` | Corregir un gasto | Editar un ingreso |
| **D** | Delete (borrar) | `DELETE` | Eliminar un gasto | Borrar un ingreso |

Casi todo sistema es esto: Copiloto Driver registra, muestra, edita y borra ingresos y gastos.

## 2. Las palabras

> 🌎 **En la vida real:** todo pasa en un restaurante:
> - **Servidor** = el **mesero** que espera en la puerta de la cocina a que alguien pida algo.
> - **Node.js** = la **cocina** donde se prepara todo (ejecuta JavaScript fuera del navegador).
> - **Express** = un **set de cocina ya armado**: no fabricas tú las ollas.
> - **HTTP** = el **idioma** que hablan el cliente y el mesero.
> - **Ruta** = el **número de mesa** o la sección del menú: `/gastos` es "la sección de gastos", `/gastos/1` es "el gasto número 1".
> - **Petición** = el **pedido**: qué quieres (verbo), de qué sección (ruta) y los detalles ("sin cebolla").
> - **Respuesta** = el **plato** que te traen, con lo que dice el mesero.
> - **JSON** = la **comanda** escrita de una forma que todos entienden: `{ "plato": "milanesa", "cantidad": 2 }`.
> - **Puerto** = la **ventanilla** número 3000 del local: hay muchas ventanillas, y el mesero atiende en esa.
> - **localhost** = "**este mismo local**": no vas a otro restaurante, pides en el tuyo.
> - **API** = el **menú completo**: la lista de todo lo que se puede pedir.

> 🌎 **Otro ejemplo:** En un banco: el servidor es el cajero; la petición, tu trámite; la respuesta, el comprobante; la ruta, la ventanilla; y la API, la lista de trámites posibles.

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

> 🌎 **En la vida real:** es la organización del restaurante:
> - `validar.js` = el **reglamento de la cocina**: "no se aceptan pedidos sin nombre ni con precio negativo".
> - `app.js` = el **menú con sus recetas**: qué se hace con cada pedido. Empieza a leer por aquí.
> - `server.js` = **abrir la puerta** del local a las 8 de la mañana.
> - `validar.test.js` = el inspector que revisa **el reglamento**, solo.
> - `gastos.test.js` = el **cliente misterioso** que entra, pide, come, paga y se va, para ver si todo el recorrido funciona.
>
> ¿Por qué separar "el menú" de "abrir la puerta"? Para que el inspector pueda probar las recetas en una cocina de práctica, sin tener que abrir el local al público.

> 🌎 **Otro ejemplo:** Como un local de comida rápida: el reglamento, el menú con recetas, abrir la persiana, y dos inspectores: uno revisa las reglas y otro hace un pedido completo.

| Archivo | Qué es | Tipo de código |
|---|---|---|
| `src/validar.js` | Las **reglas**: ¿la descripción y el monto son válidos? | Reglas puras (como `utils/` en Copiloto) |
| `src/app.js` | Las **5 rutas** del CRUD. **Empieza por aquí.** | Rutas |
| `src/server.js` | Enciende el servidor en el puerto 3000 | Arranque |
| `test/validar.test.js` | Pruebas **unitarias** de las reglas | Prueba unitaria |
| `test/gastos.test.js` | Prueba de **integración**: el ciclo completo con peticiones reales | Prueba de integración |

¿Por qué `app.js` y `server.js` están separados? Para poder **probar la app sin abrir un puerto fijo**: la prueba arranca el servidor en un puerto libre, prueba y lo apaga. Es la misma idea de separar responsabilidades del Tema 10.

## 4. Cómo ejecutarlo

> 🌎 **En la vida real:** 1. `cd` = **entrar** al local.
> 2. `npm install` = **comprar los utensilios** la primera vez (después ya están).
> 3. `npm start` = **abrir la puerta** y poner el cartel de "abierto".
> 4. El mensaje "Servidor listo" = el cartel encendido.
>
> **Ctrl + C** = cerrar la persiana al final del día.

> 🌎 **Otro ejemplo:** Como encender una computadora nueva: la primera vez instalas los programas; después solo la prendes.

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

> 🌎 **En la vida real:** abres **otra** terminal porque la primera es el mesero parado en la puerta: está ocupado esperando pedidos. La segunda terminal eres **tú, el cliente**, y `curl` es tu forma de hacer pedidos.
> - **Crear** = "anote: gasolina, 120".
> - **Listar** = "muéstreme todo lo que tengo anotado".
> - **Ver uno** = "muéstreme el número 1".
> - **Actualizar** = "el número 1 no era 120, era 150".
> - **Borrar** = "tache el número 1".
> - **Error a propósito** = pedir "agua por menos 5 reales": el mesero te dice "eso no se puede".
>
> Las partes de `curl` son como una carta: `-X` es **qué** pides, `-H` es el sobre que dice "adentro va una comanda", `-d` es la comanda en sí.

> 🌎 **Otro ejemplo:** `curl` es como pedir por teléfono en vez de ir en persona: haces el mismo pedido sin entrar a la tienda.

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

> 🌎 **En la vida real:** es lo que te dice el mesero:
> - **200** = "aquí tiene".
> - **201** = "listo, ya lo anoté" (algo **nuevo** creado).
> - **204** = "hecho", y no te trae nada, como cuando le pides que retire un plato.
> - **400** = "no entendí su pedido": pediste "milanesa por −5 reales". El error es **del cliente**.
> - **404** = "ese plato no existe en el menú".
> - **500** = "se nos quemó la cocina". El error es **del restaurante**.
>
> Regla fácil: 2xx = bien; 4xx = te equivocaste tú; 5xx = se equivocaron ellos.

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

> 🌎 **En la vida real:** es la receta que sigue el mesero cuando alguien dice "anote un gasto nuevo":
> 1. Revisa la comanda con el reglamento.
> 2. Si hay algo mal, devuelve la comanda con un papel: "400: falta esto", y no sigue.
> 3. Arma la ficha nueva y le pone el número del **turnero** (`siguienteId++`), como la máquina de números de la carnicería: te da el 7 y ya deja listo el 8 para el próximo.
> 4. Pincha la ficha en el gancho (`push` = al final de la fila).
> 5. Responde "201, anotado" y te muestra la ficha.
>
> `req` es lo que te **trae** el cliente; `res` es lo que le **devuelves**.
>
> **Ojo**: guardar en memoria es como anotar en una **pizarra**. Al cerrar el local (apagar el servidor), alguien la borra. Por eso el ejercicio 4 lo pasa a un cuaderno.

> 🌎 **Otro ejemplo:** Como la máquina expendedora: valida el billete, si es falso lo devuelve; si no, te da el producto y un número de operación nuevo.

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

> 🌎 **En la vida real:** es el portero de la discoteca con su lista:
> - Empieza con la libreta de "problemas" vacía.
> - "¿Trajo nombre?" Si no, anota: "falta la descripción".
> - "¿El monto es un número de verdad y mayor que 0?" Si no, anota: "monto inválido". `Number.isFinite` es comprobar que el billete no sea de juguete.
> - Al final entrega la libreta. Vacía = puede pasar.
>
> Es una **función pura**: como una calculadora de bolsillo. No toca la caja, no llama a nadie; con los mismos números da siempre el mismo resultado. Por eso es facilísima de probar.

> 🌎 **Otro ejemplo:** Como la balanza del aeropuerto: revisa el peso y el tamaño de la maleta y te da una lista de problemas, vacía si todo está bien.

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

> 🌎 **En la vida real:** es como esconder un billete falso en la caja para ver si el cajero se da cuenta. Cambias "mayor que 0" por "no negativo", y el cajero **no se da cuenta**: nadie le enseñó a revisar el monto **exactamente cero**.
>
> Es como un guardia que revisa a menores de 18 años: comprobó a uno de 15 y a uno de 30, pero nunca a uno de **justo 18**. El sabotaje que no falla te muestra el agujero en la vigilancia.

> 🌎 **Otro ejemplo:** Como un control de alcoholemia que revisó a quien tomó mucho y a quien no tomó nada, pero nunca a quien está justo en el límite.

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

> 🌎 **En la vida real:** es como aprender a cocinar: un plato por día, no los diez del menú en una tarde. Después de cada uno, el jefe de cocina (Claude) lo prueba.

Haz **un** ejercicio por día, en este orden. Después de cada uno, corre `npm test` y muéstrale tu código a Claude.

### Ejercicio 0: la prueba que falta

> 🌎 **En la vida real:** es enseñarle al guardia a revisar justo a la persona de 18 años. Después vuelves a esconder el billete falso: ahora **sí** lo tiene que encontrar.
En `test/validar.test.js`, agrega una prueba que diga que un monto de **0** es inválido.
- Corre `npm test`: debe pasar.
- Haz el sabotaje (`< 0`): **ahora sí** debe fallar tu prueba.
- Devuelve el `<=`.

### Ejercicio 1: un campo obligatorio nuevo

> 🌎 **En la vida real:** es como cuando la farmacia empieza a pedir el CPF en cada compra: hay que agregar la casilla en el formulario (validar), guardarla en la ficha (las rutas) y comprobar que sin CPF no se vende (400) y con CPF sí (201).
Agrega `categoria` (texto, obligatorio).
- Cambia `validarGasto` para exigirla.
- Cambia las rutas de crear y actualizar para guardarla.
- Agrega pruebas: sin categoría → 400; con categoría → 201.

### Ejercicio 2: el total

> 🌎 **En la vida real:** es la suma al final del ticket del supermercado.
>
> La pista del orden es como los carteles de una autopista: si el primer cartel dice "todas las salidas hacia cualquier lugar → salida 1", nunca llegas al cartel siguiente que decía "aeropuerto → salida 2". La regla más específica tiene que ir primero.
Agrega `GET /gastos/total`, que devuelva `{ "total": 123 }` con la suma de todos los montos.
- **Pista:** ponlo **antes** de `GET /gastos/:id`. Después ponlo **después** y mira qué pasa. ¿Por qué?
- Agrega una prueba.

### Ejercicio 3: pruebas para lo nuevo

> 🌎 **En la vida real:** cada mueble nuevo de la casa necesita su revisión: si agregaste un enchufe, alguien tiene que comprobar que no da corriente donde no debe.
Revisa que todo lo que agregaste en los ejercicios 1 y 2 tenga pruebas, incluidos los casos de error.

### Ejercicio 4: que no se borre al reiniciar

> 🌎 **En la vida real:** es pasar de la **pizarra** al **cuaderno**. La pizarra se borra cuando cierras; el cuaderno queda en el cajón y al otro día abres y ahí está todo. `readFileSync` es abrir el cuaderno; `writeFileSync` es escribir en él.
Guarda los gastos en un archivo `gastos.json`.
- **Pista:** `fs.readFileSync` y `fs.writeFileSync` (de la librería `fs` de Node) leen y escriben archivos.
- Apaga y prende el servidor: los gastos deben seguir ahí.

### Ejercicio 5: una base de datos real

> 🌎 **En la vida real:** es pasar del cuaderno al **archivo de un banco**: aguanta millones de fichas y varias personas a la vez.
>
> El "repositorio" es como un **secretario**: las rutas le dicen "guarde esto" y no les importa si él lo guarda en un cuaderno, en un archivador o en el banco. Si mañana cambias de archivador, solo el secretario se entera.
Cambia el archivo por una base de datos: SQLite (la más simple), PostgreSQL o Firestore.
- **Pista de arquitectura (Tema 10):** crea un "repositorio" con funciones `listar`, `crear`, `actualizar` y `borrar`, igual que el `SanRepository` de Copiloto. Así las rutas no saben qué base de datos hay detrás.

## Respuesta de la pista del ejercicio 2

> 🌎 **En la vida real:** es la autopista de la pista: Express lee los carteles en orden y toma el primero que le sirve. Si `/gastos/:id` ("cualquier cosa") está antes, "total" le parece un número de gasto, lo busca, no lo encuentra y dice 404.

<details>
<summary>Ver respuesta</summary>

Express revisa las rutas **en orden**. Si `/gastos/:id` está antes, cuando pides `/gastos/total` Express cree que `total` es un id, busca un gasto con id "total", no lo encuentra y responde 404. Por eso la ruta fija (`/gastos/total`) va antes que la ruta con variable (`/gastos/:id`).

</details>

## Para la entrevista

> 🌎 **En la vida real:** explícalo con la libreta de contactos (crear, mirar, cambiar, borrar).
> - **PUT vs. PATCH**: PUT es cambiar **toda** la ficha del contacto por una nueva; PATCH es cambiar **solo** el número de teléfono.
> - **¿Por qué validar en el servidor?** La app es el formulario bonito en la recepción; pero alguien puede entrar por la puerta de atrás (llamar a la API directo). El guardia de adentro (el servidor) es el que de verdad protege.
> - **400 / 404**: "pedido mal hecho" / "no existe".

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
