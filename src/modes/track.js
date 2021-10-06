import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {spinner} from "../utils/spinner.js";

const letters = '0123456789ABCDEF';

const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const track = (DZ, data) => {
    spinner.start();
    const ids = [];
    const tracks = [];
    for (let i = 0; i < 10; i++) {
        let id = data.tracks[Math.floor(Math.random() * data.tracks.length)];
        while (ids.includes(id)) {
            id = data.tracks[Math.floor(Math.random() * data.tracks.length)];
        }
        ids.push(id);
        tracks.push(
            new Promise((resolve) => {
                DZ.api(`/track/${id}`, (track) => {
                    spinner.markProgressBy(10);
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
    promise.then(() => spinner.stop());
    Promise.all(tracks).then((tracks) => {
        outsideResolve(
            new Tour(
                `Random`,
                `Guess random artists and titles.`,
                60000,
                randomColor(),
                randomColor(),
                [`artist`, `title`],
                tracks
            )
        );
    });
    return promise;
};