# Firebase del Mapa de estudios

Proyecto: **mapa-estudios-ds** (separado de Copiloto). Solo sirve para que el certificado se pueda **verificar**.

| Archivo | Para qué |
|---|---|
| `reglas.plantilla` | Las reglas de seguridad, escritas a mano. **Edita esta.** |
| `generar-reglas.mjs` | Arma `firestore.rules` metiendo la lista real de las partes. |
| `firestore.rules` | Lo que se sube a Firebase (generado, no lo edites a mano). |
| `partes.mjs` | Lee los `.md` y lista los ids de todas las partes. |
| `pruebas/reglas.test.mjs` | 24 intentos de hacer trampa; todos tienen que fallar. |

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
