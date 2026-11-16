// Las prácticas interactivas. En el .md se escriben en un bloque ```practica,
// una pregunta por línea, con los campos separados por " :: ":
//
//   vf :: `'Uber'` es un `string` :: V :: Tiene comillas: es texto.
//   elige :: ¿De qué tipo es `45`? :: string :: *number :: boolean :: → Sin comillas es un número.
//   escribe :: ¿Qué es un `boolean`? :: Un dato que solo puede ser true o false.
//
// vf     = verdadero o falso (V o F), y la explicación.
// elige  = varias opciones; la correcta lleva * adelante; la explicación empieza con →.
// escribe = respondes con tus palabras y después comparas con la respuesta modelo.
//
// La regla: para aprobar hay que acertar TODAS en el mismo intento.
// Si fallas una, ves por qué, y tienes que volver a intentar el bloque entero (en otro orden).

import { practicaAprobada, aprobarPractica } from './guardado.js';

const enLinea = (md) => window.marked.parseInline(md);

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function leerPreguntas(texto) {
  return texto.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const campos = l.split(' :: ').map((c) => c.trim());
    const tipo = campos[0].toLowerCase();
    if (tipo === 'vf') {
      return { tipo, enunciado: campos[1], correcta: campos[2].toUpperCase().startsWith('V') ? 'V' : 'F', explicacion: campos[3] || '' };
    }
    if (tipo === 'elige') {
      const resto = campos.slice(2);
      const explicacion = resto.length && resto[resto.length - 1].startsWith('→') ? resto.pop().replace(/^→\s*/, '') : '';
      return {
        tipo, enunciado: campos[1], explicacion,
        opciones: resto.map((o) => ({ texto: o.replace(/^\*/, ''), correcta: o.startsWith('*') })),
      };
    }
    return { tipo: 'escribe', enunciado: campos[1], modelo: campos[2] || '' };
  });
}

export function crearPractica(texto, id) {
  const preguntas = leerPreguntas(texto);
  const caja = document.createElement('div');
  caja.className = 'practica';
  caja.dataset.id = id;

  function dibujar(intento) {
    const yaAprobada = practicaAprobada(id);
    const orden = intento > 1 ? mezclar(preguntas) : preguntas;
    const estado = orden.map(() => null);   // null = sin responder, true = bien, false = mal

    caja.classList.toggle('aprobada', yaAprobada);
    caja.innerHTML = `
      <div class="practica-cabeza mono">
        <span>✍️ práctica${intento > 1 ? ` · intento ${intento}` : ''}</span>
        <span class="practica-cuenta"></span>
      </div>
      <p class="practica-regla tenue">${yaAprobada
        ? '✓ Ya la aprobaste. Puedes repasarla las veces que quieras.'
        : 'Para aprobar tienes que acertar <b>todas</b>. Si fallas una, vuelves a leer y lo intentas otra vez.'}</p>
      <ol class="practica-lista"></ol>
      <div class="practica-pie"></div>`;
    const lista = caja.querySelector('.practica-lista');
    const pie = caja.querySelector('.practica-pie');
    const cuenta = caja.querySelector('.practica-cuenta');

    function revisar() {
      const bien = estado.filter((e) => e === true).length;
      const mal = estado.filter((e) => e === false).length;
      cuenta.textContent = `${bien}/${orden.length}`;
      if (estado.every((e) => e !== null)) {
        if (mal === 0) {
          aprobarPractica(id);
          caja.classList.add('aprobada');
          pie.innerHTML = '<p class="practica-final bien">✓ ¡Aprobada! Acertaste todas. Ya puedes marcar la parte como entendida.</p>';
          caja.dispatchEvent(new CustomEvent('practica-aprobada', { bubbles: true }));
        } else if (!practicaAprobada(id)) {
          pie.innerHTML = `<p class="practica-final mal">✗ Fallaste ${mal}. Todavía no está aprobada.
            Lee la explicación de las que fallaste, vuelve a leer esa parte de la clase y repite.</p>
            <button class="boton" type="button">↻ intentar de nuevo (en otro orden)</button>`;
          pie.querySelector('button').addEventListener('click', () => { dibujar(intento + 1); caja.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        }
      }
    }

    orden.forEach((p, k) => {
      const li = document.createElement('li');
      li.className = `pregunta ${p.tipo}`;
      const marcar = (ok, explicacion) => {
        estado[k] = ok;
        li.classList.add(ok ? 'bien' : 'mal');
        li.querySelectorAll('button, textarea').forEach((b) => { b.disabled = true; });
        li.insertAdjacentHTML('beforeend', `<p class="veredicto">${ok ? '✓ Correcto.' : '✗ No.'} ${explicacion ? enLinea(explicacion) : ''}</p>`);
        revisar();
      };

      if (p.tipo === 'vf') {
        li.innerHTML = `<p class="enunciado">${enLinea(p.enunciado)}</p>
          <div class="opciones"><button type="button" data-v="V">Verdadero</button><button type="button" data-v="F">Falso</button></div>`;
        li.querySelectorAll('[data-v]').forEach((b) => b.addEventListener('click', () => {
          b.classList.add('elegida');
          marcar(b.dataset.v === p.correcta, p.explicacion);
        }));
      } else if (p.tipo === 'elige') {
        const opciones = intento > 1 ? mezclar(p.opciones) : p.opciones;
        li.innerHTML = `<p class="enunciado">${enLinea(p.enunciado)}</p>
          <div class="opciones">${opciones.map((o, n) => `<button type="button" data-n="${n}">${enLinea(o.texto)}</button>`).join('')}</div>`;
        li.querySelectorAll('[data-n]').forEach((b) => b.addEventListener('click', () => {
          b.classList.add('elegida');
          const elegida = opciones[+b.dataset.n];
          const correcta = opciones.find((o) => o.correcta);
          marcar(elegida.correcta, (elegida.correcta ? '' : `La correcta es: ${correcta.texto}. `) + p.explicacion);
        }));
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
            b.classList.add('elegida');
            li.querySelectorAll('.autoevaluacion').forEach((x) => x.remove());
            marcar(b.dataset.a === 'si', b.dataset.a === 'si' ? '' : 'Vuelve a leer esa parte y escríbelo otra vez.');
          }));
        });
      }
      lista.appendChild(li);
    });
    revisar();
  }

  dibujar(1);
  return caja;
}
