const staticCacheName = 'site-static-v14';
const dynamicCacheName = 'site-dynamic-v14';
const assets = [
    '/',
    'index.html',
    'js/app.js',
    'js/materialize.min.js',
    'js/ui.js',
    'css/materialize.min.css',
    'css/styles.css',
    'img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'pages/fallback.html'
];
// CACHE SIZE LIMIT FUNCTION
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache =>{
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}


// install service worker
self.addEventListener('install', evt => {
    // console.log('service worker has been installed')
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching');
            cache.addAll(assets);
        })
    )
    caches.open(staticCacheName).then(cache => {
        console.log('caching');
        cache.addAll(assets);
    })
})

// activate service 
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys 
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
                )
        })
    )
    // console.log('service worker has been activated')
})

// fetch event
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt)
        if(evt.request.url.indexOf('firestore.googleapis.com') === -1) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    caches.match('/pages/fallback.html')
                }
            })
        );
    }
})

