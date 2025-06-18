const CACHE_NAME = 'kelimelerim-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/script.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      // Cache'de varsa döndür, yoksa fetch et ve cache'e ekle
      return resp || fetch(event.request).then(response => {
        // Yalnızca geçerli bir yanıt dönerse cache'e ekle
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // Eğer fetch de başarısız olursa, gerekirse burada bir fallback dönebilirsiniz
        // return caches.match('/offline.html');
        return new Response('Bağlantı yok', { status: 408 });
      });
    })
  );
});
