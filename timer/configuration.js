let { outputFullTime, outputHoursAndMins, outputMinsAndSecs } = await import(`../utils.js`);
let { Timer } = await import(`./timer.js`);

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

let timer = new Timer(outputToElement, 60000);

let time = Timer.millisToTime(0);
timerElement.innerText = outputFullTime(time.hours, time.mins, time.secs, time.millis);

timerElement.addEventListener(`click`, () => {
    if (timer.isTicking()) {
        timer.stop();
    } else {
        timer.start();
    }
}, false);