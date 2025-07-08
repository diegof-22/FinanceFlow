const CACHE_VERSION = 'v8';
const CACHE_NAME = `financelow-${CACHE_VERSION}-ultra-safe`;
const STATIC_CACHE = `financelow-static-${CACHE_VERSION}-ultra-safe`;
const RUNTIME_CACHE = `financelow-runtime-${CACHE_VERSION}-ultra-safe`;

const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/index.html',
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              return null;
            })
          )
        );
      }),
      
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.add('/').catch(() => {});
      })
    ])
    .then(() => self.skipWaiting())
    .catch(error => {
      console.error('Errore installazione Service Worker:', error);
    })
  );
});



self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
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
  

  const isSafeToIntercept = 
    request.method === 'GET' &&
    
    url.origin === location.origin &&
   
    (
      
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.svg') ||
      
      url.pathname === '/' ||
      url.pathname === '/index.html' ||
      url.pathname === '/manifest.json'
    ) &&

    !url.search.includes('api') &&
    !url.search.includes('token') &&
    !url.search.includes('auth') &&
    
    request.headers.get('upgrade') !== 'websocket';


  if (!isSafeToIntercept) {
    return;
  }

 

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          
          return caches.match('/index.html').then((cachedIndex) => {
            if (cachedIndex) {
              return cachedIndex;
            }
            
            return caches.match('/index.html');
          });
        })
    );
  }
  

  else if (request.destination === 'script' || 
           request.destination === 'style' || 
           request.destination === 'image' ||
           request.destination === 'font' ||
           url.pathname.includes('/static/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request).then((response) => {
        
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          
          if (request.destination === 'image') {
            return new Response('', { status: 404 });
          }
          throw new Error('Risorsa non disponibile offline');
        });
      })
    );
  }
  
  
  else {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            throw new Error('Risorsa non disponibile');
          });
        })
    );
  }
});


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

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Financelow',
        options
      )
    );
  } catch (error) {
    console.error('Errore nella gestione della notifica push:', error);
  }
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      
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

