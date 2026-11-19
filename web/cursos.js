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
  '91': { carpeta: '91-seguridad-proyecto-auditoria', titulo: 'Proyecto final: auditar una API con errores', meta: 'Una API con 10 errores a propósito: trampas, arreglos sin romper nada y el informe', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '89': { carpeta: '89-kotlin-proyecto-app-de-gastos', titulo: 'Proyecto final: la app de gastos en Android', meta: 'Gradle, lógica en Kotlin puro, DataStore, ViewModel con StateFlow, Compose y el emulador', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '96': { carpeta: '96-kotlin-proyecto-calculadora', titulo: 'La misma calculadora, en Kotlin', meta: 'Las mismas decisiones y pruebas que la de React Native: familias sealed, BigDecimal exacto, ViewModel y cuál conviene elegir', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '97': { carpeta: '97-swift-primeros-pasos', titulo: 'Primeros pasos', meta: 'Dónde correr Swift gratis, let y var, tipos y textos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '98': { carpeta: '98-swift-opcionales-y-decisiones', titulo: 'Opcionales, decisiones y ciclos', meta: 'String?, if let, guard let, ??, por qué evitar el !, switch con rangos y for', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '99': { carpeta: '99-swift-funciones-y-colecciones', titulo: 'Funciones, closures y colecciones', meta: 'Etiquetas de argumentos, closures con $0, Array, Dictionary, Set, map, filter y reduce', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '100': { carpeta: '100-swift-tipos-y-protocolos', titulo: 'struct, class, enum y protocolos', meta: 'Valor contra referencia, enum con valores asociados, protocolos y extensiones', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '101': { carpeta: '101-swift-errores-y-concurrencia', titulo: 'Errores y concurrencia', meta: 'throws, try, do-catch, try?, async, await, async let y Task', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '102': { carpeta: '102-swift-primera-pantalla', titulo: 'Tu primera pantalla con SwiftUI', meta: 'Crear el proyecto en Xcode, View, VStack y HStack, modificadores, @State y la app Mi jornada en el simulador', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '103': { carpeta: '103-swift-swiftui-con-datos', titulo: 'SwiftUI con datos', meta: 'List y ForEach, NavigationStack, borrar deslizando, un diario compartido con @Observable y guardar en el teléfono con Codable', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '104': { carpeta: '104-swift-motor-de-diseno', titulo: 'El motor de diseño en SwiftUI', meta: 'Separaciones, formas y letras en un enum, colores con modo claro y oscuro, y un ViewModifier para cada tarjeta', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '36': { carpeta: '36-python-primeros-pasos', titulo: 'Primeros pasos', meta: 'Correr Python, variables, tipos, print e input', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '37': { carpeta: '37-python-decisiones-y-repeticiones', titulo: 'Decisiones y repeticiones', meta: 'La sangría, if, elif, else, for, range y while', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '38': { carpeta: '38-python-colecciones', titulo: 'Listas, tuplas, diccionarios y conjuntos', meta: 'Agrupar datos y las comprensiones', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '39': { carpeta: '39-python-funciones', titulo: 'Funciones', meta: 'def, parámetros, return, alcance, lambda y tipos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '40': { carpeta: '40-python-errores-y-archivos', titulo: 'Errores y archivos', meta: 'Leer errores, try y except, raise, texto, CSV y JSON', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '41': { carpeta: '41-python-modulos-y-entornos', titulo: 'Módulos, paquetes y entornos', meta: 'import, la biblioteca estándar, pip y venv', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '42': { carpeta: '42-python-clases-y-objetos', titulo: 'Clases y objetos', meta: 'class, __init__, self, herencia y dataclasses', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '43': { carpeta: '43-python-pruebas-y-proyecto', titulo: 'Pruebas y un proyecto real', meta: 'pytest, el resumen de la semana de un conductor y las APIs', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '90': { carpeta: '90-python-proyecto-resumen-semanal', titulo: 'Proyecto final: el resumen de la semana', meta: 'Un programa de terminal: revisar cada fila, juntar los problemas, argparse y 28 pruebas con pytest', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '44': { carpeta: '44-mapa-de-los-lenguajes', titulo: 'El mapa de los lenguajes', meta: 'JavaScript, TypeScript, Node, React, React Native, Expo, Kotlin y Swift: qué es cada uno', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '45': { carpeta: '45-js-variables-y-tipos', titulo: 'Variables, tipos y la consola', meta: 'const, let, los tipos, las plantillas y ===', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '46': { carpeta: '46-js-decisiones-y-ciclos', titulo: 'Decisiones y ciclos', meta: 'if, ternario, falsy, ??, ?., for...of, while y switch', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '47': { carpeta: '47-js-funciones', titulo: 'Funciones', meta: 'Flechas, parámetros, closures y callbacks', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '48': { carpeta: '48-js-arrays-y-objetos', titulo: 'Arrays y objetos', meta: 'map, filter, reduce, spread, desestructuración y JSON', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '49': { carpeta: '49-js-asincronia', titulo: 'Asincronía', meta: 'Promesas, async/await, fetch y Firebase', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '50': { carpeta: '50-js-modulos-npm-y-node', titulo: 'Módulos, npm y Node.js', meta: 'import/export, package.json, scripts y la estructura de un proyecto', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '51': { carpeta: '51-ts-tipos-e-interfaces', titulo: 'TypeScript: tipos e interfaces', meta: 'Inferencia, uniones, interfaces y funciones tipadas', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '52': { carpeta: '52-ts-genericos-y-configuracion', titulo: 'TypeScript: genéricos y configuración', meta: 'Genéricos, unknown, Partial, tsconfig y los errores típicos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '53': { carpeta: '53-js-proyecto-con-pruebas', titulo: 'Un proyecto con pruebas', meta: 'Gastos del carro en TypeScript, probado con Vitest', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '81': { carpeta: '81-js-el-dom', titulo: 'El DOM: JavaScript cambia la página', meta: 'Encontrar elementos, cambiar texto y clases, eventos y formularios', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '82': { carpeta: '82-js-errores-clases-y-objetos', titulo: 'Errores, clases y objetos', meta: 'throw y try/catch, class, herencia, campos privados y la programación orientada a objetos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '83': { carpeta: '83-js-fechas-y-guardar', titulo: 'Fechas y guardar en el navegador', meta: 'Date sin trampas, calcular y mostrar fechas, localStorage y un repositorio', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '84': { carpeta: '84-js-proyecto-web-de-gastos', titulo: 'Proyecto final: la web de gastos', meta: 'De una carpeta vacía a publicada: motor de diseño, lógica con pruebas, pantalla, datos y GitHub Pages', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '54': { carpeta: '54-rn-react-componentes', titulo: 'React: componentes y props', meta: 'Componentes, JSX, listas con key y props', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '55': { carpeta: '55-rn-estado-y-efectos', titulo: 'Estado, eventos y efectos', meta: 'useState, formularios, useEffect y los hooks', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '56': { carpeta: '56-rn-piezas-y-estilos', titulo: 'Las piezas del teléfono y los estilos', meta: 'View, Text, FlatList, StyleSheet, Flexbox y SafeArea', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '57': { carpeta: '57-rn-expo', titulo: 'Expo: crear la app y verla en el iPhone', meta: 'create-expo-app, Expo Go y Expo Snack', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '58': { carpeta: '58-rn-navegacion-y-almacenamiento', titulo: 'Navegación y guardar en el teléfono', meta: 'React Navigation, params tipados y AsyncStorage', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '59': { carpeta: '59-rn-datos-y-rendimiento', titulo: 'Datos con Firebase y rendimiento', meta: 'onSnapshot, Context, memo y medir', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '60': { carpeta: '60-rn-publicar', titulo: 'Probar y publicar la app', meta: 'Testing Library, EAS Build, AAB, tiendas y actualizaciones', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '88': { carpeta: '88-rn-proyecto-app-de-gastos', titulo: 'Proyecto final: la app de gastos', meta: 'Expo y TypeScript: motor de diseño, lógica con pruebas, AsyncStorage, FlatList y abrirla en tu iPhone', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '94': { carpeta: '94-rn-proyecto-calculadora', titulo: 'La calculadora 1: el plano, el motor y la lógica', meta: 'El proyecto estrella: las decisiones de las cuentas, el motor de diseño, 0,1 + 0,2 y un reducer sin eval, con las pruebas primero', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '95': { carpeta: '95-rn-calculadora-al-telefono', titulo: 'La calculadora 2: la pantalla y el teléfono', meta: 'El teclado como datos, accesibilidad, lo que se encontró mirando, y la app de verdad en el iPhone y en Android', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '61': { carpeta: '61-kotlin-primeros-pasos', titulo: 'Primeros pasos', meta: 'Playground, val y var, tipos y plantillas', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '62': { carpeta: '62-kotlin-null-y-decisiones', titulo: 'Null safety, decisiones y ciclos', meta: 'String?, ?., ?:, if y when como expresiones, rangos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '63': { carpeta: '63-kotlin-funciones-y-colecciones', titulo: 'Funciones, lambdas y colecciones', meta: 'fun, lambdas, extensiones, map, filter y sumOf', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '64': { carpeta: '64-kotlin-clases', titulo: 'Clases, data class, enum y sealed', meta: 'Modelar datos y estados', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '65': { carpeta: '65-kotlin-corrutinas', titulo: 'Corrutinas', meta: 'suspend, launch, async, scope, Dispatchers y Flow', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '66': { carpeta: '66-kotlin-android-compose', titulo: 'Tu primera app Android con Compose', meta: 'Android Studio, @Composable, estado y ViewModel', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '67': { carpeta: '67-kotlin-datos-pruebas-publicar', titulo: 'Datos, pruebas y publicar', meta: 'DataStore, Room, Firebase, JUnit, AAB y React Native vs Kotlin', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '68': { carpeta: '68-node-que-es', titulo: 'Qué es Node.js', meta: 'El motor V8, el event loop, process y los módulos node:', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '69': { carpeta: '69-node-archivos', titulo: 'Archivos, carpetas y datos', meta: 'fs/promises, path, JSON, CSV y path traversal', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '70': { carpeta: '70-node-servidor-http', titulo: 'Tu primer servidor HTTP', meta: 'node:http, verbos, rutas, códigos y el cuerpo de un POST', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '71': { carpeta: '71-node-express', titulo: 'Express: rutas y middleware', meta: 'Rutas, params, middleware y errores en un solo lugar', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '72': { carpeta: '72-node-api-rest', titulo: 'Una API REST completa', meta: 'CRUD, validación, campos permitidos y CORS', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '73': { carpeta: '73-node-datos-y-seguridad', titulo: 'Base de datos y seguridad', meta: 'SQLite, parámetros, .env, tokens, límites y helmet', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '74': { carpeta: '74-node-pruebas-y-publicar', titulo: 'Pruebas y publicar', meta: 'node:test, supertest y publicar gratis en Firebase', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '75': { carpeta: '75-script-y-spa', titulo: '¿Qué es un script y qué es una SPA?', meta: 'La casa, el guion y la página que cambia sin recargar: esta misma plataforma', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '76': { carpeta: '76-node-bff-y-microservicios', titulo: 'REST a fondo, BFF y microservicios', meta: 'Idempotencia, códigos, versiones, un BFF en Express y cuándo partir en microservicios', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '87': { carpeta: '87-node-proyecto-api-de-gastos', titulo: 'Proyecto final: la API de gastos', meta: 'Express, validación, un almacén que no pierde datos, 32 pruebas y cómo publicarla', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '77': { carpeta: '77-como-hice-los-paneles', titulo: 'Cómo hice los paneles', meta: 'La trastienda de mis tres proyectos: la llave, GitHub, Firebase y cómo viaja cada cambio', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '19': { carpeta: '19-agentes-de-ia', titulo: 'Qué es un agente', meta: 'Python para leer los ejemplos, las piezas y el ciclo de un agente', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '25': { carpeta: '25-agentes-cinco-patrones', titulo: 'Los cinco patrones', meta: 'Herramientas (ReAct), planificación, reflexión, enrutamiento y multiagente', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '26': { carpeta: '26-agentes-veinte-patrones', titulo: 'Veinte patrones más', meta: 'Flujo, razonamiento, coordinación, control, conocimiento y cómo elegir', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '27': { carpeta: '27-agentes-disenar', titulo: 'Diseñar un agente', meta: 'Contexto, herramientas, estado, salidas, modelo y protocolos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '28': { carpeta: '28-agentes-evaluar-publicar', titulo: 'Evaluar y publicar', meta: 'Medir un agente con pruebas y llevarlo a producción', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '29': { carpeta: '29-agentes-todo-junto', titulo: 'Todo junto', meta: 'La arquitectura completa, la lista para producción y la entrevista', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '93': { carpeta: '93-agentes-proyecto-ollama', titulo: 'Proyecto final: un agente que corre gratis', meta: 'El Copiloto de gastos con Ollama: herramientas, frenos, controles, rastros y un set de evaluación con el modelo de verdad', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '30': { carpeta: '30-ia-como-funciona', titulo: 'Cómo funciona un modelo', meta: 'Qué hace bien, qué inventa, tokens, contexto, planes y privacidad', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '31': { carpeta: '31-ia-pedir-bien', titulo: 'Pedir bien', meta: 'Las piezas de un buen pedido, errores, pasos y mejorar el pedido con Gemini', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '32': { carpeta: '32-ia-claude-code', titulo: 'Claude y Claude Code', meta: 'Tu herramienta principal: CLAUDE.md, AGENTS.md, revisar, sesiones y MCP', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '33': { carpeta: '33-ia-otras-herramientas', titulo: 'Otras herramientas', meta: 'OpenCode, Codex, Gemini y modelos locales con Llama', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '34': { carpeta: '34-ia-sin-romper-nada', titulo: 'Trabajar sin romper nada', meta: 'Errores típicos de la IA, revisar, secretos, ataques y costos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '35': { carpeta: '35-ia-tu-flujo', titulo: 'Tu flujo de trabajo', meta: 'De la idea a lo publicado, y seguir aprendiendo de verdad', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '79': { carpeta: '79-ia-planificar', titulo: 'El plano y la estructura', meta: 'Planificar antes de programar, las puertas y ventanas que la IA olvida, y cómo evitar el código espagueti', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '85': { carpeta: '85-recorrido-de-cada-proyecto', titulo: 'El recorrido de cada proyecto', meta: 'De punta a punta: Copiloto (app e IA), ¿Qué dice la Biblia? y este mapa, en 30 segundos y en detalle', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '86': { carpeta: '86-la-entrevista', titulo: 'La entrevista: RH y líder técnico', meta: 'Tu historia con tus palabras, cada término en dos versiones (glosario) y el simulacro', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '78': { carpeta: '78-ia-varios-agentes', titulo: 'Uno o varios agentes, y dirigirlos', meta: 'Varios agentes sin pisarse, gastar menos tokens, subagentes, tu propio vigilante y la persona como director', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '80': { carpeta: '80-ia-maximo-provecho', titulo: 'Sacarle el máximo provecho', meta: 'Aprender mientras construyes, convertir lo repetitivo en herramientas y lo que no se delega', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
  '92': { carpeta: '92-ia-proyecto-dirigir-la-ia', titulo: 'Proyecto final: una app dirigiendo a la IA', meta: 'El plan, las reglas, un paso por pedido, la revisión que encuentra lo que las pruebas no ven y el cuaderno de pedidos', docs: [{ archivo: 'LECCION.md', titulo: 'Clase completa' }] },
};

// El dibujo de cada clase en el mapa de islas.
const ICONOS = {
  '01': '📖', '02': '🧪', '03': '✅', '04': '⚙️', '05': '✏️', '06': '🌿', '07': '🐞', '08': '🔥', '09': '🖥️', '10': '🏗️',
  '11': '🚗', '12': '📜', '13': '💻', '14': '🕊️', '15': '📄', '16': '🎨', '17': '⚡', '18': '🗺️', '19': '🤖', '20': '📦', '25': '🧩', '26': '🧭', '27': '📐', '28': '📊', '29': '🏁', '93': '🦾',
  '30': '🧠', '31': '💬', '32': '🛠️', '33': '🧰', '34': '🦺', '35': '🔄', '79': '🗒️', '78': '👥', '80': '🚀', '92': '🏁',
  '44': '🗺️', '68': '⚙️', '69': '🗂️', '70': '🌐', '71': '🚂', '72': '🔌', '73': '🔐', '74': '🚀', '75': '🏠', '76': '🧭', '87': '🏁', '45': '🔤', '46': '🔀', '47': '🧩', '48': '📚', '49': '⏳', '50': '📦', '51': '🏷️', '52': '🧬', '53': '🧪', '81': '🖱️', '82': '🧱', '83': '📅', '84': '🏁',
  '54': '⚛️', '55': '🔁', '56': '📐', '57': '📲', '58': '🧭', '59': '⚡', '60': '🚀', '88': '🏁', '94': '🧮', '95': '📱',
  '61': '👋', '62': '🛟', '63': '🧰', '64': '🏗️', '65': '🧵', '66': '🎨', '67': '📦', '89': '🏁', '96': '⚖️', '97': '👋', '98': '🛟', '99': '🧰', '100': '🏗️', '101': '🚦', '102': '🖼️', '103': '🗂️', '104': '🎨',
  '21': '🎓', '77': '🎛️', '85': '🛤️', '86': '🎤', '22': '🔐', '23': '🕵️', '24': '🛡️', '91': '🏁',
};
for (const [n, icono] of Object.entries(ICONOS)) if (CLASES[n]) CLASES[n].icono = icono;

// Los logos de las tecnologías de cada clase (ver web/logos.js). El primero va en la isla.
const LOGOS_CLASE = {
  '01': ['typescript'], '02': ['jest'], '03': ['jest', 'typescript'], '04': ['acciones', 'github'], '05': ['typescript', 'git'],
  '06': ['git', 'github'], '08': ['firebase'], '09': ['node', 'javascript'], '11': ['react', 'typescript', 'firebase'],
  '12': ['html', 'css', 'javascript'], '13': ['react', 'typescript', 'vite', 'tailwind', 'firebase'], '14': ['html', 'css', 'javascript'],
  '15': ['html'], '16': ['css'], '17': ['javascript'], '18': ['html', 'css', 'javascript', 'markdown'],
  '19': ['python', 'javascript'], '20': ['github', 'firebase', 'android', 'apple'], '21': ['firebase', 'javascript'], '77': ['github', 'firebase', 'react'], '85': ['firebase', 'javascript', 'github'], '86': ['javascript', 'typescript', 'react'],
  '22': ['bitwarden', 'letsencrypt'], '23': ['owasp'], '24': ['owasp', 'firebase'], '91': ['owasp', 'node'], '25': ['python', 'javascript'], '27': ['python'], '93': ['python', 'ollama'],
  '30': ['claude', 'gemini', 'ollama'], '31': ['gemini', 'claude'], '32': ['claude'], '33': ['ollama', 'gemini', 'github'],
  '35': ['claude', 'git'], '79': ['claude'], '78': ['claude', 'git'], '80': ['claude', 'ollama'], '92': ['claude', 'javascript'],
  '44': ['javascript', 'typescript', 'react', 'kotlin'],
  '68': ['node'], '69': ['node'], '70': ['node'], '71': ['node', 'javascript'], '72': ['node', 'javascript'], '73': ['node', 'firebase'], '74': ['node', 'firebase'],
  '75': ['html', 'css', 'javascript'],
  '76': ['node', 'javascript'],
  '87': ['node', 'javascript', 'firebase'],
  '45': ['javascript'], '46': ['javascript'], '47': ['javascript'], '48': ['javascript'], '49': ['javascript', 'firebase'],
  '50': ['node', 'javascript'], '51': ['typescript'], '52': ['typescript'], '53': ['typescript', 'vitest'], '81': ['javascript', 'html'], '82': ['javascript'], '83': ['javascript'], '84': ['javascript', 'css', 'github'],
  '54': ['react', 'typescript'], '55': ['react'], '56': ['react'], '94': ['react', 'typescript'], '95': ['expo', 'apple', 'android'], '57': ['expo', 'apple'], '58': ['react'], '59': ['firebase', 'react'], '60': ['expo', 'android', 'apple'], '88': ['react', 'typescript', 'expo'],
  '61': ['kotlin'], '62': ['kotlin'], '63': ['kotlin'], '64': ['kotlin'], '96': ['kotlin', 'android'], '97': ['swift', 'apple'], '98': ['swift'], '99': ['swift'], '100': ['swift'], '101': ['swift'], '102': ['swift', 'apple'], '103': ['swift', 'apple'], '104': ['swift', 'apple'], '65': ['kotlin'], '66': ['compose', 'kotlin', 'android'], '67': ['androide', 'firebase', 'gradle'], '89': ['kotlin', 'compose', 'android'],
  '36': ['python'], '37': ['python'], '38': ['python'], '39': ['python'], '40': ['python', 'markdown'],
  '41': ['python', 'bash'], '42': ['python'], '43': ['python', 'github'], '90': ['python', 'bash'],
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
    clases: ['01', '44', '02', '03', '04', '05', '06', '07'],
  },
  {
    id: 'web', icono: '🌐', titulo: 'La web: HTML, CSS y JavaScript', logos: ['html', 'css', 'javascript'],
    desc: 'Las tres piezas con las que se hace cualquier página.',
    clases: ['15', '16', '17', '75'],
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
    clases: ['12', '13', '14', '18', '20', '21', '77', '85', '86'],
  },
  {
    id: 'javascript', curso: 'javascript', icono: '🟨', titulo: 'JavaScript + TypeScript', logos: ['javascript', 'typescript', 'node', 'vitest'],
    desc: 'Un curso aparte, con su propio certificado: JavaScript de cero a completo, y después TypeScript.',
    clases: ['45', '46', '47', '48', '49', '50', '81', '82', '83', '51', '52', '53', '84'],
  },
  {
    id: 'node', curso: 'node', icono: '🟩', titulo: 'Node.js', logos: ['node', 'javascript', 'firebase'],
    desc: 'Un curso aparte, con su propio certificado: el backend con JavaScript, de los archivos a una API publicada.',
    clases: ['68', '69', '70', '71', '72', '73', '74', '76', '87'],
  },
  {
    id: 'reactnative', curso: 'reactnative', icono: '📱', titulo: 'React Native', logos: ['react', 'typescript', 'expo', 'firebase'],
    desc: 'Un curso aparte, con su propio certificado: apps para iPhone y Android con un solo código, como Copiloto.',
    clases: ['54', '55', '56', '57', '58', '59', '60', '88', '94', '95'],
  },
  {
    id: 'kotlin', curso: 'kotlin', icono: '🤖', titulo: 'Kotlin', logos: ['kotlin', 'compose', 'androide', 'gradle'],
    desc: 'Un curso aparte, con su propio certificado: el lenguaje nativo de Android, hasta publicar una app.',
    clases: ['61', '62', '63', '64', '65', '66', '67', '89', '96'],
  },
  {
    id: 'swift', curso: 'swift', icono: '🐦', titulo: 'Swift', logos: ['swift', 'apple'],
    desc: 'Un curso aparte, con su propio certificado: el lenguaje del iPhone, de los primeros pasos a una app en SwiftUI.',
    clases: ['97', '98', '99', '100', '101', '102', '103', '104'],
  },
  {
    id: 'python', curso: 'python', icono: '🐍', titulo: 'Python', logos: ['python'],
    desc: 'Un curso aparte, con su propio certificado: Python completo, de los primeros pasos a un proyecto con pruebas.',
    clases: ['36', '37', '38', '39', '40', '41', '42', '43', '90'],
  },
  {
    id: 'seguridad', curso: 'seguridad', icono: '🛡️', titulo: 'Seguridad: pensar como hacker', logos: ['owasp'],
    desc: 'Un curso aparte, con su propio certificado: cómo atacan y cómo se defiende un sistema.',
    clases: ['22', '23', '24', '91'],
  },
  {
    id: 'ia-programadores', curso: 'ia', icono: '🧠', titulo: 'IA para programadores', logos: ['claude', 'gemini', 'ollama'],
    desc: 'Un curso aparte, con su propio certificado: trabajar con Claude, Gemini, OpenCode, Codex y Llama sin romper nada.',
    clases: ['30', '31', '32', '33', '34', '35', '79', '78', '80', '92'],
  },
  {
    id: 'agentes', curso: 'agentes', icono: '🦾', titulo: 'Agentes de IA', logos: ['python', 'javascript'],
    desc: 'Un curso aparte, con su propio certificado: diseñar, medir y publicar tus propios agentes.',
    clases: ['19', '25', '26', '27', '28', '29', '93'],
  },
];

// Los cursos: cada uno tiene su propio progreso en la nube y su propio certificado.
// El prefijo va al comienzo del código de verificación (ME-…, SE-…).
export const CURSOS = {
  programacion: {
    id: 'programacion', titulo: 'Programación', icono: '💻', prefijo: 'ME', corto: 'Mapa de estudios',
    nombre: 'Mapa de estudios: programación, de los fundamentos a los agentes de IA',
  },
  javascript: {
    id: 'javascript', titulo: 'JavaScript + TypeScript', icono: '🟨', prefijo: 'JS', corto: 'JavaScript + TypeScript',
    nombre: 'JavaScript + TypeScript: de cero a un proyecto con pruebas',
  },
  node: {
    id: 'node', titulo: 'Node.js', icono: '🟩', prefijo: 'ND', corto: 'Node.js',
    nombre: 'Node.js: el backend con JavaScript, de los archivos a una API publicada',
  },
  reactnative: {
    id: 'reactnative', titulo: 'React Native', icono: '📱', prefijo: 'RN', corto: 'React Native',
    nombre: 'React Native: apps para iPhone y Android, de los componentes a publicar',
  },
  kotlin: {
    id: 'kotlin', titulo: 'Kotlin', icono: '🤖', prefijo: 'KT', corto: 'Kotlin',
    nombre: 'Kotlin: del lenguaje a una app Android con Jetpack Compose',
  },
  swift: {
    id: 'swift', titulo: 'Swift', icono: '🐦', prefijo: 'SW', corto: 'Swift',
    nombre: 'Swift: del lenguaje a una app de iPhone con SwiftUI',
  },
  python: {
    id: 'python', titulo: 'Python', icono: '🐍', prefijo: 'PY', corto: 'Python',
    nombre: 'Python: de los primeros pasos a un proyecto real con pruebas',
  },
  seguridad: {
    id: 'seguridad', titulo: 'Seguridad', icono: '🛡️', prefijo: 'SE', corto: 'Seguridad',
    nombre: 'Seguridad: pensar como hacker, de lo básico a auditar un sistema',
  },
  ia: {
    id: 'ia', titulo: 'IA para programadores', icono: '🧠', prefijo: 'IA', corto: 'IA para programadores',
    nombre: 'IA para programadores: trabajar con Claude, Gemini, OpenCode, Codex y Llama',
  },
  agentes: {
    id: 'agentes', titulo: 'Agentes de IA', icono: '🦾', prefijo: 'AG', corto: 'Agentes de IA',
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
