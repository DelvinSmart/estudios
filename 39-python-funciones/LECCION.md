# Python 4: funciones

> 🌎 **En la vida real:** una función es como una receta con nombre: "torta de chocolate". Le das los ingredientes (parámetros), sigue los pasos y te devuelve la torta (el resultado). La puedes repetir cuando quieras sin volver a escribirla.

> 🎙️ **El profesor dice:** las funciones son la pieza más importante para que tu código no se repita y se pueda probar. Hoy: cómo se crean con `def`, cómo reciben datos, cómo devuelven resultados, qué ve cada una (el alcance), las funciones cortas (`lambda`) y cómo documentarlas con tipos, como hacías en TypeScript.

## Parte 1. Crear y usar una función

> 🌎 **En la vida real:** es como el botón de "café expreso" de una máquina: lo programaron una vez y lo usas mil veces.

> 🌎 **Otro ejemplo:** Es como un atajo del celular: "llamar a casa" hace varios pasos con un toque.

### def, parámetros y return

```python
def ganancia_neta(bruto, gastos):
    return bruto - gastos

hoy = ganancia_neta(320.0, 95.5)
print(hoy)   # 224.5
```

```js
// En JavaScript:
function gananciaNeta(bruto, gastos) {
  return bruto - gastos;
}
```

- `def` = *define* una función.
- `return` devuelve el resultado. Si una función no tiene `return`, devuelve `None`.

> 🌎 **En la vida real:** `return` es la ventanilla por donde te entregan el pedido.

> 🌎 **Otro ejemplo:** Es como una máquina de jugos: entra fruta, sale jugo; si no tiene salida, no te llevas nada.

### Imprimir no es devolver

Un error común: usar `print` adentro de la función en vez de `return`. `print` **muestra**, pero el resultado no se puede usar después para otra cuenta.

> 🌎 **En la vida real:** es como que el cajero te diga el total en voz alta pero no te dé el ticket: lo oíste, pero no lo tienes.

> 🌎 **Otro ejemplo:** Es como ver una foto en la pantalla de otro: la viste, pero no la guardaste.

```practica
vf :: En Python, las funciones se crean con def
vf :: Una función sin return devuelve 0
elige :: ¿Cuál es la diferencia entre print y return dentro de una función? :: Ninguna :: print muestra; return entrega el resultado para usarlo después :: return muestra en pantalla
elige :: ¿Qué da ganancia_neta(100, 30)? :: 130 :: 70 :: None
escribe :: Escribe una función que reciba km y litros y devuelva el rendimiento. :: def rendimiento(km, litros): (en la siguiente línea, con 4 espacios) return km / litros
```

## Parte 2. Parámetros flexibles

> 🌎 **En la vida real:** al pedir un café, si no dices nada te lo dan "normal"; si quieres, pides "sin azúcar" o "grande".

> 🌎 **Otro ejemplo:** Es como un formulario donde algunos campos ya vienen llenos y solo cambias los que quieres.

### Valores por defecto y argumentos por nombre

```python
def precio_viaje(km, tarifa_km=1.8, minimo=8.0):
    return max(km * tarifa_km, minimo)

precio_viaje(3)                    # usa los valores por defecto
precio_viaje(12, tarifa_km=2.1)    # cambia uno, por nombre
```

Pasar los argumentos **por nombre** (`tarifa_km=2.1`) hace el código más claro y el orden deja de importar.

> 🌎 **En la vida real:** es como pedir "una pizza grande, sin cebolla": dices el nombre de lo que cambias.

> 🌎 **Otro ejemplo:** Es como el control del aire acondicionado: arranca en 23 grados, y solo cambias si quieres otro.

### Muchos argumentos: *args y **kwargs

- `*args` recibe **cuantos quieras** sin nombre (llegan como tupla).
- `**kwargs` recibe **cuantos quieras con nombre** (llegan como diccionario).

```python
def total(*montos):
    return sum(montos)

total(10, 20, 30)   # 60

def registrar(**datos):
    for llave, valor in datos.items():
        print(llave, "=", valor)

registrar(tipo="lavado", valor=30)
```

> 🌎 **En la vida real:** `*args` es una bolsa donde echas todas las monedas que tengas; `**kwargs` es una caja con compartimentos etiquetados.

> 🌎 **Otro ejemplo:** Es como una lista de invitados abierta: vengan los que vengan, entran.

```practica
vf :: Un parámetro con valor por defecto se puede omitir al llamar la función
vf :: *args recibe los argumentos como un diccionario
elige :: ¿Qué da precio_viaje(3) con tarifa 1.8 y mínimo 8? :: 5.4 :: 8.0 :: 3
elige :: ¿Por qué pasar argumentos por nombre? :: Porque es obligatorio :: Porque el código es más claro y el orden deja de importar :: Porque es más rápido
escribe :: Escribe una función promedio(*valores) que devuelva el promedio. :: def promedio(*valores): (con 4 espacios) return sum(valores) / len(valores)
```

## Parte 3. Alcance: qué ve cada función

> 🌎 **En la vida real:** lo que pasa en tu cocina se queda en tu cocina; el vecino no ve tus ollas.

> 🌎 **Otro ejemplo:** Es como un casillero del gimnasio: lo que guardas adentro no lo ve el de al lado.

### Variables locales y globales

Una variable creada **dentro** de una función solo existe ahí (es **local**). Una variable creada **afuera** (global) se puede leer adentro, pero para cambiarla haría falta `global`, y eso casi nunca es buena idea: mejor recibir el dato como parámetro y devolver el resultado.

```python
IMPUESTO = 0.15          # global: se puede leer

def con_impuesto(valor):
    resultado = valor * (1 + IMPUESTO)   # local
    return resultado

print(con_impuesto(100))   # 115.0
# print(resultado)  → NameError: afuera no existe
```

> 🌎 **En la vida real:** las reglas del condominio (globales) las ve todo el mundo; lo que hay en tu departamento (local), solo tú.

> 🌎 **Otro ejemplo:** Es como una pizarra del salón (todos la leen) y tu cuaderno (solo tú).

### Funciones puras

Una función **pura** solo usa sus parámetros y solo devuelve un resultado, sin cambiar nada de afuera. Son las más fáciles de entender y de **probar** (Python 8).

> 🌎 **En la vida real:** es como una calculadora: misma cuenta, mismo resultado, y no te cambia nada de la mesa.

> 🌎 **Otro ejemplo:** Es como una receta exacta: mismos ingredientes, misma torta.

```practica
vf :: Una variable creada dentro de una función se puede usar afuera
vf :: Una función pura solo usa sus parámetros y devuelve un resultado sin cambiar nada de afuera
elige :: ¿Qué es mejor que usar global para cambiar una variable de afuera? :: Usar más global :: Recibir el dato como parámetro y devolver el resultado :: Borrar la variable
elige :: ¿Qué error da usar afuera una variable local? :: TypeError :: NameError :: IndentationError
escribe :: Explica con tus palabras qué es una función pura y por qué conviene. :: Es una función que con los mismos datos de entrada siempre devuelve lo mismo y no cambia nada de afuera; conviene porque es fácil de entender, reutilizar y probar.
```

## Parte 4. Lambdas, tipos y documentación

> 🌎 **En la vida real:** una lambda es una nota rápida en un papelito; una función con `def` es una receta en el cuaderno.

> 🌎 **Otro ejemplo:** Es como una respuesta rápida por mensaje frente a un correo formal.

### lambda: funciones de una línea

Para cosas cortas, sobre todo al ordenar o filtrar:

```python
viajes = [{"destino": "Centro", "valor": 18.5}, {"destino": "Aeropuerto", "valor": 45.0}]
viajes.sort(key=lambda v: v["valor"], reverse=True)   # del más caro al más barato
```

Es como la función flecha de JavaScript: `(v) => v.valor`.

> 🌎 **En la vida real:** es como decirle al de la tienda "ordénalos por precio", sin escribir un manual.

> 🌎 **Otro ejemplo:** Es como un atajo de teclado: corto y para una sola cosa.

### Tipos y docstrings

Python no obliga a poner tipos, pero se pueden **anotar** (como en TypeScript) y documentar con un texto entre triples comillas (**docstring**):

```python
def ganancia_neta(bruto: float, gastos: float) -> float:
    """Devuelve lo que te queda después de los gastos del día."""
    return bruto - gastos
```

Los tipos ayudan al editor y a herramientas como `mypy` a encontrar errores, y a quien lee el código (y a la IA) a entenderlo.

> 🌎 **En la vida real:** es como la etiqueta de un enchufe: "110 V". El enchufe funciona igual, pero la etiqueta evita que lo conectes mal.

> 🌎 **Otro ejemplo:** Es como el prospecto de un remedio: dice para qué sirve y cómo se usa.

```practica
vf :: Una lambda es una función corta de una sola expresión
vf :: En Python es obligatorio escribir los tipos de los parámetros
elige :: ¿Qué hace viajes.sort(key=lambda v: v["valor"])? :: Borra los viajes :: Ordena los viajes por su valor :: Suma los valores
elige :: ¿Qué es un docstring? :: Un error :: El texto entre triples comillas que explica qué hace la función :: Un tipo de lista
escribe :: Escribe la función rendimiento con tipos y docstring. :: def rendimiento(km: float, litros: float) -> float: luego, con 4 espacios, """Devuelve los km por litro.""" y return km / litros
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo escribes funciones en Python?":** "Con def, parámetros con valores por defecto cuando tiene sentido, y return para entregar el resultado. Prefiero funciones puras: reciben lo que necesitan y devuelven algo, sin tocar variables globales, porque son fáciles de probar. Les pongo tipos y un docstring, y uso lambda solo para cosas cortas como ordenar."

> 🌎 **En la vida real:** es como un chef que explica cómo escribe sus recetas: ingredientes claros, pasos exactos y un resultado que se puede repetir.

> 🌎 **Otro ejemplo:** Es como un mecánico que etiqueta cada pieza: el que venga después sabe qué es cada cosa.
