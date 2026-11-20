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
// escribe = respondes con tus palabras y lo comparas con una respuesta modelo. Es SOLO PARA TI: nadie la corrige,
// así que no cuenta para aprobar ni para el certificado, y la página lo dice claro (no hay "sé honesto").
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
  if (e?.code === 'functions/unauthenticated') return 'Para revisar tus respuestas necesitas entrar con tu cuenta.';
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

    caja.classList.toggle('aprobada', yaAprobada);
    caja.innerHTML = `
      <div class="practica-cabeza mono">
        <span>✍️ práctica${intento > 1 ? ` · intento ${intento}` : ''}</span>
        <span class="practica-cuenta"></span>
      </div>
      <p class="practica-regla tenue">${yaAprobada
        ? '✓ Ya la aprobaste. Puedes repasarla las veces que quieras.'
        : 'Elige todas tus respuestas y toca <b>revisar</b>. Para aprobar tienes que acertar <b>todas</b> las de elegir (las de escribir son solo para ti).'}</p>
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

    // Las de escribir son opcionales: no hace falta responderlas para revisar.
    const respondida = (p) => (p.tipo === 'escribe' ? true : p.indice in elegido);
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
          <p class="tenue solo-para-ti">✍️ <b>Para ti:</b> practica decirlo con tus palabras. Nadie la corrige, así que <b>no cuenta</b> para aprobar ni para el certificado.</p>
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
            <p class="tenue autoevaluacion">Compáralo tú: ¿dijiste lo mismo, aunque sea con otras palabras? Si te faltó algo, vuelve a leer esa parte. Esto es solo para ti.</p>`);
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
        if (p.tipo === 'escribe') return; // es solo para ti: no lleva veredicto
        if (!resultados) return; // no se mandó al servidor: sin veredicto
        const ok = resultados[p.indice];
        li.classList.remove('bien', 'mal');
        li.classList.add(ok ? 'bien' : 'mal');
        li.querySelector('.veredicto')?.remove();
        const porque = ok && explicaciones?.[p.indice] ? enLinea(explicaciones[p.indice]) : '';
        const texto = ok ? `✓ Correcto. ${porque}` : '✗ No.';
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
      pie.innerHTML = `<p class="practica-final mal">✗ ${malas === 1 ? 'Una respuesta no es correcta' : `${malas} respuestas no son correctas`}. Todavía no está aprobada.
        No te decimos cuáles a propósito: vuelve a leer esa parte de la clase y repite.</p>
        <button class="boton" type="button">↻ intentar de nuevo (en otro orden)</button>`;
      pie.querySelector('button').addEventListener('click', () => { dibujar(intento + 1); caja.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    };

    revisar.addEventListener('click', async () => {
      // Solo preguntas para escribir: no hay nada que mandar al servidor.
      if (!seCorrige) { marcar(null, null); aprobar({ guardada: false, parteAprobada: false }); return; }
      // Para revisar hace falta cuenta (el curso se puede leer entero sin ella). Así nadie sin cuenta
      // puede usar el servidor que corrige. Ver la clase 124.
      const u = await nube.usuario().catch(() => null);
      if (!nube.cuentaLista(u)) {
        const destino = u ? '#/entrar/verificar' : '#/entrar';
        estado.innerHTML = u
          ? `Para revisar tus respuestas, primero <b>verifica tu correo</b>. <a class="boton" href="${destino}">verificar mi correo</a>`
          : `Para revisar tus respuestas necesitas una <b>cuenta</b> (gratis, con tu Gmail). Puedes leer todo el curso sin cuenta. <a class="boton" href="${destino}">entrar o crear cuenta</a>`;
        estado.querySelector('a').addEventListener('click', () => {
          try { sessionStorage.setItem('mapa-volver', location.hash); } catch (e) { /* nada */ }
        });
        return;
      }
      revisar.disabled = true;
      estado.textContent = '// corrigiendo en el servidor…';
      try {
        const r = await nube.corregirPractica(id, elegido);
        // Si no aprobó, el servidor solo dice CUÁNTAS fallaron (no cuáles): así no se puede adivinar probando.
        marcar(r.aprobada ? r.resultados : null, r.explicaciones);
        if (r.aprobada) aprobar({ guardada: r.guardada, parteAprobada: r.parteAprobada });
        else reprobar(r.malas ?? (r.resultados || []).filter((x) => x === false).length);
      } catch (e) {
        estado.textContent = `✗ ${mensajeDeError(e)}`;
        revisar.disabled = false;
      }
    });
  }

  dibujar(1);
  return caja;
}
