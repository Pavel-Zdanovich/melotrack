import {current, next, previous, outputMinsAndSecs} from "../utils/utils.js";
import {Timer} from "../timer/timer.js";
import {Player} from "./player.js";

const playerElement = document.body.children[0].children[1];

const controlsElement = playerElement.children[0];
const playLabelElement = controlsElement.children[0];
const playIconElement = playLabelElement.children[0];
const stopIconElement = playLabelElement.children[1];
playLabelElement.removeChild(stopIconElement);
const playInputElement = controlsElement.children[1];
const modeLabelElement = controlsElement.children[2];
const repeatIconElement = modeLabelElement.children[0];
const forwardIconElement = modeLabelElement.children[1];
const previousIconElement = modeLabelElement.children[2];
modeLabelElement.removeChild(forwardIconElement);
modeLabelElement.removeChild(previousIconElement);
const modeInputElement = controlsElement.children[3];

const audioElement = playerElement.children[1];

const audioLabelElement = audioElement.firstElementChild;
const audioTitleElement = audioLabelElement.firstElementChild;
const audioTimeElement = audioLabelElement.lastElementChild;

const audioSliderElement = audioElement.lastElementChild;
const audioBarElement = audioSliderElement.firstElementChild;
const audioProgressElement = audioBarElement.firstElementChild;
const audioInputElement = audioSliderElement.lastElementChild;

const volumeElement = playerElement.children[2];

const volumeInfoElement = volumeElement.firstElementChild;
const volumeValueElement = volumeInfoElement.firstElementChild;
const volumeIconElement = volumeInfoElement.lastElementChild;

const volumeSliderElement = volumeElement.lastElementChild;
const volumeBarElement = volumeSliderElement.firstElementChild;
const volumeProgressElement = volumeBarElement.firstElementChild;
const volumeInputElement = volumeSliderElement.lastElementChild;

const outputToAudioElements = (title, time, percentage) => {
    audioTitleElement.innerHTML = title;
    audioTimeElement.innerHTML = time;
    audioProgressElement.style.width = `${percentage}%`;
    audioInputElement.value = percentage;
};
const outputProgress = (time, percentage) => {
    audioTimeElement.innerHTML = audioTimeElement.innerHTML.replace(/.+\//, `${time} /`);
    audioProgressElement.style.width = `${percentage}%`;
    audioInputElement.value = percentage;
};

const player = new Player(); //TODO create modal button to create player for https://stackoverflow.com/questions/55026293/google-chrome-javascript-issue-in-getting-user-audio-the-audiocontext-was-not
player.addEventListener(`output`, (e) => {
    const track = e.detail.track;
    const title = player.isTitle() ? `${track.artist} - ${track.title}` : ``;
    const time = outputMinsAndSecs(...e.detail.time);
    const duration = outputMinsAndSecs(...Timer.millisToTime(track.getDuration()));
    const percentage = e.detail.progress;
    outputToAudioElements(title, `${time} / ${duration}`, percentage);
});
player.addEventListener(`play`, () => {
    playLabelElement.removeChild(playIconElement);
    playLabelElement.appendChild(stopIconElement);
});
player.addEventListener(`tick`, (e) => {
    const time = outputMinsAndSecs(...e.detail.time);
    const percentage = e.detail.progress;
    outputProgress(time, percentage);
});
player.addEventListener(`stop`, () => {
    playLabelElement.removeChild(stopIconElement);
    playLabelElement.appendChild(playIconElement);
});
player.addEventListener(`end`, () => {
    playLabelElement.removeChild(stopIconElement);
    playLabelElement.appendChild(playIconElement);
});
player.addEventListener(`unload`, () => {
    outputToAudioElements(``, ``, 0);
});

const playListener = () => {
    if (!player.get()) {
        return;
    }

    if (player.isPlaying()) {
        player.stop();
    } else {
        player.play();
    }
};
playInputElement.addEventListener(`click`, playListener);
playInputElement.addEventListener(`touchstart`, playListener);

const modes = new Map(
    [
        [repeatIconElement, current],
        [forwardIconElement, next],
        [previousIconElement, previous]
    ]
);
let iterator = modes.entries();
iterator.next(); //need to skip
const modeListener = () => {
     let mode = iterator.next();
     if (mode.done) {
         iterator = modes.entries();
         mode = iterator.next();
     }
     player.setSelectionMode(mode.value[1]);
     modeLabelElement.removeChild(modeLabelElement.firstElementChild);
     modeLabelElement.appendChild(mode.value[0]);
}
modeInputElement.addEventListener(`click`, modeListener);
modeInputElement.addEventListener(`touchstart`, modeListener);
player.setSelectionMode(modes.get(modeLabelElement.firstElementChild));

audioElement.addEventListener(`input`, () => {
    const track = player.get();
    if (!track) {
        return;
    }

    const percentage = audioInputElement.value;

    const millis = track.getDuration() * (percentage / 100);
    player.setTime(millis);

    if (!player.isPlaying()) {
        const time = outputMinsAndSecs(...Timer.millisToTime(millis));
        outputProgress(time, percentage);
    }
});

volumeElement.addEventListener(`input`, () => {
    const percentage = volumeInputElement.value;
    window.localStorage.setItem(`volume`, percentage);
    player.setVolume(percentage / 100);
    volumeProgressElement.style.height = `${percentage}%`;
    volumeValueElement.innerHTML = percentage;
});
const volume = window.localStorage.getItem(`volume`);
volumeInputElement.value = volume !== null ? volume : 50;
volumeElement.dispatchEvent(new Event('input'));

export {player};

console.log(`player loaded`);