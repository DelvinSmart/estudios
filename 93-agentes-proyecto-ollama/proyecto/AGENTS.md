# Reglas para la IA en este proyecto

Lee `PLAN.md` antes de empezar. Lo que no está en el plan, se pregunta.

## Comandos

- `python3 -m unittest`: las pruebas, **sin Ollama** (usan un modelo de mentira).
- `python3 preguntar.py "pregunta"`: una pregunta al agente de verdad (necesita Ollama abierto).
- `python3 evaluar.py`: el set de evaluación contra el modelo de verdad.

## Reglas

- Python con la **biblioteca estándar**: no instales paquetes.
- Todas las herramientas son **de solo lectura**. Una herramienta que escriba, borre o mande algo no se agrega sin cambiar el plan.
- Las herramientas **nunca lanzan** un error hacia el ciclo: devuelven `{"ok": False, "error": "…"}` con un mensaje que diga cómo corregir.
- Los frenos (pasos, tokens, llamadas repetidas) van **en el código**, no en el prompt.
- Cada regla, con su prueba **antes** de darla por terminada. Las pruebas no llaman a Ollama.
- Nunca borres una prueba ni un caso de evaluación para que pase.
- Textos para la persona, en español. Montos como en Brasil: R$ 1.245,50.
- No hagas commit ni push: eso lo decide la persona.
