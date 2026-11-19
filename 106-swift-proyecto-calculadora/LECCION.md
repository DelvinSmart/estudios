# Swift 10: proyecto final, la calculadora en SwiftUI

> 🌎 **En la vida real:** un traductor que pasó el mismo libro a tres idiomas sabe algo que nadie más sabe: qué es **del libro** (la historia, que no cambia) y qué es **del idioma** (los giros, las trampas de cada uno).

> 🎙️ **El profesor dice:** {{alumno}}, este es el final del curso de Swift. Hiciste la misma calculadora en React Native (clases 94 y 95) y en Kotlin (clase 96). Hoy, la tercera: **nativa en el iPhone, con SwiftUI**. Las mismas decisiones, las mismas pruebas (44, con Swift Testing), una trampa nueva propia de Swift, y al final, cómo encaja Swift en una app de React Native como Copiloto.

**Lo que hay** (en la carpeta `106-swift-proyecto-calculadora/proyecto`):

| En Swift | Hace lo mismo que, en React Native | y en Kotlin |
|---|---|---|
| `Calculadora/Calculadora.swift` | `src/logica/calculadora.ts` | `logica/Calculadora.kt` |
| `Calculadora/Teclado.swift` | `src/logica/teclado.ts` | `logica/Teclado.kt` |
| `Calculadora/Motor.swift` | `src/tema/motor.ts` | `tema/Motor.kt` |
| `Calculadora/PantallaCalculadora.swift` | `Tecla.tsx`, `Visor.tsx`, la pantalla | `PantallaCalculadora.kt` |
| `PruebasCalculadora/` (44 pruebas) | `__tests__/` (56) | `app/src/test/` (51) |

```bash
cd estudios/106-swift-proyecto-calculadora/proyecto
xcodebuild test -scheme Calculadora -destination 'platform=iOS Simulator,name=iPhone 17'   # o ⌘U en Xcode
```

La identidad es `com.tuusuario.calculadoraswift`: distinta de las otras dos, por lo que pasó en la clase 96.

## Parte 1. Las mismas decisiones, con un enum

En TypeScript, una tecla era un **texto**; en Kotlin, una **familia `sealed`**; en Swift, un **`enum` con valores asociados** (clase 100):

```swift
enum Tecla: Hashable {
    case digito(Int)
    case coma, igual, borrarTodo, borrarUno, porcentaje, signo
    case operador(Operador)
}

enum Operador: String, Hashable {
    case sumar = "+", restar = "−", multiplicar = "×", dividir = "÷"
}
```

Y `apretar` es un `switch` **sin `default`**: si mañana agregas una tecla, Swift no compila hasta que digas qué hace (como el `when` de Kotlin).

```swift
func apretar(_ e: Estado, _ t: Tecla) -> Estado {
    var n = e                        // Estado es un struct: n es una COPIA (clase 100)
    switch t {
    case .digito(let d): …
    case .operador(let o): …         // 5 + × → vale el último; 2 + 3 × → muestra 5
    case .igual: …
    // … una rama por cada tecla
    }
    return n
}
```

Fíjate en `var n = e`: como `Estado` es un `struct`, `n` es **una copia**. Lo que le cambies no toca `e`. Es lo que en TypeScript se hacía con `{ ...e }` y en Kotlin con `copy`: en Swift **viene de fábrica**.

**Las mismas pruebas.** El ayudante se escribe igual que en las otras dos:

```swift
func tocar(_ teclas: String...) -> String {
    let final = teclas.reduce(Estado()) { apretar($0, tecla($1)) }
    return final.error ?? formatear(final.pantalla)
}

@Test("de izquierda a derecha: 2 + 3 × 4 = 20") func izquierdaADerecha() { #expect(tocar("2", "+", "3", "×", "4", "=") == "20") }
@Test("15 + 3 % = 0,45 (en Kotlin daba 0, clase 96)") func porcentajeConDecimales() { #expect(tocar("1", "5", "+", "3", "%") == "0,45") }
```

**Resultado:** las 43 pruebas que vinieron de las otras dos versiones pasaron **a la primera**. Incluida la del porcentaje que en Kotlin se había roto: una prueba que nace en una versión protege a las tres.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las teclas como un enum con valores
lenguaje: swift
pide: Completa `simbolo` y `etiqueta` de la tecla con un `switch` sin `default`. El símbolo: el dígito como texto (`"7"`), `","` para la coma, `"="` para igual, `"C"` para borrar todo, y para un operador su `rawValue` (`"+"`, `"÷"`…). La etiqueta (para VoiceOver): `"dividir"`, `"sumar"`, `"igual"`, `"borrar todo"`, `"coma"`, y para un dígito, el mismo dígito.
--- código
enum Operador: String { case sumar = "+", dividir = "÷" }

enum Tecla {
    case digito(Int)
    case coma, igual, borrarTodo
    case operador(Operador)

    var simbolo: String { "" } // tu código aquí
    var etiqueta: String { "" } // tu código aquí
}
--- pruebas
prueba("un dígito") { igual(Tecla.digito(7).simbolo, "7") }
prueba("un operador usa su rawValue") { igual(Tecla.operador(.dividir).simbolo, "÷") }
prueba("la coma") { igual(Tecla.coma.simbolo, ",") }
prueba("C") { igual(Tecla.borrarTodo.simbolo, "C") }
prueba("÷ se lee dividir") { igual(Tecla.operador(.dividir).etiqueta, "dividir") }
prueba("un dígito se lee solo") { igual(Tecla.digito(3).etiqueta, "3") }
prueba("igual") { igual(Tecla.igual.etiqueta, "igual") }
--- solución
enum Operador: String { case sumar = "+", dividir = "÷" }

enum Tecla {
    case digito(Int)
    case coma, igual, borrarTodo
    case operador(Operador)

    var simbolo: String {
        switch self {
        case .digito(let n): return String(n)
        case .coma: return ","
        case .igual: return "="
        case .borrarTodo: return "C"
        case .operador(let o): return o.rawValue
        }
    }

    var etiqueta: String {
        switch self {
        case .digito(let n): return String(n)
        case .coma: return "coma"
        case .igual: return "igual"
        case .borrarTodo: return "borrar todo"
        case .operador(.sumar): return "sumar"
        case .operador(.dividir): return "dividir"
        }
    }
}
```

```practica
vf :: En Swift, las teclas de la calculadora son un enum con valores asociados, como .digito(7) u .operador(.sumar)
vf :: Como la versión de Swift es nueva, hubo que escribir pruebas distintas a las de React Native y Kotlin
elige :: ¿Qué hace var n = e en apretar, si Estado es un struct? :: Hace que n y e sean el mismo estado :: Hace una copia: cambiar n no toca e :: Borra el estado
escribe :: ¿Qué pasa en Swift si agregas una tecla nueva al enum y no tocas apretar? :: No compila: el switch de apretar no tiene default, así que Swift avisa que falta decir qué hace esa tecla.
```

## Parte 2. Decimal: exacto, y su trampa

Como `BigDecimal` en Kotlin, Swift tiene **`Decimal`**, que guarda los decimales en base 10, **exactos**:

```swift
Decimal(string: "0.1")! + Decimal(string: "0.2")!   // 0.3, sin redondear
0.1 + 0.2                                           // 0.30000000000000004 (Double)
```

Solo se redondea lo que no termina (`1 ÷ 3`), a 12 cifras significativas, con `NSDecimalRound`.

**La trampa, encontrada probando.** Se probó una idea que circula: "un `Decimal` escrito como número (`let x: Decimal = 0.1`) ya viene con el error". En este Swift **no**: `0.1 + 0.2` con literales `Decimal` dio `0.3`. Esa versión de la trampa no se puso en la clase, porque no es cierta aquí. Pero la otra **sí**:

```swift
let precio: Double = 19.99                  // un Double que ya tenías
Decimal(precio) * 3                         // 59.96999999999998464  ✗ el error del Double viaja adentro
Decimal(string: "19.99")! * 3               // 59.97                 ✓
```

Un `Decimal` creado **desde un `Double`** hereda su error. La regla: **crea el `Decimal` desde el texto**, nunca desde un `Double`. La calculadora ya lo hacía (lee el número del texto del visor), y quedó una prueba para que nadie lo cambie:

```swift
// Decimal(19.99 como Double) * 3 da 59.96999999999998464: el error del Double viaja adentro.
@Test("19,99 × 3 = 59,97 (el Decimal sale del texto, no de un Double)")
func desdeElTexto() { #expect(tocar("1", "9", ",", "9", "9", "×", "3", "=") == "59,97") }
```

> 💡 **Idea:** fíjate en cómo se trató la idea que **no** resultó cierta: se probó, no se confirmó, y no se escribió. Lo que va a una clase se prueba antes.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El Decimal, desde el texto
lenguaje: swift
pide: Completa `total(precio:cantidad:)`: recibe el precio como texto (`"19.99"`) y devuelve el total como texto. Crea el `Decimal` **desde el texto** con `Decimal(string: precio)` (si no se puede, usa `0`), multiplícalo por la cantidad y devuelve `"\(resultado)"`. La última prueba muestra qué pasaría si lo crearas desde un `Double`.
--- código
func total(precio: String, cantidad: Int) -> String {
    let p = Decimal(Double(precio) ?? 0) // ✗ desde un Double: cámbialo
    return "\(p * Decimal(cantidad))"
}
--- pruebas
prueba("19,99 × 3") { igual(total(precio: "19.99", cantidad: 3), "59.97") }
prueba("0,10 × 3") { igual(total(precio: "0.10", cantidad: 3), "0.3") }
prueba("un texto que no es número") { igual(total(precio: "mucho", cantidad: 3), "0") }
prueba("desde un Double sale mal (por eso se usa el texto)") { ok("\(Decimal(19.99) * 3)" != "59.97", "Decimal(Double) * 3 dio 59.97: en este Swift no se ve la trampa") }
--- solución
func total(precio: String, cantidad: Int) -> String {
    let p = Decimal(string: precio) ?? 0
    return "\(p * Decimal(cantidad))"
}
```

```practica
vf :: Un Decimal creado desde el texto "19.99", por 3, da exactamente 59.97
vf :: Crear un Decimal desde un Double ya calculado es tan exacto como crearlo desde el texto
elige :: Probaste una idea que leíste ("el Decimal literal ya trae el error") y en tu Swift no pasó. ¿Qué haces? :: La escribo igual en la clase :: No la escribo: lo que va a una clase se prueba antes :: La borro de internet
escribe :: ¿Por qué la calculadora no tiene la trampa del Decimal desde un Double? :: Porque lee los números del texto del visor y crea el Decimal desde ese texto, nunca desde un Double. Y hay una prueba (19,99 × 3 = 59,97) para que nadie lo cambie.
```

## Parte 3. La pantalla, y las tres comparadas

La pantalla es corta, porque no decide nada:

```swift
struct PantallaCalculadora: View {
    @State private var estado = Estado()
    var body: some View {
        GeometryReader { geo in                           // el ancho: lo que en RN era useWindowDimensions
            let lado = Motor.ladoDeTecla(ancho: geo.size.width)
            VStack(spacing: Motor.Espacio.medio) {
                Visor(texto: estado.error ?? formatear(estado.pantalla), esAviso: estado.error != nil)
                ForEach(filas, id: \.self) { fila in
                    HStack(spacing: Motor.Espacio.medio) {
                        ForEach(fila, id: \.self) { t in
                            TeclaRedonda(tecla: t, lado: lado, encendida: …) { estado = apretar(estado, t) }
                        }
                    }
                }
            }
        }
    }
}
```

**El número largo, otra vez.** En React Native (clase 95), `-0,333333333333` se cortaba en un iPhone SE porque `adjustsFontSizeToFit` solo funciona en iOS, y hubo que calcular el tamaño de la letra a mano para Android y la web. En SwiftUI, que **solo** corre en Apple, la herramienta de fábrica alcanza:

```swift
Text(texto)
    .lineLimit(1)
    .minimumScaleFactor(Motor.Letra.visorMinimo)   // puede achicarse hasta el 40% para entrar
```

**Probado en el simulador:** `1 ÷ 3 = ± ×` mostró `-0,333333333333` entero, con el `×` encendido (colores al revés).

**Las tres, una al lado de la otra:**

| | React Native | Kotlin | Swift |
|---|---|---|---|
| Sale para | Android **y** iPhone | Solo Android | Solo iPhone (y Mac, iPad) |
| Una tecla | un texto (`'7'`) | una familia `sealed` | un `enum` con valores |
| Los decimales | `number`: redondear a 12 cifras | `BigDecimal`: exacto (trampa: `/`) | `Decimal`: exacto (trampa: desde un `Double`) |
| El estado nuevo | `{ ...e }` | `copy(…)` | `var n = e` (un `struct` se copia solo) |
| El número largo | calcular la letra a mano | calcular la letra a mano | `minimumScaleFactor`, de fábrica |
| Pruebas | 56, Jest | 51, JUnit | 44, Swift Testing |

**Lo que no cambió en ninguna:** el plan con la tabla de decisiones, la lógica separada de la pantalla, el teclado como datos, el motor de diseño, la accesibilidad y las pruebas primero. Eso es lo que sabes de verdad; el lenguaje es la herramienta.

> 📌 **Nota:** ¿por qué esta calculadora no se instala en Android, y por qué existen apps solo para iPhone? Está explicado en la clase 44, en **"Para ir más lejos: ¿por qué la app de un teléfono no sirve en el otro?"**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El operador encendido
lenguaje: swift
pide: Completa `operadorEncendido(_ e:)`: devuelve el operador del estado **solo** mientras se espera el segundo número (`nuevoNumero` es `true`) y no hay un aviso (`error` es `nil`); si no, `nil`. Es lo que decide qué tecla se dibuja con los colores al revés.
--- código
enum Operador: String { case sumar = "+", multiplicar = "×" }

struct Estado {
    var operador: Operador? = nil
    var nuevoNumero = true
    var error: String? = nil
}

func operadorEncendido(_ e: Estado) -> Operador? {
    return e.operador // tu código aquí
}
--- pruebas
prueba("recién tocado: encendido") { igual(operadorEncendido(Estado(operador: .multiplicar, nuevoNumero: true)), .multiplicar) }
prueba("escribiendo el segundo número: apagado") { igual(operadorEncendido(Estado(operador: .multiplicar, nuevoNumero: false)), nil) }
prueba("con un aviso: apagado") { igual(operadorEncendido(Estado(operador: .sumar, nuevoNumero: true, error: "No se puede dividir entre 0")), nil) }
prueba("sin operador") { igual(operadorEncendido(Estado()), nil) }
--- solución
enum Operador: String { case sumar = "+", multiplicar = "×" }

struct Estado {
    var operador: Operador? = nil
    var nuevoNumero = true
    var error: String? = nil
}

func operadorEncendido(_ e: Estado) -> Operador? {
    return e.nuevoNumero && e.error == nil ? e.operador : nil
}
```

```practica
vf :: En SwiftUI, minimumScaleFactor achica la letra para que el número entre, y funciona de fábrica
vf :: Entre las tres calculadoras cambió todo: el plan, la lógica y las pruebas
elige :: ¿Qué trampa de los decimales tuvo cada versión? :: Ninguna :: Kotlin: / entre BigDecimal; Swift: crear el Decimal desde un Double :: Las dos, la misma
escribe :: Si tuvieras que elegir una de las tres para una app nueva, ¿qué preguntarías primero? :: Para quién es: si tiene que estar en Android y en iPhone con un equipo chico, React Native; si es solo para iPhone y necesita lo último de Apple, Swift; si es solo para Android, Kotlin.
```

## Parte 4. Cómo encaja Swift en una app de React Native: Copiloto

> 🌎 **En la vida real:** un restaurante con un chef general y un especialista en sushi. El chef hace casi todo el menú; cuando alguien pide sushi, se lo pasa al especialista, que tiene sus propios cuchillos. El cliente no se entera: recibe su plato.

> 🌎 **Otro ejemplo:** Es como un auto con un motor común y una pieza importada para una sola cosa: casi todo es del auto, y esa pieza hace lo que el resto no puede.

Copiloto es una app de **React Native** (TypeScript): una sola base de código para Android e iPhone. Pero hay cosas que solo el teléfono puede hacer **por dentro**, y que React Native no trae:

- Leer la **pantalla compartida** de otra app (con permiso de la persona), para ver una oferta de viaje.
- Sacar el **texto** de esa imagen.
- Mostrar un **aviso** con la oferta, con su puntaje.

Para eso tiene un **módulo nativo** de Expo. En el iPhone está escrito en **Swift** (con *ReplayKit* para la pantalla compartida y *Vision* para leer el texto). En Android, **el mismo módulo** está escrito en **Kotlin**. Y TypeScript lo llama como si fuera una función más:

```text
TypeScript (la app)         ──llama──►   ModuloNativo.algunaFuncion()
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
              en el iPhone: Swift                              en Android: Kotlin
       (ReplayKit, Vision, notificaciones)              (la ventana encima de otra app)
                    └─────────────────────────┬─────────────────────────┘
TypeScript (la app)   ◄──avisa──   eventos: "empezó la captura", "llegó una oferta"
```

En Swift, un módulo de Expo se declara así (la forma general, sin los detalles de Copiloto):

```swift
import ExpoModulesCore

public class MiModulo: Module {
    public func definition() -> ModuleDefinition {
        Name("MiModulo")                               // así lo llama TypeScript
        Events("onAlgoPaso")                           // lo que el módulo le avisa a TypeScript
        Function("sumar") { (a: Double, b: Double) in  // una función que TypeScript puede llamar
            a + b
        }
    }
}
```

**Por qué importa para ti:** con los tres cursos (React Native, Kotlin y Swift) puedes leer las **tres** partes de una app como Copiloto. La mayoría es TypeScript; cuando algo solo lo puede hacer el teléfono, hay un módulo nativo con su gemelo en cada sistema. Es lo que más se valora en un equipo chico: alguien que no se frena en el borde entre React Native y lo nativo.

> 📌 **Nota:** el código de Copiloto es privado (clase 85): aquí se cuenta **qué hace** cada pieza y **cómo se conectan**, no sus detalles. El ejemplo de arriba es la forma general de cualquier módulo de Expo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un módulo que TypeScript llama por su nombre
lenguaje: swift
pide: Así funciona, por dentro, un módulo nativo: TypeScript pide una función **por su nombre** y le pasa los datos. Completa `llamar(_ nombre:con:)`: busca la función en `funciones`; si existe, devuelve lo que ella devuelve; si no, devuelve `"No existe la función X en el módulo"`.
--- código
struct Modulo {
    let nombre: String
    let funciones: [String: ([Double]) -> String]

    func llamar(_ nombre: String, con datos: [Double]) -> String {
        return "" // tu código aquí
    }
}

let modulo = Modulo(nombre: "MiModulo", funciones: [
    "sumar": { "\($0.reduce(0, +))" },
    "puedeDibujarEncima": { _ in "true" },
])
--- pruebas
prueba("una función que existe") { igual(modulo.llamar("sumar", con: [18, 25.5]), "43.5") }
prueba("otra, sin datos") { igual(modulo.llamar("puedeDibujarEncima", con: []), "true") }
prueba("una que no existe avisa") { igual(modulo.llamar("borrarTodo", con: []), "No existe la función borrarTodo en el módulo") }
--- solución
struct Modulo {
    let nombre: String
    let funciones: [String: ([Double]) -> String]

    func llamar(_ nombre: String, con datos: [Double]) -> String {
        guard let f = funciones[nombre] else { return "No existe la función \(nombre) en el módulo" }
        return f(datos)
    }
}

let modulo = Modulo(nombre: "MiModulo", funciones: [
    "sumar": { "\($0.reduce(0, +))" },
    "puedeDibujarEncima": { _ in "true" },
])
```

```practica
vf :: Una app de React Native puede tener un módulo nativo escrito en Swift para el iPhone y en Kotlin para Android
vf :: Si una app es de React Native, no puede usar nada que React Native no traiga
elige :: ¿Qué usa el módulo de Copiloto en el iPhone para leer el texto de la pantalla? :: El teclado del iPhone :: Vision, la herramienta de Apple para reconocer texto en imágenes :: Una página web
escribe :: ¿Por qué saber React Native, Kotlin y Swift juntos es valioso en un equipo chico? :: Porque puedes leer y arreglar las tres partes de una app como Copiloto: la mayoría en TypeScript, y los módulos nativos en Swift y Kotlin para lo que solo el teléfono puede hacer, sin frenarte en el borde.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué sabes de iOS?":** "Hice el curso de Swift completo: el lenguaje, con opcionales, structs y enums con valores asociados, errores y async/await; SwiftUI con listas, navegación, datos compartidos con @Observable y guardado en el teléfono, un motor de diseño con modo claro y oscuro, y pruebas con Swift Testing, rompiendo el código a propósito para ver que avisan. El proyecto final fue la misma calculadora que hice en React Native y en Kotlin, con las mismas 44 decisiones probadas. En Swift encontré su trampa: un Decimal creado desde un Double hereda el error; por eso se crea desde el texto. Y entiendo cómo encaja con React Native: un módulo nativo de Expo en Swift para lo que solo el iPhone puede hacer, como en Copiloto."

> 🌎 **En la vida real:** es como el traductor que puede contar el mismo libro en tres idiomas, y explicar qué cambia y qué no.

> 🌎 **Otro ejemplo:** Es como un mecánico que trabajó en tres marcas: sabe qué es igual en todos los autos y qué tiene cada uno.
