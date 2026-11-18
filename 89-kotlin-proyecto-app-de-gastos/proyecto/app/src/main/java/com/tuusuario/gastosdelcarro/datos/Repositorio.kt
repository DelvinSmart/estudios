// LOS DATOS: guardar y leer la lista, detrás de una INTERFAZ (clase 64).
// El ViewModel solo conoce RepositorioGastos: no sabe si es DataStore, memoria o, mañana, Firebase.
package com.tuusuario.gastosdelcarro.datos

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.tuusuario.gastosdelcarro.logica.Gasto
import kotlinx.coroutines.flow.first

interface RepositorioGastos {
    suspend fun leer(): List<Gasto>
    suspend fun guardar(lista: List<Gasto>)
}

/** En memoria: para las pruebas. */
class RepositorioEnMemoria(inicial: List<Gasto> = emptyList()) : RepositorioGastos {
    var guardado: List<Gasto> = inicial
        private set

    override suspend fun leer(): List<Gasto> = guardado
    override suspend fun guardar(lista: List<Gasto>) {
        guardado = lista
    }
}

// Un solo DataStore por app (Android lo exige). "by" crea el archivo la primera vez que se usa.
private val Context.almacen by preferencesDataStore(name = "gastos")
private val CLAVE = stringPreferencesKey("gastos-v1") // la v1 deja cambiar el formato más adelante

/** En el teléfono, con DataStore: el reemplazo moderno de SharedPreferences, con corrutinas (clase 67). */
class RepositorioDataStore(private val contexto: Context) : RepositorioGastos {
    override suspend fun leer(): List<Gasto> = deTexto(contexto.almacen.data.first()[CLAVE])

    override suspend fun guardar(lista: List<Gasto>) {
        contexto.almacen.edit { it[CLAVE] = aTexto(lista) }
    }
}
