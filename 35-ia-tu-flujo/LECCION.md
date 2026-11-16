# IA 6: tu flujo de trabajo, de la idea a lo publicado

> 🌎 **En la vida real:** un chef no improvisa cada noche: tiene su forma de trabajar (preparar, cocinar, probar, servir), y por eso sale bien aunque haya mucha gente.

> 🎙️ **El profesor dice:** la última clase del curso **IA para programadores** junta todo en un flujo que puedes repetir siempre, con un ejemplo real: cómo se hizo el certificado verificable de este mapa. Y una pregunta importante para el final: cómo seguir **aprendiendo de verdad** mientras la IA hace tanto por ti.

## Parte 1. El flujo en siete pasos

> 🌎 **En la vida real:** es como la receta de siempre de tu mamá: los mismos pasos, en el mismo orden, y sale igual de buena cada vez.

> 🌎 **Otro ejemplo:** Es como el ritual antes de un viaje: maleta, documentos, revisar la casa, salir.

### Los pasos

1. **Idea con tus palabras.** Qué quieres y por qué (puedes contársela a Gemini o a Claude en el chat).
2. **Pedido claro.** Contexto, tarea, límites, terminado (IA 2).
3. **Plan.** Para lo grande, la IA propone y tú apruebas.
4. **Cambio chico.** Una parte a la vez.
5. **Revisión.** Diff, pruebas, pantalla, seguridad (IA 5).
6. **Guardar.** Commit con un mensaje que diga qué cambió.
7. **Publicar.** Push, y comprobar que lo publicado funciona (Tema 20).

> 🌎 **En la vida real:** es como lavar ropa: separar, lavar, enjuagar, secar, doblar. Si te saltas el enjuague, se nota.

> 🌎 **Otro ejemplo:** Es como armar un rompecabezas: primero los bordes, después por colores, al final el centro.

### Dónde se te escapa el tiempo

El tiempo no se pierde escribiendo código (eso lo hace rápido la IA): se pierde en **pedidos confusos**, **cambios gigantes** que no se pueden revisar y **arreglos sin probar** que rompen otra cosa. Los pasos 2, 4 y 5 son los que más ahorran.

> 🌎 **En la vida real:** en un viaje, el tiempo se pierde perdiéndose, no manejando.

> 🌎 **Otro ejemplo:** Es como cocinar sin leer la receta: terminas yendo tres veces al mercado.

```practica
vf :: El tiempo se pierde sobre todo escribiendo código
vf :: Después de publicar hay que comprobar que lo publicado funciona
elige :: ¿Qué paso va justo antes de guardar con un commit? :: Publicar :: Revisar (diff, pruebas, pantalla, seguridad) :: Tener la idea
elige :: Para un cambio grande, ¿qué viene después del pedido? :: Publicar :: El plan, que tú apruebas :: Borrar todo
escribe :: Escribe los siete pasos del flujo de memoria. :: Idea con mis palabras, pedido claro, plan, cambio chico, revisión, guardar con commit y publicar comprobando que funciona.
```

## Parte 2. Un ejemplo real: el certificado verificable

> 🌎 **En la vida real:** aprender a cocinar viendo a alguien hacer un plato de verdad enseña más que leer diez recetas.

> 🌎 **Otro ejemplo:** Es como ver la repetición de un gol en cámara lenta: ves cada movimiento.

### Cómo fue, paso a paso

1. **Idea:** "que un reclutador pueda comprobar que de verdad terminé el curso".
2. **Pedido y plan:** se analizó como atacante (¿cómo lo falsificaría alguien?) y se propuso Firebase con reglas.
3. **Cambios chicos:** primero las reglas; después el progreso en la nube; después el certificado; después la página de verificar; después el login con correo.
4. **Revisión:** cada trampa se escribió como prueba; una prueba falló y así se encontró el problema del punto en los ids (Tema 21).
5. **Guardar y publicar:** un commit por paso, despliegue de las reglas, y comprobar en el sitio publicado que un código inventado dice "no existe".
6. **Correcciones tuyas:** "que solo sea Gmail", "sin teléfono", "que el correo tenga la cara del sitio", "que después de entrar vaya al mapa". Cada una, un cambio chico más.

> 🌎 **En la vida real:** es como construir una casa por etapas: cimientos, paredes, techo, y el dueño pide cambios en cada visita.

> 🌎 **Otro ejemplo:** Es como un sastre: primera prueba, ajuste, segunda prueba, ajuste, entrega.

### Lo que hiciste tú y lo que hizo la IA

La IA escribió el código, las pruebas y las clases. **Tú** decidiste qué se quería, revisaste cada pantalla, encontraste lo que no te gustaba (los colores, el espacio, el correo en inglés) y aprobaste cada paso que tocaba tu cuenta (Firebase, el Gmail, las claves). Esa parte no la hace la IA: es la del dueño del producto.

> 🌎 **En la vida real:** el arquitecto no pone ladrillos, pero sin él la casa no tiene sentido.

> 🌎 **Otro ejemplo:** Es como un director de cine: no actúa, pero decide cada toma.

```practica
vf :: En el certificado verificable, cada trampa se convirtió en una prueba automática
vf :: En un proyecto hecho con IA, la persona no hace nada importante
elige :: ¿Qué se hizo primero en el certificado verificable? :: El diseño del correo :: Las reglas de seguridad :: El botón de LinkedIn
elige :: ¿Qué pasos le tocaron solo a la persona? :: Escribir las reglas :: Crear la contraseña de aplicación y pegar las claves en la terminal :: Escribir las pruebas
escribe :: Elige una mejora para tu sitio y escríbela como los pasos del flujo. :: Por ejemplo: idea, que Mi progreso tenga un botón para volver a donde estaba; pedido claro con el archivo y cómo se ve terminado; cambio chico; revisar en computadora y celular; commit; publicar y comprobar en el sitio.
```

## Parte 3. Aprender de verdad mientras la IA trabaja

> 🌎 **En la vida real:** si siempre te llevan en carro, nunca aprendes el camino. El día que tengas que ir solo, te pierdes.

> 🌎 **Otro ejemplo:** Es como la calculadora en el colegio: útil, pero si no sabes multiplicar, no te das cuenta cuando el resultado es absurdo.

### El riesgo: depender sin entender

La IA te deja hacer cosas que todavía no sabes hacer. Eso es bueno para avanzar, pero si nunca entiendes lo que hace, no vas a poder **revisarlo** (IA 5), ni explicarlo en una entrevista, ni arreglarlo el día que la herramienta no esté. Por eso este mapa tiene **clases guiadas** con prácticas: para que puedas estudiar sin IA.

> 🌎 **En la vida real:** es como un piloto que solo sabe volar con piloto automático: el día que falla, no sabe aterrizar.

> 🌎 **Otro ejemplo:** Es como hablar un idioma solo con el traductor del celular: funciona hasta que se acaba la batería.

### Usar la IA como profesor

Pídele que **te explique**, no solo que haga: "explícame esta línea", "¿por qué elegiste esto y no aquello?", "hazme preguntas para ver si entendí", "dame un ejercicio parecido para hacerlo yo". Y de vez en cuando, **escribe tú** la solución y pídele que la corrija.

> 🌎 **En la vida real:** es la diferencia entre que el profesor te haga la tarea o que te enseñe a hacerla.

> 🌎 **Otro ejemplo:** Es como un entrenador de gimnasio: te muestra el ejercicio, pero las pesas las levantas tú.

### Tu plan con este mapa

Programación primero (los fundamentos que te faltan), **seguridad** en paralelo, y con esto (IA para programadores) ya puedes trabajar mejor desde hoy. **Agentes de IA** al final, cuando quieras construir tus propios agentes. Una clase por semana, con sus prácticas, vale más que diez leídas rápido.

> 🌎 **En la vida real:** es como un plan de entrenamiento: poco y constante gana a mucho y de vez en cuando.

> 🌎 **Otro ejemplo:** Es como ahorrar: un poco cada mes llega más lejos que un esfuerzo grande una vez.

```practica
vf :: Si la IA hace el código, ya no hace falta entender programación
vf :: Pedirle a la IA que te haga preguntas para ver si entendiste es una buena forma de aprender
elige :: ¿Para qué sirven las clases guiadas de este mapa? :: Para nada :: Para poder estudiar y practicar sin depender de la IA :: Para que la IA las lea
elige :: ¿Qué orden propone el mapa? :: Agentes primero :: Programación y seguridad, IA para programadores para trabajar mejor, y agentes al final :: Solo seguridad
escribe :: Escribe tres pedidos para usar la IA como profesor y no solo como ayudante. :: Por ejemplo: explícame esta línea paso a paso; hazme cinco preguntas para ver si entendí este tema; dame un ejercicio parecido para que lo resuelva yo y después lo corriges.
```

## Para la entrevista

> 🎤 **Si te preguntan "¿la IA programa por ti?":** "La IA escribe mucho código, pero el producto es mío: yo decido qué se hace, divido el trabajo en pasos chicos, reviso cada cambio, lo pruebo y lo publico. Por ejemplo, el certificado verificable de mi mapa de estudios: definimos el ataque, escribimos las reglas y las probamos con trampas antes de hacer la parte visual. Y sigo estudiando los fundamentos para poder revisar y explicar lo que hace."

> 🌎 **En la vida real:** es como un fotógrafo que usa cámara automática: la cámara enfoca, pero la foto la decide él.

> 🌎 **Otro ejemplo:** Es como un piloto moderno: el avión tiene mucha automatización, y por eso el piloto tiene que entenderla mejor que nadie.
