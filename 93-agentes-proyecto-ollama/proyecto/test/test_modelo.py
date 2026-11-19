import json
import unittest
import urllib.error

from agente.modelo import ErrorDelModelo, Ollama, leer_respuesta, se_reintenta

RESPUESTA = {"message": {"role": "assistant", "content": "", "tool_calls": [
    {"function": {"name": "sumar_gastos", "arguments": {"categoria": "comida"}}}]}, "prompt_eval_count": 900, "eval_count": 30}


class Transporte:
    """Un Ollama de mentira: devuelve las respuestas en orden y cuenta los pedidos."""

    def __init__(self, *respuestas):
        self.respuestas, self.pedidos = list(respuestas), []

    def __call__(self, url, cuerpo, tiempo):
        self.pedidos.append(json.loads(cuerpo))
        r = self.respuestas.pop(0)
        if isinstance(r, Exception):
            raise r
        return r


def ollama(transporte):
    return Ollama(enviar=transporte, dormir=lambda s: None, azar=lambda: 0)


class TestModelo(unittest.TestCase):
    def test_leer_una_llamada(self):
        r = leer_respuesta(RESPUESTA)
        self.assertEqual(r["llamadas"], [{"nombre": "sumar_gastos", "argumentos": {"categoria": "comida"}}])
        self.assertEqual(r["tokens"], {"entrada": 900, "salida": 30})

    def test_argumentos_como_texto(self):
        datos = {"message": {"content": "", "tool_calls": [{"function": {"name": "x", "arguments": '{"a": 1}'}}]}}
        self.assertEqual(leer_respuesta(datos)["llamadas"][0]["argumentos"], {"a": 1})

    def test_el_pedido(self):
        t = Transporte((200, json.dumps(RESPUESTA)))
        ollama(t)([{"role": "user", "content": "hola"}], [])
        self.assertEqual((t.pedidos[0]["model"], t.pedidos[0]["stream"], t.pedidos[0]["think"]), ("qwen3.5:4b", False, False))

    def test_reintenta_un_503(self):
        t = Transporte((503, "ocupado"), (200, json.dumps(RESPUESTA)))
        self.assertEqual(ollama(t)([], [])["llamadas"][0]["nombre"], "sumar_gastos")
        self.assertEqual(len(t.pedidos), 2)

    def test_no_reintenta_un_400(self):
        t = Transporte((400, "pedido malo"), (200, json.dumps(RESPUESTA)))
        with self.assertRaises(ErrorDelModelo):
            ollama(t)([], [])
        self.assertEqual(len(t.pedidos), 1)

    def test_ollama_apagado(self):
        apagado = urllib.error.URLError("Connection refused")
        with self.assertRaises(ErrorDelModelo) as e:
            ollama(Transporte(apagado, apagado, apagado, apagado))([], [])
        self.assertIn("ollama serve", str(e.exception))

    def test_modelo_no_bajado(self):
        with self.assertRaises(ErrorDelModelo) as e:
            ollama(Transporte((404, '{"error":"model \\"qwen3.5:4b\\" not found"}')))([], [])
        self.assertIn("ollama pull qwen3.5:4b", str(e.exception))

    def test_que_se_reintenta(self):
        self.assertEqual([se_reintenta(c) for c in (429, 500, 503, 400, 404)], [True, True, True, False, False])


class TestEvaluar(unittest.TestCase):
    def test_percentil(self):
        from evaluar import percentil
        self.assertEqual(percentil([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 50), 5)
        self.assertEqual(percentil([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 95), 10)

    def test_calificar(self):
        from evaluar import calificar
        caso = {"debe_usar": ["sumar_gastos"], "monto": 651.10}
        self.assertEqual(calificar(caso, {"fin": "listo", "herramientas": ["sumar_gastos"], "texto": "R$ 651,10"}), [])
        self.assertEqual(calificar(caso, {"fin": "listo", "herramientas": [], "texto": "R$ 600,00"}), ["no usó sumar_gastos", "no dijo 651.10"])
        self.assertEqual(calificar({"fin": "bloqueado"}, {"fin": "bloqueado", "herramientas": [], "texto": "No"}), [])
