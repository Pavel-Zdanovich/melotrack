import {throwError} from "../utils/utils.js";

const MILLIS_IN_SEC = 1000;
const SECS_IN_MIN = 60;
const MINS_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const MIN_TIME = 0;

const MILLIS_IN_MIN = MILLIS_IN_SEC * SECS_IN_MIN;
const MILLIS_IN_HOUR = MILLIS_IN_MIN * MINS_IN_HOUR;
const MILLIS_IN_DAY = MILLIS_IN_HOUR * HOURS_IN_DAY;

export class Timer {

    constructor(callback, start, end = 0, step = 1000) {
        if (callback != null && typeof callback == 'function') {
            this._callback = callback;
        } else {
            throwError({callback});
        }

        if (start != null && typeof start === `number` && (start >= MIN_TIME && start <= MILLIS_IN_DAY)) {
            this._start = start;
        } else {
            throwError({start});
        }

        if (end != null && typeof end === `number` && (end >= MIN_TIME && end <= MILLIS_IN_DAY)) {
            this._end = end;
        } else {
            throwError({end});
        }

        this._direction = end > start;
        this._operation = this._direction ? this.#increment : this.#decrement;
        this._time = this._direction ? end - start : start - end; //TODO check performance vs Math.abs(end - start)

        if (step != null && typeof step === `number` && (step > MIN_TIME && step <= MILLIS_IN_DAY)) {
            this._stepInMillis = Math.trunc(step);

            if (step >= MILLIS_IN_SEC && step < MILLIS_IN_MIN) {
                this._stepInSecs = Math.trunc(step / MILLIS_IN_SEC);
            } else {
                this._stepInSecs = 1;
            }

            if (step >= MILLIS_IN_MIN && step < MILLIS_IN_HOUR) {
                this._stepInMins = Math.trunc(step / MILLIS_IN_MIN);
            } else {
                this._stepInMins = 1;
            }

            if (step >= MILLIS_IN_HOUR && step < MILLIS_IN_DAY) {
                this._stepInHours = Math.trunc(step / MILLIS_IN_HOUR);
            } else {
                this._stepInHours = 1;
            }

            this._counter = Math.trunc(this._time / step);
            this._count = this._counter;
        } else {
            throwError({step});
        }

        this.#initialize();
    }

    #initialize() {
        if (this._direction) {
            [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._start);
        } else {
            if (this._end !== 0) {
                [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._start);
            } else {
                [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._time);
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

    static millisToTime(time) {
        const fractionalHours = time / (MILLIS_IN_HOUR);
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
            this._interval = setInterval( //TODO problem https://stackoverflow.com/questions/42124448/how-does-webaudio-timing-work-is-using-setinterval-a-bad-solution
                () => {
                    console.log(`Timer ${this._interval} ticked`);
                    const keepOn = this.#countdown();
                    if (keepOn) {
                        this._operation();
                    } else {
                        this.stop();
                        this.#finalize();
                    }
                    this._callback(this._hours, this._mins, this._secs, this._millis);
                },
                this._stepInMillis);
            console.log(`Timer ${this._interval} started!`);
        } else {
            console.log(`Timer ${this._interval} has already started!`);
        }
    }

    #countdown() {
        this._counter--;
        return this._counter > 0;
    }

    #finalize() {
        [this._hours, this._mins, this._secs, this._millis] = Timer.millisToTime(this._end);
    }

    stop() {
        if (this.isTicking()) {
            console.log(`Timer ${this._interval} stopped`);
            clearInterval(this._interval);
            this._interval = null;
        } else {
            console.log(`Timer has already stopped!`);
        }
    }

    isTicking() {
        return this._interval != null;
    }

    get() {
        return this._time;
    }

    set(hours, mins, secs, millis) {
        if (hours != null && typeof hours === `number` && (hours >= MIN_TIME && hours <= HOURS_IN_DAY)) {
            this._hours = hours;
        } else {
            throwError({hours});
        }
        if (mins != null && typeof mins === `number` && (mins >= MIN_TIME && mins <= MINS_IN_HOUR)) {
            this._mins = mins;
        } else {
            throwError({mins});
        }
        if (secs != null && typeof secs === `number` && (secs >= MIN_TIME && secs <= SECS_IN_MIN)) {
            this._secs = secs;
        } else {
            throwError({secs});
        }
        if (millis != null && typeof secs === `number` && (millis >= MIN_TIME && millis <= MILLIS_IN_SEC)) {
            this._millis = millis;
        } else {
            throwError({millis});
        }

        this._time = ((hours * MILLIS_IN_HOUR) + (mins * MILLIS_IN_MIN) + (secs * MILLIS_IN_SEC) + millis);

        this._counter = this._count - Math.trunc(this._time / this._stepInMillis);
    }
}