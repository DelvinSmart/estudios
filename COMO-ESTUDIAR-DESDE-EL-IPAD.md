# Cómo estudiar desde el iPad (o el celular), sin la Mac

Las clases y el código no viven solo en la Mac: están en GitHub.

| Qué | Dónde |
|---|---|
| Este curso (lecciones y progreso) | `github.com/DelvinSmart/estudios` (privado) |
| El código de Copiloto Driver (app y web) | `github.com/DelvinSmart/copiloto-driver`, rama **`feature/smart-camera`** (la de `main` es vieja, de agosto, y no tiene la web) |

Con **Claude en la nube** (claude.ai → Code), Claude abre esos repositorios en una computadora de la nube: lee las lecciones, abre el código del app y guarda el progreso en GitHub. La Mac puede estar apagada.

---

## Preparar el iPad (una sola vez)

1. **Abre claude.ai** en Safari (o el app de Claude) y entra con tu cuenta.
2. Ve a **Code**.
3. **Conecta GitHub** cuando te lo pida. GitHub te va a pedir el código de tu teléfono.
4. GitHub pregunta **a qué repositorios** le das acceso. Elige solo estos dos:
   - `estudios`
   - `copiloto-driver`
5. Listo. A partir de aquí, cada clase se empieza igual (abajo).

## Empezar una clase

1. En **Code**, toca **Nueva sesión**. Abajo del cuadro de texto, en el botón de los repositorios, revisa que estén `estudios` y `copiloto-driver`, y que **`copiloto-driver` use la rama `feature/smart-camera`**, no `main`.
2. Pega este mensaje:

```text
Soy Delvin. Vamos a estudiar. Lee AGENTS.md completo, después PROGRESO.md y README.md, y la LECCION.md del tema en que voy. Sígueme las reglas de AGENTS.md: una parte por vez, yo respondo y tú me corriges. Cuando necesites ver código del app, ábrelo del repositorio copiloto-driver, rama feature/smart-camera (solo leer). Al terminar, actualiza PROGRESO.md y guárdalo en GitHub.
```

3. Claude te saluda, te dice dónde quedaste y empieza la clase.

## Reglas para no romper nada

- **En las clases, el código del app solo se lee.** Si un ejercicio pide cambiar algo (Temas 03 y 05), se hace en una rama aparte, nunca en la rama del app.
- **El progreso sí se guarda solo**, en el repositorio `estudios` (así lo dice `AGENTS.md`).
- **Si la sesión se corta**, abre otra y pega el mismo mensaje: Claude retoma desde `PROGRESO.md`.

## Lo que sigue necesitando la Mac

Abrir la web en `localhost`, generar el .aab, instalar el app en el iPhone y usar el simulador. Para estudiar, nada de eso hace falta.
