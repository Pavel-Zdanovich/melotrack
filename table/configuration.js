import {tour} from "../script.js";
import {loader} from "../loader/configuration.js";
import {player} from "../player/configuration.js";
import {Table} from "./table.js";

let element = document.body.children[1];

let formElement = element.children[0];
let tableElement = element.children[1];

let captionElement = tableElement.children[0];
let colgroupElement = tableElement.children[1];
let theadElement = tableElement.children[2];
let tbodyElement = tableElement.children[3];

let createCol = (name) => {
    let col = document.createElement(`col`);
    col.setAttribute(`class`, `${name}_col`);
    return col;
};

let createRow = () => {
    return document.createElement(`tr`);
};

let createCell = (cellType, classType, inner) => {
    let cell = document.createElement(cellType);

    if (classType != null && typeof classType === `string`) {
        cell.setAttribute(`class`, classType);
    }

    if (typeof inner === `string`) {
        cell.innerHTML = inner;
    } else if (inner instanceof Element) {
        cell.appendChild(inner);
    } else {
        throw new Error(`Illegal inner: ${inner}`);
    }

    return cell;
};

let createInput = (col, row) => {
    let label = document.createElement(`label`);
    let input = document.createElement(`input`);
    input.setAttribute(`form`, `form`);
    input.setAttribute(`id`, row);
    input.setAttribute(`name`, col);
    input.setAttribute(`type`, `text`);
    label.appendChild(input);
    return label;
};

let gray = `#BDBDBD`;
let grayer = `#7E7E7E`;
let grayest = `#636363`;

let addRowEventListener = (key, row) => {
    if (row == null || !(row instanceof HTMLTableRowElement)) {
        throw new Error(`Not row!`);
    }

    row.addEventListener(`mouseenter`, () => {
        rowMouseEnter(key);
        row.style.backgroundColor = gray;
    });
    row.addEventListener(`mouseleave`, () => {
        rowMouseLeave(key);
        row.removeAttribute(`style`);
    });
};

let addCellEventListener = (key, cell) => {
    if (cell == null || !(cell instanceof HTMLTableCellElement)) {
        throw new Error(`Not cell!`);
    }

    cell.addEventListener(`mouseenter`, () => {
        colMouseEnter(key);
        cell.style.backgroundColor = grayest;
    });
    cell.addEventListener(`mouseleave`, () => {
        colMouseLeave(key);
        cell.removeAttribute(`style`);
    });
};

captionElement.innerText = tour.description;

let map = new Map();

let colMouseEnter;
let colMouseLeave;
let rowMouseEnter;
let rowMouseLeave;

let theadRow = createRow();
theadElement.appendChild(theadRow);

tour.keys.forEach((key, index, array) => {
    let col = createCol(key);
    colgroupElement.appendChild(col);

    let classType = (index >= 0 && index < array.length - 1) ? `tc` : undefined;

    let cell = createCell(`th`, classType,key.charAt(0).toUpperCase() + key.slice(1));
    cell.addEventListener(`mouseenter`, () => {
        colMouseEnter(key);
    });
    cell.addEventListener(`mouseleave`, () => {
        colMouseLeave(key);
    });
    theadRow.appendChild(cell);

    map.set(key, [cell]);
});

tour.tracks.forEach(track => {
    let row = createRow();
    addRowEventListener(track.url, row);

    tour.keys.forEach((key, index, array) => {
        let classType = (index >= 0 && index < array.length - 1) ? `tc` : undefined;
        let cell = createCell(`td`, classType, createInput(key, track.id));
        addCellEventListener(key, cell);
        row.appendChild(cell);
        map.get(key).push(cell);
    });

    tbodyElement.appendChild(row);
});

colMouseEnter = (key) => {
    map.get(key).forEach(cell => {
        cell.style.backgroundColor = gray;
    });
};
colMouseLeave = (key) => {
    map.get(key).forEach(cell => {
        cell.removeAttribute(`style`);
    });
};

rowMouseEnter = (key) => {
    let value = loader.get(key);
    if (value instanceof Promise) {
        value.then(buffer => {
            console.log(`${key} BUFFERED`);
            return player.decode(buffer);
        }).then(buffer => {
            console.log(`${key} DECODED`);
            player.set(key, buffer);
            loader.set(key, buffer);
        });
    } else if (value instanceof AudioBuffer) {
        player.set(key, value);
    } else {
        throw new Error(`Illegal value: ${value}`);
    }
};
rowMouseLeave = (key) => {
    if (player.isPlaying()) {
        console.log(`Do I need stop ${key}?`);
    }
};

let table = new Table(tour);
let footerElement = document.body.children[2];
footerElement.addEventListener(`click`, () => {
    Array.from(map.values())
        .flatMap(value => value)
        .filter(cell => `th` !== cell.tagName.toLowerCase())
        .map(cell => cell.lastElementChild.lastElementChild)
        .forEach(input => {
            let col = input.getAttribute(`name`);
            let row = input.getAttribute(`id`);
            let actual = input.value;
            let expected = table.get(col, row);
            let result = table.similarity(expected, actual);
            console.log(`${col}_${row} '${actual}' = '${expected}' on ${result * 100}%`);
        });
});