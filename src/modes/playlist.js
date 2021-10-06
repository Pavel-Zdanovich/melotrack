import {Tour} from "../entities/tour.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const PLAYLIST = `https://api.deezer.com/playlist/`;

export const playlist = (data, markProgressBy) => {
    markProgressBy(15);
    const id = data.playlists[Math.floor(Math.random() * 150)];

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