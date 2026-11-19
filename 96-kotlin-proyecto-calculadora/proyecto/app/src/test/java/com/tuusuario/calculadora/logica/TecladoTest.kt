package com.tuusuario.calculadora.logica

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Test

class TecladoTest {
    @Test fun `cinco filas de cuatro teclas`() {
        assertEquals(5, FILAS.size)
        FILAS.forEach { assertEquals(4, it.size) }
    }

    @Test fun `cada tecla aparece una sola vez`() {
        val todas = FILAS.flatten()
        assertEquals(todas.size, todas.toSet().size)
        assertEquals(20, todas.size) // 10 dígitos, coma, 4 operadores, =, C, ⌫, % y ±
    }

    @Test fun `los tipos`() = assertEquals(
        listOf(TipoDeTecla.NUMERO, TipoDeTecla.NUMERO, TipoDeTecla.NUMERO, TipoDeTecla.OPERADOR, TipoDeTecla.FUNCION, TipoDeTecla.IGUAL),
        listOf("7", ",", "⌫", "+", "C", "=").map { tipoDe(teclaDe(it)) },
    )

    @Test fun `cada tecla que no es un número tiene una etiqueta en español`() {
        assertEquals("dividir", etiquetaDe(teclaDe("÷")))
        assertEquals("borrar el último", etiquetaDe(teclaDe("⌫")))
        assertEquals("7", etiquetaDe(teclaDe("7")))
        FILAS.flatten().filter { it !is Tecla.Digito }.forEach { assertNotEquals(it.simbolo, etiquetaDe(it)) }
    }

    @Test fun `el operador se enciende mientras se espera el segundo número`() {
        val conMas = apretar(apretar(INICIAL, teclaDe("2")), teclaDe("+"))
        assertEquals(Operador.SUMAR, operadorEncendido(conMas))
        assertNull(operadorEncendido(apretar(conMas, teclaDe("3"))))
        assertNull(operadorEncendido(INICIAL))
    }
}
