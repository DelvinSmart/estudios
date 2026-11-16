# Kotlin 1: primeros pasos

> 🌎 **En la vida real:** si ya hablas español y portugués, el italiano te resulta familiar. Si ya sabes TypeScript, Kotlin te va a sonar muy parecido.

> 🎙️ **El profesor dice:** este es el primer tema del curso **Kotlin**, que tiene su propio certificado. Kotlin es el lenguaje oficial de **Android** (y también se usa en servidores). Hoy: dónde correrlo gratis, `val` y `var`, los tipos, los textos con plantilla y cómo se ve un programa. Todo comparado con TypeScript.

## Parte 1. Dónde correr Kotlin (gratis)

> 🌎 **En la vida real:** puedes practicar en el simulador antes de manejar el carro de verdad.

> 🌎 **Otro ejemplo:** Es como aprender recetas en una cocina de prueba antes de abrir tu restaurante.

### Kotlin Playground

En **https://play.kotlinlang.org** escribes Kotlin en el navegador y lo corres con un botón. Es oficial y gratis: úsalo para todos los ejercicios de las clases 61 a 65.

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

```practica
vf :: El Kotlin Playground permite correr Kotlin en el navegador gratis
vf :: Para hacer apps de Android con Kotlin hace falta pagar Android Studio
elige :: ¿Qué es fun main() en Kotlin? :: Un comentario :: El punto de entrada: lo primero que corre :: Una variable
elige :: ¿Qué es println en JavaScript? :: alert :: console.log :: return
escribe :: Escribe un programa de Kotlin que muestre tu nombre. :: fun main() { println("Delvin") }
```

## Parte 2. val y var

> 🌎 **En la vida real:** `val` es tu fecha de nacimiento; `var` es tu kilometraje.

> 🌎 **Otro ejemplo:** Es como una placa grabada frente a una pizarra.

### Como const y let

```kotlin
val nombre = "Delvin"     // no se puede reasignar (como const)
var viajes = 0            // sí cambia (como let)
viajes += 1
```

Igual que en JavaScript: **usa `val` siempre**, y `var` solo si el valor cambia. No hay `;` al final.

> 🌎 **En la vida real:** es como guardar en la caja fuerte lo que no cambia y en el bolsillo lo que usas todo el día.

> 🌎 **Otro ejemplo:** Es como un contrato firmado frente a una lista de compras.

### Tipos: inferidos o escritos

```kotlin
val ganancia: Double = 250.5   // con tipo escrito (como TypeScript, pero el tipo va después de :)
val total = 117.0              // Kotlin infiere Double
var app: String = "Uber"
// app = 12                     ❌ Type mismatch
```

Kotlin es **estáticamente tipado** como TypeScript, pero aquí los tipos se revisan **siempre** al compilar, no hay forma de "apagarlos".

> 🌎 **En la vida real:** es como las etiquetas de los frascos, pero pegadas con pegamento: no se pueden despegar.

> 🌎 **Otro ejemplo:** Es como el control de seguridad de un aeropuerto: no hay forma de saltarlo.

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

```practica
vf :: En Kotlin, 7 / 2 da 3 porque los dos son Int
vf :: En Kotlin los textos se pueden escribir con comillas simples, igual que en JavaScript
elige :: ¿Cómo metes la variable viajes dentro de un texto? :: "Viajes: {viajes}" :: "Viajes: $viajes" :: 'Viajes: ' + viajes
elige :: ¿Qué tipo usarías para el precio de un litro de combustible? :: Int :: Double :: Char
escribe :: Escribe un println que muestre el rendimiento km/litros con un decimal. :: println("Rendimiento: ${"%.1f".format(km / litros)} km/l")
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué diferencias ves entre Kotlin y TypeScript?":** "Se parecen mucho: val y var son como const y let, el tipo va después del nombre con dos puntos, y hay inferencia. Kotlin separa Int y Double, los String van con comillas dobles y las plantillas usan $. Y en Kotlin los tipos se revisan siempre al compilar, sin forma de apagarlos. Practico en el Kotlin Playground y para Android uso Android Studio."

> 🌎 **En la vida real:** es como comparar dos idiomas primos: mismas raíces, distinta ortografía.

> 🌎 **Otro ejemplo:** Es como pasar del español al portugués: entiendes casi todo desde el primer día.
