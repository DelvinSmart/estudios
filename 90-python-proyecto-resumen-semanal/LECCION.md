# Python 9: proyecto final, el resumen de la semana

> 🌎 **En la vida real:** el aprendiz de contador ya sabe sumar, ordenar facturas y llenar un formulario. Su examen final es cerrar el mes de un cliente de verdad: recibir la caja de papeles como venga, revisar cada uno, avisar qué falta, y entregar un informe claro. Esta clase es tu primer cierre de mes.

> 🎙️ **El profesor dice:** {{alumno}}, en la clase 43 armaste un primer resumen de la semana. Hoy lo terminas **como un programa de verdad**: revisa cada fila de la planilla y te dice **todos** los problemas con su línea, aguanta una planilla exportada de Excel, muestra el resumen por app y tu mejor día, se usa desde la terminal como cualquier herramienta, y tiene **28 pruebas con pytest** que se probaron rompiendo el código a propósito. Lo recorres pieza por pieza, y en cada parte escribes tú una pieza en Python, aquí mismo.

**Lo que vas a recorrer** (está completo en la carpeta `90-python-proyecto-resumen-semanal/proyecto` de este mismo repositorio):

| Pieza | Archivo | Su tarea |
|---|---|---|
| El programa | `resumen.py` | Leer, revisar, calcular y mostrar, cada cosa en su función |
| Las pruebas | `tests/test_resumen.py` | 28 pruebas con pytest |
| Una planilla de ejemplo | `datos/semana.csv` | Una semana de viajes y gastos |
| Lo que hay que instalar | `requirements.txt` | Solo `pytest==9.2.0` (el programa usa la biblioteca estándar) |
| La configuración de pytest | `pyproject.toml` | Dónde están las pruebas |
| Lo que no se sube | `.gitignore` | `.venv/`, `__pycache__/` y `.pytest_cache/` |

## Parte 1. El plano y la planilla

El programa se usa así:

```bash
python3 resumen.py datos/semana.csv
```

```text
Resumen de la semana
  Ganado:    R$ 364,50  (8 viajes, R$ 45,56 por viaje)
  Gastado:   R$ 185,40
  Te quedó:  R$ 179,10
Por app:
  Uber: R$ 226,50
  99: R$ 98,00
  InDrive: R$ 40,00
Mejor día: 18/11 con R$ 128,00
```

La planilla tiene **cuatro columnas** y una fila por movimiento:

```text
fecha,tipo,detalle,valor
2026-11-16,viaje,Uber,32.50
2026-11-16,gasto,combustible,150.00
```

`detalle` es la app (en un viaje) o el tipo de gasto. En la clase 43 esa columna se llamaba `app`, pero en un gasto no hay app: el nombre tiene que decir lo que guarda.

**Las puertas y ventanas:**

| Caso | Qué hace el programa |
|---|---|
| Una fecha que no existe (`2026-02-30`) o mal escrita (`16/11/2026`) | La anota como problema, con su línea |
| Un tipo que no es `viaje` ni `gasto` | Problema |
| Un valor con letras, 0 o negativo | Problema |
| Un valor con coma (`32,50`) | Lo entiende |
| **Varias filas malas** | Las muestra **todas juntas**, no solo la primera |
| Faltan columnas | Lo dice, y cuál es la primera línea correcta |
| Filas vacías `,,,` (Excel las deja al exportar) | Las salta |
| La planilla viene de **Excel** | La lee igual (Parte 6 cuenta por qué no era obvio) |
| El archivo no existe | "No encontré la planilla…", sin un traceback |
| Una semana sin viajes | No se rompe: todo en 0 |

**El proyecto, en su propia caja** (clase 41):

```bash
cd estudios/90-python-proyecto-resumen-semanal/proyecto
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

> 🌎 **En la vida real:** las puertas y ventanas son como la lista de lo que revisa el contador antes de aceptar una caja de facturas: que tengan fecha, que el monto se lea, que no haya una factura de un día que no existe. Y si hay cinco problemas, te los dice los cinco juntos, no uno por semana.

> 🌎 **Otro ejemplo:** el nombre `detalle` en vez de `app` es como el rótulo de una carpeta: si dice "Uber" y adentro hay facturas de lavado, el próximo que la abra se confunde.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Están las columnas?
lenguaje: python
pide: Completa `columnas_que_faltan(primera_linea)`: recibe la primera línea de la planilla y devuelve la lista de columnas de `COLUMNAS` que no están, en ese orden. Quítale los espacios a cada nombre. Y cuidado: si la planilla viene de Excel, la primera línea puede empezar con una marca invisible, `"﻿"`: quítala antes (con `lstrip("﻿")`).
--- código
COLUMNAS = ("fecha", "tipo", "detalle", "valor")


def columnas_que_faltan(primera_linea):
    pass  # tu código aquí
--- pruebas
prueba("están todas", lambda: igual(columnas_que_faltan("fecha,tipo,detalle,valor"), []))
prueba("con espacios", lambda: igual(columnas_que_faltan("fecha, tipo, detalle, valor"), []))
prueba("la vieja, con app", lambda: igual(columnas_que_faltan("fecha,tipo,app,valor"), ["detalle"]))
prueba("de Excel, con la marca invisible", lambda: igual(columnas_que_faltan("﻿fecha,tipo,detalle,valor"), []))
prueba("vacía", lambda: igual(columnas_que_faltan(""), ["fecha", "tipo", "detalle", "valor"]))
--- solución
COLUMNAS = ("fecha", "tipo", "detalle", "valor")


def columnas_que_faltan(primera_linea):
    nombres = [n.strip() for n in primera_linea.lstrip("﻿").split(",")]
    return [c for c in COLUMNAS if c not in nombres]
```

```practica
vf :: Si la planilla tiene cinco filas malas, el programa avisa solo la primera
vf :: El programa resumen.py no necesita instalar nada para correr; pytest es solo para las pruebas
elige :: ¿Por qué la columna se llama detalle y no app? :: Porque es más corta :: Porque en un gasto no hay app: el nombre tiene que decir lo que guarda :: Porque CSV lo pide
elige :: ¿Qué hace el programa si el archivo no existe? :: Muestra un traceback :: Dice "No encontré la planilla…" y termina con código 1 :: Crea el archivo
escribe :: Escribe tres "puertas y ventanas" del programa y qué hace en cada una. :: Una fecha que no existe: la anota como problema con su línea. Varias filas malas: las muestra todas juntas. El archivo no existe: dice "No encontré la planilla" sin traceback. (También: valor 0 o con letras, coma de Brasil, filas ",,,", columnas que faltan, Excel, semana sin viajes.)
```

## Parte 2. Revisar una fila

Cada fila se convierte en un `Movimiento`, una dataclass **congelada** (clase 42):

```python
@dataclass(frozen=True)
class Movimiento:
    fecha: date
    tipo: str      # "viaje" o "gasto"
    detalle: str   # la app o el tipo de gasto
    valor: float
```

`frozen=True` quiere decir que, una vez creado, no se puede cambiar: nadie puede, sin querer, cambiar el valor de un viaje a la mitad del programa.

La revisión de una fila, con `raise` (clase 40):

```python
def leer_fila(fila: dict[str, str], numero: int) -> Movimiento:
    try:
        fecha = date.fromisoformat(fila["fecha"].strip())
    except ValueError:
        raise ValueError(f"línea {numero}: la fecha {fila['fecha']!r} no es una fecha AAAA-MM-DD que exista") from None
    tipo = fila["tipo"].strip().lower()
    if tipo not in TIPOS:
        raise ValueError(f"línea {numero}: el tipo {fila['tipo']!r} tiene que ser viaje o gasto")
    # …el detalle y el valor, igual
    return Movimiento(fecha, tipo, detalle, valor)
```

- **`date.fromisoformat`** ya rechaza el 30 de febrero, como `LocalDate` en Kotlin (clase 89).
- **`{…!r}`** muestra el valor **con comillas**: `'2026-02-30'`. Así se ve si había un espacio de más.
- **`from None`** esconde el error original de Python: la persona ve solo el mensaje en español.
- **`.strip().lower()`**: `" Gasto "` vale como `"gasto"`. Lo que escribe una persona trae espacios y mayúsculas.

> 🌎 **En la vida real:** revisar una fila es como el cajero del banco con un cheque: mira la fecha, el monto y la firma, y si algo no está, te lo devuelve diciendo **qué** y **dónde**, no "cheque malo".

> 🌎 **Otro ejemplo:** `frozen=True` es como una factura impresa: si hay que corregirla, se hace otra; no se borra con corrector.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar una fila
lenguaje: python
pide: Completa `leer_fila(fila, numero)`. Devuelve `(fecha, tipo, valor)` con la fecha como `date` (con `date.fromisoformat`), el tipo en minúsculas y sin espacios, y el valor como `float` (acepta coma). Si algo está mal, lanza `ValueError` con un mensaje que empiece con `"línea N: "`: `"la fecha no existe"`, `"el tipo tiene que ser viaje o gasto"` o `"el valor tiene que ser un número mayor que cero"`.
--- código
from datetime import date


def leer_fila(fila, numero):
    pass  # tu código aquí
--- pruebas
def mensaje(fila):
    try:
        leer_fila(fila, 7)
    except ValueError as e:
        return str(e)
    return "no lanzó ValueError"
bien = {"fecha": "2026-11-16", "tipo": " Viaje ", "valor": "32,50"}
prueba("una fila buena", lambda: igual(leer_fila(bien, 2), (date(2026, 11, 16), "viaje", 32.5)))
prueba("el 30 de febrero", lambda: igual(mensaje({**bien, "fecha": "2026-02-30"}), "línea 7: la fecha no existe"))
prueba("un tipo inventado", lambda: igual(mensaje({**bien, "tipo": "propina"}), "línea 7: el tipo tiene que ser viaje o gasto"))
prueba("letras, cero o negativo", lambda: igual({mensaje({**bien, "valor": v}) for v in ("mucho", "0", "-5")}, {"línea 7: el valor tiene que ser un número mayor que cero"}))
--- solución
from datetime import date


def leer_fila(fila, numero):
    try:
        fecha = date.fromisoformat(fila["fecha"].strip())
    except ValueError:
        raise ValueError(f"línea {numero}: la fecha no existe") from None
    tipo = fila["tipo"].strip().lower()
    if tipo not in ("viaje", "gasto"):
        raise ValueError(f"línea {numero}: el tipo tiene que ser viaje o gasto")
    try:
        valor = float(fila["valor"].strip().replace(",", "."))
    except ValueError:
        valor = 0
    if valor <= 0:
        raise ValueError(f"línea {numero}: el valor tiene que ser un número mayor que cero")
    return fecha, tipo, valor
```

```practica
vf :: Con frozen=True, un Movimiento no se puede cambiar después de creado
vf :: date.fromisoformat("2026-02-30") devuelve el 2 de marzo
elige :: ¿Para qué sirve el !r en f"la fecha {fila['fecha']!r}"? :: Para ponerla en rojo :: Para mostrar el valor con comillas, y que se vean los espacios de más :: Para convertirla en date
elige :: ¿Qué hace from None al final del raise? :: Borra el error :: Esconde el error original de Python, y la persona ve solo el mensaje en español :: Devuelve None
escribe :: ¿Por qué leer_fila recibe el número de línea? :: Para que cada mensaje diga dónde está el problema (línea 7: …), y la persona vaya directo a esa fila de la planilla a arreglarla.
```

## Parte 3. Todos los problemas juntos

Leer la planilla entera es recorrer las filas y **juntar** lo que falla, en vez de cortar en el primer error:

```python
class PlanillaConErrores(ValueError):
    """La planilla tiene problemas. Trae TODOS juntos, para arreglarlos de una vez."""

    def __init__(self, problemas: list[str]):
        self.problemas = problemas
        super().__init__(f"La planilla tiene {len(problemas)} problema(s)")


def leer_movimientos(texto: str) -> list[Movimiento]:
    lector = csv.DictReader(io.StringIO(texto))
    faltan = [c for c in COLUMNAS if c not in (lector.fieldnames or [])]
    if faltan:
        raise PlanillaConErrores([f"faltan columnas: {', '.join(faltan)} (…)"])
    movimientos, problemas = [], []
    for numero, fila in enumerate(lector, start=2):  # la línea 1 es la de los títulos
        if not any((v or "").strip() for v in fila.values()):
            continue  # una fila vacía (",,," al exportar de Excel) no es un error
        try:
            movimientos.append(leer_fila(fila, numero))
        except ValueError as e:
            problemas.append(str(e))
    if problemas:
        raise PlanillaConErrores(problemas)
    return movimientos
```

- **Un error propio** (`PlanillaConErrores`) que **hereda** de `ValueError` (clase 42) y **lleva adentro** la lista. Quien lo atrapa puede mostrar los problemas uno por uno.
- **`enumerate(…, start=2)`**: la línea 1 es la de los títulos, así que la primera fila de datos es la línea 2 **del archivo**. Si empezara en 1, todos los mensajes mandarían a la línea de arriba.
- **Recibe texto, no un archivo.** Así las pruebas le pasan un texto directo, sin crear archivos. El único que toca el disco es `leer_archivo`.

> 🌎 **En la vida real:** es la diferencia entre el mecánico que te llama cinco veces ("falta una pieza", y al otro día "falta otra"…) y el que revisa todo el carro y te da la lista completa de una vez.

> 🌎 **Otro ejemplo:** `start=2` es como numerar las filas de una planilla impresa contando la fila de los títulos: si le dices al cliente "la fila 3", tiene que ser la fila 3 que él ve.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Juntar todos los problemas
lenguaje: python
pide: Completa `leer_todo(filas)`: recibe la lista de filas (sin la de títulos) y llama a `leer_fila(fila, numero)` con cada una, contando las líneas **desde 2**. Salta las filas vacías (todos sus valores en blanco). Junta los mensajes de los `ValueError` y, si hubo alguno, lanza `PlanillaConErrores(problemas)`. Si no, devuelve la lista de lo que devolvió `leer_fila`.
--- código
class PlanillaConErrores(ValueError):
    def __init__(self, problemas):
        self.problemas = problemas
        super().__init__(f"La planilla tiene {len(problemas)} problema(s)")


def leer_fila(fila, numero):
    if not fila["valor"].isdigit():
        raise ValueError(f"línea {numero}: el valor no es un número")
    return int(fila["valor"])


def leer_todo(filas):
    pass  # tu código aquí
--- pruebas
def problemas_de(filas):
    try:
        leer_todo(filas)
    except PlanillaConErrores as e:
        return e.problemas
    return "no lanzó PlanillaConErrores"
prueba("todo bien", lambda: igual(leer_todo([{"valor": "10"}, {"valor": "20"}]), [10, 20]))
prueba("junta TODOS, con la línea del archivo", lambda: igual(problemas_de([{"valor": "10"}, {"valor": "x"}, {"valor": "y"}]), ["línea 3: el valor no es un número", "línea 4: el valor no es un número"]))
prueba("salta las filas vacías", lambda: igual(leer_todo([{"valor": "10"}, {"valor": "  "}, {"valor": "5"}]), [10, 5]))
--- solución
class PlanillaConErrores(ValueError):
    def __init__(self, problemas):
        self.problemas = problemas
        super().__init__(f"La planilla tiene {len(problemas)} problema(s)")


def leer_fila(fila, numero):
    if not fila["valor"].isdigit():
        raise ValueError(f"línea {numero}: el valor no es un número")
    return int(fila["valor"])


def leer_todo(filas):
    resultado = []
    problemas = []
    for numero, fila in enumerate(filas, start=2):
        if not any(v.strip() for v in fila.values()):
            continue
        try:
            resultado.append(leer_fila(fila, numero))
        except ValueError as e:
            problemas.append(str(e))
    if problemas:
        raise PlanillaConErrores(problemas)
    return resultado
```

```practica
vf :: PlanillaConErrores hereda de ValueError, así que un except ValueError también la atrapa
vf :: Con enumerate(lector, start=1), los mensajes dirían la línea correcta del archivo
elige :: ¿Por qué leer_movimientos recibe texto y no la ruta del archivo? :: Porque es más rápido :: Para que las pruebas le pasen un texto directo, sin crear archivos :: Porque csv no lee archivos
elige :: Una fila ",,," que dejó Excel, ¿qué hace el programa? :: Da tres errores :: La salta :: Se rompe
escribe :: ¿Por qué conviene mostrar todos los problemas juntos y no solo el primero? :: Porque la persona arregla todo de una vez. Si se muestra uno por vez, arregla, corre, ve otro, arregla, corre… y pierde tiempo.
```

## Parte 4. Calcular: el resumen, una función pura

```python
def resumir(movimientos: list[Movimiento]) -> dict:
    viajes = [m for m in movimientos if m.tipo == "viaje"]
    gastos = [m for m in movimientos if m.tipo == "gasto"]
    ganado = sum(m.valor for m in viajes)
    gastado = sum(m.valor for m in gastos)

    por_app: dict[str, float] = {}
    for m in viajes:
        por_app[m.detalle] = por_app.get(m.detalle, 0) + m.valor
    por_dia: dict[date, float] = {}
    for m in viajes:
        por_dia[m.fecha] = por_dia.get(m.fecha, 0) + m.valor

    mejor_dia = max(por_dia.items(), key=lambda par: par[1]) if por_dia else None
    return {
        "ganado": round(ganado, 2),
        "gastado": round(gastado, 2),
        "neto": round(ganado - gastado, 2),
        "viajes": len(viajes),
        "por_viaje": round(ganado / len(viajes), 2) if viajes else 0.0,
        "por_app": {app: round(v, 2) for app, v in sorted(por_app.items(), key=lambda par: par[1], reverse=True)},
        "mejor_dia": (mejor_dia[0], round(mejor_dia[1], 2)) if mejor_dia else None,
    }
```

- **Pura** (clase 39): recibe una lista y devuelve un diccionario. No lee archivos ni imprime: por eso sus pruebas son de una línea.
- **`max(…, key=lambda par: par[1])`**: el día con más ganancia (clase 39, lambdas).
- **`if viajes else 0.0`**: una semana sin viajes no divide por cero.
- **`por_app` ordenado**: un diccionario guarda el orden en que se agregan las llaves, así que, armándolo desde la lista ordenada, sale de la app que más dio a la que menos.
- **`round(…, 2)` en los tres totales:** `0.1 + 0.2` da `0.30000000000000004` en Python (y en casi todos los lenguajes).

> 🌎 **En la vida real:** una función pura es como una calculadora: le das los números y te da el resultado, siempre el mismo, sin anotar nada en ningún cuaderno.

> 🌎 **Otro ejemplo:** el `if viajes else 0.0` es como el contador que, en un mes sin ventas, escribe "0" en el promedio en vez de dejar el informe sin terminar porque "no se puede dividir".

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Por app y el mejor día
lenguaje: python
pide: Cada viaje es una tupla `(dia, app, valor)`. Completa `por_app(viajes)`: un diccionario con cuánto se ganó en cada app, **ordenado** de la que más dio a la que menos, con los valores redondeados a 2 decimales. Y `mejor_dia(viajes)`: la tupla `(dia, total)` del día que más se ganó (total redondeado), o `None` si no hay viajes.
--- código
def por_app(viajes):
    pass  # tu código aquí


def mejor_dia(viajes):
    pass  # tu código aquí
--- pruebas
semana = [("lun", "Uber", 32.5), ("lun", "99", 18.0), ("mar", "Uber", 45.0), ("mié", "Uber", 88.0), ("mié", "InDrive", 40.0)]
prueba("por app, de la que más dio", lambda: igual(list(por_app(semana).items()), [("Uber", 165.5), ("InDrive", 40.0), ("99", 18.0)]))
prueba("el mejor día", lambda: igual(mejor_dia(semana), ("mié", 128.0)))
prueba("sin viajes", lambda: igual((por_app([]), mejor_dia([])), ({}, None)))
prueba("sin centavos raros", lambda: igual(por_app([("lun", "Uber", 0.1), ("lun", "Uber", 0.2)]), {"Uber": 0.3}))
--- solución
def por_app(viajes):
    totales = {}
    for _, app, valor in viajes:
        totales[app] = totales.get(app, 0) + valor
    return {app: round(v, 2) for app, v in sorted(totales.items(), key=lambda par: par[1], reverse=True)}


def mejor_dia(viajes):
    por_dia = {}
    for dia, _, valor in viajes:
        por_dia[dia] = por_dia.get(dia, 0) + valor
    if not por_dia:
        return None
    dia, total = max(por_dia.items(), key=lambda par: par[1])
    return dia, round(total, 2)
```

```practica
vf :: resumir lee el archivo y muestra el informe
vf :: En Python, un diccionario guarda el orden en que se agregaron las llaves
elige :: ¿Qué hace if viajes else 0.0 en el promedio por viaje? :: Redondea :: Evita dividir por cero en una semana sin viajes :: Cuenta los viajes
elige :: ¿Qué devuelve max(por_dia.items(), key=lambda par: par[1])? :: El día más reciente :: El par (día, total) con el total más grande :: La suma de todos
escribe :: ¿Por qué se redondean los totales a 2 decimales? :: Porque con decimales la computadora no es exacta: 0.1 + 0.2 da 0.30000000000000004. Se redondea para mostrar y comparar centavos de verdad.
```

## Parte 5. Mostrar y la línea de comandos

**El dinero, como en Brasil**, con un truco del formato de Python:

```python
def dinero(valor: float) -> str:
    texto = f"{abs(valor):,.2f}"  # "1,234.50" (formato en inglés)
    texto = texto.replace(",", "_").replace(".", ",").replace("_", ".")  # → "1.234,50"
    return f"{'-' if valor < 0 else ''}R$ {texto}"
```

`:,.2f` pone las comas de los miles y dos decimales, al estilo inglés. Después se cambian: la coma pasa por `_` para no pisarse con el punto.

**El programa** es lo único que habla con la terminal (clase 41, `__main__`):

```python
def main(argumentos: list[str] | None = None) -> int:
    analizador = argparse.ArgumentParser(description="El resumen de la semana de un conductor, desde un CSV.")
    analizador.add_argument("planilla", type=Path, help="la planilla CSV con las columnas fecha,tipo,detalle,valor")
    args = analizador.parse_args(argumentos)
    try:
        movimientos = leer_archivo(args.planilla)
    except FileNotFoundError:
        print(f"No encontré la planilla {args.planilla}. ¿Está bien escrita la ruta?", file=sys.stderr)
        return 1
    except PlanillaConErrores as e:
        print(f"La planilla {args.planilla} tiene problemas:", file=sys.stderr)
        for problema in e.problemas:
            print(f"  · {problema}", file=sys.stderr)
        return 1
    print(informe(resumir(movimientos)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- **`argparse`** lee lo que se escribe después de `resumen.py`, y arma solo la ayuda (`python3 resumen.py --help`) y el aviso si falta la planilla. Esos dos textos los escribe Python, y salen en inglés.
- **`file=sys.stderr`**: los errores van por la "salida de errores", separada de la normal. Si alguien guarda el informe en un archivo (`python3 resumen.py semana.csv > informe.txt`), los errores igual se ven en la pantalla.
- **El código de salida:** `0` salió bien, `1` no. Otro programa (o el CI de la clase 04) sabe si funcionó sin leer el texto.
- **`main(argumentos)`** recibe la lista: las pruebas le pasan `["planilla.csv"]` directo, sin abrir una terminal.

> 🌎 **En la vida real:** stdout y stderr son como el informe para el cliente y la nota para el jefe: van en sobres distintos, y si el cliente guarda su sobre en un cajón, la nota del jefe igual llega.

> 🌎 **Otro ejemplo:** el código de salida es como el semáforo del lavadero: verde (0) el carro está listo, rojo (1) algo pasó. El que espera no tiene que leer el cartel entero.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La línea del informe
lenguaje: python
pide: Completa `dinero(valor)` con el truco de la lección (`f"{abs(valor):,.2f}"` y los tres `replace`), y `linea_ganado(ganado, viajes)`: devuelve `"Ganado: R$ 364,50 (8 viajes, R$ 45,56 por viaje)"`. Cuida el plural: `"1 viaje"`, no `"1 viajes"`. Con 0 viajes, el promedio es R$ 0,00.
--- código
def dinero(valor):
    pass  # tu código aquí


def linea_ganado(ganado, viajes):
    pass  # tu código aquí
--- pruebas
prueba("el dinero", lambda: igual([dinero(30), dinero(1234.5), dinero(-84.5)], ["R$ 30,00", "R$ 1.234,50", "-R$ 84,50"]))
prueba("la línea", lambda: igual(linea_ganado(364.5, 8), "Ganado: R$ 364,50 (8 viajes, R$ 45,56 por viaje)"))
prueba("un solo viaje", lambda: igual(linea_ganado(32.5, 1), "Ganado: R$ 32,50 (1 viaje, R$ 32,50 por viaje)"))
prueba("sin viajes, sin dividir por cero", lambda: igual(linea_ganado(0, 0), "Ganado: R$ 0,00 (0 viajes, R$ 0,00 por viaje)"))
--- solución
def dinero(valor):
    texto = f"{abs(valor):,.2f}"
    texto = texto.replace(",", "_").replace(".", ",").replace("_", ".")
    return f"{'-' if valor < 0 else ''}R$ {texto}"


def linea_ganado(ganado, viajes):
    por_viaje = ganado / viajes if viajes else 0.0
    palabra = "viaje" if viajes == 1 else "viajes"
    return f"Ganado: {dinero(ganado)} ({viajes} {palabra}, {dinero(por_viaje)} por viaje)"
```

```practica
vf :: Los mensajes de error van por stderr, así que se ven aunque el informe se guarde en un archivo con >
vf :: El código de salida no importa: alcanza con el texto que se muestra
elige :: ¿Por qué main recibe la lista de argumentos? :: Para que sea más rápido :: Para que las pruebas le pasen los argumentos directo, sin abrir una terminal :: Porque argparse lo exige
elige :: En el truco del dinero, ¿por qué la coma pasa primero por _? :: Por estilo :: Para no pisarse con el punto al cambiar uno por el otro :: Porque Python no acepta comas
escribe :: ¿Qué hace if __name__ == "__main__": sys.exit(main())? :: Cuando corres el archivo directo, llama a main y termina con su código de salida (0 o 1). Cuando otro archivo o las pruebas lo importan, no corre nada solo.
```

## Parte 6. Las pruebas con pytest, y probarlas rompiendo el código

Las 28 pruebas usan cuatro herramientas de pytest:

```python
# 1. parametrize: la misma prueba, muchos casos
@pytest.mark.parametrize(
    ("cambios", "mensaje"),
    [
        ({"fecha": "2026-02-31"}, "no es una fecha AAAA-MM-DD que exista"),
        ({"tipo": "propina"}, "tiene que ser viaje o gasto"),
        ({"valor": "0"}, "mayor que cero"),
    ],
)
def test_filas_malas_dicen_que_pasa_y_en_que_linea(cambios, mensaje):
    # 2. pytest.raises: comprueba que SÍ lanza el error
    with pytest.raises(ValueError) as error:
        leer_fila(fila(**cambios), 7)
    assert mensaje in str(error.value)


# 3. tmp_path: una carpeta temporal para esta prueba, que pytest borra después
# 4. capsys: atrapa lo que el programa imprime
def test_el_programa_sin_la_planilla(tmp_path, capsys):
    assert main([str(tmp_path / "no-existe.csv")]) == 1
    assert "No encontré la planilla" in capsys.readouterr().err
```

```bash
python -m pytest
```

### ¿Y quién prueba a las pruebas?

Que las pruebas pasen no quiere decir que **atrapen** errores. Para saberlo, se **rompió el código a propósito** de 12 maneras (aceptar el valor 0, parar en el primer problema, contar los gastos como ganado, correr las líneas en uno, no redondear…), una por vez, y se corrieron las pruebas. Cada sabotaje tenía que poner **alguna** en rojo. Entre eso y usar el programa en la terminal con planillas de verdad, se encontraron tres agujeros:

1. **Nadie revisaba el `neto`.** La prueba de los centavos miraba solo `ganado`. Si alguien borraba el `round` del neto, todo seguía en verde. Se agregó el neto (y lo gastado) a la prueba.
2. **La prueba de las filas vacías no probaba nada.** Usaba una línea del todo vacía, pero esa ya la salta el módulo `csv` solo. Lo que hace falta saltar a mano son las filas `,,,` que deja Excel. Se cambió la prueba por ese caso real.
3. **Una planilla de Excel no se podía leer.** Probando el programa en la terminal con un CSV exportado de Excel, decía *"faltan columnas: fecha"*… y la columna estaba. Excel pone una **marca invisible** al principio del archivo (el BOM, los bytes `EF BB BF`), y la primera columna se leía como `"﻿fecha"`. Primero se escribió la prueba (en rojo) y después el arreglo, de una palabra:

   ```python
   with ruta.open(encoding="utf-8-sig", newline="") as f:   # antes: encoding="utf-8"
   ```

   `utf-8-sig` quita la marca si está, y si no está, lee igual.

**Una prueba que nunca falla no protege nada.** Rómpele el código a tus pruebas de vez en cuando.

> 🌎 **En la vida real:** es como probar la alarma de la casa abriendo una ventana a propósito: si no suena, no sirve, aunque la luz verde diga que está prendida.

> 🌎 **Otro ejemplo:** la marca invisible de Excel es como una etiqueta transparente pegada en la primera hoja: no la ves, pero la máquina que lee el código de barras se traba con ella.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Casos que atrapan los sabotajes
lenguaje: python
pide: La función `total(valores)` suma y redondea a 2 decimales. Escribe tus casos de prueba en `CASOS`, una lista de pares `(valores, lo_que_tiene_que_dar)`. Las pruebas del mapa van a correr tus casos contra la función buena (todos tienen que pasar) y contra **tres sabotajes**: una que no redondea, una que se salta el último valor y una que se rompe con la lista vacía. Cada sabotaje tiene que fallar en **alguno** de tus casos.
--- código
def total(valores):
    return round(sum(valores), 2)


CASOS = [
    ([10, 20], 30),
    # tus casos aquí
]
--- pruebas
def falla_algun_caso(funcion):
    for valores, esperado in CASOS:
        try:
            if funcion(valores) != esperado:
                return True
        except Exception:
            return True
    return False
prueba("con la función buena, todos tus casos pasan", lambda: ok(not falla_algun_caso(total), "algún caso tuyo dice mal lo que tiene que dar"))
prueba("atrapan la que no redondea", lambda: ok(falla_algun_caso(lambda v: sum(v)), "ningún caso tiene centavos raros, como 0.1 + 0.2"))
prueba("atrapan la que se salta el último", lambda: ok(falla_algun_caso(lambda v: round(sum(v[:-1]), 2)), "ningún caso nota que falta el último valor"))
prueba("atrapan la que se rompe sin valores", lambda: ok(falla_algun_caso(lambda v: round(sum(v) / len(v) * len(v), 2)), "falta el caso de la lista vacía"))
--- solución
def total(valores):
    return round(sum(valores), 2)


CASOS = [
    ([10, 20], 30),
    ([0.1, 0.2], 0.3),
    ([5], 5),
    ([], 0),
]
```

```practica
vf :: Si todas las pruebas pasan, seguro atrapan cualquier error
vf :: utf-8-sig lee igual un archivo con la marca de Excel (BOM) que uno sin ella
elige :: ¿Para qué sirve @pytest.mark.parametrize? :: Para que las pruebas vayan más rápido :: Para correr la misma prueba con muchos casos distintos :: Para saltar una prueba
elige :: ¿Qué es tmp_path? :: La carpeta del proyecto :: Una carpeta temporal que pytest crea para esa prueba y borra después :: Un archivo de configuración
escribe :: Cuenta el error de la planilla de Excel: qué pasaba, por qué y cómo se arregló. :: Con un CSV exportado de Excel, el programa decía "faltan columnas: fecha" aunque estaba. Excel pone una marca invisible al principio (el BOM) y la primera columna se leía como "﻿fecha". Primero se escribió la prueba en rojo, y se arregló abriendo el archivo con encoding="utf-8-sig", que quita esa marca.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué hiciste con Python?":** "Un programa de línea de comandos que hace el resumen de la semana de un conductor desde una planilla CSV, solo con la biblioteca estándar. Está separado en leer, calcular y mostrar: la lectura revisa cada fila con una dataclass congelada y junta todos los problemas con su línea en un error propio; el cálculo es una función pura; y el main usa argparse, manda los errores por stderr y devuelve un código de salida. Tiene 28 pruebas con pytest, con parametrize, tmp_path y capsys. Y probé las pruebas rompiendo el código a propósito de 12 maneras: así encontré que nadie revisaba el neto, y que una planilla exportada de Excel no se podía leer por la marca invisible del BOM, que arreglé con utf-8-sig después de escribir la prueba en rojo."

> 🌎 **En la vida real:** es como contar tu primer cierre de mes: cómo revisaste los papeles, qué encontraste mal, cómo lo comprobaste y qué cambiaste para que no vuelva a pasar.

> 🌎 **Otro ejemplo:** es como el carpintero que, además de mostrar el mueble, cuenta que lo cargó con peso a propósito para ver si aguantaba, y que reforzó la pata que crujió.
