# Cómo hice la web de Copiloto Driver

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. La [lección](LECCION.md) es el resumen, y [Para la entrevista](EXPLICACIONES-PARA-ENTREVISTA.md) tiene las frases cortas.

**Cómo estudiarla:** una parte por día. Si tienes la app, abre `copiloto-driver/webapp` al lado. Es la clase que junta **todo**: React, TypeScript, Firebase, arquitectura hexagonal, motores de diseño y pruebas.

**Lo que necesitas saber antes:** Temas 01 a 10, y 15 a 17.

## 1. La idea en una frase

> 🎙️ **El profesor:** {{alumno}}, Copiloto vive en el teléfono. Un día hizo falta que la persona pudiera ver sus números **en la computadora**, con la misma cuenta. Hacer una web es fácil… lo difícil es hacerla **sin copiar la app**. Esta clase es la historia de cómo se logró, y es de lo que más te puede lucir en una entrevista.

> 🌎 **En la vida real:** Es como un banco que tiene app y página web: tu saldo es uno solo; las dos pantallas lo muestran igual porque leen la misma cuenta.

> 🌎 **Otro ejemplo:** Es como un programa de radio que también se transmite por internet: el locutor y las noticias son los mismos, cambia por dónde lo escuchas.

### Qué es

> 🌎 **En la vida real:** Es como la versión de escritorio de WhatsApp: entras con tu misma cuenta y ves tus mismas conversaciones, en una pantalla más grande.

> 🌎 **Otro ejemplo:** Es como mirar la libreta del carro en la mesa de la cocina en vez de en la guantera: los mismos datos, más cómodo para leer.

La página web de Copiloto Driver. La persona entra con **la misma cuenta del teléfono** y ve en la computadora: ganancias, gastos, ganancia neta, combustible, San, Mi cartera, el Copiloto y el menú. Todo en una pantalla, sin bajar.

### La decisión más importante

> **La web no copia la app: la usa.** Los cálculos, los textos en 6 idiomas, las reglas y el guardado en la nube son **los MISMOS archivos** de la app. La web solo pone la pantalla.

**¿Por qué importa tanto?** Si mañana cambia cómo se calcula la ganancia neta, se cambia **en un solo lugar**, y el teléfono y la web dan el mismo número. Si la web tuviera sus propios cálculos, tarde o temprano darían **números distintos**, y la persona no sabría cuál creer.

> 🌎 **En la vida real:** un restaurante con **dos comedores** (uno chico, el teléfono; uno grande, la computadora) y **una sola cocina**. Si el cocinero cambia una receta, sale igual en los dos comedores.

> 🌎 **Otro ejemplo:** Como una fábrica de ropa con dos tiendas: las prendas salen del mismo taller; si se corrige una costura, se corrige para las dos tiendas.

> 💡 **Idea:** es la misma idea del Tema 12 ("contenido separado del código") y del Tema 18 ("una sola fuente de verdad"), aplicada a una app grande.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una sola calculadora para los dos
lenguaje: js
pide: "La web no copia la app, la usa". Aquí la web tiene **su propia copia** del cálculo de la ganancia, y se desvió. Borra la copia: haz que `gananciaWeb` **use** `gananciaApp` (la de la app), para que nunca vuelvan a dar distinto.
--- código
function gananciaApp(ingresos, gastos) {
  return Math.round((ingresos - gastos) * 100) / 100;
}

function gananciaWeb(ingresos, gastos) {
  return Math.floor(ingresos - gastos); // una copia vieja que se desvió
}
--- pruebas
prueba('los dos dan lo mismo con centavos', () => igual(gananciaWeb(100.75, 20.5), gananciaApp(100.75, 20.5)));
prueba('80.25', () => igual(gananciaWeb(100.75, 20.5), 80.25));
prueba('la web llama a la app', () => ok(gananciaWeb.toString().includes('gananciaApp'), 'gananciaWeb tiene que usar gananciaApp'));
--- solución
function gananciaApp(ingresos, gastos) {
  return Math.round((ingresos - gastos) * 100) / 100;
}

function gananciaWeb(ingresos, gastos) {
  return gananciaApp(ingresos, gastos);
}
```

```practica
escribe :: ¿Qué significa "la web no copia la app, la usa"? :: Que la web usa los mismos archivos de la app (cálculos, textos, reglas, nube) en vez de tener copias; la web solo pone la pantalla.
escribe :: ¿Qué problema evita que los cálculos estén en un solo lugar? :: Que el teléfono y la web den números distintos para lo mismo.
vf :: La web tiene sus propios cálculos de ganancias, separados de la app
vf :: La persona entra a la web con la misma cuenta del teléfono
```

> 🔁 **Repaso:** la web no copia la app, la usa: un solo lugar para cálculos, textos y reglas; la web solo pone la pantalla.

## 2. Las tecnologías

> 🎙️ **El profesor:** a diferencia de la página de estudios (Tema 12), esta web es **grande** y comparte código con la app. Por eso sí usa herramientas. Te las presento como el equipo de una obra.

> 🌎 **Otro ejemplo:** Como el equipo de una mudanza: cajas iguales para todo (React), el que revisa que cada mueble entre por la puerta (TypeScript), el camión (Vite), las etiquetas de cada caja (Tailwind) y el depósito de siempre (Firebase).

| Tecnología | Qué es | Para qué la usa la web | 🌎 En la obra |
|---|---|---|---|
| **React** (versión 19) | Una librería para armar pantallas con piezas (**componentes**) | Cada recuadro es una pieza: `StatCard`, `WeekBars`, `DonutRing`… | Bloques prefabricados |
| **TypeScript** | JavaScript con **tipos** (Tema 01) | Avisa errores **antes** de abrir la página | El inspector de medidas |
| **Vite** | El "motor de arranque": la sirve mientras programas y la arma para publicar | `npm run dev` la abre en `localhost:5180`; `npm run build` la arma en `dist` | La grúa y el camión |
| **Tailwind CSS** | CSS escrito como clases cortas en el HTML | `flex gap-3 rounded-lg` en vez de un archivo CSS por caja | Etiquetas de instrucciones en cada pieza |
| **PostCSS** y **Autoprefixer** | Ayudantes del CSS | Convierten Tailwind en CSS normal para todos los navegadores | El traductor |
| **lucide-react** | Un paquete de íconos | La bomba de gasolina, el reloj… | La caja de señales |
| **Firebase** | La nube de Google, **la misma** de la app (Tema 08) | Entrar, leer y guardar, preguntar al Copiloto | El mismo depósito |
| **Vitest** | Pruebas automáticas (como Jest) | Revisa los cálculos de las pantallas | El inspector de cuentas |
| **Open-Meteo** | Un servicio gratis del clima | Los grados del encabezado | El vecino que te dice el tiempo |

### ¿Por qué la web puede usar código de la app?

La app del teléfono está hecha con **React Native** ("React para teléfonos") y **Expo**. Los dos hablan **React y TypeScript**. Por eso la web puede usar tanto de la app.

Lo que **no** puede usar son las piezas que **solo existen en el teléfono**: la cámara, el GPS del aparato, el almacenamiento del teléfono. Eso se resuelve en la parte 5.

> 🌎 **En la vida real:** el mismo chef cocina en un food truck (teléfono) y en un salón (web): sabe las mismas recetas, pero el food truck tiene una plancha que el salón no tiene.

> 🌎 **Otro ejemplo:** Como un músico que toca la misma canción en la guitarra acústica y en la eléctrica: sabe la canción, pero la eléctrica tiene pedales que la acústica no.

> 🧩 **Piezas para este ejercicio**
> - `interface Tanqueo` describe qué propiedades debe tener el objeto. `litros: number` exige un número. Por ejemplo, `40` es número y `'40'` es texto.
> - En `function calcular(x: number): number`, la primera anotación describe el dato que entra y la segunda el que sale.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: TypeScript avisa la forma del dato
lenguaje: ts
pide: TypeScript te avisa cuando un dato **no tiene la forma** que se espera. El código tiene dos errores de tipo: arréglalos sin usar `any`. `Tanqueo` necesita `litros` y `valor` como números.
--- código
interface Tanqueo {
  litros: number;
  valor: number;
}

function precioPorLitro(t: Tanqueo): number {
  return Math.round((t.valor / t.litros) * 100) / 100;
}

const hoy: Tanqueo = { litros: '40', valor: 239.6 };
const resultado: string = precioPorLitro(hoy);
--- pruebas
prueba('el precio por litro', () => igual(precioPorLitro({ litros: 40, valor: 239.6 }), 5.99));
prueba('hoy está bien armado', () => igual(typeof hoy.litros, 'number'));
--- solución
interface Tanqueo {
  litros: number;
  valor: number;
}

function precioPorLitro(t: Tanqueo): number {
  return Math.round((t.valor / t.litros) * 100) / 100;
}

const hoy: Tanqueo = { litros: 40, valor: 239.6 };
const resultado: number = precioPorLitro(hoy);
```

```practica
elige :: ¿Qué es React? :: Una base de datos :: Una librería para armar pantallas con piezas (componentes) :: Un servidor
elige :: ¿Qué hace `npm run dev` con Vite? :: Publica la web :: Abre la web en tu computadora mientras programas :: Corre las pruebas
elige :: ¿Qué te avisa TypeScript que JavaScript solo no te avisa? :: Que falta internet :: Que un dato no tiene la forma esperada, antes de abrir la página :: Que la página es fea
elige :: ¿Por qué la web puede usar código de la app? :: Porque son el mismo archivo :: Porque la app usa React Native, que habla React y TypeScript como la web :: Porque Firebase lo traduce
vf :: La web puede usar la cámara del teléfono igual que la app
```

> 🔁 **Repaso:** React, TypeScript, Vite, Tailwind, Firebase, Vitest. La web usa código de la app porque las dos hablan React y TypeScript, salvo las piezas del teléfono.

## 3. El mapa de carpetas

> 🎙️ **El profesor:** otra vez, un archivo por tarea. Pero aquí hay algo nuevo: **dos proyectos** que conviven.

```text
copiloto-driver/
├── src/                     ← LA APP (la cocina): cálculos, textos, nube…
│
└── webapp/                  ← LA WEB (el comedor grande)
    ├── index.html           ← la única página (React dibuja todo adentro)
    ├── vite.config.ts       ← cómo se arma: el atajo @app y los adaptadores
    ├── tailwind.config.ts   ← los nombres de Tailwind, leídos de los motores
    ├── scripts/check-design.mjs  ← el candado de diseño
    │
    └── src/
        ├── main.tsx         ← el arranque: pone el tema y dibuja la App
        ├── App.tsx          ← ¿entró la persona? Login o Tablero
        ├── styles.css       ← las clases propias: vidrio, recuadros, botones
        ├── engines/         ← LOS MOTORES (tema, medidas, pantallas, movimiento, idiomas)
        ├── adapters/        ← LOS ADAPTADORES (piezas del teléfono en versión web)
        ├── data/            ← LOS DATOS (leer de la nube y armar lo que se muestra)
        │   └── actions/     ← guardar: ganancias, gastos, combustible, San, ajustes
        ├── ui/              ← LAS PIEZAS (anillo, barras, tarjeta, pastilla…)
        ├── screens/         ← LAS PANTALLAS (Inicio, Combustible, San, Mi cartera, Menú)
        ├── dev/             ← los datos de ejemplo (?demo)
        └── __tests__/       ← las pruebas
```

**Cómo se lee, de arriba abajo:** una **pantalla** (`screens/`) pide los datos (`data/`), los arma con los cálculos de la app (`@app/utils`) y los dibuja con **piezas** (`ui/`). Las piezas solo usan los **motores** (`engines/`) para colores y medidas.

> 🌎 **En la vida real:** un supermercado: el depósito central (`src/`), la puerta de entrada (`index.html`), el guardia que pide la tarjeta de socio (`App.tsx`), la oficina de diseño (`engines/`), los adaptadores de enchufe (`adapters/`), la reposición (`data/`) y la caja (`actions/`), las góndolas (`ui/`) y los pasillos (`screens/`).

> 🌎 **Otro ejemplo:** Como el plano de un centro comercial: cada local con su rubro, y el pasillo principal que los conecta.

> 🧩 **Piezas para este ejercicio**
> - Lee una llamada de adentro hacia afuera. En `dibujar(preparar(datos))`, primero se ejecuta `preparar` y su resultado pasa como argumento a `dibujar`. Puedes guardar cada resultado en una variable para ver los pasos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El camino de una pantalla
lenguaje: js
pide: Una pantalla de la web se arma en tres pasos: **datos** (`data/`) → **modelo** puro → **dibujo** (`ui/`). Completa `pantallaInicio(gastos)` usando las tres funciones, en ese orden. No calcules nada adentro de `dibujar`.
--- código
// data/: trae los datos
const traerDatos = (gastos) => gastos.filter((g) => g.valor > 0);
// modelo: cuentas puras
const armarModelo = (datos) => ({ total: datos.reduce((s, g) => s + g.valor, 0), cantidad: datos.length });
// ui/: solo dibuja
const dibujar = (modelo) => `${modelo.cantidad} gastos · R$ ${modelo.total}`;

function pantallaInicio(gastos) {
  // tu código aquí
}
--- pruebas
prueba('el dibujo final', () => igual(pantallaInicio([{ valor: 50 }, { valor: 30 }, { valor: -1 }]), '2 gastos · R$ 80'));
prueba('sin gastos', () => igual(pantallaInicio([]), '0 gastos · R$ 0'));
--- solución
// data/: trae los datos
const traerDatos = (gastos) => gastos.filter((g) => g.valor > 0);
// modelo: cuentas puras
const armarModelo = (datos) => ({ total: datos.reduce((s, g) => s + g.valor, 0), cantidad: datos.length });
// ui/: solo dibuja
const dibujar = (modelo) => `${modelo.cantidad} gastos · R$ ${modelo.total}`;

function pantallaInicio(gastos) {
  return dibujar(armarModelo(traerDatos(gastos)));
}
```

```practica
elige :: Para cambiar cómo se ve el anillo de un recuadro, ¿en qué carpeta buscas? :: `screens/` :: `ui/` (`DonutRing.tsx`) :: `data/`
elige :: Para cambiar cómo se guarda un tanqueo desde la web, ¿en qué carpeta? :: `ui/` :: `data/actions/` (`fuel.ts`) :: `engines/`
elige :: ¿Qué decide `App.tsx`? :: Los colores :: Si la persona entró: Login o Tablero :: Los idiomas
escribe :: Cuenta el camino de una pantalla, de los datos al dibujo. :: La pantalla pide los datos a data/, los arma con los cálculos de la app (@app/utils) y los dibuja con piezas de ui/, que usan los motores para colores y medidas.
```

> 🔁 **Repaso:** `screens` → `data` (+ cálculos de `@app`) → `ui` → `engines`. Y `adapters` para lo que viene del teléfono.

## 4. El atajo `@app`: usar la app sin copiarla

> 🎙️ **El profesor:** ¿cómo hace la web para usar un archivo que está **fuera** de su carpeta? Con un **alias**.

En `vite.config.ts`:

```ts
alias: [{ find: '@app', replacement: path.join(APP, 'src') }]
```

Un **alias** es un **apodo** para una carpeta. `@app` quiere decir "la carpeta `src/` de la app". Gracias a eso, una pantalla de la web puede escribir:

```ts
import { splitProfitBars } from '@app/utils/profitStackedBars';
```

y está usando **el mismo archivo** que usa el teléfono. **No hay copia.**

> 🌎 **En la vida real:** un contacto guardado en el teléfono: escribes "Mamá" en vez del número completo.

> 🌎 **Otro ejemplo:** Como el atajo del escritorio de la computadora: un ícono que abre la carpeta original, sin copiarla.

### Un ejemplo real: la ganancia neta

La Ganancia neta pinta cada barra en **rojo** (lo que todavía cubre los gastos) y **verde** (lo que ya es ganancia):

```ts
// Gastos de la semana: 1500. Ganancias: 500, 500, 400, 400.
// El jueves: 100 en rojo (termina de cubrir) y 300 en verde.
splitProfitBars(dias, 1500);
```

Sigue la cuenta: lunes 500 (rojo, faltan 1000), martes 500 (rojo, faltan 500), miércoles 400 (rojo, faltan 100), jueves 400: **100 en rojo** (termina de cubrir) y **300 en verde** (ganancia).

Esa regla vive en `src/utils/profitStackedBars.ts`, y la usan **la app** (`LucroScreen`) **y la web** (`Overview`). Otros archivos compartidos: `fuelRegisterPlan.ts`, `periodPillOptions.ts`, `fuelTankHistoryPeriod.ts` y todos los textos en `src/i18n`.

> 🌎 **En la vida real:** llenar un balde con agujero: primero el agua tiene que tapar el agujero (los gastos, en rojo); recién lo que sobra se queda en el balde (la ganancia, en verde).

> 🌎 **Otro ejemplo:** Como pagar las cuentas del mes con lo que vas ganando: los primeros días todo se va en cubrir gastos (rojo), y recién después empieza lo que te queda (verde).

### La regla que se siguió

Cuando la web necesitaba un cálculo que estaba **escondido dentro de una pantalla de la app**, **no se copió**. Se **sacó a un archivo puro** en `src/utils`, la app se cambió para usarlo, y la web lo usó también. Así **nunca** hay dos versiones.

> 🌎 **En la vida real:** si una receta buena estaba anotada en el delantal de un cocinero, no se fotocopió para la otra sucursal: se pasó al **recetario oficial**.

> 🌎 **Otro ejemplo:** Como un dato que estaba anotado en el celular de un empleado: en vez de copiarlo a otro celular, se pasa al sistema de la empresa y todos lo leen de ahí.

> 🧩 **Piezas para este ejercicio**
> - `Math.min(ventas, deuda)` devuelve lo menor de las dos cantidades. Si quedan 30 por cubrir y entran 50, solo 30 pueden ir a cubrir la deuda.
> - Una variable declarada con `let` fuera de `.map(...)` conserva lo que quedó en la vuelta anterior. `.map(...)` devuelve una barra por cada día.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: splitProfitBars: rojo y verde
lenguaje: js
pide: Cada barra se parte en **rojo** (lo que todavía cubre los gastos) y **verde** (lo que ya es ganancia). Completa `partirBarras(ganancias, gastos)`: devuelve una lista `{ rojo, verde }` por día. Con gastos 1500 y ganancias 500, 500, 400, 400, el jueves es 100 rojo y 300 verde.
--- código
function partirBarras(ganancias, gastos) {
  // tu código aquí
}
--- pruebas
prueba('el ejemplo de la clase', () => igual(partirBarras([500, 500, 400, 400], 1500), [{ rojo: 500, verde: 0 }, { rojo: 500, verde: 0 }, { rojo: 400, verde: 0 }, { rojo: 100, verde: 300 }]));
prueba('sin gastos: todo verde', () => igual(partirBarras([100], 0), [{ rojo: 0, verde: 100 }]));
prueba('nunca cubre: todo rojo', () => igual(partirBarras([100, 100], 1000), [{ rojo: 100, verde: 0 }, { rojo: 100, verde: 0 }]));
--- solución
function partirBarras(ganancias, gastos) {
  let falta = gastos;
  return ganancias.map((g) => {
    const rojo = Math.min(g, falta);
    falta -= rojo;
    return { rojo, verde: g - rojo };
  });
}
```

```practica
elige :: ¿Qué hace el alias `@app`? :: Copia la app :: Es un apodo para la carpeta `src/` de la app, para importarla sin copiar :: Publica la app
elige :: Gastos 1500; ganancias 500, 500, 400, 400. ¿Cuánto es verde el jueves? :: 400 :: 300 :: 100
elige :: La web necesita un cálculo que está escondido en una pantalla de la app. ¿Qué se hace? :: Se copia a la web :: Se saca a un archivo puro en `src/utils` y lo usan las dos :: Se reescribe distinto
vf :: `splitProfitBars` lo usan la app y la web, desde el mismo archivo
```

> 🔁 **Repaso:** `@app` apunta a `src/` de la app. Lo compartido vive en `src/utils`; si algo estaba escondido en una pantalla, se saca a un archivo puro.

## 5. Puertos y adaptadores (el enchufe)

> 🎙️ **El profesor:** aquí aparece el Tema 10 en la vida real: **arquitectura hexagonal**.

> 🌎 **En la vida real:** Es como un cargador de celular que viaja contigo: en cada país cambias el adaptador de la pared, pero el cargador es el mismo.

> 🌎 **Otro ejemplo:** Es como una lámpara con la bombilla estándar: puedes cambiar de marca de bombilla sin cambiar la lámpara.

### El problema

> 🌎 **En la vida real:** Es como querer usar una tarjeta de transporte de una ciudad en otra: la tarjeta sirve, pero el lector de esa otra ciudad no la reconoce.

> 🌎 **Otro ejemplo:** Es como una receta que dice "usa la freidora de aire" y tú solo tienes horno: la receta es buena, pero falta adaptar ese paso.

Los módulos de la app que hablan con Firebase usan un archivo, `src/services/firebaseClient.ts`, que trae **piezas del teléfono** (por ejemplo, guardar la sesión en el teléfono). El navegador **no tiene** esas piezas.

### La solución

Cuando Vite arma la web, **cambia ese archivo por otro** que hace lo mismo pero en el navegador: `webapp/src/adapters/firebaseClient.ts`. **Mismo nombre, mismas funciones.** Los módulos de la app ni se enteran.

```ts
// vite.config.ts (simplificado)
const ADAPTADORES = new Map([
  ['src/services/firebaseClient.ts', 'webapp/src/adapters/firebaseClient.ts'],
]);
```

Esto es **puertos y adaptadores**: el centro (los cálculos) no sabe dónde corre; los bordes (los adaptadores) sí. `firebaseClient` es el **puerto**; la versión del teléfono y la de la web son **dos adaptadores**.

> 🌎 **En la vida real:** un adaptador de enchufe para viajar: el cargador es el mismo; solo cambias la pieza que lo conecta a la pared. O un DJ: la misma música, distinto cable en casa y en la discoteca.

> 🌎 **Otro ejemplo:** Como cambiar la boquilla de una manguera según el uso: la manguera y el agua son las mismas, cambia la punta.

### El candado

Si algún archivo de la web llega a pedir una pieza que solo existe en el teléfono, **la compilación se detiene** con un mensaje claro:

```text
La web no puede usar piezas del teléfono: "expo-camera" …
Usa un adaptador en webapp/src/adapters o un módulo puro de src/.
```

Así es **imposible** que la web se rompa en silencio por usar algo del teléfono. (Es la lección de la vc89 del Tema 11: que el error aparezca al armar, no en la cara del usuario.)

> 🌎 **En la vida real:** el control del aeropuerto que no te deja subir con un líquido de más de 100 ml, con un cartel claro, en vez de que el problema explote a mitad de vuelo.

> 🌎 **Otro ejemplo:** Como el detector de metales de un estadio: si alguien intenta entrar con algo prohibido, lo paran en la puerta con un cartel claro.

> 🧩 **Piezas para este ejercicio**
> - Un `return` temprano acaba la función. Si estás en la app, puedes devolver la importación enseguida y dejar las comprobaciones siguientes para la web.
> - `REEMPLAZOS[importacion]` busca el nombre exacto. `??` permite elegir el nombre original si no hay reemplazo. `throw new Error(...)` detiene la función con un mensaje.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cambiar el adaptador según la plataforma
lenguaje: js
pide: El archivo de Firebase de la app usa piezas del teléfono; al armar la web, Vite lo **cambia** por un adaptador web con los mismos nombres. Completa `resolver(importacion, plataforma)`: si es `'web'` y la importación está en `REEMPLAZOS`, devuelve el reemplazo; si es una librería **solo del teléfono** (`SOLO_TELEFONO`) en la web, lanza `Error('expo-camera no existe en la web')` (con su nombre); si no, devuelve la misma.
--- código
const REEMPLAZOS = { '@app/services/firebaseClient': 'web/adapters/firebaseClient.web' };
const SOLO_TELEFONO = ['expo-camera', 'expo-haptics'];

function resolver(importacion, plataforma) {
  // tu código aquí
}
--- pruebas
prueba('en el teléfono, igual', () => igual(resolver('@app/services/firebaseClient', 'telefono'), '@app/services/firebaseClient'));
prueba('en la web, el adaptador', () => igual(resolver('@app/services/firebaseClient', 'web'), 'web/adapters/firebaseClient.web'));
prueba('expo-camera en la web: se detiene', () => { let m = ''; try { resolver('expo-camera', 'web'); } catch (e) { m = e.message; } igual(m, 'expo-camera no existe en la web'); });
prueba('una utilidad compartida pasa igual', () => igual(resolver('@app/utils/profitStackedBars', 'web'), '@app/utils/profitStackedBars'));
--- solución
const REEMPLAZOS = { '@app/services/firebaseClient': 'web/adapters/firebaseClient.web' };
const SOLO_TELEFONO = ['expo-camera', 'expo-haptics'];

function resolver(importacion, plataforma) {
  if (plataforma !== 'web') return importacion;
  if (SOLO_TELEFONO.includes(importacion)) throw new Error(`${importacion} no existe en la web`);
  return REEMPLAZOS[importacion] ?? importacion;
}
```

```practica
elige :: ¿Por qué la web no puede usar `src/services/firebaseClient.ts` tal como está? :: Porque es muy largo :: Porque trae piezas del teléfono que el navegador no tiene :: Porque es secreto
elige :: ¿Qué hace Vite con ese archivo al armar la web? :: Lo borra :: Lo cambia por un adaptador web con el mismo nombre y funciones :: Lo copia igual
elige :: ¿Qué pasa si alguien importa `expo-camera` en la web? :: Funciona igual :: La compilación se detiene con un mensaje claro :: La web se rompe en silencio
vf :: Esto es un ejemplo de arquitectura hexagonal (puertos y adaptadores)
escribe :: Explica con tus palabras el adaptador de Firebase. :: El archivo de Firebase de la app usa piezas del teléfono; al armar la web, Vite lo cambia por un adaptador del navegador con el mismo nombre y funciones, y los módulos de la app no se enteran.
```

> 🔁 **Repaso:** `firebaseClient` es el puerto; teléfono y web son adaptadores; Vite cambia uno por otro. Y un candado frena las piezas del teléfono.

## 6. Los datos: leer en vivo y guardar

> 🎙️ **El profesor:** ahora el Tema 08 (Firebase) desde la web. Tres partes: leer, armar y guardar.

> 🌎 **En la vida real:** Es como un tablero de vuelos del aeropuerto: se actualiza solo cuando cambia algo, se arma con los datos de las aerolíneas, y los empleados registran los cambios por su sistema.

> 🌎 **Otro ejemplo:** Es como una planilla compartida en la nube: lo que alguien escribe en su teléfono aparece en tu computadora al instante.

### Leer: suscribirse

`data/useUserData.ts` usa las funciones `subscribe…` de la app (`subscribeEarningStoreCloud`, `subscribeExpenseStoreCloud`…). **"Subscribe" (suscribirse)** significa que Firestore **avisa cada vez que algo cambia**. Si registras una ganancia en el teléfono, la web la muestra **al instante**, sin recargar.

> 🌎 **En la vida real:** seguir un canal de WhatsApp: no entras a preguntar si hay novedades; te llegan solas.

> 🌎 **Otro ejemplo:** Como las notificaciones de una app de delivery: te llega "tu pedido salió" sin que tengas que entrar a preguntar.

### Armar: funciones puras

> 🌎 **En la vida real:** Es como una calculadora de bolsillo: le das números y te devuelve un resultado, sin tocar nada más. Por eso es fácil comprobar si está bien.

> 🌎 **Otro ejemplo:** Es como una receta escrita en papel: con los mismos ingredientes sale siempre el mismo plato, y se puede revisar sin entrar a la cocina.

`data/dashboardModel.ts`, `fuelModel.ts`, `walletModel.ts`… son funciones **puras** (Tema 09): sin React, sin pantalla. Reciben los datos y devuelven lo que la pantalla necesita, usando los cálculos de la app. Por ser puras, se **prueban** fácil.

### Guardar: las acciones

> 🌎 **En la vida real:** Es como registrar una carga de combustible en el taller: se anota la carga, se actualiza el kilometraje, se crea el gasto y se recalcula cuánto queda en el tanque.

> 🌎 **Otro ejemplo:** Es como hacer un depósito: se anota, se actualiza el saldo y se guarda el comprobante, todo en orden.

`data/actions/` usa las MISMAS funciones de la nube de la app. Por ejemplo, registrar un tanqueo (`actions/fuel.ts`):

1. arma el tanqueo con la regla de la app (`planFuelRegister`);
2. lo guarda en la nube (`saveVehicleTrackingBundleCloud`);
3. actualiza el kilometraje del vehículo;
4. crea el gasto de combustible vinculado;
5. recalcula el balance del tanque.

### Seguridad

La web usa la configuración **pública** de Firebase: **no es un secreto**. Lo que protege los datos son **las reglas de Firestore** (Tema 08): cada persona solo lee y escribe lo suyo.

> 🌎 **En la vida real:** la dirección de un edificio es pública, pero eso no te deja entrar a los departamentos: el **portero** es el que protege.

> 🌎 **Otro ejemplo:** Como el número de una cuenta bancaria: lo puedes dar a cualquiera para que te deposite; lo que protege tu plata es tu clave, no esconder el número.

### El Copiloto

> 🌎 **En la vida real:** Es como un asistente telefónico de un banco: tú le preguntas por el teléfono, pero las respuestas las busca la oficina central con sus sistemas privados.

> 🌎 **Otro ejemplo:** Es como el cajero de un restaurante que toma tu pedido: la receta secreta nunca sale de la cocina.

`data/useCopilot.ts` usa el mismo motor de la app. La pregunta va a la función de la nube `aiCopilot`. **La clave de la IA nunca está en la página**: vive en el servidor.

> 🧩 **Piezas para este ejercicio**
> - `[4, 6].reduce((suma, valor) => suma + valor, 0)` suma desde cero y da 10. Puedes usar la misma función de suma para ambas listas.
> - Un margen es una fracción de los ingresos. Antes de dividir, comprueba si los ingresos son cero. `Math.round(...)` redondea el porcentaje a un entero.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un modelo puro para el tablero
lenguaje: js
pide: `dashboardModel.ts` no tiene React adentro: recibe datos y devuelve números. Completa `modeloTablero(ingresos, gastos)`: devuelve `{ ingresos, gastos, ganancia, margen }`, donde ingresos y gastos son las **sumas**, la ganancia es la resta y el margen es el porcentaje entero de ganancia sobre ingresos (0 si no hay ingresos).
--- código
function modeloTablero(ingresos, gastos) {
  // tu código aquí
}
--- pruebas
prueba('una semana', () => igual(modeloTablero([500, 500, 400, 400], [1500]), { ingresos: 1800, gastos: 1500, ganancia: 300, margen: 17 }));
prueba('sin ingresos', () => igual(modeloTablero([], [100]), { ingresos: 0, gastos: 100, ganancia: -100, margen: 0 }));
prueba('es pura: no cambia lo que recibe', () => { const i = [1, 2]; modeloTablero(i, []); igual(i, [1, 2]); });
--- solución
function modeloTablero(ingresos, gastos) {
  const suma = (l) => l.reduce((s, v) => s + v, 0);
  const totalIngresos = suma(ingresos);
  const totalGastos = suma(gastos);
  const ganancia = totalIngresos - totalGastos;
  return { ingresos: totalIngresos, gastos: totalGastos, ganancia, margen: totalIngresos ? Math.round((ganancia / totalIngresos) * 100) : 0 };
}
```

```practica
elige :: ¿Qué significa que la web esté "suscrita" a los datos? :: Que paga una suscripción :: Que Firestore le avisa cada cambio y la muestra al instante, sin recargar :: Que guarda una copia
elige :: ¿Por qué los modelos como `dashboardModel.ts` no tienen React adentro? :: Por olvido :: Para ser funciones puras: fáciles de probar y de usar en cualquier pantalla :: Porque React no funciona ahí
elige :: Si la configuración de Firebase es pública, ¿qué impide leer datos ajenos? :: Nada :: Las reglas de Firestore :: Esconder la configuración
vf :: La clave de la IA del Copiloto está en la página web
escribe :: ¿Qué pasos sigue la web para guardar un tanqueo? :: Arma el tanqueo con la regla de la app, lo guarda en la nube, actualiza el kilometraje, crea el gasto de combustible y recalcula el balance del tanque.
```

> 🔁 **Repaso:** leer suscribiéndose (en vivo), armar con funciones puras, guardar con las acciones de la app. Seguridad = reglas, no esconder la configuración. La clave de la IA, en el servidor.

## 7. Los motores de diseño

> 🎙️ **El profesor:** el Tema 11 te contó de motores, tokens y candados en la app. La web los tiene también, y con la misma regla.

> 🌎 **En la vida real:** Es como el manual de identidad de una marca: dice los colores exactos, las letras y los tamaños, y todos los locales lo siguen.

> 🌎 **Otro ejemplo:** Es como la paleta de un pintor: solo usa los colores que preparó; no inventa uno nuevo en cada cuadro.

> **Ninguna pantalla escribe un color, un tamaño o una sombra a mano.** Todo sale de un motor, por su nombre.

| Motor (`engines/`) | De qué se encarga |
|---|---|
| `theme.ts` | Los **colores, radios y vidrio**. Sale del MISMO tema de la app (`themeLocks.ts`) y lo convierte en variables CSS (`--c-gain-rgb`…) |
| `remoteTheme.ts` | Lee el tema que el dueño cambia en el **panel** (`appConfig/theme`). Cambias el verde en el panel y cambia en el teléfono **y** en la web |
| `webTokens.ts` | Las **medidas**: tamaños de letra, anillos, barras, transparencias, tiempos |
| `breakpoints.ts` | Los **tamaños de pantalla**: teléfono, tablet, laptop, monitor, y `fit` (todo cabe sin bajar) |
| `motion.ts` | El **movimiento**: entrar, salir, contar números desde cero |
| `i18n.tsx` y `format.ts` | Los **6 idiomas** (los de la app) y el formato de moneda, km y % |

Por ejemplo, los cortes de pantalla viven **en un solo lugar**:

```ts
export const BREAKPOINTS = { tablet: 481, laptop: 769, monitor: 1280 };
export const FIT_MIN_HEIGHT = 640; // con este alto o más, todo cabe sin bajar
```

### El candado de diseño

`scripts/check-design.mjs`, antes de armar la web, revisa todas las pantallas y piezas. Si encuentra un valor a mano, **falla**:

| Prohibido | Por qué |
|---|---|
| `#00C853` o `rgb(0, 200, 83)` | Un color a mano no cambia cuando cambia el tema |
| `text-sm`, `text-lg` | Los tamaños de letra salen del motor (`text-label`, `text-title`…) |
| `w-[312px]` | Un valor inventado, fuera del motor |
| `` `bar-${tipo}` `` | Tailwind no ve las clases armadas por partes y **las borra** |

Esa última es sutil: Tailwind, al armar, **solo deja las clases que ve escritas completas** en el código. Si armas el nombre por partes, Tailwind no lo ve y lo tira.

> 🌎 **En la vida real:** el manual de marca de una cadena de tiendas, con el inspector de la franquicia que multa los carteles pintados a mano.

> 🌎 **Otro ejemplo:** Como la inspección de una franquicia que multa al local que pintó la fachada con un rojo "parecido" en vez del oficial.

> 🧩 **Piezas para este ejercicio**
> - `clases.split(/\s+/)` separa el texto donde hay uno o más espacios en blanco. `.test(texto)` comprueba si un texto encaja con el patrón.
> - En una expresión regular, `^` y `$` marcan principio y final. `|` separa alternativas y `\d*` admite cero o más dígitos, como en `xl` y `2xl`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El candado de los tamaños
lenguaje: js
pide: En la web, los tamaños de letra salen del motor (`text-cuerpo`, `text-titulo`…). Completa `revisarClases(clases)`: devuelve los tamaños sueltos de Tailwind que no son del motor: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`… (`text-` seguido de `xs`, `sm`, `base`, `lg` o un número y `xl`).
--- código
function revisarClases(clases) {
  // tu código aquí
}
--- pruebas
prueba('text-sm no pasa', () => igual(revisarClases('flex text-sm gap-2'), ['text-sm']));
prueba('text-2xl tampoco', () => igual(revisarClases('text-2xl text-cuerpo'), ['text-2xl']));
prueba('los del motor sí', () => igual(revisarClases('text-cuerpo text-titulo text-acento'), []));
--- solución
function revisarClases(clases) {
  return clases.split(/\s+/).filter((c) => /^text-(xs|sm|base|lg|\d*xl)$/.test(c));
}
```

```practica
elige :: El dueño cambia el verde en el panel. ¿Por qué la web cambia sola? :: Porque se recarga :: Porque lee el mismo tema del panel (`remoteTheme.ts`) y lo convierte en variables CSS :: Porque Tailwind lo adivina
elige :: ¿Qué hace el candado si alguien escribe `text-sm`? :: Nada :: Falla y dice dónde; hay que usar un tamaño del motor :: Lo cambia solo
elige :: ¿Dónde se cambia el alto mínimo para que todo quepa en una pantalla? :: `theme.ts` :: `breakpoints.ts` (`FIT_MIN_HEIGHT`) :: `styles.css`
vf :: Tailwind borra las clases armadas por partes como `` `bar-${tipo}` ``
```

> 🔁 **Repaso:** motores (`theme`, `remoteTheme`, `webTokens`, `breakpoints`, `motion`, `i18n`/`format`) y un candado que prohíbe valores a mano.

## 8. Tailwind y `styles.css`

> 🎙️ **El profesor:** Tailwind es CSS (Tema 16) escrito de otra forma: con **clases cortas** directo en la pieza.

```tsx
<div className="flex items-center gap-3 rounded-lg px-3 py-2">
```

| Clase | Qué hace | Equivale en CSS a… |
|---|---|---|
| `flex` | Pone los hijos uno al lado del otro | `display: flex` |
| `items-center` | Los centra de arriba abajo | `align-items: center` |
| `gap-3` | Deja espacio entre ellos | `gap: …` |
| `rounded-lg` | Esquinas redondeadas | `border-radius: …` |
| `px-3 py-2` | Relleno a los lados y arriba-abajo | `padding: …` |
| `tablet:grid-cols-3` | **Desde** tablet, tres columnas | Un `@media` con `grid-template-columns` |

(En React se escribe `className` en vez de `class`.)

**`styles.css`** tiene las clases propias de Copiloto, con nombre, para lo que se repite:

| Clase | Qué es |
|---|---|
| `glass` | El vidrio: las tarjetas grandes |
| `tile` | Un recuadro dentro del panel grande |
| `tile-inset` | Un cuadrito dentro de un recuadro |
| `btn btn-gain` / `btn-expense` | Los botones verde y rojo |
| `entra`, `crece`, `revela` | Los efectos de entrada |

Todas leen las variables de los motores. Cuando se pidió que los cuadritos oscuros fueran claros, se creó **una** clase (`tile-inset`) y se cambió en todas las pantallas a la vez.

> 🌎 **En la vida real:** instrucciones cortas para alguien que acomoda muebles: "uno al lado del otro", "a la misma altura", "un pasito entre cada uno", "si la sala es grande, tres columnas".

> 🌎 **Otro ejemplo:** Como abreviaturas en un mensaje: "q" en vez de "que". Tailwind escribe el estilo en abreviaturas cortas pegadas a cada pieza.

> 🧩 **Piezas para este ejercicio**
> - `.startsWith('laptop:')` comprueba el prefijo. `.slice('laptop:'.length)` devuelve lo que queda después.
> - Puedes reutilizar la misma búsqueda con el nombre limpio. Si no hay una regla para ese nombre, `?? null` da `null`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tailwind a CSS
lenguaje: js
pide: Completa `aCSS(clase, anchoPantalla)` para unas pocas clases de Tailwind: `flex` → `'display: flex'`, `grid-cols-2` → `'grid-template-columns: repeat(2, 1fr)'`, `hidden` → `'display: none'`. Si la clase tiene el prefijo `laptop:`, solo aplica desde **1024** de ancho; si no aplica, devuelve `null`.
--- código
const CSS = {
  flex: 'display: flex',
  hidden: 'display: none',
  'grid-cols-2': 'grid-template-columns: repeat(2, 1fr)',
};

function aCSS(clase, anchoPantalla) {
  // tu código aquí
}
--- pruebas
prueba('flex', () => igual(aCSS('flex', 400), 'display: flex'));
prueba('laptop:grid-cols-2 en un teléfono: no aplica', () => igual(aCSS('laptop:grid-cols-2', 400), null));
prueba('laptop:grid-cols-2 en una laptop', () => igual(aCSS('laptop:grid-cols-2', 1280), 'grid-template-columns: repeat(2, 1fr)'));
prueba('justo 1024', () => igual(aCSS('laptop:hidden', 1024), 'display: none'));
--- solución
const CSS = {
  flex: 'display: flex',
  hidden: 'display: none',
  'grid-cols-2': 'grid-template-columns: repeat(2, 1fr)',
};

function aCSS(clase, anchoPantalla) {
  if (clase.startsWith('laptop:')) return anchoPantalla >= 1024 ? aCSS(clase.slice('laptop:'.length), anchoPantalla) : null;
  return CSS[clase] ?? null;
}
```

```practica
elige :: ¿Qué hace `laptop:grid-cols-2`? :: Dos columnas siempre :: Desde el ancho de laptop en adelante, dos columnas :: Dos filas
elige :: `flex` en Tailwind equivale a… :: `display: block` :: `display: flex` :: `color: flex`
elige :: ¿Por qué se creó `tile-inset` en vez de cambiar el color en cada pantalla? :: Por gusto :: Para cambiarlo en un solo lugar y que todas cambien a la vez :: Porque Tailwind lo pide
vf :: En React se escribe `className` en vez de `class`
```

> 🔁 **Repaso:** Tailwind = clases cortas (`flex`, `gap-3`, `tablet:…`); `styles.css` = clases con nombre para lo que se repite (`glass`, `tile`, `tile-inset`).

## 9. Cómo se arma una pantalla: el Inicio

> 🎙️ **El profesor:** ahora React por dentro, con `screens/Overview.tsx`. Toda pantalla sigue **el mismo camino**:

> 🌎 **En la vida real:** Es como armar una vidriera: llega la mercadería (datos), el vendedor la ordena y le pone precio (modelo), y la acomoda en los estantes (piezas).

> 🌎 **Otro ejemplo:** Es como un parte del tiempo en la tele: llegan los datos del clima, el meteorólogo los resume, y la pantalla los muestra con íconos.

```text
datos (useUserData)  →  modelo puro (buildDashboardModel)  →  piezas (StatCard, WeekBars…)
```

1. **Recibe los datos** de la persona.
2. **Arma el modelo** con `useMemo` (Tema 11: "recuerda este cálculo y no lo repitas si los datos no cambiaron"):

```tsx
const model = useMemo(() => buildDashboardModel({ ...data, now }), [data, now]);
```

3. **Dibuja con piezas**, pasándoles solo lo que necesitan:

```tsx
<StatCard label="Ganancias" value={model.earnings} tone="gain" />
```

`label`, `value` y `tone` son **props**: los datos que se le pasan a una pieza, como los atributos de HTML (Tema 15).

### El estado

**`useState`** guarda lo que la persona **elige** en la pantalla:

```tsx
const [statsView, setStatsView] = useState('detailed'); // Detallada o Completa
const [statsPeriod, setStatsPeriod] = useState('week'); // Semana o Mes
```

Se lee: "`statsView` empieza en `'detailed'`; para cambiarlo, uso `setStatsView`". Cuando la persona toca "Completa", cambia el estado y React **vuelve a dibujar solo esa parte**.

> 🌎 **En la vida real:** un noticiero: llegan las noticias (datos), el editor las resume (`useMemo`, que no reescribe si no hay noticias nuevas), y el presentador las lee en sus carteles (piezas). El estado es el control remoto del televidente.

> 🌎 **Otro ejemplo:** Como el control remoto de la tele: eliges "semana" o "mes" y solo cambia lo que se ve en la pantalla.

### Un detalle que se corrigió: la `key`

Al cambiar de Semana a Mes, los recuadros **desaparecían y volvían a entrar**. La causa: una **`key`** (una "cédula" que React usa para saber si una pieza es **la misma**) que **cambiaba con el período**. React creía que era **otra** pieza y la volvía a montar (con su animación de entrada). Se movió la `key` **solo al gráfico de adentro**: el recuadro se queda quieto y solo cambian las barras.

> 🌎 **En la vida real:** si cada vez que cambias de Semana a Mes le das al recuadro una cédula nueva, React cree que llegó **otra persona** y la hace entrar de nuevo por la puerta.

> 🌎 **Otro ejemplo:** Como cambiarle el nombre a un contacto del teléfono cada vez que lo llamas: el teléfono cree que es una persona nueva y empieza la conversación de cero.

> 🧩 **Piezas para este ejercicio**
> - En `function Recuadro({ label, value })`, las llaves sacan dos propiedades del objeto que recibe la función.
> - Los dos métodos pueden compartir una variable declarada con `let` dentro de `crearPantalla`. Uno la cambia y el otro la lee cuando dibuja.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Props y estado, sin React
lenguaje: js
pide: Una pieza recibe **props** y la pantalla guarda lo que la persona elige en el **estado**. Completa `Recuadro({ label, value })` (devuelve `'label: value'`) y `crearPantalla(datos)`: guarda el periodo elegido (empieza en `'semana'`), `elegir(p)` lo cambia, y `dibujar()` devuelve `Recuadro({ label: 'Total', value })` con el total del periodo.
--- código
function Recuadro({ label, value }) {
  // tu código aquí
}

function crearPantalla(datos) {
  let periodo = 'semana';
  return {
    elegir(p) {
      // tu código aquí
    },
    dibujar() {
      // tu código aquí
    },
  };
}
--- pruebas
const datos = { semana: 300, mes: 1200 };
prueba('una pieza con props', () => igual(Recuadro({ label: 'Gastos', value: 80 }), 'Gastos: 80'));
prueba('empieza en semana', () => igual(crearPantalla(datos).dibujar(), 'Total: 300'));
prueba('al elegir mes', () => { const p = crearPantalla(datos); p.elegir('mes'); igual(p.dibujar(), 'Total: 1200'); });
--- solución
function Recuadro({ label, value }) {
  return `${label}: ${value}`;
}

function crearPantalla(datos) {
  let periodo = 'semana';
  return {
    elegir(p) {
      periodo = p;
    },
    dibujar() {
      return Recuadro({ label: 'Total', value: datos[periodo] });
    },
  };
}
```

```practica
escribe :: ¿Cuáles son los tres pasos con que se arma una pantalla? :: Recibir los datos, armar el modelo puro (con useMemo) y dibujarlo con piezas.
elige :: ¿Qué guarda `useState`? :: Los datos de Firestore :: Lo que la persona elige en la pantalla, como Semana o Mes :: Los colores
elige :: ¿Qué son las props? :: Errores :: Los datos que se le pasan a una pieza, como `label` y `value` :: Archivos CSS
elige :: ¿Por qué el recuadro volvía a aparecer al cambiar de Semana a Mes? :: Por un error de Firebase :: Porque su `key` cambiaba, y React creía que era una pieza nueva :: Porque la página se recargaba
vf :: `useMemo` evita repetir un cálculo si los datos no cambiaron
```

> 🔁 **Repaso:** datos → modelo (`useMemo`) → piezas (props). `useState` para lo que elige la persona. Y la `key` es la cédula: si cambia, React monta de nuevo.

## 10. Pruebas y revisiones

> 🎙️ **El profesor:** antes de guardar cada cambio de la web se corre esto:

| Comando | Qué revisa |
|---|---|
| `npm run check:design` | Que no haya valores a mano (el candado) |
| `npx tsc --noEmit` | TypeScript: que los tipos encajen |
| `npx vitest run` | Las pruebas de la web (modelos y motores) |
| `npm run build` | Que la web se arme completa (corre las tres de arriba primero) |
| `npm test` (en la app) | Las pruebas de la app, **porque la web usa su código** |

Y en el CI (Tema 04), el trabajo **`webapp`** hace lo mismo en cada subida.

Un ejemplo de prueba (`__tests__/dashboardModel.test.ts`):

```ts
it('Estadísticas por mes: una barra por semana y el mismo total del mes', () => {
  const mes = buildPeriodBars({ kind: 'earnings', period: 'month', ... });
  expect(mes.days[0].dayLabel).toBe('S1');
  expect(mes.totalBrl).toBeCloseTo(mes.days.reduce((s, d) => s + d.totalBrl, 0));
});
```

Se lee: "por mes, la primera barra se llama **S1** (semana 1), y el **total del mes** tiene que ser **la suma de las barras**". `toBeCloseTo` compara números con decimales (permite diferencias mínimas de redondeo). `reduce` es el del Tema 17.

> 🌎 **En la vida real:** revisar que la suma de las 4 semanas dé el total del mes en tu libreta.

> 🌎 **Otro ejemplo:** Como la inspección final de un departamento antes de entregarlo: paredes, puertas, luz, agua, y que el edificio entero funcione.

> 🧩 **Piezas para este ejercicio**
> - `.some(...)` sirve para preguntar si algún archivo empieza con una ruta. Un cambio en `src/` cuenta para ambas comprobaciones.
> - Puedes construir la respuesta con una lista vacía y agregar cada nombre que corresponda usando `.push(...)`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Qué pruebas hay que correr?
lenguaje: js
pide: La web usa archivos de la app: si cambias algo de `src/` de la app, también puede romperse la web. Completa `queCorrer(cambiados)`: devuelve `['app', 'web']`, `['app']` o `['web']` según los archivos: los de `webapp/` piden `'web'`; los de `src/` piden **los dos**; otros (como el README) no piden nada.
--- código
function queCorrer(cambiados) {
  // tu código aquí
}
--- pruebas
prueba('solo la web', () => igual(queCorrer(['webapp/src/ui/DonutRing.tsx']), ['web']));
prueba('una regla compartida: las dos', () => igual(queCorrer(['src/utils/profitStackedBars.ts']), ['app', 'web']));
prueba('el README: nada', () => igual(queCorrer(['README.md']), []));
prueba('mezcla', () => igual(queCorrer(['webapp/a.ts', 'src/b.ts']), ['app', 'web']));
--- solución
function queCorrer(cambiados) {
  const app = cambiados.some((a) => a.startsWith('src/'));
  const web = app || cambiados.some((a) => a.startsWith('webapp/'));
  return [...(app ? ['app'] : []), ...(web ? ['web'] : [])];
}
```

```practica
elige :: ¿Por qué hay que correr también las pruebas de la app cuando cambias la web? :: Por costumbre :: Porque la web usa el código de la app: si se rompe uno, puede romperse el otro :: No hace falta
elige :: ¿Qué revisa la prueba del ejemplo? :: Los colores :: Que la primera barra se llame S1 y que el total del mes sea la suma de las barras :: El idioma
vf :: `npm run build` corre el candado, TypeScript y las pruebas antes de armar
```

> 🔁 **Repaso:** candado, TypeScript, Vitest, build, y las pruebas de la app. Y en el CI, el trabajo `webapp`.

## 11. Verla, en la Mac y en el celular

> 🎙️ **El profesor:** ¿cómo la ves funcionando?

| Para… | Comando o dirección |
|---|---|
| Abrirla en la Mac | `cd webapp && npm run dev` → `http://localhost:5180` |
| Verla con datos de ejemplo | `http://localhost:5180/?demo` (solo en la Mac) |
| Verla en el celular (mismo Wi-Fi) | `npm run dev -- --host` → la dirección que dice **Network** (ej. `http://192.168.0.96:5180`) |
| Armarla para publicar | `npm run build` → la carpeta `dist` |

- `?demo` muestra **datos de ejemplo**, sin datos de nadie.
- `--host` le dice a Vite: "acepta visitas de **otros aparatos de la casa**", no solo de esta Mac.
- Con la **Mac apagada**, la página no abre en el celular: la Mac es la que la está sirviendo. Para verla desde cualquier lugar, habría que **publicarla** (por ejemplo en Firebase Hosting, donde ya están la landing y el panel). Al 16/11/2026, la web todavía no está publicada.

> 🌎 **En la vida real:** `npm run dev` es abrir la tienda solo para ti; `--host`, abrir la puerta a los de la casa (no a los de la calle). Si te vas a dormir, nadie atiende el mostrador.

> 🌎 **Otro ejemplo:** Como mostrar tu casa antes de mudarte: abres la puerta a tu familia (mismo Wi-Fi), pero no a la calle.

> 🧩 **Piezas para este ejercicio**
> - `!servidor.encendido` significa que está apagado. `&&` exige que se cumplan ambas condiciones. Revisa primero si hay servidor, porque las demás condiciones solo importan cuando está encendido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Desde dónde se puede abrir?
lenguaje: js
pide: Sin `--host`, Vite solo acepta visitas de **la misma computadora**; con `--host`, también de otros aparatos **de la misma red** (el celular en el mismo wifi). Y nunca si la Mac está apagada. Completa `abre(visita, servidor)`.
--- código
function abre(visita, servidor) {
  // visita = { mismaComputadora, mismaRed }, servidor = { encendido, host }
  // tu código aquí
}
--- pruebas
prueba('en la Mac: sí', () => igual(abre({ mismaComputadora: true, mismaRed: true }, { encendido: true, host: false }), true));
prueba('celular sin --host: no', () => igual(abre({ mismaComputadora: false, mismaRed: true }, { encendido: true, host: false }), false));
prueba('celular con --host: sí', () => igual(abre({ mismaComputadora: false, mismaRed: true }, { encendido: true, host: true }), true));
prueba('desde otra red: no', () => igual(abre({ mismaComputadora: false, mismaRed: false }, { encendido: true, host: true }), false));
prueba('Mac apagada: no', () => igual(abre({ mismaComputadora: false, mismaRed: true }, { encendido: false, host: true }), false));
--- solución
function abre(visita, servidor) {
  if (!servidor.encendido) return false;
  if (visita.mismaComputadora) return true;
  return servidor.host && visita.mismaRed;
}
```

```practica
elige :: ¿Para qué sirve `--host`? :: Para publicar en internet :: Para que la página acepte visitas de otros aparatos de la misma red :: Para cambiar el puerto
elige :: ¿Por qué la página no abre en el celular con la Mac apagada? :: Porque el celular no tiene internet :: Porque la que la sirve es la Mac :: Porque falta el `?demo`
vf :: `?demo` muestra datos reales de los usuarios
```

> 🔁 **Repaso:** `npm run dev` (en la Mac), `?demo` (ejemplo), `--host` (mismo Wi-Fi), `npm run build` (para publicar).

## 12. Decisiones que se tomaron (y lo que salió mal)

> 🎙️ **El profesor:** las decisiones reales, con sus problemas.

| Qué pasó | Qué se decidió |
|---|---|
| `lucide-react` (los íconos) trajo **su propia copia de React** (19.3.1). Con dos React distintos, la página fallaba | En `vite.config.ts` se obliga a usar **una sola React**: la de la app |
| El Inicio no cabía en la laptop (1470 × 754): el corte de "todo en una pantalla" era 760 de alto | Se bajó a **640** en el motor (`FIT_MIN_HEIGHT`) |
| El clima no aparecía: solo buscaba la ciudad de los ajustes, y estaba vacía | Como la app: primero **la ubicación del navegador** y, si no, la ciudad |
| Los cuadritos de adentro eran **oscuros** y no combinaban | Una clase nueva, `tile-inset`, en todas las pantallas |
| La lista de fechas de la app **rebotaba** y caía seca, y ese código estaba **copiado** en dos lugares | Un solo motor (`animatePopoverOpen`), con un aparecer corto y sin rebote |
| El historial de tanques mostraba **todos** los tanques | Por **mes o semana**, con una regla compartida (`tanksInPeriod`) |
| Con los tres gráficos de Estadísticas a la vez, las barras se veían pequeñas | Botón **Detallada / Completa** |

> 🌎 **En la vida real:** dos copias de React son **dos directores** dando órdenes distintas a la misma orquesta: suena mal.

> 🌎 **Otro ejemplo:** Como dos relojes en la misma pared que marcan horas distintas: no sabes cuál creer; hay que dejar uno solo.

> 💡 **Idea:** fíjate que **dos copias** de una librería ya rompieron algo dos veces en tu historia: React aquí, y `@firebase/app` en la vc89 (Tema 11). Es un error clásico; ahora sabes reconocerlo.

> 🧩 **Piezas para este ejercicio**
> - `for (const { nombre, version } of arbol)` extrae ambas propiedades de cada elemento.
> - Un `Set` cuenta valores distintos. Si agregas dos veces la misma versión, `.size` sigue siendo 1. Usa un conjunto por nombre de paquete.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dos copias de React
lenguaje: js
pide: `lucide-react` trajo **otra versión** de React y la página fallaba. Completa `duplicadas(arbol)`: `arbol` es una lista de `{ nombre, version }` de todo lo instalado. Devuelve los nombres que aparecen con **más de una versión**, en orden alfabético.
--- código
function duplicadas(arbol) {
  // tu código aquí
}
--- pruebas
prueba('dos Reacts', () => igual(duplicadas([{ nombre: 'react', version: '18.3.1' }, { nombre: 'react', version: '19.0.0' }, { nombre: 'vite', version: '5.4.0' }]), ['react']));
prueba('la misma versión dos veces no es problema', () => igual(duplicadas([{ nombre: 'react', version: '18.3.1' }, { nombre: 'react', version: '18.3.1' }]), []));
prueba('varias', () => igual(duplicadas([{ nombre: 'b', version: '1' }, { nombre: 'b', version: '2' }, { nombre: 'a', version: '1' }, { nombre: 'a', version: '3' }]), ['a', 'b']));
--- solución
function duplicadas(arbol) {
  const versiones = {};
  for (const { nombre, version } of arbol) (versiones[nombre] ??= new Set()).add(version);
  return Object.keys(versiones).filter((n) => versiones[n].size > 1).sort();
}
```

```practica
elige :: ¿Qué pasó con las dos copias de React? :: Nada :: `lucide-react` trajo otra versión y la página fallaba; se obligó a usar una sola, la de la app :: Se dejaron las dos
escribe :: Nombra una decisión que se tomó para no tener código repetido. :: Compartir splitProfitBars, fuelRegisterPlan, periodPillOptions o tanksInPeriod entre la app y la web; un solo motor de animación (animatePopoverOpen); la clase tile-inset.
vf :: El corte para "todo en una pantalla" se bajó a 640 de alto en el motor
```

> 🔁 **Repaso:** una sola React; `FIT_MIN_HEIGHT` 640; clima por ubicación; `tile-inset`; un solo motor de animación; historial por período; vista Detallada/Completa.

## 13. Las pruebas de contrato (el consejo de LinkedIn)

> 🎙️ **El profesor:** la última parte es mi favorita, porque muestra cómo un consejo de otro ingeniero encontró un **error real**.

> 🌎 **En la vida real:** Es como dos cajeros que cuentan la misma caja con la misma calculadora pero llegan a totales distintos: el problema está en cómo juntan los billetes.

> 🌎 **Otro ejemplo:** Es como comparar el resumen del banco con tu libreta: los dos deberían dar el mismo saldo; si no, alguien anotó mal.

Cuando la web se publicó en LinkedIn, un ingeniero (Principal Engineer) comentó: *"yo pondría pruebas de contrato en los cálculos de ganancias y gastos, para detectar cualquier diferencia entre la web y el móvil"*.

### El problema que vio

> 🌎 **En la vida real:** Es como dos cocineros con la misma receta que llegan a platos distintos porque uno mide la harina con taza y el otro con balanza.

> 🌎 **Otro ejemplo:** Es como dos personas que suman las mismas facturas, pero una cuenta dos veces la del miércoles.

La app y la web usaban **la misma calculadora**, pero cada una **juntaba los registros a su manera** antes de calcular. Si los juntan distinto, el resultado sale distinto **aunque la calculadora sea la misma**.

### Qué es una prueba de contrato

> 🌎 **En la vida real:** Es como darle el mismo examen a dos alumnos y exigir que lleguen a la misma respuesta.

> 🌎 **Otro ejemplo:** Es como pesar el mismo paquete en dos balanzas: si marcan distinto, una está mal.

Le das **los mismos datos** al camino de la app y al camino de la web, y exiges que digan **exactamente el mismo número**: cada barra, el total y el promedio. El archivo es `webapp/src/__tests__/appWebContract.test.ts`, con los casos difíciles:

| Caso | Por qué es difícil |
|---|---|
| Uber a las 02:30 | Para Uber todavía es el día anterior (Tema 11) |
| Balance del día **y** registros sueltos el mismo día | La app no los cuenta dos veces |
| Un ajuste | No es ganancia nueva |
| Un gasto a las 23:59 del domingo | Borde de la semana |
| Registros en el cambio de mes | Borde del mes |

### Lo que pasó

> 🌎 **En la vida real:** Es como hacer un arqueo de caja por primera vez y descubrir que faltaban 300: el error existía desde antes, nadie lo había mirado.

> 🌎 **Otro ejemplo:** Es como pasar el dedo por un mueble que parecía limpio y encontrar polvo.

La primera vez que corrió, **la prueba falló**. El miércoles, la app decía **100** y la web **400**. La web contaba **dos veces** el día que tenía el balance del día y también registros sueltos. Era un **error real**, y ningún usuario lo había visto todavía.

### El arreglo

La forma de juntar los registros se sacó a **un solo archivo** de la app, `src/utils/financeBarEntries.ts`, que ahora usan las tres pantallas de la app (Ganancias, Gastos y Ganancia neta) **y** la web. Una regla, un lugar. Y la prueba de contrato quedó para **avisar** si algún día vuelven a separarse.

**La lección:** que los dos usen la misma calculadora **no basta**. Hay que probar **el camino completo**, desde los datos hasta el número que ve la persona.

> 🌎 **En la vida real:** dos cajeros con la misma calculadora; uno dice "vendimos 100" y el otro "400". La calculadora estaba bien: uno juntaba los tickets distinto. La prueba de contrato les da **el mismo montón de tickets** y exige el mismo número.

> 🌎 **Otro ejemplo:** Como unificar la forma de contar los votos en todas las mesas de una elección, para que nadie cuente distinto.

> 🧩 **Piezas para este ejercicio**
> - `Object.keys(totales)` saca los días presentes en un resultado. Puedes unir las claves de ambos resultados en un `Set` para revisar también los días que aparecen en uno solo.
> - `juntarApp` y `juntarWeb` llegan como funciones. Llama a ambas con los mismos registros antes de comparar los valores por día.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una prueba de contrato
lenguaje: js
pide: La app y la web juntaban los registros **distinto**. La web contaba dos veces el día que tenía un **balance del día** y también registros sueltos (la app usa solo el balance). Completa `contrato(registros, juntarApp, juntarWeb)`: pasa los mismos datos por los dos caminos y devuelve la lista de días donde dan distinto, como `'2026-11-04: app 100, web 400'`. Después arregla `juntarWeb` para que el contrato quede vacío.
--- código
function juntarApp(registros) {
  const dias = {};
  for (const r of registros) {
    const d = (dias[r.dia] ??= { balance: null, sueltos: 0 });
    if (r.tipo === 'balance') d.balance = r.valor; else d.sueltos += r.valor;
  }
  return Object.fromEntries(Object.entries(dias).map(([dia, d]) => [dia, d.balance ?? d.sueltos]));
}

function juntarWeb(registros) {
  const dias = {};
  for (const r of registros) dias[r.dia] = (dias[r.dia] ?? 0) + r.valor;
  return dias;
}

function contrato(registros, juntarApp, juntarWeb) {
  // tu código aquí
}
--- pruebas
const regs = [
  { dia: '2026-11-03', tipo: 'suelto', valor: 50 },
  { dia: '2026-11-04', tipo: 'balance', valor: 100 },
  { dia: '2026-11-04', tipo: 'suelto', valor: 300 },
];
prueba('el contrato encuentra la diferencia', () => igual(contrato(regs, juntarApp, (r) => { const d = {}; for (const x of r) d[x.dia] = (d[x.dia] ?? 0) + x.valor; return d; }), ['2026-11-04: app 100, web 400']));
prueba('con la web arreglada, no hay diferencias', () => igual(contrato(regs, juntarApp, juntarWeb), []));
--- solución
function juntarApp(registros) {
  const dias = {};
  for (const r of registros) {
    const d = (dias[r.dia] ??= { balance: null, sueltos: 0 });
    if (r.tipo === 'balance') d.balance = r.valor; else d.sueltos += r.valor;
  }
  return Object.fromEntries(Object.entries(dias).map(([dia, d]) => [dia, d.balance ?? d.sueltos]));
}

// El arreglo de verdad: una sola forma de juntar, compartida (financeBarEntries.ts).
function juntarWeb(registros) {
  return juntarApp(registros);
}

function contrato(registros, juntarApp, juntarWeb) {
  const app = juntarApp(registros);
  const web = juntarWeb(registros);
  const dias = [...new Set([...Object.keys(app), ...Object.keys(web)])].sort();
  return dias.filter((d) => app[d] !== web[d]).map((d) => `${d}: app ${app[d]}, web ${web[d]}`);
}
```

```practica
escribe :: ¿Qué es una prueba de contrato? :: Una prueba que pasa los mismos datos por dos caminos (el de la app y el de la web) y exige que den exactamente el mismo resultado.
elige :: ¿Por qué la web y la app daban números distintos si usaban la misma calculadora? :: Porque la calculadora estaba mal :: Porque cada una juntaba los registros a su manera antes de calcular :: Porque la web estaba en otro idioma
elige :: ¿Cuánto decían la app y la web el miércoles? :: 100 y 100 :: 100 y 400 :: 400 y 100
elige :: ¿Qué se hizo para que no vuelva a pasar? :: Se borró la web :: Se sacó la forma de juntar registros a un solo archivo (`financeBarEntries.ts`) y la prueba de contrato quedó como alarma :: Se copió el cálculo
vf :: Si dos partes usan la misma calculadora, no hace falta probar que den el mismo resultado
```

> 🔁 **Repaso:** prueba de contrato = mismos datos, dos caminos, mismo número. Encontró un error real (100 contra 400). Arreglo: una sola forma de juntar registros.

## Para la entrevista

> 🎙️ **El profesor:** esta es una historia muy fuerte para una entrevista: arquitectura, pruebas y aprender de un consejo. En voz alta.

> 🌎 **En la vida real:** Contar la web es como contar cómo abriste una segunda sucursal sin construir otra cocina.

> 🎤 **Entrevista:** "Cuéntame de la web de Copiloto."

<details>
<summary>Ver una buena respuesta</summary>

"Hice la versión web de mi app con React, TypeScript, Vite y Tailwind. La decisión principal fue no copiar la app: la web importa los mismos archivos de cálculos, textos y nube con un alias. Lo que solo existe en el teléfono, como el cliente de Firebase que guarda la sesión en el aparato, lo reemplazo al armar con un adaptador para el navegador: es la idea de puertos y adaptadores. Todo el diseño sale de motores con un candado que prohíbe valores a mano, y tiene pruebas, incluida una prueba de contrato que compara los números de la app y la web."

</details>

> 🎤 **Entrevista:** "Cuéntame de un error que encontraste gracias a una prueba."

<details>
<summary>Ver una buena respuesta</summary>

"Un ingeniero me sugirió pruebas de contrato entre la app y la web. Le pasé los mismos datos a los dos caminos y la prueba falló: un día la app decía 100 y la web 400, porque la web contaba dos veces un día con balance y registros sueltos. Saqué la forma de juntar los registros a un solo archivo que usan los dos, y la prueba quedó para avisar si vuelven a separarse."

</details>

```practica
escribe :: Explica en 3 frases cómo la web usa la app sin copiarla. :: Importa los mismos archivos de la app con el alias @app. Lo que solo existe en el teléfono se reemplaza al armar con un adaptador para el navegador (puertos y adaptadores). Y si un cálculo estaba escondido en una pantalla, se saca a un archivo puro que usan las dos.
```

> 🔁 **Repaso final de la clase:** la web usa la app, no la copia; React, TypeScript, Vite y Tailwind; el alias `@app`; puertos y adaptadores con un candado; datos en vivo, modelos puros y acciones; motores y candado de diseño; cómo se arma una pantalla con React; pruebas; y la prueba de contrato que encontró un error real. Próxima: **Tema 14, ¿Qué dice la Biblia? por dentro**.
