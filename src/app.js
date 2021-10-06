import {Track} from "./entities/track.js";
import {Tour} from "./entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;

const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const random = () => {
    const URL = `https://api.deezer.com/track/`;

    let tracks = [];

    let counter = 0;
    let attempts = 0;

    while (counter < 10 && attempts < 20) {
        let id = 10000000 + Math.floor(Math.random() * 1000000);

        console.log(`Try fetch ${CORS + URL + id}`);

        fetch(CORS + URL + id)
            .then(response => response.json())
            .then(json => {
                let track = Track.parse(json);
                tracks.push(track);
                counter++;
            })
            .catch(error => console.error(error));

        attempts++;
    }

    return new Tour(`Random`, `Guess the artist and title.`, 60000, randomColor(), randomColor(), [`artist`, `title`], tracks);
};

export let loadTour;

export const whenLoaded = new Promise((resolve) => {
    loadTour = resolve;
});

console.log(`promise`);

import("./utils/mobile.js");
import("./loader/configuration.js").then(() => console.log(`loader loaded`));
import("./player/configuration.js").then(() => console.log(`player loaded`));
import("./table/configuration.js").then(() => console.log(`table loaded`));
import("./timer/configuration.js").then(() => console.log(`timer loaded`));