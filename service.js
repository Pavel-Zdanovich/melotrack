const STATIC = `static`;

const staticRequests = [
    `/`,

    `/audio/melotrack1.mp3`,
    `/audio/melotrack2.mp3`,
    `/audio/melotrack3.mp3`,
    `/audio/melotrack4.mp3`,
    `/audio/melotrack5.mp3`,
    `/audio/melotrack6.mp3`,
    `/audio/melotrack7.mp3`,
    `/audio/melotrack8.mp3`,
    `/audio/melotrack9.mp3`,
    `/audio/melotrack10.mp3`,

    `/favicon/android-chrome-192x192.png`,
    `/favicon/android-chrome-512x512.png`,
    `/favicon/apple-touch-icon.png`,
    `/favicon/browserconfig.xml`,
    `/favicon/favicon.ico`,
    `/favicon/favicon-16x16.png`,
    `/favicon/favicon-32x32.png`,
    `/favicon/mstile-70x70.png`,
    `/favicon/mstile-144x144.png`,
    `/favicon/mstile-150x150.png`,
    `/favicon/mstile-310x150.png`,
    `/favicon/mstile-310x310.png`,
    `/favicon/safari-pinned-tab.svg`,

    `/data.json`,

    `/index.html`,

    `/manifest.webmanifest`,

    `/script.js`,

    `/service.js`,

    `/src/app.js`,

    `/src/utils/spinner.js`,

    `https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js`,
    `https://e-cdn-files.dzcdn.net/js/min/dz.js`,

    `/src/utils/utils.js`,

    `/src/modes/album.js`,
    `/src/modes/artist.js`,
    `/src/modes/chart.js`,
    `/src/modes/genre.js`,
    `/src/modes/playlist.js`,
    `/src/modes/radio.js`,
    `/src/modes/track.js`,

    `/src/utils/mobile.js`,

    `/src/utils/router.js`,

    `/src/player/configuration.js`,
    `/src/player/player.js`,
    `/src/player/progress.js`,

    `/src/loader/configuration.js`,
    `/src/loader/loader.js`,

    `/src/table/configuration.js`,
    `/src/entities/tour.js`,
    `/src/entities/track.js`,
    `/src/table/validator.js`,

    `/src/timer/configuration.js`,
    `/src/timer/timer.js`,

    `/styles.css`,
    //`https://fonts.googleapis.com`,
    //`https://fonts.gstatic.com`,
    `https://fonts.googleapis.com/css2?family=Noto+Music&display=swap`,
];

/*self.addEventListener(`install`, event => {
    event.waitUntil(
        caches.open(STATIC)
            .then(cache => {
                for (let request of staticRequests) {
                    cache.add(request);
                }
                //cache.addAll(staticRequests);
            }, error => console.error(error))
        //.then(self.skipWaiting())
    );
});*/

const DYNAMIC = `dynamic`;

const dynamicRequests = [
    `https://api.deezer.com`,
    `https://cdns-preview`,
];

self.addEventListener(`active`, event => {
    const currentCaches = [STATIC];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener(`fetch`, event => {
    console.log(event.request.url);
    //match third party static and cached dynamic
    if (staticRequests.includes(event.request.url)) {
        //console.log(event.request.url);
        //event.respondWith(caches.match(event.request));
        event.respondWith(fetch(event.request));
        return;
    }

    if (dynamicRequests.some(value => event.request.url.startsWith(value))) {
        //console.log(event.request.url);
        event.respondWith(
            caches.open(DYNAMIC).then(cache => {
                return fetch(event.request).then(response => {
                    // Put a copy of the response in the runtime cache.
                    return cache.put(event.request, response.clone()).then(() => response);
                });
            })
        );
        return;
    }

    //path starts with '/', if consists of more than one parts (/{1}/{2}), then it needs to be cut off the first part
    const path = event.request.url.replace(self.location.origin, ``); // /app.js, /favicon/favicon.ico, /{1}, /{1}/app.js, /{1}/{2}
    if (staticRequests.includes(path)) {
        //console.log(path);
        event.respondWith(caches.match(path));
        return;
    }
    for (const staticRequest of staticRequests) { // /{1}, /{1}/app.js, /{1}/{2}
        if (path.includes(staticRequest)) {
            //console.log(staticRequest);
            event.respondWith(caches.match(staticRequest));
            return;
        }
    }

    //console.log(self.location.origin);
    event.respondWith(caches.match(self.location.origin).then(response => {
        if (response) {
            return response;
        }
        return fetch(self.location.origin);
    }));
});

self.addEventListener(`message`, event => {
    //console.log(event);
});

self.addEventListener(`messageerror`, event => {
    //console.log(event);
});

self.addEventListener(`notificationclick`, event => {
    //console.log(event);
});

self.addEventListener(`notificationclose`, event => {
    //console.log(event);
});

self.addEventListener(`push`, event => {
    //console.log(event);
});