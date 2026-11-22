# Swift 7: SwiftUI con datos

> 🌎 **En la vida real:** una libreta de viajes de verdad no es una hoja suelta: tiene páginas (una lista), puedes abrir una para ver el detalle, tachar una que anotaste mal, y sobre todo **no se borra** cuando cierras la libreta.

> 🎙️ **El profesor dice:** {{alumno}}, "Mi jornada" crece. Hoy: una **lista** de viajes (cada uno con su app), tocar uno para ver su **detalle**, **borrar** deslizando el dedo, un **formulario** que sube desde abajo, los datos **compartidos** entre pantallas, y que todo **quede guardado** en el teléfono aunque cierres la app.

**Lo que hay** (en la carpeta `103-swift-swiftui-con-datos/proyecto`):

| Archivo | Qué es |
|---|---|
| `Viaje.swift` | Un viaje: `Identifiable`, `Codable` y `Hashable` |
| `Diario.swift` | Los viajes de la app, compartidos: una `class` con `@Observable` |
| `Guardado.swift` | Dónde se guardan: un protocolo, en el teléfono (`UserDefaults`) o en la memoria (para probar) |
| `PantallaLista.swift` | La lista, el detalle y el formulario |

**Probada en el simulador del iPhone:** anotar viajes, abrir el detalle, borrar deslizando, **cerrar la app del todo y volver a abrirla** (los viajes siguen ahí).

## Parte 1. La lista y el detalle

> 🌎 **En la vida real:** la agenda del teléfono: una lista de nombres; tocas uno y se abre su ficha; vuelves con la flecha de arriba.

> 🌎 **Otro ejemplo:** Es como el índice de un libro: cada línea te lleva a su página.

**Cada viaje tiene un documento de identidad.** Para que la lista sepa cuál es cuál (y no confunda dos viajes de R$ 18), cada uno cumple **`Identifiable`**: tiene un `id` único.

```swift
struct Viaje: Identifiable, Codable, Hashable {
    var id = UUID()          // un identificador único, creado solo
    var valor: Double
    var app: String
    var fecha = Date()
}
```

Es la `key` de las listas de React (clase 54) y de `FlatList` (clase 56). Con `Identifiable`, la lista no necesita que le digas cuál es la clave:

```swift
NavigationStack {
    List {
        ForEach(diario.viajes) { viaje in              // uno por cada viaje
            NavigationLink(value: viaje) {             // al tocarlo, abre el detalle
                HStack { Text(viaje.app); Spacer(); Text(viaje.valor.enReales) }
            }
        }
        .onDelete { diario.borrar(en: $0) }            // deslizar a la izquierda
    }
    .navigationTitle("Mi jornada")
    .navigationDestination(for: Viaje.self) { PantallaDetalle(viaje: $0) }
}
```

- **`NavigationStack`** es la pila de pantallas: abres una encima de otra y vuelves con la flecha. Es el `React Navigation` de la clase 58.
- **`NavigationLink(value:)`** dice *qué* se abre; **`navigationDestination`** dice *cómo* se dibuja. Así la lista no conoce la pantalla de detalle.
- **`.onDelete`** le avisa **en qué posiciones** se deslizó. El diario borra esas.

**Lo que dijo el compilador.** La primera vez no compiló: `initializer 'init(value:label:)' requires that 'Viaje' conform to 'Hashable'`. Para usar un viaje como destino, SwiftUI necesita poder compararlo y guardarlo en un conjunto: el protocolo **`Hashable`** de la clase 100. Se agregó, y listo. Leer el error en inglés te dice exactamente qué protocolo falta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Borrar por posiciones, como .onDelete
lenguaje: swift
pide: Cuando deslizas un viaje, la lista manda un `IndexSet`: las posiciones a borrar. Completa `borrar(_ viajes:en:)` y devuelve la lista sin esas posiciones. Ojo: si borras de adelante hacia atrás, las posiciones se corren. Recórrelas **de mayor a menor** (`posiciones.sorted(by: >)`) y usa `remove(at:)` sobre una copia (`var lista = viajes`).
--- código
struct Viaje: Identifiable, Equatable {
    let id: Int
    let app: String
}

func borrar(_ viajes: [Viaje], en posiciones: IndexSet) -> [Viaje] {
    return viajes // tu código aquí
}
--- pruebas
let dia = [Viaje(id: 1, app: "Uber"), Viaje(id: 2, app: "99"), Viaje(id: 3, app: "inDrive"), Viaje(id: 4, app: "Uber")]
prueba("borrar uno") { igual(borrar(dia, en: IndexSet([1])).map { $0.id }, [1, 3, 4]) }
prueba("borrar dos separados (las posiciones no se corren)") { igual(borrar(dia, en: IndexSet([0, 2])).map { $0.id }, [2, 4]) }
prueba("borrar el último") { igual(borrar(dia, en: IndexSet([3])).map { $0.id }, [1, 2, 3]) }
prueba("sin posiciones, igual") { igual(borrar(dia, en: IndexSet()), dia) }
--- solución
struct Viaje: Identifiable, Equatable {
    let id: Int
    let app: String
}

func borrar(_ viajes: [Viaje], en posiciones: IndexSet) -> [Viaje] {
    var lista = viajes
    for i in posiciones.sorted(by: >) {
        lista.remove(at: i)
    }
    return lista
}
```

```practica
vf :: Identifiable le da a cada viaje un id único, para que la lista sepa cuál es cuál
vf :: NavigationLink(value:) funciona con cualquier tipo, cumpla o no algún protocolo
elige :: ¿Qué manda .onDelete cuando deslizas un viaje? :: El viaje entero :: Las posiciones a borrar (un IndexSet) :: El id del viaje
escribe :: ¿Por qué hay que borrar las posiciones de mayor a menor? :: Porque si borras primero una de adelante, todas las que vienen después se corren un lugar, y borrarías el viaje equivocado. De atrás para adelante, las posiciones que faltan no cambian.
```

## Parte 2. Datos compartidos: @Observable y el entorno

> 🌎 **En la vida real:** en una oficina, la planilla de turnos está pegada en la pared: todos la miran ahí. No hay una copia en cada escritorio, que después no coincide.

> 🌎 **Otro ejemplo:** Es como la pizarra del mostrador de una cafetería: el que toma el pedido escribe, el que cocina lee, y los dos miran la misma.

La lista, el formulario y el detalle necesitan **los mismos** viajes. Si cada pantalla tuviera su copia (un `struct`, que se copia), el formulario anotaría en su copia y la lista no se enteraría. Este es el caso de la clase 100 donde **sí** conviene una `class`: un objeto que se **comparte**.

```swift
@Observable
final class Diario {
    private(set) var viajes: [Viaje]
    func anotar(valor: Double, app: String) { … }
    func borrar(en posiciones: IndexSet) { … }
}
```

- **`@Observable`**: SwiftUI se entera cuando cambian sus datos, y vuelve a dibujar **solo** las pantallas que los leen. Es el `@State` de la clase 102, pero para un objeto compartido.
- **`private(set)`**: desde afuera se **lee**, pero solo el diario lo **cambia** (por `anotar` y `borrar`). Nadie mete un viaje con valor negativo por la puerta de atrás.

**Se crea una vez y se pasa por el entorno:**

```swift
@main
struct MiJornadaApp: App {
    @State private var diario = Diario(guardado: GuardadoEnElTelefono())
    var body: some Scene {
        WindowGroup {
            PantallaLista().environment(diario)        // todas las de adentro lo pueden pedir
        }
    }
}

struct FormularioViaje: View {
    @Environment(Diario.self) private var diario     // lo pide, sin que se lo pasen a mano
    @Environment(\.dismiss) private var cerrar        // y la forma de cerrarse
}
```

Es el `Context` de React (clase 59): en vez de pasar el diario de pantalla en pantalla, se pone **en el entorno** y cada una lo toma.

**El formulario sube desde abajo** con `.sheet(isPresented: $anotando)`: cuando `anotando` pasa a `true`, aparece; con `cerrar()`, se va.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un diario compartido que guarda cada cambio
lenguaje: swift
pide: Completa la `class Diario`: `anotar(valor:app:)` agrega el viaje **al principio** de la lista (`insert(…, at: 0)`), pero solo si el valor es mayor que 0, y después **le pide al guardado que guarde**. `total` suma los valores. Las pruebas usan un guardado en memoria y además miran que dos "pantallas" que tienen el mismo diario ven lo mismo (porque es una `class`).
--- código
struct Viaje: Equatable { let valor: Double; let app: String }

protocol Guardado: AnyObject {
    func guardar(_ viajes: [Viaje])
}

final class EnMemoria: Guardado {
    var veces = 0
    var ultimo: [Viaje] = []
    func guardar(_ viajes: [Viaje]) { veces += 1; ultimo = viajes }
}

final class Diario {
    private(set) var viajes: [Viaje] = []
    let guardado: Guardado
    init(guardado: Guardado) { self.guardado = guardado }

    var total: Double { 0 } // tu código aquí

    func anotar(valor: Double, app: String) {
        // tu código aquí
    }
}
--- pruebas
prueba("el más nuevo, primero") { let d = Diario(guardado: EnMemoria()); d.anotar(valor: 18, app: "Uber"); d.anotar(valor: 25, app: "99"); igual(d.viajes.map { $0.app }, ["99", "Uber"]) }
prueba("el total") { let d = Diario(guardado: EnMemoria()); d.anotar(valor: 18, app: "Uber"); d.anotar(valor: 25, app: "99"); igual(d.total, 43) }
prueba("guarda en cada cambio") { let g = EnMemoria(); let d = Diario(guardado: g); d.anotar(valor: 18, app: "Uber"); igual(g.veces, 1); igual(g.ultimo, d.viajes) }
prueba("un valor de 0 no se anota ni se guarda") { let g = EnMemoria(); let d = Diario(guardado: g); d.anotar(valor: 0, app: "Uber"); igual([d.viajes.count, g.veces], [0, 0]) }
prueba("dos pantallas, el mismo diario") { let d = Diario(guardado: EnMemoria()); let lista = d; let formulario = d; formulario.anotar(valor: 30, app: "99"); igual(lista.total, 30) }
--- solución
struct Viaje: Equatable { let valor: Double; let app: String }

protocol Guardado: AnyObject {
    func guardar(_ viajes: [Viaje])
}

final class EnMemoria: Guardado {
    var veces = 0
    var ultimo: [Viaje] = []
    func guardar(_ viajes: [Viaje]) { veces += 1; ultimo = viajes }
}

final class Diario {
    private(set) var viajes: [Viaje] = []
    let guardado: Guardado
    init(guardado: Guardado) { self.guardado = guardado }

    var total: Double { viajes.reduce(0) { $0 + $1.valor } }

    func anotar(valor: Double, app: String) {
        guard valor > 0 else { return }
        viajes.insert(Viaje(valor: valor, app: app), at: 0)
        guardado.guardar(viajes)
    }
}
```

```practica
vf :: El diario es una class porque lo comparten varias pantallas: lo que anota el formulario lo ve la lista
vf :: Con private(set) var viajes, cualquier pantalla puede agregar viajes directo a la lista
elige :: ¿Para qué sirve .environment(diario) en la app? :: Para guardar el diario en el teléfono :: Para que todas las pantallas de adentro puedan pedir el diario con @Environment :: Para cambiar el modo oscuro
escribe :: ¿Qué pasaría si el formulario tuviera su propia copia de los viajes (un struct) en vez del diario compartido? :: Anotaría en su copia y la lista no se enteraría: el viaje nuevo no aparecería. Con una class compartida, los dos ven el mismo objeto.
```

## Parte 3. Guardar en el teléfono, sin que se rompa

> 🌎 **En la vida real:** guardar tus papeles en una carpeta con etiqueta ("viajes 2026"). Si un día la carpeta se moja y no se puede leer, no te quedas sin casa: empiezas una carpeta nueva.

> 🌎 **Otro ejemplo:** Es como el respaldo de las fotos del teléfono: se guarda solo cada vez que agregas una, sin que tengas que acordarte.

**De viajes a texto y de vuelta: `Codable`.** Con `Codable`, Swift convierte un viaje a **JSON** (texto) y de vuelta, sin que escribas nada más:

```swift
let datos = try JSONEncoder().encode(viajes)                  // [Viaje] → JSON
let deVuelta = try JSONDecoder().decode([Viaje].self, from: datos)   // JSON → [Viaje]
```

**Dónde se guarda: detrás de un protocolo.** El diario no sabe si guarda en el teléfono o en la memoria. Solo conoce el protocolo `Guardado` (clase 100). Es el **repositorio** de las clases 83 y 87:

```swift
protocol Guardado {
    func leer() -> [Viaje]
    func guardar(_ viajes: [Viaje])
}

struct GuardadoEnElTelefono: Guardado {
    let clave = "viajes:v1"                // con versión: si un día cambia la forma, se nota
    func leer() -> [Viaje] {
        guard let datos = UserDefaults.standard.data(forKey: clave),
              let viajes = try? JSONDecoder().decode([Viaje].self, from: datos)
        else { return [] }                  // nada guardado, o algo roto: se empieza vacío
        return viajes
    }
    // guardar: JSONEncoder y UserDefaults.standard.set(datos, forKey: clave)
}
```

Tres decisiones, cada una por una razón:
- **`UserDefaults`** es el lugar más simple del iPhone para guardar cosas chicas (es el `localStorage` de la clase 83). Para muchos datos, con búsquedas, se usa **SwiftData** (una base de datos de Apple); para una lista de viajes del día, alcanza con esto.
- **`try?` al leer** (clase 101): si lo guardado está roto, **no se cierra la app**: se empieza vacío.
- **Probar sin teléfono:** en las pruebas y en la vista previa se usa `GuardadoEnMemoria`. Mismo diario, otro guardado.

**Lo que se encontró mirándola.** Con la app vacía, decía **"Sin viajes todavía" dos veces**: arriba, como título de la lista, y en el centro, como aviso grande. Ninguna prueba lo ve: las dos cosas eran correctas por separado. Se arregló en la pantalla: sin viajes, el título no se muestra. Y la prueba que más importa se hizo a mano en el simulador: **cerrar la app del todo y volver a abrirla**. El viaje seguía ahí.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: A JSON y de vuelta, sin romperse
lenguaje: swift
pide: Completa `aJSON(_ viajes:)`, que convierte la lista a `Data` con `JSONEncoder().encode` (usa `try?` y, si falla, devuelve `Data()`), y `desdeJSON(_ datos:)`, que la lee con `JSONDecoder().decode([Viaje].self, from:)` y, si los datos están rotos, devuelve `[]` en vez de cerrar la app.
--- código
struct Viaje: Codable, Equatable {
    let valor: Double
    let app: String
}

func aJSON(_ viajes: [Viaje]) -> Data {
    return Data() // tu código aquí
}

func desdeJSON(_ datos: Data) -> [Viaje] {
    return [] // tu código aquí
}
--- pruebas
let viajes = [Viaje(valor: 18, app: "Uber"), Viaje(valor: 25.5, app: "99")]
prueba("ida y vuelta") { igual(desdeJSON(aJSON(viajes)), viajes) }
prueba("el JSON tiene los datos") { ok(String(decoding: aJSON(viajes), as: UTF8.self).contains("\"app\":\"Uber\""), "no aparece \"app\":\"Uber\"") }
prueba("datos rotos: lista vacía, sin caerse") { igual(desdeJSON(Data("esto no es JSON".utf8)), []) }
prueba("nada guardado: lista vacía") { igual(desdeJSON(Data()), []) }
--- solución
struct Viaje: Codable, Equatable {
    let valor: Double
    let app: String
}

func aJSON(_ viajes: [Viaje]) -> Data {
    return (try? JSONEncoder().encode(viajes)) ?? Data()
}

func desdeJSON(_ datos: Data) -> [Viaje] {
    return (try? JSONDecoder().decode([Viaje].self, from: datos)) ?? []
}
```

```practica
vf :: Con Codable, Swift convierte un viaje a JSON y de vuelta sin escribir nada más
vf :: Si lo guardado en el teléfono está roto, lo mejor es dejar que la app se cierre para que se note
elige :: ¿Para qué el diario usa un protocolo Guardado en vez de UserDefaults directo? :: Para que sea más rápido :: Para poder probarlo y verlo en la vista previa con un guardado en memoria :: Porque UserDefaults no funciona en el iPhone
escribe :: ¿Cuál fue la prueba más importante que se hizo a mano en el simulador, y por qué no alcanza con las del código? :: Cerrar la app del todo y volver a abrirla, para ver que los viajes seguían ahí. Las pruebas del código usan un guardado en memoria: no prueban que el teléfono de verdad guarde y lea.
```


**Comprobación antes de seguir**

Borra un elemento, cierra la app y comprueba la lista al abrirla otra vez.

<details>
<summary>Necesito una pista</summary>

Si vuelve el elemento, verifica si se guardó el cambio o si se cargó un estado anterior.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas datos en SwiftUI?":** "Los modelos son structs `Identifiable` y `Codable`. Los datos que comparten varias pantallas van en una class `@Observable`, que pongo en el entorno con `.environment` y pido con `@Environment`; uso `private(set)` para que solo se cambien por sus funciones. La navegación es un `NavigationStack` con `NavigationLink(value:)` y `navigationDestination`, por eso el modelo es `Hashable`. Guardo detrás de un protocolo, como un repositorio: en el teléfono, JSON en `UserDefaults` con una clave con versión y `try?` para no caerme con datos rotos; en las pruebas, en memoria. Y lo pruebo a mano: cerrar la app y volver a abrirla."

> 🌎 **En la vida real:** es como explicar cómo organizas una oficina: una planilla en la pared que todos miran, un archivo con etiquetas, y un respaldo por si algo se moja.

> 🌎 **Otro ejemplo:** Es como contar cómo funciona la libreta de un taxista: anota cada viaje, la deja en el auto, y al otro día sigue ahí.
