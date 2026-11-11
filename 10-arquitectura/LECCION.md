# Tema 10: Arquitectura de software

**Arquitectura** es la forma en que se **organiza** el código de un programa: en qué partes se divide, qué hace cada parte y quién puede hablar con quién.

**Antes de empezar:** Temas 01 a 09. Este tema es más teórico; los anteriores te dan los ejemplos.

**Tiempo:** de 2 a 3 horas (puedes dividirlo en dos días).

## 1. ¿Por qué importa?

**Comparación:** una casa se puede construir de cualquier forma, pero si los cables eléctricos pasan por dentro de las cañerías, el día que quieres cambiar una llave terminas rompiendo una pared. Una buena arquitectura pone cada cosa en su lugar, y así se puede cambiar una parte **sin romper las demás**.

Una buena arquitectura logra:

| Objetivo | Qué significa |
|---|---|
| **Cambiar sin miedo** | Cambias la base de datos y las pantallas no se enteran |
| **Probar fácil** | Las reglas se prueban solas, sin teléfono ni internet |
| **Entender rápido** | Una persona nueva sabe dónde buscar cada cosa |
| **Trabajar en equipo** | Dos personas cambian partes distintas sin pisarse |

## 2. La idea base: separar responsabilidades

Casi todas las arquitecturas dividen el código en estas **responsabilidades**:

| Responsabilidad | Qué hace | En Copiloto |
|---|---|---|
| **Presentación** (UI) | Lo que se ve y se toca | `screens/`, `components/` |
| **Reglas de negocio** (dominio) | Las reglas del mundo real, sin pantalla ni base de datos | `utils/` (¿es acumulativo?, ¿cuánto combustible queda?) |
| **Datos** (infraestructura) | Guardar y leer: Firestore, el teléfono, internet | `services/` |

**La regla de oro:** las reglas de negocio **no deben saber** si los datos están en Firestore o en el teléfono, ni cómo es la pantalla. Así puedes cambiar cualquiera de las dos sin tocar las reglas.

Ya lo viste: la función `isImmutableEarningPlatform` (Tema 01) no sabe nada de Firestore ni de botones. Por eso se pudo probar en milisegundos (Tema 02).

## 3. Clean Architecture (Arquitectura Limpia)

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

| Capa | Qué contiene | Ejemplo en tu app |
|---|---|---|
| **Entidades** (centro) | Los objetos del negocio y sus reglas más básicas | Un `EarningRecord` (un ingreso), un `SanGroup` |
| **Casos de uso** | Lo que la app **hace**: una acción completa | "Registrar un ingreso": decide si es acumulativo, calcula la diferencia y lo guarda |
| **Adaptadores** | Traducen entre el centro y el mundo de afuera | Las pantallas, el `SanController`, los repositorios |
| **Frameworks** (afuera) | Las herramientas concretas | Firestore, React Native, Expo |

### La regla de la dependencia

> **El código solo puede depender hacia adentro.**

- Las pantallas (afuera) pueden usar los casos de uso (adentro).
- Los casos de uso **nunca** pueden importar una pantalla ni Firestore.

¿Cómo guarda datos un caso de uso si no puede conocer Firestore? Con una **interfaz**: un contrato que dice *qué* se puede hacer, sin decir *cómo*. El de adentro define el contrato; el de afuera lo cumple. Esto se llama **inversión de dependencias**.

## 4. El ejemplo real de tu app: el módulo del San

El San es la parte de tu app más parecida a Clean Architecture. Mira sus carpetas en `src/san/`:

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

En la misma carpeta hay **tres implementaciones**:

| Archivo | Dónde guarda | Para qué |
|---|---|---|
| `FirestoreSanRepository.ts` | En Firestore (la nube) | La app real |
| `AsyncStorageSanRepository.ts` | En el teléfono | Sin internet |
| `InMemorySanRepository.ts` | En la memoria (se borra al cerrar) | Ideal para pruebas: no necesita internet |

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

- Es el **único lugar** que sabe que existe Firestore.
- Los servicios piden "un repositorio del San" y no saben cuál les tocó.

**El beneficio:** si mañana quisieras cambiar Firestore por otra base de datos, escribirías un `OtraBaseSanRepository` que cumpla el contrato y cambiarías **una línea** en la fábrica. Las reglas del San, las pantallas y las pruebas no se tocarían.

## 5. Arquitectura hexagonal (puertos y adaptadores)

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

Es una de las más antiguas (de los años 70) y muy usada en servidores web.

| Parte | Qué hace | En tu San |
|---|---|---|
| **Modelo** | Los datos y sus reglas | `models/` y `service/` |
| **Vista** | Lo que se ve | Las pantallas del San |
| **Controlador** | Recibe lo que hace la persona, llama al modelo y le dice a la vista qué mostrar | `SanController.ts` |

**El camino:** tocas "Ya pagué" (vista) → el controlador recibe el toque → le pide al servicio que registre el pago (modelo) → la vista se actualiza.

## 7. MVVM (Modelo, Vista, Modelo de vista)

Es la más común en **apps móviles** (Android, iOS) y encaja bien con React.

| Parte | Qué hace | En tu app |
|---|---|---|
| **Modelo** | Los datos y las reglas | `utils/`, `services/` |
| **Vista** | Solo dibuja | Los componentes (`components/`) |
| **Modelo de vista** (ViewModel) | Prepara los datos para la vista y recibe sus acciones; la vista se actualiza sola cuando cambia | Los **hooks** y **contextos** (`useVehicleFuelLevel`, `EarningsContext`) |

**Ejemplo real:** el hook `useVehicleFuelLevel` (en `src/hooks/`) junta los abastecimientos y el kilometraje, calcula el nivel del tanque y se lo entrega listo a la barra de combustible. La barra (`VehicleFuelGauge`) solo dibuja lo que recibe; no calcula nada.

## 8. ¿Qué arquitectura usa tu app?

Tu app es una **mezcla**, como la mayoría de las apps reales:

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

Más capas no siempre es mejor. En un proyecto chico, una Clean Architecture completa puede ser **demasiado**: muchos archivos para hacer algo simple. Se usa la arquitectura que el proyecto **necesita**. Tu app la usa completa donde vale la pena (el San, que es complejo y compartido entre personas) y más simple donde no.

## Ejercicios

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

**¿Qué es Clean Architecture?**
> Una forma de organizar el código en capas, con las reglas del negocio en el centro y las herramientas (base de datos, interfaz) afuera. La regla principal es que las dependencias apuntan hacia adentro: las reglas no conocen la base de datos; se comunican por interfaces. Así se pueden cambiar las herramientas y probar las reglas solas.

**¿Usaste alguna en tu app?**
> Sí. El módulo del San usa un repositorio como contrato, con tres implementaciones: Firestore para la app real, almacenamiento local y memoria para pruebas. Los servicios solo conocen el contrato, y una fábrica decide cuál usar. Es la idea de puertos y adaptadores. Las pantallas siguen un estilo MVVM, con hooks que preparan los datos.

**¿Siempre usarías Clean Architecture?**
> No. Agrega archivos y capas. La uso donde la lógica es compleja o puede cambiar de herramienta; en partes simples, una estructura más directa es mejor.
