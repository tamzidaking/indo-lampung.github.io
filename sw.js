 VERSION = "KamusAksaraLampung-v20220703";

var fileCache = [
 
  './index.html',
  
  
  './js/aksaraLampung.js',
  './js/main.js',
  './js/offline.js',
  './css/bootstrap.min.css',
  './css/style.css',
  './fonts/aksara-Lampung-Unila-v2.ttf'
];


self.addEventListener('install', function (event) {
  console.log('SW terinstal');
  event.waitUntil(
    caches.open(VERSION)
    .then(function (cache) {
     
      return cache.addAll(fileCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('SW aktif');
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (key) {
        if (key !== VERSION) {
          console.log('Service Worker: menghapus cache lama', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var tryInCachesFirst = caches.open(VERSION).then(cache => {
    return cache.match(event.request).then(response => {
      if (!response) {
        return handleNoCacheMatch(event);
      }
     
      fetchFromNetworkAndCache(event);
      
      return response;
    });
  });
  event.respondWith(tryInCachesFirst);
});

this.addEventListener('fetch', function(e) {
  var tryInCachesFirst = caches.open(VERSION).then(cache => {
    return cache.match(e.request).then(response => {
      if (!response) {
        return handleNoCacheMatch(e);
      }
      
      fetchFromNetworkAndCache(e);
      
      return response
    });
  });
  e.respondWith(tryInCachesFirst);
});

function fetchFromNetworkAndCache(e) {
  
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

  return fetch(e.request).then(res => {
    
    if (!res.url) return res;
    
    if (new URL(res.url).origin !== location.origin) return res;

    return caches.open(VERSION).then(cache => {
      
      cache.put(e.request, res.clone());
      return res;
    });
  }).catch(err => console.error(e.request.url, err));
}

function handleNoCacheMatch(e) {
  return fetchFromNetworkAndCache(e);
}