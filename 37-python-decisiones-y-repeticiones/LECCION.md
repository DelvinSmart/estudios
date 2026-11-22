# Python 2: decisiones y repeticiones

> 🌎 **En la vida real:** manejar es decidir y repetir: "si el semáforo está rojo, frena"; "mientras haya pasajeros en la app, acepta viajes". Un programa hace lo mismo.

> 🎙️ **El profesor dice:** hoy aprendes las dos herramientas que hacen que un programa "piense": **decidir** (`if`) y **repetir** (`for` y `while`). Y la regla que más sorprende al venir de JavaScript: en Python, **la sangría (los espacios a la izquierda) es parte del código**.

## Parte 1. La sangría: dos puntos y cuatro espacios

> 🌎 **En la vida real:** en una lista de compras con subtítulos, lo que está corrido a la derecha pertenece al subtítulo de arriba.

> 🌎 **Otro ejemplo:** Es como el índice de un libro: los capítulos a la izquierda, las secciones corridas debajo de cada uno.

### Sin llaves

JavaScript usa `{ }` para decir qué va dentro de qué. Python usa **dos puntos** `:` al final de la línea y **4 espacios** en las líneas de adentro. Si la sangría está mal, Python da `IndentationError`.

```python
if viajes > 10:
    print("¡Buen día!")       # adentro del if
    print("Toma agua.")       # adentro del if
print("Esto se imprime siempre")  # afuera
```

```js
// Lo mismo en JavaScript:
if (viajes > 10) {
  console.log('¡Buen día!');
}
```

> 🌎 **En la vida real:** es como una fila: si te corres un paso a un lado, ya no estás en la fila.

> 🌎 **Otro ejemplo:** Es como los párrafos de una carta: la sangría muestra dónde empieza cada idea.

### Un consejo para no pelear con los espacios

Configura tu editor (VS Code) para que la tecla Tab ponga 4 espacios. No mezcles tabulaciones y espacios en el mismo archivo.

> 🌎 **En la vida real:** es como usar siempre la misma regla para medir: si cambias de regla a la mitad, las medidas no cuadran.

> 🌎 **Otro ejemplo:** Es como escribir con la misma letra toda la carta.

> 🧩 **Piezas para este ejercicio**
> - La sangría son los espacios al principio de la línea. Las instrucciones con la misma sangría dentro de un `if` pertenecen al mismo bloque.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una línea fuera de lugar
lenguaje: python
pide: Este código **corre**, pero hace algo mal: dice "Toma agua." **siempre**, y tenía que decirlo solo en los días buenos. El problema es **una sola sangría**. Arréglala (sin cambiar ningún texto) para que la línea quede adentro del `if`.
--- código
def mensaje(viajes):
    texto = "Día normal."
    if viajes > 10:
        texto = "¡Buen día!"
    texto = texto + " Toma agua."
    return texto
--- pruebas
prueba("un buen día", lambda: igual(mensaje(12), "¡Buen día! Toma agua."))
prueba("un día normal", lambda: igual(mensaje(5), "Día normal."))
prueba("el borde: 10 no es más que 10", lambda: igual(mensaje(10), "Día normal."))
--- solución
def mensaje(viajes):
    texto = "Día normal."
    if viajes > 10:
        texto = "¡Buen día!"
        texto = texto + " Toma agua."
    return texto
```

```practica
vf :: En Python, la sangría es parte del código
vf :: Python usa llaves { } para los bloques, igual que JavaScript
elige :: ¿Qué error da Python si la sangría está mal? :: SyntaxEmoji :: IndentationError :: TypeError
elige :: ¿Qué va al final de la línea de un if en Python? :: Una llave { :: Dos puntos : :: Punto y coma ;
escribe :: ¿Por qué no conviene mezclar tabulaciones y espacios? :: Porque Python cuenta la sangría para saber qué va dentro de qué; si se mezclan, los bloques pueden no coincidir y da error o hace algo distinto.
```

## Parte 2. Decidir: if, elif y else

> 🌎 **En la vida real:** "si llueve, llevo paraguas; si hace sol, gorra; si no, nada".

> 🌎 **Otro ejemplo:** Es como el menú de un teléfono de atención: "si quiere saldo, marque 1; si quiere reclamos, marque 2; si no, espere".

### La forma

```python
ganancia = 180
if ganancia >= 250:
    print("Superaste la meta 🎉")
elif ganancia >= 150:
    print("Cerca de la meta")
else:
    print("Día flojo")
```

`elif` es "si no, si…" (en JavaScript era `else if`). Python revisa de arriba abajo y entra **solo en el primero** que se cumpla.

> 🌎 **En la vida real:** es como el filtro de la puerta de un evento: VIP por un lado, general por otro, sin entrada a la casa.

> 🌎 **Otro ejemplo:** Es como clasificar ropa sucia: blanca, de color o delicada; cada prenda va a una sola pila.

### Comparar y combinar

Comparadores: `==` igual, `!=` distinto, `>`, `<`, `>=`, `<=`. Para combinar se usan **palabras**: `and`, `or`, `not` (en JavaScript eran `&&`, `||`, `!`).

```python
if km > 300 and not cambio_de_aceite_hecho:
    print("Toca cambiar el aceite")
if dia == "sábado" or dia == "domingo":
    print("Tarifa de fin de semana")
```

> 💡 **Idea:** en Python `==` ya compara como el `===` de JavaScript: `1 == "1"` es `False`.

> 🌎 **En la vida real:** `and` es "necesito licencia **y** documento del carro"; `or` es "pago con tarjeta **o** efectivo".

> 🌎 **Otro ejemplo:** Es como una receta: "si hay harina y huevos, haces la torta; si no hay ninguno, compras".

### Lo que cuenta como falso

Valen como `False` en un `if`: `False`, `None`, `0`, `""` (texto vacío), `[]` (lista vacía), `{}`. Todo lo demás vale como `True`.

```python
gastos = []
if not gastos:
    print("Todavía no registraste gastos")
```

> 🌎 **En la vida real:** una caja vacía cuenta como "no hay nada", aunque la caja exista.

> 🌎 **Otro ejemplo:** Es como un tanque en cero: el tanque está, pero para manejar cuenta como vacío.

> 🧩 **Piezas para este ejercicio**
> - `elif` comprueba el siguiente caso solo si el anterior no se cumplió. `or` permite comprobar dos días distintos. Una lista vacía cuenta como falsa, así que `not gastos` la detecta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: if, elif, else y lo que cuenta como falso
lenguaje: python
pide: Completa tres funciones. `nivel(ganancia)`: 250 o más → `"Superaste la meta"`; 150 o más → `"Cerca de la meta"`; si no, `"Día flojo"`. `es_fin_de_semana(dia)`: `True` si es `"sábado"` o `"domingo"` (usa `or`). `aviso(gastos)`: si la lista está vacía (usa `if not gastos`), `"Todavía no registraste gastos"`; si no, `"N gastos"`.
--- código
def nivel(ganancia):
    pass  # tu código aquí


def es_fin_de_semana(dia):
    pass  # tu código aquí


def aviso(gastos):
    pass  # tu código aquí
--- pruebas
prueba("los niveles y sus bordes", lambda: igual([nivel(g) for g in [250, 249, 150, 149]], ["Superaste la meta", "Cerca de la meta", "Cerca de la meta", "Día flojo"]))
prueba("fin de semana", lambda: igual([es_fin_de_semana(d) for d in ["sábado", "domingo", "lunes"]], [True, True, False]))
prueba("sin gastos", lambda: igual(aviso([]), "Todavía no registraste gastos"))
prueba("con gastos", lambda: igual(aviso([150, 30]), "2 gastos"))
--- solución
def nivel(ganancia):
    if ganancia >= 250:
        return "Superaste la meta"
    elif ganancia >= 150:
        return "Cerca de la meta"
    else:
        return "Día flojo"


def es_fin_de_semana(dia):
    return dia == "sábado" or dia == "domingo"


def aviso(gastos):
    if not gastos:
        return "Todavía no registraste gastos"
    return f"{len(gastos)} gastos"
```

```practica
vf :: En Python, else if se escribe elif
vf :: En Python, "y" se escribe && como en JavaScript
elige :: ¿Qué imprime si ganancia vale 200 y las condiciones son >= 250, >= 150 y else? :: Superaste la meta :: Cerca de la meta :: Día flojo
elige :: ¿Cuál de estos vale como False en un if? :: "hola" :: Una lista vacía [] :: 5
elige :: En Python, ¿qué da 1 == "1"? :: True :: False :: Error
escribe :: Escribe un if que diga "carga combustible" si el tanque tiene menos de 10 litros, "todo bien" si no. :: if litros < 10: (en la línea siguiente, con 4 espacios) print("carga combustible"); else: (en la siguiente, con 4 espacios) print("todo bien").
```

## Parte 3. Repetir con for

> 🌎 **En la vida real:** "por cada pasajero de la lista, confirma el destino".

> 🌎 **Otro ejemplo:** Es como pasar lista en el colegio: un nombre a la vez, hasta el último.

### Recorrer una lista

```python
ganancias = [120, 95, 180, 210]
total = 0
for g in ganancias:
    total += g
print(f"Total de la semana: {total}")
```

Se lee: "**para cada** `g` **en** `ganancias`". Es como el `for (const g of ganancias)` de JavaScript.

> 🌎 **En la vida real:** es como contar billetes uno por uno y sumarlos.

> 🌎 **Otro ejemplo:** Es como revisar los correos de la bandeja: abres uno, después el siguiente, hasta el final.

### range: repetir un número de veces

`range(5)` da `0, 1, 2, 3, 4`. `range(1, 6)` da `1` a `5`. `range(0, 10, 2)` va de 2 en 2.

```python
for dia in range(1, 8):
    print(f"Día {dia}")
```

> 🌎 **En la vida real:** es como dar 10 vueltas a la pista: no te importa cuál vuelta, solo que sean 10.

> 🌎 **Otro ejemplo:** Es como la tabla de multiplicar: del 1 al 10, siempre igual.

### enumerate: el número y el valor juntos

```python
apps = ["Uber", "99", "InDrive"]
for i, app in enumerate(apps, start=1):
    print(f"{i}. {app}")
```

> 🌎 **En la vida real:** es como la lista de espera de un restaurante: el turno y el nombre.

> 🌎 **Otro ejemplo:** Es como las páginas numeradas de un libro.

> 🧩 **Piezas para este ejercicio**
> - `range` termina antes del segundo límite. `enumerate` devuelve pares con el número y el elemento. En una suma, el acumulador empieza en cero antes del recorrido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: for, range y enumerate
lenguaje: python
pide: Completa con `for`. `total(ganancias)`: la suma, con un ciclo (sin usar `sum`). `dias()`: la lista `["Día 1", …, "Día 7"]` con `range`. `numeradas(apps)`: `["1. Uber", "2. 99", …]` con `enumerate(apps, start=1)`.
--- código
def total(ganancias):
    pass  # tu código aquí


def dias():
    pass  # tu código aquí


def numeradas(apps):
    pass  # tu código aquí
--- pruebas
prueba("el total", lambda: igual(total([120, 95, 180, 210]), 605))
prueba("sin ganancias", lambda: igual(total([]), 0))
prueba("los días", lambda: igual(dias(), ["Día 1", "Día 2", "Día 3", "Día 4", "Día 5", "Día 6", "Día 7"]))
prueba("numeradas", lambda: igual(numeradas(["Uber", "99", "InDrive"]), ["1. Uber", "2. 99", "3. InDrive"]))
--- solución
def total(ganancias):
    suma = 0
    for g in ganancias:
        suma += g
    return suma


def dias():
    lista = []
    for dia in range(1, 8):
        lista.append(f"Día {dia}")
    return lista


def numeradas(apps):
    lista = []
    for i, app in enumerate(apps, start=1):
        lista.append(f"{i}. {app}")
    return lista
```

```practica
vf :: for g in ganancias recorre la lista elemento por elemento
vf :: range(5) da los números del 1 al 5
elige :: ¿Qué da range(1, 4)? :: 1, 2, 3, 4 :: 1, 2, 3 :: 0, 1, 2, 3
elige :: ¿Para qué sirve enumerate? :: Para ordenar :: Para tener el número de vuelta y el valor juntos :: Para borrar
escribe :: Escribe un for que sume los gastos [30, 45, 12] y muestre el total. :: total = 0; for g in [30, 45, 12]: (en la línea siguiente, con 4 espacios) total += g; después, afuera del for, print(total).
```

## Parte 4. Repetir con while, break y continue

> 🌎 **En la vida real:** "mientras quede combustible, sigue manejando".

> 🌎 **Otro ejemplo:** Es como revolver la sopa mientras no hierva.

### while

Repite **mientras** la condición sea verdadera. Ojo: si nunca deja de cumplirse, el programa no termina (un **ciclo infinito**). Para cortarlo en la terminal: **Ctrl + C**.

```python
ahorro = 0
meses = 0
while ahorro < 1000:
    ahorro += 150
    meses += 1
print(f"Llegas a 1000 en {meses} meses")
```

> 🌎 **En la vida real:** es como llenar un balde con un vaso: repites mientras no esté lleno.

> 🌎 **Otro ejemplo:** Es como esperar el bus: sigues esperando mientras no llegue.

### break y continue

- `break`: sale del ciclo ya.
- `continue`: salta a la siguiente vuelta.

```python
for g in [120, -5, 90, 0, 200]:
    if g < 0:
        print("Dato raro, lo salto")
        continue
    if g == 0:
        print("Día sin trabajo: paro de contar")
        break
    print(g)
```

> 🌎 **En la vida real:** `continue` es saltar una canción que no te gusta; `break` es apagar la radio.

> 🌎 **Otro ejemplo:** Es como revisar facturas: si una está rota, pasas a la siguiente (continue); si se acabó la jornada, paras (break).

> 🧩 **Piezas para este ejercicio**
> - `while` comprueba la condición antes de ejecutar el bloque. En un recorrido, `continue` abandona la vuelta actual y `break` termina todo el ciclo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: while, break y continue
lenguaje: python
pide: Completa `meses_para(meta, por_mes)` con un `while`: cuántos meses ahorrando `por_mes` hacen falta para llegar **al menos** a la meta. Y `sumar_validos(ganancias)`: suma los valores, pero **salta** los negativos (`continue`) y **para** al encontrar un 0 (`break`), sin sumarlo.
--- código
def meses_para(meta, por_mes):
    pass  # tu código aquí


def sumar_validos(ganancias):
    pass  # tu código aquí
--- pruebas
prueba("ahorrar 1000 de a 150", lambda: igual(meses_para(1000, 150), 7))
prueba("justo en el borde", lambda: igual(meses_para(300, 150), 2))
prueba("salta los negativos y para en el 0", lambda: igual(sumar_validos([120, -5, 90, 0, 200]), 210))
prueba("sin 0, suma todo lo válido", lambda: igual(sumar_validos([10, -1, 20]), 30))
--- solución
def meses_para(meta, por_mes):
    ahorro = 0
    meses = 0
    while ahorro < meta:
        ahorro += por_mes
        meses += 1
    return meses


def sumar_validos(ganancias):
    suma = 0
    for g in ganancias:
        if g < 0:
            continue
        if g == 0:
            break
        suma += g
    return suma
```

```practica
vf :: while repite mientras la condición sea verdadera
vf :: break salta solo a la siguiente vuelta del ciclo
elige :: Tu programa quedó en un ciclo infinito en la terminal. ¿Cómo lo paras? :: Cmd + Q :: Ctrl + C :: Escribiendo exit
elige :: ¿Qué usas para saltar un dato raro y seguir con los demás? :: break :: continue :: else
escribe :: Escribe un while que cuente cuántos meses tardas en ahorrar 500 si guardas 120 por mes. :: ahorro = 0; meses = 0; while ahorro < 500: (con 4 espacios) ahorro += 120 y meses += 1; al final print(meses).
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo se escribe un ciclo en Python?":** "Con for para recorrer una lista o un range, y while para repetir mientras se cumpla una condición. Los bloques se marcan con dos puntos y sangría de 4 espacios, sin llaves. Las condiciones usan and, or y not, y elif para varios casos. Con break salgo del ciclo y con continue paso a la siguiente vuelta."

> 🌎 **En la vida real:** es como explicar una receta: los pasos que se repiten y las decisiones ("si está muy espeso, agrega agua").

> 🌎 **Otro ejemplo:** Es como explicar un circuito de entrenamiento: repeticiones, series y cuándo parar.
