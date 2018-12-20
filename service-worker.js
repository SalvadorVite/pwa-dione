var dataCacheName = 'DioneRewards-v1';
var cacheName = 'DioneRewards2018';
var filesToCache = [
    '/',
    '/index.html',
    '/welcome.html',
    '/login.html',
    '/dashboard.html',
    '/scripts/app.js',
    '/scripts/dash.js',
    '/scripts/list-notif.js',
    '/scripts/login.js',
    '/scripts/record.js',
    '/scripts/shops.js',
    '/scripts/splash.js',
    '/scripts/welcome.js',
    '/styles/dione.css',
    '/styles/slider.css',
    '/styles/forms.css',
    '/styles/detail-notif.css',
    '/styles/dialog.css',
    '/styles/list-notif.css',
    '/styles/record.css',
    '/styles/shops.css',
    '/styles/bootstrap.min.css',
    '/favicon.ico',
    '/images/logo.png',
    '/images/logo1-sm.png',
    '/images/logo1-sm-black.png',
    '/images/session.png',
    '/images/welcome-1.jpg',
    '/images/portada/Depositphotos_33622661_xl-2015.jpg',
    '/images/portada/Depositphotos_173511934_xl-2015.jpg',
    '/images/portada/Depositphotos_59835219_xl-a2015.jpg',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-256x256.png',
    '/images/dash/compra.png',
    '/images/dash/historial.png',
    '/images/dash/nivel.png',
    '/images/dash/notificaciones.png',
    '/images/dash/perfil.png',
    '/images/svg/iconfinder_back_172570.svg',
    '/images/svg/notifications-list.svg',
    '/images/svg/home.svg',
    '/images/svg/iconfinder_Shoes_1_7538781.svg'
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
    //console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrlWeb = 'https://dione.blueboy.studio/ws/';
    var dataUrlImg = 'https://dione.blueboy.studio/images_promociones/';
    //var urlLocal = '127.0.0.1:8887'
    if(e.request.url.indexOf(dataUrlWeb) > -1 || e.request.url.indexOf(dataUrlImg) > -1) {
        //console.log('Fetch in cache ' + e.request.url);
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
                   //cache.put(e.request.url, response.clone());
                   return response;
               });
           })
       );
    } else {
        //console.log('Fetch to network ', e.request);
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

/*
#Cache-Then-Network-Request
async function update() {
    // Start the network request as soon as possible.
    const networkPromise = fetch('/data.json');
  
    startSpinner();
  
    const cachedResponse = await caches.match('/data.json');
    if (cachedResponse) await displayUpdate(cachedResponse);
  
    try {
      const networkResponse = await networkPromise;
      const cache = await caches.open('mysite-dynamic');
      cache.put('/data.json', networkResponse.clone());
      await displayUpdate(networkResponse);
    } catch (err) {
      // Maybe report a lack of connectivity to the user.
    }
  
    stopSpinner();
  
    const networkResponse = await networkPromise;
  
}
  
async function displayUpdate(response) {
    const data = await response.json();
    updatePage(data);
}
*/

/*
#cache-falling-back-to-network
self.addEventListener('fetch', (event) => {
    event.respondWith(async function() {
      const response = await caches.match(event.request);
      return response || fetch(event.request);
    }());
});
*/