'use strict';

const { v4: uuidv4 } = require('uuid');
const db = require('./db/database');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function logHistorial({ automatizacion_id = null, empresa_id = null, tipo, accion, resultado, detalles = null, modulo = null, origen = 'sistema' }) {
  db.prepare(`
    INSERT INTO auto_historial (id, automatizacion_id, empresa_id, tipo, accion, resultado, detalles, modulo, origen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), automatizacion_id, empresa_id, tipo, accion, resultado, detalles, modulo, origen);
}

function crearAlerta({ tipo, nivel = 'info', mensaje, empresa_id = null, destinatario = 'super_admin' }) {
  db.prepare(`
    INSERT INTO alertas_sistema (id, tipo, nivel, mensaje, empresa_id, destinatario)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(uuidv4(), tipo, nivel, mensaje, empresa_id, destinatario);
}

// ─── Built-in system tasks ────────────────────────────────────────────────────

function activarCampanasProgramadas() {
  const resultado = db.prepare(`
    UPDATE campanas
    SET estado = 'activa', updated_at = datetime('now')
    WHERE estado = 'programada'
      AND fecha_inicio IS NOT NULL
      AND fecha_inicio <= datetime('now')
  `).run();

  if (resultado.changes > 0) {
    logHistorial({
      tipo: 'campana_activar',
      accion: `Activadas ${resultado.changes} campaña(s) programadas`,
      resultado: 'exito',
      modulo: 'marketing',
    });
  } else {
    logHistorial({
      tipo: 'campana_activar',
      accion: 'Verificar campañas programadas para activar',
      resultado: 'sin_accion',
      modulo: 'marketing',
    });
  }
}

function finalizarCampanasVencidas() {
  const resultado = db.prepare(`
    UPDATE campanas
    SET estado = 'finalizada', updated_at = datetime('now')
    WHERE estado IN ('activa','programada')
      AND fecha_fin IS NOT NULL
      AND fecha_fin <= datetime('now')
  `).run();

  if (resultado.changes > 0) {
    logHistorial({
      tipo: 'campana_finalizar',
      accion: `Finalizadas ${resultado.changes} campaña(s) vencidas`,
      resultado: 'exito',
      modulo: 'marketing',
    });
  } else {
    logHistorial({
      tipo: 'campana_finalizar',
      accion: 'Verificar campañas activas para finalizar',
      resultado: 'sin_accion',
      modulo: 'marketing',
    });
  }
}

function verificarSuscripciones() {
  // Mark expired subscriptions
  const vencidas = db.prepare(`
    UPDATE empresas
    SET estado_suscripcion = 'vencida'
    WHERE estado_suscripcion = 'activa'
      AND fecha_renovacion_plan IS NOT NULL
      AND fecha_renovacion_plan < datetime('now')
  `).run();

  if (vencidas.changes > 0) {
    // Pause user automations for companies with expired subs
    const empresasVencidas = db.prepare(`
      SELECT id, nombre FROM empresas
      WHERE estado_suscripcion = 'vencida'
        AND fecha_renovacion_plan < datetime('now')
    `).all();

    for (const emp of empresasVencidas) {
      db.prepare(`
        UPDATE automatizaciones SET estado = 'pausada', updated_at = datetime('now')
        WHERE empresa_id = ? AND estado = 'activa'
      `).run(emp.id);

      crearAlerta({
        tipo: 'suscripcion_vencida',
        nivel: 'warn',
        mensaje: `Suscripción vencida: ${emp.nombre} (ID: ${emp.id}). Automatizaciones pausadas.`,
        empresa_id: emp.id,
        destinatario: 'super_admin',
      });
    }

    logHistorial({
      tipo: 'verificar_suscripciones',
      accion: `Marcadas ${vencidas.changes} suscripción(es) como vencidas`,
      resultado: 'exito',
      modulo: 'planes',
    });
  } else {
    logHistorial({
      tipo: 'verificar_suscripciones',
      accion: 'Verificar estado de suscripciones',
      resultado: 'sin_accion',
      modulo: 'planes',
    });
  }

  // Alert subscriptions expiring in the next 7 days (avoid duplicate alerts same day)
  const proximasAVencer = db.prepare(`
    SELECT e.id, e.nombre, e.fecha_renovacion_plan
    FROM empresas e
    WHERE e.estado_suscripcion = 'activa'
      AND e.fecha_renovacion_plan IS NOT NULL
      AND e.fecha_renovacion_plan BETWEEN datetime('now') AND datetime('now', '+7 days')
      AND NOT EXISTS (
        SELECT 1 FROM alertas_sistema a
        WHERE a.empresa_id = e.id
          AND a.tipo = 'suscripcion_por_vencer'
          AND a.created_at >= datetime('now', '-1 day')
      )
  `).all();

  for (const emp of proximasAVencer) {
    crearAlerta({
      tipo: 'suscripcion_por_vencer',
      nivel: 'warn',
      mensaje: `Suscripción próxima a vencer: ${emp.nombre} — vence ${emp.fecha_renovacion_plan}`,
      empresa_id: emp.id,
      destinatario: 'super_admin',
    });
  }
}

// ─── User-defined automation executor ─────────────────────────────────────────

function calcularProximaEjecucion(condicion_tipo, condicion_config) {
  if (condicion_tipo === 'fecha_especifica') {
    return condicion_config.fecha || null;
  }
  if (condicion_tipo === 'cron') {
    // Simple next-execution: add interval from config
    const { hora, dias_semana, dia_mes } = condicion_config;
    const now = new Date();
    const [hh, mm] = (hora || '00:00').split(':').map(Number);
    const next = new Date(now);
    next.setSeconds(0);
    next.setMilliseconds(0);
    next.setHours(hh, mm, 0, 0);

    if (dias_semana && dias_semana.length > 0) {
      // Find the next matching weekday
      for (let d = 0; d <= 7; d++) {
        const candidate = new Date(next.getTime() + d * 86400000);
        if (d === 0 && candidate <= now) continue;
        if (dias_semana.includes(candidate.getDay())) {
          return candidate.toISOString().replace('T', ' ').substring(0, 19);
        }
      }
    } else if (dia_mes) {
      // Monthly on specific day
      next.setDate(dia_mes);
      if (next <= now) next.setMonth(next.getMonth() + 1);
      return next.toISOString().replace('T', ' ').substring(0, 19);
    } else {
      // Daily
      if (next <= now) next.setDate(next.getDate() + 1);
      return next.toISOString().replace('T', ' ').substring(0, 19);
    }
  }
  return null;
}

function debeEjecutar(auto, now) {
  if (auto.estado !== 'activa') return false;
  const config = JSON.parse(auto.condicion_config || '{}');

  if (auto.condicion_tipo === 'fecha_especifica') {
    if (!config.fecha) return false;
    const target = new Date(config.fecha);
    return target <= now && (!auto.ultima_ejecucion || new Date(auto.ultima_ejecucion) < target);
  }

  if (auto.condicion_tipo === 'cron') {
    const [hh, mm] = (config.hora || '00:00').split(':').map(Number);
    if (now.getHours() !== hh || now.getMinutes() !== mm) return false;

    // Avoid duplicate execution in same minute
    if (auto.ultima_ejecucion) {
      const last = new Date(auto.ultima_ejecucion);
      if (last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate() &&
          last.getHours() === now.getHours() &&
          last.getMinutes() === now.getMinutes()) {
        return false;
      }
    }

    if (config.dias_semana && config.dias_semana.length > 0) {
      return config.dias_semana.includes(now.getDay());
    }
    if (config.dia_mes) {
      return now.getDate() === config.dia_mes;
    }
    return true; // daily
  }

  return false;
}

function ejecutarAccion(auto, now) {
  const accion = JSON.parse(auto.accion_config || '{}');
  let resultado = 'sin_accion';
  let detalleMsg = null;

  try {
    if (auto.tipo === 'campana_activar' && accion.campana_id) {
      const r = db.prepare(`
        UPDATE campanas SET estado = 'activa', updated_at = datetime('now')
        WHERE id = ? AND empresa_id = ? AND estado IN ('borrador','programada','pausada')
      `).run(accion.campana_id, auto.empresa_id);
      resultado = r.changes > 0 ? 'exito' : 'sin_accion';
      detalleMsg = `campana_id=${accion.campana_id}`;

    } else if (auto.tipo === 'campana_pausar' && accion.campana_id) {
      const r = db.prepare(`
        UPDATE campanas SET estado = 'pausada', updated_at = datetime('now')
        WHERE id = ? AND empresa_id = ? AND estado = 'activa'
      `).run(accion.campana_id, auto.empresa_id);
      resultado = r.changes > 0 ? 'exito' : 'sin_accion';
      detalleMsg = `campana_id=${accion.campana_id}`;

    } else if (auto.tipo === 'campana_finalizar' && accion.campana_id) {
      const r = db.prepare(`
        UPDATE campanas SET estado = 'finalizada', updated_at = datetime('now')
        WHERE id = ? AND empresa_id = ? AND estado IN ('activa','programada')
      `).run(accion.campana_id, auto.empresa_id);
      resultado = r.changes > 0 ? 'exito' : 'sin_accion';
      detalleMsg = `campana_id=${accion.campana_id}`;

    } else if (auto.tipo === 'categoria_activar' && accion.categoria_id) {
      const r = db.prepare(`
        UPDATE categorias SET activo = 1, updated_at = datetime('now')
        WHERE id = ? AND empresa_id = ?
      `).run(accion.categoria_id, auto.empresa_id);
      resultado = r.changes > 0 ? 'exito' : 'sin_accion';
      detalleMsg = `categoria_id=${accion.categoria_id}`;

    } else if (auto.tipo === 'categoria_pausar' && accion.categoria_id) {
      const r = db.prepare(`
        UPDATE categorias SET activo = 0, updated_at = datetime('now')
        WHERE id = ? AND empresa_id = ?
      `).run(accion.categoria_id, auto.empresa_id);
      resultado = r.changes > 0 ? 'exito' : 'sin_accion';
      detalleMsg = `categoria_id=${accion.categoria_id}`;

    } else if (auto.tipo === 'recordatorio') {
      crearAlerta({
        tipo: 'recordatorio_usuario',
        nivel: 'info',
        mensaje: accion.mensaje || `Recordatorio: ${auto.nombre}`,
        empresa_id: auto.empresa_id,
        destinatario: 'empresa',
      });
      resultado = 'exito';
      detalleMsg = `mensaje="${accion.mensaje || auto.nombre}"`;
    }
  } catch (err) {
    resultado = 'error';
    detalleMsg = err.message;
  }

  // Update automation state
  const proxima = calcularProximaEjecucion(auto.condicion_tipo, JSON.parse(auto.condicion_config || '{}'));
  db.prepare(`
    UPDATE automatizaciones
    SET ultima_ejecucion = datetime('now'),
        proxima_ejecucion = ?,
        contador_ejecuciones = contador_ejecuciones + 1,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(proxima, auto.id);

  logHistorial({
    automatizacion_id: auto.id,
    empresa_id: auto.empresa_id,
    tipo: auto.tipo,
    accion: auto.nombre,
    resultado,
    detalles: detalleMsg,
    modulo: auto.tipo.startsWith('campana') ? 'marketing' : auto.tipo.startsWith('categoria') ? 'catalogo' : 'sistema',
    origen: 'sistema',
  });
}

function ejecutarAutomatizacionesUsuario() {
  const now = new Date();
  const autos = db.prepare(`
    SELECT * FROM automatizaciones WHERE estado = 'activa'
  `).all();

  for (const auto of autos) {
    if (debeEjecutar(auto, now)) {
      ejecutarAccion(auto, now);
    }
  }
}

// ─── Main tick ─────────────────────────────────────────────────────────────────

let tickCount = 0;

function tick() {
  const now = new Date();
  tickCount++;

  try {
    // Every tick (60s): M08 campaign state transitions
    activarCampanasProgramadas();
    finalizarCampanasVencidas();

    // Every tick: user-defined automations
    ejecutarAutomatizacionesUsuario();

    // Once per hour (first tick of each hour)
    if (now.getMinutes() === 0 || tickCount === 1) {
      verificarSuscripciones();
    }
  } catch (err) {
    console.error('[Scheduler] tick error:', err.message);
    logHistorial({
      tipo: 'scheduler_error',
      accion: 'tick',
      resultado: 'error',
      detalles: err.message,
      modulo: 'sistema',
    });
  }
}

// ─── Start ─────────────────────────────────────────────────────────────────────

function start() {
  tick(); // immediate first run
  setInterval(tick, 60 * 1000);
  console.log('[Scheduler] started — 60s interval');
}

module.exports = { start, logHistorial, crearAlerta };
