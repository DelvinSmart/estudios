# Swift 4: struct, class, enum y protocolos

> 🌎 **En la vida real:** si le das a alguien una **fotocopia** de tu contrato y la raya, tu original queda limpio. Si le das **la llave** de tu casa y mueve los muebles, los encuentras movidos al volver. Esa es toda la diferencia entre `struct` y `class`.

> 🎙️ **El profesor dice:** {{alumno}}, hoy los moldes para tus propios datos. Lo más importante del día (y de las entrevistas de iOS) es la diferencia entre **valor** y **referencia**. Después, los `enum` con valores adentro, que en Swift son mucho más que una lista de nombres, y los **protocolos**, que son la forma de Swift de decir "esto sabe hacer tal cosa".

## Parte 1. struct y class: valor contra referencia

> 🌎 **En la vida real:** una receta que le pasas a tu amiga escrita en un papel (valor: cada una tiene la suya) contra una receta en un documento compartido (referencia: si ella la cambia, tú ves el cambio).

> 🌎 **Otro ejemplo:** Es como prestar un libro (`class`: es el mismo libro, y si lo subraya, tú ves el subrayado) o regalarle una copia (`struct`: cada uno tiene la suya).

Las dos se escriben casi igual:

```swift
struct GastoS { var valor: Double }
class GastoC { var valor: Double; init(valor: Double) { self.valor = valor } }
```

Pero se comportan distinto al **pasarlas** o **copiarlas**:

```swift
var a = GastoS(valor: 50)
var b = a              // b es una COPIA
b.valor = 80
a.valor                // 50: a no cambió

let c = GastoC(valor: 50)
let d = c              // d es OTRO NOMBRE para el MISMO objeto
d.valor = 80
c.valor                // 80: c también cambió
```

| | `struct` (valor) | `class` (referencia) |
|---|---|---|
| Al copiar o pasar | Se copia | Se comparte |
| Herencia | No | Sí |
| `init` | Lo escribe Swift solo | Lo escribes tú |
| Se parece a | La `data class` de Kotlin | La `class` de Kotlin y de TypeScript |

**En Swift se usa `struct` casi siempre.** Como se copia, nadie te cambia los datos "por detrás", y es más fácil razonar. Es la misma idea del estado nuevo con `{ ...e }` (clase 94) o con `copy` (clase 96), pero **de fábrica**. SwiftUI está hecho entero con `struct`. Se usa `class` cuando de verdad hace falta **compartir** un objeto (por ejemplo, el modelo de datos de toda la app, clase 103).

**`mutating`.** Como un `struct` es un valor, una función que lo cambia por dentro tiene que avisarlo con `mutating`, y solo se puede usar sobre un `var`:

```swift
struct Contador {
    var viajes = 0
    mutating func sumar() { viajes += 1 }
}
var hoy = Contador()
hoy.sumar()        // bien: hoy es var
```

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una copia o el mismo objeto
lenguaje: swift
pide: Ya están `Billetera` (un `struct`) y `Cuenta` (una `class`). Completa la función `mutating func gastar(_ monto: Double)` de la billetera: resta el monto del saldo, pero **solo si alcanza**. Las pruebas muestran la diferencia: copiar una billetera da otra billetera; copiar una cuenta da la **misma** cuenta.
--- código
struct Billetera {
    var saldo: Double
    mutating func gastar(_ monto: Double) {
        // tu código aquí
    }
}

class Cuenta {
    var saldo: Double
    init(saldo: Double) { self.saldo = saldo }
    func gastar(_ monto: Double) { if monto <= saldo { saldo -= monto } }
}
--- pruebas
prueba("gastar resta") { var b = Billetera(saldo: 100); b.gastar(30); igual(b.saldo, 70) }
prueba("si no alcanza, no gasta") { var b = Billetera(saldo: 20); b.gastar(30); igual(b.saldo, 20) }
prueba("struct: la copia es otra billetera") { var a = Billetera(saldo: 100); var b = a; b.gastar(40); igual([a.saldo, b.saldo], [100, 60]) }
prueba("class: la copia es la MISMA cuenta") { let a = Cuenta(saldo: 100); let b = a; b.gastar(40); igual([a.saldo, b.saldo], [60, 60]) }
--- solución
struct Billetera {
    var saldo: Double
    mutating func gastar(_ monto: Double) {
        if monto <= saldo { saldo -= monto }
    }
}

class Cuenta {
    var saldo: Double
    init(saldo: Double) { self.saldo = saldo }
    func gastar(_ monto: Double) { if monto <= saldo { saldo -= monto } }
}
```

```practica
vf :: Al copiar un struct se obtiene otro valor independiente; al copiar una class se obtiene otro nombre para el mismo objeto
vf :: En Swift conviene usar class siempre, porque tiene herencia
elige :: ¿Para qué sirve mutating en un struct? :: Para que sea más rápido :: Para avisar que esa función cambia el struct por dentro (y solo se puede usar sobre un var) :: Para heredar → Un struct es un valor: cambiarlo tiene que ser a propósito.
escribe :: Explica la diferencia entre struct y class con un ejemplo de la vida real. :: Un struct es como una fotocopia: si la otra persona la raya, tu original queda igual. Una class es como prestar la llave de tu casa: lo que la otra persona cambie, lo encuentras cambiado.
```

## Parte 2. enum con valores asociados

> 🌎 **En la vida real:** el estado de un pedido: "preparando", "en camino (con el nombre del repartidor)", "entregado (a qué hora)" o "cancelado (por qué)". Cada estado lleva **sus propios datos**.

> 🌎 **Otro ejemplo:** Es como las casillas del semáforo de un trámite: "aprobado", "rechazado, con el motivo", "pendiente, con la fecha".

Un `enum` es una lista cerrada de casos (como en Kotlin). En Swift, además, **cada caso puede llevar sus datos**:

```swift
enum EstadoViaje {
    case buscando
    case enCamino(chofer: String, minutos: Int)
    case terminado(valor: Double)
    case cancelado(motivo: String)
}

let ahora = EstadoViaje.enCamino(chofer: "Ana", minutos: 4)
```

Y con `switch` se sacan los datos de cada caso. Como el `enum` es cerrado, el `switch` **no necesita `default`**, y si agregas un caso nuevo, Swift te avisa en cada `switch` que no lo trata (clase 98):

```swift
func texto(_ e: EstadoViaje) -> String {
    switch e {
    case .buscando:                          return "Buscando chofer…"
    case .enCamino(let chofer, let minutos): return "\(chofer) llega en \(minutos) min"
    case .terminado(let valor):              return "Pagaste R$ \(valor)"
    case .cancelado(let motivo):             return "Cancelado: \(motivo)"
    }
}
```

Esto es lo que en Kotlin hacías con una familia `sealed` (clases 64 y 96), y en TypeScript con uniones. En Swift es un `enum` y listo.

> 💡 **Idea:** un `enum` así hace **imposibles** los estados raros. Con variables sueltas (`var chofer: String?`, `var cancelado: Bool`) podrías tener "cancelado y con chofer en camino" a la vez. Con el `enum`, el viaje está en **un** caso, con **sus** datos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un estado con sus datos
lenguaje: swift
pide: Completa `texto(_ e: EstadoViaje)` con un `switch` sin `default`. `.buscando` → `"Buscando chofer…"`. `.enCamino(chofer:minutos:)` → `"Ana llega en 4 min"`. `.terminado(valor:)` → `"Pagaste R$ 18.5"`. `.cancelado(motivo:)` → `"Cancelado: lluvia"`. Saca los datos de cada caso con `let`.
--- código
enum EstadoViaje {
    case buscando
    case enCamino(chofer: String, minutos: Int)
    case terminado(valor: Double)
    case cancelado(motivo: String)
}

func texto(_ e: EstadoViaje) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("buscando") { igual(texto(.buscando), "Buscando chofer…") }
prueba("en camino") { igual(texto(.enCamino(chofer: "Ana", minutos: 4)), "Ana llega en 4 min") }
prueba("terminado") { igual(texto(.terminado(valor: 18.5)), "Pagaste R$ 18.5") }
prueba("cancelado") { igual(texto(.cancelado(motivo: "lluvia")), "Cancelado: lluvia") }
--- solución
enum EstadoViaje {
    case buscando
    case enCamino(chofer: String, minutos: Int)
    case terminado(valor: Double)
    case cancelado(motivo: String)
}

func texto(_ e: EstadoViaje) -> String {
    switch e {
    case .buscando: return "Buscando chofer…"
    case .enCamino(let chofer, let minutos): return "\(chofer) llega en \(minutos) min"
    case .terminado(let valor): return "Pagaste R$ \(valor)"
    case .cancelado(let motivo): return "Cancelado: \(motivo)"
    }
}
```

```practica
vf :: En Swift, cada caso de un enum puede llevar sus propios datos, como enCamino(chofer: String, minutos: Int)
vf :: Un switch sobre un enum de Swift siempre necesita un default
elige :: ¿Qué ventaja tiene un enum con datos frente a varias variables sueltas (chofer, cancelado…)? :: Ocupa menos :: Hace imposibles los estados raros, como "cancelado y en camino" a la vez :: Es más rápido → El viaje está en un solo caso, con sus datos.
escribe :: ¿Qué cosa de Kotlin se parece al enum con valores asociados de Swift? :: Una familia sealed (sealed interface con data class adentro): cada caso es un tipo con sus propios datos, y el when no compila si falta uno.
```

## Parte 3. Protocolos y extensiones

> 🌎 **En la vida real:** para manejar un taxi necesitas la licencia profesional. A la empresa no le importa si eres alto o bajo: le importa que **tengas la licencia**. Un protocolo es esa licencia: "cualquiera que sepa hacer esto, sirve".

> 🌎 **Otro ejemplo:** Es como un enchufe: no importa la marca del aparato, si tiene el enchufe correcto, funciona.

Un **protocolo** dice qué tiene que saber hacer un tipo, sin decir cómo. Es la `interface` de TypeScript y de Kotlin:

```swift
protocol ConTotal {
    var total: Double { get }      // tiene que tener un total para leer
}

struct Viaje: ConTotal { var total: Double }
struct Gasto: ConTotal { let litros: Double; let precio: Double
    var total: Double { litros * precio }    // se calcula cada vez que se pide
}
```

Ahora una función puede recibir **cualquier cosa** que cumpla el protocolo:

```swift
func suma(_ cosas: [any ConTotal]) -> Double { cosas.reduce(0) { $0 + $1.total } }
suma([Viaje(total: 30), Gasto(litros: 10, precio: 6)])    // 90
```

**Los protocolos que ya usaste sin saberlo.** `Equatable` ("se puede comparar con `==`"), `Comparable` ("se puede ordenar"), `Hashable` ("puede ir en un `Set`"). El `igual()` de los ejercicios de este curso pide `Equatable`: por eso funciona con números, textos y listas. Y en SwiftUI, cada pantalla cumple el protocolo `View` (clase 102).

**Extensiones: agregar a un tipo que ya existe.** Con `extension` le agregas funciones a un tipo, **aunque no sea tuyo**:

```swift
extension Double {
    var enReales: String { "R$ " + String(format: "%.2f", self) }
}
18.5.enReales     // "R$ 18.50"
```

> 💡 **Idea:** con `extension` también se hace cumplir un protocolo a un tipo después: `extension Viaje: Comparable { … }`. Así el tipo queda limpio y cada habilidad va en su propio bloque.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un protocolo y una extensión
lenguaje: swift
pide: Ya está el protocolo `ConTotal` y los tipos `Viaje` y `Gasto`. Completa el `total` del gasto (litros × precio), la función `suma(_:)` que suma el `total` de cualquier lista de cosas `ConTotal`, y la extensión `enReales` de `Double`, que devuelve `"R$ 18.50"` con `String(format: "%.2f", self)`.
--- código
protocol ConTotal {
    var total: Double { get }
}

struct Viaje: ConTotal {
    var total: Double
}

struct Gasto: ConTotal {
    let litros: Double
    let precio: Double
    var total: Double { 0 } // tu código aquí
}

func suma(_ cosas: [any ConTotal]) -> Double {
    return 0 // tu código aquí
}

extension Double {
    var enReales: String { "" } // tu código aquí
}
--- pruebas
prueba("el total de un gasto") { igual(Gasto(litros: 10, precio: 6).total, 60) }
prueba("sumar viajes y gastos juntos") { igual(suma([Viaje(total: 30), Gasto(litros: 10, precio: 6)]), 90) }
prueba("sumar nada") { igual(suma([]), 0) }
prueba("en reales") { igual(18.5.enReales, "R$ 18.50") }
--- solución
protocol ConTotal {
    var total: Double { get }
}

struct Viaje: ConTotal {
    var total: Double
}

struct Gasto: ConTotal {
    let litros: Double
    let precio: Double
    var total: Double { litros * precio }
}

func suma(_ cosas: [any ConTotal]) -> Double {
    return cosas.reduce(0) { $0 + $1.total }
}

extension Double {
    var enReales: String { "R$ " + String(format: "%.2f", self) }
}
```

```practica
vf :: Un protocolo dice qué tiene que saber hacer un tipo, sin decir cómo, como una interface
vf :: Con extension solo se le pueden agregar funciones a los tipos que escribiste tú
elige :: ¿Por qué el igual() de los ejercicios funciona con números, textos y listas? :: Porque Swift adivina :: Porque pide Equatable, y esos tipos lo cumplen :: Porque los convierte a texto → Equatable quiere decir "se puede comparar con ==".
escribe :: ¿Qué protocolo cumple cada pantalla de SwiftUI, y qué crees que pide? :: El protocolo View. Pide una propiedad body que diga qué se dibuja (lo vas a ver en la clase 102).
```

## Para la entrevista

> 🎤 **Si te preguntan "¿struct o class?":** "struct es un tipo de valor: al copiarlo o pasarlo se copia, y nadie me lo cambia por detrás; class es un tipo de referencia: se comparte el mismo objeto. En Swift uso struct por defecto, como hace SwiftUI, y class solo cuando necesito compartir un objeto, como el modelo de datos de la app. Para estados uso enum con valores asociados, que hace imposibles los estados raros, y para decir 'esto sabe hacer tal cosa', protocolos, como Equatable o el View de SwiftUI."

> 🌎 **En la vida real:** es como explicar cuándo das una fotocopia y cuándo das la llave: depende de si quieres que el otro pueda cambiar lo tuyo.

> 🌎 **Otro ejemplo:** Es como explicar las licencias de conducir: no importa quién seas, importa qué sabes hacer.
