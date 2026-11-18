# Python 5: errores y archivos

> 🌎 **En la vida real:** un buen conductor no maneja pensando que nada va a fallar: lleva rueda de repuesto y sabe qué hacer si se pincha una llanta. Un buen programa también sabe qué hacer cuando algo sale mal.

> 🎙️ **El profesor dice:** hoy: cómo leer los errores de Python (como en el Tema 07, pero en Python), cómo atraparlos con `try` y `except` para que el programa no se caiga, cómo crear tus propios errores con `raise`, y cómo guardar y leer datos en archivos de texto, CSV y JSON.

## Parte 1. Leer un error de Python

> 🌎 **En la vida real:** el mensaje de error es como el informe del mecánico: dice qué pieza falló y dónde.

> 🌎 **Otro ejemplo:** Es como el aviso del tablero del carro: "aceite bajo". No hay que asustarse, hay que leerlo.

### El traceback

Cuando algo falla, Python muestra un **traceback**. Se lee **de abajo hacia arriba**: la última línea dice **qué** pasó, y las de arriba **dónde**.

```text
Traceback (most recent call last):
  File "ganancias.py", line 7, in <module>
    promedio = total / viajes
ZeroDivisionError: division by zero
```

Aquí: en el archivo `ganancias.py`, línea 7, se dividió por cero (`viajes` valía 0).

> 🌎 **En la vida real:** es como seguir un rastro de pisadas hasta llegar a quién rompió el florero.

> 🌎 **Otro ejemplo:** Es como el historial de llamadas: la última es la que importa.

### Los errores más comunes

| Error | Qué significa |
|---|---|
| `NameError` | Usaste un nombre que no existe (escrito mal o no creado) |
| `TypeError` | Mezclaste tipos que no van: `"10" + 5` |
| `ValueError` | El tipo está bien pero el valor no: `int("hola")` |
| `KeyError` | La llave no está en el diccionario |
| `IndexError` | La posición no existe en la lista |
| `ZeroDivisionError` | Dividiste por cero |
| `FileNotFoundError` | El archivo no existe en esa ruta |
| `IndentationError` | La sangría está mal |

> 🌎 **En la vida real:** es como conocer las luces del tablero: cada una avisa algo distinto.

> 🌎 **Otro ejemplo:** Es como los códigos del médico: "fractura", "torcedura"… cada nombre dice qué pasó.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer un traceback de abajo hacia arriba
lenguaje: python
pide: Completa `que_paso(traceback)`: recibe el texto de un error de Python y devuelve tres cosas: el **tipo** de error (lo que está antes de `:` en la **última** línea), el **mensaje** (lo de después) y el **número de línea** del último `File "…", line N` (como `int`). Pista: `splitlines()`, y recorre las líneas buscando `", line "`.
--- código
def que_paso(traceback):
    pass  # tu código aquí: return tipo, mensaje, linea
--- pruebas
error = """Traceback (most recent call last):
  File "ganancias.py", line 12, in <module>
    print(promedio(viajes))
  File "ganancias.py", line 7, in promedio
    return total / cantidad
ZeroDivisionError: division by zero"""
prueba("qué pasó y dónde", lambda: igual(que_paso(error), ("ZeroDivisionError", "division by zero", 7)))
otro = 'Traceback (most recent call last):\n  File "carro.py", line 3, in <module>\n    print(carro["seguro"])\nKeyError: \'seguro\''
prueba("otro error", lambda: igual(que_paso(otro), ("KeyError", "'seguro'", 3)))
--- solución
def que_paso(traceback):
    lineas = traceback.strip().splitlines()
    tipo, mensaje = lineas[-1].split(": ", 1)
    numero = None
    for linea in lineas:
        if '", line ' in linea:
            numero = int(linea.split('", line ')[1].split(",")[0])
    return tipo, mensaje, numero
```

```practica
vf :: El traceback de Python se lee de abajo hacia arriba
vf :: "10" + 5 en Python da 15
elige :: int("hola") da… :: NameError :: ValueError :: KeyError
elige :: Buscas carro["seguro"] y no existe esa llave. ¿Qué error sale? :: IndexError :: KeyError :: TypeError
escribe :: ¿Qué significa ZeroDivisionError y cómo lo evitarías al calcular el promedio por viaje? :: Que se dividió por cero; lo evito revisando antes con un if que la cantidad de viajes sea mayor que cero.
```

## Parte 2. Atrapar errores: try y except

> 🌎 **En la vida real:** es como un plan B: "intenta pagar con tarjeta; si falla, paga en efectivo".

> 🌎 **Otro ejemplo:** Es como la red de un trapecista: si se cae, no se lastima y el show sigue.

### La forma

```python
texto = input("¿Cuántos litros cargaste? ")
try:
    litros = float(texto)
except ValueError:
    print("Eso no es un número. Escribe por ejemplo 32.5")
else:
    print(f"Registrado: {litros} litros")
finally:
    print("Listo.")
```

- `try`: lo que puede fallar.
- `except TipoDeError`: qué hacer si falla **ese** error.
- `else`: lo que pasa si **no** falló.
- `finally`: se hace **siempre**.

> 🌎 **En la vida real:** `finally` es como apagar la luz al salir: pase lo que pase en la reunión, la luz se apaga.

> 🌎 **Otro ejemplo:** Es como el cinturón de seguridad: lo usas siempre, haya o no accidente.

### Atrapa solo lo que sabes manejar

Nunca escribas `except:` vacío que se trague **todo**: esconde errores de verdad (es el mismo problema que vimos con la IA en IA 5). Atrapa el error concreto y haz algo útil.

> 🌎 **En la vida real:** si suena una alarma, no le sacas las pilas: ves qué la hizo sonar.

> 🌎 **Otro ejemplo:** Es como un médico que da calmante sin buscar qué duele: el dolor se va, la enfermedad no.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: try y except: atrapar solo lo que sabes manejar
lenguaje: python
pide: Completa `leer_litros(texto)`: convierte el texto en `float` (acepta coma) y, si **no** es un número, devuelve `None` en vez de romperse. Atrapa **solo** `ValueError`. Y `promedio(valores)`: el promedio, o `0.0` si la lista está vacía, atrapando `ZeroDivisionError`.
--- código
def leer_litros(texto):
    pass  # tu código aquí


def promedio(valores):
    pass  # tu código aquí
--- pruebas
prueba("un número", lambda: igual(leer_litros("32.5"), 32.5))
prueba("con coma", lambda: igual(leer_litros("32,5"), 32.5))
prueba("no es un número: None, sin romperse", lambda: igual(leer_litros("mucho"), None))
prueba("el promedio", lambda: igual(promedio([120, 95, 180]), 131.66666666666666))
prueba("sin valores: 0.0", lambda: igual(promedio([]), 0.0))
@prueba("otros errores NO se esconden")
def _():
    try:
        leer_litros(None)
    except AttributeError:
        return
    raise AssertionError("con None tiene que salir el error de verdad: no uses except vacío")
--- solución
def leer_litros(texto):
    try:
        return float(texto.replace(",", "."))
    except ValueError:
        return None


def promedio(valores):
    try:
        return sum(valores) / len(valores)
    except ZeroDivisionError:
        return 0.0
```

```practica
vf :: El bloque finally se ejecuta siempre, haya error o no
vf :: Un except vacío que atrapa todo es una buena práctica
elige :: ¿Cuándo se ejecuta el bloque else de un try? :: Siempre :: Solo si no hubo error :: Solo si hubo error
elige :: Para convertir lo que escribe la persona a número sin que el programa se caiga, ¿qué error atrapas? :: KeyError :: ValueError :: NameError
escribe :: Escribe un try que divida total entre viajes y, si viajes es 0, muestre "sin viajes". :: try: (con 4 espacios) print(total / viajes); except ZeroDivisionError: (con 4 espacios) print("sin viajes")
```

## Parte 3. Crear tus propios errores: raise

> 🌎 **En la vida real:** el portero que dice "con esa entrada no pasa" detiene el problema en la puerta, antes de que entre.

> 🌎 **Otro ejemplo:** Es como el cajero que rechaza un billete falso: mejor rechazar ahí que descubrirlo después.

### raise

Si tu función recibe algo que no tiene sentido, **avisa** con `raise` en vez de devolver un resultado equivocado:

```python
def registrar_gasto(valor: float) -> float:
    if valor <= 0:
        raise ValueError("El gasto tiene que ser mayor que cero")
    return valor
```

Quien la use puede atrapar ese error con `try`.

> 🌎 **En la vida real:** es como la balanza de la farmacia que marca "error" si te subes con la mochila: no te da un peso falso.

> 🌎 **Otro ejemplo:** Es como el formulario online que no te deja enviar una fecha de nacimiento del futuro.

### Validar en la puerta

La regla de oro (la misma de seguridad, Tema 22): **valida los datos donde entran** (lo que escribe la persona, lo que llega de un archivo o de una API), no los dejes viajar por todo el programa.

> 🌎 **En la vida real:** en el aeropuerto revisan las maletas en la entrada, no en el avión.

> 🌎 **Otro ejemplo:** Es como lavar las verduras al traerlas del mercado, no en el plato.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: raise: avisar en vez de devolver algo equivocado
lenguaje: python
pide: Completa `registrar_gasto(valor)`. Si el valor no es un número (`int` o `float`), lanza `TypeError("El gasto tiene que ser un número")`. Si es 0 o menos, `ValueError("El gasto tiene que ser mayor que cero")`. Si está bien, devuelve el valor redondeado a 2 decimales.
--- código
def registrar_gasto(valor):
    pass  # tu código aquí
--- pruebas
def mensaje_de(error, fn):
    try:
        fn()
    except error as e:
        return str(e)
    return "no lanzó " + error.__name__
prueba("un gasto bien, redondeado a 2 decimales", lambda: igual(registrar_gasto(30.556), 30.56))
prueba("cero o negativo: ValueError", lambda: igual([mensaje_de(ValueError, lambda: registrar_gasto(v)) for v in (0, -5)], ["El gasto tiene que ser mayor que cero"] * 2))
prueba("un texto: TypeError", lambda: igual(mensaje_de(TypeError, lambda: registrar_gasto("30")), "El gasto tiene que ser un número"))
--- solución
def registrar_gasto(valor):
    if not isinstance(valor, (int, float)):
        raise TypeError("El gasto tiene que ser un número")
    if valor <= 0:
        raise ValueError("El gasto tiene que ser mayor que cero")
    return round(valor, 2)
```

```practica
vf :: raise sirve para lanzar un error a propósito cuando un dato no tiene sentido
vf :: Es mejor devolver un resultado aunque los datos estén mal
elige :: ¿Dónde conviene validar los datos? :: Al final del programa :: Donde entran: lo que escribe la persona, un archivo o una API :: Nunca
elige :: ¿Qué error lanzarías si te pasan un gasto negativo? :: NameError :: ValueError :: FileNotFoundError
escribe :: Escribe una función que lance un error si los km son negativos. :: def validar_km(km): (con 4 espacios) if km < 0: (con 8 espacios) raise ValueError("Los km no pueden ser negativos") y después return km
```

## Parte 4. Archivos: texto, CSV y JSON

> 🌎 **En la vida real:** las variables son la memoria de corto plazo; los archivos son el cuaderno donde anotas para no olvidar cuando apagas.

> 🌎 **Otro ejemplo:** Es como la libreta del taxista: lo que anotas sigue ahí al día siguiente.

### with open: abrir y cerrar solo

```python
with open("notas.txt", "w", encoding="utf-8") as archivo:   # "w" escribe (borra lo anterior)
    archivo.write("Cambiar aceite el lunes\n")

with open("notas.txt", "a", encoding="utf-8") as archivo:   # "a" agrega al final
    archivo.write("Pagar IPVA\n")

with open("notas.txt", encoding="utf-8") as archivo:        # por defecto, leer
    for linea in archivo:
        print(linea.strip())
```

`with` cierra el archivo solo al terminar, aunque haya un error. Usa siempre `encoding="utf-8"` para que las tildes y la ñ salgan bien.

> 🌎 **En la vida real:** `with` es como una puerta que se cierra sola detrás de ti.

> 🌎 **Otro ejemplo:** Es como el grifo con sensor: se cierra solo cuando te vas.

### CSV: planillas

Un CSV es una planilla en texto (columnas separadas por comas). El módulo `csv` lo lee como diccionarios:

```python
import csv

with open("viajes.csv", encoding="utf-8") as f:
    total = sum(float(fila["valor"]) for fila in csv.DictReader(f))
print(total)
```

> 🌎 **En la vida real:** es como una planilla de Excel guardada como texto simple.

> 🌎 **Otro ejemplo:** Es como una lista de asistencia con columnas: nombre, hora, firma.

### JSON: datos con forma

JSON es el formato de las APIs y de Firebase: listas y diccionarios en texto.

```python
import json

datos = {"carro": "Corolla", "gastos": [150.0, 30.0]}
with open("datos.json", "w", encoding="utf-8") as f:
    json.dump(datos, f, ensure_ascii=False, indent=2)

with open("datos.json", encoding="utf-8") as f:
    leidos = json.load(f)
print(leidos["gastos"])
```

> 🌎 **En la vida real:** es como una ficha con campos y subcampos que cualquier sistema entiende.

> 🌎 **Otro ejemplo:** Es como un idioma internacional de los datos: Python, JavaScript y Firebase lo hablan.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: CSV y JSON
lenguaje: python
pide: Completa `total_del_csv(texto)`: recibe el texto de una planilla CSV con una columna `valor` y devuelve la suma (usa `csv.DictReader(io.StringIO(texto))`, que lee el texto como si fuera un archivo). Y `guardar_y_leer(datos, ruta)`: guarda los datos en un archivo JSON con `with open(…, "w", encoding="utf-8")` y `json.dump(…, ensure_ascii=False)`, y después lo **lee** con `json.load` y devuelve lo leído.
--- código
import csv
import io
import json


def total_del_csv(texto):
    pass  # tu código aquí


def guardar_y_leer(datos, ruta):
    pass  # tu código aquí
--- pruebas
import os
import tempfile
planilla = "fecha,app,valor\n2026-11-10,Uber,32.50\n2026-11-10,99,18.00\n2026-11-11,Uber,45.00\n"
prueba("la suma de la planilla", lambda: igual(total_del_csv(planilla), 95.5))
ruta = os.path.join(tempfile.mkdtemp(), "datos.json")
datos = {"carro": "Corolla", "ciudad": "São Paulo", "gastos": [150.0, 30.0]}
prueba("ida y vuelta", lambda: igual(guardar_y_leer(datos, ruta), datos))
@prueba("las tildes quedan como letras (ensure_ascii=False)")
def _():
    guardar_y_leer(datos, ruta)
    with open(ruta, encoding="utf-8") as f:
        ok("São Paulo" in f.read(), "en el archivo tiene que decir São Paulo, no S\\u00e3o Paulo")
--- solución
import csv
import io
import json


def total_del_csv(texto):
    return sum(float(fila["valor"]) for fila in csv.DictReader(io.StringIO(texto)))


def guardar_y_leer(datos, ruta):
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
    with open(ruta, encoding="utf-8") as f:
        return json.load(f)
```

```practica
vf :: with open cierra el archivo solo, aunque haya un error
vf :: Abrir un archivo con "w" agrega al final sin borrar lo que había
elige :: ¿Para qué sirve encoding="utf-8"? :: Para que sea más rápido :: Para que las tildes y la ñ se guarden y lean bien :: Para cifrar el archivo
elige :: ¿Qué módulo convierte diccionarios a JSON y de vuelta? :: csv :: json :: math
escribe :: Escribe cómo agregar la línea "Lavar el carro" al final de tareas.txt. :: with open("tareas.txt", "a", encoding="utf-8") as f: (con 4 espacios) f.write("Lavar el carro\n")
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas errores en Python?":** "Leo el traceback de abajo hacia arriba. Valido los datos donde entran y lanzo ValueError con un mensaje claro si algo no tiene sentido. Atrapo solo los errores que sé manejar, nunca un except vacío, y uso finally o with para cerrar recursos. Para archivos uso with open con encoding utf-8, el módulo csv para planillas y json para datos."

> 🌎 **En la vida real:** es como un plan de emergencia de un edificio: qué puede pasar, cómo se detecta y qué hace cada uno.

> 🌎 **Otro ejemplo:** Es como un piloto que explica qué hace si falla un motor: lo tiene ensayado.
