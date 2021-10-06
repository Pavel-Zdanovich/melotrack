import {throwError} from "../utils/utils.js";
import {Progress} from "./progress.js";
import {Timer} from "../timer/timer.js";

const MIN = 0;
const MAX_VOLUME = 1;
const DEFAULT_VOLUME = 0.1;

export class Player {

    constructor(callback, onLoad, onPlayed, onStopped) {
        if (callback != null && typeof callback === `function`) {
            this._callback = callback;
        } else {
            throwError({callback});
        }

        this._context = new AudioContext();

        this._context.addEventListener(`statechange`, () => {
            console.log(`Context state: ${this._context.state}`);
        }, false);

        this._play = () => this._context.resume();
        this._stop = () => this._context.suspend();

        this._gain = this._context.createGain();

        this._node = this._gain;
        this._node.connect(this._context.destination);

        this.#setDefault();

        if (onPlayed != null && typeof onPlayed === `function`) {
            this._load = onLoad;
        }

        if (onPlayed != null && typeof onPlayed === `function`) {
            let play = this._play;
            this._play = () => {
                //console.log(`onPlayed() added in series before play()`);
                let promise = new Promise(() => console.log(`Source not loaded!`));
                if (this._source != null) {
                    onPlayed();
                    promise = play();
                }
                return promise;
            };
        }

        if (onStopped != null && typeof onStopped === `function`) {
            this._onStopped = onStopped;
            let stop = this._stop;
            this._stop = () => {
                //console.log(`onStopped() added in series before stop()`);
                onStopped();
                return stop();
            };
        }
    }

    #setDefault() {
        this.stop();
        this.setVolume(DEFAULT_VOLUME);
    }

    #createBufferSource(buffer) {
        if (this._source != null) {
            this._source.disconnect(this._node);
        }
        this._source = this._context.createBufferSource();

        this._source.buffer = buffer;
        this._source.connect(this._node);
        this._source.onended = this._onStopped;
    }

    #start(offset = 0, duration = this._buffer.duration, timeout = 0) {
        let state = this._context.state;
        this._source.start(timeout, offset, duration); //TODO check duration according to rewind
        if (state === `suspended`) {
            this._context.suspend();
        }
    }

    #createProgressAndTimer(direction, duration, start, end) {
        let coefficient = 5;

        let percent = direction ? 0 : 100;
        this._progress = new Progress(percent); //TODO try to make part of timer/timer prototype

        let progressStep = 1 / coefficient;
        let operation = direction ? () => this._progress.increment(progressStep) : () => this._progress.decrement(progressStep);
        let timerCallback = (hours, mins, secs, millis) => {
            operation();
            this._callback(this._progress.get(), hours, mins, secs, millis);
        };

        let timerStep = duration / (100 * coefficient);
        this._timer = new Timer(timerCallback, start, end, timerStep); //TODO timer don't stop due to lost context

        let play = this._play;
        this._play = () => {
            //console.log(`timer.start() added in series before play()`);
            this._timer.start();
            return play();
        };

        let stop = this._stop;
        this._stop = () => {
            //console.log(`timer.stop() added in series before stop()`);
            this._timer.stop();
            return stop();
        };
    }

    decode(promise) {
        return this._context.decodeAudioData(promise);
    }

    set(buffer, start = 0, end = Math.trunc(buffer.duration * 1000)) {
        if (buffer instanceof AudioBuffer) {
            this._buffer = buffer;
        } else {
            throwError({buffer});
        }

        if (start != null && typeof start === `number`) {
            console.log(`Start: ${start}`);
            this._start = start;
        } else {
            throwError({start});
        }

        if (end != null && typeof end === `number`) {
            console.log(`End: ${end}`);
            this._end = end;
        } else {
            throwError({end});
        }

        this._direction = end > start;
        if (!this._direction) {
            this._buffer = buffer.reverse();
            this._start = end;
            this._end = start;
        }
        this._duration = this._end - this._start;

        this.#createBufferSource(this._buffer);
        this.#start(this._start, this._duration);
        this.#createProgressAndTimer(this._direction, this._duration, this._start, this._end);

        this._load(``, this._duration);
    }

    play() {
        return this._play();
    }

    stop() {
        return this._stop();
    }

    isPlaying() {
        return this._context.state === `running`;
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

    setDuration(duration, direction = true) {
        if (duration != null && typeof duration === `number` && (duration >= MIN && duration <= this._buffer.duration)) {
            this._duration = duration;
        } else {
            throwError({duration});
        }

        //TODO increase duration according to direction
    }

    getTime() {
        return this._context.currentTime;
    }

    setTime(newTime) {
        if (newTime != null && typeof newTime === `number` && (newTime >= MIN && newTime <= this._duration)) {
            let start = Math.trunc(newTime) / 1000;
            this.#createBufferSource(this._buffer);
            this.#start(start, this._duration);

            let percent = newTime / this._duration;
            this._progress.set(percent * 100);

            this._timer.set(...Timer.millisToTime(newTime));
        } else {
            throwError({newTime});
        }
    }

    getRate() {
        return this._source.playbackRate.value;
    }

    setRate(rate) {
        if (rate != null && typeof rate === `number` && (rate >= this._source.playbackRate.minValue && rate <= this._source.playbackRate.maxValue)) {
            this._source.playbackRate.value = rate;
        } else {
            throwError({rate});
        }
    }
}