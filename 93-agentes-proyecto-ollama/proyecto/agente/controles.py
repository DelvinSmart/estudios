"""LOS CONTROLES: revisiones baratas y rápidas, sin modelo (clase 26, patrón 15).

- De entrada: frases típicas de inyección, antes de que la pregunta llegue al modelo.
- De salida: cada monto de la respuesta tiene que haber salido de una herramienta (que esté "apoyado").
"""
from __future__ import annotations

import re
import unicodedata

FRASES_DE_INYECCION = [
    "ignora las instrucciones",
    "ignora tus instrucciones",
    "olvida tus reglas",
    "system prompt",
    "ignore previous instructions",
    "ignore all previous",
]

# Los enteros chicos son días y cantidades ("el día 18", "3 gastos"), no montos: no se revisan.
ENTERO_CHICO = 31


def _plano(texto: str) -> str:
    """Sin tildes y en minúsculas: 'Ignorá' y 'ignora' cuentan igual."""
    return unicodedata.normalize("NFD", texto).encode("ascii", "ignore").decode().lower()


def parece_inyeccion(pregunta: str) -> bool:
    p = _plano(pregunta)
    return any(_plano(f) in p for f in FRASES_DE_INYECCION)


def _a_numero(texto: str) -> float:
    """'1.245,50' → 1245.5 · '245,5' → 245.5 · '651.10' → 651.1 · '12.500' → 12500."""
    if "," in texto and "." in texto:
        # el que va último es el decimal
        if texto.rfind(",") > texto.rfind("."):
            texto = texto.replace(".", "").replace(",", ".")
        else:
            texto = texto.replace(",", "")
    elif "," in texto:
        entero, _, resto = texto.rpartition(",")
        texto = f"{entero.replace(',', '')}.{resto}" if len(resto) <= 2 else texto.replace(",", "")
    elif "." in texto:
        entero, _, resto = texto.rpartition(".")
        texto = texto.replace(".", "") if len(resto) == 3 else f"{entero.replace('.', '')}.{resto}"
    return float(texto)


def numeros_de(texto: str) -> list[float]:
    """Los números de un texto. Las fechas (2026-11-18, 18/11) se sacan antes: no son montos."""
    sin_fechas = re.sub(r"\d{4}-\d{2}-\d{2}|\d{1,2}/\d{1,2}(/\d{2,4})?", " ", texto)
    return [_a_numero(t) for t in re.findall(r"\d[\d.,]*\d|\d", sin_fechas)]


def _numeros_dentro(valor) -> list[float]:
    """Todos los números que hay dentro de un resultado de herramienta (diccionarios y listas, a cualquier nivel)."""
    if isinstance(valor, bool):
        return []
    if isinstance(valor, (int, float)):
        return [float(valor)]
    if isinstance(valor, dict):
        return [n for v in valor.values() for n in _numeros_dentro(v)]
    if isinstance(valor, list):
        return [n for v in valor for n in _numeros_dentro(v)]
    if isinstance(valor, str):
        # Los números dentro de un texto también cuentan: el 2026 de "2026-11-18" (encontrado en la evaluación).
        return [float(t) for t in re.findall(r"\d+", valor)]
    return []


def numeros_sin_apoyo(respuesta: str, resultados: list[dict], pregunta: str = "") -> list[float]:
    """Los montos de la respuesta que no salieron de ninguna herramienta ni de la pregunta."""
    apoyo = [n for r in resultados for n in _numeros_dentro(r)] + numeros_de(pregunta)
    sueltos = []
    for n in numeros_de(respuesta):
        if n.is_integer() and n <= ENTERO_CHICO:
            continue
        if not any(abs(n - a) < 0.005 for a in apoyo):
            sueltos.append(n)
    return sueltos
