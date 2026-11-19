# Plan: la calculadora en Kotlin (Android nativo)

> La **misma** calculadora de las clases 94 y 95 (React Native), ahora nativa en Android con Kotlin y Compose.
> Escrito antes del código. El objetivo es **comparar**: mismas decisiones, mismas pruebas, otro lenguaje.

## 1. Lo que hace y lo que NO hace

Igual que la de React Native (`../../94-rn-proyecto-calculadora/proyecto/PLAN.md`, secciones 2 y 3):
las cuatro operaciones, coma decimal y punto de miles, `C`, `⌫`, `%`, `±`, modo claro y oscuro.
Sin paréntesis, sin historial, sin guardar nada.

## 2. Las decisiones de las cuentas

**Las mismas, una por una** (sección 4 del plan de React Native): de izquierda a derecha, `0,1 + 0,2 = 0,3`,
dividir entre 0 avisa, 12 cifras como máximo, dos operadores seguidos vale el último, `5 + =` da `10`, `=` otra vez
no hace nada, `⌫` después de un resultado no hace nada, `200 + 10 %` es `20`.

Una sola diferencia **de cómo**, no de qué: Kotlin tiene `BigDecimal`, que guarda los decimales **exactos**
(`0,1` es `0,1` de verdad). Entonces `0,1 + 0,2` da `0,3` sin redondear; el redondeo a 12 cifras queda solo para
la división (`1 ÷ 3`).

## 3. Las piezas

| Pieza | Archivo | Igual que en React Native |
|---|---|---|
| La lógica | `logica/Calculadora.kt` | `src/logica/calculadora.ts` |
| El teclado como datos | `logica/Teclado.kt` | `src/logica/teclado.ts` |
| El motor de diseño | `tema/Motor.kt` | `src/tema/motor.ts` |
| El estado de la pantalla | `pantalla/CalculadoraViewModel.kt` | el `useState` de la pantalla |
| La pantalla | `pantalla/PantallaCalculadora.kt` | `Tecla.tsx`, `Visor.tsx` y `PantallaCalculadora.tsx` |

## 4. Cómo sé que funciona

- `./gradlew test` en verde: las **mismas** pruebas de la lógica, del teclado y del motor, escritas en JUnit.
- En el emulador de Android: `0,1 + 0,2 =` da `0,3`; `200 + 10 % =` da `220`; `1 ÷ 0 =` avisa; el número
  largo entra en una pantalla chica; cada tecla tiene su nombre en español para TalkBack.

## Cambios al plan

_(cada cambio con su fecha y su motivo)_

- **2026-11-19 · Las piezas:** la app se llama "Calculadora Kotlin" y su identidad es `com.tuusuario.calculadorakotlin`.
  **Motivo:** con la misma identidad que la de React Native, Android no dejó instalarla
  (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`): cree que una es la versión nueva de la otra, firmada por otra persona.
