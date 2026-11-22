# Swift 1: primeros pasos

> 🌎 **En la vida real:** si ya hablas español, el portugués te resulta familiar; si ya sabes Kotlin y TypeScript, Swift te va a sonar casi conocido. Los tres son primos.

> 🎙️ **El profesor dice:** {{alumno}}, este es el primer tema del curso **Swift**, que tiene su propio certificado. Swift es el lenguaje de Apple: con él se hacen las apps del **iPhone**, del iPad, del Mac y del reloj. Hoy: dónde correrlo gratis, `let` y `var`, y los tipos y los textos.

## Parte 1. Dónde correr Swift (gratis)

> 🌎 **En la vida real:** antes de manejar en la autopista, practicas en una calle tranquila. Aquí hay dos calles: una en el navegador y otra en tu Mac.

> 🌎 **Otro ejemplo:** Es como probar una receta en porciones chicas antes de cocinar para toda la familia.

### En esta página: Compiler Explorer

Los ejercicios de este curso corren **desde esta página**. Cuando tocas **▶ probar**, tu código viaja a **Compiler Explorer** (godbolt.org), un sitio gratuito que lo compila con **el mismo Swift que trae Xcode**, lo corre en sus servidores y devuelve lo que imprimió. La primera vez del día puede tardar unos 10 segundos; después, unos pocos.

```swift
print("Hola, conductor")
```

En Swift, un archivo se corre **de arriba abajo**: no hace falta un `main` como en Kotlin. `print` es como `console.log` o `println`.

> 🌎 **En la vida real:** es como leer una carta: empiezas por la primera línea y sigues hasta la firma.

### En tu Mac: Xcode

Para las apps del iPhone (desde la clase 102) se usa **Xcode**: gratis, desde la App Store de la Mac. Trae el **simulador del iPhone**: no necesitas un iPhone para empezar. Y tiene los **Playgrounds** (*File → New → Playground*): una hoja donde escribes Swift y ves el resultado al lado de cada línea, al instante.

> 📌 **Nota:** Xcode solo existe para Mac. Si un día no tienes una Mac a mano, los ejercicios de esta página siguen funcionando desde cualquier computadora o teléfono.

### Dónde está Swift en lo que ya conoces

Copiloto es una app de **React Native** (TypeScript), pero algunas cosas solo las puede hacer el iPhone **por dentro**: leer la pantalla compartida, sacar el texto de una imagen, mostrar una notificación con botones. Para eso tiene un **módulo nativo**, escrito en Swift, que la parte de TypeScript llama como si fuera una función más. En Android, ese mismo módulo está escrito en Kotlin. Lo vas a ver en la clase 106.

### Antes del ejercicio: cómo se lee una función en Swift

Una función es como una licuadora: **recibe** algo, hace su trabajo y **devuelve** un resultado. En Swift se escribe así:

```swift
func saludo(_ nombre: String) -> String {
    return "Hola, \(nombre)"
}

print(saludo("Delvin"))   // muestra Hola, Delvin
```

| Pieza | Qué significa |
|---|---|
| `func` | «Voy a crear una función». |
| `saludo` | El **nombre** de la función. |
| `nombre: String` | Lo que **recibe**: una cajita llamada `nombre` que guarda texto. `String` significa **texto**. |
| `_` | Permite usarla sin escribir la etiqueta: `saludo("Delvin")`. Sin `_` sería `saludo(nombre: "Delvin")`. |
| `-> String` | La flecha dice qué **devuelve**. Aquí, un texto. |
| `{ }` | Entre las llaves va el **trabajo** de la función. |
| `return` | **Entrega** el resultado. |
| `\(nombre)` | Mete el valor de `nombre` dentro del texto. |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primer programa en Swift
lenguaje: swift
pide: Completa dos funciones. `saludo(_ nombre:)` devuelve `"Hola, Delvin"` para `"Delvin"`. `presentacion(nombre:app:)` devuelve `"Soy Delvin y manejo en Uber"`. Cambia cada `return ""` por tu código. Para meter un valor dentro de un texto, Swift usa `\(valor)`: `"Hola, \(nombre)"`. Puedes usar `print()` para mirar valores: sale debajo de las pruebas.
--- código
func saludo(_ nombre: String) -> String {
    return "" // tu código aquí
}

func presentacion(nombre: String, app: String) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("el saludo") { igual(saludo("Delvin"), "Hola, Delvin") }
prueba("otro nombre") { igual(saludo("Ana"), "Hola, Ana") }
prueba("la presentación") { igual(presentacion(nombre: "Delvin", app: "Uber"), "Soy Delvin y manejo en Uber") }
--- solución
func saludo(_ nombre: String) -> String {
    return "Hola, \(nombre)"
}

func presentacion(nombre: String, app: String) -> String {
    return "Soy \(nombre) y manejo en \(app)"
}
```

```practica
vf :: Los ejercicios de Swift de esta página corren en Compiler Explorer, con el mismo Swift que trae Xcode
vf :: Para correr Swift hace falta escribir una función main, como en Kotlin
elige :: ¿Para qué sirve Xcode? :: Para correr los ejercicios de esta página :: Para hacer las apps del iPhone, con el simulador y los Playgrounds :: Para escribir Kotlin
escribe :: ¿Por qué Copiloto, que es de React Native, tiene código en Swift? :: Porque algunas cosas solo las puede hacer el iPhone por dentro (leer la pantalla compartida, sacar texto de una imagen, notificaciones): para eso tiene un módulo nativo en Swift que TypeScript llama como una función más.
```

## Parte 2. let y var

> 🌎 **En la vida real:** `let` es tu fecha de nacimiento: se escribe una vez y no cambia. `var` es el saldo de tu cuenta: cambia todos los días.

> 🌎 **Otro ejemplo:** Es como la placa del carro (`let`) y el kilometraje (`var`).

```swift
let nombre = "Delvin"     // no cambia
var ganancia = 0.0        // cambia
ganancia = ganancia + 18.5
ganancia += 12            // lo mismo, más corto
```

Es exactamente el `val` y `var` de Kotlin, o el `const` y `let` de TypeScript, **con otros nombres**. Ojo con la trampa: en TypeScript `let` es el que **cambia**; en Swift, `let` es el que **no** cambia.

| No cambia | Cambia | Lenguaje |
|---|---|---|
| `const` | `let` | TypeScript |
| `val` | `var` | Kotlin |
| `let` | `var` | Swift |

**Usa `let` siempre que puedas.** Si después necesitas cambiarlo, Swift te avisa con un error claro, y lo cambias a `var`. Al revés no avisa: un `var` que nunca cambia es un aviso amarillo ("variable was never mutated; consider changing to let"), porque Swift prefiere que digas que no va a cambiar.

```swift
let placa = "ABC1D23"
placa = "XYZ9K87"   // ✗ error: cannot assign to value: 'placa' is a 'let' constant
```

> 💡 **Idea:** en este curso, cuando Swift te diga un error en inglés, la página te lo explica en español debajo, y te deja el original (es el que vas a buscar en internet).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Sumar la ganancia del día
lenguaje: swift
pide: Completa `gananciaDelDia(_ viajes:)`: recibe una lista con lo que ganaste en cada viaje y devuelve la suma. Empieza con `var total = 0.0` y súmale cada viaje con un `for viaje in viajes`. Después completa `promedio(_ viajes:)`, que divide el total entre la cantidad (`Double(viajes.count)`); si la lista está vacía, devuelve `0`.
--- código
func gananciaDelDia(_ viajes: [Double]) -> Double {
    return 0 // tu código aquí
}

func promedio(_ viajes: [Double]) -> Double {
    return -1 // tu código aquí
}
--- pruebas
prueba("la suma del día") { igual(gananciaDelDia([18.5, 12, 25]), 55.5) }
prueba("sin viajes, 0") { igual(gananciaDelDia([]), 0) }
prueba("el promedio") { igual(promedio([10, 20, 30]), 20) }
prueba("el promedio sin viajes") { igual(promedio([]), 0) }
--- solución
func gananciaDelDia(_ viajes: [Double]) -> Double {
    var total = 0.0
    for viaje in viajes {
        total += viaje
    }
    return total
}

func promedio(_ viajes: [Double]) -> Double {
    if viajes.isEmpty { return 0 }
    return gananciaDelDia(viajes) / Double(viajes.count)
}
```

```practica
vf :: En Swift, let es para lo que no cambia y var para lo que cambia
vf :: En Swift conviene usar var siempre, por si después hace falta cambiarlo
elige :: ¿Qué pasa si intentas cambiar un let en Swift? :: Cambia sin problema :: No compila: "cannot assign to value: … is a 'let' constant" :: Se convierte en var
escribe :: Una persona sabe TypeScript. ¿Qué le dirías sobre let en Swift? :: Que en Swift let es lo que en TypeScript es const: no cambia. Lo que cambia es var.
```

## Parte 3. Tipos y textos

> 🌎 **En la vida real:** cada caja de la mudanza tiene una etiqueta ("platos", "libros"). Si la etiqueta dice "platos", no metes zapatos.

> 🌎 **Otro ejemplo:** Es como los casilleros de un correo: cada uno recibe solo un tipo de cosa.

Swift tiene **tipos**, como TypeScript y Kotlin. Casi siempre los **adivina** solo (se llama *inferencia*):

```swift
let viajes = 12          // Int: número entero
let ganancia = 117.5     // Double: número con decimales
let app = "Uber"         // String: texto
let activo = true        // Bool: sí o no
```

Si quieres, se escriben con dos puntos: `let viajes: Int = 12`. Hace falta cuando Swift no puede adivinar, por ejemplo una lista vacía: `var gastos: [Double] = []`.

**Swift no mezcla tipos solo.** En JavaScript, `12 * 2.5` funciona; en Swift, un `Int` por un `Double` **no compila**. Hay que convertir a propósito:

```swift
let viajes = 12
let porViaje = 9.75
let total = Double(viajes) * porViaje   // 117.0: el Int se convierte a Double primero
```

Parece molesto, pero evita errores escondidos: así nunca se pierden decimales sin que te des cuenta.

**Textos con valores** (interpolación), con `\( )`:

```swift
let resumen = "\(viajes) viajes, R$ \(total)"   // "12 viajes, R$ 117.0"
```

| Texto con valores | Lenguaje |
|---|---|
| `` `${viajes} viajes` `` | TypeScript |
| `"$viajes viajes"` | Kotlin |
| `"\(viajes) viajes"` | Swift |

**Y un texto a número**, que puede salir mal: `Int("12")` da `12`, pero `Int("doce")` no puede. Por eso `Int("…")` no devuelve un `Int`, sino un **`Int?`**: un número **o nada** (`nil`). Es la puerta a la clase 98, y la idea más importante de Swift.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Mezclar Int y Double, a propósito
lenguaje: swift
pide: Completa `totalDelDia(viajes:porViaje:)`: multiplica la cantidad de viajes (un `Int`) por lo que se gana en cada uno (un `Double`). Swift no los mezcla solo: convierte el `Int` con `Double(…)`. Después `resumen(viajes:total:)`, que devuelve un texto como `"12 viajes: R$ 117.0"` con `\( )`.
--- código
func totalDelDia(viajes: Int, porViaje: Double) -> Double {
    return 0 // tu código aquí
}

func resumen(viajes: Int, total: Double) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("12 viajes a 9,75") { igual(totalDelDia(viajes: 12, porViaje: 9.75), 117.0) }
prueba("sin viajes") { igual(totalDelDia(viajes: 0, porViaje: 9.75), 0) }
prueba("el resumen") { igual(resumen(viajes: 12, total: 117.0), "12 viajes: R$ 117.0") }
--- solución
func totalDelDia(viajes: Int, porViaje: Double) -> Double {
    return Double(viajes) * porViaje
}

func resumen(viajes: Int, total: Double) -> String {
    return "\(viajes) viajes: R$ \(total)"
}
```

```practica
vf :: En Swift, multiplicar un Int por un Double no compila: hay que convertir uno a propósito
vf :: Para meter un valor en un texto, Swift usa ${valor}, como TypeScript
elige :: ¿Qué devuelve Int("doce")? :: 0 :: nil, porque Int("…") devuelve un Int? (un número o nada) :: Un error que cierra la app
escribe :: ¿Cuándo hace falta escribir el tipo, como en var gastos: [Double] = []? :: Cuando Swift no lo puede adivinar solo, como en una lista vacía: no sabe de qué va a ser la lista.
```


**Comprobación antes de seguir**

Antes de ejecutar, usa código de práctica y comprueba qué ocurre con un error de sintaxis.

<details>
<summary>Necesito una pista</summary>

El botón Probar envía el código del ejercicio a Compiler Explorer. Si el servicio falla, vuelve a intentar o prueba el ejemplo en Swift local.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué sabes de Swift?":** "Es el lenguaje de Apple para iPhone, iPad, Mac y el reloj. Se parece mucho a Kotlin: `let` para lo que no cambia y `var` para lo que cambia, tipos que el compilador adivina, y no mezcla `Int` con `Double` sin que lo pidas. Lo más importante es que los valores que pueden faltar se marcan con `?`, y el compilador te obliga a revisarlos. Lo practiqué en Compiler Explorer y en Xcode, y entiendo cómo una app de React Native usa un módulo nativo en Swift para lo que solo el iPhone puede hacer."

> 🌎 **En la vida real:** es como contar que aprendiste a manejar un carro nuevo: qué se parece al que ya manejabas y qué cambia.

> 🌎 **Otro ejemplo:** Es como presentarte en un idioma nuevo: dices lo básico bien, y sabes qué palabras se parecen a las que ya conoces.
