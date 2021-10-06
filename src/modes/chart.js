import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const CHART = `https://api.deezer.com/chart`;

export const chart = async () => {
    return fetch(CORS + CHART)
        .then(response => response.json())
        .then(json => {
            const tracks = json.tracks.data;
            return new Tour(`Chart`, `Guess the artists and titles from chart.`, 60000, `red`, `blue`, [`artist`, `title`], tracks);
        })
        .catch(error => console.error(error));
};