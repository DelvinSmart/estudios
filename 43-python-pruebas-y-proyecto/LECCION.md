# Python 8: pruebas y un proyecto real

> 🌎 **En la vida real:** aprender a manejar no termina con la teoría: termina cuando sales a la calle y llegas a algún lado. Esta clase junta todo en un programa de verdad, y con pruebas que confirman que funciona.

> 🎙️ **El profesor dice:** la última clase del curso **Python**. Primero, cómo se prueba el código con **pytest** (lo mismo que hiciste con Jest en los Temas 02 y 03, ahora en Python). Después, un proyecto completo y útil para tu trabajo: **un resumen de la semana de un conductor**, que lee los viajes y gastos de un archivo, calcula ganancias, y avisa del aceite. Al final, cómo llamar a una API.

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
