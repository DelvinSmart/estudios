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
