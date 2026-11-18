// EL FORMULARIO: controlado (clase 55). Muestra lo que hay en el estado y cada cambio lo actualiza.
// No guarda nada él mismo: cuando todo está bien, AVISA hacia arriba con alGuardar (clase 54).
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { leerValor, problemasDe, TIPOS, type DatosGasto } from '../logica/gastos';
import { color, espacio, forma, letra } from '../tema/motor';

interface Props {
  hoy: string;
  alGuardar: (datos: DatosGasto) => void;
}

export function FormularioGasto({ hoy, alGuardar }: Props) {
  const [tipo, setTipo] = useState<string>('combustible');
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState(hoy);
  const [problemas, setProblemas] = useState<string[]>([]);

  function guardar() {
    const datos = { tipo, valor: leerValor(valor), fecha: fecha.trim() };
    const encontrados = problemasDe(datos, hoy);
    setProblemas(encontrados);
    if (encontrados.length > 0) return;
    alGuardar(datos);
    setValor(''); // listo para el próximo; el tipo y la fecha se quedan (suele ser otro del mismo día)
  }

  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.etiqueta}>Tipo</Text>
      <View style={estilos.tipos}>
        {TIPOS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTipo(t)}
            accessibilityRole="button"
            accessibilityState={{ selected: t === tipo }}
            style={[estilos.chip, t === tipo && estilos.chipElegido]}
          >
            <Text style={[estilos.chipTexto, t === tipo && estilos.chipTextoElegido]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={estilos.fila}>
        <View style={estilos.campo}>
          <Text style={estilos.etiqueta}>Valor (R$)</Text>
          <TextInput
            value={valor}
            onChangeText={setValor}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={color.tenue}
            accessibilityLabel="Valor"
            style={estilos.entrada}
          />
        </View>
        <View style={estilos.campo}>
          <Text style={estilos.etiqueta}>Fecha</Text>
          <TextInput
            value={fecha}
            onChangeText={setFecha}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={color.tenue}
            accessibilityLabel="Fecha"
            autoCorrect={false}
            style={estilos.entrada}
          />
        </View>
      </View>

      {problemas.map((p) => (
        <Text key={p} style={estilos.problema}>
          {p}
        </Text>
      ))}

      <Pressable onPress={guardar} accessibilityRole="button" style={estilos.boton}>
        <Text style={estilos.botonTexto}>Guardar</Text>
      </Pressable>
    </View>
  );
}

// Cada estilo "llama" al motor: ni un color ni un número de diseño escrito a mano.
const estilos = StyleSheet.create({
  tarjeta: { backgroundColor: color.tarjeta, borderRadius: forma.radio, padding: espacio.medio, gap: espacio.chico },
  etiqueta: { color: color.tenue, fontSize: letra.chica },
  tipos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.chico },
  chip: {
    borderWidth: 1,
    borderColor: color.borde,
    borderRadius: forma.radioChico,
    paddingVertical: espacio.chico / 2,
    paddingHorizontal: espacio.chico,
  },
  chipElegido: { backgroundColor: color.acento, borderColor: color.acento },
  chipTexto: { color: color.texto, fontSize: letra.chica },
  chipTextoElegido: { color: color.sobreAcento, fontWeight: '700' },
  fila: { flexDirection: 'row', gap: espacio.chico },
  campo: { flex: 1, gap: espacio.chico / 2 },
  entrada: {
    color: color.texto,
    fontSize: letra.normal,
    borderWidth: 1,
    borderColor: color.borde,
    borderRadius: forma.radioChico,
    padding: espacio.chico,
  },
  problema: { color: color.peligro, fontSize: letra.chica },
  boton: { backgroundColor: color.acento, borderRadius: forma.radioChico, padding: espacio.medio, alignItems: 'center' },
  botonTexto: { color: color.sobreAcento, fontSize: letra.normal, fontWeight: '700' },
});
