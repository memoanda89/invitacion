/**
 * ============================================================
 * GOOGLE APPS SCRIPT — Confirmación de Asistencia (RSVP)
 * ============================================================
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *
 * 1. Abre tu Google Sheet en drive.google.com
 *    - Columna A: invitado
 *    - Columna B: acompanante
 *    - Columna C: telefono       ← se llena automáticamente
 *    - Columna D: asistentes     ← quién confirmó
 *    - Columna E: fecha          ← timestamp de confirmación
 *    (La fila 1 debe ser la cabecera, los datos empiezan en fila 2)
 *
 * 2. Ve a Extensiones → Apps Script
 *
 * 3. Pega TODO este código y guarda.
 *
 * 4. Reemplaza SHEET_ID con el ID de tu Google Sheet.
 *    (El ID está en la URL: docs.google.com/spreadsheets/d/SHEET_ID/edit)
 *
 * 5. Ve a Implementar → Nueva implementación
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 *    → Copia la URL que te da (termina en /exec)
 *
 * 6. Pega esa URL en angular/src/app/core/services/guest-search.service.ts
 *    en la constante GAS_ENDPOINT.
 *
 * 7. Cada vez que modifiques el script, crea una NUEVA implementación
 *    (Implementar → Administrar implementaciones → Editar → Nueva versión).
 * ============================================================
 */

const SHEET_ID   = '1UmIV7J4VNhSgHK8s7GizN4CDD_xr9QfhIAcYxWTe63A';
const SHEET_NAME = 'Invitados'; // Nombre de la pestaña en tu Google Sheet

// ── Utilidad: normaliza texto (sin acentos, minúsculas) ────────────────────

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

// ── Respuesta JSONP ────────────────────────────────────────────────────────

function jsonpResponse(callback, data) {
  var json = JSON.stringify(data);
  return ContentService
    .createTextOutput(callback + '(' + json + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// ── Punto de entrada GET ───────────────────────────────────────────────────

function doGet(e) {
  var callback = e.parameter.callback || 'callback';
  var action   = e.parameter.action   || 'search';

  try {
    if (action === 'search') {
      return handleSearch(e, callback);
    }
    if (action === 'confirm') {
      return handleConfirm(e, callback);
    }
    return jsonpResponse(callback, { error: 'Acción desconocida' });
  } catch (err) {
    return jsonpResponse(callback, { error: err.message });
  }
}

// ── Búsqueda de invitados ──────────────────────────────────────────────────

function handleSearch(e, callback) {
  var query = normalize(e.parameter.q || '');
  if (query.length < 2) {
    return jsonpResponse(callback, { results: [] });
  }

  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  var data  = sheet.getDataRange().getValues();
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var invitado    = data[i][0] ? String(data[i][0]) : '';
    var acompanante = data[i][1] ? String(data[i][1]) : '';

    if (
      normalize(invitado).indexOf(query) !== -1 ||
      normalize(acompanante).indexOf(query) !== -1
    ) {
      results.push({
        id:          i + 1, // fila real (1-indexed) para actualizar después
        invitado:    invitado,
        acompanante: acompanante,
        confirmado:  !!(data[i][3])
      });
    }
  }

  return jsonpResponse(callback, { results: results });
}

// ── Confirmación ───────────────────────────────────────────────────────────

function handleConfirm(e, callback) {
  var id         = parseInt(e.parameter.id, 10);  // id del invitado (1, 2, 3...)
  var phone      = e.parameter.phone      || '';
  var asistentes = e.parameter.asistentes || '';   // nombres separados por '|'

  if (!id || id < 1) {
    return jsonpResponse(callback, { success: false, error: 'ID inválido' });
  }

  // +1 porque la fila 1 de la hoja es el encabezado;
  // el primer invitado (id=1) vive en la fila 2, y así sucesivamente.
  var rowNum = id + 1;

  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  sheet.getRange(rowNum, 3).setValue(phone);                           // Col C: telefono
  sheet.getRange(rowNum, 4).setValue(asistentes.replace(/\|/g, ', ')); // Col D: asistentes
  sheet.getRange(rowNum, 5).setValue(new Date().toLocaleString('es-MX')); // Col E: fecha

  return jsonpResponse(callback, { success: true });
}
