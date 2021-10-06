import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const CORS = `https://cors-anywhere.herokuapp.com/`;
const ARTIST = `https://api.deezer.com/artist/`;
const TRACK = `https://api.deezer.com/track/`;

export const artist = async () => {
    const id = Math.floor(Math.random() * 10);

    console.log(`Try fetch ${CORS + ARTIST + id}`);

    const artist = await fetch(CORS + ARTIST + id).then(response => response.json()).catch(error => console.error(error));

    console.log(artist);

    const data = await fetch(artist.tracklist).then(response => response.json()).catch(error => console.error(error));

    const tracks = [];

    for (let track of data) {
        console.log(`Try fetch ${CORS + TRACK + track.id}`);

        fetch(CORS + TRACK + id)
            .then(response => response.json())
            .then(json => {
                const track = Track.parse(json);
                tracks.push(track);
            })
            .catch(error => console.error(error));
    }

    return new Tour(`Artist: ${artist.name}`, `Guess the titles by "${artist.name}".`, 60000, `black`, `white`, [`title`], tracks);
};