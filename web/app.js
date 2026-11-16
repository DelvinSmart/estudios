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
import { textoPlano } from './lector.js';
import { leerTema, guardarTema } from './guardado.js';
import { prepararBuscador } from './buscar.js';
import { prepararMenu } from './menu.js';
import * as nube from './nube.js';
import { migas, mostrarError, alRedibujar } from './pantalla.js';
import { contarPartes } from './avance.js';
import { hayDatosDeSesion, recordarSesion, ponerPrompt } from './sesion.js';
import { vistaInicio, vistaEtapa, vistaClase } from './vistas/mapas.js';
import { vistaParte } from './vistas/parte.js';
import { vistaProgreso } from './vistas/progreso.js';
import { vistaEntrar, vistaAccion, vistaCuenta } from './vistas/cuenta.js';
import { vistaCertificado, vistaVerificar } from './vistas/certificado.js';
import { vistaLaboratorio } from './vistas/laboratorio.js';

// ---------- el que decide qué pantalla mostrar ----------

async function dibujar() {
  const partesRuta = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  // Recordar la última pantalla de estudio (mapa, etapa, clase o parte) para poder volver a ella.
  if (!['progreso', 'certificado', 'entrar', 'cuenta', 'verificar'].includes(partesRuta[0])) {
    try { sessionStorage.setItem('mapa-antes', location.hash || '#/'); } catch (e) { /* sin almacenamiento */ }
  }
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
