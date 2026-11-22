# React Native 6: datos con Firebase y rendimiento

> 🌎 **En la vida real:** una app es como un restaurante: los datos son la despensa (Firebase) y el rendimiento es que los platos salgan rápido aunque esté lleno.

> 🎙️ **El profesor dice:** hoy conectas la app con **Firebase** (lo que usa Copiloto: el mismo SDK web que viste en el Tema 08 y en este mapa), compartes datos entre pantallas con **Context**, y aprendes a que la app vaya **rápida**: un solo hilo, renders de más, `memo`, y lo que arreglaste en Copiloto (Tema 11).

## Parte 1. Firebase en la app

> 🌎 **En la vida real:** Firebase es la bodega central; cada teléfono pide y deja mercadería ahí.

> 🌎 **Otro ejemplo:** Es como una cuenta bancaria compartida entre tu celular y tu computadora.

### Leer en tiempo real

```tsx
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

useEffect(() => {
  if (!uid) return;
  const q = query(collection(db, 'users', uid, 'gastos'), orderBy('fecha', 'desc'));
  const parar = onSnapshot(q, (foto) => {
    setGastos(foto.docs.map((d) => ({ id: d.id, ...d.data() }) as Gasto));
  });
  return parar;   // limpieza: deja de escuchar al salir de la pantalla
}, [uid]);
```

`onSnapshot` avisa cada vez que algo cambia en la base: la pantalla se actualiza sola. Las **reglas** del servidor (Temas 08 y 21) deciden quién puede leer qué.

> 🌎 **En la vida real:** `onSnapshot` es como estar suscrito a un canal: cada noticia nueva te llega sola.

> 🌎 **Otro ejemplo:** Es como el marcador en vivo de un partido.

### Sin internet

Firestore guarda una copia local: la app sigue mostrando los datos y manda los cambios cuando vuelve la señal. Igual hay que mostrar al usuario cuando algo **todavía no se guardó** en la nube.

> 🌎 **En la vida real:** es como anotar en la libreta cuando no hay señal y pasarlo al sistema al volver a la ciudad.

> 🌎 **Otro ejemplo:** Es como un mensaje de WhatsApp con un solo tilde: enviado, pero no llegó todavía.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: De la foto de Firestore a la lista
lenguaje: js
pide: `onSnapshot` te entrega una **foto** con `docs`; cada documento tiene `id`, `data()` y `metadata.hasPendingWrites` (verdadero si ese cambio **todavía no llegó** a la nube). Completa `aGastos(foto)`: devuelve `{ id, ...datos, pendiente }` de cada documento. Y `aviso(gastos)`: `'Todo guardado en la nube'` si ninguno está pendiente, o `'N sin guardar todavía'`.
--- código
function aGastos(foto) {
  // tu código aquí
}

function aviso(gastos) {
  // tu código aquí
}
--- pruebas
const doc = (id, datos, pendiente) => ({ id, data: () => datos, metadata: { hasPendingWrites: pendiente } });
const foto = { docs: [doc('a1', { tipo: 'lavado', valor: 30 }, false), doc('b2', { tipo: 'peaje', valor: 5 }, true)] };
prueba('arma cada gasto con su id', () => igual(aGastos(foto), [{ id: 'a1', tipo: 'lavado', valor: 30, pendiente: false }, { id: 'b2', tipo: 'peaje', valor: 5, pendiente: true }]));
prueba('el aviso con uno pendiente', () => igual(aviso(aGastos(foto)), '1 sin guardar todavía'));
prueba('todo guardado', () => igual(aviso(aGastos({ docs: [doc('a1', { tipo: 'lavado', valor: 30 }, false)] })), 'Todo guardado en la nube'));
--- solución
function aGastos(foto) {
  return foto.docs.map((d) => ({ id: d.id, ...d.data(), pendiente: d.metadata.hasPendingWrites }));
}

function aviso(gastos) {
  const n = gastos.filter((g) => g.pendiente).length;
  return n === 0 ? 'Todo guardado en la nube' : `${n} sin guardar todavía`;
}
```

```practica
vf :: onSnapshot avisa cada vez que cambian los datos en Firestore
vf :: Si no se cancela onSnapshot al salir de la pantalla, no pasa nada
elige :: ¿Quién decide qué usuario puede leer qué datos en Firebase? :: La pantalla de la app :: Las reglas del servidor :: El teléfono
elige :: Sin internet, ¿qué hace Firestore? :: Borra los datos :: Muestra la copia local y manda los cambios al volver la señal :: Cierra la app
escribe :: ¿Por qué el useEffect de onSnapshot depende de uid? :: Porque si cambia el usuario (por ejemplo al cambiar de cuenta) hay que dejar de escuchar los datos del anterior y escuchar los del nuevo.
```

## Parte 2. Compartir datos entre pantallas: Context

> 🌎 **En la vida real:** Context es como el altavoz de un edificio: lo que se anuncia lo escuchan todos los pisos, sin pasar el mensaje de mano en mano.

> 🌎 **Otro ejemplo:** Es como el tablero de anuncios de una empresa.

### Evitar pasar props por diez niveles

```tsx
const SesionContext = createContext<{ uid: string | null }>({ uid: null });

export function ProveedorSesion({ children }: { children: React.ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null)), []);
  return <SesionContext.Provider value={{ uid }}>{children}</SesionContext.Provider>;
}

export const useSesion = () => useContext(SesionContext);   // en cualquier pantalla: const { uid } = useSesion();
```

Copiloto tiene sus contextos en `src/context` (por ejemplo, la cuenta del usuario y los gastos recurrentes).

> 🌎 **En la vida real:** es como el wifi de la casa: todos los cuartos lo reciben sin cables.

> 🌎 **Otro ejemplo:** Es como la hora oficial: todos los relojes la toman de la misma fuente.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un Context de juguete
lenguaje: js
pide: Completa `crearContexto(porDefecto)`: devuelve `{ Proveedor(valor, dibujarHijos), usar() }`. `usar()` devuelve el valor del **Proveedor más cercano** que está dibujando, o `porDefecto` si no hay ninguno. `Proveedor` pone su valor, llama a `dibujarHijos()`, **quita** su valor (aunque falle) y devuelve lo que devolvió `dibujarHijos`. Pista: una pila.
--- código
function crearContexto(porDefecto) {
  const pila = [];
  return {
    Proveedor(valor, dibujarHijos) {
      // tu código aquí
    },
    usar() {
      // tu código aquí
    },
  };
}
--- pruebas
const Sesion = crearContexto({ uid: null });
const Pantalla = () => `uid: ${Sesion.usar().uid}`;
prueba('sin proveedor: el valor por defecto', () => igual(Pantalla(), 'uid: null'));
prueba('con proveedor, sin pasar props', () => igual(Sesion.Proveedor({ uid: 'ana' }, () => Pantalla()), 'uid: ana'));
prueba('el más cercano gana', () => igual(Sesion.Proveedor({ uid: 'ana' }, () => [Pantalla(), Sesion.Proveedor({ uid: 'beto' }, Pantalla), Pantalla()]), ['uid: ana', 'uid: beto', 'uid: ana']));
prueba('al terminar, se quita', () => { try { Sesion.Proveedor({ uid: 'ana' }, () => { throw new Error('x'); }); } catch (e) {} igual(Pantalla(), 'uid: null'); });
--- solución
function crearContexto(porDefecto) {
  const pila = [];
  return {
    Proveedor(valor, dibujarHijos) {
      pila.push(valor);
      try {
        return dibujarHijos();
      } finally {
        pila.pop();
      }
    },
    usar() {
      return pila.length ? pila[pila.length - 1] : porDefecto;
    },
  };
}
```

📱 **Ahora, en la app de verdad:** toca **▶ abrir la app en Snack**, cambia el código y mira la app. Marca cada cosa cuando la veas.

```snack
titulo: El modo oscuro, compartido con Context
pide: El botón cambia el modo, pero la `Tarjeta` no se entera: tiene los colores fijos. Crea un **Context** con el tema, ponlo alrededor de todo con un `Provider`, y haz que la `Tarjeta` lo lea con `useContext`, **sin pasarle props**.
--- código
import { useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

const oscuro = { fondo: '#0f141b', tarjeta: '#18212c', texto: '#e6edf3' };
const claro = { fondo: '#f5f7fa', tarjeta: '#ffffff', texto: '#1d232b' };

function Tarjeta() {
  const tema = oscuro; // siempre oscuro: tiene que leer el tema compartido
  return (
    <View style={[estilos.tarjeta, { backgroundColor: tema.tarjeta }]}>
      <Text style={{ color: tema.texto, fontSize: 18 }}>Hoy: R$ 312,00</Text>
    </View>
  );
}

export default function App() {
  const [esOscuro, setEsOscuro] = useState(true);
  const tema = esOscuro ? oscuro : claro;
  return (
    <View style={[estilos.pantalla, { backgroundColor: tema.fondo }]}>
      <Tarjeta />
      <Pressable onPress={() => setEsOscuro(!esOscuro)}>
        <Text style={{ color: tema.texto, textDecorationLine: 'underline' }}>Cambiar a modo {esOscuro ? 'claro' : 'oscuro'}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  tarjeta: { padding: 20, borderRadius: 14, alignSelf: 'stretch' },
});
--- comprobar
- Al tocar "Cambiar a modo claro", cambia el fondo de la pantalla
- La tarjeta también cambia: fondo blanco y texto oscuro
- Al volver a modo oscuro, las dos vuelven
- `Tarjeta` no recibe el tema por props: lo lee con `useContext`
--- solución
import { createContext, useContext, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

const oscuro = { fondo: '#0f141b', tarjeta: '#18212c', texto: '#e6edf3' };
const claro = { fondo: '#f5f7fa', tarjeta: '#ffffff', texto: '#1d232b' };
const TemaContext = createContext(oscuro);

function Tarjeta() {
  const tema = useContext(TemaContext); // lo lee del Provider de arriba
  return (
    <View style={[estilos.tarjeta, { backgroundColor: tema.tarjeta }]}>
      <Text style={{ color: tema.texto, fontSize: 18 }}>Hoy: R$ 312,00</Text>
    </View>
  );
}

export default function App() {
  const [esOscuro, setEsOscuro] = useState(true);
  const tema = esOscuro ? oscuro : claro;
  return (
    <TemaContext.Provider value={tema}>
      <View style={[estilos.pantalla, { backgroundColor: tema.fondo }]}>
        <Tarjeta />
        <Pressable onPress={() => setEsOscuro(!esOscuro)}>
          <Text style={{ color: tema.texto, textDecorationLine: 'underline' }}>Cambiar a modo {esOscuro ? 'claro' : 'oscuro'}</Text>
        </Pressable>
      </View>
    </TemaContext.Provider>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  tarjeta: { padding: 20, borderRadius: 14, alignSelf: 'stretch' },
});
```

```practica
vf :: Context permite compartir datos entre muchas pantallas sin pasar props por cada nivel
vf :: useContext solo funciona dentro del mismo archivo donde se creó el contexto
elige :: ¿Qué componente pone el valor a disposición de todos? :: useContext :: El Provider :: createContext solo
elige :: ¿Dónde tiene Copiloto sus contextos? :: src/theme :: src/context :: node_modules
escribe :: ¿Para qué crearías un hook useSesion? :: Para que cualquier pantalla obtenga el usuario actual con una línea, leyendo el contexto de sesión, sin pasar el uid por props de pantalla en pantalla.
```

## Parte 3. Rendimiento: que la app vuele

> 🌎 **En la vida real:** en una cocina con un solo cocinero (el hilo de JavaScript), cada tarea larga atrasa todos los platos.

> 🌎 **Otro ejemplo:** Es como una caja de supermercado: si un cliente tarda mucho, la fila entera espera.

### Un solo hilo, como viste en el Tema 11

Si JavaScript hace una cuenta larga, la app no responde a los toques ni anima. Reglas prácticas:
- **No dibujes de más:** un cambio de estado arriba vuelve a dibujar todo lo de abajo. Divide en componentes y pon el estado donde se usa.
- **`React.memo`** evita volver a dibujar un componente si sus props no cambiaron; **`useMemo`** guarda un cálculo caro; **`useCallback`** guarda una función para no "cambiarla" en cada dibujo.
- **Listas con `FlatList`** (clase 56), nunca un `map` gigante.
- **Pantallas en pausa:** en Copiloto, las pestañas que no se ven se "congelan" (`freezeOnBlur`, Tema 11) para no trabajar en segundo plano.

```tsx
const TarjetaGasto = React.memo(function TarjetaGasto({ tipo, valor }: PropsTarjeta) { /* … */ });
const total = useMemo(() => totalGastos(gastos), [gastos]);
```

> 🌎 **En la vida real:** `memo` es como no volver a imprimir un cartel si el texto no cambió.

> 🌎 **Otro ejemplo:** `useMemo` es como anotar el resultado de una cuenta larga para no hacerla otra vez.

### Medir antes de arreglar

No adivines: mide con el perfilador (en Copiloto se usó el de **Hermes**, el motor de JavaScript de la app, Tema 11) y arregla lo que de verdad tarda.

> 🌎 **En la vida real:** antes de cambiar piezas, el mecánico conecta el escáner y ve qué falla.

> 🌎 **Otro ejemplo:** Es como un médico que pide análisis antes de recetar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: React.memo de juguete
lenguaje: js
pide: Completa `iguales(a, b)` (comparación **superficial**: mismas claves y cada valor igual con `Object.is`) y `memo(componente)`: devuelve una función que recibe `props` y solo vuelve a llamar al componente si las props **no** son iguales a las de la vez anterior; si son iguales, devuelve el resultado guardado.
--- código
function iguales(a, b) {
  // tu código aquí
}

function memo(componente) {
  let propsAntes = null;
  let resultado;
  return function (props) {
    // tu código aquí
  };
}
--- pruebas
prueba('comparación superficial', () => {
  igual(iguales({ tipo: 'lavado', valor: 30 }, { tipo: 'lavado', valor: 30 }), true);
  igual(iguales({ tipo: 'lavado' }, { tipo: 'lavado', valor: 30 }), false);
  igual(iguales({ g: { id: 1 } }, { g: { id: 1 } }), false);
});
prueba('mismas props: no vuelve a dibujar', () => {
  let dibujos = 0;
  const Tarjeta = memo(({ tipo }) => { dibujos++; return tipo; });
  Tarjeta({ tipo: 'lavado' }); Tarjeta({ tipo: 'lavado' }); Tarjeta({ tipo: 'peaje' });
  igual(dibujos, 2);
});
prueba('una función nueva en cada dibujo rompe el memo (por eso useCallback)', () => {
  let dibujos = 0;
  const Boton = memo(() => { dibujos++; });
  Boton({ alTocar: () => {} }); Boton({ alTocar: () => {} });
  igual(dibujos, 2);
  const misma = () => {};
  Boton({ alTocar: misma }); Boton({ alTocar: misma });
  igual(dibujos, 3);
});
--- solución
function iguales(a, b) {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.is(a[k], b[k]));
}

function memo(componente) {
  let propsAntes = null;
  let resultado;
  return function (props) {
    if (propsAntes && iguales(propsAntes, props)) return resultado;
    propsAntes = props;
    resultado = componente(props);
    return resultado;
  };
}
```

```practica
vf :: Un cambio de estado arriba vuelve a dibujar todo lo que está debajo
vf :: useMemo sirve para guardar datos en el teléfono al cerrar la app
elige :: ¿Qué evita React.memo? :: Que la app se cierre :: Volver a dibujar un componente si sus props no cambiaron :: Que se guarden datos
elige :: ¿Qué hace freezeOnBlur en Copiloto? :: Borra las pestañas :: Congela las pestañas que no se ven para que no trabajen de fondo :: Cambia el tema
escribe :: Antes de optimizar una pantalla lenta, ¿qué haces primero y por qué? :: Medirla con el perfilador para encontrar qué tarda de verdad, porque optimizar a ciegas gasta tiempo y puede no arreglar el problema.
```


**Comprobación antes de seguir**

Identifica si la demora aparece antes de recibir los datos o al dibujarlos.

<details>
<summary>Necesito una pista</summary>

Observa por separado cuándo llega la respuesta y cuándo se vuelve a dibujar la lista.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo conectas datos y cuidas el rendimiento en React Native?":** "Uso el SDK de Firebase con onSnapshot dentro de un useEffect que limpia la suscripción, y las reglas del servidor deciden quién lee qué. Comparto la sesión con Context y un hook propio. Para el rendimiento: el estado donde se usa, FlatList para listas, React.memo, useMemo y useCallback cuando hace falta, y congelo pantallas que no se ven. Siempre mido con el perfilador antes, como hice en Copiloto con Hermes."

> 🌎 **En la vida real:** es como explicar cómo un restaurante lleno sigue sacando platos a tiempo.

> 🌎 **Otro ejemplo:** Es como un mecánico que explica cómo afinó un motor midiendo, no adivinando.
