import {Track} from "../entities/track.js";
import {Tour} from "../entities/tour.js";

const letters = '0123456789ABCDEF';

const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const CORS = `https://cors-anywhere.herokuapp.com/`;
const URL = `https://api.deezer.com/track/`;

export const random = async () => {
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

    return new Tour(`Random`, `Guess random artists and titles.`, 60000, randomColor(), randomColor(), [`artist`, `title`], tracks);
};