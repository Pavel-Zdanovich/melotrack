"use strict";

if (`serviceWorker` in navigator) {
    //window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`${window.location.origin}/service.js`)
            .then(event => console.log(event))
            .catch(error => console.error(error));
    //});
}

import "./src/app.js";
import "./src/utils/mobile.js";
import "./src/utils/router.js";
import "./src/player/configuration.js";
import "./src/loader/configuration.js";
import "./src/table/configuration.js";
import "./src/timer/configuration.js";

console.log(`script loaded`);