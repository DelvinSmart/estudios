// Lo que se guarda en ESTE navegador: el tema y los bombillos (las partes que ya entendí).
// Cada persona y cada aparato tiene los suyos: nadie puede cambiar el progreso de otro.
// Si el navegador no deja guardar (modo privado), la página igual funciona.

import { CLASES } from './cursos.js';

function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v === null ? porDefecto : JSON.parse(v);
  } catch (e) {
    return porDefecto;
  }
}

// Devuelve false si el navegador no dejó guardar (modo privado, almacenamiento lleno).
function escribir(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
}

const CLAVE_ENTENDIDO = 'mapa-entendido';
const CLAVE_RECIEN = 'mapa-recien-prendidos';
const CLAVE_PRACTICA = 'mapa-practicas-aprobadas';

// El id de una parte usa el NOMBRE del archivo, no su posición,
// para que agregar una pestaña nueva no mueva los bombillos.
export function idParte(clase, doc, parte) {
  const archivo = CLASES[clase]?.docs[doc]?.archivo || doc;
  return `${clase}:${archivo}:${parte}`;
}

// Los bombillos se leen UNA vez y se guardan en memoria. Antes cada pregunta "¿esta parte está
// entendida?" volvía a leer y convertir todo el JSON: dibujar la portada lo hacía miles de veces.
// La memoria se borra al marcar un bombillo, y si otra pestaña cambió el progreso (evento "storage").
let entendidas = null;
let version = 0;
function todasEntendidas() {
  if (!entendidas) entendidas = leer(CLAVE_ENTENDIDO, {});
  return entendidas;
}
function olvidarMemoria() { entendidas = null; version++; }
try { window.addEventListener('storage', (ev) => { if (ev.key === CLAVE_ENTENDIDO || ev.key === null) olvidarMemoria(); }); } catch (e) { /* sin ventana (pruebas) */ }

// Un número que cambia cada vez que cambia el progreso (para que otros recuerden cálculos mientras tanto).
export const versionProgreso = () => version;

export function estaEntendida(id) {
  return Boolean(todasEntendidas()[id]);
}

// Devuelve false si no se pudo guardar: así la pantalla no muestra ✓ mintiendo.
export function marcarEntendida(id, si) {
  const todo = { ...todasEntendidas() };
  const recien = new Set(leer(CLAVE_RECIEN, []));
  if (si) { todo[id] = Date.now(); recien.add(id); } else { delete todo[id]; recien.delete(id); }
  const ok = escribir(CLAVE_ENTENDIDO, todo);
  escribir(CLAVE_RECIEN, [...recien]);
  olvidarMemoria();
  return ok;
}

// Los bombillos que se prendieron desde la última vez que miré "Mi progreso".
export function recienPrendidos() {
  return new Set(leer(CLAVE_RECIEN, []));
}

export function olvidarRecien() {
  escribir(CLAVE_RECIEN, []);
}

// Las prácticas (verdadero o falso, elegir, escribir) que ya aprobé.
export function practicaAprobada(id) {
  return Boolean(leer(CLAVE_PRACTICA, {})[id]);
}

export function aprobarPractica(id) {
  const todo = leer(CLAVE_PRACTICA, {});
  todo[id] = Date.now();
  escribir(CLAVE_PRACTICA, todo);
}

// Para llevar el progreso a otro aparato: un código de texto para copiar y pegar.
export function exportarProgreso() {
  const json = JSON.stringify({ e: leer(CLAVE_ENTENDIDO, {}), p: leer(CLAVE_PRACTICA, {}) });
  return btoa(unescape(encodeURIComponent(json)));
}

export function importarProgreso(codigo) {
  const json = decodeURIComponent(escape(atob(codigo.trim())));
  const datos = JSON.parse(json);
  if (typeof datos !== 'object' || Array.isArray(datos) || datos === null) throw new Error('código inválido');
  const entendido = datos.e || datos;   // los códigos viejos solo traían los bombillos
  escribir(CLAVE_ENTENDIDO, { ...leer(CLAVE_ENTENDIDO, {}), ...entendido });
  olvidarMemoria();
  if (datos.p) escribir(CLAVE_PRACTICA, { ...leer(CLAVE_PRACTICA, {}), ...datos.p });
  return Object.keys(entendido).length;
}

// Para el certificado: la fecha del último bombillo prendido y el nombre de la persona.
export function fechaUltimoBombillo() {
  const valores = Object.values(leer(CLAVE_ENTENDIDO, {})).filter((v) => typeof v === 'number');
  return valores.length ? new Date(Math.max(...valores)) : new Date();
}

export function leerNombre() {
  return leer('mapa-nombre', '');
}

export function guardarNombre(nombre) {
  escribir('mapa-nombre', nombre);
}

export function leerTema() {
  try { return localStorage.getItem('mapa-tema'); } catch (e) { return null; }
}

export function guardarTema(tema) {
  try { localStorage.setItem('mapa-tema', tema); } catch (e) { /* sin guardar */ }
}
