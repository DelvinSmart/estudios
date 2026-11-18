# Arquitectura de software

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** es la clase más **teórica** del curso, y una de las que más te van a preguntar en entrevistas. De 2 a 3 horas, en dos días: partes 1 a 4 el primero, 5 a 9 el segundo. Lee despacio y en voz alta.

**Lo que necesitas saber antes:** Temas 01 a 09. Los ejemplos salen de ahí.

## 1. ¿Por qué importa la arquitectura?

> 🎙️ **El profesor:** {{alumno}}, ya sabes leer código, probarlo, guardarlo, leer errores, hacer páginas y un servidor. Ahora subimos un piso: no "qué hace una línea", sino **cómo se organiza un programa entero**. Eso es la **arquitectura**: en qué partes se divide el código, qué hace cada parte y **quién puede hablar con quién**.

¿Por qué importa? Porque un programa se puede escribir de cualquier forma… y funciona. **Hasta el día que quieres cambiar algo.**

> 🌎 **En la vida real:** una casa se puede construir de cualquier forma, pero si los cables eléctricos pasan por dentro de las cañerías, el día que quieres cambiar una llave terminas rompiendo una pared.

Una buena arquitectura logra cuatro cosas:

| Objetivo | Qué significa | 🌎 En un supermercado |
|---|---|---|
| **Cambiar sin miedo** | Cambias la base de datos y las pantallas no se enteran | Cambias de proveedor de leche y la góndola sigue igual |
| **Probar fácil** | Las reglas se prueban solas, sin teléfono ni internet | Revisas la balanza sin abrir al público |
| **Entender rápido** | Una persona nueva sabe dónde buscar cada cosa | Los lácteos siempre en la heladera del fondo |
| **Trabajar en equipo** | Dos personas cambian partes distintas sin pisarse | Cada repositor en su pasillo |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿A quién afecta un cambio?
lenguaje: js
pide: Con buena arquitectura, cambiar una parte toca a pocas otras. `IMPORTA` dice qué archivos importa cada archivo. Completa `afectados(archivo)`: devuelve, en orden alfabético, los archivos que importan **directamente** a `archivo`.
--- código
const IMPORTA = {
  'Inicio.tsx': ['dinero.ts', 'combustible.ts'],
  'Finanzas.tsx': ['dinero.ts'],
  'combustible.ts': [],
  'dinero.ts': [],
  'ServicioCaja.ts': ['RepositorioCaja.ts'],
};

function afectados(archivo) {
  // tu código aquí
}
--- pruebas
prueba('dinero.ts lo usan dos pantallas', () => igual(afectados('dinero.ts'), ['Finanzas.tsx', 'Inicio.tsx']));
prueba('combustible.ts, una', () => igual(afectados('combustible.ts'), ['Inicio.tsx']));
prueba('una pantalla no la importa nadie', () => igual(afectados('Inicio.tsx'), []));
--- solución
const IMPORTA = {
  'Inicio.tsx': ['dinero.ts', 'combustible.ts'],
  'Finanzas.tsx': ['dinero.ts'],
  'combustible.ts': [],
  'dinero.ts': [],
  'ServicioCaja.ts': ['RepositorioCaja.ts'],
};

function afectados(archivo) {
  return Object.keys(IMPORTA).filter((a) => IMPORTA[a].includes(archivo)).sort();
}
```

```practica
escribe :: Con tus palabras: ¿qué es la arquitectura de un programa? :: La forma de organizar el código: en qué partes se divide, qué hace cada una y quién puede hablar con quién.
elige :: ¿Cuál NO es un objetivo de una buena arquitectura? :: Cambiar sin miedo :: Probar fácil :: Escribir más archivos :: Entender rápido
vf :: Una buena arquitectura permite cambiar una parte sin romper las demás
```

> 🔁 **Repaso:** arquitectura = cómo se organiza el código. Sirve para cambiar sin miedo, probar fácil, entender rápido y trabajar en equipo.

## 2. La idea base: separar responsabilidades

> 🎙️ **El profesor:** todas las arquitecturas que vamos a ver, por distintas que parezcan, parten de **una sola idea**. Si te llevas esta, te llevas la mitad de la clase.

Casi todas dividen el código en **tres responsabilidades**:

| Responsabilidad | Qué hace | En Copiloto | 🌎 En un restaurante |
|---|---|---|---|
| **Presentación** (UI) | Lo que se ve y se toca | `screens/`, `components/` | El **salón**: mesas, mozos, la carta |
| **Reglas de negocio** (dominio) | Las reglas del mundo real, sin pantalla ni base de datos | `utils/` (¿es acumulativo?, ¿cuánto combustible queda?) | Las **recetas** |
| **Datos** (infraestructura) | Guardar y leer: Firestore, el teléfono, internet | `services/` | La **despensa** y los proveedores |

**La regla de oro:** las reglas de negocio **no deben saber** si los datos están en Firestore o en el teléfono, ni cómo es la pantalla. Así puedes cambiar cualquiera de las dos **sin tocar las reglas**.

> 🌎 **En la vida real:** la receta dice "200 g de carne", no "200 g de carne del frigorífico Pérez, de la cámara del fondo". Si cambias de proveedor o de heladera, la receta no se toca.

Ya lo viviste: `isImmutableEarningPlatform` (Tema 01) no sabe nada de Firestore ni de botones. Por eso se pudo probar en milisegundos (Tema 02). **Eso** es separar responsabilidades.

> ✋ **Para y piensa:** `fuelLevel.ts` calcula cuánto combustible queda. ¿Debería importar algo de Firestore?

<details>
<summary>Ver la respuesta</summary>

**No.** Es una regla de negocio: recibe los datos y calcula. De dónde salen los datos es problema de otra capa. Si importara Firestore, no se podría probar sin internet.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Presentación, reglas o datos
lenguaje: js
pide: Completa `responsabilidad(ruta)` mirando la carpeta: `screens/` o `components/` → `'presentación'`; `utils/` o `servicio/` → `'reglas'`; `services/` o `repositorio/` → `'datos'`.
--- código
function responsabilidad(ruta) {
  // tu código aquí
}
--- pruebas
prueba('una pantalla', () => igual(responsabilidad('src/screens/onboarding/VehicleSetupScreen.tsx'), 'presentación'));
prueba('una pieza', () => igual(responsabilidad('src/components/vehicles/VehicleFuelGauge.tsx'), 'presentación'));
prueba('un cálculo', () => igual(responsabilidad('src/utils/combustible.ts'), 'reglas'));
prueba('el servicio de la caja', () => igual(responsabilidad('src/caja/servicio/ServicioCaja.ts'), 'reglas'));
prueba('la nube', () => igual(responsabilidad('src/services/cloud/earningsCloudStorage.ts'), 'datos'));
prueba('el repositorio', () => igual(responsabilidad('src/caja/repositorio/RepositorioEnMemoria.ts'), 'datos'));
--- solución
function responsabilidad(ruta) {
  if (ruta.includes('/screens/') || ruta.includes('/components/')) return 'presentación';
  if (ruta.includes('/utils/') || ruta.includes('/servicio/')) return 'reglas';
  if (ruta.includes('/services/') || ruta.includes('/repositorio/')) return 'datos';
  return null;
}
```

```practica
elige :: ¿En qué responsabilidad va una pantalla? :: Reglas de negocio :: Presentación :: Datos
elige :: ¿En qué responsabilidad va "¿este ingreso es acumulativo?"? :: Presentación :: Reglas de negocio :: Datos
elige :: ¿En qué responsabilidad va guardar en Firestore? :: Presentación :: Reglas de negocio :: Datos
vf :: Las reglas de negocio deberían saber si los datos están en Firestore
escribe :: Explica la regla de oro de separar responsabilidades. :: Las reglas de negocio no deben saber dónde se guardan los datos ni cómo es la pantalla; así se puede cambiar cualquiera de esas dos sin tocar las reglas.
```

> 🔁 **Repaso:** presentación (lo que se ve), reglas (el negocio), datos (guardar y leer). Las reglas no conocen ni la pantalla ni la base de datos.

## 3. Clean Architecture (Arquitectura Limpia)

> 🎙️ **El profesor:** ahora la más famosa, la que más vas a oír: **Clean Architecture**. La propuso **Robert C. Martin** (le dicen "Uncle Bob", el tío Bob) en 2012. Se dibuja como círculos, uno dentro del otro.

> 🌎 **En la vida real:** Es como una cebolla: las capas de afuera se pelan y se cambian; el corazón queda igual.

> 🌎 **Otro ejemplo:** Es como un país: la constitución (el centro) casi no cambia; las leyes, los ministerios y los edificios (afuera) cambian más seguido.

```text
┌──────────────────────────────────────────────┐
│  Frameworks y drivers                        │  ← Firestore, React Native, Expo, la web
│  ┌────────────────────────────────────────┐  │
│  │  Adaptadores de interfaz               │  │  ← pantallas, controladores, repositorios
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Casos de uso                    │  │  │  ← "registrar un ingreso", "pagar la ronda del San"
│  │  │  ┌────────────────────────────┐  │  │  │
│  │  │  │  Entidades                 │  │  │  │  ← Ingreso, Vehículo, Grupo del San, sus reglas
│  │  │  └────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Las cuatro capas, de adentro hacia afuera

> 🌎 **Otro ejemplo:** En un banco: qué es una cuenta (entidad), abrir una cuenta o transferir (caso de uso), el cajero y la app (adaptadores), y el sistema de computadoras que usen (framework).

| Capa | Qué contiene | Ejemplo en Copiloto | 🌎 En una panadería |
|---|---|---|---|
| **Entidades** (centro) | Los objetos del negocio y sus reglas más básicas | Un `EarningRecord` (un ingreso), un `SanGroup` | Qué **es** un pan: harina, agua, sal |
| **Casos de uso** | Lo que la app **hace**: una acción completa | "Registrar un ingreso": decide si es acumulativo, calcula y guarda | "Hornear una tanda", "vender una docena" |
| **Adaptadores** | Traducen entre el centro y el mundo de afuera | Las pantallas, el `SanController`, los repositorios | El **mostrador** y el **cajero** |
| **Frameworks** (afuera) | Las herramientas concretas | Firestore, React Native, Expo | El **horno** de marca X |

Lo de **afuera cambia seguido** (cambias de diseño, de base de datos, de librería). Lo del **centro casi nunca** (un ingreso sigue siendo un ingreso).

### La regla de la dependencia

> 🌎 **En la vida real:** Es como en una empresa: el dueño fija las reglas y los empleados las siguen; nunca al revés.

> 🌎 **Otro ejemplo:** Es como un enchufe en la pared: el aparato depende del enchufe, pero el enchufe no sabe qué aparato le pusiste.

Esta es **la** regla de Clean Architecture. Apréndela de memoria:

> **El código solo puede depender hacia adentro.**

- Las pantallas (afuera) **pueden** usar los casos de uso (adentro).
- Los casos de uso **nunca** pueden importar una pantalla ni Firestore.

"Depender" quiere decir "importar" o "usar". Las flechas de los `import` **solo apuntan hacia el centro**.

### ¿Y cómo guarda datos el centro, si no puede conocer Firestore?

Con una **interfaz**: un **contrato** que dice **qué** se puede hacer, sin decir **cómo**. El de **adentro** define el contrato ("necesito guardar y buscar grupos"); el de **afuera** lo cumple ("yo lo hago con Firestore"). Esto se llama **inversión de dependencias**.

> 🌎 **En la vida real:** el cirujano no necesita saber qué marca de bisturí compró el hospital. Dice: "necesito **un bisturí** de tal tamaño" (el contrato). La administración consigue uno que cumpla. Si cambian de proveedor, el cirujano opera igual. El de adentro dice **qué** necesita; el de afuera se encarga del **cómo**.

> 🌎 **Otro ejemplo:** Como pedir "un taxi" por una app: tú dices qué necesitas (ir del punto A al B) y no te importa qué modelo de carro llegue, mientras cumpla.

> ✋ **Para y piensa:** un caso de uso necesita la fecha de hoy. ¿Debería llamar directamente al reloj del teléfono?

<details>
<summary>Ver la respuesta</summary>

Lo más limpio es que **reciba** la fecha (o un "reloj" por contrato) desde afuera. Así, en una prueba, le pasas la fecha que quieras (como el caso del San del 1 de enero en el Tema 02). Es inversión de dependencias aplicada al tiempo.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El guardián de la regla de la dependencia
lenguaje: js
pide: En Clean Architecture los `import` solo apuntan **hacia adentro**. Las capas, de adentro hacia afuera, están en `CAPAS`. Completa `violaciones(imports)`: cada import es `{ desde, hacia }` (nombres de capa). Devuelve los que apuntan **hacia afuera**, como textos `'desde → hacia'`.
--- código
const CAPAS = ['entidades', 'casos de uso', 'adaptadores', 'frameworks'];

function violaciones(imports) {
  // tu código aquí
}
--- pruebas
prueba('todo hacia adentro: nada', () => igual(violaciones([{ desde: 'adaptadores', hacia: 'casos de uso' }, { desde: 'casos de uso', hacia: 'entidades' }]), []));
prueba('un caso de uso que importa Firestore', () => igual(violaciones([{ desde: 'casos de uso', hacia: 'frameworks' }]), ['casos de uso → frameworks']));
prueba('importar de la misma capa está bien', () => igual(violaciones([{ desde: 'entidades', hacia: 'entidades' }]), []));
--- solución
const CAPAS = ['entidades', 'casos de uso', 'adaptadores', 'frameworks'];

function violaciones(imports) {
  return imports
    .filter((i) => CAPAS.indexOf(i.hacia) > CAPAS.indexOf(i.desde))
    .map((i) => `${i.desde} → ${i.hacia}`);
}
```

```practica
elige :: ¿Qué hay en el centro de Clean Architecture? :: Firestore :: Las pantallas :: Las entidades (los objetos del negocio)
elige :: ¿Quién propuso Clean Architecture? :: Alistair Cockburn :: Robert C. Martin (Uncle Bob) :: Google
elige :: Según la regla de la dependencia, ¿hacia dónde pueden apuntar los imports? :: Hacia afuera :: Solo hacia adentro :: Para cualquier lado
elige :: ¿Qué es un caso de uso? :: Una pantalla :: Una acción completa que hace la app, como "registrar un ingreso" :: Una base de datos
vf :: Un caso de uso puede importar Firestore directamente
escribe :: ¿Qué es la inversión de dependencias? :: Que el código de adentro define un contrato (interfaz) con lo que necesita, y el de afuera lo cumple; así el centro no depende de herramientas concretas.
```

> 🔁 **Repaso:** entidades → casos de uso → adaptadores → frameworks. Las dependencias solo apuntan hacia adentro; el centro usa contratos (interfaces) y afuera se cumplen: inversión de dependencias.

## 4. El ejemplo real de Copiloto: el módulo del San

> 🎙️ **El profesor:** basta de teoría. La app Copiloto tiene un módulo hecho **exactamente así**: el San. Si entiendes este ejemplo, puedes explicar Clean Architecture en una entrevista con **tu propio código**, y eso vale oro.

```text
src/san/
  models/          ← las entidades: cómo es un grupo, un pedido de ingreso
  service/         ← las reglas y casos de uso: pagos, ciclos, caja, invitaciones
  repository/      ← cómo se guardan los datos (el contrato y sus implementaciones)
  controller/      ← conecta las pantallas con los servicios
  events/          ← avisa cuando algo cambia
  notifications/   ← los avisos del San
```

> 🌎 **En la vida real:** una cooperativa bien organizada: los **estatutos** (models), la **tesorería** (service), el **archivo** (repository), la **recepción** (controller), el **altavoz** (events) y los **avisos al celular** (notifications).

> 🌎 **Otro ejemplo:** Como un club deportivo bien organizado: reglamento, tesorería, archivo, secretaría, megáfono y avisos al celular de los socios.

### El contrato

> 🌎 **En la vida real:** Es como el contrato de un plomero: "tiene que arreglar fugas y cambiar caños". No dice qué marca de llave usa.

> 🌎 **Otro ejemplo:** Es como el tamaño estándar de una bombilla: cualquier marca que cumpla ese tamaño entra en tu lámpara.

En `src/san/repository/SanRepository.ts` (los comentarios del código están en portugués):

```ts
/**
 * Contrato de persistência SAN.
 * Services e Controllers dependem apenas desta interface.
 */
export interface SanRepository {
  loadStore(userId: string): Promise<GrupoSanStore>;
  saveStore(userId: string, store: GrupoSanStore): Promise<void>;
  getGroupById(groupId: string): Promise<SanGroup | null>;
  deleteGroup(groupId: string): Promise<void>;
  // ...
}
```

- El comentario dice: "**Contrato de guardado del San. Los servicios y controladores dependen solo de esta interfaz.**"
- **`interface`** define el contrato: "cualquier repositorio del San tiene que saber cargar, guardar, buscar y borrar".
- Dice **qué**, no **cómo**. **No menciona Firestore.**
- `Promise<...>` = la respuesta llega **después** (Tema 17): guardar en internet tarda.
- `SanGroup | null` = "un grupo, o nada si no existe" (Tema 01).

### Tres formas de cumplir el mismo contrato

> 🌎 **Otro ejemplo:** Como tres formas de guardar plata: en el banco (Firestore), en una alcancía en casa (teléfono), o en el bolsillo durante el día (memoria).

| Archivo | Dónde guarda | Para qué | 🌎 El archivista |
|---|---|---|---|
| `FirestoreSanRepository.ts` | En Firestore (la nube) | La app real | Guarda en el archivo del banco |
| `AsyncStorageSanRepository.ts` | En el teléfono | Sin internet | Guarda en un cajón de tu casa |
| `InMemorySanRepository.ts` | En la memoria (se borra al cerrar) | **Pruebas**: sin internet, rapidísimo, empieza limpio | Anota en un papelito que se tira al final del día |

Los tres cumplen **el mismo contrato**. Al servicio del San le da igual cuál le toque.

### La fábrica que elige

En `SanRepositoryFactory.ts`:

```ts
/**
 * Factory central — único ponto que conhece implementações concretas.
 */
export function createSanRepository(provider) {
  switch (provider) {
    case 'in-memory':      return inMemorySanRepository;
    case 'async-storage':  return asyncStorageSanRepository;
    case 'firestore':
    default:               return firestoreSanRepository;
  }
}
```

- El comentario dice: "**Fábrica central: el único punto que conoce las implementaciones concretas.**"
- `switch` es como varios `if` seguidos: "según el `provider`, devuelve este o este o este". `default` es "si no es ninguno de los anteriores".
- Es el **único lugar** que sabe que existe Firestore.

> 🌎 **En la vida real:** la **agencia de empleo**: la tesorería dice "mándenme un archivista", y la agencia, la única que conoce a los tres, elige cuál manda.

> 🌎 **Otro ejemplo:** Como la central de una cadena de pizzerías: tú llamas a un solo número, y la central decide qué local te manda la pizza.

**El beneficio:** si mañana quisieras cambiar Firestore por otra base de datos, escribirías un `OtraBaseSanRepository` que cumpla el contrato y cambiarías **una línea** en la fábrica. Las reglas del San, las pantallas y las pruebas **no se tocan**. Es exactamente el ejercicio 5 del Tema 09.

> ✋ **Para y piensa:** ¿por qué el `InMemorySanRepository` es perfecto para las pruebas?

<details>
<summary>Ver la respuesta</summary>

Porque las pruebas corren **sin internet ni Firebase**, en **milisegundos**, y cada una **empieza limpia** (la memoria se borra). No tocas datos reales.

</details>

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El repositorio en memoria de la caja
lenguaje: js
pide: Como en `src/caja/` de Gastos del carro: `ServicioCaja` no sabe dónde se guardan los datos, recibe un repositorio. Completa la clase `RepositorioEnMemoria` con `buscar(id)` (la caja o `null`), `guardar(caja)` y `listar()`. Guarda **copias**, para que nadie cambie los datos guardados desde afuera.
--- código
class RepositorioEnMemoria {
  #cajas = new Map();

  async buscar(id) {
    // tu código aquí
  }

  async guardar(caja) {
    // tu código aquí
  }

  async listar() {
    // tu código aquí
  }
}

class ServicioCaja {
  constructor(repositorio) { this.repositorio = repositorio; }
  async crear(id, nombre, cuota, miembros) {
    if (!(cuota > 0)) throw new Error('La cuota tiene que ser mayor que 0');
    const caja = { id, nombre, cuota, miembros: [...miembros], pagos: [] };
    await this.repositorio.guardar(caja);
    return caja;
  }
}
--- pruebas
prueba('crear y buscar', async () => { const r = new RepositorioEnMemoria(); await new ServicioCaja(r).crear('c1', 'Familia', 100, ['Ana', 'Beto']); igual((await r.buscar('c1')).nombre, 'Familia'); });
prueba('buscar una que no existe', async () => igual(await new RepositorioEnMemoria().buscar('x'), null));
prueba('listar', async () => { const r = new RepositorioEnMemoria(); const s = new ServicioCaja(r); await s.crear('a', 'A', 1, ['x', 'y']); await s.crear('b', 'B', 1, ['x', 'y']); igual((await r.listar()).map((c) => c.id), ['a', 'b']); });
prueba('guarda copias', async () => { const r = new RepositorioEnMemoria(); const caja = await new ServicioCaja(r).crear('c1', 'Familia', 100, ['Ana', 'Beto']); caja.nombre = 'cambiado afuera'; igual((await r.buscar('c1')).nombre, 'Familia'); });
--- solución
class RepositorioEnMemoria {
  #cajas = new Map();

  async buscar(id) {
    const caja = this.#cajas.get(id);
    return caja ? structuredClone(caja) : null;
  }

  async guardar(caja) {
    this.#cajas.set(caja.id, structuredClone(caja));
  }

  async listar() {
    return [...this.#cajas.values()].map((c) => structuredClone(c));
  }
}

class ServicioCaja {
  constructor(repositorio) { this.repositorio = repositorio; }
  async crear(id, nombre, cuota, miembros) {
    if (!(cuota > 0)) throw new Error('La cuota tiene que ser mayor que 0');
    const caja = { id, nombre, cuota, miembros: [...miembros], pagos: [] };
    await this.repositorio.guardar(caja);
    return caja;
  }
}
```

```practica
elige :: ¿Qué es `SanRepository`? :: Una pantalla :: El contrato (interfaz) para guardar los datos del San :: Una base de datos
elige :: ¿Cuántas implementaciones del contrato hay? :: 1 :: 2 :: 3
elige :: ¿Cuál usa la app real? :: InMemory :: AsyncStorage :: Firestore
elige :: ¿Qué archivo es el único que conoce a las tres implementaciones? :: `SanService.ts` :: `SanRepositoryFactory.ts` :: `SanController.ts`
vf :: Para cambiar de base de datos, habría que reescribir todas las reglas del San
escribe :: Explica con tu San cómo se aplica la inversión de dependencias. :: Los servicios del San dependen solo del contrato SanRepository; Firestore, AsyncStorage e InMemory lo cumplen; y una fábrica elige cuál usar. Así las reglas no conocen Firestore.
```

> 🔁 **Repaso:** el San tiene un contrato (`SanRepository`), tres implementaciones (Firestore, teléfono, memoria) y una fábrica que elige. Las reglas no saben cuál les tocó.

## 5. Arquitectura hexagonal (puertos y adaptadores)

> 🎙️ **El profesor:** ahora otro nombre que vas a oír mucho: **hexagonal**. Te adelanto: es **la misma idea** que Clean, con otro dibujo. La propuso **Alistair Cockburn** en 2005.

El centro es un **hexágono** con las reglas, y alrededor se **enchufan** las cosas de afuera:

```text
          [Pantalla]   [Copiloto]   [Panel]          ← adaptadores que ENTRAN
                \          |          /
              (puerto)  (puerto)  (puerto)
                 ┌────────────────────┐
                 │                    │
                 │  REGLAS DEL NEGOCIO│
                 │                    │
                 └────────────────────┘
              (puerto)            (puerto)
                /                      \
         [Firestore]              [Teléfono]          ← adaptadores que SALEN
```

| Palabra | Qué es | En tu San |
|---|---|---|
| **Puerto** | Un contrato: cómo se habla con el centro | `SanRepository` (la interfaz) |
| **Adaptador** | Algo concreto que se enchufa a un puerto | `FirestoreSanRepository`, `InMemorySanRepository` |
| **Adaptador de entrada** | Quien **le pide** cosas al centro | Las pantallas, el `SanController` |
| **Adaptador de salida** | A quien el centro **le pide** cosas | La base de datos, los avisos |

> 🌎 **En la vida real:** un **televisor**. Por detrás tiene **puertos** (HDMI, USB). El televisor no sabe si en el HDMI enchufaste una PlayStation o un decodificador: solo habla "HDMI". El **control remoto** es un adaptador de entrada (le pides cosas); los **parlantes**, uno de salida (el televisor les manda el sonido).

> 🌎 **Otro ejemplo:** Como un cargador universal con puntas intercambiables: el cargador es el mismo, cambias la punta según el teléfono.

**¿Clean o hexagonal?** En la práctica, casi la misma cosa: las dos separan las reglas de las herramientas y usan contratos. **Clean** divide el centro en más capas (entidades y casos de uso); **hexagonal** pone el foco en los puertos y adaptadores (los enchufes).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un puerto y dos adaptadores
lenguaje: js
pide: El centro de la app avisa "pagaste" a través de un **puerto**: cualquier objeto con un método `enviar(texto)`. Escribe dos **adaptadores**: `crearAvisoEnMemoria()` (guarda los textos en una lista `enviados`) y `crearAvisoMayusculas(otro)` (pasa el texto en MAYÚSCULAS a otro adaptador). El centro (`registrarPago`) no se toca.
--- código
function registrarPago(nombre, monto, aviso) {
  aviso.enviar(`${nombre} pagó ${monto}`);
}

function crearAvisoEnMemoria() {
  // tu código aquí
}

function crearAvisoMayusculas(otro) {
  // tu código aquí
}
--- pruebas
prueba('en memoria', () => { const a = crearAvisoEnMemoria(); registrarPago('Ana', 100, a); igual(a.enviados, ['Ana pagó 100']); });
prueba('en mayúsculas, enchufado al de memoria', () => { const m = crearAvisoEnMemoria(); registrarPago('Ana', 100, crearAvisoMayusculas(m)); igual(m.enviados, ['ANA PAGÓ 100']); });
--- solución
function registrarPago(nombre, monto, aviso) {
  aviso.enviar(`${nombre} pagó ${monto}`);
}

function crearAvisoEnMemoria() {
  const enviados = [];
  return { enviados, enviar: (texto) => enviados.push(texto) };
}

function crearAvisoMayusculas(otro) {
  return { enviar: (texto) => otro.enviar(texto.toUpperCase()) };
}
```

```practica
elige :: En la arquitectura hexagonal, ¿qué es un puerto? :: Una pantalla :: Un contrato para hablar con el centro :: Un número de red
elige :: ¿Qué es un adaptador? :: El centro :: Algo concreto que se enchufa a un puerto :: Una prueba
elige :: Las pantallas, ¿qué tipo de adaptador son? :: De entrada :: De salida :: No son adaptadores
elige :: ¿Quién propuso la arquitectura hexagonal? :: Robert C. Martin :: Alistair Cockburn :: Linus Torvalds
vf :: Clean Architecture y hexagonal son ideas muy parecidas
escribe :: ¿En qué se parecen y en qué se diferencian Clean y hexagonal? :: Las dos separan las reglas de las herramientas y usan contratos; Clean divide el centro en más capas (entidades y casos de uso) y hexagonal pone el foco en puertos y adaptadores.
```

> 🔁 **Repaso:** hexagonal = reglas en el centro, **puertos** (contratos) y **adaptadores** (enchufes) de entrada y salida. Casi lo mismo que Clean.

## 6. MVC (Modelo, Vista, Controlador)

> 🎙️ **El profesor:** ahora dos arquitecturas más "de pantalla". La primera es antigua (de los años 70) y muy usada en servidores web: **MVC**.

| Parte | Qué hace | En tu San | 🌎 En el restaurante |
|---|---|---|---|
| **Modelo** | Los datos y sus reglas | `models/` y `service/` | La **cocina** |
| **Vista** | Lo que se ve | Las pantallas del San | La **mesa y el plato** |
| **Controlador** | Recibe lo que hace la persona, llama al modelo y le dice a la vista qué mostrar | `SanController.ts` | El **mozo** |

**El camino:** tocas "Ya pagué" (**vista**) → el **controlador** recibe el toque → le pide al servicio que registre el pago (**modelo**) → la **vista** se actualiza.

> 🌎 **En la vida real:** le haces una seña al mozo (tocas "Ya pagué"); el mozo va a la cocina ("registren el pago de Juan"); la cocina lo anota; el mozo vuelve y te muestra la cuenta actualizada.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: MVC: el botón "Ya pagué"
lenguaje: js
pide: La **vista** recibe el toque y llama al **controlador**; el controlador le pide al **modelo** que cambie y después le dice a la vista qué mostrar. Completa `crearControlador(modelo, vista)` con `yaPague(nombre)`: llama a `modelo.pagar(nombre)`; si sale bien, `vista.mostrar('✓ ' + nombre + ' pagó')`; si el modelo lanza un error, `vista.mostrar('✗ ' + mensaje)`.
--- código
function crearModelo(miembros) {
  const pagaron = new Set();
  return {
    pagar(nombre) {
      if (!miembros.includes(nombre)) throw new Error(`${nombre} no es parte de la caja`);
      pagaron.add(nombre);
    },
    pagaron: () => [...pagaron],
  };
}

function crearControlador(modelo, vista) {
  return {
    yaPague(nombre) {
      // tu código aquí
    },
  };
}
--- pruebas
const crearVista = () => ({ ultimo: '', mostrar(t) { this.ultimo = t; } });
prueba('pago bien', () => { const m = crearModelo(['Ana']); const v = crearVista(); crearControlador(m, v).yaPague('Ana'); igual([v.ultimo, m.pagaron()], ['✓ Ana pagó', ['Ana']]); });
prueba('alguien de afuera', () => { const m = crearModelo(['Ana']); const v = crearVista(); crearControlador(m, v).yaPague('Zé'); igual(v.ultimo, '✗ Zé no es parte de la caja'); });
--- solución
function crearModelo(miembros) {
  const pagaron = new Set();
  return {
    pagar(nombre) {
      if (!miembros.includes(nombre)) throw new Error(`${nombre} no es parte de la caja`);
      pagaron.add(nombre);
    },
    pagaron: () => [...pagaron],
  };
}

function crearControlador(modelo, vista) {
  return {
    yaPague(nombre) {
      try {
        modelo.pagar(nombre);
        vista.mostrar(`✓ ${nombre} pagó`);
      } catch (e) {
        vista.mostrar(`✗ ${e.message}`);
      }
    },
  };
}
```

```practica
elige :: En MVC, ¿quién recibe lo que hace la persona y llama al modelo? :: La vista :: El controlador :: El modelo
elige :: En MVC, ¿qué es la vista? :: Las reglas :: Lo que se ve :: La base de datos
vf :: En el San, `SanController.ts` cumple el papel de controlador
escribe :: Cuenta el camino de "Ya pagué" en MVC. :: La vista recibe el toque, el controlador lo recibe y le pide al modelo (el servicio) que registre el pago, y después la vista se actualiza.
```

> 🔁 **Repaso:** MVC = modelo (datos y reglas), vista (lo que se ve), controlador (el mozo que conecta).

## 7. MVVM (Modelo, Vista, Modelo de vista)

> 🎙️ **El profesor:** la segunda "de pantalla" es la más común en **apps móviles** y encaja muy bien con React: **MVVM**.

| Parte | Qué hace | En Copiloto | 🌎 En el carro |
|---|---|---|---|
| **Modelo** | Los datos y las reglas | `utils/`, `services/` | El **motor y los sensores** |
| **Vista** | **Solo dibuja** | Los componentes (`components/`) | Las **agujas** del tablero |
| **Modelo de vista** (*ViewModel*) | Prepara los datos para la vista y recibe sus acciones; la vista se actualiza sola cuando cambia | Los **hooks** y **contextos** (`useVehicleFuelLevel`, `EarningsContext`) | La **computadora** del tablero |

**Ejemplo real:** el hook `useVehicleFuelLevel` (en `src/hooks/`) junta los abastecimientos y el kilometraje, calcula el nivel del tanque y se lo entrega **listo** a la barra de combustible. La barra (`VehicleFuelGauge`) **solo dibuja** lo que recibe: no calcula nada.

Un **hook** (en React) es una función que empieza con `use…` y le da a un componente datos que se actualizan solos.

> 🌎 **En la vida real:** la aguja del tablero solo se mueve a donde le dicen; la computadora lee los sensores, hace las cuentas ("con estos litros te quedan 120 km") y le pasa a la aguja el número listo.

**¿MVC o MVVM?** La diferencia: en MVVM la vista **se actualiza sola** cuando cambia el modelo de vista (está "conectada"); en MVC el controlador le **dice** a la vista qué mostrar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: MVVM: la vista solo dibuja
lenguaje: js
pide: En MVVM, el **modelo de vista** hace las cuentas y la vista solo dibuja. Completa `modeloDeVista(vehiculo)`: devuelve `{ porcentaje, texto, alerta }`, donde `porcentaje` es `litros / capacidad` en número entero de 0 a 100, `texto` es `'45 %'`, y `alerta` es `true` si queda menos del 15 %. Si la capacidad es `null`, devuelve `{ porcentaje: 0, texto: 'Falta la capacidad', alerta: false }`.
--- código
function modeloDeVista(vehiculo) {
  // tu código aquí
}

// La vista: no calcula nada, solo usa lo que recibe.
function vistaTanque(mv) {
  return `${mv.alerta ? '⚠ ' : ''}${mv.texto}`;
}
--- pruebas
prueba('medio tanque', () => igual(modeloDeVista({ litros: 22.5, capacidad: 50 }), { porcentaje: 45, texto: '45 %', alerta: false }));
prueba('casi vacío: alerta', () => igual(vistaTanque(modeloDeVista({ litros: 5, capacidad: 50 })), '⚠ 10 %'));
prueba('sin capacidad', () => igual(modeloDeVista({ litros: 5, capacidad: null }).texto, 'Falta la capacidad'));
prueba('nunca más de 100', () => igual(modeloDeVista({ litros: 60, capacidad: 50 }).porcentaje, 100));
--- solución
function modeloDeVista(vehiculo) {
  if (vehiculo.capacidad === null) return { porcentaje: 0, texto: 'Falta la capacidad', alerta: false };
  const porcentaje = Math.min(100, Math.max(0, Math.round((vehiculo.litros / vehiculo.capacidad) * 100)));
  return { porcentaje, texto: `${porcentaje} %`, alerta: porcentaje < 15 };
}

// La vista: no calcula nada, solo usa lo que recibe.
function vistaTanque(mv) {
  return `${mv.alerta ? '⚠ ' : ''}${mv.texto}`;
}
```

```practica
elige :: En Copiloto, ¿qué cumple el papel de modelo de vista? :: Las pantallas :: Los hooks y contextos, como `useVehicleFuelLevel` :: Firestore
elige :: ¿Qué hace `VehicleFuelGauge`? :: Calcula el nivel del tanque :: Solo dibuja lo que recibe :: Guarda en Firestore
vf :: En MVVM, la vista hace los cálculos
vf :: MVVM es muy común en apps móviles
escribe :: ¿Qué diferencia hay entre MVC y MVVM? :: En MVC el controlador le dice a la vista qué mostrar; en MVVM la vista está conectada al modelo de vista y se actualiza sola cuando cambia.
```

> 🔁 **Repaso:** MVVM = modelo, vista (solo dibuja) y modelo de vista (hooks y contextos que preparan los datos). La vista se actualiza sola.

## 8. ¿Qué arquitectura usa la app Copiloto?

> 🎙️ **El profesor:** pregunta segura en una entrevista: "¿qué arquitectura usa la app Copiloto?". La respuesta honesta, y la que más impresiona, es: **"una mezcla, y te explico por qué"**. Como la mayoría de las apps reales.

| Parte de la app | Se parece a |
|---|---|
| El módulo del San | **Clean Architecture / hexagonal**: contrato, implementaciones intercambiables, servicios y controlador |
| Las pantallas con hooks y contextos | **MVVM** |
| Las reglas en `utils/` | El **centro** de Clean Architecture: reglas puras, probadas sin pantalla |
| El Copiloto (`ai-engine/`) | **Módulos registrados** (`ModuleRegistry`): cada parte de la app se "enchufa" al Copiloto |
| Cloud Functions | Un **servidor** separado, con sus propias reglas |

**Lo que está bien:** las reglas importantes (dinero, fechas, combustible, San) están separadas y probadas.

**Lo que se podría mejorar:** algunos contextos (por ejemplo `EarningsContext`) **mezclan reglas con la forma de guardar en Firestore**. Una mejora sería sacar esas reglas a un caso de uso y que el contexto solo lo llame.

> 🌎 **En la vida real:** una casa que se fue ampliando: el ala nueva (el San) con planos de arquitecto, el resto con otros estilos. Y `EarningsContext` es un cocinero que, además de cocinar, va él mismo al proveedor: funciona, pero mezcla dos trabajos.

> 🌎 **Otro ejemplo:** Como un barrio que creció con el tiempo: unas calles planificadas y otras que se fueron haciendo; funciona, y se sabe qué se podría ordenar.

> 💡 **Idea:** decir **qué mejorarías** de tu propia app en una entrevista no te hace ver mal: te hace ver con criterio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Sacar la regla del contexto
lenguaje: js
pide: La mejora que propone esta parte: sacar las reglas de `EarningsContext` a una función pura. Aquí la regla de "¿cuánto se ganó en el día?" está **mezclada** con guardar. Escribe la función pura `gananciaDelDia(registros, acumulativa)`: si la plataforma es acumulativa, cuenta solo el **último** valor; si no, **suma** todos. Después haz que `contexto.total()` la use.
--- código
function gananciaDelDia(registros, acumulativa) {
  // tu código aquí
}

const contexto = {
  registros: [],
  acumulativa: true,
  anotar(valor) { this.registros.push(valor); },
  total() {
    // usa gananciaDelDia
  },
};
--- pruebas
prueba('Uber, acumulativa: el último', () => igual(gananciaDelDia([150, 320], true), 320));
prueba('Extras, no acumulativa: la suma', () => igual(gananciaDelDia([50, 30], false), 80));
prueba('sin registros: 0', () => igual(gananciaDelDia([], true), 0));
prueba('el contexto usa la regla', () => { contexto.registros = []; contexto.anotar(150); contexto.anotar(320); igual(contexto.total(), 320); });
--- solución
function gananciaDelDia(registros, acumulativa) {
  if (registros.length === 0) return 0;
  return acumulativa ? registros.at(-1) : registros.reduce((s, v) => s + v, 0);
}

const contexto = {
  registros: [],
  acumulativa: true,
  anotar(valor) { this.registros.push(valor); },
  total() {
    return gananciaDelDia(this.registros, this.acumulativa);
  },
};
```

```practica
elige :: ¿Qué parte de Copiloto se parece más a Clean Architecture? :: Las pantallas :: El módulo del San :: Cloud Functions
elige :: ¿Qué se podría mejorar según esta parte? :: Borrar el San :: Sacar las reglas de `EarningsContext` a un caso de uso :: Quitar las pruebas
vf :: La mayoría de las apps reales usan una sola arquitectura pura
escribe :: ¿Qué arquitectura usa la app Copiloto? Responde como en una entrevista. :: Una mezcla: el San usa Clean/hexagonal con un repositorio como contrato y una fábrica; las pantallas siguen MVVM con hooks y contextos; las reglas puras están en utils; y Cloud Functions es un servidor aparte. Mejoraría sacar reglas de EarningsContext a un caso de uso.
```

> 🔁 **Repaso:** la app Copiloto es una mezcla: San (Clean/hexagonal), pantallas (MVVM), `utils/` (reglas puras), Copiloto (módulos registrados), Cloud Functions (servidor aparte).

## 9. Cuidado: no exagerar

> 🎙️ **El profesor:** última lección, y es de sabiduría: **más capas no siempre es mejor**.

En un proyecto chico, una Clean Architecture completa puede ser **demasiado**: muchos archivos para hacer algo simple. Se usa la arquitectura que el proyecto **necesita**. La app Copiloto la usa completa donde vale la pena (el San, que es complejo y compartido entre personas) y más simple donde no.

Por ejemplo, tu página **¿Qué dice la Biblia?** y este mapa no usan Clean Architecture: son páginas chicas con archivos separados por trabajo. Y está **bien**.

> 🌎 **En la vida real:** para hacer un huevo frito no necesitas una cocina industrial con cinco ayudantes. Para un restaurante de 200 cubiertos, sí.

> 🌎 **Otro ejemplo:** Como usar camión de mudanza para llevar una carta: funciona, pero es exagerado. Se elige el transporte según la carga.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Cuánta arquitectura hace falta?
lenguaje: js
pide: Completa `queUsar(parte)`: si la parte tiene reglas complejas (`reglasComplejas`) **o** puede cambiar de base de datos (`puedeCambiarDeBase`) → `'capas'` (contrato, repositorio y servicio, como la caja). Si no, y es una pantalla simple → `'directo'`. No exageres.
--- código
function queUsar(parte) {
  // tu código aquí
}
--- pruebas
prueba('la caja: capas', () => igual(queUsar({ reglasComplejas: true, puedeCambiarDeBase: true }), 'capas'));
prueba('una pantalla "Acerca de": directo', () => igual(queUsar({ reglasComplejas: false, puedeCambiarDeBase: false }), 'directo'));
prueba('reglas simples pero cambia de base: capas', () => igual(queUsar({ reglasComplejas: false, puedeCambiarDeBase: true }), 'capas'));
--- solución
function queUsar(parte) {
  return parte.reglasComplejas || parte.puedeCambiarDeBase ? 'capas' : 'directo';
}
```

```practica
vf :: Siempre conviene usar Clean Architecture completa, aunque el proyecto sea chico
escribe :: ¿Cuándo usarías Clean Architecture y cuándo no? :: Donde la lógica es compleja o puede cambiar de herramienta, como el San; en partes o proyectos simples, una estructura más directa es mejor.
```

> 🔁 **Repaso:** la arquitectura se elige según lo que el proyecto necesita. Huevo frito: sartén. Restaurante grande: cocina industrial.

## Ejercicios

> 🎙️ **El profesor:** los dos primeros los haces en **Gastos del carro**, el proyecto de práctica: su carpeta `src/caja/` es un módulo en capas, igual que el San de Copiloto pero en chico. Los demás, con lo que viste en la clase.

> 🌎 **En la vida real:** Es como recorrer el edificio con el plano y señalar cada sector: esto es recepción, esto es archivo.

1. En Gastos del carro, abre `src/caja/repositorio/`. ¿Cuál archivo es el **contrato** y cuál es una **implementación**? ¿Cuántas implementaciones hay hoy?
2. Abre `src/caja/servicio/ServicioCaja.ts` y mira sus `import`. ¿Importa algo de Firebase o de la memoria? ¿Por qué no debería?
3. Clasifica estos archivos en **presentación**, **reglas** o **datos**:
   - `src/components/vehicles/VehicleFuelGauge.tsx`
   - `src/utils/fuelLevel.ts`
   - `src/services/cloud/earningsCloudStorage.ts`
   - `src/screens/onboarding/VehicleSetupScreen.tsx`
   - `src/data/workAppsCatalog.ts` (`isImmutableEarningPlatform`)
4. ¿Qué ventaja tiene `RepositorioEnMemoria` (o el `InMemorySanRepository` de Copiloto) para las pruebas? Corre `npm test` y mira cuánto tardan las pruebas de `ServicioCaja`.
5. Explica la "regla de la dependencia" con tus palabras.
6. ¿En qué se parecen Clean Architecture y la hexagonal?

<details>
<summary>Ver las correcciones explicadas</summary>

1. `RepositorioCaja.ts` es el **contrato** (una `interface` con `buscar`, `guardar` y `listar`); `RepositorioEnMemoria.ts` es **una** implementación. Hoy hay una sola; el día que haga falta Firebase se agrega otra, y el servicio no cambia. En Copiloto, el San tiene **tres** (Firestore, AsyncStorage e InMemory) y la app real usa Firestore.
2. Solo importa **tipos**: `Caja` y el contrato `RepositorioCaja` (con `import type`). **Nada de Firebase ni de la memoria**, y no debería: el servicio tiene las reglas, y las reglas no deben depender de dónde se guardan los datos. Así se prueban sin internet y se cambia la base sin tocarlas.
3. **Presentación:** `VehicleFuelGauge.tsx`, `VehicleSetupScreen.tsx`. **Reglas:** `fuelLevel.ts`, `isImmutableEarningPlatform`. **Datos:** `earningsCloudStorage.ts`.
4. Las pruebas corren sin internet ni Firebase, en milisegundos, y empiezan siempre limpias.
5. El código de afuera (pantallas, bases de datos) puede usar el de adentro (reglas), pero el de adentro nunca conoce al de afuera.
6. Las dos separan las reglas del negocio de las herramientas y se comunican por contratos (interfaces o puertos).

</details>

```practica
elige :: `src/services/cloud/earningsCloudStorage.ts` es… :: Presentación :: Reglas :: Datos
elige :: `src/utils/fuelLevel.ts` es… :: Presentación :: Reglas :: Datos
elige :: `src/screens/onboarding/VehicleSetupScreen.tsx` es… :: Presentación :: Reglas :: Datos
```

## Para la entrevista

> 🎙️ **El profesor:** esta es una de las conversaciones más importantes de tu entrevista. Practícala varias veces, en voz alta.

> 🌎 **En la vida real:** Explicar la arquitectura de Copiloto es como explicar el plano de tu casa: qué cuarto es cuál y por qué está ahí.

> 🎤 **Entrevista:** "¿Qué es Clean Architecture?"

<details>
<summary>Ver una buena respuesta</summary>

"Una forma de organizar el código en capas, con las reglas del negocio en el centro y las herramientas, como la base de datos o la interfaz, afuera. La regla principal es que las dependencias apuntan hacia adentro: las reglas no conocen la base de datos; se comunican por interfaces. Así se pueden cambiar las herramientas y probar las reglas solas."

</details>

> 🎤 **Entrevista:** "¿Usaste alguna en Copiloto?"

<details>
<summary>Ver una buena respuesta</summary>

"Sí. El módulo del San usa un repositorio como contrato, con tres implementaciones: Firestore para la app real, almacenamiento local, y memoria para pruebas. Los servicios solo conocen el contrato, y una fábrica decide cuál usar. Es la idea de puertos y adaptadores. Las pantallas siguen un estilo MVVM, con hooks que preparan los datos."

</details>

> 🎤 **Entrevista:** "¿Siempre usarías Clean Architecture?"

<details>
<summary>Ver una buena respuesta</summary>

"No. Agrega archivos y capas. La uso donde la lógica es compleja o puede cambiar de herramienta; en partes simples, una estructura más directa es mejor."

</details>

```practica
escribe :: Explica Clean Architecture en 3 frases, usando el San de ejemplo. :: Las reglas del negocio están en el centro y no conocen la base de datos; se comunican por contratos. En el San, los servicios usan el contrato SanRepository, que cumplen Firestore, el teléfono o la memoria. Una fábrica elige cuál, y así se cambia o se prueba sin tocar las reglas.
```

> 🔁 **Repaso final de la clase:** por qué importa la arquitectura, separar responsabilidades, Clean Architecture y su regla de la dependencia, el San como ejemplo real, hexagonal, MVC, MVVM, qué usa la app Copiloto y no exagerar. Próxima: **Tema 11, Cómo arreglé Copiloto**.
