/* must live in the application root because the scope for service workers is defined by the directory in which the file resides */
//define a name for the cache and an array holding the files to cache
var cacheName = 'weatherPAW-steps-6-1';
var filesToCache = [
    '/',
    'index.html',
    'scripts/app.js',
    'styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scatted-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

self.addEventListener('install', function(e){
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        //open cache, passing in cache name
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache); //returns the cache with the files added to it
        })
    );
});

//makes sure that service worker updates cache whenever app shell files change
self.addEventListener('activate', function(e){
    console.log('[ServiceWorker] Activate');
    
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key !== cacheName){
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim(); //fixes an edge case where app doesn't return latest data
        //essentially activates service worker faster
});

//serves app shell from cache
self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith( //this passes caches.match's response back to the web page
        caches.match(e.request).then(function(response){ //cache evaluates the web request that triggered the "fetch" event
            return response||fetch(e.request); //cache will respond with either the cached version or fetches a copy from the network
        })
    );
});

