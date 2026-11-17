# Clase guiada 08: Firebase por dentro

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** de 1 a 2 horas. Esta clase es de **leer y entender**: en ningún momento se cambia nada en Firebase. Lo que está en producción son los datos de personas reales.

**Lo que necesitas saber antes:** Temas 01 a 07 (y el 17 ayuda: `fetch`, JSON).

## 1. ¿Qué es Firebase?

> 🎙️ **El profesor:** {{alumno}}, hasta ahora mirabas la app **en el teléfono**. Pero cuando un conductor registra un ingreso, ese dato no se queda solo en su teléfono: viaja a internet, se guarda, y vuelve cuando abre la app en otro aparato. Hoy bajamos al **depósito** y a la **oficina de atrás**: Firebase.

**Firebase** es un conjunto de servicios de Google para que una app tenga **servidor sin que tú administres un servidor**. No compras una computadora ni la mantienes encendida: Google lo hace, y tú pagas por lo que usas.

A esto se le llama **backend** (la parte de atrás: datos, seguridad, lógica en la nube), en contraste con el **frontend** (lo que ves: las pantallas). Y a que no tengas que administrar servidores se le dice **serverless** ("sin servidor", aunque en realidad hay servidores: son de Google).

> 🌎 **En la vida real:** alquilar un local en un shopping en vez de construir tu propio edificio. El shopping pone la seguridad, la luz, la limpieza; tú pagas el alquiler según cuánto usas y te dedicas a vender. Si un día llega mucha gente, el shopping abre más puertas.

> 🌎 **Otro ejemplo:** Como usar la luz de la compañía eléctrica en vez de comprar un generador: no lo mantienes tú, pagas según lo que gastas, y si consumes más, la compañía lo da.

```practica
escribe :: Con tus palabras: ¿qué es Firebase? :: Un conjunto de servicios de Google que le da a la app un servidor (datos, inicio de sesión, funciones) sin que yo tenga que administrar computadoras; pago por lo que uso.
elige :: ¿Qué es el backend? :: Las pantallas de la app :: La parte de atrás: datos, seguridad y lógica en la nube :: El teléfono
vf :: Con Firebase tienes que comprar y mantener tu propio servidor
```

> 🔁 **Repaso:** Firebase = backend sin administrar servidores (serverless). Como alquilar en un shopping.

## 2. Las piezas que usa tu app

> 🎙️ **El profesor:** Firebase no es una cosa: son varias piezas. Tu app usa cinco. Imagínalas como **los servicios de un edificio de oficinas**.

> 🌎 **Otro ejemplo:** En un hospital: la recepción que te identifica (Authentication), el archivo de historias clínicas (Firestore), el depósito de radiografías (Storage), los médicos que trabajan adentro (Cloud Functions) y la cartelera de la entrada (Hosting).

| Pieza | Qué es | Para qué la usa Copiloto | 🌎 En el edificio |
|---|---|---|---|
| **Authentication** | El **portero**: sabe quién es cada persona | Inicio de sesión; cada persona recibe un id único, el **`uid`** | La recepción que te da una credencial con tu número |
| **Firestore** | La **base de datos** | Ingresos, gastos, vehículos, San, ajustes… | El archivador con todas las carpetas |
| **Storage** | Un **depósito de archivos** | Las fotos del perfil | El depósito de cajas grandes |
| **Cloud Functions** | **Código que corre en el servidor** | El Copiloto (IA), el panel, las suscripciones, los códigos por SMS | Los empleados de la oficina de atrás |
| **Hosting** | **Páginas web** | La landing y el panel (`copiloto-driver-admin.web.app`) | La vidriera a la calle |

Todo está en un **proyecto** de Firebase llamado **`copiloto-driver-ia`**: el "contrato de alquiler" a nombre de tu negocio.

El **`uid`** (*user id*) es importantísimo: es un código único que Firebase le da a cada persona cuando inicia sesión. Todo lo demás se organiza a partir de él.

> ✋ **Para y piensa:** el Copiloto necesita la clave de Gemini (la IA). ¿En qué pieza vive esa parte?

<details>
<summary>Ver la respuesta</summary>

En **Cloud Functions** (el servidor). La clave nunca va en la app (lo ves en la parte 5).

</details>

```practica
elige :: ¿Qué pieza sabe quién es cada persona? :: Firestore :: Authentication :: Hosting
elige :: ¿Dónde se guardan los ingresos y gastos? :: Storage :: Firestore :: Hosting
elige :: ¿Dónde se guardan las fotos del perfil? :: Firestore :: Storage :: Authentication
elige :: ¿Qué es el `uid`? :: Una contraseña :: El id único que Firebase le da a cada persona :: El nombre del proyecto
vf :: El panel web se publica con Firebase Hosting
```

> 🔁 **Repaso:** Authentication (quién eres, `uid`), Firestore (datos), Storage (archivos), Cloud Functions (código del servidor), Hosting (páginas). Todo en el proyecto `copiloto-driver-ia`.

## 3. Firestore: cómo se guardan los datos

> 🎙️ **El profesor:** Firestore no es como Excel. No hay una tabla gigante con filas y columnas. Hay **colecciones** y **documentos**. Con la imagen correcta, es muy fácil.

> 🌎 **Otro ejemplo:** Como el fichero de una biblioteca: cajones por tema (colecciones), una ficha por libro (documentos), los datos de cada ficha (campos), y a veces una ficha con hojitas abrochadas (subcolecciones).

| Palabra | Qué es | 🌎 En el archivador |
|---|---|---|
| **Colección** | Un grupo de documentos del mismo tipo | Un **cajón** con etiqueta: "Clientes" |
| **Documento** | Un registro, con campos | Una **ficha** dentro del cajón |
| **Campo** | Un dato del documento | Un **renglón** de la ficha: `amountBrl: 50` |
| **Subcolección** | Una colección dentro de un documento | Una **carpetita** abrochada a la ficha |

Y una diferencia con Excel: **cada ficha puede tener sus propios renglones**. No todas tienen que tener los mismos campos.

### Cómo está organizada tu app

```text
users/                          ← colección: una entrada por persona
  {uid}/                        ← el documento de una persona (su id)
    settings/main               ← sus ajustes: vehículos, metas, idioma, nombre de "Mi empresa"...
    earnings/{id}               ← cada ingreso
    expenses/{id}               ← cada gasto del vehículo
    personalExpenses/{id}       ← cada gasto personal (la cartera)
    recurringExpenses/{id}      ← cuentas fijas (agua, alquiler...)
    vehicleTracking/{id}        ← combustible, aceite, kilometraje...
    copilotConversations/{id}   ← las conversaciones con el Copiloto
    billing/...                 ← la suscripción (solo la escribe el servidor)

sanGroups/{id}                  ← los grupos del San (los comparten varias personas)
vehicleCatalog/{clave}          ← modelos y fotos del panel
vehicleColors/{id}              ← colores que agregas en el panel
supportTickets/{id}             ← el chat de soporte
```

Las llaves `{uid}` y `{id}` quieren decir "aquí va un valor distinto en cada caso".

**¿Por qué casi todo está dentro de `users/{uid}`?** Porque así los datos de cada persona están **separados**, y es muy fácil escribir la regla "**cada uno solo ve lo suyo**".

> 🌎 **En la vida real:** un edificio de departamentos. `users/` es el edificio; `{uid}` es **tu departamento**, con tu número en la puerta; adentro, cada habitación guarda lo tuyo. Afuera están los **espacios comunes**: el salón del San, la cartelera de colores, el buzón de reclamos.

> 🌎 **Otro ejemplo:** Como los casilleros de un gimnasio: cada socio tiene el suyo con su número, y adentro guarda sus cosas; las pesas del salón son de todos.

### Un ingreso, por dentro

> 🌎 **En la vida real:** Un ingreso guardado es como un recibo de taxi: quién (la plataforma), cuánto (50), de qué tipo, a qué hora y con qué carro.

> 🌎 **Otro ejemplo:** Es como una fila de una planilla de gastos: cada columna con su nombre y su valor, solo que en JSON.

```json
{
  "appId": "my_company",
  "appLabel": "Thermomac",
  "amountBrl": 50,
  "incomeType": "plataforma",
  "transactionAt": "2026-11-10T14:20:00.000Z",
  "vehicleId": "veh-123"
}
```

Es un **documento** en `users/{uid}/earnings/{id}`. Fíjate: es JSON, como en el Tema 17. `appId: "my_company"` es justo el id de la función `isImmutableEarningPlatform` del Tema 01. La fecha está en un formato estándar (año-mes-díaThora).

> ✋ **Para y piensa:** ¿dónde se guarda un gasto personal tuyo (por ejemplo, un almuerzo)?

<details>
<summary>Ver la respuesta</summary>

En `users/{tu uid}/personalExpenses/{id}`: un documento nuevo en la subcolección de gastos personales, dentro de tu documento de usuario.

</details>

```practica
elige :: En Firestore, ¿qué es una colección? :: Un dato suelto :: Un grupo de documentos del mismo tipo :: Una contraseña
elige :: En Firestore, ¿qué es un documento? :: Un archivo PDF :: Un registro con campos :: Una pantalla
elige :: ¿Dónde vive un ingreso de una persona? :: `earnings/{id}` :: `users/{uid}/earnings/{id}` :: `sanGroups/{id}`
elige :: ¿Por qué los grupos del San están fuera de `users`? :: Por error :: Porque los comparten varias personas :: Porque son públicos para todo el mundo
vf :: En Firestore todos los documentos de una colección tienen que tener los mismos campos
escribe :: ¿Por qué casi todo está dentro de `users/{uid}`? :: Para que los datos de cada persona estén separados y sea fácil escribir la regla de que cada uno solo ve lo suyo.
```

> 🔁 **Repaso:** colección (cajón) → documento (ficha) → campos (renglones) → subcolección (carpetita). Casi todo vive en `users/{uid}/…`.

## 4. Las reglas de seguridad: el portero de la base de datos

> 🎙️ **El profesor:** esta es **la parte más importante de la clase**, y una de las más importantes de toda tu carrera. Presta atención.

> 🌎 **En la vida real:** Es como la cerradura de cada habitación de un hotel: la llave de tu habitación no abre la del vecino, aunque los dos estén en el mismo pasillo.

> 🌎 **Otro ejemplo:** Es como el control de acceso de un edificio de oficinas: la tarjeta de cada empleado solo abre los pisos donde trabaja.

### El problema

La app está en el teléfono de miles de personas que **no controlas**. Y aquí va algo que sorprende: **cualquiera puede intentar** leer o escribir en tu base de datos **directamente**, sin usar tu app (con una app falsa, o con un programa). La app no es una muralla.

Por eso existen las **reglas de seguridad**: un archivo, **`firestore.rules`**, que Firebase revisa **en el servidor** en cada lectura y cada escritura, venga de donde venga.

> 🌎 **En la vida real:** un edificio con muchas puertas y ventanas. Alguien podría entrar por una ventana sin pasar por la recepción. Las reglas son un portero **dentro de cada puerta**, que revisa la credencial de todo el que quiera abrir algo.

> 🌎 **Otro ejemplo:** Como un cajero automático: cualquiera puede acercarse e intentar sacar plata; lo que protege es que el banco revisa la tarjeta y la clave en su sistema, no la pantalla del cajero.

### Regla real 1: cada uno ve solo sus ingresos

> 🌎 **En la vida real:** Es como la caja de seguridad de un banco: necesitas tu identificación (sesión) **y** que la caja sea la tuya (el uid). Con una sola de las dos, no se abre.

> 🌎 **Otro ejemplo:** Es como retirar un paquete en el correo: muestras tu documento y tiene que coincidir con el nombre del paquete.

```text
match /users/{userId}/earnings/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId && hasActiveAccess(userId);
}
```

Leída parte por parte:
- `match /users/{userId}/earnings/{docId}` → esta regla vale para **los ingresos de cualquier persona**. `{userId}` toma el valor del departamento que se quiere abrir.
- `allow read, write` → permite **leer y escribir**…
- `if request.auth != null` → …solo si **inició sesión** (tiene credencial)…
- `&& request.auth.uid == userId` → …**y** si el `uid` de quien pide es **el mismo** del departamento. `&&` se lee "y": tiene que cumplir **todas**.
- `&& hasActiveAccess(userId)` → …y una revisión más de acceso.

> 📌 **Nota:** `hasActiveAccess` antes revisaba que la persona tuviera la suscripción al día. Desde el **31/10/2026 la app es gratis** (solo el Copiloto IA es pago, y eso se controla en el servidor), así que hoy solo revisa que haya sesión. Se dejó la función en su lugar para que, si algo vuelve a ser pago, baste cambiar una sola parte.

Si alguien con sesión intenta leer los ingresos de **otra** persona, el `uid` no coincide, y Firestore responde **"Missing or insufficient permissions"** (sin permiso). Es el error que viste en el Tema 07.

### Regla real 2: los colores del panel

```text
match /vehicleColors/{id} {
  allow read: if request.auth != null;
  allow write: if false;
}
```

- Cualquiera **con sesión** puede **leerlos** (la app los necesita para la lista de colores).
- `allow write: if false` → **nadie** puede escribirlos desde la app. Nunca.
- ¿Y cómo se agregan? Desde el **servidor** (Cloud Functions), que tiene poderes de administrador y **no pasa** por estas reglas.

> 🌎 **En la vida real:** la cartelera del edificio: cualquier inquilino la puede **leer**, pero ningún inquilino puede escribir en ella. Solo la administración tiene la llave de la vitrina.

> 🌎 **Otro ejemplo:** Como el horario de una farmacia pegado en la vidriera: todos lo pueden leer, pero solo el dueño lo cambia.

### Las reglas tienen pruebas

> 🌎 **En la vida real:** Es como probar las alarmas de un banco con un ladrón de mentira, en un edificio de práctica, antes de abrir al público.

> 🌎 **Otro ejemplo:** Es como el examen práctico de un cerrajero: le dan puertas de práctica y tiene que demostrar que nadie más las abre.

Un error en las reglas puede exponer los datos de **todas** las personas. Por eso tu app tiene pruebas de reglas (`rules-test/`), que corren con el **emulador** de Firebase: una copia falsa de la base de datos en tu computadora. Por ejemplo, intentan leer los ingresos de otra persona y comprueban que la regla **lo impida**. Y corren en el CI (Tema 04, trabajo `reglas`).

> ✋ **Para y piensa:** ¿por qué no alcanza con que la app "no muestre" los datos de otros?

<details>
<summary>Ver la respuesta</summary>

Porque alguien puede saltarse la app y pedirle los datos **directamente** a Firestore. Lo único que lo frena es la regla, que se revisa **en el servidor**.

</details>

```practica
escribe :: Con tus palabras: ¿para qué sirven las reglas de seguridad de Firestore? :: Para decidir en el servidor quién puede leer o escribir cada dato, porque cualquiera puede intentar acceder a la base sin usar la app.
elige :: En `request.auth.uid == userId`, ¿qué se compara? :: La contraseña :: El id de quien pide con el id del departamento (la carpeta) :: El correo
elige :: ¿Qué quiere decir `request.auth != null`? :: Que no inició sesión :: Que inició sesión :: Que es administrador
elige :: ¿Qué hace `allow write: if false`? :: Permite escribir a todos :: No permite escribir a nadie desde la app :: Borra los datos
vf :: Si la app no muestra los datos de otros, eso alcanza para protegerlos
vf :: Las reglas se prueban con el emulador, una copia falsa de la base de datos
elige :: Alguien intenta leer ingresos ajenos. ¿Qué responde Firestore? :: Los datos :: Missing or insufficient permissions :: Una lista vacía
```

> 🔁 **Repaso:** las reglas (`firestore.rules`) se revisan en el servidor en cada operación. "Cada uno ve lo suyo" = sesión + `uid` igual al de la carpeta. Lo que nadie escribe desde la app: `if false`. Y todo con pruebas en el emulador.

## 5. Cloud Functions: el código del servidor

> 🎙️ **El profesor:** hay cosas que **no se pueden** hacer en el teléfono. Para eso está el código que corre en el servidor.

Tres motivos:
1. **Secretos.** La clave de la IA (Gemini) **no puede estar en la app**: todo lo que está en la app se puede extraer. Una clave en la app es una clave pública. Vive en el servidor.
2. **Poderes de administrador.** El panel cambia el catálogo de **todos**; eso no se le puede permitir a cualquier teléfono.
3. **Cosas automáticas.** Avisos y suscripciones que corren aunque nadie abra la app.

> 🌎 **En la vida real:** en el banco, la combinación de la caja fuerte no se pega en el cajero automático: la sabe solo el empleado de adentro.

> 🌎 **Otro ejemplo:** Como la cocina de un restaurante: el cliente pide desde la mesa, pero el cuchillo, el fuego y la receta secreta se quedan atrás, con el cocinero.

Están en la carpeta **`functions/src/`**. Algunas reales:

| Función | Qué hace |
|---|---|
| `aiCopilot` | Recibe la pregunta, se la pasa a Gemini con los datos de la persona y devuelve la respuesta |
| `adminUpsertVehicleColor` | El panel agrega un color (revisa que seas tú, el dueño) |
| `adminUploadVehiclePhoto` | El panel sube la foto de un carro |
| `requestOtpCode` / `verifyOtpCode` | Mandan y revisan el código por SMS |
| `revenueCatWebhook` | Recibe los avisos de pago de las suscripciones |

### Cómo se protege una función de administrador

```ts
export const adminUpsertVehicleColor = onCall(async (request) => {
  assertOwner(request.auth?.token.email);
  ...
});
```

- `onCall` crea una función que la app o el panel pueden **llamar** por internet.
- `request.auth?.token.email` es el correo de quien llama. El `?.` quiere decir "si existe `auth`, dame su `token`; si no, `undefined`" (para no dar error si no hay sesión).
- `assertOwner(...)` revisa que el correo sea **el del dueño**. Si no, **corta** con un error.

> 🌎 **En la vida real:** la oficina del gerente tiene un timbre (`onCall`) que cualquiera puede tocar, pero la secretaria (`assertOwner`) mira quién es antes de abrir.

> 🌎 **Otro ejemplo:** Como una sala de servidores con lector de huella: la puerta está en un pasillo público, pero solo se abre con la huella del dueño.

### Publicar (deploy)

El código del servidor no cambia solo cuando lo guardas. Hay que **publicarlo**:

```bash
npx firebase-tools deploy --only functions --project copiloto-driver-ia
```

- `deploy` = publicar.
- `--only functions` = solo las funciones (no las reglas ni el hosting).
- `--project copiloto-driver-ia` = en qué proyecto.

> 🌎 **En la vida real:** cambiar el reglamento en tu computadora no cambia nada en la oficina; hay que llevarlo e imprimirlo allá.

> 🌎 **Otro ejemplo:** Como actualizar el menú de una cadena de restaurantes: imprimirlo en la oficina no alcanza; hay que mandarlo a los locales.

```practica
elige :: ¿Por qué la clave de Gemini está en el servidor y no en la app? :: Porque la app es lenta :: Porque todo lo que está en la app se puede extraer :: Porque Google lo exige
elige :: ¿Qué hace `assertOwner(...)`? :: Agrega un color :: Revisa que quien llama sea el dueño, y si no, corta :: Publica la función
elige :: ¿Qué hace `deploy`? :: Borra las funciones :: Publica el código del servidor en Firebase :: Corre las pruebas
vf :: El servidor (Cloud Functions) no pasa por las reglas de Firestore
escribe :: Nombra los tres motivos para poner código en el servidor. :: Secretos (como la clave de la IA), poderes de administrador, y cosas automáticas que corren aunque nadie abra la app.
```

> 🔁 **Repaso:** Cloud Functions para secretos, poderes de admin y tareas automáticas. `onCall` + `assertOwner` para proteger. Y se publica con `deploy`.

## 6. El camino completo de un ingreso

> 🎙️ **El profesor:** juntemos todo. Esto es lo que pasa, por dentro, cuando registras R$ 50 en "Mi empresa". Si puedes contar este recorrido en una entrevista, demuestras que entiendes tu app de punta a punta.

1. **La pantalla** (`FinanceUnifiedRegisterForm`) arma el ingreso con lo que escribiste.
2. **El contexto** (`EarningsContext`) decide si es acumulativo (Tema 01) y calcula cuánto guardar.
3. **El servicio** (`earningsCloudStorage`) lo escribe en Firestore, en `users/{tu uid}/earnings/{id nuevo}`.
4. **Las reglas** revisan que el `uid` sea el tuyo, y lo permiten.
5. **Firestore** lo guarda y avisa a la app.
6. **La pantalla del Inicio** se actualiza **sola**, porque está escuchando los cambios.
7. **El Copiloto** recibe un evento (`earning.added`) y actualiza su memoria.

> 🌎 **En la vida real:** depositar en el banco. Llenas la boleta (pantalla); el cajero decide cómo se cuenta (contexto); lo lleva a **tu** carpeta (servicio); el guardia revisa que la carpeta sea la tuya (reglas); se guarda y suena una campanita (Firestore); la pantalla del saldo se actualiza sola; tu asesor anota "hoy ganó 50 más" (Copiloto).

> 🌎 **Otro ejemplo:** Como un pedido online: llenas el carrito (pantalla), se calcula el total con las promociones (contexto), se manda al depósito (servicio), se verifica tu cuenta (reglas), se guarda el pedido, y te llega la notificación (Inicio y Copiloto).

> ✋ **Para y piensa:** en el paso 4, ¿qué pasaría si el `uid` no fuera el tuyo?

<details>
<summary>Ver la respuesta</summary>

Firestore **rechaza** la escritura con "Missing or insufficient permissions", y el ingreso no se guarda.

</details>

```practica
escribe :: Cuenta en orden el camino de un ingreso desde la pantalla hasta el Copiloto. :: La pantalla arma el ingreso; el contexto decide cómo se cuenta; el servicio lo escribe en users/{uid}/earnings; las reglas revisan el uid; Firestore lo guarda y avisa; el Inicio se actualiza solo; el Copiloto recibe el evento y actualiza su memoria.
elige :: ¿Qué pieza decide si el ingreso es acumulativo? :: La pantalla :: El contexto (`EarningsContext`) :: Las reglas
vf :: La pantalla del Inicio se actualiza sola porque escucha los cambios de Firestore
```

> 🔁 **Repaso:** pantalla → contexto → servicio → reglas → Firestore → Inicio se actualiza → Copiloto aprende.

## 7. Seguridad: las reglas que nunca se rompen

> 🎙️ **El profesor:** tres reglas de oro, escritas en el `AGENTS.md` de la app. No se negocian.

- **Nunca** una clave secreta (por ejemplo, las que empiezan con `sk_...`) en la app ni en GitHub.
- La **cuenta de servicio** (la llave que da **poder total** sobre Firebase) vive **fuera** del proyecto, en otra carpeta de la Mac.
- Las escrituras en producción, **solo con tu aprobación**.

> 🌎 **En la vida real:** nunca la llave de la casa debajo del felpudo; la llave maestra del edificio en una caja fuerte aparte, no en el mismo llavero; y el contador no mueve dinero sin tu firma.

> 🌎 **Otro ejemplo:** Como las reglas de un banco: la clave nunca se dice por teléfono, la llave de la bóveda la guarda el gerente aparte, y ningún movimiento grande se hace sin la firma del titular.

> 💡 **Idea:** ¿y la configuración de Firebase que sí está en la app (el nombre del proyecto, etc.)? Esa es **pública por diseño**: no es un secreto. Lo que protege los datos no es esconder esa configuración, sino **las reglas**. Esto lo vas a ver otra vez en el Tema 13.

```practica
vf :: La cuenta de servicio de Firebase se guarda dentro del proyecto, para tenerla a mano
vf :: La configuración pública de Firebase en la app no es un secreto; lo que protege son las reglas
escribe :: Di las tres reglas de seguridad de esta parte. :: Nunca claves secretas en la app ni en GitHub; la cuenta de servicio fuera del proyecto; y escrituras en producción solo con aprobación del dueño.
```

> 🔁 **Repaso:** sin secretos en la app, la cuenta de servicio aparte, y nada se escribe en producción sin tu aprobación.

## Ejercicios

> 🎙️ **El profesor:** solo mirar, **nunca tocar** producción. Si no tienes acceso a la app o a la consola, responde 4 y 5.

> 🌎 **En la vida real:** Es como hacer una visita guiada al edificio con el plano en la mano, mirando cada cerradura, sin tocar nada.

1. Abre `firestore.rules` y busca la regla de `expenses`. Explica con tus palabras quién puede leer los gastos.
2. Busca la regla de `billing`. ¿Por qué la app no puede escribir la suscripción?
3. En la consola de Firebase (console.firebase.google.com → proyecto `copiloto-driver-ia` → Firestore), busca **tu** documento en `users`. Mira tus `settings/main` **sin cambiar nada**. ¿Encuentras tus vehículos?
4. ¿Por qué la clave de Gemini está en el servidor y no en la app?
5. Si mañana alguien quiere leer los ingresos de otra persona desde una app falsa, ¿qué lo detiene?

<details>
<summary>Ver las correcciones explicadas</summary>

1. La regla de `expenses` es igual a la de `earnings`: solo **la persona dueña** de esa carpeta, con sesión iniciada.
2. La regla dice:

```text
match /users/{userId}/billing/{docId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false;
}
```

La persona **puede leer** su suscripción, pero **nadie** la escribe desde la app. Si la app pudiera, cualquiera se daría el plan pago gratis. Solo la escribe el servidor, después de confirmar el pago (`revenueCatWebhook`).

3. Dentro de `settings/main` hay una lista con tus vehículos (marca, modelo, color…). Solo mirar.
4. Porque todo lo que está en la app se puede extraer: una clave en la app es una clave pública.
5. **Las reglas de seguridad**: el `uid` de quien pide no coincide con el de la carpeta, y Firestore lo rechaza en el servidor.

</details>

```practica
elige :: ¿Por qué la app no puede escribir `billing`? :: Porque es muy grande :: Porque cualquiera se daría el plan pago gratis; solo lo escribe el servidor tras confirmar el pago :: Porque Google lo prohíbe
```

## Para la entrevista

> 🎙️ **El profesor:** en voz alta. Esta es de las respuestas que más te van a lucir.

> 🌎 **En la vida real:** Explicar tu backend es como explicar un edificio: recepción, archivo, portero y oficina de atrás, cada uno con su trabajo.

> 🎤 **Entrevista:** "¿Cómo está hecho el backend de tu app?"

<details>
<summary>Ver una buena respuesta</summary>

"Uso Firebase: Authentication para el inicio de sesión, Firestore como base de datos, Cloud Functions para lo que necesita secretos o permisos de administrador (como la IA con Gemini), y Hosting para el panel y la landing. Los datos de cada persona están dentro de su propio documento de usuario, y las reglas de seguridad garantizan que cada uno solo lea lo suyo. Esas reglas tienen pruebas automáticas con el emulador, que corren en el CI."

</details>

> 🎤 **Entrevista:** "¿Por qué Firebase?"

<details>
<summary>Ver una buena respuesta</summary>

"Porque me deja tener un servidor sin administrarlo, escala solo y tiene un plan gratis generoso para empezar. La contra es que dependo de Google y hay que cuidar el costo de las lecturas."

**Por qué es buena:** dice ventajas **y** desventajas. Eso muestra criterio.

</details>

```practica
escribe :: Explica en voz alta (y escribe) cómo protege tu app los datos de cada persona. :: Cada persona tiene sus datos dentro de users/{uid}; las reglas de Firestore solo dejan leer y escribir si hay sesión y el uid coincide con el de la carpeta; lo delicado se hace en Cloud Functions; y las reglas tienen pruebas con el emulador.
```

> 🔁 **Repaso final de la clase:** Firebase y sus cinco piezas, cómo se guardan los datos en Firestore, las reglas de seguridad (lo más importante), Cloud Functions, el camino de un ingreso y las reglas de oro de seguridad. Próxima: **Tema 09, CRUD en Node.js**.
