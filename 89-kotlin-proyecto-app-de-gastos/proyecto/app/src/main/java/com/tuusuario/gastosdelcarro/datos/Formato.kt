// CÓMO SE ESCRIBE LA LISTA COMO TEXTO para guardarla: un gasto por línea, con sus campos separados por |
//   3|LAVADO|30.0|2026-11-18
// Kotlin puro (sin Android): se prueba en la computadora. Una línea rota se salta; no tira abajo a las demás.
package com.tuusuario.gastosdelcarro.datos

import com.tuusuario.gastosdelcarro.logica.Gasto
import com.tuusuario.gastosdelcarro.logica.Tipo
import java.time.LocalDate

fun aTexto(lista: List<Gasto>): String =
    lista.joinToString("\n") { "${it.id}|${it.tipo.name}|${it.valor}|${it.fecha}" }

fun deTexto(texto: String?): List<Gasto> {
    if (texto.isNullOrBlank()) return emptyList() // la primera vez: nada guardado
    return texto.lines().mapNotNull { linea -> leerLinea(linea) }
}

private fun leerLinea(linea: String): Gasto? {
    val partes = linea.split("|")
    if (partes.size != 4) return null
    val id = partes[0].toLongOrNull() ?: return null
    val tipo = Tipo.entries.firstOrNull { it.name == partes[1] } ?: return null
    val valor = partes[2].toDoubleOrNull() ?: return null
    val fecha = runCatching { LocalDate.parse(partes[3]) }.getOrNull() ?: return null
    return Gasto(id, tipo, valor, fecha)
}
