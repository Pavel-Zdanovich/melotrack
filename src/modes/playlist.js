import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {promisify} from "../utils/utils.js";

export const playlist = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/playlist/${id}`, (playlist) => {
        if (playlist !== null && playlist.hasOwnProperty(`error`)) {
            reject(playlist);
            return;
        }
        resolve(
            new Tour(
                `Playlist`,
                `Guess the artists and titles from playlist "${playlist.title}".`,
                60000,
                `#FAE5DF`,
                `#303179`,
                [`artist`, `title`],
                playlist.tracks.data
                    .slice(0, 10) //TODO
                    .map(json => Track.parse(json))
            )
        );
    });

    return promise;
};