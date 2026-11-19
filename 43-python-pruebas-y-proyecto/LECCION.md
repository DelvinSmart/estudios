# Python 8: pruebas y un proyecto real

> 🌎 **En la vida real:** aprender a manejar no termina con la teoría: termina cuando sales a la calle y llegas a algún lado. Esta clase junta todo en un programa de verdad, y con pruebas que confirman que funciona.

> 🎙️ **El profesor dice:** la última clase de teoría del curso **Python** (después viene el proyecto final). Primero, cómo se prueba el código con **pytest** (lo mismo que hiciste con Jest en los Temas 02 y 03, ahora en Python). Después, un proyecto completo y útil para tu trabajo: **un resumen de la semana de un conductor**, que lee los viajes y gastos de un archivo, calcula ganancias, y avisa del aceite. Al final, cómo llamar a una API.

## Parte 1. Pruebas con pytest

> 🌎 **En la vida real:** antes de entregar un carro reparado, el mecánico lo prueba en la calle. Una prueba automática es esa vuelta de prueba, hecha por la computadora, cada vez.

> 🌎 **Otro ejemplo:** Es como la tabla de multiplicar que repasas: si dices 7 × 8 = 56, sabes que lo tienes bien.

### Instalar y escribir una prueba

```bash
python3 -m venv .venv && source .venv/bin/activate
python -m pip install pytest
```

```python
# calculos.py
def ganancia_neta(bruto: float, gastos: float) -> float:
    if bruto < 0 or gastos < 0:
        raise ValueError("Los montos no pueden ser negativos")
    return round(bruto - gastos, 2)
```

```python
# test_calculos.py
import pytest
from calculos import ganancia_neta

def test_resta_los_gastos():
    assert ganancia_neta(300, 80.5) == 219.5

def test_sin_gastos_queda_todo():
    assert ganancia_neta(150, 0) == 150

def test_montos_negativos_dan_error():
    with pytest.raises(ValueError):
        ganancia_neta(-10, 5)
```

```bash
pytest          # busca los archivos test_*.py y corre las funciones test_*
```

`assert` es "afirmo que esto es verdad"; si no lo es, la prueba falla y pytest te muestra qué valor esperaba y cuál salió.

> 🌎 **En la vida real:** `assert` es como el control de calidad que mide cada pieza: si no mide lo que debe, la aparta.

> 🌎 **Otro ejemplo:** Es como el corrector de un examen de opción múltiple: compara tu respuesta con la correcta.

### Qué probar

Lo normal (el caso de todos los días), los **bordes** (cero, vacío, el máximo) y los **errores** (datos malos). Igual que en los Temas 02 y 03.

> 🌎 **En la vida real:** al probar un ascensor, pruebas un piso normal, el último piso y qué pasa si se corta la luz.

> 🌎 **Otro ejemplo:** Es como probar una receta con la cantidad normal, el doble y sin sal.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pruebas que atrapan el sabotaje
lenguaje: python
pide: `ganancia_neta` ya está bien hecha. Escribe **tú** sus pruebas, como en pytest: `test_resta_los_gastos` (con `assert`) y `test_montos_negativos_dan_error` (que llame con un monto negativo y compruebe que sale `ValueError`: sin pytest, usa `try`/`except` y, si no salió, `raise AssertionError`). Las pruebas del mapa van a **sabotear** la función, y tus pruebas tienen que darse cuenta.
--- código
def ganancia_neta(bruto, gastos):
    if bruto < 0 or gastos < 0:
        raise ValueError("Los montos no pueden ser negativos")
    return round(bruto - gastos, 2)


def test_resta_los_gastos():
    pass  # tu código aquí


def test_montos_negativos_dan_error():
    pass  # tu código aquí
--- pruebas
def atrapa(prueba_tuya, saboteada):
    buena = globals()["ganancia_neta"]
    globals()["ganancia_neta"] = saboteada
    try:
        prueba_tuya()
    except AssertionError:
        return True
    finally:
        globals()["ganancia_neta"] = buena
    return False
prueba("con la función buena, tus pruebas pasan", lambda: (test_resta_los_gastos(), test_montos_negativos_dan_error()))
prueba("atrapan una resta al revés", lambda: ok(atrapa(test_resta_los_gastos, lambda b, g: round(g - b, 2)), "test_resta_los_gastos no se dio cuenta"))
prueba("atrapan que se olvide de los gastos", lambda: ok(atrapa(test_resta_los_gastos, lambda b, g: b), "test_resta_los_gastos no se dio cuenta"))
prueba("atrapan que ya no avise de los negativos", lambda: ok(atrapa(test_montos_negativos_dan_error, lambda b, g: round(b - g, 2)), "test_montos_negativos_dan_error no se dio cuenta"))
--- solución
def ganancia_neta(bruto, gastos):
    if bruto < 0 or gastos < 0:
        raise ValueError("Los montos no pueden ser negativos")
    return round(bruto - gastos, 2)


def test_resta_los_gastos():
    assert ganancia_neta(300, 80.5) == 219.5
    assert ganancia_neta(150, 0) == 150


def test_montos_negativos_dan_error():
    try:
        ganancia_neta(-10, 5)
    except ValueError:
        return
    raise AssertionError("con un monto negativo tenía que salir ValueError")
```

```practica
vf :: pytest corre las funciones que empiezan con test_ en los archivos test_*.py
vf :: Una buena prueba solo revisa el caso normal
elige :: ¿Qué hace assert en una prueba? :: Imprime un mensaje :: Afirma que algo es verdad; si no, la prueba falla :: Instala pytest
elige :: ¿Cómo pruebas que una función lanza ValueError? :: Con print :: Con with pytest.raises(ValueError): :: No se puede
escribe :: Escribe una prueba para rendimiento(km, litros) que confirme que 400 km con 40 litros da 10. :: def test_rendimiento(): (con 4 espacios) assert rendimiento(400, 40) == 10
```

## Parte 2. El proyecto: resumen de la semana

> 🌎 **En la vida real:** al final de la semana, un conductor quiere saber tres cosas: cuánto ganó, cuánto gastó y cuánto le quedó. Este programa lo responde solo.

> 🌎 **Otro ejemplo:** Es como el cierre de caja de una tienda: suma ventas, resta gastos y anota el resultado.

### Los datos

El archivo `semana.csv` (puedes crearlo en VS Code y guardarlo junto al programa):

```text
fecha,tipo,app,valor
2026-11-10,viaje,Uber,32.50
2026-11-10,viaje,99,18.00
2026-11-10,gasto,combustible,150.00
2026-11-11,viaje,Uber,45.00
2026-11-11,gasto,lavado,30.00
2026-11-12,viaje,Uber,88.00
2026-11-12,viaje,InDrive,40.00
2026-11-13,viaje,99,52.50
```

> 🌎 **En la vida real:** es la libreta del conductor, pasada en limpio a una planilla.

> 🌎 **Otro ejemplo:** Es como el extracto del banco: cada movimiento en su fila.

### El código, ordenado en funciones

```python
# resumen.py
import csv
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Movimiento:
    fecha: str
    tipo: str      # "viaje" o "gasto"
    detalle: str   # la app o el tipo de gasto
    valor: float

def leer_movimientos(ruta: Path) -> list[Movimiento]:
    with ruta.open(encoding="utf-8") as f:
        filas = csv.DictReader(f)
        return [Movimiento(r["fecha"], r["tipo"], r["app"], float(r["valor"])) for r in filas]

def resumir(movimientos: list[Movimiento]) -> dict:
    ganado = sum(m.valor for m in movimientos if m.tipo == "viaje")
    gastado = sum(m.valor for m in movimientos if m.tipo == "gasto")
    por_app = defaultdict(float)
    for m in movimientos:
        if m.tipo == "viaje":
            por_app[m.detalle] += m.valor
    return {"ganado": round(ganado, 2), "gastado": round(gastado, 2),
            "neto": round(ganado - gastado, 2), "por_app": dict(por_app)}

if __name__ == "__main__":
    r = resumir(leer_movimientos(Path("semana.csv")))
    print(f"Ganado: R$ {r['ganado']:.2f}")
    print(f"Gastado: R$ {r['gastado']:.2f}")
    print(f"Te quedó: R$ {r['neto']:.2f}")
    for app, total in sorted(r["por_app"].items(), key=lambda x: x[1], reverse=True):
        print(f"  {app}: R$ {total:.2f}")
```

Fíjate cómo junta **todo el curso**: archivos y CSV (Python 5), dataclasses (Python 7), funciones puras (Python 4), comprensiones y diccionarios (Python 3), módulos y `__main__` (Python 6).

> 🌎 **En la vida real:** es como un plato que usa todas las técnicas que aprendiste en el curso de cocina.

> 🌎 **Otro ejemplo:** Es como el examen final de manejo: arranque, cambios, estacionar y rotondas en un solo recorrido.

### Probar el proyecto

`resumir` es pura (recibe una lista, devuelve un diccionario), así que se prueba sin archivos:

```python
# test_resumen.py
from resumen import Movimiento, resumir

def test_resumen_de_un_dia():
    datos = [Movimiento("d", "viaje", "Uber", 30), Movimiento("d", "gasto", "combustible", 10)]
    r = resumir(datos)
    assert r["neto"] == 20
    assert r["por_app"] == {"Uber": 30}

def test_semana_vacia():
    assert resumir([])["neto"] == 0
```

> 🌎 **En la vida real:** es como probar la calculadora de la caja con montos chicos antes de abrir la tienda.

> 🌎 **Otro ejemplo:** Es como ensayar la mudanza con una caja antes de mover todo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El resumen de la semana
lenguaje: python
pide: Completa `resumir(movimientos)`, la función pura del proyecto: devuelve un diccionario con `ganado` (la suma de los viajes), `gastado` (la de los gastos), `neto` y `por_app` (cuánto se ganó en cada app, solo de los viajes). Los tres totales, redondeados a 2 decimales. La dataclass `Movimiento` ya está.
--- código
from dataclasses import dataclass


@dataclass
class Movimiento:
    fecha: str
    tipo: str      # "viaje" o "gasto"
    detalle: str   # la app o el tipo de gasto
    valor: float


def resumir(movimientos):
    pass  # tu código aquí
--- pruebas
semana = [
    Movimiento("2026-11-10", "viaje", "Uber", 32.5),
    Movimiento("2026-11-10", "viaje", "99", 18.0),
    Movimiento("2026-11-10", "gasto", "combustible", 150.0),
    Movimiento("2026-11-11", "viaje", "Uber", 45.0),
    Movimiento("2026-11-11", "gasto", "lavado", 30.0),
]
prueba("la semana", lambda: igual(resumir(semana), {"ganado": 95.5, "gastado": 180.0, "neto": -84.5, "por_app": {"Uber": 77.5, "99": 18.0}}))
prueba("una semana vacía", lambda: igual(resumir([]), {"ganado": 0, "gastado": 0, "neto": 0, "por_app": {}}))
prueba("sin centavos raros", lambda: igual(resumir([Movimiento("d", "viaje", "Uber", 0.1), Movimiento("d", "viaje", "Uber", 0.2)])["ganado"], 0.3))
--- solución
from dataclasses import dataclass


@dataclass
class Movimiento:
    fecha: str
    tipo: str      # "viaje" o "gasto"
    detalle: str   # la app o el tipo de gasto
    valor: float


def resumir(movimientos):
    ganado = sum(m.valor for m in movimientos if m.tipo == "viaje")
    gastado = sum(m.valor for m in movimientos if m.tipo == "gasto")
    por_app = {}
    for m in movimientos:
        if m.tipo == "viaje":
            por_app[m.detalle] = por_app.get(m.detalle, 0) + m.valor
    return {"ganado": round(ganado, 2), "gastado": round(gastado, 2), "neto": round(ganado - gastado, 2), "por_app": por_app}
```

```practica
vf :: Separar leer_movimientos de resumir hace que resumir se pueda probar sin archivos
vf :: Para probar el resumen hace falta siempre un archivo CSV real
elige :: ¿Para qué sirve defaultdict(float)? :: Para ordenar :: Para sumar por llave sin revisar si la llave ya existe (empieza en 0.0) :: Para leer CSV
elige :: ¿Qué temas del curso usa el proyecto? :: Solo print :: Archivos y CSV, dataclasses, funciones puras, comprensiones y __main__ :: Ninguno
escribe :: Agrega al resumen el promedio por viaje. ¿Qué calcularías y qué cuidado tendrías? :: Contaría los movimientos de tipo viaje y dividiría lo ganado entre esa cantidad, revisando antes que la cantidad no sea cero para no dividir por cero.
```

## Parte 3. Llamar a una API

> 🌎 **En la vida real:** una API es como la ventanilla de un servicio: pides algo con un formulario y te responden con datos.

> 🌎 **Otro ejemplo:** Es como preguntar el clima por teléfono a un servicio: preguntas la ciudad y te dicen la temperatura.

### Con la biblioteca estándar

Python puede pedir datos a internet sin instalar nada (`urllib`). La respuesta suele venir en **JSON**:

```python
import json
from urllib.request import urlopen

with urlopen("https://api.github.com/repos/DelvinSmart/estudios") as respuesta:
    datos = json.load(respuesta)
print(datos["name"], "·", datos["stargazers_count"], "estrellas")
```

Muchos proyectos usan el paquete **requests**, que hace lo mismo con menos líneas (`requests.get(url).json()`).

> 🌎 **En la vida real:** es como mandar un mensaje y recibir la respuesta en un formato que todos entienden.

> 🌎 **Otro ejemplo:** Es como el cajero automático que te devuelve el saldo impreso.

### Cuidados

- Una API puede **fallar** (sin internet, servidor caído): usa `try`/`except` (Python 5).
- Las **claves** de una API nunca van en el código: en una variable de entorno (`os.environ["MI_CLAVE"]`) o un `.env` que no se sube (Tema 22).
- Respeta los **límites** de uso de cada API.

> 🌎 **En la vida real:** si llamas a un número y no contestan, no rompes el teléfono: vuelves a intentar más tarde.

> 🌎 **Otro ejemplo:** Es como la llave de tu casa: no la dejas pegada en la puerta para que cualquiera la use.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una API que puede fallar
lenguaje: python
pide: En vez de ir a internet, `pedir` es una función que te dan: devuelve el texto JSON de la respuesta o lanza `OSError` si no hay conexión. Completa `estrellas(pedir)`: devuelve `"estudios · 3 estrellas"` (con `name` y `stargazers_count` del JSON), o `None` si falla la conexión (`OSError`) o si el texto no es JSON (`json.JSONDecodeError`). Y `clave_de_api(entorno)`: devuelve `entorno["MI_CLAVE"]`, o lanza `RuntimeError("Falta MI_CLAVE en el entorno")` si no está.
--- código
import json


def estrellas(pedir):
    pass  # tu código aquí


def clave_de_api(entorno):
    pass  # tu código aquí
--- pruebas
def sin_internet():
    raise OSError("sin conexión")
prueba("una respuesta buena", lambda: igual(estrellas(lambda: '{"name": "estudios", "stargazers_count": 3}'), "estudios · 3 estrellas"))
prueba("sin internet: None", lambda: igual(estrellas(sin_internet), None))
prueba("una respuesta rota: None", lambda: igual(estrellas(lambda: "<html>error 502</html>"), None))
prueba("la clave del entorno", lambda: igual(clave_de_api({"MI_CLAVE": "abc123"}), "abc123"))
@prueba("sin clave: un error claro")
def _():
    try:
        clave_de_api({})
    except RuntimeError as e:
        igual(str(e), "Falta MI_CLAVE en el entorno")
        return
    raise AssertionError("tenía que lanzar RuntimeError")
--- solución
import json


def estrellas(pedir):
    try:
        datos = json.loads(pedir())
    except (OSError, json.JSONDecodeError):
        return None
    return f"{datos['name']} · {datos['stargazers_count']} estrellas"


def clave_de_api(entorno):
    if "MI_CLAVE" not in entorno:
        raise RuntimeError("Falta MI_CLAVE en el entorno")
    return entorno["MI_CLAVE"]
```

```practica
vf :: Con urllib de la biblioteca estándar se pueden pedir datos a una API sin instalar nada
vf :: La clave de una API se puede escribir directo en el código si el repositorio es privado
elige :: ¿En qué formato suelen responder las APIs? :: PDF :: JSON :: MP3
elige :: Si la API no responde, ¿qué haces en el código? :: Nada :: La atrapas con try y except y avisas o reintentas :: Borras el programa
escribe :: ¿Dónde guardarías la clave de una API en un proyecto de Python y cómo la leerías? :: En una variable de entorno o en un archivo .env que está en .gitignore, y la leo con os.environ["NOMBRE_DE_LA_CLAVE"].
```

## Parte 4. Tu camino con Python

> 🌎 **En la vida real:** terminar el curso de manejo es el comienzo: después vienen la carretera, la lluvia y la noche.

> 🌎 **Otro ejemplo:** Es como aprender un idioma: el curso te da la base, hablarlo todos los días te da la fluidez.

### Qué sigue

- **Automatizar** tareas tuyas: ordenar archivos, leer planillas, armar reportes.
- **Datos:** `pandas` para planillas grandes y gráficos con `matplotlib`.
- **Web y APIs:** `FastAPI` para hacer tu propio servidor (como el CRUD del Tema 09, en Python).
- **IA y agentes:** el curso **Agentes de IA** de este mapa usa Python en sus ejemplos.

> 🌎 **En la vida real:** es como elegir especialidad después de la universidad.

> 🌎 **Otro ejemplo:** Es como el árbol de habilidades de un videojuego: ya tienes la base, eliges la rama.

### Practica con proyectos chicos

Un proyecto por semana, chico y tuyo: el resumen de la semana con gráficos, un recordatorio de mantenimiento del carro, un lector de tus extractos. Cada uno con su **entorno virtual**, sus **pruebas** y su repositorio en GitHub: eso es tu portafolio.

> 🌎 **En la vida real:** es como el músico que toca una canción nueva cada semana.

> 🌎 **Otro ejemplo:** Es como el que va al gimnasio poco pero siempre: a los meses se nota.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La lista de tu próximo proyecto
lenguaje: python
pide: Antes de dar por terminado un proyecto chico, se revisa la lista. Completa `que_falta(proyecto)`: recibe un diccionario como `{"entorno": True, "requirements": False, "pruebas": True, "git": True}` y devuelve lo que falta, siempre en este orden: `entorno`, `requirements`, `pruebas`, `git`. Si una llave no está, también falta. Y `listo(proyecto)`: `True` solo si no falta nada.
--- código
PASOS = ["entorno", "requirements", "pruebas", "git"]


def que_falta(proyecto):
    pass  # tu código aquí


def listo(proyecto):
    pass  # tu código aquí
--- pruebas
prueba("falta uno", lambda: igual(que_falta({"entorno": True, "requirements": False, "pruebas": True, "git": True}), ["requirements"]))
prueba("en orden, y lo que no está también falta", lambda: igual(que_falta({"git": True, "pruebas": False}), ["entorno", "requirements", "pruebas"]))
prueba("listo", lambda: igual(listo({p: True for p in PASOS}), True))
prueba("no listo", lambda: igual(listo({"entorno": True}), False))
--- solución
PASOS = ["entorno", "requirements", "pruebas", "git"]


def que_falta(proyecto):
    return [paso for paso in PASOS if not proyecto.get(paso, False)]


def listo(proyecto):
    return not que_falta(proyecto)
```

```practica
vf :: Para trabajar con planillas grandes en Python se usa mucho pandas
vf :: Después del curso conviene esperar a saberlo todo antes de hacer un proyecto propio
elige :: ¿Qué paquete usarías para hacer tu propio servidor de APIs en Python? :: pytest :: FastAPI :: csv
elige :: ¿Qué hace que un proyecto chico sirva para tu portafolio? :: Que sea secreto :: Que tenga su entorno virtual, pruebas y esté en GitHub :: Que no tenga pruebas
escribe :: Propón un proyecto chico en Python para tu trabajo como conductor y di qué partes del curso usaría. :: Por ejemplo: un recordatorio de mantenimiento que lea los km de un CSV y avise cuándo toca cambiar aceite; usaría archivos y CSV, funciones, fechas con datetime, una dataclass y pruebas con pytest.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué has hecho con Python?":** "Hice un resumen semanal de ganancias para conductores: lee los movimientos de un CSV en dataclasses, calcula lo ganado, lo gastado, lo neto y el total por app con funciones puras, y lo pruebo con pytest, incluidos los casos borde. Uso entornos virtuales, requirements.txt, manejo errores con try y except, y las claves de APIs van en variables de entorno."

> 🌎 **En la vida real:** es como mostrar el mueble que hiciste en el taller: cómo lo pensaste, cómo lo armaste y cómo comprobaste que aguanta.

> 🌎 **Otro ejemplo:** Es como el portafolio de un fotógrafo: no dice "sé sacar fotos", las muestra.
