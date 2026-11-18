"""Las pruebas del resumen, con pytest.

    python -m pytest          (desde la carpeta del proyecto, con el entorno virtual activo)
"""

from datetime import date

import pytest

from resumen import (
    Movimiento,
    PlanillaConErrores,
    dinero,
    informe,
    leer_archivo,
    leer_fila,
    leer_movimientos,
    main,
    resumir,
)

ENCABEZADO = "fecha,tipo,detalle,valor\n"


def fila(fecha="2026-11-16", tipo="viaje", detalle="Uber", valor="32.50"):
    return {"fecha": fecha, "tipo": tipo, "detalle": detalle, "valor": valor}


def mov(dia, tipo, detalle, valor):
    return Movimiento(date(2026, 11, dia), tipo, detalle, valor)


# ---------- leer una fila ----------


def test_una_fila_buena():
    assert leer_fila(fila(), 2) == Movimiento(date(2026, 11, 16), "viaje", "Uber", 32.5)


def test_acepta_coma_mayusculas_y_espacios():
    assert leer_fila(fila(tipo=" Gasto ", detalle=" lavado ", valor="30,00"), 2) == Movimiento(date(2026, 11, 16), "gasto", "lavado", 30.0)


# Cada fila mala, con el pedazo de mensaje que tiene que aparecer. parametrize: la misma prueba, muchos casos.
@pytest.mark.parametrize(
    ("cambios", "mensaje"),
    [
        ({"fecha": "2026-02-31"}, "no es una fecha AAAA-MM-DD que exista"),
        ({"fecha": "16/11/2026"}, "no es una fecha AAAA-MM-DD que exista"),
        ({"tipo": "propina"}, "tiene que ser viaje o gasto"),
        ({"detalle": "  "}, "falta el detalle"),
        ({"valor": "mucho"}, "no es un número"),
        ({"valor": "0"}, "mayor que cero"),
        ({"valor": "-5"}, "mayor que cero"),
    ],
)
def test_filas_malas_dicen_que_pasa_y_en_que_linea(cambios, mensaje):
    with pytest.raises(ValueError) as error:
        leer_fila(fila(**cambios), 7)
    assert mensaje in str(error.value)
    assert str(error.value).startswith("línea 7:")


# ---------- leer la planilla entera ----------


def test_lee_la_planilla():
    texto = ENCABEZADO + "2026-11-16,viaje,Uber,32.50\n2026-11-16,gasto,combustible,150\n"
    assert leer_movimientos(texto) == [mov(16, "viaje", "Uber", 32.5), mov(16, "gasto", "combustible", 150.0)]


def test_junta_todos_los_problemas_y_no_para_en_el_primero():
    texto = ENCABEZADO + "2026-11-16,viaje,Uber,32.50\n2026-11-31,viaje,99,10\n2026-11-17,propina,Uber,5\n"
    with pytest.raises(PlanillaConErrores) as error:
        leer_movimientos(texto)
    assert len(error.value.problemas) == 2
    assert error.value.problemas[0].startswith("línea 3:")  # la línea 1 es la de los títulos
    assert error.value.problemas[1].startswith("línea 4:")


def test_sin_las_columnas_lo_dice():
    with pytest.raises(PlanillaConErrores) as error:
        leer_movimientos("fecha,tipo,app,valor\n2026-11-16,viaje,Uber,32.50\n")
    assert "faltan columnas: detalle" in error.value.problemas[0]


def test_las_filas_vacias_no_son_un_error():
    # Una línea del todo vacía la salta el módulo csv solo. Pero Excel o Google Sheets, al exportar,
    # dejan filas como ",,," (con las comas y nada adentro): esas las salta resumen.py.
    texto = ENCABEZADO + "2026-11-16,viaje,Uber,32.50\n\n,,,\n2026-11-17,viaje,99,10\n,,,\n"
    assert len(leer_movimientos(texto)) == 2


def test_lee_un_archivo_con_tildes(tmp_path):
    # tmp_path: una carpeta temporal que pytest crea para esta prueba y borra después.
    planilla = tmp_path / "semana.csv"
    planilla.write_text(ENCABEZADO + "2026-11-16,gasto,peaje São Paulo,5.40\n", encoding="utf-8")
    assert leer_archivo(planilla)[0].detalle == "peaje São Paulo"


def test_lee_una_planilla_exportada_de_excel(tmp_path):
    # Excel guarda el CSV con una marca invisible al principio (el BOM, los bytes EF BB BF), termina las líneas
    # con \r\n y pone entre comillas los números con coma. Antes del arreglo, decía "faltan columnas: fecha".
    planilla = tmp_path / "excel.csv"
    planilla.write_bytes(b'\xef\xbb\xbffecha,tipo,detalle,valor\r\n2026-11-16,viaje,Uber,"32,50"\r\n')
    assert leer_archivo(planilla) == [mov(16, "viaje", "Uber", 32.5)]


# ---------- resumir ----------

SEMANA = [
    mov(16, "viaje", "Uber", 32.5),
    mov(16, "viaje", "99", 18.0),
    mov(16, "gasto", "combustible", 150.0),
    mov(17, "viaje", "Uber", 45.0),
    mov(18, "viaje", "Uber", 88.0),
    mov(18, "viaje", "InDrive", 40.0),
]


def test_el_resumen_de_la_semana():
    r = resumir(SEMANA)
    assert (r["ganado"], r["gastado"], r["neto"]) == (223.5, 150.0, 73.5)
    assert (r["viajes"], r["por_viaje"]) == (5, 44.7)


def test_por_app_de_la_que_mas_dio_a_la_que_menos():
    assert list(resumir(SEMANA)["por_app"].items()) == [("Uber", 165.5), ("InDrive", 40.0), ("99", 18.0)]


def test_el_mejor_dia():
    assert resumir(SEMANA)["mejor_dia"] == (date(2026, 11, 18), 128.0)


def test_una_semana_vacia_no_se_rompe():
    r = resumir([])
    assert (r["ganado"], r["neto"], r["viajes"], r["por_viaje"], r["por_app"], r["mejor_dia"]) == (0, 0, 0, 0.0, {}, None)


def test_sin_centavos_raros():
    # 0.1 + 0.2 da 0.30000000000000004 en Python (y en casi todos los lenguajes). Los tres totales se redondean.
    # (Antes esta prueba miraba solo "ganado"; rompiendo el código a propósito se vio que nadie revisaba el neto.)
    # Hacen falta dos casos: con unos mismos números no salen "raros" los tres totales a la vez.
    r = resumir([mov(16, "viaje", "Uber", 0.1), mov(16, "viaje", "Uber", 0.2), mov(16, "gasto", "peaje", 0.7)])
    assert (r["ganado"], r["neto"]) == (0.3, -0.4)  # sin redondear: 0.30000000000000004 y -0.39999999999999997
    r = resumir([mov(16, "gasto", "peaje", 0.1), mov(16, "gasto", "peaje", 0.2)])
    assert r["gastado"] == 0.3


# ---------- mostrar ----------


@pytest.mark.parametrize(("valor", "texto"), [(30, "R$ 30,00"), (1234.5, "R$ 1.234,50"), (1234567.891, "R$ 1.234.567,89"), (-84.5, "-R$ 84,50")])
def test_el_dinero_como_en_brasil(valor, texto):
    assert dinero(valor) == texto


def test_el_informe():
    texto = informe(resumir(SEMANA))
    assert "Te quedó:  R$ 73,50" in texto
    assert "Uber: R$ 165,50" in texto
    assert "Mejor día: 18/11 con R$ 128,00" in texto


# ---------- el programa entero ----------


def test_el_programa_con_una_planilla_buena(tmp_path, capsys):
    # capsys: atrapa lo que el programa imprime, para revisarlo.
    planilla = tmp_path / "semana.csv"
    planilla.write_text(ENCABEZADO + "2026-11-16,viaje,Uber,32.50\n", encoding="utf-8")
    assert main([str(planilla)]) == 0
    assert "Ganado:    R$ 32,50  (1 viaje, R$ 32,50 por viaje)" in capsys.readouterr().out  # "1 viaje", no "1 viajes"


def test_el_programa_sin_la_planilla(tmp_path, capsys):
    assert main([str(tmp_path / "no-existe.csv")]) == 1
    assert "No encontré la planilla" in capsys.readouterr().err


def test_el_programa_con_problemas_los_muestra_todos(tmp_path, capsys):
    planilla = tmp_path / "mala.csv"
    planilla.write_text(ENCABEZADO + "2026-11-31,viaje,Uber,1\n2026-11-16,viaje,Uber,cero\n", encoding="utf-8")
    assert main([str(planilla)]) == 1
    error = capsys.readouterr().err
    assert "línea 2:" in error and "línea 3:" in error
