// Los ejercicios de código: el alumno escribe, toca "▶ probar" y ve cada prueba en verde o en rojo.
// En el .md se escriben en un bloque ```ejercicio:
//
//   titulo: Suma los gastos de la semana
//   lenguaje: js                      (js, ts, html, kotlin, swift o python; html puede traer su <style>)
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
//
// python: corre de verdad en el navegador con Pyodide, dentro de la caja y en un Worker (ver web/ejercicio-python.js).
// kotlin: no corre en el navegador. El código viaja al Kotlin Playground de JetBrains (gratis) y las pruebas se
// leen de lo que imprime (ver web/ejercicio-kotlin.js). Allá corre aislado en sus servidores, no en este sitio.
// swift: igual que kotlin, pero en Compiler Explorer (godbolt.org, gratis), con el Swift de Xcode (ver web/ejercicio-swift.js).

import { correrKotlin } from './ejercicio-kotlin.js';
import { correrSwift } from './ejercicio-swift.js';
import { cajaPython, ESPERA_PYTHON_MS, ESPERA_PYTHON_CORRER_MS } from './ejercicio-python.js';

const CLAVE = 'mapa-ejercicio:';
const CLAVE_OK = 'mapa-ejercicio-ok:';
const CLAVE_INTENTOS = 'mapa-ejercicio-intentos:';
// La solución se muestra después de 3 intentos de verdad (código distinto al del comienzo).
// Así no se puede mirar con un solo clic en "probar" con el cuadro vacío.
const INTENTOS_PARA_SOLUCION = 3;
const ESPERA_MS = 3000;
const ESPERA_TS_MS = 30000; // TypeScript: la primera vez baja el compilador
import { escapar as esc } from './texto.js';
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

// ts: primero el compilador oficial de TypeScript revisa los TIPOS (modo estricto) del código y de las pruebas
// juntos; si hay errores de tipos, se muestran con su línea y no se corre nada. Si no hay, se quita la parte de
// tipos y se corre igual que js. El compilador (gratis, de jsdelivr) y las definiciones de JavaScript (del sitio
// de TypeScript) se bajan la primera vez y después quedan en la caché del navegador.
const TS_VERSION = '5.4.5';
const CAJA_TS = `<!doctype html><meta charset="utf-8"><script>${AYUDAS}<\/script><script type="module">
// Los errores más comunes, explicados en español (se muestra también el mensaje original, el que sale en internet).
const EN_ESPANOL = {
  2578: 'una línea de las pruebas TENÍA que dar error de tipos y no dio: tu tipo todavía acepta algo que no debería',
  2322: 'pusiste un valor de un tipo donde va otro',
  2339: 'ese campo no existe en ese tipo (¿está mal escrito?)',
  2551: 'ese campo no existe; al final del mensaje TypeScript te sugiere el nombre correcto',
  2345: 'le pasaste a la función algo de otro tipo',
  7006: 'a este parámetro le falta su tipo',
  7010: 'a esta función le falta el tipo de lo que devuelve',
  2304: 'ese nombre no existe (¿está mal escrito o falta crearlo?)',
  2355: 'la función dice que devuelve algo, pero no siempre devuelve',
  2366: 'la función dice que devuelve algo, pero no siempre devuelve',
  18047: 'puede ser null: revísalo antes de usarlo',
  18048: 'puede no existir (undefined): revísalo antes de usarlo (con ?. o un if)',
  2532: 'puede no existir (undefined): revísalo antes de usarlo (con ?. o un if)',
  2741: 'falta un campo obligatorio',
  2353: 'ese campo no está en el tipo',
};
const AYUDAS_TIPOS ='declare function prueba(nombre: string, fn: () => unknown): void;\\ndeclare function igual(obtenido: unknown, esperado: unknown): void;\\ndeclare function ok(condicion: unknown, mensaje?: string): void;\\n';
window.addEventListener('message', async (ev) => {
  const { codigo, pruebas } = ev.data || {};
  let error = null;
  try {
    const ts = (await import('https://cdn.jsdelivr.net/npm/typescript@${TS_VERSION}/+esm')).default;
    const vfs = await import('https://cdn.jsdelivr.net/npm/@typescript/vfs@1.5.0/+esm');
    const opciones = { target: ts.ScriptTarget.ES2022, lib: ['es2022'], strict: true, noEmit: true };
    const mapa = await vfs.createDefaultMapFromCDN(opciones, '${TS_VERSION}', false, ts);
    const lineasCodigo = codigo.split('\\n').length;
    mapa.set('/ejercicio.ts', codigo + '\\n' + AYUDAS_TIPOS + pruebas + '\\nexport {};');
    const sistema = vfs.createSystem(mapa);
    const entorno = vfs.createVirtualTypeScriptEnvironment(sistema, ['/ejercicio.ts'], ts, opciones);
    const errores = [...entorno.languageService.getSyntacticDiagnostics('/ejercicio.ts'), ...entorno.languageService.getSemanticDiagnostics('/ejercicio.ts')];
    if (errores.length) {
      error = 'TypeScript encontró ' + errores.length + (errores.length === 1 ? ' error de tipos' : ' errores de tipos') + ':\\n' + errores.slice(0, 6).map((d) => {
        const { line } = d.file.getLineAndCharacterOfPosition(d.start);
        const donde = line < lineasCodigo ? 'línea ' + (line + 1) : 'en las pruebas';
        const original = ts.flattenDiagnosticMessageText(d.messageText, ' ');
        return '· ' + donde + ': ' + (EN_ESPANOL[d.code] ? EN_ESPANOL[d.code] + '.\\n    (' + original + ')' : original);
      }).join('\\n');
    } else {
      const js = ts.transpileModule(codigo + '\\n;' + pruebas, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
      new Function('prueba', 'igual', 'ok', js)(prueba, igual, ok);
    }
  } catch (e) { error = error || __nombreError(e); }
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
    // En html, allow-forms deja que el alumno toque "enviar" en su propia página (sin preventDefault, solo se recarga la caja).
    // Nunca allow-same-origin: la caja sigue sin poder leer el sitio.
    caja.setAttribute('sandbox', ej.lenguaje === 'html' ? 'allow-scripts allow-forms' : 'allow-scripts');
    caja.className = ej.lenguaje === 'html' ? 'ejercicio-vista' : 'lab-caja';
    caja.title = 'caja aislada donde corre tu código';
    let terminado = false;
    const fin = (r) => { if (terminado) return; terminado = true; window.removeEventListener('message', alRecibir); clearTimeout(reloj); listo({ ...r, caja }); };
    const alRecibir = (ev) => {
      if (ev.source !== caja.contentWindow) return;
      if (ev.data?.__ejercicio) fin(ev.data);
      // Python avisa cuando terminó de bajar: desde ahí, el código tiene un reloj corto (un ciclo sin fin no espera 60 s).
      if (ev.data?.__ejercicioListo) { clearTimeout(reloj); reloj = setTimeout(() => fin({ error: `Tu código corrió más de ${ESPERA_PYTHON_CORRER_MS / 1000} segundos sin terminar: ¿hay un ciclo que nunca termina (un while que nunca se vuelve falso)?`, logs: [], resultados: [] }), ESPERA_PYTHON_CORRER_MS); }
    };
    window.addEventListener('message', alRecibir);
    const espera = { ts: ESPERA_TS_MS, python: ESPERA_PYTHON_MS }[ej.lenguaje] || ESPERA_MS;
    const sinInternet = { ts: ' (o no hay internet para bajar TypeScript)', python: ' (o no hay internet para bajar Python)' }[ej.lenguaje] || '';
    let reloj = setTimeout(() => fin({ error: `Se quedó trabado más de ${espera / 1000} segundos: ¿hay un ciclo que nunca termina?${sinInternet}`, logs: [], resultados: [] }), espera);
    caja.addEventListener('load', () => caja.contentWindow.postMessage({ codigo, pruebas: ej.pruebas }, '*'), { once: true });
    caja.srcdoc = ej.lenguaje === 'html' ? cajaHtml(codigo) : ej.lenguaje === 'ts' ? CAJA_TS : ej.lenguaje === 'python' ? cajaPython() : CAJA_JS;
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
      ${ej.solucion ? '<button class="boton ejercicio-ver" type="button" disabled>ver solución</button>' : ''}
    </div>
    <div class="ejercicio-resultado" aria-live="polite"></div>
    <pre class="ejercicio-solucion" hidden></pre>`;

  const editor = caja.querySelector('.ejercicio-codigo');
  const resultado = caja.querySelector('.ejercicio-resultado');
  const botonVer = caja.querySelector('.ejercicio-ver');
  editor.value = leer(CLAVE + id) ?? ej.codigo;
  // Cuántas veces probó con código propio. Si ya lo resolvió, la solución queda libre.
  let intentos = Number(leer(CLAVE_INTENTOS + id)) || 0;
  const ponerBotonVer = () => {
    if (!botonVer) return;
    const libre = resuelto || caja.classList.contains('resuelto') || intentos >= INTENTOS_PARA_SOLUCION;
    botonVer.disabled = !libre;
    botonVer.title = libre ? '' : `Primero inténtalo: se abre tras ${INTENTOS_PARA_SOLUCION} intentos con tu código (llevas ${intentos})`;
  };
  ponerBotonVer();
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
    const espera = { ts: 'TypeScript está revisando los tipos… (la primera vez tarda unos segundos)', kotlin: 'Kotlin está compilando y corriendo tu código en el Playground de JetBrains… (unos segundos)', swift: 'Swift está compilando y corriendo tu código en Compiler Explorer… (unos segundos; la primera vez, hasta 10)', python: 'Python está corriendo tu código… (la primera vez baja Python: puede tardar unos segundos)' };
    resultado.innerHTML = `<p class="tenue mono">${espera[ej.lenguaje] || 'probando…'}</p>`;
    vista?.remove();
    const r = ej.lenguaje === 'kotlin' ? await correrKotlin(editor.value, ej.pruebas)
      : ej.lenguaje === 'swift' ? await correrSwift(editor.value, ej.pruebas)
      : await correrEnCaja(ej, editor.value);
    boton.disabled = false;
    // Solo cuenta como intento si cambió algo respecto al código del comienzo.
    const propio = editor.value.trim() !== '' && editor.value.trim() !== ej.codigo.trim();
    if (propio) { intentos += 1; escribir(CLAVE_INTENTOS + id, String(intentos)); }
    // En html, la página del alumno se queda a la vista; en js, la caja se borra. Kotlin y Swift no usan caja.
    if (ej.lenguaje === 'html') { vista = r.caja; } else { r.caja?.remove(); }
    const total = r.resultados.length;
    const bien = r.resultados.filter((x) => x.paso).length;
    const todo = total > 0 && bien === total && !r.error;
    caja.classList.toggle('resuelto', todo);
    caja.querySelector('.ejercicio-estado').textContent = todo ? '✓ resuelto' : '';
    escribir(CLAVE_OK + id, todo ? '1' : null);
    ponerBotonVer();
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
