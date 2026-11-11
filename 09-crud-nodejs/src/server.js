const { crearApp } = require('./app');

const PUERTO = 3000;
crearApp().listen(PUERTO, () => {
  console.log(`Servidor listo en http://localhost:${PUERTO}`);
});
