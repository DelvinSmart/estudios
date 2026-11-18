// CÓMO SE DIBUJA UN GASTO en la página. Está aparte para que las pruebas la usen sin navegador. VERSIÓN ARREGLADA.

// ARREGLO V4: todo lo que viene de afuera se escapa antes de armar HTML (clase 23, Parte 4).
// El & primero: si fuera al final, rompería los &lt; que ya se pusieron.
export const escapar = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function filaHtml(gasto) {
  return `<li><strong>${escapar(gasto.tipo)}</strong> R$ ${Number(gasto.valor).toFixed(2)} · ${escapar(gasto.nota)}</li>`;
}
