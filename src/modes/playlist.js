import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {image, promisify} from "../utils/utils.js";

export const playlist = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/playlist/${id}`, (playlist) => {
        if (playlist !== null && playlist.hasOwnProperty(`error`)) {
            reject(playlist);
            return;
        }

        const descriptionElement = document.createElement(`div`);
        const containerElement = document.createElement(`div`);
        const imageElement = image(playlist.picture_big);
        containerElement.appendChild(imageElement);
        descriptionElement.appendChild(containerElement);
        descriptionElement.innerHTML = descriptionElement.innerHTML + `Guess the artists and titles from playlist "${playlist.title}".`;

        resolve(
            new Tour(
                `Playlist`,
                descriptionElement.innerHTML,
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