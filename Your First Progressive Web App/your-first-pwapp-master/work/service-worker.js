/* must live in the application root because the scope for service workers is defined by the directory in which the file resides

*/

//define a name for the cache and an array holding the files to cache
var cacheName = 'weatherPAW-steps-6-1';
var filesToCache = [];

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