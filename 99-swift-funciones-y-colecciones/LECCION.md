# Swift 3: funciones, closures y colecciones

> 🌎 **En la vida real:** una receta tiene un nombre ("arroz con pollo"), dice qué ingredientes lleva y qué sale al final. Una función es eso: un nombre, lo que recibe y lo que devuelve.

> 🎙️ **El profesor dice:** {{alumno}}, hoy tres cosas que vas a usar en cada línea de una app de iPhone: las funciones de Swift (que tienen algo que ningún otro lenguaje del curso tiene: **las etiquetas**), las closures (funciones sin nombre) y las colecciones con `map`, `filter` y `reduce`.

## Parte 1. Funciones con etiquetas

> 🌎 **En la vida real:** en un formulario no escribes "Delvin, 1990, Lima" suelto: cada dato va al lado de su etiqueta ("Nombre:", "Año:", "Ciudad:"). Así nadie confunde el año con la ciudad.

> 🌎 **Otro ejemplo:** Es como las teclas de un control remoto con su dibujo: sabes cuál es el volumen sin probarlas todas.

En Swift, cada dato de una función tiene una **etiqueta** que se escribe **al llamarla**:

```swift
func ganancia(viajes: Int, porViaje: Double) -> Double {
    Double(viajes) * porViaje
}

ganancia(viajes: 12, porViaje: 9.75)   // se lee como una frase
```

Compara con TypeScript: `ganancia(12, 9.75)`. ¿Cuál es cuál? Tienes que ir a mirar la función. En Swift, la llamada **se explica sola**.

**Dos nombres para un dato.** La etiqueta de afuera y el nombre de adentro pueden ser distintos, para que la llamada se lea mejor:

```swift
func mover(de origen: String, a destino: String) -> String {
    "Viaje de \(origen) a \(destino)"      // adentro se usan origen y destino
}
mover(de: "Centro", a: "Aeropuerto")       // afuera se lee "mover de… a…"
```

**Sin etiqueta: `_`.** Cuando la etiqueta no agrega nada (`saludo(nombre: "Ana")` dice lo mismo que `saludo("Ana")`), se pone `_`:

```swift
func saludo(_ nombre: String) -> String { "Hola, \(nombre)" }
saludo("Ana")
```

**Valores por defecto**, como en Kotlin: `func propina(_ total: Double, porcentaje: Double = 10)` se llama `propina(80)` o `propina(80, porcentaje: 15)`.

> 💡 **Idea:** si una función tiene **una sola línea** que devuelve algo, el `return` se puede omitir (como en `saludo` de arriba). Es el `= expresión` de Kotlin.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Funciones que se leen como frases
lenguaje: swift
pide: Escribe `propina(_ total: Double, porcentaje: Double = 10) -> Double`, que devuelve el porcentaje del total (por defecto, 10). Y `viaje(de:a:)` con nombres de adentro `origen` y `destino`, que devuelve `"Centro → Aeropuerto"`. Fíjate en las pruebas: así es como se llaman. Ya están escritas las dos funciones con un valor de relleno: cámbialas.
--- código
func propina(_ total: Double, porcentaje: Double = 10) -> Double {
    return 0 // tu código aquí
}

func viaje(de origen: String, a destino: String) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("el 10% por defecto") { igual(propina(80), 8) }
prueba("otro porcentaje") { igual(propina(80, porcentaje: 15), 12) }
prueba("el viaje") { igual(viaje(de: "Centro", a: "Aeropuerto"), "Centro → Aeropuerto") }
--- solución
func propina(_ total: Double, porcentaje: Double = 10) -> Double {
    return total * porcentaje / 100
}

func viaje(de origen: String, a destino: String) -> String {
    return "\(origen) → \(destino)"
}
```

```practica
vf :: En Swift, los datos de una función se escriben con su etiqueta al llamarla, como ganancia(viajes: 12, porViaje: 9.75)
vf :: Si una función se declara como func saludo(_ nombre: String), se llama saludo(nombre: "Ana")
elige :: En func mover(de origen: String, a destino: String), ¿qué es "de"? :: El nombre que se usa adentro :: La etiqueta que se escribe al llamarla :: El tipo
escribe :: ¿Qué ventaja tienen las etiquetas de Swift frente a ganancia(12, 9.75) de TypeScript? :: Que la llamada dice qué es cada dato (viajes: 12, porViaje: 9.75): no se confunde el orden ni hace falta ir a mirar la función.
```

## Parte 2. Closures: funciones sin nombre

> 🌎 **En la vida real:** le dejas al vecino una nota: "cuando llegue el paquete, guárdalo en tu casa". No es una persona con nombre: es una instrucción que se cumple **después**, cuando pasa algo.

> 🌎 **Otro ejemplo:** Es como decirle al mesero "tráeme lo mismo que a él": una orden corta que se entiende en el momento.

Una **closure** es una función sin nombre que se pasa como dato. Es la flecha `(x) => x * 2` de TypeScript o la lambda `{ x -> x * 2 }` de Kotlin:

```swift
let doble = { (x: Double) -> Double in x * 2 }
doble(9)   // 18
```

`in` separa lo que recibe de lo que hace. Casi nunca se escribe tan largo: Swift adivina los tipos y deja nombrar los datos `$0`, `$1`…

```swift
let valores = [18.0, 12, 25]
valores.map { $0 * 2 }          // [36, 24, 50]: "a cada uno ($0), multiplícalo por 2"
```

**La closure al final (*trailing closure*).** Cuando el último dato de una función es una closure, se escribe **afuera de los paréntesis**. Por eso en SwiftUI vas a ver tanto:

```swift
Button("Guardar") {        // la closure es lo que pasa al tocar el botón
    guardar()
}
```

Es la misma idea que el `prueba("nombre") { … }` de los ejercicios de este curso: el `{ … }` es una closure que se corre después.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pasar una closure como dato
lenguaje: swift
pide: Completa `aplicar(_ valores: [Double], _ cambio: (Double) -> Double) -> [Double]`: recorre los valores con un `for`, le aplica `cambio` a cada uno y devuelve la lista nueva. Después `conImpuesto(_ valores:)`, que usa tu `aplicar` con una closure que suma el 15% (`$0 * 1.15`) y redondea a 2 decimales con `(x * 100).rounded() / 100`.
--- código
func aplicar(_ valores: [Double], _ cambio: (Double) -> Double) -> [Double] {
    return [] // tu código aquí
}

func conImpuesto(_ valores: [Double]) -> [Double] {
    return [] // tu código aquí
}
--- pruebas
prueba("aplicar el doble") { igual(aplicar([1, 2, 3]) { $0 * 2 }, [2, 4, 6]) }
prueba("aplicar sin valores") { igual(aplicar([]) { $0 * 2 }, []) }
prueba("con impuesto") { igual(conImpuesto([100, 9.99]), [115, 11.49]) }
--- solución
func aplicar(_ valores: [Double], _ cambio: (Double) -> Double) -> [Double] {
    var nuevos: [Double] = []
    for v in valores {
        nuevos.append(cambio(v))
    }
    return nuevos
}

func conImpuesto(_ valores: [Double]) -> [Double] {
    return aplicar(valores) { (($0 * 1.15) * 100).rounded() / 100 }
}
```

```practica
vf :: Una closure es una función sin nombre que se puede pasar como dato, como las flechas de TypeScript
vf :: En una closure de Swift, $0 es siempre el número cero
elige :: ¿Qué es la "closure al final" (trailing closure)? :: Una closure que se corre al final del programa :: Escribir la última closure de una llamada afuera de los paréntesis :: Una closure sin datos
escribe :: En Button("Guardar") { guardar() }, ¿qué es lo que va entre llaves y cuándo se corre? :: Es una closure: lo que pasa al tocar el botón. No se corre al dibujar el botón, sino después, cada vez que alguien lo toca.
```

## Parte 3. Colecciones: Array, Dictionary y Set

> 🌎 **En la vida real:** una lista de compras (en orden), una agenda de teléfonos (nombre → número) y la lista de invitados a una fiesta (nadie dos veces).

> 🌎 **Otro ejemplo:** Es como la fila del banco (Array), los casilleros con número (Dictionary) y el álbum de figuritas sin repetidas (Set).

| Colección | Qué es | Ejemplo |
|---|---|---|
| `Array` | Una lista en orden, puede repetir | `["Uber", "99", "Uber"]` |
| `Dictionary` | Clave → valor | `["Uber": 120.5, "99": 80]` |
| `Set` | Sin orden y sin repetidos | `Set(["Uber", "99", "Uber"])` → 2 elementos |

**Lo de siempre, con los nombres de siempre.** `map`, `filter` y `reduce` (clase 48) existen igual en Swift:

```swift
let viajes = [18.5, 12, 25, 9]
viajes.filter { $0 > 15 }              // [18.5, 25]
viajes.map { $0 * 2 }                  // [37, 24, 50, 18]
viajes.reduce(0, +)                    // 64.5: empieza en 0 y va sumando
viajes.sorted(by: >)                   // [25, 18.5, 12, 9]: de mayor a menor
```

`reduce(0, +)` es lo más corto que vas a ver: el `+` **es** una función que suma dos números, y se pasa como closure.

**Un diccionario devuelve un opcional.** `porApp["Uber"]` es un `Double?`: la clave puede no estar. Lo que aprendiste en la clase 98 se usa aquí todo el tiempo:

```swift
let porApp = ["Uber": 120.5, "99": 80]
porApp["inDrive"] ?? 0                 // 0: no estaba
porApp["Uber", default: 0]             // 120.5: lo mismo, con su forma propia
```

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Sumar por app con un diccionario
lenguaje: swift
pide: Cada viaje es una tupla `(app: String, valor: Double)`. Completa `totalPorApp(_ viajes:)`: devuelve un diccionario con la suma de cada app (usa `porApp[v.app, default: 0] += v.valor`). Después `apps(_ viajes:)`: las apps **sin repetir**, ordenadas (`Set(…).sorted()`). Y `grandes(_ viajes:)`: los valores mayores que 20, con `filter` y `map`.
--- código
func totalPorApp(_ viajes: [(app: String, valor: Double)]) -> [String: Double] {
    return [:] // tu código aquí
}

func apps(_ viajes: [(app: String, valor: Double)]) -> [String] {
    return [] // tu código aquí
}

func grandes(_ viajes: [(app: String, valor: Double)]) -> [Double] {
    return [] // tu código aquí
}
--- pruebas
let dia = [(app: "Uber", valor: 18.5), (app: "99", valor: 25.0), (app: "Uber", valor: 30.0)]
prueba("el total de cada app") { igual(totalPorApp(dia), ["Uber": 48.5, "99": 25]) }
prueba("sin viajes") { igual(totalPorApp([]), [:]) }
prueba("las apps sin repetir, en orden") { igual(apps(dia), ["99", "Uber"]) }
prueba("los viajes grandes") { igual(grandes(dia), [25, 30]) }
--- solución
func totalPorApp(_ viajes: [(app: String, valor: Double)]) -> [String: Double] {
    var porApp: [String: Double] = [:]
    for v in viajes {
        porApp[v.app, default: 0] += v.valor
    }
    return porApp
}

func apps(_ viajes: [(app: String, valor: Double)]) -> [String] {
    return Set(viajes.map { $0.app }).sorted()
}

func grandes(_ viajes: [(app: String, valor: Double)]) -> [Double] {
    return viajes.filter { $0.valor > 20 }.map { $0.valor }
}
```

```practica
vf :: Un Set no guarda elementos repetidos ni tiene un orden fijo
vf :: porApp["Uber"] en un diccionario de Swift devuelve un Double, siempre
elige :: ¿Qué hace viajes.reduce(0, +)? :: Cuenta los viajes :: Suma todos los valores, empezando en 0 :: Devuelve el mayor
escribe :: ¿Cuándo usarías un Dictionary en vez de un Array? :: Cuando quiero buscar un valor por una clave (el total de cada app por su nombre) en vez de por la posición en la lista.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué tienen de especial las funciones de Swift?":** "Las etiquetas: cada dato se escribe con su nombre al llamar la función, como `mover(de: \"Centro\", a: \"Aeropuerto\")`, así la llamada se explica sola; con `_` se quita cuando no agrega nada. Las closures son funciones sin nombre, con `$0` para el primer dato y la closure al final afuera de los paréntesis, que es lo que se ve en todo SwiftUI. Y las colecciones tienen el `map`, `filter` y `reduce` de siempre; un diccionario devuelve un opcional, porque la clave puede no estar."

> 🌎 **En la vida real:** es como explicar por qué un buen formulario tiene etiquetas al lado de cada casilla: nadie se equivoca de lugar.

> 🌎 **Otro ejemplo:** Es como contar cómo ordenas tu cocina: la lista de compras, los frascos con etiqueta y la caja de cosas sin repetir.
