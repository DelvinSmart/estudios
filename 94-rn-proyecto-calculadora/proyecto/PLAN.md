# Plan: la calculadora

> Escrito **antes** del código. Cada sesión con la IA empieza leyendo este archivo (y `AGENTS.md`).

## 1. El problema

Hacer una app de verdad, de principio a fin, que se pueda **instalar en el teléfono** (Android y iPhone, con un solo
código) y que esté hecha **como se hace en el trabajo**: plano, motor de diseño, lógica con pruebas, pantalla que solo dibuja.
Una calculadora es el proyecto perfecto: todos saben cómo tiene que funcionar, así que cada error se nota.

## 2. Lo que hace

- Las cuatro operaciones: sumar, restar, multiplicar y dividir.
- Coma decimal y punto de miles, como en Brasil: `1.234,5`.
- `C` borra todo; `⌫` borra el último número escrito.
- `%`: en una suma o resta es el porcentaje **del primer número** (`200 + 10 %` → `20`, y `=` da `220`). En una
  multiplicación o división, divide entre 100.
- `±` cambia el signo.
- Modo oscuro y claro, según el teléfono.

## 3. Lo que NO hace (por ahora)

- Paréntesis, raíces, funciones científicas.
- Historial de cuentas.
- Guardar nada en el teléfono.
- Teclado físico.

## 4. Las decisiones de las cuentas

| Caso | Qué decidimos |
|---|---|
| `2 + 3 × 4` | De izquierda a derecha, como una calculadora de bolsillo: `20`. Al tocar `×`, ya muestra `5` |
| `0,1 + 0,2` | `0,3`, no `0,30000000000000004`: los resultados se redondean a 12 cifras significativas |
| Dividir entre 0 | "No se puede dividir entre 0". Cualquier número que se toque después empieza de nuevo |
| Más de 12 cifras escritas | No se agregan más |
| Un resultado de 12 cifras o más | "El número es muy grande" |
| Dos operadores seguidos (`5 + ×`) | Vale el último: `5 ×` |
| `5 + =` | Usa el mismo número: `10` |
| `=` otra vez | No hace nada |
| Una coma de más (`1,2,`) | Se ignora |
| `⌫` después de un resultado | No hace nada (el resultado no se "escribió") |
| Empezar con coma | `,5` es `0,5` |

## 5. Las piezas

| Pieza | Archivo | Su única tarea |
|---|---|---|
| La lógica | `src/logica/calculadora.ts` | El estado de la calculadora y qué pasa con cada tecla. Sin pantalla |
| El teclado como datos | `src/logica/teclado.ts` | Qué teclas hay, en qué orden, de qué tipo y cómo se leen en voz alta |
| El motor de diseño | `src/tema/motor.ts` | Colores (oscuro y claro), separaciones, formas y letras |
| Una tecla | `src/componentes/Tecla.tsx` | Dibujar un botón que llama al motor |
| El visor | `src/componentes/Visor.tsx` | Mostrar el número, achicando la letra si es largo |
| La pantalla | `src/pantallas/PantallaCalculadora.tsx` | Juntar las piezas: el estado, el visor y el teclado |

La pantalla nunca calcula; la lógica nunca dibuja. **No se usa `eval`**: la calculadora hace sus cuentas con su propio código.

## 6. Cómo sé que funciona

- `npm test` en verde: la lógica, con los casos de la sección 4, y la pantalla tocando las teclas.
- `npm run tipos` sin errores.
- En el navegador (`npm run web`) y en el teléfono (Expo Go): `0,1 + 0,2 =` da `0,3`; `200 + 10 % =` da `220`;
  `1 ÷ 0 =` avisa.
- En una pantalla chica (iPhone SE) las teclas entran sin moverse de lado.

## Cambios al plan

_(cada cambio con su fecha y su motivo)_

- **2026-11-18 · Cómo sé que funciona:** el tamaño de la letra del visor depende también del **ancho** de la pantalla,
  no solo del largo del número. **Motivo:** mirando la app en 320 de ancho (iPhone SE), `-0,333333333333` salía
  cortado con "…". `adjustsFontSizeToFit` solo funciona en el iPhone; en Android y en la web hay que calcularlo.
