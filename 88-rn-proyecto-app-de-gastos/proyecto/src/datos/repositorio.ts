// LOS DATOS: guardar y leer la lista. Es un contrato de dos funciones (como el almacén de la API, clase 87):
// la pantalla no sabe si guarda en el teléfono, en memoria o, mañana, en Firebase.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Gasto } from '../logica/gastos';

export interface Repositorio {
  leer(): Promise<Gasto[]>;
  guardar(lista: Gasto[]): Promise<void>;
}

/** Lo mínimo que hace falta de AsyncStorage (así se puede probar con uno de mentira). */
export interface AlmacenDeTexto {
  getItem(clave: string): Promise<string | null>;
  setItem(clave: string, valor: string): Promise<void>;
}

// La "v1" deja cambiar la forma de los datos más adelante sin leer basura vieja.
export const CLAVE = 'gastos-del-carro:v1';

/** Guarda en el teléfono con AsyncStorage: solo texto, por eso JSON (clase 58). */
export function crearRepositorioTelefono(almacen: AlmacenDeTexto = AsyncStorage): Repositorio {
  return {
    async leer() {
      const texto = await almacen.getItem(CLAVE);
      if (texto === null) return []; // la primera vez: nada guardado
      try {
        const datos = JSON.parse(texto);
        return Array.isArray(datos) ? datos : [];
      } catch {
        return []; // texto roto: empezar vacío antes que dejar la app trabada
      }
    },
    async guardar(lista) {
      await almacen.setItem(CLAVE, JSON.stringify(lista));
    },
  };
}

/** En memoria: para las pruebas. Empieza con lo que le des. */
export function crearRepositorioMemoria(inicial: Gasto[] = []): Repositorio & { guardado: () => Gasto[] } {
  let lista = [...inicial];
  return {
    async leer() { return [...lista]; },
    async guardar(nueva) { lista = [...nueva]; },
    guardado: () => lista,
  };
}
