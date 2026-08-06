const CACHE_NAME = 'ailabs-pwa-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Berhasil menyimpan file ke memori lokal HP');
        return cache.addAll(urlsToCache);
      })
  );
  // Memaksa update aplikasi jika ada versi terbaru
  self.skipWaiting(); 
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. Jika file ada di perangkat (lokal), langsung tampilkan! (No loading)
        if (response) {
          return response; 
        }
        // 2. Jika belum ada, baru download dari internet
        return fetch(event.request); 
      })
  );
});
