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
  '19': { carpeta: '19-agentes-de-ia', titulo: 'Agentes de IA', meta: 'Los patrones para diseñar, medir y publicar agentes', docs: LECCION },
};

// Las clases que ya tienen su clase guiada (CLASE-GUIADA.md): va primero,
// y la lección queda como "Resumen" para repasar.
const GUIADAS = ['01', '02', '03', '04', '05', '06', '07', '15', '16', '17', '08', '09', '10'];
for (const n of GUIADAS) {
  CLASES[n].docs = [
    { archivo: 'CLASE-GUIADA.md', titulo: 'Clase guiada' },
    ...CLASES[n].docs.map((d) => (d.archivo === 'LECCION.md' ? { ...d, titulo: 'Resumen' } : d)),
  ];
}

export const ETAPAS = [
  {
    id: 'fundamentos', icono: '🧱', titulo: 'Fundamentos',
    desc: 'Leer código, probarlo, guardarlo y entender sus errores. La base de todo.',
    clases: ['01', '02', '03', '04', '05', '06', '07'],
  },
  {
    id: 'web', icono: '🌐', titulo: 'La web: HTML, CSS y JavaScript',
    desc: 'Las tres piezas con las que se hace cualquier página.',
    clases: ['15', '16', '17'],
  },
  {
    id: 'backend', icono: '🔥', titulo: 'Backend y datos',
    desc: 'Dónde se guardan los datos y cómo se hace un servidor.',
    clases: ['08', '09'],
  },
  {
    id: 'arquitectura', icono: '🏛️', titulo: 'Arquitectura',
    desc: 'Cómo se organiza un programa grande para que no se vuelva un caos.',
    clases: ['10', '11'],
  },
  {
    id: 'proyectos', icono: '🚀', titulo: 'Mis proyectos por dentro',
    desc: 'Todo lo anterior, aplicado a lo que yo construí.',
    clases: ['12', '13', '14', '18'],
  },
  {
    id: 'ia', icono: '🤖', titulo: 'IA y agentes',
    desc: 'Lo último: cómo se trabaja con inteligencia artificial y agentes.',
    clases: ['19'],
  },
];
