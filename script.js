"use strict";

import {tours, loadTour} from "./src/app.js";

let index = 0;

const indexElement = document.body.children[2].children[0];

const output = () => {
    indexElement.innerHTML = indexElement.innerHTML + `${index + 1}/${tours.length}`;
}

const load = async (get) => {
    output();
    let tour = await get();
    console.log(tour);
    loadTour(tour);
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

const leftElement = document.body.children[1];
const rightElement = document.body.children[3];

leftElement.addEventListener(`click`, () => {
    load(prev());
});
rightElement.addEventListener(`click`, () => {
    load(next());
});

const clefElement = document.body.children[4].children[1];

clefElement.addEventListener(`click`, () => {
    load(tours[index]);
});

console.log(`script loaded`);