self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                'js/main.js',
                'js/updaters.js',
                'css/bootstrap-default.min.css',
                'css/bootstrap-night.min.css',
                'css/common.css',
                'css/main.css',
                'css/main.eidolon.css',
                'css/main.night.css',
                'css/main.retro.css',
                'img/loading.svg'
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(
            function (response) {
                return response || fetch(e.request);
            }
        )
    );
});
