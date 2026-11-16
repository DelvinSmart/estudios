# Kotlin 7: datos, pruebas y publicar

> 🌎 **En la vida real:** el último tramo de una obra: instalar los servicios, inspeccionar y entregar las llaves.

> 🎙️ **El profesor dice:** la última clase del curso **Kotlin**: guardar datos en el teléfono (**DataStore** y **Room**), conectar **Firebase** en Android, probar con **JUnit**, armar el **AAB firmado** con Gradle y subirlo a Google Play. Y al final, la pregunta que te van a hacer: ¿React Native o Kotlin?

## Parte 1. Guardar datos

> 🌎 **En la vida real:** DataStore es la libreta de la guantera; Room es el archivador con cajones y fichas.

> 🌎 **Otro ejemplo:** Es como una nota adhesiva frente a una planilla ordenada.

### DataStore: preferencias

Para cosas chicas (tema oscuro, meta diaria) se usa **DataStore**, el reemplazo moderno de SharedPreferences. Es como `AsyncStorage` (clase 58) y trabaja con corrutinas y `Flow`.

> 🌎 **En la vida real:** es como el post-it con la contraseña del wifi de la casa (no de tu banco).

> 🌎 **Otro ejemplo:** Es como el casillero del gimnasio para tus cosas del día.

### Room: una base de datos en el teléfono

Para muchos datos con forma (todos los gastos del año), **Room**: una base de datos SQL local con clases de Kotlin.

```kotlin
@Entity data class GastoEntidad(@PrimaryKey(autoGenerate = true) val id: Int = 0, val tipo: String, val valor: Double)

@Dao interface GastoDao {
    @Query("SELECT * FROM GastoEntidad ORDER BY id DESC") fun observar(): Flow<List<GastoEntidad>>
    @Insert suspend fun insertar(g: GastoEntidad)
}
```

Las consultas con parámetros evitan la inyección SQL (Tema 23). Para los secretos, **EncryptedSharedPreferences** o el Keystore de Android.

> 🌎 **En la vida real:** Room es como un archivador con cajones etiquetados y un índice.

> 🌎 **Otro ejemplo:** Es como pasar de una libreta a una planilla con filtros.

```practica
vf :: Room es una base de datos SQL local para el teléfono
vf :: DataStore está pensado para guardar miles de registros con consultas complejas
elige :: ¿Qué guardarías en DataStore? :: Todos los gastos del año :: Si el tema oscuro está activado :: Las fotos
elige :: ¿Qué devuelve observar() en el Dao del ejemplo? :: Un número :: Un Flow con la lista, que avisa cada cambio :: Un String
escribe :: ¿Qué usarías en Android para guardar una preferencia, muchos gastos y un secreto? :: DataStore para la preferencia, Room para los gastos y EncryptedSharedPreferences o el Keystore para el secreto.
```

## Parte 2. Firebase y pruebas

> 🌎 **En la vida real:** Firebase es la misma bodega central que usa Copiloto; Android solo cambia el camión que va a buscar las cosas.

> 🌎 **Otro ejemplo:** Es como la misma cuenta del banco desde otra app.

### Firebase en Android

Se agrega con el **Firebase BoM** en `build.gradle.kts` y el archivo `google-services.json` (que identifica el proyecto, como la configuración web de `nube.js`). Las **reglas** del servidor siguen siendo las que protegen (Temas 08 y 21).

```kotlin
val db = Firebase.firestore
val foto = db.collection("users").document(uid).collection("gastos").get().await()
```

> 🌎 **En la vida real:** es como abrir la misma caja fuerte con otra llave del mismo juego.

> 🌎 **Otro ejemplo:** Es como entrar al mismo edificio por otra puerta: el portero es el mismo.

### Pruebas con JUnit

```kotlin
class CalculosTest {
    @Test fun sumaLosGastos() {
        val gastos = listOf(Gasto(1, "lavado", 30.0), Gasto(2, "peaje", 12.5))
        assertEquals(42.5, gastos.sumOf { it.valor }, 0.001)
    }
}
```

Corren con Gradle (`./gradlew test`) o con el ▶ verde al lado de la prueba en Android Studio. Gracias a la interfaz del repositorio (clase 64), el ViewModel se prueba con uno en memoria.

> 🌎 **En la vida real:** es como el control de calidad que revisa cada pieza antes del ensamblado.

> 🌎 **Otro ejemplo:** Es como probar la balanza con un peso conocido.

```practica
vf :: En Android, las reglas de seguridad de Firebase siguen protegiendo los datos en el servidor
vf :: assertEquals con Double conviene sin margen de error
elige :: ¿Qué archivo identifica tu proyecto de Firebase en una app Android? :: package.json :: google-services.json :: app.json
elige :: ¿Con qué comando corren las pruebas en un proyecto Android? :: npm test :: ./gradlew test :: pytest
escribe :: ¿Por qué la interfaz RepositorioGastos ayuda a probar el ViewModel? :: Porque en la prueba le paso un repositorio en memoria en vez de Firebase, y así pruebo la lógica rápido, sin internet ni datos reales.
```

## Parte 3. Publicar y comparar

> 🌎 **En la vida real:** entregar las llaves de la casa: con escritura firmada y registro.

> 🌎 **Otro ejemplo:** Es como sacar el carro del taller con la factura y la garantía.

### El AAB firmado

En Android Studio: **Build → Generate Signed App Bundle**, o con Gradle `./gradlew bundleRelease` con la firma configurada. Igual que en React Native (clase 60):
- Se sube el **AAB** a Google Play (prueba interna primero).
- La **llave de firma** no se pierde ni se comparte (Tema 20).
- Cada versión sube `versionCode`.

> 🌎 **En la vida real:** es el mismo camino del producto a la góndola, con otra fábrica.

> 🌎 **Otro ejemplo:** Es como enviar un paquete por otra empresa: mismas reglas de aduana.

### ¿React Native o Kotlin?

| | React Native | Kotlin (nativo) |
|---|---|---|
| Plataformas | iPhone y Android con un código | Solo Android (iPhone necesita Swift) |
| Lenguaje | TypeScript | Kotlin |
| Acceso al teléfono | Casi todo; lo especial con módulos nativos | Todo, directo |
| Cuándo | Apps que van a las dos tiendas, equipos chicos (como Copiloto) | Apps solo Android o con mucho trabajo nativo |

Saber los dos te deja escribir un módulo nativo en Kotlin para tu app de React Native el día que lo necesites.

> 🌎 **En la vida real:** es como saber manejar auto y moto: eliges según el viaje.

> 🌎 **Otro ejemplo:** Es como hablar portugués y español: según con quién conversas.

```practica
vf :: Con Kotlin nativo, la app de iPhone necesita escribirse aparte en Swift
vf :: Una app Android en Kotlin se sube a Google Play como APK sin firmar
elige :: ¿Cuándo conviene React Native en vez de Kotlin? :: Para una app solo Android con mucho trabajo nativo :: Para una app que va a iPhone y Android con un solo código :: Nunca
elige :: ¿Qué comando de Gradle arma el AAB de producción? :: ./gradlew test :: ./gradlew bundleRelease :: npm build
escribe :: Un reclutador te pregunta por qué elegiste React Native para Copiloto y no Kotlin. ¿Qué respondes? :: Porque necesitaba la app en iPhone y Android con un solo código y un equipo chico; con Kotlin tendría que escribir además la versión de iPhone en Swift. Si necesito algo muy nativo, puedo escribir ese módulo en Kotlin.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué sabes de Android nativo?":** "Kotlin con Jetpack Compose, ViewModel con StateFlow y corrutinas, un repositorio detrás de una interfaz para probar con JUnit, DataStore para preferencias y Room para datos locales, Firebase con google-services.json y las reglas del servidor, y el AAB firmado con Gradle para Google Play. Mi app en producción es React Native, y sé cuándo conviene cada uno."

> 🌎 **En la vida real:** es como un mecánico que sabe de motores nafteros y diésel, y explica cuándo conviene cada uno.

> 🌎 **Otro ejemplo:** Es como un músico que toca guitarra y bajo, y sabe qué pide cada canción.
