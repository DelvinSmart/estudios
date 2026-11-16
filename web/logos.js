// Los logos de cada tecnología (HTML, CSS, JavaScript, Firebase, Python…).
// Vienen de dos colecciones gratis y abiertas, servidas por jsDelivr:
//   - Devicon (licencia MIT): logos a color.
//   - Simple Icons (CC0): logos de un solo color; se pintan con CSS (máscara) para que se vean en tema claro y oscuro.
// Los logos son marcas de sus dueños; aquí solo indican de qué tecnología trata cada clase.

const DEVICON = 'https://cdn.jsdelivr.net/npm/devicon@2.16.0/icons/';
const SIMPLE = 'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/';

const LOGOS = {
  html: { nombre: 'HTML', dev: 'html5/html5-original' },
  css: { nombre: 'CSS', dev: 'css3/css3-original' },
  javascript: { nombre: 'JavaScript', dev: 'javascript/javascript-original' },
  typescript: { nombre: 'TypeScript', dev: 'typescript/typescript-original' },
  python: { nombre: 'Python', dev: 'python/python-original' },
  firebase: { nombre: 'Firebase', dev: 'firebase/firebase-original' },
  node: { nombre: 'Node.js', dev: 'nodejs/nodejs-original' },
  git: { nombre: 'Git', dev: 'git/git-original' },
  react: { nombre: 'React', dev: 'react/react-original' },
  vite: { nombre: 'Vite', dev: 'vitejs/vitejs-original' },
  tailwind: { nombre: 'Tailwind CSS', dev: 'tailwindcss/tailwindcss-original' },
  jest: { nombre: 'Jest', dev: 'jest/jest-plain' },
  acciones: { nombre: 'GitHub Actions', dev: 'githubactions/githubactions-original' },
  android: { nombre: 'Android Studio', dev: 'androidstudio/androidstudio-original' },
  bash: { nombre: 'Bash', dev: 'bash/bash-original' },
  markdown: { nombre: 'Markdown', simple: 'markdown', color: 'currentColor' },
  github: { nombre: 'GitHub', simple: 'github', color: 'currentColor' },
  apple: { nombre: 'Apple', simple: 'apple', color: 'currentColor' },
  claude: { nombre: 'Claude', simple: 'claude', color: '#D97757' },
  gemini: { nombre: 'Gemini', simple: 'googlegemini', color: '#8E75B2' },
  ollama: { nombre: 'Ollama', simple: 'ollama', color: 'currentColor' },
  owasp: { nombre: 'OWASP', simple: 'owasp', color: 'currentColor' },
  bitwarden: { nombre: 'Bitwarden (gestor de contraseñas)', simple: 'bitwarden', color: '#175DDC' },
  letsencrypt: { nombre: "Let's Encrypt (HTTPS)", simple: 'letsencrypt', color: 'currentColor' },
};

// Un logo. tam: 'chico' (junto al texto), 'medio' (títulos) o 'isla' (el dibujo de la isla).
export function htmlLogo(clave, tam = 'chico') {
  const l = LOGOS[clave];
  if (!l) return '';
  if (l.dev) return `<img class="logo logo-${tam}" src="${DEVICON}${l.dev}.svg" alt="${l.nombre}" title="${l.nombre}" loading="lazy">`;
  return `<span class="logo logo-${tam} logo-mono" role="img" aria-label="${l.nombre}" title="${l.nombre}"
    style="--logo:url('${SIMPLE}${l.simple}.svg');--logo-color:${l.color}"></span>`;
}

export function htmlLogos(claves = [], tam = 'chico') {
  return claves.length ? `<span class="logos">${claves.map((k) => htmlLogo(k, tam)).join('')}</span>` : '';
}
