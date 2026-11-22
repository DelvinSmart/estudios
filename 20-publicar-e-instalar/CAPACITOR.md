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

### Qué comprobamos en Aprender

1. Firebase registró la app web, la app de Apple y la de Android en el mismo proyecto. Descargamos las configuraciones de los dos paquetes y comprobamos que coinciden con el identificador de Aprender.
2. La primera compilación de iOS con Firebase encontró dos paquetes de Swift con el mismo nombre interno. Pudimos compilar para el simulador al instalar el complemento de App Check con el alias npm `capacitor-firebase-app-check`. Un alias le da otro nombre a la carpeta de la dependencia y conserva el complemento que se ejecuta.
3. Para comprobar App Attest hicimos una compilación firmada para un dispositivo real. **Xcode rechazó la firma con el equipo personal de Apple** porque su perfil no admite esa capacidad. Por eso el ejemplo de App Attest requiere comprobar primero qué capacidades autoriza el equipo de firma. Una compilación que funciona en el simulador no verifica ese requisito.
4. Registramos una clave de reCAPTCHA Enterprise para iOS limitada al identificador de Aprender. Este proveedor nativo de Firebase está en vista previa. En Xcode añadimos la biblioteca de reCAPTCHA Enterprise y configuramos su proveedor antes de iniciar Firebase. Compilamos, firmamos e instalamos la app en un iPhone físico. Allí Firebase devolvió un token de App Check usando reCAPTCHA nativo. Falta completar la prueba de cuenta y progreso del paso anterior. [Proveedor de reCAPTCHA para iOS](https://firebase.google.com/docs/app-check/ios/recaptcha-enterprise-provider)

El registro, la compilación, la instalación y el inicio de sesión son comprobaciones distintas. La parte de cuenta y progreso se considera lista cuando el servidor acepta la conexión y los dispositivos muestran el mismo avance tras iniciar sesión con la misma cuenta.

## 7. Caso real: la web funcionaba y la app no

Este caso le pasó a Aprender. La página funcionaba perfecto. La app instalada en el iPhone y el iPad tenía tres síntomas:

| Lo que se veía | Lo que parecía | La causa real |
|---|---|---|
| Faltaban los 3 bombillos | Se perdió el progreso | El servidor no dejaba leerlos |
| «Entrar» fallaba a veces | La contraseña estaba mal | Había varias piezas por revisar |
| La pantalla se estiraba en el iPad | Un defecto del iPad | La app permitía el zoom de una página web |

**Palabras nuevas:**

- **App Check:** el portero que revisa si la solicitud viene de una app autorizada.
- **Token:** el pase temporal que el portero entrega cuando aprueba la app.
- **Proveedor:** quien da fe de la app ante el portero. Puede ser reCAPTCHA, App Attest o Play Integrity.
- **Error 403:** el servidor entendió la solicitud, pero no da permiso.
- **PWA:** una página que se instala como un ícono y se abre a pantalla completa.

### Paso 1. Leer el registro del equipo real

La pista no estaba en la pantalla. Estaba en el **registro**, el diario de lo que hace la app. Al abrirla en el iPad desde la Mac apareció esto:

```text
exchangeRecaptchaEnterpriseToken
HTTP status code: 403
App attestation failed.
```

Traducido: la app pidió su pase y el portero dijo que no. Como Firestore exige ese pase, tampoco podía entregar los bombillos. El código escondía ese error con un `catch` vacío, y por eso la pantalla solo mostraba cero bombillos, sin ningún aviso.

> 💡 **Idea:** un `catch` vacío es como quitarle la pila a la alarma de humo. El problema sigue ahí, pero ya nadie se entera.

### Paso 2. Descartar una causa a la vez

1. **¿La clave de la app es la registrada en Firebase?** Sí. Se compararon completas, letra por letra.
2. **¿Falla solo en el iPad?** No. El iPhone recibió el mismo 403.
3. **¿Qué dice el panel de reCAPTCHA?** Marcaba 21 verificaciones de **riesgo alto** y 0 de riesgo bajo.
4. **¿Qué permite la cuenta de Apple?** Era un equipo personal gratuito. Su perfil dura 7 días, solo incluye los equipos registrados y no admite App Attest.

El cuarto punto cambió la decisión. Aunque se apagara el portero, **los alumnos tampoco podrían instalar esa app en su iPhone**. El problema de fondo era cómo se distribuye la app.

### Paso 3. Elegir la solución para todos

| Opción | Resultado |
|---|---|
| Registrar cada equipo con un código | Sirve para probar. No sirve para alumnos. |
| Apagar App Check | Quita una capa de seguridad y no resuelve la instalación en iPhone. |
| Instalar la página como ícono en iPhone y iPad | Gratis, para todos, con App Check activo. |
| Publicar en Google Play con Play Integrity | Es el camino normal para Android. |

Se eligieron las dos últimas. La página instalada usa la verificación web, que ya funcionaba. El alumno abre Safari, toca **Compartir** y después **Agregar a inicio**.

> 📌 **Nota:** Apple no deja que una página se instale sola con un botón. Por eso la pantalla `#/instalar` le explica a cada persona los pasos para su equipo.

### Paso 4. Corregir también lo pequeño

- **Zoom:** solo cuando la página se abre desde su ícono, se bloquea el acercamiento. En el navegador sigue libre, porque hay personas que lo necesitan para leer.
- **Bombillos:** antes solo se traían en la portada. Ahora se traen en cualquier pantalla, como máximo cada 30 segundos, para no gastar lecturas.
- **Campos de acceso:** el correo y la contraseña ya no usan mayúscula automática ni autocorrección.
- **Espera:** si la verificación se queda colgada, se corta a los 15 segundos. Un botón nunca debe quedarse sin respuesta.

### Para la entrevista

**Pregunta:** «Tu sistema funciona en la web, pero falla en la app. ¿Qué haces?»

<details>
<summary>Una respuesta modelo</summary>

«Primero reproduzco el fallo en un equipo real y leo el registro. En mi proyecto encontré un 403 de App Check. Comparé la clave, probé otro equipo y revisé el panel y la cuenta de firma. Vi que la app no podía distribuirse a otros usuarios con esa cuenta. En vez de apagar la seguridad, cambié la forma de instalar: una PWA en iOS y Play Integrity en Android. Después lo comprobé en los equipos reales.»

</details>

**Pregunta:** «¿Por qué no apagaste App Check, si era lo más rápido?»

<details>
<summary>Una respuesta modelo</summary>

«Porque quitaba una capa de protección y no resolvía el problema real. Aunque el servidor dejara pasar la app, mis alumnos seguían sin poder instalarla en iPhone. Antes de bajar una defensa, compruebo si esa defensa es de verdad la causa.»

</details>

> 🎙️ **El profesor dice:** cuando algo funciona en un lugar y en otro no, no empieces cambiando código. Pregunta: **¿qué es diferente entre los dos caminos?** Aquí la diferencia era quién daba fe de la app ante el portero.
