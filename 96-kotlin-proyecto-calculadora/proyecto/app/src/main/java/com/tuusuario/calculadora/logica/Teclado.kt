// EL TECLADO COMO DATOS: qué teclas hay, en qué orden, de qué tipo y cómo se leen en voz alta (TalkBack).
// La pantalla solo recorre esta lista: para cambiar el orden no se toca ningún componente.
package com.tuusuario.calculadora.logica

private fun d(n: Int) = Tecla.Digito(n)

val FILAS: List<List<Tecla>> = listOf(
    listOf(Tecla.BorrarTodo, Tecla.Signo, Tecla.Porcentaje, Operador.DIVIDIR),
    listOf(d(7), d(8), d(9), Operador.MULTIPLICAR),
    listOf(d(4), d(5), d(6), Operador.RESTAR),
    listOf(d(1), d(2), d(3), Operador.SUMAR),
    listOf(Tecla.BorrarUno, d(0), Tecla.Coma, Tecla.Igual),
)

/** Busca una tecla por su símbolo ("7", "+", "⌫"). Las pruebas la usan para escribir como en la de React Native. */
fun teclaDe(simbolo: String): Tecla =
    FILAS.flatten().firstOrNull { it.simbolo == simbolo } ?: error("No hay una tecla \"$simbolo\"")

enum class TipoDeTecla { NUMERO, FUNCION, OPERADOR, IGUAL }

fun tipoDe(t: Tecla): TipoDeTecla = when (t) {
    Tecla.Igual -> TipoDeTecla.IGUAL
    is Operador -> TipoDeTecla.OPERADOR
    Tecla.BorrarTodo, Tecla.Signo, Tecla.Porcentaje -> TipoDeTecla.FUNCION
    is Tecla.Digito, Tecla.Coma, Tecla.BorrarUno -> TipoDeTecla.NUMERO
}

/** Lo que lee TalkBack. "÷" leído en voz alta no dice nada. */
fun etiquetaDe(t: Tecla): String = when (t) {
    Operador.SUMAR -> "sumar"
    Operador.RESTAR -> "restar"
    Operador.MULTIPLICAR -> "multiplicar"
    Operador.DIVIDIR -> "dividir"
    Tecla.Igual -> "igual"
    Tecla.BorrarTodo -> "borrar todo"
    Tecla.BorrarUno -> "borrar el último"
    Tecla.Signo -> "cambiar el signo"
    Tecla.Porcentaje -> "por ciento"
    Tecla.Coma -> "coma"
    is Tecla.Digito -> t.simbolo
}

/** El operador que se marca encendido: el que se acaba de tocar, mientras se espera el segundo número. */
fun operadorEncendido(e: Estado): Operador? = if (e.nuevoNumero && e.error == null) e.operador else null
