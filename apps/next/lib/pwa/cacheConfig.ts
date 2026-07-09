import type { RuntimeCaching } from 'workbox-build';

export const runtimeCaching: RuntimeCaching[] = [
  {
    urlPattern: /^https:\/\/cdn\.warframestat\.us\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'hub-cdn',
      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
    },
  },
  {
    urlPattern: /^https:\/\/api\.warframestat\.us\/.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'hub-api',
      networkTimeoutSeconds: 3,
      expiration: { maxEntries: 20, maxAgeSeconds: 60 * 5 },
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
