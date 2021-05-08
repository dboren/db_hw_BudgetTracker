const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',

];

const STATIC_CACHE = 'static-cache-v2';
const DATA_CACHE = 'data-cache-v1';

// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches
//             .open(PRECACHE)
//             .then((cache) => cache.addAll(FILES_TO_CACHE))
//             .then(self.skipWaiting())
//     );
// });

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

// self.addEventListener('activate', (event) => {
//     const currentCaches = [PRECACHE, RUNTIME];
//     event.waitUntil(
//         caches
//             .keys()
//             .then((cacheNames) => {
//                 return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
//             })
//             .then((cachesToDelete) => {
//                 return Promise.all(
//                     cachesToDelete.map((cacheToDelete) => {
//                         return caches.delete(cacheToDelete);
//                     })

//                 );
//             })
//             .then(() => self.clients.claim())
//     );       
// });


// self.addEventListener('fetch', function(event) {
//     if (event.request.url.includes('/api/')) {
//         event.respondWith(
//             caches.open(DATA_CACHE_NAME).then(cache => {
//                 return fetch(event.request)
//                     .then(res => {
//                         if (res.status === 200) {
//                             cache.put(event.request.url, res.clone());
//                         }

//                         return res;
//                     })
//                     .catch(err => {
//                         return cache.match(event.request);
//                     });
//             }).catch(err => console.log(err))      
//         );

//         return;
//     }

//     event.respondWith(
//         caches.open(CACHE_NAME).then(cache => {
//             return cache.match(event.request).then(res => {
//                 return res || fetch(event.request);
//             });
//         })
//     );
// });