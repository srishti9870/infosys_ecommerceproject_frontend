const CACHE_NAME = 'e-shop-images-v1';

// Install
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker Installing...');
    self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker Activated');
    // Clean old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

// Fetch - Cache images
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Cache only image files
    if (
        url.includes('unsplash.com') ||
        url.includes('images/') ||
        url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    // Return cached version
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fetch from network and cache
                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});