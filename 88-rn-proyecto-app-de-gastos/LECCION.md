# React Native 8: proyecto final, la app de gastos

> 🌎 **En la vida real:** el aprendiz de costurero ya sabe cortar, coser una manga y poner botones. Su examen final es una camisa entera, que alguien se pueda poner y usar todos los días. Esta clase es tu camisa entera.

> 🎙️ **El profesor dice:** {{alumno}}, hoy juntas todo el curso en **una app de verdad para el teléfono**: anotar los gastos del carro, ver el total de la semana, borrar, y que nada se pierda al cerrar la app. Es la misma idea de la web de la clase 84 y de la API de la clase 87, pero ahora en React Native con Expo y TypeScript, como Copiloto. La recorres **pieza por pieza**, en cada parte escribes tú una pieza en el ejercicio, y al final la abres en tu iPhone con Expo Go.

**Lo que vas a recorrer** (está completo en la carpeta `88-rn-proyecto-app-de-gastos/proyecto` de este mismo repositorio):

| Pieza | Archivo | Su única tarea |
|---|---|---|
| El motor de diseño | `src/tema/motor.ts` | Colores, separaciones, formas y letras, en un solo lugar |
| La lógica | `src/logica/gastos.ts` | Las reglas y las cuentas. Sin pantalla ni teléfono |
| Los datos | `src/datos/repositorio.ts` | Guardar y leer la lista (en el teléfono o en memoria) |
| El hook | `src/hooks/useGastos.ts` | Junta el estado de la lista con el repositorio |
| Las piezas | `src/componentes/` | El formulario, una tarjeta y el resumen |
| La pantalla | `src/pantallas/PantallaGastos.tsx` | Junta las piezas: los datos bajan, los avisos suben |
| El director | `App.tsx` | Crea el repositorio una vez y arma la app |
| Las pruebas | `__tests__/` en cada carpeta | 27 pruebas con Jest y Testing Library |

## Parte 1. El plano: qué hace, qué no, y las puertas y ventanas

Antes del código, el plano (clase 79):

1. **El problema:** un conductor quiere anotar sus gastos del carro **en el teléfono**, donde está todo el día, y saber cuánto gastó esta semana.
2. **Lo que hace:** anotar un gasto (tipo, valor, fecha); ver la lista, con lo más nuevo arriba; ver el total de la semana (de lunes a hoy); borrar.
3. **Lo que NO hace (por ahora):** cuentas de usuario, la nube, varios carros. Todo queda **en el teléfono**.
4. **Los datos:** cada gasto tiene `id`, `tipo` (combustible, lavado, peaje, mantenimiento u otro), `valor` y `fecha` (`AAAA-MM-DD`).
5. **Las pantallas:** una sola: el resumen arriba, el formulario y la lista.
6. **Cómo sé que funciona:** anoto dos gastos y el total los suma; cierro la app, la abro, y siguen ahí; borro uno, y desaparece también después de cerrar.

**Las puertas y ventanas:**

| Caso | Qué hace la app |
|---|---|
| Todavía no hay gastos | "Todavía no anotaste gastos" en vez de una lista vacía |
| Valor vacío, 0, negativo o letras | No guarda y dice "Escribe un valor mayor que 0" |
| Valor con coma (`12,50`, como en Brasil) | Lo entiende como 12.5 |
| Una fecha que no existe (`2026-02-31`) o en el futuro | No la acepta y dice por qué |
| Un gasto de la semana pasada | Sale en la lista, pero no suma en "Esta semana" |
| Lo guardado en el teléfono está roto | La app abre vacía en vez de quedar trabada |
| El teclado tapa el formulario | `KeyboardAvoidingView` lo sube (en el iPhone) |
| La isla o la barra de inicio del iPhone | `SafeAreaView` deja el contenido a la vista |

> 🌎 **En la vida real:** es como el plano de una cocina antes de comprar los muebles: dónde va la nevera, dónde el fogón y por dónde pasa la gente. Si compras primero, después nada encaja.

> 🌎 **Otro ejemplo:** las puertas y ventanas son como el manual de un electrodoméstico: qué pasa si se corta la luz, si lo llenas de más o si lo prendes sin agua. El fabricante lo pensó antes de venderlo.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Las puertas y ventanas de la app
lenguaje: js
pide: Completa `problemasDe(datos, hoy)`, como en `src/logica/gastos.ts`. Devuelve la lista de problemas en este orden: `'Elige un tipo de gasto'` si el tipo no está en `TIPOS`; `'Escribe un valor mayor que 0'` si el valor no es mayor que 0 (cuidado: `NaN > 0` es `false`); `'La fecha no puede ser en el futuro'` si la fecha (texto ISO) es mayor que `hoy`. La función `existeElDia` ya está hecha: si el día no existe, `'La fecha tiene que ser un día que exista (AAAA-MM-DD)'` (y no revises si es futuro).
--- código
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];
function existeElDia(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

function problemasDe(datos, hoy) {
  const problemas = [];
  // tu código aquí
  return problemas;
}
--- pruebas
const HOY = '2026-11-18';
const bien = { tipo: 'lavado', valor: 30, fecha: HOY };
prueba('todo bien', () => igual(problemasDe(bien, HOY), []));
prueba('valor vacío (NaN), 0 o negativo', () => igual([NaN, 0, -5].map((valor) => problemasDe({ ...bien, valor }, HOY)), [['Escribe un valor mayor que 0'], ['Escribe un valor mayor que 0'], ['Escribe un valor mayor que 0']]));
prueba('un tipo inventado', () => igual(problemasDe({ ...bien, tipo: 'casino' }, HOY), ['Elige un tipo de gasto']));
prueba('el 31 de febrero', () => igual(problemasDe({ ...bien, fecha: '2026-02-31' }, HOY), ['La fecha tiene que ser un día que exista (AAAA-MM-DD)']));
prueba('mañana todavía no', () => igual(problemasDe({ ...bien, fecha: '2026-11-19' }, HOY), ['La fecha no puede ser en el futuro']));
prueba('todo mal a la vez', () => igual(problemasDe({ tipo: '', valor: 0, fecha: 'ayer' }, HOY).length, 3));
--- solución
const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];
function existeElDia(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d));
  return f.getUTCFullYear() === a && f.getUTCMonth() === m - 1 && f.getUTCDate() === d;
}

function problemasDe(datos, hoy) {
  const problemas = [];
  if (!TIPOS.includes(datos.tipo)) problemas.push('Elige un tipo de gasto');
  if (!(datos.valor > 0)) problemas.push('Escribe un valor mayor que 0');
  if (!existeElDia(datos.fecha)) problemas.push('La fecha tiene que ser un día que exista (AAAA-MM-DD)');
  else if (datos.fecha > hoy) problemas.push('La fecha no puede ser en el futuro');
  return problemas;
}
```

```practica
vf :: El plano dice también lo que la app NO hace por ahora, como las cuentas de usuario y la nube
vf :: Un gasto de la semana pasada no aparece en la lista
elige :: ¿Por qué !(datos.valor > 0) y no datos.valor <= 0? :: Es lo mismo :: Porque NaN <= 0 también da false, y así un valor vacío pasaría :: Porque es más corto
elige :: ¿Qué hace la app si lo guardado en el teléfono está roto? :: Se cierra sola :: Abre vacía en vez de quedar trabada :: Borra el teléfono
escribe :: Escribe tres "puertas y ventanas" de esta app y qué hace en cada una. :: Sin gastos: muestra "Todavía no anotaste gastos". Valor 0 o vacío: no guarda y dice por qué. Fecha en el futuro: no la acepta. (También: coma de Brasil, el 31 de febrero, la semana pasada, datos rotos, el teclado y la isla del iPhone.)
```

## Parte 2. El motor de diseño y las piezas

**Ningún componente escribe un color a mano.** Todos los valores de diseño viven en `src/tema/motor.ts`:

```ts
export const color = {
  fondo: '#0f141b',
  tarjeta: '#18212c',
  borde: '#2b3644',
  texto: '#e6edf3',
  tenue: '#8796aa',
  acento: '#7ee787',
  sobreAcento: '#0f141b', // el texto que va encima del verde
  peligro: '#ff7b72',
} as const;

export const espacio = { chico: 8, medio: 14, grande: 20 } as const;
export const forma = { radio: 14, radioChico: 8 } as const;
export const letra = { chica: 14, normal: 16, grande: 30 } as const;
```

Y cada estilo "llama" al motor (clase 56):

```tsx
const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: color.tarjeta, borderRadius: forma.radio, padding: espacio.medio },
  valor: { color: color.texto, fontSize: letra.normal, fontWeight: '700' },
});
```

`as const` le dice a TypeScript que esos valores **no cambian**: si escribes `color.verde` (que no existe), te avisa antes de correr la app.

Las piezas siguen las reglas de las clases 54 y 56:

- **`Resumen`** solo muestra lo que le pasan (`total`, `cantidad`): no calcula ni guarda.
- **`TarjetaGasto`** muestra un gasto y **avisa** con `alBorrar(id)`. Va envuelta en `memo` (clase 59).
- **`FormularioGasto`** es **controlado** (clase 55): cada `TextInput` muestra lo que hay en su estado. Los tipos son botones (`Pressable`) en una fila que se parte en dos (`flexWrap: 'wrap'`) si no cabe.

> 🌎 **En la vida real:** el motor es como la paleta de pintura de un pintor de casas: todas las paredes salen de esos mismos tarros. Si el dueño quiere un verde más claro, se cambia **un** tarro, no se repinta pared por pared buscando el verde viejo.

> 🌎 **Otro ejemplo:** es como el uniforme de una empresa: todos usan las mismas prendas. Si cambia el logo, se cambia en el uniforme, no en cada persona.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El candado del motor
lenguaje: js
pide: Completa `coloresSueltos(estilos, color)`, un candado que revisa los estilos. `estilos` es como el de `StyleSheet.create` (nombre → objeto de estilo). Devuelve la lista `'nombre.propiedad'` de cada valor que es un color escrito a mano (un texto que empieza con `#`) y que **no** está entre los valores del motor `color`. Si todo sale del motor, `[]`.
--- código
function coloresSueltos(estilos, color) {
  // tu código aquí
}
--- pruebas
const color = { fondo: '#0f141b', texto: '#e6edf3', acento: '#7ee787' };
prueba('todo sale del motor', () => igual(coloresSueltos({ tarjeta: { backgroundColor: color.fondo, padding: 14 }, valor: { color: color.acento } }, color), []));
prueba('un verde escrito a mano', () => igual(coloresSueltos({ valor: { color: '#00ff00', fontSize: 16 } }, color), ['valor.color']));
prueba('varios, en orden', () => igual(coloresSueltos({ a: { color: '#111', borderColor: color.texto }, b: { backgroundColor: '#fff' } }, color), ['a.color', 'b.backgroundColor']));
prueba('un texto que no es color no cuenta', () => igual(coloresSueltos({ fila: { flexDirection: 'row', fontWeight: '700' } }, color), []));
--- solución
function coloresSueltos(estilos, color) {
  const delMotor = Object.values(color);
  const sueltos = [];
  for (const [nombre, estilo] of Object.entries(estilos)) {
    for (const [propiedad, valor] of Object.entries(estilo)) {
      if (typeof valor === 'string' && valor.startsWith('#') && !delMotor.includes(valor)) sueltos.push(`${nombre}.${propiedad}`);
    }
  }
  return sueltos;
}
```

```practica
vf :: En esta app, un componente puede escribir '#00ff00' en su estilo si le gusta más ese verde
vf :: TarjetaGasto borra el gasto ella misma
elige :: ¿Para qué sirve as const en el motor? :: Para que la app sea más rápida :: Para que TypeScript sepa que los valores no cambian y avise si usas uno que no existe :: Para exportarlo
elige :: ¿Qué hace flexWrap: 'wrap' en la fila de tipos? :: Los esconde :: Si no caben en una fila, pasan a la siguiente :: Los pone en columna
escribe :: Explica con tus palabras qué es el motor de diseño y cómo lo "llama" un componente. :: Es un archivo con todos los colores, separaciones, formas y letras de la app. Cada estilo usa esos valores (color.tarjeta, espacio.medio) en vez de escribir números o colores a mano, así cambiar el diseño es cambiar un solo lugar.
```

## Parte 3. La lógica, con sus pruebas

`src/logica/gastos.ts` tiene las reglas y las cuentas. **No importa React ni nada del teléfono**: por eso sus 16 pruebas corren en milisegundos.

```ts
/** El lunes de la semana de "hoy", como AAAA-MM-DD. */
export function inicioDeSemana(hoy: string): string {
  const [a, m, d] = hoy.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  const desdeElLunes = (fecha.getUTCDay() + 6) % 7; // domingo = 6, lunes = 0
  fecha.setUTCDate(fecha.getUTCDate() - desdeElLunes);
  return fecha.toISOString().slice(0, 10);
}

export function totalDeLaSemana(lista: Gasto[], hoy: string) {
  const lunes = inicioDeSemana(hoy);
  const deEstaSemana = lista.filter((g) => g.fecha >= lunes && g.fecha <= hoy);
  return { total: redondear(deEstaSemana.reduce((s, g) => s + g.valor, 0)), cantidad: deEstaSemana.length };
}
```

Tres detalles que vale la pena entender:

- **`getUTCDay()`** da 0 para el domingo y 1 para el lunes. Con `(día + 6) % 7`, el lunes queda en 0 y el domingo en 6: los días que hay que volver para llegar al lunes.
- **`hoy` entra como parámetro**, no se lee adentro con `new Date()`. Así una prueba puede decir "hoy es miércoles 18" y dar siempre lo mismo, cualquier día que se corra.
- **`hoyISO()`** arma la fecha con la hora **del teléfono** (`getFullYear`, `getMonth`, `getDate`). Si usaras `toISOString()`, a las 22:00 en Brasil ya sería "mañana", porque esa función usa la hora de Londres.

Y el dinero, como se escribe en Brasil:

```ts
export function dinero(valor: number): string {
  const [entero, centavos] = Math.abs(valor).toFixed(2).split('.');
  const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${valor < 0 ? '-' : ''}R$ ${conPuntos},${centavos}`;
}
```

> 🌎 **En la vida real:** la lógica separada es como la receta escrita en un papel: la puedes probar en cualquier cocina, sin importar si el fogón es de gas o eléctrico. La pantalla es el fogón.

> 🌎 **Otro ejemplo:** pasar `hoy` de afuera es como el reloj de un examen: si el profesor dice "son las 10", todos calculan con la misma hora, aunque el reloj de cada uno esté un poco adelantado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El dinero como en Brasil
lenguaje: js
pide: Completa `dinero(valor)`: devuelve el valor con `R$`, **punto** para los miles y **coma** para los centavos, siempre con dos centavos. `1234.5` → `'R$ 1.234,50'`. Si es negativo, el `-` va adelante: `'-R$ 30,00'`. Pista: `toFixed(2)` y después separa el entero de los centavos.
--- código
function dinero(valor) {
  // tu código aquí
}
--- pruebas
prueba('sin miles', () => igual(dinero(30), 'R$ 30,00'));
prueba('con centavos', () => igual(dinero(5.4), 'R$ 5,40'));
prueba('con miles', () => igual(dinero(1234.5), 'R$ 1.234,50'));
prueba('con millones', () => igual(dinero(1234567.891), 'R$ 1.234.567,89'));
prueba('cero', () => igual(dinero(0), 'R$ 0,00'));
prueba('negativo', () => igual(dinero(-30), '-R$ 30,00'));
--- solución
function dinero(valor) {
  const [entero, centavos] = Math.abs(valor).toFixed(2).split('.');
  const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${valor < 0 ? '-' : ''}R$ ${conPuntos},${centavos}`;
}
```

```practica
vf :: La lógica de gastos.ts importa React para poder calcular el total
vf :: Pasar hoy como parámetro hace que las pruebas den lo mismo cualquier día que se corran
elige :: Son las 22:00 en Brasil. ¿Qué pasa si armas la fecha de hoy con toISOString()? :: Nada, da lo mismo :: Puede dar el día de mañana, porque usa la hora de Londres :: Da error
elige :: Hoy es domingo 22. ¿Desde qué día suma "Esta semana"? :: Desde el domingo 22 :: Desde el lunes 16 :: Desde el lunes 23
escribe :: ¿Por qué la lógica va en un archivo aparte de la pantalla? :: Porque así se prueba sola, rápido y sin teléfono, y si mañana cambia la pantalla o se hace una web, las reglas y las cuentas son las mismas.
```

## Parte 4. Guardar en el teléfono: el repositorio y el hook

El repositorio es un **contrato** de dos funciones, como el almacén de la API (clase 87):

```ts
export interface Repositorio {
  leer(): Promise<Gasto[]>;
  guardar(lista: Gasto[]): Promise<void>;
}

export const CLAVE = 'gastos-del-carro:v1';

export function crearRepositorioTelefono(almacen: AlmacenDeTexto = AsyncStorage): Repositorio {
  return {
    async leer() {
      const texto = await almacen.getItem(CLAVE);
      if (texto === null) return [];
      try {
        const datos = JSON.parse(texto);
        return Array.isArray(datos) ? datos : [];
      } catch {
        return [];
      }
    },
    async guardar(lista) {
      await almacen.setItem(CLAVE, JSON.stringify(lista));
    },
  };
}
```

- **`almacen` entra de afuera** (por defecto, `AsyncStorage`). Así las pruebas le pasan uno de mentira, sin teléfono.
- **La `v1` en la clave** deja cambiar la forma de los datos más adelante (una `v2`) sin leer la basura vieja.
- Hay un segundo repositorio, **en memoria**, para las pruebas de la pantalla.

El hook `useGastos` junta todo con **dos efectos** (clase 55):

```ts
// 1. Al aparecer: leer lo guardado, con limpieza.
useEffect(() => {
  let activo = true;
  repositorio.leer().then((lista) => {
    if (!activo) return;
    enElTelefono.current = lista;
    setGastos(lista);
  });
  // (también atrapa el error y apaga el "cargando")
  return () => { activo = false; };
}, [repositorio]);

// 2. Cada vez que la lista cambia (después de leer), se guarda.
useEffect(() => {
  if (enElTelefono.current === null || enElTelefono.current === gastos) return;
  enElTelefono.current = gastos;
  repositorio.guardar(gastos).catch(() => setAviso('No se pudo guardar en el teléfono'));
}, [gastos, repositorio]);
```

`enElTelefono` es un **`useRef`**: una cajita que guarda un valor **sin** volver a dibujar. Sirve para dos cosas: no guardar nada **antes** de haber leído (si no, la lista vacía del principio borraría lo guardado), y no volver a guardar la misma lista que se acaba de leer.

> 🌎 **En la vida real:** es como abrir tu cuaderno de gastos antes de anotar: si empiezas a escribir en una hoja en blanco y la pegas encima del cuaderno, pierdes todo lo de antes. Primero lees, después anotas.

> 🌎 **Otro ejemplo:** el `useRef` es como un papelito en el bolsillo: te acuerdas de algo sin tener que avisarle a nadie. El estado, en cambio, es como cambiar el cartel de la tienda: todos lo ven.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Leer la lista sin trabar la app
lenguaje: js
pide: Completa `leerLista(texto)`, lo que hace el repositorio con el texto guardado en el teléfono. Si es `null` (nada guardado), `[]`. Si el JSON está roto, `[]`. Si no es un array, `[]`. Si es un array, devuelve **solo** los gastos que tienen `id` de texto, `valor` número y `fecha` de texto (uno roto no debe tirar abajo a los demás).
--- código
function leerLista(texto) {
  // tu código aquí
}
--- pruebas
const g = { id: 'a', tipo: 'lavado', valor: 30, fecha: '2026-11-18' };
prueba('nada guardado', () => igual(leerLista(null), []));
prueba('una lista buena', () => igual(leerLista(JSON.stringify([g])), [g]));
prueba('JSON roto', () => igual(leerLista('{roto'), []));
prueba('no es una lista', () => igual(leerLista('{"no":"lista"}'), []));
prueba('un gasto roto no tira abajo a los demás', () => igual(leerLista(JSON.stringify([g, { id: 7, valor: 'mucho' }, null])), [g]));
--- solución
function leerLista(texto) {
  if (texto === null) return [];
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    return [];
  }
  if (!Array.isArray(datos)) return [];
  return datos.filter((x) => x && typeof x.id === 'string' && typeof x.valor === 'number' && typeof x.fecha === 'string');
}
```

```practica
vf :: El repositorio recibe el AsyncStorage de afuera para poder probarlo con uno de mentira
vf :: Si el hook guardara apenas aparece la pantalla, antes de leer, no pasaría nada malo
elige :: ¿Qué es un useRef? :: Un estado que redibuja la pantalla :: Una cajita que guarda un valor sin volver a dibujar :: Un efecto
elige :: ¿Para qué la v1 en la clave gastos-del-carro:v1? :: Por estilo :: Para poder cambiar la forma de los datos más adelante sin leer lo viejo como si fuera nuevo :: Porque AsyncStorage lo exige
escribe :: Cuenta en orden qué pasa desde que abres la app hasta que ves tus gastos. :: La pantalla aparece con "cargando", el primer efecto le pide al repositorio que lea; el repositorio lee el texto de AsyncStorage y lo convierte con JSON.parse; el hook guarda la lista en el estado y en el ref, apaga el cargando, y la FlatList dibuja las tarjetas.
```

## Parte 5. La pantalla: juntar las piezas

```tsx
export function PantallaGastos({ repositorio, hoy = hoyISO() }: Props) {
  const { gastos, cargando, aviso, agregarGasto, borrarGasto } = useGastos(repositorio);
  const semana = useMemo(() => totalDeLaSemana(gastos, hoy), [gastos, hoy]);

  const alGuardar = useCallback((datos: DatosGasto) => agregarGasto(crearGasto(datos, nuevoId())), [agregarGasto]);
  const dibujarTarjeta = useCallback(
    ({ item }: { item: Gasto }) => <TarjetaGasto gasto={item} alBorrar={borrarGasto} />,
    [borrarGasto],
  );

  return (
    <SafeAreaView style={estilos.pantalla}>
      <KeyboardAvoidingView style={estilos.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* el título, el Resumen, el FormularioGasto y el aviso */}
        {cargando ? (
          <ActivityIndicator color={color.acento} />
        ) : (
          <FlatList
            data={gastos}
            keyExtractor={(g) => g.id}
            renderItem={dibujarTarjeta}
            ListEmptyComponent={<Text style={estilos.vacio}>Todavía no anotaste gastos</Text>}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
```

Todo lo del curso, en una pantalla:

| Lo que ves | Para qué | Clase |
|---|---|---|
| `useMemo` del total | No recalcular la semana en cada dibujo si la lista no cambió | 59 |
| `useCallback` | Que `alBorrar` sea **la misma** función: si no, el `memo` de cada tarjeta no sirve | 59 |
| `FlatList` + `keyExtractor` | Dibuja solo lo que se ve, y cada tarjeta con su id | 56 |
| `ListEmptyComponent` | La puerta "todavía no hay gastos" | 56 |
| `SafeAreaView` y `KeyboardAvoidingView` | La isla del iPhone y el teclado | 56 |
| `hoy = hoyISO()` | En la app, hoy; en las pruebas, un día fijo | 60 |

### El error que encontramos: el más nuevo quedaba abajo

Probando la app de verdad, se anotaron dos lavados el mismo día. El segundo quedó **abajo**, aunque el código decía "lo más nuevo arriba". La función ordenaba por fecha, y con la misma fecha **no movía nada**: el nuevo, que se agregaba al final, se quedaba al final.

El arreglo fue **una sola cosa**: poner el nuevo **primero** antes de ordenar. `sort()` en JavaScript es **estable**: si dos elementos son "iguales" para la comparación, quedan en el orden en que estaban.

```ts
export function agregar(lista: Gasto[], gasto: Gasto): Gasto[] {
  return [gasto, ...lista].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
}
```

Primero se escribió la prueba "del mismo día, el que acabas de anotar queda arriba". Salió en rojo, se hizo el cambio, y salió en verde.

> 🌎 **En la vida real:** es como la pila de facturas en el escritorio: la que acaba de llegar va arriba. Si las ordenas por mes y dos son del mismo mes, la nueva sigue arriba solo si la pusiste arriba al dejarla.

> 🌎 **Otro ejemplo:** `useCallback` es como darle a cada tarjeta el **mismo** número de teléfono para avisar. Si cada vez le das un número nuevo, la tarjeta cree que algo cambió y se vuelve a dibujar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Lo más nuevo, arriba
lenguaje: js
pide: Completa `agregar(lista, gasto)`: devuelve una lista **nueva** (sin tocar la original) con el gasto agregado, ordenada por fecha de la más nueva a la más vieja. Entre dos gastos del **mismo día**, el que acabas de agregar va **arriba**. Las fechas son textos ISO, que se comparan con `<` y `>`.
--- código
function agregar(lista, gasto) {
  // tu código aquí
}
--- pruebas
const g = (id, fecha) => ({ id, fecha });
prueba('por fecha, lo más nuevo arriba', () => igual(agregar([g('a', '2026-11-10')], g('b', '2026-11-18')).map((x) => x.id), ['b', 'a']));
prueba('uno viejo va abajo', () => igual(agregar([g('a', '2026-11-18')], g('b', '2026-11-01')).map((x) => x.id), ['a', 'b']));
prueba('del mismo día: el nuevo arriba', () => igual(agregar(agregar([], g('primero', '2026-11-18')), g('segundo', '2026-11-18')).map((x) => x.id), ['segundo', 'primero']));
prueba('no toca la original', () => { const l = [g('a', '2026-11-10')]; const n = agregar(l, g('b', '2026-11-18')); igual(l.length, 1); ok(n !== l, 'una lista nueva'); });
--- solución
function agregar(lista, gasto) {
  return [gasto, ...lista].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
}
```

```practica
vf :: Sin useCallback, el memo de TarjetaGasto no sirve, porque alBorrar sería una función nueva en cada dibujo
vf :: En JavaScript, sort() puede cambiar el orden de dos elementos que son iguales para la comparación
elige :: ¿Para qué el useMemo del total de la semana? :: Para guardarlo en el teléfono :: Para no recalcularlo en cada dibujo si la lista y el día no cambiaron :: Para que se vea en verde
elige :: ¿Por qué PantallaGastos recibe hoy con un valor por defecto? :: Para que el usuario lo cambie :: Para que en la app sea hoy y en las pruebas un día fijo :: Porque FlatList lo pide
escribe :: Cuenta el error del orden y cómo se arregló. :: Dos gastos del mismo día quedaban con el más nuevo abajo, porque se agregaba al final y el orden por fecha no lo movía. Se escribió primero la prueba en rojo y se arregló poniendo el nuevo primero antes de ordenar, porque sort() es estable.
```

## Parte 6. Probarla y abrirla en tu teléfono

### Bajarla y correr las pruebas

```bash
git clone --depth 1 https://github.com/DelvinSmart/estudios.git
cd estudios/88-rn-proyecto-app-de-gastos/proyecto
npm install
npm test
npm run tipos
```

Tienen que salir **27 pruebas en verde** y `npm run tipos` sin errores. Las pruebas están en tres capas:

| Pruebas | Qué revisan |
|---|---|
| `src/logica/__tests__` | Las reglas y las cuentas (16) |
| `src/datos/__tests__` | El repositorio, con un AsyncStorage de mentira (4) |
| `src/componentes/__tests__` y `src/pantallas/__tests__` | El formulario y la pantalla entera, **como los usa una persona** (7) |

Una prueba de la pantalla (Testing Library, clase 60):

```tsx
test('anotar dos gastos: aparecen, el total suma y quedan guardados', async () => {
  const repositorio = crearRepositorioMemoria();
  const persona = userEvent.setup();
  await render(<PantallaGastos repositorio={repositorio} hoy={HOY} />);
  await screen.findByText('Todavía no anotaste gastos');

  await anotar(persona, 'lavado', '30');
  await anotar(persona, 'peaje', '5,40');

  expect(screen.getByText('R$ 35,40')).toBeOnTheScreen();
  expect(screen.getByText('2 gastos')).toBeOnTheScreen();
  expect(repositorio.guardado().map((g) => g.tipo).sort()).toEqual(['lavado', 'peaje']);
});
```

**Un error de prueba que vale la pena conocer:** una de estas pruebas buscaba el texto "combustible" y falló con *"Found multiple elements with text: combustible"*. La app estaba bien: esa palabra está **dos veces** en la pantalla, en el botón del formulario y en la tarjeta. Se arregló buscando la tarjeta por su etiqueta exacta (`accessibilityLabel`, "Borrar combustible de R$ 150,00"). Las etiquetas sirven para las pruebas **y** para las personas que usan el lector de pantalla del iPhone.

### Abrirla en tu iPhone (gratis)

```bash
npx expo start
```

Escanea el QR con la cámara del iPhone y se abre en **Expo Go** (clase 57). Anota un gasto, cierra Expo Go del todo y ábrelo otra vez: el gasto sigue ahí. Con `npm run web` también se abre en el navegador, que sirve para mirarla rápido en la computadora.

Para tenerla como una app más, con su ícono, en Android: un **APK** con EAS Build o compilado en tu Mac (clases 60 y 20). Antes de cada versión nueva, sube `versionCode` y `buildNumber` en `app.json`. Y cambia `com.tuusuario.gastosdelcarro` por **tu** nombre: ese paquete es el documento de identidad de la app, y no se puede cambiar después de publicarla.

> 🌎 **En la vida real:** es como el ensayo general antes del estreno: los actores pasan la obra entera, con vestuario, y el director mira desde la butaca como un espectador. Las pruebas de la pantalla son ese espectador.

> 🌎 **Otro ejemplo:** la etiqueta de accesibilidad es como el nombre escrito en la puerta de cada oficina: le sirve al cartero (la prueba) y a la visita que no conoce el edificio (el lector de pantalla).

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Encontrar uno solo, como getBy
lenguaje: js
pide: Completa `obtenerUno(elementos, buscar)`, como `getByText` de Testing Library. `elementos` es una lista de `{ texto, etiqueta }`. Busca los que tienen `texto` **o** `etiqueta` igual a `buscar`. Si hay exactamente uno, devuélvelo. Si no hay ninguno, lanza `Error('No encontré "buscar"')`. Si hay más de uno, lanza `Error('Encontré N con "buscar"')`: una prueba tiene que saber **exactamente** qué toca.
--- código
function obtenerUno(elementos, buscar) {
  // tu código aquí
}
--- pruebas
const pantalla = [
  { texto: 'combustible', etiqueta: null },
  { texto: 'lavado', etiqueta: null },
  { texto: 'combustible', etiqueta: null },
  { texto: 'Borrar', etiqueta: 'Borrar combustible de R$ 150,00' },
];
const mensaje = (fn) => { try { fn(); return null; } catch (e) { return e.message; } };
prueba('uno solo', () => igual(obtenerUno(pantalla, 'lavado'), { texto: 'lavado', etiqueta: null }));
prueba('por su etiqueta', () => igual(obtenerUno(pantalla, 'Borrar combustible de R$ 150,00').texto, 'Borrar'));
prueba('más de uno: error', () => igual(mensaje(() => obtenerUno(pantalla, 'combustible')), 'Encontré 2 con "combustible"'));
prueba('ninguno: error', () => igual(mensaje(() => obtenerUno(pantalla, 'peaje')), 'No encontré "peaje"'));
--- solución
function obtenerUno(elementos, buscar) {
  const hallados = elementos.filter((e) => e.texto === buscar || e.etiqueta === buscar);
  if (hallados.length === 0) throw new Error(`No encontré "${buscar}"`);
  if (hallados.length > 1) throw new Error(`Encontré ${hallados.length} con "${buscar}"`);
  return hallados[0];
}
```

```practica
vf :: Si una prueba dice "Found multiple elements", seguro la app tiene un error
vf :: Un accessibilityLabel sirve para las pruebas y también para quien usa el lector de pantalla
elige :: ¿Qué comando abre la app en tu iPhone con Expo Go? :: npm test :: npx expo start, y escaneas el QR :: npm run tipos
elige :: ¿Por qué hay que cambiar com.tuusuario.gastosdelcarro antes de publicar? :: Porque es muy largo :: Porque es la identidad de la app y no se puede cambiar después de publicarla :: Porque Expo Go no lo acepta
escribe :: Escribe los comandos para bajar la app, probarla y abrirla en tu iPhone. :: git clone --depth 1 https://github.com/DelvinSmart/estudios.git, cd estudios/88-rn-proyecto-app-de-gastos/proyecto, npm install, npm test (27 en verde), npm run tipos, y npx expo start para escanear el QR con el iPhone y abrirla en Expo Go.
```


**Comprobación antes de seguir**

Registra un gasto, cierra la app, vuelve a abrirla y comprueba la lista y el total.

<details>
<summary>Necesito una pista</summary>

Si desaparece, revisa por separado la escritura y la lectura al arrancar.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿qué hiciste con React Native?":** "Una app de gastos del carro con Expo y TypeScript, como mi app Copiloto pero en chico. La separé en piezas con una sola tarea: un motor de diseño con todos los colores y medidas, la lógica pura con sus pruebas (las reglas, el total de la semana de lunes a hoy, el dinero como en Brasil), un repositorio con un contrato de dos funciones que guarda en AsyncStorage, un hook que lee antes de guardar para no pisar los datos, y la pantalla con FlatList, SafeArea, el teclado, memo y useCallback. Tiene 27 pruebas con Jest y Testing Library, que usan la pantalla como una persona. Probándola de verdad encontré que el gasto más nuevo quedaba abajo si era del mismo día; escribí la prueba en rojo y lo arreglé poniéndolo primero, porque sort es estable. La abro en mi iPhone con Expo Go."

> 🌎 **En la vida real:** es como mostrar la camisa que cosiste: cómo cortaste cada pieza, por qué la costura va por dentro, qué falló en el primer intento y cómo lo arreglaste. Eso dice más que mostrar una camisa perfecta sin contar nada.

> 🌎 **Otro ejemplo:** es como contar cómo armaste tu primer mueble de cocina: el plano, cada cajón por separado, y cómo comprobaste que los cajones abren y cierran antes de llenarlos.
