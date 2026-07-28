import type { RuntimeCaching } from 'workbox-build';

export const runtimeCaching: RuntimeCaching[] = [
  {
    urlPattern: /^https:\/\/cdn\.warframestat\.us\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'hub-cdn',
      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
    },
  },
  {
    urlPattern: /^https:\/\/api\.warframestat\.us\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'hub-api',
      expiration: { maxEntries: 20, maxAgeSeconds: 30 },
    },
  },
  {
    urlPattern: /\/json\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'hub-static-json',
      expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
];
