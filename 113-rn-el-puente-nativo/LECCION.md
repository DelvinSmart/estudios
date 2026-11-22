# React Native 10: el puente, cómo se hablan TypeScript, Kotlin y Swift

> 🌎 **En la vida real:** una embajada. Adentro se habla un idioma, afuera otro, y en la ventanilla hay un traductor con reglas fijas: qué trámites se pueden pedir, qué papeles hay que traer, y cómo te avisan cuando está listo.

> 🎙️ **El profesor dice:** {{alumno}}, en la clase del mapa de los lenguajes viste que Copiloto tiene una parte en Kotlin (Android) y otra en Swift (iPhone), y que se hablan con la app en TypeScript "por un puente". Hoy abrimos el puente: **qué es**, **las tres maneras de hablar** que tiene, **qué pasa con los datos** al cruzar, y **cómo lo hizo Copiloto** en cada lado. El código de Copiloto es privado, así que verás la **forma** real, con nombres de ejemplo, y las **decisiones** que se tomaron y por qué.

## Parte 1. Qué es el puente

> 🌎 **En la vida real:** dos oficinas en el mismo edificio, cada una con su idioma y sus archivos. No pueden meter la mano en los cajones de la otra: se pasan pedidos por una ventanilla.

> 🌎 **Otro ejemplo:** Es como el control remoto del televisor: tú aprietas "subir volumen" sin saber nada de los circuitos de adentro, y el televisor hace el trabajo.

Una app de React Native corre **dos mundos a la vez** en el teléfono:

- **El de JavaScript** (tu TypeScript ya convertido): las pantallas, la lógica, los datos. Corre en un motor de JavaScript (*Hermes*), en su propio hilo.
- **El nativo**: Kotlin en Android, Swift en iPhone. Es el que puede tocar el teléfono **por dentro**: permisos especiales, la cámara, dibujar encima de otra app, compartir la pantalla.

Cada mundo tiene **su propia memoria y sus propios tipos**: un `number` de JavaScript no es un `Double` de Kotlin. El **puente** es la capa que deja que un mundo **llame funciones** del otro y **convierta los datos** al pasar.

Antes, React Native lo hacía con mensajes en texto (JSON) que iban y venían de a montones. Hoy usa **JSI** (*JavaScript Interface*): el motor de JavaScript tiene un enchufe en C++, y el lado nativo **cuelga funciones de verdad** en un objeto de JavaScript. Llamar a una es casi tan directo como llamar a una función tuya.

Para no escribir ese C++ a mano, Copiloto usa la herramienta de Expo: **Expo Modules**. Con ella, un módulo nativo es:

```text
modules/mi-modulo/
├── expo-module.config.json        ← "en Android la clase es tal, en iPhone es tal"
├── src/index.ts                   ← el lado TypeScript: lo que usa la app
├── android/…/MiModulo.kt          ← el lado Kotlin
└── ios/MiModulo.swift             ← el lado Swift
```

Al compilar la app, Expo lee `expo-module.config.json` y **enchufa** solo las dos clases (*autolinking*). Por eso el módulo **no está en Expo Go** (clase 57): Expo Go ya viene compilado, y un módulo tuyo necesita un *development build*.

> 🧩 **Piezas para este ejercicio**
> - La lista `SOLO_NATIVO` clasifica cada tarea del ejercicio. `.some` permite decidir si al menos una tarea requiere el módulo que se incluye al construir la app.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Quién puede hacer qué?
lenguaje: js
pide: Completa `quienLoHace(tarea)`. Si la tarea está en `SOLO_NATIVO` (cosas que solo puede hacer el teléfono por dentro), devuelve `'módulo nativo (Kotlin y Swift)'`; si no, `'TypeScript'`. Después `necesitaDevelopmentBuild(tareas)`: `true` si **alguna** de las tareas la hace el módulo nativo (Expo Go no lo trae).
--- código
const SOLO_NATIVO = ['dibujar encima de otra app', 'leer la pantalla compartida', 'sacar texto de una imagen en el teléfono'];

function quienLoHace(tarea) {
  return 'TypeScript'; // tu código aquí
}

function necesitaDevelopmentBuild(tareas) {
  return false; // tu código aquí
}
--- pruebas
prueba('una pantalla con una lista', () => igual(quienLoHace('mostrar la lista de gastos'), 'TypeScript'));
prueba('la burbuja encima de otra app', () => igual(quienLoHace('dibujar encima de otra app'), 'módulo nativo (Kotlin y Swift)'));
prueba('una app como Copiloto necesita development build', () => igual(necesitaDevelopmentBuild(['mostrar la lista de gastos', 'leer la pantalla compartida']), true));
prueba('una app solo de pantallas funciona en Expo Go', () => igual(necesitaDevelopmentBuild(['mostrar la lista de gastos', 'guardar un gasto']), false));
--- solución
const SOLO_NATIVO = ['dibujar encima de otra app', 'leer la pantalla compartida', 'sacar texto de una imagen en el teléfono'];

function quienLoHace(tarea) {
  return SOLO_NATIVO.includes(tarea) ? 'módulo nativo (Kotlin y Swift)' : 'TypeScript';
}

function necesitaDevelopmentBuild(tareas) {
  return tareas.some((t) => quienLoHace(t) !== 'TypeScript');
}
```

```practica
vf :: TypeScript y Kotlin no se mezclan en el mismo archivo: cada uno vive en su parte y se hablan por el puente
vf :: Un módulo nativo propio funciona en Expo Go sin hacer nada más
elige :: ¿Qué es JSI? :: Un formato de archivos :: Un enchufe en C++ del motor de JavaScript, donde el lado nativo cuelga funciones de verdad :: Un lenguaje nuevo
escribe :: ¿Qué hace el archivo expo-module.config.json de un módulo? :: Dice cuál es la clase del módulo en Android (Kotlin) y cuál en iPhone (Swift), para que Expo las enchufe solo al compilar la app (autolinking).
```

## Parte 2. Las tres maneras de hablar, y los datos que cruzan

> 🌎 **En la vida real:** en la ventanilla hay tres tipos de trámite. Uno se resuelve **en el momento** ("¿cuánto cuesta?"). Otro te dan un **número y te avisan** cuando está ("tu pasaporte estará en unos días"). Y el tercero es al revés: la oficina **te llama** cuando pasa algo ("llegó su paquete").

> 🌎 **Otro ejemplo:** Es como escribirle a alguien por WhatsApp: a veces te contesta al toque (en el momento), a veces te dice "lo reviso y te aviso" (te avisa después), y a veces te llega un mensaje suyo sin que hayas preguntado nada (te escribe él primero).

En un módulo de Expo, el lado nativo declara todo en una función `definition()`:

| Manera | Se declara así (Kotlin y Swift) | En TypeScript | Para qué |
|---|---|---|---|
| **Función** | `Function("nombre") { … }` | `Modulo.nombre()` devuelve el valor al instante | Preguntas rápidas: "¿tengo el permiso?" |
| **Función asíncrona** | `AsyncFunction("nombre") { promise -> … }` | `await Modulo.nombre()` (una **promesa**) | Lo que tarda o espera a la persona: pedir un permiso, empezar a compartir la pantalla |
| **Evento** | `Events("onAlgo")` y después `sendEvent("onAlgo", datos)` | `Modulo.addListener('onAlgo', fn)` | Cuando el **nativo** tiene algo que contar sin que nadie le haya preguntado |

**Ojo con la función síncrona:** mientras corre, JavaScript **espera**. Si hace algo lento, la app se congela. Lo lento va en `AsyncFunction`.

**Los datos se convierten al cruzar:**

| TypeScript | Kotlin | Swift |
|---|---|---|
| `number` | `Double` (o `Int`) | `Double` (o `Int`) |
| `string` | `String` | `String` |
| `boolean` | `Boolean` | `Bool` |
| `string[]` | `List<String>` | `[String]` |
| `Record<string, number>` | `Map<String, Double>` | `[String: Double]` |
| `null` o sin valor | un tipo con `?` | un opcional `?` |

Si TypeScript manda un tipo que no coincide (un texto donde Kotlin espera `Boolean`), el puente **no adivina**: tira un error. Por eso el lado TypeScript escribe el **tipo** de cada función (parte 3).

> 🧩 **Piezas para este ejercicio**
> - `typeof` distingue los tipos simples. Comprueba las listas con `Array.isArray` antes de tratar los objetos como mapas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: En qué se convierte cada dato al cruzar
lenguaje: js
pide: Completa `tipoAlCruzar(valor, plataforma)` (`plataforma` es `'kotlin'` o `'swift'`). Un número es `Double` en los dos; un texto, `String`; un booleano, `Boolean` en Kotlin y `Bool` en Swift; una lista de textos, `List<String>` o `[String]`; y un objeto con números, `Map<String, Double>` o `[String: Double]`. Usa `typeof` y `Array.isArray`.
--- código
function tipoAlCruzar(valor, plataforma) {
  return 'no sé'; // tu código aquí
}
--- pruebas
prueba('un número', () => igual([tipoAlCruzar(4.9, 'kotlin'), tipoAlCruzar(4.9, 'swift')], ['Double', 'Double']));
prueba('un texto', () => igual(tipoAlCruzar('BRL', 'swift'), 'String'));
prueba('un booleano', () => igual([tipoAlCruzar(true, 'kotlin'), tipoAlCruzar(true, 'swift')], ['Boolean', 'Bool']));
prueba('una lista de textos', () => igual([tipoAlCruzar(['a', 'b'], 'kotlin'), tipoAlCruzar(['a', 'b'], 'swift')], ['List<String>', '[String]']));
prueba('un objeto con números', () => igual([tipoAlCruzar({ minimo: 1.2 }, 'kotlin'), tipoAlCruzar({ minimo: 1.2 }, 'swift')], ['Map<String, Double>', '[String: Double]']));
--- solución
function tipoAlCruzar(valor, plataforma) {
  const k = plataforma === 'kotlin';
  if (typeof valor === 'number') return 'Double';
  if (typeof valor === 'string') return 'String';
  if (typeof valor === 'boolean') return k ? 'Boolean' : 'Bool';
  if (Array.isArray(valor)) return k ? 'List<String>' : '[String]';
  return k ? 'Map<String, Double>' : '[String: Double]';
}
```

```practica
vf :: Una función síncrona del módulo nativo hace esperar a JavaScript mientras corre, así que lo lento va en una AsyncFunction
vf :: Si TypeScript manda un texto donde Kotlin espera un Boolean, el puente lo convierte solo
elige :: El nativo quiere avisar "la persona dejó de compartir la pantalla", sin que nadie le haya preguntado. ¿Qué usa? :: Una Function :: Una AsyncFunction :: Un evento (sendEvent), que TypeScript escucha con addListener
escribe :: ¿En qué se convierte un Record<string, number> de TypeScript en Kotlin y en Swift? :: En Kotlin, en un Map<String, Double>; en Swift, en un diccionario [String: Double].
```

## Parte 3. El lado TypeScript: cómo lo hizo Copiloto

> 🌎 **En la vida real:** antes de mandar a alguien a la ventanilla, te fijas si la ventanilla está abierta. Si está cerrada, no te quedas parado: sigues con lo demás.

> 🌎 **Otro ejemplo:** Es como el enchufe de un aparato de viaje: si en ese país no hay el enchufe, el aparato no se quema, simplemente no lo usas.

El archivo `src/index.ts` del módulo de Copiloto es lo **único** que el resto de la app conoce. Las pantallas nunca hablan con Kotlin ni con Swift directamente: llaman a funciones normales de este archivo. Su forma, con nombres de ejemplo:

```ts
import { requireOptionalNativeModule } from 'expo-modules-core';

// 1. El tipo de cada función del lado nativo (lo que el puente espera).
type MiModuloNativo = {
  puedeDibujarEncima(): boolean;
  guardarMinimos(minimos: Record<string, number>, moneda: string): void;
  empezarCaptura?(): Promise<boolean>;            // el ? : solo existe en iPhone
  addListener?(evento: string, fn: () => void): { remove(): void };
};

// 2. Se carga la primera vez que se usa, no al abrir la app.
let nativo: MiModuloNativo | null | undefined;
function cargar(): MiModuloNativo | null {
  if (nativo !== undefined) return nativo;
  try {
    nativo = requireOptionalNativeModule<MiModuloNativo>('MiModulo');
  } catch {
    nativo = null;
  }
  return nativo;
}

// 3. Toda llamada pasa por aquí: si no hay módulo o falla, un valor de respaldo.
function llamar<T>(fn: (m: MiModuloNativo) => T, respaldo: T): T {
  const m = cargar();
  if (!m) return respaldo;
  try { return fn(m); } catch { return respaldo; }
}

export const puedeDibujarEncima = () => llamar((m) => m.puedeDibujarEncima(), false);
```

Tres decisiones, cada una por un problema real:

1. **`requireOptionalNativeModule`, no `requireNativeModule`:** en Expo Go, o en la web, el módulo no existe. La versión "opcional" devuelve `null` en vez de tirar un error, y la pantalla de la burbuja simplemente **no aparece**.
2. **Cargar tarde:** si el módulo se carga al importar el archivo, un error del lado nativo en el arranque **tira la app entera** antes de la primera pantalla. Cargándolo la primera vez que se usa, el error queda encerrado.
3. **Un respaldo en cada llamada:** si algo falla del otro lado, la app sigue con un valor seguro (`false`, una lista vacía) en vez de romperse.

> 🧩 **Piezas para este ejercicio**
> - Guarda una señal que indique si ya intentaste buscar. Así puedes distinguir «todavía no busqué» de «ya busqué y no encontré módulo». Atrapa por separado el fallo al cargar y el fallo al usarlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Llamar al módulo sin romper la app
lenguaje: ts
pide: Completa `crearPuente(buscar)`. `buscar()` es como `requireOptionalNativeModule`: devuelve el módulo, `null` si no existe, o **tira un error**. Devuelve un objeto con `llamar(fn, respaldo)`: carga el módulo **una sola vez** (la primera vez que se llama, no antes), y si no hay módulo, o si `fn` tira un error, devuelve `respaldo`.
--- código
type Modulo = { puedeDibujarEncima(): boolean };

function crearPuente(buscar: () => Modulo | null) {
  return {
    llamar<T>(fn: (m: Modulo) => T, respaldo: T): T {
      return fn(buscar() as Modulo); // ✗ busca cada vez, y si algo falla, rompe
    },
  };
}
--- pruebas
let veces = 0;
const puente = crearPuente(() => { veces++; return { puedeDibujarEncima: () => true }; });
prueba('no busca el módulo antes de usarlo', () => igual(veces, 0));
prueba('llama a la función nativa', () => igual(puente.llamar((m) => m.puedeDibujarEncima(), false), true));
prueba('lo busca una sola vez', () => { puente.llamar((m) => m.puedeDibujarEncima(), false); igual(veces, 1); });
prueba('en Expo Go no hay módulo: respaldo', () => igual(crearPuente(() => null).llamar((m) => m.puedeDibujarEncima(), false), false));
prueba('si buscarlo tira un error: respaldo', () => igual(crearPuente(() => { throw new Error('arranque'); }).llamar((m) => m.puedeDibujarEncima(), false), false));
prueba('si la función nativa falla: respaldo', () => igual(crearPuente(() => ({ puedeDibujarEncima: () => { throw new Error('sin permiso'); } })).llamar((m) => m.puedeDibujarEncima(), false), false));
--- solución
type Modulo = { puedeDibujarEncima(): boolean };

function crearPuente(buscar: () => Modulo | null) {
  let modulo: Modulo | null | undefined;
  const cargar = (): Modulo | null => {
    if (modulo !== undefined) return modulo;
    try {
      modulo = buscar();
    } catch {
      modulo = null;
    }
    return modulo;
  };
  return {
    llamar<T>(fn: (m: Modulo) => T, respaldo: T): T {
      const m = cargar();
      if (!m) return respaldo;
      try {
        return fn(m);
      } catch {
        return respaldo;
      }
    },
  };
}
```

Una cosa más del lado TypeScript de Copiloto: la lista de apps de viaje instaladas llega como **lista** en Android, pero en iPhone llega como **texto JSON** (Swift la arma con `JSONSerialization`, porque una lista de diccionarios con valores mezclados es más fácil de mandar como texto). El tipo lo dice: `listarApps(): App[] | string`, y TypeScript acepta las dos.

> 🧩 **Piezas para este ejercicio**
> - Primero comprueba si ya tienes una lista. Si llega texto, conviértelo dentro de `try` y vuelve a comprobar con `Array.isArray` antes de devolverlo.

```ejercicio
titulo: La misma respuesta, de dos formas
lenguaje: ts
pide: Completa `leerApps(respuesta)`. Si `respuesta` es una lista, devuélvela. Si es un texto, conviértelo con `JSON.parse`; si el texto está roto o no es una lista, devuelve `[]`.
--- código
type App = { paquete: string; nombre: string };

function leerApps(respuesta: App[] | string): App[] {
  return respuesta as App[]; // ✗ en iPhone llega como texto
}
--- pruebas
const lista: App[] = [{ paquete: 'com.ejemplo.viajes', nombre: 'Viajes' }];
prueba('Android: ya es una lista', () => igual(leerApps(lista), lista));
prueba('iPhone: llega como texto JSON', () => igual(leerApps(JSON.stringify(lista)), lista));
prueba('un texto roto no rompe la pantalla', () => igual(leerApps('[{"paquete":'), []));
prueba('un texto que no es lista', () => igual(leerApps('{"paquete":"x"}'), []));
--- solución
type App = { paquete: string; nombre: string };

function leerApps(respuesta: App[] | string): App[] {
  if (Array.isArray(respuesta)) return respuesta;
  try {
    const leido: unknown = JSON.parse(respuesta);
    return Array.isArray(leido) ? (leido as App[]) : [];
  } catch {
    return [];
  }
}
```

```practica
vf :: requireOptionalNativeModule devuelve null si el módulo no existe (por ejemplo en Expo Go), en vez de tirar un error
vf :: Conviene cargar el módulo nativo apenas se importa el archivo, para que esté listo antes
elige :: ¿Por qué cada llamada al módulo de Copiloto tiene un valor de respaldo? :: Para que sea más rápida :: Para que, si algo falla del otro lado, la app siga con un valor seguro en vez de romperse :: Porque TypeScript lo exige
escribe :: ¿Por qué las pantallas de Copiloto no llaman a Kotlin ni a Swift directamente? :: Porque todo pasa por src/index.ts del módulo: ahí están los tipos, la carga tardía y los respaldos. Las pantallas llaman funciones normales y no saben nada del puente.
```

## Parte 4. El lado Kotlin y el lado Swift: el mismo contrato, dos idiomas

> 🌎 **En la vida real:** dos sucursales del mismo banco, una en Brasil y otra en Estados Unidos. Los trámites tienen **el mismo nombre** en las dos ventanillas, aunque adentro cada una trabaje con sus propias leyes.

> 🌎 **Otro ejemplo:** Es como un menú traducido: el plato 7 es el mismo en la carta en español y en la carta en inglés.

Los dos lados declaran **el mismo nombre** de módulo y **comparten la mayoría de las funciones** (guardar los mínimos, encender el lector, listar las apps de viaje), porque TypeScript las llama igual en los dos. Pero **no son idénticos**: cada teléfono resuelve la parte difícil de otra manera, así que cada lado tiene funciones que el otro **no** tiene. Eso está bien, y más abajo verás cómo TypeScript lo maneja. En Kotlin:

```kotlin
class MiModulo : Module() {
    override fun definition() = ModuleDefinition {
        Name("MiModulo")

        Function("puedeDibujarEncima") {
            Settings.canDrawOverlays(context)          // pregunta a Android
        }

        Function("guardarMinimos") { minimos: Map<String, Double>, moneda: String ->
            Preferencias.guardar(context, Minimos(
                porKm = minimos["porKm"] ?: 1.2,       // si TypeScript no lo mandó, uno por defecto
                porHora = minimos["porHora"] ?: 35.0,
            ), moneda)
        }
    }
}
```

Y en Swift, lo mismo con las reglas de Apple:

```swift
public class MiModulo: Module {
    public func definition() -> ModuleDefinition {
        Name("MiModulo")

        // guardarMinimos se ve igual que en Kotlin: es una de las funciones compartidas.
        Function("guardarMinimos") { (minimos: [String: Double], moneda: String) in
            Preferencias.guardar(minimos, moneda)
        }

        // De aquí para abajo, SOLO iPhone (ReplayKit). Kotlin, en cambio, tiene las
        // funciones del lector de accesibilidad, que aquí no existen.
        Events("alEmpezarCaptura", "alTerminarCaptura")

        AsyncFunction("empezarCaptura") { (promise: Promise) in
            DispatchQueue.main.async {                  // lo que toca pantallas va en el hilo principal
                Captura.empezar { ok in promise.resolve(ok) }
            }
        }
    }

    func avisarQueEmpezo() { sendEvent("alEmpezarCaptura", [:]) }
}
```

Lo que muestran estos dos archivos, y que pasó de verdad en Copiloto:

- **Mismo trabajo, dos caminos muy distintos.** La parte difícil (ver la oferta de otra app) se resuelve diferente en cada teléfono, y por eso **las funciones no coinciden del todo**:
  - En **Android**, la oferta se lee con un **servicio de accesibilidad** y se muestra en una **burbuja encima** de la app de viajes. Por eso el lado Kotlin tiene funciones propias como apagar el lector o saber si la burbuja está quieta, que en iPhone no existen.
  - En **iPhone**, Apple **no** deja dibujar sobre otra app, así que la oferta se lee de la **pantalla compartida** (*ReplayKit*) y su texto (*Vision*), y se muestra como **notificación**. Por eso el lado Swift tiene funciones propias de captura (empezar, parar) y **eventos**, que en Android no existen. Su función `puedeMostrarOferta` no devuelve un `false` fijo: devuelve si hay **permiso de notificaciones**.
- **TypeScript no necesita que coincidan.** Como viste en la Parte 3, las funciones que solo tiene un teléfono se marcan con `?` en el tipo (`empezarCaptura?`) y se llaman con `?.()`. Si ese teléfono no la tiene, la llamada simplemente no hace nada, en vez de romperse.
- **Valores por defecto con `?:` y `??`.** Si TypeScript no manda un mínimo, Kotlin usa `?:` y Swift `??`. El nativo **nunca confía** en que el mapa venga completo.
- **El hilo principal.** Las funciones del módulo **no** corren en el hilo de las pantallas. Todo lo que toca una pantalla del sistema se manda al hilo principal (`DispatchQueue.main` en Swift).
- **Las promesas se resuelven siempre.** Si una `AsyncFunction` nunca llama a `promise.resolve` (ni a `promise.reject`), el `await` de TypeScript **espera para siempre**.

> 🧩 **Piezas para este ejercicio**
> - En Kotlin, `mapa[clave]` puede dar `null`. `valor ?: respaldo` conserva un valor presente y usa el respaldo cuando falta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El lado Kotlin no confía en que llegue todo
lenguaje: kotlin
pide: TypeScript manda los mínimos como un `Map<String, Double>`, que puede venir incompleto. Completa `leerMinimos(mapa)`: arma `Minimos` usando lo que venga en el mapa, y si falta, los valores por defecto: `porKm` 1.2, `porHora` 35.0 y `nota` 4.5. Usa `?:`.
--- código
data class Minimos(val porKm: Double, val porHora: Double, val nota: Double)

fun leerMinimos(mapa: Map<String, Double>): Minimos = TODO()
--- pruebas
prueba("llega todo") { igual(leerMinimos(mapOf("porKm" to 1.5, "porHora" to 40.0, "nota" to 4.8)), Minimos(1.5, 40.0, 4.8)) }
prueba("llega a medias") { igual(leerMinimos(mapOf("porKm" to 2.0)), Minimos(2.0, 35.0, 4.5)) }
prueba("no llega nada") { igual(leerMinimos(emptyMap()), Minimos(1.2, 35.0, 4.5)) }
--- solución
data class Minimos(val porKm: Double, val porHora: Double, val nota: Double)

fun leerMinimos(mapa: Map<String, Double>): Minimos = Minimos(
    porKm = mapa["porKm"] ?: 1.2,
    porHora = mapa["porHora"] ?: 35.0,
    nota = mapa["nota"] ?: 4.5,
)
```

> 🧩 **Piezas para este ejercicio**
> - El sistema entrega la respuesta mediante una función que llama más tarde. Resuelve la promesa desde esa función, en el momento en que llega el booleano.

```ejercicio
titulo: La promesa que TypeScript está esperando
lenguaje: swift
pide: Así se ve una `AsyncFunction` por dentro. `sistema` pide un permiso y, cuando la persona contesta, llama a su función con `true` o `false`. Completa `pedirPermiso(_:sistema:)` para que **resuelva la promesa** con la respuesta. Si no la resuelves, el `await` de TypeScript queda esperando para siempre.
--- código
final class Promesa {
    var resultado: Bool? = nil
    var veces = 0
    func resolve(_ valor: Bool) {
        veces += 1
        if resultado == nil { resultado = valor }
    }
}

func pedirPermiso(_ promesa: Promesa, sistema: (@escaping (Bool) -> Void) -> Void) {
    // tu código aquí
}
--- pruebas
let dijoQueSi = Promesa()
pedirPermiso(dijoQueSi) { contestar in contestar(true) }
prueba("la persona dijo que sí") { igual(dijoQueSi.resultado, true) }
let dijoQueNo = Promesa()
pedirPermiso(dijoQueNo) { contestar in contestar(false) }
prueba("la persona dijo que no: también se resuelve") { igual(dijoQueNo.resultado, false) }
prueba("se resuelve una sola vez") { igual(dijoQueSi.veces, 1) }
--- solución
final class Promesa {
    var resultado: Bool? = nil
    var veces = 0
    func resolve(_ valor: Bool) {
        veces += 1
        if resultado == nil { resultado = valor }
    }
}

func pedirPermiso(_ promesa: Promesa, sistema: (@escaping (Bool) -> Void) -> Void) {
    sistema { ok in promesa.resolve(ok) }
}
```

```practica
vf :: El módulo de Android y el de iPhone comparten el nombre y la mayoría de las funciones, pero cada uno tiene algunas propias, porque cada teléfono resuelve la captura de otra manera
vf :: Si una AsyncFunction de Swift se olvida de llamar a promise.resolve, TypeScript recibe un error enseguida
elige :: ¿Por qué en iPhone Copiloto muestra la oferta como notificación y no como burbuja? :: Porque es más lindo :: Porque Apple no deja dibujar encima de otra app :: Porque Swift no sabe dibujar
escribe :: ¿Para qué sirve el ?: en el lado Kotlin del módulo? :: Para poner un valor por defecto cuando TypeScript no mandó ese dato: el nativo nunca confía en que el mapa llegue completo.
```

## Parte 5. Cuando la app está cerrada: el otro canal

> 🌎 **En la vida real:** el portero del edificio sigue trabajando de noche, cuando la oficina está cerrada. Para saber qué hacer, lee las instrucciones que la oficina le dejó en un cuaderno compartido.

> 🌎 **Otro ejemplo:** Es como dejarle una nota en el refrigerador a alguien que llega cuando tú ya no estás.

Hay un detalle de Copiloto que no se ve en el puente: la parte que lee la oferta **tiene que funcionar con la app cerrada**, mientras manejas con otra app abierta. Y con la app cerrada **no hay JavaScript corriendo**: nadie del lado TypeScript puede contestar.

- **En Android**, la lectura la hace un **servicio de accesibilidad** de Kotlin, que el sistema mantiene vivo por su cuenta. El módulo, cuando la app está abierta, **guarda** los mínimos en las preferencias del teléfono (`SharedPreferences`), y el servicio los **lee** de ahí.
- **En iPhone**, la pantalla compartida la recibe una **extensión**: un programa aparte, con su propia memoria. La app y la extensión comparten una carpeta (un **App Group**, con `UserDefaults(suiteName:)`): la extensión escribe ahí lo que leyó, y la app lo lee.

O sea que Copiloto usa **dos canales**: el **puente**, para hablar mientras la app está abierta, y un **almacén compartido**, para dejar instrucciones a lo que corre cuando la app está cerrada.

> 🧩 **Piezas para este ejercicio**
> - Distingue quién está ejecutando el código antes de mirar si la app está abierta. En el ejercicio, el servicio y la extensión pueden trabajar desde un proceso separado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Puente o almacén compartido?
lenguaje: js
pide: Completa `canal(quien, appAbierta)`. Si `quien` es `'pantalla'` (TypeScript) y la app está abierta, `'puente'`. Si es `'servicio'` (Android) o `'extension'` (iPhone), que corren aparte, siempre `'almacén compartido'`. Si es `'pantalla'` pero la app está cerrada, `'nadie: no hay JavaScript corriendo'`.
--- código
function canal(quien, appAbierta) {
  return 'puente'; // ✗ el servicio y la extensión no pasan por el puente
}
--- pruebas
prueba('la pantalla guarda los mínimos', () => igual(canal('pantalla', true), 'puente'));
prueba('el servicio de Android lee los mínimos', () => igual(canal('servicio', false), 'almacén compartido'));
prueba('la extensión de iPhone deja lo que leyó', () => igual(canal('extension', true), 'almacén compartido'));
prueba('con la app cerrada no hay JavaScript', () => igual(canal('pantalla', false), 'nadie: no hay JavaScript corriendo'));
--- solución
function canal(quien, appAbierta) {
  if (quien === 'servicio' || quien === 'extension') return 'almacén compartido';
  return appAbierta ? 'puente' : 'nadie: no hay JavaScript corriendo';
}
```

```practica
vf :: Con la app cerrada no hay JavaScript corriendo, así que lo que trabaja en ese momento no puede preguntarle nada a TypeScript
vf :: La extensión de iPhone que recibe la pantalla compartida comparte la memoria con la app
elige :: ¿Cómo sabe el servicio de Android qué mínimos usar con la app cerrada? :: Le pregunta a TypeScript :: Los lee de SharedPreferences, donde el módulo los guardó cuando la app estaba abierta :: Los adivina
escribe :: ¿Cuáles son los dos canales que usa Copiloto entre TypeScript y lo nativo? :: El puente (funciones, funciones asíncronas y eventos) mientras la app está abierta, y un almacén compartido (SharedPreferences en Android, App Group en iPhone) para lo que corre con la app cerrada.
```


**Comprobación antes de seguir**

Anota el dato que cruza el puente y el tipo de respuesta esperado en TypeScript, Kotlin y Swift.

<details>
<summary>Necesito una pista</summary>

Compara nombres, tipos y qué ocurre cuando falta un valor.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo conectas React Native con código nativo?":** "Con Expo Modules, que por debajo usa JSI. El módulo tiene un lado en Kotlin y otro en Swift con el mismo nombre; comparten la mayoría de las funciones, y cada uno tiene las suyas según lo que cada teléfono permite, que en el `index.ts` se marcan con `?` y se llaman con `?.()`. Hay tres maneras de hablar: `Function` para lo rápido, `AsyncFunction` con promesa para lo que espera a la persona, y eventos con `sendEvent` y `addListener` cuando el nativo avisa primero. Los datos se convierten al cruzar: `number` a `Double`, objetos a `Map` o diccionario. En mi app cargo el módulo con `requireOptionalNativeModule` la primera vez que se usa, con un respaldo en cada llamada, para que en Expo Go o con un error en el arranque la app no se caiga. Y lo que tiene que funcionar con la app cerrada, como un servicio de accesibilidad o una extensión de iPhone, no usa el puente: lee un almacén compartido."

> 🌎 **En la vida real:** es como explicar cómo funciona la ventanilla de una embajada: qué trámites hay, cuánto tardan y qué pasa cuando la oficina está cerrada.

> 🌎 **Otro ejemplo:** Es como un intérprete que explica no solo las palabras, sino las reglas de la conversación.
