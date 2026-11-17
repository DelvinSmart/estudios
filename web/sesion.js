// La sesión en la barra de arriba: si vale la pena cargar Firebase al abrir,
// y el "usuario@estudios" que se ve arriba a la izquierda.

import { ponerAlumno } from './lector.js';
import { redibujar } from './pantalla.js';
let alumnoActual = '';

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
  // El mismo primer nombre, bien escrito ("Delvin"), para los saludos del profesor en las clases.
  // Solo letras: el nombre va dentro del texto de la clase, y no debe poder meter código.
  const letras = primer.replace(/[^\p{L}\p{M}'-]/gu, '');
  const nombre = letras ? letras[0].toUpperCase() + letras.slice(1) : '';
  if (nombre !== alumnoActual) {
    alumnoActual = nombre;
    ponerAlumno(nombre);
    // Si hay una clase abierta, se vuelve a dibujar con el nombre (la cuenta suele llegar un poco después).
    if (/^#\/clase\//.test(location.hash)) redibujar();
  }
  const boton = document.getElementById('boton-cuenta');
  boton.href = u ? '#/cuenta' : '#/entrar';
  boton.title = u ? 'Mi cuenta' : 'Entrar o crear cuenta';
}