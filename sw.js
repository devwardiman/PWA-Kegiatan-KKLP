'use strict';
const CACHE_NAME = 'kklp-cache-v1';
var urlsToCache = [
  'PWA-Kegiatan-KKLP/',
  'PWA-Kegiatan-KKLP/menu.html',
  'PWA-Kegiatan-KKLP/laporan.html',
  'PWA-Kegiatan-KKLP/offline.html',
  'PWA-Kegiatan-KKLP/favorite.png',
  'PWA-Kegiatan-KKLP/fa-user.png',
  'PWA-Kegiatan-KKLP/css/bootstrap.min.css',
  'PWA-Kegiatan-KKLP/css/signin.css',
  'PWA-Kegiatan-KKLP/js/main.js',
  'PWA-Kegiatan-KKLP/js/idb.js',
  'https://code.jquery.com/jquery-3.4.1.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.18.0/trumbowyg.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Trumbowyg/2.18.0/ui/trumbowyg.min.css'
];

self.addEventListener('install', function (event) {
  /* Perform install steps*/
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST' && url.pathname === '/kklp/login') {
    event.respondWith(Response.redirect('menu.html'));
    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId);
      const username = data.get('username');
      client.postMessage({ username }); 
    }());
  }else{
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(()=>{
          if(event.request.mode == 'navigate'){
            return caches.match('offline.html');
          }
        })
    );
  }
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return cacheName !== CACHE_NAME;
          })
          .map(function (cacheName) {
            caches.delete(cacheName);
          })
      );
    })
  );
});