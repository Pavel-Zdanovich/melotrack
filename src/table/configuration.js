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
const exampleCellElement = exampleRowElement.children[0];
const labelElement = exampleCellElement.children[0];
const clefElement = labelElement.children[0];
const signElement = labelElement.children[1];
labelElement.innerHTML = ``;
const upperElement = signElement.children[0];
const lowerElement = signElement.children[1];

let tour = new Tour(
    `Melotrack`,
    captionElement.innerText,
    0,
    document.documentElement.style.getPropertyValue(`--background-color`),
    document.documentElement.style.getPropertyValue(`--border-color`),
    [...headRowElement.children].map(cellElement => cellElement.innerText.toLowerCase()),
    [
        new Track(`melotrack1`, `Melotrack`, `1`, `./audio/melotrack1.mp3`),
        new Track(`melotrack2`, `Melotrack`, `2`, `./audio/melotrack2.mp3`)
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
    currentColIndex = undefined;
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
    if (track) {
        loader.get(track.url).then(track => player.load(track));
    } else {
        player.unload();
    }
};

const bodyRowLeave = (rowIndex) => {
    map[rowIndex][0].classList.remove(`staved`);
    player.unload();
    currentRowIndex = undefined;
};

const bodyRowLeaveEnter = (prevRowIndex, nextRowIndex) => {
    map[prevRowIndex][0].classList.remove(`staved`);
    bodyRowEnter(nextRowIndex);
};



const bodyCellEnter = (rowIndex, colIndex) => {
    const label = map[rowIndex][colIndex].children[0];
    label.appendChild(clefElement);
    upperElement.innerHTML = rowIndex;
    lowerElement.innerHTML = bodyElement.childElementCount;
    label.appendChild(signElement);
};

const bodyCellLeave = (rowIndex, colIndex) => {
    const label = map[rowIndex][colIndex].children[0];
    label.innerHTML = ``;
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

const addEventListeners = (rowIndex, colIndex, colEnter, colLeave, colLeaveEnter, rowEnter, rowLeave, rowLeaveEnter, cellEnter, cellLeave) => {
    const cellElement = map[rowIndex][colIndex];
    cellElement.addEventListener(`focusin`, (e) => {
        if (isTable(e.relatedTarget)) {
            if (currentColIndex !== colIndex) {
                colLeaveEnter(currentColIndex, colIndex);
            }
            if (currentRowIndex !== rowIndex) {
                rowLeaveEnter(currentRowIndex, rowIndex);
            }
        } else {
            colEnter(colIndex);
            rowEnter(rowIndex);
        }
        cellEnter(rowIndex, colIndex);
    });
    cellElement.addEventListener(`focusout`, (e) => {
        cellLeave(rowIndex, colIndex);
        if (!isTable(e.relatedTarget) && !isPlayer(e.relatedTarget)) {
            rowLeave(rowIndex);
            colLeave(colIndex);
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



player.addEventListener(`end`, (e) => {
    const current = e.detail;
    const index = tour.tracks.indexOf(current);
    const selectNext = player.getSelectionMode();
    const next = selectNext(index, tour.tracks);
    loader.get(next.url).then(track => player.load(track));
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
            inputElement.disabled = true;
        }
    }
};

timer.addEventListener(`end`, check);

tableElement.addEventListener(`keydown`, (e) => {
    switch (e.code) {
        case `ArrowUp`: {
            if (currentRowIndex === 1) {
                currentRowIndex = map.length - 1;
            } else {
                currentRowIndex--;
            }
            break;
        }
        case `ArrowDown`: {
            if (currentRowIndex === map.length - 1) {
                currentRowIndex = 1;
            } else {
                currentRowIndex++;
            }
            break;
        }
        case `ArrowLeft`: {
            if (currentColIndex === map[0].length - 1) {
                currentColIndex = 1;
            } else {
                currentColIndex++;
            }
            break;
        }
        case `ArrowRight`: {
            if (currentColIndex === 1) {
                currentColIndex = map[0].length - 1;
            } else {
                currentColIndex--;
            }
            break;
        }
        default: {
            return;
        }
    }

    const cellElement = map[currentRowIndex][currentColIndex];
    const inputElement = cellElement.lastElementChild;
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