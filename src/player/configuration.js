import {current, next, previous, toMinsAndSecsString, random} from "../utils/utils.js";
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
const canvasElement = audioSliderElement.firstElementChild;
const audioBarElement = audioSliderElement.children[1];
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

const canvasContext = canvasElement.getContext(`2d`);

const color = (property, alpha) => {
    canvasContext.globalAlpha = alpha;
    canvasContext.strokeStyle = document.documentElement.style.getPropertyValue(property);
};

let type;
const visualizationTypes = [`waveform`, `amplitude`, `frequency`];
let isNotRendered;
const middle = canvasElement.height / 2;
const visualize = (analyser, fftSize = 4096, unit = `32bit`) => {
    analyser.fftSize = fftSize;

    switch (type) {
        case `waveform`: {
            if (isNotRendered) {
                color(`--border-color`, 0.075);
                all(player.get().getBuffer().getChannelData(0), fftSize);
                isNotRendered = false;
            }

            break;
        }
        case `amplitude`: {
            if (isNotRendered) {
                color(`--border-color`, 0.3);
                amplitude([canvasElement.height / 2]);
                isNotRendered = false;
                break;
            }

            let array;
            switch (unit) {
                case `8bit`: {
                    array = new Uint8Array(analyser.fftSize);
                    analyser.getByteTimeDomainData(array);
                    array = Array.from(array).map(point => point - 128); //bit to number
                    break;
                }
                case `32bit`: {
                    array = new Float32Array(analyser.fftSize);
                    analyser.getFloatTimeDomainData(array);
                    break;
                }
                default: {
                    throw new Error(`Illegal visualization unit: ${unit}`);
                }
            }

            array = normalize(array);

            amplitude(array);

            break;
        }
        case `frequency`: {
            if (isNotRendered) {
                color(`--border-color`, 0.3);
                frequency(new Array(analyser.frequencyBinCount).fill(- middle));
                isNotRendered = false;
                break;
            }

            let array;
            switch (unit) {
                case `8bit`: {
                    array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    break;
                }
                case `32bit`: {
                    array = new Float32Array(analyser.frequencyBinCount);
                    analyser.getFloatFrequencyData(array);
                    break;
                }
                default: {
                    throw new Error(`Illegal visualization unit: ${unit}`);
                }
            }

            frequency(array); //bar graph, spectrum, equalizer

            break;
        }
        default: {
            throw new Error(`Illegal visualization type: ${type}`);
        }
    }
};

const normalize = (array) => {
    const max = Math.max(...array.map(point => Math.abs(point)));
    return array.map(point => ((point / max) * middle) + middle);
};

const all = (array, fftSize) => {
    const numberOfSamples = fftSize;
    const numberOfPoints = Math.floor(array.length / numberOfSamples);
    const approximated = [];
    for (let sampleIndex = 0; sampleIndex < numberOfSamples; sampleIndex++) {
        let startOfSample = numberOfPoints * sampleIndex;
        let sumOfPoints = 0;
        for (let pointIndex = 0; pointIndex < numberOfPoints; pointIndex++) {
            sumOfPoints = sumOfPoints + array[startOfSample + pointIndex];
        }
        const sampleMean = sumOfPoints / numberOfPoints;
        approximated.push(sampleMean);
    }

    amplitude(normalize(approximated));
};

const amplitude = (array) => {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.beginPath();
    const sliceWidth = canvasElement.width / array.length;
    let x = 0;
    let y;
    for (let i = 0; i < array.length; i++) {
        y = canvasElement.height - array[i];
        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasContext.lineTo(canvasElement.width, canvasElement.height / 2);
    canvasContext.stroke();
};

const frequency = (array) => {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    const width = (canvasElement.width / array.length) * 2.5;
    let x = 0;
    let y = canvasElement.height;
    for (let i = 0; i < array.length; i++) {
        const height = canvasElement.height + array[i]; //array[i] is negative value
        canvasContext.fillRect(x, y, width, - height);
        x += width + 1;
    }
};

const devisualize = () => {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    color(`--background-color`, 0);
};

const outputTitle = (title) => {
    audioTitleElement.innerHTML = title;
};

let duration;
const outputTime = (time, outerDuration) => {
    if (outerDuration) {
        duration = outerDuration;
    }
    if (time) {
        audioTimeElement.innerHTML = `${time} / ${duration}`;
    } else {
        audioTimeElement.innerHTML = ``;
    }
}

const outputProgress = (percentage) => {
    audioProgressElement.style.width = `${percentage}%`;
    audioInputElement.value = percentage;
};

const player = new Player(); //TODO create modal button to create player for https://stackoverflow.com/questions/55026293/google-chrome-javascript-issue-in-getting-user-audio-the-audiocontext-was-not
player.addEventListener(`output`, (e) => {
    const track = e.detail.track;
    const title = player.isTitle() ? `${track.artist} - ${track.title}` : ``;
    outputTitle(title);
    const time = toMinsAndSecsString(...e.detail.time);
    const duration = toMinsAndSecsString(...Timer.millisToTime(track.getDuration()));
    outputTime(time, duration);
    const percentage = e.detail.progress;
    outputProgress(percentage);
    type = random(visualizationTypes);
    isNotRendered = true;
    visualize(player.getAnalyser());
});
player.addEventListener(`play`, () => {
    playLabelElement.removeChild(playIconElement);
    playLabelElement.appendChild(stopIconElement);
});

player.addEventListener(`tick`, (e) => {
    const time = toMinsAndSecsString(...e.detail.time);
    outputTime(time);
    const percentage = e.detail.progress;
    outputProgress(percentage);
    visualize(player.getAnalyser());
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
    outputTitle(``);
    outputTime(``);
    outputProgress(0);
    devisualize();
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
        const time = toMinsAndSecsString(...Timer.millisToTime(millis));
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
volumeElement.dispatchEvent(new Event(`input`));

export {player};

console.log(`player loaded`);