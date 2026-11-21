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

## 6. Conecta la app con el mismo Firebase de la web

Imagina que estudias en una biblioteca. El navegador, el iPad y el iPhone son tres entradas al mismo edificio. Tu tarjeta de biblioteca identifica qué libros tienes prestados, aunque mañana entres por otra puerta. En Aprender, la tarjeta equivale al identificador de tu cuenta, llamado **UID**. Firestore es donde queda anotado el avance. Tener el mismo edificio de fondo es lo que permite continuar en otro dispositivo.

### Paso 1. Registrar cada app

En [Firebase Console](https://console.firebase.google.com/), abre **Configuración del proyecto → General → Tus apps**. Aprender ya tenía una app web. En ese mismo proyecto registramos dos más. Usamos `com.delvinsmart.aprender` como identificador de paquete en Android y como identificador de la app en Apple. El registro de Apple sirve para iPhone y iPad.

Para entenderlo, abre `movil/capacitor.config.json` y busca `appId`. Compáralo con el registro en Firebase. Si una letra cambia, estás presentando la identificación de otra app.

### Paso 2. Llevar la configuración al código que se instala

Firebase genera dos archivos de configuración del SDK, las herramientas con las que nuestra app habla con Firebase:

| Plataforma | Archivo | Dónde se incluye |
|---|---|---|
| iPhone y iPad | `GoogleService-Info.plist` | En el proyecto de Xcode, como recurso del destino App |
| Android | `google-services.json` | En `movil/android/app/`, donde lo lee el complemento de Google Services |

Son como la dirección y los datos de contacto de la biblioteca. El código los usa para llegar al proyecto correcto. Las claves privadas de administración se guardan fuera del código que se instala.

**Comprueba:** en la consola, las tres apps deben verse bajo el mismo proyecto. En Xcode, revisa que el archivo de Apple esté incluido en el destino App. Luego sincroniza y vuelve a compilar. Cambiar la copia del archivo en la computadora por sí solo no cambia lo que ya está instalado en el iPad.

### Paso 3. Entrar con la cuenta y volver a la misma pantalla

**Firebase Authentication** comprueba la identidad. Al entrar con correo o Google, Firebase entrega una sesión. Con Google, la pantalla que permite elegir la cuenta puede abrirse fuera de Aprender. Cuando termina, la app debe recibir el resultado y completar el inicio de sesión. La sesión del navegador y la de la app se guardan en lugares distintos.

Capacitor permite usar un complemento para que iOS y Android abran el selector de Google de su plataforma. En iOS se configura el esquema de retorno que figura en el archivo de Firebase. En Android se registra la huella del certificado con el que se firma el paquete. La firma de pruebas y la firma de Play pueden ser distintas. [Configuración de Google para Capacitor](https://github.com/capawesome-team/capacitor-firebase/blob/main/packages/authentication/docs/setup-google.md)

### Paso 4. Dejar que el servidor controle el acceso

En la biblioteca te pueden pedir dos cosas. Tu tarjeta dice **quién eres**. El lector de la entrada confirma **por qué puerta llegaste**. En Aprender, Authentication verifica la cuenta y **App Check** verifica que la solicitud venga de una app autorizada. Después, las reglas de Firestore deciden qué puede leer o escribir esa cuenta.

La web usa reCAPTCHA Enterprise para App Check. En el paquete móvil, el proveedor debe configurarse y probarse para la forma real de distribución. Los registros de Firebase por sí solos todavía no activan esa protección. En Aprender, el servidor también valida si aprobaste la práctica antes de contarla para el avance. [App Check en Apple](https://firebase.google.com/docs/app-check/ios/app-attest-provider) · [App Check en Android](https://firebase.google.com/docs/app-check/android/play-integrity-provider)

### Paso 5. Hacer que «Continuar» siga a la cuenta

En Aprender, el progreso oficial se guarda en Firestore por curso y por UID. Al iniciar sesión, la pantalla debe leer las partes confirmadas y ofrecer la siguiente. Al acabar una parte, hay que distinguir entre **guardada en este dispositivo** y **guardada en la nube**. Si la conexión falla, el usuario necesita saber qué quedó pendiente. El servidor sigue decidiendo si la parte puede registrarse.

**Prueba de principio a fin:** entra con una cuenta de prueba en el iPad, termina una parte y espera que la app confirme que se guardó. Abre el mismo curso con esa cuenta en el iPhone y en la web. Comprueba que «Continuar» ofrece la misma parte. Cierra la sesión y verifica que el siguiente visitante no vea los datos de esa cuenta.

**Estado de Aprender:** las tres apps ya están registradas en el mismo proyecto. La integración de los complementos móviles y la prueba de inicio de sesión, App Check y avance compartido todavía están en desarrollo.
