// La sesión en la barra de arriba: si vale la pena cargar Firebase al abrir,
// y el "usuario@estudios" que se ve arriba a la izquierda.

// Un aviso en localStorage para saber si vale la pena cargar Firebase al abrir el sitio.
export function recordarSesion(si) {
  try { si ? localStorage.setItem('mapa-sesion', '1') : localStorage.removeItem('mapa-sesion'); } catch (e) { /* sin almacenamiento */ }
}
export function hayDatosDeSesion() {
  try { return localStorage.getItem('mapa-sesion') === '1'; } catch (e) { return false; }
}

// El "usuario@estudios" de la barra de arriba: tu primer nombre, o "invitado".
export function ponerPrompt(u) {
  const primer = (u?.displayName || '').trim().split(/\s+/)[0] || '';
  const limpio = primer.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  document.getElementById('prompt-usuario').textContent = `${limpio || 'invitado'}@estudios`;
  const boton = document.getElementById('boton-cuenta');
  boton.href = u ? '#/cuenta' : '#/entrar';
  boton.title = u ? 'Mi cuenta' : 'Entrar o crear cuenta';
}