import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {promisify} from "../utils/utils.js";

export const genre = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/genre/${id}`, (playlist) => {
        if (playlist !== null && playlist.hasOwnProperty(`error`)) {
            reject(playlist);
            return;
        }
        resolve(
            new Tour(
                `Genre`,
                `Guess the artists and titles from genre "${playlist.title}".`,
                60000,
                `#F2F2F2`,
                `#2B6777`,
                [`artist`, `title`],
                playlist.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });

    return promise;
};