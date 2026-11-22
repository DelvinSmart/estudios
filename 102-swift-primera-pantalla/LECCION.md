# Swift 6: tu primera pantalla con SwiftUI

> 🌎 **En la vida real:** hasta ahora cocinaste en una cocina de prueba (los ejercicios de la página). Hoy abres el restaurante: una app que se abre en el iPhone, con botones que se tocan.

> 🎙️ **El profesor dice:** {{alumno}}, hoy tu primera app de iPhone: **"Mi jornada"**. Anotas lo que pagó cada viaje y ves el total del día y el promedio. Vas a crear el proyecto en Xcode, entender cómo SwiftUI dibuja una pantalla y por qué **la pantalla no hace cuentas**. Y lo que se encontró mirándola en el simulador.

> 📖 **Palabra nueva: SwiftUI.** Es la forma de Apple de **dibujar pantallas** con Swift. En vez de decir paso a paso "pon un botón aquí, cámbiale el texto allá", **describes** cómo debe verse la pantalla según los datos, y SwiftUI la redibuja sola cuando los datos cambian. A eso se le llama **declarativo**. Es la misma idea que Jetpack Compose en Android y que React en la web.
>
> 🌎 **En la vida real:** es como darle al pintor una foto de cómo quieres la pared, en vez de dictarle cada pincelada.

**Lo que hay** (en la carpeta `102-swift-primera-pantalla/proyecto` de este mismo repositorio):

| Archivo | Qué es |
|---|---|
| `MiJornada/MiJornadaApp.swift` | La puerta de entrada: `@main` dice "la app empieza aquí" |
| `MiJornada/Jornada.swift` | La lógica: los viajes, el total, el promedio y el resumen. Swift puro, sin pantalla |
| `MiJornada/PantallaJornada.swift` | La pantalla: dibuja lo que dice la jornada y avisa lo que se tocó |
| `MiJornada.xcodeproj` | El proyecto de Xcode: se abre con doble clic |

## Parte 1. Crear el proyecto en Xcode

> 🌎 **En la vida real:** antes de cocinar, preparas la mesa: la tabla, los cuchillos, las ollas. Xcode prepara todo eso cuando creas un proyecto.

> 🌎 **Otro ejemplo:** Es como abrir una cuenta en el banco: llenas el formulario una vez (nombre, tipo de cuenta) y después solo la usas.

Las pantallas de iPhone no corren en el navegador: se hacen en **Xcode**, gratis, en tu Mac. **Lista de comprobación** (hazla tú, una vez):

- [ ] Abre Xcode y elige **File → New → Project…** → **iOS** → **App** → *Next*.
- [ ] **Product Name:** `MiJornada`. **Organization Identifier:** `com.tunombre` (tu identidad, como el `applicationId` de Android, clase 96). **Interface:** SwiftUI. **Language:** Swift. *Next* y elige una carpeta.
- [ ] Arriba, en el medio, elige un simulador (por ejemplo, **iPhone 17**) y toca **▶** (o `⌘R`). Se abre el simulador con "Hello, world!".
- [ ] Abre `ContentView.swift`: a la derecha está la **vista previa** (*Canvas*). Si no aparece, **Editor → Canvas** (`⌥⌘↩`). Cambia `"Hello, world!"` por tu nombre y mira cómo cambia **al instante**, sin volver a correr.

Xcode te deja dos archivos, los mismos que tiene `MiJornada`:

```swift
@main                                   // "la app empieza aquí"
struct MiJornadaApp: App {
    var body: some Scene {
        WindowGroup {                    // una ventana (en el iPhone, la pantalla entera)
            PantallaJornada()            // lo que se ve adentro
        }
    }
}
```

Fíjate: la **app** es un `struct`, la **pantalla** es un `struct` (clase 100). En SwiftUI casi todo es un `struct`: liviano, se copia, y nadie te lo cambia por detrás.

> 📌 **Nota:** la carpeta del proyecto en este repositorio se puede abrir directo: doble clic en `MiJornada.xcodeproj`, elige un simulador y **▶**. Así puedes comparar el tuyo con el del curso.

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.count` y `.isEmpty`**: `viajes.count` dice cuántos elementos tiene la lista; `viajes.isEmpty` es `true` si no tiene ninguno. Se prefiere `isEmpty` a preguntar `count == 0`: se lee mejor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La lógica de la jornada, sin pantalla
lenguaje: swift
pide: Esta es la lógica de la app, que corre aquí sin Xcode. Completa el `struct Jornada`: `total` suma los viajes (`reduce(0, +)`), `promedio` divide el total entre la cantidad (o `0` si no hay viajes), `anotar(_:)` agrega un valor **solo si es mayor que 0**, y `deshacer()` quita el último (`popLast()`; si no hay ninguno, no pasa nada).
--- código
struct Jornada {
    private(set) var viajes: [Double] = []

    var total: Double { 0 } // tu código aquí
    var promedio: Double { 0 } // tu código aquí

    mutating func anotar(_ valor: Double) {
        // tu código aquí
    }

    mutating func deshacer() {
        // tu código aquí
    }
}
--- pruebas
prueba("anotar y sumar") { var j = Jornada(); j.anotar(18); j.anotar(19); igual(j.total, 37) }
prueba("el promedio") { var j = Jornada(); j.anotar(18); j.anotar(19); igual(j.promedio, 18.5) }
prueba("sin viajes, promedio 0") { igual(Jornada().promedio, 0) }
prueba("un valor de 0 no se anota") { var j = Jornada(); j.anotar(0); j.anotar(-5); igual(j.viajes, []) }
prueba("deshacer quita el último") { var j = Jornada(); j.anotar(18); j.anotar(19); j.deshacer(); igual(j.viajes, [18]) }
prueba("deshacer sin viajes no rompe nada") { var j = Jornada(); j.deshacer(); igual(j.viajes, []) }
--- solución
struct Jornada {
    private(set) var viajes: [Double] = []

    var total: Double { viajes.reduce(0, +) }
    var promedio: Double { viajes.isEmpty ? 0 : total / Double(viajes.count) }

    mutating func anotar(_ valor: Double) {
        guard valor > 0 else { return }
        viajes.append(valor)
    }

    mutating func deshacer() {
        _ = viajes.popLast()
    }
}
```

```practica
vf :: Las pantallas de SwiftUI se hacen en Xcode, que es gratis y corre en la Mac
vf :: En SwiftUI, la app y las pantallas son class, porque tienen que compartirse
elige :: ¿Qué hace @main en MiJornadaApp? :: Marca la pantalla principal :: Dice que la app empieza ahí :: Hace que la app sea más rápida
escribe :: ¿Para qué sirve la vista previa (Canvas) de Xcode? :: Para ver la pantalla al lado del código y ver cada cambio al instante, sin volver a correr la app en el simulador.
```

## Parte 2. Una pantalla: body, pilas y modificadores

> 🌎 **En la vida real:** armar una pantalla es como armar una vitrina: pones cosas una **encima** de otra (una pila vertical) o una **al lado** de otra (una fila), y a cada una le pones su etiqueta, su tamaño y su color.

> 🌎 **Otro ejemplo:** Es como apilar cajas de una mudanza: unas en columna, otras en fila, y a cada una le pegas su cartel.

Una pantalla es un `struct` que cumple el protocolo **`View`** (clase 100). Lo único que pide es **`body`**: lo que se dibuja.

```swift
struct PantallaJornada: View {
    var body: some View {
        VStack(spacing: 24) {                     // una pila vertical, con 24 de aire entre cada cosa
            Text("Mi jornada")
                .font(.largeTitle.bold())          // un modificador: cambia cómo se ve
            HStack(spacing: 12) {                 // una fila
                Button("＋ Viaje") { /* … */ }
                    .buttonStyle(.borderedProminent)
                Button("Deshacer") { /* … */ }
                    .buttonStyle(.bordered)
            }
        }
        .padding(24)                              // aire alrededor de toda la pila
    }
}
```

| SwiftUI | React Native | Compose |
|---|---|---|
| `VStack` | `<View>` en columna | `Column` |
| `HStack` | `flexDirection: 'row'` | `Row` |
| `Text("…")` | `<Text>` | `Text("…")` |
| `Button("…") { }` | `<Pressable onPress>` | `Button(onClick)` |
| `.padding(24)` | `padding: 24` | `Modifier.padding(24.dp)` |

**Los modificadores** (`.font`, `.padding`, `.foregroundStyle`) se encadenan con puntos, y **el orden importa**: `.padding().background(.green)` pinta el aire de verde; `.background(.green).padding()` pinta solo el texto y deja el aire afuera. Es como envolver un regalo: cada modificador es una capa más.

**`Button("Deshacer") { jornada.deshacer() }`** es la closure al final de la clase 99: lo que pasa al tocarlo. Y `.disabled(jornada.viajes.isEmpty)` lo apaga cuando no hay nada que deshacer: el botón **dice la verdad** sobre lo que se puede hacer.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que muestra la pantalla, calculado afuera
lenguaje: swift
pide: En "Mi jornada" la pantalla no decide nada: pregunta. Completa `puedeDeshacer(_ viajes:)` (verdadero si hay al menos un viaje: es lo que apaga el botón), y `enReales(_ valor:)`, que devuelve el valor como en Brasil: `18.5` → `"R$ 18,50"`. Pista: `String(format: "%.2f", valor)` da `"18.50"`, y `.replacingOccurrences(of: ".", with: ",")` cambia el punto por coma.
--- código
func puedeDeshacer(_ viajes: [Double]) -> Bool {
    return true // tu código aquí
}

func enReales(_ valor: Double) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("sin viajes no se puede deshacer") { igual(puedeDeshacer([]), false) }
prueba("con viajes, sí") { igual(puedeDeshacer([18]), true) }
prueba("en reales") { igual(enReales(18.5), "R$ 18,50") }
prueba("redondo") { igual(enReales(37), "R$ 37,00") }
--- solución
func puedeDeshacer(_ viajes: [Double]) -> Bool {
    return !viajes.isEmpty
}

func enReales(_ valor: Double) -> String {
    return "R$ " + String(format: "%.2f", valor).replacingOccurrences(of: ".", with: ",")
}
```

```practica
vf :: Una pantalla de SwiftUI es un struct que cumple el protocolo View, y lo único que pide es body
vf :: En SwiftUI, el orden de los modificadores no cambia nada
elige :: ¿Qué es VStack? :: Una lista que se puede desplazar :: Una pila vertical: pone las cosas una encima de otra :: Un botón
escribe :: ¿Por qué el botón Deshacer tiene .disabled(jornada.viajes.isEmpty)? :: Para que se apague cuando no hay nada que deshacer: el botón muestra lo que de verdad se puede hacer, y la persona no toca algo que no hace nada.
```

## Parte 3. @State, y lo que se encontró mirando

> 🌎 **En la vida real:** el marcador de un partido: cada vez que hay un gol, el tablero se actualiza solo. Nadie tiene que ir a borrar y escribir el número a mano.

> 🌎 **Otro ejemplo:** Es como una pizarra que se reescribe sola cuando cambia lo que anota el mesero.

¿Cómo sabe SwiftUI que tiene que volver a dibujar cuando tocas "＋ Viaje"? Por **`@State`**:

```swift
struct PantallaJornada: View {
    @State private var jornada = Jornada()     // cuando cambia, SwiftUI vuelve a dibujar
    @State private var valor = 18.0

    var body: some View {
        Text(jornada.total.enReales)           // se lee
        Stepper("Este viaje: \(valor.enReales)", value: $valor, in: 0.5...200, step: 0.5)
        Button("＋ Viaje") { jornada.anotar(valor) }   // se cambia → se vuelve a dibujar
    }
}
```

- **`@State`** es el `useState` de React (clase 55) y el `mutableStateOf` de Compose (clase 66): un dato que, cuando cambia, hace que la pantalla se vuelva a dibujar.
- **`$valor`** (con `$`) le pasa al `Stepper` **la conexión** al dato, no una copia: así el `Stepper` lo puede cambiar. Sin `$`, le pasarías el número 18 y nada más.
- **`private`**: el estado es de esta pantalla; nadie de afuera lo toca.

**Lo que se encontró mirándola en el simulador.** Con todo compilando, se anotaron dos viajes (R$ 18 y R$ 19): total R$ 37,00, promedio R$ 18,50. Bien. Después se tocó "Deshacer" y apareció:

```text
1 viajes · promedio R$ 18,00
```

**"1 viajes"**. Ninguna cuenta estaba mal: el error era de **texto**. La pantalla tenía `Text("\(jornada.viajes.count) viajes · …")`. El arreglo **no** fue en la pantalla, sino en la lógica: un `resumen` en `Jornada` que dice "1 viaje" o "2 viajes", y la pantalla solo lo muestra con `Text(jornada.resumen)`. Así, ese texto **se puede probar sin abrir el simulador** (es el ejercicio de esta parte, y en la clase 105 va a tener su prueba en Xcode).

> 💡 **Idea:** cada vez que algo de la pantalla tiene una regla (el plural, el formato de la plata, cuándo se apaga un botón), sácalo a la lógica. La pantalla que solo muestra es fácil de leer; la lógica sin pantalla es fácil de probar. Es lo mismo que en la calculadora (clases 94 a 96).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: "1 viaje", no "1 viajes"
lenguaje: swift
pide: Completa `cuantos(_ n: Int)`: `"Sin viajes todavía"` si es 0, `"1 viaje"` si es 1, y `"5 viajes"` para los demás. Después `resumen(viajes:promedio:)`, que junta lo anterior con el promedio: `"2 viajes · promedio R$ 18.5"` (con `\( )`). Cuando no hay viajes, solo `"Sin viajes todavía"`, sin promedio.
--- código
func cuantos(_ n: Int) -> String {
    return "" // tu código aquí
}

func resumen(viajes: Int, promedio: Double) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("cero") { igual(cuantos(0), "Sin viajes todavía") }
prueba("uno, en singular") { igual(cuantos(1), "1 viaje") }
prueba("varios") { igual(cuantos(5), "5 viajes") }
prueba("el resumen") { igual(resumen(viajes: 2, promedio: 18.5), "2 viajes · promedio R$ 18.5") }
prueba("el resumen de uno") { igual(resumen(viajes: 1, promedio: 18), "1 viaje · promedio R$ 18.0") }
prueba("sin viajes, sin promedio") { igual(resumen(viajes: 0, promedio: 0), "Sin viajes todavía") }
--- solución
func cuantos(_ n: Int) -> String {
    switch n {
    case 0: return "Sin viajes todavía"
    case 1: return "1 viaje"
    default: return "\(n) viajes"
    }
}

func resumen(viajes: Int, promedio: Double) -> String {
    if viajes == 0 { return cuantos(0) }
    return "\(cuantos(viajes)) · promedio R$ \(promedio)"
}
```

```practica
vf :: Con @State, cuando el dato cambia, SwiftUI vuelve a dibujar la pantalla sola
vf :: El error de "1 viajes" se arregló cambiando la pantalla, porque era un problema de cómo se veía
elige :: ¿Qué quiere decir el $ en Stepper(…, value: $valor)? :: Que valor es plata :: Que se le pasa la conexión al dato, para que el Stepper lo pueda cambiar :: Que valor es opcional
escribe :: ¿Por qué conviene que una regla como el plural de "viaje" esté en la lógica y no en la pantalla? :: Porque en la lógica se puede probar sin abrir la app, se usa igual desde cualquier pantalla, y la pantalla queda corta y fácil de leer: solo muestra lo que le dan.
```


**Comprobación antes de seguir**

Confirma en una Mac con Xcode que el simulador abre la pantalla inicial antes de editar el estado.

<details>
<summary>Necesito una pista</summary>

Cambia un texto visible y comprueba que el simulador refleja el cambio.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo funciona SwiftUI?":** "Una pantalla es un struct que cumple `View` y describe en `body` qué se dibuja, con pilas como `VStack` y `HStack` y modificadores encadenados, donde el orden importa. El estado va en `@State`: cuando cambia, SwiftUI vuelve a dibujar; con `$` le paso a un control la conexión al dato. Mantengo la pantalla sin reglas: en mi primera app, 'Mi jornada', el texto '1 viajes' lo encontré mirándola en el simulador, y lo arreglé moviendo el resumen a la lógica, donde se puede probar."

> 🌎 **En la vida real:** es como explicar cómo funciona una vitrina con cartel automático: tú cambias el precio en el sistema y el cartel se actualiza solo.

> 🌎 **Otro ejemplo:** Es como contar tu primer día atendiendo un mostrador: qué preparaste antes, qué hiciste, y qué error viste y corregiste.
