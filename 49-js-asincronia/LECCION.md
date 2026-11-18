# JavaScript 5: asincronía — promesas, async/await y fetch

> 🌎 **En la vida real:** cuando pides comida por app, no te quedas parado mirando la puerta: sigues con tu vida y te avisan cuando llega. Eso es asincronía.

> 🎙️ **El profesor dice:** casi todo lo importante en una app tarda: pedir datos a Firebase, a una API, leer un archivo. JavaScript no se queda esperando: sigue trabajando y "te avisa". Hoy: por qué existe esto, las **promesas**, **async/await**, **fetch** para pedir datos y cómo manejar los errores.

## Parte 1. Un solo hilo y la espera

> 🌎 **En la vida real:** un mesero atiende muchas mesas: toma un pedido, lo deja en la cocina y no se queda parado esperando el plato.

> 🌎 **Otro ejemplo:** Es como poner la ropa en la lavadora y mientras tanto lavar los platos.

### Por qué no se puede "esperar parado"

JavaScript hace **una cosa a la vez** (un solo hilo, como viste en la clase 11 con Copiloto). Si se quedara esperando a internet, la pantalla se congelaría. Por eso, lo que tarda se **pide** y JavaScript sigue; cuando llega la respuesta, ejecuta lo que dejaste preparado.

```js
console.log('1. pido el dato');
setTimeout(() => console.log('3. llegó el dato'), 1000);
console.log('2. sigo con otra cosa');
```

> 🌎 **En la vida real:** es como dejar el carro en el lavadero y volver cuando te avisan.

> 🌎 **Otro ejemplo:** Es como dejar la ropa en la tintorería: no te quedas ahí sentado.

```practica
vf :: JavaScript hace una sola cosa a la vez
vf :: Si JavaScript esperara parado a internet, la pantalla seguiría respondiendo normal
elige :: ¿En qué orden se imprimen los tres mensajes del ejemplo? :: 1, 3, 2 :: 1, 2, 3 :: 3, 2, 1
elige :: ¿Cuál de estas tareas tarda y conviene hacerla asíncrona? :: Sumar dos números :: Pedir datos a Firebase :: Crear una variable
escribe :: Explica con un ejemplo de la vida real qué es la asincronía. :: Es pedir algo que tarda y seguir haciendo otras cosas hasta que avisan que llegó, como pedir comida por app y seguir con tu día.
```

## Parte 2. Promesas

> 🌎 **En la vida real:** una promesa es el ticket del restaurante: todavía no tienes el plato, pero te garantiza que vas a recibirlo… o que te avisarán que se acabó.

> 🌎 **Otro ejemplo:** Es como el número de seguimiento de un paquete.

### Tres estados

Una **Promise** está **pendiente**, **cumplida** (con un valor) o **rechazada** (con un error).

```js
fetch('https://api.github.com/repos/DelvinSmart/estudios')
  .then((respuesta) => respuesta.json())
  .then((datos) => console.log(datos.name))
  .catch((error) => console.error('Falló:', error));
```

`.then` recibe el resultado; `.catch` recibe el error.

> 🌎 **En la vida real:** `.then` es "cuando llegue el paquete, ábrelo"; `.catch` es "si se pierde, reclama".

> 🌎 **Otro ejemplo:** Es como un plan A y un plan B escritos de antemano.

### Varias a la vez: Promise.all

```js
const [carro, gastos] = await Promise.all([leerCarro(), leerGastos()]);   // espera las dos en paralelo
```

> 🌎 **En la vida real:** es como poner a cocinar el arroz y la carne al mismo tiempo en vez de uno después del otro.

> 🌎 **Otro ejemplo:** Es como pedir dos deliveries a la vez.

```practica
vf :: Una promesa puede estar pendiente, cumplida o rechazada
vf :: .catch se ejecuta cuando la promesa se cumple bien
elige :: ¿Para qué sirve Promise.all? :: Para cancelar promesas :: Para esperar varias promesas en paralelo :: Para ordenar arrays
elige :: ¿Qué devuelve fetch? :: El texto directamente :: Una promesa de la respuesta :: Un número
escribe :: ¿Qué es una promesa en JavaScript? :: Un objeto que representa un resultado que todavía no llegó; puede quedar cumplida con un valor o rechazada con un error.
```

## Parte 3. async y await

> 🌎 **En la vida real:** `await` es "espera aquí a que llegue, pero sin congelar el restaurante".

> 🌎 **Otro ejemplo:** Es como leer un libro mientras el agua hierve: esperas el agua, no el mundo.

### La forma moderna

`async` marca una función que trabaja con promesas; `await` espera una promesa **dentro** de ella, y el código se lee de arriba abajo:

```js
async function leerRepositorio() {
  try {
    const respuesta = await fetch('https://api.github.com/repos/DelvinSmart/estudios');
    if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
    const datos = await respuesta.json();
    return datos.stargazers_count;
  } catch (error) {
    console.error('No se pudo leer:', error.message);
    return null;
  }
}
```

Una función `async` **siempre devuelve una promesa**.

> 🌎 **En la vida real:** es como escribir una receta con pasos "espera a que hierva" sin quedarte mirando la olla.

> 🌎 **Otro ejemplo:** Es como una lista de trámites: "espera turno, entrega papeles, espera firma".

### Los errores típicos

- Olvidar `await`: tienes una promesa en vez del dato (`Promise {<pending>}`).
- No revisar `respuesta.ok`: `fetch` **no** falla con un 404 o 500; solo falla si no hay red.
- No poner `try/catch`: un error sin atrapar rompe silenciosamente.

> 🌎 **En la vida real:** olvidar `await` es como irte del restaurante con el ticket y sin el plato.

> 🌎 **Otro ejemplo:** No revisar `ok` es como aceptar un paquete sin ver que vino roto.

```practica
vf :: Una función async siempre devuelve una promesa
vf :: fetch lanza un error cuando el servidor responde 404
elige :: ¿Qué ves si olvidas await antes de fetch? :: El dato :: Una promesa pendiente :: Un error siempre
elige :: ¿Dónde se puede usar await? :: En cualquier lugar :: Dentro de una función async (o en módulos) :: Solo en Python
escribe :: Escribe una función async que pida un JSON y devuelva los datos, con try/catch. :: async function leer(url) { try { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return await r.json(); } catch (e) { console.error(e); return null; } }
```

## Parte 4. Asincronía en las apps de verdad

> 🌎 **En la vida real:** en Copiloto, cada vez que guardas un gasto, la app lo manda a Firebase y sigue respondiendo mientras tanto.

> 🌎 **Otro ejemplo:** Es como mandar un WhatsApp: escribes el siguiente mientras el anterior se envía.

### Firebase usa promesas

Todas las operaciones de Firebase devuelven promesas:

```js
await setDoc(doc(db, 'gastos', id), { tipo: 'combustible', valor: 150 });
const foto = await getDoc(doc(db, 'gastos', id));
```

Este mismo mapa lo hace en `web/nube.js` para tus bombillos y el certificado.

> 🌎 **En la vida real:** es como el banco por internet: pides la transferencia y te avisa cuando quedó hecha.

> 🌎 **Otro ejemplo:** Es como dejar un pedido en la farmacia y recibir el mensaje "listo para retirar".

### Mostrar "cargando" y los errores

Mientras esperas, muestra algo ("conectando…"); cuando falla, di qué pasó y qué hacer. Es lo que hace la pantalla del certificado: "// revisando…" y "☁ Sin conexión".

> 🌎 **En la vida real:** es como el cartel "estamos preparando su pedido" en una pizzería.

> 🌎 **Otro ejemplo:** Es como el aviso del GPS: "recalculando ruta".

```practica
vf :: Las operaciones de Firebase devuelven promesas
vf :: Mientras se espera una respuesta conviene no mostrar nada en la pantalla
elige :: ¿Qué archivo de este mapa habla con Firebase con async/await? :: estilos.css :: web/nube.js :: index.html
elige :: ¿Qué muestra el certificado mientras consulta el servidor? :: Nada :: Un mensaje de "revisando…" o "conectando…" :: Un error siempre
escribe :: Describe los tres estados que debería mostrar una pantalla que pide datos. :: Cargando mientras espera, los datos cuando llegan bien, y un mensaje de error claro con qué hacer cuando falla.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas la asincronía en JavaScript?":** "JavaScript tiene un solo hilo, así que lo que tarda se maneja con promesas. Uso async/await con try/catch, reviso respuesta.ok porque fetch no falla con un 404, y uso Promise.all cuando puedo pedir cosas en paralelo. En la interfaz muestro estados de cargando, datos y error. Firebase y fetch trabajan así en mis apps."

> 🌎 **En la vida real:** es como explicar cómo un restaurante atiende muchas mesas sin que ninguna espere de más.

> 🌎 **Otro ejemplo:** Es como un controlador aéreo: muchas cosas en el aire y ninguna se olvida.
