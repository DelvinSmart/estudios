# Firebase por dentro

Esta es la **clase completa**, explicada paso a paso, para estudiarla a tu ritmo. El [resumen](LECCION.md) es para repasar después.

**Cómo estudiarla:** de 1 a 2 horas. Esta clase es de **leer y entender**: en ningún momento se cambia nada en Firebase. Lo que está en producción son los datos de personas reales.

**Lo que necesitas saber antes:** Temas 01 a 07 (y el 17 ayuda: `fetch`, JSON).

## 1. ¿Qué es Firebase?

> 🎙️ **El profesor:** {{alumno}}, hasta ahora mirabas la app **en el teléfono**. Pero cuando un conductor registra un ingreso, ese dato no se queda solo en su teléfono: viaja a internet, se guarda, y vuelve cuando abre la app en otro aparato. Hoy bajamos al **depósito** y a la **oficina de atrás**: Firebase.

**Firebase** es un conjunto de servicios de Google para que una app tenga **servidor sin que tú administres un servidor**. No compras una computadora ni la mantienes encendida: Google lo hace, y tú pagas por lo que usas.

A esto se le llama **backend** (la parte de atrás: datos, seguridad, lógica en la nube), en contraste con el **frontend** (lo que ves: las pantallas). Y a que no tengas que administrar servidores se le dice **serverless** ("sin servidor", aunque en realidad hay servidores: son de Google).

> 🌎 **En la vida real:** alquilar un local en un shopping en vez de construir tu propio edificio. El shopping pone la seguridad, la luz, la limpieza; tú pagas el alquiler según cuánto usas y te dedicas a vender. Si un día llega mucha gente, el shopping abre más puertas.

> 🌎 **Otro ejemplo:** Como usar la luz de la compañía eléctrica en vez de comprar un generador: no lo mantienes tú, pagas según lo que gastas, y si consumes más, la compañía lo da.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Frente o backend?
lenguaje: js
pide: El **frente** es lo que corre en el teléfono (pantallas, botones); el **backend** es lo que vive en la nube (datos, seguridad, código del servidor). Completa `donde(tarea)`: `'backend'` si la tarea habla de guardar datos, revisar permisos, una clave secreta o el servidor; `'frente'` en los demás casos. Usa la lista `PISTAS_BACKEND`.
--- código
const PISTAS_BACKEND = ['guardar', 'permiso', 'clave secreta', 'servidor'];

function donde(tarea) {
  // tu código aquí
}
--- pruebas
prueba('guardar un gasto en la nube', () => igual(donde('guardar un gasto en la nube'), 'backend'));
prueba('revisar el permiso de lectura', () => igual(donde('revisar el permiso de lectura'), 'backend'));
prueba('usar la clave secreta de la IA', () => igual(donde('usar la clave secreta de la IA'), 'backend'));
prueba('dibujar el botón de agregar', () => igual(donde('dibujar el botón de agregar'), 'frente'));
prueba('mostrar la barra de combustible', () => igual(donde('mostrar la barra de combustible'), 'frente'));
--- solución
const PISTAS_BACKEND = ['guardar', 'permiso', 'clave secreta', 'servidor'];

function donde(tarea) {
  return PISTAS_BACKEND.some((p) => tarea.includes(p)) ? 'backend' : 'frente';
}
```

```practica
escribe :: Con tus palabras: ¿qué es Firebase? :: Un conjunto de servicios de Google que le da a la app un servidor (datos, inicio de sesión, funciones) sin que yo tenga que administrar computadoras; pago por lo que uso.
elige :: ¿Qué es el backend? :: Las pantallas de la app :: La parte de atrás: datos, seguridad y lógica en la nube :: El teléfono
vf :: Con Firebase tienes que comprar y mantener tu propio servidor
```

> 🔁 **Repaso:** Firebase = backend sin administrar servidores (serverless). Como alquilar en un shopping.

## 2. Las piezas que usa la app Copiloto

> 🎙️ **El profesor:** Firebase no es una cosa: son varias piezas. La app Copiloto usa cinco. Imagínalas como **los servicios de un edificio de oficinas**.

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

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cada cosa, a su pieza de Firebase
lenguaje: js
pide: Completa el objeto `PIEZA` con la pieza de Firebase que se encarga de cada cosa: saber quién es la persona (`'Authentication'`), guardar ingresos y gastos (`'Firestore'`), guardar fotos (`'Storage'`), código del servidor (`'Cloud Functions'`) y publicar el panel web (`'Hosting'`).
--- código
const PIEZA = {
  quienEs: '',
  ingresosYGastos: '',
  fotos: '',
  codigoDelServidor: '',
  panelWeb: '',
};
--- pruebas
const bien = { quienEs: 'Authentication', ingresosYGastos: 'Firestore', fotos: 'Storage', codigoDelServidor: 'Cloud Functions', panelWeb: 'Hosting' };
for (const [k, v] of Object.entries(bien)) prueba(k, () => igual(PIEZA[k], v));
--- solución
const PIEZA = {
  quienEs: 'Authentication',
  ingresosYGastos: 'Firestore',
  fotos: 'Storage',
  codigoDelServidor: 'Cloud Functions',
  panelWeb: 'Hosting',
};
```

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

### Cómo está organizada la app Copiloto

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

> 🧩 **Piezas nuevas para este ejercicio:**
> - **`ruta.split('/')`** convierte `'usuarios/ana/gastos/g1'` en una lista de cuatro pedazos.
> - **`i += 2`** hace que el `for` avance **de dos en dos**. Así, `partes[i]` es la colección y `partes[i + 1]` es su documento.
> - **`pares.push({ coleccion: 'gastos', documento: 'g1' })`** agrega un objeto a la lista.
> - **`const [primero] = lista`** guarda el primer elemento de la lista en la cajita `primero`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer una ruta de Firestore
lenguaje: js
pide: En Firestore, una ruta alterna **colección / documento / colección / documento**. Completa `leerRuta(ruta)`: devuelve la lista de pares `{ coleccion, documento }`. Y `dueno(ruta)`: si empieza con `usuarios/`, devuelve el `uid` (el documento que sigue); si no, `null`.
--- código
function leerRuta(ruta) {
  // tu código aquí
}

function dueno(ruta) {
  // tu código aquí
}
--- pruebas
prueba('dos niveles', () => igual(leerRuta('usuarios/ana123/gastos/g1'), [{ coleccion: 'usuarios', documento: 'ana123' }, { coleccion: 'gastos', documento: 'g1' }]));
prueba('un nivel', () => igual(leerRuta('grupos/san7'), [{ coleccion: 'grupos', documento: 'san7' }]));
prueba('el dueño de un gasto', () => igual(dueno('usuarios/ana123/gastos/g1'), 'ana123'));
prueba('un grupo compartido no tiene dueño único', () => igual(dueno('grupos/san7'), null));
--- solución
function leerRuta(ruta) {
  const partes = ruta.split('/');
  const pares = [];
  for (let i = 0; i < partes.length; i += 2) pares.push({ coleccion: partes[i], documento: partes[i + 1] });
  return pares;
}

function dueno(ruta) {
  const [primero] = leerRuta(ruta);
  return primero.coleccion === 'usuarios' ? primero.documento : null;
}
```

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

La app está en el teléfono de miles de personas que **no controlas**. Y aquí va algo que sorprende: **cualquiera puede intentar** leer o escribir en tu base de datos **directamente**, sin usar la app Copiloto (con una app falsa, o con un programa). La app no es una muralla.

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

Un error en las reglas puede exponer los datos de **todas** las personas. Por eso la app Copiloto tiene pruebas de reglas (`rules-test/`), que corren con el **emulador** de Firebase: una copia falsa de la base de datos en tu computadora. Por ejemplo, intentan leer los ingresos de otra persona y comprueban que la regla **lo impida**. Y corren en el CI (Tema 04, trabajo `reglas`).

> ✋ **Para y piensa:** ¿por qué no alcanza con que la app "no muestre" los datos de otros?

<details>
<summary>Ver la respuesta</summary>

Porque alguien puede saltarse la app y pedirle los datos **directamente** a Firestore. Lo único que lo frena es la regla, que se revisa **en el servidor**.

</details>

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`typeof`**: dice de qué tipo es un valor, como texto: `typeof 12` → `'number'`, `typeof 'hola'` → `'string'`, `typeof true` → `'boolean'`, `typeof {}` → `'object'`.
> - **`pedido.ruta.split('/')`** separa la ruta. En `usuarios/ana/gastos/g1`, la posición 1 es el dueño.
> - **`pedido.datos ?? {}`** usa un objeto vacío si no vinieron datos.
> - **`Object.keys(d)`** da la lista con los **nombres de los campos** de un objeto: `{ tipo: 'agua', valor: 5 }` da `['tipo', 'valor']`.
> - **`.every(...)`** responde `true` solo si **todos** los elementos cumplen la condición.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un portero de juguete, como firestore.rules
lenguaje: js
pide: Escribe las reglas de Gastos del carro en JavaScript. `puede(pedido)` recibe `{ auth, ruta, accion, datos }`: `auth` es `null` (sin sesión) o `{ uid }`. Solo se permite en `usuarios/{uid}/gastos/{id}` y solo si quien pide **es el dueño**. Para `crear`, además, `datos.valor` tiene que ser un número mayor que 0 y `datos` no puede tener campos fuera de `tipo`, `valor` y `fecha`. Todo lo demás: `false`.
--- código
function puede(pedido) {
  // tu código aquí
}
--- pruebas
const ana = { uid: 'ana' };
const gasto = { tipo: 'peaje', valor: 12, fecha: '2026-11-18' };
prueba('Ana lee su gasto', () => igual(puede({ auth: ana, ruta: 'usuarios/ana/gastos/g1', accion: 'leer' }), true));
prueba('trampa: Beto lee el gasto de Ana', () => igual(puede({ auth: { uid: 'beto' }, ruta: 'usuarios/ana/gastos/g1', accion: 'leer' }), false));
prueba('trampa: sin sesión', () => igual(puede({ auth: null, ruta: 'usuarios/ana/gastos/g1', accion: 'leer' }), false));
prueba('Ana crea un gasto válido', () => igual(puede({ auth: ana, ruta: 'usuarios/ana/gastos/g2', accion: 'crear', datos: gasto }), true));
prueba('trampa: un valor negativo', () => igual(puede({ auth: ana, ruta: 'usuarios/ana/gastos/g2', accion: 'crear', datos: { ...gasto, valor: -5 } }), false));
prueba('trampa: un campo de más', () => igual(puede({ auth: ana, ruta: 'usuarios/ana/gastos/g2', accion: 'crear', datos: { ...gasto, admin: true } }), false));
prueba('trampa: fuera de usuarios/', () => igual(puede({ auth: ana, ruta: 'config/general', accion: 'leer' }), false));
--- solución
function puede(pedido) {
  const partes = pedido.ruta.split('/');
  if (partes.length !== 4 || partes[0] !== 'usuarios' || partes[2] !== 'gastos') return false;
  const esDueno = pedido.auth !== null && pedido.auth.uid === partes[1];
  if (!esDueno) return false;
  if (pedido.accion === 'crear') {
    const d = pedido.datos ?? {};
    const soloEstos = Object.keys(d).every((k) => ['tipo', 'valor', 'fecha'].includes(k));
    return soloEstos && typeof d.valor === 'number' && d.valor > 0;
  }
  return true;
}
```

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

> 🧩 **Piezas nuevas para este ejercicio:**
> - **`contexto.auth`** es `null` si no hay sesión. Si hay sesión, es un objeto con el `uid` de quien llama: `contexto.auth.uid`.
> - **`throw new Error('mensaje')`** detiene la función y avisa del error. Lo que sigue ya no se ejecuta.
> - **`delete base[uid][id]`** borra ese gasto. Por eso la revisión tiene que ir **antes** de esa línea.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: assertOwner: el servidor también revisa
lenguaje: js
pide: En Cloud Functions, el código corre con **poder de administrador** y no pasa por las reglas: por eso cada función revisa a mano quién la llama. Completa `assertOwner(contexto, uid)`: si no hay sesión, lanza un `Error('Inicia sesión.')`; si el uid de quien llama no es el pedido, lanza `Error('No es tuyo.')`; si todo bien, no hace nada. Después úsala en `borrarGasto`.
--- código
function assertOwner(contexto, uid) {
  // tu código aquí
}

function borrarGasto(contexto, uid, id, base) {
  // revisa primero, y después borra
  delete base[uid][id];
  return 'borrado';
}
--- pruebas
const nuevaBase = () => ({ ana: { g1: { valor: 10 } } });
prueba('Ana borra su gasto', () => { const b = nuevaBase(); igual(borrarGasto({ auth: { uid: 'ana' } }, 'ana', 'g1', b), 'borrado'); igual(b.ana.g1, undefined); });
prueba('sin sesión: error', () => { let msg = ''; try { borrarGasto({ auth: null }, 'ana', 'g1', nuevaBase()); } catch (e) { msg = e.message; } igual(msg, 'Inicia sesión.'); });
prueba('Beto no borra lo de Ana, y el gasto sigue ahí', () => { const b = nuevaBase(); let msg = ''; try { borrarGasto({ auth: { uid: 'beto' } }, 'ana', 'g1', b); } catch (e) { msg = e.message; } igual(msg, 'No es tuyo.'); igual(b.ana.g1, { valor: 10 }); });
--- solución
function assertOwner(contexto, uid) {
  if (!contexto.auth) throw new Error('Inicia sesión.');
  if (contexto.auth.uid !== uid) throw new Error('No es tuyo.');
}

function borrarGasto(contexto, uid, id, base) {
  assertOwner(contexto, uid);
  delete base[uid][id];
  return 'borrado';
}
```

```practica
elige :: ¿Por qué la clave de Gemini está en el servidor y no en la app? :: Porque la app es lenta :: Porque todo lo que está en la app se puede extraer :: Porque Google lo exige
elige :: ¿Qué hace `assertOwner(...)`? :: Agrega un color :: Revisa que quien llama sea el dueño, y si no, corta :: Publica la función
elige :: ¿Qué hace `deploy`? :: Borra las funciones :: Publica el código del servidor en Firebase :: Corre las pruebas
vf :: El servidor (Cloud Functions) no pasa por las reglas de Firestore
escribe :: Nombra los tres motivos para poner código en el servidor. :: Secretos (como la clave de la IA), poderes de administrador, y cosas automáticas que corren aunque nadie abra la app.
```

> 🔁 **Repaso:** Cloud Functions para secretos, poderes de admin y tareas automáticas. `onCall` + `assertOwner` para proteger. Y se publica con `deploy`.

## 6. El camino completo de un ingreso

> 🎙️ **El profesor:** juntemos todo. Esto es lo que pasa, por dentro, cuando registras R$ 50 en "Mi empresa". Si puedes contar este recorrido en una entrevista, demuestras que entiendes la app Copiloto de punta a punta.

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

> 🧩 **Piezas nuevas para este ejercicio:**
> - **`fn`** es una función que te entregan guardada en una cajita. Para avisarle, la llamas con la lista: `fn(lista)`.
> - **`oyentes.push(fn)`** guarda a quien quiere escuchar.
> - **`[...datos]`** crea una **copia** de la lista.
> - **`return () => { ... }`** devuelve una función para usarla después. Aquí será el botón de «dejar de escuchar».
> - **`oyentes.filter((o) => o !== fn)`** crea una lista sin ese oyente.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La pantalla que escucha
lenguaje: js
pide: La pantalla del Inicio se actualiza sola porque **escucha** los cambios de Firestore. Completa `crearColeccion()`: `escuchar(fn)` guarda a quien escucha y le avisa **enseguida** con la lista actual; `agregar(dato)` guarda el dato y avisa a **todos** los que escuchan con la lista nueva. `escuchar` devuelve una función para **dejar de escuchar**.
--- código
function crearColeccion() {
  const datos = [];
  let oyentes = [];
  return {
    escuchar(fn) {
      // tu código aquí
    },
    agregar(dato) {
      // tu código aquí
    },
  };
}
--- pruebas
prueba('avisa enseguida con lo que hay', () => { const c = crearColeccion(); let visto = null; c.escuchar((l) => (visto = l)); igual(visto, []); });
prueba('al agregar, la pantalla recibe la lista nueva', () => { const c = crearColeccion(); let visto = null; c.escuchar((l) => (visto = l)); c.agregar(50); c.agregar(30); igual(visto, [50, 30]); });
prueba('avisa a todos', () => { const c = crearColeccion(); let a = 0, b = 0; c.escuchar(() => a++); c.escuchar(() => b++); c.agregar(1); igual([a, b], [2, 2]); });
prueba('dejar de escuchar', () => { const c = crearColeccion(); let n = 0; const dejar = c.escuchar(() => n++); dejar(); c.agregar(1); igual(n, 1); });
--- solución
function crearColeccion() {
  const datos = [];
  let oyentes = [];
  return {
    escuchar(fn) {
      oyentes.push(fn);
      fn([...datos]);
      return () => { oyentes = oyentes.filter((o) => o !== fn); };
    },
    agregar(dato) {
      datos.push(dato);
      for (const o of oyentes) o([...datos]);
    },
  };
}
```

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

> 🧩 **Piezas para este ejercicio:**
> - **`/sk_\w+/.test(texto)`** pregunta si el texto contiene `sk_` seguido de letras o números.
> - **`texto.includes('"private_key"')`** pregunta si ese pedazo aparece dentro del texto.
> - **`texto.trim() === '.env'`** compara el texto, sin espacios en las puntas, con `.env`.
> - **`||`** significa **«o»**: basta con que se cumpla una.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Es un secreto o es público?
lenguaje: js
pide: La configuración de Firebase en la app (`apiKey` que empieza con `AIza`, `projectId`, `authDomain`) es **pública por diseño**. Un **secreto** es otra cosa: claves que empiezan con `sk_`, una cuenta de servicio (un texto con `"private_key"`), o un `.env`. Completa `esSecreto(texto)`.
--- código
function esSecreto(texto) {
  // tu código aquí
}
--- pruebas
prueba('la apiKey de Firebase en la app: pública', () => igual(esSecreto("apiKey: 'AIzaSyB-ejemplo'"), false));
prueba('el projectId: público', () => igual(esSecreto("projectId: 'gastos-del-carro'"), false));
prueba('una clave sk_: secreto', () => igual(esSecreto('STRIPE=sk_live_abc123'), true));
prueba('una cuenta de servicio: secreto', () => igual(esSecreto('{ "type": "service_account", "private_key": "-----BEGIN" }'), true));
prueba('un .env: secreto', () => igual(esSecreto('.env'), true));
--- solución
function esSecreto(texto) {
  return /sk_\w+/.test(texto) || texto.includes('"private_key"') || texto.trim() === '.env';
}
```

```practica
vf :: La cuenta de servicio de Firebase se guarda dentro del proyecto, para tenerla a mano
vf :: La configuración pública de Firebase en la app no es un secreto; lo que protege son las reglas
escribe :: Di las tres reglas de seguridad de esta parte. :: Nunca claves secretas en la app ni en GitHub; la cuenta de servicio fuera del proyecto; y escrituras en producción solo con aprobación del dueño.
```

> 🔁 **Repaso:** sin secretos en la app, la cuenta de servicio aparte, y nada se escribe en producción sin tu aprobación.

## Ejercicios

> 🎙️ **El profesor:** los tres primeros los haces en **Gastos del carro**, que tiene sus propias reglas de Firestore y sus pruebas "como atacante". Nada de esto toca datos de verdad: las pruebas corren en un **emulador**, una copia de Firestore que vive en tu computadora y se borra al terminar.

> 🌎 **En la vida real:** Es como hacer una visita guiada al edificio con el plano en la mano, mirando cada cerradura, sin tocar nada.

1. En Gastos del carro, abre `firebase/firestore.rules` y busca `match /usuarios/{uid}/gastos/{gastoId}`. Explica con tus palabras quién puede leer los gastos.
2. Mira la función `gastoValido`. Di tres gastos que las reglas **rechazan** aunque los mande la persona dueña.
3. Corre `npm run test:reglas` (necesita [Java](https://adoptium.net), gratis). Lee los nombres de las pruebas: cada "trampa" es un ataque que **tiene que fallar**. Después, en las reglas, cambia `esDueno(uid)` por `conSesion()` en la línea de `allow read, delete`, corre otra vez y mira qué pruebas se ponen en rojo. Al final, `git restore firebase/firestore.rules`.
4. ¿Por qué la clave de Gemini está en el servidor y no en la app?
5. Si mañana alguien quiere leer los ingresos de otra persona desde una app falsa, ¿qué lo detiene?
6. En Copiloto, la suscripción (`billing`) tiene esta regla. ¿Por qué la app no puede escribirla?

```text
match /users/{userId}/billing/{docId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if false;
}
```

<details>
<summary>Ver las correcciones explicadas</summary>

1. `allow read, delete: if esDueno(uid)`: solo **la persona dueña** de esa carpeta (`usuarios/{uid}`), con sesión iniciada. Es la misma idea que en Copiloto con `users/{userId}/expenses`.
2. Por ejemplo: un valor negativo o de más de 100 000, un tipo inventado (`'casino'`), una fecha que no es `AAAA-MM-DD`, o un campo de más como `admin: true`. Por eso `gastoValido` usa `hasOnly`: **solo** esos tres campos.
3. Las 9 pruebas pasan: las trampas fallan como deben. Con `conSesion()`, **cualquiera con sesión** lee y borra los gastos de otro: se ponen en rojo dos pruebas, "trampa: Beto lee el gasto de Ana" y "Ana borra su gasto; Beto no puede" (`2 failed | 7 passed`). Esa es la diferencia entre "tiene sesión" y "es el dueño".
4. Porque todo lo que está en la app se puede extraer: una clave en la app es una clave pública.
5. **Las reglas de seguridad**: el `uid` de quien pide no coincide con el de la carpeta, y Firestore lo rechaza en el servidor.
6. La persona **puede leer** su suscripción, pero **nadie** la escribe desde la app (`allow write: if false`). Si la app pudiera, cualquiera se daría el plan pago gratis. Solo la escribe el servidor, después de confirmar el pago.

</details>

```practica
elige :: ¿Por qué la app no puede escribir `billing`? :: Porque es muy grande :: Porque cualquiera se daría el plan pago gratis; solo lo escribe el servidor tras confirmar el pago :: Porque Google lo prohíbe
```

## Para la entrevista

> 🎙️ **El profesor:** en voz alta. Esta es de las respuestas que más te van a lucir.

> 🌎 **En la vida real:** Explicar tu backend es como explicar un edificio: recepción, archivo, portero y oficina de atrás, cada uno con su trabajo.

> 🎤 **Entrevista:** "¿Cómo está hecho el backend de Copiloto?"

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
escribe :: Explica en voz alta (y escribe) cómo protege la app Copiloto los datos de cada persona. :: Cada persona tiene sus datos dentro de users/{uid}; las reglas de Firestore solo dejan leer y escribir si hay sesión y el uid coincide con el de la carpeta; lo delicado se hace en Cloud Functions; y las reglas tienen pruebas con el emulador.
```

> 🔁 **Repaso final de la clase:** Firebase y sus cinco piezas, cómo se guardan los datos en Firestore, las reglas de seguridad (lo más importante), Cloud Functions, el camino de un ingreso y las reglas de oro de seguridad. Próxima: **Tema 09, CRUD en Node.js**.
