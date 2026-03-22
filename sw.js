// Service Worker for INIT IDEA - PWA Support v2.0.3
// FIXED: waitUntil syntax + removed non-existent GSAP URLs
const CACHE_NAME = 'init-idea-v2.0.3';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './logo2.0.jpeg',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache opened');
        // addAll fails if ANY url fails - use individual adds to be resilient
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(e => console.warn('[SW] Failed to cache:', url, e)))
        );
      })
  );
});

// Fetch event - network first for navigation, cache first for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET and cross-origin video requests (never cache videos)
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.match(/\.(mp4|webm|ogg)$/i)) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).catch(() => {
          // If both cache and network fail, return nothing gracefully
        });
      })
  );
});

// Activate event - FIXED: single Promise.all in waitUntil
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});