// LA PANTALLA: junta las piezas. Guarda el estado, le pasa cada tecla a la lógica y dibuja lo que vuelve.
import { useState } from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tecla } from '../componentes/Tecla';
import { Visor } from '../componentes/Visor';
import { apretar, formatear, INICIAL, type Tecla as TeclaT } from '../logica/calculadora';
import { FILAS, operadorEncendido } from '../logica/teclado';
import { claro, espacio, forma, ladoDeTecla, oscuro } from '../tema/motor';

export function PantallaCalculadora() {
  const [estado, setEstado] = useState(INICIAL);
  const colores = useColorScheme() === 'light' ? claro : oscuro; // si el teléfono no sabe (null), oscuro
  const lado = ladoDeTecla(useWindowDimensions().width);
  const encendido = operadorEncendido(estado);

  // La forma con función (e => …) usa siempre el estado más nuevo, aunque se toquen dos teclas muy rápido.
  const alTocar = (t: TeclaT) => setEstado((e) => apretar(e, t));

  return (
    <SafeAreaView style={[estilos.pantalla, { backgroundColor: colores.fondo }]}>
      <View style={estilos.centro}>
        <Visor texto={estado.error ?? formatear(estado.pantalla)} esAviso={estado.error !== null} colores={colores} />
        <View style={estilos.teclado}>
          {FILAS.map((fila) => (
            <View key={fila.join('')} style={estilos.fila}>
              {fila.map((t) => (
                <Tecla key={t} tecla={t} lado={lado} colores={colores} encendida={t === encendido} alTocar={alTocar} />
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1 },
  centro: { flex: 1, width: '100%', maxWidth: forma.anchoMaximo, alignSelf: 'center' },
  teclado: { paddingHorizontal: espacio.grande, paddingBottom: espacio.grande, gap: espacio.medio },
  fila: { flexDirection: 'row', justifyContent: 'space-between' },
});
