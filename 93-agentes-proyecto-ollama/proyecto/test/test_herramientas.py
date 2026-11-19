import os
import tempfile
import unittest
from datetime import date

from agente.herramientas import ejecutar, leer_gastos

GASTOS = leer_gastos(os.path.join(os.path.dirname(__file__), "..", "datos", "gastos.csv"))
CTX = {"gastos": GASTOS, "hoy": date(2026, 11, 18)}


class TestHerramientas(unittest.TestCase):
    def test_el_ejemplo_del_plan(self):
        r = ejecutar("sumar_gastos", {"categoria": "combustible", "desde": "2026-11-01", "hasta": "2026-11-18"}, CTX)
        self.assertEqual(r, {"ok": True, "datos": {"categoria": "combustible", "desde": "2026-11-01", "hasta": "2026-11-18", "total": 651.1, "cantidad": 4}})

    def test_las_fechas_estan_incluidas(self):
        r = ejecutar("sumar_gastos", {"categoria": "comida", "desde": "2026-11-17", "hasta": "2026-11-17"}, CTX)
        self.assertEqual(r["datos"]["total"], 35.5)

    def test_todas_y_sin_fechas(self):
        r = ejecutar("sumar_gastos", {"categoria": "todas"}, CTX)
        self.assertEqual(r["datos"]["total"], 1238.99)
        self.assertEqual(r["datos"]["cantidad"], 11)

    def test_fecha_de_hoy(self):
        self.assertEqual(ejecutar("fecha_de_hoy", {}, CTX), {"ok": True, "datos": {"hoy": "2026-11-18", "primer_dia_del_mes": "2026-11-01"}})

    def test_listar_el_mas_reciente_primero_y_con_limite(self):
        r = ejecutar("listar_gastos", {"categoria": "combustible", "limite": 2}, CTX)
        self.assertEqual([g["fecha"] for g in r["datos"]["gastos"]], ["2026-11-18", "2026-11-16"])

    def test_listar_acepta_el_limite_como_texto(self):
        self.assertEqual(ejecutar("listar_gastos", {"categoria": "todas", "limite": "3"}, CTX)["datos"]["cantidad"], 3)

    def test_listar_nunca_trae_mas_de_10(self):
        self.assertFalse(ejecutar("listar_gastos", {"categoria": "todas", "limite": 50}, CTX)["ok"])

    def test_categoria_que_no_existe_dice_las_que_hay(self):
        r = ejecutar("sumar_gastos", {"categoria": "peajes"}, CTX)
        self.assertFalse(r["ok"])
        self.assertIn("combustible, comida, mantenimiento, celular", r["error"])

    def test_fecha_mal_escrita_ensena(self):
        r = ejecutar("sumar_gastos", {"categoria": "comida", "desde": "1/11/2026"}, CTX)
        self.assertIn("AAAA-MM-DD, por ejemplo 2026-11-01", r["error"])

    def test_dia_que_no_existe(self):
        self.assertIn("no es un día que exista", ejecutar("sumar_gastos", {"categoria": "comida", "desde": "2026-02-30"}, CTX)["error"])

    def test_desde_despues_de_hasta(self):
        self.assertFalse(ejecutar("sumar_gastos", {"categoria": "comida", "desde": "2026-11-18", "hasta": "2026-11-01"}, CTX)["ok"])

    def test_herramienta_inventada(self):
        self.assertIn("No existe la herramienta 'borrar_gastos'", ejecutar("borrar_gastos", {}, CTX)["error"])

    def test_argumentos_que_no_son_objeto(self):
        self.assertFalse(ejecutar("sumar_gastos", "combustible", CTX)["ok"])

    def test_una_herramienta_que_revienta_no_lanza(self):
        r = ejecutar("sumar_gastos", {"categoria": "comida"}, {"gastos": None, "hoy": date(2026, 11, 18)})
        self.assertFalse(r["ok"])
        self.assertIn("La herramienta falló", r["error"])

    def test_csv_guardado_en_excel_con_bom(self):
        with tempfile.NamedTemporaryFile("w", encoding="utf-8-sig", suffix=".csv", delete=False) as f:
            f.write("fecha,categoria,monto,nota\n2026-11-01,comida,10.50,x\n")
        try:
            self.assertEqual(leer_gastos(f.name)[0]["fecha"], "2026-11-01")
        finally:
            os.remove(f.name)
