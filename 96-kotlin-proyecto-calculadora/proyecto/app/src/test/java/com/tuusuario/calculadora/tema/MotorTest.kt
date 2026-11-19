package com.tuusuario.calculadora.tema

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MotorTest {
    @Test fun `la letra del visor se achica con números largos`() {
        assertEquals(Motor.Letra.VISOR_GRANDE, letraDelVisor("1.234", 380))
        val mediano = letraDelVisor("123.456.789", 380)
        assertTrue(mediano < Motor.Letra.VISOR_GRANDE && mediano > Motor.Letra.VISOR_CHICO)
        assertEquals(Motor.Letra.VISOR_CHICO, letraDelVisor("-0,333333333333", 380))
    }

    // La lección de la clase 95, aplicada desde el principio: el número largo entra en una pantalla chica.
    @Test fun `en una pantalla chica, el número más largo entra sin cortarse`() {
        val texto = "-0,333333333333"
        val ancho = anchoDelVisor(320)
        assertTrue(texto.length * ANCHO_DE_CIFRA * letraDelVisor(texto, ancho) <= ancho)
    }

    @Test fun `en un teléfono de 320 de ancho entran cuatro teclas por fila`() {
        val lado = ladoDeTecla(320)
        assertTrue(lado * 4 + Motor.Espacio.MEDIO * 3 + Motor.Espacio.GRANDE * 2 <= 320)
        assertTrue(lado >= 56)
    }

    @Test fun `en una tableta no se estira`() = assertEquals(ladoDeTecla(420), ladoDeTecla(1024))
}
