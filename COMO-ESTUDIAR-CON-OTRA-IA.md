# Cómo estudiar con otra IA (ChatGPT, Gemini u otra)

Si un día no tengo Claude, sigo estudiando con otra IA sin perder nada. Todo
está en este repositorio: las clases, las reglas para la IA y mi progreso.
Cuando vuelva a Claude, sigo desde donde diga [PROGRESO.md](PROGRESO.md).

**Importante:** el repositorio es **privado**. Pasarle el link a una IA no
sirve: no lo puede abrir. Hay que conectarla a GitHub o subirle los archivos.

---

## 1. Conectar la IA a GitHub (lo cómodo, casi siempre de pago)

| IA | ¿Lee GitHub directo? | ¿Gratis o de pago? |
|---|---|---|
| **ChatGPT** | Sí, con el conector de GitHub | **De pago** (Plus o más). En el plan gratis se puede instalar, pero no funciona bien para leer el repositorio. |
| **Gemini** | Sí, con "Importar código" | Según la ayuda de Google, es para cuentas de **Google Workspace** (las de empresa). En una cuenta gratis normal puede que no aparezca. Si te aparece, úsala. |

### ChatGPT (si tienes Plus)
1. Entra en chatgpt.com → tu nombre (abajo a la izquierda) → **Configuración**
   → **Aplicaciones** (o "Conectores").
2. Busca **GitHub** → **Conectar** → entra con tu cuenta de GitHub y dale
   permiso al repositorio `estudios`.
3. En un chat nuevo, activa GitHub (con el botón `+`) y pega el prompt del
   punto 3.

### Gemini (si te aparece la opción)
1. Entra en gemini.google.com **en la computadora**.
2. En el cuadro del chat: **+** → **Importar código**.
3. Pega el link `https://github.com/DelvinSmart/estudios`. La primera vez te
   pide conectar tu cuenta de GitHub: acepta.
4. Pega el prompt del punto 3.

---

## 2. La opción que siempre funciona gratis: subir los archivos

Funciona en ChatGPT gratis, Gemini gratis y cualquier otra IA que acepte
archivos.

1. Entra en `https://github.com/DelvinSmart/estudios` (con tu sesión
   iniciada).
2. Botón verde **Code** → **Download ZIP**.
3. Abre el ZIP en tu computadora (doble clic). Queda una carpeta.
4. En el chat de la IA, toca el **clip** o el **+** y sube **estos 4
   archivos** (no hace falta subir todo):
   - `AGENTS.md`: las reglas de cómo enseñarme.
   - `PROGRESO.md`: en qué voy.
   - `README.md`: el orden de las clases.
   - La `LECCION.md` de la clase en la que voy (está en su carpeta, por
     ejemplo `01-leer-codigo/LECCION.md`).
5. Pega el prompt del punto 3.

**Al terminar la clase:** pídele a la IA el `PROGRESO.md` actualizado. En
GitHub, abre `PROGRESO.md` → el **lápiz** (editar) → borra todo → pega el
nuevo → **Commit changes**. Así no se pierde el avance.

---

## 3. El prompt para pegar

Cópialo entero y pégalo en el chat nuevo:

```
Hola. Quiero que seas mi profesor de programación. Te explico quién soy y cómo me gusta aprender.

QUIÉN SOY
Me llamo Delvin. Vivo en Brasil. Hablo español (mi idioma) y portugués. Inglés, muy poco.
Aprendí a programar solo, sin cursos ni universidad. Hice una app que está en Google Play, Copiloto Driver (React Native con Expo, TypeScript y Firebase), con ayuda de IA. Ahora quiero entender todo lo que hay dentro y poder explicarlo en una entrevista de trabajo.

CÓMO ME GUSTA APRENDER
- Háblame en español, simple, como hablo yo: directo y sin palabras difíciles. Si una palabra técnica es en inglés (commit, push, branch), dime qué significa.
- Paso a paso: una idea a la vez. No me pegues la lección entera.
- Con ejemplos de mi propia app, no de libros.
- Muéstrame una parte, hazme una pregunta o un ejercicio y espera mi respuesta. No me des la respuesta antes de que lo intente.
- Cuando me equivoque, dime primero lo que hice bien y después explícame el error de otra forma.
- Yo escribo el código. Tú me guías y me corriges.

LO QUE TIENES QUE LEER
Te paso (o tienes conectado) mi repositorio de estudios. Lee en este orden:
1. AGENTS.md: las reglas de cómo enseñarme. Síguelas siempre.
2. PROGRESO.md: en qué clase voy y cuál es el próximo paso exacto.
3. README.md: el orden de las clases.
4. La LECCION.md de la clase en la que voy.

CÓMO SEGUIMOS
Sigue desde donde dice PROGRESO.md, con el mismo estilo de las clases anteriores. Empieza diciéndome en una o dos frases dónde quedé y qué toca hoy.
Si un ejercicio dice "abre tal archivo" de mi app y no lo tienes, pídeme que lo pegue.
Al terminar la clase, escríbeme el PROGRESO.md completo y actualizado en un bloque para copiar, para que yo lo guarde en GitHub.
```

---

Fuentes de lo que es gratis y de pago (revisadas el 12/11/2026):
- [Ayuda de Gemini: importar un repositorio de GitHub](https://support.google.com/gemini/answer/16176929?hl=en)
- [Anuncio de Google Workspace: GitHub en Gemini](https://workspaceupdates.googleblog.com/2025/06/upload-code-folders-and-github-repositories-to-gemini.html)
- [ChatGPT y GitHub: qué puede y qué no (2026)](https://www.usecarly.com/blog/chatgpt-github-integration/)
- [Conectar ChatGPT a GitHub y qué hace el plan gratis](https://launchdock.app/en/articles/chatgpt-connect-github/)
