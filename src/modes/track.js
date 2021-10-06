import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";

const letters = '0123456789ABCDEF';

const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const track = (DZ, data, markProgressBy) => {
    const tracks = [];
    for (let i = 0; i < 10; i++) {
        const id = data.tracks[Math.floor(Math.random() * data.tracks.length)]; //TODO get a unique set
        tracks.push(
            new Promise((resolve) => {
                DZ.api(`/track/${id}`, (track) => {
                    markProgressBy(10);
                    resolve(Track.parse(track));
                });
            })
        );

    }
    let outsideResolve, outsideReject;
    const promise = new Promise((resolve, reject) => {
        outsideResolve = resolve;
        outsideReject = reject;
    });
    Promise.all(tracks).then((tracks) => {
        console.log(tracks);
        outsideResolve(new Tour(`Random`, `Guess random artists and titles.`, 60000, randomColor(), randomColor(), [`artist`, `title`], tracks));
    });
    return promise;
};