import {outputHoursMinsAndSecs} from "../utils/utils.js";
import {Timer} from "./timer.js";

const timerElement = document.body.children[0].children[2];

const outputToElement = (hours, mins, secs, millis) => {
    timerElement.innerText = outputHoursMinsAndSecs(hours, mins, secs, millis);
};

const timer = new Timer();
timer.addEventListener(`load`, (e) => {
    const time = e.detail;
    outputToElement(...time);
});
timer.addEventListener(`tick`, (e) => {
    const time = e.detail;
    outputToElement(...time);
});

export {timer};

console.log(`timer loaded`);