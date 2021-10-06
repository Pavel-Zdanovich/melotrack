import {current, next, previous, outputMinsAndSecs} from "../utils/utils.js";
import {Timer} from "../timer/timer.js";
import {Player} from "./player.js";

const playerElement = document.body.children[0].children[1];

const playElement = playerElement.children[0];
const modeElement = playerElement.children[1];

const audioElement = playerElement.children[2];

const audioLabelElement = audioElement.firstElementChild;
const audioTitleElement = audioLabelElement.firstElementChild;
const audioTimeElement = audioLabelElement.lastElementChild;

const audioSliderElement = audioElement.lastElementChild;
const audioBarElement = audioSliderElement.firstElementChild;
const audioProgressElement = audioBarElement.firstElementChild;
const audioInputElement = audioSliderElement.lastElementChild;

const volumeElement = playerElement.children[3];

const volumeInfoElement = volumeElement.firstElementChild;
const volumeValueElement = volumeInfoElement.firstElementChild;
const volumeIconElement = volumeInfoElement.lastElementChild;

const volumeSliderElement = volumeElement.lastElementChild;
const volumeBarElement = volumeSliderElement.firstElementChild;
const volumeProgressElement = volumeBarElement.firstElementChild;
const volumeInputElement = volumeSliderElement.lastElementChild;

const outputToAudioElements = (percentage, hours, mins, secs, millis) => {
    audioTimeElement.innerHTML = outputMinsAndSecs(hours, mins, secs, millis);
    audioProgressElement.style.width = `${percentage}%`;
    audioInputElement.value = percentage;
};

const player = new Player(); //TODO create modal button to create player for https://stackoverflow.com/questions/55026293/google-chrome-javascript-issue-in-getting-user-audio-the-audiocontext-was-not
player.addEventListener(`load`, (e) => {
    const track = e.detail.track;
    audioTitleElement.innerHTML = `${track.artist} - ${track.title}`;
    const progress = e.detail.progress;
    const time = e.detail.time;
    outputToAudioElements(progress, ...time);
});
player.addEventListener(`play`, () => {
    playElement.innerHTML = `⏸`;
});
player.addEventListener(`tick`, (e) => {
    const progress = e.detail.progress;
    const time = e.detail.time;
    outputToAudioElements(progress, ...time);
});
player.addEventListener(`stop`, () => {
    playElement.innerHTML = `▶`;
});
player.addEventListener(`end`, () => {
    playElement.innerHTML = `▶`;
});

playElement.addEventListener(`click`, () => {
    if (player.isPlaying()) {
        player.stop();
    } else {
        player.play();
    }
});

const modes = new Map([[`🔁`, current], [`⏭️`, next], [`⏮️`, previous]]);
let iterator = modes.entries();
iterator.next(); //need to skip
modeElement.addEventListener(`click`, () => {
    let mode = iterator.next();
    if (mode.done) {
        iterator = modes.entries();
        mode = iterator.next();
    }
    player.setSelectionMode(mode.value[1]);
    modeElement.innerHTML = mode.value[0];
});
player.setSelectionMode(modes.get(modeElement.innerHTML));

audioElement.addEventListener(`input`, () => {
    const percentage = audioInputElement.value;
    const track = player.get();
    const millis = track.getDuration() * (percentage / 100);
    player.setTime(millis);
    if (!player.isPlaying()) {
        const progress = percentage;
        const time = Timer.millisToTime(millis);
        outputToAudioElements(progress, ...time);
    }
});

volumeElement.addEventListener(`input`, () => {
    const percentage = volumeInputElement.value;
    player.setVolume(percentage / 100);
    volumeProgressElement.style.width = `${percentage}%`;
    volumeValueElement.innerHTML = percentage;
});
volumeInputElement.value = 50;
volumeElement.dispatchEvent(new Event('input'));

export {player};

console.log(`player loaded`);