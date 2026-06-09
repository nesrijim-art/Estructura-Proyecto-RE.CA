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
  multiempresa: {
    stats:          ()             => request('/multiempresa/stats'),
    listar:         (params = {})  => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/multiempresa/empresas' + (qs ? '?' + qs : ''));
    },
    obtener:        (id)           => request(`/multiempresa/empresas/${id}`),
    crear:          (body)         => request('/multiempresa/empresas',               { method: 'POST', body: JSON.stringify(body) }),
    cambiarEstado:  (id, estado)   => request(`/multiempresa/empresas/${id}/estado`,  { method: 'PUT',  body: JSON.stringify({ estado }) }),
    guardarNotas:   (id, notas)    => request(`/multiempresa/empresas/${id}/notas`,   { method: 'PUT',  body: JSON.stringify({ notas_soporte: notas }) }),
  },
  planes: {
    list:        ()              => request('/planes'),
    miPlan:      ()              => request('/planes/mi-plan'),
    historial:   ()              => request('/planes/historial'),
    cambiarPlan: (empresaId, body) => request(`/planes/empresa/${empresaId}`, { method: 'PUT', body: JSON.stringify(body) }),
    crearPlan:   (body)          => request('/planes',    { method: 'POST', body: JSON.stringify(body) }),
    editarPlan:  (id, body)      => request(`/planes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  },
  auth: {
    login:           (body) => request('/auth/login',           { method: 'POST', body: JSON.stringify(body) }),
    register:        (body) => request('/auth/register',        { method: 'POST', body: JSON.stringify(body) }),
    logout:          ()     => request('/auth/logout',          { method: 'POST' }),
    forgotPassword:  (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
    resetPassword:     (body)       => request('/auth/reset-password',          { method: 'POST', body: JSON.stringify(body) }),
    refresh:           ()           => request('/auth/refresh',                 { method: 'POST' }),
    me:                ()           => request('/auth/me'),
    impersonate:       (empresaId)  => request(`/auth/impersonate/${empresaId}`, { method: 'POST' }),
    stopImpersonating: ()           => request('/auth/stop-impersonating',      { method: 'POST' }),
  },
};
