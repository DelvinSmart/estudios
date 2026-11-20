# Python 3: listas, tuplas, diccionarios y conjuntos

> 🌎 **En la vida real:** para guardar cosas usas distintos muebles: un estante (orden), un sobre cerrado (no se cambia), un archivador con etiquetas (buscar por nombre) y una bolsa donde no se repite nada.

> 🎙️ **El profesor dice:** casi todo programa trabaja con **grupos de datos**: los viajes del día, los gastos del mes, los datos de un carro. Python tiene cuatro formas de agruparlos: **listas**, **tuplas**, **diccionarios** y **conjuntos**. Al final, la herramienta más "de Python" de todas: las **comprensiones**.

## Parte 1. Listas

> 🌎 **En la vida real:** una lista es como la fila del banco: tiene orden, entra gente al final y puede salir alguien del medio.

> 🌎 **Otro ejemplo:** Es como una playlist: canciones en orden, puedes agregar, quitar y reordenar.

### Crear, leer y cambiar

```python
viajes = [18.5, 22.0, 9.75]
print(viajes[0])      # 18.5   (empieza en 0, como en JavaScript)
print(viajes[-1])     # 9.75   (el último: índice negativo)
viajes[1] = 23.0      # cambiar uno
print(len(viajes))    # 3
```

> 🌎 **En la vida real:** es como los asientos numerados de un cine: el primero es el 0 y puedes cambiar quién se sienta.

> 🌎 **Otro ejemplo:** Es como los cajones numerados de una cómoda.

### Agregar, quitar y ordenar

```python
viajes.append(30.0)         # al final (en JS: push)
viajes.insert(0, 5.0)       # en una posición
viajes.remove(9.75)         # quita ese valor
ultimo = viajes.pop()       # saca el último y lo devuelve
viajes.sort()               # ordena (de menor a mayor)
print(sum(viajes), max(viajes), min(viajes))
print(23.0 in viajes)       # True: ¿está en la lista?
```

> 🌎 **En la vida real:** es como una lista de mandados: agregas "pan", tachas "leche" y las ordenas por tienda.

> 🌎 **Otro ejemplo:** Es como acomodar libros en el estante por altura.

### Rebanadas (slicing)

`lista[inicio:fin]` saca un pedazo (el `fin` no se incluye).

```python
semana = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]
print(semana[0:5])    # de lunes a viernes
print(semana[5:])     # fin de semana
print(semana[::-1])   # al revés
```

> 🌎 **En la vida real:** es como cortar un pedazo de pan: del centímetro 2 al 5.

> 🌎 **Otro ejemplo:** Es como elegir capítulos de un libro: del 3 al 6.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Listas y rebanadas
lenguaje: python
pide: Completa `separar_semana(semana)`: devuelve dos listas, los días de lunes a viernes y el fin de semana, con rebanadas (`[0:5]` y `[5:]`). Y `resumen(viajes)`: devuelve el primero, el último (índice `-1`), el mayor y la suma. **No cambies** la lista que recibes.
--- código
def separar_semana(semana):
    pass  # tu código aquí


def resumen(viajes):
    pass  # tu código aquí: return primero, ultimo, mayor, suma
--- pruebas
semana = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]
prueba("la semana partida", lambda: igual(separar_semana(semana), (["lun", "mar", "mié", "jue", "vie"], ["sáb", "dom"])))
prueba("el resumen", lambda: igual(resumen([18.5, 22.0, 9.75]), (18.5, 9.75, 22.0, 50.25)))
@prueba("no cambia la lista")
def _():
    viajes = [18.5, 22.0, 9.75]
    resumen(viajes)
    igual(viajes, [18.5, 22.0, 9.75])
--- solución
def separar_semana(semana):
    return semana[0:5], semana[5:]


def resumen(viajes):
    return viajes[0], viajes[-1], max(viajes), sum(viajes)
```

```practica
vf :: En Python, el primer elemento de una lista es el índice 0
vf :: lista[-1] da error porque no hay índices negativos
elige :: ¿Qué método agrega al final de una lista? :: push :: append :: add
elige :: ¿Qué da semana[0:2] si semana es ["lun", "mar", "mié"]? :: ["lun", "mar", "mié"] :: ["lun", "mar"] :: ["mar", "mié"]
escribe :: Tienes gastos = [30, 12, 45]. Escribe cómo agregar 20, ordenar la lista y mostrar el total. :: gastos.append(20); gastos.sort(); print(sum(gastos)).
```

## Parte 2. Tuplas: datos que no cambian

> 🌎 **En la vida real:** una tupla es como una fecha de nacimiento: día, mes y año van juntos y no cambian.

> 🌎 **Otro ejemplo:** Es como las coordenadas de un lugar en el mapa: latitud y longitud, siempre en ese orden.

### Crear y desarmar

Una tupla va entre paréntesis y **no se puede cambiar** después de creada.

```python
punto = (-23.55, -46.63)      # latitud, longitud de São Paulo
lat, lon = punto              # desarmar en dos variables
print(lat)
```

Desarmar también sirve para intercambiar valores: `a, b = b, a`.

> 🌎 **En la vida real:** es como un sobre sellado: lo puedes abrir y leer, pero no cambiar lo de adentro.

> 🌎 **Otro ejemplo:** Es como un DNI: los datos van juntos y no los editas tú.

### ¿Lista o tupla?

**Lista** si los datos van a cambiar (los viajes del día). **Tupla** si son un grupo fijo (una coordenada, un color RGB, el resultado de una función que devuelve dos cosas).

> 🌎 **En la vida real:** la lista del supermercado cambia; tu dirección (calle, número, ciudad) no.

> 🌎 **Otro ejemplo:** Es como un menú del día (cambia) y la receta original de la casa (fija).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tuplas: devolver dos cosas
lenguaje: python
pide: Completa `menor_y_mayor(valores)`: devuelve una **tupla** con el menor y el mayor. Y `intercambiar(a, b)`: devuelve los dos al revés, con el truco de Python `b, a`. Mira en las pruebas cómo se **desarma** la tupla en dos variables.
--- código
def menor_y_mayor(valores):
    pass  # tu código aquí


def intercambiar(a, b):
    pass  # tu código aquí
--- pruebas
@prueba("se desarma en dos variables")
def _():
    menor, mayor = menor_y_mayor([120, 95, 180])
    igual((menor, mayor), (95, 180))
prueba("es una tupla", lambda: ok(isinstance(menor_y_mayor([1, 2]), tuple), "tiene que devolver una tupla"))
prueba("intercambiar", lambda: igual(intercambiar("Uber", "99"), ("99", "Uber")))
--- solución
def menor_y_mayor(valores):
    return min(valores), max(valores)


def intercambiar(a, b):
    return b, a
```

```practica
vf :: Una tupla se puede cambiar después de creada
vf :: lat, lon = punto desarma la tupla en dos variables
elige :: ¿Con qué se escribe una tupla? :: Corchetes [ ] :: Paréntesis ( ) :: Llaves { }
elige :: ¿Qué conviene para guardar un color (rojo, verde, azul)? :: Una lista :: Una tupla :: Un texto
escribe :: ¿Cómo intercambias los valores de a y b en una sola línea? :: a, b = b, a
```

## Parte 3. Diccionarios: buscar por nombre

> 🌎 **En la vida real:** un diccionario es como un archivador con etiquetas: buscas la carpeta "IPVA" y ahí está el dato.

> 🌎 **Otro ejemplo:** Es como los contactos del celular: buscas por nombre, no por posición.

### Llave y valor

Un diccionario guarda pares **llave: valor** entre llaves. Es como un objeto de JavaScript.

```python
carro = {"marca": "Toyota", "modelo": "Corolla", "km": 85000}
print(carro["marca"])            # Toyota
carro["km"] = 85320              # cambiar
carro["color"] = "gris"          # agregar
print(carro.get("seguro", "sin datos"))   # si no existe, da el valor por defecto
del carro["color"]               # borrar
print("km" in carro)             # True
```

> 💡 **Idea:** `carro["seguro"]` da error si la llave no existe; `carro.get("seguro")` devuelve `None` (o el valor que le digas).

> 🌎 **En la vida real:** es como la ficha de un cliente: "nombre: Ana, teléfono: …, dirección: …".

> 🌎 **Otro ejemplo:** Es como el tablero de un estacionamiento: cada placa con su lugar.

### Recorrer un diccionario

```python
for llave, valor in carro.items():
    print(f"{llave}: {valor}")
```

`carro.keys()` da las llaves y `carro.values()` los valores.

> 🌎 **En la vida real:** es como leer la ficha de un cliente renglón por renglón.

> 🌎 **Otro ejemplo:** Es como pasar por cada casillero del gimnasio mirando el nombre y lo que tiene.

### Listas de diccionarios

Así se guardan casi siempre los datos reales (lo que devuelve una API o un archivo JSON):

```python
gastos = [
    {"tipo": "combustible", "valor": 150.0},
    {"tipo": "lavado", "valor": 30.0},
]
total = sum(g["valor"] for g in gastos)
```

> 🌎 **En la vida real:** es como una planilla: cada fila es un registro con sus columnas.

> 🌎 **Otro ejemplo:** Es como una caja de fichas de pacientes: cada ficha con los mismos campos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Diccionarios: buscar por nombre
lenguaje: python
pide: Completa `dato(carro, llave)`: devuelve el valor de esa llave, o `"sin datos"` si no existe (con `.get`). Y `total_por_tipo(gastos)`: recibe una lista de diccionarios como `{"tipo": "lavado", "valor": 30.0}` y devuelve un diccionario con cuánto se gastó en cada tipo.
--- código
def dato(carro, llave):
    pass  # tu código aquí


def total_por_tipo(gastos):
    pass  # tu código aquí
--- pruebas
carro = {"marca": "Toyota", "modelo": "Corolla", "km": 85000}
prueba("una llave que existe", lambda: igual(dato(carro, "km"), 85000))
prueba("una que no existe, sin error", lambda: igual(dato(carro, "seguro"), "sin datos"))
gastos = [{"tipo": "combustible", "valor": 150.0}, {"tipo": "lavado", "valor": 30.0}, {"tipo": "combustible", "valor": 100.0}]
prueba("total por tipo", lambda: igual(total_por_tipo(gastos), {"combustible": 250.0, "lavado": 30.0}))
prueba("sin gastos", lambda: igual(total_por_tipo([]), {}))
--- solución
def dato(carro, llave):
    return carro.get(llave, "sin datos")


def total_por_tipo(gastos):
    totales = {}
    for g in gastos:
        totales[g["tipo"]] = totales.get(g["tipo"], 0) + g["valor"]
    return totales
```

```practica
vf :: Un diccionario de Python se parece a un objeto de JavaScript
vf :: carro["seguro"] devuelve None si la llave no existe
elige :: ¿Cómo recorres llaves y valores juntos? :: for x in carro.values() :: for llave, valor in carro.items() :: for carro in llave
elige :: ¿Qué estructura usarías para los datos de un carro (marca, modelo, km)? :: Una lista :: Un diccionario :: Un número
escribe :: Crea un diccionario de un viaje con origen, destino y valor, y muestra el destino. :: viaje = {"origen": "Centro", "destino": "Aeropuerto", "valor": 45.0}; print(viaje["destino"]).
```

## Parte 4. Conjuntos y comprensiones

> 🌎 **En la vida real:** un conjunto es como una lista de invitados donde nadie puede estar dos veces.

> 🌎 **Otro ejemplo:** Es como los sellos de un álbum: si te toca uno repetido, no suma.

### Conjuntos (set): sin repetidos

```python
apps_usadas = ["Uber", "99", "Uber", "InDrive", "99"]
distintas = set(apps_usadas)       # {'Uber', '99', 'InDrive'}
print(len(distintas))              # 3
```

Sirven para quitar repetidos y para preguntar rápido "¿está?".

> 🌎 **En la vida real:** es como contar cuántas personas distintas vinieron a la tienda, no cuántas veces entraron.

> 🌎 **Otro ejemplo:** Es como una colección de monedas: guardas una de cada.

### Comprensiones: crear una lista en una línea

Una **comprensión** arma una lista nueva a partir de otra, con una condición opcional. Es como el `map` y `filter` de JavaScript juntos.

```python
viajes = [18.5, 22.0, 9.75, 40.0]
con_propina = [v * 1.1 for v in viajes]            # map
caros = [v for v in viajes if v > 20]               # filter
por_app = {app: 0 for app in ["Uber", "99"]}        # también diccionarios
```

```js
// En JavaScript:
const caros = viajes.filter((v) => v > 20);
```

> 🌎 **En la vida real:** es como decir "de esta canasta, dame solo las manzanas rojas, ya peladas", en una frase.

> 🌎 **Otro ejemplo:** Es como el filtro de una búsqueda en una tienda online: "solo los de menos de 100".

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`round()`**: redondea un número: `round(3.456, 2)` → `3.46` (con 2 decimales) y `round(3.6)` → `4`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Conjuntos y comprensiones
lenguaje: python
pide: Completa tres funciones, **cada una en una sola línea**. `apps_distintas(apps)`: las apps sin repetir, ordenadas (`sorted(set(…))`). `caros(viajes, minimo)`: los viajes mayores que el mínimo, con una comprensión. `con_propina(viajes)`: cada viaje por 1.1, redondeado a 2 decimales.
--- código
def apps_distintas(apps):
    pass  # tu código aquí


def caros(viajes, minimo):
    pass  # tu código aquí


def con_propina(viajes):
    pass  # tu código aquí
--- pruebas
prueba("sin repetidas", lambda: igual(apps_distintas(["Uber", "99", "Uber", "InDrive", "99"]), ["99", "InDrive", "Uber"]))
prueba("los caros", lambda: igual(caros([18.5, 22.0, 9.75, 40.0], 20), [22.0, 40.0]))
prueba("con propina", lambda: igual(con_propina([10.0, 18.5]), [11.0, 20.35]))
--- solución
def apps_distintas(apps):
    return sorted(set(apps))


def caros(viajes, minimo):
    return [v for v in viajes if v > minimo]


def con_propina(viajes):
    return [round(v * 1.1, 2) for v in viajes]
```

```practica
vf :: Un set no guarda elementos repetidos
vf :: Una comprensión siempre tiene que llevar if
elige :: ¿Qué da len(set(["a", "b", "a"]))? :: 3 :: 2 :: 1
elige :: ¿Qué hace [v for v in viajes if v > 20]? :: Suma los viajes :: Hace una lista con los viajes mayores que 20 :: Borra los viajes
escribe :: Escribe una comprensión que convierta [10, 20, 30] en reales con 15% descontado. :: [v * 0.85 for v in [10, 20, 30]]
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué estructuras de datos tiene Python?":** "Lista para datos con orden que cambian; tupla para un grupo fijo que no cambia; diccionario para buscar por llave, como un objeto de JavaScript; y set para no tener repetidos. Uso comprensiones para crear listas filtradas o transformadas en una línea, y get en los diccionarios cuando una llave puede no existir."

> 🌎 **En la vida real:** es como explicar cómo ordenas tu casa: qué va en el estante, qué en el archivador y qué en la caja fuerte.

> 🌎 **Otro ejemplo:** Es como un mecánico explicando su caja de herramientas: cada cosa en su compartimento.
