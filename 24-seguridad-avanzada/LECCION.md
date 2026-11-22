# Tema 24: Seguridad avanzada — auditar un sistema entero

> 🌎 **En la vida real:** una cosa es saber que una ventana se puede forzar; otra es recorrer un edificio completo con un plano, anotar cada riesgo, decir cuál es más grave y entregar un informe para arreglarlo. Eso es una **auditoría**.

> 🎙️ **El profesor dice:** esta es la última clase de teoría del curso de seguridad (después viene el proyecto final: auditar una app de verdad). Vas a aprender a hacer lo que hicimos con Copiloto Driver antes de publicarlo: una auditoría por categorías, con severidad, pruebas y correcciones. También vas a ver el abuso de costos en la nube, las herramientas de un *pentester*, cómo reportar fallas de forma responsable y por dónde seguir si quieres trabajar en esto.

## Parte 1. Cómo se hace una auditoría

> 🌎 **En la vida real:** es como la inspección de un carro usado antes de comprarlo: un mecánico revisa por partes, con una lista, y te dice qué es grave y qué puede esperar.

> 🌎 **Otro ejemplo:** Es como el chequeo médico anual: no buscas una enfermedad en particular, revisas todo con orden.

### El alcance

Primero se escribe **qué** se va a revisar y **qué no**: qué repositorios, qué servicios, qué ambiente (nunca producción sin permiso y sin plan), hasta qué fecha. Sin alcance, no hay auditoría: hay curiosidad.

> 🌎 **En la vida real:** un electricista contratado para "revisar la cocina" no se mete a desarmar el baño.

> 🌎 **Otro ejemplo:** Es como un presupuesto de obra: dice exactamente qué incluye.

### Las categorías

La auditoría de Copiloto revisó **cinco categorías**, una por una:
1. **Aislamiento por dueño:** ¿cada persona ve solo lo suyo?
2. **Permisos en el navegador:** ¿hay decisiones de seguridad hechas solo en la app?
3. **IDOR:** ¿se puede pedir algo ajeno cambiando un id?
4. **Secretos:** ¿hay claves en el código o en el repositorio?
5. **XSS:** ¿algún texto del usuario se muestra como HTML?

Para cada categoría se busca en el código (por ejemplo, todos los `allow read`, todos los `innerHTML`, todas las cadenas que parecen claves).

> 🌎 **En la vida real:** es como revisar una casa por sistemas: primero la electricidad, después el agua, después el gas.

> 🌎 **Otro ejemplo:** Es como corregir un examen pregunta por pregunta en vez de leerlo todo de una vez.

### La severidad

Cada hallazgo lleva una **severidad**: **crítica, alta, media, baja o informativa**. Se decide por dos cosas: **qué tan fácil** es explotarlo y **qué tanto daño** hace. Un sistema muy usado para esto es **CVSS** (de 0 a 10).

| Severidad | Ejemplo |
|---|---|
| Crítica | Cualquiera puede leer los datos de todos los usuarios |
| Alta | Un usuario puede cambiar datos de otro |
| Media | Se puede abusar de una función y generar costos |
| Baja | Un límite de la app se salta con trabajo, sin dañar a otros |
| Informativa | Una mejora recomendada, sin falla explotable |

> 🌎 **En la vida real:** en la sala de urgencias no atienden por orden de llegada: atienden primero al más grave.

> 🌎 **Otro ejemplo:** Es como la lista de arreglos de una casa: el techo que se cae va antes que la pintura.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La severidad de cada hallazgo
lenguaje: js
pide: Completa `severidad(dano, facil)`. `dano` es `'todos'` (afecta a todos los usuarios), `'otro'` (a otro usuario), `'costos'` (gasta tu dinero), `'propio'` (solo se salta algo de la propia cuenta) o `'ninguno'`. `facil` es `true` si cualquiera lo explota sin trabajo. Tabla: `todos` → `'crítica'` si es fácil, si no `'alta'`; `otro` → `'alta'`; `costos` → `'media'`; `propio` → `'baja'`; `ninguno` → `'informativa'`.
--- código
function severidad(dano, facil) {
  // tu código aquí
}
--- pruebas
prueba('cualquiera lee los datos de todos', () => igual(severidad('todos', true), 'crítica'));
prueba('lo mismo, pero difícil', () => igual(severidad('todos', false), 'alta'));
prueba('cambiar datos de otro', () => igual(severidad('otro', true), 'alta'));
prueba('abusar de una función que cuesta', () => igual(severidad('costos', true), 'media'));
prueba('lo propio y lo informativo', () => igual([severidad('propio', true), severidad('ninguno', false)], ['baja', 'informativa']));
--- solución
function severidad(dano, facil) {
  if (dano === 'todos') return facil ? 'crítica' : 'alta';
  if (dano === 'otro') return 'alta';
  if (dano === 'costos') return 'media';
  if (dano === 'propio') return 'baja';
  return 'informativa';
}
```

```practica
vf :: Una auditoría empieza buscando fallas en producción sin plan
vf :: La severidad depende de qué tan fácil es explotar la falla y cuánto daño hace
elige :: ¿Cuál de estas fue una categoría de la auditoría de Copiloto? :: Colores de la app :: Aislamiento por dueño :: Velocidad de carga
elige :: "Cualquiera puede leer los datos de todos los usuarios" es… :: Baja :: Informativa :: Crítica
elige :: ¿Qué es CVSS? :: Un lenguaje :: Un sistema para puntuar la gravedad de una falla de 0 a 10 :: Un antivirus
escribe :: Escribe el alcance de una auditoría para este mismo mapa de estudios. :: Por ejemplo: revisar web/ (vistas/, nube.js, practica.js) y firebase/ (reglas), solo en el emulador y en una copia local; categorías: aislamiento por dueño, permisos en el navegador, IDOR, secretos y XSS; sin tocar los datos reales.
```

## Parte 2. Leer reglas de Firebase como atacante

> 🌎 **En la vida real:** un inspector de bomberos no lee el reglamento del edificio como un vecino: lo lee buscando la puerta de emergencia que está trabada.

> 🌎 **Otro ejemplo:** Es como un abogado leyendo un contrato: busca la cláusula que te puede perjudicar.

### La lista de preguntas

Para cada `match` de tus reglas, pregúntate:
1. ¿Hay algún `allow read, write: if true` o `if request.auth != null` **solo**? (cualquiera con cuenta entra a todo).
2. ¿`read` incluye `list` sin querer?
3. ¿Se comprueba que el `uid` del documento es el de la sesión?
4. En `create` y `update`, ¿se limitan los **campos** (`keys().hasOnly`) y sus **tipos**?
5. ¿Se puede cambiar un campo que no debería cambiar (rol, saldo, dueño, fecha)?
6. ¿Las fechas vienen del servidor (`request.time`)?
7. ¿Se puede **borrar** algo que no debería?

> 🌎 **En la vida real:** es como la lista que revisa un piloto antes de despegar: una por una, aunque parezca obvio.

> 🌎 **Otro ejemplo:** Es como revisar un formulario de banco: ¿qué casillas puede llenar el cliente y cuáles solo el banco?

### El error del "rol" en el documento

Un caso clásico: el perfil tiene `rol: 'usuario'` y la regla deja que el dueño actualice **su** perfil. Si no se limitan los campos, el usuario manda `rol: 'admin'` y se vuelve administrador.

```js
// ❌ Malo
allow update: if request.auth.uid == uid;
// ✅ Bueno: el rol no puede cambiar
allow update: if request.auth.uid == uid
  && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['nombre', 'foto']);
```

> 🌎 **En la vida real:** es como dejar que cada empleado edite su propia ficha… incluido el sueldo.

> 🌎 **Otro ejemplo:** Es como un carnet de socio donde el socio puede escribir "VIP" con su propio lápiz.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El error del rol en el perfil
lenguaje: js
pide: Esta regla deja que el dueño actualice su perfil **entero**, así que puede mandarse `rol: 'admin'`. Arregla `puedeActualizar(sesionUid, uidDelDoc, antes, despues)` como la regla buena: tiene que ser el dueño **y** los campos que cambiaron (los que tienen distinto valor entre `antes` y `despues`, o que aparecen o desaparecen) tienen que estar todos en `['nombre', 'foto']`.
--- código
const EDITABLES = ['nombre', 'foto'];

function puedeActualizar(sesionUid, uidDelDoc, antes, despues) {
  return sesionUid === uidDelDoc;
}
--- pruebas
const perfil = { nombre: 'Ana', foto: 'a.png', rol: 'usuario' };
prueba('cambiar su nombre, sí', () => igual(puedeActualizar('ana', 'ana', perfil, { ...perfil, nombre: 'Ana Paula' }), true));
prueba('volverse admin, no', () => igual(puedeActualizar('ana', 'ana', perfil, { ...perfil, rol: 'admin' }), false));
prueba('agregarse un campo nuevo, no', () => igual(puedeActualizar('ana', 'ana', perfil, { ...perfil, saldo: 99999 }), false));
prueba('borrar el rol, no', () => { const { rol, ...sinRol } = perfil; igual(puedeActualizar('ana', 'ana', perfil, sinRol), false); });
prueba('el perfil de otro, no', () => igual(puedeActualizar('beto', 'ana', perfil, { ...perfil, nombre: 'X' }), false));
--- solución
const EDITABLES = ['nombre', 'foto'];

function puedeActualizar(sesionUid, uidDelDoc, antes, despues) {
  if (sesionUid !== uidDelDoc) return false;
  const llaves = new Set([...Object.keys(antes), ...Object.keys(despues)]);
  const cambiaron = [...llaves].filter((k) => JSON.stringify(antes[k]) !== JSON.stringify(despues[k]));
  return cambiaron.every((k) => EDITABLES.includes(k));
}
```

```practica
vf :: allow write: if request.auth != null deja que cualquier persona con cuenta escriba en todo ese lugar
vf :: Si el dueño puede actualizar su perfil sin limitar campos, podría cambiarse el rol
elige :: ¿Qué hace keys().hasOnly([...])? :: Cuenta documentos :: Exige que el documento no traiga campos fuera de esa lista :: Borra campos
elige :: ¿Por qué las fechas deben ser request.time? :: Porque es más lindo :: Porque así las pone el servidor y nadie las inventa :: Porque es más corto
escribe :: Encuentra el problema: match /pedidos/{id} { allow read: if request.auth != null; } :: Cualquier persona con cuenta puede leer (y listar) todos los pedidos; habría que exigir que resource.data.dueno == request.auth.uid y pensar si list debe estar permitido.
```

## Parte 3. Abuso de funciones y de costos

> 🌎 **En la vida real:** un local que regala muestras gratis sin límite: alguien llega con una bolsa y se lleva todo. No te roba la caja, pero te deja sin mercadería.

> 🌎 **Otro ejemplo:** Es como dejar una línea telefónica abierta que cobra por llamada: alguien hace mil llamadas y la cuenta llega a ti.

### Funciones públicas que cuestan dinero

Algunas funciones en la nube hacen cosas que **cuestan**: mandar SMS, mandar correos, llamar a una IA, procesar imágenes. Si cualquiera puede llamarlas sin límite, un robot puede **gastar tu crédito** o usar tu sistema para molestar a otros (por ejemplo, mandar SMS a teléfonos ajenos). Esto se llama a veces **denegación de billetera**.

Defensas, en capas:
- Exigir sesión cuando tiene sentido.
- **Límites** por destino, por usuario, por IP y **globales por día**.
- **Alertas de presupuesto** en la nube (como la de 10 reales del proyecto de este mapa).

> 🌎 **En la vida real:** es como el tope diario de la tarjeta: aunque la roben, el daño tiene techo.

> 🌎 **Otro ejemplo:** Es como el grifo con temporizador de un baño público: se corta solo aunque alguien lo deje abierto.

### App Check: que solo tu app pueda llamar

**Firebase App Check** comprueba que la petición viene **de tu app de verdad** (instalada desde la tienda, o tu sitio) y no de un programa cualquiera. En Android usa *Play Integrity*; en iPhone, *App Attest*; en la web, reCAPTCHA. Con `enforceAppCheck: true`, la función rechaza a quien no lo tenga. No reemplaza los límites: los complementa.

> 🌎 **En la vida real:** es como un club que, además de tu carnet, mira que llegues en el bus oficial del club.

> 🌎 **Otro ejemplo:** Es como un cajero que solo acepta tarjetas del propio banco.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un cupo para los SMS que cuestan
lenguaje: js
pide: Mandar un SMS cuesta. Completa `crearCupo({ porDestino, globalPorDia })`: devuelve `enviar(destino, dia)`, que dice `true` si se puede mandar y lo cuenta. Se niega (`false`) si ese destino ya recibió `porDestino` mensajes ese día, o si en total ya se mandaron `globalPorDia` ese día. Un día nuevo empieza de cero. Un intento negado **no** cuenta.
--- código
function crearCupo({ porDestino, globalPorDia }) {
  // tu código aquí
}
--- pruebas
prueba('por destino', () => { const enviar = crearCupo({ porDestino: 2, globalPorDia: 100 }); igual([enviar('+5547999', '2026-11-18'), enviar('+5547999', '2026-11-18'), enviar('+5547999', '2026-11-18')], [true, true, false]); });
prueba('un robot con muchos números choca con el global', () => { const enviar = crearCupo({ porDestino: 2, globalPorDia: 3 }); igual(['a', 'b', 'c', 'd'].map((n) => enviar(n, '2026-11-18')), [true, true, true, false]); });
prueba('un día nuevo, de cero', () => { const enviar = crearCupo({ porDestino: 1, globalPorDia: 1 }); enviar('a', '2026-11-18'); igual(enviar('a', '2026-11-19'), true); });
prueba('lo negado no gasta el cupo de otros', () => { const enviar = crearCupo({ porDestino: 1, globalPorDia: 2 }); enviar('a', 'd'); enviar('a', 'd'); enviar('a', 'd'); igual(enviar('b', 'd'), true); });
--- solución
function crearCupo({ porDestino, globalPorDia }) {
  const cuentas = new Map();
  return function enviar(destino, dia) {
    const deDestino = cuentas.get(`${dia}|${destino}`) || 0;
    const delDia = cuentas.get(dia) || 0;
    if (deDestino >= porDestino || delDia >= globalPorDia) return false;
    cuentas.set(`${dia}|${destino}`, deDestino + 1);
    cuentas.set(dia, delDia + 1);
    return true;
  };
}
```

```practica
vf :: Una función que manda SMS sin límites puede generar costos y molestar a terceros
vf :: App Check reemplaza los límites de uso
elige :: ¿Qué es "denegación de billetera"? :: Un banco que no abre :: Hacer que tu sistema gaste dinero sin control :: Un error de la tarjeta
elige :: ¿Cuál es una defensa contra el abuso de costos? :: Esconder la URL de la función :: Límites por usuario y globales, más alertas de presupuesto :: Usar un dominio más largo
elige :: ¿Qué usa App Check en Android? :: Face ID :: Play Integrity :: SMS
escribe :: Diseña las defensas de una función "pedirCodigoPorCorreo". :: Límite de un código cada 30 segundos por correo, máximo por día por correo, tope global diario, App Check para que solo la app pueda llamarla, alerta de presupuesto y registro de cada pedido para ver abusos.
```

## Parte 4. Pruebas de seguridad automáticas

> 🌎 **En la vida real:** una fábrica de autos no prueba los frenos una sola vez: los prueba en cada carro que sale de la línea.

> 🌎 **Otro ejemplo:** Es como la alarma de humo: no la revisas solo el día que la instalas.

### Las trampas como pruebas

Cada falla que encuentres se convierte en una **prueba** que intenta explotarla y espera que falle. Así, si alguien rompe las reglas sin querer el mes que viene, la prueba lo detecta. Es lo que hicimos con el certificado de este mapa (Tema 21) y con las reglas de Copiloto (la carpeta `rules-test`).

> 🌎 **En la vida real:** es como una vacuna: una vez que conoces la enfermedad, quedas protegido para la próxima.

> 🌎 **Otro ejemplo:** Es como el cartel "cuidado, escalón" que pones después de que alguien se tropezó.

### En el CI, en cada subida

Las pruebas de reglas se pueden correr en el **CI** (Tema 04) en cada push: si una regla se rompe, el cambio no se publica. Junto a ellas: `npm audit` y un escáner de secretos (como *gitleaks*) que avisa si alguien sube una clave.

```yaml
# Idea de un paso de CI (GitHub Actions)
- run: npx firebase emulators:exec --only firestore "npm test"
- run: npm audit --audit-level=high
```

> 🌎 **En la vida real:** es como el detector de metales del aeropuerto: revisa a todos, todo el tiempo, sin cansarse.

> 🌎 **Otro ejemplo:** Es como el corrector ortográfico: revisa cada palabra que escribes sin que se lo pidas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Trampas que atrapan una regla rota
lenguaje: js
pide: La regla `puedeLeer(sesion, doc)` deja leer un gasto solo a su dueño con sesión. Escribe tus **trampas** en `TRAMPAS`: casos `{ sesion, doc, deja }` donde `deja` es lo que la regla buena tiene que contestar. Las pruebas corren tus trampas contra la regla buena (todas tienen que pasar) y contra **tres reglas rotas**: una que deja a cualquiera con sesión, una que deja sin sesión, y una que compara al revés (deja a todos menos al dueño). Cada regla rota tiene que fallar en **alguna** trampa.
--- código
function puedeLeer(sesion, doc) {
  return sesion !== null && sesion.uid === doc.dueno;
}

const TRAMPAS = [
  { sesion: { uid: 'ana' }, doc: { dueno: 'ana' }, deja: true },
  // tus trampas aquí
];
--- pruebas
const fallaAlguna = (regla) => TRAMPAS.some((t) => { try { return regla(t.sesion, t.doc) !== t.deja; } catch (e) { return true; } });
prueba('con la regla buena, tus trampas pasan', () => ok(!fallaAlguna(puedeLeer), 'alguna trampa dice mal lo que tiene que pasar'));
prueba('atrapan "cualquiera con sesión"', () => ok(fallaAlguna((s) => s !== null), 'falta una trampa: otro usuario con sesión'));
prueba('atrapan "sin sesión"', () => ok(fallaAlguna((s, d) => s === null || s.uid === d.dueno), 'falta una trampa: sin sesión (null)'));
prueba('atrapan la comparación al revés', () => ok(fallaAlguna((s, d) => s !== null && s.uid !== d.dueno), 'con la que ya está debería bastar: ¿la borraste?'));
--- solución
function puedeLeer(sesion, doc) {
  return sesion !== null && sesion.uid === doc.dueno;
}

const TRAMPAS = [
  { sesion: { uid: 'ana' }, doc: { dueno: 'ana' }, deja: true },
  { sesion: { uid: 'beto' }, doc: { dueno: 'ana' }, deja: false },
  { sesion: null, doc: { dueno: 'ana' }, deja: false },
];
```

```practica
vf :: Una falla corregida no necesita prueba porque ya está arreglada
vf :: Las pruebas de reglas de Firestore se pueden correr en el CI en cada subida
elige :: ¿Qué hace un escáner de secretos como gitleaks? :: Cifra el código :: Avisa si en el repositorio aparece algo que parece una clave :: Borra el historial
elige :: Si una prueba de seguridad falla en el CI… :: Se publica igual :: El cambio no se publica hasta arreglarlo :: Se borra la prueba
escribe :: Convierte esta falla en una prueba: "un usuario puede cambiarse el rol a admin". :: Una prueba que inicia sesión como un usuario normal, intenta actualizar su perfil con rol igual a admin y comprueba con assertFails que Firestore lo rechaza.
```

## Parte 5. Las herramientas del pentester

> 🌎 **En la vida real:** un cerrajero profesional tiene un maletín de herramientas; ninguna es ilegal en sí, lo ilegal es usarlas en puertas ajenas.

> 🌎 **Otro ejemplo:** Es como el estetoscopio de un médico: sirve para escuchar el cuerpo, no para lastimarlo.

### Interceptar el tráfico: un proxy

**Burp Suite** (Community, gratis) u **OWASP ZAP** se ponen en el medio entre tu navegador y **tu** sitio: ves cada petición, la puedes **cambiar** y reenviar. Así pruebas IDOR (cambiar un id), campos de más o saltarte validaciones de la pantalla.

> 🌎 **En la vida real:** es como abrir una carta antes de mandarla, cambiar una palabra y volver a cerrarla, para ver si el destinatario se da cuenta.

> 🌎 **Otro ejemplo:** Es como un traductor en una reunión que puede cambiar lo que dices: muestra lo frágil que es confiar en el mensaje.

### Explorar: nmap y el reconocimiento

**nmap** muestra qué "puertas" (puertos) tiene abiertas un servidor. El **reconocimiento** es juntar información pública: subdominios, tecnologías, archivos olvidados (`/.env`, `/backup.zip`). Contra **tus** servidores, te muestra lo que ve un atacante.

> 🌎 **En la vida real:** es como dar una vuelta alrededor de tu casa para contar puertas y ventanas antes de comprar alarmas.

> 🌎 **Otro ejemplo:** Es como mirar tu propio perfil en una red social "como público" para ver qué ve un extraño.

### Laboratorios para practicar sin romper la ley

- **OWASP Juice Shop:** una tienda web hecha a propósito con decenas de fallas.
- **PortSwigger Web Security Academy:** lecciones y laboratorios gratis de cada falla web.
- **TryHackMe** y **Hack The Box:** máquinas para atacar, de principiante a experto.
- **CTF** (*Capture The Flag*): competencias de seguridad.

> 🌎 **En la vida real:** es como un campo de tiro: disparas cuanto quieras, sin poner a nadie en peligro.

> 🌎 **Otro ejemplo:** Es como un simulador de manejo con lluvia y nieve: practicas lo difícil en un lugar seguro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El inventario de puertas abiertas de TU servidor
lenguaje: js
pide: Corriste un escaneo de puertos contra **tu** servidor y tienes su salida. Completa `puertosAbiertos(salida)`: de las líneas como `22/tcp   open   ssh`, devuelve `{ puerto, servicio }` (el puerto como número) solo de las que dicen `open`. Y `sorpresas(abiertos, esperados)`: los puertos abiertos que **no** esperabas (lo que hay que revisar o cerrar).
--- código
function puertosAbiertos(salida) {
  // tu código aquí
}

function sorpresas(abiertos, esperados) {
  // tu código aquí
}
--- pruebas
const salida = `PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https
3306/tcp open     mysql
8080/tcp filtered http-proxy`;
prueba('los abiertos', () => igual(puertosAbiertos(salida), [{ puerto: 22, servicio: 'ssh' }, { puerto: 80, servicio: 'http' }, { puerto: 443, servicio: 'https' }, { puerto: 3306, servicio: 'mysql' }]));
prueba('la base de datos no tenía que verse desde afuera', () => igual(sorpresas(puertosAbiertos(salida), [22, 80, 443]), [{ puerto: 3306, servicio: 'mysql' }]));
prueba('sin sorpresas', () => igual(sorpresas([{ puerto: 443, servicio: 'https' }], [80, 443]), []));
--- solución
function puertosAbiertos(salida) {
  return salida
    .split('\n')
    .map((l) => l.trim().split(/\s+/))
    .filter((c) => /^\d+\/tcp$/.test(c[0]) && c[1] === 'open')
    .map((c) => ({ puerto: Number(c[0].split('/')[0]), servicio: c[2] }));
}

function sorpresas(abiertos, esperados) {
  return abiertos.filter((a) => !esperados.includes(a.puerto));
}
```

```practica
vf :: Usar Burp Suite contra el sitio de tu banco para "probar" está bien si no robas nada
vf :: Un proxy como Burp o ZAP permite cambiar una petición y reenviarla
elige :: ¿Qué muestra nmap? :: Las contraseñas :: Qué puertos tiene abiertos un servidor :: El código fuente
elige :: ¿Dónde practicar ataques web de forma legal? :: En cualquier tienda online :: En OWASP Juice Shop o PortSwigger Web Security Academy :: En el sitio de la escuela
escribe :: Explica cómo usarías un proxy para probar IDOR en tu propia app. :: Entro con mi cuenta, capturo la petición que pide un dato mío, cambio el id por el de otra cuenta de prueba mía y la reenvío; si me devuelve el dato ajeno, hay IDOR.
```

## Parte 6. Reportar y corregir

> 🌎 **En la vida real:** si ves que el balcón del vecino está por caerse, no lo empujas para demostrarlo: le avisas, en privado, con una foto y tiempo para arreglarlo.

> 🌎 **Otro ejemplo:** Es como un médico que encuentra algo en un análisis: lo explica, dice qué tan grave es y qué hacer.

### Cómo se escribe un hallazgo

Cada hallazgo del informe de Copiloto tenía las mismas partes:
1. **Título** claro.
2. **Severidad** y **categoría**.
3. **Dónde** (archivo y línea).
4. **Descripción**: qué pasa.
5. **Cómo se explota**: el paso a paso, sin dañar a nadie.
6. **Corrección** recomendada.

Después cada uno se convirtió en una tarea (*issue*) y se cerró con un commit que dice qué se arregló.

> 🌎 **En la vida real:** es como el informe de un perito de seguros: qué pasó, dónde, cuánto daño y qué hay que reparar.

> 🌎 **Otro ejemplo:** Es como una receta médica: diagnóstico, tratamiento y control.

### Divulgación responsable y recompensas

Si encuentras una falla en un sistema ajeno **dentro de un programa permitido**, se avisa **en privado** a la empresa y se le da tiempo para arreglarla antes de contarlo. Muchas empresas tienen programas de **bug bounty** (pagan por fallas reportadas así) en plataformas como HackerOne o Bugcrowd, siempre con reglas de qué se puede probar.

> 🌎 **En la vida real:** es como encontrar una billetera: la devuelves al dueño, no publicas su contenido.

> 🌎 **Otro ejemplo:** Es como el periodista que avisa a la autoridad antes de publicar una noticia que pondría gente en peligro.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un hallazgo bien escrito
lenguaje: js
pide: Completa `queFalta(hallazgo)`: devuelve, en el orden de `PARTES`, las partes que faltan o están vacías (texto en blanco). Y `ordenarPorSeveridad(hallazgos)`: una lista **nueva** de la más grave a la menos grave (`crítica`, `alta`, `media`, `baja`, `informativa`); los de la misma severidad, en el orden en que venían.
--- código
const PARTES = ['titulo', 'severidad', 'categoria', 'donde', 'descripcion', 'comoSeExplota', 'correccion'];
const ORDEN = ['crítica', 'alta', 'media', 'baja', 'informativa'];

function queFalta(hallazgo) {
  // tu código aquí
}

function ordenarPorSeveridad(hallazgos) {
  // tu código aquí
}
--- pruebas
const completo = { titulo: 'IDOR en facturas', severidad: 'alta', categoria: 'Control de acceso roto', donde: 'api/facturas.js:12', descripcion: 'Devuelve cualquier factura', comoSeExplota: 'Cambiar el id en la dirección', correccion: 'Comparar el dueño con la sesión' };
prueba('completo', () => igual(queFalta(completo), []));
prueba('le falta dónde y cómo se arregla', () => igual(queFalta({ ...completo, donde: '  ', correccion: undefined }), ['donde', 'correccion']));
const lista = [{ t: 'a', severidad: 'baja' }, { t: 'b', severidad: 'crítica' }, { t: 'c', severidad: 'alta' }, { t: 'd', severidad: 'baja' }];
prueba('de la más grave a la menos', () => igual(ordenarPorSeveridad(lista).map((h) => h.t), ['b', 'c', 'a', 'd']));
prueba('no cambia la lista original', () => { ordenarPorSeveridad(lista); igual(lista.map((h) => h.t), ['a', 'b', 'c', 'd']); });
--- solución
const PARTES = ['titulo', 'severidad', 'categoria', 'donde', 'descripcion', 'comoSeExplota', 'correccion'];
const ORDEN = ['crítica', 'alta', 'media', 'baja', 'informativa'];

function queFalta(hallazgo) {
  return PARTES.filter((p) => !String(hallazgo[p] ?? '').trim());
}

function ordenarPorSeveridad(hallazgos) {
  return [...hallazgos].sort((a, b) => ORDEN.indexOf(a.severidad) - ORDEN.indexOf(b.severidad));
}
```

```practica
vf :: Al encontrar una falla en un programa de bug bounty, lo correcto es publicarla primero en redes
vf :: Un buen hallazgo dice dónde está, cómo se explota y cómo se corrige
elige :: ¿Qué es un bug bounty? :: Un virus :: Un programa donde una empresa paga por fallas reportadas siguiendo sus reglas :: Una multa
elige :: ¿Qué hacer con cada hallazgo después del informe? :: Olvidarlo :: Convertirlo en una tarea, arreglarlo y dejar una prueba :: Borrar el informe
escribe :: Escribe un hallazgo corto para: "cualquiera puede listar todos los certificados". :: Título: Certificados se pueden listar. Severidad: media. Dónde: firestore.rules, match certificados. Descripción: allow read incluye list. Explotación: getDocs de la colección devuelve todos los nombres. Corrección: allow get if true y allow list if false, con una prueba que lo confirme.
```

## Parte 7. Defensa en profundidad, registros y privacidad

> 🌎 **En la vida real:** un castillo no tiene una sola muralla: tiene foso, muralla, torre y guardias. Si una capa falla, la siguiente aguanta.

> 🌎 **Otro ejemplo:** Es como tu celular: bloqueo con huella, contraseña de las apps del banco y aviso si alguien entra desde otro lugar.

### Capas

Ninguna defensa es perfecta, así que se ponen **varias**: validación en la pantalla (para ayudar), reglas en el servidor (para proteger), límites de uso, App Check, alertas de presupuesto, pruebas automáticas y registros. El certificado de este mapa usa varias: cuenta verificada, reglas, espera, lote validado y verificación pública.

> 🌎 **En la vida real:** es como cuidar la plata: parte en el banco, parte en una cuenta separada, y la tarjeta con límite.

> 🌎 **Otro ejemplo:** Es como vestirse para el frío: camiseta, buzo y chaqueta; si una no alcanza, suma la otra.

### Registros y alertas

Si no registras lo importante (inicios de sesión fallidos, cambios de permisos, picos de uso), te atacan y no te enteras. Pero **los registros no deben guardar contraseñas ni datos sensibles**. Y alguien (o algo) tiene que mirarlos: alertas automáticas.

> 🌎 **En la vida real:** las cámaras de un local no sirven si nadie mira las grabaciones cuando falta mercadería.

> 🌎 **Otro ejemplo:** Es como el extracto del banco: si nunca lo lees, no ves el cobro raro.

### Privacidad: menos datos, menos riesgo

La **LGPD** (Brasil) y leyes parecidas piden recoger **solo los datos necesarios**, decir para qué, protegerlos y **borrarlos** cuando la persona lo pide. En Copiloto, borrar la cuenta pasó a borrar también el perfil y los archivos en la nube (antes quedaban huérfanos). En este mapa decidimos **no** pedir teléfono ni CPF.

> 🌎 **En la vida real:** es como una tienda que no pide tu número de documento para venderte un café.

> 🌎 **Otro ejemplo:** Es como vaciar los bolsillos de la ropa antes de donarla: no regalas lo que no querías dar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un registro sin datos sensibles
lenguaje: js
pide: Completa `limpiarRegistro(evento)`: devuelve una **copia** del evento lista para guardar. Los campos `password`, `token` y `cpf` se cambian por `'[oculto]'`. El `correo` se deja con la primera letra y el dominio: `'d***@gmail.com'`. Lo demás queda igual. No cambies el evento original.
--- código
const OCULTAR = ['password', 'token', 'cpf'];

function limpiarRegistro(evento) {
  // tu código aquí
}
--- pruebas
const evento = { tipo: 'login_fallido', correo: 'delvin@gmail.com', password: 'clave123', ip: '10.0.0.7', hora: '2026-11-18T10:00:00Z' };
prueba('la clave nunca se guarda', () => igual(limpiarRegistro(evento).password, '[oculto]'));
prueba('el correo, a medias', () => igual(limpiarRegistro(evento).correo, 'd***@gmail.com'));
prueba('lo demás queda igual', () => igual([limpiarRegistro(evento).tipo, limpiarRegistro(evento).ip], ['login_fallido', '10.0.0.7']));
prueba('token y CPF también', () => igual(limpiarRegistro({ token: 'eyJhbGciOi', cpf: '123.456.789-00' }), { token: '[oculto]', cpf: '[oculto]' }));
prueba('no cambia el original', () => { limpiarRegistro(evento); igual(evento.password, 'clave123'); });
--- solución
const OCULTAR = ['password', 'token', 'cpf'];

function limpiarRegistro(evento) {
  const limpio = { ...evento };
  for (const campo of OCULTAR) if (campo in limpio) limpio[campo] = '[oculto]';
  if (typeof limpio.correo === 'string' && limpio.correo.includes('@')) {
    const [usuario, dominio] = limpio.correo.split('@');
    limpio.correo = `${usuario[0]}***@${dominio}`;
  }
  return limpio;
}
```

```practica
vf :: Defensa en profundidad significa poner una sola defensa muy fuerte
vf :: Los registros deben guardar las contraseñas para investigar ataques
elige :: Según la LGPD, ¿qué datos conviene recoger? :: Todos los posibles :: Solo los necesarios, diciendo para qué :: Ninguno
elige :: ¿Qué se corrigió en Copiloto al borrar una cuenta? :: Nada :: Que también se borren el perfil y los archivos en la nube :: Que se borre la app del celular
escribe :: Enumera las capas de seguridad del certificado de este mapa. :: Cuenta de Gmail con correo verificado, reglas que aceptan un bombillo a la vez con hora del servidor, espera de 60 segundos, certificado emitido en un lote validado contra el progreso, un solo certificado por curso, verificación pública por código sin poder listar, y pruebas automáticas de las reglas.
```

## Parte 8. Tu camino en seguridad

> 🌎 **En la vida real:** nadie se vuelve cirujano leyendo un libro: estudia, practica en simuladores, hace guardias y, con los años, opera.

> 🌎 **Otro ejemplo:** Es como el cinturón en las artes marciales: blanco, amarillo, verde… cada uno con su examen.

### Qué estudiar después

1. **Redes:** cómo viaja la información (TCP/IP, DNS, HTTP).
2. **Linux y la terminal:** casi todos los servidores y herramientas viven ahí.
3. **Web a fondo:** PortSwigger Academy completo.
4. **Práctica:** TryHackMe (ruta para principiantes), después Hack The Box y CTF.
5. **Programación para automatizar:** Python y Bash.

> 🌎 **En la vida real:** es como aprender a manejar: primero las reglas y el carro, después la ruta, después la carretera.

> 🌎 **Otro ejemplo:** Es como construir una casa: cimientos (redes y Linux), paredes (web) y techo (práctica real).

### Certificaciones conocidas

- **CompTIA Security+:** la base, muy pedida en empleos.
- **eJPT** (INE): práctica, para principiantes en *pentesting*.
- **OSCP** (OffSec): difícil y muy respetada; un examen práctico de 24 horas.
- Para la nube: certificaciones de seguridad de Google Cloud, AWS o Azure.

> 💡 **Idea:** un portafolio vale tanto como un certificado: informes de auditoría de **tus** proyectos (como el de Copiloto), *write-ups* de laboratorios y CTF, y pruebas de seguridad en tus repositorios.

> 🌎 **En la vida real:** es como un músico: el diploma ayuda, pero lo que convence es escucharlo tocar.

> 🌎 **Otro ejemplo:** Es como un chef: el curso cuenta, pero el plato que sirves es la prueba.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El próximo paso de tu camino
lenguaje: js
pide: Completa `siguientePaso(hechos)`: devuelve el primer paso de `CAMINO` que todavía no está en `hechos`, o `'¡Camino completo! Sigue con CTF y tu portafolio'` si ya están todos. Y `portafolio(items)`: cuenta cuántos hay de cada tipo (`'informe'`, `'write-up'`, `'prueba'`) en un objeto, con los tres siempre presentes (en 0 si no hay).
--- código
const CAMINO = ['redes', 'linux', 'web', 'laboratorios', 'automatizar'];

function siguientePaso(hechos) {
  // tu código aquí
}

function portafolio(items) {
  // tu código aquí
}
--- pruebas
prueba('al empezar', () => igual(siguientePaso([]), 'redes'));
prueba('en el medio, aunque estén desordenados', () => igual(siguientePaso(['linux', 'redes', 'laboratorios']), 'web'));
prueba('todo hecho', () => igual(siguientePaso(CAMINO), '¡Camino completo! Sigue con CTF y tu portafolio'));
prueba('el portafolio', () => igual(portafolio([{ tipo: 'informe' }, { tipo: 'write-up' }, { tipo: 'write-up' }]), { informe: 1, 'write-up': 2, prueba: 0 }));
--- solución
const CAMINO = ['redes', 'linux', 'web', 'laboratorios', 'automatizar'];

function siguientePaso(hechos) {
  return CAMINO.find((p) => !hechos.includes(p)) ?? '¡Camino completo! Sigue con CTF y tu portafolio';
}

function portafolio(items) {
  const cuenta = { informe: 0, 'write-up': 0, prueba: 0 };
  for (const item of items) if (item.tipo in cuenta) cuenta[item.tipo] += 1;
  return cuenta;
}
```

```practica
vf :: Para trabajar en seguridad conviene aprender redes y Linux
vf :: La OSCP es una certificación teórica de opción múltiple
elige :: ¿Qué certificación es la base más pedida en empleos? :: OSCP :: CompTIA Security+ :: Ninguna
elige :: ¿Qué puede mostrar tu portafolio de seguridad? :: Fotos de tu computadora :: Informes de auditoría de tus proyectos y write-ups de laboratorios :: Contraseñas que adivinaste
escribe :: Arma tu plan de 3 meses para seguir aprendiendo seguridad. :: Por ejemplo: mes 1, redes básicas y Linux con TryHackMe; mes 2, PortSwigger Academy (control de acceso, inyección, XSS); mes 3, auditar uno de mis proyectos y escribir el informe, más algunos CTF de principiantes.
```


**Comprobación antes de seguir**

Documenta un control con su impacto, su corrección y una prueba que verifique la corrección.

<details>
<summary>Necesito una pista</summary>

Escribe qué conducta normal debe seguir funcionando.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿has hecho una auditoría de seguridad?":** "Sí, de mi app Copiloto Driver antes de publicarla. Definí el alcance, revisé cinco categorías (aislamiento por dueño, permisos en el cliente, IDOR, secretos y XSS), le di una severidad a cada hallazgo con su archivo, cómo se explotaba y cómo corregirlo, y después los cerré con commits y pruebas de reglas en el emulador. Por ejemplo, separé `get` de `list` en colecciones que se podían listar enteras, y corregí una regla que dejaba reservar un dato ajeno."

> 🌎 **En la vida real:** es como contar una obra que dirigiste: el plano, los problemas, las decisiones y el resultado.

> 🌎 **Otro ejemplo:** Es como el informe final de un proyecto de la universidad: qué hiciste, cómo y qué aprendiste.
