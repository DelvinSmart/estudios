// Pantallas 6 y 7: el certificado de cada curso (emitido en Firebase) y la página pública
// para verificar un código. Es un certificado del propio curso: no es un título oficial.

import { CLASES, ETAPAS, CURSOS, cursoDeEtapa } from '../cursos.js';
import { leerNombre, guardarNombre } from '../guardado.js';
import * as nube from '../nube.js';
import { app, ponerMigas, avisar, escapar, redibujar } from '../pantalla.js';
import { ordenDe, totalPartes } from '../avance.js';
import { hayDatosDeSesion } from '../sesion.js';

// ---------- pantalla 6: el certificado (uno por curso) ----------
// Se emite en Firebase cuando la nube ve TODAS las partes del curso (lo comprueban las reglas, no el navegador).
// Es un certificado de finalización emitido por el propio curso: no es un título oficial.

const FECHA_LARGA = { day: 'numeric', month: 'long', year: 'numeric' };
const URL_SITIO = 'delvinsmart.github.io/estudios';

function rutaCertificado(curso) {
  return curso === 'programacion' ? '#/certificado' : `#/certificado/${curso}`;
}

// El dibujo del certificado. Lo usan la muestra, el certificado propio y la página de verificar.
function htmlCertificado({ nombre, fecha, codigo, curso, total, muestra }) {
  const c = CURSOS[curso];
  const clases = ordenDe(curso).length;
  const fechaTexto = fecha.toLocaleDateString('es', FECHA_LARGA);
  const anio = fecha.getFullYear();
  const etapas = ETAPAS.filter((e) => cursoDeEtapa(e) === curso);
  // En un curso de una sola etapa, se listan sus clases; si no, las etapas.
  const items = (etapas.length === 1 ? etapas[0].clases.map((n) => CLASES[n].titulo) : etapas.map((e) => e.titulo))
    .map((t) => `<li><span class="cert-num">[✓]</span>${escapar(t)}</li>`).join('');
  // El nombre y el código, escritos en binario (8 bits por letra), para las columnas de los lados.
  const binario = (t) => [...new TextEncoder().encode(t)].map((b) => b.toString(2).padStart(8, '0')).join('');
  const bitsIzq = binario(`${nombre} ${codigo} `).repeat(12).slice(0, 1400);
  const bitsDer = binario(`${curso} ${anio} ${clases}/${clases} ${total}/${total} exit 0 `).repeat(6).slice(0, 1400);
  const verificarEn = muestra ? `${URL_SITIO}/#/verificar` : `${URL_SITIO}/#/verificar/${codigo}`;
  return `
    <article class="certificado ${muestra ? 'es-muestra' : ''}">
      <div class="cert-hoja">
        <span class="cert-esquina e1"></span><span class="cert-esquina e2"></span>
        <span class="cert-esquina e3"></span><span class="cert-esquina e4"></span>
        <div class="cert-bits izq" aria-hidden="true">${bitsIzq}</div>
        <div class="cert-bits der" aria-hidden="true">${bitsDer}</div>
        <p class="cert-marca">estudios:~$ ./certificado --curso=${escapar(curso)}</p>
        <h1 class="cert-titulo">Certificado</h1>
        <p class="cert-tipo">de finalización</p>
        <p class="cert-estado">status: <b>completado</b> · ${clases}/${clases} clases · ${total}/${total} partes · exit 0</p>
        <p class="cert-otorga">Se otorga a</p>
        <p class="cert-nombre">${escapar(nombre || '—')}</p>
        <p class="cert-texto">por completar el curso <b>${escapar(c.nombre)}</b>,
          con sus ${clases} clases y ${total} partes, aprobando la práctica de cada una.</p>
        <ul class="cert-etapas">${items}</ul>
        <div class="cert-pie">
          <div class="cert-dato"><span class="cert-valor">${escapar(fechaTexto)}</span><span class="cert-rotulo">// fecha</span></div>
          <svg class="cert-sello" viewBox="0 0 120 120" aria-hidden="true">
            <defs><path id="cert-arco" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs>
            <circle cx="60" cy="60" r="57" class="s-borde"/>
            <circle cx="60" cy="60" r="51" class="s-fino"/>
            <circle cx="60" cy="60" r="34" class="s-fino"/>
            <text class="s-texto"><textPath href="#cert-arco" startOffset="0" textLength="272" lengthAdjust="spacing">&lt;/&gt; ${escapar(c.corto.toUpperCase().replace(/ /g, '_'))} · ${anio} · COMPLETADO ·</textPath></text>
            <path class="s-bombillo" d="M60 38c-9 0-15 7-15 15 0 6 3 9 6 12 2 2 3 4 3 7h12c0-3 1-5 3-7 3-3 6-6 6-12 0-8-6-15-15-15z"/>
            <path class="s-base" d="M54 76h12M55 80h10M57 84h6"/>
          </svg>
          <div class="cert-dato"><span class="cert-valor mono">${escapar(codigo)}</span><span class="cert-rotulo">// código de verificación</span></div>
        </div>
        <p class="cert-verificar">$ verificar → <b>${escapar(verificarEn)}</b></p>
        <p class="cert-aviso">Emitido por el propio curso de forma automática y registrado en su servidor (Firebase), que solo lo emite
          cuando ve todas las partes completadas. No es un título oficial ni está acreditado por ninguna institución educativa.</p>
      </div>
    </article>`;
}

function pantallaAviso(titulo, texto, acciones = '') {
  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// certificado de finalización</p>
      <h1 class="titulo-medio">${titulo}</h1>
      <div class="bajada">${texto}</div>
      <div class="acciones">${acciones}</div>
    </section>`;
}

export async function vistaCertificado(curso, muestra) {
  const c = CURSOS[curso];
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: `certificado · ${c.corto.toLowerCase()}`, corto: 'certificado' }]);
  const total = totalPartes(curso);
  const otros = Object.values(CURSOS).filter((o) => o.id !== curso)
    .map((o) => `<a class="boton" href="${rutaCertificado(o.id)}">certificado de ${escapar(o.corto.toLowerCase())}</a>`).join('');

  if (muestra) {
    app.innerHTML = `
      <div class="cert-herramientas no-imprimir">
        <p class="mono comentario">// muestra: así se verá cuando completes el curso "${escapar(c.corto.toLowerCase())}"</p>
        <div class="fila-codigo"><a class="boton" href="${rutaCertificado(curso)}">mi certificado de verdad →</a>${otros}</div>
      </div>
      ${htmlCertificado({ nombre: leerNombre() || 'Tu Nombre Completo', fecha: new Date(), codigo: 'MUESTRA', curso, total, muestra: true })}`;
    return;
  }

  const verMuestra = `<a class="boton" href="${rutaCertificado(curso)}/muestra">ver cómo será (muestra)</a>`;
  app.innerHTML = '<p class="mono tenue centro">// conectando con la nube…</p>';
  let quien = null;
  try { quien = hayDatosDeSesion() ? await nube.usuario() : null; } catch (e) {
    pantallaAviso('☁ Sin conexión', 'No pude conectar con el servidor del certificado. Revisa tu internet y vuelve a intentar.');
    return;
  }

  if (!quien) {
    try { sessionStorage.setItem('mapa-volver', rutaCertificado(curso)); } catch (e) { /* nada */ }
    pantallaAviso(`🎓 Certificado de ${escapar(c.corto.toLowerCase())}`,
      `Para que el certificado se pueda <b>verificar</b>, tu progreso tiene que estar en el servidor, no solo en este navegador.
       Entra con tu cuenta de Gmail: desde ahí, cada bombillo que prendas cuenta también en la nube.`,
      `<a class="boton-principal" href="#/entrar">entrar o crear cuenta</a>${verMuestra}`);
    return;
  }
  if (!nube.cuentaLista(quien)) {
    pantallaAviso('📭 Falta verificar tu correo', `Abre el enlace que te mandamos a <b>${escapar(quien.email)}</b>.`,
      '<a class="boton-principal" href="#/entrar/verificar">verificar mi correo</a>');
    return;
  }

  const propio = await nube.miCertificado(curso);
  if (propio) {
    app.innerHTML = `
      <div class="cert-herramientas no-imprimir">
        <p class="mono comentario">// tu certificado · registrado en el servidor</p>
        <div class="fila-codigo">
          <button class="boton-principal" id="cert-imprimir" type="button">imprimir / guardar PDF</button>
          <a class="boton" href="#/verificar/${propio.codigo}">página de verificación</a>
          <button class="boton" id="cert-copiar" type="button">copiar enlace para LinkedIn</button>
          <button class="boton" id="cert-borrar" type="button">corregir el nombre</button>
          ${otros}
        </div>
      </div>
      ${htmlCertificado({ nombre: propio.nombre, fecha: propio.emitido, codigo: propio.codigo, curso, total: propio.partes })}`;
    app.querySelector('#cert-imprimir').addEventListener('click', () => window.print());
    app.querySelector('#cert-copiar').addEventListener('click', async (ev) => {
      const enlace = `https://${URL_SITIO}/#/verificar/${propio.codigo}`;
      try { await navigator.clipboard.writeText(enlace); ev.currentTarget.textContent = '✓ copiado'; } catch (e) { prompt('Copia este enlace:', enlace); }
    });
    app.querySelector('#cert-borrar').addEventListener('click', async () => {
      if (!confirm('Esto borra tu certificado actual (su código dejará de funcionar) para que lo emitas de nuevo con el nombre corregido. ¿Seguir?')) return;
      await nube.borrarMiCertificado(curso, propio.codigo);
      redibujar();
    });
    return;
  }

  const progreso = await nube.leerProgresoNube(curso);
  const enNube = progreso?.n || 0;
  if (enNube < total) {
    pantallaAviso('🎓 Todavía no',
      `<p>El certificado de <b>${escapar(c.corto.toLowerCase())}</b> se emite cuando el servidor ve <b>todas</b> sus partes.
       En la nube llevas <b>${enNube}</b> de <b>${total}</b>.</p>
       <p>Los bombillos que prendiste <b>antes</b> de entrar con tu cuenta solo están en este navegador:
       entra a esas partes y toca <b>☁ contar en la nube</b>.</p>
       <div class="barra-progreso ancha"><span style="width:${(enNube / total) * 100}%"></span></div>`,
      `<a class="boton-principal" href="#/progreso">💡 ver mi progreso</a>${verMuestra}${otros}`);
    return;
  }

  pantallaAviso('🎓 ¡Completaste el curso!',
    `<p>El servidor ve las ${total} partes de <b>${escapar(c.corto.toLowerCase())}</b>. Revisa tu nombre y emite tu certificado:
      queda registrado con un código que cualquiera puede comprobar.</p>
     <label class="cuenta-campo"><span class="mono">nombre completo, como en tu documento</span>
       <input id="cert-nombre" maxlength="80" value="${escapar(quien.displayName || leerNombre() || '')}"></label>
     <p class="cuenta-nota">⚠️ <b>Este es el nombre que saldrá impreso en el certificado.</b> Escríbelo completo, con tildes y apellidos,
       igual que en tu documento de identidad. No pedimos CPF ni copia del documento: este sitio no tiene cómo confirmarlos
       con el gobierno, y guardar esos datos sería un riesgo para ti. Por eso, el nombre depende de que lo escribas bien.</p>
     <label class="cuenta-check"><input type="checkbox" id="cert-confirmo"> Confirmo que es mi nombre completo y correcto.</label>`,
    `<button class="boton-principal" id="cert-emitir" type="button" disabled>emitir mi certificado</button>`);
  const confirmo = app.querySelector('#cert-confirmo');
  const emitir = app.querySelector('#cert-emitir');
  confirmo.addEventListener('change', () => { emitir.disabled = !confirmo.checked; });
  emitir.addEventListener('click', async () => {
    const nombre = app.querySelector('#cert-nombre').value.trim().replace(/\s+/g, ' ');
    if (nombre.split(' ').length < 2) { avisar('✗ escribe tu nombre y tu apellido'); return; }
    emitir.disabled = true;
    try { guardarNombre(nombre); await nube.emitirCertificado(curso, c.prefijo, nombre, total); redibujar(); }
    catch (e) { emitir.disabled = false; avisar('✗ el servidor no lo aceptó; recarga e intenta de nuevo'); }
  });
}

// ---------- pantalla 7: verificar un certificado (para quien lo recibe, sin iniciar sesión) ----------

export async function vistaVerificar(codigo) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'verificar', corto: 'verificar' }]);
  const formulario = (valor = '') => `
    <div class="fila-codigo"><input id="ver-codigo" class="mono" placeholder="ME-XXXX-XXXX-XXXX" value="${escapar(valor)}">
      <button class="boton-principal" id="ver-boton" type="button">verificar</button></div>`;
  const conectar = () => {
    const ir = () => { location.hash = `#/verificar/${app.querySelector('#ver-codigo').value.trim().toUpperCase()}`; };
    app.querySelector('#ver-boton').addEventListener('click', ir);
    app.querySelector('#ver-codigo').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ir(); });
  };

  if (!codigo) {
    pantallaAviso('🔎 Verificar un certificado', 'Escribe el código que aparece en el certificado (empieza con ME-, SE-, IA- o AG-).', formulario());
    conectar();
    return;
  }

  app.innerHTML = '<p class="mono tenue centro">// consultando el servidor…</p>';
  let datos = null;
  try { datos = await nube.verificar(codigo.toUpperCase()); } catch (e) {
    pantallaAviso('☁ Sin conexión', 'No pude consultar el servidor. Revisa tu internet y vuelve a intentar.');
    return;
  }
  if (!datos || !CURSOS[datos.curso]) {
    pantallaAviso('✗ Este certificado no existe',
      `No hay ningún certificado registrado con el código <b class="mono">${escapar(codigo)}</b>.
       Si alguien te mostró un certificado con este código, no fue emitido por este curso (o fue anulado).`, formulario(codigo));
    conectar();
    return;
  }
  const dias = Math.max(1, Math.round((datos.fin - datos.inicio) / 86400000));
  app.innerHTML = `
    <section class="cabeza verificado no-imprimir">
      <p class="mono comentario">// verificación · consultado en el servidor del curso</p>
      <h1 class="titulo-medio"><span class="acento">✓</span> Certificado válido</h1>
      <dl class="datos-verificacion mono">
        <dt>nombre</dt><dd>${escapar(datos.nombre)}</dd>
        <dt>curso</dt><dd>${escapar(CURSOS[datos.curso].nombre)}</dd>
        <dt>código</dt><dd>${escapar(datos.codigo)}</dd>
        <dt>emitido</dt><dd>${datos.emitido.toLocaleDateString('es', FECHA_LARGA)}</dd>
        <dt>estudió</dt><dd>del ${datos.inicio.toLocaleDateString('es', FECHA_LARGA)} al ${datos.fin.toLocaleDateString('es', FECHA_LARGA)} (${dias} ${dias === 1 ? 'día' : 'días'})</dd>
        <dt>partes</dt><dd>${datos.partes} de ${datos.partes}, una por una, con hora del servidor</dd>
      </dl>
      <p class="tenue">Lo que garantiza esta página: que el certificado fue emitido por este curso, a ese nombre, después de
        registrar cada parte en el servidor. El nombre lo escribió la persona; no es un título oficial.</p>
    </section>
    ${htmlCertificado({ nombre: datos.nombre, fecha: datos.emitido, codigo: datos.codigo, curso: datos.curso, total: datos.partes })}`;
}
