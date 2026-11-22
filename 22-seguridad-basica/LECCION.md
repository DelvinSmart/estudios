# Tema 22: Seguridad básica — pensar como atacante

> 🌎 **En la vida real:** un buen cerrajero sabe abrir cerraduras. Por eso sabe cuáles son buenas y cómo instalarlas. Aprender a atacar sirve para **defender mejor**.

> 🎙️ **El profesor dice:** este es el primer tema del curso **Seguridad: pensar como hacker**, que tiene su propio certificado. Vamos de lo básico a lo avanzado en tres clases. Hoy: la ética y la ley, cómo piensa un atacante, contraseñas, secretos, engaños (phishing), el navegador y las redes. Mucho de esto lo aplicamos de verdad en Copiloto Driver y en este mismo sitio.

## Parte 0. Antes de empezar: ética y ley

> 🌎 **En la vida real:** saber manejar no te da permiso de manejar el carro de otro. Saber atacar un sistema no te da permiso de atacar sistemas ajenos.

> 🌎 **Otro ejemplo:** Es como un médico: sabe dónde duele, y justo por eso jura no hacer daño.

### Solo en lo tuyo o con permiso por escrito

Todo lo de este curso se practica **solo** en:
1. Tus propios sistemas (tus apps, tu sitio, tu Firebase).
2. Laboratorios hechos para eso (OWASP Juice Shop, PortSwigger Web Security Academy, TryHackMe).
3. Sistemas de otros **con permiso por escrito**, que diga qué puedes probar y hasta cuándo.

En Brasil, entrar sin permiso en un aparato ajeno es delito (**Ley 12.737/2012**, la "Ley Carolina Dieckmann", y el Código Penal art. 154-A). En otros países pasa lo mismo.

> 🌎 **En la vida real:** un inspector de edificios entra con una orden y un horario; un ladrón entra igual, pero sin permiso. La diferencia no es la técnica, es el permiso.

> 🌎 **Otro ejemplo:** Es como un piloto de pruebas: prueba el avión en la pista de la fábrica, no en un vuelo con pasajeros.

### Sombrero blanco, gris y negro

- **Sombrero blanco** (*white hat*): ataca con permiso para encontrar fallas y arreglarlas. Es un trabajo: *pentester*, auditor, analista de seguridad.
- **Sombrero negro** (*black hat*): ataca sin permiso, para robar o dañar.
- **Sombrero gris**: entra sin permiso "con buena intención". Igual es ilegal.

> 🌎 **En la vida real:** el que prueba la alarma del banco contratado por el banco es blanco; el que la prueba de noche por su cuenta, aunque "solo quería avisar", es gris y puede terminar preso.

> 🌎 **Otro ejemplo:** Es como un periodista y un espía: los dos buscan información, pero uno pide permiso y cita la fuente.

### Antes del ejercicio: las piezas, una por una

> 📋 **Para este ejercicio necesitas JavaScript** (el curso 2 del mapa): objetos, `if`, `&&` y fechas. Si todavía no lo viste, haz primero las preguntas de la práctica de abajo, que no tienen código, y vuelve a este ejercicio después.

El ejercicio convierte la regla de arriba en código. Antes de escribir, mira qué es cada pieza:

**1. El sistema llega como un objeto.** Un objeto es una ficha con datos (clase 48). Por ejemplo:

```js
{ dueno: 'cliente', permiso: { porEscrito: true, hasta: '2026-12-01' } }
```

| Dato | Qué quiere decir | Ejemplo |
|---|---|---|
| `dueno` | De quién es el sistema | `'yo'` si es tuyo |
| `laboratorio` | Si es un sitio hecho para practicar | `true` en OWASP Juice Shop |
| `permiso` | El permiso que te dieron. **Puede no venir**: si nadie te dio permiso, no está | `{ porEscrito: true, hasta: '2026-12-01' }` |
| `permiso.porEscrito` | Si el permiso está por escrito (de palabra no vale) | `true` o `false` |
| `permiso.hasta` | Hasta qué día vale el permiso | `'2026-12-01'` |
| `intencion` | Lo que dices que querías hacer. **No cambia nada** | `'buena'` |

**2. La regla, en tres preguntas.** Respondes `true` si **cualquiera** de estas es verdad:
- ¿Es tuyo? (`dueno === 'yo'`)
- ¿Es un laboratorio? (`laboratorio === true`)
- ¿Hay permiso, por escrito y que todavía no venció? Aquí las **tres** cosas tienen que cumplirse a la vez: por eso se unen con `&&` ("y").

**3. Las fechas.** Vienen como texto ISO (`'AAAA-MM-DD'`, clase 83). En ese formato, comparar los textos con `>=` funciona igual que comparar las fechas: `'2026-12-01' >= '2026-11-18'` es `true`, porque el permiso vence **después** de hoy.

> 💡 **Idea:** si `permiso` no viene, preguntar por `permiso.porEscrito` da error. Por eso primero se pregunta si **existe** el permiso (`p && …`) y después por sus datos.

> 🧩 **Piezas para este ejercicio**
> - El permiso escrito tiene dos datos distintos: si existe y hasta cuándo vale. Compruébalos juntos. Una fecha `AAAA-MM-DD` se puede comparar en orden cuando ambos textos tienen ese formato.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide. Si te trabas, usa **ver solución** y compárala con las tres preguntas de arriba.

```ejercicio
titulo: ¿Puedo probar este sistema?
lenguaje: js
pide: Completa `puedoProbar(sistema, hoy)`. Devuelve `true` **solo** si: el sistema es tuyo (`dueno === 'yo'`), o es un laboratorio hecho para eso (`laboratorio: true`), o tienes **permiso por escrito** (`permiso` con `porEscrito: true`) y **todavía no venció** (`permiso.hasta >= hoy`, fechas ISO). Las buenas intenciones no cuentan: `intencion` no cambia nada.
--- código
function puedoProbar(sistema, hoy) {
  // tu código aquí
}
--- pruebas
const hoy = '2026-11-18';
prueba('lo tuyo, sí', () => igual(puedoProbar({ dueno: 'yo' }, hoy), true));
prueba('un laboratorio, sí', () => igual(puedoProbar({ dueno: 'OWASP', laboratorio: true }, hoy), true));
prueba('con permiso escrito vigente, sí', () => igual(puedoProbar({ dueno: 'cliente', permiso: { porEscrito: true, hasta: '2026-12-01' } }, hoy), true));
prueba('permiso de palabra, no', () => igual(puedoProbar({ dueno: 'cliente', permiso: { porEscrito: false, hasta: '2026-12-01' } }, hoy), false));
prueba('permiso vencido, no', () => igual(puedoProbar({ dueno: 'cliente', permiso: { porEscrito: true, hasta: '2026-11-17' } }, hoy), false));
prueba('"con buena intención", tampoco (sombrero gris)', () => igual(puedoProbar({ dueno: 'otro', intencion: 'buena' }, hoy), false));
--- solución
function puedoProbar(sistema, hoy) {
  if (sistema.dueno === 'yo') return true;
  if (sistema.laboratorio === true) return true;
  const p = sistema.permiso;
  return Boolean(p && p.porEscrito === true && p.hasta >= hoy);
}
```

```practica
vf :: Saber una técnica de ataque te da permiso para probarla en cualquier sitio
vf :: En Brasil, entrar sin permiso en un aparato ajeno es delito
elige :: ¿Qué hace un sombrero blanco? :: Ataca para robar :: Ataca con permiso para encontrar fallas y arreglarlas :: Ataca sin permiso pero avisa
elige :: ¿Dónde puedes practicar sin pedir permiso a nadie? :: En el sitio de tu banco :: En laboratorios hechos para eso, como OWASP Juice Shop :: En el wifi del vecino
escribe :: ¿Por qué el sombrero gris también es un problema aunque tenga buena intención? :: Porque entra sin permiso, y eso es ilegal y puede causar daños aunque la intención sea buena; el permiso es lo que separa la prueba del ataque.
```

## Parte 1. Pensar como atacante

> 🌎 **En la vida real:** un ladrón no mira tu casa como tú: no ve la sala bonita, ve la ventana sin reja y la hora en que sales.

> 🌎 **Otro ejemplo:** Es como un jugador de ajedrez que piensa la jugada del rival antes de mover.

### La superficie de ataque

La **superficie de ataque** es todo lo que un atacante puede tocar: pantallas, formularios, enlaces del correo, la base de datos, las funciones en la nube, las librerías que usas, las personas del equipo. Cada cosa nueva que agregas es una puerta más.

> 🌎 **En la vida real:** una casa con 10 ventanas tiene más puntos para vigilar que una con 2.

> 🌎 **Otro ejemplo:** Es como un barco: cada agujero, por chico que sea, es un lugar por donde puede entrar agua.

### El modelo de amenazas: qué, quién y cómo

Antes de defender, responde tres preguntas:
1. **¿Qué** quiero proteger? (los datos de mis usuarios, mi plata en la nube, el certificado).
2. **¿Quién** lo querría atacar? (un curioso, un tramposo, un robot automático).
3. **¿Cómo** lo haría? (consola del navegador, llamar a la API directo, adivinar contraseñas).

En este sitio: **qué** = que el certificado sea real; **quién** = alguien que quiere un certificado sin estudiar; **cómo** = cambiar localStorage. Por eso movimos todo a reglas del servidor (Tema 21).

> 🌎 **En la vida real:** un joyero y una panadería no ponen la misma seguridad: depende de qué cuidan y de quién podría robar.

> 🌎 **Otro ejemplo:** Es como planear un viaje: piensas qué podría salir mal (lluvia, robo, retraso) y llevas lo que necesitas para cada cosa.

> 🧩 **Piezas para este ejercicio**
> - El modelo de amenazas conecta una situación con la defensa que corresponde. Decide primero qué elemento reconoce el texto y después qué comprobación puede hacer el servidor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El modelo de amenazas: para cada "cómo", una defensa
lenguaje: js
pide: Completa `defensaPara(como)`: recibe cómo atacaría alguien y devuelve la defensa que va **en el servidor**. Si el texto menciona `consola` o `localStorage` → `'reglas del servidor'`; `api` → `'revisar la sesión y el dueño en el servidor'`; `contraseña` o `clave` → `'limitar intentos'`; si no reconoces nada → `'pensar la defensa antes de publicar'`. Compara en minúsculas.
--- código
function defensaPara(como) {
  // tu código aquí
}
--- pruebas
prueba('cambiar el progreso desde la consola', () => igual(defensaPara('Cambiar el progreso desde la Consola'), 'reglas del servidor'));
prueba('editar localStorage', () => igual(defensaPara('editar localStorage para tener el certificado'), 'reglas del servidor'));
prueba('llamar a la API directo', () => igual(defensaPara('llamar a la API directo con otro id'), 'revisar la sesión y el dueño en el servidor'));
prueba('adivinar contraseñas', () => igual(defensaPara('un robot que prueba contraseñas'), 'limitar intentos'));
prueba('algo nuevo', () => igual(defensaPara('subir una foto gigante'), 'pensar la defensa antes de publicar'));
--- solución
function defensaPara(como) {
  const t = como.toLowerCase();
  if (t.includes('consola') || t.includes('localstorage')) return 'reglas del servidor';
  if (t.includes('api')) return 'revisar la sesión y el dueño en el servidor';
  if (t.includes('contraseña') || t.includes('clave')) return 'limitar intentos';
  return 'pensar la defensa antes de publicar';
}
```

```practica
vf :: Cada función nueva que agregas aumenta la superficie de ataque
elige :: ¿Cuáles son las tres preguntas del modelo de amenazas? :: Cuánto, cuándo, dónde :: Qué proteger, quién atacaría y cómo lo haría :: Quién programó, en qué lenguaje y cuánto costó
elige :: En el certificado de este sitio, ¿cuál era el "cómo" del atacante? :: Robar la contraseña de Delvin :: Cambiar localStorage desde la consola :: Romper el servidor de Google
escribe :: Haz un modelo de amenazas de una app de notas personales: qué, quién y cómo. :: Qué: las notas privadas de cada persona. Quién: alguien curioso o un atacante que quiere datos. Cómo: leer notas de otro usuario cambiando el id, adivinar contraseñas o robar la sesión.
```

## Parte 2. Contraseñas

> 🌎 **En la vida real:** una contraseña es la llave de tu casa digital. Si es "1234", es como dejar la llave pegada en la puerta.

> 🌎 **Otro ejemplo:** Es como el candado de una bicicleta: uno de 3 números se abre probando un rato; uno de 8, no.

### Fuerza bruta y diccionario

- **Fuerza bruta:** probar todas las combinaciones. Una clave de 4 números tiene 10.000: una computadora las prueba en segundos.
- **Diccionario:** probar primero las más usadas (`123456`, `senha123`, `flamengo`, tu fecha de nacimiento).

Defensa: contraseñas **largas** (mínimo 8, mejor 12+), **limitar intentos** (Firebase bloquea con `too-many-requests`) y no reusar.

> 🌎 **En la vida real:** el ladrón no prueba llaves al azar: prueba primero debajo del tapete y en la maceta, porque ahí la deja casi todo el mundo.

> 🌎 **Otro ejemplo:** Es como adivinar el PIN de alguien: primero pruebas su cumpleaños.

### Hash y sal: nunca guardar la contraseña

Un sistema serio **no guarda tu contraseña**: guarda su **hash**, una "huella" que no se puede volver atrás. Al entrar, calcula el hash de lo que escribiste y compara. Además se le agrega una **sal** (un texto al azar por usuario) para que dos personas con la misma clave no tengan el mismo hash. Firebase Authentication hace esto por ti.

```python
# Solo para entender la idea (Python). En la vida real usa bcrypt, scrypt o Argon2.
import hashlib, os
sal = os.urandom(16)
huella = hashlib.scrypt(b"mi-clave-larga", salt=sal, n=2**14, r=8, p=1)
# Se guardan sal y huella. La clave original no se guarda nunca.
```

> 🌎 **En la vida real:** es como la huella dactilar: el sistema la reconoce, pero de la huella no puede fabricar tu dedo.

> 🌎 **Otro ejemplo:** Es como un jugo de naranja: de la naranja sale el jugo, pero del jugo no vuelves a armar la naranja.

### Gestor de contraseñas y segundo factor

- **Gestor de contraseñas** (el llavero de iCloud, Bitwarden, 1Password): crea una clave distinta y larga para cada sitio y la recuerda por ti.
- **Segundo factor (2FA):** además de la clave, un código en una app o una llave física. Aunque roben tu clave, no entran.

> 🌎 **En la vida real:** el 2FA es como un edificio con portero **y** llave: aunque copien tu llave, el portero no conoce al ladrón.

> 🌎 **Otro ejemplo:** Es como el cajero automático: necesitas la tarjeta **y** el PIN; con uno solo no alcanza.

> 🧩 **Piezas para este ejercicio**
> - Si cada posición admite la misma cantidad de símbolos, el total se obtiene multiplicando esa cantidad una vez por posición. La clasificación de la práctica es una regla simplificada para el ejercicio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Cuánto tarda la fuerza bruta?
lenguaje: js
pide: Completa `combinaciones(largo, simbolos)`: cuántas claves posibles hay (`simbolos` elevado a `largo`, con `**`). Y `fuerza(clave, comunes)`: `'débil'` si tiene menos de 8 letras, si está en la lista de `comunes` (sin importar mayúsculas) o si son **solo números**; `'fuerte'` si tiene 12 o más y no es débil; si no, `'media'`.
--- código
function combinaciones(largo, simbolos) {
  // tu código aquí
}

function fuerza(clave, comunes) {
  // tu código aquí
}
--- pruebas
const comunes = ['123456', 'senha123', 'flamengo123', 'password'];
prueba('4 números: 10.000', () => igual(combinaciones(4, 10), 10000));
prueba('crece muy rápido con el largo', () => ok(combinaciones(12, 62) > combinaciones(8, 62) * 1e6, '12 letras tiene que ser muchísimo más que 8'));
prueba('corta, débil', () => igual(fuerza('a1b2', comunes), 'débil'));
prueba('de las más usadas, débil', () => igual(fuerza('Flamengo123', comunes), 'débil'));
prueba('solo números, débil aunque sea larga', () => igual(fuerza('19901231', comunes), 'débil'));
prueba('media y fuerte', () => igual([fuerza('carro-azul', comunes), fuerza('tres-palabras-largas', comunes)], ['media', 'fuerte']));
--- solución
function combinaciones(largo, simbolos) {
  return simbolos ** largo;
}

function fuerza(clave, comunes) {
  const comun = comunes.map((c) => c.toLowerCase()).includes(clave.toLowerCase());
  if (clave.length < 8 || comun || /^\d+$/.test(clave)) return 'débil';
  if (clave.length >= 12) return 'fuerte';
  return 'media';
}
```

```practica
vf :: Un sistema bien hecho guarda tu contraseña tal cual para compararla
vf :: Reusar la misma contraseña en varios sitios es peligroso
elige :: ¿Qué es un ataque de diccionario? :: Leer el diccionario de la víctima :: Probar primero las contraseñas más usadas :: Traducir la contraseña
elige :: ¿Para qué sirve la sal en un hash? :: Para que pese más :: Para que dos claves iguales no den el mismo hash :: Para que se pueda revertir
elige :: ¿Qué protege el 2FA? :: Que olvides tu clave :: Que alguien entre aunque haya robado tu clave :: Que el sitio sea rápido
escribe :: ¿Por qué un hash no se puede "volver atrás" y por qué eso importa si roban la base de datos? :: Porque es una función de un solo sentido; si roban la base solo se llevan huellas, no las contraseñas, y tendrían que adivinarlas una por una.
```

## Parte 3. Secretos en el código

> 🌎 **En la vida real:** escribir la clave del cajero detrás de la tarjeta es cómodo… hasta que pierdes la billetera.

> 🌎 **Otro ejemplo:** Es como dejar la combinación de la caja fuerte anotada en un post-it en la misma caja.

### Qué es un secreto y qué no

- **Secreto (nunca en el código):** claves de servicio, tokens de pago (Stripe, Mercado Pago), contraseñas de bases de datos, la clave de la API de Twilio o de Gemini en un servidor, el archivo de firma de Android.
- **No secreto:** la configuración web de Firebase (`apiKey`, `projectId`): identifica el proyecto; la seguridad está en las reglas.

> 🌎 **En la vida real:** el número de tu celular no es secreto; el código que te llega por SMS para entrar al banco, sí.

> 🌎 **Otro ejemplo:** Es como el nombre de un restaurante (público) y la receta secreta (guardada).

### .env y .gitignore

Los secretos van en un archivo **`.env`** que **no se sube**: se lista en **`.gitignore`**. En la nube se guardan en el gestor de secretos (en Firebase Functions: `defineSecret`), que los entrega al servidor sin escribirlos en el código.

```bash
# .gitignore
.env
*.keystore
service-account*.json
```

> 🌎 **En la vida real:** es como guardar la llave de repuesto en la casa de un familiar y no debajo del tapete.

> 🌎 **Otro ejemplo:** Es como una carta que mandas en sobre cerrado y no en una postal que lee cualquiera.

### Si un secreto se filtró: rotarlo

Si subiste un secreto a GitHub, **borrar el archivo no alcanza**: queda en el historial y hay robots que escanean GitHub en minutos. Lo único que sirve es **rotarlo**: crear una clave nueva en el servicio, ponerla en su lugar y **anular la vieja**.

> 🌎 **En la vida real:** si perdiste la llave de tu casa, no basta con "olvidar dónde la perdiste": cambias la cerradura.

> 🌎 **Otro ejemplo:** Es como una tarjeta robada: no esperas a ver si la usan; la bloqueas y pides otra.

> 🧩 **Piezas para este ejercicio**
> - El detector trabaja por líneas. Usa el índice más uno para mostrar el número tal como aparece en un editor. Registra la ubicación sin copiar el valor que podría ser secreto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Buscar secretos antes de subir
lenguaje: js
pide: Completa `buscarSecretos(texto)`: revisa un archivo línea por línea y devuelve los **números de línea** (desde 1) que parecen tener un secreto: una clave de pago (`sk_live_`), una clave de AWS (`AKIA` seguido de 16 letras mayúsculas o números), una llave privada (`PRIVATE KEY`), o `password=`/`password:` con algo escrito después. La `apiKey` de Firebase (empieza con `AIza`) **no** es secreta: no la marques.
--- código
function buscarSecretos(texto) {
  // tu código aquí
}
--- pruebas
const archivo = [
  "const firebase = { apiKey: 'AIzaSyB1234567890abcdefghijklmnop' };",
  "const stripe = 'sk_live_51Hx9abcdefghijklmnop';",
  '# password=',
  'DB_PASSWORD: password=s3gura!',
  'aws = AKIAABCDEFGHIJKLMNOP',
  '-----BEGIN PRIVATE KEY-----',
].join('\n');
prueba('encuentra los secretos', () => igual(buscarSecretos(archivo), [2, 4, 5, 6]));
prueba('la configuración de Firebase no es un secreto', () => ok(!buscarSecretos(archivo).includes(1), 'la línea 1 es pública: la seguridad está en las reglas'));
prueba('un archivo limpio', () => igual(buscarSecretos('const total = 10;\nconsole.log(total);'), []));
--- solución
function buscarSecretos(texto) {
  const patrones = [/sk_live_/, /AKIA[A-Z0-9]{16}/, /PRIVATE KEY/, /password\s*[=:]\s*\S+/i];
  return texto
    .split('\n')
    .map((linea, i) => (patrones.some((p) => p.test(linea)) ? i + 1 : null))
    .filter((n) => n !== null);
}
```

```practica
vf :: La apiKey de la configuración web de Firebase es un secreto
vf :: Si subiste una clave a GitHub, basta con borrar el archivo en el siguiente commit
elige :: ¿Dónde van los secretos en un proyecto? :: En el README :: En un .env que está en .gitignore, o en el gestor de secretos de la nube :: En un comentario del código
elige :: ¿Qué significa rotar un secreto? :: Escribirlo al revés :: Crear uno nuevo y anular el viejo :: Moverlo a otra carpeta
escribe :: Nombra tres cosas que nunca deben ir en un repositorio público. :: Por ejemplo: la clave de una cuenta de servicio, el token de una pasarela de pago y el archivo de firma (keystore) de la app.
```

## Parte 4. Ingeniería social y phishing

> 🌎 **En la vida real:** el robo más fácil no es romper la puerta: es tocar el timbre vestido de técnico de la luz y que te abran.

> 🌎 **Otro ejemplo:** Es como el "cuento del tío": nadie te obliga, te convencen.

### Cómo se ve un phishing

El **phishing** es un mensaje falso que imita a alguien de confianza para que entregues una clave o un código. Señales típicas: **urgencia** ("tu cuenta se cierra hoy"), **miedo o premio**, un **enlace** que parece real pero no lo es, y pedir **códigos** o contraseñas.

> 🌎 **En la vida real:** el falso WhatsApp de "mamá, cambié de número, mándame un Pix urgente".

> 🌎 **Otro ejemplo:** Es como la llamada del "banco" que te pide el código que acaba de llegar a tu celular: el banco de verdad nunca lo pide.

### Revisar el dominio

El dominio es lo que va justo antes de la primera `/`. `accounts.google.com` es Google; `accounts.google.com.verificar-cuenta.xyz` **no**: el dominio real es `verificar-cuenta.xyz`. También existen trucos con letras parecidas (`goog1e.com`, `rnercadolivre.com`).

> 🌎 **En la vida real:** es como leer el remitente de una carta: "Banco do Brasil" escrito a mano en un sobre sin sello no es el banco.

> 🌎 **Otro ejemplo:** Es como una camiseta "Adibas": de lejos parece la marca, de cerca no.

> 🧩 **Piezas para este ejercicio**
> - `hostname` es el nombre del servidor que interpreta el navegador. En este ejercicio, la lista de terminaciones sirve para los casos dados. En una aplicación con dominios de muchos países se necesita una lista completa de sufijos públicos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El dominio de verdad
lenguaje: js
pide: Completa `dominioReal(direccion)`: devuelve el dominio que manda en una dirección, con `new URL(direccion).hostname`. Para `.com.br` y otros de dos pedazos (`'com.br', 'org.br', 'gov.br'`), son las **tres** últimas partes; si no, las **dos** últimas. Y `esDe(direccion, dominio)`: `true` solo si el dominio real es ese. Fíjate en el truco del `@`: todo lo de antes de la arroba no es el sitio.
--- código
const DOS_PEDAZOS = ['com.br', 'org.br', 'gov.br'];

function dominioReal(direccion) {
  // tu código aquí
}

function esDe(direccion, dominio) {
  // tu código aquí
}
--- pruebas
prueba('Google de verdad', () => igual(dominioReal('https://accounts.google.com/login'), 'google.com'));
prueba('el que se disfraza de Google', () => igual(dominioReal('https://accounts.google.com.verificar-cuenta.xyz/login'), 'verificar-cuenta.xyz'));
prueba('el truco de la arroba', () => igual(dominioReal('https://www.nubank.com.br@pague-ya.top/pix'), 'pague-ya.top'));
prueba('un .com.br', () => igual(dominioReal('https://app.nubank.com.br/'), 'nubank.com.br'));
prueba('esDe', () => igual([esDe('https://accounts.google.com/', 'google.com'), esDe('https://google.com.verificar-cuenta.xyz', 'google.com')], [true, false]));
--- solución
const DOS_PEDAZOS = ['com.br', 'org.br', 'gov.br'];

function dominioReal(direccion) {
  const partes = new URL(direccion).hostname.split('.');
  const ultimasDos = partes.slice(-2).join('.');
  return DOS_PEDAZOS.includes(ultimasDos) ? partes.slice(-3).join('.') : ultimasDos;
}

function esDe(direccion, dominio) {
  return dominioReal(direccion) === dominio;
}
```

```practica
vf :: En la dirección accounts.google.com.ofertas.xyz, el dominio real es Google
vf :: Un banco de verdad nunca te pide por mensaje el código que te llegó por SMS
elige :: ¿Cuál es una señal típica de phishing? :: Un mensaje sin errores :: Urgencia: "tu cuenta se cierra hoy" :: Un saludo
elige :: ¿Qué hacer si dudas de un mensaje del banco? :: Tocar el enlace para ver :: Abrir la app o el sitio escribiéndolo tú, sin usar el enlace :: Responder con tus datos
escribe :: Describe un phishing que hayas visto o que te imaginas, y las señales que lo delatan. :: Ejemplo: un SMS de "Correios" diciendo que hay una tasa de envío pendiente con un enlace raro; señales: urgencia, cobro inesperado y un dominio que no es el oficial.
```

## Parte 5. El navegador: lo que el usuario controla

> 🌎 **En la vida real:** lo que le das a un cliente para llevarse a casa ya no lo controlas tú: puede abrirlo, desarmarlo y cambiarlo.

> 🌎 **Otro ejemplo:** Es como un formulario en papel: la persona puede tachar lo que imprimiste y escribir otra cosa.

### Las herramientas de desarrollador

Con **Cmd + Option + I** (o F12) cualquiera ve:
- **Elementos:** el HTML; puede cambiar textos y quitar el `disabled` de un botón.
- **Consola:** puede ejecutar JavaScript y llamar a tus funciones.
- **Red:** ve cada petición, sus datos y respuestas.
- **Aplicación:** ve y cambia localStorage, cookies y la sesión. (Una **cookie** es un dato pequeño que un sitio guarda en tu navegador y que el navegador le devuelve **solo** en cada pedido a ese sitio; muchas veces es tu sesión: "esta persona ya entró". Por eso robar una cookie de sesión es casi como robar la contraseña.)

Úsalas en **tus** sitios para ver lo que vería un atacante.

> 🌎 **En la vida real:** es como una vitrina de cristal: todo lo que pones ahí, la gente lo ve.

> 🌎 **Otro ejemplo:** Es como un carro con el capó abierto: cualquiera puede mirar el motor y tocar los cables.

### Validar en el cliente no es seguridad

Validar en la pantalla (campos obligatorios, botones bloqueados) es para **ayudar** a la persona. La **seguridad** está en el servidor. En Copiloto aprendimos que un límite revisado **solo en la app** se puede saltar llamando a la base de datos directo; la solución es repetir el límite en las **reglas** o en una **función del servidor**.

> 🌎 **En la vida real:** el cartel de "máximo 2 por cliente" en el supermercado no sirve si la caja no lo controla.

> 🌎 **Otro ejemplo:** Es como el "solo para mayores de 18" de un sitio: un clic en "sí, tengo 18" no comprueba nada.

> 🧩 **Piezas para este ejercicio**
> - El catálogo es el dato que controla el servidor. Usa el identificador del producto para consultarlo. Valida que la cantidad sea un entero antes de calcular el importe.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El precio lo pone el servidor
lenguaje: js
pide: La página manda el pedido con precios, y cualquiera puede cambiarlos desde las herramientas de desarrollador. Completa `totalDelServidor(pedido, catalogo)`: **ignora** el precio que mandó la página y usa el del `catalogo`. Si un producto no está en el catálogo, o la cantidad no es un entero de 1 a 10, lanza `Error('Pedido inválido')`. Devuelve el total redondeado a 2 decimales.
--- código
function totalDelServidor(pedido, catalogo) {
  // tu código aquí
}
--- pruebas
const catalogo = { lavado: 30, aceite: 120.5, peaje: 5.4 };
prueba('un pedido normal', () => igual(totalDelServidor([{ producto: 'lavado', cantidad: 2, precio: 30 }], catalogo), 60));
prueba('el precio cambiado en la consola se ignora', () => igual(totalDelServidor([{ producto: 'aceite', cantidad: 1, precio: 0.01 }], catalogo), 120.5));
const lanza = (fn) => { try { fn(); return 'no lanzó'; } catch (e) { return e.message; } };
prueba('un producto inventado', () => igual(lanza(() => totalDelServidor([{ producto: 'gratis', cantidad: 1 }], catalogo)), 'Pedido inválido'));
prueba('cantidades raras', () => igual([0, -1, 2.5, 11].map((cantidad) => lanza(() => totalDelServidor([{ producto: 'peaje', cantidad }], catalogo))), Array(4).fill('Pedido inválido')));
--- solución
function totalDelServidor(pedido, catalogo) {
  let total = 0;
  for (const linea of pedido) {
    const precio = catalogo[linea.producto];
    const cantidadValida = Number.isInteger(linea.cantidad) && linea.cantidad >= 1 && linea.cantidad <= 10;
    if (precio === undefined || !cantidadValida) throw new Error('Pedido inválido');
    total += precio * linea.cantidad;
  }
  return Math.round(total * 100) / 100;
}
```

```practica
vf :: Quitar el disabled de un botón desde las herramientas del navegador es fácil
vf :: Si la app revisa un límite en la pantalla, ya no hace falta revisarlo en el servidor
elige :: ¿Qué pestaña de las herramientas muestra cada petición al servidor? :: Elementos :: Red (Network) :: Consola
elige :: ¿Para qué sirve validar en el cliente? :: Para la seguridad :: Para ayudar a la persona con avisos rápidos :: Para nada
escribe :: En una app, solo los usuarios premium pueden subir más de 5 fotos y eso se revisa en la pantalla. ¿Qué harías? :: Repetir ese límite en el servidor (reglas o una función) para que una llamada directa a la base de datos también sea rechazada.
```

## Parte 6. HTTPS y redes

> 🌎 **En la vida real:** HTTP es como mandar una postal: el cartero puede leerla. HTTPS es como un sobre cerrado y sellado.

> 🌎 **Otro ejemplo:** Es como hablar en clave con tu hermano en un lugar lleno de gente: los demás oyen, pero no entienden.

### Qué protege HTTPS

**HTTPS** cifra lo que viaja entre tu navegador y el sitio, y comprueba (con un **certificado**) que hablas con el sitio de verdad. No protege si el sitio en sí es malo: un sitio de phishing también puede tener candado.

> 🌎 **En la vida real:** un sobre cerrado protege la carta en el camino, pero no impide que se la mandes a un estafador.

> 🌎 **Otro ejemplo:** Es como un taxi con las puertas trabadas: vas seguro en el viaje, pero si diste la dirección equivocada, llegas al lugar equivocado.

### Wi-Fi público

En un Wi-Fi abierto (aeropuerto, café), alguien en la misma red puede ver qué sitios visitas y montar una red falsa con el mismo nombre. Con HTTPS tus datos van cifrados, pero conviene usar los datos del celular para cosas importantes (banco) o una VPN de confianza.

> 🌎 **En la vida real:** hablar de tu clave del banco en voz alta en un bus lleno: aunque nadie parezca escuchar, alguien puede.

> 🌎 **Otro ejemplo:** Es como un cajero automático en una calle oscura: funciona igual, pero es más fácil que alguien mire.

> 🧩 **Piezas para este ejercicio**
> - `new URL(...)` separa la dirección en partes. `.protocol` incluye los dos puntos. Si la página es HTTPS, revisa también el protocolo de cada recurso.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: HTTPS de punta a punta
lenguaje: js
pide: Completa `esSegura(direccion)`: `true` si la dirección usa `https:` (con `new URL`). Y `recursosInseguros(pagina, recursos)`: si la página es `https`, devuelve los recursos que se cargan por `http:` (el navegador los bloquea o avisa, y rompen el candado); si la página no es `https`, devuelve **todos** (nada está protegido).
--- código
function esSegura(direccion) {
  // tu código aquí
}

function recursosInseguros(pagina, recursos) {
  // tu código aquí
}
--- pruebas
prueba('https sí, http no', () => igual([esSegura('https://delvinsmart.github.io'), esSegura('http://delvinsmart.github.io')], [true, false]));
const recursos = ['https://cdn.jsdelivr.net/a.js', 'http://imagenes.ejemplo.com/logo.png', '/estilos.css'];
prueba('en una página https, los http', () => igual(recursosInseguros('https://mi-sitio.com/', recursos), ['http://imagenes.ejemplo.com/logo.png']));
prueba('en una página http, todo es inseguro', () => igual(recursosInseguros('http://mi-sitio.com/', recursos).length, 3));
--- solución
function esSegura(direccion) {
  return new URL(direccion).protocol === 'https:';
}

function recursosInseguros(pagina, recursos) {
  if (!esSegura(pagina)) return [...recursos];
  return recursos.filter((r) => new URL(r, pagina).protocol === 'http:');
}
```

```practica
vf :: El candado de HTTPS garantiza que el sitio es honesto
vf :: En un Wi-Fi público alguien puede crear una red falsa con el mismo nombre
elige :: ¿Qué hace HTTPS? :: Hace el sitio más rápido :: Cifra lo que viaja y confirma que hablas con ese dominio :: Bloquea virus
elige :: Para entrar al banco en un aeropuerto, ¿qué es más seguro? :: El Wi-Fi gratis :: Los datos del celular :: Cualquier red con buena señal
escribe :: ¿Por qué un sitio con candado puede ser igual un engaño? :: Porque el candado solo dice que la conexión está cifrada con ese dominio; un estafador puede tener su propio dominio con certificado, así que hay que revisar el nombre del dominio.
```


**Comprobación antes de seguir**

Identifica tres datos sensibles de una app de gastos y quién necesita ver cada uno.

<details>
<summary>Necesito una pista</summary>

Empieza por distinguir los datos de una persona de los datos visibles al público.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es lo primero que miras para asegurar una app?":** "Hago un modelo de amenazas: qué protejo, quién lo atacaría y cómo. Después reviso que nada importante dependa del cliente: permisos y límites en el servidor, secretos fuera del repositorio y en un gestor de secretos, contraseñas manejadas por un servicio que guarde hashes con sal, y HTTPS en todo."

> 🌎 **En la vida real:** es como un inspector que primero pregunta "¿qué guardan aquí?" antes de mirar las cerraduras.

> 🌎 **Otro ejemplo:** Es como un médico que pregunta los síntomas antes de recetar.
