/* globals caches, fetch */
/* eslint-disable no-restricted-globals, no-console */
const files = [
  '/',
  'timer',
  'map',
  'fish',
  'howtofish',
  '404',
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
];

const register = sums => {
  const filesToRegister = sums ? files.map((file, index) => {
    if (index > 5) {
      return `${file}?v=${sums[file]}`;
    }
    return file;
  }) : files;

  self.addEventListener('install', event => {
    event.waitUntil(caches
      .open('v1')
      .then(cache => cache.addAll(filesToRegister)));
  });

  self.addEventListener('fetch', e => {
    e.respondWith(caches
      .match(e.request)
      .then(response => response || fetch(e.request)));
  });
};

fetch('/sums.json')
  .then(response => {
    if (!response.ok) {
      console.error('[Hub][Worker] Something went wrong getting sums in service worker.');
      return undefined;
    }
    return response.json();
  })
  .then(register)
  .catch(error => {
    console.log('[Hub][Worker] Looks like there was a problem: \n', error);
  });

/* eslint-enable no-restricted-globals, no-console */
