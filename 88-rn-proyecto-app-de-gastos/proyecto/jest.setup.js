// En las pruebas no hay teléfono: AsyncStorage se cambia por el reemplazo que trae la librería.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
