// EL DIRECTOR: junta las piezas y responde a lo que hace la persona. Paso 3 del plan.
// El ciclo de siempre: la persona hace algo → cambian los datos → se guarda → se vuelve a dibujar.
import { crearRepositorio } from './datos.mjs';
import { desdeFormulario, hechoHoy, problemasDe } from './logica.mjs';
import { dibujarLista, mostrarProblemas } from './pantalla.mjs';

const $ = (s) => document.querySelector(s);

/** La fecha de hoy como AAAA-MM-DD, con la hora del aparato (no la de Londres). */
function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const repositorio = crearRepositorio(window.localStorage);
let estado = repositorio.leer();

function guardarYDibujar() {
  $('#sin-guardar').hidden = repositorio.guardar(estado);
  dibujar();
}

function dibujar() {
  $('#km').value = estado.kmActual || '';
  dibujarLista($('#lista'), estado.lista, estado.kmActual, hoyISO(), {
    alHecho: (id) => {
      estado = { ...estado, lista: estado.lista.map((m) => (m.id === id ? hechoHoy(m, estado.kmActual, hoyISO()) : m)) };
      guardarYDibujar();
    },
    alBorrar: (id, nombre) => {
      if (!confirm(`¿Borrar "${nombre}"?`)) return; // deshacer no se puede: se pregunta antes
      estado = { ...estado, lista: estado.lista.filter((m) => m.id !== id) };
      guardarYDibujar();
    },
  });
}

$('#form-km').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const km = Number($('#km').value);
  if (!(Number.isInteger(km) && km >= 0)) {
    mostrarProblemas($('#problemas-km'), ['Los km de hoy tienen que ser un número entero']);
    return;
  }
  mostrarProblemas($('#problemas-km'), []);
  estado = { ...estado, kmActual: km };
  guardarYDibujar();
});

$('#form-nuevo').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const datos = Object.fromEntries(new FormData(ev.target));
  const problemas = problemasDe(datos, estado.kmActual, hoyISO());
  mostrarProblemas($('#problemas'), problemas);
  if (problemas.length) return;
  estado = { ...estado, lista: [...estado.lista, desdeFormulario(datos, estado.kmActual, crypto.randomUUID())] };
  ev.target.reset();
  $('#ultima-fecha').value = hoyISO();
  guardarYDibujar();
});

$('#ultima-fecha').value = hoyISO();
$('#ultima-fecha').max = hoyISO();
dibujar();
