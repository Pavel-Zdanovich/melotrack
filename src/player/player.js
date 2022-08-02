import {throwError} from "../utils/utils.js";
import {Progress} from "./progress.js";
import {Timer} from "../timer/timer.js";
import {Track} from "../entities/track.js";

const MIN = 0;
const MAX_VOLUME = 1;
const COEFFICIENT = 5;

export class Player extends EventTarget {

    constructor() {
        super();

        this._context = new AudioContext();

        this._context.addEventListener(`statechange`, () => {
            //console.log(`Context state: ${this._context.state}`);
        });

        this._gain = this._context.createGain();

        this._node = this._gain;

        this._node.connect(this._context.destination);

        this._progress = new Progress();
        this._timer = new Timer();
        this._timer.addEventListener(`start`, () => {
            this._context.resume().then(() => {
                this.dispatchEvent(new CustomEvent(`play`, {detail: this._track}));
            });
        });
        this._timer.addEventListener(`tick`, (e) => {
            this._progress.make();
            const progress = this._progress.get();
            const time = e.detail;
            this.dispatchEvent(new CustomEvent(`tick`, {detail: {progress, time}}));
        });
        this._timer.addEventListener(`stop`, () => {
            //console.log(`stop`);
            this._context.suspend().then(() => {
                this.dispatchEvent(new CustomEvent(`stop`, {detail: this._track}));
            });
        });
        this._timer.addEventListener(`end`, () => {
            //console.log(`end`);
            this._context.suspend().then(() => {
                this.dispatchEvent(new CustomEvent(`end`, {detail: this._track}));
            });
        });
    }

    #createBufferSource(direction, rate, buffer) {
        if (this._source != null) {
            this._source.disconnect(this._node); //because previous sources will play unless disconnect
        }

        this._source = this._context.createBufferSource(); //because AudioBufferSourceNode is not reusable

        if (!direction) {
            for (let i = 0; i < buffer.numberOfChannels; i++) {
                buffer.getChannelData(i).reverse();
            }
        }

        this.setRate(rate);

        this._source.buffer = buffer;
        this._source.connect(this._node);
        this._source.onended = (e) => {
            //console.log(e);
        };
    }

    #start(start = 0, end) {
        const state = this._context.state;
        const offset = start / 1000; //in seconds
        const duration = end / 1000; //in seconds
        this._source.start(0, offset, duration); //begin playback immediately
        if (state === `suspended`) {
            this._context.suspend();
        }
    }

    #createProgressAndTimer(duration, timerStart, timerEnd) {
        const millisInPercent = duration / 100; //least common multiple
        const timerStep = millisInPercent / COEFFICIENT;
        //const progressInPercent = 100 / 100;
        const progressStart = (timerStart / duration) * 100;
        const progressEnd = (timerEnd / duration) * 100;
        const progressStep = 1 / COEFFICIENT;

        this._progress.load(progressStart, progressEnd, progressStep);
        this._timer.load(timerStart, timerEnd, timerStep);
    }

    decode(audioData) {
        return this._context.decodeAudioData(audioData);
    }

    get() {
        return this._track;
    }

    load(track) {
        if (track instanceof Track) {
            this._track = track;
        } else {
            throwError({track});
        }

        const playingOnSet = this.isPlaying();
        if (playingOnSet) {
            this.stop();
        }

        this.#createBufferSource(this._track.getDirection(), this._track.getRate(), this._track.getBuffer());
        this.#start(this._track.getStart(), this._track.getEnd());
        this.#createProgressAndTimer(this._track.getDuration(), this._track.getStart(), this._track.getEnd());

        if (playingOnSet) {
            this.play();
        }

        const progress = this._progress.get();
        const time = Timer.millisToTime(this._track.getStart());
        this.dispatchEvent(new CustomEvent(`output`, {detail: {track, progress, time}}));
    }

    unload() {
        this._track = undefined;

        if (this._source != null) {
            this._source.disconnect(this._node); //because previous sources will play unless disconnect
        }
        this._source = undefined;

        this._progress.load();
        this._timer.load(0);
        this.dispatchEvent(new CustomEvent(`unload`));
    }

    play() {
        this._timer.start();
    }

    stop() {
        this._timer.stop();
    }

    isPlaying() {
        return this._context.state === `running`; //closed | running | suspended
    }

    getVolume() {
        return this._gain.gain.value;
    }

    setVolume(volume) {
        if (typeof volume === `number` && (volume >= MIN && volume <= MAX_VOLUME)) {
            this._gain.gain.value = volume;
        } else {
            throwError({volume});
        }
    }

    getTime() {
        return this._context.currentTime;
    }

    setTime(time) {
        if (typeof time === `number` && (time >= MIN && time <= this._track.getDuration())) {
            this.#createBufferSource(this._track.getDirection(), this._track.getRate(), this._track.getBuffer());
            this.#start(time, this._track.getEnd());

            this._progress.set(time / this._track.getDuration() * 100);
            this._timer.set(time);
        } else {
            throwError({time});
        }
    }

    getRate() {
        return this._source.playbackRate.value;
    }

    setRate(rate) {
        if (typeof rate === `number` && (rate >= this._source.playbackRate.minValue && rate <= this._source.playbackRate.maxValue)) {
            this._source.playbackRate.value = rate;
        } else {
            throwError({rate});
        }
    }

    isTitle() {
        return this._titleMode;
    }

    setTitleMode(titleMode) {
        if (typeof titleMode === `boolean`) {
            this._titleMode = titleMode;
        } else {
            throwError({titleMode});
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