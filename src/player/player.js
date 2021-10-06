import {throwError} from "../utils/utils.js";
import {Progress} from "./progress.js";
import {Timer} from "../timer/timer.js";
import {Track} from "../entities/track.js";

const MIN = 0;
const MAX_VOLUME = 1;
const DEFAULT_VOLUME = 0.5;
const COEFFICIENT = 5;

export class Player extends EventTarget {

    constructor(callback) {
        super();
        if (callback != null && typeof callback === `function`) {
            this._callback = callback;
        } else {
            throwError({callback});
        }

        this._context = new AudioContext();

        this._context.addEventListener(`statechange`, () => {
            console.log(`Context state: ${this._context.state}`);
        });

        this._play = () => {
            if (this._source == null) {
                return new Promise(() => console.log(`Source not loaded!`));
            }
            return this._context.resume().then(() => {
                this.dispatchEvent(new CustomEvent(`play`, {detail: this._track}));
            });
        };

        this._stop = () => {
            return this._context.suspend().then(() => {
                this.dispatchEvent(new CustomEvent(`stop`, {detail: this._track}));
            });
        };

        this._gain = this._context.createGain();

        this._node = this._gain;
        this._node.connect(this._context.destination);

        this.stop(); //stop the created context because it is running at start
        this.setVolume(DEFAULT_VOLUME);
    }

    #createBufferSource(buffer) {
        if (this._source != null) {
            this._source.disconnect(this._node);
        }

        this._source = this._context.createBufferSource(); //because AudioBufferSourceNode is not reusable

        this._source.buffer = buffer;
        this._source.connect(this._node);
        this._source.onended = () => {  //called once
            this.stop(); //TODO decide whether to call the stop event at the end
            this._source = null;
            this.dispatchEvent(new CustomEvent(`end`, {detail: this._track}));
        };
    }

    #start(offset = 0, duration = this.getDuration(), timeout = 0) {
        const state = this._context.state;
        this._source.start(timeout, offset, duration);
        if (state === `suspended`) {
            this.stop();
        }
    }

    #createProgressAndTimer(direction, duration, start, end) {
        const progressStep = 1 / COEFFICIENT;
        this._progress = new Progress(direction, progressStep);

        let timerCallback = (hours, mins, secs, millis) => {
            this._progress.make();
            this._callback(this._progress.get(), hours, mins, secs, millis);
        };

        const timerStep = duration / (100 * COEFFICIENT);
        this._timer = new Timer(timerCallback, start, end, timerStep);

        const play = this._play;
        this._play = () => {
            if (!this._timer.isTicking()) {
                this._timer.start();
            }
            return play();
        };

        const stop = this._stop;
        this._stop = () => {
            if (this._timer.isTicking()) { //because the timer works separately and stops at the end
                this._timer.stop();
            }
            return stop();
        };
    }

    decode(promise) {
        return this._context.decodeAudioData(promise);
    }

    get() {
        return this._track;
    }

    set(track) {
        if (track instanceof Track) {
            this._track = track;
        } else {
            throwError({track});
        }

        const playingOnSet = this.isPlaying();
        if (playingOnSet) {
            this.stop();
        }

        this.#createBufferSource(this._track.getBuffer());
        this.#start(this._track.getStart(), this._track.getDuration());
        this.#createProgressAndTimer(this._track.getDirection(), this._track.getDuration(), this._track.getStart(), this._track.getEnd());

        this.dispatchEvent(new CustomEvent(`load`, {detail: this._track}));

        if (playingOnSet) {
            this.play();
        }
    }

    play() {
        return this._play(); //TODO repeat or deny
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
        return this._track.getDuration();
    }

    setDuration(duration, direction = true) {
        //TODO increase duration according to direction
    }

    getTime() {
        return this._context.currentTime;
    }

    setTime(newTime) {
        if (newTime != null && typeof newTime === `number` && (newTime >= MIN && newTime <= this.getDuration())) {
            const start = Math.trunc(newTime) / 1000;

            this.#createBufferSource(this._track.getBuffer());
            this.#start(start, this.getDuration());

            const percent = newTime / this.getDuration();
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

    getSelectionMode() {
        return this._selectionMode;
    }

    setSelectionMode(selectionMode) {
        if (typeof selectionMode === `function`) {
            this._selectionMode = selectionMode;
        } else {
            throwError({selectionMode});
        }
    }
}