// El cerebro de la página: mira la dirección (#/...) y dibuja la pantalla que toca.
//   #/                      → el mapa grande (las etapas)
//   #/etapa/web             → el mapa de una etapa (sus clases)
//   #/clase/15              → el mapa de una clase (sus partes)
//   #/clase/15/0/3          → leer la parte 3 del documento 0
//   #/clase/15/0/todo       → leer la clase entera de corrido
//   #/progreso              → mi progreso: un bombillo por cada parte
//   #/certificado[/muestra] → el certificado (de verdad, desde Firebase) o su muestra
//   #/verificar/ME-…        → cualquiera comprueba si un código existe
//   #/entrar[/crear|ayuda…] → la cuenta (solo Gmail): entrar, crear, recuperar
//   #/cuenta                → mi cuenta
//
// Cada pantalla vive en su propio archivo (web/vistas/). Este archivo solo decide cuál dibujar.

import { CURSOS } from './cursos.js';
import { normalizarRuta, hashDeClase } from './rutas.js';
import { textoPlano } from './lector.js';
import { leerTema, guardarTema } from './guardado.js';
import { prepararBuscador } from './buscar.js';
import { prepararMenu } from './menu.js';
import * as nube from './nube.js';
import { app, migas, mostrarError, alRedibujar } from './pantalla.js';
import { desactivarMapas } from './mapa-islas.js';
import { contarPartes } from './avance.js';
import { hayDatosDeSesion, recordarSesion, ponerPrompt, ponerPresentacion, CLAVE_PRESENTACION } from './sesion.js';
import { vistaInicio, vistaEtapa, vistaClase } from './vistas/mapas.js';
import { vistaParte } from './vistas/parte.js';
import { vistaProgreso } from './vistas/progreso.js';
import { vistaEntrar, vistaAccion, vistaCuenta } from './vistas/cuenta.js';
import { vistaCertificado, vistaVerificar } from './vistas/certificado.js';
import { vistaLaboratorio } from './vistas/laboratorio.js';

// ---------- el que decide qué pantalla mostrar ----------

// Las pantallas que no son del recorrido de estudio: desde ellas se puede volver a donde estabas.
const PANTALLAS_SUELTAS = ['progreso', 'certificado', 'entrar', 'cuenta', 'verificar', 'laboratorio'];

function ponerBotonVolver(mostrar) {
  const boton = document.getElementById('boton-volver');
  let antes = '';
  try { antes = sessionStorage.getItem('mapa-antes') || ''; } catch (e) { /* sin almacenamiento */ }
  const vale = /^#\/[\w\-/]*$/.test(antes);
  boton.hidden = !mostrar;
  boton.href = vale ? antes : '#/';
  boton.querySelector('.boton-volver-texto').textContent = vale && antes !== '#/' ? ' volver a donde estaba' : ' volver al mapa';
}

async function dibujar() {
  desactivarMapas(app);
  // Acepta la URL bonita (#/programacion/5) y la vieja (#/clase/44): las dos llevan a la misma clase.
  const partesRuta = normalizarRuta(location.hash.replace(/^#\/?/, '').split('/').filter(Boolean));
  // Recordar la última pantalla de estudio (mapa, etapa, clase o parte) para poder volver a ella.
  // En las demás (progreso, cuenta, certificado…), arriba a la derecha aparece "← volver a donde estaba".
  const fueraDelEstudio = PANTALLAS_SUELTAS.includes(partesRuta[0]);
  if (!fueraDelEstudio) {
    try { sessionStorage.setItem('mapa-antes', location.hash || '#/'); } catch (e) { /* sin almacenamiento */ }
  }
  ponerBotonVolver(fueraDelEstudio);
  try {
    if (partesRuta[0] === 'progreso') await vistaProgreso();
    else if (partesRuta[0] === 'certificado') {
      const curso = CURSOS[partesRuta[1]] ? partesRuta[1] : 'programacion';
      await vistaCertificado(curso); // …/muestra también abre esta misma pantalla
    }
    else if (partesRuta[0] === 'entrar') await vistaEntrar(partesRuta[1]);
    else if (partesRuta[0] === 'cuenta') await vistaCuenta();
    else if (partesRuta[0] === 'verificar') await vistaVerificar(partesRuta[1]);
    else if (partesRuta[0] === 'laboratorio') vistaLaboratorio();
    else if (partesRuta[0] === 'curso') vistaInicio(partesRuta[1]);
    else if (partesRuta[0] === 'etapa') await vistaEtapa(partesRuta[1]);
    else if (partesRuta[0] === 'clase' && partesRuta[3]) await vistaParte(partesRuta[1], +partesRuta[2] || 0, partesRuta[3]);
    else if (partesRuta[0] === 'clase') await vistaClase(partesRuta[1], +partesRuta[2] || 0);
    else vistaInicio();
  } catch (err) {
    mostrarError(err);
  }
  // La barra de direcciones muestra siempre la forma bonita (#/curso/número), igual que la pantalla.
  // El progreso se guarda con el id fijo de atrás; esto solo cambia lo que se VE en la URL.
  if (partesRuta[0] === 'clase') {
    const bonito = hashDeClase(partesRuta[1], partesRuta[2], partesRuta[3]);
    if (bonito && location.hash !== bonito) {
      try { history.replaceState(null, '', bonito); } catch (e) { /* por si el navegador no deja */ }
    }
  }
  window.scrollTo({ top: 0 });
  document.title = `${textoPlano(migas.lastElementChild?.textContent || 'Mapa')} · Mapa de estudios`;
}

// ---------- el tema claro / oscuro ----------

document.getElementById('boton-tema').addEventListener('click', () => {
  const raiz = document.documentElement;
  const actual = raiz.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  const nuevo = actual === 'dark' ? 'light' : 'dark';
  raiz.dataset.theme = nuevo;
  guardarTema(nuevo);
});
if (!leerTema()) document.documentElement.dataset.theme = 'dark';

// ---------- el modo presentación ----------
// Agranda el texto y oculta los menús y distracciones. Es una herramienta del dueño del sitio:
// el botón solo aparece con su cuenta (ver mostrarHerramientasDelDueno en sesion.js).
const botonPresentacion = document.getElementById('boton-presentacion');
botonPresentacion.addEventListener('click', () => {
  const si = document.documentElement.dataset.presentacion !== 'si';
  ponerPresentacion(si);
  try { localStorage.setItem(CLAVE_PRESENTACION, si ? 'si' : ''); } catch (e) { /* sin almacenamiento */ }
});

// ---------- arranque ----------

async function empezar() {
  await contarPartes();
  alRedibujar(dibujar);
  prepararBuscador();
  prepararMenu();
  window.addEventListener('hashchange', dibujar);
  // ¿Llegó desde un enlace del correo? (…/estudios/?mode=resetPassword&oobCode=…)
  const enlace = new URLSearchParams(location.search);
  if (enlace.get('mode') && enlace.get('oobCode')) { vistaAccion(enlace.get('mode'), enlace.get('oobCode')); return; }
  // Solo carga Firebase al abrir si esta persona ya había entrado alguna vez.
  if (hayDatosDeSesion()) nube.alCambiarSesion((u) => { ponerPrompt(u); if (!u) recordarSesion(false); });
  dibujar();
}

empezar();
