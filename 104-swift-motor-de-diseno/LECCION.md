# Swift 8: el motor de diseño en SwiftUI

> 🌎 **En la vida real:** una cadena de cafeterías tiene un manual: el verde exacto, el tamaño del logo, la distancia entre las mesas. Cada local lo **sigue**; por eso todas se ven iguales, y si un día cambia el verde, cambia en todas.

> 🎙️ **El profesor dice:** {{alumno}}, ya armaste motores de diseño en CSS (clase 16), en TypeScript (51), en React Native (56) y en Kotlin (66). Hoy, el de SwiftUI, en "Mi jornada": colores con modo claro y oscuro, separaciones, formas y letras en un solo archivo, y cada recuadro que lo **llama**. Más dos cosas que se encontraron mirando la app.

**Lo que hay** (en la carpeta `104-swift-motor-de-diseno/proyecto`): la app de la clase 103 con un archivo nuevo, `Motor.swift`, y la lista usándolo. Probada en el simulador en **modo claro y oscuro**.

## Parte 1. El motor: separaciones, formas y letras

> 🌎 **En la vida real:** la cinta métrica del carpintero: todas las medidas salen de ahí. Nadie corta "más o menos un palmo".

> 🌎 **Otro ejemplo:** Es como las tallas de ropa: S, M, L. Nadie pide "una camiseta de 47,3 cm"; elige una talla.

```swift
enum Motor {
    enum Espacio {
        static let chico: CGFloat = 8
        static let medio: CGFloat = 14
        static let grande: CGFloat = 20
    }
    enum Forma {
        static let radio: CGFloat = 16
        static let punto: CGFloat = 10
    }
    enum Letra {
        static let total = Font.system(size: 44, weight: .semibold, design: .rounded)
        static let chica = Font.subheadline
    }
}
```

Y en la pantalla, **nunca un número**: `.padding(Motor.Espacio.grande)`, `VStack(spacing: Motor.Espacio.chico)`.

**¿Por qué un `enum` sin casos?** Porque nadie tiene que crear "un motor": solo leer sus valores. Un `enum` sin casos **no se puede crear** (no hay `Motor()`), y eso es justo lo que se quiere: un lugar para guardar constantes con nombre. Es el `object Motor` de Kotlin (clase 66) y el `as const` de TypeScript.

**`CGFloat` y puntos.** Las medidas de SwiftUI son **puntos**, no píxeles: un punto se ve del mismo tamaño en un iPhone chico y en uno grande (en uno con más píxeles, un punto usa 3). Es el `dp` de Android.

**Lo que se encontró releyendo el código.** Con la app andando, se releyó la lista con una sola pregunta: "¿hay algún número escrito a mano?". Había uno: el puntito de color de cada app tenía `.frame(width: 10, height: 10)`. Se fue al motor como `Motor.Forma.punto`. **El motor solo sirve si no se le escapa nada**: un solo número suelto, y cambiar el diseño ya no es cambiar un archivo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Encontrar los números que se escaparon del motor
lenguaje: swift
pide: Escribe un revisor chico, como el que se hizo a mano. `escapados(_ codigo:)` recibe el código de una pantalla y devuelve las líneas (sin espacios al principio, con `trimmingCharacters(in: .whitespaces)`) que tienen un número escrito a mano en `.padding(`, `.frame(width:` o `spacing:`. Pista: `linea.range(of: patron, options: .regularExpression) != nil` con el patrón `"(\\.padding\\(|width: |spacing: )[0-9]"`.
--- código
func escapados(_ codigo: String) -> [String] {
    return [] // tu código aquí
}
--- pruebas
let pantalla = """
VStack(spacing: Motor.Espacio.chico) {
    Text("Hoy").padding(Motor.Espacio.grande)
    Circle().frame(width: 10, height: 10)
    HStack(spacing: 12) {
        Text("R$ 18").padding(13)
    }
}
"""
prueba("encuentra los tres") { igual(escapados(pantalla), ["Circle().frame(width: 10, height: 10)", "HStack(spacing: 12) {", "Text(\"R$ 18\").padding(13)"]) }
prueba("todo del motor: nada") { igual(escapados("VStack(spacing: Motor.Espacio.chico) {\n    Text(\"x\").padding(Motor.Espacio.medio)\n}"), []) }
--- solución
func escapados(_ codigo: String) -> [String] {
    let patron = "(\\.padding\\(|width: |spacing: )[0-9]"
    return codigo
        .split(separator: "\n")
        .map { $0.trimmingCharacters(in: .whitespaces) }
        .filter { $0.range(of: patron, options: .regularExpression) != nil }
}
```

```practica
vf :: En SwiftUI, el motor de diseño se puede escribir como un enum sin casos, con valores static
vf :: Si una sola pantalla tiene un número escrito a mano, no importa: el resto sigue usando el motor
elige :: ¿Por qué las medidas de SwiftUI son puntos y no píxeles? :: Porque son más chicos :: Para que se vean del mismo tamaño en un iPhone chico y en uno grande :: Porque Apple no deja usar píxeles → Es el dp de Android.
escribe :: ¿Cómo se encontró el número que se había escapado del motor en "Mi jornada"? :: Releyendo la lista con una sola pregunta: ¿hay algún número escrito a mano? Estaba el tamaño del puntito de color (10); se pasó al motor como Motor.Forma.punto.
```

## Parte 2. Colores con modo claro y oscuro

> 🌎 **En la vida real:** la ropa de día y la de noche: la misma persona, otra ropa según la hora. El color "acento" es uno solo, pero se viste distinto de día y de noche.

> 🌎 **Otro ejemplo:** Es como el modo noche del teléfono: no cambias cada app; cambias un ajuste y todo se adapta.

Cada color del motor tiene **dos versiones**, y el teléfono elige cuál:

```swift
extension Color {
    static let fondo   = Color(claro: 0xF5F7FA, oscuro: 0x0F141B)
    static let tarjeta = Color(claro: 0xFFFFFF, oscuro: 0x18212C)
    static let acento  = Color(claro: 0x1A7F37, oscuro: 0x7EE787)

    init(claro: UInt32, oscuro: UInt32) {
        self.init(uiColor: UIColor { rasgos in
            UIColor(hex: rasgos.userInterfaceStyle == .dark ? oscuro : claro)
        })
    }
}
```

- `extension Color` (clase 100) le agrega al `Color` de Apple **nuestros** colores, con nombre: en la pantalla se escribe `.foregroundStyle(Color.acento)`.
- `UIColor { rasgos in … }` es un color **que pregunta**: cada vez que se dibuja, mira si el teléfono está en modo oscuro (`rasgos.userInterfaceStyle == .dark`) y elige. Es el `useColorScheme()` de React Native (clase 56) y el `isSystemInDarkTheme()` de Compose (clase 66), pero **dentro del color**: la pantalla no tiene que preguntar nada.
- `0x7EE787` es el mismo verde `#7ee787` de todos los cursos: rojo `7E`, verde `E7`, azul `87`, en hexadecimal.

> 📌 **Nota:** Xcode tiene otra forma: el **catálogo de colores** (`Assets.xcassets`), donde eliges cada color con un selector y le pones su versión oscura. Hace lo mismo. Aquí van en código para leerlos todos juntos en un archivo, y para que se vean en este repositorio.

**El color de cada app.** El puntito de Uber es negro en modo claro y **blanco** en modo oscuro (un punto negro sobre fondo negro no se vería). Se decide en el motor, con un `switch`:

```swift
static func deApp(_ app: String) -> Color {
    switch app {
    case "Uber":    return Color(claro: 0x000000, oscuro: 0xFFFFFF)
    case "99":      return Color(claro: 0xE8B400, oscuro: 0xFFD21F)
    case "inDrive": return Color(claro: 0x5DA312, oscuro: 0xA2E35A)
    default:        return .tenue
    }
}
```

**Probado en el simulador**, en modo claro y después en oscuro (`xcrun simctl ui <simulador> appearance dark`, o en Xcode, el botón de apariencia de la vista previa): el fondo, las tarjetas, el verde y el punto de Uber cambiaron solos, sin tocar la pantalla.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un color hexadecimal, por dentro
lenguaje: swift
pide: Un color como `0x7EE787` guarda tres números de 0 a 255 juntos: rojo, verde y azul. Completa `componentes(_ hex:)`, que devuelve `[rojo, verde, azul]`: el rojo es `(hex >> 16) & 0xFF`, el verde `(hex >> 8) & 0xFF` y el azul `hex & 0xFF` (conviértelos con `Int(…)`). Después `hexDeApp(_ app:oscuro:)`: Uber es `0x000000` en claro y `0xFFFFFF` en oscuro; 99 es `0xE8B400` y `0xFFD21F`; cualquier otra, `0x8796AA`.
--- código
func componentes(_ hex: UInt32) -> [Int] {
    return [] // tu código aquí
}

func hexDeApp(_ app: String, oscuro: Bool) -> UInt32 {
    return 0 // tu código aquí
}
--- pruebas
prueba("el verde de los cursos") { igual(componentes(0x7EE787), [126, 231, 135]) }
prueba("negro") { igual(componentes(0x000000), [0, 0, 0]) }
prueba("blanco") { igual(componentes(0xFFFFFF), [255, 255, 255]) }
prueba("Uber, en claro y en oscuro") { igual([hexDeApp("Uber", oscuro: false), hexDeApp("Uber", oscuro: true)], [0x000000, 0xFFFFFF]) }
prueba("99 en oscuro") { igual(hexDeApp("99", oscuro: true), 0xFFD21F) }
prueba("otra app") { igual(hexDeApp("Taxi", oscuro: false), 0x8796AA) }
--- solución
func componentes(_ hex: UInt32) -> [Int] {
    return [Int((hex >> 16) & 0xFF), Int((hex >> 8) & 0xFF), Int(hex & 0xFF)]
}

func hexDeApp(_ app: String, oscuro: Bool) -> UInt32 {
    switch app {
    case "Uber": return oscuro ? 0xFFFFFF : 0x000000
    case "99": return oscuro ? 0xFFD21F : 0xE8B400
    default: return 0x8796AA
    }
}
```

```practica
vf :: Un color hecho con UIColor { rasgos in … } elige solo su versión clara u oscura cada vez que se dibuja
vf :: Para el modo oscuro hay que escribir cada pantalla dos veces
elige :: ¿Por qué el punto de Uber es blanco en modo oscuro? :: Porque Uber lo pide :: Porque un punto negro sobre un fondo oscuro no se vería :: Por error → Cada color se piensa en los dos modos.
escribe :: ¿Qué otra forma hay en Xcode de tener colores con modo claro y oscuro, además del código? :: El catálogo de colores (Assets.xcassets): se elige cada color con un selector y se le agrega su versión oscura. Hace lo mismo; en código se leen todos juntos en un archivo.
```

## Parte 3. Cada recuadro llama al motor: ViewModifier

> 🌎 **En la vida real:** el sello de una empresa: en vez de dibujar el logo a mano en cada papel, se usa el sello. Siempre sale igual, y si cambia el logo, se cambia el sello.

> 🌎 **Otro ejemplo:** Es como un molde de galletas: todas salen con la misma forma, sin medir cada una.

Una "tarjeta" en "Mi jornada" es siempre lo mismo: aire adentro, fondo de tarjeta, esquinas redondeadas. En vez de repetir esos tres modificadores en cada lugar, se hace **un modificador propio**:

```swift
struct Tarjeta: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(Motor.Espacio.grande)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.tarjeta, in: .rect(cornerRadius: Motor.Forma.radio))
    }
}

extension View {
    func tarjeta() -> some View { modifier(Tarjeta()) }
}
```

Y cualquier recuadro lo **llama** con una palabra:

```swift
VStack(alignment: .leading, spacing: Motor.Espacio.chico) {
    Text("Hoy").font(Motor.Letra.chica).foregroundStyle(Color.tenue)
    Text(diario.total.enReales).font(Motor.Letra.total).foregroundStyle(Color.acento)
    Text(diario.resumen).font(Motor.Letra.chica).foregroundStyle(Color.tenue)
}
.tarjeta()
```

Es el `estilos.tarjeta` de React Native y el `Modifier` de Compose: **la forma de una tarjeta vive en un solo lugar**.

**Lo que se encontró mirando la tarjeta.** La primera versión decía, grande, **R$ 85,00**, y debajo, chico, **"4 viajes · R$ 85,00"**: el total dos veces. Ninguna prueba lo ve (los dos números estaban bien). Se arregló en la lógica, no en la pantalla: el `resumen` del diario pasó a mostrar el **promedio** ("4 viajes · promedio R$ 21,25"). La línea chica ahora dice algo nuevo.

> 💡 **Idea:** en la clase 102 se encontró "1 viajes"; en la 103, "Sin viajes todavía" dos veces; hoy, el total dos veces y un número escapado del motor. **Cada pantalla nueva, mirada en el simulador, encontró algo que las pruebas no ven.** No es mala suerte: es el método.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La línea chica dice algo nuevo
lenguaje: swift
pide: Completa `resumen(_ valores:)`, la línea chica de la tarjeta. Sin viajes: `"Sin viajes todavía"`. Con uno: `"1 viaje · promedio R$ 18.0"`. Con varios: `"4 viajes · promedio R$ 21.25"`. El promedio es la suma dividida por la cantidad. **No** repitas el total: ya se ve grande arriba.
--- código
func resumen(_ valores: [Double]) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("sin viajes") { igual(resumen([]), "Sin viajes todavía") }
prueba("uno") { igual(resumen([18]), "1 viaje · promedio R$ 18.0") }
prueba("varios, con el promedio") { igual(resumen([23.5, 18, 31, 12.5]), "4 viajes · promedio R$ 21.25") }
prueba("no repite el total") { ok(!resumen([23.5, 18, 31, 12.5]).contains("85"), "el total (85) ya se ve grande arriba") }
--- solución
func resumen(_ valores: [Double]) -> String {
    if valores.isEmpty { return "Sin viajes todavía" }
    let promedio = valores.reduce(0, +) / Double(valores.count)
    let cuantos = valores.count == 1 ? "1 viaje" : "\(valores.count) viajes"
    return "\(cuantos) · promedio R$ \(promedio)"
}
```

```practica
vf :: Con un ViewModifier propio, la forma de una tarjeta vive en un solo lugar y cada recuadro la llama con .tarjeta()
vf :: Si los dos números de la tarjeta están bien calculados, la tarjeta está bien diseñada
elige :: ¿Dónde se arregló que el total apareciera dos veces? :: En la pantalla, borrando el texto :: En la lógica: el resumen del diario pasó a mostrar el promedio :: En el motor → Así el texto nuevo se puede probar sin abrir el simulador.
escribe :: En las clases 102, 103 y 104, ¿qué tienen en común las cosas que se encontraron mirando la app? :: Que ninguna era un error de cuenta: "1 viajes", un aviso repetido, el total dos veces y un número escapado del motor. Las pruebas no las ven porque todo estaba "bien"; aparecen mirando la app en el simulador, y cada pantalla nueva encontró algo.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo haces el diseño en SwiftUI?":** "Con un motor de diseño en un solo archivo: un `enum Motor` sin casos con las separaciones, formas y letras, y una `extension Color` con los colores con nombre, cada uno con su versión clara y oscura, usando un `UIColor` dinámico (o el catálogo de colores de Xcode). Las pantallas no escriben ningún número ni color a mano, y lo repetido, como una tarjeta, es un `ViewModifier` propio que se llama con `.tarjeta()`. Lo pruebo en el simulador en los dos modos, y releo cada pantalla buscando números escapados del motor."

> 🌎 **En la vida real:** es como explicar el manual de una cadena de tiendas: un solo documento, y cada local lo sigue.

> 🌎 **Otro ejemplo:** Es como el uniforme de un equipo: de día y de noche, los mismos colores del club, cada uno en su versión.
