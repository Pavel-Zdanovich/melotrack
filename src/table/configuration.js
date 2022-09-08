import {Table} from "./table.js";
import {loader} from "../loader/configuration.js";
import {player} from "../player/configuration.js";
import {timer} from "../timer/configuration.js";
import {mobile} from "../utils/mobile.js";
import {next, previous} from "../utils/utils.js";
import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const indexElement = document.body.children[0].children[0];
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


const table = new Table();


const colEnter = (colIndex) => {
    const headCellElement = table.head[colIndex];
    headCellElement.style.borderTopColor = table.tour.border;

    if (headCellElement === headRowElement.firstElementChild) {
        headCellElement.style.borderLeftColor = table.tour.border;
        headElement.style.borderLeftColor = table.tour.border;
    }
    if (headCellElement === headRowElement.lastElementChild) {
        headCellElement.style.borderRightColor = table.tour.border;
        headElement.style.borderRightColor = table.tour.border;
    }

    bodyElement.style.borderLeftColor = table.tour.border;
    bodyElement.style.borderRightColor = table.tour.border;

    let width = 0;
    for (let index = 0; index < colIndex; index++) {
        width = width + table.body[0][index].getBoundingClientRect().width;
    }
    bodyElement.scrollTo(width + 0.5, 0);

    table.colIndex = colIndex;
};

const colLeave = (colIndex) => {
    const headCellElement = table.head[colIndex];
    headCellElement.style = ``;
    headElement.style = ``;
    bodyElement.style = ``;

    table.colIndex = undefined;
};

const colLeaveEnter = (prevColIndex, nextColIndex) => {
    colLeave(prevColIndex);
    colEnter(nextColIndex);
};

const rowEnter = (rowIndex) => {
    const cellElement = table.body[rowIndex][0];
    const rowElement = cellElement.parentElement;
    rowElement.classList.add(`staved`);

    table.rowIndex = rowIndex;

    const track = table.tour.tracks[table.rowIndex];
    loader.get(track.url).then(track => player.load(track));
};

const rowLeave = (rowIndex) => {
    const cellElement = table.body[rowIndex][0];
    const rowElement = cellElement.parentElement;
    rowElement.classList.remove(`staved`);

    table.rowIndex = undefined;

    if (player.isPlaying()) {
        player.stop();
    }
    player.unload();
};

const rowLeaveEnter = (prevRowIndex, nextRowIndex) => {
    const cellElement = table.body[prevRowIndex][0];
    const rowElement = cellElement.parentElement;
    rowElement.classList.remove(`staved`);

    table.rowIndex = undefined;

    rowEnter(nextRowIndex);
};

const cellEnter = (rowIndex, colIndex) => {
    const cellElement = table.body[rowIndex][colIndex];
    const labelElement = cellElement.children[0];
    labelElement.appendChild(pointerElement);
    upperElement.innerHTML = rowIndex + 1;
    lowerElement.innerHTML = bodyElement.childElementCount;
    labelElement.appendChild(signElement);
};

const cellLeave = (rowIndex, colIndex) => {
    const cellElement = table.body[rowIndex][colIndex];
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

const addHeadEventListeners = (colIndex) => {
    const cellElement = table.head[colIndex];
    //in col -> row -> cell
    cellElement.addEventListener(`focusin`, (e) => {
        //e.relatedTarget - previous focus element
        if (isTable(e.relatedTarget)) {
            if (table.colIndex !== colIndex) {
                colLeaveEnter(table.colIndex, colIndex);
            }
        } else {
            colEnter(colIndex);
        }
    });
    //out cell -> row -> col
    cellElement.addEventListener(`focusout`, (e) => {
        //e.relatedTarget - next focus element
        if (!isTable(e.relatedTarget)) {
            if (!isPlayer(e.relatedTarget)) {
                colLeave(colIndex);
            }
        } else {
            if (table.colIndex !== colIndex) {
                colLeave(colIndex);
            }
        }
    });
};

let reenter = true;
const addBodyEventListeners = (rowIndex, colIndex) => {
    const cellElement = table.body[rowIndex][colIndex];
    //in col -> row -> cell
    cellElement.addEventListener(`focusin`, (e) => {
        //e.relatedTarget - previous focus element
        if (isTable(e.relatedTarget)) {
            if (table.colIndex !== colIndex) {
                colLeaveEnter(table.colIndex, colIndex);
            }
            if (table.rowIndex !== rowIndex) {
                rowLeaveEnter(table.rowIndex, rowIndex);
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
                inputElement.focus(); //re-focus is ignored, focus on other element causes focusout on current and then focusin on next element
                reenter = true;
            }
        } else {
            cellLeave(rowIndex, colIndex);
            if (table.rowIndex !== rowIndex) {
                rowLeave(rowIndex);
            }
            if (table.colIndex !== colIndex) {
                colLeave(colIndex);
            }
        }
    });
};

table.addEventListener(`addHeadEventListeners`, (e) => {
    const {colIndex} = e.detail;
    addHeadEventListeners(colIndex);
});

table.addEventListener(`addBodyEventListeners`, (e) => {
    const {rowIndex, colIndex} = e.detail;
    addBodyEventListeners(rowIndex, colIndex);
});

const scrollWidth = exampleRowElement.getBoundingClientRect().width;

const stretchFor = (rowElement, cols) => {
    if (scrollWidth / cols <= 300 || mobile) {
        rowElement.style.width = (cols * 100) + `%`;
    } else {
        rowElement.style.width = ``;
    }
};

table.addEventListener(`stretch`, (e) => {
    stretchFor(e.detail, table.tour.keys.length);
});

table.addEventListener(`remove`, (e) => {
    bodyElement.removeChild(e.detail);
});

table.addEventListener(`append`, (e) => {
    bodyElement.appendChild(e.detail);
});

table.addEventListener(`output`, () => {
    indexElement.innerHTML = table.tour.name;

    captionElement.innerHTML = table.tour.description;

    timer.load(table.tour.time);

    document.documentElement.style.setProperty(`--background-color`, table.tour.background);
    document.documentElement.style.setProperty(`--border-color`, table.tour.border);
    document.documentElement.style.setProperty(`--transparent-color`, table.tour.transparent);
});

table.addEventListener(`load`, () => {
    table.tour.tracks.forEach(track => {
        if (!loader.get(track.url)) {
            loader.load(track).then(track => {
                //console.log(`${track.url} is loading`)
            });
        }
    });
});

table.addEventListener(`start`, () => {
    player.setTitleMode(false);
    player.unload();
    timer.start();
});

player.addEventListener(`end`, () => {
    const selectNext = player.getSelectionMode();
    const array = selectNext(table.rowIndex, table.body);
    const cellElement = array[table.colIndex];
    const inputElement = cellElement.lastElementChild;
    if (cellElement === table.body[table.rowIndex][table.colIndex]) {
        const track = player.get();
        player.unload();
        player.load(track);
        return;
    }
    inputElement.focus();
});

timer.addEventListener(`end`, () => {
    player.setTitleMode(true);
    table.check();
});
clefElement.addEventListener(`click`, () => {
    timer.stop();
    player.setTitleMode(true);
    table.check();
});

tableElement.addEventListener(`keydown`, (e) => {
    let nextCellElement;
    switch (e.code) {
        case `ArrowUp`: {
            nextCellElement = previous(table.rowIndex, table.body)[table.colIndex];
            break;
        }
        case `ArrowDown`: {
            nextCellElement = next(table.rowIndex, table.body)[table.colIndex];
            break;
        }
        case `ArrowLeft`: {
            nextCellElement = previous(table.colIndex, table.body[table.rowIndex]);
            break;
        }
        case `ArrowRight`: {
            nextCellElement = next(table.colIndex, table.body[table.rowIndex]);
            break;
        }
        default: {
            return;
        }
    }
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


//initialization
table.initialize(
    new Tour(
        `Melotrack`,
        captionElement.innerText,
        0,
        document.documentElement.style.getPropertyValue(`--background-color`),
        document.documentElement.style.getPropertyValue(`--border-color`),
        [...headRowElement.children].map(cellElement => cellElement.innerText.toLowerCase()),
        [
            new Track(`1`, `Melotrack`, `Melotrack`, `./audio/melotrack1.mp3`),
            new Track(`2`, `Melotrack`, `Play mode`, `./audio/melotrack2.mp3`),
            new Track(`3`, `Melotrack`, `Bar volume`, `./audio/melotrack3.mp3`),
            new Track(`4`, `Melotrack`, `Arrows index`, `./audio/melotrack4.mp3`),
            new Track(`5`, `Melotrack`, `timer clef`, `./audio/melotrack5.mp3`),
            new Track(`6`, `Melotrack`, `Caption`, `./audio/melotrack6.mp3`),
            new Track(`7`, `Melotrack`, `header Keys`, `./audio/melotrack7.mp3`),
            new Track(`8`, `Melotrack`, `tracks`, `./audio/melotrack8.mp3`),
            new Track(`9`, `Melotrack`, `:)`, `./audio/melotrack9.mp3`),
            new Track(`10`, `Rick Astley`, `Never Gonna Give You Up`, `./audio/melotrack10.mp3`)
        ]
    ),
    bodyElement.childElementCount,
    headRowElement.childElementCount,
    (colIndex) => {
        table.head[colIndex] = headRowElement.children[colIndex];
        addHeadEventListeners(colIndex);
    },
    (rowIndex) => {
        const rowElement = bodyElement.children[rowIndex];
        table.body[rowIndex] = [];
        stretchFor(rowElement, rowElement.childElementCount);
        return rowElement;
    },
    (rowElement, rowIndex, colIndex) => {
        table.body[rowIndex][colIndex] = rowElement.children[colIndex];
        addBodyEventListeners(rowIndex, colIndex);
    }
);

export {table};

console.log(`table loaded`);