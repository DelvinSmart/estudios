// LOS DATOS: una base SQLite de verdad, en memoria (se crea vacía cada vez que arranca). VERSIÓN ARREGLADA.
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Usuarios y claves DE PRÁCTICA (no son de nadie): sirven para entrar en las pruebas y en la página.
export const USUARIOS_DE_PRUEBA = [
  { usuario: 'ana', clave: 'clave-de-ana-para-practicar' },
  { usuario: 'beto', clave: 'clave-de-beto-para-practicar' },
];

// ARREGLO V5: la clave nunca se guarda. Se guarda una sal al azar y la huella de scrypt (clase 22, Parte 2).
export function huellaDe(clave, sal = randomBytes(16)) {
  return { sal: sal.toString('hex'), huella: scryptSync(clave, sal, 64).toString('hex') };
}

/** Compara la clave escrita con la huella guardada, sin dar pistas por el tiempo que tarda. */
export function claveCorrecta(clave, { sal, huella }) {
  const calculada = scryptSync(String(clave), Buffer.from(sal, 'hex'), 64);
  return timingSafeEqual(calculada, Buffer.from(huella, 'hex'));
}

export function crearBase() {
  const base = new DatabaseSync(':memory:');
  base.exec(`
    CREATE TABLE usuarios (usuario TEXT PRIMARY KEY, sal TEXT NOT NULL, huella TEXT NOT NULL);
    CREATE TABLE gastos (id INTEGER PRIMARY KEY AUTOINCREMENT, dueno TEXT NOT NULL, tipo TEXT NOT NULL, valor REAL NOT NULL, nota TEXT NOT NULL DEFAULT '');
  `);
  const nuevoUsuario = base.prepare('INSERT INTO usuarios (usuario, sal, huella) VALUES (?, ?, ?)');
  for (const u of USUARIOS_DE_PRUEBA) {
    const { sal, huella } = huellaDe(u.clave);
    nuevoUsuario.run(u.usuario, sal, huella);
  }

  const nuevoGasto = base.prepare('INSERT INTO gastos (dueno, tipo, valor, nota) VALUES (?, ?, ?, ?)');
  nuevoGasto.run('ana', 'lavado', 30, 'lavado completo');
  nuevoGasto.run('beto', 'combustible', 150, 'nota privada de beto');
  return base;
}
