// Las prácticas interactivas. En el .md se escriben en un bloque ```practica, una pregunta por línea,
// con los campos separados por " :: ". En GitHub quedan SIN respuestas:
//
//   vf :: `'Uber'` es un `string`
//   elige :: ¿De qué tipo es `45`? :: string :: number :: boolean
//   escribe :: ¿Qué es un `boolean`? :: Un dato que solo puede ser true o false.
//
// Las respuestas (V/F, cuál opción es la correcta y la explicación) están guardadas en privado
// y las corrige el SERVIDOR (la función corregirPractica de Firebase). Ver firebase/separar-respuestas.mjs.
//
// vf      = verdadero o falso.
// elige   = varias opciones; eliges una.
// escribe = respondes con tus palabras, comparas con la respuesta modelo y te autoevalúas (esa no la corrige el servidor).
//
// La regla: eliges TODAS tus respuestas y tocas "revisar". Para aprobar hay que acertar todas en el mismo intento.
// Si fallas, ves cuáles fallaste (no cuál era la correcta) y vuelves a intentar el bloque (en otro orden).

import { practicaAprobada, aprobarPractica } from './guardado.js';
import * as nube from './nube.js';

const enLinea = (md) => window.marked.parseInline(md);

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Lee las preguntas. Si alguna todavía trae respuesta (una práctica recién escrita), se ignora: decide el servidor.
function leerPreguntas(texto) {
  return texto.split('\n').map((l) => l.trim()).filter(Boolean).map((l, indice) => {
    const campos = l.split(' :: ').map((c) => c.trim());
    const tipo = campos[0].toLowerCase();
    if (tipo === 'vf') return { indice, tipo, enunciado: campos[1] };
    if (tipo === 'elige') {
      const opciones = campos.slice(2).filter((o) => !o.startsWith('→')).map((o, n) => ({ n, texto: o.replace(/^\*/, '') }));
      return { indice, tipo, enunciado: campos[1], opciones };
    }
    return { indice, tipo: 'escribe', enunciado: campos[1], modelo: campos[2] || '' };
  });
}

// Lo que dice la pantalla cuando el servidor no puede corregir.
function mensajeDeError(e) {
  if (e?.code === 'functions/resource-exhausted') return e.message || 'Demasiados intentos. Espera un poco.';
  if (e?.code === 'functions/not-found') return 'El servidor no conoce esta práctica todavía. Avísale a quien mantiene el curso.';
  return 'No pude conectar con el servidor que corrige. Revisa tu internet y vuelve a intentar.';
}

export function crearPractica(texto, id) {
  const preguntas = leerPreguntas(texto);
  const seCorrige = preguntas.some((p) => p.tipo !== 'escribe');
  const caja = document.createElement('div');
  caja.className = 'practica';
  caja.dataset.id = id;

  function dibujar(intento) {
    const yaAprobada = practicaAprobada(id);
    const orden = intento > 1 ? mezclar(preguntas) : preguntas;
    const elegido = {};    // índice de la pregunta → 'V' | 'F' | número de opción
    const autoeval = {};   // índice de la pregunta (escribe) → true | false

    caja.classList.toggle('aprobada', yaAprobada);
    caja.innerHTML = `
      <div class="practica-cabeza mono">
        <span>✍️ práctica${intento > 1 ? ` · intento ${intento}` : ''}</span>
        <span class="practica-cuenta"></span>
      </div>
      <p class="practica-regla tenue">${yaAprobada
        ? '✓ Ya la aprobaste. Puedes repasarla las veces que quieras.'
        : 'Elige todas tus respuestas y toca <b>revisar</b>. Para aprobar tienes que acertar <b>todas</b>.'}</p>
      <ol class="practica-lista"></ol>
      <div class="practica-pie">
        <button class="boton-principal revisar" type="button" disabled>revisar mis respuestas</button>
        <p class="practica-estado tenue mono"></p>
      </div>`;
    const lista = caja.querySelector('.practica-lista');
    const pie = caja.querySelector('.practica-pie');
    const revisar = caja.querySelector('.revisar');
    const estado = caja.querySelector('.practica-estado');
    const cuenta = caja.querySelector('.practica-cuenta');

    const respondida = (p) => (p.tipo === 'escribe' ? p.indice in autoeval : p.indice in elegido);
    const actualizar = () => {
      cuenta.textContent = `${preguntas.filter(respondida).length}/${preguntas.length}`;
      revisar.disabled = !preguntas.every(respondida);
    };

    const items = {};
    orden.forEach((p) => {
      const li = document.createElement('li');
      li.className = `pregunta ${p.tipo}`;
      items[p.indice] = li;
      const elegir = (boton, valor) => {
        li.querySelectorAll('.opciones button').forEach((b) => b.classList.toggle('elegida', b === boton));
        elegido[p.indice] = valor;
        actualizar();
      };

      if (p.tipo === 'vf') {
        li.innerHTML = `<p class="enunciado">${enLinea(p.enunciado)}</p>
          <div class="opciones"><button type="button" data-v="V">Verdadero</button><button type="button" data-v="F">Falso</button></div>`;
        li.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => elegir(b, b.dataset.v)));
      } else if (p.tipo === 'elige') {
        const opciones = intento > 1 ? mezclar(p.opciones) : p.opciones;
        li.innerHTML = `<p class="enunciado">${enLinea(p.enunciado)}</p>
          <div class="opciones">${opciones.map((o) => `<button type="button" data-n="${o.n}">${enLinea(o.texto)}</button>`).join('')}</div>`;
        li.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => elegir(b, Number(b.dataset.n))));
      } else {
        li.innerHTML = `<p class="enunciado">${enLinea(p.enunciado)}</p>
          <textarea rows="3" placeholder="Escríbelo con tus palabras, sin mirar arriba…"></textarea>
          <button type="button" class="boton comparar" disabled>comparar con la respuesta</button>`;
        const area = li.querySelector('textarea');
        const comparar = li.querySelector('.comparar');
        area.addEventListener('input', () => { comparar.disabled = area.value.trim().length < 12; });
        comparar.addEventListener('click', () => {
          area.disabled = true;
          comparar.remove();
          li.insertAdjacentHTML('beforeend', `
            <div class="modelo"><span class="mono tenue">// una buena respuesta:</span><br>${enLinea(p.modelo)}</div>
            <p class="tenue autoevaluacion">Sé honesto: ¿tu respuesta dice lo mismo (aunque sea con otras palabras)?</p>
            <div class="opciones"><button type="button" data-a="si">✓ sí, dije lo mismo</button><button type="button" data-a="no">✗ me faltó algo</button></div>`);
          li.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => {
            li.querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('elegida', x === b));
            autoeval[p.indice] = b.dataset.a === 'si';
            actualizar();
          }));
        });
      }
      lista.appendChild(li);
    });
    actualizar();

    // Pone el resultado en cada pregunta. Las explicaciones solo llegan cuando se aprueba.
    const marcar = (resultados, explicaciones) => {
      preguntas.forEach((p) => {
        const li = items[p.indice];
        li.querySelectorAll('button, textarea').forEach((b) => { b.disabled = true; });
        if (p.tipo !== 'escribe' && !resultados) return; // no se mandó al servidor: sin veredicto
        const ok = p.tipo === 'escribe' ? autoeval[p.indice] : resultados[p.indice];
        li.classList.remove('bien', 'mal');
        li.classList.add(ok ? 'bien' : 'mal');
        li.querySelector('.veredicto')?.remove();
        const porque = ok && explicaciones?.[p.indice] ? enLinea(explicaciones[p.indice]) : '';
        const texto = ok ? `✓ Correcto. ${porque}` : (p.tipo === 'escribe' ? '✗ Vuelve a leer esa parte y escríbelo otra vez.' : '✗ No.');
        li.insertAdjacentHTML('beforeend', `<p class="veredicto">${texto}</p>`);
      });
    };

    const aprobar = (detalle) => {
      aprobarPractica(id);
      caja.classList.add('aprobada');
      pie.innerHTML = '<p class="practica-final bien">✓ ¡Aprobada! Acertaste todas. Ya puedes marcar la parte como entendida.</p>';
      caja.dispatchEvent(new CustomEvent('practica-aprobada', { bubbles: true, detail: detalle }));
    };
    const reprobar = (malas) => {
      pie.innerHTML = `<p class="practica-final mal">✗ Fallaste ${malas}. Todavía no está aprobada.
        Vuelve a leer esa parte de la clase y repite.</p>
        <button class="boton" type="button">↻ intentar de nuevo (en otro orden)</button>`;
      pie.querySelector('button').addEventListener('click', () => { dibujar(intento + 1); caja.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    };

    revisar.addEventListener('click', async () => {
      const malasEscribe = preguntas.filter((p) => p.tipo === 'escribe' && !autoeval[p.indice]).length;
      // Si te faltó algo en las de escribir, ya hay que repetir: no se gasta un intento en el servidor.
      if (malasEscribe) { marcar(null, null); reprobar(malasEscribe); return; }
      // Solo preguntas para escribir: no hay nada que mandar al servidor.
      if (!seCorrige) { marcar(null, null); aprobar({ guardada: false, parteAprobada: false }); return; }
      revisar.disabled = true;
      estado.textContent = '// corrigiendo en el servidor…';
      try {
        const r = await nube.corregirPractica(id, elegido);
        marcar(r.resultados, r.explicaciones);
        if (r.aprobada) aprobar({ guardada: r.guardada, parteAprobada: r.parteAprobada });
        else reprobar(r.resultados.filter((x) => x === false).length);
      } catch (e) {
        estado.textContent = `✗ ${mensajeDeError(e)}`;
        revisar.disabled = false;
      }
    });
  }

  dibujar(1);
  return caja;
}
