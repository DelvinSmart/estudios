// Panel · la conexión con GitHub: lee y guarda los .md de las clases con la llave (token) del autor.
// La llave se guarda solo en esta pestaña (sessionStorage) y se borra al cerrarla. Sin una llave con permiso sobre el
// repositorio, GitHub rechaza todo: el panel es público, pero sin la llave no sirve para nada.
//
// Guardar = un commit en la rama main. Después, GitHub Pages publica la página sola
// y la acción "Audios de las clases" rehace solo los audios de las partes que cambiaron.

export const REPO = 'DelvinSmart/estudios';
const RAMA = 'main';
const CLAVE = 'estudios-panel-llave';

// La llave vive en sessionStorage: se borra sola al cerrar la pestaña. Antes estaba en localStorage,
// que es compartido por TODAS las páginas de delvinsmart.github.io (otros proyectos incluidos):
// un fallo de seguridad en cualquiera de ellos podía leerla y publicar código en este repositorio.
// Si quedó una llave vieja en localStorage, se mueve aquí una vez y se borra de allá.
function moverLlaveVieja() {
  try {
    const vieja = localStorage.getItem(CLAVE);
    if (vieja) { sessionStorage.setItem(CLAVE, vieja); localStorage.removeItem(CLAVE); }
  } catch (e) { /* sin almacenamiento */ }
}
moverLlaveVieja();

export function llave() {
  try { return sessionStorage.getItem(CLAVE) || ''; } catch (e) { return ''; }
}
export function guardarLlave(valor) {
  try { sessionStorage.setItem(CLAVE, valor.trim()); } catch (e) {}
}
export function borrarLlave() {
  try { sessionStorage.removeItem(CLAVE); localStorage.removeItem(CLAVE); } catch (e) {}
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

// Cuando cambia un título, la clase y web/indice.json se guardan en UN solo commit: nunca quedan distintos.
// "rehacerIndice" recibe el índice actual y devuelve el nuevo. Si la clase cambió desde que se abrió, responde 409
// y no se pisa nada; si otro commit entra justo antes del último paso, GitHub lo rechaza con 422.
export async function guardarConIndice(ruta, texto, sha, mensaje, rehacerIndice) {
  const base = (await pedir(`/git/ref/heads/${RAMA}`)).object.sha;
  const actual = await pedir(`/contents/${enRuta(ruta)}?ref=${base}`);
  if (actual.sha !== sha) {
    const error = new Error('La clase cambió en GitHub');
    error.status = 409;
    throw error;
  }
  const indice = await pedir(`/contents/web/indice.json?ref=${base}`);
  const commitBase = await pedir(`/git/commits/${base}`);
  const archivo = (path, content) => ({ path, mode: '100644', type: 'blob', content });
  const arbol = await pedir('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: commitBase.tree.sha,
      tree: [archivo(ruta, texto), archivo('web/indice.json', rehacerIndice(desdeBase64(indice.content)))],
    }),
  });
  const nuevo = await pedir('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message: mensaje, tree: arbol.sha, parents: [base] }),
  });
  await pedir(`/git/refs/heads/${RAMA}`, { method: 'PATCH', body: JSON.stringify({ sha: nuevo.sha, force: false }) });
  return (await pedir(`/contents/${enRuta(ruta)}?ref=${nuevo.sha}`)).sha;
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
