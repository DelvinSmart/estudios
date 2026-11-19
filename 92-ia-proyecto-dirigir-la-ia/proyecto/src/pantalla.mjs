// LA PANTALLA: dibuja lo que dice la lógica. No calcula nada. Paso 3 del plan.
// Todo lo que escribe la persona va con textContent, nunca con innerHTML (regla de AGENTS.md).
import { estadoDe, ordenar, textoDeFalta } from './logica.mjs';

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/** Dibuja la lista. alHecho(id) y alBorrar(id) son los avisos que suben al director. */
export function dibujarLista(contenedor, lista, kmActual, hoy, { alHecho, alBorrar }) {
  contenedor.replaceChildren();
  if (lista.length === 0) {
    contenedor.append(crear('p', 'vacio', 'Todavía no anotaste mantenimientos.'));
    return;
  }
  const ul = crear('ul');
  for (const m of ordenar(lista, kmActual, hoy)) {
    const e = estadoDe(m, kmActual, hoy);
    const li = crear('li', `tarjeta item ${e.estado === 'al día' ? '' : e.estado}`.trim());
    li.append(crear('h2', '', m.nombre));
    li.append(crear('p', 'estado', `${e.estado} · ${textoDeFalta(e)}`));

    const acciones = crear('div', 'acciones');
    const hecho = crear('button', '', 'Hecho hoy');
    hecho.type = 'button';
    hecho.addEventListener('click', () => alHecho(m.id));
    const borrar = crear('button', 'borrar', 'Borrar');
    borrar.type = 'button';
    borrar.setAttribute('aria-label', `Borrar ${m.nombre}`);
    borrar.addEventListener('click', () => alBorrar(m.id, m.nombre));
    acciones.append(hecho, borrar);
    li.append(acciones);
    ul.append(li);
  }
  contenedor.append(ul);
}

/** Muestra los problemas del formulario (o los borra si no hay). */
export function mostrarProblemas(contenedor, problemas) {
  contenedor.replaceChildren(...problemas.map((p) => crear('p', 'aviso', p)));
}
