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
