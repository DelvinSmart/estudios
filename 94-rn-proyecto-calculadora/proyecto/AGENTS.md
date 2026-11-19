# Reglas para la IA en este proyecto

Lee `PLAN.md` antes de empezar. Lo que no está en el plan, se pregunta.

## Comandos

- `npm test`: las pruebas (Jest con jest-expo y Testing Library).
- `npm run tipos`: TypeScript revisa todo, en modo estricto.
- `npm run web`: la app en el navegador. `npm start`: con Expo Go en el teléfono.

## Reglas

- TypeScript estricto. Nada de `any`.
- **Nunca `eval`** ni `new Function`: las cuentas las hace `src/logica/calculadora.ts`.
- La lógica no importa nada de React ni de React Native. La pantalla no hace cuentas.
- Ningún color, separación, forma ni tamaño de letra escritos a mano fuera de `src/tema/motor.ts`.
- Cada regla de la sección 4 del plan, con su prueba **antes** del código. Nunca borres una prueba para que pase.
- Cada tecla con su `accessibilityLabel` en español (se lee en voz alta para quien no ve la pantalla).
- No agregues paquetes sin preguntar.
- No hagas commit ni push: eso lo decide la persona.
