let {throwError} = await import(`../utils/utils.js`);

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

export class Progress {

    constructor(percent = 0) {
        if (percent != null && typeof percent === `number` && (percent >= MIN_PERCENT && percent <= MAX_PERCENT)) {
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
        if (percent != null && typeof percent === `number` && (percent >= MIN_PERCENT && percent <= MAX_PERCENT)) {
            this._percent = percent;
            //console.log(`Percent: ${percent}`);
        } else {
            throwError({percent});
        }
    }

    increment(value) {
        if (value != null && typeof value === `number`) {
            if (MAX_PERCENT - this._percent > value) {
                this._percent = this._percent + value;
            } else {
                this._percent = MAX_PERCENT;
            }
            //console.log(`Percent: ${this._percent}`);
        } else {
            throwError({value});
        }
    }
}