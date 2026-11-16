# Clase guiada 11: Cómo arreglé Copiloto

Esta es la clase **como si yo te la estuviera dando**, para estudiarla sin ninguna IA. Junta la [guía de estudio](GUIA-DE-ESTUDIO.md) y el [informe](INFORME.md) en una sola clase, contada como historia.

**Cómo estudiarla:** es el tema **avanzado**: haz primero los Temas 01 a 10. Una o dos partes por día. Es la historia real del 4 y 5 de noviembre de 2026, cuando tu app pasó de tardar **17,7 segundos** en abrir a unos **6,3**.

**Para qué te sirve:** es **la** historia para contar en una entrevista. Tiene todo: un problema real, medición, causas, arreglos, errores cometidos y lo que se aprendió.

## 1. El hilo de JavaScript

> 🎙️ **El profesor:** Delvin, empecemos por el problema. Tu app, publicada en Google Play, tardaba **17,7 segundos** en mostrar el Início en un Samsung A31. Para un conductor, eso es eternidad. Para entender por qué, hay que entender **una idea**: el hilo de JavaScript.

> 🌎 **En la vida real:** Es como una cocina con un solo cocinero: si se pone a pelar 50 kilos de papa, nadie más recibe su plato hasta que termine, aunque la heladera esté llena.

> 🌎 **Otro ejemplo:** Es como una sola línea de teléfono en una oficina: mientras alguien habla una hora, todas las demás llamadas dan ocupado.

### Una sola cajera

El código de React Native corre, casi todo, en **un solo hilo**: **solo puede hacer una cosa a la vez**. Mientras está haciendo una cuenta larga, no puede responder a un toque, ni mover una animación, ni disparar un temporizador.

> 🌎 **En la vida real:** una caja de supermercado con **una sola cajera**. Si un cliente tarda 5 minutos, todos los demás esperan, aunque tengan una sola cosa. O un **puente de un solo carril**: si un camión se queda parado en medio, ningún carro cruza, aunque la ruta del otro lado esté vacía.

> 🌎 **Otro ejemplo:** Como un peaje con una sola cabina abierta: un auto que tarda en pagar frena a toda la fila.

**En Copiloto:** ordenar una lista de ciudades **ocupó el hilo 4,8 segundos**. Durante ese tiempo, la app no respondía a nada.

### La pista clave: el temporizador atrasado

Un temporizador (`setTimeout`) de 3,5 segundos **saltó a los 5,5 segundos**. Un temporizador solo se atrasa por una razón: **el hilo estaba ocupado** y no pudo ejecutarlo a tiempo.

> 🌎 **En la vida real:** pones la alarma del horno a los 3,5 minutos y suena a los 5,5. El horno no se equivocó: estabas tan ocupado en el teléfono que no la escuchaste hasta que colgaste.

> 🌎 **Otro ejemplo:** Como el colectivo que debía pasar a las 8:00 y llega a las 8:20 porque estaba trabado en un embotellamiento: el horario estaba bien; algo lo frenó en el camino.

### Pruébalo tú

> 🌎 **En la vida real:** Es como pedir un café y que el barista se ponga a contar hasta 2.000 antes de servirlo: el café estaba listo, pero esperó a terminar de contar.

> 🌎 **Otro ejemplo:** Es como poner un huevo a hervir 3 minutos, pero quedarte trabado en una llamada de 2 minutos más: el huevo sale duro aunque el reloj del horno funcionaba.

Pega esto en Node (en la terminal: `node`, Enter, y pega):

```js
setTimeout(() => console.log('hola'), 100);
const fin = Date.now() + 2000;
while (Date.now() < fin) {}
```

- Línea 1: "en 100 milisegundos, escribe *hola*".
- Líneas 2 y 3: un `while` que da vueltas **sin hacer nada** durante 2 segundos.
- **Resultado:** el "hola" sale a los **2 segundos**, no a los 100 ms. El `while` es el camión parado en el puente: el "hola" quería cruzar y tuvo que esperar.

> ✋ **Para y piensa:** ¿se puede congelar una app aunque internet funcione perfecto?

<details>
<summary>Ver la respuesta</summary>

**Sí.** Si el hilo está ocupado con un cálculo, la app no responde, aunque la red esté perfecta. El problema está **adentro**, no en la calle.

</details>

```practica
escribe :: Explica con tus palabras qué es el hilo de JavaScript. :: Es donde corre el código; solo hace una cosa a la vez, así que si un cálculo tarda, no responde a toques ni temporizadores hasta terminar.
elige :: ¿Qué indica un temporizador que salta tarde? :: Que internet está lento :: Que el hilo estaba ocupado :: Que el teléfono está sin batería
elige :: En el ejercicio, ¿cuándo sale el "hola"? :: A los 100 ms :: A los 2 segundos :: Nunca
vf :: Una app puede congelarse sin que falle la red
elige :: ¿Cuánto tiempo ocupaba el hilo ordenar las ciudades? :: 0,1 s :: 4,8 s :: 17 s
```

> 🔁 **Repaso:** un solo hilo, una cosa a la vez. Si algo lo ocupa, todo espera. Un temporizador atrasado es la huella de un hilo bloqueado.

## 2. Medir antes de arreglar

> 🎙️ **El profesor:** esta es la lección **más importante** de la historia, y la del Tema 07: **verificar antes de adivinar**. Y te voy a contar cómo se aprendió… equivocándose primero.

> 🌎 **En la vida real:** Es como un médico que antes de operar pide radiografías, análisis y una tomografía: cada estudio dice algo distinto.

> 🌎 **Otro ejemplo:** Es como encontrar por qué llegas tarde al trabajo: anotas a qué hora sales, cuánto tardas en cada tramo, y descubres que era el semáforo de la esquina, no el tránsito.

### El primer arreglo que no sirvió

> 🌎 **Otro ejemplo:** Como cambiar la batería del carro porque "seguro es eso", y descubrir que el problema era un fusible: se gastó plata y el carro sigue sin arrancar.

Antes de medir, la sospecha era: "la pantalla inicial (el *splash*) espera a la nube". Se cambió el código del splash… y **no hizo nada**. ¿Por qué? Porque `reloadSettings` (la carga de ajustes) ya volvía **de inmediato** para las cuentas en la nube. La suposición era **falsa**.

Lo que funcionó fue **medir**, con cuatro herramientas, en este orden:

| Herramienta | Qué responde | 🌎 En tu mañana |
|---|---|---|
| **Marcas de tiempo** | ¿En qué **etapa** se va el tiempo? | Anotar la hora al despertar, al bañarte, al desayunar |
| **Detector de trabas** (un temporizador cada 50 ms) | ¿Se **bloquea** el hilo? | Una alarma cada minuto: si suena tarde, estabas trabado |
| **Cronómetro por módulo** | ¿Qué **archivo** tarda al cargar? | Medir cada tarea por separado |
| **Perfilador** (de Hermes) | ¿Qué **función** consume el tiempo? | Una cámara que te graba: "20 minutos buscando las llaves" |

**Hermes** es el motor que ejecuta JavaScript dentro de la app de React Native; su **perfilador** muestra en qué función se gasta cada milisegundo.

> ✋ **Para y piensa:** ¿qué diferencia hay entre una marca de tiempo y un perfilador?

<details>
<summary>Ver la respuesta</summary>

La **marca de tiempo** dice **cuándo** ocurre algo ("el Início apareció a los 17 s"). El **perfilador** dice **qué función** consume el tiempo ("`localeCompare` gastó 4,8 s").

</details>

```practica
elige :: ¿Por qué el primer arreglo del splash no sirvió? :: Porque tenía un error de tipeo :: Porque se actuó sobre una suposición falsa, sin medir :: Porque el teléfono era viejo
elige :: ¿Qué herramienta dice qué función consume el tiempo? :: Marcas de tiempo :: El perfilador :: El detector de trabas
elige :: ¿Para qué sirve un temporizador cada 50 ms? :: Para animar :: Para detectar si el hilo se bloquea (si salta tarde) :: Para guardar datos
vf :: Lo primero ante una app lenta es cambiar el código que uno sospecha
escribe :: ¿Cuál es la lección principal de esta parte? :: Medir antes de arreglar: conseguir el dato real con marcas de tiempo, detector de trabas y perfilador antes de cambiar el código.
```

> 🔁 **Repaso:** se adivinó y falló. Se midió (marcas, detector de trabas, cronómetro por módulo, perfilador) y aparecieron las causas reales.

## 3. Las causas reales (y los redibujos en React)

> 🎙️ **El profesor:** con las mediciones en la mano, aparecieron **cinco causas**. Mira la tabla: ninguna era "la red".

| Causa | Costo medido | Arreglo |
|---|---|---|
| Se ordenaban **254 ciudades** al abrir, comparando con `localeCompare` | **4,8 s** | Dejar la lista **ya ordenada** en el archivo |
| Un **reloj** actualizaba el Início **cada segundo**, aunque se ve solo HH:MM | ~1,1 s por redibujo | Actualizar solo **al cambiar el minuto** |
| El **gráfico** recalculaba **365 días** en cada dibujo | ~8 s en 25 s | Dependencias estables en `useMemo` e índice por plataforma y día |
| Un **formateador de fecha nuevo** cada vez | ~5 ms cada uno | Una fábrica única con caché: `dateFormat` |
| **Firestore** comparaba letra por letra partes iguales de cada ruta | ~6 s con 736 documentos | Parche de 1 línea en el SDK: `if (e === t) return 0` |

> 🌎 **En la vida real:** ordenar la guía telefónica cada mañana antes de usarla; repintar el cartel cada segundo cuando la hora cambia por minuto; rehacer la contabilidad del año cada vez que alguien mira el saldo; comprar una calculadora nueva para cada cuenta; comparar dos papeles idénticos letra por letra cuando bastaba ver que eran **el mismo papel**.

> 🌎 **Otro ejemplo:** Como una casa que gasta mucha luz: el medidor muestra que no era la heladera, sino la ducha eléctrica, el aire y una lámpara que quedó prendida.

### El reloj: los redibujos de React

En React, **cada vez que cambia el estado**, el componente se **vuelve a dibujar** (se vuelve a ejecutar). Si el componente es grande (como el Início), eso cuesta.

```ts
// Mal: cambia cada segundo, aunque la hora se muestra en HH:MM
setInterval(() => setNow(new Date()), 1000);

// Mejor: espera al próximo minuto
setTimeout(refresh, 60000 - (Date.now() % 60000));
```

¿Qué calcula `60000 - (Date.now() % 60000)`?
- `Date.now()` = los milisegundos desde 1970.
- `% 60000` = el **resto** de dividir por 60.000 (un minuto en milisegundos): **cuántos ms pasaron desde el último minuto en punto**.
- `60000 - eso` = **cuántos ms faltan para el próximo minuto en punto**.

Si son las 14:31:45, faltan 15 segundos: espera 15.000 ms, y actualiza justo a las 14:32.

> 🌎 **En la vida real:** el cartel "Próximo bus: 14:32" se actualiza **una vez por minuto**, justo cuando cambia el minuto.

> 🌎 **Otro ejemplo:** Como un reloj de pared que alguien vuelve a pintar entero cada segundo, cuando solo la aguja de los minutos cambia una vez por minuto.

```practica
elige :: ¿Cuál fue la causa que más tardó al abrir? :: El reloj :: Ordenar 254 ciudades con `localeCompare` (4,8 s) :: El formateador
elige :: ¿Qué hace React cuando cambia el estado? :: Nada :: Vuelve a dibujar el componente :: Recarga la app
elige :: A las 14:31:45, ¿cuánto da `60000 - (Date.now() % 60000)`? :: 45.000 ms :: 15.000 ms :: 60.000 ms
vf :: Ninguna de las cinco causas era la red
escribe :: ¿Por qué un reloj puede poner lenta toda una pantalla? :: Porque cada cambio de estado redibuja el componente; si cambia cada segundo y la pantalla es grande, se redibuja todo 60 veces por minuto.
```

> 🔁 **Repaso:** las cinco causas eran internas. Y el reloj enseña: cada cambio de estado redibuja; actualiza solo cuando de verdad cambia lo que se ve.

## 4. `useMemo` y dependencias

> 🎙️ **El profesor:** la causa del gráfico (8 segundos de 25) esconde una trampa de JavaScript que confunde a muchos programadores con años de experiencia.

`useMemo` (de React) **guarda un cálculo** y solo lo repite si cambian sus **dependencias** (la lista entre corchetes).

```tsx
<Chart goals={{ daily: 100 }} /> // objeto nuevo en cada dibujo

useMemo(calcular, [goals]);                    // recalcula siempre
useMemo(calcular, [goals.daily, goals.weekly]); // recalcula si cambia el valor
```

**La trampa:** en JavaScript, los objetos se comparan **por referencia** (¿es **el mismo** objeto?), no por contenido (¿dicen lo mismo?).

```js
{ a: 1 } === { a: 1 }   // false: son dos objetos distintos en memoria
```

`{{ daily: 100 }}` crea un objeto **nuevo** en cada dibujo. Para `useMemo`, `goals` "cambió" siempre → recalcula siempre los 365 días. La solución: depender de los **valores** (`goals.daily`, un número), que sí se comparan por contenido.

> 🌎 **En la vida real:** dos **gemelos idénticos**: se parecen en todo, pero son dos personas con distinto documento. React pregunta "¿es **la misma persona**?", no "¿se parecen?". `useMemo` es el estudiante que guarda la respuesta de una cuenta difícil en un papel, y solo recalcula si cambian **los números** de la pregunta.

> 🌎 **Otro ejemplo:** Como guardar el resultado de una cuenta difícil en un papel: si te preguntan lo mismo, lees el papel. Pero si cada vez te dan el problema en una hoja nueva, aunque diga lo mismo, crees que es otro y vuelves a calcular.

> ✋ **Para y piensa:** `const a = { x: 1 }; const b = a;` ¿`a === b` da `true` o `false`?

<details>
<summary>Ver la respuesta</summary>

**`true`**: `b` no es un objeto nuevo, es **el mismo** objeto con otro nombre (la misma persona con dos apodos).

</details>

```practica
elige :: ¿Qué da `{ a: 1 } === { a: 1 }`? :: `true` :: `false` :: Error
elige :: ¿Qué hace `useMemo`? :: Borra un cálculo :: Guarda un cálculo y lo repite solo si cambian sus dependencias :: Hace la app más lenta
elige :: ¿Cuál es mejor como dependencia? :: `[goals]` (un objeto nuevo cada vez) :: `[goals.daily, goals.weekly]` (los valores) :: Ninguna
vf :: En JavaScript, los objetos se comparan por contenido
escribe :: ¿Por qué el gráfico recalculaba siempre los 365 días? :: Porque la dependencia de useMemo era un objeto que se creaba nuevo en cada dibujo, y como los objetos se comparan por referencia, siempre parecía distinto.
```

> 🔁 **Repaso:** `useMemo` guarda un cálculo; los objetos se comparan por referencia; depende de valores, no de objetos nuevos.

## 5. Índices y caché

> 🎙️ **El profesor:** dos técnicas para no repetir trabajo caro. Las vas a usar toda la vida.

> 🌎 **En la vida real:** Es como organizar la ropa: en vez de revolver todo el armario cada mañana, separas por tipo una vez (índice) y dejas a mano lo que usas siempre (caché).

> 🌎 **Otro ejemplo:** Es como la cocina de un restaurante: los ingredientes picados de antemano (caché) y ordenados por estante (índice) para no buscar en cada pedido.

### Índice

Recorrer 600 registros **para cada uno** de 365 días son **219.000 pasos**. Con un **índice**, los recorres **una vez**, los organizas por día, y después cada búsqueda es **directa**.

```js
// Índice: agrupar una sola vez
const porDia = new Map();
for (const r of registros) {
  if (!porDia.has(r.dia)) porDia.set(r.dia, []);
  porDia.get(r.dia).push(r);
}
porDia.get('2026-11-04');   // directo, sin recorrer todo
```

Un **`Map`** es como un objeto especial para buscar por clave: `set(clave, valor)` guarda, `get(clave)` busca, `has(clave)` pregunta si existe.

> 🌎 **En la vida real:** la guía telefónica ordenada por apellido: no lees de la A a la Z para encontrar "Rodríguez", vas directo a la R. Mejor ordenar las 600 boletas **una vez** en 365 sobres que buscar boleta por boleta cada día.

> 🌎 **Otro ejemplo:** Como el índice alfabético de un recetario: vas directo a "Pollo", sin hojear todas las páginas.

### Caché

**Guardar algo caro de crear para reutilizarlo.** Así quedó `dateFormat`:

```ts
const cache = new Map();
function dateFormat(locale, options) {
  const key = locale + JSON.stringify(options);
  if (!cache.has(key)) cache.set(key, new Intl.DateTimeFormat(locale, options));
  return cache.get(key);
}
```

- Arma una **clave** con el idioma y las opciones.
- Si **no** está en el caché, crea el formateador (lo caro) y lo guarda.
- Devuelve el guardado. La segunda vez, no crea nada.

> 🌎 **En la vida real:** tener el café ya molido en un frasco en vez de moler cada vez.

> 🌎 **Otro ejemplo:** Como guardar los contactos frecuentes en favoritos: no los buscas en toda la agenda cada vez.

**Riesgos del caché:** que quede **desactualizado** o que **crezca demasiado**. **Cuándo no vale:** si lo que guardas es **barato** de crear, o si **cambia casi siempre**.

**Ejercicio:** escribe una función que agrupe gastos por categoría usando un `Map`.

<details>
<summary>Ver una solución</summary>

```js
function agruparPorCategoria(gastos) {
  const grupos = new Map();
  for (const g of gastos) {
    if (!grupos.has(g.categoria)) grupos.set(g.categoria, []);
    grupos.get(g.categoria).push(g);
  }
  return grupos;
}
```

</details>

```practica
elige :: ¿Qué es un índice? :: Una prueba :: Organizar los datos una vez para buscar directo después :: Un tipo de error
elige :: ¿Qué hace `map.get(clave)`? :: Guarda un valor :: Busca el valor de esa clave :: Borra todo
elige :: ¿Qué riesgo tiene un caché? :: Que sea muy rápido :: Que quede desactualizado o crezca demasiado :: Ninguno
elige :: ¿Cuándo NO vale la pena un caché? :: Cuando crear algo es caro :: Cuando lo que se guarda es barato o cambia casi siempre :: Siempre vale
vf :: 600 registros recorridos para cada uno de 365 días son unos 219.000 pasos
```

> 🔁 **Repaso:** índice = organizar una vez para buscar directo (`Map`). Caché = guardar lo caro para reusarlo; cuidado con lo viejo y con el tamaño.

## 6. Pruebas automáticas (lo que se aprendió)

> 🎙️ **El profesor:** después de la velocidad, se agregaron **pruebas de dinero**. La base está en el Tema 02; aquí van las dos lecciones nuevas de esta historia.

> 🌎 **En la vida real:** Es como la auditoría de una empresa: se revisan las cuentas contra las reglas contables, y se esconden errores a propósito para ver si el auditor los encuentra.

> 🌎 **Otro ejemplo:** Es como el control de calidad de una fábrica de medicamentos: cada lote se prueba contra la fórmula oficial, no contra el lote anterior.

### La regla más importante

> Escribe la prueba según lo que **debe** pasar, no copiando lo que el código hace hoy.

```ts
it('corrida Uber a las 02:00 cuenta en el día anterior', () => {
  const records = [earning(100, at(4, 20)), earning(40, at(5, 2))];
  expect(getAppFiscalDayBalance(records, 'uber', at(4, 21))).toBe(140);
});
```

Se lee: "un viaje de Uber de 100 a las 20:00 del día 4, y otro de 40 a las **02:00 del día 5**. El balance del día 4 debe ser **140**", porque para Uber el día cierra a las 04:00 (parte 8). La prueba sale de **la regla del negocio**, no de lo que el código hacía.

> 🌎 **En la vida real:** el inspector revisa contra **los planos del arquitecto**, no contra lo que el albañil ya construyó. Si copias en la prueba lo que el código hace hoy, dibujas los planos mirando la pared torcida.

> 🌎 **Otro ejemplo:** Como un juez que decide según la ley, no según lo que hizo el acusado: la prueba sale de la regla, no del código.

### El sabotaje (*mutation testing*)

Se crearon **92 pruebas**, y para comprobar que servían, se metieron **19 errores a propósito**: las pruebas detectaron **los 19**. A esa técnica se le llama **mutation testing**.

Y lo mejor: las pruebas encontraron **dos errores reales** que nadie había visto: "Uber en doble" (parte 7) y "Ontem igual a Hoje" (parte 8).

**Ojo:** un sabotaje detectado demuestra que **esa** prueba detecta **ese** tipo de error. **No** demuestra que no existan otros.

> 🌎 **En la vida real:** el banco manda clientes falsos con billetes falsos para ver si los cajeros los detectan.

> 🌎 **Otro ejemplo:** Como un simulacro de evacuación con humo falso: si todos salen bien, el plan sirve para ese tipo de emergencia, no para todas.

```practica
escribe :: ¿Cuál es la regla más importante al escribir una prueba? :: Escribirla según lo que debe pasar (la regla del negocio), no copiando lo que el código hace hoy.
elige :: ¿Cuántos errores a propósito se metieron, y cuántos detectaron las pruebas? :: 19 y 10 :: 19 y 19 :: 92 y 92
elige :: ¿Qué demuestra un sabotaje detectado? :: Que no hay ningún error :: Que esa prueba detecta ese tipo de error :: Que la app es rápida
vf :: Las pruebas de dinero encontraron dos errores reales que nadie veía
elige :: ¿Cómo se llama la técnica de meter errores a propósito para probar las pruebas? :: Refactoring :: Mutation testing :: Deploy
```

> 🔁 **Repaso:** pruebas desde la regla, no desde el código. Sabotaje (mutation testing): 19 de 19. Y dos errores reales encontrados.

## 7. Normalizar datos: el error de Uber en doble

> 🎙️ **El profesor:** el primer error real. Es un error de dinero, invisible, y muy instructivo.

**Normalizar** es dar **una sola forma** a los datos antes de usarlos.

```ts
// Mal: 'Uber' y 'uber' cuentan como dos plataformas
new Set(records.map((r) => r.appId));

// Bien: una sola forma
new Set(records.map((r) => normalizeFiscalAppId(r.appId)));
```

Un **`Set`** es una lista **sin repetidos**: guarda cada valor una sola vez.

**Cómo sumaba el doble:** una cuenta tenía registros con `Uber` (20) y `uber` (10) el mismo día. El `Set` sin normalizar veía **dos** plataformas: `Uber` y `uber`. Después, **cada una** se normalizaba a `uber` y sumaba **todos** los registros de `uber`: 30. Dos plataformas × 30 = **60**, cuando el total real era **30**.

> 🌎 **En la vida real:** en una lista de asistencia alguien firmó "Delvin" y otro "delvin". Si no los unificas, parece que vinieron dos personas. Y el cajero que contó la plata de los dos sobres en los dos sobres: 30 y 30 = 60.

> 🌎 **Otro ejemplo:** Como una planilla donde una persona escribió "Supermercado Bom" y otra "supermercado bom": al agrupar parecen dos tiendas, y los totales se duplican si se suman mal.

> ✋ **Para y piensa:** si hubiera `Uber`, `uber` y `UBER` el mismo día (con 10 cada uno), ¿cuánto mostraba el error?

<details>
<summary>Ver la respuesta</summary>

El `Set` veía **3** plataformas, y cada una sumaba los 30 de `uber`: **90**, en vez de 30.

</details>

```practica
escribe :: ¿Qué es normalizar datos? :: Dar una sola forma a los datos antes de usarlos, por ejemplo escribir siempre "uber" en minúsculas.
elige :: ¿Qué es un `Set`? :: Una lista ordenada :: Una lista sin repetidos :: Un número
elige :: Con `Uber` (20) y `uber` (10), ¿cuánto mostraba el error? :: 30 :: 60 :: 20
vf :: Para el `Set`, `'Uber'` y `'uber'` son iguales
```

> 🔁 **Repaso:** normalizar antes de agrupar. `Uber` y `uber` eran dos plataformas en el `Set`, y el total salía doble.

## 8. Fechas y día fiscal: "Ontem" igual a "Hoje"

> 🎙️ **El profesor:** el segundo error real, y una lección para toda tu vida: **las fechas son traicioneras**.

El **día del negocio** no siempre coincide con el del calendario. Para **Uber**, el día **cierra a las 04:00**: un viaje a las 02:00 del día 5 **todavía pertenece al día 4**. A eso se le llama **día fiscal**.

**El error:** la app calculaba "Ontem" (ayer) desde las **03:59 del día actual**. A las 02:00 de la madrugada, eso caía **en el mismo día fiscal** que "Hoje" (hoy). Resultado: **"Ontem" mostraba lo mismo que "Hoje"**, entre las 00:00 y las 03:59.

**La lección:** con fechas, prueba **siempre los bordes**: 03:59 y 04:00, el fin de mes, el fin de año y otras zonas horarias.

> 🌎 **En la vida real:** la panadería que cierra la caja a las 4 de la mañana: lo vendido a las 2 AM del día 5 cuenta en la caja del día 4. Como en Año Nuevo: a la 1 de la madrugada del 1 de enero, todos dicen "la fiesta de anoche".

> 🌎 **Otro ejemplo:** Como la jornada de un vigilante nocturno que entra a las 22:00 y sale a las 6:00: lo que pasa a las 2 de la mañana es parte de su turno de "ayer".

> 💡 **Idea:** ¿te acuerdas de la prueba que el Tema 02 dice que se configura con `TZ=America/Sao_Paulo`? Es por esto: las fechas dependen de la zona horaria.

```practica
elige :: Para Uber, ¿a qué hora cierra el día? :: A medianoche :: A las 04:00 :: A las 06:00
elige :: Un viaje de Uber a las 02:00 del día 5, ¿en qué día cuenta? :: Día 5 :: Día 4 :: Día 6
elige :: ¿Qué bordes hay que probar con fechas? :: Solo el mediodía :: 03:59 y 04:00, fin de mes, fin de año y zonas horarias :: Ninguno
escribe :: ¿Por qué "Ontem" salía igual a "Hoje" de madrugada? :: Porque calculaba ayer desde las 03:59 del día actual, y a las 02:00 eso caía en el mismo día fiscal que hoy.
```

> 🔁 **Repaso:** el día fiscal de Uber cierra a las 04:00. "Ontem" mal calculado = "Hoje". Con fechas, siempre probar los bordes.

## 9. CI: la máquina limpia

> 🎙️ **El profesor:** después se agregó la revisión automática (el Tema 04 la explica entera). Aquí va lo que pasó en esta historia.

Cada subida a GitHub empezó a revisar sola tipos, diseño, secretos y pruebas. Y al probar en una **máquina limpia** apareció un fallo **invisible en la Mac**: TypeScript revisaba el panel **sin tener sus dependencias** instaladas. En la Mac funcionaba porque estaban instaladas de antes.

> 🌎 **En la vida real:** el control de alcoholemia en la carretera: no le importa si te sientes bien; te hace soplar a ti y a todos. La máquina limpia es el aparato recién calibrado, no el tuyo de casa.

> 🌎 **Otro ejemplo:** Como el examen de manejo: lo haces en el auto de la autoescuela, no en el tuyo con tus mañas; si apruebas ahí, manejas bien en cualquiera.

**Lo que el CI no puede detectar:** lo que no revisa. Por ejemplo, cómo se ve una pantalla o si la app abre en un teléfono real (parte 13 lo demuestra).

```practica
vf :: El CI encontró un fallo que en la Mac no se veía
elige :: ¿Qué no puede detectar el CI? :: Errores de tipos :: Lo que no revisa, como si la app abre en un teléfono real :: Pruebas que fallan
```

> 🔁 **Repaso:** el CI en máquina limpia atrapó lo que la Mac escondía. Pero no ve lo que no revisa.

## 10. Motores, tokens y candados

> 🎙️ **El profesor:** ahora el orden del diseño. Tres palabras que usas en tu app y en tu página de estudios bíblicos: **token**, **motor** y **candado**.

- **Token:** un **nombre** para un valor de diseño, como `dash.radiusLg` o `dash.formHint`. (Es la variable CSS del Tema 16.)
- **Motor:** una **pieza única** que controla algo en toda la app. `Touchable` controla cómo reacciona **todo** al toque.
- **Candado:** una **revisión automática** que impide saltarse el motor (el `check:design` del Tema 04).

```tsx
// Mal: cada pantalla decide
color: dash.isLightTheme ? dash.text : dash.textDim
// Bien: la pantalla solo lee el token
color: dash.formHint
```

`condición ? a : b` = "si es tema claro, este color; si no, este otro". **Mal** porque **cada pantalla** decide; si mañana cambias la regla, hay que buscarla en todas.

**Lo que se hizo:** los **112 botones sueltos** (`Pressable`) pasaron al motor `Touchable`. Las **21 condiciones** `isLightTheme` de las pantallas pasaron a tokens. Y se agregaron candados de contraste.

> 🌎 **En la vida real:** una cadena de comida rápida. El **token** es "Rojo Corporativo"; el **motor** es la central que manda el uniforme a todos los locales; el **candado** es el inspector que multa al que se hizo su propio uniforme. El motor existe, pero sin inspector alguien siempre se lo salta.

> 🌎 **Otro ejemplo:** Como el uniforme de una empresa: el color oficial tiene nombre (token), la empresa los reparte desde un solo lugar (motor) y un supervisor revisa que nadie lleve uno hecho a mano (candado).

```practica
elige :: ¿Qué es un token de diseño? :: Una contraseña :: Un nombre para un valor de diseño, como `dash.formHint` :: Un botón
elige :: ¿Qué es `Touchable` en tu app? :: Un token :: Un motor: controla el toque en toda la app :: Un candado
elige :: ¿Para qué sirve el candado si ya existe el motor? :: Para nada :: Para impedir que alguien, persona o IA, se salte el motor :: Para pintar
vf :: Cambiar un color en un token lo cambia en toda la app
elige :: ¿Cuántos botones sueltos pasaron al motor? :: 21 :: 112 :: 0
```

> 🔁 **Repaso:** token = nombre de un valor; motor = pieza única; candado = revisión que impide saltarse el motor.

## 11. Ciclos entre archivos

> 🎙️ **El profesor:** había **22 ciclos** entre archivos. Quedaron en **cero**. Así se hizo.

Un **ciclo** es cuando **A importa B, y B importa A**. Puede causar errores al cargar (uno pide al otro antes de que esté listo) y hace el código difícil de cambiar.

**La solución común:** mover lo compartido a **un tercer archivo**.

```text
Antes: oilChangeProgress <-> vehicleTrackingCalculations
Después: los dos importan vehicleOdometer
```

**Un detalle:** **9** de los 22 eran **falsos**: solo importaban un **tipo**. Un `import type` (que solo trae un tipo de TypeScript) **se borra al compilar**, así que no crea un ciclo real.

> 🌎 **En la vida real:** "para conseguir trabajo necesito experiencia, y para tener experiencia necesito trabajo". La solución es un tercero: si dos vecinos se pelean por una escalera, la compra el edificio y la usan los dos. Y `import type` es pedir **solo la foto** del vecino, no que venga en persona.

> 🌎 **Otro ejemplo:** Como dos compañeros que no pueden empezar su tarea porque cada uno espera que el otro termine primero: se resuelve dándoles a los dos una herramienta común.

```practica
escribe :: ¿Qué es un ciclo entre archivos? :: Cuando A importa a B y B importa a A; puede romper la carga y hace el código difícil de cambiar.
elige :: ¿Cómo se rompe un ciclo normalmente? :: Borrando los dos archivos :: Moviendo lo compartido a un tercer archivo :: Juntando todo en uno
vf :: Un `import type` se borra al compilar, por eso no crea un ciclo real
elige :: ¿De cuántos ciclos a cuántos se pasó? :: De 9 a 0 :: De 22 a 0 :: De 22 a 9
```

> 🔁 **Repaso:** ciclo = A ↔ B. Se rompe con un tercer archivo compartido. `import type` no cuenta.

## 12. Refactorizar

> 🎙️ **El profesor:** **siete** archivos tenían más de 1.000 líneas. Bajaron todos. Eso se llama **refactorizar**.

**Refactorizar** es **cambiar la estructura sin cambiar lo que hace** el programa. El programa hace exactamente lo mismo; solo queda mejor ordenado.

**Cómo hacerlo seguro:**
1. Tener **pruebas** antes (la "foto" de cómo funciona).
2. **Mover** bloques enteros **sin reescribirlos**.
3. **Comparar** antes y después (las pruebas siguen pasando).

Una herramienta que se usó: el **hook propio**, una función `useAlgo` que agrupa lógica de React, como `useFuelActions`.

> 🌎 **En la vida real:** reorganizar el placard: cambias de lugar la ropa, pero no tiras ni compras nada. Antes sacas una foto, mueves la ropa sin cortarla, y al final comparas. Un hook propio es armar un **kit del café** en una bandeja.

> 🌎 **Otro ejemplo:** Como reorganizar los cajones de la cocina: los mismos cubiertos, solo mejor ubicados; la comida sale igual.

**¿Dividir un archivo garantiza que sea mejor?** **No.** Un archivo grande puede dividirse mal. Importa que **cada parte tenga una responsabilidad clara** (Tema 10). Repartir la ropa en cinco cajones al azar no ordena nada.

```practica
escribe :: ¿Qué es refactorizar? :: Cambiar la estructura del código sin cambiar lo que hace el programa.
elige :: ¿Qué hace falta para refactorizar seguro? :: Nada :: Pruebas antes, mover sin reescribir, y comparar :: Borrar las pruebas
vf :: Dividir un archivo grande siempre lo hace mejor
elige :: ¿Qué es un hook propio como `useFuelActions`? :: Un archivo de estilos :: Una función `useAlgo` que agrupa lógica de React :: Una prueba
```

> 🔁 **Repaso:** refactorizar = misma función, mejor estructura. Con pruebas, moviendo sin reescribir. Y dividir no es ordenar si no hay responsabilidades claras.

## 13. Dependencias y parches: la vc89 rota

> 🎙️ **El profesor:** ahora el error **más importante** de toda la historia. Escúchalo bien, porque es la mejor historia para una entrevista.

Las librerías también tienen errores. Para el problema de Firestore (parte 3) se usó **`patch-package`**: una herramienta que **guarda un cambio** a una librería y lo **reaplica** cada vez que se instala.

**Lo que pasó:**
1. Se actualizó Firebase con `npm audit fix` (un comando que actualiza librerías con problemas de seguridad).
2. El parche estaba hecho para **una versión exacta**: con la nueva, **dejó de aplicarse**.
3. Además, quedaron **dos copias** de `@firebase/app`, que chocaban entre sí.
4. Resultado: la versión **vc89** se quedaba **en el logo** en el iPhone. **No abría.**

**¿Y por qué TypeScript y las pruebas pasaron?** Porque esas revisiones **no ejecutaron la app completa**. El fallo aparecía **al arrancar**.

**La lección:** **compilar no es funcionar.** Hay que **abrir la app** en un teléfono real.

> 🌎 **En la vida real:** las librerías son muebles comprados; el parche es una **cuña** hecha a medida para la pata floja de **ese** modelo. Si compras el modelo nuevo, la cuña no entra, y encima te quedaste con **dos mesas** iguales en la sala. Las revisiones miraron cada mueble en su caja, pero nadie **armó la sala y se sentó a comer**.

> 🌎 **Otro ejemplo:** Como un repuesto adaptado a mano para un modelo de carro: si cambias de modelo, el repuesto ya no calza, y te quedas con dos piezas que chocan.

```practica
elige :: ¿Qué hace `patch-package`? :: Borra librerías :: Guarda un cambio a una librería y lo reaplica al instalar :: Publica la app
elige :: ¿Por qué se rompió la vc89? :: Por un error de tipeo :: El parche dejó de aplicarse al actualizar y quedaron dos copias de `@firebase/app` :: Porque el iPhone era viejo
elige :: ¿Por qué TypeScript y las pruebas pasaron? :: Porque estaban apagados :: Porque no ejecutaron la app completa: el fallo aparecía al arrancar :: Porque el error era de diseño
escribe :: ¿Cuál es la lección de la vc89? :: Compilar no es funcionar: aunque pasen los tipos y las pruebas, hay que abrir la app en un teléfono real; y fijar las versiones parcheadas.
```

> 🔁 **Repaso:** un parche atado a una versión + una actualización = parche perdido y dos copias de Firebase. La vc89 no abría. Compilar no es funcionar.

## 14. Trabajar con IA

> 🎙️ **El profesor:** todo esto se hizo con una IA escribiendo el código y tú dirigiendo. Estas son las cinco reglas que salieron de la experiencia. Valen para cualquier IA, y son las que te van a preguntar en una entrevista hoy en día.

1. **Pide medidas, no opiniones.** No "¿está rápido?", sino "¿cuántos segundos tarda?".
2. **Exige ver el resultado funcionando.** No aceptes "ya quedó" sin abrirlo tú.
3. **Revisa los números** que la IA te da.
4. **No publiques lo que no puedas explicar.**
5. **Cuando algo debe ser exacto, usa datos o código**, no una imagen generada.

**¿Por qué el mapa final se hizo con código?** Las IA de imágenes dibujaron mapas bonitos, pero **no lograron conectar bien los cables**: inventaban conexiones. Se generó con código, para que cada cable saliera de **datos medidos** con `madge` (la herramienta de los ciclos).

> 🌎 **En la vida real:** un ayudante muy rápido, pero que a veces habla con demasiada seguridad. Pídele medidas, abre la canilla tú, revisa el ticket, no firmes lo que no leíste, y un plano eléctrico no se hace "a ojo".

> 🌎 **Otro ejemplo:** Como un pasante muy rápido y entusiasta: le pides el trabajo, pero revisas los números, pruebas que funcione y no firmas nada que no entiendas.

> 💡 **Idea:** estas cinco reglas son las mismas de la clase 19 (agentes): verificar, medir, y una persona en el ciclo.

```practica
escribe :: Di las cinco reglas para trabajar con IA. :: Pedir medidas, no opiniones; exigir ver el resultado funcionando; revisar los números; no publicar lo que no puedo explicar; y para lo exacto, usar datos o código.
elige :: ¿Por qué el mapa final se hizo con código? :: Porque era más bonito :: Porque cada cable debía salir de datos reales, y las imágenes generadas inventaban conexiones :: Porque la IA no dibuja
vf :: Si la IA dice "ya quedó", se puede publicar sin probar
```

> 🔁 **Repaso:** con IA: medidas, verlo funcionar, revisar números, no publicar lo que no entiendes, y lo exacto con datos o código.

## Los números finales

> 🎙️ **El profesor:** para cerrar la historia, el "antes y después". Los números convencen más que "ahora anda mejor".

> 🌎 **En la vida real:** Los números de antes y después son como la foto del antes y después de una dieta: convencen más que "me siento mejor".

| Qué | Antes | Después |
|---|---|---|
| Tiempo hasta ver el Início (Samsung A31) | 17,7 s | ~6,3 s |
| Traba de Firebase al abrir | ~6 s | 2,3 s |
| Pruebas de la app | 0 | 104 |
| Pruebas de reglas de Firestore | 0 | 21 |
| Botones sueltos sin motor | 112 | 0 |
| Ciclos entre archivos | 22 | 0 |
| Archivos de más de 1.000 líneas | 7 | 0 |
| Revisión automática en cada subida | No | 5 trabajos (hoy son 6) |

**Errores cometidos en el camino** (contarlos con honestidad muestra que aprendiste):

| Error | Lección |
|---|---|
| Arreglar el splash sin medir | Medir antes de tocar |
| `freezeOnBlur` hizo desaparecer la barra de navegación | Una optimización también puede romper cosas |
| Forzar *long polling* en Firestore fue peor | Probar, y revertir si empeora |
| Medir con el teléfono bloqueado dio datos falsos | Comprobar primero las condiciones de la prueba |
| Actualizar Firebase con `npm audit fix` | Fijar las versiones parcheadas |
| Dos copias de `@firebase/app` (vc89) | Compilar no es funcionar |
| Un dibujo con cables inventados | Un diagrama debe venir de datos reales |

```practica
elige :: ¿Cuánto tardaba la app en abrir antes y después? :: 6 s y 2 s :: 17,7 s y ~6,3 s :: 30 s y 17 s
vf :: Contar los errores cometidos en una entrevista te hace ver mal
```

## Práctica final y entrevista

> 🎙️ **El profesor:** el examen de esta clase es contar historias. Cada una **en 1 minuto, en voz alta, sin leer**. Después compara con la versión modelo.

> 🌎 **En la vida real:** Contar esta historia es como contarle a un cliente la reparación de su carro: qué tenía, cómo lo encontraste, qué cambiaste y cómo quedó.

> 🎤 **Entrevista:** "Cuéntame un problema difícil que resolviste." (versión de 30 segundos)

<details>
<summary>Ver una buena respuesta</summary>

"Mi app tardaba casi 18 segundos en abrir en un teléfono de gama media. En vez de adivinar, medí con un perfilador y encontré las causas: un ordenamiento al arrancar, un redibujo por segundo, un gráfico que recalculaba todo y una comparación lenta en Firestore. Bajó a unos 6 segundos. Después añadí pruebas, encontré dos errores reales de dinero y dejé revisiones automáticas para que no volvieran."

</details>

> 🎤 **Entrevista:** "¿Cómo encontraron las pruebas el error de Uber?"

<details>
<summary>Ver una buena respuesta</summary>

"Escribí pruebas desde las reglas del negocio, incluidos casos raros como registros con 'Uber' y 'uber' el mismo día. Una falló: esos registros se contaban como dos plataformas y el total salía doble. La causa era que no se normalizaba el id antes de agruparlo."

</details>

> 🎤 **Entrevista:** "¿Qué aprendiste de un error tuyo?"

<details>
<summary>Ver una buena respuesta</summary>

"Una versión pasaba TypeScript y todas las pruebas, pero en el iPhone se quedaba en el logo. Había actualizado Firebase y el parche que usaba dejó de aplicarse, con dos copias de la librería chocando. Aprendí que compilar no es funcionar: ahora siempre abro la app en un teléfono real antes de publicar, y fijo las versiones que tienen parches."

</details>

> 🎤 **Entrevista:** "¿Cómo usaste IA?"

<details>
<summary>Ver una buena respuesta</summary>

"La usé para programar más rápido, pero yo dirigía, probaba en teléfonos reales y decidía qué aceptar. Aprendí a exigir medidas y a no dar nada por bueno sin verlo funcionando."

</details>

También practica en voz alta: **por qué desapareció la barra de navegación** (`freezeOnBlur` "congela" las pestañas que no se ven, para ahorrar trabajo; pero congelado, el Início no corría el código que cierra el menú al salir, y la barra de pestañas nunca volvía. Se apagó: hoy está `freezeOnBlur: false`, con un comentario en `MainTabNavigator.tsx` que explica por qué) y **qué aprendiste de la vc89**.

```practica
escribe :: Cuenta en 3 frases la historia de la lentitud. :: La app tardaba casi 18 segundos en abrir; en vez de adivinar medí con un perfilador y encontré causas internas (ordenar ciudades, un reloj por segundo, el gráfico y Firestore); quedó en unos 6 segundos y dejé pruebas y CI para que no vuelva.
escribe :: Cuenta en 2 frases qué aprendiste de la vc89. :: Pasaba tipos y pruebas pero no abría en el iPhone porque el parche de Firebase dejó de aplicarse; aprendí que compilar no es funcionar y que hay que abrir la app en un teléfono real.
```

> 🔁 **Repaso final de la clase:** el hilo único, medir antes de arreglar, las cinco causas, `useMemo` y las referencias, índices y caché, pruebas desde la regla y sabotaje, normalizar, el día fiscal, la máquina limpia, tokens-motores-candados, ciclos, refactorizar, la vc89 y trabajar con IA. Próxima: **Tema 12, Cómo hice Estudios Bíblicos**.
