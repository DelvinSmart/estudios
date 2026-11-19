// UNA TECLA: un botón redondo que llama al motor. No sabe hacer cuentas: avisa qué tecla se tocó.
import { Pressable, StyleSheet, Text } from 'react-native';
import type { Tecla as TeclaT } from '../logica/calculadora';
import { etiquetaDe, tipoDe } from '../logica/teclado';
import { forma, letra, type Colores } from '../tema/motor';

interface Props {
  tecla: TeclaT;
  lado: number;
  colores: Colores;
  encendida: boolean; // el operador elegido, mientras se espera el segundo número
  alTocar: (t: TeclaT) => void;
}

export function Tecla({ tecla, lado, colores, encendida, alTocar }: Props) {
  const tipo = tipoDe(tecla);
  const esOperador = tipo === 'operador' || tipo === 'igual';
  // Encendida: los colores al revés, para que se vea qué operador se eligió.
  const fondo = encendida ? colores.sobreOperador : esOperador ? colores.operador : tipo === 'funcion' ? colores.funcion : colores.numero;
  const texto = encendida ? colores.operador : esOperador ? colores.sobreOperador : tipo === 'funcion' ? colores.sobreFuncion : colores.sobreNumero;

  return (
    <Pressable
      onPress={() => alTocar(tecla)}
      accessibilityRole="button"
      accessibilityLabel={etiquetaDe(tecla)}
      accessibilityState={{ selected: encendida }}
      style={({ pressed }) => [
        estilos.tecla,
        { width: lado, height: lado, borderRadius: forma.redonda(lado), backgroundColor: fondo, opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={[estilos.texto, { color: texto }]}>{tecla}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tecla: { alignItems: 'center', justifyContent: 'center' },
  texto: { fontSize: letra.tecla, fontWeight: '600' },
});
