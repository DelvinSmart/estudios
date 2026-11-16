// El diseño de los correos: la misma cara del sitio (fondo oscuro, letra de código, botón verde).
// Se usan tablas y estilos dentro de cada etiqueta porque así lo entienden Gmail, Outlook y el iPhone.

const COLOR = { fondo: '#0b0f14', tarjeta: '#131a23', borde: '#34414f', texto: '#d8e0ea', tenue: '#8796aa', acento: '#7ee787', botonTexto: '#06210f' };
const MONO = "'JetBrains Mono',Menlo,Consolas,'Courier New',monospace";
const SANS = "'IBM Plex Sans',-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

export function escapar(t) {
  return String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function marco({ comando, titulo, parrafos, boton, enlace, pie }) {
  const p = parrafos.map((x) => `<p style="margin:0 0 14px;font:15px/1.6 ${SANS};color:${COLOR.tenue}">${x}</p>`).join('');
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${escapar(titulo)}</title></head>
<body style="margin:0;padding:0;background:${COLOR.fondo}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.fondo};padding:32px 12px">
  <tr><td align="center">
    <p style="margin:0 0 16px;font:700 14px ${MONO};color:${COLOR.acento}">estudios<span style="color:${COLOR.tenue}">:</span><span style="color:#79c0ff">~</span><span style="color:${COLOR.tenue}">$</span></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:${COLOR.tarjeta};border:1px solid ${COLOR.borde};border-radius:14px">
      <tr><td style="padding:10px 16px;border-bottom:1px solid ${COLOR.borde};font:12px ${MONO};color:${COLOR.tenue}">
        <span style="color:#ff5f57">●</span> <span style="color:#febc2e">●</span> <span style="color:#28c840">●</span>
        &nbsp; <span style="color:${COLOR.acento}">~$</span> ${escapar(comando)}</td></tr>
      <tr><td style="padding:26px 24px 22px">
        <h1 style="margin:0 0 14px;font:800 24px/1.25 ${MONO};color:${COLOR.texto}">${escapar(titulo)}</h1>
        ${p}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 18px"><tr><td align="center">
          <a href="${escapar(enlace)}" style="display:inline-block;background:${COLOR.acento};color:${COLOR.botonTexto};font:700 15px ${MONO};text-decoration:none;padding:13px 26px;border-radius:10px">${escapar(boton)}</a>
        </td></tr></table>
        <p style="margin:0 0 6px;font:12px/1.5 ${SANS};color:${COLOR.tenue}">¿El botón no funciona? Copia y pega este enlace en tu navegador:</p>
        <p style="margin:0 0 18px;font:11px/1.5 ${MONO};color:#79c0ff;word-break:break-all">${escapar(enlace)}</p>
        <p style="margin:0;padding-top:14px;border-top:1px dashed ${COLOR.borde};font:12px/1.5 ${SANS};color:${COLOR.tenue}">${pie}</p>
      </td></tr>
    </table>
    <p style="margin:18px 0 0;font:12px ${MONO};color:${COLOR.tenue}">// Mapa de estudios · delvinsmart.github.io/estudios</p>
  </td></tr>
</table>
</body></html>`;
}

export function correoVerificar({ nombre, enlace }) {
  const hola = nombre ? `Hola, <b style="color:${COLOR.texto}">${escapar(nombre.split(' ')[0])}</b>.` : 'Hola.';
  return {
    asunto: 'Verifica tu correo · Mapa de estudios',
    html: marco({
      comando: './verificar-correo',
      titulo: 'Verifica tu correo',
      parrafos: [
        hola,
        'Creaste una cuenta en el <b style="color:#d8e0ea">Mapa de estudios</b>. Toca el botón para confirmar que este correo es tuyo: desde ahí, cada bombillo que prendas cuenta en la nube para tu certificado verificable.',
      ],
      boton: 'verificar mi correo',
      enlace,
      pie: 'Si no creaste esta cuenta, ignora este correo: sin verificar, la cuenta no puede hacer nada.',
    }),
    texto: `${nombre ? `Hola, ${nombre.split(' ')[0]}.` : 'Hola.'}\n\nConfirma tu correo del Mapa de estudios abriendo este enlace:\n${enlace}\n\nSi no creaste esta cuenta, ignora este correo.`,
  };
}

export function correoContrasena({ enlace }) {
  return {
    asunto: 'Crea tu contraseña nueva · Mapa de estudios',
    html: marco({
      comando: './recuperar-contrasena',
      titulo: 'Crea tu contraseña nueva',
      parrafos: [
        'Alguien (ojalá tú) pidió cambiar la contraseña de tu cuenta del <b style="color:#d8e0ea">Mapa de estudios</b>.',
        'Toca el botón y elige la contraseña nueva. El enlace vale por <b style="color:#d8e0ea">1 hora</b> y sirve una sola vez.',
      ],
      boton: 'crear contraseña nueva',
      enlace,
      pie: 'Si no lo pediste, ignora este correo: tu contraseña no cambia y nadie puede entrar sin ella.',
    }),
    texto: `Pediste cambiar la contraseña de tu cuenta del Mapa de estudios.\nAbre este enlace para crear una nueva (vale por 1 hora):\n${enlace}\n\nSi no lo pediste, ignora este correo.`,
  };
}

// Firebase genera un enlace hacia su propia página (…firebaseapp.com/__/auth/action?mode=…&oobCode=…).
// Sacamos el código y armamos el enlace hacia las pantallas del sitio, que ya saben usarlo.
export function enlaceDelSitio(enlaceFirebase, sitio) {
  const u = new URL(enlaceFirebase);
  const modo = u.searchParams.get('mode');
  const codigo = u.searchParams.get('oobCode');
  if (!modo || !codigo) throw new Error('enlace de Firebase sin mode u oobCode');
  return `${sitio}?mode=${encodeURIComponent(modo)}&oobCode=${encodeURIComponent(codigo)}`;
}
