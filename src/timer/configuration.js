import {onLoad} from "../app.js";
import {outputHoursMinsAndSecs} from "../utils/utils.js";
import {Timer} from "./timer.js";

const timerElement = document.body.children[0].children[2];

const outputToElement = (hours, mins, secs, millis) => {
    timerElement.innerText = outputHoursMinsAndSecs(hours, mins, secs, millis);
};

const timer = onLoad
    .then((tour) => {
        const timer = new Timer(tour.time);
        timer.addEventListener(`tick`, (e) => {
            const time = e.detail;
            outputToElement(...time);
        });
        outputToElement(...Timer.millisToTime(tour.time));
        return timer;
    });

timerElement.addEventListener(`click`, () => {
    if (timer.isTicking()) {
        timer.stop();
    } else {
        timer.start();
    }
});

console.log(`timer loaded`);