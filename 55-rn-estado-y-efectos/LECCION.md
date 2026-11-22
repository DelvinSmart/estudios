# React Native 2: estado, eventos y efectos

> 🌎 **En la vida real:** un tablero de carro cambia solo cuando cambia algo: aceleras y sube la velocidad. En React, la pantalla cambia sola cuando cambia el **estado**.

> 🎙️ **El profesor dice:** las props vienen de afuera; el **estado** es la memoria propia de un componente. Hoy: `useState` para guardar y cambiar datos, los eventos (`onPress`, `onChangeText`), formularios, `useEffect` para hacer cosas cuando algo cambia (como pedir datos), y las reglas de los *hooks*.

## Parte 1. useState: la memoria del componente

> 🌎 **En la vida real:** es como la pizarra de un mesero: anota los pedidos y, cuando cambian, la cocina ve lo nuevo.

> 🌎 **Otro ejemplo:** Es como el contador de vueltas de una piscina.

### Guardar y cambiar

```tsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function ContadorDeViajes() {
  const [viajes, setViajes] = useState(0);   // valor inicial 0
  return (
    <View>
      <Text>Viajes hoy: {viajes}</Text>
      <Pressable onPress={() => setViajes(viajes + 1)}>
        <Text>+1 viaje</Text>
      </Pressable>
    </View>
  );
}
```

`useState` devuelve el valor y la función para cambiarlo. **Al cambiarlo, React vuelve a dibujar** el componente con el valor nuevo.

> 🌎 **En la vida real:** es como el marcador de un partido: cuando alguien anota, el número cambia en la pantalla.

> 🌎 **Otro ejemplo:** Es como el odómetro: cambia el número y el tablero lo muestra solo.

### No cambiar el estado directamente

```tsx
const [gastos, setGastos] = useState<Gasto[]>([]);
gastos.push(nuevo);                        // ❌ React no se entera
setGastos([...gastos, nuevo]);             // ✅ un array nuevo
setGastos((antes) => [...antes, nuevo]);   // ✅ mejor: usa el valor anterior seguro
```

> 🌎 **En la vida real:** si rayas la pizarra a escondidas, la cocina no se entera; hay que avisar.

> 🌎 **Otro ejemplo:** Es como corregir un documento compartido sin guardar: nadie ve el cambio.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Cambiar el estado sin tocar el original
lenguaje: js
pide: React solo se entera de un cambio si le das un array **nuevo**. Completa tres funciones que **nunca** cambian la lista que reciben: `agregar(lista, gasto)` la devuelve con el gasto al final; `quitar(lista, id)` sin ese gasto; `cambiarValor(lista, id, valor)` con ese gasto con el valor nuevo (un objeto nuevo, los demás iguales).
--- código
function agregar(lista, gasto) {
  // tu código aquí
}

function quitar(lista, id) {
  // tu código aquí
}

function cambiarValor(lista, id, valor) {
  // tu código aquí
}
--- pruebas
const base = () => [{ id: 1, tipo: 'lavado', valor: 30 }, { id: 2, tipo: 'peaje', valor: 5 }];
prueba('agregar', () => { const l = base(); const n = agregar(l, { id: 3, tipo: 'otro', valor: 9 }); igual(n.length, 3); igual(l.length, 2); ok(n !== l, 'tiene que ser un array nuevo'); });
prueba('quitar', () => { const l = base(); igual(quitar(l, 1), [{ id: 2, tipo: 'peaje', valor: 5 }]); igual(l.length, 2); });
prueba('cambiar el valor', () => { const l = base(); const n = cambiarValor(l, 2, 7); igual(n[1].valor, 7); igual(l[1].valor, 5); ok(n[1] !== l[1], 'el gasto cambiado es un objeto nuevo'); ok(n[0] === l[0], 'los demás quedan iguales'); });
--- solución
function agregar(lista, gasto) {
  return [...lista, gasto];
}

function quitar(lista, id) {
  return lista.filter((g) => g.id !== id);
}

function cambiarValor(lista, id, valor) {
  return lista.map((g) => (g.id === id ? { ...g, valor } : g));
}
```

📱 **Ahora, en la app de verdad:** toca **▶ abrir la app en Snack**, cambia el código y mira la app. Marca cada cosa cuando la veas.

```snack
titulo: Un contador de viajes
pide: La app muestra "0 viajes" y un botón. Usa `useState` para que cada toque en **"＋ Viaje"** sume uno, y agrega un botón **"Empezar el día"** que vuelva a 0. Ojo con el plural: "1 viaje", "2 viajes".
--- código
import { useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

export default function App() {
  const viajes = 0; // cámbialo por useState

  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.numero}>{viajes} viajes</Text>
      <Pressable style={estilos.boton} onPress={() => {}}>
        <Text style={estilos.textoBoton}>＋ Viaje</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: '#0f141b' },
  numero: { fontSize: 40, color: '#e6edf3' },
  boton: { backgroundColor: '#7ee787', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  textoBoton: { fontSize: 18, fontWeight: '700', color: '#0f141b' },
});
--- comprobar
- Al abrirla dice "0 viajes"
- Al tocar "＋ Viaje" una vez dice "1 viaje" (en singular)
- Al tocarlo otra vez dice "2 viajes"
- "Empezar el día" la vuelve a "0 viajes"
--- solución
import { useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

export default function App() {
  const [viajes, setViajes] = useState(0);

  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.numero}>{viajes} {viajes === 1 ? 'viaje' : 'viajes'}</Text>
      <Pressable style={estilos.boton} onPress={() => setViajes((v) => v + 1)}>
        <Text style={estilos.textoBoton}>＋ Viaje</Text>
      </Pressable>
      <Pressable onPress={() => setViajes(0)}>
        <Text style={estilos.enlace}>Empezar el día</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: '#0f141b' },
  numero: { fontSize: 40, color: '#e6edf3' },
  boton: { backgroundColor: '#7ee787', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  textoBoton: { fontSize: 18, fontWeight: '700', color: '#0f141b' },
  enlace: { fontSize: 16, color: '#8796aa', textDecorationLine: 'underline' },
});
```

```practica
vf :: Al llamar setViajes, React vuelve a dibujar el componente
vf :: Hacer gastos.push(nuevo) actualiza la pantalla correctamente
elige :: ¿Qué devuelve useState(0)? :: Solo el número :: El valor y una función para cambiarlo :: Una promesa
elige :: ¿Cuál es la forma más segura de agregar al estado anterior? :: setGastos(gastos.push(n)) :: setGastos((antes) => [...antes, n]) :: gastos = [...gastos, n]
escribe :: Escribe el estado para guardar si el modo oscuro está activo, empezando en false. :: const [oscuro, setOscuro] = useState(false);
```

## Parte 2. Eventos y formularios

> 🌎 **En la vida real:** un formulario controlado es como dictarle a alguien que escribe en la pizarra: cada letra que dices queda anotada.

> 🌎 **Otro ejemplo:** Es como el display del cajero automático que muestra cada número que tocas.

### Un formulario de gasto

```tsx
export function FormularioGasto({ alGuardar }: { alGuardar: (valor: number) => void }) {
  const [texto, setTexto] = useState('');
  const valor = Number(texto.replace(',', '.'));
  const valido = valor > 0;

  return (
    <View>
      <TextInput value={texto} onChangeText={setTexto} keyboardType="decimal-pad" placeholder="Valor" />
      {!valido && texto !== '' && <Text>Escribe un valor mayor que 0</Text>}
      <Pressable disabled={!valido} onPress={() => { alGuardar(valor); setTexto(''); }}>
        <Text>Guardar</Text>
      </Pressable>
    </View>
  );
}
```

El `TextInput` muestra lo que hay en el estado y cada cambio actualiza el estado: es un **componente controlado**. La validación en pantalla **ayuda**, pero la seguridad va en el servidor (Tema 22).

> 🌎 **En la vida real:** es como una calculadora que no deja apretar "=" si la cuenta está incompleta.

> 🌎 **Otro ejemplo:** Es como el formulario del banco que marca en rojo el campo mal llenado.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: El formulario controlado
lenguaje: js
pide: Completa `estadoDelFormulario(texto)`, la cuenta que hace el formulario cada vez que cambia el texto. Devuelve `{ valor, valido, mensaje }`: `valor` es el número (cambia la coma por punto, como se escribe en Brasil); `valido` es `true` si el valor es mayor que 0; `mensaje` es `'Escribe un valor mayor que 0'` si no es válido **y** el texto no está vacío; si no, `null`.
--- código
function estadoDelFormulario(texto) {
  // tu código aquí
}
--- pruebas
prueba('con coma, como en Brasil', () => igual(estadoDelFormulario('12,50'), { valor: 12.5, valido: true, mensaje: null }));
prueba('vacío: no molesta todavía', () => igual(estadoDelFormulario(''), { valor: 0, valido: false, mensaje: null }));
prueba('cero no vale', () => igual(estadoDelFormulario('0').mensaje, 'Escribe un valor mayor que 0'));
prueba('letras no valen', () => igual(estadoDelFormulario('abc').valido, false));
--- solución
function estadoDelFormulario(texto) {
  const valor = Number(texto.replace(',', '.'));
  const valido = valor > 0;
  return { valor, valido, mensaje: !valido && texto !== '' ? 'Escribe un valor mayor que 0' : null };
}
```

```practica
vf :: En un componente controlado, el TextInput muestra el valor guardado en el estado
vf :: Si el botón está deshabilitado en la app, ya no hace falta validar en el servidor
elige :: ¿Qué evento de TextInput avisa cada vez que cambia el texto? :: onPress :: onChangeText :: onLoad
elige :: ¿Por qué se usa replace(',', '.') antes de Number? :: Por estilo :: Porque en Brasil se escribe 12,50 y Number necesita 12.50 :: Para borrar el texto
escribe :: ¿Qué es un componente controlado? :: Un campo cuyo valor vive en el estado de React: muestra lo que hay en el estado y cada cambio lo actualiza con setEstado.
```

## Parte 3. useEffect: hacer algo cuando cambia algo

> 🌎 **En la vida real:** "cada vez que entre a la casa, prende la luz": una acción que se dispara por un cambio.

> 🌎 **Otro ejemplo:** Es como el sensor de lluvia del carro que prende el limpiaparabrisas.

### Pedir datos al aparecer la pantalla

```tsx
useEffect(() => {
  let activo = true;
  leerGastos().then((lista) => { if (activo) setGastos(lista); });
  return () => { activo = false; };   // limpieza: si la pantalla se va, no actualices
}, []);                                // [] = solo la primera vez
```

- El segundo argumento (las **dependencias**) dice **cuándo** se repite: `[]` una vez; `[mes]` cada vez que cambia `mes`.
- La función que devuelves es la **limpieza**: cancela suscripciones o temporizadores.

> 🌎 **En la vida real:** las dependencias son "prende la luz cuando entre alguien", no "cada segundo".

> 🌎 **Otro ejemplo:** La limpieza es apagar la luz al salir.

### Las reglas de los hooks

Los *hooks* (`useState`, `useEffect`…) se llaman **siempre arriba** del componente, **nunca** dentro de un `if` o un ciclo, y solo en componentes o en otros hooks. Puedes crear los tuyos: `function useGastos() { … }`. Copiloto tiene sus hooks en `src/hooks`.

> 🌎 **En la vida real:** es como el orden de los pasos en un avión antes de despegar: siempre el mismo, sin saltarse ninguno.

> 🌎 **Otro ejemplo:** Es como los botones de un ascensor: siempre en el mismo lugar.

✍️ **Ahora escribes tú:** completa el código y toca **▶ probar**. Cada prueba se pone en verde cuando tu código hace lo que se pide.

```ejercicio
titulo: Un useEffect de juguete
lenguaje: js
pide: Completa `crearEfectos()`. Devuelve `{ correr(efecto, deps), desmontar() }`. React llama `correr` en **cada dibujo**. El efecto corre la primera vez, y después solo si alguna dependencia cambió (compáralas con `Object.is`). Antes de volver a correrlo, llama a la **limpieza** que devolvió la vez anterior (si devolvió una). `desmontar()` llama a la última limpieza.
--- código
function crearEfectos() {
  let depsAntes = null;
  let limpiar = null;
  return {
    correr(efecto, deps) {
      // tu código aquí
    },
    desmontar() {
      // tu código aquí
    },
  };
}
--- pruebas
prueba('con [] corre una sola vez', () => {
  const e = crearEfectos(); let veces = 0;
  for (let i = 0; i < 3; i++) e.correr(() => { veces++; }, []);
  igual(veces, 1);
});
prueba('con [mes] corre cuando cambia el mes, y limpia antes', () => {
  const e = crearEfectos(); const pasos = [];
  const efecto = (mes) => () => { pasos.push('pido ' + mes); return () => pasos.push('dejo ' + mes); };
  e.correr(efecto('enero'), ['enero']);
  e.correr(efecto('enero'), ['enero']);
  e.correr(efecto('febrero'), ['febrero']);
  igual(pasos, ['pido enero', 'dejo enero', 'pido febrero']);
});
prueba('al desmontar, limpia', () => {
  const e = crearEfectos(); const pasos = [];
  e.correr(() => () => pasos.push('limpio'), []);
  e.desmontar();
  igual(pasos, ['limpio']);
});
--- solución
function crearEfectos() {
  let depsAntes = null;
  let limpiar = null;
  return {
    correr(efecto, deps) {
      const cambio = depsAntes === null || deps.some((d, i) => !Object.is(d, depsAntes[i]));
      if (!cambio) return;
      if (limpiar) limpiar();
      limpiar = efecto() || null;
      depsAntes = deps;
    },
    desmontar() {
      if (limpiar) limpiar();
      limpiar = null;
    },
  };
}
```

```practica
vf :: useEffect con [] como dependencias corre solo la primera vez
vf :: Los hooks se pueden llamar dentro de un if
elige :: ¿Para qué sirve la función que devuelve un useEffect? :: Para devolver datos :: Para limpiar: cancelar suscripciones o temporizadores :: Para dibujar
elige :: Quieres recargar los gastos cada vez que cambia el mes. ¿Qué dependencias pones? :: [] :: [mes] :: Ninguna
escribe :: ¿Qué es un hook? :: Una función especial de React, como useState o useEffect, que le da a un componente memoria o efectos; se llama siempre arriba del componente y puedo crear los míos.
```


**Comprobación antes de seguir**

Predice cuándo se ejecuta el efecto al cambiar dos controles distintos del formulario.

<details>
<summary>Necesito una pista</summary>

Mira qué dato cambió y si aparece entre las dependencias.

</details>

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas el estado en React?":** "Con useState para la memoria de cada componente, sin cambiarla directamente: creo arrays u objetos nuevos y uso la forma con el valor anterior. Los formularios son controlados y validan en pantalla, pero la seguridad va en el servidor. useEffect lo uso para pedir datos o suscribirme, con sus dependencias bien puestas y su limpieza. Y sigo las reglas de los hooks, que llamo siempre arriba."

> 🌎 **En la vida real:** es como explicar cómo funciona un tablero: qué guarda, qué lo cambia y qué se dispara solo.

> 🌎 **Otro ejemplo:** Es como un piloto explicando los instrumentos y los automatismos de la cabina.
