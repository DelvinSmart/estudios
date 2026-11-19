# Plan: Mantenimiento del carro

> Escrito **antes** de pedir una sola línea de código (clase 79). Cada sesión con la IA empieza leyendo este archivo.

## 1. El problema

Un conductor de aplicación se olvida de cuándo le toca el cambio de aceite, los filtros o las llantas. Se acuerda cuando
el carro ya tiene un problema, o cuando el taller le dice que se pasó por mucho.

## 2. Lo que tiene que hacer

- Anotar cada mantenimiento: qué es, cada cuántos **km** y cada cuántos **meses** se hace, y cuándo fue el último (km y fecha).
- Escribir los km que marca el carro hoy.
- Ver, para cada mantenimiento: **vencido**, **pronto** o **al día**, con cuánto falta (en km o en días, lo que llegue primero).
- Marcar uno como **hecho hoy** (con los km de hoy).
- Borrar uno.

## 3. Lo que NO va (por ahora)

- Varios carros.
- Avisos en el teléfono (notificaciones).
- Cuentas de usuario o la nube: todo queda en el navegador.
- Gastos del mantenimiento (ya hay una app de gastos).

## 4. Los datos

Cada mantenimiento: `id`, `nombre`, `cadaKm`, `cadaMeses`, `ultimoKm`, `ultimaFecha` (AAAA-MM-DD).
Y aparte: `kmActual`. Todo en el navegador (`localStorage`), con un nombre de clave con versión (`mantenimiento:v1`).

## 5. Las pantallas

Una sola: arriba, los km de hoy; después, la lista ordenada (lo vencido primero); abajo, el formulario para agregar uno.

## 6. Las piezas y cómo se conectan

| Pieza | Archivo | Su única tarea |
|---|---|---|
| La lógica | `src/logica.mjs` | Calcular el estado de cada mantenimiento. Sin pantalla ni navegador |
| Los datos | `src/datos.mjs` | Guardar y leer (un repositorio, clase 83) |
| La pantalla | `src/pantalla.mjs` | Dibujar lo que dice la lógica (el DOM, clase 81) |
| El director | `src/app.mjs` | Junta las piezas y responde a lo que hace la persona |
| El motor de diseño | `motor.css` | Colores, espacios y formas, en un solo lugar |

La pantalla nunca calcula; la lógica nunca toca la pantalla.

## 7. El orden

1. La lógica, **con sus pruebas** (lo más importante y lo más fácil de probar).
2. Guardar y leer, con sus pruebas.
3. La pantalla, el motor de diseño y el director.
4. Revisar la app de verdad en el navegador, en tamaño de celular.

## 8. Cómo sé que funciona

- Las pruebas pasan (`npm test`).
- Con un aceite de cada 5.000 km o 6 meses, hecho a los 80.000 km el 1 de agosto: a los 84.700 km dice **pronto** (faltan 300 km); a los 85.100 dice **vencido**; y el 2 de febrero, aunque no haya llegado a los km, también dice **vencido**.
- Cierro y abro la página, y todo sigue ahí.

## Las puertas y ventanas (clase 79)

| Caso | Qué decidimos |
|---|---|
| Vacío | "Todavía no anotaste mantenimientos" y el formulario a la vista |
| Error al guardar | La página sigue funcionando y avisa "No se pudo guardar en este navegador" |
| Sin internet | No importa: no usa internet |
| Datos raros | Km negativos, 0 o con letras: no se guardan y dice por qué. Nombres largos o con tildes: se muestran bien |
| El último km es mayor que el de hoy | No se acepta: el carro no anda hacia atrás |
| Dos veces | Tocar "hecho hoy" dos veces no cambia nada la segunda vez |
| Deshacer | Borrar pide confirmar |
| Fechas difíciles | Un aceite hecho el 31 de enero, cada 1 mes: vence el 28 de febrero (o 29), no el 3 de marzo |
| Pantallas chicas | Una columna, sin moverse de lado |
| Seguridad | Lo que escribe la persona se muestra con `textContent`, nunca con `innerHTML` |

## Cambios al plan

_(cada cambio con su fecha y su motivo, clase 79)_

- **2026-11-18 · Los datos:** el "km del último cambio" solo es obligatorio si el mantenimiento va **por km**. Si va solo
  por meses (el seguro), se toman los km de hoy. **Motivo:** en la revisión se vio que pedirle los km a algo que no se
  mide en km (el seguro) no tiene sentido, y que dejarlo vacío pasaba como 0 (`null >= 0` es `true`).
