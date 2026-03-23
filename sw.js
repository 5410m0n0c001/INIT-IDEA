// ============================================================
//  INIT IDEA — Service Worker v4
//  Cambios vs versión anterior:
//  - NUNCA cachea .mp4 (causa crashes por RAM en móvil)
//  - Limpia caches viejos automáticamente en activate
//  - Estrategia network-first para HTML (siempre fresco)
//  - Estrategia cache-first para assets estáticos (CSS/JS/img)
//  - Incrementa CACHE_VERSION en cada deploy importante
// ============================================================

const CACHE_VERSION = 'v5';
const CACHE_STATIC  = `init-idea-static-${CACHE_VERSION}`;
const CACHE_DYNAMIC = `init-idea-dynamic-${CACHE_VERSION}`;

// Activos que se pre-cachean al instalar el SW
// ⚠️ NO incluir .mp4 — se sirven directo desde red siempre
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/logo2.0.jpeg',
  '/contact.vcf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;600&display=swap',
];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()) // activa el SW nuevo de inmediato
      .catch(err => console.warn('[SW] Pre-cache falló:', err))
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', event => {
  const validCaches = [CACHE_STATIC, CACHE_DYNAMIC];

  event.waitUntil(
    caches.keys()
      .then(allCaches =>
        Promise.all(
          allCaches
            .filter(name => !validCaches.includes(name))
            .map(name => {
              console.log('[SW] Eliminando cache viejo:', name);
              return caches.delete(name);
            })
        )
      )
      .then(() => self.clients.claim()) // toma control de tabs abiertas
  );
});

// ── FETCH ────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Ignorar requests que no son GET
  if (request.method !== 'GET') return;

  // 2. ⚠️ CRÍTICO: Nunca interceptar videos MP4
  //    Dejar que el browser maneje el streaming y range requests
  if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
    return; // no llamar event.respondWith → browser maneja solo
  }

  // 3. HTML principal → Network First (siempre contenido fresco)
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 4. Assets estáticos (CSS, JS, imágenes, fonts) → Cache First
  if (
    url.pathname.match(/\.(css|js|jpeg|jpg|png|webp|svg|ico|woff2|woff|ttf)$/) ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'cdnjs.cloudflare.com'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 5. Todo lo demás → Network First con fallback a cache
  event.respondWith(networkFirst(request));
});

// ── ESTRATEGIAS ──────────────────────────────────────────────

// Cache First: sirve desde cache, si no existe va a red y guarda
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Asset no disponible offline', { status: 503 });
  }
}

// Network First: intenta red, si falla usa cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback para navegación offline
    if (request.mode === 'navigate') {
      const offlineFallback = await caches.match('/index.html');
      if (offlineFallback) return offlineFallback;
    }

    return new Response('Sin conexión', { status: 503 });
  }
}