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

//volumeSliderElement.style.width = `${volumeElement.clientHeight}px`;

const outputToAudioElements = (progress, hours, mins, secs, millis) => {
    audioTimeElement.innerHTML = outputMinsAndSecs(hours, mins, secs, millis);
    audioProgressElement.style.width = `${progress}%`;
    audioInputElement.value = progress;
};

const player = new Player(outputToAudioElements);
player.addEventListener(`load`, (e) => {
    audioTitleElement.innerHTML = `${e.detail.artist} - ${e.detail.title}`;
    outputToAudioElements(0, ...Timer.millisToTime(e.detail._duration));
});
player.addEventListener(`play`, () => {
    //console.log(`play`);
    playElement.innerHTML = `⏸`;
});
player.addEventListener(`stop`, () => {
    //console.log(`stop`);
    playElement.innerHTML = `▶`;
});

playElement.addEventListener(`click`, () => {
    if (player.isPlaying()) {
        player.stop();
    } else {
        player.play();
    }
});

let modeIndex = 0;
const modes = [
    {
        icon: `🔁`,
        select: current
    },
    {
        icon: `⏭️`,
        select: next
    },
    {
        icon: `⏮️`,
        select: previous
    }
];
modeElement.addEventListener(`click`, () => {
    modeIndex++;
    if (modeIndex === 3) {
        modeIndex = 0;
    }
    const mode = modes[modeIndex];
    player.setSelectionMode(mode.select);
    modeElement.innerHTML = mode.icon;
});
player.setSelectionMode(modes[modeIndex].select);

audioElement.addEventListener(`input`, () => {
    const percentage = audioInputElement.value;
    const time = player.getDuration() * percentage / 100;
    player.setTime(time);
    outputToAudioElements(percentage, ...Timer.millisToTime(time));
});

volumeElement.addEventListener(`input`, () => {
    const percentage = volumeInputElement.value;
    player.setVolume(percentage / 100);
    volumeProgressElement.style.width = `${percentage}%`;
    volumeValueElement.innerHTML = percentage;
});

export {player};

console.log(`player loaded`);