# React Native 1: React — componentes, JSX y props

> 🌎 **En la vida real:** una app es como una casa hecha con módulos prefabricados: la ventana, la puerta y la escalera se fabrican una vez y se usan en muchos cuartos. En React, cada módulo es un **componente**.

> 🎙️ **El profesor dice:** este es el primer tema del curso **React Native**, que tiene su propio certificado. React Native **es React** para el teléfono, así que empezamos por React: qué es un componente, cómo se escribe con **JSX** y cómo recibe datos con **props**. Todo en TypeScript, como Copiloto. Necesitas el curso JavaScript + TypeScript (o al menos sus clases 47, 48 y 51).

## Parte 1. Un componente es una función

> 🌎 **En la vida real:** un componente es un molde de galletas: le das masa y sale la galleta con esa forma.

> 🌎 **Otro ejemplo:** Es como un sello: cada vez que lo usas, deja la misma figura.

### La forma más simple

```tsx
import { Text } from 'react-native';

export function Saludo() {
  return <Text>Hola, conductor 👋</Text>;
}
```

Un componente es una **función** que devuelve lo que se dibuja. Su nombre empieza con **mayúscula**. Se usa como una etiqueta: `<Saludo />`.

> 🌎 **En la vida real:** es como una receta con nombre propio: "Torta de la abuela". La pides por su nombre.

> 🌎 **Otro ejemplo:** Es como un atajo del celular con su ícono.

### Componer: componentes dentro de componentes

```tsx
export function Inicio() {
  return (
    <View>
      <Saludo />
      <ResumenDelDia />
      <BotonAgregarGasto />
    </View>
  );
}
```

La pantalla de inicio de Copiloto está hecha así: muchas piezas chicas, cada una en su archivo (`src/components`, `src/screens`).

> 🌎 **En la vida real:** es como armar un mueble con piezas: la puerta, el cajón y la repisa.

> 🌎 **Otro ejemplo:** Es como una orquesta: cada músico es un componente y la sinfonía es la pantalla.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que hace React con tus componentes
lenguaje: js
pide: Un elemento es `{ tipo, props, hijos }`. Completa `dibujar(el)`, que lo convierte en texto como lo haría React: si `el` es un texto o un número, devuélvelo como texto; si `tipo` es una **función** (un componente), llámala con `{ ...props, children: hijos }` y dibuja lo que devuelve; si es `'Text'`, une sus hijos dibujados sin espacio; si es `'View'`, únelos con un salto de línea (`'\n'`).
--- código
const h = (tipo, props = {}, ...hijos) => ({ tipo, props, hijos });

function dibujar(el) {
  // tu código aquí
}
--- pruebas
function Saludo({ nombre }) { return h('Text', {}, 'Hola, ', nombre, ' 👋'); }
function Viajes({ cantidad }) { return h('Text', {}, 'Viajes hoy: ', cantidad); }
function Inicio() { return h('View', {}, h(Saludo, { nombre: 'Delvin' }), h(Viajes, { cantidad: 3 })); }
prueba('un Text', () => igual(dibujar(h('Text', {}, 'Mis gastos')), 'Mis gastos'));
prueba('un componente con props', () => igual(dibujar(h(Saludo, { nombre: 'Ana' })), 'Hola, Ana 👋'));
prueba('un número se dibuja como texto', () => igual(dibujar(h(Viajes, { cantidad: 7 })), 'Viajes hoy: 7'));
prueba('componentes dentro de componentes', () => igual(dibujar(h(Inicio)), 'Hola, Delvin 👋\nViajes hoy: 3'));
--- solución
const h = (tipo, props = {}, ...hijos) => ({ tipo, props, hijos });

function dibujar(el) {
  if (typeof el === 'string' || typeof el === 'number') return String(el);
  if (typeof el.tipo === 'function') return dibujar(el.tipo({ ...el.props, children: el.hijos }));
  const partes = el.hijos.map(dibujar);
  return el.tipo === 'View' ? partes.join('\n') : partes.join('');
}
```

```practica
vf :: Un componente de React es una función que devuelve lo que se dibuja
vf :: Un componente se puede llamar saludo con minúscula sin problema
elige :: ¿Cómo se usa el componente Saludo dentro de otro? :: Saludo() suelto :: <Saludo /> :: {Saludo}
elige :: ¿Por qué dividir una pantalla en muchos componentes chicos? :: Para que sea más lenta :: Para reutilizarlos, entenderlos y probarlos mejor :: Porque React lo obliga
escribe :: Escribe un componente Titulo que muestre el texto Mis gastos. :: export function Titulo() { return <Text>Mis gastos</Text>; }
```

## Parte 2. JSX: HTML dentro de JavaScript (casi)

> 🌎 **En la vida real:** JSX es como un formulario con huecos para completar con datos.

> 🌎 **Otro ejemplo:** Es como una plantilla de carta con espacios para el nombre.

### Las reglas de JSX

- Se mete JavaScript entre **llaves**: `<Text>{ganancia.toFixed(2)}</Text>`.
- Un componente devuelve **un solo** elemento raíz (o un fragmento `<>…</>`).
- Las propiedades de estilo y eventos van en camelCase: `onPress`, `style`.
- Para mostrar algo solo si se cumple: `{tieneGastos && <Lista />}` o el ternario `{cargando ? <Cargando /> : <Lista />}`.

```tsx
function ResumenDelDia({ ganancia, viajes }: { ganancia: number; viajes: number }) {
  return (
    <>
      <Text>Viajes: {viajes}</Text>
      <Text>Ganancia: R$ {ganancia.toFixed(2)}</Text>
      {ganancia >= 250 && <Text>🎉 ¡Meta cumplida!</Text>}
    </>
  );
}
```

> 🌎 **En la vida real:** las llaves son los huecos del formulario donde va el dato real.

> 🌎 **Otro ejemplo:** Es como el cartel de un bus con el destino que cambia.

### Listas con map y key

```tsx
{gastos.map((g) => <TarjetaGasto key={g.id} gasto={g} />)}
```

`key` tiene que ser **único y estable** (un id), para que React sepa cuál es cuál al actualizar.

> 🌎 **En la vida real:** `key` es como el número de cada asiento: si cambias el orden de la gente, sabes quién es quién.

> 🌎 **Otro ejemplo:** Es como la placa de cada carro en un estacionamiento.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El resumen del día, con && y map
lenguaje: js
pide: Completa `lineasDelResumen({ ganancia, viajes, gastos })`: devuelve las líneas que mostraría la pantalla, en orden. Siempre `'Viajes: N'` y `'Ganancia: R$ X'` (con `toFixed(2)`). Si la ganancia es **250 o más**, agrega `'🎉 ¡Meta cumplida!'` (como el `&&` de JSX). Después, si no hay gastos, `'Todavía no hay gastos'`; si hay, una línea `'tipo: R$ X'` por gasto (como el `map`).
--- código
function lineasDelResumen({ ganancia, viajes, gastos }) {
  const lineas = [];
  // tu código aquí
  return lineas;
}
--- pruebas
prueba('un día normal, sin gastos', () => igual(lineasDelResumen({ ganancia: 120, viajes: 8, gastos: [] }), ['Viajes: 8', 'Ganancia: R$ 120.00', 'Todavía no hay gastos']));
prueba('la meta, justo en el borde', () => igual(lineasDelResumen({ ganancia: 250, viajes: 15, gastos: [] })[2], '🎉 ¡Meta cumplida!'));
prueba('con gastos, uno por línea', () => igual(lineasDelResumen({ ganancia: 90.5, viajes: 5, gastos: [{ id: 1, tipo: 'lavado', valor: 30 }, { id: 2, tipo: 'peaje', valor: 5.4 }] }), ['Viajes: 5', 'Ganancia: R$ 90.50', 'lavado: R$ 30.00', 'peaje: R$ 5.40']));
--- solución
function lineasDelResumen({ ganancia, viajes, gastos }) {
  const lineas = [];
  lineas.push(`Viajes: ${viajes}`);
  lineas.push(`Ganancia: R$ ${ganancia.toFixed(2)}`);
  if (ganancia >= 250) lineas.push('🎉 ¡Meta cumplida!');
  if (gastos.length === 0) lineas.push('Todavía no hay gastos');
  else lineas.push(...gastos.map((g) => `${g.tipo}: R$ ${g.valor.toFixed(2)}`));
  return lineas;
}
```

```practica
vf :: En JSX, el código JavaScript va entre llaves
vf :: Un componente puede devolver dos elementos sueltos sin envolverlos
elige :: ¿Qué hace {ganancia >= 250 && <Text>Meta</Text>}? :: Siempre muestra Meta :: Muestra Meta solo si ganancia es 250 o más :: Da error
elige :: ¿Qué conviene usar como key al listar gastos? :: El índice siempre :: El id único de cada gasto :: Un número al azar
escribe :: Escribe JSX que muestre "Cargando…" si cargando es true y la lista si no. :: {cargando ? <Text>Cargando…</Text> : <Lista />}
```

## Parte 3. Props: datos de afuera

> 🌎 **En la vida real:** las props son como los ingredientes que le das al cocinero: la receta es la misma, el plato cambia.

> 🌎 **Otro ejemplo:** Es como llenar un formulario: el formulario es igual, los datos son tuyos.

### Recibir y tipar props

```tsx
interface PropsTarjeta {
  tipo: string;
  valor: number;
  alTocar?: () => void;   // opcional: una función
}

export function TarjetaGasto({ tipo, valor, alTocar }: PropsTarjeta) {
  return (
    <Pressable onPress={alTocar}>
      <Text>{tipo}</Text>
      <Text>R$ {valor.toFixed(2)}</Text>
    </Pressable>
  );
}

<TarjetaGasto tipo="lavado" valor={30} alTocar={() => abrirDetalle(3)} />
```

Las props **no se cambian** dentro del componente: vienen de arriba. Para avisar hacia arriba, el padre pasa una **función** (como `alTocar`).

> 🌎 **En la vida real:** el hijo no cambia la lista de compras que le dio su mamá; si necesita algo, la llama.

> 🌎 **Otro ejemplo:** Es como un empleado que recibe instrucciones y, para pedir algo, usa el teléfono interno.

### Los datos bajan, los avisos suben

Este es el flujo de React: **los datos bajan** por props de padre a hijo, y **los avisos suben** llamando funciones que el padre pasó. Así siempre sabes de dónde viene cada dato.

> 🌎 **En la vida real:** es como una empresa: las órdenes bajan del jefe y los informes suben.

> 🌎 **Otro ejemplo:** Es como un río con un teléfono: el agua baja, las llamadas suben.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los datos bajan, los avisos suben
lenguaje: js
pide: Completa dos funciones. `crearTarjeta({ tipo, valor, alTocar })` devuelve `{ texto, tocar }`: `texto` es `'tipo · R$ X'` (con `toFixed(2)`) y `tocar()` llama a `alTocar` **solo si existe** (es opcional). `crearLista(gastos, alElegir)` (el padre) devuelve una tarjeta por gasto, y al tocar una le avisa al padre con `alElegir(id)` de ese gasto.
--- código
function crearTarjeta({ tipo, valor, alTocar }) {
  // tu código aquí
}

function crearLista(gastos, alElegir) {
  // tu código aquí
}
--- pruebas
const gastos = [{ id: 1, tipo: 'lavado', valor: 30 }, { id: 2, tipo: 'peaje', valor: 5 }];
prueba('el texto de la tarjeta', () => igual(crearTarjeta({ tipo: 'lavado', valor: 30 }).texto, 'lavado · R$ 30.00'));
prueba('sin alTocar no se rompe', () => { crearTarjeta({ tipo: 'peaje', valor: 5 }).tocar(); });
prueba('el aviso sube al padre con el id', () => {
  const elegidos = [];
  const lista = crearLista(gastos, (id) => elegidos.push(id));
  lista[1].tocar();
  igual(elegidos, [2]);
});
prueba('una tarjeta por gasto', () => igual(crearLista(gastos, () => {}).map((t) => t.texto), ['lavado · R$ 30.00', 'peaje · R$ 5.00']));
--- solución
function crearTarjeta({ tipo, valor, alTocar }) {
  return {
    texto: `${tipo} · R$ ${valor.toFixed(2)}`,
    tocar() { if (alTocar) alTocar(); },
  };
}

function crearLista(gastos, alElegir) {
  return gastos.map((g) => crearTarjeta({ tipo: g.tipo, valor: g.valor, alTocar: () => alElegir(g.id) }));
}
```

📱 **Ahora, en la app de verdad:** toca **▶ abrir la app en Snack**, cambia el código y mira la app. Marca cada cosa cuando la veas.

```snack
titulo: Una tarjeta, tres gastos
pide: Ya está el componente `TarjetaGasto`, pero muestra siempre lo mismo. Haz que reciba **props** (`tipo` y `valor`) y úsalo tres veces con datos distintos: combustible R$ 150, lavado R$ 30 y peaje R$ 12,50.
--- código
import { Text, View, StyleSheet } from 'react-native';

function TarjetaGasto() {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.tipo}>combustible</Text>
      <Text style={estilos.valor}>R$ 150,00</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={estilos.pantalla}>
      <TarjetaGasto />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, justifyContent: 'center', padding: 20, gap: 12, backgroundColor: '#0f141b' },
  tarjeta: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 14, backgroundColor: '#18212c' },
  tipo: { fontSize: 16, color: '#e6edf3' },
  valor: { fontSize: 16, fontWeight: '700', color: '#7ee787' },
});
--- comprobar
- Se ven tres tarjetas, una debajo de la otra
- Cada una dice su tipo: combustible, lavado y peaje
- Cada una tiene su valor: R$ 150,00, R$ 30,00 y R$ 12,50
- `TarjetaGasto` está escrita una sola vez: lo que cambia llega por props
--- solución
import { Text, View, StyleSheet } from 'react-native';

function TarjetaGasto({ tipo, valor }) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.tipo}>{tipo}</Text>
      <Text style={estilos.valor}>R$ {valor.toFixed(2).replace('.', ',')}</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={estilos.pantalla}>
      <TarjetaGasto tipo="combustible" valor={150} />
      <TarjetaGasto tipo="lavado" valor={30} />
      <TarjetaGasto tipo="peaje" valor={12.5} />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, justifyContent: 'center', padding: 20, gap: 12, backgroundColor: '#0f141b' },
  tarjeta: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 14, backgroundColor: '#18212c' },
  tipo: { fontSize: 16, color: '#e6edf3' },
  valor: { fontSize: 16, fontWeight: '700', color: '#7ee787' },
});
```

```practica
vf :: Un componente puede cambiar las props que recibe
vf :: Para avisarle algo al padre, el hijo llama una función que el padre le pasó por props
elige :: ¿Cómo se pasa un número como prop? :: valor="30" :: valor={30} :: valor=(30)
elige :: ¿Qué significa alTocar?: () => void en la interfaz? :: Es obligatoria :: Es una función opcional que no devuelve nada :: Es un número
escribe :: Explica el flujo de datos de React en una frase. :: Los datos bajan del padre al hijo por props y los avisos suben cuando el hijo llama una función que el padre le pasó.
```


**Comprobación antes de seguir**

Crea otra tarjeta a partir del ejemplo y enumera los datos que recibe.

<details>
<summary>Necesito una pista</summary>

Primero cambia los valores que pasan desde el componente padre.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es un componente y qué son las props?":** "Un componente es una función que devuelve lo que se dibuja, con nombre en mayúscula, escrita en JSX. Las props son los datos que recibe del padre, tipados con una interfaz en TypeScript y de solo lectura. Los datos bajan por props y los avisos suben llamando funciones que el padre pasa. Al listar uso map con un key único, como el id."

> 🌎 **En la vida real:** es como explicar cómo se arma una casa prefabricada y cómo llegan los materiales a cada cuarto.

> 🌎 **Otro ejemplo:** Es como un director que explica quién le pasa qué a quién en una orquesta.
