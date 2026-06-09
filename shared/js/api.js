/**
 * RE.CA API Client — shared HTTP utility
 * Módulo ES6. Wraps fetch con auth headers y manejo de errores centralizado.
 */

import { getAccessToken, clearSession } from './auth.js';

const API_BASE = '/api';

async function request(path, options = {}) {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include', // needed for httpOnly refresh cookie
  });

  // 401 on a protected route means session expired — clear local state
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    clearSession();
    throw Object.assign(new Error(data.message || 'Sesión expirada'), { status: 401, data });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw Object.assign(
      new Error(data.message || `Error ${res.status}`),
      { status: res.status, data }
    );
  }

  return data;
}

export const api = {
  auth: {
    login:           (body) => request('/auth/login',           { method: 'POST', body: JSON.stringify(body) }),
    register:        (body) => request('/auth/register',        { method: 'POST', body: JSON.stringify(body) }),
    logout:          ()     => request('/auth/logout',          { method: 'POST' }),
    forgotPassword:  (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
    resetPassword:   (body) => request('/auth/reset-password',  { method: 'POST', body: JSON.stringify(body) }),
    refresh:         ()     => request('/auth/refresh',         { method: 'POST' }),
    me:              ()     => request('/auth/me'),
  },
};
