/**
 * RE.CA Service Worker
 * Estrategia: Network-first para API, Cache-first para assets estáticos.
 */

const CACHE_NAME = 'reca-v1';

const PRECACHE = [
  '/app/login/',
  '/app/login/registro.html',
  '/app/login/recuperar.html',
  '/app/dashboard/',
  '/shared/css/design-tokens.css',
  '/shared/js/auth.js',
  '/shared/js/api.js',
  '/manifest.json',
];

// ── Install: precache static assets ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: always network (never cache auth/data)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets: cache-first, update in background
  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});
