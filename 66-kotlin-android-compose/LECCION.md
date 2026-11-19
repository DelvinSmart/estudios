# Kotlin 6: tu primera app Android con Jetpack Compose

> 🌎 **En la vida real:** después de aprender el idioma, viajas al país. Esta clase es tu primer viaje a Android: abrir Android Studio, dibujar una pantalla y ver cómo cambia con el estado.

> 🎙️ **El profesor dice:** hoy usas **Jetpack Compose**, la forma moderna de dibujar pantallas en Android. Te va a resultar muy familiar: es como React (clases 54 y 55), pero en Kotlin. Funciones `@Composable`, `Column` y `Row`, estado con `remember`, listas con `LazyColumn`, y el **ViewModel** para guardar el estado de la pantalla.

## Parte 1. Android Studio y el proyecto

> 🌎 **En la vida real:** es como armar el taller: banco de trabajo, herramientas y un carro de prueba.

> 🌎 **Otro ejemplo:** Es como abrir el estudio de grabación antes de grabar.

### Crear y correr

1. Instala **Android Studio** (gratis).
2. **New Project → Empty Activity** (es la plantilla con Compose), lenguaje **Kotlin**.
3. Crea un **emulador** (Device Manager → un Pixel) o conecta tu teléfono Android con la depuración USB activada.
4. Toca **▶ Run**.

El proyecto usa **Gradle** para compilar (como npm + scripts): los archivos `build.gradle.kts` dicen qué librerías usa la app y cómo se arma.

> 🌎 **En la vida real:** Gradle es como el jefe de obra que sabe en qué orden construir todo.

> 🌎 **Otro ejemplo:** Es como la receta maestra que indica ingredientes y pasos.

### MainActivity

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MiApp() }       // aquí empieza Compose
    }
}
```

La **Activity** es la ventana de la app; `setContent` pone adentro tu pantalla de Compose.

> 🌎 **En la vida real:** la Activity es el marco del cuadro; Compose es la pintura.

> 🌎 **Otro ejemplo:** Es como el escenario y la obra.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer el build.gradle.kts
lenguaje: kotlin
pide: El `build.gradle.kts` dice qué librerías usa la app, en líneas como `implementation("androidx.compose.ui:ui:1.7.5")`. Completa `librerias(gradle)`: devuelve el nombre de cada librería (`grupo:nombre`, **sin** la versión) de las líneas `implementation(...)`, en orden. Ignora las de `testImplementation`. Pista: `lines()`, `trim()`, `startsWith` y `substringAfter` / `substringBefore`.
--- código
fun librerias(gradle: String): List<String> = TODO()
--- pruebas
val gradle = """
    dependencies {
        implementation("androidx.core:core-ktx:1.15.0")
        implementation("androidx.compose.material3:material3:1.3.1")
        testImplementation("junit:junit:4.13.2")
    }
""".trimIndent()
prueba("las librerías, sin versión") { igual(librerias(gradle), listOf("androidx.core:core-ktx", "androidx.compose.material3:material3")) }
prueba("sin dependencias") { igual(librerias("plugins { }"), listOf<String>()) }
--- solución
fun librerias(gradle: String): List<String> =
    gradle.lines()
        .map { it.trim() }
        .filter { it.startsWith("implementation(\"") }
        .map { it.substringAfter("\"").substringBefore("\"").substringBeforeLast(":") }
```

```practica
vf :: Android Studio trae un emulador para probar sin un teléfono Android
vf :: Gradle es el lenguaje de las pantallas de Android
elige :: ¿Qué plantilla eliges para empezar con Compose? :: No Activity :: Empty Activity :: Game Activity
elige :: ¿Qué hace setContent en MainActivity? :: Borra la app :: Pone la pantalla de Compose dentro de la ventana :: Instala Gradle
escribe :: Escribe los pasos para crear y correr tu primera app de Android. :: Instalar Android Studio, crear un New Project con Empty Activity en Kotlin, crear un emulador o conectar un teléfono, y tocar Run.
```

## Parte 2. Compose: como React, en Kotlin

> 🌎 **En la vida real:** si sabes armar con Lego de una marca, la otra marca te sale fácil: las piezas cambian de nombre, no de idea.

> 🌎 **Otro ejemplo:** Es como cocinar la misma receta en otra cocina.

### @Composable

```kotlin
@Composable
fun TarjetaGasto(tipo: String, valor: Double, alTocar: () -> Unit) {
    Card(onClick = alTocar, modifier = Modifier.fillMaxWidth().padding(8.dp)) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(tipo)
            Text("R$ %.2f".format(valor), fontWeight = FontWeight.Bold)
        }
    }
}
```

| React Native | Compose |
|---|---|
| componente (función) | función `@Composable` |
| props | parámetros |
| `<View>` en columna | `Column` |
| `flexDirection: 'row'` | `Row` |
| `<Text>` | `Text` |
| `style` | `Modifier` |
| `FlatList` | `LazyColumn` |

> 🌎 **En la vida real:** es como un diccionario de bolsillo entre dos idiomas primos.

> 🌎 **Otro ejemplo:** Es como pasar de manejar automático a manual: mismas calles, otro pedal.

### Estado con remember

```kotlin
@Composable
fun ContadorDeViajes() {
    var viajes by remember { mutableStateOf(0) }
    Column {
        Text("Viajes hoy: $viajes")
        Button(onClick = { viajes++ }) { Text("+1 viaje") }
    }
}
```

Como `useState`: al cambiar `viajes`, Compose vuelve a dibujar lo que lo usa.

> 🌎 **En la vida real:** es el mismo marcador del partido que cambia solo.

> 🌎 **Otro ejemplo:** Es como el odómetro digital.

### Listas: LazyColumn

```kotlin
LazyColumn {
    items(gastos, key = { it.id }) { g -> TarjetaGasto(g.tipo, g.valor) { abrir(g.id) } }
}
```

Como `FlatList`: solo dibuja lo que se ve, y la `key` es el id.

> 🌎 **En la vida real:** es la misma cinta transportadora de la clase 56.

> 🌎 **Otro ejemplo:** Es como una vitrina que muestra pocos productos a la vez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El estado que vuelve a dibujar, como mutableStateOf
lenguaje: kotlin
pide: Compose vuelve a dibujar cuando cambia el estado, pero **solo si cambió de verdad**. Completa la clase `Estado`: tiene un `valor` con un **setter propio** que, si el valor nuevo es distinto del que había, lo guarda y llama a `alCambiar()`; si es igual, no hace nada. Pista: dentro del `set`, el valor guardado se llama `field`.
--- código
class Estado<T>(inicial: T, private val alCambiar: () -> Unit) {
    var valor: T = inicial
        set(nuevo) {
            TODO()
        }
}
--- pruebas
prueba("un cambio vuelve a dibujar") {
    var dibujos = 0
    val viajes = Estado(0) { dibujos++ }
    viajes.valor = viajes.valor + 1
    igual(viajes.valor, 1)
    igual(dibujos, 1)
}
prueba("el mismo valor no vuelve a dibujar") {
    var dibujos = 0
    val app = Estado("Uber") { dibujos++ }
    app.valor = "Uber"
    app.valor = "99"
    app.valor = "99"
    igual(dibujos, 1)
}
--- solución
class Estado<T>(inicial: T, private val alCambiar: () -> Unit) {
    var valor: T = inicial
        set(nuevo) {
            if (nuevo != field) {
                field = nuevo
                alCambiar()
            }
        }
}
```

```practica
vf :: Un @Composable de Compose es como un componente de React
vf :: En Compose, el estilo se escribe con un objeto style igual que en React Native
elige :: ¿Qué es Row en Compose? :: Una lista larga :: Acomodar elementos en fila, como flexDirection row :: Un texto
elige :: ¿Qué hace remember { mutableStateOf(0) }? :: Guarda en el disco :: Guarda un estado que, al cambiar, vuelve a dibujar :: Borra la pantalla
escribe :: Escribe un Composable que muestre "Hola" y un botón que diga "Tocar". :: @Composable fun Saludo() { Column { Text("Hola"); Button(onClick = { }) { Text("Tocar") } } }
```

## Parte 3. ViewModel: el estado de la pantalla

> 🌎 **En la vida real:** si giras el teléfono, Android recrea la pantalla. El ViewModel es la libreta que sobrevive al giro.

> 🌎 **Otro ejemplo:** Es como el encargado de turno que guarda los pedidos aunque cambie el mesero.

### Separar la lógica de la pantalla

```kotlin
class GastosViewModel(private val repo: RepositorioGastos) : ViewModel() {
    private val _estado = MutableStateFlow<Pantalla>(Pantalla.Cargando)
    val estado: StateFlow<Pantalla> = _estado

    init {
        viewModelScope.launch {
            _estado.value = try { Pantalla.Lista(repo.listar()) }
                            catch (e: Exception) { Pantalla.Error("No se pudo cargar") }
        }
    }
}

@Composable
fun PantallaGastos(vm: GastosViewModel) {
    when (val e = vm.estado.collectAsState().value) {
        Pantalla.Cargando -> CircularProgressIndicator()
        is Pantalla.Lista -> ListaGastos(e.gastos)
        is Pantalla.Error -> Text(e.mensaje)
    }
}
```

Junta todo el curso: la **sealed** (clase 64), las **corrutinas** y el scope (65), y la interfaz del repositorio. La pantalla solo **muestra** el estado.

> 🌎 **En la vida real:** el ViewModel es la cocina; la pantalla es el mozo que lleva lo que sale.

> 🌎 **Otro ejemplo:** Es como el cerebro y la cara: uno piensa, la otra muestra.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un ViewModel con StateFlow
lenguaje: kotlin
pide: Completa `cargar()` del ViewModel: pide la lista al repositorio y pone el estado en `Pantalla.Lista(...)`; si el repositorio lanza un error, pone `Pantalla.Error("No se pudo cargar")`. El estado empieza en `Cargando`. Pista: `_estado.value = try { … } catch (e: Exception) { … }`.
--- código
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

sealed interface Pantalla {
    data object Cargando : Pantalla
    data class Lista(val gastos: List<String>) : Pantalla
    data class Error(val mensaje: String) : Pantalla
}

interface Repositorio { suspend fun listar(): List<String> }

class GastosViewModel(private val repo: Repositorio) {
    private val _estado = MutableStateFlow<Pantalla>(Pantalla.Cargando)
    val estado: StateFlow<Pantalla> = _estado

    suspend fun cargar() {
        TODO()
    }
}
--- pruebas
val bueno = object : Repositorio { override suspend fun listar() = listOf("lavado", "peaje") }
val roto = object : Repositorio { override suspend fun listar(): List<String> = throw IllegalStateException("sin internet") }
prueba("empieza cargando") { igual(GastosViewModel(bueno).estado.value, Pantalla.Cargando) }
prueba("después, la lista") { runBlocking { val vm = GastosViewModel(bueno); vm.cargar(); igual(vm.estado.value, Pantalla.Lista(listOf("lavado", "peaje"))) } }
prueba("si falla, el error (sin cerrar la app)") { runBlocking { val vm = GastosViewModel(roto); vm.cargar(); igual(vm.estado.value, Pantalla.Error("No se pudo cargar")) } }
--- solución
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

sealed interface Pantalla {
    data object Cargando : Pantalla
    data class Lista(val gastos: List<String>) : Pantalla
    data class Error(val mensaje: String) : Pantalla
}

interface Repositorio { suspend fun listar(): List<String> }

class GastosViewModel(private val repo: Repositorio) {
    private val _estado = MutableStateFlow<Pantalla>(Pantalla.Cargando)
    val estado: StateFlow<Pantalla> = _estado

    suspend fun cargar() {
        _estado.value = try {
            Pantalla.Lista(repo.listar())
        } catch (e: Exception) {
            Pantalla.Error("No se pudo cargar")
        }
    }
}
```

```practica
vf :: El ViewModel sobrevive cuando se gira el teléfono
vf :: En este diseño, la pantalla de Compose es la que llama a Firebase directamente
elige :: ¿Qué expone el ViewModel para que la pantalla lo observe? :: Un Int :: Un StateFlow con el estado :: Una Activity
elige :: ¿Qué cancela las corrutinas del ViewModel al cerrar la pantalla? :: runBlocking :: viewModelScope :: Gradle
escribe :: ¿Qué responsabilidades tiene el ViewModel y cuáles la pantalla? :: El ViewModel pide los datos (con el repositorio y corrutinas) y guarda el estado; la pantalla solo muestra ese estado y avisa de los toques.
```

## Parte 4. El tema de Compose: el motor de diseño en Kotlin

> 🌎 **En la vida real:** es como el manual de marca de una empresa: el logo, los colores y las tipografías están en un solo documento. Cada folleto, cartel y camioneta **sigue el manual**; nadie elige "un verde parecido".

> 🌎 **Otro ejemplo:** Es como el tablero de luces de una casa: un solo panel decide qué se prende. Las lámparas no tienen su propio interruptor escondido.

En Compose el motor tiene **dos capas**. La de la app de gastos (clase 89) está en `tema/Motor.kt`:

**1. Los valores, en un `object`** (un objeto que existe una sola vez, clase 64):

```kotlin
object Motor {
    object Colores {
        val fondo = Color(0xFF0F141B)
        val tarjeta = Color(0xFF18212C)
        val acento = Color(0xFF7EE787)
    }
    object Espacio { val chico = 8.dp; val medio = 14.dp; val grande = 20.dp }
    object Forma { val radio = 14.dp }
}
```

**2. El tema de Material 3**, que envuelve toda la app y les pasa esos colores a los componentes de Google (botones, tarjetas):

```kotlin
@Composable
fun TemaGastos(contenido: @Composable () -> Unit) {
    val colores = darkColorScheme(background = Motor.Colores.fondo, primary = Motor.Colores.acento)
    MaterialTheme(colorScheme = colores, content = contenido)
}
```

Y cada componente **llama** al motor, sin escribir un número:

```kotlin
Card(shape = RoundedCornerShape(Motor.Forma.radio)) {
    Text("Combustible", modifier = Modifier.padding(Motor.Espacio.medio))
}
```

**El modo claro** sale de `isSystemInDarkTheme()`: devuelve `true` o `false`, y el tema elige `darkColorScheme(...)` o `lightColorScheme(...)` con los colores del motor. Es la misma idea que `useColorScheme()` en React Native (clase 56): **el teléfono dice el modo, el motor da los valores**.

> 💡 **Idea:** `.dp` (*density-independent pixels*) es la medida de Android que se ve del mismo tamaño en una pantalla chica y en una grande. Por eso el motor guarda `14.dp` y no `14` píxeles.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un tema con data class y copy
lenguaje: kotlin
pide: Sin Compose (el Playground no lo tiene), arma la idea con Kotlin puro. Ya están `Colores` y `Tema`, y el tema `Oscuro`. Escribe `Claro`: **una copia** de `Oscuro` (`copy`) que solo cambia el fondo a `"#FFFFFF"` y el texto a `"#1D232B"`. Y completa `temaPara(oscuro: Boolean)`, que devuelve `Oscuro` o `Claro`, y `rellenoDeTarjeta(tema)`, que devuelve el espacio medio del tema.
--- código
data class Colores(val fondo: String, val texto: String, val acento: String)
data class Tema(val colores: Colores, val espacioMedio: Int, val radio: Int)

val Oscuro = Tema(Colores("#0F141B", "#E6EDF3", "#7EE787"), espacioMedio = 14, radio = 14)
val Claro: Tema = Oscuro  // cámbialo: una copia con otro fondo y otro texto

fun temaPara(oscuro: Boolean): Tema = TODO()

fun rellenoDeTarjeta(tema: Tema): Int = TODO()
--- pruebas
prueba("el claro cambia el fondo y el texto") { igual(Claro.colores, Colores("#FFFFFF", "#1D232B", "#7EE787")) }
prueba("y deja igual lo demás") { igual(Claro.espacioMedio to Claro.radio, 14 to 14) }
prueba("el teléfono en oscuro") { igual(temaPara(true), Oscuro) }
prueba("en claro") { igual(temaPara(false), Claro) }
prueba("el relleno sale del tema") { igual(rellenoDeTarjeta(Oscuro.copy(espacioMedio = 20)), 20) }
--- solución
data class Colores(val fondo: String, val texto: String, val acento: String)
data class Tema(val colores: Colores, val espacioMedio: Int, val radio: Int)

val Oscuro = Tema(Colores("#0F141B", "#E6EDF3", "#7EE787"), espacioMedio = 14, radio = 14)
val Claro: Tema = Oscuro.copy(colores = Oscuro.colores.copy(fondo = "#FFFFFF", texto = "#1D232B"))

fun temaPara(oscuro: Boolean): Tema = if (oscuro) Oscuro else Claro

fun rellenoDeTarjeta(tema: Tema): Int = tema.espacioMedio
```

```practica
vf :: En Compose, el tema de Material 3 envuelve toda la app y les pasa los colores del motor a los componentes
vf :: Cada pantalla de Compose debería elegir sus propios colores para verse mejor
elige :: ¿Cómo sabe la app de Compose si el teléfono está en modo oscuro? :: Con useColorScheme() :: Con isSystemInDarkTheme() :: Leyendo un archivo de configuración
escribe :: ¿Por qué copy sirve para armar el tema claro a partir del oscuro? :: Porque copy crea un tema nuevo cambiando solo lo que le dices (el fondo y el texto) y dejando igual lo demás (espacios, radio, acento). Así los dos temas comparten las mismas medidas sin copiarlas a mano.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo haces una pantalla en Android moderno?":** "Con Jetpack Compose: funciones @Composable, Column, Row y LazyColumn, y Modifier para el estilo. El estado local va con remember y mutableStateOf; el estado de la pantalla en un ViewModel que expone un StateFlow con una sealed de Cargando, Lista o Error, pidiendo los datos en viewModelScope con un repositorio. Es la misma idea que React Native, que ya uso en Copiloto, pero nativa."

> 🌎 **En la vida real:** es como explicar cómo se arma un escenario: decorado, actores y el director que coordina.

> 🌎 **Otro ejemplo:** Es como un chef que explica su cocina y su servicio de salón.
