// EL MOTOR DE DISEÑO: los mismos valores que la app de React Native (clase 88), ahora en Compose.
// Ningún componente escribe un color o una medida a mano: los "llama" desde aquí.
package com.tuusuario.gastosdelcarro.tema

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object Motor {
    object Colores {
        val fondo = Color(0xFF0F141B)
        val tarjeta = Color(0xFF18212C)
        val borde = Color(0xFF2B3644)
        val texto = Color(0xFFE6EDF3)
        val tenue = Color(0xFF8796AA)
        val acento = Color(0xFF7EE787)
        val sobreAcento = Color(0xFF0F141B)
        val peligro = Color(0xFFFF7B72)
    }

    object Espacio {
        val chico = 8.dp
        val medio = 14.dp
        val grande = 20.dp
    }

    object Forma {
        val radio = 14.dp
        val radioChico = 8.dp
    }

    object Letra {
        val chica = 14.sp
        val normal = 16.sp
        val grande = 30.sp
    }
}

/** El tema de Material 3, armado con los colores del motor. Envuelve toda la app. */
@Composable
fun TemaGastos(contenido: @Composable () -> Unit) {
    val colores = darkColorScheme(
        background = Motor.Colores.fondo,
        surface = Motor.Colores.tarjeta,
        onBackground = Motor.Colores.texto,
        onSurface = Motor.Colores.texto,
        primary = Motor.Colores.acento,
        onPrimary = Motor.Colores.sobreAcento,
        error = Motor.Colores.peligro,
        outline = Motor.Colores.borde,
    )
    MaterialTheme(colorScheme = colores, content = contenido)
}
