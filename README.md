# Estudios: curso de programación con Copiloto Driver

Este es mi curso de programación, hecho con mi propia app, Copiloto Driver.
Cada clase usa código real de la app, el mismo que voy a tener que explicar
en una entrevista.

## Los archivos importantes

| Archivo | Para qué sirve |
|---|---|
| [PROGRESO.md](PROGRESO.md) | **En qué clase voy**, qué terminé, qué me falta y qué me costó. Se lee siempre primero. |
| [AGENTS.md](AGENTS.md) | Las reglas para la IA que me enseña: cómo tiene que dar las clases. |
| [COMO-ESTUDIAR-CON-OTRA-IA.md](COMO-ESTUDIAR-CON-OTRA-IA.md) | Cómo seguir estudiando con ChatGPT o Gemini, con un prompt listo para pegar. |
| [index.html](index.html) | **El mapa de estudios**: una página que muestra todas las clases como un mapa (etapas → clases → partes). Lee los `LECCION.md` directamente. Cómo abrirla y cómo funciona: [Tema 18](18-como-hice-mi-mapa/LECCION.md). |
| [COMO-ESTUDIAR-DESDE-EL-IPAD.md](COMO-ESTUDIAR-DESDE-EL-IPAD.md) | Cómo estudiar desde el iPad o el celular con Claude en la nube, sin la Mac, con el mensaje listo para empezar cada clase. |

## Las clases, en orden

Cada clase se apoya en la anterior. El orden es el del mapa: primero los fundamentos (01 a 07), después la web (15 a 17), los datos (08 y 09), la arquitectura (10 y 11), mis proyectos (12, 13, 14, 18, 20 y 21). Aparte, cada uno con su propio certificado: **seguridad** (22 a 24), **IA para programadores** (30 a 35) y **agentes de IA** (19 y 25 a 29). Los números son el nombre de la carpeta, no el orden. Cada carpeta tiene su `LECCION.md` con la
explicación, los ejemplos, los ejercicios y las respuestas.

| # | Clase | Qué voy a saber hacer al terminar |
|---|---|---|
| 01 | [Leer código](01-leer-codigo/LECCION.md) | Leer una función de la app y decir qué hace |
| 02 | [Pruebas automáticas](02-pruebas-automaticas/LECCION.md) | Entender qué son las más de 400 pruebas de mi app y correrlas |
| 03 | [Mi primera prueba](03-tu-primera-prueba/LECCION.md) | Escribir una prueba yo solo |
| 04 | [CI](04-ci/LECCION.md) | Explicar qué revisa la máquina en cada subida y por qué |
| 05 | [Mi primer cambio](05-tu-primer-cambio/LECCION.md) | Cambiar algo en la app yo mismo |
| 06 | [Git](06-git/LECCION.md) | Guardar y subir mis cambios sin el script |
| 07 | [Leer errores](07-leer-errores/LECCION.md) | Encontrar la causa de un error leyendo el mensaje |
| 15 | [HTML](15-html/LECCION.md) | Armar la estructura de una página: etiquetas, esqueleto, HTML semántico, formularios y el DOM |
| 16 | [CSS](16-css/LECCION.md) | Darle diseño: selectores, cascada, modelo de caja, variables, flexbox, grid y celular |
| 17 | [JavaScript en la página](17-javascript/LECCION.md) | Hacer que la página responda: buscar y cambiar cajas, eventos, `fetch`, `localStorage` y módulos |
| 08 | [Firebase por dentro](08-firebase/LECCION.md) | Explicar dónde viven los datos y quién puede leerlos |
| 09 | [CRUD en Node.js](09-crud-nodejs/LECCION.md) | Hacer un servidor pequeño con sus pruebas (la tarea grande) |
| 10 | [Arquitectura](10-arquitectura/LECCION.md) | Explicar Clean Architecture, hexagonal, MVC y MVVM, y cómo está armada mi app |
| 11 | [Cómo arreglé Copiloto](11-como-arregle-copiloto/README.md) | Temas avanzados: velocidad, ciclos, motores de diseño |
| 12 | [Cómo hice Estudios Bíblicos](12-como-hice-estudios-biblicos/README.md) | Explicar un sitio en HTML, CSS y JavaScript: arquitectura, colores, publicación y panel con GitHub |
| 13 | [Cómo hice la web de Copiloto](13-como-hice-la-web/README.md) | Explicar la web: React, TypeScript, Vite, Tailwind y Firebase, y cómo usa el código del app sin copiarlo |
| 14 | [¿Qué dice la Biblia? por dentro](14-que-dice-la-biblia-por-dentro/README.md) | Explicar cómo se muestran versículos de Logos y Lockman sin copiarlos, el medidor de citas, las fuentes, el griego y el motor de diseño con su candado, y todo lo que no funcionó |
| 18 | [Cómo hice mi mapa de estudios](18-como-hice-mi-mapa/LECCION.md) | Explicar esta misma página por dentro: el enrutador, la lectura del Markdown, el progreso y la publicación |
| 20 | [Publicar e instalar](20-publicar-e-instalar/LECCION.md) | Subir el código a GitHub, las páginas a GitHub Pages, el servidor a Firebase, la app al Samsung y al iPhone, y el AAB a Google Play, cuidando la llave de firma |
| 21 | [El certificado verificable](21-certificado-verificable/LECCION.md) | Login con correo de Gmail, progreso en Firestore, reglas que no se dejan engañar y cómo se prueban atacándolas |
| 22 | [Seguridad básica](22-seguridad-basica/LECCION.md) | Ética y ley, pensar como atacante, contraseñas, secretos, phishing, el navegador y HTTPS (curso de seguridad) |
| 23 | [Seguridad intermedia](23-seguridad-intermedia/LECCION.md) | OWASP Top 10: IDOR, inyección, XSS, sesiones, CSRF, dependencias y prompt injection (curso de seguridad) |
| 24 | [Seguridad avanzada](24-seguridad-avanzada/LECCION.md) | Auditar un sistema entero, reglas de Firebase como atacante, abuso de costos, herramientas, reportes y tu camino (curso de seguridad) |
| 30 | [Cómo funciona un modelo](30-ia-como-funciona/LECCION.md) | IA para programadores: qué hace bien, qué inventa, tokens, contexto, planes y privacidad |
| 31 | [Pedir bien](31-ia-pedir-bien/LECCION.md) | Las piezas de un buen pedido y cómo mejorarlo con Gemini |
| 32 | [Claude y Claude Code](32-ia-claude-code/LECCION.md) | CLAUDE.md, AGENTS.md, revisar el diff, sesiones, subagentes y MCP |
| 33 | [Otras herramientas](33-ia-otras-herramientas/LECCION.md) | OpenCode, Codex, Gemini CLI y Llama con Ollama |
| 34 | [Trabajar sin romper nada](34-ia-sin-romper-nada/LECCION.md) | Errores típicos de la IA, revisar, secretos, ataques y costos |
| 35 | [Tu flujo de trabajo](35-ia-tu-flujo/LECCION.md) | De la idea a lo publicado, y aprender de verdad |
| 19, 25–29 | Agentes de IA (curso aparte) | Qué es un agente, los cinco patrones, veinte más, diseñar, evaluar y publicar, y todo junto |

## Cómo estudiar cada clase

**Sin IA:** cada clase tiene su **`CLASE-GUIADA.md`**: la clase completa, como si un profesor la diera, con pausas de "✋ Para y piensa", prácticas de verdadero o falso, elegir y escribir (hay que acertar todas para prender el bombillo 💡 de la parte) y la simulación de entrevista. En el mapa (`index.html`) es la primera pestaña de cada clase. La `LECCION.md` queda como resumen. En la clase 19 (agentes) la lección misma es la clase completa, con los ejemplos en JavaScript y en Python.

**Certificados verificables:** cada curso (programación, seguridad, IA para programadores y agentes de IA) tiene el suyo. Hay que entrar con una cuenta de Gmail verificada (`#/entrar`): así cada bombillo queda en Firebase con la hora del servidor, y al completar todas las partes se emite el certificado con un código (`ME-…`, `SE-…`, `IA-…` o `AG-…`) que cualquiera comprueba en `#/verificar/CÓDIGO`. Cómo funciona por dentro: clase 21 y `firebase/LEEME.md`. Lo emite el propio curso; no es un título oficial.

**Con una IA:** sigue los pasos de abajo y [AGENTS.md](AGENTS.md).

1. **Leer la lección por partes**, con la IA, sin adelantarse.
2. **Hacer los ejercicios sin mirar las respuestas.** Equivocarse es parte de aprender.
3. **Mandarle las respuestas a la IA** para que las corrija.
4. **Explicarlo en voz alta** como si fuera una entrevista. Si no puedo explicarlo, vuelvo a leer.
5. **Anotar el avance** en [PROGRESO.md](PROGRESO.md) y pasar a la siguiente.

**Una clase por día es suficiente.** Es mejor entender una que leer cinco.

## La regla de oro

En estas clases **yo escribo el código** y la IA me guía y me corrige. Si la
IA lo escribe todo, la app avanza pero yo no aprendo.
