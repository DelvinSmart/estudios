// El menú ☰ en árbol: Curso → Etapas → Clases, desde cualquier pantalla.
// En la computadora sale de costado; en el celular, como un panel que se desliza.
// Se arma cada vez que se abre, así siempre muestra el avance del momento.

import { CLASES, ETAPAS, CURSOS, cursoDeEtapa, numeroCurso } from './cursos.js';
import { escapar } from './pantalla.js';
import { conteo, prendidos, estadoClase, etapaDe, numeroEnCurso } from './avance.js';

function dondeEstoy() {
  const [que, id] = location.hash.replace(/^#\/?/, '').split('/');
  if (que === 'clase') { const e = etapaDe(id); return { clase: id, etapa: e?.id, curso: e && cursoDeEtapa(e) }; }
  if (que === 'etapa') { const e = ETAPAS.find((x) => x.id === id); return { etapa: id, curso: e && cursoDeEtapa(e) }; }
  if (que === 'curso') return { curso: id };
  return {};
}

function armarArbol() {
  const aqui = dondeEstoy();
  return Object.values(CURSOS).map((curso) => {
    const etapas = ETAPAS.filter((e) => cursoDeEtapa(e) === curso.id);
    const clases = etapas.flatMap((e) => e.clases);
    const hechas = clases.filter((n) => estadoClase(n) === 'hecha').length;
    const ramas = etapas.map((e) => {
      const lista = e.clases.map((n) => {
        const total = conteo[n] || 0;
        const listos = prendidos(n);
        const marca = total && listos === total ? '✓' : listos ? '◐' : '○';
        return `<li><a class="arbol-clase ${aqui.clase === n ? 'aqui' : ''}" href="#/clase/${n}">
          <span class="mono arbol-marca">${marca}</span><span class="mono acento">${numeroEnCurso(n)}</span> ${escapar(CLASES[n].titulo)}
          <span class="mono tenue arbol-cuenta">${listos}/${total}</span></a></li>`;
      }).join('');
      // En cursos de una sola etapa, las clases cuelgan directo del curso.
      if (etapas.length === 1) return `<ul class="arbol-clases">${lista}</ul>`;
      return `<details class="arbol-etapa" ${aqui.etapa === e.id ? 'open' : ''}>
        <summary><span class="emoji">${e.icono}</span> ${escapar(e.titulo)}</summary>
        <ul class="arbol-clases">${lista}</ul></details>`;
    }).join('');
    return `<details class="arbol-curso" ${aqui.curso === curso.id ? 'open' : ''}>
      <summary><span class="emoji">${curso.icono}</span> <b>${numeroCurso(curso.id)}. ${escapar(curso.titulo)}</b>
        <span class="mono tenue arbol-cuenta">${hechas}/${clases.length}</span></summary>
      <a class="arbol-ir mono" href="#/curso/${curso.id}">→ ver el mapa del curso</a>
      ${ramas}</details>`;
  }).join('');
}

export function prepararMenu() {
  const boton = document.getElementById('boton-menu');
  if (!boton) return;
  const fondo = document.createElement('div');
  fondo.className = 'arbol-fondo';
  fondo.hidden = true;
  const panel = document.createElement('aside');
  panel.className = 'arbol';
  panel.setAttribute('aria-label', 'Todos los cursos');
  panel.hidden = true;
  document.body.append(fondo, panel);

  // Mientras el menú está abierto, la página de atrás no se mueve (ni con el dedo ni con la rueda).
  const bloquearFondo = (si) => document.documentElement.classList.toggle('sin-scroll', si);
  const cerrar = () => { panel.hidden = true; fondo.hidden = true; boton.setAttribute('aria-expanded', 'false'); bloquearFondo(false); };
  const abrir = () => {
    panel.innerHTML = `
      <div class="arbol-cabeza"><span class="mono">~/cursos</span>
        <button class="boton-icono" type="button" data-cerrar aria-label="Cerrar">✕</button></div>
      <nav>${armarArbol()}</nav>
      <div class="arbol-pie mono">
        <a href="#/">🗺️ mapa completo</a><a href="#/progreso">💡 mi progreso</a>
        <a href="#/certificado">🎓 certificados</a><a href="#/verificar">✅ verificar un certificado</a><a href="#/laboratorio">🧪 laboratorio</a></div>`;
    panel.hidden = false; fondo.hidden = false;
    bloquearFondo(true);
    boton.setAttribute('aria-expanded', 'true');
    panel.querySelector('.aqui')?.scrollIntoView({ block: 'center' });
    panel.querySelector('[data-cerrar]').addEventListener('click', cerrar);
  };
  boton.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  fondo.addEventListener('click', cerrar);
  fondo.addEventListener('touchmove', (ev) => ev.preventDefault(), { passive: false }); // iPhone: el fondo no arrastra la página
  panel.addEventListener('click', (ev) => { if (ev.target.closest('a')) cerrar(); }); // al elegir, se cierra
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !panel.hidden) cerrar(); });
  window.addEventListener('hashchange', cerrar);
}
