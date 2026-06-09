'use strict';

const db = require('../db/database');

/**
 * Checks the intra-empresa role (dueno|admin|editor|visualizador).
 * Must be used AFTER requireAuth.
 *
 * super_admin always passes (they access via impersonation with full context).
 * The resolved rol_empresa is attached to req.user for downstream use.
 */
function requireEmpresaRole(...roles) {
  return (req, res, next) => {
    // Super admin always has unrestricted access
    if (req.user?.role === 'super_admin') {
      req.user.rol_empresa = 'dueno';
      return next();
    }

    const row = db.prepare(
      'SELECT rol_empresa FROM users WHERE id = ?'
    ).get(req.user?.sub);

    if (!row) {
      return res.status(403).json({ message: 'Usuario no encontrado' });
    }

    req.user.rol_empresa = row.rol_empresa;

    if (!roles.includes(row.rol_empresa)) {
      return res.status(403).json({
        message: 'Acceso denegado: tu rol no tiene permisos para esta acción',
        required: roles,
        actual: row.rol_empresa,
      });
    }

    next();
  };
}

module.exports = { requireEmpresaRole };
