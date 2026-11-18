// DÓNDE SE GUARDAN LOS DATOS. Dos almacenes con las mismas dos funciones (el mismo "contrato"):
// - en memoria, para las pruebas (rápido y empieza vacío);
// - en un archivo JSON, para que los gastos sobrevivan cuando se apaga el servidor.
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import path from 'node:path';

export function crearAlmacenMemoria(inicial = []) {
  let lista = structuredClone(inicial);
  return {
    async leer() { return structuredClone(lista); },
    async guardar(nueva) { lista = structuredClone(nueva); },
  };
}

export function crearAlmacenArchivo(ruta) {
  // Una fila de espera para escribir el archivo: dos guardados nunca escriben a la vez.
  // Ojo: esto solo ordena los GUARDADOS. Que dos pedidos no lean la misma lista vieja lo cuida
  // la fila del servicio (src/gastos.mjs), que ordena el cambio entero: leer, cambiar y guardar.
  let fila = Promise.resolve();
  return {
    async leer() {
      try {
        return JSON.parse(await readFile(ruta, 'utf8'));
      } catch (error) {
        if (error.code === 'ENOENT') return [];   // todavía no hay archivo: lista vacía
        throw error;                             // otro error: no lo escondas
      }
    },
    guardar(nueva) {
      fila = fila.then(async () => {
        await mkdir(path.dirname(ruta), { recursive: true });
        // Escribe en un archivo aparte y después lo renombra: si se corta la luz a la mitad,
        // el archivo bueno no queda roto.
        const temporal = `${ruta}.tmp`;
        await writeFile(temporal, JSON.stringify(nueva, null, 2), 'utf8');
        await rename(temporal, ruta);
      });
      return fila;
    },
  };
}
