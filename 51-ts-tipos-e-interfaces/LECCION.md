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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Ponle tipos (TypeScript revisa)
lenguaje: ts
pide: En TypeScript estricto, un parámetro sin tipo es un error. Escribe los tipos que faltan en `promedio` (recibe una lista de números y devuelve un número) y completa la función. Si un tipo está mal, TypeScript te dice en qué línea.
--- código
function promedio(valores) {
  // tu código aquí
}
--- pruebas
prueba('promedio de 10, 20 y 30 es 20', () => igual(promedio([10, 20, 30]), 20));
prueba('promedio de una lista vacía es 0', () => igual(promedio([]), 0));
const resultado: number = promedio([1, 2]);
--- solución
function promedio(valores: number[]): number {
  if (valores.length === 0) return 0;
  return valores.reduce((s, v) => s + v, 0) / valores.length;
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Solo esas tres apps (uniones y literales)
lenguaje: ts
pide: Crea `type App` para que **solo** acepte `'Uber'`, `'99'` o `'InDrive'`. Después completa `comision(app: App)`: Uber 25 %, 99 20 %, InDrive 10 % (devuelve 0.25, 0.2 o 0.1). Una de las pruebas intenta pasarle `'Lyft'`: TypeScript tiene que **rechazarlo**.
--- código
type App = string;   // cámbialo: solo tres textos

function comision(app: App): number {
  // tu código aquí
  return 0;
}
--- pruebas
prueba('Uber cobra 25 %', () => igual(comision('Uber'), 0.25));
prueba('99 cobra 20 %', () => igual(comision('99'), 0.2));
prueba('InDrive cobra 10 %', () => igual(comision('InDrive'), 0.1));
// @ts-expect-error  'Lyft' no está en la lista: TypeScript tiene que marcar error aquí
comision('Lyft');
--- solución
type App = 'Uber' | '99' | 'InDrive';

function comision(app: App): number {
  if (app === 'Uber') return 0.25;
  if (app === '99') return 0.2;
  return 0.1;
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu primera interface
lenguaje: ts
pide: Escribe la `interface Gasto` con: `id` (texto), `tipo` (solo `'combustible'`, `'lavado'` o `'peaje'`), `valor` (número) y `nota` (texto **opcional**). Después completa `crearGasto`. Las pruebas comprueban que un tipo inventado (`'pizza'`) sea rechazado.
--- código
interface Gasto {
  // tu código aquí
}

function crearGasto(id: string, tipo: Gasto['tipo'], valor: number): Gasto {
  // tu código aquí
}
--- pruebas
prueba('crea el gasto con sus datos', () => igual(crearGasto('a1', 'lavado', 30), { id: 'a1', tipo: 'lavado', valor: 30 }));
const conNota: Gasto = { id: 'b', tipo: 'peaje', valor: 8, nota: 'ida al aeropuerto' };
const sinNota: Gasto = { id: 'c', tipo: 'combustible', valor: 150 };
// @ts-expect-error  'pizza' no es un tipo de gasto
const malo: Gasto = { id: 'd', tipo: 'pizza', valor: 1 };
prueba('la nota es opcional', () => ok(conNota.nota && !sinNota.nota));
--- solución
interface Gasto {
  id: string;
  tipo: 'combustible' | 'lavado' | 'peaje';
  valor: number;
  nota?: string;
}

function crearGasto(id: string, tipo: Gasto['tipo'], valor: number): Gasto {
  return { id, tipo, valor };
}
```

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tipar funciones (también las async)
lenguaje: ts
pide: Completa `totalDe` (recibe `Gasto[]` y devuelve `number`) y `leerGastos`, una función `async` que devuelve `Promise<Gasto[]>` con los dos gastos de ejemplo. Escribe los tipos de retorno.
--- código
interface Gasto { tipo: string; valor: number; }

const ejemplo: Gasto[] = [{ tipo: 'combustible', valor: 150 }, { tipo: 'lavado', valor: 30 }];

function totalDe(gastos) {
  // tu código aquí
}

async function leerGastos() {
  // tu código aquí
}
--- pruebas
prueba('total de los ejemplos es 180', () => igual(totalDe(ejemplo), 180));
prueba('leerGastos devuelve los dos gastos', async () => igual((await leerGastos()).length, 2));
prueba('y su total es 180', async () => igual(totalDe(await leerGastos()), 180));
const t: number = totalDe([]);
--- solución
interface Gasto { tipo: string; valor: number; }

const ejemplo: Gasto[] = [{ tipo: 'combustible', valor: 150 }, { tipo: 'lavado', valor: 30 }];

function totalDe(gastos: Gasto[]): number {
  return gastos.reduce((s, g) => s + g.valor, 0);
}

async function leerGastos(): Promise<Gasto[]> {
  return ejemplo;
}
```

```practica
vf :: Una función async que devuelve un Gasto[] se tipa como Promise<Gasto[]>
vf :: void significa que la función devuelve un número
elige :: ¿Cómo tipas una función que recibe un Gasto y no devuelve nada? :: (g: Gasto) => number :: (g: Gasto) => void :: Gasto[]
elige :: ¿Qué parte conviene siempre anotar en una función? :: Ninguna :: Los parámetros :: Solo el nombre
escribe :: Tipa una función rendimiento que recibe km y litros y devuelve un número. :: function rendimiento(km: number, litros: number): number { return km / litros; }
```

## Parte 5. El motor de diseño con tipos

> 🌎 **En la vida real:** es como la planilla de un uniforme de equipo: dice qué prendas lleva (camiseta, short, medias) y de qué color. Un uniforme de visitante tiene **las mismas prendas** con otros colores; si le falta una, el árbitro no lo deja entrar.

> 🌎 **Otro ejemplo:** Es como el formulario de un pasaporte: el de cada persona tiene datos distintos, pero **los mismos campos**. Un formulario con un campo de menos no se acepta.

En la clase 84 armaste el motor de la web de gastos como un objeto de JavaScript. En TypeScript ese objeto gana algo enorme: **un tipo que dice qué tiene que tener**.

```ts
interface Tema {
  colores: { fondo: string; texto: string; acento: string };
  espacio: { chico: number; medio: number; grande: number };
  radio: number;
}

const oscuro: Tema = {
  colores: { fondo: '#0f141b', texto: '#e6edf3', acento: '#7ee787' },
  espacio: { chico: 8, medio: 14, grande: 20 },
  radio: 14,
};
```

Ahora el **modo claro** tiene que cumplir **la misma interfaz**. Si te olvidas un color, TypeScript te frena **antes** de abrir la app:

```ts
const claro: Tema = {
  colores: { fondo: '#ffffff', texto: '#1d232b' },   // ✗ Property 'acento' is missing
  espacio: oscuro.espacio,
  radio: oscuro.radio,
};
```

Ese es el valor de tipar el motor: **los dos temas no pueden tener piezas distintas**. Y cada recuadro **llama** al motor que le pasan, sin saber cuál es:

```ts
function estiloDeTarjeta(tema: Tema) {
  return { background: tema.colores.fondo, padding: tema.espacio.medio, borderRadius: tema.radio };
}
```

`estiloDeTarjeta(oscuro)` y `estiloDeTarjeta(claro)` dan tarjetas distintas con **el mismo código**.

> 💡 **Idea:** `as const` (clase 52) sirve cuando hay **un solo** tema: congela los valores. Cuando hay **dos o más** que tienen que ser iguales por dentro, lo que conviene es una **interfaz**, como aquí.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dos temas con la misma forma
lenguaje: ts
pide: Ya está la interfaz `Tema` y el tema `oscuro`. Escribe `claro: Tema` con fondo `'#ffffff'`, texto `'#1d232b'` y acento `'#1a7f37'`, y **los mismos** espacios y radio que `oscuro` (reúsalos, no los copies). Después completa `estiloDeBoton(tema: Tema)`: devuelve `{ background: acento, color: fondo, padding: espacio.chico, borderRadius: radio }`. TypeScript revisa que no falte nada.
--- código
interface Tema {
  colores: { fondo: string; texto: string; acento: string };
  espacio: { chico: number; medio: number; grande: number };
  radio: number;
}

const oscuro: Tema = {
  colores: { fondo: '#0f141b', texto: '#e6edf3', acento: '#7ee787' },
  espacio: { chico: 8, medio: 14, grande: 20 },
  radio: 14,
};

// tu tema claro aquí

function estiloDeBoton(tema: Tema) {
  // tu código aquí
}
--- pruebas
prueba('el botón oscuro', () => igual(estiloDeBoton(oscuro), { background: '#7ee787', color: '#0f141b', padding: 8, borderRadius: 14 }));
prueba('el botón claro, con el mismo código', () => igual(estiloDeBoton(claro), { background: '#1a7f37', color: '#ffffff', padding: 8, borderRadius: 14 }));
prueba('el claro reúsa los espacios del oscuro', () => ok(claro.espacio === oscuro.espacio, 'usa espacio: oscuro.espacio'));
const t: Tema = claro;
--- solución
interface Tema {
  colores: { fondo: string; texto: string; acento: string };
  espacio: { chico: number; medio: number; grande: number };
  radio: number;
}

const oscuro: Tema = {
  colores: { fondo: '#0f141b', texto: '#e6edf3', acento: '#7ee787' },
  espacio: { chico: 8, medio: 14, grande: 20 },
  radio: 14,
};

const claro: Tema = {
  colores: { fondo: '#ffffff', texto: '#1d232b', acento: '#1a7f37' },
  espacio: oscuro.espacio,
  radio: oscuro.radio,
};

function estiloDeBoton(tema: Tema) {
  return { background: tema.colores.acento, color: tema.colores.fondo, padding: tema.espacio.chico, borderRadius: tema.radio };
}
```

```practica
vf :: Si el tema claro y el oscuro usan la misma interfaz, TypeScript avisa cuando a uno le falta un color
vf :: Para que un recuadro funcione con el tema claro y el oscuro, hay que escribirlo dos veces
elige :: Hay un tema oscuro y uno claro que tienen que tener las mismas piezas. ¿Qué conviene? :: as const en cada uno :: Una interfaz Tema que cumplan los dos :: Escribirlos con any → as const congela un solo objeto; la interfaz obliga a que todos tengan la misma forma.
escribe :: ¿Qué quiere decir que un recuadro "llama" al motor de diseño? :: Que no escribe colores ni medidas a mano: usa los valores del motor (tema.colores.acento, tema.espacio.medio), así cambiar el motor cambia todos los recuadros.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿por qué usas TypeScript?":** "Porque encuentra errores antes de que lleguen al usuario: si paso un texto donde va un número, o uso un campo que no existe, el editor me avisa. Anoto los parámetros y los datos que vienen de afuera, dejo que infiera lo demás, modelo los estados con uniones de literales y describo los datos con interfaces, con opcionales y readonly donde corresponde."

> 🌎 **En la vida real:** es como explicar por qué un taller usa etiquetas en cada pieza: menos errores, más rápido.

> 🌎 **Otro ejemplo:** Es como el control de calidad que revisa antes de que el producto salga.
