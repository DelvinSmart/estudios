# App Check: el portero de la entrada

> 🌎 **En la vida real:** imagina que tu sitio es una **tienda**. Adentro hay una **bodega** (la base de datos, con las cuentas y el progreso) y un **empleado** que hace tareas (las funciones del servidor que corrigen las prácticas y mandan correos). La bodega ya tiene **cerradura**. Esta clase es sobre el **portero** de la puerta.

> 🎙️ **El profesor dice:** {{alumno}}, esta clase salió de algo que hicimos de verdad en este mismo sitio. En la clase 108 auditamos el mapa y en la 115 viste STRIDE. Quedó una amenaza abierta: alguien que llama al servidor **desde afuera**, sin pasar por la página. La cerramos con **App Check**. Aquí ves qué es, cómo se conecta y por qué se enciende en dos tiempos.

**Palabras nuevas de esta clase:**

| Palabra | Qué quiere decir |
|---|---|
| **App Check** | Un control de Firebase que deja usar el servidor y la base **solo desde tu app o tu sitio de verdad**, no desde un programa que copió tu configuración. |
| **Configuración pública** | Los datos con que la página encuentra a Firebase (`apiKey`, `projectId`…). Van a la vista en el código de la página, y está bien. |
| **reCAPTCHA** | Un servicio de Google que distingue, sin que toques nada, a una persona real en tu sitio de un robot. **Enterprise** es su versión nueva (en la consola se llama *Fraud Defense*). |
| **Token** de App Check | El **sello** que recibe cada visita real: prueba "esto vino del sitio de verdad". Vence solo y se renueva solo. |
| **Modo mirar** (*monitor*) | App Check revisa y cuenta los sellos, pero **todavía no echa a nadie**. |
| **Aplicar** (*enforce*) | App Check ya **rechaza** lo que llega sin sello. |

## Parte 1. El problema: la dirección de la tienda está a la vista

> 🌎 **En la vida real:** la dirección de una tienda la sabe todo el mundo; si no, nadie podría ir. Lo que protege la bodega no es esconder la dirección: es la cerradura.

Abre `web/nube.js` y mira el comienzo:

```js
const CONFIG = {
  apiKey: 'AIzaSyCjQqwQEaV2B_LBEf5TMWzPGnIiDaTb_FI',
  authDomain: 'mapa-estudios-ds.firebaseapp.com',
  projectId: 'mapa-estudios-ds',
  // …
};
```

Esa `apiKey` **no es una contraseña**. Toda página que usa Firebase la lleva a la vista, porque el navegador la necesita para encontrar el proyecto. Cualquiera puede verla con "Ver código fuente".

**Entonces, ¿qué puede hacer alguien con ella?** Puede escribir **su propio programa** (en Python, en Node, con `curl`) que use esa configuración y le hable a tu servidor **sin pasar por tu página**:

| Lo que intenta | ¿Lo frenan las reglas de Firestore? | El daño |
|---|---|---|
| Leer el progreso de otro alumno | **Sí**: la regla dice "solo lo tuyo" | Ninguno |
| Llamar **mil veces** a `corregirPractica` | **No**: es una función, no la base | Te hace **gastar dinero** (cada llamada cuesta) |
| Crear cuentas en masa | **No** del todo | Basura en tu proyecto, correos que salen |

> 💡 **Idea:** en STRIDE (clase 115) esto es la **D**: tumbar el servicio **o hacerte gastar**. En inglés se le dice *denial of wallet*: no te roban datos, te vacían la billetera.

> 📌 **Nota:** las funciones ya tienen frenos: `maxInstances` (cuántas copias pueden correr a la vez) y los topes de `limites.js` (clase 108). La alerta de presupuesto de `PENDIENTES.md` avisa si igual se gasta de más. App Check es **una capa más**, no la única.

```practica
vf :: La apiKey de Firebase que va en la página es una contraseña y hay que esconderla
elige :: Alguien copia la configuración pública y llama mil veces a la función que corrige prácticas. ¿Qué letra de STRIDE es? :: S :: I :: D
vf :: Las reglas de Firestore protegen también a las Cloud Functions de que las llamen desde afuera
escribe :: Explica con tus palabras por qué no sirve esconder la apiKey. :: Porque la página la necesita para hablar con Firebase: está en el código que baja el navegador, así que cualquiera la ve. Lo que protege son las reglas (quién puede leer qué) y controles como App Check, no el secreto de la configuración.
```

## Parte 2. La cerradura y el portero

> 🌎 **En la vida real:** en un edificio de oficinas, cada oficina tiene su **llave** (solo tú abres la tuya). En la entrada hay un **portero** que mira que entres de verdad por la puerta, y no que te metas por la ventana con una escalera. Son dos controles distintos, y se suman.

| | La **cerradura** (reglas de Firestore) | El **portero** (App Check) |
|---|---|---|
| Qué pregunta | **¿Quién eres** y esto es tuyo? | **¿Por dónde entraste**: por la página de verdad? |
| Qué mira | La cuenta (el pase de Firebase Auth) | El **sello** de App Check |
| Qué frena | Leer o cambiar lo que no es tuyo | Programas de afuera, robots, gastar de más |
| Dónde está | `firebase/firestore.rules` (clase 21) | La consola de Firebase + `web/nube.js` |
| ¿Ya está puesto? | **Sí**, y es fuerte | Sí, **aplicado** (desde el 20 de noviembre de 2026) |

> ⚠️ **Cuidado:** el portero **no reemplaza** la cerradura. Una persona real, desde tu página, recibe su sello sin problema; si las reglas fueran malas, igual podría leer lo de otro. Por eso la cerradura es la protección principal y el portero es la segunda.

> 🌎 **Otro ejemplo:** en un concierto, la **pulsera** (el sello) prueba que entraste por la boletería. Pero tener pulsera no te deja subir al escenario: para eso hace falta otro permiso (la cerradura).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿Pasa o no pasa?
lenguaje: js
pide: Completa `decidir(visita, modo)`. `visita` tiene `sello` (true o false) y `esSuyo` (true o false). Primero el **portero**: si `modo` es `'aplicar'` y no hay sello, devuelve `'echado por el portero'`. Después la **cerradura**: si no es suyo, devuelve `'frenado por las reglas'`. Si pasa los dos, devuelve `'pasa'`. En modo `'mirar'` el portero nunca echa a nadie.
--- código
function decidir(visita, modo) {
  // tu código aquí
}
--- pruebas
prueba('alumno de verdad, lo suyo', () => igual(decidir({ sello: true, esSuyo: true }, 'aplicar'), 'pasa'));
prueba('programa de afuera, con aplicar', () => igual(decidir({ sello: false, esSuyo: true }, 'aplicar'), 'echado por el portero'));
prueba('programa de afuera, en modo mirar', () => igual(decidir({ sello: false, esSuyo: true }, 'mirar'), 'pasa'));
prueba('con sello pero no es suyo', () => igual(decidir({ sello: true, esSuyo: false }, 'aplicar'), 'frenado por las reglas'));
prueba('en modo mirar la cerradura sigue cerrando', () => igual(decidir({ sello: false, esSuyo: false }, 'mirar'), 'frenado por las reglas'));
--- solución
function decidir(visita, modo) {
  if (modo === 'aplicar' && !visita.sello) return 'echado por el portero';
  if (!visita.esSuyo) return 'frenado por las reglas';
  return 'pasa';
}
```

```practica
elige :: ¿Qué pregunta hace App Check? :: ¿Quién eres y esto es tuyo? :: ¿La visita entró por tu página de verdad? :: ¿Cuántos años tienes?
vf :: Con App Check encendido ya se pueden quitar las reglas de Firestore
vf :: En modo mirar, App Check todavía no rechaza a nadie, pero las reglas de Firestore sí siguen frenando
escribe :: Explica la diferencia entre la cerradura y el portero con un ejemplo que no sea de computadoras. :: En un edificio, la llave de cada oficina (la cerradura) deja entrar solo al dueño. El portero de la entrada mira que entres por la puerta y no por la ventana. Son dos controles distintos y se suman.
```

## Parte 3. Cómo da el sello: reCAPTCHA

> 🌎 **En la vida real:** el portero no te pide documentos: te mira caminar. Si te mueves como una persona que entra a la tienda, te pone la pulsera sin que te des cuenta. Un robot que golpea la puerta mil veces por segundo no se mueve así.

En la web, App Check usa **reCAPTCHA** para mirar "cómo camina" la visita. Es **invisible**: no aparece el cuadrito de "no soy un robot". El camino es este:

```text
 1. La página carga reCAPTCHA con la clave del SITIO (pública).
 2. reCAPTCHA mira la visita y da un "puntaje" de persona real.
 3. La página canjea ese puntaje en App Check  →  recibe el SELLO (token).
 4. Cada llamada a Firestore o a una función lleva el sello pegado.
 5. Firebase revisa el sello: ¿es válido, es de este proyecto, no venció?
```

En el teléfono es la misma idea con otro "portero": **Play Integrity** en Android y **App Attest** en iPhone (los viste en la clase 24).

Así quedó conectado en `web/nube.js`:

```js
const APP_CHECK_SITE_KEY = '6LcFJCkuAAAAAADv4IRGw0PI5DuE6SsQcStzIQ3W';

try {
  AC.initializeAppCheck(app, {
    provider: new AC.ReCaptchaEnterpriseProvider(APP_CHECK_SITE_KEY),
    isTokenAutoRefreshEnabled: true, // el sello vence; esto lo renueva solo
  });
} catch (e) { /* sin App Check: la app sigue funcionando */ }
```

**Cómo leerlo:**

| Pieza | Qué hace |
|---|---|
| `APP_CHECK_SITE_KEY` | La clave del **sitio**. Es **pública**, como la `apiKey`. La clave **secreta** de reCAPTCHA vive en Google, nunca en la página. |
| `ReCaptchaEnterpriseProvider` | El "portero" que usa: reCAPTCHA Enterprise. |
| `isTokenAutoRefreshEnabled` | El sello dura un rato (por defecto, una hora). Esto pide uno nuevo antes de que venza. |
| `try { … } catch` | Si App Check falla al arrancar, **la app sigue andando**: se ven las clases y el progreso del navegador. Pero como App Check ya está **aplicado**, sin sello no se corrigen prácticas ni se guarda en la nube. |

> 💡 **Idea:** para que el portero sepa cuál es **tu** tienda, la clave se registra con tus **dominios** (`delvinsmart.github.io` y `localhost`). Si alguien copia tu clave del sitio y la usa en su página, reCAPTCHA se niega a darle el puntaje, porque el dominio no es el tuyo.

> 📌 **Nota:** el reCAPTCHA "clásico" (v3) quedó descontinuado para proyectos nuevos. Por eso este sitio usa **Enterprise** (*Fraud Defense* en la consola). Pasó de verdad: se conectó primero con v3 y hubo que cambiarlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿El sello todavía sirve?
lenguaje: js
pide: Completa `selloValido(sello, ahora, proyecto)`. `sello` es `{ proyecto, vence }` (o `null` si no hay) y `ahora` y `vence` son milisegundos. Es válido solo si existe, si su `proyecto` es igual al `proyecto` que se pide, y si `ahora` es **menor** que `vence`. Devuelve `true` o `false`.
--- código
function selloValido(sello, ahora, proyecto) {
  // tu código aquí
}
--- pruebas
const HORA = 60 * 60 * 1000;
prueba('un sello nuevo de este proyecto', () => igual(selloValido({ proyecto: 'mapa-estudios-ds', vence: 2 * HORA }, HORA, 'mapa-estudios-ds'), true));
prueba('sin sello', () => igual(selloValido(null, HORA, 'mapa-estudios-ds'), false));
prueba('un sello vencido', () => igual(selloValido({ proyecto: 'mapa-estudios-ds', vence: HORA }, 2 * HORA, 'mapa-estudios-ds'), false));
prueba('justo cuando vence ya no sirve', () => igual(selloValido({ proyecto: 'mapa-estudios-ds', vence: HORA }, HORA, 'mapa-estudios-ds'), false));
prueba('un sello de OTRO proyecto', () => igual(selloValido({ proyecto: 'otro-proyecto', vence: 2 * HORA }, HORA, 'mapa-estudios-ds'), false));
--- solución
function selloValido(sello, ahora, proyecto) {
  if (!sello) return false;
  if (sello.proyecto !== proyecto) return false;
  return ahora < sello.vence;
}
```

```practica
vf :: La clave del sitio de reCAPTCHA (la que va en nube.js) es secreta y no debería estar en la página
elige :: ¿Para qué se registran los dominios en la clave de reCAPTCHA? :: Para que el sitio cargue más rápido :: Para que la clave solo funcione en tu sitio, y no en la página de otro que la copió :: Para mandar correos
elige :: ¿Qué usa App Check para dar el sello en una app de Android? :: reCAPTCHA :: Play Integrity :: Face ID
vf :: Si App Check falla al arrancar, este sitio sigue funcionando
```

## Parte 4. Primero mirar, después aplicar

> 🌎 **En la vida real:** un portero nuevo, el primer día, no echa a nadie. Primero **mira** quién entra y aprende a reconocer a los clientes. Si echara gente desde el primer minuto, podría dejar afuera a un cliente de verdad por un error de la lista.

App Check se enciende en **dos tiempos**:

| Tiempo | Qué pasa | En este sitio |
|---|---|---|
| **1. Mirar** (*monitor*) | La página manda el sello. La consola de Firebase **cuenta** cuántas llamadas vienen "verificadas" y cuántas no. Nadie es rechazado. | Donde estuvo al principio |
| **2. Aplicar** (*enforce*) | Lo que llega sin sello válido **se rechaza**. | **Donde está ahora**, desde el 20 de noviembre de 2026 |

Para aplicar, se cambian **dos** cosas:

```js
// firebase/funciones/index.js — las funciones exigen el sello
export const corregirPractica = onCall(
  { region: 'us-central1', maxInstances: 10, enforceAppCheck: true },
  async (request) => { /* … */ },
);
```

Y en la consola de Firebase, en App Check → Cloud Firestore, el botón **Aplicar** (*Enforce*).

> ⚠️ **Cuidado:** si aplicas el primer día y algo quedó mal configurado, **los alumnos de verdad** se quedan sin poder guardar su progreso. Por eso primero se mira y se revisan los números.

> 🎙️ **El profesor dice:** la regla de "una semana mirando" sirve cuando **entra gente**: los números de la consola te dicen si algo falla. Pero este sitio todavía tiene muy pocas visitas, y una semana esperando no iba a dar números. Así que hicimos lo contrario: **fuimos nosotros los alumnos**. Abrimos el sitio en el iPhone, el iPad y el navegador del Mac, respondimos una práctica en cada uno y miramos en el registro de la función que cada llamada llegara con `app: VALID` (el sello) y, con la cuenta abierta, `auth: VALID`. Recién ahí aplicamos, y lo comprobamos desde afuera:
>
> - Llamar a la función con `curl`, sin sello → **401** "Unauthenticated".
> - Leer Firestore desde afuera, sin sello → **403** "permiso denegado".
> - Desde el sitio de verdad → todo sigue funcionando.
>
> La idea de fondo no es "esperar siete días": es **tener pruebas de que los alumnos reales reciben su sello** antes de echar a los que no lo traen. Si no hay tráfico que mire por ti, las pruebas las haces tú, con los aparatos que usan tus alumnos. Y si algo sale mal, "Aplicar" se deshace en un minuto.

> 🎙️ **El profesor dice:** te cuento lo que pasó de verdad. Al conectarlo, la consola mostró un **error 403**. La tentación era tocar botones hasta que se fuera, por ejemplo apagar la "verificación de dominio". Eso **baja la seguridad** y no arregla nada. Lo que hicimos fue **separar las piezas** y probar cada una sola:
>
> 1. ¿La clave del sitio da un puntaje de reCAPTCHA en `delvinsmart.github.io`? → **Sí**: llegaba un token de reCAPTCHA de 2233 letras.
> 2. ¿App Check acepta ese token? → **No**: respondía "App attestation failed".
>
> Con eso quedó claro que reCAPTCHA y el dominio estaban bien, y que lo que faltaba estaba del lado de App Check (una configuración recién hecha tarda en activarse, o la clave registrada en App Check no es la misma que usa la página). Es el método de la clase 120: **reproducir y aislar**, no adivinar.
>
> **Y aquí viene la segunda lección.** Primero pensamos: "es que la configuración es nueva, ya se activará sola". Esperamos **un día entero**. Al otro día repetimos la misma prueba: **el mismo 403**. Una configuración no tarda un día en activarse, así que esa idea estaba mal. Fuimos a mirar las dos claves, una al lado de la otra.

| Dónde | La clave |
|---|---|
| La página (`web/nube.js`) | `6LcFJCkuAAAAA` **`ADv4IRGw0PI5DuE6SsQcStzIQ3W`** |
| Registrada en App Check | `6LcFJCkuAAAAA` **`Ba70h97wvUEKP78zhxgukwPAEjn`** |

**Empiezan igual** y por eso, a simple vista, parecían la misma. En Google Cloud → Fraud Defense → Claves había **una sola** clave: la de la página. La que tenía App Check **no existía**. Era como un portero que espera la pulsera de un color que nadie fabrica: rechaza a todo el mundo. Se cambió la clave en la consola (sin tocar el código) y, a los 40 segundos, App Check respondió **200** y dio el sello.

> 💡 **Idea:** dos cosas para llevarte. **Una:** "ya se arreglará solo" es una **suposición**, no un diagnóstico; si dices eso, pon una fecha para volver a probar, y si no se arregló, la suposición estaba mal. **Dos:** las claves, los ids y las contraseñas se comparan **enteros**, letra por letra (o con el computador: `a === b`), nunca mirando cómo empiezan.

> 🎙️ **El profesor dice:** ese mismo día, probando que las prácticas de esta clase se corrigieran en el sitio de verdad, apareció **otro error**, que no tenía nada que ver con App Check. Todas las pruebas automáticas pasaban, pero la práctica respondía "No conozco esa práctica". El servidor revisa el id de cada práctica con un filtro, y el filtro era este:

```js
// firebase/funciones/index.js (antes del arreglo)
const ID_PRACTICA = /^\d{2}:[\w.-]+\.md:\d{1,3}:practica\d{1,2}$/;
```

`\d{2}` quiere decir "**exactamente dos** números". El id de esta clase empieza con `124`, que tiene tres. Así que las **96 prácticas** de las clases 100 a 124 nunca se habían podido corregir, y nadie se dio cuenta porque las pruebas solo usaban clases viejas, de dos números. El arreglo fue cambiar `\d{2}` por `\d{2,3}` ("dos o tres números") y comprobar que el filtro aceptara las 659 prácticas, **todas**, no solo una.

> 📌 **Nota:** "las pruebas pasan" quiere decir "lo que probamos funciona", no "todo funciona". Cuando agregas algo nuevo (aquí, clases con un número más largo), **pruébalo en el sitio de verdad**, como lo usaría un alumno.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: El filtro de las prácticas
lenguaje: js
pide: Completa `idValido(id)` para que devuelva `true` si el id tiene la forma `CLASE:ARCHIVO.md:PARTE:practicaN`, donde CLASE tiene **2 o 3** números, PARTE de 1 a 3 números y N 1 o 2 números. Si no, `false`. Usa una expresión regular con `.test(id)`.
--- código
function idValido(id) {
  // tu código aquí
}
--- pruebas
prueba('una clase de dos números', () => igual(idValido('18:CLASE-GUIADA.md:1:practica1'), true));
prueba('una clase de tres números (el error de verdad)', () => igual(idValido('124:LECCION.md:4:practica1'), true));
prueba('cuatro números ya no', () => igual(idValido('1240:LECCION.md:1:practica1'), false));
prueba('sin el .md', () => igual(idValido('124:LECCION:1:practica1'), false));
prueba('con algo pegado al final', () => igual(idValido('124:LECCION.md:1:practica1x'), false));
--- solución
function idValido(id) {
  return /^\d{2,3}:[\w.-]+\.md:\d{1,3}:practica\d{1,2}$/.test(id);
}
```

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿Ya se puede aplicar?
lenguaje: js
pide: Completa `listoParaAplicar(datos)`. `datos` tiene `verificadas`, `noVerificadas` (cuántas llamadas de cada tipo contó la consola) y `dias` (cuántos días lleva mirando). Devuelve `true` solo si lleva **7 días o más** y al menos el **95 %** de las llamadas vino verificado. Si no hubo ninguna llamada, devuelve `false` (no hay con qué decidir).
--- código
function listoParaAplicar(datos) {
  // tu código aquí
}
--- pruebas
prueba('una semana y casi todo verificado', () => igual(listoParaAplicar({ verificadas: 980, noVerificadas: 20, dias: 7 }), true));
prueba('muy pronto, aunque todo esté bien', () => igual(listoParaAplicar({ verificadas: 1000, noVerificadas: 0, dias: 2 }), false));
prueba('demasiadas sin verificar', () => igual(listoParaAplicar({ verificadas: 800, noVerificadas: 200, dias: 10 }), false));
prueba('justo el 95 % alcanza', () => igual(listoParaAplicar({ verificadas: 95, noVerificadas: 5, dias: 7 }), true));
prueba('sin llamadas no se decide', () => igual(listoParaAplicar({ verificadas: 0, noVerificadas: 0, dias: 30 }), false));
--- solución
function listoParaAplicar(datos) {
  const total = datos.verificadas + datos.noVerificadas;
  if (total === 0) return false;
  return datos.dias >= 7 && datos.verificadas / total >= 0.95;
}
```

```practica
elige :: ¿Por qué App Check se deja una semana en modo mirar antes de aplicar? :: Porque Google lo cobra :: Para comprobar que las visitas reales reciben bien su sello y no echar por error a un alumno de verdad :: Porque el sitio carga más rápido
vf :: Si la consola muestra un 403 de App Check, lo correcto es apagar la verificación de dominio para que desaparezca
vf :: Para aplicar App Check en una Cloud Function se agrega enforceAppCheck: true en sus opciones
escribe :: Cuenta cómo buscarías la causa de un 403 de App Check sin adivinar. :: Separo las piezas. Primero pruebo si la clave del sitio da un token de reCAPTCHA en mi dominio. Si da, el dominio y la clave de reCAPTCHA están bien. Después pruebo canjear ese token en App Check. Si falla ahí, el problema está en la configuración de App Check: que la clave registrada sea la misma, o que todavía no se activó.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿la apiKey de Firebase en el frontend no es un riesgo?":** "No es secreta: el navegador la necesita para encontrar el proyecto. Lo que protege los datos son las reglas de Firestore, que dicen quién puede leer y escribir qué. El riesgo real es otro: que alguien copie la configuración y llame a mis funciones desde un programa propio para hacerme gastar. Para eso puse App Check."

> 🎤 **Si te preguntan "¿qué es App Check y cómo lo encendiste?":** "Es un portero que comprueba que cada llamada viene de mi sitio de verdad. En la web usa reCAPTCHA Enterprise, invisible: le da a cada visita real un token que vence y se renueva solo. Las reglas son la cerradura, porque deciden qué es de quién, y App Check es el portero de la entrada: se suman. Lo encendí en dos tiempos: primero en modo mirar, para ver en la consola que casi todas las llamadas vinieran verificadas, y después aplicar, con enforceAppCheck en las funciones y Enforce en Firestore. Así no dejaba afuera a un alumno real por un error de configuración."

> 🎤 **Si te preguntan por un problema que resolviste:** "Al conectarlo apareció un 403. En vez de apagar la verificación de dominio, que bajaba la seguridad, separé las piezas: el token de reCAPTCHA salía bien en mi dominio, pero App Check lo rechazaba. Eso me dijo que el problema estaba en la configuración de App Check y no en el dominio. Primero creí que solo faltaba que se activara; al otro día seguía igual, así que comparé las claves enteras: App Check tenía registrada una clave que empezaba igual que la mía pero no existía. La cambié y respondió 200 en menos de un minuto. Aprendí a no dejar un 'ya se arreglará solo' sin volver a probar."

> 🌎 **En la vida real:** la cerradura de cada oficina, el portero de la entrada y, por si acaso, una alarma que avisa si se gasta de más (la alerta de presupuesto). Tres capas, ninguna sola.
