# Kotlin 3: funciones, lambdas y colecciones

> 🌎 **En la vida real:** las funciones son las recetas; las colecciones, la despensa. Con buenas recetas y una despensa ordenada, cocinas cualquier cosa.

> 🎙️ **El profesor dice:** hoy: funciones con `fun` (con valores por defecto y argumentos con nombre), funciones de una línea, **lambdas** (las flechas de JavaScript), **funciones de extensión**, y las colecciones con `map`, `filter` y `sumOf`, que ya conoces de JavaScript.

## Parte 1. Funciones

> 🌎 **En la vida real:** una receta con nombre: le das ingredientes y te entrega el plato.

> 🌎 **Otro ejemplo:** Es como un botón programado de una máquina de café.

### fun, parámetros y retorno

```kotlin
fun gananciaNeta(bruto: Double, gastos: Double): Double {
    return bruto - gastos
}

// De una sola expresión, más corta:
fun gananciaNeta2(bruto: Double, gastos: Double) = bruto - gastos

// Valores por defecto y argumentos con nombre:
fun precioViaje(km: Double, tarifaKm: Double = 1.8, minimo: Double = 8.0) = maxOf(km * tarifaKm, minimo)
precioViaje(12.0, tarifaKm = 2.1)
```

Una función que no devuelve nada devuelve `Unit` (como `void`).

> 🌎 **En la vida real:** los argumentos con nombre son como pedir "pizza: grande, sin cebolla".

> 🌎 **Otro ejemplo:** Es como el control del aire: arranca en 23 grados y cambias lo que quieres.

> 🧩 **Piezas para este ejercicio**
> - Un parámetro con `= valor` en la declaración puede omitirse en la llamada. Con argumentos con nombre puedes indicar qué valor estás pasando. `maxOf` elige el mayor de dos números.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Valores por defecto y argumentos con nombre
lenguaje: kotlin
pide: Completa `precioViaje(km, tarifaKm, minimo)`: el precio es `km * tarifaKm`, pero nunca menos que el mínimo (pista: `maxOf`). Fíjate en las pruebas: se llama con menos argumentos (usa los valores por defecto) y con argumentos **con nombre**.
--- código
fun precioViaje(km: Double, tarifaKm: Double = 1.8, minimo: Double = 8.0): Double = TODO()
--- pruebas
prueba("un viaje corto paga el mínimo") { igual(precioViaje(2.0), 8.0) }
prueba("un viaje largo") { igual(precioViaje(10.0), 18.0) }
prueba("con otra tarifa, por su nombre") { igual(precioViaje(10.0, tarifaKm = 2.5), 25.0) }
prueba("con otro mínimo, saltando la tarifa") { igual(precioViaje(1.0, minimo = 5.0), 5.0) }
--- solución
fun precioViaje(km: Double, tarifaKm: Double = 1.8, minimo: Double = 8.0): Double = maxOf(km * tarifaKm, minimo)
```

```practica
vf :: En Kotlin una función se declara con fun
vf :: Unit en Kotlin significa que la función devuelve un número entero
elige :: ¿Qué da precioViaje(3.0) con tarifa 1.8 y mínimo 8.0? :: 5.4 :: 8.0 :: 3.0
elige :: ¿Cómo cambias solo la tarifa al llamar precioViaje? :: precioViaje(12.0, 2.1, 8.0) obligatorio :: precioViaje(12.0, tarifaKm = 2.1) :: precioViaje(tarifaKm)
escribe :: Escribe una función de una línea rendimiento(km, litros) con Double. :: fun rendimiento(km: Double, litros: Double) = km / litros
```

## Parte 2. Lambdas y extensiones

> 🌎 **En la vida real:** una lambda es una nota rápida en un papelito: "ordénalos por precio".

> 🌎 **Otro ejemplo:** Es como una respuesta rápida por mensaje.

### Lambdas

```kotlin
val doble = { n: Int -> n * 2 }        // como (n) => n * 2
doble(4)                                // 8

val viajes = listOf(18.5, 22.0, 9.75)
viajes.filter { it > 10 }               // it = el elemento, cuando hay un solo parámetro
```

Cuando el último parámetro es una lambda, va **fuera de los paréntesis**: `lista.filter { … }`. Lo vas a ver en todo Android (Jetpack Compose está hecho así).

> 🌎 **En la vida real:** `it` es como decir "eso" cuando está claro de qué hablas.

> 🌎 **Otro ejemplo:** Es como pasar una instrucción corta a un ayudante.

### Funciones de extensión

Kotlin te deja "agregar" funciones a tipos que no son tuyos:

```kotlin
fun Double.enReales(): String = "R$ %.2f".format(this)
250.5.enReales()       // "R$ 250,50" o "R$ 250.50" según el idioma del aparato
```

> 🌎 **En la vida real:** es como ponerle un accesorio a una herramienta que ya tenías.

> 🌎 **Otro ejemplo:** Es como agregar un botón de atajo a tu celular.

> 🧩 **Piezas para este ejercicio**
> - Una lambda es una función escrita entre llaves. En una extensión, `this` es el valor sobre el que llamaste el método. Dentro de `filter`, `it` es el elemento que se está comprobando.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lambdas y funciones de extensión
lenguaje: kotlin
pide: Completa tres cosas. `doble`: una lambda que recibe un `Int` y devuelve el doble. `List<Double>.mayoresQue(minimo)`: una extensión que devuelve los valores mayores que el mínimo (con `filter` e `it`). `Double.enReales()`: una extensión que devuelve `"R$ 250,50"` para `250.5` (pista: `"%.2f".format(java.util.Locale.US, this)` da `"250.50"`; después cambia el punto por coma).
--- código
val doble: (Int) -> Int = { n -> TODO() }

fun List<Double>.mayoresQue(minimo: Double): List<Double> = TODO()

fun Double.enReales(): String = TODO()
--- pruebas
prueba("la lambda") { igual(doble(4), 8) }
prueba("la extensión de la lista") { igual(listOf(18.5, 22.0, 9.75).mayoresQue(10.0), listOf(18.5, 22.0)) }
prueba("la extensión del número") { igual(250.5.enReales(), "R$ 250,50") }
prueba("con centavos") { igual(9.75.enReales(), "R$ 9,75") }
--- solución
val doble: (Int) -> Int = { n -> n * 2 }

fun List<Double>.mayoresQue(minimo: Double): List<Double> = filter { it > minimo }

fun Double.enReales(): String = "R$ " + "%.2f".format(java.util.Locale.US, this).replace('.', ',')
```

```practica
vf :: En Kotlin, it es el nombre del parámetro cuando la lambda tiene uno solo
vf :: Una función de extensión cambia el código original del tipo
elige :: ¿Qué es { n: Int -> n * 2 } en JavaScript? :: function n * 2 :: (n) => n * 2 :: n => {2}
elige :: ¿Dónde va la lambda cuando es el último parámetro? :: Siempre dentro de los paréntesis :: Fuera de los paréntesis :: En otra línea obligatoria
escribe :: Escribe una función de extensión Int.esPar(). :: fun Int.esPar() = this % 2 == 0
```

## Parte 3. Colecciones

> 🌎 **En la vida real:** listas, conjuntos y mapas: la fila, la bolsa sin repetidos y el archivador.

> 🌎 **Otro ejemplo:** Es como estantes, bolsas y fichas en una oficina.

### De solo lectura y modificables

```kotlin
val apps = listOf("Uber", "99")                      // no se puede agregar
val gastos = mutableListOf(150.0, 30.0)              // sí se puede
gastos.add(12.5)
val unicas = setOf("Uber", "99", "Uber")             // {Uber, 99}
val carro = mapOf("marca" to "Toyota", "km" to 85000)
carro["marca"]                                        // "Toyota"
```

Kotlin separa lo que **se puede cambiar** (`mutable…`) de lo que no: el mismo cuidado que React con no cambiar los arrays.

> 🌎 **En la vida real:** es como un menú impreso (no se cambia) frente a una pizarra de especiales.

> 🌎 **Otro ejemplo:** Es como un contrato firmado frente a un borrador.

### map, filter, sumOf y groupBy

```kotlin
data class Viaje(val app: String, val valor: Double)
val viajes = listOf(Viaje("Uber", 32.5), Viaje("99", 18.0), Viaje("Uber", 45.0))

val total = viajes.sumOf { it.valor }                          // 95.5
val deUber = viajes.filter { it.app == "Uber" }
val valores = viajes.map { it.valor }
val porApp = viajes.groupBy { it.app }.mapValues { (_, v) -> v.sumOf { it.valor } }   // {Uber=77.5, 99=18.0}
val caro = viajes.firstOrNull { it.valor > 40 }
```

> 🌎 **En la vida real:** son las mismas herramientas de la cocina que ya usabas (clase 48), con otro mango.

> 🌎 **Otro ejemplo:** Es como el cierre de caja: filtrar, sumar y agrupar.

> 🧩 **Piezas para este ejercicio**
> - `groupBy` forma un mapa de clave a lista. `mapValues` deja las claves y transforma sus listas en totales. `firstOrNull { ... }` se queda con el primer viaje que cumple o devuelve `null`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: groupBy, sumOf y firstOrNull
lenguaje: kotlin
pide: Con la `data class Viaje` que ya está, completa `totalPorApp(viajes)`: un mapa con cuánto se ganó en cada app (pista: `groupBy { it.app }` y después `mapValues { (_, lista) -> lista.sumOf { it.valor } }`). Y `primeroCaro(viajes, minimo)`: el primer viaje que vale **más** que el mínimo, o null.
--- código
data class Viaje(val app: String, val valor: Double)

fun totalPorApp(viajes: List<Viaje>): Map<String, Double> = TODO()

fun primeroCaro(viajes: List<Viaje>, minimo: Double): Viaje? = TODO()
--- pruebas
val viajes = listOf(Viaje("Uber", 32.5), Viaje("99", 18.0), Viaje("Uber", 45.0))
prueba("el total por app") { igual(totalPorApp(viajes), mapOf("Uber" to 77.5, "99" to 18.0)) }
prueba("sin viajes, un mapa vacío") { igual(totalPorApp(listOf()), mapOf<String, Double>()) }
prueba("el primero caro") { igual(primeroCaro(viajes, 40.0), Viaje("Uber", 45.0)) }
prueba("ninguno tan caro") { igual(primeroCaro(viajes, 100.0), null) }
--- solución
data class Viaje(val app: String, val valor: Double)

fun totalPorApp(viajes: List<Viaje>): Map<String, Double> =
    viajes.groupBy { it.app }.mapValues { (_, lista) -> lista.sumOf { it.valor } }

fun primeroCaro(viajes: List<Viaje>, minimo: Double): Viaje? = viajes.firstOrNull { it.valor > minimo }
```

```practica
vf :: listOf crea una lista que no se puede modificar
vf :: En Kotlin, == compara si dos textos tienen el mismo contenido
elige :: ¿Qué método suma un campo de todos los elementos? :: map :: sumOf :: setOf
elige :: ¿Qué devuelve firstOrNull si nada cumple la condición? :: Un error :: null :: 0
escribe :: Escribe cómo obtener los viajes de 99 con valor mayor que 20. :: viajes.filter { it.app == "99" && it.valor > 20 }
```


**Comprobación antes de seguir**

Agrupa tres gastos de ejemplo y suma cada grupo a mano antes de correr el código.

<details>
<summary>Necesito una pista</summary>

Mira la colección intermedia que devuelve `groupBy`.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con colecciones en Kotlin?":** "Prefiero las colecciones de solo lectura (listOf, mapOf) y uso mutable solo cuando hace falta cambiar algo. Uso map, filter, sumOf, groupBy y firstOrNull con lambdas, que van fuera de los paréntesis y usan it. Escribo funciones con valores por defecto y argumentos con nombre, y funciones de extensión cuando agregan claridad, como formatear reales."

> 🌎 **En la vida real:** es como explicar cómo organizas la despensa y qué herramientas usas para cocinar rápido.

> 🌎 **Otro ejemplo:** Es como un mecánico mostrando su juego de llaves favorito.
