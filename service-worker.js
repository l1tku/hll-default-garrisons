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

// Fetch: Disable interception - let all requests pass through network
// This prevents service worker errors with GitHub Pages
self.addEventListener('fetch', (e) => {
  // Do nothing - let browser handle all requests normally
  return;
});
