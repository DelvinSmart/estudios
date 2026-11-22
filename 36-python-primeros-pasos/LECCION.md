# Python 1: primeros pasos

> 🌎 **En la vida real:** si ya manejas un carro automático, aprender a manejar una camioneta es rápido: los pedales y las reglas son las mismas, cambian algunos botones. Si ya leíste JavaScript en este mapa, con Python te va a pasar igual.

> 🎙️ **El profesor dice:** este es el primer tema del curso **Python**, que tiene su propio certificado. Python es el lenguaje más usado en inteligencia artificial, ciencia de datos y automatización, y uno de los más fáciles de leer. Hoy: cómo correrlo en tu Mac, cómo guardar datos en variables, los tipos de datos y cómo mostrar y pedir información. Cada vez que algo se parezca a JavaScript, te lo comparo.

## Parte 1. Correr Python en tu Mac

> 🌎 **En la vida real:** antes de cocinar, prendes la cocina. Antes de programar, abres el lugar donde corre el código.

> 🌎 **Otro ejemplo:** Es como encender la calculadora antes de hacer una cuenta.

### Ver si ya lo tienes

La Mac trae Python 3. En la terminal:

```bash
python3 --version     # por ejemplo: Python 3.12.4
```

Si no aparece, se instala desde python.org o con `brew install python`. En Windows se baja de python.org; en Linux casi siempre ya viene.

> 🌎 **En la vida real:** es como revisar si hay gas antes de cocinar.

> 🌎 **Otro ejemplo:** Es como mirar si el celular tiene una app antes de buscarla en la tienda.

### El intérprete: probar línea por línea

Si escribes solo `python3`, se abre el **intérprete** (también llamado REPL): escribes una línea, la corre y te muestra el resultado. Sirve para probar cosas rápido. Para salir: `exit()` o **Ctrl + D**.

```python
>>> 2 + 3
5
>>> "hola" * 3
'holaholahola'
```

> 🌎 **En la vida real:** es como una calculadora: escribes, das igual y ves el resultado al instante.

> 🌎 **Otro ejemplo:** Es como probarte una prenda en el probador antes de comprarla.

### Un archivo .py

Para programas de verdad, escribes el código en un archivo que termina en `.py` y lo corres:

```python
# hola.py
print("¡Hola, mundo!")
```

```bash
python3 hola.py
```

> 💡 **Idea:** en JavaScript corrías `node archivo.js`; en Python, `python3 archivo.py`. Misma idea.

> 🌎 **En la vida real:** el intérprete es hablar en vivo; el archivo es dejar una carta escrita que se puede leer las veces que quieras.

> 🌎 **Otro ejemplo:** Es como la diferencia entre improvisar una receta y tenerla escrita en un cuaderno.

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **el texto con `f`**: `f"Hola, {nombre}"` pone el valor de `nombre` dentro del texto. La `f` antes de las comillas es la que avisa a Python que mire las llaves `{ }`.
> - **`def`**: viene de *define*. Significa «voy a crear una función». En `def saludo(nombre):`, `saludo` es su nombre y `nombre` es el dato que **recibe**.
> - **Los dos puntos `:`**: avisan que ahora viene el trabajo de la función.
> - **Los espacios al inicio de la línea**: en Python indican qué líneas están **dentro** de la función. No son decoración: si los quitas, da error.
> - **`return`**: **entrega** el resultado a quien usó la función.
> - **`pass`**: significa «aquí todavía no hago nada». Es un espacio reservado: bórralo y escribe tu código.

> 🧩 **Piezas para este ejercicio**
> - `def` declara una función. `return` da un resultado a quien la llama. `pass` es un espacio provisional que deja el bloque vacío. En Python, multiplicar un texto por un entero lo repite.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primer código en Python
lenguaje: python
pide: Completa dos funciones. `saludo(nombre)` devuelve `"¡Hola, Delvin!"` para `"Delvin"`. `repetir(texto, veces)` devuelve el texto repetido, como `"hola" * 3` en el intérprete. Cambia cada `pass` por tu código con `return`. Puedes usar `print()` para mirar valores: sale debajo de las pruebas.
--- código
def saludo(nombre):
    pass  # tu código aquí


def repetir(texto, veces):
    pass  # tu código aquí
--- pruebas
prueba("el saludo", lambda: igual(saludo("Delvin"), "¡Hola, Delvin!"))
prueba("otro nombre", lambda: igual(saludo("Ana"), "¡Hola, Ana!"))
prueba("repetir", lambda: igual(repetir("hola", 3), "holaholahola"))
--- solución
def saludo(nombre):
    return f"¡Hola, {nombre}!"


def repetir(texto, veces):
    return texto * veces
```

```practica
vf :: En la Mac, Python 3 se corre con el comando python3
vf :: El intérprete (REPL) sirve para guardar programas largos
elige :: ¿Cómo sales del intérprete de Python? :: Con quit-all :: Con exit() o Ctrl + D :: Cerrando la Mac
elige :: ¿Qué termina el nombre de un archivo de Python? :: .js :: .py :: .txt
escribe :: ¿Qué diferencia hay entre usar el intérprete y correr un archivo .py? :: El intérprete corre una línea a la vez y muestra el resultado al instante, para probar; el archivo .py guarda el programa completo y se corre con python3 archivo.py.
```

## Parte 2. Variables y comentarios

> 🌎 **En la vida real:** una variable es una caja con etiqueta: la etiqueta es el nombre, lo de adentro es el valor.

> 🌎 **Otro ejemplo:** Es como los contactos del celular: guardas un número con un nombre y después lo buscas por el nombre.

### Crear una variable

En Python no se escribe `const` ni `let`: el nombre, un `=` y el valor. Tampoco va `;` al final.

```python
nombre = "Delvin"
ganancia = 250.50
viajes = 12
```

```js
// Lo mismo en JavaScript:
const nombre = 'Delvin';
let ganancia = 250.5;
```

> 🌎 **En la vida real:** es como etiquetar frascos en la cocina: "azúcar", "sal", "café".

> 🌎 **Otro ejemplo:** Es como el nombre en la puerta de un casillero.

### Nombres: snake_case

En Python los nombres van en minúscula y con guion bajo: `ganancia_total`, `numero_de_viajes` (eso se llama **snake_case**). En JavaScript se usa `gananciaTotal` (camelCase). Las constantes, por costumbre, en MAYÚSCULAS: `IMPUESTO = 0.15`.

> 🌎 **En la vida real:** es como las reglas de ortografía de cada idioma: el portugués y el español escriben distinto, aunque se entiendan.

> 🌎 **Otro ejemplo:** Es como la forma de escribir la fecha: 16/11 o 11/16 según el país.

### Comentarios

Un comentario empieza con `#` (en JavaScript era `//`). Python no lo ejecuta: es para personas.

```python
# Esto es un comentario
total = 10  # también al final de una línea
```

> 🌎 **En la vida real:** es como las notas al margen de un libro: el libro no cambia, pero te ayudan a entender.

> 🌎 **Otro ejemplo:** Es como el post-it en la nevera: "no comer, es para mañana".

> 🧩 **Piezas para este ejercicio**
> - Las MAYÚSCULAS en `IMPUESTO` indican que el equipo espera mantener ese valor fijo. Python sigue permitiendo reasignarlo. `0.15` representa el 15 por cada 100.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Nombres en snake_case y una constante
lenguaje: python
pide: Escribe la constante `IMPUESTO = 0.15` (en MAYÚSCULAS, porque no cambia) y completa `ganancia_por_viaje(ganancia_total, numero_de_viajes)` y `con_impuesto(valor)`, que suma el impuesto y redondea a 2 decimales con `round(…, 2)`. Fíjate en los nombres: minúsculas y guion bajo.
--- código
# tu constante aquí


def ganancia_por_viaje(ganancia_total, numero_de_viajes):
    pass  # tu código aquí


def con_impuesto(valor):
    pass  # tu código aquí
--- pruebas
prueba("la constante existe", lambda: igual(IMPUESTO, 0.15))
prueba("ganancia por viaje", lambda: igual(ganancia_por_viaje(117.0, 12), 9.75))
prueba("con impuesto", lambda: igual(con_impuesto(100), 115.0))
prueba("redondea los centavos", lambda: igual(con_impuesto(9.99), 11.49))
--- solución
IMPUESTO = 0.15


def ganancia_por_viaje(ganancia_total, numero_de_viajes):
    return ganancia_total / numero_de_viajes


def con_impuesto(valor):
    return round(valor * (1 + IMPUESTO), 2)
```

```practica
vf :: En Python se crea una variable con const o let
vf :: Los comentarios en Python empiezan con #
elige :: ¿Cuál nombre sigue el estilo de Python? :: gananciaTotal :: ganancia_total :: GananciaTotal
elige :: ¿Cómo se escribe por costumbre una constante en Python? :: impuesto :: IMPUESTO :: Impuesto
escribe :: Crea en Python tres variables: tu nombre, cuántos viajes hiciste hoy y cuánto ganaste. :: nombre = "Delvin", viajes_hoy = 12, ganancia_hoy = 250.50 (cada una en su línea, sin const ni punto y coma).
```

## Parte 3. Los tipos de datos

> 🌎 **En la vida real:** en una farmacia no guardan igual las pastillas, los jarabes y las vendas: cada cosa tiene su tipo y se trata distinto.

> 🌎 **Otro ejemplo:** Es como el formulario de un banco: en "edad" va un número, en "nombre" va texto, en "¿tiene hijos?" va sí o no.

### Números: int y float

- `int`: número entero (`12`, `-3`, `1000`).
- `float`: número con decimales (`250.50`, `0.15`).

En JavaScript los dos eran `number`; Python los separa.

```python
viajes = 12          # int
precio = 9.75        # float
print(viajes * precio)   # 117.0
print(7 / 2)         # 3.5   (división normal)
print(7 // 2)        # 3     (división entera)
print(7 % 2)         # 1     (lo que sobra)
print(2 ** 3)        # 8     (potencia)
```

> 🌎 **En la vida real:** `int` son los pasajeros (no hay medio pasajero); `float` es el combustible (puedes cargar 32,5 litros).

> 🌎 **Otro ejemplo:** Es como contar manzanas (enteras) y pesar azúcar (con decimales).

### Texto: str

El texto se escribe entre comillas simples o dobles. Para meter variables dentro de un texto se usan las **f-strings** (la `f` antes de las comillas), igual que las plantillas `` `${}` `` de JavaScript.

```python
nombre = "Delvin"
saludo = f"Hola, {nombre}. Hoy hiciste {viajes} viajes."
print(saludo.upper())     # todo en mayúsculas
print(len(nombre))        # 6 letras
```

> 🌎 **En la vida real:** una f-string es como una carta modelo con huecos: "Estimado ____, su pedido ____ llegó".

> 🌎 **Otro ejemplo:** Es como el cartel del bus que cambia el destino: el texto es fijo, el nombre de la parada cambia.

### Sí o no: bool, y "nada": None

- `bool`: `True` o `False` (con **mayúscula**, en JavaScript eran `true`/`false`).
- `None`: "no hay valor" (en JavaScript, `null`).

```python
tiene_carro_propio = True
proximo_mantenimiento = None
print(type(tiene_carro_propio))   # <class 'bool'>
```

> 🌎 **En la vida real:** `bool` es un interruptor: prendido o apagado. `None` es una casilla del formulario que quedó en blanco.

> 🌎 **Otro ejemplo:** Es como el semáforo de una sola luz: está o no está; y `None` es el semáforo apagado.

### Convertir de un tipo a otro

`int("12")` convierte texto en entero, `float("9.75")` en decimal, `str(12)` número en texto. Si el texto no es un número, da error (Python 5).

> 🌎 **En la vida real:** es como cambiar dólares por reales: el valor es el mismo, cambia la forma.

> 🌎 **Otro ejemplo:** Es como pasar una receta de tazas a gramos.

> 🧩 **Piezas para este ejercicio**
> - `//` da el cociente entero y `%` el resto. Para devolver ambos valores puedes escribirlos separados por coma. `int` lee enteros y `float` permite decimales.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: int, float y convertir
lenguaje: python
pide: Completa `repartir(km, dias)`: devuelve dos cosas, cuántos km enteros tocan por día (con `//`) y cuántos sobran (con `%`). Y `a_numero(texto)`: si el texto tiene un punto, devuelve un `float`; si no, un `int`. Pista: `"." in texto`.
--- código
def repartir(km, dias):
    pass  # tu código aquí: return enteros, sobran


def a_numero(texto):
    pass  # tu código aquí
--- pruebas
prueba("repartir 23 km en 5 días", lambda: igual(repartir(23, 5), (4, 3)))
prueba("justo", lambda: igual(repartir(20, 5), (4, 0)))
prueba("un entero", lambda: (igual(a_numero("12"), 12), ok(type(a_numero("12")) is int, "tiene que ser int")))
prueba("un decimal", lambda: (igual(a_numero("9.75"), 9.75), ok(type(a_numero("9.75")) is float, "tiene que ser float")))
--- solución
def repartir(km, dias):
    return km // dias, km % dias


def a_numero(texto):
    if "." in texto:
        return float(texto)
    return int(texto)
```

```practica
vf :: En Python, int y float son tipos distintos de número
vf :: En Python, verdadero se escribe true, con minúscula
elige :: ¿Qué da 7 // 2 en Python? :: 3.5 :: 3 :: 1
elige :: ¿Qué es None en Python? :: Un error :: Que no hay valor, como null en JavaScript :: El número cero
elige :: ¿Cómo se mete una variable dentro de un texto? :: "Hola " + {nombre} :: f"Hola {nombre}" :: 'Hola ${nombre}'
escribe :: Escribe una f-string que diga cuántos viajes hiciste y cuánto ganaste, usando las variables viajes y ganancia. :: f"Hoy hice {viajes} viajes y gané {ganancia} reales."
```

## Parte 4. Mostrar y pedir información

> 🌎 **En la vida real:** un programa conversa como un cajero: te muestra algo en la pantalla y te pide que escribas algo.

> 🌎 **Otro ejemplo:** Es como el cajero automático: "Ingrese su monto" y después "Retire su dinero".

### print: mostrar

`print()` muestra en la terminal (como `console.log` en JavaScript). Puede recibir varias cosas separadas por coma.

```python
print("Total:", 117.0, "reales")
print(f"Ganancia por viaje: {117 / 12:.2f}")   # :.2f → dos decimales: 9.75
```

> 🌎 **En la vida real:** es como el display de la balanza de la feria: te muestra el resultado.

> 🌎 **Otro ejemplo:** Es como el tablero del carro: te informa, no pregunta.

### input: pedir

`input()` muestra una pregunta y espera que la persona escriba. **Siempre devuelve texto**, así que para hacer cuentas hay que convertirlo.

```python
km = float(input("¿Cuántos km recorriste? "))
litros = float(input("¿Cuántos litros cargaste? "))
print(f"Rendimiento: {km / litros:.1f} km por litro")
```

> 🌎 **En la vida real:** es como un formulario en papel: lo que escribes es texto hasta que alguien lo pasa a la calculadora.

> 🌎 **Otro ejemplo:** Es como dictar un número por teléfono: el otro lo anota como palabras y después lo convierte en cifras.

> 🧩 **Piezas para este ejercicio**
> - Convierte ambos textos antes de dividir. En una cadena con prefijo `f`, `{resultado:.1f}` inserta el número con una cifra decimal.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El rendimiento, con dos decimales
lenguaje: python
pide: En el programa de la lección, `input()` devuelve **texto**. Aquí la función recibe ese texto ya escrito. Completa `rendimiento(km_texto, litros_texto)`: convierte los dos con `float()` y devuelve `"Rendimiento: 12.5 km por litro"` con **un** decimal (`:.1f` en una f-string).
--- código
def rendimiento(km_texto, litros_texto):
    pass  # tu código aquí
--- pruebas
prueba("redondo", lambda: igual(rendimiento("400", "32"), "Rendimiento: 12.5 km por litro"))
prueba("con decimales en el texto", lambda: igual(rendimiento("351.5", "30.2"), "Rendimiento: 11.6 km por litro"))
prueba("siempre un decimal", lambda: igual(rendimiento("300", "30"), "Rendimiento: 10.0 km por litro"))
--- solución
def rendimiento(km_texto, litros_texto):
    km = float(km_texto)
    litros = float(litros_texto)
    return f"Rendimiento: {km / litros:.1f} km por litro"
```

```practica
vf :: print en Python es como console.log en JavaScript
vf :: input devuelve un número si la persona escribe un número
elige :: ¿Qué hace :.2f dentro de una f-string? :: Multiplica por 2 :: Muestra el número con dos decimales :: Lo convierte en texto vacío
elige :: ¿Cómo pides un número decimal a la persona? :: input("km") :: float(input("km")) :: print(input)
escribe :: Escribe un programa corto que pida lo que ganaste y lo que gastaste hoy, y muestre lo que te quedó. :: ganado = float(input("¿Cuánto ganaste? ")); gastado = float(input("¿Cuánto gastaste? ")); print(f"Te quedó {ganado - gastado:.2f}") (cada instrucción en su línea).
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué diferencias ves entre Python y JavaScript?":** "Se parecen mucho en las ideas. Python no usa llaves ni punto y coma: usa sangría y dos puntos. Separa los números enteros (int) de los decimales (float), escribe True, False y None con mayúscula, usa f-strings para meter valores en un texto y snake_case para los nombres. Para correrlo uso python3 archivo.py, y el intérprete para probar cosas rápido."

> 🌎 **En la vida real:** es como explicar la diferencia entre manejar en Brasil y en Venezuela: las mismas reglas de fondo, distintos detalles.

> 🌎 **Otro ejemplo:** Es como comparar dos cocinas: los mismos platos, con distintos utensilios.
