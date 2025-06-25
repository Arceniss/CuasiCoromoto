// Define un nombre y una versión para tu caché
const CACHE_NAME = 'cuasi-coromoto-cache-v1';

// Lista de archivos que quieres que se guarden en caché para funcionar offline
// Empieza con lo más básico. Puedes añadir más cosas después (como las fuentes o imágenes)
const urlsToCache = [
  '/', // Esto cachea tu index.html en la raíz
  'index.html',
  'manifest.json',
  'favicon.svg',
  'iconos/icon-192x192.png',
  'iconos/icon-512x512.png'
];

// 1. Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  // Espera hasta que la promesa se resuelva
  event.waitUntil(
    // Abre el caché con el nombre que definimos
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto, añadiendo archivos principales.');
        // Añade todos los archivos de nuestra lista al caché
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Forza al Service Worker a activarse inmediatamente
        self.skipWaiting(); 
      })
  );
});

// 2. Evento 'activate': Se dispara cuando el Service Worker se activa.
// Sirve para limpiar cachés antiguos si has creado uno nuevo.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre del caché no es el actual, lo borramos
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// 3. Evento 'fetch': Se dispara cada vez que la página solicita un recurso (HTML, CSS, JS, imágenes).
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  
  // Responde a la petición
  event.respondWith(
    // Primero, busca el recurso en el caché
    caches.match(event.request)
      .then(response => {
        // Si encuentra una respuesta en el caché, la devuelve
        if (response) {
          console.log('Service Worker: Sirviendo desde caché:', event.request.url);
          return response;
        }
        
        // Si no está en el caché, va a la red a buscarlo
        console.log('Service Worker: Sirviendo desde red:', event.request.url);
        return fetch(event.request);
      })
  );
});
