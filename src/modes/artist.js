import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const ARTIST = `https://api.deezer.com/artist/`;
const TRACK = `https://api.deezer.com/track/`;

export const artist = async () => {
    const id = Math.floor(Math.random() * 10);

    return fetch(CORS + ARTIST + id)
        .then(response => response.json())
        .then(artist => fetch(artist.tracklist))
        .then(response => response.json())
        .then(data => {
            const tracks = [];

            for (let track of data) {
                fetch(CORS + TRACK + id)
                    .then(response => response.json())
                    .then(json => {
                        const track = Track.parse(json);
                        tracks.push(track);
                    })
                    .catch(error => console.error(error));
            }

            return new Tour(`Artist`, `Guess the titles by "${artist.name}".`, 60000, `black`, `white`, [`title`], tracks);
        })
        .catch(error => console.error(error));
};