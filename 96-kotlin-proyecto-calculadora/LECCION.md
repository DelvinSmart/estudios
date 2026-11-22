# La misma calculadora, nativa en Android con Kotlin

> 🌎 **En la vida real:** es como cocinar la misma receta en dos cocinas distintas: una a gas y una eléctrica. El plato tiene que salir igual (mismos ingredientes, mismo sabor), pero cada cocina tiene sus mañas: una calienta más rápido, la otra guarda mejor el calor. Comparar te enseña cómo funciona **cada** cocina.

> 🎙️ **El profesor dice:** {{alumno}}, en las clases 94 y 95 del curso de React Native hiciste una calculadora que sale para Android y iPhone con un solo código. Hoy haces **la misma**, nativa en Android, con Kotlin y Compose. **Las mismas decisiones, las mismas pruebas, otro lenguaje.** Así se ve qué cambia de verdad entre los dos caminos, y por qué una empresa elige uno u otro.

**Lo que hay** (en la carpeta `96-kotlin-proyecto-calculadora/proyecto` de este mismo repositorio):

| En Kotlin | Hace lo mismo que, en React Native (clase 94) |
|---|---|
| `logica/Calculadora.kt` | `src/logica/calculadora.ts` |
| `logica/Teclado.kt` | `src/logica/teclado.ts` |
| `tema/Motor.kt` | `src/tema/motor.ts` |
| `pantalla/CalculadoraViewModel.kt` | el `useState` de la pantalla |
| `pantalla/PantallaCalculadora.kt` | `Tecla.tsx`, `Visor.tsx` y `PantallaCalculadora.tsx` |
| `app/src/test/` (51 pruebas con JUnit) | `__tests__/` (Jest) |

```bash
cd estudios/96-kotlin-proyecto-calculadora/proyecto
./gradlew test            # 51 en verde, sin teléfono
./gradlew installDebug    # la instala en el emulador o en tu Android conectado
```

> 📌 **Nota:** el plan (`PLAN.md`) no repite las decisiones: **apunta** al de React Native. Si mañana se decide que `2 + 3 × 4` da 14, se cambia en un lugar y las dos versiones tienen que seguirlo.

## Parte 1. Las teclas: de textos a una familia cerrada

En TypeScript, una tecla era **un texto** de una lista cerrada:

```ts
type Tecla = Digito | ',' | Operador | '=' | 'C' | '⌫' | '%' | '±';
```

En Kotlin, es **una familia de tipos** con `sealed` (clase 64):

```kotlin
sealed interface Tecla {
    val simbolo: String
    data class Digito(val numero: Int) : Tecla { override val simbolo get() = numero.toString() }
    data object Coma : Tecla { override val simbolo = "," }
    data object Igual : Tecla { override val simbolo = "=" }
    // … BorrarTodo, BorrarUno, Porcentaje, Signo
}

enum class Operador(override val simbolo: String) : Tecla {
    SUMAR("+"), RESTAR("−"), MULTIPLICAR("×"), DIVIDIR("÷")
}
```

¿Qué se gana? Mira cómo `apretar` decide qué hacer:

```kotlin
return when (t) {
    is Tecla.Digito -> …
    Tecla.Coma -> …
    is Operador -> …
    Tecla.Igual -> …
    // … una rama por cada tecla, y SIN else
}
```

Como la familia es **cerrada**, Kotlin sabe cuáles son **todas** las teclas. Si mañana agregas `Tecla.Raiz` y te olvidas de decir qué hace, **el programa no compila** y te marca este `when`. En TypeScript, con textos, también se puede lograr, pero hay que hacerlo a propósito; en Kotlin viene solo.

> 💡 **Idea:** el teclado sigue siendo **datos** (`FILAS`, una lista de listas de teclas), como en la clase 95. Y las pruebas buscan las teclas por su símbolo con `teclaDe("+")`, así se escriben **igual** que las de React Native: `tocar("2", "+", "3", "=")`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las teclas como una familia cerrada
lenguaje: kotlin
pide: Ya está la familia `Tecla` (sealed) y el enum `Operador`. Completa `tipoDe(t)` con un `when` **sin `else`**: `"igual"` para `Igual`, `"operador"` para cualquier `Operador`, `"funcion"` para `BorrarTodo`, y `"numero"` para `Digito` y `Coma`. Si te olvidas una tecla, Kotlin no compila: esa es la ventaja.
--- código
sealed interface Tecla {
    data class Digito(val numero: Int) : Tecla
    data object Coma : Tecla
    data object Igual : Tecla
    data object BorrarTodo : Tecla
}

enum class Operador : Tecla { SUMAR, RESTAR, MULTIPLICAR, DIVIDIR }

fun tipoDe(t: Tecla): String = TODO()
--- pruebas
prueba("un dígito") { igual(tipoDe(Tecla.Digito(7)), "numero") }
prueba("la coma") { igual(tipoDe(Tecla.Coma), "numero") }
prueba("los operadores") { igual(Operador.entries.map { tipoDe(it) }, listOf("operador", "operador", "operador", "operador")) }
prueba("igual") { igual(tipoDe(Tecla.Igual), "igual") }
prueba("C") { igual(tipoDe(Tecla.BorrarTodo), "funcion") }
--- solución
sealed interface Tecla {
    data class Digito(val numero: Int) : Tecla
    data object Coma : Tecla
    data object Igual : Tecla
    data object BorrarTodo : Tecla
}

enum class Operador : Tecla { SUMAR, RESTAR, MULTIPLICAR, DIVIDIR }

fun tipoDe(t: Tecla): String = when (t) {
    Tecla.Igual -> "igual"
    is Operador -> "operador"
    Tecla.BorrarTodo -> "funcion"
    is Tecla.Digito, Tecla.Coma -> "numero"
}
```

```practica
vf :: Con una familia sealed, un when sin else que se olvida de una tecla no compila
vf :: En Kotlin, las teclas de la calculadora son textos, igual que en TypeScript
elige :: ¿Para qué sirve teclaDe("+") en las pruebas de Kotlin? :: Para que corran más rápido :: Para escribir las pruebas igual que en React Native, por el símbolo de la tecla :: Para dibujar las teclas
escribe :: Agregas Tecla.Raiz a la familia y no tocas nada más. ¿Qué pasa en Kotlin? :: No compila: el when de apretar (y los de tipoDe y etiquetaDe) no tiene rama para Raiz y no tiene else, así que Kotlin avisa en cada lugar donde falta decidir qué hace.
```

## Parte 2. BigDecimal: decimales exactos, y una trampa

En la clase 94, `0.1 + 0.2` daba `0.30000000000000004`, y se arreglaba **redondeando** a 12 cifras. En Kotlin hay una herramienta mejor: **`BigDecimal`**, que guarda los decimales **exactos**, como los escribimos:

```kotlin
BigDecimal("0.1") + BigDecimal("0.2")   // 0.3, exacto, sin redondear
```

Por eso los bancos y los sistemas de cobro usan `BigDecimal` (o algo parecido) para la plata. JavaScript no lo trae de fábrica: por eso allá se redondeaba.

Solo hay que redondear lo que **no termina nunca**, como `1 ÷ 3`. `BigDecimal` no adivina cuántas cifras quieres: hay que decírselo con un `MathContext`:

```kotlin
private val DOCE_CIFRAS = MathContext(12, RoundingMode.HALF_UP)
a.divide(b, DOCE_CIFRAS)   // 1 ÷ 3 = 0.333333333333
```

**La trampa, encontrada leyendo el código.** Con las 48 pruebas en verde a la primera, se releyó `apretar` como si lo hubiera escrito otro (clase 34). En el porcentaje decía:

```kotlin
e.guardado * actual / CIEN      // ✗
```

En Kotlin, `/` entre dos `BigDecimal` **conserva los decimales del primero**. `15 × 3 = 45` no tiene decimales, entonces `45 / 100` da **0**, no `0,45`. Ninguna prueba lo preguntaba: los casos del plan eran `200 + 10 %` (da `20`, entero) y `50 %`. **Arreglo, prueba primero:**

```kotlin
// Encontrado leyendo el código: en Kotlin, `/` entre BigDecimal conserva los decimales del PRIMERO.
@Test fun `15 + 3 % es 0,45 y no 0`() = assertEquals("0,45", tocar("1", "5", "+", "3", "%"))
```

En rojo, después `.divide(CIEN, DOCE_CIFRAS)`, y en verde. Y la **misma prueba** se agregó a la calculadora de React Native, donde pasó sin cambiar nada (JavaScript divide con decimales siempre). **Una prueba que nace en una versión sirve para las dos.**

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: BigDecimal y su trampa
lenguaje: kotlin
pide: Completa con `BigDecimal` (ya está importado). `sumar(a, b)` recibe dos textos como `"0.1"` y devuelve la suma como texto con `toPlainString()`: con `BigDecimal` da exacto, sin redondear. `dividir(a, b)` divide con `divide(…, DOCE)` (12 cifras) y saca los ceros de más con `stripTrailingZeros()`. Y `porcentaje(base, por)` devuelve `base × por ÷ 100`, **con `divide`**, nunca con `/`.
--- código
import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

val DOCE = MathContext(12, RoundingMode.HALF_UP)

fun sumar(a: String, b: String): String = TODO()

fun dividir(a: String, b: String): String = TODO()

fun porcentaje(base: String, por: String): String = TODO()
--- pruebas
prueba("0,1 + 0,2 exacto") { igual(sumar("0.1", "0.2"), "0.3") }
prueba("1 ÷ 3 con 12 cifras") { igual(dividir("1", "3"), "0.333333333333") }
prueba("5 ÷ 2 sin ceros de más") { igual(dividir("5", "2"), "2.5") }
prueba("200 + 10 %") { igual(porcentaje("200", "10"), "20") }
prueba("15 + 3 % no es 0") { igual(porcentaje("15", "3"), "0.45") }
--- solución
import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

val DOCE = MathContext(12, RoundingMode.HALF_UP)

fun sumar(a: String, b: String): String = (BigDecimal(a) + BigDecimal(b)).toPlainString()

fun dividir(a: String, b: String): String = BigDecimal(a).divide(BigDecimal(b), DOCE).stripTrailingZeros().toPlainString()

fun porcentaje(base: String, por: String): String =
    (BigDecimal(base) * BigDecimal(por)).divide(BigDecimal(100), DOCE).stripTrailingZeros().toPlainString()
```

```practica
vf :: Con BigDecimal, 0,1 + 0,2 da exactamente 0,3, sin redondear
vf :: En Kotlin, dividir dos BigDecimal con / siempre da todos los decimales
elige :: ¿Por qué los bancos usan BigDecimal para la plata? :: Porque es más rápido :: Porque guarda los decimales exactos, sin errores como 0,30000000000000004 :: Porque ocupa menos memoria
escribe :: ¿Cómo se encontró el error del porcentaje si las 48 pruebas pasaban? :: Releyendo el código como si fuera de otro. Las pruebas solo tenían porcentajes que daban enteros; se escribió una prueba con 15 + 3 % (en rojo), se cambió / por divide, y la misma prueba se agregó a la versión de React Native.
```

## Parte 3. El estado: data class y copy

En TypeScript, el estado era un objeto, y un estado nuevo se armaba con `{ ...e, pantalla: '7' }`. En Kotlin es una **`data class`**, y un estado nuevo se arma con **`copy`**:

```kotlin
data class Estado(
    val pantalla: String = "0",
    val guardado: BigDecimal? = null,
    val operador: Operador? = null,
    val nuevoNumero: Boolean = true,
    val error: String? = null,
)

e.copy(pantalla = "7", nuevoNumero = false)   // el { ...e, pantalla: '7', nuevoNumero: false } de TypeScript
```

Tres cosas que Kotlin hace por ti:

- **`val` en todos los campos:** nadie puede cambiar un estado por dentro. En TypeScript era una regla que había que respetar (y una prueba que la revisaba); en Kotlin, **el compilador no te deja**.
- **`BigDecimal?`** (con `?`): "un número **o** nada" (clase 62). Antes de usar `e.guardado`, Kotlin te obliga a revisar que no sea `null`.
- **`INICIAL = Estado()`**: con los valores por defecto, el estado de la calculadora recién abierta.

**El resultado de una cuenta** también es una familia cerrada: un número **o** un aviso.

```kotlin
sealed interface Resultado {
    data class Numero(val valor: BigDecimal) : Resultado
    data class Aviso(val texto: String) : Resultado
}
```

En TypeScript era `number | string`, y había que mirar con `typeof`. En Kotlin, un `when (r)` con `is Resultado.Aviso` e `is Resultado.Numero`, y otra vez: si falta un caso, no compila.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un estado nuevo con copy
lenguaje: kotlin
pide: Completa `apretar(e, t)` para dígitos (`'0'` a `'9'`) y la coma (`','`), con `copy` y **sin cambiar** el estado que llega. Un dígito: si `nuevoNumero`, la pantalla pasa a ser ese dígito (y `nuevoNumero = false`); si la pantalla es `"0"`, se reemplaza; si no, se agrega al final. La coma: si `nuevoNumero`, la pantalla pasa a `"0."`; si ya tiene un punto, nada; si no, agrega `"."`.
--- código
data class Estado(val pantalla: String = "0", val nuevoNumero: Boolean = true)

fun apretar(e: Estado, t: Char): Estado = TODO()
--- pruebas
fun tocar(teclas: String) = teclas.fold(Estado()) { e, t -> apretar(e, t) }.pantalla
prueba("un número") { igual(tocar("42"), "42") }
prueba("el 0 de adelante se reemplaza") { igual(tocar("07"), "7") }
prueba("empezar con coma") { igual(tocar(",5"), "0.5") }
prueba("una coma de más se ignora") { igual(tocar("1,2,"), "1.2") }
prueba("no cambia el que recibe") { val e = Estado("1", false); apretar(e, '2'); igual(e.pantalla, "1") }
--- solución
data class Estado(val pantalla: String = "0", val nuevoNumero: Boolean = true)

fun apretar(e: Estado, t: Char): Estado = when {
    t == ',' && e.nuevoNumero -> e.copy(pantalla = "0.", nuevoNumero = false)
    t == ',' -> if ('.' in e.pantalla) e else e.copy(pantalla = e.pantalla + ".")
    e.nuevoNumero -> e.copy(pantalla = t.toString(), nuevoNumero = false)
    e.pantalla == "0" -> e.copy(pantalla = t.toString())
    else -> e.copy(pantalla = e.pantalla + t)
}
```

```practica
vf :: copy en una data class crea un estado nuevo cambiando solo los campos que le dices
vf :: Como Estado es una data class, cualquier parte del programa puede cambiar su pantalla por dentro
elige :: ¿Qué tipo tiene el resultado de calcular en Kotlin? :: number | string :: Una familia sealed: Resultado.Numero o Resultado.Aviso :: Any
escribe :: ¿Qué quiere decir el ? en guardado: BigDecimal? :: Que puede ser un número o null (nada). Kotlin obliga a revisar que no sea null antes de usarlo, así no se puede olvidar.
```

## Parte 4. La pantalla en Compose, y el estado que sobrevive

La pantalla hace **lo mismo** que la de React Native, con otras palabras:

| React Native | Compose |
|---|---|
| `useState(INICIAL)` y `setEstado((e) => apretar(e, t))` | un `ViewModel` con `_estado.update { apretar(it, t) }` |
| `useColorScheme() === 'light' ? claro : oscuro` | `if (isSystemInDarkTheme()) Oscuro else Claro` |
| `useWindowDimensions().width` | `LocalConfiguration.current.screenWidthDp` |
| `Pressable` con `pressed` | `clickable` con `collectIsPressedAsState()` |
| `accessibilityLabel`, `accessibilityState` | `semantics { contentDescription; selected; role }` |
| `accessibilityLiveRegion="polite"` | `semantics { liveRegion = LiveRegionMode.Polite }` |
| `borderRadius: lado / 2` | `clip(CircleShape)` |

Fíjate en la primera fila. `update { }` recibe **siempre el estado más nuevo**, aunque se toquen dos teclas muy rápido: es el mismo cuidado que `setEstado((e) => …)` de la clase 95, parte 3.

**El ViewModel, probado en el emulador.** Con `-0,333333333333` en el visor, se cambió el emulador de modo oscuro a claro. Android **recrea la pantalla** cuando cambia el tema (y cuando giras el teléfono)… y **el número siguió ahí**. Eso es el ViewModel (clase 66): el estado vive afuera de la pantalla y sobrevive cuando ella se vuelve a crear. Con un `remember` común, se habría borrado.

> 💡 **Idea:** `Calculadora(estado, colores, anchoPantalla, alTocar)` está separada de `PantallaCalculadora(vm, colores)`: la primera **no conoce** al ViewModel, recibe todo lo que dibuja. Así se la puede ver en la vista previa de Android Studio con cualquier estado, sin tocar teclas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El color de una tecla, con when
lenguaje: kotlin
pide: Completa `fondoDe(tipo, encendida, c)`, que devuelve el color de fondo de una tecla (aquí los colores son textos, porque el Playground no tiene Compose). Encendida: `c.sobreOperador`. Si no, según el tipo: `OPERADOR` e `IGUAL` → `c.operador`; `FUNCION` → `c.funcion`; `NUMERO` → `c.numero`. Usa `when` con el enum, sin `else`.
--- código
enum class TipoDeTecla { NUMERO, FUNCION, OPERADOR, IGUAL }
data class Colores(val numero: String, val funcion: String, val operador: String, val sobreOperador: String)

val Oscuro = Colores(numero = "#18212C", funcion = "#2B3644", operador = "#7EE787", sobreOperador = "#0F141B")

fun fondoDe(tipo: TipoDeTecla, encendida: Boolean, c: Colores): String = TODO()
--- pruebas
prueba("un número") { igual(fondoDe(TipoDeTecla.NUMERO, false, Oscuro), "#18212C") }
prueba("una función") { igual(fondoDe(TipoDeTecla.FUNCION, false, Oscuro), "#2B3644") }
prueba("el igual va como operador") { igual(fondoDe(TipoDeTecla.IGUAL, false, Oscuro), "#7EE787") }
prueba("encendida, al revés") { igual(fondoDe(TipoDeTecla.OPERADOR, true, Oscuro), "#0F141B") }
--- solución
enum class TipoDeTecla { NUMERO, FUNCION, OPERADOR, IGUAL }
data class Colores(val numero: String, val funcion: String, val operador: String, val sobreOperador: String)

val Oscuro = Colores(numero = "#18212C", funcion = "#2B3644", operador = "#7EE787", sobreOperador = "#0F141B")

fun fondoDe(tipo: TipoDeTecla, encendida: Boolean, c: Colores): String =
    if (encendida) c.sobreOperador
    else when (tipo) {
        TipoDeTecla.OPERADOR, TipoDeTecla.IGUAL -> c.operador
        TipoDeTecla.FUNCION -> c.funcion
        TipoDeTecla.NUMERO -> c.numero
    }
```

```practica
vf :: _estado.update { apretar(it, t) } recibe siempre el estado más nuevo, como setEstado((e) => …) en React
vf :: Al cambiar el teléfono de modo oscuro a claro, la calculadora vuelve a 0
elige :: ¿Qué hace en Compose lo que en React Native hacía useColorScheme()? :: LocalConfiguration :: isSystemInDarkTheme() :: remember
escribe :: ¿Por qué Calculadora(...) no recibe el ViewModel, sino el estado ya listo? :: Para que solo dibuje lo que recibe: así se puede ver en la vista previa con cualquier estado y es más fácil de probar. El ViewModel lo conecta PantallaCalculadora.
```

## Parte 5. Probarla de verdad, y comparar las dos

**Lo que pasó al instalarla en el emulador:**

```text
adb: failed to install app-debug.apk: Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE:
Existing package com.tuusuario.calculadora signatures do not match newer version]
```

La calculadora de React Native ya estaba instalada con la identidad **`com.tuusuario.calculadora`**, y la de Kotlin usaba **la misma**. Para Android, dos apps con la misma identidad son **la misma app**: creyó que la de Kotlin era una versión nueva de la otra, firmada por otra persona, y la rechazó. Peor: las primeras teclas que se leyeron eran **de la app vieja**. **Arreglo:** `applicationId = "com.tuusuario.calculadorakotlin"` y el nombre "Calculadora Kotlin", anotado en `PLAN.md` con su motivo. En tu teléfono habría pasado lo mismo.

> 📌 **Nota:** el `applicationId` es el documento de identidad de la app en Android (y el `bundleIdentifier`, en el iPhone). **Una vez publicada, no se cambia nunca**: para Google Play sería otra app.

Después, en el emulador, en modo oscuro y claro: `0,1 + 0,2 =` dio **0,3**; `15 + 3 %`, **0,45**; `1 ÷ 0 =`, el aviso; el número largo entró entero, con el `×` encendido; y cada tecla apareció con su nombre en español para TalkBack.

**Las dos, una al lado de la otra:**

| | React Native (clases 94 y 95) | Kotlin nativo (esta clase) |
|---|---|---|
| Sale para | Android **y** iPhone, un solo código | Solo Android |
| Lenguaje | TypeScript | Kotlin |
| Los decimales | `number`: redondear a 12 cifras | `BigDecimal`: exactos |
| Una tecla que falta en un `switch`/`when` | Hay que pedirlo a propósito | No compila, de fábrica |
| Pruebas | 56 con Jest | 51 con JUnit (las mismas decisiones) |
| El archivo para instalar | APK de 68 MB (Release, todos los procesadores) | APK de 10 MB (Debug) |
| Ver un cambio | Al instante (Expo) | Volver a compilar (segundos) |

**¿Cuál conviene?** Depende de para quién es la app. Si tiene que estar en **Android y en iPhone** y la hace un equipo chico, React Native ahorra hacer todo dos veces (Copiloto lo hace así). Si es **solo para Android** o necesita lo último de Android (widgets, el reloj, el auto), Kotlin nativo es el camino directo. Lo que **no** cambia, y es lo más importante: el plan, la tabla de decisiones, la lógica separada de la pantalla, el motor de diseño y las pruebas primero. **Eso es saber programar; el lenguaje es la herramienta.**

> 📌 **Nota:** ¿por qué esta app no se puede subir a la App Store del iPhone, y por qué existen apps solo para Android? Está explicado en la clase 44, en **"Para ir más lejos: ¿por qué la app de un teléfono no sirve en el otro?"**.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dos apps con la misma identidad
lenguaje: kotlin
pide: Completa `identidadesRepetidas(apps)`: recibe una lista de pares `nombre to applicationId` y devuelve, ordenados, los `applicationId` que aparecen en **más de una** app (esas no pueden convivir en un teléfono). Pista: `groupBy` y `filter`.
--- código
fun identidadesRepetidas(apps: List<Pair<String, String>>): List<String> = TODO()
--- pruebas
prueba("las dos calculadoras, antes del arreglo") { igual(identidadesRepetidas(listOf("Calculadora" to "com.tuusuario.calculadora", "Calculadora Kotlin" to "com.tuusuario.calculadora")), listOf("com.tuusuario.calculadora")) }
prueba("después del arreglo") { igual(identidadesRepetidas(listOf("Calculadora" to "com.tuusuario.calculadora", "Calculadora Kotlin" to "com.tuusuario.calculadorakotlin")), listOf<String>()) }
prueba("varias") { igual(identidadesRepetidas(listOf("a" to "x.y.b", "b" to "x.y.a", "c" to "x.y.b", "d" to "x.y.a", "e" to "x.y.c")), listOf("x.y.a", "x.y.b")) }
--- solución
fun identidadesRepetidas(apps: List<Pair<String, String>>): List<String> =
    apps.groupBy { it.second }.filter { it.value.size > 1 }.keys.sorted()
```

```practica
vf :: Dos apps con el mismo applicationId no pueden estar instaladas a la vez en un Android
vf :: El applicationId se puede cambiar cuando quieras, incluso después de publicar en Google Play
elige :: Una empresa necesita su app en Android y en iPhone, con un equipo chico. ¿Qué conviene más? :: Kotlin nativo :: React Native, un solo código para los dos :: Escribirla dos veces
escribe :: Entre las dos calculadoras, ¿qué fue igual y qué cambió? :: Igual: el plan y la tabla de decisiones, la lógica separada de la pantalla, el teclado como datos, el motor de diseño, la accesibilidad y las pruebas primero. Cambió el lenguaje y sus herramientas: TypeScript con number y redondeo contra Kotlin con BigDecimal exacto y familias sealed; useState contra ViewModel; Expo contra Gradle.
```


**Comprobación antes de seguir**

Compara resultados decimales y gira el dispositivo con una cuenta empezada.

<details>
<summary>Necesito una pista</summary>

Revisa por separado cómo se compara el número y qué estado se conserva en pantalla.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿React Native o nativo?":** "Hice la misma calculadora de las dos formas, con las mismas decisiones y las mismas pruebas. En React Native salió para Android y iPhone con un solo código. En Kotlin, con BigDecimal los decimales son exactos y las familias sealed hacen que el compilador me avise si me olvido un caso. Comparar me enseñó dos cosas: que una prueba que nace en una versión sirve para la otra (el porcentaje con decimales, que en Kotlin daba 0 por cómo divide BigDecimal), y que el applicationId es la identidad de la app: con el mismo, Android no deja instalar las dos. Elijo según para quién es la app: las dos plataformas con un equipo chico, React Native; solo Android o lo último del sistema, nativo."

> 🌎 **En la vida real:** es como un chofer que manejó el mismo recorrido en un auto automático y en uno manual: sabe explicar qué le da cada uno y cuál elegiría para cada viaje.

> 🌎 **Otro ejemplo:** es como un traductor que pasó el mismo texto a dos idiomas: lo que quiere decir no cambia, pero cada idioma tiene sus giros y sus trampas.
