# Swift 9: pruebas, e instalar la app en tu iPhone

> 🌎 **En la vida real:** antes de entregar un carro arreglado, el mecánico lo prueba: frena, dobla, acelera. Y después te da las llaves. Hoy, las dos cosas: probar "Mi jornada" con pruebas automáticas, y llevarla a tu iPhone.

> 🎙️ **El profesor dice:** {{alumno}}, hiciste pruebas en JavaScript (Vitest y Jest), en Kotlin (JUnit) y en Python (pytest). Hoy, en Swift, con **Swift Testing**, lo nuevo de Apple. Vas a ver algo que ya conoces bien: que pasen todas no alcanza; hay que **romper el código a propósito** para ver que te avisen. Y al final, cómo instalar la app gratis en tu iPhone.

**Lo que hay** (en la carpeta `105-swift-pruebas-e-instalar/proyecto`): la app de la clase 104, con una carpeta nueva, `PruebasMiJornada/`, con **10 pruebas** (14 casos) que corren en el simulador.

```bash
cd estudios/105-swift-pruebas-e-instalar/proyecto
xcodebuild test -scheme MiJornada -destination 'platform=iOS Simulator,name=iPhone 17'
# o en Xcode: ⌘U
```

## Parte 1. Swift Testing: @Test y #expect

> 🌎 **En la vida real:** la lista de control del piloto antes de despegar: cada punto se revisa siempre igual, y si uno falla, no se despega.

> 🌎 **Otro ejemplo:** Es como el control de calidad de una fábrica: cada producto pasa por las mismas revisiones antes de salir.

```swift
import Testing
@testable import MiJornada            // deja que las pruebas vean el código de la app

@Suite("El diario")
struct DiarioTests {
    @Test("anotar suma el total y pone el más nuevo primero")
    func anotar() {
        let diario = Diario(guardado: GuardadoEnMemoria())
        diario.anotar(valor: 18, app: "Uber")
        diario.anotar(valor: 25.5, app: "99")
        #expect(diario.total == 43.5)
        #expect(diario.viajes.map(\.app) == ["99", "Uber"])
    }
}
```

| Swift Testing | Jest (clase 60) | JUnit (clase 67) |
|---|---|---|
| `@Test("nombre") func …` | `test('nombre', () => …)` | `@Test fun \`nombre\`()` |
| `#expect(a == b)` | `expect(a).toBe(b)` | `assertEquals(b, a)` |
| `@Suite("…") struct` | `describe('…', …)` | `class …Test` |

`#expect` es una sola palabra para todo: le das una condición y, si falla, **te muestra los valores** que había. Fíjate en `GuardadoEnMemoria()`: es el protocolo de la clase 103 rindiendo frutos. El diario se prueba **sin** el teléfono de verdad.

**Dónde viven.** En Xcode, las pruebas son un **target** aparte (una segunda "cosa que se arma"): `PruebasMiJornada`. Se crea en *File → New → Target… → Unit Testing Bundle*, eligiendo **Swift Testing**. Se corren con **⌘U** y el resultado se ve con un ✔ o un ✘ al lado de cada prueba.

**Las pruebas de lo que se encontró mirando.** Cada cosa que apareció en el simulador en las clases 102 a 104 tiene ahora su prueba, para que **no vuelva**:

```swift
@Test("la línea chica muestra el promedio, no el total (clase 104)")
func promedioNoTotal() {
    let diario = Diario(guardado: GuardadoEnMemoria())
    for v in [23.5, 18, 31, 12.5] { diario.anotar(valor: v, app: "Uber") }
    #expect(diario.resumen.contains("21,25"))
    #expect(!diario.resumen.contains("85"))
}
```

**Resultado:** `Test run with 10 tests in 3 suites passed`, en el simulador del iPhone, en unos 30 segundos (casi todo es armar la app; las pruebas tardan 0,02 s).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las pruebas de lo que se encontró mirando
lenguaje: swift
pide: Estas pruebas son las de los errores que se encontraron en el simulador (clases 102 a 104). Completa `resumen(_ valores:)` para que pasen todas: sin viajes, `"Sin viajes todavía"`; con uno, `"1 viaje · promedio R$ 18.0"`; con varios, `"2 viajes · promedio R$ 20.0"` (con el promedio, nunca el total). Lee las pruebas primero: son la especificación.
--- código
func resumen(_ valores: [Double]) -> String {
    return "\(valores.count) viajes" // tu código aquí
}
--- pruebas
prueba("singular: no \"1 viajes\" (clase 102)") { igual(resumen([18]), "1 viaje · promedio R$ 18.0") }
prueba("plural") { igual(resumen([18, 22]), "2 viajes · promedio R$ 20.0") }
prueba("no repite el total (clase 104)") { ok(!resumen([18, 22]).contains("40"), "el total ya se ve grande arriba") }
prueba("sin viajes (clase 103)") { igual(resumen([]), "Sin viajes todavía") }
--- solución
func resumen(_ valores: [Double]) -> String {
    if valores.isEmpty { return "Sin viajes todavía" }
    let promedio = valores.reduce(0, +) / Double(valores.count)
    let cuantos = valores.count == 1 ? "1 viaje" : "\(valores.count) viajes"
    return "\(cuantos) · promedio R$ \(promedio)"
}
```

```practica
vf :: En Swift Testing, #expect recibe una condición y, si falla, muestra los valores que había
vf :: Las pruebas de "Mi jornada" necesitan el teléfono de verdad para guardar los viajes
elige :: ¿Para qué sirve @testable import MiJornada? :: Para que la app corra más rápido :: Para que las pruebas puedan ver el código de la app que no es público :: Para instalar la app
escribe :: ¿Por qué cada error que se encontró mirando la app (como "1 viajes") tiene ahora su propia prueba? :: Para que no vuelva: si alguien cambia el texto mañana y reaparece el error, la prueba falla antes de que lo vea una persona.
```

## Parte 2. Romper a propósito y pruebas con una tabla de casos

> 🌎 **En la vida real:** para probar una alarma, la haces sonar a propósito. Si nunca la probaste, no sabes si funciona: solo sabes que nunca sonó.

> 🌎 **Otro ejemplo:** Es como el simulacro de incendio de una escuela: se hace a propósito para saber que, el día que pase de verdad, todo funciona.

**Pasaron las 10 a la primera.** ¿Quiere decir que sirven? No: quiere decir que el código hace lo que las pruebas preguntan (la lección de las clases 90 y 94). Para saber si **atrapan** errores, se rompió el código a propósito: se le sacó al diario la línea `guard valor > 0 else { return }`. Resultado:

```text
✘ Test "un valor de 0 o negativo no se anota" recorded an issue with 1 argument valor → 0.0:
  Expectation failed: diario.viajes.isEmpty
✘ … with 1 argument valor → -5.0 …
✘ … with 1 argument valor → -0.01 …
✘ Test run with 10 tests in 3 suites failed with 3 issues.
```

La prueba **avisó**, y dijo **con qué valores**. Se volvió a poner la línea, y todo en verde. Eso sí prueba que la prueba sirve.

**¿Por qué dijo tres valores?** Porque esa prueba usa una **tabla de casos** (`arguments:`): una sola prueba, corrida con cada valor de la lista.

```swift
@Test("un valor de 0 o negativo no se anota", arguments: [0.0, -5, -0.01])
func valoresMalos(valor: Double) {
    let diario = Diario(guardado: GuardadoEnMemoria())
    diario.anotar(valor: valor, app: "Uber")
    #expect(diario.viajes.isEmpty)
}
```

Es el `test.each` de Jest y el `@pytest.mark.parametrize` de pytest. Sirve para los **bordes**: el 0, un negativo, uno apenas negativo (`-0.01`). Los errores viven en los bordes.

> 💡 **Idea:** romper a propósito no se hace en cada prueba, todos los días. Se hace **cuando escribes una prueba nueva** y no la viste fallar nunca: si escribiste la prueba después del código y pasó a la primera, rómpelo una vez para ver que avisa.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Arreglar el código que se rompió a propósito
lenguaje: swift
pide: Este es el diario **roto a propósito**: le falta la regla del valor. Las pruebas, con una tabla de casos, lo atrapan. Arréglalo: `anotar(_:)` solo agrega el valor si es mayor que 0. Mira cómo cada caso de la tabla es una prueba con su nombre.
--- código
struct Diario {
    private(set) var valores: [Double] = []
    mutating func anotar(_ valor: Double) {
        valores.append(valor)   // falta la regla: ROTO A PROPÓSITO
    }
}
--- pruebas
for malo in [0.0, -5, -0.01] {
    prueba("no se anota \(malo)") { var d = Diario(); d.anotar(malo); igual(d.valores, []) }
}
for bueno in [0.01, 18, 200] {
    prueba("sí se anota \(bueno)") { var d = Diario(); d.anotar(bueno); igual(d.valores, [bueno]) }
}
--- solución
struct Diario {
    private(set) var valores: [Double] = []
    mutating func anotar(_ valor: Double) {
        guard valor > 0 else { return }
        valores.append(valor)
    }
}
```

```practica
vf :: Si una prueba pasa a la primera y nunca la viste fallar, no sabes si de verdad atrapa errores
vf :: Una prueba con arguments: [0.0, -5, -0.01] corre una sola vez, con el primer valor
elige :: ¿Por qué la tabla de casos tiene 0, -5 y -0.01? :: Porque son números al azar :: Porque son los bordes: el cero, un negativo y uno apenas negativo :: Porque Swift lo pide
escribe :: ¿Cuándo conviene romper el código a propósito? :: Cuando escribes una prueba nueva que nunca viste fallar (por ejemplo, si la escribiste después del código y pasó a la primera): la rompes una vez para ver que avisa, y después vuelves a dejar el código bien.
```

## Parte 3. Instalar la app en tu iPhone, gratis

> 🌎 **En la vida real:** el simulador es el auto de la autoescuela; tu iPhone es tu auto. Hasta que no manejas el tuyo, no sabes cómo se siente.

> 🌎 **Otro ejemplo:** Es como probar una receta en tu cocina después de verla en un video: recién ahí sabes si sale.

Con una **cuenta gratuita** de Apple (la misma del iPhone) puedes instalar tu app en **tu** iPhone, desde la Mac. **Lista de comprobación:**

- [ ] En Xcode: **Settings → Accounts → +** → tu Apple ID.
- [ ] En el proyecto, el target **MiJornada** → pestaña **Signing & Capabilities** → **Team:** tu nombre (*Personal Team*). Si el *Bundle Identifier* choca con otro, cámbialo por uno tuyo (`com.tunombre.mijornada`): es la identidad de la app, como en la clase 96.
- [ ] Conecta el iPhone con el cable. La primera vez, en el iPhone: **Confiar en esta computadora**, y activa el **Modo de desarrollador** (*Ajustes → Privacidad y seguridad → Modo de desarrollador*; el iPhone se reinicia).
- [ ] Arriba en Xcode, elige **tu iPhone** en vez del simulador, y **▶**.
- [ ] La primera vez, el iPhone dice que no confía en el desarrollador: **Ajustes → General → VPN y gestión de dispositivos →** tu Apple ID **→ Confiar**. Abre la app.

**Lo que tienes que saber de la cuenta gratuita:**

| | Cuenta gratuita | Apple Developer Program |
|---|---|---|
| Cuesta | Nada | US$ 99 por año |
| Instalar en tu iPhone | Sí | Sí |
| Cuánto dura instalada | **7 días**: después no abre, y se vuelve a instalar con ▶ | 1 año |
| Dársela a otros para probar (TestFlight) | No | Sí |
| Publicarla en la App Store | No | Sí |

Para aprender y para tu propio uso, la gratuita alcanza: cada 7 días, la conectas y tocas ▶ otra vez. Pagar hace falta recién para publicar (como la cuenta de Google Play de la clase 20, que es un pago único de US$ 25).

> 📌 **Nota:** en esta clase, la app se probó en el **simulador**. El iPhone de verdad no estaba conectado a la Mac en ese momento, así que la lista de arriba es la de Apple, sin un caso real contado. Cuando la instales en el tuyo, anota qué pasó: eso es material para el `PROGRESO.md`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Cuántos días le quedan a la app?
lenguaje: swift
pide: Con la cuenta gratuita, la app dura 7 días. Completa `diasQueQuedan(instalada:hoy:)`: cuenta los días entre las dos fechas (`Calendar.current.dateComponents([.day], from:to:).day ?? 0`) y devuelve `7` menos eso, pero nunca menos de `0`. Después `aviso(_ dias:)`: con 0, `"Ya no abre: vuelve a instalarla desde Xcode"`; con 1, `"Le queda 1 día"`; con más, `"Le quedan 5 días"`.
--- código
func diasQueQuedan(instalada: Date, hoy: Date) -> Int {
    return 7 // tu código aquí
}

func aviso(_ dias: Int) -> String {
    return "" // tu código aquí
}
--- pruebas
let lunes = Date(timeIntervalSince1970: 1_800_000_000)
let dia: TimeInterval = 86_400
prueba("recién instalada") { igual(diasQueQuedan(instalada: lunes, hoy: lunes), 7) }
prueba("a los 2 días") { igual(diasQueQuedan(instalada: lunes, hoy: lunes + 2 * dia), 5) }
prueba("a los 10 días, 0 (no menos)") { igual(diasQueQuedan(instalada: lunes, hoy: lunes + 10 * dia), 0) }
prueba("el aviso de 0") { igual(aviso(0), "Ya no abre: vuelve a instalarla desde Xcode") }
prueba("singular") { igual(aviso(1), "Le queda 1 día") }
prueba("plural") { igual(aviso(5), "Le quedan 5 días") }
--- solución
func diasQueQuedan(instalada: Date, hoy: Date) -> Int {
    let pasaron = Calendar.current.dateComponents([.day], from: instalada, to: hoy).day ?? 0
    return max(0, 7 - pasaron)
}

func aviso(_ dias: Int) -> String {
    switch dias {
    case 0: return "Ya no abre: vuelve a instalarla desde Xcode"
    case 1: return "Le queda 1 día"
    default: return "Le quedan \(dias) días"
    }
}
```

```practica
vf :: Con una cuenta gratuita de Apple se puede instalar tu app en tu propio iPhone
vf :: Para instalar la app en tu iPhone hay que pagar los US$ 99 por año
elige :: La primera vez que abres tu app en el iPhone dice que no confía en el desarrollador. ¿Qué haces? :: La borras y la vuelves a instalar :: Ajustes → General → VPN y gestión de dispositivos → tu Apple ID → Confiar :: Pagas la cuenta de desarrollador
escribe :: ¿Por qué esta clase dice que la instalación en el iPhone no se probó, en vez de contarla como hecha? :: Porque el iPhone no estaba conectado a la Mac en ese momento: contarla como hecha sería mentir. Se explica la lista de Apple, y se anota que la prueba real queda para cuando se instale en el teléfono.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo pruebas una app de iOS?":** "La lógica va separada de la pantalla y detrás de protocolos, así la pruebo con Swift Testing sin el teléfono: `@Test`, `#expect` y tablas de casos con `arguments:` para los bordes. Cada error que encuentro mirando la app en el simulador se vuelve una prueba, para que no vuelva. Y cuando una prueba nueva pasa a la primera, rompo el código a propósito una vez para ver que avisa. Para instalar en mi iPhone uso la cuenta gratuita de Apple, que dura 7 días; para publicar o usar TestFlight hace falta el Developer Program, que cuesta US$ 99 por año."

> 🌎 **En la vida real:** es como explicar cómo revisa un mecánico: una lista fija de puntos, una prueba de manejo, y si algo falló una vez, lo revisa siempre.

> 🌎 **Otro ejemplo:** Es como contar cómo se prepara una obra de teatro: ensayos, un simulacro con público, y recién después el estreno.
