// Reglas de negocio: funciones puras, sin servidor ni base de datos.
// Por eso son fáciles de probar con un test unitario.
function validarGasto(datos) {
  const errores = [];
  if (typeof datos.descripcion !== 'string' || datos.descripcion.trim() === '') {
    errores.push('La descripción es obligatoria.');
  }
  if (typeof datos.monto !== 'number' || !Number.isFinite(datos.monto) || datos.monto <= 0) {
    errores.push('El monto debe ser un número mayor que 0.');
  }
  return errores;
}

module.exports = { validarGasto };
