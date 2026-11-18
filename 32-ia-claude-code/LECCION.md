# IA 3: Claude y Claude Code, tu herramienta principal

> 🌎 **En la vida real:** un chat de IA es como llamar a un experto por teléfono: te explica, pero tú haces el trabajo. Un **agente de código** es como traer al experto a tu taller: abre los cajones, usa tus herramientas, prueba y te muestra lo que cambió.

> 🎙️ **El profesor dice:** **Claude** es tu herramienta principal. Hoy vemos la diferencia entre conversar con Claude y trabajar con **Claude Code**, cómo se le dan las reglas del proyecto (`CLAUDE.md` y `AGENTS.md`), cómo revisar lo que hace y cómo dividir el trabajo en sesiones. Este mismo mapa de estudios se hizo así.

## Parte 1. Del chat al agente de código

> 🌎 **En la vida real:** el chat es una receta que te dictan; el agente es un cocinero en tu cocina.

> 🌎 **Otro ejemplo:** Es como la diferencia entre un tutorial en video y un profesor particular sentado a tu lado.

### Claude en el chat

En claude.ai o en la app conversas: explicas un problema, pegas código, pides una explicación o un plan. Sirve para **pensar**, aprender y preparar. Pero los cambios los copias y pegas tú.

> 🌎 **En la vida real:** es como pedir consejo a un amigo que sabe de autos por mensaje: te dice qué hacer y tú vas al garaje.

> 🌎 **Otro ejemplo:** Es como una biblioteca con bibliotecario: te orienta, pero tú lees.

### Claude Code: el agente que trabaja en tu proyecto

**Claude Code** es un agente: corre en la terminal, en la app de escritorio, en el editor o en la web, **lee tu proyecto, edita archivos, corre comandos** (pruebas, Git, el servidor) y te muestra los cambios. Funciona en ciclo (Tema 19): piensa, usa una herramienta, mira el resultado y sigue hasta terminar.

> 🌎 **En la vida real:** es como un electricista que entra a tu casa: revisa el tablero, cambia el cable y prueba la luz.

> 🌎 **Otro ejemplo:** Es como un asistente con acceso a tu escritorio: no solo te dice dónde está el papel, lo busca y lo archiva.

### Los permisos

Como puede tocar archivos y correr comandos, Claude Code **pide permiso** para lo delicado. Puedes elegir cuánto confías: preguntar todo, aceptar ediciones, o modos más automáticos. Para lo que no se puede deshacer (publicar, borrar, mandar algo), lo sano es que te pregunte.

> 🌎 **En la vida real:** es como darle la llave de casa a alguien: la de la puerta sí; la de la caja fuerte, no.

> 🌎 **Otro ejemplo:** Es como un empleado nuevo: al principio revisas todo; con el tiempo le das más confianza, pero los pagos grandes los apruebas tú.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Qué pregunta el agente antes de hacer
lenguaje: js
pide: Completa `decision(accion, modo)`. Las acciones son `'leer'`, `'editar'`, `'correr pruebas'` o una **irreversible** (`'push'`, `'publicar'`, `'borrar'`). Los modos: `'preguntar todo'`, `'aceptar ediciones'`, `'automático'`. Leer nunca pregunta (`'hacer'`). Lo irreversible **siempre** es `'preguntar'`, sea cual sea el modo. Editar: `'hacer'` salvo en `'preguntar todo'`. Correr pruebas: `'hacer'` solo en `'automático'`.
--- código
const IRREVERSIBLES = ['push', 'publicar', 'borrar'];

function decision(accion, modo) {
  // tu código aquí
}
--- pruebas
prueba('leer, siempre', () => igual(['preguntar todo', 'aceptar ediciones', 'automático'].map((m) => decision('leer', m)), ['hacer', 'hacer', 'hacer']));
prueba('lo irreversible, siempre pregunta', () => igual(IRREVERSIBLES.map((a) => decision(a, 'automático')), ['preguntar', 'preguntar', 'preguntar']));
prueba('editar', () => igual(['preguntar todo', 'aceptar ediciones', 'automático'].map((m) => decision('editar', m)), ['preguntar', 'hacer', 'hacer']));
prueba('correr pruebas', () => igual(['preguntar todo', 'aceptar ediciones', 'automático'].map((m) => decision('correr pruebas', m)), ['preguntar', 'preguntar', 'hacer']));
--- solución
const IRREVERSIBLES = ['push', 'publicar', 'borrar'];

function decision(accion, modo) {
  if (accion === 'leer') return 'hacer';
  if (IRREVERSIBLES.includes(accion)) return 'preguntar';
  if (accion === 'editar') return modo === 'preguntar todo' ? 'preguntar' : 'hacer';
  return modo === 'automático' ? 'hacer' : 'preguntar';
}
```

```practica
vf :: Claude Code puede leer tu proyecto, editar archivos y correr comandos
vf :: En el chat de Claude los cambios se aplican solos en tus archivos
elige :: ¿Para qué es mejor el chat? :: Para cambiar muchos archivos :: Para pensar, aprender y preparar un plan :: Para correr las pruebas
elige :: ¿Qué conviene que Claude Code te pregunte siempre? :: Si puede leer un archivo :: Antes de algo que no se puede deshacer, como publicar o borrar :: Nada
escribe :: Explica la diferencia entre Claude en el chat y Claude Code. :: En el chat converso, me explica y me da código que yo copio; Claude Code es un agente que trabaja en mi proyecto: lee, edita archivos, corre comandos y me muestra los cambios, pidiendo permiso para lo delicado.
```

## Parte 2. Las reglas del proyecto: CLAUDE.md y AGENTS.md

> 🌎 **En la vida real:** cuando entra un empleado nuevo, le das el manual de la empresa: dónde está todo, qué no tocar y cómo se hacen las cosas.

> 🌎 **Otro ejemplo:** Es como la nota que dejas en la nevera para quien cuida a tus hijos: horarios, alergias y teléfonos.

### Qué es CLAUDE.md

Un archivo `CLAUDE.md` en la raíz del proyecto que Claude Code **lee al empezar**. Ahí van: qué es el proyecto, cómo se corre, cómo se prueba, las reglas (no tocar producción, en qué idioma escribir, qué no subir) y decisiones importantes. Así no repites lo mismo en cada conversación. El comando `/init` arma uno inicial mirando tu proyecto.

> 🌎 **En la vida real:** es como el reglamento del condominio pegado en el ascensor: todos lo ven al entrar.

> 🌎 **Otro ejemplo:** Es como la receta de la abuela en la puerta de la alacena: cualquiera que cocine la sigue igual.

### AGENTS.md: el mismo manual para todas las herramientas

**AGENTS.md** es un formato abierto que leen muchas herramientas (OpenCode, Codex y otras). En este repositorio hay `AGENTS.md`, `CLAUDE.md` y `GEMINI.md`: cada herramienta encuentra sus reglas. Una forma ordenada es escribir las reglas una vez en `AGENTS.md` y que los otros apunten ahí.

> 🌎 **En la vida real:** es como poner el aviso de "no fumar" en español, inglés y portugués: la misma regla para todos los que entren.

> 🌎 **Otro ejemplo:** Es como el manual de un electrodoméstico que trae las mismas instrucciones en varios idiomas.

### Qué poner (y qué no)

✅ Comandos (`npm test`, cómo levantar el servidor), estructura, reglas, qué está prohibido (por ejemplo: "la app está en producción: no escribir en Firebase real").
❌ Secretos, contraseñas, claves: el archivo se sube al repositorio y lo lee la IA.

> 🌎 **En la vida real:** en el manual del empleado va dónde está la caja; la combinación, no.

> 🌎 **Otro ejemplo:** Es como el cartel de la casa de veraneo: "la llave del gas se cierra al salir", no "la llave de la puerta está bajo el tapete".

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar un CLAUDE.md
lenguaje: js
pide: Completa `revisarReglas(texto)`: devuelve la lista de problemas del archivo de reglas, en este orden: `'falta ## Comandos'` y `'falta ## Reglas'` si no tiene esos títulos; y `'tiene un secreto en la línea N'` por cada línea con algo como `sk_`, `PRIVATE KEY` o `password=` con un valor pegado, como `password=abc` (los secretos nunca van ahí: el archivo se sube y lo lee la IA).
--- código
function revisarReglas(texto) {
  // tu código aquí
}
--- pruebas
const bueno = '# Mi proyecto\n## Comandos\nnpm test\n## Reglas\n- No escribir en Firebase real';
prueba('un archivo bueno', () => igual(revisarReglas(bueno), []));
prueba('le faltan secciones', () => igual(revisarReglas('# Mi proyecto\nnpm test'), ['falta ## Comandos', 'falta ## Reglas']));
prueba('con un secreto', () => igual(revisarReglas(bueno + '\nLa clave de Stripe es sk_live_123abc'), ['tiene un secreto en la línea 6']));
prueba('"password=" sin valor no es un secreto', () => igual(revisarReglas(bueno + '\nNunca escribas password= en el código'), []));
--- solución
function revisarReglas(texto) {
  const problemas = [];
  if (!/^## Comandos/m.test(texto)) problemas.push('falta ## Comandos');
  if (!/^## Reglas/m.test(texto)) problemas.push('falta ## Reglas');
  texto.split('\n').forEach((linea, i) => {
    if (/sk_\w+|PRIVATE KEY|password=\S/.test(linea)) problemas.push(`tiene un secreto en la línea ${i + 1}`);
  });
  return problemas;
}
```

```practica
vf :: Claude Code lee CLAUDE.md al empezar a trabajar en el proyecto
vf :: En CLAUDE.md conviene poner las contraseñas para que la IA las tenga a mano
elige :: ¿Qué es AGENTS.md? :: Un virus :: Un formato abierto de reglas del proyecto que leen muchas herramientas de IA :: Un archivo de Git
elige :: ¿Qué comando de Claude Code arma un CLAUDE.md inicial? :: /borrar :: /init :: /publicar
escribe :: Escribe tres reglas que pondrías en el CLAUDE.md de un proyecto en producción. :: Por ejemplo: no escribir nunca en la base de datos real, correr npm test antes de dar algo por terminado, y no hacer commit ni push sin que yo lo pida.
```

## Parte 3. Revisar lo que hizo

> 🌎 **En la vida real:** cuando el mecánico termina, revisas que frene, que no haya una luz encendida y que te devuelva las piezas viejas.

> 🌎 **Otro ejemplo:** Es como revisar el cambio en la caja antes de irte.

### Leer el diff

El **diff** muestra exactamente qué líneas cambiaron (verde lo nuevo, rojo lo que se quitó). Léelo **siempre** antes de guardar: ¿cambió solo lo que pediste?, ¿tocó archivos que no tenía por qué?, ¿borró algo?

```bash
git diff            # lo que cambió y todavía no guardaste
git diff --stat     # resumen: qué archivos y cuántas líneas
```

> 🌎 **En la vida real:** es como el "control de cambios" de un documento: ves cada palabra que el otro tocó.

> 🌎 **Otro ejemplo:** Es como comparar dos fotos de tu cuarto: antes y después de que alguien lo ordenara.

### Que lo pruebe (y probarlo tú)

Pídele que **corra las pruebas** y que te diga el resultado real. Y prueba tú lo que se ve: abre la página, toca el botón. "Debería funcionar" no es lo mismo que "lo probé y funciona".

> 🌎 **En la vida real:** el electricista prende la luz delante tuyo antes de cobrar.

> 🌎 **Otro ejemplo:** Es como probarte los zapatos en la tienda, no solo mirarlos.

### Guardar con Git en pasos chicos

Cuando un cambio está bien, **commit** (Tema 06). Si el siguiente sale mal, vuelves a ese punto. Trabajar con IA sin Git es como escribir sin el botón de deshacer.

> 🌎 **En la vida real:** es como guardar la partida en un videojuego antes del jefe final.

> 🌎 **Otro ejemplo:** Es como sacar fotos de cada paso al desarmar algo: después sabes cómo volver a armarlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: ¿Tocó solo lo que pediste?
lenguaje: js
pide: Completa `archivosDelDiff(stat)`: lee la salida de `git diff --stat` y devuelve los archivos que cambiaron (lo de antes del `|`, sin espacios), sin la última línea de resumen. Y `tocoDeMas(stat, pedidos)`: los archivos que cambiaron y **no** estaban en la lista de lo pedido.
--- código
function archivosDelDiff(stat) {
  // tu código aquí
}

function tocoDeMas(stat, pedidos) {
  // tu código aquí
}
--- pruebas
const stat = ` web/vistas/cuenta.js  | 12 ++++++------
 web/estilos.css        | 40 ++++++++++++++++++++++++++++++++++++++++
 package.json           |  1 +
 3 files changed, 47 insertions(+), 6 deletions(-)`;
prueba('los archivos', () => igual(archivosDelDiff(stat), ['web/vistas/cuenta.js', 'web/estilos.css', 'package.json']));
prueba('lo que tocó de más', () => igual(tocoDeMas(stat, ['web/vistas/cuenta.js']), ['web/estilos.css', 'package.json']));
prueba('nada de más', () => igual(tocoDeMas(' a.js | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)', ['a.js']), []));
--- solución
function archivosDelDiff(stat) {
  return stat
    .split('\n')
    .filter((linea) => linea.includes('|'))
    .map((linea) => linea.split('|')[0].trim());
}

function tocoDeMas(stat, pedidos) {
  return archivosDelDiff(stat).filter((a) => !pedidos.includes(a));
}
```

```practica
vf :: Si Claude Code dice que terminó, no hace falta revisar nada
vf :: git diff muestra qué líneas cambiaron
elige :: ¿Qué preguntas te haces al leer un diff? :: Si el código es bonito :: Si cambió solo lo pedido, si tocó archivos de más o si borró algo :: Cuántos colores tiene
elige :: ¿Por qué hacer commits chicos al trabajar con IA? :: Para tener más commits :: Para poder volver a un punto bueno si el siguiente cambio sale mal :: Porque Git lo exige
escribe :: ¿Qué diferencia hay entre "debería funcionar" y "lo probé"? :: "Debería funcionar" es una suposición; "lo probé" significa que corrí las pruebas o usé la pantalla y vi el resultado real.
```

## Parte 4. Sesiones, subagentes y herramientas extra

> 🌎 **En la vida real:** en una obra grande no hay un solo albañil: hay un equipo, cada uno en su parte, y un jefe que junta todo.

> 🌎 **Otro ejemplo:** Es como una cocina de restaurante: uno en la parrilla, otro en postres, y el chef revisando cada plato.

### Una sesión por tarea

Cada conversación con Claude Code es una **sesión**. Una tarea por sesión mantiene el contexto limpio (IA 1). Si aparece algo distinto en el medio, se abre otra sesión para eso.

> 🌎 **En la vida real:** es como tener una carpeta por cliente en vez de mezclar todos los papeles.

> 🌎 **Otro ejemplo:** Es como hacer una diligencia a la vez: banco, después farmacia, no las dos en la misma fila.

### Subagentes

Para buscar mucho o revisar algo grande, Claude Code puede lanzar **subagentes**: otros agentes que hacen una parte con su propio contexto y le devuelven solo el resultado. Así la conversación principal no se llena.

> 🌎 **En la vida real:** es como mandar a un ayudante a la biblioteca a buscar un dato: vuelve con la respuesta, no con todos los libros.

> 🌎 **Otro ejemplo:** Es como un jefe que pide un informe resumido en vez de leer todos los correos.

### MCP: conectar herramientas

**MCP** (*Model Context Protocol*) es un estándar para conectar la IA con herramientas: un navegador, una base de datos, tu calendario. Con un navegador conectado, por ejemplo, Claude Code puede abrir tu sitio, tocar botones y ver si funciona. Cada conexión es una puerta más: solo conecta las que necesitas.

> 🌎 **En la vida real:** es como los enchufes estándar: cualquier aparato se conecta a cualquier pared.

> 🌎 **Otro ejemplo:** Es como el USB: un mismo conector para el mouse, la memoria o la impresora.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Una sesión por tarea, y el subagente que resume
lenguaje: js
pide: Completa `otraSesion(temaActual, pedido)`: `true` si el pedido es de **otro** tema (el `pedido.tema` es distinto del actual) y no es una corrección (`pedido.esCorreccion` no es `true`). Y `loQueVuelve(resultados)`: lo que un subagente le devuelve al principal después de buscar en muchos archivos: solo `{ revisados, conProblemas }`, con la cantidad de archivos y la lista de los que tienen `problemas > 0`, no todo el detalle.
--- código
function otraSesion(temaActual, pedido) {
  // tu código aquí
}

function loQueVuelve(resultados) {
  // tu código aquí
}
--- pruebas
prueba('lo mismo, sigue', () => igual(otraSesion('login', { tema: 'login' }), false));
prueba('una corrección, sigue aunque cambie de palabra', () => igual(otraSesion('login', { tema: 'botón', esCorreccion: true }), false));
prueba('otra cosa, otra sesión', () => igual(otraSesion('login', { tema: 'audios' }), true));
const resultados = [{ archivo: 'a.js', problemas: 0, detalle: 'x'.repeat(500) }, { archivo: 'b.js', problemas: 2, detalle: 'y'.repeat(500) }, { archivo: 'c.js', problemas: 1, detalle: '' }];
prueba('vuelve solo el resumen', () => igual(loQueVuelve(resultados), { revisados: 3, conProblemas: ['b.js', 'c.js'] }));
--- solución
function otraSesion(temaActual, pedido) {
  return pedido.tema !== temaActual && pedido.esCorreccion !== true;
}

function loQueVuelve(resultados) {
  return { revisados: resultados.length, conProblemas: resultados.filter((r) => r.problemas > 0).map((r) => r.archivo) };
}
```

```practica
vf :: Conviene hacer una tarea por sesión para mantener el contexto limpio
vf :: Un subagente le devuelve a la conversación principal todo lo que leyó
elige :: ¿Qué es MCP? :: Un modelo nuevo :: Un estándar para conectar la IA con herramientas como un navegador o una base de datos :: Un lenguaje de programación
elige :: ¿Por qué no conectar todas las herramientas posibles? :: Porque es lento :: Porque cada conexión es una puerta más (más riesgo) :: Porque no se puede
escribe :: ¿Cuándo usarías un subagente? :: Cuando hay que buscar o revisar mucho (por ejemplo, encontrar todos los lugares donde se usa una función) y solo necesito el resultado, para que la conversación principal no se llene.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con Claude Code?":** "Tengo un CLAUDE.md o AGENTS.md con las reglas del proyecto: cómo se prueba, qué no se toca y que no se publique sin mi permiso. Hago una tarea por sesión, para lo grande pido primero el plan, leo cada diff, pido que corra las pruebas y pruebo yo lo que se ve. Guardo con commits chicos. Así hice, por ejemplo, el certificado verificable de mi mapa de estudios, con reglas de Firebase probadas contra trampas."

> 🌎 **En la vida real:** es como contar cómo diriges a un equipo: reglas claras, revisión y nada sale sin tu firma.

> 🌎 **Otro ejemplo:** Es como un capitán que explica su lista de chequeo antes de cada vuelo.
