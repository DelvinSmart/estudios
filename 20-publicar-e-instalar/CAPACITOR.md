# Taller de Capacitor: de tu web a una app instalable

Vas a tomar una web que ya funciona y llevarla a Android, iPhone y iPad. El ejemplo es Aprender. Para seguirlo te ayuda saber qué hacen HTML, CSS y JavaScript, abrir una terminal y usar npm.

## 1. Qué es Capacitor

Capacitor crea un proyecto nativo por plataforma y abre tu web dentro de un **WebView**, la vista web integrada en la app. En Android lo construye Gradle desde Android Studio. En iPhone y iPad lo construye Xcode. Tus pantallas siguen escritas en HTML, CSS y JavaScript. Cuando quieras usar funciones del teléfono, un complemento de Capacitor puede conectar JavaScript con el código nativo.

Un icono añadido desde Safari o Chrome abre la versión web. Un proyecto de Capacitor puede generar un paquete instalable y pasar por la distribución de una tienda. El inicio de sesión, el almacenamiento y los permisos se prueban de nuevo porque pueden comportarse distinto en el WebView.

## 2. Preparar y sincronizar la web

En un proyecto nuevo instala `@capacitor/core`, el CLI `@capacitor/cli` como dependencia de desarrollo, y `@capacitor/android` y `@capacitor/ios` para las plataformas que vayas a usar. Mantén los cuatro paquetes en la misma versión. Con `npx cap init` defines el nombre de tu app y un identificador único como `com.ejemplo.misgastos`. Instala Xcode en Mac y Android Studio para Android. [Requisitos por plataforma](https://capacitorjs.com/docs/getting-started/environment-setup)

El ajuste `webDir` apunta a la carpeta web que Capacitor debe copiar. La carpeta debe contener `index.html` y lo que ese archivo necesite. En Aprender, el script de preparación arma `www` con las lecciones, módulos, estilos e índice. Las dependencias remotas de algunos ejercicios y los servicios de cuenta siguen usando internet.

En una copia de Aprender, entra en la carpeta `movil` y ejecuta:

```sh
npm ci
npm run sincronizar
```

`npm ci` instala las versiones registradas. El segundo comando prepara la web y llama a `cap sync`, que copia los archivos al proyecto nativo y actualiza sus dependencias. Los proyectos `android/` e `ios/` ya están en el repositorio. En un proyecto nuevo, se crean una sola vez con `npx cap add android` y `npx cap add ios`.

**Hazlo tú:** cambia el encabezado de una copia de tu web, sincroniza, abre la app y comprueba que aparece el cambio. Si solo cambias el archivo fuente y no sincronizas, la app conserva la versión copiada anteriormente. [Instalación de Capacitor](https://capacitorjs.com/docs/getting-started)

## 3. Android: APK para probar y AAB para Google Play

Desde `movil`, ejecuta `npx cap open android`. Espera que Gradle sincronice el proyecto. Escoge un emulador o un teléfono conectado y pulsa Run.

Para generar un **APK de depuración** desde la terminal:

```sh
cd android
./gradlew assembleDebug
```

En Windows, usa `.\gradlew.bat assembleDebug` en PowerShell. Busca el resultado en `app/build/outputs/apk/debug/app-debug.apk`. Puedes instalarlo en un dispositivo de pruebas con `adb install -r app/build/outputs/apk/debug/app-debug.apk` si tienes ADB configurado.

Para Google Play, abre **Build → Generate Signed Bundle / APK** en Android Studio, elige **Android App Bundle**, selecciona el módulo `app` y la variante `release`. Firma con tu clave de carga y guarda el archivo de claves y su contraseña fuera del repositorio. El **AAB** se sube a Play Console, donde Google Play prepara los APK para cada dispositivo. Usa primero una pista de prueba. [Distribución de Capacitor en Google Play](https://capacitorjs.com/docs/android/deploying-to-google-play)

## 4. Apple: prueba en iPhone y iPad, luego TestFlight

Desde `movil` en Mac, ejecuta `npx cap open ios`. Selecciona el esquema App y un simulador de iPhone o iPad y pulsa Run. Para probar en tu equipo físico, conéctalo, selecciona tu equipo en **Signing & Capabilities** y escoge el dispositivo como destino.

Para compartir una beta, agrega la app en App Store Connect con el mismo identificador del proyecto y selecciona un destino genérico de iOS en Xcode. Usa **Product → Archive**. En Organizer, selecciona el archivo y usa **Distribute App → App Store Connect**. Tras procesar la compilación, añádela a un grupo en TestFlight. Si necesitas un archivo **IPA**, Xcode permite exportarlo para un método de distribución compatible con tu firma. Un archivo de simulador solo se ejecuta en el simulador. [Distribución para Apple](https://capacitorjs.com/docs/ios/deploying-to-app-store) · [TestFlight](https://developer.apple.com/testflight/)

## 5. Comprueba el paquete antes de compartirlo

Abre la portada, entra a una lección y ejecuta un ejercicio. Prueba el teclado, el botón de volver, enlaces externos y rotación. En iPad, revisa el espacio que aprovecha el mapa. Comprueba también el uso sin conexión de los archivos locales y los avisos de las funciones que dependen de internet.

En esta primera versión móvil de Aprender, la cuenta y el certificado se abren en el sitio web. El progreso local de la app y el del navegador se guardan por separado. Integrar la cuenta en el paquete requiere validar la autenticación y la protección de Firebase en cada plataforma.

Para explicar lo aprendido, contesta en voz alta: ¿qué copia `cap sync`?, ¿qué usarías para instalar una prueba en Android?, ¿qué subirías a Play Console?, ¿cómo llegaría la beta al iPad?
