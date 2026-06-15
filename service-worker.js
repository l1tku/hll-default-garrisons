const CACHE_PREFIX = 'hll-default-garrisons-cache';
const CACHE_VERSION = 'v10';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VERSION}`;
const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './CHANGELOG.md',
  './css/style.css?v=3.37',
  './js/maps.js',
  './js/script.js?v=3.37',
  './images/favicon.png',
  './images/favicon.webp',
  './images/favicon_artillery.png',
  './images/favicon_artillery.webp',
  './images/favicon_spa.png',
  './images/favicon_spa.webp',
  './images/github.png',
  './images/github.webp',
  './images/icon-180.png',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/flags/all.webp',
  './images/flags/all_60.webp',
  './images/flags/can.webp',
  './images/flags/can_60.webp',
  './images/flags/gb.webp',
  './images/flags/gb_60.webp',
  './images/flags/ger.webp',
  './images/flags/ger_60.webp',
  './images/flags/rus.webp',
  './images/flags/rus_60.webp',
  './images/flags/us.webp',
  './images/flags/us_60.webp',
  './images/maps/map_carentan.webp',
  './images/maps/map_driel.webp',
  './images/maps/map_elalamein.webp',
  './images/maps/map_elsenborn.webp',
  './images/maps/map_foy.webp',
  './images/maps/map_hill400.webp',
  './images/maps/map_hurtgen.webp',
  './images/maps/map_juno_beach.webp',
  './images/maps/map_kharkov.webp',
  './images/maps/map_kursk.webp',
  './images/maps/map_mortain.webp',
  './images/maps/map_omaha.webp',
  './images/maps/map_purpleheartlane.webp',
  './images/maps/map_remagen.webp',
  './images/maps/map_smdmv2.webp',
  './images/maps/map_smolensk.webp',
  './images/maps/map_stalingrad.webp',
  './images/maps/map_stmereeglise.webp',
  './images/maps/map_tobruk.webp',
  './images/maps/map_utahbeach.webp',
  './images/maps/thumbnail/CAR.webp',
  './images/maps/thumbnail/DRI.webp',
  './images/maps/thumbnail/EBR.webp',
  './images/maps/thumbnail/ELA.webp',
  './images/maps/thumbnail/FOY.webp',
  './images/maps/thumbnail/H4.webp',
  './images/maps/thumbnail/HUR.webp',
  './images/maps/thumbnail/JUN.webp',
  './images/maps/thumbnail/KHA.webp',
  './images/maps/thumbnail/KUR.webp',
  './images/maps/thumbnail/MOR.webp',
  './images/maps/thumbnail/OMA.webp',
  './images/maps/thumbnail/PHL.webp',
  './images/maps/thumbnail/REM.webp',
  './images/maps/thumbnail/SME.webp',
  './images/maps/thumbnail/SMM.webp',
  './images/maps/thumbnail/SMO.webp',
  './images/maps/thumbnail/STA.webp',
  './images/maps/thumbnail/TOB.webp',
  './images/maps/thumbnail/UTA.webp',
  './images/ui/default_garrison_512.webp',
  './images/ui/icn_garrison_shadow.webp',
  './images/ui/icn_garrison_shadow_locked.webp',
  './images/ui/icn_garrison_shadow_warning.webp'
];

function toScopeUrl(path) {
  return new URL(path, self.registration.scope).toString();
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const requests = APP_SHELL_URLS.map((url) => new Request(toScopeUrl(url), { cache: 'reload' }));
    await cache.addAll(requests);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => {
        if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
          return caches.delete(key);
        }

        return Promise.resolve(false);
      })
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.endsWith('/service-worker.js')) {
    return;
  }

  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(request);

      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      if (request.mode === 'navigate') {
        return (await caches.match(toScopeUrl('./'))) || caches.match(toScopeUrl('./index.html'));
      }

      throw error;
    }
  })());
});
