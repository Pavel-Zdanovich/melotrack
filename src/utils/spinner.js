import {throwError} from "./utils.js";

export class Spinner extends EventTarget {

    constructor() {
        super();
        this.#initialize();
    }

    #initialize() {
        this.requestId = undefined;
        this.passed = 0;
        this.percentage = 0;
        this.goal = 0;
    }

    start() {
        this.dispatchEvent(new CustomEvent(`start`));
    }

    stop() {
        window.cancelAnimationFrame(this.requestId);
        this.#initialize();
        this.dispatchEvent(new CustomEvent(`stop`));
    }

    /**
     * Reflects the predicted progress of the successful completion of the next function after this
     * @param step
     * @param duration
     */
    markProgressBy(step, duration = 1) {
        if (typeof step !== `number` || (step > 0 && step + this.goal > 100) || (step < 0 && Math.abs(step) > this.goal)) {
            throwError({step});
        }
        if (typeof duration !== `number` || 0 >= duration || duration > 10000) { //TODO
            throwError({duration});
        }

        const start = performance.now();

        this.goal = this.goal + step;

        if (this.percentage && this.percentage !== this.goal) {
            window.cancelAnimationFrame(this.requestId);
            this.passed = this.percentage;
            step = this.goal - this.passed;
        }

        const callback = (time) => {
            const progress = Math.abs(time - start) / duration;

            this.percentage = this.passed + (step) * progress;

            const condition = step > 0 ? this.percentage < this.goal : this.percentage > this.goal;
            if (condition) {
                this.dispatchEvent(new CustomEvent(`output`, {detail: this.percentage}));

                this.requestId = window.requestAnimationFrame(callback);
            } else {
                this.percentage = this.goal;
                this.passed = this.percentage;

                this.dispatchEvent(new CustomEvent(`output`, {detail: this.percentage}));
            }
        }

        this.requestId = window.requestAnimationFrame(callback);
    }
}

const spinner = new Spinner();
const spinnerElement = document.body.lastElementChild;
spinner.addEventListener(`start`, () => {
    document.body.appendChild(spinnerElement);
});
const circleElement = spinnerElement.firstElementChild;
const textElement = spinnerElement.lastElementChild;
const DASHES_IN_PERCENT = 3.078;
spinner.addEventListener(`output`, (e) => {
    const percentage = e.detail;
    circleElement.style.strokeDasharray = `${DASHES_IN_PERCENT * percentage}, ${DASHES_IN_PERCENT * (100 - percentage)}`;
    textElement.innerHTML = `${percentage.toFixed(1)}%`;
});
spinner.addEventListener(`stop`, () => {
    document.body.removeChild(spinnerElement);
});

export {spinner};