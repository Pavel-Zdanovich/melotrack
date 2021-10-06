import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const CHART = `https://api.deezer.com/chart`;

export const chart = async () => {
    console.log(`Try fetch ${CORS + CHART}`);

    const tracks = await fetch(CORS + CHART)
        .then(response => response.json())
        .then(json => json.tracks.data)
        .catch(error => console.error(error));

    return new Tour(`Chart`, `Guess the artists and titles from chart.`, 60000, `red`, `blue`, [`artist`, `title`], tracks);
};