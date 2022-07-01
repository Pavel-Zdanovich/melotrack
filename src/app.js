import {spinner} from "./utils/spinner.js";

spinner.markProgressBy(25);

import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
import "https://e-cdn-files.dzcdn.net/js/min/dz.js";
import {promisify, next, previous} from "./utils/utils.js";

spinner.markProgressBy(25);

const [init, initResolve] = promisify();
DZ.init({
    appId: '509082',
    channelUrl: 'http://melotrack/channel.html',
    player: {
        onload: (response) => {
            console.log('DZ.player is ready', response);
            initResolve();
        }
    }
});

spinner.markProgressBy(25);

const [ready, readyResolve] = promisify();
DZ.ready((sdk_options) => {
    console.log('DZ SDK is ready', sdk_options);
    readyResolve();
});

spinner.markProgressBy(25);

const loading = fetch("data.json").then(response => response.json());

Promise.all(
    [
        //init,
        //ready,
        loading
    ]
).then(() => spinner.stop());

const data = await loading;

import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {playlist} from "./modes/playlist.js";
import {radio} from "./modes/radio.js";
import {track} from "./modes/track.js";

const modes = [
    album, artist, chart, playlist, radio, track
];
let current;

const indexElement = document.body.children[0].children[0];

const load = (mode) => {
    mode(DZ, data).then(tour => {
        indexElement.innerHTML = `${tour.name} [${modes.indexOf(mode) + 1}/${modes.length}]`;
        current = mode;
        document.dispatchEvent(new CustomEvent(`tour`, {detail: tour}));
        document.documentElement.style.setProperty(`--background-color`, tour.background);
        document.documentElement.style.setProperty(`--border-color`, tour.border);
        document.documentElement.style.setProperty(`--transparent-color`, tour.transparent);
    });
};

indexElement.addEventListener(`click`, () => {
    load(current);
});

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    load(previous(modes.indexOf(current), modes));
});
rightElement.addEventListener(`click`, () => {
    load(next(modes.indexOf(current), modes));
});

console.log(`app loaded`);