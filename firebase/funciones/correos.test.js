import { test } from 'node:test';
import assert from 'node:assert/strict';
import { correoVerificar, correoContrasena, enlaceDelSitio, escapar } from './correos.js';

const SITIO = 'https://delvinsmart.github.io/estudios/';

test('el enlace del correo lleva a las pantallas del sitio con el mismo código', () => {
  const f = 'https://mapa-estudios-ds.firebaseapp.com/__/auth/action?mode=verifyEmail&oobCode=ABC123&apiKey=x&lang=es';
  assert.equal(enlaceDelSitio(f, SITIO), `${SITIO}?mode=verifyEmail&oobCode=ABC123`);
});
test('un enlace sin código da error', () => {
  assert.throws(() => enlaceDelSitio('https://x.com/?mode=verifyEmail', SITIO));
});
test('el nombre con HTML se escapa en el correo (no se puede inyectar código)', () => {
  const c = correoVerificar({ nombre: '<img src=x onerror=alert(1)>', enlace: `${SITIO}?mode=verifyEmail&oobCode=A` });
  assert.ok(!c.html.includes('<img src=x'));
  assert.ok(c.html.includes('&lt;img'));
});
test('los dos correos traen asunto en español, botón y versión de solo texto', () => {
  for (const c of [correoVerificar({ nombre: 'Ana Pérez', enlace: SITIO }), correoContrasena({ enlace: SITIO })]) {
    assert.match(c.asunto, /Mapa de estudios/);
    assert.ok(c.html.includes('href="https://delvinsmart.github.io/estudios/"'));
    assert.ok(c.texto.includes(SITIO));
  }
});
test('escapar cambia los símbolos peligrosos', () => {
  assert.equal(escapar(`<a href="x">'`), '&lt;a href=&quot;x&quot;&gt;&#39;');
});
