// UNA TARJETA: muestra un gasto y avisa cuando lo quieren borrar.
// Con React.memo: si sus props no cambian, no se vuelve a dibujar (clase 59).
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { dinero, type Gasto } from '../logica/gastos';
import { color, espacio, forma, letra } from '../tema/motor';

interface Props {
  gasto: Gasto;
  alBorrar: (id: string) => void;
}

export const TarjetaGasto = memo(function TarjetaGasto({ gasto, alBorrar }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.textos}>
        <Text style={estilos.tipo}>{gasto.tipo}</Text>
        <Text style={estilos.fecha}>{gasto.fecha}</Text>
      </View>
      <Text style={estilos.valor}>{dinero(gasto.valor)}</Text>
      <Pressable
        onPress={() => alBorrar(gasto.id)}
        accessibilityRole="button"
        accessibilityLabel={`Borrar ${gasto.tipo} de ${dinero(gasto.valor)}`}
        style={estilos.borrar}
      >
        <Text style={estilos.borrarTexto}>Borrar</Text>
      </Pressable>
    </View>
  );
});

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.medio,
    backgroundColor: color.tarjeta,
    borderRadius: forma.radio,
    padding: espacio.medio,
  },
  textos: { flex: 1 },
  tipo: { color: color.texto, fontSize: letra.normal },
  fecha: { color: color.tenue, fontSize: letra.chica },
  valor: { color: color.texto, fontSize: letra.normal, fontWeight: '700' },
  borrar: {
    borderWidth: 1,
    borderColor: color.peligro,
    borderRadius: forma.radioChico,
    paddingVertical: espacio.chico / 2,
    paddingHorizontal: espacio.chico,
  },
  borrarTexto: { color: color.peligro, fontSize: letra.chica },
});
