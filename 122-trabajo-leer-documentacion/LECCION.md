# Leer documentación: encontrar lo que necesitas

> 🌎 **En la vida real:** nadie se aprende de memoria el manual entero de un auto. Pero un buen conductor sabe **dónde buscar** cuando se prende una luz rara en el tablero. Programar es igual: no se trata de saberlo todo, sino de encontrar rápido lo que necesitas.

> 🎙️ **El profesor dice:** {{alumno}}, un secreto que sorprende: los programadores con experiencia **buscan todo el tiempo**. No es que no sepan; es que nadie recuerda cada detalle de cada función. La habilidad real es **leer documentación** y encontrar la respuesta en un minuto. Hoy aprendes a hacerlo bien, que es lo que de verdad te hace autónomo en un trabajo.

## Parte 1. No se trata de memorizar

> 🌎 **En la vida real:** un chef no memoriza las 500 recetas del libro. Sabe cocinar y sabe **leer una receta nueva** y seguirla. Un programador igual: entiende los conceptos y sabe buscar lo específico.

La **documentación** (la "doc") es el manual oficial de un lenguaje, una librería o una herramienta: qué hace cada función, qué recibe, qué devuelve y ejemplos de uso.

Dos verdades que te quitan un peso de encima:

1. **Nadie memoriza las funciones.** Buscar "cómo ordenar una lista en JavaScript" no es de principiante: es lo normal. Lo de principiante es **copiar sin entender**.
2. **La doc oficial es la fuente de verdad.** Antes que un video o un foro, está el manual del que hizo la herramienta. Ahí está lo correcto y lo actual.

> 💡 **Idea:** tu valor no es cuántas funciones te sabes de memoria, sino qué tan rápido entiendes algo nuevo leyéndolo. Eso **mejora con la práctica**, como todo.

```practica
vf :: Un buen programador se sabe de memoria todas las funciones y nunca busca nada
elige :: ¿Cuál es la mejor fuente para saber qué hace una función de una librería? :: Un video cualquiera :: La documentación oficial de esa librería (el manual de quien la hizo) :: Adivinar
```

## Parte 2. Cómo se lee la ficha de una función

> 🌎 **En la vida real:** es como la etiqueta de un medicamento: para qué sirve, la dosis (qué le das) y qué efecto hace (qué devuelve). No lees toda la caja; lees esos tres datos.

Casi toda doc de una función tiene lo mismo. Mira este ejemplo (el método `slice` de las listas):

```text
array.slice(inicio, fin)
  inicio  – desde qué posición empieza (incluida). Empieza en 0.
  fin     – hasta qué posición (NO incluida). Si no lo pones, hasta el final.
  Devuelve: una lista NUEVA con esos elementos. No cambia la original.
  Ejemplo: [10, 20, 30, 40].slice(1, 3)  →  [20, 30]
```

Lo que tienes que sacar, en orden:

1. **Qué recibe** (los parámetros) y en qué orden. ¿Cuáles son obligatorios y cuáles opcionales?
2. **Qué devuelve.** ¿Un valor nuevo o cambia el original? (Confundir esto es un bug clásico.)
3. **El ejemplo.** Casi siempre, el ejemplo te lo deja claro más rápido que el texto.
4. **Los casos borde.** ¿Qué pasa si le das algo vacío, o un número negativo?

> ⚠️ **Cuidado con una trampa común:** algunas funciones **devuelven algo nuevo** (como `slice`, `map`, `filter`) y otras **cambian el original** (como `sort`, `push`). Leer bien esto te ahorra bugs raros.

✍️ **Ahora escribes tú:** usa una función leyendo solo su ficha.

```ejercicio
titulo: Usar una función leyendo su ficha
lenguaje: js
pide: Según la ficha, `array.slice(inicio, fin)` devuelve una lista nueva desde `inicio` (incluido) hasta `fin` (NO incluido), sin cambiar la original. Completa `segundoYTercero(lista)` para que devuelva el segundo y el tercer elemento (posiciones 1 y 2) usando `slice`.
--- código
function segundoYTercero(lista) {
  // recuerda: las posiciones empiezan en 0, y fin NO se incluye
}
--- pruebas
prueba('toma el 2º y 3º', () => igual(segundoYTercero([10, 20, 30, 40]), [20, 30]));
prueba('con textos', () => igual(segundoYTercero(['a', 'b', 'c', 'd']), ['b', 'c']));
prueba('no cambia la original', () => { const l = [1, 2, 3, 4]; segundoYTercero(l); igual(l, [1, 2, 3, 4]); });
--- solución
function segundoYTercero(lista) {
  return lista.slice(1, 3);
}
```

```practica
elige :: En la ficha de una función, ¿qué es lo primero que conviene mirar? :: El nombre del autor :: Qué recibe (parámetros) y qué devuelve :: El color de la página
elige :: slice devuelve una lista nueva y no cambia la original; sort ordena la original. ¿Por qué importa esa diferencia? :: No importa :: Porque confundir "devuelve algo nuevo" con "cambia el original" causa bugs raros :: Porque slice es más rápida
escribe :: ¿Qué cuatro cosas sacas al leer la ficha de una función? :: Qué recibe (parámetros y cuáles son opcionales), qué devuelve (si es algo nuevo o cambia el original), el ejemplo, y los casos borde (qué pasa con vacío o valores raros).
```

## Parte 3. Dónde y cómo buscar

> 🌎 **En la vida real:** buscar bien es como preguntar bien en una ferretería: si dices "quiero un tornillo" das vueltas; si dices "un tornillo de 4 mm para madera", te lo dan al toque. Con la doc igual: la pregunta exacta trae la respuesta exacta.

**Dónde buscar** (de más confiable a menos):

| Fuente | Para qué |
|---|---|
| **La doc oficial** | La verdad de una librería o del lenguaje. Para la web y JavaScript, **MDN** es la referencia. |
| **El README del proyecto** | Cómo instalar y usar **ese** proyecto en concreto (clase 06). Es lo primero que se lee al abrir un repositorio. |
| **Un foro como Stack Overflow** | Para un error concreto que le pasó a otros. Útil, pero verifica que la respuesta sea actual y la entiendas. |

**Cómo buscar bien:**

- **Pega el mensaje de error tal cual** (sin tus datos privados). Muchas veces alguien ya lo tuvo.
- **Di la tecnología:** "ordenar lista **en JavaScript**", no solo "ordenar lista".
- **Busca en inglés** si no encuentras: casi toda la doc y las respuestas están en inglés. No hace falta hablarlo: las palabras clave (`sort array javascript`) alcanzan.

> ⚠️ **Lo más importante:** **nunca copies código que no entiendes.** Si no sabes qué hace cada línea, no lo pegues: te va a traer un bug que no sabrás arreglar, y en una entrevista te preguntan "¿y esto qué hace?". Entiéndelo primero.

```practica
elige :: Te sale un error raro. ¿Qué es lo más efectivo para buscar la solución? :: Escribir "no funciona ayuda" :: Pegar el mensaje de error tal cual (sin datos privados) y la tecnología :: Borrar el proyecto
vf :: Conviene buscar en inglés aunque no lo hables bien, porque casi toda la doc está ahí
elige :: Encontraste en un foro un código que resuelve tu problema pero no entiendes. ¿Qué haces? :: Lo pego y sigo :: Lo entiendo línea por línea antes de usarlo (o no lo uso) :: Lo pego y rezo
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué haces cuando no sabes cómo hacer algo?":** "Lo busco, sin vergüenza: todos lo hacemos. Voy primero a la documentación oficial, leo qué recibe y qué devuelve la función y el ejemplo, y pruebo con un caso chico. Si es un error, pego el mensaje exacto. Y nunca copio algo que no entiendo: lo leo línea por línea primero, para poder mantenerlo y explicarlo después."

> 🎤 **Si te dan acceso a internet en la prueba técnica:** úsalo con naturalidad para consultar una función puntual; eso es normal y bien visto. Lo que NO se ve bien es pegar bloques enteros sin entenderlos ni poder explicarlos.

> 🌎 **En la vida real:** saber leer documentación es como saber usar un diccionario y un mapa en un país nuevo: no te sabes el idioma entero ni las calles, pero no te pierdes, porque sabes buscar.
