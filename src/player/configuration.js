import {getElementByClass, outputMinsAndSecs} from "../utils/utils.js";
import {Timer} from "../timer/timer.js";
import {Player} from "./player.js";
import {loader} from "../loader/configuration.js";

let playerElement = getElementByClass(`player`);

let playElement = playerElement.children[0];
let controlsElement = playerElement.children[1];
let audioBarElement = playerElement.children[2];
let audioInfoElement = audioBarElement.firstElementChild;
let audioProgressElement = audioBarElement.lastElementChild;
let volumeBarElement = playerElement.children[3];
let volumeInfoElement = volumeBarElement.firstElementChild;
let volumeIconElement = volumeInfoElement.lastElementChild;
let volumeProgressElement = volumeBarElement.lastElementChild;

let outputToAudioElements = (progress, hours, mins, secs, millis) => {
    audioInfoElement.innerHTML = outputMinsAndSecs(hours, mins, secs, millis);
    audioProgressElement.style.width = progress + `%`;
};

let onLoad = (name, duration) => {
    audioInfoElement.innerHTML = name + `<br>` + outputMinsAndSecs(...Timer.millisToTime(duration));
    audioProgressElement.style.width = `0%`;
}
let onPlayed = () => {
    playElement.innerHTML = `⏸`;
}
let onStopped = () => {
    playElement.innerHTML = `▶`;
}
let onEnded = (url) => {
    console.log(`Current ${url} ended!`);

    let track = loader.next(url); //loader.get(url) - repeat, loader.previous(url) - previous

    player.set(track);

    console.log(`Load next ${track.url}`);
}

let player = new Player(outputToAudioElements, onLoad, onPlayed, onStopped, onEnded);

playElement.addEventListener(`click`, () => {
    if (player.isPlaying()) {
        player.stop();
    } else {
        player.play();
    }
}, false);

let audioBarRect = audioBarElement.getBoundingClientRect();
audioBarElement.addEventListener(`click`, (e) => {
    if (e.clientX >= audioBarRect.left && e.clientX <= audioBarRect.right &&
        e.clientY >= audioBarRect.top && e.clientY <= audioBarRect.bottom) {

        let percent = ((e.clientX - audioBarRect.left) / audioBarRect.width);
        let time = player.getDuration() * percent;
        outputToAudioElements(percent * 100, ...Timer.millisToTime(time));
        player.setTime(time);
    }
}, false);

let repeatElement = controlsElement;
let nextElement = document.createElement(`div`);
nextElement.setAttribute(`class`, `controls centralized`);
nextElement.innerHTML = `⏩`; //⏭
let previousElement = document.createElement(`div`);
previousElement.setAttribute(`class`, `controls centralized`);
previousElement.innerHTML = `⏪`; //⏮

repeatElement.addEventListener(`click`, () => {
    playerElement.replaceChild(nextElement, repeatElement);
}, false);
nextElement.addEventListener(`click`, () => {
    playerElement.replaceChild(previousElement, nextElement);
}, false);
previousElement.addEventListener(`click`, () => {
    playerElement.replaceChild(repeatElement, previousElement);
}, false);

let outputToVolumeElement = (percent) => {
    volumeInfoElement.innerHTML = percent;
    volumeInfoElement.appendChild(volumeIconElement);
    volumeProgressElement.style.height = percent + `%`;
    volumeProgressElement.style.bottom = percent + `%`;
}

let volumeBarRect = volumeBarElement.getBoundingClientRect();
volumeBarElement.addEventListener(`click`, (e) => {
    if (e.clientX >= volumeBarRect.left && e.clientX <= volumeBarRect.right &&
        e.clientY >= volumeBarRect.top && e.clientY <= volumeBarRect.bottom) {

        let percent = Math.trunc(((volumeBarRect.bottom - e.clientY) / volumeBarRect.height) * 100);
        outputToVolumeElement(percent);
        player.setVolume(percent / 100);
    }
}, false);

outputToVolumeElement(Math.trunc(player.getVolume() * 100));

export {player, playerElement};