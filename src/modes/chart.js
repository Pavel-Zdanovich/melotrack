import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const CHART = `https://api.deezer.com/chart`;

export const chart = (data, markProgressBy) => {
    return fetch(CORS + CHART)
        .then(response => {
            markProgressBy(25);
            return response.json();
        })
        .then(json => {
            markProgressBy(25);
            const tracks = json.tracks.data;
            markProgressBy(50);
            return new Tour(`Chart`, `Guess the artists and titles from chart.`, 60000, `red`, `blue`, [`artist`, `title`], tracks);
        })
        .catch(error => console.error(error));
};