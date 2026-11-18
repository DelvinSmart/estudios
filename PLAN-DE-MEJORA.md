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
- [ ] TypeScript (el compilador de TypeScript dentro de la caja)
- [ ] Python (Pyodide: Python dentro del navegador)
- [ ] Kotlin (Kotlin Playground: corre en los servidores gratuitos de JetBrains; la revisión es por la salida)
- [ ] React Native (Snack de Expo para ver la app; la revisión es una lista de comprobación)
- [x] El panel muestra los ejercicios en la vista previa y no los rompe

### B. El proyecto de práctica público

Un repositorio aparte, público: **"Gastos del carro"**, una app pequeña con las mismas piezas que Copiloto
(TypeScript, pruebas, CI, Firebase con emulador, una pantalla en React Native, una API en Node). Reemplaza
todos los "abre tal archivo de Copiloto".

- [ ] Crear el repositorio y su guía para descargarlo
- [ ] Una versión "con errores a propósito" para el curso de seguridad
- [ ] Cambiar cada ejercicio que hoy pide abrir Copiloto

### C. Cada curso: ejercicios en cada parte, un proyecto de principio a fin, y más clases donde falten

| Curso | Proyecto de principio a fin | Lo que hay que agregar |
|---|---|---|
| Programación | "Gastos del carro": leer su código, escribir pruebas, CI, Git, Firebase con emulador y un CRUD | Ejercicios en cada clase; usar el proyecto de práctica en vez de Copiloto |
| JavaScript + TypeScript | Una web de gastos en el navegador, con pruebas | El DOM, errores, clases y objetos, fechas, guardar en el navegador |
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
- [ ] Qué es la **programación orientada a objetos**, en qué se parece y en qué no a un motor de diseño
  (Python y Kotlin ya tienen su clase de clases y objetos; a JavaScript le falta)

### E. El panel

- [x] El panel muestra los ejercicios en la vista previa
- [ ] Si se agregan clases nuevas, se hace en la computadora (las reglas del certificado cuentan las partes)

## Orden de trabajo

1. A: el motor de ejercicios (JavaScript, HTML y CSS primero; después TypeScript y Python).
2. Un curso piloto completo: **JavaScript + TypeScript**, con ejercicios en cada parte y su proyecto.
3. B: el proyecto de práctica público.
4. Los demás cursos, uno por uno, con el mismo molde.
5. D: la clase del sistema de diseño en cada curso.

Cada paso se prueba en el teléfono y en la computadora antes de publicarlo.
