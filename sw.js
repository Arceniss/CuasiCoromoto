// Nombre y versión de la caché
const CACHE_NAME = 'coromoto-pwa-v1';

// Archivos a cachear para el funcionamiento offline (el "App Shell")
const urlsToCache = [
  './', // La página principal
  './index.html',
  // Todos los archivos de fuentes que estás usando
  './fonts/lora-v23-latin-regular.ttf',
  './fonts/lora-v23-latin-700.ttf',
  './fonts/montserrat-v24-latin-300.ttf',
  './fonts/montserrat-v24-latin-regular.ttf',
  './fonts/montserrat-v24-latin-500.ttf',
  './fonts/montserrat-v24-latin-700.ttf',
  // Los iconos de la PWA
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './favicon.ico'
];

// Evento 'install': se dispara cuando el service worker se instala.
// Aquí abrimos la caché y guardamos nuestros archivos.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': se dispara cada vez que la página solicita un recurso (una imagen, un CSS, etc.).
// Aquí interceptamos la petición y servimos desde la caché si está disponible.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos el recurso en la caché, lo devolvemos
        if (response) {
          return response;
        }
        // Si no, lo pedimos a la red
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': se dispara cuando el service worker se activa.
// Se usa para limpiar cachés antiguas si actualizamos la versión.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});