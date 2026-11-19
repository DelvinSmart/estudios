// Ayudantes de texto sin pantalla (no tocan el DOM): se pueden usar en cualquier archivo y probar solos.
//
// escapar: convierte un texto para meterlo en HTML sin que el navegador lo lea como etiquetas.
// "<b>hola</b>" se ve tal cual, en vez de volverse negrita (o, peor, un <script>).
// Antes había CINCO copias de esta función en distintos archivos; si un día había que corregirla,
// era fácil olvidar una. Ahora vive solo aquí.
const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapar = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ENTIDADES[c]);
