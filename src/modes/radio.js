import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const RADIO = `https://api.deezer.com/radio/`;

export const radio = (data, markProgressBy) => {
    markProgressBy(15);
    const id = data.radios[Math.floor(Math.random() * 150)];

    let title;
    return fetch(CORS + RADIO + id)
        .then(response => {
            markProgressBy(15);
            return response.json();
        })
        .then(radio => {
            markProgressBy(20);
            title = radio.title;
            return fetch(CORS + radio.tracklist);
        })
        .then(tracklist => {
            markProgressBy(50);
            return new Tour(`Radio`, `Guess the artists and titles from radio "${title}".`, 60000, `yellow`, `green`, [`artist`, `title`], tracklist.data);
        })
        .catch(error => console.error(error));
};