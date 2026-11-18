// Pruebas de la LÓGICA con JUnit: corren en la computadora (./gradlew test), sin teléfono.
package com.tuusuario.gastosdelcarro.logica

import java.time.LocalDate
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class GastosTest {
    private val hoy = LocalDate.of(2026, 11, 18) // un miércoles
    private val bien = Borrador(Tipo.LAVADO, "30", "2026-11-18")
    private fun g(id: Long, tipo: Tipo, valor: Double, fecha: String) = Gasto(id, tipo, valor, LocalDate.parse(fecha))

    @Test fun leeElValorConComaComoEnBrasil() {
        assertEquals(12.5, leerValor("12,50")!!, 0.001)
        assertNull(leerValor(""))
        assertNull(leerValor("abc"))
    }

    @Test fun unaFechaQueNoExisteNoSeLee() {
        assertNull(leerFecha("2026-02-31"))
        assertNull(leerFecha("18/11/2026"))
        assertEquals(LocalDate.of(2028, 2, 29), leerFecha("2028-02-29"))
    }

    @Test fun unGastoBienArmadoNoTieneProblemas() = assertEquals(emptyList<String>(), problemasDe(bien, hoy))

    @Test fun valorCeroNegativoOVacio() {
        for (valor in listOf("0", "-5", "", "abc")) {
            assertEquals(listOf("Escribe un valor mayor que 0"), problemasDe(bien.copy(valor = valor), hoy))
        }
    }

    @Test fun sinTipo() = assertEquals(listOf("Elige un tipo de gasto"), problemasDe(bien.copy(tipo = null), hoy))

    @Test fun fechaEnElFuturo() =
        assertEquals(listOf("La fecha no puede ser en el futuro"), problemasDe(bien.copy(fecha = "2026-11-19"), hoy))

    @Test fun todoMalALaVez() = assertEquals(3, problemasDe(Borrador(null, "0", "ayer"), hoy).size)

    @Test fun crearRedondeaLosCentavos() = assertEquals(10.01, crearGasto(bien.copy(valor = "10,005"), 1).valor, 0.0)

    @Test fun loMasNuevoArribaYDelMismoDiaElUltimoAnotado() {
        val lista = agregar(agregar(agregar(emptyList(), g(1, Tipo.PEAJE, 5.0, "2026-11-10")), g(2, Tipo.LAVADO, 30.0, "2026-11-18")), g(3, Tipo.OTRO, 1.0, "2026-11-18"))
        assertEquals(listOf(3L, 2L, 1L), lista.map { it.id })
    }

    @Test fun quitarYElSiguienteId() {
        val lista = listOf(g(1, Tipo.PEAJE, 5.0, "2026-11-18"), g(4, Tipo.OTRO, 1.0, "2026-11-18"))
        assertEquals(listOf(4L), quitar(lista, 1).map { it.id })
        assertEquals(5L, siguienteId(lista))
        assertEquals(1L, siguienteId(emptyList()))
    }

    @Test fun laSemanaEmpiezaElLunes() {
        assertEquals(LocalDate.of(2026, 11, 16), inicioDeSemana(hoy)) // miércoles → lunes
        assertEquals(LocalDate.of(2026, 11, 16), inicioDeSemana(LocalDate.of(2026, 11, 22))) // domingo → el lunes de antes
        assertEquals(LocalDate.of(2026, 11, 16), inicioDeSemana(LocalDate.of(2026, 11, 16))) // lunes → el mismo
    }

    @Test fun elTotalSoloCuentaEstaSemanaYSinCentavosRaros() {
        val lista = listOf(g(1, Tipo.PEAJE, 0.1, "2026-11-16"), g(2, Tipo.PEAJE, 0.2, "2026-11-18"), g(3, Tipo.LAVADO, 30.0, "2026-11-15"))
        assertEquals(Semana(total = 0.3, cantidad = 2), totalDeLaSemana(lista, hoy))
    }

    @Test fun elDineroComoEnBrasil() {
        assertEquals("R$ 30,00", dinero(30.0))
        assertEquals("R$ 1.234,50", dinero(1234.5))
        assertEquals("R$ 1.234.567,89", dinero(1234567.891))
        assertEquals("R$ 0,00", dinero(0.0))
        assertTrue(dinero(-30.0).startsWith("-"))
    }
}
