# Docker: tu app en una caja que funciona igual en todas partes

> 🌎 **En la vida real:** antes, cargar un barco era un caos de sacos y barriles de todos los tamaños. Entonces apareció el **contenedor** de metal: siempre igual por fuera, y da lo mismo si va en barco, tren o camión. Docker hace eso con los programas.

> 🎙️ **El profesor dice:** {{alumno}}, ya tienes una API en Node. Ahora imagina que funciona en tu Mac, pero en el servidor falla porque tiene otra versión de Node. Docker resuelve exactamente eso. En esta clase vas a entender cómo funciona y a leer sus archivos con seguridad.

## Parte 1. El problema: «en mi máquina funciona»

> 🌎 **En la vida real:** cocinas un plato perfecto en tu casa, pero en casa de un amigo sale mal: la estufa es otra y falta un condimento. La solución sería llevar **la cocina completa** contigo.

Un programa no vive solo. Necesita una versión de Node, librerías, archivos y ajustes. Si algo de eso cambia entre tu Mac y el servidor, el programa puede fallar.

> 📖 **Palabra nueva: Docker.** Es una herramienta que empaqueta tu app **con todo lo que necesita** para correrla de la misma forma en cualquier máquina compatible.

Tres palabras explican casi todo:

| Palabra | Qué es | En la cocina |
|---|---|---|
| **Dockerfile** | Las instrucciones para armar el paquete | La receta |
| **Imagen de Docker** | El paquete ya armado, que no cambia | La comida congelada, lista y sellada |
| **Contenedor** | Una imagen **corriendo** | El plato servido y caliente |

```dibujo
titulo De una receta sale una imagen, y de una imagen salen muchos contenedores
lienzo 420 216
caja 8 12 150 58 azul | Dockerfile | la receta
flecha 158 41 258 41 tenue | docker build
caja 260 12 152 58 amarillo | Imagen | sellada
linea 336 70 336 96 tenue
linea 104 96 336 96 tenue
flecha 104 96 104 134 tenue
flecha 316 96 316 134 tenue
texto 210 116 tenue | docker run
caja 14 136 180 66 verde | Contenedor 1 | corriendo
caja 226 136 180 66 verde | Contenedor 2 | corriendo
```

> 💡 **Idea:** una imagen es como una **clase** y un contenedor como un **objeto** creado con ella. De una sola imagen puedes arrancar muchos contenedores independientes.

```practica
elige :: ¿Qué problema principal resuelve Docker? :: Hace que el código se escriba solo :: Que una app corra igual en distintas máquinas, con todo lo que necesita :: Reemplaza a Git
elige :: ¿Qué es un contenedor? :: La receta :: Una imagen en ejecución :: Una rama de Git
vf :: De una misma imagen se pueden crear varios contenedores
```

## Parte 2. Leer un Dockerfile, línea por línea

> 🌎 **En la vida real:** es como armar un carro en una línea de montaje: primero el chasis, después el motor y al final las llaves. Cada estación agrega algo.

Este Dockerfile empaqueta una API de Node como la del curso:

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 3000
CMD ["node", "src/servidor.mjs"]
```

| Línea | Qué significa |
|---|---|
| `FROM node:22-slim` | Parte de una imagen que ya trae Linux básico y Node 22 |
| `WORKDIR /app` | Trabaja dentro de la carpeta `/app` |
| `COPY package*.json ./` | Copia la lista de librerías |
| `RUN npm ci --omit=dev` | **Mientras se arma**, instala solo lo necesario para producción |
| `COPY . .` | Copia el resto de tu proyecto |
| `USER node` | Corre la app con un usuario **sin privilegios de administrador** |
| `EXPOSE 3000` | **Documenta** que la app escucha en el puerto 3000. No lo abre por sí solo |
| `CMD [...]` | Lo que se ejecuta **cuando arranca** el contenedor |

> ⚠️ **`RUN` y `CMD` no son lo mismo.** `RUN` pasa una vez, al **armar** la imagen. `CMD` pasa cada vez que **arranca** un contenedor.

### Las capas: por qué importa el orden

Cada instrucción crea una **capa**, como los pisos de un edificio. Docker guarda las capas y reutiliza las que no cambiaron. Pero si cambia una, **esa y todas las de arriba se rehacen**.

```dibujo
titulo Si cambias tu código, las capas de abajo se reutilizan y npm ci no se repite
lienzo 420 230
llena 60 8 300 40 rojo | COPY . . (se rehace)
llena 60 54 300 40 verde | RUN npm ci (reutilizada)
llena 60 100 300 40 verde | COPY package*.json (reutilizada)
llena 60 146 300 40 verde | WORKDIR /app (reutilizada)
llena 60 192 300 34 verde | FROM node:22-slim (reutilizada)
```

Por eso primero se copia `package.json` y después el código. Si los inviertes, cada cambio de una letra reinstala todas las librerías.

### Lo que no debe entrar

El archivo **`.dockerignore`** funciona como `.gitignore`, pero para la imagen:

```text
node_modules
.git
.env
*.log
```

> ⚠️ **Nunca metas claves en una imagen.** Quien tenga la imagen puede inspeccionar sus capas. Las claves se entregan **al arrancar**, como variables de entorno o con un gestor de secretos.

> 🧩 **Pieza para este ejercicio:** `lista.slice(2)` devuelve una lista nueva **desde la posición 2 hasta el final**. Las posiciones empiezan en 0: `['a', 'b', 'c'].slice(1)` da `['b', 'c']`.

✍️ **Ahora escribes tú:**

```ejercicio
titulo: ¿Qué capas se rehacen?
lenguaje: js
pide: Completa `capasARehacer(capas, cambio)`. `capas` es la lista de instrucciones, de la primera a la última, y `cambio` es la posición de la que cambió. Devuelve esa capa y todas las que siguen.
--- código
function capasARehacer(capas, cambio) {
  // escribe aquí tu respuesta
}
--- pruebas
const capas = ['FROM', 'WORKDIR', 'COPY package', 'RUN npm ci', 'COPY codigo'];
prueba('cambia el código: solo la última', () => igual(capasARehacer(capas, 4), ['COPY codigo']));
prueba('cambian las librerías', () => igual(capasARehacer(capas, 2), ['COPY package', 'RUN npm ci', 'COPY codigo']));
prueba('cambia la base: todas', () => igual(capasARehacer(capas, 0), capas));
--- solución
function capasARehacer(capas, cambio) {
  return capas.slice(cambio);
}
```

```practica
elige :: ¿Cuándo se ejecuta RUN? :: Cada vez que arranca el contenedor :: Una vez, mientras se arma la imagen :: Cuando haces git push
vf :: EXPOSE 3000 abre por sí solo el puerto hacia tu computadora
elige :: ¿Por qué se copia package.json antes que el código? :: Porque es obligatorio :: Para reutilizar la capa de librerías cuando solo cambia el código :: Para que pese más
vf :: Es seguro guardar claves dentro de una imagen si la imagen es pequeña
```

## Parte 3. Cómo se aísla un contenedor

> 🌎 **En la vida real:** una **máquina virtual** es una casa completa, con sus propios cimientos. Un **contenedor** es un apartamento: tiene su puerta y sus cosas, pero comparte los cimientos del edificio.

Un contenedor **no trae su propio sistema operativo completo**. Trae sus archivos y librerías, pero comparte el **kernel** de la máquina.

> 📖 **Palabra nueva: kernel.** Es el núcleo del sistema operativo: la parte que habla con la CPU, la memoria y el disco. Lo viste como la capa del sistema operativo en el Tema 126.

```dibujo
titulo Cada contenedor tiene su app, pero todos comparten el mismo kernel
lienzo 420 276
caja 10 6 186 112 azul
texto 103 24 azul | Contenedor 1
caja 22 40 162 30 tenue | Tu app
caja 22 76 162 30 tenue | Librerías
caja 224 6 186 112 morado
texto 317 24 morado | Contenedor 2
caja 236 40 162 30 tenue | Tu app
caja 236 76 162 30 tenue | Librerías
caja 70 146 280 40 amarillo | Docker Engine | crea y administra
punteada 150 146 103 118 amarillo
punteada 270 146 317 118 amarillo
flecha 40 118 40 216 azul
flecha 380 118 380 216 morado
caja 10 218 400 52 verde | Kernel de Linux compartido | namespaces aíslan · cgroups limitan
```

El kernel de Linux aporta dos piezas clave:

| Pieza | Qué hace | En el edificio |
|---|---|---|
| **Namespaces** | Hacen que cada contenedor vea solo sus procesos, su red y sus archivos | Las paredes y la puerta |
| **Cgroups** | Limitan cuánta CPU y memoria puede usar | El límite de agua y luz |

### Contenedor o máquina virtual

| | Contenedor | Máquina virtual |
|---|---|---|
| **Sistema operativo** | Comparte el kernel | Trae el suyo completo |
| **Arranque** | Normalmente segundos o menos | Normalmente más lento |
| **Peso** | Megabytes | Gigabytes |
| **Aislamiento** | Bueno, pero con el kernel compartido | Más fuerte |

> 📌 **¿Y en una Mac o en Windows?** Los contenedores de Linux necesitan un kernel de Linux. Por eso, ahí Docker corre una pequeña máquina virtual de Linux por debajo.

> ⚠️ **Un contenedor no es una caja fuerte.** Aísla bastante, pero comparte el kernel. Por eso se usa `USER node`, y por eso no se corre código desconocido confiando solo en Docker.

```practica
vf :: Cada contenedor trae su propio kernel completo
elige :: ¿Qué hacen los cgroups? :: Guardan el código :: Limitan cuánta CPU y memoria usa un contenedor :: Crean ramas
elige :: ¿Qué hacen los namespaces? :: Hacen que cada contenedor vea solo sus procesos, su red y sus archivos :: Comprimen la imagen :: Publican la app
```

## Parte 4. Usarlo: comandos, puertos y datos

> 🌎 **En la vida real:** el contenedor es un local dentro de un centro comercial. Para que un cliente llegue, hay que conectar una puerta de la calle con la puerta del local. Eso es publicar un puerto.

| Comando | Qué hace |
|---|---|
| `docker build -t gastos-api .` | Arma la imagen y le pone nombre |
| `docker images` | Lista las imágenes |
| `docker run -d --name api -p 8080:3000 gastos-api` | Arranca un contenedor |
| `docker ps` | Lista los que están corriendo |
| `docker logs api` | Muestra lo que imprimió la app |
| `docker exec -it api sh` | Abre una terminal dentro del contenedor |
| `docker stop api` | Lo detiene |
| `docker rm api` | Lo elimina |

En el comando `run`, `-d` lo deja corriendo en segundo plano. `--name` le da un nombre. `-p 8080:3000` conecta **el puerto 8080 de tu computadora** con **el 3000 del contenedor**.

```dibujo
titulo Con -p 8080:3000, lo que llega a tu puerto 8080 entra al puerto 3000 del contenedor
lienzo 420 130
caja 6 34 106 58 tenue | Navegador | localhost:8080
flecha 112 63 154 63 tenue
llena 156 42 62 42 amarillo | 8080
flecha 218 63 276 63 azul | -p
caja 278 20 136 88 verde | Contenedor | puerto 3000
```

### Los datos no viven en el contenedor

Si eliminas un contenedor, **lo que escribió dentro se pierde**. Para conservarlo se usa un **volumen**, un espacio de datos que vive fuera:

```bash
docker run -d --name api -p 8080:3000 -v datos-gastos:/app/datos gastos-api
```

Las configuraciones se pasan al arrancar:

```bash
docker run -d --name api -p 8080:3000 --env-file .env gastos-api
```

### Varios contenedores juntos

Una app real puede tener una API y una base de datos. **Docker Compose** describe todo en un archivo y lo arranca con `docker compose up`:

```yaml
services:
  api:
    build: .
    ports: ["8080:3000"]
    environment:
      DB_HOST: base
    depends_on: [base]
  base:
    image: postgres:17
    env_file: .env.base
    volumes: [datos:/var/lib/postgresql/data]
volumes:
  datos:
```

### ¿Lo necesito siempre?

No. **Copiloto no lo necesita para su app móvil**, y una función de Firebase se publica sin que armes una imagen. Docker brilla con servidores propios, varios servicios y equipos que necesitan el mismo entorno.

> 📌 **Para practicar gratis:** Docker Engine es de código abierto en Linux. En Mac, [Colima](https://github.com/abiosoft/colima) es una opción gratuita para correr contenedores. Docker Desktop tiene condiciones de licencia según el uso, así que revísalas si lo vas a usar en una empresa.

```practica
elige :: En -p 8080:3000, ¿cuál es el puerto de tu computadora? :: 8080 :: 3000 :: Ninguno
vf :: Si eliminas un contenedor, sus datos internos se conservan siempre
elige :: ¿Para qué sirve Docker Compose? :: Para escribir commits :: Para describir y arrancar varios contenedores juntos :: Para comprimir fotos
escribe :: Explica con tus palabras la diferencia entre Dockerfile, imagen y contenedor. :: El Dockerfile es la receta con las instrucciones. La imagen es el paquete ya armado con la app y lo que necesita, y no cambia. El contenedor es esa imagen corriendo, y de una imagen puedo arrancar varios.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es Docker?":** "Es una herramienta para empaquetar una aplicación con sus dependencias en una imagen y correrla como contenedor. Así funciona igual en mi máquina, en el CI y en el servidor."

> 🎤 **Si te preguntan "¿contenedor o máquina virtual?":** "Una máquina virtual trae su propio sistema operativo completo. Un contenedor comparte el kernel de la máquina, por eso es más liviano y arranca más rápido, a cambio de un aislamiento menos fuerte."

> 🎤 **Si te preguntan "¿por qué importa el orden en un Dockerfile?":** "Porque cada instrucción crea una capa, y al cambiar una se rehacen las siguientes. Copio primero package.json e instalo, y después el código, para no reinstalar todo en cada cambio."

> 🎤 **Si te preguntan "¿cómo manejas secretos con Docker?":** "No los pongo en la imagen, porque se pueden extraer de sus capas. Los entrego al arrancar, con variables de entorno o un gestor de secretos."
