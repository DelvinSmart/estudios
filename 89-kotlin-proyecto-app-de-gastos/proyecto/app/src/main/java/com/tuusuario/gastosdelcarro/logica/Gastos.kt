// LA LÓGICA: las reglas y las cuentas de los gastos. Kotlin puro: no importa NADA de Android.
// Por eso sus pruebas corren en la computadora con JUnit, en milisegundos, sin teléfono ni emulador.
package com.tuusuario.gastosdelcarro.logica

import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeParseException
import kotlin.math.abs
import kotlin.math.roundToLong

enum class Tipo(val texto: String) {
    COMBUSTIBLE("combustible"),
    LAVADO("lavado"),
    PEAJE("peaje"),
    MANTENIMIENTO("mantenimiento"),
    OTRO("otro"),
}

/** Un gasto. data class: compara por contenido, se copia con copy() y no cambia (todo es val). */
data class Gasto(val id: Long, val tipo: Tipo, val valor: Double, val fecha: LocalDate)

/** Lo que escribe la persona: TEXTO. Todavía no es un gasto: primero se revisa. */
data class Borrador(val tipo: Tipo?, val valor: String, val fecha: String)

/** "12,50" → 12.5. En Brasil se escribe con coma. Vacío o letras → null (no hay número). */
fun leerValor(texto: String): Double? = texto.trim().replace(',', '.').toDoubleOrNull()

/** "2026-11-18" → la fecha. Un día que no existe ("2026-02-31") o mal escrito → null. */
fun leerFecha(texto: String): LocalDate? =
    try {
        LocalDate.parse(texto.trim()) // el formato de LocalDate es AAAA-MM-DD, y es estricto con los días
    } catch (e: DateTimeParseException) {
        null
    }

/** Las puertas y ventanas: la lista de problemas, en español (vacía si está todo bien). */
fun problemasDe(b: Borrador, hoy: LocalDate): List<String> {
    val problemas = mutableListOf<String>()
    if (b.tipo == null) problemas += "Elige un tipo de gasto"
    val valor = leerValor(b.valor)
    when {
        valor == null || valor <= 0.0 -> problemas += "Escribe un valor mayor que 0"
        valor > 100_000 -> problemas += "El valor es demasiado grande"
    }
    val fecha = leerFecha(b.fecha)
    when {
        fecha == null -> problemas += "La fecha tiene que ser un día que exista (AAAA-MM-DD)"
        fecha.isAfter(hoy) -> problemas += "La fecha no puede ser en el futuro"
    }
    return problemas
}

/** Arma el gasto. Solo se llama si problemasDe() dio una lista vacía (por eso los !! no pueden fallar). */
fun crearGasto(b: Borrador, id: Long): Gasto =
    Gasto(id = id, tipo = b.tipo!!, valor = redondear(leerValor(b.valor)!!), fecha = leerFecha(b.fecha)!!)

/** Lo más nuevo arriba. El nuevo entra PRIMERO y el orden de Kotlin es estable:
 *  entre dos del mismo día, el que acabas de anotar queda arriba (el mismo error que se arregló en la clase 88). */
fun agregar(lista: List<Gasto>, gasto: Gasto): List<Gasto> =
    (listOf(gasto) + lista).sortedByDescending { it.fecha }

fun quitar(lista: List<Gasto>, id: Long): List<Gasto> = lista.filterNot { it.id == id }

/** Un id que no se repite: uno más que el mayor. */
fun siguienteId(lista: List<Gasto>): Long = (lista.maxOfOrNull { it.id } ?: 0L) + 1

/** El lunes de la semana de "hoy". */
fun inicioDeSemana(hoy: LocalDate): LocalDate = hoy.minusDays((hoy.dayOfWeek.value - DayOfWeek.MONDAY.value).toLong())

data class Semana(val total: Double, val cantidad: Int)

/** El total de lunes a hoy, sin los centavos descontrolados de 0.1 + 0.2. */
fun totalDeLaSemana(lista: List<Gasto>, hoy: LocalDate): Semana {
    val lunes = inicioDeSemana(hoy)
    val deEstaSemana = lista.filter { !it.fecha.isBefore(lunes) && !it.fecha.isAfter(hoy) }
    return Semana(total = redondear(deEstaSemana.sumOf { it.valor }), cantidad = deEstaSemana.size)
}

fun redondear(n: Double): Double = (n * 100).roundToLong() / 100.0

/** 1234.5 → "R$ 1.234,50", como se escribe en Brasil (sin depender del idioma del teléfono). */
fun dinero(valor: Double): String {
    val centavosTotales = (abs(valor) * 100).roundToLong()
    val entero = (centavosTotales / 100).toString().reversed().chunked(3).joinToString(".").reversed()
    val centavos = (centavosTotales % 100).toString().padStart(2, '0')
    return (if (valor < 0) "-" else "") + "R$ $entero,$centavos"
}
