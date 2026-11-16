# React Native 5: navegación entre pantallas y guardar en el teléfono

> 🌎 **En la vida real:** una app con varias pantallas es como un edificio con pisos y pasillos: necesitas ascensor, carteles y la forma de volver a la entrada.

> 🎙️ **El profesor dice:** hoy: cómo se pasa de una pantalla a otra con **React Navigation** (lo que usa Copiloto: pestañas abajo y pilas de pantallas), cómo se mandan datos a la pantalla siguiente, y cómo guardar cosas en el teléfono con **AsyncStorage** para que sigan ahí al cerrar la app.

## Parte 1. Pilas y pestañas

> 🌎 **En la vida real:** una pila es como un montón de platos: pones uno encima y para volver sacas el de arriba. Las pestañas son las secciones de un periódico: saltas entre ellas.

> 🌎 **Otro ejemplo:** Es como los cuartos de una casa (pestañas) y abrir un cajón dentro de un cuarto (pila).

### Las pestañas de abajo

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Pestanas = createBottomTabNavigator();

export function App() {
  return (
    <NavigationContainer>
      <Pestanas.Navigator>
        <Pestanas.Screen name="Inicio" component={PantallaInicio} />
        <Pestanas.Screen name="Gastos" component={PantallaGastos} />
        <Pestanas.Screen name="Perfil" component={PantallaPerfil} />
      </Pestanas.Navigator>
    </NavigationContainer>
  );
}
```

Copiloto tiene su versión en `src/navigation/MainTabNavigator.tsx`.

> 🌎 **En la vida real:** son como los botones del ascensor: cada uno lleva a un piso.

> 🌎 **Otro ejemplo:** Es como el menú de abajo de WhatsApp: chats, estados, llamadas.

### La pila: ir y volver

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Pila = createNativeStackNavigator();

<Pila.Navigator>
  <Pila.Screen name="ListaGastos" component={ListaGastos} />
  <Pila.Screen name="DetalleGasto" component={DetalleGasto} />
</Pila.Navigator>
```

`native-stack` usa las transiciones **nativas** del teléfono (deslizar para volver en el iPhone).

> 🌎 **En la vida real:** es como abrir carpetas una dentro de otra y volver con "atrás".

> 🌎 **Otro ejemplo:** Es como las páginas de un libro: avanzas y retrocedes.

```practica
vf :: Copiloto usa React Navigation con pestañas abajo y pilas de pantallas
vf :: native-stack usa transiciones dibujadas por JavaScript, distintas a las del teléfono
elige :: ¿Qué navegador usas para las secciones fijas de abajo? :: native-stack :: bottom-tabs :: FlatList
elige :: ¿Qué envuelve toda la navegación? :: View :: NavigationContainer :: SafeAreaView
escribe :: Explica la diferencia entre una pila y unas pestañas. :: En una pila las pantallas se apilan y vuelves a la anterior con atrás; en las pestañas saltas entre secciones fijas que están al mismo nivel.
```

## Parte 2. Ir a otra pantalla con datos

> 🌎 **En la vida real:** al pasar a otra ventanilla, te dan tu número de turno para que sepan quién eres.

> 🌎 **Otro ejemplo:** Es como un pase de un piso a otro con tu nombre escrito.

### navigate y params, con tipos

```tsx
type RutasGastos = {
  ListaGastos: undefined;
  DetalleGasto: { id: number };
};

// en ListaGastos
navigation.navigate('DetalleGasto', { id: gasto.id });

// en DetalleGasto
function DetalleGasto({ route }: NativeStackScreenProps<RutasGastos, 'DetalleGasto'>) {
  const { id } = route.params;   // TypeScript sabe que id es number
  // …buscar el gasto con ese id
}
```

Manda **solo el id**, no el objeto entero: la pantalla de detalle lo busca. Así, si el gasto cambia, siempre ves lo último.

> 🌎 **En la vida real:** al médico le das tu número de historia clínica, no toda la carpeta.

> 🌎 **Otro ejemplo:** Es como dar el número de pedido en vez de describir todo el pedido.

### Volver y los enlaces

`navigation.goBack()` vuelve. Y con *deep links* (`src/navigation/linking.ts` en Copiloto) un enlace puede abrir una pantalla exacta, como el `#/clase/15` de este mapa.

> 🌎 **En la vida real:** un deep link es como una dirección que te lleva a la oficina exacta, no a la portería.

> 🌎 **Otro ejemplo:** Es como el marcador de un libro que te abre en la página justa.

```practica
vf :: Conviene mandar a la pantalla de detalle solo el id, no el objeto entero
vf :: Con TypeScript no se pueden tipar los params de las rutas
elige :: ¿Cómo vas a la pantalla DetalleGasto con el id 3? :: navigation.go(3) :: navigation.navigate('DetalleGasto', { id: 3 }) :: route.open(3)
elige :: ¿Qué hace navigation.goBack()? :: Cierra la app :: Vuelve a la pantalla anterior :: Borra el historial
escribe :: ¿Qué es un deep link? :: Un enlace que abre la app directo en una pantalla exacta, como una dirección que lleva a la oficina justa y no a la entrada.
```

## Parte 3. Guardar en el teléfono: AsyncStorage

> 🌎 **En la vida real:** AsyncStorage es la libreta que dejas en la guantera: sigue ahí aunque apagues el carro.

> 🌎 **Otro ejemplo:** Es como el localStorage de este mapa, pero en el teléfono.

### Guardar y leer

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

async function guardarPreferencia(oscuro: boolean) {
  await AsyncStorage.setItem('tema', JSON.stringify(oscuro));
}
async function leerPreferencia(): Promise<boolean> {
  const texto = await AsyncStorage.getItem('tema');
  return texto ? JSON.parse(texto) : false;
}
```

Es **asíncrono** (clase 49) y solo guarda **texto** (por eso `JSON.stringify`, clase 48).

> 🌎 **En la vida real:** es como guardar en un sobre: escribes, cierras y después abres.

> 🌎 **Otro ejemplo:** Es como el casillero de un club: dejas tus cosas y las encuentras al volver.

### Qué guardar ahí y qué no

✅ Preferencias, borradores, datos para ver sin internet.
❌ **Contraseñas, tokens o datos sensibles**: AsyncStorage no está cifrado. Para eso existe `expo-secure-store` (llavero del iPhone / Keystore de Android).

> 🌎 **En la vida real:** en la guantera dejas el manual del carro, no tus documentos de identidad.

> 🌎 **Otro ejemplo:** Es como una nota en la nevera frente a una caja fuerte.

```practica
vf :: AsyncStorage guarda datos que siguen ahí al cerrar la app
vf :: AsyncStorage está cifrado y es ideal para guardar contraseñas
elige :: ¿Por qué se usa JSON.stringify al guardar en AsyncStorage? :: Para cifrar :: Porque solo guarda texto :: Para que sea más rápido
elige :: ¿Dónde guardarías un token de sesión? :: AsyncStorage :: expo-secure-store :: Un archivo de texto
escribe :: Escribe cómo guardar y leer un número de meta diaria con AsyncStorage. :: await AsyncStorage.setItem('meta', JSON.stringify(250)); const meta = JSON.parse((await AsyncStorage.getItem('meta')) ?? '0');
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas la navegación en React Native?":** "Con React Navigation: pestañas abajo para las secciones principales y native-stack para ir y volver con transiciones nativas. Las rutas están tipadas en TypeScript y paso solo ids en los params. Uso deep links para abrir pantallas exactas. Para guardar en el teléfono uso AsyncStorage con JSON para preferencias y datos sin internet, y SecureStore para cualquier secreto."

> 🌎 **En la vida real:** es como explicar el plano de un edificio: pisos, ascensores y dónde están las cajas fuertes.

> 🌎 **Otro ejemplo:** Es como un guía de museo que explica las salas y cómo moverse entre ellas.
