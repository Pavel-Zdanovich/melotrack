import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const PLAYLIST = `https://api.deezer.com/genre/`;

export const genre = (data, markProgressBy) => {
    markProgressBy(15);
    const id = 10000000 + Math.floor(Math.random() * 1000000);

    return fetch(CORS + PLAYLIST + id)
        .then(response => {
            markProgressBy(35);
            return response.json();
        })
        .then(playlist => {
            markProgressBy(50);
            return new Tour(`Playlist`, `Guess the artists and titles from playlist "${playlist.title}".`, 60000, `yellow`, `green`, [`artist`, `title`], playlist.tracks.data);
        })
        .catch(error => console.error(error));
};