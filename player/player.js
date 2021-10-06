let {throwError} = await import(`../utils.js`);
let {Progress} = await import(`./progress.js`);
let {Timer} = await import(`../timer/timer.js`);

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;
const MIN_TIME = 0;

export class Player {

    constructor(audio, progress, timer) {
        if (audio != null && audio instanceof HTMLAudioElement) {
            this._audio = audio;
            this._duration = audio.duration * 1000;
        } else {
            throwError({audio});
        }

        if (progress != null && progress instanceof Progress) {
            this._progress = progress;
        } else {
            throwError({progress});
        }

        if (timer != null && timer instanceof Timer) {
            this._timer = timer;
        } else {
            throwError({timer});
        }

        this._context = new AudioContext();//new OfflineAudioContext(1, 300.878, 48000);
        this._stream = this._context.createMediaStreamDestination();
        this._source = this._context.createBufferSource();

        this._source.connect(this._stream);
        this._audio.srcObject = this._stream.stream;

        let request = new XMLHttpRequest();
        request.open('GET', 'progmathist_-_bsuir.mp3');
        request.responseType = 'arraybuffer';
        request.onload = () => {
            this._context.decodeAudioData(request.response, (data) => {
                //Array.prototype.reverse.call(data.getChannelData(0));
                //Array.prototype.reverse.call(data.getChannelData(1));
                this._source.buffer = data;
            });
            console.log(`Success`);
        };
        request.onerror = (error) => {
            console.log(`${error}`);
        };
        request.send();
    }

    load(src) {
        if (src != null && typeof src === `string`) {
            this._audio.src = src;
            this._audio.load();
        } else {
            throwError({src});
        }
    }

    isPlaying() {
        return this._timer.isTicking();
    }

    play() {
        this._audio.play();
        this._timer.start();
    }

    pause() {
        this._audio.pause();
        this._timer.stop();
    }

    getVolume() {
        return this._audio.volume;
    }

    setVolume(volume) {
        if (volume != null && typeof volume === `number` && (volume >= MIN_VOLUME && volume <= MAX_VOLUME)) {
            this._audio.volume = volume;
        } else {
            throwError({volume});
        }
    }

    getDuration() {
        return this._duration;
    }

    getTime() {
        return this._audio.currentTime;
    }

    setTime(newTime) {
        if (newTime != null && typeof newTime === `number` && (newTime >= MIN_TIME && newTime <= this._duration)) {
            let time = Timer.millisToTime(newTime);
            let hours = time.hours;
            let mins = time.mins;
            let secs = time.secs;
            let millis = time.millis;
            let percent = newTime / this._duration;
            this._audio.currentTime = newTime / 1000;
            this._timer.set(hours, mins, secs, millis);
            this._progress.set(percent * 100);
        } else {
            throwError({newTime});
        }
    }
}