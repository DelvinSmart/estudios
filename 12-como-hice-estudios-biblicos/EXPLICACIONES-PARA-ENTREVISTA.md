# Estudios Bíblicos: cómo explicarlo en una entrevista

## En 30 segundos

> Hice un sitio para publicar estudios bíblicos. Cada estudio se ve como un mapa de puntos y subpuntos, se puede descargar en PDF y está en español y portugués. Lo hice con HTML, CSS y JavaScript, sin frameworks. El contenido está en archivos JSON separados del código, y tiene un panel propio para editar que guarda directo en GitHub con un token limitado a ese repositorio. Cada cambio se publica solo con GitHub Actions, que también genera los PDF.

## Si preguntan por la arquitectura

- **Contenido separado del código:** los estudios son JSON; el código es una plantilla que dibuja cualquier estudio.
- **Un archivo, una tarea:** `mapa.js` dibuja el estudio, `estudios.js` carga y convierte los bloques, `github.js` habla con GitHub, y el panel está dividido en 8 archivos por tarea.
- **Una sola función para dibujar los bloques** (`puntoHTML`), usada por la página, el PDF y la vista previa del panel. Así se ven idénticos.
- **Colores como tokens CSS** (`--b1` a `--b11`, y `--c` para el color del punto), con versión para modo claro y oscuro.

## Si preguntan por la seguridad

- El panel es público, pero **sin token no guarda nada**: GitHub rechaza la petición.
- El token es *fine-grained*: solo permite **leer y escribir contenido** de ese repositorio.
- El token se guarda solo en el aparato del autor (`localStorage`), nunca en el código.

## Si preguntan por la publicación

- **GitHub Pages**, gratis y sin servidor.
- **GitHub Actions** en cada cambio: arma el sitio (`construir.mjs`), crea la lista de estudios, genera los PDF con Chrome sin pantalla (`pdfs.sh`) y lo publica.

## Si preguntan qué fue lo más difícil

- **Leer versículos de fotos:** el texto se lee bien, pero los numeritos de versículo salen mal. La solución fue mostrar la lista para revisarla y armar la referencia sola con rangos (`1-3, 5, 30`).
- **Respetar el formato bíblico:** las cursivas, "SEÑOR" en versalitas, las palabras griegas. El panel tuvo que aprender a no borrar esos estilos al limpiar lo que se pega.
- **Saber cuándo quitar algo:** el lector de voz no funcionó bien en iPhone y se quitó por completo, sin dejar código muerto.
