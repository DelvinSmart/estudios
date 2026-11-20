# Tema 21: El certificado verificable

> 🌎 **En la vida real:** un diploma impreso en casa con tu impresora lo puede hacer cualquiera. Un diploma que se puede **consultar en la página de la universidad** con un código, no: si el código no está en su sistema, el diploma es falso. Esta clase cuenta cómo le dimos eso al certificado de este mapa.

> 🎙️ **El profesor dice:** hasta ahora, este sitio era solo HTML, CSS y JavaScript en GitHub Pages: todo pasaba **en tu navegador**. Eso está bien para estudiar, pero no para un certificado. En esta clase vas a ver por qué el navegador "miente", cómo se arma un login con correo, cómo se guardan los bombillos en Firebase y, lo más importante, cómo se escriben **reglas que no se dejan engañar** y cómo se **prueban atacándolas**.

**Archivos de esta clase** (todos en este mismo repositorio):

| Archivo | Qué hace |
|---|---|
| `web/nube.js` | Todo lo que habla con Firebase: cuenta, progreso y certificado |
| `web/vistas/cuenta.js` | Las pantallas de la cuenta: entrar, crear cuenta, recuperar y mi cuenta |
| `web/vistas/certificado.js` | El certificado de cada curso y la página para verificarlo |
| `firebase/separar-respuestas.mjs` | Saca las respuestas de los `.md` y las guarda en el archivo privado (Parte 8) |
| `firebase/funciones/corregir.js` | Corrige una práctica con las respuestas privadas (Parte 8) |
| `firebase/funciones/limites.js` | Los topes de correos (por persona y por día, separados por tipo) |
| `firebase/reglas.plantilla` | Las reglas de seguridad, escritas a mano |
| `firebase/generar-reglas.mjs` | Arma `firestore.rules` con la lista real de partes |
| `firebase/pruebas/reglas.test.mjs` | Las trampas que intentamos; todas tienen que fallar |

## Parte 1. El problema: el navegador miente

> 🌎 **En la vida real:** si el cajero del supermercado le pregunta al cliente "¿cuánto cuesta esto?" y cobra lo que el cliente dice, el negocio quiebra. El precio lo tiene que decir **la caja**, no el cliente.

> 🌎 **Otro ejemplo:** Es como un examen donde el alumno corrige su propia prueba y anota su nota: puede ser honesto, pero nadie puede **confiar** en esa nota.

### Lo que vive en localStorage

Los bombillos se guardaban en `localStorage`, un cajoncito del navegador. Ese cajón es **de la persona que usa el navegador**: puede abrirlo, leerlo y cambiarlo cuando quiera.

> 🌎 **En la vida real:** es como la libreta de ahorros que llevas tú: puedes escribir cualquier número, pero el banco solo cree lo que dice **su** sistema.

> 🌎 **Otro ejemplo:** Es como el cuentakilómetros de un carro viejo: si alguien lo puede mover con la mano, el número ya no prueba nada.

### El ataque de 10 segundos

Cualquiera podía abrir las herramientas del navegador (**Cmd + Option + I**), ir a la **Consola** y escribir una línea que prendiera los 229 bombillos. Con eso aparecía el certificado. Lo probamos nosotros mismos: funcionaba.

```js
// Lo que haría un tramposo en la consola (por eso ya no sirve para el certificado):
localStorage.setItem('mapa-entendido', JSON.stringify({ '01:CLASE-GUIADA.md:1': Date.now() /* …y las demás */ }));
```

> 🌎 **En la vida real:** es como cambiar la nota en la libreta del colegio con corrector: la libreta cambia, pero la secretaría tiene el registro verdadero.

> 🌎 **Otro ejemplo:** Es como pintar un sello de "pagado" en una factura: se ve igual, pero el sistema de la empresa sigue diciendo que debes.

### La regla de oro: decide el servidor

**Todo lo que pasa en el navegador lo controla el usuario.** Si algo tiene que ser confiable (un pago, un permiso, un certificado), lo tiene que decidir un **servidor** con sus propias reglas. El navegador solo pide; el servidor acepta o rechaza.

> 🌎 **En la vida real:** en el banco, la app te deja **pedir** una transferencia, pero quien decide si tienes saldo es el banco, no tu celular.

> 🌎 **Otro ejemplo:** Es como la portería de un edificio: tú dices "vengo al 502", pero el portero llama al 502 antes de abrir.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El navegador miente
lenguaje: js
pide: Lo que está en `localStorage` lo puede cambiar cualquiera desde la consola. Completa `emitirCertificado(pedido, servidor)`: **no confíes** en `pedido.bombillos` (lo manda el navegador); usa solo `servidor.aprobadas(uid)`, que el servidor guardó. Emite (`{ ok: true }`) solo si las aprobadas llegan a `servidor.total`; si no, `{ ok: false, faltan: N }`.
--- código
function emitirCertificado(pedido, servidor) {
  // tu código aquí
}
--- pruebas
const servidor = { total: 10, aprobadas: (uid) => (uid === 'ana' ? 10 : 3) };
prueba('Ana terminó', () => igual(emitirCertificado({ uid: 'ana', bombillos: 10 }, servidor), { ok: true }));
prueba('Beto dice 10 en su navegador, pero tiene 3', () => igual(emitirCertificado({ uid: 'beto', bombillos: 10 }, servidor), { ok: false, faltan: 7 }));
--- solución
function emitirCertificado(pedido, servidor) {
  const aprobadas = servidor.aprobadas(pedido.uid);
  if (aprobadas >= servidor.total) return { ok: true };
  return { ok: false, faltan: servidor.total - aprobadas };
}
```

```practica
vf :: Lo que se guarda en localStorage lo puede cambiar la persona que usa el navegador
vf :: Si el botón está deshabilitado en la pantalla, nadie puede hacer esa acción
elige :: ¿Quién debe decidir si se emite un certificado? :: El navegador de la persona :: El servidor, con sus reglas :: El que diseñó la página
elige :: ¿Qué herramienta del navegador usaría un tramposo para prender bombillos? :: El buscador :: La consola de las herramientas de desarrollador :: El modo oscuro
escribe :: Con tus palabras: ¿por qué un certificado basado solo en localStorage no prueba nada? :: Porque localStorage está en el navegador de la persona y lo puede cambiar con una línea en la consola; un dato que el usuario puede editar no sirve como prueba.
```

## Parte 2. Cuentas: entrar con correo

> 🌎 **En la vida real:** para que el banco guarde **tu** plata, primero tiene que saber quién eres: por eso abres una cuenta con tus datos y una clave.

> 🌎 **Otro ejemplo:** Es como el carnet del gimnasio: sin carnet, el gimnasio no sabe a quién anotarle las clases.

### Firebase Authentication

**Firebase Authentication** es el servicio de Google que maneja las cuentas: crear, entrar, salir, recuperar contraseña y verificar correos. La contraseña **nunca** la guardamos nosotros: la guarda Firebase, cifrada. Nosotros solo recibimos un **pase** (token) que dice "esta persona es tal uid".

```js
// web/nube.js (resumido)
const r = await A.signInWithEmailAndPassword(auth, correo, contrasena);
console.log(r.user.uid);   // el número único de la cuenta
```

> 🌎 **En la vida real:** es como el control de entrada de un evento grande: tú no guardas la lista de invitados, la guarda la empresa de seguridad y te dan una pulsera.

> 🌎 **Otro ejemplo:** Es como pagar con tarjeta: la tienda no sabe tu clave, solo recibe "aprobado" del banco.

### Crear cuenta y verificar el correo

Al crear la cuenta, el sitio manda un **correo de verificación**. Hasta que la persona abre ese enlace, la cuenta existe pero **no cuenta en la nube**: las reglas exigen `email_verified == true`. Así nadie crea cuentas con correos ajenos.

```js
const r = await A.createUserWithEmailAndPassword(auth, correo, contrasena);
await A.updateProfile(r.user, { displayName: nombre });
await A.sendEmailVerification(r.user, { url: 'https://delvinsmart.github.io/estudios/#/entrar/listo' });
```

> 💡 **Idea:** después de verificar hay que pedir un **pase nuevo** (`getIdToken(true)`), porque las reglas leen `email_verified` del pase, no de la pantalla. Eso hace `refrescarCuenta()`.

> 🌎 **En la vida real:** es como cuando te registras en una farmacia y te mandan un código al celular: si no lo confirmas, no te dan los descuentos.

> 🌎 **Otro ejemplo:** Es como la carta certificada: el correo solo da por entregada la carta cuando alguien firma que la recibió.

### Recuperar la contraseña sin regalar información

La pantalla "Olvidé mi contraseña" **siempre responde lo mismo**: "si existe una cuenta con ese correo, el enlace llega en instantes". Nunca dice "ese correo no existe". Si lo dijera, un atacante podría usarla para averiguar quién estudia aquí. Eso se llama **enumeración de cuentas**.

> 🌎 **En la vida real:** si llamas a un hospital preguntando "¿está internado fulano?", no te lo dicen por teléfono: esa respuesta ya es información privada.

> 🌎 **Otro ejemplo:** Es como el buzón de un edificio: el cartero deja la carta, pero no te dice quién vive en cada departamento.

### Por qué solo Gmail y sin teléfono

Decidimos aceptar **solo correos de Gmail** y **no pedir teléfono**. Menos datos guardados = menos riesgo. Y como no hay teléfono, "Olvidé mi correo" no busca por número: explica cómo encontrar tu Gmail (el botón de Google muestra tus cuentas).

> 🌎 **En la vida real:** una tienda que no guarda tu dirección no puede perderla en un robo de datos.

> 🌎 **Otro ejemplo:** Es como viajar con poco equipaje: entre menos lleves, menos se te puede perder.

> ⚠️ **Ojo:** tampoco pedimos **CPF** para confirmar el nombre. Este sitio no tiene cómo confirmarlo con el gobierno, y guardarlo sería un riesgo enorme (es un dato protegido por la LGPD). Por eso el nombre depende de que la persona lo escriba bien, y la pantalla del certificado lo avisa claro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Sin enumeración de cuentas
lenguaje: js
pide: "Olvidé mi contraseña" **nunca** dice si el correo existe: así nadie puede descubrir quién tiene cuenta. Completa `respuestaOlvide(correo, cuentas)`: siempre devuelve el mismo texto, exista o no. Y `correoValido(correo)`: tiene que ser un correo de Gmail (`@gmail.com`), sin espacios.
--- código
const MENSAJE = 'Si ese correo tiene cuenta, te mandamos un enlace.';

function respuestaOlvide(correo, cuentas) {
  // tu código aquí
}

function correoValido(correo) {
  // tu código aquí
}
--- pruebas
const cuentas = ['ana@gmail.com'];
prueba('existe', () => igual(respuestaOlvide('ana@gmail.com', cuentas), MENSAJE));
prueba('no existe: la misma respuesta', () => igual(respuestaOlvide('nadie@gmail.com', cuentas), MENSAJE));
prueba('gmail válido', () => igual(correoValido('ana.silva@gmail.com'), true));
prueba('otro dominio', () => igual(correoValido('ana@yahoo.com'), false));
prueba('con espacios', () => igual(correoValido('ana @gmail.com'), false));
--- solución
const MENSAJE = 'Si ese correo tiene cuenta, te mandamos un enlace.';

function respuestaOlvide(correo, cuentas) {
  return MENSAJE;
}

function correoValido(correo) {
  return /^[^\s@]+@gmail\.com$/.test(correo);
}
```

```practica
vf :: Este sitio guarda las contraseñas en su propia base de datos
vf :: Si la cuenta no tiene el correo verificado, sus bombillos no cuentan en la nube
elige :: ¿Por qué "Olvidé mi contraseña" nunca dice "ese correo no existe"? :: Por pereza :: Para que nadie la use para averiguar qué correos están registrados :: Porque Firebase no lo sabe
elige :: Después de abrir el enlace de verificación, ¿qué hay que pedir? :: Una contraseña nueva :: Un pase (token) nuevo, con getIdToken(true) :: Un correo nuevo
elige :: ¿Por qué no pedimos CPF? :: Porque es muy largo :: Porque no lo podemos confirmar y guardarlo sería un riesgo para la persona :: Porque Firebase no acepta números
escribe :: Explica qué es la enumeración de cuentas y cómo la evitamos. :: Es usar una pantalla del sitio para averiguar si un correo está registrado; la evitamos respondiendo siempre el mismo mensaje, exista o no la cuenta.
```

## Parte 3. El progreso en la nube

> 🌎 **En la vida real:** es como pasar de anotar tus horas de trabajo en un cuaderno a marcar con el reloj de la empresa: el registro ya no lo llevas tú.

> 🌎 **Otro ejemplo:** Es como el odómetro de un carro moderno, guardado en la computadora del carro: no se mueve con la mano.

### Un documento por persona y por curso

En Firestore, cada persona tiene un documento por curso: `cursos/programacion/progreso/{uid}` y `cursos/seguridad/progreso/{uid}`. Adentro van: `n` (cuántos bombillos), `inicio`, `ultimo`, `ultimaParte` y `partes` (cada parte con su fecha).

```js
{
  n: 3,
  inicio: Timestamp(2026-11-16 15:02),
  ultimo: Timestamp(2026-11-16 15:20),
  ultimaParte: '01:CLASE-GUIADA.md:3',
  partes: { '01:CLASE-GUIADA.md:1': …, '01:CLASE-GUIADA.md:2': …, '01:CLASE-GUIADA.md:3': … }
}
```

> 🌎 **En la vida real:** es como el historial de cada alumno en la secretaría: una carpeta por alumno y por materia.

> 🌎 **Otro ejemplo:** Es como la libreta de vacunas: cada vacuna con su fecha, y el total al final.

### La hora la pone el servidor

El navegador no manda su hora: manda `serverTimestamp()`, que significa "pon **tu** hora, servidor". Las reglas comprueban que la fecha guardada sea exactamente `request.time` (la hora del servidor). Así nadie puede decir "esto lo estudié el año pasado".

> 🌎 **En la vida real:** es como el sello de fecha del correo: lo pone la oficina, no quien manda la carta.

> 🌎 **Otro ejemplo:** Es como la hora de un comprobante de pago: la imprime la máquina del banco, no el cliente.

### El punto en el id

Los ids de las partes llevan un punto: `01:CLASE-GUIADA.md:1`. Con `updateDoc(ref, { 'partes.01:CLASE-GUIADA.md:1': … })`, Firestore lee el punto como "entra a otro nivel" y lo parte en dos. Lo descubrimos **porque una prueba falló**. La solución: `setDoc` con `merge`, que trata el id como una sola llave.

```js
await F.setDoc(ref, { n: actual.n + 1, ultimo: ahora, ultimaParte: id, partes: { [id]: ahora } }, { merge: true });
```

> 🌎 **En la vida real:** es como escribir una dirección "Calle 5.2": el cartero puede pensar que es la calle 5, casa 2.

> 🌎 **Otro ejemplo:** Es como un nombre de archivo con barra `/`: la computadora cree que es una carpeta.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Ids sin puntos
lenguaje: js
pide: `updateDoc` con `'partes.06:CLASE-GUIADA.md:3'` se rompe, porque el **punto** separa campos. Completa `idSeguro(id)`: cambia cada `.` por `·` (punto del medio) y cada `/` por `|`. Y `ponerParte(progreso, id)`: devuelve un objeto **nuevo** con `partes[idSeguro(id)] = true`.
--- código
function idSeguro(id) {
  // tu código aquí
}

function ponerParte(progreso, id) {
  // tu código aquí
}
--- pruebas
prueba('sin puntos', () => igual(idSeguro('06:CLASE-GUIADA.md:3'), '06:CLASE-GUIADA·md:3'));
prueba('sin barras', () => igual(idSeguro('a/b.md'), 'a|b·md'));
prueba('agrega la parte', () => igual(ponerParte({ partes: {} }, '06:LECCION.md:1'), { partes: { '06:LECCION·md:1': true } }));
prueba('no cambia el original', () => { const p = { partes: {} }; ponerParte(p, 'x.md'); igual(p, { partes: {} }); });
--- solución
function idSeguro(id) {
  return id.replaceAll('.', '·').replaceAll('/', '|');
}

function ponerParte(progreso, id) {
  return { ...progreso, partes: { ...progreso.partes, [idSeguro(id)]: true } };
}
```

```practica
vf :: El navegador manda su propia hora para cada bombillo
vf :: Cada curso tiene su propio documento de progreso
elige :: ¿Por qué no se usa updateDoc con 'partes.id'? :: Porque es más lento :: Porque el punto del id (CLASE-GUIADA.md) lo partiría en dos niveles :: Porque no existe
elige :: ¿Cómo se descubrió el problema del punto? :: Lo dijo un usuario :: Una prueba automática falló :: Se rompió el sitio publicado
escribe :: ¿Qué significa serverTimestamp() y por qué importa? :: Le pide al servidor que ponga su propia hora; importa porque así nadie puede inventar fechas desde el navegador.
```

## Parte 4. Las reglas de Firestore

> 🌎 **En la vida real:** las reglas son el reglamento del portero: quién entra, a qué piso, a qué hora y con qué.

> 🌎 **Otro ejemplo:** Es como el contrato de un alquiler: dice qué puedes hacer en la casa y qué no, y vale aunque el dueño no esté mirando.

### Quién puede leer

Cada persona solo lee **su** progreso. Para eso todas las reglas usan `verificado()`: sesión abierta, correo de Gmail y verificado.

```js
function verificado() {
  return request.auth != null
    && request.auth.token.email_verified == true
    && request.auth.token.email.lower().matches('^[^@]+@gmail[.]com$');
}
match /cursos/{curso}/progreso/{uid} {
  allow read: if verificado() && request.auth.uid == uid;
}
```

> 🌎 **En la vida real:** en el banco, tu cajero automático solo te muestra **tu** cuenta, aunque el banco tenga millones.

> 🌎 **Otro ejemplo:** Es como los casilleros del gimnasio: cada llave abre uno solo.

### Un bombillo a la vez

La regla de `update` exige, todo junto: que `n` suba exactamente en 1, que se agregue **una sola** parte nueva, que esté en la **lista oficial** del curso, que su fecha sea la del servidor, y que `inicio` no cambie.

```js
&& request.resource.data.n == resource.data.n + 1
&& request.resource.data.ultimaParte in partes(curso)
&& request.resource.data.partes.diff(resource.data.partes).affectedKeys() == [request.resource.data.ultimaParte].toSet()
&& request.resource.data.partes[request.resource.data.ultimaParte] == request.time
```

> 💡 **Idea:** `resource` es el documento **como está ahora**; `request.resource` es **como quedaría** si se acepta. Las reglas comparan los dos.

> 🌎 **En la vida real:** es como el sellito de la tarjeta de café: un sello por café, no diez de golpe.

> 🌎 **Otro ejemplo:** Es como subir una escalera: un escalón a la vez; si alguien aparece en el piso 10 sin pasar por los otros, algo raro hay.

### La espera de 60 segundos

`request.time > resource.data.ultimo + duration.value(60, 's')`: entre un bombillo y otro tienen que pasar al menos 60 segundos. Para 229 partes son casi 4 horas como mínimo. No hace imposible la trampa, pero sí **cara** y lenta.

> 🌎 **En la vida real:** es como el cajero automático que solo te deja sacar cierto monto por día: no impide robar, pero limita el daño.

> 🌎 **Otro ejemplo:** Es como la fila del banco: no puedes hacer 50 trámites a la vez, uno detrás de otro.

### El certificado y el lote

El certificado se crea con dos documentos **a la vez** (un *lote*, `writeBatch`): `certificados/{codigo}` (público) y `cursos/{curso}/emitidos/{uid}` (cuál es tu código). Las reglas usan `getAfter()` para mirar "cómo quedaría el otro documento" y exigen que coincidan. Así cada persona tiene **un solo** certificado por curso.

Además, para **crear** el certificado las reglas exigen todo esto junto (en `firebase/firestore.rules`):

| La regla mira | Para que nadie pueda… |
|---|---|
| Que tengas **todos** los bombillos del curso (los cuenta la regla en la base, no le cree a la página) | emitirlo sin terminar |
| Que la fecha de emisión sea `request.time`, la hora del servidor | poner una fecha falsa |
| Que el inicio y el fin sean los de tu progreso guardado | inventar cuándo estudió |
| Que el código tenga el formato de **ese** curso (`SE-…` para Seguridad) | usar un código de otro curso |
| Que el nombre tenga solo letras, espacios, punto, apóstrofo y guion (de 5 a 80) | meter un enlace, emojis o un texto raro en un certificado público |
| Que el documento tenga **solo** esos datos (`hasOnly`) | agregar campos de más |

Y una vez creado, **nadie lo puede cambiar** (`allow update: if false`), ni su dueño. Lo único que puede hacer el dueño es **borrar el suyo** (por ejemplo, si escribió mal su nombre) y emitirlo de nuevo, pasando otra vez por todas las reglas.

> 🌎 **En la vida real:** es como una compraventa de carro: se firma el contrato y se cambia el dueño en el registro **en el mismo acto**; si falta uno, no vale ninguno.

> 🌎 **Otro ejemplo:** Es como un apretón de manos: si uno no extiende la mano, no hay apretón.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las reglas, como función
lenguaje: js
pide: Escribe la regla de `update` del progreso en JavaScript. `permitir(pedido)` recibe `{ auth, uid, antes, despues, ahora }`. Se permite solo si: hay sesión con correo verificado (`auth.verificado`), es el dueño (`auth.uid === uid`), solo cambió **una** parte nueva (una clave más en `partes` y ninguna otra cambiada), y pasaron al menos 60 segundos desde `antes.ultima` (`ahora - antes.ultima >= 60`).
--- código
function permitir(pedido) {
  // tu código aquí
}
--- pruebas
const base = { auth: { uid: 'ana', verificado: true }, uid: 'ana', antes: { partes: { a: true }, ultima: 0 }, despues: { partes: { a: true, b: true } }, ahora: 100 };
prueba('bien', () => igual(permitir(base), true));
prueba('sin verificar', () => igual(permitir({ ...base, auth: { uid: 'ana', verificado: false } }), false));
prueba('otra persona', () => igual(permitir({ ...base, uid: 'beto' }), false));
prueba('dos partes de golpe', () => igual(permitir({ ...base, despues: { partes: { a: true, b: true, c: true } } }), false));
prueba('muy rápido', () => igual(permitir({ ...base, ahora: 30 }), false));
prueba('borrar una parte', () => igual(permitir({ ...base, despues: { partes: { b: true } } }), false));
--- solución
function permitir(pedido) {
  const { auth, uid, antes, despues, ahora } = pedido;
  if (!auth || !auth.verificado || auth.uid !== uid) return false;
  const viejas = Object.keys(antes.partes);
  const nuevas = Object.keys(despues.partes);
  const sigueTodo = viejas.every((k) => despues.partes[k] === antes.partes[k]);
  if (!sigueTodo || nuevas.length !== viejas.length + 1) return false;
  return ahora - antes.ultima >= 60;
}
```

```practica
vf :: En las reglas, resource es el documento como quedaría después del cambio
vf :: La espera de 60 segundos hace imposible hacer trampa
elige :: ¿Qué comprueba affectedKeys() en la regla de update? :: Que el nombre esté bien :: Que solo cambie una llave: la parte nueva :: Que la persona tenga Gmail
elige :: ¿Para qué sirve getAfter()? :: Para leer el correo :: Para mirar cómo quedaría otro documento del mismo lote :: Para esperar 60 segundos
elige :: ¿Qué hace verificado()? :: Revisa la contraseña :: Exige sesión, correo de Gmail y correo verificado :: Cuenta los bombillos
escribe :: Explica por qué el certificado se crea en un lote con dos documentos. :: Para que se creen juntos o ninguno: el certificado público y el registro de cuál es el código de esa persona; las reglas revisan uno con getAfter del otro, y así cada persona tiene un solo certificado por curso.
```

## Parte 5. Probar las reglas como atacante

> 🌎 **En la vida real:** antes de entregar una caja fuerte, el fabricante contrata a alguien para que intente abrirla. Si la abre, no se vende.

> 🌎 **Otro ejemplo:** Es como el simulacro de incendio: se practica el desastre para ver si el plan funciona.

### El emulador

Firebase tiene un **emulador**: una copia de Firestore que corre en tu Mac, sin tocar la base real. Ahí probamos las reglas todas las veces que queramos. Necesita **Java 21**.

```bash
cd firebase/pruebas && npm install
JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH npm test
```

> 🌎 **En la vida real:** es como el simulador de vuelo: los pilotos se estrellan ahí, no en el avión de verdad.

> 🌎 **Otro ejemplo:** Es como practicar un discurso frente al espejo antes de decirlo en público.

### Las trampas

Escribimos una prueba por cada trampa que se nos ocurrió. Algunas: prender sin sesión, con correo sin verificar, con un correo que no es Gmail, una parte inventada, empezar en 229, una fecha inventada, dos partes de una vez, campos de más (`aprobado: true`), saltar el contador, repetir una parte, cambiar la fecha de inicio, borrar el progreso, emitir sin terminar, emitir a nombre de otra cuenta, tener dos certificados, cambiar el nombre después, listar todos los certificados y robar el de otra persona.

> 🌎 **En la vida real:** es como el control de calidad de una fábrica de cascos: les tiran piedras a propósito.

> 🌎 **Otro ejemplo:** Es como revisar todas las ventanas y puertas de la casa antes de salir de viaje, una por una.

### assertFails y assertSucceeds

Cada prueba dice qué **debe** pasar: `assertFails` (Firestore tiene que decir que no) o `assertSucceeds` (tiene que decir que sí). Las dos importan: unas reglas que lo rechazan **todo** también estarían mal.

```js
test('una parte inventada no vale', async () => {
  await assertFails(setDoc(doc(db('ana'), RUTA), primero('99:FALSO.md:1')));
});
test('el primer bombillo, bien hecho, se acepta', async () => {
  await assertSucceeds(setDoc(doc(db('ana'), RUTA), primero()));
});
```

> 🌎 **En la vida real:** un portero que no deja entrar a **nadie** es tan malo como uno que deja entrar a todos.

> 🌎 **Otro ejemplo:** Es como un filtro de agua: tiene que dejar pasar el agua y atrapar la tierra; si no deja pasar nada, no sirve.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Pruebas como atacante
lenguaje: js
pide: Con `assertSucceeds` y `assertFails` de juguete, escribe al menos 3 pruebas para `puede(quien, accion, dueno)`: el dueño lee lo suyo (sucede), otro lee lo del dueño (falla), y sin sesión (`quien` es `null`) no lee nada (falla). Las revisiones abren trampas en la regla y tus pruebas tienen que notarlo.
--- código
let TRAMPA = '';
function puede(quien, accion, dueno) {
  if (quien === null) return TRAMPA === 'sinSesion';
  if (TRAMPA === 'cualquiera') return true;
  return quien === dueno;
}

const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const assertSucceeds = (r) => { if (!r) throw new Error('se esperaba que se permitiera'); };
const assertFails = (r) => { if (r) throw new Error('se esperaba que se rechazara'); };

// ✍️ Tus pruebas aquí:
--- pruebas
const correrTodas = () => misPruebas.filter((p) => { try { p.fn(); return false; } catch { return true; } }).map((p) => p.nombre);
prueba('pasan con la regla correcta', () => { const f = correrTodas(); ok(misPruebas.length >= 3 && f.length === 0, f.length ? 'fallan: ' + f.join(' | ') : 'escribe al menos 3 pruebas'); });
prueba('notan la trampa "cualquiera lee"', () => { TRAMPA = 'cualquiera'; const f = correrTodas(); TRAMPA = ''; ok(f.length > 0, 'falta la prueba de que otro no puede leer'); });
prueba('notan la trampa "sin sesión"', () => { TRAMPA = 'sinSesion'; const f = correrTodas(); TRAMPA = ''; ok(f.length > 0, 'falta la prueba sin sesión'); });
--- solución
let TRAMPA = '';
function puede(quien, accion, dueno) {
  if (quien === null) return TRAMPA === 'sinSesion';
  if (TRAMPA === 'cualquiera') return true;
  return quien === dueno;
}

const misPruebas = [];
const it = (nombre, fn) => misPruebas.push({ nombre, fn });
const assertSucceeds = (r) => { if (!r) throw new Error('se esperaba que se permitiera'); };
const assertFails = (r) => { if (r) throw new Error('se esperaba que se rechazara'); };

it('Ana lee lo suyo', () => assertSucceeds(puede('ana', 'leer', 'ana')));
it('trampa: Beto lee lo de Ana', () => assertFails(puede('beto', 'leer', 'ana')));
it('trampa: sin sesión', () => assertFails(puede(null, 'leer', 'ana')));
```

```practica
vf :: El emulador prueba las reglas contra la base de datos real
vf :: Unas reglas que rechazan todo también están mal
elige :: ¿Qué hace assertFails? :: Hace que la prueba falle siempre :: Comprueba que Firestore rechace esa operación :: Borra la base
elige :: ¿Qué versión de Java pide el emulador actual? :: 8 :: 17 :: 21 o más
escribe :: Inventa una trampa nueva que alguien podría intentar y di qué regla la detiene. :: Ejemplo: mandar n igual a 2 pero sin agregar ninguna parte nueva; la detiene la regla que exige que addedKeys sea exactamente la parte nueva y que la parte esté en la lista oficial.
```

## Parte 6. El código y la página de verificación

> 🌎 **En la vida real:** es como el código de rastreo de un paquete: con ese código cualquiera lo consulta, pero no puede adivinar los de otros.

> 🌎 **Otro ejemplo:** Es como el número de una boleta electrónica: lo escribes en la página oficial y te dice si es válida.

### Cómo se hace el código

El código es `ME-XXXX-XXXX-XXXX` (curso de programación) o `SE-XXXX-XXXX-XXXX` (curso de seguridad). Las 12 letras son **hexadecimales al azar** (0-9 y A-F), sacadas con `crypto.getRandomValues`: hay **281 billones** de combinaciones (16¹²). No depende del nombre ni de la fecha, así que nadie puede calcular el código de otra persona.

```js
const bytes = crypto.getRandomValues(new Uint8Array(6));          // 6 bytes = 12 letras hex
const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
return `${prefijo}-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
```

> 💡 **Idea:** antes, el código salía de un *hash* del nombre y la fecha. Eso parecía seguro, pero cualquiera con el mismo cálculo podía generar un código "válido". Un código al azar **guardado en el servidor** es lo que lo hace verificable.

> 🌎 **En la vida real:** es como la combinación de un candado: si se pudiera calcular con tu nombre, no serviría.

> 🌎 **Otro ejemplo:** Es como los números de la lotería: salen al azar; nadie los deduce de tu fecha de cumpleaños.

### get sí, list no

Las reglas dejan **leer un** certificado si sabes su código (`allow get: if true`), pero **no listar todos** (`allow list: if false`). Así, la página de verificación funciona sin cuenta, pero nadie puede bajar la lista de todas las personas que estudiaron aquí.

> 🌎 **En la vida real:** en la guía telefónica de una empresa puedes llamar a una extensión que conoces, pero no te dan la lista de todos los empleados.

> 🌎 **Otro ejemplo:** Es como una biblioteca: te prestan el libro que pides por su código, pero no te dejan llevarte el catálogo entero.

### Lo que la verificación garantiza y lo que no

✅ Garantiza: que el certificado lo **emitió este curso**, a ese nombre, después de registrar cada parte en el servidor con su hora, y las fechas en que la persona estudió.
⚠️ No garantiza: que el nombre sea el del documento (lo escribe la persona) ni que haya estudiado sin ayuda (las respuestas ya no están en GitHub, pero alguien podría pasárselas). Lo decimos claro en la página: **no es un título oficial**.

> 🌎 **En la vida real:** el comprobante de una transferencia prueba que la plata salió, no para qué se usó.

> 🌎 **Otro ejemplo:** Es como el sello de "revisado" de un mecánico: dice que lo revisó, no que el carro nunca se va a dañar.

> 🧩 **Piezas nuevas para este ejercicio** (todavía no las habías visto):
> - **`.padStart()`**: rellena un texto por la izquierda hasta que tenga el largo que pides: `'7'.padStart(2, '0')` → `'07'`. Sirve para fechas y códigos. `.padEnd()` rellena por la derecha.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un código que no se puede adivinar
lenguaje: js
pide: El código del certificado es **al azar** (no sale del nombre), con 12 letras hexadecimales y un prefijo por curso. Completa `crearCodigo(prefijo, azar)`: `azar` es una lista de 6 números de 0 a 255 (como da `crypto.getRandomValues`); cada uno se escribe con 2 letras hexadecimales en mayúsculas. Formato: `PREFIJO-XXXX-XXXX-XXXX`. Y `combinaciones()`: cuántos códigos distintos hay (16 elevado a 12).
--- código
function crearCodigo(prefijo, azar) {
  // tu código aquí
}

function combinaciones() {
  // tu código aquí
}
--- pruebas
prueba('el formato', () => igual(crearCodigo('SE', [0, 255, 16, 1, 171, 205]), 'SE-00FF-1001-ABCD'));
prueba('281 billones', () => igual(combinaciones(), 281474976710656));
prueba('con azar de verdad, 12 letras', () => { const c = crearCodigo('PR', [...crypto.getRandomValues(new Uint8Array(6))]); ok(/^PR-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/.test(c), c); });
--- solución
function crearCodigo(prefijo, azar) {
  const hex = azar.map((n) => n.toString(16).padStart(2, '0').toUpperCase()).join('');
  return `${prefijo}-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

function combinaciones() {
  return 16 ** 12;
}
```

```practica
vf :: El código del certificado se calcula con el nombre y la fecha
vf :: Cualquiera puede listar todos los certificados emitidos
elige :: ¿Cuántas combinaciones tienen las 12 letras hexadecimales? :: 12 mil :: Unos 281 billones (16 elevado a 12) :: 100
elige :: ¿Qué NO garantiza la página de verificación? :: Que lo emitió el curso :: Que el nombre sea igual al del documento :: Las fechas de estudio
elige :: ¿Qué significa el prefijo SE-? :: Servidor :: Que es del curso de seguridad :: Que es una muestra
escribe :: ¿Por qué un código al azar guardado en el servidor es mejor que un hash del nombre? :: Porque el hash lo puede calcular cualquiera con el mismo método y generar un código que parece válido; el código al azar solo existe si el servidor lo guardó, y la página lo busca ahí.
```

## Parte 7. ¿Publicar esto ayuda a los hackers?

> 🌎 **En la vida real:** todo el mundo sabe cómo funciona una cerradura de buena calidad; eso no la hace más fácil de abrir. Lo que la protege es la llave, no el secreto del mecanismo.

> 🌎 **Otro ejemplo:** Es como las reglas del fútbol: son públicas, y aun así no puedes meter un gol con la mano sin que el árbitro lo vea.

### Seguridad por oscuridad

Esconder cómo funciona algo y esperar que nadie lo descubra se llama **seguridad por oscuridad**, y no sirve: el código del navegador siempre se puede leer. Lo que protege este sitio son **las reglas que corren en el servidor de Google**, y esas no se pueden saltar aunque se conozcan. Por eso podemos explicarlas aquí.

> 🌎 **En la vida real:** esconder la llave debajo del tapete es seguridad por oscuridad: funciona hasta que alguien mira debajo del tapete.

> 🌎 **Otro ejemplo:** Es como una contraseña "secreta" escrita en un papelito pegado al monitor: el secreto dura hasta que alguien entra a la oficina.

### Qué sí es secreto

La configuración de Firebase en `web/nube.js` (`apiKey`, `projectId`…) **no es secreta**: toda app web la lleva a la vista y solo identifica el proyecto. Lo que **sí** sería secreto: claves de servicio (*service account*), contraseñas, tokens de pago, y **las respuestas de las prácticas** (`firebase/funciones/respuestas.json`, Parte 8). Esas **nunca** van en el repositorio.

> 🌎 **En la vida real:** la dirección de tu casa no es secreta (te llegan cartas); la llave sí.

> 🌎 **Otro ejemplo:** Es como el número de cuenta del banco: lo das para que te paguen; la clave del cajero, jamás.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Se puede publicar o es secreto?
lenguaje: js
pide: Mostrar las reglas no las debilita (corren en el servidor), y la `apiKey` web de Firebase es pública. Lo que **nunca** va al repositorio: la clave de una cuenta de servicio, un `.env` o las respuestas. Completa `puedeIrAlRepo(archivo, contenido)`.
--- código
function puedeIrAlRepo(archivo, contenido) {
  // tu código aquí
}
--- pruebas
prueba('las reglas', () => igual(puedeIrAlRepo('firestore.rules', "rules_version = '2';"), true));
prueba('la configuración web', () => igual(puedeIrAlRepo('web/firebase.js', "apiKey: 'AIzaSy…', projectId: 'mapa'"), true));
prueba('una cuenta de servicio', () => igual(puedeIrAlRepo('clave.json', '{ "type": "service_account", "private_key": "…" }'), false));
prueba('un .env', () => igual(puedeIrAlRepo('.env', 'TOKEN=abc'), false));
prueba('las respuestas', () => igual(puedeIrAlRepo('firebase/funciones/respuestas.json', '{}'), false));
--- solución
function puedeIrAlRepo(archivo, contenido) {
  const nombre = archivo.split('/').pop();
  if (nombre === '.env' || nombre === 'respuestas.json') return false;
  if (contenido.includes('"private_key"')) return false;
  return true;
}
```

```practica
vf :: La apiKey de Firebase de una app web es un secreto que hay que esconder
vf :: Explicar las reglas en público no las debilita, porque corren en el servidor
elige :: ¿Qué es seguridad por oscuridad? :: Usar el modo oscuro :: Confiar en que nadie descubra cómo funciona algo :: Cifrar los datos
elige :: ¿Cuál de estas cosas NUNCA debe ir en el repositorio? :: El projectId :: Una clave de cuenta de servicio (service account) :: El nombre del sitio
escribe :: Explícale a alguien por qué este curso puede mostrar sus reglas de seguridad sin peligro. :: Porque las reglas se ejecutan en los servidores de Google, no en el navegador; aunque alguien las lea, no las puede cambiar ni saltar, y lo que no se debe publicar son las llaves secretas, que no están en el código.
```

## Parte 8. Las respuestas en el servidor

> 🌎 **En la vida real:** en un examen de manejo, el examinador no te entrega la hoja con las respuestas junto con las preguntas. Él tiene la plantilla y te dice si aprobaste.

> 🌎 **Otro ejemplo:** Es como una máquina de café con monedas: tú pones la moneda, pero la máquina decide si es buena; la lista de monedas válidas no está pegada afuera.

### El problema: las respuestas estaban en GitHub

Hasta aquí, el servidor exigía un bombillo a la vez y 60 segundos entre uno y otro. Pero las prácticas se corregían **en el navegador**, y para eso las respuestas tenían que estar en los `.md`, que son **públicos** en GitHub. Alguien podía abrir el archivo, ver `*CSS` o `:: V ::` y aprobar todo sin estudiar.

> 🌎 **En la vida real:** es como dejar el solucionario del libro pegado al final de cada capítulo: el que quiere, copia.

> 🌎 **Otro ejemplo:** Es como un concurso de la tele donde la respuesta correcta sale escrita en la pantalla antes de que el participante conteste.

### La pregunta es pública; la respuesta, privada

Las prácticas se siguen escribiendo igual que siempre, con la respuesta. Después se corre un script que las **separa**:

```bash
node firebase/separar-respuestas.mjs            # saca las respuestas de los .md
node firebase/separar-respuestas.mjs --revisar  # falla si alguna respuesta quedó a la vista
```

- En el `.md` queda solo la pregunta: `elige :: ¿Qué pieza decide los colores? :: HTML :: CSS :: JavaScript`, sin el `*` y sin la explicación.
- La respuesta va a `firebase/funciones/respuestas.json`, que está en `.gitignore`: **nunca se sube a GitHub**. Solo viaja dentro de la función de Firebase.
- Cada práctica tiene un id, por ejemplo `15:CLASE-GUIADA.md:2:practica1` (clase, archivo, parte y número de práctica). Si una práctica cambia de lugar, el script la reconoce por sus enunciados y no pierde la respuesta.

> 🌎 **En la vida real:** es como el profesor que imprime el examen para los alumnos y guarda la plantilla de corrección en su cajón.

> 🌎 **Otro ejemplo:** Es como el menú de un restaurante: está a la vista de todos; la receta secreta queda en la cocina.

### La función que corrige

`corregirPractica` es una **Cloud Function**: código que corre en los servidores de Google, no en tu navegador. Recibe tus respuestas (el número de la opción o `V`/`F`), las compara con `respuestas.json` y contesta. La lógica está en `firebase/funciones/corregir.js`, separada para poder probarla sola:

```js
export function corregir(entrada, respuestas) {
  const resultados = entrada.preguntas.map((p, i) => {
    if (p.tipo === 'escribe') return null; // esa es solo para el alumno: no cuenta
    const dada = respuestas[i];
    if (p.tipo === 'vf') return dada === p.correcta;
    return Number.isInteger(dada) && dada === p.correcta;
  });
  const aprobada = resultados.every((x) => x !== false);
  // Las explicaciones (que muchas veces dicen la respuesta) solo se entregan al aprobar.
  return { aprobada, resultados, explicaciones: aprobada ? /* … */ [] : null };
}
```

Tres decisiones que la hacen difícil de engañar:

- **Al fallar no dice cuál era la correcta.** Solo dice cuáles fallaste. Si dijera "la correcta era CSS", con un intento fallado ya tendrías todas.
- **Se revisa el bloque entero de una vez**, no pregunta por pregunta. Si fuera de a una, bastaría con probar las 2 o 3 opciones de cada pregunta.
- **Hay que esperar 15 segundos después de fallar**, y hay un tope de intentos por día. Probar al azar se vuelve muy lento.

> 🌎 **En la vida real:** es como un cajero automático: si pones mal la clave no te dice cuál dígito estaba mal, y después de varios intentos se traba un rato.

> 🌎 **Otro ejemplo:** Es como el semáforo del examen de manejo: al final te dicen "reprobaste en estacionamiento", pero no te muestran cómo lo hubiera hecho el examinador para que lo copies en el siguiente intento.

### La regla nueva: el bombillo exige la aprobación del servidor

Cuando apruebas con tu cuenta abierta, la función escribe en `cursos/{curso}/aprobadas/{uid}`. **Nadie puede escribir ahí desde el navegador**: la regla es `allow write: if false`, y solo la función (que tiene permisos de administrador) lo hace. Y la regla del progreso ahora pide una condición más:

```js
function aprobadaPorElServidor(curso, uid, parte) {
  return !(parte in conPractica(curso))
    || (exists(/databases/$(database)/documents/cursos/$(curso)/aprobadas/$(uid))
        && parte in get(/databases/$(database)/documents/cursos/$(curso)/aprobadas/$(uid)).data.partes);
}
```

O sea: si la parte tiene práctica, el bombillo solo se prende en la nube si **el servidor** ya la aprobó. La lista `conPractica` la arma `generar-reglas.mjs` leyendo los `.md`.

> 🌎 **En la vida real:** es como el sello del notario: tú puedes llevar el papel, pero solo el notario puede ponerle el sello, y sin sello no vale.

> 🌎 **Otro ejemplo:** Es como la nota final de la escuela: la escribe la secretaría en el sistema, no el alumno en su cuaderno.

### Sin cuenta se lee, pero no se corrige

Al principio, quien estudiaba sin cuenta también mandaba sus respuestas a la función, con un tope de 400 intentos por día por conexión. Funcionaba, pero dejaba una puerta: cualquiera, **sin registrarse**, podía hacer que el servidor trabajara (y gastara). Un robot con muchas conexiones podía multiplicar ese tope.

Ahora la regla es otra: **el curso se puede leer entero sin cuenta**, pero para **revisar las respuestas** hace falta una cuenta de Gmail verificada. La página lo avisa antes de llamar al servidor ("necesitas una cuenta"), y el servidor también lo exige: si llega una llamada sin cuenta, responde `unauthenticated` y no corrige nada. Se revisa en los dos lados porque la página la controla el alumno; el servidor no.

> 🌎 **En la vida real:** es como una biblioteca: cualquiera entra y lee los libros, pero para llevarte uno o rendir un examen necesitas el carné.

> 🌎 **Otro ejemplo:** Es como una autoescuela: el manual se lee gratis, pero el simulador de examen te pide tu documento para saber quién lo usa.

### Lo que todavía no protege

Ser honesto con los límites también es parte de la seguridad:

- **El historial de Git.** Las respuestas estuvieron en GitHub antes de este cambio, y el historial guarda las versiones viejas. Quien busque ahí todavía las encuentra. Borrarlas del historial exige reescribirlo, y eso es una decisión aparte.
- **Las de "escribe con tus palabras"** no las corrige nadie: ninguna máquina las corrige con seguridad sin usar IA. Por eso la página dice que son **solo para ti** y **no cuentan** para aprobar ni para el certificado. Antes había un botón de "sé honesto: ¿dijiste lo mismo?", pero alguien podía escribir letras al azar y decir que sí: era una nota que no medía nada. Decirlo claro es más honesto que fingir que se corrige.
- **La fuerza bruta lenta.** Alguien con mucha paciencia puede probar combinaciones, pero con 15 segundos por intento fallado y 60 segundos por bombillo, terminar sin estudiar lleva más tiempo que estudiar.
- **El archivo privado vive en tu disco.** Si se pierde, se pierden las respuestas: hay que tener un respaldo fuera de GitHub.

> 🌎 **En la vida real:** ninguna casa es imposible de robar; una buena cerradura hace que robarla cueste más que lo que vale.

> 🌎 **Otro ejemplo:** Es como el cinturón de seguridad: no evita todos los accidentes, pero cambia mucho el resultado.

### Agregar preguntas nuevas

1. Escribe la práctica en el `.md` como siempre, con la respuesta (`:: V ::`, el `*` y la explicación con `→`).
2. Corre `node firebase/separar-respuestas.mjs`: saca las respuestas y las guarda en el archivo privado.
3. Corre `node firebase/generar-reglas.mjs` y las pruebas.
4. Sube la función (`firebase deploy --only functions:corregirPractica`) y las reglas, y después publica el sitio.

> 🌎 **En la vida real:** es como cuando el profesor arma un examen nuevo: escribe preguntas y respuestas juntas, y después separa la hoja de los alumnos de la plantilla.

> 🌎 **Otro ejemplo:** Es como cargar un producto nuevo en una tienda online: le pones el precio en el sistema (privado) y la foto en la vitrina (pública).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Corregir en el servidor sin dar la respuesta
lenguaje: js
pide: Las respuestas viven solo en el servidor. Completa `corregir(enviadas, correctas)`: revisa el bloque **entero**. Si todo está bien → `{ aprobada: true }`. Si no → `{ aprobada: false, mal: N }` con cuántas fallaron, **sin** decir cuáles ni cuál era la correcta. Las `null` (preguntas para escribir) no se corrigen.
--- código
function corregir(enviadas, correctas) {
  // tu código aquí
}
--- pruebas
prueba('todo bien', () => igual(corregir([1, 'V', 'texto'], [1, 'V', null]), { aprobada: true }));
prueba('una mal', () => igual(corregir([0, 'V', 'texto'], [1, 'V', null]), { aprobada: false, mal: 1 }));
prueba('no dice cuál era', () => ok(!('correctas' in corregir([0], [1])) && !JSON.stringify(corregir([0], [1])).includes('"1"'), 'no devuelvas las respuestas'));
--- solución
function corregir(enviadas, correctas) {
  const mal = correctas.filter((c, i) => c !== null && enviadas[i] !== c).length;
  return mal === 0 ? { aprobada: true } : { aprobada: false, mal };
}
```

```practica
vf :: Después de este cambio, las respuestas de las prácticas ya no están en los .md que se publican en GitHub
vf :: Si fallas una práctica, el servidor te dice cuál era la opción correcta para que aprendas
elige :: ¿Quién puede escribir en cursos/{curso}/aprobadas/{uid}? :: La persona, desde su navegador :: Solo la función corregirPractica del servidor :: Cualquiera con la apiKey
elige :: ¿Por qué se revisa el bloque entero de una vez y no pregunta por pregunta? :: Porque es más rápido de programar :: Porque de a una bastaría con probar las 2 o 3 opciones de cada pregunta :: Porque Firebase no deja otra forma
elige :: ¿Qué sigue sin estar protegido del todo? :: La hora del servidor :: El historial de Git, donde quedaron las respuestas viejas :: El código de verificación
escribe :: Explica con tus palabras qué cambia para alguien que intenta copiar las respuestas desde GitHub. :: Ya no las encuentra en los archivos públicos: solo están las preguntas. Para aprobar tiene que mandar sus respuestas al servidor, que no le dice cuál era la correcta y lo hace esperar después de fallar; y sin la aprobación del servidor, las reglas no dejan prender el bombillo en la nube.
```

## Resumen para la entrevista

> 🎤 **Si te preguntan "¿cómo evitaste que hicieran trampa con el certificado?":** "El progreso del navegador no sirve como prueba, así que lo moví a Firestore. Las reglas solo aceptan cuentas de Gmail verificadas, un bombillo a la vez, de una lista oficial, con la hora del servidor y una espera mínima entre uno y otro. El certificado se emite en un lote que las reglas validan contra el progreso, y la verificación es pública por código pero no se pueden listar todos. Las prácticas las corrige una Cloud Function con respuestas que no están en el repositorio, y las reglas solo dejan prender el bombillo si el servidor aprobó la práctica. Lo probé con el emulador escribiendo cada trampa como prueba automática, y con una prueba de punta a punta."

> 🌎 **En la vida real:** es como contar cómo cerraste tu casa: no basta con decir "tiene llave", hay que explicar cada puerta.

> 🌎 **Otro ejemplo:** Es como el informe de un mecánico: qué revisó, qué encontró, qué cambió y cómo lo probó.
