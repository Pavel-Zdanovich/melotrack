import {album} from "./modes/album.js";
import {artist} from "./modes/artist.js";
import {chart} from "./modes/chart.js";
import {genre} from "./modes/genre.js";
import {playlist} from "./modes/playlist.js";
import {radio} from "./modes/radio.js";
import {track} from "./modes/track.js";
import {next, previous} from "./utils/utils.js";

const data = await fetch("data.json").then(response => response.json());

const spinnerElement = document.body.lastElementChild;
const circleElement = spinnerElement.firstElementChild;
const percent = 3.078;
const textElement = spinnerElement.lastElementChild;
document.body.removeChild(spinnerElement);

const modes = [
    album, artist, chart, playlist, radio, track
];

let index = -1;
const indexElement = document.body.children[0].children[0];

const load = (mode) => {
    spinnerElement.classList.add(`absoluted`);
    document.body.appendChild(spinnerElement);
    let requestId;
    let passed = 0;
    let percentage = 0;
    let goal = 0;
    mode(data, (step, duration = 2000) => {
        const start = performance.now();

        goal = goal + step;

        if (percentage && percentage !== goal) {
            window.cancelAnimationFrame(requestId);
            passed = percentage;
            step = goal - passed;
            //console.log(`${passed} + ${step} = cancel [${start.toFixed()} ${requestId}]`);
        }

        const output = (percentage) => {
            //console.log(`${passed} + ${step} = ${percentage} [${start.toFixed()} ${requestId}]`);

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
    }).catch(error => console.error(error));
};

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    load(previous(index, modes));
});
rightElement.addEventListener(`click`, () => {
    load(next(index, modes));
});

console.log(`app loaded`);