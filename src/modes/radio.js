import {Tour} from "../entities/tour.js";
import {Track} from "../entities/track.js";
import {image, promisify} from "../utils/utils.js";

export const radio = async (id) => {
    const [promise, resolve, reject] = promisify();

    DZ.api(`/radio/${id}`, (radio) => {
        if (radio !== null && radio.hasOwnProperty(`error`)) {
            reject(radio);
            return;
        }

        DZ.api(`/radio/${id}/tracks`, (tracks) => {
            if (tracks !== null && tracks.hasOwnProperty(`error`)) {
                reject(tracks);
                return;
            }

            const descriptionElement = document.createElement(`div`);
            const containerElement = document.createElement(`div`);
            const imageElement = image(radio.picture_big);
            containerElement.appendChild(imageElement);
            descriptionElement.appendChild(containerElement);
            descriptionElement.innerHTML = descriptionElement.innerHTML + `Guess the artists and titles from radio "${radio.title}".`;

            resolve(
                new Tour(
                    `Radio`,
                    descriptionElement.innerHTML,
                    60000,
                    `#F3F3F3`,
                    `#932432`,
                    [`artist`, `title`],
                    tracks.data
                        .slice(0, 10) //TODO
                        .map(json => Track.parse(json))
                )
            );
        });
    });

    return promise;
};