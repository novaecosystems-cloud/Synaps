// Synaps AI Progressive Web App Service Worker
const CACHE_NAME = 'synaps-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through fetch for real-time Next.js API and dynamic server responses
  return;
});
