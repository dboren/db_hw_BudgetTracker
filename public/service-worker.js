const FILES_TO_CACHE = [
    '/',
    '/db.js'
    '/index.html',
    '/index.js',
    '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',

];

const STATIC_CACHE = 'static-cache-v2';
const DATA_CACHE = 'data-cache-v1';


self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(DATA_CACHE).then((cache) => cache.add('/api/transaction')
        )
    );

    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== STATIC_CACHE && key !== DATA_CACHE) {
                        console.log("removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});


self.addEventListener('fetch', function(event) {
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE).then(cache => {
                return fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
        );

        return;
    }

    event.respondWith(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        })
    );
});