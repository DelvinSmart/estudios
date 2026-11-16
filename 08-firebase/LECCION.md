# Tema 08: Firebase por dentro

> 🌎 **En la vida real:** hasta ahora mirabas la tienda por dentro (la app en el teléfono). Hoy bajas al **depósito** y a la **oficina de atrás**: dónde se guarda la mercadería, quién tiene llave y quién trabaja ahí cuando la tienda está cerrada.

Tu app guarda los datos de las personas en **Firebase**. En este tema vas a entender dónde vive cada dato, quién puede leerlo y qué pasa cuando el Copiloto o el panel hacen algo.

**Antes de empezar:** Temas 01 a 07.

**Tiempo:** de 1 a 2 horas.

## 1. ¿Qué es Firebase?

> 🌎 **En la vida real:** es como alquilar un local en un shopping en vez de construir tu propio edificio. El shopping pone la seguridad, la luz, la limpieza y el estacionamiento; tú pagas el alquiler según cuánto usas y te dedicas a vender. Si un día llega mucha gente, el shopping abre más puertas; no tienes que construir nada.

**Firebase** es un conjunto de servicios de Google para que una app tenga **servidor sin que tú administres un servidor**. Tú no compras una computadora ni la mantienes encendida: Google lo hace, y tú pagas por lo que usas.

**Comparación:** en vez de construir un edificio para guardar tus cosas, alquilas casilleros, una oficina y un portero.

## 2. Las piezas que usa tu app

> 🌎 **En la vida real:** son los servicios del edificio de oficinas que alquilaste:
> - **Authentication** = la **recepción** con el guardia que te pide documento y te da una credencial con tu número (`uid`).
> - **Firestore** = el **archivo de carpetas** donde se guardan todos los papeles.
> - **Storage** = el **depósito** de cajas grandes: las fotos.
> - **Cloud Functions** = los **empleados de la oficina de atrás**: hacen trámites que el cliente no puede hacer solo, como usar la caja fuerte.
> - **Hosting** = la **vidriera** que da a la calle: la página web que ve cualquiera.
>
> El **proyecto** `copiloto-driver-ia` es el contrato de alquiler: todo eso está a nombre de tu negocio.

| Pieza | Qué es | Para qué la usa Copiloto |
|---|---|---|
| **Authentication** | El **portero**: sabe quién es cada persona | Inicio de sesión: cada persona recibe un id único (el `uid`) |
| **Firestore** | La **base de datos** | Ingresos, gastos, vehículos, San, ajustes... |
| **Storage** | Un **depósito de archivos** | Las fotos del perfil |
| **Cloud Functions** | **Código que corre en el servidor** | El Copiloto (IA), el panel, las suscripciones, el OTP |
| **Hosting** | **Páginas web** | La landing y el panel (`copiloto-driver-admin.web.app`) |

Todo está en un **proyecto** de Firebase llamado `copiloto-driver-ia`.

## 3. Firestore: cómo se guardan los datos

> 🌎 **En la vida real:** es como el archivador metálico de una oficina:
> - **Colección** = un **cajón** con una etiqueta: "Clientes".
> - **Documento** = una **ficha** dentro del cajón: la ficha de un cliente.
> - **Campo** = un **renglón** de la ficha: "Teléfono: 47 9999-0000".
> - **Subcolección** = una **carpetita** abrochada a la ficha: "Facturas de este cliente".
>
> No es como Excel, donde todo está en una sola tabla gigante con filas y columnas iguales. Cada ficha puede tener sus propios renglones.

Firestore no usa tablas como Excel. Usa **colecciones** y **documentos**:

| Palabra | Qué es | Comparación |
|---|---|---|
| **Colección** | Un grupo de documentos del mismo tipo | Una carpeta |
| **Documento** | Un registro, con campos | Una hoja dentro de la carpeta |
| **Campo** | Un dato del documento | Una línea de la hoja: `amountBrl: 50` |
| **Subcolección** | Una colección dentro de un documento | Una carpeta dentro de una hoja |

### Cómo está organizada tu app

> 🌎 **En la vida real:** es como un edificio de departamentos:
> - `users/` = el edificio.
> - `{uid}` = **tu departamento**, con tu número en la puerta.
> - Adentro, cada habitación guarda lo tuyo: `settings` es tu escritorio con tus preferencias, `earnings` la caja de tus ingresos, `expenses` la de los gastos del carro, `personalExpenses` tu billetera, `recurringExpenses` las cuentas fijas pegadas en la nevera, `vehicleTracking` la libreta del carro, `copilotConversations` tus charlas con el Copiloto, `billing` el contrato de la suscripción, que **solo** firma la administración.
> - Afuera de los departamentos están los **espacios comunes**: `sanGroups` (el salón donde se junta el grupo del San), `vehicleCatalog` y `vehicleColors` (la cartelera del edificio), `supportTickets` (el buzón de reclamos).
>
> ¿Por qué cada uno en su departamento? Porque así la regla del portero es simple: "cada uno entra solo al suyo".
>
> El ingreso guardado es como un recibo: quién (Thermomac), cuánto (50), de qué tipo, cuándo y con qué carro.

```
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

**Por qué casi todo está dentro de `users/{uid}`:** así los datos de cada persona están **separados**, y es fácil escribir la regla "cada uno solo ve lo suyo".

Un ingreso guardado se ve más o menos así:
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

## 4. Las reglas de seguridad: el portero de la base de datos

> 🌎 **En la vida real:** la app vive en millones de teléfonos que no controlas, como un edificio con muchas puertas. Cualquiera podría intentar entrar por una ventana, sin pasar por la recepción. Las **reglas** son el portero que está **dentro** de cada puerta y revisa la credencial de todo el que quiera abrir algo, venga por donde venga.

La app está en el teléfono de cada persona, y **cualquiera puede intentar** leer o escribir en la base de datos directamente, sin usar la app. Por eso existen las **reglas de seguridad**: un archivo que dice quién puede hacer qué.

Están en tu app, en **`firestore.rules`**.

### Regla real 1: cada uno ve solo sus ingresos

> 🌎 **En la vida real:** es exactamente el portero de un edificio:
> - "¿Tiene credencial?" (`request.auth != null`). Si no, no entra.
> - "¿El número de su credencial es el mismo que el de este departamento?" (`uid == userId`). Si no, no entra.
> - "¿Está al día?" (`hasActiveAccess`).
> - `&&` es "y": tiene que cumplir **todas**.
>
> Si el vecino del 302 quiere entrar al 305 con su propia credencial, el portero le dice: "Sin permiso" (*Missing or insufficient permissions*).
```
match /users/{userId}/earnings/{docId} {
  allow read, write: if request.auth != null && request.auth.uid == userId && hasActiveAccess(userId);
}
```
- `match /users/{userId}/earnings/{docId}` → esta regla vale para los ingresos de cualquier persona.
- `allow read, write` → permite leer y escribir...
- `if request.auth != null` → ...solo si **inició sesión**...
- `&& request.auth.uid == userId` → ...y si el `uid` de quien pide es **el mismo** de la carpeta. `&&` se lee "y".

Si alguien con sesión intenta leer los ingresos de otra persona, el `uid` no coincide y Firestore responde **"Missing or insufficient permissions"** (sin permiso).

### Regla real 2: los colores del panel

> 🌎 **En la vida real:** es como la **cartelera** del edificio: cualquier inquilino con credencial la puede **leer**, pero **ningún** inquilino puede escribir en ella (`if false`). Solo la administración (el servidor) tiene la llave de la vitrina y pega los avisos.
```
match /vehicleColors/{id} {
  allow read: if request.auth != null;
  allow write: if false;
}
```
- Cualquiera **con sesión** puede leerlos (la app los necesita para la lista de colores).
- `allow write: if false` → **nadie** puede escribirlos desde la app. Solo el servidor (Cloud Functions) puede, porque el servidor no pasa por estas reglas.

### Por qué las reglas tienen pruebas

> 🌎 **En la vida real:** es como probar las cerraduras de un edificio antes de que se muden los inquilinos. Usas una **maqueta** (el emulador) y mandas a alguien a intentar abrir la puerta del vecino. Si la cerradura no cede, aprobado. Si una sola cerradura falla, se pueden robar las cosas de **todos**.
Un error en las reglas puede exponer los datos de todos. Por eso tu app tiene **23 pruebas de reglas** (`rules-test/`), que corren con el **emulador** de Firebase: una copia falsa de la base de datos en tu computadora. Ejemplo: intentan leer los ingresos de otra persona y comprueban que la regla lo **impida**.

## 5. Cloud Functions: el código del servidor

> 🌎 **En la vida real:** hay cosas que un cliente de banco no puede hacer solo en el cajero:
> - **Secretos**: la combinación de la caja fuerte no se pega en el cajero automático; la sabe solo el empleado de adentro. La clave de Gemini es esa combinación.
> - **Poderes de administrador**: cambiar el precio de todos los productos de la tienda no lo puede hacer cualquier cliente desde su teléfono.
> - **Cosas automáticas**: el banco te cobra la cuota del mes aunque tú no vayas ese día.
>
> Cada función es un empleado con una tarea:
> - `aiCopilot` = el asesor que lee tu ficha, consulta al experto (Gemini) y te responde.
> - `adminUpsertVehicleColor` / `adminUploadVehiclePhoto` = el que actualiza la cartelera, pero solo si se lo pide el dueño.
> - `requestOtpCode` / `verifyOtpCode` = el que te manda el código por SMS y después revisa que lo escribiste bien.
> - `revenueCatWebhook` = el que recibe el aviso del banco: "este cliente pagó".

Algunas cosas **no pueden** hacerse en el teléfono:
- **Secretos:** la clave de la IA (Gemini) no puede estar en la app, porque cualquiera podría sacarla. Vive en el servidor.
- **Poderes de administrador:** el panel cambia el catálogo de todos; eso no se le puede permitir a cualquier teléfono.
- **Cosas automáticas:** avisos y suscripciones que corren aunque nadie abra la app.

Están en la carpeta **`functions/src/`** de tu app. Ejemplos reales:

| Función | Qué hace |
|---|---|
| `aiCopilot` | Recibe la pregunta, se la pasa a Gemini con los datos de la persona y devuelve la respuesta |
| `adminUpsertVehicleColor` | El panel agrega un color (revisa que seas tú, el dueño) |
| `adminUploadVehiclePhoto` | El panel sube la foto de un carro |
| `requestOtpCode` / `verifyOtpCode` | Los códigos de verificación |
| `revenueCatWebhook` | Recibe los avisos de pago de las suscripciones |

### Cómo se protege una función de administrador

> 🌎 **En la vida real:** es como la oficina del gerente: tiene un timbre (`onCall`) que cualquiera puede tocar, pero la secretaria (`assertOwner`) mira quién es antes de abrir. Si no eres el dueño, te dice "no puede pasar" y ahí se termina.
```ts
export const adminUpsertVehicleColor = onCall(async (request) => {
  assertOwner(request.auth?.token.email);
  ...
});
```
- `onCall` crea una función que la app o el panel pueden **llamar**.
- `assertOwner(...)` revisa que el correo de quien llama sea el tuyo. Si no, corta ahí con un error.

### Publicar (deploy)

> 🌎 **En la vida real:** cambiar el reglamento interno en tu computadora no cambia nada en la oficina. Hay que **llevarlo e imprimirlo allá**. `deploy` es eso: mandar las instrucciones nuevas a los empleados de la nube.
El código del servidor no cambia solo. Hay que **publicarlo**:
```bash
npx firebase-tools deploy --only functions --project copiloto-driver-ia
```
Por eso, cuando agregamos algo en el servidor, te pasaba ese comando.

## 6. El camino completo de un ingreso

> 🌎 **En la vida real:** es como depositar dinero en el banco:
> 1. **La pantalla** = llenas la boleta de depósito: R$ 50, Mi empresa.
> 2. **El contexto** = el cajero mira la boleta y decide cómo se cuenta (alcancía o cuentakilómetros, del Tema 01).
> 3. **El servicio** = el cajero lleva el dinero al archivo y lo pone en **tu** carpeta.
> 4. **Las reglas** = el guardia del archivo revisa que la carpeta sea la tuya.
> 5. **Firestore** = lo guarda y toca una campanita.
> 6. **El Inicio** = la pantalla del banco que muestra tu saldo se actualiza sola, porque estaba atenta a la campanita.
> 7. **El Copiloto** = tu asesor escucha la campanita (`earning.added`) y anota en su libreta: "hoy ganó 50 más".

Cuando registras R$ 50 en "Mi empresa":

1. **La pantalla** (`FinanceUnifiedRegisterForm`) arma el ingreso.
2. **El contexto** (`EarningsContext`) decide si es acumulativo (el Tema 01) y calcula cuánto guardar.
3. **El servicio** (`earningsCloudStorage`) lo escribe en Firestore, en `users/{tu uid}/earnings/{id nuevo}`.
4. **Las reglas** revisan que el `uid` sea el tuyo, y lo permiten.
5. **Firestore** lo guarda y avisa a la app.
6. **La pantalla del Inicio** se actualiza sola, porque escucha los cambios.
7. **El Copiloto** recibe un evento (`earning.added`) y actualiza su memoria.

## 7. Seguridad: las reglas que nunca se rompen

> 🌎 **En la vida real:** - **Nunca una clave secreta en la app**: es como nunca dejar la llave de la casa debajo del felpudo. Es el primer lugar donde miran los ladrones.
> - **La cuenta de servicio fuera del proyecto**: es la llave maestra de todo el edificio. No se guarda en el mismo llavero que las demás, sino en una caja fuerte aparte.
> - **Escrituras en producción, solo con tu aprobación**: como un contador que no puede mover dinero de tu cuenta sin tu firma.

Están en `AGENTS.md`, sección 9:
- **Nunca** una clave secreta (`sk_...`) en la app ni en GitHub.
- La **cuenta de servicio** (la llave que da poder total sobre Firebase) vive **fuera** del proyecto, en `~/copiloto-driver-admin/`.
- Las escrituras en producción, **solo con tu aprobación**.

## Ejercicios

> 🌎 **En la vida real:** es como dar una vuelta por el edificio con el plano en la mano, mirando cada cerradura, pero **sin tocar nada**. Solo miras tu propio departamento.

1. Abre `firestore.rules` y busca la regla de `expenses`. Explica con tus palabras quién puede leer los gastos.
2. Busca la regla de `billing`. ¿Por qué la app no puede escribir la suscripción?
3. En la consola de Firebase (console.firebase.google.com → proyecto `copiloto-driver-ia` → Firestore), busca **tu** documento en `users`. Mira tus `settings/main` **sin cambiar nada**. ¿Encuentras tus vehículos?
4. Pregunta: ¿por qué la clave de Gemini está en el servidor y no en la app?
5. Pregunta: si mañana alguien quiere leer los ingresos de otra persona desde una app falsa, ¿qué lo detiene?

<details>
<summary>Respuestas</summary>

1. Solo la persona dueña de esa carpeta, con sesión iniciada.
2. Porque si la app pudiera escribirla, cualquiera podría darse el plan Premium gratis. Solo la escribe el servidor, después de confirmar el pago.
4. Porque todo lo que está en la app se puede extraer. Una clave en la app es una clave pública.
5. Las reglas de seguridad: el `uid` de quien pide no coincide con el de la carpeta, y Firestore lo rechaza.

</details>

## Para la entrevista

> 🌎 **En la vida real:** explícalo como el edificio: "recepción con credenciales, un archivo donde cada uno tiene su departamento, un portero que revisa cada puerta y empleados en la oficina de atrás para lo delicado. Y las cerraduras se prueban en una maqueta".
>
> ¿Por qué Firebase? Como alquilar en un shopping: no administras el edificio y crece solo, pero dependes del dueño del shopping y hay que mirar la cuenta de la luz (el costo por lecturas).

**¿Cómo está hecho el backend de tu app?**
> Uso Firebase: Authentication para el inicio de sesión, Firestore como base de datos, Cloud Functions para lo que necesita secretos o permisos de administrador (como la IA con Gemini), y Hosting para el panel y la landing. Los datos de cada persona están dentro de su propio documento de usuario, y las reglas de seguridad garantizan que cada uno solo lea lo suyo. Esas reglas tienen pruebas automáticas con el emulador.

**¿Por qué Firebase?**
> Porque me deja tener un servidor sin administrarlo, escala solo y tiene un plan gratis generoso para empezar. La contra es que dependes de Google y hay que cuidar el costo de las lecturas.
