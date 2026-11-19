// Las MISMAS pruebas que la calculadora de React Native (clase 94) y la de Kotlin (clase 96), con Swift Testing.
import Testing
@testable import Calculadora

/// Toca varias teclas seguidas (por su símbolo) y devuelve lo que se ve en el visor.
func tocar(_ teclas: String...) -> String {
    let final = teclas.reduce(Estado()) { apretar($0, tecla($1)) }
    return final.error ?? formatear(final.pantalla)
}

@Suite("Escribir números")
struct Escribir {
    @Test func empiezaEnCero() { #expect(tocar() == "0") }
    @Test func ceroDeAdelante() { #expect(tocar("0", "7") == "7") }
    @Test func conComa() { #expect(tocar("1", ",", "5") == "1,5") }
    @Test func empezarConComa() { #expect(tocar(",", "5") == "0,5") }
    @Test func comaDeMas() { #expect(tocar("1", ",", "2", ",", "3") == "1,23") }
    @Test func miles() { #expect(tocar("1", "2", "3", "4", "5", "6", "7") == "1.234.567") }
    @Test func doceCifras() {
        let teclas = "1234567890123".map(String.init)
        #expect(teclas.reduce(Estado()) { apretar($0, tecla($1)) }.pantalla == "123456789012")
    }
}

@Suite("Las cuatro operaciones")
struct Operaciones {
    @Test func sumar() { #expect(tocar("2", "+", "3", "=") == "5") }
    @Test func restarNegativo() { #expect(tocar("3", "−", "8", "=") == "-5") }
    @Test func multiplicar() { #expect(tocar("6", "×", "7", "=") == "42") }
    @Test func dividirConDecimales() { #expect(tocar("1", "0", "÷", "4", "=") == "2,5") }
}

@Suite("Las decisiones del plan")
struct Decisiones {
    @Test("de izquierda a derecha: 2 + 3 × 4 = 20") func izquierdaADerecha() { #expect(tocar("2", "+", "3", "×", "4", "=") == "20") }
    @Test func resultadoParcial() { #expect(tocar("2", "+", "3", "×") == "5") }
    @Test("0,1 + 0,2 = 0,3") func decimales() { #expect(tocar("0", ",", "1", "+", "0", ",", "2", "=") == "0,3") }
    @Test func dividirEntreCeroAvisa() { #expect(tocar("1", "÷", "0", "=") == "No se puede dividir entre 0") }
    @Test func despuesDelAviso() { #expect(tocar("1", "÷", "0", "=", "7") == "7") }
    @Test func muyGrandeAvisa() { #expect(tocar("9", "9", "9", "9", "9", "9", "×", "9", "9", "9", "9", "9", "9", "9", "=") == "El número es muy grande") }
    @Test func dosOperadores() { #expect(tocar("5", "+", "×", "3", "=") == "15") }
    @Test func cincoMasIgual() { #expect(tocar("5", "+", "=") == "10") }
    @Test func igualOtraVez() { #expect(tocar("2", "+", "3", "=", "=") == "5") }
    @Test func numeroNuevoDespuesDelResultado() { #expect(tocar("2", "+", "3", "=", "4") == "4") }
    @Test func operadorDespuesDelResultado() { #expect(tocar("2", "+", "3", "=", "×", "2", "=") == "10") }
}

@Suite("Las teclas de función")
struct Funciones {
    @Test func cBorraTodo() { #expect(tocar("2", "+", "3", "C", "=") == "0") }
    @Test func borrarUno() { #expect(tocar("1", "2", "3", "⌫") == "12") }
    @Test func borrarHastaVaciar() { #expect(tocar("7", "⌫") == "0") }
    @Test func borrarDespuesDelResultado() { #expect(tocar("2", "+", "3", "=", "⌫") == "5") }
    @Test func signo() { #expect(tocar("8", "±") == "-8") }
    @Test func signoDosVeces() { #expect(tocar("8", "±", "±") == "8") }
    @Test func signoEnCero() { #expect(tocar("±") == "0") }
    @Test func porcentajeSolo() { #expect(tocar("5", "0", "%") == "0,5") }
    @Test func porcentajeDeLaSuma() { #expect(tocar("2", "0", "0", "+", "1", "0", "%") == "20") }
    @Test func porcentajeIgual() { #expect(tocar("2", "0", "0", "+", "1", "0", "%", "=") == "220") }
    @Test("15 + 3 % = 0,45 (en Kotlin daba 0, clase 96)") func porcentajeConDecimales() { #expect(tocar("1", "5", "+", "3", "%") == "0,45") }
    @Test func porcentajeEnMultiplicacion() { #expect(tocar("5", "0", "×", "1", "0", "%", "=") == "5") }
}

@Suite("Redondear y formatear")
struct Formato {
    @Test("1 ÷ 3 con 12 cifras") func unTercio() { #expect(tocar("1", "÷", "3", "=") == "0,333333333333") }
    @Test("2 ÷ 3 redondea la última cifra") func dosTercios() { #expect(tocar("2", "÷", "3", "=") == "0,666666666667") }
    // Decimal(19.99 como Double) * 3 da 59.96999999999998464: el error del Double viaja adentro.
    // La calculadora crea el Decimal desde el TEXTO del visor, nunca desde un Double (encontrado probando Decimal).
    @Test("19,99 × 3 = 59,97 (el Decimal sale del texto, no de un Double)") func desdeElTexto() { #expect(tocar("1", "9", ",", "9", "9", "×", "3", "=") == "59,97") }
    @Test func negativoConMiles() { #expect(formatear("-1234.5") == "-1.234,5") }
    @Test func mientrasEscribesLaComa() { #expect(formatear("12.") == "12,") }
    @Test func apretarNoCambiaElQueRecibe() {
        let antes = Estado()
        _ = apretar(antes, tecla("5"))
        #expect(antes == Estado())
    }
}

@Suite("El teclado")
struct Teclado {
    @Test func cincoFilasDeCuatro() { #expect(filas.count == 5 && filas.allSatisfy { $0.count == 4 }) }
    @Test func sinRepetidas() { #expect(Set(filas.joined()).count == 20) }
    @Test func etiquetasEnEspanol() {
        #expect(etiqueta(de: tecla("÷")) == "dividir")
        for t in filas.joined() where tipo(de: t) != .numero || t == .borrarUno || t == .coma {
            #expect(etiqueta(de: t) != t.simbolo)
        }
    }
    @Test func operadorEncendidoMientrasEspera() {
        let conMas = apretar(apretar(Estado(), tecla("2")), tecla("+"))
        #expect(operadorEncendido(conMas) == .sumar)
        #expect(operadorEncendido(apretar(conMas, tecla("3"))) == nil)
    }
}
