// public/serviceWorker.ts
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
