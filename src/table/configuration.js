import {Track} from "../entities/track.js";
import {onLoad} from "../app.js";
import {mobile} from "../utils/mobile.js";
import {loader} from "../loader/configuration.js";
import {player} from "../player/configuration.js";
import {Validator} from "./validator.js";

const tableElement = document.body.children[2];
const footerElement = document.body.children[4];

const captionElement = tableElement.children[0];
const theadElement = tableElement.children[1];
const tbodyElement = tableElement.children[2];

const theadRowElement = theadElement.children[0];
const theadCellElement = theadRowElement.children[0];

const exampleRowElement = tbodyElement.children[0];
const exampleCellElement = exampleRowElement.children[0];
const labelElement = exampleCellElement.children[0];
const clefElement = labelElement.children[0];
const signElement = labelElement.children[1];
const upperElement = signElement.children[0];
const lowerElement = signElement.children[1];

const map = [[]]; //map[row][col] - [[thr, th1, th2], [tbr1, td1, td2], [tbr2, td1, td2], ..., [tbr10, td1, td2]]

let currentRowIndex;
let currentColIndex;

const color = `gray`;
const border = `var(--border-color)`;

let requestId;
let touchEnd = false;
tbodyElement.addEventListener(`touchend`, () => {
    touchEnd = true;
    tbodyElement.scrollBy(1, 0);
})

const scrollWidth = exampleRowElement.getBoundingClientRect().width;
const threshold = theadCellElement.getBoundingClientRect().width;

let prevScroll = 0;
let scrollBy = 0;
let direction;
tbodyElement.addEventListener(`scroll`, () => {
    const currentScroll = tbodyElement.scrollLeft - prevScroll;
    prevScroll = tbodyElement.scrollLeft;
    if (!direction) {
        direction = currentScroll > 0 ? `>` : `<`;
    }

    const colIndex = Math.trunc(tbodyElement.scrollLeft / scrollWidth);

    const left = colIndex * scrollWidth;
    const right = left + scrollWidth;

    const diffLeft = tbodyElement.scrollLeft - left;
    const diffRight = right - tbodyElement.scrollLeft;

    if (direction === `>`) {
        if (diffLeft < threshold) {
            scrollBy = -1 * diffLeft;
        } else {
            scrollBy = diffRight;
        }
    } else {
        if (diffRight < threshold) {
            scrollBy = diffRight;
        } else {
            scrollBy = -1 * diffLeft;
        }
    }

    if (touchEnd) {
        touchEnd = false;

        const start = performance.now();
        const duration = 1000;
        const callback = (time) => {
            let progress = (time - start) / duration;
            const x = progress * scrollBy;
            if (Number.parseInt(scrollBy.toFixed(1)) !== 0) {
                tbodyElement.scrollBy(x, 0);
                requestId = requestAnimationFrame(callback);
            } else {
                cancelAnimationFrame(requestId);
                requestId = undefined;
                direction = undefined;
            }
        }
        requestId = requestAnimationFrame(callback);
    }
});

const colEnter = (colIndex) => {
    //console.log(`Enter col ${colIndex}`);
    for (let rowIndex = 0; rowIndex <= tbodyElement.childElementCount; rowIndex++) {
        const array = map[rowIndex];
        //const rowElement = array[0];
        const cellElement = map[rowIndex][colIndex];
        cellElement.style.backgroundColor = color;
        if (colIndex === 1) {
            cellElement.style.borderLeftColor = border;
        } else if (colIndex === array.length - 1) {
            cellElement.style.borderRightColor = border;
        }
    }
    map[0][colIndex].style.borderTopColor = border;
    if (colIndex === 1) {
        theadElement.style.borderLeftColor = border;
        tbodyElement.style.borderLeftColor = border;
        tbodyElement.style.borderRightColor = border;
    } else if (colIndex === map[0].length - 1) {
        theadElement.style.borderRightColor = border;
        tbodyElement.style.borderRightColor = border;
    } else {
        tbodyElement.style.borderLeftColor = border;
        tbodyElement.style.borderRightColor = border;
    }

    let width = 0;
    for (let index = 1; index <= colIndex - 1; index++) {
        width = width + map[1][index].getBoundingClientRect().width;
    }
    tbodyElement.scrollTo(width + 0.5, 0);
    currentColIndex = colIndex;
};

const colLeave = (colIndex) => {
    //console.log(`Leave col ${colIndex}`);
    for (let rowIndex = 0; rowIndex <= tbodyElement.childElementCount; rowIndex++) {
        const cellElement = map[rowIndex][colIndex];
        cellElement.style = ``;
    }
    map[0][colIndex].style = ``;
    theadElement.style = ``;
    tbodyElement.style = ``;
    currentColIndex = undefined;
};

const rowEnter = (rowIndex) => {
    //console.log(`Enter row ${rowIndex}`);
    map[rowIndex][0].classList.add(`staved`);
    currentRowIndex = rowIndex;
    const url = tracks[currentRowIndex].url; //TODO
    loader.get(url).then(track => player.set(track));
};

const rowLeave = (rowIndex) => {
    //console.log(`Leave row ${rowIndex}`);
    map[rowIndex][0].classList.remove(`staved`);
    currentRowIndex = undefined;
};

const cellEnter = (rowIndex, colIndex) => {
    //console.log(`Enter TD [${rowIndex}][${colIndex}]`);
    const label = map[rowIndex][colIndex].children[0];
    label.appendChild(clefElement);
    upperElement.innerHTML = rowIndex;
    lowerElement.innerHTML = tbodyElement.childElementCount;
    label.appendChild(signElement);
};

const cellLeave = (rowIndex, colIndex) => {
    //console.log(`Leave TD [${rowIndex}][${colIndex}]`);
    const label = map[rowIndex][colIndex].children[0];
    label.innerHTML = ``;
};

const isTable = (element) => {
    const tagName = element ? element.tagName : element;
    return tagName === `TH` || tagName === `TD` || tagName === `LABEL` || tagName === `svg` || tagName === `path` || tagName === `DIV` || tagName === `INPUT`; //TODO
}

const addEventListeners = (rowIndex, colIndex, colEnter, colLeave, rowEnter, rowLeave, cellEnter, cellLeave) => {
    const cellElement = map[rowIndex][colIndex];
    cellElement.addEventListener(`focusin`, (e) => {
        if (isTable(e.relatedTarget)) {
            if (currentColIndex !== colIndex) {
                colLeave(currentColIndex);
                colEnter(colIndex);
            }
        } else {
            colEnter(colIndex);
        }
        if (isTable(e.relatedTarget)) {
            if (currentRowIndex !== rowIndex) {
                rowLeave(currentRowIndex);
                rowEnter(rowIndex);
            }
        } else {
            rowEnter(rowIndex);
        }
        cellEnter(rowIndex, colIndex);
    });
    cellElement.addEventListener(`focusout`, (e) => {
        cellLeave(rowIndex, colIndex);
        if (!isTable(e.relatedTarget)) {
            rowLeave(rowIndex);
        }
        if (!isTable(e.relatedTarget)) {
            colLeave(colIndex);
        }
    });
}

const fillCellsInRow = (rowIndex, colEnter, colLeave, rowEnter, rowLeave, cellEnter, cellLeave) => {
    const rowElement = map[rowIndex][0];

    for (let index = 0; index < rowElement.childElementCount; index++) {
        const cellElement = rowElement.children[index];

        const colIndex = index + 1;

        map[rowIndex][colIndex] = cellElement;

        addEventListeners(rowIndex, colIndex, colEnter, colLeave, rowEnter, rowLeave, cellEnter, cellLeave);
    }
};

//initialization
map[0][0] = theadRowElement;

fillCellsInRow(
    0,
    colEnter,
    colLeave,
    (rowIndex) => {
        //console.log(`Enter row ${rowIndex}`);
        currentRowIndex = rowIndex;
    },
    (rowIndex) => {
        //console.log(`Leave row ${rowIndex}`);
        currentRowIndex = undefined;
    },
    (rowIndex, colIndex) => {
        //console.log(`Enter TH [${rowIndex}][${colIndex}]`);
        const array = map[rowIndex];
        //const rowElement = array[0];
        const cellElement = array[colIndex];
        if (colIndex === 1) {
            cellElement.style.borderLeftColor = border;
            theadElement.style.borderLeftColor = border;
            tbodyElement.style.borderLeftColor = border;
            tbodyElement.style.borderRightColor = border;
        } else if (colIndex === array.length - 1) {
            cellElement.style.borderRightColor = border;
            theadElement.style.borderRightColor = border;
            tbodyElement.style.borderRightColor = border;
        }
        cellElement.style.borderTopColor = border;

    },
    (rowIndex, colIndex) => {
        //console.log(`Leave TH [${rowIndex}][${colIndex}]`);
        const cellElement = map[rowIndex][colIndex];
        cellElement.style = ``;
        theadElement.style = ``;
        tbodyElement.style = ``;
    },
);

labelElement.innerHTML = ``;

const stretchFor = (rowElement, cols) => {
    if (scrollWidth / cols <= 300 || mobile) {
        rowElement.style.width = (cols * 100) + `%`;
    }
};

for (let index = 0; index < tbodyElement.childElementCount; index++) {
    const rowElement = tbodyElement.children[index];

    const rowIndex = index + 1;

    map[rowIndex] = [rowElement];

    stretchFor(rowElement, rowElement.childElementCount);

    fillCellsInRow(rowIndex, colEnter, colLeave, rowEnter, rowLeave, cellEnter, cellLeave);
}

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

let tracks = [
    new Track(`melotrack1`, `Melotrack`, `1`, `./audio/melotrack1.mp3`),
    new Track(`melotrack2`, `Melotrack`, `2`, `./audio/melotrack2.mp3`)
];

tracks.forEach(track => loader.load(track));
loader.get(`./audio/melotrack1.mp3`).then(track => player.set(track));

player.addEventListener(`end`, (e) => {
    const selectNext = player.getSelectionMode();
    const current = e.detail;
    const index = tracks.indexOf(current);
    const next = selectNext(index, tracks);
    loader.get(next.url).then(track => player.set(track));
});

onLoad.then((tour) => {
    tracks = tour.tracks;

    tracks.forEach(track => loader.load(track));

    captionElement.innerText = tour.description;

    const prevRowsCount = map.length - 1; // - thead
    const prevColsCount = map[0].length - 1; // - tr

    if (prevRowsCount > tour.tracks.length) {
        const arrays = map.splice(tour.tracks.length);
        arrays.map(array => array[0]).forEach(row => tbodyElement.removeChild(row));
    } else {
        if (prevColsCount > tour.keys.length) {
            const cells = map[0].splice(tour.tracks.length);
            cells.forEach(cell => map[0][0].removeChild(cell));
        } else {
            for (let keyIndex = 0; keyIndex < tour.keys.length; keyIndex++) {
                const key = tour.keys[keyIndex];

                const colIndex = keyIndex + 1;
                const rowIndex = 0;

                const rowElement = map[rowIndex][0];

                let cellElement = map[rowIndex][colIndex];
                if (!cellElement) {
                    cellElement = document.createElement(`th`);

                    map[rowIndex][colIndex] = cellElement;

                    addEventListeners(rowIndex, colIndex, colEnter, colLeave, () => {
                    }, () => {
                    }, () => {
                    }, () => {
                    });

                    rowElement.appendChild(cellElement);
                }

                cellElement.innerText = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            }
        }

        for (let trackIndex = 0; trackIndex < tour.tracks.length; trackIndex++) {
            const rowIndex = trackIndex + 1;

            const array = map[rowIndex];

            let rowElement;

            if (array) {
                rowElement = array[0];
            } else {
                rowElement = document.createElement(`tr`);
                map[rowIndex] = [rowElement];
                tbodyElement.appendChild(rowElement);
            }

            stretchFor(rowElement, tour.keys.length);

            if (prevColsCount > tour.keys.length) {
                const cells = map[rowIndex].splice(tour.tracks.length);
                cells.forEach(cell => rowElement.removeChild(cell));
            } else {
                for (let keyIndex = 0; keyIndex < tour.keys.length; keyIndex++) {
                    const key = tour.keys[keyIndex];

                    const colIndex = keyIndex + 1;

                    let cellElement = map[rowIndex][colIndex];
                    if (!cellElement) {
                        const id = key + `_` + colIndex;

                        const labelElement = document.createElement(`label`);
                        labelElement.htmlFor = id;

                        const inputElement = document.createElement(`input`);
                        inputElement.id = id;
                        inputElement.type = `text`;

                        cellElement = document.createElement(`td`);

                        map[rowIndex][colIndex] = cellElement;

                        addEventListeners(rowIndex, colIndex, colEnter, colLeave, rowEnter, rowLeave, cellEnter, cellLeave);

                        cellElement.appendChild(labelElement);
                        cellElement.appendChild(inputElement);

                        rowElement.appendChild(cellElement);
                    }
                }
            }
        }
    }
});

const validator = new Validator();

footerElement.addEventListener(`click`, () => {
    for (let rowIndex = 1; rowIndex < map.length; rowIndex++) {
        for (let colIndex = 1; colIndex < map[0].length; colIndex++) {
            const cellElement = map[rowIndex][colIndex];
            const inputElement = cellElement.lastElementChild;
            const expected = tour.tracks[rowIndex];
            const actual = inputElement.value;
            const result = validator.similarity(expected, actual);
            console.log(`${rowIndex}_${colIndex} '${actual}' = '${expected}' on ${result * 100}%`);
            inputElement.value = expected;
        }
    }
});

console.log(`table loaded`);