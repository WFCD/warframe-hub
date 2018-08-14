self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        'timer',
        'js/main.js',
        'js/updaters.js',
        'css/bootstrap-default.min.css',
        'css/bootstrap-night.min.css',
        'css/common.css',
        'css/main.css',
        'css/main.eidolon.css',
        'css/main.night.css',
        'css/main.retro.css',
        'img/loading.svg',
        'map',
        'fish',
        'howtofish',
        '404'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
