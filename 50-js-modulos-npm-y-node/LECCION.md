# JavaScript 6: módulos, npm y Node.js

> 🌎 **En la vida real:** una cocina profesional está ordenada por estaciones (carnes, postres, ensaladas) y compra muchos ingredientes hechos. Un proyecto de JavaScript se ordena en módulos y usa paquetes de otros.

> 🎙️ **El profesor dice:** hoy: separar el código en archivos con `import` y `export`, qué es **npm** y el `package.json`, la carpeta `node_modules`, los **scripts**, y Node.js para correr JavaScript fuera del navegador. Es lo que hay en la raíz de Copiloto y de casi cualquier proyecto.

## Parte 1. import y export

> 🌎 **En la vida real:** cada capítulo de un libro tiene su tema, y uno puede decir "ver capítulo 3".

> 🌎 **Otro ejemplo:** Es como pedir prestada una herramienta al vecino.

### Exportar e importar

```js
// calculos.js
export function gananciaNeta(bruto, gastos) {
  return bruto - gastos;
}
export const IMPUESTO = 0.15;
export default function resumen() { /* … */ }   // una exportación "principal"
```

```js
// app.js
import resumen, { gananciaNeta, IMPUESTO } from './calculos.js';
```

Con llaves: las exportaciones con nombre. Sin llaves: la `default`. Este mapa está hecho así (`web/app.js` importa de `web/vistas/…`).

> 🌎 **En la vida real:** es como un catálogo: pides cada producto por su nombre (con llaves) o "el producto estrella" (default).

> 🌎 **Otro ejemplo:** Es como una biblioteca: sacas el libro que necesitas, no toda la biblioteca.

```practica
vf :: Para importar una exportación con nombre se usan llaves
vf :: Un archivo puede tener varias exportaciones default
elige :: ¿Cómo importas la exportación default de calculos.js? :: import { default } from ... :: import resumen from './calculos.js' :: require resumen
elige :: ¿Para qué sirve separar el código en módulos? :: Para que sea más lento :: Para ordenarlo por tema y reutilizarlo :: Para esconderlo
escribe :: Escribe cómo exportar la función rendimiento y cómo importarla en otro archivo. :: En utils.js: export function rendimiento(km, litros) { return km / litros; } y en otro: import { rendimiento } from './utils.js';
```

## Parte 2. npm y package.json

> 🌎 **En la vida real:** npm es la ferretería más grande del mundo para JavaScript; `package.json` es tu lista de compras.

> 🌎 **Otro ejemplo:** Es como la tienda de apps del celular, para código.

### Instalar paquetes

```bash
npm init -y                  # crea package.json
npm install date-fns         # instala un paquete (y lo anota en dependencies)
npm install -D vitest        # solo para desarrollo (devDependencies)
npm install                  # instala todo lo anotado (después de clonar un proyecto)
```

El código de los paquetes queda en **`node_modules`**, que **no se sube a Git** (va en `.gitignore`). `package-lock.json` fija las versiones exactas: **ese sí se sube**.

> 🌎 **En la vida real:** `package.json` es la lista de materiales; `node_modules` es el depósito con todo lo comprado (no lo llevas en la mudanza: lo vuelves a comprar con la lista).

> 🌎 **Otro ejemplo:** Es como la receta (se guarda) y los ingredientes (se compran de nuevo).

### Cuidado con lo que instalas

Revisa que el nombre sea exacto y el paquete conocido (Temas 23 e IA 5): hay paquetes falsos con nombres parecidos. Y corre `npm audit` de vez en cuando.

> 🌎 **En la vida real:** compras repuestos en la tienda oficial, no en un puesto con la marca mal escrita.

> 🌎 **Otro ejemplo:** Es como descargar apps solo de la tienda oficial.

```practica
vf :: La carpeta node_modules se sube a GitHub
vf :: package-lock.json se sube a GitHub para fijar las versiones exactas
elige :: ¿Qué hace npm install -D vitest? :: Lo borra :: Lo instala solo para desarrollo (devDependencies) :: Lo publica
elige :: Clonaste un proyecto y no tiene node_modules. ¿Qué corres? :: npm build :: npm install :: git push
escribe :: Explica la diferencia entre package.json y node_modules. :: package.json es la lista de paquetes que el proyecto necesita (se sube a Git); node_modules es la carpeta con el código descargado de esos paquetes (no se sube, se recrea con npm install).
```

## Parte 3. Scripts y Node.js

> 🌎 **En la vida real:** los scripts son los botones de una máquina de café: "expreso", "capuchino". Tocas uno y hace varios pasos.

> 🌎 **Otro ejemplo:** Es como los atajos del celular.

### Los scripts de package.json

```json
{
  "scripts": {
    "dev": "vite",
    "test": "vitest run",
    "build": "vite build"
  }
}
```

```bash
npm run dev
npm test        # test y start no necesitan "run"
```

En Copiloto, `npm test` corre cientos de pruebas (Tema 02).

> 🌎 **En la vida real:** es como el menú del día con nombre: pides "el ejecutivo" y te traen tres platos.

> 🌎 **Otro ejemplo:** Es como un control remoto con botones programados.

### Node.js: JavaScript en el servidor y en la terminal

Node.js corre JavaScript fuera del navegador: servidores (clase 09), herramientas (Vite, ESLint), scripts (este mapa tiene `firebase/generar-reglas.mjs`). Tiene módulos propios: `node:fs` (archivos), `node:path`, `node:http`.

```js
import { readFileSync } from 'node:fs';
const texto = readFileSync('notas.txt', 'utf8');
```

> 🌎 **En la vida real:** es como un chef que, además del restaurante (navegador), cocina en catering (servidor).

> 🌎 **Otro ejemplo:** Es como un músico que toca en vivo y también graba en estudio.

```practica
vf :: npm test corre el script "test" del package.json
vf :: Node.js solo sirve para hacer páginas web en el navegador
elige :: ¿Cómo corres el script "dev"? :: node dev :: npm run dev :: npm dev install
elige :: ¿Qué módulo de Node usas para leer archivos? :: node:http :: node:fs :: node:math
escribe :: ¿Qué hay en la sección scripts de un package.json? :: Comandos con nombre (como dev, test o build) que se corren con npm run nombre y hacen varios pasos.
```

## Parte 4. Ordenar un proyecto

> 🌎 **En la vida real:** una casa ordenada tiene cada cosa en su cuarto: la ropa en el armario, la comida en la cocina.

> 🌎 **Otro ejemplo:** Es como un taller con paredes de herramientas etiquetadas.

### Una estructura típica

```text
mi-proyecto/
  package.json
  src/
    datos/        → cómo se leen y guardan los datos (Firebase, API)
    logica/       → cálculos puros (fáciles de probar)
    pantallas/    → lo que se ve
  tests/          → las pruebas
  .gitignore      → node_modules, .env
```

Es la idea de la clase 10 (arquitectura): separar **datos**, **lógica** y **pantallas**, para que un cambio en uno no rompa los otros.

> 🌎 **En la vida real:** es como separar el depósito, la cocina y el salón en un restaurante.

> 🌎 **Otro ejemplo:** Es como los cajones de una oficina: facturas, contratos y correspondencia.

```practica
vf :: Separar datos, lógica y pantallas hace que un cambio en uno rompa menos a los otros
vf :: Las claves secretas pueden ir en un archivo .env que se sube a GitHub
elige :: ¿En qué carpeta pondrías la función que calcula la ganancia neta? :: pantallas :: logica :: node_modules
elige :: ¿Qué va en .gitignore de un proyecto de JavaScript? :: package.json :: node_modules y .env :: src
escribe :: Propón la estructura de carpetas para una app de gastos del carro. :: src/datos para leer y guardar en Firebase, src/logica para los cálculos, src/pantallas para lo que se ve, tests para las pruebas, y .gitignore con node_modules y .env.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo está organizado un proyecto de JavaScript?":** "En módulos con import y export, separando datos, lógica y pantallas. Las dependencias están en package.json, con package-lock.json para fijar versiones; node_modules y el .env no se suben. Uso scripts de npm para desarrollo, pruebas y build, y Node.js para servidores y herramientas. Antes de instalar algo reviso que sea el paquete oficial."

> 🌎 **En la vida real:** es como mostrar el plano de un taller ordenado.

> 🌎 **Otro ejemplo:** Es como explicar la organización de una cocina profesional.
