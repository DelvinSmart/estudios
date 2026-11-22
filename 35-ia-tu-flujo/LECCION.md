# IA 6: tu flujo de trabajo, de la idea a lo publicado

> 🌎 **En la vida real:** un chef no improvisa cada noche: tiene su forma de trabajar (preparar, cocinar, probar, servir), y por eso sale bien aunque haya mucha gente.

> 🎙️ **El profesor dice:** esta clase del curso **IA para programadores** junta todo en un flujo que puedes repetir siempre, con un ejemplo real: cómo se hizo el certificado verificable de este mapa. Y una pregunta importante para el final: cómo seguir **aprendiendo de verdad** mientras la IA hace tanto por ti.

## Parte 1. El flujo en siete pasos

> 🌎 **En la vida real:** es como la receta de siempre de tu mamá: los mismos pasos, en el mismo orden, y sale igual de buena cada vez.

> 🌎 **Otro ejemplo:** Es como el ritual antes de un viaje: maleta, documentos, revisar la casa, salir.

### Los pasos

1. **Idea con tus palabras.** Qué quieres y por qué (puedes contársela a Gemini o a Claude en el chat).
2. **Pedido claro.** Contexto, tarea, límites, terminado (IA 2).
3. **Plan.** Para lo grande, la IA propone y tú apruebas.
4. **Cambio chico.** Una parte a la vez.
5. **Revisión.** Diff, pruebas, pantalla, seguridad (IA 5).
6. **Guardar.** Commit con un mensaje que diga qué cambió.
7. **Publicar.** Push, y comprobar que lo publicado funciona (Tema 20).

> 🌎 **En la vida real:** es como lavar ropa: separar, lavar, enjuagar, secar, doblar. Si te saltas el enjuague, se nota.

> 🌎 **Otro ejemplo:** Es como armar un rompecabezas: primero los bordes, después por colores, al final el centro.

### Dónde se te escapa el tiempo

El tiempo no se pierde escribiendo código (eso lo hace rápido la IA): se pierde en **pedidos confusos**, **cambios gigantes** que no se pueden revisar y **arreglos sin probar** que rompen otra cosa. Los pasos 2, 4 y 5 son los que más ahorran.

> 💡 **Idea:** en un mismo trabajo, los pasos 4 a 6 se repiten muchas veces: un cambio chico, se revisa, se guarda, y otra vuelta. Avanzar así, en vueltas cortas, se llama **iterar** (cada vuelta es una **iteración**). Es mejor que intentar todo perfecto de una sola vez.

> 🌎 **En la vida real:** en un viaje, el tiempo se pierde perdiéndose, no manejando.

> 🌎 **Otro ejemplo:** Es como cocinar sin leer la receta: terminas yendo tres veces al mercado.

> 🧩 **Piezas para este ejercicio**
> - La lista fija define el orden de trabajo. Busca el primer paso ausente. Para decidir si se puede publicar, toma los anteriores a publicar y comprueba cuáles faltan.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El flujo en siete pasos, sin saltarse ninguno
lenguaje: js
pide: Completa `siguiente(hechos)`: el primer paso de `PASOS` que todavía no está en `hechos` (o `'listo'` si están todos). Y `puedoPublicar(hechos)`: `true` solo si están hechos **todos** los pasos anteriores a publicar; y si no, devuelve la lista de los que faltan (en orden), para que se vea qué te saltaste.
--- código
const PASOS = ['idea', 'pedido', 'plan', 'cambio chico', 'revisión', 'guardar', 'publicar'];

function siguiente(hechos) {
  // tu código aquí
}

function puedoPublicar(hechos) {
  // tu código aquí
}
--- pruebas
prueba('al empezar', () => igual(siguiente([]), 'idea'));
prueba('en el medio', () => igual(siguiente(['idea', 'pedido', 'plan']), 'cambio chico'));
prueba('todo hecho', () => igual(siguiente(PASOS), 'listo'));
prueba('se puede publicar', () => igual(puedoPublicar(['idea', 'pedido', 'plan', 'cambio chico', 'revisión', 'guardar']), true));
prueba('se saltó la revisión', () => igual(puedoPublicar(['idea', 'pedido', 'cambio chico', 'guardar']), ['plan', 'revisión']));
--- solución
const PASOS = ['idea', 'pedido', 'plan', 'cambio chico', 'revisión', 'guardar', 'publicar'];

function siguiente(hechos) {
  return PASOS.find((p) => !hechos.includes(p)) ?? 'listo';
}

function puedoPublicar(hechos) {
  const faltan = PASOS.slice(0, -1).filter((p) => !hechos.includes(p));
  return faltan.length === 0 ? true : faltan;
}
```

```practica
vf :: El tiempo se pierde sobre todo escribiendo código
vf :: Después de publicar hay que comprobar que lo publicado funciona
elige :: ¿Qué paso va justo antes de guardar con un commit? :: Publicar :: Revisar (diff, pruebas, pantalla, seguridad) :: Tener la idea
elige :: Para un cambio grande, ¿qué viene después del pedido? :: Publicar :: El plan, que tú apruebas :: Borrar todo
escribe :: Escribe los siete pasos del flujo de memoria. :: Idea con mis palabras, pedido claro, plan, cambio chico, revisión, guardar con commit y publicar comprobando que funciona.
```

## Parte 2. Un ejemplo real: el certificado verificable

> 🌎 **En la vida real:** aprender a cocinar viendo a alguien hacer un plato de verdad enseña más que leer diez recetas.

> 🌎 **Otro ejemplo:** Es como ver la repetición de un gol en cámara lenta: ves cada movimiento.

### Cómo fue, paso a paso

1. **Idea:** "que un reclutador pueda comprobar que de verdad terminé el curso".
2. **Pedido y plan:** se analizó como atacante (¿cómo lo falsificaría alguien?) y se propuso Firebase con reglas.
3. **Cambios chicos:** primero las reglas; después el progreso en la nube; después el certificado; después la página de verificar; después el login con correo.
4. **Revisión:** cada trampa se escribió como prueba; una prueba falló y así se encontró el problema del punto en los ids (Tema 21).
5. **Guardar y publicar:** un commit por paso, despliegue de las reglas, y comprobar en el sitio publicado que un código inventado dice "no existe".
6. **Correcciones tuyas:** "que solo sea Gmail", "sin teléfono", "que el correo tenga la cara del sitio", "que después de entrar vaya al mapa". Cada una, un cambio chico más.

> 🌎 **En la vida real:** es como construir una casa por etapas: cimientos, paredes, techo, y el dueño pide cambios en cada visita.

> 🌎 **Otro ejemplo:** Es como un sastre: primera prueba, ajuste, segunda prueba, ajuste, entrega.

### Lo que hiciste tú y lo que hizo la IA

La IA escribió el código, las pruebas y las clases. **Tú** decidiste qué se quería, revisaste cada pantalla, encontraste lo que no te gustaba (los colores, el espacio, el correo en inglés) y aprobaste cada paso que tocaba tu cuenta (Firebase, el Gmail, las claves). Esa parte no la hace la IA: es la del dueño del producto.

> 🌎 **En la vida real:** el arquitecto no pone ladrillos, pero sin él la casa no tiene sentido.

> 🌎 **Otro ejemplo:** Es como un director de cine: no actúa, pero decide cada toma.

> 🧩 **Piezas para este ejercicio**
> - Un requisito es un paso que debe estar hecho de antemano. Al recorrer un orden, guarda cuáles ya ocurrieron. Para proponer otro orden, vuelve a buscar el primer paso cuyos requisitos estén resueltos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los pasos del certificado, en orden
lenguaje: js
pide: Cada paso dice qué **necesita** que esté hecho antes. Completa `problemasDeOrden(pasos)`: recorre los pasos en el orden dado y devuelve un aviso `'X antes de Y'` cada vez que un paso aparece **antes** de algo que necesita (Y es lo que necesita). Y `ordenar(pasos)`: un orden que respete todo, eligiendo siempre, de los que ya se pueden hacer, el que venía primero en la lista.
--- código
function problemasDeOrden(pasos) {
  // tu código aquí
}

function ordenar(pasos) {
  // tu código aquí
}
--- pruebas
const pasos = [
  { nombre: 'certificado', necesita: ['progreso'] },
  { nombre: 'reglas', necesita: [] },
  { nombre: 'verificar', necesita: ['certificado'] },
  { nombre: 'progreso', necesita: ['reglas'] },
];
prueba('los avisos', () => igual(problemasDeOrden(pasos), ['certificado antes de progreso']));
prueba('el orden bueno', () => igual(ordenar(pasos).map((p) => p.nombre), ['reglas', 'progreso', 'certificado', 'verificar']));
prueba('un orden bueno no tiene avisos', () => igual(problemasDeOrden(ordenar(pasos)), []));
--- solución
function problemasDeOrden(pasos) {
  const avisos = [];
  pasos.forEach((p, i) => {
    for (const n of p.necesita) {
      const donde = pasos.findIndex((x) => x.nombre === n);
      if (donde > i) avisos.push(`${p.nombre} antes de ${n}`);
    }
  });
  return avisos;
}

function ordenar(pasos) {
  const hechos = [];
  const quedan = [...pasos];
  while (quedan.length) {
    const i = quedan.findIndex((p) => p.necesita.every((n) => hechos.some((h) => h.nombre === n)));
    if (i === -1) break;
    hechos.push(quedan.splice(i, 1)[0]);
  }
  return hechos;
}
```

```practica
vf :: En el certificado verificable, cada trampa se convirtió en una prueba automática
vf :: En un proyecto hecho con IA, la persona no hace nada importante
elige :: ¿Qué se hizo primero en el certificado verificable? :: El diseño del correo :: Las reglas de seguridad :: El botón de LinkedIn
elige :: ¿Qué pasos le tocaron solo a la persona? :: Escribir las reglas :: Crear la contraseña de aplicación y pegar las claves en la terminal :: Escribir las pruebas
escribe :: Elige una mejora para tu sitio y escríbela como los pasos del flujo. :: Por ejemplo: idea, que Mi progreso tenga un botón para volver a donde estaba; pedido claro con el archivo y cómo se ve terminado; cambio chico; revisar en computadora y celular; commit; publicar y comprobar en el sitio.
```

## Parte 3. Aprender de verdad mientras la IA trabaja

> 🌎 **En la vida real:** si siempre te llevan en carro, nunca aprendes el camino. El día que tengas que ir solo, te pierdes.

> 🌎 **Otro ejemplo:** Es como la calculadora en el colegio: útil, pero si no sabes multiplicar, no te das cuenta cuando el resultado es absurdo.

### El riesgo: depender sin entender

La IA te deja hacer cosas que todavía no sabes hacer. Eso es bueno para avanzar, pero si nunca entiendes lo que hace, no vas a poder **revisarlo** (IA 5), ni explicarlo en una entrevista, ni arreglarlo el día que la herramienta no esté. Por eso este mapa tiene **clases guiadas** con prácticas: para que puedas estudiar sin IA.

> 🌎 **En la vida real:** es como un piloto que solo sabe volar con piloto automático: el día que falla, no sabe aterrizar.

> 🌎 **Otro ejemplo:** Es como hablar un idioma solo con el traductor del celular: funciona hasta que se acaba la batería.

### Usar la IA como profesor

Pídele que **te explique**, no solo que haga: "explícame esta línea", "¿por qué elegiste esto y no aquello?", "hazme preguntas para ver si entendí", "dame un ejercicio parecido para hacerlo yo". Y de vez en cuando, **escribe tú** la solución y pídele que la corrija.

> 🌎 **En la vida real:** es la diferencia entre que el profesor te haga la tarea o que te enseñe a hacerla.

> 🌎 **Otro ejemplo:** Es como un entrenador de gimnasio: te muestra el ejercicio, pero las pesas las levantas tú.

### Tu plan con este mapa

Programación primero (los fundamentos que te faltan), **seguridad** en paralelo, y con esto (IA para programadores) ya puedes trabajar mejor desde hoy. **Agentes de IA** al final, cuando quieras construir tus propios agentes. Una clase por día como máximo (o por semana, si tienes poco tiempo), con sus prácticas, vale más que diez leídas rápido.

> 🌎 **En la vida real:** es como un plan de entrenamiento: poco y constante gana a mucho y de vez en cuando.

> 🌎 **Otro ejemplo:** Es como ahorrar: un poco cada mes llega más lejos que un esfuerzo grande una vez.

> 🧩 **Piezas para este ejercicio**
> - La búsqueda reconoce el nombre que aparece entre `function` y el primer paréntesis. Cada nombre genera su propia pregunta. La pregunta sobre errores va al final una sola vez.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Que la IA te haga preguntas
lenguaje: js
pide: Para aprender de verdad, pídele a la IA que te pregunte. Hazlo tú con código: `preguntas(codigo)` busca cada `function nombre(` en el código y devuelve, por cada una, `'¿Qué hace nombre y qué devuelve?'`. Y si el código tiene un `try`, agrega al final `'¿Qué pasa si algo falla adentro del try?'`.
--- código
function preguntas(codigo) {
  // tu código aquí
}
--- pruebas
const codigo = `function total(gastos) {
  return gastos.reduce((s, g) => s + g.valor, 0);
}
function guardar(lista) {
  try { localStorage.setItem('gastos', JSON.stringify(lista)); } catch (e) { return false; }
  return true;
}`;
prueba('una pregunta por función, y la del try', () => igual(preguntas(codigo), ['¿Qué hace total y qué devuelve?', '¿Qué hace guardar y qué devuelve?', '¿Qué pasa si algo falla adentro del try?']));
prueba('sin try', () => igual(preguntas('function a() { return 1; }'), ['¿Qué hace a y qué devuelve?']));
prueba('sin funciones', () => igual(preguntas('const x = 1;'), []));
--- solución
function preguntas(codigo) {
  const lista = [...codigo.matchAll(/function\s+(\w+)\s*\(/g)].map((m) => `¿Qué hace ${m[1]} y qué devuelve?`);
  if (/\btry\b/.test(codigo)) lista.push('¿Qué pasa si algo falla adentro del try?');
  return lista;
}
```

```practica
vf :: Si la IA hace el código, ya no hace falta entender programación
vf :: Pedirle a la IA que te haga preguntas para ver si entendiste es una buena forma de aprender
elige :: ¿Para qué sirven las clases guiadas de este mapa? :: Para nada :: Para poder estudiar y practicar sin depender de la IA :: Para que la IA las lea
elige :: ¿Qué orden propone el mapa? :: Agentes primero :: Programación y seguridad, IA para programadores para trabajar mejor, y agentes al final :: Solo seguridad
escribe :: Escribe tres pedidos para usar la IA como profesor y no solo como ayudante. :: Por ejemplo: explícame esta línea paso a paso; hazme cinco preguntas para ver si entendí este tema; dame un ejercicio parecido para que lo resuelva yo y después lo corriges.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿la IA programa por ti?":** "La IA escribe mucho código, pero el producto es mío: yo decido qué se hace, divido el trabajo en pasos chicos, reviso cada cambio, lo pruebo y lo publico. Por ejemplo, el certificado verificable de mi mapa de estudios: definimos el ataque, escribimos las reglas y las probamos con trampas antes de hacer la parte visual. Y sigo estudiando los fundamentos para poder revisar y explicar lo que hace."

> 🌎 **En la vida real:** es como un fotógrafo que usa cámara automática: la cámara enfoca, pero la foto la decide él.

> 🌎 **Otro ejemplo:** Es como un piloto moderno: el avión tiene mucha automatización, y por eso el piloto tiene que entenderla mejor que nadie.
