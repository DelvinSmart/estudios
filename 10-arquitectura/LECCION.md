# Tema 10: Arquitectura de software

> 🌎 **En la vida real:** la arquitectura de un programa es como el **organigrama y el plano** de una empresa: qué departamentos hay, qué hace cada uno y quién le puede pedir cosas a quién. La vendedora no entra a la caja fuerte; le pide al tesorero.

**Arquitectura** es la forma en que se **organiza** el código de un programa: en qué partes se divide, qué hace cada parte y quién puede hablar con quién.

**Antes de empezar:** Temas 01 a 09. Este tema es más teórico; los anteriores te dan los ejemplos.

**Tiempo:** de 2 a 3 horas (puedes dividirlo en dos días).

## 1. ¿Por qué importa?

> 🌎 **En la vida real:** piensa en un supermercado bien organizado:
> - **Cambiar sin miedo**: cambias de proveedor de leche y los clientes ni se enteran; la góndola sigue en el mismo lugar.
> - **Probar fácil**: puedes revisar si la balanza de la carnicería pesa bien sin abrir el supermercado al público.
> - **Entender rápido**: un empleado nuevo sabe que los lácteos están en la heladera del fondo, como en todos los supermercados.
> - **Trabajar en equipo**: el repositor de bebidas y el de limpieza trabajan al mismo tiempo sin chocar, porque cada uno tiene su pasillo.

> 🌎 **Otro ejemplo:** Como una casa con la electricidad bien hecha: cada circuito tiene su llave en el tablero, y puedes arreglar la cocina sin dejar sin luz el dormitorio.

**Comparación:** una casa se puede construir de cualquier forma, pero si los cables eléctricos pasan por dentro de las cañerías, el día que quieres cambiar una llave terminas rompiendo una pared. Una buena arquitectura pone cada cosa en su lugar, y así se puede cambiar una parte **sin romper las demás**.

Una buena arquitectura logra:

| Objetivo | Qué significa |
|---|---|
| **Cambiar sin miedo** | Cambias la base de datos y las pantallas no se enteran |
| **Probar fácil** | Las reglas se prueban solas, sin teléfono ni internet |
| **Entender rápido** | Una persona nueva sabe dónde buscar cada cosa |
| **Trabajar en equipo** | Dos personas cambian partes distintas sin pisarse |

## 2. La idea base: separar responsabilidades

> 🌎 **En la vida real:** un restaurante tiene tres zonas:
> - **Presentación** = el **salón**: mesas, mozos, la carta. Lo que el cliente ve y toca.
> - **Reglas de negocio** = las **recetas**: cuánta sal lleva la sopa, cuánto tiempo se cocina la carne. Valen igual si el restaurante cambia de local.
> - **Datos** = la **despensa y los proveedores**: de dónde sale la carne y dónde se guarda.
>
> **La regla de oro**: la receta dice "200 g de carne", no "200 g de carne del frigorífico Pérez, de la cámara del fondo". Si cambias de proveedor o de heladera, la receta no se toca.

> 🌎 **Otro ejemplo:** En un banco: la ventanilla (presentación), las reglas para dar un préstamo (negocio) y la bóveda con el sistema de cuentas (datos). Las reglas del préstamo no cambian si cambias la bóveda.

Casi todas las arquitecturas dividen el código en estas **responsabilidades**:

| Responsabilidad | Qué hace | En Copiloto |
|---|---|---|
| **Presentación** (UI) | Lo que se ve y se toca | `screens/`, `components/` |
| **Reglas de negocio** (dominio) | Las reglas del mundo real, sin pantalla ni base de datos | `utils/` (¿es acumulativo?, ¿cuánto combustible queda?) |
| **Datos** (infraestructura) | Guardar y leer: Firestore, el teléfono, internet | `services/` |

**La regla de oro:** las reglas de negocio **no deben saber** si los datos están en Firestore o en el teléfono, ni cómo es la pantalla. Así puedes cambiar cualquiera de las dos sin tocar las reglas.

Ya lo viste: la función `isImmutableEarningPlatform` (Tema 01) no sabe nada de Firestore ni de botones. Por eso se pudo probar en milisegundos (Tema 02).

## 3. Clean Architecture (Arquitectura Limpia)

> 🌎 **En la vida real:** es como una **cebolla** o como los anillos de seguridad de un banco:
> - En el **centro**, la bóveda: lo más valioso (las reglas del negocio).
> - Alrededor, los empleados que hacen las operaciones.
> - Más afuera, la ventanilla y los formularios.
> - Afuera de todo, la calle: los edificios, la luz, internet.
>
> Lo de afuera cambia seguido (cambias el diseño de la ventanilla, de proveedor de internet). Lo del centro casi nunca.

> 🌎 **Otro ejemplo:** Es como un país: la constitución (el centro) casi no cambia; las leyes, los ministerios y los edificios (afuera) cambian más seguido.

La propuso **Robert C. Martin** ("Uncle Bob") en 2012. Se dibuja como círculos, uno dentro del otro:

```
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

### Las cuatro capas

> 🌎 **En la vida real:** en una fábrica de pan:
> - **Entidades (centro)** = qué **es** un pan: harina, agua, sal, levadura. Eso no cambia nunca.
> - **Casos de uso** = lo que la panadería **hace**: "hornear una tanda", "vender una docena".
> - **Adaptadores** = el **mostrador** y el **cajero**: traducen "quiero 12 pancitos" del cliente a "vender una docena" para la panadería.
> - **Frameworks (afuera)** = el **horno** de marca X, la **caja registradora** de marca Y. Se pueden cambiar por otras marcas.

> 🌎 **Otro ejemplo:** En un banco: qué es una cuenta (entidad), abrir una cuenta o transferir (caso de uso), el cajero y la app (adaptadores), y el sistema de computadoras (framework).

| Capa | Qué contiene | Ejemplo en Copiloto |
|---|---|---|
| **Entidades** (centro) | Los objetos del negocio y sus reglas más básicas | Un `EarningRecord` (un ingreso), un `SanGroup` |
| **Casos de uso** | Lo que la app **hace**: una acción completa | "Registrar un ingreso": decide si es acumulativo, calcula la diferencia y lo guarda |
| **Adaptadores** | Traducen entre el centro y el mundo de afuera | Las pantallas, el `SanController`, los repositorios |
| **Frameworks** (afuera) | Las herramientas concretas | Firestore, React Native, Expo |

### La regla de la dependencia

> 🌎 **En la vida real:** en un hospital, el cirujano (el centro) no necesita saber qué marca de bisturí compró la administración. Dice: "necesito **un bisturí** de tal tamaño" (la **interfaz**, el contrato). La administración (afuera) consigue uno que cumpla. Si cambian de proveedor, el cirujano opera igual.
>
> Eso es la **inversión de dependencias**: el de adentro dice **qué** necesita; el de afuera se encarga del **cómo**. Nunca al revés.

> 🌎 **Otro ejemplo:** Es como un enchufe en la pared: el aparato depende del enchufe, pero el enchufe no sabe qué aparato le pusiste.

> **El código solo puede depender hacia adentro.**

- Las pantallas (afuera) pueden usar los casos de uso (adentro).
- Los casos de uso **nunca** pueden importar una pantalla ni Firestore.

¿Cómo guarda datos un caso de uso si no puede conocer Firestore? Con una **interfaz**: un contrato que dice *qué* se puede hacer, sin decir *cómo*. El de adentro define el contrato; el de afuera lo cumple. Esto se llama **inversión de dependencias**.

## 4. El ejemplo real de Copiloto: el módulo del San

> 🌎 **En la vida real:** el San es como una **cooperativa** bien organizada, con sus oficinas:
> - `models/` = los **estatutos**: qué es un grupo, qué es un miembro.
> - `service/` = la **tesorería**: quién paga, cuándo, a quién le toca la mano.
> - `repository/` = el **archivo**: dónde se guardan los papeles.
> - `controller/` = la **recepción**: recibe a los socios y los manda a la oficina correcta.
> - `events/` = el **altavoz**: "atención, ya pagó Juan".
> - `notifications/` = los **avisos** que llegan al celular de cada socio.

> 🌎 **Otro ejemplo:** Como un club deportivo bien organizado: reglamento, tesorería, archivo, secretaría, megáfono y avisos al celular de los socios.

El San es la parte de Copiloto más parecida a Clean Architecture. Mira sus carpetas en `src/san/`:

```
src/san/
  models/          ← las entidades: cómo es un grupo, un pedido de ingreso
  service/         ← las reglas y casos de uso: pagos, ciclos, caja, invitaciones
  repository/      ← cómo se guardan los datos (el contrato y sus implementaciones)
  controller/      ← conecta las pantallas con los servicios
  events/          ← avisa cuando algo cambia
  notifications/   ← los avisos del San
```

### El contrato (la interfaz)

> 🌎 **En la vida real:** es como el **contrato de un puesto de trabajo** de archivista: "tiene que saber guardar papeles, buscarlos por número y destruirlos". El contrato no dice si va a usar archivador metálico, cajas de cartón o una computadora. Dice **qué**, no **cómo**.
>
> `Promise` es como el **ticket de la tintorería**: te lo dan ahora, pero la ropa la recibes **después**. Guardar en internet tarda; mientras tanto, tienes el ticket.

> 🌎 **Otro ejemplo:** Es como el tamaño estándar de una bombilla: cualquier marca que cumpla ese tamaño entra en tu lámpara.

En `src/san/repository/SanRepository.ts`:

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

- `interface` define un **contrato**: "cualquier repositorio del San tiene que saber cargar, guardar, buscar y borrar".
- Dice **qué** hace, no **cómo**. No menciona Firestore.
- `Promise<...>` significa que la respuesta llega **después** (hay que esperarla, porque guardar en internet tarda).

### Tres formas de cumplir el mismo contrato

> 🌎 **En la vida real:** son tres archivistas distintos, y los tres cumplen el mismo contrato:
> - **Firestore** = el que guarda en el **archivo del banco** (la nube): para la vida real.
> - **AsyncStorage** = el que guarda en un **cajón de tu casa** (el teléfono): para cuando no hay internet.
> - **InMemory** = el que anota en un **papelito** que se tira al final del día: perfecto para practicar, porque cada mañana empieza limpio.

> 🌎 **Otro ejemplo:** Como tres formas de guardar plata: en el banco, en una alcancía en casa, o en el bolsillo durante el día.

En la misma carpeta hay **tres implementaciones**:

| Archivo | Dónde guarda | Para qué |
|---|---|---|
| `FirestoreSanRepository.ts` | En Firestore (la nube) | La app real |
| `AsyncStorageSanRepository.ts` | En el teléfono | Sin internet |
| `InMemorySanRepository.ts` | En la memoria (se borra al cerrar) | Ideal para pruebas: no necesita internet |

### La fábrica que elige

> 🌎 **En la vida real:** es como la **agencia de empleo**: los de la tesorería solo dicen "mándenme un archivista". La agencia es la **única** que conoce a los tres y elige cuál manda. Si mañana aparece un archivista nuevo, solo se avisa a la agencia: la tesorería ni se entera.

> 🌎 **Otro ejemplo:** Como la central de una cadena de pizzerías: llamas a un solo número y la central decide qué local te manda la pizza.

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

- Es el **único lugar** que sabe que existe Firestore.
- Los servicios piden "un repositorio del San" y no saben cuál les tocó.

**El beneficio:** si mañana quisieras cambiar Firestore por otra base de datos, escribirías un `OtraBaseSanRepository` que cumpla el contrato y cambiarías **una línea** en la fábrica. Las reglas del San, las pantallas y las pruebas no se tocarían.

## 5. Arquitectura hexagonal (puertos y adaptadores)

> 🌎 **En la vida real:** piensa en un **televisor**. Por detrás tiene **puertos**: HDMI, USB, antena. El televisor (el centro) no sabe si en el HDMI enchufaste una PlayStation, un decodificador o una notebook. Solo sabe hablar "HDMI".
> - **Puerto** = el agujero HDMI: el contrato.
> - **Adaptador** = el aparato que enchufas: la consola, el decodificador.
> - **Adaptadores de entrada** = el **control remoto**: te permite pedirle cosas al televisor (las pantallas, el `SanController`).
> - **Adaptadores de salida** = los **parlantes**: el televisor les manda el sonido (la base de datos, los avisos).
>
> **Clean vs. hexagonal**: son la misma idea con distinto dibujo, como "carro" y "auto". Clean divide más el centro; hexagonal pone el foco en los enchufes.

> 🌎 **Otro ejemplo:** Como un cargador universal con puntas intercambiables: el cargador es el mismo, cambias la punta según el teléfono.

La propuso **Alistair Cockburn** en 2005. Es la misma idea que Clean Architecture, dibujada distinto: el centro es un hexágono con las reglas, y alrededor se enchufan las cosas de afuera.

```
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
| **Adaptador de entrada** | Quien **pide** cosas al centro | Las pantallas, el `SanController` |
| **Adaptador de salida** | A quien el centro le **pide** cosas | La base de datos, los avisos |

**Comparación:** el centro es un enchufe en la pared (el puerto). Puedes enchufar una lámpara, un cargador o una plancha (adaptadores) sin cambiar el cableado de la casa.

**Clean y hexagonal: ¿cuál es la diferencia?** En la práctica, casi ninguna: las dos separan las reglas de las herramientas y usan contratos. Clean Architecture divide el centro en más capas (entidades y casos de uso); la hexagonal pone el foco en los puertos y adaptadores.

## 6. MVC (Modelo, Vista, Controlador)

> 🌎 **En la vida real:** un restaurante clásico:
> - **Vista** = la **mesa y el plato**: lo que el cliente ve.
> - **Controlador** = el **mozo**: toma el pedido, lo lleva a la cocina y trae el plato.
> - **Modelo** = la **cocina**: tiene los ingredientes y las recetas.
>
> En el San: tocas "Ya pagué" (le haces una seña al mozo) → el mozo va a la cocina ("registren el pago de Juan") → la cocina lo anota → el mozo vuelve y te muestra la cuenta actualizada.

> 🌎 **Otro ejemplo:** En un hotel: el huésped (vista) le pide algo al recepcionista (controlador), que se lo pide a limpieza o cocina (modelo) y vuelve con la respuesta.

Es una de las más antiguas (de los años 70) y muy usada en servidores web.

| Parte | Qué hace | En tu San |
|---|---|---|
| **Modelo** | Los datos y sus reglas | `models/` y `service/` |
| **Vista** | Lo que se ve | Las pantallas del San |
| **Controlador** | Recibe lo que hace la persona, llama al modelo y le dice a la vista qué mostrar | `SanController.ts` |

**El camino:** tocas "Ya pagué" (vista) → el controlador recibe el toque → le pide al servicio que registre el pago (modelo) → la vista se actualiza.

## 7. MVVM (Modelo, Vista, Modelo de vista)

> 🌎 **En la vida real:** es el **tablero del carro**:
> - **Modelo** = el **motor y los sensores**: saben la temperatura, las revoluciones y cuánta gasolina hay.
> - **Vista** = las **agujas del tablero**: solo se mueven a donde les dicen. No calculan nada.
> - **Modelo de vista** = la **computadora del tablero**: lee los sensores, hace las cuentas ("con estos litros te quedan 120 km") y le pasa a la aguja el número ya listo. Cuando cambia el dato, la aguja se mueve sola.
>
> Eso es justo `useVehicleFuelLevel` (la computadora) y `VehicleFuelGauge` (la aguja).

> 🌎 **Otro ejemplo:** Como un termómetro digital: el sensor mide (modelo), el chip convierte el número a grados (modelo de vista) y la pantalla solo muestra el número (vista).

Es la más común en **apps móviles** (Android, iOS) y encaja bien con React.

| Parte | Qué hace | En Copiloto |
|---|---|---|
| **Modelo** | Los datos y las reglas | `utils/`, `services/` |
| **Vista** | Solo dibuja | Los componentes (`components/`) |
| **Modelo de vista** (ViewModel) | Prepara los datos para la vista y recibe sus acciones; la vista se actualiza sola cuando cambia | Los **hooks** y **contextos** (`useVehicleFuelLevel`, `EarningsContext`) |

**Ejemplo real:** el hook `useVehicleFuelLevel` (en `src/hooks/`) junta los abastecimientos y el kilometraje, calcula el nivel del tanque y se lo entrega listo a la barra de combustible. La barra (`VehicleFuelGauge`) solo dibuja lo que recibe; no calcula nada.

## 8. ¿Qué arquitectura usa la app Copiloto?

> 🌎 **En la vida real:** es como una casa que se fue ampliando: la cocina se hizo con un estilo, el cuarto nuevo con otro. Funciona y está ordenada, pero no todo es igual:
> - **El San** = el ala nueva, construida con planos de arquitecto.
> - **Las pantallas** = el tablero del carro (MVVM).
> - **`utils/`** = el recetario guardado en el centro de la casa.
> - **El Copiloto** = una **zapatilla eléctrica** (regleta) donde cada parte de la app se enchufa.
> - **Cloud Functions** = un **taller aparte** en el fondo del terreno.
>
> **Lo que se puede mejorar**: `EarningsContext` es como un cocinero que, además de cocinar, va él mismo al proveedor a buscar la carne. Funciona, pero mezcla dos trabajos.

> 🌎 **Otro ejemplo:** Como un barrio que creció con el tiempo: unas calles planificadas y otras que se fueron haciendo; funciona, y se sabe qué se podría ordenar.

La app Copiloto es una **mezcla**, como la mayoría de las apps reales:

| Parte de la app | Se parece a |
|---|---|
| El módulo del San | **Clean Architecture / hexagonal**: contrato, implementaciones intercambiables, servicios y controlador |
| Las pantallas con hooks y contextos | **MVVM** |
| Las reglas en `utils/` | El **centro** de Clean Architecture: reglas puras, probadas sin pantalla |
| El Copiloto (`ai-engine/`) | **Módulos registrados** (`ModuleRegistry`): cada parte de la app se "enchufa" al Copiloto |
| Cloud Functions | Un **servidor** separado, con sus propias reglas |

**Lo que está bien:** las reglas importantes (dinero, fechas, combustible, San) están separadas y probadas.

**Lo que se podría mejorar:** algunos contextos (por ejemplo `EarningsContext`) mezclan reglas con la forma de guardar en Firestore. Una mejora sería sacar esas reglas a un caso de uso y que el contexto solo lo llame.

## 9. Cuidado: no exagerar

> 🌎 **En la vida real:** para hacer un huevo frito no necesitas una cocina industrial con cinco ayudantes. Para un restaurante de 200 cubiertos, sí. Usa la organización que el trabajo pide: la app Copiloto pone "cocina industrial" en el San (complejo y compartido) y "sartén y listo" en lo simple.

> 🌎 **Otro ejemplo:** Como usar un camión de mudanza para llevar una carta: funciona, pero es exagerado. Se elige el transporte según la carga.

Más capas no siempre es mejor. En un proyecto chico, una Clean Architecture completa puede ser **demasiado**: muchos archivos para hacer algo simple. Se usa la arquitectura que el proyecto **necesita**. La app Copiloto la usa completa donde vale la pena (el San, que es complejo y compartido entre personas) y más simple donde no.

## Ejercicios

> 🌎 **En la vida real:** es como recorrer la cooperativa con el organigrama en la mano y señalar: "esto es recepción, esto es tesorería, esto es el archivo".

1. Abre `src/san/repository/` y cuenta cuántas implementaciones del contrato hay. ¿Cuál usa la app real?
2. Abre `src/san/service/SanService.ts` y busca si importa algo de Firestore. ¿Por qué no debería?
3. Clasifica estos archivos en **presentación**, **reglas** o **datos**:
   - `src/components/vehicles/VehicleFuelGauge.tsx`
   - `src/utils/fuelLevel.ts`
   - `src/services/cloud/earningsCloudStorage.ts`
   - `src/screens/onboarding/VehicleSetupScreen.tsx`
   - `src/data/workAppsCatalog.ts` (`isImmutableEarningPlatform`)
4. Pregunta: ¿qué ventaja tiene el `InMemorySanRepository` para las pruebas?
5. Pregunta: explica la "regla de la dependencia" con tus palabras.
6. Pregunta: ¿en qué se parecen Clean Architecture y la hexagonal?

<details>
<summary>Respuestas</summary>

1. Tres: Firestore, AsyncStorage (teléfono) e InMemory (memoria). La app real usa Firestore.
2. No debería, porque el servicio tiene las reglas, y las reglas no deben depender de una base de datos concreta. Así se pueden probar sin internet y cambiar la base sin tocarlas.
3. Presentación: `VehicleFuelGauge.tsx`, `VehicleSetupScreen.tsx`. Reglas: `fuelLevel.ts`, `isImmutableEarningPlatform`. Datos: `earningsCloudStorage.ts`.
4. Las pruebas corren sin internet ni Firebase, en milisegundos, y empiezan siempre limpias.
5. El código de afuera (pantallas, bases de datos) puede usar el de adentro (reglas), pero el de adentro nunca conoce al de afuera.
6. Las dos separan las reglas del negocio de las herramientas (base de datos, pantalla) y se comunican por contratos (interfaces o puertos).

</details>

## Para la entrevista

> 🌎 **En la vida real:** explícalo con el televisor y sus puertos, o con el cirujano y el bisturí: "las reglas están en el centro y piden lo que necesitan por contrato; lo de afuera se enchufa y se puede cambiar". Y si te preguntan si siempre lo harías: "no; para un huevo frito no armo una cocina industrial".

**¿Qué es Clean Architecture?**
> Una forma de organizar el código en capas, con las reglas del negocio en el centro y las herramientas (base de datos, interfaz) afuera. La regla principal es que las dependencias apuntan hacia adentro: las reglas no conocen la base de datos; se comunican por interfaces. Así se pueden cambiar las herramientas y probar las reglas solas.

**¿Usaste alguna en Copiloto?**
> Sí. El módulo del San usa un repositorio como contrato, con tres implementaciones: Firestore para la app real, almacenamiento local y memoria para pruebas. Los servicios solo conocen el contrato, y una fábrica decide cuál usar. Es la idea de puertos y adaptadores. Las pantallas siguen un estilo MVVM, con hooks que preparan los datos.

**¿Siempre usarías Clean Architecture?**
> No. Agrega archivos y capas. La uso donde la lógica es compleja o puede cambiar de herramienta; en partes simples, una estructura más directa es mejor.
