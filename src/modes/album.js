import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {promisify} from "../utils/utils.js";

export const album = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(
        `/album/${id}`,
        (album) => {
            if (album !== null && album.hasOwnProperty(`error`)) {
                reject(album);
                return;
            }
            resolve(
                new Tour(
                    `Album`,
                    `Guess the titles from album "${album.title}".`,
                    60000,
                    `#F5EEC2`,
                    `#416A59`,
                    [`title`],
                    album.tracks.data
                        .slice(0, 10) //TODO
                        .map(json => Track.parse(json))
                )
            );
        }
    );

    return promise;
};