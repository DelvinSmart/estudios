# TypeScript 1: tipos e interfaces

> 🌎 **En la vida real:** un formulario con cada casilla marcada ("fecha", "monto en reales", "sí/no") evita que alguien escriba su nombre donde va el teléfono. TypeScript pone esas marcas en tu código.

> 🎙️ **El profesor dice:** ya sabes JavaScript; TypeScript es JavaScript **más tipos**. Hoy: cómo se escriben los tipos, cuándo TypeScript los adivina solo, las **uniones**, las **interfaces** y los `type`, y cómo tipar funciones. Copiloto está escrito así. Para probar sin instalar nada, usa el **TypeScript Playground** oficial: https://www.typescriptlang.org/play

## Parte 1. Tipos básicos e inferencia

> 🌎 **En la vida real:** las etiquetas de los frascos: "azúcar", "sal". Nadie pone sal en el café por error.

> 🌎 **Otro ejemplo:** Es como los enchufes con forma distinta para cada voltaje.

### Anotar tipos

```ts
let viajes: number = 12;
const nombre: string = 'Delvin';
let activo: boolean = true;
const apps: string[] = ['Uber', '99'];
let proximoAceite: Date | null = null;
```

> 🌎 **En la vida real:** es como escribir en cada caja de la mudanza qué tiene adentro.

> 🌎 **Otro ejemplo:** Es como el cartel "solo bicicletas" en una ciclovía.

### Inferencia: no hace falta escribir todo

Si das un valor, TypeScript **adivina** el tipo:

```ts
const total = 250.5;          // TypeScript ya sabe que es number
let app = 'Uber';             // string
app = 12;                     // ❌ Type 'number' is not assignable to type 'string'
```

Regla: anota los **parámetros** de las funciones y los datos de afuera (APIs, Firebase); lo demás deja que lo infiera.

> 🌎 **En la vida real:** si ves una caja con zapatos adentro, no necesitas la etiqueta "zapatos".

> 🌎 **Otro ejemplo:** Es como reconocer una moneda por su forma sin leer el valor.

```practica
vf :: TypeScript puede adivinar el tipo de una variable a partir de su valor
vf :: En TypeScript hay que anotar el tipo de absolutamente todas las variables
elige :: ¿Cómo se escribe "un array de textos"? :: string :: string[] :: [string, number]
elige :: let app = 'Uber'; app = 12; ¿qué pasa? :: Funciona :: TypeScript avisa: number no se puede asignar a string :: Se borra app
escribe :: Escribe una variable para la fecha del próximo cambio de aceite que pueda ser una fecha o null. :: let proximoAceite: Date | null = null;
```

## Parte 2. Uniones y literales

> 🌎 **En la vida real:** "pago con tarjeta **o** efectivo **o** Pix": una de esas opciones, no otra.

> 🌎 **Otro ejemplo:** Es como el selector de una lavadora: solo los programas que trae.

### Uniones

```ts
let id: string | number;          // texto o número
type App = 'Uber' | '99' | 'InDrive';   // solo esos tres textos (tipos literales)
let miApp: App = 'Uber';
miApp = 'Lyft';                   // ❌ no está en la lista
```

Los literales son ideales para estados: `type Estado = 'cargando' | 'listo' | 'error';`.

> 🌎 **En la vida real:** es como un menú de opciones en un formulario en vez de un campo libre.

> 🌎 **Otro ejemplo:** Es como los colores de un semáforo: solo tres posibles.

### Achicar el tipo (narrowing)

Con una unión, TypeScript te obliga a revisar cuál es antes de usarlo:

```ts
function mostrarId(id: string | number) {
  if (typeof id === 'number') return id.toFixed(0);   // aquí sabe que es number
  return id.toUpperCase();                             // aquí sabe que es string
}
```

> 🌎 **En la vida real:** antes de cargar un carro, preguntas si es nafta o diésel.

> 🌎 **Otro ejemplo:** Es como revisar si una llamada es del trabajo o personal antes de contestar.

```practica
vf :: type App = 'Uber' | '99' solo acepta esos dos textos
vf :: Con una unión string | number, TypeScript deja usar toUpperCase sin revisar
elige :: ¿Qué es bueno modelar con tipos literales? :: Un número cualquiera :: Los estados de una pantalla: cargando, listo, error :: Un texto libre
elige :: ¿Qué hace typeof id === 'number' dentro de un if? :: Convierte id :: Le dice a TypeScript que ahí id es number :: Borra id
escribe :: Crea un tipo para los estados de una pantalla de carga. :: type Estado = 'cargando' | 'listo' | 'error';
```

## Parte 3. Interfaces y type

> 🌎 **En la vida real:** una interfaz es el formulario de un gasto: dice qué campos tiene y de qué tipo.

> 🌎 **Otro ejemplo:** Es como el plano de una casa: dice qué cuartos tiene, no cómo se decora.

### Describir la forma de un objeto

```ts
interface Gasto {
  id: string;
  tipo: 'combustible' | 'lavado' | 'peaje' | 'otro';
  valor: number;
  nota?: string;          // opcional: puede no estar
  readonly creadoEn: Date; // no se puede cambiar después
}

const g: Gasto = { id: 'a1', tipo: 'lavado', valor: 30, creadoEn: new Date() };
g.valor = 35;        // ✅
g.creadoEn = new Date();   // ❌ es readonly
```

`type` hace casi lo mismo: `type Gasto = { … }`. Diferencia práctica: `type` también sirve para uniones; `interface` se puede extender con `extends`. Usa uno de los dos con coherencia.

> 🌎 **En la vida real:** `?` es la casilla "opcional" de un formulario; `readonly` es la fecha impresa que no se puede tachar.

> 🌎 **Otro ejemplo:** Es como la ficha de un paciente: algunos campos obligatorios, otros opcionales.

### Extender

```ts
interface Vehiculo { placa: string; km: number; }
interface CarroDeApp extends Vehiculo { apps: string[]; }
```

> 🌎 **En la vida real:** es como un formulario base de vehículo con una sección extra para conductores de app.

> 🌎 **Otro ejemplo:** Es como un modelo de carro con un paquete de extras.

```practica
vf :: En una interfaz, nota?: string significa que nota puede no estar
vf :: Una propiedad readonly se puede cambiar después de crear el objeto
elige :: ¿Qué puede hacer type que interface no? :: Describir objetos :: Describir uniones como 'a' | 'b' :: Tener propiedades
elige :: ¿Qué hace interface CarroDeApp extends Vehiculo? :: Borra Vehiculo :: Crea un tipo con todo lo de Vehiculo más lo nuevo :: Copia el archivo
escribe :: Escribe una interfaz Viaje con id, app (Uber, 99 o InDrive), valor y propina opcional. :: interface Viaje { id: string; app: 'Uber' | '99' | 'InDrive'; valor: number; propina?: number; }
```

## Parte 4. Tipar funciones

> 🌎 **En la vida real:** el cartel de una máquina expendedora: "entra una moneda de 1 real, sale una bebida".

> 🌎 **Otro ejemplo:** Es como el contrato de un servicio: qué das y qué recibes.

### Parámetros y retorno

```ts
function gananciaNeta(bruto: number, gastos: number): number {
  return bruto - gastos;
}

const totalDe = (gastos: Gasto[]): number => gastos.reduce((s, g) => s + g.valor, 0);

async function leerGastos(): Promise<Gasto[]> {   // una promesa que trae Gasto[]
  // …
  return [];
}
```

> 🌎 **En la vida real:** es como una etiqueta en la entrada y otra en la salida de una máquina.

> 🌎 **Otro ejemplo:** Es como un embudo con tamaño de entrada y de salida.

### Funciones como tipo

```ts
type AlGuardar = (gasto: Gasto) => void;   // recibe un Gasto, no devuelve nada
function Formulario(props: { alGuardar: AlGuardar }) { /* … */ }
```

En React, así se tipan las funciones que se pasan como props.

> 🌎 **En la vida real:** es como decir "necesito un electricista certificado", no "cualquier persona".

> 🌎 **Otro ejemplo:** Es como el tipo de enchufe que acepta un aparato.

```practica
vf :: Una función async que devuelve un Gasto[] se tipa como Promise<Gasto[]>
vf :: void significa que la función devuelve un número
elige :: ¿Cómo tipas una función que recibe un Gasto y no devuelve nada? :: (g: Gasto) => number :: (g: Gasto) => void :: Gasto[]
elige :: ¿Qué parte conviene siempre anotar en una función? :: Ninguna :: Los parámetros :: Solo el nombre
escribe :: Tipa una función rendimiento que recibe km y litros y devuelve un número. :: function rendimiento(km: number, litros: number): number { return km / litros; }
```

## Para la entrevista

> 🎤 **Si te preguntan "¿por qué usas TypeScript?":** "Porque encuentra errores antes de que lleguen al usuario: si paso un texto donde va un número, o uso un campo que no existe, el editor me avisa. Anoto los parámetros y los datos que vienen de afuera, dejo que infiera lo demás, modelo los estados con uniones de literales y describo los datos con interfaces, con opcionales y readonly donde corresponde."

> 🌎 **En la vida real:** es como explicar por qué un taller usa etiquetas en cada pieza: menos errores, más rápido.

> 🌎 **Otro ejemplo:** Es como el control de calidad que revisa antes de que el producto salga.
