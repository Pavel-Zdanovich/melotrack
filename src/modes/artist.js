import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {promisify} from "../utils/utils.js";

export const artist = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/artist/${id}`, (artist) => {
        if (artist !== null && artist.hasOwnProperty(`error`)) {
            reject(artist);
            return;
        }
        DZ.api(`/artist/${id}/top?limit=10`, (tracklist) => {
            if (tracklist !== null && tracklist.hasOwnProperty(`error`)) {
                reject(tracklist);
                return;
            }
            resolve(
                new Tour(
                    `Artist`,
                    `Guess the titles by "${artist.name}".`,
                    60000,
                    `#E4DDF4`,
                    `#2D2D2D`,
                    [`title`],
                    tracklist.data
                        .slice(0, 10) //TODO
                        .map(json => Track.parse(json))
                )
            );
        });
    });

    return promise;
};