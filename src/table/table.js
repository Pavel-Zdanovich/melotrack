import {throwError} from "../utils/utils.js";
import {Tour} from "../entities/tour.js";
import {Validator} from "./validator.js";

export class Table extends EventTarget {

    constructor() {
        super();

        this.tour = undefined;
        this.head = [];
        this.body = [[]];
        this.rowIndex = undefined;
        this.colIndex = undefined;

        this.checked = false;
    }

    initialize(tour, rows, cols, headCellCallback, bodyRowCallback, bodyCellCallback) {
        if (tour instanceof Tour) {
            this.tour = tour;
        } else {
            throwError({tour});
        }

        this.#iterate(rows, cols, headCellCallback, bodyRowCallback, bodyCellCallback);

        this.dispatchEvent(new CustomEvent(`output`));
        this.dispatchEvent(new CustomEvent(`load`));
    }

    load(tour) {
        if (tour instanceof Tour) {
            this.tour = tour;
        } else {
            throwError({tour});
        }

        this.#adapt();

        this.#iterate(
            this.tour.tracks.length,
            this.tour.keys.length,
            (colIndex) => {
                this.#adaptHeadCell(colIndex);
            },
            (rowIndex) => {
                return this.#adaptBodyRow(rowIndex);
            },
            (rowElement, rowIndex, colIndex) => {
                this.#adaptBodyCell(rowElement, rowIndex, colIndex);
            }
        );

        this.checked = false;

        this.dispatchEvent(new CustomEvent(`output`));
        this.dispatchEvent(new CustomEvent(`load`));
        this.dispatchEvent(new CustomEvent(`start`));
    }

    output(tour) {
        if (tour instanceof Tour) {
            this.tour = tour;
        } else {
            throwError({tour});
        }

        this.#adapt();

        this.#iterate(
            this.body.length,
            this.head.length,
            (colIndex) => {
                this.#adaptHeadCell(colIndex);
            },
            (rowIndex) => {
                return this.#adaptBodyRow(rowIndex);
            },
            (rowElement, rowIndex, colIndex) => {
                this.#adaptBodyCell(rowElement, rowIndex, colIndex);
                this.#output(rowIndex, colIndex);
            }
        );

        this.checked = true;

        this.dispatchEvent(new CustomEvent(`output`));
    }

    check() {
        if (!this.checked) {
            this.checked = true;
        } else {
            return;
        }

        let rowResult = 0;
        let tourResult = 0;
        this.#iterate(
            this.body.length,
            this.head.length,
            () => {
            },
            () => {
            },
            (rowElement, rowIndex, colIndex) => {
                const cellResult = this.#checkCell(rowIndex, colIndex);
                this.#output(rowIndex, colIndex);
                this.#outputProgress(rowIndex, colIndex, cellResult);

                rowResult = rowResult + cellResult;
                if (colIndex === this.head.length - 1) {
                    this.#outputStatistic(rowIndex, rowResult / this.head.length);
                    rowResult = 0;
                }

                tourResult = tourResult + cellResult;
            }
        );

        const item = window.localStorage.getItem(this.tour.name);
        if (!item || tourResult > item) {
            window.localStorage.setItem(this.tour.name, tourResult);
        }
    }

    isChecked() {
        return this.checked;
    }

    #iterate(rows, cols, headCellCallback, bodyRowCallback, bodyCellCallback) {
        for (let colIndex = 0; colIndex < cols; colIndex++) {
            headCellCallback(colIndex);
        }

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            const rowElement = bodyRowCallback(rowIndex);
            for (let colIndex = 0; colIndex < cols; colIndex++) {
                bodyCellCallback(rowElement, rowIndex, colIndex);
            }
        }
    }

    #adapt() {
        if (this.body.length > this.tour.tracks.length) {
            const rows = this.body.splice(this.tour.tracks.length);
            rows.map(array => array[0].parentElement).forEach(rowElement => {
                this.dispatchEvent(new CustomEvent(`remove`, {detail: rowElement}));
            });
        }

        if (this.head.length > this.tour.keys.length) {
            const cells = this.head.splice(this.tour.keys.length);
            const rowElement = cells[0].parentElement;
            cells.forEach(cellElement => rowElement.removeChild(cellElement));
            this.body.forEach(array => {
                const cells = array.splice(this.tour.keys.length);
                const rowElement = array[0].parentElement;
                cells.forEach(cellElement => rowElement.removeChild(cellElement));
            });
        }
    }

    #adaptHeadCell(colIndex) {
        let headCellElement = this.head[colIndex];

        if (!headCellElement) {
            headCellElement = this.#createHeadCell(colIndex);
        }

        const key = this.tour.keys[colIndex];
        headCellElement.innerText = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    }

    #createHeadCell(colIndex) {
        const headCellElement = document.createElement(`th`);
        headCellElement.tabIndex = -1;

        this.head[colIndex] = headCellElement;

        const rowElement = this.head[0].parentElement;
        rowElement.appendChild(headCellElement);

        this.dispatchEvent(new CustomEvent(`addHeadEventListeners`, {detail: {colIndex}}));

        return headCellElement;
    }

    #adaptBodyRow(rowIndex) {
        const array = this.body[rowIndex];

        let rowElement;
        if (array) {
            rowElement = array[0].parentElement;
        } else {
            rowElement = this.#createRow(rowIndex);
        }

        this.dispatchEvent(new CustomEvent(`stretch`, {detail: rowElement}));

        return rowElement;
    }

    #createRow(rowIndex) {
        const rowElement = document.createElement(`tr`);

        this.body[rowIndex] = [];

        this.dispatchEvent(new CustomEvent(`append`, {detail: rowElement}));

        return rowElement;
    }

    #adaptBodyCell(rowElement, rowIndex, colIndex) {
        const key = this.tour.keys[colIndex];

        let bodyCellElement = this.body[rowIndex][colIndex];
        let labelElement, inputElement;
        if (!bodyCellElement) {
            [bodyCellElement, labelElement, inputElement] = this.#createBodyCell(rowElement, rowIndex, colIndex);
        }

        bodyCellElement.style = ``;

        const id = key + `_` + colIndex;

        labelElement = bodyCellElement.children[0];
        labelElement.htmlFor = id;

        inputElement = bodyCellElement.children[1];
        inputElement.id = id;
        inputElement.value = ``;
        inputElement.maxLength = this.tour.tracks[rowIndex][key].length;
    }

    #createBodyCell(rowElement, rowIndex, colIndex) {
        const cellElement = document.createElement(`td`);
        const labelElement = document.createElement(`label`);
        const inputElement = document.createElement(`input`);
        inputElement.type = `text`;
        inputElement.autocomplete = `off`;

        this.body[rowIndex][colIndex] = cellElement;

        cellElement.appendChild(labelElement);
        cellElement.appendChild(inputElement);
        rowElement.appendChild(cellElement);

        this.dispatchEvent(new CustomEvent(`addBodyEventListeners`, {detail: {rowIndex, colIndex}}));

        return [cellElement, labelElement, inputElement];
    }

    #checkCell(rowIndex, colIndex) {
        const cellElement = this.body[rowIndex][colIndex];
        const inputElement = cellElement.lastElementChild;
        const key = this.tour.keys[colIndex];
        const expected = this.tour.tracks[rowIndex][key];
        const actual = inputElement.value;
        return new Validator(expected, actual).similarity() * 100;
    }

    #output(rowIndex, colIndex) {
        const cellElement = this.body[rowIndex][colIndex];
        const inputElement = cellElement.lastElementChild;
        const key = this.tour.keys[colIndex];
        const expected = this.tour.tracks[rowIndex][key];
        inputElement.value = expected;
        inputElement.readOnly = true;
    }

    #outputProgress(rowIndex, colIndex, result) {
        const cellElement = this.body[rowIndex][colIndex];
        cellElement.style.cssText = `
                background-image: -webkit-linear-gradient(90deg, var(--transparent-color) 0% ${result}%, transparent ${result}% 100%);
                background-image: -o-linear-gradient(left, var(--transparent-color) 0% ${result}%, transparent ${result}% 100%);
                background-image: linear-gradient(90deg, var(--transparent-color) 0% ${result}%, transparent ${result}% 100%);
        `;
    }

    #outputStatistic(rowIndex, rowResult) {
        const track = this.tour.tracks[rowIndex];
        const key = `${track.artist} - ${track.title}`;
        const item = window.localStorage.getItem(key);
        if (item && item > rowResult) {
            return;
        }
        window.localStorage.setItem(key, rowResult);
    }
}