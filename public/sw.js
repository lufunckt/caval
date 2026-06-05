const CACHE_NAME = "erico-relacional-cache-v1";

// Simple core shell assets to install initially
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/og-image.jpg"
];

// Install event - Pre-cache the shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pré-carregando o app shell offline...");
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - Clean up antique caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Limpando cache antigo:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Custom stale-while-revalidate & network-first fallback logic
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip non-GET requests or browser extension/external schema requests
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 2. Handle dynamic API requests (e.g. Canine news) with a Network-First approach
  if (url.pathname.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If response is valid, clone and save it to the cache
          if (response && response.status === 200) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cacheCopy);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: try to serve cached API response
          console.log("[Service Worker] Rede indisponível. Buscando dados da API no cache...");
          return caches.match(request);
        })
    );
    return;
  }

  // 3. For SPA navigations, respond with `/index.html` shell to let React handle routing
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() => {
          console.log("[Service Worker] Navegação offline detectada. Servindo index.html...");
          return caches.match("/index.html") || caches.match("/");
        })
    );
    return;
  }

  // 4. Stale-While-Revalidate for static visual elements (assets, images, scripts, stylesheet)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Quietly eat fetch failures when offline; cached response is already serving!
        });

      // Returns the cached element immediately, while dispatching the fetch updates in the background.
      return cachedResponse || fetchPromise;
    })
  );
});
