self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('kelime-bildirim-v1').then(cache => {
            return cache.addAll([
                '/index.html',
                'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js',
                'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
            ]).catch(err => {
                console.error('Önbellekleme hatası:', err);
            });
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(err => {
                console.error('Ağ isteği hatası:', err);
                return caches.match('/index.html');
            });
        })
    );
});
