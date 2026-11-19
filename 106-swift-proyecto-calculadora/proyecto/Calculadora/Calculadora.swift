// LA LÓGICA DE LA CALCULADORA, en Swift puro: qué pasa con cada tecla. Sin SwiftUI.
// Las MISMAS decisiones que la de React Native (clase 94) y la de Kotlin (clase 96), y las mismas pruebas.
import Foundation

/// Las teclas: un enum con valores asociados (clase 100). En TypeScript eran textos; en Kotlin, una familia sealed.
enum Tecla: Hashable {
    case digito(Int)
    case coma, igual, borrarTodo, borrarUno, porcentaje, signo
    case operador(Operador)

    var simbolo: String {
        switch self {
        case .digito(let n): return String(n)
        case .coma: return ","
        case .igual: return "="
        case .borrarTodo: return "C"
        case .borrarUno: return "⌫"
        case .porcentaje: return "%"
        case .signo: return "±"
        case .operador(let o): return o.rawValue
        }
    }
}

enum Operador: String, Hashable {
    case sumar = "+", restar = "−", multiplicar = "×", dividir = "÷"
}

/// Lo que la calculadora recuerda. Un struct: cada cambio es un valor nuevo.
struct Estado: Equatable {
    var pantalla = "0"              // con punto decimal, como texto: "1234.5"
    var guardado: Decimal? = nil    // el primer número de la cuenta
    var operador: Operador? = nil
    var nuevoNumero = true          // el próximo dígito empieza un número nuevo
    var error: String? = nil        // un aviso para la persona
}

let maxCifras = 12
let dividirEntreCero = "No se puede dividir entre 0"
let muyGrande = "El número es muy grande"

/// Decimal guarda los decimales EXACTOS (como el BigDecimal de Kotlin): 0,1 + 0,2 da 0,3 sin trucos.
/// Solo se redondea lo que no termina, como 1 ÷ 3: a 12 cifras significativas.
func redondear(_ x: Decimal) -> Decimal {
    if x == 0 { return 0 }
    let magnitud = Int(floor(log10(abs(NSDecimalNumber(decimal: x).doubleValue))))
    var entrada = x
    var salida = Decimal()
    NSDecimalRound(&salida, &entrada, maxCifras - 1 - magnitud, .plain)
    return salida
}

enum Resultado { case numero(Decimal), aviso(String) }

func calcular(_ a: Decimal, _ operador: Operador, _ b: Decimal) -> Resultado {
    let r: Decimal
    switch operador {   // sin default: si se agrega un operador, no compila hasta decir qué hace
    case .sumar: r = a + b
    case .restar: r = a - b
    case .multiplicar: r = a * b
    case .dividir:
        if b == 0 { return .aviso(dividirEntreCero) }
        r = a / b
    }
    let red = redondear(r)
    return abs(red) >= 1_000_000_000_000 ? .aviso(muyGrande) : .numero(red)
}

/// "-1234.5" → "-1.234,5": punto de miles y coma decimal, como en Brasil.
func formatear(_ pantalla: String) -> String {
    let negativo = pantalla.hasPrefix("-")
    let partes = pantalla.replacingOccurrences(of: "-", with: "").split(separator: ".", omittingEmptySubsequences: false)
    var entero = String(partes[0])
    var conMiles = ""
    while entero.count > 3 {
        conMiles = "." + entero.suffix(3) + conMiles
        entero = String(entero.dropLast(3))
    }
    conMiles = entero + conMiles
    let decimal = partes.count > 1 ? "," + partes[1] : ""
    return (negativo ? "-" : "") + conMiles + decimal
}

private func aTexto(_ x: Decimal) -> String { "\(x)" }
private func numero(_ pantalla: String) -> Decimal {
    Decimal(string: pantalla.hasSuffix(".") ? String(pantalla.dropLast()) : pantalla, locale: Locale(identifier: "en_US_POSIX")) ?? 0
}
private func cifras(_ pantalla: String) -> Int { pantalla.filter(\.isNumber).count }

private func conResultado(_ r: Resultado, _ sigue: (inout Estado) -> Void) -> Estado {
    switch r {
    case .aviso(let texto): return Estado(error: texto)
    case .numero(let valor):
        var e = Estado(pantalla: aTexto(valor))
        sigue(&e)
        return e
    }
}

/// Qué pasa cuando se toca una tecla. Devuelve un estado NUEVO: el que llega no cambia (es un struct).
func apretar(_ e: Estado, _ t: Tecla) -> Estado {
    // Después de un aviso, cualquier tecla empieza de cero (y la tecla cuenta, si es un número).
    if e.error != nil { return (t == .borrarTodo || t == .borrarUno) ? Estado() : apretar(Estado(), t) }
    let actual = numero(e.pantalla)
    var n = e

    switch t {
    case .digito(let d):
        if e.nuevoNumero { n.pantalla = String(d); n.nuevoNumero = false }
        else if cifras(e.pantalla) >= maxCifras { return e }
        else { n.pantalla = e.pantalla == "0" ? String(d) : e.pantalla + String(d) }

    case .coma:
        if e.nuevoNumero { n.pantalla = "0."; n.nuevoNumero = false }
        else if !e.pantalla.contains(".") { n.pantalla += "." }

    case .operador(let o):
        if e.operador != nil && e.nuevoNumero { n.operador = o }        // 5 + × → vale el último
        else if let op = e.operador, let g = e.guardado {             // 2 + 3 × → resuelve 2 + 3 y muestra 5
            let r = calcular(g, op, actual)
            return conResultado(r) { s in
                if case .numero(let v) = r { s.guardado = v }
                s.operador = o; s.nuevoNumero = true
            }
        } else { n.guardado = actual; n.operador = o; n.nuevoNumero = true }

    case .igual:
        // = otra vez: no hace nada. 5 + = → la pantalla muestra 5, y ese es el segundo número.
        guard let op = e.operador, let g = e.guardado else { return e }
        return conResultado(calcular(g, op, actual)) { _ in }

    case .borrarTodo:
        return Estado()

    case .borrarUno:   // un resultado no se "escribió": no se borra de a uno
        if e.nuevoNumero { return e }
        let sin = String(e.pantalla.dropLast())
        n.pantalla = (sin.isEmpty || sin == "-") ? "0" : sin

    case .signo:
        if actual == 0 { return e }
        n.pantalla = e.pantalla.hasPrefix("-") ? String(e.pantalla.dropFirst()) : "-" + e.pantalla

    case .porcentaje:   // en una suma o resta, el porcentaje del primer número (200 + 10 % → 20)
        let p: Decimal
        if let g = e.guardado, e.operador == .sumar || e.operador == .restar { p = g * actual / 100 } else { p = actual / 100 }
        n.pantalla = aTexto(redondear(p)); n.nuevoNumero = false
    }
    return n
}
