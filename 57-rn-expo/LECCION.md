# React Native 4: Expo — crear la app y verla en tu iPhone

> 🌎 **En la vida real:** Expo es como un kit de cocina completo: no tienes que fabricar el horno ni comprar cada olla por separado. Abres la caja y cocinas.

> 🎙️ **El profesor dice:** hoy creas tu primera app de React Native con **Expo** (lo que usa Copiloto), la abres en tu iPhone con **Expo Go** sin cables ni cuentas de Apple, y la pruebas en el navegador con **Expo Snack**. Todo gratis.

## Parte 1. Crear el proyecto

> 🌎 **En la vida real:** es como una plantilla de casa ya con cimientos y cañerías.

> 🌎 **Otro ejemplo:** Es como abrir una cuenta nueva que ya viene configurada.

### Los comandos

```bash
npx create-expo-app@latest mis-gastos
cd mis-gastos
npx expo start
```

`npx expo start` levanta el servidor de desarrollo y muestra un **código QR**.

> 🌎 **En la vida real:** es como prender la cocina y dejarla lista para cocinar.

> 🌎 **Otro ejemplo:** Es como abrir la tienda y dar vuelta el cartel a "abierto".

### Qué trae el proyecto

- `package.json` con `expo`, `react` y `react-native`.
- `app.json` (o `app.config`): nombre, ícono, colores, permisos de la app. Copiloto tiene el suyo en la raíz.
- Una carpeta de pantallas (con plantillas nuevas suele ser `app/`, que usa **Expo Router**; Copiloto usa `src/screens` con **React Navigation**, que verás en la próxima clase).

> 🌎 **En la vida real:** `app.json` es como la ficha de la casa: dirección, color de fachada y cuántas llaves hay.

> 🌎 **Otro ejemplo:** Es como el DNI de la app.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar el app.json antes de empezar
lenguaje: js
pide: Completa `problemasDe(config)`, que revisa un `app.json` de Expo (`config.expo`). Devuelve la lista de problemas, en este orden: `'Falta el nombre'` si no hay `name`; `'La versión tiene que ser como 1.0.0'` si `version` no tiene la forma número.número.número; `'El paquete de Android no es válido'` si `android.package` no es como `com.delvin.gastos` (dos o más pedazos separados por punto, cada uno empieza con letra minúscula y sigue con minúsculas, números o `_`).
--- código
function problemasDe(config) {
  const problemas = [];
  // tu código aquí
  return problemas;
}
--- pruebas
const bien = { expo: { name: 'Mis gastos', version: '1.0.0', android: { package: 'com.delvin.gastos' } } };
prueba('todo bien', () => igual(problemasDe(bien), []));
prueba('sin nombre', () => igual(problemasDe({ expo: { ...bien.expo, name: '' } }), ['Falta el nombre']));
prueba('versión mal escrita', () => igual(problemasDe({ expo: { ...bien.expo, version: '1.0' } }), ['La versión tiene que ser como 1.0.0']));
prueba('paquetes que no valen', () => {
  for (const p of ['gastos', 'com.Delvin.gastos', 'com.delvin-app.gastos', '1com.delvin']) {
    igual(problemasDe({ expo: { ...bien.expo, android: { package: p } } }), ['El paquete de Android no es válido']);
  }
});
--- solución
function problemasDe(config) {
  const problemas = [];
  const { name, version, android } = config.expo;
  if (!name) problemas.push('Falta el nombre');
  if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) problemas.push('La versión tiene que ser como 1.0.0');
  if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(android?.package ?? '')) problemas.push('El paquete de Android no es válido');
  return problemas;
}
```

```practica
vf :: npx expo start levanta el servidor de desarrollo y muestra un código QR
vf :: Para empezar con Expo hay que pagar una cuenta de Apple
elige :: ¿Qué comando crea un proyecto nuevo de Expo? :: npm start expo :: npx create-expo-app@latest mis-gastos :: expo new
elige :: ¿Qué archivo guarda el nombre, el ícono y los permisos de la app? :: package-lock.json :: app.json (o app.config) :: index.html
escribe :: Escribe los comandos para crear una app con Expo y arrancarla. :: npx create-expo-app@latest mis-gastos; cd mis-gastos; npx expo start
```

## Parte 2. Verla en tu iPhone con Expo Go

> 🌎 **En la vida real:** Expo Go es como un control remoto que muestra en tu teléfono lo que estás cocinando en la computadora.

> 🌎 **Otro ejemplo:** Es como la transmisión en vivo de un partido a tu celular.

### Los pasos

1. Instala **Expo Go** gratis desde la App Store.
2. Tu iPhone y tu Mac en el **mismo Wi-Fi**.
3. Corre `npx expo start` y escanea el QR con la **cámara** del iPhone.
4. Cambia el código y **guarda**: el teléfono se actualiza solo en un segundo (*Fast Refresh*).

Si el Wi-Fi no deja conectar (redes de oficina), usa `npx expo start --tunnel`.

> 🌎 **En la vida real:** es como un espejo que refleja lo que haces al instante.

> 🌎 **Otro ejemplo:** Es como un probador con cámara: te mueves y ves el cambio.

### Lo que Expo Go no puede

Expo Go trae un conjunto fijo de piezas nativas. Si tu app necesita una pieza nativa que no está ahí (algo muy especial), se usa un **development build**: tu propia versión de "Expo Go" con tus piezas. Copiloto usa builds propios porque tiene módulos nativos.

> 🌎 **En la vida real:** Expo Go es un auto de alquiler: sirve para casi todo, pero no le puedes instalar tu propio equipo de sonido.

> 🌎 **Otro ejemplo:** Es como una cocina de prueba con utensilios estándar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Alcanza Expo Go?
lenguaje: js
pide: Completa dos funciones. `faltanEnExpoGo(modulos, incluidos)` devuelve los módulos nativos de tu app que **no** trae Expo Go (en el mismo orden). `comoAbrir(modulos, incluidos, redDeOficina)` devuelve el comando: si falta algún módulo, `'npx expo run:ios'` (un development build); si no, `'npx expo start --tunnel'` cuando la red no deja conectar, o `'npx expo start'`.
--- código
function faltanEnExpoGo(modulos, incluidos) {
  // tu código aquí
}

function comoAbrir(modulos, incluidos, redDeOficina) {
  // tu código aquí
}
--- pruebas
const expoGo = ['expo-camera', 'expo-location', 'expo-secure-store'];
prueba('todo viene en Expo Go', () => igual(faltanEnExpoGo(['expo-camera', 'expo-location'], expoGo), []));
prueba('falta uno', () => igual(faltanEnExpoGo(['expo-camera', 'mi-modulo-nativo'], expoGo), ['mi-modulo-nativo']));
prueba('en casa', () => igual(comoAbrir(['expo-camera'], expoGo, false), 'npx expo start'));
prueba('en la red de la oficina', () => igual(comoAbrir(['expo-camera'], expoGo, true), 'npx expo start --tunnel'));
prueba('con un módulo propio: development build', () => igual(comoAbrir(['mi-modulo-nativo'], expoGo, false), 'npx expo run:ios'));
--- solución
function faltanEnExpoGo(modulos, incluidos) {
  return modulos.filter((m) => !incluidos.includes(m));
}

function comoAbrir(modulos, incluidos, redDeOficina) {
  if (faltanEnExpoGo(modulos, incluidos).length > 0) return 'npx expo run:ios';
  return redDeOficina ? 'npx expo start --tunnel' : 'npx expo start';
}
```

```practica
vf :: Con Fast Refresh, al guardar el código la app del teléfono se actualiza sola
vf :: Expo Go puede usar cualquier pieza nativa que agregues a tu proyecto
elige :: ¿Qué necesitan tu iPhone y tu Mac para conectarse normalmente? :: Un cable :: Estar en el mismo Wi-Fi :: Bluetooth
elige :: ¿Qué es un development build? :: Una app publicada en la tienda :: Tu propia versión de Expo Go con las piezas nativas que tu app necesita :: Un error
escribe :: Escribe los pasos para ver tu app de Expo en el iPhone. :: Instalar Expo Go desde la App Store, poner el iPhone y la Mac en el mismo Wi-Fi, correr npx expo start y escanear el QR con la cámara.
```

## Parte 3. Practicar en el navegador: Expo Snack

> 🌎 **En la vida real:** Snack es como una cocina de muestra en el supermercado: pruebas una receta sin ensuciar tu casa.

> 🌎 **Otro ejemplo:** Es como un simulador de manejo en la web.

### snack.expo.dev

En **https://snack.expo.dev** escribes React Native en el navegador y lo ves al lado (web, iPhone o Android simulados), y también en tu teléfono con Expo Go escaneando el QR. Es **gratis** y no necesitas instalar nada. Ideal para los ejercicios de este curso.

> 🌎 **En la vida real:** es como un pizarrón en línea donde haces una cuenta y la ves resuelta al lado.

> 🌎 **Otro ejemplo:** Es como el laboratorio de CRUD de este mapa, pero para pantallas de teléfono.

### Tu primer ejercicio

Copia en Snack el `ContadorDeViajes` (clase 55) y agrégale un botón "reiniciar" que vuelva a 0 y un texto que diga "¡Buen día!" cuando pases de 10 viajes.

> 🌎 **En la vida real:** es como el primer ejercicio del gimnasio: corto, pero completo.

> 🌎 **Otro ejemplo:** Es como tocar tu primera canción entera, aunque sea simple.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El contador de viajes, con reiniciar
lenguaje: js
pide: Es el ejercicio de Snack, pero con la lógica sola. Completa `crearContador()`: devuelve `{ sumar(), reiniciar(), texto() }`. `texto()` es `'Viajes hoy: N'`, y cuando pasas de **10** viajes (11 o más) agrega `' · ¡Buen día!'`. `reiniciar()` vuelve a 0.
--- código
function crearContador() {
  let viajes = 0;
  return {
    // tu código aquí
  };
}
--- pruebas
prueba('empieza en 0', () => igual(crearContador().texto(), 'Viajes hoy: 0'));
prueba('suma de a uno', () => { const c = crearContador(); c.sumar(); c.sumar(); igual(c.texto(), 'Viajes hoy: 2'); });
prueba('10 todavía no; 11 sí', () => {
  const c = crearContador();
  for (let i = 0; i < 10; i++) c.sumar();
  igual(c.texto(), 'Viajes hoy: 10');
  c.sumar();
  igual(c.texto(), 'Viajes hoy: 11 · ¡Buen día!');
});
prueba('reiniciar', () => { const c = crearContador(); c.sumar(); c.reiniciar(); igual(c.texto(), 'Viajes hoy: 0'); });
--- solución
function crearContador() {
  let viajes = 0;
  return {
    sumar() { viajes += 1; },
    reiniciar() { viajes = 0; },
    texto() { return `Viajes hoy: ${viajes}` + (viajes > 10 ? ' · ¡Buen día!' : ''); },
  };
}
```

📱 **Ahora, en la app de verdad:** toca **▶ abrir la app en Snack**, cambia el código y mira la app. Marca cada cosa cuando la veas.

```snack
titulo: Tu primer Snack
pide: Esta es la app más chica posible. Cambia el saludo por **tu nombre**, cambia el **color de fondo** por otro que te guste (`backgroundColor`), y agrega un segundo texto debajo que diga **"Mi primera app en React Native"**. Mira cómo la app cambia mientras escribes.
--- código
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.saludo}>Hola, conductor</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f141b' },
  saludo: { fontSize: 28, fontWeight: '700', color: '#7ee787' },
});
--- comprobar
- El saludo dice tu nombre
- El fondo es del color que elegiste
- Debajo aparece "Mi primera app en React Native"
- Elegiste iOS o Android arriba de la vista, y la app se ve también así
--- solución
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.saludo}>Hola, Delvin</Text>
      <Text style={estilos.texto}>Mi primera app en React Native</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1d2a3a' },
  saludo: { fontSize: 28, fontWeight: '700', color: '#7ee787' },
  texto: { fontSize: 16, color: '#e6edf3' },
});
```

```practica
vf :: Expo Snack permite escribir React Native en el navegador sin instalar nada
vf :: Snack es de pago
elige :: ¿Dónde conviene hacer los ejercicios rápidos de este curso? :: En producción :: En Expo Snack :: En el código de Copiloto
elige :: ¿Cómo ves un Snack en tu iPhone? :: No se puede :: Escaneando su QR con Expo Go :: Mandándolo por correo
escribe :: Escribe el botón reiniciar para el contador de viajes. :: <Pressable onPress={() => setViajes(0)}><Text>Reiniciar</Text></Pressable>
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo empiezas una app de React Native?":** "Con Expo: create-expo-app, npx expo start y la abro en mi iPhone con Expo Go, con Fast Refresh. Configuro nombre, ícono y permisos en app.json. Cuando la app necesita piezas nativas que Expo Go no trae, uso un development build, como en mi app Copiloto. Para probar ideas rápidas uso Expo Snack."

> 🌎 **En la vida real:** es como explicar cómo montas tu puesto de trabajo cada mañana.

> 🌎 **Otro ejemplo:** Es como un músico que explica cómo afina antes de tocar.
