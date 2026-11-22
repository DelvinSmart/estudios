// Instalar el Mapa como un ícono en la pantalla de inicio.
// Apple no deja que una página se instale sola con un botón: la persona lo confirma en Safari.

import { app, ponerMigas } from '../pantalla.js';

export const estaInstalada = () => navigator.standalone === true
  || matchMedia('(display-mode: standalone)').matches;

// El iPad moderno se presenta como una Mac, pero una Mac no tiene pantalla táctil.
const esIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const esAndroid = () => /Android/.test(navigator.userAgent);

function pasos() {
  if (esIOS()) {
    return `<ol class="cuenta-pasos">
      <li>Abre esta página en <b>Safari</b>.</li>
      <li>Toca el botón <b>Compartir</b> (el cuadrado con una flecha hacia arriba).</li>
      <li>Busca y toca <b>Agregar a inicio</b>. Si no aparece, toca <b>Ver más</b>.</li>
      <li>Toca <b>Agregar</b>. El ícono de <b>Aprender</b> queda junto a tus aplicaciones.</li>
    </ol>
    <p class="cuenta-nota">Abre siempre Aprender desde ese ícono. La primera vez entra con tu cuenta y tus bombillos aparecen solos.</p>`;
  }
  if (esAndroid()) {
    return `<ol class="cuenta-pasos">
      <li>Abre esta página en <b>Chrome</b>.</li>
      <li>Toca el menú <b>⋮</b>, arriba a la derecha.</li>
      <li>Toca <b>Agregar a la pantalla principal</b> y después <b>Instalar</b>.</li>
    </ol>`;
  }
  return `<p class="bajada">Abre esta misma página desde tu <b>iPhone, iPad o celular Android</b> y aquí verás los pasos para tu equipo.</p>`;
}

export function vistaInstalar() {
  ponerMigas([{ texto: 'mapa', href: '#/' }, { texto: 'instalar', corto: 'instalar' }]);
  const cuerpo = estaInstalada()
    ? `<h1 class="titulo-medio">✓ Ya está instalada</h1>
       <p class="bajada">Estás usando Aprender desde su ícono.</p>
       <a class="boton-principal ancho" href="#/">ir al mapa</a>`
    : `<h1 class="titulo-medio">Instala Aprender</h1>
       <p class="bajada">Ten tus clases en un ícono, a pantalla completa, con tu misma cuenta y tus mismos bombillos.</p>
       ${pasos()}
       <a class="boton ancho" href="#/">volver al mapa</a>`;
  app.innerHTML = `
    <section class="cuenta-pantalla">
      <div class="cuenta-tarjeta">
        <div class="cuenta-barra mono"><i></i><i></i><i></i><span>./instalar</span></div>
        <div class="cuenta-cuerpo">${cuerpo}</div>
      </div>
    </section>`;
}
