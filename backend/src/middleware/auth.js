'use strict';

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Normalize impersonation fields so all routes can rely on them
    req.user = {
      ...payload,
      impersonating:              payload.impersonating              ?? false,
      impersonating_empresa_id:   payload.impersonating_empresa_id   ?? null,
    };
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Sesión expirada'
      : 'Token inválido';
    res.status(401).json({ message: msg });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
