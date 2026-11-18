# Tema 20: Publicar e instalar

> 🌎 **En la vida real:** cocinar no alcanza: hay que llevar el plato a la mesa. Esta clase es sobre **todas las formas de "subir"**: el código a GitHub, tus páginas a internet, el servidor a Firebase, la app a tus teléfonos y la app a Google Play.

Resumen para repasar. La explicación completa, con prácticas, está en la [clase guiada](CLASE-GUIADA.md). Basada en las guías de Copiloto (`copiloto-driver/docs/`) y en sus scripts.

**Antes de empezar:** Temas 04, 06, 08 y 12.

## 1. Las cuatro palabras

> 🌎 **En la vida real:** compilar es traducir la receta a un libro impreso; commit, sacar una foto de la obra; push, mandarla a la oficina; deploy, llevar el pastel a la fiesta.

> 🌎 **Otro ejemplo:** En una panadería: hornear el pan (compilar), anotarlo en la libreta (commit), mandar la libreta a la oficina (push) y llevar el pan a la tienda (deploy).

| Palabra | Qué hace | Dónde queda |
|---|---|---|
| Compilar | Traduce el código a una app | Un archivo en tu Mac |
| Commit | Guarda una foto con nombre | Historial en tu Mac |
| Push | Sube las fotos | GitHub |
| Deploy | Entrega la app o el servidor | Teléfono, Google Play, Firebase o Pages |

**Commit sin push = guardado solo en tu Mac.**

## 2. Los cinco destinos de "subir"

> 🌎 **En la vida real:** cinco buzones distintos: no mandas una carta al buzón de los paquetes.

> 🌎 **Otro ejemplo:** Como los destinos de un repartidor: la oficina (GitHub), la vidriera (Pages), la central (Firebase), tu casa para probar (tus teléfonos) y todas las tiendas del país (Google Play).

| Qué | A dónde | Cómo |
|---|---|---|
| Código | GitHub | `git pull` → cambiar y probar → `git status` → `git add` → `git commit -m "…"` → `git push` |
| Página de estudios bíblicos | GitHub Pages | Estudios: panel (Publicar). Código: `node scripts/construir.mjs` para probar → `git push` → GitHub Actions (mira el visto verde) → Pages |
| Este mapa | GitHub Pages | `git push` → Pages directo desde `main` |
| Servidor de la app | Firebase | `firebase deploy --only functions` / `hosting:admin` / `hosting:landing` / `firestore:rules` |
| App para probar | Samsung / iPhone | `./scripts/instalar-android.sh` / `./scripts/instalar-iphone.sh` |
| App para todos | Google Play | AAB con `./scripts/publicar-android.sh` → Play Console |

## 3. Errores de push

> 🌎 **En la vida real:** si el correo te devuelve la carta porque alguien mandó otra antes, primero recibes la suya y después mandas la tuya.

> 🌎 **Otro ejemplo:** Como volver a una reunión que siguió sin ti: primero te pones al día y después hablas.

| Dice | Qué hacer |
|---|---|
| `rejected` / `non-fast-forward` | `git pull --rebase` y `git push` |
| Deshacer algo ya subido | `git revert <código>` y `git push` |
| ¿Está todo subido? | `git status`: "working tree clean" y "up to date with 'origin/main'" |
| Pide usuario y contraseña | Hace falta un token |
| `not a git repository` | `cd` a la carpeta del proyecto |

## 4. APK y AAB

> 🌎 **En la vida real:** el APK es un traje hecho que te pones hoy; el AAB es la tela con los moldes que la sastrería (Google) corta a medida de cada cliente.

> 🌎 **Otro ejemplo:** Como la diferencia entre un mueble ya armado y uno en caja plana para que lo arme la tienda de cada cliente.

| | APK | AAB |
|---|---|---|
| Para | Probar | Google Play |
| ¿Se instala? | Sí | No |
| Gradle | `assembleRelease` | `bundleRelease` |
| Archivo | `android/app/build/outputs/apk/release/app-release.apk` | `android/app/build/outputs/bundle/release/app-release.aab` |

Mira siempre la hora del archivo: `ls -lh …`.

## 5. La firma

> 🌎 **En la vida real:** es tu firma en un cheque: el banco solo paga los que tienen **tu** firma. Perder la llave es perder el único sello de tu escribanía.

> 🌎 **Otro ejemplo:** Como la firma registrada de una empresa en el banco: todo cheque tiene que llevarla. Y como una impresora sin tinta de color que sigue imprimiendo en blanco y negro sin avisar: por eso se verifica.

- Una sola llave firma APK y AAB. Su configuración y contraseñas viven en `~/.gradle/gradle.properties`, **fuera del proyecto**.
- Si falta, el proyecto firma **en silencio** con la llave de debug, y Google la rechaza.
- **Antes de subir:** `./scripts/verificar-firma.sh` (✅ o ❌).
- **Si se pierde la llave, no se puede actualizar la app nunca más.** Copia de la llave **y** de `gradle.properties` fuera de la Mac.

## 6. Instalar

> 🌎 **En la vida real:** `adb` es el cable del mecánico a la computadora del carro; la cuenta gratis de Apple es un pase de visitante de 7 días.

> 🌎 **Otro ejemplo:** Como emparejar unos auriculares Bluetooth: la primera vez con código, después se conectan solos. Y la prueba gratis de un servicio, que vence y se vuelve a activar.

**Samsung:** `./scripts/instalar-android.sh`, o `adb install -r …apk` (`-r` conserva tus datos). Con dos aparatos: `adb devices` y `adb -s <serie> …`. Por Wi-Fi: `adb pair` una vez, `adb connect` cada vez. Sin cable: copiar el APK y permitir "origen desconocido".

**iPhone:** `./scripts/instalar-iphone.sh`, con cable o Wi-Fi ("Connect via network" en Xcode una vez). Caduca a los **7 días** (cuenta gratis): se vuelve a correr el comando. "Desarrollador no confiable": Ajustes → General → VPN y gestión de dispositivos → Confiar.

**Emuladores:** `./scripts/emuladores.sh final-android | final-iphone | expo`.

## 7. Google Play

> 🌎 **En la vida real:** el `versionCode` es el número de edición de un diario: el kiosco no acepta dos veces la misma edición.

> 🌎 **Otro ejemplo:** Como el número de serie de un billete: cada uno distinto; el banco rechaza un número repetido.

1. Subir `versionCode` (interno, siempre mayor) y, si quieres, `version` (la que ve la gente), en `app.json`. El script lo hace: `./scripts/publicar-android.sh` o `./scripts/publicar-android.sh 1.1.1`.
2. Play Console → **Testar e lançar** → (prueba o Produção) → **Criar nova versão** → arrastrar el AAB → **Notas da versão** en portugués → **Salvar e publicar**.
3. Google revisa (horas a 2 o 3 días).

Rojo bloquea, amarillo no. "Código de versão já usado" = archivo viejo. "Chave errada" = firma.

## 8. El orden de un día

> 🌎 **En la vida real:** la lista del piloto antes de despegar, siempre en el mismo orden.

> 🌎 **Otro ejemplo:** Como la rutina de un panadero: amasa, hornea, prueba, empaca, y solo cuando todo está bien abre la tienda.

Cambiar → compilar → **probar en el teléfono** → confirmar → commit + push → (al lanzar) versión + AAB + firma + Play → (si toca) `firebase deploy`. `./scripts/release.sh` hace el ciclo en orden y se detiene si algo falla.

## Para la entrevista

> 🌎 **En la vida real:** Contar cómo publicas es como contarle a un cliente cómo entregas un trabajo: lo pruebas, lo guardas, lo revisan y recién lo entregas.

> 🎤 **Entrevista:** "¿Cómo llevas un cambio a producción?"
> Pruebo el APK en mis teléfonos; si funciona, commit y push y el CI revisa. Para lanzar: subo la versión, genero el AAB, verifico la firma y lo subo a Google Play. Los cambios del servidor van con `firebase deploy` y llegan al instante.

> 🎤 **Entrevista:** "¿APK o AAB?"
> El APK se instala y es para probar; el AAB se sube a Google Play, que genera un APK optimizado para cada dispositivo.
