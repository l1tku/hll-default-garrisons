const CACHE_NAME = 'hll-garrisons-cache-v4';

// Install: Force activate immediately
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// Activate: Clean up old caches and take control
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network First -> Cache Fallback
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then((networkResponse) => {
      // Valid network response - update cache and return
      if (networkResponse && networkResponse.status === 200) {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
      }
      return networkResponse;
    }).catch(() => {
      // Network failed - try cache
      return caches.match(e.request).then((cachedResponse) => {
        return cachedResponse || new Response('Not found', { status: 404 });
      });
    })
  );
});
