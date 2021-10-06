import {tour} from "../script.js";

import {outputFullTime, outputHoursAndMins, outputMinsAndSecs} from "../utils/utils.js";
import {Timer} from "./timer.js";

let timerElement = null;

let elements = document.getElementsByClassName(`timer`);
if (elements.length === 1) {
    timerElement = elements.item(0);
} else {
    throw new Error(`Can't find timer`);
}

let outputToElement = (hours, mins, secs, millis) => {
    timerElement.innerText = outputFullTime(hours, mins, secs, millis);
};

let timer = new Timer(outputToElement, tour.time);

outputToElement(...Timer.millisToTime(tour.time));

timerElement.addEventListener(`click`, () => {
    if (timer.isTicking()) {
        timer.stop();
    } else {
        timer.start();
    }
}, false);