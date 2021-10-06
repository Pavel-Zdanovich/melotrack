let {Timer} = await import(`../timer/timer.js`);
let {throwError} = await import(`../utils.js`);

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

export class Progress {

    constructor(percent = 0) {
        if (percent != null && typeof percent === `number`) {
            this._percent = percent;
            //console.log(`Percent: ${percent}`);
        } else {
            throwError({percent});
        }
    }

    get() {
        return this._percent;
    }

    set(percent) {
        if (percent != null && typeof percent === `number`) {
            this._percent = percent;
            //console.log(`Percent: ${percent}`);
        } else {
            throwError({percent});
        }
    }

    increment(value) {
        if (value != null && typeof value === `number`) {
            if (100 - this._percent > value) {
                this._percent = this._percent + value;
            } else {
                this._percent = 100;
            }
            //console.log(`Percent: ${this._percent}`);
        } else {
            throwError({value});
        }
    }
}