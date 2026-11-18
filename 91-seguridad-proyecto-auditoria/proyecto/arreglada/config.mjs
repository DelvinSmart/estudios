// LA CONFIGURACIÓN. VERSIÓN ARREGLADA.

// ARREGLO V10: el secreto viene del entorno (un .env que no se sube, o el gestor de secretos de la nube).
// Y como la clave vieja ya estuvo en el repositorio, en un caso real hay que ROTARLA: pedir una nueva
// en el servicio y anular la vieja. Borrarla del código no alcanza: sigue en el historial de Git.
export const CLAVE_SMS = process.env.CLAVE_SMS ?? null;

// Los únicos sitios que pueden leer las respuestas desde el navegador (V9).
export const ORIGENES = ['http://127.0.0.1:3000'];
