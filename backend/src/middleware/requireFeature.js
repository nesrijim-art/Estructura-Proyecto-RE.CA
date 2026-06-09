'use strict';

const db = require('../db/database');

// Explicit allowlist — only these columns may be queried as feature flags.
// Adding a new flag requires updating both this set and the planes table.
const VALID_FEATURES = new Set([
  'ia_texto',
  'ia_imagenes',
  'analytics_basico',
  'analytics_avanzado',
  'marketing_basico',
  'marketing_avanzado',
  'automatizaciones',
  'menu_dinamico',
  'calendario_ia',
  'publicaciones_automaticas',
]);

/**
 * Factory middleware — checks if a feature flag is enabled for the request's empresa.
 * Usage: router.get('/some-route', requireAuth, requireFeature('ia_texto'), handler)
 *
 * Falls back to the legacy `plan` text field for empresas that predate M05
 * and have not yet been assigned a plan_id.
 */
function requireFeature(featureName) {
  if (!VALID_FEATURES.has(featureName)) {
    // Fail at server startup (when the router is first loaded), not at request time.
    throw new Error(`requireFeature: '${featureName}' is not a valid feature flag`);
  }

  // Pre-compile the statement once per middleware instance — safe, no interpolation at request time.
  const stmt = db.prepare(`
    SELECT
      e.plan_id,
      e.plan        AS legacy_plan,
      p.${featureName} AS flag_from_plan_id
    FROM empresas e
    LEFT JOIN planes p ON e.plan_id = p.id
    WHERE e.id = ?
  `);

  return (req, res, next) => {
    const empresaId = req.user?.impersonating
      ? req.user.impersonating_empresa_id
      : req.user?.empresa_id;

    if (!empresaId) {
      return res.status(403).json({ message: 'Sin empresa asociada', feature: featureName });
    }

    const row = stmt.get(empresaId);

    if (!row) {
      return res.status(403).json({ message: 'Empresa no encontrada', feature: featureName });
    }

    // Happy path: empresa has a plan_id — use the join result directly.
    if (row.plan_id !== null) {
      if (row.flag_from_plan_id) return next();
      return res.status(403).json({
        message: 'Tu plan no incluye acceso a esta funcionalidad',
        feature: featureName,
        upgrade_required: true,
      });
    }

    // Fallback path: empresa was registered before M05 and still uses the legacy
    // text 'plan' column. Look up the flag from the matching seed plan row.
    const legacyPlanId = row.legacy_plan || 'start';
    const legacyRow = db.prepare(
      `SELECT ${featureName} AS flag FROM planes WHERE id = ?`
    ).get(legacyPlanId);

    if (legacyRow && legacyRow.flag) return next();

    return res.status(403).json({
      message: 'Tu plan no incluye acceso a esta funcionalidad',
      feature: featureName,
      upgrade_required: true,
    });
  };
}

module.exports = { requireFeature, VALID_FEATURES };
