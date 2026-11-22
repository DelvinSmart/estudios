# Contenido privado: guardarlo en el servidor y dárselo a una sola cuenta

> 🌎 **En la vida real:** si escondes un regalo **dentro de la caja de cereal** que le das a todo el mundo, cualquiera que abra la caja lo encuentra. Si lo quieres para una sola persona, lo dejas en una **caja fuerte del banco** y le dices al cajero: "solo se lo entregas a quien traiga esta cédula". Esta clase es sobre esa caja fuerte.

> 🎙️ **El profesor dice:** {{alumno}}, esta clase salió de algo que hicimos de verdad. En **ABC — Aprende a leer**, la app para enseñar a leer a un niño, había unos dibujos para pintar de **personajes con marca registrada** (de esos que tienen dueño, como los de las películas). Para la familia del autor está bien usarlos en casa, pero **no se pueden publicar** dentro de una app que baja cualquiera. Así que los sacamos de la app, los guardamos en el servidor y hicimos que el servidor se los entregue **solo a una cuenta**. Aquí ves cómo, paso a paso.

**Palabras nuevas de esta clase:**

| Palabra | Qué quiere decir |
|---|---|
| **Bundle** (paquete) | Todos los archivos de tu app juntos (el JavaScript, el HTML, las imágenes) tal como le llegan al usuario. En Android, el bundle va dentro del **APK**. |
| **APK** | El archivo que instala una app en Android. Por dentro es un **.zip**: se puede abrir y leer. |
| **Cliente** | El lado que corre en el aparato del usuario: la página o la app. Lo controla **el usuario**, no tú. |
| **Servidor** (backend) | El lado que corre en una computadora tuya o de Firebase. Lo controlas **tú**. |
| **Reglas de Firestore** | Las condiciones que Firebase revisa **en el servidor** antes de dejar leer o escribir un documento (clase 21). |
| **Token** | Un "pase" con fecha de vencimiento que prueba quién eres. Lo mandas en cada pedido en vez de la contraseña. |
| **403** | La respuesta del servidor que quiere decir "**te reconozco, pero no tienes permiso**". |
| **localStorage** | Un cajoncito del navegador (o de la app) donde guardas texto que sigue ahí aunque cierres la app y no haya internet. |

## Parte 1. El problema: todo lo que va dentro de la app se puede abrir

> 🌎 **En la vida real:** cuando compras un mueble para armar, en la caja viene **todo**: las piezas, los tornillos y el manual. Si el fabricante mete una pieza "secreta" en la caja, tú la ves al abrirla. No importa que el manual diga "no mires esta bolsita".

Lo que pones **dentro** de tu app viaja al teléfono de cada persona que la instala. En la clase 110 viste que el APK se abre con `unzip` o con jadx. En una app hecha con Capacitor, como ABC, es todavía más fácil: el JavaScript está ahí, en texto, dentro de `assets/public/`.

Ahora imagina que quieres que unos dibujos los vea **solo** la cuenta del papá. La primera idea que se le ocurre a casi todo el mundo es esta:

```js
// ❌ Esto NO protege nada
const DIBUJOS_PRIVADOS = [ { id: 'personaje-1', nombre: '…', trazos: '…' } ];

if (usuario.email === 'papa@ejemplo.com') {
  mostrar(DIBUJOS_PRIVADOS);
}
```

**¿Por qué no sirve?**

| Lo que crees | Lo que pasa de verdad |
|---|---|
| "Solo el papá ve los dibujos" | Los dibujos **están escritos en el código**. Quien abra el APK los lee, sin entrar con ninguna cuenta. |
| "El `if` lo frena" | El `if` corre **en el teléfono del usuario**. Puede cambiarlo, saltarlo o ni siquiera ejecutar la app. |
| "Nadie sabe el correo" | El correo **también quedó en el código**, a la vista. Ahora además regalaste un dato personal. |

> 💡 **Idea:** el cliente es **del usuario**. Todo lo que mandas al cliente, el usuario lo tiene. Un `if` en el cliente sirve para **ordenar la pantalla** (qué botón mostrar), nunca para **proteger** algo.

> ⚠️ **Cuidado:** esconder el contenido "un poquito" (en base64, con otro nombre de variable, minificado) tampoco protege. Eso es **ocultar**, no **proteger**: se descubre con paciencia, y a veces con un solo `grep`.

```practica
vf :: Si un dibujo va dentro del JavaScript de la app pero solo se muestra cuando el correo coincide, nadie más puede verlo
elige :: ¿Dónde corre un if que escribiste en el JavaScript de tu app? :: En el servidor de Firebase :: En el teléfono o el navegador del usuario :: En GitHub
vf :: Convertir el contenido a base64 antes de meterlo en la app lo deja protegido
escribe :: Explica con un ejemplo de la vida diaria por qué un if en el cliente no protege un contenido. :: Es como meter un regalo en la caja de cereal que le vendes a todo el mundo con una nota de "no abrir": quien abre la caja lo encuentra. El código del cliente lo tiene el usuario completo, así que lo que va adentro lo puede leer aunque el if diga que no.
```

## Parte 2. La caja fuerte: el contenido en Firestore y una regla del servidor

> 🌎 **En la vida real:** el banco no te da la caja fuerte para que te la lleves a casa y "prometas" no abrirla. La caja **se queda en el banco**, y el **cajero** (que trabaja para el banco, no para ti) revisa tu cédula antes de abrirla.

La solución tiene dos pasos:

1. **Sacar el contenido de la app.** Los dibujos ya no están en ningún archivo del código. Se guardan en Firestore, en un documento: `privado/dibujos-personajes`.
2. **Poner una regla en el servidor** que decida quién puede leer ese documento. Las reglas las revisa Firebase, **en su computadora**, antes de entregar nada. El usuario no las puede cambiar.

La regla, en `firestore.rules`, queda así (con un correo de ejemplo):

```text
match /privado/{documento} {
  allow read: if request.auth != null
              && request.auth.token.email_verified == true
              && request.auth.token.email == 'papa@ejemplo.com';
  allow write: if false;
}
```

**Cómo leerla, línea por línea:**

| Pieza | Qué quiere decir |
|---|---|
| `match /privado/{documento}` | Esta regla vale para **cualquier** documento de la colección `privado`. `{documento}` es un comodín: atrapa el nombre que sea. |
| `request.auth != null` | Que la persona **haya entrado** con una cuenta. Sin cuenta, no. |
| `email_verified == true` | Que el correo esté **comprobado**. Si no, cualquiera podría crear una cuenta escribiendo tu correo sin ser dueño de él. |
| `email == 'papa@ejemplo.com'` | Que sea **exactamente** esa cuenta. |
| `allow write: if false` | **Nadie** puede escribir desde la app. Ni siquiera el papá. Así, si alguien encuentra un error en la app, no puede cambiar ni borrar el contenido. |

> 💡 **Idea:** ¿y el correo? Ahora vive **en las reglas**, que están en el servidor. Las reglas no van dentro de la app ni se publican en la tienda. El cliente **ya no sabe** cuál es la cuenta permitida: solo pregunta "¿me das esto?" y el servidor dice sí o no.

> 📌 **Nota:** en la app de verdad, las tres primeras condiciones están en una función de las reglas, `cuentaVerificada()`, que se reutiliza en otras partes. Es lo mismo, con menos repetición.

> ⚠️ **Cuidado:** si tu proyecto es **público** en GitHub (como este curso), el archivo `firestore.rules` también se ve allí. En ese caso, no dejes el correo en el repositorio: guárdalo en otro archivo que no se suba (en `.gitignore`) o usa el **uid** de la cuenta en vez del correo. El uid es un código largo que no dice nada de la persona.

> 🧩 **Piezas para este ejercicio**
> - Primero comprueba que la sesión exista. Después verifica el correo y compara la dirección completa. Las tres comprobaciones deben aprobarse.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: El cajero del banco
lenguaje: js
pide: Completa `puedeLeer(auth)`, que hace lo mismo que la regla. `auth` es `null` si la persona no entró; si entró, es `{ email, emailVerificado }`. Devuelve `true` solo si entró, su correo está verificado y su correo es exactamente `'papa@ejemplo.com'`. En cualquier otro caso, `false`.
--- código
const PERMITIDO = 'papa@ejemplo.com';

function puedeLeer(auth) {
  // tu código aquí
}
--- pruebas
prueba('sin cuenta', () => igual(puedeLeer(null), false));
prueba('la cuenta del papá, verificada', () => igual(puedeLeer({ email: 'papa@ejemplo.com', emailVerificado: true }), true));
prueba('el correo del papá, pero sin verificar', () => igual(puedeLeer({ email: 'papa@ejemplo.com', emailVerificado: false }), false));
prueba('otra cuenta verificada', () => igual(puedeLeer({ email: 'vecino@ejemplo.com', emailVerificado: true }), false));
prueba('un correo que empieza igual no basta', () => igual(puedeLeer({ email: 'papa@ejemplo.com.ve', emailVerificado: true }), false));
--- solución
const PERMITIDO = 'papa@ejemplo.com';

function puedeLeer(auth) {
  if (!auth) return false;
  if (!auth.emailVerificado) return false;
  return auth.email === PERMITIDO;
}
```

```practica
elige :: ¿Por qué la regla pide también email_verified? :: Para que cargue más rápido :: Para que nadie cree una cuenta escribiendo ese correo sin ser su dueño :: Porque Firebase lo exige en todas las reglas
vf :: Con allow write: if false, el papá puede cambiar los dibujos desde la app
vf :: Después de este cambio, el cliente ya no necesita saber cuál es el correo permitido
escribe :: ¿Por qué la regla protege y el if del cliente no? :: Porque la regla la revisa Firebase en su servidor antes de entregar el dato, y el usuario no la puede cambiar. El if corre en el teléfono del usuario, que lo controla él, y además el dato ya estaba adentro de la app.
```

## Parte 3. Subir el contenido como administrador

> 🌎 **En la vida real:** el cliente del banco no puede meter cosas en la bóveda por la ventanilla. Pero el **gerente** tiene su propia llave y entra por la puerta de atrás. Esa llave no se la da a ningún cliente.

Si la regla dice `allow write: if false`, ¿cómo llegan los dibujos a Firestore? Por la **puerta de atrás**: como **administrador** del proyecto, sin pasar por la app.

Un **token de acceso** es una credencial temporal que un programa presenta para identificarse. Tiene vencimiento. El token que gestiona una herramienta de línea de comandos sigue siendo sensible durante su vigencia.

Firestore distingue dos caminos. La app usa una cuenta de Firebase Authentication y sus lecturas pasan por las reglas de seguridad. Las operaciones administrativas de una cuenta de Google se autorizan mediante **IAM**, el sistema de permisos del proyecto. La cuenta administrativa necesita un permiso que le permita escribir en la base de datos. Una petición REST de actualización puede usar el método **PATCH** y una credencial de Google, con la misma comprobación de permisos administrativos.

Para este ejercicio abre la [consola de Firebase](https://console.firebase.google.com/) con tu cuenta autorizada y elige tu **proyecto de prueba**:

1. Abre **Firestore Database → Datos**.
2. Crea la colección `privado` y el documento `dibujos-personajes`. Si ya existen, abre el documento.
3. Añade el campo `json`, de tipo **string** (texto). Guarda un ejemplo ficticio como `[{"nombre":"dibujo de prueba"}]`.
4. Confirma que puedes ver el documento en la consola con la cuenta administrativa. Verifica luego los permisos desde la app con las cuentas de prueba.

La consola gestiona la sesión. Guarda los dibujos originales fuera de la carpeta que se publica o se empaqueta. Consulta la [guía para añadir datos](https://firebase.google.com/docs/firestore/manage-data/add-data) y los [permisos IAM de Firestore](https://firebase.google.com/docs/firestore/security/iam).


```practica
vf :: El token de acceso es tan delicado como una contraseña y no se pega en el código ni en un chat
elige :: ¿Por qué el PATCH con el token del administrador funciona aunque la regla diga allow write: if false? :: Porque el PATCH no escribe de verdad :: Porque las reglas se apagan de noche :: Porque las reglas son para los clientes; el dueño del proyecto entra con otro tipo de permiso
vf :: El token que guarda firebase-tools dura para siempre
escribe :: Explica con tus palabras qué es un token y por qué se usa en vez de la contraseña. :: Es un pase con fecha de vencimiento que prueba quién soy. Se usa para no mandar la contraseña en cada pedido: si alguien roba el token, solo le sirve un rato, y la contraseña sigue a salvo.
```

## Parte 4. Comprobar desde afuera: el 403

> 🌎 **En la vida real:** después de instalar la caja fuerte, el gerente **intenta abrirla sin la llave**. Si se abre, la caja no sirve. No basta con creer que está bien: hay que probarlo.

La prueba más simple: pedir el documento **sin ningún token**, como lo haría un extraño.

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://firestore.googleapis.com/v1/projects/MI-PROYECTO/databases/(default)/documents/privado/dibujos-personajes"
```

| Pieza | Qué hace |
|---|---|
| `-o /dev/null` | Tira a la basura el cuerpo de la respuesta: solo nos importa el número. |
| `-w "%{http_code}\n"` | Escribe el **código** de la respuesta. |

Lo que tiene que salir es **`403`**: "no tienes permiso". Si sale **`200`** con los dibujos, la regla está mal y cualquiera los puede leer.

| Quién pide | Lo que debe responder |
|---|---|
| Sin cuenta (el `curl` de arriba) | **403** |
| Desde la app, con otra cuenta | **permiso denegado** (`permission-denied`) |
| Desde la app, con la cuenta permitida | Los dibujos |
| El administrador, con su token | Los dibujos (y puede escribir) |

> 💡 **Idea:** prueba **las cuatro filas**, no solo la que funciona. La seguridad se demuestra con lo que **falla** cuando tiene que fallar.

> 📌 **Nota:** si tu proyecto tiene App Check aplicado (clase 124), el `curl` sin sello también da 403, pero por otra razón: lo frena el portero, no la cerradura. Para probar **la regla**, haz también la segunda fila: entra en la app con otra cuenta.

```practica
vf :: Si el curl sin token responde 200 con los dibujos, la regla está bien puesta
elige :: ¿Qué quiere decir un 403? :: La página no existe :: El servidor te entendió, pero no tienes permiso :: El servidor se cayó
escribe :: ¿Por qué hay que probar también con una cuenta que NO es la permitida? :: Porque la seguridad se demuestra viendo que lo prohibido falla. Si solo pruebo con la cuenta del papá, veo que funciona, pero no sé si también se lo entrega a cualquier otra cuenta.
```

## Parte 5. El cliente: pedirlo, guardarlo y usarlo sin internet

> 🌎 **En la vida real:** el papá va al banco, saca lo que necesita y lo guarda **en la gaveta de su casa**. Así no tiene que ir al banco cada vez. Pero si un día el banco está cerrado (no hay internet), **no bota** lo que ya tenía en la gaveta.

Del lado de la app quedan dos piezas. La primera pide el documento (`src/nube/firebase.js`):

```js
export async function leerDibujosPrivados() {
  try {
    const s = await getDoc(doc(db, 'privado', 'dibujos-personajes'));
    return s.exists() ? JSON.parse(s.data().json || '[]') : [];
  } catch (e) {
    if (e?.code === 'permission-denied') return []; // otra cuenta: no le corresponden
    throw e; // sin internet: se quedan los que ya estaban guardados en el teléfono
  }
}
```

**Cómo leerla:**

| Pieza | Qué hace |
|---|---|
| `getDoc(doc(db, 'privado', 'dibujos-personajes'))` | Le pide a Firestore **ese** documento. Firebase manda el pase de la cuenta que entró, y la regla decide. |
| `s.exists() ? … : []` | Si el documento no existe, devuelve una lista vacía. |
| `JSON.parse(s.data().json …)` | El campo `json` es texto; esto lo vuelve a convertir en una lista. |
| `permission-denied` → `[]` | Otra cuenta: **no es un error**, simplemente no le toca nada. La app sigue normal. |
| cualquier otro error → `throw e` | Lo más común es **no tener internet**. Si devolviera `[]`, la app creería "ya no hay dibujos" y **borraría** los que tenía guardados. Por eso lanza el error. |

La segunda pieza guarda la lista en el teléfono **junto con el uid** de la cuenta (`src/modulos/pintura.js`):

```js
const PRIVADOS = 'leo-dibujos-privados';

// Solo usa lo guardado si es de la MISMA cuenta que está abierta ahora
const privadosGuardados = () => {
  const g = Guardado.leer(PRIVADOS, null);
  return g && g.uid === nube.usuario?.uid ? g.lista : [];
};

async function traerPrivados() {
  const uid = nube.usuario?.uid;
  if (!uid) return false;                       // sin cuenta, ni se pregunta
  const lista = await (await cargarFirebase()).leerDibujosPrivados();
  Guardado.escribir(PRIVADOS, { uid, lista }, { sinSubir: true });
  // …
}
```

`Guardado` es la forma de la app de usar **localStorage**. `{ sinSubir: true }` quiere decir que esta copia se queda **solo en el teléfono**: no se sube a la nube junto con el progreso del niño.

**¿Por qué guardar el uid?** Imagina que el papá entra, se bajan los dibujos, y después en el mismo teléfono entra **otra cuenta**. Si la app usara lo guardado sin mirar de quién es, la otra cuenta vería los dibujos. Con el uid, `privadosGuardados()` devuelve `[]` porque la copia no es suya.

> ⚠️ **Cuidado:** la copia en el teléfono es para **usar sin internet**, no un secreto. Quien tenga el teléfono del papá en la mano podría leerla. Eso está bien aquí: el objetivo era no **publicar** los dibujos en la app que baja todo el mundo, no esconderlos del propio papá.

> 🧩 **Piezas para este ejercicio**
> - Un documento ausente, una negativa de acceso y un fallo de conexión son resultados distintos. Trata cada uno según lo que indica el código recibido antes de leer el JSON.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿Qué hago con la respuesta?
lenguaje: js
pide: Completa `interpretar(r)`. Si `r.code` es `'permission-denied'`, devuelve `[]`. Si `r.code` es cualquier otra cosa (por ejemplo `'unavailable'`, sin internet), **lanza** un error con `throw new Error(r.code)`. Si no hay `code`: si `r.existe` es falso devuelve `[]`; si es verdadero devuelve `JSON.parse(r.json)`.
--- código
function interpretar(r) {
  // tu código aquí
}
--- pruebas
prueba('la cuenta permitida recibe la lista', () => igual(interpretar({ existe: true, json: '[{"id":"a"}]' }), [{ id: 'a' }]));
prueba('el documento no existe', () => igual(interpretar({ existe: false }), []));
prueba('otra cuenta: lista vacía, sin error', () => igual(interpretar({ code: 'permission-denied' }), []));
prueba('sin internet: lanza para no borrar la copia', () => {
  let lanzo = false;
  try { interpretar({ code: 'unavailable' }); } catch (e) { lanzo = true; }
  ok(lanzo, 'sin internet tiene que lanzar un error');
});
--- solución
function interpretar(r) {
  if (r.code === 'permission-denied') return [];
  if (r.code) throw new Error(r.code);
  if (!r.existe) return [];
  return JSON.parse(r.json);
}
```

> 🧩 **Piezas para este ejercicio**
> - La copia local pertenece a la cuenta cuyo identificador quedó guardado. Compara ese identificador con el de la sesión actual antes de entregar el contenido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: La gaveta de cada cuenta
lenguaje: js
pide: Completa `copiaDe(guardado, uidActual)`. `guardado` es `null` o `{ uid, lista }`. Devuelve `guardado.lista` solo si existe y su `uid` es igual a `uidActual`. Si no, devuelve `[]`. Si `uidActual` es `null` (nadie entró), también `[]`.
--- código
function copiaDe(guardado, uidActual) {
  // tu código aquí
}
--- pruebas
prueba('la misma cuenta ve su copia', () => igual(copiaDe({ uid: 'u1', lista: ['a'] }, 'u1'), ['a']));
prueba('otra cuenta en el mismo teléfono', () => igual(copiaDe({ uid: 'u1', lista: ['a'] }, 'u2'), []));
prueba('no hay nada guardado', () => igual(copiaDe(null, 'u1'), []));
prueba('nadie entró', () => igual(copiaDe({ uid: 'u1', lista: ['a'] }, null), []));
--- solución
function copiaDe(guardado, uidActual) {
  if (!guardado || !uidActual) return [];
  return guardado.uid === uidActual ? guardado.lista : [];
}
```

```practica
elige :: Si getDoc falla porque no hay internet, ¿qué hace leerDibujosPrivados? :: Devuelve una lista vacía :: Lanza el error, para que la app no borre la copia guardada :: Cierra la app
vf :: Cuando otra cuenta pide el documento, la app muestra un mensaje de error en la pantalla
vf :: Se guarda el uid junto con la lista para que, si entra otra cuenta en el mismo teléfono, no vea la copia del papá
escribe :: ¿Por qué no es lo mismo "no tienes permiso" que "no hay internet", y qué hace la app en cada caso? :: Sin permiso, la respuesta es definitiva: a esa cuenta no le toca nada y se devuelve una lista vacía. Sin internet, no se sabe nada nuevo: si se devolviera vacía se borraría la copia buena, así que se lanza el error y la app sigue usando lo que tenía guardado.
```

### Comprobar qué pasa con la copia sin conexión

La regla de Firestore controla las lecturas del servidor. Una copia descargada para trabajar sin conexión puede seguir disponible hasta que el cliente vuelva a conectarse y reciba la denegación. Si necesitas revocación inmediata, exige una autorización reciente para mostrar el contenido y decide cuándo caduca. Eso limita el uso sin internet.

Con datos ficticios, comprueba y anota estos casos:

| Caso | Comprobación |
|---|---|
| Cierre de sesión o cambio de cuenta | Oculta el contenido, elimina la copia de la cuenta anterior e ignora cualquier lectura anterior que termine tarde. |
| Permiso revocado con conexión | Al recibir una denegación, borra la copia y verifica que tampoco aparece al reabrir la app sin conexión. |
| Interrupción de red con la misma cuenta | Conserva la copia solo durante el plazo permitido por tu política de uso sin conexión. |
| Permiso revocado mientras el equipo está desconectado | Comprueba la caducidad local. Al reconectar, verifica que la denegación elimina la copia. |

El código de arriba ilustra la asociación con el UID. Los resultados de esta tabla se comprueban en la app que implementa la política.

## Parte 6. La prueba final: buscar en el paquete

> 🌎 **En la vida real:** antes de despachar la caja de cereal, alguien la abre y revisa que el regalo **no** se haya quedado adentro por error.

El último paso es comprobar que ni los dibujos ni el correo quedaron en lo que se publica. Se busca un texto que **solo** aparece en el contenido privado (por ejemplo, el id de un dibujo) y el correo.

En la carpeta que se empaqueta (en ABC es `www/`) y en el código:

```bash
grep -rl "papa@ejemplo.com" www src
grep -rl "personaje-1" www
```

`grep -rl` busca dentro de **todos** los archivos de la carpeta (`-r`) y escribe **solo los nombres** de los que lo tienen (`-l`). Si no escribe nada, no está. 

En el APK, que es un `.zip`:

```bash
mkdir -p /tmp/apk && unzip -q -o ABC.apk -d /tmp/apk
grep -rl "papa@ejemplo.com" /tmp/apk
grep -rl "personaje-1" /tmp/apk
```

| Pieza | Qué hace |
|---|---|
| `unzip -q -o ABC.apk -d /tmp/apk` | Abre el APK en una carpeta aparte. `-q` sin hablar, `-o` reemplaza si ya existía. |
| `grep -rl … /tmp/apk` | Busca en todo lo que había adentro, también en `assets/public/`, donde Capacitor pone la página. |

**Resultado esperado: ninguna línea.** Así salió en ABC: con el correo de verdad y con el id de un dibujo, `grep` no encontró **nada** ni en `www/`, ni en `src/`, ni dentro del APK.

> 💡 **Idea:** busca en **lo que se publica** (el APK, la carpeta empaquetada), no solo en tu código. A veces el código está limpio pero una copia vieja quedó en la carpeta de salida.

> 📌 **Nota:** si alguna vez el contenido **sí** estuvo en una versión publicada, sacarlo ahora no borra las copias que la gente ya bajó. Y si estuvo en git, sigue en el historial. Por eso conviene hacerlo **antes** de publicar.

```practica
elige :: ¿Qué quiere decir que grep -rl no escriba nada? :: Que grep falló :: Que ningún archivo de esa carpeta tiene ese texto :: Que la carpeta está vacía
vf :: Basta con buscar en src; el APK no hace falta revisarlo
vf :: Un APK es un archivo zip y se puede abrir con unzip
```

## Tu turno: hazlo en tu propio proyecto

> 🎙️ **El profesor dice:** {{alumno}}, ahora lo haces tú, en un proyecto de Firebase de prueba (gratis, en el plan Spark). **No** uses el proyecto de una app que tiene usuarios reales.

1. En tu proyecto de prueba, agrega la regla de la Parte 2 con **tu** correo (y en el archivo de reglas, no en el código de la página). Súbela con `npx firebase-tools deploy --only firestore:rules`.
2. Inventa un contenido privado pequeño, por ejemplo `{ "mensaje": "solo para mí" }`, y súbelo desde la consola siguiendo la Parte 3 al documento `privado/prueba`.
3. Haz las cuatro pruebas de la tabla de la Parte 4. Anota qué respondió cada una.
4. En una página sencilla, escribe la función que lee `privado/prueba` y lo guarda en `localStorage` con el uid. Desconecta el internet y recarga: ¿se sigue viendo?
5. Busca con `grep -rl` tu correo y el texto `solo para mí` en la carpeta que publicas. No tiene que salir nada.

**Para entregar:** las cuatro respuestas de la Parte 4 (los códigos o mensajes) y la salida de los `grep` de la Parte 6.

```practica
escribe :: Después de hacer el ejercicio, cuenta qué respondió cada una de las cuatro pruebas y si alguna te sorprendió. :: Sin cuenta, el curl dio 403. Con otra cuenta, la app recibió permission-denied y no mostró nada. Con mi cuenta, se vio el mensaje. Con el token de administrador pude leer y escribir. Lo que más me sorprendió es que el administrador se salta las reglas, por eso el token hay que cuidarlo.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo muestras un contenido solo a ciertos usuarios?":** "No lo pongo en la app, porque todo lo que va en el bundle se puede leer abriendo el APK. Lo guardo en Firestore y pongo una regla en el servidor que solo deja leer ese documento a la cuenta permitida, con el correo verificado. Nadie puede escribir desde la app; el contenido lo subo yo como administrador con la API REST."

> 🎤 **Si te preguntan "¿por qué no basta con un if en el frontend?":** "Porque el frontend corre en el aparato del usuario. El if lo puede saltar, y el dato igual está en el código. Un if en el cliente sirve para ordenar la pantalla, no para proteger. La protección tiene que estar en el servidor."

> 🎤 **Si te preguntan cómo lo comprobaste:** "Pedí el documento con curl sin token y respondió 403. Entré con otra cuenta y la app recibió permission-denied, que convierto en una lista vacía. Con la cuenta permitida se ve. Y al final busqué con grep el correo y el contenido dentro del APK abierto con unzip: no apareció nada."

> 🎤 **Si te preguntan por el modo sin conexión:** "La app guarda la lista en localStorage con el uid de la cuenta. Si no hay internet, la función de lectura lanza el error en vez de devolver una lista vacía, así no se borra la copia buena. Y si otra cuenta entra en el mismo teléfono, el uid no coincide y no ve nada."

> 🌎 **En la vida real:** el regalo no viaja en la caja de cereal: se queda en la caja fuerte del banco, el cajero revisa la cédula, el gerente es el único que mete cosas, y el papá guarda una copia en su gaveta para cuando el banco está cerrado.
