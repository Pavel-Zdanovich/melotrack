import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {image, promisify} from "../utils/utils.js";

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

            const descriptionElement = document.createElement(`div`);
            const containerElement = document.createElement(`div`);
            const imageElement = image(artist.picture_big);
            containerElement.appendChild(imageElement);
            descriptionElement.appendChild(containerElement);
            descriptionElement.innerHTML = descriptionElement.innerHTML + `Guess the titles by "${artist.name}".`;

            resolve(
                new Tour(
                    `Artist`,
                    descriptionElement.innerHTML,
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