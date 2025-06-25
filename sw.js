self.addEventListener('install', function(event) {
    self.skipWaiting();
});
  
self.addEventListener('fetch', function(event) {
    // Puedes personalizar el caché según tu necesidad
});
