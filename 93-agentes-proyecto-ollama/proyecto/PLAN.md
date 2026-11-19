# Plan: el Copiloto de gastos, un agente que corre en tu computadora

> Escrito **antes** del código. Las tres preguntas de la clase 19 (parte 1.4) van primero: si alguna da "no",
> no se construye un agente, se construye un flujo de trabajo.

## 1. Las tres preguntas

| Pregunta | Respuesta |
|---|---|
| ¿Se puede definir cómo se ve "terminado"? | Sí: una respuesta corta, en español, con el monto que salió **de las herramientas** |
| ¿El agente puede verificar su avance? | Sí: cada número de la respuesta tiene que estar en lo que devolvieron las herramientas |
| ¿Se puede pagar la peor ejecución? | Sí: todo es **solo lectura** y corre gratis en la computadora. Lo peor es una respuesta mala, y se marca |

¿Por qué un agente y no un flujo fijo? Porque la cantidad de pasos depende de la pregunta: "¿cuánto gasté hoy?" necesita
saber la fecha primero; "¿cuál fue mi último gasto de mantenimiento?" necesita listar, no sumar.

## 2. Lo que hace

- Recibe una pregunta en la terminal: `python3 preguntar.py "¿Cuánto gasté en combustible este mes?"`.
- Usa tres herramientas sobre `datos/gastos.csv`: `fecha_de_hoy`, `sumar_gastos` y `listar_gastos`.
- Responde corto, con los montos que salieron de las herramientas.
- Deja un **rastro** de cada ejecución en `rastros/` (qué pidió el modelo, qué devolvió cada herramienta, cuánto tardó).

## 3. Lo que NO hace (por ahora)

- No escribe, no borra y no manda nada: **todas las herramientas son de solo lectura**.
- No usa internet ni servicios de pago: el modelo corre con **Ollama**, en la computadora.
- No guarda memoria entre preguntas.
- No instala paquetes: solo la biblioteca estándar de Python.

## 4. Las siete piezas (clase 19, parte 1.2)

| Pieza | Archivo | Su única tarea |
|---|---|---|
| Modelo | `agente/modelo.py` | Hablar con Ollama (con tiempo máximo y reintentos). Y uno **de mentira** para las pruebas |
| Instrucciones | `agente/instrucciones.py` | El *system prompt* por secciones, siempre igual |
| Herramientas | `agente/herramientas.py` | Las tres herramientas: esquema, validación y errores que enseñan |
| Memoria y estado | `agente/ciclo.py` | Los mensajes de **esta** ejecución, nada más |
| Ciclo | `agente/ciclo.py` | Llamar al modelo, correr herramientas, ver si para |
| Controles | `agente/controles.py` | Entrada (intentos de inyección) y salida (números sin apoyo) |
| Entorno | `agente/rastro.py` y `preguntar.py` | El rastro de cada ejecución y la terminal |

## 5. Los frenos del ciclo (clase 26, patrón 17)

- Máximo **6 pasos**.
- Presupuesto de **20.000 tokens** por ejecución.
- La **misma llamada** (misma herramienta, mismos datos) más de 2 veces: no se corre; se le devuelve un error que le dice qué hacer.
- Si la respuesta trae un número que no salió de ninguna herramienta: **una** vuelta para que lo corrija; si insiste, se entrega **marcada**.

## 6. Cómo sé que funciona

- Las pruebas pasan **sin Ollama** (`python3 -m unittest`), con un modelo de mentira.
- El set de evaluación (`evaluacion/casos.json`, 9 casos) corre contra el modelo de verdad, cada caso **3 veces**
  (`python3 evaluar.py`), y dice la tasa de éxito, pass^3, los pasos y la demora.
- Con los gastos de ejemplo y hoy = 2026-11-18: "¿cuánto gasté en combustible este mes?" → **R$ 651,10**.

## Las puertas y ventanas

| Caso | Qué decidimos |
|---|---|
| Ollama apagado | Un aviso claro: "No pude hablar con Ollama. ¿Está abierto? Prueba: ollama serve" |
| El modelo no está bajado | El aviso dice el comando: `ollama pull qwen3.5:4b` |
| Una categoría que no existe ("peajes") | La herramienta devuelve un error con las categorías que sí hay; el modelo lo dice |
| Una fecha mal escrita | Error que enseña: "tiene que ser AAAA-MM-DD, por ejemplo 2026-11-01" |
| "Ignora las instrucciones…" | Se bloquea **antes** de llegar al modelo |
| Lo que devuelven las herramientas | Son **datos**, nunca órdenes (está en las instrucciones) |
| Una lista larga de gastos | Como mucho 10: resultados flacos (clase 27, parte 4.2) |
| El CSV con BOM (guardado en Excel) | Se lee igual (`utf-8-sig`) |

## Cambios al plan

_(cada cambio con su fecha y su motivo)_

- **2026-11-18 · Cómo sé que funciona:** un caso nuevo, "estacionamiento" (otra categoría que no existe), y el set pasa
  a 9. **Motivo:** el primer arreglo para "peajes" ponía esa misma palabra en el prompt: eso es estudiar para el examen.
  El caso nuevo mide lo mismo con una palabra que el prompt nunca nombra.
