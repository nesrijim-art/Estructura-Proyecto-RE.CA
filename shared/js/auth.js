/**
 * RE.CA Auth Module — shared session manager
 * Módulo ES6. Importar desde cualquier página de la aplicación.
 */

const SESSION_KEY = 'reca_session';

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Decode JWT payload without verification (client-side only for expiry check) */
function decodePayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const session = getSession();
  if (!session?.access_token) return false;
  const payload = decodePayload(session.access_token);
  if (!payload) return false;
  return payload.exp > Date.now() / 1000;
}

export function getAccessToken() {
  return getSession()?.access_token ?? null;
}

export function getUser() {
  return getSession()?.user ?? null;
}

/**
 * Guard for protected pages.
 * Call at the top of any page that requires authentication.
 * Returns false and redirects if not authenticated.
 */
export function requireAuth(loginPath = '/app/login/') {
  if (!isAuthenticated()) {
    window.location.href = loginPath;
    return false;
  }
  return true;
}

/**
 * Guard for guest-only pages (login, registro).
 * Redirects to dashboard if already authenticated.
 */
export function requireGuest(dashboardPath = '/app/dashboard/') {
  if (isAuthenticated()) {
    window.location.href = dashboardPath;
    return false;
  }
  return true;
}
