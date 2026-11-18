# JavaScript 9: fechas y guardar en el navegador

> 🌎 **En la vida real:** una libreta de gastos sirve si tiene dos cosas: la **fecha** de cada gasto (para saber cuánto gastaste esta semana) y que **no se borre** al cerrarla. En una app web, lo primero son las fechas de JavaScript y lo segundo, guardar en el navegador.

> 🎙️ **El profesor dice:** {{alumno}}, las fechas tienen trampas famosas (los meses empiezan en 0, las zonas horarias) y guardar datos en el navegador también (solo guarda texto, puede no estar disponible). Hoy aprendes las dos cosas bien, y al final armas una pieza que guarda y lee la lista de gastos sin romperse. Es lo que va a usar el proyecto final.

## Parte 1. Fechas: crear, leer y la trampa del mes

```js
const ahora = new Date();                      // este momento
const dia = new Date(2026, 10, 18);            // 18 de NOVIEMBRE de 2026 (¡el mes 10!)
dia.getFullYear();   // 2026
dia.getMonth();      // 10  → noviembre (enero es 0)
dia.getDate();       // 18  → el día del mes
dia.getDay();        // 3   → el día de la semana (domingo es 0, miércoles es 3)
```

**La trampa más famosa:** en `new Date(año, mes, día)` y en `getMonth()`, **los meses van de 0 a 11**. Enero es 0 y diciembre es 11. Los días del mes, en cambio, van de 1 a 31.

Para guardar una fecha en un archivo o en una base de datos, el formato más seguro es el texto **ISO**: `'2026-11-18'` (año, mes, día; siempre con dos cifras). Se ordena bien como texto y lo entienden todos los sistemas.

```js
const texto = '2026-11-18';
const [a, m, d] = texto.split('-').map(Number);   // [2026, 11, 18]
const fecha = new Date(a, m - 1, d);              // m - 1: el mes de JavaScript empieza en 0
```

> 🌎 **En la vida real:** la trampa del mes es como un edificio donde la planta baja se llama "piso 0": el ascensor marca 0, 1, 2… y el "piso 3" es el cuarto nivel. Hay que acordarse siempre.

> 🌎 **Otro ejemplo:** el formato ISO es como escribir las placas siempre igual (ABC1D23): si cada uno las escribe a su manera, buscar y ordenar se vuelve imposible.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: De texto a fecha y de fecha a texto
lenguaje: js
pide: `desdeTexto('2026-11-18')` devuelve un `Date` de ese día (ojo con el mes). `aTexto(fecha)` hace lo contrario: devuelve `'2026-11-18'`, con el mes y el día **siempre con dos cifras** (usa `String(n).padStart(2, '0')`).
--- código
function desdeTexto(texto) {
  // tu código aquí
}

function aTexto(fecha) {
  // tu código aquí
}
--- pruebas
prueba('desdeTexto da noviembre (mes 10)', () => igual(desdeTexto('2026-11-18').getMonth(), 10));
prueba('desdeTexto da el día 18', () => igual(desdeTexto('2026-11-18').getDate(), 18));
prueba('aTexto con dos cifras', () => igual(aTexto(new Date(2026, 0, 5)), '2026-01-05'));
prueba('ida y vuelta da lo mismo', () => igual(aTexto(desdeTexto('2026-12-31')), '2026-12-31'));
--- solución
function desdeTexto(texto) {
  const [a, m, d] = texto.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function aTexto(fecha) {
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}
```

```practica
vf :: En new Date(2026, 0, 5), el 0 quiere decir enero
vf :: getDate() devuelve el día de la semana
elige :: ¿Qué formato conviene para guardar una fecha como texto? :: '18/11/2026' :: '2026-11-18' :: 'nov 18'
elige :: ¿Qué mes es new Date(2026, 11, 1)? :: Noviembre :: Diciembre :: Enero
escribe :: Explica con un ejemplo de la vida real la trampa de los meses en JavaScript. :: Es como un edificio donde la planta baja es el piso 0: el ascensor dice 3 y estás en el cuarto nivel. En JavaScript, enero es el mes 0 y diciembre el 11; hay que restar o sumar 1 al convertir.
```

## Parte 2. Calcular con fechas y mostrarlas bien

### Calcular

Por dentro, cada fecha es un **número**: los milisegundos desde el 1 de enero de 1970. Por eso se pueden restar:

```js
const UN_DIA = 24 * 60 * 60 * 1000;                   // milisegundos de un día
const dias = Math.round((fin - inicio) / UN_DIA);     // cuántos días hay entre dos fechas

const manana = new Date(hoy);
manana.setDate(hoy.getDate() + 1);                    // sumar un día (se encarga del fin de mes)
```

Para "los gastos de esta semana", se busca el **lunes** de la semana y se compara:

```js
function lunesDe(fecha) {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const desdeLunes = (fecha.getDay() + 6) % 7;        // lunes=0, martes=1 … domingo=6
  lunes.setDate(lunes.getDate() - desdeLunes);
  return lunes;
}
```

### Mostrar

```js
new Date(2026, 10, 18).toLocaleDateString('es');              // '18/11/2026'
new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(239.6);  // 'R$ 239,60' (como se escribe en Brasil)
```

`toLocaleDateString` e `Intl.NumberFormat` muestran fechas y dinero **como se usa en cada país**, sin escribirlo a mano.

> 🌎 **En la vida real:** restar fechas es como contar los días en un calendario con el dedo, pero hecho por una máquina que no se equivoca con los meses de 30 y 31 días.

> 🌎 **Otro ejemplo:** `Intl` es como un traductor de formatos: el mismo número se escribe 1.234,50 en Brasil y 1,234.50 en Estados Unidos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los gastos de esta semana
lenguaje: js
pide: `diasEntre(a, b)` devuelve cuántos días hay de `a` a `b` (redondeado). `deLaSemana(gastos, hoy)` devuelve solo los gastos con fecha desde el **lunes** de la semana de `hoy` hasta `hoy` incluido (cada gasto tiene `fecha` en texto ISO). Ya tienes `lunesDe` y `desdeTexto` listos para usar.
--- código
const UN_DIA = 24 * 60 * 60 * 1000;

function desdeTexto(texto) {
  const [a, m, d] = texto.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function lunesDe(fecha) {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  lunes.setDate(lunes.getDate() - ((fecha.getDay() + 6) % 7));
  return lunes;
}

function diasEntre(a, b) {
  // tu código aquí
}

function deLaSemana(gastos, hoy) {
  // tu código aquí
}
--- pruebas
prueba('del 1 al 18 de noviembre hay 17 días', () => igual(diasEntre(new Date(2026, 10, 1), new Date(2026, 10, 18)), 17));
prueba('de un fin de mes al siguiente', () => igual(diasEntre(new Date(2026, 0, 30), new Date(2026, 1, 2)), 3));
const hoy = new Date(2026, 10, 18);   // miércoles 18 de noviembre de 2026: el lunes es el 16
const gastos = [{ fecha: '2026-11-15', valor: 1 }, { fecha: '2026-11-16', valor: 2 }, { fecha: '2026-11-18', valor: 3 }, { fecha: '2026-11-19', valor: 4 }];
prueba('deja solo los de lunes a hoy', () => igual(deLaSemana(gastos, hoy).map((g) => g.valor), [2, 3]));
prueba('sin gastos da una lista vacía', () => igual(deLaSemana([], hoy), []));
--- solución
const UN_DIA = 24 * 60 * 60 * 1000;

function desdeTexto(texto) {
  const [a, m, d] = texto.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function lunesDe(fecha) {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  lunes.setDate(lunes.getDate() - ((fecha.getDay() + 6) % 7));
  return lunes;
}

function diasEntre(a, b) {
  return Math.round((b - a) / UN_DIA);
}

function deLaSemana(gastos, hoy) {
  const desde = lunesDe(hoy);
  const hasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return gastos.filter((g) => {
    const f = desdeTexto(g.fecha);
    return f >= desde && f <= hasta;
  });
}
```

```practica
vf :: Dos fechas se pueden restar porque por dentro son números (milisegundos)
vf :: Para sumar un día hay que calcular a mano si el mes tiene 30 o 31 días
elige :: ¿Qué conviene para mostrar 239.6 como dinero de Brasil? :: Escribir 'R$ ' + 239.6 :: Intl.NumberFormat con style currency :: toFixed(1)
elige :: En (fecha.getDay() + 6) % 7, ¿qué número da un lunes? :: 1 :: 0 :: 6
escribe :: Explica cómo encontrarías los gastos de esta semana. :: Busco el lunes de la semana de hoy, convierto la fecha de cada gasto de texto a Date y me quedo con los que están entre ese lunes y hoy, incluidos.
```

## Parte 3. Guardar en el navegador: localStorage

`localStorage` es un cajoncito del navegador que **guarda texto** por sitio, y **no se borra al cerrar** la página (la clase 21 lo usó para los bombillos).

```js
localStorage.setItem('tema', 'oscuro');       // guardar (llave, valor)
localStorage.getItem('tema');                 // 'oscuro'   (o null si no existe)
localStorage.removeItem('tema');              // borrar
```

**Solo guarda texto.** Para guardar una lista u objeto, se convierte con JSON (clase 48):

```js
localStorage.setItem('gastos', JSON.stringify(gastos));          // guardar
const gastos = JSON.parse(localStorage.getItem('gastos') ?? '[]'); // leer (si no hay nada, lista vacía)
```

Lo que tienes que saber de localStorage:

| Cosa | Por qué importa |
|---|---|
| Es **de este navegador y este aparato** | Si abres la página en el teléfono, no ves lo del computador |
| La persona lo puede **leer y cambiar** | Nunca guardes ahí contraseñas, ni decidas permisos con eso (clase 21) |
| Puede **no estar disponible** | En modo privado o con el almacenamiento bloqueado, da error: siempre con `try`/`catch` |
| Tiene **límite** (unos 5 MB) | Para muchos datos, se usa una base de datos de verdad |

> 🌎 **En la vida real:** localStorage es como la guantera de tu carro: guardas tus cosas y siguen ahí mañana, pero es de ese carro (no de los demás) y cualquiera que entre al carro la puede abrir.

> 🌎 **Otro ejemplo:** es como una libreta de notas: solo admite texto; si quieres guardar una tabla, la escribes como texto ordenado (JSON) y la vuelves a leer.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Guardar y leer sin romperse
lenguaje: js
pide: Aquí no se puede usar el localStorage de verdad, así que `almacen` hace de localStorage (tiene `getItem`, `setItem` y `removeItem`, igual que el real). `guardarLista(almacen, llave, lista)` guarda la lista como JSON. `leerLista(almacen, llave)` la devuelve; si no hay nada, si el texto está roto o si `getItem` **lanza un error**, devuelve `[]`.
--- código
function guardarLista(almacen, llave, lista) {
  // tu código aquí
}

function leerLista(almacen, llave) {
  // tu código aquí
}
--- pruebas
const crearAlmacen = () => { const datos = {}; return { getItem: (k) => (k in datos ? datos[k] : null), setItem: (k, v) => { datos[k] = String(v); }, removeItem: (k) => { delete datos[k]; } }; };
prueba('guarda como texto JSON', () => { const a = crearAlmacen(); guardarLista(a, 'g', [{ valor: 1 }]); igual(a.getItem('g'), '[{"valor":1}]'); });
prueba('ida y vuelta da la misma lista', () => { const a = crearAlmacen(); guardarLista(a, 'g', [1, 2, 3]); igual(leerLista(a, 'g'), [1, 2, 3]); });
prueba('sin nada guardado da []', () => igual(leerLista(crearAlmacen(), 'g'), []));
prueba('un texto roto da []', () => { const a = crearAlmacen(); a.setItem('g', '{roto'); igual(leerLista(a, 'g'), []); });
prueba('si el almacenamiento falla, da []', () => igual(leerLista({ getItem() { throw new Error('bloqueado'); } }, 'g'), []));
--- solución
function guardarLista(almacen, llave, lista) {
  almacen.setItem(llave, JSON.stringify(lista));
}

function leerLista(almacen, llave) {
  try {
    const texto = almacen.getItem(llave);
    if (texto === null) return [];
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}
```

```practica
vf :: localStorage solo guarda texto
vf :: localStorage es un buen lugar para guardar una contraseña
elige :: Abres tu página en el teléfono. ¿Ves lo que guardaste en localStorage desde el computador? :: Sí, siempre :: No: es de cada navegador y cada aparato :: Solo si tienes internet
elige :: ¿Por qué leer localStorage dentro de un try/catch? :: Porque es lento :: Porque puede no estar disponible (modo privado o bloqueado) y el texto puede estar roto :: Porque lo pide JSON
escribe :: Explica con un ejemplo de la vida real qué es localStorage y qué cuidado hay que tener. :: Es como la guantera del carro: guardas cosas y siguen ahí mañana, pero son de ese carro y cualquiera que entre las puede ver. Por eso sirve para preferencias y datos que no son secretos, y se lee con cuidado porque puede no estar o estar roto.
```

## Parte 4. Una pieza que guarda los datos (el "repositorio")

En una app ordenada, **las pantallas no hablan con localStorage directamente**. Hay una pieza que se encarga de guardar y leer, y las pantallas le piden a ella. Se le suele llamar **repositorio** (como el `SanRepository` de Copiloto, clase 10).

```js
function crearRepositorio(almacen, llave) {
  return {
    listar: () => leerLista(almacen, llave),
    agregar(gasto) {
      const lista = [...leerLista(almacen, llave), gasto];
      guardarLista(almacen, llave, lista);
      return lista;
    },
  };
}
```

¿Para qué tanta vuelta? Porque si mañana los gastos se guardan en **Firebase** en vez de localStorage, **solo cambia el repositorio**: las pantallas siguen pidiendo `listar()` y `agregar()` igual. Es la separación de **datos**, **lógica** y **pantallas** de la clase 50.

> 🌎 **En la vida real:** es como el depósito de un restaurante con un encargado: los cocineros le piden "dame tomates" y no les importa si los tomates están en la nevera grande o en la chica. Si mañana cambian de nevera, los cocineros ni se enteran.

> 🌎 **Otro ejemplo:** es como el cajero del banco: tú pides "deposita esto" sin saber en qué bóveda queda guardado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El repositorio de gastos
lenguaje: js
pide: Completa `crearRepositorio(almacen)`: `listar()` devuelve los gastos guardados; `agregar(tipo, valor, fecha)` valida que el valor sea mayor que 0 (si no, lanza un error), le pone un `id` que sigue al mayor que ya exista (o 1 si no hay ninguno), lo guarda y lo devuelve; `borrar(id)` lo quita y guarda. Usa las funciones `leerLista` y `guardarLista`, que ya están. La llave es `'gastos'`.
--- código
function guardarLista(almacen, llave, lista) {
  almacen.setItem(llave, JSON.stringify(lista));
}

function leerLista(almacen, llave) {
  try {
    const lista = JSON.parse(almacen.getItem(llave) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function crearRepositorio(almacen) {
  const LLAVE = 'gastos';
  return {
    listar() {
      // tu código aquí
    },
    agregar(tipo, valor, fecha) {
      // tu código aquí
    },
    borrar(id) {
      // tu código aquí
    },
  };
}
--- pruebas
const crearAlmacen = () => { const d = {}; return { getItem: (k) => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); } }; };
prueba('empieza vacío', () => igual(crearRepositorio(crearAlmacen()).listar(), []));
prueba('agregar pone id 1 y guarda', () => { const r = crearRepositorio(crearAlmacen()); igual(r.agregar('lavado', 30, '2026-11-18'), { id: 1, tipo: 'lavado', valor: 30, fecha: '2026-11-18' }); });
prueba('el segundo tiene id 2', () => { const r = crearRepositorio(crearAlmacen()); r.agregar('a', 1, 'x'); igual(r.agregar('b', 2, 'x').id, 2); });
prueba('lo guardado sigue ahí con otro repositorio del mismo almacén', () => { const a = crearAlmacen(); crearRepositorio(a).agregar('peaje', 8, 'x'); igual(crearRepositorio(a).listar().length, 1); });
prueba('un valor 0 da error y no guarda', () => { const r = crearRepositorio(crearAlmacen()); let fallo = false; try { r.agregar('x', 0, 'x'); } catch (e) { fallo = true; } igual([fallo, r.listar().length], [true, 0]); });
prueba('borrar quita el gasto', () => { const r = crearRepositorio(crearAlmacen()); const g = r.agregar('a', 1, 'x'); r.agregar('b', 2, 'x'); r.borrar(g.id); igual(r.listar().map((x) => x.tipo), ['b']); });
prueba('después de borrar, el id sigue al mayor', () => { const r = crearRepositorio(crearAlmacen()); r.agregar('a', 1, 'x'); const b = r.agregar('b', 2, 'x'); r.borrar(1); igual(r.agregar('c', 3, 'x').id, b.id + 1); });
--- solución
function guardarLista(almacen, llave, lista) {
  almacen.setItem(llave, JSON.stringify(lista));
}

function leerLista(almacen, llave) {
  try {
    const lista = JSON.parse(almacen.getItem(llave) ?? '[]');
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function crearRepositorio(almacen) {
  const LLAVE = 'gastos';
  return {
    listar() {
      return leerLista(almacen, LLAVE);
    },
    agregar(tipo, valor, fecha) {
      if (!(valor > 0)) throw new Error('El valor tiene que ser mayor que 0');
      const lista = leerLista(almacen, LLAVE);
      const id = lista.reduce((mayor, g) => Math.max(mayor, g.id), 0) + 1;
      const nuevo = { id, tipo, valor, fecha };
      guardarLista(almacen, LLAVE, [...lista, nuevo]);
      return nuevo;
    },
    borrar(id) {
      guardarLista(almacen, LLAVE, leerLista(almacen, LLAVE).filter((g) => g.id !== id));
    },
  };
}
```

```practica
vf :: En una app ordenada, las pantallas le piden los datos al repositorio en vez de hablar directo con localStorage
vf :: Si los gastos pasan de localStorage a Firebase, hay que cambiar todas las pantallas
elige :: ¿Qué es un repositorio en una app? :: Una carpeta de GitHub :: La pieza que se encarga de guardar y leer los datos :: Una pantalla
elige :: ¿Cómo se calcula el id de un gasto nuevo para que no se repita después de borrar? :: El largo de la lista + 1 :: El mayor id que existe + 1 :: Un número al azar
escribe :: Explica con un ejemplo de la vida real para qué sirve un repositorio. :: Es como el encargado del depósito de un restaurante: los cocineros le piden lo que necesitan sin saber en qué nevera está. Si se cambia de nevera (de localStorage a Firebase), los cocineros (las pantallas) ni se enteran.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas fechas en JavaScript?":** "Guardo las fechas como texto ISO, AAAA-MM-DD, porque se ordena bien y todos lo entienden. Tengo presente que los meses de Date van de 0 a 11. Para calcular resto fechas, que por dentro son milisegundos, y para mostrarlas uso toLocaleDateString e Intl.NumberFormat, así salen como se usan en cada país."

> 🎤 **Si te preguntan "¿dónde guardas los datos en una app web sencilla?":** "En localStorage, con JSON, siempre dentro de un try/catch porque puede no estar disponible, y nunca datos secretos. Y no lo uso directo desde las pantallas: hay un repositorio que guarda y lee, así mañana puedo cambiar a Firebase sin tocar las pantallas."

> 🌎 **En la vida real:** es como explicar cómo llevas la libreta de un taller: cómo anotas las fechas para encontrarlas rápido, y quién es el encargado de guardarla.

> 🌎 **Otro ejemplo:** Es como contar cómo organizas un archivo: el formato de cada ficha, y quién la busca cuando alguien la pide.
