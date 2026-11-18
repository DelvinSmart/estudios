// EL VIEWMODEL: el estado de la pantalla (clase 66). Guarda la lista, hace las cuentas con la lógica y
// le pide al repositorio que lea y guarde. La pantalla solo MUESTRA el estado y AVISA lo que tocó la persona.
package com.tuusuario.gastosdelcarro.pantalla

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.tuusuario.gastosdelcarro.datos.RepositorioGastos
import com.tuusuario.gastosdelcarro.logica.Borrador
import com.tuusuario.gastosdelcarro.logica.Gasto
import com.tuusuario.gastosdelcarro.logica.Semana
import com.tuusuario.gastosdelcarro.logica.agregar
import com.tuusuario.gastosdelcarro.logica.crearGasto
import com.tuusuario.gastosdelcarro.logica.problemasDe
import com.tuusuario.gastosdelcarro.logica.quitar
import com.tuusuario.gastosdelcarro.logica.siguienteId
import com.tuusuario.gastosdelcarro.logica.totalDeLaSemana
import java.time.LocalDate
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

/** Todo lo que la pantalla necesita para dibujarse. data class: cada cambio es una copia nueva. */
data class EstadoPantalla(
    val cargando: Boolean = true,
    val gastos: List<Gasto> = emptyList(),
    val semana: Semana = Semana(total = 0.0, cantidad = 0),
    val problemas: List<String> = emptyList(),
    val aviso: String? = null,
)

class GastosViewModel(
    private val repositorio: RepositorioGastos,
    private val hoy: () -> LocalDate = { LocalDate.now() }, // las pruebas fijan el día
) : ViewModel() {

    private val _estado = MutableStateFlow(EstadoPantalla())
    val estado: StateFlow<EstadoPantalla> = _estado.asStateFlow() // afuera, solo lectura

    init {
        // 1. Al abrir: leer lo guardado. Hasta que termina, "cargando" y no se acepta nada nuevo.
        viewModelScope.launch {
            val lista = try {
                repositorio.leer()
            } catch (e: Exception) {
                _estado.update { it.copy(aviso = "No pude leer los gastos guardados") }
                emptyList()
            }
            _estado.update { it.copy(cargando = false, gastos = lista, semana = totalDeLaSemana(lista, hoy())) }
        }
    }

    /** Devuelve true si lo guardó (la pantalla limpia el valor); si no, deja los problemas en el estado. */
    fun guardar(borrador: Borrador): Boolean {
        // Si todavía no se leyó lo guardado, guardar ahora pisaría la lista del teléfono con una vacía.
        if (_estado.value.cargando) return false
        val problemas = problemasDe(borrador, hoy())
        _estado.update { it.copy(problemas = problemas) }
        if (problemas.isNotEmpty()) return false
        cambiarLista { lista -> agregar(lista, crearGasto(borrador, siguienteId(lista))) }
        return true
    }

    fun borrar(id: Long) = cambiarLista { lista -> quitar(lista, id) }

    private fun cambiarLista(cambio: (List<Gasto>) -> List<Gasto>) {
        val nueva = cambio(_estado.value.gastos)
        _estado.update { it.copy(gastos = nueva, semana = totalDeLaSemana(nueva, hoy())) }
        // 2. Cada cambio se guarda, sin trabar la pantalla (una corrutina en viewModelScope).
        viewModelScope.launch {
            try {
                repositorio.guardar(nueva)
            } catch (e: Exception) {
                _estado.update { it.copy(aviso = "No se pudo guardar en el teléfono") }
            }
        }
    }

    companion object {
        /** Cómo se crea el ViewModel con su repositorio (Android lo crea y lo guarda al girar la pantalla). */
        fun fabrica(repositorio: RepositorioGastos): ViewModelProvider.Factory = viewModelFactory {
            initializer { GastosViewModel(repositorio) }
        }
    }
}
