let {outputMinsAndSecs, outputMinsSecsAndMillis} = await import(`../utils/utils.js`);
let {Timer} = await import(`../timer/timer.js`);
let {Player} = await import(`./player.js`);

let playerElement = null;

let elements = document.getElementsByClassName(`player`);
if (elements.length === 1) {
    playerElement = elements.item(0);
} else {
    throw new Error(`Can't find player`);
}

let playElement = playerElement.children[0];
let barElement = playerElement.children[1];
let timeElement = barElement.firstElementChild;
let progressElement = barElement.lastElementChild;
let dropdownElement = playerElement.children[2];

progressElement.style.width = `0%`;
let outputToElement = (progress, hours, mins, secs, millis) => {
    progressElement.innerHTML = outputMinsSecsAndMillis(hours, mins, secs, millis);
    progressElement.style.width = progress + `%`;
};

let player = new Player(outputToElement, 'nirvana_-_smells-like-teen-spirit.mp3');

outputToElement(0, ...Timer.millisToTime(0));

playElement.addEventListener(`click`, () => {
    if (player.isPlaying()) {
        player.stop().then(() => playElement.innerHTML = `▷`);
    } else {
        player.play().then(() => playElement.innerHTML = `⏸`);
    }
}, false);

let barRect = barElement.getBoundingClientRect();
barElement.addEventListener(`click`, (e) => {
    if (e.clientX >= barRect.left && e.clientX <= barRect.right &&
        e.clientY >= barRect.top && e.clientY <= barRect.bottom) {
        let percent = ((e.clientX - barRect.left) / barRect.width);
        player.setTime(player.getDuration() * percent);
    }
}, false);

let element = document.createElement(`div`);
element.setAttribute(`class`, `element`);
element.innerHTML = `💩`;
let volumeElement = document.createElement(`div`);
volumeElement.setAttribute(`class`, `volume`);
volumeElement.innerText = `🔈`;

dropdownElement.addEventListener(`click`, () => {
    outputToElement(...Timer.millisToTime(0));
    player.load(`progmathist_-_bsuir.mp3`).then(() => player.next());
    /*if (playerElement.lastChild === volumeElement) {
        dropdownElement.innerHTML = `▽`;
        playerElement.setAttribute(`class`, `player`);
        playerElement.removeChild(element);
        playerElement.removeChild(volumeElement);
    } else {
        dropdownElement.innerHTML = `△`;
        playerElement.setAttribute(`class`, `player open-player`);
        playerElement.appendChild(element);
        playerElement.appendChild(volumeElement);
    }*/
}, false);