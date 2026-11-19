"""LAS HERRAMIENTAS: las manos del agente. Todas de solo lectura.

Cada una tiene un esquema (lo que ve el modelo), una validación y una función.
Nunca lanzan un error hacia el ciclo: devuelven {"ok": False, "error": "..."} con un mensaje que enseña.
"""
from __future__ import annotations

import csv
import re
from datetime import date

CATEGORIAS = ["combustible", "comida", "mantenimiento", "celular"]
MAX_LISTA = 10  # resultados flacos (clase 27, parte 4.2)
FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def leer_gastos(ruta: str) -> list[dict]:
    """Lee el CSV. utf-8-sig: si lo guardaste en Excel, trae un BOM al principio y así se lee igual."""
    with open(ruta, encoding="utf-8-sig", newline="") as archivo:
        return [
            {"fecha": f["fecha"], "categoria": f["categoria"], "monto": float(f["monto"]), "nota": f.get("nota", "")}
            for f in csv.DictReader(archivo)
        ]


# Lo que ve el modelo. La descripción ES el prompt de la herramienta: qué hace, cuándo usarla y qué devuelve.
ESQUEMAS = [
    {
        "type": "function",
        "function": {
            "name": "fecha_de_hoy",
            "description": "Devuelve la fecha de hoy (AAAA-MM-DD) y el primer día del mes. "
            "Úsala ANTES de calcular 'hoy', 'este mes' o 'esta semana'. No la uses si la pregunta ya trae las fechas.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "sumar_gastos",
            "description": "Suma los gastos de una categoría entre dos fechas (las dos incluidas). "
            "Úsala para preguntas de 'cuánto gasté'. Devuelve el total en reales y cuántos gastos sumó. "
            "Si la persona pregunta por algo que no es una de estas categorías (por ejemplo, el seguro), NO la uses "
            "con otra categoría: dile que no tiene gastos de eso anotados.",
            "parameters": {
                "type": "object",
                "properties": {
                    "categoria": {"type": "string", "enum": CATEGORIAS + ["todas"], "description": "La categoría, o 'todas'"},
                    "desde": {"type": "string", "description": "Fecha AAAA-MM-DD. Si no se pone, desde el primer gasto"},
                    "hasta": {"type": "string", "description": "Fecha AAAA-MM-DD. Si no se pone, hasta el último gasto"},
                },
                "required": ["categoria"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "listar_gastos",
            "description": "Lista los gastos más recientes primero, como mucho 10. "
            "Úsala para 'cuál fue mi último gasto' o 'en qué gasté'. No la uses para sumar: usa sumar_gastos.",
            "parameters": {
                "type": "object",
                "properties": {
                    "categoria": {"type": "string", "enum": CATEGORIAS + ["todas"], "description": "La categoría, o 'todas'"},
                    "limite": {"type": "integer", "description": "Cuántos traer, de 1 a 10 (si no se pone, 5)"},
                },
                "required": ["categoria"],
            },
        },
    },
]


def _error(mensaje: str) -> dict:
    return {"ok": False, "error": mensaje}


def _revisar_categoria(args: dict) -> str | None:
    categoria = args.get("categoria")
    if categoria is None:
        return "Falta 'categoria'. Usa una de: " + ", ".join(CATEGORIAS) + " o 'todas'"
    if categoria not in CATEGORIAS + ["todas"]:
        return f"No hay una categoría '{categoria}'. Las que hay son: " + ", ".join(CATEGORIAS) + ". Díselo a la persona"
    return None


def _revisar_fecha(args: dict, campo: str) -> str | None:
    valor = args.get(campo)
    if valor in (None, ""):
        return None
    if not isinstance(valor, str) or not FECHA.match(valor):
        return f"'{campo}' tiene que ser AAAA-MM-DD, por ejemplo 2026-11-01. Llegó: {valor!r}"
    try:
        date.fromisoformat(valor)
    except ValueError:
        return f"'{campo}' no es un día que exista: {valor}"
    return None


def fecha_de_hoy(args: dict, contexto: dict) -> dict:
    hoy: date = contexto["hoy"]
    return {"ok": True, "datos": {"hoy": hoy.isoformat(), "primer_dia_del_mes": hoy.replace(day=1).isoformat()}}


def sumar_gastos(args: dict, contexto: dict) -> dict:
    problema = _revisar_categoria(args) or _revisar_fecha(args, "desde") or _revisar_fecha(args, "hasta")
    if problema:
        return _error(problema)
    desde, hasta = args.get("desde") or "0000-01-01", args.get("hasta") or "9999-12-31"
    if desde > hasta:
        return _error(f"'desde' ({desde}) es después de 'hasta' ({hasta}). Pon primero la fecha más vieja")
    categoria = args["categoria"]
    elegidos = [
        g for g in contexto["gastos"]
        if (categoria == "todas" or g["categoria"] == categoria) and desde <= g["fecha"] <= hasta
    ]
    total = round(sum(g["monto"] for g in elegidos), 2)
    return {"ok": True, "datos": {"categoria": categoria, "desde": args.get("desde"), "hasta": args.get("hasta"),
                                  "total": total, "cantidad": len(elegidos)}}


def listar_gastos(args: dict, contexto: dict) -> dict:
    problema = _revisar_categoria(args)
    if problema:
        return _error(problema)
    limite = args.get("limite", 5)
    if isinstance(limite, str) and limite.isdigit():
        limite = int(limite)  # los modelos chicos a veces mandan "3" en vez de 3
    if not isinstance(limite, int) or isinstance(limite, bool) or not 1 <= limite <= MAX_LISTA:
        return _error(f"'limite' tiene que ser un número entero de 1 a {MAX_LISTA}")
    categoria = args["categoria"]
    elegidos = [g for g in contexto["gastos"] if categoria == "todas" or g["categoria"] == categoria]
    elegidos = sorted(elegidos, key=lambda g: g["fecha"], reverse=True)[:limite]
    return {"ok": True, "datos": {"gastos": elegidos, "cantidad": len(elegidos)}}


FUNCIONES = {"fecha_de_hoy": fecha_de_hoy, "sumar_gastos": sumar_gastos, "listar_gastos": listar_gastos}


def ejecutar(nombre: str, args, contexto: dict) -> dict:
    """Primero validar, después correr. Pase lo que pase, devuelve un diccionario: el error vuelve al modelo."""
    funcion = FUNCIONES.get(nombre)
    if funcion is None:
        return _error(f"No existe la herramienta '{nombre}'. Las que hay son: " + ", ".join(FUNCIONES))
    if not isinstance(args, dict):
        return _error("Los datos de la herramienta tienen que ser un objeto JSON, como {\"categoria\": \"comida\"}")
    try:
        return funcion(args, contexto)
    except Exception as e:  # una herramienta que revienta no puede matar el ciclo
        return _error(f"La herramienta falló: {type(e).__name__}: {e}")
