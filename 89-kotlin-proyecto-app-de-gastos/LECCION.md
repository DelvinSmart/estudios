# Kotlin 8: proyecto final, la app de gastos en Android

> 🌎 **En la vida real:** el aprendiz de carpintero que ya hizo una mesa con herramientas eléctricas ahora la hace **a mano, con formón y serrucho**. Es la misma mesa, pero entiende cada unión desde adentro. Esta clase es la misma app de gastos de la clase 88, hecha a mano para Android.

> 🎙️ **El profesor dice:** {{alumno}}, hoy haces la app de gastos **nativa de Android**, con Kotlin y Jetpack Compose: anotar, ver el total de la semana, borrar, y que nada se pierda al cerrar la app ni al girar el teléfono. Es la misma app de React Native de la clase 88, así que puedes comparar pieza por pieza. La recorres por partes, en cada parte escribes tú una pieza en Kotlin (corre en el Kotlin Playground, como en todo el curso), y al final la abres en el emulador de Android Studio.

**Lo que vas a recorrer** (está completo en la carpeta `89-kotlin-proyecto-app-de-gastos/proyecto` de este mismo repositorio):

| Pieza | Archivo | Su única tarea | En la app de la clase 88 |
|---|---|---|---|
| Las versiones | `gradle/libs.versions.toml` | Todas las librerías y sus versiones, en un lugar | `package.json` |
| El módulo | `app/build.gradle.kts` | Qué es la app, para qué Android sale y qué usa | `app.json` + `package.json` |
| La lógica | `logica/Gastos.kt` | Las reglas y las cuentas, en Kotlin puro | `src/logica/gastos.ts` |
| Los datos | `datos/Repositorio.kt` y `datos/Formato.kt` | Guardar y leer, detrás de una interfaz | `src/datos/repositorio.ts` |
| El ViewModel | `pantalla/GastosViewModel.kt` | El estado de la pantalla | el hook `useGastos` |
| La pantalla | `pantalla/PantallaGastos.kt` | Dibujar el estado y avisar lo que se toca | los componentes |
| El motor | `tema/Motor.kt` | Colores, espacios, formas y letras | `src/tema/motor.ts` |
| El director | `MainActivity.kt` | La ventana: crea el repositorio y el ViewModel | `App.tsx` |
| Las pruebas | `app/src/test/` | 23 pruebas con JUnit, sin teléfono | 27 con Jest |

## Parte 1. El plano y el proyecto de Gradle

El plano es el mismo de la clase 88: anotar (tipo, valor, fecha), ver la lista con lo más nuevo arriba, el total de la semana de lunes a hoy, y borrar. Las mismas puertas y ventanas, más una de Android: **girar el teléfono** no puede borrar lo que estabas escribiendo.

En Android, la app se arma con **Gradle** (clase 66). Este proyecto tiene tres archivos de Gradle, cada uno con su tarea:

```text
proyecto/
├── settings.gradle.kts          de dónde bajar las librerías y qué módulos hay (uno: app)
├── gradle/libs.versions.toml    TODAS las versiones, en un solo lugar
└── app/build.gradle.kts         la app: su identidad, su Android mínimo y lo que usa
```

El catálogo de versiones es como el motor de diseño, pero de librerías:

```toml
[versions]
agp = "8.12.0"
kotlin = "2.1.20"
composeBom = "2025.06.01"
datastore = "1.1.7"

[libraries]
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
```

Y el módulo lo usa con nombres, sin escribir ninguna versión:

```kotlin
android {
    namespace = "com.tuusuario.gastosdelcarro"
    compileSdk = 36
    defaultConfig {
        applicationId = "com.tuusuario.gastosdelcarro" // la identidad de la app: cámbiala por la tuya
        minSdk = 26        // Android 8: desde aquí LocalDate viene en el teléfono
        targetSdk = 36
        versionCode = 1    // súbelo en cada versión que va a Google Play
        versionName = "1.0.0"
    }
    buildFeatures { compose = true }
}

dependencies {
    implementation(libs.androidx.datastore.preferences)
    implementation(platform(libs.androidx.compose.bom)) // el BOM elige versiones de Compose que van juntas
    implementation(libs.androidx.compose.material3)
    testImplementation(libs.junit)
}
```

**Por qué estas versiones:** son las mismas que usa Copiloto para compilar su parte de Android en esta Mac (Gradle 9.3.1, el plugin de Android 8.12.0 y Kotlin 2.1.20). Elegir versiones que **ya sabes que funcionan juntas** ahorra horas. La revisión de Android (`./gradlew lintDebug`) avisa que hay versiones más nuevas, y no es un error: se suben con calma, de una en una, probando.

> 🌎 **En la vida real:** el catálogo de versiones es como la lista de repuestos de un carro con sus números de pieza exactos. El mecánico no pide "un filtro": pide el número que sabe que encaja.

> 🌎 **Otro ejemplo:** el BOM de Compose es como comprar un juego de llaves de la misma marca: todas encajan entre sí, en vez de juntar llaves sueltas de tamaños parecidos.

> 🧩 **Piezas para este ejercicio**
> - Recorre las secciones en orden y guarda si estás dentro de `[versions]`. Las líneas con `=` solo se interpretan como versiones mientras esa sección esté activa.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer el catálogo de versiones
lenguaje: kotlin
pide: Completa `versiones(toml)`: devuelve un mapa con las versiones de la sección `[versions]` (nombre → versión, sin comillas). Solo esa sección: termina cuando empieza otra línea con `[`. Ignora líneas vacías y comentarios (`#`). Pista: `lines()`, `trim()`, `substringBefore("=")`, `substringAfter("=")` y `trim('"', ' ')`.
--- código
fun versiones(toml: String): Map<String, String> {
    TODO()
}
--- pruebas
val toml = """
    # las versiones
    [versions]
    agp = "8.12.0"
    kotlin = "2.1.20"

    composeBom = "2025.06.01"
    [libraries]
    junit = { group = "junit", name = "junit", version.ref = "junit" }
""".trimIndent()
prueba("las de [versions]") { igual(versiones(toml), mapOf("agp" to "8.12.0", "kotlin" to "2.1.20", "composeBom" to "2025.06.01")) }
prueba("no mira [libraries]") { ok("junit" !in versiones(toml), "junit está en [libraries], no en [versions]") }
prueba("sin [versions], vacío") { igual(versiones("[libraries]\nx = 1"), mapOf<String, String>()) }
--- solución
fun versiones(toml: String): Map<String, String> {
    val resultado = mutableMapOf<String, String>()
    var adentro = false
    for (linea in toml.lines().map { it.trim() }) {
        if (linea.startsWith("[")) {
            adentro = linea == "[versions]"
            continue
        }
        if (!adentro || linea.isEmpty() || linea.startsWith("#")) continue
        resultado[linea.substringBefore("=").trim()] = linea.substringAfter("=").trim('"', ' ')
    }
    return resultado
}
```

```practica
vf :: En este proyecto, las versiones de las librerías se escriben en cada build.gradle.kts
vf :: El applicationId es la identidad de la app y no se puede cambiar después de publicarla
elige :: ¿Para qué sirve el BOM de Compose? :: Para que la app sea más chica :: Para elegir versiones de las librerías de Compose que funcionan juntas :: Para publicar en Google Play
elige :: ¿Por qué minSdk = 26 en esta app? :: Porque es el más nuevo :: Porque desde Android 8 LocalDate viene en el teléfono :: Porque Compose lo exige
escribe :: Nombra los tres archivos de Gradle del proyecto y la tarea de cada uno. :: settings.gradle.kts dice de dónde bajar las librerías y qué módulos hay; gradle/libs.versions.toml tiene todas las versiones en un lugar; app/build.gradle.kts dice qué es la app (su identidad, su Android mínimo, Compose) y qué librerías usa.
```

## Parte 2. La lógica en Kotlin puro

`logica/Gastos.kt` **no importa nada de Android**. Por eso sus pruebas corren en la computadora con JUnit, en milisegundos, sin emulador.

```kotlin
enum class Tipo(val texto: String) {
    COMBUSTIBLE("combustible"), LAVADO("lavado"), PEAJE("peaje"), MANTENIMIENTO("mantenimiento"), OTRO("otro"),
}

data class Gasto(val id: Long, val tipo: Tipo, val valor: Double, val fecha: LocalDate)

/** Lo que escribe la persona: TEXTO. Todavía no es un gasto: primero se revisa. */
data class Borrador(val tipo: Tipo?, val valor: String, val fecha: String)

fun leerValor(texto: String): Double? = texto.trim().replace(',', '.').toDoubleOrNull()

fun leerFecha(texto: String): LocalDate? =
    try {
        LocalDate.parse(texto.trim())
    } catch (e: DateTimeParseException) {
        null
    }
```

Fíjate en la diferencia con TypeScript (clase 88): allá había que **comprobar a mano** que el 31 de febrero no existe. Aquí `LocalDate.parse` ya es estricto: con un día que no existe, lanza un error, y `leerFecha` lo convierte en `null`. Y `toDoubleOrNull()` hace lo mismo con el valor: el **null** de Kotlin (clase 62) dice "no hay número", sin trampas como `NaN`.

Las puertas y ventanas, con `when` (clase 62):

```kotlin
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
```

Mira la segunda rama del primer `when`: `valor > 100_000`. Kotlin sabe que ahí `valor` **ya no es null**, porque la rama de arriba se ocupó del null. Se llama *smart cast*: no hace falta `!!`.

> 🌎 **En la vida real:** el `Borrador` es como el formulario en papel que llena el cliente en el taller: todavía no es una orden de trabajo. El recepcionista lo revisa, y solo si está completo se convierte en una orden con su número.

> 🌎 **Otro ejemplo:** `LocalDate.parse` es como un cajero que conoce el calendario: si le das un cheque del 31 de febrero, lo devuelve. No tienes que revisarlo tú.

> 🧩 **Piezas para este ejercicio**
> - Las funciones de lectura pueden devolver `null`. Comprueba si la fecha se pudo leer antes de compararla con hoy. Conserva cada aviso en la lista para que se puedan mostrar juntos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las puertas y ventanas, en Kotlin
lenguaje: kotlin
pide: Completa `problemasDe(b, hoy)` como la de la app: `"Elige un tipo de gasto"` si no hay tipo; `"Escribe un valor mayor que 0"` si el valor no se puede leer o no es mayor que 0; `"La fecha tiene que ser un día que exista (AAAA-MM-DD)"` si la fecha no se puede leer; `"La fecha no puede ser en el futuro"` si es después de hoy. `leerValor` y `leerFecha` ya están hechas.
--- código
import java.time.LocalDate

data class Borrador(val tipo: String?, val valor: String, val fecha: String)

fun leerValor(texto: String): Double? = texto.trim().replace(',', '.').toDoubleOrNull()
fun leerFecha(texto: String): LocalDate? = try { LocalDate.parse(texto.trim()) } catch (e: Exception) { null }

fun problemasDe(b: Borrador, hoy: LocalDate): List<String> {
    val problemas = mutableListOf<String>()
    TODO()
}
--- pruebas
val hoy = LocalDate.of(2026, 11, 18)
val bien = Borrador("lavado", "30", "2026-11-18")
prueba("todo bien") { igual(problemasDe(bien, hoy), listOf<String>()) }
prueba("con coma está bien") { igual(problemasDe(bien.copy(valor = "12,50"), hoy), listOf<String>()) }
prueba("valor vacío, 0 o letras") { igual(listOf("", "0", "abc").map { problemasDe(bien.copy(valor = it), hoy) }, List(3) { listOf("Escribe un valor mayor que 0") }) }
prueba("el 31 de febrero") { igual(problemasDe(bien.copy(fecha = "2026-02-31"), hoy), listOf("La fecha tiene que ser un día que exista (AAAA-MM-DD)")) }
prueba("mañana todavía no") { igual(problemasDe(bien.copy(fecha = "2026-11-19"), hoy), listOf("La fecha no puede ser en el futuro")) }
prueba("todo mal a la vez") { igual(problemasDe(Borrador(null, "0", "ayer"), hoy).size, 3) }
--- solución
import java.time.LocalDate

data class Borrador(val tipo: String?, val valor: String, val fecha: String)

fun leerValor(texto: String): Double? = texto.trim().replace(',', '.').toDoubleOrNull()
fun leerFecha(texto: String): LocalDate? = try { LocalDate.parse(texto.trim()) } catch (e: Exception) { null }

fun problemasDe(b: Borrador, hoy: LocalDate): List<String> {
    val problemas = mutableListOf<String>()
    if (b.tipo == null) problemas += "Elige un tipo de gasto"
    val valor = leerValor(b.valor)
    if (valor == null || valor <= 0.0) problemas += "Escribe un valor mayor que 0"
    val fecha = leerFecha(b.fecha)
    when {
        fecha == null -> problemas += "La fecha tiene que ser un día que exista (AAAA-MM-DD)"
        fecha.isAfter(hoy) -> problemas += "La fecha no puede ser en el futuro"
    }
    return problemas
}
```

```practica
vf :: La lógica de Gastos.kt importa clases de Android
vf :: En Kotlin, LocalDate.parse("2026-02-31") lanza un error porque ese día no existe
elige :: ¿Qué es un smart cast? :: Convertir un número en texto :: Que Kotlin sepa que una variable ya no es null porque una rama de antes se ocupó del null :: Un tipo de lambda
elige :: ¿Por qué el Borrador guarda el valor como String y no como Double? :: Por error :: Porque es lo que escribió la persona, y todavía no se sabe si es un número válido :: Porque Double no existe en Kotlin
escribe :: Compara cómo se revisa la fecha en la app de React Native (clase 88) y en esta. :: En TypeScript había que armar la fecha y comprobar a mano que el día seguía siendo el mismo, porque JavaScript convierte el 31 de febrero en el 3 de marzo. En Kotlin, LocalDate.parse ya rechaza los días que no existen, y leerFecha devuelve null.
```

## Parte 3. Guardar en el teléfono: el repositorio y el formato

Los datos van detrás de una **interfaz** (clase 64). El ViewModel solo conoce el contrato:

```kotlin
interface RepositorioGastos {
    suspend fun leer(): List<Gasto>
    suspend fun guardar(lista: List<Gasto>)
}
```

Hay dos que lo cumplen: `RepositorioEnMemoria`, para las pruebas, y `RepositorioDataStore`, para el teléfono, con **DataStore** (clase 67):

```kotlin
private val Context.almacen by preferencesDataStore(name = "gastos")
private val CLAVE = stringPreferencesKey("gastos-v1")

class RepositorioDataStore(private val contexto: Context) : RepositorioGastos {
    override suspend fun leer(): List<Gasto> = deTexto(contexto.almacen.data.first()[CLAVE])

    override suspend fun guardar(lista: List<Gasto>) {
        contexto.almacen.edit { it[CLAVE] = aTexto(lista) }
    }
}
```

DataStore guarda texto, como AsyncStorage. La forma de convertir la lista en texto vive aparte, en `Formato.kt`, en Kotlin puro, para poder probarla en la computadora: **un gasto por línea**, con los campos separados por `|`.

```text
2|LAVADO|30.5|2026-11-18
1|PEAJE|12.0|2026-11-10
```

```kotlin
fun deTexto(texto: String?): List<Gasto> {
    if (texto.isNullOrBlank()) return emptyList()
    return texto.lines().mapNotNull { linea -> leerLinea(linea) }
}

private fun leerLinea(linea: String): Gasto? {
    val partes = linea.split("|")
    if (partes.size != 4) return null
    val id = partes[0].toLongOrNull() ?: return null
    val tipo = Tipo.entries.firstOrNull { it.name == partes[1] } ?: return null
    // …el valor y la fecha, igual
    return Gasto(id, tipo, valor, fecha)
}
```

`?: return null` se lee "si no se pudo, esta línea no sirve". Y `mapNotNull` se queda solo con las líneas que sí sirvieron: **una línea rota no tira abajo a las demás**.

> 🌎 **En la vida real:** el formato es como la libreta del taller con una línea por trabajo: "fecha, carro, qué se hizo, cuánto". Si una línea se mojó y no se lee, las demás siguen sirviendo.

> 🌎 **Otro ejemplo:** la interfaz es como el enchufe de la pared: cualquier aparato con el enchufe correcto funciona. El ViewModel no sabe si del otro lado hay DataStore o una lista en memoria.

> 🧩 **Piezas para este ejercicio**
> - Cada línea es un registro independiente. `mapNotNull` permite devolver `null` para una fila dañada y conservar las válidas. Comprueba cuántos campos hay antes de leer sus posiciones.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: De texto a gastos, sin que una línea rota tire todo
lenguaje: kotlin
pide: Completa `aTexto(lista)`, que escribe un gasto por línea como `2|LAVADO|30.5|2026-11-18` (unidas con `"\n"`), y `deTexto(texto)`, que hace lo contrario. Si el texto es null o está en blanco, lista vacía. Una línea que no tiene 4 partes, o con un id, tipo, valor o fecha que no se puede leer, se **salta**. Pista: `mapNotNull`, `toLongOrNull()`, `Tipo.entries.firstOrNull { … }` y `?: return null`.
--- código
import java.time.LocalDate

enum class Tipo { COMBUSTIBLE, LAVADO, PEAJE, MANTENIMIENTO, OTRO }
data class Gasto(val id: Long, val tipo: Tipo, val valor: Double, val fecha: LocalDate)

fun aTexto(lista: List<Gasto>): String = TODO()

fun deTexto(texto: String?): List<Gasto> {
    TODO()
}
--- pruebas
val lista = listOf(Gasto(2, Tipo.LAVADO, 30.5, LocalDate.of(2026, 11, 18)), Gasto(1, Tipo.PEAJE, 12.0, LocalDate.of(2026, 11, 10)))
prueba("una línea por gasto") { igual(aTexto(lista), "2|LAVADO|30.5|2026-11-18\n1|PEAJE|12.0|2026-11-10") }
prueba("ida y vuelta") { igual(deTexto(aTexto(lista)), lista) }
prueba("nada guardado") { igual(listOf(deTexto(null), deTexto("")), listOf(listOf<Gasto>(), listOf<Gasto>())) }
prueba("las líneas rotas se saltan") { igual(deTexto("2|LAVADO|30.5|2026-11-18\nbasura\n3|CASINO|1.0|2026-11-18\n4|PEAJE|mucho|2026-11-18\n5|OTRO|1.0|2026-02-31"), listOf(lista[0])) }
--- solución
import java.time.LocalDate

enum class Tipo { COMBUSTIBLE, LAVADO, PEAJE, MANTENIMIENTO, OTRO }
data class Gasto(val id: Long, val tipo: Tipo, val valor: Double, val fecha: LocalDate)

fun aTexto(lista: List<Gasto>): String = lista.joinToString("\n") { "${it.id}|${it.tipo.name}|${it.valor}|${it.fecha}" }

fun deTexto(texto: String?): List<Gasto> {
    if (texto.isNullOrBlank()) return emptyList()
    return texto.lines().mapNotNull { linea ->
        val partes = linea.split("|")
        if (partes.size != 4) return@mapNotNull null
        val id = partes[0].toLongOrNull() ?: return@mapNotNull null
        val tipo = Tipo.entries.firstOrNull { it.name == partes[1] } ?: return@mapNotNull null
        val valor = partes[2].toDoubleOrNull() ?: return@mapNotNull null
        val fecha = try { LocalDate.parse(partes[3]) } catch (e: Exception) { return@mapNotNull null }
        Gasto(id, tipo, valor, fecha)
    }
}
```

```practica
vf :: El ViewModel sabe que los gastos se guardan con DataStore
vf :: Si una línea del texto guardado está rota, deTexto la salta y lee las demás
elige :: ¿Qué hace ?: return null en leerLinea? :: Devuelve el valor por defecto :: Si lo de la izquierda es null, corta la función y dice que esta línea no sirve :: Lanza un error
elige :: ¿Por qué el formato vive en Formato.kt y no dentro de RepositorioDataStore? :: Por estilo :: Para probarlo en la computadora, sin Android :: Porque DataStore lo pide
escribe :: Cuenta qué pasa, en orden, cuando guardas un gasto, hasta que queda en el teléfono. :: El ViewModel arma la lista nueva y la pone en el estado; después, en una corrutina, le pide al repositorio que guarde; RepositorioDataStore convierte la lista en texto con aTexto, un gasto por línea, y lo guarda con DataStore bajo la clave gastos-v1.
```

## Parte 4. El ViewModel: el estado de la pantalla

El ViewModel (clase 66) guarda **todo** lo que la pantalla necesita en una sola `data class`:

```kotlin
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
        viewModelScope.launch {
            val lista = try { repositorio.leer() } catch (e: Exception) { /* aviso */ emptyList() }
            _estado.update { it.copy(cargando = false, gastos = lista, semana = totalDeLaSemana(lista, hoy())) }
        }
    }

    fun guardar(borrador: Borrador): Boolean {
        // Si todavía no se leyó lo guardado, guardar ahora pisaría la lista del teléfono con una vacía.
        if (_estado.value.cargando) return false
        val problemas = problemasDe(borrador, hoy())
        _estado.update { it.copy(problemas = problemas) }
        if (problemas.isNotEmpty()) return false
        cambiarLista { lista -> agregar(lista, crearGasto(borrador, siguienteId(lista))) }
        return true
    }
}
```

- **`_estado` privado y `estado` público de solo lectura:** solo el ViewModel cambia el estado. La pantalla lo lee.
- **`update { it.copy(...) }`:** cada cambio es una **copia** nueva del estado, como en React.
- **`hoy` entra de afuera**, como en la clase 88, para que las pruebas den lo mismo cualquier día.
- **`if (cargando) return false`:** es la misma trampa de la clase 88 (leer antes de guardar). Hay una prueba con un repositorio **lento** que lo comprueba: mientras carga, guardar no hace nada; cuando llega la lista, sí.

> 🌎 **En la vida real:** el ViewModel es como el pizarrón de la cocina de un restaurante: los cocineros lo actualizan y los meseros lo miran. Los meseros no escriben en él, y cuando cambia el turno (girar el teléfono), el pizarrón sigue en la pared.

> 🌎 **Otro ejemplo:** `copy` es como sacar fotocopia de una ficha y corregir la copia: la original sigue intacta y siempre sabes cuál es la versión nueva.

> 🧩 **Piezas para este ejercicio**
> - `update` recibe el estado actual. Dentro de su bloque, `copy` crea el siguiente estado con los campos que cambies. La rama de carga termina antes de escribir.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El ViewModel que no pisa lo guardado
lenguaje: kotlin
pide: Completa `guardar(valor)` del ViewModel de juguete. Si el estado todavía está `cargando`, devuelve `false` y no cambia nada. Si el valor no es mayor que 0, pone `problema = "Escribe un valor mayor que 0"` y devuelve `false`. Si está bien, agrega el valor **al principio** de la lista, borra el problema (`null`) y devuelve `true`. Usa siempre `_estado.update { it.copy(...) }`.
--- código
import kotlinx.coroutines.flow.*

data class Estado(val cargando: Boolean = true, val valores: List<Double> = emptyList(), val problema: String? = null)

class ViewModelDeJuguete {
    private val _estado = MutableStateFlow(Estado())
    val estado: StateFlow<Estado> = _estado.asStateFlow()

    fun terminoDeCargar(lista: List<Double>) = _estado.update { it.copy(cargando = false, valores = lista) }

    fun guardar(valor: Double): Boolean {
        TODO()
    }
}
--- pruebas
prueba("mientras carga, no guarda") { val vm = ViewModelDeJuguete(); igual(vm.guardar(30.0), false); igual(vm.estado.value.valores, listOf<Double>()) }
prueba("después de cargar, guarda arriba") { val vm = ViewModelDeJuguete(); vm.terminoDeCargar(listOf(12.0)); igual(vm.guardar(30.0), true); igual(vm.estado.value.valores, listOf(30.0, 12.0)) }
prueba("un valor 0: el problema") { val vm = ViewModelDeJuguete(); vm.terminoDeCargar(listOf()); igual(vm.guardar(0.0), false); igual(vm.estado.value.problema, "Escribe un valor mayor que 0") }
prueba("al guardar bien, se borra el problema") { val vm = ViewModelDeJuguete(); vm.terminoDeCargar(listOf()); vm.guardar(0.0); vm.guardar(5.0); igual(vm.estado.value.problema, null) }
--- solución
import kotlinx.coroutines.flow.*

data class Estado(val cargando: Boolean = true, val valores: List<Double> = emptyList(), val problema: String? = null)

class ViewModelDeJuguete {
    private val _estado = MutableStateFlow(Estado())
    val estado: StateFlow<Estado> = _estado.asStateFlow()

    fun terminoDeCargar(lista: List<Double>) = _estado.update { it.copy(cargando = false, valores = lista) }

    fun guardar(valor: Double): Boolean {
        if (_estado.value.cargando) return false
        if (valor <= 0.0) {
            _estado.update { it.copy(problema = "Escribe un valor mayor que 0") }
            return false
        }
        _estado.update { it.copy(valores = listOf(valor) + it.valores, problema = null) }
        return true
    }
}
```

```practica
vf :: La pantalla puede cambiar el estado del ViewModel directamente
vf :: Al girar el teléfono, el ViewModel sigue vivo con su estado
elige :: ¿Para qué el if (cargando) return false en guardar? :: Para que la app sea más rápida :: Para no guardar una lista vacía encima de la del teléfono antes de haberla leído :: Para mostrar un error
elige :: ¿Qué hace _estado.update { it.copy(problemas = p) }? :: Cambia el estado viejo por dentro :: Crea una copia del estado con los problemas nuevos y la pone en el StateFlow :: Guarda en DataStore
escribe :: ¿Cómo prueba el proyecto que mientras carga no se puede guardar? :: Con un repositorio de mentira que no termina de leer hasta que la prueba lo deja (un CompletableDeferred). Mientras tanto, guardar devuelve false y no se guarda nada; después de completar la lectura, guardar sí funciona.
```

## Parte 5. La pantalla con Compose y el motor

La pantalla está partida en dos funciones:

```kotlin
/** La que usa la app: lee el estado del ViewModel y le pasa los avisos. */
@Composable
fun PantallaGastos(vm: GastosViewModel) {
    val estado by vm.estado.collectAsStateWithLifecycle()
    ContenidoGastos(estado = estado, hoy = LocalDate.now(), alGuardar = vm::guardar, alBorrar = vm::borrar)
}

/** Sin ViewModel: solo datos y avisos. Así se puede ver en la vista previa de Android Studio. */
@Composable
fun ContenidoGastos(estado: EstadoPantalla, hoy: LocalDate, alGuardar: (Borrador) -> Boolean, alBorrar: (Long) -> Unit) {
    Scaffold(containerColor = Motor.Colores.fondo) { bordes ->
        LazyColumn(modifier = Modifier.fillMaxSize().padding(bordes).imePadding(), /* … */) {
            item { Resumen(estado.semana) }
            item { FormularioGasto(hoy, estado.problemas, habilitado = !estado.cargando, alGuardar) }
            when {
                estado.cargando -> item { CircularProgressIndicator(color = Motor.Colores.acento) }
                estado.gastos.isEmpty() -> item { Text("Todavía no anotaste gastos") }
                else -> items(estado.gastos, key = { it.id }) { gasto -> TarjetaGasto(gasto, alBorrar) }
            }
        }
    }
}
```

Lo mismo que en la clase 88, con otros nombres:

| Clase 88 (React Native) | Aquí (Compose) |
|---|---|
| `SafeAreaView` | `Scaffold` (y sus `bordes`) |
| `KeyboardAvoidingView` | `Modifier.imePadding()` |
| `FlatList` + `keyExtractor` | `LazyColumn` + `items(…, key = { it.id })` |
| `flexWrap: 'wrap'` | `FlowRow` |
| `useState` | `rememberSaveable { mutableStateOf("") }` (y **sobrevive al girar**) |
| `motor.color.acento` | `Motor.Colores.acento` |

### Dos detalles que se encontraron mirando la app de verdad

Las pruebas pasaban, pero al abrir la app en el emulador se vieron dos cosas:

1. **El reloj y la batería de arriba salían negros** sobre el fondo oscuro: casi no se leían. `enableEdgeToEdge()` elige el color de las barras según el tema **del teléfono** (claro), no el de la app. Se arregló pidiendo barras oscuras:

   ```kotlin
   enableEdgeToEdge(
       statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
       navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
   )
   ```

2. **El tipo elegido salía en un violeta grisáceo**, el color propio de Material, no el verde del motor. Se arregló pasándole los colores del motor al `FilterChip`:

   ```kotlin
   colors = FilterChipDefaults.filterChipColors(
       selectedContainerColor = Motor.Colores.acento,
       selectedLabelColor = Motor.Colores.sobreAcento,
   )
   ```

**Las pruebas revisan lo que la app hace; mirarla revisa lo que la persona ve.** Hacen falta las dos cosas.

> 🌎 **En la vida real:** es como pintar una pared y revisarla con la luz de la tarde: la pintura estaba bien puesta, pero recién con esa luz ves la mancha. Hay que mirar con los ojos del que va a usar el cuarto.

> 🌎 **Otro ejemplo:** separar `PantallaGastos` de `ContenidoGastos` es como separar al mesero de la carta: la carta (el contenido) la puedes mostrar sola, sin mesero, para ver cómo quedó.

> 🧩 **Piezas para este ejercicio**
> - Trabaja con el valor absoluto en centavos y guarda el signo aparte. La división entera obtiene los reales y el resto obtiene los centavos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El dinero que muestra la pantalla
lenguaje: kotlin
pide: Completa `dinero(valor)` sin depender del idioma del teléfono: `1234.5` → `"R$ 1.234,50"`. Pista: pasa todo a centavos con `(abs(valor) * 100).roundToLong()`; el entero es `centavos / 100` y los centavos `centavos % 100` (con `padStart(2, '0')`). Para los puntos de los miles: `toString().reversed().chunked(3).joinToString(".").reversed()`. Si es negativo, el `-` va adelante.
--- código
import kotlin.math.abs
import kotlin.math.roundToLong

fun dinero(valor: Double): String = TODO()
--- pruebas
prueba("sin miles") { igual(dinero(30.0), "R$ 30,00") }
prueba("con centavos") { igual(dinero(5.4), "R$ 5,40") }
prueba("con miles y millones") { igual(listOf(dinero(1234.5), dinero(1234567.891)), listOf("R$ 1.234,50", "R$ 1.234.567,89")) }
prueba("cero y negativo") { igual(listOf(dinero(0.0), dinero(-30.0)), listOf("R$ 0,00", "-R$ 30,00")) }
--- solución
import kotlin.math.abs
import kotlin.math.roundToLong

fun dinero(valor: Double): String {
    val centavosTotales = (abs(valor) * 100).roundToLong()
    val entero = (centavosTotales / 100).toString().reversed().chunked(3).joinToString(".").reversed()
    val centavos = (centavosTotales % 100).toString().padStart(2, '0')
    return (if (valor < 0) "-" else "") + "R$ $entero,$centavos"
}
```

```practica
vf :: rememberSaveable hace que lo escrito en el formulario no se pierda al girar el teléfono
vf :: Si todas las pruebas pasan, la pantalla seguro se ve bien
elige :: ¿Cuál es el equivalente de FlatList en Compose? :: Column :: LazyColumn :: Row
elige :: ¿Para qué separar PantallaGastos de ContenidoGastos? :: Para que la app sea más rápida :: Para poder ver ContenidoGastos en la vista previa, con datos de mentira, sin ViewModel :: Porque Compose lo exige
escribe :: Cuenta los dos detalles que se encontraron al mirar la app y cómo se arreglaron. :: El reloj y la batería salían negros sobre el fondo oscuro, porque enableEdgeToEdge seguía el tema claro del teléfono; se pidieron barras oscuras con SystemBarStyle.dark. Y el tipo elegido salía violeta; se le pasaron los colores del motor al FilterChip con FilterChipDefaults.filterChipColors.
```

## Parte 6. Probarla y abrirla en el emulador

### Las 23 pruebas, sin teléfono

| Archivo | Qué prueba | Pruebas |
|---|---|---|
| `logica/GastosTest.kt` | Las reglas y las cuentas | 13 |
| `datos/FormatoTest.kt` | El texto que se guarda: ida y vuelta, y líneas rotas | 4 |
| `pantalla/GastosViewModelTest.kt` | El ViewModel con un repositorio en memoria | 6 |

El ViewModel usa `viewModelScope`, que corre en el hilo de la pantalla. En una prueba no hay pantalla, así que se cambia por un despachador de pruebas:

```kotlin
@Before fun antes() = Dispatchers.setMain(UnconfinedTestDispatcher())
@After fun despues() = Dispatchers.resetMain()

@Test fun guardarDosGastos() {
    val repo = RepositorioEnMemoria()
    val vm = GastosViewModel(repo) { hoy }
    assertTrue(vm.guardar(Borrador(Tipo.LAVADO, "30", "2026-11-18")))
    assertTrue(vm.guardar(Borrador(Tipo.PEAJE, "5,40", "2026-11-18")))
    assertEquals(Semana(total = 35.4, cantidad = 2), vm.estado.value.semana)
    assertEquals(listOf(Tipo.PEAJE, Tipo.LAVADO), repo.guardado.map { it.tipo }) // y quedaron guardados
}
```

### Correrla (gratis)

1. **Baja el repositorio** (como en la clase 88) y abre **Android Studio** → *Open* → la carpeta `89-kotlin-proyecto-app-de-gastos/proyecto`. La primera vez, Gradle baja las librerías: tarda unos minutos.
2. **Las pruebas:** clic derecho en la carpeta `app/src/test` → *Run Tests*. O en la terminal de Android Studio:

   ```bash
   ./gradlew testDebugUnitTest
   ```

3. **La app:** elige un emulador (*Device Manager*, clase 66) y toca **▶ Run**. O conecta tu Android con la depuración USB activada.
4. **La lista de comprobación**, como se hizo con esta app:
   - anota 30,50 y 12: el total dice R$ 42,50 y el de 12 queda arriba;
   - cierra la app del todo y ábrela: siguen ahí;
   - borra uno, ciérrala y ábrela: sigue borrado;
   - escribe un valor sin guardar y **gira el teléfono**: lo escrito sigue ahí;
   - mira las barras de arriba y de abajo: se tienen que leer.

Para instalarla en tu propio Android sin cables, `./gradlew assembleDebug` arma un **APK** en `app/build/outputs/apk/debug/`. Para Google Play hace falta el **AAB firmado** (clase 67), subir el `versionCode`, y tu propio `applicationId`.

> 🌎 **En la vida real:** las pruebas son la revisión técnica del carro en el taller; la lista de comprobación es salir a manejarlo por la ciudad. Las dos son necesarias antes de entregárselo a alguien.

> 🌎 **Otro ejemplo:** cambiar el hilo de la pantalla por un despachador de pruebas es como ensayar una obra sin público: todo pasa igual, pero nadie espera en la butaca.

> 🧩 **Piezas para este ejercicio**
> - Un ordenamiento estable conserva el orden relativo de gastos que tienen la misma fecha. `maxOfOrNull` devuelve el mayor id o `null` cuando la lista está vacía.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo más nuevo arriba, y el id siguiente
lenguaje: kotlin
pide: Completa `agregar(lista, gasto)`: una lista nueva, ordenada por fecha de la más nueva a la más vieja, y entre dos del **mismo día**, el que acabas de agregar va arriba (pista: pon el nuevo primero y usa `sortedByDescending { it.fecha }`, que es estable). Y `siguienteId(lista)`: uno más que el id mayor, o `1` si la lista está vacía (pista: `maxOfOrNull`).
--- código
import java.time.LocalDate

data class Gasto(val id: Long, val fecha: LocalDate)

fun agregar(lista: List<Gasto>, gasto: Gasto): List<Gasto> = TODO()

fun siguienteId(lista: List<Gasto>): Long = TODO()
--- pruebas
val d18 = LocalDate.of(2026, 11, 18)
val d10 = LocalDate.of(2026, 11, 10)
prueba("por fecha, lo más nuevo arriba") { igual(agregar(listOf(Gasto(1, d10)), Gasto(2, d18)).map { it.id }, listOf(2L, 1L)) }
prueba("del mismo día, el nuevo arriba") { igual(agregar(agregar(listOf(), Gasto(1, d18)), Gasto(2, d18)).map { it.id }, listOf(2L, 1L)) }
prueba("uno viejo va abajo") { igual(agregar(listOf(Gasto(1, d18)), Gasto(2, d10)).map { it.id }, listOf(1L, 2L)) }
prueba("el id siguiente") { igual(listOf(siguienteId(listOf(Gasto(1, d18), Gasto(4, d18))), siguienteId(listOf())), listOf(5L, 1L)) }
--- solución
import java.time.LocalDate

data class Gasto(val id: Long, val fecha: LocalDate)

fun agregar(lista: List<Gasto>, gasto: Gasto): List<Gasto> = (listOf(gasto) + lista).sortedByDescending { it.fecha }

fun siguienteId(lista: List<Gasto>): Long = (lista.maxOfOrNull { it.id } ?: 0L) + 1
```

```practica
vf :: Las 23 pruebas de esta app necesitan un emulador prendido
vf :: Para probar el ViewModel se cambia el hilo de la pantalla (Main) por un despachador de pruebas
elige :: ¿Qué comando corre las pruebas desde la terminal? :: ./gradlew bundleRelease :: ./gradlew testDebugUnitTest :: ./gradlew lintDebug
elige :: ¿Qué se revisa al girar el teléfono? :: Que la app se cierre :: Que lo escrito en el formulario y la lista sigan ahí :: Que cambie el color
escribe :: Escribe tu lista de comprobación antes de darle la app a alguien. :: Las pruebas en verde; anotar dos gastos y ver el total; cerrarla del todo y abrirla, y que sigan ahí; borrar uno y que siga borrado al abrirla; girar el teléfono con algo escrito; y mirar que las barras de arriba y de abajo se lean.
```


**Comprobación antes de seguir**

Carga dos gastos válidos junto con una línea dañada y vuelve a abrir la app.

<details>
<summary>Necesito una pista</summary>

Comprueba si se preservan los gastos válidos y si el total coincide con ellos.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué hiciste en Android nativo?":** "La misma app de gastos que tengo en React Native, hecha nativa con Kotlin y Jetpack Compose, para comparar. La lógica es Kotlin puro con pruebas de JUnit: usé LocalDate, que ya rechaza el 31 de febrero, y los null de Kotlin en vez de NaN. Los datos van detrás de una interfaz: DataStore en el teléfono y uno en memoria para probar el ViewModel. El ViewModel expone un StateFlow de solo lectura con una data class de estado, y no deja guardar mientras está cargando, para no pisar lo guardado; lo probé con un repositorio lento. La pantalla usa Scaffold, LazyColumn con key, FlowRow, imePadding y rememberSaveable para que nada se pierda al girar. Son 23 pruebas, y además la usé en el emulador: ahí encontré que las barras del sistema salían ilegibles y que un chip no usaba el color del motor, y lo arreglé."

> 🌎 **En la vida real:** es como un mecánico que puede arreglar el mismo motor con herramientas de taller y con las de mano: entiende qué hace cada pieza, no solo qué botón tocar.

> 🌎 **Otro ejemplo:** es como un traductor que lee el mismo libro en dos idiomas: ve qué cambia de forma y qué se queda igual en el fondo.
