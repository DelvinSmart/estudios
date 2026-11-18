# JavaScript + TypeScript 9: un proyecto con pruebas

> 🌎 **En la vida real:** después del curso de manejo viene el primer viaje solo. Esta clase junta todo en un proyecto chico pero real, en TypeScript, con sus pruebas.

> 🎙️ **El profesor dice:** la última clase del curso **JavaScript + TypeScript**. Vas a armar **"gastos del carro"**: un módulo en TypeScript con el CRUD del laboratorio, tipos, validación y cálculos, y lo vas a probar con **Vitest** (como Jest, que viste en los Temas 02 y 03). Al final, cómo lo usaría una pantalla de React.

## Parte 1. Crear el proyecto

> 🌎 **En la vida real:** antes de cocinar, preparas la mesa: tabla, cuchillo, ingredientes.

> 🌎 **Otro ejemplo:** Es como armar el taller antes de empezar el mueble.

### Los comandos

```bash
mkdir gastos-del-carro && cd gastos-del-carro
npm init -y
npm install -D typescript vitest
npx tsc --init          # crea tsconfig.json (deja "strict": true)
```

En `package.json` agrega `"type": "module"` y el script `"test": "vitest run"`.

> 🌎 **En la vida real:** es como comprar las herramientas y anotar en la pared dónde va cada una.

> 🌎 **Otro ejemplo:** Es como abrir una cuenta y configurar las alertas antes de usarla.

### La estructura

```text
gastos-del-carro/
  src/gastos.ts         → tipos y el CRUD
  src/calculos.ts       → totales y resúmenes (funciones puras)
  tests/gastos.test.ts
  tests/calculos.test.ts
```

> 🌎 **En la vida real:** es como separar herramientas de corte y de medida en cajones distintos.

> 🌎 **Otro ejemplo:** Es como las secciones de un supermercado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El package.json del proyecto
lenguaje: js
pide: Completa el objeto `paquete` como queda el `package.json` de esta parte: con `"type": "module"`, un script `test` que corra `vitest run`, y `typescript` y `vitest` en `devDependencies` (las versiones pueden ser cualquiera que empiece con `^`).
--- código
const paquete = {
  name: 'gastos-del-carro',
  // tu código aquí
};
--- pruebas
prueba('usa módulos (type: module)', () => igual(paquete.type, 'module'));
prueba('npm test corre vitest', () => igual(paquete.scripts?.test, 'vitest run'));
prueba('vitest es de desarrollo', () => ok(String(paquete.devDependencies?.vitest).startsWith('^'), 'falta vitest en devDependencies'));
prueba('typescript es de desarrollo', () => ok(String(paquete.devDependencies?.typescript).startsWith('^'), 'falta typescript en devDependencies'));
prueba('no van en dependencies', () => ok(!paquete.dependencies?.vitest && !paquete.dependencies?.typescript, 'vitest y typescript no se necesitan para que la app funcione'));
--- solución
const paquete = {
  name: 'gastos-del-carro',
  type: 'module',
  scripts: { test: 'vitest run' },
  devDependencies: { typescript: '^5.4.0', vitest: '^2.1.0' },
};
```

```practica
vf :: npx tsc --init crea el archivo tsconfig.json
vf :: vitest se instala como dependencia de la app final, no de desarrollo
elige :: ¿Qué script agregas para correr las pruebas? :: "start": "vitest" :: "test": "vitest run" :: "build": "test"
elige :: ¿Dónde van las funciones puras de cálculo? :: tests :: src/calculos.ts :: node_modules
escribe :: Escribe los comandos para empezar un proyecto de TypeScript con Vitest. :: mkdir del proyecto y cd; npm init -y; npm install -D typescript vitest; npx tsc --init; y en package.json "type": "module" y "test": "vitest run".
```

## Parte 2. El código

> 🌎 **En la vida real:** es la libreta de gastos del conductor, pero que no deja anotar un gasto negativo y suma sola.

> 🌎 **Otro ejemplo:** Es como una caja registradora que no acepta montos imposibles.

### src/gastos.ts

```ts
export type TipoGasto = 'combustible' | 'lavado' | 'peaje' | 'mantenimiento' | 'otro';

export interface Gasto {
  id: number;
  tipo: TipoGasto;
  valor: number;
  fecha: string; // AAAA-MM-DD
}

export function crearAlmacen() {
  let gastos: Gasto[] = [];
  let siguienteId = 1;

  return {
    crear(datos: Omit<Gasto, 'id'>): Gasto {
      if (!(datos.valor > 0)) throw new Error('El valor tiene que ser mayor que 0');
      const nuevo = { ...datos, id: siguienteId++ };
      gastos = [...gastos, nuevo];
      return nuevo;
    },
    listar: (): Gasto[] => gastos,
    buscar: (id: number): Gasto | null => gastos.find((g) => g.id === id) ?? null,
    actualizar(id: number, cambios: Partial<Omit<Gasto, 'id'>>): Gasto | null {
      const actual = gastos.find((g) => g.id === id);
      if (!actual) return null;
      if (cambios.valor !== undefined && !(cambios.valor > 0)) throw new Error('El valor tiene que ser mayor que 0');
      const nuevo = { ...actual, ...cambios };
      gastos = gastos.map((g) => (g.id === id ? nuevo : g));
      return nuevo;
    },
    borrar(id: number): boolean {
      const antes = gastos.length;
      gastos = gastos.filter((g) => g.id !== id);
      return gastos.length < antes;
    },
  };
}
```

Fíjate: closure (clase 47), spread sin cambiar originales (48), tipos y `Omit`/`Partial` (51 y 52).

> 🌎 **En la vida real:** `crearAlmacen` es como una caja con candado: solo se abre con sus botones.

> 🌎 **Otro ejemplo:** Es como un cajero automático: solo puedes hacer lo que sus botones permiten.

### src/calculos.ts

```ts
import type { Gasto, TipoGasto } from './gastos.js';

export const totalGastos = (gastos: Gasto[]): number =>
  Math.round(gastos.reduce((s, g) => s + g.valor, 0) * 100) / 100;

export function porTipo(gastos: Gasto[]): Partial<Record<TipoGasto, number>> {
  const r: Partial<Record<TipoGasto, number>> = {};
  for (const g of gastos) r[g.tipo] = (r[g.tipo] ?? 0) + g.valor;
  return r;
}
```

> 🌎 **En la vida real:** es como el resumen del extracto: total y por categoría.

> 🌎 **Otro ejemplo:** Es como el cierre de caja por tipo de producto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El almacén de gastos
lenguaje: ts
pide: Escribe `crearAlmacen()` como en esta parte: guarda los gastos **adentro** (closure) y devuelve `crear`, `listar` y `borrar`. `crear` rechaza un valor de 0 o menos con un error, y pone el `id` (1, 2, 3…). No cambies la lista: crea una nueva cada vez.
--- código
interface Gasto { id: number; tipo: string; valor: number; }

function crearAlmacen() {
  // tu código aquí
  return {
    crear(datos: Omit<Gasto, 'id'>): Gasto { throw new Error('falta escribir crear'); },
    listar(): Gasto[] { return []; },
    borrar(id: number): boolean { return false; },
  };
}
--- pruebas
prueba('crear pone id 1 y 2', () => { const a = crearAlmacen(); igual([a.crear({ tipo: 'x', valor: 1 }).id, a.crear({ tipo: 'y', valor: 2 }).id], [1, 2]); });
prueba('listar devuelve lo creado', () => { const a = crearAlmacen(); a.crear({ tipo: 'lavado', valor: 30 }); igual(a.listar(), [{ tipo: 'lavado', valor: 30, id: 1 }]); });
prueba('valor 0 da error', () => { const a = crearAlmacen(); let fallo = false; try { a.crear({ tipo: 'x', valor: 0 }); } catch (e) { fallo = true; } ok(fallo, 'tenía que lanzar un error'); });
prueba('borrar quita y devuelve true', () => { const a = crearAlmacen(); const g = a.crear({ tipo: 'x', valor: 5 }); igual([a.borrar(g.id), a.listar().length], [true, 0]); });
prueba('borrar algo que no existe da false', () => igual(crearAlmacen().borrar(99), false));
prueba('dos almacenes no se mezclan', () => { const a = crearAlmacen(); const b = crearAlmacen(); a.crear({ tipo: 'x', valor: 1 }); igual(b.listar().length, 0); });
--- solución
interface Gasto { id: number; tipo: string; valor: number; }

function crearAlmacen() {
  let gastos: Gasto[] = [];
  let siguienteId = 1;
  return {
    crear(datos: Omit<Gasto, 'id'>): Gasto {
      if (!(datos.valor > 0)) throw new Error('El valor tiene que ser mayor que 0');
      const nuevo = { ...datos, id: siguienteId++ };
      gastos = [...gastos, nuevo];
      return nuevo;
    },
    listar(): Gasto[] {
      return gastos;
    },
    borrar(id: number): boolean {
      const antes = gastos.length;
      gastos = gastos.filter((g) => g.id !== id);
      return gastos.length < antes;
    },
  };
}
```

```practica
vf :: El almacén guarda los gastos en una variable que solo sus funciones pueden cambiar
vf :: actualizar cambia el objeto original con gastos[i].valor = ...
elige :: ¿Por qué crear recibe Omit<Gasto, 'id'>? :: Porque id es secreto :: Porque el id lo pone el almacén, no quien llama :: Porque es más corto
elige :: ¿Para qué sirve import type? :: Para importar valores :: Para importar solo tipos, que desaparecen al convertir a JavaScript :: Para importar CSS
escribe :: ¿Qué validación hace actualizar y por qué? :: Si el cambio trae un valor, revisa que sea mayor que 0 y si no lanza un error, para que no se pueda dejar un gasto con un valor imposible.
```

## Parte 3. Las pruebas

> 🌎 **En la vida real:** antes de entregar el carro, el mecánico lo prueba en la calle.

> 🌎 **Otro ejemplo:** Es como revisar la cuenta de la factura antes de pagar.

### tests/gastos.test.ts

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { crearAlmacen } from '../src/gastos.js';

describe('almacén de gastos', () => {
  let almacen: ReturnType<typeof crearAlmacen>;
  beforeEach(() => { almacen = crearAlmacen(); });

  it('crea con id que sube de a uno', () => {
    const a = almacen.crear({ tipo: 'combustible', valor: 150, fecha: '2026-11-16' });
    const b = almacen.crear({ tipo: 'lavado', valor: 30, fecha: '2026-11-16' });
    expect([a.id, b.id]).toEqual([1, 2]);
  });

  it('no acepta valores de cero o negativos', () => {
    expect(() => almacen.crear({ tipo: 'otro', valor: 0, fecha: '2026-11-16' })).toThrow();
  });

  it('actualiza y borra', () => {
    const g = almacen.crear({ tipo: 'peaje', valor: 12.5, fecha: '2026-11-16' });
    expect(almacen.actualizar(g.id, { valor: 15 })?.valor).toBe(15);
    expect(almacen.borrar(g.id)).toBe(true);
    expect(almacen.buscar(g.id)).toBeNull();
  });
});
```

```bash
npm test
```

`beforeEach` crea un almacén nuevo antes de cada prueba: así ninguna depende de otra.

> 🌎 **En la vida real:** `beforeEach` es limpiar la mesa antes de cada experimento.

> 🌎 **Otro ejemplo:** Es como empezar cada partido con el marcador en cero.

### Probar los cálculos

```ts
import { it, expect } from 'vitest';
import { totalGastos, porTipo } from '../src/calculos.js';

const gastos = [
  { id: 1, tipo: 'combustible', valor: 150, fecha: 'x' },
  { id: 2, tipo: 'combustible', valor: 50.25, fecha: 'x' },
  { id: 3, tipo: 'lavado', valor: 30, fecha: 'x' },
] as const;

it('suma con dos decimales', () => expect(totalGastos([...gastos])).toBe(230.25));
it('agrupa por tipo', () => expect(porTipo([...gastos])).toEqual({ combustible: 200.25, lavado: 30 }));
it('una lista vacía da 0', () => expect(totalGastos([])).toBe(0));
```

> 🌎 **En la vida real:** es como probar la calculadora con cuentas que ya sabes la respuesta.

> 🌎 **Otro ejemplo:** Es como pesar algo conocido para comprobar que la balanza está bien.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Haz pasar las pruebas (como en un equipo de verdad)
lenguaje: ts
pide: Las **pruebas ya están escritas** (léelas: dicen qué tiene que hacer `porTipo`). Escribe la función hasta que todas pasen: devuelve la suma de los gastos **por tipo**, redondeada a dos decimales. Así se trabaja muchas veces: primero la prueba, después el código.
--- código
interface Gasto { tipo: 'combustible' | 'lavado' | 'peaje'; valor: number; }

function porTipo(gastos: Gasto[]): Partial<Record<Gasto['tipo'], number>> {
  // tu código aquí
  return {};
}
--- pruebas
const g: Gasto[] = [{ tipo: 'combustible', valor: 150 }, { tipo: 'combustible', valor: 50.25 }, { tipo: 'lavado', valor: 0.1 }, { tipo: 'lavado', valor: 0.2 }];
prueba('suma el combustible', () => igual(porTipo(g).combustible, 200.25));
prueba('0.1 + 0.2 de lavado da 0.3 (redondeado)', () => igual(porTipo(g).lavado, 0.3));
prueba('un tipo sin gastos no aparece', () => igual(porTipo(g).peaje, undefined));
prueba('sin gastos da un objeto vacío', () => igual(porTipo([]), {}));
--- solución
interface Gasto { tipo: 'combustible' | 'lavado' | 'peaje'; valor: number; }

function porTipo(gastos: Gasto[]): Partial<Record<Gasto['tipo'], number>> {
  const r: Partial<Record<Gasto['tipo'], number>> = {};
  for (const g of gastos) {
    r[g.tipo] = Math.round(((r[g.tipo] ?? 0) + g.valor) * 100) / 100;
  }
  return r;
}
```

```practica
vf :: beforeEach corre antes de cada prueba
vf :: toThrow comprueba que una función devuelve un número
elige :: ¿Qué compara toEqual? :: Que sean el mismo objeto en memoria :: Que tengan el mismo contenido :: Que sean texto
elige :: ¿Qué caso borde se prueba en los cálculos? :: Un gasto de un millón :: Una lista vacía :: Un texto
escribe :: Escribe una prueba que confirme que borrar un id que no existe devuelve false. :: it('borrar un id que no existe da false', () => { expect(almacen.borrar(99)).toBe(false); });
```

## Parte 4. De aquí a React

> 🌎 **En la vida real:** el motor ya funciona; ahora le pones la carrocería y el tablero.

> 🌎 **Otro ejemplo:** Es como tener la receta probada y ahora decidir cómo se sirve.

### La lógica separada de la pantalla

Como `gastos.ts` y `calculos.ts` no saben nada de pantallas, los puede usar una web en React, una app en React Native (el próximo curso) o un servidor en Node. La pantalla solo llama funciones y muestra:

```tsx
function ListaGastos({ gastos }: { gastos: Gasto[] }) {
  return (
    <ul>
      {gastos.map((g) => <li key={g.id}>{g.tipo}: R$ {g.valor.toFixed(2)}</li>)}
      <li><b>Total: R$ {totalGastos(gastos).toFixed(2)}</b></li>
    </ul>
  );
}
```

> 🌎 **En la vida real:** es como un motor que sirve en un carro o en una lancha.

> 🌎 **Otro ejemplo:** Es como una receta que sirve para el restaurante y para el delivery.

### Súbelo a GitHub

Con su `README`, sus pruebas pasando y, si quieres, el CI corriendo `npm test` en cada subida (Tema 04). Eso es un proyecto de portafolio.

> 🌎 **En la vida real:** es como un trabajo con firma y certificado de calidad.

> 🌎 **Otro ejemplo:** Es como un músico que sube su demo bien grabada.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La lógica separada de la pantalla
lenguaje: ts
pide: Antes de dibujar una pantalla en React, se prepara lo que va a mostrar con una función **pura** (sin pantalla, fácil de probar). Completa `filasParaPantalla`: por cada gasto, una fila con el `texto` del tipo con mayúscula inicial y el `valor` como `'R$ 150.00'`.
--- código
interface Gasto { tipo: string; valor: number; }
interface Fila { texto: string; valor: string; }

function filasParaPantalla(gastos: Gasto[]): Fila[] {
  // tu código aquí
  return [];
}
--- pruebas
prueba('una fila por gasto', () => igual(filasParaPantalla([{ tipo: 'lavado', valor: 30 }, { tipo: 'peaje', valor: 8.5 }]).length, 2));
prueba('el texto con mayúscula', () => igual(filasParaPantalla([{ tipo: 'combustible', valor: 150 }])[0].texto, 'Combustible'));
prueba('el valor con R$ y dos decimales', () => igual(filasParaPantalla([{ tipo: 'peaje', valor: 8.5 }])[0].valor, 'R$ 8.50'));
--- solución
interface Gasto { tipo: string; valor: number; }
interface Fila { texto: string; valor: string; }

function filasParaPantalla(gastos: Gasto[]): Fila[] {
  return gastos.map((g) => ({
    texto: g.tipo[0].toUpperCase() + g.tipo.slice(1),
    valor: `R$ ${g.valor.toFixed(2)}`,
  }));
}
```

```practica
vf :: La lógica separada de la pantalla se puede usar en React, React Native o Node
vf :: Para usar gastos.ts en React hay que copiarlo dentro de cada componente
elige :: ¿Qué va en el key de cada li de la lista? :: El índice siempre :: Un id único y estable, como g.id :: Nada
elige :: ¿Qué hace que este proyecto sirva para el portafolio? :: Que sea secreto :: Que tenga README, pruebas que pasan y CI :: Que no tenga tipos
escribe :: Explica por qué conviene separar la lógica de la pantalla. :: Porque la lógica se puede probar sola y usar en distintas pantallas (web, app o servidor); si cambia el diseño, los cálculos no se rompen.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿muéstrame algo que hayas hecho en TypeScript?":** "Un módulo de gastos del carro: un almacén con closure que expone crear, listar, buscar, actualizar y borrar, con tipos estrictos, Omit y Partial para crear y actualizar, validación de valores y sin cambiar los datos originales. Los cálculos son funciones puras. Todo probado con Vitest, incluidos los errores y los casos borde, y la lógica está separada de la pantalla para usarla en React o React Native."

> 🌎 **En la vida real:** es como mostrar un mueble terminado y explicar cada unión.

> 🌎 **Otro ejemplo:** Es como un portafolio de fotos con la explicación de cada toma.
