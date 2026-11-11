# Informe de revisión y correcciones — 05/11/2026

Revisión completa de Copiloto Driver: qué se encontró, cómo se corrigió cada
error y qué falta. Es un documento aparte: el histórico de errores graves sigue
en `HISTORICO_BUGS.md` (en la carpeta principal del proyecto copiloto-driver).

## Estado

| Punto | Estado |
|---|---|
| Problemas de la app | 15 encontrados: 14 corregidos y 1 en parte |
| Pruebas automáticas | Pasan |
| GitHub | Commit `9972c11` con los 5 trabajos del CI en verde |
| Corrección de Firebase | Vista funcionando en los emuladores de iPhone y Android |
| AAB final | `copiloto-driver-1.1.0-vc90.aab`. Un vc89 ya se había subido a Google Play, por eso se generó otro número |
| iPhone 15 Pro Max | Instalado y abierto por el script; falta que el dueño lo pruebe |
| Samsung SM-A315G | **Sin instalar:** no estaba conectado |
| Panel web | **Sin publicar:** el sistema de permisos rechazó el despliegue a producción |

## Cómo se revisó

| Comprobación | Antes | Después |
|---|---|---|
| TypeScript de la app | Sin errores | Sin errores |
| Candados de diseño, ciclos, tamaño y secretos | Pasan | Pasan, con más alcance |
| Pruebas de la app | 97 de 97 | 104 de 104 |
| Pruebas de Cloud Functions | 133 de 133 | 133 de 133 |
| Pruebas Kotlin del cartón | 61 de 61, fuera del CI | 61 de 61, dentro del CI |
| Pruebas de reglas de Firestore | No existían | 21 de 21 |
| Build del panel web | Compila | Compila |
| Bundle de Android e iOS | Compila, fuera del CI | Compila, dentro del CI |
| `expo-doctor` | 1 fallo: 10 paquetes atrasados | 21 de 21 |

También se saboteó una copia a propósito para confirmar que los candados fallan
de verdad: color y radio a mano, `<Pressable>` suelto, archivo gigante, clave
secreta, error de tipos, ciclo, traducción faltante y reglas abiertas. Todos
fallaron como debían. El primer sabotaje de traducción no fue válido porque el
`sed` de macOS no hizo el cambio; se repitió con otro método.

## Errores encontrados y cómo se corrigieron

| N.º | Problema | Cómo se corrigió | Estado |
|---|---|---|---|
| 1 | La IA se presentaba como asistente "para conductores de aplicaciones" y permitía decir "motorista" si la persona lo usaba | Prompt reescrito en `functions/src/geminiPrompt.ts`: no asume plataforma y nunca usa esas palabras | Corregido; falta desplegar |
| 2 | Textos visibles con motorista, conductor, chauffeur, Fahrer y autista en los seis idiomas | Lenguaje neutro, como "app de trabajo" y "participantes" | Corregido |
| 3 | Nada impedía que esas palabras volvieran | Prueba `src/i18n/__tests__/roleWords.test.ts`, que ya encontró un caso olvidado en italiano | Corregido |
| 4 | Clave `driverFallback` sin uso, y respaldo "Motorista" en el Perfil y en el aviso de cumpleaños | Clave y respaldo eliminados. Sin nombre, no se muestra ninguno | Corregido |
| 5 | Instrucciones de la IA con "motorista" en idioma, módulo `rideProfit` y lectura de gastos | Cambiadas por "la persona" | Corregido; falta desplegar el backend |
| 6 | Modal de invitación del San y onboarding con texto fijo en portugués | 49 claves nuevas en los seis idiomas y en `TranslationDictionary` | Corregido |
| 7 | 25 vulnerabilidades en la app, 20 en el backend y 13 en el panel: 2 críticas y 23 altas | Actualizaciones compatibles, `nodemailer` 10 y versión forzada de `@grpc/grpc-js` y `undici`. Quedan 22 moderadas, ninguna crítica ni alta | En parte |
| 8 | 10 paquetes de Expo una versión atrasados | `expo install --fix` | Corregido |
| 9 | `src/profile-advanced`, en uso, estaba fuera del candado de diseño | 4 valores a mano corregidos; el candado cubre esa carpeta y `src/hooks`. La copia de reversión queda como excepción declarada | Corregido |
| 10 | 6 fechas formateadas sin `dateFormat` | Pasadas a `dateFormat`, con regla nueva en el candado | Corregido |
| 11 | `aiTools.ts` con 2.019 líneas y `gemini.ts` con 1.008 | Divididos en `aiToolsShared`, `aiToolsExpenses`, `aiToolsFuel`, `aiToolsEarnings` y `geminiPrompt`. Una comparación confirmó que solo cambiaron importaciones y exportaciones | Corregido |
| 12 | El candado de tamaño solo miraba `src` | Incluye `functions/src` y `web/src` | Corregido |
| 13 | Las reglas de Firestore no tenían pruebas | `rules-test/`: 21 pruebas en emulador local con proyecto `demo-copiloto`, sin tocar producción | Corregido |
| 14 | El CI no generaba bundles ni corría Kotlin ni reglas | Bundles y trabajos `carton-android` y `reglas`. El de Kotlin se simuló en copia limpia con 61 de 61 | Corregido |
| 15 | AGENTS.md mandaba a Expo v54 con el proyecto en 57, y dos archivos de `android/` estaban en git aunque la carpeta está ignorada | Documento en v57 y archivos fuera de git. Revisados: no tenían claves | Corregido |

## Errores causados durante el trabajo

### 1. Parche de Firestore sin aplicar

`npm audit fix` subió Firebase de 12.15.0 a 12.19.0 y Firestore de 4.16.0 a
4.17.2. El parche propio de Firestore, que evita que el Samsung A31 se congele
6 segundos con 700 documentos, dejó de aplicarse.

- **Corrección:** Firebase volvió a 12.15.0 y quedó como versión exacta.
- **Comprobación:** `patch-package` confirmó `@firebase/firestore@4.16.0`.
- **Cuidado futuro:** si se actualiza Firebase, hay que rehacer ese parche.

### 2. Firebase con dos copias

Al revertir Firebase quedó `@firebase/app` 0.16.2 en la raíz y 0.15.0 dentro de
`firebase`. Las dos copias no se ven entre sí, y Firebase moría al arrancar con
`Component auth has not been registered yet`.

- **Síntoma:** en iPhone la app se quedaba en el logo. En Android abría, pero
  sin Firebase. El AAB vc89 incluía el mismo fallo.
- **Por qué no se detectó antes:** TypeScript, candados, pruebas y bundles
  pasaban todos. Solo se vio al abrir la app y leer su registro.
- **Corrección:** `@firebase/app` fijado en 0.15.0, con una sola copia.
- **Prueba nueva:** `src/services/__tests__/firebaseSingleCopy.test.ts` falla si
  vuelven a existir dos copias.
- **Mensaje confuso:** la app decía que faltaban variables
  `EXPO_PUBLIC_FIREBASE_*`, pero las claves sí estaban en los bundles.

También falló la compilación Debug de iPhone por el símbolo `Sealable`. Ese modo
no se usó y la causa exacta sigue sin confirmar; la instalación real usa Release.

## Comprobación del mapa de la app

| Dato del mapa | Comprobado en el código | Resultado |
|---|---|---|
| 837 archivos | 837 sin contar pruebas | Correcto |
| 5.032 conexiones | 5.032 al revisar; 5.038 después de los arreglos | Actualizado |
| 20 proveedores | 21: faltaba `I18n`, y `SafeArea` va primero | Corregido |
| 62 pantallas | 62 archivos `*Screen.tsx` | Correcto |
| 357 componentes y sus 8 carpetas | Coinciden | Correcto |
| 83 servicios | 83 | Correcto |
| 15 módulos del Copiloto | 15 | Correcto |
| 15 colores, 9 radios, 9 colores claros | Coinciden | Correcto |
| 13 resortes de `dashSpring` | 13 | Correcto |
| Cables 582, 509, 225, 143, 118, 117, 78, 70, 21 | Coinciden | Correcto |
| Cable 206 | 208 después de los arreglos | Actualizado |
| Cable 132 | 135 después de los arreglos | Actualizado |
| Cálculos (103) | Es toda la carpeta `utils` | Renombrado |
| 22 conectores | 22 archivos, algunos son utilidades | Renombrado |
| Firebase sin Storage | Storage se usa para fotos de perfil | Añadido |
| Servicios externos | También se usa Twilio | Añadido |
| Vidrio con reflejo | No hay un control propio llamado reflejo | Cambiado |

## Tareas ejecutadas

| Tarea | Estado | Qué se vio |
|---|---|---|
| 1. Emulador de iPhone | Hecha en Release | Início con sesión, datos y clima. 0 errores de Firebase |
| 2. Emulador de Android | Hecha en Release | Idioma y pantalla de entrada. 0 errores de Firebase. Sin cuenta, no se pasó de ahí |
| 3. Instalar en el iPhone | Hecha | El script confirmó versión 1.1.0 instalada y abierta. Lo que muestra el teléfono no se vio desde la Mac |
| 4. Instalar en el Samsung | Bloqueada | No está conectado a la Mac |
| 6. AAB + nota de versión | Hecha | `copiloto-driver-1.1.0-vc90.aab` para subir. Si el vc89 subido es anterior a las 15:22, es el roto y debe reemplazarse |
| 5. Commit + push | Hecha | Commit `9972c11` en `feature/smart-camera`. CI: `app`, `functions`, `panel`, `reglas` y `carton-android` en verde |
| 7. Publicar el panel web | Rechazada | El sistema de permisos bloqueó el despliegue, también después de la autorización del dueño. Antes se comprobó: 51 funciones en producción y 51 en el código, ninguna se borra |

`scripts/instalar-iphone.sh` fallaba por Sentry sin token. Se añadió
`SENTRY_DISABLE_AUTO_UPLOAD=true`, igual que en `publicar-android.sh`.

Para publicar el panel y todas las Cloud Functions, el dueño debe ejecutar en la Terminal:

```bash
npx firebase-tools deploy --only functions,hosting:admin --project copiloto-driver-ia
```

## Pendientes y lo que no se pudo comprobar

| Pendiente | Razón | Qué falta |
|---|---|---|
| Probar en el iPhone 15 Pro Max y el Samsung SM-A315G | Es lo que manda según AGENTS.md | Instalar y revisar el flujo completo |
| Desplegar todas las Cloud Functions | No está en el menú de tareas y es producción | Autorización del dueño. Incluye el prompt nuevo y `nodemailer` 10 |
| Probar un correo real | Las pruebas no envían correos | Hacerlo después del despliegue |
| `RideReaderService.kt` (1.585 líneas) y `RideOverlayWindow.kt` (1.292) | No tienen pruebas propias y solo una oferta real confirma que nada se rompió | Dividirlos con pruebas en un teléfono |
| Cobertura de pruebas | Era 2,3 % antes de los arreglos | Añadir pruebas por etapas |
| Hook de commit | El sistema de permisos rechazó instalarlo | Decisión del dueño |
| 22 vulnerabilidades moderadas | No hay arreglo sin cambios mayores | Revisarlas al actualizar Expo y Firebase |
| Textos fijos en un solo idioma | Solo se corrigieron los encontrados | Revisar el resto |
| `main` va 237 commits atrás | No se hizo ningún merge | Decisión del dueño |
| Mapa en imagen | La última imagen tiene cables equivocados y faltan 3 placas | Retomar después de este informe |

Quedaron sin cambiar a propósito "Motorista de app", porque es una opción que la
persona elige, y los Términos, porque son texto legal con versiones.
