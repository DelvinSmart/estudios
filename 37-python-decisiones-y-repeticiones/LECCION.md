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
