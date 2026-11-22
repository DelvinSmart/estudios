# Agentes 7: proyecto final, un agente que corre gratis en tu computadora

> 🌎 **En la vida real:** es como armar tu primer taller en el garaje, en vez de leer sobre talleres. Las herramientas son pocas y son tuyas, nadie te cobra por usarlas, y cuando algo se rompe lo ves con tus ojos y lo arreglas.

> 🎙️ **El profesor dice:** {{alumno}}, en este curso viste el ciclo (clase 19), los patrones (25 y 26), el diseño (27) y cómo medir y publicar (28). Hoy los juntas en **un agente de verdad**: el **Copiloto de gastos**. Responde preguntas sobre tus gastos con tres herramientas, corre en tu computadora con **Ollama** (gratis y sin internet) y tiene todo lo que pide la lista de producción: frenos, controles, rastros y un set de evaluación.

**Lo que hay** (en la carpeta `93-agentes-proyecto-ollama/proyecto` de este mismo repositorio):

| Archivo | Qué es | La pieza (clase 19, parte 1.2) |
|---|---|---|
| `PLAN.md` y `AGENTS.md` | El plan (con las tres preguntas) y las reglas, **antes** del código | — |
| `agente/modelo.py` | Hablar con Ollama, con tiempo máximo y reintentos. Y un modelo **de mentira** para las pruebas | Modelo |
| `agente/instrucciones.py` | El *system prompt* por secciones, siempre igual | Instrucciones |
| `agente/herramientas.py` | `fecha_de_hoy`, `sumar_gastos` y `listar_gastos`: solo lectura | Herramientas |
| `agente/ciclo.py` | El ciclo con sus frenos, y los mensajes de esta ejecución | Ciclo, memoria y estado |
| `agente/controles.py` | Entrada (inyección) y salida (montos sin apoyo) | Controles |
| `agente/rastro.py` y `preguntar.py` | El rastro de cada ejecución y la terminal | Entorno |
| `evaluar.py` y `evaluacion/casos.json` | 9 casos, cada uno 3 veces, contra el modelo de verdad | — |
| `test/` | 46 pruebas que **no** llaman a Ollama | — |

```bash
cd estudios/93-agentes-proyecto-ollama/proyecto
python3 -m unittest                                            # 46 en verde, sin Ollama
ollama pull qwen3.5:4b                                         # una vez: baja el modelo (unos 3 GB)
python3 preguntar.py "¿Cuánto gasté en combustible este mes?" --hoy 2026-11-18 --rastro
python3 evaluar.py                                             # el set de evaluación
```

> 📌 **Nota:** no hay nada que instalar con `pip`: es Python con la biblioteca estándar. Lo único que hace falta es **Ollama** (ollama.com), que también es gratis.

## Parte 1. El plan, empezando por las tres preguntas

Antes de una línea de código, `PLAN.md`. Y lo primero del plan son **las tres preguntas** de la clase 19 (parte 1.4), porque si alguna da "no", lo que hay que construir es un flujo de trabajo, no un agente:

| Pregunta | Respuesta en este proyecto |
|---|---|
| ¿Se puede definir cómo se ve "terminado"? | Sí: una respuesta corta, con el monto que salió **de las herramientas** |
| ¿El agente puede verificar su avance? | Sí: cada número de la respuesta tiene que estar en lo que devolvieron las herramientas |
| ¿Se puede pagar la peor ejecución? | Sí: todo es **solo lectura** y corre gratis. Lo peor es una respuesta mala, y se marca |

**¿Por qué un agente y no pasos fijos?** Porque la cantidad de pasos depende de la pregunta. "¿Cuánto gasté este mes?" necesita saber **la fecha** primero y después **sumar**: dos herramientas. "¿Cuál fue mi último gasto de mantenimiento?" necesita **listar**, no sumar. "¿Qué día es hoy?" necesita una sola. El camino lo decide el modelo: eso es un agente (clase 19, parte 1.1).

**Lo que NO hace** está escrito igual de claro: no escribe, no borra, no manda nada; no usa internet ni servicios de pago; no guarda memoria entre preguntas; no instala paquetes. Sin esa lista, cada sesión con una IA "mejora" el agente con algo que nadie pidió.

> 💡 **Idea:** que todas las herramientas sean de **solo lectura** no es un detalle: es lo que hace que la tercera pregunta dé "sí". Si mañana quieres una herramienta que **anote** un gasto, primero cambias el plan, y esa herramienta va con confirmación de una persona (clase 26, patrón 14).

> 🧩 **Piezas para este ejercicio**
> - Un archivo Markdown se lee como texto. `splitlines()` entrega una lista de líneas y `.startswith("## ")` detecta títulos de segundo nivel. En `titulo in linea`, `in` busca un fragmento y permite que el encabezado tenga un número delante.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿El plan tiene lo que importa?
lenguaje: python
pide: Antes del código, el plan. Completa `faltan_en_el_plan(texto)`: recibe el texto de un `PLAN.md` y devuelve, en este orden, cuáles de estos títulos **no** aparecen como línea que empieza con `## ` (sin importar el número que vaya delante, como `## 1. `): `"Las tres preguntas"`, `"Lo que NO hace"`, `"Cómo sé que funciona"`. Pista: para cada línea que empieza con `## `, fíjate si el título está **dentro** de esa línea (`in`).
--- código
TITULOS = ["Las tres preguntas", "Lo que NO hace", "Cómo sé que funciona"]


def faltan_en_el_plan(texto):
    pass  # tu código aquí
--- pruebas
COMPLETO = "# Plan\n## 1. Las tres preguntas\n...\n## 3. Lo que NO hace (por ahora)\n...\n## 6. Cómo sé que funciona\n..."
prueba("completo", lambda: igual(faltan_en_el_plan(COMPLETO), []))
prueba("sin lo que no hace", lambda: igual(faltan_en_el_plan("## Las tres preguntas\n## Cómo sé que funciona"), ["Lo que NO hace"]))
prueba("vacío", lambda: igual(faltan_en_el_plan(""), TITULOS))
prueba("en un párrafo no cuenta", lambda: igual(faltan_en_el_plan("Las tres preguntas ya las pensé"), TITULOS))
--- solución
TITULOS = ["Las tres preguntas", "Lo que NO hace", "Cómo sé que funciona"]


def faltan_en_el_plan(texto):
    titulos = [l for l in texto.split("\n") if l.startswith("## ")]
    return [t for t in TITULOS if not any(t in l for l in titulos)]
```

```practica
vf :: En este proyecto, las tres preguntas de la clase 19 se respondieron antes de escribir código
vf :: Como el agente es chico, no hace falta escribir lo que NO hace
elige :: ¿Por qué este proyecto es un agente y no una cadena de pasos fijos? :: Porque usa un modelo de lenguaje :: Porque la cantidad y el orden de las herramientas dependen de la pregunta :: Porque corre en la computadora
escribe :: ¿Qué cambia en el plan si quieres una herramienta que anote gastos nuevos? :: Ya no es solo lectura: la tercera pregunta (¿puedo pagar la peor ejecución?) cambia. Primero se cambia el plan con su motivo, y la herramienta va con confirmación de una persona antes de escribir.
```

## Parte 2. Las herramientas: esquema, validación y errores que enseñan

Las tres herramientas siguen las reglas de la clase 27 (parte 4.2). Mira la descripción de `sumar_gastos`:

```python
"description": "Suma los gastos de una categoría entre dos fechas (las dos incluidas). "
"Úsala para preguntas de 'cuánto gasté'. Devuelve el total en reales y cuántos gastos sumó.",
```

Dice **qué hace**, **cuándo usarla** y **qué devuelve**. Y la de `listar_gastos` dice también **cuándo no**: "No la uses para sumar: usa sumar_gastos". La descripción **es** el prompt de la herramienta.

**Las categorías son una lista cerrada** (`enum`): el modelo no puede inventar "gasolina" si la categoría se llama "combustible". Y si igual lo intenta, la validación responde con un error que enseña:

```python
>>> ejecutar("sumar_gastos", {"categoria": "peajes"}, contexto)
{'ok': False, 'error': "No hay una categoría 'peajes'. Las que hay son: combustible, comida, mantenimiento, celular. Díselo a la persona"}
```

Tres decisiones más, cada una con su prueba en `test/test_herramientas.py`:

- **Nunca lanzan un error hacia el ciclo.** `ejecutar` envuelve todo en `try`/`except` y devuelve `{"ok": False, "error": …}`. Una herramienta que revienta mata el ciclo; una que devuelve un error ordenado le da al modelo la oportunidad de corregirse (clase 25, parte 2.1).
- **Resultados flacos.** `listar_gastos` trae como mucho 10. Cada resultado entra en **todos** los pasos siguientes: si es enorme, paga en cada vuelta (clase 28, parte 6.5).
- **Lo que mandan los modelos chicos.** A veces mandan `"limite": "3"` (un texto) en vez de `3`. La herramienta lo acepta. Es *poka-yoke*: hacer más fácil la llamada correcta.

> 🧩 **Piezas para este ejercicio**
> - Un argumento opcional puede faltar. `args.get("desde")` permite consultarlo sin lanzar un error por clave ausente. Primero revisa la forma de las fechas. Después, las fechas `AAAA-MM-DD` se pueden comparar como texto. El patrón de la práctica comprueba el formato y una validación de calendario requiere comprobar que el día exista.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una herramienta que valida y enseña
lenguaje: python
pide: Escribe `sumar_gastos(args, gastos)` como la del proyecto, más corta. Si la categoría no está en `CATEGORIAS`, devuelve `{"ok": False, "error": "No hay una categoría 'X'. Las que hay son: combustible, comida"}`. Si `desde` o `hasta` vienen y no son `AAAA-MM-DD` (usa `FECHA.match`), `{"ok": False, "error": "Las fechas van como AAAA-MM-DD, por ejemplo 2026-11-01"}`. Si no, suma los de esa categoría con la fecha **entre las dos, incluidas** (sin `desde` es desde siempre; sin `hasta`, hasta siempre) y devuelve `{"ok": True, "total": …}` redondeado a 2 decimales.
--- código
import re

CATEGORIAS = ["combustible", "comida"]
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def sumar_gastos(args, gastos):
    pass  # tu código aquí
--- pruebas
G = [
    {"fecha": "2026-10-28", "categoria": "combustible", "monto": 210.0},
    {"fecha": "2026-11-02", "categoria": "combustible", "monto": 198.4},
    {"fecha": "2026-11-18", "categoria": "combustible", "monto": 60.0},
    {"fecha": "2026-11-05", "categoria": "comida", "monto": 28.9},
]
prueba("el mes, con los bordes incluidos", lambda: igual(sumar_gastos({"categoria": "combustible", "desde": "2026-11-02", "hasta": "2026-11-18"}, G), {"ok": True, "total": 258.4}))
prueba("sin fechas: todo", lambda: igual(sumar_gastos({"categoria": "combustible"}, G), {"ok": True, "total": 468.4}))
prueba("categoría que no hay", lambda: igual(sumar_gastos({"categoria": "peajes"}, G), {"ok": False, "error": "No hay una categoría 'peajes'. Las que hay son: combustible, comida"}))
prueba("fecha mal escrita", lambda: igual(sumar_gastos({"categoria": "comida", "desde": "1/11/2026"}, G), {"ok": False, "error": "Las fechas van como AAAA-MM-DD, por ejemplo 2026-11-01"}))
--- solución
import re

CATEGORIAS = ["combustible", "comida"]
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def sumar_gastos(args, gastos):
    categoria = args.get("categoria")
    if categoria not in CATEGORIAS:
        return {"ok": False, "error": f"No hay una categoría '{categoria}'. Las que hay son: " + ", ".join(CATEGORIAS)}
    for campo in ("desde", "hasta"):
        if args.get(campo) and not FECHA.match(args[campo]):
            return {"ok": False, "error": "Las fechas van como AAAA-MM-DD, por ejemplo 2026-11-01"}
    desde = args.get("desde") or "0000-01-01"
    hasta = args.get("hasta") or "9999-12-31"
    total = sum(g["monto"] for g in gastos if g["categoria"] == categoria and desde <= g["fecha"] <= hasta)
    return {"ok": True, "total": round(total, 2)}
```

```practica
vf :: La descripción de una herramienta es parte del prompt: el modelo la lee para decidir cuándo usarla
vf :: Si el modelo manda una categoría que no existe, lo mejor es lanzar una excepción para que se note
elige :: ¿Para qué sirve que las categorías sean una lista cerrada (enum)? :: Para que el código sea más corto :: Para que el modelo no pueda inventar una categoría con otro nombre :: Para gastar menos memoria
escribe :: ¿Por qué listar_gastos trae como mucho 10 gastos? :: Porque el resultado de una herramienta entra en el contexto de todos los pasos siguientes: si es grande, se paga en tokens y en demora en cada vuelta, y el modelo presta menos atención. Resultados flacos.
```

## Parte 3. El ciclo y sus frenos, en el código

`agente/ciclo.py` es el ciclo de la clase 19 (parte 1.3), con los frenos de la clase 26 (patrón 17). **Los frenos van en el código, no en el prompt**: un prompt se puede ignorar; un `for` con tope, no.

```python
for paso in range(1, max_pasos + 1):            # freno 1: máximo 6 pasos
    respuesta = modelo(mensajes, ESQUEMAS)
    tokens += ...                               # freno 2: presupuesto de 20.000 tokens
    if not respuesta["llamadas"]:
        ...                                     # terminó (pasa por el control de salida)
    for llamada in respuesta["llamadas"]:
        if firmas.count(firma) >= MAX_REPETIDAS:   # freno 3: la misma llamada, como mucho 2 veces
            resultado = {"ok": False, "error": "Ya llamaste a ... con estos mismos datos 2 veces. Usa el resultado que ya tienes, o cambia los datos."}
```

Fíjate en el freno 3: la llamada repetida **no se corre**, pero el ciclo **no se corta**. Se le devuelve al modelo un error que le dice qué hacer. Es el arreglo de la tabla de la clase 29 (parte 7.3): "detectar repeticiones y devolver errores que enseñen".

**Cada final tiene nombre:** `listo`, `bloqueado`, `sin apoyo`, `máximo de pasos` o `presupuesto de tokens`. Así el rastro y la evaluación saben **por qué** terminó, no solo que terminó.

**Las pruebas del ciclo no llaman a Ollama.** Usan `ModeloDeMentira`, que devuelve respuestas escritas de antemano:

```python
modelo = ModeloDeMentira([[("fecha_de_hoy", {})], [SUMAR], "Este mes gastaste R$ 386,00 en combustible."])
r = correr_agente("¿Cuánto gasté en combustible este mes?", modelo, CTX)
self.assertEqual(r["herramientas"], ["fecha_de_hoy", "sumar_gastos"])
```

Por eso las 46 pruebas corren en **milisegundos** y siempre dan lo mismo: prueban **tu código** (el ciclo, los frenos, las herramientas), no al modelo. Al modelo se lo mide aparte, con la evaluación (parte 6).

> 🧩 **Piezas para este ejercicio**
> - `isinstance(respuesta, str)` decide si el modelo terminó con texto. Si trae una tupla, `nombre, args = respuesta` separa las dos piezas. Una lista puede contar llamadas iguales incluso cuando los argumentos son diccionarios. El ciclo de esta práctica usa herramientas simuladas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El ciclo con sus frenos
lenguaje: python
pide: Completa `correr(modelo, herramientas, max_pasos)`. `modelo(mensajes)` es de mentira: devuelve un texto (terminó) o una tupla `(nombre, args)` (pide una herramienta). Repite hasta `max_pasos`: si es texto, devuelve `("listo", texto)`. Si es una llamada, córrela con `herramientas[nombre](args)` y agrega `{"role": "tool", "content": resultado}` a los mensajes. Pero si **la misma llamada** ya se hizo 2 veces, no la corras: agrega `{"role": "tool", "content": "repetida"}`. Si se acaban los pasos, `("máximo de pasos", None)`.
--- código
def correr(modelo, herramientas, max_pasos=6):
    mensajes = []
    hechas = []
    # tu código aquí
--- pruebas
def hoy(args):
    return "2026-11-18"

def modelo_que_pregunta_la_fecha(mensajes):
    return "Hoy es 18 de noviembre" if mensajes else ("hoy", {})

def modelo_terco(mensajes):
    return ("hoy", {})

def _repetida():
    vistos = []
    def modelo(mensajes):
        vistos.append(mensajes[-1]["content"] if mensajes else None)
        return ("hoy", {})
    correr(modelo, {"hoy": hoy}, 4)
    igual(vistos, [None, "2026-11-18", "2026-11-18", "repetida"])

prueba("usa la herramienta y termina", lambda: igual(correr(modelo_que_pregunta_la_fecha, {"hoy": hoy}), ("listo", "Hoy es 18 de noviembre")))
prueba("para en el máximo", lambda: igual(correr(modelo_terco, {"hoy": hoy}, 3), ("máximo de pasos", None)))
prueba("la tercera vez igual no se corre", _repetida)
--- solución
def correr(modelo, herramientas, max_pasos=6):
    mensajes = []
    hechas = []
    for _ in range(max_pasos):
        r = modelo(mensajes)
        if isinstance(r, str):
            return ("listo", r)
        if hechas.count(r) >= 2:
            resultado = "repetida"
        else:
            nombre, args = r
            resultado = herramientas[nombre](args)
        hechas.append(r)
        mensajes.append({"role": "tool", "content": resultado})
    return ("máximo de pasos", None)
```

```practica
vf :: Los frenos del ciclo (máximo de pasos, presupuesto, llamadas repetidas) van en el código y no en el prompt
vf :: Cuando el modelo repite la misma llamada por tercera vez, el ciclo se corta enseguida
elige :: ¿Para qué sirve el ModeloDeMentira? :: Para gastar menos en la nube :: Para probar el ciclo y las herramientas rápido y siempre igual, sin depender del modelo :: Para reemplazar a Ollama en producción
escribe :: ¿Por qué cada final del ciclo tiene un nombre (listo, bloqueado, máximo de pasos…)? :: Para que el rastro y la evaluación sepan por qué terminó cada ejecución, no solo que terminó. Así se puede contar cuántas llegaron al máximo, cuántas se bloquearon, y encontrar el problema.
```

## Parte 4. Los controles: datos, no órdenes, y montos con apoyo

Dos controles baratos, sin modelo (clase 26, patrón 15):

**De entrada.** `parece_inyeccion` busca frases típicas ("ignora las instrucciones", "system prompt") **sin tildes y en minúsculas**, y bloquea **antes** de que la pregunta llegue al modelo. Hay una prueba que lo confirma: con una inyección, el modelo de mentira **no recibe nada**. No es una defensa completa (clase 28, parte 6.4): la defensa de verdad es que las herramientas sean de solo lectura y que las instrucciones digan que lo que devuelven las herramientas son **datos, nunca órdenes**.

**De salida: ¿ese monto salió de tus datos?** Es la idea más útil del proyecto. Un modelo chico puede sumar mal "de cabeza" o inventar un número con toda seguridad. Entonces, antes de entregar, `numeros_sin_apoyo` saca los montos de la respuesta y busca cada uno **en lo que devolvieron las herramientas**:

```python
>>> numeros_sin_apoyo("Gastaste R$ 700,00.", [{"total": 651.1}])
[700.0]
```

Si hay un monto suelto, el ciclo le da **una** vuelta más al modelo ("estos números no salieron de ninguna herramienta…"). Si insiste, la respuesta se entrega **marcada** con un ⚠️, para que la persona no confíe a ciegas. Es la "evaluación de apoyo" de la clase 29 (parte 7.3), hecha con reglas.

Leer montos tiene su trampa: en Brasil `1.245,50` es mil doscientos; en Estados Unidos `651.10` es seiscientos. `_a_numero` decide por **cuál va último** (ese es el decimal), y las fechas (`2026-11-18`, `18/11`) se sacan antes, porque no son montos. Los enteros chicos (hasta 31) no se revisan: son días y cantidades ("4 gastos", "el día 18").

> 🧩 **Piezas para este ejercicio**
> - Para convertir un monto brasileño, retira primero el separador de miles y luego cambia la coma decimal por punto. `findall` recoge los textos encontrados. `abs(a - b)` mide su diferencia sin importar cuál es mayor. La comprobación es una señal sobre los montos, no una prueba de que toda la respuesta esté respaldada.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Ese monto salió de tus datos?
lenguaje: python
pide: Completa `a_numero(texto)`, que lee montos como se escriben en Brasil: `"1.245,50"` → `1245.5`, `"651,10"` → `651.1`, `"180"` → `180.0` (saca los puntos y cambia la coma por punto). Y `sin_apoyo(respuesta, totales)`: busca los montos de la respuesta con la expresión `MONTO` (`re.findall`) y devuelve los que **no** están en la lista `totales` (compara con una diferencia menor que `0.005`).
--- código
import re

MONTO = re.compile(r"\d[\d.]*,\d{2}|\d+")


def a_numero(texto):
    pass  # tu código aquí


def sin_apoyo(respuesta, totales):
    pass  # tu código aquí
--- pruebas
prueba("con miles", lambda: igual(a_numero("1.245,50"), 1245.5))
prueba("sin miles", lambda: igual(a_numero("651,10"), 651.1))
prueba("entero", lambda: igual(a_numero("180"), 180.0))
prueba("apoyado", lambda: igual(sin_apoyo("Gastaste R$ 651,10 este mes.", [651.1]), []))
prueba("inventado", lambda: igual(sin_apoyo("Gastaste R$ 700,00 y R$ 651,10.", [651.1]), [700.0]))
--- solución
import re

MONTO = re.compile(r"\d[\d.]*,\d{2}|\d+")


def a_numero(texto):
    return float(texto.replace(".", "").replace(",", "."))


def sin_apoyo(respuesta, totales):
    montos = [a_numero(t) for t in MONTO.findall(respuesta)]
    return [m for m in montos if not any(abs(m - t) < 0.005 for t in totales)]
```

```practica
vf :: El control de salida revisa que cada monto de la respuesta esté en lo que devolvieron las herramientas
vf :: Buscar frases como "ignora las instrucciones" alcanza para defenderse de la inyección de prompts
elige :: Si el modelo insiste con un monto sin apoyo, ¿qué hace el ciclo? :: Lo borra de la respuesta :: Entrega la respuesta marcada con un aviso :: Vuelve a intentar hasta que salga bien
escribe :: ¿Por qué el control saca las fechas antes de buscar montos? :: Porque una fecha como 2026-11-18 tiene números (2026, 11, 18) que no son montos y no van a estar en los totales: el control los marcaría como inventados.
```

## Parte 5. Correrlo de verdad con Ollama, y leer el rastro

**Ollama** corre modelos de lenguaje en tu computadora, gratis y sin internet, y ofrece una API en `http://127.0.0.1:11434`. El proyecto usa `qwen3.5:4b`: un modelo **chico** (4 mil millones de parámetros) que entiende herramientas y responde en pocos segundos en una Mac.

`agente/modelo.py` le manda a `/api/chat` los mensajes y los esquemas de las herramientas, con `"think": False` (sin pensar en voz alta: más rápido, y para esto alcanza). Y trae lo que aprendiste en la clase 28 (parte 6.3):

- **Tiempo máximo** en cada llamada.
- **Reintentos con espera exponencial y un poco de azar**, solo para errores pasajeros (429 y 5xx). Un 400 va a fallar igual: no se reintenta.
- **Errores para la persona:** si Ollama está apagado, dice `ollama serve`; si el modelo no está bajado, dice `ollama pull qwen3.5:4b`.

Así se ve una pregunta de verdad, con `--rastro`:

```text
$ python3 preguntar.py "¿Cuánto gasté en combustible este mes?" --hoy 2026-11-18 --rastro
Este mes gastaste R$ 651,10 en combustible (4 gastos).

3 pasos · herramientas: fecha_de_hoy, sumar_gastos · 3162 tokens · 9.2 s · costo: R$ 0 (corre en tu computadora) · fin: listo
    3223 ms  modelo        937 tokens
    3223 ms  fecha_de_hoy  {} ✓
    7585 ms  modelo        1065 tokens
    7585 ms  sumar_gastos  {"categoria": "combustible", "desde": "2026-11-01", "hasta": "2026-11-30"} ✓
    9149 ms  modelo        1160 tokens
    9149 ms  fin  listo
```

Léelo como en la clase 28 (parte 5.6): el modelo pidió **la fecha** primero (como dicen las instrucciones), después **sumó** del 1 al 30 de noviembre, y respondió con el monto que devolvió la herramienta. **Casi todo el tiempo es el modelo** (las herramientas tardan 0 ms). Y fíjate en los tokens: cada vuelta manda **toda** la conversación otra vez, por eso crecen (937 → 1065 → 1160). Es lo que viste en la clase 27 (parte 4.5): en los ciclos, manda la entrada.

Cada ejecución deja su rastro completo en `rastros/<id>.jsonl` (una línea JSON por evento). La carpeta está en `.gitignore`.

> 💡 **Idea:** `--hoy 2026-11-18` existe para que **la misma pregunta dé la misma respuesta** mientras pruebas. Sin eso, "este mes" cambia de respuesta cada mes.

> 🧩 **Piezas para este ejercicio**
> - Trabaja con una respuesta de ejemplo. `datos["message"]` trae un diccionario y `.get("tool_calls", [])` da una lista aunque falte esa clave. Solo llama a `json.loads` cuando los argumentos sean texto. Los contadores de entrada y salida se suman.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer lo que devuelve Ollama
lenguaje: python
pide: Ollama responde un JSON como `{"message": {"content": "", "tool_calls": [{"function": {"name": "sumar_gastos", "arguments": {"categoria": "comida"}}}]}, "prompt_eval_count": 900, "eval_count": 30}`. Completa `leer(datos)`, que devuelve `{"texto": …, "llamadas": [(nombre, argumentos)], "tokens": entrada + salida}`. Ojo: si `tool_calls` no viene, no hay llamadas; y algunos modelos mandan `arguments` **como texto JSON**: en ese caso conviértelo con `json.loads`.
--- código
import json


def leer(datos):
    pass  # tu código aquí
--- pruebas
LLAMADA = {"message": {"content": "", "tool_calls": [{"function": {"name": "sumar_gastos", "arguments": {"categoria": "comida"}}}]}, "prompt_eval_count": 900, "eval_count": 30}
prueba("una llamada", lambda: igual(leer(LLAMADA), {"texto": "", "llamadas": [("sumar_gastos", {"categoria": "comida"})], "tokens": 930}))
prueba("una respuesta sin llamadas", lambda: igual(leer({"message": {"content": "R$ 105,40"}, "prompt_eval_count": 1000, "eval_count": 12}), {"texto": "R$ 105,40", "llamadas": [], "tokens": 1012}))
prueba("argumentos como texto", lambda: igual(leer({"message": {"content": "", "tool_calls": [{"function": {"name": "x", "arguments": "{\"a\": 1}"}}]}, "prompt_eval_count": 1, "eval_count": 1})["llamadas"], [("x", {"a": 1})]))
--- solución
import json


def leer(datos):
    mensaje = datos["message"]
    llamadas = []
    for ll in mensaje.get("tool_calls", []):
        argumentos = ll["function"]["arguments"]
        if isinstance(argumentos, str):
            argumentos = json.loads(argumentos)
        llamadas.append((ll["function"]["name"], argumentos))
    tokens = datos.get("prompt_eval_count", 0) + datos.get("eval_count", 0)
    return {"texto": mensaje.get("content", ""), "llamadas": llamadas, "tokens": tokens}
```

```practica
vf :: Con Ollama, el modelo corre en tu computadora: no se paga por token ni hace falta internet
vf :: Si Ollama responde 400, conviene reintentar con espera exponencial
elige :: En el rastro, ¿por qué los tokens crecen en cada vuelta (937, 1065, 1160)? :: Porque el modelo se cansa :: Porque cada vuelta manda toda la conversación otra vez, con los resultados nuevos :: Porque Ollama cobra más
escribe :: ¿Para qué sirve la opción --hoy cuando pruebas el agente? :: Para fijar la fecha y que la misma pregunta dé la misma respuesta. Sin eso, "este mes" cambia cada mes y no puedes comparar una prueba con otra.
```

## Parte 6. Evaluar: los casos, 3 veces cada uno, y lo que se rompió

Las 46 pruebas dicen que **tu código** hace lo que debe. No dicen nada de **cómo responde el modelo**. Para eso está `evaluar.py` (clase 28): los casos de `evaluacion/casos.json`, **cada uno 3 veces** (una sola ejecución no dice casi nada), calificados con **reglas**: qué herramientas usó, si dijo el monto, cómo terminó. Sin otro modelo como juez: baratas, rápidas y siempre iguales.

**La primera vuelta, con `qwen3.5:4b`:**

```text
Tasa de éxito: 19 de 24 (79%)
pass^3 (los 3 intentos bien): 5 de 8 casos
Demora p50: 6.3 s · p95: 8.5 s · costo: R$ 0
```

Cinco salieron bien las tres veces: los cuatro de "cuánto gasté" y la inyección. Tres no. **Antes de tocar nada se leyeron los rastros** de las cinco fallas (clase 28, parte 5.6):

**Falla 1: el error era mío, no del modelo.** En "¿Qué día es hoy?" y en "¿cuál fue mi último gasto de mantenimiento?", el rastro decía `números sin apoyo: [2026.0]`. El modelo había respondido bien ("noviembre **de 2026**"), pero **mi control** no contaba el 2026 como apoyado, porque venía **dentro de un texto** (`"hoy": "2026-11-18"`), y solo miraba los números sueltos. El control le pidió corregir algo que estaba bien, y el modelo se confundió ("Acepto la corrección…"). **Arreglo:** primero una prueba en rojo (`test_el_anio_de_una_fecha_de_la_herramienta_tiene_apoyo`), después contar también los números dentro de los textos.

> 💡 **Idea:** un control demasiado estricto **también** es una falla: rompe respuestas buenas. Por eso un control se evalúa con el modelo de verdad, no solo con pruebas.

**Falla 2: la lista cerrada jugó en contra.** "¿Cuánto gasté en peajes este mes?" falló las tres veces, y el rastro mostró algo que ninguna prueba veía: el modelo **nunca mandó "peajes"**. Como la categoría es una lista cerrada (`enum`), eligió la más parecida, `mantenimiento`, y respondió *"R$ 180,00 en peajes"*. El error que enseña ("No hay una categoría 'peajes'…") **nunca se disparó**, y el control de apoyo tampoco: el 180 sí salió de una herramienta. **Arreglo:** una regla en las instrucciones y en la descripción de `sumar_gastos`: si preguntan por algo que no es una categoría, no la cambies por una parecida.

**La trampa de "estudiar para el examen".** El primer arreglo ponía "peajes" como ejemplo en el prompt: el mismo caso de la evaluación. Eso es hacer trampa sin querer (clase 28, parte 5.5). Se cambió el ejemplo por "el seguro, el lavado", y se agregó un caso **nuevo** que el prompt nunca nombra: **estacionamiento**.

**La segunda vuelta:**

```text
Tasa de éxito: 23 de 27 (85%)
pass^3 (los 3 intentos bien): 7 de 9 casos
Demora p50: 6.3 s · p95: 9.5 s · costo: R$ 0
```

| Caso | 1.ª vuelta | 2.ª vuelta |
|---|---|---|
| Los cuatro de "cuánto gasté" | 12 de 12 | 12 de 12 |
| Último mantenimiento | 2 de 3 | **3 de 3** (era el control) |
| Qué día es hoy | 2 de 3 | **3 de 3** (era el control) |
| Peajes (no existe) | 0 de 3 | 0 de 3 |
| Estacionamiento (no existe, caso nuevo) | — | 2 de 3 |
| Inyección | 3 de 3 | 3 de 3 |

**Lo que sigue roto, y es lo más honesto de la clase.** Con peajes, el modelo ahora sí dice *"No tengo gastos de peajes anotados"*… y después **agrega** el total de combustible, que nadie pidió. Ya no inventa, pero mezcla. **Un prompt más largo no lo arregla con un modelo de 4 mil millones de parámetros**, y seguir ajustando el prompt contra estos mismos casos sería estudiar para el examen. El siguiente arreglo va **en el código**: un enrutador barato (clase 25, parte 2.4) que, antes del modelo, mira si la pregunta nombra una categoría que existe; si no, responde sin llamarlo. Otra opción es probar un modelo más grande (`python3 evaluar.py --modelo gemma4:12b`) y comparar con los mismos casos: **así se elige un modelo**, con tus casos, no con una demo (clase 27, parte 4.5).

> 📌 **Nota:** fíjate en lo que **no** se hizo: no se borró el caso de peajes para que el número subiera. Un caso que falla es información. Es la regla de `AGENTS.md`: "Nunca borres una prueba ni un caso de evaluación para que pase".

> 🧩 **Piezas para este ejercicio**
> - Primero revisa las herramientas que el caso esperaba y luego su texto. Para contar los casos que aprobaron todos sus intentos, exige que haya algún resultado. `all([])` da `True` en Python, así que sirve comprobar por separado que el caso sí se ejecutó.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Calificar con reglas y sacar el pass^k
lenguaje: python
pide: Completa `calificar(caso, r)`: devuelve la lista de problemas de una ejecución, en este orden: `"no usó X"` por cada herramienta de `caso["debe_usar"]` que no esté en `r["herramientas"]`, y `"no dijo el monto"` si `caso["monto"]` (un texto como `"651,10"`) no está **dentro** de `r["texto"]`. Y `pass_k(resultados)`: recibe un diccionario `{caso: [True, False, …]}` y devuelve cuántos casos se ejecutaron al menos una vez y salieron bien **todas** las veces.
--- código
def calificar(caso, r):
    pass  # tu código aquí


def pass_k(resultados):
    pass  # tu código aquí
--- pruebas
CASO = {"debe_usar": ["fecha_de_hoy", "sumar_gastos"], "monto": "651,10"}
prueba("aprobó", lambda: igual(calificar(CASO, {"herramientas": ["fecha_de_hoy", "sumar_gastos"], "texto": "R$ 651,10"}), []))
prueba("sin la fecha", lambda: igual(calificar(CASO, {"herramientas": ["sumar_gastos"], "texto": "R$ 651,10"}), ["no usó fecha_de_hoy"]))
prueba("con otro monto", lambda: igual(calificar(CASO, {"herramientas": ["fecha_de_hoy", "sumar_gastos"], "texto": "R$ 600,00"}), ["no dijo el monto"]))
prueba("pass^3", lambda: igual(pass_k({"mes": [True, True, True], "hoy": [True, False, True], "peajes": [True, True, True]}), 2))
prueba("un caso sin ejecutar no se cuenta", lambda: igual(pass_k({"sin ejecutar": [], "mes": [True]}), 1))
--- solución
def calificar(caso, r):
    problemas = [f"no usó {h}" for h in caso["debe_usar"] if h not in r["herramientas"]]
    if caso["monto"] not in r["texto"]:
        problemas.append("no dijo el monto")
    return problemas


def pass_k(resultados):
    return sum(1 for veces in resultados.values() if veces and all(veces))
```

```practica
vf :: Que las 46 pruebas pasen quiere decir que el agente responde bien
vf :: La evaluación de este proyecto califica con reglas, no con otro modelo
elige :: ¿Qué mide pass^3? :: Cuántos casos salieron bien al menos una vez de tres :: Cuántos casos salieron bien las tres veces :: El promedio de pasos
escribe :: Una persona te cuenta que el agente le inventó un monto. ¿Qué haces primero? :: Busco su rastro, veo qué devolvieron las herramientas y en qué paso apareció el número, y convierto ese caso en un caso nuevo del set de evaluación antes de arreglarlo, para que no vuelva a pasar sin que se note.
```

## Para la entrevista

> 🎤 **Si te preguntan "cuéntame de un agente que construiste y qué se rompió"** (la pregunta 12 de la clase 29): "Hice un Copiloto de gastos que corre gratis con Ollama, con un modelo chico de 4 mil millones de parámetros. Tres herramientas de solo lectura, frenos en el código (pasos, tokens, llamadas repetidas), un control que revisa que cada monto salga de las herramientas, rastros de cada ejecución, y 46 pruebas con un modelo de mentira. Después lo medí con 9 casos, 3 veces cada uno. Lo que se rompió: un control mío que marcaba como inventado el año de una fecha (lo encontré leyendo los rastros, no las pruebas), y que la lista cerrada de categorías hacía que el modelo cambiara "peajes" por "mantenimiento" sin avisar. Subí de 79% a 85%, sin borrar casos, y no puse en el prompt el ejemplo de la evaluación. Lo que queda, una categoría que no existe, lo arreglaría en el código con un enrutador antes del modelo."

> 🌎 **En la vida real:** es como contar cómo armaste tu taller: qué herramientas pusiste y por qué, qué medidas de seguridad, y qué se rompió la primera semana y cómo lo arreglaste.

> 🌎 **Otro ejemplo:** es como el piloto que muestra su bitácora de vuelo: no dice "vuelo bien", dice cuántas horas, en qué condiciones y qué pasó cuando algo falló.
