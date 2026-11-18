# Informe de auditoría: API de gastos (versión con-errores)

> Proyecto de práctica del curso Seguridad del Mapa de estudios. Todo se probó **solo en esta computadora**
> (`127.0.0.1`), con usuarios de prueba. No hay datos de nadie.

## Alcance

- **Qué se revisó:** `con-errores/` (la API, sus datos, su configuración y la página).
- **Qué no:** la versión `arreglada/`, Node.js, Express y SQLite por dentro.
- **Cómo:** leyendo el código por categorías (clase 24) y escribiendo una **trampa** (una prueba que intenta
  el ataque y espera que falle) para cada hallazgo, en `test/trampas.test.mjs`.

## Resumen

| # | Hallazgo | Severidad | Categoría (OWASP) |
|---|---|---|---|
| V1 | Cualquiera con sesión ve los gastos de otros cambiando el id | Alta | Control de acceso roto |
| V2 | Se puede crear un gasto a nombre de otro usuario | Alta | Control de acceso roto |
| V3 | La búsqueda permite inyección SQL y trae datos de otros | Crítica | Inyección |
| V4 | La nota se muestra como HTML en la página (XSS) | Alta | Inyección |
| V5 | Las claves se guardan en texto plano | Alta | Fallas criptográficas |
| V6 | El login dice si un usuario existe | Baja | Fallas de autenticación |
| V7 | El login no limita los intentos | Media | Fallas de autenticación |
| V8 | Los errores muestran el stack al usuario | Media | Configuración insegura |
| V9 | CORS abierto a cualquier sitio | Media | Configuración insegura |
| V10 | Una clave de servicio escrita en el código | Alta | Fallas criptográficas / secretos |

## Hallazgos

### V1 · IDOR en `GET /gastos/:id`

- **Severidad:** alta · **Categoría:** control de acceso roto
- **Dónde:** `con-errores/app.mjs`, ruta `GET /gastos/:id`
- **Descripción:** busca el gasto solo por su id; no revisa que sea del usuario de la sesión.
- **Cómo se explota:** Ana entra y pide `GET /gastos/2`: recibe el gasto de Beto, con su nota privada.
- **Corrección:** `WHERE id = ? AND dueno = ?` con el usuario de la sesión; si no hay fila, 404 (no 403).
- **Trampa:** `V1 IDOR`.

### V2 · Asignación masiva en `POST /gastos`

- **Severidad:** alta · **Categoría:** control de acceso roto
- **Dónde:** `con-errores/app.mjs`, ruta `POST /gastos` (`{ dueno: pedido.usuario, ...pedido.body }`)
- **Descripción:** todo lo que viene en el cuerpo pisa los valores del servidor, también `dueno`.
- **Cómo se explota:** Ana manda `{ "tipo": "lavado", "valor": 999, "dueno": "beto" }` y el gasto aparece en la lista de Beto.
- **Corrección:** tomar solo `tipo`, `valor` y `nota`; el dueño sale **siempre** de la sesión.
- **Trampa:** `V2 asignación masiva`.

### V3 · Inyección SQL en `GET /gastos/buscar`

- **Severidad:** crítica · **Categoría:** inyección
- **Dónde:** `con-errores/app.mjs`, ruta `GET /gastos/buscar` (la consulta se arma con `${nota}`)
- **Descripción:** la nota que escribe la persona se pega dentro del SQL.
- **Cómo se explota:** buscar `' OR 1=1 --`: la consulta queda `… nota LIKE '%' OR 1=1 --%'` y devuelve **todos** los gastos de **todos**.
- **Corrección:** consulta con parámetros: `… WHERE dueno = ? AND nota LIKE ?` y los valores aparte.
- **Trampa:** `V3 inyección SQL`.

### V4 · XSS en la página

- **Severidad:** alta · **Categoría:** inyección
- **Dónde:** `con-errores/publico/vista.mjs`, `filaHtml`
- **Descripción:** la nota se mete en el HTML sin escapar.
- **Cómo se explota:** guardar un gasto con la nota `<img src=x onerror="…">`: el código corre en el navegador de quien vea la lista.
- **Corrección:** escapar `& < > " '` antes de armar el HTML (o usar `textContent`).
- **Trampa:** `V4 XSS`.

### V5 · Claves en texto plano

- **Severidad:** alta · **Categoría:** fallas criptográficas
- **Dónde:** `con-errores/datos.mjs` (columna `clave`) y la comparación en `/login`
- **Descripción:** si alguien obtiene la base (una copia de respaldo, un error), tiene las claves de todos, y la gente reusa claves.
- **Cómo se explota:** `SELECT * FROM usuarios` muestra las claves.
- **Corrección:** guardar sal y huella con `scrypt`, y comparar con `timingSafeEqual`.
- **Trampa:** `V5 claves`.

### V6 · Enumeración de usuarios en `/login`

- **Severidad:** baja · **Categoría:** fallas de autenticación
- **Dónde:** `con-errores/app.mjs`, `/login`
- **Descripción:** responde "Ese usuario no existe" o "Clave incorrecta": cualquiera puede averiguar qué usuarios hay.
- **Cómo se explota:** probar nombres y mirar el mensaje.
- **Corrección:** una sola respuesta, "Usuario o clave incorrectos", y comparar con una huella de relleno para tardar lo mismo.
- **Trampa:** `V6 enumeración`.

### V7 · Sin límite de intentos en `/login`

- **Severidad:** media · **Categoría:** fallas de autenticación
- **Dónde:** `con-errores/app.mjs`, `/login`
- **Descripción:** se pueden probar claves sin parar (fuerza bruta, diccionario).
- **Cómo se explota:** un programa que manda miles de claves seguidas.
- **Corrección:** 5 intentos fallidos por usuario y 15 minutos de espera (429).
- **Trampa:** `V7 fuerza bruta`.

### V8 · Errores con detalles

- **Severidad:** media · **Categoría:** configuración insegura
- **Dónde:** `con-errores/app.mjs`, el manejador de errores
- **Descripción:** devuelve `error.stack`: rutas del disco, archivos, líneas, librerías y la consulta que falló.
- **Cómo se explota:** provocar un error y leer la respuesta: es un mapa del servidor.
- **Corrección:** el detalle al registro (`console.error`); al usuario, `{ "error": "Algo salió mal" }`.
- **Trampa:** `V8 errores`.

### V9 · CORS abierto

- **Severidad:** media · **Categoría:** configuración insegura
- **Dónde:** `con-errores/app.mjs`, `Access-Control-Allow-Origin: *`
- **Descripción:** cualquier sitio puede leer las respuestas desde el navegador.
- **Cómo se explota:** una página de otro sitio llama a la API y lee lo que vuelve.
- **Corrección:** responder el origen solo si está en `ORIGENES`.
- **Trampa:** `V9 CORS`.

### V10 · Secreto en el código

- **Severidad:** alta · **Categoría:** secretos
- **Dónde:** `con-errores/config.mjs`, `CLAVE_SMS`
- **Descripción:** la clave del servicio de SMS está escrita en un archivo del repositorio.
- **Cómo se explota:** quien vea el repositorio (o su historial) usa la clave, y los SMS los pagas tú.
- **Corrección:** leerla de `process.env.CLAVE_SMS` y **rotarla** (pedir una nueva y anular la vieja): sigue en el historial de Git.
- **Trampa:** `V10 secretos`.

## Cómo comprobarlo

```bash
npm install
npm run trampas              # contra con-errores: las 10 en rojo (los errores están)
npm run trampas:arreglada    # contra la arreglada: las 10 en verde
npm run uso                  # el uso normal pasa en las dos versiones
```
