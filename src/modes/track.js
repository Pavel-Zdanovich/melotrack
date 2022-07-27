import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {promisify} from "../utils/utils.js";

const letters = '0123456789ABCDEF';

const randomColor = () => {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const track = async (ids) => {
    const [promise, resolve, reject] = promisify();

    const tracks = [];
    for (let id of ids) {
        tracks.push(
            new Promise(
                (resolve, reject) => {
                    DZ.api(`/track/${id}`, (track) => {
                            if (track !== null && track.hasOwnProperty(`error`)) {
                                reject(track);
                                return;
                            }
                            resolve(Track.parse(track));
                        }
                    );
                }
            )
        );
    }

    Promise.all(tracks).then(tracks => {
        resolve(
            new Tour(
                `Track`,
                `Guess random artists and titles.`,
                60000,
                randomColor(),
                randomColor(),
                [`artist`, `title`],
                tracks
            )
        );
    }, error => reject(error));

    return promise;
};