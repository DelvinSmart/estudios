// EL ARRANQUE: abre el puerto 3000 SOLO en esta computadora (127.0.0.1), no en la red.
// La versión arreglada. Igual es un proyecto de práctica.
import { crearApp } from './app.mjs';
import { crearBase } from './datos.mjs';

const app = crearApp({ base: crearBase() });
app.listen(3000, '127.0.0.1', () => console.log('Gastos para auditar (arreglada): http://127.0.0.1:3000 (usuarios de prueba: ana y beto)'));
