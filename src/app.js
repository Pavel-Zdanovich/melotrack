import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {playlist} from "./modes/playlist.js";
import {random} from "./modes/random.js";

const modes = [
    album, artist, chart, playlist, random
];

let index = 0;
const indexElement = document.body.children[2].children[0];
const outputIndex = () => {
    indexElement.innerHTML = indexElement.innerHTML + `${index + 1}/${modes.length}`;
};

const load = (mode) => {
    outputIndex();
    mode().then(tour => {
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

const clefElement = document.body.children[4].children[1];

clefElement.addEventListener(`click`, () => {
    load(modes[index]);
});

console.log(`app loaded`);