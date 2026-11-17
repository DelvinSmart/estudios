// Pantalla 8: el laboratorio de CRUD. Escribes JavaScript a la izquierda, lo corres,
// y a la derecha ves los datos (una tabla), la consola y las pruebas de cada paso.
//
// Seguridad: tu código corre dentro de un iframe con sandbox="allow-scripts" y SIN allow-same-origin.
// Esa caja no puede leer este sitio, ni tu sesión, ni tu progreso: solo recibe el código por
// postMessage y devuelve los resultados por postMessage. Si tu código se queda en un ciclo
// infinito, la caja se descarta a los 3 segundos y se crea otra.

import { app, ponerMigas, escapar } from '../pantalla.js';

const CLAVE = 'mapa-laboratorio-crud';

const INICIO = `// 🧪 Laboratorio de CRUD: una lista de gastos del carro.
// CRUD = Crear, Leer (Read), Actualizar (Update) y Borrar (Delete).
// Completa las 5 funciones. Toca "▶ correr" para ver los datos y las pruebas.

let gastos = [];   // aquí viven los datos (en una app real: una base de datos)
let siguienteId = 1;

// 1) CREAR: agrega un gasto { id, tipo, valor } y devuélvelo.
//    El id empieza en 1 y sube de a uno.
function crear(tipo, valor) {
  // tu código aquí
}

// 2) LEER: listar() devuelve todos; buscar(id) devuelve uno, o null si no existe.
function listar() {
  // tu código aquí
}
function buscar(id) {
  // tu código aquí
}

// 3) ACTUALIZAR: cambia los campos que vengan en "cambios" ({ tipo, valor }).
//    Devuelve el gasto actualizado, o null si no existe.
function actualizar(id, cambios) {
  // tu código aquí
}

// 4) BORRAR: quita el gasto con ese id. Devuelve true si lo borró, false si no existía.
function borrar(id) {
  // tu código aquí
}

// 5) VALIDAR: vuelve a crear() y haz que lance un Error si el valor no es un número mayor que 0.
//    Pista: if (!(valor > 0)) throw new Error('El valor tiene que ser mayor que 0');

// ---- Prueba tú: lo que hagas aquí se ve en la tabla de la derecha ----
crear('combustible', 150);
crear('lavado', 30);
console.log('Gastos:', listar());
`;

const SOLUCION = `let gastos = [];
let siguienteId = 1;

function crear(tipo, valor) {
  if (!(valor > 0)) throw new Error('El valor tiene que ser mayor que 0');
  const nuevo = { id: siguienteId++, tipo, valor };
  gastos.push(nuevo);
  return nuevo;
}

function listar() {
  return gastos;
}
function buscar(id) {
  return gastos.find((g) => g.id === id) ?? null;
}

function actualizar(id, cambios) {
  const gasto = buscar(id);
  if (!gasto) return null;
  Object.assign(gasto, cambios);
  return gasto;
}

function borrar(id) {
  const antes = gastos.length;
  gastos = gastos.filter((g) => g.id !== id);
  return gastos.length < antes;
}

// ---- Prueba tú ----
crear('combustible', 150);
const lavado = crear('lavado', 30);
actualizar(lavado.id, { valor: 35 });
crear('peaje', 12.5);
borrar(1);
console.log('Gastos:', listar());
`;

// Las pruebas de cada paso. Cada una corre sobre una copia nueva de tu código (sin la parte "Prueba tú").
const PRUEBAS = [
  { paso: 1, nombre: 'crear() devuelve el gasto con id 1', codigo: `const g = crear('combustible', 150); ok(g && g.id === 1 && g.tipo === 'combustible' && g.valor === 150);` },
  { paso: 1, nombre: 'crear() dos veces da ids 1 y 2', codigo: `const a = crear('a', 1); const b = crear('b', 2); ok(a.id === 1 && b.id === 2);` },
  { paso: 2, nombre: 'listar() devuelve todos', codigo: `crear('a', 1); crear('b', 2); const l = listar(); ok(Array.isArray(l) && l.length === 2);` },
  { paso: 2, nombre: 'buscar(id) encuentra uno', codigo: `crear('a', 1); const b = crear('b', 2); ok(buscar(b.id)?.tipo === 'b');` },
  { paso: 2, nombre: 'buscar() de un id que no existe da null', codigo: `ok(buscar(99) === null);` },
  { paso: 3, nombre: 'actualizar() cambia el valor', codigo: `const g = crear('lavado', 30); const r = actualizar(g.id, { valor: 35 }); ok(r && r.valor === 35 && buscar(g.id).valor === 35 && buscar(g.id).tipo === 'lavado');` },
  { paso: 3, nombre: 'actualizar() de un id que no existe da null', codigo: `ok(actualizar(99, { valor: 1 }) === null);` },
  { paso: 4, nombre: 'borrar() quita el gasto y devuelve true', codigo: `const g = crear('a', 1); crear('b', 2); ok(borrar(g.id) === true && listar().length === 1 && buscar(g.id) === null);` },
  { paso: 4, nombre: 'borrar() de un id que no existe devuelve false', codigo: `crear('a', 1); ok(borrar(99) === false && listar().length === 1);` },
  { paso: 5, nombre: 'crear() con valor 0 o negativo lanza un error', codigo: `let lanzo = 0; try { crear('x', 0); } catch (e) { lanzo++; } try { crear('x', -5); } catch (e) { lanzo++; } ok(lanzo === 2);` },
  { paso: 5, nombre: 'crear() con un texto en vez de número lanza un error', codigo: `let lanzo = false; try { crear('x', 'mucho'); } catch (e) { lanzo = true; } ok(lanzo);` },
];

const PASOS = ['Crear', 'Leer', 'Actualizar', 'Borrar', 'Validar'];

// El programa que corre DENTRO de la caja aislada.
const CAJA = `<!doctype html><meta charset="utf-8"><script>
window.addEventListener('message', (ev) => {
  const { codigo, soloFunciones, pruebas } = ev.data || {};
  const logs = [];
  const fmt = (x) => { try { return typeof x === 'string' ? x : JSON.stringify(x, null, 1); } catch (e) { return String(x); } };
  const consola = { log: (...a) => logs.push(a.map(fmt).join(' ')), error: (...a) => logs.push('✗ ' + a.map(fmt).join(' ')) };
  let datos = null, error = null;
  try {
    datos = new Function('console', codigo + '\\n;return typeof gastos !== "undefined" ? gastos : null;')(consola);
  } catch (e) { error = (e && e.name ? e.name + ': ' : '') + (e && e.message ? e.message : e); }
  const resultados = pruebas.map((p) => {
    try {
      let paso = false;
      new Function('ok', 'console', soloFunciones + '\\n;' + p.codigo)((v) => { paso = Boolean(v); }, { log() {}, error() {} });
      return paso;
    } catch (e) { return false; }
  });
  parent.postMessage({ datos: JSON.parse(JSON.stringify(datos ?? null)), error, logs, resultados }, '*');
});
<\/script>`;

export function vistaLaboratorio() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'laboratorio de CRUD', corto: 'laboratorio' }]);
  let guardado = '';
  try { guardado = localStorage.getItem(CLAVE) || ''; } catch (e) { /* sin almacenamiento */ }

  app.innerHTML = `
    <section class="cabeza">
      <p class="mono comentario">// laboratorio · escribe, corre y mira el resultado al lado</p>
      <h1 class="titulo-medio">🧪 Laboratorio de CRUD</h1>
      <p class="bajada">Un <b>CRUD</b> son las cuatro cosas que hace casi cualquier app con sus datos:
        <b>C</b>rear, <b>L</b>eer, <b>A</b>ctualizar y <b>B</b>orrar. Aquí lo construyes paso a paso con una lista de gastos del carro,
        en JavaScript, sin instalar nada. Es lo mismo que la clase 09 hace con un servidor en Node.js.</p>
      <div class="lab-pasos mono" id="lab-pasos"></div>
    </section>
    <div class="lab">
      <div class="lab-editor">
        <div class="codigo-barra"><span class="puntos"><i></i><i></i><i></i></span><span class="lenguaje">crud.js</span></div>
        <textarea id="lab-codigo" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Tu código"></textarea>
        <div class="acciones">
          <button class="boton-principal" id="lab-correr" type="button">▶ correr</button>
          <button class="boton" id="lab-reiniciar" type="button">↺ empezar de nuevo</button>
          <button class="boton" id="lab-solucion" type="button">ver una solución</button>
        </div>
        <p class="tenue lab-nota">Tu código se guarda solo en este navegador. Atajo: <b>Cmd/Ctrl + Enter</b> para correr.</p>
      </div>
      <div class="lab-resultado">
        <h2 class="mono">// los datos</h2>
        <div id="lab-tabla" class="lab-tabla"><p class="tenue">Toca ▶ correr.</p></div>
        <h2 class="mono">// consola</h2>
        <pre id="lab-consola" class="lab-consola"></pre>
        <h2 class="mono">// pruebas</h2>
        <ul id="lab-pruebas" class="lab-pruebas"></ul>
        <details class="lab-http"><summary class="mono">// ¿y en un servidor? (como en la clase 09)</summary>
          <table><tr><th>CRUD</th><th>Función</th><th>En una API (HTTP)</th></tr>
            <tr><td>Crear</td><td><code>crear()</code></td><td><code>POST /gastos</code></td></tr>
            <tr><td>Leer</td><td><code>listar()</code> · <code>buscar(id)</code></td><td><code>GET /gastos</code> · <code>GET /gastos/1</code></td></tr>
            <tr><td>Actualizar</td><td><code>actualizar(id, …)</code></td><td><code>PUT</code> o <code>PATCH /gastos/1</code></td></tr>
            <tr><td>Borrar</td><td><code>borrar(id)</code></td><td><code>DELETE /gastos/1</code></td></tr></table>
        </details>
      </div>
    </div>`;

  const editor = app.querySelector('#lab-codigo');
  editor.value = guardado || INICIO;
  const guardar = () => { try { localStorage.setItem(CLAVE, editor.value); } catch (e) { /* nada */ } };
  editor.addEventListener('input', guardar);
  // Tab escribe dos espacios (en vez de saltar al botón), y Cmd/Ctrl + Enter corre.
  editor.addEventListener('keydown', (ev) => {
    if (ev.key === 'Tab') {
      ev.preventDefault();
      const { selectionStart: a, selectionEnd: b } = editor;
      editor.setRangeText('  ', a, b, 'end');
      guardar();
    }
    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) { ev.preventDefault(); correr(); }
  });

  let caja = null;
  let espera = null;
  const nuevaCaja = () => {
    caja?.remove();
    caja = document.createElement('iframe');
    caja.setAttribute('sandbox', 'allow-scripts');
    caja.className = 'lab-caja';
    caja.title = 'caja aislada donde corre tu código';
    caja.srcdoc = CAJA;
    document.body.appendChild(caja);
    return new Promise((listo) => caja.addEventListener('load', listo, { once: true }));
  };

  const pintar = ({ datos, error, logs, resultados }) => {
    clearTimeout(espera);
    const tabla = app.querySelector('#lab-tabla');
    if (Array.isArray(datos) && datos.length) {
      const columnas = [...new Set(datos.flatMap((d) => (d && typeof d === 'object' ? Object.keys(d) : ['valor'])))];
      tabla.innerHTML = `<table><tr>${columnas.map((c) => `<th>${escapar(c)}</th>`).join('')}</tr>${datos.map((d) =>
        `<tr>${columnas.map((c) => `<td>${escapar(d && typeof d === 'object' ? d[c] ?? '' : d)}</td>`).join('')}</tr>`).join('')}</table>`;
    } else {
      tabla.innerHTML = `<p class="tenue">${Array.isArray(datos) ? 'La lista está vacía.' : 'No encontré la variable gastos.'}</p>`;
    }
    app.querySelector('#lab-consola').textContent = [...logs, error ? `✗ ${error}` : ''].filter(Boolean).join('\n') || '(nada)';
    app.querySelector('#lab-pruebas').innerHTML = PRUEBAS.map((p, i) =>
      `<li class="${resultados[i] ? 'bien' : 'mal'}"><span>${resultados[i] ? '✓' : '✗'}</span> <b>${p.paso}.</b> ${escapar(p.nombre)}</li>`).join('');
    const pasos = PASOS.map((nombre, i) => {
      const suyas = PRUEBAS.map((p, k) => [p, resultados[k]]).filter(([p]) => p.paso === i + 1);
      const listo = suyas.every(([, r]) => r);
      return `<span class="lab-paso ${listo ? 'listo' : ''}">${listo ? '✓' : i + 1} ${nombre}</span>`;
    }).join('');
    const todas = resultados.every(Boolean);
    app.querySelector('#lab-pasos').innerHTML = pasos + (todas ? '<span class="lab-todo">🎉 ¡CRUD completo!</span>' : '');
  };

  async function correr() {
    guardar();
    await nuevaCaja();
    const codigo = editor.value;
    // Para las pruebas, se usa tu código sin la sección "Prueba tú" (así cada prueba empieza con la lista vacía).
    const corte = codigo.search(/\/\/\s*-{2,}\s*Prueba tú/i);
    const soloFunciones = corte >= 0 ? codigo.slice(0, corte) : codigo;
    espera = setTimeout(() => {
      nuevaCaja();
      app.querySelector('#lab-consola').textContent = '✗ Tu código tardó demasiado (¿un ciclo que nunca termina?). Lo detuve.';
    }, 3000);
    caja.contentWindow.postMessage({ codigo, soloFunciones, pruebas: PRUEBAS.map((p) => ({ codigo: p.codigo })) }, '*');
  }

  const recibir = (ev) => {
    if (!caja || ev.source !== caja.contentWindow) return; // solo escuchamos a nuestra caja
    pintar(ev.data);
  };
  window.addEventListener('message', recibir);
  const limpiar = () => { window.removeEventListener('message', recibir); caja?.remove(); clearTimeout(espera); window.removeEventListener('hashchange', limpiar); };
  window.addEventListener('hashchange', limpiar);

  app.querySelector('#lab-correr').addEventListener('click', correr);
  app.querySelector('#lab-reiniciar').addEventListener('click', () => {
    if (!confirm('¿Borrar tu código y empezar de nuevo?')) return;
    editor.value = INICIO; guardar(); correr();
  });
  app.querySelector('#lab-solucion').addEventListener('click', () => {
    if (!confirm('¿Ver una solución? Se reemplaza tu código (intenta primero tú: así se aprende).')) return;
    editor.value = SOLUCION; guardar(); correr();
  });
  correr();
}
