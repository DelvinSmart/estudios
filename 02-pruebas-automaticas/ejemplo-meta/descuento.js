function aplicarDescuento(precio, porcentaje) {
  return precio - (precio * porcentaje) / 100;
}

module.exports = { aplicarDescuento };
