// LA PANTALLA: junta las piezas. Los datos bajan (props) y los avisos suben (alGuardar, alBorrar).
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { crearGasto, hoyISO, nuevoId, totalDeLaSemana, type DatosGasto, type Gasto } from '../logica/gastos';
import type { Repositorio } from '../datos/repositorio';
import { useGastos } from '../hooks/useGastos';
import { FormularioGasto } from '../componentes/FormularioGasto';
import { Resumen } from '../componentes/Resumen';
import { TarjetaGasto } from '../componentes/TarjetaGasto';
import { color, espacio, letra } from '../tema/motor';

interface Props {
  repositorio: Repositorio;
  hoy?: string; // las pruebas fijan el día; en la app es el de hoy
}

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
        <View style={estilos.arriba}>
          <Text style={estilos.titulo}>Gastos del carro</Text>
          <Resumen total={semana.total} cantidad={semana.cantidad} />
          <FormularioGasto hoy={hoy} alGuardar={alGuardar} />
          {aviso && <Text style={estilos.aviso}>{aviso}</Text>}
        </View>

        {cargando ? (
          <ActivityIndicator color={color.acento} style={estilos.cargando} />
        ) : (
          <FlatList
            data={gastos}
            keyExtractor={(g) => g.id}
            renderItem={dibujarTarjeta}
            contentContainerStyle={estilos.lista}
            ListEmptyComponent={<Text style={estilos.vacio}>Todavía no anotaste gastos</Text>}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  arriba: { padding: espacio.medio, gap: espacio.medio },
  titulo: { color: color.texto, fontSize: letra.grande, fontWeight: '700' },
  aviso: { color: color.peligro, fontSize: letra.chica },
  cargando: { marginTop: espacio.grande },
  lista: { paddingHorizontal: espacio.medio, paddingBottom: espacio.grande, gap: espacio.chico },
  vacio: { color: color.tenue, fontSize: letra.normal, textAlign: 'center', marginTop: espacio.grande },
});
