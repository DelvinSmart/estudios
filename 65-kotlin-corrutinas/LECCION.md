# Kotlin 5: corrutinas — la asincronía de Kotlin

> 🌎 **En la vida real:** un mesero que atiende muchas mesas sin quedarse parado esperando un plato. En JavaScript eran las promesas y `async/await`; en Kotlin son las **corrutinas**.

> 🎙️ **El profesor dice:** en Android, igual que en React Native, la pantalla tiene un hilo que no se puede bloquear. Hoy: funciones `suspend`, `launch` y `async`, el **alcance** (scope) que cancela todo cuando la pantalla se va, los hilos (`Dispatchers`) y una mirada a `Flow`. Todo comparado con la clase 49 (asincronía en JavaScript).

## Parte 1. suspend: funciones que pueden esperar

> 🌎 **En la vida real:** "espera a que hierva el agua" sin quedarte mirando la olla.

> 🌎 **Otro ejemplo:** Es como dejar la ropa en la lavadora y seguir con otra cosa.

### Como async en JavaScript

```kotlin
suspend fun leerGastos(): List<Gasto> {
    delay(1000)          // simula esperar a internet (no bloquea el hilo)
    return listOf(Gasto(1, "lavado", 30.0))
}
```

Una función `suspend` puede **pausar** sin congelar nada, y solo se puede llamar desde otra `suspend` o desde una corrutina. Se llama **sin escribir `await`**: `val gastos = leerGastos()`.

> 🌎 **En la vida real:** es como poner el contestador: la llamada espera sin ocupar a nadie.

> 🌎 **Otro ejemplo:** Es como hacer fila con un número: no estás parado, te llaman cuando toca.

### Probar en el Playground

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    println("1. pido los gastos")
    val gastos = leerGastos()
    println("2. llegaron ${gastos.size}")
}
```

`runBlocking` sirve para ejemplos y pruebas; en una app nunca bloquees el hilo de la pantalla.

> 🌎 **En la vida real:** `runBlocking` es como sentarte a esperar el bus en el banco de prueba: sirve para practicar, no en la vida real.

> 🌎 **Otro ejemplo:** Es como un simulador que pausa el tiempo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Funciones suspend
lenguaje: kotlin
pide: Completa `leerGastos()`: espera 200 milisegundos con `delay(200)` (como si fuera internet) y devuelve la lista `listOf(30.0, 12.5)`. Después `totalDeGastos()`, que llama a `leerGastos()` **sin await** (en Kotlin no hace falta) y devuelve la suma. En las pruebas se usa `runBlocking`, que solo se usa en pruebas y ejemplos.
--- código
import kotlinx.coroutines.*

suspend fun leerGastos(): List<Double> {
    TODO()
}

suspend fun totalDeGastos(): Double = TODO()
--- pruebas
prueba("el total") { runBlocking { igual(totalDeGastos(), 42.5) } }
prueba("de verdad espera (como internet)") {
    runBlocking {
        val inicio = System.currentTimeMillis()
        leerGastos()
        ok(System.currentTimeMillis() - inicio >= 200, "leerGastos tiene que esperar 200 ms con delay")
    }
}
--- solución
import kotlinx.coroutines.*

suspend fun leerGastos(): List<Double> {
    delay(200)
    return listOf(30.0, 12.5)
}

suspend fun totalDeGastos(): Double = leerGastos().sum()
```

```practica
vf :: Una función suspend puede pausar sin congelar el hilo de la pantalla
vf :: En Kotlin hay que escribir await para llamar una función suspend
elige :: ¿Desde dónde se puede llamar una función suspend? :: Desde cualquier lado :: Desde otra suspend o dentro de una corrutina :: Solo desde main
elige :: ¿Para qué sirve runBlocking? :: Para usar en las pantallas de la app :: Para ejemplos y pruebas, no para la pantalla :: Para guardar datos
escribe :: ¿A qué se parece una función suspend de Kotlin en JavaScript? :: A una función async: puede esperar algo que tarda sin congelar la pantalla, y se llama desde otro código asíncrono.
```

## Parte 2. launch, async y el scope

> 🌎 **En la vida real:** `launch` es mandar a alguien a hacer un mandado; `async` es mandarlo y esperar que vuelva con algo.

> 🌎 **Otro ejemplo:** Es como enviar una carta (launch) o hacer un pedido con entrega (async).

### Lanzar trabajo

```kotlin
scope.launch {                       // arranca y no devuelve nada
    val gastos = repositorio.listar()
    mostrar(gastos)
}

val total = scope.async { calcularTotal() }   // arranca y devuelve un resultado
val resultado = total.await()                  // aquí sí se usa await

// En paralelo, como Promise.all:
val (carro, gastos) = coroutineScope {
    val a = async { leerCarro() }
    val b = async { leerGastos() }
    a.await() to b.await()
}
```

> 🌎 **En la vida real:** dos `async` a la vez es cocinar el arroz y la carne al mismo tiempo.

> 🌎 **Otro ejemplo:** Es como pedir dos deliveries a la vez.

### El scope: cancelar al salir

Toda corrutina vive dentro de un **scope**. En Android, `viewModelScope` cancela todo cuando la pantalla se cierra: no hay tareas "huérfanas" que sigan gastando batería. Es la **concurrencia estructurada**, y es la misma idea que la limpieza del `useEffect` (React Native 2) y de `onSnapshot` (React Native 6).

> 🌎 **En la vida real:** al cerrar la tienda, el encargado apaga todas las máquinas.

> 🌎 **Otro ejemplo:** Es como al terminar el turno: se cierran todos los pedidos abiertos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dos pedidos en paralelo, como Promise.all
lenguaje: kotlin
pide: `leerCarro()` y `leerGastos()` tardan 400 ms cada una. Completa `cargarTodo()`: devuelve el carro y el total de gastos, pidiendo los dos **a la vez** con `coroutineScope` y dos `async`, y después `await()`. Si los pides uno detrás del otro, tarda 800 ms y la última prueba falla.
--- código
import kotlinx.coroutines.*

suspend fun leerCarro(): String { delay(400); return "Corolla" }
suspend fun leerGastos(): List<Double> { delay(400); return listOf(30.0, 12.5) }

suspend fun cargarTodo(): Pair<String, Double> = TODO()
--- pruebas
prueba("trae los dos") { runBlocking { igual(cargarTodo(), "Corolla" to 42.5) } }
prueba("en paralelo: menos de 700 ms") {
    runBlocking {
        val inicio = System.currentTimeMillis()
        cargarTodo()
        val tardo = System.currentTimeMillis() - inicio
        ok(tardo < 700, "tardó $tardo ms: los dos pedidos tienen que ir a la vez")
    }
}
--- solución
import kotlinx.coroutines.*

suspend fun leerCarro(): String { delay(400); return "Corolla" }
suspend fun leerGastos(): List<Double> { delay(400); return listOf(30.0, 12.5) }

suspend fun cargarTodo(): Pair<String, Double> = coroutineScope {
    val carro = async { leerCarro() }
    val gastos = async { leerGastos() }
    carro.await() to gastos.await().sum()
}
```

```practica
vf :: viewModelScope cancela las corrutinas cuando la pantalla se cierra
vf :: launch devuelve un resultado que se obtiene con await
elige :: ¿Qué se parece a Promise.all en Kotlin? :: Un solo launch :: Varios async dentro de un coroutineScope y luego await :: runBlocking
elige :: ¿Qué idea de React Native se parece al scope que cancela todo? :: useState :: La limpieza del useEffect :: FlatList
escribe :: Explica la diferencia entre launch y async. :: launch arranca un trabajo que no devuelve resultado; async arranca un trabajo que devuelve un resultado que se obtiene con await.
```

## Parte 3. Hilos y Flow

> 🌎 **En la vida real:** en una cocina hay estaciones: la parrilla para lo pesado y el mostrador para atender. No pones a cortar carne a quien atiende la caja.

> 🌎 **Otro ejemplo:** Es como los carriles de una carretera: el lento a la derecha.

### Dispatchers

```kotlin
val texto = withContext(Dispatchers.IO) {   // trabajo de archivos o red, fuera del hilo de la pantalla
    archivo.readText()
}
```

- `Dispatchers.Main`: el hilo de la pantalla (corto y rápido).
- `Dispatchers.IO`: red, archivos y base de datos.
- `Dispatchers.Default`: cálculos pesados.

> 🌎 **En la vida real:** es como mandar el trámite largo a la ventanilla de atrás para que la fila de adelante siga.

> 🌎 **Otro ejemplo:** Es como tener un ayudante para cargar cajas mientras tú atiendes.

### Flow: datos que siguen llegando

Un `Flow` es una corriente de valores en el tiempo, como `onSnapshot` de Firebase:

```kotlin
val gastos: Flow<List<Gasto>> = repositorio.observar()
scope.launch { gastos.collect { lista -> mostrar(lista) } }
```

En Android se usa `StateFlow` para el estado de una pantalla (próxima clase).

> 🌎 **En la vida real:** es como estar suscrito a un canal: cada noticia nueva llega sola.

> 🌎 **Otro ejemplo:** Es como el marcador en vivo de un partido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un Flow: datos que siguen llegando
lenguaje: kotlin
pide: Completa `gastosDelDia()`: un `flow { … }` que emite (`emit`) cada valor de la lista `listOf(30.0, 12.5, 150.0)`, uno por uno. Y `totalAcumulado(f)`: junta (`collect`) todos los valores que llegan y devuelve, en una lista, el total **después de cada uno** (como una pantalla que se actualiza con cada dato).
--- código
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun gastosDelDia(): Flow<Double> = flow {
    TODO()
}

suspend fun totalAcumulado(f: Flow<Double>): List<Double> {
    TODO()
}
--- pruebas
prueba("emite los tres") { runBlocking { igual(gastosDelDia().toList(), listOf(30.0, 12.5, 150.0)) } }
prueba("el total después de cada uno") { runBlocking { igual(totalAcumulado(gastosDelDia()), listOf(30.0, 42.5, 192.5)) } }
prueba("un flow vacío") { runBlocking { igual(totalAcumulado(emptyFlow()), listOf<Double>()) } }
--- solución
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun gastosDelDia(): Flow<Double> = flow {
    for (v in listOf(30.0, 12.5, 150.0)) emit(v)
}

suspend fun totalAcumulado(f: Flow<Double>): List<Double> {
    val totales = mutableListOf<Double>()
    var total = 0.0
    f.collect { v ->
        total += v
        totales.add(total)
    }
    return totales
}
```

```practica
vf :: Dispatchers.IO es para red, archivos y base de datos
vf :: Un Flow entrega un solo valor y termina, como una promesa
elige :: ¿Qué usas para hacer un cálculo pesado sin trabar la pantalla? :: Dispatchers.Main :: Dispatchers.Default :: println
elige :: ¿A qué se parece un Flow de Firebase en React Native? :: useState :: onSnapshot :: AsyncStorage
escribe :: ¿Por qué no hay que leer un archivo grande en el hilo de la pantalla? :: Porque el hilo de la pantalla se trabaría y la app dejaría de responder; se hace en Dispatchers.IO con withContext.
```


**Comprobación antes de seguir**

Dibuja cuándo arrancan y cuándo terminan dos operaciones en paralelo.

<details>
<summary>Necesito una pista</summary>

Marca dónde empieza cada operación y dónde se espera su resultado.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas la asincronía en Kotlin?":** "Con corrutinas: funciones suspend para lo que tarda, launch para disparar trabajo y async con await para resultados, en paralelo dentro de un coroutineScope como un Promise.all. Todo vive en un scope como viewModelScope, que cancela al cerrar la pantalla. Uso withContext(Dispatchers.IO) para red y archivos, y Flow o StateFlow para datos que siguen llegando, como hacía con onSnapshot en React Native."

> 🌎 **En la vida real:** es como explicar cómo una cocina grande atiende muchos pedidos sin que se quemen los platos.

> 🌎 **Otro ejemplo:** Es como un controlador aéreo que organiza aviones en distintas pistas.
