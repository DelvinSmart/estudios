# Programar desde cero

> 🌎 **En la vida real:** programar es como escribir la receta de un robot cocinero. El robot no sabe nada y no adivina: hace **exactamente** lo que le escribes, en el orden que se lo escribes. Si olvidas decirle "prende la estufa", no la prende. Programar es aprender a dar esas instrucciones tan claras que una máquina, que no piensa, haga lo que tú quieres.

> 🎙️ **El profesor dice:** {{alumno}}, esta es la **primera** clase, antes que cualquier otra. No vas a instalar nada ni a tener miedo a nada. Solo vamos a entender qué es esto de programar, las pocas palabras que hay que saber para empezar, y cómo usar este curso para que de verdad aprendas. Si algo suena raro, está bien: aquí nada se da por sabido.

## Parte 1. ¿Qué es programar, de verdad?

> 🌎 **En la vida real:** imagina que le explicas a alguien, por teléfono, cómo hacer un sándwich, pero esa persona **nunca vio comida** y hace todo al pie de la letra. Si dices "pon el jamón", lo pone sobre la mesa, no sobre el pan, porque no lo dijiste. Esa persona es la computadora.

> 🌎 **Otro ejemplo:** es como las instrucciones de un mueble para armar: paso 1, paso 2, paso 3. Si cambias el orden, el mueble queda mal.

**Programar es escribir instrucciones para que una máquina las siga.** Nada más, y nada menos. La máquina es rapidísima y nunca se cansa, pero es **tonta**: hace lo que dice la instrucción, aunque sea un error. Por eso programar no es ser un genio de las matemáticas: es aprender a **pensar en pasos** y a ser **ordenado y claro**.

Tres ideas para toda la vida:

- La máquina hace **exactamente** lo que le dices, no lo que **querías** decir.
- El **orden** importa: primero esto, después aquello.
- Equivocarse es **parte normal** del trabajo, no una señal de que no sirves. Hasta el mejor programador se equivoca todos los días; lo que cambia es que aprende a encontrar y arreglar el error.

> 💡 **Idea:** si alguna vez seguiste una receta, armaste un mueble o explicaste cómo llegar a tu casa, ya pensaste "como programador". Ahora vas a aprender a escribirlo en un idioma que la máquina entiende.

### Una instrucción de verdad, palabra por palabra

Imagina que vas a echar **10 litros** de combustible y cada litro cuesta **5**. A mano harías: 10 × 5 = 50. Ahora le vas a enseñar esa misma cuenta a la máquina. Como ella no recuerda nada por su cuenta, lo primero es **guardar el precio** en un lugar con nombre.

> 🌎 **En la vida real:** es como anotar el precio en una cajita y pegarle una etiqueta que diga «precio por litro». Cuando lo necesitas, no lo vuelves a preguntar: miras la cajita con ese nombre.

Así se escribe en un lenguaje llamado JavaScript:

```js
const precioPorLitro = 5;
```

Se ve raro, pero son solo cinco piezas:

| Pieza | Qué significa |
|---|---|
| `const` | Viene de **constante**. Le dice a la máquina: «crea una cajita para guardar un dato». |
| `precioPorLitro` | La **etiqueta** de la cajita. La eliges tú. Va sin espacios para que la máquina la lea como un solo nombre. |
| `=` | **Guarda esto adentro.** Aquí no es el «igual» de matemáticas. |
| `5` | El **dato** que se guarda. |
| `;` | El **punto final** de la instrucción. |

Léelo en español: **«Crea una cajita llamada precioPorLitro y guarda un 5.»**

> 📖 **Palabra nueva: "variable".** Así se le dice a una cajita con nombre que guarda un dato.

> ⚠️ **¿Si es «constante», por qué la voy a cambiar?** Buena pregunta. Tú eres quien escribe la receta: antes de ejecutarla puedes borrar el 5 y escribir un 6. Lo que `const` impide es que el **programa**, mientras está corriendo, le cambie el valor a esa cajita.

### Las cuatro instrucciones juntas

Ahora mira el programa completo. La máquina lo lee **de arriba hacia abajo**, una línea a la vez. Lo que va después de `//` es una nota para las personas, y la máquina la ignora.

```js
const litros = 10;                       // guarda 10 en la cajita litros
const precioPorLitro = 5;                // guarda 5 en la cajita precioPorLitro
const total = litros * precioPorLitro;   // multiplica y guarda el resultado en total
console.log(total);                      // muestra lo que hay en total
```

- **Línea 1:** guarda cuántos litros vas a echar.
- **Línea 2:** guarda cuánto cuesta cada litro.
- **Línea 3:** el asterisco `*` significa **multiplicar**, porque el teclado no tiene ×. La máquina busca lo que hay en las dos cajitas, hace 10 × 5 y guarda 50 en una cajita nueva llamada `total`.
- **Línea 4:** `console.log` significa **«muestra esto en la pantalla»**. Lo que va dentro de los paréntesis es lo que se muestra. Sin esta línea, la máquina haría la cuenta, pero tú no verías el resultado.

### Ahora tú: predice, cambia y prueba

1. **Predice:** si cada litro cuesta 6, ¿cuánto pagarías por 10 litros? Piénsalo antes de tocar nada.
2. **Cambia:** en la línea 2 del recuadro de abajo, borra el `5` y escribe `6`.
3. **Prueba:** toca **▶ probar** y compara el resultado con lo que predijiste.
4. **Juega:** pon otro precio y explica por qué cambió el total. La revisión automática seguirá esperando 60 y marcará error, pero debajo verás el resultado de tu experimento.

No necesitas una cuenta para hacer los ejercicios.

```ejercicio
titulo: Calcula tu primer gasto de combustible
lenguaje: js
pide: Cambia el precio por litro a 6 y prueba tu cálculo.
pista: Busca la línea que empieza con `const precioPorLitro`. Ahí está el número que debes cambiar. La línea que multiplica los litros por el precio ya funciona.
--- código
const litros = 10;
const precioPorLitro = 5;
const total = litros * precioPorLitro;
console.log(total);
--- pruebas
prueba('10 litros a 6 dan 60', () => igual(total, 60));
--- solución
const litros = 10;
const precioPorLitro = 6;
const total = litros * precioPorLitro;
console.log(total);
```

> 🎙️ **El profesor dice:** {{alumno}}, acabas de cambiar un dato y la máquina rehízo toda la cuenta sin que se lo repitieras. Eso es programar: dejar las instrucciones bien escritas para que la máquina haga el trabajo.

## Parte 2. Las primeras palabras (sin miedo)

> 🌎 **En la vida real:** en cualquier oficio nuevo hay palabras raras al principio. En la cocina: "sofreír", "a punto de nieve". No nacen sabidas; se aprenden una vez y ya. Estas son las de aquí.

Esta es la lista mínima para empezar. No la memorices de golpe: vuelve a ella cuando la necesites. (Y recuerda: este curso tiene un **glosario** en el buscador 🔎 de arriba; escribe una palabra y te sale su definición.)

| Palabra | Qué quiere decir, fácil |
|---|---|
| **Programa** / **app** | Un conjunto de instrucciones que hace algo: WhatsApp es un programa, una calculadora es un programa. |
| **Código** | El texto que escribe el programador. Son las instrucciones, escritas en un idioma especial. |
| **Lenguaje** | El idioma en que se escribe el código. Hay muchos (JavaScript, Python, Swift…), como hay español, inglés, portugués. |
| **Ejecutar** / **correr** | Hacer que la máquina **siga** las instrucciones. "Corre el programa" = "hazlo funcionar". |
| **Bug** (se dice "bag") | Un error en el código: algo que no hace lo que debía. |
| **Variable** | Una cajita con un nombre donde se guarda un dato, como `edad = 30`. Lo verás a fondo pronto. |
| **Función** | Una instrucción con nombre que hace una tarea y la puedes volver a usar, como un botón. |

> 📖 **Palabra nueva: "sintaxis".** Es la **ortografía** de un lenguaje: dónde van los paréntesis, las comas, las comillas. Si te falta una, la máquina no entiende y marca un error. No es que seas malo: es como una tilde mal puesta, se corrige y ya.

> 🎙️ **El profesor dice:** no tienes que entender todas estas palabras ahora mismo. Con que sepas que **existen** y que puedes volver a mirarlas, es suficiente. Nadie te va a pedir que las recites.

## Parte 3. La terminal: la pantalla negra que asusta (y no muerde)

> 🌎 **En la vida real:** la terminal es como pedir en un restaurante **hablando**, en vez de señalar el menú con el dedo. Al principio da cosa, pero es solo otra forma de pedir lo mismo, muchas veces más rápida.

La **terminal** (también "consola") es esa pantalla de texto donde le escribes órdenes a la computadora, letra por letra, en vez de usar botones. Da miedo porque sale en las películas de hackers, pero es de lo más simple: escribes una orden, aprietas Enter, y la máquina te responde con texto.

Por ejemplo, en este curso vas a escribir cosas como:

```text
npm test
```

Eso quiere decir: "corre las pruebas de este proyecto". La máquina las corre y te dice si todo salió bien.

> 💡 **Idea:** no hay que aprenderse las órdenes de memoria. Se copian, se pegan y se van aprendiendo las pocas que usas seguido, como te aprendiste dos o tres comandos del control del televisor.

> ⚠️ **Lo único importante al principio:** lee lo que la terminal te responde. Cuando algo sale mal, **ahí** está la pista. No es un castigo; es la máquina ayudándote.

## Parte 4. Tu primera línea de código

> 🌎 **En la vida real:** nadie aprende a manejar leyendo sobre carros. Te subes y arrancas, despacio. Aquí igual: vas a escribir código ya, en esta misma página, sin instalar nada.

Ya leíste código y cambiaste un número. Ahora vas a escribirlo tú, en esta misma página y sin instalar nada. Primero repasamos las cajitas, después aprendes a crear una **función** y al final la escribes.

### Las cajitas con nombre: variables

> 🌎 **En la vida real:** en la cocina guardas el azúcar en un frasco con la etiqueta "azúcar". Cuando la receta dice "dos cucharadas de azúcar", no buscas por toda la cocina: vas al frasco con ese nombre.

Una **variable** es eso: una cajita con un nombre, donde guardas un dato para usarlo después.

```js
const litros = 40;
const precioPorLitro = 5;
const total = litros * precioPorLitro;   // 200
```

- `const` crea una cajita. Mientras el programa corre, su valor **no cambia**. Tú sí puedes editar el código antes de ejecutarlo.
- `litros` es el **nombre**. Lo eliges tú, y conviene que diga qué guarda.
- `=` aquí **no** es "igual" como en matemáticas: quiere decir **guardar**. "En la cajita `litros`, guarda 40".
- `*` es multiplicar (el teclado no tiene ×). `+` suma, `-` resta y `/` divide.
- Lo que va después de `//` es un **comentario**: una nota para las personas. La máquina lo ignora.

> 💡 **Idea:** si mañana el litro cuesta 6, cambias **un solo número** (`precioPorLitro`) y el total se recalcula solo. Para eso sirven los nombres.

### Las funciones: una máquina con nombre

> 🌎 **En la vida real:** una función es como una licuadora. **Le metes** fruta, **hace** su trabajo y **te devuelve** el jugo. No tienes que explicarle cómo licuar cada vez: solo la usas.

Esta función recibe un número y devuelve el doble:

```js
function doble(numero) {
  return numero * 2;
}

console.log(doble(4));   // muestra 8
```

| Pieza | Qué significa |
|---|---|
| `function` | «Voy a crear una función». |
| `doble` | El **nombre** de la función. Lo eliges tú. |
| `(numero)` | Lo que la función **recibe**, como la fruta de la licuadora. A esta cajita de entrada se le llama **parámetro**. |
| `{ }` | Entre las llaves va el **trabajo** que hace. |
| `return` | **Devuelve** este resultado a quien usó la función. Es el jugo que sale. |
| `doble(4)` | **Usa** la función y le entrega un 4. Dentro, `numero` vale 4. |

Crear la función es como comprar la licuadora: todavía no hizo nada. Trabaja cuando la **usas**, escribiendo su nombre con paréntesis.

En el próximo ejercicio vas a trabajar con **texto**. El texto va entre comillas, como `'Hola, '`, para que la máquina no lo confunda con el nombre de una cajita. El signo `+` sirve para **pegar** textos: `'Hola, ' + 'Ana'` da `'Hola, Ana'`.

Cuando toques **▶ probar**, la máquina revisa tu código y te dice si pasó.

✍️ **Ahora escribes tú:**

```ejercicio
titulo: Tu primer saludo
lenguaje: js
pide: Completa `saludar(nombre)` para que devuelva el texto `'Hola, '` seguido del nombre y un `'!'`. Por ejemplo, `saludar('Ana')` tiene que dar `'Hola, Ana!'`. Pista: para pegar textos se usa `+`.
--- código
function saludar(nombre) {
  // escribe aquí tu respuesta, por ejemplo:  return 'Hola, ' + nombre + '!';
}
--- pruebas
prueba('saluda a Ana', () => igual(saludar('Ana'), 'Hola, Ana!'));
prueba('saluda a Beto', () => igual(saludar('Beto'), 'Hola, Beto!'));
prueba('sirve con cualquier nombre', () => igual(saludar('Delvin'), 'Hola, Delvin!'));
--- solución
function saludar(nombre) {
  return 'Hola, ' + nombre + '!';
}
```

> 🎙️ **El profesor dice:** si te salió en verde, acabas de programar. Si te salió en rojo, lee el mensaje, arregla y vuelve a probar: **eso también es programar**, y es lo que hacemos todo el día.

✍️ **Ahora escribes tú:**

```ejercicio
titulo: ¿Cuánto cuesta llenar el tanque?
lenguaje: js
pide: Completa `costoDelTanque(litros, precioPorLitro)` para que devuelva cuánto cuesta cargar esos litros. Por ejemplo, 40 litros a 5 cuestan 200. Pista: guarda la cuenta en una variable y devuélvela con `return`.
--- código
function costoDelTanque(litros, precioPorLitro) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('40 litros a 5', () => igual(costoDelTanque(40, 5), 200));
prueba('10 litros a 6', () => igual(costoDelTanque(10, 6), 60));
prueba('sin litros no se paga nada', () => igual(costoDelTanque(0, 5), 0));
--- solución
function costoDelTanque(litros, precioPorLitro) {
  const total = litros * precioPorLitro;
  return total;
}
```

Una más, para que la mano se acostumbre:

```ejercicio
titulo: Lo que te queda del día
lenguaje: js
pide: Completa `loQueQueda(cobrado, gastado)`: devuelve lo que te queda después de restar lo que gastaste a lo que cobraste. Por ejemplo, cobraste 150 y gastaste 40: te quedan 110.
--- código
function loQueQueda(cobrado, gastado) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('cobraste 150 y gastaste 40', () => igual(loQueQueda(150, 40), 110));
prueba('un día sin gastos', () => igual(loQueQueda(90, 0), 90));
prueba('un día malo: gastaste más de lo que cobraste', () => igual(loQueQueda(30, 50), -20));
--- solución
function loQueQueda(cobrado, gastado) {
  const queda = cobrado - gastado;
  return queda;
}
```

```practica
elige :: En `const litros = 40;`, ¿qué hace el `=`? :: Pregunta si litros es igual a 40 :: Guarda 40 en la cajita litros :: Suma 40 a litros
vf :: En `const total = litros * precioPorLitro;`, el `*` quiere decir multiplicar
elige :: ¿Por qué conviene llamar a una variable `precioPorLitro` y no `x`? :: Porque es obligatorio :: Porque así cualquiera entiende qué guarda :: Porque ocupa menos espacio
vf :: La máquina lee y obedece lo que escribes después de `//`
```

## Parte 5. Decisiones: el "sí" y el "no"

> 🌎 **En la vida real:** le explicas a un niño cómo cruzar la calle. No le dices solo "cruza". Le dices: **"mira a los dos lados. SI viene un carro, NO cruces; si NO viene, entonces cruza."** Fíjate que tienes que decirle **las dos cosas**: qué hacer cuando **sí** viene y qué hacer cuando **no**. Si solo dices una, el niño se queda sin saber qué hacer en el otro caso.

> 🌎 **Otro ejemplo:** el semáforo. SI está en rojo, te detienes; si está en verde, avanzas. Una regla con su "sí" y su "no".

Esto en programación se llama una **decisión**, y se escribe con `if` ("si", en inglés) y `else` ("si no"). Es, junto con repetir, lo que hace que un programa no sea una lista fija de pasos, sino algo que **reacciona** a lo que pasa.

```text
si (viene un carro)   → espera
si no                 → cruza
```

Dos ideas que te van a ahorrar muchos errores:

1. **La condición tiene que ser completa y clara.** "Si viene un carro" está claro: o viene o no viene. La máquina necesita una pregunta que se pueda responder con **sí o no**, sin "más o menos".
2. **Piensa siempre los dos caminos.** ¿Qué pasa si **sí**? ¿Y si **no**? Muchos errores de principiante son por olvidar el "si no": el programa funciona cuando todo va bien, pero no sabe qué hacer cuando algo falta.

> 💡 **Idea:** cuando una decisión tiene **varios** casos (rojo, amarillo, verde), se encadenan: `si… si no, si… si no…`. Lo verás a fondo, con código de verdad, en [Decisiones y ciclos](../46-js-decisiones-y-ciclos/LECCION.md) (la clase 02 del curso de JavaScript).

### Cómo se escribe una decisión

```js
function semaforo(enRojo) {
  if (enRojo) {
    return 'detente';
  } else {
    return 'avanza';
  }
}

console.log(semaforo(true));    // muestra detente
console.log(semaforo(false));   // muestra avanza
```

- `if (enRojo)` pregunta: **«¿está en rojo?»**. La pregunta va entre paréntesis.
- `true` significa **sí** y `false` significa **no**. Así responde la máquina a una pregunta.
- Las primeras llaves `{ }` son lo que se hace si la respuesta es **sí**.
- `else` significa **«si no»**, y sus llaves son lo que se hace si la respuesta es **no**.
- La máquina toma **un solo camino**, nunca los dos.

✍️ **Ahora escribes tú:**

```ejercicio
titulo: ¿Cruzo o espero?
lenguaje: js
pide: Completa `cruzar(vieneCarro)`. Si `vieneCarro` es `true`, devuelve `'espera'`. Si es `false`, devuelve `'cruza'`. Piensa los dos caminos, como con el niño en la calle.
--- código
function cruzar(vieneCarro) {
  // usa if y else
}
--- pruebas
prueba('si viene un carro, espera', () => igual(cruzar(true), 'espera'));
prueba('si no viene, cruza', () => igual(cruzar(false), 'cruza'));
--- solución
function cruzar(vieneCarro) {
  if (vieneCarro) {
    return 'espera';
  } else {
    return 'cruza';
  }
}
```

### Repetir: hacer lo mismo con cada cosa de una lista

> 🌎 **En la vida real:** al final del día cuentas lo que ganaste viaje por viaje: el primero, 12; el segundo, 8; el tercero, 15. Haces **lo mismo** (sumar) con **cada** viaje. No das una instrucción por viaje: dices "por cada viaje, súmalo".

Primero, una **lista**: varios datos juntos, entre corchetes `[ ]` y separados por comas.

```js
const viajes = [12, 8, 15];
```

Para repetir algo con cada elemento de la lista se usa **`for...of`** ("para cada… de…"):

```js
let total = 0;
for (const viaje of viajes) {
  total = total + viaje;
}
// al terminar, total vale 35
```

Léelo así: "empieza con `total` en 0. **Por cada** `viaje` **de** la lista `viajes`, súmale ese viaje al total".

- `let` es como `const`, pero la cajita **sí puede cambiar**. Aquí `total` cambia en cada vuelta: 0 → 12 → 20 → 35.
- Lo que está entre `{ }` se repite una vez por cada elemento. A cada repetición se le dice **vuelta**.
- `total = total + viaje` se lee: "el total nuevo es el total de antes, más este viaje".
- Para comparar números: `>` (mayor que), `<` (menor que), `>=` (mayor o igual) y `===` (igual). Cada comparación responde **sí o no** (`true` o `false`), justo lo que necesita un `if`.

> 💡 **Idea:** decidir (`if`) y repetir (`for`) juntos son casi todo lo que hace un programa: "por cada viaje, **si** pagó más de 10, cuéntalo".

✍️ **Ahora escribes tú:**

```ejercicio
titulo: Lo que ganaste hoy
lenguaje: js
pide: Completa `totalDelDia(viajes)`: recibe la lista de lo que pagó cada viaje y devuelve la suma. Usa una cajita con `let` que empiece en 0 y un `for...of` que le sume cada viaje.
--- código
function totalDelDia(viajes) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('tres viajes', () => igual(totalDelDia([12, 8, 15]), 35));
prueba('un solo viaje', () => igual(totalDelDia([20]), 20));
prueba('un día sin viajes da 0', () => igual(totalDelDia([]), 0));
--- solución
function totalDelDia(viajes) {
  let total = 0;
  for (const viaje of viajes) {
    total = total + viaje;
  }
  return total;
}
```

Y ahora las dos ideas juntas, repetir y decidir:

```ejercicio
titulo: ¿Cuántos viajes buenos?
lenguaje: js
pide: Completa `viajesBuenos(viajes, minimo)`: devuelve **cuántos** viajes pagaron `minimo` o más. Recorre la lista con `for...of` y, **si** el viaje es mayor o igual que `minimo` (`>=`), súmale 1 a una cajita que empieza en 0.
--- código
function viajesBuenos(viajes, minimo) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('dos de tres pagaron 10 o más', () => igual(viajesBuenos([12, 8, 15], 10), 2));
prueba('justo 10 también cuenta', () => igual(viajesBuenos([10, 9], 10), 1));
prueba('sin viajes, ninguno', () => igual(viajesBuenos([], 10), 0));
--- solución
function viajesBuenos(viajes, minimo) {
  let cuantos = 0;
  for (const viaje of viajes) {
    if (viaje >= minimo) {
      cuantos = cuantos + 1;
    }
  }
  return cuantos;
}
```

### Miniproyecto · ¿Me alcanza para el combustible?

Ya calculaste cuánto cuesta llenar parte del tanque. Ahora vas a decidir si el gasto cabe en el presupuesto y después vas a sumar varios viajes.

Si tienes 100 y gastas justo 100, ¿te alcanza? Predice qué debería mostrar el programa para 99, 100 y 101 antes de revisarlo.

```ejercicio
titulo: Comprueba el presupuesto
lenguaje: js
pide: Haz que `revisarPresupuesto` diga «Te pasaste» solo cuando el total sea mayor que el presupuesto. Si son iguales o sobra dinero, debe decir «Alcanza».
pista: Oralmente, completa «si el total es mayor que el presupuesto…». En código, la comparación se escribe dentro de los paréntesis del `if`.
--- código
function revisarPresupuesto(total, presupuesto) {
  if (false) {
    return 'Te pasaste';
  }
  return 'Alcanza';
}
--- pruebas
prueba('99 de 100 alcanza', () => igual(revisarPresupuesto(99, 100), 'Alcanza'));
prueba('100 de 100 alcanza', () => igual(revisarPresupuesto(100, 100), 'Alcanza'));
prueba('101 de 100 se pasa', () => igual(revisarPresupuesto(101, 100), 'Te pasaste'));
--- solución
function revisarPresupuesto(total, presupuesto) {
  if (total > presupuesto) {
    return 'Te pasaste';
  }
  return 'Alcanza';
}
```

Imagina tres viajes de 10, 5 y 2 litros, a 6 por litro. Calcula el total a mano. Después completa el ciclo y compara los resultados.

```ejercicio
titulo: Suma el combustible de varios viajes
lenguaje: js
pide: En cada vuelta del ciclo, calcula lo que costó ese viaje y súmalo a `total`. Una lista vacía debe sumar cero.
pista: `litros` es la cantidad de un viaje. Multiplica esa cantidad por `precioPorLitro` y añádela al valor que ya tengas en `total`.
--- código
function sumarViajes(viajes, precioPorLitro) {
  let total = 0;
  for (const litros of viajes) {
    // agrega aquí el costo de este viaje
  }
  return total;
}
console.log(sumarViajes([10, 5, 2], 6));
--- pruebas
prueba('tres viajes a 6 por litro suman 102', () => igual(sumarViajes([10, 5, 2], 6), 102));
prueba('usa el precio que recibe', () => igual(sumarViajes([2, 3], 4), 20));
prueba('sin viajes no hay gastos', () => igual(sumarViajes([], 6), 0));
--- solución
function sumarViajes(viajes, precioPorLitro) {
  let total = 0;
  for (const litros of viajes) {
    total = total + litros * precioPorLitro;
  }
  return total;
}
console.log(sumarViajes([10, 5, 2], 6));
```

```practica
elige :: ¿Por qué no basta con decirle a la máquina "si viene un carro, espera", sin el "si no"? :: Porque es muy corto :: Porque no sabría qué hacer cuando NO viene un carro: hay que pensar los dos caminos :: Porque el carro no importa
vf :: Una decisión (if) necesita una condición que se pueda responder con sí o no
escribe :: Explica con el ejemplo de cruzar la calle qué son el "if" y el "else". :: El "if" (si) es la condición: "si viene un carro". El "else" (si no) es qué hacer en el otro caso: "si no viene, cruza". Hay que decir los dos para que la máquina sepa qué hacer siempre, no solo cuando se cumple la condición.
```

## Parte 6. Cómo está hecho este curso (y cómo estudiarlo)

> 🌎 **En la vida real:** es como un mapa de senderos en un parque: hay un camino marcado para empezar, miradores (las prácticas) donde compruebas que entendiste, y al final un sello de que completaste la ruta.

Para que no te pierdas, así funciona todo:

- **Los cursos y las etapas.** Arriba eliges un curso (empieza por **Programación**, donde estás). Cada curso tiene etapas, y cada etapa, clases como esta.
- **Los bombillos 💡.** Cada clase está partida en pedazos. Cuando entiendes uno, lo marcas como "entendido" y se prende un bombillo. Así ves tu avance y sabes por dónde ibas.
- **Las prácticas.** Al final de cada clase hay preguntas para comprobar que de verdad lo puedes explicar. No son para calificarte: son para que **tú** veas qué te falta. La respuesta solo aparece cuando aciertas, a propósito. Puedes **leer todo el curso sin cuenta**; para **revisar tus respuestas** y guardar tu avance hace falta una cuenta gratis con tu Gmail (botón 👤 cuenta, arriba). Las preguntas de **escribir** son solo para ti: nadie las corrige y no cuentan.
- **Los ejercicios de código** (como el de arriba): escribes tú, la máquina revisa.
- **El buscador 🔎 y el glosario.** Si no sabes una palabra, búscala arriba: te sale su definición antes que nada.
- **El certificado.** Cuando terminas un curso, el sitio te da un certificado con un código. Cualquiera lo puede comprobar con el botón **🎓 verificar** de arriba, sin cuenta.

> 💡 **Idea:** no corras. Es mejor **una** clase bien entendida que cinco a medias. Marca el bombillo solo cuando de verdad lo entendiste; si no, déjalo apagado y vuelve.

### Miniproyecto · Muestra los gastos en una página

El navegador dibuja títulos y párrafos a partir del **HTML**. En este ejemplo, `id="total"` es el nombre del espacio reservado para el total. JavaScript coloca el resultado ahí con `textContent`. Ese código ya está preparado.

Une lo que hiciste antes. Con 10, 5 y 2 litros a 6 por litro tienes un gasto de 102 y un presupuesto de 100. Predice el aviso, completa la condición y toca **▶ probar** para ver la página. Luego añade otro viaje a la lista y explica qué cambió en el cálculo. También puedes subir el presupuesto y comprobar cuándo cambia el aviso.

```ejercicio
titulo: Tu primera página de gastos de combustible
lenguaje: html
pide: Sustituye `false` por la condición del presupuesto. Comprueba que la página muestre 102 y «Te pasaste» con los datos de inicio.
pista: La suma ya está en `total` y el límite en `presupuesto`. Compara esos dos nombres dentro del `if`, como en la práctica anterior.
--- código
<h2>Mis gastos de combustible</h2>
<p>Precio por litro: <strong id="precio"></strong></p>
<p>Total: <strong id="total"></strong></p>
<p>Presupuesto: <strong id="presupuesto"></strong></p>
<p id="mensaje"></p>

<script>
  const viajes = [10, 5, 2];
  const precioPorLitro = 6;
  const presupuesto = 100;

  let total = 0;
  for (const litros of viajes) {
    total = total + litros * precioPorLitro;
  }

  let mensaje = 'Alcanza';
  if (false) {
    mensaje = 'Te pasaste';
  }

  document.getElementById('precio').textContent = precioPorLitro;
  document.getElementById('total').textContent = total;
  document.getElementById('presupuesto').textContent = presupuesto;
  document.getElementById('mensaje').textContent = mensaje;
</script>
--- pruebas
prueba('muestra el total y el presupuesto', () => {
  const precio = Number($('#precio').textContent);
  const presupuesto = Number($('#presupuesto').textContent);
  ok(precio > 0 && presupuesto > 0, 'El precio y el presupuesto deben aparecer en la página');
  ok(Number($('#total').textContent) > 0, 'Falta mostrar el gasto total');
});
prueba('el aviso corresponde a los importes de la página', () => {
  const total = Number($('#total').textContent);
  const presupuesto = Number($('#presupuesto').textContent);
  igual($('#mensaje').textContent, total > presupuesto ? 'Te pasaste' : 'Alcanza');
});
--- solución
<h2>Mis gastos de combustible</h2>
<p>Precio por litro: <strong id="precio"></strong></p>
<p>Total: <strong id="total"></strong></p>
<p>Presupuesto: <strong id="presupuesto"></strong></p>
<p id="mensaje"></p>

<script>
  const viajes = [10, 5, 2];
  const precioPorLitro = 6;
  const presupuesto = 100;

  let total = 0;
  for (const litros of viajes) {
    total = total + litros * precioPorLitro;
  }

  let mensaje = 'Alcanza';
  if (total > presupuesto) {
    mensaje = 'Te pasaste';
  }

  document.getElementById('precio').textContent = precioPorLitro;
  document.getElementById('total').textContent = total;
  document.getElementById('presupuesto').textContent = presupuesto;
  document.getElementById('mensaje').textContent = mensaje;
</script>
```

### Si nunca programaste: tu ruta, paso a paso

> 🌎 **En la vida real:** para manejar, primero aprendes el volante, los pedales y los cambios en un estacionamiento vacío. Recién después sales a la calle, con tráfico y semáforos. Aquí es igual: primero las piezas básicas del código, después cómo se trabaja en una app de verdad.

La clase que sigue a esta, **Leer código**, ya te pone a leer el código de una app real (Copiloto). Si nunca programaste, es mejor llegar ahí sabiendo lo básico: guardar datos, decidir, repetir y agrupar. Por eso este es el orden recomendado:

1. **Esta clase**, la primera del curso de Programación. Ya estás aquí.
2. **Lo básico del código**, clases 45 a 48, con ejercicios en la misma página:
   [Variables, tipos y la consola](../45-js-variables-y-tipos/LECCION.md) →
   [Decisiones y ciclos](../46-js-decisiones-y-ciclos/LECCION.md) →
   [Funciones](../47-js-funciones/LECCION.md) →
   [Arrays y objetos](../48-js-arrays-y-objetos/LECCION.md).
3. **Vuelve a Programación** y sigue en orden desde la clase 01: [Leer código](../01-leer-codigo/CLASE-GUIADA.md), el mapa de los lenguajes, la web (HTML, CSS y JavaScript en la página) y después el oficio: pruebas, CI, Git y leer errores. Ahora vas a reconocer cada pieza, y primero vas a ver una página tuya funcionando.
4. **Termina ese curso** desde la clase 49 hasta su proyecto final, [la web de gastos](../84-js-proyecto-web-de-gastos/LECCION.md): una página tuya, de una carpeta vacía a publicada en internet.
5. **Elige un camino** según lo que quieras construir: apps de teléfono (React Native, Kotlin o Swift), servidores (Node.js), o [Python](../36-python-primeros-pasos/LECCION.md) si te gusta más ese lenguaje. Todos empiezan desde sus primeros pasos.

> ⚠️ **Por qué este orden y no otro:** cada curso guarda su avance por separado, y dentro de un curso los bombillos se prenden **en orden**. Esta ruta respeta ese orden: nunca te pide saltarte una clase del mismo curso. Puedes **leer** cualquier clase cuando quieras; el orden solo importa para prender los bombillos.

> 📌 **No necesitas tener Copiloto.** Las clases que usan el código de Copiloto traen un **🧪 Hazlo tú** con el proyecto de práctica [Gastos del carro](https://github.com/DelvinSmart/gastos-del-carro): el mismo ejercicio, en un proyecto que cualquiera puede bajar gratis.

```practica
elige :: ¿Qué es programar, en una frase? :: Ser muy bueno en matemáticas :: Escribir instrucciones claras y en orden para que una máquina las siga :: Usar la computadora rápido
vf :: Equivocarse mucho al programar es señal de que no sirves para esto
vf :: La máquina hace lo que tú querías decir, aunque lo hayas escrito mal
elige :: En este curso, ¿cuándo conviene marcar el bombillo de "entendido"? :: Siempre, para avanzar rápido :: Solo cuando de verdad entendiste ese pedazo :: Nunca
escribe :: Con tus palabras: ¿por qué se dice que la computadora es "tonta pero rápida"? :: Porque hace exactamente lo que le escribo, sin pensar ni adivinar, pero lo hace muy rápido y sin cansarse. Si la instrucción tiene un error, lo repite igual; por eso tengo que ser claro y ordenado.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo explicarías qué es programar a alguien que no sabe nada?":** "Programar es escribir instrucciones muy claras y en orden para que una máquina las siga. La máquina es rapidísima pero no piensa: hace exactamente lo que le dices, así que el trabajo es pensar en pasos, ser ordenado y, cuando algo falla, leer el error y arreglarlo. No es cuestión de ser un genio de las matemáticas, sino de ser claro y constante."

> 🌎 **En la vida real:** saber explicar algo simple, de forma simple, es justo lo que un entrevistador busca: demuestra que lo entiendes de verdad, no de memoria.

> 🌎 **Otro ejemplo:** es como enseñarle a un niño a atarse los zapatos: si tú lo tienes claro, lo explicas en pasos fáciles; si no, te enredas. Explicar bien es la prueba de que entendiste.
