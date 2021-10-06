import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {playlist} from "./modes/playlist.js";
import {random} from "./modes/random.js";

export const tours = [
    album, artist, chart, playlist, random
];

export let loadTour;

export const whenLoaded = new Promise((resolve) => {
    loadTour = resolve;
});

console.log(`promise`);

import("./utils/mobile.js");
import("./loader/configuration.js").then(() => console.log(`loader loaded`));
import("./player/configuration.js").then(() => console.log(`player loaded`));
import("./table/configuration.js").then(() => console.log(`table loaded`));
import("./timer/configuration.js").then(() => console.log(`timer loaded`));