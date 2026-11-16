// Escuchar una parte en voz alta, con la voz que ya trae el aparato (gratis, sin servidor).
// Usa la "Web Speech API" del navegador: speechSynthesis.
//
// Cómo lee: recorre los párrafos, títulos, listas y avisos de la parte, uno por uno.
// Mientras lee uno, lo resalta y lo trae a la vista. Los bloques de código no los lee
// símbolo por símbolo (no se entendería): dice "aquí hay un ejemplo de código".

const sintetizador = window.speechSynthesis;
const CLAVE = 'mapa-voz';

function leerPreferencias() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; }
}
function guardarPreferencias(p) {
  try { localStorage.setItem(CLAVE, JSON.stringify({ ...leerPreferencias(), ...p })); } catch (e) { /* sin almacenamiento */ }
}

// Las voces en español del aparato (en algunos navegadores llegan un poco después).
function vocesEnEspanol() {
  return new Promise((listo) => {
    const filtrar = () => sintetizador.getVoices().filter((v) => /^es(-|_|$)/i.test(v.lang));
    const ya = filtrar();
    if (ya.length) return listo(ya);
    sintetizador.addEventListener('voiceschanged', () => listo(filtrar()), { once: true });
    setTimeout(() => listo(filtrar()), 1500);
  });
}

// Prefiere las voces "mejoradas" y de Latinoamérica.
function mejorVoz(voces) {
  const puntos = (v) => (/premium|enhanced|mejorad|natural|neural/i.test(v.name) ? 10 : 0)
    + (/es-(MX|US|419|CO|AR|CL|VE)/i.test(v.lang) ? 3 : 0) + (v.localService ? 1 : 0);
  return [...voces].sort((a, b) => puntos(b) - puntos(a))[0];
}

// Saca el texto que se va a leer, en pedazos (uno por párrafo), sin emojis.
function pedazos(raiz) {
  const sinEmojis = (t) => t.replace(/\p{Extended_Pictographic}️?/gu, '').replace(/\s+/g, ' ').trim();
  const lista = [];
  raiz.querySelectorAll('h1, h2, h3, p, li, .codigo, .practica, td').forEach((el) => {
    if (el.closest('.voz-barra, .pasos, .mini-mapa, .entendido, .comentario')) return;
    if (el.matches('.practica')) { lista.push({ el, texto: 'Aquí hay una práctica para responder.' }); return; }
    if (el.closest('.practica')) return;
    if (el.matches('.codigo')) { lista.push({ el, texto: 'Aquí hay un ejemplo de código.' }); return; }
    if (el.closest('.codigo')) return;
    if (el.matches('li') && el.querySelector(':scope > p')) return; // lo leen sus párrafos
    // En una lista con sublistas, cada punto lee solo su propio texto (las sublistas se leen aparte).
    let fuente = el;
    if (el.matches('li') && el.querySelector('ul, ol')) { fuente = el.cloneNode(true); fuente.querySelectorAll('ul, ol').forEach((x) => x.remove()); }
    const texto = sinEmojis(fuente.innerText ?? fuente.textContent ?? '');
    if (texto) lista.push({ el, texto });
  });
  return lista;
}

// Pone la barra de voz arriba de la hoja y devuelve nada. Se apaga sola al cambiar de pantalla.
export async function ponerBarraDeVoz(hoja, antesDe) {
  if (!sintetizador) return; // navegador sin voz: no se muestra nada
  const pref = leerPreferencias();
  const barra = document.createElement('div');
  barra.className = 'voz-barra mono';
  barra.innerHTML = `
    <button class="boton" data-voz="escuchar" type="button">🔊 escuchar esta parte</button>
    <button class="boton" data-voz="pausa" type="button" hidden>⏸ pausa</button>
    <button class="boton" data-voz="parar" type="button" hidden>⏹ parar</button>
    <label class="voz-opcion">velocidad
      <select data-voz="velocidad">${[0.8, 1, 1.2, 1.4].map((v) => `<option value="${v}" ${Number(pref.velocidad || 1) === v ? 'selected' : ''}>${v}x</option>`).join('')}</select></label>
    <label class="voz-opcion">voz <select data-voz="voz"><option>…</option></select></label>`;
  hoja.insertBefore(barra, antesDe || hoja.firstChild);

  const boton = (n) => barra.querySelector(`[data-voz="${n}"]`);
  const selVoz = boton('voz');
  const voces = await vocesEnEspanol();
  if (!voces.length) { barra.innerHTML = '<span class="tenue">// este aparato no tiene voces en español para leer en voz alta</span>'; return; }
  const elegida = voces.find((v) => v.voiceURI === pref.voz) || mejorVoz(voces);
  selVoz.innerHTML = voces.map((v) => `<option value="${v.voiceURI}" ${v === elegida ? 'selected' : ''}>${v.name.replace(/\s*\(.*\)/, '')} · ${v.lang}</option>`).join('');

  let cola = [];
  let posicion = 0;
  let leyendo = false;
  const marcar = (el) => {
    hoja.querySelectorAll('.leyendo').forEach((x) => x.classList.remove('leyendo'));
    if (el) { el.classList.add('leyendo'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  };
  const mostrar = (estado) => {
    boton('escuchar').hidden = estado !== 'quieto' && estado !== 'pausado';
    boton('escuchar').textContent = estado === 'pausado' ? '▶ seguir' : '🔊 escuchar esta parte';
    boton('pausa').hidden = estado !== 'hablando';
    boton('parar').hidden = estado === 'quieto';
  };
  const terminar = () => { leyendo = false; sintetizador.cancel(); marcar(null); mostrar('quieto'); posicion = 0; };

  // Lee un pedazo y, cuando termina, el siguiente (un pedazo por vez evita que el navegador corte textos largos).
  const decir = () => {
    if (!leyendo) return;
    if (posicion >= cola.length) { terminar(); return; }
    const { el, texto } = cola[posicion];
    const frase = new SpeechSynthesisUtterance(texto);
    const voz = voces.find((v) => v.voiceURI === selVoz.value);
    if (voz) { frase.voice = voz; frase.lang = voz.lang; } else frase.lang = 'es-MX';
    frase.rate = Number(boton('velocidad').value) || 1;
    frase.onend = () => { if (leyendo) { posicion += 1; decir(); } };
    frase.onerror = (ev) => { if (ev.error !== 'interrupted' && ev.error !== 'canceled') { posicion += 1; decir(); } };
    marcar(el);
    sintetizador.speak(frase);
  };

  boton('escuchar').addEventListener('click', () => {
    if (sintetizador.paused) { sintetizador.resume(); mostrar('hablando'); return; }
    sintetizador.cancel();
    cola = pedazos(hoja);
    // Si el usuario ya bajó, empieza desde el primer párrafo que está a la vista.
    const enVista = cola.findIndex(({ el }) => el.getBoundingClientRect().bottom > 80);
    posicion = enVista > 0 ? enVista : 0;
    leyendo = true;
    mostrar('hablando');
    decir();
  });
  boton('pausa').addEventListener('click', () => { sintetizador.pause(); mostrar('pausado'); });
  boton('parar').addEventListener('click', terminar);
  boton('velocidad').addEventListener('change', (ev) => guardarPreferencias({ velocidad: Number(ev.target.value) }));
  selVoz.addEventListener('change', (ev) => guardarPreferencias({ voz: ev.target.value }));

  // Al ir a otra pantalla, se calla.
  const callar = () => { terminar(); window.removeEventListener('hashchange', callar); };
  window.addEventListener('hashchange', callar);
}
