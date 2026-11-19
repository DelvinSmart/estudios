// LA PANTALLA: el visor y el teclado. Dibuja lo que dice el estado; no hace ninguna cuenta.
package com.tuusuario.calculadora.pantalla

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.tuusuario.calculadora.logica.Estado
import com.tuusuario.calculadora.logica.FILAS
import com.tuusuario.calculadora.logica.Tecla
import com.tuusuario.calculadora.logica.TipoDeTecla
import com.tuusuario.calculadora.logica.etiquetaDe
import com.tuusuario.calculadora.logica.formatear
import com.tuusuario.calculadora.logica.operadorEncendido
import com.tuusuario.calculadora.logica.tipoDe
import com.tuusuario.calculadora.tema.Colores
import com.tuusuario.calculadora.tema.Motor
import com.tuusuario.calculadora.tema.anchoDelVisor
import com.tuusuario.calculadora.tema.ladoDeTecla
import com.tuusuario.calculadora.tema.letraDelVisor

@Composable
fun PantallaCalculadora(vm: CalculadoraViewModel, colores: Colores) {
    val estado by vm.estado.collectAsStateWithLifecycle()
    val anchoPantalla = LocalConfiguration.current.screenWidthDp // el ancho en dp: lo que en RN daba useWindowDimensions
    Calculadora(estado, colores, anchoPantalla, alTocar = vm::tocar)
}

/** Sin ViewModel adentro: recibe todo lo que dibuja. Así se puede ver en la vista previa con cualquier estado. */
@Composable
fun Calculadora(estado: Estado, colores: Colores, anchoPantalla: Int, alTocar: (Tecla) -> Unit) {
    val lado = ladoDeTecla(anchoPantalla)
    val encendido = operadorEncendido(estado)
    Box(Modifier.fillMaxSize().background(colores.fondo).safeDrawingPadding(), contentAlignment = Alignment.BottomCenter) {
        Column(Modifier.widthIn(max = Motor.Forma.ANCHO_MAXIMO.dp).fillMaxWidth()) {
            Visor(texto = estado.error ?: formatear(estado.pantalla), esAviso = estado.error != null, colores, anchoDelVisor(anchoPantalla))
            Column(
                Modifier.padding(start = Motor.Espacio.GRANDE.dp, end = Motor.Espacio.GRANDE.dp, bottom = Motor.Espacio.GRANDE.dp),
                verticalArrangement = Arrangement.spacedBy(Motor.Espacio.MEDIO.dp),
            ) {
                FILAS.forEach { fila ->
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        fila.forEach { t -> TeclaRedonda(t, lado, colores, encendida = t == encendido, alTocar) }
                    }
                }
            }
        }
    }
}

@Composable
private fun Visor(texto: String, esAviso: Boolean, colores: Colores, ancho: Int) {
    Text(
        text = texto,
        maxLines = 1,
        textAlign = TextAlign.End,
        fontWeight = FontWeight.Light,
        fontSize = (if (esAviso) Motor.Letra.AVISO else letraDelVisor(texto, ancho)).sp,
        color = if (esAviso) colores.tenue else colores.visor,
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = Motor.Espacio.GRANDE.dp, vertical = Motor.Espacio.MEDIO.dp)
            .semantics { liveRegion = LiveRegionMode.Polite }, // TalkBack dice el número nuevo cuando cambia
    )
}

@Composable
private fun TeclaRedonda(t: Tecla, lado: Int, colores: Colores, encendida: Boolean, alTocar: (Tecla) -> Unit) {
    val tipo = tipoDe(t)
    val esOperador = tipo == TipoDeTecla.OPERADOR || tipo == TipoDeTecla.IGUAL
    // Encendida: los colores al revés, para que se vea qué operador se eligió.
    val fondo = when {
        encendida -> colores.sobreOperador
        esOperador -> colores.operador
        tipo == TipoDeTecla.FUNCION -> colores.funcion
        else -> colores.numero
    }
    val texto = when {
        encendida -> colores.operador
        esOperador -> colores.sobreOperador
        tipo == TipoDeTecla.FUNCION -> colores.sobreFuncion
        else -> colores.sobreNumero
    }
    val toque = remember { MutableInteractionSource() }
    val apretada by toque.collectIsPressedAsState() // el `pressed` del Pressable de React Native

    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier
            .size(lado.dp)
            .clip(CircleShape)
            .background(fondo)
            .alpha(if (apretada) 0.6f else 1f)
            .clickable(interactionSource = toque, indication = null) { alTocar(t) }
            .clearAndSetSemantics { // lo que oye TalkBack: "dividir, botón", no "÷"
                contentDescription = etiquetaDe(t)
                role = Role.Button
                selected = encendida
            },
    ) {
        Text(t.simbolo, color = texto, fontSize = Motor.Letra.TECLA.sp, fontWeight = FontWeight.SemiBold)
    }
}
