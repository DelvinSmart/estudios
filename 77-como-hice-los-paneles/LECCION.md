# Cómo hice los paneles

> 🌎 **En la vida real:** un restaurante tiene dos partes. El **salón**, donde se sientan los clientes y ven el menú, y la **cocina**, donde solo entra el personal y se decide qué hay en el menú. Los clientes nunca entran a la cocina, pero todo lo que comen sale de ahí. Un **panel** es la cocina de una página web.

> 🎙️ **El profesor:** {{alumno}}, hasta ahora viste cómo se hicieron tres proyectos por fuera: Copiloto, ¿Qué dice la Biblia? y este mapa de estudios. Los tres tienen algo escondido: un **panel**, una página privada desde donde el dueño cambia lo que ven los demás sin abrir el código. En esta clase vas a ver qué es un panel, cómo sabe que eres tú, por dónde viaja cada cambio hasta llegar a la página y cómo se construye uno, paso a paso. No necesitas saber nada de antes: cada palabra nueva se explica cuando aparece.

**Los tres paneles de esta clase:**

| Panel | Dónde está | Qué cambia | Con qué se construyó |
|---|---|---|---|
| **¿Qué dice la Biblia?** | `panel.html` de ese sitio | Los estudios (textos, versículos, imágenes) | HTML, CSS y JavaScript + GitHub |
| **Mapa de estudios** (este) | `panel.html` de este sitio | El texto de las clases | HTML, CSS y JavaScript + GitHub |
| **Copiloto** | Un sitio aparte, en Firebase Hosting | Usuarios, avisos de la app, diseño, términos y más | React + Firebase (funciones del servidor) |

**Archivos de esta clase:**

| Archivo | Qué hace |
|---|---|
| `panel.html` (este repositorio) | La página del panel de clases |
| `web/panel.js` | Las pantallas: la llave, la lista de clases y el editor |
| `web/panel-github.js` | Lee y guarda los archivos en GitHub con la llave |
| `web/panel-reglas.js` | Revisa que el cambio no rompa los certificados antes de guardar |
| `herramientas/panel-reglas.test.mjs` | Las pruebas de esas reglas |
| `js/github.js` (¿Qué dice la Biblia?) | Lo mismo que `panel-github.js`, pero para los estudios |
| `web/src/lib/adminApi.ts` (Copiloto) | Cómo el panel de Copiloto le pide cosas al servidor |
| `functions/src/admin.ts` (Copiloto) | Las funciones del servidor que solo responden al dueño |

## Parte 1. ¿Qué es un panel?

Una página web normal es para **mirar**: entras, lees, tocas botones. Pero alguien tiene que **escribir** lo que ves. Hay dos formas de hacerlo:

1. **Abrir el código en la computadora**, cambiar el archivo y subirlo. Funciona, pero necesitas la computadora, el editor, saber Git y no equivocarte en nada.
2. **Usar un panel**: una página con formularios, botones y cuadros de texto, hecha **solo para el dueño**, que hace esos cambios por ti desde cualquier aparato, incluso desde el iPad.

Un panel no es magia: por dentro hace **lo mismo** que harías tú a mano. La diferencia es que lo hace con botones, revisa que no te equivoques y te deja trabajar desde el teléfono.

> 🌎 **En la vida real:** es como el tablero de un carro. El motor se puede ajustar abriendo el capó con herramientas, pero el tablero te da botones (luces, aire, radio) para que no tengas que meter las manos en el motor cada vez.

> 🌎 **Otro ejemplo:** Es como la app de tu banco. Podrías ir a la agencia y llenar un papel para hacer una transferencia; la app hace lo mismo con botones, y además te avisa si escribiste mal el número de cuenta.

> 🌎 **Otro ejemplo más:** Es como el control remoto de la televisión: la televisión tiene botones atrás, pero el control te deja cambiar el canal desde el sofá.

### La vitrina y la trastienda

Todo sitio con panel tiene dos caras:

| | La vitrina (la página pública) | La trastienda (el panel) |
|---|---|---|
| **Quién entra** | Cualquier persona | Solo el dueño |
| **Qué hace** | Mostrar | Cambiar lo que se muestra |
| **Qué necesita** | Nada | Probar que eres el dueño |

> 🌎 **En la vida real:** en una tienda de ropa, la vitrina la ve todo el que pasa por la calle. La trastienda, donde se decide qué ropa va a la vitrina, tiene una puerta con llave.

> 🌎 **Otro ejemplo:** Es como un mural de anuncios de una iglesia: todos pueden leerlo, pero solo el secretario tiene la llave del vidrio para poner y quitar papeles.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Vitrina y trastienda
lenguaje: js
pide: Un panel es la **trastienda**: el dueño cambia lo que los demás ven en la **vitrina**. Completa `crearTienda()`: `vitrina()` devuelve los precios publicados (una copia); `panel.cambiar(nombre, precio, llave)` solo cambia si la `llave` es `'llave-del-dueño'`, y devuelve `true` o `false`.
--- código
function crearTienda() {
  const precios = { lavado: 40 };
  return {
    vitrina() {
      // tu código aquí
    },
    panel: {
      cambiar(nombre, precio, llave) {
        // tu código aquí
      },
    },
  };
}
--- pruebas
prueba('la vitrina muestra los precios', () => igual(crearTienda().vitrina(), { lavado: 40 }));
prueba('el dueño cambia un precio', () => { const t = crearTienda(); igual(t.panel.cambiar('lavado', 45, 'llave-del-dueño'), true); igual(t.vitrina().lavado, 45); });
prueba('sin llave, no', () => { const t = crearTienda(); igual(t.panel.cambiar('lavado', 1, 'otra'), false); igual(t.vitrina().lavado, 40); });
prueba('cambiar la vitrina desde afuera no cambia nada', () => { const t = crearTienda(); t.vitrina().lavado = 0; igual(t.vitrina().lavado, 40); });
--- solución
function crearTienda() {
  const precios = { lavado: 40 };
  return {
    vitrina() {
      return { ...precios };
    },
    panel: {
      cambiar(nombre, precio, llave) {
        if (llave !== 'llave-del-dueño') return false;
        precios[nombre] = precio;
        return true;
      },
    },
  };
}
```

```practica
vf :: Un panel es una página hecha para que el dueño cambie lo que ven los demás sin abrir el código
vf :: Un panel hace cosas que serían imposibles haciéndolas a mano en la computadora
elige :: ¿Cuál de estos es un buen ejemplo de vitrina y trastienda? :: Una página con modo claro y modo oscuro :: La página de los estudios y el panel desde donde se escriben :: Dos páginas iguales en dos idiomas
escribe :: Explícale a alguien que no programa qué es un panel, con un ejemplo de la vida real. :: Es la "cocina" de una página: una parte privada donde el dueño, con botones y formularios, cambia lo que los demás ven en la página pública. Como la cocina de un restaurante: los clientes ven el menú, pero lo que hay en el menú se decide adentro.
```

## Parte 2. Las tres preguntas de todo panel

Antes de construir un panel, hay que contestar **tres preguntas**. Las respuestas deciden todo lo demás.

1. **¿Dónde viven los datos?** ¿En archivos (como los `.md` de este mapa) o en una base de datos (como los usuarios de Copiloto)?
2. **¿Cómo sabe el panel que eres tú?** ¿Con una llave, con correo y contraseña…?
3. **¿Quién revisa el cambio antes de guardarlo?** ¿Solo la página, o también un servidor que no se puede engañar?

> 🌎 **En la vida real:** antes de abrir una tienda te preguntas: ¿dónde guardo la mercadería? (el depósito), ¿quién tiene la llave? (tú y nadie más), ¿quién revisa la caja al cerrar? (tú, o un contador).

> 🌎 **Otro ejemplo:** Es como mudarte: primero decides dónde vas a vivir, quién tiene copia de la llave y quién revisa que no falte nada en el camión. Después empiezas a meter cosas en cajas.

Así respondió cada uno de los tres paneles:

| Pregunta | ¿Qué dice la Biblia? | Mapa de estudios | Copiloto |
|---|---|---|---|
| **¿Dónde viven los datos?** | Archivos `.json` en GitHub (`estudios/`) | Archivos `.md` en GitHub (las clases) | Base de datos Firestore y cuentas de Firebase |
| **¿Cómo sabe que eres tú?** | Una llave de GitHub | Una llave de GitHub | Correo y contraseña del dueño |
| **¿Quién revisa?** | El panel (medidor de citas) y GitHub (la llave) | El panel (partes y prácticas) y GitHub (la llave) | El servidor (funciones de Firebase), siempre |

Fíjate en algo: los dos primeros se parecen mucho, y Copiloto es distinto. No es por capricho. **Los datos son distintos**: un estudio bíblico es un texto que se publica para todos; los datos de Copiloto son de **personas reales** (correos, pagos, carros). Datos más delicados piden un camino más seguro.

> 🌎 **En la vida real:** para cambiar el menú escrito en la pizarra de un café basta con tener la tiza. Para cambiar la clave de la caja fuerte, el banco te pide documento, clave y a veces que vayas en persona.

> 🌎 **Otro ejemplo:** Es como la diferencia entre la llave de tu cuarto y la llave de un banco: las dos son llaves, pero la del banco tiene alarmas, cámaras y un registro de quién entró.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las tres preguntas de todo panel
lenguaje: js
pide: Antes de construir un panel: ¿dónde viven los datos?, ¿cómo sabe que eres tú?, ¿quién revisa el cambio? Completa `planDePanel(datos)`: si los datos son archivos en un repositorio (`'archivos'`) → `{ guarda: 'GitHub', identidad: 'llave fine-grained', revisa: 'GitHub y el CI' }`; si están en una base de datos (`'base de datos'`) → `{ guarda: 'Firestore', identidad: 'correo y contraseña', revisa: 'una función del servidor' }`.
--- código
function planDePanel(datos) {
  // tu código aquí
}
--- pruebas
prueba('este mapa (archivos)', () => igual(planDePanel('archivos'), { guarda: 'GitHub', identidad: 'llave fine-grained', revisa: 'GitHub y el CI' }));
prueba('Copiloto (base de datos)', () => igual(planDePanel('base de datos'), { guarda: 'Firestore', identidad: 'correo y contraseña', revisa: 'una función del servidor' }));
--- solución
const PLANES = {
  archivos: { guarda: 'GitHub', identidad: 'llave fine-grained', revisa: 'GitHub y el CI' },
  'base de datos': { guarda: 'Firestore', identidad: 'correo y contraseña', revisa: 'una función del servidor' },
};

function planDePanel(datos) {
  return PLANES[datos];
}
```

```practica
vf :: Antes de construir un panel hay que decidir dónde viven los datos, cómo sabe que eres tú y quién revisa los cambios
elige :: ¿Por qué el panel de Copiloto es más estricto que el de ¿Qué dice la Biblia? :: Porque está hecho en React :: Porque maneja datos de personas reales (correos, pagos, carros) :: Porque es más nuevo
elige :: ¿Dónde viven las clases de este mapa? :: En una base de datos de Firebase :: En archivos .md dentro de un repositorio de GitHub :: En el iPad
escribe :: Con tus palabras: ¿por qué no todos los paneles se construyen igual? :: Porque depende de qué datos cambia: si son textos públicos, alcanza con una llave que solo deje tocar ese repositorio; si son datos de personas, hace falta un servidor que revise cada pedido y deje registro.
```

## Parte 3. Dos caminos para guardar un cambio

Cuando tocas "Guardar" en un panel, el cambio tiene que **viajar** a algún lugar. Nuestros tres paneles usan dos caminos distintos.

### Camino A: GitHub (los archivos)

```text
Tu iPad (el panel)
   │  1. manda el archivo nuevo + tu llave
   ▼
GitHub (lo guarda como un commit)
   │  2. se arma y se publica solo
   ▼
GitHub Pages (lo ve todo el mundo)
```

1. El panel le manda a GitHub el archivo nuevo junto con tu llave.
2. GitHub lo guarda como un **commit** (una "foto" del proyecto con tu cambio; lo viste en la clase de Git).
3. GitHub Pages ve el commit nuevo y vuelve a publicar la página. En 1 o 2 minutos, todos ven el cambio.

Lo usan **¿Qué dice la Biblia?** y **este mapa**.

> 🌎 **En la vida real:** es como mandar una carta certificada a la imprenta de un periódico. Tú escribes la nota, la imprenta comprueba tu firma, la guarda en el archivo y la imprime en la edición siguiente.

> 🌎 **Otro ejemplo:** Es como subir una foto a un álbum compartido de Google Fotos: la subes desde el teléfono y, al rato, aparece en el álbum que ven todos.

### Camino B: Firebase (una base de datos y un servidor)

```text
Tu computadora (el panel en React)
   │  1. "¿soy el dueño?" + el pedido
   ▼
Firebase: la función del servidor
   │  2. revisa: ¿es el dueño?
   │     ¿el pedido tiene sentido?
   │  3. si todo está bien, guarda
   ▼
Firestore (la base de datos)
   │  4. la app lo lee
   ▼
Copiloto, en el teléfono del conductor
```

1. Entras al panel con tu correo y contraseña. Firebase te da un **token**: un pase firmado que dice "esta persona es tal correo".
2. El panel no toca la base de datos directamente: le **pide** a una función del servidor ("cambia el aviso de la app") y manda el pase.
3. La función revisa el pase: si el correo no es el del dueño, responde "no". Si es el dueño, revisa que el pedido tenga sentido y recién ahí guarda en Firestore.
4. La app de Copiloto, en los teléfonos de los conductores, lee ese dato y cambia lo que muestra.

> 🌎 **En la vida real:** es como el banco. Tú no entras a la bóveda: le pides al cajero. El cajero mira tu documento, revisa que tengas saldo y recién ahí busca la plata.

> 🌎 **Otro ejemplo:** Es como pedir un medicamento controlado en la farmacia: no lo agarras de la estantería; se lo pides al farmacéutico, que revisa la receta y decide si te lo da.

> 🌎 **Otro ejemplo más:** Es como el control de un estacionamiento: tu tarjeta no levanta la barrera sola; la máquina la lee, revisa en el sistema que sea válida y recién ahí abre.

### ¿Cuándo uso cada camino?

| Si los datos son… | Camino | Por qué |
|---|---|---|
| Textos o archivos que se publican para todos | **A: GitHub** | Gratis, sencillo, y cada cambio queda guardado en el historial |
| Datos de personas, pagos, permisos | **B: Firebase con funciones** | Un servidor revisa cada pedido y nadie toca la base de datos directo |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Qué camino conviene?
lenguaje: js
pide: Completa `camino(panel)`: si el panel toca **datos de personas** (`datosDePersonas`) o **contraseñas** (`contrasenas`) → `'servidor'` (Firebase con una función que revisa). Si solo cambia **archivos públicos** → `'GitHub'` (cada cambio es un commit).
--- código
function camino(panel) {
  // tu código aquí
}
--- pruebas
prueba('precios públicos de un taller', () => igual(camino({ datosDePersonas: false, contrasenas: false }), 'GitHub'));
prueba('cambiar contraseñas', () => igual(camino({ datosDePersonas: false, contrasenas: true }), 'servidor'));
prueba('avisos a los conductores', () => igual(camino({ datosDePersonas: true, contrasenas: false }), 'servidor'));
--- solución
function camino(panel) {
  return panel.datosDePersonas || panel.contrasenas ? 'servidor' : 'GitHub';
}
```

```practica
vf :: En el camino de GitHub, cada cambio guardado desde el panel queda como un commit en el historial
vf :: En el panel de Copiloto, la página escribe directamente en la base de datos, sin pasar por el servidor
elige :: ¿Qué hace GitHub Pages después de que el panel guarda un commit? :: Nada, hay que publicar a mano :: Vuelve a publicar la página sola y en 1 o 2 minutos se ve el cambio :: Borra la versión vieja del historial
elige :: Para un panel que cambia la contraseña de usuarios, ¿qué camino conviene? :: El de GitHub, porque es más simple :: El de un servidor que revisa cada pedido, como Firebase con funciones :: Guardarlo en el localStorage del navegador
escribe :: Explica con un ejemplo de la vida real la diferencia entre los dos caminos. :: GitHub es como mandar una carta firmada a la imprenta: comprueban la firma, la guardan y la imprimen para todos. Firebase con funciones es como el banco: no entras a la bóveda, le pides al cajero, que revisa tu documento y lo que pides antes de hacer nada.
```

## Parte 4. La llave de GitHub

Los paneles de ¿Qué dice la Biblia? y de este mapa están en páginas **públicas**: cualquiera puede abrir `panel.html`. Entonces, ¿qué impide que un desconocido cambie las clases? **La llave.**

### Qué es la llave

GitHub te deja crear un **token de acceso personal** (en inglés, *personal access token*). Es un texto largo, como `github_pat_11ABC…`, que funciona como una contraseña **limitada**: tú decides qué puede hacer y hasta cuándo.

Cuando el panel le pide algo a GitHub, manda la llave en cada pedido. GitHub mira la llave y decide:

- ¿Es una llave válida y no venció? Si no, responde **401** ("no te conozco").
- ¿Tiene permiso para ese repositorio y esa acción? Si no, responde **403** o **404** ("no puedes").
- Si todo está bien, hace el cambio.

> 🌎 **En la vida real:** es como la tarjeta de un hotel. No abre todo el hotel: abre **tu** cuarto, y solo hasta el día de salida. Si la pierdes, en la recepción la anulan y te dan otra.

> 🌎 **Otro ejemplo:** Es como darle al jardinero la llave del portón del patio, pero no la de la casa: entra a hacer su trabajo y nada más.

> 🌎 **Otro ejemplo más:** Es como el control del portón eléctrico de un edificio: abre ese portón y ningún otro, y el administrador lo puede desactivar cuando quiera.

### Cómo se saca, paso a paso

1. En GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**. *Fine-grained* quiere decir "de grano fino": con permisos muy precisos.
2. **Repository access:** "Only select repositories" y eliges **un solo** repositorio (por ejemplo, `estudios`).
3. **Permissions → Contents:** "Read and write" (leer y escribir archivos). **Nada más.**
4. **Expiration:** una fecha de vencimiento, por ejemplo 90 días.
5. La copias y la pegas en el panel.

Con eso, aunque alguien te robara la llave, solo podría tocar **los archivos de ese repositorio**, y por poco tiempo. No podría tocar tus otros proyectos, ni Firebase, ni los certificados.

> 🌎 **En la vida real:** es como dejarle a una vecina la llave de tu casa cuando viajas, pero solo la de la puerta de atrás, y pedirle que te la devuelva cuando vuelvas.

> 🌎 **Otro ejemplo:** Es como una tarjeta de regalo con saldo fijo: si la pierdes, pierdes ese saldo, no tu cuenta del banco entera.

### Dónde se guarda la llave

El panel la guarda en **`localStorage`**: el cajoncito del navegador que viste en la clase del certificado. Ese cajón es **de este aparato y de este navegador**. La llave no viaja al código, no se sube a GitHub y no la ve nadie más.

```js
// web/panel-github.js
const CLAVE = 'estudios-panel-llave';

export function llave() {
  try { return localStorage.getItem(CLAVE) || ''; } catch (e) { return ''; }
}
export function guardarLlave(valor) {
  try { localStorage.setItem(CLAVE, valor.trim()); } catch (e) {}
}
```

- `localStorage.getItem(CLAVE)` busca en el cajón lo que se guardó con ese nombre.
- `|| ''` quiere decir: "si no hay nada, usa un texto vacío".
- El `try { … } catch (e) {}` es por si el navegador no deja usar el cajón (por ejemplo, en modo privado): en vez de romperse, sigue sin llave.

El botón **⏏ Salir** borra la llave del aparato. Si usas un aparato prestado, sal siempre al terminar.

> ⚠️ **Nunca** escribas la llave dentro del código (`const llave = 'github_pat_…'`). El código de estas páginas es público: cualquiera lo leería. Por eso se pega en la pantalla y se guarda solo en tu aparato.

> 🌎 **En la vida real:** es como guardar la llave de tu casa en tu bolsillo y no pegada con cinta en la puerta.

> 🌎 **Otro ejemplo:** Es como la clave del WiFi: la escribes en tu teléfono una vez y queda guardada ahí; no la pintas en la pared de la calle.

### ¿Y si alguien encuentra `panel.html`?

No pasa nada. Ve la pantalla que pide la llave, y sin llave, cualquier cosa que intente, GitHub la rechaza. **Esconder la dirección no es seguridad; la llave sí.**

> 🌎 **En la vida real:** todo el mundo sabe dónde está la puerta del banco. Lo que protege la plata no es esconder la puerta, sino la bóveda y el guardia.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: La llave con el menor permiso
lenguaje: js
pide: Completa `revisarLlave(llave, hoy)`: devuelve los problemas de una llave de GitHub: `'puede tocar todos los repositorios'` si `repos` es `'todos'`; `'tiene más permisos de los necesarios'` si `permisos` tiene algo más que `'contents:write'`; `'no vence nunca'` si no tiene `vence`; `'ya venció'` si `vence < hoy`.
--- código
function revisarLlave(llave, hoy) {
  // tu código aquí
}
--- pruebas
const buena = { repos: ['estudios'], permisos: ['contents:write'], vence: '2027-02-01' };
prueba('una buena llave', () => igual(revisarLlave(buena, '2026-11-18'), []));
prueba('todos los repos', () => igual(revisarLlave({ ...buena, repos: 'todos' }, '2026-11-18'), ['puede tocar todos los repositorios']));
prueba('demasiados permisos', () => igual(revisarLlave({ ...buena, permisos: ['contents:write', 'admin'] }, '2026-11-18'), ['tiene más permisos de los necesarios']));
prueba('sin vencimiento', () => igual(revisarLlave({ ...buena, vence: undefined }, '2026-11-18'), ['no vence nunca']));
prueba('vencida (un 401)', () => igual(revisarLlave({ ...buena, vence: '2026-10-01' }, '2026-11-18'), ['ya venció']));
--- solución
function revisarLlave(llave, hoy) {
  const problemas = [];
  if (llave.repos === 'todos') problemas.push('puede tocar todos los repositorios');
  if (llave.permisos.some((p) => p !== 'contents:write')) problemas.push('tiene más permisos de los necesarios');
  if (!llave.vence) problemas.push('no vence nunca');
  else if (llave.vence < hoy) problemas.push('ya venció');
  return problemas;
}
```

```practica
vf :: Una llave "fine-grained" de GitHub se puede limitar a un solo repositorio y a un solo tipo de permiso
vf :: Como la página del panel es pública, la llave se puede escribir dentro de panel.js
vf :: Si alguien encuentra la dirección panel.html, puede cambiar las clases
elige :: ¿Qué responde GitHub si la llave está mal copiada o ya venció? :: 200 :: 401 :: 409
elige :: ¿Por qué se le pone fecha de vencimiento a la llave? :: Porque GitHub cobra por las llaves sin fecha :: Para que, si alguien la roba, le sirva poco tiempo :: Para que el panel cargue más rápido
escribe :: Explica con un ejemplo de la vida real por qué la llave tiene que tener el menor permiso posible. :: Como dejarle al jardinero solo la llave del portón del patio y no la de la casa: si la pierde, el daño es pequeño. Con la llave del panel pasa igual: si solo puede tocar un repositorio, un ladrón no podría tocar nada más.
```

## Parte 5. Cómo el panel habla con GitHub

GitHub tiene una **API**: una "ventanilla" para programas. En vez de entrar a github.com y tocar botones, un programa le manda pedidos por internet y GitHub le contesta con datos. Nuestro panel usa dos pedidos: **leer** un archivo y **guardar** un archivo.

> 🌎 **En la vida real:** una API es como el autoservicio de una hamburguesería: no entras a la cocina, hablas por el parlante con frases conocidas ("un combo 2") y te entregan lo que pediste por la ventanilla.

> 🌎 **Otro ejemplo:** Es como el cajero automático: no hablas con nadie, eliges entre opciones fijas (saldo, retiro, depósito) y la máquina habla con el banco por ti.

### Leer un archivo

```js
// web/panel-github.js
export async function leer(ruta) {
  const d = await pedir(`/contents/${enRuta(ruta)}?ref=${RAMA}`);
  return { sha: d.sha, texto: desdeBase64(d.content) };
}
```

Paso a paso:

1. `pedir(...)` manda el pedido a `https://api.github.com/repos/DelvinSmart/estudios/contents/45-js-variables-y-tipos/LECCION.md?ref=main`, con la llave.
2. GitHub contesta con un paquete de datos. Dos nos importan:
   - `content`: el texto del archivo, pero en **base64** (abajo se explica qué es).
   - `sha`: la **huella** de esa versión del archivo.
3. `desdeBase64` vuelve a convertir el contenido en texto normal.

### La palabra `await`

`await` quiere decir "espera la respuesta antes de seguir". Pedirle algo a GitHub por internet tarda (medio segundo, un segundo…). Sin `await`, el programa seguiría de largo sin tener el archivo. Lo viste en la clase de asincronía.

> 🌎 **En la vida real:** es como pedir un café y esperar a que te lo den antes de echarle azúcar. Si le echas azúcar a la taza vacía, no sirve.

### Base64: por qué el texto viaja "disfrazado"

Los pedidos a GitHub van en un formato que no se lleva bien con cualquier símbolo. Por eso los archivos viajan en **base64**: una forma de escribir cualquier contenido usando solo letras, números, `+` y `/`.

`Hola` en base64 es `SG9sYQ==`.

El problema son los **acentos y la ñ**: la función del navegador (`btoa`) solo entiende letras inglesas. Por eso el panel primero convierte el texto en **bytes** (números del 0 al 255) con `TextEncoder`, y recién ahí lo pasa a base64. Sin eso, "Programación" llegaría roto.

```js
function aBase64(texto) {
  let binario = '';
  new TextEncoder().encode(texto).forEach((b) => { binario += String.fromCharCode(b); });
  return btoa(binario);
}
```

> 🌎 **En la vida real:** es como mandar un mueble por correo: lo desarmas en piezas que entran en una caja (base64) y, al llegar, lo vuelves a armar. Si desarmas mal una pieza con forma rara (la ñ), llega rota.

> 🌎 **Otro ejemplo:** Es como el código Morse: cualquier mensaje se puede mandar con solo puntos y rayas, siempre que los dos lados sepan traducirlo.

### Guardar un archivo, sin pisar el trabajo de nadie

```js
export async function guardar(ruta, texto, sha, mensaje) {
  const r = await pedir(`/contents/${enRuta(ruta)}`, {
    method: 'PUT',
    body: JSON.stringify({ message: mensaje, content: aBase64(texto), sha, branch: RAMA }),
  });
  return r.content.sha;
}
```

- `method: 'PUT'` quiere decir "pon este archivo en este lugar" (reemplázalo).
- `message` es el mensaje del commit, por ejemplo: `Panel: Variables, tipos y la consola (clase 45) · parte 1`.
- `content` es el texto nuevo en base64.
- `sha` es **la huella de la versión que abriste**. Esto es lo más importante.

**¿Para qué la huella?** Imagina que abres una clase en el iPad y, mientras la editas, alguien (tú mismo desde la computadora, o un agente) cambia esa misma clase y la sube. Si el iPad guardara sin mirar, **borraría** ese otro cambio sin avisar. Con la huella, GitHub compara: "¿la versión que abriste sigue siendo la última?". Si no, responde **409** ("conflicto") y no guarda nada. El panel te avisa: "La clase cambió en GitHub mientras la editabas".

> 🌎 **En la vida real:** es como editar un documento impreso que circula en la oficina. Antes de dejar tu versión corregida en la carpeta, miras si la que está ahí sigue siendo la misma que tomaste. Si alguien ya dejó otra, no la tiras: primero comparas.

> 🌎 **Otro ejemplo:** Es como dos personas que llenan la misma planilla de turnos. Si la segunda borra todo y escribe la suya sin mirar, el turno de la primera desaparece.

> 🌎 **Otro ejemplo más:** Es como el número de versión de una receta en un restaurante: "estoy corrigiendo la versión 7". Si en la cocina ya están usando la 8, tu corrección de la 7 se revisa antes de usarla.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Guardar sin pisar cambios ajenos
lenguaje: js
pide: El panel manda el texto en **base64** (pasando por `TextEncoder` para que las tildes no se rompan) y el `sha` de la versión que abrió. Completa `aBase64(texto)` y `guardar(repo, ruta, texto, shaQueAbri)`: si el `sha` actual del archivo no es el que abriste, responde `{ status: 409 }` (alguien cambió el archivo); si coincide, guarda y responde `{ status: 200, sha: nuevo }` (el nuevo sha es `'sha' + (número de versión)`).
--- código
function aBase64(texto) {
  // tu código aquí
}

function guardar(repo, ruta, texto, shaQueAbri) {
  // repo[ruta] = { contenido (base64), sha, version }
  // tu código aquí
}
--- pruebas
prueba('base64 con tildes', () => igual(aBase64('canción'), 'Y2FuY2nDs24='));
prueba('guardar bien', () => { const repo = { 'a.md': { contenido: '', sha: 'sha1', version: 1 } }; igual(guardar(repo, 'a.md', 'hola', 'sha1'), { status: 200, sha: 'sha2' }); igual(repo['a.md'].contenido, aBase64('hola')); });
prueba('alguien guardó antes: 409', () => { const repo = { 'a.md': { contenido: '', sha: 'sha2', version: 2 } }; igual(guardar(repo, 'a.md', 'mío', 'sha1'), { status: 409 }); igual(repo['a.md'].contenido, ''); });
--- solución
function aBase64(texto) {
  const bytes = new TextEncoder().encode(texto);
  let binario = '';
  for (const b of bytes) binario += String.fromCharCode(b);
  return btoa(binario);
}

function guardar(repo, ruta, texto, shaQueAbri) {
  const archivo = repo[ruta];
  if (archivo.sha !== shaQueAbri) return { status: 409 };
  archivo.version++;
  archivo.sha = 'sha' + archivo.version;
  archivo.contenido = aBase64(texto);
  return { status: 200, sha: archivo.sha };
}
```

```practica
vf :: Una API es una forma de que un programa le pida cosas a otro por internet, con pedidos conocidos
vf :: El panel convierte el texto a bytes con TextEncoder antes de pasarlo a base64 para que los acentos y la ñ no lleguen rotos
elige :: ¿Para qué manda el panel el sha de la versión que abrió? :: Para que el archivo pese menos :: Para que GitHub no deje guardar si alguien cambió el archivo mientras tanto :: Para cifrar el texto
elige :: ¿Qué hace await en await pedir(...)? :: Hace el pedido más rápido :: Espera la respuesta de GitHub antes de seguir :: Guarda la llave
escribe :: Explica con tus palabras qué pasa si guardas desde el iPad una clase que otra persona cambió mientras la editabas. :: GitHub compara la huella (sha) de la versión que abrí con la última. Como no coinciden, responde 409 y no guarda nada, así no se borra el cambio de la otra persona. El panel me avisa para que recargue y vuelva a aplicar mi cambio.
```

## Parte 6. El panel de ¿Qué dice la Biblia?, paso a paso

Este fue el **primer** panel, y los demás copiaron su forma.

### Cómo están guardados los estudios

Cada estudio es **un archivo `.json`** en la carpeta `estudios/`. JSON es una forma ordenada de escribir datos: nombres y valores entre llaves. Por ejemplo:

```json
{
  "titulo": "¿Lenguas extrañas?",
  "temas": [
    { "titulo": "Lo que dice el texto", "color": "azul", "puntos": [ … ] }
  ]
}
```

La página pública lee esos archivos y los dibuja como un mapa. El panel lee **los mismos archivos**, te deja cambiarlos con formularios y los vuelve a guardar.

> 🌎 **En la vida real:** el `.json` es como la ficha de una receta: nombre, ingredientes y pasos, siempre en los mismos casilleros. La página es el cocinero que la lee para hacer el plato; el panel es el formulario donde llenas la ficha.

### Lo que pasa cuando usas el panel

1. **Pegas la llave.** Se guarda en el aparato (`js/github.js`).
2. **Ves la lista de estudios.** El panel le pide a GitHub la lista de archivos de `estudios/` (`Github.listar()`).
3. **Abres uno.** El panel lo lee (`Github.leer(slug)`), con su huella.
4. **Editas.** Mientras escribes, el panel guarda un **borrador** en `localStorage` cada vez que cambias algo. Si se cierra la pestaña o se acaba la batería, al volver te ofrece recuperar lo que escribiste.
5. **Ves cómo queda.** La vista previa es la **página real del estudio** (`estudio.html?vista=1`) metida dentro del panel. El panel le manda cada cambio con `postMessage`, un "mensajero" entre dos páginas abiertas.
6. **El medidor revisa.** La LBLA se puede citar solo hasta cierto límite (500 versículos por obra y no más del 25 % del texto). Si te pasas, el botón Publicar **no publica** y te dice cuánto texto propio falta.
7. **Tocas Publicar.** Primero se suben las imágenes nuevas a `imagenes/`; después, el estudio (`Github.guardar`). Si es nuevo, el nombre del archivo sale del título: "¿Lenguas extrañas?" → `lenguas-extranas`.
8. **GitHub publica solo.** Cada commit en `main` despierta una **GitHub Action** (`publicar.yml`): una computadora de GitHub que arma el sitio, genera los PDF y lo publica en Pages.

> 🌎 **En la vida real:** el borrador automático es como el autoguardado de Word: si se va la luz, no pierdes lo que escribiste.

> 🌎 **Otro ejemplo:** El medidor es como la balanza del aeropuerto: si la maleta pesa de más, no te dejan despachar hasta que saques algo. Aquí, en vez de sacar versículos, se agrega texto propio.

> 🌎 **Otro ejemplo más:** La GitHub Action es como una imprenta automática: cada vez que llega un original nuevo, imprime los ejemplares y los reparte sin que nadie apriete un botón.

### Lo que este panel protege

| Riesgo | Cómo se protege |
|---|---|
| Un desconocido entra a `panel.html` | Sin llave, GitHub rechaza todo |
| Pasarse del límite de citas de la LBLA | El medidor no deja publicar |
| Perder lo escrito | Borrador automático en el aparato |
| Pisar un cambio hecho en otro lado | La huella (sha) del archivo |

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El borrador que no se pierde
lenguaje: js
pide: El panel de estudios guarda un **borrador** en `localStorage` mientras escribes, para no perder nada si se cierra la pestaña. Completa `crearEditor(almacen, id)`: `escribir(texto)` guarda el borrador en la clave `'borrador:' + id`; `abrir(publicado)` devuelve el borrador si existe, o el publicado si no; `publicar()` borra el borrador (con `removeItem`).
--- código
function crearAlmacen() {
  const d = {};
  return { getItem: (k) => d[k] ?? null, setItem: (k, v) => { d[k] = String(v); }, removeItem: (k) => { delete d[k]; } };
}

function crearEditor(almacen, id) {
  return {
    escribir(texto) {
      // tu código aquí
    },
    abrir(publicado) {
      // tu código aquí
    },
    publicar() {
      // tu código aquí
    },
  };
}
--- pruebas
prueba('sin borrador, abre lo publicado', () => igual(crearEditor(crearAlmacen(), 'bautismo').abrir('versión publicada'), 'versión publicada'));
prueba('con borrador, abre el borrador', () => { const a = crearAlmacen(); crearEditor(a, 'bautismo').escribir('a medio escribir'); igual(crearEditor(a, 'bautismo').abrir('publicada'), 'a medio escribir'); });
prueba('al publicar, se borra', () => { const a = crearAlmacen(); const e = crearEditor(a, 'x'); e.escribir('algo'); e.publicar(); igual(e.abrir('publicada'), 'publicada'); });
prueba('cada estudio, su borrador', () => { const a = crearAlmacen(); crearEditor(a, 'uno').escribir('1'); igual(crearEditor(a, 'dos').abrir('p'), 'p'); });
--- solución
function crearAlmacen() {
  const d = {};
  return { getItem: (k) => d[k] ?? null, setItem: (k, v) => { d[k] = String(v); }, removeItem: (k) => { delete d[k]; } };
}

function crearEditor(almacen, id) {
  const clave = 'borrador:' + id;
  return {
    escribir(texto) {
      almacen.setItem(clave, texto);
    },
    abrir(publicado) {
      return almacen.getItem(clave) ?? publicado;
    },
    publicar() {
      almacen.removeItem(clave);
    },
  };
}
```

```practica
vf :: En ¿Qué dice la Biblia?, cada estudio es un archivo .json en la carpeta estudios/
vf :: Si te pasas del límite de citas de la LBLA, el panel quita versículos automáticamente
elige :: ¿Qué hace la GitHub Action publicar.yml? :: Guarda la llave del panel :: Arma el sitio, genera los PDF y lo publica en Pages en cada commit :: Revisa la ortografía
elige :: ¿Para qué sirve el borrador en localStorage? :: Para publicar más rápido :: Para no perder lo escrito si se cierra la pestaña :: Para compartir el estudio con otros
escribe :: Cuenta en orden qué pasa desde que tocas Publicar hasta que el estudio aparece en la página. :: El panel sube las imágenes nuevas y después el .json del estudio a GitHub con la llave, como un commit. Ese commit despierta la GitHub Action, que arma el sitio, genera los PDF y lo publica en GitHub Pages. En 1 o 2 minutos se ve.
```

## Parte 7. El panel de este mapa, paso a paso

Este panel copia la forma del anterior (llave de GitHub, leer, guardar con huella), pero tiene un problema que el otro no tenía: **los certificados**.

### El problema: las clases están conectadas con el certificado

Recuerda la clase del certificado: las reglas de Firebase **cuentan cuántas partes** tiene cada curso. Para emitir el certificado, la persona tiene que haber prendido **todos** los bombillos, y "todos" es un número escrito dentro de las reglas.

Si desde el panel alguien agregara una parte nueva (un título `## `), la página mostraría un bombillo más, pero las reglas seguirían esperando el número viejo. Resultado: **nadie podría terminar el curso** hasta regenerar y subir las reglas desde la computadora.

Y hay otro peligro: las **prácticas**. Sus respuestas viven en un archivo privado que solo está en la computadora (`firebase/funciones/respuestas.json`). Si alguien cambiara una práctica desde el panel, el servidor tendría respuestas viejas para una pregunta nueva, y la práctica quedaría imposible de aprobar.

> 🌎 **En la vida real:** es como el álbum de figuritas del Mundial: la editorial imprimió que el álbum tiene 670 figuritas. Si tú pegas una página extra, el álbum nunca se va a "completar" para la editorial, porque su cuenta sigue en 670.

> 🌎 **Otro ejemplo:** Es como cambiar una pregunta del examen después de que el profesor ya hizo la hoja de respuestas: la respuesta correcta ya no corresponde a la pregunta.

### La solución: el panel revisa antes de guardar

Desde el panel **sí** se puede cambiar el texto de cualquier parte y su título. **No** se puede agregar ni quitar partes, ni tocar una práctica. Lo revisa `web/panel-reglas.js`:

```js
export function revisar(original, editado) {
  const a = partir(original);
  const b = partir(editado);
  if (a.partes.length !== b.partes.length) {
    return ['La clase tenía ' + a.partes.length + ' partes y ahora tiene ' + b.partes.length + '…'];
  }
  // …y después compara las prácticas de cada parte: tienen que quedar idénticas
}
```

Paso a paso:

1. `partir` es **la misma función** que usa la página para dividir una clase en partes. Usar la misma es clave: si el panel contara de otra forma, podría equivocarse justo en los casos raros (por ejemplo, un `## ` dentro de un bloque de código, que **no** cuenta como parte).
2. Si el número de partes cambió, el panel **no guarda** y te explica qué pasó.
3. Si una práctica cambió (aunque sea una letra), tampoco guarda.
4. Si todo está bien, recién ahí manda el archivo a GitHub.

> 🌎 **En la vida real:** es como el control de equipaje antes de subir al avión: no te deja pasar con algo que pueda poner en riesgo el vuelo, aunque tú no lo hayas hecho a propósito.

> 🌎 **Otro ejemplo:** Es como el corrector de un formulario de banco que no te deja enviar si el número de cuenta tiene una cifra de menos: te frena **antes** de que el error llegue al banco.

### Editar parte por parte

Una clase puede tener 50.000 letras. Editar todo en un solo cuadro desde el iPad sería incómodo. Por eso el panel divide el archivo en pedazos: la **introducción** y cada **parte**, con su título en un campo aparte.

Para eso hay dos funciones: `separar` (corta el archivo en pedazos) y `unir` (lo vuelve a armar). La regla de oro: **si no cambias nada, `unir(separar(clase))` tiene que dar exactamente la misma clase, letra por letra.** Si quedara un espacio de más, GitHub vería un cambio que nadie hizo, y el audio de esa parte se rehacería por nada.

Eso se prueba con **todas** las clases del mapa, en `herramientas/panel-reglas.test.mjs`:

```js
test('separar y unir devuelven cada clase exactamente igual', () => {
  for (const ruta of todos) {
    const md = leer(ruta);
    assert.equal(unir(separar(md)), md, ruta);
  }
});
```

> 🌎 **En la vida real:** es como desarmar un rompecabezas para guardarlo y volver a armarlo: si al final sobra o falta una pieza, algo hiciste mal.

### Lo que pasa cuando tocas "Guardar y publicar"

1. El panel une los pedazos y arma la clase completa.
2. `revisar` compara la clase de GitHub con la tuya. Si hay un problema, se frena y te lo explica.
3. Si está bien, `guardar` hace el commit con la huella (sha) de la versión que abriste.
4. **GitHub Pages** publica la página nueva en 1 o 2 minutos.
5. La **GitHub Action de los audios** ve que cambió un `.md` y rehace **solo** los audios de las partes que cambiaste.
6. Las reglas de Firebase **no se tocan**: el número de partes es el mismo y las prácticas son las mismas.

> 🌎 **En la vida real:** es como corregir un error de ortografía en un libro ya publicado: en la reimpresión cambias esa palabra, pero el índice, el número de páginas y el código del libro siguen iguales.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo que el panel de este mapa no deja hacer
lenguaje: js
pide: El panel de este mapa deja corregir textos, pero **no** agregar ni quitar partes (rompería los certificados) ni tocar las prácticas (las respuestas viven en el servidor). Completa `revisarCambio(antes, despues)`: compara dos textos de una clase y devuelve los problemas: `'cambió la cantidad de partes'` (cuenta las líneas que empiezan con `## `) y `'cambió una práctica'` (si el texto de los bloques que empiezan con tres comillas invertidas y `practica` no es igual).
--- código
const F = '`'.repeat(3);

function revisarCambio(antes, despues) {
  // tu código aquí
}
--- pruebas
const antes = ['## 1. Uno', 'texto', F + 'practica', 'vf :: Git guarda fotos', F].join('\n');
prueba('corregir un texto: bien', () => igual(revisarCambio(antes, antes.replace('texto', 'texto corregido')), []));
prueba('agregar una parte: no', () => igual(revisarCambio(antes, antes + '\n## 2. Dos'), ['cambió la cantidad de partes']));
prueba('cambiar una práctica: no', () => igual(revisarCambio(antes, antes.replace('fotos', 'videos')), ['cambió una práctica']));
--- solución
const F = '`'.repeat(3);

function revisarCambio(antes, despues) {
  const partes = (t) => t.split('\n').filter((l) => l.startsWith('## ')).length;
  const practicas = (t) => t.split(F + 'practica').slice(1).map((b) => b.split(F)[0]).join('|');
  const problemas = [];
  if (partes(antes) !== partes(despues)) problemas.push('cambió la cantidad de partes');
  if (practicas(antes) !== practicas(despues)) problemas.push('cambió una práctica');
  return problemas;
}
```

```practica
vf :: Desde el panel de este mapa se puede cambiar el texto y el título de una parte
vf :: Desde el panel de este mapa se puede agregar una parte nueva escribiendo "## " al comienzo de una línea
elige :: ¿Por qué agregar una parte rompería los certificados? :: Porque el archivo pesaría más :: Porque las reglas de Firebase esperan un número fijo de partes por curso :: Porque GitHub no acepta archivos con muchas partes
elige :: ¿Por qué el panel usa la misma función partir que la página? :: Porque es más corta :: Para contar las partes exactamente igual, también en los casos raros :: Porque la otra no funciona en el iPad
elige :: Después de guardar una parte desde el panel, ¿qué audios se rehacen? :: Todos los del mapa :: Solo los de las partes que cambiaron :: Ninguno, hay que hacerlos a mano
escribe :: Explícale a alguien por qué el panel no deja cambiar una práctica. :: Porque las respuestas de las prácticas están en un archivo privado que solo existe en la computadora. Si la pregunta cambiara desde el panel, el servidor seguiría con la respuesta vieja y la práctica quedaría imposible de aprobar. Las prácticas se cambian en la computadora, separando las respuestas y subiendo la función.
```

## Parte 8. El panel de Copiloto, paso a paso

Este es el más grande y el más delicado: desde aquí se ven los usuarios de la app, sus carros, sus suscripciones, los costos de la IA, y se cambian cosas que aparecen en los teléfonos de los conductores.

### Una página aparte

El panel de Copiloto **no** es una página dentro de la app. Es un sitio aparte (la carpeta `web/` del proyecto), hecho con **React** y **Vite**, y publicado en **Firebase Hosting** en una dirección distinta a la de la página de presentación. Tiene sus propias pantallas: Usuarios, Vehículos, Costos, Suscripciones, Diseño, Términos y Configuración.

> 🌎 **En la vida real:** es como la oficina de la administración de un edificio: está en el mismo edificio, pero tiene su propia puerta, su propia llave y no se entra por el ascensor de los vecinos.

### Primera barrera: la pantalla de entrar

Entras con **correo y contraseña** (Firebase Authentication, lo viste en la clase del certificado). Si la cuenta que entra **no** es la del dueño, el panel la saca de inmediato:

```tsx
// web/src/context/AuthContext.tsx (resumido)
const credential = await signInWithEmailAndPassword(auth, email, password);
if (credential.user.email?.toLowerCase() !== OWNER_EMAIL) {
  await fbSignOut(auth);
  return { ok: false, error: 'Esta cuenta no tiene acceso al panel.' };
}
```

Pero, **atención**: esto es solo la barrera de la **pantalla**. Recuerda la regla de oro de la clase del certificado: **todo lo que pasa en el navegador lo controla el usuario**. Alguien podría cambiar ese código en su navegador y "saltarse" la pantalla. Por eso hay una segunda barrera, y esa es la de verdad.

> 🌎 **En la vida real:** la pantalla de entrar es como el cartel de "Solo personal autorizado" en una puerta: ayuda, pero no detiene a nadie que quiera pasar. Lo que detiene es la cerradura.

### Segunda barrera (la de verdad): el servidor revisa cada pedido

El panel nunca toca la base de datos. Todo lo pide a **funciones del servidor** (Cloud Functions). Por ejemplo, para ver la lista de usuarios:

```ts
// web/src/lib/adminApi.ts (el panel pide)
const listar = httpsCallable(functions, 'adminListUsers');
const respuesta = await listar({ limit: 50 });
```

Y la función, en el servidor, **lo primero que hace** es revisar quién pide:

```ts
// functions/src/admin.ts (el servidor decide)
export const adminListUsers = onCall(async (request) => {
  assertOwner(request.auth?.token.email);   // ¿es el dueño? Si no, aquí se corta
  // …recién ahora busca los usuarios
});
```

- `httpsCallable` es la forma de "llamar" a una función del servidor desde la página. Firebase manda sola, junto con el pedido, el **pase firmado** (token) de quien entró.
- `request.auth.token.email` es el correo que dice ese pase. El pase está **firmado por Google**: si alguien lo cambia, la firma no coincide y Firebase lo rechaza. No se puede falsificar desde el navegador.
- `assertOwner` compara ese correo con el del dueño. Si no es, responde "permiso denegado" y no hace nada más.

**Todas** las funciones del panel empiezan así. Aunque alguien lograra abrir las pantallas del panel, cada pedido rebotaría en el servidor.

> 🌎 **En la vida real:** es como un edificio con portero en la entrada **y** cerradura en cada departamento. Si alguien se cuela detrás de un vecino, igual no puede abrir ninguna puerta.

> 🌎 **Otro ejemplo:** Es como el cajero del banco que pide el documento **en cada operación**, aunque ya te haya visto entrar. No le basta con que "parezcas" el dueño de la cuenta.

> 🌎 **Otro ejemplo más:** Es como un concierto con pulsera: no basta con haber pasado la puerta; en cada zona (camarines, escenario) vuelven a mirar la pulsera.

### Las reglas también cierran la puerta

Además, las reglas de Firestore no dejan que nadie lea ni escriba directo los datos del panel:

```text
match /adminConfig/{docId} {
  allow read, write: if false;     // nadie, desde ningún navegador
}
```

`if false` quiere decir "nunca". Solo las funciones del servidor (que usan el **Admin SDK**, una llave maestra que vive en el servidor y nunca en la página) pueden tocar esos datos.

### Cómo un cambio del panel llega al teléfono del conductor

Ejemplo real: activar el **modo mantenimiento** o un **aviso para todos** ("Mañana no habrá servicio de 2 a 4").

1. En el panel, vas a **Configuración**, escribes el aviso y guardas.
2. El panel llama a la función `adminUpdateAppConfig` con el cambio.
3. La función revisa que seas el dueño y que solo vengan **campos permitidos** (versión mínima, aviso, modo mantenimiento, interruptores). Si viene cualquier otra cosa, la ignora. A esto se le llama **lista blanca**.
4. La función guarda en el documento `appConfig/global` de Firestore.
5. Cuando un conductor abre Copiloto, la app lee `appConfig/global` y muestra el aviso.

Ese documento se puede **leer** sin cuenta (`allow get: if true`), a propósito: el aviso tiene que aparecer apenas se abre la app, antes de entrar. Pero **escribir** solo lo puede hacer la función.

> 🌎 **En la vida real:** es como el cartel electrónico de una estación de bus: lo lee cualquiera que pase, pero solo la central lo puede cambiar.

> 🌎 **Otro ejemplo:** La lista blanca es como el formulario de cambio de dirección del correo: tiene casilleros fijos (calle, número, ciudad). Si escribes algo en el margen, no lo procesan.

### Las acciones más delicadas piden más

Hay acciones que pueden hacer mucho daño si caen en malas manos, como **definir la contraseña de un usuario**. Para esas, el servidor pide aún más:

1. Que sea el dueño, con el correo **verificado** y entrando **con contraseña**.
2. Que la contraseña se haya escrito **hace menos de 3 minutos** (si dejaste el panel abierto y te fuiste, tienes que volver a escribirla).
3. Un **tope por hora**: nadie puede cambiar contraseñas en masa.
4. La cuenta del dueño **no** se puede cambiar desde ahí.
5. Al cambiarla, la persona sale de todos sus aparatos.
6. Cada acción queda **anotada** en un registro (`adminAudit`): quién, a quién y cuándo. Nunca la contraseña.

> 🌎 **En la vida real:** es como el banco cuando haces una transferencia grande: aunque ya estés dentro de la app, te pide la clave otra vez, tiene un límite por día y te manda un comprobante.

> 🌎 **Otro ejemplo:** El registro es como el libro de visitas de un edificio: no impide entrar, pero si algo pasa, se sabe quién fue y a qué hora.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: assertOwner y la lista blanca
lenguaje: js
pide: En el panel de Copiloto, la función del servidor revisa todo. Completa `adminUpdateAppConfig(pase, cambios, config)`: si el correo del pase no es `DUENO` → `Error('No eres el dueño.')`; si algún campo de `cambios` no está en `PERMITIDOS` (la **lista blanca**) → `Error('Campo no permitido: X')`; si todo bien, aplica los cambios a `config` y devuelve `config`.
--- código
const DUENO = 'dueno@ejemplo.com';
const PERMITIDOS = ['aviso', 'versionMinima'];

function adminUpdateAppConfig(pase, cambios, config) {
  // tu código aquí
}
--- pruebas
prueba('el dueño cambia el aviso', () => igual(adminUpdateAppConfig({ correo: DUENO }, { aviso: 'Hoy hay mantenimiento' }, { aviso: '' }), { aviso: 'Hoy hay mantenimiento' }));
prueba('otra persona: error', () => { let m = ''; try { adminUpdateAppConfig({ correo: 'otra@ejemplo.com' }, { aviso: 'x' }, {}); } catch (e) { m = e.message; } igual(m, 'No eres el dueño.'); });
prueba('un campo fuera de la lista blanca', () => { let m = ''; const c = { aviso: '' }; try { adminUpdateAppConfig({ correo: DUENO }, { esAdmin: true }, c); } catch (e) { m = e.message; } igual(m, 'Campo no permitido: esAdmin'); igual(c, { aviso: '' }); });
--- solución
const DUENO = 'dueno@ejemplo.com';
const PERMITIDOS = ['aviso', 'versionMinima'];

function adminUpdateAppConfig(pase, cambios, config) {
  if (pase?.correo !== DUENO) throw new Error('No eres el dueño.');
  for (const campo of Object.keys(cambios)) {
    if (!PERMITIDOS.includes(campo)) throw new Error(`Campo no permitido: ${campo}`);
  }
  Object.assign(config, cambios);
  return config;
}
```

```practica
vf :: En el panel de Copiloto, revisar el correo en la pantalla de entrar es suficiente para proteger los datos
vf :: El pase (token) que manda Firebase está firmado y no se puede cambiar desde el navegador sin que se note
vf :: Cualquiera puede leer appConfig/global, pero solo las funciones del servidor lo pueden escribir
elige :: ¿Qué hace assertOwner? :: Dibuja la pantalla de entrar :: Compara el correo del pase con el del dueño y, si no es, corta el pedido :: Guarda la contraseña del dueño
elige :: ¿Qué es una lista blanca en adminUpdateAppConfig? :: Una lista de usuarios bloqueados :: Los únicos campos que el panel puede cambiar; todo lo demás se ignora :: El color del panel
elige :: ¿Por qué para cambiar una contraseña se pide haber escrito la clave hace menos de 3 minutos? :: Para que el panel cargue más rápido :: Para que nadie lo use con un panel que quedó abierto en un aparato ajeno :: Porque Firebase lo exige siempre
escribe :: Cuenta el viaje de un aviso escrito en el panel de Copiloto hasta el teléfono de un conductor. :: Escribo el aviso en Configuración y guardo. El panel llama a la función adminUpdateAppConfig con mi pase. La función revisa que soy el dueño y que solo vienen campos permitidos, y lo guarda en appConfig/global. Cuando el conductor abre la app, la app lee ese documento y muestra el aviso.
```

## Parte 9. Cómo se conectan: el viaje de un cambio

Ahora junta todo. Así viaja un cambio en cada panel, de punta a punta:

**¿Qué dice la Biblia?: publicar un estudio**

| Paso | Dónde | Qué pasa |
|---|---|---|
| 1 | Tu iPad | Escribes el estudio; se guarda un borrador en el aparato |
| 2 | Tu iPad | El medidor revisa las citas; si está bien, deja publicar |
| 3 | GitHub | Recibe el `.json` con tu llave y la huella; lo guarda como commit |
| 4 | GitHub Actions | Arma el sitio y los PDF |
| 5 | GitHub Pages | Publica; en 1 o 2 minutos todos lo ven |

**Mapa de estudios: corregir una parte**

| Paso | Dónde | Qué pasa |
|---|---|---|
| 1 | Tu iPad | Cambias el texto de una parte |
| 2 | Tu iPad | `revisar` comprueba partes y prácticas |
| 3 | GitHub | Recibe el `.md` con tu llave y la huella; commit |
| 4 | GitHub Pages | Publica la página nueva |
| 5 | GitHub Actions | Rehace solo el audio de esa parte |
| — | Firebase | **No se toca**: las reglas y los certificados siguen iguales |

**Copiloto: poner un aviso en la app**

| Paso | Dónde | Qué pasa |
|---|---|---|
| 1 | Tu computadora | Entras con correo y contraseña; Firebase te da un pase firmado |
| 2 | Tu computadora | Escribes el aviso y guardas |
| 3 | Firebase (función) | Revisa el pase, revisa los campos y guarda en Firestore |
| 4 | Teléfono del conductor | La app lee el aviso al abrir y lo muestra |

> 🌎 **En la vida real:** los dos primeros son como mandar un artículo a un periódico (lo escribes, la redacción comprueba que eres tú, se imprime y se reparte). El tercero es como pedirle al banco que cambie algo de tu cuenta (te identificas, el cajero revisa y el cambio aparece en la app de todos los que usan esa cuenta).

> ✋ **Pausa:** antes de seguir, intenta contar en voz alta uno de los tres viajes sin mirar las tablas.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El viaje de un cambio
lenguaje: js
pide: Completa `viaje(panel)`: devuelve la lista de pasos, en orden, desde que tocas Guardar hasta que se ve. Para `'mapa'`: `['panel', 'GitHub (commit)', 'GitHub Pages', 'la página']`. Para `'biblia'`: `['panel', 'GitHub (commit)', 'GitHub Actions arma el sitio', 'GitHub Pages', 'la página']`. Para `'copiloto'`: `['panel', 'función del servidor', 'Firestore', 'la app']`.
--- código
function viaje(panel) {
  // tu código aquí
}
--- pruebas
prueba('el mapa', () => igual(viaje('mapa'), ['panel', 'GitHub (commit)', 'GitHub Pages', 'la página']));
prueba('¿Qué dice la Biblia?', () => igual(viaje('biblia'), ['panel', 'GitHub (commit)', 'GitHub Actions arma el sitio', 'GitHub Pages', 'la página']));
prueba('Copiloto', () => igual(viaje('copiloto'), ['panel', 'función del servidor', 'Firestore', 'la app']));
--- solución
const VIAJES = {
  mapa: ['panel', 'GitHub (commit)', 'GitHub Pages', 'la página'],
  biblia: ['panel', 'GitHub (commit)', 'GitHub Actions arma el sitio', 'GitHub Pages', 'la página'],
  copiloto: ['panel', 'función del servidor', 'Firestore', 'la app'],
};

function viaje(panel) {
  return VIAJES[panel];
}
```

```practica
vf :: Corregir el texto de una parte desde el panel de este mapa no cambia nada en Firebase
elige :: En el panel de Copiloto, ¿quién decide si el cambio se guarda? :: La pantalla del panel :: La función del servidor :: El teléfono del conductor
elige :: ¿Qué tienen en común los paneles de ¿Qué dice la Biblia? y de este mapa? :: Los dos usan Firebase para guardar :: Los dos guardan archivos en GitHub con una llave y la huella del archivo :: Los dos piden correo y contraseña
escribe :: Elige uno de los tres paneles y cuenta, en orden y con tus palabras, el viaje de un cambio. :: Por ejemplo, el de este mapa: cambio el texto de una parte en el iPad; el panel revisa que no cambiaron las partes ni las prácticas; lo manda a GitHub con mi llave y la huella, y queda como commit; GitHub Pages publica la página y la acción de audios rehace solo esa parte; Firebase no se toca.
```

## Parte 10. Hacer tu propio panel, paso a paso

Ahora la receta, para que puedas hacer uno tú. Ejemplo: una página con la **lista de precios** de un taller, guardada en un archivo `precios.json` en GitHub, y un panel para cambiar los precios desde el teléfono.

### Paso 1. Contesta las tres preguntas

| Pregunta | Respuesta para el taller |
|---|---|
| ¿Dónde viven los datos? | En `precios.json`, en el repositorio del sitio |
| ¿Cómo sabe que eres tú? | Una llave de GitHub solo para ese repositorio |
| ¿Quién revisa? | El panel (que ningún precio quede vacío ni negativo) y GitHub (la llave) |

Son precios públicos, no datos de personas: el camino A (GitHub) alcanza.

### Paso 2. La página pública lee el archivo

```js
const r = await fetch('precios.json', { cache: 'no-cache' });
const precios = await r.json();   // [{ "servicio": "Cambio de aceite", "precio": 120 }, …]
```

`cache: 'no-cache'` le dice al navegador que pregunte si hay una versión nueva, así se ve el precio actualizado.

### Paso 3. La pantalla de la llave

Un campo para pegar la llave, que se guarda en `localStorage`, y un botón **Salir** que la borra. Al entrar, prueba la llave con un pedido sencillo: si GitHub responde 401, la llave no sirve.

### Paso 4. Leer con huella

```js
const { sha, texto } = await leer('precios.json');
let precios = JSON.parse(texto);
```

Guarda el `sha`: lo vas a necesitar para guardar.

### Paso 5. Los formularios

Un campo por precio. Cuando la persona escribe, cambias el dato en memoria (`precios[i].precio = Number(campo.value)`), todavía sin guardar.

### Paso 6. Revisar antes de guardar

```js
function revisarPrecios(lista) {
  const problemas = [];
  lista.forEach((p) => {
    if (!p.servicio.trim()) problemas.push('Hay un servicio sin nombre.');
    if (!(p.precio > 0)) problemas.push(`El precio de "${p.servicio}" tiene que ser mayor que cero.`);
  });
  return problemas;
}
```

Si la lista de problemas no está vacía, **no guardes**: muéstralos. Así un dedo que se resbala en el teléfono no publica un precio de 0.

### Paso 7. Guardar con mensaje y huella

```js
sha = await guardar('precios.json', JSON.stringify(precios, null, 2) + '\n', sha, 'Panel: precios actualizados');
```

`JSON.stringify(precios, null, 2)` escribe el JSON ordenado, con sangría de 2 espacios, para que se lea bien en GitHub.

### Paso 8. Publicar

Si el sitio está en GitHub Pages, se publica solo. Avísale a la persona: "Publicado. Se ve en 1 o 2 minutos".

### Paso 9. Probarlo como atacante

- Entra **sin llave** y prueba guardar: tiene que fallar.
- Pega una llave **inventada**: GitHub tiene que responder 401.
- Abre el archivo en **dos pestañas**, guarda en una y después en la otra: la segunda tiene que fallar con 409, sin borrar el primer cambio.
- Escribe un precio **negativo**: el panel no tiene que guardar.

> 🌎 **En la vida real:** construir un panel es como instalar una caja registradora en un negocio: decides dónde se guarda la plata, quién tiene la llave de la caja, qué revisa la máquina antes de abrir el cajón y, al final, pruebas que no se abra con cualquier botón.

> 🌎 **Otro ejemplo:** Es como armar un mueble con instrucciones: si te saltas el paso 6 (los tornillos de seguridad), el mueble se ve bien, pero se cae con el primer peso.

### ¿Y si los datos fueran de personas?

Entonces el camino A no alcanza. Usa el camino B: cuentas de Firebase, **funciones del servidor que revisan cada pedido** (como `assertOwner`), reglas que cierran la base de datos (`if false`) y un registro de lo que se hace. Es lo que hace Copiloto.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Tu propio panel de precios (sin internet)
lenguaje: html
pide: Haz el panel de un taller: un `form` con un `input` `#precio` (número) y un botón. Al enviar (`submit`, con `preventDefault`), **revisa** que el precio sea un número mayor que 0: si no, escribe `Precio inválido` en `#aviso` y no guarda; si sí, lo guarda en `#vitrina` como `Lavado: R$ 45` y escribe `Guardado` en `#aviso`.
--- código
<form>
  <input id="precio" type="number">
  <button>Guardar</button>
</form>
<p id="aviso"></p>
<p id="vitrina">Lavado: R$ 40</p>

<script>
  // tu código aquí
</script>
--- pruebas
const enviar = (v) => { $('#precio').value = v; $('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); };
prueba('guardar un precio', () => { enviar('45'); igual([$('#vitrina').textContent, $('#aviso').textContent], ['Lavado: R$ 45', 'Guardado']); });
prueba('un precio negativo no se guarda', () => { enviar('-3'); igual([$('#vitrina').textContent, $('#aviso').textContent], ['Lavado: R$ 45', 'Precio inválido']); });
prueba('vacío no se guarda', () => { enviar(''); igual($('#aviso').textContent, 'Precio inválido'); });
--- solución
<form>
  <input id="precio" type="number">
  <button>Guardar</button>
</form>
<p id="aviso"></p>
<p id="vitrina">Lavado: R$ 40</p>

<script>
  document.querySelector('form').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const texto = document.querySelector('#precio').value;
    const precio = Number(texto);
    const aviso = document.querySelector('#aviso');
    if (texto === '' || !(precio > 0)) {
      aviso.textContent = 'Precio inválido';
      return;
    }
    document.querySelector('#vitrina').textContent = `Lavado: R$ ${precio}`;
    aviso.textContent = 'Guardado';
  });
</script>
```

```practica
vf :: Para un panel de precios públicos de un taller, el camino de GitHub con una llave limitada es suficiente
vf :: Si la revisión encuentra un problema, igual conviene guardar y corregirlo después
elige :: ¿Para qué se guarda el sha al leer precios.json? :: Para mostrarlo en la pantalla :: Para mandarlo al guardar y no pisar un cambio hecho en otro lado :: Para cifrar los precios
elige :: ¿Cuál de estas pruebas comprueba que el panel no pisa cambios ajenos? :: Entrar sin llave :: Escribir un precio negativo :: Guardar el mismo archivo desde dos pestañas
escribe :: Escribe, en orden y con tus palabras, los pasos para hacer un panel que cambie un archivo de un sitio en GitHub. :: Contestar las tres preguntas; que la página pública lea el archivo; hacer la pantalla de la llave guardada en el aparato; leer el archivo con su huella; los formularios; revisar los datos antes de guardar; guardar con mensaje y huella; dejar que GitHub Pages publique; y probarlo como atacante: sin llave, con llave falsa, desde dos pestañas y con datos malos.
```

## Parte 11. Los errores más comunes (y cómo evitarlos)

| Error | Por qué es un problema | Lo correcto |
|---|---|---|
| "Nadie va a encontrar `panel.html`" | Las direcciones se encuentran; esconder no protege | Protege con una llave o una cuenta |
| Revisar solo en la pantalla | El navegador lo controla el usuario; se puede saltar | Que decida GitHub (la llave) o el servidor (`assertOwner`) |
| Escribir la llave en el código | El código es público: cualquiera la lee | Pegarla en la pantalla y guardarla en el aparato |
| Una llave con acceso a todo | Si la roban, se llevan todo | Un repositorio, un permiso, con fecha de vencimiento |
| Guardar sin la huella (sha) | Puedes borrar el cambio de otra persona sin saberlo | Mandar siempre el sha y avisar si hay conflicto (409) |
| Dejar que el panel cambie lo que otras piezas cuentan | Se rompe algo lejos (como los certificados) | Revisar antes de guardar, como `revisar` |
| No probarlo como atacante | Crees que está cerrado, pero no lo sabes | Probar sin llave, con llave falsa, desde dos pestañas y con datos malos |

> 🌎 **En la vida real:** son los mismos errores de la seguridad de una casa: dejar la llave debajo del felpudo (la llave en el código), confiar en que nadie conoce tu calle (esconder la dirección), o darle al plomero la llave de todo el edificio (una llave con acceso a todo).

> 🔁 **Repaso:** tres preguntas (dónde viven los datos, cómo sabe que eres tú, quién revisa) → dos caminos (GitHub con llave, o Firebase con funciones) → la llave limitada y guardada en el aparato → leer y guardar con huella → revisar antes de guardar → dejar que se publique solo → probarlo como atacante.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los errores más peligrosos
lenguaje: js
pide: Completa `revisarPanel(codigo)`: busca los errores de la tabla en el código de un panel y devuelve la lista: `'llave escrita en el código'` (si aparece `ghp_` o `github_pat_`), `'innerHTML con texto ajeno'` (si aparece `innerHTML`), y `'guarda sin revisar el sha'` (si llama a `guardar(` y no aparece la palabra `sha`).
--- código
function revisarPanel(codigo) {
  // tu código aquí
}
--- pruebas
prueba('un panel bien hecho', () => igual(revisarPanel("const llave = localStorage.getItem('llave');\nguardar(ruta, texto, sha);\nel.textContent = t;"), []));
prueba('la llave en el código', () => igual(revisarPanel("const llave = 'github_pat_ABC123';"), ['llave escrita en el código']));
prueba('innerHTML', () => igual(revisarPanel('vista.innerHTML = textoDelEstudio;'), ['innerHTML con texto ajeno']));
prueba('sin sha', () => igual(revisarPanel('guardar(ruta, texto);'), ['guarda sin revisar el sha']));
--- solución
function revisarPanel(codigo) {
  const problemas = [];
  if (/ghp_|github_pat_/.test(codigo)) problemas.push('llave escrita en el código');
  if (codigo.includes('innerHTML')) problemas.push('innerHTML con texto ajeno');
  if (codigo.includes('guardar(') && !codigo.includes('sha')) problemas.push('guarda sin revisar el sha');
  return problemas;
}
```

```practica
vf :: Esconder la dirección del panel es una buena forma de protegerlo
elige :: ¿Cuál de estos es el error más peligroso? :: Que el panel no tenga modo oscuro :: Escribir la llave de GitHub dentro del código público :: Que el panel tarde un segundo en cargar
escribe :: Elige dos errores de la tabla y explica, con un ejemplo de la vida real, por qué cada uno es peligroso. :: Escribir la llave en el código es como dejar la llave debajo del felpudo: cualquiera que mire la encuentra. Revisar solo en la pantalla es como poner un cartel de "solo personal" sin cerradura: el que quiere pasar, pasa.
```

## Resumen para la entrevista

> 🎤 **Si te preguntan "¿cómo hiciste los paneles de estos proyectos?":** "Hice tres. Para ¿Qué dice la Biblia? y para mi mapa de estudios, los datos son archivos públicos en GitHub, así que el panel usa la API de GitHub con un token fine-grained limitado a un solo repositorio y a escribir archivos, guardado solo en el aparato. Guarda cada cambio como un commit, mandando el sha para no pisar cambios ajenos, y GitHub Pages publica solo. En el mapa, antes de guardar, el panel revisa con la misma función que usa la página que no cambie el número de partes ni las prácticas, porque las reglas de Firebase del certificado cuentan las partes y las respuestas son privadas. Para Copiloto, que maneja datos de usuarios, el panel es un sitio aparte en React: entra con correo y contraseña, pero la seguridad real está en el servidor. Cada Cloud Function revisa el correo del token antes de hacer nada, las reglas de Firestore cierran esos datos, la configuración tiene una lista blanca de campos y las acciones delicadas piden la contraseña reciente, tienen un tope por hora y quedan registradas."

> 🎤 **Si te preguntan "¿y si alguien encuentra la dirección del panel?":** "No pasa nada: la página es solo la pantalla. Sin el token, GitHub rechaza todo; y en Copiloto, cada función del servidor revisa quién pide. Esconder la dirección nunca fue la protección."

> 🌎 **En la vida real:** es como explicar cómo funciona tu negocio: dónde guardas la mercadería, quién tiene cada llave, quién revisa la caja y qué pasa si alguien intenta entrar de noche.

> 🌎 **Otro ejemplo:** Es como contar el recorrido de un paquete: quién lo recibe, quién lo revisa, por dónde viaja y cómo sabe el destinatario que es para él.
