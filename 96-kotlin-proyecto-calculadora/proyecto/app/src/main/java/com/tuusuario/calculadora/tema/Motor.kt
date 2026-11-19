// EL MOTOR DE DISEÑO: los mismos valores que la calculadora de React Native (clase 94), ahora en Compose.
// Ningún componente escribe un color o una medida a mano: los "llama" desde aquí.
package com.tuusuario.calculadora.tema

import androidx.compose.ui.graphics.Color

/** Los dos temas tienen la misma forma (como la interfaz Colores de TypeScript). */
data class Colores(
    val fondo: Color,
    val visor: Color,
    val tenue: Color,
    val numero: Color,
    val sobreNumero: Color,
    val funcion: Color,
    val sobreFuncion: Color,
    val operador: Color,
    val sobreOperador: Color,
)

val Oscuro = Colores(
    fondo = Color(0xFF0F141B), visor = Color(0xFFE6EDF3), tenue = Color(0xFF8796AA),
    numero = Color(0xFF18212C), sobreNumero = Color(0xFFE6EDF3),
    funcion = Color(0xFF2B3644), sobreFuncion = Color(0xFFE6EDF3),
    operador = Color(0xFF7EE787), sobreOperador = Color(0xFF0F141B),
)

/** El claro es una copia del oscuro con otros colores: la misma forma, garantizada. */
val Claro = Oscuro.copy(
    fondo = Color(0xFFF5F7FA), visor = Color(0xFF1D232B), tenue = Color(0xFF57606A),
    numero = Color(0xFFFFFFFF), sobreNumero = Color(0xFF1D232B),
    funcion = Color(0xFFD8DEE4), sobreFuncion = Color(0xFF1D232B),
    operador = Color(0xFF1A7F37), sobreOperador = Color(0xFFFFFFFF),
)

/** Las medidas, en dp (se ven del mismo tamaño en cualquier pantalla). Números: así se prueban sin Android. */
object Motor {
    object Espacio { const val CHICO = 8; const val MEDIO = 14; const val GRANDE = 20 }
    object Forma { const val ANCHO_MAXIMO = 420 } // en una tableta, la calculadora no se estira
    object Letra { const val TECLA = 30; const val AVISO = 22; const val VISOR_GRANDE = 72; const val VISOR_CHICO = 40 }
}

/** Cuánto ocupa una cifra, comparada con el tamaño de la letra (un poco más de la mitad). */
const val ANCHO_DE_CIFRA = 0.62

/** El ancho donde entra el número: el de la calculadora, menos el aire de los costados. */
fun anchoDelVisor(anchoPantalla: Int): Int = minOf(anchoPantalla, Motor.Forma.ANCHO_MAXIMO) - Motor.Espacio.GRANDE * 2

/** El tamaño por largo, pero nunca más grande del que entra (la lección de la clase 95, desde el principio). */
fun letraDelVisor(texto: String, ancho: Int): Int {
    val porLargo = when {
        texto.length <= 7 -> Motor.Letra.VISOR_GRANDE
        texto.length <= 11 -> 56
        else -> Motor.Letra.VISOR_CHICO
    }
    val queEntra = (ancho / (texto.length * ANCHO_DE_CIFRA)).toInt()
    return minOf(porLargo, queEntra)
}

/** El lado de cada tecla: cuatro por fila con sus tres huecos. */
fun ladoDeTecla(anchoPantalla: Int): Int = (anchoDelVisor(anchoPantalla) - Motor.Espacio.MEDIO * 3) / 4
