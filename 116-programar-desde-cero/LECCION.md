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

Abajo hay una cajita. Vas a completar una **función** (una instrucción con nombre) que salude a una persona. No te preocupes si no entiendes cada símbolo: fíjate en la forma y prueba. Cuando toques **▶ probar**, la máquina revisa tu código y te dice si pasó.

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

### Si nunca programaste: tu ruta, paso a paso

> 🌎 **En la vida real:** para manejar, primero aprendes el volante, los pedales y los cambios en un estacionamiento vacío. Recién después sales a la calle, con tráfico y semáforos. Aquí es igual: primero las piezas básicas del código, después cómo se trabaja en una app de verdad.

La clase que sigue a esta, **Leer código**, ya te pone a leer el código de una app real (Copiloto). Si nunca programaste, es mejor llegar ahí sabiendo lo básico: guardar datos, decidir, repetir y agrupar. Por eso este es el orden recomendado:

1. **Esta clase**, la primera del curso de Programación. Ya estás aquí.
2. **Lo básico del código**, clases 45 a 48, con ejercicios en la misma página:
   [Variables, tipos y la consola](../45-js-variables-y-tipos/LECCION.md) →
   [Decisiones y ciclos](../46-js-decisiones-y-ciclos/LECCION.md) →
   [Funciones](../47-js-funciones/LECCION.md) →
   [Arrays y objetos](../48-js-arrays-y-objetos/LECCION.md).
3. **Vuelve a Programación** y sigue en orden desde la clase 01: [Leer código](../01-leer-codigo/CLASE-GUIADA.md), pruebas, Git, leer errores, y la etapa de la web (HTML, CSS y JavaScript en la página). Ahora vas a reconocer cada pieza.
4. **Termina ese curso** desde la clase 49 hasta su proyecto final, [la web de gastos](../84-js-proyecto-web-de-gastos/LECCION.md): una página tuya, de una carpeta vacía a publicada en internet.
5. **Elige un camino** según lo que quieras construir: apps de teléfono (React Native, Kotlin o Swift), servidores (Node.js), o [Python](../36-python-primeros-pasos/LECCION.md) si te gusta más ese lenguaje. Todos empiezan desde sus primeros pasos.

> ⚠️ **Por qué este orden y no otro:** cada curso guarda su avance por separado, y dentro de un curso los bombillos se prenden **en orden**. Esta ruta respeta ese orden: nunca te pide saltarte una clase del mismo curso. Puedes **leer** cualquier clase cuando quieras; el orden solo importa para prender los bombillos.

> 📌 **Nota:** la clase 05 (**Mi primer cambio**) se hace sobre la app Copiloto. Si no tienes esa app en tu computadora, léela igual: lo que enseña (dónde buscar, cambiar algo pequeño, romperlo a propósito y deshacerlo) lo vas a hacer con tu propio proyecto en la web de gastos.

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
