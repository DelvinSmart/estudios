# React Native 3: las piezas del teléfono y los estilos

> 🌎 **En la vida real:** un chef que pasa del restaurante al food truck cocina igual, pero con otra cocina: menos espacio, otra plancha. React Native es React con la "cocina" del teléfono.

> 🎙️ **El profesor dice:** hoy ves qué cambia de la web al teléfono: las piezas (`View`, `Text`, `Pressable`, `TextInput`, `Image`), las listas largas con `FlatList`, los estilos con `StyleSheet` y **Flexbox**, y los bordes seguros de la pantalla (la muesca del iPhone).

## Parte 1. Las piezas básicas

> 🌎 **En la vida real:** son los materiales de construcción: ladrillo, ventana, puerta.

> 🌎 **Otro ejemplo:** Es como el kit básico de Lego: con pocas piezas haces casi todo.

### De la web al teléfono

| En la web | En React Native | Para qué |
|---|---|---|
| `<div>` | `<View>` | Una caja que agrupa |
| `<p>`, `<span>` | `<Text>` | Todo texto **tiene** que ir dentro de `<Text>` |
| `<button>` | `<Pressable>` | Algo que se toca |
| `<input>` | `<TextInput>` | Escribir |
| `<img>` | `<Image>` | Imágenes |
| scroll de la página | `<ScrollView>` / `<FlatList>` | Contenido que se desliza |

Estas piezas se convierten en piezas **nativas** de iOS y Android: por eso la app se siente de verdad del teléfono.

> 🌎 **En la vida real:** es como hablar el mismo idioma con otro acento: las palabras cambian un poco, la idea es la misma.

> 🌎 **Otro ejemplo:** Es como cambiar de herramienta eléctrica de marca: el gatillo está en otro lado, pero perfora igual.

### FlatList para listas largas

```tsx
<FlatList
  data={gastos}
  keyExtractor={(g) => String(g.id)}
  renderItem={({ item }) => <TarjetaGasto tipo={item.tipo} valor={item.valor} />}
  ListEmptyComponent={<Text>Todavía no hay gastos</Text>}
/>
```

`FlatList` solo dibuja lo que se ve en pantalla: con 1.000 gastos, la app sigue rápida. Un `map` dentro de un `ScrollView` dibujaría los 1.000.

> 🌎 **En la vida real:** es como una cinta transportadora: solo ves las cajas que pasan frente a ti.

> 🌎 **Otro ejemplo:** Es como una vitrina que muestra unos pocos productos a la vez, aunque el depósito tenga miles.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Todo texto dentro de un Text
lenguaje: js
pide: En React Native, un texto suelto dentro de un `View` rompe la app ("Text strings must be rendered within a <Text> component"). Un árbol es `{ tipo, hijos }`, y los hijos pueden ser árboles o textos. Completa `textosSueltos(arbol)`: devuelve la lista de textos que **no** están dentro de un `Text` (vacía si está todo bien).
--- código
function textosSueltos(arbol, dentroDeText = false) {
  // tu código aquí
}
--- pruebas
const t = (tipo, ...hijos) => ({ tipo, hijos });
prueba('todo bien', () => igual(textosSueltos(t('View', t('Text', 'Mis gastos'), t('Pressable', t('Text', 'Guardar')))), []));
prueba('un texto suelto en un View', () => igual(textosSueltos(t('View', 'Hola', t('Text', 'bien'))), ['Hola']));
prueba('suelto dentro de un botón', () => igual(textosSueltos(t('View', t('Pressable', 'Guardar'))), ['Guardar']));
prueba('un Text dentro de otro Text está bien', () => igual(textosSueltos(t('Text', 'R$ ', t('Text', '30'))), []));
--- solución
function textosSueltos(arbol, dentroDeText = false) {
  if (typeof arbol === 'string') return dentroDeText ? [] : [arbol];
  const adentro = dentroDeText || arbol.tipo === 'Text';
  return arbol.hijos.flatMap((hijo) => textosSueltos(hijo, adentro));
}
```

```practica
vf :: En React Native todo texto tiene que ir dentro de un componente Text
vf :: FlatList dibuja todos los elementos de la lista aunque no se vean
elige :: ¿Qué es <View> en React Native? :: Un botón :: Una caja que agrupa, como un div :: Un texto
elige :: ¿Qué usas para algo que se toca? :: Text :: Pressable :: Image
escribe :: ¿Por qué usar FlatList en vez de map dentro de ScrollView para una lista de 1.000 gastos? :: Porque FlatList solo dibuja lo que se ve en pantalla y la app sigue rápida; con map se dibujarían los 1.000 de una vez.
```

## Parte 2. Estilos y Flexbox

> 🌎 **En la vida real:** Flexbox es como acomodar libros en un estante: en fila o en columna, juntos o separados, centrados o a un lado.

> 🌎 **Otro ejemplo:** Es como acomodar fotos en un álbum: decides la dirección y el espacio entre ellas.

### StyleSheet

```tsx
import { StyleSheet } from 'react-native';

const estilos = StyleSheet.create({
  tarjeta: { padding: 16, borderRadius: 12, backgroundColor: '#131a23', marginBottom: 8 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valor: { fontSize: 18, fontWeight: '700', color: '#7ee787' },
});

<View style={estilos.tarjeta}><View style={estilos.fila}>…</View></View>
```

No hay CSS ni clases: los estilos son **objetos de JavaScript**, con nombres en camelCase y números sin `px`.

> 🌎 **En la vida real:** es como una ficha de estilo para cada mueble: color, tamaño, separación.

> 🌎 **Otro ejemplo:** Es como el manual de identidad de una marca, pero en código.

### Flexbox (como en el Tema 16, con una diferencia)

En React Native, **la dirección por defecto es columna** (`flexDirection: 'column'`); en la web era fila. Lo demás es igual: `justifyContent` en el eje principal, `alignItems` en el otro, `gap` para separar, `flex: 1` para ocupar el espacio que queda.

> 🌎 **En la vida real:** en el teléfono, que es alto y angosto, lo natural es apilar hacia abajo.

> 🌎 **Otro ejemplo:** Es como una lista de compras: va hacia abajo, no hacia el costado.

### Colores del tema

Copiloto no escribe colores sueltos: usa un **tema** (`src/theme`) con sus colores para modo claro y oscuro, como los tokens de este mapa (Tema 16). Así cambiar un color es cambiar un lugar.

> 🌎 **En la vida real:** es como la paleta de un pintor: mezcla siempre de los mismos frascos.

> 🌎 **Otro ejemplo:** Es como el uniforme de una empresa: los colores están definidos una vez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Juntar estilos y la dirección por defecto
lenguaje: js
pide: En React Native se escribe `style={[estilos.tarjeta, activo && estilos.activa]}`. Completa `juntar(estilo)`: si es un array, junta todos sus objetos en uno (el de más a la derecha gana) e **ignora** lo falso (`false`, `null`, `undefined`); si es un objeto, devuelve una copia; si es falso, `{}`. Después, `direccion(estilo)` devuelve `flexDirection` del estilo juntado, o `'column'` si no tiene (el valor por defecto en el teléfono).
--- código
function juntar(estilo) {
  // tu código aquí
}

function direccion(estilo) {
  // tu código aquí
}
--- pruebas
const estilos = { tarjeta: { padding: 16, color: '#fff' }, activa: { color: '#7ee787' }, fila: { flexDirection: 'row' } };
prueba('el de la derecha gana', () => igual(juntar([estilos.tarjeta, estilos.activa]), { padding: 16, color: '#7ee787' }));
prueba('lo falso se ignora', () => igual(juntar([estilos.tarjeta, false, null, undefined]), { padding: 16, color: '#fff' }));
prueba('arrays dentro de arrays', () => igual(juntar([estilos.tarjeta, [estilos.fila, estilos.activa]]), { padding: 16, color: '#7ee787', flexDirection: 'row' }));
prueba('en el teléfono, columna por defecto', () => { igual(direccion(estilos.tarjeta), 'column'); igual(direccion([estilos.tarjeta, estilos.fila]), 'row'); });
--- solución
function juntar(estilo) {
  if (!estilo) return {};
  if (Array.isArray(estilo)) return estilo.reduce((todo, e) => ({ ...todo, ...juntar(e) }), {});
  return { ...estilo };
}

function direccion(estilo) {
  return juntar(estilo).flexDirection ?? 'column';
}
```

```practica
vf :: En React Native los estilos se escriben como objetos de JavaScript
vf :: En React Native, flexDirection es row por defecto, igual que en la web
elige :: ¿Cómo pones dos textos uno al lado del otro? :: flexDirection: 'column' :: flexDirection: 'row' :: position: 'row'
elige :: ¿Por qué usar un tema con colores en vez de escribirlos en cada estilo? :: Porque es obligatorio :: Para cambiar un color en un solo lugar y tener modo claro y oscuro :: Para que cargue más lento
escribe :: Escribe un estilo para centrar algo en toda la pantalla. :: { flex: 1, justifyContent: 'center', alignItems: 'center' }
```

## Parte 3. Bordes seguros, teclado y tamaños

> 🌎 **En la vida real:** al colgar un cuadro, evitas el enchufe y el interruptor; en el teléfono, evitas la muesca y la barra de abajo.

> 🌎 **Otro ejemplo:** Es como dejar margen en una hoja para que la impresora no corte el texto.

### SafeArea

El iPhone tiene la **isla** o muesca arriba y la barra de inicio abajo. Con `SafeAreaView` (de `react-native-safe-area-context`) el contenido no queda tapado.

> 🌎 **En la vida real:** es como no estacionar frente a una entrada de garaje.

> 🌎 **Otro ejemplo:** Es como el margen de seguridad de una carretera.

### El teclado y los distintos tamaños

- `KeyboardAvoidingView` sube el contenido cuando aparece el teclado, para que no tape el campo.
- Usa `flex`, porcentajes y `useWindowDimensions()` en vez de medidas fijas: hay teléfonos chicos, grandes y tablets.
- Prueba siempre en **iPhone y Android**: hay pequeñas diferencias (sombras, fuentes, teclado).

> 🌎 **En la vida real:** es como un asiento de carro que se ajusta a cada conductor.

> 🌎 **Otro ejemplo:** Es como una camiseta elástica: le queda bien a varios tamaños.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pantallas de todos los tamaños
lenguaje: js
pide: Completa dos funciones. `columnasPara(ancho)` decide cuántas columnas de tarjetas mostrar según el ancho que da `useWindowDimensions()`: menos de 600 → 1; menos de 900 → 2; si no, 3. `altoUtil(alto, bordes)` devuelve el alto que queda para el contenido, restando los bordes seguros de arriba y de abajo (`bordes.top` y `bordes.bottom`, la isla y la barra de inicio).
--- código
function columnasPara(ancho) {
  // tu código aquí
}

function altoUtil(alto, bordes) {
  // tu código aquí
}
--- pruebas
prueba('un teléfono', () => igual(columnasPara(390), 1));
prueba('los bordes de 600 y 900', () => igual([599, 600, 899, 900].map(columnasPara), [1, 2, 2, 3]));
prueba('una tablet', () => igual(columnasPara(1024), 3));
prueba('el iPhone con isla', () => igual(altoUtil(844, { top: 47, bottom: 34, left: 0, right: 0 }), 763));
--- solución
function columnasPara(ancho) {
  if (ancho < 600) return 1;
  if (ancho < 900) return 2;
  return 3;
}

function altoUtil(alto, bordes) {
  return alto - bordes.top - bordes.bottom;
}
```

```practica
vf :: SafeAreaView evita que el contenido quede tapado por la muesca o la barra de inicio
vf :: Basta con probar la app en iPhone porque Android se ve idéntico
elige :: ¿Qué pieza sube el contenido cuando aparece el teclado? :: SafeAreaView :: KeyboardAvoidingView :: FlatList
elige :: ¿Qué conviene para que la app se vea bien en teléfonos de distintos tamaños? :: Medidas fijas en todo :: flex, porcentajes y useWindowDimensions :: Una sola pantalla de 375
escribe :: Nombra dos diferencias entre hacer una pantalla web y una de React Native. :: En React Native se usan View y Text en vez de div y p, y los estilos son objetos con flexDirection en columna por defecto; además hay que cuidar la muesca, el teclado y los distintos tamaños de teléfono.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué diferencias hay entre React y React Native?":** "La lógica es la misma: componentes, props, estado y hooks. Cambian las piezas: View, Text, Pressable y TextInput en vez de etiquetas HTML, que se convierten en vistas nativas. Los estilos son objetos con StyleSheet y Flexbox en columna por defecto. Para listas largas uso FlatList, y cuido SafeArea, el teclado y los tamaños, probando en iPhone y Android."

> 🌎 **En la vida real:** es como un chef explicando qué cambia al cocinar en un food truck.

> 🌎 **Otro ejemplo:** Es como un piloto que pasa de un avión a otro modelo: mismas reglas, otros botones.
