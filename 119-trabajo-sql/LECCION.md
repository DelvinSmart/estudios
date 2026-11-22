# SQL: pedirle datos a la base

> 🌎 **En la vida real:** una base de datos es como una planilla de Excel gigante y ordenada: tablas con filas (cada cosa) y columnas (sus datos). SQL es el idioma para **pedirle** lo que quieres: "dame los conductores de São Paulo, ordenados por ganancia". Le dices **qué** quieres, no cómo buscarlo.

> 🎙️ **El profesor dice:** {{alumno}}, en casi toda entrevista de trabajo con datos aparece SQL. La buena noticia: hace lo mismo que `filter`, `map` y `reduce` de JavaScript, que ya conoces (clase 48), pero sobre una tabla. Hoy aprendes a leer y escribir las consultas que de verdad piden, y a conectarlas con lo que ya sabes.

## Parte 1. La tabla: filas y columnas

> 🌎 **En la vida real:** la lista de contactos del teléfono es una tabla: cada contacto es una **fila**, y nombre, teléfono y correo son las **columnas**.

Una **base de datos** guarda la información en **tablas**. Cada tabla tiene:

- **Columnas:** qué se guarda de cada cosa (por ejemplo, de un gasto: `id`, `tipo`, `valor`, `fecha`).
- **Filas:** cada cosa concreta (un gasto de combustible de 150, del 3 de marzo).

Una tabla `gastos` se vería así:

```text
 id | tipo         | valor | fecha
----+--------------+-------+------------
  1 | combustible  |   150 | 2026-03-03
  2 | peaje        |    12 | 2026-03-03
  3 | combustible  |   200 | 2026-03-05
```

> 📌 **Nota:** **SQL** quiere decir *Structured Query Language* (lenguaje de consultas). Hay varias bases que lo hablan (SQLite, PostgreSQL, MySQL); lo básico es casi igual en todas. SQLite ya lo usaste en el laboratorio de seguridad (clase 91).

```practica
elige :: En una tabla de una base de datos, ¿qué es una fila? :: Un tipo de dato :: Cada cosa concreta que se guarda (un gasto, un usuario) :: El nombre de la tabla
vf :: SQL le dice a la base QUÉ datos quieres, no el paso a paso de cómo buscarlos
```

## Parte 2. SELECT: leer datos (como filter + map)

> 🌎 **En la vida real:** es como pedir en una biblioteca: "deme (SELECT) los títulos y autores (columnas) de los libros de la sección cocina (WHERE), ordenados por año (ORDER BY)".

Esta consulta usa cuatro cláusulas. Léelas así: `FROM` elige la tabla, `WHERE` deja pasar las filas, `SELECT` indica las columnas que verás y `ORDER BY` ordena la salida. Al escribir la consulta, `SELECT` va primero.

```sql
SELECT tipo, valor      -- qué columnas quiero
FROM gastos             -- de qué tabla
WHERE valor > 100       -- qué filas (el filtro)
ORDER BY valor DESC;    -- cómo ordenarlas (DESC = de mayor a menor)
```

Con los gastos del ejemplo, el peaje de 12 queda fuera del filtro. Salen dos filas, una de 200 y otra de 150, en ese orden. El `id` y la `fecha` quedan fuera de la salida porque la consulta solo pide `tipo` y `valor`.

Puedes reproducir ese resultado en JavaScript con los métodos del Tema 48:

| SQL | JavaScript | Qué hace |
|---|---|---|
| `WHERE valor > 100` | `.filter(g => g.valor > 100)` | Deja solo las filas que cumplen |
| `SELECT tipo, valor` | `.map(g => ({ tipo: g.tipo, valor: g.valor }))` | Elige qué columnas traer |
| `ORDER BY valor DESC` | `.sort((a, b) => b.valor - a.valor)` | Ordena el resultado |

> ⚠️ **Error común (que preguntan):** `SELECT *` trae **todas** las columnas. Está bien para probar, pero en código de verdad pide **solo las que usas**: es más rápido y no arrastra datos de más (ni sensibles).

✍️ **Ahora escribes tú:** la consulta en JavaScript, para ver que es lo mismo.

```ejercicio
titulo: Un SELECT … WHERE … ORDER BY, en JavaScript
lenguaje: js
pide: Completa `consulta(gastos)` que haga lo mismo que `SELECT tipo, valor FROM gastos WHERE valor > 100 ORDER BY valor DESC`: deja los gastos con `valor > 100`, quédate solo con `{ tipo, valor }`, y ordénalos de mayor a menor valor.
--- código
function consulta(gastos) {
  // filter -> WHERE, map -> SELECT, sort -> ORDER BY
}
--- pruebas
const datos = [
  { id: 1, tipo: 'combustible', valor: 150, fecha: '2026-03-03' },
  { id: 2, tipo: 'peaje', valor: 12, fecha: '2026-03-03' },
  { id: 3, tipo: 'combustible', valor: 200, fecha: '2026-03-05' },
];
prueba('filtra, elige columnas y ordena', () => igual(consulta(datos), [
  { tipo: 'combustible', valor: 200 },
  { tipo: 'combustible', valor: 150 },
]));
prueba('nada pasa el filtro', () => igual(consulta([{ id: 9, tipo: 'peaje', valor: 5 }]), []));
--- solución
function consulta(gastos) {
  return gastos
    .filter((g) => g.valor > 100)
    .map((g) => ({ tipo: g.tipo, valor: g.valor }))
    .sort((a, b) => b.valor - a.valor);
}
```

```practica
elige :: ¿A qué equivale WHERE en JavaScript? :: a map :: a filter :: a sort
elige :: ¿Por qué evitar SELECT * en código de verdad? :: Porque no funciona :: Porque trae columnas de más (más lento y puede arrastrar datos sensibles); mejor pedir solo las que usas :: Porque es más largo de escribir
escribe :: Traduce a palabras esta consulta: SELECT tipo, valor FROM gastos WHERE valor > 100 ORDER BY valor DESC. :: Dame el tipo y el valor de los gastos cuyo valor sea mayor que 100, ordenados de mayor a menor valor.
```

## Parte 3. JOIN: juntar dos tablas

> 🌎 **En la vida real:** tienes una lista de pedidos que dice solo el **número de cliente**, y aparte una lista de clientes con su nombre. Para un reporte con el **nombre** en cada pedido, cruzas las dos por ese número. Eso es un JOIN.

Los datos se guardan en tablas separadas para no repetir (el nombre del cliente se guarda **una** vez). Para juntarlas en una consulta se usa **JOIN**, diciendo **por qué columna** se conectan:

```sql
SELECT pedidos.id, clientes.nombre, pedidos.total
FROM pedidos
JOIN clientes ON clientes.id = pedidos.cliente_id;
```

- `clientes.id` identifica a cada cliente. A esa columna se le llama **clave primaria** cuando la tabla garantiza que identifica una sola fila.
- `pedidos.cliente_id` guarda **a qué** cliente pertenece el pedido. Un pedido con `cliente_id = 7` se empareja con el cliente cuyo `id` es `7`. Una **clave foránea** puede hacer que la base compruebe esa relación.
- `ON clientes.id = pedidos.cliente_id` dice cómo emparejar las filas.

> 💡 **Idea:** es como el buscador del glosario de este curso: cada palabra tiene el **id** de su clase; para mostrar el **título** de la clase, se cruza con la lista de clases por ese id.

> 📌 **Nota:** hay `INNER JOIN` (solo los que tienen pareja en las dos tablas) y `LEFT JOIN` (todos los de la izquierda, aunque no tengan pareja). Si te preguntan la diferencia: *inner* deja fuera a los solitarios; *left* conserva las filas de la tabla izquierda y devuelve `NULL` para las columnas de la derecha cuando falta la pareja.

```practica
elige :: ¿Para qué sirve un JOIN? :: Para borrar filas :: Para juntar filas de dos tablas que se relacionan por una columna (por ejemplo, pedido con su cliente) :: Para ordenar
elige :: ¿Qué diferencia hay entre INNER JOIN y LEFT JOIN? :: Ninguna :: INNER deja fuera las filas sin pareja; LEFT mantiene todas las de la izquierda, con vacío donde no hay pareja :: LEFT es más rápido siempre
```

## Parte 4. GROUP BY: agrupar y contar (como reduce)

> 🌎 **En la vida real:** tienes el ticket de cada compra del mes y quieres saber **cuánto gastaste por categoría**. Juntas los tickets por categoría y sumas cada montón. Eso es GROUP BY + SUM.

Cuando quieres un **resumen** (no las filas una por una), agrupas y aplicas una **función de agregación**:

```sql
SELECT tipo, COUNT(*) AS cuantos, SUM(valor) AS total
FROM gastos
GROUP BY tipo;
```

Esto da **una fila por tipo**, con cuántos hay y la suma. Las agregaciones más usadas: `COUNT` (cuántos), `SUM` (suma), `AVG` (promedio), `MIN`, `MAX`.

Con la tabla de arriba, combustible tiene dos gastos y suma 350. Peaje tiene uno y suma 12. `COUNT(*)` cuenta filas de cada grupo y `SUM(valor)` suma la columna `valor`.

En JavaScript, `reduce` puede llevar un objeto con las sumas. La clave es el tipo del gasto actual. La primera vez que aparece un tipo, empieza en cero. Después usa el total que quedó guardado en la vuelta anterior.

> ⚠️ **Dato de entrevista:** para filtrar **antes** de agrupar se usa `WHERE`; para filtrar **sobre el resultado ya agrupado** (por ejemplo, "solo los tipos con total mayor a 500") se usa `HAVING`. Confundirlos es un error típico.

✍️ **Ahora escribes tú:** el GROUP BY + SUM, en JavaScript.

```ejercicio
titulo: GROUP BY tipo con SUM, en JavaScript
lenguaje: js
pide: Completa `totalPorTipo(gastos)`: devuelve un objeto con la suma de `valor` por cada `tipo`. Por ejemplo, dos combustibles de 150 y 200 dan `{ combustible: 350 }`. Usa `reduce`.
--- código
function totalPorTipo(gastos) {
  // reduce: por cada gasto, suma su valor al montón de su tipo
}
--- pruebas
const datos = [
  { tipo: 'combustible', valor: 150 },
  { tipo: 'peaje', valor: 12 },
  { tipo: 'combustible', valor: 200 },
];
prueba('suma por tipo', () => igual(totalPorTipo(datos), { combustible: 350, peaje: 12 }));
prueba('lista vacía', () => igual(totalPorTipo([]), {}));
--- solución
function totalPorTipo(gastos) {
  return gastos.reduce((acc, g) => {
    acc[g.tipo] = (acc[g.tipo] || 0) + g.valor;
    return acc;
  }, {});
}
```

```practica
elige :: ¿A qué se parece GROUP BY con SUM en JavaScript? :: a filter :: a reduce (vas juntando en un acumulador por grupo) :: a sort
elige :: Quieres "solo los tipos cuyo total pase de 500". ¿WHERE o HAVING? :: WHERE, siempre :: HAVING, porque filtra sobre el resultado ya agrupado :: Ninguno
escribe :: ¿Qué hace esta consulta? SELECT tipo, SUM(valor) AS total FROM gastos GROUP BY tipo. :: Agrupa los gastos por tipo y, por cada tipo, suma sus valores; devuelve una fila por tipo con ese total.
```

## Para la entrevista

> 🎤 **Si te piden escribir una consulta:** di en voz alta las partes en orden — «Identifico la tabla y las columnas. Si necesito datos de otra tabla, explico con qué claves hago el `JOIN`. Luego decido qué filas filtra `WHERE` y si necesito agrupar con `GROUP BY`». Pensar en ese orden evita que te trabes.

> 🎤 **Si te preguntan por rendimiento:** menciona dos clásicos. **(1)** Evitar `SELECT *` y pedir solo las columnas que usas. **(2)** El problema **N+1**: hacer una consulta y después **una por cada fila** del resultado (cientos de viajes a la base); se arregla con un **JOIN** o pidiendo todo de una. Saber esto impresiona.

> ⚠️ **Y lo más importante de seguridad** (clase 23): **nunca** pegues lo que escribe el usuario dentro de la consulta con `+`. Usa **consultas con parámetros** (`?`), o te exponen a inyección SQL. El Tema 23 explica cómo separar la consulta de los valores.

> 🌎 **En la vida real:** saber SQL es como saber pedir bien en una ferretería enorme: si sabes nombrar lo que quieres, sales en un minuto con exactamente eso; si no, das vueltas entre los pasillos.
