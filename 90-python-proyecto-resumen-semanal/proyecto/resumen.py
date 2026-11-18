"""El resumen de la semana de un conductor, desde una planilla CSV.

    python3 resumen.py datos/semana.csv

Lee los viajes y los gastos, revisa cada fila, y muestra cuánto ganaste, cuánto gastaste, lo que te quedó,
cuánto ganaste en cada app y tu mejor día. Solo usa la biblioteca estándar de Python: no hay que instalar
nada para correrlo (pytest es solo para las pruebas).
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

COLUMNAS = ("fecha", "tipo", "detalle", "valor")
TIPOS = ("viaje", "gasto")


@dataclass(frozen=True)
class Movimiento:
    """Una fila de la planilla, ya revisada. frozen=True: no se puede cambiar después de creada."""

    fecha: date
    tipo: str  # "viaje" o "gasto"
    detalle: str  # la app (en un viaje) o el tipo de gasto
    valor: float


class PlanillaConErrores(ValueError):
    """La planilla tiene problemas. Trae TODOS juntos, para arreglarlos de una vez."""

    def __init__(self, problemas: list[str]):
        self.problemas = problemas
        super().__init__(f"La planilla tiene {len(problemas)} problema(s)")


# ---------- LEER: de texto a movimientos revisados ----------


def leer_fila(fila: dict[str, str], numero: int) -> Movimiento:
    """Revisa una fila y la convierte en Movimiento. Si algo está mal, lanza ValueError con la línea."""
    try:
        fecha = date.fromisoformat(fila["fecha"].strip())
    except ValueError:
        raise ValueError(f"línea {numero}: la fecha {fila['fecha']!r} no es una fecha AAAA-MM-DD que exista") from None
    tipo = fila["tipo"].strip().lower()
    if tipo not in TIPOS:
        raise ValueError(f"línea {numero}: el tipo {fila['tipo']!r} tiene que ser viaje o gasto")
    detalle = fila["detalle"].strip()
    if not detalle:
        raise ValueError(f"línea {numero}: falta el detalle (la app o el tipo de gasto)")
    try:
        valor = float(fila["valor"].strip().replace(",", "."))
    except ValueError:
        raise ValueError(f"línea {numero}: el valor {fila['valor']!r} no es un número") from None
    if valor <= 0:
        raise ValueError(f"línea {numero}: el valor tiene que ser mayor que cero")
    return Movimiento(fecha, tipo, detalle, valor)


def leer_movimientos(texto: str) -> list[Movimiento]:
    """Lee toda la planilla. Junta TODOS los problemas y, si hay alguno, lanza PlanillaConErrores."""
    lector = csv.DictReader(io.StringIO(texto))
    faltan = [c for c in COLUMNAS if c not in (lector.fieldnames or [])]
    if faltan:
        raise PlanillaConErrores([f"faltan columnas: {', '.join(faltan)} (la primera línea tiene que ser {','.join(COLUMNAS)})"])
    movimientos: list[Movimiento] = []
    problemas: list[str] = []
    for numero, fila in enumerate(lector, start=2):  # la línea 1 es la de los títulos
        if not any((v or "").strip() for v in fila.values()):
            continue  # una fila vacía (",,," al exportar de Excel) no es un error
        try:
            movimientos.append(leer_fila(fila, numero))
        except ValueError as e:
            problemas.append(str(e))
    if problemas:
        raise PlanillaConErrores(problemas)
    return movimientos


def leer_archivo(ruta: Path) -> list[Movimiento]:
    """Lo único que toca el disco. newline="" es lo que pide el módulo csv.

    utf-8-sig y no utf-8: Excel pone una marca invisible al principio del archivo (el BOM). Con utf-8, la
    primera columna se leía como "\\ufefffecha" y el programa decía "faltan columnas: fecha" aunque estaba.
    utf-8-sig quita esa marca si está, y si no está, lee igual que utf-8.
    """
    with ruta.open(encoding="utf-8-sig", newline="") as f:
        return leer_movimientos(f.read())


# ---------- CALCULAR: funciones puras, sin archivos ni pantalla ----------


def resumir(movimientos: list[Movimiento]) -> dict:
    """El resumen de la semana. Pura: recibe una lista y devuelve un diccionario."""
    viajes = [m for m in movimientos if m.tipo == "viaje"]
    gastos = [m for m in movimientos if m.tipo == "gasto"]
    ganado = sum(m.valor for m in viajes)
    gastado = sum(m.valor for m in gastos)

    por_app: dict[str, float] = {}
    for m in viajes:
        por_app[m.detalle] = por_app.get(m.detalle, 0) + m.valor
    por_dia: dict[date, float] = {}
    for m in viajes:
        por_dia[m.fecha] = por_dia.get(m.fecha, 0) + m.valor

    mejor_dia = max(por_dia.items(), key=lambda par: par[1]) if por_dia else None
    return {
        "ganado": round(ganado, 2),
        "gastado": round(gastado, 2),
        "neto": round(ganado - gastado, 2),
        "viajes": len(viajes),
        "por_viaje": round(ganado / len(viajes), 2) if viajes else 0.0,
        # De la app que más dio a la que menos (dict guarda el orden en que se agregan las llaves).
        "por_app": {app: round(v, 2) for app, v in sorted(por_app.items(), key=lambda par: par[1], reverse=True)},
        "mejor_dia": (mejor_dia[0], round(mejor_dia[1], 2)) if mejor_dia else None,
    }


# ---------- MOSTRAR: el texto del informe ----------


def dinero(valor: float) -> str:
    """1234.5 → "R$ 1.234,50", como se escribe en Brasil."""
    texto = f"{abs(valor):,.2f}"  # "1,234.50" (formato en inglés)
    texto = texto.replace(",", "_").replace(".", ",").replace("_", ".")  # → "1.234,50"
    return f"{'-' if valor < 0 else ''}R$ {texto}"


def informe(r: dict) -> str:
    """El texto que se muestra en la terminal."""
    lineas = [
        "Resumen de la semana",
        f"  Ganado:    {dinero(r['ganado'])}  ({r['viajes']} {'viaje' if r['viajes'] == 1 else 'viajes'}, {dinero(r['por_viaje'])} por viaje)",
        f"  Gastado:   {dinero(r['gastado'])}",
        f"  Te quedó:  {dinero(r['neto'])}",
    ]
    if r["por_app"]:
        lineas.append("Por app:")
        lineas += [f"  {app}: {dinero(v)}" for app, v in r["por_app"].items()]
    if r["mejor_dia"]:
        dia, valor = r["mejor_dia"]
        lineas.append(f"Mejor día: {dia:%d/%m} con {dinero(valor)}")
    return "\n".join(lineas)


# ---------- EL PROGRAMA: lo único que habla con la terminal ----------


def main(argumentos: list[str] | None = None) -> int:
    """Devuelve el código de salida: 0 si salió bien, 1 si no (así otro programa sabe si funcionó)."""
    analizador = argparse.ArgumentParser(description="El resumen de la semana de un conductor, desde un CSV.")
    analizador.add_argument("planilla", type=Path, help="la planilla CSV con las columnas fecha,tipo,detalle,valor")
    args = analizador.parse_args(argumentos)
    try:
        movimientos = leer_archivo(args.planilla)
    except FileNotFoundError:
        print(f"No encontré la planilla {args.planilla}. ¿Está bien escrita la ruta?", file=sys.stderr)
        return 1
    except PlanillaConErrores as e:
        print(f"La planilla {args.planilla} tiene problemas:", file=sys.stderr)
        for problema in e.problemas:
            print(f"  · {problema}", file=sys.stderr)
        return 1
    print(informe(resumir(movimientos)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
