# Swift 2: opcionales, decisiones y ciclos

> 🌎 **En la vida real:** cuando pides un paquete, la caja puede llegar con el producto **o vacía**. Antes de usar lo de adentro, la abres y miras. Swift te obliga a mirar.

> 🎙️ **El profesor dice:** {{alumno}}, hoy la idea más importante de Swift: los **opcionales**, los valores que pueden faltar. Si la entiendes, entiendes por qué las apps de iPhone se cierran solas mucho menos que antes. Después, `switch`, que no deja casos afuera, y los ciclos con rangos.

## Parte 1. Opcionales: un valor o nada

> 🌎 **En la vida real:** el campo "segundo nombre" de un formulario: algunas personas lo tienen y otras no. No es un texto vacío: es que **no hay**.

> 🌎 **Otro ejemplo:** Es como el casillero del correo: puede tener una carta o estar vacío. Antes de leer la carta, miras si hay.

En la clase 97 viste que `Int("doce")` no puede dar un número. En muchos lenguajes, eso termina en un error que **cierra la app** cuando menos lo esperas. Swift lo resuelve con un tipo especial: **`Int?`** (se lee "Int opcional"): un número **o** `nil` (nada).

```swift
let viajes: Int? = Int("12")     // 12
let otro: Int? = Int("doce")     // nil
```

Lo importante: **un `Int?` no es un `Int`**. No puedes sumarlo directo: Swift no compila hasta que mires si hay algo adentro. Hay dos formas de mirar:

**1. `if let`: si hay algo, úsalo.**

```swift
if let n = Int(textoDelFormulario) {
    print("Hiciste \(n) viajes")       // aquí adentro, n es un Int de verdad
} else {
    print("Eso no es un número")
}
```

**2. `??`: si no hay nada, usa esto otro** (el valor por defecto).

```swift
let viajes = Int(textoDelFormulario) ?? 0   // un Int: el número, o 0 si no se pudo
```

Es el mismo `??` de TypeScript, y el `?:` de Kotlin. Y el `String?` de Swift es el `string | null` de TypeScript o el `String?` de Kotlin (clase 62): **los tres lenguajes llegaron a la misma idea**.

> 💡 **Idea:** `nil` no es `0`, ni `""`. "No sé cuántos viajes hiciste" es distinto de "hiciste 0 viajes". Por eso existe: para no confundir **nada** con **cero**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer un número que escribió la persona
lenguaje: swift
pide: Completa `viajesDe(_ texto:)`: convierte el texto a `Int` con `Int(texto)` y, si no se puede, devuelve `0` (usa `??`). Después `mensaje(segundoNombre:)`: recibe un `String?`. Con `if let`, si hay segundo nombre devuelve `"Tu segundo nombre es Luis"`; si no, `"No tienes segundo nombre"`.
--- código
func viajesDe(_ texto: String) -> Int {
    return -1 // tu código aquí
}

func mensaje(segundoNombre: String?) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("un número") { igual(viajesDe("12"), 12) }
prueba("letras: 0") { igual(viajesDe("doce"), 0) }
prueba("vacío: 0") { igual(viajesDe(""), 0) }
prueba("con segundo nombre") { igual(mensaje(segundoNombre: "Luis"), "Tu segundo nombre es Luis") }
prueba("sin segundo nombre") { igual(mensaje(segundoNombre: nil), "No tienes segundo nombre") }
--- solución
func viajesDe(_ texto: String) -> Int {
    return Int(texto) ?? 0
}

func mensaje(segundoNombre: String?) -> String {
    if let nombre = segundoNombre {
        return "Tu segundo nombre es \(nombre)"
    } else {
        return "No tienes segundo nombre"
    }
}
```

```practica
vf :: Un Int? puede tener un número o nil, y Swift no deja usarlo como Int sin revisarlo antes
vf :: nil y 0 son lo mismo en Swift
elige :: ¿Qué hace Int(texto) ?? 0? :: Siempre devuelve 0 :: Devuelve el número si se pudo convertir, o 0 si no :: Cierra la app si el texto no es un número
escribe :: ¿Por qué Int("doce") devuelve un Int? y no un Int? :: Porque la conversión puede salir mal: con nil Swift dice "no se pudo", y obliga a revisarlo antes de usar el número, en vez de cerrar la app.
```

## Parte 2. guard let, y por qué evitar el !

> 🌎 **En la vida real:** el portero de un edificio: "¿Tienes llave? ¿No? Entonces no pasas". Revisa en la puerta, y adentro ya nadie pregunta.

> 🌎 **Otro ejemplo:** Es como el control de equipaje del aeropuerto: si algo falta, te frenan ahí, antes de subir al avión.

Cuando una función necesita **varios** datos que pueden faltar, los `if let` uno dentro de otro se vuelven una escalera difícil de leer. `guard let` hace lo contrario: **revisa en la puerta** y, si falta algo, **sale enseguida**:

```swift
func rendimiento(km kmTexto: String, litros litrosTexto: String) -> String {
    guard let km = Double(kmTexto) else { return "Escribe los km" }
    guard let litros = Double(litrosTexto), litros > 0 else { return "Escribe los litros" }
    // de aquí para abajo, km y litros son Double de verdad
    return "\(km / litros) km por litro"
}
```

Se lee de arriba abajo, como una lista de condiciones. El `else` de un `guard` **tiene** que salir (`return`), si no, no compila. Y fíjate en `, litros > 0`: después de abrirlo, se puede pedir una condición más en la misma línea.

**El `!` (forzar).** Swift también deja abrir un opcional **sin mirar**: `Int(texto)!`. Si había un número, funciona. Si había `nil`, **la app se cierra** ("Fatal error: Unexpectedly found nil"). Es la causa más común de que una app de iPhone se cierre sola.

```swift
let n = Int("doce")!    // 💥 Fatal error: Unexpectedly found nil while unwrapping an Optional value
```

**Regla del curso:** no uses `!` salvo que puedas explicar por qué **nunca** va a ser `nil`. Casi siempre hay una forma mejor: `if let`, `guard let` o `??`.

> 📌 **Nota:** en esta página, si tu código usa `!` sobre un `nil`, el programa se cae, y la prueba te dice en español "usaste ! en algo que era nil". Es el mismo error que verías en Xcode.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar en la puerta con guard
lenguaje: swift
pide: Completa `rendimiento(km:litros:)`, que recibe dos textos del formulario. Con `guard let`, si los km no son un número, devuelve `"Escribe los km"`. Si los litros no son un número **o** no son mayores que 0, devuelve `"Escribe los litros"`. Si está todo bien, devuelve `"12.5 km por litro"` (km ÷ litros, con `\( )`). No uses `!`.
--- código
func rendimiento(km: String, litros: String) -> String {
    return "" // tu código aquí
}
--- pruebas
prueba("todo bien") { igual(rendimiento(km: "500", litros: "40"), "12.5 km por litro") }
prueba("km con letras") { igual(rendimiento(km: "mucho", litros: "40"), "Escribe los km") }
prueba("sin litros") { igual(rendimiento(km: "500", litros: ""), "Escribe los litros") }
prueba("litros en 0 (no se divide)") { igual(rendimiento(km: "500", litros: "0"), "Escribe los litros") }
--- solución
func rendimiento(km: String, litros: String) -> String {
    guard let k = Double(km) else { return "Escribe los km" }
    guard let l = Double(litros), l > 0 else { return "Escribe los litros" }
    return "\(k / l) km por litro"
}
```

```practica
vf :: guard let revisa al principio y, si falta algo, sale enseguida; después el valor queda abierto para el resto de la función
vf :: Usar ! es la forma recomendada de abrir un opcional, porque es más corta
elige :: ¿Qué tiene que hacer el else de un guard? :: Nada, es opcional :: Salir de la función (con return) :: Imprimir un error
escribe :: Encuentras let n = Int(texto)! en una app. ¿Qué puede pasar y cómo lo arreglas? :: Si el texto no es un número, Int(texto) da nil y el ! cierra la app. Lo cambio por if let, guard let o Int(texto) ?? 0, según lo que tenga que pasar cuando no es un número.
```

## Parte 3. switch, rangos y for

> 🌎 **En la vida real:** el semáforo: verde, amarillo o rojo. No hay un cuarto color, y para cada uno sabes qué hacer.

> 🌎 **Otro ejemplo:** Es como el menú del ascensor: cada botón lleva a un piso, y no hay botones sin piso.

**`switch` en Swift no deja casos afuera.** Tiene que cubrir **todo**: si falta algo, no compila (como el `when` de Kotlin). Y no "se cae" al caso siguiente como en JavaScript: no hace falta `break`.

```swift
func nivel(ganancia: Double) -> String {
    switch ganancia {
    case 25...:        return "buena"       // 25 o más
    case 15..<25:      return "normal"      // de 15 a 24,99
    default:           return "baja"        // todo lo demás
    }
}
```

**Los rangos:**

| Rango | Qué incluye |
|---|---|
| `1...5` | 1, 2, 3, 4 y **5** (cerrado) |
| `1..<5` | 1, 2, 3 y 4 (sin el 5) |
| `25...` | 25 y todo lo que sigue |

**`for-in`** recorre una lista o un rango:

```swift
for dia in 1...7 { print("Día \(dia)") }
for app in ["Uber", "99", "inDrive"] { print(app) }
```

Y como en Kotlin, también hay `while` para cuando no sabes cuántas vueltas vas a dar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un switch con rangos y un for
lenguaje: swift
pide: Completa `nivel(ganancia:)` con un `switch` y rangos: `25...` es `"buena"`, `15..<25` es `"normal"`, y el resto (`default`) `"baja"`. Después `diasBuenos(_ ganancias:)`: recorre la lista con `for` y cuenta cuántos días fueron `"buena"` usando tu `nivel`.
--- código
func nivel(ganancia: Double) -> String {
    return "" // tu código aquí
}

func diasBuenos(_ ganancias: [Double]) -> Int {
    return -1 // tu código aquí
}
--- pruebas
prueba("buena") { igual(nivel(ganancia: 30), "buena") }
prueba("justo 25 es buena") { igual(nivel(ganancia: 25), "buena") }
prueba("normal") { igual(nivel(ganancia: 15), "normal") }
prueba("24,99 todavía es normal") { igual(nivel(ganancia: 24.99), "normal") }
prueba("baja") { igual(nivel(ganancia: 9.5), "baja") }
prueba("contar los buenos") { igual(diasBuenos([30, 10, 25, 18, 40]), 3) }
--- solución
func nivel(ganancia: Double) -> String {
    switch ganancia {
    case 25...: return "buena"
    case 15..<25: return "normal"
    default: return "baja"
    }
}

func diasBuenos(_ ganancias: [Double]) -> Int {
    var cuenta = 0
    for g in ganancias {
        if nivel(ganancia: g) == "buena" { cuenta += 1 }
    }
    return cuenta
}
```

```practica
vf :: En Swift, un switch tiene que cubrir todos los casos, si no, no compila
vf :: En un switch de Swift hay que poner break al final de cada caso, como en JavaScript
elige :: ¿Qué números incluye 1..<5? :: Del 1 al 5 :: Del 1 al 4 :: Del 0 al 5
escribe :: ¿Qué ventaja tiene que el switch obligue a cubrir todos los casos? :: Que no te puedes olvidar de uno: si agregas un caso nuevo (por ejemplo, un nivel más), Swift te avisa en cada switch que no lo trata, en vez de fallar callado cuando la app ya está en uso.
```


**Comprobación antes de seguir**

Prueba la misma función con un valor válido y con una entrada vacía.

<details>
<summary>Necesito una pista</summary>

Lee qué sale de la función cuando la condición de `guard` falla.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es un opcional en Swift?":** "Es un valor que puede estar o no estar: `String?` es un texto o `nil`. El compilador no te deja usarlo hasta que lo abras con `if let`, `guard let` o un valor por defecto con `??`. Así el caso de 'no hay' se piensa cuando escribes el código, y no aparece como un cierre de la app cuando ya la está usando alguien. Evito el `!` porque, si el valor era `nil`, la app se cierra. Es la misma idea que el `String?` de Kotlin o el `string | null` de TypeScript."

> 🌎 **En la vida real:** es como explicar por qué el portero de un edificio pide la llave en la puerta: es mejor frenar ahí que descubrir el problema en el piso diez.

> 🌎 **Otro ejemplo:** Es como explicar por qué el formulario del banco tiene casillas "no aplica": para que nadie confunda "no tengo" con "cero".
