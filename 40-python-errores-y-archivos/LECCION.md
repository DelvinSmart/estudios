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
