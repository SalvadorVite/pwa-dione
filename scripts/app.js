//Add service worker code here
(function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
                 .register('./service-worker.js')
                 .then(function() { console.log('[ServiceWorker] registered'); });
    }
})();