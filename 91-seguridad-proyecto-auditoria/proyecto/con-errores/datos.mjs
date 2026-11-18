// LOS DATOS: una base SQLite de verdad, en memoria (se crea vacía cada vez que arranca).
// ⚠️ VERSIÓN CON ERRORES A PROPÓSITO, para practicar la auditoría. No copies esto en un proyecto real.
import { DatabaseSync } from 'node:sqlite';

// Usuarios y claves DE PRÁCTICA (no son de nadie): sirven para entrar en las pruebas y en la página.
export const USUARIOS_DE_PRUEBA = [
  { usuario: 'ana', clave: 'clave-de-ana-para-practicar' },
  { usuario: 'beto', clave: 'clave-de-beto-para-practicar' },
];

export function crearBase() {
  const base = new DatabaseSync(':memory:');
  base.exec(`
    CREATE TABLE usuarios (usuario TEXT PRIMARY KEY, clave TEXT NOT NULL);
    CREATE TABLE gastos (id INTEGER PRIMARY KEY AUTOINCREMENT, dueno TEXT NOT NULL, tipo TEXT NOT NULL, valor REAL NOT NULL, nota TEXT NOT NULL DEFAULT '');
  `);
  // V5: las claves se guardan tal cual, en texto plano.
  const nuevoUsuario = base.prepare('INSERT INTO usuarios (usuario, clave) VALUES (?, ?)');
  for (const u of USUARIOS_DE_PRUEBA) nuevoUsuario.run(u.usuario, u.clave);

  const nuevoGasto = base.prepare('INSERT INTO gastos (dueno, tipo, valor, nota) VALUES (?, ?, ?, ?)');
  nuevoGasto.run('ana', 'lavado', 30, 'lavado completo');
  nuevoGasto.run('beto', 'combustible', 150, 'nota privada de beto');
  return base;
}
