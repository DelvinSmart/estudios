# La prueba técnica en vivo: pensar en voz alta

> 🌎 **En la vida real:** en un examen de manejo no basta con llegar; el instructor mira **cómo** manejas: si miras los espejos, si avisas, si vas con calma. La prueba técnica es igual: no evalúan solo si tu código funciona, sino **cómo piensas y cómo comunicas**.

> 🎙️ **El profesor dice:** {{alumno}}, esta es la última clase del curso, y junta todo: algoritmos, depurar, pruebas, buscar. En una prueba técnica en vivo te dan un problema y te miran resolverlo, hablando. Da nervios, pero tiene **truco**: un guion que puedes seguir siempre. Lo practicamos con un problema clásico de verdad.

## Parte 1. Qué evalúan de verdad

> 🌎 **En la vida real:** cuando contratas a alguien para arreglar tu casa, no te importa solo que lo arregle: te importa que te explique qué va a hacer, que no rompa otra cosa y que puedas hablar con él. Un equipo busca lo mismo.

En una prueba técnica, más que la respuesta perfecta, evalúan:

- **Cómo piensas:** ¿entiendes el problema antes de programar? ¿Consideras casos borde?
- **Cómo comunicas:** ¿explicas lo que haces? ¿Se puede trabajar contigo?
- **Cómo reaccionas al trabarte:** ¿te bloqueas en silencio o razonas en voz alta?
- **Si piensas en el costo:** ¿se te ocurre que tu solución podría ser más rápida? (Big-O, clase 118.)

> 💡 **Idea clave:** una solución **simple que funciona y que explicas bien** gana a una solución brillante que no sabes contar. Prefieren a alguien con quien puedan trabajar que a un genio callado.

```practica
elige :: En una prueba técnica en vivo, ¿qué pesa más? :: Solo que el código funcione :: Cómo piensas y cómo comunicas, además de que funcione :: La velocidad al teclear
vf :: Es mejor una solución simple que funciona y sabes explicar, que una brillante que no sabes contar
```

## Parte 2. El guion de seis pasos (para cualquier problema)

> 🌎 **En la vida real:** un piloto sigue una lista antes de despegar, siempre la misma, aunque sea experto. No es por tonto: es para no saltarse nada con los nervios. Tu guion es esa lista.

Pase lo que pase, sigue estos pasos **en voz alta**:

1. **Entiende y repite** el problema con tus palabras. Pregunta lo dudoso: "¿la lista puede estar vacía? ¿puede haber repetidos? ¿negativos?".
2. **Da ejemplos a mano,** incluido un **caso borde** (vacío, un elemento). Te aseguran que entendiste.
3. **Di la forma bruta primero:** "lo más simple serían dos bucles, O(n²)". Tener **algo** vale más que un silencio buscando lo perfecto.
4. **Mejora:** "¿puedo evitar el bucle anidado con un Map o un Set?" (clase 118).
5. **Escribe, hablando** lo que haces. Nombres claros.
6. **Pruébalo** con tus ejemplos, sobre todo el caso borde. Si falla, **depúralo** en voz alta (clase 120).

> 💡 **Idea:** decir tú solo "la forma simple es O(n²), pero la mejoro con un Map a O(n)" es exactamente lo que quieren oír. Muestra que piensas en el costo sin que te lo pidan.

```practica
elige :: ¿Cuál es el primer paso al recibir el problema? :: Empezar a escribir código :: Entender y repetir el problema con tus palabras, y preguntar las dudas :: Pedir la respuesta
vf :: Si solo se te ocurre la forma bruta, conviene quedarte callado hasta dar con la óptima
escribe :: Enumera los seis pasos del guion para una prueba técnica en vivo. :: Entender y repetir el problema; dar ejemplos con un caso borde; decir la forma bruta; mejorarla (¿Map o Set?); escribir hablando; y probar con los ejemplos, depurando en voz alta si falla.
```

## Parte 3. Resolvamos uno de verdad: "dos que sumen"

> 🎙️ **El profesor dice:** este es de los problemas más preguntados del mundo. Vamos a aplicarle el guion.

**El problema:** dada una lista de números y un objetivo, devuelve las **posiciones** de dos elementos distintos que sumen el objetivo. Las posiciones empiezan en 0. Si ninguna pareja sirve, devuelve `[]`. Ejemplo: `[2, 7, 11, 15]` con objetivo `9` → `[0, 1]` (porque 2 + 7 = 9).

Siguiendo el guion:

- **Entender:** si el ejercicio admite repetidos, dos posiciones con el mismo valor sí pueden formar una pareja. Con `[3, 3]` y objetivo `6`, sirven las posiciones `[0, 1]`.
- **Bruta (O(n²)):** por cada número, recorrer el resto buscando el que falta. Funciona, pero con muchos datos es lento.
- **Mejor (O(n)):** recorrer una vez con un **Map**. Por cada número, calculo **lo que me falta** (`objetivo - número`) y pregunto al Map si ya lo vi. Si sí, encontré la pareja; si no, guardo este número con su posición. Pasé de O(n²) a O(n), como en la clase 118.

En `[8, 1, 4]` con objetivo `5`, guardas el 8 con posición 0 y el 1 con posición 1. Cuando llegas al 4, buscas el 1 y lo encuentras en el mapa. Busca primero y guarda después para usar dos posiciones distintas. `Map.has(valor)` comprueba si guardaste el valor, incluso cuando su posición es 0. `Map.get(valor)` te devuelve esa posición.

El recorrido es O(n) con el supuesto habitual de búsquedas e inserciones de costo promedio constante. El espacio extra también puede llegar a O(n), porque puedes guardar hasta un registro por elemento.

✍️ **Ahora escribes tú:** la versión con un Map.

```ejercicio
titulo: Dos números que suman el objetivo (O(n))
lenguaje: js
pide: Completa `dosQueSuman(nums, objetivo)`: devuelve las dos posiciones cuyos valores suman `objetivo`. Recórrelo UNA vez con un `Map` de valor→posición: por cada número, calcula lo que falta (`objetivo - número`); si ya está en el map, devuelve `[posiciónGuardada, posiciónActual]`; si no, guarda el número con su posición. Si no hay pareja, devuelve `[]`.
--- código
function dosQueSuman(nums, objetivo) {
  const visto = new Map(); // valor -> posición
  // tu código aquí
}
--- pruebas
prueba('2+7=9', () => igual(dosQueSuman([2, 7, 11, 15], 9), [0, 1]));
prueba('3+5=8 (posiciones 1 y 3)', () => igual(dosQueSuman([4, 3, 2, 5], 8), [1, 3]));
prueba('sin pareja', () => igual(dosQueSuman([1, 2, 3], 100), []));
prueba('dos valores iguales en posiciones distintas', () => igual(dosQueSuman([3, 3], 6), [0, 1]));
prueba('un elemento no forma pareja consigo mismo', () => igual(dosQueSuman([3], 6), []));
--- solución
function dosQueSuman(nums, objetivo) {
  const visto = new Map();
  for (let i = 0; i < nums.length; i++) {
    const falta = objetivo - nums[i];
    if (visto.has(falta)) return [visto.get(falta), i];
    visto.set(nums[i], i);
  }
  return [];
}
```

```practica
elige :: En "dos que suman", ¿cómo se baja de O(n²) a O(n)? :: Con dos bucles más grandes :: Recorriendo una vez con un Map, preguntando por "lo que falta" (objetivo - número) :: Ordenando la lista tres veces
escribe :: Cuenta cómo resolverías "dos que suman" en una entrevista, en voz alta. :: Repito el problema y pregunto si siempre hay solución. Digo la forma bruta: dos bucles, O(n²). Luego la mejoro: una pasada con un Map de valor a posición; por cada número pregunto si ya vi "lo que falta"; si sí, devuelvo las dos posiciones. Es O(n). Lo pruebo con el ejemplo y un caso sin pareja.
```

## Parte 4. Cuando te bloqueas (y los errores que hunden)

> 🌎 **En la vida real:** si te pierdes manejando, no frenas en seco en medio de la calle ni te quedas callado con el pasajero. Reduces, dices "creo que me pasé, voy a dar la vuelta" y sigues. En la prueba, igual.

**Si te bloqueas:**

- **Habla:** "estoy pensando si un Map ayudaría aquí". El entrevistador muchas veces te da una pista; para eso está.
- **Simplifica:** resuelve una versión más fácil primero (la lista con 2 elementos), y luego generaliza.
- **Pide aclarar:** a veces el bloqueo es que no entendiste bien el problema.

**Los errores que hunden una prueba técnica:**

| Error | Qué hacer en su lugar |
|---|---|
| Empezar a codear sin entender | Repetir el problema y dar ejemplos primero |
| Quedarse callado al trabarte | Razonar en voz alta, aunque dudes |
| No probar tu solución | Pasarle tus ejemplos, sobre todo el caso borde |
| Inventar que sabes algo | "No lo recuerdo exacto, lo buscaría; la idea es…" (honestidad, clase 122) |
| Pelear si te corrigen | "Buen punto, lo ajusto" — se trabaja contigo |

> 💡 **Idea:** decir "no sé, pero lo buscaría así" es **mejor** que inventar. La honestidad tranquiliza; la mentira se nota y te hunde.

```practica
elige :: Te bloqueas en medio de la prueba. ¿Qué es lo mejor? :: Quedarte callado hasta que se te ocurra :: Razonar en voz alta ("estoy pensando si un Map ayuda") y, si hace falta, pedir una pista :: Rendirte
vf :: Si no sabes algo, conviene inventar que sí para no quedar mal
elige :: El entrevistador corrige algo de tu solución. ¿Qué haces? :: Defiendes que tú tienes razón :: "Buen punto, lo ajusto" y lo corriges :: Te ofendes
```

## Para la entrevista

> 🎤 **Tu resumen para la prueba técnica, en una frase:** "Entiendo y repito el problema, doy ejemplos con un caso borde, digo la forma simple y la mejoro pensando en el costo, escribo hablando lo que hago, y pruebo al final. Si me trabo, razono en voz alta; si me corrigen, lo tomo; y si no sé algo, lo digo y cuento cómo lo buscaría."

> 🎉 **¡Terminaste el curso "Lo que piden en el trabajo"!** Ya tienes lo que de verdad evalúan: medir el costo (Big-O), pedirle datos a una base (SQL), encontrar errores con el depurador, trabajar en equipo con Git y PRs, leer documentación, y resolver un problema en vivo pensando en voz alta. Puedes practicar la entrevista aplicando estos pasos a un problema nuevo y explicando una decisión técnica de uno de tus proyectos (Tema 117).

> 🌎 **En la vida real:** la prueba técnica no es una trampa para ver si fallas; es una conversación para ver cómo sería trabajar contigo. Si piensas en voz alta, con calma y honestidad, ya ganaste la mitad.
