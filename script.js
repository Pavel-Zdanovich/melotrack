"use strict";

import {tours, loadTour} from "./src/app.js";

let index = 0;

const indexElement = document.body.children[4].children[1];
const output = () => {
    indexElement.innerHTML = `${index + 1}/${tours.length}`;
}

output();

const load = async (tour) => {
    output();
    loadTour(await tour());
    document.documentElement.style.setProperty(`--background-color`, tour.background);
    document.documentElement.style.setProperty(`--border-color`, tour.border);
}

const prev = () => {
    if (index > 0) {
        index--;
    } else {
        index = tours.length;
    }

    return tours[index];
}
const next = () => {
    if (index <= tours.length - 2) {
        index++;
    } else {
        index = 0;
    }

    return tours[index];
}

const prevElement = document.body.children[1];
const nextElement = document.body.children[3];

prevElement.addEventListener(`click`, () => {
    load(prev());
});
nextElement.addEventListener(`click`, () => {
    load(next());
});

console.log(`script loaded`);