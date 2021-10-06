import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const ALBUM = `https://api.deezer.com/album/`;
const TRACK = `https://api.deezer.com/track/`;

export const album = async () => {
    let id = 10000000 + Math.floor(Math.random() * 1000000);

    console.log(`Try fetch ${CORS + ALBUM + id}`);

    let album = await fetch(CORS + ALBUM + id).then(response => response.json()).catch(error => console.error(error));

    let tracks = [];

    for (let track of album.tracks.data) {
        console.log(`Try fetch ${CORS + TRACK + track.id}`);

        fetch(CORS + TRACK + id)
            .then(response => response.json())
            .then(json => {
                let track = Track.parse(json);
                tracks.push(track);
            })
            .catch(error => console.error(error));
    }

    return new Tour(`Album: ${album.title}`, `Guess the titles from album "${album.title}".`, 60000, `white`, `black`, [`title`], tracks);
};