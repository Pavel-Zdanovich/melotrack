import {throwError} from "../utils/utils.js";

export const MIN_PERCENT = 0;
export const MAX_PERCENT = 100;

export class Progress {

    load(start = MIN_PERCENT, end = MAX_PERCENT, step = 1) {
        if (typeof start === `number` && (start >= MIN_PERCENT && start <= MAX_PERCENT)) {
            this._start = start;
        } else {
            throwError({start});
        }

        if (typeof end === `number` && (end >= MIN_PERCENT && end <= MAX_PERCENT)) {
            this._end = end;
        } else {
            throwError({end});
        }

        if (this._end > this._start) {
            this._operation = this.#increment;
            this._percent = this._start;
            this._min = this._start;
            this._max = this._end;
        } else {
            this._operation = this.#decrement;
            this._percent = this._end;
            this._min = this._end;
            this._max = this._start;
        }

        if (typeof step === `number` && (step > MIN_PERCENT && step <= MAX_PERCENT)) {
            this._step = step;
        } else {
            throwError({step});
        }
    }

    #increment() {
        if (this._max - this._percent > this._step) {
            this._percent = this._percent + this._step;
        } else {
            this._percent = this._max;
        }
    }

    #decrement() {
        if (this._min > this._percent - this._step) {
            this._percent = this._percent - this._step;
        } else {
            this._percent = this._min;
        }
    }

    make() {
        return this._operation();
    }

    get() {
        return this._percent;
    }

    set(percent) {
        if (typeof percent === `number` && (percent >= this._min && percent <= this._max)) {
            const remainder = percent % this._step;
            if (this._step > remainder) {
                this._percent = percent - remainder + this._step;
            } else {
                this._percent = percent - remainder;
            }
        } else {
            throwError({percent});
        }
    }
}