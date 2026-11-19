# Firebase del Mapa de estudios

Proyecto: **mapa-estudios-ds** (separado de Copiloto). Solo sirve para que los certificados se puedan **verificar**.

Datos: `cursos/{curso}/progreso/{uid}`, `cursos/{curso}/emitidos/{uid}` y `certificados/{codigo}`. Solo cuentas de Gmail con el correo verificado.

| Archivo | Para qué |
|---|---|
| `reglas.plantilla` | Las reglas de seguridad, escritas a mano. **Edita esta.** |
| `generar-reglas.mjs` | Arma `firestore.rules` metiendo la lista real de las partes. |
| `firestore.rules` | Lo que se sube a Firebase (generado, no lo edites a mano). |
| `partes.mjs` | Lee los `.md` y lista los ids de todas las partes. |
| `pruebas/reglas.test.mjs` | 41 pruebas: las trampas tienen que fallar y lo correcto tiene que pasar. |
| `practicas.mjs` | Lee las prácticas de todas las clases (qué bloques hay y en qué parte). |
| `separar-respuestas.mjs` | Saca las respuestas de los `.md` y las guarda en `funciones/respuestas.json` (**privado**, en `.gitignore`). |
| `pruebas/integracion.test.mjs` | De punta a punta con los emuladores: fallar, esperar, aprobar en el servidor y prender el bombillo. |
| `funciones/index.js` | Las dos funciones: `corregirPractica` (corrige con las respuestas privadas) y `enviarCorreoCuenta` (los correos de la cuenta). |
| `funciones/corregir.js` | La lógica de corregir: al fallar no da la respuesta; espera de 15 s; topes por día. |
| `funciones/correos.js` | El diseño de esos correos. |
| `funciones/limites.js` | Los topes: 1 por minuto y 5 por día por persona; 250 de verificación y 150 de contraseña por día en todo el sitio, **separados**, para que abusar de uno no bloquee el otro. |

Pruebas de la función: `cd firebase/funciones && npm test`. Para subirla: `firebase deploy --only functions`.

## Si agregas o quitas partes (títulos `##`) de una clase

```bash
node firebase/generar-reglas.mjs
cd firebase/pruebas && npm install && JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH npm test
cd .. && firebase deploy --only firestore:rules
```

Si no lo haces, las reglas siguen esperando el número viejo de partes y nadie podrá completar el curso.

## Qué protege y qué no

- ✅ Nadie puede prender bombillos desde la consola del navegador: el servidor pone la hora, acepta uno a la vez y exige 60 s entre uno y otro.
- ✅ Nadie puede inventar un código: la página `#/verificar/CÓDIGO` lo busca en el servidor.
- ✅ Nadie puede cambiar el nombre ni las fechas de un certificado ya emitido.
- ✅ Las respuestas de las prácticas ya no están en los `.md`: las corrige `corregirPractica` con un archivo privado,
  y las reglas solo dejan prender el bombillo de una parte con práctica si el servidor la aprobó.
- ⚠️ El historial de Git todavía guarda las respuestas de antes de este cambio.
- ⚠️ `funciones/respuestas.json` vive solo en este disco: **ten un respaldo** fuera de GitHub (si se pierde, se pierden las respuestas).

## Si escribes prácticas nuevas

```bash
node firebase/separar-respuestas.mjs            # saca las respuestas de los .md al archivo privado
node firebase/separar-respuestas.mjs --revisar  # tiene que decir "✓ todo en orden"
node firebase/generar-reglas.mjs
cd firebase/funciones && npm test
cd ../pruebas && JAVA_HOME=/opt/homebrew/opt/openjdk@21 PATH=/opt/homebrew/opt/openjdk@21/bin:$PATH npm test && npm run integracion
cd .. && firebase deploy --only functions:corregirPractica,firestore:rules
```
