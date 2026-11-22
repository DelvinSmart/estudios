# Algoritmos y Big-O: pensar el costo

> 🌎 **En la vida real:** buscar un contacto en el teléfono es instantáneo; buscarlo hojeando una libreta de papel, página por página, tarda más cuanto más gruesa sea. El mismo trabajo, pero uno **crece** con el tamaño y el otro no. Medir ese "cómo crece" es de lo que más preguntan en una entrevista.

> 🎙️ **El profesor dice:** {{alumno}}, en una entrevista técnica no basta con que tu código funcione: preguntan **cuánto cuesta** cuando los datos crecen. No es matemática difícil: es saber si tu solución aguanta 10 datos o 10 millones. Esta clase te da el vocabulario (Big-O) sin fórmulas raras, y cómo elegir la estructura correcta para que algo lento se vuelva instantáneo.

## Parte 1. ¿Qué es un algoritmo y por qué se mide?

> 🌎 **En la vida real:** una receta es un algoritmo: pasos para lograr algo. Dos recetas pueden dar el mismo pastel, pero una tarda 20 minutos y la otra 2 horas. En programación pasa igual: dos soluciones correctas, una rápida y otra lenta.

Un **algoritmo** es una serie de pasos para resolver un problema. Lo mismo se puede resolver de muchas formas, y no todas cuestan igual. El "costo" que importa casi siempre es el **tiempo**: cuántos pasos hace según cuántos datos recibe.

La clave es **cómo crece** ese costo cuando los datos crecen:

- Si tienes **10** datos, casi todo es rápido.
- Si tienes **10 millones**, la diferencia entre una solución y otra puede ser **instantáneo vs. minutos** (o el programa que se cuelga).

Usamos **Big-O** para describir cómo crece un costo al aumentar los datos. La letra `n` representa el tamaño de la entrada. Si revisas una lista de 100 gastos, `n` vale 100. Si la duplicas, puedes preguntarte cuánto crecen el trabajo y la memoria que usa tu solución.

> 💡 **Idea:** Big-O no dice cuánto tarda; dice **cómo empeora** cuando hay más datos. Es la pregunta "¿esto aguanta si la app crece?".

```practica
elige :: ¿Qué mide Big-O? :: Los segundos exactos que tarda un programa :: Cómo crece el número de pasos cuando crecen los datos :: Cuánta memoria RAM tiene tu computadora
vf :: Dos soluciones que dan el mismo resultado correcto siempre cuestan lo mismo
```

## Parte 2. Big-O sin matemáticas: los cuatro que vas a usar

> 🌎 **En la vida real:** piensa en encontrar a alguien en un edificio.

| Big-O | Nombre | La idea | Ejemplo de la vida real |
|---|---|---|---|
| **O(1)** | constante | Siempre el mismo trabajo, da igual el tamaño | Preguntarle al portero el piso de alguien: una pregunta, siempre |
| **O(log n)** | logarítmico | Cada paso **descarta la mitad** | Buscar una palabra en el diccionario abriéndolo por la mitad |
| **O(n)** | lineal | Un paso por cada dato | Tocar puerta por puerta en un piso hasta encontrar a la persona |
| **O(n²)** | cuadrático | Por cada dato, recorres **todos** otra vez | Que cada persona del edificio salude a todas las demás |

> 🌎 **Otro ejemplo (el diccionario):** si el diccionario tiene 1.000 páginas, buscar por mitades (`O(log n)`) llega en unas **10** aperturas; hoja por hoja (`O(n)`), hasta **1.000**. Cuantas más páginas, más brutal es la diferencia.

**La regla para leer tu código:**

- ¿Un bucle que recorre los datos una vez? → **O(n)**.
- ¿Un bucle **dentro** de otro, los dos sobre los datos? → **O(n²)**. ⚠️ Es la señal de alarma más común.
- ¿Solo consultas una posición conocida de un array? En este modelo, ese acceso es **O(1)**.
- ¿Reduces a la mitad lo que queda en cada paso? Eso da **O(log n)**. En una búsqueda binaria, esto funciona porque los datos están ordenados.
- Cuenta también el trabajo que hace cada llamada. Un solo bucle que llama a `includes` sobre una lista de tamaño `n` en cada vuelta puede acabar haciendo trabajo **O(n²)**.

> 📌 **Nota:** empieza analizando el **peor caso**, salvo que la pregunta pida el promedio u otro caso. Big-O describe el crecimiento. Puedes medir tiempos después para conocer el efecto real en la app.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿Cuánto cuesta este código?
lenguaje: js
pide: Completa `costoDe(codigo)`, que recibe el nombre de un patrón y devuelve su Big-O. Reglas: `'un bucle'` → `'O(n)'`; `'dos bucles anidados'` → `'O(n²)'`; `'partir a la mitad'` → `'O(log n)'`; `'acceso directo'` → `'O(1)'`.
--- código
function costoDe(codigo) {
  // tu código aquí
}
--- pruebas
prueba('un bucle recorre los datos', () => igual(costoDe('un bucle'), 'O(n)'));
prueba('bucle dentro de bucle', () => igual(costoDe('dos bucles anidados'), 'O(n²)'));
prueba('descartar la mitad', () => igual(costoDe('partir a la mitad'), 'O(log n)'));
prueba('ir directo', () => igual(costoDe('acceso directo'), 'O(1)'));
--- solución
function costoDe(codigo) {
  const tabla = {
    'un bucle': 'O(n)',
    'dos bucles anidados': 'O(n²)',
    'partir a la mitad': 'O(log n)',
    'acceso directo': 'O(1)',
  };
  return tabla[codigo];
}
```

```practica
elige :: Ves un bucle dentro de otro, los dos recorriendo la misma lista. ¿Qué Big-O es, y qué deberías pensar? :: O(n), está bien :: O(n²): es la alarma más común; a ver si se puede evitar con un mapa o un set :: O(1), es instantáneo
vf :: O(log n) (partir por la mitad cada vez) es de lo más rápido que hay para buscar
escribe :: Explica con el ejemplo del diccionario la diferencia entre O(n) y O(log n). :: O(n) es buscar una palabra hoja por hoja: con 1.000 páginas, hasta 1.000 pasos. O(log n) es abrir por la mitad y descartar la mitad cada vez: unas 10 aperturas. Cuantas más páginas, más gana el de las mitades.
```

## Parte 3. La estructura correcta: de O(n) a O(1)

> 🌎 **En la vida real:** para saber si alguien ya entró a una fiesta, el portero puede (a) recorrer la lista de invitados nombre por nombre cada vez (`O(n)`), o (b) marcar a cada uno en una tabla al entrar y solo **mirar la marca** (`O(1)`). La segunda es instantánea por más gente que haya.

Elegir una estructura de datos cambia cuánto cuesta cada operación. En la tabla, los costos de consulta de `Set` y `Map` son los que se suelen usar en el análisis promedio de entrevista. Crear la estructura también requiere recorrer y guardar los datos.

| Quiero… | Estructura lenta | Estructura rápida | De… a… |
|---|---|---|---|
| Saber si **ya vi** un valor | Buscar en un **array** (`includes`) | Un **Set** (`has`) | O(n) → O(1) |
| Buscar un dato **por su id** | Recorrer un **array** | Un **Map** u objeto (`mapa[id]`) | O(n) → O(1) |
| Contar cuántas veces aparece cada cosa | Dos bucles | Un **Map** de conteo, en un solo bucle | O(n²) → O(n) |

> 💡 **Idea clave de entrevista:** cuando veas que recorres una lista **dentro** de otro bucle para "buscar si está" o "buscar por id", casi siempre un **Set** o un **Map** lo convierte en una sola pasada. Eso es pasar de O(n²) a O(n).

Un caso clásico: **"¿hay algún repetido en esta lista?"**. La forma lenta compara cada elemento con todos los demás (O(n²)). La rápida usa un **Set**, una colección de valores únicos (Tema 38). `new Set()` empieza vacío. `.has(valor)` comprueba si ya guardaste ese valor y `.add(valor)` lo registra. En `[4, 7, 4]`, el primer `4` se registra. Cuando llega el último `4`, ya está en el conjunto.

En el análisis habitual, suponemos que consultar o agregar al `Set` cuesta O(1) en promedio. El recorrido completo cuesta O(n) y puede guardar hasta n valores distintos, así que usa O(n) de memoria adicional.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: ¿Hay repetidos? (de O(n²) a O(n))
lenguaje: js
pide: Completa `hayRepetidos(lista)` para que devuelva `true` si algún valor se repite. Hazlo en **una sola pasada** con un `Set`: por cada valor, si ya está en el set, hay repetido; si no, agrégalo. Nada de un bucle dentro de otro.
--- código
function hayRepetidos(lista) {
  // usa un Set
}
--- pruebas
prueba('sin repetidos', () => igual(hayRepetidos([1, 2, 3, 4]), false));
prueba('con un repetido', () => igual(hayRepetidos([1, 2, 3, 2]), true));
prueba('vacía', () => igual(hayRepetidos([]), false));
prueba('textos', () => igual(hayRepetidos(['ana', 'beto', 'ana']), true));
--- solución
function hayRepetidos(lista) {
  const vistos = new Set();
  for (const valor of lista) {
    if (vistos.has(valor)) return true;
    vistos.add(valor);
  }
  return false;
}
```

```practica
elige :: Para preguntar muchas veces "¿ya vi este valor?", ¿qué conviene? :: Un array y usar includes cada vez :: Un Set y usar has: es O(1), instantáneo :: Dos bucles anidados
elige :: Tienes un bucle dentro de otro para buscar, por su id, el nombre de cada usuario. ¿Cómo lo bajas a O(n)? :: Lo dejas igual :: Armas primero un Map de id→nombre y luego buscas con mapa[id], que es O(1) :: Usas más bucles
escribe :: ¿Por qué un Set o un Map suele convertir un O(n²) en un O(n)? :: Porque la parte lenta era "buscar si algo está" recorriendo la lista dentro de otro bucle. Con un Set o un Map, esa búsqueda es O(1), así que queda una sola pasada: O(n).
```

## Parte 4. Resolver un problema en vivo (pensar en voz alta)

> 🌎 **En la vida real:** en la prueba técnica no buscan al que escupe la respuesta perfecta de memoria. Buscan ver **cómo piensas**: cómo entiendes el problema, cómo pruebas, cómo mejoras. Es como un examen donde la mitad de la nota es el procedimiento.

Cuando te dan un problema en vivo, **no empieces a programar de una**. Sigue estos pasos, en voz alta:

1. **Entiende y repite el problema** con tus palabras. Pregunta lo que no esté claro ("¿la lista puede estar vacía? ¿puede haber negativos?").
2. **Da un par de ejemplos** a mano, incluido un **caso borde** (lista vacía, un solo elemento).
3. **Di la forma bruta primero** ("lo más simple sería dos bucles, O(n²)"). Tener **algo** vale más que un silencio buscando lo perfecto.
4. **Mejora:** "¿puedo evitar el bucle anidado con un Set o un Map?".
5. **Escribe**, hablando lo que haces.
6. **Pruébalo** con tus ejemplos, sobre todo el caso borde.

> 💡 **Idea:** decir "la forma simple es O(n²), pero puedo mejorarla con un Set a O(n)" tú solo, sin que te lo pidan, es exactamente lo que quieren oír. Muestra que piensas en el costo.

> 🎙️ **El profesor dice:** si te bloqueas, **habla**: "estoy pensando si un Map ayudaría aquí". El silencio asusta al entrevistador; el razonamiento en voz alta, aunque dudes, lo tranquiliza.

```practica
elige :: Te dan un problema en una prueba técnica en vivo. ¿Qué haces primero? :: Empiezas a escribir código enseguida :: Repites el problema con tus palabras y preguntas las dudas (¿vacío?, ¿negativos?) :: Pides la respuesta
vf :: Si solo se te ocurre la forma bruta (O(n²)), mejor quedarte callado hasta encontrar la óptima
escribe :: Enumera los pasos para resolver un problema en vivo en una entrevista. :: Entender y repetir el problema; dar ejemplos con un caso borde; decir la forma bruta; mejorarla (¿Set o Map?); escribir hablando; y probar con los ejemplos, sobre todo el borde.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cuál es la complejidad de tu solución?":** "Esta recorre la lista una vez, así que es O(n). Si en vez de un Set usara includes en un array dentro del bucle, sería O(n²), porque includes puede recorrer los datos vistos en cada vuelta. Con el supuesto de que buscar y agregar al Set cuesta O(1) en promedio, el recorrido completo es O(n) y usa O(n) de memoria adicional." (Nombrar el costo y por qué elegiste la estructura es lo que buscan.)

> 🎤 **Si te preguntan "¿qué estructura usarías para X?":** piensa qué operación harás **muchas veces**: si es "¿está?", un Set; si es "dame el de este id", un Map; si es recorrer en orden, un array. La estructura correcta suele ser la diferencia entre O(n²) y O(n).

> 🌎 **En la vida real:** saber Big-O es como saber leer una etiqueta nutricional: no te hace chef, pero sabes de un vistazo si algo te va a caer mal (si tu código se va a colgar con muchos datos).
