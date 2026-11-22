# Seguridad 7: apps móviles

> 🌎 **En la vida real:** cuando vendes un mueble armado, el comprador se lo lleva a su casa y puede desarmarlo, mirar cada tornillo y cambiar piezas. Una app instalada en un teléfono es eso: está en las manos de la persona, que puede abrirla y mirarla por dentro.

> 🎙️ **El profesor dice:** {{alumno}}, ya hiciste apps para el teléfono (React Native, Kotlin y Swift). Hoy, cómo se ven **desde el lado del atacante**: el archivo de la app se puede abrir y leer, lo que guarda en el teléfono también, cualquier otra app o página puede abrir tu app con un enlace, y con las herramientas adecuadas se puede cambiar lo que hace mientras corre. Con los programas que se usan para eso (**jadx**, **MobSF**, **Frida**): qué hacen, cómo los usa un defensor, y cómo te defiendes. La guía de referencia es **OWASP MASVS** (un estándar para *verificar* la seguridad de una app; la lista corta de los riesgos más comunes es el **OWASP Mobile Top 10**).

> ⚠️ **Antes de empezar:** estas herramientas se usan **en tus propias apps** o con permiso. Abrir y modificar apps ajenas puede violar sus términos y la ley (clase 22, parte 0).

## Parte 1. El archivo de la app se puede abrir

> 🌎 **En la vida real:** un sobre cerrado con pegamento no es una caja fuerte: con vapor se abre. El archivo de una app parece cerrado, y no lo es.

> 🌎 **Otro ejemplo:** Es como el libro de recetas de un restaurante que se lleva cada cliente en el plato: la salsa "secreta" está escrita adentro.

Un **APK** (Android) o un **IPA** (iPhone) es, por dentro, un **archivo ZIP**: se cambia la extensión y se abre. Adentro está todo lo que la app necesita para funcionar, **incluido lo que el programador creyó escondido**:

- En una app de **React Native**, el código va en un archivo (`index.android.bundle`). Desde hace años se compila a **bytecode de Hermes** (el motor de JavaScript de React Native): ya **no** es texto legible, pero existen herramientas que lo vuelven a desarmar. En apps viejas o sin Hermes, sí es JavaScript casi tal cual.
- En una app **nativa de Android** (Kotlin/Java), el código se "desarma" con jadx a algo **muy parecido** al original. En una app **de iPhone** (Swift), el código es **lenguaje de máquina**, mucho más difícil de leer, y además la app que baja de la App Store viene **cifrada**: hay que descifrarla en un teléfono con jailbreak para analizarla.

**El programa: jadx** (gratis, de código abierto). Abres un APK y muestra el código Java/Kotlin **reconstruido**, con buscador. Un defensor lo usa con **su propia app** antes de publicarla: busca claves, direcciones internas y lógica que no debería estar en el teléfono. Un atacante lo usa para lo mismo con apps ajenas.

**La regla de oro: nada secreto en la app.** Si la app tiene una llave, **la tiene cualquiera que la descargue**.

| ¿Puede ir en la app? | Ejemplo | Por qué |
|---|---|---|
| ✓ Sí | La `apiKey` de Firebase (`AIza…`) | Está hecha para ser pública: lo que protege los datos son las **reglas** (clase 24) |
| ✗ No | Una llave de pagos `sk_live_…` | Con ella cobran o devuelven dinero **en tu nombre** |
| ✗ No | Una llave privada (`-----BEGIN PRIVATE KEY-----`) | Firma cosas como si fueras tú |
| ✗ No | La contraseña de la base de datos | Entra a todos los datos |

Lo secreto va en **tu servidor**: la app le pide al servidor, y el servidor usa la llave.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Buscar secretos en el archivo de tu app
lenguaje: js
pide: Revisa el JavaScript de **tu** app antes de publicarla. Completa `secretosEn(bundle)`: devuelve, en este orden, los nombres de lo que encontraste: `'llave de pagos'` si aparece `sk_live_` seguido de letras o números; `'llave privada'` si aparece `-----BEGIN PRIVATE KEY-----`; `'contraseña de base de datos'` si aparece una URL como `postgres://usuario:clave@`. La `apiKey` de Firebase (`AIza…`) **no** cuenta: es pública a propósito.
--- código
function secretosEn(bundle) {
  return []; // tu código aquí
}
--- pruebas
const limpio = 'const config = { apiKey: "AIzaSyB1234567890abcdef", projectId: "mi-app" };';
prueba('Firebase solo: nada que esconder', () => igual(secretosEn(limpio), []));
prueba('una llave de pagos', () => igual(secretosEn(limpio + ' const PAGOS = "sk_live_51Hx9abcDEF";'), ['llave de pagos']));
prueba('una llave privada', () => igual(secretosEn('const k = `-----BEGIN PRIVATE KEY-----\nMIIE...`;'), ['llave privada']));
prueba('la base de datos', () => igual(secretosEn('fetch("postgres://admin:superclave@10.0.0.5/app")'), ['contraseña de base de datos']));
prueba('las tres', () => igual(secretosEn('sk_live_abc -----BEGIN PRIVATE KEY----- postgres://a:b@host'), ['llave de pagos', 'llave privada', 'contraseña de base de datos']));
--- solución
function secretosEn(bundle) {
  const encontrados = [];
  if (/sk_live_[A-Za-z0-9]+/.test(bundle)) encontrados.push('llave de pagos');
  if (bundle.includes('-----BEGIN PRIVATE KEY-----')) encontrados.push('llave privada');
  if (/postgres:\/\/[^:\s]+:[^@\s]+@/.test(bundle)) encontrados.push('contraseña de base de datos');
  return encontrados;
}
```

```practica
vf :: Un APK o un IPA se puede abrir como un ZIP y mirar por dentro
vf :: Una llave secreta está a salvo dentro de la app si el código está compilado
elige :: ¿La apiKey de Firebase (AIza…) puede ir en la app? :: No, nunca :: Sí: es pública a propósito; lo que protege los datos son las reglas :: Solo cifrada
escribe :: Tu app necesita cobrar con una llave de pagos. ¿Dónde va la llave y cómo funciona el cobro? :: La llave va en mi servidor (por ejemplo, una Cloud Function), nunca en la app. La app le pide al servidor que cobre, y el servidor usa la llave y revisa que el pedido tenga sentido.
```

## Parte 2. Lo que la app guarda en el teléfono

> 🌎 **En la vida real:** dejar tus documentos en la guantera del auto o en una caja fuerte empotrada. Los dos están "en el auto", pero si alguien entra, uno se lo lleva en un segundo.

> 🌎 **Otro ejemplo:** Es como anotar el PIN de la tarjeta en un papel dentro de la billetera: si pierdes la billetera, pierdes las dos cosas juntas.

En las clases 58, 83, 89 y 103 guardaste datos con **AsyncStorage**, `localStorage`, **DataStore** o **UserDefaults**. Todos guardan en **archivos comunes**, sin cifrar. En un teléfono robado y desbloqueado, en una copia de seguridad, o en un teléfono con *root* o *jailbreak*, se leen.

Para lo **sensible** (un token de sesión, una llave), cada sistema tiene una **caja fuerte**:

| Sistema | Caja fuerte | En Expo / React Native |
|---|---|---|
| iPhone | **Keychain** | `expo-secure-store` |
| Android | **Keystore** (cifra con una llave que vive en un chip aparte) | `expo-secure-store` |

```js
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('token', token);      // en la Keychain o el Keystore
const token = await SecureStore.getItemAsync('token');
```

**La regla:** las preferencias y los datos comunes (la lista de gastos, el modo oscuro), en el almacenamiento común. Los **secretos**, en la caja fuerte. Y lo mejor: **guardar lo menos posible**. Un dato que no guardas no se puede robar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Caja fuerte, común, o no guardarlo?
lenguaje: js
pide: Completa `dondeGuardar(dato)`. Los secretos (`'token de sesión'`, `'llave de cifrado'`) van en `'caja fuerte'`. Lo que **no** hay que guardar nunca en el teléfono (`'contraseña'`, `'número de tarjeta'`) devuelve `'no guardarlo'`. Todo lo demás (preferencias, la lista de gastos) va en `'común'`.
--- código
function dondeGuardar(dato) {
  return 'común'; // ✗ todo en el mismo lugar
}
--- pruebas
prueba('el token', () => igual(dondeGuardar('token de sesión'), 'caja fuerte'));
prueba('una llave', () => igual(dondeGuardar('llave de cifrado'), 'caja fuerte'));
prueba('la contraseña: no se guarda (se guarda el token)', () => igual(dondeGuardar('contraseña'), 'no guardarlo'));
prueba('la tarjeta: no se guarda', () => igual(dondeGuardar('número de tarjeta'), 'no guardarlo'));
prueba('el modo oscuro', () => igual(dondeGuardar('modo oscuro'), 'común'));
prueba('la lista de gastos', () => igual(dondeGuardar('lista de gastos'), 'común'));
--- solución
const SECRETOS = ['token de sesión', 'llave de cifrado'];
const NUNCA = ['contraseña', 'número de tarjeta'];

function dondeGuardar(dato) {
  if (NUNCA.includes(dato)) return 'no guardarlo';
  if (SECRETOS.includes(dato)) return 'caja fuerte';
  return 'común';
}
```

```practica
vf :: AsyncStorage, UserDefaults y DataStore guardan en archivos comunes, sin cifrar
vf :: Conviene guardar la contraseña del usuario en el teléfono para no pedírsela otra vez
elige :: ¿Qué usa una app de Expo para guardar un token en la Keychain o el Keystore? :: AsyncStorage :: expo-secure-store :: localStorage
escribe :: ¿Por qué "guardar lo menos posible" también es seguridad? :: Porque un dato que no guardas no se puede robar: si el teléfono se pierde o la app tiene una falla, no hay nada que sacar.
```

## Parte 3. Los enlaces que abren tu app (deep links)

> 🌎 **En la vida real:** una puerta de servicio en la parte de atrás del local, que se abre desde la calle. Es cómoda para los proveedores… y para cualquiera que la encuentre. Lo que se pide por esa puerta hay que revisarlo igual que lo que entra por la principal.

> 🌎 **Otro ejemplo:** Es como un formulario que alguien llenó por ti y te lo pone delante para que firmes: lo tienes que leer antes.

Un **deep link** abre tu app en una pantalla con datos: `miapp://pagar?a=juan&monto=50`. Muy útil (un mensaje que abre el detalle de un viaje). El problema: **cualquier** página web, mensaje o app puede abrir ese enlace. Si la pantalla de pagar **paga sola** al abrirse, un atacante manda `miapp://pagar?a=atacante&monto=5000` por WhatsApp.

**La defensa:**
1. Un deep link **nunca hace algo importante solo**: abre la pantalla con los datos **para que la persona confirme**.
2. **Revisar cada dato** que llega: solo las pantallas que existen, montos con límites, ids que pertenecen a la persona (el IDOR de la clase 23 también entra por aquí).
3. Preferir los **Universal Links** (iPhone) y **App Links** (Android): enlaces `https://tu-dominio.com/…` que el sistema solo entrega a **tu** app, porque tu dominio lo certifica. Un esquema propio (`miapp://`) lo puede reclamar **otra** app instalada.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar lo que trae un deep link
lenguaje: js
pide: Completa `abrirEnlace(texto)`. Léelo con `new URL` (si falla, `{ pantalla: 'inicio' }`). Solo se aceptan las pantallas de `PANTALLAS` (el `hostname` del enlace). Para `pagar`, el monto (`searchParams.get('monto')`) tiene que ser un número mayor que 0 y como mucho 500, y **siempre** se devuelve con `confirmar: true` (nunca se paga solo). Cualquier otra cosa: `{ pantalla: 'inicio' }`.
--- código
const PANTALLAS = ['viaje', 'pagar'];

function abrirEnlace(texto) {
  const url = new URL(texto);
  return { pantalla: url.hostname, ...Object.fromEntries(url.searchParams) }; // ✗ acepta todo, y paga solo
}
--- pruebas
prueba('abrir un viaje', () => igual(abrirEnlace('miapp://viaje?id=12'), { pantalla: 'viaje', id: '12' }));
prueba('pagar pide confirmar', () => igual(abrirEnlace('miapp://pagar?a=juan&monto=50'), { pantalla: 'pagar', a: 'juan', monto: 50, confirmar: true }));
prueba('un monto enorme: no', () => igual(abrirEnlace('miapp://pagar?a=atacante&monto=5000'), { pantalla: 'inicio' }));
prueba('un monto que no es número: no', () => igual(abrirEnlace('miapp://pagar?a=x&monto=mucho'), { pantalla: 'inicio' }));
prueba('una pantalla que no existe: no', () => igual(abrirEnlace('miapp://borrar-cuenta'), { pantalla: 'inicio' }));
prueba('basura: al inicio', () => igual(abrirEnlace('no es un enlace'), { pantalla: 'inicio' }));
--- solución
const PANTALLAS = ['viaje', 'pagar'];

function abrirEnlace(texto) {
  let url;
  try {
    url = new URL(texto);
  } catch {
    return { pantalla: 'inicio' };
  }
  const pantalla = url.hostname;
  if (!PANTALLAS.includes(pantalla)) return { pantalla: 'inicio' };
  if (pantalla === 'viaje') return { pantalla, id: url.searchParams.get('id') };
  const monto = Number(url.searchParams.get('monto'));
  if (!(monto > 0 && monto <= 500)) return { pantalla: 'inicio' };
  return { pantalla, a: url.searchParams.get('a'), monto, confirmar: true };
}
```

```practica
vf :: Cualquier página web, mensaje o app puede abrir un deep link de tu app con los datos que quiera
vf :: Un esquema propio como miapp:// es tan seguro como un Universal Link, porque solo tu app lo usa
elige :: Un deep link de pagar llega con un monto. ¿Qué hace la app? :: Paga enseguida :: Abre la pantalla de pagar con los datos, para que la persona confirme :: Ignora el enlace
escribe :: ¿Qué ataque de la clase 23 también puede entrar por un deep link, y cómo se frena? :: El IDOR: un enlace con el id de algo de otra persona (miapp://viaje?id=999). Se frena en el servidor, que revisa que ese id sea de quien lo pide, igual que en la web.
```

## Parte 4. Lo que la app hace mientras corre: MobSF y Frida

> 🌎 **En la vida real:** el portero que revisa tu entrada lo hace en **tu** puerta, la de afuera; si el control estuviera adentro de tu bolso, lo podrías apagar antes de llegar.

> 🌎 **Otro ejemplo:** Es como un examen donde el alumno corrige su propia hoja: puede poner la nota que quiera.

**Dos programas más** (gratis, de código abierto):

- **MobSF** (*Mobile Security Framework*): le das tu APK o IPA y te devuelve un **informe**: permisos que pide, claves que aparecen, configuraciones peligrosas (como permitir conexiones sin HTTPS), y una nota. El defensor lo corre **antes de cada publicación**, como el `npm audit` de las apps.
- **Frida**: se "mete" en una app **mientras corre** y cambia lo que hace una función. Por ejemplo, que `esPremium()` devuelva siempre `true`, o que `estaRooteado()` devuelva siempre `false`. Los investigadores la usan para entender apps; un atacante, para **saltarse controles que están en la app**.

**Lo que enseña Frida:** cualquier control que esté **solo en la app** se puede apagar. "Es premium", "tiene saldo", "puede ver esto": eso lo decide **el servidor**, en cada pedido. Es lo mismo que "validar en el cliente no es seguridad" de la clase 22, pero en el teléfono.

**Los permisos.** Cada permiso (cámara, ubicación, contactos, micrófono) es una puerta más. Pide **solo** los que la app usa, **cuando** los usa (la cámara, al tocar "sacar foto", no al abrir la app), y explica para qué. MobSF te muestra los que pide tu app: si hay alguno que no reconoces, suele venir de una librería que agregaste.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los permisos de más, como en el informe de MobSF
lenguaje: js
pide: El informe de MobSF trae la lista de permisos que pide tu app. Completa `permisosDeMas(pide, usa)`: los que **pide** pero **no usa**, en el orden en que aparecen. Después `revisarInforme(pide, usa)`: `{ nota: 'bien' }` si no hay de más; `{ nota: 'revisar', sobran: [...] }` si sobran; y si entre los que sobran hay alguno de `PELIGROSOS`, la nota es `'grave'`.
--- código
const PELIGROSOS = ['READ_CONTACTS', 'RECORD_AUDIO', 'READ_SMS', 'ACCESS_FINE_LOCATION'];

function permisosDeMas(pide, usa) {
  return []; // tu código aquí
}

function revisarInforme(pide, usa) {
  return { nota: 'bien' }; // tu código aquí
}
--- pruebas
const usa = ['INTERNET', 'CAMERA'];
prueba('sin permisos de más', () => igual(revisarInforme(['INTERNET', 'CAMERA'], usa), { nota: 'bien' }));
prueba('los de más', () => igual(permisosDeMas(['INTERNET', 'CAMERA', 'VIBRATE', 'READ_CONTACTS'], usa), ['VIBRATE', 'READ_CONTACTS']));
prueba('de más, pero no peligroso', () => igual(revisarInforme(['INTERNET', 'VIBRATE'], usa), { nota: 'revisar', sobran: ['VIBRATE'] }));
prueba('de más y peligroso: grave', () => igual(revisarInforme(['INTERNET', 'RECORD_AUDIO'], usa), { nota: 'grave', sobran: ['RECORD_AUDIO'] }));
--- solución
const PELIGROSOS = ['READ_CONTACTS', 'RECORD_AUDIO', 'READ_SMS', 'ACCESS_FINE_LOCATION'];

function permisosDeMas(pide, usa) {
  return pide.filter((p) => !usa.includes(p));
}

function revisarInforme(pide, usa) {
  const sobran = permisosDeMas(pide, usa);
  if (sobran.length === 0) return { nota: 'bien' };
  const grave = sobran.some((p) => PELIGROSOS.includes(p));
  return { nota: grave ? 'grave' : 'revisar', sobran };
}
```

```practica
vf :: Con Frida se puede cambiar lo que hace una función de la app mientras corre, por ejemplo que esPremium() devuelva siempre true
vf :: Detectar si el teléfono tiene root y no dejar abrir la app hace que la app sea segura
elige :: ¿Para qué usa MobSF un defensor? :: Para hackear apps ajenas :: Para revisar su propia app antes de publicarla: permisos, claves y configuraciones peligrosas :: Para hacer la app más rápida
escribe :: MobSF muestra que tu app pide READ_CONTACTS y tú nunca usaste los contactos. ¿Qué haces? :: Busco de dónde viene (suele ser una librería que agregué), lo saco si no hace falta, y si una librería lo necesita, evalúo si vale la pena. Un permiso peligroso que no se usa es una puerta abierta sin motivo.
```


**Comprobación antes de seguir**

Haz un inventario del almacenamiento de tu app con datos ficticios.

<details>
<summary>Necesito una pista</summary>

Para cada dato, indica qué función necesita conservarlo y qué protección le corresponde.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué miras en la seguridad de una app móvil?":** "Parto de que la app está en manos del atacante: el APK o el IPA se abren como un ZIP, y con jadx se lee el código, así que nada secreto va en la app; lo secreto va en el servidor. Lo sensible que guarda el teléfono va en la Keychain o el Keystore, con expo-secure-store, y lo demás, lo menos posible. Los deep links los puede abrir cualquiera: reviso cada dato, nada importante pasa sin confirmar, y prefiero Universal Links y App Links. Con Frida se apaga cualquier control que esté solo en la app, así que lo importante lo decide el servidor. Y antes de publicar, paso la app por MobSF para ver permisos de más y claves que se escaparon. La referencia es OWASP MASVS."

> 🌎 **En la vida real:** es como el fabricante de una caja fuerte que sabe que el comprador se la lleva a su casa y la puede abrir con herramientas: por eso no guarda el dinero adentro de la caja, sino en el banco.

> 🌎 **Otro ejemplo:** Es como un museo que presta una pieza: sabe que va a estar en manos de otros, y decide qué presta y qué no.
