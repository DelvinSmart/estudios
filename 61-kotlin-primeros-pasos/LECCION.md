# Kotlin 1: primeros pasos

> 🌎 **En la vida real:** si ya hablas español y portugués, el italiano te resulta familiar. Si ya sabes TypeScript, Kotlin te va a sonar muy parecido.

> 🎙️ **El profesor dice:** este es el primer tema del curso **Kotlin**, que tiene su propio certificado. Kotlin es el lenguaje oficial de **Android** (y también se usa en servidores). Hoy: dónde correrlo gratis, `val` y `var`, los tipos, los textos con plantilla y cómo se ve un programa. Todo comparado con TypeScript.

## Parte 1. Dónde correr Kotlin (gratis)

> 🌎 **En la vida real:** puedes practicar en el simulador antes de manejar el carro de verdad.

> 🌎 **Otro ejemplo:** Es como aprender recetas en una cocina de prueba antes de abrir tu restaurante.

### Kotlin Playground

En **https://play.kotlinlang.org** escribes Kotlin en el navegador y lo corres con un botón. Es oficial y gratis, y es el que usan los ejercicios de este curso: cuando tocas **▶ probar**, tu código viaja a ese mismo Playground, se compila y se corre allá, y las pruebas se leen de lo que imprime. Por eso tarda unos segundos y necesita internet. Úsalo también por tu cuenta para probar ideas sueltas.

```kotlin
fun main() {
    println("Hola, conductor")
}
```

`fun main()` es el punto de entrada: lo primero que corre. `println` es como `console.log`.

> 🌎 **En la vida real:** `main` es la puerta principal de la casa: por ahí se entra.

> 🌎 **Otro ejemplo:** Es como el primer paso de una receta: "precalentar el horno".

### Android Studio

Para apps de Android (clases 66 y 67) se usa **Android Studio**, gratis, para Mac, Windows y Linux. Trae el emulador de Android: no necesitas un teléfono Android para empezar.

> 🌎 **En la vida real:** es el taller completo, con todas las herramientas y un carro de prueba.

> 🌎 **Otro ejemplo:** Es como pasar del simulador a la pista de entrenamiento.

> 🧩 **Piezas para este ejercicio**
> - `fun` declara una función. El valor que sigue a `return` es lo que recibe quien la llama. En una cadena, `$nombre` inserta el valor del parámetro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primer programa en Kotlin
lenguaje: kotlin
pide: Completa dos funciones. `saludo(nombre)` devuelve `"Hola, Delvin"` para `"Delvin"`. `presentacion(nombre, app)` devuelve `"Soy Delvin y manejo en Uber"`. Cambia cada `TODO()` por tu código (no escribas `fun main`: la pone el mapa). Puedes usar `println` para mirar valores: sale debajo de las pruebas.
--- código
fun saludo(nombre: String): String {
    return TODO()
}

fun presentacion(nombre: String, app: String): String = TODO()
--- pruebas
prueba("el saludo") { igual(saludo("Delvin"), "Hola, Delvin") }
prueba("otro nombre") { igual(saludo("Ana"), "Hola, Ana") }
prueba("la presentación") { igual(presentacion("Delvin", "Uber"), "Soy Delvin y manejo en Uber") }
--- solución
fun saludo(nombre: String): String {
    return "Hola, $nombre"
}

fun presentacion(nombre: String, app: String): String = "Soy $nombre y manejo en $app"
```

```practica
vf :: El Kotlin Playground permite correr Kotlin en el navegador gratis
vf :: Para hacer apps de Android con Kotlin hace falta pagar Android Studio
elige :: ¿Qué es fun main() en Kotlin? :: Un comentario :: El punto de entrada: lo primero que corre :: Una variable
elige :: ¿Qué instrucción de JavaScript se parece a println de Kotlin? :: alert :: console.log :: return
escribe :: Escribe un programa de Kotlin que muestre tu nombre. :: fun main() { println("Delvin") }
```

## Parte 2. val y var

> 🌎 **En la vida real:** `val` es el total escrito en el recibo de una carga de combustible. En la próxima carga hay **otro recibo**. `var` es el kilometraje del carro: lo vas actualizando.

> 🌎 **Otro ejemplo:** Es como una etiqueta pegada a una caja (`val`) frente a una pizarra que borras y vuelves a escribir (`var`). La etiqueta no cambia de caja, pero lo que hay dentro de la caja sí podría cambiar.

### Como const y let

```kotlin
val nombre = "Delvin"     // no se puede reasignar (como const)
var viajes = 0            // sí se puede reasignar (como let)
viajes += 1
```

**Reasignar** es darle otro valor a un nombre que ya existe. Empieza con `val`, y usa `var` solo si tienes que reasignar ese nombre. No hay `;` al final.

### Qué es lo que `val` no deja cambiar

`val` no deja **reasignar el nombre**. No significa que el dato sea igual para siempre:

- Si editas el código y lo ejecutas otra vez, puede empezar con otro valor.
- Si una función se usa otra vez, crea sus propios `val`.
- Si un `val` guarda una lista **mutable** (una lista que se puede modificar), la lista puede crecer.

```kotlin
val textos = ArrayList<String>()
textos.add("R$ 18,50")      // ✅ la lista crece
// textos = ArrayList()     // ❌ 'val' cannot be reassigned
```

Copiloto hace esto al leer una oferta en Android: `val texts = ArrayList<String>(64)`. El nombre `texts` sigue con la misma lista, y la lista se va llenando.

**Los parámetros de una función también son de solo lectura.** Si necesitas un valor que vaya cambiando, créalo con `var`:

```kotlin
fun conPropina(valorDelViaje: Double, propina: Double): Double {
    // valorDelViaje += propina   // ❌ 'val' cannot be reassigned
    var total = valorDelViaje
    total += propina
    return total
}
```

En el código de Android también vas a ver **`const val`**, como `const val FILE = "ride_overlay_prefs"`. Es un valor fijo que ya se conoce al compilar. Un `val` normal puede calcularse mientras el programa corre.

### Tipos: inferidos o escritos

```kotlin
val ganancia: Double = 250.5   // con tipo escrito (como TypeScript, pero el tipo va después de :)
val total = 117.0              // Kotlin infiere Double
var app: String = "Uber"
// app = 12                     ❌ Type mismatch
```

Kotlin es **estáticamente tipado** como TypeScript, pero aquí el compilador revisa los tipos **siempre**. Si fuerzas una conversión con `as`, el código puede compilar y el error aparece mientras corre:

```kotlin
val dato: Any = "Uber"      // Any acepta cualquier tipo
val numero = dato as Int    // compila, pero al correr da ClassCastException
```

> 🌎 **En la vida real:** es como las etiquetas de los frascos: alguien las revisa antes de guardarlos. Si le juras que un frasco es de sal, puede dejarlo pasar.

> 🌎 **Otro ejemplo:** Es como el control de un aeropuerto: revisa a todos, pero un documento falso (`as`) puede causar el problema más adelante.

> 🧩 **Piezas para este ejercicio**
> - `val` no deja reasignar el nombre y `var` sí. El total necesita recibir otro valor después de cada recorrido.
> - En `for (r in recorridos)`, cada vuelta tiene su propia `r` con una distancia. Dentro de esa vuelta, `r` es de solo lectura.
> - `kmInicial` es un parámetro, así que tampoco se puede reasignar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: val para lo que no se reasigna, var para lo que sí
lenguaje: kotlin
pide: Completa `kmAlFinal(kmInicial, recorridos)`: empieza con el kilometraje del carro y le suma cada recorrido de la lista. Usa un `var` para el total que va cambiando (y `val` para todo lo demás). Pista: `for (r in recorridos) { … }`.
--- código
fun kmAlFinal(kmInicial: Int, recorridos: List<Int>): Int {
    TODO()
}
--- pruebas
prueba("un día de trabajo") { igual(kmAlFinal(84800, listOf(120, 85, 115)), 85120) }
prueba("sin recorridos, el mismo") { igual(kmAlFinal(84800, listOf()), 84800) }
--- solución
fun kmAlFinal(kmInicial: Int, recorridos: List<Int>): Int {
    var km = kmInicial
    for (r in recorridos) {
        km += r
    }
    return km
}
```

```practica
vf :: val en Kotlin es como const en JavaScript
vf :: En Kotlin cada línea tiene que terminar con punto y coma
elige :: ¿Qué pasa con var app: String = "Uber" y después app = 12? :: Funciona :: Error de tipos al compilar :: app vale "12"
elige :: ¿Dónde va el tipo en val ganancia: Double? :: Antes del nombre :: Después del nombre, con dos puntos :: No se puede escribir
escribe :: Crea una variable para los viajes del día que empiece en 0 y súmale 1. :: var viajes = 0 y en la siguiente línea viajes += 1
```

## Parte 3. Tipos y textos

> 🌎 **En la vida real:** en un formulario hay casillas de número, de texto y de sí o no.

> 🌎 **Otro ejemplo:** Es como los distintos recipientes de una cocina.

### Los tipos básicos

| Kotlin | TypeScript | Ejemplo |
|---|---|---|
| `Int` | `number` (entero) | `12` |
| `Double` | `number` (decimal) | `9.75` |
| `String` | `string` | `"Uber"` (siempre comillas dobles) |
| `Boolean` | `boolean` | `true`, `false` |
| `Char` | — | `'A'` (una sola letra, comillas simples) |

Como Python, Kotlin separa enteros (`Int`) y decimales (`Double`): `7 / 2` da `3` (división entera), `7.0 / 2` da `3.5`.

> 🌎 **En la vida real:** `Int` son pasajeros (no hay medio pasajero); `Double` es combustible.

> 🌎 **Otro ejemplo:** Es como contar manzanas y pesar azúcar.

### Plantillas de texto

```kotlin
val viajes = 12
val ganancia = 250.5
println("Hoy hice $viajes viajes y gané R$ ${"%.2f".format(ganancia)}")
println("El nombre tiene ${nombre.length} letras")
```

`$variable` para algo simple, `${expresión}` para algo más largo. En JavaScript era `` `${…}` ``.

> 🌎 **En la vida real:** es como la carta modelo con huecos.

> 🌎 **Otro ejemplo:** Es como el cartel del bus que cambia el destino.

> 🧩 **Piezas para este ejercicio**
> - Convierte uno de los números antes de dividir para conservar la parte decimal. `$nombre` inserta una variable en una plantilla y `${expresion}` inserta el resultado de una expresión.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Int, Double y las plantillas de texto
lenguaje: kotlin
pide: Completa `promedioPorViaje(ganancia, viajes)`: los dos son `Int`, pero el promedio tiene decimales. Ojo: `7 / 2` da `3` en Kotlin (división entera); convierte antes con `.toDouble()`. Y `resumen(viajes, ganancia)` devuelve `"Hoy hice 12 viajes y gané R$ 250.5"` usando una plantilla con `$`.
--- código
fun promedioPorViaje(ganancia: Int, viajes: Int): Double {
    TODO()
}

fun resumen(viajes: Int, ganancia: Double): String = TODO()
--- pruebas
prueba("con decimales, no división entera") { igual(promedioPorViaje(7, 2), 3.5) }
prueba("un promedio exacto") { igual(promedioPorViaje(250, 10), 25.0) }
prueba("el resumen") { igual(resumen(12, 250.5), "Hoy hice 12 viajes y gané R$ 250.5") }
--- solución
fun promedioPorViaje(ganancia: Int, viajes: Int): Double {
    return ganancia.toDouble() / viajes
}

fun resumen(viajes: Int, ganancia: Double): String = "Hoy hice $viajes viajes y gané R$ $ganancia"
```

```practica
vf :: En Kotlin, 7 / 2 da 3 porque los dos son Int
vf :: En Kotlin los textos se pueden escribir con comillas simples, igual que en JavaScript
elige :: ¿Cómo metes la variable viajes dentro de un texto? :: "Viajes: {viajes}" :: "Viajes: $viajes" :: 'Viajes: ' + viajes
elige :: ¿Qué tipo usarías para el precio de un litro de combustible? :: Int :: Double :: Char
escribe :: Escribe un println que muestre el rendimiento km/litros con un decimal. :: println("Rendimiento: ${"%.1f".format(km / litros)} km/l")
```


**Comprobación antes de seguir**

Distingue entre un mensaje del compilador y una prueba que recibió otro resultado. Hazlo en el último ejercicio:

1. Quita una comilla de tu código y toca **▶ probar**. Eso es un **error del compilador**: el programa no llega a correr.
2. Devuelve la comilla. Cambia tu `return` para que entregue un número equivocado y toca **▶ probar**. El programa corre, pero **la prueba falla**.
3. Deja tu código como estaba.

<details>
<summary>Necesito una pista</summary>

Si llega un resultado, el programa ya compiló. Compara el valor esperado con el recibido.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué diferencias ves entre Kotlin y TypeScript?":** "Se parecen mucho: val y var son como const y let, el tipo va después del nombre con dos puntos, y hay inferencia. Kotlin separa Int y Double, los String van con comillas dobles y las plantillas usan $. Y en Kotlin el compilador siempre revisa los tipos. Una conversión forzada con as todavía puede fallar al correr. Practico en el Kotlin Playground y para Android uso Android Studio."

> 🌎 **En la vida real:** es como comparar dos idiomas primos: mismas raíces, distinta ortografía.

> 🌎 **Otro ejemplo:** Es como pasar del español al portugués: entiendes casi todo desde el primer día.
