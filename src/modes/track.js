import {Track} from "../entities/track.js";
import {Tour} from "../entities/tour.js";

const letters = '0123456789ABCDEF';

const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const CORS = `https://cors-anywhere.herokuapp.com/`;
const TRACK = `https://api.deezer.com/track/`;

export const track = (data, markProgressBy) => {
    const tracks = [];
    for (let i = 0; i < 10; i++) {
        const id = data.tracks[Math.floor(Math.random() * 1000000)];
        fetch(CORS + TRACK + id)
            .then(response => {
                markProgressBy(5);
                return response.json();
            })
            .then(json => {
                markProgressBy(5);
                const track = Track.parse(json);
                tracks.push(track);
            })
            .catch(error => console.error(error));
    }
    return new Tour(`Random`, `Guess random artists and titles.`, 60000, randomColor(), randomColor(), [`artist`, `title`], tracks);
};