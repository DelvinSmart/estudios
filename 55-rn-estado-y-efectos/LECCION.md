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

```practica
vf :: useEffect con [] como dependencias corre solo la primera vez
vf :: Los hooks se pueden llamar dentro de un if
elige :: ¿Para qué sirve la función que devuelve un useEffect? :: Para devolver datos :: Para limpiar: cancelar suscripciones o temporizadores :: Para dibujar
elige :: Quieres recargar los gastos cada vez que cambia el mes. ¿Qué dependencias pones? :: [] :: [mes] :: Ninguna
escribe :: ¿Qué es un hook? :: Una función especial de React, como useState o useEffect, que le da a un componente memoria o efectos; se llama siempre arriba del componente y puedo crear los míos.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿cómo manejas el estado en React?":** "Con useState para la memoria de cada componente, sin cambiarla directamente: creo arrays u objetos nuevos y uso la forma con el valor anterior. Los formularios son controlados y validan en pantalla, pero la seguridad va en el servidor. useEffect lo uso para pedir datos o suscribirme, con sus dependencias bien puestas y su limpieza. Y sigo las reglas de los hooks, que llamo siempre arriba."

> 🌎 **En la vida real:** es como explicar cómo funciona un tablero: qué guarda, qué lo cambia y qué se dispara solo.

> 🌎 **Otro ejemplo:** Es como un piloto explicando los instrumentos y los automatismos de la cabina.
