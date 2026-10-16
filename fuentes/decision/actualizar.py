#!/usr/bin/env python3
"""Actualiza SOLO el módulo 06 (Decisión Terapéutica EII).

Uso, desde la raíz del repositorio:
    python3 fuentes/decision/actualizar.py

Qué hace:
  1. Une las fuentes de esta carpeta (01_head.html … 06_scores.js).
  2. Reemplaza el bloque entre <!-- DECISION:INICIO --> y <!-- DECISION:FIN -->
     de decision/index.html. El resto del archivo (íconos, manifiesto, botón
     de instalación) no se toca.
  3. Sube la versión de caché de decision/sw.js para que la app instalada
     renueve su copia sin conexión.

No modifica index.html, guia-2026.html, quiz/ ni sw.js de la app completa.
La app completa ya muestra la versión nueva porque su service worker pide
primero a la red.
"""
import datetime
import pathlib
import re
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
HTML = RAIZ / "decision" / "index.html"
SW = RAIZ / "decision" / "sw.js"
PIEZAS = ["01_head.html", "02_data.js", "03_engine.js", "04_ui.js", "05_frail.js", "06_scores.js"]

cuerpo = (AQUI / PIEZAS[0]).read_text(encoding="utf-8") + "<script>\n"
cuerpo += "".join((AQUI / p).read_text(encoding="utf-8") for p in PIEZAS[1:])
cuerpo += "</script>"

html = HTML.read_text(encoding="utf-8")
patron = re.compile(r"(<!-- DECISION:INICIO[^>]*-->\n)(.*?)(\n<!-- DECISION:FIN -->)", re.S)
if not patron.search(html):
    sys.exit("No se encontraron los marcadores DECISION:INICIO / DECISION:FIN en decision/index.html")
html = patron.sub(lambda m: m.group(1) + cuerpo + m.group(3), html, count=1)
HTML.write_text(html, encoding="utf-8")

ver = datetime.datetime.now().strftime("%Y-%m-%d-%H%M")
sw = SW.read_text(encoding="utf-8")
sw = re.sub(r"versión [^ ]+ \*/", f"versión {ver} */", sw, count=1)
sw = re.sub(r"const CACHE=PREFIX\+'[^']+';", f"const CACHE=PREFIX+'{ver}';", sw, count=1)
SW.write_text(sw, encoding="utf-8")

print(f"decision/index.html actualizado · decision/sw.js versión {ver}")
