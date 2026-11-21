# Prepara tu computadora

Puedes hacer los primeros ejercicios de Aprender en el navegador. Abre esta guía cuando quieras guardar un proyecto propio en tu Mac o en tu PC con Windows. Elige qué quieres construir e instala solo las herramientas de ese camino.

## Tu primer sitio web

1. Instala un editor como [Visual Studio Code](https://code.visualstudio.com/download). En Mac usa Terminal. En Windows puedes abrir PowerShell. El editor sirve para escribir archivos y la terminal para ejecutar comandos.
2. Crea una carpeta llamada `mi-primer-sitio`. Dentro, guarda un archivo `index.html` con este contenido:

```html
<!doctype html>
<html lang="es">
  <meta charset="utf-8">
  <title>Mi primera página</title>
  <h1>Mis gastos de combustible</h1>
</html>
```

3. Abre el archivo con tu navegador. Cambia el encabezado en el editor, guarda y recarga. Si ves el nuevo texto, ya puedes empezar las clases de HTML, CSS y JavaScript.
4. Cuando quieras llevar un historial de tus cambios, instala [Git](https://git-scm.com/install/) y comprueba en una terminal nueva que `git --version` muestra un número. Si vas a publicar con GitHub Pages, necesitarás una cuenta de GitHub.

## JavaScript con herramientas de proyecto

Instala [Node.js LTS](https://nodejs.org/es/download) cuando el curso use `npm`, React, TypeScript, Expo o un servidor Node.js. Node ejecuta JavaScript fuera del navegador. npm instala las dependencias de un proyecto.

Cierra y vuelve a abrir la terminal. Ejecuta ambos comandos:

```sh
node --version
npm --version
```

Si alguno no aparece, comprueba que terminaste la instalación y vuelve a abrir la terminal. Para un sitio con HTML, CSS y JavaScript básico puedes empezar con el editor y el navegador.

## Apps para Android e iPhone

- **Android en Mac o Windows.** Instala [Android Studio](https://developer.android.com/studio/install) y completa su asistente para descargar el SDK, las herramientas con las que se compila. Abre Device Manager y crea un dispositivo virtual, o conecta un Android real con depuración USB activada. La prueba es abrir una app de ejemplo y verla en uno de los dos.
- **iPhone y iPad en Mac.** Instala [Xcode](https://developer.apple.com/xcode/), ábrelo para completar la configuración e instala un simulador iOS si te lo solicita. Crea un proyecto iOS con SwiftUI y pulsa Run. Para un dispositivo físico también tendrás que configurar la firma y escoger tu dispositivo como destino.
- **iPhone y iPad desde Windows.** Puedes escribir código con React Native y Expo y usar [Expo Build](https://docs.expo.dev/build/introduction/) para compilar en la nube. Xcode y el simulador local de Apple se ejecutan en Mac. Para SwiftUI y los pasos locales de Capacitor para iOS, usa un Mac.
- **Una web instalable.** Aprende primero a tener tu sitio funcionando. Luego puedes empaquetarlo para Android y Apple con Capacitor, en el taller de la clase «Publicar e instalar».

## Comprueba tu camino

Si tu meta es web, deberías poder cambiar una página y verla en el navegador. Si tu meta es móvil, prueba a abrir un proyecto de ejemplo en el destino que elegiste. Guarda el nombre de la herramienta y el resultado que viste. Si algo falla, apunta el mensaje exacto antes de reinstalar nada.
