# IA para programadores 10: proyecto final, construir una app dirigiendo a la IA

> 🌎 **En la vida real:** el director de una obra no pone ladrillos, pero la obra sale bien por él: hizo el plano, dejó escrito el reglamento, dio una tarea a la vez, y revisó cada pared antes de la siguiente. Esta clase es tu primera obra dirigida de punta a punta.

> 🎙️ **El profesor dice:** {{alumno}}, en este curso aprendiste cada pieza por separado: pedir bien (clase 31), las reglas del proyecto (32), revisar sin confiar (34), el flujo de siete pasos (35) y planificar (79). Hoy las juntas en **una app chica, construida dirigiendo a la IA**: un recordatorio de mantenimiento del carro. Lo importante no es la app: es **el proceso**, que quedó escrito paso a paso para que lo copies con tu propia idea. Y vas a ver algo que se repite en todo el curso: las pruebas pasaban, y aun así la **revisión** encontró cuatro cosas.

**Lo que hay** (en la carpeta `92-ia-proyecto-dirigir-la-ia/proyecto` de este mismo repositorio):

| Archivo | Qué es | Cuándo se escribió |
|---|---|---|
| `PLAN.md` | Las ocho piezas, las puertas y ventanas, y los cambios al plan | **Antes** de cualquier código |
| `AGENTS.md` (y `CLAUDE.md`, que lo apunta) | Las reglas para la IA | **Antes** de cualquier código |
| `PEDIDOS.md` | Cada pedido, lo que volvió, lo que se revisó y lo que se corrigió | Durante, paso por paso |
| `src/` y los `.css` | La app: lógica, datos, pantalla, director y motor de diseño | Un paso del plan por pedido |
| `test/` | 21 pruebas con `node:test` | Con cada paso, **antes** del código |

```bash
cd estudios/92-ia-proyecto-dirigir-la-ia/proyecto
npm test     # 21 en verde
npm start    # http://127.0.0.1:8000
```

## Parte 1. El plan y las reglas, antes de la primera línea

El proyecto empezó con dos archivos y **ningún código**.

**`PLAN.md`** tiene las ocho piezas de la clase 79. Lo que más importa:

- **Lo que NO va:** varios carros, avisos en el teléfono, la nube. Sin esta lista, la IA "mejora" la app con cosas que nadie pidió.
- **Cómo sé que funciona,** con un ejemplo de números: *"un aceite de cada 5.000 km o 6 meses, hecho a los 80.000 km el 1 de agosto: a los 84.700 km dice pronto (faltan 300 km)"*. Ese ejemplo se volvió **la primera prueba**.
- **Las puertas y ventanas:** vacío, error al guardar, datos raros, el carro que "anda hacia atrás", tocar dos veces, borrar, **las fechas difíciles** (el 31 de enero más un mes), el celular y la seguridad.

**`AGENTS.md`** son las reglas cortas que la IA lee al empezar cada sesión: sin librerías, una tarea por archivo, ningún color fuera de `motor.css`, `textContent` y nunca `innerHTML`, la prueba antes de darlo por terminado, un paso por pedido, y **no hacer commit ni push** (eso lo decide la persona).

Con eso, cada pedido pudo ser corto: *"Lee PLAN.md y AGENTS.md. Haz el paso 1 del plan."*

> 🌎 **En la vida real:** el plano y el reglamento de la obra se pegan en la pared del obrador antes de que llegue el primer obrero. Así, el que llega a la mañana no pregunta qué hacer: lee la pared.

> 🌎 **Otro ejemplo:** el ejemplo con números del plan es como la foto del plato terminado en la receta: no dice "que quede rico", dice exactamente cómo tiene que verse.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El pedido sale del plan
lenguaje: js
pide: Completa `pedidoDelPaso(plan, n)`: arma el pedido para el paso `n` (desde 1) de `plan.orden`, en tres líneas: `Lee PLAN.md y AGENTS.md.`, `Haz el paso N del plan: …` (el texto del paso) y `Terminado = npm test en verde y lo pruebo en la pantalla.`. Si el paso no existe, lanza `Error('El plan no tiene el paso N')`.
--- código
function pedidoDelPaso(plan, n) {
  // tu código aquí
}
--- pruebas
const plan = { orden: ['la lógica, con sus pruebas', 'guardar y leer, con sus pruebas', 'la pantalla, el motor y el director'] };
prueba('el paso 1', () => igual(pedidoDelPaso(plan, 1), 'Lee PLAN.md y AGENTS.md.\nHaz el paso 1 del plan: la lógica, con sus pruebas\nTerminado = npm test en verde y lo pruebo en la pantalla.'));
prueba('el paso 3', () => igual(pedidoDelPaso(plan, 3).split('\n')[1], 'Haz el paso 3 del plan: la pantalla, el motor y el director'));
prueba('un paso que no existe', () => igual([0, 4].map((n) => { try { pedidoDelPaso(plan, n); return 'no lanzó'; } catch (e) { return e.message; } }), ['El plan no tiene el paso 0', 'El plan no tiene el paso 4']));
--- solución
function pedidoDelPaso(plan, n) {
  const paso = plan.orden[n - 1];
  if (n < 1 || paso === undefined) throw new Error(`El plan no tiene el paso ${n}`);
  return ['Lee PLAN.md y AGENTS.md.', `Haz el paso ${n} del plan: ${paso}`, 'Terminado = npm test en verde y lo pruebo en la pantalla.'].join('\n');
}
```

```practica
vf :: En este proyecto, el plan y las reglas se escribieron antes de la primera línea de código
vf :: Con un buen plan, no hace falta decir qué NO va en la app
elige :: ¿De dónde salió la primera prueba de la lógica? :: De lo que propuso la IA :: Del ejemplo con números de la sección 8 del plan :: De internet
elige :: ¿Por qué AGENTS.md dice "no hagas commit ni push"? :: Porque la IA no sabe usar Git :: Porque guardar y publicar lo decide la persona, después de revisar :: Para gastar menos tokens
escribe :: Escribe las dos primeras cosas que harías antes de pedirle código a una IA para tu propia app. :: Escribir el plan (qué problema resuelve, qué hace, qué no va, los datos, las pantallas, las piezas, el orden, cómo sé que funciona y las puertas y ventanas) y escribir las reglas del proyecto en AGENTS.md o CLAUDE.md, para que cada sesión las lea al empezar.
```

## Parte 2. Las reglas en acción: revisar un cambio contra AGENTS.md

Las reglas no sirven si nadie las revisa. Cada vez que volvía un cambio, se miraba contra `AGENTS.md`, además de la lista de la clase 34:

| Regla | Cómo se revisa |
|---|---|
| Sin librerías | ¿Hay un `import` que no empieza con `./`? ¿Cambió `package.json`? |
| Ningún color a mano | ¿Hay un `#…` fuera de `motor.css`? |
| `textContent`, nunca `innerHTML` | Buscar `innerHTML` en `src/` |
| La prueba antes | ¿Cambió la lógica sin cambiar `test/`? |
| Un paso por pedido | `git diff --stat`: ¿tocó archivos de otro paso? |

En este proyecto la IA las respetó. Pero **revisar no es desconfiar por desconfiar**: es lo único que te deja decir "lo comprobé" en vez de "debería estar bien".

> 🌎 **En la vida real:** el inspector de obra lleva su lista y mira lo mismo en cada visita: los cables, los caños, la altura de los enchufes. No es que piense que el obrero es malo: es que la lista no se cansa ni se olvida.

> 🌎 **Otro ejemplo:** es como el control de la aduana: no revisan solo a los sospechosos, revisan con la misma lista a todos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿El cambio respeta las reglas?
lenguaje: js
pide: Completa `reglasRotas(archivos)`: recibe los archivos que cambió la IA como `{ ruta, contenido }` y devuelve los avisos, sin repetir, en este orden: `'usa innerHTML'` (en un archivo de `src/`); `'color fuera del motor'` (un `#` con 3 o 6 letras/números en un `.css` que no es `motor.css`); `'agrega una librería'` (un `import … from '…'` cuyo origen no empieza con `./` o `../`); `'cambia la lógica sin pruebas'` (cambió `src/logica.mjs` y ningún archivo de `test/`).
--- código
function reglasRotas(archivos) {
  // tu código aquí
}
--- pruebas
prueba('un cambio limpio', () => igual(reglasRotas([{ ruta: 'src/logica.mjs', contenido: "import { x } from './util.mjs';" }, { ruta: 'test/logica.test.mjs', contenido: '' }, { ruta: 'motor.css', contenido: ':root { --acento: #7ee787; }' }]), []));
prueba('rompe todas', () => igual(reglasRotas([
  { ruta: 'src/pantalla.mjs', contenido: "import dayjs from 'dayjs';\nli.innerHTML = m.nombre;" },
  { ruta: 'estilos.css', contenido: '.boton { background: #00ff00; }' },
  { ruta: 'src/logica.mjs', contenido: '// otra regla' },
]), ['usa innerHTML', 'color fuera del motor', 'agrega una librería', 'cambia la lógica sin pruebas']));
prueba('un color en motor.css está bien', () => igual(reglasRotas([{ ruta: 'motor.css', contenido: '--fondo: #0f141b;' }]), []));
--- solución
function reglasRotas(archivos) {
  const avisos = new Set();
  for (const { ruta, contenido } of archivos) {
    if (ruta.startsWith('src/') && contenido.includes('innerHTML')) avisos.add('usa innerHTML');
    if (ruta.endsWith('.css') && ruta !== 'motor.css' && /#([0-9a-f]{6}|[0-9a-f]{3})\b/i.test(contenido)) avisos.add('color fuera del motor');
    for (const m of contenido.matchAll(/import\s.*?from\s+['"]([^'"]+)['"]/g)) if (!m[1].startsWith('./') && !m[1].startsWith('../')) avisos.add('agrega una librería');
  }
  const tocaLogica = archivos.some((a) => a.ruta === 'src/logica.mjs');
  const tocaPruebas = archivos.some((a) => a.ruta.startsWith('test/'));
  if (tocaLogica && !tocaPruebas) avisos.add('cambia la lógica sin pruebas');
  return ['usa innerHTML', 'color fuera del motor', 'agrega una librería', 'cambia la lógica sin pruebas'].filter((a) => avisos.has(a));
}
```

```practica
vf :: Si la IA respetó las reglas esta vez, la próxima ya no hace falta revisar
vf :: Un import que no empieza con ./ o ../ en este proyecto quiere decir que se agregó una librería
elige :: ¿Cómo se ve si la IA tocó archivos de otro paso? :: Preguntándole :: Con git diff --stat, mirando qué archivos cambiaron :: No se puede ver
elige :: ¿Por qué la regla es textContent y nunca innerHTML? :: Porque es más rápido :: Porque lo que escribe la persona se mostraría como HTML y podría correr código (XSS) :: Porque innerHTML no existe
escribe :: Nombra tres reglas de AGENTS.md de este proyecto y cómo revisarías cada una en un cambio. :: Sin librerías: mirar los import y si cambió package.json. Ningún color a mano: buscar # fuera de motor.css. textContent y no innerHTML: buscar innerHTML en src/. (También: prueba antes, un paso por pedido.)
```

## Parte 3. El pedido 1: la lógica, y lo que encontró la revisión

El primer pedido fue el paso 1 del plan: la lógica, **primero las pruebas** (sacadas del plan) y después el código. Las 12 pruebas pasaron a la primera.

Una de las puertas del plan eran **las fechas difíciles**. El aceite se cambia "cada 6 meses", pero ¿qué es "un mes después del 31 de enero"? JavaScript, si le pides el 31 de febrero, salta al 3 de marzo. Lo correcto es **el último día de febrero**:

```js
export function sumarMeses(fecha, meses) {
  const [a, m, d] = fecha.split('-').map(Number);
  const total = m - 1 + meses;
  const anio = a + Math.floor(total / 12);
  const mes = total % 12; // 0 = enero
  const ultimoDia = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate(); // el día 0 del mes siguiente = el último de este
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(Math.min(d, ultimoDia)).padStart(2, '0')}`;
}
```

El truco del **día 0**: `Date.UTC(2026, 2, 0)` es "el día antes del 1 de marzo", o sea, el último de febrero.

Y aquí vino lo importante. **Que pasen las pruebas no quiere decir que esté bien.** Se leyó el código como si lo hubiera escrito un desconocido (clase 34), buscando lo que nadie puso en una prueba, y aparecieron dos cosas:

1. **Justo en el borde** decía *"se pasó por 0 km"* y *"venció hace 0 días"*. Ahora dice **"toca hoy"**.
2. **El vacío pasaba como cero** (Parte 4).

Para cada una: un pedido de corrección, **primero la prueba en rojo**, después el arreglo, y en verde.

> 🌎 **En la vida real:** el inspector no se conforma con que la casa "se vea bien": abre todas las canillas a la vez y prende todas las luces. Ahí aparece lo que nadie probó.

> 🌎 **Otro ejemplo:** el día 0 es como preguntar "¿qué día es el anterior al 1 de marzo?": no hace falta saber si febrero tiene 28 o 29, el calendario te lo dice.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un mes después del 31 de enero
lenguaje: js
pide: Completa `sumarMeses(fecha, meses)`: suma meses a una fecha `AAAA-MM-DD`. Si el mes de llegada no tiene ese día, queda en **el último día** de ese mes (no se pasa al siguiente). Pista: `new Date(Date.UTC(año, mes + 1, 0)).getUTCDate()` da cuántos días tiene el mes `mes` (contando enero como 0).
--- código
function sumarMeses(fecha, meses) {
  // tu código aquí
}
--- pruebas
prueba('un caso normal', () => igual(sumarMeses('2026-08-01', 6), '2027-02-01'));
prueba('el 31 de enero, un mes después', () => igual(sumarMeses('2026-01-31', 1), '2026-02-28'));
prueba('en un año bisiesto', () => igual(sumarMeses('2028-01-31', 1), '2028-02-29'));
prueba('cambia de año', () => igual(sumarMeses('2026-11-15', 3), '2027-02-15'));
prueba('el 31 de agosto, 6 meses después', () => igual(sumarMeses('2026-08-31', 6), '2027-02-28'));
--- solución
function sumarMeses(fecha, meses) {
  const [a, m, d] = fecha.split('-').map(Number);
  const total = m - 1 + meses;
  const anio = a + Math.floor(total / 12);
  const mes = total % 12;
  const ultimoDia = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
  const dia = Math.min(d, ultimoDia);
  return `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}
```

```practica
vf :: En este proyecto, las 12 pruebas del pedido 1 pasaron a la primera, y aun así la revisión encontró errores
vf :: Si a una fecha del 31 de enero le sumas un mes con JavaScript sin cuidado, puede quedar en el 3 de marzo
elige :: ¿Qué es Date.UTC(2026, 2, 0)? :: El 0 de marzo, un error :: El último día de febrero de 2026 :: El 1 de marzo
elige :: Cuando la revisión encontró el problema del borde, ¿qué se hizo primero? :: Arreglar el código :: Escribir la prueba que lo atrapa, y verla en rojo :: Borrar la prueba vieja
escribe :: ¿Por qué las pruebas sacadas del plan no alcanzan, y qué se hace además? :: Porque solo revisan los casos que se pensaron. Además hay que leer el código como si lo hubiera escrito un desconocido, buscando los bordes y los casos que nadie puso, y por cada uno escribir la prueba en rojo antes de arreglarlo.
```

## Parte 4. El vacío no es cero

El segundo error de la revisión es de los más traicioneros de JavaScript. La validación decía:

```js
if (!(ultimoKm >= 0)) problemas.push('Los km tienen que ser un número mayor que 0');
```

Parece bien. Pero si la persona deja **vacía** la caja "Km del último cambio", `ultimoKm` vale `null`, y en JavaScript **`null >= 0` es `true`**. El vacío pasaba como si el último cambio hubiera sido a los **0 km**, y la app iba a decir que el aceite estaba vencido por 85.000 km.

El arreglo separa los dos casos, el **vacío** y el **número malo**, y se dio cuenta de algo más: el seguro va **solo por meses**, así que no necesita km. Eso cambió una decisión del plan, y quedó escrito en **"Cambios al plan"**, con su fecha y su motivo (clase 79):

```js
if (cadaKm !== null && ultimoKm === null) problemas.push('Escribe los km del último cambio');
```

> 🌎 **En la vida real:** dejar en blanco "último cambio de aceite" en la ficha del taller no quiere decir "a los 0 km": quiere decir "no sé". Un mecánico que lo lea como 0 te va a cambiar el aceite de un carro nuevo.

> 🌎 **Otro ejemplo:** es la diferencia entre "no contestó" y "contestó cero" en una encuesta: los dos se ven vacíos en la planilla, pero dicen cosas opuestas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El vacío no es cero
lenguaje: js
pide: Completa `leerKm(texto)`: `null` si el texto está vacío (o solo espacios); si no, el número (con `Number`). Y `problemaDeKm(texto, vaPorKm)`: si `vaPorKm` y el texto está vacío → `'Escribe los km del último cambio'`; si hay algo escrito y no es un número de 0 para arriba → `'Los km tienen que ser un número'`; si no, `null`. Cuidado: `null >= 0` es `true`.
--- código
function leerKm(texto) {
  // tu código aquí
}

function problemaDeKm(texto, vaPorKm) {
  // tu código aquí
}
--- pruebas
prueba('leer', () => igual([leerKm('80000'), leerKm(''), leerKm('   '), leerKm('0')], [80000, null, null, 0]));
prueba('la trampa de JavaScript', () => igual(null >= 0, true));
prueba('vacío, si va por km: falta', () => igual(problemaDeKm('', true), 'Escribe los km del último cambio'));
prueba('vacío, si va solo por meses: está bien', () => igual(problemaDeKm('', false), null));
prueba('letras o negativo', () => igual([problemaDeKm('mucho', true), problemaDeKm('-5', true)], ['Los km tienen que ser un número', 'Los km tienen que ser un número']));
prueba('un número bueno', () => igual(problemaDeKm('80000', true), null));
--- solución
function leerKm(texto) {
  return String(texto).trim() === '' ? null : Number(texto);
}

function problemaDeKm(texto, vaPorKm) {
  const km = leerKm(texto);
  if (km === null) return vaPorKm ? 'Escribe los km del último cambio' : null;
  if (!(km >= 0)) return 'Los km tienen que ser un número';
  return null;
}
```

```practica
vf :: En JavaScript, null >= 0 es true
vf :: Cuando la revisión cambió una decisión, se cambió el código y nada más
elige :: ¿Qué hubiera pasado con el último km vacío, antes del arreglo? :: Nada :: Pasaba como 0 km, y la app decía que el aceite estaba vencido por 85.000 km :: La app se cerraba
elige :: ¿Por qué el seguro no necesita km? :: Porque es caro :: Porque va solo por meses: se renueva por fecha, no por kilómetros :: Porque es un error
escribe :: Explica la diferencia entre "vacío" y "cero" con un ejemplo de tu vida. :: Vacío es "no sé" o "no contestó"; cero es una respuesta. Por ejemplo, propinas del día: vacío es que todavía no las anoté, cero es que no me dieron ninguna. Si confundo uno con el otro, las cuentas mienten.
```

## Parte 5. Los pedidos 2 y 3, y mirar la app de verdad

El **pedido 2** fue guardar en el navegador: un repositorio que recibe el almacén de afuera, con la clave con versión `mantenimiento:v1`, y que **no se traba** si lo guardado está roto o si el navegador no deja guardar (modo privado, lleno). En la revisión se miró que **no escondiera** el error: `guardar` devuelve `false`, y la página dice *"No se pudo guardar en este navegador"*. Un `catch` vacío habría sido el error de la clase 34.

El **pedido 3** fue la pantalla: la página, el motor de diseño, los estilos, la pantalla y el director, cada pieza con su tarea.

Y después, el **paso 4 del plan: mirar la app de verdad, en tamaño de celular**. Se probó a mano todo lo que dice el plan: el ejemplo del aceite ("pronto · faltan 300 km"), el seguro solo por meses, los avisos, un nombre con HTML adentro (se ve como texto), "hecho hoy" dos veces, recargar la página y borrar diciendo "no" y después "sí". Todo bien… y aparecieron **dos cosas más** que ninguna prueba veía:

3. **"faltan 14300 km" se lee mal.** En Brasil se escribe **14.300**. Se agregó `miles()` a la lógica, con su prueba.
4. **En el celular, el formulario quedaba desparejo:** la etiqueta "Fecha del último cambio" ocupa dos líneas y su caja quedaba más abajo. Se arregló con una línea de CSS (`align-items: end`), sin escribir medidas a mano.

**Las pruebas revisan lo que la app hace; mirarla revisa lo que la persona ve.**

> 🌎 **En la vida real:** el ensayo general del teatro: los actores ya se saben la obra, pero recién con el vestuario y las luces se ve que un cartel tapa a un actor.

> 🌎 **Otro ejemplo:** es como leer en voz alta un mensaje antes de mandarlo: la ortografía estaba bien, pero suena raro, y eso solo se nota al escucharlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El texto de lo que falta, como lo lee una persona
lenguaje: js
pide: Completa `miles(n)`: `14300` → `'14.300'`. Y `textoDeFalta(porQue, falta)`: `porQue` es `'km'` o `'fecha'`. Si `falta` es 0 → `'toca hoy'`. Por km: `'faltan N km'` o, si es negativo, `'se pasó por N km'` (N con `miles`). Por fecha: `'faltan N días'` o `'venció hace N días'`.
--- código
function miles(n) {
  // tu código aquí
}

function textoDeFalta(porQue, falta) {
  // tu código aquí
}
--- pruebas
prueba('miles', () => igual([miles(300), miles(14300), miles(1234567)], ['300', '14.300', '1.234.567']));
prueba('por km', () => igual([textoDeFalta('km', 300), textoDeFalta('km', 14300), textoDeFalta('km', -1234)], ['faltan 300 km', 'faltan 14.300 km', 'se pasó por 1.234 km']));
prueba('por fecha', () => igual([textoDeFalta('fecha', 12), textoDeFalta('fecha', -3)], ['faltan 12 días', 'venció hace 3 días']));
prueba('justo en el borde', () => igual([textoDeFalta('km', 0), textoDeFalta('fecha', 0)], ['toca hoy', 'toca hoy']));
--- solución
function miles(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function textoDeFalta(porQue, falta) {
  if (falta === 0) return 'toca hoy';
  if (porQue === 'km') return falta > 0 ? `faltan ${miles(falta)} km` : `se pasó por ${miles(-falta)} km`;
  return falta > 0 ? `faltan ${falta} días` : `venció hace ${-falta} días`;
}
```

```practica
vf :: Que guardar devuelva false cuando el navegador no deja es mejor que esconder el error con un catch vacío
vf :: Mirar la app en el celular no hace falta si las 21 pruebas pasan
elige :: ¿Qué se probó a mano en el paso 4? :: Solo que abriera :: Todo lo del plan: el ejemplo del aceite, los avisos, un nombre con HTML, hecho hoy dos veces, recargar y borrar :: Nada, lo hizo la IA
elige :: ¿Cómo se arregló el formulario desparejo? :: Con una medida a mano :: Con align-items: end en la fila, sin escribir medidas :: Quitando la etiqueta
escribe :: Cuenta las cuatro cosas que encontró la revisión en este proyecto y cómo se encontró cada una. :: Leyendo el código: el borde ("se pasó por 0 km" pasó a "toca hoy") y el vacío que pasaba como cero. Mirando la app en el celular: los km sin punto de miles (14300 pasó a 14.300) y el formulario desparejo. Cada una con su corrección, y las de la lógica con su prueba primero.
```

## Parte 6. Lo que hizo cada uno, y llevarlo a tu idea

`PEDIDOS.md` termina con esta tabla, que es la idea de todo el curso:

| La persona (el director) | La IA (las manos) |
|---|---|
| Escribió el plan: qué hace, qué **no**, y las puertas y ventanas | Escribió el código y las pruebas |
| Escribió las reglas del proyecto | Siguió las reglas |
| Dio un paso del plan por pedido | Hizo ese paso y no más |
| **Revisó** cada vuelta: leyó el código, miró la app en el celular | Corrigió lo que se le señaló, prueba primero |
| Encontró 4 cosas que las pruebas no veían | — |
| Decidió el único cambio al plan | — |
| Decide el commit y el push | — |

**Tu turno, con tu idea.** Copia la carpeta, borra `src/` y `test/`, y deja los tres archivos que importan:

1. **`PLAN.md`** con tu problema, tus ocho piezas y tus puertas y ventanas, y un ejemplo con números en "Cómo sé que funciona".
2. **`AGENTS.md`** con tus reglas.
3. **`PEDIDOS.md`** vacío, para anotar cada pedido, lo que volvió, lo que revisaste y lo que corregiste.

Y después, el flujo de la clase 35: **un paso del plan por pedido, la prueba antes, revisar leyendo y mirando, un commit por paso.**

> 🌎 **En la vida real:** el que aprende a dirigir una obra chica, con su plano, su reglamento y su cuaderno de obra, ya sabe dirigir una grande: cambia el tamaño, no el método.

> 🌎 **Otro ejemplo:** el cuaderno de pedidos es como el libro de bitácora de un barco: si mañana llega otro capitán, lee qué pasó, qué se decidió y por qué, y sigue el viaje.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un cuaderno de pedidos bien llevado
lenguaje: js
pide: Completa `revisarCuaderno(pedidos)`: cada pedido es `{ n, pedido, volvio, revision, correcciones }` (las correcciones, una lista de `{ que, conPrueba }`). Devuelve los avisos, en orden: `'pedido N sin revisión'` si `revision` está vacío; y `'pedido N: «QUE» sin prueba'` por cada corrección de la **lógica** (`que` empieza con `'lógica:'`) que no tiene `conPrueba: true`.
--- código
function revisarCuaderno(pedidos) {
  // tu código aquí
}
--- pruebas
const cuaderno = [
  { n: 1, pedido: 'paso 1', volvio: 'lógica y 12 pruebas', revision: 'leí el código: el borde y el vacío', correcciones: [{ que: 'lógica: toca hoy', conPrueba: true }, { que: 'lógica: el vacío no es cero', conPrueba: true }] },
  { n: 2, pedido: 'paso 2', volvio: 'el repositorio', revision: '', correcciones: [] },
  { n: 3, pedido: 'paso 3', volvio: 'la pantalla', revision: 'la miré en el celular', correcciones: [{ que: 'lógica: los miles', conPrueba: false }, { que: 'estilos: el formulario desparejo', conPrueba: false }] },
];
prueba('lo que falta en el cuaderno', () => igual(revisarCuaderno(cuaderno), ['pedido 2 sin revisión', 'pedido 3: «lógica: los miles» sin prueba']));
prueba('un cuaderno en orden', () => igual(revisarCuaderno([cuaderno[0]]), []));
prueba('un cambio de estilos no necesita prueba de lógica', () => igual(revisarCuaderno([{ ...cuaderno[2], correcciones: [cuaderno[2].correcciones[1]] }]), []));
--- solución
function revisarCuaderno(pedidos) {
  const avisos = [];
  for (const p of pedidos) {
    if (!String(p.revision ?? '').trim()) avisos.push(`pedido ${p.n} sin revisión`);
    for (const c of p.correcciones ?? []) {
      if (c.que.startsWith('lógica:') && c.conPrueba !== true) avisos.push(`pedido ${p.n}: «${c.que}» sin prueba`);
    }
  }
  return avisos;
}
```

```practica
vf :: En este proyecto, la IA decidió el único cambio al plan
vf :: Para usar este proyecto con tu idea, lo más importante que copias son PLAN.md, AGENTS.md y PEDIDOS.md
elige :: ¿Para qué sirve PEDIDOS.md? :: Para guardar el código :: Para que se vea cómo se dirigió: cada pedido, lo que volvió, lo que se revisó y lo que se corrigió :: Para que la IA no trabaje
elige :: En el flujo de este proyecto, ¿qué va antes de cada parte del código? :: El commit :: Su prueba :: El push
escribe :: Cuenta en cinco pasos cómo harías tu propia app chica dirigiendo a la IA. :: Escribo PLAN.md con las ocho piezas, las puertas y ventanas y un ejemplo con números. Escribo AGENTS.md con las reglas. Pido un paso del plan por vez, con la prueba antes. Reviso cada vuelta leyendo el código y mirando la app en el celular, y anoto todo en PEDIDOS.md. Guardo con un commit por paso, y decido yo cuándo publicar.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con IA?":** "Como un director de obra. Antes de pedir código escribo el plan, con lo que la app hace, lo que no hace todavía, las puertas y ventanas, y un ejemplo con números que se vuelve la primera prueba; y las reglas del proyecto en AGENTS.md, que la IA lee al empezar. Después pido un paso del plan por vez, con las pruebas antes del código. Y reviso cada vuelta: en un proyecto chico, las pruebas pasaban a la primera y aun así encontré cuatro cosas, dos leyendo el código (un borde que decía 'se pasó por 0 km' y que en JavaScript null >= 0 es true, así que un campo vacío pasaba como cero) y dos mirando la app en el celular. Cada corrección de la lógica, con su prueba en rojo primero. Todo queda escrito en un cuaderno de pedidos, y el commit y el push los decido yo."

> 🌎 **En la vida real:** es como contar cómo dirigiste la remodelación de tu cocina: el plano, el reglamento para el maestro de obra, lo que revisaste cada día y lo que hiciste rehacer.

> 🌎 **Otro ejemplo:** es como el capitán que muestra su bitácora: no dice "llegamos", dice por dónde, qué decidió en cada tormenta y por qué.
