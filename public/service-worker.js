const CACHE_NAME = 'tegstop-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache qilish
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - eski cache larni tozalash
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // Faqat GET requestlarni cache qilish
  if (event.request.method !== 'GET') {
    return;
  }

  // API requestlarni cache qilmaslik
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Faqat successful responselarni cache qilish
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Response ni clone qilish (bir marta o'qiladi)
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          })
          .catch((error) => {
            console.error('Cache put error:', error);
          });
        
        return response;
      })
      .catch(() => {
        // Agar internet yo'q bo'lsa, cache dan qaytarish
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Agar cache da ham yo'q bo'lsa, offline sahifasini ko'rsatish
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Fallback response
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Push notification support (kelajakda)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yangi xabar',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification('Tegstop', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});