# Node.js 2: archivos, carpetas y datos

> 🌎 **En la vida real:** un programa que no guarda nada es como una libreta que se borra al cerrarla. Con Node puedes leer y escribir archivos en tu computadora o en el servidor.

> 🎙️ **El profesor dice:** hoy: leer y escribir archivos con `node:fs/promises`, armar rutas con `node:path`, trabajar con JSON y CSV, y manejar los errores de archivos. Al final armas un script que lee los gastos de la semana y escribe un resumen.

## Parte 1. Leer y escribir archivos

> 🌎 **En la vida real:** es como abrir un cajón, sacar una carpeta, leerla y guardar una hoja nueva.

> 🌎 **Otro ejemplo:** Es como tu libreta de gastos: la lees y le agregas renglones.

### fs/promises con async/await

```js
import { readFile, writeFile, appendFile, mkdir, readdir } from 'node:fs/promises';

const texto = await readFile('notas.txt', 'utf8');            // leer todo
await writeFile('resumen.txt', 'Total: 95.50\n', 'utf8');     // escribir (borra lo anterior)
await appendFile('registro.log', `${new Date().toISOString()} listo\n`);   // agregar al final
await mkdir('salida', { recursive: true });                    // crear carpeta (y las de arriba)
const archivos = await readdir('.');                            // listar una carpeta
```

Siempre `'utf8'` para que las tildes y la ñ salgan bien (igual que en Python 5).

> 🌎 **En la vida real:** `writeFile` es escribir en una hoja nueva; `appendFile` es agregar un renglón al final.

> 🌎 **Otro ejemplo:** Es como un cuaderno: arrancas hoja nueva o sigues donde quedaste.

### Archivos muy grandes: streams

`readFile` carga **todo** el archivo en memoria de una vez. Para un JSON de gastos está bien. Para un archivo de 2 GB (un video, un registro de un año entero), llenarías la memoria. Para eso existe el **stream** ("flujo"): leer o escribir **por pedazos**, uno detrás de otro.

```js
import { createReadStream } from 'node:fs';

let lineas = 0;
for await (const pedazo of createReadStream('registro-grande.txt', 'utf8')) {
  lineas += pedazo.split('\n').length - 1; // cada pedazo se usa y se suelta
}
console.log(lineas);
```

> 🌎 **En la vida real:** `readFile` es llenar un balde entero y cargarlo; un stream es la manguera: el agua pasa de a poco y nunca cargas el peso de todo junto.

### Errores de archivos

```js
try {
  const datos = await readFile('no-existe.json', 'utf8');
} catch (error) {
  if (error.code === 'ENOENT') console.error('Ese archivo no existe');
  else throw error;    // otro error: no lo escondas
}
```

`ENOENT` = no existe; `EACCES` = no tienes permiso. Atrapa el error que sabes manejar y deja pasar el resto (como en Python 5).

> 🌎 **En la vida real:** si el cajón está vacío, lo dices; si está con llave, es otro problema distinto.

> 🌎 **Otro ejemplo:** Es como distinguir "no hay stock" de "la tienda está cerrada".

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Manejar el error que conoces
lenguaje: js
pide: `readFile` lanza un error con `code`. Completa la función `async` `leerConfig(leer)`: llama a `await leer('config.json')` y devuelve el JSON. Si el error es `ENOENT` (no existe), devuelve la configuración por defecto `{ moneda: 'BRL' }`. **Cualquier otro error** déjalo pasar (no lo escondas).
--- código
async function leerConfig(leer) {
  // tu código aquí
}
--- pruebas
const error = (code) => Object.assign(new Error(code), { code });
prueba('existe', async () => igual(await leerConfig(async () => '{"moneda":"USD"}'), { moneda: 'USD' }));
prueba('no existe: por defecto', async () => igual(await leerConfig(async () => { throw error('ENOENT'); }), { moneda: 'BRL' }));
prueba('sin permiso: el error sigue', async () => { let c = ''; try { await leerConfig(async () => { throw error('EACCES'); }); } catch (e) { c = e.code; } igual(c, 'EACCES'); });
--- solución
async function leerConfig(leer) {
  try {
    return JSON.parse(await leer('config.json'));
  } catch (error) {
    if (error.code === 'ENOENT') return { moneda: 'BRL' };
    throw error;
  }
}
```

```practica
vf :: writeFile borra lo que había y escribe lo nuevo
vf :: ENOENT significa que no tienes permiso para leer el archivo
elige :: ¿Qué opción de mkdir crea también las carpetas de arriba? :: { all: true } :: { recursive: true } :: { force: true }
elige :: ¿Por qué se pasa 'utf8' al leer? :: Para que sea más rápido :: Para recibir texto con tildes y ñ bien, en vez de bytes :: Para cifrar
escribe :: Escribe cómo agregar la línea "Lavar el carro" al final de tareas.txt. :: await appendFile('tareas.txt', 'Lavar el carro\n', 'utf8');
```

## Parte 2. Rutas con node:path

> 🌎 **En la vida real:** una dirección mal escrita te lleva a otra casa. `path` escribe las direcciones de carpetas sin errores.

> 🌎 **Otro ejemplo:** Es como el GPS que arma el camino por ti.

### Unir y separar rutas

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));   // la carpeta de ESTE archivo
const archivo = path.join(aqui, 'datos', 'semana.csv');       // une con la barra correcta
path.extname('semana.csv');    // '.csv'
path.basename(archivo);        // 'semana.csv'
```

Usa la carpeta del archivo (`aqui`) y no "donde estés parado en la terminal": así el script funciona lo corras desde donde lo corras. Es lo que hace `firebase/partes.mjs` de este repositorio.

> 🌎 **En la vida real:** es como dar la dirección desde un punto fijo (la plaza) y no desde "donde estés ahora".

> 🌎 **Otro ejemplo:** Es como las coordenadas de un mapa en vez de "a dos cuadras de aquí".

### Nunca confíes en una ruta que llega de afuera

Si un usuario manda `../../secretos.env` como nombre de archivo, podría leer cosas que no debe (**path traversal**). Valida: solo nombres simples, o comprueba que la ruta final quede dentro de tu carpeta.

> 🌎 **En la vida real:** si alguien te pide "tráeme lo del cajón de al lado del de al lado", revisas antes de ir.

> 🌎 **Otro ejemplo:** Es como el portero que no deja subir a otro piso que el que dice tu invitación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Que nadie lea ../../secretos.env
lenguaje: js
pide: Un usuario manda el nombre del archivo que quiere bajar. Completa `nombreSeguro(nombre)`: devuelve el nombre si es **simple** (solo letras, números, `-`, `_` y un punto antes de la extensión, como `semana-11.csv`), o `null` si trae barras, `..`, empieza con punto, o está vacío. Y `extension(nombre)` como `path.extname`: `'.csv'`, o `''` si no tiene.
--- código
function nombreSeguro(nombre) {
  // tu código aquí
}

function extension(nombre) {
  // tu código aquí
}
--- pruebas
prueba('un nombre simple', () => igual(nombreSeguro('semana-11.csv'), 'semana-11.csv'));
prueba('path traversal', () => igual(nombreSeguro('../../secretos.env'), null));
prueba('con barra', () => igual(nombreSeguro('datos/semana.csv'), null));
prueba('oculto', () => igual(nombreSeguro('.env'), null));
prueba('vacío', () => igual(nombreSeguro(''), null));
prueba('extensión', () => igual([extension('semana.csv'), extension('README')], ['.csv', '']));
--- solución
function nombreSeguro(nombre) {
  return /^[A-Za-z0-9_-]+(\.[A-Za-z0-9]+)?$/.test(nombre) ? nombre : null;
}

function extension(nombre) {
  const i = nombre.lastIndexOf('.');
  return i > 0 ? nombre.slice(i) : '';
}
```

```practica
vf :: path.join une partes de una ruta con la barra correcta del sistema
vf :: Es seguro usar directamente un nombre de archivo que manda un usuario
elige :: ¿Qué da path.extname('semana.csv')? :: 'semana' :: '.csv' :: 'csv/semana'
elige :: ¿Por qué usar la carpeta del archivo (import.meta.url) para armar rutas? :: Es más bonito :: Para que el script funcione lo corras desde donde lo corras :: Es obligatorio
escribe :: ¿Qué es path traversal y cómo lo evitas? :: Es mandar una ruta con ../ para salir de la carpeta permitida y leer otros archivos; lo evito aceptando solo nombres simples o comprobando que la ruta final quede dentro de mi carpeta.
```

## Parte 3. JSON, CSV y un script real

> 🌎 **En la vida real:** JSON es la ficha con campos; CSV es la planilla con columnas.

> 🌎 **Otro ejemplo:** Es como una carpeta de fichas frente a una hoja de cálculo.

### Leer y guardar JSON

```js
const datos = JSON.parse(await readFile('datos.json', 'utf8'));
datos.gastos.push({ tipo: 'peaje', valor: 12.5 });
await writeFile('datos.json', JSON.stringify(datos, null, 2), 'utf8');   // 2 = con sangría, legible
```

> 🌎 **En la vida real:** es como sacar una ficha, agregar un dato y devolverla ordenada.

> 🌎 **Otro ejemplo:** Es como desempacar, agregar algo y volver a empacar.

### El resumen de la semana en Node

```js
// resumen.mjs — node resumen.mjs semana.csv
import { readFile, writeFile } from 'node:fs/promises';

const [encabezado, ...filas] = (await readFile(process.argv[2], 'utf8')).trim().split('\n');
const columnas = encabezado.split(',');
const movimientos = filas.map((f) => Object.fromEntries(f.split(',').map((v, i) => [columnas[i], v])));

const suma = (tipo) => movimientos.filter((m) => m.tipo === tipo).reduce((s, m) => s + Number(m.valor), 0);
const resumen = { ganado: suma('viaje'), gastado: suma('gasto') };
resumen.neto = Math.round((resumen.ganado - resumen.gastado) * 100) / 100;

await writeFile('resumen.json', JSON.stringify(resumen, null, 2), 'utf8');
console.log(resumen);
```

Es el mismo proyecto que hiciste en Python 8, ahora en Node: los conceptos no cambian de lenguaje. (Para CSV con comas dentro de los textos, usa un paquete como `csv-parse`.)

> 🌎 **En la vida real:** es la misma receta cocinada en otra cocina.

> 🌎 **Otro ejemplo:** Es como la misma canción tocada con otro instrumento.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El resumen de la semana desde un CSV
lenguaje: js
pide: Completa `resumir(csv)`: la primera línea es el encabezado (`fecha,tipo,valor`); cada fila es un movimiento. Devuelve `{ ganado, gastado, neto }` (los `viaje` suman a ganado, los `gasto` a gastado; neto redondeado a 2 decimales). Y `aJson(resumen)`: el texto con sangría de 2 espacios, como se guarda en `resumen.json`.
--- código
function resumir(csv) {
  // tu código aquí
}

function aJson(resumen) {
  // tu código aquí
}
--- pruebas
const csv = 'fecha,tipo,valor\n2026-11-16,viaje,120.5\n2026-11-16,gasto,40.25\n2026-11-17,viaje,80\n';
prueba('el resumen', () => igual(resumir(csv), { ganado: 200.5, gastado: 40.25, neto: 160.25 }));
prueba('sin filas', () => igual(resumir('fecha,tipo,valor\n'), { ganado: 0, gastado: 0, neto: 0 }));
prueba('el JSON legible', () => igual(aJson({ neto: 1 }), '{\n  "neto": 1\n}'));
--- solución
function resumir(csv) {
  const [encabezado, ...filas] = csv.trim().split('\n');
  const columnas = encabezado.split(',');
  const movimientos = filas.map((f) => Object.fromEntries(f.split(',').map((v, i) => [columnas[i], v])));
  const suma = (tipo) => movimientos.filter((m) => m.tipo === tipo).reduce((s, m) => s + Number(m.valor), 0);
  const ganado = suma('viaje');
  const gastado = suma('gasto');
  return { ganado, gastado, neto: Math.round((ganado - gastado) * 100) / 100 };
}

function aJson(resumen) {
  return JSON.stringify(resumen, null, 2);
}
```

```practica
vf :: JSON.stringify(datos, null, 2) guarda el JSON con sangría, fácil de leer
vf :: Para CSV con comas dentro de los textos, partir con split(',') siempre funciona bien
elige :: ¿Qué hace Object.fromEntries en el script? :: Borra columnas :: Arma un objeto con cada columna y su valor :: Suma los valores
elige :: ¿Por qué Number(m.valor) en la suma? :: Por estilo :: Porque lo que se lee del CSV es texto :: Para redondear
escribe :: ¿Qué tiene en común este script con el proyecto de Python 8? :: Hacen lo mismo: leen los movimientos de un CSV, suman lo ganado y lo gastado y calculan el neto; solo cambia el lenguaje.
```


**Comprobación antes de seguir**

Explica cómo distinguirías una ruta equivocada, un archivo inexistente y un JSON inválido.

<details>
<summary>Necesito una pista</summary>

Primero comprueba desde qué carpeta se resuelve la ruta. Después separa el paso de leer del paso de interpretar.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con archivos en Node?":** "Con node:fs/promises y async/await, siempre en utf8. Manejo los errores por su código, como ENOENT, sin esconder los demás. Armo rutas con node:path desde la carpeta del propio archivo, y nunca uso directo un nombre de archivo que manda un usuario, para evitar path traversal. Para datos uso JSON con JSON.parse y JSON.stringify, y para CSV complicados un paquete probado."

> 🌎 **En la vida real:** es como un archivista que explica cómo guarda, busca y protege los documentos.

> 🌎 **Otro ejemplo:** Es como un bibliotecario que sabe dónde va cada libro y quién puede sacarlo.
