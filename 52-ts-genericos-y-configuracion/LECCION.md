# TypeScript 2: genéricos, configuración y errores típicos

> 🌎 **En la vida real:** una caja de mudanza "para lo que sea" que igual lleva una etiqueta: "caja de libros", "caja de platos". El genérico es la caja; el tipo que le pones es la etiqueta.

> 🎙️ **El profesor dice:** la segunda clase de TypeScript: los **genéricos**, `unknown` frente a `any`, los tipos utilitarios (`Partial`, `Pick`, `Record`), el archivo **tsconfig.json** con el modo estricto, y cómo leer los errores de TypeScript sin miedo.

## Parte 1. Genéricos

> 🌎 **En la vida real:** un molde de torta sirve para chocolate o vainilla; el molde no cambia, cambia lo que pones.

> 🌎 **Otro ejemplo:** Es como una caja fuerte que guarda lo que sea, pero recuerda qué guardaste.

### Una función para cualquier tipo, sin perder el tipo

```ts
function primero<T>(lista: T[]): T | undefined {
  return lista[0];
}
const g = primero([150, 30]);          // TypeScript sabe que g es number | undefined
const a = primero(['Uber', '99']);     // a es string | undefined
```

`<T>` es un "tipo variable": se rellena con lo que le pases.

> 🌎 **En la vida real:** es como una etiqueta en blanco que se llena al usar la caja.

> 🌎 **Otro ejemplo:** Es como un formulario genérico "Pedido de: ___" que sirve para cualquier producto.

### Genéricos que ya usas

```ts
const [gastos, setGastos] = useState<Gasto[]>([]);   // React: el estado es un array de Gasto
async function leer(): Promise<Gasto[]> { … }         // una promesa de Gasto[]
const mapa = new Map<string, number>();                // llaves texto, valores número
```

> 🌎 **En la vida real:** son como las cajas de mudanza ya etiquetadas que compras hechas.

> 🌎 **Otro ejemplo:** Es como los frascos con tapa de color según lo que guardan.

```practica
vf :: Un genérico permite escribir una función para cualquier tipo sin perder cuál es
vf :: En useState<Gasto[]>([]), el estado puede guardar cualquier cosa
elige :: ¿Qué tipo tiene a en const a = primero(['Uber', '99'])? :: number :: string | undefined :: any
elige :: ¿Qué significa Map<string, number>? :: Un array :: Un mapa con llaves de texto y valores numéricos :: Un número
escribe :: Escribe una función genérica ultimo que devuelva el último elemento de una lista. :: function ultimo<T>(lista: T[]): T | undefined { return lista[lista.length - 1]; }
```

## Parte 2. any, unknown y los tipos utilitarios

> 🌎 **En la vida real:** `any` es un pasaporte que dice "pase cualquiera"; `unknown` es "pasa, pero primero te revisamos".

> 🌎 **Otro ejemplo:** Es como recibir un paquete sin remitente: `any` lo abre sin mirar; `unknown` lo revisa antes.

### Evita any, usa unknown

```ts
let dato: any = JSON.parse(texto);
dato.loQueSea.noExiste();      // TypeScript no avisa nada 😬

let seguro: unknown = JSON.parse(texto);
// seguro.valor;                 ❌ primero revisa qué es
if (typeof seguro === 'object' && seguro !== null && 'valor' in seguro) { /* ahora sí */ }
```

`any` apaga TypeScript; `unknown` te obliga a revisar. Para datos de afuera (APIs, JSON), `unknown` + validar es lo seguro.

> 🌎 **En la vida real:** `any` es firmar sin leer; `unknown` es leer antes de firmar.

> 🌎 **Otro ejemplo:** Es como el control de equipaje: `any` deja pasar todo; `unknown` pasa por el escáner.

### Partial, Pick, Omit y Record

```ts
type CambiosGasto = Partial<Gasto>;              // todos los campos opcionales (para actualizar)
type ResumenGasto = Pick<Gasto, 'tipo' | 'valor'>;
type GastoNuevo = Omit<Gasto, 'id' | 'creadoEn'>;
type TotalesPorApp = Record<'Uber' | '99', number>;
```

Así el CRUD del laboratorio tendría tipos: `actualizar(id: string, cambios: Partial<Gasto>)`.

> 🌎 **En la vida real:** son como versiones de un mismo formulario: completo, resumido, sin campos internos.

> 🌎 **Otro ejemplo:** Es como recortar una foto: el original, solo las caras, sin el fondo.

```practica
vf :: any apaga los avisos de TypeScript para esa variable
vf :: Con unknown se puede usar cualquier propiedad sin revisar
elige :: ¿Qué tipo usarías para los cambios de un update donde todo es opcional? :: Gasto :: Partial<Gasto> :: Record<Gasto>
elige :: ¿Qué hace Omit<Gasto, 'id'>? :: Agrega id :: Crea el tipo Gasto sin el campo id :: Borra el objeto
escribe :: ¿Por qué es mejor unknown que any para un JSON que llega de una API? :: Porque unknown me obliga a revisar la forma del dato antes de usarlo, mientras que any deja usar cualquier cosa sin avisos y los errores aparecen recién al correr.
```

## Parte 3. tsconfig.json y el modo estricto

> 🌎 **En la vida real:** el reglamento interno de una empresa: qué tan estrictos son los controles.

> 🌎 **Otro ejemplo:** Es como el nivel de dificultad de un videojuego.

### La configuración

`tsconfig.json` dice cómo revisa y convierte TypeScript tu proyecto. Lo más importante:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "noUncheckedIndexedAccess": true
  }
}
```

`"strict": true` prende los controles importantes, como `strictNullChecks`: TypeScript te obliga a revisar si algo puede ser `null` o `undefined` antes de usarlo. Es la causa número uno de errores que evita.

> 🌎 **En la vida real:** es como el detector de metales en modo "máximo": molesta más, pero no se escapa nada.

> 🌎 **Otro ejemplo:** Es como el corrector ortográfico con la gramática activada.

### Revisar sin correr: tsc

```bash
npx tsc --noEmit     # revisa todo el proyecto, sin generar archivos
```

En Copiloto, el CI corre la revisión de tipos en cada subida (Tema 04).

> 🌎 **En la vida real:** es como el control técnico del carro: revisa todo sin tener que manejarlo.

> 🌎 **Otro ejemplo:** Es como pasar el corrector a todo el documento antes de imprimir.

```practica
vf :: Con strict activado, TypeScript obliga a revisar si algo puede ser null antes de usarlo
vf :: tsc --noEmit genera los archivos JavaScript en la carpeta del proyecto
elige :: ¿Qué opción del tsconfig prende los controles importantes? :: "target" :: "strict": true :: "module"
elige :: ¿Dónde conviene correr la revisión de tipos además de tu computadora? :: En ningún lado :: En el CI, en cada subida :: Solo en producción
escribe :: Explica para qué sirve el archivo tsconfig.json. :: Configura cómo TypeScript revisa y convierte el proyecto: qué tan estricto es (strict), a qué versión de JavaScript convierte y cómo maneja los módulos.
```

## Parte 4. Leer los errores de TypeScript

> 🌎 **En la vida real:** el aviso del tablero del carro no es un insulto: te dice exactamente qué revisar.

> 🌎 **Otro ejemplo:** Es como la corrección de un profesor con la línea marcada en rojo.

### Los más comunes

| Error | Qué quiere decir |
|---|---|
| `Type 'string' is not assignable to type 'number'` | Pusiste un texto donde va un número |
| `Property 'valor' does not exist on type 'Gasto'` | Ese campo no existe (¿mal escrito?) |
| `Object is possibly 'undefined'` | Puede no existir: revisa antes (`?.` o un `if`) |
| `Argument of type '…' is not assignable to parameter of type '…'` | Le pasaste a una función algo de otro tipo |
| `Cannot find name 'x'` | Esa variable no existe o falta importarla |

Se leen igual que en el Tema 07: **qué** pasó, **dónde** (archivo y línea) y **qué esperaba**.

> 🌎 **En la vida real:** es como una alarma con nombre: "puerta trasera abierta", no solo "alarma".

> 🌎 **Otro ejemplo:** Es como el diagnóstico del mecánico con el código de la falla.

### No taparlos con as ni con !

`valor as number` y `usuario!.nombre` le dicen a TypeScript "confía en mí". A veces sirven, pero casi siempre esconden el problema. Primero intenta arreglar el tipo o revisar con un `if`.

> 🌎 **En la vida real:** es como poner cinta sobre la luz del aceite del tablero: la luz no se ve, el problema sigue.

> 🌎 **Otro ejemplo:** Es como firmar "yo me hago responsable" sin revisar.

```practica
vf :: Object is possibly 'undefined' significa que hay que revisar si existe antes de usarlo
vf :: Usar as o ! es la mejor forma de arreglar cualquier error de TypeScript
elige :: ¿Qué significa Property 'vlor' does not exist on type 'Gasto'? :: Falta internet :: Ese campo no existe; probablemente está mal escrito :: El objeto está vacío
elige :: ¿Qué error ves si usas una variable que no importaste? :: Type is not assignable :: Cannot find name :: Object is possibly undefined
escribe :: TypeScript dice Object is possibly 'undefined' en usuario.nombre. ¿Cómo lo arreglas sin usar !? :: Revisando antes: usuario?.nombre, o un if (usuario) { ... } para usarlo solo cuando existe.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo usas TypeScript en un proyecto real?":** "Con strict activado y la revisión de tipos en el CI. Uso genéricos para funciones y estados reutilizables, como useState<Gasto[]>; unknown en vez de any para datos de afuera, validándolos; y tipos utilitarios como Partial u Omit para las variantes de un mismo dato. Leo los errores como en cualquier otro lenguaje y evito taparlos con as o con el signo de exclamación."

> 🌎 **En la vida real:** es como explicar el reglamento de calidad de tu taller.

> 🌎 **Otro ejemplo:** Es como un piloto explicando por qué usa todos los instrumentos.
