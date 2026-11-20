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
  mostrarHerramientasDelDueno(u);
}

// ---------- herramientas solo para el dueño del sitio (el modo presentación) ----------
// El botón 📺 solo se muestra cuando entra el dueño. Para no escribir su correo en un código
// público, se guarda su HUELLA (SHA-256 del correo en minúsculas): de la huella no se puede sacar
// el correo. Ojo: esto solo esconde un botón de comodidad; no protege nada importante (lo que
// importa lo protegen las reglas de Firestore y las funciones).
const HUELLA_DUENO = 'cd3276ccf8bcbe6089ff1b64f9e3c6ba8e7b1f9d16632e543ff1b57bd1edcded';
export const CLAVE_PRESENTACION = 'mapa-presentacion';

async function huella(texto) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function ponerPresentacion(si) {
  const boton = document.getElementById('boton-presentacion');
  document.documentElement.dataset.presentacion = si ? 'si' : '';
  boton.setAttribute('aria-pressed', String(si));
  boton.title = si ? 'Salir del modo presentación' : 'Modo presentación';
}

async function mostrarHerramientasDelDueno(u) {
  let esDueno = false;
  try { esDueno = Boolean(u?.email && u.emailVerified) && (await huella(u.email.trim().toLowerCase())) === HUELLA_DUENO; } catch (e) { /* sin crypto: no se muestra */ }
  document.getElementById('boton-presentacion').hidden = !esDueno;
  let guardado = false;
  try { guardado = localStorage.getItem(CLAVE_PRESENTACION) === 'si'; } catch (e) { /* nada */ }
  ponerPresentacion(esDueno && guardado);
}