# La calculadora 2: la pantalla, el teléfono y la app de verdad

> 🌎 **En la vida real:** con el plano aprobado y los materiales elegidos (clase 94), ahora se levantan las paredes, se pintan, se prueban las puertas, y al final se entregan las llaves. Esta clase es la obra y la entrega.

> 🎙️ **El profesor dice:** {{alumno}}, en la clase 94 hiciste todo lo que va antes de un botón. Ahora: el teclado como datos, las teclas que llaman al motor, la pantalla que junta todo, lo que se encontró **mirando** la app (y ninguna prueba veía), y cómo pasa de tu computadora a **tu teléfono**, primero con Expo Go y después como una app instalada de verdad.

El proyecto es el mismo: `94-rn-proyecto-calculadora/proyecto`.

## Parte 1. El teclado como datos

> 🌎 **En la vida real:** es como el plano de los asientos de un avión: una tabla dice qué asiento va en cada fila y de qué clase es. El avión se arma **leyendo la tabla**; para cambiar la distribución no se rompe ninguna pared, se cambia la tabla.

Una forma de hacer el teclado es escribir 20 botones a mano, uno debajo del otro. Funciona, pero cambiar el orden de dos teclas es mover bloques de código. La otra forma es que **el teclado sea datos**, en `src/logica/teclado.ts`:

```ts
export const FILAS: Tecla[][] = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['⌫', '0', ',', '='],
];
```

La pantalla **recorre** esa lista y dibuja una tecla por cada elemento (parte 3). Para mover `⌫` a otro lugar, cambias la tabla: **ningún componente se toca**. Y como son datos, se pueden **probar**: hay una prueba que revisa que sean 5 filas de 4, y que ninguna tecla esté repetida.

**Cada tecla también sabe de qué tipo es** (`tipoDe`: número, función, operador o igual, que decide su color) y **cómo se lee en voz alta** (`etiquetaDe`):

```ts
const ETIQUETAS = { '÷': 'dividir', '×': 'multiplicar', '⌫': 'borrar el último', C: 'borrar todo', /* … */ };
```

Esto último no es un detalle: una persona que no ve usa el **lector de pantalla** (VoiceOver en el iPhone, TalkBack en Android), que lee en voz alta lo que tocas. Un `÷` leído en voz alta no dice nada; `"dividir"` sí. Es la **accesibilidad**, y en esta app es una regla de `AGENTS.md`.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El teclado como datos
lenguaje: js
pide: Completa `tipoDe(t)`: `'igual'` para `'='`; `'operador'` para `'+'`, `'−'`, `'×'` y `'÷'`; `'funcion'` para `'C'`, `'±'` y `'%'`; y `'numero'` para todo lo demás (dígitos, coma y ⌫). Y `etiquetaDe(t)`: lo que lee el lector de pantalla. Si la tecla está en `ETIQUETAS`, esa; si no (los dígitos), la tecla misma.
--- código
const ETIQUETAS = { '+': 'sumar', '−': 'restar', '×': 'multiplicar', '÷': 'dividir', '=': 'igual', C: 'borrar todo', '⌫': 'borrar el último', '±': 'cambiar el signo', '%': 'por ciento', ',': 'coma' };

function tipoDe(t) {
  // tu código aquí
}

function etiquetaDe(t) {
  // tu código aquí
}
--- pruebas
prueba('los tipos', () => igual(['7', ',', '⌫', '+', '÷', 'C', '%', '='].map(tipoDe), ['numero', 'numero', 'numero', 'operador', 'operador', 'funcion', 'funcion', 'igual']));
prueba('÷ se lee "dividir"', () => igual(etiquetaDe('÷'), 'dividir'));
prueba('⌫ se lee en español', () => igual(etiquetaDe('⌫'), 'borrar el último'));
prueba('un dígito se lee solo', () => igual(etiquetaDe('7'), '7'));
--- solución
const ETIQUETAS = { '+': 'sumar', '−': 'restar', '×': 'multiplicar', '÷': 'dividir', '=': 'igual', C: 'borrar todo', '⌫': 'borrar el último', '±': 'cambiar el signo', '%': 'por ciento', ',': 'coma' };

function tipoDe(t) {
  if (t === '=') return 'igual';
  if (t === '+' || t === '−' || t === '×' || t === '÷') return 'operador';
  if (t === 'C' || t === '±' || t === '%') return 'funcion';
  return 'numero';
}

function etiquetaDe(t) {
  return ETIQUETAS[t] ?? t;
}
```

```practica
vf :: Si el teclado es una lista de datos, cambiar el orden de las teclas no obliga a tocar ningún componente
vf :: La etiqueta para el lector de pantalla es opcional, porque el símbolo ÷ ya se entiende
elige :: ¿Qué decide tipoDe(tecla)? :: El número que escribe :: De qué tipo es (número, función, operador o igual), y con eso su color :: Si la tecla está encendida → El color sale del tipo, y el tipo de la tabla.
escribe :: ¿Qué ventaja tiene que el teclado sea datos y no 20 botones escritos a mano? :: Que se cambia el orden o se agrega una tecla cambiando la tabla, sin tocar componentes, y que se puede probar (5 filas de 4, sin repetidas).
```

## Parte 2. Las piezas: una tecla y el visor

> 🌎 **En la vida real:** son como los azulejos de una cocina: todos salen del mismo molde y se pegan donde dice el plano. El azulejo no decide dónde va ni de qué color es: eso viene de afuera.

**Una tecla** (`src/componentes/Tecla.tsx`) recibe todo lo que necesita y **avisa** qué se tocó. No sabe hacer cuentas:

```tsx
<Pressable
  onPress={() => alTocar(tecla)}
  accessibilityRole="button"
  accessibilityLabel={etiquetaDe(tecla)}          // "dividir", no "÷"
  accessibilityState={{ selected: encendida }}     // el lector dice "seleccionado"
  style={({ pressed }) => [estilos.tecla, { width: lado, height: lado, borderRadius: forma.redonda(lado),
                                             backgroundColor: fondo, opacity: pressed ? 0.6 : 1 }]}
>
```

- `Pressable` con `style` como **función**: `pressed` es `true` mientras el dedo está encima, y la tecla se aclara. Es la respuesta que el dedo espera.
- `lado` llega de afuera (lo calcula el motor con el ancho de la pantalla), y el radio es la mitad: **redonda en cualquier teléfono**.
- **Encendida:** el operador elegido se dibuja con los colores **al revés**, como en la calculadora del iPhone. Así sabes que tocaste `×` aunque el visor todavía muestre el primer número.

**El visor** (`src/componentes/Visor.tsx`) muestra el número, y tiene `accessibilityLiveRegion="polite"`: cuando cambia el número, el lector de pantalla **lo dice solo**, sin que la persona tenga que ir a buscarlo.

> 💡 **Idea:** fíjate en lo que **no** hay en estos dos archivos: ningún color, ninguna medida, ninguna cuenta. Los colores vienen del motor, las medidas del motor, las cuentas de la lógica. Por eso son cortos y se entienden de una leída.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Los colores de una tecla
lenguaje: js
pide: Completa `coloresDeTecla(tipo, encendida, colores)`, que devuelve `{ fondo, texto }`. Los operadores y el igual: fondo `colores.operador`, texto `colores.sobreOperador`. Las funciones: `colores.funcion` y `colores.sobreFuncion`. Los números: `colores.numero` y `colores.sobreNumero`. Pero si la tecla está **encendida** (el operador elegido), los colores del operador **al revés**: fondo `sobreOperador` y texto `operador`.
--- código
const oscuro = { numero: '#18212c', sobreNumero: '#e6edf3', funcion: '#2b3644', sobreFuncion: '#e6edf3', operador: '#7ee787', sobreOperador: '#0f141b' };

function coloresDeTecla(tipo, encendida, colores) {
  // tu código aquí
}
--- pruebas
prueba('un número', () => igual(coloresDeTecla('numero', false, oscuro), { fondo: '#18212c', texto: '#e6edf3' }));
prueba('una función', () => igual(coloresDeTecla('funcion', false, oscuro), { fondo: '#2b3644', texto: '#e6edf3' }));
prueba('un operador', () => igual(coloresDeTecla('operador', false, oscuro), { fondo: '#7ee787', texto: '#0f141b' }));
prueba('el igual es como un operador', () => igual(coloresDeTecla('igual', false, oscuro), { fondo: '#7ee787', texto: '#0f141b' }));
prueba('encendida: al revés', () => igual(coloresDeTecla('operador', true, oscuro), { fondo: '#0f141b', texto: '#7ee787' }));
--- solución
const oscuro = { numero: '#18212c', sobreNumero: '#e6edf3', funcion: '#2b3644', sobreFuncion: '#e6edf3', operador: '#7ee787', sobreOperador: '#0f141b' };

function coloresDeTecla(tipo, encendida, colores) {
  if (encendida) return { fondo: colores.sobreOperador, texto: colores.operador };
  if (tipo === 'operador' || tipo === 'igual') return { fondo: colores.operador, texto: colores.sobreOperador };
  if (tipo === 'funcion') return { fondo: colores.funcion, texto: colores.sobreFuncion };
  return { fondo: colores.numero, texto: colores.sobreNumero };
}
```

```practica
vf :: Con style como función, Pressable sabe si el dedo está encima (pressed) y la tecla puede cambiar mientras se toca
vf :: El componente Tecla hace la cuenta cuando lo tocan, para que sea más rápido
elige :: ¿Para qué sirve accessibilityLiveRegion en el visor? :: Para que el número sea más grande :: Para que el lector de pantalla diga el número nuevo cuando cambia :: Para que se pueda copiar → Quien no ve se entera del resultado sin buscarlo.
escribe :: ¿Por qué el operador elegido se dibuja con los colores al revés? :: Para que la persona sepa qué operador tocó mientras el visor todavía muestra el primer número; se apaga cuando empieza a escribir el segundo.
```

## Parte 3. La pantalla: juntar las piezas

`src/pantallas/PantallaCalculadora.tsx` es el **director**: guarda el estado, le pasa cada tecla a la lógica y dibuja lo que vuelve.

```tsx
export function PantallaCalculadora() {
  const [estado, setEstado] = useState(INICIAL);
  const colores = useColorScheme() === 'light' ? claro : oscuro;   // el teléfono dice el modo
  const lado = ladoDeTecla(useWindowDimensions().width);          // el motor dice el tamaño
  const alTocar = (t: Tecla) => setEstado((e) => apretar(e, t));  // la lógica dice qué pasa

  return (
    <SafeAreaView style={[estilos.pantalla, { backgroundColor: colores.fondo }]}>
      <Visor texto={estado.error ?? formatear(estado.pantalla)} esAviso={estado.error !== null} colores={colores} />
      {FILAS.map((fila) => (
        <View key={fila.join('')} style={estilos.fila}>
          {fila.map((t) => <Tecla key={t} tecla={t} lado={lado} colores={colores} encendida={t === encendido} alTocar={alTocar} />)}
        </View>
      ))}
    </SafeAreaView>
  );
}
```

Lee las tres primeras líneas: **el teléfono** dice el modo, **el motor** dice el tamaño, **la lógica** dice qué pasa. La pantalla no decide nada: junta.

**Un detalle que separa una app que anda de una que anda siempre:** `setEstado((e) => apretar(e, t))` y no `setEstado(apretar(estado, t))`. Si alguien toca `1` y `2` muy rápido, React puede no haber vuelto a dibujar entre los dos toques. Con la segunda forma, el segundo toque usa el estado **viejo** (el de antes del `1`) y **el `1` se pierde**. Con la función, React le pasa **el estado más nuevo**, siempre. El ejercicio de esta parte lo muestra con un `useState` de mentira.

> 📌 **Nota:** `SafeAreaView` (clase 56, parte 3) deja el visor fuera de la isla dinámica del iPhone y de la barra de abajo. Y `useWindowDimensions` se actualiza solo si giras el teléfono o cambias el tamaño de la ventana en la web.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Dos toques muy rápidos
lenguaje: js
pide: Una persona toca `1` y `2` tan rápido que React todavía no volvió a dibujar entre los dos. Aquí `crearEstado(inicial)` imita a `useState`: `ver()` da el valor **dibujado**, `cambiar(x)` acepta un valor o una función, y `dibujar()` aplica los cambios pendientes. Completa `tocarConValor` (que usa `cambiar(apretar(ver(), t))`, como un código con el error) y `tocarConFuncion` (que usa `cambiar((e) => apretar(e, t))`). Las pruebas muestran cuál pierde un toque.
--- código
function crearEstado(inicial) {
  let dibujado = inicial;
  let pendientes = [];
  return {
    ver: () => dibujado,
    cambiar: (x) => pendientes.push(x),
    dibujar: () => { for (const x of pendientes) dibujado = typeof x === 'function' ? x(dibujado) : x; pendientes = []; },
  };
}
const apretar = (e, t) => (e === '0' ? t : e + t);

function tocarConValor(estado, t) {
  // tu código aquí
}

function tocarConFuncion(estado, t) {
  // tu código aquí
}
--- pruebas
prueba('con el valor se pierde un toque', () => {
  const s = crearEstado('0');
  tocarConValor(s, '1'); tocarConValor(s, '2'); s.dibujar();
  igual(s.ver(), '2');
});
prueba('con la función llegan los dos', () => {
  const s = crearEstado('0');
  tocarConFuncion(s, '1'); tocarConFuncion(s, '2'); s.dibujar();
  igual(s.ver(), '12');
});
--- solución
function crearEstado(inicial) {
  let dibujado = inicial;
  let pendientes = [];
  return {
    ver: () => dibujado,
    cambiar: (x) => pendientes.push(x),
    dibujar: () => { for (const x of pendientes) dibujado = typeof x === 'function' ? x(dibujado) : x; pendientes = []; },
  };
}
const apretar = (e, t) => (e === '0' ? t : e + t);

function tocarConValor(estado, t) {
  estado.cambiar(apretar(estado.ver(), t));
}

function tocarConFuncion(estado, t) {
  estado.cambiar((e) => apretar(e, t));
}
```

```practica
vf :: Con setEstado((e) => apretar(e, t)), React le pasa a la función el estado más nuevo, aunque se toquen dos teclas muy rápido
vf :: La pantalla decide los colores, el tamaño de las teclas y qué pasa con cada tecla
elige :: ¿Qué hace useWindowDimensions en la calculadora? :: Mide el visor :: Da el ancho de la pantalla, para que el motor calcule el lado de las teclas :: Cambia el modo oscuro → Y se actualiza solo si giras el teléfono.
escribe :: Una persona toca 1 y 2 muy rápido y ve solo "2". ¿Qué buscas en el código? :: Un setEstado que use el estado de afuera, como setEstado(apretar(estado, t)). Se arregla con la forma con función, setEstado((e) => apretar(e, t)), que siempre recibe el estado más nuevo.
```

## Parte 4. Probar la pantalla, y lo que se encontró mirando

**Las pruebas de la pantalla** (`src/pantallas/__tests__/`) tocan las teclas **como una persona**, con Testing Library (clase 60), y miran el visor:

```tsx
async function tocar(...etiquetas: string[]) {
  const persona = userEvent.setup();
  for (const e of etiquetas) await persona.press(screen.getByRole('button', { name: e }));
}

test('0,1 + 0,2 = 0,3 tocando las teclas', async () => {
  await render(<PantallaCalculadora />);
  await tocar('0', 'coma', '1', 'sumar', '0', 'coma', '2', 'igual');
  expect(visor()).toHaveTextContent('0,3');
});
```

Fíjate que busca las teclas por **su etiqueta** (`'sumar'`, `'coma'`): si alguien borra un `accessibilityLabel`, la prueba falla. **La prueba también revisa la accesibilidad**, gratis. Y otra revisa que el operador elegido esté `toBeSelected()` y se apague al escribir el segundo número.

**Con las 54 pruebas en verde, se abrió la app en el navegador**, en tamaño de celular, y se hizo lo del plan a mano: `0,1 + 0,2`, el porcentaje, el modo claro, el operador encendido. Todo bien… hasta que se probó **la pantalla más chica**, la de un iPhone SE (320 de ancho), con el número más largo: `1 ÷ 3 = ±` → `-0,333333333333`.

**El número salía cortado: `-0,33333333…`**

¿Por qué ninguna prueba lo vio? Porque el visor tenía `adjustsFontSizeToFit`, que achica la letra hasta que entre… **pero solo en el iPhone**. En Android funciona a medias, y en la web no hace nada. Las pruebas corren sin pantalla de verdad: no miden píxeles.

**El arreglo, prueba primero:**

```ts
// Encontrado mirando la app en 320 de ancho: "-0,333333333333" salía cortado con "…".
test('en un iPhone SE, el número más largo entra sin cortarse', () => {
  const texto = '-0,333333333333';
  const ancho = anchoDelVisor(320);
  expect(texto.length * ANCHO_DE_CIFRA * letraDelVisor(texto, ancho)).toBeLessThanOrEqual(ancho);
});
```

En **rojo**. Después, en el motor, la letra del visor pasó a depender **también del ancho**: el tamaño por largo, pero nunca más grande del que entra (`ANCHO_DE_CIFRA` es cuánto ocupa una cifra comparada con el tamaño de la letra: un poco más de la mitad). En **verde**, 55 de 55, y en el navegador el número entra entero, en 30 de letra. Y el cambio quedó anotado en `PLAN.md`, con su fecha y su motivo.

> 💡 **Idea:** es la misma lección de las clases 92 y 93: **las pruebas revisan lo que les preguntaste; mirar la app de verdad encuentra lo que nadie preguntó**. Hacen falta las dos.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Que el número entre en la pantalla
lenguaje: js
pide: Esto es lo que se encontró mirando la app en un iPhone SE. Completa `letraDelVisor(texto, ancho)`: primero el tamaño **por largo** (hasta 7 caracteres, `72`; hasta 11, `56`; más, `40`). Después el tamaño **que entra**: `Math.floor(ancho / (texto.length * ANCHO_DE_CIFRA))`. Devuelve el **menor** de los dos.
--- código
const ANCHO_DE_CIFRA = 0.62;

function letraDelVisor(texto, ancho) {
  // tu código aquí
}
--- pruebas
prueba('un número corto, letra grande', () => igual(letraDelVisor('1.234', 380), 72));
prueba('largo en un teléfono grande', () => igual(letraDelVisor('-0,333333333333', 380), 40));
prueba('largo en un iPhone SE: más chico, para que entre', () => igual(letraDelVisor('-0,333333333333', 280), 30));
prueba('nunca se pasa del ancho', () => ok('-0,333333333333'.length * ANCHO_DE_CIFRA * letraDelVisor('-0,333333333333', 280) <= 280, 'no entra'));
--- solución
const ANCHO_DE_CIFRA = 0.62;

function letraDelVisor(texto, ancho) {
  const porLargo = texto.length <= 7 ? 72 : texto.length <= 11 ? 56 : 40;
  const queEntra = Math.floor(ancho / (texto.length * ANCHO_DE_CIFRA));
  return Math.min(porLargo, queEntra);
}
```

```practica
vf :: Las pruebas de la pantalla buscan las teclas por su etiqueta de accesibilidad, así que también revisan que las etiquetas existan
vf :: Si las 54 pruebas pasan, no hace falta mirar la app en un teléfono chico
elige :: ¿Por qué adjustsFontSizeToFit no alcanzó? :: Porque es muy lento :: Porque solo funciona en el iPhone: en Android a medias y en la web nada :: Porque no existe en React Native → Por eso el tamaño se calcula en el motor, con el ancho.
escribe :: ¿En qué orden se arregló el número cortado? :: Primero una prueba que lo reproduce (en rojo), después el arreglo en el motor (la letra depende también del ancho), las pruebas en verde, volver a mirar la app y anotar el cambio en el plan.
```

## Parte 5. En tu teléfono, y como app de verdad

Hay **tres niveles** de "tener la app en el teléfono", y cada uno sirve para algo distinto:

| Nivel | Qué es | Para qué |
|---|---|---|
| **1. Expo Go** | Una app de Expo que corre **tu código**, que viaja desde la computadora por la red | Probar mientras programas: cambias algo y se ve al instante |
| **2. App de verdad (Release)** | La app armada, **con el código adentro**: anda sola, sin la computadora | Usarla todos los días, mostrarla, dársela a alguien |
| **3. La tienda** | App Store o Google Play | Que cualquiera la baje. Cuesta (Apple, US$ 99 por año; Google, US$ 25 una vez): se explica, no se hace |

**Nivel 1: Expo Go (clase 57).** Con el teléfono y la computadora en el mismo wifi:

```bash
npm start      # muestra un código QR
```

En el iPhone, lo escaneas con la cámara; en el Samsung, con la app Expo Go. La calculadora aparece en segundos, y cada cambio que guardas se ve solo.

**Nivel 2: la app de verdad en el iPhone.** Expo arma el proyecto de Xcode y lo compila **en Release** (la versión final, con el código adentro):

```bash
LANG=en_US.UTF-8 npx expo run:ios --configuration Release
```

Así se hizo con esta calculadora, en el simulador del iPhone. Lo que pasó, contado tal cual:

1. **El primer intento falló** con un error larguísimo de Ruby que terminaba en `Unicode Normalization not appropriate for ASCII-8BIT`. La causa estaba en la primera línea: `CocoaPods requires your terminal to be using UTF-8 encoding`. CocoaPods (el que instala las piezas nativas del iPhone) necesita que la terminal hable UTF-8. **Arreglo:** `LANG=en_US.UTF-8` delante del comando (o `export LANG=en_US.UTF-8` en tu `~/.zshrc`, una vez). Es la lección de la clase 07: **el error importante suele estar arriba, no abajo**.
2. **El segundo intento:** instaló las piezas (CocoaPods), compiló con Xcode y abrió la app en el simulador. Se tocó `0 , 1 + 0 , 2 =` con el dedo (el mouse) y el visor dijo **0,3**, con el `+` encendido mientras se escribía el segundo número.

> 📌 **Nota:** **Debug** contra **Release**. En Debug (lo normal mientras programas), la app le pide el código a tu computadora: si la apagas, la app no abre. En **Release**, el código va **adentro**: es la que se usa de verdad. El primer intento de esta clase se armó en Debug por error, y se corrigió antes de terminar: una app "de verdad" se arma en Release.

**En tu iPhone, gratis.** Con el iPhone conectado por cable y tu cuenta de Apple (la gratuita) puesta en Xcode (Settings → Accounts):

```bash
LANG=en_US.UTF-8 npx expo run:ios --device --configuration Release
```

La primera vez, Xcode pide elegir tu cuenta como **equipo** (*Signing & Capabilities → Team*), y el iPhone pide confiar en ti como desarrollador (*Ajustes → General → VPN y gestión de dispositivos*). Con la cuenta gratuita, **la app dura 7 días**: después se vuelve a instalar con el mismo comando. Pagar los US$ 99 por año quita ese límite y permite publicar en la App Store.

**En tu Samsung, gratis.** En Android no hace falta ninguna cuenta: se arma un archivo **APK** y se instala.

```bash
npx expo prebuild -p android          # arma el proyecto de Android (la carpeta android/)
cd android && ./gradlew assembleRelease   # compila la app en Release
```

El archivo queda en `android/app/build/outputs/apk/release/app-release.apk`. Así se hizo con esta calculadora: Gradle tardó unos minutos la primera vez y armó un APK de **68 MB**. Se instaló en un emulador de Android (`adb install app-release.apk`), se tocó `200 + 10 %` y el visor dijo **20**; con `=`, **220**. Y algo más: al pedirle a Android la lista de lo que hay en la pantalla, cada tecla apareció con **su etiqueta en español** ("sumar", "borrar el último"). La accesibilidad de la parte 1 funciona también ahí.

Para pasarlo a tu Samsung: copia el APK al teléfono (por cable, por Google Drive o por WhatsApp contigo mismo) y ábrelo. Android te va a pedir permiso para **instalar apps de origen desconocido**: es normal con una app que no viene de Google Play, y se da solo para la app con la que lo abres.

> 📌 **Nota:** ¿por qué pesa 68 MB una calculadora? Porque ese APK trae la app **para todos los tipos de procesador** de Android a la vez. Google Play usa otro formato, el **AAB** (clase 60), y le manda a cada teléfono solo lo suyo: ahí pesa mucho menos. Y este APK está firmado con una llave **de prueba**: sirve para tu teléfono, pero para Google Play hace falta tu propia llave.

> 💡 **Idea:** fíjate en lo que **no** cambió entre la web, el simulador del iPhone y Android: **ni una línea de la calculadora**. La lógica, el motor, las teclas y la pantalla son los mismos. Solo cambia cómo se **arma** para cada lugar. Eso es React Native.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Revisar el app.json antes de armar la app
lenguaje: js
pide: Antes de armar la app para instalar, se revisa `app.json`. Completa `problemasDe(expo)`, que devuelve la lista de problemas en este orden: `'falta el nombre'` si `name` está vacío; `'el bundleIdentifier tiene que ser como com.tunombre.app'` si `ios.bundleIdentifier` no cumple `/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/`; lo mismo con `'el package de Android tiene que ser como com.tunombre.app'` para `android.package`; y `'versionCode tiene que ser un número entero mayor que 0'`.
--- código
const BIEN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/;

function problemasDe(expo) {
  // tu código aquí
}
--- pruebas
const BUENO = { name: 'Calculadora', ios: { bundleIdentifier: 'com.tuusuario.calculadora' }, android: { package: 'com.tuusuario.calculadora', versionCode: 1 } };
prueba('bien', () => igual(problemasDe(BUENO), []));
prueba('sin nombre', () => igual(problemasDe({ ...BUENO, name: '' }), ['falta el nombre']));
prueba('con mayúsculas y guiones no', () => igual(problemasDe({ ...BUENO, ios: { bundleIdentifier: 'com.Tu-Usuario.Calculadora' } }), ['el bundleIdentifier tiene que ser como com.tunombre.app']));
prueba('Android sin versión', () => igual(problemasDe({ ...BUENO, android: { package: 'calculadora', versionCode: 0 } }), ['el package de Android tiene que ser como com.tunombre.app', 'versionCode tiene que ser un número entero mayor que 0']));
--- solución
const BIEN = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/;

function problemasDe(expo) {
  const problemas = [];
  if (!expo.name) problemas.push('falta el nombre');
  if (!BIEN.test(expo.ios?.bundleIdentifier ?? '')) problemas.push('el bundleIdentifier tiene que ser como com.tunombre.app');
  if (!BIEN.test(expo.android?.package ?? '')) problemas.push('el package de Android tiene que ser como com.tunombre.app');
  const v = expo.android?.versionCode;
  if (!(Number.isInteger(v) && v > 0)) problemas.push('versionCode tiene que ser un número entero mayor que 0');
  return problemas;
}
```

```practica
vf :: Con Expo Go, la app se prueba en el teléfono sin instalarla: el código viaja desde la computadora por la red
vf :: Para tener la app en tu iPhone hay que pagar la cuenta de desarrollador de Apple
elige :: ¿Qué diferencia hay entre armar la app en Debug y en Release? :: Release tiene más pruebas :: Release lleva el código adentro y anda sola; Debug lo pide a la computadora mientras programas :: Debug es para Android y Release para iPhone → Una app para usar de verdad se arma en Release.
escribe :: ¿Por qué la calculadora sale para Android y para iPhone con un solo código? :: Porque está hecha con React Native: el mismo TypeScript se convierte en botones y textos nativos de cada sistema. Solo cambia cómo se arma e instala en cada uno.
```

## Para la entrevista

> 🎤 **Si te preguntan "cuéntame de un proyecto tuyo de principio a fin":** "Hice una calculadora en React Native con TypeScript y Expo, que sale para Android y iPhone con un solo código. Empecé por el plan con una tabla de decisiones, que se volvió las pruebas. La lógica es un reducer puro, sin eval, con 0,1 + 0,2 resuelto redondeando a 12 cifras. El diseño sale de un motor con tema claro y oscuro, el teclado es una tabla de datos, y cada tecla tiene su etiqueta para el lector de pantalla. Tiene 56 pruebas, pero lo más interesante lo encontré mirando la app en un iPhone SE: el número largo se cortaba, porque adjustsFontSizeToFit solo funciona en iOS. Lo arreglé con una prueba primero, calculando la letra con el ancho. Y la armé en Release: la instalé en el simulador del iPhone y como APK en un Android, con el mismo código."

> 🌎 **En la vida real:** es como el maestro de obra que entrega la casa: muestra el plano, cuenta qué se encontró en la obra y cómo se arregló, y da las llaves.

> 🌎 **Otro ejemplo:** es como un cocinero que presenta su plato en un concurso: qué eligió, por qué, qué le salió mal en la prueba y cómo lo corrigió.
