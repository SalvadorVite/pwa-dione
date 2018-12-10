var dataCacheName = 'DioneRewards-v1';
var cacheName = 'DioneRewards2018';
var filesToCache = [
    '/',
    '/index.html',
    '/welcome.html',
    '/login.html',
    '/dashboard.html',
    '/scripts/app.js',
    '/scripts/splash.js',
    '/scripts/welcome.js',
    '/scripts/login.js',
    '/scripts/dash.js',
    '/styles/dione.css',
    '/styles/slider.css',
    '/styles/forms.css',
    '/styles/bootstrap.min.css',
    '/favicon.ico',
    '/images/logo.png',
    '/images/session.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-256x256.png'
];
self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if(key != cacheName && key != dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache');
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrlWeb = 'https://dione.blueboy.studio/ws/';
    var dataUrlImg = 'https://dione.blueboy.studio/images_promociones/';
    if(e.request.url.indexOf(dataUrlWeb) > -1 || e.request.url.indexOf(dataUrlImg) > -1) {
        /*
        * When the request URL contains dataUrl, the app is asking for updated
        * web services data. In this case, the service worker always goes to the
        * network and then caches the response. This is called the "Cache then
        * network" strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
        */
       e.respondWith(
           caches.open(dataCacheName).then(function(cache) {
               return fetch(e.request).then(function(response) {
                   cache.put(e.request.url, response.clone());
                   return response;
               });
           })
       );
    } else {
        //console.log('Cache ', e.request);
        /*
        * The app is asking for app shell files. In this scenario the app uses the
        * "Cache, falling back to the network" offline strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
        */
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});