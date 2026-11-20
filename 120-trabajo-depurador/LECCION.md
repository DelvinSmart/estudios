# El depurador: encontrar el error sin adivinar

> 🌎 **En la vida real:** si se va la luz en una parte de la casa, un electricista no cambia todos los cables al azar. Baja los interruptores uno por uno hasta encontrar cuál es. Depurar un programa es eso: buscar el error con **método**, no a las adivinanzas.

> 🎙️ **El profesor dice:** {{alumno}}, programar es, la mitad del tiempo, **encontrar por qué algo no funciona**. En una entrevista no esperan que nunca tengas errores; esperan que sepas **cazarlos con calma y orden**. Hoy aprendes el método y la herramienta (el depurador), que es como pausar la película y mirar cuadro por cuadro.

## Parte 1. Depurar es buscar, no adivinar

> 🌎 **En la vida real:** es como el médico. No receta al azar: pregunta los síntomas, hace una prueba, descarta causas y recién ahí dice qué es. Cambiar código "a ver si así funciona" es como tomar remedios al azar: a veces apaga el síntoma y deja la enfermedad.

**Depurar** (*debugging*) es encontrar y arreglar la causa de un error (un **bug**). La regla de oro: **no adivines, observa**. El error casi siempre está donde **crees que no está**, por eso hay que mirar los datos de verdad, no los que imaginas.

El método, en cinco pasos:

1. **Reprodúcelo.** Encuentra los pasos exactos que hacen fallar. Un bug que no puedes repetir no lo puedes arreglar con seguridad.
2. **Lee el error.** El mensaje y el *stack trace* (clase 07) dicen **dónde** y **qué**. Léelo antes que nada; muchas veces ya dice la respuesta.
3. **Aísla.** Reduce el problema: ¿falla con todos los datos o solo con algunos? ¿desde cuándo? Parte el problema por la mitad.
4. **Forma una hipótesis y compruébala.** "Creo que `valor` llega vacío." Míralo. Si era eso, bien; si no, otra hipótesis.
5. **Arregla y protege.** Corrige la causa, y escribe una **prueba** que falle con el bug y pase con el arreglo, para que no vuelva (clase 02).

> 💡 **Idea:** cada vez que arreglas un bug "a ciegas" y funciona, no aprendiste nada y puede volver. Cuando lo entiendes, lo cierras para siempre.

```practica
elige :: ¿Cuál es la regla de oro al depurar? :: Cambiar cosas hasta que funcione :: No adivinar: observar los datos reales y descartar con método :: Reiniciar la computadora
vf :: Un bug que no puedes reproducir conviene arreglarlo igual, rápido, por si acaso
escribe :: Enumera los pasos del método para encontrar un bug. :: Reproducirlo, leer el error y el stack trace, aislarlo (¿con qué datos falla, desde cuándo?), formar una hipótesis y comprobarla mirando los datos, y arreglar dejando una prueba que lo cuide.
```

## Parte 2. `console.log`: el primer depurador (y su límite)

> 🌎 **En la vida real:** es como poner carteles en el camino de un paquete: "pasé por aquí", "aquí valía 150". Sirve para ver por dónde va y con qué valores, sin herramientas especiales.

Lo más rápido y que siempre tienes: imprimir valores para ver qué pasa de verdad.

```js
function promedio(valores) {
  console.log('entran:', valores);          // ¿qué llegó?
  const suma = valores.reduce((a, b) => a + b, 0);
  console.log('suma:', suma, 'cuántos:', valores.length);
  return suma / valores.length;
}
```

Trucos útiles:

- **Pon una etiqueta** a cada log (`'suma:'`), o no sabrás cuál es cuál.
- `console.table(lista)` muestra una lista de objetos como tabla.
- Imprime **antes y después** del punto que sospechas, para ver dónde cambió lo que esperabas.

> ⚠️ **Límite:** si tienes que imprimir diez cosas y volver a correr una y otra vez, pierdes tiempo. Ahí conviene el **depurador** de verdad, que te deja **pausar** y mirar **todo** a la vez. Y acuérdate de borrar los `console.log` antes de subir (un **linter** o la revisión del PR suelen avisarte).

```practica
elige :: ¿Cuándo conviene pasar de console.log al depurador? :: Nunca, console.log alcanza siempre :: Cuando tienes que imprimir muchas cosas y volver a correr una y otra vez :: Solo en Python
vf :: Conviene dejar los console.log en el código que subes a producción
```

## Parte 3. El depurador: pausar la película

> 🌎 **En la vida real:** ver un gol en cámara lenta, cuadro por cuadro, para ver exactamente dónde estaba cada jugador. El depurador hace eso con tu programa: lo **congela** en un punto y te deja mirar todo.

Un **depurador** está en el navegador (las *DevTools*, pestaña *Sources*) y en el editor (VS Code). Sus piezas:

| Pieza | Qué es |
|---|---|
| **Breakpoint** (punto de parada) | Marcas una línea y el programa **se detiene** justo ahí. Se pone haciendo clic al lado del número de línea. |
| **Ver las variables** | Con el programa pausado, ves **cuánto vale cada cosa** en ese momento. Sin imaginar: el valor real. |
| **Step over** (pasar por encima) | Ejecuta la línea actual y para en la siguiente. |
| **Step into** (entrar) | Si la línea llama a una función, **entra** a verla por dentro. |
| **Continuar** | Sigue hasta el próximo breakpoint. |
| **La pila de llamadas** (*call stack*) | Qué función llamó a cuál para llegar hasta aquí. |

> 💡 **Idea:** el superpoder del depurador es **ver el valor real** de las variables en el momento exacto. La mayoría de los bugs son "yo creía que esto valía X y valía Y". El depurador te lo muestra sin que tengas que adivinar.

> 📌 **Nota:** también puedes escribir `debugger;` en una línea del código: cuando las DevTools están abiertas, el programa se detiene ahí, como un breakpoint.

```practica
elige :: ¿Qué es un breakpoint? :: Un error del programa :: Una marca en una línea que hace que el programa se detenga ahí para poder mirar las variables :: Un tipo de prueba
elige :: Estás pausado en un breakpoint y la línea llama a otra función que sospechas. ¿Qué usas? :: Continuar :: Step into (entrar), para verla por dentro :: Borrar la línea
escribe :: ¿Cuál es el superpoder del depurador frente a imaginar qué pasa? :: Que te muestra el valor REAL de cada variable en el momento exacto en que el programa está pausado, así no adivinas: la mayoría de los bugs son "creía que valía X y valía Y".
```

## Parte 4. Practica: caza el bug

> 🎙️ **El profesor dice:** aquí tienes una función con un error de verdad, de los que pasan todo el tiempo. No la reescribas entera: **léela, forma una hipótesis** (¿qué valor no es el que crees?) y arregla la causa. Las pruebas te dicen qué esperaba.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**.

```ejercicio
titulo: El promedio que falla con la lista vacía
lenguaje: js
pide: `promedio(valores)` debe devolver el promedio, pero con una lista **vacía** da `NaN` (no un número) en vez de `0`. Encuentra por qué (pista: dividir entre la cantidad, y la cantidad es 0) y arréglalo para que una lista vacía devuelva `0`.
--- código
function promedio(valores) {
  const suma = valores.reduce((a, b) => a + b, 0);
  return suma / valores.length;
}
--- pruebas
prueba('promedio normal', () => igual(promedio([2, 4, 6]), 4));
prueba('un solo valor', () => igual(promedio([10]), 10));
prueba('lista vacía da 0, no NaN', () => igual(promedio([]), 0));
--- solución
function promedio(valores) {
  if (valores.length === 0) return 0;
  const suma = valores.reduce((a, b) => a + b, 0);
  return suma / valores.length;
}
```

```ejercicio
titulo: El descuento al revés
lenguaje: js
pide: `conDescuento(precio, porciento)` debe restar el descuento, pero devuelve el precio AUMENTADO. Léelo, encuentra el error (una resta que es suma, o el porcentaje mal) y arréglalo. Ejemplo: 100 con 20 % → 80.
--- código
function conDescuento(precio, porciento) {
  return precio + (precio * porciento) / 100;
}
--- pruebas
prueba('100 con 20% da 80', () => igual(conDescuento(100, 20), 80));
prueba('50 con 10% da 45', () => igual(conDescuento(50, 10), 45));
prueba('sin descuento no cambia', () => igual(conDescuento(100, 0), 100));
--- solución
function conDescuento(precio, porciento) {
  return precio - (precio * porciento) / 100;
}
```

```practica
vf :: Para arreglar un bug conviene reescribir toda la función desde cero
escribe :: Contaste que el promedio fallaba con la lista vacía. ¿Cómo lo depuraste y arreglaste? :: Reproduje el fallo con una lista vacía, vi que daba NaN; la hipótesis fue que dividía entre la cantidad y la cantidad era 0 (dividir entre 0 da NaN). Lo arreglé devolviendo 0 cuando la lista está vacía, y la prueba lo cuida.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo encuentras un bug difícil?":** "Primero lo reproduzco con pasos fijos y leo el error y el stack trace. Después aíslo: miro con qué datos falla y desde qué cambio. Formo una hipótesis y la compruebo con el depurador, viendo el valor real de las variables en vez de imaginarlo, o con console.log si es rápido. Cuando encuentro la causa, la arreglo y dejo una prueba que falle con el bug y pase con el arreglo, para que no vuelva."

> 🎤 **Si te preguntan "¿console.log o depurador?":** "Los dos. console.log para algo rápido; el depurador cuando necesito pausar y ver muchas variables a la vez sin reescribir y volver a correr. Lo importante es no adivinar: mirar los datos de verdad."

> 🌎 **En la vida real:** depurar bien es como ser un buen detective: no acusas al primero que pasa; sigues las pistas, descartas y llegas a la causa. Esa calma es lo que se nota en una entrevista.
