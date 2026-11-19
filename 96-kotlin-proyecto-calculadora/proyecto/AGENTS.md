# Reglas para la IA en este proyecto

Lee `PLAN.md` antes de empezar. Lo que no está en el plan, se pregunta.

## Comandos

- `./gradlew test`: las pruebas (JUnit), sin teléfono.
- `./gradlew assembleDebug`: arma la app. `./gradlew installDebug`: la instala en el emulador o el teléfono conectado.

## Reglas

- Kotlin y Jetpack Compose. No agregues librerías sin preguntar.
- Las decisiones de las cuentas son las de `PLAN.md`: no las cambies sin cambiar el plan.
- La lógica (`logica/`) no importa nada de Android ni de Compose: es Kotlin puro y se prueba sin teléfono.
- Ningún color, separación, forma ni tamaño de letra escritos a mano fuera de `tema/Motor.kt`.
- Cada tecla con su descripción en español para TalkBack (`contentDescription`).
- Cada regla, con su prueba **antes** del código. Nunca borres una prueba para que pase.
- No hagas commit ni push: eso lo decide la persona.
