# Kotlin 2: null safety, decisiones y ciclos

> 🌎 **En la vida real:** el error más común de las apps es "intentar usar algo que no estaba": abrir una caja vacía como si tuviera algo. Kotlin te obliga a revisar la caja antes.

> 🎙️ **El profesor dice:** la gran fama de Kotlin es su **seguridad con null**. Hoy: tipos que pueden ser null (`String?`), los operadores `?.`, `?:` y `!!`, `if` y `when` que **devuelven** un valor, rangos y ciclos.

## Parte 1. Null safety

> 🌎 **En la vida real:** en Kotlin, una caja que puede venir vacía lleva una etiqueta: "puede estar vacía". Y antes de usarla, la revisas.

> 🌎 **Otro ejemplo:** Es como un pasajero que puede o no tener reserva: antes de darle el asiento, lo confirmas.

### String frente a String?

```kotlin
var nombre: String = "Delvin"
// nombre = null          ❌ un String nunca puede ser null

var apodo: String? = null  // con ? sí puede ser null
// apodo.length           ❌ Kotlin no deja: puede ser null
```

Es como `strictNullChecks` de TypeScript (clase 52), pero **siempre** activado.

> 🌎 **En la vida real:** es como una casilla obligatoria y otra opcional en un formulario.

> 🌎 **Otro ejemplo:** Es como un asiento numerado frente a uno "si hay lugar".

### ?. , ?: y !!

```kotlin
val largo = apodo?.length            // si apodo es null, largo es null (como ?. en JavaScript)
val mostrar = apodo ?: "sin apodo"   // "Elvis": si es null, usa esto (como ?? en JavaScript)
val seguro = apodo!!.length          // "confía en mí": si es null, la app se cae ❌ evítalo
```

> 🌎 **En la vida real:** `?.` es "pregunta si hay alguien antes de entrar"; `?:` es "si no hay, deja la nota en la portería"; `!!` es "entra a la fuerza".

> 🌎 **Otro ejemplo:** `!!` es como saltar en paracaídas sin revisar si está bien doblado.

> 🧩 **Piezas para este ejercicio**
> - `?.` solo lee o llama lo que sigue si el dato está presente. `?:` elige un respaldo si el resultado es `null`. `firstOrNull()` también puede devolver `null` para un texto vacío.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ?. y ?: sin que nada se caiga
lenguaje: kotlin
pide: Completa tres funciones **sin usar `!!`**. `mostrarApodo(apodo)` devuelve el apodo o `"sin apodo"` si es null. `largoDelApodo(apodo)` devuelve cuántas letras tiene, o `0` si es null. `primeraLetra(nombre)` devuelve la primera letra, o null si el nombre es null o está vacío (pista: `firstOrNull()`).
--- código
fun mostrarApodo(apodo: String?): String = TODO()

fun largoDelApodo(apodo: String?): Int = TODO()

fun primeraLetra(nombre: String?): Char? = TODO()
--- pruebas
prueba("con apodo") { igual(mostrarApodo("Del"), "Del") }
prueba("sin apodo") { igual(mostrarApodo(null), "sin apodo") }
prueba("el largo, también con null") { igual(listOf(largoDelApodo("Del"), largoDelApodo(null)), listOf(3, 0)) }
prueba("la primera letra") { igual(primeraLetra("Delvin"), 'D') }
prueba("null o vacío: null") { igual(listOf(primeraLetra(null), primeraLetra("")), listOf(null, null)) }
--- solución
fun mostrarApodo(apodo: String?): String = apodo ?: "sin apodo"

fun largoDelApodo(apodo: String?): Int = apodo?.length ?: 0

fun primeraLetra(nombre: String?): Char? = nombre?.firstOrNull()
```

```practica
vf :: En Kotlin, una variable de tipo String no puede ser null
vf :: El operador !! es la forma más segura de usar un valor que puede ser null
elige :: ¿Qué da apodo ?: "sin apodo" si apodo es null? :: null :: "sin apodo" :: Error
elige :: ¿A qué operador de JavaScript se parece ?: en Kotlin? :: && :: ?? :: ===
escribe :: Escribe cómo mostrar el largo de un apodo que puede ser null, o 0 si no hay apodo. :: val largo = apodo?.length ?: 0
```

## Parte 2. if y when como expresiones

> 🌎 **En la vida real:** en Kotlin, una decisión no solo "hace algo": también **te da** un resultado, como una máquina que según la moneda te devuelve un producto.

> 🌎 **Otro ejemplo:** Es como una tabla de tarifas: miras la fila y tienes el precio.

### if que devuelve

```kotlin
val mensaje = if (ganancia >= 250) "Meta cumplida" else "Sigue"
```

No hace falta el ternario `? :` de JavaScript: el `if` mismo devuelve el valor.

> 🌎 **En la vida real:** es como un interruptor que, además de prender, te dice "encendido".

> 🌎 **Otro ejemplo:** Es como responder una pregunta de sí o no con la respuesta directa.

### when: el switch moderno

```kotlin
fun tarifa(app: String): Double = when (app) {
    "Uber" -> 1.9
    "99" -> 1.8
    "InDrive", "Otra" -> 1.7
    else -> 2.0
}

val nivel = when {
    ganancia >= 300 -> "excelente"
    ganancia >= 150 -> "bien"
    else -> "flojo"
}
```

`when` no "cae de largo" como el `switch` de JavaScript: no hace falta `break`.

> 🌎 **En la vida real:** es como el selector de una lavadora: cada posición, un programa.

> 🌎 **Otro ejemplo:** Es como la tabla de precios de un estacionamiento por horas.

> 🧩 **Piezas para este ejercicio**
> - Un `when` puede devolver el valor de la primera rama que coincide. Prueba los umbrales de mayor a menor. Para un `when` con argumento, una coma permite que dos valores compartan una rama.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: when que devuelve un valor
lenguaje: kotlin
pide: Completa con `when`. `nivel(ganancia)`: 300 o más → `"excelente"`; 150 o más → `"bien"`; si no, `"flojo"`. `tarifa(app)`: `"Uber"` → 1.9; `"99"` → 1.8; `"InDrive"` u `"Otra"` → 1.7 (en la misma rama, con coma); cualquier otra → 2.0.
--- código
fun nivel(ganancia: Double): String = TODO()

fun tarifa(app: String): Double = TODO()
--- pruebas
prueba("los niveles y sus bordes") { igual(listOf(300.0, 299.9, 150.0, 149.0).map { nivel(it) }, listOf("excelente", "bien", "bien", "flojo")) }
prueba("las tarifas") { igual(listOf("Uber", "99", "InDrive", "Otra", "Taxi").map { tarifa(it) }, listOf(1.9, 1.8, 1.7, 1.7, 2.0)) }
--- solución
fun nivel(ganancia: Double): String = when {
    ganancia >= 300 -> "excelente"
    ganancia >= 150 -> "bien"
    else -> "flojo"
}

fun tarifa(app: String): Double = when (app) {
    "Uber" -> 1.9
    "99" -> 1.8
    "InDrive", "Otra" -> 1.7
    else -> 2.0
}
```

```practica
vf :: En Kotlin, if puede devolver un valor
vf :: En un when de Kotlin hace falta break en cada caso
elige :: ¿Qué devuelve tarifa("InDrive") con el ejemplo? :: 2.0 :: 1.7 :: 1.9
elige :: ¿Qué reemplaza en Kotlin al ternario de JavaScript? :: when :: Un if que devuelve valor :: ?:
escribe :: Escribe un when que diga "cargar" si litros < 10, "medio" si litros < 30 y "lleno" si no. :: val estado = when { litros < 10 -> "cargar"; litros < 30 -> "medio"; else -> "lleno" } (cada rama en su línea)
```

## Parte 3. Rangos y ciclos

> 🌎 **En la vida real:** "del día 1 al 7": un rango tiene principio y fin.

> 🌎 **Otro ejemplo:** Es como los números de una calle del 100 al 200.

### for con rangos y listas

```kotlin
for (dia in 1..7) println("Día $dia")          // 1 a 7, incluido el 7
for (i in 0 until 3) println(i)                // 0, 1, 2 (sin el 3)
for (km in 0..1000 step 250) println(km)       // 0, 250, 500, 750, 1000

val ganancias = listOf(120.0, 95.0, 180.0)
for (g in ganancias) println(g)
for ((i, app) in listOf("Uber", "99").withIndex()) println("${i + 1}. $app")
```

> 🌎 **En la vida real:** `..` es "del 1 al 7, los dos incluidos"; `until` es "hasta antes del 3".

> 🌎 **Otro ejemplo:** Es como contar escalones: incluyes o no el último según la regla.

### while

```kotlin
var ahorro = 0.0
var meses = 0
while (ahorro < 1000) {
    ahorro += 150
    meses++
}
```

> 🌎 **En la vida real:** es como llenar un balde con un vaso: repites mientras no esté lleno.

> 🌎 **Otro ejemplo:** Es como esperar el bus: mientras no llegue, sigues esperando.

> 🧩 **Piezas para este ejercicio**
> - `0..hasta` incluye ambos extremos y `step` cambia el salto. `while` revisa la condición antes de cada vuelta, así que una meta ya alcanzada requiere cero vueltas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Rangos y while
lenguaje: kotlin
pide: Completa `kilometrajes(hasta, paso)`: la lista de 0 hasta `hasta` (incluido), de `paso` en `paso` (pista: `(0..hasta step paso).toList()`). Y `mesesParaAhorrar(meta, porMes)`: con un `while`, cuántos meses ahorrando `porMes` hacen falta para llegar **al menos** a la meta.
--- código
fun kilometrajes(hasta: Int, paso: Int): List<Int> = TODO()

fun mesesParaAhorrar(meta: Double, porMes: Double): Int {
    TODO()
}
--- pruebas
prueba("de 250 en 250") { igual(kilometrajes(1000, 250), listOf(0, 250, 500, 750, 1000)) }
prueba("el último no siempre entra") { igual(kilometrajes(10, 4), listOf(0, 4, 8)) }
prueba("ahorrar 1000 de a 150") { igual(mesesParaAhorrar(1000.0, 150.0), 7) }
prueba("justo en el borde") { igual(mesesParaAhorrar(300.0, 150.0), 2) }
--- solución
fun kilometrajes(hasta: Int, paso: Int): List<Int> = (0..hasta step paso).toList()

fun mesesParaAhorrar(meta: Double, porMes: Double): Int {
    var ahorro = 0.0
    var meses = 0
    while (ahorro < meta) {
        ahorro += porMes
        meses++
    }
    return meses
}
```

```practica
vf :: 1..7 incluye el 7
vf :: 0 until 3 incluye el 3
elige :: ¿Qué da for (km in 0..1000 step 250)? :: 0 y 1000 :: 0, 250, 500, 750, 1000 :: Solo 250
elige :: ¿Cómo tienes el número y el elemento juntos en un for? :: forEach :: withIndex() :: range
escribe :: Escribe un for que muestre los días del 1 al 5. :: for (dia in 1..5) println("Día $dia")
```


**Comprobación antes de seguir**

Predice el resultado con un valor presente y con `null`.

<details>
<summary>Necesito una pista</summary>

Sigue el momento exacto en que se elige el valor alternativo.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es la null safety de Kotlin?":** "En Kotlin un tipo como String nunca puede ser null; si puede serlo, se escribe String?, y el compilador me obliga a revisarlo: con ?. para acceder seguro, con ?: para dar un valor por defecto, o con un if. Evito !! porque si es null la app se cae. Además if y when devuelven valores, y when reemplaza al switch sin break."

> 🌎 **En la vida real:** es como explicar por qué un edificio con detectores de humo en cada cuarto se quema menos.

> 🌎 **Otro ejemplo:** Es como un cinturón de seguridad que no te deja arrancar sin ponértelo.
