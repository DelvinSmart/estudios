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

```practica
vf :: express-rate-limit limita cuántos pedidos puede hacer cada IP en un tiempo
vf :: helmet reemplaza la validación de los datos
elige :: ¿Qué significa limit: 60 con windowMs: 60_000? :: 60 pedidos por segundo :: 60 pedidos por minuto :: 60 usuarios
elige :: ¿Cuál de estas NO está en la lista del servidor seguro? :: Consultas con parámetros :: Mostrar el stack del error al usuario :: CORS solo para tus dominios
escribe :: Escribe cinco cosas de la lista corta del servidor seguro. :: Secretos en .env o en el gestor de secretos, validar todo lo que entra, consultas con parámetros, verificar el token y los permisos, y límites de uso (además de CORS, helmet y errores sin detalles).
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo aseguras una API en Node?":** "Guardo en una base de datos con consultas parametrizadas para evitar inyección, con restricciones en la propia tabla. Los secretos van en .env o en el gestor de secretos, nunca en el código. Verifico el token de Firebase Auth en el servidor y solo dejo tocar lo que es del uid. Pongo límites de uso, helmet, CORS para mis dominios y errores sin detalles. Y si uso firebase-admin, sé que se salta las reglas, así que valido todo en el código, como en las funciones de mi mapa de estudios."

> 🌎 **En la vida real:** es como un jefe de seguridad explicando las capas de protección de un banco.

> 🌎 **Otro ejemplo:** Es como el plan de seguridad de un edificio: llaves, portero, cámaras y alarma.
