# Informe: cómo se arregló Copiloto Driver

**Fechas:** 4 y 5 de noviembre de 2026
**Trabajo:** dirigido por Delvin, con el código hecho por Claude. Delvin decidió las prioridades, pidió los cambios y probó la app.
**Una forma corta de contarlo:** una app publicada era lenta, y al medir en vez de adivinar se encontraron las causas reales. Después se ordenó el código y se añadieron revisiones automáticas para que esos errores no volvieran.

## 1. Resultado en números

| Qué | Antes | Después |
|---|---|---|
| Tiempo hasta ver el Início en un Samsung A31 | 17,7 s | ~6,3 s |
| Traba de Firebase al abrir | ~6 s | 2,3 s |
| Pruebas de la app | 0 | 104 |
| Pruebas del backend | 131 | 133 |
| Pruebas de reglas de Firestore | 0 | 21 |
| Pruebas Kotlin dentro de la revisión automática | No | 61 |
| Botones sueltos sin motor | 112 | 0 |
| Ciclos entre archivos | 22 | 0 |
| Archivos TypeScript de más de 1.000 líneas | 7 | 0 |
| Revisión automática en cada subida | No | 5 trabajos |

Los tiempos se midieron en un teléfono real. Pueden variar según la red y el estado del teléfono.

## 2. El problema de la lentitud

### Cómo se investigó
Primero supusimos causas, y varias suposiciones fueron falsas. Lo que funcionó fue medir, en este orden:

1. **Marcas de tiempo** en el arranque, para ver dónde se iba el tiempo.
2. **Detector de trabas:** un temporizador cada 50 ms. Si tardaba mucho más, el hilo de JavaScript estaba bloqueado.
3. **Cronómetro por módulo,** para saber qué archivo tardaba al cargar.
4. **Perfilador de Hermes,** que muestra en qué función se gasta cada milisegundo.

### Causas reales

| Causa | Costo medido | Arreglo |
|---|---|---|
| Se ordenaban 254 ciudades al abrir, comparando con `localeCompare` | 4,8 s | Dejar la lista ya ordenada en el archivo |
| Un reloj actualizaba el Início cada segundo, aunque se ve solo HH:MM | ~1,1 s por redibujo | Actualizar solo al cambiar el minuto |
| El gráfico recalculaba 365 días en cada dibujo | ~8 s en 25 s | Dependencias estables en `useMemo` e índice por plataforma y día |
| Un formateador de fecha nuevo cada vez | ~5 ms cada uno | Una fábrica única con caché: `dateFormat` |
| Firestore comparaba letra por letra partes iguales de cada ruta | ~6 s con 736 documentos | Parche de 1 línea en el SDK: `if (e === t) return 0` |

### La idea más importante
Antes de medir, yo sospechaba que la pantalla inicial esperaba a la nube. **Era falso.** La pista fue un temporizador de 3,5 s que saltó a los 5,5 s: un temporizador solo se atrasa si el hilo está ocupado. Por eso el arreglo correcto no era tocar la red.

## 3. Respuesta inmediata al tocar

- La burbuja de la barra ahora se mueve en el mismo toque, y la pantalla cambia en el cuadro siguiente.
- El menú se desliza al tocar volver, sin esperar a redibujar el Início.
- El botón atrás de Android cierra el menú.
- El encogido de la barra usa un resorte más corto.

## 4. Pantalla del San
Si fallaba la carga, aparecía el botón de crear un San, como si no existieran datos. Ahora hay tres estados distintos:

| Estado | Qué se ve |
|---|---|
| Cargando | Indicador de carga |
| Falló | Solo el aviso y el botón Recargar |
| Cargó y no hay datos | El botón de crear |

Esa pieza quedó reutilizable: `LoadFailedCard`.

## 5. El plan de 7 puntos

### Punto 1: pruebas de dinero
Se crearon 92 pruebas basadas en las reglas del negocio, como "Uber cierra el día a las 04:00". Para comprobar que servían, se metieron 19 errores a propósito, y las pruebas detectaron los 19.

Las pruebas encontraron dos errores reales:
- **Uber en doble:** una cuenta con `Uber` y `uber` el mismo día sumaba el doble.
- **"Ontem" igual a "Hoje":** pasaba con Uber entre las 00:00 y las 03:59.

También se unificó el uso del día fiscal guardado en cada registro.

### Punto 2: revisión automática (CI)
Cada subida a GitHub revisa sola tipos, diseño, secretos y pruebas. Al probar en una copia limpia apareció un fallo invisible en la Mac: TypeScript revisaba el panel sin tener sus dependencias.

### Punto 3: botones
Los 112 `Pressable` sueltos pasaron al motor `Touchable`. Además, un solo control del panel maneja la reacción al toque en Android y iPhone.

### Punto 4: tema claro
Las 21 condiciones `isLightTheme` de las pantallas pasaron a tokens. Se añadieron al panel 4 colores y 3 intensidades, con candados de contraste.

### Punto 5: ciclos
De 22 a 0. Nueve eran falsos: solo importaban un tipo. Los demás se resolvieron moviendo funciones a archivos nuevos, sin cambiar los cálculos.

### Punto 6: archivos gigantes
Siete archivos bajaron de 1.000 líneas, moviendo bloques enteros a hooks y componentes.

### Punto 7: proveedores anidados
Sigue pendiente. Hoy no causa un problema visible.

## 6. Revisión posterior
Una revisión completa encontró 15 problemas: 14 corregidos y 1 en parte. Entre ellos:
- La IA y los textos usaban "motorista" o "conductor".
- Había vulnerabilidades críticas y altas en dependencias.
- `aiTools.ts` tenía 2.019 líneas.
- Las reglas de Firestore no tenían pruebas.

El detalle está en `material/INFORME_REVISION_2026-11-05.md`.

## 7. Errores cometidos en el camino
Esta parte es de las más útiles para explicar el proyecto con honestidad.

| Error | Qué pasó | Lección |
|---|---|---|
| Arreglar el splash sin medir | El cambio no hacía nada | Medir antes de tocar |
| `freezeOnBlur` | La barra de navegación desapareció | Una optimización también puede romper cosas |
| Forzar long polling en Firestore | Fue peor | Probar y revertir si empeora |
| Medir con el teléfono bloqueado | Salieron datos falsos | Comprobar primero las condiciones de la prueba |
| Actualizar Firebase con `npm audit fix` | Dejó de aplicarse el parche | Fijar las versiones parcheadas |
| Dos copias de `@firebase/app` | La vc89 se quedaba en el logo en iPhone | Compilar no significa funcionar: hay que abrir la app |
| Dibujo con cables inventados | El nudo no salía del código | Un diagrama debe venir de datos reales |

## 8. Por qué el mapa final se hizo con código
Las IA de imágenes dibujaron bonito, pero no lograron conectar bien los cables. Se generó con código porque un mapa técnico debe ser exacto, y así cada cable sale de datos medidos con `madge`.

## 9. Lo que falta
El deploy y la app ya están publicados, según confirmó Delvin. Lo que queda:

- Probar el flujo completo en el iPhone y el Samsung.
- Dividir `RideReaderService.kt` (1.585 líneas) y `RideOverlayWindow.kt` (1.292).
- Revisar las 22 vulnerabilidades moderadas.
- Subir la cobertura de pruebas por etapas.
- Decidir el punto 7 y la unión con `main`.

## 10. Commits

| Commit | Qué incluye |
|---|---|
| `94f1798` | Arranque, toques y San |
| `44e221d` | Pruebas de dinero y sus correcciones |
| `44cf17a` | Revisión automática |
| `b3c4608` | Todos los botones en el motor |
| `a45c98e` | Tema claro en tokens y panel |
| `c4b6e84` | Cero ciclos y archivos divididos |
| `9972c11` | Revisión completa |
| `e0811d7` | Resultado final de la revisión |
| `63ccfca` | versionCode 90 |

## 11. Cómo explicarlo en una entrevista

**En 30 segundos:**
> Mi app tardaba casi 18 segundos en abrir en un teléfono de gama media. En vez de adivinar, medí con un perfilador y encontré las causas: un ordenamiento al arrancar, un redibujo por segundo, un gráfico que recalculaba todo y una comparación lenta en Firestore. Bajó a unos 6 segundos. Después añadí pruebas, encontré dos errores reales de dinero y dejé revisiones automáticas para que no volvieran.

**Si te preguntan cómo usaste IA:**
> La usé para programar más rápido, pero yo dirigía, probaba en teléfonos reales y decidía qué aceptar. Aprendí a exigir medidas y a no dar nada por bueno sin verlo funcionando.

Di solo lo que puedas explicar. Por eso existe la guía de estudio.
