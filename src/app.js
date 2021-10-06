import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
import "https://e-cdn-files.dzcdn.net/js/min/dz.js";

DZ.init({
    appId: '509082',
    channelUrl: 'http://melotrack/channel.html',
    player: {
        onload: (response) => {
            console.log('DZ.player is ready', response);
        }
    }
});

DZ.ready((sdk_options) => {
    console.log('DZ SDK is ready', sdk_options);
});

const data = await fetch("data.json").then(response => response.json());

import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {playlist} from "./modes/playlist.js";
import {radio} from "./modes/radio.js";
import {track} from "./modes/track.js";
import {next, previous} from "./utils/utils.js";

const modes = [
    album, artist, chart, playlist, radio, track
];

const spinnerElement = document.body.lastElementChild;
const circleElement = spinnerElement.firstElementChild;
const percent = 3.078;
const textElement = spinnerElement.lastElementChild;
document.body.removeChild(spinnerElement);

let index = -1;
const indexElement = document.body.children[0].children[0];

const load = (mode) => {
    spinnerElement.classList.add(`absoluted`);
    document.body.appendChild(spinnerElement);
    let requestId;
    let passed = 0;
    let percentage = 0;
    let goal = 0;
    mode(DZ, data, (step, duration = 2000) => {
        const start = performance.now();

        goal = goal + step;

        if (percentage && percentage !== goal) {
            window.cancelAnimationFrame(requestId);
            passed = percentage;
            step = goal - passed;
        }

        const output = (percentage) => {
            circleElement.style.strokeDasharray = `${percent * percentage}, ${percent * (100 - percentage)}`;
            textElement.innerHTML = `${percentage.toFixed(1)}%`;
        };

        const callback = (time) => {
            const progress = (time - start) / duration;

            percentage = passed + (step) * progress;

            const condition = step > 0 ? percentage < goal : percentage > goal;
            if (condition) {
                output(percentage);

                requestId = window.requestAnimationFrame(callback);
            } else {
                percentage = goal;
                passed = percentage;

                output(percentage);
            }
        }

        requestId = window.requestAnimationFrame(callback);
    }).then(tour => {
        document.body.removeChild(spinnerElement);
        indexElement.innerHTML = tour.title + ` [${index + 1}/${modes.length}]`;
        console.log(tour);
        document.dispatchEvent(new CustomEvent(`tour`, {detail: tour}));
        document.documentElement.style.setProperty(`--background-color`, tour.background);
        document.documentElement.style.setProperty(`--border-color`, tour.border);
    });
};

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    load(previous(index--, modes));
});
rightElement.addEventListener(`click`, () => {
    load(next(index++, modes));
});

console.log(`app loaded`);