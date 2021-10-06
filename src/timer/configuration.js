import {whenLoaded} from "../app.js";
import {getElementByClass, outputHoursMinsAndSecs} from "../utils/utils.js";
import {Timer} from "./timer.js";

let timerElement = getElementByClass(`timer`);

let outputToElement = (hours, mins, secs, millis) => {
    timerElement.innerText = outputHoursMinsAndSecs(hours, mins, secs, millis);
};

let timer = whenLoaded
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
}, false);