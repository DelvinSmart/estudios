# La web de Copiloto Driver: cómo explicarla en una entrevista

## En 30 segundos

> Hice la versión web de mi app, Copiloto Driver, para usarla en la computadora. La persona entra con la misma cuenta del teléfono y ve sus ganancias, gastos, combustible y finanzas en una sola pantalla. Está hecha con React, TypeScript, Vite y Tailwind, y usa Firebase igual que el app. Lo más importante es que no copia el app: usa el mismo código para los cálculos, los textos en seis idiomas y el guardado en la nube. Así el teléfono y la web siempre dan el mismo número.

## Si preguntan por la arquitectura

- **Reutilizar, no copiar:** un alias (`@app`) apunta al código del app. Cuando un cálculo estaba dentro de una pantalla del app, lo saqué a una función pura compartida, por ejemplo la regla de la ganancia neta en rojo y verde.
- **Puertos y adaptadores:** el código del app habla con Firebase por un archivo que usa piezas del teléfono. Al armar la web, Vite lo cambia por un adaptador del navegador con las mismas funciones. Si alguien importa una pieza del teléfono, la compilación se detiene.
- **Capas:** las pantallas piden los datos, los arman con modelos puros (fáciles de probar) y los dibujan con piezas pequeñas.
- **Motores de diseño:** colores, medidas, tamaños de pantalla, movimiento e idiomas salen de motores. Ninguna pantalla escribe un valor a mano, y un script lo revisa antes de cada compilación.

## Si preguntan por los datos y la seguridad

- **En vivo:** la web se suscribe a Firestore; si registro algo en el teléfono, la web lo muestra al instante.
- **Guardar:** usa las mismas funciones de la nube del app, así los datos quedan en el mismo formato.
- **Seguridad:** la configuración de Firebase es pública; lo que protege los datos son las reglas de Firestore (cada persona solo ve lo suyo). La clave de la IA del Copiloto está en una función de la nube, nunca en la página.

## Si preguntan por la calidad

- **TypeScript** en todo, **pruebas** con Vitest para los modelos, y las pruebas del app también, porque la web usa su código.
- **Candado de diseño** y revisión de tipos antes de cada compilación.
- Todas las páginas caben en una pantalla de laptop; lo que es largo se baja dentro de su recuadro.

## Si preguntan qué fue lo más difícil

- **Dos copias de React:** una librería de íconos trajo su propia versión y la página fallaba. La solución fue obligar a usar una sola, la del app.
- **Que el teléfono y la web digan lo mismo:** cada vez que la web necesitaba una regla, había que sacarla del app a un archivo compartido sin romper el app.
- **El diseño en pantallas distintas:** que todo entre en una laptop de 1470 × 754 sin estirar los gráficos. Se resolvió con un motor de tamaños de pantalla y recuadros que se bajan por dentro.
