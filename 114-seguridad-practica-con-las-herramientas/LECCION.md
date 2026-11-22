# Seguridad 10: la práctica, las herramientas contra la app con errores

> 🌎 **En la vida real:** aprender a manejar no es leer el manual: es subirte al carro, en un lugar cerrado y seguro, y practicar hasta que te sale. Hoy nos subimos al carro.

> 🎙️ **El profesor dice:** {{alumno}}, en las clases 111 y 112 viste **qué** es cada herramienta. Hoy las usamos de verdad, pero con una regla que no se rompe: **solo contra la app de práctica del curso, en tu propia computadora**. Esa app es la de la clase 91: una API de gastos con **10 errores puestos a propósito** (la versión `con-errores`), y al lado la misma app **arreglada**. Vamos a atacar la de errores con las herramientas, ver cada falla, y después probar que la arreglada ya no cae. Al final sabrás hacer una auditoría de verdad, de principio a fin.

## Parte 1. El laboratorio y el alcance

> 🌎 **En la vida real:** antes de disparar en un campo de tiro, firmas un papel: en qué línea, hacia dónde, con qué arma. El alcance de una auditoría es ese papel.

> 🌎 **Otro ejemplo:** Es como un simulador de vuelo: puedes estrellar el avión mil veces, porque nadie está arriba.

Lo primero, siempre, es escribir **qué** se puede tocar y **qué no** (clase 24). Aquí:

- **Sí:** la app `con-errores` de la clase 91, en `http://127.0.0.1:3000`.
- **No:** ninguna otra cosa. Nada que no sea tu computadora. `127.0.0.1` quiere decir **"solo esta máquina"**: nadie más en tu Wi-Fi lo ve.

Arrancas la app de práctica (la que vas a atacar):

```bash
cd estudios/91-seguridad-proyecto-auditoria/proyecto
npm install
npm run con-errores        # http://127.0.0.1:3000 · usuarios de prueba: ana y beto
```

Las herramientas de las clases 111 y 112 se instalan en una Mac con **Homebrew**, todas **gratis**. En Kali ya vienen (clase 112):

```bash
brew install nmap sqlmap hydra gobuster gitleaks
brew install --cask zap wireshark-app
```

> 🌎 **En la vida real:** `127.0.0.1` es ensayar con la banda en el garaje con la puerta cerrada: suena igual que en el escenario, pero la calle no escucha.

> 🌎 **Otro ejemplo:** Es como una cocina de práctica en la escuela: cocinas platos de verdad, pero no sale ninguno a un cliente.

> 🧩 **Piezas para este ejercicio**
> - Antes de cualquier práctica, el alcance debe identificar el sistema autorizado. Una palabra dentro de una dirección no comprueba el destino real. La función de esta parte es una simulación con las entradas de la consigna.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La regla que no se rompe: el alcance
lenguaje: js
pide: Completa `puedoAtacar(objetivo)`. Solo se puede si el objetivo está en tu computadora: si contiene `127.0.0.1`, `localhost` o `::1`, devuelve `'sí: es tu laboratorio'`. Cualquier otra cosa (una IP de internet, el sitio de alguien) → `'no: necesitas permiso firmado'`. Después `cualesPuedo(objetivos)`: devuelve solo los que sí se pueden, en el mismo orden.
--- código
function puedoAtacar(objetivo) {
  return 'sí: es tu laboratorio'; // ✗ no todo es tu laboratorio
}

function cualesPuedo(objetivos) {
  return []; // tu código aquí
}
--- pruebas
prueba('tu computadora, sí', () => igual(['http://127.0.0.1:3000', 'localhost:3000', 'http://[::1]/'].map(puedoAtacar), Array(3).fill('sí: es tu laboratorio')));
prueba('el sitio de alguien, no', () => igual(puedoAtacar('https://tienda-de-alguien.com'), 'no: necesitas permiso firmado'));
prueba('una IP de internet, no', () => igual(puedoAtacar('http://203.0.113.9'), 'no: necesitas permiso firmado'));
prueba('filtra la lista', () => igual(cualesPuedo(['http://127.0.0.1:3000', 'https://banco.com', 'localhost:8080']), ['http://127.0.0.1:3000', 'localhost:8080']));
--- solución
function puedoAtacar(objetivo) {
  const mio = ['127.0.0.1', 'localhost', '::1'];
  return mio.some((m) => objetivo.includes(m)) ? 'sí: es tu laboratorio' : 'no: necesitas permiso firmado';
}

function cualesPuedo(objetivos) {
  return objetivos.filter((o) => puedoAtacar(o) === 'sí: es tu laboratorio');
}
```

```practica
vf :: Atacar con estas herramientas el sitio de otra persona, aunque sea "para probar", puede ser un delito
vf :: Como la app escucha en 127.0.0.1, alguien más en tu Wi-Fi la puede atacar también
elige :: ¿Qué es lo primero de una auditoría? :: Lanzar nmap :: Escribir el alcance: qué se puede tocar y qué no :: Buscar el secreto
escribe :: ¿Por qué todas estas herramientas son legales de tener pero peligrosas de usar? :: Porque la herramienta no distingue tu servidor del de otro: lo que la vuelve delito es usarla contra algo que no es tuyo y sin permiso. Por eso se practica en un laboratorio propio.
```

## Parte 2. Reconocimiento: nmap y las cabeceras

> 🌎 **En la vida real:** antes de entrar a una casa, el que la cuida da la vuelta y cuenta puertas y ventanas. Y a veces el buzón ya dice el apellido y la compañía de la alarma.

> 🌎 **Otro ejemplo:** Es como mirar la etiqueta de una camisa: te dice la marca y el país sin preguntarle a nadie.

Primero, **nmap** (clase 112): qué puertos abre tu máquina.

```bash
nmap -sV 127.0.0.1
# PORT     STATE  SERVICE  VERSION
# 3000/tcp open   http     ...
```

Ves el `3000` abierto: es tu app. Ahora pídele la página y mira las **cabeceras** de la respuesta (con `curl -I`, o con el proxy de la parte 5). La app de errores suelta dos cosas:

```text
$ curl -I http://127.0.0.1:3000/
X-Powered-By: Express                      ← dice con qué está hecha
Access-Control-Allow-Origin: *             ← V9: cualquier sitio puede leer sus respuestas
```

- **`X-Powered-By: Express`** le regala al atacante la tecnología: ahora busca fallas conocidas de esa tecnología (Metasploit, clase 112). (Dice el framework, no la versión exacta, pero ya es una pista.)
- **`Access-Control-Allow-Origin: *`** (V9) deja que **cualquier** página web lea las respuestas de tu API desde el navegador de la víctima.

> 🌎 **En la vida real:** es como tener el nombre y el modelo de tu cerradura escritos en la puerta: le ahorras la mitad del trabajo al ladrón.

> 🌎 **Otro ejemplo:** Es como una tienda que deja la puerta de atrás abierta "por si acaso": tarde o temprano entra quien no debe.

> 🧩 **Piezas para este ejercicio**
> - La práctica te da las cabeceras de la respuesta. Cada comprobación agrega su propio hallazgo. Mantén el mismo orden para poder comparar dos reportes.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer las cabeceras como un auditor
lenguaje: js
pide: Completa `hallazgos(cabeceras)` (un objeto `nombre: valor`). Si existe `X-Powered-By`, agrega `'regala la tecnología: ' + valor`. Si `Access-Control-Allow-Origin` es `'*'`, agrega `'CORS abierto: cualquier sitio la lee'`. Si **no** existe `Strict-Transport-Security`, agrega `'falta forzar HTTPS (HSTS)'`. Devuelve la lista en ese orden.
--- código
function hallazgos(cabeceras) {
  return []; // tu código aquí
}
--- pruebas
prueba('la app con errores', () => igual(hallazgos({ 'X-Powered-By': 'Express', 'Access-Control-Allow-Origin': '*' }), ['regala la tecnología: Express', 'CORS abierto: cualquier sitio la lee', 'falta forzar HTTPS (HSTS)']));
prueba('una app cuidada no suelta nada', () => igual(hallazgos({ 'Strict-Transport-Security': 'max-age=31536000' }), []));
prueba('CORS solo para un sitio, bien', () => igual(hallazgos({ 'Access-Control-Allow-Origin': 'https://miapp.com', 'Strict-Transport-Security': 'max-age=1' }), []));
--- solución
function hallazgos(cabeceras) {
  const lista = [];
  if (cabeceras['X-Powered-By']) lista.push('regala la tecnología: ' + cabeceras['X-Powered-By']);
  if (cabeceras['Access-Control-Allow-Origin'] === '*') lista.push('CORS abierto: cualquier sitio la lee');
  if (!cabeceras['Strict-Transport-Security']) lista.push('falta forzar HTTPS (HSTS)');
  return lista;
}
```

```practica
vf :: La cabecera X-Powered-By le dice al atacante con qué está hecha tu app, y conviene quitarla
vf :: Access-Control-Allow-Origin: * es seguro porque no muestra datos privados
elige :: ¿Para qué sirve el reconocimiento contra tu propio servidor? :: Para atacarlo :: Para ver lo que ve un atacante y taparlo antes :: Para nada
escribe :: nmap te muestra el puerto 3000 abierto con tu app. ¿Eso está bien o mal? :: En el laboratorio está bien, porque lo quieres probar. En un servidor de verdad, solo debería estar abierto lo necesario: si 3000 se ve desde internet sin razón, se cierra con el firewall.
```

## Parte 3. El login: enumeración de usuarios y Hydra

> 🌎 **En la vida real:** tocas un timbre y una voz dice "aquí no vive ningún Pérez" en una casa, y "la clave está mal" en otra. Sin querer, la segunda te confirmó que ahí **sí** vive un Pérez.

> 🌎 **Otro ejemplo:** Es como adivinar un PIN en un cajero que te deja intentar sin parar: con tiempo, entra.

Dos errores del login trabajan juntos. **V6, enumeración:** la app contesta distinto según el caso.

```text
usuario 'ana' + clave mala       → {"error":"Clave incorrecta"}     ← ana EXISTE
usuario 'fantasma' + clave mala  → {"error":"Ese usuario no existe"} ← ese no
```

Con eso, un atacante arma la lista de usuarios **de verdad** antes de probar claves. Y entonces entra **V7, sin límite de intentos**: nada frena probar miles de claves. Automatizar eso es lo que hace una herramienta como **Hydra** (clase 112): repite el login con una lista de claves hasta que una entra.

Como esta API recibe el login en **JSON** (no en un formulario de los de antes), lo más claro para verlo es un bucle de **`curl`** de dos líneas, que es lo mismo que Hydra hace por dentro:

```bash
# Contra TU laboratorio (127.0.0.1). Prueba cada clave de la lista y para en la que entra.
for clave in 123456 qwerty clave-de-ana-para-practicar; do
  echo "$clave:"; curl -s -X POST 127.0.0.1:3000/login \
    -H 'Content-Type: application/json' -d "{\"usuario\":\"ana\",\"clave\":\"$clave\"}"; echo
done
```

La clave que no entra responde `{"error":"Clave incorrecta"}`; la buena responde `{"token":"…"}`. Con una lista larga de claves filtradas (clase 111), una termina entrando.

> 📌 **Nota:** Hydra tiene un modo para logins en JSON (con `http-post-form`, mandando el cuerpo en JSON y la cabecera `Content-Type: application/json`), pero su sintaxis es quisquillosa y cambia entre versiones. Para aprender la idea, el bucle de `curl` se ve más claro y corre en cualquier Mac.

La defensa (clase 23) es doble: **un solo mensaje** para los dos casos (`"Usuario o clave incorrectos"`), y **cortar después de pocos intentos**. La app arreglada hace las dos: tras **5** fallos, el sexto intento ya recibe `429 Demasiados intentos`.

> 🌎 **En la vida real:** es como un portero que a todos los que fallan les dice lo mismo, y tras unos intentos no te deja ni tocar el timbre por un rato.

> 🌎 **Otro ejemplo:** Es como el teléfono que, tras varios códigos malos, se bloquea un minuto, y después cinco: probar deja de valer la pena.

> 🧩 **Piezas para este ejercicio**
> - El ejercicio compara respuestas ficticias y una secuencia de estados. Busca si el mensaje cambia y si la secuencia incluye la señal de límite.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿El login frena a Hydra?
lenguaje: js
pide: Completa `revelaUsuarios(mensajeSiExiste, mensajeSiNo)`: devuelve `true` solo si los dos mensajes son **distintos** (entonces el login deja enumerar). Y `frenaIntentos(codigos)`: recibe los códigos HTTP de muchos logins seguidos; devuelve `true` si en algún momento aparece un `429` (cortó), o `false` si todos son `401` (Hydra puede seguir).
--- código
function revelaUsuarios(mensajeSiExiste, mensajeSiNo) {
  return false; // tu código aquí
}

function frenaIntentos(codigos) {
  return true; // tu código aquí
}
--- pruebas
prueba('dos mensajes distintos: enumera', () => igual(revelaUsuarios('Clave incorrecta', 'Ese usuario no existe'), true));
prueba('un solo mensaje para los dos: no enumera', () => igual(revelaUsuarios('Usuario o clave incorrectos', 'Usuario o clave incorrectos'), false));
prueba('sin límite: puros 401', () => igual(frenaIntentos([401, 401, 401, 401, 401, 401]), false));
prueba('con límite: aparece el 429', () => igual(frenaIntentos([401, 401, 401, 401, 429, 429]), true));
--- solución
function revelaUsuarios(mensajeSiExiste, mensajeSiNo) {
  return mensajeSiExiste !== mensajeSiNo;
}

function frenaIntentos(codigos) {
  return codigos.includes(429);
}
```

```practica
vf :: Un login que contesta "ese usuario no existe" le confirma al atacante qué usuarios son reales
vf :: Si las claves están bien guardadas con bcrypt, no hace falta limitar los intentos del login
elige :: ¿Qué hace Hydra contra el login? :: Roba la base de datos :: Prueba muchos usuarios y claves hasta que uno entra :: Lee la pantalla
escribe :: ¿Por qué la enumeración (V6) y la falta de límite (V7) son peores juntas? :: Porque primero el atacante usa la enumeración para quedarse solo con los usuarios reales, y después, sin límite de intentos, prueba claves contra esos usuarios cuanto quiera. Una le da la lista, la otra le da el tiempo.
```

## Parte 4. Sacar datos: el IDOR a mano y la inyección SQL con sqlmap

> 🌎 **En la vida real:** en un guardarropa, le das tu ficha número 2 y te dan tu abrigo. El IDOR es pedir la ficha 3 y que te den el abrigo de otro sin preguntar quién eres.

> 🌎 **Otro ejemplo:** Es como un casillero cuyo candado abre con cualquier número parecido: no hace falta robar la llave.

**V1, IDOR** (clase 23). Primero entras como **ana** (con su clave de práctica) y guardas su token:

```bash
# El login devuelve { "token": "…" }. Lo guardamos en una variable para los próximos pedidos.
TOKEN=$(curl -s -X POST 127.0.0.1:3000/login -H 'Content-Type: application/json' \
  -d '{"usuario":"ana","clave":"clave-de-ana-para-practicar"}' | sed 's/.*"token":"//; s/".*//')
```

Ahora, con ese token, pides un gasto que **no es tuyo**, solo cambiando el número:

```bash
$ curl http://127.0.0.1:3000/gastos/2 -H "Authorization: Bearer $TOKEN"
{"id":2,"dueno":"beto","tipo":"combustible","valor":150,"nota":"nota privada de beto"}
```

La app te dio la **nota privada de beto**, porque busca el gasto por id y **nunca revisa que sea tuyo**. La arreglada responde `No existe ese gasto`. La defensa: toda consulta lleva **también el dueño** (`WHERE id = ? AND dueno = ?`).

**V3, inyección SQL** (clase 23). La búsqueda pega tu texto dentro de la consulta. Esa es la tarea de **sqlmap** (clase 112), que prueba estos trucos solo:

```bash
# Contra TU laboratorio. sqlmap automatiza la inyección de la parte de abajo.
sqlmap -u "http://127.0.0.1:3000/gastos/buscar?nota=x" \
  --headers="Authorization: Bearer $TOKEN" --batch
```

Por dentro, lo que hace es mandar una **nota** que cierra el texto y agrega una condición siempre verdadera:

```text
nota = %' OR '1'='1' --
# la consulta queda:  ... nota LIKE '%%' OR '1'='1' -- %'  → devuelve TODO, también lo de beto
$ curl --get .../gastos/buscar --data-urlencode "nota=%' OR '1'='1' -- " ...
[{"id":1,"dueno":"ana",...}, {"id":2,"dueno":"beto","nota":"nota privada de beto"}]
```

Y de paso, **V8:** si mandas una comilla sola, el error vuelve con el **stack** entero (rutas de archivos, la consulta). La defensa de las dos: **consultas con parámetros** (el texto nunca es código) y errores que no muestran detalles.

> 🌎 **En la vida real:** la inyección es como un formulario donde, en el renglón "nombre", escribes "Juan, y de paso entrégame todos los expedientes", y el empleado lo hace sin pensar.

> 🌎 **Otro ejemplo:** Es como dictar una carta y que el que escribe obedezca una orden que metiste en medio de la frase.

> 🧩 **Piezas para este ejercicio**
> - La comprobación defensiva debe hacerse antes de entregar el objeto. Una prueba usa un documento permitido y otro que debería quedar fuera para confirmar la regla.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El IDOR: ¿de quién es este gasto?
lenguaje: js
pide: Completa `revisarAcceso(gasto, usuario)`: si `gasto.dueno` es el mismo `usuario`, devuelve el gasto tal cual. Si es de otro, devuelve `{ error: 'No existe ese gasto' }` (la app no debe ni confirmar que existe). Después `esFuga(respuesta)`: `true` si la respuesta trae un `dueno` distinto de quien preguntó —aquí lo marcamos con `respuesta.dueno`— o sea, si llegó un gasto ajeno.
--- código
function revisarAcceso(gasto, usuario) {
  return gasto; // ✗ no revisa de quién es
}

function esFuga(respuesta) {
  return false; // tu código aquí
}
--- pruebas
const gastoDeBeto = { id: 2, dueno: 'beto', nota: 'nota privada de beto' };
prueba('ana pide algo de beto: no se lo damos', () => igual(revisarAcceso(gastoDeBeto, 'ana'), { error: 'No existe ese gasto' }));
prueba('beto pide lo suyo: sí', () => igual(revisarAcceso(gastoDeBeto, 'beto'), gastoDeBeto));
prueba('un gasto ajeno es una fuga', () => igual(esFuga(gastoDeBeto), true));
prueba('un "no existe" no filtra nada', () => igual(esFuga({ error: 'No existe ese gasto' }), false));
--- solución
function revisarAcceso(gasto, usuario) {
  return gasto.dueno === usuario ? gasto : { error: 'No existe ese gasto' };
}

function esFuga(respuesta) {
  return respuesta.dueno !== undefined;
}
```

> 🧩 **Piezas para este ejercicio**
> - En la versión protegida, la consulta permanece fija y el valor viaja aparte como parámetro.

```ejercicio
titulo: La inyección, y por qué los parámetros la frenan
lenguaje: js
pide: La búsqueda arma la consulta con la nota. Completa `armar(nota, conParametros)`. Sin parámetros (`false`): devuelve el texto pegado, `"...nota LIKE '%" + nota + "%'..."` (peligroso). Con parámetros (`true`): devuelve `{ sql: "...nota LIKE ?...", datos: ['%' + nota + '%'] }`, donde la nota viaja como **dato**, no como código. Después `cambiaLaConsulta(nota)`: `true` si al pegar esa nota sin parámetros aparece un `OR` o un `--` que no estaban (señal de inyección).
--- código
function armar(nota, conParametros) {
  return ''; // tu código aquí
}

function cambiaLaConsulta(nota) {
  return false; // tu código aquí
}
--- pruebas
prueba('sin parámetros, el texto se pega', () => igual(armar('lavado', false), "...nota LIKE '%lavado%'..."));
prueba('con parámetros, la nota es un dato', () => igual(armar("%' OR '1'='1' -- ", true), { sql: '...nota LIKE ?...', datos: ["%%' OR '1'='1' -- %"] }));
prueba('la nota maliciosa mete un OR', () => igual(cambiaLaConsulta("%' OR '1'='1' -- "), true));
prueba('una nota normal no', () => igual(cambiaLaConsulta('combustible'), false));
--- solución
function armar(nota, conParametros) {
  if (conParametros) return { sql: '...nota LIKE ?...', datos: ['%' + nota + '%'] };
  return "...nota LIKE '%" + nota + "%'...";
}

function cambiaLaConsulta(nota) {
  return /\bOR\b|--/.test(nota);
}
```

```practica
vf :: El IDOR se arregla pidiendo también el dueño en la consulta: WHERE id = ? AND dueno = ?
vf :: Con consultas con parámetros, el texto que escribe el usuario nunca se vuelve parte del SQL
elige :: ¿Qué automatiza sqlmap? :: Adivinar contraseñas :: Probar inyecciones SQL en cada parámetro y sacar los datos :: Escanear puertos
escribe :: Entras como ana y con el IDOR lees la nota privada de beto. ¿Qué falló y cómo se arregla? :: La app buscó el gasto solo por su id y nunca revisó que fuera de ana. Se arregla pidiendo también el dueño (WHERE id = ? AND dueno = ?), así el gasto de otro ni aparece.
```

## Parte 5. El proxy, la asignación masiva y el secreto con gitleaks

> 🌎 **En la vida real:** mandar una carta, pero un cartero deshonesto la abre, le agrega un renglón y la vuelve a cerrar. El que la recibe cree que todo lo escribiste tú.

> 🌎 **Otro ejemplo:** Es como un formulario de papel con un espacio en blanco: alguien escribe ahí un campo de más que nadie pidió.

Las validaciones de la pantalla no sirven de nada contra un **proxy** como **ZAP** (antes OWASP ZAP) o **Burp** (clases 24 y 112): se ponen entre tu navegador y la app, y te dejan **cambiar la petición** antes de que salga.

Con el proxy aprovechas **V2, asignación masiva**. La pantalla solo deja crear un gasto tuyo, pero tú, en el camino, le agregas un campo `dueno`:

```text
POST /gastos   { "tipo":"peaje", "valor":5, "dueno":"beto" }
→ {"id":3,"dueno":"beto",...}     ← ¡lo creaste a nombre de beto!
```

La app hacía `{ dueno: tú, ...pedido.body }`: lo que viene del cuerpo **pisa** al dueño verdadero. La defensa (clase 23): una **lista blanca**, tomar solo los campos esperados (`tipo`, `valor`, `nota`) y poner el dueño tú, nunca el cuerpo.

Y lo más fácil de todo: **V10, el secreto en el código**. Hay dos formas de buscarlo, sin siquiera correr la app. La primera, un **`grep`**, que nunca falla con un secreto que tiene un nombre claro:

```bash
$ grep -rniE "clave|secret|token|password|api[_-]?key" con-errores/
con-errores/config.mjs:5:export const CLAVE_SMS = 'clave-de-mentira-del-servicio-de-sms-123'
```

La segunda, **gitleaks** (clase 111). En gitleaks moderno (v8) son dos comandos: `gitleaks dir` revisa los archivos de una carpeta, y `gitleaks git` revisa **todo el historial** del repositorio:

```bash
$ gitleaks dir con-errores/      # los archivos de ahora
$ gitleaks git .                 # el historial entero (aquí es donde más aparece)
```

> ⚠️ **Cuidado, una verdad incómoda:** gitleaks **no es magia**. Sus reglas de fábrica cazan muy bien los secretos con **forma de clave de un servicio** (los de GitHub empiezan por `ghp_`, los de Stripe por `sk_live_`, etc.) o cadenas largas y al azar. Pero un secreto escrito con palabras, como `'clave-de-mentira-del-servicio-de-sms-123'`, **se le puede escapar**, porque parece texto normal. Por eso en un proyecto de verdad se usan **las dos cosas**: gitleaks para lo evidente, un `grep` por los nombres de tus secretos, y una **regla propia** de gitleaks para los nombres que usas tú (`CLAVE_SMS`, `TOKEN_…`). Confiar solo en la herramienta es la trampa.

La defensa (clase 22): los secretos en variables de entorno (`.env`, fuera de Git), y **rotar** cualquiera que se haya subido, porque queda en el historial.

> 🌎 **En la vida real:** la lista blanca es como un formulario con casillas fijas: solo se puede marcar lo que está impreso, no escribir renglones nuevos.

> 🌎 **Otro ejemplo:** Es como el control de un aeropuerto: no importa lo que digas, solo pasa lo que está en la lista.

> 🧩 **Piezas para este ejercicio**
> - La lista permitida identifica los campos editables. Toma el dueño de la sesión autenticada al formar el objeto que va a guardar el servidor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La lista blanca frena la asignación masiva
lenguaje: js
pide: Completa `guardar(cuerpo, usuario, conLista)`. Sin lista (`false`), hace lo que hacía la app con errores: `{ dueno: usuario, ...cuerpo }` (el cuerpo puede pisar el dueño). Con lista (`true`), toma **solo** `tipo`, `valor` y `nota` del cuerpo y pone `dueno: usuario` siempre. Devuelve el objeto guardado.
--- código
function guardar(cuerpo, usuario, conLista) {
  return {}; // tu código aquí
}
--- pruebas
prueba('sin lista: el cuerpo pisa el dueño (V2)', () => igual(guardar({ tipo: 'peaje', valor: 5, dueno: 'beto' }, 'ana', false), { dueno: 'beto', tipo: 'peaje', valor: 5 }));
prueba('con lista: el dueño es siempre ana', () => igual(guardar({ tipo: 'peaje', valor: 5, dueno: 'beto' }, 'ana', true), { dueno: 'ana', tipo: 'peaje', valor: 5, nota: undefined }));
prueba('con lista, un campo colado no pasa', () => igual(guardar({ tipo: 'lavado', valor: 9, esAdmin: true }, 'ana', true).esAdmin, undefined));
--- solución
function guardar(cuerpo, usuario, conLista) {
  if (!conLista) return { dueno: usuario, ...cuerpo };
  return { dueno: usuario, tipo: cuerpo.tipo, valor: cuerpo.valor, nota: cuerpo.nota };
}
```

```practica
vf :: Cambiar la validación de la pantalla no sirve, porque con un proxy como ZAP o Burp se cambia la petición después
vf :: Un secreto borrado del código en un commit nuevo ya no es un problema
elige :: ¿Cómo frena la asignación masiva una lista blanca? :: Borra el cuerpo :: Toma solo los campos esperados y pone el dueño el servidor, nunca el cuerpo :: Cifra los datos
escribe :: Con un proxy agregas "dueno":"beto" a la petición y creas un gasto a nombre de beto. ¿Qué falló y cómo se arregla? :: La app juntó tu cuerpo sobre el dueño verdadero, así que el campo colado lo pisó. Se arregla con una lista blanca: el servidor toma solo tipo, valor y nota, y pone el dueño él mismo.
```

## Parte 6. El informe, y probar que la arreglada ya no cae

> 🌎 **En la vida real:** el mecánico no solo arregla el carro: te entrega una hoja con lo que encontró, lo que hizo y lo que probó después. Esa hoja es el trabajo.

> 🌎 **Otro ejemplo:** Es como el antes y el después de una obra: no basta decir "lo arreglé", hay que mostrar la foto.

Una auditoría termina en un **informe** (clase 91): por cada falla, qué es, qué tan grave, cómo se ve y cómo se arregla. Y después, lo que casi nadie hace: **volver a probar** contra la versión arreglada, para demostrar que la falla ya no está. Corres las mismas herramientas contra la otra app:

```bash
npm run arreglada        # la versión sin los errores, en el mismo 127.0.0.1:3000
```

Y repites cada ataque. Ahora:

| Falla | Con errores | Arreglada |
|---|---|---|
| Enumeración (V6) | dos mensajes distintos | `Usuario o clave incorrectos` para los dos |
| Sin límite (V7) | puros `401` | `429` tras 5 intentos |
| IDOR (V1) | te da el gasto de beto | `No existe ese gasto` |
| Inyección (V3) | saca todo | devuelve `[]` (el texto se busca tal cual) |
| Asignación masiva (V2) | lo crea a nombre de beto | el dueño queda en ana |
| CORS (V9) | `Allow-Origin: *` | sin esa cabecera |

Eso es una auditoría completa: alcance, reconocimiento, cada falla con su herramienta, el informe, y la prueba de que el arreglo funcionó.

> 🧩 **Piezas para este ejercicio**
> - Compara el resultado del arreglo con el comportamiento esperado. En la simulación, la diferencia detecta un cambio. En una prueba de regresión, confirma además que el caso permitido sigue funcionando.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El antes y el después del arreglo
lenguaje: js
pide: Completa `quedoArreglada(falla)`, que recibe `{ nombre, conErrores, arreglada }` (dos respuestas). Devuelve `true` si las dos respuestas son **distintas** (algo cambió) y `false` si son iguales (el arreglo no hizo nada). Después `resumen(fallas)`: devuelve `{ arregladas, pendientes }` con cuántas quedaron y cuántas no.
--- código
function quedoArreglada(falla) {
  return false; // tu código aquí
}

function resumen(fallas) {
  return { arregladas: 0, pendientes: 0 }; // tu código aquí
}
--- pruebas
const idor = { nombre: 'V1', conErrores: 'gasto de beto', arreglada: 'No existe ese gasto' };
const sinTocar = { nombre: 'V9', conErrores: '*', arreglada: '*' };
prueba('cambió: arreglada', () => igual(quedoArreglada(idor), true));
prueba('igual: sigue', () => igual(quedoArreglada(sinTocar), false));
prueba('el resumen cuenta bien', () => igual(resumen([idor, sinTocar, idor]), { arregladas: 2, pendientes: 1 }));
--- solución
function quedoArreglada(falla) {
  return falla.conErrores !== falla.arreglada;
}

function resumen(fallas) {
  const arregladas = fallas.filter(quedoArreglada).length;
  return { arregladas, pendientes: fallas.length - arregladas };
}
```

```practica
vf :: Una auditoría no termina al encontrar las fallas: hay que volver a probar la versión arreglada y demostrar que ya no caen
vf :: Si la inyección SQL ahora devuelve una lista vacía en vez de los datos de otro, el arreglo funcionó
elige :: ¿Qué es lo último de una auditoría? :: Borrar la app :: El informe, y volver a probar contra la versión arreglada :: Publicarla
escribe :: Resume cómo harías la auditoría de la app de la clase 91, de principio a fin. :: Escribo el alcance (solo 127.0.0.1). Hago reconocimiento con nmap y miro las cabeceras. Pruebo el login (enumeración y Hydra), saco datos con el IDOR y con sqlmap, uso un proxy para la asignación masiva y gitleaks para el secreto. Anoto cada falla en un informe con su arreglo, y al final corro todo contra la versión arreglada para probar que ya no cae.
```


**Comprobación antes de seguir**

Evalúa la corrección de un control y comprueba el funcionamiento normal con datos ficticios.

<details>
<summary>Necesito una pista</summary>

Anota el resultado permitido, el resultado rechazado y la evidencia de ambos.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿has hecho una prueba de seguridad de verdad?":** "Sí, sobre una API de práctica con diez fallas a propósito, en mi computadora. Escribí el alcance, hice reconocimiento con nmap y revisé las cabeceras, que soltaban la tecnología y un CORS abierto. En el login encontré enumeración de usuarios y falta de límite de intentos, que probé con Hydra. Saqué datos con un IDOR a mano y con sqlmap por una inyección SQL, usé un proxy para una asignación masiva, y gitleaks encontró un secreto en el código. Lo anoté todo en un informe con el arreglo de cada una —control de acceso con el dueño, consultas con parámetros, lista blanca, límite de intentos, un solo mensaje en el login— y al final corrí las herramientas contra la versión arreglada para demostrar que ya no caían."

> 🌎 **En la vida real:** es como un electricista que no solo dice "revisé la casa": te muestra cada enchufe que arregló y, con su probador, te demuestra que ya no da corriente donde no debía.

> 🌎 **Otro ejemplo:** Es como entregar un examen con el procedimiento, no solo el resultado: se ve que sabes hacerlo, no que lo adivinaste.
