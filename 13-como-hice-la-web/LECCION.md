# Lección 13: Cómo hice la web de Copiloto Driver

Este es el **Tema 13** del curso. Estudia una parte por día. Abre el archivo del que habla cada parte (en `SSD_Desarrollo/Developer/copiloto-driver/webapp`) y míralo mientras lees. Primero intenta responder las preguntas sin mirar. Las respuestas están al final.

Los ejemplos están simplificados para aprender. El código real puede verse un poco distinto.

---

## Parte 1. La idea en una frase

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

---

## Respuestas

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
