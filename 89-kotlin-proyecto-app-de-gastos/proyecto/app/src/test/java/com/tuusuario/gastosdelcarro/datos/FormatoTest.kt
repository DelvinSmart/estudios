// Pruebas de CÓMO SE GUARDA la lista como texto: ida y vuelta, y que una línea rota no tire abajo a las demás.
package com.tuusuario.gastosdelcarro.datos

import com.tuusuario.gastosdelcarro.logica.Gasto
import com.tuusuario.gastosdelcarro.logica.Tipo
import java.time.LocalDate
import org.junit.Assert.assertEquals
import org.junit.Test

class FormatoTest {
    private val lista = listOf(
        Gasto(2, Tipo.LAVADO, 30.5, LocalDate.of(2026, 11, 18)),
        Gasto(1, Tipo.PEAJE, 12.0, LocalDate.of(2026, 11, 10)),
    )

    @Test fun idaYVuelta() = assertEquals(lista, deTexto(aTexto(lista)))

    @Test fun unaLineaPorGasto() = assertEquals("2|LAVADO|30.5|2026-11-18\n1|PEAJE|12.0|2026-11-10", aTexto(lista))

    @Test fun nadaGuardado() {
        assertEquals(emptyList<Gasto>(), deTexto(null))
        assertEquals(emptyList<Gasto>(), deTexto(""))
    }

    @Test fun unaLineaRotaNoTiraAbajoALasDemas() {
        val texto = "2|LAVADO|30.5|2026-11-18\nbasura\n3|CASINO|1.0|2026-11-18\n4|PEAJE|mucho|2026-11-18\n5|OTRO|1.0|2026-02-31"
        assertEquals(listOf(lista[0]), deTexto(texto))
    }
}
