// Lo que se guarda en este navegador: el tema y las partes que ya entendí.
// Si el navegador no deja guardar (modo privado), la página igual funciona.

function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v === null ? porDefecto : JSON.parse(v);
  } catch (e) {
    return porDefecto;
  }
}

function escribir(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin guardar */ }
}

const CLAVE_ENTENDIDO = 'mapa-entendido';

export function idParte(clase, doc, parte) {
  return `${clase}:${doc}:${parte}`;
}

export function estaEntendida(id) {
  return Boolean(leer(CLAVE_ENTENDIDO, {})[id]);
}

export function marcarEntendida(id, si) {
  const todo = leer(CLAVE_ENTENDIDO, {});
  if (si) todo[id] = true; else delete todo[id];
  escribir(CLAVE_ENTENDIDO, todo);
}

export function leerTema() {
  try { return localStorage.getItem('mapa-tema'); } catch (e) { return null; }
}

export function guardarTema(tema) {
  try { localStorage.setItem('mapa-tema', tema); } catch (e) { /* sin guardar */ }
}
