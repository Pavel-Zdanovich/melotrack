import {throwError} from "../utils/utils.js";

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

export class Progress {

    constructor(direction, progressStep = 1, percent = direction ? 0 : 100) {
        if (direction != null && typeof direction === `boolean`) {
            this._direction = direction
        } else {
            throwError({direction});
        }

        if (typeof percent === `number` && (percent >= MIN_PERCENT && percent <= MAX_PERCENT)) {
            this._percent = percent;
        } else {
            throwError({percent});
        }

        if (progressStep != null && typeof progressStep === `number` && (progressStep > MIN_PERCENT && percent <= MAX_PERCENT)) {
            this._progressStep = progressStep;
        } else {
            throwError({progressStep});
        }

        this._operation = this._direction ? this.#increment : this.#decrement;
    }

    get() {
        return this._percent;
    }

    set(percent) {
        if (percent != null && typeof percent === `number` && (percent >= MIN_PERCENT && percent <= MAX_PERCENT)) {
            const remainder = percent % this._progressStep;
            if (this._progressStep > remainder) {
                this._percent = percent - remainder + this._progressStep;
            } else {
                this._percent = percent - remainder;
            }
        } else {
            throwError({percent});
        }
    }

    make() {
        return this._operation();
    }

    #increment() {
        if (MAX_PERCENT - this._percent > this._progressStep) {
            this._percent = this._percent + this._progressStep;
        } else {
            this._percent = MAX_PERCENT;
        }
    }

    #decrement() {
        if (MIN_PERCENT > this._percent - this._progressStep) {
            this._percent = this._percent - this._progressStep;
        } else {
            this._percent = MIN_PERCENT;
        }
    }
}