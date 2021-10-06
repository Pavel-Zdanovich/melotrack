import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const ALBUM = `https://api.deezer.com/album/`;
const TRACK = `https://api.deezer.com/track/`;

export const album = async () => {
    const items = [`6394998`];

    const id = items[Math.floor(Math.random() * items.length)];

    console.log(`Try fetch ${CORS + ALBUM + id}`);

    const album = await fetch(CORS + ALBUM + id).then(response => response.json()).catch(error => console.error(error));

    const tracks = album.tracks.data.map(track => Track.parse(track));

    return new Tour(`Album: ${album.title}`, `Guess the titles from album "${album.title}".`, 60000, `white`, `black`, [`title`], tracks);
};