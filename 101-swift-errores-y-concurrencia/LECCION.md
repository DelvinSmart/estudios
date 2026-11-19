# Swift 5: errores y concurrencia

> 🌎 **En la vida real:** cuando pides un taxi, pueden pasar dos cosas raras: que **no haya** taxis (un error, y hay que decirte por qué) y que **tarde** (mientras tanto, sigues usando el teléfono). Esta clase es sobre esas dos cosas.

> 🎙️ **El profesor dice:** {{alumno}}, hoy cómo Swift maneja **lo que sale mal** (`throws`, `try`, `do-catch`) y **lo que tarda** (`async`, `await`). Son las dos cosas que separan una app de demo de una que usa gente de verdad: sin internet, con datos raros, con una respuesta que tarda tres segundos.

## Parte 1. throws, try y do-catch

> 🌎 **En la vida real:** el cajero automático: si no tienes saldo, no te da billetes de mentira; te muestra **por qué** no puede ("saldo insuficiente", "tarjeta vencida").

> 🌎 **Otro ejemplo:** Es como un formulario del banco que te lo devuelven con una nota: "falta la firma". No te dicen solo "está mal": te dicen qué.

Una función que puede fallar lo dice con **`throws`**, y cuando falla **lanza** un error con `throw`. Los errores se escriben como un `enum` (clase 100) que cumple el protocolo `Error`:

```swift
enum ErrorDeViaje: Error {
    case sinKm
    case valorNegativo(Double)
}

func validar(km: Double, valor: Double) throws -> Double {
    guard km > 0 else { throw ErrorDeViaje.sinKm }
    guard valor >= 0 else { throw ErrorDeViaje.valorNegativo(valor) }
    return valor / km                       // lo que se gana por km
}
```

Quien la llama **tiene que** escribir `try` delante (si no, no compila: Swift no te deja ignorar que puede fallar) y atrapar el error con **`do-catch`**:

```swift
do {
    let porKm = try validar(km: 0, valor: 30)
    print("R$ \(porKm) por km")
} catch ErrorDeViaje.sinKm {
    print("Escribe los km del viaje")
} catch {
    print("Algo salió mal: \(error)")       // cualquier otro error
}
```

Es el `try`/`catch` de TypeScript y de Kotlin, con dos diferencias que ayudan:
- La palabra `try` aparece **en la línea exacta** que puede fallar: leyendo el código, sabes dónde mirar.
- `throws` está **en la firma** de la función: no te enteras recién cuando la app ya se cayó.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lanzar y atrapar errores
lenguaje: swift
pide: Completa `validar(km:valor:)`: si `km` no es mayor que 0, lanza `ErrorDeViaje.sinKm`; si `valor` es negativo, lanza `ErrorDeViaje.valorNegativo`; si está bien, devuelve `valor / km`. Después `mensaje(km:valor:)`, que llama a `validar` con `try` dentro de un `do-catch` y devuelve `"R$ 2.5 por km"`, `"Escribe los km del viaje"` o `"El valor no puede ser negativo"`.
--- código
enum ErrorDeViaje: Error {
    case sinKm
    case valorNegativo
}

func validar(km: Double, valor: Double) throws -> Double {
    return 0 // tu código aquí
}

func mensaje(km: Double, valor: Double) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("bien") { igual(mensaje(km: 12, valor: 30), "R$ 2.5 por km") }
prueba("sin km") { igual(mensaje(km: 0, valor: 30), "Escribe los km del viaje") }
prueba("valor negativo") { igual(mensaje(km: 12, valor: -5), "El valor no puede ser negativo") }
prueba("validar lanza el error correcto") { igual((try? validar(km: 0, valor: 30)) == nil, true) }
--- solución
enum ErrorDeViaje: Error {
    case sinKm
    case valorNegativo
}

func validar(km: Double, valor: Double) throws -> Double {
    guard km > 0 else { throw ErrorDeViaje.sinKm }
    guard valor >= 0 else { throw ErrorDeViaje.valorNegativo }
    return valor / km
}

func mensaje(km: Double, valor: Double) -> String {
    do {
        let porKm = try validar(km: km, valor: valor)
        return "R$ \(porKm) por km"
    } catch ErrorDeViaje.sinKm {
        return "Escribe los km del viaje"
    } catch {
        return "El valor no puede ser negativo"
    }
}
```

```practica
vf :: En Swift, para llamar a una función que tiene throws hay que escribir try, si no, no compila
vf :: Un error en Swift es un texto suelto, como "falló"
elige :: ¿Qué ventaja tiene que throws esté en la firma de la función? :: Que la función corre más rápido :: Que quien la usa sabe que puede fallar antes de que pase :: Que no hace falta catch
escribe :: ¿Por qué conviene que los errores sean un enum (sinKm, valorNegativo) y no un texto? :: Porque así quien lo atrapa puede decidir qué hacer en cada caso (pedir los km, avisar del valor), y el switch o los catch no se olvidan de ninguno. Un texto solo se puede mostrar.
```

## Parte 2. try? y try!: tres formas de llamar

> 🌎 **En la vida real:** cuando llamas a alguien: puedes esperar a que conteste y, si no, dejar un mensaje (`do-catch`); colgar y seguir con tu día si no contesta (`try?`); o jurar que **siempre** contesta (`try!`), y si no, quedarte trabado.

> 🌎 **Otro ejemplo:** Es como pedir un pedido por app: o esperas el aviso de qué pasó, o te alcanza con saber si llegó o no.

No siempre hace falta saber **qué** error pasó. A veces alcanza con "salió o no salió":

| Forma | Si sale bien | Si falla |
|---|---|---|
| `try` (dentro de `do-catch`) | el valor | se atrapa en el `catch`, con el error |
| `try?` | el valor, como **opcional** | `nil` (el error se pierde) |
| `try!` | el valor | **la app se cierra** |

```swift
let porKm = try? validar(km: 0, valor: 30)        // nil: no se pudo, y no importa por qué
let seguro = (try? validar(km: 0, valor: 30)) ?? 0 // 0 si falló: el ?? de la clase 98
```

`try?` convierte un error en un **opcional**, y desde ahí se usa todo lo de la clase 98: `if let`, `guard let`, `??`.

**`try!` es el `!` de los errores** (clase 98): si falla, la app se cierra. Misma regla: no lo uses salvo que puedas explicar por qué **nunca** va a fallar.

> 💡 **Idea:** usa `do-catch` cuando la persona **necesita saber** qué pasó ("escribe los km"). Usa `try?` cuando el error **no cambia nada** para ella (por ejemplo, una foto de perfil que no se pudo bajar: se muestra la de siempre).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cuando alcanza con saber si salió
lenguaje: swift
pide: Ya está `leerLitros(_:)`, que lanza un error si el texto no es un número positivo. Completa `litrosOCero(_:)` con `try?` y `??`: devuelve los litros o `0`. Después `totalValido(_ textos:)`: suma solo los textos que se pudieron leer (pista: `compactMap { try? leerLitros($0) }` descarta los `nil`).
--- código
enum ErrorDeLitros: Error { case noEsNumero }

func leerLitros(_ texto: String) throws -> Double {
    guard let n = Double(texto), n > 0 else { throw ErrorDeLitros.noEsNumero }
    return n
}

func litrosOCero(_ texto: String) -> Double {
    return -1 // tu código aquí
}

func totalValido(_ textos: [String]) -> Double {
    return -1 // tu código aquí
}
--- pruebas
prueba("un número") { igual(litrosOCero("40"), 40) }
prueba("letras: 0") { igual(litrosOCero("mucho"), 0) }
prueba("negativo: 0") { igual(litrosOCero("-3"), 0) }
prueba("sumar solo lo válido") { igual(totalValido(["40", "nada", "10.5", "-2"]), 50.5) }
--- solución
enum ErrorDeLitros: Error { case noEsNumero }

func leerLitros(_ texto: String) throws -> Double {
    guard let n = Double(texto), n > 0 else { throw ErrorDeLitros.noEsNumero }
    return n
}

func litrosOCero(_ texto: String) -> Double {
    return (try? leerLitros(texto)) ?? 0
}

func totalValido(_ textos: [String]) -> Double {
    return textos.compactMap { try? leerLitros($0) }.reduce(0, +)
}
```

```practica
vf :: try? convierte un error en nil, y el resultado se puede abrir con if let o ??
vf :: try! es la forma más segura de llamar a una función que puede fallar
elige :: Una foto de perfil no se pudo bajar. ¿Qué conviene? :: try! :: try?, y mostrar la foto de siempre :: do-catch con un aviso
escribe :: ¿Cuándo usarías do-catch en vez de try?? :: Cuando la persona necesita saber qué pasó para corregirlo (por ejemplo, "escribe los km"), porque try? pierde el error y solo deja nil.
```

## Parte 3. async y await: lo que tarda

> 🌎 **En la vida real:** pides el almuerzo por la app y, mientras llega, sigues trabajando. No te quedas parado mirando la puerta. Cuando llega, te avisan.

> 🌎 **Otro ejemplo:** Es como poner dos ollas en dos hornallas al mismo tiempo: la comida está lista en el tiempo de la que más tarda, no en la suma de las dos.

Traer datos de internet tarda. Si la app **esperara parada**, la pantalla se congelaría. Una función que tarda se marca con **`async`**, y quien la llama espera con **`await`**: mientras tanto, la app sigue respondiendo.

```swift
func traerGanancias(de app: String) async -> Double {
    // aquí iría el pedido a internet; tarda
}

let uber = await traerGanancias(de: "Uber")
```

Es el `async`/`await` de TypeScript (clase 49) y de Kotlin (clase 65), casi con las mismas palabras.

**Dos cosas al mismo tiempo: `async let`.** Si escribes dos `await` seguidos, el segundo empieza cuando termina el primero. Con `async let`, **los dos empiezan ya**, y esperas al final:

```swift
async let uber = traerGanancias(de: "Uber")
async let noventaYNueve = traerGanancias(de: "99")
let total = await uber + noventaYNueve      // espera a los dos, que corrieron juntos
```

Si cada una tarda 1 segundo, con dos `await` seguidos tardas 2; con `async let`, 1. Es el `Promise.all` de JavaScript (clase 49).

**`Task`: empezar algo async desde un lugar que no lo es.** Un botón de SwiftUI no es `async`. Para llamar a algo que tarda al tocarlo:

```swift
Button("Actualizar") {
    Task { total = await traerGanancias(de: "Uber") }
}
```

> 📌 **Nota:** Swift también tiene los **`actor`**: tipos que no dejan que dos tareas cambien sus datos a la vez (el problema clásico de dos cajeros sacando del mismo saldo al mismo tiempo). Lo importante para empezar: SwiftUI dibuja la pantalla desde un lugar que se llama **`@MainActor`**, y Swift te avisa si intentas cambiar la pantalla desde otro lado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dos pedidos al mismo tiempo
lenguaje: swift
pide: Ya está `traer(_ app:)`, que tarda 0,4 segundos (como un pedido a internet). Completa `total()` para que traiga `"Uber"` y `"99"` **al mismo tiempo** con `async let`, y devuelva la suma. Las pruebas miden el tiempo: con dos `await` seguidos tardaría 0,8 segundos y falla.
--- código
func traer(_ app: String) async -> Double {
    try? await Task.sleep(nanoseconds: 400_000_000)
    return app == "Uber" ? 120 : 80
}

func total() async -> Double {
    return 0 // tu código aquí
}
--- pruebas
let inicio = Date()
let resultado = await total()
let segundos = Date().timeIntervalSince(inicio)
prueba("la suma de las dos") { igual(resultado, 200) }
prueba("al mismo tiempo (menos de 0,7 s)") { ok(segundos < 0.7, "tardó \(String(format: "%.1f", segundos)) s: ¿usaste async let?") }
--- solución
func traer(_ app: String) async -> Double {
    try? await Task.sleep(nanoseconds: 400_000_000)
    return app == "Uber" ? 120 : 80
}

func total() async -> Double {
    async let uber = traer("Uber")
    async let otra = traer("99")
    return await uber + otra
}
```

```practica
vf :: Con async let, dos pedidos empiezan al mismo tiempo y se espera a los dos al final
vf :: Una función async congela la pantalla mientras espera
elige :: Un botón de SwiftUI tiene que llamar a algo async. ¿Cómo? :: Escribiendo await directo en el botón :: Envolviéndolo en Task { … } :: No se puede
escribe :: Tienes que traer las ganancias de Uber, de 99 y de inDrive, y cada pedido tarda 1 segundo. ¿Cómo lo harías y cuánto tardaría? :: Con tres async let, uno por app, y un solo await al sumar. Los tres empiezan juntos, así que tardaría alrededor de 1 segundo en vez de 3.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas errores y tareas que tardan en Swift?":** "Las funciones que pueden fallar llevan `throws` en la firma, los errores son un `enum` que cumple `Error`, y quien llama usa `try` dentro de un `do-catch` cuando la persona necesita saber qué pasó, o `try?` cuando alcanza con saber si salió. Evito `try!`. Para lo que tarda uso `async`/`await`, y `async let` para hacer varios pedidos al mismo tiempo, como un `Promise.all`. Desde la pantalla, que no es async, lo empiezo con un `Task`, y la pantalla se cambia en el `@MainActor`."

> 🌎 **En la vida real:** es como explicar cómo atiende un buen mostrador: si algo falta, te dice qué; y si algo tarda, te deja seguir con lo tuyo y te avisa cuando está.

> 🌎 **Otro ejemplo:** Es como contar cómo organizas la cocina de un restaurante: varias ollas al mismo tiempo, y un aviso claro cuando algo se quema.
