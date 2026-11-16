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

```practica
vf :: 1..7 incluye el 7
vf :: 0 until 3 incluye el 3
elige :: ¿Qué da for (km in 0..1000 step 250)? :: 0 y 1000 :: 0, 250, 500, 750, 1000 :: Solo 250
elige :: ¿Cómo tienes el número y el elemento juntos en un for? :: forEach :: withIndex() :: range
escribe :: Escribe un for que muestre los días del 1 al 5. :: for (dia in 1..5) println("Día $dia")
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es la null safety de Kotlin?":** "En Kotlin un tipo como String nunca puede ser null; si puede serlo, se escribe String?, y el compilador me obliga a revisarlo: con ?. para acceder seguro, con ?: para dar un valor por defecto, o con un if. Evito !! porque si es null la app se cae. Además if y when devuelven valores, y when reemplaza al switch sin break."

> 🌎 **En la vida real:** es como explicar por qué un edificio con detectores de humo en cada cuarto se quema menos.

> 🌎 **Otro ejemplo:** Es como un cinturón de seguridad que no te deja arrancar sin ponértelo.
