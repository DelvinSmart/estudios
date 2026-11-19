"""EL CICLO: llamar al modelo, correr herramientas, ver si para, repetir (clase 19, parte 1.3).

Los frenos están aquí, en el código, no en el prompt (PLAN.md, sección 5).
"""
from __future__ import annotations

import json

from .controles import numeros_sin_apoyo, parece_inyeccion
from .herramientas import ESQUEMAS, ejecutar
from .instrucciones import instrucciones
from .rastro import Rastro

MAX_PASOS = 6
MAX_TOKENS = 20000
MAX_REPETIDAS = 2  # la misma llamada, con los mismos datos, como mucho 2 veces

BLOQUEADO = "No puedo hacer eso. Pregúntame por tus gastos: cuánto gastaste, en qué, o cuál fue el último."


def _firma(nombre: str, argumentos) -> str:
    return json.dumps([nombre, argumentos], sort_keys=True, ensure_ascii=False)


def correr_agente(pregunta: str, modelo, contexto: dict, rastro: Rastro | None = None,
                  max_pasos: int = MAX_PASOS, max_tokens: int = MAX_TOKENS) -> dict:
    """Devuelve {"fin", "texto", "pasos", "herramientas", "tokens"}.

    fin: 'listo' · 'bloqueado' · 'sin apoyo' (se entrega marcada) · 'máximo de pasos' · 'presupuesto de tokens'
    """
    rastro = rastro or Rastro(pregunta)
    usadas: list[str] = []
    tokens = 0

    def fin(tipo: str, texto: str, pasos: int) -> dict:
        rastro.anotar("fin", detalle=tipo)
        return {"fin": tipo, "texto": texto, "pasos": pasos, "herramientas": usadas, "tokens": tokens}

    # Control de entrada: antes de que la pregunta llegue al modelo.
    if parece_inyeccion(pregunta):
        return fin("bloqueado", BLOQUEADO, 0)

    mensajes = [{"role": "system", "content": instrucciones()}, {"role": "user", "content": pregunta}]
    firmas: list[str] = []
    resultados: list[dict] = []  # lo que devolvieron las herramientas: el "apoyo" de la respuesta
    ya_se_corrigio = False

    for paso in range(1, max_pasos + 1):
        respuesta = modelo(mensajes, ESQUEMAS)
        gastados = respuesta["tokens"]["entrada"] + respuesta["tokens"]["salida"]
        tokens += gastados
        rastro.anotar("modelo", paso=paso, tokens=gastados, llamadas=len(respuesta["llamadas"]))
        mensajes.append(respuesta["mensaje"])

        if not respuesta["llamadas"]:
            texto = respuesta["texto"].strip()
            sueltos = numeros_sin_apoyo(texto, resultados, pregunta)
            if not sueltos:
                return fin("listo", texto, paso)
            if ya_se_corrigio:
                # Insistió: se entrega, pero marcada, para que la persona no confíe a ciegas.
                return fin("sin apoyo", texto + "\n\n⚠️ Ojo: esta respuesta tiene números que no salieron de tus datos.", paso)
            ya_se_corrigio = True
            rastro.anotar("control", detalle=f"números sin apoyo: {sueltos}")
            mensajes.append({"role": "user", "content":
                             f"Revisa tu respuesta: estos números no salieron de ninguna herramienta: {sueltos}. "
                             "Usa una herramienta para conseguirlos, o responde sin ellos."})
            continue

        for llamada in respuesta["llamadas"]:
            nombre, argumentos = llamada["nombre"], llamada["argumentos"]
            firma = _firma(nombre, argumentos)
            if firmas.count(firma) >= MAX_REPETIDAS:
                resultado = {"ok": False, "error": f"Ya llamaste a {nombre} con estos mismos datos {MAX_REPETIDAS} veces. "
                                                   "Usa el resultado que ya tienes, o cambia los datos."}
            else:
                resultado = ejecutar(nombre, argumentos, contexto)
            firmas.append(firma)
            usadas.append(nombre)
            if resultado["ok"]:
                resultados.append(resultado["datos"])
            rastro.anotar("herramienta", nombre=nombre, argumentos=argumentos, ok=resultado["ok"], error=resultado.get("error"))
            mensajes.append({"role": "tool", "tool_name": nombre, "content": json.dumps(resultado, ensure_ascii=False)})

        if tokens >= max_tokens:
            return fin("presupuesto de tokens", "Me quedé sin presupuesto antes de terminar. Prueba con una pregunta más corta.", paso)

    return fin("máximo de pasos", "No llegué a una respuesta en los pasos que tengo. Prueba preguntarlo de otra forma.", max_pasos)
