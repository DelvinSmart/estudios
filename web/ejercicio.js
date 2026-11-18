// Los ejercicios de código: el alumno escribe, toca "▶ probar" y ve cada prueba en verde o en rojo.
// En el .md se escriben en un bloque ```ejercicio:
//
//   titulo: Suma los gastos de la semana
//   lenguaje: js                      (js o html; html puede traer su <style>)
//   pide: Completa total(gastos) para que devuelva la suma de los valores.
//   --- código
//   function total(gastos) {
//     // tu código aquí
//   }
//   --- pruebas
//   prueba('dos gastos suman 15', () => igual(total([{ valor: 10 }, { valor: 5 }]), 15));
//   --- solución
//   function total(gastos) { return gastos.reduce((s, g) => s + g.valor, 0); }
//
// En las pruebas hay tres ayudas: prueba(nombre, fn), igual(obtenido, esperado) y ok(condición, mensaje).
// En html, además: $(selector) y estilo(selector, propiedad).
//
// Seguridad: el código del alumno corre en una caja aislada (iframe con sandbox="allow-scripts", SIN
// allow-same-origin): no puede leer este sitio, ni la sesión, ni el progreso. Se crea una caja nueva en cada
// intento y, si no responde en 3 segundos (un ciclo sin fin), se descarta.
//
// Son para aprender: se revisan en el navegador. El certificado depende de las prácticas que corrige el servidor.

const CLAVE = 'mapa-ejercicio:';
const CLAVE_OK = 'mapa-ejercicio-ok:';
const ESPERA_MS = 3000;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const enLinea = (md) => (window.marked ? window.marked.parseInline(md) : esc(md));
const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const escribir = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

// ---------- leer el bloque ----------
export function leerEjercicio(texto) {
  const trozos = texto.replace(/\r/g, '').split(/^---\s*(código|codigo|pruebas|solución|solucion)\s*$/m);
  const cabeza = trozos[0];
  const secciones = {};
  for (let i = 1; i < trozos.length; i += 2) {
    const nombre = trozos[i].normalize('NFD').replace(/[̀-ͯ]/g, '');
    secciones[nombre] = trozos[i + 1].replace(/^\n/, '').replace(/\n+$/, '');
  }
  // La cabeza: "nombre: valor" por línea; una línea sin "nombre:" sigue al campo anterior (para un "pide" largo).
  const campos = {};
  let actual = null;
  for (const linea of cabeza.split('\n')) {
    const m = linea.match(/^(titulo|título|lenguaje|pide):\s*(.*)$/i);
    if (m) { actual = m[1].toLowerCase().replace('í', 'i'); campos[actual] = m[2]; }
    else if (actual && linea.trim()) campos[actual] += `\n${linea}`;
  }
  const campo = (n) => (campos[n] || '').trim();
  return {
    titulo: campo('titulo') || 'Ejercicio',
    lenguaje: (campo('lenguaje') || 'js').toLowerCase(),
    pide: campo('pide'),
    codigo: secciones.codigo || '',
    pruebas: secciones.pruebas || '',
    solucion: secciones.solucion || '',
  };
}

// ---------- lo que corre dentro de la caja ----------
// Las ayudas de las pruebas, iguales para js y html.
const AYUDAS = `
const __pruebas = [];
const prueba = (nombre, fn) => __pruebas.push({ nombre, fn });
const __mostrar = (x) => { try { return typeof x === 'string' ? JSON.stringify(x) : JSON.stringify(x); } catch (e) { return String(x); } };
const igual = (obtenido, esperado) => {
  if (__mostrar(obtenido) !== __mostrar(esperado)) throw new Error('se esperaba ' + __mostrar(esperado) + ' y salió ' + __mostrar(obtenido));
};
const ok = (condicion, mensaje) => { if (!condicion) throw new Error(mensaje || 'no se cumple'); };
const $ = (s) => document.querySelector(s);
const estilo = (s, p) => { const e = document.querySelector(s); if (!e) throw new Error('no encontré ' + s); return getComputedStyle(e).getPropertyValue(p).trim(); };
const __logs = [];
const __fmt = (x) => { try { return typeof x === 'string' ? x : JSON.stringify(x); } catch (e) { return String(x); } };
console.log = (...a) => __logs.push(a.map(__fmt).join(' '));
console.error = (...a) => __logs.push('✗ ' + a.map(__fmt).join(' '));
const __correrPruebas = async (errorCodigo) => {
  const resultados = [];
  for (const p of __pruebas) {
    if (errorCodigo) { resultados.push({ nombre: p.nombre, paso: false, mensaje: 'tu código tiene un error' }); continue; }
    try { await p.fn(); resultados.push({ nombre: p.nombre, paso: true }); }
    catch (e) { resultados.push({ nombre: p.nombre, paso: false, mensaje: e && e.message ? e.message : String(e) }); }
  }
  parent.postMessage({ __ejercicio: true, error: errorCodigo, logs: __logs, resultados }, '*');
};
const __nombreError = (e) => (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : e);
`;

// js: la caja espera el código y las pruebas por mensaje, y los corre juntos (las pruebas ven las funciones).
const CAJA_JS = `<!doctype html><meta charset="utf-8"><script>${AYUDAS}
window.addEventListener('message', async (ev) => {
  const { codigo, pruebas } = ev.data || {};
  let error = null;
  try { new Function('prueba', 'igual', 'ok', codigo + '\\n;' + pruebas)(prueba, igual, ok); }
  catch (e) { error = __nombreError(e); }
  await __correrPruebas(error);
}, { once: true });
<\/script>`;

// html: la página del alumno ES la caja; las pruebas llegan por mensaje y se corren cuando la página cargó.
const cajaHtml = (html) => `<!doctype html><meta charset="utf-8"><script>${AYUDAS}
window.addEventListener('message', (ev) => {
  const { pruebas } = ev.data || {};
  const correr = async () => {
    let error = null;
    try { new Function('prueba', 'igual', 'ok', '$', 'estilo', pruebas)(prueba, igual, ok, $, estilo); }
    catch (e) { error = __nombreError(e); }
    await __correrPruebas(error);
  };
  if (document.readyState === 'complete') correr(); else window.addEventListener('load', correr, { once: true });
}, { once: true });
<\/script>${html}`;

function correrEnCaja(ej, codigo) {
  return new Promise((listo) => {
    const caja = document.createElement('iframe');
    caja.setAttribute('sandbox', 'allow-scripts');
    caja.className = ej.lenguaje === 'html' ? 'ejercicio-vista' : 'lab-caja';
    caja.title = 'caja aislada donde corre tu código';
    let terminado = false;
    const fin = (r) => { if (terminado) return; terminado = true; window.removeEventListener('message', alRecibir); clearTimeout(reloj); listo({ ...r, caja }); };
    const alRecibir = (ev) => { if (ev.source === caja.contentWindow && ev.data?.__ejercicio) fin(ev.data); };
    window.addEventListener('message', alRecibir);
    const reloj = setTimeout(() => fin({ error: 'Se quedó trabado más de 3 segundos: ¿hay un ciclo que nunca termina?', logs: [], resultados: [] }), ESPERA_MS);
    caja.addEventListener('load', () => caja.contentWindow.postMessage({ codigo, pruebas: ej.pruebas }, '*'), { once: true });
    caja.srcdoc = ej.lenguaje === 'html' ? cajaHtml(codigo) : CAJA_JS;
    document.body.appendChild(caja); // una caja fuera de la página no carga; en html, después se mueve debajo del resultado
    return caja;
  });
}

// ---------- la tarjeta en la página ----------
export function crearEjercicio(texto, id) {
  const ej = leerEjercicio(texto);
  const caja = document.createElement('div');
  caja.className = 'ejercicio';
  const resuelto = leer(CLAVE_OK + id) === '1';
  if (resuelto) caja.classList.add('resuelto');
  caja.innerHTML = `
    <div class="ejercicio-cabeza mono"><span>🧩 ejercicio · ${esc(ej.lenguaje)}</span><span class="ejercicio-estado">${resuelto ? '✓ resuelto' : ''}</span></div>
    <p class="ejercicio-titulo">${enLinea(ej.titulo)}</p>
    ${ej.pide ? `<p class="ejercicio-pide">${enLinea(ej.pide)}</p>` : ''}
    <textarea class="ejercicio-codigo" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="tu código"></textarea>
    <div class="ejercicio-botones">
      <button class="boton-principal ejercicio-probar" type="button">▶ probar</button>
      <button class="boton ejercicio-reiniciar" type="button">reiniciar</button>
      ${ej.solucion ? '<button class="boton ejercicio-ver" type="button" disabled title="Primero inténtalo">ver solución</button>' : ''}
    </div>
    <div class="ejercicio-resultado" aria-live="polite"></div>
    <pre class="ejercicio-solucion" hidden></pre>`;

  const editor = caja.querySelector('.ejercicio-codigo');
  const resultado = caja.querySelector('.ejercicio-resultado');
  const botonVer = caja.querySelector('.ejercicio-ver');
  editor.value = leer(CLAVE + id) ?? ej.codigo;
  const ajustarAlto = () => { editor.style.height = 'auto'; editor.style.height = `${Math.max(120, editor.scrollHeight + 4)}px`; };
  requestAnimationFrame(ajustarAlto);
  editor.addEventListener('input', () => { escribir(CLAVE + id, editor.value); ajustarAlto(); });
  editor.addEventListener('keydown', (ev) => {
    if (ev.key === 'Tab') { ev.preventDefault(); editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end'); escribir(CLAVE + id, editor.value); }
    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); probar(); }
  });

  let vista = null;
  const probar = async () => {
    const boton = caja.querySelector('.ejercicio-probar');
    boton.disabled = true;
    resultado.innerHTML = '<p class="tenue mono">probando…</p>';
    vista?.remove();
    const r = await correrEnCaja(ej, editor.value);
    boton.disabled = false;
    if (botonVer) { botonVer.disabled = false; botonVer.title = ''; }
    // En html, la página del alumno se queda a la vista; en js, la caja se borra.
    if (ej.lenguaje === 'html') { vista = r.caja; } else { r.caja.remove(); }
    const total = r.resultados.length;
    const bien = r.resultados.filter((x) => x.paso).length;
    const todo = total > 0 && bien === total && !r.error;
    caja.classList.toggle('resuelto', todo);
    caja.querySelector('.ejercicio-estado').textContent = todo ? '✓ resuelto' : '';
    escribir(CLAVE_OK + id, todo ? '1' : null);
    resultado.innerHTML = `
      ${r.error ? `<p class="ejercicio-error">✗ ${esc(r.error)}</p>` : ''}
      ${total ? `<p class="ejercicio-cuenta mono ${todo ? 'bien' : ''}">${todo ? '✓ ¡Todas las pruebas pasan!' : `${bien} de ${total} pruebas pasan`}</p>` : ''}
      <ul class="ejercicio-pruebas">${r.resultados.map((x) => `<li class="${x.paso ? 'bien' : 'mal'}"><span>${x.paso ? '✓' : '✗'}</span> ${esc(x.nombre)}${x.paso || !x.mensaje ? '' : `<small>${esc(x.mensaje)}</small>`}</li>`).join('')}</ul>
      ${r.logs?.length ? `<pre class="ejercicio-consola">${esc(r.logs.join('\n'))}</pre>` : ''}`;
    if (vista) resultado.after(vista);
  };
  caja.querySelector('.ejercicio-probar').addEventListener('click', probar);
  caja.querySelector('.ejercicio-reiniciar').addEventListener('click', () => {
    if (editor.value !== ej.codigo && !confirm('¿Volver al código del comienzo? Se borra lo que escribiste en este ejercicio.')) return;
    editor.value = ej.codigo; escribir(CLAVE + id, null); ajustarAlto();
  });
  botonVer?.addEventListener('click', () => {
    const sol = caja.querySelector('.ejercicio-solucion');
    sol.hidden = !sol.hidden;
    sol.textContent = ej.solucion;
    botonVer.textContent = sol.hidden ? 'ver solución' : 'ocultar solución';
  });
  return caja;
}
