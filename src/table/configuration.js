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

const exampleRowElement = tbodyElement.children[0];
const exampleCellElement = exampleRowElement.children[0];
const labelElement = exampleCellElement.children[0];
const clefElement = labelElement.children[0];
const signElement = labelElement.children[1];
const upperElement = signElement.children[0];
const lowerElement = signElement.children[1];

const createLabelElement = (id) => {
    const label = document.createElement(`label`);
    label.htmlFor = id;
    return label;
};

const createInputElement = (id) => {
    const input = document.createElement(`input`);
    input.id = id;
    input.type = `text`;
    return input;
};

//initialization
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

const map = [[]]; //map[row][col] - [[thr, th1, th2], [tbr1, td1, td2], [tbr2, td1, td2], ..., [tbr10, td1, td2]]

let currentRowIndex;
let currentColIndex;

map[0][0] = theadRowElement;

const theadRect = theadRowElement.getBoundingClientRect();
const tbodyRect = tbodyElement.getBoundingClientRect();
const height = theadRect.height + tbodyRect.height;
const width = theadRect.width;

const stretchFor = (rowElement, cols) => {
    if (width / cols <= 300 || mobile) {
        rowElement.style.width = cols + `00%`;
    }
};

const isCol = (element) => {
    const tagName = element ? element.tagName : element;
    return tagName === `TH` || tagName === `LABEL` || tagName === `svg` || tagName === `path` || tagName === `DIV` || tagName === `INPUT`; //TODO
}

const scrollTo = (colIndex) => {
    const colElement = map[1][colIndex].getBoundingClientRect();
    tbodyElement.scrollTo((colIndex - 1) * colElement.width, 0);
};

const colEnter = (from, colIndex) => {
    if (isCol(from)) {
        if (currentColIndex !== colIndex) {
            for (let rowIndex = 0; rowIndex <= tbodyElement.childElementCount; rowIndex++) {
                map[rowIndex][currentColIndex].style.borderWidth = ``;
                map[rowIndex][colIndex].style.borderWidth = `5px`;
            }
            scrollTo(colIndex);
            currentColIndex = colIndex;
        }
    } else {
        for (let rowIndex = 0; rowIndex <= tbodyElement.childElementCount; rowIndex++) {
            map[rowIndex][colIndex].style.borderWidth = `5px`;
        }
        scrollTo(colIndex);
        currentColIndex = colIndex;
    }
};

const colLeave = (to, colIndex) => {
    if (!isCol(to)) {
        for (let rowIndex = 0; rowIndex <= tbodyElement.childElementCount; rowIndex++) {
            map[rowIndex][colIndex].style.borderWidth = ``;
        }
        currentColIndex = undefined;
    }
};

const fillCellsInRow = (rowIndex, cellEnter, cellLeave) => {
    const array = map[rowIndex];
    const rowElement = array[0];
    for (let index = 0; index < rowElement.childElementCount; index++) {
        const cellElement = rowElement.children[index];

        const colIndex = index + 1;

        map[rowIndex][colIndex] = cellElement;

        cellElement.addEventListener(`focusin`, (e) => {
            colEnter(e.relatedTarget, colIndex);
            cellEnter(rowIndex, colIndex);
        });
        cellElement.addEventListener(`focusout`, (e) => {
            colLeave(e.relatedTarget, colIndex);
            cellLeave(rowIndex, colIndex);
        });
    }
};

fillCellsInRow(
    0,
    (rowIndex, colIndex) => {
        const cellElement = map[rowIndex][colIndex];
        cellElement.style.borderColor = `var(--border-color)`;
        cellElement.style.borderStyle = `solid`;
        cellElement.style.borderWidth = `5px`;
    },
    (rowIndex, colIndex) => {
        const cellElement = map[rowIndex][colIndex];
        cellElement.style.borderColor = ``;
        cellElement.style.borderStyle = ``;
        cellElement.style.borderWidth = ``;
    },
);

const rowEnter = (rowIndex) => {
    map[rowIndex][0].classList.add(`staved`);
    currentRowIndex = rowIndex;
    const url = tracks[currentRowIndex].url;
    loader.get(url).then(track => player.set(track));
};

const rowLeave = (rowIndex) => {
    map[rowIndex][0].classList.remove(`staved`);
    currentRowIndex = undefined;
};

labelElement.innerHTML = ``;

const cellEnter = (rowIndex, colIndex) => {
    const label = map[rowIndex][colIndex].children[0];
    label.appendChild(clefElement);
    upperElement.innerHTML = rowIndex;
    lowerElement.innerHTML = tbodyElement.childElementCount;
    label.appendChild(signElement);
};

const cellLeave = (rowIndex, colIndex) => {
    const label = map[rowIndex][colIndex].children[0];
    label.innerHTML = ``;
};

for (let tbodyChildrenIndex = 0; tbodyChildrenIndex < tbodyElement.childElementCount; tbodyChildrenIndex++) {
    const rowElement = tbodyElement.children[tbodyChildrenIndex];

    const rowIndex = tbodyChildrenIndex + 1;

    map[rowIndex] = [rowElement];

    stretchFor(rowElement, rowElement.childElementCount);

    rowElement.addEventListener(`focusin`, () => {
        rowEnter(rowIndex);
    });
    rowElement.addEventListener(`focusout`, () => {
        rowLeave(rowIndex);
    });

    fillCellsInRow(rowIndex, cellEnter, cellLeave);
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

                let cellElement = map[0][colIndex];
                if (!cellElement) {
                    cellElement = document.createElement(`th`);

                    map[0][colIndex] = cellElement;

                    cellElement.addEventListener(`focusin`, (e) => {
                        colEnter(e.fromElement, colIndex);
                    });
                    cellElement.addEventListener(`focusout`, (e) => {
                        colLeave(e.toElement, colIndex);
                    });

                    map[0][0].appendChild(cellElement);
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

            rowElement.addEventListener(`focusin`, () => {
                rowEnter(rowIndex);
            });
            rowElement.addEventListener(`focusout`, () => {
                rowLeave(rowIndex);
            });

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

                        const labelElement = createLabelElement(id);

                        const inputElement = createInputElement(id);

                        cellElement = document.createElement(`td`);

                        map[rowIndex][colIndex] = cellElement;

                        cellElement.addEventListener(`focusin`, (e) => {
                            colEnter(e.fromElement, colIndex);
                            cellEnter(rowIndex, colIndex);
                        });
                        cellElement.addEventListener(`focusout`, (e) => {
                            colLeave(e.toElement, colIndex);
                            cellLeave(rowIndex, colIndex);
                        });

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