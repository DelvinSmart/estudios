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

```practica
vf :: El ViewModel sobrevive cuando se gira el teléfono
vf :: En este diseño, la pantalla de Compose es la que llama a Firebase directamente
elige :: ¿Qué expone el ViewModel para que la pantalla lo observe? :: Un Int :: Un StateFlow con el estado :: Una Activity
elige :: ¿Qué cancela las corrutinas del ViewModel al cerrar la pantalla? :: runBlocking :: viewModelScope :: Gradle
escribe :: ¿Qué responsabilidades tiene el ViewModel y cuáles la pantalla? :: El ViewModel pide los datos (con el repositorio y corrutinas) y guarda el estado; la pantalla solo muestra ese estado y avisa de los toques.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo haces una pantalla en Android moderno?":** "Con Jetpack Compose: funciones @Composable, Column, Row y LazyColumn, y Modifier para el estilo. El estado local va con remember y mutableStateOf; el estado de la pantalla en un ViewModel que expone un StateFlow con una sealed de Cargando, Lista o Error, pidiendo los datos en viewModelScope con un repositorio. Es la misma idea que React Native, que ya uso en Copiloto, pero nativa."

> 🌎 **En la vida real:** es como explicar cómo se arma un escenario: decorado, actores y el director que coordina.

> 🌎 **Otro ejemplo:** Es como un chef que explica su cocina y su servicio de salón.
