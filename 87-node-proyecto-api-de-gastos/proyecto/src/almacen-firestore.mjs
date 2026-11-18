// EL TERCER ALMACÉN: guarda la lista en un documento de Firestore, para cuando la API vive en la nube.
// Cumple el mismo contrato que los otros dos (leer y guardar), así que la lógica y las rutas no cambian.
// No importa firebase-admin: recibe el documento ya armado. Así se prueba con un documento de mentira.
//
//   const doc = getFirestore().doc('gastos/lista');
//   const almacen = crearAlmacenEnDocumento(doc);

export function crearAlmacenEnDocumento(doc) {
  return {
    async leer() {
      const foto = await doc.get();               // una "foto" del documento en este momento
      return foto.exists ? foto.data().lista ?? [] : [];   // todavía no existe: lista vacía
    },
    async guardar(lista) {
      await doc.set({ lista, cambiado: new Date().toISOString() });
    },
  };
}
