// EL ESTADO DE LA PANTALLA: guarda el Estado de la calculadora y le pasa cada tecla a la lógica.
// Sobrevive al giro del teléfono (clase 66). La pantalla solo lo MUESTRA y AVISA qué tecla se tocó.
package com.tuusuario.calculadora.pantalla

import androidx.lifecycle.ViewModel
import com.tuusuario.calculadora.logica.Estado
import com.tuusuario.calculadora.logica.INICIAL
import com.tuusuario.calculadora.logica.Tecla
import com.tuusuario.calculadora.logica.apretar
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class CalculadoraViewModel : ViewModel() {
    private val _estado = MutableStateFlow(INICIAL)
    val estado: StateFlow<Estado> = _estado.asStateFlow()

    // update { } recibe siempre el estado más nuevo: es el setEstado((e) => apretar(e, t)) de React (clase 95, parte 3).
    fun tocar(t: Tecla) = _estado.update { apretar(it, t) }
}
