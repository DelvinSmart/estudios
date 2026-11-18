# Seguridad 4: proyecto final, auditar una API con errores a propósito

> 🌎 **En la vida real:** en la escuela de bomberos, antes de apagar incendios de verdad, entrenan en una casa de práctica que ellos mismos prenden fuego, con todo controlado. Esta clase es tu casa de práctica: una app con errores puestos a propósito, en tu computadora, para encontrarlos, demostrarlos y arreglarlos.

> 🎙️ **El profesor dice:** {{alumno}}, hoy haces una **auditoría completa**, como la de Copiloto (clase 24), pero sobre una API que es tuya para romper: la API de gastos, ahora con usuarios (Ana y Beto), una base SQLite de verdad y **10 errores a propósito**, uno por cada tema del curso. Vas a leer el código como atacante, escribir una **trampa** por cada error (una prueba que intenta el ataque y espera que falle), arreglarlo sin romper nada, y escribir el informe. Todo corre **solo en tu computadora**: es la Parte 0 de la clase 22 hecha práctica.

**Lo que hay** (en la carpeta `91-seguridad-proyecto-auditoria/proyecto` de este mismo repositorio):

| Carpeta o archivo | Qué es |
|---|---|
| `con-errores/` | La API con los 10 errores (V1 a V10). **Nunca la publiques** |
| `arreglada/` | La misma API, arreglada. Cada cambio dice `ARREGLO Vn` |
| `test/trampas.test.mjs` | Una trampa por error. Contra `con-errores`: en rojo. Contra `arreglada`: en verde |
| `test/uso.test.mjs` | El uso normal. Pasa en las dos: arreglar no puede romper lo que funcionaba |
| `INFORME.md` | El informe de la auditoría, en el formato de la clase 24 |

## Parte 1. El alcance y cómo correrla

Una auditoría empieza por escribir **qué** se revisa y **qué no** (clase 24). Aquí:

- **Sí:** `con-errores/` (la API, los datos, la configuración y la página).
- **No:** Node.js, Express y SQLite por dentro; la versión `arreglada/`.
- **Dónde:** solo en tu computadora. El servidor abre el puerto en `127.0.0.1`, que quiere decir **"solo esta máquina"**: nadie más en tu Wi-Fi lo puede ver.

```bash
cd estudios/91-seguridad-proyecto-auditoria/proyecto
npm install
npm run con-errores        # http://127.0.0.1:3000 · usuarios de prueba: ana y beto
```

Las claves de práctica están en `con-errores/datos.mjs`. Necesitas Node 22.13 o más nuevo: la base es **SQLite**, que ya viene dentro de Node (`node:sqlite`), en memoria. Cada vez que arranca, empieza con lo mismo: un gasto de Ana y uno de Beto con una **nota privada**.

Y las dos órdenes que vas a usar todo el tiempo:

```bash
npm run trampas              # las trampas contra con-errores: 10 en rojo
npm run trampas:arreglada    # contra la arreglada: 10 en verde
```

> 🌎 **En la vida real:** el alcance es como el permiso de obra: dice qué paredes puedes tirar. Sin papel, aunque sepas de construcción, no tocas la casa del vecino.

> 🌎 **Otro ejemplo:** `127.0.0.1` es como ensayar con la banda en tu garaje con la puerta cerrada: suena igual que en el escenario, pero nadie de la calle escucha.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Quién puede ver tu servidor?
lenguaje: js
pide: Completa `quienLoVe(direccion)` según la dirección donde escucha el servidor: `'127.0.0.1'`, `'::1'` o `'localhost'` → `'solo esta computadora'`; `'0.0.0.0'` o `'::'` → `'cualquiera en la red'`; otra → `'revisar'`. Y `puedoCorrerla(version, direccion)`: la versión `'con-errores'` **solo** se puede correr si la ve solo esta computadora; la `'arreglada'`, en cualquier caso.
--- código
function quienLoVe(direccion) {
  // tu código aquí
}

function puedoCorrerla(version, direccion) {
  // tu código aquí
}
--- pruebas
prueba('solo esta computadora', () => igual(['127.0.0.1', '::1', 'localhost'].map(quienLoVe), Array(3).fill('solo esta computadora')));
prueba('toda la red', () => igual(['0.0.0.0', '::'].map(quienLoVe), Array(2).fill('cualquiera en la red')));
prueba('otra', () => igual(quienLoVe('192.168.0.12'), 'revisar'));
prueba('la de los errores, solo en tu máquina', () => igual([puedoCorrerla('con-errores', '127.0.0.1'), puedoCorrerla('con-errores', '0.0.0.0')], [true, false]));
prueba('la arreglada, donde sea', () => igual(puedoCorrerla('arreglada', '0.0.0.0'), true));
--- solución
function quienLoVe(direccion) {
  if (['127.0.0.1', '::1', 'localhost'].includes(direccion)) return 'solo esta computadora';
  if (['0.0.0.0', '::'].includes(direccion)) return 'cualquiera en la red';
  return 'revisar';
}

function puedoCorrerla(version, direccion) {
  if (version === 'con-errores') return quienLoVe(direccion) === 'solo esta computadora';
  return true;
}
```

```practica
vf :: El servidor con errores escucha en 127.0.0.1, así que nadie más en tu Wi-Fi lo puede abrir
vf :: Como la app es de práctica, se puede publicar en internet para mostrarla
elige :: ¿Qué es lo primero que se escribe en una auditoría? :: El informe :: El alcance: qué se revisa, qué no, dónde y hasta cuándo :: Las trampas
elige :: ¿Qué hace npm run trampas? :: Arregla los errores :: Corre los ataques contra con-errores, y tienen que salir en rojo :: Publica la app
escribe :: Escribe el alcance de esta auditoría en tres líneas. :: Qué sí: la carpeta con-errores (API, datos, configuración y página). Qué no: Node, Express y SQLite por dentro, y la versión arreglada. Dónde: solo en mi computadora, en 127.0.0.1, con los usuarios de prueba.
```

## Parte 2. Control de acceso: V1 y V2

**V1 · IDOR** (clase 23). La ruta busca el gasto **solo por su id**:

```js
// ❌ con-errores
app.get('/gastos/:id', (pedido, respuesta) => {
  const gasto = base.prepare('SELECT * FROM gastos WHERE id = ?').get(Number(pedido.params.id));
  ...
```

Ana entra, pide `/gastos/2`… y recibe el gasto de Beto, con su nota privada. La trampa lo dice así:

```text
✗ V1 IDOR: respondió 200 con {"id":2,"dueno":"beto",…,"nota":"nota privada de beto"}: se ve el gasto de otro
```

```js
// ✅ arreglada: el gasto tiene que ser del que pregunta; si no, 404 (no 403: no confirmamos que existe)
const gasto = base.prepare('SELECT * FROM gastos WHERE id = ? AND dueno = ?').get(Number(pedido.params.id), pedido.usuario);
```

**V2 · Asignación masiva.** Al crear un gasto, todo lo del cuerpo **pisa** lo del servidor:

```js
// ❌ con-errores
const datos = { dueno: pedido.usuario, nota: '', ...pedido.body };
```

Si Ana manda `"dueno": "beto"`, el gasto aparece en la lista de Beto. El arreglo es la regla de la clase 72, **los campos permitidos**: tomar solo `tipo`, `valor` y `nota`, y el dueño **siempre** de la sesión.

> 🌎 **En la vida real:** el IDOR es como un guardarropa que te devuelve cualquier abrigo si dices el número, sin mirar tu ficha. La asignación masiva es como un formulario donde, además de tu nombre, puedes escribir "a cobrar a: el vecino".

> 🌎 **Otro ejemplo:** el orden del `...` importa como el orden de las capas de pintura: la última es la que se ve. Si `...pedido.body` va al final, lo que mandó la persona tapa lo del servidor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Arreglar V1 y V2
lenguaje: js
pide: Arregla las dos funciones. `verGasto(gastos, id, usuario)`: devuelve el gasto solo si es de ese usuario; si no (o si no existe), `{ estado: 404 }`. `nuevoGasto(cuerpo, usuario)`: arma el gasto con **solo** `tipo`, `valor` y `nota` del cuerpo (nota `''` si no viene), y el `dueno` siempre es el `usuario` de la sesión.
--- código
function verGasto(gastos, id, usuario) {
  return gastos.find((g) => g.id === id) ?? { estado: 404 };
}

function nuevoGasto(cuerpo, usuario) {
  return { dueno: usuario, nota: '', ...cuerpo };
}
--- pruebas
const gastos = [{ id: 1, dueno: 'ana', nota: 'lavado completo' }, { id: 2, dueno: 'beto', nota: 'nota privada de beto' }];
prueba('el suyo, sí', () => igual(verGasto(gastos, 1, 'ana'), { id: 1, dueno: 'ana', nota: 'lavado completo' }));
prueba('V1: el de otro, 404', () => igual(verGasto(gastos, 2, 'ana'), { estado: 404 }));
prueba('uno que no existe, también 404', () => igual(verGasto(gastos, 9, 'ana'), { estado: 404 }));
prueba('V2: el dueño sale de la sesión', () => igual(nuevoGasto({ tipo: 'lavado', valor: 999, dueno: 'beto' }, 'ana'), { dueno: 'ana', tipo: 'lavado', valor: 999, nota: '' }));
prueba('V2: un campo de más no entra', () => igual(Object.keys(nuevoGasto({ tipo: 'peaje', valor: 5, nota: 'x', id: 77, admin: true }, 'ana')).sort(), ['dueno', 'nota', 'tipo', 'valor']));
--- solución
function verGasto(gastos, id, usuario) {
  const g = gastos.find((x) => x.id === id);
  if (!g || g.dueno !== usuario) return { estado: 404 };
  return g;
}

function nuevoGasto(cuerpo, usuario) {
  const { tipo, valor, nota = '' } = cuerpo;
  return { dueno: usuario, tipo, valor, nota };
}
```

```practica
vf :: En con-errores, si Ana pide /gastos/2 recibe el gasto de Beto
vf :: Para arreglar V2 alcanza con poner { ...pedido.body, dueno: pedido.usuario }, con el dueño al final
elige :: ¿Por qué el arreglo de V1 responde 404 y no 403? :: Porque 404 es más corto :: Para no confirmar que ese gasto existe :: Porque 403 no existe
elige :: En { dueno: pedido.usuario, ...pedido.body }, ¿quién gana si el cuerpo trae dueno? :: La sesión :: El cuerpo, porque va después :: Da error
escribe :: Cuenta con tus palabras cómo se explota V2 y cómo se arregla. :: Ana crea un gasto mandando también "dueno": "beto", y como el cuerpo pisa lo del servidor, el gasto aparece en la lista de Beto. Se arregla tomando solo tipo, valor y nota del cuerpo, y poniendo el dueño siempre desde la sesión.
```

## Parte 3. Inyección: V3 (SQL) y V4 (XSS)

**V3 · Inyección SQL**, con una base de verdad. La búsqueda pega la nota dentro de la consulta:

```js
// ❌ con-errores
const sql = `SELECT * FROM gastos WHERE dueno = '${pedido.usuario}' AND nota LIKE '%${nota}%' ORDER BY id`;
```

Si Ana busca `' OR 1=1 --`, la consulta queda así:

```sql
SELECT * FROM gastos WHERE dueno = 'ana' AND nota LIKE '%' OR 1=1 --%' ORDER BY id
```

`OR 1=1` es siempre verdad, y `--` convierte en comentario todo lo que sigue. Resultado: **todos los gastos de todos**, con la nota privada de Beto. El arreglo, el de la clase 23: **parámetros**.

```js
// ✅ arreglada
base.prepare('SELECT * FROM gastos WHERE dueno = ? AND nota LIKE ? ORDER BY id').all(pedido.usuario, `%${nota}%`);
```

**V4 · XSS.** La página arma cada fila con la nota tal cual:

```js
// ❌ con-errores/publico/vista.mjs
return `<li><strong>${gasto.tipo}</strong> R$ ${gasto.valor.toFixed(2)} · ${gasto.nota}</li>`;
```

Se probó en el navegador: con la nota `<b>negrita</b><img src=x onerror="document.title='XSS'">`, la versión con errores **cambió el título de la página a "XSS"** (el código corrió) y dibujó la negrita y la imagen. En la arreglada, la misma nota se ve **como texto**, letra por letra. El arreglo es `escapar()` (clase 23).

> 🌎 **En la vida real:** la inyección es como un formulario del banco donde, en "nombre", alguien escribe "Pedro, y además transfieran todo a esta cuenta", y el empleado lo lee en voz alta como una orden. Con parámetros, el nombre va en su casilla, y lo que diga es solo un nombre.

> 🌎 **Otro ejemplo:** escapar es como poner un cartel entre comillas en una vitrina: "PELIGRO" escrito en un papel no es un peligro, es una palabra.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Arreglar V3 y V4
lenguaje: js
pide: Arregla `consultaDeBusqueda(usuario, nota)`: devuelve `{ sql, valores }` con `?` donde iban el usuario y la nota, y en `valores` el usuario y `'%' + nota + '%'`. Y `filaHtml(gasto)`: escapa `tipo` y `nota` (`&`, `<`, `>`, `"` y `'`) antes de armar el HTML.
--- código
function consultaDeBusqueda(usuario, nota) {
  return { sql: `SELECT * FROM gastos WHERE dueno = '${usuario}' AND nota LIKE '%${nota}%' ORDER BY id`, valores: [] };
}

function filaHtml(gasto) {
  return `<li><strong>${gasto.tipo}</strong> R$ ${gasto.valor.toFixed(2)} · ${gasto.nota}</li>`;
}
--- pruebas
const ataque = "' OR 1=1 --";
prueba('V3: la consulta con huecos', () => igual(consultaDeBusqueda('ana', 'lavado'), { sql: 'SELECT * FROM gastos WHERE dueno = ? AND nota LIKE ? ORDER BY id', valores: ['ana', '%lavado%'] }));
prueba('V3: el ataque viaja como dato', () => { const q = consultaDeBusqueda('ana', ataque); ok(!q.sql.includes('OR 1=1'), 'el texto del usuario está dentro del SQL'); igual(q.valores[1], `%${ataque}%`); });
prueba('V4: una nota normal se ve igual', () => igual(filaHtml({ tipo: 'lavado', valor: 30, nota: 'lavado completo' }), '<li><strong>lavado</strong> R$ 30.00 · lavado completo</li>'));
prueba('V4: el HTML queda como texto', () => igual(filaHtml({ tipo: 'peaje', valor: 5.4, nota: '<img src=x onerror="robar()">' }), '<li><strong>peaje</strong> R$ 5.40 · &lt;img src=x onerror=&quot;robar()&quot;&gt;</li>'));
--- solución
function consultaDeBusqueda(usuario, nota) {
  return { sql: 'SELECT * FROM gastos WHERE dueno = ? AND nota LIKE ? ORDER BY id', valores: [usuario, `%${nota}%`] };
}

const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function filaHtml(gasto) {
  return `<li><strong>${escapar(gasto.tipo)}</strong> R$ ${gasto.valor.toFixed(2)} · ${escapar(gasto.nota)}</li>`;
}
```

```practica
vf :: En la búsqueda de con-errores, escribir ' OR 1=1 -- trae los gastos de todos los usuarios
vf :: Con una consulta con parámetros, el texto ' OR 1=1 -- se busca como texto, y no encuentra nada
elige :: ¿Qué hace el -- en el ataque? :: Resta :: Convierte en comentario todo lo que sigue en la consulta :: Termina la página
elige :: ¿Cómo se comprobó que el XSS era real, además de la trampa? :: No se comprobó :: En el navegador: la nota cambió el título de la página a "XSS" :: Mirando los registros
escribe :: ¿Por qué V3 y V4 son "la misma" falla, aunque una sea en la base y otra en la página? :: Porque en las dos, un texto que escribe una persona se pega dentro de código (SQL o HTML) y termina leyéndose como código. La defensa también es la misma idea: separar los datos del código, con parámetros o escapando.
```

## Parte 4. Claves y login: V5, V6 y V7

**V5 · Claves en texto plano.** La tabla de usuarios guarda la clave tal cual. Si la base se filtra (una copia, un error), se filtran las claves de todos, y la gente las reusa. El arreglo (clase 22): guardar una **sal** al azar y la **huella** de `scrypt`, y comparar con `timingSafeEqual`, que tarda lo mismo acierte o no.

```js
// ✅ arreglada/datos.mjs
export function huellaDe(clave, sal = randomBytes(16)) {
  return { sal: sal.toString('hex'), huella: scryptSync(clave, sal, 64).toString('hex') };
}
```

**V6 · Enumeración.** El login responde `"Ese usuario no existe"` o `"Clave incorrecta"`: cualquiera averigua qué usuarios hay. El arreglo: **una sola** respuesta, `"Usuario o clave incorrectos"`. Y un detalle fino: si el usuario no existe, igual se compara contra una **huella de relleno**, para que la respuesta tarde lo mismo (si no, el tiempo también da la pista).

**V7 · Sin límite de intentos.** El arreglo: 5 claves malas por usuario y 15 minutos de espera (`429`). La trampa manda 6 claves malas seguidas y espera `401, 401, 401, 401, 401, 429`. En la versión con errores, las seis daban `401`: se podía seguir probando para siempre.

> 🌎 **En la vida real:** la huella es como guardar la foto de la huella digital y no el dedo: sirve para comparar, pero nadie puede "usar" la foto para abrir la puerta. Y la sal es como ponerle a cada foto un fondo distinto: dos personas con el mismo dedo no tendrían la misma foto.

> 🌎 **Otro ejemplo:** el límite de intentos es como el cajero automático que se traga la tarjeta al tercer PIN malo: el ladrón no puede probar los 10.000.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un login sin pistas y con freno
lenguaje: js
pide: Completa `crearLogin(usuarios, maximo)`: devuelve `entrar(usuario, clave)`. `usuarios` es un objeto `{ ana: 'clave…' }` (en la app de verdad se comparan huellas; aquí, el texto). Si el usuario ya tiene `maximo` fallos seguidos, devuelve `{ estado: 429 }` sin mirar la clave. Si el usuario no existe **o** la clave es mala, cuenta un fallo y devuelve `{ estado: 401, error: 'Usuario o clave incorrectos' }` (la misma respuesta para los dos casos). Si está bien, borra sus fallos y devuelve `{ estado: 200 }`.
--- código
function crearLogin(usuarios, maximo) {
  const fallos = new Map();
  return function entrar(usuario, clave) {
    // tu código aquí
  };
}
--- pruebas
const usuarios = { ana: 'clave-de-ana-para-practicar' };
prueba('la clave buena', () => igual(crearLogin(usuarios, 5)('ana', 'clave-de-ana-para-practicar'), { estado: 200 }));
prueba('V6: la misma respuesta exista o no', () => { const entrar = crearLogin(usuarios, 5); igual(entrar('carla', 'x'), entrar('ana', 'x')); });
prueba('V7: el sexto intento se frena', () => { const entrar = crearLogin(usuarios, 5); igual([1, 2, 3, 4, 5, 6].map((i) => entrar('ana', `intento-${i}`).estado), [401, 401, 401, 401, 401, 429]); });
prueba('frenado, ni con la clave buena', () => { const entrar = crearLogin(usuarios, 2); entrar('ana', 'a'); entrar('ana', 'b'); igual(entrar('ana', 'clave-de-ana-para-practicar').estado, 429); });
prueba('acertar borra los fallos', () => { const entrar = crearLogin(usuarios, 2); entrar('ana', 'a'); entrar('ana', 'clave-de-ana-para-practicar'); igual(entrar('ana', 'b').estado, 401); });
--- solución
function crearLogin(usuarios, maximo) {
  const fallos = new Map();
  return function entrar(usuario, clave) {
    if ((fallos.get(usuario) || 0) >= maximo) return { estado: 429 };
    if (!(usuario in usuarios) || usuarios[usuario] !== clave) {
      fallos.set(usuario, (fallos.get(usuario) || 0) + 1);
      return { estado: 401, error: 'Usuario o clave incorrectos' };
    }
    fallos.delete(usuario);
    return { estado: 200 };
  };
}
```

```practica
vf :: Con la sal, dos personas con la misma clave tienen la misma huella guardada
vf :: Responder "Usuario o clave incorrectos" en los dos casos evita que se sepa qué usuarios existen
elige :: ¿Para qué compara la versión arreglada contra una huella de relleno cuando el usuario no existe? :: Para guardar al usuario :: Para que la respuesta tarde lo mismo, y el tiempo no dé la pista :: Porque scrypt lo exige
elige :: ¿Qué responde la API arreglada en el sexto intento malo seguido? :: 401 :: 429 :: 500
escribe :: Explica por qué guardar la clave en texto plano es grave aunque "nadie tenga acceso a la base". :: Porque la base se puede filtrar por una copia, un error o un empleado, y entonces se filtran las claves de todos. Como la gente reusa claves, abren también su correo y su banco. Con la huella, aunque se filtre, la clave no se puede leer.
```

## Parte 5. Configuración y secretos: V8, V9 y V10

**V8 · Errores con detalles.** El manejador de errores devuelve el `stack`. La trampa provoca un error con una base "rota" y mira la respuesta. En la versión con errores, al usuario le llegaron **las rutas completas del disco** (`/Volumes/…/proyecto/con-errores/app.mjs:37`), los nombres de las librerías y sus líneas: un mapa del servidor. El arreglo (clase 71): el detalle a `console.error`, y al usuario solo `{ "error": "Algo salió mal" }`.

**V9 · CORS abierto.** `Access-Control-Allow-Origin: *` deja que cualquier sitio lea las respuestas. El arreglo: contestar el origen **solo** si está en la lista `ORIGENES`.

**V10 · Un secreto en el código.** `config.mjs` tiene escrita la clave del servicio de SMS (en este proyecto es de mentira). El arreglo tiene dos pasos, y el segundo es el que se olvida:

1. Leerla del entorno: `export const CLAVE_SMS = process.env.CLAVE_SMS ?? null;`
2. **Rotarla:** pedir una nueva en el servicio y anular la vieja. Borrarla del código no alcanza: sigue en el historial de Git (clase 22).

> 🌎 **En la vida real:** mostrar el stack es como un cajero que, cuando algo falla, te muestra la pantalla de mantenimiento con el modelo, la versión y dónde está la caja fuerte. Al cliente le basta "No se pudo, intente más tarde".

> 🌎 **Otro ejemplo:** rotar una clave filtrada es como cambiar la cerradura cuando perdiste una llave: tirar la copia que te quedaba no sirve, la que se perdió sigue abriendo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Arreglar V8, V9 y V10
lenguaje: js
pide: Arregla tres funciones. `respuestaDeError(error, registro)`: guarda en `registro` el `error.stack` y devuelve `{ estado: 500, cuerpo: { error: 'Algo salió mal' } }`. `cabecerasCors(origen, permitidos)`: el origen solo si está en la lista; si no, `{}`. `tieneSecretoEscrito(codigo)`: `true` si en el código hay una línea como `CLAVE_SMS = '…'` (con comillas simples, dobles o invertidas), es decir, un valor escrito a mano.
--- código
function respuestaDeError(error, registro) {
  return { estado: 500, cuerpo: { error: error.message, detalle: error.stack } };
}

function cabecerasCors(origen, permitidos) {
  return { 'Access-Control-Allow-Origin': '*' };
}

function tieneSecretoEscrito(codigo) {
  // tu código aquí
}
--- pruebas
const error = new Error('no such table: usuarios');
prueba('V8: al usuario, nada interno', () => igual(respuestaDeError(error, []), { estado: 500, cuerpo: { error: 'Algo salió mal' } }));
prueba('V8: el detalle va al registro', () => { const registro = []; respuestaDeError(error, registro); ok(registro[0]?.includes('no such table'), 'el stack tiene que quedar en el registro'); });
prueba('V9: CORS con lista', () => igual([cabecerasCors('http://127.0.0.1:3000', ['http://127.0.0.1:3000']), cabecerasCors('https://sitio-malo.example', ['http://127.0.0.1:3000'])], [{ 'Access-Control-Allow-Origin': 'http://127.0.0.1:3000', Vary: 'Origin' }, {}]));
prueba('V10: un secreto escrito', () => igual(tieneSecretoEscrito("export const CLAVE_SMS = 'clave-de-mentira-123';"), true));
prueba('V10: leído del entorno, bien', () => igual(tieneSecretoEscrito('export const CLAVE_SMS = process.env.CLAVE_SMS ?? null;'), false));
--- solución
function respuestaDeError(error, registro) {
  registro.push(error.stack);
  return { estado: 500, cuerpo: { error: 'Algo salió mal' } };
}

function cabecerasCors(origen, permitidos) {
  if (!permitidos.includes(origen)) return {};
  return { 'Access-Control-Allow-Origin': origen, Vary: 'Origin' };
}

function tieneSecretoEscrito(codigo) {
  return /CLAVE_SMS\s*=\s*['"`]/.test(codigo);
}
```

```practica
vf :: Mostrar el stack al usuario ayuda a que reporte mejor el error, así que no hay riesgo
vf :: Si un secreto estuvo en el repositorio, hay que rotarlo aunque ya se haya borrado del código
elige :: ¿Qué hace Access-Control-Allow-Origin: * en una API privada? :: La hace más rápida :: Deja que cualquier sitio lea sus respuestas desde el navegador :: La protege
elige :: ¿Dónde va el detalle de un error de adentro? :: En la respuesta al usuario :: En el registro del servidor (console.error) :: En la página
escribe :: Cuenta los dos pasos para arreglar un secreto escrito en el código. :: Primero, sacarlo del código y leerlo del entorno (process.env, un .env que no se sube o el gestor de secretos). Segundo, rotarlo: pedir una clave nueva en el servicio y anular la vieja, porque la vieja sigue en el historial de Git.
```

## Parte 6. Las trampas, el uso normal y el informe

Cada error tiene su **trampa** en `test/trampas.test.mjs`: intenta el ataque y **espera que falle**. Las trampas leen la versión de una variable, `VERSION`:

```js
// test/ayuda.mjs
export const VERSION = process.env.VERSION ?? 'arreglada';
export const { crearApp } = await import(`../${VERSION}/app.mjs`);
```

Así, las mismas 10 trampas se corren contra las dos versiones:

| | `con-errores` | `arreglada` |
|---|---|---|
| `npm run trampas` / `trampas:arreglada` | **0 de 10** (los ataques funcionan) | **10 de 10** |
| `npm run uso` | 7 de 7 | 7 de 7 |

La fila de abajo importa tanto como la de arriba: **arreglar la seguridad no puede romper lo que la app hace**. Por eso las pruebas de uso pasan en las dos.

Y antes de dar las trampas por buenas, se comprobó **por qué** fallaba cada una contra `con-errores`. No alcanza con que salga en rojo: tiene que ser en rojo **porque el ataque funciona**, no por otro error. Cada trampa lo dice en su mensaje (*"respondió 200 con … nota privada de beto: se ve el gasto de otro"*).

**El informe** (`INFORME.md`) sigue el formato de la clase 24: el alcance, una tabla con los 10 hallazgos y su severidad, y cada uno con su título, severidad, categoría, dónde, descripción, cómo se explota, corrección y su trampa.

**Un detalle que no era de seguridad**, pero se encontró mirando la página: el formulario de entrar seguía a la vista después de entrar. El CSS decía `form { display: grid }`, y eso le gana al atributo `hidden`. Se arregló con `[hidden] { display: none !important; }`. Las pruebas no lo veían: **mira siempre la app de verdad**.

> 🌎 **En la vida real:** las trampas son como el simulacro de incendio que se repite cada año: no basta con que la alarma sonara una vez. Si alguien desconecta un detector, el próximo simulacro lo muestra.

> 🌎 **Otro ejemplo:** comprobar **por qué** falla una trampa es como el médico que, ante una fiebre, no se conforma con "está enfermo": busca qué la causa, para no tratar otra cosa.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El resumen del informe
lenguaje: js
pide: Completa `resumenDelInforme(hallazgos)`: recibe la lista `{ id, severidad, arreglado }` y devuelve `{ total, porSeveridad, pendientes }`. `porSeveridad` cuenta cuántos hay de cada una, con las cinco severidades siempre presentes (`crítica`, `alta`, `media`, `baja`, `informativa`). `pendientes` son los ids de los **no** arreglados, de la severidad más grave a la menos grave (y en el orden en que venían si empatan).
--- código
const SEVERIDADES = ['crítica', 'alta', 'media', 'baja', 'informativa'];

function resumenDelInforme(hallazgos) {
  // tu código aquí
}
--- pruebas
const hallazgos = [
  { id: 'V1', severidad: 'alta', arreglado: true },
  { id: 'V3', severidad: 'crítica', arreglado: false },
  { id: 'V6', severidad: 'baja', arreglado: false },
  { id: 'V7', severidad: 'media', arreglado: true },
  { id: 'V10', severidad: 'alta', arreglado: false },
];
prueba('el total', () => igual(resumenDelInforme(hallazgos).total, 5));
prueba('por severidad, con las cinco', () => igual(resumenDelInforme(hallazgos).porSeveridad, { crítica: 1, alta: 2, media: 1, baja: 1, informativa: 0 }));
prueba('los pendientes, lo más grave primero', () => igual(resumenDelInforme(hallazgos).pendientes, ['V3', 'V10', 'V6']));
prueba('un informe vacío', () => igual(resumenDelInforme([]), { total: 0, porSeveridad: { crítica: 0, alta: 0, media: 0, baja: 0, informativa: 0 }, pendientes: [] }));
--- solución
const SEVERIDADES = ['crítica', 'alta', 'media', 'baja', 'informativa'];

function resumenDelInforme(hallazgos) {
  const porSeveridad = Object.fromEntries(SEVERIDADES.map((s) => [s, 0]));
  for (const h of hallazgos) porSeveridad[h.severidad] += 1;
  const pendientes = hallazgos
    .filter((h) => !h.arreglado)
    .sort((a, b) => SEVERIDADES.indexOf(a.severidad) - SEVERIDADES.indexOf(b.severidad))
    .map((h) => h.id);
  return { total: hallazgos.length, porSeveridad, pendientes };
}
```

```practica
vf :: Las mismas trampas se corren contra las dos versiones, cambiando la variable VERSION
vf :: Si una trampa sale en rojo contra con-errores, ya está comprobado que funciona
elige :: ¿Para qué están las pruebas de uso normal, si lo que se audita es la seguridad? :: Para que haya más pruebas :: Para comprobar que arreglar la seguridad no rompió lo que la app hacía :: Para atacar la app
elige :: ¿Qué partes tiene cada hallazgo del informe? :: Solo el título :: Título, severidad, categoría, dónde, descripción, cómo se explota, corrección y su trampa :: La fecha y la hora
escribe :: Cuenta cómo se usa este proyecto para practicar una auditoría, de principio a fin. :: Leo el alcance y corro la versión con errores solo en mi computadora. Leo el código por categorías y, por cada error, escribo una trampa que intenta el ataque y espera que falle; la veo en rojo y compruebo que falla porque el ataque funciona. Lo arreglo, veo la trampa en verde y que el uso normal sigue pasando. Al final escribo cada hallazgo en el informe con su severidad y su corrección.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿hiciste alguna auditoría de seguridad?":** "Sí, dos: la de mi app Copiloto y una de práctica sobre una API de gastos con usuarios y una base SQLite, con diez errores puestos a propósito. Escribí el alcance, la corrí solo en mi computadora, y por cada falla escribí una trampa: una prueba que intenta el ataque y espera que falle. Encontré un IDOR, asignación masiva del dueño, inyección SQL que traía los datos de todos, XSS en la página, claves en texto plano, enumeración de usuarios, login sin límite, errores que mostraban el stack con las rutas del servidor, CORS abierto y una clave en el código. Las arreglé con el dueño en la consulta, campos permitidos, consultas con parámetros, escapar, scrypt con sal, una sola respuesta de login, un freno de cinco intentos, errores sin detalles, CORS con lista y la clave del entorno, rotándola. Las diez trampas pasan en la versión arreglada, y las pruebas de uso normal pasan en las dos, así que arreglar no rompió nada."

> 🌎 **En la vida real:** es como el bombero que cuenta el simulacro: dónde estaba cada foco, cómo lo encontró, qué usó para apagarlo y cómo comprobó que no quedaba nada encendido.

> 🌎 **Otro ejemplo:** es como el inspector que entrega su lista: cada problema con la foto, dónde está, qué tan grave es y qué hay que cambiar.
