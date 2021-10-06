import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {playlist} from "./modes/playlist.js";
import {random} from "./modes/random.js";

const modes = [
    album, artist, chart, playlist, random
];

let index = 0;
const indexElement = document.body.children[0].children[0];
indexElement.addEventListener(`click`, () => {
    load(modes[index]);
});

const load = (mode) => {
    mode().then(tour => {
        indexElement.innerHTML = tour.title + ` [${index + 1}/${modes.length}]`;
        console.log(tour);
        document.dispatchEvent(new CustomEvent(`tour`, {detail: tour}));
        document.documentElement.style.setProperty(`--background-color`, tour.background);
        document.documentElement.style.setProperty(`--border-color`, tour.border);
    });
};

const prev = () => {
    if (index > 0) {
        index--;
    } else {
        index = modes.length;
    }

    return modes[index];
};
const next = () => {
    if (index <= modes.length - 2) {
        index++;
    } else {
        index = 0;
    }

    return modes[index];
};

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    load(prev());
});
rightElement.addEventListener(`click`, () => {
    load(next());
});

console.log(`app loaded`);