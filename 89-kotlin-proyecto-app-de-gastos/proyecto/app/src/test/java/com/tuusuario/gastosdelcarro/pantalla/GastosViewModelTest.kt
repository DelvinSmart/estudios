// Pruebas del VIEWMODEL con el repositorio en memoria (gracias a la interfaz, clase 64) y un día fijo.
package com.tuusuario.gastosdelcarro.pantalla

import com.tuusuario.gastosdelcarro.datos.RepositorioEnMemoria
import com.tuusuario.gastosdelcarro.datos.RepositorioGastos
import com.tuusuario.gastosdelcarro.logica.Borrador
import com.tuusuario.gastosdelcarro.logica.Gasto
import com.tuusuario.gastosdelcarro.logica.Semana
import com.tuusuario.gastosdelcarro.logica.Tipo
import java.time.LocalDate
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class GastosViewModelTest {
    private val hoy = LocalDate.of(2026, 11, 18)

    // viewModelScope corre en el hilo de la pantalla (Main). En las pruebas no hay pantalla:
    // se cambia por un despachador de pruebas que corre todo enseguida.
    @Before fun antes() = Dispatchers.setMain(UnconfinedTestDispatcher())
    @After fun despues() = Dispatchers.resetMain()

    @Test fun alAbrirLeeLoGuardadoYCuentaSoloEstaSemana() {
        val repo = RepositorioEnMemoria(
            listOf(Gasto(1, Tipo.COMBUSTIBLE, 150.0, hoy.minusDays(1)), Gasto(2, Tipo.LAVADO, 30.0, hoy.minusDays(8))),
        )
        val estado = GastosViewModel(repo) { hoy }.estado.value
        assertFalse(estado.cargando)
        assertEquals(2, estado.gastos.size)
        assertEquals(Semana(total = 150.0, cantidad = 1), estado.semana)
    }

    @Test fun guardarDosGastos() {
        val repo = RepositorioEnMemoria()
        val vm = GastosViewModel(repo) { hoy }
        assertTrue(vm.guardar(Borrador(Tipo.LAVADO, "30", "2026-11-18")))
        assertTrue(vm.guardar(Borrador(Tipo.PEAJE, "5,40", "2026-11-18")))
        assertEquals(Semana(total = 35.4, cantidad = 2), vm.estado.value.semana)
        assertEquals(listOf(Tipo.PEAJE, Tipo.LAVADO), repo.guardado.map { it.tipo }) // y quedaron en el teléfono
    }

    @Test fun conProblemasNoGuardaYLosMuestra() {
        val repo = RepositorioEnMemoria()
        val vm = GastosViewModel(repo) { hoy }
        assertFalse(vm.guardar(Borrador(Tipo.LAVADO, "", "2026-11-18")))
        assertEquals(listOf("Escribe un valor mayor que 0"), vm.estado.value.problemas)
        assertEquals(emptyList<Gasto>(), repo.guardado)
    }

    @Test fun borrarLoQuitaDeLaPantallaYDelTelefono() {
        val repo = RepositorioEnMemoria(listOf(Gasto(1, Tipo.PEAJE, 5.0, hoy)))
        val vm = GastosViewModel(repo) { hoy }
        vm.borrar(1)
        assertEquals(emptyList<Gasto>(), vm.estado.value.gastos)
        assertEquals(emptyList<Gasto>(), repo.guardado)
    }

    @Test fun mientrasCargaNoAceptaNadaParaNoPisarLoGuardado() {
        // Un repositorio que tarda en leer: hasta que "llega" la lista, sigue cargando.
        val llega = CompletableDeferred<List<Gasto>>()
        val lento = object : RepositorioGastos {
            var guardados = 0
            override suspend fun leer() = llega.await()
            override suspend fun guardar(lista: List<Gasto>) { guardados++ }
        }
        val vm = GastosViewModel(lento) { hoy }
        assertTrue(vm.estado.value.cargando)
        assertFalse(vm.guardar(Borrador(Tipo.LAVADO, "30", "2026-11-18")))
        assertEquals(0, lento.guardados)

        llega.complete(listOf(Gasto(7, Tipo.OTRO, 1.0, hoy)))
        assertFalse(vm.estado.value.cargando)
        assertTrue(vm.guardar(Borrador(Tipo.LAVADO, "30", "2026-11-18")))
        assertEquals(8L, vm.estado.value.gastos.first().id) // el nuevo, arriba, con el id siguiente
    }

    @Test fun siElTelefonoNoDejaLeerLoDiceYNoSeCae() {
        val roto = object : RepositorioGastos {
            override suspend fun leer(): List<Gasto> = throw IllegalStateException("disco lleno")
            override suspend fun guardar(lista: List<Gasto>) {}
        }
        val estado = GastosViewModel(roto) { hoy }.estado.value
        assertEquals("No pude leer los gastos guardados", estado.aviso)
        assertFalse(estado.cargando)
    }
}
