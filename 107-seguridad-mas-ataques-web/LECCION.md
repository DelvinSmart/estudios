# Seguridad 4: más ataques web, del lado del defensor

> 🌎 **En la vida real:** un edificio con buena cerradura en la puerta principal todavía puede tener una ventana del sótano abierta, un portero que deja pasar a cualquiera que diga "vengo de parte del dueño", o un buzón donde cabe un paquete con cualquier cosa. Hoy, esas otras puertas.

> 🎙️ **El profesor dice:** {{alumno}}, en las clases 22 a 24 viste las puertas más famosas: contraseñas, IDOR, inyección SQL, XSS, CSRF. Hoy, cuatro que aparecen en cualquier auditoría y que el curso todavía no tenía: **leer archivos que no son tuyos** (*path traversal*), **hacer que el servidor pida cosas por ti** (SSRF), **redirecciones que llevan a otro sitio**, y **archivos subidos con sorpresa**. Siempre del lado del defensor: cómo se ve el ataque, por qué funciona y cómo se cierra, con código.

> ⚠️ **Antes de empezar:** todo esto se practica **solo en lo tuyo o con permiso por escrito** (clase 22, parte 0). Los ejercicios de esta clase son el código que **defiende**.

## Parte 1. Path traversal: salir de la carpeta

> 🌎 **En la vida real:** le pides al archivista "la carpeta 12 del cajón de facturas", y él la busca ahí. Pero si le dices "la carpeta ../../caja-fuerte/contraseñas", y él solo sigue el camino sin pensar, termina abriendo la caja fuerte.

> 🌎 **Otro ejemplo:** Es como un ascensor que te deja escribir el piso: si escribes "-3", y nadie revisó, te lleva al sótano donde no deberías entrar.

Una API sirve archivos de una carpeta: `GET /archivos?nombre=recibo-12.pdf` devuelve `subidas/recibo-12.pdf`. El código ingenuo:

```js
const ruta = 'subidas/' + req.query.nombre;   // ✗
res.sendFile(ruta);
```

El atacante pide `nombre=../../.env`. La ruta queda `subidas/../../.env`: **dos carpetas para arriba**, y el servidor manda el archivo de secretos. Variantes que se ven en la realidad:

| Lo que manda | Por qué funciona |
|---|---|
| `../../.env` | `..` sube una carpeta |
| `%2e%2e%2f.env` | lo mismo, codificado para la URL: si se decodifica **después** de revisar, pasa |
| `/etc/passwd` | una ruta absoluta ignora la carpeta base |
| `....//.env` | si el "filtro" solo borra `../` una vez, queda `../` |

**La defensa no es borrar los `..`** (siempre aparece una variante). Es: **calcular la ruta final y comprobar que sigue adentro de la carpeta permitida**.

```js
import path from 'node:path';
const BASE = path.resolve('subidas');
const final = path.resolve(BASE, req.query.nombre);          // la ruta real, con los .. ya resueltos
if (!final.startsWith(BASE + path.sep)) return res.status(400).end();  // si salió de la carpeta: no
res.sendFile(final);
```

Y mejor todavía: **no aceptar nombres de archivo** del usuario. Guardar los archivos con un id propio (`a7f3…`) y buscar el id en la base de datos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿La ruta se queda en la carpeta?
lenguaje: js
pide: Completa `rutaSegura(pedido)`. Primero decodifica el pedido (`decodeURIComponent`). Si empieza con `/`, devuelve `null`. Después recorre las partes separadas por `/`: ignora las vacías y los `.`; con `..` saca la última parte, pero si no hay ninguna para sacar (se estaría saliendo de la carpeta), devuelve `null`. Al final devuelve `'subidas/'` + las partes unidas con `/`.
--- código
function rutaSegura(pedido) {
  // tu código aquí
}
--- pruebas
prueba('un archivo normal', () => igual(rutaSegura('recibo-12.pdf'), 'subidas/recibo-12.pdf'));
prueba('una subcarpeta', () => igual(rutaSegura('2026/noviembre/recibo.pdf'), 'subidas/2026/noviembre/recibo.pdf'));
prueba('un .. que se queda adentro', () => igual(rutaSegura('2026/../recibo.pdf'), 'subidas/recibo.pdf'));
prueba('salir de la carpeta: no', () => igual(rutaSegura('../../.env'), null));
prueba('codificado para la URL: tampoco', () => igual(rutaSegura('%2e%2e%2f.env'), null));
prueba('una ruta absoluta: no', () => igual(rutaSegura('/etc/passwd'), null));
prueba('subir más de lo que se bajó: no', () => igual(rutaSegura('a/../../.env'), null));
--- solución
function rutaSegura(pedido) {
  const limpio = decodeURIComponent(pedido);
  if (limpio.startsWith('/')) return null;
  const partes = [];
  for (const p of limpio.split('/')) {
    if (p === '' || p === '.') continue;
    if (p === '..') {
      if (partes.length === 0) return null;
      partes.pop();
    } else {
      partes.push(p);
    }
  }
  return 'subidas/' + partes.join('/');
}
```

```practica
vf :: La defensa contra path traversal es calcular la ruta final y comprobar que sigue adentro de la carpeta permitida
vf :: Si el código borra todos los "../" del pedido, ya no se puede salir de la carpeta
elige :: ¿Qué es lo más seguro para servir archivos que subieron los usuarios? :: Aceptar el nombre que manda el usuario :: Guardarlos con un id propio y buscarlo en la base de datos :: Borrar los puntos del nombre
escribe :: ¿Qué archivo intentaría leer primero un atacante con path traversal en una API de Node, y por qué? :: El .env, porque ahí suelen estar las claves y secretos (de la base de datos, de servicios de pago). Con eso puede entrar a todo lo demás.
```

## Parte 2. SSRF: que el servidor pida cosas por ti

> 🌎 **En la vida real:** en una oficina, el mensajero tiene una credencial que abre todas las puertas internas. Si cualquiera de afuera le puede decir "trae lo que hay en la oficina del gerente" y él va sin preguntar, la credencial la está usando un extraño.

> 🌎 **Otro ejemplo:** Es como pedirle al conserje del hotel que suba "a buscar un paquete al cuarto 304": él tiene la llave maestra; tú no.

Muchas apps dejan pegar una URL para que **el servidor** la busque: "importar foto desde un enlace", "vista previa del link", "webhook". El servidor está **adentro**: puede llegar a lugares que desde internet no se ven.

```js
const respuesta = await fetch(req.body.url);   // ✗ el servidor va a donde le digan
```

Lo que pide el atacante:

| URL | Qué hay ahí |
|---|---|
| `http://localhost:8080/admin` | el panel interno, que "no hace falta proteger porque no está en internet" |
| `http://169.254.169.254/latest/meta-data/` | en muchas nubes, el servicio que da **las credenciales del servidor** |
| `http://10.0.0.5:5432` | la base de datos de la red interna |
| `file:///etc/passwd` | un archivo del servidor |

Eso es **SSRF** (*Server-Side Request Forgery*). Fue la puerta de varias filtraciones grandes: el servidor tenía permisos en la nube, y el atacante los usó a través de él.

**La defensa, en capas:**
1. **Lista de permitidos**, no de prohibidos: solo `https`, y solo los dominios que de verdad hacen falta.
2. Si la URL es libre (una vista previa de cualquier link): rechazar direcciones **privadas** y **locales** (`localhost`, `127.x`, `10.x`, `172.16.x` a `172.31.x`, `192.168.x`, `169.254.x`, y sus equivalentes en IPv6 como `::1`), y revisarlo **después** de resolver el nombre (un dominio puede apuntar a `127.0.0.1`).
3. **Sin redirecciones automáticas** (un sitio permitido puede redirigir a uno interno).
4. Que el servidor que busca URLs **no tenga permisos** que no necesita.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una lista de permitidos para las URL
lenguaje: js
pide: Completa `urlPermitida(texto)`. Léela con `new URL(texto)` (si falla, `false`). Solo vale si el protocolo es `'https:'`, no trae usuario ni contraseña (`url.username` y `url.password` vacíos) y el `hostname` está en `PERMITIDOS` **exacto**. Las pruebas traen los trucos más comunes.
--- código
const PERMITIDOS = ['api.mercadopago.com', 'firebasestorage.googleapis.com'];

function urlPermitida(texto) {
  // tu código aquí
}
--- pruebas
prueba('una permitida', () => igual(urlPermitida('https://api.mercadopago.com/v1/pagos'), true));
prueba('http (sin cifrar): no', () => igual(urlPermitida('http://api.mercadopago.com/v1/pagos'), false));
prueba('localhost: no', () => igual(urlPermitida('https://localhost/admin'), false));
prueba('el servicio de credenciales de la nube: no', () => igual(urlPermitida('http://169.254.169.254/latest/meta-data/'), false));
prueba('el truco del @: lo de antes es "usuario", el sitio es otro', () => igual(urlPermitida('https://api.mercadopago.com@evil.com/'), false));
prueba('un dominio que empieza igual: no', () => igual(urlPermitida('https://api.mercadopago.com.evil.com/'), false));
prueba('file: no', () => igual(urlPermitida('file:///etc/passwd'), false));
prueba('basura: no', () => igual(urlPermitida('no es una url'), false));
--- solución
const PERMITIDOS = ['api.mercadopago.com', 'firebasestorage.googleapis.com'];

function urlPermitida(texto) {
  let url;
  try {
    url = new URL(texto);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.username || url.password) return false;
  return PERMITIDOS.includes(url.hostname);
}
```

```practica
vf :: En un SSRF, el atacante usa al servidor para llegar a lugares internos que desde internet no se ven
vf :: Para frenar un SSRF alcanza con prohibir la palabra "localhost"
elige :: En https://api.mercadopago.com@evil.com/, ¿a qué sitio va el pedido? :: api.mercadopago.com :: evil.com: lo que está antes del @ es un nombre de usuario :: A los dos
escribe :: ¿Por qué el servidor que busca URLs de los usuarios no debería tener permisos de más en la nube? :: Porque si alguien logra un SSRF, actúa con los permisos de ese servidor. Con pocos permisos, aunque la puerta se abra, hay poco que robar (defensa en profundidad).
```

## Parte 3. Redirecciones abiertas

> 🌎 **En la vida real:** un cartel oficial del banco que dice "para reclamos, vaya a la oficina que le indique el empleado". Si cualquiera puede ponerse el chaleco de empleado, te manda a donde quiere, y tú vas confiando en el cartel del banco.

> 🌎 **Otro ejemplo:** Es como una carta con el sello de tu municipalidad que dice "pague en esta dirección": el sello da confianza, la dirección la puso otro.

Después de entrar, muchas apps te devuelven a donde estabas: `https://tuapp.com/entrar?volver=/mis-gastos`. Si el código hace `redirect(req.query.volver)` sin mirar, el atacante manda por WhatsApp:

```text
https://tuapp.com/entrar?volver=https://tuapp-login.com/robar
```

La persona ve **tu dominio** en el enlace, entra con su contraseña de verdad… y después tu app la manda a un sitio falso, igual al tuyo, que le pide "la contraseña otra vez" o "los datos de la tarjeta". Es un **phishing con tu firma** (clase 22, parte 4).

**La defensa:** `volver` solo puede ser **una ruta de tu sitio**: empieza con **una** `/` y nada más. Ojo con los trucos:

| `volver=` | Qué pasa |
|---|---|
| `/mis-gastos` | bien: una ruta tuya |
| `https://evil.com` | otro sitio |
| `//evil.com` | **también** otro sitio: el navegador lo lee como "mismo protocolo, otro dominio" |
| `/\evil.com` | algunos navegadores tratan `\` como `/`: queda `//evil.com` |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Volver, pero solo a mi sitio
lenguaje: js
pide: Completa `destinoSeguro(volver)`: devuelve `volver` solo si es una ruta de tu sitio: empieza con `/`, **no** empieza con `//` ni con `/\`, y no tiene `\` en ningún lado. En cualquier otro caso (o si no viene), devuelve `'/'` (la portada). Nunca devuelvas la dirección del atacante.
--- código
function destinoSeguro(volver) {
  // tu código aquí
}
--- pruebas
prueba('una ruta tuya', () => igual(destinoSeguro('/mis-gastos'), '/mis-gastos'));
prueba('con datos', () => igual(destinoSeguro('/gasto?id=12'), '/gasto?id=12'));
prueba('otro sitio', () => igual(destinoSeguro('https://evil.com'), '/'));
prueba('// es otro sitio', () => igual(destinoSeguro('//evil.com'), '/'));
prueba('/\\ también', () => igual(destinoSeguro('/\\evil.com'), '/'));
prueba('javascript: no', () => igual(destinoSeguro('javascript:alert(1)'), '/'));
prueba('sin nada, a la portada', () => igual(destinoSeguro(undefined), '/'));
--- solución
function destinoSeguro(volver) {
  if (typeof volver !== 'string') return '/';
  if (!volver.startsWith('/')) return '/';
  if (volver.startsWith('//')) return '/';
  if (volver.includes('\\')) return '/';
  return volver;
}
```

```practica
vf :: Una redirección abierta sirve para phishing porque el enlace muestra tu dominio y después lleva a otro
vf :: Si el destino empieza con "/", es una ruta de tu sitio y es seguro
elige :: ¿Qué hace la app si el destino de "volver" no es seguro? :: Muestra un error con el destino :: Manda a la portada (/) :: Manda al destino igual
escribe :: Explica con un ejemplo cómo se usaría una redirección abierta en un phishing. :: El atacante manda por WhatsApp un enlace de tuapp.com/entrar?volver=https://sitio-falso.com. La persona ve tu dominio, entra con su contraseña real, y después la app la manda al sitio falso, igual al tuyo, que le pide la contraseña otra vez o la tarjeta.
```

## Parte 4. Archivos subidos con sorpresa

> 🌎 **En la vida real:** el correo de una empresa recibe paquetes. Una caja que dice "libros" por fuera puede tener cualquier cosa adentro: por eso se pasa por el escáner, no se confía en la etiqueta.

> 🌎 **Otro ejemplo:** Es como el control del aeropuerto: no importa lo que diga la maleta; importa lo que muestra la máquina.

"Sube la foto del recibo". ¿Qué puede salir mal?

| Lo que suben | El problema |
|---|---|
| `recibo.html` con un `<script>` | si se sirve desde tu dominio, es **XSS** (clase 23): corre con tu sesión |
| `foto.svg` | un SVG **es** código: puede traer `<script>` adentro |
| `foto.png` que en realidad es un `.exe` | el nombre y el "tipo" los elige **quien sube**: no prueban nada |
| un archivo de 2 GB | llena el disco o la cuenta de almacenamiento (y la factura) |
| `../../index.html` como nombre | path traversal (parte 1) |

**La defensa:**
1. **Mirar el contenido, no el nombre:** los primeros bytes de cada formato son fijos (*magic bytes*). Un PNG empieza con `89 50 4E 47`; un JPEG con `FF D8 FF`.
2. **Lista de permitidos:** solo los formatos que hacen falta (PNG, JPEG, PDF). **Nada de HTML ni SVG** subido por usuarios.
3. **Tamaño máximo**, revisado en el servidor.
4. **Nombre propio:** se guarda con un id (`a7f3….png`), nunca con el nombre del usuario.
5. **Servir desde otro dominio** (por ejemplo, el de Firebase Storage) y con el tipo correcto: aunque algo pasara, no corre con la sesión de tu sitio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar el archivo por su contenido
lenguaje: js
pide: Completa `revisarSubida(bytes, tamano)`. `bytes` son los primeros bytes del archivo (una lista de números). Si `tamano` es mayor que `MAXIMO`, devuelve `{ ok: false, motivo: 'muy grande' }`. Si los bytes empiezan como un PNG (`0x89, 0x50, 0x4e, 0x47`), `{ ok: true, tipo: 'png' }`; como un JPEG (`0xff, 0xd8, 0xff`), `{ ok: true, tipo: 'jpg' }`. Cualquier otra cosa: `{ ok: false, motivo: 'formato no permitido' }`. **El nombre del archivo no se mira.**
--- código
const MAXIMO = 5 * 1024 * 1024; // 5 MB

function revisarSubida(bytes, tamano) {
  // tu código aquí
}
--- pruebas
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a];
const JPG = [0xff, 0xd8, 0xff, 0xe0];
const HTML = [...'<html><script>'].map((c) => c.charCodeAt(0));
prueba('un PNG de verdad', () => igual(revisarSubida(PNG, 200000), { ok: true, tipo: 'png' }));
prueba('un JPEG de verdad', () => igual(revisarSubida(JPG, 800000), { ok: true, tipo: 'jpg' }));
prueba('un HTML que se llama foto.png: no', () => igual(revisarSubida(HTML, 1000), { ok: false, motivo: 'formato no permitido' }));
prueba('muy grande', () => igual(revisarSubida(PNG, 2 * 1024 * 1024 * 1024), { ok: false, motivo: 'muy grande' }));
prueba('vacío: no', () => igual(revisarSubida([], 0), { ok: false, motivo: 'formato no permitido' }));
--- solución
const MAXIMO = 5 * 1024 * 1024; // 5 MB

const empiezaCon = (bytes, firma) => firma.every((b, i) => bytes[i] === b);

function revisarSubida(bytes, tamano) {
  if (tamano > MAXIMO) return { ok: false, motivo: 'muy grande' };
  if (empiezaCon(bytes, [0x89, 0x50, 0x4e, 0x47])) return { ok: true, tipo: 'png' };
  if (empiezaCon(bytes, [0xff, 0xd8, 0xff])) return { ok: true, tipo: 'jpg' };
  return { ok: false, motivo: 'formato no permitido' };
}
```

```practica
vf :: Un archivo subido se revisa por sus primeros bytes, porque el nombre y el tipo los elige quien lo sube
vf :: Una imagen SVG es segura de aceptar, porque es una imagen
elige :: ¿Con qué nombre conviene guardar un archivo subido? :: Con el nombre que eligió el usuario :: Con un id propio, como a7f3….png :: Con la fecha
escribe :: ¿Por qué conviene servir los archivos subidos desde otro dominio que el de tu app? :: Porque si algo dañino se escapara (un HTML con script), correría en ese otro dominio y no con la sesión ni los datos de tu app.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué revisarías en una API además de lo del OWASP Top 10 de memoria?":** "Las puertas que no se ven en la pantalla: path traversal, donde calculo la ruta final y compruebo que no salió de la carpeta, o mejor, guardo los archivos con un id; SSRF, si el servidor busca URLs que manda el usuario, con lista de permitidos, solo https y sin direcciones internas; redirecciones abiertas, donde el destino solo puede ser una ruta de mi sitio, cuidando // y \; y las subidas, que reviso por los primeros bytes y no por el nombre, con tamaño máximo, sin HTML ni SVG, y servidas desde otro dominio. En todas, lo mismo: lista de permitidos, no de prohibidos, y nunca confiar en lo que viene del usuario."

> 🌎 **En la vida real:** es como el inspector que revisa un edificio: no solo la puerta principal, también las ventanas del sótano, el buzón y quién puede pedirle cosas al portero.

> 🌎 **Otro ejemplo:** Es como un guardia de aeropuerto que sabe que el peligro no siempre viene por la puerta de embarque.
