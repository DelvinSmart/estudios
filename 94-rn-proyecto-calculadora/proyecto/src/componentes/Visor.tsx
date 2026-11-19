// EL VISOR: muestra el número (o el aviso). Achica la letra si el número es largo; no calcula nada.
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { anchoDelVisor, espacio, letra, letraDelVisor, type Colores } from '../tema/motor';

interface Props {
  texto: string;
  esAviso: boolean;
  colores: Colores;
}

export function Visor({ texto, esAviso, colores }: Props) {
  const ancho = anchoDelVisor(useWindowDimensions().width);
  return (
    <View style={estilos.caja}>
      <Text
        testID="visor"
        accessibilityRole="text"
        accessibilityLiveRegion="polite" // el lector de pantalla avisa cuando cambia el número
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          estilos.numero,
          esAviso ? { fontSize: letra.aviso, color: colores.tenue } : { fontSize: letraDelVisor(texto, ancho), color: colores.visor },
        ]}
      >
        {texto}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: espacio.grande, paddingBottom: espacio.medio },
  numero: { textAlign: 'right', fontWeight: '300' },
});
