# Explicaciones para entrevista

## 1. ¿Cómo se hizo el mapa con código?

**Respuesta corta:** escribí un programa que da instrucciones de dibujo en formato SVG. Un navegador las convierte en imagen.

**Un SVG es texto.** En vez de guardar píxeles, describe formas:

```html
<rect x="100" y="50" width="300" height="120" fill="#dfe5ea"/>
<text x="120" y="90">Componentes (357)</text>
<path d="M400 110 L500 110" stroke="#3f9bff" stroke-width="13"/>
```

Eso significa: dibuja un cuadro, escribe un texto y traza una línea azul. `x` e `y` son coordenadas, como en un plano.

**Los 4 pasos reales:**
1. **Medir:** `madge` lee los `import` de cada archivo y genera una lista de quién usa a quién.
2. **Contar:** un script agrupa esa lista por carpetas. Así salió, por ejemplo, Componentes → Motores: 582.
3. **Dibujar:** `mapa-completo.py` escribe los rectángulos, textos y cables con coordenadas.
4. **Exportar:** Brave abre la página sin ventana y guarda un PNG.

**Lo que hay que decir con honestidad:** la posición de las cajas y las rutas de los cables las definimos a mano en el programa. Los números se midieron con `madge` y se pusieron en el programa. El dibujo no se actualiza solo, y muestra las conexiones más grandes, no las 5.038.

**Frase para explicarlo:**
> Medí las dependencias con madge, agrupé los resultados por capas y generé el diagrama como SVG con un script. La distribución es manual, pero los números salen del código.

Los programas están en `material/programas/`.

## 2. Pruebas y sabotajes: la diferencia

- **92 pruebas:** comprueban que el código hace lo correcto. Hoy son 104.
- **19 sabotajes:** no son pruebas. Son errores metidos a propósito para ver si las pruebas los detectaban.

**Comparación:** una prueba es la alarma de incendios. El sabotaje es acercarle humo para confirmar que suena.

**Cómo se hizo cada uno:**
1. Cambiar una línea del código.
2. Ejecutar todas las pruebas.
3. Si alguna falla, el sabotaje quedó detectado.
4. Devolver el código original.

El programa está en `material/programas/sabotajes.py`. Resultado: 19 de 19 detectados.

## 3. Los 19 sabotajes

Las 19 filas son errores simulados. Dos de ellos, el 2 y el 4, repiten a propósito errores reales que las pruebas ya habían encontrado.

| N.º | Sabotaje | Qué se cambió | Qué le pasaría a una persona | Pruebas que fallaron |
|---|---|---|---|---|
| 1 | Uber cierra a las 05:00 | La hora de cierre pasó de 4 a 5 | Una corrida de las 04:30 caería en el día equivocado | 2 |
| 2 | "Ontem" igual a "Hoje" | La resta de un día pasó a cero | De madrugada, Ayer repetiría a Hoy | 3 |
| 3 | Ignorar lanzamientos del día | La condición pedía más de 99 registros | El saldo del día saldría mal | 18 |
| 4 | Uber en doble | Se quitó la normalización del nombre | `Uber` y `uber` sumarían dos veces | 1 |
| 5 | Ajustes dentro del saldo | Se quitó el filtro de `adjustment` | Un ajuste inflaría el saldo | 1 |
| 6 | Acumulado sumando | `reported - previous` pasó a suma | Guardaría una ganancia de más | 3 |
| 7 | Duplicados sin centavos | Comparó decimales directamente | 0,1 + 0,2 no se vería igual a 0,3 | 1 |
| 8 | Calendario invertido | `===` pasó a `!==` | Cada día mostraría los registros de otros días | 2 |
| 9 | Gasto inválido | Se quitó `safeAmount` | Un valor inválido dañaría el total | 1 |
| 10 | Semana desde el domingo | Cambió el cálculo del inicio | El domingo caería en la semana equivocada | 1 |
| 11 | Función sin límite de 100 | Se quitó el tope en `computeGoalProgress` | Nada en la app: esa función solo la usan las pruebas | 1 |
| 12 | Meta exacta | Se quitó el estado "alcanzada" | Llegar justo a la meta no contaría | 1 |
| 13 | Aviso repetido | Se quitó la condición del total anterior | Avisaría cada vez, y no solo al cruzar la meta | 1 |
| 14 | San ignora "Contar tu mano" | Se borró el descuento | Mostraría una cuota de más | 1 |
| 15 | Mano pasada antes de tiempo | `<` pasó a `<=` | La mano contaría como pasada el mismo día | 2 |
| 16 | Quien salió del San cuenta | Se quitó el filtro `withdrawn` | El total del San saldría de más | 1 |
| 17 | Atrasados fuera | Pendiente dejó de sumarlos | El monto pendiente saldría de menos | 1 |
| 18 | San cancelado cambia | Se desactivó la protección | Un San cancelado podría pasar a finalizado | 1 |
| 19 | Meta semanal fija | Pasó a `daily * 7` | Ignoraría los días de trabajo | 1 |

**Dos aclaraciones importantes:**
- **Sabotaje 11:** no existe ningún límite para ganar más que la meta. Puedes seguir registrando y la app te felicita. El tope era de una función que la app no usa, así que ese sabotaje no protege nada real. La barra visual tiene su propio tope, solo para no salirse del dibujo.
- **Sabotaje 14:** comprueba el descuento de "Contar tu mano" en una mano. No prueba el caso de dos manos de la misma persona.

## 4. Un ejemplo completo: "Uber en doble"

**La regla:** `Uber` y `uber` son la misma plataforma.

**La prueba:**
```ts
const records = [earning(10, at(5)), earning(20, at(5), { appId: 'Uber' })];
expect(sumFiscalDayEarnings(records, at(5))).toBe(30);
```

**Qué pasó:** la prueba esperaba 30 y recibió 60. Había dos nombres, y cada uno sumaba los 30 de la Uber.

**Arreglo:** normalizar el nombre antes de recorrer las plataformas.

**Sabotaje:** quité esa normalización y la prueba volvió a fallar. Eso confirmó que protege ese error.

## 5. Si no recuerdas uno
Di esto, sin inventar:

> Fueron 19 errores inyectados en cálculos de día fiscal, ganancias, gastos, metas y San. No recuerdo el número exacto de ese caso, pero todos seguían el mismo método: cambiar una regla, ejecutar las pruebas y confirmar que alguna fallara.

## 6. Límites
- Detectar los 19 no prueba que no haya más errores.
- La técnica se llama **mutation testing**. Aquí se hizo a mano, con 19 casos elegidos, no con una herramienta completa.
- Las pruebas cubren cálculos, no cómo se ve la app.
