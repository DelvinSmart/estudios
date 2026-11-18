# Python 7: clases y objetos

> 🌎 **En la vida real:** una clase es el **plano** de un carro; cada carro que sale de la fábrica es un **objeto**: todos tienen marca, modelo y kilometraje, pero cada uno con sus propios valores.

> 🎙️ **El profesor dice:** hasta ahora guardaste datos en diccionarios y los trataste con funciones. Las **clases** juntan las dos cosas: los datos de algo (atributos) y lo que ese algo sabe hacer (métodos). Hoy: cómo se crea una clase, `__init__` y `self`, la herencia, y las **dataclasses**, la forma moderna y corta de Python.

## Parte 1. Tu primera clase

> 🌎 **En la vida real:** el formulario en blanco de un taller es la clase; cada formulario llenado con un carro es un objeto.

> 🌎 **Otro ejemplo:** Es como un molde de galletas: un molde, muchas galletas.

### class, __init__ y self

```python
class Carro:
    def __init__(self, marca, modelo, km=0):
        self.marca = marca
        self.modelo = modelo
        self.km = km

    def recorrer(self, distancia):
        self.km += distancia

    def necesita_aceite(self, cada=5000):
        return self.km % cada > cada - 500

mi_carro = Carro("Toyota", "Corolla", 84800)
mi_carro.recorrer(320)
print(mi_carro.km, mi_carro.necesita_aceite())
```

- `__init__` se ejecuta al crear el objeto: prepara sus datos (como el `constructor` de JavaScript).
- `self` es **el objeto mismo** (como `this` en JavaScript). Va siempre como primer parámetro de los métodos.
- Los nombres de clases van con mayúscula inicial: `Carro`, `Viaje`.

> 🌎 **En la vida real:** `self` es como decir "mi" en un formulario: "mi marca", "mi kilometraje".

> 🌎 **Otro ejemplo:** Es como la ficha que se llena al llegar al hotel: se completa una vez al entrar (`__init__`).

### Mostrar un objeto: __str__

```python
class Carro:
    ...
    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.km} km)"

print(mi_carro)   # Toyota Corolla (85120 km)
```

> 🌎 **En la vida real:** es como la etiqueta con el nombre en una maleta: dice de quién es de un vistazo.

> 🌎 **Otro ejemplo:** Es como la tarjeta de presentación de una persona.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primera clase
lenguaje: python
pide: Completa la clase `Carro`: `__init__` guarda `marca`, `modelo` y `km` (por defecto 0) en `self`; `recorrer(distancia)` suma al `km`; `falta_para_aceite(cada=5000)` devuelve cuántos km faltan para el próximo cambio (`cada - self.km % cada`); y `__str__` devuelve `"Toyota Corolla (85120 km)"`.
--- código
class Carro:
    def __init__(self, marca, modelo, km=0):
        pass  # tu código aquí

    def recorrer(self, distancia):
        pass  # tu código aquí

    def falta_para_aceite(self, cada=5000):
        pass  # tu código aquí

    def __str__(self):
        return "Carro"
--- pruebas
@prueba("crear y recorrer")
def _():
    c = Carro("Toyota", "Corolla", 84800)
    c.recorrer(320)
    igual(c.km, 85120)
prueba("km empieza en 0", lambda: igual(Carro("Fiat", "Uno").km, 0))
prueba("lo que falta para el aceite", lambda: igual(Carro("Toyota", "Corolla", 84800).falta_para_aceite(), 200))
prueba("cómo se muestra", lambda: igual(str(Carro("Toyota", "Corolla", 85120)), "Toyota Corolla (85120 km)"))
--- solución
class Carro:
    def __init__(self, marca, modelo, km=0):
        self.marca = marca
        self.modelo = modelo
        self.km = km

    def recorrer(self, distancia):
        self.km += distancia

    def falta_para_aceite(self, cada=5000):
        return cada - self.km % cada

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.km} km)"
```

```practica
vf :: Una clase es el plano y cada objeto es una copia con sus propios valores
vf :: En Python, self es una palabra opcional que casi nunca se usa
elige :: ¿Qué hace __init__? :: Borra el objeto :: Prepara los datos del objeto al crearlo :: Imprime el objeto
elige :: ¿Qué es self en JavaScript? :: const :: this :: new
escribe :: Crea una clase Viaje con origen, destino y valor, y un método con_propina que devuelva el valor con 10% más. :: class Viaje: con def __init__(self, origen, destino, valor) que guarda self.origen, self.destino y self.valor; y def con_propina(self): return self.valor * 1.1
```

## Parte 2. Herencia: una clase a partir de otra

> 🌎 **En la vida real:** una moto y un carro son "vehículos": comparten kilometraje y placa, pero cada uno tiene lo suyo.

> 🌎 **Otro ejemplo:** Es como una receta base de masa: de ahí salen pizza, pan y empanadas.

### Heredar y agregar

```python
class Vehiculo:
    def __init__(self, placa, km=0):
        self.placa = placa
        self.km = km

    def recorrer(self, distancia):
        self.km += distancia

class CarroDeApp(Vehiculo):
    def __init__(self, placa, km=0, apps=None):
        super().__init__(placa, km)       # usa el __init__ de Vehiculo
        self.apps = apps or []

    def trabaja_en(self, app):
        return app in self.apps

c = CarroDeApp("ABC1D23", 85000, ["Uber", "99"])
c.recorrer(40)            # heredado de Vehiculo
print(c.trabaja_en("99"))
```

`super()` llama a la clase de arriba (la "madre").

> 🌎 **En la vida real:** es como heredar la casa de tus padres y agregarle un cuarto.

> 🌎 **Otro ejemplo:** Es como un celular nuevo que trae todo lo del anterior y algunas funciones más.

### No abuses de la herencia

Si dudas, es mejor **componer** (un objeto que tiene otro adentro: "el conductor **tiene** un carro") que heredar ("el conductor **es** un carro", que no tiene sentido). La herencia es para relaciones "es un".

> 🌎 **En la vida real:** un conductor no "es" un carro: "tiene" un carro.

> 🌎 **Otro ejemplo:** Es como una casa: "tiene" una cocina; no "es" una cocina.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Herencia con super()
lenguaje: python
pide: `Vehiculo` ya está. Escribe `CarroDeApp`, que **hereda** de `Vehiculo`: su `__init__(self, placa, km=0, apps=None)` llama a `super().__init__(placa, km)` y guarda `self.apps = apps or []` (una lista **nueva** si no le pasan ninguna); y `trabaja_en(app)` dice si la app está en su lista.
--- código
class Vehiculo:
    def __init__(self, placa, km=0):
        self.placa = placa
        self.km = km

    def recorrer(self, distancia):
        self.km += distancia


class CarroDeApp:
    pass  # tu código aquí: hereda de Vehiculo
--- pruebas
@prueba("hereda lo de Vehiculo")
def _():
    c = CarroDeApp("ABC1D23", 85000, ["Uber", "99"])
    c.recorrer(40)
    igual((c.placa, c.km), ("ABC1D23", 85040))
    ok(isinstance(c, Vehiculo), "un CarroDeApp también es un Vehiculo")
prueba("trabaja en", lambda: igual([CarroDeApp("X", 0, ["Uber", "99"]).trabaja_en(a) for a in ("99", "InDrive")], [True, False]))
@prueba("cada carro con su propia lista")
def _():
    a = CarroDeApp("A")
    b = CarroDeApp("B")
    a.apps.append("Uber")
    igual(b.apps, [])
--- solución
class Vehiculo:
    def __init__(self, placa, km=0):
        self.placa = placa
        self.km = km

    def recorrer(self, distancia):
        self.km += distancia


class CarroDeApp(Vehiculo):
    def __init__(self, placa, km=0, apps=None):
        super().__init__(placa, km)
        self.apps = apps or []

    def trabaja_en(self, app):
        return app in self.apps
```

```practica
vf :: Una clase hija recibe los atributos y métodos de la clase madre
vf :: super() crea un objeto nuevo desde cero sin relación con la madre
elige :: ¿Cuál relación es para herencia? :: El conductor tiene un carro :: Una moto es un vehículo :: La casa tiene cocina
elige :: Para "el conductor tiene un carro", ¿qué conviene? :: Herencia :: Composición: el conductor guarda un objeto Carro adentro :: Ninguna
escribe :: Crea una clase Moto que herede de Vehiculo y agregue un atributo cilindrada. :: class Moto(Vehiculo): def __init__(self, placa, km=0, cilindrada=150): super().__init__(placa, km) y self.cilindrada = cilindrada
```

## Parte 3. Dataclasses: clases cortas para datos

> 🌎 **En la vida real:** si solo necesitas una ficha con datos, no hace falta mandar a hacer un mueble a medida: compras una carpeta estándar.

> 🌎 **Otro ejemplo:** Es como usar una plantilla de factura en vez de diseñarla de cero.

### @dataclass

Para clases que son sobre todo **datos**, Python escribe el `__init__`, el `__str__` y la comparación por ti:

```python
from dataclasses import dataclass, field

@dataclass
class Gasto:
    tipo: str
    valor: float
    nota: str = ""

@dataclass
class DiaDeTrabajo:
    fecha: str
    gastos: list[Gasto] = field(default_factory=list)

    def total_gastos(self) -> float:
        return sum(g.valor for g in self.gastos)

dia = DiaDeTrabajo("2026-11-16")
dia.gastos.append(Gasto("combustible", 150.0))
print(dia.total_gastos(), dia)
```

> 💡 **Idea:** `field(default_factory=list)` crea una lista **nueva** para cada objeto. Si pusieras `= []`, todos los objetos compartirían la misma lista (un error clásico de Python).

> 🌎 **En la vida real:** es como un formulario impreso: los campos ya están, solo llenas.

> 🌎 **Otro ejemplo:** Es como una caja con divisiones ya hechas: guardas sin armar nada.

### Cuándo usar qué

- **Diccionario:** datos rápidos, sin comportamiento (lo que llega de un JSON).
- **Dataclass:** datos con forma fija y tipos, quizá algún método.
- **Clase normal:** cuando el objeto tiene mucho comportamiento o reglas.

> 🌎 **En la vida real:** una nota en un papel, un formulario o un contrato: según cuánto importa el dato.

> 🌎 **Otro ejemplo:** Es como una bolsa, una mochila o una maleta: según lo que lleves.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dataclasses y el error clásico de la lista compartida
lenguaje: python
pide: Completa las dataclasses. `Gasto` tiene `tipo: str`, `valor: float` y `nota: str = ""`. `DiaDeTrabajo` tiene `fecha: str` y `gastos`, una lista que empieza vacía **y es distinta para cada día**: usa `field(default_factory=list)`, no `= []`. Su método `total_gastos()` suma los valores.
--- código
from dataclasses import dataclass, field


@dataclass
class Gasto:
    pass  # tu código aquí


@dataclass
class DiaDeTrabajo:
    fecha: str

    def total_gastos(self):
        pass  # tu código aquí
--- pruebas
prueba("un gasto se compara por su contenido", lambda: igual(Gasto("lavado", 30.0), Gasto("lavado", 30.0, "")))
@prueba("el total del día")
def _():
    dia = DiaDeTrabajo("2026-11-16")
    dia.gastos.append(Gasto("combustible", 150.0))
    dia.gastos.append(Gasto("peaje", 5.4))
    igual(dia.total_gastos(), 155.4)
@prueba("cada día con su propia lista")
def _():
    lunes = DiaDeTrabajo("2026-11-16")
    martes = DiaDeTrabajo("2026-11-17")
    lunes.gastos.append(Gasto("lavado", 30.0))
    igual(martes.gastos, [])
--- solución
from dataclasses import dataclass, field


@dataclass
class Gasto:
    tipo: str
    valor: float
    nota: str = ""


@dataclass
class DiaDeTrabajo:
    fecha: str
    gastos: list = field(default_factory=list)

    def total_gastos(self):
        return sum(g.valor for g in self.gastos)
```

```practica
vf :: @dataclass escribe el __init__ por ti
vf :: En una dataclass, poner gastos: list = [] es seguro para cada objeto
elige :: ¿Qué conviene para guardar un gasto con tipo, valor y nota? :: Una clase con mucha lógica :: Una dataclass :: Un texto
elige :: ¿Qué hace field(default_factory=list)? :: Borra la lista :: Crea una lista nueva para cada objeto :: Ordena la lista
escribe :: Escribe una dataclass Viaje con origen, destino y valor (float). :: from dataclasses import dataclass; @dataclass en la línea de arriba de class Viaje: y adentro origen: str, destino: str, valor: float
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo usas clases en Python?":** "Una clase junta datos y comportamiento; __init__ prepara el objeto y self es el objeto mismo. Uso herencia solo para relaciones 'es un' y prefiero composición para 'tiene un'. Para objetos que son sobre todo datos uso dataclasses con tipos, y cuidado con los valores por defecto mutables: field(default_factory=list)."

> 🌎 **En la vida real:** es como un arquitecto que explica cuándo usa planos estándar y cuándo diseña a medida.

> 🌎 **Otro ejemplo:** Es como un sastre: traje de medida para lo especial, talla estándar para lo común.
