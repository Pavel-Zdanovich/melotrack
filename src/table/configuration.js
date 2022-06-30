import {loader} from "../loader/configuration.js";
import {player} from "../player/configuration.js";
import {timer} from "../timer/configuration.js";
import {mobile} from "../utils/mobile.js";
import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {Validator} from "./validator.js";

const tableElement = document.body.children[2];
const footerElement = document.body.children[4];

const captionElement = tableElement.children[0];
const headElement = tableElement.children[1];
const bodyElement = tableElement.children[2];

const headRowElement = headElement.children[0];
const headCellElement = headRowElement.children[0];

const exampleRowElement = bodyElement.children[0];
const clefElement = footerElement.children[1].children[0];
const pointerElement = clefElement.cloneNode(true);
const upperElement = document.createElement(`div`);
upperElement.classList.add(`upper`);
const lowerElement = document.createElement(`div`);
lowerElement.classList.add(`lower`);
const signElement = document.createElement(`div`);
signElement.classList.add(`signature`);
signElement.appendChild(upperElement);
signElement.appendChild(lowerElement);

let tour = new Tour(
    `Melotrack`,
    captionElement.innerText,
    0,
    document.documentElement.style.getPropertyValue(`--background-color`),
    document.documentElement.style.getPropertyValue(`--border-color`),
    [...headRowElement.children].map(cellElement => cellElement.innerText.toLowerCase()),
    [
        new Track(`1`, `Melotrack`, `1`, `./audio/melotrack1.mp3`),
        new Track(`2`, `Melotrack`, `2`, `./audio/melotrack2.mp3`),
        new Track(`3`, `Melotrack`, `3`, `./audio/melotrack3.mp3`),
        new Track(`4`, `Melotrack`, `4`, `./audio/melotrack4.mp3`),
        new Track(`5`, `Melotrack`, `5`, `./audio/melotrack5.mp3`),
        new Track(`6`, `Melotrack`, `6`, `./audio/melotrack6.mp3`),
        new Track(`7`, `Melotrack`, `7`, `./audio/melotrack7.mp3`),
        new Track(`8`, `Melotrack`, `8`, `./audio/melotrack8.mp3`),
        new Track(`9`, `Melotrack`, `9`, `./audio/melotrack9.mp3`),
        new Track(`10`, `Melotrack`, `10`, `./audio/melotrack10.mp3`)
    ]
);

tour.tracks.forEach(track => loader.load(track));

const map = [[]]; //map[row][col] - [[thr, th1, th2], [tbr1, td1, td2], [tbr2, td1, td2], ..., [tbr10, td1, td2]]

let currentRowIndex;
let currentColIndex;



const colEnter = (colIndex) => {
    for (let rowIndex = 0; rowIndex <= bodyElement.childElementCount; rowIndex++) {
        const array = map[rowIndex];
        const cellElement = map[rowIndex][colIndex];
        if (colIndex === 1) {
            cellElement.style.borderLeftColor = tour.border;
        } else if (colIndex === array.length - 1) {
            cellElement.style.borderRightColor = tour.border;
        }
    }
    map[0][colIndex].style.borderTopColor = tour.border;
    if (colIndex === 1) {
        headElement.style.borderLeftColor = tour.border;
        bodyElement.style.borderLeftColor = tour.border;
        bodyElement.style.borderRightColor = tour.border;
    } else if (colIndex === map[0].length - 1) {
        headElement.style.borderRightColor = tour.border;
        bodyElement.style.borderRightColor = tour.border;
    } else {
        bodyElement.style.borderLeftColor = tour.border;
        bodyElement.style.borderRightColor = tour.border;
    }

    let width = 0;
    for (let index = 1; index <= colIndex - 1; index++) {
        width = width + map[1][index].getBoundingClientRect().width;
    }
    bodyElement.scrollTo(width + 0.5, 0);
    currentColIndex = colIndex;
};

const colLeave = (colIndex) => {
    for (let rowIndex = 0; rowIndex <= bodyElement.childElementCount; rowIndex++) {
        const cellElement = map[rowIndex][colIndex];
        cellElement.style = ``;
    }
    map[0][colIndex].style = ``;
    headElement.style = ``;
    bodyElement.style = ``;
};

const colLeaveEnter = (prevColIndex, nextColIndex) => {
    colLeave(prevColIndex);
    colEnter(nextColIndex);
};



const headRowEnter = (rowIndex) => {
    currentRowIndex = rowIndex;
};

const headRowLeave = (rowIndex) => {
    currentRowIndex = undefined;
};

const headRowLeaveEnter = (prevRowIndex, nextRowIndex) => {
    currentRowIndex = nextRowIndex;
};



const headCellEnter = (rowIndex, colIndex) => {
    const array = map[rowIndex];
    const cellElement = array[colIndex];
    if (colIndex === 1) {
        cellElement.style.borderLeftColor = tour.border;
        headElement.style.borderLeftColor = tour.border;
        bodyElement.style.borderLeftColor = tour.border;
        bodyElement.style.borderRightColor = tour.border;
    } else if (colIndex === array.length - 1) {
        cellElement.style.borderRightColor = tour.border;
        headElement.style.borderRightColor = tour.border;
        bodyElement.style.borderRightColor = tour.border;
    }
    cellElement.style.borderTopColor = tour.border;
};

const headCellLeave = (rowIndex, colIndex) => {
    const cellElement = map[rowIndex][colIndex];
    cellElement.style = ``;
    headElement.style = ``;
    bodyElement.style = ``;
};



const bodyRowEnter = (rowIndex) => {
    map[rowIndex][0].classList.add(`staved`);
    currentRowIndex = rowIndex;
    const track = tour.tracks[currentRowIndex - 1];
    loader.get(track.url).then(track => player.load(track));
};

const bodyRowLeave = (rowIndex) => {
    map[rowIndex][0].classList.remove(`staved`);
    currentRowIndex = undefined;
    player.unload();
};

const bodyRowLeaveEnter = (prevRowIndex, nextRowIndex) => {
    map[prevRowIndex][0].classList.remove(`staved`);
    currentRowIndex = undefined;
    bodyRowEnter(nextRowIndex);
};



const bodyCellEnter = (rowIndex, colIndex) => {
    const cellElement = map[rowIndex][colIndex];
    cellElement.style.setProperty(`display`, `flex`);
    const labelElement = cellElement.children[0];
    labelElement.appendChild(pointerElement);
    upperElement.innerHTML = rowIndex;
    lowerElement.innerHTML = bodyElement.childElementCount;
    labelElement.appendChild(signElement);
};

const bodyCellLeave = (rowIndex, colIndex) => {
    const cellElement = map[rowIndex][colIndex];
    const labelElement = cellElement.children[0];
    labelElement.innerHTML = ``;
};



const isTable = (element) => {
    if (!element) {
        return false;
    } else if (element.tagName === `THEAD` || element.tagName === `TBODY`) {
        return true;
    } else {
        return isTable(element.parentElement);
    }
};

const isPlayer = (element) => {
    if (!element) {
        return false;
    } else if (element.classList.contains(`player`)) {
        return true;
    } else {
        return isPlayer(element.parentElement);
    }
};

let reenter = true;
const addEventListeners = (rowIndex, colIndex, colEnter, colLeave, colLeaveEnter, rowEnter, rowLeave, rowLeaveEnter, cellEnter, cellLeave) => {
    const cellElement = map[rowIndex][colIndex];
    //in col -> row -> cell
    cellElement.addEventListener(`focusin`, (e) => {
        //e.relatedTarget - previous focus element
        if (isTable(e.relatedTarget)) {
            if (currentColIndex !== colIndex) {
                colLeaveEnter(currentColIndex, colIndex);
            }
            if (currentRowIndex !== rowIndex) {
                rowLeaveEnter(currentRowIndex, rowIndex);
            }
            cellEnter(rowIndex, colIndex);
        } else {
            if (reenter) {
                colEnter(colIndex);
                rowEnter(rowIndex);
                cellEnter(rowIndex, colIndex);
            }
        }
    });
    //out cell -> row -> col
    cellElement.addEventListener(`focusout`, (e) => {
        //e.relatedTarget - next focus element
        if (!isTable(e.relatedTarget)) {
            if (!isPlayer(e.relatedTarget)) {
                cellLeave(rowIndex, colIndex);
                rowLeave(rowIndex);
                colLeave(colIndex);
            } else {
                reenter = false;
                const inputElement = cellElement.lastElementChild;
                inputElement.focus();
                reenter = true;
            }
        } else {
            cellLeave(rowIndex, colIndex);
            if (currentRowIndex !== rowIndex) {
                rowLeave(rowIndex);
            }
            if (currentColIndex !== colIndex) {
                colLeave(colIndex);
            }
        }
    });
};

const fillCellsInRow = (rowIndex, colEnter, colLeave, colLeaveEnter, rowEnter, rowLeave, rowLeaveEnter, cellEnter, cellLeave) => {
    const rowElement = map[rowIndex][0];

    for (let index = 0; index < rowElement.childElementCount; index++) {
        const cellElement = rowElement.children[index];

        const colIndex = index + 1;

        map[rowIndex][colIndex] = cellElement;

        addEventListeners(rowIndex, colIndex, colEnter, colLeave, colLeaveEnter, rowEnter, rowLeave, rowLeaveEnter, cellEnter, cellLeave);
    }
};

map[0][0] = headRowElement; //initialization

fillCellsInRow(0, colEnter, colLeave, colLeaveEnter, headRowEnter, headRowLeave, headRowLeaveEnter, headCellEnter, headCellLeave);

const scrollWidth = exampleRowElement.getBoundingClientRect().width;

const stretchFor = (rowElement, cols) => {
    if (scrollWidth / cols <= 300 || mobile) {
        rowElement.style.width = (cols * 100) + `%`;
    } else {
        rowElement.style.width = ``;
    }
};

for (let index = 0; index < bodyElement.childElementCount; index++) {
    const rowElement = bodyElement.children[index];

    const rowIndex = index + 1;

    map[rowIndex] = [rowElement];

    stretchFor(rowElement, rowElement.childElementCount);

    fillCellsInRow(rowIndex, colEnter, colLeave, colLeaveEnter, bodyRowEnter, bodyRowLeave, bodyRowLeaveEnter, bodyCellEnter, bodyCellLeave);
}



player.addEventListener(`end`, () => {
    const index = currentRowIndex;
    const selectNext = player.getSelectionMode();
    const array = selectNext(index - 1, map.slice(1));
    const cellElement = array[currentColIndex];
    const inputElement = cellElement.lastElementChild;
    inputElement.focus();
});

const check = () => {
    player.setTitleMode(true);
    for (let rowIndex = 1; rowIndex < map.length; rowIndex++) {
        const track = tour.tracks[rowIndex - 1];
        for (let colIndex = 1; colIndex < map[0].length; colIndex++) {
            const cellElement = map[rowIndex][colIndex];
            const inputElement = cellElement.lastElementChild;
            const key = tour.keys[colIndex - 1];
            const expected = track[key];
            const actual = inputElement.value;
            const result = Validator.similarity(expected, actual);
            console.log(`${rowIndex}_${colIndex} '${actual}' = '${expected}' on ${result * 100}%`);
            inputElement.value = expected;
            inputElement.readOnly = true;
        }
    }
};

timer.addEventListener(`end`, check);
clefElement.addEventListener(`click`, check);

tableElement.addEventListener(`keydown`, (e) => {
    const previousRowIndex = currentRowIndex;
    const previousColIndex = currentColIndex;
    let nextRowIndex = currentRowIndex;
    let nextColIndex = currentColIndex;

    switch (e.code) {
        case `ArrowUp`: {
            if (currentRowIndex === 1) {
                nextRowIndex = map.length - 1;
            } else {
                nextRowIndex = currentRowIndex - 1;
            }
            break;
        }
        case `ArrowDown`: {
            if (currentRowIndex === map.length - 1) {
                nextRowIndex = 1;
            } else {
                nextRowIndex = currentRowIndex + 1;
            }
            break;
        }
        case `ArrowLeft`: {
            if (currentColIndex === map[0].length - 1) {
                nextColIndex = 1;
            } else {
                nextColIndex = currentColIndex + 1;
            }
            break;
        }
        case `ArrowRight`: {
            if (currentColIndex === 1) {
                nextColIndex = map[0].length - 1;
            } else {
                nextColIndex = currentColIndex - 1;
            }
            break;
        }
        default: {
            return;
        }
    }

    const previousCellElement = map[previousRowIndex][previousColIndex];
    const nextCellElement = map[nextRowIndex][nextColIndex];
    const inputElement = nextCellElement.lastElementChild;
    inputElement.focus();
});

let touchEnd = false;
bodyElement.addEventListener(`touchend`, () => {
    touchEnd = true;
    bodyElement.scrollBy(1, 0);
})

const threshold = headCellElement.getBoundingClientRect().width;

let prevScroll = 0;
let scroll = 0;
let direction;
let requestId;
let scrolls = [];
bodyElement.addEventListener(`scroll`, () => {
    const currentScroll = bodyElement.scrollLeft - prevScroll;
    scrolls.push(currentScroll);
    prevScroll = bodyElement.scrollLeft;
    if (!direction) {
        direction = currentScroll > 0 ? `>` : `<`;
    }

    const colIndex = Math.trunc(bodyElement.scrollLeft / scrollWidth);

    const left = colIndex * scrollWidth;
    const right = left + scrollWidth;

    const diffLeft = bodyElement.scrollLeft - left;
    const diffRight = right - bodyElement.scrollLeft;

    if (direction === `>`) {
        if (diffLeft < threshold) {
            scroll = -1 * diffLeft;
        } else {
            scroll = diffRight;
        }
    } else {
        if (diffRight < threshold) {
            scroll = diffRight;
        } else {
            scroll = -1 * diffLeft;
        }
    }

    if (touchEnd) {
        touchEnd = false;
        const start = performance.now();
        const duration = 1000;
        const callback = (time) => {
            const progress = Math.abs(time - start) / duration;
            let x = progress * scroll;
            if (Math.abs(x) < 0.8) { //dead zone
                x = Math.sign(x) * 0.8;
            }
            if (Number.parseInt(scroll.toFixed(1)) !== 0) {
                bodyElement.scrollBy(x, 0); //recursion: progress increases linearly, scroll  decreases exponentially
                requestId = window.requestAnimationFrame(callback);
            } else {
                //window.cancelAnimationFrame(requestId);
                requestId = undefined;
                direction = undefined;
            }
            //output(direction, left, right, diffLeft, diffRight);
        }
        requestId = window.requestAnimationFrame(callback);
    }
    //output(direction, left, right, diffLeft, diffRight);
});

document.addEventListener(`tour`, (e) => {
    tour = e.detail;

    tour.tracks.forEach(track => {
        if (!loader.get(track.url)) {
            loader.load(track);
        }
    });

    player.setTitleMode(false);
    bodyRowLeave(currentRowIndex);

    timer.load(tour.time);
    if (!timer.isTicking()) {
        timer.start();
    }

    captionElement.innerText = tour.description;

    const prevRowsCount = map.length - 1;
    const prevColsCount = map[0].length - 1;

    if (prevRowsCount === tour.tracks.length) {
        //nothing
    } else if (prevRowsCount > tour.tracks.length) {
        const rows = map.splice(tour.tracks.length + 1);
        rows.map(array => array[0]).forEach(rowElement => bodyElement.removeChild(rowElement));
    } else {
        for (let rowIndex = 1; rowIndex <= tour.tracks.length; rowIndex++) {
            const array = map[rowIndex];

            let rowElement;
            if (array) {
                rowElement = array[0];
            } else {
                rowElement = document.createElement(`tr`);
                map[rowIndex] = [rowElement];
                bodyElement.appendChild(rowElement);
            }
        }
    }

    if (prevColsCount > tour.keys.length) {
        map.forEach(array => {
            const cells = array.splice(tour.keys.length + 1);
            const rowElement = array[0];
            cells.forEach(cellElement => rowElement.removeChild(cellElement));
        });
    }

    for (let colIndex = 1; colIndex <= tour.keys.length; colIndex++) {
        const rowIndex = 0;

        const array = map[rowIndex];

        const rowElement = array[0];

        let headCellElement = array[colIndex];
        if (!headCellElement) {
            headCellElement = document.createElement(`th`);
            headCellElement.tabIndex = -1;

            array[colIndex] = headCellElement;

            addEventListeners(rowIndex, colIndex, colEnter, colLeave, colLeaveEnter, headRowEnter, headRowLeave, headRowLeaveEnter, headCellEnter, headCellLeave);

            rowElement.appendChild(headCellElement);
        }

        const key = tour.keys[colIndex - 1];
        headCellElement.innerText = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

        for (let rowIndex = 1; rowIndex <= tour.tracks.length; rowIndex++) {
            const array = map[rowIndex];

            const rowElement = array[0];

            let bodyCellElement = array[colIndex];
            let labelElement;
            let inputElement;
            if (!bodyCellElement) {
                bodyCellElement = document.createElement(`td`);
                labelElement = document.createElement(`label`);
                inputElement = document.createElement(`input`);
                inputElement.type = `text`;
                inputElement.autocomplete = `off`;

                array[colIndex] = bodyCellElement;

                addEventListeners(rowIndex, colIndex, colEnter, colLeave, colLeaveEnter, bodyRowEnter, bodyRowLeave, bodyRowLeaveEnter, bodyCellEnter, bodyCellLeave);

                bodyCellElement.appendChild(labelElement);
                bodyCellElement.appendChild(inputElement);
                rowElement.appendChild(bodyCellElement);
            }

            const id = key + `_` + colIndex;

            labelElement = bodyCellElement.children[0];
            labelElement.htmlFor = id;

            inputElement = bodyCellElement.children[1];
            inputElement.id = id;
            inputElement.value = ``;

            stretchFor(rowElement, tour.keys.length);
        }
    }
});

console.log(`table loaded`);