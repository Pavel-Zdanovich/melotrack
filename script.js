"use strict";

if (`serviceWorker` in navigator) {
    const origin = `pavel-zdanovich.github.io` === window.location.host ? `https://pavel-zdanovich.github.io/melotrack` : window.location.origin;
    navigator.serviceWorker
        .register(
            `${origin}/service.js`
        )
        .then(event => console.log(event))
        .catch(error => console.error(error));
}

import "./src/utils/mobile.js";
import "./src/utils/router.js";
import "./src/player/configuration.js";
import "./src/loader/configuration.js";
import "./src/timer/configuration.js";
import "./src/table/configuration.js";
import "./src/table/leaderboard.js";
import "./src/table/statistics.js";
import "./src/app.js";

console.log(`script loaded`);