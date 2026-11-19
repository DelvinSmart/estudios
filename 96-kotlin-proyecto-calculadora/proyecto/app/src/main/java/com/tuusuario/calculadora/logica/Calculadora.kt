// LA LÓGICA DE LA CALCULADORA, en Kotlin puro: qué pasa con cada tecla. Sin Android ni Compose.
// Las MISMAS decisiones que la de React Native (clase 94): están en PLAN.md, y cada una tiene su prueba.
package com.tuusuario.calculadora.logica

import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

/** Las teclas. En TypeScript eran textos ('7' | '+' | …); en Kotlin, una familia cerrada de tipos (sealed). */
sealed interface Tecla {
    val simbolo: String

    data class Digito(val numero: Int) : Tecla {
        override val simbolo get() = numero.toString()
    }
    data object Coma : Tecla { override val simbolo = "," }
    data object Igual : Tecla { override val simbolo = "=" }
    data object BorrarTodo : Tecla { override val simbolo = "C" }
    data object BorrarUno : Tecla { override val simbolo = "⌫" }
    data object Porcentaje : Tecla { override val simbolo = "%" }
    data object Signo : Tecla { override val simbolo = "±" }
}

enum class Operador(override val simbolo: String) : Tecla {
    SUMAR("+"), RESTAR("−"), MULTIPLICAR("×"), DIVIDIR("÷")
}

/** Lo que la calculadora recuerda. data class: cada cambio es una copia nueva (con copy), nunca se cambia por dentro. */
data class Estado(
    val pantalla: String = "0", // con punto decimal, como texto: "1234.5"
    val guardado: BigDecimal? = null, // el primer número de la cuenta
    val operador: Operador? = null,
    val nuevoNumero: Boolean = true, // el próximo dígito empieza un número nuevo
    val error: String? = null, // un aviso para la persona
)

val INICIAL = Estado()

const val MAX_CIFRAS = 12
private val LIMITE = BigDecimal("1E12") // un resultado de 13 cifras o más no entra en el visor
private val CIEN = BigDecimal(100)
private val DOCE_CIFRAS = MathContext(MAX_CIFRAS, RoundingMode.HALF_UP)

const val DIVIDIR_ENTRE_CERO = "No se puede dividir entre 0"
const val MUY_GRANDE = "El número es muy grande"

/** El resultado de una cuenta: un número o un aviso. En TypeScript era `number | string`. */
sealed interface Resultado {
    data class Numero(val valor: BigDecimal) : Resultado
    data class Aviso(val texto: String) : Resultado
}

/**
 * BigDecimal guarda los decimales EXACTOS: 0,1 + 0,2 da 0,3 sin trucos (en JavaScript hacía falta redondear).
 * Solo hay que redondear lo que no termina nunca, como 1 ÷ 3: a 12 cifras.
 */
fun calcular(a: BigDecimal, operador: Operador, b: BigDecimal): Resultado {
    val r = when (operador) { // when con un enum: si falta un caso, Kotlin no compila
        Operador.SUMAR -> a + b
        Operador.RESTAR -> a - b
        Operador.MULTIPLICAR -> a * b
        Operador.DIVIDIR -> {
            if (b.signum() == 0) return Resultado.Aviso(DIVIDIR_ENTRE_CERO)
            a.divide(b, DOCE_CIFRAS)
        }
    }.round(DOCE_CIFRAS)
    return if (r.abs() >= LIMITE) Resultado.Aviso(MUY_GRANDE) else Resultado.Numero(r)
}

/** Un número a texto con punto decimal, sin ceros de más ("2.50" → "2.5") y sin notación científica. */
private fun aTexto(x: BigDecimal): String = x.stripTrailingZeros().toPlainString()

/** "-1234.5" → "-1.234,5": punto de miles y coma decimal, como en Brasil. */
fun formatear(pantalla: String): String {
    val negativo = pantalla.startsWith("-")
    val partes = pantalla.removePrefix("-").split(".")
    val conMiles = partes[0].reversed().chunked(3).joinToString(".").reversed()
    val decimal = if (partes.size > 1) "," + partes[1] else ""
    return (if (negativo) "-" else "") + conMiles + decimal
}

private fun cifras(pantalla: String) = pantalla.count { it.isDigit() }

private fun conResultado(r: Resultado, sigue: (Estado) -> Estado): Estado = when (r) {
    is Resultado.Aviso -> Estado(error = r.texto)
    is Resultado.Numero -> sigue(Estado(pantalla = aTexto(r.valor)))
}

/** Qué pasa cuando se toca una tecla. Devuelve un estado NUEVO: nunca cambia el que recibe. */
fun apretar(e: Estado, t: Tecla): Estado {
    // Después de un aviso, cualquier tecla empieza de cero (y la tecla cuenta, si es un número).
    if (e.error != null) return if (t == Tecla.BorrarTodo || t == Tecla.BorrarUno) INICIAL else apretar(INICIAL, t)

    val actual = BigDecimal(e.pantalla.removeSuffix("."))

    // when con una familia sealed: Kotlin revisa que estén TODAS las teclas. Si agregas una, te avisa aquí.
    return when (t) {
        is Tecla.Digito -> when {
            e.nuevoNumero -> e.copy(pantalla = t.simbolo, nuevoNumero = false)
            cifras(e.pantalla) >= MAX_CIFRAS -> e
            else -> e.copy(pantalla = if (e.pantalla == "0") t.simbolo else e.pantalla + t.simbolo)
        }

        Tecla.Coma -> when {
            e.nuevoNumero -> e.copy(pantalla = "0.", nuevoNumero = false)
            "." in e.pantalla -> e
            else -> e.copy(pantalla = e.pantalla + ".")
        }

        is Operador -> when {
            // 5 + × → vale el último operador.
            e.operador != null && e.nuevoNumero -> e.copy(operador = t)
            // 2 + 3 × → primero resuelve 2 + 3 (de izquierda a derecha) y muestra 5.
            e.operador != null && e.guardado != null -> {
                val r = calcular(e.guardado, e.operador, actual)
                conResultado(r) { it.copy(guardado = (r as Resultado.Numero).valor, operador = t, nuevoNumero = true) }
            }
            else -> e.copy(guardado = actual, operador = t, nuevoNumero = true)
        }

        // = otra vez: no hace nada. 5 + = → la pantalla todavía muestra 5, y ese es el segundo número.
        Tecla.Igual ->
            if (e.operador == null || e.guardado == null) e
            else conResultado(calcular(e.guardado, e.operador, actual)) { it }

        Tecla.BorrarTodo -> INICIAL

        // Un resultado no se "escribió": no se borra de a uno.
        Tecla.BorrarUno -> if (e.nuevoNumero) e else {
            val sin = e.pantalla.dropLast(1)
            e.copy(pantalla = if (sin.isEmpty() || sin == "-") "0" else sin)
        }

        Tecla.Signo -> when {
            actual.signum() == 0 -> e
            e.pantalla.startsWith("-") -> e.copy(pantalla = e.pantalla.removePrefix("-"))
            else -> e.copy(pantalla = "-" + e.pantalla)
        }

        // En una suma o resta, el porcentaje del primer número (200 + 10 % → 20); si no, divide entre 100.
        Tecla.Porcentaje -> {
            val p = if ((e.operador == Operador.SUMAR || e.operador == Operador.RESTAR) && e.guardado != null)
                (e.guardado * actual).divide(CIEN, DOCE_CIFRAS) else actual.divide(CIEN, DOCE_CIFRAS)
            // Ojo: nunca `/` entre BigDecimal: conserva los decimales del primero y 45 / 100 da 0 (encontrado leyendo el código).
            e.copy(pantalla = aTexto(p.round(DOCE_CIFRAS)), nuevoNumero = false)
        }
    }
}
