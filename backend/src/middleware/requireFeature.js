'use strict';

const db = require('../db/database');

/**
 * Factory middleware — checks if a feature flag is enabled for the request's empresa.
 * Usage: router.get('/some-route', requireAuth, requireFeature('ia_texto'), handler)
 */
function requireFeature(featureName) {
  return (req, res, next) => {
    const empresaId = req.user?.impersonating
      ? req.user.impersonating_empresa_id
      : req.user?.empresa_id;

    if (!empresaId) {
      return res.status(403).json({ message: 'Sin empresa asociada', feature: featureName });
    }

    const row = db.prepare(`
      SELECT p.${featureName}
      FROM empresas e
      LEFT JOIN planes p ON e.plan_id = p.id
      WHERE e.id = ?
    `).get(empresaId);

    if (!row || !row[featureName]) {
      return res.status(403).json({
        message: `Tu plan no incluye acceso a esta funcionalidad`,
        feature: featureName,
        upgrade_required: true,
      });
    }

    next();
  };
}

module.exports = { requireFeature };
