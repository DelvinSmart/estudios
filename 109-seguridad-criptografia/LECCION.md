# Seguridad 6: criptografía para programadores

> 🌎 **En la vida real:** hay tres cosas que la gente confunde: una **huella digital** (te identifica, pero no se puede "volver" de la huella a la persona), una **caja fuerte** (guardas algo y lo sacas con la llave) y una **firma** (cualquiera la ve, pero solo tú la puedes hacer). En criptografía son tres herramientas distintas, y usar una por otra es de los errores más comunes.

> 🎙️ **El profesor dice:** {{alumno}}, no vas a inventar criptografía (nadie debería: se usan las librerías que ya existen). Pero tienes que saber **qué herramienta usar para qué**, leer un JWT, entender por qué un token se roba, y no caer en las trampas clásicas: `alg: none`, `Math.random()` para secretos, y comparar contraseñas con `===`. Todo con ejemplos de código que puedes probar.

## Parte 1. Hash, cifrado, firma… y lo que no es ninguno

> 🌎 **En la vida real:** escribir un mensaje en otro idioma no es esconderlo: cualquiera que hable ese idioma lo lee. Eso es base64: otro "idioma" para los mismos datos.

> 🌎 **Otro ejemplo:** Es como meter una carta en un sobre transparente: parece guardada, pero se lee a través.

| Herramienta | Qué hace | ¿Se puede volver atrás? | Se usa para |
|---|---|---|---|
| **Hash** (SHA-256, bcrypt, argon2) | Saca una huella de largo fijo | **No** | Guardar contraseñas (con sal y un hash lento, clase 22), comprobar que un archivo no cambió (SRI, clase 108) |
| **Cifrado** (AES, el de HTTPS) | Esconde datos con una llave | **Sí, con la llave** | Guardar o mandar algo que hay que volver a leer |
| **Firma** (HMAC, RSA, Ed25519) | Prueba **quién** hizo algo y que **no cambió** | No esconde nada: **cualquiera lo lee** | Tokens de sesión (JWT), actualizaciones de apps |
| **Codificación** (base64, URL) | Cambia la forma de escribir los datos | **Sí, sin llave** | Pasar datos por lugares que solo aceptan texto. **No es seguridad** |

El error más común en la vida real: "lo guardé en **base64**, así que está protegido". No: base64 se lee con una línea de código (`atob`), sin ninguna llave. Si ves una "contraseña" en base64 en un archivo de configuración, está **a la vista**.

Y el segundo: guardar contraseñas **cifradas** (con una llave) en vez de con un **hash**. Si roban la base de datos **y** la llave (que suele estar en el mismo servidor), tienen todas las contraseñas. Con un hash lento con sal, no hay llave que robar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Base64 no es un candado
lenguaje: js
pide: Encontraste en un archivo de configuración `clave = "c2VjcmV0bzEyMw=="`. Completa `leerBase64(texto)`, que la "abre" con `atob` (sin ninguna llave). Después `queUsar(caso)`, que dice qué herramienta va para cada caso: `'guardar contraseñas'` → `'hash'`; `'mandar un mensaje privado'` → `'cifrado'`; `'probar quién hizo el token'` → `'firma'`; cualquier otro → `'no sé'`.
--- código
function leerBase64(texto) {
  return ''; // tu código aquí
}

function queUsar(caso) {
  return 'no sé'; // tu código aquí
}
--- pruebas
prueba('base64 se lee sin llave', () => igual(leerBase64('c2VjcmV0bzEyMw=='), 'secreto123'));
prueba('otra', () => igual(leerBase64('YWRtaW46YWRtaW4='), 'admin:admin'));
prueba('contraseñas: hash', () => igual(queUsar('guardar contraseñas'), 'hash'));
prueba('un mensaje privado: cifrado', () => igual(queUsar('mandar un mensaje privado'), 'cifrado'));
prueba('quién hizo el token: firma', () => igual(queUsar('probar quién hizo el token'), 'firma'));
--- solución
function leerBase64(texto) {
  return atob(texto);
}

function queUsar(caso) {
  const herramientas = {
    'guardar contraseñas': 'hash',
    'mandar un mensaje privado': 'cifrado',
    'probar quién hizo el token': 'firma',
  };
  return herramientas[caso] ?? 'no sé';
}
```

```practica
vf :: Un hash no se puede "volver atrás": de la huella no se saca el dato original
vf :: Guardar una contraseña en base64 la protege, porque no se lee a simple vista
elige :: ¿Qué conviene para guardar las contraseñas de los usuarios? :: Cifrarlas con AES :: Un hash lento con sal (bcrypt, argon2) :: Base64
escribe :: ¿Cuál es la diferencia entre cifrar y firmar? :: Cifrar esconde los datos, y se vuelven a leer con la llave. Firmar no esconde nada (cualquiera lo lee), pero prueba quién lo hizo y que no cambió.
```

## Parte 2. Un JWT por dentro

> 🌎 **En la vida real:** una pulsera de un festival: dice tu nombre y hasta qué día puedes entrar, a la vista de todos. Lo que impide que te hagas una falsa es el **sello** que solo la organización sabe poner.

> 🌎 **Otro ejemplo:** Es como un pase de abordar: el guardia lee tu nombre y tu vuelo; el código de barras prueba que lo emitió la aerolínea.

Un **JWT** (*JSON Web Token*) es el "pase" que muchas apps te dan al entrar (Firebase Auth usa uno). Tiene **tres partes** separadas por puntos:

```text
eyJhbGciOiJIUzI1NiJ9 . eyJzdWIiOiJhbmEiLCJleHAiOjE4MDAwMDAwMDB9 . 4pZ…firma…
       cabecera                     datos (el "payload")                 firma
```

- **Cabecera:** con qué algoritmo se firmó (`{"alg":"HS256"}`).
- **Datos:** quién eres y hasta cuándo vale (`{"sub":"ana","exp":1800000000}`). `exp` es la fecha de vencimiento en segundos.
- **Firma:** la prueba de que lo hizo el servidor y nadie lo cambió.

**Lo más importante:** las dos primeras partes son **base64url** (parte 1): **cualquiera las lee**. Un JWT **no es secreto**. Nunca pongas adentro algo que no puede ver el usuario (una contraseña, datos de otra persona). Lo que lo hace confiable es **la firma**, y la firma **se revisa en el servidor**, en cada pedido.

> 📌 **Nota:** base64**url** es base64 con dos cambios para que viaje en una URL: `-` en vez de `+`, `_` en vez de `/`, y sin los `=` del final.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer un JWT sin ninguna llave
lenguaje: js
pide: Completa `leerDatos(jwt)`: toma la **segunda** parte (`split('.')[1]`), pásala de base64url a base64 (cambia `-` por `+` y `_` por `/`), léela con `atob` y conviértela con `JSON.parse`. Después `vencido(datos, ahora)`: `true` si `datos.exp` (en segundos) es menor o igual que `ahora` (en segundos), o si no hay `exp`.
--- código
function leerDatos(jwt) {
  return {}; // tu código aquí
}

function vencido(datos, ahora) {
  return false; // tu código aquí
}
--- pruebas
const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmEiLCJyb2wiOiJhbHVtbm8iLCJleHAiOjE4MDAwMDAwMDB9.ZmlybWE';
prueba('cualquiera lee los datos', () => igual(leerDatos(jwt), { sub: 'ana', rol: 'alumno', exp: 1800000000 }));
prueba('todavía vale', () => igual(vencido({ exp: 1800000000 }, 1700000000), false));
prueba('vencido', () => igual(vencido({ exp: 1800000000 }, 1800000001), true));
prueba('sin fecha de vencimiento: no se acepta', () => igual(vencido({ sub: 'ana' }, 1700000000), true));
--- solución
function leerDatos(jwt) {
  const parte = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(parte));
}

function vencido(datos, ahora) {
  if (typeof datos.exp !== 'number') return true;
  return datos.exp <= ahora;
}
```

```practica
vf :: Cualquiera que tenga un JWT puede leer sus datos, sin ninguna llave
vf :: Un JWT es un buen lugar para guardar información secreta del usuario, porque está firmado
elige :: ¿Dónde se revisa la firma de un JWT? :: En la app, al recibirlo :: En el servidor, en cada pedido :: No hace falta revisarla
escribe :: Un compañero dice "le pongo rol: admin al token y ya puedo entrar al panel". ¿Por qué no funciona si el servidor está bien hecho? :: Porque al cambiar los datos, la firma deja de coincidir, y el servidor revisa la firma en cada pedido y rechaza el token. Sin la llave del servidor no se puede hacer una firma nueva válida.
```

## Parte 3. El ataque de alg: none

> 🌎 **En la vida real:** un guardia que lee en la pulsera "este pase no necesita sello" y te deja pasar. El problema no es la pulsera: es que el guardia le cree a lo que dice la pulsera sobre cómo revisarla.

> 🌎 **Otro ejemplo:** Es como un cajero que acepta un cheque porque el cheque dice "este cheque no necesita firma".

La cabecera dice con qué algoritmo se firmó el token. Algunas librerías viejas **le creían a la cabecera**. Y el estándar tiene un algoritmo especial: **`none`** ("sin firma"). El ataque, que funcionó en sistemas reales:

1. Tomar un token propio y leer los datos (parte 2).
2. Cambiar `"rol":"alumno"` por `"rol":"admin"`.
3. Cambiar la cabecera a `{"alg":"none"}` y **borrar la firma**.
4. El servidor lee "alg: none", no revisa ninguna firma… y te deja entrar como admin.

Hay un primo de este ataque: la **confusión de algoritmos** (cambiar `RS256`, con llave pública y privada, por `HS256`, y firmar con la llave **pública**, que es pública).

**La defensa:** el servidor **decide** qué algoritmo acepta. **No** lo lee del token. Si el token dice otro algoritmo, se rechaza antes de mirar nada más.

```js
// Con la librería jose (Node):
const { payload } = await jwtVerify(token, llave, { algorithms: ['HS256'] });   // solo este, siempre
```

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El servidor decide el algoritmo
lenguaje: js
pide: Completa `aceptar(cabecera, firmaValida)`. `cabecera` es el objeto de la primera parte del token (como `{ alg: 'HS256' }`) y `firmaValida` dice si la firma coincide. El servidor solo acepta `ALGORITMO` (`'HS256'`): si la cabecera dice **otro** (incluido `'none'`, en cualquier mayúscula), se rechaza **sin mirar la firma**. Si es el correcto, se acepta solo si la firma es válida.
--- código
const ALGORITMO = 'HS256';

function aceptar(cabecera, firmaValida) {
  if (cabecera.alg === 'none') return true; // ✗ le cree a la cabecera
  return firmaValida;
}
--- pruebas
prueba('el algoritmo correcto, con firma válida', () => igual(aceptar({ alg: 'HS256' }, true), true));
prueba('el correcto, con firma mala', () => igual(aceptar({ alg: 'HS256' }, false), false));
prueba('alg: none, rechazado', () => igual(aceptar({ alg: 'none' }, false), false));
prueba('NoNe en otra mayúscula, también', () => igual(aceptar({ alg: 'NoNe' }, true), false));
prueba('confusión: RS256 cuando se espera HS256', () => igual(aceptar({ alg: 'RS256' }, true), false));
prueba('sin alg', () => igual(aceptar({}, true), false));
--- solución
const ALGORITMO = 'HS256';

function aceptar(cabecera, firmaValida) {
  if (cabecera.alg !== ALGORITMO) return false;
  return firmaValida === true;
}
```

```practica
vf :: En el ataque de alg: none, el atacante borra la firma y el servidor que le cree a la cabecera no revisa nada
vf :: Si la librería es conocida, no hace falta decirle qué algoritmo aceptar
elige :: ¿Qué hace el servidor si el token dice un algoritmo distinto del que espera? :: Prueba con ese algoritmo :: Lo rechaza antes de mirar la firma :: Lo acepta si la firma parece bien
escribe :: Explica el ataque de alg: none en tres pasos. :: 1) Se toma un token propio y se leen sus datos. 2) Se cambia un dato (rol: admin) y la cabecera a alg: none, y se borra la firma. 3) Un servidor que le cree a la cabecera no revisa ninguna firma y acepta el token falso.
```

## Parte 4. Dónde guardar el token: la cookie bien hecha

> 🌎 **En la vida real:** una tarjeta de hotel que la puerta lee sola cuando te acercas, pero que está sellada: sirve para entrar sin que tú hagas nada, y a la vez nadie puede copiar el número que lleva dentro. Así es una cookie con HttpOnly: viaja sola en cada pedido, pero el JavaScript de la página no la puede leer.

> 🌎 **Otro ejemplo:** Es como guardar el pasaporte en la mochila abierta o en el bolsillo interior con cierre.

Después de entrar, la app tiene un token. ¿Dónde lo guarda en el navegador?

| Dónde | Lo puede leer JavaScript | Si hay un XSS (clase 23) |
|---|---|---|
| `localStorage` | Sí | El script del atacante **lo lee y se lo lleva**: entra como tú desde su casa |
| Cookie común | Sí (`document.cookie`) | Igual |
| Cookie **`HttpOnly`** | **No** | El script no la ve. El navegador la manda sola al servidor |

La cookie bien hecha lleva **cuatro marcas**:

```text
Set-Cookie: sesion=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```

- **`HttpOnly`**: JavaScript no la puede leer. Un XSS ya no **roba** la sesión (todavía puede hacer cosas mientras estás en la página, por eso el XSS se cierra igual: clase 23).
- **`Secure`**: solo viaja por HTTPS (clase 22, parte 6).
- **`SameSite=Lax`**: no viaja en pedidos que **otro sitio** dispara **por debajo** (un formulario o una imagen hacia tu API), aunque sí viaja si la persona **llega a tu página con un enlace normal**. Es la defensa moderna contra el **CSRF** (clase 23, parte 6). `SameSite=Strict` es aún más estricto: tampoco viaja al llegar por un enlace.
- **`Max-Age`**: vence sola. Una sesión que no vence nunca es un regalo para quien la robe.

> 📌 **Nota:** apps como esta usan Firebase Auth, que maneja sus propios tokens: no los escribes tú. Pero cuando hagas tu propio servidor (clase 87), esta es la forma.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Armar la cookie de sesión
lenguaje: js
pide: Completa `cookieDeSesion(token, segundos)`: devuelve el texto del encabezado `Set-Cookie` con este orden exacto: `sesion=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=<segundos>`. Y `revisarCookie(texto)`: devuelve la lista de lo que **le falta** de estas marcas, en este orden: `'HttpOnly'`, `'Secure'`, `'SameSite'`, `'Max-Age'`.
--- código
function cookieDeSesion(token, segundos) {
  return `sesion=${token}`; // ✗ le faltan todas las marcas
}

function revisarCookie(texto) {
  return []; // tu código aquí
}
--- pruebas
prueba('la cookie bien hecha', () => igual(cookieDeSesion('abc123', 3600), 'sesion=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600'));
prueba('la tuya no tiene faltas', () => igual(revisarCookie(cookieDeSesion('x', 60)), []));
prueba('una cookie común: le falta todo', () => igual(revisarCookie('sesion=abc123; Path=/'), ['HttpOnly', 'Secure', 'SameSite', 'Max-Age']));
prueba('le falta HttpOnly', () => igual(revisarCookie('sesion=abc; Secure; SameSite=Strict; Max-Age=60'), ['HttpOnly']));
--- solución
function cookieDeSesion(token, segundos) {
  return `sesion=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${segundos}`;
}

function revisarCookie(texto) {
  const partes = texto.split(';').map((p) => p.trim().split('=')[0].toLowerCase());
  return ['HttpOnly', 'Secure', 'SameSite', 'Max-Age'].filter((m) => !partes.includes(m.toLowerCase()));
}
```

```practica
vf :: Una cookie HttpOnly no la puede leer JavaScript, así que un XSS no la puede robar
vf :: Guardar el token de sesión en localStorage es tan seguro como una cookie HttpOnly
elige :: ¿Para qué sirve SameSite=Lax? :: Para que la cookie dure más :: Para que no viaje en pedidos que dispara otro sitio (defensa contra CSRF) :: Para cifrar la cookie
escribe :: ¿Por qué una sesión debería vencer (Max-Age)? :: Porque si alguien roba el token, solo le sirve hasta que vence. Una sesión que no vence nunca le da acceso para siempre.
```

## Parte 5. Dos trampas: Math.random() y comparar con ===

> 🌎 **En la vida real:** un candado de combinación con un número que se puede adivinar porque siempre sale parecido, y un guardia que tarda un segundo más cuando el primer número que dices es el correcto: con paciencia, cualquiera abre.

> 🌎 **Otro ejemplo:** Es como el juego de adivinar una palabra donde el otro sonríe un poquito cuando aciertas una letra.

**1. `Math.random()` no es para secretos.** Sirve para juegos y animaciones. Sus números salen de una fórmula: con algunos resultados se pueden **predecir** los siguientes. Para un token, un código de verificación o un enlace de "recuperar contraseña", se usa el generador **criptográfico**:

```js
const bytes = crypto.getRandomValues(new Uint8Array(16));   // 16 bytes que no se pueden predecir
const token = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');   // 32 letras hex
// En Node: crypto.randomBytes(16).toString('hex')
```

**2. Comparar un secreto con `===` puede filtrar información por el tiempo.** `===` sobre textos para **en la primera letra distinta**. Si el atacante mide cuánto tarda el servidor en decir "no", puede adivinar el secreto **letra por letra**: la respuesta tarda un poquito más cuando acierta la primera. Es un **ataque de tiempo** (*timing attack*). Para comparar firmas, tokens o códigos se usa una comparación de **tiempo constante**, que siempre recorre todo:

```js
import { timingSafeEqual } from 'node:crypto';
timingSafeEqual(Buffer.from(recibido), Buffer.from(esperado));   // tarda lo mismo, acierte o no
```

> 💡 **Idea:** para las contraseñas no hace falta: no se comparan las contraseñas, se comparan sus hashes, y las librerías (bcrypt, argon2) ya lo hacen bien. Esto es para cuando comparas a mano un token o una firma.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un token que no se adivina y una comparación pareja
lenguaje: js
pide: Completa `tokenSeguro()`: 16 bytes de `crypto.getRandomValues(new Uint8Array(16))`, cada uno en hexadecimal de 2 letras (`b.toString(16).padStart(2, '0')`), todo junto: 32 letras. Después `igualesTiempoConstante(a, b)`: si los largos son distintos, `false`. Si no, recorre **todas** las letras acumulando las diferencias con `diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i)` (sin cortar antes), y devuelve `diferencia === 0`.
--- código
function tokenSeguro() {
  return Math.random().toString(16).slice(2); // ✗ se puede predecir
}

function igualesTiempoConstante(a, b) {
  return a === b; // ✗ corta en la primera letra distinta
}
--- pruebas
prueba('32 letras hexadecimales', () => ok(/^[0-9a-f]{32}$/.test(tokenSeguro()), 'tienen que ser 32 letras de 0-9 y a-f'));
prueba('dos tokens no se repiten', () => ok(tokenSeguro() !== tokenSeguro(), 'salieron iguales'));
prueba('iguales', () => igual(igualesTiempoConstante('a7f3c9', 'a7f3c9'), true));
prueba('distintos al final', () => igual(igualesTiempoConstante('a7f3c9', 'a7f3c8'), false));
prueba('distintos al principio', () => igual(igualesTiempoConstante('b7f3c9', 'a7f3c9'), false));
prueba('otro largo', () => igual(igualesTiempoConstante('a7f3', 'a7f3c9'), false));
prueba('no usa === sobre los textos', () => ok(!/a\s*===\s*b/.test(igualesTiempoConstante.toString()), 'compara letra por letra, sin cortar antes'));
--- solución
function tokenSeguro() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function igualesTiempoConstante(a, b) {
  if (a.length !== b.length) return false;
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) {
    diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferencia === 0;
}
```

```practica
vf :: Math.random() no sirve para generar tokens o códigos secretos, porque sus números se pueden predecir
vf :: Comparar dos tokens con === es siempre seguro, porque da true o false
elige :: ¿Qué hace una comparación de tiempo constante? :: Compara más rápido :: Recorre todas las letras siempre, acierte o no, para no dejar pistas en el tiempo :: Cifra los dos textos
escribe :: ¿Por qué no hace falta comparar en tiempo constante las contraseñas a mano? :: Porque no se comparan las contraseñas, sino sus hashes, y las librerías de hash para contraseñas (bcrypt, argon2) ya hacen la comparación bien.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué sabes de criptografía?":** "Lo que necesita un programador: no inventarla, y usar cada herramienta para lo suyo. Hash lento con sal para contraseñas, cifrado para lo que hay que volver a leer, firma para probar quién hizo algo; y que base64 no protege nada. Un JWT se lee sin llave, así que no lleva secretos, y la firma se revisa en el servidor con el algoritmo fijo, para que no pase el ataque de alg: none. El token de sesión va en una cookie HttpOnly, Secure, SameSite y con vencimiento. Y dos trampas: Math.random() no sirve para secretos, y los tokens se comparan en tiempo constante."

> 🌎 **En la vida real:** es como un cerrajero que no fabrica sus propios candados, pero sabe cuál va en cada puerta y cómo se abren los malos.

> 🌎 **Otro ejemplo:** Es como un médico que no fabrica medicamentos, pero sabe cuál recetar, en qué dosis, y cuáles no se mezclan.
