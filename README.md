# Repositorio EII 2026

Material de estudio de enfermedad inflamatoria intestinal (EII) para postgrado de gastroenterología, con la disponibilidad real de fármacos en Chile declarada en cada decisión terapéutica.

**Autor:** Dr. Moisés Oropeza — Médico Internista, Residente de Gastroenterología, Universidad de los Andes (Clínica Dávila / Clínica Universidad de los Andes). Santiago de Chile, septiembre 2026.

## Contenido

| Módulo | Qué es |
|---|---|
| 01 | **Guía de estudio EII 2026** — 27 secciones, de concepto básico a manejo avanzado: arquitectura diagnóstica, scores, terapias por mecanismo, complicaciones, cirugía y poblaciones especiales. Con flashcards y quiz de 18 preguntas. |
| 02 | **Clase de actualización 2026** — el paciente difícil de tratar en tres ejes (Parigi 2023): falla real al tratamiento, fenotipo y factores del paciente. Epidemiología chilena (ChilEii), brecha de acceso, VARSITY, secuenciación, recurrencia posquirúrgica, trastornos del reservorio, embarazo y adulto mayor. |
| 03 | **Índice de láminas** — catálogo de las 36 figuras de apoyo en 9 grupos temáticos, con buscador. Ver nota sobre imágenes más abajo. |
| 04 | **Consulta rápida** — qué hay y qué no hay en Chile, criterios de falla y conducta según monitorización terapéutica (TDM), umbrales de colitis aguda grave, metas STRIDE-III, checklist prebiológico, poblaciones especiales y tabla de scores. |
| 05 | **Quiz EII v6.2** — 229 casos clínicos con retroalimentación razonada (pieza independiente), actualizado a STRIDE-III. |
| 06 | **Decisión Terapéutica EII** — herramienta paso a paso para CU (incluido reservorio ileal: pouchitis, tipo Crohn, cuffitis) y enfermedad de Crohn en adultos: fenotipo, línea terapéutica, comorbilidades y manifestaciones extraintestinales → escalones de tratamiento con lo disponible en Chile primero, cinética de respuesta, niveles, presentación para la receta, checklist previo al inicio, scores de actividad (Mayo parcial/total/endoscópico, UCEIS, Harvey-Bradshaw, CDAI, SES-CD, Rutgeerts modificado, PDAI/mPDAI) y clasificación TOpClass perianal, nombres comerciales y calculadora de fragilidad (Fried / escala clínica) y evaluador de metas STRIDE-III con tiempos hasta la meta por mecanismo. En `decision/`. |
| 07 | **Vigilancia bibliográfica EII** — lo más relevante de PubMed en EII, semana a semana: lectura obligatoria con hallazgo y «¿cambia la práctica?», registro filtrable por área (CU/EC), tipo de estudio y nivel de revista, seguimiento personal (leído, por leer, destacados, notas), tendencias, citas Vancouver y **Fundamentales** (75 artículos de consulta obligatoria: de Truelove-Witts a los pivotales, head-to-head, estrategia y guías vigentes). Lee el Google Sheet que llena la búsqueda semanal; las marcas se guardan en el Sheet vía Apps Script. En `vigilancia/`. |

## Sobre las imágenes

**Esta versión no incluye las láminas de apoyo.** Son material docente de **Beatriz Gros**, publicado en [www.ibd-eii.com](https://www.ibd-eii.com), y no se redistribuyen aquí.

El Módulo 03 conserva el **índice completo de las 36 figuras**, con su título y tema, para que el lector identifique cuál cubre cada contenido y la consulte directamente en la fuente original. Lo mismo en los bloques "Láminas de apoyo" intercalados en los módulos 01 y 02.

## Estructura de archivos

```
index.html        · repositorio: portada y módulos 02, 03 y 04 (rutas internas #clase, #atlas, #rapida, #fuentes)
guia-2026.html    · módulo 01, documento completo con navegación propia
quiz/index.html   · módulo 05, Quiz EII v6.2 (229 casos)
decision/index.html · módulo 06, herramienta de decisión terapéutica (autocontenida)
manifest.webmanifest, sw.js, icons/            · app instalable completa (EII 2026)
decision/manifest.webmanifest, decision/sw.js  · app instalable solo de decisión
fuentes/decision/ · fuentes del módulo 06 y actualizar.py (regenera solo decision/)
vigilancia/       · módulo 07, app de vigilancia bibliográfica (index.html, sw.js, manifest, datos-respaldo.json, fundamentales.json)
fuentes/vigilancia/ · Code.gs (Apps Script que conecta la app con el Sheet) e INSTRUCCIONES.md
.nojekyll         · evita el procesamiento Jekyll en GitHub Pages
```

Sitio estático puro: sin compilación, sin servidor, sin dependencias. Funciona abriendo `index.html` directamente o publicado con GitHub Pages.

## Cómo actualizar cada módulo sin tocar los demás

Cada módulo es independiente: un cambio en uno no debe reescribir los otros.

| Módulo | Dónde se edita | Qué archivos cambian |
|---|---|---|
| 05 · Quiz (con sincronización Google Sheets) | directamente en `quiz/index.html` | solo `quiz/index.html` |
| 06 · Decisión | en `fuentes/decision/` (01_head.html … 06_scores.js) y luego `python3 fuentes/decision/actualizar.py` | `fuentes/decision/*`, `decision/index.html`, `decision/sw.js` |
| 07 · Vigilancia bibliográfica | directamente en `vigilancia/index.html`; la conexión en `fuentes/vigilancia/Code.gs` | `vigilancia/*`, `fuentes/vigilancia/*` |
| 01–04 · Repositorio y guía | directamente en `index.html` o `guia-2026.html` | solo ese archivo |

Reglas:
- `decision/index.html` se genera: no editar a mano lo que está entre `<!-- DECISION:INICIO -->` y `<!-- DECISION:FIN -->`.
- Antes de subir: `git pull --rebase origin main`, y en el commit agregar solo los archivos del módulo que se cambió (`git add quiz/` o `git add decision/ fuentes/decision/`), nunca `git add -A` a ciegas.
- No es necesario subir la versión de `sw.js` de la app completa al cambiar contenido: los service workers piden primero a la red y renuevan su copia solos.

## Apps instalables (funcionan sin conexión)

| App | Enlace | Contenido |
|---|---|---|
| **EII 2026** | https://moropezah.github.io/repositorio-eii-2026/ | Repositorio completo: guía, clase, consulta rápida, quiz y decisión terapéutica |
| **Decisión EII** | https://moropezah.github.io/repositorio-eii-2026/decision/ | Solo la herramienta de decisión terapéutica, para compartir con el equipo |
| **Vigilancia EII** | https://moropezah.github.io/repositorio-eii-2026/vigilancia/ | Vigilancia bibliográfica semanal de PubMed, para el equipo y los tutores |

Abrir el enlace una vez con conexión y luego: **iPhone** (Safari) → Compartir → «Agregar a inicio»; **Android** (Chrome) → botón «Instalar» o menú ⋮ → «Instalar app». Después funciona sin internet y se actualiza sola en la siguiente apertura con conexión.

## Jerarquía de evidencia

ECCO, AGA y ACG con el mismo peso; ante discrepancia se muestran las tres posturas antes de concluir. ACTECCU (Rev Med Chile 2026) como referencia local. STRIDE-III (Lancet Gastroenterol Hepatol, octubre 2026) como marco de metas terapéuticas: accionables, adyuvantes y centradas en el paciente. Los fármacos en desarrollo (anti-TL1A, obefazimod, combinaciones de terapias avanzadas) están marcados como fase 2 o fase 3 y nunca presentados como estándar de manejo.

## Alcance

Material de estudio de postgrado, escrito para un lector con competencia clínica propia. No es una guía de práctica clínica, no reemplaza el juicio del equipo tratante y no sustituye la lectura de las guías originales que cita.

## Qué caduca primero

Cobertura de la Ley Ricarte Soto · registro sanitario ISP de las moléculas en Chile · estado del pipeline. Revisar los tres antes de cada uso docente.

## Licencia

Texto, selección de contenidos, redacción, edición y organización: © 2026 Moisés Oropeza. Todos los derechos reservados.

Se permite el uso personal con fines de estudio. Para uso docente, institucional o cualquier redistribución, contactar al autor.
