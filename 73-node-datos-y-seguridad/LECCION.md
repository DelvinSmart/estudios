# Node.js 6: base de datos y seguridad del servidor

> 🌎 **En la vida real:** una tienda que guarda la mercadería en el mostrador la pierde al cerrar. Una base de datos es la bodega con llave: los datos siguen ahí al apagar el servidor.

> 🎙️ **El profesor dice:** la API de la clase 72 guarda todo en una variable: si el servidor se reinicia, se pierde. Hoy: guardar en una **base de datos** (SQLite para aprender, Firestore como en Copiloto), consultas con parámetros, y las reglas de seguridad del servidor: secretos en `.env`, autenticación, límites de uso y cabeceras seguras.

## Parte 1. Una base de datos de verdad

> 🌎 **En la vida real:** SQLite es un archivador en tu oficina; una base en la nube (PostgreSQL, Firestore) es una bodega compartida con guardia.

> 🌎 **Otro ejemplo:** Es como un cuaderno propio frente a un archivo central de la empresa.

### SQLite: una base en un archivo (gratis)

SQLite guarda toda la base en **un archivo**, sin instalar un servidor aparte. Ideal para aprender y para apps chicas. Con el paquete `better-sqlite3`:

```js
import Database from 'better-sqlite3';

const db = new Database('gastos.db');
db.exec(`CREATE TABLE IF NOT EXISTS gastos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo TEXT NOT NULL,
  valor REAL NOT NULL CHECK (valor > 0)
)`);

const insertar = db.prepare('INSERT INTO gastos (tipo, valor) VALUES (?, ?)');
const porTipo = db.prepare('SELECT * FROM gastos WHERE tipo = ?');

insertar.run('lavado', 30);
console.log(porTipo.all('lavado'));
```

> 🌎 **En la vida real:** es como una planilla con columnas fijas que no acepta un valor negativo.

> 🌎 **Otro ejemplo:** Es como un fichero con cajones etiquetados.

### Los ? evitan la inyección SQL

Los `?` son **parámetros**: los datos van aparte del SQL, nunca pegados al texto (Tema 23). Así, aunque alguien mande `'lavado'; DROP TABLE gastos;--`, se guarda como texto, no se ejecuta.

```js
db.prepare(`SELECT * FROM gastos WHERE tipo = '${tipo}'`).all();   // ❌ inyección SQL
db.prepare('SELECT * FROM gastos WHERE tipo = ?').all(tipo);       // ✅
```

> 🌎 **En la vida real:** es como un formulario con casillas: lo que escribas en "nombre" queda en "nombre", aunque escribas una orden.

> 🌎 **Otro ejemplo:** Es como el cajero que lee el monto solo de la casilla del monto.

### Firestore desde Node: firebase-admin

En los proyectos de este curso, el servidor (Cloud Functions) usa **firebase-admin**, que **se salta las reglas de seguridad**: por eso todo lo que hace la función tiene que validar y revisar permisos en el código, como `corregirPractica` y `enviarCorreoCuenta` de este mapa.

> 🌎 **En la vida real:** el administrador tiene la llave maestra: por eso él mismo tiene que revisar quién pide qué.

> 🌎 **Otro ejemplo:** Es como el gerente del banco que puede abrir cualquier caja: su responsabilidad es mayor.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Consultas con parámetros
lenguaje: js
pide: Haz una mini base que **nunca** pega los datos dentro del texto de la consulta. Completa `consulta(sql, parametros, filas)`: solo entiende `SELECT * FROM gastos WHERE campo = ?`. Busca el campo en el SQL y filtra las filas comparando con `parametros[0]` **tal cual** (aunque traiga comillas o `DROP TABLE`, es solo un texto a comparar).
--- código
function consulta(sql, parametros, filas) {
  // tu código aquí
}
--- pruebas
const filas = [{ id: 1, tipo: 'lavado', valor: 30 }, { id: 2, tipo: 'peaje', valor: 12 }];
prueba('por tipo', () => igual(consulta('SELECT * FROM gastos WHERE tipo = ?', ['lavado'], filas), [filas[0]]));
prueba('un ataque es solo un texto', () => igual(consulta('SELECT * FROM gastos WHERE tipo = ?', ["lavado'; DROP TABLE gastos;--"], filas), []));
prueba('las filas siguen ahí', () => igual(filas.length, 2));
--- solución
function consulta(sql, parametros, filas) {
  const campo = sql.match(/WHERE (\w+) = \?/)[1];
  return filas.filter((f) => f[campo] === parametros[0]);
}
```

```practica
vf :: SQLite guarda toda la base de datos en un archivo
vf :: Pegar el texto del usuario dentro del SQL con plantillas es seguro si usas comillas
elige :: ¿Qué hace CHECK (valor > 0) en la tabla? :: Ordena :: Hace que la base rechace valores de cero o negativos :: Borra filas
elige :: ¿Por qué una Cloud Function con firebase-admin tiene que validar todo en el código? :: Porque es más rápido :: Porque firebase-admin se salta las reglas de seguridad :: Porque no tiene internet
escribe :: Reescribe de forma segura: db.prepare(`DELETE FROM gastos WHERE id = ${id}`).run() :: db.prepare('DELETE FROM gastos WHERE id = ?').run(id)
```

## Parte 2. Secretos, autenticación y permisos

> 🌎 **En la vida real:** la llave de la bodega no va pegada en la puerta, y no cualquiera que llega a la tienda puede entrar a la bodega.

> 🌎 **Otro ejemplo:** Es como el banco: la clave de la caja fuerte no está en la vitrina, y solo entra personal autorizado.

### Secretos en .env

```bash
# .env  (en .gitignore, NUNCA en GitHub)
CLAVE_API_EXTERNA=…
```

```bash
node --env-file=.env app.mjs     # Node carga el .env por ti
```

En el código: `process.env.CLAVE_API_EXTERNA`. En la nube, el gestor de secretos (como `defineSecret` de las funciones de este mapa, que guardan la clave del Gmail).

> 🌎 **En la vida real:** es como guardar la llave en la caja de seguridad, no debajo del tapete.

> 🌎 **Otro ejemplo:** Es como la combinación de la caja fuerte que solo sabe el gerente.

### ¿Quién es? y ¿puede?

- **Autenticación (¿quién eres?):** el usuario manda un **token** (por ejemplo, el ID token de Firebase Auth en la cabecera `Authorization: Bearer …`); el servidor lo **verifica** con `firebase-admin` (`getAuth().verifyIdToken(token)`) y obtiene el `uid`.
- **Autorización (¿puedes?):** con ese `uid`, el servidor solo deja leer o cambiar **lo suyo** (como las reglas de Firestore, Temas 08 y 21). Nunca confíes en un `uid` que mande el navegador en el cuerpo.

> 🌎 **En la vida real:** autenticación es mostrar el documento en la portería; autorización es que te dejen subir solo a tu piso.

> 🌎 **Otro ejemplo:** Es como el hotel: la tarjeta dice quién eres y abre solo tu habitación.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Quién eres? y ¿puedes?
lenguaje: js
pide: Completa `revisar(cabeceras, uidDeLaRuta, tokens)`: lee `Authorization: Bearer <token>`; si falta o el token no está en `tokens` → `{ estado: 401 }`. Con el `uid` del token: si no es el de la ruta → `{ estado: 403 }`; si es → `{ estado: 200, uid }`. **Nunca** uses un uid que mande el cliente en el cuerpo.
--- código
function revisar(cabeceras, uidDeLaRuta, tokens) {
  // tu código aquí
}
--- pruebas
const tokens = { 'tok-ana': 'ana', 'tok-beto': 'beto' };
prueba('Ana lee lo suyo', () => igual(revisar({ authorization: 'Bearer tok-ana' }, 'ana', tokens), { estado: 200, uid: 'ana' }));
prueba('sin token: 401', () => igual(revisar({}, 'ana', tokens), { estado: 401 }));
prueba('token inventado: 401', () => igual(revisar({ authorization: 'Bearer falso' }, 'ana', tokens), { estado: 401 }));
prueba('Beto pide lo de Ana: 403', () => igual(revisar({ authorization: 'Bearer tok-beto' }, 'ana', tokens), { estado: 403 }));
--- solución
function revisar(cabeceras, uidDeLaRuta, tokens) {
  const m = (cabeceras.authorization ?? '').match(/^Bearer (.+)$/);
  const uid = m ? tokens[m[1]] : undefined;
  if (!uid) return { estado: 401 };
  if (uid !== uidDeLaRuta) return { estado: 403 };
  return { estado: 200, uid };
}
```

```practica
vf :: node --env-file=.env carga las variables del .env sin instalar nada
vf :: Es seguro usar el uid que manda el navegador en el cuerpo del pedido
elige :: ¿Qué responde la pregunta "¿quién eres?" :: Autorización :: Autenticación :: CORS
elige :: ¿Cómo verifica el servidor el token de Firebase Auth? :: Lo lee sin revisar :: Con firebase-admin: getAuth().verifyIdToken(token) :: Con CSS
escribe :: Explica la diferencia entre autenticación y autorización con el ejemplo del hotel. :: La autenticación es mostrar quién eres en la recepción y recibir la tarjeta; la autorización es que esa tarjeta solo abra tu habitación y no las demás.
```

## Parte 3. Límites y cabeceras seguras

> 🌎 **En la vida real:** un local con un portero que no deja entrar a 500 personas a la vez y con cerraduras en todas las puertas.

> 🌎 **Otro ejemplo:** Es como el tope de extracción diario del cajero automático.

### Limitar el uso

Sin límite, un robot puede pedirte miles de cosas por minuto (Tema 24). Con `express-rate-limit`:

```js
import rateLimit from 'express-rate-limit';
app.use('/gastos', rateLimit({ windowMs: 60_000, limit: 60 }));   // 60 pedidos por minuto por IP
```

Y para las acciones caras (mandar correos, llamar a una IA), límites por usuario y por día, como `funciones/limites.js` de este mapa.

> 🌎 **En la vida real:** es como el cartel "máximo 2 por cliente" en una oferta, pero controlado en la caja.

> 🌎 **Otro ejemplo:** Es como la fila con número: nadie atiende a 50 personas a la vez.

### Cabeceras seguras con helmet

```js
import helmet from 'helmet';
app.use(helmet());   // agrega cabeceras como Content-Security-Policy y quita las que revelan tecnología
```

> 🌎 **En la vida real:** es como ponerle cerradura, alarma y rejas a la casa con un solo pedido al cerrajero.

> 🌎 **Otro ejemplo:** Es como el kit de seguridad que viene con un carro nuevo.

### La lista corta del servidor seguro

Secretos en `.env` o en el gestor de secretos · valida todo lo que entra · consultas con parámetros · verifica el token y revisa permisos · CORS solo para tus dominios · límites de uso · `helmet` · errores sin detalles internos (clase 71) · `npm audit` (Tema 23).

> 🌎 **En la vida real:** es la lista que revisa el encargado antes de abrir la tienda cada mañana.

> 🌎 **Otro ejemplo:** Es como el checklist del piloto: corto, siempre el mismo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un límite de pedidos por minuto
lenguaje: js
pide: Completa `crearLimite(maximo, ventanaMs)`: devuelve una función `(ip, ahora) => true/false`. Deja pasar hasta `maximo` pedidos por IP dentro de cada ventana (que empieza con el primer pedido); después devuelve `false` (el 429) hasta que pase la ventana.
--- código
function crearLimite(maximo, ventanaMs) {
  const cuentas = new Map();
  return (ip, ahora) => {
    // tu código aquí
  };
}
--- pruebas
prueba('3 pasan, el 4.º no', () => { const p = crearLimite(3, 60000); igual([p('1.1.1.1', 0), p('1.1.1.1', 10), p('1.1.1.1', 20), p('1.1.1.1', 30)], [true, true, true, false]); });
prueba('otra IP tiene su propia cuenta', () => { const p = crearLimite(1, 60000); p('a', 0); igual(p('b', 1), true); });
prueba('al pasar el minuto, vuelve a dejar', () => { const p = crearLimite(1, 60000); p('a', 0); p('a', 10); igual(p('a', 60001), true); });
--- solución
function crearLimite(maximo, ventanaMs) {
  const cuentas = new Map();
  return (ip, ahora) => {
    const c = cuentas.get(ip);
    if (!c || ahora - c.inicio > ventanaMs) {
      cuentas.set(ip, { inicio: ahora, n: 1 });
      return true;
    }
    c.n++;
    return c.n <= maximo;
  };
}
```

```practica
vf :: express-rate-limit limita cuántos pedidos puede hacer cada IP en un tiempo
vf :: helmet reemplaza la validación de los datos
elige :: ¿Qué significa limit: 60 con windowMs: 60_000? :: 60 pedidos por segundo :: 60 pedidos por minuto :: 60 usuarios
elige :: ¿Cuál de estas NO está en la lista del servidor seguro? :: Consultas con parámetros :: Mostrar el stack del error al usuario :: CORS solo para tus dominios
escribe :: Escribe cinco cosas de la lista corta del servidor seguro. :: Secretos en .env o en el gestor de secretos, validar todo lo que entra, consultas con parámetros, verificar el token y los permisos, y límites de uso (además de CORS, helmet y errores sin detalles).
```

## Parte 4. La configuración en un solo lugar

> 🌎 **En la vida real:** es como el tablero de llaves de un edificio: cada llave tiene su gancho con su nombre. El portero no guarda llaves en los bolsillos de cada saco; si falta una, se nota **al abrir el tablero**, no cuando alguien queda afuera.

> 🌎 **Otro ejemplo:** Es como la ficha técnica de un auto: potencia, presión de las llantas y tipo de aceite, en una sola hoja. El mecánico mira la ficha, no adivina.

En la parte 2 pusiste los secretos en `.env`. La pregunta siguiente es **quién los lee**. Si cada archivo hace `process.env.ALGO` por su cuenta, pasan tres cosas malas: un nombre mal escrito da `undefined` **a la mitad** del programa, los valores por defecto se repiten (y se contradicen), y no se puede probar sin tocar las variables de la computadora.

La solución es la misma idea que un motor de diseño, para un programa sin pantalla: **un solo módulo** que lee todo, lo revisa y lo entrega.

```js
// src/config.js: lo único que lee process.env.
export function leerConfig(env = process.env) {
  const puerto = Number(env.PUERTO ?? 3000);
  if (!Number.isInteger(puerto)) throw new Error('PUERTO tiene que ser un número entero');
  const modo = env.NODE_ENV ?? 'desarrollo';
  if (modo === 'produccion' && !env.TOKEN_SECRETO) throw new Error('Falta TOKEN_SECRETO');
  return Object.freeze({ puerto, modo, tokenSecreto: env.TOKEN_SECRETO ?? 'solo-para-desarrollo' });
}

export const config = leerConfig();
```

```js
// src/servidor.js: no sabe de dónde salen los valores. Solo los usa.
import { config } from './config.js';
app.listen(config.puerto);
```

- **Falla al arrancar, no a la mitad.** Si falta el secreto en producción, el servidor ni prende, con un mensaje claro.
- **`Object.freeze`**: nadie cambia la configuración por accidente mientras corre.
- **`env = process.env`** como parámetro: en las pruebas le pasas un objeto común.

> 📌 **Nota:** fíjate en el valor por defecto de `tokenSecreto`: existe **solo** para desarrollo. En producción no hay valor por defecto: si falta, es un error. Un secreto "de mentira" que llega a producción es un agujero de seguridad.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer la configuración una sola vez
lenguaje: js
pide: Completa `leerConfig(env)`. Devuelve un objeto **congelado** (`Object.freeze`) con `puerto` (de `env.PUERTO` como número, por defecto `3000`), `modo` (de `env.NODE_ENV`, por defecto `'desarrollo'`) y `limitePorMinuto` (de `env.LIMITE`, por defecto `60`). Lanza `Error('PUERTO tiene que ser un número entero')` si el puerto no es un entero, y `Error('Falta TOKEN_SECRETO')` si el modo es `'produccion'` y no viene `env.TOKEN_SECRETO`.
--- código
function leerConfig(env) {
  // tu código aquí
}
--- pruebas
const error = (env) => { try { leerConfig(env); return 'no lanzó'; } catch (e) { return e.message; } };
prueba('sin nada: los valores por defecto', () => igual(leerConfig({}), { puerto: 3000, modo: 'desarrollo', limitePorMinuto: 60 }));
prueba('lee lo que viene', () => igual(leerConfig({ PUERTO: '8080', LIMITE: '100' }).puerto, 8080));
prueba('un puerto que no es número', () => igual(error({ PUERTO: 'ochenta' }), 'PUERTO tiene que ser un número entero'));
prueba('producción sin secreto no arranca', () => igual(error({ NODE_ENV: 'produccion' }), 'Falta TOKEN_SECRETO'));
prueba('producción con secreto sí', () => igual(leerConfig({ NODE_ENV: 'produccion', TOKEN_SECRETO: 'x' }).modo, 'produccion'));
prueba('nadie la cambia después', () => ok(Object.isFrozen(leerConfig({})), 'usa Object.freeze'));
--- solución
function leerConfig(env) {
  const puerto = Number(env.PUERTO ?? 3000);
  if (!Number.isInteger(puerto)) throw new Error('PUERTO tiene que ser un número entero');
  const modo = env.NODE_ENV ?? 'desarrollo';
  if (modo === 'produccion' && !env.TOKEN_SECRETO) throw new Error('Falta TOKEN_SECRETO');
  return Object.freeze({ puerto, modo, limitePorMinuto: Number(env.LIMITE ?? 60) });
}
```

```practica
vf :: Conviene que un solo módulo lea process.env y el resto del programa use lo que ese módulo entrega
vf :: En producción, si falta el secreto, lo mejor es usar uno por defecto para que el servidor arranque igual
elige :: ¿Cuándo conviene que falle una configuración mal puesta? :: Cuando alguien use esa parte :: Al arrancar el programa :: Nunca: mejor seguir → Fallar al arrancar, con un mensaje claro, evita errores raros a la mitad.
escribe :: ¿Qué tiene que ver la configuración en un solo lugar con un motor de diseño? :: Es la misma idea: los valores que deciden cómo se ve o cómo se comporta algo viven en un solo lugar, y el resto los llama. Cambiar un valor es cambiar una línea, no buscarlo por todo el código.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo aseguras una API en Node?":** "Guardo en una base de datos con consultas parametrizadas para evitar inyección, con restricciones en la propia tabla. Los secretos van en .env o en el gestor de secretos, nunca en el código. Verifico el token de Firebase Auth en el servidor y solo dejo tocar lo que es del uid. Pongo límites de uso, helmet, CORS para mis dominios y errores sin detalles. Y si uso firebase-admin, sé que se salta las reglas, así que valido todo en el código, como en las funciones de mi mapa de estudios."

> 🌎 **En la vida real:** es como un jefe de seguridad explicando las capas de protección de un banco.

> 🌎 **Otro ejemplo:** Es como el plan de seguridad de un edificio: llaves, portero, cámaras y alarma.
