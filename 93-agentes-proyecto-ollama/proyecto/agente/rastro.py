"""EL RASTRO: el registro de cada ejecución (clase 28, parte 5.6). Tu principal herramienta para encontrar errores."""
from __future__ import annotations

import json
import os
import time
import uuid


class Rastro:
    def __init__(self, pregunta: str, reloj=time.monotonic):
        self.id = uuid.uuid4().hex[:8]
        self.pregunta = pregunta
        self.eventos: list[dict] = []
        self._reloj = reloj
        self._inicio = reloj()

    def anotar(self, tipo: str, **datos) -> None:
        self.eventos.append({"ms": round((self._reloj() - self._inicio) * 1000), "tipo": tipo, **datos})

    def segundos(self) -> float:
        return round(self._reloj() - self._inicio, 1)

    def guardar(self, carpeta: str = "rastros") -> str:
        """Una línea JSON por evento, en rastros/<id>.jsonl. La carpeta está en .gitignore."""
        os.makedirs(carpeta, exist_ok=True)
        ruta = os.path.join(carpeta, f"{self.id}.jsonl")
        with open(ruta, "w", encoding="utf-8") as f:
            f.write(json.dumps({"tipo": "inicio", "id": self.id, "pregunta": self.pregunta}, ensure_ascii=False) + "\n")
            for e in self.eventos:
                f.write(json.dumps(e, ensure_ascii=False) + "\n")
        return ruta

    def resumen(self) -> str:
        """El rastro en pocas líneas, para mirar en la terminal."""
        lineas = []
        for e in self.eventos:
            if e["tipo"] == "modelo":
                lineas.append(f"  {e['ms']:>6} ms  modelo        {e.get('tokens', 0)} tokens")
            elif e["tipo"] == "herramienta":
                estado = "✓" if e.get("ok") else "✗ " + str(e.get("error", ""))[:60]
                lineas.append(f"  {e['ms']:>6} ms  {e['nombre']:<13} {json.dumps(e.get('argumentos'), ensure_ascii=False)} {estado}")
            else:
                lineas.append(f"  {e['ms']:>6} ms  {e['tipo']}  {e.get('detalle', '')}")
        return "\n".join(lineas)
