# Kotlin 4: clases, data class, enum y sealed

> 🌎 **En la vida real:** una clase es el plano de un carro; cada carro fabricado es un objeto. Kotlin tiene planos especiales para cada caso: para datos, para opciones fijas y para resultados que pueden salir bien o mal.

> 🎙️ **El profesor dice:** hoy: `class` con su constructor en una línea, la **data class** (la estrella de Kotlin), `enum` para opciones fijas, `sealed` para modelar estados como "cargando, listo, error", `object` y las interfaces. Verás que se parece a las interfaces y uniones de TypeScript (clase 51).

## Parte 1. class y data class

> 🌎 **En la vida real:** una data class es un formulario estándar: los campos ya están, solo llenas.

> 🌎 **Otro ejemplo:** Es como una ficha impresa de paciente.

### Una clase con constructor en una línea

```kotlin
class Carro(val marca: String, val modelo: String, var km: Int = 0) {
    fun recorrer(distancia: Int) { km += distancia }
    fun necesitaAceite(cada: Int = 5000) = km % cada > cada - 500
}

val miCarro = Carro("Toyota", "Corolla", 84800)
miCarro.recorrer(320)
```

`val` y `var` en el constructor crean las propiedades directamente. No hace falta `new` (como en JavaScript).

> 🌎 **En la vida real:** es como llenar la ficha del carro al comprarlo, en un solo paso.

> 🌎 **Otro ejemplo:** Es como un molde que ya trae las medidas grabadas.

### data class

```kotlin
data class Gasto(val id: Int, val tipo: String, val valor: Double)

val g = Gasto(1, "lavado", 30.0)
println(g)                         // Gasto(id=1, tipo=lavado, valor=30.0)
val actualizado = g.copy(valor = 35.0)   // copia con un cambio (como { ...g, valor: 35 })
g == Gasto(1, "lavado", 30.0)      // true: compara el contenido
val (id, tipo, valor) = g          // desestructurar
```

`data class` escribe sola el `toString`, la comparación por contenido y `copy`. Con `val` en todo, es **inmutable**: igual que en React, se crea una copia con el cambio.

> 🌎 **En la vida real:** `copy` es como fotocopiar la ficha y cambiar solo un dato.

> 🌎 **Otro ejemplo:** Es como una plantilla de contrato donde cambias solo el nombre.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una clase y una data class
lenguaje: kotlin
pide: Completa la clase `Carro`: `recorrer(distancia)` suma al `km`, y `faltaParaAceite(cada)` dice cuántos km faltan para el próximo cambio (pista: `cada - km % cada`). Después, `conValor(gasto, nuevo)` devuelve una **copia** del gasto con el valor nuevo, sin cambiar el original (pista: `copy`).
--- código
class Carro(val marca: String, var km: Int = 0) {
    fun recorrer(distancia: Int) {
        TODO()
    }

    fun faltaParaAceite(cada: Int = 5000): Int = TODO()
}

data class Gasto(val id: Int, val tipo: String, val valor: Double)

fun conValor(gasto: Gasto, nuevo: Double): Gasto = TODO()
--- pruebas
prueba("recorrer suma") { val c = Carro("Toyota", 84800); c.recorrer(320); igual(c.km, 85120) }
prueba("lo que falta para el aceite") { igual(Carro("Toyota", 84800).faltaParaAceite(), 200) }
prueba("con otro intervalo") { igual(Carro("Fiat", 9500).faltaParaAceite(cada = 10000), 500) }
prueba("copy cambia solo el valor") { val g = Gasto(1, "lavado", 30.0); igual(conValor(g, 35.0), Gasto(1, "lavado", 35.0)); igual(g.valor, 30.0) }
--- solución
class Carro(val marca: String, var km: Int = 0) {
    fun recorrer(distancia: Int) {
        km += distancia
    }

    fun faltaParaAceite(cada: Int = 5000): Int = cada - km % cada
}

data class Gasto(val id: Int, val tipo: String, val valor: Double)

fun conValor(gasto: Gasto, nuevo: Double): Gasto = gasto.copy(valor = nuevo)
```

```practica
vf :: En Kotlin no hace falta new para crear un objeto
vf :: copy en una data class cambia el objeto original
elige :: ¿Qué escribe sola una data class? :: Las pruebas :: toString, la comparación por contenido y copy :: La base de datos
elige :: ¿A qué se parece g.copy(valor = 35.0) en JavaScript? :: g.valor = 35 :: { ...g, valor: 35 } :: g.push(35)
escribe :: Escribe una data class Viaje con app (String) y valor (Double). :: data class Viaje(val app: String, val valor: Double)
```

## Parte 2. enum y sealed

> 🌎 **En la vida real:** un enum es el selector de una lavadora: solo los programas que trae. Un sealed es un semáforo con información: verde, amarillo o rojo, y cada uno puede traer su propio dato.

> 🌎 **Otro ejemplo:** Es como los estados de un pedido: "preparando", "en camino" (con la hora) o "entregado" (con la firma).

### enum class

```kotlin
enum class App { UBER, NOVENTA_Y_NUEVE, INDRIVE }
val app = App.UBER
```

Es como `type App = 'Uber' | '99' | 'InDrive'` de TypeScript.

> 🌎 **En la vida real:** son las opciones fijas de un formulario.

> 🌎 **Otro ejemplo:** Es como los colores de un semáforo.

### sealed: estados con datos

```kotlin
sealed interface Pantalla {
    data object Cargando : Pantalla
    data class Lista(val gastos: List<Gasto>) : Pantalla
    data class Error(val mensaje: String) : Pantalla
}

fun texto(p: Pantalla): String = when (p) {
    Pantalla.Cargando -> "Cargando…"
    is Pantalla.Lista -> "${p.gastos.size} gastos"
    is Pantalla.Error -> "Error: ${p.mensaje}"
}   // no hace falta else: Kotlin sabe que están todos los casos
```

Si mañana agregas un estado nuevo, Kotlin te avisa en cada `when` que te falta manejarlo.

> 🌎 **En la vida real:** es como una lista de chequeo que te avisa si te olvidaste un ítem.

> 🌎 **Otro ejemplo:** Es como el tablero de un avión que no te deja despegar si falta un control.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: sealed y enum con when
lenguaje: kotlin
pide: Completa `texto(p)` con un `when` **sin `else`**: `Cargando` → `"Cargando…"`; `Lista` → `"N gastos"` (o `"1 gasto"` si hay uno); `Error` → `"Error: mensaje"`. Y `nombre(app)`: `UBER` → `"Uber"`, `NOVENTA_Y_NUEVE` → `"99"`, `INDRIVE` → `"InDrive"`. Sin `else`, si mañana se agrega un estado, Kotlin te avisa.
--- código
sealed interface Pantalla {
    data object Cargando : Pantalla
    data class Lista(val gastos: List<String>) : Pantalla
    data class Error(val mensaje: String) : Pantalla
}

enum class App { UBER, NOVENTA_Y_NUEVE, INDRIVE }

fun texto(p: Pantalla): String = TODO()

fun nombre(app: App): String = TODO()
--- pruebas
prueba("cargando") { igual(texto(Pantalla.Cargando), "Cargando…") }
prueba("la lista") { igual(texto(Pantalla.Lista(listOf("lavado", "peaje"))), "2 gastos") }
prueba("un solo gasto") { igual(texto(Pantalla.Lista(listOf("lavado"))), "1 gasto") }
prueba("el error") { igual(texto(Pantalla.Error("sin internet")), "Error: sin internet") }
prueba("los nombres de las apps") { igual(App.entries.map { nombre(it) }, listOf("Uber", "99", "InDrive")) }
--- solución
sealed interface Pantalla {
    data object Cargando : Pantalla
    data class Lista(val gastos: List<String>) : Pantalla
    data class Error(val mensaje: String) : Pantalla
}

enum class App { UBER, NOVENTA_Y_NUEVE, INDRIVE }

fun texto(p: Pantalla): String = when (p) {
    Pantalla.Cargando -> "Cargando…"
    is Pantalla.Lista -> if (p.gastos.size == 1) "1 gasto" else "${p.gastos.size} gastos"
    is Pantalla.Error -> "Error: ${p.mensaje}"
}

fun nombre(app: App): String = when (app) {
    App.UBER -> "Uber"
    App.NOVENTA_Y_NUEVE -> "99"
    App.INDRIVE -> "InDrive"
}
```

```practica
vf :: Un enum define un conjunto fijo de opciones
vf :: Un when sobre un sealed necesita siempre un else
elige :: ¿Qué conviene para los estados cargando, lista (con datos) y error (con mensaje)? :: Un Int :: Una sealed interface :: Un String libre
elige :: ¿Qué hace is Pantalla.Lista dentro de un when? :: Crea una lista :: Revisa el tipo y deja usar p.gastos en esa rama :: Borra la pantalla
escribe :: Escribe un enum class para los tipos de gasto combustible, lavado y peaje. :: enum class TipoGasto { COMBUSTIBLE, LAVADO, PEAJE }
```

## Parte 3. object e interfaces

> 🌎 **En la vida real:** un `object` es algo que hay uno solo: la administración del edificio.

> 🌎 **Otro ejemplo:** Es como el sol: no hay dos.

### object: uno solo

```kotlin
object Configuracion {
    const val IMPUESTO = 0.15
    fun conImpuesto(v: Double) = v * (1 + IMPUESTO)
}
Configuracion.conImpuesto(100.0)   // 115.0
```

> 🌎 **En la vida real:** es como la oficina central de una empresa: hay una sola y todos la consultan.

> 🌎 **Otro ejemplo:** Es como el reloj oficial de un aeropuerto.

### Interfaces: el contrato

```kotlin
interface RepositorioGastos {
    suspend fun listar(): List<Gasto>
    suspend fun guardar(g: Gasto)
}

class RepositorioFirebase : RepositorioGastos { /* … */ }
class RepositorioEnMemoria : RepositorioGastos { /* para las pruebas */ }
```

La pantalla depende de la **interfaz**, no de Firebase: en las pruebas usas el de memoria. Es la idea de la arquitectura hexagonal del Tema 10.

> 🌎 **En la vida real:** es como un enchufe estándar: puedes conectar cualquier aparato que cumpla la forma.

> 🌎 **Otro ejemplo:** Es como un puesto de trabajo: lo puede ocupar cualquiera que cumpla el perfil.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una interfaz, dos repositorios
lenguaje: kotlin
pide: Escribe `RepositorioEnMemoria`, que cumple la interfaz `RepositorioGastos` guardando en una `mutableListOf`. Después completa `ServicioGastos`, que solo conoce la **interfaz**: `total()` suma los valores, y `agregar(g)` guarda el gasto solo si su valor es mayor que 0 (devuelve `true` si lo guardó). Y en el `object Configuracion`, `conImpuesto(v)` suma el 15 %.
--- código
data class Gasto(val tipo: String, val valor: Double)

interface RepositorioGastos {
    fun listar(): List<Gasto>
    fun guardar(g: Gasto)
}

class RepositorioEnMemoria : RepositorioGastos {
    // tu código aquí: una lista y las dos funciones de la interfaz
    override fun listar(): List<Gasto> = TODO()
    override fun guardar(g: Gasto) { TODO() }
}

class ServicioGastos(private val repo: RepositorioGastos) {
    fun total(): Double = TODO()
    fun agregar(g: Gasto): Boolean = TODO()
}

object Configuracion {
    const val IMPUESTO = 0.15
    fun conImpuesto(v: Double): Double = TODO()
}
--- pruebas
prueba("guardar y listar") { val r = RepositorioEnMemoria(); r.guardar(Gasto("lavado", 30.0)); igual(r.listar(), listOf(Gasto("lavado", 30.0))) }
prueba("el servicio suma") { val s = ServicioGastos(RepositorioEnMemoria()); s.agregar(Gasto("lavado", 30.0)); s.agregar(Gasto("peaje", 12.5)); igual(s.total(), 42.5) }
prueba("un valor 0 no se guarda") { val r = RepositorioEnMemoria(); igual(ServicioGastos(r).agregar(Gasto("otro", 0.0)), false); igual(r.listar().size, 0) }
prueba("el impuesto (los decimales no son exactos: se compara con un margen)") { ok(Math.abs(Configuracion.conImpuesto(100.0) - 115.0) < 0.001, "100 con impuesto tiene que dar 115") }
--- solución
data class Gasto(val tipo: String, val valor: Double)

interface RepositorioGastos {
    fun listar(): List<Gasto>
    fun guardar(g: Gasto)
}

class RepositorioEnMemoria : RepositorioGastos {
    private val gastos = mutableListOf<Gasto>()
    override fun listar(): List<Gasto> = gastos.toList()
    override fun guardar(g: Gasto) { gastos.add(g) }
}

class ServicioGastos(private val repo: RepositorioGastos) {
    fun total(): Double = repo.listar().sumOf { it.valor }
    fun agregar(g: Gasto): Boolean {
        if (g.valor <= 0) return false
        repo.guardar(g)
        return true
    }
}

object Configuracion {
    const val IMPUESTO = 0.15
    fun conImpuesto(v: Double): Double = v * (1 + IMPUESTO)
}
```

```practica
vf :: Un object en Kotlin tiene una sola instancia
vf :: Si la pantalla depende de la interfaz, no se puede probar sin Firebase
elige :: ¿Qué idea del Tema 10 aplica depender de una interfaz? :: MVC :: La arquitectura hexagonal (puertos y adaptadores) :: Ninguna
elige :: ¿Cómo llamas a conImpuesto del object Configuracion? :: Configuracion().conImpuesto :: Configuracion.conImpuesto(100.0) :: new Configuracion
escribe :: ¿Por qué conviene que la pantalla dependa de una interfaz RepositorioGastos? :: Porque así puedo cambiar Firebase por otra fuente, o usar uno en memoria en las pruebas, sin tocar la pantalla.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué tipos de clases usas en Kotlin?":** "data class para datos, inmutables con val y copy para cambiarlos; enum para opciones fijas; sealed para estados como cargando, lista o error, con when que cubre todos los casos sin else; object para lo que hay uno solo; e interfaces para que la pantalla dependa de un contrato y no de Firebase, como en la arquitectura hexagonal, lo que me deja probar con un repositorio en memoria."

> 🌎 **En la vida real:** es como un arquitecto explicando qué plano usa para cada tipo de obra.

> 🌎 **Otro ejemplo:** Es como un sastre que explica cuándo usa molde estándar y cuándo a medida.
