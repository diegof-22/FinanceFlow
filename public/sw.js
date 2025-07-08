const CACHE_VERSION = 'v10';
const STATIC_CACHE = `financelow-static-${CACHE_VERSION}-ultra-safe`;
const RUNTIME_CACHE = `financelow-runtime-${CACHE_VERSION}-ultra-safe`;

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(urlsToCache);
    })
    .then(() => self.skipWaiting())
    .catch(err => {
      console.error('Errore caching durante install:', err);
    })
  );
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);


  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Se fetch fallisce, fallback a index.html solo se presente in cache
          return caches.match('/index.html').then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            return new Response('<h1>Sei offline e la pagina non è ancora stata caricata.</h1>', {
              headers: { 'Content-Type': 'text/html' }
            });
          });
        })
    );
    return; // stop qui
  }

  
  if (
    request.method !== 'GET' ||
    url.origin !== location.origin ||
    request.headers.get('upgrade') === 'websocket'
  ) {
    return;
  }

  
  const staticAssetsExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
  const isStaticAsset = staticAssetsExtensions.some(ext => url.pathname.endsWith(ext)) || url.pathname.includes('/static/');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, responseClone));
          }
          return response;
        }).catch(() => {
          // Se è immagine, ritorna 404 vuoto per evitare errori brutti
          if (request.destination === 'image') {
            return new Response('', { status: 404 });
          }
          // Altrimenti errore generico
          return new Response('Risorsa non disponibile offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Per tutte le altre richieste GET (API, dati, ecc.) fallback fetch + cache runtime
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          return new Response('Risorsa non disponibile offline', { status: 503 });
        });
      })
  );
});

// Push notification
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.data || {},
      actions: data.actions || [],
      vibrate: [200, 100, 200],
      tag: data.tag || 'default',
      renotify: true,
      requireInteraction: data.requireInteraction || false,
    };
    event.waitUntil(self.registration.showNotification(data.title || 'Financelow', options));
  } catch (error) {
    console.error('Errore nella gestione della notifica push:', error);
  }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
