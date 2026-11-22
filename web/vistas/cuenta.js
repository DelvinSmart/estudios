// La cuenta: entrar, crear, recuperar la contraseña, los enlaces que llegan por correo
// y "mi cuenta". Solo correo de Gmail, sin teléfono.

import { guardarNombre } from '../guardado.js';
import * as nube from '../nube.js';
import { app, ponerMigas, escapar, redibujar } from '../pantalla.js';
import { recordarSesion, hayDatosDeSesion, ponerPrompt } from '../sesion.js';

const MENSAJES_ERROR = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Revisa el correo que escribiste.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Entra, o usa "¿Problemas para entrar?".',
  'auth/weak-password': 'La contraseña es muy corta: usa al menos 8 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a intentar.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/expired-action-code': 'Ese enlace expiró. Pide uno nuevo.',
  'auth/invalid-action-code': 'Ese enlace no es válido o ya se usó. Pide uno nuevo.',
  'propio/no-gmail': 'Solo se aceptan correos de Gmail (terminan en @gmail.com).',
  'auth/operation-not-allowed': 'Esta forma de entrar todavía no está activada en Firebase (Authentication → Sign-in method).',
  'auth/unauthorized-domain': 'Este sitio no está en los dominios autorizados de Firebase.',
  'auth/unauthorized-continue-uri': 'Este sitio no está en los dominios autorizados de Firebase.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes para este sitio.',
  'auth/cancelled-popup-request': 'Se abrió otra ventana de Google. Vuelve a intentar.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/missing-email': 'Escribe tu correo.',
  'auth/user-disabled': 'Esta cuenta está desactivada.',
  'auth/admin-restricted-operation': 'Esta forma de entrar está desactivada en Firebase.',
  'auth/configuration-not-found': 'Falta activar el inicio de sesión en Firebase (Authentication → Comenzar).',
};
// Los errores del formulario traen su propio mensaje; los de Firebase se traducen con la tabla.
// Si es un error desconocido, se muestra su código: así se puede saber qué pasó.
const mensajeDe = (e) => e?.mensaje || MENSAJES_ERROR[e?.code]
  || `No se pudo completar ahora. Inténtalo de nuevo.${e?.code ? ` (código: ${e.code})` : ''}`;

// El marco de todas las pantallas de la cuenta: una tarjeta con aspecto de terminal.
function tarjetaCuenta(comando, titulo, cuerpo) {
  app.innerHTML = `
    <section class="cuenta-pantalla">
      <div class="cuenta-tarjeta">
        <div class="cuenta-barra mono"><i></i><i></i><i></i><span>${escapar(comando)}</span></div>
        <div class="cuenta-cuerpo">
          <h1 class="titulo-medio">${titulo}</h1>
          ${cuerpo}
          <p class="cuenta-estado" id="cuenta-estado" role="status"></p>
          <p class="cuenta-error mono" id="cuenta-error" role="alert"></p>
        </div>
      </div>
    </section>`;
}
const campo = (id, etiqueta, tipo = 'text', extra = '') => `
  <label class="cuenta-campo"><span class="mono">${etiqueta}</span>
    <input id="${id}" type="${tipo}" ${extra}></label>`;
const campoClave = (id, etiqueta, extra = '') => `
  <label class="cuenta-campo"><span class="mono">${etiqueta}</span>
    <span class="clave"><input id="${id}" type="password" autocapitalize="none" autocorrect="off" spellcheck="false" ${extra}>
      <button class="ver-clave mono" type="button" data-para="${id}" aria-label="Mostrar contraseña">ver</button></span></label>`;
const botonGoogle = '<button class="boton boton-google" id="cuenta-google" type="button"><span class="g">G</span> Continuar con Google</button>';

function conectarCuenta() {
  app.querySelectorAll('.ver-clave').forEach((b) => b.addEventListener('click', () => {
    const entrada = app.querySelector(`#${b.dataset.para}`);
    const ver = entrada.type === 'password';
    entrada.type = ver ? 'text' : 'password';
    b.textContent = ver ? 'ocultar' : 'ver';
  }));
  const g = app.querySelector('#cuenta-google');
  if (g) g.addEventListener('click', () => intentar(g, async () => despuesDeEntrar(await nube.entrarConGoogle()), 'Abriendo Google…'));
}
const errorCuenta = (texto) => { const p = app.querySelector('#cuenta-error'); if (p) p.textContent = texto ? `✗ ${texto}` : ''; };

// Ejecuta una acción con el botón deshabilitado y muestra el error si falla.
async function intentar(boton, accion, mensaje = 'Conectando con Aprender…') {
  const tarjeta = boton.closest('.cuenta-tarjeta');
  const estado = tarjeta?.querySelector('#cuenta-estado');
  const error = tarjeta?.querySelector('#cuenta-error');
  if (tarjeta?.dataset.ocupada || boton.disabled) return;
  if (tarjeta) tarjeta.dataset.ocupada = 'si';
  if (estado) estado.textContent = mensaje;
  if (error) error.textContent = '';
  boton.disabled = true;
  try {
    if (!navigator.onLine) throw { code: 'auth/network-request-failed' };
    await accion();
  } catch (e) {
    if (error) error.textContent = `✗ ${mensajeDe(e)}`;
    else errorCuenta(mensajeDe(e));
  } finally {
    boton.disabled = false;
    if (tarjeta) delete tarjeta.dataset.ocupada;
    if (estado) estado.textContent = '';
  }
}

function despuesDeEntrar(u) {
  recordarSesion(true);
  ponerPrompt(u);
  location.hash = nube.cuentaLista(u) ? (sessionStorage.getItem('mapa-volver') || '#/') : '#/entrar/verificar';
  try { sessionStorage.removeItem('mapa-volver'); } catch (e) { /* nada */ }
}

export async function vistaEntrar(paso) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'entrar', corto: 'entrar' }]);

  if (paso === 'crear') {
    tarjetaCuenta('./crear-cuenta', 'Crear cuenta', `
      <p class="bajada">Con tu cuenta, cada bombillo queda guardado en el servidor y al final puedes emitir un
        <b>certificado verificable</b>. Solo correo de <b>Gmail</b>: así Google confirma que el correo es tuyo
        y nadie puede emitir un certificado con un correo inventado.</p>
      ${campo('c-nombre', 'nombre completo', 'text', 'autocomplete="name" maxlength="80"')}
      <p class="cuenta-nota">⚠️ Escríbelo <b>tal como aparece en tu documento</b>, con tildes y apellidos.
        Es el nombre que saldrá impreso en tu certificado.</p>
      ${campo('c-correo', 'correo de Gmail', 'email', 'autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="tu.nombre@gmail.com"')}
      ${campoClave('c-clave', 'contraseña (mínimo 8)', 'autocomplete="new-password"')}
      ${campoClave('c-clave2', 'repite la contraseña', 'autocomplete="new-password"')}
      <button class="boton-principal ancho" id="c-crear" type="button">crear cuenta</button>
      <div class="separador mono">o</div>
      ${botonGoogle}
      <p class="cuenta-pie">¿Ya tienes cuenta? <a href="#/entrar">Entrar</a></p>`);
    conectarCuenta();
    const crear = app.querySelector('#c-crear');
    crear.addEventListener('click', () => intentar(crear, async () => {
      const nombre = app.querySelector('#c-nombre').value.trim().replace(/\s+/g, ' ');
      const correo = app.querySelector('#c-correo').value.trim();
      const clave = app.querySelector('#c-clave').value;
      if (nombre.split(' ').length < 2) throw { code: 'local', mensaje: 'Escribe tu nombre y tu apellido.' };
      if (!nube.esGmail(correo)) throw { code: 'propio/no-gmail' };
      if (clave.length < 8) throw { code: 'auth/weak-password' };
      if (clave !== app.querySelector('#c-clave2').value) throw { code: 'local', mensaje: 'Las contraseñas no son iguales.' };
      guardarNombre(nombre);
      await nube.crearCuenta(nombre, correo, clave);
      recordarSesion(true);
      location.hash = '#/entrar/verificar';
    }));
    return;
  }

  if (paso === 'ayuda') {
    tarjetaCuenta('./problemas-para-entrar', '¿Problemas para entrar?', `
      <p class="bajada">¿Qué olvidaste?</p>
      <a class="opcion" href="#/entrar/contrasena"><b>🔑 Olvidé mi contraseña</b>
        <span>Recibe un enlace en tu correo para crear una contraseña nueva.</span></a>
      <a class="opcion" href="#/entrar/correo"><b>✉️ Olvidé mi correo</b>
        <span>Cómo descubrir con qué Gmail creaste la cuenta.</span></a>
      <a class="opcion" href="#/entrar/verificar"><b>📭 No me llegó el correo de verificación</b>
        <span>Reenviarlo, y dónde buscarlo.</span></a>
      <p class="cuenta-pie"><a href="#/entrar">← volver a entrar</a></p>`);
    return;
  }

  if (paso === 'contrasena') {
    tarjetaCuenta('./recuperar-contrasena', 'Contraseña nueva', `
      <p class="bajada">Escribe el correo de la cuenta. Te mandamos ahí un enlace para crear una contraseña nueva.</p>
      ${campo('r-correo', 'correo de Gmail', 'email', 'autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="tu.nombre@gmail.com"')}
      <button class="boton-principal ancho" id="r-enviar" type="button">enviar enlace por correo</button>
      <div id="r-listo"></div>
      <p class="cuenta-pie"><a href="#/entrar/ayuda">← volver</a></p>`);
    const enviar = app.querySelector('#r-enviar');
    enviar.addEventListener('click', () => intentar(enviar, async () => {
      const correo = app.querySelector('#r-correo').value.trim();
      if (!nube.esGmail(correo)) throw { code: 'propio/no-gmail' };
      await nube.recuperarContrasena(correo);
      app.querySelector('#r-listo').innerHTML = `<p class="cuenta-ok"><b>Listo, revisa tu correo.</b>
        Si existe una cuenta con ese correo, el enlace llega en instantes. Revisa también <b>spam</b> y <b>promociones</b>.</p>`;
    }));
    return;
  }

  if (paso === 'correo') {
    tarjetaCuenta('./olvide-mi-correo', '¿Con qué correo entré?', `
      <p class="bajada">Aquí las cuentas son <b>solo de Gmail</b>, así que tu correo es una de las cuentas de Google que ya usas.
        No pedimos teléfono, así que no hay cómo buscarlo por número. Prueba así:</p>
      <ol class="cuenta-pasos">
        <li>Toca <b>Continuar con Google</b>: Google te muestra la lista de tus cuentas. Si creaste la cuenta con Google, es una de esas.</li>
        <li>Busca en tu Gmail el correo <b>"Verifica tu correo"</b> del Mapa de estudios: llegó a la cuenta con la que te registraste.</li>
        <li>En el celular, mira <b>Configuración → Google</b> (Android) o <b>Ajustes → Mail → Cuentas</b> (iPhone) para ver tus Gmail.</li>
      </ol>
      <p class="cuenta-nota">🔒 Por seguridad, esta página no dice si un correo está registrado o no: así nadie puede usarla para
        averiguar quién estudia aquí.</p>
      ${botonGoogle}
      <p class="cuenta-pie"><a href="#/entrar/ayuda">← volver</a></p>`);
    conectarCuenta();
    return;
  }

  if (paso === 'verificar' || paso === 'listo') {
    const quien = await nube.usuario().catch(() => null);
    if (!quien) { location.hash = '#/entrar'; return; }
    const u = paso === 'listo' ? await nube.refrescarCuenta() : quien;
    if (nube.cuentaLista(u)) {
      tarjetaCuenta('./verificar-correo', '✓ Correo verificado', `
        <p class="bajada">Listo, <b>${escapar(u.displayName || u.email)}</b>. Desde ahora, cada bombillo que prendas cuenta en la nube.</p>
        <a class="boton-principal ancho" href="#/">ir al mapa</a>`);
      ponerPrompt(u);
      return;
    }
    tarjetaCuenta('./verificar-correo', '📭 Revisa tu correo', `
      <p class="bajada">Te mandamos un enlace a <b>${escapar(u.email)}</b>. Ábrelo para confirmar que el correo es tuyo
        (así nadie crea cuentas con correos ajenos). Revisa también <b>spam</b> y <b>promociones</b>.</p>
      <button class="boton-principal ancho" id="v-ya" type="button">ya lo abrí, continuar</button>
      <button class="boton ancho" id="v-otra" type="button">reenviar el correo</button>
      <p class="cuenta-pie">¿Correo equivocado? <a href="#/cuenta">cerrar sesión y crear otra</a></p>`);
    const ya = app.querySelector('#v-ya');
    ya.addEventListener('click', () => intentar(ya, async () => {
      const r = await nube.refrescarCuenta();
      if (nube.cuentaLista(r)) redibujar(); else errorCuenta('Todavía no aparece verificado. Abre el enlace del correo y vuelve a tocar.');
    }));
    const otra = app.querySelector('#v-otra');
    otra.addEventListener('click', () => intentar(otra, async () => { await nube.reenviarVerificacion(); otra.textContent = '✓ reenviado'; }));
    return;
  }

  // Entrar (la pantalla principal)
  const yaDentro = hayDatosDeSesion() ? await nube.usuario().catch(() => null) : null;
  if (yaDentro) { location.hash = '#/cuenta'; return; }
  tarjetaCuenta('./entrar', 'Entrar', `
    <p class="bajada">Entra para que tus bombillos cuenten en la nube y puedas emitir tu certificado verificable.</p>
    ${campo('e-correo', 'correo de Gmail', 'email', 'autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="tu.nombre@gmail.com"')}
    ${campoClave('e-clave', 'contraseña', 'autocomplete="current-password"')}
    <button class="boton-principal ancho" id="e-entrar" type="button">entrar</button>
    <p class="cuenta-ayuda"><a href="#/entrar/ayuda">¿Problemas para entrar?</a></p>
    <div class="separador mono">o</div>
    ${botonGoogle}
    <p class="cuenta-pie">¿No tienes cuenta? <a href="#/entrar/crear">Crear cuenta</a></p>`);
  conectarCuenta();
  const entrar = app.querySelector('#e-entrar');
  const hacer = () => intentar(entrar, async () => {
    const correo = app.querySelector('#e-correo').value.trim();
    const clave = app.querySelector('#e-clave').value;
    if (!nube.esGmail(correo)) throw { code: 'propio/no-gmail' };
    if (!clave) throw { code: 'auth/missing-password' };
    document.activeElement?.blur();
    despuesDeEntrar(await nube.entrarConCorreo(correo, clave));
  });
  entrar.addEventListener('click', hacer);
  app.querySelector('#e-clave').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') hacer(); });
}


// Los enlaces que llegan por correo: ?mode=resetPassword&oobCode=… o ?mode=verifyEmail&oobCode=…
export async function vistaAccion(modo, codigo) {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'cuenta', corto: 'cuenta' }]);
  const limpiarUrl = () => history.replaceState(null, '', `${location.pathname}#/entrar`);
  if (modo === 'verifyEmail') {
    try {
      await nube.confirmarCorreoConEnlace(codigo);
      tarjetaCuenta('./verificar-correo', '✓ Correo verificado', `
        <p class="bajada">Listo. Ya puedes entrar y tus bombillos contarán en la nube.</p>
        <a class="boton-principal ancho" href="#/">ir al mapa</a>`);
    } catch (e) {
      tarjetaCuenta('./verificar-correo', 'Enlace no válido', `<p class="bajada">${escapar(mensajeDe(e))}</p>
        <a class="boton ancho" href="#/entrar/verificar">pedir otro</a>`);
    }
    limpiarUrl();
    return;
  }
  if (modo === 'resetPassword') {
    let correo = '';
    try { correo = (await nube.revisarEnlace(codigo)).data.email; } catch (e) {
      tarjetaCuenta('./recuperar-contrasena', 'Enlace no válido', `<p class="bajada">${escapar(mensajeDe(e))}</p>
        <a class="boton ancho" href="#/entrar/contrasena">pedir otro enlace</a>`);
      limpiarUrl();
      return;
    }
    tarjetaCuenta('./recuperar-contrasena', 'Crea tu contraseña nueva', `
      <p class="bajada">Llegaste por el enlace del correo de <b>${escapar(correo)}</b>: solo elige la contraseña nueva.</p>
      ${campoClave('n-clave', 'contraseña nueva (mínimo 8)', 'autocomplete="new-password"')}
      ${campoClave('n-clave2', 'repite la contraseña nueva', 'autocomplete="new-password"')}
      <button class="boton-principal ancho" id="n-cambiar" type="button">cambiar contraseña</button>`);
    conectarCuenta();
    const cambiar = app.querySelector('#n-cambiar');
    cambiar.addEventListener('click', () => intentar(cambiar, async () => {
      const clave = app.querySelector('#n-clave').value;
      if (clave.length < 8) throw { code: 'auth/weak-password' };
      if (clave !== app.querySelector('#n-clave2').value) throw { code: 'local', mensaje: 'Las contraseñas no son iguales.' };
      await nube.cambiarContrasenaConEnlace(codigo, clave);
      limpiarUrl();
      tarjetaCuenta('./recuperar-contrasena', '✓ Contraseña cambiada', `
        <p class="bajada">Entra de nuevo con tu contraseña nueva.</p>
        <a class="boton-principal ancho" href="#/entrar">entrar</a>`);
    }));
    return;
  }
  limpiarUrl();
  location.hash = '#/entrar';
}

export async function vistaCuenta() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'mi cuenta', corto: 'cuenta' }]);
  const u = hayDatosDeSesion() ? await nube.usuario().catch(() => null) : null;
  if (!u) { location.hash = '#/entrar'; return; }
  const verificado = nube.cuentaLista(u);
  tarjetaCuenta('./mi-cuenta', 'Mi cuenta', `
    <dl class="datos-verificacion mono">
      <dt>nombre</dt><dd>${escapar(u.displayName || '—')}</dd>
      <dt>correo</dt><dd>${escapar(u.email)}</dd>
      <dt>estado</dt><dd>${verificado ? '<span class="acento">✓ verificado</span>' : '⚠️ falta verificar · <a href="#/entrar/verificar">verificar</a>'}</dd>
    </dl>
    <details class="cuenta-detalle"><summary class="mono">cambiar mi nombre</summary>
      ${campo('m-nombre', 'nombre completo', 'text', `maxlength="80" value="${escapar(u.displayName || '')}"`)}
      <p class="cuenta-nota">Cambia el nombre de tu cuenta. Un certificado ya emitido no cambia: para corregirlo, usa
        "corregir el nombre" en la pantalla del certificado.</p>
      <button class="boton" id="m-guardar" type="button">guardar nombre</button>
    </details>
    <div class="acciones">
      <a class="boton" href="#/progreso">💡 mi progreso</a>
      <a class="boton" href="#/certificado">🎓 mis certificados</a>
      <button class="boton" id="m-salir" type="button">cerrar sesión</button>
    </div>`);
  const guardar = app.querySelector('#m-guardar');
  guardar.addEventListener('click', () => intentar(guardar, async () => {
    const nombre = app.querySelector('#m-nombre').value.trim().replace(/\s+/g, ' ');
    if (nombre.split(' ').length < 2) throw { code: 'local', mensaje: 'Escribe tu nombre y tu apellido.' };
    await nube.cambiarNombre(nombre);
    guardarNombre(nombre);
    ponerPrompt(await nube.usuario());
    redibujar();
  }));
  app.querySelector('#m-salir').addEventListener('click', async () => {
    await nube.salir();
    recordarSesion(false);
    ponerPrompt(null);
    location.hash = '#/';
  });
}
