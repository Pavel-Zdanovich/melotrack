let { outputMinsAndSecs, outputMinsSecsAndMillis } = await import(`../utils.js`);
let { Progress } = await import(`./progress.js`);
let { Timer } = await import(`../timer/timer.js`);
let { Player } = await import(`./player.js`);

let playerElement = null;

let elements = document.getElementsByClassName(`player`);
if (elements.length === 1) {
    playerElement = elements.item(0);
} else {
    throw new Error(`Can't find player`);
}

let audioElement = playerElement.children[0];
audioElement.volume = 0.25;
let playElement = playerElement.children[1];
let barElement = playerElement.children[2];
let timeElement = barElement.firstElementChild;
let progressElement = barElement.lastElementChild;
let dropdownElement = playerElement.children[3];

let barRect = barElement.getBoundingClientRect();

let start = 0;
let end = audioElement.duration * 1000;
let time = Math.abs(end - start);
let coefficient = 5;
let step = time / (100 * coefficient);

progressElement.style.width = `0%`;
let increment = 1 / coefficient;
let progress = new Progress();

let output = (hours, mins, secs, millis) => {
    progressElement.innerHTML = outputMinsSecsAndMillis(hours, mins, secs, millis);
    progress.increment(increment);
    progressElement.style.width = progress.get() + `%`;
};

let timer = new Timer(output, start, end, step);
let player = new Player(audioElement, progress, timer);

let t = Timer.millisToTime(0);
progressElement.innerHTML = outputMinsSecsAndMillis(t.hours, t.mins, t.secs, t.millis);

playElement.addEventListener(`click`, (e) => {
    if (player.isPlaying()) {
        player.pause();
        playElement.innerHTML = `▷`;
    } else {
        player.play();
        playElement.innerHTML = `⏸`;
    }
}, false);

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