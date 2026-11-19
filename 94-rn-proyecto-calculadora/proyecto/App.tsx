import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PantallaCalculadora } from './src/pantallas/PantallaCalculadora';

export default function App() {
  return (
    <SafeAreaProvider>
      <PantallaCalculadora />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
