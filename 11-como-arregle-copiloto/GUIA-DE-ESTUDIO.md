# Guía de estudio: lo que aprendí arreglando Copiloto

> 🌎 **En la vida real:** es como el cuaderno de un mecánico después de reparar un carro difícil: no solo dice "lo arreglé", sino **qué aprendió** en cada paso para la próxima vez.

Este es el **Tema 11** del curso: lo avanzado. Hazlo después de los Temas 01 a 10. Estudia una parte por día. Primero intenta responder sin mirar. Las respuestas están al final.

Los ejemplos se simplificaron para aprender. El código real puede verse un poco distinto.

## Parte 1. El hilo de JavaScript

> 🌎 **En la vida real:** la lección ya usa la cajera única del supermercado. Otro ejemplo: es un **puente de un solo carril**. Si un camión se queda parado en medio del puente 5 segundos, ningún carro cruza, aunque la ruta del otro lado esté vacía (aunque internet funcione perfecto).
>
> El **temporizador atrasado** es como poner la alarma del horno a los 3,5 minutos y que suene a los 5,5: el horno no se equivocó; estabas tan ocupado en el teléfono que no la escuchaste hasta que colgaste.
>
> En el ejercicio, el `while` es el camión parado en el puente: el "hola" quería cruzar a los 100 ms, pero tuvo que esperar 2 segundos.

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

> 🌎 **En la vida real:** es como un médico que no receta sin análisis:
> - **Marcas de tiempo** = anotar a qué hora saliste de casa, a qué hora llegaste al semáforo y a qué hora al trabajo: así sabes **en qué tramo** se te fue el tiempo.
> - **Detector de trabas** = el sensor que avisa "el tránsito está detenido".
> - **Perfilador** = la cámara del helicóptero de tránsito: te muestra **exactamente qué camión** está trabando la avenida.

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

> 🌎 **En la vida real:** es como un pintor que repinta **toda la pared** cada vez que cambia algo. Si el reloj cambia cada segundo, repinta la pared 60 veces por minuto, aunque en la pared solo se vean horas y minutos.
>
> Lo mejor es como el cartel de "Próximo bus: 14:32": se actualiza **una vez por minuto**, justo cuando cambia el minuto. `60000 - (Date.now() % 60000)` calcula "cuántos segundos faltan para el próximo minuto en punto", como mirar el reloj a las 14:31:45 y saber que faltan 15 segundos para las 14:32.

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

> 🌎 **En la vida real:** `useMemo` es como un **estudiante que guarda la respuesta** de una cuenta difícil en un papel. Si el profesor le pregunta lo mismo, lee el papel en vez de calcular de nuevo. Pero solo si **los números de la pregunta** no cambiaron.
>
> El problema de los objetos: es como dos **gemelos idénticos**. Se parecen en todo, pero son dos personas distintas con distinto documento. React pregunta "¿es **la misma persona**?", no "¿se parecen?". Por eso `{ a: 1 } === { a: 1 }` da `false`. La solución es comparar los **datos** (el número de la meta diaria), no la persona.

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

> 🌎 **En la vida real:** - **Índice**: la lección usa el índice de un libro. Otro ejemplo: la **guía telefónica** ordenada por apellido. No lees de la A a la Z para encontrar a "Rodríguez": vas directo a la R.
> - **Caché**: es tener el café ya molido en un frasco en vez de moler granos cada vez que quieres una taza. Lo caro (moler) se hace una vez.
> - **219.000 pasos**: es como buscar en 600 boletas, una por una, para **cada uno** de los 365 días. Mejor ordenar las boletas una vez en 365 sobres, uno por día.
>
> **Riesgo del caché**: el café molido hace mucho tiempo pierde sabor (se desactualiza), y si guardas demasiados frascos te llenan la cocina. **Cuándo no vale**: si moler tarda un segundo, o si cada día cambias de café, el frasco no te ahorra nada.

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

> 🌎 **En la vida real:** **La regla más importante**: el inspector de una obra revisa contra **los planos del arquitecto**, no contra lo que el albañil ya construyó. Si copias en la prueba lo que el código hace hoy, es como dibujar los planos mirando la pared torcida: la pared "cumple" los planos, pero está torcida.
>
> **Sabotaje (mutation testing)**: es como el banco que manda **clientes falsos** con billetes falsos para ver si los cajeros los detectan. Si nadie detecta nada, el entrenamiento no sirve. Si lo detectan, ese cajero sabe reconocer **ese** tipo de billete, no todos.

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

> 🌎 **En la vida real:** es como en una lista de asistencia donde alguien firmó "Delvin", otro "delvin" y otro "DELVIN". Si no los unificas, parece que vinieron tres personas. **Normalizar** es escribir todos los nombres de la misma forma antes de contar.
>
> El caso de Uber es como si el cajero contara "Uber" en un sobre y "uber" en otro, pero después, al sumar, metiera la plata de los dos en los dos sobres: 30 y 30 = 60, cuando en realidad solo había 30.

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

> 🌎 **En la vida real:** es como la **panadería que cierra la caja a las 4 de la mañana**: lo que vendiste a las 2 AM del día 5 cuenta en la caja del día 4, porque para la panadería el día 4 todavía no terminó. Es lo que pasa con una fiesta de Año Nuevo: a la 1 de la madrugada del 1 de enero, todos siguen diciendo "la fiesta de anoche".
>
> Los **bordes** (03:59 y 04:00) son como el último minuto antes de que cierre la caja: ahí es donde más se equivocan las cuentas.

**Qué es:** el día del negocio no siempre coincide con el del calendario. Para Uber, las 02:00 del día 5 aún pertenecen al día 4.

**Prueba siempre los bordes:** 03:59 y 04:00, el fin de mes y otras zonas horarias.

**Pregunta**
12. ¿Por qué "Ontem" salía igual a "Hoje" de madrugada?

## Parte 9. CI

> 🌎 **En la vida real:** además del inspector de la fábrica: es como el **control de alcoholemia** en la carretera. No le importa si te sientes bien; te hace soplar a ti y a todos, siempre. La **máquina limpia** es como hacer el examen con un aparato recién calibrado, no con el tuyo de casa, que quizás marca de menos.

**Qué es:** Integración Continua. Una máquina limpia revisa cada subida. La lección completa, con el archivo de tu app explicado línea por línea, es el [Tema 04](../04-ci/LECCION.md).

**Comparación:** es un inspector que revisa cada carro antes de salir de la fábrica.

**Por qué máquina limpia:** tu computadora tiene archivos que otros no tienen. La copia limpia encontró un fallo invisible en la Mac.

**Ejercicio:** lee `.github/workflows/ci.yml` y explica cada trabajo con tus palabras.

**Pregunta**
13. ¿Qué no puede detectar la CI?

## Parte 10. Motores, tokens y candados

> 🌎 **En la vida real:** piensa en una **cadena de comida rápida**:
> - **Token** = el nombre oficial de un color de la marca: "Rojo Corporativo". Nadie dice "ese rojo más o menos": dicen el nombre, y el manual dice el código exacto.
> - **Motor** = la **central** que manda el uniforme a todos los locales. Si la marca cambia el uniforme, cambia en un solo lugar y llega a todos.
> - **Candado** = el **inspector** que visita los locales y multa al que se hizo su propio uniforme. El motor existe, pero sin inspector, alguien siempre se lo salta.
>
> **Ventaja de cambiar en un solo lugar**: como cambiar el precio en el sistema central y que se actualice en todas las cajas, en vez de ir caja por caja con un marcador.

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

> 🌎 **En la vida real:** es el clásico: "para conseguir trabajo necesito experiencia, y para tener experiencia necesito trabajo". O dos personas en una puerta diciendo "pase usted", "no, pase usted", y nadie entra.
>
> **Solución**: un tercero. Si los dos vecinos se pelean por una escalera, la compra el edificio y la usan los dos: ya no dependen uno del otro. Es lo que se hizo con `vehicleOdometer`.
>
> `import type` es como pedir **solo la foto** del vecino para saber cómo es, no que venga en persona: la foto desaparece al final, no crea un compromiso.

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

> 🌎 **En la vida real:** es **reorganizar el placard**: cambias de lugar la ropa, pero no tiras ni compras nada. Al terminar tienes la misma ropa, solo que la encuentras más rápido.
>
> Para hacerlo seguro: antes sacas una **foto** del placard (las pruebas), mueves la ropa sin cortarla ni cambiarla, y al final comparas con la foto.
>
> **Hook propio** (`useFuelActions`) es como armar un **kit**: en vez de buscar la jarra, el filtro y el café cada mañana, los tienes juntos en una bandeja "kit del café".
>
> **¿Dividir un archivo lo hace mejor?** No siempre: repartir la ropa en cinco cajones al azar no ordena nada. Cada cajón tiene que tener **un tipo** de ropa.

**Qué es:** cambiar la estructura sin cambiar lo que hace el programa.

**Cómo hacerlo seguro:** tener pruebas, mover sin reescribir y comparar antes y después.

**Hook propio:** una función `useAlgo` que agrupa lógica de React, como `useFuelActions`.

**Pregunta**
17. ¿Dividir un archivo garantiza que el código sea mejor? ¿Por qué?

## Parte 13. Dependencias y parches

> 🌎 **En la vida real:** las librerías son **muebles comprados**. A veces vienen con una pata floja y le pones una **cuña** (`patch-package`) cada vez que lo armas.
>
> El riesgo: la cuña está hecha **a medida de ese modelo exacto**. Si compras el modelo nuevo (actualizas Firebase), la cuña ya no entra, y encima te quedaste con **dos mesas** iguales en la sala (dos copias de `@firebase/app`), que chocan entre sí.
>
> ¿Por qué las revisiones pasaron? Porque revisaron cada mueble en la caja, pero nadie **armó la sala completa** y se sentó a comer (nadie arrancó la app).

**Qué es:** las librerías también tienen errores. `patch-package` guarda un cambio y lo reaplica al instalar.

**Riesgo real:** el parche depende de una versión exacta. Al actualizar Firebase dejó de aplicarse, y dos copias de `@firebase/app` rompieron el arranque.

**Pregunta**
18. ¿Por qué TypeScript y las pruebas pasaron aunque la app no abría?

## Parte 14. Trabajar con IA

> 🌎 **En la vida real:** trabajar con IA es como contratar a un **ayudante muy rápido pero que a veces habla con demasiada seguridad**:
> 1. **Pide medidas**: no "¿está bien la pared?", sino "¿cuántos centímetros tiene?".
> 2. **Mira que funcione**: no aceptes "ya quedó" sin abrir la canilla tú.
> 3. **Revisa los números**: como revisar el ticket del supermercado.
> 4. **No publiques lo que no puedas explicar**: no firmes un contrato que no leíste.
> 5. **Para lo exacto, datos o código**: un plano de electricidad no se hace con un dibujo artístico "parecido"; cada cable tiene que ir donde dice. Por eso el mapa se hizo con código.

1. Pide medidas, no opiniones.
2. Exige ver el resultado funcionando.
3. Revisa los números que la IA da.
4. No publiques lo que no puedas explicar.
5. Cuando algo debe ser exacto, usa datos o código, no una imagen generada.

**Pregunta**
19. ¿Por qué el mapa final se generó con código?

## Práctica final

> 🌎 **En la vida real:** es como contarle a un amigo, sin leer, cómo arreglaste tu carro: en un minuto, con tus palabras. Si lo puedes contar así, lo entendiste.
Explica estas historias en voz alta, en 1 minuto cada una, sin leer:

1. Cómo encontraste la causa de la lentitud.
2. Cómo encontraron las pruebas el error de Uber.
3. Por qué desapareció la barra de navegación y cómo se resolvió.
4. Qué aprendiste de la vc89 rota.

## Respuestas

> 🌎 **En la vida real:** son las soluciones del final del libro: se miran **después** de intentarlo, como el resultado del partido después de haber hecho tu pronóstico.

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
