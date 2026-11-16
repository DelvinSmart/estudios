# Lección 13: Cómo hice la web de Copiloto Driver

> 🌎 **En la vida real:** hasta ahora estudiaste la tienda del teléfono. Esta lección es sobre **abrir una segunda sucursal** (la web) sin construir otra fábrica: la mercadería sale del mismo depósito.

Este es el **Tema 13** del curso. Estudia una parte por día. Abre el archivo del que habla cada parte (en `SSD_Desarrollo/Developer/copiloto-driver/webapp`) y míralo mientras lees. Primero intenta responder las preguntas sin mirar. Las respuestas están al final.

Los ejemplos están simplificados para aprender. El código real puede verse un poco distinto.

---

## Parte 1. La idea en una frase

> 🌎 **En la vida real:** además del restaurante con dos comedores: piensa en un **programa de radio que también se ve por YouTube**. El locutor, el guion y las noticias son los mismos; solo cambia la pantalla por donde lo sigues. Si el locutor corrige un dato, se corrige en los dos lados a la vez. Si la versión de YouTube tuviera su propio guion, tarde o temprano dirían cosas distintas, y el oyente no sabría a quién creer.

**Qué es:** la página web de Copiloto Driver. La persona entra con **la misma cuenta del teléfono** y ve sus números en la computadora: ganancias, gastos, ganancia neta, combustible, San, Mi cartera, el Copiloto y el menú. Todo en una sola pantalla, sin bajar.

**Lo más importante de toda la arquitectura:**

> **La web no copia el app: lo usa.** Los cálculos, los textos en 6 idiomas, las reglas y el guardado en la nube son los MISMOS archivos del app. La web solo pone la pantalla.

**Comparación:** es como **un restaurante con dos comedores**. La cocina es una sola (el app: las recetas, los cálculos). Hay un comedor pequeño (el teléfono) y uno grande (la computadora). Si el cocinero cambia una receta, sale igual en los dos comedores. Nadie tiene una cocina aparte.

**Por qué importa:** si mañana cambia cómo se calcula la ganancia neta, se cambia en un solo lugar y el teléfono y la web dan el mismo número. Si la web tuviera sus propios cálculos, tarde o temprano darían números distintos, y la persona no sabría cuál creer.

**Preguntas**
1. ¿Qué significa "la web no copia el app, lo usa"?
2. ¿Qué problema evita que los cálculos estén en un solo lugar?

---

## Parte 2. Las tecnologías

> 🌎 **En la vida real:** es el equipo de una obra:
> - **React** = los **bloques prefabricados**: armas la casa juntando piezas iguales (una tarjeta, un gráfico).
> - **TypeScript** = el **inspector de medidas**: avisa si intentas poner una puerta de 90 cm en un hueco de 70, **antes** de colocarla.
> - **Vite** = la **grúa y el camión**: mientras construyes te deja ver la obra al instante (`npm run dev`) y al final lo carga todo para la entrega (`npm run build`).
> - **Tailwind** = las **etiquetas de instrucciones** pegadas en cada pieza: "centrado", "esquinas redondeadas", en vez de un manual aparte para cada una.
> - **PostCSS / Autoprefixer** = el **traductor** que hace que las instrucciones las entiendan todos los albañiles, hablen el idioma que hablen (todos los navegadores).
> - **lucide-react** = la **caja de señales** ya dibujadas: la bomba de gasolina, el reloj.
> - **Firebase** = el **mismo depósito** que usa la tienda del teléfono.
> - **Vitest** = el inspector que revisa las cuentas de la web.
> - **Open-Meteo** = un vecino que te dice gratis qué tiempo hace.
>
> **React Native y la web** son como un mismo chef que cocina en un food truck (teléfono) y en un salón (web): sabe las mismas recetas, pero en el food truck tiene una plancha que el salón no tiene (cámara, GPS).

| Tecnología | Qué es | Para qué la usa la web |
|---|---|---|
| **React** (versión 19) | Una librería para armar pantallas con piezas (componentes) | Cada recuadro es una pieza: `StatCard`, `WeekBars`, `DonutRing`… |
| **TypeScript** | JavaScript con **tipos**: dice qué forma tiene cada dato | Si una función espera un número y le mandas un texto, avisa **antes** de abrir la página |
| **Vite** | El "motor de arranque" de la web: la sirve mientras programas y la arma para publicar | `npm run dev` la abre en `localhost:5180`; `npm run build` la arma en la carpeta `dist` |
| **Tailwind CSS** | CSS escrito como clases cortas en el HTML | `flex gap-3 rounded-lg` en vez de escribir un archivo CSS para cada caja |
| **PostCSS** y **Autoprefixer** | Ayudantes del CSS | Convierten Tailwind en CSS normal y lo hacen funcionar en todos los navegadores |
| **lucide-react** | Un paquete de íconos | La bomba de gasolina, el reloj, las flechas… |
| **Firebase** (Auth, Firestore, Functions) | La nube de Google, la MISMA del app | Entrar con la cuenta, leer y guardar los datos, preguntar al Copiloto |
| **Vitest** | Para las pruebas automáticas de la web | Revisa los cálculos de las pantallas |
| **Open-Meteo** | Un servicio gratis del clima | Los grados del encabezado (con la función del app) |

**¿Y el app?** El app del teléfono está hecho con **React Native** y **Expo**. React Native es "React para teléfonos". Por eso la web puede usar tanto del app: los dos hablan React y TypeScript. Lo que **no** se puede usar en la web son las piezas que solo existen en el teléfono (la cámara, el GPS del aparato, el almacenamiento del teléfono). Eso se resuelve en la Parte 5.

**Preguntas**
3. ¿Qué te avisa TypeScript que JavaScript solo no te avisa?
4. ¿Por qué la web puede usar código del app, si el app es para teléfono?

---

## Parte 3. El mapa de carpetas

> 🌎 **En la vida real:** es el plano de un supermercado, donde cada sector tiene **una sola tarea**:
> - `src/` (el app) = el **depósito central** con toda la mercadería.
> - `index.html` = la **puerta de entrada**: hay una sola.
> - `vite.config.ts` = las **instrucciones del encargado** de cómo se arma el local.
> - `main.tsx` = el que **enciende las luces** al abrir.
> - `App.tsx` = el **guardia** en la entrada: "¿tiene tarjeta de socio? Pase al salón; si no, vaya a la recepción".
> - `engines/` = la **oficina de diseño**: colores, tamaños y carteles oficiales.
> - `adapters/` = los **adaptadores de enchufe** para lo que viene del teléfono.
> - `data/` = la **reposición**: trae la mercadería y la acomoda; `actions/` es la **caja** donde se registra lo nuevo.
> - `ui/` = las **góndolas y estantes** que se repiten.
> - `screens/` = los **pasillos** completos.
> - `dev/` = los **productos de muestra** de la vidriera.
> - `__tests__/` = el **control de calidad**.
>
> El recorrido: el pasillo pide mercadería al reponedor, se arma con las recetas del depósito y se pone en los estantes, que solo usan los colores de la oficina de diseño.

Cada carpeta tiene **una sola tarea**.

```
copiloto-driver/
├── src/                     ← EL APP (la cocina): cálculos, textos, nube…
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
        │
        ├── engines/         ← LOS MOTORES (tema, medidas, pantallas, movimiento, idiomas)
        ├── adapters/        ← LOS ADAPTADORES (piezas del teléfono en versión web)
        ├── data/            ← LOS DATOS (leer de la nube y armar lo que se muestra)
        │   └── actions/     ← guardar: ganancias, gastos, combustible, San, ajustes
        ├── ui/              ← LAS PIEZAS (anillo, barras, tarjeta, pastilla…)
        ├── screens/         ← LAS PANTALLAS (Inicio, Combustible, San, Mi cartera, Menú)
        ├── dev/             ← los datos de ejemplo (?demo)
        └── __tests__/       ← las pruebas
```

**Cómo se lee de arriba abajo:** una **pantalla** (`screens/`) pide los datos (`data/`), los arma con los cálculos del app (`@app/utils`) y los dibuja con **piezas** (`ui/`). Las piezas solo usan los **motores** (`engines/`) para colores y medidas.

**Preguntas**
5. Si quiero cambiar cómo se ve el anillo de un recuadro, ¿en qué carpeta busco?
6. Si quiero cambiar cómo se guarda un tanqueo desde la web, ¿en qué carpeta busco?

---

## Parte 4. El atajo `@app`: usar el app sin copiarlo

> 🌎 **En la vida real:** el **alias** es como un **contacto guardado** en el teléfono: escribes "Mamá" en vez del número completo. `@app` es el contacto que apunta a la carpeta del app.
>
> Las **barras rojas y verdes** de la ganancia neta son como llenar un balde con agujero: primero el agua tiene que tapar el agujero (los gastos, en rojo); recién lo que sobra se queda en el balde (la ganancia, en verde).
>
> **La regla que se siguió**: si una receta buena estaba anotada **en el delantal** de un cocinero (escondida dentro de una pantalla), no se fotocopió para la otra sucursal: se pasó al **recetario oficial** (`src/utils`) y desde ahí la usan los dos.

En `vite.config.ts` hay un **alias** (un apodo para una carpeta):

```ts
alias: [{ find: '@app', replacement: path.join(APP, 'src') }]
```

Gracias a eso, una pantalla de la web puede escribir:

```ts
import { splitProfitBars } from '@app/utils/profitStackedBars';
```

y está usando **el mismo archivo** que usa el teléfono. No hay copia.

**Un ejemplo real:** la Ganancia neta pinta cada barra en **rojo** (lo que todavía cubre los gastos) y **verde** (lo que ya es ganancia). Esa regla vive en `src/utils/profitStackedBars.ts` y la usan el app (`LucroScreen`) y la web (`Overview`):

```ts
// Gastos de la semana: 1500. Ganancias: 500, 500, 400, 400.
// El jueves: 100 en rojo (termina de cubrir) y 300 en verde.
splitProfitBars(dias, 1500);
```

Otros archivos compartidos de esta forma: `fuelRegisterPlan.ts` (las reglas de registrar combustible), `periodPillOptions.ts` (la lista de semanas y meses), `fuelTankHistoryPeriod.ts` (el historial de tanques por mes) y todos los textos en `src/i18n`.

**La regla que se siguió:** cuando la web necesitaba un cálculo que estaba **escondido dentro de una pantalla del app**, no se copió. Se **sacó a un archivo puro** en `src/utils`, el app se cambió para usarlo, y la web lo usó también. Así nunca hay dos versiones.

**Preguntas**
7. ¿Qué hace el alias `@app`?
8. Si la web necesita un cálculo que solo existe dentro de una pantalla del app, ¿qué se hace?

---

## Parte 5. Puertos y adaptadores (el enchufe)

> 🌎 **En la vida real:** la lección usa el adaptador de enchufe para viajar. Otro ejemplo: un **DJ** que lleva la misma música (el centro) a una fiesta en casa y a una discoteca. En casa la conecta a un parlante Bluetooth; en la discoteca, a la consola grande. La música no cambia; cambia el **cable**.
>
> **El candado**: es como el aeropuerto que no te deja subir con un líquido de más de 100 ml. Si alguien intenta meter en la web una pieza que solo funciona en el teléfono (como la cámara), lo paran en el control con un cartel claro, en vez de que la página explote a mitad de vuelo.

**El problema:** los módulos del app que hablan con Firebase usan un archivo, `src/services/firebaseClient.ts`, que trae piezas **del teléfono** (por ejemplo, guardar la sesión en el teléfono). El navegador no tiene esas piezas.

**La solución:** cuando Vite arma la web, **cambia ese archivo por otro** que hace lo mismo pero en el navegador: `webapp/src/adapters/firebaseClient.ts`. Mismo nombre, mismas funciones. Los módulos del app ni se enteran.

```ts
// vite.config.ts (simplificado)
const ADAPTADORES = new Map([
  ['src/services/firebaseClient.ts', 'webapp/src/adapters/firebaseClient.ts'],
]);
```

**Comparación:** es un **adaptador de enchufe** para viajar. El cargador (el módulo del app) es el mismo; solo cambias la pieza que lo conecta a la pared (teléfono o navegador).

Esto se llama **puertos y adaptadores** (o arquitectura hexagonal, que viste en el Tema 10): el centro (los cálculos) no sabe dónde corre; los bordes (los adaptadores) sí.

**El candado:** si algún archivo de la web llega a pedir una pieza que solo existe en el teléfono, **la compilación se detiene** con un mensaje claro:

```
La web no puede usar piezas del teléfono: "expo-camera" …
Usa un adaptador en webapp/src/adapters o un módulo puro de src/.
```

Así es imposible que la web se rompa en silencio por usar algo del teléfono.

**Preguntas**
9. ¿Por qué la web no puede usar `src/services/firebaseClient.ts` tal como está?
10. ¿Qué pasa si alguien importa en la web una pieza que solo existe en el teléfono?

---

## Parte 6. Los datos: leer en vivo y guardar

> 🌎 **En la vida real:** - **Leer (suscribirse)**: es como **seguir un canal de WhatsApp**: no tienes que entrar a preguntar si hay novedades; te llegan solas. Registras un ingreso en el teléfono y la web se entera al instante.
> - **Armar (funciones puras)**: es como la **calculadora**: le das números, te da un resultado. No toca nada más, por eso es fácil de probar.
> - **Guardar**: registrar un tanqueo es como hacer una compra con factura: 1) se arma la factura según las reglas; 2) se archiva; 3) se anota el kilometraje en la libreta del carro; 4) se agrega el gasto a la cuenta; 5) se recalcula cuánto queda en el tanque.
> - **Seguridad**: la dirección de un edificio es **pública** (cualquiera la sabe), pero eso no te deja entrar a los departamentos: el **portero** (las reglas de Firestore) es el que protege.
> - **El Copiloto**: la combinación de la caja fuerte (la clave de la IA) la tiene el empleado de adentro (el servidor), nunca está pegada en la vidriera (la página).

**Leer** (`data/useUserData.ts`): usa las funciones `subscribe…` del app (`subscribeEarningStoreCloud`, `subscribeExpenseStoreCloud`…). "Subscribe" (suscribirse) significa que Firestore **avisa cada vez que algo cambia**. Si registras una ganancia en el teléfono, la web la muestra al instante, sin recargar.

**Armar** (`data/dashboardModel.ts`, `fuelModel.ts`, `walletModel.ts`…): son funciones **puras** (sin React, sin pantalla). Reciben los datos y devuelven lo que la pantalla necesita, usando los cálculos del app. Por ser puras, se pueden **probar** fácil.

**Guardar** (`data/actions/`): cada acción usa las MISMAS funciones de la nube del app. Por ejemplo, registrar un tanqueo (`actions/fuel.ts`):

1. arma el tanqueo con la regla del app (`planFuelRegister`);
2. lo guarda en la nube (`saveVehicleTrackingBundleCloud`);
3. actualiza el kilometraje del vehículo;
4. crea el gasto de combustible vinculado;
5. recalcula el balance del tanque.

**La seguridad:** la web usa la configuración **pública** de Firebase (no es un secreto). Lo que protege los datos son las **reglas de Firestore** (Tema 08): cada persona solo puede leer y escribir lo suyo.

**El Copiloto** (`data/useCopilot.ts`): usa el mismo motor del app. La pregunta va a la función de la nube `aiCopilot`. **La clave de la IA nunca está en la página**: vive en el servidor.

**Preguntas**
11. ¿Qué significa que la web esté "suscrita" a los datos?
12. ¿Por qué los "modelos" (`dashboardModel.ts`) no tienen React adentro?
13. Si la configuración de Firebase es pública, ¿qué impide que alguien lea los datos de otra persona?

---

## Parte 7. Los motores de diseño

> 🌎 **En la vida real:** es el **manual de marca** de una cadena de tiendas:
> - `theme.ts` = los **colores oficiales**, los mismos de la tienda del teléfono.
> - `remoteTheme.ts` = el **control remoto de la central**: cambias el verde en el panel y cambia en todas las sucursales.
> - `webTokens.ts` = las **medidas oficiales**: tamaño de las letras de los carteles.
> - `breakpoints.ts` = los **tamaños de local**: kiosco (teléfono), local chico (tablet), local grande (laptop), hipermercado (monitor).
> - `motion.ts` = cómo se abren las puertas automáticas: rápido, suave.
> - `i18n.tsx` / `format.ts` = los carteles en **6 idiomas** y cómo se escribe el precio: R$ 1.234,56.
>
> **El candado de diseño** es el **inspector de la franquicia**: si encuentra un cartel pintado a mano con un verde "parecido", multa. Y prohíbe armar nombres por partes (`bar-${tipo}`) porque el limpiador (Tailwind) solo deja las etiquetas que ve escritas completas; las demás las tira.

**La regla:** **ninguna pantalla escribe un color, un tamaño o una sombra a mano.** Todo sale de un motor, por su nombre.

| Motor (`engines/`) | De qué se encarga |
|---|---|
| `theme.ts` | Los **colores, radios y vidrio**. Sale del MISMO tema del app (`themeLocks.ts`) y lo convierte en variables CSS (`--c-gain-rgb`…). |
| `remoteTheme.ts` | Lee el tema que el dueño cambia en el **panel** (`appConfig/theme`). Cambias el verde en el panel y cambia en el teléfono y en la web. |
| `webTokens.ts` | Las **medidas** de la web: tamaños de letra, anillos, barras, el botón del Copiloto, transparencias, tiempos. |
| `breakpoints.ts` | Los **tamaños de pantalla**: teléfono, tablet, laptop, monitor, y `fit:` (todo cabe sin bajar). |
| `motion.ts` | El **movimiento**: entrar, salir, contar números desde cero. |
| `i18n.tsx` y `format.ts` | Los **6 idiomas** (los del app) y el formato de la moneda, los km y los %. |

**Un ejemplo:** el corte de pantalla vive en un solo lugar:

```ts
export const BREAKPOINTS = { tablet: 481, laptop: 769, monitor: 1280 };
export const FIT_MIN_HEIGHT = 640; // con este alto o más, todo cabe sin bajar
```

Si se cambia ahí, cambia en toda la web.

**El candado de diseño** (`scripts/check-design.mjs`): antes de armar la web, revisa todas las pantallas y piezas. Si encuentra un valor a mano, **falla**. Por ejemplo, prohíbe:

| Prohibido | Por qué |
|---|---|
| `#00C853` o `rgb(0, 200, 83)` | Un color a mano no cambia cuando cambia el tema |
| `text-sm`, `text-lg` | Los tamaños de letra salen del motor (`text-label`, `text-title`…) |
| `w-[312px]` | Un valor inventado, fuera del motor |
| `` `bar-${tipo}` `` | Tailwind no ve las clases armadas por partes y las borra |

**Preguntas**
14. Si el dueño cambia el color verde en el panel, ¿por qué la web cambia sola?
15. ¿Qué hace el candado de diseño si alguien escribe `text-sm`?
16. ¿Dónde se cambia el alto mínimo para que todo quepa en una pantalla?

---

## Parte 8. Tailwind y `styles.css`

> 🌎 **En la vida real:** Tailwind es como dar instrucciones cortas a alguien que acomoda muebles:
> - `flex` = "ponlos uno al lado del otro".
> - `items-center` = "alinéalos a la misma altura".
> - `gap-3` = "deja un pasito entre cada uno".
> - `rounded-lg` = "esquinas redondeadas", como una mesa sin puntas.
> - `px-3 py-2` = "deja aire a los lados y arriba y abajo", como el margen de una hoja.
> - `tablet:grid-cols-3` = "**si la sala es grande**, pon tres columnas de sillas".
>
> `styles.css` son los **muebles con nombre** que se repiten: `glass` es la vitrina de vidrio, `tile` un estante, `tile-inset` una cajita dentro del estante. Cuando se quiso que las cajitas fueran claras, se cambió **el modelo** de la cajita una vez, y cambiaron en todas las salas.

**Tailwind** escribe el diseño con clases cortas, directo en la pieza:

```tsx
<div className="flex items-center gap-3 rounded-lg px-3 py-2">
```

| Clase | Qué hace |
|---|---|
| `flex` | Pone los hijos uno al lado del otro |
| `items-center` | Los centra de arriba abajo |
| `gap-3` | Deja espacio entre ellos |
| `rounded-lg` | Esquinas redondeadas (el radio del tema) |
| `px-3 py-2` | Relleno a los lados y arriba-abajo |
| `tablet:grid-cols-3` | **Desde** tablet, tres columnas |

**`styles.css`** tiene las clases propias de Copiloto, con nombre, para lo que se repite:

| Clase | Qué es |
|---|---|
| `glass` | El vidrio: las tarjetas grandes (con difuminado y borde de luz) |
| `tile` | Un recuadro dentro del panel grande |
| `tile-inset` | Un cuadrito dentro de un recuadro (como Kilometraje y Combustible) |
| `btn btn-gain` / `btn-expense` | Los botones verde y rojo |
| `entra`, `crece`, `revela` | Los efectos de entrada |

Todas leen las variables de los motores. Por eso, cuando se pidió que los cuadritos oscuros fueran claros como el de Kilometraje, se creó **una** clase (`tile-inset`) y se cambió en todas las pantallas a la vez.

**Preguntas**
17. ¿Qué hace `laptop:grid-cols-2`?
18. ¿Por qué se creó la clase `tile-inset` en vez de cambiar el color en cada pantalla?

---

## Parte 9. Cómo se arma una pantalla: el Inicio

> 🌎 **En la vida real:** es como armar un **noticiero**:
> 1. **Recibir los datos** = llegan las noticias de los reporteros.
> 2. **Armar el modelo** = el editor las ordena y resume. `useMemo` es el editor que **no vuelve a escribir** el resumen si no llegó ninguna noticia nueva.
> 3. **Dibujar con piezas** = el presentador lee cada bloque en su cartel: "Ganancias", "Gastos".
>
> **Estado (`useState`)**: es el **control remoto** del televidente: "vista detallada" o "completa", "semana" o "mes". Cambias de canal y solo cambia esa parte de la pantalla.
>
> **La `key`**: es como la **cédula** de una persona. Si cada vez que cambias de Semana a Mes le das al recuadro una cédula nueva, React cree que llegó **otra persona** y la hace entrar de nuevo por la puerta. La solución fue darle la cédula nueva solo al gráfico de adentro: el recuadro (la persona) se queda sentado; solo cambia lo que tiene en la mano.

Mira `screens/Overview.tsx`. Sigue siempre el mismo camino:

```
datos (useUserData)  →  modelo puro (buildDashboardModel)  →  piezas (StatCard, WeekBars…)
```

1. **Recibe los datos** de la persona.
2. **Arma el modelo** con `useMemo` (un "recuerda este cálculo y no lo repitas si los datos no cambiaron"):

   ```tsx
   const model = useMemo(() => buildDashboardModel({ ...data, now }), [data, now]);
   ```

3. **Dibuja con piezas**, pasándoles solo lo que necesitan:

   ```tsx
   <StatCard label="Ganancias" value={model.earnings} tone="gain" />
   ```

**Estado** (`useState`): lo que la persona elige en la pantalla. Por ejemplo, en Estadísticas:

```tsx
const [statsView, setStatsView] = useState('detailed'); // Detallada o Completa
const [statsPeriod, setStatsPeriod] = useState('week'); // Semana o Mes
```

Cuando la persona toca "Completa", cambia el estado y React vuelve a dibujar solo esa parte.

**Un detalle que se corrigió:** al cambiar de Semana a Mes, los recuadros **desaparecían y volvían a entrar**. La causa era una `key` (una "cédula" que React usa para saber si una pieza es la misma) que cambiaba con el período. React creía que era una pieza nueva y la volvía a montar. Se movió la `key` solo al gráfico de adentro: el recuadro se queda quieto y solo cambian las barras.

**Preguntas**
19. ¿Cuáles son los tres pasos con que se arma una pantalla?
20. ¿Para qué sirve `useMemo`?
21. ¿Por qué el recuadro volvía a aparecer al cambiar de Semana a Mes?

---

## Parte 10. Pruebas y revisiones

> 🌎 **En la vida real:** es la **inspección final** antes de entregar un departamento:
> - `check:design` = ¿alguien pintó una pared con un color que no es el oficial?
> - `tsc` = ¿todas las puertas encajan en sus marcos?
> - `vitest` = ¿las cuentas de la luz y el agua dan bien?
> - `build` = ¿se puede armar todo el edificio completo?
> - `npm test` del app = como la web usa la **misma cañería** que el teléfono, si alguien toca un caño hay que revisar los dos departamentos.
>
> La prueba del ejemplo es como revisar que **la suma de las 4 semanas dé el total del mes** en tu libreta. Si no da, alguien se equivocó al copiar.

Antes de guardar cada cambio se corre:

| Comando | Qué revisa |
|---|---|
| `npm run check:design` | Que no haya valores a mano (el candado) |
| `npx tsc --noEmit` | TypeScript: que los tipos encajen en toda la web |
| `npx vitest run` | Las pruebas de la web (los modelos y los motores) |
| `npm run build` | Que la web se arme completa (corre las tres de arriba primero) |
| `npm test` (en el app) | Las pruebas del app, porque la web usa su código |

**Un ejemplo de prueba** (`__tests__/dashboardModel.test.ts`):

```ts
it('Estadísticas por mes: una barra por semana y el mismo total del mes', () => {
  const mes = buildPeriodBars({ kind: 'earnings', period: 'month', ... });
  expect(mes.days[0].dayLabel).toBe('S1');
  expect(mes.totalBrl).toBeCloseTo(mes.days.reduce((s, d) => s + d.totalBrl, 0));
});
```

Lee así: "el total del mes tiene que ser la suma de las barras". Si alguien rompe el cálculo, esta prueba falla.

**Preguntas**
22. ¿Por qué hay que correr también las pruebas del app cuando se cambia la web?
23. ¿Qué revisa la prueba de arriba?

---

## Parte 11. Verla, en la Mac y en el celular

> 🌎 **En la vida real:** - `npm run dev` = abrir la tienda **solo para ti**, en tu casa.
> - `?demo` = la vidriera con **productos de muestra**, sin datos de nadie.
> - `--host` = abrir la puerta para que entren **los de la casa** (otros aparatos del mismo Wi-Fi), pero no los de la calle.
> - `npm run build` = empaquetar la tienda para mudarla.
>
> ¿Por qué no abre con la Mac apagada? Porque la Mac es **el que atiende el mostrador**. Si se va a dormir, nadie atiende. Para estar abierto siempre, hay que alquilar un local en la calle (publicar en Firebase Hosting).

| Para… | Comando o dirección |
|---|---|
| Abrirla en la Mac | `cd webapp && npm run dev` → `http://localhost:5180` |
| Verla con datos de ejemplo | `http://localhost:5180/?demo` (solo en la Mac, no en la versión publicada) |
| Verla en el celular (mismo Wi-Fi) | `npm run dev -- --host` → la dirección que dice **Network** (ej. `http://192.168.0.96:5180`) |
| Armarla para publicar | `npm run build` → la carpeta `dist` |

`--host` le dice a Vite: "acepta visitas de otros aparatos de la casa", no solo de esta Mac. Mientras la Mac esté apagada, la página no abre en el celular. Para verla desde cualquier lugar, habría que **publicarla** (por ejemplo en Firebase Hosting, donde ya están la landing y el panel). Eso todavía no se hizo.

**Preguntas**
24. ¿Para qué sirve `--host`?
25. ¿Por qué la página no abre en el celular cuando la Mac está apagada?

---

## Parte 12. Decisiones que se tomaron (y lo que salió mal)

> 🌎 **En la vida real:** - **Dos copias de React**: es como tener **dos directores** dando órdenes distintas a la misma orquesta: suena mal. Se decidió que hay un solo director: el del app.
> - **El Inicio no cabía**: como un mueble de 760 cm en una pared de 754: se ajustó la medida a 640 en el plano oficial.
> - **El clima no aparecía**: buscaba la ciudad en una ficha vacía. Ahora, como el teléfono, primero pregunta "¿dónde estás?" y, si no, mira la ficha.
> - **Cuadritos oscuros**: se hizo **un** modelo de cajita clara para todos.
> - **La lista que rebotaba**: el mismo resorte estaba **copiado** en dos lugares; se dejó uno solo, más suave.
> - **Historial de tanques infinito**: como un extracto bancario de 10 años en una sola hoja; ahora se ve por mes o por semana.
> - **Gráficos pequeños**: como tres televisores chicos en la misma pared: ahora uno grande, y los otros si los pides.

| Qué pasó | Qué se decidió |
|---|---|
| `lucide-react` (los íconos) trajo **su propia copia de React** (19.3.1). Con dos React distintos, la página fallaba. | En `vite.config.ts` se obliga a usar **una sola React**: la del app. |
| El Inicio no cabía en la laptop (1470 × 754): el corte para "todo en una pantalla" era 760 de alto. | Se bajó a **640** en el motor (`FIT_MIN_HEIGHT`) y todas las páginas caben. |
| El clima no aparecía: solo buscaba la ciudad de los ajustes, y estaba vacía. | Como el app: primero **la ubicación del navegador** y, si no, la ciudad (también "Ciudad, Estado"). |
| Los cuadritos de adentro eran **oscuros** y no combinaban con los de Kilometraje. | Una clase nueva, `tile-inset`, con el vidrio claro, en todas las pantallas. |
| La lista de fechas del app **rebotaba** varias veces y caía seca. Ese código estaba **copiado** en dos lugares. | Un solo motor (`animatePopoverOpen` en `springAnimation.ts`) con un aparecer corto y sin rebote. |
| El historial de tanques mostraba **todos** los tanques: con muchos sería imposible usarlo. | Por **mes o semana**, con una regla compartida (`tanksInPeriod`) en el app y en la web. |
| Con los tres gráficos de Estadísticas a la vez, las barras se veían pequeñas. | Botón **Detallada / Completa**: el gráfico de 30 días como principal y los tres por semana o mes como opción. |

**Preguntas**
26. ¿Qué pasó con las dos copias de React y cómo se arregló?
27. Nombra una decisión que se tomó para no tener código repetido.

## Parte 13. Las pruebas de contrato (el consejo de LinkedIn)

> 🌎 **En la vida real:** imagina **dos cajeros** con **la misma calculadora**. Al final del día, uno dice "vendimos 100" y el otro "vendimos 400". La calculadora estaba bien: el problema es que uno de ellos **juntaba los tickets distinto** y contaba dos veces los del miércoles.
>
> La **prueba de contrato** es darles a los dos cajeros **el mismo montón de tickets** y exigir que digan exactamente el mismo número. Los tickets de prueba incluyen los difíciles: el de las 02:30 de Uber (que es "de ayer"), el ajuste (que no es venta) y el de las 23:59 del domingo (justo en el borde de la semana).
>
> El arreglo fue escribir **una sola forma de juntar tickets** que usan los dos cajeros. Y la prueba queda como un **auditor** que, si algún día vuelven a separarse, avisa.

Cuando publiqué la web en LinkedIn, un ingeniero (Principal Engineer) comentó: *"yo pondría pruebas de contrato en los cálculos de ganancias y gastos, para detectar cualquier diferencia entre la web y el móvil"*.

**El problema que vio:** el app y la web usan la misma calculadora, pero cada uno **juntaba los registros a su manera** antes de calcular. Si uno los junta distinto, el resultado sale distinto aunque la calculadora sea la misma.

**Qué es una prueba de contrato:** le das **los mismos datos** al camino del app y al camino de la web, y exiges que digan **exactamente el mismo número**: cada barra, el total y el promedio.

El archivo es `webapp/src/__tests__/appWebContract.test.ts`. Los datos de prueba tienen los casos difíciles:

| Caso | Por qué es difícil |
|---|---|
| Uber a las 02:30 | Para Uber todavía es el día anterior (su día cambia a las 04:00) |
| Balance del día **y** registros sueltos el mismo día | El app no los cuenta dos veces |
| Un ajuste | No es ganancia nueva |
| Un gasto a las 23:59 del domingo | Está en el borde de la semana |
| Registros en el cambio de mes | Están en el borde del mes |

**Lo que pasó:** la primera vez que corrió, **la prueba falló**. El miércoles, el app decía **100** y la web **400**. La web contaba dos veces el día que tenía el balance del día y también registros sueltos. Era un error real, y ningún usuario lo había visto todavía.

**El arreglo:** saqué la forma de juntar los registros a un solo archivo del app, `src/utils/financeBarEntries.ts`, y ahora lo usan las tres pantallas del app (Ganancias, Gastos y Ganancia neta) y la web. Una regla, un lugar. La prueba de contrato quedó para avisar si algún día vuelven a separarse.

**La lección:** que los dos usen la misma calculadora no basta. Hay que probar el camino completo, desde los datos hasta el número que ve la persona.

**Preguntas**
28. ¿Qué es una prueba de contrato?
29. ¿Por qué la web y el app daban números distintos si usaban la misma calculadora?
30. ¿Qué se hizo para que no vuelva a pasar?

---

## Respuestas

> 🌎 **En la vida real:** son las respuestas del final del libro. Míralas **después** de intentarlo, como cuando corriges tu propio examen con la hoja del profesor.

1. Que la web usa los mismos archivos del app (cálculos, textos, nube) en vez de tener sus propias copias. La web solo pone la pantalla.
2. Que el teléfono y la web den números distintos para lo mismo.
3. Que un dato no tiene la forma esperada (por ejemplo, un texto donde iba un número), antes de abrir la página.
4. Porque el app está hecho con React Native, que usa React y TypeScript igual que la web. Solo no se pueden usar las piezas que existen únicamente en el teléfono.
5. En `webapp/src/ui/` (`DonutRing.tsx`).
6. En `webapp/src/data/actions/` (`fuel.ts`), que usa la regla del app `src/utils/fuelRegisterPlan.ts`.
7. Es un apodo: `@app` significa la carpeta `src/` del app. Así la web importa archivos del app sin copiarlos.
8. Se saca a un archivo puro en `src/utils`, el app se cambia para usarlo y la web lo usa también.
9. Porque trae piezas del teléfono (como guardar la sesión en el teléfono) que el navegador no tiene.
10. La compilación se detiene con un mensaje que dice qué pieza es y qué hacer.
11. Que Firestore le avisa cada vez que algo cambia, y la web lo muestra al instante sin recargar.
12. Para que sean fáciles de probar y se puedan usar en cualquier pantalla: reciben datos y devuelven datos, sin dibujar nada.
13. Las reglas de Firestore: cada persona solo puede leer y escribir lo suyo.
14. Porque la web lee el mismo tema del panel (`remoteTheme.ts`) y lo convierte en variables CSS que usan todas las clases.
15. Falla y dice dónde está; hay que usar un tamaño del motor (`text-label`, `text-title`…).
16. En `webapp/src/engines/breakpoints.ts` (`FIT_MIN_HEIGHT`).
17. Desde el ancho de laptop en adelante, pone dos columnas.
18. Para cambiarlo en un solo lugar: todas las pantallas que usan `tile-inset` cambian a la vez.
19. Recibir los datos, armar el modelo puro y dibujarlo con piezas.
20. Para recordar un cálculo y no repetirlo si los datos no cambiaron.
21. Porque la `key` del recuadro cambiaba con el período, y React creía que era una pieza nueva y la volvía a montar.
22. Porque la web usa el código del app: si un cambio rompe el app, también puede romper la web, y al revés.
23. Que por mes la primera barra se llame "S1" y que el total del mes sea la suma de las barras.
24. Para que la página acepte visitas de otros aparatos de la misma red, como el celular.
25. Porque la página la está sirviendo la Mac; si se apaga, no hay quién la sirva.
26. `lucide-react` trajo otra versión de React y con dos copias la página fallaba. Se obligó a usar una sola, la del app, en `vite.config.ts`.
27. Por ejemplo: `splitProfitBars`, `fuelRegisterPlan`, `periodPillOptions` y `tanksInPeriod` compartidos entre app y web; el motor de animación `animatePopoverOpen`; la clase `tile-inset`.
28. Una prueba que pasa los mismos datos por dos caminos (el del app y el de la web) y exige que den exactamente el mismo resultado.
29. Porque cada uno juntaba los registros a su manera antes de calcular: la web contaba dos veces el día con balance del día y registros sueltos.
30. Se sacó la forma de juntar los registros a un solo archivo (`financeBarEntries.ts`) que usan el app y la web, y la prueba de contrato avisa si vuelven a separarse.
