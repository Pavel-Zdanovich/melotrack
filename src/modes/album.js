import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const ALBUM = `https://api.deezer.com/album/`;

export const album = (data, markProgressBy) => {
    markProgressBy(15);
    const id = data.albums[Math.floor(Math.random() * 139)];
    return fetch(CORS + ALBUM + id)
        .then(response => {
            markProgressBy(25);
            return response.json();
        })
        .then(album => {
            markProgressBy(25);
            const tracks = album.tracks.data.splice(0, 10).map(track => Track.parse(track));
            markProgressBy(35);
            return new Tour(`Album`, `Guess the titles from album "${album.title}".`, 60000, `white`, `black`, [`title`], tracks);
        })
        .catch(error => console.error(error));
};