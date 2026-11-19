// EL GLOSARIO: una definición corta y fácil de cada palabra técnica del curso.
// El buscador la muestra ARRIBA de los resultados: así, si no sabes una palabra,
// la entiendes antes de entrar a ninguna clase.
//
// Cada entrada:
//   termino:    cómo se escribe (lo que se resalta)
//   alias:      otras formas de escribirlo o buscarlo (plural, sin tilde, el inglés…)
//   definicion: en español, para alguien que empieza. Una o dos frases.
//   clase:      el número de la clase donde se enseña a fondo (para el enlace). Puede faltar.
//
// Si agregas un término, corre:  node --test herramientas/glosario.test.mjs
// (revisa que no esté vacío, que sea corto y que la clase exista).

export const GLOSARIO = [
  { termino: 'commit', alias: ['commits', 'commitear'], clase: '06',
    definicion: 'Un punto guardado en la historia de tu código, con un mensaje que dice qué cambiaste. Como sacarle una foto a tu trabajo para poder volver a ella.' },
  { termino: 'main', alias: ['rama principal', 'master'], clase: '06',
    definicion: 'La rama principal: la versión "de verdad" del proyecto, la que se publica. Las ideas nuevas se prueban en otra rama y, cuando están listas, se unen a main.' },
  { termino: 'rama', alias: ['ramas', 'branch'], clase: '06',
    definicion: 'Una línea de trabajo aparte, para probar algo sin tocar la versión buena. Cuando funciona, se une (merge) a main.' },
  { termino: 'merge', alias: ['unir', 'fusionar'], clase: '06',
    definicion: 'Unir una rama con otra: lo que probaste aparte pasa a formar parte de la versión principal.' },
  { termino: 'fast-forward', alias: ['avance directo'], clase: '06',
    definicion: 'Unir una rama con main cuando nadie tocó main mientras trabajabas: Git solo mueve la etiqueta hacia adelante, sin inventar un commit de unión.' },
  { termino: 'pull request', alias: ['pr', 'pull requests'], clase: '06',
    definicion: 'Una propuesta para unir tu rama con main, para que alguien la revise antes. En un equipo, casi nada entra a main sin un PR.' },
  { termino: 'checkout', alias: [], clase: '06',
    definicion: 'Pasarte a otra rama o a otro punto de la historia. En Git moderno se usa más "switch" para cambiar de rama.' },
  { termino: 'repositorio', alias: ['repo', 'repos'], clase: '06',
    definicion: 'La carpeta de tu proyecto con toda su historia de cambios guardada por Git.' },
  { termino: 'terminal', alias: ['consola', 'línea de comandos', 'shell'], clase: '05',
    definicion: 'La pantalla donde le escribes órdenes a la computadora en texto (como "npm test"), en vez de usar botones. Responde con texto.' },
  { termino: 'compilar', alias: ['compilación', 'compilador'], clase: '51',
    definicion: 'Convertir el código que tú escribes en algo que la máquina (o el teléfono) puede ejecutar. TypeScript, Kotlin y Swift se compilan; JavaScript y Python no.' },
  { termino: 'npm', alias: ['npm install', 'npm run'], clase: '50',
    definicion: 'El "mercado" de Node.js: un programa para bajar librerías (código de otros) y correr los comandos de tu proyecto, como "npm test".' },
  { termino: 'CI', alias: ['integración continua', 'ci/cd'], clase: '04',
    definicion: 'Una máquina (en GitHub) que corre tus pruebas sola cada vez que subes código. Si algo se rompe, lo marca en rojo antes de que llegue a la gente.' },
  { termino: 'README', alias: ['readme', 'léeme'], clase: '06',
    definicion: 'El archivo de texto que explica qué es un proyecto y cómo usarlo. Es lo primero que se lee al abrir un repositorio.' },
  { termino: 'runtime', alias: ['tiempo de ejecución', 'en ejecución'], clase: '68',
    definicion: 'El programa que hace correr tu código, y el momento en que corre. Node.js es el runtime de JavaScript fuera del navegador.' },
  { termino: 'endpoint', alias: ['endpoints', 'punto de acceso'], clase: '70',
    definicion: 'Una dirección del servidor que hace una cosa, como "/gastos" para pedir los gastos. La app le habla a los endpoints.' },
  { termino: 'API', alias: ['apis', 'interfaz'], clase: '09',
    definicion: 'La lista de cosas que un programa le ofrece a otro: qué le puedes pedir y qué te devuelve. Como el menú de un restaurante entre la app y el servidor.' },
  { termino: 'SQL', alias: ['sql', 'consulta'], clase: '73',
    definicion: 'El idioma para hablarle a una base de datos: pedir, guardar, cambiar o borrar datos con frases como SELECT o INSERT.' },
  { termino: 'token', alias: ['tokens'], clase: '86',
    definicion: 'Una palabra tiene tres sentidos según el tema: (1) en IA, un pedacito de texto; (2) en seguridad, un pase que prueba que ya entraste; (3) en diseño, un valor con nombre, como un color.' },
  { termino: 'hash', alias: ['hashes', 'hashear'], clase: '22',
    definicion: 'Convertir un texto en una huella fija de la que no se puede volver atrás. Se usa para guardar contraseñas sin guardarlas de verdad.' },
  { termino: 'JWT', alias: ['jwt', 'json web token'], clase: '109',
    definicion: 'Un tipo de token firmado: lleva datos a la vista y una firma que prueba que no lo cambiaron. El servidor revisa la firma, no se fía del contenido.' },
  { termino: 'emulador', alias: ['emuladores', 'simulador'], clase: '66',
    definicion: 'Un teléfono de mentira dentro de tu computadora, para probar una app sin tener el teléfono de verdad. (En Android se dice emulador; en iPhone, simulador.)' },
  { termino: 'declarativo', alias: ['declarativa'], clase: '66',
    definicion: 'Un estilo donde describes cómo se debe VER la pantalla según los datos, y la herramienta la dibuja. Así son SwiftUI y Jetpack Compose. Lo contrario es ir dando órdenes paso a paso (imperativo).' },
  { termino: 'StateFlow', alias: ['stateflow', 'flujo de estado'], clase: '65',
    definicion: 'En Kotlin, una caja que guarda el estado actual y avisa a la pantalla cada vez que cambia, para que se redibuje sola.' },
  { termino: 'componente', alias: ['componentes'], clase: '54',
    definicion: 'Una pieza de pantalla reutilizable, con su aspecto y su comportamiento, que puedes usar muchas veces. React y React Native están hechos de componentes.' },
  { termino: 'props', alias: ['prop'], clase: '54',
    definicion: 'Los datos que un componente recibe de quien lo usa, como los ingredientes que le pasas a una receta.' },
  { termino: 'estado', alias: ['state'], clase: '55',
    definicion: 'Los datos que una pantalla recuerda y que, al cambiar, hacen que se redibuje: lo escrito en un campo, si un menú está abierto, la lista de gastos.' },
  { termino: 'asíncrono', alias: ['asincrono', 'asincronía', 'async', 'await'], clase: '49',
    definicion: 'Algo que tarda (pedir datos por internet, leer un archivo) y no frena el resto mientras espera. Se maneja con promesas y async/await.' },
  { termino: 'promesa', alias: ['promesas', 'promise'], clase: '49',
    definicion: 'Un "te aviso cuando esté" para algo que tarda: representa un resultado que todavía no llegó. Con await esperas a que llegue.' },
  { termino: 'fetch', alias: [], clase: '49',
    definicion: 'La orden para pedirle datos a un servidor por internet desde el código. Devuelve una promesa.' },
  { termino: 'JSON', alias: ['json'], clase: '48',
    definicion: 'Un formato de texto con llaves { } para guardar y enviar datos (nombres y valores). Es como se hablan casi todas las apps y servidores.' },
  { termino: 'CORS', alias: ['cors'], clase: '72',
    definicion: 'La regla del navegador sobre qué páginas de otros sitios pueden leer las respuestas de tu servidor. Protege a la persona.' },
  { termino: 'XSS', alias: ['xss'], clase: '23',
    definicion: 'Un ataque donde alguien mete código en una página para que se ejecute en el navegador de otros. Se cierra "escapando" lo que viene de afuera.' },
  { termino: 'IDOR', alias: ['idor'], clase: '23',
    definicion: 'Pedir algo que no es tuyo solo cambiando un número en la dirección (el gasto 2 en vez del 1). Se cierra revisando que seas el dueño.' },
  { termino: 'inyección SQL', alias: ['inyeccion sql', 'sql injection'], clase: '23',
    definicion: 'Colar órdenes en una consulta a la base de datos a través de un campo de texto. Se cierra con consultas con parámetros.' },
  { termino: 'modelo de amenazas', alias: ['threat model', 'stride'], clase: '115',
    definicion: 'Pensar, antes de programar, quién podría atacar tu app, qué buscaría y cómo, y escribir la defensa de cada caso.' },
  { termino: 'escapar', alias: ['escapado'], clase: '108',
    definicion: 'Convertir los símbolos peligrosos de un texto que viene de afuera (como < o >) en inofensivos, para que se vean como texto y no se ejecuten.' },
  { termino: 'bundle', alias: [], clase: '110',
    definicion: 'El paquete con todo el código de una app junto en un archivo, listo para el teléfono o el navegador.' },
  { termino: 'puente nativo', alias: ['puente', 'módulo nativo', 'modulo nativo'], clase: '113',
    definicion: 'El camino por el que TypeScript (React Native) le habla a código escrito en Kotlin o Swift, para hacer cosas que solo el teléfono sabe hacer.' },
  { termino: 'agente', alias: ['agentes', 'agente de ia'], clase: '19',
    definicion: 'Un programa que, en un ciclo, le pide algo a un modelo de IA, usa herramientas según lo que responde, mira el resultado y repite hasta terminar.' },
  { termino: 'prueba', alias: ['pruebas', 'test', 'tests'], clase: '02',
    definicion: 'Un programa que revisa tu código solo: le da una entrada y comprueba que el resultado sea el esperado. "Pasaron" = todas coincidieron.' },
  { termino: 'SDK', alias: ['sdk'], clase: '44',
    definicion: 'Un kit de herramientas para construir sobre algo (un sistema, un servicio): librerías, programas y ejemplos juntos.' },
  { termino: 'App Check', alias: ['app check', 'appcheck'], clase: '108',
    definicion: 'Un control de Firebase que deja usar el servidor solo desde tu sitio de verdad, no desde un programa que copió tu configuración.' },

  // Pruebas (clase 02)
  { termino: 'suite de pruebas', alias: ['suite', 'la suite'], clase: '02',
    definicion: 'El conjunto completo de pruebas de un proyecto, todas juntas. "Pasó la suite" = pasaron todas.' },
  { termino: 'mock', alias: ['mocks', 'pieza falsa'], clase: '02',
    definicion: 'Una pieza falsa que reemplaza a una real durante una prueba (por ejemplo, para no llamar de verdad a internet). Como un muñeco de pruebas de choque.' },
  { termino: 'regresión', alias: ['regresion'], clase: '02',
    definicion: 'Cuando algo que ya funcionaba se vuelve a dañar por un cambio nuevo. Las pruebas sirven para atraparla.' },
  { termino: 'caso borde', alias: ['casos borde', 'edge case'], clase: '02',
    definicion: 'El límite de una regla, donde las cosas suelen fallar: el valor cero, una lista vacía, justo la fecha del corte.' },
  { termino: 'E2E', alias: ['e2e', 'punta a punta', 'end to end'], clase: '02',
    definicion: 'Prueba "de punta a punta": usa la app entera como lo haría una persona. Es la más completa, pero lenta; por eso se hacen pocas.' },

  // JavaScript (clases 45-50)
  { termino: 'closure', alias: ['closures', 'cierre'], clase: '47',
    definicion: 'Una función que "se acuerda" de las variables de donde nació, aunque se use después y en otro lado.' },
  { termino: 'callback', alias: ['callbacks'], clase: '47',
    definicion: 'Una función que le pasas a otra para que la llame cuando termine o cuando pase algo.' },
  { termino: 'DOM', alias: ['dom'], clase: '81',
    definicion: 'El árbol de todo lo que hay en una página web. JavaScript lo cambia para que la página se mueva sin recargar.' },

  // React / móvil (clases 54-60)
  { termino: 'hook', alias: ['hooks'], clase: '55',
    definicion: 'En React, una función especial (useState, useEffect…) que le da a un componente memoria o la capacidad de reaccionar a cambios.' },
  { termino: 'Expo', alias: ['expo'], clase: '57',
    definicion: 'El framework que se usa para hacer, correr y publicar apps de React Native sin pelearse con las herramientas de cada teléfono.' },
  { termino: 'AsyncStorage', alias: ['asyncstorage'], clase: '58',
    definicion: 'La "libretita" donde una app de React Native guarda datos simples en el teléfono, que siguen ahí al cerrarla.' },

  // Node / backend (clases 68-76)
  { termino: 'Express', alias: ['express'], clase: '70',
    definicion: 'La librería más usada para hacer un servidor web en Node.js: define las rutas (endpoints) y qué responde cada una.' },
  { termino: 'middleware', alias: ['middlewares'], clase: '71',
    definicion: 'Una función que se mete en medio de cada pedido al servidor para revisarlo o cambiarlo antes de responder (por ejemplo, ver si entraste).' },
  { termino: 'DNS', alias: ['dns'], clase: '107',
    definicion: 'La "guía telefónica" de internet: convierte un nombre como google.com en la dirección numérica del servidor.' },
  { termino: 'webhook', alias: ['webhooks'], clase: '107',
    definicion: 'Un aviso automático que un servicio le manda a tu servidor cuando pasa algo (por ejemplo, "se hizo un pago"), llamando a una URL tuya.' },

  // Kotlin / Swift (clases 61-106)
  { termino: 'corrutina', alias: ['corrutinas', 'coroutine'], clase: '65',
    definicion: 'En Kotlin, la forma de hacer tareas que tardan (pedir datos) sin congelar la pantalla, parecido a async/await.' },
  { termino: 'Compose', alias: ['jetpack compose'], clase: '66',
    definicion: 'La forma moderna de dibujar pantallas en Android: describes cómo se ve según los datos y el sistema la dibuja (declarativa).' },
  { termino: 'ViewModel', alias: ['viewmodel'], clase: '66',
    definicion: 'En Android, la pieza que guarda el estado de una pantalla y sobrevive aunque gires el teléfono.' },
  { termino: 'opcional', alias: ['opcionales', 'optional'], clase: '98',
    definicion: 'En Swift, un valor que puede tener algo o no tener nada (nil). Obliga a revisar "¿y si no hay?" antes de usarlo.' },
  { termino: 'struct', alias: ['structs'], clase: '100',
    definicion: 'Un molde para datos que se copia al pasarlo (no se comparte). En Swift se usa muchísimo.' },
  { termino: 'SwiftUI', alias: ['swiftui'], clase: '102',
    definicion: 'La forma moderna de dibujar pantallas en el iPhone: describes cómo se ven según los datos (declarativa). Solo existe en aparatos Apple.' },
  { termino: 'Xcode', alias: ['xcode'], clase: '97',
    definicion: 'El programa de Apple (solo para Mac) con el que se arman, prueban y publican las apps de iPhone.' },

  // Python (clases 36-43)
  { termino: 'venv', alias: ['entorno virtual'], clase: '41',
    definicion: 'Una "cajita" aparte para las librerías de un proyecto de Python, para que no se mezclen con las de otros.' },
  { termino: 'pip', alias: [], clase: '41',
    definicion: 'El instalador de librerías de Python, como npm lo es de Node.' },
  { termino: 'pytest', alias: [], clase: '43',
    definicion: 'La herramienta más usada para escribir y correr pruebas en Python.' },

  // Seguridad (clases 22-24, 107-115)
  { termino: 'sal', alias: ['salt'], clase: '22',
    definicion: 'Un texto al azar que se añade a cada contraseña antes de sacar su hash, para que dos claves iguales no den la misma huella.' },
  { termino: 'cifrar', alias: ['cifrado', 'encriptar'], clase: '109',
    definicion: 'Volver ilegible un texto con una llave, para que solo quien tenga la llave lo pueda leer. A diferencia del hash, el cifrado SÍ se puede deshacer (con la llave).' },
  { termino: 'firma digital', alias: ['firma', 'firmar'], clase: '109',
    definicion: 'Una marca que prueba quién hizo algo y que nadie lo cambió después. Cualquiera la puede comprobar, pero solo el dueño la puede hacer.' },
  { termino: 'llave pública y privada', alias: ['llave publica', 'clave pública', 'par de llaves'], clase: '109',
    definicion: 'Un par que va junto: la pública la puede tener todo el mundo (para comprobar o cifrarte algo) y la privada solo tú (para firmar o descifrar).' },
  { termino: 'AES', alias: ['aes'], clase: '109',
    definicion: 'El método de cifrado simétrico más usado: la misma llave cifra y descifra. Bueno para guardar datos, no para contraseñas.' },
  { termino: 'HMAC', alias: ['hmac'], clase: '109',
    definicion: 'Una firma con una llave secreta compartida: prueba que un mensaje viene de quien dice y no fue cambiado. Es lo que firma un JWT con HS256.' },
  { termino: 'CSRF', alias: ['csrf'], clase: '23',
    definicion: 'Un ataque donde otro sitio hace que tu navegador mande un pedido a una app donde ya entraste. Se frena con SameSite y tokens.' },
  { termino: 'path traversal', alias: ['path-traversal'], clase: '107',
    definicion: 'Colar algo como ../../ en un nombre de archivo para salir de la carpeta permitida y leer archivos que no debías.' },
  { termino: 'SSRF', alias: ['ssrf'], clase: '107',
    definicion: 'Engañar al servidor para que pida una dirección interna por ti, usando los permisos que él tiene y tú no.' },
  { termino: 'deep link', alias: ['deep links', 'enlace profundo'], clase: '110',
    definicion: 'Un enlace que abre una pantalla concreta dentro de una app del teléfono. Hay que desconfiar de lo que traiga.' },
  { termino: 'jailbreak', alias: ['root del teléfono'], clase: '110',
    definicion: 'Quitarle los candados a un teléfono para tener control total. Una app no debe confiar en un teléfono así.' },
  { termino: 'TCP', alias: ['tcp'], clase: '112',
    definicion: 'El "apretón de manos" con el que dos computadoras abren una conexión por internet antes de mandarse datos.' },
  { termino: 'firewall', alias: ['cortafuegos'], clase: '112',
    definicion: 'Un portero de red que deja pasar solo las conexiones permitidas y bloquea el resto.' },
];

// Las palabras que introduce una clase (su id): las que se enseñan ahí. Sirve para la caja
// "palabras nuevas en esta clase", que se arma sola desde aquí. Si agregas un término al glosario
// con su clase, aparece en la caja de esa clase sin tocar nada más.
export function palabrasDeClase(id) {
  return GLOSARIO.filter((e) => e.clase === id);
}

// Busca entradas que coincidan con una palabra ya normalizada (sin tildes, minúsculas).
export function buscarEnGlosario(palabraSinTildes) {
  const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const q = palabraSinTildes.trim();
  if (q.length < 2) return [];
  return GLOSARIO.filter((e) => {
    const nombres = [e.termino, ...(e.alias || [])].map(sinTildes);
    return nombres.some((n) => n.includes(q) || q.includes(n));
  });
}
