// LA LÓGICA: las reglas de los gastos. No sabe nada de HTTP ni de archivos:
// recibe un "almacén" (memoria o archivo) y solo le pide leer y guardar. Por eso se prueba fácil.

export const TIPOS = ['combustible', 'lavado', 'peaje', 'mantenimiento', 'otro'];
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** ¿Existe ese día en el calendario? JavaScript convierte "2026-02-31" en el 3 de marzo sin avisar;
 *  por eso se arma la fecha y se mira si, al escribirla de vuelta, sigue siendo la misma. */
function existeElDia(texto) {
  if (typeof texto !== 'string' || !FECHA.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d;
}

/** Revisa los datos. Con parcial = true (PATCH), solo revisa lo que viene. Devuelve la lista de errores. */
export function validar(datos, parcial = false) {
  const errores = [];
  const revisa = (campo) => !parcial || campo in datos;
  if (revisa('tipo') && !TIPOS.includes(datos.tipo)) errores.push(`tipo debe ser uno de: ${TIPOS.join(', ')}`);
  if (revisa('valor') && !(typeof datos.valor === 'number' && datos.valor > 0 && datos.valor <= 100000)) {
    errores.push('valor debe ser un número mayor que 0 y hasta 100000');
  }
  if (revisa('fecha') && !existeElDia(datos.fecha)) {
    errores.push('fecha debe ser AAAA-MM-DD');
  }
  if ('nota' in datos && !(typeof datos.nota === 'string' && datos.nota.length <= 80)) errores.push('nota debe ser un texto de hasta 80 letras');
  return errores;
}

/** Se queda solo con los campos que conocemos: si alguien manda { admin: true }, se ignora. */
export function soloConocidos(datos) {
  const r = {};
  for (const campo of ['tipo', 'valor', 'fecha', 'nota']) if (campo in datos) r[campo] = datos[campo];
  return r;
}

const redondear = (n) => Math.round(n * 100) / 100;

/** El servicio: las acciones del CRUD sobre un almacén con leer() y guardar(lista). */
export function crearServicio(almacen) {
  // UNA FILA PARA LOS CAMBIOS. Crear, actualizar y borrar hacen tres pasos: leer la lista, cambiarla y guardarla.
  // Si dos pedidos llegan a la vez, los dos leerían la misma lista vieja, sacarían el mismo id
  // y el segundo en guardar borraría lo del primero. Con la fila, cada cambio espera a que el anterior termine.
  let fila = Promise.resolve();
  const enFila = (paso) => {
    const resultado = fila.then(paso);
    fila = resultado.catch(() => {});   // si un cambio falla, la fila sigue con el próximo
    return resultado;
  };

  return {
    async listar({ tipo, desde, hasta } = {}) {
      const lista = await almacen.leer();
      return lista.filter((g) => (!tipo || g.tipo === tipo) && (!desde || g.fecha >= desde) && (!hasta || g.fecha <= hasta));
    },

    async buscar(id) {
      return (await almacen.leer()).find((g) => g.id === id) ?? null;
    },

    crear(datos) {
      return enFila(async () => {
        const lista = await almacen.leer();
        const id = lista.reduce((mayor, g) => Math.max(mayor, g.id), 0) + 1;
        const gasto = { id, ...soloConocidos(datos) };
        await almacen.guardar([...lista, gasto]);
        return gasto;
      });
    },

    actualizar(id, cambios) {
      return enFila(async () => {
        const lista = await almacen.leer();
        const actual = lista.find((g) => g.id === id);
        if (!actual) return null;
        const nuevo = { ...actual, ...soloConocidos(cambios), id };
        await almacen.guardar(lista.map((g) => (g.id === id ? nuevo : g)));
        return nuevo;
      });
    },

    borrar(id) {
      return enFila(async () => {
        const lista = await almacen.leer();
        const quedan = lista.filter((g) => g.id !== id);
        if (quedan.length === lista.length) return false;
        await almacen.guardar(quedan);
        return true;
      });
    },

    /** El resumen: total, cantidad y cuánto por tipo. */
    async resumen(filtro) {
      const lista = await this.listar(filtro);
      const porTipo = {};
      for (const g of lista) porTipo[g.tipo] = redondear((porTipo[g.tipo] ?? 0) + g.valor);
      return { total: redondear(lista.reduce((s, g) => s + g.valor, 0)), cantidad: lista.length, porTipo };
    },
  };
}
