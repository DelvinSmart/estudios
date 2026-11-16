// El catálogo del mapa: las etapas, y qué clases hay en cada una.
// Para agregar una clase nueva: crea su carpeta con LECCION.md
// y agrégala aquí (en CLASES y en la etapa que le toca).

const LECCION = [{ archivo: 'LECCION.md', titulo: 'Lección' }];
const CON_ENTREVISTA = [
  { archivo: 'LECCION.md', titulo: 'Lección' },
  { archivo: 'EXPLICACIONES-PARA-ENTREVISTA.md', titulo: 'Para la entrevista' },
];

export const CLASES = {
  '01': { carpeta: '01-leer-codigo', titulo: 'Leer código', meta: 'Leer una función de la app y decir qué hace', docs: LECCION },
  '02': { carpeta: '02-pruebas-automaticas', titulo: 'Pruebas automáticas', meta: 'Entender las más de 400 pruebas de la app y correrlas', docs: LECCION },
  '03': { carpeta: '03-tu-primera-prueba', titulo: 'Mi primera prueba', meta: 'Escribir una prueba yo solo', docs: LECCION },
  '04': { carpeta: '04-ci', titulo: 'CI', meta: 'Explicar qué revisa la máquina en cada subida', docs: LECCION },
  '05': { carpeta: '05-tu-primer-cambio', titulo: 'Mi primer cambio', meta: 'Cambiar algo en la app yo mismo', docs: LECCION },
  '06': { carpeta: '06-git', titulo: 'Git', meta: 'Guardar y subir mis cambios sin el script', docs: LECCION },
  '07': { carpeta: '07-leer-errores', titulo: 'Leer errores', meta: 'Encontrar la causa de un error leyendo el mensaje', docs: LECCION },
  '08': { carpeta: '08-firebase', titulo: 'Firebase por dentro', meta: 'Dónde viven los datos y quién puede leerlos', docs: LECCION },
  '09': { carpeta: '09-crud-nodejs', titulo: 'CRUD en Node.js', meta: 'Un servidor pequeño con sus pruebas', docs: LECCION },
  '10': { carpeta: '10-arquitectura', titulo: 'Arquitectura', meta: 'Clean, hexagonal, MVC y MVVM, y cómo está armada mi app', docs: LECCION },
  '11': {
    carpeta: '11-como-arregle-copiloto', titulo: 'Cómo arreglé Copiloto', meta: 'Velocidad, ciclos y motores de diseño',
    docs: [
      { archivo: 'GUIA-DE-ESTUDIO.md', titulo: 'Guía de estudio' },
      { archivo: 'INFORME.md', titulo: 'Informe' },
      { archivo: 'EXPLICACIONES-PARA-ENTREVISTA.md', titulo: 'Para la entrevista' },
    ],
  },
  '12': { carpeta: '12-como-hice-estudios-biblicos', titulo: 'Cómo hice Estudios Bíblicos', meta: 'Un sitio en HTML, CSS y JavaScript, de punta a punta', docs: CON_ENTREVISTA },
  '13': { carpeta: '13-como-hice-la-web', titulo: 'Cómo hice la web de Copiloto', meta: 'React, TypeScript, Vite, Tailwind y Firebase', docs: CON_ENTREVISTA },
  '14': { carpeta: '14-que-dice-la-biblia-por-dentro', titulo: '¿Qué dice la Biblia? por dentro', meta: 'Versículos sin copiarlos, el medidor, el griego y el motor de diseño', docs: CON_ENTREVISTA },
  '15': { carpeta: '15-html', titulo: 'HTML', meta: 'Armar la estructura de una página', docs: LECCION },
  '16': { carpeta: '16-css', titulo: 'CSS', meta: 'Darle colores, letras, espacios y forma', docs: LECCION },
  '17': { carpeta: '17-javascript', titulo: 'JavaScript en la página', meta: 'Hacer que la página responda y cambie', docs: LECCION },
  '18': { carpeta: '18-como-hice-mi-mapa', titulo: 'Cómo hice mi mapa de estudios', meta: 'Esta misma página, explicada por dentro', docs: LECCION },
  '20': { carpeta: '20-publicar-e-instalar', titulo: 'Publicar e instalar', meta: 'Subir a GitHub, a Pages, a Firebase, a tus teléfonos y a Google Play', docs: LECCION },
  '21': { carpeta: '21-certificado-verificable', titulo: 'El certificado verificable', meta: 'Login con correo, Firebase y reglas que no se dejan engañar', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '22': { carpeta: '22-seguridad-basica', titulo: 'Seguridad básica', meta: 'Pensar como atacante: contraseñas, secretos, phishing y el navegador', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '23': { carpeta: '23-seguridad-intermedia', titulo: 'Seguridad intermedia', meta: 'Las vulnerabilidades web más comunes y cómo se cierran', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '24': { carpeta: '24-seguridad-avanzada', titulo: 'Seguridad avanzada', meta: 'Auditar un sistema entero, como hicimos con Copiloto', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '36': { carpeta: '36-python-primeros-pasos', titulo: 'Primeros pasos', meta: 'Correr Python, variables, tipos, print e input', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '37': { carpeta: '37-python-decisiones-y-repeticiones', titulo: 'Decisiones y repeticiones', meta: 'La sangría, if, elif, else, for, range y while', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '38': { carpeta: '38-python-colecciones', titulo: 'Listas, tuplas, diccionarios y conjuntos', meta: 'Agrupar datos y las comprensiones', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '39': { carpeta: '39-python-funciones', titulo: 'Funciones', meta: 'def, parámetros, return, alcance, lambda y tipos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '40': { carpeta: '40-python-errores-y-archivos', titulo: 'Errores y archivos', meta: 'Leer errores, try y except, raise, texto, CSV y JSON', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '41': { carpeta: '41-python-modulos-y-entornos', titulo: 'Módulos, paquetes y entornos', meta: 'import, la biblioteca estándar, pip y venv', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '42': { carpeta: '42-python-clases-y-objetos', titulo: 'Clases y objetos', meta: 'class, __init__, self, herencia y dataclasses', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '43': { carpeta: '43-python-pruebas-y-proyecto', titulo: 'Pruebas y un proyecto real', meta: 'pytest, el resumen de la semana de un conductor y las APIs', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '19': { carpeta: '19-agentes-de-ia', titulo: 'Qué es un agente', meta: 'Python para leer los ejemplos, las piezas y el ciclo de un agente', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '25': { carpeta: '25-agentes-cinco-patrones', titulo: 'Los cinco patrones', meta: 'Herramientas (ReAct), planificación, reflexión, enrutamiento y multiagente', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '26': { carpeta: '26-agentes-veinte-patrones', titulo: 'Veinte patrones más', meta: 'Flujo, razonamiento, coordinación, control, conocimiento y cómo elegir', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '27': { carpeta: '27-agentes-disenar', titulo: 'Diseñar un agente', meta: 'Contexto, herramientas, estado, salidas, modelo y protocolos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '28': { carpeta: '28-agentes-evaluar-publicar', titulo: 'Evaluar y publicar', meta: 'Medir un agente con pruebas y llevarlo a producción', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '29': { carpeta: '29-agentes-todo-junto', titulo: 'Todo junto', meta: 'La arquitectura completa, la lista para producción y la entrevista', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '30': { carpeta: '30-ia-como-funciona', titulo: 'Cómo funciona un modelo', meta: 'Qué hace bien, qué inventa, tokens, contexto, planes y privacidad', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '31': { carpeta: '31-ia-pedir-bien', titulo: 'Pedir bien', meta: 'Las piezas de un buen pedido, errores, pasos y mejorar el pedido con Gemini', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '32': { carpeta: '32-ia-claude-code', titulo: 'Claude y Claude Code', meta: 'Tu herramienta principal: CLAUDE.md, AGENTS.md, revisar, sesiones y MCP', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '33': { carpeta: '33-ia-otras-herramientas', titulo: 'Otras herramientas', meta: 'OpenCode, Codex, Gemini y modelos locales con Llama', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '34': { carpeta: '34-ia-sin-romper-nada', titulo: 'Trabajar sin romper nada', meta: 'Errores típicos de la IA, revisar, secretos, ataques y costos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '35': { carpeta: '35-ia-tu-flujo', titulo: 'Tu flujo de trabajo', meta: 'De la idea a lo publicado, y seguir aprendiendo de verdad', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
};

// El dibujo de cada clase en el mapa de islas.
const ICONOS = {
  '01': '📖', '02': '🧪', '03': '✅', '04': '⚙️', '05': '✏️', '06': '🌿', '07': '🐞', '08': '🔥', '09': '🖥️', '10': '🏗️',
  '11': '🚗', '12': '📜', '13': '💻', '14': '🕊️', '15': '📄', '16': '🎨', '17': '⚡', '18': '🗺️', '19': '🤖', '20': '📦', '25': '🧩', '26': '🧭', '27': '📐', '28': '📊', '29': '🏁',
  '30': '🧠', '31': '💬', '32': '🛠️', '33': '🧰', '34': '🦺', '35': '🔄',
  '21': '🎓', '22': '🔐', '23': '🕵️', '24': '🛡️',
};
for (const [n, icono] of Object.entries(ICONOS)) if (CLASES[n]) CLASES[n].icono = icono;

// Los logos de las tecnologías de cada clase (ver web/logos.js). El primero va en la isla.
const LOGOS_CLASE = {
  '01': ['typescript'], '02': ['jest'], '03': ['jest', 'typescript'], '04': ['acciones', 'github'], '05': ['typescript', 'git'],
  '06': ['git', 'github'], '08': ['firebase'], '09': ['node', 'javascript'], '11': ['react', 'typescript', 'firebase'],
  '12': ['html', 'css', 'javascript'], '13': ['react', 'typescript', 'vite', 'tailwind', 'firebase'], '14': ['html', 'css', 'javascript'],
  '15': ['html'], '16': ['css'], '17': ['javascript'], '18': ['html', 'css', 'javascript', 'markdown'],
  '19': ['python', 'javascript'], '20': ['github', 'firebase', 'android', 'apple'], '21': ['firebase', 'javascript'],
  '22': ['bitwarden', 'letsencrypt'], '23': ['owasp'], '24': ['owasp', 'firebase'], '25': ['python', 'javascript'], '27': ['python'],
  '30': ['claude', 'gemini', 'ollama'], '31': ['gemini', 'claude'], '32': ['claude'], '33': ['ollama', 'gemini', 'github'],
  '35': ['claude', 'git'],
  '36': ['python'], '37': ['python'], '38': ['python'], '39': ['python'], '40': ['python', 'markdown'],
  '41': ['python', 'bash'], '42': ['python'], '43': ['python', 'github'],
};
for (const [n, logos] of Object.entries(LOGOS_CLASE)) if (CLASES[n]) CLASES[n].logos = logos;

// Las clases que ya tienen su clase guiada (CLASE-GUIADA.md): va primero,
// y la lección queda como "Resumen" para repasar.
const GUIADAS = ['01', '02', '03', '04', '05', '06', '07', '15', '16', '17', '08', '09', '10', '11', '12', '13', '14', '18', '20'];
for (const n of GUIADAS) {
  CLASES[n].docs = [
    { archivo: 'CLASE-GUIADA.md', titulo: 'Clase guiada' },
    ...CLASES[n].docs.map((d) => (d.archivo === 'LECCION.md' ? { ...d, titulo: 'Resumen' } : d)),
  ];
}

export const ETAPAS = [
  {
    id: 'fundamentos', icono: '🧱', titulo: 'Fundamentos', logos: ['typescript', 'git', 'jest'],
    desc: 'Leer código, probarlo, guardarlo y entender sus errores. La base de todo.',
    clases: ['01', '02', '03', '04', '05', '06', '07'],
  },
  {
    id: 'web', icono: '🌐', titulo: 'La web: HTML, CSS y JavaScript', logos: ['html', 'css', 'javascript'],
    desc: 'Las tres piezas con las que se hace cualquier página.',
    clases: ['15', '16', '17'],
  },
  {
    id: 'backend', icono: '🔥', titulo: 'Backend y datos', logos: ['firebase', 'node'],
    desc: 'Dónde se guardan los datos y cómo se hace un servidor.',
    clases: ['08', '09'],
  },
  {
    id: 'arquitectura', icono: '🏛️', titulo: 'Arquitectura',
    desc: 'Cómo se organiza un programa grande para que no se vuelva un caos.',
    clases: ['10', '11'],
  },
  {
    id: 'proyectos', icono: '🚀', titulo: 'Mis proyectos por dentro', logos: ['react', 'firebase', 'github'],
    desc: 'Todo lo anterior, aplicado a lo que yo construí.',
    clases: ['12', '13', '14', '18', '20', '21'],
  },
  {
    id: 'python', curso: 'python', icono: '🐍', titulo: 'Python', logos: ['python'],
    desc: 'Un curso aparte, con su propio certificado: Python completo, de los primeros pasos a un proyecto con pruebas.',
    clases: ['36', '37', '38', '39', '40', '41', '42', '43'],
  },
  {
    id: 'seguridad', curso: 'seguridad', icono: '🛡️', titulo: 'Seguridad: pensar como hacker', logos: ['owasp'],
    desc: 'Un curso aparte, con su propio certificado: cómo atacan y cómo se defiende un sistema.',
    clases: ['22', '23', '24'],
  },
  {
    id: 'ia-programadores', curso: 'ia', icono: '🧠', titulo: 'IA para programadores', logos: ['claude', 'gemini', 'ollama'],
    desc: 'Un curso aparte, con su propio certificado: trabajar con Claude, Gemini, OpenCode, Codex y Llama sin romper nada.',
    clases: ['30', '31', '32', '33', '34', '35'],
  },
  {
    id: 'agentes', curso: 'agentes', icono: '🤖', titulo: 'Agentes de IA', logos: ['python', 'javascript'],
    desc: 'Un curso aparte, con su propio certificado: diseñar, medir y publicar tus propios agentes.',
    clases: ['19', '25', '26', '27', '28', '29'],
  },
];

// Los cursos: cada uno tiene su propio progreso en la nube y su propio certificado.
// El prefijo va al comienzo del código de verificación (ME-…, SE-…).
export const CURSOS = {
  programacion: {
    id: 'programacion', prefijo: 'ME', corto: 'Mapa de estudios',
    nombre: 'Mapa de estudios: programación, de los fundamentos a los agentes de IA',
  },
  python: {
    id: 'python', prefijo: 'PY', corto: 'Python',
    nombre: 'Python: de los primeros pasos a un proyecto real con pruebas',
  },
  seguridad: {
    id: 'seguridad', prefijo: 'SE', corto: 'Seguridad',
    nombre: 'Seguridad: pensar como hacker, de lo básico a auditar un sistema',
  },
  ia: {
    id: 'ia', prefijo: 'IA', corto: 'IA para programadores',
    nombre: 'IA para programadores: trabajar con Claude, Gemini, OpenCode, Codex y Llama',
  },
  agentes: {
    id: 'agentes', prefijo: 'AG', corto: 'Agentes de IA',
    nombre: 'Agentes de IA: patrones para diseñar, medir y publicar agentes',
  },
};

export function cursoDeEtapa(etapa) {
  return etapa.curso || 'programacion';
}

// Las clases de un curso, en orden.
export function clasesDelCurso(curso) {
  return ETAPAS.filter((e) => cursoDeEtapa(e) === curso).flatMap((e) => e.clases);
}
