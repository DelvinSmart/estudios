// CÓMO SE DIBUJA UN GASTO en la página. Está aparte para que las pruebas la usen sin navegador.
// ⚠️ VERSIÓN CON ERRORES A PROPÓSITO.

// V4: XSS: la nota (que escribe la persona) se mete en el HTML tal cual.
export function filaHtml(gasto) {
  return `<li><strong>${gasto.tipo}</strong> R$ ${gasto.valor.toFixed(2)} · ${gasto.nota}</li>`;
}
