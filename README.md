# Repositorio EII 2026

Material de estudio de enfermedad inflamatoria intestinal (EII) para postgrado de gastroenterología, con la disponibilidad real de fármacos en Chile declarada en cada decisión terapéutica.

**Autor:** Dr. Moisés Oropeza — Médico Internista, Residente de Gastroenterología, Universidad de los Andes (Clínica Dávila / Clínica Universidad de los Andes). Santiago de Chile, septiembre 2026.

## Contenido

| Módulo | Qué es |
|---|---|
| 01 | **Guía de estudio EII 2026** — 27 secciones, de concepto básico a manejo avanzado: arquitectura diagnóstica, scores, terapias por mecanismo, complicaciones, cirugía y poblaciones especiales. Con flashcards y quiz de 18 preguntas. |
| 02 | **Clase de actualización 2026** — el paciente difícil de tratar en tres ejes (Parigi 2023): falla real al tratamiento, fenotipo y factores del paciente. Epidemiología chilena (ChilEii), brecha de acceso, VARSITY, secuenciación, recurrencia posquirúrgica, trastornos del reservorio, embarazo y adulto mayor. |
| 03 | **Índice de láminas** — catálogo de las 36 figuras de apoyo en 9 grupos temáticos, con buscador. Ver nota sobre imágenes más abajo. |
| 04 | **Consulta rápida** — qué hay y qué no hay en Chile, criterios de falla y conducta según monitorización terapéutica (TDM), umbrales de colitis aguda grave, objetivos STRIDE-II, checklist prebiológico, poblaciones especiales y tabla de scores. |
| 05 | **Quiz EII v6.1** — 220 casos clínicos con retroalimentación razonada (pieza independiente). |
| 06 | **Decisión Terapéutica EII** — herramienta paso a paso para CU y enfermedad de Crohn en adultos: fenotipo, línea terapéutica, comorbilidades y manifestaciones extraintestinales → escalones de tratamiento con lo disponible en Chile primero, cinética de respuesta, niveles, presentación para la receta, checklist previo al inicio y calculadora de fragilidad (Fried / escala clínica). En `decision/`. |

## Sobre las imágenes

**Esta versión no incluye las láminas de apoyo.** Son material docente de **Beatriz Gros**, publicado en [www.ibd-eii.com](https://www.ibd-eii.com), y no se redistribuyen aquí.

El Módulo 03 conserva el **índice completo de las 36 figuras**, con su título y tema, para que el lector identifique cuál cubre cada contenido y la consulte directamente en la fuente original. Lo mismo en los bloques "Láminas de apoyo" intercalados en los módulos 01 y 02.

## Estructura de archivos

```
index.html        · repositorio: portada y módulos 02, 03 y 04 (rutas internas #clase, #atlas, #rapida, #fuentes)
guia-2026.html    · módulo 01, documento completo con navegación propia
quiz/index.html   · módulo 05, Quiz EII v6.1 (220 casos)
decision/index.html · módulo 06, herramienta de decisión terapéutica (autocontenida)
manifest.webmanifest, sw.js, icons/            · app instalable completa (EII 2026)
decision/manifest.webmanifest, decision/sw.js  · app instalable solo de decisión
.nojekyll         · evita el procesamiento Jekyll en GitHub Pages
```

Sitio estático puro: sin compilación, sin servidor, sin dependencias. Funciona abriendo `index.html` directamente o publicado con GitHub Pages.

## Apps instalables (funcionan sin conexión)

| App | Enlace | Contenido |
|---|---|---|
| **EII 2026** | https://moropezah.github.io/repositorio-eii-2026/ | Repositorio completo: guía, clase, consulta rápida, quiz y decisión terapéutica |
| **Decisión EII** | https://moropezah.github.io/repositorio-eii-2026/decision/ | Solo la herramienta de decisión terapéutica, para compartir con el equipo |

Abrir el enlace una vez con conexión y luego: **iPhone** (Safari) → Compartir → «Agregar a inicio»; **Android** (Chrome) → botón «Instalar» o menú ⋮ → «Instalar app». Después funciona sin internet y se actualiza sola en la siguiente apertura con conexión.

## Jerarquía de evidencia

ECCO, AGA y ACG con el mismo peso; ante discrepancia se muestran las tres posturas antes de concluir. ACTECCU (Rev Med Chile 2026) como referencia local. STRIDE-II como marco de objetivos terapéuticos. Los fármacos en desarrollo (anti-TL1A, obefazimod, combinaciones de terapias avanzadas) están marcados como fase 2 o fase 3 y nunca presentados como estándar de manejo.

## Alcance

Material de estudio de postgrado, escrito para un lector con competencia clínica propia. No es una guía de práctica clínica, no reemplaza el juicio del equipo tratante y no sustituye la lectura de las guías originales que cita.

## Qué caduca primero

Cobertura de la Ley Ricarte Soto · registro sanitario ISP de las moléculas en Chile · estado del pipeline. Revisar los tres antes de cada uso docente.

## Licencia

Texto, selección de contenidos, redacción, edición y organización: © 2026 Moisés Oropeza. Todos los derechos reservados.

Se permite el uso personal con fines de estudio. Para uso docente, institucional o cualquier redistribución, contactar al autor.
