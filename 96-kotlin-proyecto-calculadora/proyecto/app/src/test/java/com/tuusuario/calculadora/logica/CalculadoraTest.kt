// Las MISMAS pruebas que la calculadora de React Native (clase 94), escritas en JUnit.
package com.tuusuario.calculadora.logica

import org.junit.Assert.assertEquals
import org.junit.Assert.assertSame
import org.junit.Test

class CalculadoraTest {
    // Toca varias teclas seguidas (por su símbolo) y devuelve lo que se ve en el visor.
    private fun tocar(vararg teclas: String): String {
        val final = teclas.fold(INICIAL) { e, t -> apretar(e, teclaDe(t)) }
        return final.error ?: formatear(final.pantalla)
    }

    // ---------- escribir números ----------
    @Test fun `empieza en 0`() = assertEquals("0", tocar())
    @Test fun `el 0 de adelante se reemplaza`() = assertEquals("7", tocar("0", "7"))
    @Test fun `con coma decimal`() = assertEquals("1,5", tocar("1", ",", "5"))
    @Test fun `empezar con coma es 0,`() = assertEquals("0,5", tocar(",", "5"))
    @Test fun `una coma de más se ignora`() = assertEquals("1,23", tocar("1", ",", "2", ",", "3"))
    @Test fun `punto de miles, como en Brasil`() = assertEquals("1.234.567", tocar("1", "2", "3", "4", "5", "6", "7"))
    @Test fun `no más de 12 cifras`() =
        assertEquals("123.456.789.012", tocar(*"1234567890123".map { it.toString() }.toTypedArray()))

    // ---------- las cuatro operaciones ----------
    @Test fun sumar() = assertEquals("5", tocar("2", "+", "3", "="))
    @Test fun `restar y dar negativo`() = assertEquals("-5", tocar("3", "−", "8", "="))
    @Test fun multiplicar() = assertEquals("42", tocar("6", "×", "7", "="))
    @Test fun `dividir con decimales`() = assertEquals("2,5", tocar("1", "0", "÷", "4", "="))

    // ---------- las decisiones del plan ----------
    @Test fun `de izquierda a derecha, 2 + 3 × 4 = 20`() = assertEquals("20", tocar("2", "+", "3", "×", "4", "="))
    @Test fun `al tocar el segundo operador ya muestra el resultado parcial`() = assertEquals("5", tocar("2", "+", "3", "×"))
    @Test fun `0,1 + 0,2 = 0,3`() = assertEquals("0,3", tocar("0", ",", "1", "+", "0", ",", "2", "="))
    @Test fun `dividir entre 0 avisa`() = assertEquals("No se puede dividir entre 0", tocar("1", "÷", "0", "="))
    @Test fun `después del aviso, un número empieza de nuevo`() = assertEquals("7", tocar("1", "÷", "0", "=", "7"))
    @Test fun `un resultado demasiado grande avisa`() = assertEquals(
        "El número es muy grande",
        tocar("9", "9", "9", "9", "9", "9", "×", "9", "9", "9", "9", "9", "9", "9", "="),
    )
    @Test fun `dos operadores seguidos, vale el último`() = assertEquals("15", tocar("5", "+", "×", "3", "="))
    @Test fun `5 + = usa el mismo número`() = assertEquals("10", tocar("5", "+", "="))
    @Test fun `= otra vez no hace nada`() = assertEquals("5", tocar("2", "+", "3", "=", "="))
    @Test fun `después de un resultado, un número nuevo empieza otra cuenta`() = assertEquals("4", tocar("2", "+", "3", "=", "4"))
    @Test fun `después de un resultado, un operador sigue la cuenta`() = assertEquals("10", tocar("2", "+", "3", "=", "×", "2", "="))

    // ---------- las teclas de función ----------
    @Test fun `C borra todo`() = assertEquals("0", tocar("2", "+", "3", "C", "="))
    @Test fun `⌫ borra el último`() = assertEquals("12", tocar("1", "2", "3", "⌫"))
    @Test fun `⌫ hasta vaciar deja 0`() = assertEquals("0", tocar("7", "⌫"))
    @Test fun `⌫ después de un resultado no hace nada`() = assertEquals("5", tocar("2", "+", "3", "=", "⌫"))
    @Test fun `± cambia el signo`() = assertEquals("-8", tocar("8", "±"))
    @Test fun `± dos veces vuelve`() = assertEquals("8", tocar("8", "±", "±"))
    @Test fun `± en 0 no hace nada`() = assertEquals("0", tocar("±"))
    @Test fun `% solo divide entre 100`() = assertEquals("0,5", tocar("5", "0", "%"))
    @Test fun `200 + 10 % es el 10% de 200`() = assertEquals("20", tocar("2", "0", "0", "+", "1", "0", "%"))
    @Test fun `200 + 10 % = 220`() = assertEquals("220", tocar("2", "0", "0", "+", "1", "0", "%", "="))
    // Encontrado leyendo el código: en Kotlin, `/` entre BigDecimal conserva los decimales del PRIMERO.
    // 15 × 3 = 45 (sin decimales) y 45 / 100 daba 0. Con divide(…, MathContext) da 0,45.
    @Test fun `15 + 3 % es 0,45 y no 0`() = assertEquals("0,45", tocar("1", "5", "+", "3", "%"))
    @Test fun `en una multiplicación, % divide entre 100`() = assertEquals("5", tocar("5", "0", "×", "1", "0", "%", "="))

    // ---------- redondear y formatear ----------
    @Test fun `1 ÷ 3 con 12 cifras`() = assertEquals("0,333333333333", tocar("1", "÷", "3", "="))
    @Test fun `2 ÷ 3 redondea la última cifra`() = assertEquals("0,666666666667", tocar("2", "÷", "3", "="))
    @Test fun `sin ceros de más al final`() = assertEquals("2,5", tocar("5", "÷", "2", "="))
    @Test fun `formatear un número negativo con miles y decimales`() = assertEquals("-1.234,5", formatear("-1234.5"))
    @Test fun `formatear mientras escribes la coma`() = assertEquals("12,", formatear("12."))

    @Test fun `apretar no cambia el estado que recibe`() {
        val antes = INICIAL
        apretar(INICIAL, teclaDe("5"))
        assertSame(antes, INICIAL)
        assertEquals(Estado(), INICIAL)
    }
}
