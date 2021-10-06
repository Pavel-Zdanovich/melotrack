import {whenLoaded} from "../app.js";
import {loader} from "../loader/configuration.js";
import {player} from "../player/configuration.js";
import {Table} from "./table.js";

let tableElement = document.body.children[2];
let footerElement = document.body.children[4];

let captionElement = tableElement.children[0];
let theadElement = tableElement.children[1];
let tbodyElement = tableElement.children[2];

let createRow = (classType) => {
    let row = document.createElement(`tr`);

    if (classType != null && typeof classType === `string`) {
        row.setAttribute(`class`, classType);
    }

    return row;
};

let createCell = (cellType, classType) => {
    let cell = document.createElement(cellType);

    if (classType != null && typeof classType === `string`) {
        cell.setAttribute(`class`, classType);
    }

    return cell;
};

let createInput = (col, row, classType) => {
    let label = document.createElement(`label`);
    label.setAttribute(`class`, classType);
    let input = document.createElement(`input`);
    input.setAttribute(`id`, row);
    input.setAttribute(`name`, col);
    input.setAttribute(`type`, `text`);
    input.setAttribute(`class`, classType);
    label.appendChild(input);
    return label;
};

const map = [[]];

const colColor = `lightgray`;
const rowColor = `lightgray`;
const cellColor = `gray`;

let currentCol;
let currentRow;

whenLoaded.then((tour) => {
    captionElement.innerText = tour.description;
    theadElement.innerHTML = ``;
    tbodyElement.innerHTML = ``;

    let theadRow = createRow(`thr`);
    theadElement.appendChild(theadRow);
    map[0][0] = theadRow;

    tour.keys.forEach((key, index, array) => {
        let classType = (index >= 0 && index < array.length - 1) ? `tc` : undefined;

        let cell = createCell(`th`, classType);
        cell.innerText = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

        cell.addEventListener(`mouseenter`, () => {
            map[index + 1].forEach(cell => {
                cell.style.backgroundColor = colColor;
            });
        });
        cell.addEventListener(`mouseleave`, () => {
            map[index + 1].forEach(cell => {
                cell.removeAttribute(`style`);
            });
        });

        theadRow.appendChild(cell);

        map[index + 1] = [cell];
    });

    tour.tracks.forEach((track, rowIndex) => {
        let classType = rowIndex % 2 === 1 ? 'tbr' : 'tbr staved';
        let row = createRow(classType);

        row.addEventListener(`mousedown`, () => {
            if (player.get() !== loader.get(track.url)) {
                player.set(loader.get(track.url));
            }
        });

        tbodyElement.appendChild(row);

        map[0][rowIndex + 1] = row;

        tour.keys.forEach((key, colIndex, array) => {
            let input = createInput(key, track.id, 'transparent');

            let classType = (colIndex >= 0 && colIndex < array.length - 1) ? `tc centralized transparent` : `centralized transparent`;

            let cell = createCell(`td`, classType);

            cell.addEventListener(`mouseenter`, () => {
                currentCol = colIndex + 1;
                currentRow = rowIndex + 1;

                console.log(`Enter: [${currentCol}, ${currentRow}]`);

                map[currentCol].forEach(cell => cell.style.backgroundColor = colColor);
                map.forEach(col => col[currentRow].style.backgroundColor = rowColor);
                map[currentCol][currentRow].style.backgroundColor = cellColor;
            });
            cell.addEventListener(`mouseleave`, () => {
                console.log(`Leave: [${currentCol}, ${currentRow}]`);

                map[currentCol].forEach(cell => cell.removeAttribute(`style`));
                map.forEach(col => col[currentRow].removeAttribute(`style`));
            });

            cell.appendChild(input);

            row.appendChild(cell);

            map[colIndex + 1][rowIndex + 1] = cell;
        });
    });

    tableElement.addEventListener(`keydown`, (e) => {
        let previousCol = currentCol;
        let previousRow = currentRow;

        switch (e.code) {
            case `ArrowUp`: {
                if (currentRow === 1) {
                    currentRow = map[0].length - 1;
                } else {
                    currentRow--;
                }
                break;
            }
            case `ArrowDown`: {
                if (currentRow === map[0].length - 1) {
                    currentRow = 1;
                } else {
                    currentRow++;
                }
                break;
            }
            case `ArrowLeft`: {
                if (currentCol === map.length - 1) {
                    currentCol = 1;
                } else {
                    currentCol++;
                }
                break;
            }
            case `ArrowRight`: {
                if (currentCol === 1) {
                    currentCol = map.length - 1;
                } else {
                    currentCol--;
                }
                break;
            }
            default: {
                return;
            }
        }

        console.log(`Previous: [${previousCol}, ${previousRow}]. Current: [${currentCol}, ${currentRow}]`);

        map[previousCol].forEach(cell => cell.removeAttribute(`style`));
        map.forEach(col => col[previousRow].removeAttribute(`style`));

        map[currentCol].forEach(cell => cell.style.backgroundColor = colColor);
        map.forEach(col => col[currentRow].style.backgroundColor = rowColor);
        map[currentCol][currentRow].style.backgroundColor = cellColor;

        map[currentCol][currentRow].firstElementChild.firstElementChild.select();
    });

    let table = new Table(tour);
    footerElement.addEventListener(`click`, (event) => {
        console.log(`Footer clicked!`);
        map
            .flatMap(value => value)
            .filter(cell => {
                return `th` !== cell.tagName.toLowerCase() && `tr` !== cell.tagName.toLowerCase();
            })
            .map(cell => cell.lastElementChild.lastElementChild)
            .forEach(input => {
                let col = input.getAttribute(`name`);
                let row = input.getAttribute(`id`);
                let actual = input.value;
                let expected = table.get(col, Number.parseInt(row));
                let result = table.similarity(expected, actual);
                console.log(`${col}_${row} '${actual}' = '${expected}' on ${result * 100}%`);
                input.value = expected;
            });
    });

});