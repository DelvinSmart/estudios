# ¿Qué dice la Biblia? por dentro: cómo explicarlo en una entrevista

## En 30 segundos

> Tengo una página de estudios bíblicos hecha en HTML, CSS y JavaScript, sin frameworks. Los estudios son archivos JSON y una plantilla los dibuja; se editan desde un panel que guarda en GitHub y se publica sola con GitHub Actions. Lo más interesante fue mostrar versículos de dos fuentes con licencias distintas sin copiar el texto: la Reina-Valera la entrega el servicio de Logos, y la LBLA es la página oficial de Lockman dentro de la mía, recortada al versículo. Como el navegador no deja medir una página ajena, el tamaño de cada versículo se calcula con medidas que calibré con datos reales.

## Si preguntan por un problema difícil

**Mostrar solo un versículo de una página que no puedo leer.**
- La página de Lockman se puede mostrar en un iframe, pero el navegador no deja leer ni medir lo que hay adentro (CORS).
- Medí su página: el recuadro del versículo mide 62 px más 33 por línea, y su encabezado 327.
- Para saber cuántas líneas ocupa, uso el largo del mismo versículo en otra traducción, que sí tengo.
- Primero calculé el ancho de letra con un ejemplo (9,15 px) y fallaba en el teléfono. Medí 32 casos reales y salió 8,1. Con eso, solo 1 de 32 queda corto, y hay un botón para agregar una línea.
- Elegí que sobre un poco antes que cortar texto: fue una decisión, no un error.

**Hacer rápido algo que era lento.**
- Cada versículo de la Reina-Valera tardaba medio segundo. Medí antes de cambiar nada: la red respondía al instante; el tiempo se iba en las esperas del globo de Logos.
- Ahora pido cada versículo directo, todos a la vez, y los adelanto al abrir el subpunto: de 4 segundos a 0,02.

## Si preguntan por calidad

- **Motor de diseño:** todos los valores (colores, tamaños, tiempos, sombras) en un solo archivo, `motor.css`.
- **Candado:** un script que se ejecuta antes de publicar y frena la publicación si alguien escribe un valor a mano.
- **Refactor sin riesgo:** al pasar unos 770 valores al motor, comparé los estilos de cada elemento de la página nueva con la publicada: 3.900 elementos, 0 diferencias.

## Si preguntan por ética o licencias

- La LBLA tiene derechos: Lockman deja citar hasta 500 versículos con un aviso. La página pone el aviso sola y un medidor no deja publicar si se pasa del 25% del texto.
- No hice *scraping*: Lockman lo prohíbe. Lo que no tenía permiso de traer automáticamente lo pega el autor, o se muestra en la página oficial del dueño.
- El griego viene del SBLGNT, que tiene licencia libre (CC BY 4.0), y no del Nestlé-Aland, que tiene derechos.

## Si preguntan qué salió mal

- Safari deja mover el contenido de un iframe aunque CSS diga que no se puede tocar. Lo resolví con una capa transparente encima.
- El diseño de Lockman cambia desde 645 px de ancho y aparecía una sección que no quería. Lo resolví armando su página siempre en su diseño angosto.
- Aprendí a decir antes dónde funciona cada herramienta: unas eran del panel y el estudio todavía no estaba ahí.
