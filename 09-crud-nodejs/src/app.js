const express = require('express');
const { validarGasto } = require('./validar');

// Crea la aplicación. Está separada de server.js para poder probarla sin abrir
// un puerto fijo. Los datos viven en memoria: al reiniciar, se borran.
function crearApp() {
  const app = express();
  app.use(express.json());

  let gastos = [];
  let siguienteId = 1;

  // CREATE: crear un gasto
  app.post('/gastos', (req, res) => {
    const errores = validarGasto(req.body);
    if (errores.length > 0) return res.status(400).json({ errores });
    const gasto = { id: siguienteId++, descripcion: req.body.descripcion.trim(), monto: req.body.monto };
    gastos.push(gasto);
    res.status(201).json(gasto);
  });

  // READ: listar todos
  app.get('/gastos', (req, res) => {
    res.json(gastos);
  });

  // READ: ver uno por su id
  app.get('/gastos/:id', (req, res) => {
    const gasto = gastos.find((item) => item.id === Number(req.params.id));
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado.' });
    res.json(gasto);
  });

  // UPDATE: cambiar un gasto
  app.put('/gastos/:id', (req, res) => {
    const gasto = gastos.find((item) => item.id === Number(req.params.id));
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado.' });
    const errores = validarGasto(req.body);
    if (errores.length > 0) return res.status(400).json({ errores });
    gasto.descripcion = req.body.descripcion.trim();
    gasto.monto = req.body.monto;
    res.json(gasto);
  });

  // DELETE: borrar un gasto
  app.delete('/gastos/:id', (req, res) => {
    const existia = gastos.some((item) => item.id === Number(req.params.id));
    if (!existia) return res.status(404).json({ error: 'Gasto no encontrado.' });
    gastos = gastos.filter((item) => item.id !== Number(req.params.id));
    res.status(204).send();
  });

  return app;
}

module.exports = { crearApp };
