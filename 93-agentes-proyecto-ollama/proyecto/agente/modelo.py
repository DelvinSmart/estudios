"""EL MODELO: hablar con Ollama, que corre en la computadora (gratis, sin internet).

Todos los modelos devuelven lo mismo:
    {"mensaje": <para agregar a la conversación>, "texto": "...", "llamadas": [{"nombre", "argumentos"}],
     "tokens": {"entrada": n, "salida": n}}
"""
from __future__ import annotations

import json
import random
import time
import urllib.error
import urllib.request

MODELO = "qwen3.5:4b"
URL = "http://127.0.0.1:11434"


class ErrorDelModelo(Exception):
    """Un error con un mensaje para la persona (qué pasó y qué hacer)."""


def _enviar_de_verdad(url: str, cuerpo: bytes, tiempo_maximo: float) -> tuple[int, str]:
    pedido = urllib.request.Request(url, data=cuerpo, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(pedido, timeout=tiempo_maximo) as r:
            return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")


def se_reintenta(codigo: int) -> bool:
    """Errores pasajeros: 429 (límite de uso) y 5xx. Un 400 o un 404 va a fallar igual: no se reintenta."""
    return codigo == 429 or 500 <= codigo <= 599


def leer_respuesta(datos: dict) -> dict:
    """De la respuesta de /api/chat de Ollama al formato de todos los modelos."""
    mensaje = datos.get("message") or {}
    llamadas = []
    for ll in mensaje.get("tool_calls") or []:
        funcion = ll.get("function") or {}
        argumentos = funcion.get("arguments", {})
        if isinstance(argumentos, str):  # algunos modelos mandan el JSON como texto
            try:
                argumentos = json.loads(argumentos)
            except json.JSONDecodeError:
                pass  # queda como texto: la herramienta lo rechaza con un error que enseña
        llamadas.append({"nombre": funcion.get("name", ""), "argumentos": argumentos})
    return {
        "mensaje": {"role": "assistant", "content": mensaje.get("content", ""), **({"tool_calls": mensaje["tool_calls"]} if mensaje.get("tool_calls") else {})},
        "texto": mensaje.get("content", "") or "",
        "llamadas": llamadas,
        "tokens": {"entrada": datos.get("prompt_eval_count", 0), "salida": datos.get("eval_count", 0)},
    }


class Ollama:
    def __init__(self, modelo: str = MODELO, url: str = URL, tiempo_maximo: float = 180, reintentos: int = 3,
                 enviar=_enviar_de_verdad, dormir=time.sleep, azar=random.random):
        self.modelo, self.url, self.tiempo_maximo, self.reintentos = modelo, url, tiempo_maximo, reintentos
        self._enviar, self._dormir, self._azar = enviar, dormir, azar

    def __call__(self, mensajes: list[dict], herramientas: list[dict]) -> dict:
        cuerpo = json.dumps({
            "model": self.modelo,
            "messages": mensajes,
            "tools": herramientas,
            "stream": False,
            "think": False,  # sin "pensar en voz alta": más rápido, y para esto alcanza
        }).encode("utf-8")
        ultimo = ""
        for intento in range(self.reintentos + 1):
            if intento:
                self._dormir(min(2 ** (intento - 1), 8) + self._azar())  # espera exponencial con un poco de azar
            try:
                codigo, texto = self._enviar(f"{self.url}/api/chat", cuerpo, self.tiempo_maximo)
            except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
                ultimo = f"No pude hablar con Ollama ({e}). ¿Está abierto? Prueba: ollama serve"
                continue
            if codigo == 200:
                return leer_respuesta(json.loads(texto))
            if codigo == 404 and "not found" in texto:
                raise ErrorDelModelo(f"El modelo {self.modelo} no está bajado. Bájalo con: ollama pull {self.modelo}")
            ultimo = f"Ollama respondió {codigo}: {texto[:200]}"
            if not se_reintenta(codigo):
                break
        raise ErrorDelModelo(ultimo)


class ModeloDeMentira:
    """Para las pruebas: devuelve respuestas escritas de antemano, en orden, y guarda lo que recibió.

    Cada respuesta es un texto (el modelo responde) o una lista de llamadas [("herramienta", {args}), ...].
    """

    def __init__(self, respuestas):
        self.respuestas = list(respuestas)
        self.recibido: list[list[dict]] = []

    def __call__(self, mensajes, herramientas):
        self.recibido.append([dict(m) for m in mensajes])
        r = self.respuestas.pop(0) if len(self.respuestas) > 1 else self.respuestas[0]
        if isinstance(r, str):
            return {"mensaje": {"role": "assistant", "content": r}, "texto": r, "llamadas": [], "tokens": {"entrada": 100, "salida": 20}}
        llamadas = [{"nombre": n, "argumentos": a} for n, a in r]
        return {"mensaje": {"role": "assistant", "content": ""}, "texto": "", "llamadas": llamadas, "tokens": {"entrada": 100, "salida": 20}}
