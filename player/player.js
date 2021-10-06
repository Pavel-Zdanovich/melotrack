let {throwError} = await import(`../utils/utils.js`);
let {Progress} = await import(`./progress.js`);
let {Timer} = await import(`../timer/timer.js`);

const MIN = 0;
const MAX_VOLUME = 1;
const DEFAULT_VOLUME = 0.1;

export class Player {

    constructor(callback, src) {
        if (callback != null && typeof callback === `function`) {
            this._callback = callback;
        } else {
            throwError({callback});
        }

        this._context = new AudioContext();

        this._gain = this._context.createGain();

        this._node = this._gain;
        this._node.connect(this._context.destination);

        this.#setDefault();

        this._map = new Map();
        if (src != null && typeof src === `string`) {
            this._src = src;
            this.load(src).then(() => {
                this.#createBufferSource();
                this.#createProgressAndTimer();
            });
        } else {
            console.debug(`Src specified incorrectly: ${src}`);
        }
    }

    #setDefault() {
        this.setVolume(DEFAULT_VOLUME);
    }

    load(src) {
        return fetch(src)
            .then(response => response.arrayBuffer())
            .then(audioData => this._context.decodeAudioData(audioData))
            .then(buffer => {
                this.#setBuffer(src, buffer);
            })
            .catch(error => console.log(`${error}`));
    }

    #getBuffer(src) {
        return this._map.get(src);
    }

    #setBuffer(src, buffer) {
        this._map.set(src, buffer);
    }

    #createBufferSource(offset = 0, when = 0, duration) {
        if (this._source != null) {
            this._source.disconnect(this._node);
        }
        this._source = this._context.createBufferSource();
        this._source.buffer = this.#getBuffer(this._src);
        this._source.connect(this._node);
        let state = this._context.state;
        this._source.start(when, offset, duration);
        if (state === `suspended`) {
            this._context.suspend();
        }

        this._duration = Math.trunc(this._source.buffer.duration) * 1000;
    }

    #createProgressAndTimer() {
        let start = 0;
        let end = this._duration;
        let time = Math.abs(end - start);
        let coefficient = 5;
        let step = time / (100 * coefficient);
        let increment = 1 / coefficient;
        this._progress = new Progress();
        let timerCallback = (hours, mins, secs, millis) => {
            this._progress.increment(increment);
            this._callback(this._progress.get(), hours, mins, secs, millis);
        };
        this._timer = new Timer(timerCallback, start, end, step);
    }

    play() {
        return this._context.resume().then(() => this._timer.start());
    }

    stop() {
        return this._context.suspend().then(() => this._timer.stop());
    }

    isPlaying() {
        return this._context.state === `running`;
    }

    next(src) {
        let array = Array.from(this._map.keys());
        if (src === null || src === undefined) {
            let current = array.indexOf(this._src);
            if (current === array.length - 1) {
                this._src = array[0];
            } else {
                this._src = array.find((element, index) => {
                    return index === current + 1;
                });
            }
        } else if (array.indexOf(src) !== -1) {
            throw new Error(`Src "${src}" not found!`);
        }

        this.#createBufferSource();
        this.#createProgressAndTimer();
    }

    getVolume() {
        return this._gain.gain.value;
    }

    setVolume(volume) {
        if (volume != null && typeof volume === `number` && (volume >= MIN && volume <= MAX_VOLUME)) {
            this._gain.gain.value = volume;
        } else {
            throwError({volume});
        }
    }

    getDuration() {
        return this._duration;
    }

    setDuration(duration) {
        if (duration != null && typeof duration === `number` && (duration >= 0 && duration <= this._source.buffer.duration)) {
            this._duration = duration;
        } else {
            throwError({duration});
        }
    }

    getTime() {
        return this._context.currentTime;
    }

    setTime(newTime) {
        if (newTime != null && typeof newTime === `number` && (newTime >= MIN && newTime <= this._duration)) {
            let offset = Math.trunc(newTime) / 1000;
            this.#createBufferSource(offset);
            let time = Timer.millisToTime(newTime);
            this._timer.set(...time);
            let percent = newTime / this._duration;
            this._progress.set(percent * 100);
            this._callback(this._progress.get(), ...time);
        } else {
            throwError({newTime});
        }
    }
}