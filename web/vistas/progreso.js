// Pantalla 5: mi progreso, un bombillo por parte, separado por curso,
// con la cajita de la nube y el código para llevar el progreso a otro aparato.

import { CLASES, ETAPAS, CURSOS, cursoDeEtapa } from '../cursos.js';
import { leerArchivo, partir, textoPlano } from '../lector.js';
import { idParte, estaEntendida, recienPrendidos, olvidarRecien, exportarProgreso, importarProgreso } from '../guardado.js';
import * as nube from '../nube.js';
import { app, ponerMigas, escapar, dos, redibujar } from '../pantalla.js';
import { conteo, ORDEN, rutaDoc, ordenDe, totalPartes, prendidos, estadoClase, numeroEnCurso } from '../avance.js';
import { hayDatosDeSesion, recordarSesion } from '../sesion.js';

// ---------- pantalla 5: mi progreso (los bombillos), separado por curso ----------

export async function vistaProgreso() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'mi progreso', corto: 'progreso' }]);
  const recien = recienPrendidos();
  const titulos = {};
  await Promise.all(ORDEN.map(async (num) => {
    try { titulos[num] = partir(await leerArchivo(rutaDoc(num))).partes.map((p) => textoPlano(p.titulo)); } catch (e) { titulos[num] = []; }
  }));

  let orden = 0;
  let numEtapa = 0;
  const pintarEtapa = (e) => {
    numEtapa += 1;
    const filas = e.clases.map((num) => {
      const bombillos = (titulos[num] || []).map((t, i) => {
        const id = idParte(num, 0, i + 1);
        const prendido = estaEntendida(id);
        const nuevo = prendido && recien.has(id);
        const espera = nuevo ? `style="--espera:${(orden++) * 220}ms"` : '';
        return `<a class="bombillo ${prendido ? 'prendido' : ''} ${nuevo ? 'nuevo' : ''}" ${espera}
          href="#/clase/${num}/0/${i + 1}" title="${escapar(`${dos(i + 1)}. ${t}`)}" aria-label="${escapar(`Parte ${i + 1}: ${t}, ${prendido ? 'entendida' : 'pendiente'}`)}">💡</a>`;
      }).join('');
      return `<div class="fila-bombillos ${estadoClase(num)}">
        <a class="fila-clase" href="#/clase/${num}"><span class="mono acento">${numeroEnCurso(num)}</span> ${escapar(CLASES[num].titulo)}</a>
        <span class="bombillos">${bombillos}</span>
        <span class="mono tenue cuenta">${prendidos(num)}/${conteo[num] || 0}</span>
      </div>`;
    }).join('');
    const pe = e.clases.reduce((s, n) => s + prendidos(n), 0);
    const te = e.clases.reduce((s, n) => s + (conteo[n] || 0), 0);
    return `<section class="etapa-progreso">
      <h2 class="mono"><span class="emoji">${e.icono}</span> ${dos(numEtapa)} · ${escapar(e.titulo)} <span class="tenue">${pe}/${te}</span></h2>
      ${filas}
    </section>`;
  };

  const cursos = Object.values(CURSOS).map((c) => {
    const total = totalPartes(c.id);
    const listos = ordenDe(c.id).reduce((s, n) => s + prendidos(n), 0);
    const ruta = c.id === 'programacion' ? '#/certificado' : `#/certificado/${c.id}`;
    return `
      <section class="curso-progreso">
        <p class="mono comentario">// curso: ${escapar(c.corto.toLowerCase())}</p>
        <div class="gran-cuenta mono"><b>${listos}</b> de ${total} bombillos prendidos
          <span class="tenue nube-curso" data-curso="${c.id}"></span></div>
        <div class="barra-progreso ancha"><span style="width:${total ? (listos / total) * 100 : 0}%"></span></div>
        ${ETAPAS.filter((e) => cursoDeEtapa(e) === c.id).map(pintarEtapa).join('')}
        <p class="centro"><a class="boton" href="${ruta}">🎓 certificado de ${escapar(c.corto.toLowerCase())}${listos === total ? '' : ` · faltan ${total - listos}`}</a></p>
      </section>`;
  }).join('');

  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// mi progreso · en este navegador, y en la nube si entras con tu cuenta</p>
      <h1 class="titulo-medio">💡 Mi progreso</h1>
      <p class="bajada">Cada bombillo es una parte de una clase. Se prende cuando apruebas su práctica y tocas
        <b>"¿lo entendiste? márcalo"</b>. Cada curso tiene sus bombillos y su certificado.
        ${recien.size ? `<span class="insignia actual">+${recien.size} desde la última vez</span>` : ''}</p>
      <div class="caja-nube mono" id="caja-nube">☁ …</div>
    </section>
    ${cursos}
    <details class="intro llevar">
      <summary class="mono">// llevar mi progreso a otro aparato sin cuenta (de la Mac al iPad, por ejemplo)</summary>
      <div class="texto">
        <p>Si entras con tu cuenta, lo que cuenta para el certificado ya está en la nube y lo ves en cualquier aparato.
          Esto es para pasar los bombillos <b>de este navegador</b>: copia el código, ábrelo en el otro aparato y pégalo abajo.</p>
        <div class="fila-codigo"><input class="mono" id="codigo-progreso" readonly value="${exportarProgreso()}">
          <button class="boton" id="copiar-progreso" type="button">copiar</button></div>
        <div class="fila-codigo"><input class="mono" id="pegar-progreso" placeholder="pega aquí el código del otro aparato">
          <button class="boton" id="cargar-progreso" type="button">cargar</button></div>
        <p class="tenue" id="mensaje-progreso"></p>
      </div>
    </details>`;

  app.querySelector('#copiar-progreso').addEventListener('click', async (ev) => {
    try { await navigator.clipboard.writeText(app.querySelector('#codigo-progreso').value); ev.currentTarget.textContent = '✓ copiado'; }
    catch (e) { app.querySelector('#codigo-progreso').select(); }
  });
  app.querySelector('#cargar-progreso').addEventListener('click', () => {
    const msg = app.querySelector('#mensaje-progreso');
    try {
      const n = importarProgreso(app.querySelector('#pegar-progreso').value);
      msg.textContent = `✓ listo: se cargaron ${n} bombillos.`;
      setTimeout(redibujar, 900);
    } catch (e) {
      msg.textContent = '✗ ese código no sirve. Cópialo completo otra vez.';
    }
  });
  pintarCajaNube(app.querySelector('#caja-nube'));
  // Ya los viste prenderse: la próxima vez no se animan de nuevo.
  olvidarRecien();
}

// La cajita de "Mi progreso": quién entró y cuántos bombillos cuentan en la nube en cada curso.
async function pintarCajaNube(caja) {
  if (!hayDatosDeSesion()) {
    caja.innerHTML = `☁ Tus bombillos solo están en este navegador. Para el <b>certificado verificable</b>,
      <a class="boton" href="#/entrar">entra o crea tu cuenta</a>`;
    return;
  }
  try {
    const quien = await nube.usuario();
    if (!quien) { recordarSesion(false); pintarCajaNube(caja); return; }
    if (!nube.cuentaLista(quien)) {
      caja.innerHTML = `☁ Falta verificar tu correo (${escapar(quien.email)}) para que cuente en la nube.
        <a class="boton" href="#/entrar/verificar">verificar mi correo</a>`;
      return;
    }
    // Con la cuenta lista, la cajita entera es el acceso a "mi cuenta": una sola línea, sin botón aparte.
    const enlace = document.createElement('a');
    enlace.className = 'caja-nube caja-cuenta mono';
    enlace.id = 'caja-nube';
    enlace.href = '#/cuenta';
    enlace.title = 'Ir a mi cuenta';
    enlace.innerHTML = `<span>☁ Entraste como <b>${escapar(quien.displayName || quien.email)}</b></span><span class="caja-cuenta-ir">mi cuenta ›</span>`;
    caja.replaceWith(enlace);
    for (const c of Object.values(CURSOS)) {
      const p = await nube.leerProgresoNube(c.id);
      const span = app.querySelector(`.nube-curso[data-curso="${c.id}"]`);
      if (span) span.textContent = `· ☁ ${p?.n || 0} en la nube`;
    }
  } catch (e) {
    (app.querySelector('#caja-nube') || caja).textContent = '☁ sin conexión con la nube (tu progreso de este navegador sigue aquí)';
  }
}
