# Firebase del Mapa de estudios

Proyecto: **mapa-estudios-ds** (separado de Copiloto). Solo sirve para que los certificados se puedan **verificar**.

Datos: `cursos/{curso}/progreso/{uid}`, `cursos/{curso}/emitidos/{uid}` y `certificados/{codigo}`. Solo cuentas de Gmail con el correo verificado.

| Archivo | Para qué |
|---|---|
| `reglas.plantilla` | Las reglas de seguridad, escritas a mano. **Edita esta.** |
| `generar-reglas.mjs` | Arma `firestore.rules` metiendo la lista real de las partes. |
| `firestore.rules` | Lo que se sube a Firebase (generado, no lo edites a mano). |
| `partes.mjs` | Lee los `.md` y lista los ids de todas las partes. |
| `pruebas/reglas.test.mjs` | 31 pruebas: las trampas tienen que fallar y lo correcto tiene que pasar. |
| `funciones/index.js` | La función que manda los correos de la cuenta (verificar y contraseña nueva). |
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
- ⚠️ Las respuestas de las prácticas están en los `.md`, que son públicos. Alguien con paciencia podría copiarlas
  (aunque igual tendría que esperar 60 s por cada una de las 229 partes, casi 4 horas). Cerrar eso del todo
  exige corregir las prácticas en el servidor (Cloud Functions).
