import {onLoad} from "../app.js";
import {outputHoursMinsAndSecs} from "../utils/utils.js";
import {Timer} from "./timer.js";

const timerElement = document.body.children[0].children[2];

const outputToElement = (hours, mins, secs, millis) => {
    timerElement.innerText = outputHoursMinsAndSecs(hours, mins, secs, millis);
};

const timer = onLoad
    .then((tour) => {
        outputToElement(...Timer.millisToTime(tour.time));
        return new Timer(outputToElement, tour.time);
    });

timerElement.addEventListener(`click`, () => {
    if (timer.isTicking()) {
        timer.stop();
    } else {
        timer.start();
    }
});

console.log(`timer loaded`);