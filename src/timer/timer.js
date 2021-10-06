import {throwError} from "../utils/utils.js";

const MILLIS_IN_SEC = 1000;
const SECS_IN_MIN = 60;
const MINS_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const MIN_TIME = 0;

const MILLIS_IN_MIN = MILLIS_IN_SEC * SECS_IN_MIN;
const MILLIS_IN_HOUR = MILLIS_IN_MIN * MINS_IN_HOUR;
const MILLIS_IN_DAY = MILLIS_IN_HOUR * HOURS_IN_DAY;

export class Timer extends EventTarget {

    constructor() {
        super();
    }

    load(start, end = 0, step = 1000) {
        if (typeof start === `number` && (start >= MIN_TIME && start <= MILLIS_IN_DAY)) {
            this._start = start;
        } else {
            throwError({start});
        }

        if (typeof end === `number` && (end >= MIN_TIME && end <= MILLIS_IN_DAY)) {
            this._end = end;
        } else {
            throwError({end});
        }

        this._direction = this._end > this._start;
        this._operation = this._direction ? this.#increment : this.#decrement;
        this._duration = this._direction ? this._end - this._start : this._start - this._end; //TODO check performance vs Math.abs(end - start)

        if (typeof step === `number` && (step > MIN_TIME && step <= MILLIS_IN_DAY)) {
            this._stepInMillis = step;

            if (this._stepInMillis >= MILLIS_IN_SEC && this._stepInMillis < MILLIS_IN_MIN) {
                this._stepInSecs = this._stepInMillis / MILLIS_IN_SEC;
            } else {
                this._stepInSecs = 1;
            }

            if (this._stepInMillis >= MILLIS_IN_MIN && this._stepInMillis < MILLIS_IN_HOUR) {
                this._stepInMins = this._stepInMillis / MILLIS_IN_MIN;
            } else {
                this._stepInMins = 1;
            }

            if (this._stepInMillis >= MILLIS_IN_HOUR && this._stepInMillis < MILLIS_IN_DAY) {
                this._stepInHours = this._stepInMillis / MILLIS_IN_HOUR;
            } else {
                this._stepInHours = 1;
            }

            this._counter = this._duration / this._stepInMillis;
        } else {
            throwError({step});
        }

        this.#initialize();

        this.dispatchEvent(new CustomEvent(`load`, {detail: [this._hours, this._mins, this._secs, this._millis]}));
    }

    #initialize() {
        if (this._direction) {
            [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._start);
        } else {
            if (this._end !== 0) {
                [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._start);
            } else {
                [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._duration);
            }
        }
    }

    #increment() {
        if (this._stepInMillis < MILLIS_IN_SEC) {
            if (this._millis < MILLIS_IN_SEC - this._stepInMillis) {
                this._millis = this._millis + this._stepInMillis;
                return;
            } else {
                this._millis = this._millis + this._stepInMillis - MILLIS_IN_SEC;
            }
        }

        if (this._stepInMillis < MILLIS_IN_MIN) {
            if (this._secs < SECS_IN_MIN - this._stepInSecs) {
                this._secs = this._secs + this._stepInSecs;
                return;
            } else {
                this._secs = this._secs + this._stepInSecs - SECS_IN_MIN;
            }
        }

        if (this._stepInMillis < MILLIS_IN_HOUR) {
            if (this._mins < MINS_IN_HOUR - this._stepInMins) {
                this._mins = this._mins + this._stepInMins;
                return;
            } else {
                this._mins = this._mins + this._stepInMins - MINS_IN_HOUR;
            }
        }

        if (this._stepInMillis < MILLIS_IN_DAY) {
            if (this._hours < HOURS_IN_DAY - this._stepInHours) {
                this._hours = this._hours + this._stepInHours;
            } else {
                this._hours = this._hours + this._stepInHours - HOURS_IN_DAY;
            }
        }
    }

    #decrement() {
        if (this._millis >= this._stepInMillis) {
            this._millis = this._millis - this._stepInMillis;
            return;
        } else {
            this._millis = MILLIS_IN_SEC - this._stepInMillis;
        }

        if (this._secs >= this._stepInSecs) {
            this._secs = this._secs - this._stepInSecs;
            return;
        } else {
            this._secs = SECS_IN_MIN - this._stepInSecs;
        }

        if (this._mins >= this._stepInMins) {
            this._mins = this._mins - this._stepInMins;
            return;
        } else {
            this._mins = MINS_IN_HOUR - this._stepInMins;
        }

        if (this._hours >= this._stepInHours) {
            this._hours = this._hours - this._stepInHours;
        } else {
            this._hours = 0;
        }
    }

    static millisToTime(duration) {
        const fractionalHours = duration / MILLIS_IN_HOUR;
        const hours = Math.trunc(fractionalHours);
        const fractionalMins = (fractionalHours - hours) * MINS_IN_HOUR;
        const mins = Math.trunc(fractionalMins);
        const fractionalSecs = (fractionalMins - mins) * SECS_IN_MIN;
        const secs = Math.trunc(fractionalSecs);
        const fractionalMillis = (fractionalSecs - secs) * MILLIS_IN_SEC;
        const millis = Math.trunc(fractionalMillis);
        return [hours, mins, secs, millis];
    }

    start() {
        if (!this.isTicking()) {
            this._interval = setInterval( //TODO https://stackoverflow.com/questions/42124448/how-does-webaudio-timing-work-is-using-setinterval-a-bad-solution
                () => {
                    this._counter--;
                    if (this._counter > 0) {
                        this._operation();
                        this.dispatchEvent(new CustomEvent(`tick`, {detail: [this._hours, this._mins, this._secs, this._millis]}));
                    } else {
                        clearInterval(this._interval);
                        this._interval = null;
                        [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._end);
                        this.dispatchEvent(new CustomEvent(`tick`, {detail: [this._hours, this._mins, this._secs, this._millis]}));
                        this.dispatchEvent(new CustomEvent(`end`, {detail: [this._hours, this._mins, this._secs, this._millis]}));
                    }
                },
                this._stepInMillis);
            this.dispatchEvent(new CustomEvent(`start`, {detail: [this._hours, this._mins, this._secs, this._millis]}));
        } else {
            console.error(`Timer ${this._interval} has already started!`);
        }
    }

    stop() {
        if (this.isTicking()) {
            clearInterval(this._interval);
            this._interval = null;
            this.dispatchEvent(new CustomEvent(`stop`, {detail: [this._hours, this._mins, this._secs, this._millis]}));
        } else {
            console.error(`Timer has already stopped!`);
        }
    }

    isTicking() {
        return this._interval;
    }

    set(time) {
        this._duration = this._direction ? this._end - time : time - this._end;
        this._counter = this._duration / this._stepInMillis;
        [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(time);
    }
}