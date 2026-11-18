// EL DIRECTOR: arma la app. Crea el repositorio del teléfono UNA vez y se lo pasa a la pantalla.
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { crearRepositorioTelefono } from './src/datos/repositorio';
import { PantallaGastos } from './src/pantallas/PantallaGastos';

const repositorio = crearRepositorioTelefono();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <PantallaGastos repositorio={repositorio} />
    </SafeAreaProvider>
  );
}
