# Los pedidos: cómo se construyó, paso a paso

Este archivo es el corazón del proyecto. No muestra solo **lo que** se hizo, sino **cómo se dirigió**: cada pedido,
lo que volvió, lo que se revisó y lo que se corrigió. Es lo que vas a copiar con tu propia idea.

> Antes del primer pedido ya existían `PLAN.md` (las ocho piezas y las puertas y ventanas) y `AGENTS.md` (las reglas).
> Cada pedido empieza diciendo: "Lee PLAN.md y AGENTS.md".

---

## Pedido 1: la lógica, con sus pruebas

```text
Lee PLAN.md y AGENTS.md.
Haz el paso 1 del plan: src/logica.mjs con sus pruebas en test/logica.test.mjs.
Primero escribe las pruebas, sacándolas de la sección 8 del plan y de las puertas y ventanas
(las fechas difíciles, los datos raros, "hecho hoy" dos veces). Después el código.
No toques nada más. Terminado = npm test en verde, y me dices qué decidiste en cada caso.
```

**Lo que volvió:** las pruebas (12) y la lógica: `sumarMeses`, `estadoDe`, `textoDeFalta`, `hechoHoy`, `ordenar` y `problemasDe`.
Las 12 pasaron a la primera.

**La revisión** (clase 34: como si lo hubiera escrito un desconocido). Que las pruebas pasen no quiere decir que esté bien:
se leyó el código buscando los casos que **nadie** puso en una prueba. Aparecieron dos:

1. **`null >= 0` es `true` en JavaScript.** Si la persona dejaba vacío "Km del último cambio", pasaba como 0 km, y la app
   iba a decir que el aceite estaba vencido por 85.000 km.
2. **Justo en el borde** decía "se pasó por 0 km" y "venció hace 0 días".

**El pedido de corrección:**

```text
Dos cosas que encontré revisando:
1. Con el último km vacío, problemasDe no avisa: null >= 0 es true. Que avise "Escribe los km del último cambio",
   pero solo si va por km (el seguro va solo por meses y no los necesita).
2. Cuando falta exactamente 0, que diga "toca hoy".
Primero la prueba de cada una, en rojo. Después el arreglo.
```

Las dos pruebas salieron en **rojo**, se arregló, y en **verde**: 14 de 14.

---

## Pedido 2: guardar en el navegador

```text
Paso 2 del plan: src/datos.mjs, un repositorio que recibe el almacén de afuera (localStorage en la página,
uno de mentira en las pruebas). La clave con versión: mantenimiento:v1.
Puertas y ventanas: si lo guardado está roto, o el navegador no deja leer o guardar (modo privado, lleno),
la página no se traba. Guardar devuelve true o false para que la página pueda avisar.
Y una función en la lógica que pase del formulario (texto) a un mantenimiento.
```

**Lo que volvió:** `crearRepositorio` con `leer` y `guardar` (los dos con `try`/`catch`), `desdeFormulario`, y 6 pruebas:
vacío la primera vez, ida y vuelta, cuatro formas de datos rotos, el navegador que no deja guardar y el que no deja ni leer.

**La revisión:** se miró que `guardar` **no escondiera** el error: devuelve `false`, y la página muestra
"No se pudo guardar en este navegador". Esconderlo con un `catch` vacío habría sido el error de la clase 34.

---

## Pedido 3: la pantalla

```text
Paso 3 del plan: index.html, motor.css, estilos.css, src/pantalla.mjs y src/app.mjs.
La pantalla dibuja lo que dice la lógica y no calcula. Todo lo que escribe la persona con textContent.
Ningún color ni medida fuera de motor.css. Borrar pide confirmar. Una columna en el celular.
```

**Lo que volvió:** las cinco piezas, cada una con su tarea, como en la tabla del plan.

---

## Paso 4: revisar la app de verdad

Se abrió en el navegador **en tamaño de celular** y se hizo lo que dice el plan, a mano:

| Qué se probó | Qué pasó |
|---|---|
| El ejemplo del plan (aceite, 84.700 km) | "pronto · faltan 300 km" ✓ |
| El seguro, solo por meses | "pronto · faltan 13 días" ✓ |
| Agregar sin nada | Los dos avisos en español ✓ |
| El último km mayor que el de hoy | "El último cambio no puede tener más km que el carro hoy" ✓ |
| Un nombre con HTML adentro | Se ve como texto; el título de la página no cambia ✓ |
| "Hecho hoy" dos veces | Lo guardado es igual después de la segunda ✓ |
| Recargar la página | Todo sigue ahí, también los km de hoy ✓ |
| Borrar diciendo "no" y después "sí" | Con "no" no borra; con "sí", solo ese ✓ |

**Lo que se encontró mirando**, y no estaba en ninguna prueba:

3. **"faltan 14300 km" se lee mal.** En Brasil se escribe 14.300.
4. **En el celular, el formulario quedaba desparejo:** la etiqueta "Fecha del último cambio" ocupa dos líneas y su caja
   quedaba más abajo que la de al lado.

**El pedido de corrección:**

```text
Mirando la app en el celular:
1. Los km sin punto de miles se leen mal ("14300"). Que salgan como 14.300, con su prueba.
2. En la fila de abajo del formulario, las cajas no quedan a la misma altura cuando una etiqueta ocupa dos líneas.
Arréglalo en estilos.css, sin escribir medidas a mano.
```

Se arregló: `miles()` en la lógica, con su prueba (21 de 21), y `align-items: end` en la fila. Se volvió a mirar en el celular.

---

## Lo que hizo la persona y lo que hizo la IA

| La persona (el director) | La IA (las manos) |
|---|---|
| Escribió el plan: qué hace, qué **no**, y las puertas y ventanas | Escribió el código y las pruebas |
| Escribió las reglas del proyecto (`AGENTS.md`) | Siguió las reglas |
| Dio un paso del plan por pedido | Hizo ese paso y no más |
| **Revisó** cada vuelta: leyó el código, miró la app en el celular | Corrigió lo que se le señaló, prueba primero |
| Encontró 4 cosas que las pruebas no veían | — |
| Decidió el único cambio al plan (ver `PLAN.md`) | — |
| Decide el commit y el push | No hace commit ni push (regla de `AGENTS.md`) |
