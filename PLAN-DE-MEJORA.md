# Plan de mejora: que cada curso deje a la persona lista para construir

> Escrito el 18 de noviembre de 2026. Cada sesión nueva (de cualquier IA) lee este archivo antes de seguir.
> Se marca con `[x]` lo que ya está hecho.

## El diagnóstico

Los cursos explican bien (ejemplos de la vida real, código real, entrevista), pero todavía **no dejan a
alguien que empieza de cero listo para construir solo**:

| Falta | Por qué importa |
|---|---|
| Casi no se escribe código | Las prácticas son verdadero/falso y elegir: comprueban que **reconoces**, no que **sabes hacer** |
| No hay proyectos de principio a fin | Nadie construye una app desde una carpeta vacía hasta publicarla |
| Algunos cursos son cortos para lo que prometen | JavaScript, Node, React Native, Kotlin y Python tienen entre 7 y 9 clases |
| Muchos ejercicios piden abrir Copiloto, que es privado | Otra persona no los puede hacer |
| No se explica el sistema de diseño (motores, tokens) ni cómo lo "llama" un recuadro | Es lo que mantiene ordenado un proyecto real |

Tamaño de hoy (clases · partes · bloques de código · prácticas):

| Curso | Clases | Partes | Bloques de código | Prácticas |
|---|---|---|---|---|
| Programación | 23 | 251 | 210 | 241 |
| JavaScript + TypeScript | 9 | 45 | 60 | 36 |
| Node.js | 8 | 33 | 30 | 25 |
| React Native | 7 | 28 | 21 | 21 |
| Kotlin | 7 | 28 | 34 | 21 |
| Python | 8 | 39 | 64 | 31 |
| Seguridad | 3 | 26 | 11 | 23 |
| IA para programadores | 9 | 61 | 15 | 52 |
| Agentes de IA | 6 | 56 | 24 | 8 |

## Decisiones

1. **Copiloto sigue privado.** Es una app en producción con usuarios reales: tiene configuración, guías internas,
   precios y la forma exacta de sus reglas. Publicarla no enseña más y le da a cualquiera el mapa completo para
   buscarle fallas o copiarla. En su lugar se crea un **proyecto de práctica público** (ver B), hecho con las mismas
   piezas, que cualquiera puede descargar.
2. **Todo gratis.** Herramientas que corren en el navegador o en la computadora, sin pagar nada
   (Pyodide para Python, el Kotlin Playground de JetBrains, Expo Go y Snack para React Native).
3. **Los ejercicios de código son para aprender, no para el certificado.** Se revisan en el navegador del alumno
   (rápido, gratis, sin servidor). El certificado sigue dependiendo de las prácticas que corrige el servidor.
   Correr código del alumno en el servidor sería caro y peligroso.
4. **Primero la base, después el contenido.** Sin el motor de ejercicios, no hay dónde escribir código.

## Lo que hay que construir

### A. El motor de ejercicios (la base de todo)

Un bloque nuevo en las clases, ` ```ejercicio `: el alumno lee qué se pide, escribe el código en un cuadro,
toca **▶ probar** y ve cada prueba en verde o en rojo, con su mensaje. Corre en una **caja aislada** (la misma
idea del laboratorio de CRUD: un iframe sin acceso al sitio), se corta si se queda colgado, guarda lo escrito
en el aparato y deja ver la solución después de intentarlo.

- [x] JavaScript
- [x] HTML y CSS (las pruebas miran la página que armó el alumno)
- [x] TypeScript (el compilador oficial dentro de la caja: revisa los tipos en modo estricto y explica los errores comunes en español)
- [ ] Python (Pyodide: Python dentro del navegador)
- [ ] Kotlin (Kotlin Playground: corre en los servidores gratuitos de JetBrains; la revisión es por la salida)
- [ ] React Native (Snack de Expo para ver la app; la revisión es una lista de comprobación)
- [x] El panel muestra los ejercicios en la vista previa y no los rompe

### B. El proyecto de práctica público

Un repositorio aparte, público: **"Gastos del carro"**, una app pequeña con las mismas piezas que Copiloto
(TypeScript, pruebas, CI, Firebase con emulador, una pantalla en React Native, una API en Node). Reemplaza
todos los "abre tal archivo de Copiloto".

- [x] Crear el repositorio y su guía para descargarlo: **[github.com/DelvinSmart/gastos-del-carro](https://github.com/DelvinSmart/gastos-del-carro)**
  (TypeScript estricto, 38 pruebas, cuatro candados, reglas de Firestore probadas con el emulador, la caja en capas,
  tres idiomas y el motor de diseño; su CI de GitHub está en verde)
- [ ] Una versión "con errores a propósito" para el curso de seguridad
- [ ] Cambiar cada ejercicio que hoy pide abrir Copiloto

### C. Cada curso: ejercicios en cada parte, un proyecto de principio a fin, y más clases donde falten

| Curso | Proyecto de principio a fin | Lo que hay que agregar |
|---|---|---|
| Programación | "Gastos del carro": leer su código, escribir pruebas, CI, Git, Firebase con emulador y un CRUD | Ejercicios en cada clase; usar el proyecto de práctica en vez de Copiloto |
| JavaScript + TypeScript | ✅ La web de gastos, de una carpeta vacía a GitHub Pages (clase 84) | ✅ Completo: 13 clases, un ejercicio de código en cada parte (54, probados con su solución), y las clases nuevas del DOM, errores y clases (POO), fechas y guardar |
| Node.js | La API de gastos con Express, con pruebas, publicada | Ejercicios de cada ruta, revisión automática |
| React Native | La app de gastos con Expo, en el teléfono | Formularios, listas, guardar datos, publicar paso a paso |
| Kotlin | La app de gastos con Jetpack Compose | Ejercicios del lenguaje en el Playground |
| Python | El resumen semanal de un conductor desde un CSV, con pytest | Ejercicios en cada parte con Pyodide |
| Seguridad | Auditar la versión "con errores" del proyecto de práctica y arreglarla | Más clases: es el curso más corto |
| IA para programadores | Construir una app pequeña dirigiendo a la IA: plan, reglas, pruebas, revisión | Ejercicios de pedidos y de revisión de código |
| Agentes de IA | Un agente pequeño que corre gratis en la computadora (Ollama) | Ejercicios con el código de cada patrón |

### D. El sistema de diseño (motores y tokens) en cada curso que dibuja pantallas

Cómo se construye un motor (colores, formas, efectos, separaciones), dónde se pone y cómo lo "llama" un recuadro:

- [ ] CSS: variables (`--hueco`, `--relleno`), como este mismo mapa
- [ ] JavaScript y TypeScript: un objeto de tema
- [ ] React Native: un archivo de tema, como `dash.*` de Copiloto
- [ ] Kotlin: el tema de Jetpack Compose
- [ ] Python y Node (sin pantallas): la misma idea con la configuración en un solo lugar
- [x] CSS dentro de JavaScript: el motor de la web de gastos (clase 84) y cómo lo llama cada elemento
- [x] Qué es la **programación orientada a objetos**, en qué se parece y en qué no a un motor de diseño (clase 82)

### F. El proyecto estrella: una calculadora, de la idea al teléfono

Un proyecto **de principio a fin**, paso a paso ("mira esto, ahora haz esto, este código es para esto"),
hecho de la mejor forma y sin código espagueti:

- **Lenguaje:** React Native con TypeScript y Expo. Con **un solo código** sale la app para Android (Samsung)
  y para iPhone, igual que Copiloto. Todo gratis.
- **Diseño primero:** el plano de la pantalla, el sistema de diseño (motores de color, forma, efectos y
  separaciones, con el estilo de las pantallas de Copiloto) y cómo cada botón "llama" a esos motores.
- **La lógica separada de la pantalla:** las cuentas en su propio archivo, con pruebas, antes de dibujar nada.
- **Probarla en el teléfono:** con Expo Go (gratis) en el Samsung y en el iPhone.
- **Instalarla como app de verdad:** en Android, un archivo para instalar; en el iPhone, desde la Mac con Xcode
  y una cuenta gratuita de Apple (la app dura 7 días y se vuelve a instalar; publicar en la App Store sí cuesta,
  y eso se explica pero no se hace).

- [ ] Las clases de la calculadora (curso de React Native)
- [ ] La misma calculadora en Kotlin (Android) y en Swift (iPhone), para comparar

### G. Un curso nuevo: Swift, el lenguaje del iPhone

Desde cero y completo, con el mismo molde que los demás: el lenguaje, SwiftUI para las pantallas, datos,
pruebas, el sistema de diseño, instalar en el iPhone y la calculadora. Copiloto ya usa Swift en su pieza
de iPhone (y Kotlin en la de Android): se cuenta cómo encajan.

- [ ] Plan de clases del curso de Swift
- [ ] Las clases, con ejercicios (Swift no corre en el navegador: se practica en Xcode, gratis en la Mac,
  con una lista de comprobación; y los ejercicios cortos con un sitio gratuito para correr Swift en línea)
- [ ] El curso en el mapa, con su certificado (eso cambia las reglas de Firebase: se suben antes de publicar)

### E. El panel

- [x] El panel muestra los ejercicios en la vista previa
- [ ] Si se agregan clases nuevas, se hace en la computadora (las reglas del certificado cuentan las partes)

## Orden de trabajo

1. A: el motor de ejercicios (JavaScript, HTML y CSS primero; después TypeScript y Python).
2. Un curso piloto completo: **JavaScript + TypeScript**, con ejercicios en cada parte y su proyecto.
3. B: el proyecto de práctica público.
4. Los demás cursos, uno por uno, con el mismo molde.
5. D: la clase del sistema de diseño en cada curso.
6. F: la calculadora, de la idea al teléfono.
7. G: el curso de Swift, desde cero.

Cada paso se prueba en el teléfono y en la computadora antes de publicarlo.
