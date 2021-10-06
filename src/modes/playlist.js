import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const PLAYLIST = `https://api.deezer.com/playlist/`;

export const playlist = async () => {
    const id = 10000000 + Math.floor(Math.random() * 1000000);

    return fetch(CORS + PLAYLIST + id)
        .then(response => response.json())
        .then(playlist => new Tour(`Playlist: ${playlist.title}`, `Guess the artists and titles from playlist "${playlist.title}".`, 60000, `yellow`, `green`, [`artist`, `title`], playlist.tracks.data))
        .catch(error => console.error(error));
};