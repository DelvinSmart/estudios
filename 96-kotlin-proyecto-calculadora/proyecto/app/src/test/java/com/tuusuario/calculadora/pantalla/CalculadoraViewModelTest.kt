package com.tuusuario.calculadora.pantalla

import com.tuusuario.calculadora.logica.formatear
import com.tuusuario.calculadora.logica.teclaDe
import org.junit.Assert.assertEquals
import org.junit.Test

class CalculadoraViewModelTest {
    @Test fun `tocar las teclas cambia el estado`() {
        val vm = CalculadoraViewModel()
        listOf("0", ",", "1", "+", "0", ",", "2", "=").forEach { vm.tocar(teclaDe(it)) }
        assertEquals("0,3", formatear(vm.estado.value.pantalla))
    }

    @Test fun `tres toques seguidos no pierden ninguno`() {
        val vm = CalculadoraViewModel()
        repeat(3) { vm.tocar(teclaDe("1")) }
        assertEquals("111", vm.estado.value.pantalla)
    }
}
