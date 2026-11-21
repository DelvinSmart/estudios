# Aprender para Android, iPhone y iPad

Desde esta carpeta, usa una versión LTS de Node compatible con Capacitor 8 y ejecuta:

```sh
npm ci
npm run sincronizar
```

El script prepara la web en `www/` y sincroniza los dos proyectos nativos. Vuelve a ejecutarlo cuando cambies el contenido. La app abre las lecciones y los ejercicios locales como invitado. La cuenta, la corrección de prácticas con Firebase y los certificados se usan desde el sitio público. Algunos ejercicios y recursos externos necesitan internet.

## Android

Abre `npx cap open android`. Configura el SDK de la versión indicada en `android/variables.gradle`. Desde `android/`, `./gradlew :app:assembleDebug` genera un APK de pruebas en `app/build/outputs/apk/debug/`. En Windows, utiliza `.\gradlew.bat`. Usa la opción **Generate Signed Bundle / APK** de Android Studio para crear el AAB firmado con tu clave de carga.

## iPhone y iPad

En Mac, abre `npx cap open ios`. El esquema **App** se puede ejecutar en el simulador. Para instalar en dispositivos físicos, configura tu equipo de firma en Xcode y selecciona el dispositivo. Para TestFlight o App Store, genera el archivo con **Product → Archive** y usa App Store Connect.

El identificador inicial es `com.delvinsmart.aprender`. Conserva las claves de firma, perfiles y credenciales fuera del repositorio. La clase [Taller de Capacitor](../20-publicar-e-instalar/CAPACITOR.md) explica el recorrido completo.
