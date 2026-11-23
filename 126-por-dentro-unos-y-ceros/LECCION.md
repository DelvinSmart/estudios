# Por dentro: de los unos y ceros a tu programa

> 🌎 **En la vida real:** manejas un carro sin ver cada chispa del motor. Pero cuando entiendes qué pasa debajo del capó, manejas mejor y sabes explicar una falla. Aquí vamos a abrir el capó de la computadora.

> 🎙️ **El profesor dice:** {{alumno}}, ya escribiste `const litros = 40;`. Hoy vas a ver qué le pasa a esa línea por dentro: dónde queda guardado el 40, cómo se vuelve unos y ceros y quién lo ejecuta. No hace falta saber electrónica. Vamos de abajo hacia arriba, una pieza a la vez.

## Parte 1. ¿Por qué unos y ceros?

> 🌎 **En la vida real:** piensa en el interruptor de la luz de tu casa. Solo tiene dos posiciones: apagado o encendido. No hay «más o menos». Por eso es tan fácil saber en qué estado está.

Una computadora está hecha de miles de millones de interruptores diminutos llamados **transistores**. No tienen palanca: se abren o se cierran con electricidad, muchísimas veces por segundo.

Cada interruptor guarda o deja pasar una de dos señales. Para escribir esas dos señales usamos dos símbolos:

- **0** = no pasa la señal.
- **1** = sí pasa la señal.

> 📖 **Palabra nueva: bit.** Es la unidad más pequeña de información: un solo **0** o **1**. El nombre viene de *binary digit*, «dígito binario».

```dibujo
titulo Un bit es como un interruptor: apagado es 0 y encendido es 1
lienzo 420 160
caja 40 16 140 72 tenue | Apagado | no pasa la señal
caja 240 16 140 72 verde | Encendido | sí pasa la señal
flecha 110 88 110 112 tenue
flecha 310 88 310 112 verde
llena 88 114 44 36 tenue | 0
llena 288 114 44 36 verde | 1
```

¿Por qué solo dos valores y no diez? Porque la electricidad nunca es perfecta. Distinguir «hay señal» de «no hay señal» es muy confiable. Distinguir diez niveles exactos sería mucho más fácil de confundir.

> 💡 **Idea:** la máquina no «ve» números, letras ni fotos. Solo maneja señales de dos estados. Todo lo demás es una **forma de acordar qué significan** esos unos y ceros.

```practica
elige :: ¿Qué es un bit? :: Una letra del teclado :: La unidad más pequeña de información: un 0 o un 1 :: Un programa pequeño
vf :: Un transistor funciona como un interruptor diminuto
vf :: Las computadoras usan dos estados porque es lo más confiable de distinguir con electricidad
```

## Parte 2. Contar solo con 0 y 1

> 🌎 **En la vida real:** el cuentakilómetros tiene ruedas del 0 al 9. Cuando una pasa de 9, vuelve a 0 y la de al lado sube uno. En binario pasa lo mismo, pero cada rueda solo tiene **0 y 1**.

Nosotros contamos en **decimal**: cada casilla vale diez veces más que la de su derecha (1, 10, 100, 1000). En **binario**, cada casilla vale **el doble**: 1, 2, 4, 8, 16…

Para leer un número binario, suma el valor de las casillas que tienen un **1**:

```dibujo
titulo El número binario 1011 vale 11: se suman solo las casillas encendidas
lienzo 420 190
texto 90 18 azul | vale 8
texto 180 18 azul | vale 4
texto 270 18 azul | vale 2
texto 360 18 azul | vale 1
llena 62 34 56 50 verde | 1
llena 152 34 56 50 tenue | 0
llena 242 34 56 50 verde | 1
llena 332 34 56 50 verde | 1
flecha 90 84 90 112 verde
flecha 180 84 180 112 tenue
flecha 270 84 270 112 verde
flecha 360 84 360 112 verde
texto 90 126 verde | 8
texto 180 126 tenue | 0
texto 270 126 verde | 2
texto 360 126 verde | 1
caja 110 146 200 36 amarillo | 8 + 0 + 2 + 1 = 11
```

Así se cuenta del 0 al 5:

| Decimal | Binario | Cómo se lee |
|---|---|---|
| 0 | `000` | nada encendido |
| 1 | `001` | 1 |
| 2 | `010` | 2 |
| 3 | `011` | 2 + 1 |
| 4 | `100` | 4 |
| 5 | `101` | 4 + 1 |

> 📖 **Palabra nueva: byte.** Es un grupo de **8 bits**. Con 8 casillas se pueden formar **256 combinaciones**, así que un byte guarda un número del 0 al 255.

| Medida | Cuánto es, aproximadamente | Un ejemplo |
|---|---|---|
| **Byte** (B) | 8 bits | una letra sencilla |
| **Kilobyte** (KB) | 1.000 bytes | un texto corto |
| **Megabyte** (MB) | 1.000 KB | una foto |
| **Gigabyte** (GB) | 1.000 MB | una película |
| **Terabyte** (TB) | 1.000 GB | un disco externo |

> 📌 **Por qué a veces ves 1024:** como la máquina cuenta en potencias de 2, algunos sistemas usan 1024 en vez de 1000. Por eso un disco de «1 TB» puede aparecer con menos espacio en la computadora.

Ahora conviértelo tú. El truco de la máquina es leer de izquierda a derecha: **duplica lo que llevas y súmale el bit**. Con `1, 0, 1, 1`:

| Lees | Cuenta | Llevas |
|---|---|---|
| 1 | 0 × 2 + 1 | 1 |
| 0 | 1 × 2 + 0 | 2 |
| 1 | 2 × 2 + 1 | 5 |
| 1 | 5 × 2 + 1 | **11** |

✍️ **Ahora escribes tú:**

```ejercicio
titulo: De binario a decimal
lenguaje: js
pide: Completa `aDecimal(bits)`. Recibe una lista de unos y ceros y devuelve su valor. Por ejemplo, `aDecimal([1, 0, 1, 1])` da `11`. Usa un `let` que empiece en 0 y un `for...of`, como en la clase anterior.
pista: Dentro del ciclo, el valor nuevo es el valor de antes multiplicado por 2, más el bit.
--- código
function aDecimal(bits) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('1011 es 11', () => igual(aDecimal([1, 0, 1, 1]), 11));
prueba('101 es 5', () => igual(aDecimal([1, 0, 1]), 5));
prueba('un byte lleno es 255', () => igual(aDecimal([1, 1, 1, 1, 1, 1, 1, 1]), 255));
prueba('todo apagado es 0', () => igual(aDecimal([0, 0, 0]), 0));
--- solución
function aDecimal(bits) {
  let valor = 0;
  for (const bit of bits) {
    valor = valor * 2 + bit;
  }
  return valor;
}
```

```practica
elige :: ¿Cuánto vale el binario 110? :: 3 :: 6 :: 110
vf :: Un byte tiene 8 bits
elige :: ¿Cuál es el número más grande que cabe en un byte? :: 8 :: 128 :: 255
```

## Parte 3. Todo se vuelve números

> 🌎 **En la vida real:** en una radio de taxi, «código 5» puede significar «voy en camino». El número no significa nada por sí solo: significa algo porque todos acordaron la misma tabla. Con los bits pasa igual.

Si la máquina solo guarda números, ¿cómo guarda una letra o una foto? Con **acuerdos**, que en programación se llaman **codificaciones**.

| Qué ves | Cómo se guarda | Ejemplo |
|---|---|---|
| **Letra** | Un número de una tabla | `A` = 65 |
| **Color** | Tres números: rojo, verde y azul (RGB) | rojo puro = 255, 0, 0 |
| **Foto** | Muchos puntos (píxeles), cada uno con su color | 12 millones de píxeles |
| **Sonido** | Muchas medidas de la onda por segundo | 44.100 por segundo en un CD |
| **Programa** | Números que la máquina entiende como órdenes | «suma», «guarda», «salta» |

```dibujo
titulo La misma idea para todo: lo que ves se guarda como un número, y el número como bits
lienzo 420 110
caja 8 24 92 60 azul | Letra | A
flecha 100 54 142 54 tenue
caja 144 24 92 60 amarillo | Número | 65
flecha 236 54 278 54 tenue
caja 280 24 132 60 verde | Bits | 01000001
```

La tabla más usada hoy se llama **Unicode**, y su forma más común de guardarse es **UTF-8**. Con ella caben la `ñ`, las tildes, el portugués, el árabe y los emojis. Una `A` ocupa 1 byte. Una `ñ` ocupa 2, y un emoji suele ocupar 4.

> ⚠️ **Por qué a veces ves `Ã±` en vez de `ñ`:** alguien guardó el texto con una tabla y lo leyó con otra. Los bits están bien. El **acuerdo** fue distinto.

### Por qué `0.1 + 0.2` no da exactamente `0.3`

Prueba esto en JavaScript:

```js
console.log(0.1 + 0.2);   // 0.30000000000000004
```

No es un error de JavaScript. En decimal, `1/3` no se puede escribir completo: queda `0.3333…`. En binario pasa lo mismo con `0.1`: la máquina guarda un valor **muy cercano**, no exacto.

> 💡 **Idea para tus apps:** por eso el dinero no conviene sumarlo con decimales. Lo más seguro es trabajar en **centavos**: R$ 18,50 se guarda como `1850`, que es un número entero exacto.

Un byte son 1.000 veces menos que un kilobyte. Practica esa conversión con una foto:

✍️ **Ahora escribes tú:**

```ejercicio
titulo: ¿Cuánto pesa en kilobytes?
lenguaje: js
pide: Completa `aKilobytes(bytes)` para que devuelva cuántos kilobytes son esos bytes, usando 1 KB = 1000 bytes. Por ejemplo, `aKilobytes(2500)` da `2.5`.
--- código
function aKilobytes(bytes) {
  // escribe aquí tu respuesta
}
--- pruebas
prueba('2500 bytes', () => igual(aKilobytes(2500), 2.5));
prueba('1000 bytes', () => igual(aKilobytes(1000), 1));
prueba('cero bytes', () => igual(aKilobytes(0), 0));
--- solución
function aKilobytes(bytes) {
  return bytes / 1000;
}
```

```practica
vf :: Una letra se guarda como un número de una tabla acordada
elige :: ¿Qué significa RGB? :: Un tipo de archivo :: Rojo, verde y azul: tres números forman un color :: Una marca de pantallas
elige :: ¿Por qué conviene guardar dinero en centavos? :: Porque ocupa menos :: Porque los enteros son exactos y los decimales binarios pueden no serlo :: Porque es obligatorio en JavaScript
```

## Parte 4. Las piezas: CPU, memoria y disco

> 🌎 **En la vida real:** imagina una cocina. El **cocinero** hace el trabajo. La **mesa** tiene lo que está usando ahora: es rápida, pero pequeña, y se limpia al cerrar. La **despensa** guarda mucho y lo conserva, pero hay que caminar hasta ella.

| Pieza | En la cocina | Qué hace | ¿Se borra al apagar? |
|---|---|---|---|
| **CPU** (procesador) | El cocinero | Ejecuta las instrucciones | No guarda tu trabajo |
| **RAM** (memoria) | La mesa | Guarda lo que el programa usa ahora | **Sí** |
| **Disco** (SSD) | La despensa | Guarda archivos y apps | **No** |

```dibujo
titulo La CPU pide datos a la RAM, y la RAM los trae del disco cuando hacen falta
lienzo 420 170
caja 10 42 116 78 verde | CPU | ejecuta
caja 152 42 116 78 azul | RAM | rápida, temporal
caja 294 42 116 78 amarillo | Disco | lento, permanente
flecha 126 68 152 68 tenue
flecha 152 96 126 96 tenue
flecha 268 68 294 68 tenue
flecha 294 96 268 96 tenue
texto 210 148 tenue | Al apagar, la RAM se vacía y el disco se conserva
```

### Dónde vive tu variable

¿Recuerdas la cajita `litros`? **Esa cajita es un lugar en la RAM.** La memoria es como una calle larguísima de casillas, y cada casilla tiene un número llamado **dirección**.

```js
const litros = 40;
```

Cuando esta línea corre, el programa reserva un lugar en la RAM y guarda allí el 40 en bits. El nombre `litros` es para ti: la máquina trabaja con la dirección.

```dibujo
titulo Tu variable es un lugar con dirección en la RAM (la dirección del dibujo es un ejemplo)
lienzo 420 150
caja 12 44 110 56 morado | litros | el nombre
flecha 122 72 164 72 tenue
caja 166 22 76 34 tenue | 1000
llena 166 58 76 34 verde | 1001
caja 166 94 76 34 tenue | 1002
flecha 242 75 284 75 tenue
caja 286 44 122 62 verde | 00101000 | es el 40
```

> 💡 **Ahora se entiende mejor:** por eso tus variables se pierden al cerrar el programa, y por eso Copiloto guarda tus cargas en una base de datos: tiene que pasarlas de la **mesa** a la **despensa**.

### El ciclo de la CPU

La CPU repite tres pasos, miles de millones de veces por segundo:

1. **Busca** la siguiente instrucción en la memoria.
2. **Entiende** qué le piden.
3. **Ejecuta**: suma, compara, guarda o salta a otra instrucción.

```practica
elige :: ¿Dónde vive una variable mientras el programa corre? :: En el disco :: En la RAM :: En la pantalla
vf :: La RAM conserva los datos cuando apagas la computadora
elige :: En la comparación con la cocina, ¿quién es la CPU? :: La despensa :: La mesa :: El cocinero
```

## Parte 5. Del código que escribes a los unos y ceros

> 🌎 **En la vida real:** tú dices «llévame al aeropuerto». Eso se convierte en una ruta, la ruta en giros del volante y los giros en movimientos del motor. Cada capa traduce la orden a algo más simple.

La CPU no entiende JavaScript, Kotlin ni Swift. Solo entiende **lenguaje de máquina**: instrucciones escritas en unos y ceros. Entre tu código y ella hay varias capas:

```dibujo
titulo Cada capa traduce la orden para la capa de abajo
lienzo 420 318
caja 50 6 320 46 morado | Tu código | const total = litros * precio
flecha 210 52 210 72 tenue
caja 50 74 320 46 azul | Compilador o intérprete | traduce tu lenguaje
flecha 210 120 210 140 tenue
caja 50 142 320 46 amarillo | Sistema operativo | reparte memoria, archivos y CPU
flecha 210 188 210 208 tenue
caja 50 210 320 46 verde | Lenguaje de máquina | órdenes en unos y ceros
flecha 210 256 210 270 tenue
llena 50 272 320 40 tenue | Transistores: encendido y apagado
```

| Palabra | Qué hace | Dónde lo has visto |
|---|---|---|
| **Compilador** | Traduce el programa antes de ejecutarlo | Swift y Kotlin |
| **Intérprete** | Lee y ejecuta el programa mientras corre | Python |
| **Motor** | Interpreta y además compila las partes que más se repiten | JavaScript en el navegador |
| **Sistema operativo** | Administra la máquina y reparte recursos entre las apps | Android, iOS, macOS, Windows, Linux |

> 📌 **No siempre es uno o el otro.** Muchos lenguajes mezclan las dos ideas. Kotlin, por ejemplo, se compila a un formato intermedio que después ejecuta Android. Lo que importa es la idea: **alguien traduce tu código hasta llegar a la máquina**.

### Junta todo con una sola línea

Cuando corre `const total = litros * precioPorLitro;`:

1. El **motor de JavaScript** traduce la línea a instrucciones de máquina.
2. La **CPU** busca en la **RAM** los bits de `litros` y `precioPorLitro`.
3. Sus **transistores** hacen la multiplicación.
4. El resultado se guarda en bits, en otro lugar de la **RAM**, con el nombre `total`.

> 🎙️ **El profesor dice:** {{alumno}}, no vas a programar con unos y ceros en tu día a día. Para eso existen las capas. Pero ahora, cuando alguien diga memoria, CPU, compilar o bytes, ya sabes de qué parte de la máquina está hablando.

```practica
vf :: La CPU entiende JavaScript directamente
elige :: ¿Qué hace un compilador? :: Dibuja la pantalla :: Traduce el programa a una forma que se pueda ejecutar :: Guarda las contraseñas
elige :: ¿Qué hace el sistema operativo? :: Solo muestra el fondo de pantalla :: Administra la máquina y reparte memoria, archivos y CPU entre las apps :: Escribe el código por ti
escribe :: Explica con tus palabras qué pasa por dentro con const litros = 40. :: La línea se traduce a instrucciones que la CPU entiende. El programa reserva un lugar en la RAM y guarda allí el 40 convertido en bits. El nombre litros me sirve a mí para encontrar ese lugar. Cuando el programa se cierra, ese dato se pierde si no lo guardé en disco o en una base de datos.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es un bit y qué es un byte?":** "Un bit es la unidad mínima de información: un 0 o un 1. Un byte son 8 bits, y puede representar 256 valores, del 0 al 255."

> 🎤 **Si te preguntan "¿cuál es la diferencia entre RAM y disco?":** "La RAM es rápida y temporal: guarda lo que el programa usa ahora y se borra al apagar. El disco es más lento, pero conserva los datos. Por eso en Copiloto lo importante no se queda en una variable: se guarda en una base de datos."

> 🎤 **Si te preguntan "¿por qué 0.1 + 0.2 no da 0.3?":** "Porque esos decimales no tienen una representación exacta en binario, así que la máquina guarda un valor muy cercano. Por eso, para dinero, prefiero trabajar con enteros en centavos."
