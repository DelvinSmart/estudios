# Seguridad: pensar antes, enterarse durante y responder después

> 🌎 **En la vida real:** un edificio seguro tiene tres cosas. **Antes:** un plano que dice por dónde podría entrar un ladrón (puertas, ventanas, el garaje). **Durante:** cámaras que graban y una alarma que suena. **Después:** un plan para cuando suena la alarma (a quién llamar, qué cerrar, cómo revisar qué se llevaron). Esta clase es esas tres cosas, para una app.

> 🎙️ **El profesor dice:** en las clases anteriores aprendiste a **cerrar agujeros**. Pero nadie cierra todos. Las empresas serias se preparan para tres momentos: **pensar los ataques antes de programar**, **enterarse cuando pasa algo** y **saber qué hacer cuando pasó**. Lo hacemos con la API de gastos de la clase 91, la misma que atacaste en la 114.

**Palabras nuevas de esta clase:**

| Palabra | Qué quiere decir |
|---|---|
| **Amenaza** | Algo malo que **podría** pasar (alguien lee los gastos de otro). Todavía no pasó. |
| **Modelo de amenazas** | La lista ordenada de las amenazas de tu app y la defensa de cada una. Ya viste la versión corta en la clase 22: **qué** protejo, **quién** atacaría, **cómo**. |
| **Frontera de confianza** | La línea donde los datos pasan de un lugar que **no controlas** (el navegador de la persona, internet) a uno que **sí** (tu servidor). Ahí van los controles. |
| **Registro** (*log*) | El "cuaderno" donde el programa anota lo que pasa: quién entró, qué falló, a qué hora. |
| **Alerta** | Un aviso automático cuando el registro muestra algo raro (por ejemplo, 50 claves malas en un minuto). |
| **Incidente** | Cuando algo malo **sí pasó** (o es muy probable que pasó): se filtró una clave, alguien entró donde no debía. |
| **Rotar** una clave | Cambiarla por una nueva y apagar la vieja, para que la que se filtró ya no sirva. |

## Parte 1. El modelo de amenazas, con STRIDE

> 🌎 **En la vida real:** antes de un viaje en auto revisas una lista: llantas, aceite, luces, frenos, documentos. No confías en "acordarte". **STRIDE** es esa lista, para los ataques.

> 🌎 **Otro ejemplo:** el médico no te pregunta "¿qué tienes?" y ya. Sigue un orden: cabeza, pecho, estómago… Así no se le escapa nada.

En la clase 22 hiciste el modelo corto (qué, quién, cómo). Cuando la app crece, se usa una **lista de seis tipos de ataque** que inventó Microsoft, llamada **STRIDE** por sus iniciales en inglés. No tienes que memorizar el inglés: lo importante es la pregunta de cada una.

| Letra | El ataque | La pregunta que te haces | En la API de gastos |
|---|---|---|---|
| **S** | **Hacerse pasar** por otro (*Spoofing*) | ¿Alguien puede decir que es Ana sin serlo? | Adivinar la clave de Ana con Hydra (clase 114) |
| **T** | **Cambiar** datos (*Tampering*) | ¿Alguien puede cambiar lo que no es suyo? | Mandar `"rol": "admin"` en el cuerpo (asignación masiva) |
| **R** | **Negar** que lo hizo (*Repudiation*) | Si alguien borra algo, ¿puedo probar quién fue? | Si no hay registro, Beto dice "yo no borré nada" y no hay cómo saber |
| **I** | **Filtrar** información (*Information disclosure*) | ¿Alguien puede ver lo que no debe? | El IDOR: pedir `/gastos/7` y ver el gasto de otro |
| **D** | **Tumbar** el servicio (*Denial of service*) | ¿Alguien puede dejarla sin funcionar o hacerme gastar? | Mil pedidos por segundo; o llamar mil veces a una función paga (clase 108) |
| **E** | **Subir de permisos** (*Elevation of privilege*) | ¿Un usuario normal puede hacer cosas de administrador? | Cambiar su propio rol a `admin` |

**Cómo se hace, paso a paso:**

1. **Dibuja** la app con cajas y flechas: el navegador, el servidor, la base de datos, los servicios de afuera.
2. **Marca las fronteras de confianza:** cada flecha que entra desde algo que no controlas.
3. En **cada frontera**, pasa la lista **S-T-R-I-D-E**: ¿puede pasar esto aquí?
4. Para cada "sí", escribe **la defensa** y **la prueba** que demuestra que funciona.

```text
 [ Navegador de la persona ]   ← no lo controlas: la persona puede cambiar TODO lo que manda
            │
 ═══════════╪═══════════  FRONTERA DE CONFIANZA (internet → tu servidor)
            ▼
 [ Servidor (Express) ]  → revisa: quién eres, qué te toca, qué mandaste, cuántas veces
            │
            ▼
 [ Base de datos (SQLite) ]   ← solo habla con tu servidor
```

> 💡 **Idea:** el modelo de amenazas **no** es un documento para guardar en un cajón. Cada amenaza termina en **una prueba**, como las "trampas" de la clase 91. Si no hay prueba, la defensa es una promesa.

> 📌 **Nota:** en un trabajo, esto se hace **antes de programar** algo nuevo y se repasa cuando cambia el diseño. Es una de las preguntas favoritas en entrevistas de seguridad.

> 🧩 **Piezas para este ejercicio**
> - STRIDE agrupa amenazas según el efecto que producen. Las palabras del ejercicio son señales de una simulación. En un sistema real, clasifica por el comportamiento observado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: Ponle su letra de STRIDE a cada amenaza
lenguaje: js
pide: Completa `letraDe(amenaza)`. Recibe un texto en minúsculas y devuelve la letra: si dice `'hacerse pasar'` → `'S'`; `'cambiar'` → `'T'`; `'negar'` → `'R'`; `'ver'` o `'leer'` → `'I'`; `'tumbar'` → `'D'`; `'admin'` → `'E'`. Revisa en ese orden y devuelve `'?'` si no encaja. Usa `texto.includes(...)`.
--- código
function letraDe(amenaza) {
  // tu código aquí
}
--- pruebas
prueba('Hydra adivina la clave', () => igual(letraDe('hacerse pasar por ana adivinando su clave'), 'S'));
prueba('el IDOR', () => igual(letraDe('beto puede ver los gastos de ana'), 'I'));
prueba('subirse a administrador', () => igual(letraDe('un usuario se pone rol admin'), 'E'));
prueba('sin registro', () => igual(letraDe('beto puede negar que borró'), 'R'));
prueba('mil pedidos', () => igual(letraDe('tumbar el servidor con mil pedidos'), 'D'));
prueba('no encaja', () => igual(letraDe('llueve'), '?'));
--- solución
function letraDe(amenaza) {
  if (amenaza.includes('hacerse pasar')) return 'S';
  if (amenaza.includes('cambiar')) return 'T';
  if (amenaza.includes('negar')) return 'R';
  if (amenaza.includes('ver') || amenaza.includes('leer')) return 'I';
  if (amenaza.includes('tumbar')) return 'D';
  if (amenaza.includes('admin')) return 'E';
  return '?';
}
```

```practica
elige :: ¿Qué es una frontera de confianza? :: El límite de velocidad del servidor :: La línea donde los datos pasan de algo que no controlas (el navegador) a algo que sí (tu servidor) :: La contraseña del administrador
elige :: Beto borra un gasto y después dice que no fue él. Si no hay forma de probarlo, ¿qué letra de STRIDE falla? :: S :: R :: D
vf :: El modelo de amenazas se hace después de publicar la app, cuando ya hubo un ataque
vf :: Cada amenaza del modelo debería terminar en una defensa y en una prueba que demuestre que funciona
escribe :: Haz un mini modelo de amenazas del login de la API de gastos con dos letras de STRIDE. :: S: alguien adivina la clave de Ana con Hydra; defensa: límite de intentos y hash lento; prueba: el intento 6 en un minuto recibe 429. I: el login dice "ese usuario no existe" y deja saber quién tiene cuenta; defensa: el mismo mensaje para usuario y clave malos; prueba: las dos respuestas son iguales.
```

## Parte 2. Los registros: qué anotar, qué nunca anotar

> 🌎 **En la vida real:** la cámara de un banco graba **quién entró, a qué hora y a qué ventanilla fue**. No graba el número de tu tarjeta ni tu clave. Si grabara eso, la grabación sería un tesoro para un ladrón.

> 🌎 **Otro ejemplo:** el cuaderno de visitas de un edificio: nombre, departamento y hora. Sin el cuaderno, si algo se pierde, nadie sabe quién estuvo.

En la tabla de OWASP de la clase 23 viste "**registro y monitoreo insuficientes**: te atacan y no te enteras". Esa es la falla de esta parte. Y en la clase 24 hiciste `limpiarRegistro`, para tapar claves. Ahora el cuadro completo.

**Qué SÍ anotar (eventos de seguridad):**

| Evento | Por qué |
|---|---|
| Entradas buenas y **malas** (con el usuario que se intentó) | Para ver a Hydra probando claves |
| Pedidos **rechazados por permiso** (403, "no es tuyo") | Para ver a alguien probando el IDOR |
| Cambios importantes: borrar, cambiar rol, cambiar correo o clave | Para la letra **R**: probar quién hizo qué |
| Errores del servidor (500) con su detalle | Para arreglarlos (el detalle va al registro, **no** a la persona: clase 91, V8) |
| Topes alcanzados (429, "demasiados pedidos") | Para ver un abuso o un robot |

**Cada línea con lo mismo:** la **hora** (en un formato fijo), el **tipo** de evento, **quién** (el id del usuario, no su nombre completo), **desde dónde** (la IP) y el **resultado**.

**Qué NUNCA anotar:** contraseñas (ni las malas: muchas veces son la buena con una letra cambiada), tokens y cookies de sesión, claves de APIs, números de tarjeta o de documento, y el cuerpo entero de los pedidos.

> 💡 **Idea:** escribe cada línea como **JSON** (con llaves y campos), no como una frase. Así una máquina la puede leer y contar: "dame todos los `login_fallido` del último minuto". A esto se le llama **registro estructurado**.

```js
// Mal: una frase. Difícil de contar, y lleva la clave.
console.log('Ana intentó entrar con clave123 y falló');

// Bien: una línea JSON, sin la clave.
console.log(JSON.stringify({ hora: new Date().toISOString(), tipo: 'login_fallido', usuario: 'ana', ip: '127.0.0.1' }));
```

> ⚠️ **Cuidado:** un registro también se puede **atacar**. Si alguien escribe como usuario `ana\n{"tipo":"login_bueno"}`, y tu registro es de frases, puede **inventar una línea falsa**. Con JSON, el salto de línea queda escapado dentro del texto (`\n`) y no se puede colar. Es la misma idea que escapar el HTML (clase 108): lo que viene de afuera es dato, no formato.

> 🧩 **Piezas para este ejercicio**
> - Construye la línea de registro copiando solo los campos permitidos. Después convierte ese objeto a JSON. Así no se guardan campos nuevos por accidente.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: Una línea de registro que sirve y no filtra
lenguaje: js
pide: Completa `lineaDeRegistro(evento)`. Devuelve un texto JSON (con `JSON.stringify`) que tenga **solo** estos campos del evento: `hora`, `tipo`, `usuario`, `ip` y `resultado`. Cualquier otro campo (como `clave` o `token`) no se copia.
--- código
function lineaDeRegistro(evento) {
  // tu código aquí
}
--- pruebas
const e = { hora: '2026-11-19T10:00:00Z', tipo: 'login_fallido', usuario: 'ana', ip: '127.0.0.1', resultado: 401, clave: 'clave123', token: 'eyJ' };
prueba('lleva los cinco campos', () => igual(JSON.parse(lineaDeRegistro(e)), { hora: '2026-11-19T10:00:00Z', tipo: 'login_fallido', usuario: 'ana', ip: '127.0.0.1', resultado: 401 }));
prueba('nunca la clave', () => ok(!lineaDeRegistro(e).includes('clave123')));
prueba('nunca el token', () => ok(!lineaDeRegistro(e).includes('eyJ')));
prueba('un salto de línea no inventa otra línea', () => ok(!lineaDeRegistro({ ...e, usuario: 'ana\n{"tipo":"login_bueno"}' }).includes('\n')));
--- solución
function lineaDeRegistro(evento) {
  const { hora, tipo, usuario, ip, resultado } = evento;
  return JSON.stringify({ hora, tipo, usuario, ip, resultado });
}
```

```practica
vf :: Conviene guardar en el registro la contraseña que la persona escribió mal, para ver qué probó
elige :: ¿Por qué cada línea del registro conviene que sea JSON? :: Porque ocupa menos :: Porque una máquina la puede leer y contar, y un salto de línea no puede inventar otra línea :: Porque es más lindo
elige :: ¿Qué letra de STRIDE defiende sobre todo el registro de quién borró o cambió algo? :: S :: T :: R
escribe :: Nombra tres eventos que anotarías en el registro de la API de gastos y uno que nunca anotarías. :: Anoto: las entradas malas con el usuario y la IP, los pedidos rechazados por permiso (403) y los borrados con quién los hizo. Nunca anoto contraseñas ni tokens.
```

## Parte 3. Enterarse a tiempo: las alertas

> 🌎 **En la vida real:** una cámara que graba pero que nadie mira no evita el robo; solo lo cuenta después. La **alarma** es lo que hace que alguien llegue a tiempo.

> 🌎 **Otro ejemplo:** el banco te manda un mensaje cuando hay una compra rara con tu tarjeta. No espera a fin de mes.

Un registro sirve de verdad cuando **algo lo lee solo** y avisa. Las reglas de alerta más útiles son simples:

| Regla | Qué está pasando, probablemente |
|---|---|
| Más de **10 entradas malas** de la **misma IP** en un minuto | Alguien adivinando claves (Hydra) |
| Entradas malas a **muchos usuarios distintos** desde la misma IP | Probando una lista de claves filtradas (*credential stuffing*, clase 111) |
| Muchos **403** seguidos del mismo usuario | Alguien probando el IDOR, número por número |
| Un **cambio de rol** a administrador | Siempre se revisa, aunque sea legítimo |
| El **gasto de la nube** sube de golpe | Un abuso (por eso la alerta de presupuesto de `PENDIENTES.md`) |

> 💡 **Idea:** pocas alertas, y buenas. Si suena todo el día por cosas que no importan, la gente la apaga o deja de mirarla. A eso se le llama **fatiga de alertas**.

> 📌 **Nota:** las empresas grandes juntan los registros de todos sus servidores en un solo lugar para buscar y poner alertas (a ese tipo de sistema se le dice **SIEM**). En Firebase y Google Cloud, sin pagar nada extra, tienes **Cloud Logging** y sus alertas, que es lo mismo en chico.

> 🧩 **Piezas para este ejercicio**
> - Cuenta solo los eventos del tipo indicado. Compara cada total con el límite y ordena las IP que requieran revisión.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: La alarma de Hydra
lenguaje: js
pide: Completa `ipsSospechosas(eventos, limite)`. `eventos` es una lista de `{ tipo, ip }`. Cuenta cuántos `'login_fallido'` tiene cada IP y devuelve la lista de las IP que tienen **más** que `limite`, ordenada alfabéticamente con `.sort()`. Los otros tipos de evento no cuentan.
--- código
function ipsSospechosas(eventos, limite) {
  // tu código aquí
}
--- pruebas
const muchos = (ip, n) => Array.from({ length: n }, () => ({ tipo: 'login_fallido', ip }));
prueba('Hydra desde una IP', () => igual(ipsSospechosas([...muchos('10.0.0.9', 12), ...muchos('10.0.0.2', 2)], 10), ['10.0.0.9']));
prueba('justo en el límite no suena', () => igual(ipsSospechosas(muchos('10.0.0.9', 10), 10), []));
prueba('las entradas buenas no cuentan', () => igual(ipsSospechosas(Array.from({ length: 20 }, () => ({ tipo: 'login_bueno', ip: '10.0.0.5' })), 10), []));
prueba('dos IP, en orden', () => igual(ipsSospechosas([...muchos('10.0.0.9', 11), ...muchos('10.0.0.3', 11)], 10), ['10.0.0.3', '10.0.0.9']));
--- solución
function ipsSospechosas(eventos, limite) {
  const cuenta = {};
  for (const e of eventos) {
    if (e.tipo !== 'login_fallido') continue;
    cuenta[e.ip] = (cuenta[e.ip] || 0) + 1;
  }
  return Object.keys(cuenta).filter((ip) => cuenta[ip] > limite).sort();
}
```

```practica
vf :: Un registro que nadie lee igual sirve para frenar un ataque mientras pasa
elige :: Una IP prueba la clave de 300 usuarios distintos, una vez cada uno. ¿Qué es lo más probable? :: Un error de la app :: Alguien probando una lista de claves filtradas (credential stuffing) :: Un usuario que se olvidó la clave
elige :: ¿Qué es la fatiga de alertas? :: Que el servidor se cansa :: Que suenan tantas alertas sin importancia que la gente deja de mirarlas :: Que las alertas tardan
```

## Parte 4. Cuando pasó: responder a un incidente

> 🌎 **En la vida real:** si se te pierde la billetera, no te pones a investigar quién la robó primero. Primero **bloqueas las tarjetas**. Después ves qué había adentro, pides las nuevas y, al final, piensas cómo no volver a perderla.

> 🌎 **Otro ejemplo:** si sale agua por un caño roto, primero cierras la llave de paso. Secar el piso y llamar al plomero viene después.

Cuando hay un incidente, el orden importa más que la velocidad. Es casi siempre el mismo (lo usa, por ejemplo, la guía de incidentes del NIST, una institución de normas de Estados Unidos):

| Paso | Qué haces | En el ejemplo: la clave de la base se subió a GitHub |
|---|---|---|
| **1. Detectar** | Te enteras: una alerta, un aviso, gitleaks (clase 111) | gitleaks marca la clave en un commit |
| **2. Contener** | **Cortar el daño ya**, aunque no sepas todo | **Rotar la clave**: crear una nueva y apagar la vieja. Borrarla del código **no alcanza**: sigue en el historial y alguien ya pudo copiarla |
| **3. Investigar** | Con los **registros**: qué pasó, desde cuándo, qué se llevaron | Buscar en el registro de la base accesos con la clave vieja, desde IP que no son tuyas |
| **4. Recuperar** | Volver a funcionar normal, de forma segura | Poner la clave nueva en un lugar secreto (variables de entorno), no en el código |
| **5. Avisar** | A quién corresponda: tu jefe, los usuarios afectados, y la autoridad si la ley lo pide | Si se leyeron datos personales, en Brasil la LGPD pide avisar a la ANPD y a las personas |
| **6. Aprender** | Escribir qué pasó y qué se cambia para que no se repita | Agregar gitleaks al CI para que frene la subida la próxima vez |

**El informe de después (*post-mortem*) se escribe sin culpables.** No dice "Juan se equivocó". Dice "**el sistema dejó** que una clave llegara a GitHub sin que nada la frenara; ahora la frena el CI". Si la gente tiene miedo, esconde los errores, y un error escondido no se arregla.

> 💡 **Idea:** prepara el plan **antes** de necesitarlo, en una hoja: a quién llamar, dónde se rotan las claves, cómo se apaga una función. En medio del susto nadie piensa bien. Es como el plan de evacuación pegado en la puerta del hotel.

> 🎙️ **El profesor dice:** esto ya lo viviste. En la auditoría de este sitio (clase 108) se encontró el oráculo de las prácticas: se **contuvo** (la función dejó de decir qué estaba mal), se **investigó** (cómo funcionaba), se **recuperó** (se publicó el arreglo) y se **aprendió** (se volvió una lección, con su prueba). Eso es una respuesta a incidente en chico.

> 🧩 **Piezas para este ejercicio**
> - El orden del plan marca la prioridad de cada paso. Usa una lista nueva y conserva los pasos que estén entre los que se recibieron.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: El orden de la respuesta
lenguaje: js
pide: Completa `ordenar(pasos)`. Recibe una lista de pasos desordenados (textos) y la devuelve en el orden correcto: `'detectar'`, `'contener'`, `'investigar'`, `'recuperar'`, `'avisar'`, `'aprender'`. Puede faltar alguno: los que estén, van en ese orden. No cambies la lista original (usa una copia).
--- código
const ORDEN = ['detectar', 'contener', 'investigar', 'recuperar', 'avisar', 'aprender'];

function ordenar(pasos) {
  // tu código aquí
}
--- pruebas
prueba('todos desordenados', () => igual(ordenar(['aprender', 'contener', 'detectar', 'avisar', 'investigar', 'recuperar']), ORDEN));
prueba('contener va antes de investigar', () => igual(ordenar(['investigar', 'contener']), ['contener', 'investigar']));
prueba('no cambia la original', () => { const l = ['aprender', 'detectar']; ordenar(l); igual(l, ['aprender', 'detectar']); });
--- solución
const ORDEN = ['detectar', 'contener', 'investigar', 'recuperar', 'avisar', 'aprender'];

function ordenar(pasos) {
  return [...pasos].sort((a, b) => ORDEN.indexOf(a) - ORDEN.indexOf(b));
}
```

```practica
elige :: Encuentras la clave de la base de datos en un commit viejo de GitHub. ¿Qué haces primero? :: Borrar el archivo y subir otro commit :: Rotar la clave: crear una nueva y apagar la vieja :: Buscar quién la subió
vf :: En un incidente, primero hay que entender todo lo que pasó y después contener el daño
vf :: Un buen post-mortem dice qué persona se equivocó, para que no vuelva a pasar
escribe :: Cuenta cómo respondiste a un hallazgo de seguridad real (el oráculo de las prácticas de este sitio) con los pasos de la respuesta a incidentes. :: Lo detectó una auditoría en otra sesión. Lo contuve cambiando la función para que, si no apruebas, no diga cuáles preguntas están mal. Investigué cómo se podía usar para sacar las respuestas una por una. Lo recuperé publicando el arreglo con su prueba, y lo aprendí convirtiéndolo en una lección del curso.
```


**Comprobación antes de seguir**

Ante una alerta ficticia, decide qué registrarías, a quién avisarías y qué dato excluirías.

<details>
<summary>Necesito una pista</summary>

Incluye hora, tipo de evento y contexto operativo sin registrar contraseñas ni credenciales.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo piensas la seguridad de una app nueva?":** "Antes de programar hago un modelo de amenazas: dibujo la app, marco las fronteras de confianza, donde entra algo que no controlo, y en cada una paso la lista STRIDE: hacerse pasar por otro, cambiar datos, negar lo hecho, filtrar información, tumbar el servicio y subir de permisos. Cada amenaza termina en una defensa y en una prueba que la demuestra. Mientras corre, dejo registros estructurados de los eventos de seguridad, sin claves ni tokens, con un par de alertas buenas, como muchas entradas malas desde una misma IP. Y tengo escrito qué hacer si pasa algo: contener primero, por ejemplo rotar una clave filtrada, después investigar con los registros, recuperar, avisar y escribir un post-mortem sin culpables."

> 🎤 **Si te preguntan "¿qué harías si se filtra una clave?":** "La roto enseguida: creo una nueva y apago la vieja, porque borrarla del código no sirve: queda en el historial. Después miro los registros para ver si alguien la usó, la pongo en una variable de entorno y agrego gitleaks al CI para que no pueda volver a subirse."

> 🌎 **En la vida real:** es como el plan de un edificio: puertas con llave (el modelo de amenazas), cámaras y alarma (registros y alertas) y un plan de evacuación (la respuesta a incidentes).

> 🌎 **Otro ejemplo:** es como un piloto: revisa la lista antes de despegar, mira los instrumentos en el vuelo y tiene un manual para cada emergencia.
