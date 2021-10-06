"use strict";

import {random, loadTour} from "./src/app.js";

const tours = [
    random(),
    await fetch(`data/tour1.json`).then(response => response.json()),
    await fetch(`data/tour2.json`).then(response => response.json())
];

let index;

const load = (tour) => {
    console.log(tour);
    loadTour(tour);
    document.documentElement.style.setProperty(`--background-color`, tour.background);
    document.documentElement.style.setProperty(`--border-color`, tour.border);
}

const prev = document.body.children[1];
const next = document.body.children[3];

prev.addEventListener(`click`, () => {
    if (index > 0) {
        index--;
    } else {
        index = tours.length;
    }
    load(tours[index]);
});
next.addEventListener(`click`, () => {
    if (index <= tours.length - 2) {
        index++;
    } else {
        index = 0;
    }
    load(tours[index]);
});

console.log(`script loaded`);