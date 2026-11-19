"""El set de evaluación contra el modelo de verdad (clase 28): cada caso varias veces, porque una no dice nada.

    python3 evaluar.py              # 3 veces cada caso, con qwen3.5:4b
    python3 evaluar.py --veces 5 --modelo gemma4:12b
"""
import argparse
import json
import math
import sys
from datetime import date

from agente.ciclo import correr_agente
from agente.controles import numeros_de
from agente.herramientas import leer_gastos
from agente.modelo import MODELO, ErrorDelModelo, Ollama
from agente.rastro import Rastro

HOY = date(2026, 11, 18)  # fija: si no, "este mes" cambia de respuesta cada mes


def calificar(caso: dict, r: dict) -> list[str]:
    """Los problemas de una ejecución (vacía = aprobó). Reglas, no otro modelo: baratas y siempre iguales."""
    problemas = []
    if r["fin"] != caso.get("fin", "listo"):
        problemas.append(f"terminó en '{r['fin']}'")
    for h in caso.get("debe_usar", []):
        if h not in r["herramientas"]:
            problemas.append(f"no usó {h}")
    if "monto" in caso and not any(abs(n - caso["monto"]) < 0.005 for n in numeros_de(r["texto"])):
        problemas.append(f"no dijo {caso['monto']:.2f}")
    if "contiene" in caso and caso["contiene"] not in r["texto"]:
        problemas.append(f"no dice '{caso['contiene']}'")
    if caso.get("sin_montos") and any(not (n.is_integer() and n <= 31) for n in numeros_de(r["texto"])):
        problemas.append("dijo un monto que no existe")
    return problemas


def percentil(valores: list[float], p: int) -> float:
    """El método del 'rango más cercano': el valor que deja abajo el p% de los casos."""
    orden = sorted(valores)
    return orden[max(0, math.ceil(p / 100 * len(orden)) - 1)]


def principal(argv=None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--veces", type=int, default=3)
    p.add_argument("--modelo", default=MODELO)
    p.add_argument("--casos", default="evaluacion/casos.json")
    a = p.parse_args(argv)

    with open(a.casos, encoding="utf-8") as f:
        casos = json.load(f)
    contexto = {"gastos": leer_gastos("datos/gastos.csv"), "hoy": HOY}
    modelo = Ollama(a.modelo)
    corridas, todos_bien = [], 0

    print(f"Modelo: {a.modelo} · {len(casos)} casos × {a.veces} veces\n")
    for caso in casos:
        bien = 0
        for _ in range(a.veces):
            rastro = Rastro(caso["pregunta"])
            try:
                r = correr_agente(caso["pregunta"], modelo, contexto, rastro)
            except ErrorDelModelo as e:
                print(f"✗ {e}", file=sys.stderr)
                return 1
            rastro.guardar()
            problemas = calificar(caso, r)
            bien += not problemas
            corridas.append({"caso": caso["id"], "ok": not problemas, "pasos": r["pasos"], "segundos": rastro.segundos(),
                             "tokens": r["tokens"], "problemas": problemas, "texto": r["texto"], "rastro": rastro.id})
            marca = "✓" if not problemas else "✗ " + "; ".join(problemas)
            print(f"  {caso['id']:<22} {marca:<40} {r['pasos']} pasos  {rastro.segundos():>5} s   {r['texto'][:70]!r}")
        todos_bien += bien == a.veces

    ok = [c for c in corridas if c["ok"]]
    segundos = [c["segundos"] for c in corridas]
    print(f"\nTasa de éxito: {len(ok)} de {len(corridas)} ({len(ok) / len(corridas):.0%})")
    print(f"pass^{a.veces} (los {a.veces} intentos bien): {todos_bien} de {len(casos)} casos")
    print(f"Pasos promedio: {sum(c['pasos'] for c in corridas) / len(corridas):.1f}")
    print(f"Demora p50: {percentil(segundos, 50)} s · p95: {percentil(segundos, 95)} s")
    print(f"Tokens por ejecución: {sum(c['tokens'] for c in corridas) // len(corridas)} · costo: R$ 0")
    with open("evaluacion/ultimo-resultado.json", "w", encoding="utf-8") as f:
        json.dump({"modelo": a.modelo, "veces": a.veces, "corridas": corridas}, f, ensure_ascii=False, indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(principal())
