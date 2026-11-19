// EL TECLADO COMO DATOS: qué teclas hay, en qué orden, de qué tipo y cómo se leen en voz alta (VoiceOver).
let filas: [[Tecla]] = [
    [.borrarTodo, .signo, .porcentaje, .operador(.dividir)],
    [.digito(7), .digito(8), .digito(9), .operador(.multiplicar)],
    [.digito(4), .digito(5), .digito(6), .operador(.restar)],
    [.digito(1), .digito(2), .digito(3), .operador(.sumar)],
    [.borrarUno, .digito(0), .coma, .igual],
]

/// Busca una tecla por su símbolo ("7", "+", "⌫"). Las pruebas la usan para escribir como en las otras versiones.
func tecla(_ simbolo: String) -> Tecla {
    guard let t = filas.joined().first(where: { $0.simbolo == simbolo }) else { fatalError("No hay una tecla \(simbolo)") }
    return t
}

enum TipoDeTecla { case numero, funcion, operador, igual }

func tipo(de t: Tecla) -> TipoDeTecla {
    switch t {
    case .igual: return .igual
    case .operador: return .operador
    case .borrarTodo, .signo, .porcentaje: return .funcion
    case .digito, .coma, .borrarUno: return .numero
    }
}

/// Lo que lee VoiceOver. "÷" leído en voz alta no dice nada.
func etiqueta(de t: Tecla) -> String {
    switch t {
    case .operador(.sumar): return "sumar"
    case .operador(.restar): return "restar"
    case .operador(.multiplicar): return "multiplicar"
    case .operador(.dividir): return "dividir"
    case .igual: return "igual"
    case .borrarTodo: return "borrar todo"
    case .borrarUno: return "borrar el último"
    case .signo: return "cambiar el signo"
    case .porcentaje: return "por ciento"
    case .coma: return "coma"
    case .digito(let n): return String(n)
    }
}

/// El operador que se marca encendido: el que se acaba de tocar, mientras se espera el segundo número.
func operadorEncendido(_ e: Estado) -> Operador? { e.nuevoNumero && e.error == nil ? e.operador : nil }
