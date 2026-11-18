// EL RESUMEN: el total de la semana. Solo muestra lo que le pasan: no calcula ni guarda.
import { StyleSheet, Text, View } from 'react-native';
import { dinero } from '../logica/gastos';
import { color, espacio, forma, letra } from '../tema/motor';

interface Props {
  total: number;
  cantidad: number;
}

export function Resumen({ total, cantidad }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.etiqueta}>Esta semana</Text>
      <Text style={estilos.total}>{dinero(total)}</Text>
      <Text style={estilos.etiqueta}>{cantidad === 1 ? '1 gasto' : `${cantidad} gastos`}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: color.tarjeta, borderRadius: forma.radio, padding: espacio.medio, gap: espacio.chico / 2 },
  etiqueta: { color: color.tenue, fontSize: letra.chica },
  total: { color: color.acento, fontSize: letra.grande, fontWeight: '700' },
});
