"""La terminal: python3 preguntar.py "¿Cuánto gasté en combustible este mes?"

Opciones: --modelo qwen3.5:4b · --hoy 2026-11-18 (para probar con otra fecha) · --rastro (ver el rastro)
"""
import argparse
import sys
from datetime import date

from agente.ciclo import correr_agente
from agente.herramientas import leer_gastos
from agente.modelo import MODELO, ErrorDelModelo, Ollama
from agente.rastro import Rastro


def principal(argv=None) -> int:
    p = argparse.ArgumentParser(description="El Copiloto de gastos: un agente que corre en tu computadora con Ollama.")
    p.add_argument("pregunta")
    p.add_argument("--modelo", default=MODELO)
    p.add_argument("--hoy", default=None, help="AAAA-MM-DD (si no se pone, hoy)")
    p.add_argument("--datos", default="datos/gastos.csv")
    p.add_argument("--rastro", action="store_true", help="mostrar el rastro de la ejecución")
    a = p.parse_args(argv)

    contexto = {"gastos": leer_gastos(a.datos), "hoy": date.fromisoformat(a.hoy) if a.hoy else date.today()}
    rastro = Rastro(a.pregunta)
    try:
        r = correr_agente(a.pregunta, Ollama(a.modelo), contexto, rastro)
    except ErrorDelModelo as e:
        print(f"✗ {e}", file=sys.stderr)
        return 1
    ruta = rastro.guardar()

    print(r["texto"])
    print(f"\n{r['pasos']} pasos · herramientas: {', '.join(r['herramientas']) or 'ninguna'} · "
          f"{r['tokens']} tokens · {rastro.segundos()} s · costo: R$ 0 (corre en tu computadora) · fin: {r['fin']}")
    if a.rastro:
        print(rastro.resumen())
    print(f"rastro guardado en {ruta}")
    return 0


if __name__ == "__main__":
    sys.exit(principal())
