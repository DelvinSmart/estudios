# Tema 08: Firebase por dentro

Tu app guarda los datos de las personas en **Firebase**. En este tema vas a entender dónde vive cada dato, quién puede leerlo y qué pasa cuando el Copiloto o el panel hacen algo.

**Antes de empezar:** Temas 01 a 07.

**Tiempo:** de 1 a 2 horas.

## 1. ¿Qué es Firebase?

**Firebase** es un conjunto de servicios de Google para que una app tenga **servidor sin que tú administres un servidor**. Tú no compras una computadora ni la mantienes encendida: Google lo hace, y tú pagas por lo que usas.

**Comparación:** en vez de construir un edificio para guardar tus cosas, alquilas casilleros, una oficina y un portero.

## 2. Las piezas que usa tu app

| Pieza | Qué es | Para qué la usa Copiloto |
|---|---|---|
| **Authentication** | El **portero**: sabe quién es cada persona | Inicio de sesión: cada persona recibe un id único (el `uid`) |
| **Firestore** | La **base de datos** | Ingresos, gastos, vehículos, San, ajustes... |
| **Storage** | Un **depósito de archivos** | Las fotos del perfil |
| **Cloud Functions** | **Código que corre en el servidor** | El Copiloto (IA), el panel, las suscripciones, el OTP |
| **Hosting** | **Páginas web** | La landing y el panel (`copiloto-driver-admin.web.app`) |

Todo está en un **proyecto** de Firebase llamado `copiloto-driver-ia`.

## 3. Firestore: cómo se guardan los datos

Firestore no usa tablas como Excel. Usa **colecciones** y **documentos**:

| Palabra | Qué es | Comparación |
|---|---|---|
| **Colección** | Un grupo de documentos del mismo tipo | Una carpeta |
| **Documento** | Un registro, con campos | Una hoja dentro de la carpeta |
| **Campo** | Un dato del documento | Una línea de la hoja: `amountBrl: 50` |
| **Subcolección** | Una colección dentro de un documento | Una carpeta dentro de una hoja |

### Cómo está organizada tu app

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

La app está en el teléfono de cada persona, y **cualquiera puede intentar** leer o escribir en la base de datos directamente, sin usar la app. Por eso existen las **reglas de seguridad**: un archivo que dice quién puede hacer qué.

Están en tu app, en **`firestore.rules`**.

### Regla real 1: cada uno ve solo sus ingresos
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
```
match /vehicleColors/{id} {
  allow read: if request.auth != null;
  allow write: if false;
}
```
- Cualquiera **con sesión** puede leerlos (la app los necesita para la lista de colores).
- `allow write: if false` → **nadie** puede escribirlos desde la app. Solo el servidor (Cloud Functions) puede, porque el servidor no pasa por estas reglas.

### Por qué las reglas tienen pruebas
Un error en las reglas puede exponer los datos de todos. Por eso tu app tiene **23 pruebas de reglas** (`rules-test/`), que corren con el **emulador** de Firebase: una copia falsa de la base de datos en tu computadora. Ejemplo: intentan leer los ingresos de otra persona y comprueban que la regla lo **impida**.

## 5. Cloud Functions: el código del servidor

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
```ts
export const adminUpsertVehicleColor = onCall(async (request) => {
  assertOwner(request.auth?.token.email);
  ...
});
```
- `onCall` crea una función que la app o el panel pueden **llamar**.
- `assertOwner(...)` revisa que el correo de quien llama sea el tuyo. Si no, corta ahí con un error.

### Publicar (deploy)
El código del servidor no cambia solo. Hay que **publicarlo**:
```bash
npx firebase-tools deploy --only functions --project copiloto-driver-ia
```
Por eso, cuando agregamos algo en el servidor, te pasaba ese comando.

## 6. El camino completo de un ingreso

Cuando registras R$ 50 en "Mi empresa":

1. **La pantalla** (`FinanceUnifiedRegisterForm`) arma el ingreso.
2. **El contexto** (`EarningsContext`) decide si es acumulativo (el Tema 01) y calcula cuánto guardar.
3. **El servicio** (`earningsCloudStorage`) lo escribe en Firestore, en `users/{tu uid}/earnings/{id nuevo}`.
4. **Las reglas** revisan que el `uid` sea el tuyo, y lo permiten.
5. **Firestore** lo guarda y avisa a la app.
6. **La pantalla del Inicio** se actualiza sola, porque escucha los cambios.
7. **El Copiloto** recibe un evento (`earning.added`) y actualiza su memoria.

## 7. Seguridad: las reglas que nunca se rompen

Están en `AGENTS.md`, sección 9:
- **Nunca** una clave secreta (`sk_...`) en la app ni en GitHub.
- La **cuenta de servicio** (la llave que da poder total sobre Firebase) vive **fuera** del proyecto, en `~/copiloto-driver-admin/`.
- Las escrituras en producción, **solo con tu aprobación**.

## Ejercicios

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

**¿Cómo está hecho el backend de tu app?**
> Uso Firebase: Authentication para el inicio de sesión, Firestore como base de datos, Cloud Functions para lo que necesita secretos o permisos de administrador (como la IA con Gemini), y Hosting para el panel y la landing. Los datos de cada persona están dentro de su propio documento de usuario, y las reglas de seguridad garantizan que cada uno solo lea lo suyo. Esas reglas tienen pruebas automáticas con el emulador.

**¿Por qué Firebase?**
> Porque me deja tener un servidor sin administrarlo, escala solo y tiene un plan gratis generoso para empezar. La contra es que dependes de Google y hay que cuidar el costo de las lecturas.
