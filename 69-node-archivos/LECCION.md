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

```practica
vf :: JSON.stringify(datos, null, 2) guarda el JSON con sangría, fácil de leer
vf :: Para CSV con comas dentro de los textos, partir con split(',') siempre funciona bien
elige :: ¿Qué hace Object.fromEntries en el script? :: Borra columnas :: Arma un objeto con cada columna y su valor :: Suma los valores
elige :: ¿Por qué Number(m.valor) en la suma? :: Por estilo :: Porque lo que se lee del CSV es texto :: Para redondear
escribe :: ¿Qué tiene en común este script con el proyecto de Python 8? :: Hacen lo mismo: leen los movimientos de un CSV, suman lo ganado y lo gastado y calculan el neto; solo cambia el lenguaje.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con archivos en Node?":** "Con node:fs/promises y async/await, siempre en utf8. Manejo los errores por su código, como ENOENT, sin esconder los demás. Armo rutas con node:path desde la carpeta del propio archivo, y nunca uso directo un nombre de archivo que manda un usuario, para evitar path traversal. Para datos uso JSON con JSON.parse y JSON.stringify, y para CSV complicados un paquete probado."

> 🌎 **En la vida real:** es como un archivista que explica cómo guarda, busca y protege los documentos.

> 🌎 **Otro ejemplo:** Es como un bibliotecario que sabe dónde va cada libro y quién puede sacarlo.
