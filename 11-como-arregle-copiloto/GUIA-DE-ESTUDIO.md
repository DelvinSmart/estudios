# Guía de estudio: lo que aprendí arreglando Copiloto

Este es el **Tema 11** del curso: lo avanzado. Hazlo después de los Temas 01 a 10. Estudia una parte por día. Primero intenta responder sin mirar. Las respuestas están al final.

Los ejemplos se simplificaron para aprender. El código real puede verse un poco distinto.

## Parte 1. El hilo de JavaScript

**Qué es:** tu código de React Native corre, casi todo, en un solo hilo. Solo puede hacer una cosa a la vez.

**Comparación:** es una caja de supermercado con una sola cajera. Si un cliente tarda 5 minutos, todos esperan.

**En Copiloto:** ordenar las ciudades ocupó el hilo 4,8 s. Durante ese tiempo no respondían los toques ni los temporizadores.

**Pista clave:** si un temporizador de 3,5 s salta a los 5,5 s, algo bloqueó el hilo.

**Ejercicio:** pega esto en Node y explica por qué el mensaje sale tarde.

```js
setTimeout(() => console.log('hola'), 100);
const fin = Date.now() + 2000;
while (Date.now() < fin) {}
```

**Preguntas**
1. ¿Por qué una app se puede congelar sin que falle la red?
2. ¿Qué indica un temporizador atrasado?

## Parte 2. Medir antes de arreglar

**Qué es:** buscar el dato real antes de cambiar el código.

| Herramienta | Qué responde |
|---|---|
| Marcas de tiempo | ¿En qué etapa se va el tiempo? |
| Detector de trabas | ¿Se bloquea el hilo? |
| Perfilador | ¿Qué función consume el tiempo? |

**Preguntas**
3. ¿Por qué mi primer arreglo del splash no sirvió?
4. ¿Qué diferencia hay entre una marca de tiempo y un perfilador?

## Parte 3. Redibujos en React

**Qué es:** al cambiar el estado, React vuelve a ejecutar el componente. Si es grande, eso cuesta tiempo.

```ts
// Mal: cambia cada segundo, aunque la hora se muestra en HH:MM
setInterval(() => setNow(new Date()), 1000);

// Mejor: espera al próximo minuto
setTimeout(refresh, 60000 - (Date.now() % 60000));
```

**Ejercicio:** explica qué calcula `60000 - (Date.now() % 60000)`.

**Pregunta**
5. ¿Por qué un reloj puede poner lenta toda una pantalla?

## Parte 4. `useMemo` y dependencias

**Qué es:** `useMemo` guarda un cálculo y lo repite solo si cambian sus dependencias. Los objetos se comparan por referencia.

```tsx
<Chart goals={{ daily: 100 }} /> // objeto nuevo en cada dibujo

useMemo(calcular, [goals]);                    // recalcula siempre
useMemo(calcular, [goals.daily, goals.weekly]); // recalcula si cambia el valor
```

**Comparación:** son dos sobres con la misma carta. Para `useMemo` son sobres diferentes.

**Pregunta**
6. ¿Por qué `{ a: 1 } === { a: 1 }` da `false`?

## Parte 5. Índices y caché

**Índice:** en vez de recorrer toda la lista cada vez, se organiza una vez y se busca directo. Es como el índice de un libro.

**Caché:** guardar algo caro de crear para reutilizarlo.

```ts
const cache = new Map();
function dateFormat(locale, options) {
  const key = locale + JSON.stringify(options);
  if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat(locale, options));
  return cache.get(key);
}
```

Recorrer 600 registros para 365 días son 219.000 pasos. Con índice, se recorren una vez y luego cada búsqueda es directa.

**Ejercicio:** escribe una función que agrupe gastos por categoría usando un `Map`.

**Preguntas**
7. ¿Qué riesgo tiene un caché?
8. ¿Cuándo no vale la pena usar uno?

## Parte 6. Pruebas automáticas

**Qué es:** código que comprueba otro código. La lección completa es el [Tema 02](../02-pruebas-automaticas/LECCION.md); aquí solo va lo que se aprendió arreglando Copiloto.

**La regla más importante:** escribe la prueba según lo que **debe** pasar, no copiando lo que el código hace hoy.

```ts
it('corrida Uber a las 02:00 cuenta en el día anterior', () => {
  const records = [earning(100, at(4, 20)), earning(40, at(5, 2))];
  expect(getAppFiscalDayBalance(records, 'uber', at(4, 21))).toBe(140);
});
```

**Sabotaje:** rompe el código a propósito. Si ninguna prueba falla, la prueba no protege. Esta técnica se llama mutation testing.

**Ejercicio:** en `../09-crud-nodejs`, rompe una validación y mira si falla una prueba.

**Preguntas**
9. ¿Por qué las pruebas de Copiloto encontraron errores que nadie veía?
10. ¿Qué demuestra un sabotaje detectado?

## Parte 7. Normalizar datos

**Qué es:** dar una sola forma a los datos antes de usarlos.

```ts
// Mal: 'Uber' y 'uber' cuentan como dos plataformas
new Set(records.map((r) => r.appId));

// Bien: una sola forma
new Set(records.map((r) => normalizeFiscalAppId(r.appId)));
```

**Pregunta**
11. ¿Cómo sumaba el doble ese error? Explícalo con un ejemplo.

## Parte 8. Fechas y día fiscal

**Qué es:** el día del negocio no siempre coincide con el del calendario. Para Uber, las 02:00 del día 5 aún pertenecen al día 4.

**Prueba siempre los bordes:** 03:59 y 04:00, el fin de mes y otras zonas horarias.

**Pregunta**
12. ¿Por qué "Ontem" salía igual a "Hoje" de madrugada?

## Parte 9. CI

**Qué es:** Integración Continua. Una máquina limpia revisa cada subida. La lección completa, con el archivo de tu app explicado línea por línea, es el [Tema 04](../04-ci/LECCION.md).

**Comparación:** es un inspector que revisa cada carro antes de salir de la fábrica.

**Por qué máquina limpia:** tu computadora tiene archivos que otros no tienen. La copia limpia encontró un fallo invisible en la Mac.

**Ejercicio:** lee `.github/workflows/ci.yml` y explica cada trabajo con tus palabras.

**Pregunta**
13. ¿Qué no puede detectar la CI?

## Parte 10. Motores, tokens y candados

**Token:** un nombre para un valor de diseño, como `dash.radiusLg`.

**Motor:** una pieza única que controla algo en toda la app. `Touchable` controla el toque.

**Candado:** una revisión que impide saltarse el motor.

```tsx
// Mal: cada pantalla decide
color: dash.isLightTheme ? dash.text : dash.textDim
// Bien: la pantalla solo lee el token
color: dash.formHint
```

**Preguntas**
14. ¿Qué ventaja da cambiar un color en un solo lugar?
15. ¿Para qué sirve el candado si ya existe el motor?

## Parte 11. Ciclos entre archivos

**Qué es:** A importa B, y B importa A. Puede causar errores al cargar y hace el código más difícil de cambiar.

**Solución común:** mover lo compartido a un tercer archivo.

```text
Antes: oilChangeProgress <-> vehicleTrackingCalculations
Después: los dos importan vehicleOdometer
```

**Ojo:** un `import` que solo trae un tipo se borra al compilar. Por eso `import type` eliminó varios ciclos.

**Pregunta**
16. ¿Por qué mover una función puede romper un ciclo?

## Parte 12. Refactorizar

**Qué es:** cambiar la estructura sin cambiar lo que hace el programa.

**Cómo hacerlo seguro:** tener pruebas, mover sin reescribir y comparar antes y después.

**Hook propio:** una función `useAlgo` que agrupa lógica de React, como `useFuelActions`.

**Pregunta**
17. ¿Dividir un archivo garantiza que el código sea mejor? ¿Por qué?

## Parte 13. Dependencias y parches

**Qué es:** las librerías también tienen errores. `patch-package` guarda un cambio y lo reaplica al instalar.

**Riesgo real:** el parche depende de una versión exacta. Al actualizar Firebase dejó de aplicarse, y dos copias de `@firebase/app` rompieron el arranque.

**Pregunta**
18. ¿Por qué TypeScript y las pruebas pasaron aunque la app no abría?

## Parte 14. Trabajar con IA

1. Pide medidas, no opiniones.
2. Exige ver el resultado funcionando.
3. Revisa los números que la IA da.
4. No publiques lo que no puedas explicar.
5. Cuando algo debe ser exacto, usa datos o código, no una imagen generada.

**Pregunta**
19. ¿Por qué el mapa final se generó con código?

## Práctica final
Explica estas historias en voz alta, en 1 minuto cada una, sin leer:

1. Cómo encontraste la causa de la lentitud.
2. Cómo encontraron las pruebas el error de Uber.
3. Por qué desapareció la barra de navegación y cómo se resolvió.
4. Qué aprendiste de la vc89 rota.

## Respuestas

1. El hilo puede estar ocupado con cálculos, sin que la red tenga relación.
2. Que el hilo no pudo ejecutarlo a tiempo porque estaba bloqueado.
3. Porque actué sobre una suposición. `reloadSettings` ya volvía de inmediato para las cuentas en la nube.
4. La marca dice cuándo ocurre algo. El perfilador dice qué función consume el tiempo.
5. Porque cada cambio redibuja el componente, y si es grande cuesta mucho.
6. Son dos objetos distintos en memoria. Se compara la referencia, no el contenido.
7. Que quede desactualizado o crezca demasiado.
8. Cuando lo que se guarda es barato, o cambia casi siempre.
9. Porque probaron casos raros y bordes que casi nadie revisa a mano.
10. Que esa prueba detecta ese tipo de error. No demuestra que no existan otros.
11. Si hay `Uber` (20) y `uber` (10), salen dos plataformas. Cada una se normaliza a `uber` y suma 30, así que el total da 60.
12. Calculaba "Ontem" desde las 03:59 del día actual. A las 02:00, eso cae en el mismo día fiscal que "Hoje".
13. Lo que no revise: por ejemplo, cómo se ve una pantalla o si la app abre en un teléfono real.
14. Cambia en toda la app, sin buscar archivo por archivo y sin olvidar ninguno.
15. Para impedir que alguien, persona o IA, se salte el motor.
16. Porque los dos archivos dejan de depender uno del otro y dependen de un tercero.
17. No. Un archivo grande puede dividirse mal. Importa que cada parte tenga una responsabilidad clara.
18. Porque esas revisiones no ejecutaron la app completa. El fallo aparecía al arrancar.
19. Porque cada cable debe coincidir con los datos, y una imagen generada no lo garantiza.
