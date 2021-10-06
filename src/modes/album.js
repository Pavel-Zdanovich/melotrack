import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const ALBUM = `https://api.deezer.com/album/`;

export const album = () => {
    const id = 10000000 + Math.floor(Math.random() * 1000000);

    return fetch(CORS + ALBUM + id)
        .then(response => response.json())
        .then(album => {
            const tracks = album.tracks.data.map(track => Track.parse(track));
            return new Tour(`Album: ${album.title}`, `Guess the titles from album "${album.title}".`, 60000, `white`, `black`, [`title`], tracks);
        })
        .catch(error => console.error(error));
};