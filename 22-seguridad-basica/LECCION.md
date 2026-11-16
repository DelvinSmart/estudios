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
- **Aplicación:** ve y cambia localStorage, cookies y la sesión.

Úsalas en **tus** sitios para ver lo que vería un atacante.

> 🌎 **En la vida real:** es como una vitrina de cristal: todo lo que pones ahí, la gente lo ve.

> 🌎 **Otro ejemplo:** Es como un carro con el capó abierto: cualquiera puede mirar el motor y tocar los cables.

### Validar en el cliente no es seguridad

Validar en la pantalla (campos obligatorios, botones bloqueados) es para **ayudar** a la persona. La **seguridad** está en el servidor. En Copiloto aprendimos que un límite revisado **solo en la app** se puede saltar llamando a la base de datos directo; la solución es repetir el límite en las **reglas** o en una **función del servidor**.

> 🌎 **En la vida real:** el cartel de "máximo 2 por cliente" en el supermercado no sirve si la caja no lo controla.

> 🌎 **Otro ejemplo:** Es como el "solo para mayores de 18" de un sitio: un clic en "sí, tengo 18" no comprueba nada.

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

```practica
vf :: El candado de HTTPS garantiza que el sitio es honesto
vf :: En un Wi-Fi público alguien puede crear una red falsa con el mismo nombre
elige :: ¿Qué hace HTTPS? :: Hace el sitio más rápido :: Cifra lo que viaja y confirma que hablas con ese dominio :: Bloquea virus
elige :: Para entrar al banco en un aeropuerto, ¿qué es más seguro? :: El Wi-Fi gratis :: Los datos del celular :: Cualquier red con buena señal
escribe :: ¿Por qué un sitio con candado puede ser igual un engaño? :: Porque el candado solo dice que la conexión está cifrada con ese dominio; un estafador puede tener su propio dominio con certificado, así que hay que revisar el nombre del dominio.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es lo primero que miras para asegurar una app?":** "Hago un modelo de amenazas: qué protejo, quién lo atacaría y cómo. Después reviso que nada importante dependa del cliente: permisos y límites en el servidor, secretos fuera del repositorio y en un gestor de secretos, contraseñas manejadas por un servicio que guarde hashes con sal, y HTTPS en todo."

> 🌎 **En la vida real:** es como un inspector que primero pregunta "¿qué guardan aquí?" antes de mirar las cerraduras.

> 🌎 **Otro ejemplo:** Es como un médico que pregunta los síntomas antes de recetar.
