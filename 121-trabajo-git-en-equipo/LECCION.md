# Git en equipo: conflictos y revisar un PR

> 🌎 **En la vida real:** si cinco personas editan el mismo documento de Google a la vez, se pisan. Por eso en un equipo cada quien trabaja en su **copia** (una rama), y antes de juntarla con la de todos, alguien la **revisa**. Git es eso, pero para código, y con reglas.

> 🎙️ **El profesor dice:** {{alumno}}, en la clase 06 aprendiste Git para ti solo. En un trabajo es distinto: nadie sube directo a `main`, todo pasa por una **rama** y un **pull request** que otro revisa. Hoy ves lo que de verdad usarás en equipo: resolver un **conflicto** (asusta, pero es simple) y **revisar un PR** sin quedar mal.

## Parte 1. En equipo nadie toca `main` directo

> 🌎 **En la vida real:** en un restaurante, el cocinero nuevo no sirve su plato directo al cliente; primero lo prueba el jefe de cocina. En código, `main` es lo que llega al cliente, y el jefe de cocina es la **revisión del PR**.

En un equipo que usa ramas y revisión por PR, el cambio suele seguir este camino:

1. **Creas una rama** para tu tarea: `git switch -c arreglo-login` (clase 06).
2. Haces tus **commits** ahí, sin tocar `main`.
3. **Subes la rama** y abres un **Pull Request (PR):** una propuesta de unir tu rama con `main`, para que alguien la revise.
4. El **CI** corre las pruebas solas sobre tu PR (clase 04). Si están en rojo, se arregla antes de seguir.
5. Un compañero **revisa** el PR, comenta, y cuando está bien, lo **aprueba**.
6. Se **une** (merge) a `main`. Tu cambio ya es parte de lo de todos.

> 💡 **Idea:** la regla de oro del equipo es **mantener `main` siempre verde** (que funcione y pase las pruebas), porque de ahí sale lo que usan las personas. Por eso el PR y el CI: son el filtro antes de `main`.

> 📌 **Nota:** `main` suele estar **protegida**: no se puede subir directo, solo por PR aprobado y con el CI en verde. Es una regla del repositorio, no algo que recuerdas tú.

```practica
elige :: En un equipo, ¿cómo llega tu cambio a main? :: Subiéndolo directo a main :: Por una rama y un Pull Request que alguien revisa y aprueba, con el CI en verde :: Mandándolo por correo
vf :: La regla de oro del trabajo en equipo con Git es mantener main siempre funcionando (verde)
escribe :: Describe el flujo de un cambio en equipo, de la rama a main. :: Creo una rama para mi tarea, hago mis commits, subo la rama y abro un PR; el CI corre las pruebas; un compañero lo revisa y comenta; cuando está bien y en verde, se aprueba y se une (merge) a main.
```

## Parte 2. El conflicto de merge: no asusta

> 🌎 **En la vida real:** tú y un compañero editaron **la misma frase** del mismo documento, cada uno a su manera. Al juntar, el sistema no sabe cuál vale, así que te muestra las dos y te pregunta a ti. Eso es un conflicto.

Un **conflicto** aparece cuando Git encuentra cambios que no puede combinar por su cuenta. Por ejemplo, dos ramas editaron el mismo saludo de formas distintas. No es un error ni rompiste nada: Git te pide que **elijas**. Lo verás así en el archivo:

```text
<<<<<<< HEAD
const saludo = "Hola";        (lo que hay en TU rama)
=======
const saludo = "Buenas";      (lo que viene de la otra rama)
>>>>>>> main
```

Para resolverlo:

1. Abres el archivo y buscas esas marcas (`<<<<<<<`, `=======`, `>>>>>>>`).
2. Decides qué debe quedar: lo tuyo, lo de ellos, o una **mezcla** de los dos.
3. **Borras las tres marcas** y dejas solo el código final correcto.
4. Guarda el archivo y revisa el resultado. Ejecuta `git add` sobre ese archivo para registrar que quedó resuelto. Consulta `git status` y sigue lo que indique para terminar la integración.

En el ejercicio vas a recibir las dos versiones ya separadas. Las marcas del ejemplo son separadores que Git puso en el archivo. Tu función devuelve el contenido elegido según la regla de la práctica.

> ⚠️ **El error más común:** dejar una marca (`=======` o `>>>>>>>`) olvidada en el código. Eso no compila. Revisa que **no quede ninguna** antes de guardar. (El CI suele atraparlo, pero mejor tú.)

> 💡 **Idea:** un conflicto se resuelve **entendiendo las dos partes**, no borrando la del otro al azar. Si no estás seguro de qué debía quedar, pregúntale a quien hizo el otro cambio.

✍️ **Ahora escribes tú:** resolver un conflicto, elegido por una regla.

```ejercicio
titulo: Resolver un conflicto
lenguaje: js
pide: `resolver(mio, suyo, quien)` recibe las dos versiones de una línea y a quién conservar. Si `quien` es `'mio'`, devuelve `mio`; si es `'suyo'`, devuelve `suyo`; si es `'mezcla'`, devuelve `mio + ' ' + suyo`. Lo importante: el resultado **nunca** debe contener las marcas `<<<<<<<`, `=======` ni `>>>>>>>`.
--- código
function resolver(mio, suyo, quien) {
  // tu código aquí
}
--- pruebas
prueba('conservar lo mío', () => igual(resolver('Hola', 'Buenas', 'mio'), 'Hola'));
prueba('conservar lo suyo', () => igual(resolver('Hola', 'Buenas', 'suyo'), 'Buenas'));
prueba('mezclar los dos', () => igual(resolver('Hola', 'Buenas', 'mezcla'), 'Hola Buenas'));
prueba('nunca deja marcas de conflicto', () => ok(!resolver('a', 'b', 'mio').includes('<<<') && !resolver('a', 'b', 'suyo').includes('===')));
--- solución
function resolver(mio, suyo, quien) {
  if (quien === 'mio') return mio;
  if (quien === 'suyo') return suyo;
  return mio + ' ' + suyo;
}
```

```practica
elige :: ¿Qué es un conflicto de merge? :: Un error grave que rompió el proyecto :: Que dos ramas cambiaron las mismas líneas y Git te pide elegir qué queda :: Un virus
elige :: ¿Cuál es el error más común al resolver un conflicto? :: Guardar el archivo :: Dejar olvidada una marca (=======  o  >>>>>>>) en el código :: Usar una rama
escribe :: Te sale un conflicto en una línea. ¿Qué haces, paso a paso? :: Abro el archivo, busco las marcas <<<<<<< ======= >>>>>>>, decido qué debe quedar (lo mío, lo suyo o una mezcla), borro las tres marcas dejando solo el código correcto, guardo, hago git add y termino con un commit. Si dudo, le pregunto a quien hizo el otro cambio.
```

## Parte 3. Revisar un PR (code review)

> 🌎 **En la vida real:** revisar un PR es como leer el trabajo de un compañero antes de entregarlo juntos. No es para lucirte ni humillarlo: es para que el equipo entregue algo bueno, y de paso los dos aprenden.

Cuando te toca **revisar** el PR de otro (o te revisan el tuyo), esto es lo que se mira, más o menos en orden:

| Qué | Pregunta |
|---|---|
| **¿Hace lo que dice?** | ¿El cambio resuelve lo que el PR promete, sin hacer de más? |
| **¿Se entiende?** | ¿Los nombres y la estructura son claros? ¿Yo podría mantener esto en 6 meses? |
| **¿Tiene pruebas?** | ¿Hay una prueba del caso nuevo y de los casos borde? |
| **¿Rompe algo?** | ¿Toca otras partes sin querer? ¿El CI está verde? |
| **Seguridad y datos** | ¿Mete datos del usuario en una consulta sin parámetros? ¿Filtra algo? (clase 23) |

**Cómo comentar sin quedar mal** (ni hacer quedar mal al otro):

- **Sobre el código, no sobre la persona:** "esta función hace dos cosas, ¿la separamos?", no "programas mal".
- **Pregunta, no ordenes:** "¿qué pasa si la lista llega vacía?" invita a pensar.
- **Marca lo que está bien,** no solo lo malo.
- **Separa lo importante de lo opcional:** di si algo **bloquea** el merge o es solo una sugerencia ("nit", de *nitpick*, un detalle menor).

> 💡 **Idea:** un buen comentario de revisión **enseña**. "Aquí un `Set` evitaría buscar en toda la lista en cada vuelta. El recorrido completo pasaría de O(n²) a O(n) en el modelo habitual" (clase 118) ayuda y demuestra que sabes, sin pelear.

```practica
elige :: Revisando un PR, ves una función con un nombre confuso. ¿Qué comentario es mejor? :: "Esto está mal, no sabes nombrar" :: "Este nombre no me dice qué hace, ¿lo cambiamos por algo como calcularTotal?" :: No decir nada
vf :: Al revisar un PR solo hay que señalar lo que está mal
elige :: ¿Qué NO deberías revisar en un PR? :: Si tiene pruebas :: Si se entiende y mantiene :: El estado de ánimo de quien lo escribió
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo trabajas con Git en equipo?":** "Cada tarea en su rama, nunca subo directo a main. Abro un Pull Request, el CI corre las pruebas, y un compañero lo revisa antes de unirlo. La idea es mantener main siempre verde. Si hay un conflicto, lo resuelvo entendiendo las dos partes y borrando las marcas; si dudo, hablo con quien hizo el otro cambio."

> 🎤 **Si te preguntan "¿qué miras al revisar un PR?":** "Que haga lo que promete sin hacer de más, que se entienda y se pueda mantener, que tenga pruebas de los casos borde, que no rompa otras partes y que el CI esté verde, y la seguridad, como consultas con parámetros. Comento sobre el código, como propuestas, y separo lo que bloquea de lo que es un detalle."

> 🌎 **En la vida real:** saber trabajar en equipo con Git y revisar un PR con buena onda pesa tanto como saber programar: nadie quiere en su equipo a alguien brillante con quien es difícil trabajar.
