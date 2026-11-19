// LOS DATOS: guardar y leer en el navegador. Paso 2 del plan.
// El almacén entra de afuera (en la página, localStorage; en las pruebas, uno de mentira).

export const CLAVE = 'mantenimiento:v1'; // la v1 deja cambiar la forma de los datos más adelante
const VACIO = { kmActual: 0, lista: [] };

export function crearRepositorio(almacen) {
  return {
    /** Lo guardado, o el estado vacío si no hay nada, si está roto o si el navegador no deja leer. */
    leer() {
      try {
        const datos = JSON.parse(almacen.getItem(CLAVE));
        if (!datos || !Array.isArray(datos.lista) || typeof datos.kmActual !== 'number') return structuredClone(VACIO);
        return datos;
      } catch {
        return structuredClone(VACIO);
      }
    },
    /** true si se guardó. false si el navegador no dejó (modo privado, lleno): la página sigue y avisa. */
    guardar(estado) {
      try {
        almacen.setItem(CLAVE, JSON.stringify(estado));
        return true;
      } catch {
        return false;
      }
    },
  };
}
