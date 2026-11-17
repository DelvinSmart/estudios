// Panel · la conexión con GitHub: lee y guarda los .md de las clases con la llave (token) del autor.
// La llave se guarda solo en este aparato (localStorage). Sin una llave con permiso sobre el
// repositorio, GitHub rechaza todo: el panel es público, pero sin la llave no sirve para nada.
//
// Guardar = un commit en la rama main. Después, GitHub Pages publica la página sola
// y la acción "Audios de las clases" rehace solo los audios de las partes que cambiaron.

export const REPO = 'DelvinSmart/estudios';
const RAMA = 'main';
const CLAVE = 'estudios-panel-llave';

export function llave() {
  try { return localStorage.getItem(CLAVE) || ''; } catch (e) { return ''; }
}
export function guardarLlave(valor) {
  try { localStorage.setItem(CLAVE, valor.trim()); } catch (e) {}
}
export function borrarLlave() {
  try { localStorage.removeItem(CLAVE); } catch (e) {}
}

async function pedir(ruta, opciones = {}) {
  const r = await fetch(`https://api.github.com/repos/${REPO}${ruta}`, {
    ...opciones,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${llave()}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!r.ok) {
    const error = new Error(`GitHub respondió ${r.status}`);
    error.status = r.status;
    throw error;
  }
  return r.json();
}

// ¿La llave sirve? GitHub contesta 401 si la llave está mal o venció.
export async function probarLlave() {
  await pedir('');
}

const enRuta = (ruta) => ruta.split('/').map(encodeURIComponent).join('/');

export async function leer(ruta) {
  const d = await pedir(`/contents/${enRuta(ruta)}?ref=${RAMA}`);
  return { sha: d.sha, texto: desdeBase64(d.content) };
}

// Reemplaza el archivo. "sha" es la versión que se abrió: si alguien lo cambió mientras tanto,
// GitHub responde 409 y no se pisa nada. Devuelve el sha nuevo.
export async function guardar(ruta, texto, sha, mensaje) {
  const r = await pedir(`/contents/${enRuta(ruta)}`, {
    method: 'PUT',
    body: JSON.stringify({ message: mensaje, content: aBase64(texto), sha, branch: RAMA }),
  });
  return r.content.sha;
}

// GitHub manda y recibe el contenido en base64; estas dos respetan los acentos (UTF-8).
function aBase64(texto) {
  let binario = '';
  new TextEncoder().encode(texto).forEach((b) => { binario += String.fromCharCode(b); });
  return btoa(binario);
}
function desdeBase64(b64) {
  const binario = atob(b64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binario, (c) => c.charCodeAt(0)));
}
