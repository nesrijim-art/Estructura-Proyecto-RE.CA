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
  catalogo: {
    stats:             ()              => request('/catalogo/stats'),
    // Categorías
    listarCategorias:  ()              => request('/catalogo/categorias'),
    crearCategoria:    (body)          => request('/catalogo/categorias',          { method: 'POST',   body: JSON.stringify(body) }),
    editarCategoria:   (id, body)      => request(`/catalogo/categorias/${id}`,    { method: 'PUT',    body: JSON.stringify(body) }),
    reordenarCats:     (orden)         => request('/catalogo/categorias/reordenar',{ method: 'PUT',    body: JSON.stringify({ orden }) }),
    eliminarCategoria: (id)            => request(`/catalogo/categorias/${id}`,    { method: 'DELETE' }),
    // Productos
    listarProductos:   (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/catalogo/productos' + (qs ? '?' + qs : ''));
    },
    crearProducto:     (body)          => request('/catalogo/productos',            { method: 'POST',   body: JSON.stringify(body) }),
    obtenerProducto:   (id)            => request(`/catalogo/productos/${id}`),
    editarProducto:    (id, body)      => request(`/catalogo/productos/${id}`,      { method: 'PUT',    body: JSON.stringify(body) }),
    cambiarEstado:     (id, estado)    => request(`/catalogo/productos/${id}/estado`, { method: 'PUT',  body: JSON.stringify({ estado }) }),
    reordenarProds:    (orden)         => request('/catalogo/productos/reordenar',  { method: 'PUT',    body: JSON.stringify({ orden }) }),
    eliminarProducto:  (id)            => request(`/catalogo/productos/${id}`,      { method: 'DELETE' }),
  },
  multimedia: {
    stats:        ()              => request('/multimedia/stats'),
    listar:       (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/multimedia' + (qs ? '?' + qs : ''));
    },
    obtener:      (id)            => request(`/multimedia/${id}`),
    usos:         (id)            => request(`/multimedia/${id}/usos`),
    renombrar:    (id, nombre)    => request(`/multimedia/${id}`, { method: 'PUT', body: JSON.stringify({ nombre }) }),
    eliminar:     (id)            => request(`/multimedia/${id}`, { method: 'DELETE' }),
    subir: (form) => {
      const token = getAccessToken();
      return fetch('/api/multimedia/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: form,
      }).then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(d.message || `Error ${r.status}`), { status: r.status, data: d });
        return d;
      });
    },
    reemplazar: (id, form) => {
      const token = getAccessToken();
      return fetch(`/api/multimedia/${id}/reemplazar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: form,
      }).then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(d.message || `Error ${r.status}`), { status: r.status, data: d });
        return d;
      });
    },
    mejoraIa:    (id)             => request(`/multimedia/${id}/mejora-ia`,   { method: 'POST' }),
    aprobarIa:   (id)             => request(`/multimedia/${id}/aprobar-ia`,  { method: 'POST' }),
    agregarRef:  (body)           => request('/multimedia/refs',              { method: 'POST', body: JSON.stringify(body) }),
    eliminarRef: (refId)          => request(`/multimedia/refs/${refId}`,     { method: 'DELETE' }),
  },
  usuarios: {
    listar:               ()              => request('/usuarios'),
    invitaciones:         ()              => request('/usuarios/invitaciones'),
    invitar:              (body)          => request('/usuarios/invitar',                  { method: 'POST', body: JSON.stringify(body) }),
    validarToken:         (token)         => request(`/usuarios/invitacion/${token}`),
    registroColaborador:  (body)          => request('/usuarios/registro-colaborador',     { method: 'POST', body: JSON.stringify(body) }),
    cambiarRol:           (id, rol)       => request(`/usuarios/${id}/rol`,                { method: 'PUT',  body: JSON.stringify({ rol_empresa: rol }) }),
    cambiarEstado:        (id, activo)    => request(`/usuarios/${id}/estado`,             { method: 'PUT',  body: JSON.stringify({ activo }) }),
    eliminar:             (id)            => request(`/usuarios/${id}`,                    { method: 'DELETE' }),
  },
  identidad: {
    obtener:        ()      => request('/identidad-visual'),
    subirLogo: (form) => {
      const token = getAccessToken();
      return fetch('/api/identidad-visual/logo', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: form,
      }).then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw Object.assign(new Error(d.message || `Error ${r.status}`), { status: r.status, data: d });
        return d;
      });
    },
    actualizarColores:  (body) => request('/identidad-visual/colores',  { method: 'PUT', body: JSON.stringify(body) }),
    actualizarContacto: (body) => request('/identidad-visual/contacto', { method: 'PUT', body: JSON.stringify(body) }),
    eliminarLogo:       ()     => request('/identidad-visual/logo',     { method: 'DELETE' }),
  },
  stats: {
    // Public endpoints (no auth) — called from public menu with sendBeacon
    visita:   (body) => request('/stats/visita',  { method: 'POST', body: JSON.stringify(body) }),
    evento:   (body) => request('/stats/evento',  { method: 'POST', body: JSON.stringify(body) }),
    // Protected endpoints
    resumen:  (params = {}) => {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
      return request('/stats/resumen' + (qs ? '?' + qs : ''));
    },
    trafico:  (params = {}) => {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
      return request('/stats/trafico' + (qs ? '?' + qs : ''));
    },
    productos: (params = {}) => {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
      return request('/stats/productos' + (qs ? '?' + qs : ''));
    },
    idiomas:  (params = {}) => {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
      return request('/stats/idiomas' + (qs ? '?' + qs : ''));
    },
    contacto: (params = {}) => {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
      return request('/stats/contacto' + (qs ? '?' + qs : ''));
    },
    global:   (params = {}) => {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null)).toString();
      return request('/stats/global' + (qs ? '?' + qs : ''));
    },
  },
  ia: {
    quota:               ()              => request('/ia/quota'),
    stats:               ()              => request('/ia/stats'),
    generarDescripcion:  (body)          => request('/ia/generar-descripcion', { method: 'POST', body: JSON.stringify(body) }),
    traducir:            (body)          => request('/ia/traducir',            { method: 'POST', body: JSON.stringify(body) }),
    historial:           (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/ia/historial' + (qs ? '?' + qs : ''));
    },
    obtenerHistorial:    (id)            => request(`/ia/historial/${id}`),
    actualizarHistorial: (id, body)      => request(`/ia/historial/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  },
  marketing: {
    stats:            ()              => request('/marketing/stats'),
    // Campañas
    listarCampanas:   (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/marketing/campanas' + (qs ? '?' + qs : ''));
    },
    calendario:       (year, month)   => request(`/marketing/campanas/calendario?year=${year}&month=${month}`),
    obtenerCampana:   (id)            => request(`/marketing/campanas/${id}`),
    crearCampana:     (body)          => request('/marketing/campanas',                { method: 'POST',   body: JSON.stringify(body) }),
    editarCampana:    (id, body)      => request(`/marketing/campanas/${id}`,          { method: 'PUT',    body: JSON.stringify(body) }),
    cambiarEstadoCampana: (id, estado) => request(`/marketing/campanas/${id}/estado`,  { method: 'PUT',    body: JSON.stringify({ estado }) }),
    duplicarCampana:  (id)            => request(`/marketing/campanas/${id}/duplicar`, { method: 'POST' }),
    eliminarCampana:  (id)            => request(`/marketing/campanas/${id}`,          { method: 'DELETE' }),
    statsCampana:     (id)            => request(`/marketing/campanas/${id}/stats`),
    // Contenido generado
    listarContenido:  (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/marketing/contenido' + (qs ? '?' + qs : ''));
    },
    crearContenido:   (body)          => request('/marketing/contenido',               { method: 'POST',   body: JSON.stringify(body) }),
    editarContenido:  (id, body)      => request(`/marketing/contenido/${id}`,         { method: 'PUT',    body: JSON.stringify(body) }),
    estadoContenido:  (id, estado)    => request(`/marketing/contenido/${id}/estado`,  { method: 'PUT',    body: JSON.stringify({ estado }) }),
    eliminarContenido:(id)            => request(`/marketing/contenido/${id}`,         { method: 'DELETE' }),
    // Productos destacados
    listarDestacados: ()              => request('/marketing/destacados'),
    agregarDestacado: (body)          => request('/marketing/destacados',              { method: 'POST',   body: JSON.stringify(body) }),
    editarDestacado:  (id, body)      => request(`/marketing/destacados/${id}`,        { method: 'PUT',    body: JSON.stringify(body) }),
    quitarDestacado:  (id)            => request(`/marketing/destacados/${id}`,        { method: 'DELETE' }),
  },
  automatizaciones: {
    stats:          ()              => request('/automatizaciones/stats'),
    // Automatizaciones (Premium)
    listar:         (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/automatizaciones' + (qs ? '?' + qs : ''));
    },
    obtener:        (id)            => request(`/automatizaciones/${id}`),
    crear:          (body)          => request('/automatizaciones',                { method: 'POST', body: JSON.stringify(body) }),
    editar:         (id, body)      => request(`/automatizaciones/${id}`,          { method: 'PUT',  body: JSON.stringify(body) }),
    cambiarEstado:  (id, estado)    => request(`/automatizaciones/${id}/estado`,   { method: 'PUT',  body: JSON.stringify({ estado }) }),
    eliminar:       (id)            => request(`/automatizaciones/${id}`,          { method: 'DELETE' }),
    // Historial
    historial:      (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/automatizaciones/historial/lista' + (qs ? '?' + qs : ''));
    },
    // Alertas
    alertas:        (params = {})   => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString();
      return request('/automatizaciones/alertas/lista' + (qs ? '?' + qs : ''));
    },
    leerAlerta:     (id)            => request(`/automatizaciones/alertas/${id}/leer`, { method: 'PUT' }),
    leerTodasAlertas: ()            => request('/automatizaciones/alertas/leer-todas', { method: 'PUT' }),
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
