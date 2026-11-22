# Seguridad 8: los programas del día a día y del programador

> 🌎 **En la vida real:** en una casa segura no hay una sola cosa: hay buena cerradura, alarma, una lista de quién tiene llave, y alguien que revisa cada tanto si una ventana quedó abierta. Con los programas pasa igual: cada uno cubre una parte, y juntos son la seguridad de verdad.

> 🎙️ **El profesor dice:** {{alumno}}, hay programas de seguridad que usa **todo el mundo** (gestores de contraseñas, apps de segundo factor) y otros que usa **todo programador** (para encontrar claves filtradas o código peligroso antes de publicar). Hoy, uno por uno, con cinco preguntas para cada programa: **qué es**, **cómo funciona por dentro**, **para qué lo usa un defensor**, **cómo se usaría para atacar** y **cómo te defiendes de eso**. Todos son **gratis**.

## Parte 1. Gestores de contraseñas y apps de segundo factor

> 🌎 **En la vida real:** un llavero con una llave distinta para cada puerta, guardado en una caja fuerte que se abre con una sola llave maestra que solo tú tienes.

> 🌎 **Otro ejemplo:** Es como el token del banco que da un número nuevo cada minuto: aunque alguien vea uno, al rato ya no sirve.

**Gestor de contraseñas** (**Bitwarden**, gratis y de código abierto; **KeePassXC**, gratis y sin nube).

| | |
|---|---|
| **Qué es** | Una bóveda que guarda todas tus contraseñas, y te genera una distinta, larga y al azar, para cada sitio |
| **Cómo funciona** | Todo se **cifra en tu aparato** con una llave que sale de tu contraseña maestra. A la nube viaja cifrado: ni la empresa lo puede leer (*conocimiento cero*) |
| **Para el defensor** | Una contraseña distinta por sitio: si se filtra una, las demás siguen a salvo. Y no la escribes en páginas falsas: el gestor **no la rellena** si el dominio no coincide (clase 22, parte 4) |
| **Para atacar** | El objetivo pasa a ser **la contraseña maestra** (con phishing o un programa espía) |
| **Defensa** | Maestra larga y única (una frase), y **segundo factor** en la cuenta del gestor |

**App de segundo factor** (**Google Authenticator**, **2FAS**, **Aegis**: gratis).

| | |
|---|---|
| **Qué es** | Un código de 6 cifras que cambia cada 30 segundos y se pide además de la contraseña |
| **Cómo funciona** | **TOTP**: al activar, el sitio y tu app guardan el **mismo secreto** (el QR). Cada 30 segundos, los dos calculan `código = HMAC(secreto, número de ventana de 30 s)`, y lo recortan a 6 cifras. No hace falta internet: solo el reloj |
| **Para el defensor** | Aunque roben la contraseña, sin el teléfono no entran |
| **Para atacar** | **Phishing en tiempo real**: la página falsa te pide el código y lo usa **al instante**, antes de que venza. También: robar el SMS (por eso el SMS es el segundo factor más débil) |
| **Defensa** | Preferir la app al SMS, y donde se pueda, **llaves de acceso** (*passkeys*) o llaves físicas: están atadas al dominio verdadero y una página falsa no las puede pedir |

> 🧩 **Piezas para este ejercicio**
> - Una ventana representa un bloque de 30 segundos. Usa la misma unidad en todas las comparaciones. Una tolerancia pequeña cubre diferencias de reloj en la simulación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cómo revisa el servidor un código de 6 cifras
lenguaje: js
pide: El servidor y la app calculan el código con el número de **ventana**: `Math.floor(segundos / 30)`. Completa `ventana(segundos)`. Después `codigoValido(recibido, secreto, segundos)`: como los relojes no son perfectos, se acepta el código de la ventana actual, la anterior **o** la siguiente. Usa la función `codigoPara(secreto, ventana)`, que ya está (en la vida real es un HMAC).
--- código
// En la vida real esto es HMAC-SHA1 recortado a 6 cifras. Aquí, una cuenta simple para practicar.
const codigoPara = (secreto, v) => String((secreto * 7919 + v * 104729) % 1000000).padStart(6, '0');

function ventana(segundos) {
  return 0; // tu código aquí
}

function codigoValido(recibido, secreto, segundos) {
  return false; // tu código aquí
}
--- pruebas
const S = 123456;
const t = 1_800_000_000;
prueba('la ventana de 30 segundos', () => igual([ventana(0), ventana(29), ventana(30), ventana(t)], [0, 0, 1, 60000000]));
prueba('el código de ahora', () => igual(codigoValido(codigoPara(S, ventana(t)), S, t), true));
prueba('el de hace 30 s todavía pasa (relojes desparejos)', () => igual(codigoValido(codigoPara(S, ventana(t) - 1), S, t), true));
prueba('el de hace 2 minutos, no', () => igual(codigoValido(codigoPara(S, ventana(t) - 4), S, t), false));
prueba('un código inventado, no', () => igual(codigoValido('000000', S, t), false));
--- solución
const codigoPara = (secreto, v) => String((secreto * 7919 + v * 104729) % 1000000).padStart(6, '0');

function ventana(segundos) {
  return Math.floor(segundos / 30);
}

function codigoValido(recibido, secreto, segundos) {
  const v = ventana(segundos);
  return [v - 1, v, v + 1].some((w) => codigoPara(secreto, w) === recibido);
}
```

```practica
vf :: En un buen gestor de contraseñas, lo que se guarda en la nube viaja cifrado y ni la empresa lo puede leer
vf :: El código de 6 cifras por SMS es tan seguro como el de una app de segundo factor
elige :: ¿Cómo calculan el mismo código el sitio y tu app, sin hablar entre ellos? :: Con internet :: Con el mismo secreto (el del QR) y la misma hora, cada 30 segundos :: Al azar
escribe :: ¿Cómo funciona un phishing que roba el código de segundo factor, y qué lo frena? :: La página falsa te pide la contraseña y el código, y los usa al instante en el sitio real, antes de que el código venza. Lo frenan las llaves de acceso (passkeys) o llaves físicas, que están atadas al dominio verdadero.
```

## Parte 2. Have I Been Pwned: ¿mi contraseña ya se filtró?

> 🌎 **En la vida real:** preguntar en la comisaría si tu bicicleta aparece en la lista de robadas, **sin decirles cuál es**: solo dices "es una de color rojo", te pasan todas las rojas, y tú buscas la tuya en casa.

> 🌎 **Otro ejemplo:** Es como pedir en la biblioteca todos los libros que empiezan con "Ca" y buscar el tuyo tú mismo, sin decir el título.

| | |
|---|---|
| **Qué es** | **Have I Been Pwned** (*haveibeenpwned.com*, gratis): dos listas que salieron de filtraciones: una de **correos** que aparecieron en alguna filtración, y **por separado** otra de **contraseñas** (en forma de hash). No guarda la pareja correo+contraseña |
| **Cómo funciona** | Para consultar una contraseña **sin mandarla**: se le saca el hash SHA-1, se mandan **solo los primeros 5 caracteres**, y el servicio devuelve **todos** los hashes que empiezan así (cientos). Tu programa busca el resto **en tu aparato**. Se llama **k-anonimato**: el servicio nunca sabe cuál era la tuya |
| **Para el defensor** | Al crear una cuenta o cambiar la contraseña, el sitio revisa si esa contraseña ya se filtró, y si es así, pide otra. También: anotarte para que te avise si tu correo aparece en una filtración |
| **Para atacar** | Los atacantes usan **esas mismas listas** filtradas: prueban el correo y la contraseña de una filtración en **otros** sitios (*credential stuffing*), porque mucha gente repite la contraseña |
| **Defensa** | Contraseña distinta por sitio (el gestor de la parte 1), segundo factor, y del lado del sitio: limitar intentos (clase 23) y rechazar contraseñas filtradas |

> 🧩 **Piezas para este ejercicio**
> - La consulta comparte una parte corta del hash. La comparación final se hace localmente con el resto del hash y la respuesta del servicio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Consultar sin decir cuál (k-anonimato)
lenguaje: js
pide: Ya tienes el hash SHA-1 de la contraseña (en mayúsculas). Completa `prefijo(hash)` (los primeros 5 caracteres: lo único que se manda) y `vecesFiltrada(hash, respuesta)`: la respuesta del servicio son líneas `RESTO:VECES` (el resto del hash, después de los 5 primeros). Busca la línea cuyo `RESTO` sea igual al resto de tu hash y devuelve `VECES` como número; si no está, `0`.
--- código
function prefijo(hash) {
  return hash; // ✗ manda el hash entero
}

function vecesFiltrada(hash, respuesta) {
  return 0; // tu código aquí
}
--- pruebas
const hash = '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8'; // el SHA-1 de "password"
const respuesta = '1D72CD07550416C216D8AD296BF5C0AE8E0:10\n1E4C9B93F3F0682250B6CF8331B7EE68FD8:52256179\n1E4C9B93F3F0682250B6CF8331B7EE68FD9:3';
prueba('solo se mandan 5 caracteres', () => igual(prefijo(hash), '5BAA6'));
prueba('"password" se filtró millones de veces', () => igual(vecesFiltrada(hash, respuesta), 52256179));
prueba('una que no está', () => igual(vecesFiltrada('5BAA6000000000000000000000000000000000AA', respuesta), 0));
--- solución
function prefijo(hash) {
  return hash.slice(0, 5);
}

function vecesFiltrada(hash, respuesta) {
  const resto = hash.slice(5);
  for (const linea of respuesta.split('\n')) {
    const [r, veces] = linea.trim().split(':');
    if (r === resto) return Number(veces);
  }
  return 0;
}
```

```practica
vf :: Para consultar Have I Been Pwned no hace falta mandar la contraseña: se mandan los primeros 5 caracteres de su hash
vf :: Si una contraseña nunca se filtró en un sitio, se puede repetir en todos los demás sin riesgo
elige :: ¿Qué es el credential stuffing? :: Adivinar contraseñas al azar :: Probar en otros sitios los correos y contraseñas de una filtración :: Robar cookies
escribe :: ¿Cómo usaría un sitio a Have I Been Pwned para proteger a sus usuarios? :: Al crear la cuenta o cambiar la contraseña, consulta (con k-anonimato) si esa contraseña ya apareció en filtraciones, y si es así le pide al usuario otra.
```

## Parte 3. VirusTotal: ¿este archivo o este enlace es peligroso?

> 🌎 **En la vida real:** pedirle una segunda opinión a setenta médicos a la vez. Si muchos dicen que hay algo, hay que hacer caso; si solo uno lo dice, puede ser un error.

> 🌎 **Otro ejemplo:** Es como consultar si una botella de vino fue robada buscando su número de serie, en vez de mandar la botella.

| | |
|---|---|
| **Qué es** | **VirusTotal** (*virustotal.com*, gratis para uso personal): revisa un archivo, un enlace o un hash con **más de 70 antivirus** a la vez |
| **Cómo funciona** | Le das el archivo (o su hash SHA-256) y te dice cuántos motores lo marcan como peligroso, y qué hizo el archivo cuando lo corrieron en una caja aislada |
| **Para el defensor** | Antes de abrir un adjunto raro o un programa bajado de internet: buscarlo |
| **Para atacar** | Los atacantes revisan que **su** programa malicioso no lo detecte nadie antes de mandarlo. Y miran lo que **otros** subieron |
| **Defensa** | Una detección en cero **no prueba** que sea seguro. Y lo más importante: **lo que subes queda visible para otros** (empresas de seguridad lo pueden bajar). **Nunca subas un documento privado**: busca **por su hash**, que no revela el contenido |

> 🧩 **Piezas para este ejercicio**
> - La práctica usa umbrales de ejemplo. Un resultado aislado es una señal para investigar. Un archivo privado requiere especial cuidado porque subirlo comparte su contenido.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer el resultado de VirusTotal con criterio
lenguaje: js
pide: Completa `veredicto(detecciones, total)`. Si `detecciones` es 0: `'sin detecciones (no prueba que sea seguro)'`. Si es 1 o 2: `'dudoso: puede ser un falso positivo'`. Si es 3 o más: `'peligroso: no lo abras'`. Y `comoRevisar(esPrivado)`: si el archivo es privado (un contrato, un documento con datos), `'buscar por hash'`; si no, `'subir el archivo'`.
--- código
function veredicto(detecciones, total) {
  return detecciones === 0 ? 'seguro' : 'peligroso'; // ✗ cero no prueba que sea seguro
}

function comoRevisar(esPrivado) {
  return 'subir el archivo'; // ✗ lo que subes lo ven otros
}
--- pruebas
prueba('cero detecciones', () => igual(veredicto(0, 72), 'sin detecciones (no prueba que sea seguro)'));
prueba('una sola: dudoso', () => igual(veredicto(1, 72), 'dudoso: puede ser un falso positivo'));
prueba('muchas: peligroso', () => igual(veredicto(38, 72), 'peligroso: no lo abras'));
prueba('un documento privado: por hash', () => igual(comoRevisar(true), 'buscar por hash'));
prueba('un programa bajado de internet: se puede subir', () => igual(comoRevisar(false), 'subir el archivo'));
--- solución
function veredicto(detecciones, total) {
  if (detecciones === 0) return 'sin detecciones (no prueba que sea seguro)';
  if (detecciones <= 2) return 'dudoso: puede ser un falso positivo';
  return 'peligroso: no lo abras';
}

function comoRevisar(esPrivado) {
  return esPrivado ? 'buscar por hash' : 'subir el archivo';
}
```

```practica
vf :: Lo que subes a VirusTotal puede quedar visible para otros, así que un documento privado se busca por su hash
vf :: Si VirusTotal muestra cero detecciones, el archivo es seguro
elige :: ¿Cómo usan VirusTotal los atacantes? :: Para limpiar sus archivos :: Para revisar que su programa no lo detecte ningún antivirus antes de mandarlo :: No lo usan
escribe :: Te llega por correo un PDF "factura pendiente" de alguien que no conoces. ¿Qué haces con VirusTotal y qué más? :: No lo abro. Puedo buscarlo en VirusTotal (es de afuera, no privado mío), pero aunque salga limpio desconfío: reviso el remitente y el dominio, y si es de una empresa, la contacto por su canal oficial (clase 22).
```

## Parte 4. Let's Encrypt y los registros de certificados

> 🌎 **En la vida real:** un registro público donde cada vez que alguien hace una copia de la llave de un edificio, queda anotado. Al dueño le sirve para ver si alguien hizo una copia sin permiso… y al ladrón, para saber qué edificios existen.

> 🌎 **Otro ejemplo:** Es como el registro de la propiedad: cualquiera lo consulta, para bien o para mal.

| | |
|---|---|
| **Qué es** | **Let's Encrypt**: certificados para HTTPS **gratis** y automáticos (clase 22, parte 6) |
| **Cómo funciona** | Un programa (como *certbot*) prueba que controlas el dominio (poniendo un archivo o un registro DNS) y recibe un certificado que vale **90 días**; se renueva solo. Cada certificado emitido queda anotado en registros **públicos**: la **Transparencia de Certificados** (se consultan, por ejemplo, en *crt.sh*) |
| **Para el defensor** | HTTPS gratis en todos lados. Y vigilar los registros: si aparece un certificado de **tu** dominio que no pediste, alguien lo está suplantando |
| **Para atacar** | Los registros listan **todos los subdominios** que tuvieron certificado: `staging.tuapp.com`, `admin.tuapp.com`, `viejo.tuapp.com`. Es el primer paso del reconocimiento (clase 24, parte 5) |
| **Defensa** | Ningún subdominio es "secreto": protégelos todos (con contraseña, o que no existan). Y que la renovación sea **automática**: un certificado vencido rompe la app |

> 🧩 **Piezas para este ejercicio**
> - Normaliza los nombres antes de quitar repetidos. Compara el dominio como un nombre completo o un sufijo que empiece después de un punto para respetar sus límites.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que dicen los registros de certificados de tu dominio
lenguaje: js
pide: Completa `subdominios(nombres, dominio)`: de la lista de nombres que aparecieron en los registros (puede haber repetidos y con `*.`), devuelve los subdominios de `dominio`, sin repetir, sin `*.`, y ordenados. Después `diasParaRenovar(diasQueQuedan)`: Let's Encrypt recomienda renovar cuando faltan 30 días o menos: si es así, `'renovar ahora'`; si no, `'todavía no'`.
--- código
function subdominios(nombres, dominio) {
  return []; // tu código aquí
}

function diasParaRenovar(diasQueQuedan) {
  return 'todavía no'; // tu código aquí
}
--- pruebas
const registros = ['tuapp.com', 'www.tuapp.com', 'admin.tuapp.com', '*.tuapp.com', 'staging.tuapp.com', 'admin.tuapp.com', 'otra.com'];
prueba('los subdominios que se ven desde afuera', () => igual(subdominios(registros, 'tuapp.com'), ['admin.tuapp.com', 'staging.tuapp.com', 'www.tuapp.com']));
prueba('el de otro dominio no cuenta', () => ok(!subdominios(registros, 'tuapp.com').includes('otra.com'), 'otra.com no es de tuapp.com'));
prueba('faltan 20 días: renovar', () => igual(diasParaRenovar(20), 'renovar ahora'));
prueba('faltan 60: todavía no', () => igual(diasParaRenovar(60), 'todavía no'));
--- solución
function subdominios(nombres, dominio) {
  const sub = nombres
    .map((n) => n.replace(/^\*\./, ''))
    .filter((n) => n.endsWith('.' + dominio));
  return [...new Set(sub)].sort();
}

function diasParaRenovar(diasQueQuedan) {
  return diasQueQuedan <= 30 ? 'renovar ahora' : 'todavía no';
}
```

```practica
vf :: Los registros públicos de certificados muestran los subdominios que tuvieron HTTPS, y un atacante los puede consultar
vf :: Un subdominio como staging.tuapp.com no hace falta protegerlo, porque nadie sabe que existe
elige :: ¿Cuánto dura un certificado de Let's Encrypt? :: Un año :: 90 días, y se renueva solo :: Para siempre
escribe :: ¿Para qué le sirve a un defensor mirar los registros de certificados de su dominio? :: Para ver si aparece un certificado de su dominio que él no pidió: sería una señal de que alguien intenta suplantar su sitio.
```

## Parte 5. Los programas del programador: gitleaks, Semgrep y ZAP

> 🌎 **En la vida real:** el control de calidad de una fábrica: una máquina que revisa cada pieza antes de que salga, para encontrar la falla en la fábrica y no en la casa del cliente.

> 🌎 **Otro ejemplo:** Es como el corrector ortográfico, pero para errores de seguridad.

**gitleaks** (gratis, de código abierto).

| | |
|---|---|
| **Qué es** | Un buscador de **secretos** (llaves, contraseñas, tokens) en tu repositorio, **incluido todo el historial** |
| **Cómo funciona** | Recorre cada commit buscando **patrones** (una llave de AWS empieza con `AKIA`, una de GitHub con `ghp_`, una de pagos con `sk_live_`) y textos con mucho azar (*entropía*) |
| **Para el defensor** | Correrlo antes de subir y en el CI. **Ojo:** borrar una llave en un commit nuevo **no la saca del historial**: si se subió, se **rota** (clase 22, parte 3) |
| **Para atacar** | Hay robots que recorren **todos** los repositorios públicos con estas herramientas, todo el día. Una llave subida por error se usa en **minutos** |
| **Defensa** | `.gitignore` y `.env` (clase 22), gitleaks antes de cada `git push` (un *hook*), y rotar todo lo que se haya subido alguna vez |

**Semgrep** (gratis para uso individual y proyectos abiertos).

| | |
|---|---|
| **Qué es** | Un revisor de código que busca **patrones peligrosos**: `innerHTML = ` con datos de afuera, consultas SQL armadas con `+`, `eval(` |
| **Cómo funciona** | Lee el código como un árbol (no como texto suelto) y lo compara con **reglas** escritas casi como el mismo código. Trae miles de reglas listas |
| **Para el defensor** | En el CI: cada cambio pasa por las reglas, y un patrón peligroso frena la subida |
| **Para atacar** | Leer el código de un proyecto abierto buscando esos mismos patrones |
| **Defensa** | Correrlo tú primero, y escribir reglas propias para los errores que ya te pasaron |

**ZAP** (gratis, de código abierto; antes se llamaba *OWASP ZAP*, hoy lo mantiene Checkmarx): el proxy de la clase 24, que además tiene un **escaneo automático**. En el CI, el *baseline scan* recorre tu sitio de prueba y avisa lo que falta (cabeceras de seguridad, cookies sin `HttpOnly`, la cookie de la clase 109).

> 🧩 **Piezas para este ejercicio**
> - Un secreto que se borró puede seguir en una revisión anterior. Revisa las líneas de todo el historial que recibe la práctica y registra su ubicación sin repetir su valor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un gitleaks chico, que también mira el historial
lenguaje: js
pide: Completa `buscarSecretos(commits)`. Cada commit es `{ id, lineas }`, y cada línea empieza con `+` (se agregó) o `-` (se borró). Revisa **todas** las líneas, **también las borradas** (siguen en el historial), con los patrones de `PATRONES`. Devuelve `{ commit, tipo }` por cada una que coincida, en orden.
--- código
const PATRONES = [
  { tipo: 'llave de AWS', re: /AKIA[0-9A-Z]{16}/ },
  { tipo: 'token de GitHub', re: /ghp_[A-Za-z0-9]{20,}/ },
  { tipo: 'llave de pagos', re: /sk_live_[A-Za-z0-9]+/ },
];

function buscarSecretos(commits) {
  return []; // tu código aquí
}
--- pruebas
const historial = [
  { id: 'a1', lineas: ['+const URL = "https://api.tuapp.com"'] },
  { id: 'b2', lineas: ['+const KEY = "AKIAIOSFODNN7EXAMPLE"'] },
  { id: 'c3', lineas: ['-const KEY = "AKIAIOSFODNN7EXAMPLE"', '+const KEY = process.env.KEY'] },
  { id: 'd4', lineas: ['+gh = "ghp_abcdefghijklmnopqrstuvwxyz0123"', '+pago = "sk_live_51Hx"'] },
];
prueba('encuentra todos, en orden', () => igual(buscarSecretos(historial), [
  { commit: 'b2', tipo: 'llave de AWS' },
  { commit: 'c3', tipo: 'llave de AWS' },
  { commit: 'd4', tipo: 'token de GitHub' },
  { commit: 'd4', tipo: 'llave de pagos' },
]));
prueba('la línea borrada también cuenta (sigue en el historial)', () => ok(buscarSecretos([historial[2]]).length === 1, 'la llave borrada en c3 sigue en el historial: hay que rotarla'));
prueba('sin secretos', () => igual(buscarSecretos([historial[0]]), []));
--- solución
const PATRONES = [
  { tipo: 'llave de AWS', re: /AKIA[0-9A-Z]{16}/ },
  { tipo: 'token de GitHub', re: /ghp_[A-Za-z0-9]{20,}/ },
  { tipo: 'llave de pagos', re: /sk_live_[A-Za-z0-9]+/ },
];

function buscarSecretos(commits) {
  const hallazgos = [];
  for (const c of commits) {
    for (const linea of c.lineas) {
      for (const p of PATRONES) {
        if (p.re.test(linea)) hallazgos.push({ commit: c.id, tipo: p.tipo });
      }
    }
  }
  return hallazgos;
}
```

```practica
vf :: Si se subió una llave a Git, borrarla en un commit nuevo no alcanza: sigue en el historial y hay que rotarla
vf :: Una llave subida por error a un repositorio público tarda semanas en ser encontrada, así que hay tiempo
elige :: ¿Qué hace Semgrep? :: Busca contraseñas filtradas :: Revisa el código buscando patrones peligrosos, como innerHTML con datos de afuera o SQL armado con + :: Escanea puertos
escribe :: ¿Cómo usarías gitleaks, Semgrep y ZAP juntos en un proyecto? :: gitleaks antes de cada push y en el CI, para que no se suba ningún secreto; Semgrep en el CI, para frenar patrones peligrosos en el código; y el baseline scan de ZAP contra el sitio de prueba, para ver cabeceras y cookies que faltan.
```


**Comprobación antes de seguir**

Antes de usar un servicio externo para revisar un archivo o enlace, explica qué información enviaría.

<details>
<summary>Necesito una pista</summary>

Usa ejemplos públicos y evita cargar archivos privados o de clientes.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué herramientas de seguridad usas?":** "En lo personal, un gestor de contraseñas como Bitwarden, con una contraseña distinta por sitio, y segundo factor con app o llaves de acceso, no SMS. Como programador: gitleaks antes de subir y en el CI, porque una llave subida se usa en minutos y borrarla no la saca del historial; Semgrep para patrones peligrosos en el código; el baseline scan de ZAP contra el sitio de prueba; y npm audit con Dependabot para las dependencias. Al crear cuentas, reviso las contraseñas contra Have I Been Pwned con k-anonimato. Uso VirusTotal con cuidado, porque lo que se sube lo ven otros, y Let's Encrypt con renovación automática, sabiendo que los registros de certificados muestran todos mis subdominios."

> 🌎 **En la vida real:** es como describir las herramientas de tu taller: para qué sirve cada una, y cuál usarías para cada trabajo.

> 🌎 **Otro ejemplo:** Es como un chef que explica sus cuchillos: no todos sirven para todo, y cada uno tiene su riesgo.
