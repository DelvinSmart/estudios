# React Native 1: React — componentes, JSX y props

> 🌎 **En la vida real:** una app es como una casa hecha con módulos prefabricados: la ventana, la puerta y la escalera se fabrican una vez y se usan en muchos cuartos. En React, cada módulo es un **componente**.

> 🎙️ **El profesor dice:** este es el primer tema del curso **React Native**, que tiene su propio certificado. React Native **es React** para el teléfono, así que empezamos por React: qué es un componente, cómo se escribe con **JSX** y cómo recibe datos con **props**. Todo en TypeScript, como Copiloto. Necesitas el curso JavaScript + TypeScript (o al menos sus clases 47, 48 y 51).

## Parte 1. Un componente es una función

> 🌎 **En la vida real:** un componente es un molde de galletas: le das masa y sale la galleta con esa forma.

> 🌎 **Otro ejemplo:** Es como un sello: cada vez que lo usas, deja la misma figura.

### La forma más simple

```tsx
import { Text } from 'react-native';

export function Saludo() {
  return <Text>Hola, conductor 👋</Text>;
}
```

Un componente es una **función** que devuelve lo que se dibuja. Su nombre empieza con **mayúscula**. Se usa como una etiqueta: `<Saludo />`.

> 🌎 **En la vida real:** es como una receta con nombre propio: "Torta de la abuela". La pides por su nombre.

> 🌎 **Otro ejemplo:** Es como un atajo del celular con su ícono.

### Componer: componentes dentro de componentes

```tsx
export function Inicio() {
  return (
    <View>
      <Saludo />
      <ResumenDelDia />
      <BotonAgregarGasto />
    </View>
  );
}
```

La pantalla de inicio de Copiloto está hecha así: muchas piezas chicas, cada una en su archivo (`src/components`, `src/screens`).

> 🌎 **En la vida real:** es como armar un mueble con piezas: la puerta, el cajón y la repisa.

> 🌎 **Otro ejemplo:** Es como una orquesta: cada músico es un componente y la sinfonía es la pantalla.

```practica
vf :: Un componente de React es una función que devuelve lo que se dibuja
vf :: Un componente se puede llamar saludo con minúscula sin problema
elige :: ¿Cómo se usa el componente Saludo dentro de otro? :: Saludo() suelto :: <Saludo /> :: {Saludo}
elige :: ¿Por qué dividir una pantalla en muchos componentes chicos? :: Para que sea más lenta :: Para reutilizarlos, entenderlos y probarlos mejor :: Porque React lo obliga
escribe :: Escribe un componente Titulo que muestre el texto Mis gastos. :: export function Titulo() { return <Text>Mis gastos</Text>; }
```

## Parte 2. JSX: HTML dentro de JavaScript (casi)

> 🌎 **En la vida real:** JSX es como un formulario con huecos para completar con datos.

> 🌎 **Otro ejemplo:** Es como una plantilla de carta con espacios para el nombre.

### Las reglas de JSX

- Se mete JavaScript entre **llaves**: `<Text>{ganancia.toFixed(2)}</Text>`.
- Un componente devuelve **un solo** elemento raíz (o un fragmento `<>…</>`).
- Las propiedades de estilo y eventos van en camelCase: `onPress`, `style`.
- Para mostrar algo solo si se cumple: `{tieneGastos && <Lista />}` o el ternario `{cargando ? <Cargando /> : <Lista />}`.

```tsx
function ResumenDelDia({ ganancia, viajes }: { ganancia: number; viajes: number }) {
  return (
    <>
      <Text>Viajes: {viajes}</Text>
      <Text>Ganancia: R$ {ganancia.toFixed(2)}</Text>
      {ganancia >= 250 && <Text>🎉 ¡Meta cumplida!</Text>}
    </>
  );
}
```

> 🌎 **En la vida real:** las llaves son los huecos del formulario donde va el dato real.

> 🌎 **Otro ejemplo:** Es como el cartel de un bus con el destino que cambia.

### Listas con map y key

```tsx
{gastos.map((g) => <TarjetaGasto key={g.id} gasto={g} />)}
```

`key` tiene que ser **único y estable** (un id), para que React sepa cuál es cuál al actualizar.

> 🌎 **En la vida real:** `key` es como el número de cada asiento: si cambias el orden de la gente, sabes quién es quién.

> 🌎 **Otro ejemplo:** Es como la placa de cada carro en un estacionamiento.

```practica
vf :: En JSX, el código JavaScript va entre llaves
vf :: Un componente puede devolver dos elementos sueltos sin envolverlos
elige :: ¿Qué hace {ganancia >= 250 && <Text>Meta</Text>}? :: Siempre muestra Meta :: Muestra Meta solo si ganancia es 250 o más :: Da error
elige :: ¿Qué conviene usar como key al listar gastos? :: El índice siempre :: El id único de cada gasto :: Un número al azar
escribe :: Escribe JSX que muestre "Cargando…" si cargando es true y la lista si no. :: {cargando ? <Text>Cargando…</Text> : <Lista />}
```

## Parte 3. Props: datos de afuera

> 🌎 **En la vida real:** las props son como los ingredientes que le das al cocinero: la receta es la misma, el plato cambia.

> 🌎 **Otro ejemplo:** Es como llenar un formulario: el formulario es igual, los datos son tuyos.

### Recibir y tipar props

```tsx
interface PropsTarjeta {
  tipo: string;
  valor: number;
  alTocar?: () => void;   // opcional: una función
}

export function TarjetaGasto({ tipo, valor, alTocar }: PropsTarjeta) {
  return (
    <Pressable onPress={alTocar}>
      <Text>{tipo}</Text>
      <Text>R$ {valor.toFixed(2)}</Text>
    </Pressable>
  );
}

<TarjetaGasto tipo="lavado" valor={30} alTocar={() => abrirDetalle(3)} />
```

Las props **no se cambian** dentro del componente: vienen de arriba. Para avisar hacia arriba, el padre pasa una **función** (como `alTocar`).

> 🌎 **En la vida real:** el hijo no cambia la lista de compras que le dio su mamá; si necesita algo, la llama.

> 🌎 **Otro ejemplo:** Es como un empleado que recibe instrucciones y, para pedir algo, usa el teléfono interno.

### Los datos bajan, los avisos suben

Este es el flujo de React: **los datos bajan** por props de padre a hijo, y **los avisos suben** llamando funciones que el padre pasó. Así siempre sabes de dónde viene cada dato.

> 🌎 **En la vida real:** es como una empresa: las órdenes bajan del jefe y los informes suben.

> 🌎 **Otro ejemplo:** Es como un río con un teléfono: el agua baja, las llamadas suben.

```practica
vf :: Un componente puede cambiar las props que recibe
vf :: Para avisarle algo al padre, el hijo llama una función que el padre le pasó por props
elige :: ¿Cómo se pasa un número como prop? :: valor="30" :: valor={30} :: valor=(30)
elige :: ¿Qué significa alTocar?: () => void en la interfaz? :: Es obligatoria :: Es una función opcional que no devuelve nada :: Es un número
escribe :: Explica el flujo de datos de React en una frase. :: Los datos bajan del padre al hijo por props y los avisos suben cuando el hijo llama una función que el padre le pasó.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿qué es un componente y qué son las props?":** "Un componente es una función que devuelve lo que se dibuja, con nombre en mayúscula, escrita en JSX. Las props son los datos que recibe del padre, tipados con una interfaz en TypeScript y de solo lectura. Los datos bajan por props y los avisos suben llamando funciones que el padre pasa. Al listar uso map con un key único, como el id."

> 🌎 **En la vida real:** es como explicar cómo se arma una casa prefabricada y cómo llegan los materiales a cada cuarto.

> 🌎 **Otro ejemplo:** Es como un director que explica quién le pasa qué a quién en una orquesta.
