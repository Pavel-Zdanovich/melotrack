import {outputMinsAndSecs, outputMinsSecsAndMillis} from "../utils/utils.js";
import {Timer} from "../timer/timer.js";
import {Player} from "./player.js";

let playerElement = null;

let elements = document.getElementsByClassName(`player`);
if (elements.length === 1) {
    playerElement = elements.item(0);
} else {
    throw new Error(`Can't find player`);
}

let playElement = playerElement.children[0];
let barElement = playerElement.children[1];
let progressElement = barElement.lastElementChild;
let dropdownElement = playerElement.children[2];

progressElement.style.width = `0%`;
let outputToElement = (progress, hours, mins, secs, millis) => {
    barElement.innerHTML = outputMinsAndSecs(hours, mins, secs, millis);
    barElement.appendChild(progressElement);
    progressElement.style.width = progress + `%`;
};
outputToElement(0, ...Timer.millisToTime(0));

let onLoad = (name, duration) => {
    barElement.innerHTML = outputMinsAndSecs(...Timer.millisToTime(duration));
    barElement.appendChild(progressElement);
}
let onPlayed = () => {
    //console.log(`onPlayed()`);
    playElement.innerHTML = `⏸`;
}
let onStopped = () => {
    //console.log(`onStopped()`);
    playElement.innerHTML = `▷`;
}

let player = new Player(outputToElement, onLoad, onPlayed, onStopped);

playElement.addEventListener(`click`, () => {
    if (player.isPlaying()) {
        player.stop();//.then(() => console.log(`player.stop()`));
    } else {
        player.play();//.then(() => console.log(`player.play()`));
    }
}, false);

let barRect = barElement.getBoundingClientRect();
barElement.addEventListener(`click`, (e) => {
    if (e.clientX >= barRect.left && e.clientX <= barRect.right &&
        e.clientY >= barRect.top && e.clientY <= barRect.bottom) {

        let percent = ((e.clientX - barRect.left) / barRect.width);
        let time = player.getDuration() * percent;
        outputToElement(percent * 100, ...Timer.millisToTime(time));
        player.setTime(time);
    }
}, false);

let element = document.createElement(`div`);
element.setAttribute(`class`, `element`);
element.innerHTML = `💩`;
let volumeElement = document.createElement(`div`);
volumeElement.setAttribute(`class`, `volume`);
volumeElement.innerText = `🔈`;

dropdownElement.addEventListener(`click`, () => {
    if (playerElement.lastChild === volumeElement) {
        dropdownElement.innerHTML = `▽`;
        playerElement.setAttribute(`class`, `player`);
        playerElement.removeChild(element);
        playerElement.removeChild(volumeElement);
    } else {
        dropdownElement.innerHTML = `△`;
        playerElement.setAttribute(`class`, `player open-player`);
        playerElement.appendChild(element);
        playerElement.appendChild(volumeElement);
    }
}, false);

export {player};