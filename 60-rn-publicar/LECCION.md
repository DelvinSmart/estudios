# React Native 7: probar y publicar la app

> 🌎 **En la vida real:** terminar de cocinar no es servir: falta probar el sabor, emplatar y llevarlo a la mesa. Una app terminada todavía tiene que probarse, firmarse y llegar a las tiendas.

> 🎙️ **El profesor dice:** la última clase del curso **React Native**. Pruebas automáticas de componentes, cómo se arma la app final con **EAS Build** (y sin pagar), la diferencia entre un **AAB** y un **APK**, cómo llega a Google Play y al iPhone, y las actualizaciones. El Tema 20 tiene el paso a paso real de Copiloto; aquí ves el mapa completo.

## Parte 1. Probar componentes

> 🌎 **En la vida real:** antes de abrir el restaurante, el chef prueba cada plato con alguien de confianza.

> 🌎 **Otro ejemplo:** Es como un ensayo general antes del estreno.

### Jest + Testing Library

```tsx
import { render, fireEvent, screen } from '@testing-library/react-native';

test('el contador suma un viaje al tocar', () => {
  render(<ContadorDeViajes />);
  fireEvent.press(screen.getByText('+1 viaje'));
  expect(screen.getByText('Viajes hoy: 1')).toBeTruthy();
});
```

Se prueba **como lo usa una persona**: buscar el texto, tocar, ver el resultado. Copiloto tiene cientos de pruebas así (Temas 02 y 03), y la lógica separada (clase 53) se prueba aún más fácil.

> 🌎 **En la vida real:** es como probar un control remoto apretando los botones, no desarmándolo.

> 🌎 **Otro ejemplo:** Es como el cliente misterioso que prueba la atención de una tienda.

```practica
vf :: Testing Library prueba los componentes como los usa una persona: buscar, tocar y ver
vf :: fireEvent.press toca un botón de verdad en tu teléfono
elige :: ¿Qué hace screen.getByText('+1 viaje')? :: Escribe el texto :: Busca el elemento que muestra ese texto :: Borra el botón
elige :: ¿Qué es más fácil de probar? :: La pantalla con todo junto :: La lógica separada en funciones puras :: Nada
escribe :: Escribe una prueba que toque "reiniciar" y espere ver "Viajes hoy: 0". :: fireEvent.press(screen.getByText('Reiniciar')); expect(screen.getByText('Viajes hoy: 0')).toBeTruthy();
```

## Parte 2. Armar la app final: EAS Build

> 🌎 **En la vida real:** compilar es como empacar el producto en su caja oficial, con sello y código de barras, listo para la tienda.

> 🌎 **Otro ejemplo:** Es como imprimir y encuadernar el libro después de escribirlo.

### EAS Build y eas.json

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
eas build --platform ios --profile production
```

`eas.json` define los perfiles (desarrollo, prueba, producción). EAS tiene un **plan gratis** con una cantidad de builds por mes en la nube; y si se acaban, se puede compilar **en tu Mac** con `eas build --local` (o con Android Studio y Xcode), también gratis.

> 🌎 **En la vida real:** es como la imprenta del barrio con unas copias gratis por mes, o imprimir en tu propia impresora.

> 🌎 **Otro ejemplo:** Es como lavar el carro en el lavadero o en tu casa.

### AAB, APK y la firma

- **AAB** (*Android App Bundle*): lo que se sube a **Google Play**.
- **APK**: lo que se instala directo en un teléfono para probar.
- La app va **firmada** con una llave. **Esa llave no se pierde ni se comparte**: sin ella no puedes actualizar la app en Google Play (el Tema 20 explica cómo la cuida Copiloto).

> 🌎 **En la vida real:** la firma es como el sello notarial: prueba que la app es tuya.

> 🌎 **Otro ejemplo:** Es como la llave de tu casa: si la pierdes, no puedes entrar a cambiar nada.

```practica
vf :: A Google Play se sube un AAB
vf :: Si pierdes la llave de firma, puedes seguir actualizando la app normal
elige :: ¿Qué archivo define los perfiles de compilación de EAS? :: app.json :: eas.json :: package-lock.json
elige :: Se acabaron los builds gratis del mes en la nube. ¿Qué haces sin pagar? :: Esperar un año :: Compilar en tu Mac con eas build --local :: Borrar la app
escribe :: ¿Qué diferencia hay entre un AAB y un APK? :: El AAB es el paquete que se sube a Google Play para que la tienda arme la versión de cada teléfono; el APK es un archivo que se instala directo en un teléfono, útil para probar.
```

## Parte 3. Llegar a las tiendas y actualizar

> 🌎 **En la vida real:** abrir un producto en el supermercado tiene trámites: registro, etiqueta, revisión. Las tiendas de apps también.

> 🌎 **Otro ejemplo:** Es como inscribir un carro en el Detran antes de salir a la calle.

### Google Play y App Store

- **Google Play:** cuenta de desarrollador (pago único), prueba interna o cerrada, ficha de la tienda, **Seguridad de los datos** declarada, y revisión.
- **App Store:** cuenta de Apple Developer (pago anual), **TestFlight** para probar con otros, y revisión de Apple.
- Para probar en tu propio iPhone sin publicar, ya tienes **Expo Go** y los development builds (clase 57).

> 💡 **Idea:** esas cuentas de las tiendas son el único costo para **publicar**; para aprender y probar no necesitas ninguna.

> 🌎 **En la vida real:** es como la licencia de un puesto en la feria: para practicar en casa no la necesitas.

> 🌎 **Otro ejemplo:** Es como el registro de una marca: solo cuando vendes al público.

### Actualizar

- Cambios de **JavaScript** (textos, pantallas, lógica): se pueden mandar como actualización por aire con **EAS Update**, sin pasar otra vez por la revisión completa (si respetas las reglas de las tiendas).
- Cambios **nativos** (permisos, piezas nativas, versión de Expo): hace falta un build nuevo y subir a la tienda. Copiloto sube el `versionCode` en cada versión (Tema 20).

> 🌎 **En la vida real:** cambiar el menú del día (JavaScript) es rápido; remodelar la cocina (nativo) necesita permiso de obra.

> 🌎 **Otro ejemplo:** Es como actualizar los precios de una vitrina frente a cambiar la vitrina.

```practica
vf :: Para probar la app en tu propio iPhone no hace falta publicarla
vf :: Un cambio de permisos nativos se puede mandar por EAS Update sin build nuevo
elige :: ¿Qué herramienta de Apple sirve para que otros prueben tu app antes de publicarla? :: Expo Go :: TestFlight :: Snack
elige :: Cambiaste un texto de una pantalla. ¿Cómo puede llegar a los usuarios sin una revisión completa? :: No puede :: Con una actualización por aire (EAS Update) :: Reinstalando el teléfono
escribe :: Escribe los pasos generales para publicar una versión nueva de tu app en Google Play. :: Probarla, subir el versionCode, compilar el AAB firmado con EAS (o local), subirlo a una prueba interna en Google Play, revisar y después pasarlo a producción.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo publicas una app de React Native?":** "La pruebo con Jest y Testing Library, compilo con EAS Build (en la nube o local), firmo con una llave que cuido como lo más valioso, subo el AAB a Google Play pasando por prueba interna, y uso TestFlight en iPhone. Los cambios de JavaScript pueden ir por EAS Update; los nativos necesitan build nuevo y subir el versionCode. Así lo hago con Copiloto Driver."

> 🌎 **En la vida real:** es como explicar todo el camino de un producto: de la fábrica a la góndola.

> 🌎 **Otro ejemplo:** Es como un piloto que explica la lista completa, del hangar al aterrizaje.
