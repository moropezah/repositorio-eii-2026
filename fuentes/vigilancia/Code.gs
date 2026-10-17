/**
 * Vigilancia bibliográfica EII · conexión entre la app (GitHub Pages) y el Google Sheet.
 * Dr. Moisés Oropeza Hernández · octubre 2026
 *
 * Se pega en el Sheet "Vigilancia bibliográfica EII · PubMed semanal" (Extensiones → Apps Script)
 * y se implementa como aplicación web: Ejecutar como "Yo", Acceso "Cualquier usuario".
 *
 * Lectura (GET, sin clave): Registro, Lectura obligatoria, Bitácora semanal y Mi lectura.
 * Escritura (POST, con clave): solo la pestaña "Mi lectura" (estado, destacado y nota por PMID).
 * El script nunca modifica Registro, Lectura obligatoria ni Bitácora semanal: esas las llena la búsqueda semanal.
 */

// ── Cambia esta clave antes de implementar. Es la que escribirás una vez en la app para poder marcar y anotar.
const CLAVE = 'CAMBIA-ESTA-CLAVE';

const HOJA_REGISTRO = 'Registro';
const HOJA_LECTURA = 'Lectura obligatoria';
const HOJA_BITACORA = 'Bitácora semanal';
const HOJA_MARCAS = 'Mi lectura';
const ESTADOS = ['', 'Por leer', 'Leído'];

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'check') return json_({ ok: true, editor: p.key === CLAVE });
    return json_(Object.assign({ ok: true }, leerTodo_()));
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.key !== CLAVE) return json_({ ok: false, error: 'clave inválida' });
    if (body.action !== 'marcar') return json_({ ok: false, error: 'acción desconocida' });
    const lote = Array.isArray(body.cambios) ? body.cambios : [body];
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      lote.forEach(guardarMarca_);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true, guardados: lote.length, marcas: leerMarcas_() });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

// ── Lectura

function leerTodo_() {
  const ss = SpreadsheetApp.getActive();
  return {
    actualizado: new Date().toISOString(),
    registro: filas_(ss.getSheetByName(HOJA_REGISTRO), {
      'Ingreso': 'ingreso', 'Área': 'area', 'Pediatría': 'ped', 'Tipo': 'tipo', 'Fase (pipeline)': 'fase',
      'Nivel revista': 'nivel', 'Ajuste': 'ajuste', 'Puntaje': 'puntaje', 'Revista': 'revista', 'Título': 'titulo',
      'Autores': 'autores', 'Fecha e-pub': 'epub', 'Fecha revista': 'fecha', 'PMID': 'pmid', 'DOI': 'doi',
      'Lectura obligatoria': 'lectura', '¿Cambia la práctica?': 'cambia', 'Nota': 'nota'
    }, 'pmid'),
    lectura: filas_(ss.getSheetByName(HOJA_LECTURA), {
      'Corrida': 'semana', 'Semana': 'semana', 'Área': 'area', 'Estudio': 'estudio', 'Revista': 'revista', 'Tipo': 'tipo',
      'Hallazgo principal (según resumen PubMed)': 'hallazgo', '¿Cambia la práctica?': 'cambia', 'DOI': 'doi'
    }, 'doi'),
    bitacora: filas_(ss.getSheetByName(HOJA_BITACORA), {
      'Fecha': 'fecha', 'Ventana (fecha de entrada a PubMed)': 'ventana', 'Fuente / consultas': 'fuente',
      'Registros recuperados': 'recuperados', 'Agregados al Registro': 'agregados', 'Lectura obligatoria': 'lectura', 'Notas': 'notas'
    }, 'fecha'),
    marcas: leerMarcas_()
  };
}

/** Convierte una pestaña en objetos usando los encabezados de la fila 1. Omite filas sin la columna clave. */
function filas_(hoja, mapa, clave) {
  if (!hoja) return [];
  const v = hoja.getDataRange().getDisplayValues();
  if (v.length < 2) return [];
  const cab = v[0].map(function (h) { return mapa[String(h).trim()] || null; });
  const out = [];
  for (let i = 1; i < v.length; i++) {
    const o = {};
    cab.forEach(function (k, j) { if (k) o[k] = String(v[i][j] || '').trim(); });
    if (o[clave]) out.push(o);
  }
  return out;
}

function hojaMarcas_() {
  const ss = SpreadsheetApp.getActive();
  let h = ss.getSheetByName(HOJA_MARCAS);
  if (!h) {
    h = ss.insertSheet(HOJA_MARCAS);
    h.getRange(1, 1, 1, 5).setValues([['PMID', 'Estado', 'Destacado', 'Nota', 'Actualizado']]).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

function leerMarcas_() {
  const v = hojaMarcas_().getDataRange().getDisplayValues();
  const m = {};
  for (let i = 1; i < v.length; i++) {
    const pmid = String(v[i][0] || '').trim();
    if (pmid) m[pmid] = { estado: v[i][1], destacado: v[i][2] === 'Sí', nota: v[i][3], actualizado: v[i][4] };
  }
  return m;
}

// ── Escritura (solo "Mi lectura")

function guardarMarca_(c) {
  const pmid = String(c.pmid || '').replace(/\D/g, '');
  if (!pmid) throw new Error('PMID vacío');
  const h = hojaMarcas_();
  const datos = h.getDataRange().getDisplayValues();
  let fila = -1;
  for (let i = 1; i < datos.length; i++) if (String(datos[i][0]).trim() === pmid) { fila = i + 1; break; }
  const previo = fila > 0 ? datos[fila - 1] : [pmid, '', '', '', ''];
  const estado = c.estado !== undefined ? String(c.estado) : previo[1];
  if (ESTADOS.indexOf(estado) < 0) throw new Error('estado inválido: ' + estado);
  const destacado = c.destacado !== undefined ? (c.destacado ? 'Sí' : '') : previo[2];
  const nota = c.nota !== undefined ? String(c.nota).slice(0, 5000) : previo[3];
  const sello = Utilities.formatDate(new Date(), 'America/Santiago', 'yyyy-MM-dd HH:mm');
  const fila5 = [[pmid, estado, destacado, nota, sello]];
  if (fila > 0) {
    h.getRange(fila, 1, 1, 5).setNumberFormat('@').setValues(fila5);
  } else {
    h.getRange(h.getLastRow() + 1, 1, 1, 5).setNumberFormat('@').setValues(fila5);
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Ejecútala una vez desde el editor para autorizar el script y comprobar que lee el Sheet. */
function probar() {
  const d = leerTodo_();
  Logger.log('Registro: %s · Lectura obligatoria: %s · Bitácora: %s · Mi lectura: %s',
    d.registro.length, d.lectura.length, d.bitacora.length, Object.keys(d.marcas).length);
  if (CLAVE === 'CAMBIA-ESTA-CLAVE') Logger.log('Atención: todavía no cambias la CLAVE.');
}
